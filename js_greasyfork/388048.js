// ==UserScript==
// @name         Forum WS - Corrige les topics non-lus
// @namespace    Forum-WS
// @version      1.0
// @description  Corrige le bug des topics non-lus sur le forum WS
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388048/Forum%20WS%20-%20Corrige%20les%20topics%20non-lus.user.js
// @updateURL https://update.greasyfork.org/scripts/388048/Forum%20WS%20-%20Corrige%20les%20topics%20non-lus.meta.js
// ==/UserScript==

function INIT()
{
    var getProfileUrl;
    var check_v3 = document.getElementById('noxContent');
    if (check_v3)
    {
        getProfileUrl = document.getElementsByClassName('status')[0];
    }
    else
    {
        getProfileUrl = document.getElementById('navprofile');
    }
    if (getProfileUrl)
    {
        var loggedUsername, iconStyle;
        var welcomeMessage = getProfileUrl.textContent;
        check_v3 = getProfileUrl.getElementsByTagName('span')[0];
        if (check_v3)
        {
            loggedUsername = welcomeMessage.slice(21);
            iconStyle = "url(https://static.wareziens.net/wp-content/forum/style/v3/img/noNewMessage.png) no-repeat";
        }
        else
        {
            loggedUsername = welcomeMessage.slice(10);
            iconStyle = "url(https://static.wareziens.net/forum/style/v4/img/old.png) 0px 0px no-repeat scroll rgba(0, 0, 0, 0)";
        }
        updateTopics(loggedUsername, iconStyle);
        checkTopics(loggedUsername, iconStyle, true);
    }
}

function updateTopics(loggedUsername, iconStyle)
{
    var getTopics = document.getElementById('ajax');
    if (getTopics)
    {
        console.log("Updating Topics...");
        var request = new XMLHttpRequest();
        request.open('GET', 'https://www.wareziens.net/forum/topics_ajax.php', true);
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.onload = function() {
            if (this.status >= 200 && this.status < 400)
            {
                getTopics.innerHTML = this.responseText;
                checkTopics(loggedUsername, iconStyle, false);
            }
        };
        request.send();
    }
}

function checkTopics(loggedUsername, iconStyle, ajax)
{
    var getTopics = document.getElementById('ajax');
    if (getTopics)
    {
        console.log("Checking Topics...");
        var topicsNotRead = document.getElementsByClassName('inew');
        for (var i = 0; i < topicsNotRead.length; i++)
        {
            var lastMessageUsername = topicsNotRead[i].getElementsByClassName('byuser')[1];
            if (!lastMessageUsername)
            {
                lastMessageUsername = topicsNotRead[i].getElementsByClassName('byuser')[0];
            }
            lastMessageUsername = lastMessageUsername.getElementsByTagName('a')[0].textContent;
            if (lastMessageUsername === loggedUsername)
            {
                var icon = topicsNotRead[i].getElementsByClassName('icon-new')[0];
                icon.style.background = iconStyle;
                var title = topicsNotRead[i].getElementsByClassName('tclcon')[0];
                var getTitle = title.innerHTML;
                var newTitle = getTitle.replace(/<\/?strong>/g, '');
                title.innerHTML = newTitle;
                var newMessage = topicsNotRead[i].getElementsByClassName('newtext')[0];
                newMessage.style.display = 'none';
            }
        }
        if (ajax)
        {
            console.log("Starting AJAX Checker...");
            var oldXHR = window.XMLHttpRequest;
            var stateChangeHandler = function() {
                var ajaxFile = this.responseURL.split('/').pop();
                if (ajaxFile === 'topics_ajax.php' && this.readyState == 4 && this.status == 200)
                {
                    console.log("AJAX Topics Update Detected!");
                    setTimeout(function() {checkTopics(loggedUsername, iconStyle, false);}, 500);
                }
            };
            var newXHR = function() {
                var xhr = new oldXHR();
                xhr.addEventListener('readystatechange', stateChangeHandler);
                return xhr;
            };
            window.XMLHttpRequest = newXHR;
        }
    }
}

INIT();