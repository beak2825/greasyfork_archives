// ==UserScript==
// @name        Terminalize
// @namespace   Violentmonkey Scripts
// @match       *://*.*/*
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant       none
// @version     1.0
// @author      BluePhi09
// @description A user script that terminalizes every website you visit
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540217/Terminalize.user.js
// @updateURL https://update.greasyfork.org/scripts/540217/Terminalize.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    function terminalize() {
        $('body *').each(function(){
            const $element = $(this);
            if ($element.data('terminalfonted')) return;
            $element.data('terminalfonted', true);
            $element.css('font-family', 'Courier New, Courier, monospace');
        });
        $('p:not(:has(a)), h1:not(:has(a)), h2:not(:has(a)), h3:not(:has(a)), span:not(:has(*)), li:not(:has(a, form)), a:not(:has(img))').each(function () {
            const $element = $(this);
            if ($element.data('terminalized')) return;
            $element.data('terminalized', true);

            const fullText = $element.text();
            let index = 0;
            $element.text('');

            function typeChar() {
                if (index < fullText.length) {
                    $element.text($element.text() + fullText.charAt(index));
                    index++;
                    setTimeout(typeChar, 60 + Math.random() * 100);
                }
            }

            typeChar();
        });
    }

    terminalize();

    const observer = new MutationObserver(() => {
        terminalize();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    $(document).on('input', 'input, textarea', function () {
        if ($(this).val().toLowerCase().includes('hacking')) {
            spawnMatrixRain();
        }
    });

    function spawnMatrixRain() {
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                createMatrixLetter();
            }, i * 100);
        }
    }

    function createMatrixLetter() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const letter = chars.charAt(Math.floor(Math.random() * chars.length));
        const $span = $('<span>')
            .text(letter)
            .css({
                position: 'fixed',
                left: Math.random() * window.innerWidth + 'px',
                top: '-40px',
                color: '#00ff00',
                fontSize: '2em',
                fontFamily: 'monospace',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: 0.8,
                textShadow: '0 0 8px #0f0, 0 0 16px #0f0'
            })
            .appendTo('body');

        $span.animate(
            { top: window.innerHeight + 'px', opacity: 0.1 },
            1200 + Math.random() * 1200,
            'linear',
            function () {
                $span.remove();
            }
        );
    }

})(window.jQuery);