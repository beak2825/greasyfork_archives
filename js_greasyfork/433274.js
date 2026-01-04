// ==UserScript==
// @name         H-Virus modify by Stereo.K
// @namespace    T-Kanal
// @version      1.1
// @description  Pennergame Haustierbot
// @include      https://*pennergame.de*
// @downloadURL https://update.greasyfork.org/scripts/433274/H-Virus%20modify%20by%20StereoK.user.js
// @updateURL https://update.greasyfork.org/scripts/433274/H-Virus%20modify%20by%20StereoK.meta.js
// ==/UserScript==

//Functions
(function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);
"use strict";jQuery.base64=(function($){var _PADCHAR="=",_ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_VERSION="1.0";function _getbyte64(s,i){var idx=_ALPHA.indexOf(s.charAt(i));if(idx===-1){throw"Cannot decode base64"}return idx}function _decode(s){var pads=0,i,b10,imax=s.length,x=[];s=String(s);if(imax===0){return s}if(imax%4!==0){throw"Cannot decode base64"}if(s.charAt(imax-1)===_PADCHAR){pads=1;if(s.charAt(imax-2)===_PADCHAR){pads=2}imax-=4}for(i=0;i<imax;i+=4){b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6)|_getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&255,b10&255))}switch(pads){case 1:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&255));break;case 2:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join("")}function _getbyte(s,i){var x=s.charCodeAt(i);if(x>255){throw"INVALID_CHARACTER_ERR: DOM Exception 5"}return x}function _encode(s){if(arguments.length!==1){throw"SyntaxError: exactly one argument required"}s=String(s);var i,b10,x=[],imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8)|_getbyte(s,i+2);x.push(_ALPHA.charAt(b10>>18));x.push(_ALPHA.charAt((b10>>12)&63));x.push(_ALPHA.charAt((b10>>6)&63));x.push(_ALPHA.charAt(b10&63))}switch(s.length-imax){case 1:b10=_getbyte(s,i)<<16;x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_PADCHAR+_PADCHAR);break;case 2:b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8);x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_ALPHA.charAt((b10>>6)&63)+_PADCHAR);break}return x.join("")}return{decode:_decode,encode:_encode,VERSION:_VERSION}}(jQuery));
function seconds2time(seconds){var hours=Math.floor(seconds/3600);var minutes=Math.floor((seconds-(hours*3600))/60);var seconds=seconds-(hours*3600)-(minutes*60);var time="";if(hours!=0){time=hours+":"}if(minutes!=0||time!==""){minutes=(minutes<10&&time!=="")?"0"+minutes:String(minutes);time+=minutes+":"}if(time===""){time=seconds+"s"}else{time+=(seconds<10)?"0"+seconds:String(seconds)}return time}
function lzw_encode(s){var dict={};var data=(s+"").split("");var out=[];var currChar;var phrase=data[0];var code=256;for(var i=1;i<data.length;i++){currChar=data[i];if(dict[phrase+currChar]!=null){phrase+=currChar}else{out.push(phrase.length>1?dict[phrase]:phrase.charCodeAt(0));dict[phrase+currChar]=code;code++;phrase=currChar}}out.push(phrase.length>1?dict[phrase]:phrase.charCodeAt(0));for(var i=0;i<out.length;i++){out[i]=String.fromCharCode(out[i])}return out.join("")}function lzw_decode(s){var dict={};var data=(s+"").split("");var currChar=data[0];var oldPhrase=currChar;var out=[currChar];var code=256;var phrase;for(var i=1;i<data.length;i++){var currCode=data[i].charCodeAt(0);if(currCode<256){phrase=data[i]}else{phrase=dict[currCode]?dict[currCode]:(oldPhrase+currChar)}out.push(phrase);currChar=phrase.charAt(0);dict[code]=oldPhrase+currChar;code++;oldPhrase=phrase}return out.join("")}
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i}}return-1};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i}}return-1};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0))};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month]};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()]};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p}}return null};Date.prototype.clone=function(){return new Date(this.getTime())};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0)};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime()};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000)};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000)};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000)};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000)};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000)};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this};Date.prototype.addYears=function(value){return this.addMonths(value*12)};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this}var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds)}if(x.second||x.seconds){this.addSeconds(x.second||x.seconds)}if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes)}if(x.hour||x.hours){this.addHours(x.hour||x.hours)}if(x.month||x.months){this.addMonths(x.month||x.months)}if(x.year||x.years){this.addYears(x.year||x.years)}if(x.day||x.days){this.addDays(x.day||x.days)}return this};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}return true};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds")};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds")};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes")};Date.validateHour=function(n){return Date._validate(n,0,23,"hours")};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days")};Date.validateMonth=function(n){return Date._validate(n,0,11,"months")};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds")};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1}if(!x.second&&x.second!==0){x.second=-1}if(!x.minute&&x.minute!==0){x.minute=-1}if(!x.hour&&x.hour!==0){x.hour=-1}if(!x.day&&x.day!==0){x.day=-1}if(!x.month&&x.month!==0){x.month=-1}if(!x.year&&x.year!==0){x.year=-1}if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds())}if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds())}if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes())}if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours())}if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth())}if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear())}if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate())}if(x.timezone){this.setTimezone(x.timezone)}if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset)}return this};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0))};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun())};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth())};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1})};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()})};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff)};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff)};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000)};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1}var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53}else{w=52}}return w};Date.prototype.isDST=function(){return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D"};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST())};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s))};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2)}else{r=(n+10000).toString();return"+"+r.substr(1)}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()]};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()]};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return""}}):this._toString()};Date.now=function(){return new Date()};Date.today=function(){return Date.now().clearTime()};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c)};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c)};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n}return this.moveToDayOfWeek(n,this._orient)}};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i)}var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n}return this.moveToMonth(n,this._orient)}};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j)}var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s"}return this["add"+j](this._orient)}};var nf=function(n){return function(){this._dateElement=n;return this}};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de)}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ")};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern)};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern)};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern)};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern)};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th"}};(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'"}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)])}else{throw new $P.Exception(s);}}},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s)}},stoken:function(s){return _.rtoken(new RegExp("^"+s))},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s)}catch(e){qx.push(rx[0]);s=rx[1];continue}break}return[qx,s]}},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s)}catch(e){return[rx,s]}rx.push(r[0]);s=r[1]}return[rx,s]}},optional:function(p){return function(s){var r=null;try{r=p.call(this,s)}catch(e){return[null,s]}return[r[0],r[1]]}},not:function(p){return function(s){try{p.call(this,s)}catch(e){return[null,s]}throw new $P.Exception(s);}},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]]}:null},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx))}return rx},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s))}catch(e){r=cache[s]=e}if(r instanceof $P.Exception){throw r;}else{return r}}},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue}try{r=(px[i].call(this,s))}catch(e){r=null}if(r){return r}}throw new $P.Exception(s);}},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue}try{r=(px[i].call(this,s))}catch(e){throw new $P.Exception(s);}rx.push(r[0]);s=r[1]}return[rx,s]}},all:function(){var px=arguments,_=_;return _.each(_.optional(px))},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0]}return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s)}catch(e){break}rx.push(r[0]);try{q=d.call(this,r[1])}catch(ex){q=null;break}s=q[1]}if(!r){throw new $P.Exception(s);}if(q){throw new $P.Exception(q[1]);}if(c){try{r=c.call(this,r[1])}catch(ey){throw new $P.Exception(r[1]);}}return[rx,(r?r[1]:s)]}},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]]}},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)))},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s)}catch(e){continue}rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1])}catch(ex){last=true}}else{last=true}if(!last&&q[1].length===0){last=true}if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j])}}p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1]}}if(rx[1].length<best[1].length){best=rx}if(best[1].length===0){break}}if(best[0].length===0){return best}if(c){try{q=c.call(this,best[1])}catch(ey){throw new $P.Exception(best[1]);}best[1]=q[1]}return best}},forward:function(gr,fname){return function(s){return gr[fname].call(this,s)}},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]]}},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]]}},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}return rx}}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments)}else if(arguments[0]instanceof Array){args=arguments[0]}if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx}}else{return op.apply(null,arguments)}}};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]])}var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0])}else{return op.apply(null,arguments)}}};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]])}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]))}else{if(ax[i]){rx.push(ax[i])}}}return rx};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s)}},minute:function(s){return function(){this.minute=Number(s)}},second:function(s){return function(){this.second=Number(s)}},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase()}},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n)}else{this.timezone=s.toLowerCase()}}},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0])}},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1))}},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)))}},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break}}},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this)}}this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone})}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset})}return r},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null}for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this)}}if(this.now){return new Date()}var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod)}if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null}if(!this.unit){this.unit="day"}if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1}if(this.unit=="week"){this.unit="day";this.value=this.value*7}this[this.unit+"s"]=this.value*orient}return today.add(this)}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour}if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate()}if(this.month&&!this.day){this.day=1}return today.set(this)}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]))}fn=_C[keys]=_.any.apply(null,px)}return fn};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key])};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s}}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")))};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s}});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s}});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s}});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"")}});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter)};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s))};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt]}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s))}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact)});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0])};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]))}return _.any.apply(null,rx)}else{return _get(fx)}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r}}catch(e){}return g._start.call({},s)}}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null}try{r=Date.Grammar.start.call({},s)}catch(e){return null}return((r[1].length===0)?r[0]:null)};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s)}catch(e){return null}return((r[1].length===0)?r[0]:null)}};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s)};
(function($){var storageNode=$('<style rel="alternate stylesheet" type="text/css" />').appendTo('head')[0],sheet=storageNode.sheet?'sheet':'styleSheet',storage=storageNode[sheet],rules=storage.rules?'rules':'cssRules',remove=storage.deleteRule?'deleteRule':'removeRule',owner=storage.ownerNode?'ownerNode':'owningElement',reRule=/^([^{]+)\{([^}]*)\}/m,reStyle=/([^:]+):([^;}]+)/;storage.disabled=true;var $rule=$.rule=function(r,c){if(!(this instanceof $rule))return new $rule(r,c);this.sheets=$rule.sheets(c);if(r&&reRule.test(r))r=$rule.clean(r);if(typeof r=='object'&&!r.exec){setArray(this,r.get?r.get():r.splice?r:[r])}else{setArray(this,this.sheets.cssRules().get());if(r)return this.filter(r)}return this};$.extend($rule,{sheets:function(c){var o=c;if(typeof o!='object')o=$.makeArray(document.styleSheets);o=$(o).not(storage);if(typeof c=='string')o=o.ownerNode().filter(c).sheet();return o},rule:function(str){if(str.selectorText)return['',str.selectorText,str.style.cssText];return reRule.exec(str)},appendTo:function(r,ss,skip){switch(typeof ss){case'string':ss=this.sheets(ss);case'object':if(ss[0])ss=ss[0];if(ss[sheet])ss=ss[sheet];if(ss[rules])break;default:if(typeof r=='object')return r;ss=storage}var p;if(!skip&&(p=this.parent(r)))r=this.remove(r,p);var rule=this.rule(r);if(ss.addRule)ss.addRule(rule[1],rule[2]||';');else if(ss.insertRule)ss.insertRule(rule[1]+'{'+rule[2]+'}',ss[rules].length);return ss[rules][ss[rules].length-1]},remove:function(r,p){p=p||this.parent(r);if(p!=storage){var i=p?$.inArray(r,p[rules]):-1;if(i!=-1){r=this.appendTo(r,0,true);p[remove](i)}}return r},clean:function(r){return $.map(r.split('}'),function(txt){if(txt)return $rule.appendTo(txt+'}')})},parent:function(r){if(typeof r=='string'||!$.browser.msie)return r.parentStyleSheet;var par;this.sheets().each(function(){if($.inArray(r,this[rules])!=-1){par=this;return false}});return par},outerText:function(rule){return!rule||!rule.selectorText?'':[rule.selectorText+'{','\t'+rule.style.cssText,'}'].join('\n').toLowerCase()},text:function(rule,txt){if(txt!==undefined)rule.style.cssText=txt;return!rule?'':rule.style.cssText.toLowerCase()}});$rule.fn=$rule.prototype={pushStack:function(rs,sh){var ret=$rule(rs,sh||this.sheets);ret.prevObject=this;return ret},end:function(){return this.prevObject||$rule(0,[])},filter:function(s){var o;if(!s)s=/./;if(s.split){o=$.trim(s).toLowerCase().split(/\s*,\s*/);s=function(){var s=this.selectorText||'';return!!$.grep(s.toLowerCase().split(/\s*,\s*/),function(sel){return $.inArray(sel,o)!=-1}).length}}else if(s.exec){o=s;s=function(){return o.test(this.selectorText)}}return this.pushStack($.grep(this,function(e,i){return s.call(e,i)}))},add:function(rs,c){return this.pushStack($.merge(this.get(),$rule(rs,c)))},is:function(s){return!!(s&&this.filter(s).length)},not:function(n,c){n=$rule(n,c);return this.filter(function(){return $.inArray(this,n)==-1})},append:function(s){var rules=this,rule;$.each(s.split(/\s*;\s*/),function(i,v){if((rule=reStyle.exec(v)))rules.css(rule[1],rule[2])});return this},text:function(txt){return!arguments.length?$rule.text(this[0]):this.each(function(){$rule.text(this,txt)})},outerText:function(){return $rule.outerText(this[0])}};$.each({ownerNode:owner,sheet:sheet,cssRules:rules},function(m,a){var many=a==rules;$.fn[m]=function(){return this.map(function(){return many?$.makeArray(this[a]):this[a]})}});$.fn.cssText=function(){return this.filter('link,style').eq(0).sheet().cssRules().map(function(){return $rule.outerText(this)}).get().join('\n')};$.each('remove,appendTo,parent'.split(','),function(k,f){$rule.fn[f]=function(){var args=$.makeArray(arguments),that=this;args.unshift(0);return this.each(function(i){args[0]=this;that[i]=$rule[f].apply($rule,args)||that[i]})}});$.each(('each,index,get,size,eq,slice,map,attr,andSelf,css,show,hide,toggle,'+'queue,dequeue,stop,animate,fadeIn,fadeOut,fadeTo').split(','),function(k,f){$rule.fn[f]=$.fn[f]});function setArray(rule,elems){rule.length=0;Array.prototype.push.apply(rule,elems)}var curCSS=$.curCSS;$.curCSS=function(e,a){return('selectorText'in e)?e.style[a]||$.prop(e,a=='opacity'?1:0,'curCSS',0,a):curCSS.apply(this,arguments)};$rule.cache={};var mediator=function(original){return function(elm){var id=elm.selectorText;if(id)arguments[0]=$rule.cache[id]=$rule.cache[id]||{};return original.apply($,arguments)}};$.data=mediator($.data);$.removeData=mediator($.removeData);$(window).unload(function(){$(storage).cssRules().remove()})})(jQuery);

function print_r(x,max,sep,l){l=l||0;max=max||10;sep=sep||" ";if(l>max){return"[WARNING: Too much recursion]\n"}var i,r="",t=typeof x,tab="";if(x===null){r+="(null)\n"}else{if(t=="object"){l++;for(i=0;i<l;i++){tab+=sep}if(x&&x.length){t="array"}r+="("+t+") :\n";for(i in x){try{r+=tab+"["+i+"] : "+print_r(x[i],max,sep,(l+1))}catch(e){return"[ERROR: "+e+"]\n"}}}else{if(t=="string"){if(x==""){x="(empty)"}}r+="("+t+") "+x+"\n"}}return r};

//GM-Fake
var GM = false;

//GM_xmlhttpRequest
if(typeof GM_xmlhttpRequest == 'undefined'){
	function GM_responseObject(xhr){
		if(xhr){
			var xhrmap = {responseText:xhr.responseText,responseHeaders:xhr.getAllResponseHeaders(),statusText:xhr.statusText,status:xhr.status,readyState:xhr.readyState,};
			return xhrmap;
		}
		else return;
	}
	var GM_xmlhttpRequest = function(request){
		var map = {url:request.url};
		if(typeof request.data!='undefined'){
			map.type = request.method;
		}
		else{
			map.type='GET';
		}
		if(typeof request.data != 'undefined'){
			map.data=request.data;
		}
		if(typeof request.headers != 'undefined'){
			map.headers=request.headers;
		}
		if(typeof request.synchronous != 'undefined'){
			if(request.synchronous===true){
				map.async = false;
			}
			else{
				map.async = true;
			}
		}
		if(typeof request.onload != 'undefined'){
			if(typeof request.onreadystatechange == 'undefined'){
				request.onreadystatechange = function(obj){
					return;
				}
			}
			var success = function(data,textStatus,XMLHttpRequest){
				request.onload(GM_responseObject(XMLHttpRequest));
				request.onreadystatechange(GM_responseObject(XMLHttpRequest))
			};
			map.success = success;
		}
		if(typeof request.timeout != 'undefined'){
			map.timeout=request.timeout;
		}
		if(typeof request.ontimeout != 'undefined' || typeof request.onerror != 'undefined' || typeof request.onabort != 'undefined'){
			if(typeof request.onreadystatechange == 'undefined'){
				request.onreadystatechange = function(obj){
					return;
				}
			}
			var error = function(data,textStatus,XMLHttpRequest){
				if(textStatus === 'timeout'){
					request.ontimeout(GM_responseObject(XMLHttpRequest));
					request.onreadystatechange(GM_responseObject(XMLHttpRequest));
				}
				else if(textStatus === 'abort'){
					request.onabort(GM_responseObject(XMLHttpRequest));
					request.onreadystatechange(GM_responseObject(XMLHttpRequest));
				}
				else{
					request.onerror(GM_responseObject(XMLHttpRequest));
					request.onreadystatechange(GM_responseObject(XMLHttpRequest));
				}
			};
			map.error = error;
		}
		if(typeof request.user != 'undefined'){
			map.username = request.user;
		}
		if(typeof request.password != 'undefined'){
			map.password = request.password;
		}
		if(typeof request.overrideMimeType != 'undefined'){
			map.beforeSend = function(xhr){
				xhr.overrideMimeType(request.overrideMimeType);
			}
		}
		$.ajax(map);
	}
}
else{
	GM = true;
}

//GM_addStyle
if(typeof GM_addStyle == 'undefined'){
	var GM_addStyle = function(style){
		$.rule(style).appendTo('style');
	};
}
else{
	GM = true;
}

//GM_log
if(typeof GM_log == 'undefined'){
	var GM_log = function(data){
		if(typeof console != 'undefined'){
			console.log('GM_log: '+data.toString());
		}
	};
}
else{
	GM = true;
}

//GM_registerMenuCommand
if(typeof GM_registerMenuCommand == 'undefined'){
	var GM_registerMenuCommand = function(arg1, arg2, arg3){
		return;
	};
}
else{
	GM = true;
}


if(typeof GM_listValues != 'undefined'){
	var gm_lv = GM_listValues;
}
if(typeof GM_deleteValue != 'undefined'){
	var gm_dv = GM_deleteValue;
}
if(typeof GM_getValue != 'undefined'){
	var gm_gv = GM_getValue;
}
if(typeof GM_setValue != 'undefined'){
	var gm_sv = GM_setValue;
}

function scriptAllowed(url, id){
	if(localStorage.getItem('includes.'+id) == null){
		localStorage.setItem('includes.'+id, '');
		return false;
	}
	else{
		var includes = localStorage.getItem('includes.'+id);
		var include_array = includes.trim().split('\n');
		var re = false;
		$.each(include_array, function(key, value){
			var value = value.replace(/\//gi, '\\/');
			var value = value.replace(/\./gi, '\\.');
			var value = value.replace(/\?/gi, '\\?');
			var value = value.replace('*', '.*?');
			var value = value.trim();
			var regexp = new RegExp(value, 'i');
			if(url.match(regexp)){
				re = true;
			}
		});
		return re;
	}
}

(function(){
	//Identifier
	var scriptIdentifier = 'haustierbot';
	///////////////////////
	//<Unabhängiger Code>//
	///////////////////////

	//GM_listValues
	if(typeof gm_lv == 'undefined'){
		var GM_listValues = function(){
			var array = new Array();
			for (var i = 0; i < localStorage.length; i++){
				var k = localStorage.key(i);
				array[k.toString().slice(scriptIdentifier.length+1)] = (localStorage.getItem(k).length > 0) ? lzw_decode(localStorage.getItem(k)) : localStorage.getItem(k);
			}
			return array;
		};
	}
	else{
		var GM_listValues = gm_lv;
		GM = true;
	}

	//GM_deleteValue
	if(typeof gm_dv == 'undefined'){
		var GM_deleteValue = function(key){
			localStorage.removeItem(scriptIdentifier+'.'+key);
		};
	}
	else{
		var GM_deleteValue = gm_dv;
		GM = true;
	}

	//GM_getValue
	if(typeof gm_gv == 'undefined'){
		var GM_getValue = function(key, def){
			if(localStorage.getItem(scriptIdentifier+'.'+key) == null){
				if(typeof def != 'undefined'){
					return def;
				}
				else{
					return;
				}
			}
			else{
				var ret = lzw_decode(localStorage.getItem(scriptIdentifier+'.'+key));
				if(ret == '~boolean[(true)]~'){
					return true;
				}
				else if(ret == '~boolean[(false)]~'){
					return false;
				}
				else if(ret.match(/\~int\[\((\-?\d+)\)\]\~/)){
					return parseInt(RegExp.$1);
				}
				else{
					return ret;
				}
			}
		};
	}
	else{
		var GM_getValue = gm_gv;
		GM = true;
	}

	//GM_setValue
	if(typeof gm_sv == 'undefined'){
		var GM_setValue = function(key, value){
			if(value === true){
				value = '~boolean[(true)]~';
			}
			else if(value === false){
				value = '~boolean[(false)]~';
			}
			else if(value === +value && isFinite(value) && !(value % 1)){
				value = '~int[('+value+')]~';
			}
			localStorage.setItem(scriptIdentifier+'.'+key, (value.length > 0) ? lzw_encode(value) : value);
		};
	}
	else{
		var GM_setValue = gm_sv;
		GM = true;
	}

	////////////////
	//Script////////
	////////////////

	var c,cnt,city,petarr;
	var login = true;
	var siteerror = false;

	//Stadt auslesen
	unsafeWindow.location.href.match(/https:\/\/(([a-z]+\.)?pennergame)\.de\//i);
	switch(RegExp.$1){
		case "sylt.pennergame":
			city = "sy_DE_";
			break;
		case "reloaded.pennergame":
			city = "hr_DE_";
			break;
		case "muenchen.pennergame":
			city = "mu_DE_";
			break;
		case "koeln.pennergame":
			city = "kl_DE_";
			break;
		default:
			city = "de_DE_";
			break;
	}

	//Log-Funktionen
	function load_log(){
		if(typeof GM_getValue(city+'htb_log') != 'undefined' && $.trim(GM_getValue(city+'htb_log')).length > 0){
			var l = GM_getValue(city+'htb_log');
			var l = l.replace(/(\+\s?\d+\s)/gi, '<span class="greenlog">$1</span>');
			var l = l.replace(/(\-\s?\d+\s)/gi, '<span class="redlog">$1</span>');
		}
		else{
			var l = 'Noch kein Eintrag';
		}
		$('#htb_log_div').html(l+'<br />');

		$('.greenlog').css({
			color:'#00bb00',
			fontWeight: 'bold',
		});
		$('.redlog').css({
			color:'#ee3311',
			fontWeight: 'bold',
		});
	}

	function htb_log(log){
		if(log.length > 0){
			var old = (typeof GM_getValue(city+'htb_log') == 'undefined') ? '' : $.trim(GM_getValue(city+'htb_log'));
			var time = new Date().toString("dd.MM.yyyy - HH:mm:ss")+' Uhr';
			GM_setValue(city+'htb_log', old+'<b>'+time.toString()+':</b> '+log.toString()+'<br />');
		}
		load_log();
	}

	//Oberfläche
	$('body').append('<div class="htb" style="top:91px;height:16px;cursor:pointer;">&nbsp;<input type="checkbox" id="htb_on" style="float:left" /><img style="margin-top:1px;float:left;padding:0px 4px" src="http://downfight.de/grafiken/auszeichnungen/michihand.gif" title="Die Umbrella Corporation hat im Zuge ihrer Forschung in den geheimsten Laboren den H-Virus entwickelt, eine genetisch modifizierte Zellstruktur, die totes Gewebe von Tieren weiterhin am Leben erh&auml;lt. Wurde ein Tier von seinem Herren allein gelassen, oder im Kampf verwundet, lebt das Tier dennoch weiter und ist sogar st&auml;rker denn je. Ist der H-Virus einmal aktiviert, ist keine bekannte Kraft mehr in der Lage, die nun h&ouml;here Intelligenz und St&auml;rke zu stoppen. Um die daraus resultierende Gefahr f&uuml;r die Allgemeinheit unter Kontrolle zu bringen, wurde das Fidelis-Programm ins Leben gerufen, das die ausgerissenen Haustiere zwar nicht t&ouml;ten, aber b&auml;ndigen kann." /><div id="htb_outer" class="htb_label" style="float:left;padding-top:3px;">Stereo.K&nbsp;-&nbsp;<span id="htb_inner">Lade...</span></div></div>'
		+'<div id="htb_opts" class="htb" style="display:none;top:117px;min-width:300px;max-width:520px;min-height:30px;max-height:600px;text-align:left">'
			+'<div style="padding-left:2px;padding-bottom:3px">'
				+'<fieldset>'
					+'<legend>'
						+'&nbsp;<span><label for="htb_nap"><input type="checkbox" class="htb_fieldset_checkbox" id="htb_nap">Ruhezeit</label>&nbsp;-&nbsp;<a style="cursor:pointer;color:#ee3311;" class="view">Aus-/Einblenden</a></span><br />'
					+'</legend>'
					+'<div class="fieldsetdiv" id="htb_badge_opts" style="text-align:left">'
						+'<span><label for="htb_nap_0"><input type="checkbox" value="0" name="htb_nap_opts_0" id="htb_nap_0" class="htb_fieldset_input" /></label>&nbsp;von&nbsp;<input type="text" maxlength="2" size="2" value="00" id="htb_nap_v1_0" name="htb_nap_v1_0" class="htb_fieldset_input">&nbsp;:&nbsp;<input type="text" maxlength="2" size="2" value="00" id="htb_nap_v2_0" name="htb_nap_v2_0" class="htb_fieldset_input">&nbsp;Uhr bis&nbsp;<input type="text" maxlength="2" size="2" value="05" id="htb_nap_b1_0" name="htb_nap_b1_0" class="htb_fieldset_input">&nbsp;:&nbsp;<input type="text" maxlength="2" size="2" value="00" id="htb_nap_b2_0" name="htb_nap_b2_0" class="htb_fieldset_input">&nbsp;Uhr</span><br />'
						+'<span><label for="htb_nap_1"><input type="checkbox" value="1" name="htb_nap_opts_1" id="htb_nap_1" class="htb_fieldset_input" /></label>&nbsp;von&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_v1_1" name="htb_nap_v1_1" class="htb_fieldset_input">&nbsp;:&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_v2_1" name="htb_nap_v2_1" class="htb_fieldset_input">&nbsp;Uhr bis&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_b1_1" name="htb_nap_b1_1" class="htb_fieldset_input">&nbsp;:&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_b2_1" name="htb_nap_b2_1" class="htb_fieldset_input">&nbsp;Uhr</span><br />'
						+'<span><label for="htb_nap_2"><input type="checkbox" value="2" name="htb_nap_opts_2" id="htb_nap_2" class="htb_fieldset_input" /></label>&nbsp;von&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_v1_2" name="htb_nap_v1_2" class="htb_fieldset_input">&nbsp;:&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_v2_2" name="htb_nap_v2_2" class="htb_fieldset_input">&nbsp;Uhr bis&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_b1_2" name="htb_nap_b1_2" class="htb_fieldset_input">&nbsp;:&nbsp;<input type="text" maxlength="2" size="2" value="" id="htb_nap_b2_2" name="htb_nap_b2_2" class="htb_fieldset_input">&nbsp;Uhr</span><br />'
					+'</div>'
				+'</fieldset>'
				+'<fieldset>'
					+'<legend>'
						+'&nbsp;<span><label for="htb_badge"><input type="checkbox" class="htb_fieldset_checkbox" id="htb_badge">Markensets automatisch einl&ouml;sen</label>&nbsp;-&nbsp;<a style="cursor:pointer;color:#ee3311;" class="view">Aus-/Einblenden</a></span><br />'
					+'</legend>'
					+'<div class="fieldsetdiv" id="htb_badge_opts" style="text-align:left">'
						+'<span><label for="htb_badge_0_0" title="Steinmarke + Bronzemarke"><input type="checkbox" value="0_0" name="htb_badge_opts_0_0" id="htb_badge_0_0" class="htb_fieldset_input" />&nbsp;Set 0.0</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="10" id="htb_badge_do_0_0" name="htb_badge_do_0_0">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_0_0">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px"></span><br />'
						+'<span><label for="htb_badge_0_1" title="Steinmarke + Bronzemarke + Silbermarke"><input type="checkbox" value="0_1" name="htb_badge_opts_0_1" id="htb_badge_0_1" class="htb_fieldset_input" />&nbsp;Set 0.1</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="10" id="htb_badge_do_0_1" name="htb_badge_do_0_1">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_0_1">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_silbermarke.png" width="15px" height="15px"></span><br />'
						+'<span><label for="htb_badge_0_2" title="Steinmarke + Bronzemarke + Goldmarke"><input type="checkbox" value="0_2" name="htb_badge_opts_0_2" id="htb_badge_0_2" class="htb_fieldset_input" />&nbsp;Set 0.2</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="5" id="htb_badge_do_0_2" name="htb_badge_do_0_2">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_0_2">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_goldmarke.png" width="15px" height="15px"></span><br />'
						+'<span><label for="htb_badge_0_3" title="Steinmarke + Bronzemarke + Silbermarke + Goldmarke"><input type="checkbox" value="0_3" name="htb_badge_opts_0_3" id="htb_badge_0_3" class="htb_fieldset_input" />&nbsp;Set 0.3</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="5" id="htb_badge_do_0_3" name="htb_badge_do_0_3">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_0_3">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_silbermarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_goldmarke.png" width="15px" height="15px"></span><br />'
						+'<span><label for="htb_badge_0_4" title="Steinmarke + Bronzemarke + Silbermarke + Goldmarke + Diamantmarke"><input type="checkbox" value="0_4" name="htb_badge_opts_0_4" id="htb_badge_0_4" class="htb_fieldset_input" />&nbsp;Set 0.4</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="5" id="htb_badge_do_0_4" name="htb_badge_do_0_4">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_0_4">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_silbermarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_goldmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_diamantmarke.png" width="15px" height="15px"></label></span><br />'
						+'<span><label for="htb_badge_1_0" title="Steinmarke + Bronzemarke + Spezialmarke Silber"><input type="checkbox" value="1_0" name="htb_badge_opts_1_0" id="htb_badge_1_0" class="htb_fieldset_input" />&nbsp;Set 1.0</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="10" id="htb_badge_do_1_0" name="htb_badge_do_1_0">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_1_0">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/marke_silber.png" width="15px" height="15px"></span><br />'
						+'<span><label for="htb_badge_1_1" title="Steinmarke + Bronzemarke + Spezialmarke Gold"><input type="checkbox" value="1_1" name="htb_badge_opts_1_1" id="htb_badge_1_1" class="htb_fieldset_input" />&nbsp;Set 1.1</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="5" id="htb_badge_do_1_1" name="htb_badge_do_1_1">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_1_1">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/marke_gold.png" width="15px" height="15px"></span><br />'
						+'<span><label for="htb_badge_1_2" title="Steinmarke + Bronzemarke + Spezialmarke Silber + Spezialmarke Gold"><input type="checkbox" value="1_2" name="htb_badge_opts_1_2" id="htb_badge_1_2" class="htb_fieldset_input" />&nbsp;Set 1.2</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" maxlength="4" size="5" value="5" id="htb_badge_do_1_2" name="htb_badge_do_1_2">&nbsp;Mal&nbsp;<a style="cursor:pointer;color:#ee3311;" id="htb_badge_do_1_2">einl&ouml;sen</a>&nbsp;&nbsp;&nbsp;<img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_steinmarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/plunder_bronzemarke.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/marke_silber.png" width="15px" height="15px"><img class="badgeicon" src="http://static.pennergame.de/img/pv4/plunder_new/marke_gold.png" width="15px" height="15px"></span><br />'
					+'</div>'
				+'</fieldset>'
				+'<fieldset>'
					+'<legend>'
						+'&nbsp;<span><label for="htb_lvl"><input type="checkbox" class="htb_fieldset_checkbox" id="htb_lvl" />Punkte automatisch vergeben&nbsp;</label>&nbsp;-&nbsp;<a style="cursor:pointer;color:#ee3311;" class="view">Aus-/Einblenden</a></span>'
					+'</legend>'
					+'<div class="fieldsetdiv" id="htb_lvl_opts" style="text-align:left">'
						+'<span><label for="htb_lvl_1"><input type="radio" value="1" name="htb_lvl_opts" id="htb_lvl_1" class="htb_fieldset_input" />&nbsp;Ausdauer > Kraft + Sp&uuml;rnase</label></span><br />'
						+'<span><label for="htb_lvl_2"><input type="radio" value="2" name="htb_lvl_opts" id="htb_lvl_2" class="htb_fieldset_input" />&nbsp;Ausdauer > Kraft + Wachsamkeit</label></span><br />'
						+'<span><label for="htb_lvl_3"><input type="radio" value="3" name="htb_lvl_opts" id="htb_lvl_3" class="htb_fieldset_input" />&nbsp;Ausdauer > Sp&uuml;rnase + Wachsamkeit</label></span><br />'
						+'<span><label for="htb_lvl_4"><input type="radio" value="4" name="htb_lvl_opts" id="htb_lvl_4" class="htb_fieldset_input" />&nbsp;Ausdauer > Kraft > Sp&uuml;rnase</label></span><br />'
						+'<span><label for="htb_lvl_5"><input type="radio" value="5" name="htb_lvl_opts" id="htb_lvl_5" class="htb_fieldset_input" />&nbsp;Ausdauer > Sp&uuml;rnase > Kraft</label></span><br />'
						+'<span><label for="htb_lvl_6"><input type="radio" value="6" name="htb_lvl_opts" id="htb_lvl_6" class="htb_fieldset_input" />&nbsp;Ausdauer > Kraft > Wachsamkeit</label></span><br />'
					+'</div>'
				+'</fieldset>'
				+'<fieldset>'
					+'<legend>'
					+'Log - <a style="cursor:pointer;color:#ee3311;" id="htb_clear_log" title="Log komplett leeren">Leeren</a>&nbsp;-&nbsp;<a style="cursor:pointer;color:#ee3311;" class="view">Aus-/Einblenden</a>'
					+'</legend>'
					+'<div class="fieldsetdiv" id="htb_log_div" style="border:min-width:260px;max-width:500px;min-height:20px;max-height:111Px;overflow:auto;white-space:nowrap;text-align:left"></div>'
				+'</fieldset><br />'
				+'<a id="htb_reset" style="cursor:pointer;color:#ee3311;float:left;clear:both;padding-top:5px" title="Es werden alle gespeicherten Werte ALLER ausgef&uuml;hrten Scripte gel&ouml;scht!">Alle Einstellungen zur&uuml;cksetzen</a>'
			+'</div>'
		+'</div>');

	load_log();

	$('div.htb').css({
		left: '50px',
		zIndex: '999',
		position: 'fixed',
		padding: '3px',
		paddingBottom: '5px',
		background: '#ffe4c4',
		border: '2px white groove',
		borderRight: '2px white ridge',
		borderBottom: '2px white ridge',
		fontSize: '11px',
	});

	$('#htb_opts > div > label').css({
		marginLeft: '7px',
	});

	$('fieldset > span, div#htb_lvl_opts > span').css({
		 'float': 'left',
		 clear: 'both',
	});


	//Input Sytle
	$('div.htb > input[id^="htb_"]').css({
		marginTop: '3px',
	});

	$('img.badgeicon').css({
		marginBottom: '-3px',
	});

	$('fieldset span > label > input').css({
		 'float': 'left',
		 marginTop: '1px',
	});

	//Verschieben
	$('div.htb:first').dblclick(function(){
		var offset = parseInt($('div.htb').css('left'));
		$('div.htb').css({
			left: (offset+20)+'px',
		});
	});

	//Ausblenden / Einblenden
	$('a.view').click(function(){
		$(this).closest('fieldset').find('div.fieldsetdiv').toggle();
	});

	//Fieldset Style
	$('#htb_opts fieldset').css({
		'float': 'left',
		clear: 'both',
		border: '2px white groove',
		padding: '5px',
		marginTop: '2px',
		marginBottom: '2px',
		minWidth: '280px',
		maxWidth: '500px',
		minHeight: '20px',
		maxHeight: '250px',
	});

	//Falls Error
	if($('h1').length > 0){
		var h1 = $('h1:first').html();
		if(h1.match(/(502|504|505|Not Found|It works!)/gi)){
			unsafeWindow.setTimeout(function(){location.href='/pet/'}, 10000);
			$('span#htb_inner').html('ERROR');
			siteerror = true;
		}
	}

	if($('body > div#inhalt').length > 0){
		unsafeWindow.setTimeout(function(){location.href='/pet/'}, 20000);
		$('span#htb_inner').html('Maintenance');
		siteerror = true;
	}

	//Optionen ein-/ausblenden
	$('#htb_outer').click(function(){
		$('div#htb_opts').toggle();
	});

	//Standardwerte setzen - (De)aktiviert
	if(GM_getValue(city+'htb') === false && siteerror == false){
		$('input#htb_on').prop('checked', false);
		$('span#htb_inner').html('Deaktiviert');
	}
	else if(siteerror == false){ //also wenn KEIN Fehler
		$('input#htb_on').prop('checked', true);
		GM_setValue(city+'htb', true);
		//Ruhezeit prüfen

		unsafeWindow.setTimeout(htb, 2000);
	}
	else{
		unsafeWindow.setTimeout(function(){location.href='/pet/'}, 5000);
	}

	//Standardwerte setzen - Checkboxen
	$('div#htb_opts input[type="checkbox"]').each(function(){
		var id = $(this).attr('id');
		if(typeof GM_getValue(city+id) == 'undefined'){
			switch(id){
				case "htb_lvl":
					$(this).prop('checked', true);
					break;
				case "htb_badge_0_4":
					$(this).prop('checked', true);
					break;
				case "htb_badge_1_2":
					$(this).prop('checked', true);
					break;
				default:
					$(this).prop('checked', false);
					break;
			}
		}
		else{
			if(GM_getValue(city+id) === true){
				$(this).prop('checked', true);
			}
			else if(GM_getValue(city+id) === false){
				$(this).prop('checked', false);
			}
			else{
				GM_deleteValue(city+id);
			}
		}
	});

	//Standardwerte setzten - Level Radios
	if(typeof GM_getValue(city+'htb_lvl_opt') == 'undefined'){
		$('input#htb_lvl_4').prop('checked', true);
	}
	else{
		var input = $('div#htb_lvl_opts input[value="'+GM_getValue(city+'htb_lvl_opt')+'"]');
		if(input.length == 1){
			input.prop('checked', true);
		}
		else{
			GM_deleteValue(city+'htb_lvl_opt')
			$('input#htb_lvl_4').prop('checked', true);
		}
	}

	//Standardwerte setzten - Text Inputs
	$('div#htb_opts input[type="text"]').each(function(){
		var id = $(this).attr('id');
		if(typeof GM_getValue(city+id) != 'undefined'){
			$(this).val(GM_getValue(city+id));
		}
	});

	//Standardwerte setzen - Fieldset Checkboxen - en/disable fieldset
	$('input.htb_fieldset_checkbox').each(function(){
		$(this).closest('fieldset').find('input[class="htb_fieldset_input"]').prop('disabled', (this.checked) ? false : true);
	});

	//Change Handler  - (De)aktiviert
	$('#htb_on').change(function(){
		if($('#htb_on:checked').length == 1){
			GM_setValue(city+'htb', true);
		}
		else{
			GM_setValue(city+'htb', false);
		}
		location.href = '/pet/';
	});

	//Change Handler für Fieldset-Legends
	$('input.htb_fieldset_checkbox').change(function(){
		var id = $(this).attr('id');
		GM_setValue(city+id, (this.checked) ? true : false);
		$(this).closest('fieldset').find('input[class="htb_fieldset_input"]').prop('disabled', (this.checked) ? false : true);
	});

	//Change Handler für Text-Inputs
	$('div#htb_opts input[type="text"]').change(function(){
		var id = $(this).attr('id');
		GM_setValue(city+id, $(this).val().toString());
	});

	//Change Handler für Markenoptionen + Ruhezeitoptionen
	$('input[name^="htb_badge_opts_"], input[name^=htb_nap_opts_]').change(function(){
		var id = $(this).attr('id');
		GM_setValue(city+id, (this.checked) ? true : false);
	});

	//Change Handler für Leveloptionen
	$('input[name="htb_lvl_opts"]').change(function(){
		GM_setValue(city+'htb_lvl_opt', $('input[name="htb_lvl_opts"]:checked').val());
	});

	//Log leeren
	$('a#htb_clear_log').click(function(){
		GM_setValue(city+'htb_log', '');
		$('div#htb_log_div').html('Log geleert');
	});

	$('a#htb_reset').click(function(){localStorage.clear()});

	//Falls ReLogin
	if(unsafeWindow.location.href.match(/pennergame\.de\/$/i) && GM == true && login == true && GM_getValue(city+'htb') === true && $('form#formReg').length > 0){
		if(typeof GM_getValue(city+'usr') != 'undefined'){
			var usr = GM_getValue(city+'usr');
			if(typeof GM_getValue(city+usr+'_pw') != 'undefined'){
				htb_log('Automatischer Login');
				var pass = GM_getValue(city+usr+'_pw');
				$('#login_username').val(usr);
				$('#password').val(pass);
				$('#loginform').submit();
			}
		}
	}

	//GM Autologin
	if(GM == true && login == true){
		var me = GM_getValue(city+'usr');
		if(typeof me == 'undefined' || me.length == 0 || document.referrer.match(/(login|logout|pennergame\.de)\/$/i) && unsafeWindow.location.href.match(/\/overview\/$/i)){
			var m = $('a[href*="/profil/id:"] > span.user_name').html();
			if(m.substr(-3) == '...'){
				GM_xmlhttpRequest({
					method: 'GET',
					url: '/overview/',
					synchronous: true,
					onload: function(home){
						var h = home.responseText;
						var name = $('div.settingpoint > span', h).html();
						GM_setValue(city+'usr', name);
						me = name;
					},
					onerror: function(){
						location.href = '/pet/';
					},
					ontimeout: function(){
						location.href = '/pet/';
					},
				});
			}
			else{
				GM_setValue(city+'usr', m);
				me = m;
			}
		}
		else{
			me = GM_getValue(city+'usr');
		}
		if(typeof GM_getValue(city+me+'_pw') == 'undefined'){
			pw = prompt('Bitte gib das Passwort dieses Accounts ein:', '');
			if(pw != '' && typeof pw != 'undefined'){
				GM_setValue(city+me+'_pw', pw);
			}
		}
	}

	//Funktion zum Markeneinlösen
	function marken(id, n, manually){
		manually = typeof manually !== 'undefined' ? manually : false;
		if(parseInt(n) > 0){
			var set = id.split('_');
			var ad = (parseInt(set[0]) == 1) ? '?special=True' : '';
			$.ajax({
				type: 'GET',
				url: '/pet/get_collection_reward/'+set[1]+'/'+n+'/'+ad,
			});
			var pl = (n > 1) ? 's' : '';
			var pl2 = (n > 1) ? 'n' : '';

			$('span#htb_inner').html(n+' Markenset'+pl+' eingel&ouml;st');
			if(manually == true){
				htb_log('Du hast '+n+' Markenset'+pl+' (ID '+id+') manuell eingel&ouml;st');
			}
			else{
				htb_log(n+' Markenset'+pl+' (ID '+id+') wurde'+pl2+' automatisch eingel&ouml;st');
			}
		}
	}

	//Click Handler für einlöse-Links
	$('a[id^="htb_badge_do_"]').click(function(){
		var id = $(this).attr('id');
		var n = parseInt($('input[name="'+id+'"]').val());
		if(n == 0){
			n = 1;
		}
		id.match(/(\d\_\d)$/);
		var id = RegExp.$1;
		marken(id, n, true);
	});

	////////////////
	//Initialisieren
	////////////////

	function htb(){
		$.ajax({
			url: '/pet/',
			type: 'GET',
			timeout: 60000,
			success: function(data){

				//Marken automatisch einlösen
				if(data.length > 0 && $("div.itemlist", data).length > 0){
					if($('input#htb_badge:checked').length == 1 && $('input[id^=htb_badge_][type="checkbox"]:checked').length > 0){
						$.ajax({
							type: 'GET',
							url: '/pet/tab/collections/',
							success: function(data){
								$($('input[id^=htb_badge_][type="checkbox"]:checked').get().reverse()).each(function(){
									var id = $(this).val();
									var ids = id.split('_');
									var tempcount = 500; //maximale Einlösungen auf einmal
									$('div.itemlist_category:eq('+ids[0]+') > div.itemlist:eq('+ids[1]+') > ul > li', data).each(function(){
										var count = parseInt($('span.collection_item_count', this).text());
										if(count < tempcount){
											tempcount = count;
										}
									});
									marken(id, tempcount);
								});
							}
						});
					}
				}

				//Punkte vergeben
				if(GM_getValue(city+'htb_lvl') === true){
					var jobs = [];
					var allpoints;
					$('div.petshell', data).each(function(){
						var petinfo = $('.petactionshell > .petinfo', this);
						if(petinfo.length > 0){
							var levels = [];
							$('div.statcontainer', $(this)).each(function(){
								$('div.stat_tooltip .low_help_text', $(this)).html().trim().match(/(\d+)$/i);
								var maximum = RegExp.$1;
								var current = parseInt($(this).contents().filter(function(){return this.nodeType == 3;}).text());
								levels.push([current, maximum]);
							});

							petinfo.html().trim().match(/^(\d+).*?/i);
							var points = parseInt(RegExp.$1);
							allpoints = points;

							if(points > 0){
								if(typeof GM_getValue(city+'htb_lvl_opt') != 'undefined' && parseInt(GM_getValue(city+'htb_lvl_opt')) > 0){
									var opt = parseInt(GM_getValue(city+'htb_lvl_opt'));
								}
								else{
									var opt = 4;
								}

								$(this).attr('id').match(/^pet(\d+)$/i);
								var tmpid = RegExp.$1;
								if(levels[0][0] < levels[0][1]){
									var diff = levels[0][1] - levels[0][0];
									for(var up=1; up<=diff; up++){
										jobs.push([tmpid, 'stamina']);
										points--;
									}
								}
								if(points > 0){
									switch(opt){
										case 1:
											var half = Math.ceil(points/2);
											for(var i=1; i<=half; i++){
												jobs.push([tmpid, 'attack']);
												jobs.push([tmpid, 'tracing']);
											}
											break;
										case 2:
											var half = Math.ceil(points/2);
											for(var i=1; i<=half; i++){
												jobs.push([tmpid, 'attack']);
												jobs.push([tmpid, 'vigilance']);
											}
											break;
										case 3:
											var half = Math.ceil(points/2);
											for(var i=1; i<=half; i++){
												jobs.push([tmpid, 'tracing']);
												jobs.push([tmpid, 'vigilance']);
											}
											break;
										case 4:
											for(var i=0; i<=points; i++){
												if(Math.floor((Math.random()*20)+1) == 1 || levels[1][0] == levels[1][1]){
													jobs.push([tmpid, 'tracing']);
												}
												else{
													jobs.push([tmpid, 'attack']);
												}
											}
											break;
										case 5:
											for(var i=0; i<=points; i++){
												if(Math.floor((Math.random()*20)+1) == 1 || levels[2][0] == levels[2][1]){
													jobs.push([tmpid, 'attack']);
												}
												else{
													jobs.push([tmpid, 'tracing']);
												}
											}
											break;
										case 6:
											for(var i=0; i<=points; i++){
												if(Math.floor((Math.random()*20)+1) == 1 || levels[1][0] == levels[1][1]){
													jobs.push([tmpid, 'vigilance']);
												}
												else{
													jobs.push([tmpid, 'attack']);
												}
											}
											break;
										default:
											return;
											break;
									}
								}
							}
						}
					});
					$.each(jobs, function(k,v){
						$('div#htb_outer').append('<img class="htb_lvl_g" src="http://script.downfight.eu/g.png" />');
						$.ajax({
							url: '/pet/upgrade/'+v[0]+'/'+v[1]+'/1/',
							type: 'GET',
							success: function(){
								$('img.htb_lvl_g:last').remove();
								if($('.htb_lvl_g').length == 0){
									read_cnt();
								}
							},
							error: function(){
								$('img.htb_lvl_g:last').remove();
								if($('.htb_lvl_g').length == 0){
									read_cnt();
								}
							},
						});
					});
					if(jobs.length > 0){
						$('span#htb_inner').html((jobs.length > 1) ? 'Offene Punkte vergeben' : 'Offener Punkt vergeben');
						htb_log((jobs.length > 1) ? allpoints+' offene Punkte wurden vergeben' : '1 offener Punkt wurde vergeben');
					}
					else{
						read_cnt();
					}
				}
				else{
					read_cnt();
				}

				//Aktuellen Stand überprüfen
				function read_cnt(){
					if(data.length > 0){
						var counter = $(data.replace(/(<script)(.*?)(<\/script>)/gi, '<pre$2</pre>')).find('div.petbusybar > span > pre');
						if(counter.length > 0){
							counter.text().match(/counter\((\d+)\,.*?\)/);
							c = parseInt(RegExp.$1);
							if(typeof cnt == 'number'){
								unsafeWindow.clearInterval(cnt);
							}
							cnt = unsafeWindow.setInterval(function(){
								$('#htb_inner').html(seconds2time(c));
								//Temporären Boost einsetzen
								if(c == 60){
									$.ajax({
										url: '/pet/',
										type: 'GET',
										timeout: 10000,
										success: function(tempboostpage){
											var activepet = $('span#pet_roam_time', tempboostpage).closest('div.petshell[id^=pet]');
											var activepetid = $(activepet).attr('id').substring(3);
											var activepetlvl = parseInt($(activepet).find('div.petlvl').text());
											var activexp = parseInt($(activepet).find('div.petxpbar').text().slice(0,-1));
											var activeboost = $(activepet).find('div.plunder_boost');
											if(activeboost.length == 0 && activepetlvl < 50){
												$.ajax({
													url: '/pet/tab/items/',
													type: 'GET',
													timeout: 10000,
													success: function(leckerlis){
														var targets = $('div.items_shell:first div.plunder_menu[id^="pm_"]', leckerlis);
														var target;
														var targetarr = [];
														$.each(targets, function(k,v){
															target = parseInt($(this).attr('id').substr(3));
															targetarr.push(target);
														});
														$.ajax({
															url: '/pet/plunder/'+targetarr[Math.ceil((activexp/100)*(targetarr.length))]+'/use/'+activepetid+'/',
															type: 'GET',
															timeout: 10000,
															success: function(){
																$('span#htb_inner').html('Booster eingesetzt: '+Math.ceil((activexp/100)*(targetarr.length))+'/'+targetarr.length);
																htb_log('Booster eingesetzt: '+targetarr[Math.ceil((activexp/100)*(targetarr.length))] +' - '+ Math.ceil((activexp/100)*(targetarr.length))+'/'+targetarr.length);
															}
														});
													}
												});
											}
										}
									});
								}
								//Streunen beenden
								else if(c == 0){
									unsafeWindow.clearInterval(cnt);
									htb_finish();
								}
								c--;
							}, 1000);
						}
						else{
							htb_finish();
						}
					}
					else{
						if(login == true){
							$('span#htb_inner').html('Logge gleich wieder ein...');
							unsafeWindow.setTimeout(function(){unsafeWindow.location = '/'}, 10000);
						}
						else{
							$('span#htb_inner').html('Nicht eingeloggt! Warte...');
						}
					}
				}
			},
			error: function(){
				unsafeWindow.setTimeout(htb, 10000);
			}
		});
	}

	//////////////////////
	//Steunen abschließen
	//////////////////////

	function htb_finish(){
		$('#htb_inner').html('Schlie&szlig;e Streunen ab...');
		$.ajax({
			url: '/pet/tab/action/',
			type: 'GET',
			success: function(reward){
				if($('ul#footer', reward).length == 0 && reward.length > 0){
					var log = '';
					$.each($('div.hs_shell > table tr', reward), function(){
						var text = '';
						$.each($('td', this), function(){
							var t = $.trim($(this).text());
							if(t.length > 0){
								text += t+' ';
							}
						});
						if(text.length > 0){
							log += text + '/ ';
						}
					});

					$.each($('div.petshell_fight', reward), function(){
						var text = $.trim($('div.petname', $(this)).text() +'['+$('div.petfight_level', $(this)).text()+']:&nbsp;'+$('div.petpoints div:nth-child(2)', $(this)).text());
						if(text.length > 0){
							log += text + ' / ';
						}
					});

					$.each($('div.ov_container > center > div.goodorbad', reward), function(){
						log += $(this).text().replace(/€/g, '&euro;') + ' / ';
					});

					var p = $('div.petshell > div.petname', reward).contents().filter(function(){return this.nodeType == 3;}).text();
					log = $.trim(log).replace(/(\s+)/g, ' ');
					if(log.length > 0){
						htb_log(p+' - '+log);
					}

					$.ajax({
						url: '/pet/get_roam_reward/',
						type: 'GET',
						timeout: 60000,
						success: function(data){
							var response = $.trim(data.toLowerCase());
							if(response.length > 100){
								if(login == true){
									$('span#htb_inner').html('Logge gleich wieder ein...');
									unsafeWindow.setTimeout(function(){unsafeWindow.location = '/'}, 10000);
								}
							}
							else if(response == 'success'){
								$('#htb_inner').html('Streunen abgeschlossen!');
								htb_start();
							}
							else if(response == 'error'){
								$('#htb_inner').html('Streunen war schon abgeschlossen!');
								htb_start();
							}
							else if(response == 'no-state'){
								$('#htb_inner').html('Steunen war noch nicht beendet. Versuche erneut...');
								unsafeWindow.setTimeout(htb, 2000);
							}
							else{
								$('#htb_inner').html('Fehler! Suche nach einer intelligenten L&ouml;sung...');
								unsafeWindow.setTimeout(function(){unsafeWindow.location = '/'}, 5000);
							}
						},
						error: function(){
							$('#htb_inner').html('Mieser Fehler beim Abschlie&szlig;en. Versuche erneut...');
							unsafeWindow.setTimeout(htb_finish, 10000);
						}
					});
				}
				else{
					$('#htb_inner').html('Ausgeloggt! Logge gleich wieder ein...');
					unsafeWindow.setTimeout(function(){unsafeWindow.location = '/'}, 5000);
				}
			},
			error: function(){
				$('#htb_inner').html('Fehler beim Abschlie&szlig;en. Versuche erneut...');
				unsafeWindow.setTimeout(function(){unsafeWindow.location = '/'}, 5000);
			}

		});

	}

	///////////////////
	//Streunen Starten
	///////////////////

	function htb_start(){
		if(GM_getValue(city+'htb') !== false && $('#htb_on:checked').length == 1){
			$.ajax({
				url: '/pet/',
				type: 'GET',
				timeout: 60000,
				success: function(data){
					var dom = $(data.replace(/(<script)(.*?)(<\/script>)/gi, '<pre$2</pre>'));
					var pets = $('div#pet_kader div.petshell[id^="pet"]', dom);
					petarr = [];
					$.each(pets, function(){
						$(this).attr('id').match(/pet(\d+)/i);
						var mypetid = parseInt(RegExp.$1);

						var name = $.trim($('div.petname', this).contents().filter(function(){return this.nodeType == 3;}).text());

						$('.petspec img', this).attr('src').match(/\/(\d)\.png$/i);
						var type = parseInt(RegExp.$1);

						var xp = parseFloat($('div.petxpbar', this).text().replace('%','').trim());
						var hp = parseInt($('div.pethpbar', this).text().trim().split('/')[0]);
						var hpall = parseInt($('div.pethpbar', this).text().trim().split('/')[1]);
						var level = parseInt($.trim($('.petactionshell .petbar .petlvl', this).text()));

						if(isNaN(xp)){
							xp = 'max.';
						}

						//Dauerhafter Boost
						var boost = 0;
						var div1 = $('div.plunder_equipped .petplundertooltip', this);
						if(div1.length > 0){
							div1.css('backgroundImage').match(/\/([a-zA-Z0-9_]+)\.png/i);
							var boost_string = RegExp.$1;
							switch(boost_string){
								case 'fressnapf_bronze':
									boost = boost + 1;
									break;
								case 'fressnapf_silber':
									boost = boost + 2;
									break;
								case 'fressnapf_gold':
									boost = boost + 4;
									break;
								case 'fressnapf_diamant':
									boost = boost + 5;
									break;
								case 'karte_gelb':
									boost = boost + 1;
									break;
								case 'karte_gruen':
									boost = boost + 3;
									break;
								case 'halsband_blau':
									boost = boost + 2;
									break;
								case 'halsband_gelb':
									boost = boost + 1;
									break;
								case 'halsband_rot':
									boost = boost + 2;
									break;
								case 'halsband_schwarz':
									boost = boost + 3;
									break;
								case 'stachelhalsband':
									boost = boost + 3;
									break;
								case 'poncho':
									boost = boost + 5;
									break;
								case 'fez':
									boost = boost + 3;
									break;
								case 'laufrad':
									boost = boost + 3;
									break;
								case 'irrgarten':
									boost = boost + 4;
									break;
								default:
									boost = boost + 0;
									break;
							}
						}

						//Temporärer Boost
						var div2 = $('div.plunder_boost > div', this);
						if(div2.length > 0){
							var tmp_boost = parseInt(div2.contents().filter(function(){return this.nodeType == 3;}).text().replace(/\D/, ''));
								boost = boost + Math.round(tmp_boost/5);
						}

						//Tag-Nacht Boost
						var div3 = $('div.daytime_advantage > img', this);
						if(div3.length > 0 && div3.attr('src').match(/_true\.png$/i)){
							var boost = boost + 6;
						}
						else if(div3.length > 0 && div3.attr('src').match(/_false\.png$/i)){
							var boost = boost - 2;
						}

						//Level 50 Vorrang
						if(level == 50){
							boost = boost + 5;
						}

						var petdata = {id:mypetid, type:type, xp:xp, hp:hp, hpall:hpall, boost:boost, name:name, level:level};
						petarr.push(petdata);
					});

					//Nach Ausdauer filtern
					var oldpetarr = petarr;
					var newpetarr = $.grep(petarr, function(value) {
						return value.hp > 10;
					});

					var petarr = newpetarr;

					if(petarr.length > 0){
						petarr.sort(function(a,b){
							if(a.boost == b.boost){
								return 0;
							}
							else{
								return (a.boost > b.boost) ? -1 : 1;
							}
						});
						function get_areas(){
							$.ajax({
								url: '/pet/tab/action/',
								type: 'GET',
								timeout: 60000,
								success: function(data){
									if(data.length > 0){
										//Streungegend errechnen
										switch(petarr[0].type){
											case 1:
												var goodid = 3;
												break;
											case 2:
												var goodid = 1;
												break;
											case 3:
												var goodid = 2;
												break;
										}
										var dom = $(data);
										var good = $('select[name="area_id"] option[value$="'+goodid+'"]', dom);
										if(good.length == 0){
											good = $('select[name="area_id"] option[value$="'+petarr[0].type+'"]', dom);
											if(good.length == 0){
												good = $('select[name="area_id"] option[value^="1"]', dom);
											}
										}
										var area = good.attr('value');

										//Streundauer errechnen
										if(parseFloat(petarr[0].xp) > 90 && petarr[0].hp > 70 && petarr[0].level < 50){
											if(petarr[0].hp > 70){
												var route = 60;
											}
										}
										else{
											var route = 10;
										}

										//Streunen starten
										function gogogo(){
											if(GM_getValue(city+'htb') !== false && $('#htb_on:checked').length == 1){
												$.ajax({
													type: 'POST',
													url: '/pet/pet_action/',
													timeout: 60000,
													dataType: 'HTML',
													data: {area_id: area, route_length: route, pet_id: petarr[0].id},
													success: function(data){
														$('#htb_inner').text('Streunen gestartet!');
														htb_log(petarr[0].name+' - Streunen gestartet ('+route+' Minuten / '+petarr[0].boost+' Boostpoints) mit '+petarr[0].xp+'% XP und '+petarr[0].hp+' HP ('+Math.round((petarr[0].hp / petarr[0].hpall)*100).toFixed(2)+'%)');
														unsafeWindow.setTimeout(htb, 5000);
													},
													error: function(){
														$('#htb_inner').text('Streunen konnte nicht gestartet werden! Versuche erneut...');
														unsafeWindow.setTimeout(gogogo, 10000);
													}
												});
											}
											else{
												$('#htb_inner').text('Spontane Deaktivierung!');
												unsafeWindow.setTimeout(function(){
													unsafeWindow.location.reload()
												}, 5000);
											}
										}
										gogogo();
									}
									else{
										if(login == true){
											$('span#htb_inner').html('Logge gleich wieder ein...');
											unsafeWindow.setTimeout(function(){unsafeWindow.location = '/'}, 10000);
										}
										else{
											$('span#htb_inner').html('Nicht eingeloggt! Warte...');
										}
									}
								},
								error: function(){
									unsafeWindow.setTimeout(get_areas, 10000);
								}
							});
						}
						get_areas();
					}
					else{
						$('#htb_inner').text('Keine Ausdauer!!!');

						//Werte und Ausdauer zurücksetzen, um weiter Streunen zu können
						function petreset(){
							var leashes = parseInt($('a#test[href="/pet/tab/buy_currency/"]', data).text());
							if(leashes >= 50 && oldpetarr.length > 0 && GM_getValue(city+'htb_lvl') === true){
								var temppetarr = $.grep(oldpetarr, function(value){
									return value.level < 50;
								});
								var resetid;
								if(temppetarr.length == 0 && leashes >= 75){
									oldpetarr.sort(function(a,b){
										if(a.boost == b.boost){
											return 0;
										}
										else{
											return (a.boost > b.boost) ? -1 : 1;
										}
									});
									resetid = oldpetarr[0].id;
									resetname = oldpetarr[0].name;
								}
								else if(leashes >= 75){
									resetid = temppetarr[0].id;
									resetname = temppetarr[0].name;
								}
								else{
									$('#htb_inner').text('Nicht genug Leinen zum zurücksetzen! Warte 2 Minuten...');
									unsafeWindow.setTimeout(function(){location.href='/pet/'}, 120000);
								}
								$.ajax({
									type: 'POST',
									url: '/pet/reset/',
									timeout: 60000,
									dataType: 'HTML',
									data: {reset_pet_input: resetid},
									success: function(data){
										$('#htb_inner').text('Werte von '+resetname+' zurückgesetzt!');
										htb_log('Werte von '+resetname+' zurückgesetzt!');
										unsafeWindow.setTimeout(function(){
											unsafeWindow.location.reload()
										}, 3000);
									},
									error: function(){
										$('#htb_inner').text('Werte von '+resetname+' konnten nicht zurückgesetzt werden! Versuche erneut...');
										unsafeWindow.setTimeout(petreset, 5000);
									}
								});
							}
							else{
								unsafeWindow.setTimeout(function(){location.href='/pet/'}, 60000);
							}
						}
						petreset();
					}
				},
				error: function(){
					$('#htb_inner').text('Oh weh, da lief was schief... Naja, ich geb nicht auf und versuche es gleich nochmal!');
					unsafeWindow.setTimeout(function(){location.href='/pet/'}, 10000);
				}
			});
		}
		else{
			unsafeWindow.setTimeout(function(){
				unsafeWindow.location.reload()
			}, 5000);
		}
	}

	////////////////////////
	//</Unabhängiger Code>//
	////////////////////////
})();
