// ==UserScript==
// @name        Topic BL + Total Blacklist
// @namespace   topicbltotalblacklist
// @description Efface les topics et messages en se basant sur quelques mots-clés + Cache les topics et messages des pseudos blacklistés depuis l'installation de ce script
// @include     http://www.jeuxvideo.com/forums/*
// @include     https://www.jeuxvideo.com/forums/*
// @author      Alectrona (Topic BL) + CrazyJeux/Darling-Do (Total Blacklist)
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/407414/Topic%20BL%20%2B%20Total%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/407414/Topic%20BL%20%2B%20Total%20Blacklist.meta.js
// ==/UserScript==

// Les mots clés sont à droite (:hap:), NE VA PAS LES REGARDER SI TU AS PEUR D'ETRE SPOIL ANDOUILLE

var motsclespersos = /(\bAneryl\b|Arenyl|Aneryl|Ton KJ|de poche|🐊|Reacprout|hinahuto.jpg|gwers|1571289769-55.png|Amerryl|1571288965-22.png|1570085899-pasmuse.png|1571289769-11.png|1570085900-untitled-1.png|1570085901-oui.png|1570113388-plores.png|1570155034-zeazt.png|1573765454-1572094768-1570435326-efb3377abbf8759de211d8a87b7619a2-removebg-preview.png|1570085896-koi.png|1594108145-5.png|1571289319-11.png|1570085897-fgdsfsd.png|1570110680-yenamare.png|1572220101-fluffywilly.png|1570094635-swt.png|1570272502-sdsdsf.png|1571288965-33.png|1570155034-aze.png|1570155034-azert.png|1594108097-44-2.png|1593978548-11-3.png|1593978564-11-2.png|1594108098-44-1.png|1572224703-okza.png|1571288965-44.png|1572224580-paoz.png|1572224580-dki.png|1572219929-willynoel.png|1572220832-blasewilly.png|1577180417-fdsfkdsopfkpso.png|1577194517-noeled.png|1588419089-1-3.png|kient|1595017152-ka.png)/gi;

// Ajoute tes propres mots-clés, c'est insensible à la casse.
// Pour les caractères suivants, il faut mettre un backslash devant : . \ + * ? [ ^ ] $ ( ) { } = ! < > | : - (exemple : \? pour ?)
// Si tu veux blacklist le mot uniquement, par exemple cul, et pas culote ou enculé, il faut écrire \bcul\b

var listesujets = document.getElementsByClassName("lien-jv topic-title");

for (j = 0; j < listesujets.length; j++) {

    var titresujet = listesujets[j].title;

    if(titresujet.match(motsclespersos)) {

        listesujets[j].parentNode.parentNode.style.display = "none";
    }
}

var messages = document.getElementsByClassName("txt-msg  text-enrichi-forum");

for (i = 0; i < messages.length; i++) {

    var mes = messages[i].innerHTML;
    if (mes.match(motsclespersos)) {

        document.getElementsByClassName("bloc-message-forum ")[i].style.display = "none";

    }
}


    var showInfoBar = true;

function handleBlacklist() {
    var nickname = this.parentNode.parentNode.querySelector("a.bloc-pseudo-msg");
    if (nickname === null) {
        alert("Erreur : le script TotalBlacklist n'a pas pu enregistrer cet utilisateur.");
        return;
    }
    nickname = nickname.textContent.replace(/[\s\n]/g, "").toLowerCase();
    //Don't register users that cannot be blacklisted (admins, ...)
    /*var timer = setInterval(function () {
     var element = document.querySelector(".modal-generic-content");
     if (element !== null) {
     clearInterval(timer);
     if (element.textContent.indexOf("Cet utilisateur a bien été ajouté à la blacklist de votre compte") >= 0) {*/
    addToBlacklist(nickname);
    /*}
     }
     }, 25);*/

    //Useful for administrator/moderator messages
    var msgs = document.querySelectorAll(".bloc-message-forum");
    for (var i = 0; i < msgs.length; i++) {
        var messageAuthor = msgs[i].querySelector("a.bloc-pseudo-msg");
        if (messageAuthor !== null) {
            messageAuthor = messageAuthor.innerHTML.replace(/[\s\n]/g, "").toLowerCase();
            if (messageAuthor === nickname) {
                msgs[i].style.display = "none";
                msgs[i].className += " hiddenbytotalblacklist";
            }
        }
    }
}

function handleUnblacklist() {
    var nickname = this.parentNode.querySelector("a");
    if (nickname === null) {
        alert("Erreur : le script TotalBlacklist n'a pas pu désenregistrer cet utilisateur.");
        return;
    }
    var href = nickname.getAttribute("href");
    nickname = href.substring(1, href.substring(1).indexOf("/") + 1).replace(/[\s\n]/g, "").toLowerCase();
    removeFromBlacklist(nickname);
}

function addToBlacklist(nickname) {
    if (nickname === "auteurblacklisté" || nickname === "#") {
        return;
    }
    //console.log("nickname to blacklist: '" + nickname + "'");
    var currentArray = localStorage.getItem("blacklisted");
    //console.log("currentArray before: " + currentArray);
    if (currentArray === null || currentArray === "") {
        currentArray = [];
    } else {
        currentArray = JSON.parse(currentArray);
    }
    if (currentArray.indexOf(nickname) < 0) {
        currentArray.push(nickname);
        //console.log("currentArray after: " + JSON.stringify(currentArray, null, 4));
        localStorage.setItem("blacklisted", JSON.stringify(currentArray));
    }
}

function removeFromBlacklist(nickname) {
    if (nickname === "auteurblacklisté" || nickname === "#") {
        return;
    }
    //console.log("nickname to unregister: '" + nickname + "'");
    var blacklisted = localStorage.getItem("blacklisted");
    //console.log("blacklisted before: " + blacklisted);
    if (blacklisted === null || blacklisted === "") {
        return;
    }
    blacklisted = JSON.parse(blacklisted);
    var index = blacklisted.indexOf(nickname);
    if (index >= 0) {
        blacklisted.splice(index, 1);
        //console.log("blacklisted after: " + JSON.stringify(blacklisted, null, 4));
        localStorage.setItem("blacklisted", JSON.stringify(blacklisted));
    }
}

function handleShowHiddenMessages() {
    var hiddenElements = document.querySelectorAll(".hiddenbytotalblacklist");
    if (hiddenElements.length > 0) {
        this.innerHTML = "cacher";
        for (var i = 0; i < hiddenElements.length; i++) {
            var el = hiddenElements[i];
            //If message
            if (el.tagName !== "LI") {
                el.style.display = "block";
            } else { //If thread
                //Doesn't work?
                //el.style.display = "cell";
                //el.style.cssText = "display: cell;";
                el.style.display = "table-row";
            }
            el.className = el.className.replace("hiddenbytotalblacklist", "shownbytotalblacklist");
        }
        return;
    }
    var shownElements = document.querySelectorAll(".shownbytotalblacklist");
    if (shownElements.length > 0) {
        this.innerHTML = "voir";
        for (var i = 0; i < shownElements.length; i++) {
            var el = shownElements[i];
            el.style.display = "none";
            el.className = el.className.replace("shownbytotalblacklist", "hiddenbytotalblacklist");
        }
    }
}

function handleShowBlacklistedUsers() {
    var listofblacklistedusers = this.parentNode.querySelector("#listofblacklistedusers");
    var d = listofblacklistedusers.style.display;
    listofblacklistedusers.style.display = ((d === "inline") ? "none" : "inline");
    this.innerHTML = ((d === "inline") ? "voir" : "cacher");
}

function handleUnblacklistAllUsers() {
    localStorage.setItem("blacklisted", "[]");
    //Show all the hidden messages/threads on this page
    //Messages
    var hidden = document.querySelectorAll(".msg-pseudo-blacklist, .hiddenbytotalblacklist");
    for (var i = 0; i < hidden.length; i++) {
        var message = hidden[i];
        if (message.tagName !== "LI") {
            message.style.display = "block";
            message.className = message.className.replace("hiddenbytotalblacklist", "").replace("shownbytotalblacklist", "");
        }
    }
    //Threads
    var threadsAuthors = document.querySelectorAll("li.hiddenbytotalblacklist, li.shownbytotalblacklist");
    for (var i = 0; i < threadsAuthors.length; i++) {
        threadsAuthors[i].style.display = "table-row";
        //threadsAuthors[i].style.cssText = "display: cell";
        threadsAuthors[i].className = threadsAuthors[i].className.replace("hiddenbytotalblacklist", "").replace("shownbytotalblacklist", "");
    }
    alert("Tous les pseudos ont bien été retirés de la blacklist du script.\n\nAttention, ils n'ont pas été retirés de votre blacklist sur JVC.\n\n"
        + "Plus aucun pseudo n'est blacklisté, la barre d'informations va donc être supprimée.");
    document.querySelector("#totalblacklistbar").remove();
}

function handleUnblacklistSingleUser() {
    var nickname = this.innerHTML.trim();
    removeFromBlacklist(nickname);
    //Show all their hidden messages/threads on this page
    var nbMsgsShown = 0;
    //Messages
    var hidden = document.querySelectorAll(".msg-pseudo-blacklist");
    for (var i = 0; i < hidden.length; i++) {
        var messageAuthor = hidden[i].querySelector(".liens-blacklist a");
        var href = messageAuthor.getAttribute("href");
        messageAuthor = href.substring(1, href.substring(1).indexOf("/") + 1).replace(/[\s\n]/g, "").toLowerCase();
        if (messageAuthor === nickname) {
            hidden[i].style.display = "block";
            hidden[i].className = hidden[i].className.replace("hiddenbytotalblacklist", "").replace("shownbytotalblacklist", "");
            nbMsgsShown++;
        }
    }
    //Useful for administrator/moderator messages
    var msgs = document.querySelectorAll(".bloc-message-forum");
    for (var i = 0; i < msgs.length; i++) {
        if (msgs[i].style.display === "none") {
            var messageAuthor = msgs[i].querySelector("a.bloc-pseudo-msg");
            if (messageAuthor !== null) {
                messageAuthor = messageAuthor.innerHTML.replace(/[\s\n]/g, "").toLowerCase();
                if (messageAuthor === nickname) {
                    msgs[i].style.display = "block";
                    msgs[i].className = msgs[i].className.replace("hiddenbytotalblacklist", "").replace("shownbytotalblacklist", "");
                    nbMsgsShown++;
                }
            }
        }
    }
    //Threads
    var threadsAuthors = document.querySelectorAll(".topic-author");
    for (var i = 0; i < threadsAuthors.length; i++) {
        var threadAuthor = threadsAuthors[i].textContent.replace(/[\s\n]/g, "").toLowerCase();
        if (threadAuthor === nickname) {
            var thread = threadsAuthors[i].parentNode;
            while (thread.tagName !== "LI") {
                thread = thread.parentNode;
            }
            thread.style.display = "table-row";
            //thread.style.cssText = "display: cell";
            thread.className = thread.className.replace("hiddenbytotalblacklist", "").replace("shownbytotalblacklist", "");
            nbMsgsShown++;
        }
    }
    var bar = document.querySelector("#totalblacklistbar");
    var numberofhiddenmessages = bar.querySelector("#numberofhiddenmessages");
    var prevNbMsgs = parseInt(numberofhiddenmessages.innerHTML, 10);
    var newNbMsgs = prevNbMsgs - nbMsgsShown;
    numberofhiddenmessages.innerHTML = newNbMsgs;
    var s = nickname + " a bien été retiré de la blacklist du script.\n\nAttention, il n'a pas été retiré de votre blacklist sur JVC.";
    var numberofblacklistedusers = bar.querySelector("#numberofblacklistedusers");
    var prevNbAuthors = parseInt(numberofblacklistedusers.innerHTML, 10);
    if (prevNbAuthors === 1) {
        s += "\n\nPlus aucun pseudo n'est blacklisté, la barre d'informations a donc été supprimée.";
        bar.remove();
    } else {
        numberofblacklistedusers.innerHTML = (prevNbAuthors - 1);
        this.remove();
    }
    alert(s);
}

function callMe() {
    var attr = document.body.getAttribute("data-totalblacklist");
    if (attr === null || attr === "") {
        document.body.setAttribute("data-totalblacklist", "true");
    } else {
        return;
    }

    var nbHidden = 0;

    //Hide some threads on the forum main page
    var nbHiddenThreads = 0;
    var topicIDs = [];
    var table = document.querySelector(".topic-list");
    if (table !== null) {
        var TRs = table.querySelectorAll("li[data-id]");
        for (var i = 0; i < TRs.length; i++) {
            var topicID = TRs[i].getAttribute("data-id");
            topicIDs.push(topicID);
        }

        var blacklisted = localStorage.getItem("blacklisted");
        //console.log("blacklisted: " + blacklisted);
        if (blacklisted !== null && blacklisted !== "") {
            blacklisted = JSON.parse(blacklisted);
            if (blacklisted.length > 0) {
                var topicAuthors = table.querySelectorAll(".topic-author");
                for (var i = 0; i < topicAuthors.length; i++) {
                    var author = topicAuthors[i].textContent.replace(/[\s\n]/g, "").toLowerCase();
                    //console.log("author: '"+author+"'");
                    if (blacklisted.indexOf(author) >= 0) {
                        topicAuthors[i].parentNode.style.display = "none";
                        topicAuthors[i].parentNode.className += " hiddenbytotalblacklist";
                        nbHidden++;
                        nbHiddenThreads++;
                    }
                }
            }
        }
    }

    //Unregister every user that was in the localStorage but who isn't blacklisted anymore
    //Commented out so that you can blacklist moderators and administrators if they send a message as a regular user ;)
    /*var messages = document.querySelectorAll(".bloc-message-forum");
     for (var i = 0; i < messages.length; i++) {
     if (messages[i].style.display !== "none") {
     var nickname = messages[i].querySelector(".bloc-pseudo-msg").textContent.replace(/[\s\n]/g, "").toLowerCase();
     removeFromBlacklist(nickname);
     }
     }*/

    //Unregister every user we unblacklist
    //Also register every blacklisted user that isn't in the localStorage yet
    var unblacklistButtons = document.querySelectorAll(".btn-blacklist-cancel");
    for (var i = 0; i < unblacklistButtons.length; i++) {
        unblacklistButtons[i].addEventListener("click", handleUnblacklist, true);
        var nickname = unblacklistButtons[i].parentNode.querySelectorAll("a")[0];
        var href = nickname.getAttribute("href");
        nickname = href.substring(1, href.substring(1).indexOf("/") + 1).replace(/[\s\n]/g, "").toLowerCase();
        addToBlacklist(nickname);
    }

    //Register every user we blacklist
    var blacklistButtons = document.querySelectorAll(".picto-msg-tronche");
    for (var i = 0; i < blacklistButtons.length; i++) {
        blacklistButtons[i].addEventListener("click", handleBlacklist, true);
    }

    //Hide some messages in a thread
    var hiddenMessages = document.querySelectorAll(".msg-pseudo-blacklist");
    for (var i = 0; i < hiddenMessages.length; i++) {
        hiddenMessages[i].style.display = "none";
        hiddenMessages[i].className += " hiddenbytotalblacklist";
    }

    var blacklisted = localStorage.getItem("blacklisted");
    if (blacklisted !== null && blacklisted !== "" && blacklisted !== "[]") {
        blacklisted = JSON.parse(blacklisted);
        var messages = document.querySelectorAll(".bloc-message-forum");
        for (var i = 0; i < messages.length; i++) {
            var messageAuthorDiv = messages[i].querySelector("a.bloc-pseudo-msg");
            if (messageAuthorDiv !== null) {
                var messageAuthor = messageAuthorDiv.innerHTML.replace(/[\s\n]/g, "").toLowerCase();
                if (blacklisted.indexOf(messageAuthor) >= 0) {
                    messages[i].style.display = "none";
                    messages[i].className += " hiddenbytotalblacklist";
                    nbHidden++;
                }
            }
        }
    }

    //Load the next threads to compensate the "holes"
    if (nbHiddenThreads > 0) {
        var nbHiddenThreadsBase = nbHiddenThreads;
        var nextPageButton = document.querySelector(".pagi-suivant-actif");
        if (nextPageButton !== null) {
            var curNbOfCalls = 0;
            var nextUrl = "http://" + window.location.hostname + nextPageButton.getAttribute("href");
            (function loop(nextUrl, curNbOfCalls, nbHiddenThreadsBase) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        curNbOfCalls++;

                        var nextPageContent = document.createElement('div');
                        nextPageContent.innerHTML = xmlhttp.responseText;

                        var stop = false;
                        var remoteTable = nextPageContent.querySelector(".topic-list");
                        if (remoteTable !== null) {
                            var remoteTRs = remoteTable.querySelectorAll("li[data-id]");
                            for (var i = 0; i < remoteTRs.length; i++) {
                                var remoteTopicID = remoteTRs[i].getAttribute("data-id");
                                if (topicIDs.indexOf(remoteTopicID) < 0) {
                                    var topicAuthorDiv = remoteTRs[i].querySelector(".topic-author");
                                    if (topicAuthorDiv !== null) {
                                        var topicAuthor = topicAuthorDiv.textContent.replace(/[\s\n]/g, "").toLowerCase();
                                        if (blacklisted.indexOf(topicAuthor) < 0) {
                                            table.appendChild(remoteTRs[i]);
                                            nbHiddenThreadsBase--;
                                            if (nbHiddenThreadsBase === 0) {
                                                stop = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (stop === true || curNbOfCalls > 2) {
                            return;
                        }
                        var nextPageButton = nextPageContent.querySelector(".pagi-suivant-actif");
                        if (nextPageButton !== null) {
                            var nextUrl = "http://" + window.location.hostname + nextPageButton.getAttribute("href");
                            loop(nextUrl, curNbOfCalls, nbHiddenThreadsBase);
                        }
                    }
                };
                xmlhttp.open("GET", nextUrl, true);
                xmlhttp.send();
            })(nextUrl, curNbOfCalls, nbHiddenThreadsBase);
        }
    }

    //Show an info bar about the users blacklisted by this script
    if (showInfoBar === true) {
        var div = document.createElement("div");
        div.id = "totalblacklistbar";
        div.innerHTML = "<span id='numberofhiddenmessages'></span> messages/topics cachés (<span id='showhiddenmessages'>voir</span>) | " +
            "<span id='numberofblacklistedusers'></span> pseudos blacklistés en tout (<span id='showallblacklistedusers'>voir</span>) " +
            "<span id='listofblacklistedusers' style='display: none;'></span> | "
            + "<span id='unblacklistallusers'>Déblacklister tout le monde</span><br /><br />";
        //Uncomment if dark theme
        //div.style.color = "white";
        var nextElement = document.querySelector(".bloc-message-forum");
        if (nextElement === null) {
            nextElement = document.querySelector(".topic-list");
        }
        nextElement.parentNode.insertBefore(div, nextElement);

        var numberofhiddenmessages = div.querySelector("#numberofhiddenmessages");
        numberofhiddenmessages.innerHTML = nbHidden;

        var showhiddenmessages = div.querySelector("#showhiddenmessages");
        showhiddenmessages.style.cursor = "pointer";
        showhiddenmessages.style.textDecoration = "underline";
        showhiddenmessages.addEventListener("click", handleShowHiddenMessages, true);

        var numberofblacklistedusers = div.querySelector("#numberofblacklistedusers");
        var totalNb = 0;
        var blacklisted = localStorage.getItem("blacklisted");
        if (blacklisted !== null && blacklisted !== "" && blacklisted !== "[]") {
            blacklisted = JSON.parse(blacklisted);
            totalNb = blacklisted.length;
        }
        //No need to show this bar if no one is blacklisted
        if (totalNb === 0) {
            div.remove();
            return;
        }
        numberofblacklistedusers.innerHTML = totalNb;

        var listofblacklistedusers = div.querySelector("#listofblacklistedusers");
        for (var i = 0; i < blacklisted.length; i++) {
            var span = document.createElement("span");
            span.style.cursor = "pointer";
            span.innerHTML = " " + blacklisted[i];
            span.title = "Retirer " + blacklisted[i] + " de la blacklist";
            listofblacklistedusers.appendChild(span);
            span.addEventListener("click", handleUnblacklistSingleUser, true);
        }

        var showallblacklistedusers = div.querySelector("#showallblacklistedusers");
        showallblacklistedusers.style.cursor = "pointer";
        showallblacklistedusers.style.textDecoration = "underline";
        showallblacklistedusers.addEventListener("click", handleShowBlacklistedUsers, true);

        var unblacklistallusers = div.querySelector("#unblacklistallusers");
        unblacklistallusers.style.cursor = "pointer";
        unblacklistallusers.style.textDecoration = "underline";
        unblacklistallusers.addEventListener("click", handleUnblacklistAllUsers, true);
    }
}
callMe();

//Respeed
addEventListener('instantclick:newpage', callMe);