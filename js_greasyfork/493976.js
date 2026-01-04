// ==UserScript==
// @name        Acfun-Antifan-反电扇
// @namespace   Acfun屏蔽计划
// @match       *://www.acfun.cn/a/ac*
// @match       *://www.acfun.cn/v/ac*
// @grant       none
// @version     1.02
// @license     MIT
// @author      -
// @description 5/2/2024, 4:10:24 PM
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/fabric.js/6.0.0-rc.1/fabric.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/493976/Acfun-Antifan-%E5%8F%8D%E7%94%B5%E6%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/493976/Acfun-Antifan-%E5%8F%8D%E7%94%B5%E6%89%87.meta.js
// ==/UserScript==

let log = console.log.bind(console)

//css
function createAndAddHoverClass() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    // Insert the base class rule
    style.sheet.insertRule(`
        .plugin_send_btn {
            background-color: ##f8f8f8;
            color: #999;
            font-size: 14px;
            border-radius: 5px;
            border: none;
            line-height: 30px;
            height: 30px;
            display: inline-block;
            text-align: center;
            width: 96px;
            margin-top: 4px !important;
        }
    `, style.sheet.cssRules.length);

    // Insert the hover state rule
    style.sheet.insertRule(`
        .plugin_send_btn:hover {
            background-color: #e5e5e5;
            color: grey;
        }
    `, style.sheet.cssRules.length);

}
createAndAddHoverClass()

// Following is attached gif.optimized.js, in case user cannot connect to git
// Worker
const workerScript = `
!function(t){function e(r){if(i[r])return i[r].exports;var s=i[r]={exports:{},id:r,loaded:!1};return t[r].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){var r,s;r=i(1),s=function(t){var e,i,s,o;return e=new r(t.width,t.height),0===t.index?e.writeHeader():e.firstFrame=!1,e.setTransparent(t.transparent),e.setRepeat(t.repeat),e.setDelay(t.delay),e.setQuality(t.quality),e.setDither(t.dither),e.setGlobalPalette(t.globalPalette),e.addFrame(t.data),t.last&&e.finish(),t.globalPalette===!0&&(t.globalPalette=e.getGlobalPalette()),s=e.stream(),t.data=s.pages,t.cursor=s.cursor,t.pageSize=s.constructor.pageSize,t.canTransfer?(o=function(){var e,r,s,o;for(s=t.data,o=[],e=0,r=s.length;e<r;e++)i=s[e],o.push(i.buffer);return o}(),self.postMessage(t,o)):self.postMessage(t)},self.onmessage=function(t){return s(t.data)}},function(t,e,i){function r(){this.page=-1,this.pages=[],this.newPage()}function s(t,e){this.width=~~t,this.height=~~e,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.neuQuant=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.dither=!1,this.globalPalette=!1,this.out=new r}var o=i(2),n=i(3);r.pageSize=4096,r.charMap={};for(var a=0;a<256;a++)r.charMap[a]=String.fromCharCode(a);r.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(r.pageSize),this.cursor=0},r.prototype.getData=function(){for(var t="",e=0;e<this.pages.length;e++)for(var i=0;i<r.pageSize;i++)t+=r.charMap[this.pages[e][i]];return t},r.prototype.writeByte=function(t){this.cursor>=r.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=t},r.prototype.writeUTFBytes=function(t){for(var e=t.length,i=0;i<e;i++)this.writeByte(t.charCodeAt(i))},r.prototype.writeBytes=function(t,e,i){for(var r=i||t.length,s=e||0;s<r;s++)this.writeByte(t[s])},s.prototype.setDelay=function(t){this.delay=Math.round(t/10)},s.prototype.setFrameRate=function(t){this.delay=Math.round(100/t)},s.prototype.setDispose=function(t){t>=0&&(this.dispose=t)},s.prototype.setRepeat=function(t){this.repeat=t},s.prototype.setTransparent=function(t){this.transparent=t},s.prototype.addFrame=function(t){this.image=t,this.colorTab=this.globalPalette&&this.globalPalette.slice?this.globalPalette:null,this.getImagePixels(),this.analyzePixels(),this.globalPalette===!0&&(this.globalPalette=this.colorTab),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.globalPalette||this.writePalette(),this.writePixels(),this.firstFrame=!1},s.prototype.finish=function(){this.out.writeByte(59)},s.prototype.setQuality=function(t){t<1&&(t=1),this.sample=t},s.prototype.setDither=function(t){t===!0&&(t="FloydSteinberg"),this.dither=t},s.prototype.setGlobalPalette=function(t){this.globalPalette=t},s.prototype.getGlobalPalette=function(){return this.globalPalette&&this.globalPalette.slice&&this.globalPalette.slice(0)||this.globalPalette},s.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")},s.prototype.analyzePixels=function(){this.colorTab||(this.neuQuant=new o(this.pixels,this.sample),this.neuQuant.buildColormap(),this.colorTab=this.neuQuant.getColormap()),this.dither?this.ditherPixels(this.dither.replace("-serpentine",""),null!==this.dither.match(/-serpentine/)):this.indexPixels(),this.pixels=null,this.colorDepth=8,this.palSize=7,null!==this.transparent&&(this.transIndex=this.findClosest(this.transparent,!0))},s.prototype.indexPixels=function(){var t=this.pixels.length/3;this.indexedPixels=new Uint8Array(t);for(var e=0,i=0;i<t;i++){var r=this.findClosestRGB(255&this.pixels[e++],255&this.pixels[e++],255&this.pixels[e++]);this.usedEntry[r]=!0,this.indexedPixels[i]=r}},s.prototype.ditherPixels=function(t,e){var i={FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[.25,1,1]],FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]]};if(!t||!i[t])throw"Unknown dithering kernel: "+t;var r=i[t],s=0,o=this.height,n=this.width,a=this.pixels,h=e?-1:1;this.indexedPixels=new Uint8Array(this.pixels.length/3);for(var l=0;l<o;l++){e&&(h*=-1);for(var u=1==h?0:n-1,p=1==h?n:0;u!==p;u+=h){s=l*n+u;var f=3*s,c=a[f],y=a[f+1],w=a[f+2];f=this.findClosestRGB(c,y,w),this.usedEntry[f]=!0,this.indexedPixels[s]=f,f*=3;for(var d=this.colorTab[f],g=this.colorTab[f+1],x=this.colorTab[f+2],b=c-d,v=y-g,P=w-x,m=1==h?0:r.length-1,B=1==h?r.length:0;m!==B;m+=h){var S=r[m][1],T=r[m][2];if(S+u>=0&&S+u<n&&T+l>=0&&T+l<o){var M=r[m][0];f=s+S+T*n,f*=3,a[f]=Math.max(0,Math.min(255,a[f]+b*M)),a[f+1]=Math.max(0,Math.min(255,a[f+1]+v*M)),a[f+2]=Math.max(0,Math.min(255,a[f+2]+P*M))}}}}},s.prototype.findClosest=function(t,e){return this.findClosestRGB((16711680&t)>>16,(65280&t)>>8,255&t,e)},s.prototype.findClosestRGB=function(t,e,i,r){if(null===this.colorTab)return-1;if(this.neuQuant&&!r)return this.neuQuant.lookupRGB(t,e,i);for(var s=0,o=16777216,n=this.colorTab.length,a=0,h=0;a<n;h++){var l=t-(255&this.colorTab[a++]),u=e-(255&this.colorTab[a++]),p=i-(255&this.colorTab[a++]),f=l*l+u*u+p*p;(!r||this.usedEntry[h])&&f<o&&(o=f,s=h)}return s},s.prototype.getImagePixels=function(){var t=this.width,e=this.height;this.pixels=new Uint8Array(t*e*3);for(var i=this.image,r=0,s=0,o=0;o<e;o++)for(var n=0;n<t;n++)this.pixels[s++]=i[r++],this.pixels[s++]=i[r++],this.pixels[s++]=i[r++],r++},s.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4);var t,e;null===this.transparent?(t=0,e=0):(t=1,e=2),this.dispose>=0&&(e=7&dispose),e<<=2,this.out.writeByte(0|e|0|t),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},s.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.firstFrame||this.globalPalette?this.out.writeByte(0):this.out.writeByte(128|this.palSize)},s.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},s.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes("NETSCAPE2.0"),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},s.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);for(var t=768-this.colorTab.length,e=0;e<t;e++)this.out.writeByte(0)},s.prototype.writeShort=function(t){this.out.writeByte(255&t),this.out.writeByte(t>>8&255)},s.prototype.writePixels=function(){var t=new n(this.width,this.height,this.indexedPixels,this.colorDepth);t.encode(this.out)},s.prototype.stream=function(){return this.out},t.exports=s},function(t,e){function i(t,e){function i(){z=[],E=new Int32Array(256),R=new Int32Array(s),U=new Int32Array(s),Q=new Int32Array(s>>3);var t,e;for(t=0;t<s;t++)e=(t<<n+8)/s,z[t]=new Float64Array([e,e,e,0]),U[t]=h/s,R[t]=0}function c(){for(var t=0;t<s;t++)z[t][0]>>=n,z[t][1]>>=n,z[t][2]>>=n,z[t][3]=t}function w(t,e,i,r,s){z[e][0]-=t*(z[e][0]-i)/b,z[e][1]-=t*(z[e][1]-r)/b,z[e][2]-=t*(z[e][2]-s)/b}function x(t,e,i,r,o){for(var n,a,h=Math.abs(e-t),l=Math.min(e+t,s),u=e+1,p=e-1,f=1;u<l||p>h;)a=Q[f++],u<l&&(n=z[u++],n[0]-=a*(n[0]-i)/B,n[1]-=a*(n[1]-r)/B,n[2]-=a*(n[2]-o)/B),p>h&&(n=z[p--],n[0]-=a*(n[0]-i)/B,n[1]-=a*(n[1]-r)/B,n[2]-=a*(n[2]-o)/B)}function v(t,e,i){t=0|t,e=0|e,i=0|i;var r,o,h,c,y,w=~(1<<31),d=w,g=-1,x=g;for(r=0;r<s;r++)o=z[r],h=Math.abs((0|o[0])-t)+Math.abs((0|o[1])-e)+Math.abs((0|o[2])-i)|0,h<w&&(w=h,g=r),c=h-((0|R[r])>>a-n),c<d&&(d=c,x=r),y=U[r]>>u,U[r]-=y,R[r]+=y<<l;return U[g]+=p,R[g]-=f,x}function m(){var t,e,i,r,n,a,h=0,l=0;for(t=0;t<s;t++){for(i=z[t],n=t,a=i[1],e=t+1;e<s;e++)r=z[e],r[1]<a&&(n=e,a=r[1]);if(r=z[n],t!=n&&(e=r[0],r[0]=i[0],i[0]=e,e=r[1],r[1]=i[1],i[1]=e,e=r[2],r[2]=i[2],i[2]=e,e=r[3],r[3]=i[3],i[3]=e),a!=h){for(E[h]=l+t>>1,e=h+1;e<a;e++)E[e]=t;h=a,l=t}}for(E[h]=l+o>>1,e=h+1;e<256;e++)E[e]=o}function C(t,e,i){t=0|t,e=0|e,i=0|i;for(var r,o,n,a=1e3,h=-1,l=0|E[e],u=l-1;l<s||u>=0;)l<s&&(o=z[l],n=(0|o[1])-e,n>=a?l=s:(l++,n<0&&(n=-n),r=(0|o[0])-t,r<0&&(r=-r),n+=r,n<a&&(r=(0|o[2])-i,r<0&&(r=-r),n+=r,n<a&&(a=n,h=0|o[3])))),u>=0&&(o=z[u],n=e-(0|o[1]),n>=a?u=-1:(u--,n<0&&(n=-n),r=(0|o[0])-t,r<0&&(r=-r),n+=r,n<a&&(r=(0|o[2])-i,r<0&&(r=-r),n+=r,n<a&&(a=n,h=0|o[3]))));return h}function I(){var i,s=t.length,o=30+(e-1)/3,a=s/(3*e),h=~~(a/r),l=b,u=d,p=u>>y;for(p<=1&&(p=0),i=0;i<p;i++)Q[i]=l*((p*p-i*i)*P/(p*p));var f;s<A?(e=1,f=3):f=s%S!==0?3*S:s%T!==0?3*T:s%M!==0?3*M:3*F;var c,m,B,C,I=0;for(i=0;i<a;)if(c=(255&t[I])<<n,m=(255&t[I+1])<<n,B=(255&t[I+2])<<n,C=v(c,m,B),w(l,C,c,m,B),0!==p&&x(p,C,c,m,B),I+=f,I>=s&&(I-=s),i++,0===h&&(h=1),i%h===0)for(l-=l/o,u-=u/g,p=u>>y,p<=1&&(p=0),C=0;C<p;C++)Q[C]=l*((p*p-C*C)*P/(p*p))}function D(){i(),I(),c(),m()}function G(){for(var t=[],e=[],i=0;i<s;i++)e[z[i][3]]=i;for(var r=0,o=0;o<s;o++){var n=e[o];t[r++]=z[n][0],t[r++]=z[n][1],t[r++]=z[n][2]}return t}var z,E,R,U,Q;this.buildColormap=D,this.getColormap=G,this.lookupRGB=C}var r=100,s=256,o=s-1,n=4,a=16,h=1<<a,l=10,u=10,p=h>>u,f=h<<l-u,c=s>>3,y=6,w=1<<y,d=c*w,g=30,x=10,b=1<<x,v=8,P=1<<v,m=x+v,B=1<<m,S=499,T=491,M=487,F=503,A=3*F;t.exports=i},function(t,e){function i(t,e,i,a){function h(t,e){S[x++]=t,x>=254&&c(e)}function l(t){u(o),A=P+2,C=!0,d(P,t)}function u(t){for(var e=0;e<t;++e)T[e]=-1}function p(t,e){var i,n,a,h,p,f,c;for(v=t,C=!1,n_bits=v,b=y(n_bits),P=1<<t-1,m=P+1,A=P+2,x=0,h=w(),c=0,i=o;i<65536;i*=2)++c;c=8-c,f=o,u(f),d(P,e);t:for(;(n=w())!=r;)if(i=(n<<s)+h,a=n<<c^h,T[a]!==i){if(T[a]>=0){p=f-a,0===a&&(p=1);do if((a-=p)<0&&(a+=f),T[a]===i){h=M[a];continue t}while(T[a]>=0)}d(h,e),h=n,A<1<<s?(M[a]=A++,T[a]=i):l(e)}else h=M[a];d(h,e),d(m,e)}function f(i){i.writeByte(B),remaining=t*e,curPixel=0,p(B+1,i),i.writeByte(0)}function c(t){x>0&&(t.writeByte(x),t.writeBytes(S,0,x),x=0)}function y(t){return(1<<t)-1}function w(){if(0===remaining)return r;--remaining;var t=i[curPixel++];return 255&t}function d(t,e){for(g&=n[F],F>0?g|=t<<F:g=t,F+=n_bits;F>=8;)h(255&g,e),g>>=8,F-=8;if((A>b||C)&&(C?(b=y(n_bits=v),C=!1):(++n_bits,b=n_bits==s?1<<s:y(n_bits))),t==m){for(;F>0;)h(255&g,e),g>>=8,F-=8;c(e)}}var g,x,b,v,P,m,B=Math.max(2,a),S=new Uint8Array(256),T=new Int32Array(o),M=new Int32Array(o),F=0,A=0,C=!1;this.encode=f}var r=-1,s=12,o=5003,n=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];t.exports=i}]);
`;

//魔改了一点点
// Step 2: Create a Blob from the string
const blob = new Blob([workerScript], { type: 'application/javascript' });

// Step 3: Generate a URL from the Blob
const workerUrl = URL.createObjectURL(blob);

// gif.js 0.2.0 - https://github.com/jnordberg/gif.js 制作GIF用的,我偷懒复制了过来,因为直接用了runtime workerScript(看上面workerScript)
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.GIF = f() } })(function () { var define, module, exports; return function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s }({ 1: [function (require, module, exports) { function EventEmitter() { this._events = this._events || {}; this._maxListeners = this._maxListeners || undefined } module.exports = EventEmitter; EventEmitter.EventEmitter = EventEmitter; EventEmitter.prototype._events = undefined; EventEmitter.prototype._maxListeners = undefined; EventEmitter.defaultMaxListeners = 10; EventEmitter.prototype.setMaxListeners = function (n) { if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number"); this._maxListeners = n; return this }; EventEmitter.prototype.emit = function (type) { var er, handler, len, args, i, listeners; if (!this._events) this._events = {}; if (type === "error") { if (!this._events.error || isObject(this._events.error) && !this._events.error.length) { er = arguments[1]; if (er instanceof Error) { throw er } else { var err = new Error('Uncaught, unspecified "error" event. (' + er + ")"); err.context = er; throw err } } } handler = this._events[type]; if (isUndefined(handler)) return false; if (isFunction(handler)) { switch (arguments.length) { case 1: handler.call(this); break; case 2: handler.call(this, arguments[1]); break; case 3: handler.call(this, arguments[1], arguments[2]); break; default: args = Array.prototype.slice.call(arguments, 1); handler.apply(this, args) } } else if (isObject(handler)) { args = Array.prototype.slice.call(arguments, 1); listeners = handler.slice(); len = listeners.length; for (i = 0; i < len; i++)listeners[i].apply(this, args) } return true }; EventEmitter.prototype.addListener = function (type, listener) { var m; if (!isFunction(listener)) throw TypeError("listener must be a function"); if (!this._events) this._events = {}; if (this._events.newListener) this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener); if (!this._events[type]) this._events[type] = listener; else if (isObject(this._events[type])) this._events[type].push(listener); else this._events[type] = [this._events[type], listener]; if (isObject(this._events[type]) && !this._events[type].warned) { if (!isUndefined(this._maxListeners)) { m = this._maxListeners } else { m = EventEmitter.defaultMaxListeners } if (m && m > 0 && this._events[type].length > m) { this._events[type].warned = true; console.error("(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.", this._events[type].length); if (typeof console.trace === "function") { console.trace() } } } return this }; EventEmitter.prototype.on = EventEmitter.prototype.addListener; EventEmitter.prototype.once = function (type, listener) { if (!isFunction(listener)) throw TypeError("listener must be a function"); var fired = false; function g() { this.removeListener(type, g); if (!fired) { fired = true; listener.apply(this, arguments) } } g.listener = listener; this.on(type, g); return this }; EventEmitter.prototype.removeListener = function (type, listener) { var list, position, length, i; if (!isFunction(listener)) throw TypeError("listener must be a function"); if (!this._events || !this._events[type]) return this; list = this._events[type]; length = list.length; position = -1; if (list === listener || isFunction(list.listener) && list.listener === listener) { delete this._events[type]; if (this._events.removeListener) this.emit("removeListener", type, listener) } else if (isObject(list)) { for (i = length; i-- > 0;) { if (list[i] === listener || list[i].listener && list[i].listener === listener) { position = i; break } } if (position < 0) return this; if (list.length === 1) { list.length = 0; delete this._events[type] } else { list.splice(position, 1) } if (this._events.removeListener) this.emit("removeListener", type, listener) } return this }; EventEmitter.prototype.removeAllListeners = function (type) { var key, listeners; if (!this._events) return this; if (!this._events.removeListener) { if (arguments.length === 0) this._events = {}; else if (this._events[type]) delete this._events[type]; return this } if (arguments.length === 0) { for (key in this._events) { if (key === "removeListener") continue; this.removeAllListeners(key) } this.removeAllListeners("removeListener"); this._events = {}; return this } listeners = this._events[type]; if (isFunction(listeners)) { this.removeListener(type, listeners) } else if (listeners) { while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]) } delete this._events[type]; return this }; EventEmitter.prototype.listeners = function (type) { var ret; if (!this._events || !this._events[type]) ret = []; else if (isFunction(this._events[type])) ret = [this._events[type]]; else ret = this._events[type].slice(); return ret }; EventEmitter.prototype.listenerCount = function (type) { if (this._events) { var evlistener = this._events[type]; if (isFunction(evlistener)) return 1; else if (evlistener) return evlistener.length } return 0 }; EventEmitter.listenerCount = function (emitter, type) { return emitter.listenerCount(type) }; function isFunction(arg) { return typeof arg === "function" } function isNumber(arg) { return typeof arg === "number" } function isObject(arg) { return typeof arg === "object" && arg !== null } function isUndefined(arg) { return arg === void 0 } }, {}], 2: [function (require, module, exports) { var UA, browser, mode, platform, ua; ua = navigator.userAgent.toLowerCase(); platform = navigator.platform.toLowerCase(); UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, "unknown", 0]; mode = UA[1] === "ie" && document.documentMode; browser = { name: UA[1] === "version" ? UA[3] : UA[1], version: mode || parseFloat(UA[1] === "opera" && UA[4] ? UA[4] : UA[2]), platform: { name: ua.match(/ip(?:ad|od|hone)/) ? "ios" : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ["other"])[0] } }; browser[browser.name] = true; browser[browser.name + parseInt(browser.version, 10)] = true; browser.platform[browser.platform.name] = true; module.exports = browser }, {}], 3: [function (require, module, exports) { var EventEmitter, GIF, browser, extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key] } function ctor() { this.constructor = child } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child }, hasProp = {}.hasOwnProperty, indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i } return -1 }, slice = [].slice; EventEmitter = require("events").EventEmitter; browser = require("./browser.coffee"); GIF = function (superClass) { var defaults, frameDefaults; extend(GIF, superClass); defaults = { workerScript: workerUrl, workers: 2, repeat: 0, background: "#fff", quality: 10, width: null, height: null, transparent: null, debug: false, dither: false }; frameDefaults = { delay: 500, copy: false }; function GIF(options) { var base, key, value; this.running = false; this.options = {}; this.frames = []; this.freeWorkers = []; this.activeWorkers = []; this.setOptions(options); for (key in defaults) { value = defaults[key]; if ((base = this.options)[key] == null) { base[key] = value } } } GIF.prototype.setOption = function (key, value) { this.options[key] = value; if (this._canvas != null && (key === "width" || key === "height")) { return this._canvas[key] = value } }; GIF.prototype.setOptions = function (options) { var key, results, value; results = []; for (key in options) { if (!hasProp.call(options, key)) continue; value = options[key]; results.push(this.setOption(key, value)) } return results }; GIF.prototype.addFrame = function (image, options) { var frame, key; if (options == null) { options = {} } frame = {}; frame.transparent = this.options.transparent; for (key in frameDefaults) { frame[key] = options[key] || frameDefaults[key] } if (this.options.width == null) { this.setOption("width", image.width) } if (this.options.height == null) { this.setOption("height", image.height) } if (typeof ImageData !== "undefined" && ImageData !== null && image instanceof ImageData) { frame.data = image.data } else if (typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null && image instanceof CanvasRenderingContext2D || typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null && image instanceof WebGLRenderingContext) { if (options.copy) { frame.data = this.getContextData(image) } else { frame.context = image } } else if (image.childNodes != null) { if (options.copy) { frame.data = this.getImageData(image) } else { frame.image = image } } else { throw new Error("Invalid image") } return this.frames.push(frame) }; GIF.prototype.render = function () { var i, j, numWorkers, ref; if (this.running) { throw new Error("Already running") } if (this.options.width == null || this.options.height == null) { throw new Error("Width and height must be set prior to rendering") } this.running = true; this.nextFrame = 0; this.finishedFrames = 0; this.imageParts = function () { var j, ref, results; results = []; for (i = j = 0, ref = this.frames.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) { results.push(null) } return results }.call(this); numWorkers = this.spawnWorkers(); if (this.options.globalPalette === true) { this.renderNextFrame() } else { for (i = j = 0, ref = numWorkers; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) { this.renderNextFrame() } } this.emit("start"); return this.emit("progress", 0) }; GIF.prototype.abort = function () { var worker; while (true) { worker = this.activeWorkers.shift(); if (worker == null) { break } this.log("killing active worker"); worker.terminate() } this.running = false; return this.emit("abort") }; GIF.prototype.spawnWorkers = function () { var j, numWorkers, ref, results; numWorkers = Math.min(this.options.workers, this.frames.length); (function () { results = []; for (var j = ref = this.freeWorkers.length; ref <= numWorkers ? j < numWorkers : j > numWorkers; ref <= numWorkers ? j++ : j--) { results.push(j) } return results }).apply(this).forEach(function (_this) { return function (i) { var worker; _this.log("spawning worker " + i); worker = new Worker(_this.options.workerScript); worker.onmessage = function (event) { _this.activeWorkers.splice(_this.activeWorkers.indexOf(worker), 1); _this.freeWorkers.push(worker); return _this.frameFinished(event.data) }; return _this.freeWorkers.push(worker) } }(this)); return numWorkers }; GIF.prototype.frameFinished = function (frame) { var i, j, ref; this.log("frame " + frame.index + " finished - " + this.activeWorkers.length + " active"); this.finishedFrames++; this.emit("progress", this.finishedFrames / this.frames.length); this.imageParts[frame.index] = frame; if (this.options.globalPalette === true) { this.options.globalPalette = frame.globalPalette; this.log("global palette analyzed"); if (this.frames.length > 2) { for (i = j = 1, ref = this.freeWorkers.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) { this.renderNextFrame() } } } if (indexOf.call(this.imageParts, null) >= 0) { return this.renderNextFrame() } else { return this.finishRendering() } }; GIF.prototype.finishRendering = function () { var data, frame, i, image, j, k, l, len, len1, len2, len3, offset, page, ref, ref1, ref2; len = 0; ref = this.imageParts; for (j = 0, len1 = ref.length; j < len1; j++) { frame = ref[j]; len += (frame.data.length - 1) * frame.pageSize + frame.cursor } len += frame.pageSize - frame.cursor; this.log("rendering finished - filesize " + Math.round(len / 1e3) + "kb"); data = new Uint8Array(len); offset = 0; ref1 = this.imageParts; for (k = 0, len2 = ref1.length; k < len2; k++) { frame = ref1[k]; ref2 = frame.data; for (i = l = 0, len3 = ref2.length; l < len3; i = ++l) { page = ref2[i]; data.set(page, offset); if (i === frame.data.length - 1) { offset += frame.cursor } else { offset += frame.pageSize } } } image = new Blob([data], { type: "image/gif" }); return this.emit("finished", image, data) }; GIF.prototype.renderNextFrame = function () { var frame, task, worker; if (this.freeWorkers.length === 0) { throw new Error("No free workers") } if (this.nextFrame >= this.frames.length) { return } frame = this.frames[this.nextFrame++]; worker = this.freeWorkers.shift(); task = this.getTask(frame); this.log("starting frame " + (task.index + 1) + " of " + this.frames.length); this.activeWorkers.push(worker); return worker.postMessage(task) }; GIF.prototype.getContextData = function (ctx) { return ctx.getImageData(0, 0, this.options.width, this.options.height).data }; GIF.prototype.getImageData = function (image) { var ctx; if (this._canvas == null) { this._canvas = document.createElement("canvas"); this._canvas.width = this.options.width; this._canvas.height = this.options.height } ctx = this._canvas.getContext("2d"); ctx.setFill = this.options.background; ctx.fillRect(0, 0, this.options.width, this.options.height); ctx.drawImage(image, 0, 0); return this.getContextData(ctx) }; GIF.prototype.getTask = function (frame) { var index, task; index = this.frames.indexOf(frame); task = { index: index, last: index === this.frames.length - 1, delay: frame.delay, transparent: frame.transparent, width: this.options.width, height: this.options.height, quality: this.options.quality, dither: this.options.dither, globalPalette: this.options.globalPalette, repeat: this.options.repeat, canTransfer: browser.name === "chrome" }; if (frame.data != null) { task.data = frame.data } else if (frame.context != null) { task.data = this.getContextData(frame.context) } else if (frame.image != null) { task.data = this.getImageData(frame.image) } else { throw new Error("Invalid frame") } return task }; GIF.prototype.log = function () { var args; args = 1 <= arguments.length ? slice.call(arguments, 0) : []; if (!this.options.debug) { return } return console.log.apply(console, args) }; return GIF }(EventEmitter); module.exports = GIF }, { "./browser.coffee": 2, events: 1 }] }, {}, [3])(3) });

//functionality


// function get text from editor
// "edui-body-container" is the class of the editor
function getText() {
    let doc = unsafeWindow.document;
    let editor = doc.querySelector(".edui-body-container");
    return editor.innerText;
}


function drawStripesVetical(canvas, stripeWidth, stripeColor, offset) {
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false; // For Firefox
    ctx.webkitImageSmoothingEnabled = false; // For Chrome, Safari (older versions)
    ctx.msImageSmoothingEnabled = false; // For Internet Explorer
    let width = canvas.width;
    let height = canvas.height;
    ctx.fillStyle = stripeColor;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Resets the transformation matrix
    while (offset < width) {
        ctx.fillRect(offset, 0, stripeWidth, height);
        offset += stripeWidth * 2;
    }
}

function drawStripeshorizontal(canvas, stripeWidth, stripeColor, offset) {
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false; // For Firefox
    ctx.webkitImageSmoothingEnabled = false; // For Chrome, Safari (older versions)
    ctx.msImageSmoothingEnabled = false; // For Internet Explorer
    let width = canvas.width;
    let height = canvas.height;
    ctx.fillStyle = stripeColor;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Resets the transformation matrix
    while (offset < height) {
        ctx.fillRect(0, offset, width, stripeWidth);
        offset += stripeWidth * 2;
    }
}

function createCanvas(text) {
    let padding = 2
    // Create a new canvas instance
    let width = 450;
    let canvas = new fabric.Canvas("canvas", {
        backgroundColor: 'white',  // Set the canvas background to white,
        // size: [500, 500]
        width: width,
        height: 300


    });

    // Define the maximum width for the text box
    const maxWidth = width - 2* padding;

    // Create a new textbox with specified properties
    let textBox = new fabric.Textbox(text, {
        width: maxWidth,  // Set width to control wrapping
        fontSize: 32,
        fontFamily: "AcFun Symbol,Helvetica Neue,Helvetica,Arial,pingfang SC,Microsoft Yahei,STHeiti,sans-serif",
        fill: "black",
        textAlign: "left",
        splitByGrapheme: true,  // Enables better line breaking, especially for complex scripts

        // position
        left: padding,
        top: padding

    });

    // Add the textbox to the canvas
    canvas.add(textBox);

    // Render the canvas to ensure everything is displayed correctly
    canvas.renderAll();
    let textHeight = textBox.getScaledHeight() + 2 * padding;  // Include some padding

    // measure the text width
    const tmp_canvas = document.createElement("canvas");
    const tmp_ctx = tmp_canvas.getContext("2d");
    tmp_ctx.font = "32px AcFun Symbol,Helvetica Neue,Helvetica,Arial,pingfang SC,Microsoft Yahei,STHeiti,sans-serif";
    const textWidth = tmp_ctx.measureText(text).width;

    // Calculate and log the actual width of the text
    log("textHeight", textHeight);
    canvas.setHeight(textHeight);
    canvas.setWidth(Math.min(textWidth + 2*padding, width));  // Limit the width to the maximum width
    canvas.renderAll();
    // Dynamically adjust the canvas size based on text content

    // Convert canvas to a data URL and open it in a new window
    let dataUrl = canvas.toDataURL("image/png");
    log("data canvas width", canvas.width, "canvas height", canvas.height)
    log("data", canvas, dataUrl);
    log("data------------------")


    return {
        canvas: canvas,
        dataUrl: dataUrl,
        width: canvas.width,
        height: canvas.height
    };
}




// function to create a gif from canvas -> blob
function createGif(text, callback) {
    let { canvas, dataUrl } = createCanvas(text);
    // create 2 canvas and draw dataUrl on them
    let canvas1 = document.createElement("canvas");
    // set size
    canvas1.width = canvas.width;
    canvas1.height = canvas.height;

    let ctx1 = canvas1.getContext("2d");

    let img = new Image();
    img.src = dataUrl;
    img.onload = function () {


        // create gif
        let gif = new GIF({
            workers: 2,
            quality: 1,
            workerScript: workerUrl,
            width: canvas.width,
            height: canvas.height,
            background: "#fff",
        });


        let stripeWidth = 3;

        let stripeColor = "white";
        // let stripeColor2 = "rgba(255,255,255,0.1)";
        //draw stripes on each frame for n frames
        let n = 3
        let repeat = 2
        let stirpeFuncs = [drawStripesVetical, drawStripeshorizontal]
        for (let r = 0; r < repeat; r++) {
            for (let i = 0; i < n; i++) {
                let canvas_tmp = document.createElement("canvas");
                canvas_tmp.width = canvas.width;
                canvas_tmp.height = canvas.height;
                let ctx = canvas_tmp.getContext("2d");
                ctx.imageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false; // For Firefox
                ctx.webkitImageSmoothingEnabled = false; // For Chrome, Safari (older versions)
                ctx.msImageSmoothingEnabled = false; // For Internet Explorer
                ctx.drawImage(img, 0, 0);
                stirpeFuncs[r](canvas_tmp, stripeWidth, stripeColor, i * stripeWidth);
                // drawStripes(canvas_tmp, stripeWidth, stripeColor2, (i + 1) * stripeWidth);
                gif.addFrame(canvas_tmp, { copy: true, delay: 0.02 });
            }
        }



        gif.on("finished", function (blob) {
            callback({
                blob: blob,
                width: canvas.width,
                height: canvas.height,

            });
        });
        gif.render();
    };



}

async function uploadImage(acId, imageBinary) {
    console.log(imageBinary)
    console.log(`Upload image with ${acId} and ${imageBinary.byteLength} bytes.`);

    // Add additional necessary headers...

    // First, get the upload token
    const payload = new URLSearchParams({ "fileName": randomFilename() });
    let response = await fetch("https://www.acfun.cn/rest/pc-direct/image/upload/getToken", {
        method: "POST",

        body: payload
    });
    if (!response.ok) {
        console.log(`Get upload token failed with ${response.status}`);
        return null;
    }
    const data = await response.json();
    const endpointList = data.info.httpEndpointList;
    const token = data.info.token;

    console.log("data, got token=",token)
    console.log("data, endpoints ", endpointList)

    const firstEndpoint = endpointList[0];

    // Upload image in fragments (1MB each)
    let fragmentId = 0;
    for (let i = 0; i < imageBinary.byteLength; i += 1024 * 1024) {
        const fragment = imageBinary.slice(i, i + 1024 * 1024);
        const url = `https://${firstEndpoint}/api/upload/fragment?upload_token=${token}&fragment_id=${fragmentId}`;
        response = await fetch(url, {
            method: "POST",
            body: fragment
        });
        if (!response.ok) {
            log(`data: Upload image fragment failed with ${response.status}`);
            return null;
        }
        fragmentId++;
    }

    // Send complete signal
    const completeUrl = `https://${firstEndpoint}/api/upload/complete?fragment_count=${fragmentId}&upload_token=${token}`;
    response = await fetch(completeUrl, {
        method: "POST",
        payload: ""
    });
    if (!response.ok) {
        log(`Upload image complete failed with ${response.status}`);
        return null;
    }

    // Get URL after upload
    const getUrl = "https://www.acfun.cn/rest/pc-direct/image/upload/getUrlAfterUpload";
    response = await fetch(getUrl, {
        method: "POST",
        body: new URLSearchParams({ "token": token, "bizFlag": "web-comment-text" })
    });
    if (!response.ok) {
        log(`Get image URL after upload failed with ${response.status}`);
        return null;
    }
    const finalData = await response.json();
    if (finalData.result !== 0) {
        log(`Get image URL after upload failed with result ${finalData.result}`);
        return null;
    }
    const cacheImageUrl = finalData.url;

    return cacheImageUrl;
}

function randomFilename() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result + '.png';
}

function getCurrentAcId(){
    function getLastDigits(url) {
        const result = url.match(/\d+$/);  // \d+ matches one or more digits, $ asserts position at the end of the line
        return result ? result[0] : null;  // Check if result is found, return the match
    }
    
    let href =  window.location.href
    // get last part
    return getLastDigits(href);


}

// send reply
function sendREply(text) {

    let wrapper = document.querySelector(".edui-container");
    wrapper.style.pointerEvents = "none";
    // add filter
    let filter = document.createElement("div");
    filter.style.position = "fixed";
    filter.style.top = "0";
    filter.style.left = "0";
    filter.style.width = "100%";
    filter.style.height = "100%";
    filter.style.backgroundColor = "rgba(0,0,0,0.5)";
    filter.style.zIndex = "1000";
    filter.style.color = "white";
    document.body.appendChild(filter);
    // add loading div
    let loading = document.createElement("div");
    loading.style.position = "fixed";
    loading.style.top = "50%";
    loading.style.left = "50%";
    loading.style.transform = "translate(-50%, -50%)";
    loading.style.zIndex = "1001";
    loading.innerHTML = "正在生成...";
    filter.appendChild(loading);

    createGif(text, async (data) =>  {
        //todo
        log(data);
      

        let binaryData = await data.blob.arrayBuffer();
        let acid =getCurrentAcId()
        let cacheUrl = await uploadImage(acid, binaryData);
        console.log(cacheUrl);
        if (!cacheUrl){
            return
        }

        let container = unsafeWindow.document.querySelector(".edui-body-container");
        let img = document.createElement("img");
        img.src = cacheUrl
        img.style.width = data.width + "px";
        img.style.height = data.height + "px";
        container.innerHTML=""
        container.appendChild(img)

        // remove filter
        filter.remove();
        wrapper.style.pointerEvents = "auto";
    });
    // append gif to the editor as img tag


}



//UI
function AddUI() {
    let doc = unsafeWindow.document;

    let toolbar = doc.querySelector(".edui-btn-toolbar");
    let old_send_btn = toolbar.querySelector(".button-wrapper")
    let btn_wrapper = doc.createElement("div")
    btn_wrapper.className = "button-wrapper"
    // inline block
    btn_wrapper.style.display = "inline-block"
    //absolute
    btn_wrapper.style.position = "absolute"
    //right 104px
    btn_wrapper.style.right = "104px"
    //class = button-wrapper
    btn_wrapper.className = "button-wrapper"

    toolbar.insertBefore(btn_wrapper, old_send_btn)

    let send_btn = doc.createElement("button")
    send_btn.className = "plugin_send_btn"
    send_btn.innerHTML = "作恶！"

    send_btn.onclick = function () {
        let text = getText();
        sendREply(text)
    }
    //append before old_send_btn
    btn_wrapper.appendChild(send_btn)
}

// add observer that observes the page for new div with class .edui-btn-toolbar
// when the div is added, add a new button to it
let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains("area-editor")) {
                console.log(node);
                setTimeout(() => {
                    AddUI();
                }, 0);
            }
        });
    });
});

// start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

