// ==UserScript==
// @name         Kour KP Script
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Unlimited 1500 KP Daily Rewards
// @author       rexmine2
// @match        *://kour.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kour.io
// @grant        none
// @license      ISC <3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528369/Kour%20KP%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/528369/Kour%20KP%20Script.meta.js
// ==/UserScript==

// Observer pour les mutations dans le DOM (inchangé)
new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT' && !node.src) {
                if (String(node.textContent).toLowerCase().includes('userscript')) {
                    node.textContent = 'console.log(`Nice "anticheat" :D`)';
                }
            }
        }
    }
}).observe(document, { childList: true, subtree: true });

// Modification de la fonction fetch (inchangée)
const _fetch = window.fetch;
window.fetch = function () {
    if (arguments[0].includes('/api/track')) {
        return Promise.reject();
    }

    return _fetch.apply(this, arguments);
}

// Fonction pour fixer les récompenses quotidiennes
function fixDailyRewards(selectedDay) {
    try {
        if (!window.firebase.auth()?.currentUser) return;

        let shouldSet = false;

        const rewardObj = { lastDailyReward: selectedDay }; // Utilisation du jour modifié
        const refKey = 'users/' + window.firebase.auth().currentUser.uid;

        window.firebase.database().ref(refKey).once('value', e => {
            const obj = e.val();

            Object.keys(obj).forEach(key => {
                if (key.startsWith('dailyReward_')) {
                    rewardObj[key] = null;
                    shouldSet = true;
                }

                if (key === 'lastDailyReward' && obj[key] !== selectedDay) {
                    shouldSet = true;
                }
            });

            if (shouldSet) {
                window.firebase.database().ref(refKey).update(rewardObj);
                window.showUserDetails('', window.firebase.auth().currentUser);
            }
        });

    } catch { }
}

// Fonction pour manipuler les données et envoyer des messages (inchangée)
function fakeSetDataNew(a) {
    window.unityInstance.SendMessage('FirebasePlayerPrefs2023', 'OnSetData', '{"err":null}&' + [...a].pop());
}

// Définition de la propriété unityInstance (inchangée)
Object.defineProperty(window, 'unityInstance', {
    get() {
        return this._unityInstance;
    },
    set(v) {
        const _setDataNew = window.setDataNew;
        window.setDataNew = function () {
            if (arguments[1] === 'banned') {
                fakeSetDataNew(arguments);
                return;
            }

            if (arguments[1].includes("dailyReward_")) {
                fakeSetDataNew(arguments);
                window.showUserDetails('', window.firebase.auth().currentUser);
                return;
            }

            if (arguments[1] === 'lastDailyReward') {
                arguments[2] = '5';
            }

            return _setDataNew.apply(this, arguments);
        }

        this._unityInstance = v;

        const _SendMessage = this._unityInstance.SendMessage;
        this._unityInstance.SendMessage = function () {
            if (arguments[1] === 'OnLoggedInGoogle') fixDailyRewards();
            return _SendMessage.apply(this, arguments);
        }
    },
});

// Demander à l'utilisateur quel jour il souhaite définir pour la récompense
function promptUserForDay() {
    // Demander à l'utilisateur de choisir un jour avec un prompt
    const userInput = prompt("Quel jour souhaitez-vous définir pour votre récompense quotidienne ? (ex. 22, 23, 24...)");

    // Vérifier si la saisie est valide
    if (userInput && !isNaN(userInput)) {
        let selectedDay = parseInt(userInput.trim()); // Convertir l'entrée en entier
        if (selectedDay > 2) {
            selectedDay -= 2;  // Soustraire 2 au jour choisi
            console.log(`Récompense quotidienne changée au jour ${selectedDay}`);
            fixDailyRewards(selectedDay);  // Appeler la fonction pour modifier la récompense
        } else {
            alert("Le jour saisi est trop petit. Veuillez saisir un jour supérieur à 2.");
        }
    } else {
        alert("Entrée invalide. Veuillez saisir un jour valide.");
    }
}

// Ajout de l'écouteur de la touche "K" pour changer le daily reward
document.addEventListener('keydown', (event) => {
    // Vérifie si la touche appuyée est "K" (keyCode 75 ou "k")
    if (event.key.toLowerCase() === 'k') {
        console.log('Touche "K" pressée, changement de la daily reward !');
        promptUserForDay();  // Demande à l'utilisateur de choisir un jour
    }
});
