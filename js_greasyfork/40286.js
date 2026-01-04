// ==UserScript==
// @name           AlloResto410
// @description    Semi-automatically request a restoration for unfairly 410ed topics
// @author         Blaff
// @namespace      AlloResto410
// @version        v1.0.0
// @match          http*://*.jeuxvideo.com/forums/42-*
// @match          http*://*.jeuxvideo.com/forums/0-1000017-0-1-0-1-0-aide-aux-utilisateurs.htm*
// @match          http*://*.jeuxvideo.com/forums/create_topic.php?id_forum=1000017*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/40286/AlloResto410.user.js
// @updateURL https://update.greasyfork.org/scripts/40286/AlloResto410.meta.js
// ==/UserScript==

let URL = document.URL;

function onTopicPage() {
    if (!is410()) {
        return;
    }

    let regex = /^(.*?)(\/42-\d+-\d+-)(\d+)(-\d+-\d+-\d+-)(.*?)(\.htm)(.*)$/i;

    let [_, base, ids, page, nums, title, htm, anchor] = URL.match(regex);

    let cleanUrl = "http://www.jeuxvideo.com/forums" + ids + "1" + nums + title + htm;
    let cleanTitle = title.replace(/-/g, " ").trim();

    let requestTitle = '[Restauration] "' + cleanTitle[0].toUpperCase() + cleanTitle.slice(1) + '"';
    let requestMessage = "Bonjour,\n\n"
                       + "Je souhaiterais demander la restauration d'un topic qui me semble avoir été supprimé à tort, "
                       + "son contenu ne présentant rien qui ne soit à ma connaissance hors-charte.\n\n"
                       + "Voici le lien vers le topic en question: " + cleanUrl + "\n\n"
                       + "D'avance, merci !";

    let encodedTitle = encode(requestTitle);
    let encodedMessage = encode(requestMessage);

    let newTopicUrl = base;

    if (isMobile()) {
        newTopicUrl += "/create_topic.php?id_forum=1000017";
    } else {
        newTopicUrl += "/0-1000017-0-1-0-1-0-aide-aux-utilisateurs.htm";
    }

    let requestUrl = newTopicUrl + "#alloresto_" + encodedTitle + "_" + encodedMessage;

    let errorImage = getErrorImage();
    let href = requestUrl;
    let text = "Demander une restauration du topic";
    let style = "margin-left: auto;margin-right: auto;display: table;text-align: center;"
    let buttonHTML = `<a class="btn button" href="${href}" style="${style}" alt="${text}">${text}</a>`;

    errorImage.insertAdjacentHTML("afterend", buttonHTML);
}

function onForumPage() {
    if (!isAlloResto()) {
        return;
    }

    let regex = /^.*#alloresto_(.*?)_(.*)$/i;

    let [_, encodedTitle, encodedMessage] = URL.match(regex);

    let title = decode(encodedTitle);
    let message = decode(encodedMessage);

    let titleInput = document.getElementById("titre_topic");
    let messageInput = document.getElementById("message_topic");

    titleInput.value = title;
    messageInput.value = message;

    messageInput.focus();
}

function encode(text) {
    return btoa(encodeURI(text));
}

function decode(text) {
    return decodeURI(atob(text));
}

function is410() {
    let image = getErrorImage();
    if (!image) {
        return false;
    }
    if (image.alt.trim().toUpperCase() != "ERREUR 410") {
        return false;
    }
    return true;
}

function isAlloResto() {
    return URL.indexOf("#alloresto_") > -1;
}

function isMobile() {
    return URL.indexOf("/m.jeuxvideo.com/") > -1;
}

function isTopicPage() {
    return URL.indexOf("/forums/42") > -1;
}

function getErrorImage() {
    return document.getElementsByClassName("img-erreur")[0];
}

function main() {
    if (isTopicPage()) {
        onTopicPage();
    } else {
        onForumPage();
    }
}

main();
