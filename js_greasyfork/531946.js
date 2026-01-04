// ==UserScript==
// @name         Rainbow Cursor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn your cursor into a rainbow trail
// @author       Jyomama28
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531946/Rainbow%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/531946/Rainbow%20Cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const cursor = document.createElement('div');
    cursor.id = 'rainbow-cursor';
    

    const trailCount = 20;
    const trail = [];
    
    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'rainbow-trail-dot';
        document.body.appendChild(dot);
        trail.push({
            element: dot,
            x: 0,
            y: 0
        });
    }
    

    const style = document.createElement('style');
    style.innerHTML = `
        html, body {
            cursor: none !important;
        }
        
        #rainbow-cursor {
            position: fixed;
            pointer-events: none;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            z-index: 9999;
            transform: translate(-50%, -50%);
        }
        
        .rainbow-trail-dot {
            position: fixed;
            pointer-events: none;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            z-index: 9998;
            transform: translate(-50%, -50%);
            opacity: 0.8;
            transition: width 0.1s, height 0.1s;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(cursor);
    

    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    

    function updateTrail() {

        for (let i = trail.length - 1; i > 0; i--) {
            trail[i].x = trail[i-1].x;
            trail[i].y = trail[i-1].y;
        }
        

        trail[0].x = mouseX;
        trail[0].y = mouseY;
        

        trail.forEach((dot, index) => {

            const hue = (Date.now() / 20 + index * 10) % 360;
            

            dot.element.style.left = dot.x + 'px';
            dot.element.style.top = dot.y + 'px';
            dot.element.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            

            const size = 8 - (index * 0.3);
            if (size > 0) {
                dot.element.style.width = size + 'px';
                dot.element.style.height = size + 'px';
                dot.element.style.opacity = 1 - (index / trail.length);
            }
        });
        
        requestAnimationFrame(updateTrail);
    }
    
    updateTrail();
    

    window.addEventListener('blur', () => {
        cursor.style.display = 'none';
        trail.forEach(dot => {
            dot.element.style.display = 'none';
        });
    });
    
    window.addEventListener('focus', () => {
        cursor.style.display = 'block';
        trail.forEach(dot => {
            dot.element.style.display = 'block';
        });
    });
})();