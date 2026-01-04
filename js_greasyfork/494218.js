// ==UserScript==
// @name         DoodStream Vertical Video Fix
// @description  Some vertical videos are getting stretched to widescreen. This adds a button (next to full-screen) to force them back to portrait
// @match        https://*.dood.tld/*
// @match        https://*.d0*0d.tld/*
// @match        https://*.ds2play.tld/*
// @version      0.2
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494218/DoodStream%20Vertical%20Video%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/494218/DoodStream%20Vertical%20Video%20Fix.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.innerHTML = `
button.ar-fix span.vjs-icon-placeholder:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 40' x='0px' y='0px'%3E%3Cg%3E%3Cpath d='M26,31H6a1,1,0,0,1-.9-1.45A31,31,0,0,0,8,16,31,31,0,0,0,5.1,2.45,1,1,0,0,1,6,1H26a1,1,0,0,1,.9,1.45A31,31,0,0,0,24,16,31,31,0,0,0,26.9,29.55,1,1,0,0,1,26,31ZM7.56,29H24.44A34.23,34.23,0,0,1,22,16,34.23,34.23,0,0,1,24.44,3H7.56A34.23,34.23,0,0,1,10,16,34.23,34.23,0,0,1,7.56,29Z' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E") !important;
}`;
document.querySelector('head').append(style);

const btn = document.createElement('button');
btn.classList.add('ar-fix', 'vjs-control', 'vjs-button');
btn.title = 'Squish to Portrait';
btn.onclick = () => document.querySelector('video').style.scale = '0.27 1.2';
const span = document.createElement('span');
span.classList.add('vjs-icon-placeholder');
btn.append(span, document.createElement('span'));
document.querySelector('button.vjs-fullscreen-control').before(btn);
