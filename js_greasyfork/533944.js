// ==UserScript==
// @name         TLS Rabat - Créneau + Son + Anti veille + Notifications
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Recherche automatique de créneaux disponibles avec notification sonore et anti-veille, réservation automatique et passage à la confirmation.
// @author       ChatGPT
// @match        https://*.tlscontact.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533944/TLS%20Rabat%20-%20Cr%C3%A9neau%20%2B%20Son%20%2B%20Anti%20veille%20%2B%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/533944/TLS%20Rabat%20-%20Cr%C3%A9neau%20%2B%20Son%20%2B%20Anti%20veille%20%2B%20Notifications.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Intervalles de recherche de créneaux (en millisecondes)
    const intervalMin = 5000; // 5 secondes
    const intervalMax = 12000; // 12 secondes

    // Fonction pour jouer un son
    function playSound() {
        const beep = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1157-pristine.mp3");
        beep.play().catch(e => console.log("🔇 Le son n'a pas pu être joué :", e));
    }

    // Fonction pour envoyer une notification système
    function sendNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification(message);
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(message);
                }
            });
        }
    }

    // Fonction pour empêcher la mise en veille de l'ordinateur
    function preventSleep() {
        document.body.addEventListener('mousemove', () => {});
        document.body.addEventListener('keydown', () => {});
        console.log("🔋 Mise en veille désactivée.");
    }

    // Fonction pour cliquer automatiquement sur un créneau disponible
    function clicCreneau() {
        console.log("🔍 Recherche de créneaux disponibles...");

        const jourDispo = document.querySelector('td.available, td.bg-primary');

        if (jourDispo) {
            console.log("✅ Créneau trouvé ! Clic automatique...");
            playSound();
            sendNotification("Créneau disponible pour la réservation !");
            jourDispo.click();

            setTimeout(() => {
                const confirmer = [...document.querySelectorAll("button")].find(btn =>
                    btn.textContent.includes("Confirmer") || btn.textContent.includes("confirmer")
                );
                if (confirmer) {
                    console.log("🚀 Confirmation du créneau...");
                    confirmer.click();

                    setTimeout(() => {
                        const payerBtn = [...document.querySelectorAll("button")].find(btn =>
                            btn.textContent.includes("Payer") || btn.textContent.includes("payer")
                        );
                        if (payerBtn) {
                            console.log("💳 Passage à la page de paiement...");
                            payerBtn.click();
                        } else {
                            console.log("❓ Pas de bouton 'Payer' trouvé.");
                        }
                    }, 2000);
                } else {
                    console.log("❓ Pas de bouton 'Confirmer' visible pour le moment.");
                }
            }, 2000);
        } else {
            console.log("⏳ Aucun créneau dispo. Nouvelle tentative bientôt...");
            const nextTry = Math.floor(Math.random() * (intervalMax - intervalMin + 1)) + intervalMin;
            console.log(`⏭️ Prochaine tentative dans ${nextTry / 1000} secondes`);
            setTimeout(() => {
                location.reload();
            }, nextTry);
        }
    }

    // Initialisation du script
    window.addEventListener('load', () => {
        preventSleep(); // Empêcher la mise en veille
        setTimeout(clicCreneau, 3000); // Lancer la recherche après 3 secondes
    });

    // Recherche continue de créneaux disponibles avec intervalle aléatoire
    setInterval(() => {
        clicCreneau();
    }, Math.floor(Math.random() * (intervalMax - intervalMin + 1)) + intervalMin);

})();