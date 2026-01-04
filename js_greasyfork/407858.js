// ==UserScript==
// @name         AWS *CUSTOM* Accounts Switch
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Switch your AWS accounts based on a custom json list (including accounts and roles), (the idea of this script came from @joseaps ConduitSwitch script , with modification to make it more usable).
// @author       Aviram Fireberger
// @author       aviramf
// @match        https://*.console.aws.amazon.com/*
// @match        https://access.amazon.com/*
// @match        https://www.amazon.com/ap/*
// @match        https://*.signin.aws.amazon.com/*
// @match        https://aws.amazon.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_log
// @connect      access.amazon.com
// @connect      console.aws.amazon.com
// @connect      aws.amazon.com
// @downloadURL https://update.greasyfork.org/scripts/407858/AWS%20%2ACUSTOM%2A%20Accounts%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/407858/AWS%20%2ACUSTOM%2A%20Accounts%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *********** HOW TO USE ***********
    // set "accountOrRole" with "account" or "role" -> if you want to log into this account via your admin access or with a role access
    // set "accountValue" with the account value (e.g. "user-dev-account" , "team-aws-account-name") if you set "accountOrRole" to "account".
    // set "accountValue" with the arn role (e.g. "arn:aws:iam::0000000000:role/lambda-nvirginia-role") if you set "accountOrRole" to "role".
    // use "title" block to seperate and make you menu more readable.
    var customAccounts = [

        {
            "title": "Personal AWS For Experiments"
        },
        {
            "menuString": "USER Tests account",
            "accountValue": "user-dev-account",
            "accountOrRole": "account"
        },
        {
            "title": "Team 1 accounts & roles"
        },
        {
            "menuString": "Beta",
            "accountValue": "arn:aws:iam::0000000000:role/SomeRole",
            "accountOrRole": "role"
        },
        {
            "menuString": "Prod",
            "accountValue": "team1-prod-accounr",
            "accountOrRole": "account"
        },
        {
            "title": "Team 2 accounts & roles"
        },
        {
            "menuString": "Beta",
            "accountValue": "arn:aws:iam::0000000000:role/SomeRole",
            "accountOrRole": "role"
        },
        {
            "menuString": "Prod",
            "accountValue": "team2-prod-accounr",
            "accountOrRole": "account"
        },
    ];

    var spaceindex = 0;
    customAccounts.forEach(function (account) {

        if (account.title) {
            //Ignore first space.. it's ugly :)
            if(spaceindex > 0){
                GM_registerMenuCommand(
                    " ".repeat(spaceindex)
                );
            }
            spaceindex++;
            GM_registerMenuCommand(
                "*****  " + account.title + "   *****",
                function () {
                }
            );
            return;
        }


        var currentLocation = window.location;

        GM_registerMenuCommand(
            account.menuString,
            function () {
                try {
                    // logging out, in case already logged in another account
                    var logoutUrl = 'https://signin.aws.amazon.com/oauth?Action=logout&redirect_uri=aws.amazon.com';
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: logoutUrl,
                        onload: function (response) {
                            console.log('logging out finished');

                            // opening account
                            console.log('Opening account: ' + account.accountValue);

                            var url = 'https://access.amazon.com/aws/accounts/fetchConsoleUrl?account_name=' + escape(account.accountValue) + '&session_duration=43200';
                            if (account.accountOrRole === "role") {
                                url = 'https://access.amazon.com/aws/console/role/' + escape(account.accountValue) + '?session_duration=43200';
                            }

                            console.log('Redirecting to: ' + url);
                            window.location.replace(url);
                        }
                    });

                } catch (e) {
                    console.log(e);
                }
            }
        );
    });

    //Add another space at the end of the menu
    if(spaceindex > 0){
        GM_registerMenuCommand(
            " ".repeat(spaceindex)
        );
    }

})();
