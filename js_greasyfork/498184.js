// ==UserScript==
// @name         Mail Locker for Korusigorta
// @namespace    Violentmonkey Scripts
// @match        https://www.korusigorta.com.tr/tr/acentelerimiz
// @grant        none
// @version      1.0
// @author       Vodafone
// @license      MIT
// @description  20.07.2023 03:19:52 - Discord sunucumuz: discord.gg/vodafone
// @downloadURL https://update.greasyfork.org/scripts/498184/Mail%20Locker%20for%20Korusigorta.user.js
// @updateURL https://update.greasyfork.org/scripts/498184/Mail%20Locker%20for%20Korusigorta.meta.js
// ==/UserScript==

/*
 MIT License

 Copyright (c) 2024 Vodafone

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

(function() {
    'use strict';

    var btnAra = document.getElementById('register');

    var epostaAdresleri = new Set();

    btnAra.addEventListener('click', function() {
        var mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');

        mailtoLinks.forEach(function(link) {
            var mailtoHref = link.getAttribute('href');
            var epostaAdresi = mailtoHref.substring(7);

            if (epostaAdresi.includes('@hotmail') || epostaAdresi.includes('@outlook') || epostaAdresi.includes('@outlook.com.tr')) {
                epostaAdresi = epostaAdresi.replace('.com.t', '.com');
                epostaAdresi = epostaAdresi.replace('.co', '.com');

                if (epostaAdresi.endsWith('.comm')) {
                    epostaAdresi = epostaAdresi.replace('.comm', '.com');
                }

                if (epostaAdresi.includes(';')) {
                    epostaAdresi = epostaAdresi.split(';')[0];
                }

                epostaAdresleri.add(epostaAdresi);
            }
        });

        var uniqueEmails = Array.from(epostaAdresleri);
        if (uniqueEmails.length > 0) {
            console.log("Toplam " + uniqueEmails.length + " adet e-posta adresi bulundu:");
            console.log(uniqueEmails.join('\n'));
        } else {
            console.log("E-posta adresi bulunamadı.");
        }
    });

})();
