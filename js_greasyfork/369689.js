// ==UserScript==
// @name         Forum WS - Masquer les messages et citations
// @namespace    Forum-WS
// @version      1.6
// @description  Masquer les messages et les citations d'un ou de plusieurs utilisateur(s) dans le forum WS
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369689/Forum%20WS%20-%20Masquer%20les%20messages%20et%20citations.user.js
// @updateURL https://update.greasyfork.org/scripts/369689/Forum%20WS%20-%20Masquer%20les%20messages%20et%20citations.meta.js
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

    Cacher_Messages(utilisateur,nouvelAvatar);
    Cacher_Quotes(utilisateur);
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
        var re = /(.+?) (a écrit\s?|wrote):.*/;
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