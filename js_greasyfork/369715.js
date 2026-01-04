// ==UserScript==
// @name         Forum WS - Masquer les messages Chatbox
// @namespace    Forum-WS-Chatbox
// @version      1.6
// @description  Masquer les messages d'un ou de plusieurs utilisateur(s) dans la Chatbox du forum WS
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369715/Forum%20WS%20-%20Masquer%20les%20messages%20Chatbox.user.js
// @updateURL https://update.greasyfork.org/scripts/369715/Forum%20WS%20-%20Masquer%20les%20messages%20Chatbox.meta.js
// ==/UserScript==

function INIT()
{
    // --- Début Configuration du script ---

    // -- Exemple de configuration pour masquer les messages d'un utilisateur --
    //var utilisateur = "nom-utilisateur";
    // -- Exemple de configuration pour masquer les messages de plusieurs utilisateurs --
    //var utilisateur = ["nom-utilisateur1","nom-utilisateur2","nom-utilisateur3"];

    var utilisateur = "changez-moi"; // Configurer le (ou les) nom(s) ici

    // --- Fin Configuration du script ---

    Cacher_Messages(utilisateur);
}

function Cacher_Messages(x)
{
    var check;
    var url = window.location.href;
    var checkUrl = url.split("/")[4];
    if (checkUrl === "chat")
    {
        check = "chatList";
    }
    else
    {
        check = "ajaxChatChatList";
    }
    if (document.getElementById(check))
    {
        document.getElementById(check).addEventListener('DOMNodeInserted', function (event)
                                                        {
            if (event.target.parentNode.id == check)
            {
                var content = document.getElementById(event.target.id);
                var old_content = content.getElementsByTagName('span')[0].className;
                if (old_content !== "hidden_msg")
                {
                    var user = content.getElementsByTagName('span')[1].textContent;
                    if (x.indexOf(user) >= 0)
                    {
                        var date = content.getElementsByTagName('span')[0].textContent;
                        var save_content = content.innerHTML;
                        var id = content.id;
                        var number = /\d+/;
                        id = id.match(number)[0];
                        var hidden_id = "m_hidden_" + id;
                        var message_id = "message_" + id;
                        if (check === "chatList")
                        {
                            content.style.minHeight = "32px";
                            content.innerHTML = "<span class='hidden_msg' id='" + hidden_id + "' style=\"display: inline;\"><span class=\"dateTime\">" + date + "</span> <span style=\"color:grey\"><b>" + user + "</b></span>:<b> Message masqué</b><br /><i>Passez la souris pour voir le message</i></span>";
                        }
                        else
                        {
                            content.innerHTML = "<span class='hidden_msg' id='" + hidden_id + "' style=\"display: inline;\"><span class=\"dateTime\">" + date + "</span> <span style=\"color:grey\"><b>" + user + "</b></span>:<b> Message masqué</b><i> &nbsp;&nbsp;&nbsp;&nbsp;Passez la souris pour voir le message</i></span>";
                        }
                        content.innerHTML = content.innerHTML + "<span id='" + message_id + "' style=\"display: none;\">" + save_content + "</span>";
                        Script(content,message_id,hidden_id);
                    }
                }
                else
                {
                    var old_id = content.id;
                    var old_number = /\d+/;
                    old_id = old_id.match(old_number)[0];
                    var old_hidden_id = "m_hidden_" + old_id;
                    var old_message_id = "message_" + old_id;
                    Script(content,old_message_id,old_hidden_id);
                }
            }
        });
    }
}

function Script(block,hidden,visible)
{
    hidden = document.getElementById(hidden);
    visible = document.getElementById(visible);
    block.addEventListener("mouseover", function() {
        visible.style.display = "none";
        hidden.style.display = "inline";
    }, false);
    block.addEventListener("mouseout", function() {
        hidden.style.display = "none";
        visible.style.display = "inline";
    }, false);
}

INIT();