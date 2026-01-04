// ==UserScript==
// @name         Снег на Форум + Маркет // 2023 -2024
// @description  снег на форум и маркет
// @author       stealyourbrain
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @version 0.0.1.20231120092523
// @namespace https://greasyfork.org/users/1220529
// @downloadURL https://update.greasyfork.org/scripts/480349/%D0%A1%D0%BD%D0%B5%D0%B3%20%D0%BD%D0%B0%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%2B%20%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%82%20%202023%20-2024.user.js
// @updateURL https://update.greasyfork.org/scripts/480349/%D0%A1%D0%BD%D0%B5%D0%B3%20%D0%BD%D0%B0%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%2B%20%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%82%20%202023%20-2024.meta.js
// ==/UserScript==

const animeScript = document.createElement('script');
animeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
document.head.appendChild(animeScript);

animeScript.onload = function () {
    (function () {
        'use strict';

        const snowflakes = [];

        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄';
            snowflake.style.position = 'fixed';
            snowflake.style.color = '#fff';
            snowflake.style.pointerEvents = 'none';
            snowflake.style.fontSize = Math.random() * 20 + 'px';
            snowflake.style.top = '-50px';
            snowflake.style.left = Math.random() * window.innerWidth + 'px';
            document.body.appendChild(snowflake);
            snowflakes.push(snowflake);

            anime({
                targets: snowflake,
                translateY: '100vh',
                translateX: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
                duration: 2000 + Math.random() * 3000,
                easing: 'linear',
                complete: function () {
                    document.body.removeChild(snowflake);
                    snowflakes.splice(snowflakes.indexOf(snowflake), 1);
                    createSnowflake();
                }
            });
        }

        function createSnowfall() {
            for (let i = 0; i < 30; i++) {
                createSnowflake();
            }
        }

        createSnowfall();
    })();
};