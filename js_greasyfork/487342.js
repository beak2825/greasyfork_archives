// ==UserScript==
// @name         bgm_time_machine
// @description  班固米大事记
// @namespace    sqrtwo
// @version      .6
// @author       neutrinoliu
// @match        https://bangumi.tv/
// @match        https://bgm.tv/
// @match        https://chii.in/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487342/bgm_time_machine.user.js
// @updateURL https://update.greasyfork.org/scripts/487342/bgm_time_machine.meta.js
// ==/UserScript==


const bgm_event_dateline_key = "SHOW_BGM_EVENT_DATELINE";
const database_url_path = "/group/topic/393723";

/* init add add dateline */
/*!
 * Dateline 2.0.5
 * (c) 2022 Sjaak Priester, Amsterdam
 * MIT License
 * https://github.com/sjaakp/dateline
 * https://sjaakpriester.nl
 */
function addDateline(events, cfg) {
    // add style
    const style = document.createElement('style');
    style.innerHTML = `
.d-dateline{
    --fa-primary-color: #5E5545;
    --fa-secondary-color: red;
    --d-border-color: #887ec6;
    min-height:80px;
    background-color:#A0A0A0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
    user-select:none;
    outline:none
}
.d-dateline *{
    box-sizing:border-box
}
.d-hidden{
    display:none
}
.d-bubble{
    position:absolute;
    text-align:left;
    width:240px;
    background-color:#fff;
    border:1px solid #beb39e;
    border-radius:12px;
    margin-top:24px;
    margin-left:-20px
}
.d-close{
    float:right;
    margin:0 8px;
    cursor:pointer;
    font-size:16px;
    font-weight:bold;
    color:#beb39e
}
.d-close:hover{
    color:#beb39e
}
.d-info{
    margin:1em
}
.d-inner{
    width:100%;
     height:100%;
    overflow:hidden;
    outline:none
}
.d-band{
    position:relative;
    text-align:left;
    outline:none
}
.d-band-0{
    background-color:#e5e1d8
}
.d-band-0 .d-range{
    background-color:#edeae4
}
.d-band-0 .d-indicator{
    color:#ece8e2
}
.d-band-0 .d-indicator:hover{
    color:#efede8
}
.d-band-1{
    background-color:#dbd5ca
}
.d-band-1 .d-range{
    background-color:#e6e2da
}
.d-band-1 .d-indicator{
    color:#e4e0d7
}
.d-band-1 .d-indicator:hover{
    color:#eae6df
}
.d-range{
    position:absolute;
    height:100%;
    width:50%
}
.d-range.d-before{
    right:50%;
    border-right:1px dotted #a99a7d
}
.d-range.d-after{
    left:50%;
    border-left:1px dotted #a99a7d
}
.d-content{
    position:absolute;
    height:100%;
    cursor:ew-resize
}
.d-markers,.d-events{
    position:absolute;
    width:100%
}
.d-markers{
    height:30px;
    bottom:0
}
.d-events{
    height:100%
}
.d-marker{
    position:absolute;
    font-family:sans-serif;
    font-size:12px;
    line-height:12px;
    padding-top:18px;
    padding-left:2px;
    border-left:1px dotted;
    color:#908060
}
.d-marker.d-plus{
    font-size:14px;
    font-weight:bold;
    border-left-style:solid;
    color:#73664d
}
.d-limit{
    position:absolute;
    width:500px;
    height:100%
}
.d-limit.d-begin{
    background:linear-gradient(to left, rgba(144, 128, 96, 0.2) 0%, rgba(0, 0, 0, 0) 100%)
}
.d-limit.d-end{
    background:linear-gradient(to right, rgba(144, 128, 96, 0.2) 0%, rgba(0, 0, 0, 0) 100%)
}
.d-event,.d-tape-event{
    position:absolute;
    padding-right:2.5em;
    max-width:30em;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    cursor:pointer
}
.d-event:before{
    display:inline-block;
    width:.8em;
    height:.8em;
    border-radius:50%;
    content:"";
    color:var(--fa-primary-color);
    background-color:currentColor;
    margin-right:.4em
}
.d-tape-event{
    padding-bottom:3px
}
.d-tape{
    position:absolute;
    bottom:0;
    height:4px;
    background-color:var(--fa-primary-color);
    border-color:var(--d-border-color);
    border-width:0;
    border-style:solid
}
.d-pin{
    position:absolute;
    top:30%;
    width:3px;
    height:8px;
    background-color:var(--fa-primary-color)
}
.d-tape-pin{
    position:absolute;
    top:30%;
    height:2px;
    background-color:var(--fa-primary-color)
}
.d-indicator{
    position:absolute;
    top:30%;
    cursor:pointer
}
.d-indicator:after{
    position:absolute;
    content:"";
    width:0;
    height:0;
    font-size:6px;
    border-style:solid;
    border-color:transparent;
    color:rgba(255,255,255,.5)
}
.d-indicator:hover:after{
    color:#fff
}
.d-indicator.d-left{
    left:12px
}
.d-indicator.d-left:after{
    border-right-color:unset;
    border-width:1em 2em 1em 0
}
.d-indicator.d-right{
    right:24px
}
.d-indicator.d-right:after{
    border-left-color:unset;
    border-width:1em 0 1em 2em
}
.d-event.fa,.d-event.fab,.d-event.fad,.d-event.fal,.d-event.far,.d-event.fas{
    font-family:inherit;
    font-weight:inherit;
    line-height:inherit
}
.d-event.fa:before,.d-event.fab:before,.d-event.fad:before,.d-event.fal:before,.d-event.far:before,.d-event.fas:before{
    display:inline-block;
    position:relative;
    background-color:transparent !important;
    font-style:normal;
    font-variant:normal;
    text-rendering:auto;
    width:auto;
    height:auto
}
.d-event.fa:before,.d-event.fab:before,.d-event.fal:before,.d-event.far:before,.d-event.fas:before{
    font-family:"Font Awesome 6 Pro","Font Awesome 6 Free","Font Awesome 5 Pro","Font Awesome 5 Free"
}
.d-event.fal:before{
    font-weight:300
}
.d-event.far:before{
    font-weight:400
}
.d-event.fa:before,.d-event.fas:before{
    font-weight:900
}
.d-event.fab:before{
    font-family:"Font Awesome 6 Brands","Font Awesome 5 Brands";
    font-weight:400
}
.d-event.fad{
    position:absolute
}
.d-event.fad:after{
    display:inline-block;
    background-color:transparent !important;
    font-style:normal;
    font-variant:normal;
    text-rendering:auto;
    position:absolute;
    left:0
}
.d-event.fad:before,.d-event.fad:after{
    font-family:"Font Awesome 6 Duotone","Font Awesome 5 Duotone";
    font-weight:900
}
.d-event[class*=fa-rotate-],.d-event[class*=fa-flip-]{
    transform:none
}
.d-event.fa-rotate-90:before,.d-event.fa-rotate-90:after{
    transform:rotate(90deg)
}
.d-event.fa-rotate-180:before,.d-event.fa-rotate-180:after{
    transform:rotate(180deg)
}
.d-event.fa-rotate-270:before,.d-event.fa-rotate-270:after{
    transform:rotate(270deg)
}
.d-event.fa-flip-horizontal:before,.d-event.fa-flip-horizontal:after{
    transform:scaleX(-1)
}
.d-event.fa-flip-vertical:before,.d-event.fa-flip-vertical:after{
    transform:scaleY(-1)
}
.d-event.fa-flip-both:before,.d-event.fa-flip-both:after{
    transform:scale(-1, -1)
}
.d-tape-event.fa,.d-tape-event.fab,.d-tape-event.fad,.d-tape-event.fal,.d-tape-event.far,.d-tape-event.fas{
    font-family:inherit;
    font-weight:inherit
}
.d-tape-event.fa:before,.d-tape-event.fab:before,.d-tape-event.fad:before,.d-tape-event.fal:before,.d-tape-event.far:before,.d-tape-event.fas:before{
    content:none !important
}
.d-event-text {
    color: #5E5545;
    font-weight: 500;
    font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}
#bgmEventdl {
    border: 1px solid #BDB9B3;
    -webkit-box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.04);
    -moz-box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.04);
    box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.04);
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    overflow: hidden;
}
a.vanillaLink {
    color: #5E5545 !important;
    z-index: 100;
}
`;
    document.head.appendChild(style);
    // add library
    var Dateline=function(t){"use strict";var e=function(t){function e(e){for(var n,r=[],i=arguments.length-1;i-- >0;)r[i]=arguments[i+1];t.call(this),Object.defineProperty(this,"compare",{value:e}),(n=this).insert.apply(n,r)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype._binarySearch=function(t){for(var e=-1,n=this.length;1+e<n;){var r=e+(n-e>>1);t(this[r])?n=r:e=r}return n},e.prototype.binIndexOf=function(t){var e=this,n=this._binarySearch((function(n){return 0>=e.compare(t,n)}));return n>=this.length||this.compare(t,this[n])?-1:n},e.prototype.binInsertPosOf=function(t){var e=this;return this._binarySearch((function(n){return 0>=e.compare(t,n)}))},e.prototype.binFind=function(t){var e=this,n=this._binarySearch((function(n){return 0>=e.compare(t,n)})),r=this[n];return n>=this.length||this.compare(t,r)?void 0:r},e.prototype.insert=function(){for(var t=this,e=[],n=arguments.length;n--;)e[n]=arguments[n];e.forEach((function(e){var n=t._binarySearch((function(n){return 0>=t.compare(e,n)}));t.splice(n,0,e)}))},e}(Array);function n(t){return t instanceof Date?t:new Date(t)}function r(){for(var t,e=[],n=arguments.length;n--;)e[n]=arguments[n];var r=document.createElement("div");return(t=r.classList).add.apply(t,e),r}function i(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];t.forEach((function(t){t.classList.remove("d-hidden")}))}function a(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];t.forEach((function(t){t.classList.add("d-hidden")}))}function s(t,e,n){t.style[e]=n+"px"}function o(t){var e=this;this.widget=t,this.info=r("d-info");var n=r("d-bubble","d-hidden"),i=r("d-close");i.innerHTML="&times;",i.addEventListener("click",(function(t){e.hide()})),n.append(i,this.info),this.element=n}function u(t,e){var n=t.getFullYear();return{plus:!(n%e),text:n}}o.prototype={show:function(t){return i(this.element),s(this.element,"left",t.left),s(this.element,"top",t.top),this},hide:function(){return a(this.element),this.widget.clearHilight(),this},setInfo:function(t){return this.info.innerHTML=t,this}};var c=[function(t){var e=t.getMilliseconds();return{plus:!e,text:e}},function(t){var e=t.getSeconds();return{plus:!e,text:e}},function(t){var e=t.getMinutes();return{plus:!e,text:e||t.getHours()}},function(t){var e=t.getHours();return{plus:!e,text:e||t.getDate()}},function(t,e){var n=t.getDate();return{plus:1===n,text:1===n?t.toLocaleDateString(e,{month:"short"}):n}},function(t,e){return{plus:!1,text:t.toLocaleDateString(e,{month:"short",day:"numeric"})}},function(t,e){return t.getMonth()?{plus:!1,text:t.toLocaleDateString(e,{month:"short"})}:u(t,1)},function(t){return u(t,10)},function(t){return u(t,100)},function(t){return u(t,1e3)},function(t){return u(t,1e4)}];function l(t){this.content=t,this.band=t.band,this.widget=t.widget,this.markerText=c[t.band.scale],this.element=r("d-markers")}function h(t){this.content=t,this.band=t.band,this.widget=t.widget,this.renderEvent="overview"===t.band.layout?this.renderOverviewEvent:this.renderNormalEvent,this.element=r("d-events"),this.overflows=[]}function d(t){this.band=t,this.widget=t.widget,this.center=new Date(this.widget._cursor),this.range={begin:new Date,end:new Date},this.safe={begin:new Date,end:new Date},this.visible={begin:new Date,end:new Date};var e=r("d-content");this.markers=new l(this),this.events=new h(this),e.append(this.markers.element,this.events.element),this.element=e}l.prototype={render:function(){for(var t,e,n,i=this.content.range.begin,a=this.content.range.end,o=new Date(i);e=this.element.firstChild;)this.element.removeChild(e);for(this.band.ceilDate(o);o<a;)t=this.markerText(o,this.widget.settings.locale),n=r("d-marker"),t.plus&&n.classList.add("d-plus"),s(n,"left",this.band.calcPixels(o-i)),n.innerText=t.text,this.element.append(n),this.band.incrDate(o)}},h.prototype={render:function(){for(var t,e,n,r=this,i=this.widget.events,a=this.content.range,s=i.binInsertPosOf({start:a.begin}),o=i.binInsertPosOf({start:a.end});n=this.element.firstChild;)this.element.removeChild(n);for(this.nLines=Math.floor(this.element.clientHeight/this.widget.lineHeight),this.lines=[],t=0;t<this.nLines;t++)this.lines.push(0);for(this.topMargin=(this.element.clientHeight-this.nLines*this.widget.lineHeight)/2,t=0;t<s;t++)(e=i[t]).stop&&e.stop>a.begin&&this.renderEvent(e);for(t=s;t<o;t++)this.renderEvent(i[t]);this.overflows.forEach((function(t){var e=r.widget.events.findIndex((function(e){return e===t}));e>-1&&r.widget.events.splice(e,1)}))},renderNormalEvent:function(t){var e,n,i,a,o=this,u=this.band,c=u.index,l=this.content.range,h=this.calcPos(t.start),d=this.widget.settings.locale;if(h){t.elements[c]?e=t.elements[c]:(e=document.createElement("div"),n=t.start.toLocaleString(d,this.band.helpers.loc),t.class&&(e.className=t.class),e.innerHTML=t.text,e.dataset.id=t.id,t.stop?(n+=" ... "+t.stop.toLocaleString(d,this.band.helpers.loc),e.classList.add("d-tape-event"),e.prepend(r("d-tape"))):e.classList.add("d-event"),e.title=n,this.widget.settings.url&&(["touchstart","touchend","mousedown"].forEach((function(t){e.addEventListener(t,(function(t){t.stopPropagation()}))})),e.addEventListener("click",(function(t){var e=o.widget.settings.url+t.target.dataset.id;if(o.widget.hilight(t.target),o.widget.settings.redirect)window.location=e;else{var n=o.band.element.getBoundingClientRect(),r={top:t.clientY-t.offsetY-n.y,left:t.clientX-t.offsetX-n.x},i=o.widget.bubble,a=new XMLHttpRequest;i.show(r).setInfo(o.widget.settings.loading),a.open("GET",e,!0),a.onloadend=function(){this.status>=200&&this.status<400&&i.setInfo(this.response)},a.send()}}))),t.elements[c]=e),s(e,"left",h.left),s(e,"top",h.line*this.widget.lineHeight+this.topMargin),t.stop&&(i=Math.max(t.start,l.begin),a=Math.min(t.stop,l.end),s(e.firstChild,"width",Math.max(u.calcPixels(a-i),1)),t.post_start&&t.post_start>i&&s(e.firstChild,"borderLeftWidth",u.calcPixels(t.post_start-i)),t.pre_stop&&t.pre_stop<a&&s(e.firstChild,"borderRightWidth",u.calcPixels(a-t.pre_stop))),this.element.append(e);var f=window.getComputedStyle(e,":before");s(e,"marginLeft",parseInt(f.getPropertyValue("width"),10)/-2),this.lines[h.line]=h.left+e.clientWidth}else console.warn("Dateline overflow",t),this.overflows.push(t)},renderOverviewEvent:function(t){var e,n,i,a=this.band.index;t.elements[a]?e=t.elements[a]:(e=r(t.stop?"d-tape-pin":"d-pin"),t.elements[a]=e),t.stop?(n=Math.max(t.start,this.content.range.begin),i=Math.min(t.stop,this.content.range.end),s(e,"left",this.content.calcLeft(n)),s(e,"width",Math.max(this.band.calcPixels(i-n),1))):s(e,"left",this.content.calcLeft(t.start)),this.element.append(e)},calcPos:function(t){var e,n=this.content.calcLeft(t);for(e=0;e<this.nLines&&!(n>=this.lines[e]);e++);return!(e>=this.nLines)&&{left:n,line:e}}},d.prototype={render:function(){var t=this.widget,e=this.range.begin,n=this.range.end;if(this.markers.render(),this.events.render(),this.element.querySelectorAll(".d-limit").forEach((function(t){t.remove()})),t._begin&&t._begin>e&&t._begin<n){var i=r("d-limit","d-begin");s(i,"right",this.calcRight(t._begin)),this.element.append(i)}if(t._end&&t._end>e&&t._end<n){var a=r("d-limit","d-end");s(a,"left",this.calcLeft(t._end)),this.element.append(a)}},setWidth:function(t){this.width=t,this.calcRange(),s(this.element,"width",t),this.place(),this.render()},calcLeft:function(t){return this.band.calcPixels(t-this.range.begin)},calcRight:function(t){return this.band.calcPixels(this.range.end-t)},calcRange:function(){var t=this.center.getTime(),e=this.band.calcMs(this.width)/2,n=2*e/3;this.range.begin.setTime(t-e),this.range.end.setTime(t+e),this.safe.begin.setTime(t-n),this.safe.end.setTime(t+n)},place:function(){var t,e,n=this.widget._cursor,r=this.widget.getWidth();(n<this.safe.begin||n>this.safe.end)&&(this.center.setTime(n.getTime()),this.calcRange(),this.render()),s(this.element,"left",this.band.calcPixels(this.center-n)-(this.width-r)/2),t=n.getTime(),e=this.band.calcMs(r)/2,this.visible.begin.setTime(t-e),this.visible.end.setTime(t+e)}};var f={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},g={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},p=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],m={CSS:{},springs:{}};function v(t,e,n){return Math.min(Math.max(t,e),n)}function b(t,e){return t.indexOf(e)>-1}function y(t,e){return t.apply(null,e)}var w={arr:function(t){return Array.isArray(t)},obj:function(t){return b(Object.prototype.toString.call(t),"Object")},pth:function(t){return w.obj(t)&&t.hasOwnProperty("totalLength")},svg:function(t){return t instanceof SVGElement},inp:function(t){return t instanceof HTMLInputElement},dom:function(t){return t.nodeType||w.svg(t)},str:function(t){return"string"==typeof t},fnc:function(t){return"function"==typeof t},und:function(t){return void 0===t},nil:function(t){return w.und(t)||null===t},hex:function(t){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)},rgb:function(t){return/^rgb/.test(t)},hsl:function(t){return/^hsl/.test(t)},col:function(t){return w.hex(t)||w.rgb(t)||w.hsl(t)},key:function(t){return!f.hasOwnProperty(t)&&!g.hasOwnProperty(t)&&"targets"!==t&&"keyframes"!==t}};function M(t){var e=/\(([^)]+)\)/.exec(t);return e?e[1].split(",").map((function(t){return parseFloat(t)})):[]}function x(t,e){var n=M(t),r=v(w.und(n[0])?1:n[0],.1,100),i=v(w.und(n[1])?100:n[1],.1,100),a=v(w.und(n[2])?10:n[2],.1,100),s=v(w.und(n[3])?0:n[3],.1,100),o=Math.sqrt(i/r),u=a/(2*Math.sqrt(i*r)),c=u<1?o*Math.sqrt(1-u*u):0,l=u<1?(u*o-s)/c:-s+o;function h(t){var n=e?e*t/1e3:t;return n=u<1?Math.exp(-n*u*o)*(1*Math.cos(c*n)+l*Math.sin(c*n)):(1+l*n)*Math.exp(-n*o),0===t||1===t?t:1-n}return e?h:function(){var e=m.springs[t];if(e)return e;for(var n=1/6,r=0,i=0;;)if(1===h(r+=n)){if(++i>=16)break}else i=0;var a=r*n*1e3;return m.springs[t]=a,a}}function _(t){return void 0===t&&(t=10),function(e){return Math.ceil(v(e,1e-6,1)*t)*(1/t)}}var E,T,D=function(){var t=.1;function e(t,e){return 1-3*e+3*t}function n(t,e){return 3*e-6*t}function r(t){return 3*t}function i(t,i,a){return((e(i,a)*t+n(i,a))*t+r(i))*t}function a(t,i,a){return 3*e(i,a)*t*t+2*n(i,a)*t+r(i)}return function(e,n,r,s){if(0<=e&&e<=1&&0<=r&&r<=1){var o=new Float32Array(11);if(e!==n||r!==s)for(var u=0;u<11;++u)o[u]=i(u*t,e,r);return function(t){return e===n&&r===s||0===t||1===t?t:i(c(t),n,s)}}function c(n){for(var s=0,u=1;10!==u&&o[u]<=n;++u)s+=t;--u;var c=s+(n-o[u])/(o[u+1]-o[u])*t,l=a(c,e,r);return l>=.001?function(t,e,n,r){for(var s=0;s<4;++s){var o=a(e,n,r);if(0===o)return e;e-=(i(e,n,r)-t)/o}return e}(n,c,e,r):0===l?c:function(t,e,n,r,a){var s,o,u=0;do{(s=i(o=e+(n-e)/2,r,a)-t)>0?n=o:e=o}while(Math.abs(s)>1e-7&&++u<10);return o}(n,s,s+t,e,r)}}}(),L=(E={linear:function(){return function(t){return t}}},T={Sine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},Circ:function(){return function(t){return 1-Math.sqrt(1-t*t)}},Back:function(){return function(t){return t*t*(3*t-2)}},Bounce:function(){return function(t){for(var e,n=4;t<((e=Math.pow(2,--n))-1)/11;);return 1/Math.pow(4,3-n)-7.5625*Math.pow((3*e-2)/22-t,2)}},Elastic:function(t,e){void 0===t&&(t=1),void 0===e&&(e=.5);var n=v(t,1,10),r=v(e,.1,2);return function(t){return 0===t||1===t?t:-n*Math.pow(2,10*(t-1))*Math.sin((t-1-r/(2*Math.PI)*Math.asin(1/n))*(2*Math.PI)/r)}}},["Quad","Cubic","Quart","Quint","Expo"].forEach((function(t,e){T[t]=function(){return function(t){return Math.pow(t,e+2)}}})),Object.keys(T).forEach((function(t){var e=T[t];E["easeIn"+t]=e,E["easeOut"+t]=function(t,n){return function(r){return 1-e(t,n)(1-r)}},E["easeInOut"+t]=function(t,n){return function(r){return r<.5?e(t,n)(2*r)/2:1-e(t,n)(-2*r+2)/2}},E["easeOutIn"+t]=function(t,n){return function(r){return r<.5?(1-e(t,n)(1-2*r))/2:(e(t,n)(2*r-1)+1)/2}}})),E);function I(t,e){if(w.fnc(t))return t;var n=t.split("(")[0],r=L[n],i=M(t);switch(n){case"spring":return x(t,e);case"cubicBezier":return y(D,i);case"steps":return y(_,i);default:return y(r,i)}}function P(t){try{return document.querySelectorAll(t)}catch(t){return}}function O(t,e){for(var n=t.length,r=arguments.length>=2?arguments[1]:void 0,i=[],a=0;a<n;a++)if(a in t){var s=t[a];e.call(r,s,a,t)&&i.push(s)}return i}function k(t){return t.reduce((function(t,e){return t.concat(w.arr(e)?k(e):e)}),[])}function C(t){return w.arr(t)?t:(w.str(t)&&(t=P(t)||t),t instanceof NodeList||t instanceof HTMLCollection?[].slice.call(t):[t])}function F(t,e){return t.some((function(t){return t===e}))}function S(t){var e={};for(var n in t)e[n]=t[n];return e}function H(t,e){var n=S(t);for(var r in t)n[r]=e.hasOwnProperty(r)?e[r]:t[r];return n}function Y(t,e){var n=S(t);for(var r in e)n[r]=w.und(t[r])?e[r]:t[r];return n}function B(t){return w.rgb(t)?(n=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e=t))?"rgba("+n[1]+",1)":e:w.hex(t)?function(t){var e=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(t,e,n,r){return e+e+n+n+r+r})),n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return"rgba("+parseInt(n[1],16)+","+parseInt(n[2],16)+","+parseInt(n[3],16)+",1)"}(t):w.hsl(t)?function(t){var e,n,r,i=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t),a=parseInt(i[1],10)/360,s=parseInt(i[2],10)/100,o=parseInt(i[3],10)/100,u=i[4]||1;function c(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*(e-t)*n:n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}if(0==s)e=n=r=o;else{var l=o<.5?o*(1+s):o+s-o*s,h=2*o-l;e=c(h,l,a+1/3),n=c(h,l,a),r=c(h,l,a-1/3)}return"rgba("+255*e+","+255*n+","+255*r+","+u+")"}(t):void 0;var e,n}function A(t){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(t);if(e)return e[1]}function N(t,e){return w.fnc(t)?t(e.target,e.id,e.total):t}function R(t,e){return t.getAttribute(e)}function W(t,e,n){if(F([n,"deg","rad","turn"],A(e)))return e;var r=m.CSS[e+n];if(!w.und(r))return r;var i=document.createElement(t.tagName),a=t.parentNode&&t.parentNode!==document?t.parentNode:document.body;a.appendChild(i),i.style.position="absolute",i.style.width=100+n;var s=100/i.offsetWidth;a.removeChild(i);var o=s*parseFloat(e);return m.CSS[e+n]=o,o}function j(t,e,n){if(e in t.style){var r=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),i=t.style[e]||getComputedStyle(t).getPropertyValue(r)||"0";return n?W(t,i,n):i}}function X(t,e){return w.dom(t)&&!w.inp(t)&&(!w.nil(R(t,e))||w.svg(t)&&t[e])?"attribute":w.dom(t)&&F(p,e)?"transform":w.dom(t)&&"transform"!==e&&j(t,e)?"css":null!=t[e]?"object":void 0}function q(t){if(w.dom(t)){for(var e,n=t.style.transform||"",r=/(\w+)\(([^)]*)\)/g,i=new Map;e=r.exec(n);)i.set(e[1],e[2]);return i}}function V(t,e,n,r){var i=b(e,"scale")?1:0+function(t){return b(t,"translate")||"perspective"===t?"px":b(t,"rotate")||b(t,"skew")?"deg":void 0}(e),a=q(t).get(e)||i;return n&&(n.transforms.list.set(e,a),n.transforms.last=e),r?W(t,a,r):a}function U(t,e,n,r){switch(X(t,e)){case"transform":return V(t,e,r,n);case"css":return j(t,e,n);case"attribute":return R(t,e);default:return t[e]||0}}function $(t,e){var n=/^(\*=|\+=|-=)/.exec(t);if(!n)return t;var r=A(t)||0,i=parseFloat(e),a=parseFloat(t.replace(n[0],""));switch(n[0][0]){case"+":return i+a+r;case"-":return i-a+r;case"*":return i*a+r}}function z(t,e){if(w.col(t))return B(t);if(/\s/g.test(t))return t;var n=A(t),r=n?t.substr(0,t.length-n.length):t;return e?r+e:r}function K(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Q(t){for(var e,n=t.points,r=0,i=0;i<n.numberOfItems;i++){var a=n.getItem(i);i>0&&(r+=K(e,a)),e=a}return r}function G(t){if(t.getTotalLength)return t.getTotalLength();switch(t.tagName.toLowerCase()){case"circle":return function(t){return 2*Math.PI*R(t,"r")}(t);case"rect":return function(t){return 2*R(t,"width")+2*R(t,"height")}(t);case"line":return function(t){return K({x:R(t,"x1"),y:R(t,"y1")},{x:R(t,"x2"),y:R(t,"y2")})}(t);case"polyline":return Q(t);case"polygon":return function(t){var e=t.points;return Q(t)+K(e.getItem(e.numberOfItems-1),e.getItem(0))}(t)}}function Z(t,e){var n=e||{},r=n.el||function(t){for(var e=t.parentNode;w.svg(e)&&w.svg(e.parentNode);)e=e.parentNode;return e}(t),i=r.getBoundingClientRect(),a=R(r,"viewBox"),s=i.width,o=i.height,u=n.viewBox||(a?a.split(" "):[0,0,s,o]);return{el:r,viewBox:u,x:u[0]/1,y:u[1]/1,w:s,h:o,vW:u[2],vH:u[3]}}function J(t,e,n){function r(n){void 0===n&&(n=0);var r=e+n>=1?e+n:0;return t.el.getPointAtLength(r)}var i=Z(t.el,t.svg),a=r(),s=r(-1),o=r(1),u=n?1:i.w/i.vW,c=n?1:i.h/i.vH;switch(t.property){case"x":return(a.x-i.x)*u;case"y":return(a.y-i.y)*c;case"angle":return 180*Math.atan2(o.y-s.y,o.x-s.x)/Math.PI}}function tt(t,e){var n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,r=z(w.pth(t)?t.totalLength:t,e)+"";return{original:r,numbers:r.match(n)?r.match(n).map(Number):[0],strings:w.str(t)||e?r.split(n):[]}}function et(t){return O(t?k(w.arr(t)?t.map(C):C(t)):[],(function(t,e,n){return n.indexOf(t)===e}))}function nt(t){var e=et(t);return e.map((function(t,n){return{target:t,id:n,total:e.length,transforms:{list:q(t)}}}))}function rt(t,e){var n=S(e);if(/^spring/.test(n.easing)&&(n.duration=x(n.easing)),w.arr(t)){var r=t.length;2===r&&!w.obj(t[0])?t={value:t}:w.fnc(e.duration)||(n.duration=e.duration/r)}var i=w.arr(t)?t:[t];return i.map((function(t,n){var r=w.obj(t)&&!w.pth(t)?t:{value:t};return w.und(r.delay)&&(r.delay=n?0:e.delay),w.und(r.endDelay)&&(r.endDelay=n===i.length-1?e.endDelay:0),r})).map((function(t){return Y(t,n)}))}function it(t,e){var n=[],r=e.keyframes;for(var i in r&&(e=Y(function(t){for(var e=O(k(t.map((function(t){return Object.keys(t)}))),(function(t){return w.key(t)})).reduce((function(t,e){return t.indexOf(e)<0&&t.push(e),t}),[]),n={},r=function(r){var i=e[r];n[i]=t.map((function(t){var e={};for(var n in t)w.key(n)?n==i&&(e.value=t[n]):e[n]=t[n];return e}))},i=0;i<e.length;i++)r(i);return n}(r),e)),e)w.key(i)&&n.push({name:i,tweens:rt(e[i],t)});return n}function at(t,e){var n;return t.tweens.map((function(r){var i=function(t,e){var n={};for(var r in t){var i=N(t[r],e);w.arr(i)&&1===(i=i.map((function(t){return N(t,e)}))).length&&(i=i[0]),n[r]=i}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}(r,e),a=i.value,s=w.arr(a)?a[1]:a,o=A(s),u=U(e.target,t.name,o,e),c=n?n.to.original:u,l=w.arr(a)?a[0]:c,h=A(l)||A(u),d=o||h;return w.und(s)&&(s=c),i.from=tt(l,d),i.to=tt($(s,l),d),i.start=n?n.end:0,i.end=i.start+i.delay+i.duration+i.endDelay,i.easing=I(i.easing,i.duration),i.isPath=w.pth(a),i.isPathTargetInsideSVG=i.isPath&&w.svg(e.target),i.isColor=w.col(i.from.original),i.isColor&&(i.round=1),n=i,i}))}var st={css:function(t,e,n){return t.style[e]=n},attribute:function(t,e,n){return t.setAttribute(e,n)},object:function(t,e,n){return t[e]=n},transform:function(t,e,n,r,i){if(r.list.set(e,n),e===r.last||i){var a="";r.list.forEach((function(t,e){a+=e+"("+t+") "})),t.style.transform=a}}};function ot(t,e){nt(t).forEach((function(t){for(var n in e){var r=N(e[n],t),i=t.target,a=A(r),s=U(i,n,a,t),o=$(z(r,a||A(s)),s),u=X(i,n);st[u](i,n,o,t.transforms,!0)}}))}function ut(t,e){return O(k(t.map((function(t){return e.map((function(e){return function(t,e){var n=X(t.target,e.name);if(n){var r=at(e,t),i=r[r.length-1];return{type:n,property:e.name,animatable:t,tweens:r,duration:i.end,delay:r[0].delay,endDelay:i.endDelay}}}(t,e)}))}))),(function(t){return!w.und(t)}))}function ct(t,e){var n=t.length,r=function(t){return t.timelineOffset?t.timelineOffset:0},i={};return i.duration=n?Math.max.apply(Math,t.map((function(t){return r(t)+t.duration}))):e.duration,i.delay=n?Math.min.apply(Math,t.map((function(t){return r(t)+t.delay}))):e.delay,i.endDelay=n?i.duration-Math.max.apply(Math,t.map((function(t){return r(t)+t.duration-t.endDelay}))):e.endDelay,i}var lt=0;var ht=[],dt=function(){var t;function e(n){for(var r=ht.length,i=0;i<r;){var a=ht[i];a.paused?(ht.splice(i,1),r--):(a.tick(n),i++)}t=i>0?requestAnimationFrame(e):void 0}return"undefined"!=typeof document&&document.addEventListener("visibilitychange",(function(){gt.suspendWhenDocumentHidden&&(ft()?t=cancelAnimationFrame(t):(ht.forEach((function(t){return t._onDocumentVisibility()})),dt()))})),function(){t||ft()&&gt.suspendWhenDocumentHidden||!(ht.length>0)||(t=requestAnimationFrame(e))}}();function ft(){return!!document&&document.hidden}function gt(t){void 0===t&&(t={});var e,n=0,r=0,i=0,a=0,s=null;function o(t){var e=window.Promise&&new Promise((function(t){return s=t}));return t.finished=e,e}var u=function(t){var e=H(f,t),n=H(g,t),r=it(n,t),i=nt(t.targets),a=ut(i,r),s=ct(a,n),o=lt;return lt++,Y(e,{id:o,children:[],animatables:i,animations:a,duration:s.duration,delay:s.delay,endDelay:s.endDelay})}(t);function c(){var t=u.direction;"alternate"!==t&&(u.direction="normal"!==t?"normal":"reverse"),u.reversed=!u.reversed,e.forEach((function(t){return t.reversed=u.reversed}))}function l(t){return u.reversed?u.duration-t:t}function h(){n=0,r=l(u.currentTime)*(1/gt.speed)}function d(t,e){e&&e.seek(t-e.timelineOffset)}function p(t){for(var e=0,n=u.animations,r=n.length;e<r;){var i=n[e],a=i.animatable,s=i.tweens,o=s.length-1,c=s[o];o&&(c=O(s,(function(e){return t<e.end}))[0]||c);for(var l=v(t-c.start-c.delay,0,c.duration)/c.duration,h=isNaN(l)?1:c.easing(l),d=c.to.strings,f=c.round,g=[],p=c.to.numbers.length,m=void 0,b=0;b<p;b++){var y=void 0,w=c.to.numbers[b],M=c.from.numbers[b]||0;y=c.isPath?J(c.value,h*w,c.isPathTargetInsideSVG):M+h*(w-M),f&&(c.isColor&&b>2||(y=Math.round(y*f)/f)),g.push(y)}var x=d.length;if(x){m=d[0];for(var _=0;_<x;_++){d[_];var E=d[_+1],T=g[_];isNaN(T)||(m+=E?T+E:T+" ")}}else m=g[0];st[i.type](a.target,i.property,m,a.transforms),i.currentValue=m,e++}}function m(t){u[t]&&!u.passThrough&&u[t](u)}function b(t){var h=u.duration,f=u.delay,g=h-u.endDelay,b=l(t);u.progress=v(b/h*100,0,100),u.reversePlayback=b<u.currentTime,e&&function(t){if(u.reversePlayback)for(var n=a;n--;)d(t,e[n]);else for(var r=0;r<a;r++)d(t,e[r])}(b),!u.began&&u.currentTime>0&&(u.began=!0,m("begin")),!u.loopBegan&&u.currentTime>0&&(u.loopBegan=!0,m("loopBegin")),b<=f&&0!==u.currentTime&&p(0),(b>=g&&u.currentTime!==h||!h)&&p(h),b>f&&b<g?(u.changeBegan||(u.changeBegan=!0,u.changeCompleted=!1,m("changeBegin")),m("change"),p(b)):u.changeBegan&&(u.changeCompleted=!0,u.changeBegan=!1,m("changeComplete")),u.currentTime=v(b,0,h),u.began&&m("update"),t>=h&&(r=0,u.remaining&&!0!==u.remaining&&u.remaining--,u.remaining?(n=i,m("loopComplete"),u.loopBegan=!1,"alternate"===u.direction&&c()):(u.paused=!0,u.completed||(u.completed=!0,m("loopComplete"),m("complete"),!u.passThrough&&"Promise"in window&&(s(),o(u)))))}return o(u),u.reset=function(){var t=u.direction;u.passThrough=!1,u.currentTime=0,u.progress=0,u.paused=!0,u.began=!1,u.loopBegan=!1,u.changeBegan=!1,u.completed=!1,u.changeCompleted=!1,u.reversePlayback=!1,u.reversed="reverse"===t,u.remaining=u.loop,e=u.children;for(var n=a=e.length;n--;)u.children[n].reset();(u.reversed&&!0!==u.loop||"alternate"===t&&1===u.loop)&&u.remaining++,p(u.reversed?u.duration:0)},u._onDocumentVisibility=h,u.set=function(t,e){return ot(t,e),u},u.tick=function(t){i=t,n||(n=i),b((i+(r-n))*gt.speed)},u.seek=function(t){b(l(t))},u.pause=function(){u.paused=!0,h()},u.play=function(){u.paused&&(u.completed&&u.reset(),u.paused=!1,ht.push(u),h(),dt())},u.reverse=function(){c(),u.completed=!u.reversed,h()},u.restart=function(){u.reset(),u.play()},u.remove=function(t){mt(et(t),u)},u.reset(),u.autoplay&&u.play(),u}function pt(t,e){for(var n=e.length;n--;)F(t,e[n].animatable.target)&&e.splice(n,1)}function mt(t,e){var n=e.animations,r=e.children;pt(t,n);for(var i=r.length;i--;){var a=r[i],s=a.animations;pt(t,s),s.length||a.children.length||r.splice(i,1)}n.length||r.length||e.pause()}gt.version="3.2.1",gt.speed=1,gt.suspendWhenDocumentHidden=!0,gt.running=ht,gt.remove=function(t){for(var e=et(t),n=ht.length;n--;){mt(e,ht[n])}},gt.get=U,gt.set=ot,gt.convertPx=W,gt.path=function(t,e){var n=w.str(t)?P(t)[0]:t,r=e||100;return function(t){return{property:t,el:n,svg:Z(n),totalLength:G(n)*(r/100)}}},gt.setDashoffset=function(t){var e=G(t);return t.setAttribute("stroke-dasharray",e),e},gt.stagger=function(t,e){void 0===e&&(e={});var n=e.direction||"normal",r=e.easing?I(e.easing):null,i=e.grid,a=e.axis,s=e.from||0,o="first"===s,u="center"===s,c="last"===s,l=w.arr(t),h=l?parseFloat(t[0]):parseFloat(t),d=l?parseFloat(t[1]):0,f=A(l?t[1]:t)||0,g=e.start||0+(l?h:0),p=[],m=0;return function(t,e,v){if(o&&(s=0),u&&(s=(v-1)/2),c&&(s=v-1),!p.length){for(var b=0;b<v;b++){if(i){var y=u?(i[0]-1)/2:s%i[0],w=u?(i[1]-1)/2:Math.floor(s/i[0]),M=y-b%i[0],x=w-Math.floor(b/i[0]),_=Math.sqrt(M*M+x*x);"x"===a&&(_=-M),"y"===a&&(_=-x),p.push(_)}else p.push(Math.abs(s-b));m=Math.max.apply(Math,p)}r&&(p=p.map((function(t){return r(t/m)*m}))),"reverse"===n&&(p=p.map((function(t){return a?t<0?-1*t:-t:Math.abs(m-t)})))}return g+(l?(d-h)/m:h)*(Math.round(100*p[e])/100)+f}},gt.timeline=function(t){void 0===t&&(t={});var e=gt(t);return e.duration=0,e.add=function(n,r){var i=ht.indexOf(e),a=e.children;function s(t){t.passThrough=!0}i>-1&&ht.splice(i,1);for(var o=0;o<a.length;o++)s(a[o]);var u=Y(n,H(g,t));u.targets=u.targets||t.targets;var c=e.duration;u.autoplay=!1,u.direction=e.direction,u.timelineOffset=w.und(r)?c:$(r,c),s(e),e.seek(u.timelineOffset);var l=gt(u);s(l),a.push(l);var h=ct(a,t);return e.delay=h.delay,e.endDelay=h.endDelay,e.duration=h.duration,e.seek(0),e.reset(),e.autoplay&&e.play(),e},e},gt.easing=I,gt.penner=L,gt.random=function(t,e){return Math.floor(Math.random()*(e-t+1))+t};var vt,bt,yt,wt,Mt,xt,_t,Et=0;function Tt(t){for(var e=0;e<t.changedTouches.length;e++)if(t.changedTouches[e].identifier===wt)return t.changedTouches[e];return null}function Dt(t){t.preventDefault();var e=Tt(t);if(e){var n=e.clientX;vt.move(n-Mt),xt*=.4,xt+=(n-Mt)/(t.timeStamp-_t)*.6,Mt=n,_t=t.timeStamp}}function Lt(t){t.preventDefault(),wt=void 0}function It(t){t.preventDefault();var e=Tt(t);wt=void 0,e&&(Math.abs(xt)>.1?(Mt=0,Et=gt({targets:{x:0},x:500*xt,duration:1500,easing:"easeOutExpo",update:function(t){var e=t.animations[0].currentValue;vt.move(e-Mt),Mt=e},complete:function(t){Et=0,vt.endDrag()}})):Math.abs(e.clientX-bt)<4&&Math.abs(e.clientY-yt)<4?vt.click(e.clientX):vt.endDrag())}function Pt(t){t.preventDefault(),vt.move(t.movementX)}function Ot(t){Math.abs(t.clientX-bt)<4&&Math.abs(t.clientY-yt)<4?vt.click(t.clientX):vt.endDrag(),document.removeEventListener("mousemove",Pt,!1),document.removeEventListener("mouseup",Ot,!1)}function kt(t){bt=t.clientX,yt=t.clientY,document.addEventListener("mousemove",Pt,!1),document.addEventListener("mouseup",Ot,!1)}function Ct(t,e,n){var s=this;this.widget=t,this.index=n,Object.assign(this,{multiple:1},e),this.before=r("d-rangeBox","d-before"),this.after=r("d-rangeBox","d-after"),this.leftIndicator=r("d-indicator","d-left","d-hidden"),this.leftIndicator.addEventListener("mousedown",(function(t){s.stepLeft(t.shiftKey),t.preventDefault()})),this.rightIndicator=r("d-indicator","d-right","d-hidden"),this.rightIndicator.addEventListener("mousedown",(function(t){s.stepRight(t.shiftKey),t.preventDefault()})),this.content=new d(this);var o=r("d-band","d-band-"+n,"d-scale-"+this.scale);o.setAttribute("tabindex","0"),o.style.height=this.size,o.append(this.before,this.after,this.content.element,this.leftIndicator,this.rightIndicator),o.addEventListener("touchstart",(function(t){s.focus(),function(t){t.preventDefault(),void 0===wt&&(Et&&(Et.pause(),Et=0),wt=t.changedTouches[0].identifier,Mt=bt=t.changedTouches[0].clientX,yt=t.changedTouches[0].clientY,_t=t.timeStamp,xt=0)}(t)}),!1),o.addEventListener("touchmove",Dt,!1),o.addEventListener("touchend",It,!1),o.addEventListener("touchcancel",Lt,!1),o.addEventListener("mousedown",kt,!1),o.addEventListener("focus",(function(t){i(s.leftIndicator,s.rightIndicator),s.widget.focus=s.index,s.focus()})),o.addEventListener("blur",(function(t){a(s.leftIndicator,s.rightIndicator)})),o.addEventListener("keydown",(function(t){var e=s.widget,n=!0;switch(t.key){case"Tab":var r,i,a=e.events;(i=t.shiftKey?(r=a.binInsertPosOf({start:e.getMs()-1}))>0?a[r-1].start:e._begin:(r=a.binInsertPosOf({start:e.getMs()+1}))<a.length?a[r].start:e._end)&&s.animateTo(i.getTime());break;case"PageUp":s.stepRight(!0);break;case"PageDown":s.stepLeft(!0);break;case"End":e._end&&s.animateTo(e._end.getTime());break;case"Home":e._begin&&s.animateTo(e._begin.getTime());break;case"ArrowLeft":s.stepLeft(t.shiftKey);break;case"ArrowUp":e.cycleFocus(-1);break;case"ArrowRight":s.stepRight(t.shiftKey);break;case"ArrowDown":e.cycleFocus(1);break;default:n=!1}n&&(t.preventDefault(),t.stopPropagation())})),this.element=o}Ct.prototype={get scale(){return this._scale},set scale(t){this._scale=t,this.helpers=this._helpers[t]},setWidth:function(t){this.content.setWidth(t)},place:function(){this.content.place()},setFocus:function(){this.element.focus()},setRange:function(t){var e=this.widget._cursor;t?(s(this.before,"width",this.calcPixels(e-t.begin)),s(this.after,"width",this.calcPixels(t.end-e))):(this.before.style.width=null,this.after.style.width=null)},setRangeFrom:function(t){this.setRange(t.content.visible)},calcPixels:function(t){var e=t*this.interval/this.helpers.ms;return+(Math.round(e+"e+3")+"e-3")},calcMs:function(t){return t*this.helpers.ms/this.interval},stepLeft:function(t){var e=this.widget;this.animateTo(e.getMs()-(t?this.helpers.big:1)*this.helpers.ms)},stepRight:function(t){var e=this.widget;this.animateTo(e.getMs()+(t?this.helpers.big:1)*this.helpers.ms)},floorDate:function(t){this.helpers.floor(t,this.multiple)},ceilDate:function(t){this.helpers.floor(t,this.multiple),this.helpers.incr(t,this.multiple)},incrDate:function(t){this.helpers.incr(t,this.multiple)},animateTo:function(t){var e=this.calcPixels(Math.abs(this.widget.getMs()-t));this.widget.animateTo(t,100*Math.log(e))},focus:function(){vt=this},move:function(t){this.widget.place(this.widget.getMs()-this.calcMs(t))},endDrag:function(){this.widget.triggerChange()},click:function(t){var e=this.element.getBoundingClientRect();this.animateTo(this.content.visible.begin.getTime()+this.calcMs(t-e.x))},_helpers:[{ms:1,big:10,loc:{hour:"2-digit",minute:"2-digit",second:"2-digit"},floor:function(t,e){var n=t.getMilliseconds();t.setMilliseconds(n-n%e)},incr:function(t,e){t.setMilliseconds(t.getMilliseconds()+e)}},{ms:1e3,big:10,loc:{hour:"2-digit",minute:"2-digit",second:"2-digit"},floor:function(t,e){var n=t.getSeconds();t.setSeconds(n-n%e,0)},incr:function(t,e){t.setSeconds(t.getSeconds()+e,0)}},{ms:6e4,big:10,loc:{hour:"2-digit",minute:"2-digit",second:"2-digit"},floor:function(t,e){var n=t.getMinutes();t.setMinutes(n-n%e,0,0)},incr:function(t,e){t.setMinutes(t.getMinutes()+e,0,0)}},{ms:36e5,big:10,loc:{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"},floor:function(t,e){var n=t.getHours();t.setHours(n-n%e,0,0,0)},incr:function(t,e){t.setHours(t.getHours()+e,0,0,0)}},{ms:864e5,big:7,loc:{year:"numeric",month:"numeric",day:"numeric",hour:"2-digit"},floor:function(t,e){var n=864e5,r=t.getTime()/n;t.setTime((r-r%e)*n),t.setHours(0,0,0,0)},incr:function(t,e){t.setDate(t.getDate()+e)}},{ms:6048e5,big:10,loc:{year:"numeric",month:"long",day:"numeric"},floor:function(t,e){var n=6048e5,r=t.getTime();r-=3456e5,r/=n,t.setTime((r-r%e)*n),t.setHours(0,0,0,0)},incr:function(t,e){t.setDate(t.getDate()+7*e)}},{ms:2629743750,big:12,loc:{year:"numeric",month:"long",day:"numeric"},floor:function(t,e){var n=t.getMonth();t.setMonth(n-n%e,1),t.setHours(0,0,0,0)},incr:function(t,e){t.setMonth(t.getMonth()+e,1)}},{ms:31556925e3,big:10,loc:{year:"numeric",month:"long",day:"numeric"},floor:function(t,e){var n=t.getFullYear();t.setFullYear(n-n%e,0,1),t.setHours(0,0,0,0)},incr:function(t,e){t.setFullYear(t.getFullYear()+e,0,1)}},{ms:31556925e4,big:10,loc:{year:"numeric",month:"long",day:"numeric"},floor:function(t,e){var n=t.getFullYear();t.setFullYear(n-n%(10*e),0,1),t.setHours(0,0,0,0)},incr:function(t,e){t.setFullYear(t.getFullYear()+10*e,0,1)}},{ms:31556925e5,big:10,loc:{year:"numeric",month:"numeric"},floor:function(t,e){var n=t.getFullYear();t.setFullYear(n-n%(100*e),0,1),t.setHours(0,0,0,0)},incr:function(t,e){t.setFullYear(t.getFullYear()+100*e,0,1)}},{ms:31556925e6,big:10,loc:{year:"numeric",month:"numeric"},floor:function(t,e){var n=t.getFullYear();t.setFullYear(n-n%(1e3*e),0,1),t.setHours(0,0,0,0)},incr:function(t,e){t.setFullYear(t.getFullYear()+1e3*e,0,1)}}]};function Ft(t){var e;try{e=window[t];var n="__storage_test__";return e.setItem(n,n),e.removeItem(n),!0}catch(t){return t instanceof DOMException&&(22===t.code||1014===t.code||"QuotaExceededError"===t.name||"NS_ERROR_DOM_QUOTA_REACHED"===t.name)&&e&&0!==e.length}}var St={size:"320px",bands:[{size:"100%",scale:6,interval:60}],cursor:new Date,rememberCursor:!0,begin:null,end:null,events:[],redirect:!1,url:!1,loading:"Loading&hellip;",scrollFactor:5,locale:"default"};function Ht(t,e){var i=this;if(this.id=t,this.settings=Object.assign({},St,e),["begin","end","cursor"].forEach((function(t){i.settings[t]&&(i["_"+t]=n(i.settings[t]))})),this.settings.rememberCursor&&Ft("sessionStorage")){var a=parseInt(window.sessionStorage.getItem("dateline_"+this.id),10);a&&this._cursor.setTime(a)}var s=document.getElementById(t);s.classList.add("d-dateline"),s.setAttribute("tabindex","0"),s.style.height=this.settings.size;var u=window.getComputedStyle(s);this.lineHeight=parseInt(u.getPropertyValue("line-height"),10),this.inner=r("d-inner"),this.bubble=new o(this).setInfo("Bubble"),s.append(this.inner,this.bubble.element),this.element=s,this.focus=0,this.prepareBands(),this.prepareEvents(),this.setWidth(),this._hilight=null,this._intval=null,this._busy=!1,Object.defineProperty(this,"cursor",{get:function(){return new Date(this._cursor)},set:function(t){this.animateTo(n(t).getTime())},enumerable:!0,configurable:!0})}return Ht.prototype={prepareBands:function(){var t=this.settings.bands;t.length||(this.inner.innerHTML="No bands defined."),this.bands=t.map((function(t,e,n){var r=new Ct(this,t,e);return this.inner.append(r.element),r}),this)},prepareEvents:function(){var t=this;this.events=new e((function(t,e){return t.start>e.start})),this.settings.events.forEach((function(e){["start","stop","post_start","pre_stop"].forEach((function(t){e[t]&&(e[t]=n(e[t]))})),e.elements=[],t.events.insert(e)}))},getWidth:function(){return this.element.clientWidth},setWidth:function(){var t=this.element.clientWidth*this.settings.scrollFactor;this.bands.forEach((function(e){e.setWidth(t)})),this.sync()},place:function(t){var e;this.bubble.hide(),this._begin&&t<(e=this._begin.getTime())&&(t=e),this._end&&t>(e=this._end.getTime())&&(t=e),this._cursor.setTime(t),this.bands.forEach((function(t){t.content.place()})),this.sync()},animateTo:function(t,e){var n=this;if(!this._busy){this._busy=!0;var r,i={cursor:this.getMs()};this._begin&&t<(r=this._begin.getTime())&&(t=r),this._end&&t>(r=this._end.getTime())&&(t=r),gt({targets:i,cursor:t,duration:e||800,easing:"easeInOutCubic",update:function(t){n.place(i.cursor)},complete:function(t){n._busy=!1,n.triggerChange()}})}},getMs:function(){return this._cursor.getTime()},sync:function(){var t;this.bands.forEach((function(e){t&&e.setRangeFrom(t),t=e}))},cycleFocus:function(t){var e=this.bands.length,n=this.focus;n+=e+t,n%=e,this.bands[n].setFocus()},hilight:function(t){return;},clearHilight:function(){return;},triggerChange:function(){this.element.dispatchEvent(new CustomEvent("datelinechange",{bubbles:!0,detail:new Date(this._cursor)})),Ft("sessionStorage")&&window.sessionStorage.setItem("dateline_"+this.id,this._cursor.getTime())},find:function(t){var e=this.events.find((function(e){return e.id==t}));return e&&this.animateTo(e.start.getTime()),e}},t.CENTURY=9,t.DAY=4,t.DECADE=8,t.HOUR=3,t.MILLENNIUM=10,t.MILLISECOND=0,t.MINUTE=2,t.MONTH=6,t.SECOND=1,t.WEEK=5,t.Widget=Ht,t.YEAR=7,Object.defineProperty(t,"__esModule",{value:!0}),t.version="2.0.5",t}({});function dateline(t,e){return new Dateline.Widget(t,e)}
    // add container
    $('#main #header').after(`
        <div id="bgmEventdlContainer" style="padding:5px 5px 7px 5px;">
          <div id="bgmEventdl">
        </div></div>`);
    // run dateline
    const getNextYear = function(){
        let d = new Date();
        return `${d.getFullYear()+1}-01-01`;
    }
    const getToday = function(){
        let d = new Date();
        return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
    }
    dateline("bgmEventdl", {
        begin: "2008-01-01", // first day of bangumi
        end: getNextYear(),   // next year
        cursor: getToday(),  // today
        size: `${cfg['total_height']}px`,// configurable
        url: "https://",
        redirect : true,
        bands:[
            {size: `${cfg['b0_height']}px`, scale: Dateline.MONTH, interval: cfg['b0_interval']}, // b0_size + b1_size + 1 == size
            {size: `${cfg['b1_height']}px`, layout: "overview", scale: Dateline.DECADE, interval: cfg['b1_interval']}, // fixed
        ],
        events:events
    });
    $('#bgmEventdlContainer').hide();
    if (localStorage.getItem(bgm_event_dateline_key)) $('#bgmEventdlContainer').fadeIn();
    console.log($('#bgmEventdlContainer').html())

}

function addBigEventBtn(){
    $('div#header small').after(`<small class="grey rr"><a id="bigEventBtn" style="cursor: pointer; color: #999;">bangumi大事记</a> | <a href="/group/topic/393723" target="_blank">添加</a> |&nbsp;</small>`);
    $('#bigEventBtn').on('click', function(){
        const mydl = $('#bgmEventdlContainer');
        if (mydl.is(":hidden")) {
            mydl.slideDown();
            localStorage.setItem(bgm_event_dateline_key, "1");
        } else {
            mydl.slideUp();
            localStorage.removeItem(bgm_event_dateline_key);
        }
    });
}

function unifyDomain(url) {
    const curDomain = window.location.hostname;
    return url.replace('https://', '').replace('http://', '').replace("bgm.tv", curDomain).replace("bangumi.tv", curDomain).replace("chii.in", curDomain);
}

function parseRawPP(rpp) {
    let ret = [];
    const checkObj = function(obj) {
        if ('id' in obj && 'start' in obj && 'text' in obj) {
            obj['class'] = 'd-event-text';
            const new_obj = {...obj}
            // console.log(JSON.stringify(new_obj));
            ret.push(new_obj);
        }
    }
    const linkCheck = function (url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }
    const textFilter = function (s) {
        return s;
    }
    rpp.forEach(function(onepp) {
        const lines = onepp.split("<br>\n");
        let i = 0;
        let pp = {};
        while (i < lines.length) {
            const l = lines[i].replace(/\s+/g,' ').trim();
            if (! l.includes(' ')) { // if it is an empty line
                checkObj(pp);
                pp = {};
            } else { // with a space in the line
                let key = l.split(' ')[0];
                let value = l.replace(key + ' ', '');
                // console.log(`key:${key} value:${value} pp:${JSON.stringify(pp)}`)
                if (key == "date") {
                    checkObj(pp);
                    pp = {};
                    try {
                        const year = value.split('-')[0];
                        const month = value.split('-')[1];
                        const day = value.split('-')[2];
                        if (year && month && day)
                            pp['start'] = year + "-" + month + "-" + day;
                    } catch (e) {
                    continue;
                    }
                } else if (key == "event") {
                    pp['text'] = textFilter(value);
                } else if (key == "link") {
                    if (linkCheck(value))
                        pp['id'] = unifyDomain(value);
                    checkObj(pp);
                    pp = {}
                } else { // unrecognized key, reset
                    checkObj(pp);
                    pp = {};
                }
            }
            i++;
        }
    })
    return ret;
}

function parseCfg(r) {
    let raw;
    if (database_url_path.includes("blog"))
        raw = $(r).find('div#entry_content');
    else raw = $(r).find('div.topic_content');
    const codeHL = raw.find('div.codeHighlight pre').text();
    return JSON.parse(codeHL);
}

function fetchFromBGMBlog(url) {
    const DENY_KEYWORDS = "EventProposalRejected";
    $.ajax({
        //async: false,
        //crossDomain: true,
        timeout: 5000,
        dataType: 'html',
        type: "GET",
        url: url,
        success: function(resp) {
            console.log("[bgm_big_events] data from " + url);

            // parse the config file:
            /* const def_cfg = {
                total_height: 150,
                b0_height: 119,
                b1_height: 30,
                b0_interval: 50,
                b1_interval: 300,
            };*/
            const def_cfg = parseCfg(resp);
            console.log(`[bgm_big_event] dateline config: ${JSON.stringify(def_cfg)}`);


            // fetch event proposals =======================================
            let cmtList = $(resp).find('#comment_list');
            // console.log(cmtList.html());
            let rawProposals = []
            cmtList.children("div.row_reply").each( function() {
                let codeContents = "";
                // console.log("reply: " + JSON.stringify($(this).find(".inner .reply_content").text()));
                // fetch all code block content in this reply
                let codeblocks = $(this).find(".inner .reply_content .codeHighlight pre")
                codeblocks.each(function() {
                    codeContents += $(this).html() + "<br>\n"
                    // console.log("code: " + codeContents);
                });

                // reject those denied proposal
                let sub_reply = $(this).find(".inner .reply_content .topic_sub_reply").text();
                if (!sub_reply.includes(DENY_KEYWORDS)) rawProposals.push(codeContents);
            });

            // feed to dataline
            addBigEventBtn(); // add btn
            const pps = parseRawPP(rawProposals);
            console.log(JSON.stringify(pps));
            addDateline(pps, def_cfg);
        },
        error: function(html) {
            console.log("[bgm_big_events] BGM topic fails");
        },
    });
}
fetchFromBGMBlog(`https://${window.location.hostname}${database_url_path}`);
