// ==UserScript==
// @name         Forum WS - Masquer messages et citations
// @namespace    Forum-WS
// @version      1.1
// @description  Masquer tous les messages et citations d'un ou de plusieurs utilisateur(s) dans le forum WS
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383605/Forum%20WS%20-%20Masquer%20messages%20et%20citations.user.js
// @updateURL https://update.greasyfork.org/scripts/383605/Forum%20WS%20-%20Masquer%20messages%20et%20citations.meta.js
// ==/UserScript==

function INIT() {
    // --- Début Configuration du script ---

    // -- Exemple de configuration pour masquer les messages d'un utilisateur --
    //var utilisateur = "nom-utilisateur";
    // -- Exemple de configuration pour masquer les messages de plusieurs utilisateurs --
    //var utilisateur = ["nom-utilisateur1","nom-utilisateur2","nom-utilisateur3"];

    var utilisateur = "changez-moi"; // Configurer le (ou les) nom(s) ici

    // Configurer l'avatar à afficher ( code HTML )

    var nouvelAvatar = '<img src="https://i.imgur.com/v2HyHJC.png" width="50" height="50" alt="">';

    // --- Fin Configuration du script ---

    Cacher_MessagesShout(utilisateur);
    Cacher_Messages(utilisateur,nouvelAvatar);
    Cacher_Quotes(utilisateur);
}

function Cacher_MessagesShout(x)
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

function Cacher_Messages(x,avatar) {
    var message = document.getElementsByClassName('postbody');
    for (var i = 0; i < message.length; i++)
    {
        var user = message[i].getElementsByTagName('dt')[0];
        if (user)
        {
            user = user.textContent;
            if (x.indexOf(user) >= 0)
            {
                var contentLeft = message[i].getElementsByClassName('postleft')[0];
                var contentRight = message[i].getElementsByClassName('postright')[0];
                var save_contentRight = contentRight.innerHTML;
                var m_hidden_id = "m_hidden_" + i;
                var message_id = "message_" + i;
                contentLeft.innerHTML = "<dl><dt><strong><span style=\"color:grey\">" + user + "</span></strong></dt><dd class=\"usertitle\"><strong>Membre bloqué</strong></dd><dd class=\"postavatar\">" + avatar + "</dd></dl>";
                contentRight.innerHTML = "<div id='" + m_hidden_id + "' style=\"display: inline;\"><ul><li><b>Les messages de ce membre sont masqués</b><i> ( passez la souris pour voir le message )</i></li></ul></div>";
                contentRight.innerHTML = contentRight.innerHTML + "<div id='" + message_id + "' style=\"display: none;\">" + save_contentRight + "</div>";
                Script(contentRight,message_id,m_hidden_id);
            }
        }
    }
}

function Cacher_Quotes(x) {
    var quote = document.getElementsByClassName('quotebox');
    for (var j = 0; j < quote.length; j++)
    {
        var quote_content = quote[j].textContent;
        var correctQuote = quote[j].getElementsByTagName('cite')[0];
        var quote_user;
        var re = /(.+?) (a écrit\s|wrote):.*/;
        if (correctQuote) {
            quote_user = correctQuote.textContent;
            quote_user = quote_user.replace(re, '$1');
        } else {
            quote_user = quote_content.replace(re, '$1');
        }
        if (x.indexOf(quote_user) >= 0)
        {
            var save_quote_content = quote[j].innerHTML;
            var q_hidden_id = "q_hidden_" + j;
            var quote_id = "quote_" + j;
            quote[j].innerHTML = "<div id='" + q_hidden_id + "' style=\"display: inline;\"><ul><li><b>Les citations de '" + quote_user + "' sont masquées</b><i> ( passez la souris pour voir la citation )</i></li></ul></div>";
            quote[j].innerHTML = quote[j].innerHTML + "<div id='" + quote_id + "' style=\"display: none;\">" + save_quote_content + "</div>";
            Script(quote[j],quote_id,q_hidden_id);
        }
    }
}

function Script(block,hidden,visible) {
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