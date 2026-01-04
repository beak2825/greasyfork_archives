// ==UserScript==
// @name         GMLibrary
// @namespace    https://greasyfork.org/users/28298
// @version      1.6
// @description  GMLibary
// @author       Jerry
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @noframes
// @license      GNU GPLv3
// ==/UserScript==


// match violentmonkey supports * anywhere in url
// GM_notification requires macOS to turn on notification for browser
// https://violentmonkey.github.io/api/gm/
// https://www.tampermonkey.net/documentation.php?ext=dhdg

/**
 * Finds all elements in the entire page matching `selector`, even if they are in shadowRoots.
 * Just like `querySelectorAll`, but automatically expand on all child `shadowRoot` elements.
 * @see https://stackoverflow.com/a/71692555/2228771
 */
function querySelectorAllShadows(selector, el = document.body) {
  // recurse on childShadows
  const childShadows = Array.from(el.querySelectorAll('*')).
    map(el => el.shadowRoot).filter(Boolean);

  // console.log('[querySelectorAllShadows]', selector, el, `(${childShadows.length} shadowRoots)`);

  const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));
  
  // fuse all results into singular, flat array
  const result = Array.from(el.querySelectorAll(selector));
  return result.concat(childResults).flat();
}

function findx(xpath) {
  // e.g., findx('//select[@title="Results Per Page"]')
  // returns null if not found
  return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
}

function triggerevent(element,event) {
  // e.g., triggerevent (page,'change')
  let changeEvent = new Event(event);
  element.dispatchEvent(changeEvent);
}

function addbutton(text,func,top,left,width,height) {
    //top, left, [width[, height]] in px
    // e.g., width 100px, height 25px
    // https://stackoverflow.com/a/1535421/2292993
    if (window.top != window.self) {
        return;
    }   //don't run on frames or iframes

    let btn = document.createElement("button");
    btn.innerHTML = text;
    document.body.appendChild(btn);
    btn.addEventListener("click", func);

    btn.style.cssText = "border-radius: 5px; border:1px solid black; background-color:#D3D3D3; color:black";
    btn.style.position = 'absolute';
    btn.style.top = top+'px';
    btn.style.left = left+'px';
    if (width !== undefined) {btn.style.width = width+'px';}
    if (height !== undefined) {btn.style.height = height+'px';}
    console.log("top: " + top + 'px' + " left: " + left + 'px');
}

// must call with await in async function; otherwise not working
function asleep(ms) {
    // setTimeout(()=>{console.log("Sleeping...");},3000);
    console.log("Sleeping " + ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function hget (url) {
    // https://wiki.greasespot.net/GM.xmlHttpRequest
    // https://stackoverflow.com/a/65561572/2292993
    return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      // headers: {
      //   "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
      //   "Accept": "text/html"            // If not specified, browser defaults will be used.
      // },
      onload: function(response) {
        var responseXML = null;
        if (!response.responseXML) {
          responseXML = new DOMParser()
            .parseFromString(response.responseText, "text/html");
        } else {
          responseXML = response.responseXML;
        }
        resolve(responseXML);
        // console.log([
        //   response.status,
        //   response.statusText,
        //   response.readyState,
        //   response.responseHeaders,
        //   response.responseText,
        //   response.finalUrl,
        //   responseXML
        // ].join("\n"));
      },
      onerror: function(error) {
        reject(error);
      }
    });
    });
}


// https://github.com/zevero/simpleWebstorage
/*
Wonder how this works?
Storage is the Prototype of both localStorage and sessionStorage.
Got it?

localStorage.set('myKey',{a:[1,2,5], b: 'ok'}); //can set a json Object
localStorage.assign('myKey',{a:[6], c:42});     //shallow merge using Object.assign
localStorage.has('myKey');                      // --> true
localStorage.get('myKey');                      // --> {a:[6], b: 'ok', c:42}
localStorage.keys();                            // --> ['myKey']
localStorage.remove('myKey');                   // -

native:
localStorage.clear();
localStorage.length;
*/
Storage.prototype.set = function(key, obj) {
  var t = typeof obj;
  if (t==='undefined' || obj===null ) this.removeItem(key);
  this.setItem(key, (t==='object')?JSON.stringify(obj):obj);
  return obj;
};
Storage.prototype.get = function(key) {
  var obj = this.getItem(key);
  try {
     var j = JSON.parse(obj);
     if (j && typeof j === "object") return j;
   } catch (e) { }
   return obj;
};
Storage.prototype.assign = function(key, obj_merge) {
  var obj = this.get(key);
  if (typeof obj !== "object" || typeof obj_merge !== "object") return null;
  Object.assign(obj, obj_merge);
  return this.set(key,obj);
};

Storage.prototype.has = Storage.prototype.hasOwnProperty;
Storage.prototype.remove = Storage.prototype.removeItem;

Storage.prototype.keys = function() {
  return Object.keys(this.valueOf());
};


/* mousetrap v1.6.5 craig.is/killing/mice */
/*
https://github.com/ccampbell/mousetrap
By default all keyboard events will not fire if you are inside of a textarea, input, or select to prevent undesirable things from happening.
If you want them to fire you can add the class mousetrap to the element. <textarea name="message" class="mousetrap"></textarea>

Supported Keys
For modifier keys you can use shift, ctrl, alt, or meta.
You can substitute option for alt and command for meta.
Other special keys are backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home, left, up, right, down, ins, del, and plus.
Any other key you should be able to reference by name like a, /, $, *, or =.

Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');
  There is a third argument you can use to specify the type of event to listen for. It can be keypress, keydown or keyup.
  It is recommended that you leave this argument out if you are unsure. Mousetrap will look at the keys you are binding and determine whether it should default to keypress or keydown.

Mousetrap.bind(['command+k', 'ctrl+k'], function() {
    console.log('command k or control k');

    // return false to prevent default browser behavior
    // and stop event from bubbling
    return false;
});

Mousetrap.unbind
Mousetrap.trigger
Mousetrap.stopCallback
Mousetrap.reset
Mousetrap.handleKey
Mousetrap.addKeycodes
*/
(function(q,u,c){function v(a,b,g){a.addEventListener?a.addEventListener(b,g,!1):a.attachEvent("on"+b,g)}function z(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return n[a.which]?n[a.which]:r[a.which]?r[a.which]:String.fromCharCode(a.which).toLowerCase()}function F(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function A(a,b){var g,d=[];var e=a;"+"===e?e=["+"]:(e=e.replace(/\+{2}/g,"+plus"),e=e.split("+"));for(g=0;g<e.length;++g){var m=e[g];B[m]&&(m=B[m]);b&&"keypress"!=b&&C[m]&&(m=C[m],d.push("shift"));w(m)&&d.push(m)}e=m;g=b;if(!g){if(!p){p={};for(var c in n)95<c&&112>c||n.hasOwnProperty(c)&&(p[n[c]]=c)}g=p[e]?"keydown":"keypress"}"keypress"==g&&d.length&&(g="keydown");return{key:m,modifiers:d,action:g}}function D(a,b){return null===a||a===u?!1:a===b?!0:D(a.parentNode,b)}function d(a){function b(a){a=
a||{};var b=!1,l;for(l in p)a[l]?b=!0:p[l]=0;b||(x=!1)}function g(a,b,t,f,g,d){var l,E=[],h=t.type;if(!k._callbacks[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(l=0;l<k._callbacks[a].length;++l){var c=k._callbacks[a][l];if((f||!c.seq||p[c.seq]==c.level)&&h==c.action){var e;(e="keypress"==h&&!t.metaKey&&!t.ctrlKey)||(e=c.modifiers,e=b.sort().join(",")===e.sort().join(","));e&&(e=f&&c.seq==f&&c.level==d,(!f&&c.combo==g||e)&&k._callbacks[a].splice(l,1),E.push(c))}}return E}function c(a,b,c,f){k.stopCallback(b,
b.target||b.srcElement,c,f)||!1!==a(b,c)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=z(a);b&&("keyup"==a.type&&y===b?y=!1:k.handleKey(b,F(a),a))}function m(a,g,t,f){function h(c){return function(){x=c;++p[a];clearTimeout(q);q=setTimeout(b,1E3)}}function l(g){c(t,g,a);"keyup"!==f&&(y=z(g));setTimeout(b,10)}for(var d=p[a]=0;d<g.length;++d){var e=d+1===g.length?l:h(f||
A(g[d+1]).action);n(g[d],e,f,a,d)}}function n(a,b,c,f,d){k._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var e=a.split(" ");1<e.length?m(a,e,b,c):(c=A(a,c),k._callbacks[c.key]=k._callbacks[c.key]||[],g(c.key,c.modifiers,{type:c.action},f,a,d),k._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:d,combo:a}))}var k=this;a=a||u;if(!(k instanceof d))return new d(a);k.target=a;k._callbacks={};k._directMap={};var p={},q,y=!1,r=!1,x=!1;k._handleKey=function(a,
d,e){var f=g(a,d,e),h;d={};var k=0,l=!1;for(h=0;h<f.length;++h)f[h].seq&&(k=Math.max(k,f[h].level));for(h=0;h<f.length;++h)f[h].seq?f[h].level==k&&(l=!0,d[f[h].seq]=1,c(f[h].callback,e,f[h].combo,f[h].seq)):l||c(f[h].callback,e,f[h].combo);f="keypress"==e.type&&r;e.type!=x||w(a)||f||b(d);r=l&&"keydown"==e.type};k._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)n(a[d],b,c)};v(a,"keypress",e);v(a,"keydown",e);v(a,"keyup",e)}if(q){var n={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",
18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},r={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},C={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},B={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p;for(c=1;20>c;++c)n[111+c]="f"+c;for(c=0;9>=c;++c)n[c+96]=c.toString();d.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};d.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};d.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};d.prototype.reset=function(){this._callbacks={};
this._directMap={};return this};d.prototype.stopCallback=function(a,b){if(-1<(" "+b.className+" ").indexOf(" mousetrap ")||D(b,this.target))return!1;if("composedPath"in a&&"function"===typeof a.composedPath){var c=a.composedPath()[0];c!==a.target&&(b=c)}return"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};d.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};d.addKeycodes=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b]);p=null};
d.init=function(){var a=d(u),b;for(b in a)"_"!==b.charAt(0)&&(d[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};d.init();q.Mousetrap=d;"undefined"!==typeof module&&module.exports&&(module.exports=d);"function"===typeof define&&define.amd&&define(function(){return d})}})("undefined"!==typeof window?window:null,"undefined"!==typeof window?document:null);
