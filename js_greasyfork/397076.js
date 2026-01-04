// ==UserScript==
// @name        extraProperties Logger
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      -
// @description 2/29/2020, 12:10:56 PM
// @downloadURL https://update.greasyfork.org/scripts/397076/extraProperties%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/397076/extraProperties%20Logger.meta.js
// ==/UserScript==

setTimeout(()=> {
  const defaultWindowKeys = ["parent","opener","top","length","frames","closed","location","self","window","document","name","customElements","history","locationbar","menubar","personalbar","scrollbars","statusbar","toolbar","status","frameElement","navigator","origin","external","screen","innerWidth","innerHeight","scrollX","pageXOffset","scrollY","pageYOffset","visualViewport","screenX","screenY","outerWidth","outerHeight","devicePixelRatio","clientInformation","screenLeft","screenTop","defaultStatus","defaultstatus","styleMedia","onsearch","onwebkitanimationend","onwebkitanimationiteration","onwebkitanimationstart","onwebkittransitionend","isSecureContext","onabort","onblur","oncancel","oncanplay","oncanplaythrough","onchange","onclick","onclose","oncontextmenu","oncuechange","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","ondurationchange","onemptied","onended","onerror","onfocus","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onloadeddata","onloadedmetadata","onloadstart","onmousedown","onmouseenter","onmouseleave","onmousemove","onmouseout","onmouseover","onmouseup","onmousewheel","onpause","onplay","onplaying","onprogress","onratechange","onreset","onresize","onscroll","onseeked","onseeking","onselect","onstalled","onsubmit","onsuspend","ontimeupdate","ontoggle","onvolumechange","onwaiting","onwheel","onauxclick","ongotpointercapture","onlostpointercapture","onpointerdown","onpointermove","onpointerup","onpointercancel","onpointerover","onpointerout","onpointerenter","onpointerleave","onselectstart","onselectionchange","onanimationend","onanimationiteration","onanimationstart","ontransitionend","onafterprint","onbeforeprint","onbeforeunload","onhashchange","onlanguagechange","onmessage","onmessageerror","onoffline","ononline","onpagehide","onpageshow","onpopstate","onrejectionhandled","onstorage","onunhandledrejection","onunload","performance","stop","open","alert","confirm","prompt","print","queueMicrotask","requestAnimationFrame","cancelAnimationFrame","captureEvents","releaseEvents","requestIdleCallback","cancelIdleCallback","getComputedStyle","matchMedia","moveTo","moveBy","resizeTo","resizeBy","scroll","scrollTo","scrollBy","getSelection","find","webkitRequestAnimationFrame","webkitCancelAnimationFrame","fetch","btoa","atob","setTimeout","clearTimeout","setInterval","clearInterval","createImageBitmap","close","focus","blur","postMessage","onappinstalled","onbeforeinstallprompt","crypto","indexedDB","webkitStorageInfo","sessionStorage","localStorage","chrome","onformdata","onpointerrawupdate","speechSynthesis","webkitRequestFileSystem","webkitResolveLocalFileSystemURL","openDatabase","applicationCache","caches","ondevicemotion","ondeviceorientation","ondeviceorientationabsolute"]

  const defaultArrayKeys = ["length", "constructor", "concat", "copyWithin", "fill", "find", "findIndex", "lastIndexOf", "pop", "push", "reverse", "shift", "unshift", "slice", "sort", "splice", "includes", "indexOf", "join", "keys", "entries", "values", "forEach", "filter", "flat", "flatMap", "map", "every", "some", "reduce", "reduceRight", "toLocaleString", "toString"];

  const defaultObjectKeys = ["constructor", "__defineGetter__", "__defineSetter__", "hasOwnProperty", "__lookupGetter__", "__lookupSetter__", "isPrototypeOf", "propertyIsEnumerable", "toString", "valueOf", "__proto__", "toLocaleString"];
  
  
  
function logExtraProps(defaultProps, obj, objPropsName) {
  const extraProps = Object.getOwnPropertyNames(obj).filter(prop => !defaultProps.includes(prop));

  if (extraProps.length) {
    console.log("These extra "+ objPropsName +" are found:", extraProps);
  }

}

window.windowKeys = Object.keys(window);

function compareArrs(arr1, arr2) {
  const arr1unique = arr1.filter((e) => !arr2.includes(e));
  const arr2unique = arr2.filter((e) => !arr1.includes(e));
  return { arr1unique, arr2unique };
}

const { arr1unique: missingWindowKeys, arr2unique: extraWindowKeys } = compareArrs(defaultWindowKeys, windowKeys);

if (missingWindowKeys.length) {
  console.log("These default JS environment window properties are missing:", missingWindowKeys);
}

if (extraWindowKeys.length) {
  console.log("These extra JS environment window properties are found:", extraWindowKeys);
}

logExtraProps(defaultArrayKeys, Array.prototype, "Array methods");
logExtraProps(defaultObjectKeys, Object.prototype, "Object methods");

},5000)