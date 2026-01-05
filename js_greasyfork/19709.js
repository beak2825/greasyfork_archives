// ==UserScript==
// @name         T411 Shoutbox - Bouton Répondre & MP Site (Special Edition)
// @namespace    www.t411.ch
// @version      1.3.1
// @description  Ajoute un bouton 'Répondre' et 'MP Site' dans la Shoutbox de T411
// @author       Micdu70
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @exclude      http://www.t411.al/chati/history.php*
// @exclude      https://www.t411.al/chati/history.php*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/19709/T411%20Shoutbox%20-%20Bouton%20R%C3%A9pondre%20%20MP%20Site%20%28Special%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/19709/T411%20Shoutbox%20-%20Bouton%20R%C3%A9pondre%20%20MP%20Site%20%28Special%20Edition%29.meta.js
// ==/UserScript==
function INIT()
{
    document.styleSheets[0].insertRule('#messages .data {float:left;}', 0);
    document.styleSheets[0].insertRule('#messages .data>a {margin-left:30px;visibility:hidden;}', 0);
    document.styleSheets[0].insertRule('#messages p {clear:both;}', 0);
    document.styleSheets[0].insertRule('#messages .message {overflow:auto;}', 0);
    document.getElementById('online').innerHTML = '<div id="counter"></div> connectés';
    var url = document.location.protocol + '//www.t411.al/users/profile/';
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.timeout = 15000;
    http.ontimeout = function(e)
    {
        alert('Script Bouton Répondre & MP Site : Impossible d\'obtenir votre pseudo, site instable ? Actualisez la page...');
        document.styleSheets[0].insertRule('#messages .data>a {visibility:visible !important;}', 0);
    };
    http.onreadystatechange = function()
    {
        if (http.readyState == 4 && http.status == 200)
        {
            getYourUsername(http.response);
            document.styleSheets[0].insertRule('#messages .data>a {visibility:visible !important;}', 0);
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
        F_INIT(yourusername);
    }
    else
    {
        alert('Script Bouton Répondre & MP Site : Impossible d\'obtenir votre pseudo, site instable ? Actualisez la page...');
    }
}
function F_INIT(x)
{
    addClearButton();
    document.getElementById('send').onclick = function ()
    {
        var elems_show = document.getElementsByClassName('Répondre');
        for (var i = 0; i < elems_show.length; i++)
        {
            elems_show[i].style.setProperty("visibility", "visible", "important");
        }
        ButtonDisplay(null, true);
    };
    var messages_childs = document.getElementById('messages').getElementsByTagName('div');
    for (var i = - 2; i < messages_childs.length; i = i + 3)
    {
        if (i == - 2 || i == - 1)
        {
            continue;
        }
        var message = messages_childs[i];
        var element2 = message.getElementsByTagName('a')[0];
        var user_url_split = element2.href.split('/');
        var username = user_url_split[5];
        var pv = message.parentNode.className.split(' ')[1];
        var btn, id, color, what;
        if ((username !== x) && (pv !== 'private'))
        {
            btn = 'MP Site';
            id = 'MP-' + username;
            color = '#555';
            what = message.parentNode.className.split(' ')[1].split('-')[1];
            BuildLink(btn, message, id, color, what);
            btn = 'Répondre';
            id = '@' + username;
            color = '#333';
            what = '@' + username + ' ';
            BuildLink(btn, message, id, color, what);
        }
    }
    document.getElementById('messages').addEventListener('DOMNodeInserted', function (event)
                                                         {
        if (event.target.parentNode.id == 'messages')
        {
            var element = document.getElementsByClassName(event.target.className)[0];
            var here = element.getElementsByTagName('div')[0];
            var element2 = element.getElementsByTagName('a')[0];
            var user_url_split = element2.href.split('/');
            var username = user_url_split[5];
            var pv = element.className.split(' ')[1];
            var btn, id, color, what;
            if ((username !== x) && (pv !== 'private'))
            {
                btn = 'MP Site';
                id = 'MP-' + username;
                color = '#555';
                what = element.className.split(' ')[1].split('-')[1];
                BuildLink(btn, here, id, color, what);
                btn = 'Répondre';
                id = '@' + username;
                color = '#333';
                what = '@' + username + ' ';
                BuildLink(btn, here, id, color, what);
            }
        }
    }, false);
}
function BuildLink(name, position, id, color, what)
{
    var link = document.createElement('a');
    link.setAttribute('class', name);
    link.setAttribute('name', id);
    link.setAttribute('style', 'color:' + color + ';');
    link.addEventListener('click', function ()
                          {
        ButtonClicked(name, what, id);
    }, false);
    var button_name = document.createTextNode(name);
    link.appendChild(button_name);
    var emplacement_0 = position;
    var emplacement_1 = emplacement_0.getElementsByTagName('div')[0];
    emplacement_1.appendChild(link);
}
function ButtonClicked(name, x, id)
{
    if (name === "MP Site")
    {
        GM_openInTab("https://www.t411.al/mailbox/compose/?to="+x,false);
    }
    else
    {
        document.getElementById('text-input').focus();
        var text = document.getElementById('text-input').value;
        if (!text.match(/\s$/))
        {
            if (name === "Répondre")
            {
                document.getElementById('text-input').value = x + text;
            }
            else {
                if (!text)
                {
                    document.getElementById('text-input').value = x;
                }
                else
                {
                    document.getElementById('text-input').value = text + ' ' + x;
                }
            }
        }
        else
        {
            document.getElementById('text-input').value = text + x;
        }
        if (name === "Répondre")
        {
            var elems_hide = document.getElementsByName(id);
            for (var i = 0; i < elems_hide.length; i++)
            {
                elems_hide[i].style.setProperty("visibility", "hidden", "important");
            }
            ButtonDisplay(id, false);
        }
    }
}
function ButtonDisplay(id, check)
{
    if (check)
    {
        document.getElementById('messages').addEventListener('DOMNodeInserted', function (e)
                                                             {
            if (e.target.parentNode.id == 'messages')
            {
                var elems_show = document.getElementsByClassName('Répondre');
                for (var i = 0; i < elems_show.length; i++)
                {
                    elems_show[i].style.setProperty("visibility", "visible", "important");
                }
            }
        }, false);
    }
    else
    {
        document.getElementById('messages').addEventListener('DOMNodeInserted', function (e) {
            if (e.target.parentNode.id == 'messages')
            {
                var elems_hide = document.getElementsByName(id);
                for (var i = 0; i < elems_hide.length; i++)
                {
                    elems_hide[i].style.setProperty("visibility", "hidden", "important");
                }
            }
        }, false);
    }
}
function addClearButton()
{
    var clear_button = document.createElement('input');
    clear_button.setAttribute('type', 'button');
    clear_button.setAttribute('class', 'button');
    clear_button.setAttribute('id', 'clear');
    clear_button.setAttribute('value', 'Effacer @pseudo');
    var history_button = document.getElementById('history');
    var parentDiv = history_button.parentNode;
    parentDiv.insertBefore(clear_button, history_button);
    clear_button.addEventListener('click', function ()
                                  {
        clearText();
    }, false);
}
function clearText()
{
    var elems_show = document.getElementsByClassName('Répondre');
    for (var i = 0; i < elems_show.length; i++)
    {
        elems_show[i].style.setProperty("visibility", "visible", "important");
    }
    ButtonDisplay(null, true);
    document.getElementById('text-input').focus();
    var text = document.getElementById('text-input').value;
    var newtext = text.replace(/@\S+(\s:\s|\s:|\s)?/gi, '');
    document.getElementById('text-input').value = newtext;
}
INIT();