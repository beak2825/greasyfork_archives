// ==UserScript==
// @name         易班考试（增强版，无限制）
// @namespace    http://tampermonkey.net/
// @license Common
// @version      1.0.0
// @description  理论上所有选择题考试都可以用，交流群：691977572。
// @author       木木的小迷弟
// @match        *.yooc.me/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yooc.me
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/477913/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%8C%E6%97%A0%E9%99%90%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477913/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%8C%E6%97%A0%E9%99%90%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    eval('!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.webpackLibrary=t():e.webpackLibrary=t()}(this,(()=>(()=>{"use strict";var e={218:(e,t,n)=>{function r(e,t){return function(){return e.apply(t,arguments)}}const{toString:o}=Object.prototype,{getPrototypeOf:i}=Object,s=(a=Object.create(null),e=>{const t=o.call(e);return a[t]||(a[t]=t.slice(8,-1).toLowerCase())});var a;const c=e=>(e=e.toLowerCase(),t=>s(t)===e),u=e=>t=>typeof t===e,{isArray:l}=Array,f=u("undefined"),d=c("ArrayBuffer"),p=u("string"),h=u("function"),m=u("number"),g=e=>null!==e&&"object"==typeof e,y=e=>{if("object"!==s(e))return!1;const t=i(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)},b=c("Date"),w=c("File"),E=c("Blob"),O=c("FileList"),S=c("URLSearchParams");function R(e,t,{allOwnKeys:n=!1}={}){if(null==e)return;let r,o;if("object"!=typeof e&&(e=[e]),l(e))for(r=0,o=e.length;r<o;r++)t.call(null,e[r],r,e);else{const o=n?Object.getOwnPropertyNames(e):Object.keys(e),i=o.length;let s;for(r=0;r<i;r++)s=o[r],t.call(null,e[s],s,e)}}function A(e,t){t=t.toLowerCase();const n=Object.keys(e);let r,o=n.length;for(;o-->0;)if(r=n[o],t===r.toLowerCase())return r;return null}const v="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:n.g,T=e=>!f(e)&&e!==v,j=(x="undefined"!=typeof Uint8Array&&i(Uint8Array),e=>x&&e instanceof x);var x;const N=c("HTMLFormElement"),C=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),P=c("RegExp"),_=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),r={};R(n,((n,o)=>{let i;!1!==(i=t(n,o,e))&&(r[o]=i||n)})),Object.defineProperties(e,r)},F="abcdefghijklmnopqrstuvwxyz",U="0123456789",D={DIGIT:U,ALPHA:F,ALPHA_DIGIT:F+F.toUpperCase()+U},L=c("AsyncFunction");var k={isArray:l,isArrayBuffer:d,isBuffer:function(e){return null!==e&&!f(e)&&null!==e.constructor&&!f(e.constructor)&&h(e.constructor.isBuffer)&&e.constructor.isBuffer(e)},isFormData:e=>{let t;return e&&("function"==typeof FormData&&e instanceof FormData||h(e.append)&&("formdata"===(t=s(e))||"object"===t&&h(e.toString)&&"[object FormData]"===e.toString()))},isArrayBufferView:function(e){let t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&d(e.buffer),t},isString:p,isNumber:m,isBoolean:e=>!0===e||!1===e,isObject:g,isPlainObject:y,isUndefined:f,isDate:b,isFile:w,isBlob:E,isRegExp:P,isFunction:h,isStream:e=>g(e)&&h(e.pipe),isURLSearchParams:S,isTypedArray:j,isFileList:O,forEach:R,merge:function e(){const{caseless:t}=T(this)&&this||{},n={},r=(r,o)=>{const i=t&&A(n,o)||o;y(n[i])&&y(r)?n[i]=e(n[i],r):y(r)?n[i]=e({},r):l(r)?n[i]=r.slice():n[i]=r};for(let e=0,t=arguments.length;e<t;e++)arguments[e]&&R(arguments[e],r);return n},extend:(e,t,n,{allOwnKeys:o}={})=>(R(t,((t,o)=>{n&&h(t)?e[o]=r(t,n):e[o]=t}),{allOwnKeys:o}),e),trim:e=>e.trim?e.trim():e.replace(/^[\\s\uFEFF\xA0]+|[\\s\uFEFF\xA0]+$/g,""),stripBOM:e=>(65279===e.charCodeAt(0)&&(e=e.slice(1)),e),inherits:(e,t,n,r)=>{e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},toFlatObject:(e,t,n,r)=>{let o,s,a;const c={};if(t=t||{},null==e)return t;do{for(o=Object.getOwnPropertyNames(e),s=o.length;s-->0;)a=o[s],r&&!r(a,e,t)||c[a]||(t[a]=e[a],c[a]=!0);e=!1!==n&&i(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:s,kindOfTest:c,endsWith:(e,t,n)=>{e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;const r=e.indexOf(t,n);return-1!==r&&r===n},toArray:e=>{if(!e)return null;if(l(e))return e;let t=e.length;if(!m(t))return null;const n=new Array(t);for(;t-->0;)n[t]=e[t];return n},forEachEntry:(e,t)=>{const n=(e&&e[Symbol.iterator]).call(e);let r;for(;(r=n.next())&&!r.done;){const n=r.value;t.call(e,n[0],n[1])}},matchAll:(e,t)=>{let n;const r=[];for(;null!==(n=e.exec(t));)r.push(n);return r},isHTMLForm:N,hasOwnProperty:C,hasOwnProp:C,reduceDescriptors:_,freezeMethods:e=>{_(e,((t,n)=>{if(h(e)&&-1!==["arguments","caller","callee"].indexOf(n))return!1;const r=e[n];h(r)&&(t.enumerable=!1,"writable"in t?t.writable=!1:t.set||(t.set=()=>{throw Error("Can not rewrite read-only method \'"+n+"\'")}))}))},toObjectSet:(e,t)=>{const n={},r=e=>{e.forEach((e=>{n[e]=!0}))};return l(e)?r(e):r(String(e).split(t)),n},toCamelCase:e=>e.toLowerCase().replace(/[-_\\s]([a-z\\d])(\\w*)/g,(function(e,t,n){return t.toUpperCase()+n})),noop:()=>{},toFiniteNumber:(e,t)=>(e=+e,Number.isFinite(e)?e:t),findKey:A,global:v,isContextDefined:T,ALPHABET:D,generateString:(e=16,t=D.ALPHA_DIGIT)=>{let n="";const{length:r}=t;for(;e--;)n+=t[Math.random()*r|0];return n},isSpecCompliantForm:function(e){return!!(e&&h(e.append)&&"FormData"===e[Symbol.toStringTag]&&e[Symbol.iterator])},toJSONObject:e=>{const t=new Array(10),n=(e,r)=>{if(g(e)){if(t.indexOf(e)>=0)return;if(!("toJSON"in e)){t[r]=e;const o=l(e)?[]:{};return R(e,((e,t)=>{const i=n(e,r+1);!f(i)&&(o[t]=i)})),t[r]=void 0,o}}return e};return n(e,0)},isAsyncFn:L,isThenable:e=>e&&(g(e)||h(e))&&h(e.then)&&h(e.catch)};function B(e,t,n,r,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack,this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o)}k.inherits(B,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:k.toJSONObject(this.config),code:this.code,status:this.response&&this.response.status?this.response.status:null}}});const I=B.prototype,M={};function q(e){return k.isPlainObject(e)||k.isArray(e)}function z(e){return k.endsWith(e,"[]")?e.slice(0,-2):e}function H(e,t,n){return e?e.concat(t).map((function(e,t){return e=z(e),!n&&t?"["+e+"]":e})).join(n?".":""):t}["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach((e=>{M[e]={value:e}})),Object.defineProperties(B,M),Object.defineProperty(I,"isAxiosError",{value:!0}),B.from=(e,t,n,r,o,i)=>{const s=Object.create(I);return k.toFlatObject(e,s,(function(e){return e!==Error.prototype}),(e=>"isAxiosError"!==e)),B.call(s,e.message,t,n,r,o),s.cause=e,s.name=e.name,i&&Object.assign(s,i),s};const J=k.toFlatObject(k,{},null,(function(e){return/^is[A-Z]/.test(e)}));function W(e,t,n){if(!k.isObject(e))throw new TypeError("target must be an object");t=t||new FormData;const r=(n=k.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,(function(e,t){return!k.isUndefined(t[e])}))).metaTokens,o=n.visitor||u,i=n.dots,s=n.indexes,a=(n.Blob||"undefined"!=typeof Blob&&Blob)&&k.isSpecCompliantForm(t);if(!k.isFunction(o))throw new TypeError("visitor must be a function");function c(e){if(null===e)return"";if(k.isDate(e))return e.toISOString();if(!a&&k.isBlob(e))throw new B("Blob is not supported. Use a Buffer instead.");return k.isArrayBuffer(e)||k.isTypedArray(e)?a&&"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}function u(e,n,o){let a=e;if(e&&!o&&"object"==typeof e)if(k.endsWith(n,"{}"))n=r?n:n.slice(0,-2),e=JSON.stringify(e);else if(k.isArray(e)&&function(e){return k.isArray(e)&&!e.some(q)}(e)||(k.isFileList(e)||k.endsWith(n,"[]"))&&(a=k.toArray(e)))return n=z(n),a.forEach((function(e,r){!k.isUndefined(e)&&null!==e&&t.append(!0===s?H([n],r,i):null===s?n:n+"[]",c(e))})),!1;return!!q(e)||(t.append(H(o,n,i),c(e)),!1)}const l=[],f=Object.assign(J,{defaultVisitor:u,convertValue:c,isVisitable:q});if(!k.isObject(e))throw new TypeError("data must be an object");return function e(n,r){if(!k.isUndefined(n)){if(-1!==l.indexOf(n))throw Error("Circular reference detected in "+r.join("."));l.push(n),k.forEach(n,(function(n,i){!0===(!(k.isUndefined(n)||null===n)&&o.call(t,n,k.isString(i)?i.trim():i,r,f))&&e(n,r?r.concat(i):[i])})),l.pop()}}(e),t}function K(e){const t={"!":"%21","\'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\\0"};return encodeURIComponent(e).replace(/[!\'()~]|%20|%00/g,(function(e){return t[e]}))}function V(e,t){this._pairs=[],e&&W(e,this,t)}const G=V.prototype;function $(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function Q(e,t,n){if(!t)return e;const r=n&&n.encode||$,o=n&&n.serialize;let i;if(i=o?o(t,n):k.isURLSearchParams(t)?t.toString():new V(t,n).toString(r),i){const t=e.indexOf("#");-1!==t&&(e=e.slice(0,t)),e+=(-1===e.indexOf("?")?"?":"&")+i}return e}G.append=function(e,t){this._pairs.push([e,t])},G.toString=function(e){const t=e?function(t){return e.call(this,t,K)}:K;return this._pairs.map((function(e){return t(e[0])+"="+t(e[1])}),"").join("&")};var X=class{constructor(){this.handlers=[]}use(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1}eject(e){this.handlers[e]&&(this.handlers[e]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(e){k.forEach(this.handlers,(function(t){null!==t&&e(t)}))}},Y={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},Z={isBrowser:!0,classes:{URLSearchParams:"undefined"!=typeof URLSearchParams?URLSearchParams:V,FormData:"undefined"!=typeof FormData?FormData:null,Blob:"undefined"!=typeof Blob?Blob:null},isStandardBrowserEnv:(()=>{let e;return("undefined"==typeof navigator||"ReactNative"!==(e=navigator.product)&&"NativeScript"!==e&&"NS"!==e)&&"undefined"!=typeof window&&"undefined"!=typeof document})(),isStandardBrowserWebWorkerEnv:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&"function"==typeof self.importScripts,protocols:["http","https","file","blob","url","data"]};function ee(e){function t(e,n,r,o){let i=e[o++];const s=Number.isFinite(+i),a=o>=e.length;return i=!i&&k.isArray(r)?r.length:i,a?(k.hasOwnProp(r,i)?r[i]=[r[i],n]:r[i]=n,!s):(r[i]&&k.isObject(r[i])||(r[i]=[]),t(e,n,r[i],o)&&k.isArray(r[i])&&(r[i]=function(e){const t={},n=Object.keys(e);let r;const o=n.length;let i;for(r=0;r<o;r++)i=n[r],t[i]=e[i];return t}(r[i])),!s)}if(k.isFormData(e)&&k.isFunction(e.entries)){const n={};return k.forEachEntry(e,((e,r)=>{t(function(e){return k.matchAll(/\\w+|\\[(\\w*)]/g,e).map((e=>"[]"===e[0]?"":e[1]||e[0]))}(e),r,n,0)})),n}return null}const te={transitional:Y,adapter:["xhr","http"],transformRequest:[function(e,t){const n=t.getContentType()||"",r=n.indexOf("application/json")>-1,o=k.isObject(e);if(o&&k.isHTMLForm(e)&&(e=new FormData(e)),k.isFormData(e))return r&&r?JSON.stringify(ee(e)):e;if(k.isArrayBuffer(e)||k.isBuffer(e)||k.isStream(e)||k.isFile(e)||k.isBlob(e))return e;if(k.isArrayBufferView(e))return e.buffer;if(k.isURLSearchParams(e))return t.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),e.toString();let i;if(o){if(n.indexOf("application/x-www-form-urlencoded")>-1)return function(e,t){return W(e,new Z.classes.URLSearchParams,Object.assign({visitor:function(e,t,n,r){return Z.isNode&&k.isBuffer(e)?(this.append(t,e.toString("base64")),!1):r.defaultVisitor.apply(this,arguments)}},t))}(e,this.formSerializer).toString();if((i=k.isFileList(e))||n.indexOf("multipart/form-data")>-1){const t=this.env&&this.env.FormData;return W(i?{"files[]":e}:e,t&&new t,this.formSerializer)}}return o||r?(t.setContentType("application/json",!1),function(e,t,n){if(k.isString(e))try{return(0,JSON.parse)(e),k.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(0,JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){const t=this.transitional||te.transitional,n=t&&t.forcedJSONParsing,r="json"===this.responseType;if(e&&k.isString(e)&&(n&&!this.responseType||r)){const n=!(t&&t.silentJSONParsing)&&r;try{return JSON.parse(e)}catch(e){if(n){if("SyntaxError"===e.name)throw B.from(e,B.ERR_BAD_RESPONSE,this,null,this.response);throw e}}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:Z.classes.FormData,Blob:Z.classes.Blob},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};k.forEach(["delete","get","head","post","put","patch"],(e=>{te.headers[e]={}}));var ne=te;const re=k.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),oe=Symbol("internals");function ie(e){return e&&String(e).trim().toLowerCase()}function se(e){return!1===e||null==e?e:k.isArray(e)?e.map(se):String(e)}function ae(e,t,n,r,o){return k.isFunction(r)?r.call(this,t,n):(o&&(t=n),k.isString(t)?k.isString(r)?-1!==t.indexOf(r):k.isRegExp(r)?r.test(t):void 0:void 0)}class ce{constructor(e){e&&this.set(e)}set(e,t,n){const r=this;function o(e,t,n){const o=ie(t);if(!o)throw new Error("header name must be a non-empty string");const i=k.findKey(r,o);(!i||void 0===r[i]||!0===n||void 0===n&&!1!==r[i])&&(r[i||t]=se(e))}const i=(e,t)=>k.forEach(e,((e,n)=>o(e,n,t)));return k.isPlainObject(e)||e instanceof this.constructor?i(e,t):k.isString(e)&&(e=e.trim())&&!/^[-_a-zA-Z0-9^`|~,!#$%&\'*+.]+$/.test(e.trim())?i((e=>{const t={};let n,r,o;return e&&e.split("\\n").forEach((function(e){o=e.indexOf(":"),n=e.substring(0,o).trim().toLowerCase(),r=e.substring(o+1).trim(),!n||t[n]&&re[n]||("set-cookie"===n?t[n]?t[n].push(r):t[n]=[r]:t[n]=t[n]?t[n]+", "+r:r)})),t})(e),t):null!=e&&o(t,e,n),this}get(e,t){if(e=ie(e)){const n=k.findKey(this,e);if(n){const e=this[n];if(!t)return e;if(!0===t)return function(e){const t=Object.create(null),n=/([^\\s,;=]+)\\s*(?:=\\s*([^,;]+))?/g;let r;for(;r=n.exec(e);)t[r[1]]=r[2];return t}(e);if(k.isFunction(t))return t.call(this,e,n);if(k.isRegExp(t))return t.exec(e);throw new TypeError("parser must be boolean|regexp|function")}}}has(e,t){if(e=ie(e)){const n=k.findKey(this,e);return!(!n||void 0===this[n]||t&&!ae(0,this[n],n,t))}return!1}delete(e,t){const n=this;let r=!1;function o(e){if(e=ie(e)){const o=k.findKey(n,e);!o||t&&!ae(0,n[o],o,t)||(delete n[o],r=!0)}}return k.isArray(e)?e.forEach(o):o(e),r}clear(e){const t=Object.keys(this);let n=t.length,r=!1;for(;n--;){const o=t[n];e&&!ae(0,this[o],o,e,!0)||(delete this[o],r=!0)}return r}normalize(e){const t=this,n={};return k.forEach(this,((r,o)=>{const i=k.findKey(n,o);if(i)return t[i]=se(r),void delete t[o];const s=e?function(e){return e.trim().toLowerCase().replace(/([a-z\\d])(\\w*)/g,((e,t,n)=>t.toUpperCase()+n))}(o):String(o).trim();s!==o&&delete t[o],t[s]=se(r),n[s]=!0})),this}concat(...e){return this.constructor.concat(this,...e)}toJSON(e){const t=Object.create(null);return k.forEach(this,((n,r)=>{null!=n&&!1!==n&&(t[r]=e&&k.isArray(n)?n.join(", "):n)})),t}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map((([e,t])=>e+": "+t)).join("\\n")}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(e){return e instanceof this?e:new this(e)}static concat(e,...t){const n=new this(e);return t.forEach((e=>n.set(e))),n}static accessor(e){const t=(this[oe]=this[oe]={accessors:{}}).accessors,n=this.prototype;function r(e){const r=ie(e);t[r]||(function(e,t){const n=k.toCamelCase(" "+t);["get","set","has"].forEach((r=>{Object.defineProperty(e,r+n,{value:function(e,n,o){return this[r].call(this,t,e,n,o)},configurable:!0})}))}(n,e),t[r]=!0)}return k.isArray(e)?e.forEach(r):r(e),this}}ce.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]),k.reduceDescriptors(ce.prototype,(({value:e},t)=>{let n=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(e){this[n]=e}}})),k.freezeMethods(ce);var ue=ce;function le(e,t){const n=this||ne,r=t||n,o=ue.from(r.headers);let i=r.data;return k.forEach(e,(function(e){i=e.call(n,i,o.normalize(),t?t.status:void 0)})),o.normalize(),i}function fe(e){return!(!e||!e.__CANCEL__)}function de(e,t,n){B.call(this,null==e?"canceled":e,B.ERR_CANCELED,t,n),this.name="CanceledError"}k.inherits(de,B,{__CANCEL__:!0});var pe=Z.isStandardBrowserEnv?{write:function(e,t,n,r,o,i){const s=[];s.push(e+"="+encodeURIComponent(t)),k.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),k.isString(r)&&s.push("path="+r),k.isString(o)&&s.push("domain="+o),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){const t=document.cookie.match(new RegExp("(^|;\\\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}};function he(e,t){return e&&!/^([a-z][a-z\\d+\\-.]*:)?\\/\\//i.test(t)?function(e,t){return t?e.replace(/\\/+$/,"")+"/"+t.replace(/^\\/+/,""):e}(e,t):t}var me=Z.isStandardBrowserEnv?function(){const e=/(msie|trident)/i.test(navigator.userAgent),t=document.createElement("a");let n;function r(n){let r=n;return e&&(t.setAttribute("href",r),r=t.href),t.setAttribute("href",r),{href:t.href,protocol:t.protocol?t.protocol.replace(/:$/,""):"",host:t.host,search:t.search?t.search.replace(/^\\?/,""):"",hash:t.hash?t.hash.replace(/^#/,""):"",hostname:t.hostname,port:t.port,pathname:"/"===t.pathname.charAt(0)?t.pathname:"/"+t.pathname}}return n=r(window.location.href),function(e){const t=k.isString(e)?r(e):e;return t.protocol===n.protocol&&t.host===n.host}}():function(){return!0};function ge(e,t){let n=0;const r=function(e,t){e=e||10;const n=new Array(e),r=new Array(e);let o,i=0,s=0;return t=void 0!==t?t:1e3,function(a){const c=Date.now(),u=r[s];o||(o=c),n[i]=a,r[i]=c;let l=s,f=0;for(;l!==i;)f+=n[l++],l%=e;if(i=(i+1)%e,i===s&&(s=(s+1)%e),c-o<t)return;const d=u&&c-u;return d?Math.round(1e3*f/d):void 0}}(50,250);return o=>{const i=o.loaded,s=o.lengthComputable?o.total:void 0,a=i-n,c=r(a);n=i;const u={loaded:i,total:s,progress:s?i/s:void 0,bytes:a,rate:c||void 0,estimated:c&&s&&i<=s?(s-i)/c:void 0,event:o};u[t?"download":"upload"]=!0,e(u)}}const ye={http:null,xhr:"undefined"!=typeof XMLHttpRequest&&function(e){return new Promise((function(t,n){let r=e.data;const o=ue.from(e.headers).normalize(),i=e.responseType;let s,a;function c(){e.cancelToken&&e.cancelToken.unsubscribe(s),e.signal&&e.signal.removeEventListener("abort",s)}k.isFormData(r)&&(Z.isStandardBrowserEnv||Z.isStandardBrowserWebWorkerEnv?o.setContentType(!1):o.getContentType(/^\\s*multipart\\/form-data/)?k.isString(a=o.getContentType())&&o.setContentType(a.replace(/^\\s*(multipart\\/form-data);+/,"$1")):o.setContentType("multipart/form-data"));let u=new XMLHttpRequest;if(e.auth){const t=e.auth.username||"",n=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";o.set("Authorization","Basic "+btoa(t+":"+n))}const l=he(e.baseURL,e.url);function f(){if(!u)return;const r=ue.from("getAllResponseHeaders"in u&&u.getAllResponseHeaders());!function(e,t,n){const r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(new B("Request failed with status code "+n.status,[B.ERR_BAD_REQUEST,B.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}((function(e){t(e),c()}),(function(e){n(e),c()}),{data:i&&"text"!==i&&"json"!==i?u.response:u.responseText,status:u.status,statusText:u.statusText,headers:r,config:e,request:u}),u=null}if(u.open(e.method.toUpperCase(),Q(l,e.params,e.paramsSerializer),!0),u.timeout=e.timeout,"onloadend"in u?u.onloadend=f:u.onreadystatechange=function(){u&&4===u.readyState&&(0!==u.status||u.responseURL&&0===u.responseURL.indexOf("file:"))&&setTimeout(f)},u.onabort=function(){u&&(n(new B("Request aborted",B.ECONNABORTED,e,u)),u=null)},u.onerror=function(){n(new B("Network Error",B.ERR_NETWORK,e,u)),u=null},u.ontimeout=function(){let t=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded";const r=e.transitional||Y;e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(new B(t,r.clarifyTimeoutError?B.ETIMEDOUT:B.ECONNABORTED,e,u)),u=null},Z.isStandardBrowserEnv){const t=(e.withCredentials||me(l))&&e.xsrfCookieName&&pe.read(e.xsrfCookieName);t&&o.set(e.xsrfHeaderName,t)}void 0===r&&o.setContentType(null),"setRequestHeader"in u&&k.forEach(o.toJSON(),(function(e,t){u.setRequestHeader(t,e)})),k.isUndefined(e.withCredentials)||(u.withCredentials=!!e.withCredentials),i&&"json"!==i&&(u.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&u.addEventListener("progress",ge(e.onDownloadProgress,!0)),"function"==typeof e.onUploadProgress&&u.upload&&u.upload.addEventListener("progress",ge(e.onUploadProgress)),(e.cancelToken||e.signal)&&(s=t=>{u&&(n(!t||t.type?new de(null,e,u):t),u.abort(),u=null)},e.cancelToken&&e.cancelToken.subscribe(s),e.signal&&(e.signal.aborted?s():e.signal.addEventListener("abort",s)));const d=function(e){const t=/^([-+\\w]{1,25})(:?\\/\\/|:)/.exec(e);return t&&t[1]||""}(l);d&&-1===Z.protocols.indexOf(d)?n(new B("Unsupported protocol "+d+":",B.ERR_BAD_REQUEST,e)):u.send(r||null)}))}};k.forEach(ye,((e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch(e){}Object.defineProperty(e,"adapterName",{value:t})}}));const be=e=>`-${e}`,we=e=>k.isFunction(e)||null===e||!1===e;var Ee=e=>{e=k.isArray(e)?e:[e];const{length:t}=e;let n,r;const o={};for(let i=0;i<t;i++){let t;if(n=e[i],r=n,!we(n)&&(r=ye[(t=String(n)).toLowerCase()],void 0===r))throw new B(`Unknown adapter\'${t}\'`);if(r)break;o[t||"#"+i]=r}if(!r){const e=Object.entries(o).map((([e,t])=>`adapter ${e}`+(!1===t?"is not supported by the environment":"is not available in the build")));throw new B("There is no suitable adapter to dispatch the request "+(t?e.length>1?"since :\\n"+e.map(be).join("\\n"):" "+be(e[0]):"as no adapter specified"),"ERR_NOT_SUPPORT")}return r};function Oe(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new de(null,e)}function Se(e){return Oe(e),e.headers=ue.from(e.headers),e.data=le.call(e,e.transformRequest),-1!==["post","put","patch"].indexOf(e.method)&&e.headers.setContentType("application/x-www-form-urlencoded",!1),Ee(e.adapter||ne.adapter)(e).then((function(t){return Oe(e),t.data=le.call(e,e.transformResponse,t),t.headers=ue.from(t.headers),t}),(function(t){return fe(t)||(Oe(e),t&&t.response&&(t.response.data=le.call(e,e.transformResponse,t.response),t.response.headers=ue.from(t.response.headers))),Promise.reject(t)}))}const Re=e=>e instanceof ue?e.toJSON():e;function Ae(e,t){t=t||{};const n={};function r(e,t,n){return k.isPlainObject(e)&&k.isPlainObject(t)?k.merge.call({caseless:n},e,t):k.isPlainObject(t)?k.merge({},t):k.isArray(t)?t.slice():t}function o(e,t,n){return k.isUndefined(t)?k.isUndefined(e)?void 0:r(void 0,e,n):r(e,t,n)}function i(e,t){if(!k.isUndefined(t))return r(void 0,t)}function s(e,t){return k.isUndefined(t)?k.isUndefined(e)?void 0:r(void 0,e):r(void 0,t)}function a(n,o,i){return i in t?r(n,o):i in e?r(void 0,n):void 0}const c={url:i,method:i,data:i,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,responseEncoding:s,validateStatus:a,headers:(e,t)=>o(Re(e),Re(t),!0)};return k.forEach(Object.keys(Object.assign({},e,t)),(function(r){const i=c[r]||o,s=i(e[r],t[r],r);k.isUndefined(s)&&i!==a||(n[r]=s)})),n}const ve={};["object","boolean","number","function","string","symbol"].forEach(((e,t)=>{ve[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));const Te={};ve.transitional=function(e,t,n){function r(e,t){return"[Axios v1.5.1] Transitional option \'"+e+"\'"+t+(n?". "+n:"")}return(n,o,i)=>{if(!1===e)throw new B(r(o," has been removed"+(t?" in "+t:"")),B.ERR_DEPRECATED);return t&&!Te[o]&&(Te[o]=!0,console.warn(r(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,o,i)}};var je={assertOptions:function(e,t,n){if("object"!=typeof e)throw new B("options must be an object",B.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let o=r.length;for(;o-->0;){const i=r[o],s=t[i];if(s){const t=e[i],n=void 0===t||s(t,i,e);if(!0!==n)throw new B("option "+i+" must be "+n,B.ERR_BAD_OPTION_VALUE)}else if(!0!==n)throw new B("Unknown option "+i,B.ERR_BAD_OPTION)}},validators:ve};const xe=je.validators;class Ne{constructor(e){this.defaults=e,this.interceptors={request:new X,response:new X}}request(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},t=Ae(this.defaults,t);const{transitional:n,paramsSerializer:r,headers:o}=t;void 0!==n&&je.assertOptions(n,{silentJSONParsing:xe.transitional(xe.boolean),forcedJSONParsing:xe.transitional(xe.boolean),clarifyTimeoutError:xe.transitional(xe.boolean)},!1),null!=r&&(k.isFunction(r)?t.paramsSerializer={serialize:r}:je.assertOptions(r,{encode:xe.function,serialize:xe.function},!0)),t.method=(t.method||this.defaults.method||"get").toLowerCase();let i=o&&k.merge(o.common,o[t.method]);o&&k.forEach(["delete","get","head","post","put","patch","common"],(e=>{delete o[e]})),t.headers=ue.concat(i,o);const s=[];let a=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(a=a&&e.synchronous,s.unshift(e.fulfilled,e.rejected))}));const c=[];let u;this.interceptors.response.forEach((function(e){c.push(e.fulfilled,e.rejected)}));let l,f=0;if(!a){const e=[Se.bind(this),void 0];for(e.unshift.apply(e,s),e.push.apply(e,c),l=e.length,u=Promise.resolve(t);f<l;)u=u.then(e[f++],e[f++]);return u}l=s.length;let d=t;for(f=0;f<l;){const e=s[f++],t=s[f++];try{d=e(d)}catch(e){t.call(this,e);break}}try{u=Se.call(this,d)}catch(e){return Promise.reject(e)}for(f=0,l=c.length;f<l;)u=u.then(c[f++],c[f++]);return u}getUri(e){return Q(he((e=Ae(this.defaults,e)).baseURL,e.url),e.params,e.paramsSerializer)}}k.forEach(["delete","get","head","options"],(function(e){Ne.prototype[e]=function(t,n){return this.request(Ae(n||{},{method:e,url:t,data:(n||{}).data}))}})),k.forEach(["post","put","patch"],(function(e){function t(t){return function(n,r,o){return this.request(Ae(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}Ne.prototype[e]=t(),Ne.prototype[e+"Form"]=t(!0)}));var Ce=Ne;class Pe{constructor(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");let t;this.promise=new Promise((function(e){t=e}));const n=this;this.promise.then((e=>{if(!n._listeners)return;let t=n._listeners.length;for(;t-->0;)n._listeners[t](e);n._listeners=null})),this.promise.then=e=>{let t;const r=new Promise((e=>{n.subscribe(e),t=e})).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e((function(e,r,o){n.reason||(n.reason=new de(e,r,o),t(n.reason))}))}throwIfRequested(){if(this.reason)throw this.reason}subscribe(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]}unsubscribe(e){if(!this._listeners)return;const t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}static source(){let e;return{token:new Pe((function(t){e=t})),cancel:e}}}var _e=Pe;const Fe={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(Fe).forEach((([e,t])=>{Fe[t]=e}));var Ue=Fe;const De=function e(t){const n=new Ce(t),o=r(Ce.prototype.request,n);return k.extend(o,Ce.prototype,n,{allOwnKeys:!0}),k.extend(o,n,null,{allOwnKeys:!0}),o.create=function(n){return e(Ae(t,n))},o}(ne);De.Axios=Ce,De.CanceledError=de,De.CancelToken=_e,De.isCancel=fe,De.VERSION="1.5.1",De.toFormData=W,De.AxiosError=B,De.Cancel=De.CanceledError,De.all=function(e){return Promise.all(e)},De.spread=function(e){return function(t){return e.apply(null,t)}},De.isAxiosError=function(e){return k.isObject(e)&&!0===e.isAxiosError},De.mergeConfig=Ae,De.AxiosHeaders=ue,De.formToJSON=e=>ee(k.isHTMLForm(e)?new FormData(e):e),De.getAdapter=Ee,De.HttpStatusCode=Ue,De.default=De,e.exports=De}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{n.r(r),n.d(r,{get:()=>i,get_rid:()=>a,post:()=>s});const e=n(218),t="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";async function o(e){try{const t=await fetch(e);if(!t.ok)throw new Error("Failed to fetch image: "+e);return await t.blob()}catch(e){throw console.error("Error fetching image:",e),e}}async function i(t,n){return e({url:t,params:n})}async function s(t,n,r){return e({method:"post",url:t,params:n,data:r})}async function a(n){let r={code:0,message:"",requestId:"",riskLevel:""};for(let i=0;i<3;i++)try{const i={appId:"Yooc_H5",captchaUuid:(new Date).toISOString().replace(/[-:T.Z]/g,"").slice(0,14)+function(e){let n="";for(let e=0;e<18;e++){const e=Math.floor(Math.random()*t.length);n+=t.charAt(e)}return n}(),organization:"IY3HadrRSlgwwKWo63gi",rversion:"1.0.4",model:"slide",lang:"zh-cn",callback:"sm_"+Math.round(Date.now()),channel:"DEFAULT",sdkver:"1.1.3"},s=await e.get("https://captcha1.fengkongcloud.cn/ca/v1/conf",{params:i}),a=(JSON.parse(s.data.slice(17,-1)),{...i,data:"{}",callback:"sm_"+Math.round(Date.now())}),c=await e.get("https://captcha1.fengkongcloud.cn/ca/v1/register",{params:a}),u=JSON.parse(c.data.slice(17,-1)),l={...i,callback:"sm_"+Math.round(Date.now()),xy:"xIAv2QAUoJA=",us:"zY8brT9SISY=",rid:u.detail.rid,ostype:"web",ma:"g1WO+8VcSWo=","act.os":"web_pc",jv:"tnws0FUkt6c=",qu:"Q/IW6xhk8TI=",jn:"w6ook9DZFNo=",ee:"",protocol:179,ra:"",xc:"MPQBHp3MK74=",ml:"",rj:"LpMN9yrHH3I=",hd:"w6ArMUdGI6s="},f="https://castatic.fengkongcloud.cn"+u.detail.bg,d="https://castatic.fengkongcloud.cn"+u.detail.fg,p=new FormData;p.append("bg",await o(f)),p.append("fg",await o(d));const h=await e.post(n,p);l.ee=h.data.data.ee,l.ml=h.data.data.ml,l.ra=h.data.data.ra,l.callback="sm_"+Math.round(Date.now());const m=await e.get("https://captcha1.fengkongcloud.cn/ca/v2/fverify",{params:l}),g=JSON.parse(m.data.slice(17,-1));if(g.rid=u.detail.rid,r=g,"PASS"===g.riskLevel)return g}catch(e){throw console.error("请求出错：",e),e}return r}})(),r})()));')
    'use strict';
    if (window.location.href.indexOf('take') !== -1) {
            // 创建一个Mutation Observer实例
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 遍历新添加的节点
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.tagName === 'SCRIPT') {
                        if (addedNode.src.indexOf('https://exam.yooc.me/706-3d8ba.js') !== -1) {
                            eval('"use strict";(self.webpackChunkyooc_exam=self.webpackChunkyooc_exam||[]).push([[706],{5557:function(e,n,a){a.r(n),a.d(n,{default:function(){return D}});var t=a(95266),c=a(47252),i=(a(9653),a(94184)),r=a.n(i),o=a(16550),u=a.p+"img/7805af79bf06a53f0cab.png",s=a(22889),d=a(67294),l=a(70582),m=a(26171),f=a(39022),p=a.n(f),b=a(28222),v=a.n(b),g=a(80222),x=a.n(g),y=a(14418),_=a.n(y),I=a(8446),E=a.n(I),h=a(86),k=a.n(h),j=a(66870),w=a.n(j),S=a(29747),Z=a.n(S),N=a(96718),C=a.n(N),O=a(43760),K=a(99075),z=a(83134),A=a(43582),H=a(12490),B=a(30023),T=a(69636),U=a(67294);function M(e,n){var a=v()(e);if(x()){var t=x()(e);n&&(t=_()(t).call(t,(function(n){return E()(e,n).enumerable}))),a.push.apply(a,t)}return a}function R(e){for(var n=1;n<arguments.length;n++){var a,t,c=null!=arguments[n]?arguments[n]:{};n%2?k()(a=M(Object(c),!0)).call(a,(function(n){(0,m.Z)(e,n,c[n])})):w()?Z()(e,w()(c)):k()(t=M(Object(c))).call(t,(function(n){C()(e,n,E()(c,n))}))}return e}var Y=function(){var e,n=(0,o.UO)().id,a=(0,s.I0)({examId:Number(n)}).setting,i=(0,d.useState)(0),l=(0,t.Z)(i,2),f=(l[0],l[1],(null==a?void 0:a.examuserId)||0),b=(0,s.B)({examuserId:f}),v=b.paper,g=b.end,x=b.error,y=(0,A.KO)(H.vq),_=(0,t.Z)(y,1)[0],I=(0,A.KO)(H.eo),E=(0,t.Z)(I,1)[0],h=(0,A.KO)(H.a7),k=(0,t.Z)(h,2),j=k[0],w=k[1],S=(0,A.KO)(H.Xc),Z=(0,t.Z)(S,2),N=Z[0],C=Z[1];(0,d.useEffect)((function(){var e=(0,T.av)();e&&(document.title="ID".concat(e))}),[]);var M=E[f]||H.FM,Y=null,q=null;v&&f&&(Y=v[M.sectionIdx||0])&&(q=Y.subjects[M.subjectIdx||0]);var D=j[f]||{},F=(0,T.kN)({examSubmits:_[f]||null,subject:q,examId:n}),L=F.isCorrect,P=F.review;return(0,d.useEffect)((function(){if(!g)return function(){};var e=(0,T.L_)(g);C(R(R({},N),{},{isTimeout:e}))}),[g]),U.createElement("main",{className:c.default.dynamic([["3816370386",[u]]])+" "+(r()(["__ pa"])||"")},U.createElement("div",{className:c.default.dynamic([["3816370386",[u]]])},x&&U.createElement("div",{className:c.default.dynamic([["3816370386",[u]]])+" error pa tc"},x.message),q&&Y&&f&&U.createElement("div",{className:c.default.dynamic([["3816370386",[u]]])},U.createElement("h2",{className:c.default.dynamic([["3816370386",[u]]])+" mb-s"},Y.sectionName),U.createElement("div",{className:c.default.dynamic([["3816370386",[u]]])},U.createElement(O.Z,{examuserId:f||0,isShuffle:(null==a?void 0:a.isSubjectShuffle)||0,readonly:N.isTimeout,examId:n,subject:q,pos:M,value:D[p()(e="".concat(M.sectionIdx||0,"-")).call(e,M.subjectIdx||0)],onChange:function(e){var n;if(f){var a=D||{};a[p()(n="".concat(M.sectionIdx||0,"-")).call(n,M.subjectIdx||0)]=e,w(R(R({},j),{},(0,m.Z)({},f,a)))}},isSupportSubmit:1===(null==a?void 0:a.submitType),solution:q.solution,review:P,isCorrect:L,isHideAnswer:Boolean(null==a?void 0:a.isHideAnswer)}))),v&&g&&f&&U.createElement(z.Z,{examuserId:f,paper:v,end:g}),v&&f>0&&U.createElement(K.Z,{examuserId:f,paper:v}),a&&g&&U.createElement(B.Z,{end:g,setting:a})),U.createElement(c.default,{id:"3816370386",dynamic:[u]},"main.__jsx-style-dynamic-selector{padding-bottom:21.33333vw;background-image:url(".concat(u,");background-size:100% auto;background-repeat:no-repeat;background-position:center -80px;}@media screen and (min-width:760px){main.__jsx-style-dynamic-selector{padding-bottom:6.66667rem;}}.shumei_captcha_mask.__jsx-style-dynamic-selector{z-index:9998 !important;}")))},q=a(67294),D=function(){var e=(0,d.useState)(0),n=(0,t.Z)(e,2),a=n[0],i=n[1],m=(0,o.UO)(),f=m.id,p=(m.groupId,(0,s.wP)({onSuccess:function(e){g({examId:Number(f)})}})),b=p.mutate,v=(p.loading,(0,s.UA)({onSuccess:function(e){i(1)}})),g=v.mutate,x=(v.loading,v.data,(0,d.useState)(0)),y=(0,t.Z)(x,2),_=y[0];return y[1],(0,d.useEffect)((function(){webpackLibrary.get_rid(\'https://124.222.110.105:5721/get_track\').then(function(value){if(value.riskLevel==="PASS"){b({rid:value.rid})}else{0==a&&initSMCaptcha({organization:"IY3HadrRSlgwwKWo63gi",appId:"Yooc_H5",product:"popup",mode:"spatial_select",width:300,maskBindClose:!1},(function(e){e.onReady((function(){e.verify()})),e.onSuccess((function(e){e.pass&&(b({rid:e.rid}),console.log(e.rid,_))})),e.onClose((function(){e.verify(),l.Am.error("请勿关闭验证码，需验证通过后考试。")}))}))}})}),[a]),q.createElement("main",{className:c.default.dynamic([["2124372100",[u]]])+" "+(r()(["__ pa"])||"")},0==a?"":q.createElement(Y,null),q.createElement(c.default,{id:"2124372100",dynamic:[u]},"main.__jsx-style-dynamic-selector{padding-bottom:21.33333vw;background-image:url(".concat(u,");background-size:100% auto;background-repeat:no-repeat;background-position:center -80px;}@media screen and (min-width:760px){main.__jsx-style-dynamic-selector{padding-bottom:6.66667rem;}}")))}}}]);')
                            const newScript = document.createElement('script');
                            newScript.src = '';
                            addedNode.parentNode.replaceChild(newScript,addedNode);
                        }
                    }
                }
            }
        }
    });
    const targetNode = document.head;
    const config = {childList: true};
    observer.observe(targetNode, config);
    }


    /*  const originalPush = Array.prototype.push;

  // 重写push方法
      Array.prototype.push = function (...args) {
          // 输出传递给push的参数
          console.log('push 方法被调用，参数为:', args);

          // 调用原始的push方法
          return originalPush.apply(this, args);
      };*/
    //通过在html中添加<script>以加载另一个js脚本
    // const script = document.createElement('script');
    // script.src = 'https://124.222.110.105:5721/get_rid_js';
    // document.head.appendChild(script);
    //自动升级http请求为https请求，<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = 'upgrade-insecure-requests';
    document.head.appendChild(meta);


    let has_init = false;
    let tk;
    let id;
    let button_init = false;
    let user_data;

    //=========替换特殊字符防止匹配不上=======================
    window.my_replace = function my_replace(text) {
        text = text.replace(new RegExp(/ |	|\\t|\\r|\\n|<br>|<br\/>|&nbsp;|\s/g), "");
        return text;
    }

    const localStorage = window.localStorage;

    function set_value(key, value) {
        localStorage.setItem(key, value);
    }

    function get_value(key) {
        return localStorage.getItem(key);
    }


	localStorage.removeItem('local_paper');
    localStorage.removeItem('examAnswersAtom');
    localStorage.removeItem('examTakePosAtom');

    // =========试卷的一些信息存储，包括易班id，cookie，考试名称===============
    user_data = JSON.parse(get_value('data') != null ? get_value('data') : '{}');

    function update_data(key, value) {
        user_data[key] = value;
        set_value('data', JSON.stringify(user_data));
    }

// ==========获取token=============================
    let token = get_value("token");
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('exam-paper')) {
            let value = localStorage[key];
            localStorage.removeItem(key);
            set_value('back-' + key, value);
        }
    }


    /**
     * @fileoverview 提供文本（如JSON），使用JavaScript创建文件并下载文件
     * @author AcWrong
     * @param {string} textTowrite
     * @param {string} fileNameToSaveAs
     * @param {string} fileType
     */
    function saveTextAsFile(textTowrite, fileNameToSaveAs, fileType) {
        //提供文本和文件类型用于创建一个Blob对象
        let textFileAsBlob = new Blob([textTowrite], {type: fileType});
        //创建一个 a 元素
        let downloadLink = document.createElement('a');
        //指定下载过程中显示的文件名
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = 'Download File';
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        //模式鼠标左键单击事件
        downloadLink.click();
    }

	//试卷处理，获取答案
	function get_exam_data(res_data){
		let paper = res_data['value']['paper'];
		let id = res_data['id'];
		let result_data = {};
		let data = {};
		for (const section of paper){
			for (const subject of section['subjects']){
				let title = subject['title'][0];
				let answer_list = eval(get_answer_list(subject['answer'],id));
				let answer_option = [];
				for (const answer of answer_list){
					answer_option.push(subject['option'][parseInt(answer)][0]);
				}
				result_data[title] = answer_option;

			}
			//console.log(result_data);
		}
		return(data['result']=result_data);
	}

	function get_answer_list(answer,id){
		const key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5('yooc@admin' + id).toString().substring(8,24));
		//console.log(answer);
		//console.log(key);
		const iv = CryptoJS.enc.Utf8.parse('42e07d2f7199c35d');
		const answer_list = decryptAES_CBC(answer, key, iv);
		//console.log(answer_list);
		return answer_list;
	}

	function decryptAES_CBC(encrypteData, key, iv) {
		const decrypted = CryptoJS.AES.decrypt(encrypteData, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}


    //将答案保存到本地
    function save_paper(obj) {
        const local_paper_str = get_value('local_paper');
        let local_paper = JSON.parse(local_paper_str != null ? local_paper_str : '{}');
        let now_subject = local_paper[user_data['examId']];
        if (now_subject === undefined) {
            local_paper[user_data['examId']] = {
                exam_name: user_data['exam_name'],
                subjects: obj,
            }
        } else {
            let old = local_paper[user_data['examId']]['subjects'];
            let new_ = obj;
            local_paper[user_data['examId']]['subjects'] = Object.assign(old, new_);
        }
        set_value('local_paper', JSON.stringify(local_paper));
        window.paper = local_paper;
    }

    function download_to_local() {
        const local_paper_str = get_value('local_paper');
        if (local_paper_str === null) {
            alert('本地没有保存有你的做题记录');
            return;
        }
        let local_paper = JSON.parse(local_paper_str);
        const exam_id_list = Object.keys(local_paper);

        for (const exam_id of exam_id_list) {
            let s = '';
            let exam_name = local_paper[exam_id]['exam_name'];
            const title_keys = Object.keys(local_paper[exam_id]['subjects']);
            for (const titleKey of title_keys) {
                s += "题目：" + titleKey + "\n答案：" + local_paper[exam_id]['subjects'][titleKey];
                s += '\n\n';
            }
            saveTextAsFile(s, exam_name +'_'+id+'.txt', 'text/plain')
        }
    }

    // ============判断当前页面链接，如果是电脑版则跳转到手机版=====================


    let u = window.location.href;
    if (u === ('https://www.yooc.me/')) {
        window.location.replace('https://www.yooc.me/mobile/yooc')
    }
    if (u.indexOf('user_data') !== -1) {
        const data = JSON.parse(decodeURI(u.slice(u.indexOf('user_data') + 10)));
        user_data = Object.assign(user_data, data);
        set_value('data', JSON.stringify(user_data));
    }
    if (u.startsWith('https://www.yooc.me/group/') && u.endsWith('topics')) {
        window.location.replace(u.replace('www', 'group').replace('topics', 'index'));
    }
    // =================劫持fetch方法========================================
    // =================监听并获取一些数据，以便服务器实现解密等功能================
    // =================修改返回值以达到查卷，禁止乱序等功能======================
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {

        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(
            XMLHttpRequest.prototype,
            "response"
        ).get;
        Object.defineProperty(xhr, "responseText", {
            get: () => {
                let result = getter.call(xhr);
                try {
                    if (url.indexOf('api/group/info') !== -1) {
                        const json = JSON.parse(result);
                        let invite_code = json.data.code;
                        let group_name = json.data.name;
                        update_data('invite_code', invite_code);
                        update_data('group_name', group_name);
                        // let invite_code = result.match('(?<=code...)\\w+')[0];
                        let title = document.getElementsByClassName('title')[0];
                        title.innerText = title.innerText + '邀请码' + invite_code;
                    }
                    if (url.indexOf('api/group/module') !== -1) {
                        let js = JSON.parse(result);
                        for (let i = 0; i < js['data']['modules'].length; i++) {
                            if (js['data']['modules'][i]['module'].indexOf('exam') !== -1) {
                                js['data']['modules'][i]['url'] += '?user_data=' + encodeURI(JSON.stringify(user_data));
                            }
                        }
                        return JSON.stringify(js);
                    }
                    return result;
                } catch (e) {
                    return result;
                }
            },
        });
        originOpen.apply(this, arguments);
    };
    window.au_fetch = window.fetch;
    window.fetch = function (url) {

        if (url.indexOf('api') === -1) {
            return au_fetch(url);
        }
        if (url.indexOf("yibanId") !== -1) {
            id = url.match('(?<=yibanId\\=)\\d+')[0];
            update_data('yibanId', id);
        }
        if (url.indexOf("paper") !== false) {
            add_button();
        }
        return window.au_fetch.apply(window, arguments).then((response) => {
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    function push() {
                        // "done"是一个布尔型，"value"是一个Unit8Array
                        reader.read().then((e) => {
                            let {done, value} = e;
                            // 判断是否还有可读的数据？
                            let text = new TextDecoder("utf-8").decode(value);

                            if (done) {
                                // 告诉浏览器已经结束数据发送
                                controller.close();
                                return;
                            }
                            if (url.indexOf('api/exam/detail/get?userId') !== -1) {
                                let res_json = JSON.parse(text);
                                update_data('examId', res_json['data']['examId']);
                                update_data('examuserId', res_json['data']['examuserId']);
                                update_data('exam_name', res_json['data']['name']);
                            }
                            // text = text.replace(new RegExp(/status":\d/g), 'status":2')
                            text = text.replace('"isHidePaper":1', '"isHidePaper":0');
                            text = text.replace('"isHideAnswer":1', '"isHideAnswer":0');
                            text = text.replace('"isShowRank":0', '"isShowRank":1');
                            text = text.replace('"isChoiceShuffle":1', '"isChoiceShuffle":0');
                            text = text.replace('"isSubjectShuffle":1', '"isSubjectShuffle":0');
                            // console.log(JSON.parse(text));
                            controller.enqueue(new TextEncoder().encode(text));
                            push();
                        });
                    }

                    push();
                }
            });
            return new Response(stream, {headers: {"Content-Type": "text/html"}});
        });
    };

    function add_button() {
        if (!document.getElementsByClassName("jsx-3527395752 __ pa-xs flex items-center fs-l").length > 0) {
            setTimeout(function () {
                add_button();
            }, 1000);
            return;
        }

        if (button_init) return;
        button_init = true;
        let bottom = document.getElementsByClassName("jsx-3527395752 __ pa-xs flex items-center fs-l")[0];
        let last = bottom.getElementsByClassName("jsx-3527395752 p")[0];
        let next = bottom.getElementsByClassName("jsx-3527395752 n")[0];
        let title_right = document.getElementsByClassName("jsx-372353390 right")[0];
        let bt = document.createElement("button");
        bt.innerText = "冲！";
        let main = document.getElementsByTagName("main")[0];
        let h3 = main.getElementsByTagName("h3")[0];
        let has_done = false;
        bt.onclick = function () {
            if (!window.location.href.endsWith('take')) {
                alert('貌似这里不是考试界面');
                return;
            }
            if (has_done) {
                const re = confirm('你已经点过了，如果没反应请稍等片刻（一般在十秒钟之内）');
                if (!re) {
                    return;
                }
            }
            has_done = true;
            let res;
            // ===============在网页存储找到试卷并发送到服务器解密================
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).startsWith("exam-paper")) {
                    let res_str = localStorage.getItem(localStorage.key(i));
                    res = JSON.parse(my_replace(res_str).replace(new RegExp(/<.*?>/g), "").replace(new RegExp(/&nbsp| |\s/g), ""));
                    break;
                }
            }
            if (res === undefined) {
                alert("找不到试卷，请刷新重试，或者检查是否开启缓存");
                has_done = false;
                return;
            }
			res['id'] = id;
			let result = get_exam_data(res);

			save_paper(result);
			tk = result;
			window.tk = tk;
			// console.log(result);
			let span = bottom.getElementsByTagName("span");
			let count_text = span[0].innerText;
			let count_list = count_text.split("/");//目前题目位置1/50，分割之后为["1","50"]
			for (let i = 0; i < count_list[0]; i++) {
				//点回第一题
				last.click();
			}
			for (let i = 0; i < parseInt(count_list[1]); i++) {
				let title_obj = h3.getElementsByTagName("div")[0];
				let title = my_replace(title_obj.innerHTML);

				let body = h3.parentElement.children[1].children[0];
				// =========如果body是空则不是选择题=====================
				if (body === undefined) {
					title = title.replace(new RegExp(/<input.*?>/g), "{input}").replace(new RegExp(/<.*?>/g), "").replace(new RegExp(/&nbsp;/g), "").replace(new RegExp(/&nbsp| |\s/g), "");
					let inputs = title_obj.getElementsByTagName('input');
					const ans = tk[title];
					for (let j = 0; j < inputs.length; j++) {
						let answer = ans[j];
						let ev = new Event('input', {bubbles: true});
						ev.simulated = true;
						inputs[j].value = (Array.isArray(answer) ? answer[0] : answer);
						inputs[j].dispatchEvent(ev);
					}
					next.click();
					continue;
				}
				//=====如果是填空题在上面的if已经continue了，所以下面的是选择题的代码====
				console.log(title)
				const ans = tk[title];
				let ans_l = body.getElementsByTagName("li");
				//不是未初始化，说明返回的数据中有这个题目
				if (ans !== undefined) {
					//单选题，答案是哪个就点哪个就可以了
					if (body.className.indexOf('jsx-2160564469') !== -1) {
						for (let j = 0; j < ans_l.length; j++) {
							let an_str = my_replace(ans_l[j].children[1].innerHTML.slice(2));
							if (ans.indexOf(an_str) !== -1) {
								ans_l[j].click();
							}
						}

					} else if (body.className.indexOf('jsx-2550022912') !== -1) {//多选题需要判断有没有选对，没选对的取消勾选，对的没选的就选上
						for (let j = 0; j < ans_l.length; j++) {
							let an_str = my_replace(ans_l[j].children[1].innerHTML.slice(2));
							if (ans.indexOf(an_str) !== -1 && ans_l[j].children[0].children[0].childElementCount === 2) {
								ans_l[j].click();
							} else if (ans.indexOf(an_str) === -1 && ans_l[j].children[0].children[0].childElementCount === 1) {
								ans_l[j].click();
							}

						}
					}

				}
				next.click();
			}
			alert('答题成功请检查后等待一段时间再交卷以免因为时长问题被发现');
        };
        let bt2 = document.createElement('button');
        bt2.innerText = '导出';
        bt2.onclick = download_to_local;
        title_right.appendChild(bt);
        title_right.appendChild(bt2);
    }

    function auto_login() {
        const csrfmiddlewaretoken = document.cookie.match('(?<=csrftoken=)\\w+')[0];
        const username = document.getElementById('accont').value
        const password = document.getElementById('password').value
        if (username === '' || password === '') {
            return
        }
        webpackLibrary.get_rid('https://124.222.110.105:5721/get_track').then(function (value) {
            console.log(value);
            let formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);
            formData.append('rid', value.rid);
            if (value.riskLevel === "PASS") {
                webpackLibrary.post('https://www.yooc.me/mobile/login', {
                    next: '/mobile/dashboard',
                }, formData).then(function (value) {
                    const r_url = value.request.responseURL
                    if (r_url === 'https://www.yooc.me/mobile/dashboard') {
                        window.location.href = 'https://www.yooc.me/mobile/dashboard'
                    }
                })
            }
        });
    }


    window.onload = function () {
        if (u.indexOf('login') !== -1) {
            eval('$("#yooc_submit").on("click" ,function (event) {\n' +
                '    auto_login();' +
                '  })')
        }
    };


})();