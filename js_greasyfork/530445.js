// ==UserScript==
// @name         Anti Offensive Message
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  saldırgan mesaj uyarsını engeller 
// @author       Ryzex
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530445/Anti%20Offensive%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/530445/Anti%20Offensive%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ekleGörünmez(metin) {
        const görünmezKarakter = "\u200B"; // Sıfır Genişlikli Boşluk
        return metin.split('').map(harf => görünmezKarakter + harf + görünmezKarakter).join('');
    }

    const orijinalWS = WebSocket.prototype.send;
    WebSocket.prototype.send = function(veri) {
        if (typeof veri === 'string' && veri.startsWith('42[11')) {
            let eşleşme = veri.match(/42\[11,(\d+),"(.+?)"\]/);
            if (eşleşme) {
                let [_, kimlik, mesaj] = eşleşme;
                let dönüştürülmüşMesaj = ekleGörünmez(mesaj);

                if (dönüştürülmüşMesaj !== mesaj) {
                    veri = `42[11,${kimlik},"${dönüştürülmüşMesaj}"]`;
                }
            }
        }
        return orijinalWS.call(this, veri);
    };
})();

