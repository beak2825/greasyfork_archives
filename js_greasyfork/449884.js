// ==UserScript==
// @name         IMX.TO Direktlink on GirlsReleased
// @name:de      Direkte Bildlinks auf Girlsreleased.com
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Replaces Image URIs on GirlsReleased with direct links to the image files on imx.to, imagetwist.com, imgadult.com or pixhost.to
// @description:de Ersetzt die Bild-Links auf GirlsReleased mit direkten Links zu den Bilddateien auf imx.to, imagetwist.com, imgadult.com oder pixhost.to
// @author       Christian Schmidt
// @match        https://girlsreleased.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=girlsreleased.com
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/449884/IMXTO%20Direktlink%20on%20GirlsReleased.user.js
// @updateURL https://update.greasyfork.org/scripts/449884/IMXTO%20Direktlink%20on%20GirlsReleased.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlpart = '.imx.to/i/';
    const auswahl = document.createElement('div');
    const imxtoptn = /imx\.to/;
    const imgtwistptn = /imagetwist\.com/;
    const imgtwistbigjpg = /\.JPG/;
    const imgadultptn = /imgadult\.com/;
	const pixhostptn = /pixhost\.to/;
    auswahl.style.fontSize = '0.7em';
    auswahl.style.padding = '.5em';
    auswahl.classList.add("w-full", "fixed");
    auswahl.style.top = '4rem';
    let awcode = '<form id="imxtoauswahl" style="min-width:500px"><label for="imxtoselect">imx.to image server:</label><select name="imxtoselect" id="imxtoselect" size="1"><option value="i" selected>i</option>';
    for (let i = 1; i < 10; i++) {
        awcode += '<option value="i00'+i+'">i00'+i+'</option>';
    }
    awcode += '</select>.imx.to <button id="imxtoselectbtn" type="button">Convert hyperlinks</button></form>';
    auswahl.innerHTML = awcode;
    setTimeout(() => {
        const ads = document.querySelectorAll('.ad-banner');
        ads.forEach(ad => {
            ad.remove();
        });
        const content = document.querySelector('.content');
		const par = content.parentNode;
        par.insertBefore(auswahl, content);

        const awbutton = document.getElementById("imxtoselectbtn");
        if (awbutton != null) {
            awbutton.addEventListener("click", function(e) {
                e.preventDefault();
                const aw = document.getElementById("imxtoselect").value;
                if (!aw) return;
                let servername = aw + urlpart;
                let thumblist = document.querySelectorAll('.images .imageContainer .image');
                if (thumblist.length == 0) return;
                [...thumblist].forEach(ele => {
                    const a = ele.querySelector('a');
                    const img = ele.querySelector('img');
                    const thumbimgsrc = img.src;

                    if (imxtoptn.test(thumbimgsrc)) {
                        const neubildsrc = thumbimgsrc.replace('https://imx.to/u/t/', 'https://' + servername);
                        a.href = neubildsrc;
                        let bgcolor = 'PowderBlue';
                        switch (aw) {
                            case 'i001': bgcolor = 'AliceBlue'; break;
                            case 'i002': bgcolor = 'Azure'; break;
                            case 'i003': bgcolor = 'PaleTurquoise'; break;
                            default: bgcolor = 'PowderBlue'; break;
                        }
                        ele.style.backgroundColor = bgcolor;
                    }
                    if (imgtwistptn.test(thumbimgsrc)) {
                        let neubildsrc = thumbimgsrc;
                        if (imgtwistbigjpg.test(img.alt)) {
                            neubildsrc = neubildsrc.replace('.jpg', '.JPG');
                        }
                        neubildsrc = neubildsrc.replace('imagetwist.com/th/', 'imagetwist.com/i/') + '/' + img.alt;
                        a.href = neubildsrc;
                        ele.style.backgroundColor = 'Lavender';
                    }
                    if (imgadultptn.test(thumbimgsrc)) {
                        let neubildsrc = thumbimgsrc;
                        neubildsrc = neubildsrc.replace('small-medium/', 'big/');

                        a.href = neubildsrc;
                        ele.style.backgroundColor = 'SeaShell';
                    }
					if (pixhostptn.test(thumbimgsrc)) {
						let neubildsrc = thumbimgsrc;
						neubildsrc = neubildsrc.replace('https://t', 'https://img');
						neubildsrc = neubildsrc.replace('/thumbs/', '/images/');
						a.href = neubildsrc;
						ele.style.backgroundColor = 'HoneyDew';
					}
                });
            });
        }
    }, 1000);
})();