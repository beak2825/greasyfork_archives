// ==UserScript==
// @name         Azn Can
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.es/s?
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393349/Azn%20Can.user.js
// @updateURL https://update.greasyfork.org/scripts/393349/Azn%20Can.meta.js
// ==/UserScript==
(async () => {
  "use strict";

  const tpl = document.createElement("template");
  tpl.innerHTML = `
    <style>
      .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        max-width: 100%;
        height: 4.1em;
        font-size: 0.75em;
      }
    
      .spinner > div {
        background-color: #333;
        height: 100%;
        width: .6em;
        display: inline-block;
    
        -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
        animation: sk-stretchdelay 1.2s infinite ease-in-out;
      }
    
      .spinner .rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
      }
    
      .spinner .rect3 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
      }
    
      .spinner .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
      }
    
      .spinner .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
      }
    
      @-webkit-keyframes sk-stretchdelay {
        0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
        20% { -webkit-transform: scaleY(1.0) }
      }
    
      @keyframes sk-stretchdelay {
        0%, 40%, 100% {
          transform: scaleY(0.4);
          -webkit-transform: scaleY(0.4);
        }  20% {
          transform: scaleY(1.0);
          -webkit-transform: scaleY(1.0);
        }
      }
    </style>
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
    <slot></slot>`;

  customElements.define(
    "x-loading-indicator",
    class extends HTMLElement {
      constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(tpl.content.cloneNode(true));
      }
    }
  );

  const notToCanaryStrs = [
    "Este producto no puede ser enviado a",
    "El vendedor que has elegido para este producto no realiza envíos a",
    "En estos momentos, no hay vendedores que realicen envíos a"
  ];

  const containers = Object.values(
    document.querySelectorAll(
      '.s-result-list.s-search-results  [data-component-type="s-product-image"]'
    )
  );

  containers.forEach(async container => {
    const image = container.querySelector("img");
    const href = container.querySelector("a").href;

    image.style.filter = "grayscale(1) opacity(0.5)";
    document.createElement("x-loading-indicator");
    image.parentElement.appendChild(
      document.createElement("x-loading-indicator")
    );

    try {
      const res = await fetch(href);
      const content = await res.text();

      const notToCanary = notToCanaryStrs.some(str => content.includes(str));

      if (notToCanary) {
        // @TODO add an indicator
        container.querySelector("img").style.filter = "grayscale(1) blur(5px)";
      } else {
        // @TODO add a seal of approval
        container.querySelector("img").style.filter = "unset";
      }
    } catch (ex) {
      // @TODO add an error indicator
    }

    const loadingIndicator = container.querySelector("x-loading-indicator");
    if (loadingIndicator) loadingIndicator.remove();
  });
})();
