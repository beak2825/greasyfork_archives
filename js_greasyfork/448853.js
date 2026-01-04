// ==UserScript==
// @name         Surviv.io | Auto start game.
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  inspired by emitwohs
// @icon         https://images-ext-2.discordapp.net/external/ABiWTylC0rumeHGESrIzPlK8ujd_DJ_FYA8hcaUgkDU/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/816845308142682192/68c22e8cdd3546cdf159cb4e552bba52.png
// @author       sk
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @match        https://surviv.io/*
// @match        https://surviv2.io/*
// @match        https://2dbattleroyale.com/*
// @match        https://2dbattleroyale.org/*
// @match        https://piearesquared.info/*
// @match        https://thecircleisclosing.com/*
// @match        https://secantsecant.com/*
// @match        https://parmainitiative.com/*
// @match        https://ot38.club/*
// @match        https://drchandlertallow.com/*
// @match        https://rarepotato.com/*
// @match        https://archimedesofsyracuse.info/*
// @match        https://nevelskoygroup.com/*
// @match        https://kugahi.com/*
// @match        https://kugaheavyindustry.com/*
// @match        https://chandlertallowmd.com/*
// @downloadURL https://update.greasyfork.org/scripts/448853/Survivio%20%7C%20Auto%20start%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/448853/Survivio%20%7C%20Auto%20start%20game.meta.js
// ==/UserScript==

GM_addStyle(`
.skallwaysshow {
  display:block!important;
  opacity:1!important;
}
#start-row-header {
  top:70px!important;
}
`);

// re-style server warning
document.querySelector('#start-row-top').classList.add('center-start-row');
document.getElementById('server-warning').style = "height:fit-content;line-height:20px;background-image: linear-gradient(to right, rgba(112, 210, 36, 0.7), rgba(50, 168, 82, 0.7), rgba(0, 255, 255, 0.7));width: 500px;padding: 30px;border-radius: 20px;top: 170px!important;font-size: 20px;color: #fff;";
document.getElementById('server-warning').innerHTML = "Press the \"Scout!\" button at top right corner to start scouting.";
document.getElementById('server-warning').classList.add('skallwaysshow');

// banana
var abort = true;
document.getElementById('modal-support').remove();
var mm = function() {
    document.getElementById('btn-support').innerHTML = 'Scout!'
    document.getElementById('btn-support').style = 'background: #7a7a7a!important;border-bottom: 2px solid #3e3e3e!important; box-shadow: inset 0 -2px #3e3e3e!important;';
    if (document.getElementById('sk_support') !== null) {
        document.getElementById('sk_support').innerHTML = 'Scout!';
        document.getElementById('sk_support').style = 'background: #222222!important;border-bottom: 4px solid #111111!important; box-shadow: none!important;';
    }
}
var nn = function() {
    document.getElementById('btn-support').innerHTML = 'Abort!'
    document.getElementById('btn-support').style = 'background: #cd3232!important;border-bottom: 2px solid #781e0a!important; box-shadow: inset 0 -2px #781e0a!important;';
    if (document.getElementById('sk_support') !== null) {
        document.getElementById('sk_support').innerHTML = 'Abort!';
        document.getElementById('sk_support').style = 'background: #cd3232!important;border-bottom: 4px solid #781e0a!important; box-shadow: none!important;';
    }
}
mm();
document.getElementById('btn-support').onclick = function() {
    if (abort) {
        nn();
        abort = false;
        var y = document.querySelectorAll('#server-opts')[1].querySelectorAll('option')[0].innerHTML.slice(9),
            isDisplay = document.getElementById('team-menu').style.display,
            mode = document.querySelector('#index-play-mode-selected').dataset.l10n,
            modeTeam = document.getElementById('index-play-mode-selected-team').dataset.l10n,
            type = document.querySelector('#index-play-type-selected').dataset.l10n,
            typeTeam = document.getElementById('index-play-type-selected-team').dataset.l10n,
            zone = [];

        if (y === 'North America') {
            y = 'na'
            zone.push("nyc", "sfo", "chi")
        } else if (y === 'South America') {
            y = 'sa'
            zone.push('sao')
        } else if (y === 'Europe') {
            y = 'eu'
            zone.push("waw", "fra");
        } else if (y === 'Asia') {
            y = 'as'
            zone.push('sgp')
        } else if (y === 'South Korea') {
            y = 'kr'
            zone.push('sel')
        };

        if (isDisplay == "none") {
            if ((mode === 'index-play-mode-main') && (type === 'index-play-type-1')) {
                mode = 0;
            } else if ((mode === 'index-play-mode-main') && (type === 'index-play-type-2')) {
                mode = 1;
            } else if ((mode === 'index-play-mode-main') && (type === 'index-play-type-4')) {
                mode = 2;
            } else if (mode !== 'index-play-mode-main') {
                mode = 3 //document.getElementById('btn-change-mode-selection').querySelectorAll('.right-play-btn')[1].dataset.l10n;
            }
        } else {
            if ((modeTeam === 'index-play-mode-main') && (typeTeam === 'index-play-type-2')) {
                mode = 1;
            } else if ((modeTeam === 'index-play-mode-main') && (typeTeam === 'index-play-type-4')) {
                mode = 2;
            } else if (modeTeam !== 'index-play-mode-main') {
                mode = 3 //document.getElementById('btn-change-mode-selection').querySelectorAll('.right-play-btn')[1].dataset.l10n;
            }
        }

        // auto start game
        var i = 0,
            s = false,
            previous = [],
            startTime,
            endTime;

        var x = JSON.parse(`
    {
      "version": 131,
      "region": "",
      "zones": "",
      "playerCount": 0,
      "autoFill": true,
      "gameModeIdx": "",
      "isMobile": false,
      "adminCreate": false,
      "privCode": false
    }
`);
        x.region = y;
        x.zones = zone;
        x.gameModeIdx = mode;

        next();
        startTime = new Date();
        function next() {
            if (!abort) {
                if (s) {
                    abort = false
                    mm();
                    clearTimeout(interval);
                    return;
                }
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://surviv.io/api/find_game');
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                xhr.onload = function() {
                    previous.push(JSON.parse(xhr.responseText).res[0].gameId);
                    console.info(xhr.responseText)
                    if (previous.at(-1) != previous[0]) {
                        if (document.getElementById('team-menu').style.display == 'block') {document.getElementById("btn-start-team").click()}
                        else {document.getElementById('btn-start-battle').click();}
                        s = true;
                        abort = true;
                        mm();
                        document.getElementById('server-warning').innerHTML = 'New lobby is found!\nID: ' + JSON.parse(xhr.responseText).res[0].gameId;
                    };
                    endTime = new Date();
                    var timeDiff = endTime - startTime;
                    timeDiff /= 1000;
                    var seconds = timeDiff.toFixed(2);
                    document.getElementById('server-warning').innerHTML = `Scouting...<br>Time elapsed: ${seconds} seconds<br>Press the "Abort!" at top right corner to abort.<br>Do not change region or mode while scouting!`
                };
                xhr.send(JSON.stringify(x));
                i++;
                var interval = setTimeout(next, 750);
            }
        }
    } else {
        abort = true;
        mm();
        document.getElementById('server-warning').innerHTML = `Aborted!<br>Press the "Scout!" button at top right corner to start scouting.`
    }
}