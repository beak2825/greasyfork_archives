// ==UserScript==
// @name          Kaskus-Head-Scroller
// @namespace     http://userscripts.org/scripts/show/Kaskus-Head-Scroller
// @include       *.kaskus.co.id/*
// @version       0.1
// @dtversion     1404260001
// @timestamp     1398534731798
// @description   simple script do scroll to top at header (*.kaskus.co.id)
// @author        tuxie.forte;
// @license       (CC) by-nc-sa 3.0
//
// -!--latestupdate
//
// v0.1 - 2014-04-26
//  init
//
// -/!latestupdate---
//
//
//
// @downloadURL https://update.greasyfork.org/scripts/512/Kaskus-Head-Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/512/Kaskus-Head-Scroller.meta.js
// ==/UserScript==
//

(function(){
// Initialize Global Variables
var gvar=function() {};

/*
window.alert(new Date().getTime());
*/
//========-=-=-=-=--=========
gvar.__DEBUG__ = !1; // development
//========-=-=-=-=--=========



// =====
// START
function start_Main(){
  var $el = $D(gvar.target_selector);
  if( !$el ){
    clog('missing target node');
    return;
  }
  
  if( !gvar.is_mobile )
    $el = $el[0];
  else{
    GM_addGlobalStyle(rSRC.getMobCSS_patch(), 'patch_head', 1);

    if( $D('#mqr-content-wrapper') ){ // mqr already has something todo w/ design and event

    }
    else{
      GM_addGlobalStyle(rSRC.getMobCSS(), 'fixed_head', 1);

      Dom.Ev(window, 'scroll', function(){
        var nVScroll = document.documentElement.scrollTop || document.body.scrollTop,
          el_ = $D('#site-header');
        if( nVScroll > 0 ){
          !hasClass('fx', el_) && addClass('fx', el_);
        }
        else{
          removeClass('fx', el_);
        }
      });
    }
  }

  if( $el )
    _o('click', $el, function(e){
      var el = e.target||e;
      if(el && el.nodeName == 'A')
        return !1;

      nat_scrollTo(document.body, 0, 234);
    });
}



// -
// -
// -
// -
//========= 
// code below should adapting current QR Engine for this plugins works
// leave code below as wot it is, as long you know what todo
//========= Common Functions && Global Var Init ====
// static routine
function isDefined(x)   { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null; }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
function trimStr(x) { return (typeof(x)=='string' && x ? x.replace(/^\s+|\s+$/g,"") : '') };

function _o(m,e,f){Dom.Ev(e,m,function(e){typeof(f)=='function'?f(e):void(0)});}
function hasClass(cName, Obj){
  if(cName=="" || !cName) return;
  var re, cCls = (Obj.className ? Obj.className : '');
  if( !cCls )
    return !1;
  else{
    re = new RegExp('\\b'+cName+'\\b', "i");
    return re.test( cCls );
  }
}
function addClass(cName, Obj){
  if(cName=="") return;
  var neocls = (Obj.className ? Obj.className : '');
  if(neocls.indexOf(cName)!=-1) return;
  neocls+=(neocls!=''?' ':'')+cName;
  Obj.setAttribute('class', neocls);
}
function removeClass(cName, Obj){
  if(!cName || !Obj) return;
  var neocls, rmvclss = getAttr('class', Obj);
  neocls = getAttr('class', Obj);
  rmvclss = cName.split(' ');
  for(var i=0; i<rmvclss.length; ++i)
    neocls = neocls.replace(rmvclss[i], '');
  neocls = trimStr(neocls);
  setAttr('class', neocls, Obj);
}
function createTextEl(a) {
  return document.createTextNode(a)
}
function createEl(type, attrArray, html){
 var node = document.createElement(type);
 for (var attr in attrArray) 
   if (attrArray.hasOwnProperty(attr))
    node.setAttribute(attr, attrArray[attr]);
 if(html) node.innerHTML = html;
   return node;
}
function getAttr(name, Obj){
  if("string" === typeof name && "object" === typeof Obj && Obj)
    return Obj.getAttribute(name)||'';
  else
    return;
}
function setAttr(name, value, Obj){
  if("string" === typeof name && "object" === typeof Obj)
    return Obj.setAttribute(name, value);
}


var GM_addGlobalStyle = function (a, b, c) {
  var d, e;
  if (a.match(/^https?:\/\/.+/)) {
    d = createEl("link", { type: "text/css", rel:'stylesheet', href:a });
  }else{
    d = createEl("style", { type: "text/css" });
    d.appendChild(createTextEl(a));
  }
  if (isDefined(b) && isString(b)) d.setAttribute("id", b);
  if (isDefined(c) && c) {
    document.body.insertBefore(d, document.body.firstChild)
  } else {
    e = document.getElementsByTagName("head");
    if (isDefined(e[0]) && e[0].nodeName == "HEAD") gvar.$w.setTimeout(function () {
      e[0].appendChild(d)
    }, 100);
    else document.body.insertBefore(d, document.body.firstChild)
  }
  return d
};
// Get Elements
var $D = function (q, root, single) {
  if (root && typeof root == 'string') {
      root = $D(root, null, true);
      if (!root) { return null; }
  }
  if( !q ) return false;
  if ( typeof q == 'object') return q;
  root = root || document;
  if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
      if (single) { return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
      return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  }
  else if (q[0]=='.') { return root.getElementsByClassName(q.substr(1)); }
  else { return root.getElementById( (q[0]=='#' ? q.substr(1):q.substr(0)) ); }
  return root.getElementsByTagName(q);
};
// utk add - remove element
var Dom = {
  g: function(el) {
   if(!el) return false;
   return ( isString(el) ? document.getElementById(el) : el );
  },
  add: function(el, dest) {    
    var el = this.g(el);
    var dest = this.g(dest);
    if(el && dest) dest.appendChild(el);
  },
  remove: function(el) {
    var el = this.g(el);
    if(el && el.parentNode)
      el.parentNode.removeChild(el);
  },
  Ev: function() {
    if (window.addEventListener) {
      return function(el, type, fn, ph) {
        if(typeof(el)=='object')
         this.g(el).addEventListener(type, function(e){fn(e);}, (isUndefined(ph) ? false : ph));
      };      
    }else if (window.attachEvent) {
      return function(el, type, fn) {
        var f = function() { fn.call(this.g(el), window.event); };
        this.g(el).attachEvent('on' + type, f);
      };
    }
  }()
};

// native scrollTo
function nat_scrollTo(element, to, duration) {
  var start = element.scrollTop,
  change = to - start,
  currentTime = 0,
  increment = 20;

  var animateScroll = function(){        
    currentTime += increment;
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if(currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
};


var rSRC = {
  getMobCSS: function(){
    return ''
      +'#site-header.fx{ position:relative}'
      +'#site-header.fx #site-nav{ width:620px;position:fixed;top:0;z-index:99999}'
      +'#site-header.fx .main-h.r{margin-top:30px}'
    ;
  },
  getMobCSS_patch: function(){
    return ''
      +'#site-nav h1{ text-align:left}'
      +'#site-nav h1 > a{ display:inline-block; height:25px;}'
  ;
  }

};

// ----my ge-debug--------
function show_alert(msg, force) {
  if(arguments.callee.counter) { arguments.callee.counter++; } else { arguments.callee.counter=1; }
  GM_log('('+arguments.callee.counter+') '+msg);
  if(force==0) { return; }
}
function clog(msg) {
  if(!gvar.__DEBUG__) return;
  show_alert(msg);
}
// -end static
//=========


function init(){
  gvar.is_mobile = /^https?:\/\/m\.kaskus\./i.test(location.href);
  gvar.head_id_desktop = 'site-header';
  gvar.head_class_mobile = 'meta-header';

  gvar.target_selector = (gvar.is_mobile ? '#'+gvar.head_id_desktop : '.meta-header');


  start_Main();
}


// ------
init();
})()
/* tF. */
