// ==UserScript==
// @name         Smartschool Score Fixer (Altijd voldoende + Geel)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Zet onvoldoendes op Smartschool visueel om in voldoendes met gele kleur
// @author       Lowie
// @match        https://*.smartschool.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530439/Smartschool%20Score%20Fixer%20%28Altijd%20voldoende%20%2B%20Geel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530439/Smartschool%20Score%20Fixer%20%28Altijd%20voldoende%20%2B%20Geel%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const minimaleScore = 50; // Minimum percentage voor voldoende
    const minimaleBreuk = 0.5; // Minimum verhouding voor breuk
    let notificatieGetoond = false;

    function wijzigAlleScores() {
        let wijziging = false;

        // 🔶 1. Percentage en breuken aanpassen
        document.querySelectorAll('.progress-ring__content span, .evaluation-graphic__progress-ring__value, .evaluation-graphic__progress-ring__description').forEach(span => {
            const text = span.textContent.trim();
            let nieuweWaarde = null;

            if (/^\d+%$/.test(text)) {
                const waarde = parseInt(text.replace('%', ''));
                if (waarde < minimaleScore) {
                    nieuweWaarde = `${minimaleScore}%`;
                }
            } else if (/^(\d+)\/(\d+)$/.test(text)) {
                const match = text.match(/^(\d+)\/(\d+)$/);
                const behaald = parseInt(match[1]);
                const totaal = parseInt(match[2]);
                const verhouding = behaald / totaal;
                if (verhouding < minimaleBreuk) {
                    const nieuwBehaald = Math.ceil(totaal * minimaleBreuk);
                    nieuweWaarde = `${nieuwBehaald}/${totaal}`;
                }
            }

            if (nieuweWaarde) {
                span.textContent = nieuweWaarde;
                span.style.color = 'goldenrod';
                wijziging = true;

                // Ringen aanpassen alleen als de score onvoldoende was
                const ring = span.closest('.progress-ring');
                if (ring) {
                    ring.querySelectorAll('.progress-ring__svg__bar').forEach(bar => {
                        bar.style.stroke = 'var(--c-yellow--500)';
                        bar.style.strokeDasharray = '370.708px, 370.708px';
                        bar.style.strokeDashoffset = '185.354px'; // 50% van de cirkel
                    });
                    ring.querySelectorAll('.progress-ring__svg__stroke').forEach(stroke => {
                        stroke.style.stroke = 'var(--c-yellow--200)';
                    });
                    ring.style.display = 'flex';
                    ring.style.alignItems = 'center';
                    ring.style.justifyContent = 'center';
                }
            }
        });

        // 🔶 2. Pas de rode combo klasse aan naar geel (alleen bij onvoldoende scores)
        document.querySelectorAll('.evaluation-graphic, .evaluation-list-item').forEach(div => {
            if (div.classList.contains('c-red-combo--100')) {
                div.classList.remove('c-red-combo--100');
                div.classList.add('c-yellow-combo--100');
                wijziging = true;
            }
        });

        // 🔶 Notificatie tonen bij eerste wijziging
        if (wijziging && !notificatieGetoond) {
            const box = document.createElement('div');
            box.textContent = '✅ Scores zijn visueel aangepast naar voldoendes!';
            box.style.position = 'fixed';
            box.style.top = '10px';
            box.style.left = '50%';
            box.style.transform = 'translateX(-50%)';
            box.style.backgroundColor = '#ffd700';
            box.style.color = '#000';
            box.style.padding = '10px 20px';
            box.style.borderRadius = '10px';
            box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            box.style.zIndex = '9999';
            document.body.appendChild(box);
            setTimeout(() => box.remove(), 4000);
            notificatieGetoond = true;
        }
    }

    // Herhaal elke seconde (tegen automatische verversing)
    setInterval(wijzigAlleScores, 1000);
})();
