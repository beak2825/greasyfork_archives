// ==UserScript==
// @name        Attacking Page Chain Counter
// @namespace   https://github.com/Vinkuun
// @include     *.torn.com/loader2.php?sid=getInAttack&user2ID=*
// @include     *.torn.com/loader2.php?sid=attackTest
// @version     1.3.1
// @grant       GM_addStyle
// @description Adds the chain counter to the attack page
// @require     https://cdnjs.cloudflare.com/ajax/libs/fetch/1.0.0/fetch.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/30661/Attacking%20Page%20Chain%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/30661/Attacking%20Page%20Chain%20Counter.meta.js
// ==/UserScript==

var chainRefreshTime = 10 * 1000;
var retryCounter = 0;
var MAX_RETRIES = 3;

addChainBarContainer();
updateChain();

function getApiKey(forceNew) {
    return new Promise(function(resolve) {
        if (typeof localStorage.vinkuunApiKey !== 'string' || forceNew === true) {
            resolve(fetchApiKey().then(function(key) {
                return localStorage.vinkuunApiKey = key;
            }));
        } else {
            resolve(localStorage.vinkuunApiKey);
        }
    });
}

function fetchApiKey() {
    return fetch(location.protocol + '//www.torn.com/preferences.php', {
        credentials: 'same-origin'
    })
    .catch(function(err) {
        console.log(err);
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(body) {
        return parseHTML(body).find('#newapi').val();
    });
}

function parseHTML(str) {
    var tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = str;
    return $(tmp.body);
}

function getChainCounter(apiKey) {
    return $.ajax({
        type: 'GET',
        url: 'https://api.torn.com/user?selections=bars&key=' + apiKey,
        dataType: 'json'
    }).then(function(data) {
        if (data.error) {
            retryCounter++;

            if (retryCounter > MAX_RETRIES) {
                $('#vinkuun-chainBar').html('Failed to update chain bar.');
            } else {
                if (data.error.code === 2) {
                    return getApiKey(true).then(getChainCounter);
                } else {
                    return getChainCounter(apiKey);
                }
            }
        }

        retryCounter = 0;

        return data.chain;
    }, function(err) {
        return {};
    });
}

function displayChainCounter(chainInfo) {
    var chainBarHtml = '';

    if (chainInfo.current > 0) {
        var currentMinutes = Math.floor(chainInfo.timeout / 60);
        var currentSeconds = chainInfo.timeout % 60;
        if(currentSeconds <= 9) currentSeconds = "0" + currentSeconds;

        var timeout = currentMinutes + ':' + currentSeconds;

        chainBarHtml = 'Chain: ' + chainInfo.current + '/100 ' + timeout;
    } else {
        chainBarHtml = 'No chain running.';
    }

    $('#vinkuun-chainBar').html(chainBarHtml);

    return chainInfo;
}

function updateChain() {
    getApiKey()
        .then(getChainCounter)
        .then(displayChainCounter)
        .then(function(chainInfo) {
            var chainRefreshTime = 0;

            if (chainInfo.current === 0) {
                chainRefreshTime = 10 * 1000;
            } else {
                chainRefreshTime = 2 * 1000;
            }

            setTimeout(updateChain, chainRefreshTime);
        });
}

function addChainBarContainer() {
    GM_addStyle('#vinkuun-chainBar { font-size: 16px; margin-bottom: 5px }');

    $('#mainContainer').prepend('<div id="vinkuun-chainBar">Loading chain information...</div><hr class="page-head-delimiter">');
}
