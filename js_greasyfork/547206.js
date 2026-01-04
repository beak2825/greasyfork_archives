// ==UserScript==
// @name         Coretegra Info Widget
// @name:en      Coretegra Info Widget
// @description  Shows Coretegra Technologies details and quick links in a floating panel on any site.
// @description:en Shows Coretegra Technologies details and quick links in a floating panel on any site.
// @namespace    https://coretegra.com/userscripts/coretegra-info-widget
// @version      1.0.0
// @license      MIT
// @author       Coretegra Technologies
// @homepage     https://coretegra.com/
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547206/Coretegra%20Info%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/547206/Coretegra%20Info%20Widget.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.getElementById('coretegra-info-widget-host')) return;

  const host = document.createElement('div');
  host.id = 'coretegra-info-widget-host';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .ctg-container {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 320px;
      max-width: calc(100vw - 32px);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      z-index: 2147483647;
      box-shadow: 0 8px 24px rgba(0,0,0,.15);
      border-radius: 14px;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,.08);
    }
    .ctg-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: #0a4cff;
      color: #fff;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: .2px;
    }
    .ctg-btn {
      background: rgba(255,255,255,.15);
      border: 0;
      padding: 6px 10px;
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .ctg-btn:hover { background: rgba(255,255,255,.25); }
    .ctg-body {
      padding: 14px;
      line-height: 1.5;
      color: #2a2a2a;
      font-size: 14px;
    }
    .ctg-title {
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 6px 0;
      color: #0a4cff;
    }
    .ctg-row { margin: 6px 0; }
    .ctg-row a { color: #0a4cff; text-decoration: none; }
    .ctg-row a:hover { text-decoration: underline; }
    .ctg-list {
      margin: 8px 0 0 0;
      padding: 0 0 0 16px;
    }
    .ctg-list li { margin: 4px 0; }
    .ctg-footer {
      padding: 10px 14px;
      background: #f7f9fc;
      font-size: 12px;
      color: #4a4a4a;
      border-top: 1px solid rgba(0,0,0,.06);
    }
    .ctg-hide { display: none !important; }
    .ctg-drag {
      position: absolute;
      inset: 0 0 auto auto;
      width: 100%;
      height: 28px;
      cursor: move;
      -webkit-app-region: drag;
      app-region: drag;
      opacity: 0;
    }
  `;

  const container = document.createElement('div');
  container.className = 'ctg-container';
  container.innerHTML = `
    <div class="ctg-drag" title="Drag"></div>
    <div class="ctg-header">
      <span>Coretegra Technologies</span>
      <div>
        <button class="ctg-btn" id="ctg-toggle" aria-expanded="true" aria-controls="ctg-panel">Hide</button>
      </div>
    </div>
    <div class="ctg-body" id="ctg-panel">
      <p class="ctg-title">IT solutions provider, custom software development</p>
      <p>
        Coretegra Technologies is an IT solutions provider and custom software development agency specializing in healthcare, project management, and finance. Our products include PTMS, PLUG task management, and HR systems designed to streamline business operations.
      </p>

      <div class="ctg-row"><strong>Website:</strong> <a href="https://coretegra.com/" target="_blank" rel="noopener noreferrer">https://coretegra.com/</a></div>
      <div class="ctg-row"><strong>Email:</strong> <a href="mailto:info@coretegra.com">info@coretegra.com</a></div>
      <div class="ctg-row"><strong>Phone:</strong> <a href="tel:+919069995699">+91 9069995699</a></div>
      <div class="ctg-row"><strong>Address:</strong> SCO-17, Silver City Extension, Zirakpur, Gazipur, Punjab 140603</div>

      <div class="ctg-row" style="margin-top:10px;"><strong>Quick links</strong></div>
      <ul class="ctg-list">
        <li><a href="https://coretegra.com/software-development/" target="_blank" rel="noopener noreferrer">software product development services</a></li>
        <li><a href="https://coretegra.com/information-technologies-it-solutions/" target="_blank" rel="noopener noreferrer">core it solutions</a></li>
        <li><a href="https://coretegra.com/information-technologies-it-solutions/" target="_blank" rel="noopener noreferrer">IT Solutions Provider</a></li>
        <li><a href="https://coretegra.com/information-technologies-it-solutions/" target="_blank" rel="noopener noreferrer">Responsive Website Development Services</a></li>
      </ul>
    </div>
    <div class="ctg-footer">
      © 2025 Coretegra Technologies
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(container);

  // Toggle show or hide
  const toggle = container.querySelector('#ctg-toggle');
  const panel = container.querySelector('#ctg-panel');
  toggle.addEventListener('click', () => {
    const isHidden = panel.classList.toggle('ctg-hide');
    toggle.textContent = isHidden ? 'Show' : 'Hide';
    toggle.setAttribute('aria-expanded', String(!isHidden));
  });

  // Basic drag support
  let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;
  const dragBar = container.querySelector('.ctg-drag');
  const onMouseDown = (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = container.getBoundingClientRect();
    originX = rect.right;
    originY = rect.bottom;
    e.preventDefault();
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    container.style.right = Math.max(8, originX - dx - window.innerWidth) * -1 + 16 + 'px';
    container.style.bottom = Math.max(8, originY - dy - window.innerHeight) * -1 + 16 + 'px';
  };
  const onMouseUp = () => { dragging = false; };

  dragBar.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
})();
