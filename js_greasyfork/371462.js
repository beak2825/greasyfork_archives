// ==UserScript==
// @name          YouTrack Enhancement Script (YES)
// @description   Adds some productivity features to YouTrack
// @author        REDLINK
// @namespace     https://greasyfork.org/en/users/131211-redlink
// @match         https://issues.redlink.de/issue*
// @version       4.1
// @connect       snom.redlink.de
// @connect       d100264200.tplpbx.de
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceURL
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/371462/YouTrack%20Enhancement%20Script%20%28YES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371462/YouTrack%20Enhancement%20Script%20%28YES%29.meta.js
// ==/UserScript==

/* globals $, jQuery */

// Avoid "'$' is not defined" warnings
//var $ = window.jQuery;

// Include the "Redmond" jQuery theme
$('head').append (
    '<link '
    + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/themes/redmond/jquery-ui.css" '
    + 'rel="stylesheet" type="text/css">'
);

// Set text area language (spell checking)
$('textarea').attr('lang', 'de');

// Wait until DOM element becomes available
function waitForEl(selector, callback, maxtries = false, interval = 100) {
    const poller = setInterval(() => {
        const el = $(selector)
        const retry = maxtries === false || maxtries-- > 0
        if (retry && el.length < 1) return
        clearInterval(poller)
        callback(el || null)
    }, interval)
}

// Show themed message dialog
function jQAlert(alertTitle, alertMessage, doReload) {

    $('body').append('<div id="overlayDialog">' + alertMessage + '</div>');
    $('#overlayDialog').dialog( {
        buttons: {
            Ok: function(){
                $(this).dialog('close');
                if (doReload == true) {
                    location.reload();
                }
            }
        },
        draggable: false,
        modal:     true,
        position: {my: "top", at: "top", of: window},
        resizable: false,
        title:     alertTitle
    } );

}

// Send commands to the YouTrack API
function execYTCommand(ytCommand, doReload) {

    var issueID = $('#id_l\\.I\\.ic\\.icr\\.ii\\.iica').text();

    GM_xmlhttpRequest( {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        url: "/rest/issue/"+ issueID + "/execute",
        data: ytCommand,
        onerror: function() {
                jQAlert("Error", "YouTrack API - Request failed", false);
        },
        ontimeout: function() {
                jQAlert("Timeout", "YouTrack API - Request timed out", false);
        },
        onload: function(response) {
            if (response.status == 200) {
                if (doReload == true) {
                    location.reload();
                }
            } else {
                jQAlert("Error", "YouTrack API - " + response.responseText, false);
            }
        }
    } );

}

// Get user phone extension including domain
function getUserExt(userName) {

    GM_xmlhttpRequest( {
        method: "GET",
        url: "https://snom.redlink.de/c2d.php?name=" + encodeURIComponent(userName),
        onerror: function() {
                jQAlert("Error", "Call2dial API - Request failed", false);
        },
        ontimeout: function() {
                jQAlert("Timeout", "Call2dial API - Request timed out", false);
        },
        onload: function(response) {
            if (response.status == 200) {
                GM_setValue("userExt", response.responseText);
            } else {
                jQAlert("Error", "Call2dial API - " + response.responseText, false);
            }
        }
    } );

}

// Call destination number from user extension
function callDestination(callDest) {

    var callTime = Math.floor(Date.now() / 1000);
    var callDura = 86400;

    GM_xmlhttpRequest( {
        method: "GET",
        url: "https://snom.redlink.de/c2d.php?name=" + encodeURIComponent(GM_getValue("userName")) + "&dest=" + callDest + "&time=" + callTime + "&dura=" + callDura,
        onerror: function() {
                jQAlert("Error", "Call2dial API - Request failed", false);
        },
        ontimeout: function() {
                jQAlert("Timeout", "Call2dial API - Request timed out", false);
        },
        onload: function(response) {
            if (response.status == 200) {

                GM_xmlhttpRequest( {
                    method: "GET",
                    url: "https://d100264200.tplpbx.de/remote_call.htm?user=" + GM_getValue("userExt") + "&dest=" + callDest + "&time=" + callTime + "&duration=" + callDura + "&auth=" + response.responseText + "&extension=true&connect=true",
                    onerror: function() {
                        jQAlert("Error", "vPBX API - Request failed", false);
                    },
                    ontimeout: function() {
                        jQAlert("Timeout", "vPBX API - Request timed out", false);
                    },
                    onload: function(response) {
                        if (response.status == 200) {
                            jQAlert("Success", "Calling " + callDest + "...", false);
                        } else {
                            jQAlert("Error", "vPBX API - " + response.responseText, false);
                        }
                    }
                } );

            } else {
                jQAlert("Error", "Call2dial API - " + response.responseText, false);
            }
        }
    } );

}

// Insert call buttons next to phone numbers in metadata
function callButtons() {

    // Main number in collapsed view
    var custInfoText = $('div#id_l\\.I\\.ic\\.icr\\.d\\.description > div.prewrapped > span.wiki-cut-title').text();
    var custInfoArray = custInfoText.split(",", 3);
    var custPhoneMain = custInfoArray[2].replace(/[^0-9]/gi, '');

    if (custPhoneMain.length) {
        $('div#id_l\\.I\\.ic\\.icr\\.d\\.description > div.prewrapped > span.wiki-cut-title:contains("Benutzer:")').append(' <a href="#/" title="Call ' + custPhoneMain + '" id="callCPMain">☎</a>');
        $('#callCPMain').on("click", function() {
            callDestination(custPhoneMain);
        } );
    }

    // Fixed line number in expanded view
    var custPhoneFixedEl = $('#id_l\\.I\\.ic\\.icr\\.d\\.description > div.prewrapped > div:contains("Benutzer") > span:contains("Telefon:")')[0].nextSibling;
    var custPhoneFixed = custPhoneFixedEl.nodeValue.replace(/[^0-9]/gi, '');

    if (custPhoneFixed.length) {
        $(custPhoneFixedEl).after(' <a href="#/" title="Call ' + custPhoneFixed + '" id="callCPFixed">☎</a>');
        $('#callCPFixed').on("click", function() {
            callDestination(custPhoneFixed);
        } );
    }

    // Mobile phone number in expanded view
    var custPhoneMobileEl = $('#id_l\\.I\\.ic\\.icr\\.d\\.description > div.prewrapped > div:contains("Benutzer") > span:contains("Mobil:")')[0].nextSibling;
    var custPhoneMobile = custPhoneMobileEl.nodeValue.replace(/[^0-9]/gi, '');

    if (custPhoneMobile.length) {
        $(custPhoneMobileEl).after(' <a href="#/" title="Call ' + custPhoneMobile + '" id="callCPMobile">☎</a>');
        $('#callCPMobile').on("click", function() {
            callDestination(custPhoneMobile);
        } );
    }

}

// Turn field titles into filter links
function filterLinks() {

    // Field "Fix versions"
    var fixVersions = $('.fsi-property-label:contains(Fix versions)').closest('td').next().text();

    if (fixVersions.indexOf("Hotfix") != -1) {
        var addQuery = "Hotfix and Fix versions: ";
        var fixVersionsArray = fixVersions.split(",", 2);
        fixVersions = fixVersionsArray[1].trim();
    }
    $('.fsi-property-label:contains(Fix versions)').html('<a href="https://issues.redlink.de/issues?q=Fix versions: ' + addQuery + fixVersions + '">Fix versions</a>');

    // Field "Release Date"
    var releaseDate = $('.fsi-property-label:contains(Release Date)').closest('td').next().text().replace('×', '');
    $('.fsi-property-label:contains(Release Date)').html('<a href="https://issues.redlink.de/issues?q=Release Date: ' + releaseDate + '">Release Date</a>');

    // Field "User ID"
    var userID = $('.fsi-property-label:contains(User ID)').closest('td').next().text();
    $('.fsi-property-label:contains(User ID)').html('<a href="https://issues.redlink.de/issues?q=User ID: ' + userID + '">User ID</a>');

    // Field "Unit ID"
    var unitID = $('.fsi-property-label:contains(Unit ID)').closest('td').next().text();
    $('.fsi-property-label:contains(Unit ID)').html('<a href="https://issues.redlink.de/issues?q=Unit ID: ' + unitID + '">Unit ID</a>');

    // Field "Kundennr."
    var custID = $('.fsi-property-label:contains(Kundennr.)').closest('td').next().text();
    $('.fsi-property-label:contains(Kundennr.)').html('<a href="https://issues.redlink.de/issues?q=Kundennr.: {' + custID + '}">Kundennr.</a>');

    // Field "Projekt"
    var projID = $('.fsi-property-label:contains(Projekt)').closest('td').next().text();
    $('.fsi-property-label:contains(Projekt)').html('<a href="https://issues.redlink.de/issues?q=Projekt: {' + projID + '}">Projekt</a>');

}

function convertPeriodToHours(duration) {
    var weeks = duration.match(/(?<!\d+w)\d+(?=w.*)/);
    var days = duration.match(/(?<!\d+d)\d+(?=d.*)/);
    var hours = duration.match(/(?<!\d+h)\d+(?=h.*)/);
    return weeks * 5 * 8 + days * 8 + hours * 1 + 'h';
}

function showPeriodAsHours() {

    // Just for reference, this can be used to get a duration in ISO 6801 format
    // $('.fsi-property-label:contains(<Duration Field>)').closest('td').next().text().trim().toUpperCase().replace(/^/, 'P').replace(/(?<=P|W|D)(?=\d+H|M)/, 'T');

    // Field "Estimation"
    var periodEstimate = $('.fsi-property-label:contains(Estimation)').closest('td').next().text();
    $('.fsi-property-label:contains(Estimation)').closest('td').next().children('div').prop('title', convertPeriodToHours(periodEstimate));

    // Field "Spent time"
    var periodSpent = $('.fsi-property-label:contains(Spent time)').closest('td').next().text();
    $('.fsi-property-label:contains(Spent time)').closest('td').next().children('div').prop('title', convertPeriodToHours(periodSpent));

}

// Insert "Close Issue" link next to visibility selection
function closeIssueLink() {
    if (!$('#id_l\\.I\\.ic\\.icr\\.issueContent > div').hasClass("resolved")) {
        var title = "This is a shortcut for the command chain:\nRechnung Nein\nAdd Dokumentation Nein\nRemove Dokumentation Unentschieden\nState Geschlossen";

        $('#id_l\\.I\\.ic\\.icr\\.iv\\.visibilityWrapper').prepend('<a style="float: left; margin-right: 10px;" href="#/" title="' + title + '" id="closeIssueLink">Close Issue</a>');
        $('#closeIssueLink').on("click", function() {
            execYTCommand("command=Rechnung Nein Add Dokumentation Nein Remove Dokumentation Unentschieden State Geschlossen&disableNotifications=true", true);
        } );
    }
}

// Reset hidden fields (show permanently)
function resetFields() {
    unhideFields();
    GM_setValue("hiddenFields", '[]');
}

// Unhide hidden fields (show temporarily)
function unhideFields() {
    var hiddenFields = JSON.parse(GM_getValue("hiddenFields", '[]'));

    $(hiddenFields).each(function() {
        $('.fsi-property-label:contains(' + this + ')').closest('tr').css("color", "rgba(0, 0, 0, 0.5)").show(1000);
    } );
}

// Allow hiding fields the user doesn't want to see
function hideFields() {
    var hiddenFields = JSON.parse(GM_getValue("hiddenFields", '[]'));

    $(hiddenFields).each(function() {
        $('.fsi-property-label:contains(' + this + ')').closest('tr').hide();
    } );

    $('.fsi-property-label').append('<span style="float: right; margin-right: 10%; display: none;" title="Hide Field" class="ui-icon ui-icon-circle-close"></span>')
        .on("mouseenter", function() {
            $('span', this).show()
                .on("click", function() {
                    $(this).closest('tr').hide();
                    var fieldName = $(this).closest('tr').find('.fsi-property-label:first').text();
                    if(hiddenFields.indexOf(fieldName) === -1) {
                        hiddenFields.push(fieldName);
                    }
                    GM_setValue("hiddenFields", JSON.stringify(hiddenFields));
                } )
        } )
        .on("mouseleave", function() {
            $('span', this).hide();
        } );
}

// Insert a "Viewed" link next to the visibility selection (adds a tag for filtering)
function viewedLink() {
    if (!$('.yt-tag__link[title="Viewed"]').length) {
        var title = "This is a shortcut for the command:\nAdd Tag Viewed";

        //$('#id_l\\.I\\.ic\\.icr\\.ByProperties\\.byProperties').append('<a href="#/" title="' + title + '" id="addViewedLink">+Viewed</a>');
        $('#id_l\\.I\\.ic\\.icr\\.iv\\.visibilityWrapper').prepend('<a style="float: left; margin-right: 10px" href="#/" title="' + title + '" id="addViewedLink">+Viewed</a>');
        $('#addViewedLink').on("click", function() {
            execYTCommand("command=Add Tag Viewed&disableNotifications=true", false);
            jQAlert("Success", "Added Tag \"Viewed\"");
            $('#addViewedLink').remove();
        } );
    } else {
        $('.yt-tag__link[title="Viewed"]').prev('a').on("click", function() {
            location.reload();
        } );
    }
}

// The script is only active for support tickets
waitForEl('.fsi-property-label:contains(Project)', function() {

    var projectName = $('.fsi-property-label:contains(Project)').closest('td').next().find('a').text();
    if (projectName == "Ki-ON Support" || projectName == "Support Test") {

        closeIssueLink();

        filterLinks();
        showPeriodAsHours();

        hideFields();
        GM_registerMenuCommand("Show hidden fields", unhideFields);
        GM_registerMenuCommand("Reset hidden fields", resetFields);

        // Wait until the user menu has loaded
        waitForEl('div[data-test="header-user-menu"]', function() {

            var userName = $('div[data-test="header-user-menu"]').attr('title');

            // Get and store user name and phone extension
            if (GM_getValue("userName") != userName || GM_getValue("userExt").length != 24) {
                GM_setValue("userName", userName);
                getUserExt(userName);
            }

            callButtons();

            // Extension specific actions
            //if (GM_getValue("userExt").startsWith("127")) {
            //    viewedLink();
            //}

        }, 10, 500);

    }

}, 10, 500);
