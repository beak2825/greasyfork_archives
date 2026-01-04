// ==UserScript==
// @name         Eink mobile reading
// @namespace    https://greasyfork.org/zh-CN/users/8659-fc4soda
// @version      20220911
// @description  Disable animation, PageUp&PageDown, long-press ToTop&ToBottom, Increase&Decrease font size
// @description:zh-CN  禁用动画，上翻下翻，长按到顶到底，增大减小字号
// @author       fc4soda
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451091/Eink%20mobile%20reading.user.js
// @updateURL https://update.greasyfork.org/scripts/451091/Eink%20mobile%20reading.meta.js
// ==/UserScript==

const einkCtlClass = '8659-fc4soda-eink-reader';
const einkCtlClassMain = '8659-fc4soda-eink-reader-main';
const longPressDelay = "500";

(function () {
  /*
  1.禁用动画
  2.添加 PageUp PageDown 按钮
  3.长按可 ToTop ToBottom
  4.增大减小字号
  5.去除页面背景，正文加黑
  6.可自定义触控区，可显示触控区边界
  */
  'use strict';
  const pageUpBtn = newDiv(einkCtlClass, '', 'up', () => scrollPage('up'), (e) => longPressScroll(e, 'top'), 'red');
  const pageDownBtn = newDiv(einkCtlClass, '', 'down', () => scrollPage('down'), (e) => longPressScroll(e, 'bottom'), 'green');

  const zoomInBtn = newDiv(einkCtlClass, '', '+', () => zoomFont('in'), null, 'blue');
  const zoomOutBtn = newDiv(einkCtlClass, '', '-', () => zoomFont('out'), (e) => switchHide(e), 'orange');

})();

// return div from up to down, left to right
function newSchema(opt) {
  switch (opt) {
    case 'left':
      return
    case 'right':
      return
    default:
      return
  }
}

function newDiv(cla, text, opt, clickEvent, longPressEvent, color) {
  color = '';
  var div = document.createElement('div');
  div.classList.add(cla);
  div.innerHTML = text;
  div.style.backgroundColor = color;
  div.style.position = 'fixed';
  div.setAttribute('data-long-press-delay', longPressDelay);
  div.style.opacity = '0.5';
  div.style.border = 'black 1px dashed';
  div.style.color = 'black';
  div.style.zIndex = 999;
  div.style.cursor = 'pointer';
  div.style.boxSizing = 'border-box';
  div.style.userSelect = 'none';

  var width = 45, height = 40, top = 50;
  switch (opt) {
    case 'up':
      div.style.left = 0;
      div.style.top = sign(top);
      div.style.borderLeftWidth = 0;
      div.style.textAlign = 'left';
      break;
    case 'down':
      div.style.right = 0;
      div.style.top = sign(top);
      div.style.borderRightWidth = 0;
      div.style.textAlign = 'right';
      break;
    case '+':
      div.style.top = sign(height + top);
      width = 8;
      height = 5;
      div.style.left = sign(width);
      div.style.borderTopWidth = 0;
      div.style.borderLeftWidth = 0;
      break;
    case '-':
      div.style.top = sign(height + top);
      width = 8;
      height = 5;
      div.style.left = 0;
      div.style.borderTopWidth = 0;
      div.style.borderLeftWidth = 0;
      div.classList.add(einkCtlClassMain);
      break;
  }
  div.style.width = sign(width);
  div.style.height = sign(height);

  if (clickEvent !== null) {
    div.addEventListener("click", clickEvent, false);
  }

  if (longPressEvent !== null) {
    div.addEventListener('long-press', longPressEvent, false);
  }

  document.body.appendChild(div);
}

const hideStatusNone = 'none', hideStatusShow = '';
var hideStatus = hideStatusShow;

function switchHideStatus(){
    switch(hideStatus){
        case hideStatusShow:
          hideStatus = hideStatusNone;
        break;
        case hideStatusNone:
          hideStatus = hideStatusShow;
        break;
    }
}

function switchHide(e){
    e.preventDefault();
    let clas = document.getElementsByClassName(einkCtlClass);
    switchHideStatus();
    for(let i = 0; i<clas.length; i++){
        if(!clas[i].classList.contains(einkCtlClassMain)){
            clas[i].style.display = hideStatus;
        } else {
            let val = endWithUnit(clas[i].style.borderTopWidth, sizeUnitPx);
            clas[i].style.borderTopWidth = (1-val.size)+'px';
        }
    }
}

function sign(val) {
  return val + '%';
}

function longPressScroll(e, opt) {
  e.preventDefault();
  scrollPage(opt);
}

function scrollPage(opt) {
  const ydelta = .9;
  var y;
  switch (opt) {
    case 'up':
      y = window.scrollY - window.innerHeight * ydelta;
      break;
    case 'down':
      y = window.scrollY + window.innerHeight * ydelta;
      break;
    case 'top':
      y = 0;
      break;
    case 'bottom':
      y = document.body.scrollHeight;
      break;
  }
  window.scrollTo(0, y);
}

function zoomFont(opt) {
  var fontSizeRatio = .2;
  switch (opt) {
    case 'in':
      fontSizeRatio += 1;
      break;
    case 'out':
      fontSizeRatio = 1 - fontSizeRatio;
      break;
  }
  changeFontSize(document.body, fontSizeRatio);
}

function resetBtnFontSize(){
    // reset btn fontsize
    let clas = document.getElementsByClassName(einkCtlClass);
    for(let i = 0; i<clas.length; i++){
      clas[i].style.fontSize = '16px';
    }
}

const dataNewFontSize = "data-newFontSize";
function changeFontSize(element, fontSizeRatio) {
  const currentSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
  let r = getSize(currentSize);
  if (r.unit !== "") {
      element.setAttribute(dataNewFontSize, (r.size * fontSizeRatio) + r.unit);
    //element.style.fontSize = (r.size * fontSizeRatio) + r.unit;
    for (let i = 0; i < element.children.length; i++) {
      changeFontSize(element.children[i], fontSizeRatio);
    }
    for (let i = 0; i < element.children.length; i++) {
       // console.log(element.children[i].classList.contains(einkCtlClass))
        if(element.children[i].classList===undefined || !element.children[i].classList.contains(einkCtlClass)){
          let size = element.getAttribute(dataNewFontSize);
          element.style.fontSize = size;
        }
    }
  }
}

const defaultSize = 16;
const defaultSizeRatio = 0.2;
const sizeUnitPx = 'px';
const sizeUnitEm = 'em';
const sizeUnitRem = 'rem';
const sizeUnitPercent = '%';
const sizeMap = {
  /* <absolute-size> values */
  'xx-small': defaultSize * Math.pow(1 - defaultSizeRatio, 3),
  'x-small': defaultSize * Math.pow(1 - defaultSizeRatio, 2),
  'small': defaultSize * (1 - defaultSizeRatio),
  'medium': defaultSize,
  'large': defaultSize * (1 + defaultSizeRatio),
  'x-large': defaultSize * Math.pow(1 + defaultSizeRatio, 2),
  'xx-large': defaultSize * Math.pow(1 + defaultSizeRatio, 3),
  'xxx-large': defaultSize * Math.pow(1 + defaultSizeRatio, 4),
  /* <relative-size> values */
  'smaller': defaultSize * (1 - defaultSizeRatio),
  'larger': defaultSize * (1 + defaultSizeRatio),
  /* math value */
  'math': defaultSize,
  /* Global values */
  'initial': defaultSize,
  'unset': defaultSize,
  undefined: defaultSize,
}


function getSize(s) {
  if (sizeMap[s] !== undefined) {
    return { size: sizeMap[s], unit: sizeUnitPx };
  }
  switch (s) {
    /* Global values */
    case 'inherit': case 'revert': case 'revert-layer':
      return { size: 0, unit: "" };
  }
  /* <length> values */
  var arr = [sizeUnitPx, sizeUnitEm, sizeUnitRem];
  for (let i in arr) {
    let r = endWithUnit(s, arr[i]);
    let size = r.size, unit = r.unit;
    if (unit !== "") {
      return { size: size, unit: unit };
    }
  }
  /* <percentage> values */
  return parsePercent(s);
}

function parsePercent(s){
  if (s.endsWith(sizeUnitPercent)) {
    let size = parseFloat(s.replace(sizeUnitPercent, ""));
    return { size: size * defaultSize, unit: sizeUnitPx };
  }
  return { size: 0, unit: "" };
}

function endWithUnit(s, unit) {
  if (s.endsWith(unit)) {
    let size = parseFloat(s.replace(unit, ""))
    return { size: size, unit: unit };
  }
  return { size: 0, unit: "" };
}


/*!
 * long-press-event - v2.4.4
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!function (e, t) { "use strict"; var n = null, a = "PointerEvent" in e || e.navigator && "msPointerEnabled" in e.navigator, i = "ontouchstart" in e || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0, o = a ? "pointerdown" : i ? "touchstart" : "mousedown", r = a ? "pointerup" : i ? "touchend" : "mouseup", m = a ? "pointermove" : i ? "touchmove" : "mousemove", u = 0, s = 0, c = 10, l = 10; function v(e) { f(), e = function (e) { if (void 0 !== e.changedTouches) return e.changedTouches[0]; return e }(e), this.dispatchEvent(new CustomEvent("long-press", { bubbles: !0, cancelable: !0, detail: { clientX: e.clientX, clientY: e.clientY }, clientX: e.clientX, clientY: e.clientY, offsetX: e.offsetX, offsetY: e.offsetY, pageX: e.pageX, pageY: e.pageY, screenX: e.screenX, screenY: e.screenY })) || t.addEventListener("click", function e(n) { t.removeEventListener("click", e, !0), function (e) { e.stopImmediatePropagation(), e.preventDefault(), e.stopPropagation() }(n) }, !0) } function d(a) { f(a); var i = a.target, o = parseInt(function (e, n, a) { for (; e && e !== t.documentElement;) { var i = e.getAttribute(n); if (i) return i; e = e.parentNode } return a }(i, "data-long-press-delay", "1500"), 10); n = function (t, n) { if (!(e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame && e.mozCancelRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame)) return e.setTimeout(t, n); var a = (new Date).getTime(), i = {}, o = function () { (new Date).getTime() - a >= n ? t.call() : i.value = requestAnimFrame(o) }; return i.value = requestAnimFrame(o), i }(v.bind(i, a), o) } function f(t) { var a; (a = n) && (e.cancelAnimationFrame ? e.cancelAnimationFrame(a.value) : e.webkitCancelAnimationFrame ? e.webkitCancelAnimationFrame(a.value) : e.webkitCancelRequestAnimationFrame ? e.webkitCancelRequestAnimationFrame(a.value) : e.mozCancelRequestAnimationFrame ? e.mozCancelRequestAnimationFrame(a.value) : e.oCancelRequestAnimationFrame ? e.oCancelRequestAnimationFrame(a.value) : e.msCancelRequestAnimationFrame ? e.msCancelRequestAnimationFrame(a.value) : clearTimeout(a)), n = null } "function" != typeof e.CustomEvent && (e.CustomEvent = function (e, n) { n = n || { bubbles: !1, cancelable: !1, detail: void 0 }; var a = t.createEvent("CustomEvent"); return a.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), a }, e.CustomEvent.prototype = e.Event.prototype), e.requestAnimFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function (t) { e.setTimeout(t, 1e3 / 60) }, t.addEventListener(r, f, !0), t.addEventListener(m, function (e) { var t = Math.abs(u - e.clientX), n = Math.abs(s - e.clientY); (t >= c || n >= l) && f() }, !0), t.addEventListener("wheel", f, !0), t.addEventListener("scroll", f, !0), t.addEventListener(o, function (e) { u = e.clientX, s = e.clientY, d(e) }, !0) }(window, document);