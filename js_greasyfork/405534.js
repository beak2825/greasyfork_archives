// ==UserScript==
// @name         Ro-Bot
// @namespace    sff-reviews
// @version      1.3.1
// @description  Queue watcher for the Reopen Queue
// @author       amflare
// @match        https://scifi.stackexchange.com/review/reopen*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/405534/Ro-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/405534/Ro-Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

//=== INIT ===//
    console.info('Ro-Bot: Active');

    Notification.requestPermission();

    const SEC = 1000;
    const MIN = 60 * SEC;
    const ICON = $('link[rel="shortcut icon"]')[0].href;
    const SITE = window.location.host;
    const CONFIG_NAME = 'config_robot'

    let config = Object.assign({
        rate: 30,
        wait: 3
    }, GM_getValue(CONFIG_NAME));


//-- PAGE WATCHER
    setTimeout(() => {
        // check if we are on a completed review
        if (!$('.review-status').text().includes('Review completed')) {
            // check if we are on an uncompleted review
            if (/(\d+$)/.test(window.location.pathname)) {
                roBot();
            } // check if we are lurking in the review queue
            else if (!(/history$/.test(window.location.pathname))) {
                canary();
                createSidebar();
            }
        }
    }, 1 * SEC);

    function canary() {
        console.info('Setting Canary interval at ' + config.rate + ' seconds');
        let interval = setInterval(() => {
            console.info('Checking Canary...')
            $.get("https://" + SITE + "/topbar/review", function (html, t, j) {
                if (j.status !== 200) {
                    errorMsg('There has been a problem with Ro-Bot. Please refresh the page to fix.');
                    clearInterval(interval);
                    return;
                }
                let quickDom = $('<quickDom>').append($.parseHTML(html));
                let roCanary = $('li.-item a[href*="reopen"]', quickDom)

                if ($(roCanary).parent().hasClass('danger-urgent') || $(roCanary).parent().hasClass('danger-active')) {
                    console.info('Found RO. Reloading...');
                    window.location.reload();
                }
            });
        }, config.rate * SEC);
    }

    function roBot() {
        //-- NOTIFICATION
        console.info('Attempting Notification...');
        notifyMe('Reopen');

        //-- WAIT
        console.info('Setting timer for ' + config.wait + ' minutes')
        setInterval(function () {
            //-- HISTORY CHECK
            console.info('Checking History...');
            let roID = window.location.pathname.match(/(\d+)$/)[0];
            let leaveClosed = 0;
            let voteToReopen = 0;
            $.get("https://" + SITE + "/review/reopen/history", function (html, t, j) {
                if (j.status !== 200) {
                    errorMsg('There has been a problem with Ro-Bot. Please refresh the page to fix.');
                    return;
                }
                //--TALLY VOTES
                let quickDom = $('<quickDom>').append($.parseHTML(html));
                $('#content table tr td:nth-child(3)', quickDom).each(function () {
                    console.info('Checking for ID(' + roID + '): ' + $('a', this).attr('href'));
                    console.info('Result: ' + $('a', this).attr('href').includes(roID));
                    if (!$('a', this).attr('href').includes(roID)) {
                        console.info('End of Human interaction with ID(' + roID + ')');
                        return false
                    }

                    if ($(this).text().trim() === 'Leave Closed') {
                        leaveClosed++;
                    }
                    if ($(this).text().trim() === 'Reopen') {
                        voteToReopen++;
                    }
                });
                console.info('Leave Closed: ' + leaveClosed);
                console.info('Reopen: ' + voteToReopen);

                //-- PREFORM ACTION
                if (leaveClosed + voteToReopen === 0) {
                    console.info('Recommending: Wait');
                    console.info('Waiting for Human Vote...');
                } else {
                    console.info('Recommending: ' + (leaveClosed >= voteToReopen ? 'Leave Closed' : 'Reopen'));
                    if (leaveClosed >= voteToReopen) {
                        console.info('Clicking Leave Closed...');
                        $('label[for="review-action-LeaveClosed"]')[0].click();
                    } else {
                        console.info('Clicking Reopen...');
                        $('label[for="review-action-Reopen"]')[0].click();
                        setTimeout(() => {
                            console.info('Confirming Reopen...');
                            $('.js-ok-button')[0].click();
                        }, 1 * SEC);
                    }
                    setTimeout(() => {
                        console.info('Submitting...');
                        $('.js-review-submit')[0].click();
                    }, 1 * SEC);
                    setTimeout(() => {
                        console.info('Returning to Queue...');
                        window.location.href = 'https://' + SITE + '/review/reopen';
                    }, 10 * SEC);
                }
            });
        }, config.wait * MIN);
    }

//=== SIDEBAR ===//
    function createSidebar() {
        let html = `<div style="display:grid;grid-template-columns:1fr 1fr;">
          <div>
          <strong>Canary Check</strong>
          <p>
            <input type="number" class="ro-config" name="ro-rate" id="ro-rate" style="width:50px;padding:5px;">
            <label for="ro-rate">Seconds</label>
          </p>
          </div>
          <div>
          <strong>Ro-Bot Wait</strong>
          <p>
            <input type="number" class="ro-config" name="ro-wait" id="ro-wait" style="width:50px;padding:5px;">
            <label for="ro-wait">Minutes</label>
          </p>
          </div>
        </div>
        <span class="ro-alert" style="color:darkred;font-size:8px; display:none;cursor:pointer;" onclick="window.location.reload()">Change will take effect on reload</span>`;

        $('.js-review-post-author-guidance-container').html(html);
        updateSidebar();
    }

    function updateSidebar() {
        $('#ro-rate').val(config.rate);
        $('#ro-wait').val(config.wait);
    }

//=== UTILITIES ===//
    function updateConfig() {
        console.info('Updating config...')
        config.rate = Math.max($('#ro-rate').val(), 10);
        config.wait = Math.max($('#ro-wait').val(), 3);

        $('.ro-alert').css('display', 'inline');
        saveConfig();
    }

    function saveConfig() {
        updateSidebar();
        GM_setValue(CONFIG_NAME, config);
    }

    function notifyMe(msg) {
        if (!Notification) {
            errorMsg('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        } else {
            let n = new Notification(msg, {
                icon: ICON,
                tag: 'sffreviews',
                renotify: true
            });

            n.onclick = function () {
                window.parent.parent.focus();
                this.close();
            };

            n.onerror = function () {
                clearInterval(interval);
                errorMsg('There has been a problem with Review Notifications. Please refresh the page to fix.');
            }

            setTimeout(n.close.bind(n), 5 * SEC);
        }
    }

    function errorMsg(msg) {
        $('.review-page').prepend('<div id="overlay-header" style="display: block; opacity: 1;">' + msg + '<br><a class="close-overlay">close this message</a></div>')
    }

//=== EVENT LISTENERS ===//
    $('body.review-task-page').on('change', '.ro-config', updateConfig);
})();