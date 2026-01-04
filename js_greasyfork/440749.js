// ==UserScript==
// @name         muahahaha platzi
// @namespace    muahahaha
// @version      0.10
// @description  numero de clases en los cursos
// @include      https://platzi.com/home
// @include      https://platzi.com/cursos/*
// @include      https://platzi.com/clases/*
// @run-at       document-end
// @grant        unsafeWindow
// @license      © 2022
// @icon         https://www.google.com/s2/favicons?domain=platzi.com
// @downloadURL https://update.greasyfork.org/scripts/440749/muahahaha%20platzi.user.js
// @updateURL https://update.greasyfork.org/scripts/440749/muahahaha%20platzi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function muahahaha_platzi() {
        var reload = true;

        if (typeof(unsafeWindow.$) === 'function') {
            var $ = unsafeWindow.$;

            if (location.pathname.substr(0,5) === '/home' && $('.BeneficiaryStats-row').length) {
                reload = false;

                $('head').append(
                    '<style id="muahahaha_platzi" media="all">'
                    + '.BeneficiaryStats-row[data-muahahaha-platzi-hide="1"] + .BeneficiaryRow { border-bottom: 0 none; }\n'
                    + '.BeneficiaryStats-row[data-muahahaha-platzi-hide="1"] + .BeneficiaryRow + .BeneficiaryRow { display: none; }\n'
                    + '.BeneficiaryStats-row[data-muahahaha-platzi-hide] .BeneficiaryStats-row-title { cursor: pointer; }\n'
                    + '</style>'
                );

                $('link[rel="icon"]').prop('href', 'data:image/webp;base64,UklGRjoCAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSLkAAAARcFvbbttgB3Xq5FhpFYdKa2gM5ziGWg+Qeg/gKnsAVs4KhMAPTxARDNw2UtQmxwyfIEe90SU1SUhwa8fU9tGFvaS8ry6uAKqKgPuKLyABP9oroloZVJIAlYHk3PnzDwFdJG6dGBsfkihmF2Ozwmy9bO52mcZ0WqSr8eJJgbw3SZwBlTfBhA7UFITfaq+sAq4Kq4rakkhF7ZJONbCvskD9X/T0/9Uf/ksMURDD/4eI4O7We/M4xL4QAgBWUDggWgEAAPAIAJ0BKiAAIAA+fTCSR6SjIaE36ACQD4lsXYBGFiH6g9G/GD8Zr0O1t1j6QHiAdIDRAP2O6wD0APK59hv9vPSAKfBLs2ylXnbJL6PfdmIAAP7sjcjSfxVkJcYT0h/W9e+Jo8YB8NCmACjO7AAlnwviaJUuenbObGSbrC+n1ym+5JTsIwvgBEfuDt8XW9UK0R8EYf9yEksngOW8j0QVVCJzzQZ7M7umBsYpdDB+GHj7O9Ohxkab260AU27Soes1XEqSwWJfztdOfu44vUS6dlj1gS5Lx18VZ/2gPqVfK75gPBDgHwIq/aPsN1g4cIYXa9JgboxQGP44u24Uf57Shd0U2C14S6hCQX1N4WPszum/mVuHPyFoW7ovocDvufLlwnqFDCAIWIaQA0Et/wOT9JPTASmP+6nVIGVagmRr+aC6h0/NyoZDe4At6pYCleYHcjha/tKsYOrQ+AA=');

                $('.BeneficiaryStats-row').attr('data-muahahaha-platzi-hide', '1');

                $('.BeneficiaryStats-row[data-muahahaha-platzi-hide] .BeneficiaryStats-row-title').click(function(){
                    var e = $('.BeneficiaryStats-row');
                    e.attr('data-muahahaha-platzi-hide', 1 - e.attr('data-muahahaha-platzi-hide'));
                });

                console.log('muahahaha platzi home');
            }
            else if (location.pathname.substr(0,8) === '/cursos/') {
                reload = false;

                let a = $('.Content-wrapper .ContentBlock-list .ContentBlock-list-item .ContentClass p');
                $('head').append(
                    '<style id="muahahaha_platzi">'
                        + 'body {\n'
                            + 'counter-reset: laclase;\n'
                        + '}\n'
                        + '*.Content-wrapper *.ContentBlock-list *.ContentBlock-list-item *.ContentClass p::after {\n'
                            + 'counter-increment: laclase;\n'
                            + 'content: \' — \' counter(laclase) \' / ' + a.length + '\';\n'
                        + '}\n'
                    + '</style>'
                );

                console.log('muahahaha platzi cursos');
            }
            else if (location.pathname.substr(0,8) === '/clases/') {
                reload = false;

                $('head').append(
                    '<style id="muahahaha_platzi" media="print">'
                        + '*.Syllabus.Syllabus--close { display: none; }\n'
                        + '*.Actionsv2-menu-logged { display: none; }\n'
                        + '*.MaterialView-video { max-height: none !important; }\n'
                        + '*.MaterialView-video-item { display: none; }\n'
                        + '*.MaterialView-content-wrapper .Header.material-lecture { page-break-after: avoid; break-after: avoid; page-break-inside: avoid; break-inside: avoid; }\n'
                        + '*.MaterialView-content-wrapper .MaterialLecture { page-break-before: avoid; break-before: avoid; page-break-inside: auto; break-inside: auto; }\n'
                        + '*.MaterialView-content-wrapper .MaterialLecture a::before { color: blue; font-style: italic; content: attr(href) \' \\00BB\\00A0\'; }\n'
                        + '*.MaterialView-content-wrapper .MaterialLecture iframe[src^="https://www.youtube-nocookie.com/embed/"]::before,\n'
                        + '*.MaterialView-content-wrapper .MaterialLecture iframe[src^="https://www.youtube.com/embed/"]::before { color: blue; font-style: italic; content: attr(src) \' \\00BB\\00A0\'; }\n'
                    + '</style>'
                );

                console.log('muahahaha platzi clases');
            }
        }

        if (reload) {
            console.log('muahahaha platzi setTimeout');

            setTimeout(muahahaha_platzi, 100);
		}
	}

	muahahaha_platzi();
})();