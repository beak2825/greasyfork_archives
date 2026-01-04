// ==UserScript==
// @name         [Eternal-games] Affiche la clé
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Affiche la clé sur le site
// @author       LynxÉclair
// @match        https://eternal-games.com/playretro*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/490540/%5BEternal-games%5D%20Affiche%20la%20cl%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/490540/%5BEternal-games%5D%20Affiche%20la%20cl%C3%A9.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // URL de l'API pour récupérer les données JSON
    var buildDataJsonURLRetro = "https://web-back.eternal-games.com/api/client-releases/last-build-data";
 
    // Utilisation de GM_xmlhttpRequest pour récupérer les données JSON
    GM_xmlhttpRequest({
        method: 'GET',
        url: buildDataJsonURLRetro,
        onload: function(response) {
            // Parse la réponse en JSON
            var buildDataJsonRetro = JSON.parse(response.responseText);
            // Récupère la partie de la clé à hacher
            var keyPartToHashRetro = buildDataJsonRetro["keyPartToHash"];
 
            // Vos variables
            var nonRemasteredHash = "49540452afd0c11afeb50fa79051ee35c6be0f998e9374a9b80196b0035fbd5d";
            var remasteredHash = "a139bb7420edf6664efabdb1829d0c6d776568a76b7e3c0e30dd33b7ea6c04f9";
 
            // Concaténation des chaînes
            var toHash = nonRemasteredHash + remasteredHash + keyPartToHashRetro;
 
            // Calcul du hachage SHA-256
            var zipPasswordRetro = CryptoJS.SHA256(toHash).toString();
 
            // Fonction pour modifier le contenu de la page
            function modifyContent() {
                // Suppression des éléments input
                var inputs = document.querySelectorAll('input[type="file"][webkitdirectory][directory][mozdirectory]');
                inputs.forEach(function(input) {
                    input.parentNode.removeChild(input);
                });
 
                // Remplacement des phrases spécifiques
                var textToReplace = [
            {
                search: /Veuillez sélectionner le dossier contenant un client avec le pack "Classic" en version 1\.40\.13 datant de préférence entre le 30 Août 2023 et le 6 Septembre 2023 \(un build 1\.40\.13 datant d'avant ou d'après cette date peut fonctionner mais ce n'est pas garanti\)\. L'analyse locale des fichiers du client peut prendre quelques minutes en fonction de la puissance de votre PC et de la vitesse de son disque dur\./g,
                replacement: ''
            },
            {
                search: /Veuillez sélectionner le dossier contenant un client avec le pack "Remastered" en version 1\.40\.13 datant de préférence entre le 30 Août 2023 et le 6 Septembre 2023 \(un build 1\.40\.13 datant d'avant ou d'après cette date peut fonctionner mais ce n'est pas garanti\)\. L'analyse locale des fichiers du client peut prendre quelques minutes en fonction de la puissance de votre PC et de la vitesse de son disque dur\./g,
                replacement: ''
            },
            {
                search: /Cet outil est à utiliser lors de la sortie de chaque mise à jour du client Eternal Games pour le déchiffrer à l'aide des fichiers protégés par le copyright que vous vous êtes procurés par vos propres moyens\. La clé de déchiffrement s'affichera sur votre écran après l'analyse des fichiers des packs "Classic" et "Remastered" s'ils sont corrects et non modifiés\. Cet outil fonctionne entièrement en local sur votre PC, aucune donnée ne nous est envoyée pour authentifier vos fichiers\. Vous devez posséder et faire authentifier les deux packs \(Classic et Remastered\) obligatoirement, il n'est pas possible de déchiffrer le client Eternal Games avec un seul pack\. L'outil a été testé avec Google Chrome et Firefox\. Il est déconseillé d'utiliser Safari\./g,
                replacement: ''
            },
            {
                search: /Cet outil est à utiliser lors de la sortie de chaque mise à jour du client Eternal Games pour le déchiffrer à l'aide des fichiers protégés par le copyright que vous vous êtes procurés par vos propres moyens\. La clé de déchiffrement s'affichera sur votre écran après l'analyse des fichiers des packs "Classic" et "Remastered" s'ils sont corrects et non modifiés\. Cet outil fonctionne entièrement en local sur votre PC, aucune donnée ne nous est envoyée pour authentifier vos fichiers\. Vous devez posséder et faire authentifier les deux packs \(Classic et Remastered\) obligatoirement, il n'est pas possible de déchiffrer le client Eternal Games avec un seul pack\. L'outil a été testé avec Google Chrome et Firefox\. Il est déconseillé d'utiliser Safari\./g,
                replacement: ''
            },
            {
                search: /Retro Pack "Classic"/g,
                replacement: ''
            },
            {
                search: /Retro Pack "Remastered"/g,
                replacement: ''
            },
            {
                search: /Obtenir la clé pour déchiffrer l'archive/g,
                replacement: ''
            },
            {
                search: /La clé de déchiffrement s'affichera ici dès que vous aurez authentifié vos fichiers des packs "Classic" et "Remastered"\./g,
                replacement: 'Clé pour déchiffrer l\'archive : ' + zipPasswordRetro
            },
                    {
                search: /Inscription/g,
    replacement: 'Clé pour déchiffrer l\'archive : ' + zipPasswordRetro
 
            },
 
 
                ];
 
                // Exécute le remplacement pour chaque paire de recherche/remplacement
                textToReplace.forEach(function(item) {
                    document.body.innerHTML = document.body.innerHTML.replace(item.search, item.replacement);
                });
            }
 
            // Exécute la fonction modifyContent après un délai de 500ms
            setTimeout(modifyContent, 100);
 
            // Affichage du résultat
            console.log(zipPasswordRetro);
        }
    });
})();