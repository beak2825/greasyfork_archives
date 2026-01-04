// ==UserScript==
// @name         OpenU Video Speed Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Increases the maximum playback speed of OpenU video player
// @author       Claude 3.7 w/ Bar Borer
// @match        *://*.openu.ac.il/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529544/OpenU%20Video%20Speed%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529544/OpenU%20Video%20Speed%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to override the AddSpeedControlLogic function
    function overrideSpeedControl() {
        // Make sure $openu exists
        if (typeof $openu === 'undefined' || !$openu) {
            console.log("Waiting for $openu to be defined...");
            setTimeout(overrideSpeedControl, 1000);
            return;
        }

        // Add CSS to fix overflow issues
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .openu-speed-menu {
                min-width: 120px !important;
                max-height: 400px !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
            }
            
            .openu-speed-menu:not([aria-expanded="true"]) {
                display: none !important;
            }
            
            .openu-speed-menu[aria-expanded="true"] {
                display: flex !important;
                flex-direction: column !important;
            }
            
            .openu-speed-content-item {
                text-align: center !important;
                width: 100% !important;
                padding: 8px 15px !important;
                font-size: 14px !important;
            }
        `;
        document.head.appendChild(styleElement);

        // Store the original function
        const originalAddSpeedControlLogic = $openu.AddSpeedControlLogic;

        // Override the function
        $openu.AddSpeedControlLogic = function(player) {
            if (document.querySelector('video') == null)
                return;

            // Change these values to adjust the speed options
            var minSpeed = 0.5;     // Original: 0.75
            var maxSpeed = 4.0;     // Changed from 5.0 to 4.0
            var speedStep = 0.25;   // Original: 0.25
            var defaultSpeed = 1;

            var setPlaySpeed = function(speed) {
                var i = parseFloat(speed);
                if (player) {
                    if (player.getPlaybackRate()) {
                        if (i < minSpeed || i > maxSpeed)
                            return !1;
                        return player.setPlaybackRate(i);
                    }
                }
            };

            var PlayerSpeedInit = function() {
                var speedList = $('<div/>').addClass('jw-reset openu-menu openu-speed-menu').attr('role', 'menu').attr('aria-expanded', 'false').attr('aria-label', $openu.str('speedmenu'));
                var speeds = [];
                var currentSpeed = minSpeed;
                var btn = $('<div/>').attr('role', "button").attr('tabindex', 0).attr('aria-haspopup', "true").addClass('jw-icon jw-icon-inline jw-button-color jw-reset openu-speed-btn').attr('aria-label', $openu.str('speedmenu')).on('click', function() {
                    var m = $('.openu-speed-menu');
                    var isExpanded = m.attr('aria-expanded') === 'true';
                    
                    // Toggle the aria-expanded attribute
                    m.attr('aria-expanded', !isExpanded);
                    
                    // Toggle the jw-open class
                    $(this).parent()[isExpanded ? 'removeClass' : 'addClass']('jw-open');
                    
                    if (!isExpanded) {
                        $('.openu-speed-content-item.active').focus();
                    }
                });
                
                var text = $('<div/>').addClass('jw-reset jw-tooltip jw-tooltip-speed').append($('<div/>').addClass('jw-text').text($openu.str('speedmenu')));
                var svg = $('<div/>').addClass('jw-reset openu-text-speed');

                btn.on('keyup', function(e) {
                    e.stopImmediatePropagation();
                    if (e.keyCode == 13) {
                        $(this).click();
                        return !1;
                    }
                });

                while (currentSpeed <= maxSpeed) {
                    speeds.push(currentSpeed.toFixed(2));
                    currentSpeed += speedStep;
                }
                speeds.reverse();

                for (var i = 0; i < speeds.length; i++) {
                    var theSpeed = String(speeds[i]);
                    var speed = $('<button/>').on('focusout', function(e) {
                        return setTimeout(function() {
                            if ($('.openu-speed-content-item:hover').length || $('.openu-speed-btn:hover').length)
                                return;
                            if ($('.openu-speed-content-item.focus-within').length)
                                return;
                            if ($('.openu-speed-menu').attr('aria-expanded') !== 'true')
                                return;
                            $('.openu-speed-btn').click();
                            e.preventDefault();
                            return !1;
                        }, 100);
                    }).attr('data-speed', theSpeed).attr('type', "button").attr('aria-checked', "false").attr('role', "menuitemradio").attr('aria-label', $openu.str('speedoption').replace('#', +speeds[i])).addClass('jw-reset openu-speed-content-item').html('x' + speeds[i]);

                    speedList.append(speed);
                    if (speeds[i] == defaultSpeed.toFixed(2)) {
                        speed.addClass('active').attr('aria-checked', "true");
                    }
                }

                svg.html('x' + defaultSpeed.toFixed(2));
                btn.append(svg).append(text).attr('data-content', defaultSpeed.toFixed(2));
                btn.insertBefore($('.jw-icon-settings'));
                speedList.insertBefore($('.openu-text-speed'));

                $('#vod .openu-speed-menu button[role="menuitemradio"]').on("keydown click", function(event) {
                    if (event.type === "click" || (event.type === "keydown" && (event.key === "Enter" || event.key === " "))) {
                        setPlaySpeed($(this).attr('data-speed'));
                        btn.attr('data-content', $(this).attr('data-speed'));
                        speedList.children().removeClass('active');
                        speedList.children().attr('aria-checked', "false");
                        $(this).addClass('active');
                        $(this).attr('aria-checked', "true");
                        $(this).append($('.openu-speed-indicator'));
                        $('.openu-text-speed').html($(this).text());
                        
                        // Close the menu after selection
                        speedList.attr('aria-expanded', 'false');
                        btn.parent().removeClass('jw-open');
                    }
                });
                
                // Handle clicks outside the menu to close it
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.openu-speed-btn, .openu-speed-menu').length) {
                        speedList.attr('aria-expanded', 'false');
                        btn.parent().removeClass('jw-open');
                    }
                });
                
                // Also close the menu when user interacts with timeline or other controls
                $('.jw-slider-time, .jw-icon-playback').on('click', function() {
                    speedList.attr('aria-expanded', 'false');
                    btn.parent().removeClass('jw-open');
                });
            };

            PlayerSpeedInit();
        };

        // Add notification to show the script is working
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px 15px';
        notification.style.background = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.textContent = 'up to 4x Video Speed Available';
        notification.style.transition = 'opacity 0.5s ease-in-out';

        document.body.appendChild(notification);

        // Make notification disappear after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);

        console.log('Video Speed Enhancer: Successfully replaced AddSpeedControlLogic function');
    }

    // Try to override speed control when DOM is ready
    function init() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // Check if we're on a page with video
            if (document.querySelector('video') || document.getElementById('vod')) {
                overrideSpeedControl();
            } else {
                // Check for video player initialization
                const observer = new MutationObserver((mutations) => {
                    if (document.querySelector('video') || document.getElementById('vod')) {
                        observer.disconnect();
                        overrideSpeedControl();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                // Safety timeout - stop observing after 30 seconds
                setTimeout(() => observer.disconnect(), 30000);
            }
        } else {
            document.addEventListener('DOMContentLoaded', init);
        }
    }

    // Start the initialization process
    init();
})();