// ==UserScript==
// @name         Resolve MAC Addresses for TD-W8970 v1 web pages
// @namespace    https://github.com/Neurone/hus
// @version      1.1
// @description  Resolve MAC Addresses based on settings in Wireless MAC Filtering page. Tested on TD-W8970 v1 Firmware Version:0.6.0 2.12 v000c.0 Build 140613 Rel.31066n
// @author       Giuseppe Bertone <bertone.giuseppe@gmail.com> (https://github.com/Neurone/hus)
// @copyright    2020+, Giuseppe Bertone (https://github.com/Neurone/hus)
// @license      MIT; https://github.com/Neurone/hus/raw/master/LICENSE
// @source       https://github.com/Neurone/hus
// @supportURL   https://github.com/Neurone/hus/issues
// @match        http://192.168.1.1
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397690/Resolve%20MAC%20Addresses%20for%20TD-W8970%20v1%20web%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/397690/Resolve%20MAC%20Addresses%20for%20TD-W8970%20v1%20web%20pages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_RATE = 400; //milliseconds
    let macNames = {};

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    }

    function isMacAddress(string) {
        return (17 === string.length);
    }

    function formatCellWithNickname(cell) {
        let macAddress = cell.text();
        let deviceNickname = macNames[macAddress] ? macNames[macAddress] : "";
        if(isMacAddress(macAddress)) cell.html(macAddress + "<br/>" + deviceNickname);
    }

    var checkPage = function () {
        let pageName = jQuery("#et").text();
        if ('Wireless Stations Status' === pageName) {
            if (isEmpty(macNames)) {
                jQuery("#t_info").html("This page displays the basic information of all stations in this wireless network. <span style='color:red;font-weight:bold'>To init the MAC address resolution please visit the 'Wireless MAC filtering' page at least once.</span>");
            } else {
                // Resolve MAC names
                jQuery("#staTbl tr").each(function () {
                    let cell = jQuery(this).find("td:eq(1)");
                    formatCellWithNickname(cell);
                });
            }
        } else if ('DHCP Clients List' === pageName) {
            if (isEmpty(macNames)) {
                jQuery("#t_info").html("This page displays the information of DHCP clients. <span style='color:red;font-weight:bold'>To init the MAC address resolution please visit the 'Wireless MAC filtering' page at least once.</span>");
            } else {
                // Resolve MAC names
                jQuery("#hostTbl tr").each(function () {
                    let cell = jQuery(this).find("td:eq(2)");
                    formatCellWithNickname(cell);
                });
            }
        } else if ('ARP List' === pageName) {
            if (isEmpty(macNames)) {
                let firstChild = jQuery(".con2 p:first");
                if(firstChild.hasClass("br")) firstChild.before('<p class="L1 T" id="t_info"><span style="color:red;font-weight:bold">To init the MAC address resolution please visit the \'Wireless MAC filtering\' page at least once.</span></p>');
            } else {
                // Resolve MAC names
                jQuery("#arptbl tr").each(function () {
                    let cell = jQuery(this).find("td:eq(1)");
                    formatCellWithNickname(cell);
                });
            }
        } else if ('Wireless MAC Filtering settings' === pageName) {
            // Update MAC name list
            macNames = {};
            jQuery("#macTbl tr").each(function () {
                let macAddress = jQuery(this).find("td:eq(1)").text();
                let macName = jQuery(this).find("td:eq(3)").text();
                macNames[macAddress] = macName;
            });
            // Save MAC names in local storage
            if (typeof (Storage) !== "undefined")
                localStorage.macNames = JSON.stringify(macNames);
        }
    };

    $.noConflict();
    jQuery.when(jQuery.ready).then(function () {
        // Retrieve saved MAC list
        if (typeof (Storage) !== "undefined" && localStorage.macNames)
            macNames = JSON.parse(localStorage.macNames);
        setInterval(checkPage, REFRESH_RATE);
    });

})();
