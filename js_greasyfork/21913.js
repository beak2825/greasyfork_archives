function SingleRange(s, f) {
  this.l = 0; // left boundary
  this.r = s.length; // right boudary
  this.s = s; // text content
}
SingleRange.prototype = r1proto = {
  get text() {
    return this.s.substring(this.l, this.r);
  }
};
function DoubleRange(s1, s2, l1, l2, e1, e2, t) {
  this.type = t; // node type
  this.r1 = this.o = new SingleRange(s1);
  this.o.l = l1;
  this.o.r = e1;
  this.r2 = this.p = new SingleRange(s2);
  this.p.l = l2;
  this.p.r = e2;
  this.debug = true; //false;
  this.next = this.prev = null;
}
cdr = function createDoubleRange(a1, a2, a3, a4, a5, a6, a7) {
  var l = arguments.length;
  return new DoubleRange(a1, a2, l == 3 ? 0 : a3, l == 3 ? 0 : a4, l == 3 ? a1.length : l == 5 ? a3 : a5, l == 3 ? a2.length : l == 5 ? a4 : a6, l == 3 ? a3 : l == 5 ? a5 : a7);
};
DoubleRange.prototype = {
  toString: function () {
    return this.type + ' [' + this.o.l + '-' + this.o.r + ']&[' + this.p.l + '-' + this.p.r + ']:<' + this.o.text + (this.same ? '' : '>&<' + this.p.text) + '>';
  },
  get length() {
    return (this.o.r - this.o.l + this.p.r - this.p.l) / 2;
  },
  get lMin() {
    return Math.min(this.o.r - this.o.l, this.p.r - this.p.l);
  },
  get lMax() {
    return Math.max(this.o.r - this.o.l, this.p.r - this.p.l);
  },
  collapse: function collapse(toEnd) {
    this.o.r = this.o.l = toEnd ? this.o.r : this.o.l;
    this.p.r = this.p.l = toEnd ? this.p.r : this.p.l;
    return this;
  },
  get empty() {
    return this.o.l == this.o.r && this.p.l == this.p.s;
  },
  get collapsed() {
    return this.o.l == this.o.r || this.p.l == this.p.s;
  },
  get same() {
    return this.o.text == this.p.text;
  },
  get clone() {
    return new DoubleRange(this.o.s, this.p.s, this.o.l, this.p.l, this.o.r, this.p.r, this.type);
  },
  get canMoveRight() {
    return (!this.next || this.next.o.l > this.o.r && this.next.p.l > this.p.r) && this.o.r < this.o.s.length && this.p.r < this.p.s.length && this.o.s.charAt(this.o.r) == this.p.s.charAt(this.p.r);
  },
  get moveRight() {
    this.o.r++;
    this.p.r++;
    return this;
  },
  get canMoveLeft() {
    return (!this.prev || this.prev.o.r < this.o.l && this.prev.p.r < this.p.l) && this.o.l > 0 && this.p.l > 0 && this.o.s.charAt(this.o.l - 1) == this.p.s.charAt(this.p.l - 1);
  },
  get moveLeft() {
    this.o.l--;
    this.p.l--;
    return this;
  },
  expland: function () {
    while (this.canMoveRight) this.moveRight;
    while (this.canMoveLeft) this.moveLeft;
    return this;
  },
  get canShrinkLeft() {
    return !this.collapsed && this.o.s.charAt(this.o.l) == this.p.s.charAt(this.p.l);
  },
  get shrinkLeft() {
    this.o.l++;
    this.p.l++;
    return this;
  },
  get canShrinkRight() {
    return !this.collapsed && this.o.s.charAt(this.o.r - 1) == this.p.s.charAt(this.p.r - 1);
  },
  get shrinkRight() {
    this.o.r--;
    this.p.r--;
    return this;
  },
  canSplit: function (d) {
    var s = this.o.s.substr(this.o.l + d, 3),
    i,
    j;
    return this.lMin > 3 && this.lMax > d + 3 && (i = this.o.text.indexOf(s)) != - 1 && i == this.o.text.lastIndexOf(s) && (j = this.p.text.indexOf(s)) != - 1 && j == this.p.text.lastIndexOf(s);
  },
  split: function (d) {
    var c = this.next = this.clone;
    c.prev = this;
    this.next = c;
    var s = this.o.s.substr(this.o.l + d, 3),
    i = this.o.text.indexOf(s),
    j = this.p.text.indexOf(s);
    this.o.r = c.o.l += i + 1;
    this.p.r = c.p.l += j + 1;
    return c;
  },
  trySplit:function(d){
    if(!this.canSplit(d))return;
    var c = this.split(d+1);
    while (this.canShrinkRight) this.shrinkRight;
    while (c.canShrinkLeft) c.shrinkLeft;
    return c;
  }
};
function diff(s1, s2) {
   var r = cdr(s1, s2, 'diff');
   while (r.canShrinkLeft) r.shrinkLeft;
   var c = r,
       d;
   while (c) {
      for (var i = 0; i < 10; i++) {
         d = c.trySplit(i);
         if (d) break;
      }
      if (d) c = d;else break;
   }
   while (r.canShrinkRight) r.shrinkRight;
   return c;
}

function highlightTypo(text, edit) {
   console.log(text + '\n' + edit);
   var r = rangy.fastFind(text);
   var i = 0;
   var u = diff(text, edit);

   var n = r.extractContents().childNodes;
   var e = $('<span/>').append(n).addClass('typo-cont').attr('contenteditable', true);
   r.insertNode(e[0]);

   function highlightTypoEdit(typo) {
      if (typo.empty) return;
      var r = rangy.createRange();
      r.selectNodeContents(e[0]);
      r.collapse(1);
      r.moveStart(typo.o.l);
      r.moveEnd(typo.o.r - typo.o.l);
      var n = r.extractContents().childNodes;
      var p = $('<span/>').append(n);
      p.addClass('typo').attr('typo', typo.p.text);
      r.insertNode(p[0]);
   }

   while (u) {
      //noprotect
      highlightTypoEdit(u);
      u = u.prev;
   }
   return e; //rangy.toRange(e);
}

function styleTypo(e) {
   var id = 'typo' + Math.round(Math.random() * 99999);
   e.attr('id', id);
   var b = e.find('.typo');
   var s = $('<style/>').appendTo($('head'))[0];
   s.innerHTML = id + ':hover .typo::before,.typo:hover::before,' + id + ':active .typo::before,.typo:active::before,' + id + ':focus .typo::before,.typo:focus::before,.t::before{   top:' + (-e.height() + b.height()) + 'px;   border-top-width:' + (e.height() - b.height()) + 'px;}' + id + ':hover .typo::after,.typo:hover::after,' + id + ':active .typo::after,.typo:active::after,' + id + ':focus .typo::after,.typo:focus::after {   top:' + (-e.height() - b.height() + 4) + 'px;  }';
   return e;
}