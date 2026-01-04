// ==UserScript==
// @name         巴哈Q按讚
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  巴哈網站用Q按取消讚
// @author       You
// @match        https://forum.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
let qKeyPressed = false;

document.addEventListener('keydown', function (e) {
    if ((e.key === 'q' || e.key === 'Q') && !qKeyPressed) {
        qKeyPressed = true;

        
        const gpBtn = document.querySelector('button[id^="gp_"]');
        if (gpBtn) {
            gpBtn.click();

            const isActive = gpBtn.classList.contains('is-active');
            const msg = document.createElement('div');
            msg.textContent = isActive ? '已取消 GP' : '已按下 GP';

            
            Object.assign(msg.style, {
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                top: isActive ? '70%' : '30%',
                padding: '10px 20px',
                background: 'rgba(0,0,0,0.8)',
                color: '#fff',
                borderRadius: '8px',
                zIndex: 9999,
                fontSize: '16px',
                opacity: '0',
                transition: 'opacity 0.3s'
            });
            document.body.appendChild(msg);

            setTimeout(() => { msg.style.opacity = '1'; }, 10);
            setTimeout(() => {
                msg.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(msg);
                }, 300);
            }, 2500);
        }


        document.body.appendChild(msg);

        
        setTimeout(() => { msg.style.opacity = '1'; }, 10);

        
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(msg);
            }, 300);
        }, 2500);
    }
});

document.addEventListener('keyup', function (e) {
    if (e.key === 'q' || e.key === 'Q') {
        qKeyPressed = false;
    }
});
})();


