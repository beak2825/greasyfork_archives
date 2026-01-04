// ==UserScript==
// @name            MirkOgame Premium
// @description     Game supports on MirkOgame.pl
// @description:pl  Wsparcie w graniu na MirkOgame.pl
// @version         0.0.666
// @include         http*://*.mirkogame.pl/*
// @include         http*://*.mirkogame.pl
// @include         http*://mirkogame.pl/*
// @include         http*://mirkogame.pl
// @include         http*://*.google.com/recaptcha/*
// @run-at          document-body
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.deleteValue
// @namespace       https://greasyfork.org/users/702942
// @downloadURL https://update.greasyfork.org/scripts/415756/MirkOgame%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/415756/MirkOgame%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Static
    const siteAddress = window.location.href;
    const gameAddress = "mirkogame.pl"

    // States
    var idle = 0;
    var focused = false;

    // Business logic
    function isCaptchaPage() {
        var isCaptcha = siteAddress.indexOf('google.com/recaptcha') > -1
        var parentAddress = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
        return isCaptcha && isLoginPage(parentAddress)
    }

    function isLoginPage(url) {
        url = url || siteAddress
        return url.match(/mirkogame\.pl([/]*(|index\.php((?!([?&]page[^&]*)).)*|))?(#.*)*$/i)
    }

    function isGamePage(name, url) {
         url = url || siteAddress
         var matcher = new RegExp('mirkogame\.pl\/game\.php([?&]'+ (name ? 'page=' + name : '[^&]') + '+)*(#.*)*$', 'i')
         var matches = url.match(matcher) || (name && name.toLowerCase() == 'overview' && url.match(/mirkogame\.pl(\/|\/game\.php((?!([?&]page[^&]*)).)*|)(#.*)*$/i))
         return matches
    }

    function refreshPage() {
        window.location.reload(true)
    }

    function redirectTo(page) {
        window.location.href = siteAddress.replace(/\/game.php.*/i, '/') + 'game.php?page=' + page
    }

    function needFocus() {
        if (focused) {
            return true
        }

        beep()
    }

    // Timer
    async function addTimer(id, notifyTimestamp, endTimestamp, description) {
        var timers = await GM.getValue('timers', {})
        var timer = timers[id]
        var exists = !!timer
        var changes = !exists || timer.endTimestamp != endTimestamp

        if (!exists || changes) {
            if (exists && changes) {
                notifyTimestamp = endTimestamp - (timer.endTimestamp - (timer.notifyTimestamp || timer.endTimestamp))
            }

            timers[id] = {id: id, notifyTimestamp: notifyTimestamp, endTimestamp: endTimestamp, description: description, executed: false}

            if (!exists) {
                log('Add timer on ' + notifyTimestamp + ' for: ' + description)
            } else {
                log('Changed timestamp for saved previously fleet')
            }

            return GM.setValue('timers', timers)
        }
    }

    async function removeTimer(id) {
        var timers = await GM.getValue('timers', {})
        var timer = timers[id]
        var exists = !!timer

        if (exists) {
            delete timers[id]
            log('Remove timer on ' + timer.timestamp + ' for: ' + timer.description)

            return GM.setValue('timers', timers)
        }
    }

    function removeTimers() {
        return GM.setValue('timers', {})
    }

    async function executeTimer(id) {
        var timers = await GM.getValue('timers', {})
        var timer = timers[id]
        if (timer && !timer.executed) {
            timer.executed = true
            GM.setValue('timers', timers)

            var timerInterval = setInterval(() => beep(), 3000)

            var block = document.createElement('div')
            block.style.position = 'fixed'
            block.style.width = '500px'
            block.style.height = '100px'
            block.style.top = 'calc(50vh - 50px)'
            block.style.left = 'calc(50vw - 257px)'
            block.style.textAlign = 'center'
            block.style.background = 'rgba(40,56,95,.95)'
            block.style.border = '2px solid #000'
            block.innerHTML = '<div style="font-size: 3em; font-weight: bolder; padding: 1em">Timer!</div><div style="float: none; margin: 0 auto;">' + timer.description + '</div>'

            var closeButton = document.createElement('a')
            closeButton.style = 'font-size: 2em; font-weight: bolder; position: absolute; top: 0.1em; right: 0.1em;'
            closeButton.innerHTML = '×'
            closeButton.addEventListener('click', async () => {
                await removeTimer(id)
                await refreshTimers()
                clearInterval(timerInterval)
                block.parentNode.removeChild(block)
            })

            block.appendChild(closeButton)
            document.getElementsByTagName('body')[0].appendChild(block)

            fixTooltips()
        }
    }

    async function executeTimers() {
        var currentTimestamp = serverTime ? Math.floor(serverTime.getTime() / 1000) : Math.floor(Date.now() / 1000)
        var timers = await GM.getValue('timers', {})
        for (var id in timers) {
            var timer = timers[id]
            if (timer) {
                var timerTimestamp = timer.notifyTimestamp || timer.endTimestamp
                if (currentTimestamp >= timerTimestamp) {
                    executeTimer(id)
                }
            }
        }
    }

    async function unlockTimers() {
        // Unlock timers
        var timers = await GM.getValue('timers', {})
        for (var id in timers) {
            var timer = timers[id]
            if (timer) {
                timer.executed = false
            }
        }
        return GM.setValue('timers', timers)
    }

    async function refreshTimers() {
        document.querySelectorAll('#content table div.fleets').forEach(async (fleet) => {
            var time = parseInt(fleet.getAttribute('data-fleet-end-time') || '0', 10)
            var description = fleet.parentNode.parentNode.children[1].children[0].innerHTML
            var elementId = fleet.getAttribute('id') + '_timer'

            // Remove old timer
            var oldTimer = document.getElementById(elementId)
            if (oldTimer) {
                oldTimer.parentNode.removeChild(oldTimer)
            }

            // Insert new timer
            fleet.insertAdjacentElement("afterend", await generateFleetTimer(elementId, hashCode(description), time, description))
        })
    }

    // Pages
    async function pageOtherGamePageHandler() {
        var idleCheck = setInterval(() => {
            if (idle >= 120) {
                clearInterval(idleCheck)

                log('Change to overview to control flights, due to detected inactive...')
                redirectTo('overview')
            }
        }, 1000)
    }

    async function pageOverviewHandler() {
        const refreshTime = getRandomInt(90, 120)

        setInterval(() => {
            debug('Checking flights...')
            if (document.getElementsByClassName('flight attack').length > 0 ||
                document.getElementsByClassName('flight espionage').length > 0) {
                needFocus()

                log('Found attack or espionage flight!')
            }
        }, 3000);

        setTimeout(() => refreshTimers(), 100)

        setTimeout(() => {
            debug('Refresh overview...')
            refreshPage()
        }, refreshTime * 1000)
    }

    async function pageLoginHandler() {
        var canLogin = false

        // Wait 15s and notify focus needs for log in by user
        setTimeout(() => setInterval(() => needFocus(), 3000), 15000)

        // Waiting on resolving captcha
        setTimeout(() => {
            if (document.getElementsByClassName('g-recaptcha').length > 0) {
                debug('Found captcha system...')

                var solveCheck = setInterval(function() {
                    if (grecaptcha.getResponse().length > 0) {
                        clearInterval(solveCheck);
                        canLogin = true
                        debug('Captcha resolved')
                    }
                }, 1000);
            } else {
                canLogin = true
            }
        }, 3000)

        // Waiting on possibility to autologin
        var canLoginCheck = setInterval(async () => {
            if (canLogin) {
                clearInterval(canLoginCheck)

                var usernameField = document.getElementById('username')
                var hasUsername = usernameField.value.length > 0
                if (!hasUsername) {
                    const username = await GM.getValue('username')
                    if (username) {
                        usernameField.value = username
                    }
                } else {
                    hasUsername = true
                }

                var passwordField = document.getElementById('password')
                var hasPassword = passwordField.value.length > 0
                if (!hasPassword) {
                    const password = await GM.getValue('password')
                    if (password) {
                        passwordField.value = password
                    }
                } else {
                    hasPassword = true
                }

                // Do Login!
                var autoLoginCheck = setInterval(() => {
                    if (hasUsername && hasPassword) {
                        clearInterval(autoLoginCheck)

                        var forms = document.forms;
                        for (var i = 0; i < forms.length; i++) {
                            if (forms[i].innerHTML.indexOf('google.com/recaptcha') > -1) {
                                var form = forms[i]
                                form.submit()
                            }
                        }
                    }
                }, 1000)
                }
        }, 1000)
    }

    function pageCaptchaHandler() {
        var captchaCheck = setInterval(() => {
            if (document.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
                clearInterval(captchaCheck);
                document.querySelector('.recaptcha-checkbox-checkmark').click();
            }
        }, 3000);
    }


    // Main
    (async function main() {
        // Install timers
        if (!isCaptchaPage()) {
            unlockTimers()

            // Timers interval
            setInterval(async () => executeTimers(), 1000)
        }

        if (isCaptchaPage()) {
            debug('Detected captcha frame...')
            pageCaptchaHandler()
        } else if (isLoginPage()) {
            debug('Detected login page...')
            pageLoginHandler()
        } else if (isGamePage('overview')) {
            debug('Detected overview page...')
            pageOverviewHandler()
        } else if (isGamePage('fleetTable')) {
            debug('Detected fleet page...')
        } else if (isGamePage()) {
            debug('Detected other game page...')
            pageOtherGamePageHandler()
        }
    })();

    // Tools
    async function generateFleetTimer(elementId, id, timestamp, description, oldFrame) {
        var timers = await GM.getValue('timers', {})
        var timer = timers[id]

        // Cleanup old frame
        if (oldFrame) {
            oldFrame.innerHTML = ''
        }

        var frame = oldFrame || document.createElement('div')
        frame.setAttribute('id', elementId)
        frame.setAttribute('style', 'display:inline; float:left; margin:-1.3em 0;')

        var button = document.createElement('a')
        button.style.fontWeight = 'bolder'
        button.innerHTML = "🕑"

        if (!timer) {
            // Signal
            button.addEventListener('click', async () => {
                await addTimer(id, timestamp, timestamp, description)

                // Generate new button
                await generateFleetTimer(elementId, id, timestamp, description, frame)
            })
        } else {
            button.style.color = 'green'

            // Fix timestamp
            addTimer(id, timestamp, timestamp, description)

            // Signal
            button.addEventListener('click', async () => {
                await removeTimer(id);

                // Generate new button
                await generateFleetTimer(elementId, id, timestamp, description, frame)
            })
        }

        frame.appendChild(button)
        return frame
    }

    async function fixTooltips() {
        $(".tooltip").on({
            mouseenter: function(e) {
                const tip = $('#tooltip');
                tip.html($(this).attr('data-tooltip-content'));
                tip.show();
            },
            mouseleave: function() {
                const tip = $('#tooltip');
                tip.hide();
            },
            mousemove: function(e) {
                const tip = $('#tooltip');
                let mousex = e.pageX + 20;
                let mousey = e.pageY + 20;
                let tipWidth = tip.width();
                let tipHeight = tip.height();
                let tipVisX = $(window).width() - (mousex + tipWidth);
                let tipVisY = $(window).height() - (mousey + tipHeight);
                if (tipVisX < 20) {
                    mousex = e.pageX - tipWidth - 20;
                }
                if (tipVisY < 20) {
                    mousey = e.pageY - tipHeight - 20;
                }
                tip.css({
                    top: mousey,
                    left: mousex
                });
            }
        });
    }

    // Utils
    function debug(message) {
        console.debug('MirkOgame Premium: ' + message)
    }

    function log(message) {
        console.log('MirkOgame Premium: ' + message)
    }

    function beep() {
        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        snd.play();
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomInt(min, max) {
        return Math.floor(getRandom(min, max));
    }

    function hashCode(obj) {
        var str = JSON.stringify(obj)
        if (obj instanceof Node) {
            str = obj.innerHTML
        }
        return str.split("").reduce((a,b) => {
            a = ((a<<5) - a) + b.charCodeAt(0);
            return a & a
        }, 0)
    }

    // Focus & idle detecting
    window.onmousemove = function() {
        focused = true;
        idle = 0
    }

    window.onkeypress = function() {
        focused = true;
        idle = 0
    }

    window.onfocus = function() {
        focused = true;
        idle = 0;
    };

    window.onblur = function() {
        focused = false;
    };

    setInterval(() => { idle += 1 }, 1000)
})();