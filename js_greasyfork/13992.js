// ==UserScript==
// @name        T411 Shoutbox - MP
// @namespace   https://www.t411.io
// @description Permet d'envoyer un MP a quelqu'un non présent en shout
// @include     http://www.t411.al/chati/*
// @include     https://www.t411.al/chati/*
// @version     1.7.1
// @author      RavenRoth
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13992/T411%20Shoutbox%20-%20MP.user.js
// @updateURL https://update.greasyfork.org/scripts/13992/T411%20Shoutbox%20-%20MP.meta.js
// ==/UserScript==
function add() {
    //Create an input type dynamically.   
    var element = document.createElement('input');
    //Assign different attributes to the element. 
    element.type = 'button';
    element.value = 'MP Shout'; // Really? You want the default value to be the type string?
    element.name = 'MPShout'; // And the name too?
    element.className = 'button';
    element.onclick = function () { // Note this is a function
        var pseudo = prompt('Envoyer un message à', '');
        if (!pseudo) {
            return false;
        }
        GR_getID(pseudo,'');
    };
    var foo = document.getElementById('chat');
    //Append the element in page (in span).  
    foo.insertBefore(element, document.getElementById('online'));
}
function GR_getID(name, message)
{
    console.log(message);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            ExtractID(xhttp);
        } 
        else if (xhttp.readyState == 4 && xhttp.status == 404)
        {
            alert('Utilisateur ' + name + ' inconnu.');
        }
    };
    xhttp.open('GET', document.location.protocol + '//www.t411.al/users/profile/' + name, true);
    xhttp.send();
    function ExtractID(xml) {
        var xmlDoc = xml.response;
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = xmlDoc.replace(/<script(.|\s)*?\/script>/g, '');
        var aTags = tempDiv.getElementsByTagName('a');
        var searchText = 'Voir Historique des Commentaires';
        var found;
        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == searchText) {
                found = aTags[i];
                break;
            }
        }
        if (found)
        {
            sendMP(found.getAttribute('href').split('=') [1], name, message);
        } 
        else
        {
            alert('Impossible d\'extraires les infos de ' + name);
        }
    }
}
function sendMP(msguid, msgname, message)
{
    var $button = $(this);
    var uid = msguid;
    var toName = msgname;
    if (!message)
        message = prompt('Message pour ' + toName, message);
    if (!message) {
        return false;
    }
    $.ajax({
        url: '/chati/private.php',
        data: {
            id: uid,
            text: message
        },
        dataType: 'json',
        type: 'post'
    });
    return false;
}
function ShoutCommand() {
    document.getElementById('send').addEventListener('click', function () {
        var textbox = document.getElementById('text-input');
        text = textbox.value.trim();
        if (text.toLowerCase()=='/mp' || text.substring(0, 4).toLowerCase() == '/mp ') {
            var analyse = text.split(' ');
            var pseudo = analyse[1];
            if (pseudo)
            {
                analyse.splice(0, 2);
                var message = analyse.join(' ');
                GR_getID(pseudo, message);
            } 
            else
            {
                pseudo = prompt('Envoyer un message à', '');
                if (!pseudo) {
                    alert('Veuillez préciser un pseudo');
                }
                else
                {
                    GR_getID(pseudo,'');   
                }
            }

            textbox.value = '';
        }
    });
}
add();
ShoutCommand();
