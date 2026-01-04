// ==UserScript==
// @name         Goulag Mini-jeu
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Un mini-jeu où vous devez casser des cailloux en cliquant dessus.
// @author       ChatGPT feat Monte_Cristo
// @match        https://onche.org/forum/4/goulag
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494907/Goulag%20Mini-jeu.user.js
// @updateURL https://update.greasyfork.org/scripts/494907/Goulag%20Mini-jeu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Charger jQuery et vérifier sa disponibilité
    function addJQuery(callback) {
        var script = document.createElement('script');
        script.setAttribute('src', 'https://code.jquery.com/jquery-3.6.0.min.js');
        script.addEventListener('load', function() {
            var script = document.createElement('script');
            script.textContent = 'window.jQuery = jQuery.noConflict(true); (' + callback.toString() + ')();';
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    // Votre script à exécuter après le chargement de jQuery
    function main() {
        // Attendre que le DOM soit prêt
        window.jQuery(document).ready(function() {
            // Charger les données depuis localStorage
            var rocksBroken = parseInt(localStorage.getItem('rocksBroken') || '0', 10);
            var nextRockThreshold = parseInt(localStorage.getItem('nextRockThreshold') || '3', 10);

            // Création du bouton de pioche
            var pickaxeButton = window.jQuery('<div>')
                .addClass('item')
                .attr('title', 'Lancer le mini-jeu')
                .css({
                    cursor: 'pointer'
                })
                .html('<div class="mdi mdi-pickaxe">⛏️</div>')
                .on('click', function() {
                    window.jQuery('#miniGameOverlay').fadeIn();
                    window.jQuery('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                });

            // Ajouter le bouton après le bouton "Theme"
            window.jQuery('#theme-button').before(pickaxeButton);

            // Création de l'overlay pour le mini-jeu
            var overlay = window.jQuery('<div>')
                .attr('id', 'miniGameOverlay')
                .css({
                    display: 'none',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: '10000',
                    textAlign: 'center',
                    color: 'white'
                });

            var closeButton = window.jQuery('<button>')
                .text('X')
                .css({
                    position: 'absolute',
                    top: '5%',
                    left: '75%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '10001',
                    cursor: 'pointer',
                    fontSize: '20px',
                    background: 'none',
                    border: 'none',
                    color: 'white'
                })
                .on('click', function() {
                    window.jQuery('#miniGameOverlay').fadeOut();
                });

            var counter = window.jQuery('<div>')
                .attr('id', 'rockCounter')
                .text('Cailloux cassés: ' + rocksBroken)
                .css({
                    position: 'absolute',
                    top: '3%',
                    left: '25%',
                    transform: 'translateX(-50%)',
                    fontSize: '20px',
                    zIndex: '10001'
                });

            var rock = window.jQuery('<img>')
                .attr('src', 'https://image.noelshack.com/fichiers/2024/20/2/1715684158-image.png')
                .attr('id', 'rockImage')
                .css({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '35%',
                    cursor: 'pointer'
                });

            var resetButton = window.jQuery('<button>')
                .text('Remettre à zéro')
                .css({
                    position: 'absolute',
                    top: '12%',
                    left: '25%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '10001',
                    cursor: 'pointer',
                    fontSize: '16px',
                    background: 'none',
                    border: '1px solid white',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px'
                })
                .on('click', function() {
                    rocksBroken = 0;
                    nextRockThreshold = 3;
                    localStorage.setItem('rocksBroken', rocksBroken);
                    localStorage.setItem('nextRockThreshold', nextRockThreshold);
                    window.jQuery('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                });

            var rockClicks = 0;

            rock.on('click', function() {
                window.jQuery(this).animate({
                    width: '+=10px'
                }, 100).animate({
                    width: '-=10px'
                }, 100);

                rockClicks++;
                if (rockClicks >= nextRockThreshold) {
                    window.jQuery(this).fadeOut('fast', function() {
                        window.jQuery(this).fadeIn('fast');
                    });
                    rocksBroken++;
                    window.jQuery('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                    nextRockThreshold = Math.floor(nextRockThreshold * 1.4);
                    rockClicks = 0;

                    // Sauvegarder les données dans localStorage
                    localStorage.setItem('rocksBroken', rocksBroken);
                    localStorage.setItem('nextRockThreshold', nextRockThreshold);
                }
            });

            overlay.append(closeButton);
            overlay.append(counter);
            overlay.append(rock);
            overlay.append(resetButton);
            window.jQuery('body').append(overlay);
        });
    }

    // Charger jQuery et exécuter le script principal
    addJQuery(main);
})();
