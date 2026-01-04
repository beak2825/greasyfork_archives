// ==UserScript==
// @name         Détection de comportements suspects - Wolfy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ce script détecte les comportements suspects des utilisateurs pour prévenir les bots dans les jeux en ligne.
// @author       Toi-même
// @match        *://*.wolfy.net/*  // Remplace ceci par l'URL exacte du site que tu veux surveiller
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523529/D%C3%A9tection%20de%20comportements%20suspects%20-%20Wolfy.user.js
// @updateURL https://update.greasyfork.org/scripts/523529/D%C3%A9tection%20de%20comportements%20suspects%20-%20Wolfy.meta.js
// ==/UserScript==

(function() {
  let lastClickTime = Date.now();
  let clickCount = 0;
  let actionsCount = 0;
  let suspicious = false;

  const MAX_CLICKS_PER_MINUTE = 100;  // Nombre de clics par minute
  const MIN_RESPONSE_TIME = 200;  // Temps de réponse minimum en ms (trop rapide pour un humain)
  const MAX_ACTIONS_PER_SESSION = 300;  // Actions par session

  // Fonction pour détecter les clics
  function handleClick(event) {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastClickTime;

    // Calcul des clics par minute
    clickCount++;
    if (timeDifference < 60000) {
      if (clickCount > MAX_CLICKS_PER_MINUTE) {
        suspicious = true;
        console.warn('Comportement suspect : Trop de clics par minute.');
      }
    } else {
      clickCount = 1;  // Réinitialiser le compteur
    }

    lastClickTime = currentTime;

    // Vérification du temps de réponse
    if (timeDifference < MIN_RESPONSE_TIME) {
      suspicious = true;
      console.warn('Comportement suspect : Temps de réponse trop rapide.');
    }
  }

  // Fonction pour compter les actions (comme des clics ou d'autres interactions)
  function handleAction() {
    actionsCount++;
    if (actionsCount > MAX_ACTIONS_PER_SESSION) {
      suspicious = true;
      console.warn('Comportement suspect : Trop d\'actions par session.');
    }
  }

  // Écouter les clics et autres actions
  document.addEventListener('click', handleClick);
  document.addEventListener('mousemove', handleAction);
  document.addEventListener('keypress', handleAction);  // Ajouter d'autres actions si nécessaire

  // Vérifier si un comportement suspect a été détecté
  function checkSuspicious() {
    if (suspicious) {
      console.log('Utilisateur suspect détecté.');
      // Tu peux ici envoyer l'alerte à ton serveur pour un traitement supplémentaire
      // Ex: fetch('/alert', { method: 'POST', body: JSON.stringify({userId: 'id'}) })
    } else {
      console.log('Aucun comportement suspect détecté.');
    }
  }

  // Vérifier les comportements suspect à intervalles réguliers
  setInterval(checkSuspicious, 5000);  // Vérifie toutes les 5 secondes
})();