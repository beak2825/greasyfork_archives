// ==UserScript==
// @name         Itsnotlupus' Tiny Utilities
// @namespace    Itsnotlupus Industries
// @version      1.27.1
// @description  small utilities that I'm tired of digging from old scripts to put in new ones.
// @author       Itsnotlupus
// @license      MIT
// ==/UserScript==

/* jshint esversion:11 */
/* jshint -W138 */

/** DOM queries - CSS selectors and XPath */
const $ = (q,d=document)=>d.querySelector(q);
const $$ = (q,d=document)=>d.querySelectorAll(q);
const $$$ = (q,d=document,x=d.evaluate(q,d),a=[],n=x.iterateNext()) => n ? (a.push(n), $$$(q,d,x,a)) : a;

/** calls a function whenever the DOM changes */
const observeDOM = (fn, e=document, config = { attributes: 1, childList: 1, subtree: 1 }, o = new MutationObserver(fn)) => (o.observe(e,config),()=>o.disconnect());

/** check a condition upfront, and on every DOM change until true */
const untilDOM = async (v, e=document, f=v.sup?()=>$(v,e):v) => f() || new Promise((r,_,d = observeDOM(() => (_=f()) && d() | r(_), e)) => 0);

/** promisify setTimeout and setInterval */
const sleep = (w = 100) => new Promise(r=>setTimeout(r, w));
const until = async (v, w=100, t, f=v.sup?()=>$(v):v) => f() || new Promise(r => t=setInterval((s=f()) => s && (clearInterval(t), r(s)), w));

/** slightly less painful syntax to create DOM trees */
const crel = (name, attrs, ...children) => ((e = Object.assign(document.createElement(name), attrs)) => (children.length && e.append(...children), e))();

/** same, for SVG content. */
const svg = (name, attrs={}, ...children) => ((e=document.createElementNS('http://www.w3.org/2000/svg', name), _=Object.keys(attrs).forEach(k=>e.setAttribute(k,attrs[k])),__=children.length && e.append(...children)) => e)();

/** create a shadow dom with an isolated stylesheet. tbh you're better off just creating a custom element. */
const custom = (name, css, dom, e = crel(name), ss = e.attachShadow({mode:'closed'}), s = new CSSStyleSheet(), t = ss.adoptedStyleSheets = [ (s.replaceSync(css),s) ], u = dom.length && ss.append(...dom)) => e;

/** add a stylesheet */
const addStyles = async css => (await untilDOM('head')).append(crel('style', { type: 'text/css', textContent: css }));

/** decode HTML entities in a string */
const decodeEntities = str => crel('textarea', { innerHTML: str }).value;

/** stolen from https://gist.github.com/nmsdvid/8807205 */
const slowDebounce = (a,b=250,c=0)=>(...d)=>clearTimeout(c,c=setTimeout(a,b,...d));

/** microtask debounce */
const fastDebounce = (f, l, s=0) => async (...a) => (l = a, !s && (await (s=1), s = 0, f(...l)));

/** remember and shortcut what a (pure) function returns */
const memoize = (f, mkKey=args=>args.join(), cache = Object.create(null)) => (...args) => cache[mkKey(args)] ??= f(...args);

/** given an acyclic graph `obj`, visit every node recursively, depth first. 
 *  call fn(obj[key], obj, key) on every non-root node. If fn returns `false`, don't traverse that section further. */
const traverse = (obj, fn) => obj && typeof obj == 'object' && Object.keys(obj).forEach(key => fn(obj[key], obj, key) !== false && traverse(obj[key], fn) );

/** requestAnimationFrame wrapper that allows a callback to request another run without referencing itself 
 * Use as: 
 * rAF((time, next) => {
 *   // cool animation code goes here.
 *   next(); // run again next frame
 * });
 */
const rAF = (f, n=t=>f(t,r), r=_=>requestAnimationFrame(n)) => r();

/** define a few event listeners in one shot - call the returned function to remove them. */
const events = (o, t=window, opts, f=op=>Object.keys(o).forEach(e=>t[op](e,o[e],opts))) => (f("addEventListener"), () => f("removeEventListener"));

/** insta-drag handler. just add callbacks. */
function makeDraggable(elt, update, init=update, final=()=>{}) {
  return events({
    pointerdown(e) { elt.setPointerCapture(e.pointerId, e.preventDefault(init(e))) },
    pointermove(e) { elt.hasPointerCapture(e.pointerId) && update(e) },
    pointerup(e) { elt.releasePointerCapture(e.pointerId, final(e)) }
  }, elt, true);
}

/** promisify a @grant-less XHR. probably useless. */
const xhr = (url, type='') => new Promise((r,e,x=Object.assign(new XMLHttpRequest(), {responseType: type,onload() { r(x.response); },onerror:e}),_=x.open('GET',url)) => x.send());

/** fetch and parse */
const fetchDOM = (url, mimeType) => fetch(url).then(r=>r.text()).then(t=>new DOMParser().parseFromString(t,mimeType));
const fetchHTML = url => fetchDOM(url, 'text/html');
const fetchJSON = url => fetch(url).then(r=>r.json());

/** Prefetch a URL */
const prefetch = url => document.head.append(crel('link', { rel: 'prefetch', href: url }));

/** Some sites break the `console` API. This attempts to restore a working console object. */
const fixConsole = (i=crel('iframe',{style:'display:none'}),_=document.body.append(i),c=unsafeWindow.console) => console.log.name!='log' ? (unsafeWindow.console = i.contentWindow.console,()=>(i.remove(),unsafeWindow.console=c)):()=>{};

/** Another take on logging */
let logger = console;
/** a cheap way to get logs to show up on sites that damaged their console.log */
async function withLogs(f) {
  if (logger.log.name == 'log') return await f();
  const iframe=crel('iframe', { style: 'display:none' });
  document.body.append(iframe);
  const prevLogger = logger;
  logger = iframe.contentWindow.console;
  try {
    return await f();
  } finally {
    iframe.remove();
    logger = prevLogger;
  }
}
const logg = (type, color={log:'#ccf',warn:'#fcf',error:'#fcc'}[type]) => (msg, ...args) => logger[type](`%c ${GM_info.script.name}: ${msg}`, 'font-weight:600;color:${color};background:#114;padding:.2em', ...args);
const log = logg('log');
const warn = logg('warn');
const error = logg('error');

const logGroup = (msg, ...args) => {
  logger.groupCollapsed(`%c ${GM_info.script.name}: ${msg}`, 'font-weight:600;color:#ccf;background:#114;padding:.2em');
  args.forEach(arg=>Array.isArray(arg)?logger.log(...arg):logger.log(arg));
  logger.groupEnd();
};
