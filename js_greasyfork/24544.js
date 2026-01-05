// ==UserScript==
// @name         BitcoinTalk Alert
// @namespace    *://*/*
// @match        *://*/*
// @version      Beta 0.2
// @description  Extension for BitcoinTalk.org, mainly created to help people avoid scams.
// @author       BassBoostOfficial - Helpers: cryptodevil, Slow death
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24544/BitcoinTalk%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/24544/BitcoinTalk%20Alert.meta.js
// ==/UserScript==

console.log(" >> BTCTalk Alert - Userscript successfully loaded!");
var investorWarning = "<div class=\"tborder\" style=\"margin-bottom: 3ex; \"><table border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"5\" class=\"bordercolor\"><tbody><tr><td colspan=\"4\" id=\"warning\" class=\"catbg\" style=\" background-color: #610e0e !important; background-image: none; border: black; text-align: center;\">You are currently in the Investor-based games section at BitcoinTalk. This section is home to HYIPs, ponzi scams and blatant scams. We highly recommend to stay far away from any site in this section. If you decide to support a scam and we find out, you will be tagged with negative trust.</td></tr></tbody></table></div>";

$( document ).ready(function() {
    console.log(" >> BTCTalk Alert - Current URL: " + $(location).attr('href'));
    var currUrl = $(location).attr('href');
    if (currUrl.contains("https://bitcointalk.org/index.php?board=207")){
        $("#bodyarea").prepend(investorWarning);
        console.log(" >> BTCTalk Alert - User in Investor-based games section, warning user.");
    }
    if (currUrl.contains("https://bitcointalk.org/index.php?action=profile;u=")){
        console.log(" >> BTCTalk Alert - User in someone else's profile page.");
        console.log(" >> BTCTalk Alert - Initializing user trust check.");
        $.ajax ( {
        type:       'GET',
        url:        'https://bitcointalk.bassboostofficial.com/api/trust.php?id=' + currUrl,
        dataType:   'JSON',
        success:    function (apiData) {
        var resultObj = apiData;
        if(resultObj.error == "1") {
            console.log(" >> BTCTalk Alert - Target passed trust check.");
        } else {
            console.log(" >> BTCTalk Alert - Target didn't pass trust check, alerting user!");
            console.log(" >> BTCTalk Alert - Reference(s): " + resultObj.ref);
            alert (
              '--- BITCOINTALK ALERT ---\n\nWARNING! You are currently visiting a user who is found in our user blacklist. We usually add scammers and other untrustworthy people to this list. Please review the following information:\n\n\nUID: ' + resultObj.uid + '\n\nUsername: ' + resultObj.username + '\n\nReason: ' + resultObj.reason + '\n\nReference(s): ' + resultObj.ref + '\n\nAdded by: ' + resultObj.addedby + '\n\n\nThis alert is only here to protect you. Clickable links to the references can be found on the browser Javascript console.'
            );
        }
        }
        });
    } else {
        console.log(" >> BTCTalk Alert - User not in profile page.");
    }
    console.log(" >> BTCTalk Alert - Starting site check...");
    $.ajax ( {
    type:       'GET',
    url:        'https://bitcointalk.bassboostofficial.com/api/sitecheck.php?id=' + window.location.hostname,
    dataType:   'JSON',
    success:    function (apiData) {
        var resultObj = apiData;
        if(resultObj.error == "1") {
            console.log(" >> BTCTalk Alert - Site not found in database, all good.");
        } else {
            console.log(" >> BTCTalk Alert - Site in database! Warning user.");
            console.log(" >> BTCTalk Alert - Description: " + resultObj.desc);
            alert (
              '--- BITCOINTALK ALERT ---\n\nWARNING! The site you are visiting could be malicious. Please review the follow information for details:\n\n\nDomain Name: ' + resultObj.domain + '\n\nType: ' + resultObj.type + '\n\nDescription: ' + resultObj.desc + '\n\nAdded by: ' + resultObj.addedby + '\n\n\nThis alert is only here to protect you. Feel free to continue, but be aware of the risks. Thank you.'
            );
        }
    }
} );
});

String.prototype.contains = function(it) {
   return this.indexOf(it) != -1;
};
