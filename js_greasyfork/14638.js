// ==UserScript==
// @name         DevBest Alerts
// @namespace    http://tesomayn.com/
// @version      1.5.6
// @description  Get Notifications for DevBest Shoutbox
// @author       TesoMayn
// @copyright    2015
// @match        https://devbest.com/
// @require      https://greasyfork.org/scripts/14637-arrive-js/code/Arrivejs.js?version=92469
// @require      https://cdn.jsdelivr.net/jquery.notification/1.0.3/jquery.notification.min.js
// @require      https://greasyfork.org/scripts/14976-localstoragedb/code/LocalStorageDB.js?version=94706
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/14638/DevBest%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/14638/DevBest%20Alerts.meta.js
// ==/UserScript==
/* jshint esnext: true */

$(document).ready( function() {

    const alertUsers = ["TesoMayn"]; // Usernames that you get alerted by
    const alertNames = ["Teso", "teso", "TesoMayn", "tesomayn", "Tesomayn"]; // Your username (keep current formt as currently is not case-insensative)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// DO NOT EDIT BELOW THIS LINE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (GM_getValue("firstRun", "") !== true) {
        GM_setValue("firstRun", true);
        alert("Be sure to set your configuraton!");
    }

    $.notification.requestPermission(function () { console.log($.notification.permissionLevel()); });

    $('ul#siropuChatMessages').arrive('li', function() {

        ////////////////////////// Variables ////////////////////////////////////////////
        var getAuthor       = $(this).attr('data-author');
        var getMessage      = $(this).find('.siropuChatMessage').text();
        var getAvatar       = $('.siropuChatContentLeft', this).find('img').attr('src');
        var fiveMinutesAgo  = Math.floor(Date.now() / 1000) - (5 * 60);
        var messageTime     = $(this).find('.DateTime').attr('data-time');
        ////////////////////////////////////////////////////////////////////////////////

        if (checkArray(getMessage, alertNames) === true) {
            if ( $.inArray(getAuthor, alertUsers) != -1 ) {
                if(messageTime > fiveMinutesAgo) {
                    getAvatar = getAvatar.replace("avatars/s", "avatars/l");
                    //////////////////// Chrome Notifications ////////////////////
                    var options = {
                        iconUrl: getAvatar,
                        title: 'Ping From: ' + getAuthor,
                        body: getMessage
                    };
                    $.notification(options).then(function (notification) {
                        setTimeout(function () {
                            notification.close();
                        }, 30000);
                    });
                    //////////////////////////////////////////////////////////////
                }
            }
        }
        function checkArray(str, arr){
            for(var i=0; i < arr.length; i++){
                if(str.match((".*" + arr[i].trim() + ".*").replace(" ", ".*")))
                    return true;
            }
            return false;
        }
    });
    $('<li><a href="#">DevBest Alerts v' +  GM_info.script.version + '</a></li>').appendTo('#XenForoUniq4 > ul.secondaryContent.blockLinksList');
    GM_registerMenuCommand('Add Alert User', function() {
        var addUser = prompt('Username','TesoMayn');
        if (addUser !== null) {
            addUser.push(userName);
        }
    }, 'a');
});
