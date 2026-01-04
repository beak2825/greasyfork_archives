// ==UserScript==
// @name        bumble-enhanced
// @namespace   https://openuserjs.org/users/93Akkord
// @match       https://*.bumble.com/*
// @run-at      document-start
// @version     3.0.7
// @author      93Akkord
// @description show votes, show online status, and change location on bumble
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @grant       GM_notification
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://openuserjs.org/src/libs/93Akkord/loglevel.js
// @require     https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js
// @require     https://openuserjs.org/src/libs/93Akkord/akkd-common.js
// @require     https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// require     https://unpkg.com/esserializer/dist/bundle.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/luxon/3.2.1/luxon.min.js
// @copyright   2022+, Michael Barros (https://openuserjs.org/users/93Akkord)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADf0lEQVRYhb2XT2hcVRTGf+e+l8xklDakElJj/nRKM6Fd1oWKLlS02kU2VXBRFF20tEqKroI7odBuVATtpgqiLgTdaKlaVIwK1UW7EWlNmkZj2tgRMoQxncnMm3uPC+0kb+bNexNIeuAu3jnf+b5z/78rrDE9P9KPmqOI7AcGgR42xgrAHMoXqDslD04t3ArIqvjuF1T1HSC9QaKtrCxGj8r9v71fL+B/8fc2WThkIjwnD1z+QPSn0WFn5TKb3/OGCiibDi9nnMqx2y4OoHQ56475zrJPJBm/GSZO9/kiDLWFNmnkzt1gUvE4V0GXL4FbSaRUxw5fVTNtqOPtOY1s2dtWrVq8iP3lWcAlQe8w7RCavqfbFgeQLXsxfU+1hTWqENv8bszwy22L14mHX0H97nhuhcQR8AYOg791jUfRah5dmQ+3aj6c6G/Fu+dQYqF+XFAyWczdB0M++8ebuPnTkXgzeARvaHz1u/8g7sYnaPn3lhqxU2B2TIA01Fgrt8Rjyw096MBkJ2KnQCrfj2pkZdsext9zqjmgFq0sNPsBSfcTNau1X4/gCpOROX60eidedqLB6dDSLLhKJBGALhfBpJBMNlSIt3MCu3QeXLW5gCgir3cM6RoM92LqVWz+s5biofy+A/gjx+vf0jWE1zuGvfFpcwEaMQQa4VTniMJGmTobyRmVL+XJiDVgOkndeyY8ClpDK3+1VYCktocWr5bnqFwYi5yC6F1gqwQzJxtYfSQ9UG8oaFBEgyIg4VjDzglmTqK2GrkLWp4DdvE7bOFHvJ6HmmK1hY8Jpl8L+Tpzx/G2H2jmKfyAXZxsJYP5b26iW3DlBGitOUtpxkddPC4guHKiJb+qxp+ErjRL7dqH+APPh/x+/zN4dz2yuiVNCkn1NuUH1z/ClVqfggCy/G0udm2Ll6Hrvq8iBeJMK39T/vkJ1JZicYmXkdoS1atvrEscoHr19URxAKNAUgvyn2OXLrYtbpcuEOTPJPIqIP98k7uJkPxX5KUxmSxrnhItTHGlWbDJv2QCN32FeZRcIrq2gi1eSoStxxSZM6BnN5R1fSWclcLX2UGPjilu89tA0LJv2GV6Hpv9U4yMJ6dssBl5MfPo9PX6ilo6N3oIo2+hmzwShjJOx7sfn34XGpb04rmdA56YlxB5EmQEJeEV0qYJFdApVL+0NX172/6Za7dC/wImUfGIbr9yngAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/472594/bumble-enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/472594/bumble-enhanced.meta.js
// ==/UserScript==

// #region Workers

// prettier-ignore
{var W=Object.create;var y=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var L=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var G=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var B=(e,t,s,u)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of F(t))!C.call(e,a)&&a!==s&&y(e,a,{get:()=>t[a],enumerable:!(u=k(t,a))||u.enumerable});return e};var j=(e,t,s)=>(s=e!=null?W(L(e)):{},B(t||!e||!e.__esModule?y(s,"default",{value:e,enumerable:!0}):s,e));var M=G((p,b)=>{(function(e,t){typeof p=="object"&&typeof b<"u"?t(p):typeof define=="function"&&define.amd?define(["exports"],t):(e=typeof globalThis<"u"?globalThis:e||self,t(e.fastUniqueNumbers={}))})(p,function(e){"use strict";var t=function(o){return function(d){var m=o(d);return d.add(m),m}},s=function(o){return function(d,m){return o.set(d,m),m}},u=Number.MAX_SAFE_INTEGER===void 0?9007199254740991:Number.MAX_SAFE_INTEGER,a=536870912,h=a*2,g=function(o,d){return function(m){var v=d.get(m),c=v===void 0?m.size:v<h?v+1:0;if(!m.has(c))return o(m,c);if(m.size<a){for(;m.has(c);)c=Math.floor(Math.random()*h);return o(m,c)}if(m.size>u)throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");for(;m.has(c);)c=Math.floor(Math.random()*u);return o(m,c)}},w=new WeakMap,E=s(w),n=g(E,w),r=t(n);e.addUniqueNumber=r,e.generateUniqueNumber=n})});var I=e=>e.method!==void 0&&e.method==="call";var N=e=>e.error===null&&typeof e.id=="number";var l=j(M()),_=e=>{let t=new Map([[0,()=>{}]]),s=new Map([[0,()=>{}]]),u=new Map,a=new Worker(e);return a.addEventListener("message",({data:n})=>{if(I(n)){let{params:{timerId:r,timerType:i}}=n;if(i==="interval"){let o=t.get(r);if(typeof o=="number"){let d=u.get(o);if(d===void 0||d.timerId!==r||d.timerType!==i)throw new Error("The timer is in an undefined state.")}else if(typeof o<"u")o();else throw new Error("The timer is in an undefined state.")}else if(i==="timeout"){let o=s.get(r);if(typeof o=="number"){let d=u.get(o);if(d===void 0||d.timerId!==r||d.timerType!==i)throw new Error("The timer is in an undefined state.")}else if(typeof o<"u")o(),s.delete(r);else throw new Error("The timer is in an undefined state.")}}else if(N(n)){let{id:r}=n,i=u.get(r);if(i===void 0)throw new Error("The timer is in an undefined state.");let{timerId:o,timerType:d}=i;u.delete(r),d==="interval"?t.delete(o):s.delete(o)}else{let{error:{message:r}}=n;throw new Error(r)}}),{clearInterval:n=>{let r=(0,l.generateUniqueNumber)(u);u.set(r,{timerId:n,timerType:"interval"}),t.set(n,r),a.postMessage({id:r,method:"clear",params:{timerId:n,timerType:"interval"}})},clearTimeout:n=>{let r=(0,l.generateUniqueNumber)(u);u.set(r,{timerId:n,timerType:"timeout"}),s.set(n,r),a.postMessage({id:r,method:"clear",params:{timerId:n,timerType:"timeout"}})},setInterval:(n,r)=>{let i=(0,l.generateUniqueNumber)(t);return t.set(i,()=>{n(),typeof t.get(i)=="function"&&a.postMessage({id:null,method:"set",params:{delay:r,now:performance.now(),timerId:i,timerType:"interval"}})}),a.postMessage({id:null,method:"set",params:{delay:r,now:performance.now(),timerId:i,timerType:"interval"}}),i},setTimeout:(n,r)=>{let i=(0,l.generateUniqueNumber)(s);return s.set(i,n),a.postMessage({id:null,method:"set",params:{delay:r,now:performance.now(),timerId:i,timerType:"timeout"}}),i}}};var R=(e,t)=>{let s=null;return()=>{if(s!==null)return s;let u=new Blob([t],{type:"application/javascript; charset=utf-8"}),a=URL.createObjectURL(u);return s=e(a),setTimeout(()=>URL.revokeObjectURL(a)),s}};var x=`(()=>{"use strict";const e=new Map,t=new Map,r=(e,t)=>{let r,o;const i=performance.now();r=i,o=e-Math.max(0,i-t);return{expected:r+o,remainingDelay:o}},o=(e,t,r,i)=>{const s=performance.now();s>r?postMessage({id:null,method:"call",params:{timerId:t,timerType:i}}):e.set(t,setTimeout(o,r-s,e,t,r,i))};addEventListener("message",(i=>{let{data:s}=i;try{if("clear"===s.method){const{id:r,params:{timerId:o,timerType:i}}=s;if("interval"===i)(t=>{const r=e.get(t);if(void 0===r)throw new Error('There is no interval scheduled with the given id "'.concat(t,'".'));clearTimeout(r),e.delete(t)})(o),postMessage({error:null,id:r});else{if("timeout"!==i)throw new Error('The given type "'.concat(i,'" is not supported'));(e=>{const r=t.get(e);if(void 0===r)throw new Error('There is no timeout scheduled with the given id "'.concat(e,'".'));clearTimeout(r),t.delete(e)})(o),postMessage({error:null,id:r})}}else{if("set"!==s.method)throw new Error('The given method "'.concat(s.method,'" is not supported'));{const{params:{delay:i,now:n,timerId:a,timerType:d}}=s;if("interval"===d)((t,i,s)=>{const{expected:n,remainingDelay:a}=r(t,s);e.set(i,setTimeout(o,a,e,i,n,"interval"))})(i,a,n);else{if("timeout"!==d)throw new Error('The given type "'.concat(d,'" is not supported'));((e,i,s)=>{const{expected:n,remainingDelay:a}=r(e,s);t.set(i,setTimeout(o,a,t,i,n,"timeout"))})(i,a,n)}}}}catch(e){postMessage({error:{message:e.message},id:s.id,result:null})}}))})();`;var f=R(_,x),O=e=>f().clearInterval(e),U=e=>f().clearTimeout(e),A=(e,t)=>f().setInterval(e,t),q=(e,t)=>f().setTimeout(e,t);function T(){return globalThis.GM_info&&GM_info.script.grant.includes("unsafeWindow")?unsafeWindow:globalThis}T().clearIntervalEx=O,T().clearTimeoutEx=U,T().setIntervalEx=A,T().setTimeoutEx=q;}

setTimeoutEx = getWindow().setTimeoutEx;
clearTimeoutEx = getWindow().clearTimeoutEx;
setIntervalEx = getWindow().setIntervalEx;
clearIntervalEx = getWindow().clearIntervalEx;

window.setTimeoutEx = getWindow().setTimeoutEx;
window.clearTimeoutEx = getWindow().clearTimeoutEx;
window.setIntervalEx = getWindow().setIntervalEx;
window.clearIntervalEx = getWindow().clearIntervalEx;

// #endregion Workers

// #region luxon

luxon.Duration.prototype.__toHuman__ = luxon.Duration.prototype.toHuman;
luxon.Duration.prototype.toHuman = function (opts = { stripZeroUnits: 'all' }) {
    let duration = this.normalize();
    let durationUnits = [];
    let precision = typeof opts.precision == 'object' ? luxon.Duration.fromObject(opts.precision) : luxon.Duration.fromMillis(0);
    let remainingDuration = duration;
    //list of all available units
    const allUnits = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
    let smallestUnitIndex;
    let biggestUnitIndex;
    // check if user has specified the smallest unit that should be displayed
    if (opts.smallestUnit) {
        smallestUnitIndex = allUnits.indexOf(opts.smallestUnit);
    }
    // check if user has specified a biggest unit
    if (opts.biggestUnit) {
        biggestUnitIndex = allUnits.indexOf(opts.biggestUnit);
    }
    // use seconds and years as default for smallest and biggest unit
    if (!smallestUnitIndex || !(smallestUnitIndex >= 0 && smallestUnitIndex < allUnits.length)) smallestUnitIndex = allUnits.indexOf('seconds');
    if (!biggestUnitIndex || !(biggestUnitIndex <= smallestUnitIndex && biggestUnitIndex < allUnits.length)) biggestUnitIndex = allUnits.indexOf('years');
    for (let unit of allUnits.slice(biggestUnitIndex, smallestUnitIndex + 1)) {
        const durationInUnit = remainingDuration.as(unit);
        if (durationInUnit >= 1) {
            durationUnits.push(unit);
            let tmp = {};
            tmp[unit] = Math.floor(remainingDuration.as(unit));
            remainingDuration = remainingDuration.minus(luxon.Duration.fromObject(tmp)).normalize();
            // check if remaining duration is smaller than precision
            if (remainingDuration < precision) {
                // ok, we're allowed to remove the remaining parts and to round the current unit
                break;
            }
        }
        // check if we have already the maximum count of units allowed
        if (opts.maxUnits && durationUnits.length >= opts.maxUnits) {
            break;
        }
    }
    // after gathering of units that shall be displayed has finished, remove the remaining duration to avoid non-integers
    duration = duration.minus(remainingDuration).normalize();
    duration = duration.shiftTo(...durationUnits);
    if (opts.stripZeroUnits == 'all') {
        durationUnits = durationUnits.filter((unit) => duration.values[unit] > 0);
    } else if (opts.stripZeroUnits == 'end') {
        let mayStrip = true;
        durationUnits = durationUnits.reverse().filter((unit /*, index*/) => {
            if (!mayStrip) return true;
            if (duration.values[unit] == 0) {
                return false;
            } else {
                mayStrip = false;
            }
            return true;
        });
    }
    // if `durationUnits` is empty (i.e. duration is zero), then just shift to the smallest unit
    if (!durationUnits.length) {
        durationUnits.push(allUnits[smallestUnitIndex]);
    }
    return duration.shiftTo(...durationUnits).__toHuman__(opts);
};

// #endregion luxon

// #region ESSerializer

// prettier-ignore
function initESSerializer(_window=window){!function(r,e){for(var _ in e)r[_]=e[_];e.__esModule&&Object.defineProperty(r,"__esModule",{value:!0})}(this,(()=>{"use strict";var __webpack_modules__={607:(module,exports,__webpack_require__)=>{Object.defineProperty(exports,"__esModule",{value:!0});var serializer_1=__webpack_require__(810),deserializer_1=__webpack_require__(496),Module;"undefined"!=typeof process&&process.release&&"node"===process.release.name&&(Module=eval("require")("module"));var _ESSerializer=function(){function r(){}return r.throwErrorIfInNonNodeEnvironment=function(){if(!Module)throw new Error("Cannot intercept require in non-Node environment.")},r.interceptRequire=function(){this.isRequireIntercepted||(this.isRequireIntercepted=!0,this.throwErrorIfInNonNodeEnvironment(),r.originRequire=Module.prototype.require,Module.prototype.require=function(){var e=r.originRequire.apply(this,arguments),_=e.name;return r.requiredClasses[_]||(r.requiredClasses[_]=e),e})},r.stopInterceptRequire=function(){this.throwErrorIfInNonNodeEnvironment(),Module.prototype.require=r.originRequire,this.isRequireIntercepted=!1},r.isInterceptingRequire=function(){return this.isRequireIntercepted},r.getRequiredClasses=function(){return this.requiredClasses},r.clearRequiredClasses=function(){this.requiredClasses={}},r.registerClass=function(r){this.registeredClasses.push(r)},r.registerClasses=function(r){this.registeredClasses=this.registeredClasses.concat(r)},r.clearRegisteredClasses=function(){this.registeredClasses=[]},r.serialize=function(r,e){return void 0===e&&(e={}),JSON.stringify(serializer_1.getSerializeValueWithClassName(r,e))},r.deserialize=function(r,e,_){return void 0===e&&(e=[]),void 0===_&&(_={}),deserializer_1.deserializeFromParsedObj(JSON.parse(r),Object.values(this.requiredClasses).concat(this.registeredClasses).concat(e),_)},r.originRequire=null,r.isRequireIntercepted=!1,r.requiredClasses={},r.registeredClasses=[],r}();_window.ESSerializer=_ESSerializer},917:function(r,e){var _=this&&this.__spreadArrays||function(){for(var r=0,e=0,_=arguments.length;e<_;e++)r+=arguments[e].length;var I=Array(r),t=0;for(e=0;e<_;e++)for(var n=arguments[e],L=0,A=n.length;L<A;L++,t++)I[t]=n[L];return I};Object.defineProperty(e,"__esModule",{value:!0}),e.TO_STRING_FIELD=e.TIMESTAMP_FIELD=e.OPTIONS_FIELD=e.CLASS_NAME_FIELD=e.BOOLEAN_FIELD=e.ARRAY_FIELD=e.BUILTIN_TYPE_UNDEFINED=e.BUILTIN_TYPE_NOT_FINITE=e.BUILTIN_TYPE_BIG_INT=e.BUILTIN_CLASS_AGGREGATE_ERROR=e.BUILTIN_CLASS_URI_ERROR=e.BUILTIN_CLASS_TYPE_ERROR=e.BUILTIN_CLASS_SYNTAX_ERROR=e.BUILTIN_CLASS_REFERENCE_ERROR=e.BUILTIN_CLASS_RANGE_ERROR=e.BUILTIN_CLASS_EVAL_ERROR=e.BUILTIN_CLASS_ERROR=e.BUILTIN_CLASS_STRING=e.BUILTIN_CLASS_SET=e.BUILTIN_CLASS_REGEXP=e.BUILTIN_CLASS_INTL_RELATIVETIMEFORMAT=e.BUILTIN_CLASS_INTL_PLURALRULES=e.BUILTIN_CLASS_INTL_NUMBERFORMAT=e.BUILTIN_CLASS_INTL_LOCALE=e.BUILTIN_CLASS_INTL_LISTFORMAT=e.BUILTIN_CLASS_INTL_DATETIMEFORMAT=e.BUILTIN_CLASS_INTL_COLLATOR=e.BUILTIN_CLASS_DATE=e.BUILTIN_CLASS_DATAVIEW=e.BUILTIN_CLASS_BOOLEAN=e.BUILTIN_CLASS_SHAREDARRAYBUFFER=e.BUILTIN_CLASS_ARRAYBUFFER=e.BUILTIN_CLASS_BIGUINT64ARRAY=e.BUILTIN_CLASS_BIGINT64ARRAY=e.BUILTIN_CLASS_FLOAT64ARRAY=e.BUILTIN_CLASS_FLOAT32ARRAY=e.BUILTIN_CLASS_UINT32ARRAY=e.BUILTIN_CLASS_INT32ARRAY=e.BUILTIN_CLASS_UINT16ARRAY=e.BUILTIN_CLASS_INT16ARRAY=e.BUILTIN_CLASS_UINT8CLAMPEDARRAY=e.BUILTIN_CLASS_UINT8ARRAY=e.BUILTIN_CLASS_INT8ARRAY=e.CLASSNAMES_WHOSE_ENUMERABLE_PROPERTIES_SHOULD_BE_IGNORED=e.ALL_BUILTIN_INTLS=e.ALL_BUILTIN_ERRORS=e.ALL_BUILTIN_ARRAYS=e.ESSERIALIZER_NULL=void 0,e.ESSERIALIZER_NULL="__ESSERIALIZER_NULL__",e.ARRAY_FIELD="ess_arr",e.BOOLEAN_FIELD="ess_bool",e.CLASS_NAME_FIELD="ess_cn",e.OPTIONS_FIELD="ess_opt",e.TIMESTAMP_FIELD="ess_ts",e.TO_STRING_FIELD="ess_str";var I="Int8Array";e.BUILTIN_CLASS_INT8ARRAY=I;var t="Uint8Array";e.BUILTIN_CLASS_UINT8ARRAY=t;var n="Uint8ClampedArray";e.BUILTIN_CLASS_UINT8CLAMPEDARRAY=n;var L="Int16Array";e.BUILTIN_CLASS_INT16ARRAY=L;var A="Uint16Array";e.BUILTIN_CLASS_UINT16ARRAY=A;var a="Int32Array";e.BUILTIN_CLASS_INT32ARRAY=a;var S="Uint32Array";e.BUILTIN_CLASS_UINT32ARRAY=S;var R="Float32Array";e.BUILTIN_CLASS_FLOAT32ARRAY=R;var i="Float64Array";e.BUILTIN_CLASS_FLOAT64ARRAY=i;var o="BigInt64Array";e.BUILTIN_CLASS_BIGINT64ARRAY=o;var T="BigUint64Array";e.BUILTIN_CLASS_BIGUINT64ARRAY=T,e.BUILTIN_CLASS_ARRAYBUFFER="ArrayBuffer",e.BUILTIN_CLASS_SHAREDARRAYBUFFER="SharedArrayBuffer",e.BUILTIN_CLASS_BOOLEAN="Boolean",e.BUILTIN_CLASS_DATAVIEW="DataView",e.BUILTIN_CLASS_DATE="Date";var s="Collator";e.BUILTIN_CLASS_INTL_COLLATOR=s;var E="DateTimeFormat";e.BUILTIN_CLASS_INTL_DATETIMEFORMAT=E;var N="ListFormat";e.BUILTIN_CLASS_INTL_LISTFORMAT=N,e.BUILTIN_CLASS_INTL_LOCALE="Locale";var u="NumberFormat";e.BUILTIN_CLASS_INTL_NUMBERFORMAT=u;var c="PluralRules";e.BUILTIN_CLASS_INTL_PLURALRULES=c;var U="RelativeTimeFormat";e.BUILTIN_CLASS_INTL_RELATIVETIMEFORMAT=U,e.BUILTIN_CLASS_REGEXP="RegExp",e.BUILTIN_CLASS_SET="Set";var l="String";e.BUILTIN_CLASS_STRING=l;var B="Error";e.BUILTIN_CLASS_ERROR=B;var C="EvalError";e.BUILTIN_CLASS_EVAL_ERROR=C;var f="RangeError";e.BUILTIN_CLASS_RANGE_ERROR=f;var O="ReferenceError";e.BUILTIN_CLASS_REFERENCE_ERROR=O;var F="SyntaxError";e.BUILTIN_CLASS_SYNTAX_ERROR=F;var p="TypeError";e.BUILTIN_CLASS_TYPE_ERROR=p;var d="URIError";e.BUILTIN_CLASS_URI_ERROR=d;var v="AggregateError";e.BUILTIN_CLASS_AGGREGATE_ERROR=v,e.BUILTIN_TYPE_BIG_INT="BI",e.BUILTIN_TYPE_NOT_FINITE="NF",e.BUILTIN_TYPE_UNDEFINED="UD";var D=[I,t,n,L,A,a,S,R,i,o,T];e.ALL_BUILTIN_ARRAYS=D;var y=[B,C,f,O,F,p,d,v];e.ALL_BUILTIN_ERRORS=y;var g=[s,E,N,u,c,U];e.ALL_BUILTIN_INTLS=g;var Y=_([l],D);e.CLASSNAMES_WHOSE_ENUMERABLE_PROPERTIES_SHOULD_BE_IGNORED=Y},496:function(r,e,_){var I=this&&this.__spreadArrays||function(){for(var r=0,e=0,_=arguments.length;e<_;e++)r+=arguments[e].length;var I=Array(r),t=0;for(e=0;e<_;e++)for(var n=arguments[e],L=0,A=n.length;L<A;L++,t++)I[t]=n[L];return I};Object.defineProperty(e,"__esModule",{value:!0}),e.getParentClassName=e.getClassMappingFromClassArray=e.deserializeFromParsedObjWithClassMapping=e.deserializeFromParsedObj=void 0;var t=_(821),n=_(917),L=/^\s*class\s+/;function A(r,e,_){if(void 0===_&&(_={}),t.notObject(r))return r;if(Array.isArray(r))return a(r,e);var N=r[n.CLASS_NAME_FIELD],u=function(r,e,_){switch(N){case n.BUILTIN_CLASS_INT8ARRAY:return S(e[n.ARRAY_FIELD],Int8Array);case n.BUILTIN_CLASS_UINT8ARRAY:return S(e[n.ARRAY_FIELD],Uint8Array);case n.BUILTIN_CLASS_UINT8CLAMPEDARRAY:return S(e[n.ARRAY_FIELD],Uint8ClampedArray);case n.BUILTIN_CLASS_INT16ARRAY:return S(e[n.ARRAY_FIELD],Int16Array);case n.BUILTIN_CLASS_UINT16ARRAY:return S(e[n.ARRAY_FIELD],Uint16Array);case n.BUILTIN_CLASS_INT32ARRAY:return S(e[n.ARRAY_FIELD],Int32Array);case n.BUILTIN_CLASS_UINT32ARRAY:return S(e[n.ARRAY_FIELD],Uint32Array);case n.BUILTIN_CLASS_FLOAT32ARRAY:return S(e[n.ARRAY_FIELD],Float32Array);case n.BUILTIN_CLASS_FLOAT64ARRAY:return S(e[n.ARRAY_FIELD],Float64Array);case n.BUILTIN_CLASS_BIGINT64ARRAY:return R(e[n.ARRAY_FIELD],BigInt64Array);case n.BUILTIN_CLASS_BIGUINT64ARRAY:return R(e[n.ARRAY_FIELD],BigUint64Array);case n.BUILTIN_TYPE_BIG_INT:return i(e[n.TO_STRING_FIELD]);case n.BUILTIN_TYPE_UNDEFINED:return;case n.BUILTIN_TYPE_NOT_FINITE:return t.getValueFromToStringResult(e[n.TO_STRING_FIELD]);case n.BUILTIN_CLASS_ARRAYBUFFER:return I=e[n.ARRAY_FIELD],new Uint8Array(I).buffer;case n.BUILTIN_CLASS_SHAREDARRAYBUFFER:return function(r){var e=new SharedArrayBuffer(r.length),_=new Uint8Array(e);return r.forEach(function(r,e){_[e]=r}),e}(e[n.ARRAY_FIELD]);case n.BUILTIN_CLASS_BOOLEAN:return new Boolean(e[n.BOOLEAN_FIELD]);case n.BUILTIN_CLASS_DATAVIEW:return function(r){return new DataView(new Uint8Array(r).buffer)}(e[n.ARRAY_FIELD]);case n.BUILTIN_CLASS_DATE:return function(r){return"number"==typeof r[n.TIMESTAMP_FIELD]?new Date(r[n.TIMESTAMP_FIELD]):null}(e);case n.BUILTIN_CLASS_INTL_COLLATOR:return o(e,Intl.Collator);case n.BUILTIN_CLASS_INTL_DATETIMEFORMAT:return o(e,Intl.DateTimeFormat);case n.BUILTIN_CLASS_INTL_LISTFORMAT:return o(e,Intl.ListFormat);case n.BUILTIN_CLASS_INTL_LOCALE:return new Intl.Locale(e[n.TO_STRING_FIELD]);case n.BUILTIN_CLASS_INTL_NUMBERFORMAT:return o(e,Intl.NumberFormat);case n.BUILTIN_CLASS_INTL_PLURALRULES:return o(e,Intl.PluralRules);case n.BUILTIN_CLASS_INTL_RELATIVETIMEFORMAT:return o(e,Intl.RelativeTimeFormat);case n.BUILTIN_CLASS_REGEXP:return function(r){var e=r[n.TO_STRING_FIELD],_=e.lastIndexOf("/");return new RegExp(e.substring(1,_),e.substring(_+1))}(e);case n.BUILTIN_CLASS_SET:return function(r,e){return new Set(a(r[n.ARRAY_FIELD],e))}(e,_);case n.BUILTIN_CLASS_STRING:return new String(e[n.TO_STRING_FIELD]);case n.BUILTIN_CLASS_ERROR:return T(e,Error);case n.BUILTIN_CLASS_EVAL_ERROR:return T(e,EvalError);case n.BUILTIN_CLASS_RANGE_ERROR:return T(e,RangeError);case n.BUILTIN_CLASS_REFERENCE_ERROR:return T(e,ReferenceError);case n.BUILTIN_CLASS_SYNTAX_ERROR:return T(e,SyntaxError);case n.BUILTIN_CLASS_TYPE_ERROR:return T(e,TypeError);case n.BUILTIN_CLASS_URI_ERROR:return T(e,URIError);case n.BUILTIN_CLASS_AGGREGATE_ERROR:return T(e,AggregateError);default:return n.ESSERIALIZER_NULL}var I}(0,r,e);if(u!==n.ESSERIALIZER_NULL)return u;if(N&&!e[N])throw new Error("Class "+N+" not found");var c=[];return _.fieldsForConstructorParameters&&(c=_.fieldsForConstructorParameters.map(function(e){return e in r?r[e]:{}})),function(r,e,_,I){for(var t in e){var L=e[t];if(!I.ignoreProperties||!I.ignoreProperties.includes(t))if(I.rawProperties&&I.rawProperties.includes(t))r[t]=JSON.stringify(L);else{var a=Object.getOwnPropertyDescriptor(r,t);S=L,R=a,t===n.CLASS_NAME_FIELD||R&&("function"==typeof R.set||!1===R.writable&&"object"!=typeof S)||(a&&!1===a.writable&&"object"==typeof L?E(r[t],L,_):r[t]=A(L,_))}}var S,R;return r}(function(r,e){var _={};if(!r)return _;var t=r.length-e.length;if(t>0&&(e=e.concat(Array.from(Array(t),function(){return{}}))),L.test(r.toString()))try{_=new(r.bind.apply(r,I([void 0],e)))}catch(e){s(r.name),_={},Object.setPrototypeOf(_,r?r.prototype:Object.prototype)}else{_=Object.create(r.prototype.constructor.prototype);try{r.prototype.constructor.call(_,e)}catch(e){s(r.name)}}return _}(e[N],c),r,e,_)}function a(r,e){return r.map(function(r){return A(r,e)})}function S(r,e){return new e(r)}function R(r,e){return new e(r.map(function(r){return i(r[n.TO_STRING_FIELD])}))}function i(r){return BigInt(r)}function o(r,e){var _=r[n.OPTIONS_FIELD],I=_.locale;return delete _.locale,new e(I,_)}function T(r,e){var _;return delete(_=r.message?new e(r.message):new e).stack,r.name&&(_.name=r.name),r.stack&&(_.stack=r.stack),e===AggregateError&&(_.errors=A(r.errors,{})),_}function s(r){console.warn("Incorrect parameter type passed to constructor: "+r)}function E(r,e,_){for(var I in e){var t=Object.getOwnPropertyDescriptor(r,I);t&&!0!==t.writable&&"function"!=typeof t.set||(r[I]=A(e[I],_))}}function N(r){void 0===r&&(r=[]);var e={};return r.forEach(function(r){if(t.isClass(r)){var _=r.name,I=e[_];I&&I!==r&&console.warn("WARNING: Found class definition with the same name: "+_),e[_]=r}}),e}e.deserializeFromParsedObj=function(r,e,_){return A(r,N(e),_)},e.deserializeFromParsedObjWithClassMapping=A,e.getClassMappingFromClassArray=N,e.getParentClassName=function(r){return r.prototype.__proto__.constructor.name}},821:(r,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.isClass=e.notObject=e.getValueFromToStringResult=void 0,e.notObject=function(r){return null===r||"object"!=typeof r},e.getValueFromToStringResult=function(r){switch(r){case"Infinity":return 1/0;case"-Infinity":return-1/0;case"NaN":return NaN;default:return null}},e.isClass=function(r){if(function(r){return[Date].indexOf(r)>=0}(r))return!0;try{Reflect.construct(String,[],r)}catch(r){return!1}return!0}},810:(r,e,_)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getSerializeValueWithClassName=void 0;var I=_(917),t=_(821);function n(r,e){void 0===e&&(e={});var _=function(r){var e,_,n;return void 0===r?((e={})[I.CLASS_NAME_FIELD]=I.BUILTIN_TYPE_UNDEFINED,e):"number"!=typeof r||isFinite(r)?"bigint"==typeof r?((n={})[I.CLASS_NAME_FIELD]=I.BUILTIN_TYPE_BIG_INT,n[I.TO_STRING_FIELD]=r.toString(),n):t.notObject(r)?r:I.ESSERIALIZER_NULL:((_={})[I.CLASS_NAME_FIELD]=I.BUILTIN_TYPE_NOT_FINITE,_[I.TO_STRING_FIELD]=r.toString(),_)}(r);if(_!==I.ESSERIALIZER_NULL)return _;if(Array.isArray(r))return L(r);var A={};if(!function(r){var e=r.__proto__.constructor.name;return I.CLASSNAMES_WHOSE_ENUMERABLE_PROPERTIES_SHOULD_BE_IGNORED.includes(e)}(r)){if(e.ignoreProperties&&e.ignoreProperties.forEach(function(e){delete r[e]}),e.interceptProperties)for(var a in e.interceptProperties)r[a]=e.interceptProperties[a].call(r,r[a]);for(var S in r)A[S]=n(r[S])}return function(r,e){var _=r.__proto__.constructor.name;return"Object"!==_&&(e[I.CLASS_NAME_FIELD]=_,_===I.BUILTIN_CLASS_ARRAYBUFFER||_===I.BUILTIN_CLASS_SHAREDARRAYBUFFER?e[I.ARRAY_FIELD]=L(Array.from(new Uint8Array(r))):_===I.BUILTIN_CLASS_BOOLEAN?e[I.BOOLEAN_FIELD]=r.valueOf():_===I.BUILTIN_CLASS_DATAVIEW?e[I.ARRAY_FIELD]=L(Array.from(new Uint8Array(r.buffer))):_===I.BUILTIN_CLASS_DATE?e[I.TIMESTAMP_FIELD]=r.getTime():_===I.BUILTIN_CLASS_INTL_LOCALE||_===I.BUILTIN_CLASS_REGEXP?e[I.TO_STRING_FIELD]=r.toString():_===I.BUILTIN_CLASS_SET?e[I.ARRAY_FIELD]=L(Array.from(r)):_===I.BUILTIN_CLASS_STRING?e[I.TO_STRING_FIELD]=r.toString():I.ALL_BUILTIN_ARRAYS.includes(_)?e[I.ARRAY_FIELD]=L(Array.from(r)):I.ALL_BUILTIN_ERRORS.includes(_)?function(r,e,_){"Error"!==r.name&&(e.name=r.name),r.message&&(e.message=r.message),r.stack&&(e.stack=r.stack),_===I.BUILTIN_CLASS_AGGREGATE_ERROR&&(e.errors=n(r.errors))}(r,e,_):I.ALL_BUILTIN_INTLS.includes(_)&&(e[I.OPTIONS_FIELD]=r.resolvedOptions())),e}(r,A)}function L(r){return r.map(function(r){return n(r)})}e.getSerializeValueWithClassName=n}},__webpack_module_cache__={};function __webpack_require__(r){if(__webpack_module_cache__[r])return __webpack_module_cache__[r].exports;var e=__webpack_module_cache__[r]={exports:{}};return __webpack_modules__[r].call(e.exports,e,e.exports,__webpack_require__),e.exports}return __webpack_require__(607)})())}

// #endregion ESSerializer

// #region Bumble Classes

class BumbleUser {
    constructor(userProps) {
        this.updateProps(userProps);
    }

    updateProps(userProps) {
        this.user_id = userProps.user_id;
        this.access_level = userProps.access_level;
        this.name = userProps.name;
        this.age = userProps.age;
        this.gender = userProps.gender;
        this.is_deleted = userProps.is_deleted;
        this.is_extended_match = userProps.is_extended_match;
        this.online_status = userProps.online_status;
        this.is_match = userProps.is_match;
        this.match_mode = userProps.match_mode;
        this.is_crush = userProps.is_crush;
        this.their_vote_mode = userProps.their_vote_mode;
        this.unread_messages_count = userProps.unread_messages_count;
        this.is_inapp_promo_partner = userProps.is_inapp_promo_partner;
        this.is_locked = userProps.is_locked;
        this.type = userProps.type;
        this.connection_status_indicator = userProps.connection_status_indicator;
        this.profile_photo_preview_url = this.profile_photo_preview_url || userProps?.profile_photo?.preview_url || userProps.profile_photo_preview_url;
        this.profile_photo_large_url = this.profile_photo_large_url || userProps?.profile_photo?.large_url || userProps.profile_photo_large_url;
        this.last_seen = this.online_status == 1 ? new Date().getTime() : this.last_seen || userProps.last_seen;
        this.last_seen_dt = this.last_seen != null && this.last_seen != undefined ? luxon.DateTime.fromMillis(this.last_seen).toFormat('yyyy-MM-dd hh:mm:ss a') : null;
        this.time_since_last_seen = this.last_seen != null && this.last_seen != undefined ? new Date().getTime() - this.last_seen : null;
        this.time_since_last_seen_h = this.time_since_last_seen != null && this.time_since_last_seen != undefined ? luxon.Duration.fromMillis(this.time_since_last_seen).toHuman({ unitDisplay: 'short' }) : null;
        this.played_track_user_online = firstBumbleCreations ? false : userProps.played_track_user_online != null && userProps.played_track_user_online != undefined ? userProps.played_track_user_online : false;

        return this;
    }

    updateLastSeen() {
        this.last_seen_dt = this.last_seen != null && this.last_seen != undefined ? luxon.DateTime.fromMillis(this.last_seen).toFormat('yyyy-MM-dd hh:mm:ss a') : null;
        this.time_since_last_seen = this.last_seen != null && this.last_seen != undefined ? new Date().getTime() - this.last_seen : null;
        this.time_since_last_seen_h = this.time_since_last_seen != null && this.time_since_last_seen != undefined ? luxon.Duration.fromMillis(this.time_since_last_seen).toHuman({ unitDisplay: 'short' }) : null;

        return this;
    }
}

// #endregion Bumble Classes

initESSerializer(getWindow());

const DEBUG_MESSAGES = false;

let encs = [];
let user;
let numEncountersCalls = 0;
let queue = [];
let convos = [];
let quota = 0;
let lastestMessageId;

const userIds = [];

let trackUserOnline = false;
let firstBumbleCreations = true;
let updateing = false;
let updateingEncounters = false;

/** @type {BumbleUser[]} */
let bumbleUsersCurrent = [];

/** @type {BumbleUser[]} */
let bumbleUsersNew = [];

/** @type {(userId: string) => void} */
let openChat;

let debugObj = {
    projection: [],
};

const logger = getLogger('bumble-enhanced', { logLevel: log.levels.DEBUG });

logger.info(`Loading ${GM_info.script.name}...`);

/* jshint esversion: 8 */
(async function () {
    setupConfig();

    deserializeUsers();

    exposeGlobalVariables([
        // libs
        { name: 'jQuery', value: jQuery },
        { name: '$', value: $ },

        // functions/variables
        { name: 'pp', value: pp },
        { name: 'pformat', value: pformat },
        { name: 'getObjProps', value: getObjProps },
        { name: 'getUserDefinedGlobalProps', value: getUserDefinedGlobalProps },
        { name: 'getLocalStorageSize', value: getLocalStorageSize },
        { name: 'unsafeWindow', value: unsafeWindow },
        { name: 'getWindow', value: getWindow },
        { name: 'getTopWindow', value: getTopWindow },
        { name: 'getStyle', value: getStyle },
        { name: 'BumbleUser', value: BumbleUser },
        { name: 'deserializeUsers', value: deserializeUsers },
        { name: 'findKeyPathsFuzzy', value: findKeyPathsFuzzy },
        { name: 'luxon', value: luxon },
        { name: 'openChat', value: openChat },
        { name: 'debugObj', value: debugObj },
        { name: 'serverGetUser', value: serverGetUser },

        { name: '_showAllContactsScroll', value: _showAllContactsScroll },
        { name: 'wait', value: wait },
    ]);

    $(document).arrive('.contact', function () {
        if (openChat == null || openChat == undefined) {
            openChat = findKeyPathsFuzzy(document.querySelectorAll('.contact')[0], 'openChat')[0].value;

            exposeGlobalVariables([
                // functions/variables
                { name: 'openChat', value: openChat },
            ]);
        }
    });

    function setupPageContentArriveHandler() {
        $(document).unbindArrive('.page__content', setupPageContentArriveHandler);

        setupUserMonitorDropdown();

        $(document).arrive('.page__content', setupPageContentArriveHandler);
    }

    $(document).arrive('.page__content', setupPageContentArriveHandler);

    if (!unsafeWindow.XMLHttpRequest.prototype.getResponseText) {
        unsafeWindow.XMLHttpRequest.prototype.getResponseText = Object.getOwnPropertyDescriptor(unsafeWindow.XMLHttpRequest.prototype, 'responseText').get;
    }

    if (!unsafeWindow.XMLHttpRequest.prototype.sendEx) {
        unsafeWindow.XMLHttpRequest.prototype.sendEx = Object.getOwnPropertyDescriptor(unsafeWindow.XMLHttpRequest.prototype, 'send').value;
    }

    Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, 'send', {
        /* eslint-disable-next-line no-undef */
        value: exportFunction(function () {
            let args = Array.from(arguments);
            let body = args[0];

            // try {
            //     body = JSON.parse(body);

            //     debugObj.projection = Array.from(new Set([...debugObj.projection, ...findKeyPathsFuzzy(body, 'projection')[0].value])).sort((a, b) => a - b);
            // } catch (error) {}

            // debugger;

            unsafeWindow.XMLHttpRequest.prototype.sendEx.call(this, ...args);
        }, unsafeWindow),
        enumerable: true,
        configurable: true,
        writable: true,
    });

    Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, 'responseText', {
        /* eslint-disable-next-line no-undef */
        get: exportFunction(function () {
            let responseText = unsafeWindow.XMLHttpRequest.prototype.getResponseText.call(this);

            try {
                let body = JSON.parse(responseText);

                debugObj.projection = Array.from(new Set([...debugObj.projection, ...findKeyPathsFuzzy(body, 'projection')[0].value])).sort((a, b) => a - b);
            } catch (error) {}

            // debugger;

            if (this.responseURL.includes('bumble.com/mwebapi.phtml?')) {
                const resp = JSON.parse(responseText);

                lastestMessageId = resp.message_id;
            }

            try {
                if (this.responseURL.endsWith('bumble.com/mwebapi.phtml?SERVER_APP_STARTUP')) {
                    const resp = JSON.parse(responseText);

                    user = (resp.body.find((o) => o.user) || {}).user;
                }

                if (this.responseURL.endsWith('bumble.com/mwebapi.phtml?SERVER_ENCOUNTERS_VOTE')) {
                    const body = JSON.stringify({
                        $gpb: 'badoo.bma.BadooMessage',
                        body: [
                            {
                                message_type: 81,
                                server_get_encounters: {
                                    number: 0,
                                    context: 1,
                                    user_field_filter: {
                                        projection: [200],
                                        request_albums: [],
                                        game_mode: 0,
                                        request_music_services: {},
                                    },
                                },
                            },
                        ],
                        message_id: 1,
                        message_type: 81,
                        version: 1,
                        is_background: false,
                    });

                    try {
                        window
                            .fetch('/mwebapi.phtml?SERVER_GET_ENCOUNTERS', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Message-type': '81',
                                    'x-use-session-cookie': '1',
                                    'X-Pingback': calculateBumbleChecksum(body),
                                },
                                body,
                            })
                            .then((resp) =>
                                resp.json().then((data) => {
                                    quota = (data.body[0].client_encounters.quota || {}).yes_votes_quota || 0;
                                    (document.querySelector('#voteQuota') || {}).innerHTML = quota;
                                })
                            );
                    } catch (err) {
                        logger.error(err);
                    }
                }
                if (this.responseURL.endsWith('bumble.com/mwebapi.phtml?SERVER_GET_ENCOUNTERS')) {
                    numEncountersCalls++;

                    const resp = JSON.parse(responseText);

                    // encs.push(...resp.body[0].client_encounters.results);

                    quota = (resp.body[0].client_encounters.quota || {}).yes_votes_quota || 0;

                    responseText = JSON.stringify(resp);

                    updateEncountersLists();
                }

                if (this.responseURL.endsWith('bumble.com/mwebapi.phtml?SERVER_GET_USER_LIST')) {
                }

                if (this.responseURL.endsWith('bumble.com/mwebapi.phtml?SERVER_OPEN_CHAT')) {
                    const resp = JSON.parse(responseText);

                    updateMessagesWithDatetime(resp, user);
                }
            } catch (err) {
                logger.error(err);
            }

            return responseText;
        }, unsafeWindow),
        enumerable: true,
        configurable: true,
    });

    window.setIntervalEx(() => {
        const hdr = document.querySelector('.encounters-story-profile__header');

        if (!hdr) {
            return;
        }

        if (hdr.parentElement.querySelector('.showBumbleVotes')) {
            return;
        }

        let name = (document.querySelector('.encounters-story-profile__name') || {}).innerText;
        let age = +(document.querySelector('.encounters-story-profile__age') || { innerText: '' }).innerText.replace(',', '').trim();
        let enc = encs.find((enc) => enc.user.name === name && enc.user.age === age);

        if (!enc) {
            return;
        }

        userIds.push({ name, id: enc.user.user_id });

        const div = document.createElement('div');

        div.classList.add('showBumbleVotes');

        let vote = enc.user.their_vote;
        let voteText = vote === 1 ? 'Not voted!' : vote === 2 ? 'Swiped right!' : vote === 3 ? 'Swiped left!' : 'Unknown!';

        div.innerHTML = `${voteText}<br />
  (<span id="voteQuota">${quota}</span> yes votes remaining)`;

        hdr.after(div);

        let color;

        switch (enc.user.online_status) {
            case 1:
                // online
                color = 'green';

                break;

            case 2:
                // ??
                color = 'yellow';

                break;

            case 3:
                // offline
                color = 'grey';

                break;

            default:
                // offline
                color = 'grey';

                break;
        }

        document.querySelectorAll('span[data-qa-icon-name=profile-badge-about], span[data-qa-icon-name=profile-badge-location]').forEach((iconElem) => {
            iconElem.firstChild.setAttribute('color', color);
        });
    }, 1000);

    setupUserMsgCarouselArrive();
    setupSidebarArrive();

    setIntervalEx(async () => {
        await updateOnlineStatuses();
    }, 5000);

    setIntervalEx(() => {
        const filters = document.querySelector('.encounters-filter__content');
        if (!filters) return;
        if (filters.querySelector('.locationSpoofer')) return;
        const div = document.createElement('div');
        div.classList.add('encounters-filter__entry');
        div.classList.add('locationSpoofer');
        div.innerHTML = `
    <div class="encounters-filter__content">
      <section class="settings-fieldset">
        <header class="settings-fieldset__header">
          <div class="settings-fieldset__title">
            <h2 class="p-1 text-color-gray-dark"><span>Change Location</span></h2>
          </div>
        </header>
        <div class="form__control form__control--vertical">
          <div class="form__field">
            <div class="text-field text-field--full-rounded" data-qa-role="dialog-add-job-title-field">
              <input type="text" id="spoofLatitude" placeholder="Latitude (Decimal Format)" class="text-field__input" maxlength="40" size="5" dir="auto" value="" />
            </div>
          </div>
        </div>
        <div class="form__control form__control--vertical">
          <div class="form__field">
            <div class="text-field text-field--full-rounded" data-qa-role="dialog-add-job-title-field">
              <input type="text" id="spoofLongitude" placeholder="Longitude (Decimal Format)" class="text-field__input" maxlength="40" size="5" dir="auto" value="" />
            </div>
          </div>
        </div>
      </section>
      <div class="encounters-filter__actions">
        <div class="encounters-filter__action">
          <div class="button button--narrow button--size-m color-primary button--filled" role="button" id="applyLocationSpoofer">
            <span class="button__content">
              <span class="button__text"><span class="action text-break-words"><span id="applySpoofLocation">Apply Location</span></span></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
        filters.prepend(div);
        document.querySelector('#applyLocationSpoofer').addEventListener('click', async () => {
            const body = JSON.stringify({
                $gpb: 'badoo.bma.BadooMessage',
                body: [
                    {
                        message_type: 4,
                        server_update_location: {
                            location: [
                                {
                                    latitude: +document.querySelector('#spoofLatitude').value,
                                    longitude: +document.querySelector('#spoofLongitude').value,
                                },
                            ],
                        },
                    },
                ],
                message_id: 1,
                message_type: 4,
                version: 1,
                is_background: false,
            });
            try {
                const resp = await window.fetch('/mwebapi.phtml?SERVER_UPDATE_LOCATION', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Message-type': '4',
                        'x-use-session-cookie': '1',
                        'X-Pingback': calculateBumbleChecksum(body),
                    },
                    body,
                });
                document.querySelector('#applySpoofLocation').innerText = 'Location Set!';
                filters.querySelector('.color-primary[data-qa-role=button]').click();
            } catch (e) {
                window.alert(`Error setting location: ${e}`);
            }
        });
    }, 1000);

    setupBiggerProfilePictures();

    waitForKeyElements('.profile', actionFunction, false);

    initNewSection();

    // setupModifyRequestHeaders();
    // setupLocationIntercept();

    addConversationOption();

    addCustomCss();

    logger.info(`${GM_info.script.name} loaded`);
})();

// #region Helper Functions

function isObject(value) {
    return !!(value && typeof value === 'object' && !Array.isArray(value));
}

function findNestedObject(object = {}, keyToMatch = '') {
    if (isObject(object)) {
        const entries = Object.entries(object);

        for (let i = 0; i < entries.length; i += 1) {
            const [objectKey, objectValue] = entries[i];

            if (objectKey === keyToMatch) {
                return object;
            }

            if (isObject(objectValue)) {
                const child = findNestedObject(objectValue, keyToMatch);

                if (child !== null) {
                    return child;
                }
            } else if (Array.isArray(objectValue)) {
                for (let a = 0; a < objectValue.length; a++) {
                    const item = objectValue[a];

                    if (isObject(item)) {
                        const child = findNestedObject(item, keyToMatch);

                        if (child !== null) {
                            return child;
                        }
                    }
                }
            }
        }
    }

    return null;
}

let gestureOccured = false;

$(document).on('click pointerup mouseup', function (e) {
    gestureOccured = true;
});

async function playBeep() {
    let beep = new Audio('data:audio/mpeg;base64,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//PkRPscWgjcADEslLjcEbgCS9KQsiilgMzc5KVUt066PIOE3y82o9CWehRWhjnIhMCoamFTyK8WFTAWNCllWAqNERMVYDRcU4kKVEbAJI2bQpskQfAkRDyEiUFTRUlzrIopIpaVMrWQoD6FKeETSwqbimh6ERMEyopSBJGGVhEbFKSZKkiIhSoCQmXCp4VDJ8KkqRNLUK0NSaISWBMmm6VS/jG0NIkQhBkBjSpwTK5cfUcleERohQohkSkT2ZWtHyRNFSXL+gKOhYVIrQokTRUESVIEjbSzRCUExCzWdg1VTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');

    try {
        if (gestureOccured) {
            await beep.play();
        }
    } catch (error) {}
}

function findKeyPathsFuzzy(obj, searchTerm) {
    const keyPaths = [];
    const visited = new Set();

    function searchKeys(obj, currentPath) {
        if (typeof obj !== 'object' || obj === null || visited.has(obj)) {
            return;
        }

        visited.add(obj);

        const keys = Object.keys(obj);

        for (const key of keys) {
            const newPath = currentPath ? `${currentPath}.${key}` : key;

            if (fuzzyMatch(key, searchTerm)) {
                keyPaths.push({
                    path: newPath,
                    value: obj[key],
                });
            }

            searchKeys(obj[key], newPath);
        }
    }

    searchKeys(obj, '');

    return keyPaths;
}

function fuzzyMatch(str, searchTerm) {
    // Perform fuzzy matching logic here
    // You can use any fuzzy matching algorithm/library you prefer

    // For example, a simple case-insensitive substring match
    return str.toLowerCase().includes(searchTerm.toLowerCase());
}

// #endregion Helper Functions

// #region Bumble Functions

let allKnownProjections = [10, 11, 71, 91, 93, 100, 200, 210, 220, 230, 231, 250, 280, 291, 300, 305, 310, 330, 340, 370, 380, 490, 493, 530, 540, 560, 570, 580, 582, 583, 584, 585, 590, 591, 592, 640, 662, 700, 732, 762, 763, 860, 880, 890, 911, 912, 930, 1140, 1150, 1160, 1161, 1262, 1423];

async function serverGetUser(userId) {
    let body = JSON.stringify({
        //
        $gpb: 'badoo.bma.BadooMessage',
        body: [
            {
                message_type: 403,
                server_get_user: {
                    user_id: userId,
                    user_field_filter: {
                        game_mode: 0,
                        projection: allKnownProjections,
                        request_music_services: { top_artists_limit: 10, supported_services: [29] },
                        request_albums: [
                            { person_id: userId, album_type: 2, offset: 1 },
                            { person_id: userId, album_type: 12, external_provider: 12 },
                        ],
                    },
                    client_source: 10,
                },
            },
        ],
        message_id: lastestMessageId++,
        message_type: 403,
        version: 1,
        is_background: false,
    });

    let res = await fetch('https://bumble.com/mwebapi.phtml?SERVER_GET_USER', {
        headers: {
            accept: '*/*',
            // 'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            // 'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
            // 'sec-ch-ua-mobile': '?0',
            // 'sec-ch-ua-platform': '"Windows"',
            // 'sec-fetch-dest': 'empty',
            // 'sec-fetch-mode': 'cors',
            // 'sec-fetch-site': 'same-origin',
            // 'x-message-type': '403',
            'x-pingback': calculateBumbleChecksum(body),
            'x-use-session-cookie': '1',
        },
        // referrer: 'https://bumble.com/app/connections',
        // referrerPolicy: 'origin-when-cross-origin',
        body: body,
        method: 'POST',
        // mode: 'cors',
        // credentials: 'include',
    });

    res = await res.json();

    return res;
}

function calculateBumbleChecksum(inputString) {
    inputString += 'whitetelevisionbulbelectionroofhorseflying';
    const hc = '0123456789abcdef';

    function rh(n) {
        let j,
            s = '';
        for (j = 0; j <= 3; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
        return s;
    }

    function ad(x, y) {
        let l = (x & 0xffff) + (y & 0xffff);
        let m = (x >> 16) + (y >> 16) + (l >> 16);
        return (m << 16) | (l & 0xffff);
    }

    function rl(n, c) {
        return (n << c) | (n >>> (32 - c));
    }

    function cm(q, a, b, x, s, t) {
        return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cm((b & c) | (~b & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cm((b & d) | (c & ~d), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cm(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cm(c ^ (b | ~d), a, b, x, s, t);
    }

    function sb(x) {
        let i;
        let nblk = ((x.length + 8) >> 6) + 1;
        let blks = new Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < x.length; i++) blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = x.length * 8;
        return blks;
    }

    let i,
        x = sb(inputString),
        a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878,
        olda,
        oldb,
        oldc,
        oldd;

    for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = ad(a, olda);
        b = ad(b, oldb);
        c = ad(c, oldc);
        d = ad(d, oldd);
    }

    return rh(a) + rh(b) + rh(c) + rh(d);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} className
 * @param {number} onlineStatus
 * @param {SVGSVGElement} onlineStatusElem
 * @return {*}
 */
function makeOnlineStatusSVG(className, onlineStatus, onlineStatusElem) {
    /** @type {SVGSVGElement} */
    let circle;

    if (!onlineStatusElem) {
        onlineStatusElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        onlineStatusElem.setAttribute('height', 80);
        onlineStatusElem.setAttribute('width', 80);

        onlineStatusElem.classList.add(className);
        onlineStatusElem.style.position = 'absolute';
        onlineStatusElem.style.zIndex = '9';
        onlineStatusElem.style.opacity = '.9';

        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        circle.setAttribute('cx', 40);
        circle.setAttribute('cy', 40);
        circle.setAttribute('r', 7);
        circle.setAttribute('stroke', 'grey');
        circle.setAttribute('stroke-width', 1);

        onlineStatusElem.appendChild(circle);
    } else {
        circle = onlineStatusElem.querySelector('circle');
    }

    /** @type {string} */
    let fill;

    switch (onlineStatus) {
        case 1:
            // online
            fill = 'green';

            break;

        case 2:
            // ??
            fill = 'yellow';

            break;

        case 3:
            // offline
            fill = 'grey';

            break;

        default:
            // offline
            fill = 'grey';

            break;
    }

    circle.setAttribute('fill', fill);

    // onlineStatusElem.appendChild(circle);

    return onlineStatusElem;
}

function updateBackToBanner(encountersAvailable) {
    try {
        let elem = document.querySelectorAll('.sidebar-profile__name > div')[0]; // document.querySelectorAll('.sidebar-action-banner')[0].querySelectorAll('.font-weight-medium')[0].querySelectorAll('span')[0];

        let textContent = elem.textContent;

        textContent = textContent.replace(/\s+?\[\d+?\]/, '');

        textContent = `${textContent} [${encountersAvailable}]`;

        elem.textContent = textContent;
    } catch (error) {}
}

function updateMessagesWithDatetime(resp, user) {
    if (DEBUG_MESSAGES) {
        console.clear();
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} str
     * @returns {string}
     */
    function convert(str) {
        str = str.replace(/&#(?:x([\da-f]+)|(\d+));/gi, function (_, hex, dec) {
            return String.fromCharCode(dec || +('0x' + hex));
        });

        str = str
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&quot;/gi, `"`)
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>');

        return str;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} userId
     * @param {[]} messages
     * @param {string} messageType
     * @param {HTMLElement} elem
     */
    function findMessage(userId, messages, messageType, elem) {
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            let gifSource = getGifSource(elem);
            let audioSource = getAudioSource(elem);

            if (messageType == 'sent' && message.from_person_id == userId) {
                if (gifSource.length > 0) {
                    let match = /embed\/(.+)/.exec(message.mssg);

                    if (match && gifSource[0].src.includes(match[1])) {
                        return message;
                    }
                } else if (audioSource.length > 0) {
                    if (message?.multimedia?.audio?.url == audioSource[0].src) {
                        return message;
                    }
                } else if (convert(message.mssg) == elem.textContent) {
                    return message;
                }
            } else if (messageType == 'received' && message.to_person_id == userId) {
                if (gifSource.length > 0) {
                    let match = /embed\/(.+)/.exec(message.mssg);

                    if (match && gifSource[0].src.includes(match[1])) {
                        return message;
                    }
                } else if (audioSource.length > 0) {
                    if (message?.multimedia?.audio?.url == audioSource[0].src) {
                        return message;
                    }
                } else if (convert(message.mssg) == elem.textContent) {
                    return message;
                }
            }
        }
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {HTMLElement} elem
     * @returns {HTMLSourceElement[]}
     */
    function getGifSource(elem) {
        return Array.from(elem.querySelectorAll('.message-gif > video > source'));
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {HTMLElement} elem
     * @returns {HTMLAudioElement[]}
     */
    function getAudioSource(elem) {
        return Array.from(elem.querySelectorAll('audio'));
    }

    let userId = user.user_id;

    /** @type {[]} */
    let messages = resp.body[0].client_open_chat.chat_messages;
    let index = 0;
    let messagesSelector = '.messages-list__conversation > .message > div > div > div > .message-bubble__text, .messages-list__conversation > .message > div > div > div > .message-gif__media, .messages-list__conversation > .message > div > div > .message-audio';

    async function arriveWorker(ev) {
        /** @type {HTMLElement} */
        let elem = ev;

        while (!(elem.classList.contains('message--out') || elem.classList.contains('message--in'))) {
            elem = elem.parentElement;
        }

        // let elem = ev.parentElement.parentElement.parentElement.parentElement;

        try {
            let sent = elem.className.includes('out');
            let received = elem.className.includes('in');
            let messageType = sent ? 'sent' : 'received';

            let foundMessage = findMessage(userId, messages, messageType, elem);

            if (DEBUG_MESSAGES) {
                logger.debug(`${sent ? '<-' : '->'} :: ${foundMessage ? foundMessage.mssg : null}`);
                logger.debug(elem);
                logger.debug('');
            }

            if (foundMessage) {
                try {
                    let date = new Date(0);

                    date.setUTCSeconds(foundMessage.date_created);

                    elem.setAttribute('title', moment(date).format('ddd MMM Do yyyy h:mm A'));
                } catch (error2) {
                    logger.error('[akkd.error2]', error2);
                }
            }
        } catch (error1) {
            logger.error('[akkd.error1]', error1);
        }

        index++;
    }

    // .messages-list__conversation > .message
    $(document).unbindArrive(messagesSelector);
    $(document).arrive(messagesSelector, arriveWorker);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} selector
 * @param {string} clazz
 * @param {[]} matches
 */
async function updateOnlineStatus(selector, clazz, matches) {
    try {
        /** @type {HTMLElement[]} */
        let elems = (document.querySelector(selector) || { children: [] }).children;

        elems.forEach(async (elem) => {
            let onlineStatusElem = elem.querySelector(`.${clazz}`);
            let onlineStatusElemExists = onlineStatusElem != null;

            let uidElem = [elem, ...Array.from(elem.querySelectorAll('li, div'))].find((e) => e.hasAttribute('data-qa-uid'));

            let match = matches.find((match) => match.user_id === (uidElem ? uidElem.getAttribute('data-qa-uid') : null));

            if (!match) {
                return;
            }

            elem.setAttribute('data-qa-online-status', match.online_status);

            let div = makeOnlineStatusSVG(clazz, match.online_status, onlineStatusElem);

            if (!onlineStatusElemExists) {
                uidElem.append(div);
            }

            let user = bumbleUsersCurrent.find((user) => user.user_id === (uidElem ? uidElem.getAttribute('data-qa-uid') : null));

            if (user.time_since_last_seen_h != null && user.time_since_last_seen_h != undefined) {
                7;
                div.parentElement.setAttribute(
                    'title',
                    `Last seen: ${user.time_since_last_seen_h}
${user.last_seen_dt}`
                );
            }

            try {
                await playOnlineSound(user);
            } catch (error) {}
        });
    } catch (err) {
        logger.error(err);
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 */
async function updateOnlineStatusChat() {
    return;

    try {
        let elem = $('.page__content > .messages-header > .messages-header__inner > .messages-header__content .header-2')[0];
        let userId = findKeyPathsFuzzy($('.page__content')[0], 'userId')[0].value;
        let name = findKeyPathsFuzzy($('.page__content')[0], 'chatUser')[0].value.name;

        let user = bumbleUsersNew.find((user) => user.user_id === userId);

        let color;

        switch (user.online_status) {
            case 1:
                // online
                color = 'green';

                break;

            case 2:
                // ??
                color = 'yellow';

                break;

            case 3:
                // offline
                color = 'grey';

                break;

            default:
                // offline
                color = 'grey';

                break;
        }

        elem.style.color = color;
    } catch (err) {}
}

/** @type {{ name: string; userId: string; timePlayed: number; }[]} */
let playedNames = [];

// #region Notify User

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {BumbleUser} user
 */
async function playOnlineSound(user) {
    if (GM_config.get('play_users_to_monitor_sound', true)) {
        /** @type {{ userId: string, name: string }[]} */
        let usersToMonitor = JSON.parse(GM_config.get('users_to_monitor'));

        for (let i = 0; i < usersToMonitor.length; i++) {
            const userId = usersToMonitor[i].userId;

            if (!findPlayedName(user.user_id) && user.online_status == 1 && user.user_id == userId) {
                let imgUrl = (await testUrl(user.profile_photo_preview_url)) ? user.profile_photo_preview_url : user.profile_photo_large_url;

                notifyUser(user.name, imgUrl, user.user_id);

                localStorage.setItem('users', ESSerializer.serialize(bumbleUsersCurrent));

                playedNames.push({
                    name: userId,
                    userId: user.user_id,
                    timePlayed: new Date().getTime(),
                });
            } else if (findPlayedName(user.user_id) && user.online_status !== 1 && user.user_id == userId) {
                playedNames = playedNames.filter((x) => x.userId !== user.user_id);
            }
        }
    }
}

async function testUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });

        return response.ok;
    } catch (error) {
        logger.error(`Error testing ${url}: ${error.message}`);

        return false;
    }
}

function findPlayedName(userId) {
    return playedNames.find((x) => x.userId == userId);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} userName
 * @param {string} imgUrl
 * @param {string} userId
 */
function notifyUser(userName, imgUrl, userId) {
    /** @type {NotificationOptions} */
    let notificationOptions = {
        body: `${userName} is online`,
        icon: imgUrl,
    };

    /** @type {Notification} */
    let notification;

    if (!('Notification' in window)) {
        window.focus();

        alert('This browser does not support desktop notification');

        return;
    } else if (Notification.permission === 'granted') {
        notification = new Notification('Bumble', notificationOptions);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                notification = new Notification('Bumble', notificationOptions);
            }
        });
    }

    notification.onclick = async function () {
        window.focus();

        for (let i = 0; i < 5; i++) {
            setTimeoutEx(() => {
                openChat(userId);
            }, 100 * i);
        }
    };

    try {
        playBeep();
    } catch (error) {}
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{ userId: string, name: string }[]} usersToMonitor
 * @param {string} userId
 * @returns {{ userId: string, name: string } | undefined}
 */
function findUserToMonitor(usersToMonitor, userId) {
    return usersToMonitor.find((user) => user.userId == userId);
}

function setupUserMonitorDropdown() {
    let selector = '.page__content';

    // Options for the observer (which mutations to observe)
    let config = { characterData: true, attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    let callback = (mutationList, observer) => {
        if ($('.page__content > .messages-header > .messages-header__inner > .messages-header__content .header-2').length > 0) {
            let optionsContainer = $('.page__content > .messages-header > .messages-header__inner > .messages-header__menu .options');

            if (optionsContainer.length > 0) {
                optionsContainer = optionsContainer[0];

                if ($('#akkd-notify-option').length > 0) {
                    $('#akkd-notify-option')[0].remove();
                }

                let userId = findKeyPathsFuzzy($('.page__content')[0], 'userId')[0].value;
                let name = findKeyPathsFuzzy($('.page__content')[0], 'chatUser')[0].value.name;
                let usersToMonitor = JSON.parse(GM_config.get('users_to_monitor'));
                let user = findUserToMonitor(usersToMonitor, userId);

                let optionText = user ? 'Remove from monitor' : 'Add to monitor';

                let elem = document.createElement('div');

                elem.innerHTML = `
        <div class="option " data-qa-role="option" data-qa-value="FOLDER_ONLINE", id="akkd-notify-option">
            <div class="option__text">
                <div class="p-2 text-ellipsis text-break-words">
                    <span>${optionText}</span>
                </div>
            </div>
        </div>`;

                elem = elem.children[0];

                elem.addEventListener('click', async (ev) => {
                    let usersToMonitor = JSON.parse(GM_config.get('users_to_monitor'));

                    if (user) {
                        usersToMonitor = usersToMonitor.filter((u) => u.userId != userId);
                        playedNames = playedNames.filter((x) => x.userId !== userId);
                    } else {
                        usersToMonitor.push({ userId, name });
                    }

                    GM_config.set('users_to_monitor', JSON.stringify(usersToMonitor, null, 4));
                    GM_config.set('valid_users_to_monitor', GM_config.get('users_to_monitor'));
                    GM_config.save();
                });

                getWindow().akkd_observer2.disconnect();

                optionsContainer.append(elem);

                getWindow().akkd_observer2.observe($(selector)[0], config);

                updateOnlineStatusChat();
            }
        }
    };

    try {
        getWindow().akkd_observer2.disconnect();
    } catch (error) {}

    // Create an observer instance linked to the callback function
    getWindow().akkd_observer2 = new MutationObserver(callback);

    getWindow().akkd_observer2.observe($(selector)[0], config);
}

// #endregion Notify User

async function updateOnlineStatuses() {
    await updateUserLists();

    await updateEncountersLists();

    // Carousel
    await updateOnlineStatus('.scrollable-carousel__scroll', 'show-bumble-carousel-online', queue);

    // Messages
    await updateOnlineStatus('.scroll__inner', 'show-bumble-msgs-online', convos);

    // Chat
    updateOnlineStatusChat();
}

function setupUserMsgCarouselArrive() {
    $(document).arrive('.contact, .scrollable-carousel-item', async function (ev) {
        await updateOnlineStatuses();
    });
}

function deserializeUsers() {
    let bumbleUsersCurrentSerialized = localStorage.getItem('users');

    bumbleUsersCurrent = bumbleUsersCurrentSerialized ? ESSerializer.deserialize(bumbleUsersCurrentSerialized, [BumbleUser]) : [];

    return bumbleUsersCurrent;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {[]} users
 * @returns {*}
 */
async function createBumbleUsers(users) {
    deserializeUsers();

    bumbleUsersNew = [];

    for (let i = 0; i < bumbleUsersCurrent.length; i++) {
        let user = bumbleUsersCurrent[i];

        user.updateLastSeen();

        // if (currentUser.length > 0) {

        // }

        // await playOnlineSound(user);

        // bumbleUsersNew.push(user);
    }

    for (let i = 0; i < users.length; i++) {
        let user = new BumbleUser(users[i]);
        let currentUser = bumbleUsersCurrent.filter((x) => x.user_id == user.user_id);

        if (currentUser.length > 0) {
            user = currentUser[0].updateProps(user);
        }

        await playOnlineSound(user);

        bumbleUsersNew.push(user);
    }

    for (let i = 0; i < bumbleUsersNew.length; i++) {
        const userNew = bumbleUsersNew[i];

        let currentUserIndex = bumbleUsersCurrent.findIndex((x) => x.user_id == userNew.user_id);

        if (currentUserIndex > -1) {
            bumbleUsersCurrent[currentUserIndex] = userNew;
        } else {
            bumbleUsersCurrent.push(userNew);
        }
    }

    localStorage.setItem('users', ESSerializer.serialize(bumbleUsersCurrent));

    getWindow().bumbleUsersCurrent = bumbleUsersCurrent;
    getWindow().bumbleUsersNew = bumbleUsersNew;

    firstBumbleCreations = false;
}

async function updateUserLists() {
    if (!updateing) {
        updateing = true;

        let body = JSON.stringify({
            $gpb: 'badoo.bma.BadooMessage',
            body: [
                {
                    message_type: 245,
                    server_get_user_list: {
                        user_field_filter: {
                            projection: [200, 210, 340, 230, 640, 580, 300, 860, 280, 590, 591, 250, 700, 762, 592, 880, 582, 930, 585, 583, 305, 330, 763, 1423, 584, 1262, 911, 912],
                        },
                        preferred_count: 1000,
                        folder_id: 0,
                    },
                },
            ],
            message_id: lastestMessageId++,
            message_type: 245,
            version: 1,
            is_background: false,
        });

        let res = await fetch('https://bumble.com/mwebapi.phtml?SERVER_GET_USER_LIST', {
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-message-type': '245',
                'x-pingback': calculateBumbleChecksum(body),
                'x-use-session-cookie': '1',
            },
            referrer: 'https://bumble.com/app/connections',
            referrerPolicy: 'origin-when-cross-origin',
            body: body,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        });

        let resp = await res.json();

        try {
            let sections = resp.body[0].client_user_list.section;

            for (let i = 0; i < sections.length; i++) {
                let section = sections[i];
                let sectionName = section.name;

                if (section.users) {
                    await createBumbleUsers(section.users);

                    if (sectionName == 'Conversations') {
                        convos = [];

                        if (section.users) {
                            convos.push(...section.users);
                        }
                    } else if (sectionName == 'Match Queue') {
                        queue = [];

                        if (section.users) {
                            queue.push(...section.users);
                        }
                    }
                }
            }
        } catch (error) {}

        setTimeoutEx(() => {
            updateing = false;
        }, 5000);
    }
}

async function updateEncountersLists(force = false) {
    if (!updateingEncounters || force) {
        updateingEncounters = true;

        let body = JSON.stringify({
            $gpb: 'badoo.bma.BadooMessage',
            body: [
                {
                    message_type: 81,
                    server_get_encounters: {
                        number: 10,
                        context: 1,
                        user_field_filter: {
                            projection: [10, 11, 71, 91, 93, 100, 200, 210, 220, 230, 231, 250, 280, 291, 300, 305, 310, 330, 340, 370, 380, 490, 493, 530, 540, 560, 570, 580, 582, 583, 584, 585, 590, 591, 592, 640, 662, 700, 732, 762, 763, 860, 880, 890, 911, 912, 930, 1140, 1150, 1160, 1161, 1262, 1423],
                            request_albums: [
                                {
                                    album_type: 7,
                                },
                                {
                                    album_type: 12,
                                    external_provider: 12,
                                    count: 8,
                                },
                            ],
                            game_mode: 0,
                            request_music_services: {
                                top_artists_limit: 8,
                                supported_services: [29],
                                preview_image_size: {
                                    width: 120,
                                    height: 120,
                                },
                            },
                        },
                    },
                },
            ],
            message_id: lastestMessageId++,
            message_type: 81,
            version: 1,
            is_background: false,
        });

        let res = await fetch('https://bumble.com/mwebapi.phtml?SERVER_GET_ENCOUNTERS', {
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/json',
                'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-message-type': '81',
                'x-pingback': calculateBumbleChecksum(body),
                'x-use-session-cookie': '1',
            },
            referrer: 'https://bumble.com/app',
            referrerPolicy: 'origin-when-cross-origin',
            body: body,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        });

        let resp = await res.json();

        try {
            numEncountersCalls++;

            if ('results' in resp.body[0].client_encounters) {
                encs = [];

                encs.push(...resp.body[0].client_encounters.results);

                quota = (resp.body[0].client_encounters.quota || {}).yes_votes_quota || 0;

                updateBackToBanner(encs.length);
            } else if ('user_substitutes' in resp.body[0].client_encounters) {
                updateBackToBanner(0);
            }

            // responseText = JSON.stringify(resp);
        } catch (error) {}

        setTimeoutEx(() => {
            updateingEncounters = false;
        }, 2000);
    }
}

function setupSidebarArrive() {
    $(document).arrive('.sidebar-action-banner', async function (ev) {
        await updateEncountersLists(true);
    });
}

function setupBiggerProfilePictures() {
    GM_addStyle(`.gallery-preview__media-image {
    max-width: 110% !important;
    max-height: 110% !important;
}

.gallery__preview {
    max-height: 100% !important;
}

.dialog-layout .gallery__close {
    height: 64px !important;
}
`);
}

function actionFunction(jNode) {
    let x = document.getElementsByClassName('profile__photo');

    for (let i = 0; i < x.length; i++) {
        let src = x[i].src;
        let slug = src.split('&size')[0];

        let elemHtml = `<li class="profile__badge">
  <div class="pill">
      <div class="pill__title">
          <div class="p-3 text-ellipsis font-weight-medium">
              <a href="${slug}" style="text-decoration:underline;color:#454650;" target="_blank">Pic ${i}</a>
          </div>
      </div>
  </div>
</li>
`;

        $('.profile__badges').append(elemHtml);
    }
}

function setupModifyRequestHeaders() {
    // hook and generate fake 'responseText'
    xhook.before(function (request) {
        let projection = findNestedObject(request.headers, 'projection');

        if (projection) {
            logger.debug(projection);

            // xhook.updateRequestHeaders(request, {
            //     'Cache-Control': 'no-store', // no-store', // , no-cache
            //     // pragma: 'no-cache',
            //     // Cache-Control: no-cache, no-transform
            // });
        }

        // if (request.url.includes('board-response')) {
        //     xhook.updateRequestHeaders(request, {
        //         'Cache-Control': 'no-store', // no-store', // , no-cache
        //         // pragma: 'no-cache',
        //         // Cache-Control: no-cache, no-transform
        //     });

        //     request.url = `${request.url}&t=${new Date().valueOf()}`;
        // }
    });
}

function initNewSection() {
    function setupNewSection() {
        try {
            let akkdSections = Array.from(document.querySelectorAll('.akkd-section'));

            if (akkdSections.length > 0) {
                akkdSections.forEach((elem) => {
                    elem.remove();
                });
            }

            let storySection = document.querySelectorAll('.encounters-story-profile')[0];
            let aboutSectionHeader = document.querySelectorAll('.encounters-story-section__heading')[0].cloneNode(true);
            let aboutSection = document.querySelectorAll('.encounters-story-about__badges')[0].cloneNode(true);

            let locationSectionHeader = document.querySelectorAll('.encounters-story-section.encounters-story-section--location')[0].firstChild.cloneNode(true);
            let locationSection = document.querySelectorAll('.location-widget.location-widget--align-center')[0].cloneNode(true);

            let childElems = [
                { elem: aboutSectionHeader, isTitle: true },
                { elem: aboutSection, isTitle: false },
                { elem: locationSectionHeader, isTitle: true },
                { elem: locationSection, isTitle: false },
            ];

            childElems.forEach((elem) => {
                elem.elem.classList.add('akkd-section');

                storySection.appendChild(elem.elem);

                elem.elem.style.paddingTop = '10px';

                if (!elem.isTitle) {
                    elem.elem.style.paddingBottom = '10px';
                }
            });

            Array.from(aboutSection.querySelectorAll('.encounters-story-about__badge')).forEach((elem) => {
                elem.style.margin = 'unset';
            });

            Array.from(locationSection.querySelectorAll('.header-2.text-color-black')).forEach((elem) => {
                elem.style.fontSize = '16px';
            });
        } catch (error) {}
    }

    function setupMutationObserver02(encountersUserFrame) {
        if (getWindow().akkd_observer) {
            try {
                getWindow().akkd_observer.disconnect();
            } catch (error) {}
        }

        // Options for the observer (which mutations to observe)
        let config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        let callback = (mutationList, observer) => {
            for (let m = 0; m < mutationList.length; m++) {
                let mutation = mutationList[m];

                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    let addedNode = mutation.addedNodes[i];

                    try {
                        let classList = Array.from(addedNode.classList);

                        if (classList.includes('encounters-album__stories-container') || classList.includes('encounters-album anim-enter-done') || classList.includes('encounters-album__progress')) {
                            setupNewSection();
                        }
                    } catch (error) {}
                }
            }
        };

        // Create an observer instance linked to the callback function
        getWindow().akkd_observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        // let encountersUserFrame = document.querySelectorAll('.encounters-user__frame')[0];

        getWindow().akkd_observer.observe(encountersUserFrame, config);
    }

    if (document.querySelectorAll('body').length == 0) {
        setTimeoutEx(() => {
            initNewSection();
        }, 100);
    } else {
        // Options for the observer (which mutations to observe)
        let config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        let callback = (mutationList, observer) => {
            for (let m = 0; m < mutationList.length; m++) {
                let mutation = mutationList[m];

                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    let addedNode = mutation.addedNodes[i];

                    try {
                        if (Array.from(addedNode.classList).includes('encounters-user__frame')) {
                            setupNewSection();
                            setupMutationObserver02(addedNode);
                        }
                    } catch (error) {}
                }
            }
        };

        // Create an observer instance linked to the callback function
        let observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(document.querySelectorAll('body')[0], config);

        setupNewSection();
    }
}

function setupLocationIntercept() {
    const watchPosition = unsafeWindow.navigator.geolocation.watchPosition;
    const handlers = {};

    unsafeWindow.navigator.geolocation.watchPosition = function (cb1, cb2, options) {
        // We need to return a handler synchronously, but decide whether we'll use the real watchPosition or not
        // asynchronously. So we create our own handler, and we'll associate it with the real one later.
        const handler = Math.floor(Math.random() * 10000);

        handlers[handler] = watchPosition.apply(navigator.geolocation, [
            (position) => {
                let latitude = 26.181744177358595;
                let longitude = -80.16515493392944;

                let newPosition = {
                    coords: {
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        latitude: latitude,
                        longitude: longitude,
                        speed: position.coords.speed,
                    },
                    timestamp: position.timestamp,
                };

                cb1(newPosition);
            },
            (error) => {
                cb2(error);
            },

            options,
        ]);

        return handler;
    };

    const clearWatch = unsafeWindow.navigator.geolocation.clearWatch;

    unsafeWindow.navigator.geolocation.clearWatch = function (handler) {
        if (handler in handlers) {
            clearWatch.apply(navigator.geolocation, [handlers[handler]]);

            delete handlers[handler];
        }
    };
}

let saveContainerLeft;
let saveContainerTop;

function createLastSeenTablePopup() {
    function generateFloatingTable(arr) {
        // Create the container element
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = saveContainerTop ? `${saveContainerTop}px` : '50%';
        container.style.left = saveContainerLeft ? `${saveContainerLeft}px` : '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '9999';
        container.style.overflow = 'none';
        container.style.maxHeight = '80vh';
        container.style.backgroundColor = '#333333';
        container.style.border = '1px solid black';
        container.style.minWidth = `460.3px !important`;
        container.id = 'akkd-users-table';

        // Create the title bar
        const titleBar = document.createElement('div');
        titleBar.style.cursor = 'move';
        titleBar.style.padding = '8px';
        titleBar.style.userSelect = 'none';
        titleBar.style.backgroundColor = '#ccc';
        titleBar.style.textAlign = 'center'; // Center text alignment
        titleBar.style.borderBottom = '1px solid black';
        titleBar.textContent = 'Matches';

        const container2 = document.createElement('div');
        container2.style.overflow = 'auto';
        container2.style.maxHeight = '70vh';
        container2.style.border = '1px solid black';

        // Create the table element
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        // table.style.border = '1px solid black';

        // Create the table header row
        const headerRow = document.createElement('tr');
        const keys = Object.keys(arr[0]);
        keys.forEach((key) => {
            if (['name', 'last_seen'].includes(key)) {
                const th = document.createElement('th');
                th.textContent = key;
                th.style.border = '1px solid black';
                th.style.padding = '8px';
                headerRow.appendChild(th);
            }
        });
        table.appendChild(headerRow);

        createRows(arr, table);

        // Add table to the container
        container.appendChild(titleBar);
        container2.appendChild(table);
        container.appendChild(container2);

        let intervalId = setIntervalEx(() => {
            let users = getLatestUsers();

            // Remove all rows from the table
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            createRows(users, table);
        }, 5000);

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.margin = '16px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(container);

            try {
                clearIntervalEx(intervalId);
            } catch (error) {}
        });
        container.appendChild(closeButton);

        let isOpacityOn = true;

        // Create close button
        const opacityButton = document.createElement('button');
        opacityButton.textContent = 'Turn Opacity On/Off';
        opacityButton.style.margin = '16px';
        opacityButton.style.marginRight = 'auto';
        opacityButton.style.right = '16px';
        opacityButton.style.position = 'absolute';
        opacityButton.addEventListener('click', () => {
            isOpacityOn = !isOpacityOn;
        });
        container.appendChild(opacityButton);

        // Add event listeners for dragging the container
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - container.offsetLeft;
            startY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newLeft = e.clientX - startX;
                const newTop = e.clientY - startY;

                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const maxLeft = windowWidth - containerWidth / 2;
                const maxTop = windowHeight - containerHeight / 2;

                const maxRight = maxLeft * 1;
                const maxBottom = maxTop * 1;

                const boundedLeft = Math.max(containerWidth / 2, Math.min(newLeft, maxLeft));
                const boundedTop = Math.max(containerHeight / 2, Math.min(newTop, maxTop));

                saveContainerTop = boundedTop;
                saveContainerLeft = boundedLeft;

                container.style.left = `${boundedLeft}px`;
                container.style.top = `${boundedTop}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        container.addEventListener('mouseenter', () => {
            container.style.opacity = 1;
        });
        container.addEventListener('mouseleave', () => {
            if (isDragging) {
                return;
            }

            if (!isOpacityOn) return;

            container.style.opacity = 0.25;
        });

        // Add a mousemove event listener to the document
        document.addEventListener('mousemove', handleMouseMove);

        // Mousemove event handler
        function handleMouseMove(event) {
            // Check if the element contains the mouse coordinates
            if (container.contains(event.target)) {
                // Mouse is over the element
                container.style.opacity = 1;
            } else {
                // Mouse is not over the element
                if (isDragging) {
                    return;
                }

                if (!isOpacityOn) return;

                container.style.opacity = 0.25;
            }
        }

        // Add container to the body of the document
        document.body.appendChild(container);
    }

    function createRows(arr, table) {
        const keys = Object.keys(arr[0]);

        // Create table rows for each object
        arr.forEach((obj) => {
            const row = document.createElement('tr');
            keys.forEach((key) => {
                if (['name', 'last_seen'].includes(key)) {
                    const td = document.createElement('td');

                    if (key == 'name') {
                        const a = document.createElement('a');

                        // a.href = `javascript:openChat(${obj['user_id']});`;
                        a.href = '#';
                        a.addEventListener('click', () => {
                            openChat(obj['user_id']);
                        });
                        a.textContent = obj[key];
                        a.style.color = getColorForOnlineStatus(obj);
                        td.appendChild(a);
                    } else {
                        td.textContent = obj[key];
                    }

                    td.style.border = '1px solid black';
                    td.style.padding = '8px';
                    row.appendChild(td);
                }
            });
            table.appendChild(row);
        });
    }

    function sortObjectsWithNullLast(arr, key, order = 'asc') {
        const sortedArr = arr.slice(); // Create a shallow copy of the array

        sortedArr.sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];

            if (valueA === null && valueB !== null) {
                return 1; // `null` values are considered greater, so `a` comes after `b`
            } else if (valueA !== null && valueB === null) {
                return -1; // `null` values are considered greater, so `a` comes before `b`
            } else {
                // Both values are either `null` or non-`null`, use regular comparison
                if (order === 'asc') {
                    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else if (order === 'desc') {
                    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
                } else {
                    throw new Error('Invalid sort order. Please provide "asc" or "desc".');
                }
            }
        });

        return sortedArr;
    }

    function logPropertiesInEvenColumns(arr) {
        const keys = Object.keys(arr[0]);

        // Calculate the maximum length of each property value
        const maxLengths = {};

        keys.forEach((key) => {
            maxLengths[key] = Math.max(...arr.map((obj) => String(obj[key]).length));
        });

        // Log the properties in even columns
        arr.forEach((obj) => {
            let output = '';
            keys.forEach((key, index) => {
                const value = String(obj[key]);
                const padding = ' '.repeat(maxLengths[key] - value.length);
                output += `${key}: ${value}${padding}  ${index % 2 !== 0 ? '\t' : ''}`;
            });
            logger.debug(output);
        });
    }

    function getLatestUsers() {
        let users = sortObjectsWithNullLast(bumbleUsersCurrent.slice(), 'time_since_last_seen', 'asc').map((x, index) => {
            return {
                name: x.name,
                last_seen: x.time_since_last_seen_h,
                user_id: x.user_id,
                online_status: x.online_status,
                time_since_last_seen: x.time_since_last_seen,
            };
        });

        return users;
    }

    function getColorForOnlineStatus(user) {
        if (user['time_since_last_seen'] != 0) return 'grey';

        switch (user['online_status']) {
            case 1:
                // online
                return 'green';

            case 2:
                // ??
                return 'yellow';

            case 3:
                // offline
                return 'grey';

            default:
                // offline
                return 'grey';
        }
    }

    generateFloatingTable(getLatestUsers());
}

// #region Conversation Option

function addConversationOption() {
    let isShowOnline = false;
    let showOnlineContactsIntervalId;

    $(document).arrive('.contact-tabs__section-header-dropdown', async function (ev) {
        let optionsContainer = document.querySelectorAll('.contact-tabs__section-header-dropdown > .dropdown')[0].querySelectorAll('.options')[0];
        let elem = document.createElement('div');

        elem.innerHTML = `<div class="option " data-qa-role="option" data-qa-value="FOLDER_ONLINE"><div class="option__text"><div class="p-2 text-ellipsis text-break-words">Online</div></div></div>`;

        elem = elem.children[0];

        elem.addEventListener('click', async (ev) => {
            isShowOnline = !isShowOnline;

            try {
                clearIntervalEx(showOnlineContactsIntervalId);
            } catch (error) {}

            if (isShowOnline) {
                $('.contact-tabs__section.contact-tabs__section--conversations .contact-tabs__section-title-text span')[0].style.color = 'green';

                await _showOnlyOnlineContactsScroll();

                showOnlineContactsIntervalId = setIntervalEx(async () => {
                    _showOnlyOnlineContacts();
                }, 1000);
            } else {
                $(document.querySelectorAll('.contact-tabs__section-content .scroll__inner')[0]).unbindArrive('.contact');

                _showAllContacts();

                $('.contact-tabs__section.contact-tabs__section--conversations .contact-tabs__section-title-text span')[0].style.color = '';
            }

            setTimeoutEx(() => {
                document.querySelectorAll('.contact-tabs__section-header-dropdown > .dropdown')[0].classList.remove('is-active');
            }, 1);

            document.querySelectorAll('.contact-tabs__section-header-dropdown > .dropdown')[0].classList.remove('is-active');
        });

        optionsContainer.append(elem);
    });
}

async function _showOnlyOnlineContactsScroll() {
    /** @type {HTMLElement} */
    let contactsContainer = document.querySelectorAll('.contact-tabs__section-content .scroll__inner')[0];

    let previousScrollTop;
    let tries = 0;
    let maxTries = 250;

    async function arriveWorker(ev) {
        // index++;

        if (!ev.classList.contains('is-loading')) {
            _showOnlyOnlineContacts();
        }
    }

    // .messages-list__conversation > .message
    $(contactsContainer).unbindArrive('.contact');

    // showOnlyOnlineContacts();

    do {
        previousScrollTop = contactsContainer.scrollTop;

        contactsContainer.scrollTo({ top: contactsContainer.scrollHeight, behavior: 'auto' });

        await wait(1);

        _showOnlyOnlineContacts();

        if (previousScrollTop != contactsContainer.scrollTop) {
            tries = 0;
        } else {
            tries++;
        }
    } while (previousScrollTop != contactsContainer.scrollTop || tries < maxTries);

    contactsContainer.scrollTo({ top: 0, behavior: 'auto' });

    // $(contactsContainer).unbindArrive('.contact');
    $(contactsContainer).arrive('.contact', arriveWorker);
}

async function _showAllContactsScroll() {
    /** @type {HTMLElement} */
    let contactsContainer = document.querySelectorAll('.contact-tabs__section-content .scroll__inner')[0];

    let previousScrollTop;
    let tries = 0;
    let maxTries = 250;

    async function arriveWorker(ev) {
        // index++;

        if (!ev.classList.contains('is-loading')) {
            _showOnlyOnlineContacts();
        }
    }

    // .messages-list__conversation > .message
    // $(contactsContainer).unbindArrive('.contact');

    // showOnlyOnlineContacts();

    do {
        previousScrollTop = contactsContainer.scrollTop;

        contactsContainer.scrollTo({ top: contactsContainer.scrollHeight, behavior: 'auto' });

        await wait(1);

        // _showOnlyOnlineContacts();

        if (previousScrollTop != contactsContainer.scrollTop) {
            tries = 0;
        } else {
            tries++;
        }
    } while (previousScrollTop != contactsContainer.scrollTop || tries < maxTries);

    contactsContainer.scrollTo({ top: 0, behavior: 'auto' });

    // $(contactsContainer).unbindArrive('.contact');
    // $(contactsContainer).arrive('.contact', arriveWorker);
}

function _showAllContacts() {
    /** @type {HTMLElement[]} */
    let contactElems = Array.from(document.querySelectorAll('.contact-tabs__section-content .scroll__inner .contact'));

    for (let i = 0; i < contactElems.length; i++) {
        const contactElem = contactElems[i];

        contactElem.style.display = 'flex';
    }
}

function _showOnlyOnlineContacts() {
    /** @type {HTMLElement[]} */
    let contactElems = Array.from(document.querySelectorAll('.contact-tabs__section-content .scroll__inner .contact'));

    for (let i = 0; i < contactElems.length; i++) {
        const contactElem = contactElems[i];

        let onlineStatus = parseInt(contactElem.getAttribute('data-qa-online-status'));

        if (onlineStatus != 1) {
            contactElem.style.display = 'none';
        } else {
            contactElem.style.display = 'flex';
        }
    }
}

// #endregion Conversation Option

function addCustomCss() {
    let cssStyles = [
        {
            css: /*css*/ `.contact.is-selected {
    pointer-events: auto !important;
    cursor: auto !important;
}

.scrollable-carousel-item.is-selected {
    pointer-events: auto !important;
    cursor: auto !important;
}

#akkd-users-table {
    min-width: 458.663px !important;
    transition: opacity 0.1s linear 0s;
}

div#akkd-users-table button {
    background-color: rgba(30, 30, 30, .55);
    padding: 8px;
    border-radius: 5px;
    transition: background-color 0.1s linear 0s;
}

div#akkd-users-table button:hover {
    background-color: rgba(30, 30, 30, .85);
}

div#akkd-users-table button:active {
    background-color: rgba(30, 30, 30, .35);
}
`,
            node: document.documentElement,
        },
    ];

    addStyles(cssStyles);
}

function setupConfig() {
    // demo: http://sizzlemctwizzle.github.io/GM_config/
    GM_config.init({
        id: `main-${location.host.replace(/\./g, '_')}`,
        title: 'Bumble Enhanced Config',

        fields: {
            play_users_to_monitor_sound: {
                label: 'Play Users To Monitor Sound',
                type: 'checkbox',
                default: true,
            },

            users_to_monitor: {
                label: 'Users To Monitor',
                type: 'textarea',
                title: 'Enter JSON array string',
                default: '["Example1", "Exmaple2"]',
                save: false, // This field's value will NOT be saved
            },

            valid_users_to_monitor: {
                type: 'hidden',
                default: '',
            },
        },

        events: {
            init: function () {
                // Set the value of the dummy field to the saved value
                GM_config.set('users_to_monitor', GM_config.get('valid_users_to_monitor'));
            },
            open: function () {
                // Use a listener to update the hidden field when the dummy field passes validation
                GM_config.fields['users_to_monitor'].node.addEventListener(
                    'change',
                    function () {
                        // get the current value of the visible field
                        var users_to_monitor = GM_config.get('users_to_monitor', true);

                        try {
                            JSON.parse(users_to_monitor);

                            // Only save valid CSS
                            GM_config.set('valid_users_to_monitor', users_to_monitor);
                        } catch (error) {}
                    },
                    false
                );
            },
            save: function (forgotten) {
                if (GM_config.isOpen) {
                    // If the values don't match then valid_users_to_monitor wasn't valid
                    if (forgotten.users_to_monitor == null || forgotten.users_to_monitor == undefined) {
                        GM_config.set('users_to_monitor', JSON.stringify(JSON.parse(GM_config.get('valid_users_to_monitor')), null, 4));
                    } else if (forgotten.users_to_monitor !== GM_config.get('valid_users_to_monitor')) {
                        GM_config.set('valid_users_to_monitor', '[]');
                        GM_config.set('users_to_monitor', '[]');
                    } else {
                        GM_config.set('users_to_monitor', JSON.stringify(JSON.parse(forgotten.users_to_monitor), null, 4));
                    }
                }
            },
            close: function () {
                logger.debug('users_to_monitor:           ', JSON.parse(GM_config.get('users_to_monitor')));
                logger.debug('play_users_to_monitor_sound:', GM_config.get('play_users_to_monitor_sound'));
                logger.debug('');
            },
            reset: function () {},
        },

        css: /*css*/ `
#main-bumble_com_field_users_to_monitor {
    width: calc(100% - 150px) !important;
    height: calc(100% - 150px) !important;
    resize: none;
}`,
    });

    let menuId = GM_registerMenuCommand(`Config`, () => {
        GM_config.open();
    });

    let menuId2 = GM_registerMenuCommand(`Last Seen Table`, () => {
        createLastSeenTablePopup();
    });
}

// #endregion Bumble Functions
