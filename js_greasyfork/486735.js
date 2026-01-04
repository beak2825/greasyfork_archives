// ==UserScript==
// @name         FPS and Ping Counter (optimized for menu click)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Better FPS unlocker and counter with improved UI
// @author       kyu
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486735/FPS%20and%20Ping%20Counter%20%28optimized%20for%20menu%20click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486735/FPS%20and%20Ping%20Counter%20%28optimized%20for%20menu%20click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bsLink = document.createElement('link');
    bsLink.rel = 'stylesheet';
    bsLink.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    document.head.appendChild(bsLink);

    var faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(faLink);

    if (typeof jQuery === 'undefined') {
        var jqScript = document.createElement('script');
        jqScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        jqScript.onload = function() {
            loadjQueryUI();
        };
        document.head.appendChild(jqScript);
    } else {
        loadjQueryUI();
    }

    function loadjQueryUI() {
        if (typeof jQuery.ui === 'undefined') {
            var uiScript = document.createElement('script');
            uiScript.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js';
            uiScript.onload = startScript;
            document.head.appendChild(uiScript);
        } else {
            startScript();
        }
    }

    function startScript() {
        var style = document.createElement('style');
        style.textContent = `
            .fps-ping-container {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                font-size: 12px;
                border-radius: 5px;
                z-index: 9999;
            }
            .fps-ping-container .fps-ping {
                margin-bottom: 5px;
                padding: 5px;
                border-radius: 5px;
                background-color: rgba(255, 255, 255, 0.2);
            }
            .menu-button {
                position: fixed;
                top: 10px;
                left: 10px;
                background-color: rgba(255, 255, 255, 0.8);
                color: black;
                padding: 5px 10px;
                font-size: 12px;
                border-radius: 5px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                z-index: 9999;
                cursor: pointer;
            }
            .menu {
                position: fixed;
                top: 50px; /* Default position */
                left: 50px; /* Default position */
                width: 300px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                font-size: 16px;
                z-index: 9998;
                display: none;
                overflow: auto;
                padding: 20px;
            }
            .menu label {
                margin-left: 10px;
                font-size: 14px;
                color: white;
                display: block;
                margin-bottom: 10px;
            }
            .menu input[type="checkbox"] {
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);

        var fpsPingContainer = document.createElement('div');
        fpsPingContainer.className = 'fps-ping-container';

        var fpsIcon = document.createElement('i');
        fpsIcon.className = 'fas fa-clock';
        fpsPingContainer.appendChild(fpsIcon);

        var fpsCounter = document.createElement('span');
        fpsCounter.className = 'fps-ping';
        fpsCounter.textContent = ' FPS: 0';
        fpsPingContainer.appendChild(fpsCounter);

        var pingIcon = document.createElement('i');
        pingIcon.className = 'fas fa-signal';
        fpsPingContainer.appendChild(pingIcon);

        var pingCounter = document.createElement('span');
        pingCounter.className = 'fps-ping';
        pingCounter.textContent = ' Ping: 0ms';
        fpsPingContainer.appendChild(pingCounter);

        document.body.appendChild(fpsPingContainer);

        var menuButton = document.createElement('button');
        menuButton.className = 'menu-button';
        menuButton.textContent = 'Menu';
        document.body.appendChild(menuButton);

        var menu = document.createElement('div');
        menu.className = 'menu';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        var label = document.createElement('label');
        label.textContent = 'Enable counters';
        label.appendChild(checkbox);
        menu.appendChild(label);

        var optimizationCheckbox = document.createElement('input');
        optimizationCheckbox.type = 'checkbox';
        optimizationCheckbox.checked = false;

        var optimizationLabel = document.createElement('label');
        optimizationLabel.textContent = 'Optimize';
        optimizationLabel.appendChild(optimizationCheckbox);
        menu.appendChild(optimizationLabel);

        document.body.appendChild(menu);

        menuButton.addEventListener('click', function() {
            if ($(menu).is(':hidden')) {
                $('body').css('overflow', 'hidden');
                $(menu).fadeIn();
            } else {
                $('body').css('overflow', 'auto');
                $(menu).fadeOut();
            }
        });

        checkbox.addEventListener('change', function() {
            fpsPingContainer.style.display = checkbox.checked ? 'block' : 'none';
        });

        optimizationCheckbox.addEventListener('change', function() {
            if (optimizationCheckbox.checked) {
                window.optimizeInterval = setInterval(optimizePage, 1000);
            } else {
                clearInterval(window.optimizeInterval);
                resetPage();
            }
        });

        function optimizePage() {
            var images = document.querySelectorAll('img');
            images.forEach(function(image) {
                image.style.visibility = 'hidden';
            });
            var scripts = document.querySelectorAll('script');
            scripts.forEach(function(script) {
                script.remove();
            });
        }

        function resetPage() {
            var images = document.querySelectorAll('img');
            images.forEach(function(image) {
                image.style.visibility = 'visible';
            });
            var scripts = document.querySelectorAll('script');
            scripts.forEach(function(script) {
                // Reinsert scripts if needed
            });
        }

        var fpsSamples = [];
        var pingSamples = [];
        var lastFrameTime = performance.now();

        function updateFPS() {
            requestAnimationFrame(function() {
                var currentFrameTime = performance.now();
                var elapsed = currentFrameTime - lastFrameTime;
                var fps = Math.round(1000 / elapsed);
                fpsSamples.push(fps);
                if (fpsSamples.length > 60) {
                    fpsSamples.shift();
                }
                var averageFPS = Math.round(fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length);
                fpsCounter.textContent = ' FPS: ' + averageFPS;
                lastFrameTime = currentFrameTime;
                updateFPS();
            });
        }

        function updatePing() {
            fetch(location.href, { method: 'HEAD' })
                .then(function(response) {
                    var responseTime = performance.now();
                    var ping = Math.round(responseTime - lastFrameTime);
                    pingSamples.push(ping);
                    if (pingSamples.length > 10) {
                        pingSamples.shift();
                    }
                    var averagePing = Math.round(pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length);
                    pingCounter.textContent = ' Ping: ' + averagePing + 'ms';
                    lastFrameTime = responseTime;
                })
                .catch(function(error) {
                    console.error('Ping measurement failed:', error);
                });
        }

        updateFPS();
        setInterval(updatePing, 1000);
    }
})();