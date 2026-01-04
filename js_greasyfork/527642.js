// ==UserScript==
// @license MIT 
// @name        1080p Viewport Fix
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description Forces 1080p width rendering with proper scaling
// @downloadURL https://update.greasyfork.org/scripts/527642/1080p%20Viewport%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/527642/1080p%20Viewport%20Fix.meta.js
// ==/UserScript==

(function(){
    setTimeout(function(){
        // Встановлюємо фіксовану ширину для контенту
        document.documentElement.style.width = '1080px';
        document.body.style.width = '1080px';
        document.documentElement.style.margin = '0 auto';
        document.body.style.margin = '0 auto';
        
        // Налаштовуємо viewport для автоматичного масштабування
        let m = document.querySelector("meta[name=viewport]");
        if(!m){
            m = document.createElement("meta");
            m.name = "viewport";
            document.head.appendChild(m);
        }
        
        // Встановлюємо viewport з шириною 1080px та автоматичним масштабуванням
        m.content = "width=1080, shrink-to-fit=yes, user-scalable=yes";
        
        // Додаємо стилі для забезпечення коректного відображення
        let style = document.createElement('style');
        style.textContent = `
            @viewport {
                width: 1080px;
                zoom: auto;
            }
            html, body {
                min-width: 1080px;
                overflow-x: hidden;
            }
        `;
        document.head.appendChild(style);
    }, 1000);
})();