// ==UserScript==
// @name         EMC TSE Browser Plugin
// @namespace    http://asghonim.wordpress.com/
// @version      0.1.1
// @description  Ahmed Ghonim utility button to send Email to customer right from Service Center
// @author       Ahmed Ghonim
// @match        https://support.emc.com/servicecenter/srManagement/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15410/EMC%20TSE%20Browser%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/15410/EMC%20TSE%20Browser%20Plugin.meta.js
// ==/UserScript==

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function myfn2()
{
        jQuery('#addToSRs');
        jQuery("<table id=\"ghoniaSendEmail\" cellspacing=\"0\" class=\"x-btn btn-submit-gray x-btn-noicon x-column\" style=\"width: auto; margin-right: 7px;\"><tbody class=\"x-btn-small x-btn-icon-small-left\"><tr><td class=\"x-btn-tl\"><i>&nbsp;</i></td><td class=\"x-btn-tc\"></td><td class=\"x-btn-tr\"><i>&nbsp;</i></td></tr><tr><td class=\"x-btn-ml\"><i>&nbsp;</i></td><td class=\"x-btn-mc\"><div class=\"x-btn-text x-btn-mc-wrap\" style=\"overflow: hidden; width: 34px;\">Email</div></td><td class=\"x-btn-mr\"><i>&nbsp;</i></td></tr><tr><td class=\"x-btn-bl\"><i>&nbsp;</i></td><td class=\"x-btn-bc\"></td><td class=\"x-btn-br\"><i>&nbsp;</i></td></tr></tbody></table>").insertAfter('#addToSRs');
        jQuery("#ghoniaSendEmail").click(function() 
                                         {
                                             var theEmail = jQuery("#contactEmail").html();
                                             var urlSplit = window.location.href.split("/");
                                             var SRno = urlSplit[urlSplit.length - 1];
                                             var objectTitle = jQuery("#objectTitle").html();
                                             var emailSubject = "EMC SR#" + SRno + " " + objectTitle;
                                             window.location.href = "mailto:" + theEmail + "?subject=" + emailSubject;
                                         });
        
}

setTimeout(function () {
            myfn2();
        }, 5000);