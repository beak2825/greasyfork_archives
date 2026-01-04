// ==UserScript==
// @name         Goulag Mini-jeu - New
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Un mini-jeu où vous devez casser des cailloux en cliquant dessus. Bonus multiplicateurs et malus inclus !
// @author       ChatGPT feat Monte_Cristo
// @match        https://onche.org/forum/4/goulag
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539281/Goulag%20Mini-jeu%20-%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/539281/Goulag%20Mini-jeu%20-%20New.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    function main() {
        window.jQuery(document).ready(function() {
            var rocksBroken = parseInt(localStorage.getItem('rocksBroken') || '0', 10);
            var nextRockThreshold = parseFloat(localStorage.getItem('nextRockThreshold') || '3');
            var rockClicks = 0;
            var multipliers = [];
            var originalRockSrc = 'https://cloud.onche.org/74aa8730-f8aa-43a1-b216-364886eac580!OdsGr4euQV/default';
            var waveRockSrc = 'https://cloud.onche.org/c909de24-aecb-421f-8be6-823431529fad!NUYK3nnw5R';
            var rainMalusSrc = 'https://cloud.onche.org/414a7b7a-a383-4e18-82e2-f35555fed1c8!MNJjIKHQmv';
            var rainItems = [
                'https://cloud.onche.org/0fa53ac0-72a5-4609-bddd-bc966c2e60c1!fQCEmHjoM2',
                'https://cloud.onche.org/bf68281c-0439-4217-b164-4cc58eb281ba!wRldGwgIQe',
                'https://cloud.onche.org/75d3f701-21d1-4ec5-8214-ebcb2a034839!6GXGEbIaJu'
            ];

            const updateMultiplierDisplay = () => {
                const display = multipliers.length > 0 ? multipliers.join(' × ') + ' = x' + multipliers.reduce((a, b) => a * b, 1) : '';
                $('#activeMultiplierDisplay').text(display);
            };

            const getTotalMultiplier = () => multipliers.reduce((a, b) => a * b, 1);

            var pickaxeButton = $('<div>')
                .addClass('item')
                .attr('title', 'Lancer le mini-jeu')
                .css({ cursor: 'pointer' })
                .html('<div class="mdi mdi-pickaxe">⛏️</div>')
                .on('click', function() {
                    $('#miniGameOverlay').fadeIn();
                    $('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                    $('#clickValue').text(Math.ceil(nextRockThreshold - rockClicks));
                });

            $('#theme-button').before(pickaxeButton);

            var overlay = $('<div id="miniGameOverlay">').css({
                display: 'none', position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10000, textAlign: 'center', color: 'white'
            });

            var multiplierDisplay = $('<div id="activeMultiplierDisplay">').css({
                position: 'fixed', bottom: '10px', right: '10px',
                fontSize: '20px', color: 'gold', fontWeight: 'bold',
                zIndex: 10001, animation: 'blinker 1s linear infinite'
            });

            $('<style>')
                .prop('type', 'text/css')
                .html('@keyframes blinker { 50% { opacity: 0; } }')
                .appendTo('head');

            var closeButton = $('<button>X</button>').css({
                position: 'absolute', top: '5%', left: '75%',
                transform: 'translate(-50%, -50%)', zIndex: '10001',
                cursor: 'pointer', fontSize: '20px', background: 'none', border: 'none', color: 'white'
            }).on('click', () => $('#miniGameOverlay').fadeOut());

            var counter = $('<div id="rockCounter">').text('Cailloux cassés: ' + rocksBroken).css({
                position: 'absolute', top: '3%', left: '25%',
                transform: 'translateX(-50%)', fontSize: '20px', zIndex: '10001'
            });

            const clickCountdown = $('<div id="clickCountdown">')
                .html('<div style="width: 150px; text-align: center;">Coups restants : <span id="clickValue">' + Math.ceil(nextRockThreshold - rockClicks) + '</span></div>')
                .css({
                    position: 'absolute', top: '5.5%', left: '25%',
                    transform: 'translateX(-50%)', fontSize: '20px',
                    zIndex: 10001, fontFamily: 'inherit', whiteSpace: 'nowrap'
                });

            var rock = $('<img>')
                .attr('src', originalRockSrc)
                .attr('id', 'rockImage')
                .css({ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '35%', cursor: 'pointer' });

            var resetButton = $('<button>Remettre à zéro</button>').css({
                position: 'absolute', top: '12%', left: '25%', transform: 'translate(-50%, -50%)',
                zIndex: '10001', cursor: 'pointer', fontSize: '16px', background: 'none',
                border: '1px solid white', color: 'white', padding: '10px', borderRadius: '5px'
            }).on('click', function() {
                rocksBroken = 0;
                nextRockThreshold = 3;
                multipliers = [];
                updateMultiplierDisplay();
                localStorage.setItem('rocksBroken', rocksBroken);
                localStorage.setItem('nextRockThreshold', nextRockThreshold);
                $('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                $('#clickCountdown').html('<div style="width: 150px; text-align: center;">Coups restants : <span id="clickValue">' + Math.ceil(nextRockThreshold - rockClicks) + '</span></div>');
            });

            rock.on('mousedown', function () {
                $(this).css('transform', 'translate(-50%, -50%) scale(1.1)');
            }).on('mouseup mouseleave', function () {
                $(this).css('transform', 'translate(-50%, -50%)');
            }).on('click', function () {
                rockClicks += getTotalMultiplier();
                $('#clickValue').text(Math.ceil(nextRockThreshold - rockClicks));
                if (rockClicks >= nextRockThreshold) {
                    $(this).fadeOut('fast').fadeIn('fast');
                    rocksBroken++;
                    nextRockThreshold += 1.5 + rocksBroken * 0.05;
                    rockClicks = 0;
                    localStorage.setItem('rocksBroken', rocksBroken);
                    localStorage.setItem('nextRockThreshold', nextRockThreshold);
                    $('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                    $('#clickValue').text(Math.ceil(nextRockThreshold - rockClicks));
                }
            });

            overlay.append(closeButton, counter, clickCountdown, rock, resetButton, multiplierDisplay);
            $('body').append(overlay);

            function spawnRainEffect() {
                for (let i = 0; i < 100; i++) {
                    const imgSrc = rainItems[Math.floor(Math.random() * rainItems.length)];
                    const img = $('<img>').attr('src', imgSrc).css({
                        position: 'fixed',
                        top: '-10%',
                        left: `${Math.random() * 100}%`,
                        width: '64px',
                        height: '64px',
                        zIndex: 2147483647,
                        animation: `fall ${2 + Math.random() * 3}s linear forwards, spin ${2 + Math.random() * 2}s infinite linear`
                    });
                    $('body').append(img);
                    setTimeout(() => img.remove(), 7000);
                }
            }

            $('<style>')
              .prop('type', 'text/css')
              .html(`@keyframes fall { to { transform: translateY(110vh); } }
                      @keyframes spin { to { transform: rotate(360deg); } }`)
              .appendTo('head');

            function spawnFloatingItem() {
                const isMalus = Math.random() < 0.35;
                const isWave = isMalus && Math.random() < 0.5;
                const isRain = isMalus && !isWave && Math.random() < 0.5;
                const pos = () => `${Math.random() * 90}%`;
                const startX = pos(), startY = pos(), endX = pos(), endY = pos();

                let item;
                if (isRain) {
                    item = $('<img>').attr('src', rainMalusSrc).css({
                        position: 'fixed', top: startY, left: startX,
                        width: '64px', height: '64px', cursor: 'pointer', zIndex: 2147483647,
                        transition: 'top 1s ease-in-out, left 1s ease-in-out'
                    }).on('click', function () {
                        spawnRainEffect();
                        $(this).remove();
                    });
                } else if (isWave) {
                    item = $('<img>').attr('src', waveRockSrc).css({
                        position: 'fixed', top: startY, left: startX,
                        width: '64px', height: '64px', cursor: 'pointer', zIndex: 2147483647,
                        transition: 'top 1s ease-in-out, left 1s ease-in-out'
                    }).on('click', function () {
                        rock.attr('src', waveRockSrc);
                        let count = 0;
                        const waveInterval = setInterval(() => {
                            const dx = (Math.random() - 0.5) * 1600;
                            const dy = (Math.random() - 0.5) * 1200;
                            rock.css('transform', `translate(${dx}px, ${dy}px)`);
                            nextRockThreshold += getTotalMultiplier();
                            $('#clickValue').text(Math.ceil(nextRockThreshold - rockClicks));
                            count++;
                            if (count >= 6) {
                                clearInterval(waveInterval);
                                rock.attr('src', originalRockSrc);
                                rock.css('transform', 'translate(-50%, -50%)');
                            }
                        }, 400);
                        $(this).remove();
                    });
                } else if (isMalus) {
                    const malusValue = [5, 10, 15][Math.floor(Math.random() * 3)];
                    item = $('<div>').text('-' + malusValue).css({
                        position: 'fixed', top: startY, left: startX,
                        fontSize: '50px', fontWeight: 'bold', color: 'red', zIndex: 2147483647, cursor: 'pointer',
                        transition: 'top 1s ease-in-out, left 1s ease-in-out'
                    }).on('click', function () {
                        rocksBroken = Math.max(0, rocksBroken - malusValue);
                        $('#rockCounter').text('Cailloux cassés: ' + rocksBroken);
                        localStorage.setItem('rocksBroken', rocksBroken);
                        $(this).remove();
                    });
                } else {
                    const tiers = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50];
                    const progressFactor = Math.floor(rocksBroken / 10);
                    const maxTier = Math.min(tiers.length, 3 + progressFactor);
                    const chance = Math.random();
                    const x = (chance < 0.01) ? 50 : tiers[Math.floor(Math.random() * maxTier)];

                    item = $('<div>').text('x' + x).css({
                        position: 'fixed', top: startY, left: startX,
                        fontSize: '50px', fontWeight: 'bold', color: 'gold', zIndex: 2147483647, cursor: 'pointer',
                        transition: 'top 1s ease-in-out, left 1s ease-in-out'
                    }).on('click', function () {
                        multipliers.push(x);
                        updateMultiplierDisplay();
                        setTimeout(() => {
                            multipliers.splice(multipliers.indexOf(x), 1);
                            updateMultiplierDisplay();
                        }, 7000);
                        $(this).remove();
                    });
                }

                $('body').append(item);
                requestAnimationFrame(() => item.css({ top: endY, left: endX }));
                setTimeout(() => item.remove(), 1800);
            }

            setInterval(() => {
                if ($('#miniGameOverlay').is(':visible') && Math.random() < 0.3) spawnFloatingItem();
            }, 800);
        });
    }

    addJQuery(main);
})();
