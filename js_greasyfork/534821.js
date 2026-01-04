// ==UserScript==
// @name         Page Minimap
// @namespace    https://github.com/lrsjng/pagemap
// @version      1.0
// @description  Adds a mini-map navigation canvas to web pages with toggle functionality via menu and keyboard shortcut, based on PageMap by Lars Jung
// @author       Faisal Bhuiyan
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534821/Page%20Minimap.user.js
// @updateURL https://update.greasyfork.org/scripts/534821/Page%20Minimap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PageMap library (original code, unchanged)
    ((t,e)=>{"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("pagemap",[],e):"object"==typeof exports?exports.pagemap=e():t.pagemap=e()})("undefined"!=typeof self?self:this,()=>{return r=[(t,e,B)=>{t.exports=function(r,t){function e(t){return"rgba(0,0,0,".concat(t/100,")")}function n(t){k=!0;var e=L(r),n=b(u,c);f=((t.pageX-e.x)/l-n.x)/n.w,s=((t.pageY-e.y)/l-n.y)/n.h,(f<0||1<f||s<0||1<s)&&(s=f=.5),r.style.cursor="crosshair",d.style.cursor="crosshair",w(a,"mousemove",A),w(a,"mouseup",C),A(t)}var o,i,c,u,l,f,s,a=B.g.window,h=a.document,p=h.documentElement,d=h.querySelector("body"),y=r.getContext("2d"),g=Object.assign({viewport:null,styles:{"header,footer,section,article":e(8),"h1,a":e(10),"h2,h3,h4":e(8)},back:e(2),view:e(5),drag:e(10),interval:null},t),v=function(e,n,t,r){return t.split(/\s+/).forEach(function(t){return e[n](t,r)})},w=function(t,e,n){return v(t,"addEventListener",e,n)},x=function(t,e,n){return v(t,"removeEventListener",e,n)},m=function(t,e,n,r){return{x:t,y:e,w:n,h:r}},b=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{x:0,y:0};return m(t.x-e.x,t.y-e.y,t.w,t.h)},T=function(){return m(0,0,p.scrollWidth,p.scrollHeight)},j=function(){return m(a.pageXOffset,a.pageYOffset,p.clientWidth,p.clientHeight)},E=function(t){t=t.getBoundingClientRect();return{x:t.left+a.pageXOffset,y:t.top+a.pageYOffset}},H=function(t){var e=E(t),n=e.x;return m(n,e.y,t.offsetWidth,t.offsetHeight)},L=function(t){var e=E(t),n=e.x;return m(n+t.clientLeft,e.y+t.clientTop,t.clientWidth,t.clientHeight)},O=function(t){var e=E(t),n=e.x;return m(n+t.clientLeft-t.scrollLeft,e.y+t.clientTop-t.scrollTop,t.scrollWidth,t.scrollHeight)},W=(o=r.clientWidth,i=r.clientHeight,function(t,e){return Math.min(o/t,i/e)}),X=function(t,e){r.width=t,r.height=e,r.style.width="".concat(t,"px"),r.style.height="".concat(e,"px")},Y=g.viewport,R=function(t){return Array.from((Y||h).querySelectorAll(t))},k=!1,S=function(t,e){e&&(y.beginPath(),y.rect(t.x,t.y,t.w,t.h),y.fillStyle=e,y.fill())},z=function(n){Object.keys(n).forEach(function(t){var e=n[t];R(t).forEach(function(t){S(b(H(t),c),e)})})},q=function(){c=Y?O(Y):T(),u=Y?L(Y):j(),l=W(c.w,c.h),X(c.w*l,c.h*l),y.setTransform(1,0,0,1,0,0),y.clearRect(0,0,r.width,r.height),y.scale(l,l),S(b(c,c),g.back),z(g.styles),S(b(u,c),k?g.drag:g.view)},A=function(t){t.preventDefault();var e=L(r),n=(t.pageX-e.x)/l-u.w*f,t=(t.pageY-e.y)/l-u.h*s;Y?(Y.scrollLeft=n,Y.scrollTop=t):a.scrollTo(n,t),q()},C=function(t){k=!1,r.style.cursor="pointer",d.style.cursor="auto",x(a,"mousemove",A),x(a,"mouseup",C),A(t)};return r.style.cursor="pointer",w(r,"mousedown",n),w(Y||a,"load resize scroll",q),0<g.interval&&setInterval(function(){return q()},g.interval),q(),{redraw:q}}}],o={},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n(0);function n(t){var e=o[t];return void 0!==e||(e=o[t]={exports:{}},r[t](e,e.exports,n)),e.exports}var r,o});

    // Create and style the canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '16px';
    canvas.style.right = '16px';
    canvas.style.width = '120px';
    canvas.style.height = '90%';
    canvas.style.zIndex = '2147483647';
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    document.body.appendChild(canvas);

    // Initialize PageMap
    const map = pagemap(canvas, {
        viewport: null,
        styles: {
            'header, footer, section, article': 'rgba(0, 0, 0, 0.08)',
            'h1, a': 'rgba(0, 0, 0, 0.10)',
            'h2, h3, h4': 'rgba(0, 0, 0, 0.08)',
            'img, pre': 'rgba(0, 0, 0, 0.05)'
        },
        back: null,
        view: 'rgba(0, 0, 0, 0.08)',
        drag: 'rgba(0, 0, 0, 0.10)',
        interval: null
    });

    // Toggle functionality
    let isMinimapVisible = true;

    function toggleMinimap() {
        isMinimapVisible = !isMinimapVisible;
        canvas.style.display = isMinimapVisible ? 'block' : 'none';
        if (isMinimapVisible) {
            map.redraw(); // Redraw the map when shown to ensure it updates
        }
        updateMenuText();
    }

    function updateMenuText() {
        // Re-register menu command to update text
        GM_registerMenuCommand(
            `${isMinimapVisible ? 'Hide' : 'Show'} Minimap (Ctrl+Shift+M)`,
            toggleMinimap,
            'm'
        );
    }

    // Register initial menu command
    GM_registerMenuCommand('Hide Minimap (Ctrl+Shift+M)', toggleMinimap, 'm');

    // Keyboard shortcut (Ctrl+Shift+M)
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'm') {
            event.preventDefault();
            toggleMinimap();
        }
    });
})();