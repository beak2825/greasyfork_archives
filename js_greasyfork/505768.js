// ==UserScript==
// @name          BetterMeldesuche
// @namespace     https://admincalls-de.knuddels.de/ac/ac_login.pl
// @version       1.0.3
// @description   Erweitert die Meldesuche mit weiteren Details
// @author        Rho
// @license       Proprietary
// @match         https://admincalls-de.knuddels.de/ac/ac_search.pl?*
// @require       https://unpkg.com/xregexp/xregexp-all.js
// @require       https://unpkg.com/jquery/dist/jquery.js
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/505768/BetterMeldesuche.user.js
// @updateURL https://update.greasyfork.org/scripts/505768/BetterMeldesuche.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EMAIL_REGEX = 'ac_search\\.pl[^"]+">([^<]*?)<\\/a> \\($EMAIL\\)';

    function sanitizeRegex(input) {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function extractTextFromHTML(htmlString) {
        return $('<div/>').html(htmlString).text();
    }

    let userEmail = $('#involvedemail').val();

    if(userEmail === '') return;

    if(userEmail.indexOf('/') === -1) {

        let terminateProcessing = false;
        $('[href^="ac_viewcase.pl"]').each(function () {
            if(terminateProcessing) return false;

            let anchorElement = $(this);
            let requestUrl = anchorElement.attr('href');
            let obfuscatedEmail = userEmail.replace('@', '&#64;').replaceAll('-', '&#45;');
            const emailPattern = XRegExp(EMAIL_REGEX.replace('$EMAIL', sanitizeRegex(obfuscatedEmail)), 'gm');

            $.post(requestUrl, {}, (response) => {
                let matchResult = null;
                while ((matchResult = emailPattern.exec(response)) !== null) {
                    let retrievedEmail = matchResult[1];
                    $('#involvedemail').val(extractTextFromHTML(retrievedEmail));
                    $('#involvedemail').closest('form').submit();
                    terminateProcessing = true;
                }
            });
        });
    }

    let headerRow = $('th').closest('tr');
    let $meldetypHeader = headerRow.find('th:contains("Typ")');
    let $letzterBearbeiterHeader = headerRow.find('th:contains("letzter Bearbeiter")');

    let $accountnameHeader = $('<th/>');
    $accountnameHeader.text('Accountname').appendTo(headerRow);

    let $genderAgeHeader = $('<th/>').addClass('P');
    $genderAgeHeader.text('G&A').appendTo(headerRow);

    let $minutesHeader = $('<th/>');
    $minutesHeader.text('Minuten').appendTo(headerRow);

    let $statusHeader = $('<th/>').addClass('P');
    $statusHeader.html('Status<br>Registration').appendTo(headerRow);

    $meldetypHeader.text('Meldetyp');
    $letzterBearbeiterHeader.text('Letzter Bearbeiter');

    headerRow.find('th:contains("Meldenummer Priorität")').css('width', '');
    $meldetypHeader.css('width', '');
    $letzterBearbeiterHeader.css('width', '');

    $('table').css('width', 'calc(80vw - 100px)');
    $('table').css('margin-left', 'calc(50% - (80vw - 100px)/2)');
    $('table').css('margin-right', 'calc(50% - (80vw - 100px)/2)');

    headerRow.find('th')[0].style.width = '100px';
    headerRow.find('th')[3].style.width = '110px';

    const extractionPattern = XRegExp(
        `<div style="width:460px; float:left;{0,1}"><span style="font-weight:bold[^.]{0,100}">([^<]{2,})<\/span>(.{1,334}|.{1,426})(\\d+) Jahre,.{1,26}([^\\s]+)([.]| ([^\\s]+)),.([^\\s]+) Minuten \\(Reg\\.: ([^\\)]+)\\),.{1,25}([^\\s]+).{1,300}involvedemail=(.*?)&emailtype=`,
        'gms'
    );

    $('[href^="ac_viewcase.pl"]').each(function () {
        let anchor = $(this);
        let row = $(this).closest('tr');
        let hasClassP = $(row.find('td')[1]).hasClass('P');

        let $accountnameCell = $('<td/>').appendTo(row);
        let $genderAgeCell = $('<td/>').appendTo(row);
        let $minutesCell = $('<td/>').appendTo(row);
        let $statusCell = $('<td/>').appendTo(row);

        if (hasClassP) {
            $genderAgeCell.addClass('P');
            $statusCell.addClass('P');
        } else {
            $accountnameCell.addClass('Q');
            $minutesCell.addClass('Q');
        }

        let requestLink = anchor.attr('href');
        let queryParameters = new URLSearchParams(requestLink);
        let reportId = queryParameters.get('id');
        let reportDate = $(row.find('td')[3]).text().substring(0, 10);

        $.post(requestLink, {}, (response) => {
            let result;
            while ((result = extractionPattern.exec(response)) !== null) {
                if (result.index === extractionPattern.lastIndex) {
                    extractionPattern.lastIndex++;
                }

                if (result[10] === userEmail) {
                    if (!result[1]) {
                        $accountnameCell.text('-');
                    } else {
                        $accountnameCell.html(result[1]);
                    }
                    if (result[6]) {
                        let genderAbbreviation = result[6][0] === 'E' ? 'm' : 'w';
                        $genderAgeCell.text(`${result[4][0]}(${genderAbbreviation})${result[3]}`);
                    } else {
                        $genderAgeCell.text(`${result[4][0]}${result[3]}`);
                    }
                    if (!result[9] || !result[8]) {
                        $statusCell.text('-');
                    } else {
                        let statusText = result[9].replace(/,$/, '');
                        $statusCell.html(`${statusText}<br>${result[8]} Uhr`);
                    }
                    $minutesCell.text(`${result[7]} Min.`);
                }
            }
            if (!$accountnameCell.text()) {
                $accountnameCell.text('-');
            }
            if (!$genderAgeCell.text()) {
                $genderAgeCell.text('-');
            }
            if (!$minutesCell.text()) {
                $minutesCell.text('-');
            }
            if (!$statusCell.text()) {
                $statusCell.text('-');
            }
        });
    });
})();
