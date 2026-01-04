// ==UserScript==
// @name         Hoşgeldin Yarram Mesajı - Her Sitede Çalışır
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Her sitede "Hoşgeldin Yarram" mesajı gösterir ve 3 saniye sonra kaybolur.
// @author       Avare
// @match        *://*/*  // Bu satır her sitede çalışmasını sağlar 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524898/Ho%C5%9Fgeldin%20Yarram%20Mesaj%C4%B1%20-%20Her%20Sitede%20%C3%87al%C4%B1%C5%9F%C4%B1r.user.js
// @updateURL https://update.greasyfork.org/scripts/524898/Ho%C5%9Fgeldin%20Yarram%20Mesaj%C4%B1%20-%20Her%20Sitede%20%C3%87al%C4%B1%C5%9F%C4%B1r.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hoşgeldin Yarram mesajını oluşturacak div elementini oluşturma
    const welcomeMessage = document.createElement('div');
    welcomeMessage.innerText = 'Hoşgeldin Yarram!';
    welcomeMessage.style.position = 'fixed';
    welcomeMessage.style.top = '20px';
    welcomeMessage.style.left = '50%';
    welcomeMessage.style.transform = 'translateX(-50%)';
    welcomeMessage.style.padding = '20px';
    welcomeMessage.style.backgroundColor = '#4CAF50';
    welcomeMessage.style.color = 'white';
    welcomeMessage.style.fontSize = '20px';
    welcomeMessage.style.borderRadius = '5px';
    welcomeMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    welcomeMessage.style.zIndex = '9999'; // Üstte görünmesi için yüksek bir z-index
    welcomeMessage.style.textAlign = 'center';

    // Mesajı sayfaya ekleyin
    document.body.appendChild(welcomeMessage);

    // 3 saniye sonra mesajı kaybolacak şekilde ayarla
    setTimeout(() => {
        welcomeMessage.style.display = 'none';
    }, 3000);
})();