// ==UserScript==
// @name         Snowing MOPS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Snow update for admin
// @author       ZV
// @match        *://tng-mops-portal.azurewebsites.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486173/Snowing%20MOPS.user.js
// @updateURL https://update.greasyfork.org/scripts/486173/Snowing%20MOPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем HTML
    var newHtml = `

	</i>
    `;
    // Находим элемент Navbar
    var navbarElement = document.querySelector('.navbar-inner.navbar-fixed-top');

    // Вставляем HTML перед Navbar, если элемент найден
    if (navbarElement) {
        navbarElement.insertAdjacentHTML('beforebegin', newHtml);
    }
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

    // Функция для инициализации particles.js
    function initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 20,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#fff"
                },
                shape: {
                    type: "image",
                    image: {
                        src: 'https://svgshare.com/getbyhash/sha1-zwkiPkVGm0n4Q3jrVPxuW1cFeR0=',
                        width: 100,
                        height: 100
                    }
                },
                opacity: {
                    value: 1,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 10,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 10,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 14,
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
                    distance: 50,
                    duration: 5
                }
            }
        }
    });
}

// Загружаем скрипт particles.js
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
script.onload = initParticles; // Инициализация после загрузки скрипта
document.head.appendChild(script);
})();