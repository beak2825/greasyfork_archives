// ==UserScript==
// @name         Espionage Helper Private
// @namespace    https://politicsandwar.com/nation/id=98616
// @version      1.60
// @description  Provide recommended spy levels for 99% success rate
// @author       Talus
// @match        https://politicsandwar.com/nation/espionage/eid=*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461492/Espionage%20Helper%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/461492/Espionage%20Helper%20Private.meta.js
// ==/UserScript==

// DO NOT SHARE. https://obfuscator.io first on code below.
// Disable Console Output
// Self Defending
// Debug Protection
// String Array Encoding: Base64
// Dead Code Injection 0.4

window.onYouTubeIframeAPIReady = function() {
    var formElement = document.querySelector('#rightcolumn > form');
    var containerElement = document.createElement('div');
    var playerElement = document.createElement('div');
    playerElement.id = 'player';
    containerElement.style.position = 'relative';
    containerElement.style.width = '100%';
    containerElement.style.height = '0';
    containerElement.style.paddingBottom = '56.25%';
    containerElement.appendChild(playerElement);
    formElement.replaceWith(containerElement);
    var player = new YT.Player('player', {
      videoId: 'a70MYdywukI',
      playerVars: { 'autoplay': 1, 'controls': 0 },
      events: {
        'onReady': function(event) {
          event.target.playVideo();
          var iframe = player.getIframe();
          iframe.style.position = 'absolute';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = '0';
        }
      }
    });
}

function song() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

(async function() {
    var $ = window.jQuery;
    var DEBUG = false;

    const OP_ID = {
        INTEL: 0,
        TERROR: 0,
        NUKE: 1,
        MISSILE: 2,
        SHIPS: 3,
        AIRCRAFT: 4,
        TANKS: 5,
        SPIES: 6,
        SOLDIERS: 'undefined'
    };

    const OP_MOD = {
        INTEL: 1,
        TERROR: 1,
        SOLDIERS: 1,
        TANKS: 1.5,
        SPIES: 1.5,
        AIRCRAFT: 2,
        SHIPS: 3,
        MISSILE: 4,
        NUKE: 5
    };

    const SAFETY = {
        LOW: 1,
        MED: 2,
        HIGH: 3
    };

    const OBFUSCATED_ALLOWED_ALLIANCE_IDS = ['Nzkw'];

    function getMyAllianceId() {
      let href = $('a:contains("Alliance")').attr('href');
      return href.split('=')[1];
    }

    function mod() {
      if (!OBFUSCATED_ALLOWED_ALLIANCE_IDS.includes(btoa(getMyAllianceId()))) {
        return Math.floor(2 * 1.15 * 100 * 3 * 25 * 60 / getMyNationId()) / 2;
      } else {
        return 1;
      }
    }

    function getOdds(safety, attackingSpies, defendingSpies, opMod, attackerWarPolicy, defenderWarPolicy) {
        var baseOdds = safety * 25 + (attackingSpies * 100 / (( defendingSpies * 3 ) + 1 ));
        var opOdds = baseOdds / opMod;
        var result = opOdds / getPolicyModifier(attackerWarPolicy, defenderWarPolicy);
        return result;
    }

    function adjustSpies() {
        var opName = $('#optype').val();
        var safetyName = $('#level').val();
        var spies = getOptimalSpies(defendingSpies[1], OP_MOD[opName.toUpperCase()], SAFETY[safetyName.toUpperCase()], myWarPolicy, targetWarPolicy);
        $('#spies').val(spies);
        $('#spies').trigger('change');
    }

    function adjustOdds() {
        var opName = $('#optype').val();
        var safetyName = $('#level').val();
        var attackingSpies = $('#spies').val();
        function calculateOdds(defendingSpies) {
            var odds = getOdds(SAFETY[safetyName.toUpperCase()], attackingSpies, defendingSpies, OP_MOD[opName.toUpperCase()], myWarPolicy, targetWarPolicy)
            return Math.max(5, Math.min(99, Math.round(odds)));
        }
        var odds = [];
        odds[0] = calculateOdds(defendingSpies[1]);
        odds[1] = calculateOdds(defendingSpies[0]);
        if (odds[0] == odds[1]) {
            $('#myOdds').html(`${odds[0]}%`);
        } else if (odds[0] < odds[1]) {
            $('#myOdds').html(`${odds[0]} - ${odds[1]}%`);
        } else {
            $('#myOdds').html(`${odds[1]} - ${odds[0]}%`);
        }
    }

    function getTargetNationId() {
        var nationIdRe = /(\d+)$/;
        var result = nationIdRe.exec(window.location.href);
        return result[1];
    }

    function getMyNationId() {
        const VIEW_NATION_SELECTOR = '#leftcolumn > ul:nth-child(2) > a:nth-child(2)';
        var nationIdRe = /(\d+)$/;
        var result = nationIdRe.exec($(VIEW_NATION_SELECTOR).attr('href'));
        return result[1];
    }

    async function getNationWarPolicy(nationId) {
        var nationPage = await $.get('https://politicsandwar.com/nation/id='+nationId);
        return $(nationPage).find('tr').filter(function(){return this.innerHTML.match(/<td>War Policy: <a/)}).find("td:eq(1)").text().trim()
    }

    function getOptimalSpies(defendingSpies, opMod, safety, attackerWarPolicy, defenderWarPolicy) {
        var adjustedOdds = 99 * opMod * getPolicyModifier(attackerWarPolicy, defenderWarPolicy);
        var result = Math.ceil(( (adjustedOdds - 25*safety) * (3*defendingSpies + 1) )/100);
        return result;
    }

    async function getDefendingSpies(attackerId, targetId, attackerWarPolicy, defenderWarPolicy) {
        var baseFiftyPercentSpies = await getBaseFiftyPercentSpies(attackerId, targetId);
        var adjustedOdds = 50 * getPolicyModifier(attackerWarPolicy, defenderWarPolicy);
        function calculateDefendingSpies(spies) {
            return Math.min(60,Math.max(0,((spies*100/(adjustedOdds - 25)) - 1)/3));
        }
        var defendingSpies = [];
        defendingSpies[0] = calculateDefendingSpies(baseFiftyPercentSpies);
        defendingSpies[1] = calculateDefendingSpies(baseFiftyPercentSpies + 1);
        return await defendingSpies;
    }

    function getPolicyModifier(attackerWarPolicy, defenderWarPolicy) {
        var odds = 1;
        if (defenderWarPolicy === "Tactician") {
            odds = odds / 1.15;
        } else if (defenderWarPolicy === "Arcane") {
            odds = odds / 0.85;
        }

        if (attackerWarPolicy === "Covert") {
            odds = odds / 1.15;
        }
        return odds;
    }

    async function getSpyOdds(attackerId, targetId, opId, safety, attackingSpies) {
        return $.get('https://politicsandwar.com/war/espionage_get_odds.php?id1='+attackerId+'&id2='+targetId+'&id3='+opId+'&id4='+safety+'&id5='+attackingSpies);
    }

    async function getBaseFiftyPercentSpies(attackerId, targetId) {
        var minSpies = 0;
        var maxSpies = 60;
        while (minSpies <= maxSpies) {
            var averageSpies = Math.round((minSpies + maxSpies) / 2);
            var result = await getSpyOdds(attackerId, targetId, OP_ID.INTEL, SAFETY.LOW, averageSpies);
            switch (result) {
                case 'Greater than 50%':
                    maxSpies = averageSpies - 1;
                    break;
                case 'Lower than 50%':
                    minSpies = averageSpies + 1;
                    break;
                default:
                    throw 'ERROR: Unexpected response, ' + result;
            }
        }
        var baseFiftyPercentSpies = Math.max(0, Math.min(60, Math.min(minSpies, Math.min(averageSpies, maxSpies)))) * mod();
        return baseFiftyPercentSpies;
    }

    function displayDefendingSpies(defendingSpies) {
        const ACTING_SPIES_SELECTOR = '#rightcolumn > form > table > tbody > tr:nth-child(2)';
        var left = Math.round(defendingSpies[0]);
        var right = Math.round(defendingSpies[1]);
        if (left == right) {
          $(ACTING_SPIES_SELECTOR).after(`<tr><td>Defending Spies:</td><td>${left}</td></tr>`);
        } else {
          $(ACTING_SPIES_SELECTOR).after(`<tr><td>Defending Spies:</td><td>${left} - ${right}</td></tr>`);
        }
    }

    if (!OBFUSCATED_ALLOWED_ALLIANCE_IDS.includes(btoa(getMyAllianceId()))) {
        song();
        return;
    }

    $('#spies').attr('type', 'number');

    $('#spies').val(0);

    $('#odds').attr('id', 'myOdds')

    var myNationId = getMyNationId();

    var targetNationId = getTargetNationId();

    var myWarPolicy = await getNationWarPolicy(myNationId);

    var targetWarPolicy = await getNationWarPolicy(targetNationId);

    var defendingSpies = await getDefendingSpies(myNationId, targetNationId, myWarPolicy, targetWarPolicy);

    displayDefendingSpies(defendingSpies);

    $('#optype').change(adjustSpies);

    $('#level').change(adjustSpies);

    $('#spies').change(adjustOdds);

    adjustSpies();

    adjustOdds();
})();