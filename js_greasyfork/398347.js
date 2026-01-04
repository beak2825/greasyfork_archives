// ==UserScript==
// @name         Forum WS - Changer grade / couleur / titre [Fun]
// @namespace    Forum-WS
// @version      1.4
// @description  Changer grade / couleur / titre pour n"importe quel(s) pseudo(s) sur le forum WS
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398347/Forum%20WS%20-%20Changer%20grade%20%20couleur%20%20titre%20%5BFun%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/398347/Forum%20WS%20-%20Changer%20grade%20%20couleur%20%20titre%20%5BFun%5D.meta.js
// ==/UserScript==

function INIT()
{
    // --- Début Configuration du script ---

    // -- Exemple de configuration un seul utilisateur --
    //var utilisateur = "nom-utilisateur";
    //
    // -- Exemple de configuration pour plusieurs utilisateurs --
    //var utilisateur = ["nom-utilisateur1","nom-utilisateur2","nom-utilisateur3"];

    var utilisateur = "changez-moi"; // Mettre le (ou les) pseudo(s) ici

    // Configurer le titre à afficher sous le(s) pseudo(s) :

    var nouveauTitre = "★★★ V I P ★★★";

    // Configurer la couleur du(des) pseudo(s) :

    var nouvelleCouleur = "#ff9933";

    // --- Fin Configuration du script ---

    Chat(utilisateur,nouvelleCouleur);
    TopicList(utilisateur,nouvelleCouleur);
    OnlineList(utilisateur,nouvelleCouleur);
    Forum(utilisateur,nouvelleCouleur,nouveauTitre);
    Profile(utilisateur,nouvelleCouleur,nouveauTitre);
    Ajax(utilisateur,nouvelleCouleur,nouveauTitre);
}

function Chat(x,color)
{
    var url = window.location.href;
    var checkUrl = url.split("/")[4];
    if (checkUrl === "chat")
    {
        Chat_chat(x,color,"chatList");
        Chat_onlineList(x,color,"onlineList");
    }
    else
    {
        Chat_chat(x,color,"ajaxChatChatList");
    }
}

function Chat_chat(x,color,chat_id)
{
    if (document.getElementById(chat_id))
    {
        document.getElementById(chat_id).addEventListener("DOMNodeInserted", function (event)
                                                          {
            if (event.target.parentNode.id == chat_id)
            {
                var content = document.getElementById(event.target.id);
                var contentSpan = content.getElementsByTagName("span")[1];
                var user = contentSpan.textContent;
                if (x.indexOf(user) >= 0)
                {
                    contentSpan.style.fontWeight = "bold";
                    contentSpan.style.color = color;
                }
            }
        });
    }
}

function Chat_onlineList(x,color,chat_id)
{
    if (document.getElementById(chat_id))
    {
        document.getElementById(chat_id).addEventListener("DOMNodeInserted", function (event)
                                                          {
            if (event.target.parentNode.id == chat_id)
            {
                var content = document.getElementById(event.target.id);
                var contentA = content.getElementsByTagName("a")[0];
                var user = contentA.textContent;
                if (x.indexOf(user) >= 0)
                {
                    contentA.className = "";
                    contentA.style.color = color;
                }
            }
        });
    }
}

function TopicList(x,color)
{
    var byuser = document.getElementsByClassName("byuser");
    if (byuser)
    {
        for (var i = 0; i < byuser.length; i++)
        {
            var contentSpan = byuser[i].getElementsByTagName("span")[0];
            var user = contentSpan.textContent;
            if (x.indexOf(user) >= 0)
            {
                contentSpan.style.fontWeight = "bold";
                contentSpan.style.color = color;
            }
        }
    }
}

function OnlineList(x,color)
{
    var onlinelist = document.getElementById("onlinelist");
    if (onlinelist)
    {
        var userlist = onlinelist.getElementsByTagName("span");
        if (userlist)
        {
            for (var i = 0; i < userlist.length; i++)
            {
                var user = userlist[i].textContent;
                if (x.indexOf(user) >= 0)
                {
                    userlist[i].style.fontWeight = "bold";
                    userlist[i].style.color = color;
                }
            }
        }
    }
}

function Forum(x,color,title)
{
    var message = document.getElementsByClassName("postleft");
    if (message)
    {
        for (var i = 0; i < message.length; i++)
        {
            var contentSpan = message[i].getElementsByTagName("span")[0];
            if (contentSpan)
            {
                var user = contentSpan.textContent;
                if (x.indexOf(user) >= 0)
                {
                    contentSpan.style.color = color;
                    var contentTitle = message[i].getElementsByClassName("usertitle")[0];
                    if (contentTitle)
                    {
                        contentTitle.style.fontWeight = "bold";
                        contentTitle.textContent = title;
                    }
                }
            }
        }
    }
}

function Profile(x,color,title)
{
    var viewprofile = document.getElementById("viewprofile");
    if (viewprofile)
    {
        var profileZone = viewprofile.getElementsByClassName("infldset")[0];
        var profileUser = profileZone.getElementsByTagName("span")[0];
        var user = profileUser.textContent;
        if (x.indexOf(user) >= 0)
        {
            profileUser.style.fontWeight = "bold";
            profileUser.style.color = color;
            var profileTitle = profileZone.getElementsByTagName("dd")[1];
            profileTitle.textContent = title;
        }
    }
}

function Ajax(x,color,title)
{
    var oldXHR = window.XMLHttpRequest;
    var stateChangeHandler = function() {
        var ajaxFile = this.responseURL.split("/").pop();
        if (ajaxFile === "topics_ajax.php" && this.readyState == 4 && this.status == 200)
        {
            setTimeout(function() {TopicList(x,color);}, 500);
        }
        var ajaxNewPost = "viewtopic.php?ajax";
        if (ajaxFile.indexOf(ajaxNewPost) >= 0 && this.readyState == 4 && this.status == 200)
        {
            setTimeout(function() {Forum(x,color,title);}, 500);
        }
    };
    var newXHR = function() {
        var xhr = new oldXHR();
        xhr.addEventListener("readystatechange", stateChangeHandler);
        return xhr;
    };
    window.XMLHttpRequest = newXHR;
}

INIT();