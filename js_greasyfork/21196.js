// ==UserScript==
// @name         T411 - Shoutbox notifications
// @namespace    https://www.t411.ch
// @description  Affiche une notification de bureau lors de la réception d'un message
// @author       M1st3rN0b0d7, Micdu70
// @match        http://www.t411.al/chati/*
// @match        https://www.t411.al/chati/*
// @grant        none
// @version      1.3.1
// @downloadURL https://update.greasyfork.org/scripts/21196/T411%20-%20Shoutbox%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/21196/T411%20-%20Shoutbox%20notifications.meta.js
// ==/UserScript==
function INIT()
{
    var url = document.location.protocol + '//www.t411.al/users/profile/';
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.timeout = 15000;
    http.ontimeout = function(e)
    {
        alert('Script Shoutbox notifications : Impossible d\'obtenir votre pseudo, site instable ? Actualisez la page...');
    };
    http.onreadystatechange = function()
    {
        if (http.readyState == 4 && http.status == 200)
        {
            getYourUsername(http.response);
        }
    };
    http.send(null);
}
function getYourUsername(x)
{
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = x.replace(/<script(.|\s)*?\/script>/g, '');
    var title = tempDiv.getElementsByTagName('title')[0].innerHTML;
    if (title.indexOf('Membre') != -1)
    {
        var yourusername = title.split(' ')[3];
        Check(yourusername);
    }
    else
    {
        alert('Script Shoutbox notifications : Impossible d\'obtenir votre pseudo, site instable ? Actualisez la page...');
    }
}
function Check(me)
{
    var me_test = me.toLowerCase();
    document.getElementById('messages').addEventListener('DOMNodeInserted', function (event)
                                                         {
        if (event.target.parentNode.id == 'messages')
        {
            var element = document.getElementsByClassName(event.target.className)[0];
            var user = element.getElementsByTagName("strong")[0];
            var user1 = user.innerText.split(' ')[0];
            if (user1 !== me)
            {
                var msg = element.getElementsByTagName("p")[0];
                var msg1 = msg.innerHTML.replace(/<a.*?>(.*?)<\/a>/g, "$1").replace(/<img.*?alt="(.*?)">/g, "$1").replace(/((<.*?>)+)(.*?)((<\/.*?>)+)/g, "$3").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                var pv = element.className.split(' ')[1];
                if (pv !== "private")
                {
                    var test = msg.innerText.toLowerCase().indexOf(me_test);
                    if (test != -1)
                    {
                        notifyMe(true, user1, msg1);
                    }
                }
                else
                {
                    notifyMe("pv", user1, msg1);
                }
            }
        }
    });
}
function notifyMe(x, user, msg)
{
    if (x === undefined)
    {
        if (!Notification)
        {
            alert('Notifications de bureau non supportées.');
        }
        else if (Notification.permission === "denied")
        {
            alert('Notifications de bureau sont bloquées. ( Bruit sonore uniquement )');
        }
        else if (Notification.permission !== "granted")
        {
            Notification.requestPermission();
        }
    }
    else
    {
        var notification = "";
        if (x !== "pv")
        {
            notification = new Notification('Shoutbox T411',
                                            {
                icon: 'https://www.t411.al/themes/blue/images/logo.png',
                body: user + " vous a cité :\n" + msg
            });
        }
        else
        {
            notification = new Notification('Shoutbox T411',
                                            {
                icon: 'https://www.t411.al/themes/blue/images/logo.png',
                body: user + " vous a MP :\n" + msg
            });
        }
        var audio = new Audio("https://cdn.rawgit.com/M1st3rN0b0d7/t411-ShoutboxNotifications/master/facebook_pop.mp3");
        audio.volume = 0.3;
        audio.play();
    }
}
INIT();
notifyMe();