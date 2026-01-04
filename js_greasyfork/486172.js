// ==UserScript==
// @name         Rainy MOPS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Rain update for admin
// @author       ZV
// @match        *://tng-mops-portal.azurewebsites.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486172/Rainy%20MOPS.user.js
// @updateURL https://update.greasyfork.org/scripts/486172/Rainy%20MOPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем элемент для снегопада
    var particlesDiv = document.createElement('div');
    particlesDiv.id = 'particles-js';
    particlesDiv.style.position = 'fixed';
    particlesDiv.style.top = 0;
    particlesDiv.style.left = 0;
    particlesDiv.style.width = '100%';
    particlesDiv.style.height = '100%';
    particlesDiv.style.zIndex = '99999';
    particlesDiv.style.pointerEvents = 'none';
    document.body.appendChild(particlesDiv);

    // Функция для инициализации particles.js с эффектом дождя
    function initRain() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#aaa"
                },
                shape: {
                    type: "image",
                    image: {
                        src: 'https://svgshare.com/getbyhash/sha1-SKLzCcVGRGdpcFh8VA6bEgq9YCQ=', // URL
                        width: 40,
                        height: 100,
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 2,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: false,
                    distance: 100,
                    color: "#aaa",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 40,
                    direction: "bottom",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "window",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "repulse"
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 25,
                        duration: 0.4
                    }
                }
            }
        });
    }

    // Загружаем скрипт particles.js
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = initRain; // Инициализация после загрузки скрипта
    document.head.appendChild(script);

})();
