// ==UserScript==
// @name        Ficbook Load Typos
// @description Панель ошибок публичной беты. В разработке.
// @namespace   *
// @include     https://ficbook.net/home/typos
// @include     https://ficbook.net/readfic/*/*
// @version     0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21695/Ficbook%20Load%20Typos.user.js
// @updateURL https://update.greasyfork.org/scripts/21695/Ficbook%20Load%20Typos.meta.js
// ==/UserScript==
logdone = function (e) {
  console.log(e);
  toastr.success(e)
};
log = function (e) {
  console.info(e);
  toastr.info(e)
};
typoLoadThreads = 1;
typosPage = 0;
typosIds = [
];
typosData = [
];
typosNumber = typosData.length;
//////////////////////////////////
function loadTyposPage() {
  typosPage++;
  $.get('https://ficbook.net/home/typos?p=' + typosPage, onTyposPageLoad);
}
function onTyposPageLoad(data) {
  d = data; // !!!
  log('Loaded typos page ' + typosPage);
  var m = data.match(/(\d+)(?=" title="Перейти к проверке и редактированию части">)/g);
  if (m)
  m.forEach(function (e) {
    typosIds.push(e)
  });
  log('Addded ' + (m ? m.length : 0) + ' typos id\'s');
  if (data.match(/<li>\s<a href="[^"]*" aria-label="Следующая">/)) //!!!
  loadTyposPage();
   else {
    logdone('All typos pages loaded<br>' + typosIds.length + ' typos ID\'s found.');
    afterLoadTyposPage();
  }
}
function afterLoadTyposPage() {
  typosNumber = typosIds.length;
  if (typoLoadThreads > typosNumber) typoLoadThreads = typosNumber;
  logdone('Loading typos with ' + typoLoadThreads + ' threads');
  for (var i = 0; i < typoLoadThreads; i++) {
    loadTypoPage();
  }
} //////////////////////////////////
////////////////////////////////////////////////////////////////

function Typo(data) {
  var rfic = />Фанфик<.label>\s*<div[^>]*>\s*<a href=".readfic.(\d+).(\d+)">([^<]*)</;
  var rerr = /<span id="betaSelection" hidden>([^^]*?)<\/span>\s*<span id="betaContext">([^^]*?)<\/span>\s*<br>\s*<button/;
  var rby = /<a href="\/authors\/\d*">([^<]*?)<\/a>\s*:\s([\w\W]*?)<\/div>/;
  var rid = /<input type="hidden" name="part_id" value="(\d*)">\s*<input type="hidden" name="typo_id" value="(\d*)">/;
  var mfic = data.match(rfic);
  var merr = data.match(rerr);
  var mby = data.match(rby);
  var mid = data.match(rid);
  this.fic = mfic ? mfic[1] : 'null';
  this.part = mfic ? mfic[2] : 'null';
  this.sel = merr ? merr[1] : 'null';
  this.cont = merr ? merr[2] : 'null';
  this.by = mby ? mby[1] : 'null';
  this.comm = mby ? mby[2] : 'null';
  this.part = mid ? mid[1] : 'null';
  this.typo = mid ? mid[2] : 'null';
} //Typo{fic,part,sel,cont,by,comm,typo}

function loadTypoPage() {
  var id = typosIds.shift();
  $.get('https://ficbook.net/home/typos/' + id, onTypoPageLoad);
}
function onTypoPageLoad(data) {
  d = data; // !!!
  typosData.push(new Typo(data));
  if (typosData.length < typosNumber) {
    var n = typosData.length,
    l = typosNumber;
    if (parseInt((n) / l * 10) - parseInt((n - 1) / l * 10)) log('Loading typos: ' + n + '/' + l + '<br>' + parseInt((n) / l * 100) + ' % done');
  }
  if (typosIds.length) {
    loadTypoPage()
  } else if (typosData.length == typosNumber) {
    logdone('All typos loaded<br>' + typosData.length + ' typos parsed.');
    afterLoadTypoPage();
  }
}
function afterLoadTypoPage() {
  saveLoadedTypos();
} //////////////////////////////////
////////////////////////////////////////////////////////////////

function saveLoadedTypos() {
  localStorage.setItem('typosData', JSON.stringify(typosData));
  logdone('Saved to localStorage<br>Typos number: ' + typosData.length);
}
function loadSavedTypos() {
  typosData = JSON.parse(localStorage.getItem('typosData') || '[]');
} //////////////////////////////////
////////////////////////////////////////////////////////////////

if (location.pathname == '/home/typos') {
  typoLoadThreads = + prompt('Загрузить ошибки?\nПотоков:', typoLoadThreads);
  if (typoLoadThreads > 0) {
    loadTyposPage();
    logdone('Typos will be loaded<br> with ' + typoLoadThreads + ' threads');
    logdone('started');
  }
} //Typo{fic,part,sel,cont,by,comm,typo}

window.DimavasTyposManeger = this;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   {
     'fic': '4422138',
     'part': '11915920',
     'sel': 'пришли в се',
     'cont': '...ам, которые наверняка уже &lt;span class="grammar_error"&gt;пришли в се&lt;/span&gt;бя. Появившись ...',
     'by': 'Dimava',
     'comm': 'пришли  в се\n',
     'typo': '18533617'
   },*/
partId = location.pathname.split('/').pop();
function b(t) {
  if (t.part != partId) return;
  var box = $('<div class="typoBox"/>').appendTo($('#typosPane'));
  box.data('typo', t);
  var data = box; //$('<div class="typoData"/>').appendTo(box);
  var cont = $('<div class="typoCont"/>').html(t.cont).appendTo(data);
  var sel = $('<div class="typoSel"/>').html(t.sel).appendTo(data);
  var comm = $('<div class="typoComm"/>').html(t.comm).appendTo(data);
  var by = $('<div class="typoBy"/>').html(t.by).appendTo(data);
  buts = box;
  var b1 = $('<button/>').html('find').appendTo(box);
  var b2 = $('<button/>').html('find2').appendTo(box);
  var b3 = $('<button/>').html('hide').appendTo(box);
  var b4 = $('<button/>').html('hide2').appendTo(box);
  function find() {
    var t = $(this).closest('.typoBox').data('typo');
    var s = t.cont.slice(3, - 3).replace(/([$*\-+.?\\\|\/(){}[\]])/g, '\\$1').replace(/<[^>]*>/g, '').replace(/\s+/g, '\\s*');
    var r = new RegExp(s);
    var l = $('<div/>').html(t.sel).text().length;
    console.log(t);
    console.log(s, l, r);
    var r = rangy.find(r, '.part_text');
    r.collapse(1);
    r.moveStart(30);
    r.moveEnd(l);
    r.show();
    rr = r;
  }
  b1.click(find);
  function find2() {
    $()
  }
  b2.click(find2);
  function hide() {
    $(this).closest('.typoBox').slideUp();
  }
  b3.click(hide);
  function remove() {
    $(this).closest('.typoBox').fadeOut();
  }
  b4.click(remove);
  function kick() {
  }
  function buff() {
  }
}
function f() {
  //style:
  $('<style/>').html('').appendTo($('head'));
  //
  var wrap = $('.container').css('width', '70%').css('float','left');
  var pane = $('<div id="typosPane">').insertAfter(wrap);
  typosData.forEach(b);
}
if ($('.part_text').length) {
  loadSavedTypos();
  $('<button/>').html('typos').click(f).insertAfter($('#partStart'));
  $('<style/>').html('#typosPane {  width: 30%;  height: 100vh;  overflow-y: scroll;  background-color: #322;  position: fixed;  top: 0;  right: 0;}#typosPane button {  width: 25%;}.typoBox {  margin: 5px;  background-color: #fff;  border: 3px solid azure;}.typoSel,.typoCont,.typoComm,.typoBy {  margin: 3px 5px;  padding: 5px;  2px;}.typoSel {  background-color: rgba(255, 0, 0, 0.2);}.typoCont {  background-color: rgba(255, 255, 0, 0.2);}.typoComm {  background-color: rgba(0, 255, 0, 0.2);}.typoBy {  background-color: rgba(0, 255, 255, 0.2);  text-align: right;}').appendTo($('head'));
}
console.log(rangy) //setTimeout(f, 99);
/*
   d[0].innerHTML=
   '<div class="box">'+a.context+'<hr>'+a.selected_text
   +'<hr>'+a.comment+'<hr>'+
   '<button>Подсветить</button>'+
   '<button>Править</button>'+
   '<button>Удалить</button>'+
   '</div>\
   '
   ;d[0].innerHTML+=d[0].innerHTML;d[0].innerHTML+=d[0].innerHTML;d[0].innerHTML+=d[0].innerHTML;d[0].innerHTML+=
   '<style>\
   .sel,.box{border:1px solid red;background-color:white}\
   .box{width:100%;}\
   .box:nth-child(2n) { background-color: #eee;}\
   </style>';0"Хорошо, я могу вас освободить"*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
rangy.toRange = function (e) {
  if (e == null) return null;
  var r = rangy.createRange();
  if (e instanceof r.constructor)
  return e;
  if (typeof (e) == 'string') e = jQuery(e);
  if (e.jquery) {
    var o = e[0];
    r.selectNode(o);
    return r;
  }
  return null;
};
rangy.find = function (e, w) {
  w = rangy.toRange(w || null);
  var r = rangy.createRange();
  //   if (typeof(e) == 'string' || e.exec || e.name && e.name == 'find') {
  r.findText(e, {
    withinRange: w
  });
  //   }
  return r;
};
rangy.set = function (r) {
  rangy.getSelection().setSingleRange(r);
};
rangy.selectJQuery = function (q) {
  if (typeof (q) == 'string')
  q = jQuery(q);
  var s = rangy.getSelection();
  q.each(function (i) {
    var r = rangy.createRange();
    r.selectNode(this);
    if (i) s.addRange(r);
     else s.setSingleRange(r);
  });
};
rangy.rangePrototype.show = function () {
  rangy.getSelection().setSingleRange(this);
};
