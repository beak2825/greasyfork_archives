// ==UserScript==
// @name         Torn City - Special Gym Advisor
// @namespace    AlienZombie.GymAdvisor
// @version      1.0.26
// @description  Monitors Gym stats and advise what is needed to keep special gyms open
// @author       AlienZombie [2176352]
// @include      *.torn.com/gym.php*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @source       https://greasyfork.org/en/scripts/393670-torn-city-special-gym-advisor
// @downloadURL https://update.greasyfork.org/scripts/393670/Torn%20City%20-%20Special%20Gym%20Advisor.user.js
// @updateURL https://update.greasyfork.org/scripts/393670/Torn%20City%20-%20Special%20Gym%20Advisor.meta.js
// ==/UserScript==

// Based off of Torn City - Special Gym Ratios by RGiskard [1953860], assistance by Xiphias [187717]


jQuery.noConflict(true)(document).ready(function($) {
    GM_addStyle(`tr>td {border: 1px solid black !important; width: 100px; text-align: center; padding: 3px !important; background-color: white;} tr>th {border: 1px solid black; padding: 3px; background-color: white;}`);

	var cleanNumber = function(a) {
		return Number(a.replace(/[$,]/g, "").trim());
	};
    
    /**
     * Formats a number into an abbreviated string with an appropriate trailing descriptive unit
     * up to 't' for trillion.
     * @param {float} number the number to be formatted
     * @param {int} maxFractionDigits the maximum number of fractional digits to display
     * @returns a string representing the number, abbreviated if appropriate
     **/
    var FormatAbbreviatedNumber = function(number, maxFractionDigits) {
        var abbreviations = [];
        abbreviations[0] = '';
        abbreviations[1] = 'k';
        abbreviations[2] = 'm';
        abbreviations[3] = 'b';
        abbreviations[4] = 't';

        var outputNumber = number;
        var abbreviationIndex = 0;
        for (; outputNumber >= 1000 && abbreviationIndex < abbreviations.length; ++abbreviationIndex) {
            outputNumber = outputNumber / 1000;
        }

        return outputNumber.toLocaleString('EN', { maximumFractionDigits : maxFractionDigits }) + abbreviations[abbreviationIndex];
    };

	var getStats = function($doc) {
        var ReplaceStatValueAndReturnCleanNumber = function(elementId) {
            var $statTotalElement = $doc.find('#' + elementId);
            if ($statTotalElement.size() === 0) throw 'No element found with id "' + elementId + '".';
            var numericalValue = cleanNumber($statTotalElement.text());
            return numericalValue;
        };
		$doc = $($doc || document);
		return {
			strength: ReplaceStatValueAndReturnCleanNumber('strength-val'),
			defense: ReplaceStatValueAndReturnCleanNumber('defense-val'),
			speed: ReplaceStatValueAndReturnCleanNumber('speed-val'),
			dexterity: ReplaceStatValueAndReturnCleanNumber('dexterity-val'),
		};
	};

    setInterval(getGoing, 500);

	function getGoing() {
        var $gymAdvisor = $('#gymAdvisor');
        if ($gymAdvisor.length) {
            $gymAdvisor.remove();
        }
        
        var tutorialContent = $('div.tutorial-cont');
        if (tutorialContent.is(':hidden')) {
            return;
        }

        var stats = getStats();
        
        var sumStrSpd = stats['strength'] + stats['speed'];
        var sumDefDex = stats['defense'] + stats['dexterity'];
        var quarterStr = stats['strength'] * 1.25;
        var quarterSpd = stats['speed'] * 1.25;
        var quarterDef = stats['defense'] * 1.25;
        var quarterDex = stats['dexterity'] * 1.25;
        var quarterStrSpd = sumStrSpd * 1.25;
        var quarterDefDex = sumDefDex * 1.25;

        var gymBalboas = sumDefDex - quarterStrSpd;
        var gymFrontline = sumStrSpd - quarterDefDex;
        var gym3000 = stats['strength'] - Math.max(quarterSpd, quarterDef, quarterDex);
        var gymIsoyama = stats['defense'] - Math.max(quarterStr, quarterSpd, quarterDex);
        var gymRebound = stats['speed'] - Math.max(quarterStr, quarterDef, quarterDex);
        var gymElites = stats['dexterity'] - Math.max(quarterStr, quarterSpd, quarterDef);

        var $gymContainer = $('[class^="gymContentWrapper___"], [class*=" gymContentWrapper___"]');
        //var $tutorialContainer = $('[class^="notification___"], [class*=" notification___"]');

        var $gymHint = '<p id="gymHint" style="margin: 5px; font-size: large;">Use the tutorial button (at the top of the page) to show/hide the Specialist Gym Advisor!</p>'

        var $gymHinter = $('#gymHint');
        if ($gymHinter.length) {
            console.debug('GymHinter:');
            console.debug($gymHinter);
            $gymHinter.remove();
        }

        //$tutorialContainer.append($gymHint);
        $gymContainer.append($gymHint);

        var $gymAdvise = '<table style="border: 3px solid #000; width: 400px;" id="gymAdvisor"><tr><th style="font-size: large; font-weight: bold;">Specialist Gym Advisor</th></tr>';

        var lockedGeorge = '';
        if ($("#gym-24").hasClass("locked___3akPx") || $("#gym-24").hasClass("inProgress___1Nd26")) {
            lockedGeorge = '<div style="color: red;">First unlock George\'s!</div>';
        }

        var lockedChaCha = '';
        if ($("#gym-20").hasClass("locked___3akPx") || $("#gym-20").hasClass("inProgress___1Nd26")) {
            lockedChaCha = '<div style="color: red;">First unlock Cha Cha\'s!</div>';
        }

        var color = 'green';
        if (lockedChaCha) {
            color = 'orange';
        }

        var $balboasAdvise = '<tr><td style="width: 100%; font-weight: bold;">Balboas Gym' + lockedChaCha + '</td></tr>';
        if (gymBalboas < 0) {
            $balboasAdvise += '<tr><td style="color: red;">You need to gain ' + FormatAbbreviatedNumber(gymBalboas * -1, 2) + ' DEF + DEX to unlock.</td></tr>';
        } else {
            $balboasAdvise += '<tr><td style="color: ' + color + ';">Your DEF + DEX is ' + FormatAbbreviatedNumber(gymBalboas, 2) + ' above the minimum requirement.</td></tr>';
        }

        var $frontlineAdvise = '<tr><td style="width: 100%; font-weight: bold;">Frontline Fitness' + lockedChaCha + '</td></tr>';
        if (gymFrontline < 0) {
            $frontlineAdvise += '<tr><td style="color: red;">You need to gain ' + FormatAbbreviatedNumber(gymFrontline * -1, 2) + ' STR + SPD to unlock.</td></tr>';
        } else {
            $frontlineAdvise += '<tr><td style="color: ' + color + ';">Your STR + SPD is ' + FormatAbbreviatedNumber(gymFrontline, 2) + ' above the minimum requirement.</td></tr>';
        }

        color = 'green';
        if (lockedGeorge) {
            color = 'orange';
        }

        var $gym3000Advise = '<tr><td style="width: 100%; font-weight: bold;">Gym 3000' + lockedGeorge + '</td></tr>';
        if (gym3000 < 0) {
            $gym3000Advise += '<tr><td style="color: red;">You need to gain ' + FormatAbbreviatedNumber(gym3000 * -1, 2) + ' STR to unlock.</td></tr>';
        } else {
            $gym3000Advise += '<tr><td style="color: ' + color + ';">Your STR is ' + FormatAbbreviatedNumber(gym3000, 2) + ' above the minimum requirement.</td></tr>';
        }

        var $isoyamaAdvise = '<tr><td style="width: 100%; font-weight: bold;">Mr. Isoyamas' + lockedGeorge + '</td></tr>';
        if (gymIsoyama < 0) {
            $isoyamaAdvise += '<tr><td style="color: red;">You need to gain ' + FormatAbbreviatedNumber(gymIsoyama * -1, 2) + ' DEF to unlock.</td></tr>';
        } else {
            $isoyamaAdvise += '<tr><td style="color: ' + color + ';">Your DEF is ' + FormatAbbreviatedNumber(gymIsoyama, 2) + ' above the minimum requirement.</td></tr>';
        }

        var $reboundAdvise = '<tr><td style="width: 100%; font-weight: bold;">Total Rebound' + lockedGeorge + '</td></tr>';
        if (gymRebound < 0) {
            $reboundAdvise += '<tr><td style="color: red;">You need to gain ' + FormatAbbreviatedNumber(gymRebound * -1, 2) + ' SPD to unlock.</td></tr>';
        } else {
            $reboundAdvise += '<tr><td style="color: ' + color + ';">Your SPD is ' + FormatAbbreviatedNumber(gymRebound, 2) + ' above the minimum requirement.</td></tr>';
        }

        var $eliteAdvise = '<tr><td style="width: 100%; font-weight: bold;">Elites' + lockedGeorge + '</td></tr>';
        if (gymElites < 0) {
            $eliteAdvise += '<tr><td style="color: red;">You need to gain ' + FormatAbbreviatedNumber(gymElites * -1, 2) + ' DEX to unlock.</td></tr>';
        } else {
            $eliteAdvise += '<tr><td style="color: ' + color + ';">Your DEX is ' + FormatAbbreviatedNumber(gymElites, 2) + ' above the minimum requirement.</td></tr>';
        }

        $gymAdvise += $balboasAdvise;
        $gymAdvise += $frontlineAdvise;
        $gymAdvise += $gym3000Advise;
        $gymAdvise += $isoyamaAdvise;
        $gymAdvise += $reboundAdvise;
        $gymAdvise += $eliteAdvise;

        $gymAdvise += '</table>';

        $gymContainer.append($gymAdvise);

        console.debug("Special Gym Advisor updated!");
	};
});
