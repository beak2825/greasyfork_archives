// ==UserScript==
// @name           JTest
// @description    Outil de discussion instantanée pour les forums de Jeuxvideo.com
// @author         Blaff
// @namespace      JVtet
// @version        0.1.8
// @match          http://*.jeuxvideo.com/forums/42-*
// @match          https://*.jeuxvideo.com/forums/42-*
// @match          http://*.jeuxvideo.com/forums/1-*
// @match          https://*.jeuxvideo.com/forums/1-*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/369409/JTest.user.js
// @updateURL https://update.greasyfork.org/scripts/369409/JTest.meta.js
// ==/UserScript==

/*
ROADMAP:
- La notif de MP est moche si réduit + un long pseudo ne doit pas empêcher de réduire leftbar
- Smooth transition on append messages + Fade-in
- Détection captcha
- Separator des nouveaux messages au changement d'onglet
- Notification des nouveaux messages dans le titre de l'onglet + erreurs aussi
- Si la page retournée vaut 1: bug des messages supprimés, donc on essaye avec la page d'avant, idem s'il y a 0 messages sur la page

- Bouton actualiser les messages (+ afficher le delai courrant d'actualisation)
- Bouton désactiver JVChat
- Bouton retour liste des sujets
- Shift + Enter pour nouvelle ligne sans envoyer
- Citations
- Notification avec @pseudo
- Blacklist
- Pouvoir voir les anciens messages
- La leftbar ne se rétrécie pas si le titre du topic n'a pas d'espaces
*/

let CSS = `<style type="text/css">
#forum-right-col,
#jv-footer,
#middle,
#zone-sponso,
#header-top,
#full-site,
header.jv-header-menu,
.titre-head-bloc,
.bloc-pre-pagi-forum,
.bloc-message-forum,
.bloc-message-forum-anchor,
.bloc-pagi-default,
.bloc-outils-top,
.bloc-outils-bottom,
.previsu-editor,
.option-previsu,
.bloc-sondage,
.nu-context-menu,
.message-lock-topic,
.form-post-message > .row > div:nth-child(2),
.conteneur-messages-pagi > a:last-of-type,
#bloc-meta-titre-jeu,
#page-messages-forum > .container-content > .row:nth-child(1) {
    display: none!important;
}

html,
body,
#content,
#content-context
{
    height: 100%;
}

.jvchat-hide {
    display: none;
}

body {
    overflow-y: unset;
}

.jvchat-disabled-form {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

#bloc-formulaire-forum > .form-post-message > .row {
    margin: 0;
}

.jv-editor > .conteneur-editor > .text-editor {
    border: 0;
    background: none;
    display: flex!important;
}

#jvchat-alerts {
    position: absolute;
    z-index: 3;
    right: 1rem;
    left: 0;
//    left: 15rem;
//    max-height: 100vh;
    overflow-y: hidden;
}

#jvchat-alerts .alert {
    margin: 1rem 2rem;
    border-radius: 0.5rem;
}

#content-context {
    display: flex;
//    min-height: 100vh;
}

#jvchat-leftbar {
    width: 15rem;
//    min-width: 15rem;
    max-width: 15rem;
    flex-shrink: 100;
}

#jvchat-leftbar.jvchat-leftbar-reduced {
    width: 3rem;
    min-width: 3rem;
}

#jvchat-leftbar-reduce-button {
    height: 5rem;
    background-color: red;
    float: bottom;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
}

#page-messages-forum {
//    word-wrap: break-word;
//    width: 100%;
    position: relative;
    flex-grow: 100;
}

#forum-main-col > .conteneur-messages-pagi {
    display: flex;
    flex-direction: column;
//    max-height: 100vh;
    height: 100%;
}

#page-messages-forum > .container-content {
    padding: 0;
    height: 100%;
    width: 100%;
    max-width: unset;
    min-width: unset;
    min-height: unset;
    max-height: unset;
}

.form-post-message {
    margin: 0;
}

#message_topic {
    border-radius: 0.3rem 0 0 0.3rem;
    resize: none;
    border: 0.0625rem solid #BEBECC;
    min-width: unset;
    border-right-width: 0;
}

.jvchat-reduced #message_topic {
    padding: 0.3rem!important;
    height: 1.7rem!important;
}

.jvchat-reduced .jv-editor .conteneur-editor > * {
    display: none;
}

#jvchat-buttons {
    display: flex;
    flex-direction: column;
}

#jvchat-buttons button {
    border: 0.0625rem solid #BEBECC;
    border-left-width: 0;
    padding: 0;
    width: 2rem;
    height: 100%;
    background: white;
    color: gray;
}

#jvchat-buttons button:hover {
    background: lightgray;
    color: black;
}

#jvchat-buttons button:focus {
    border: blue;
}

#jvchat-buttons button::before {
    font-size: 1.4rem;
}

#jvchat-buttons button.icon-reply::before {
    font-size: 1rem;
}

#jvchat-enlarge {
    border-radius: 0 0.3rem 0.3rem 0;
}

#jvchat-reduce {
    border-radius: 0 0 0.3rem 0;
    border-top: 0!important;
}

#jvchat-post {
    border-radius: 0 0.3rem 0 0;
}

#jvchat-buttons button:focus {
    border: dotted 1px!important;
    color: black;
}

#content {
    background-image: none;
    margin-top: 0;
}

#content-forum {
    margin: 0;
    height: 100%;
}

#forum-main-col {
    display: block;
    min-width: 100%;
    padding: 0;
    height: 100%;
    max-width: unset;
}

#jvchat-leftbar > .panel {
//    width: 15rem;
    margin: 0;
    padding: 0 0.5rem;
}

#jvchat-leftbar #jvchat-profil .titre-info-fofo {
    margin-top: 0.5rem;
}

#jvchat-leftbar .titre-info-fofo {
    margin-top: 1rem;
}

.jvchat-message {
    display: flex;
    margin-bottom: 0.35rem;
}

.jvchat-bloc-message {
    animation-duration:0.5s;
    animation-name: slidein;
}

@keyframes slidein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


.jvchat-toolbar {
    margin: 0 0 .3rem 0;
}

.jvchat-author {
    margin: 0;
    display: inline-block;
}

.jvchat-tooltip {
    display: inline-block;
    float: right;
    color: gray;
}

hr.jvchat-ruler:first-of-type {
    margin-top: auto;
}

.jvchat-ruler {
    margin: 0rem 0rem .35rem 0rem;
    border-style: solid inset inset inset;
    border-width: 0.0625rem;
}

.jvchat-bloc-author-content {
    overflow: hidden;
    width: 100%;
    margin-left: .875rem;
}

.jvchat-content > .txt-msg > p:last-of-type {
    margin-bottom: 0;
}

.jvchat-content > .txt-msg p {
    margin-bottom: 0.2rem;
}

.jvchat-content > .txt-msg .blockquote-jv {
    margin: 0.2rem 0;
    padding: 0rem 0.3rem 0 0.3rem;
}

.jvchat-content > .txt-msg > .blockquote-jv > .blockquote-jv:not([data-visible="1"]) {
    padding: 0.7rem 0;
}

.jvchat-rounded {
    overflow: hidden;
    border-radius: 50%;
    background-size:     cover;
    background-repeat:   no-repeat;
    background-position: center center;
}

.jvchat-bloc-avatar {
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    box-shadow: -3px 3px 7px grey;
}

#jvchat-user-avatar-link {
    width: 60%;
    min-width: 3rem;
    min-height: 3rem;
}

.jvchat-user-avatar {
    width: 100%;
    padding-top: 100%;
}

.jvchat-content .img-shack {
    max-height: 39px;
    min-height: 39px;
    width: auto;
    display: inline-block;
    vertical-align: bottom;
    margin-bottom:0.27rem;
}

.jvchat-content .img-stickers {
    max-height: 39px;
    min-height: 39px;
    width: auto;
    display: inline-block;
    vertical-align: bottom;
    margin-bottom:0.1rem;
}

#jvchat-main .bloc-spoil-jv .open-spoil {
    position: unset;
    display: none;
}

#jvchat-user-mp {
    font-size: 1.3rem;
    margin: auto;
}

.new-stickers {
    background-color: unset;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 70px;
    padding-top: 20px;
    border-top: unset;
}

.cat-stickers {
    top: 0;
}

.jvchat-new-stickers-parent {
    height: 70px;
}

#jvchat-user-notif {
    font-size: 1.7rem;
    margin: auto;
}

#jvchat-user-pseudo {
    margin: 0.5rem;
    text-align: center;
    overflow-x: hidden;
}

#jvchat-user-info {
    display: flex;
}

#jvchat-user-info .jv-header-menu {
    position: unset;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: auto;
}

#jvchat-topic-link {
    color: white;
}

#jvchat-topic-info {
    display: flex;
    flex-direction: column;
}

#jvchat-topic-nb-connected {
    color: lightgray;
}

#jvchat-topic-nb-messages {
    color: lightgray;
}

#bloc-formulaire-forum .jv-editor > .conteneur-editor {
    margin: 0;
    border: 0;
    padding: 0.5rem;
    line-height: normal;
}

#jvchat-main {
    overflow-y: auto;
//    max-height: 100vh;
    height: 100%;
    padding: 0.35rem 0.875rem;
    display: flex;
    flex-direction: column;
    min-width: 13rem;
}

#jvchat-leftbar > .panel-jv-forum {
    height: 100%;
    overflow-y: auto;
//    max-height: 100vh;
}


</style>`;

let PANEL = `
<div id='jvchat-leftbar'>
    <div class='panel panel-jv-forum'>
        <div class='panel-body'>
            <div id='jvchat-profil' class='jvchat-hide'>
                <h4 class='titre-info-fofo'>Profil</h4>
                <h4 id='jvchat-user-pseudo'></h4>
                <div id='jvchat-user-info'>
                    <a title="Ouvrir le profil" id="jvchat-user-avatar-link" target="_blank"><div id='jvchat-user-avatar' class='jvchat-rounded jvchat-user-avatar'></div></a>
                    <div class='jv-header-menu'>
                        <a target="_blank" href="http://www.jeuxvideo.com/messages-prives/boite-reception.php" title="Ouvrir la boîte de réception" id="jvchat-user-mp-link"><span id="jvchat-user-mp" class="jv-account-number-mp" data-val="0"></span></a>
                        <a target="_blank" title="Ouvrir les notifications" href="http://www.jeuxvideo.com/messages-prives/boite-reception.php" id="jvchat-user-notif-link"><span id="jvchat-user-notif" class="jv-account-number-notif" data-val="0"></span></a>
                    </div>
                </div>
            </div>
            <div id='jvchat-topic'>
                <h4 class='titre-info-fofo'>Topic</h4>
                <div id="jvchat-topic-info">
                    <div><strong><a title="Ouvrir le topic" id="jvchat-topic-title" target="_blank"></a></strong></div>
                    <span id="jvchat-topic-nb-connected"></span>
                    <span id="jvchat-topic-nb-messages"></span>
                </div>
            </div>
        </div>
    </div>
</div>
`;

function getForm(doc) {
    return doc.getElementsByClassName('form-post-message')[0];
}

let freshForm = getForm(document);
let firstMessageId = undefined;
let allMessagesId = new Set();
let userConnected = undefined;
let updateIntervals = [2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 30, 60];
let transisitions   = [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,  3,  3,  3,  3,  3,  3, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 19, 19, 19, 19, 19, 19, 19, 19, 31];
let updateIntervalIdx = 0;
let updateIntervalMax = updateIntervals.length - 1;
let isLocked = false;
let isError = false;
let isReduced = true;
let storageKey = "jvchat-premium-default-reduced";

function getTopicLocked(elem) {
    let lock = elem.getElementsByClassName("message-lock-topic")[0];
    if (lock === undefined) {
        return lock;
    }
    let reason = lock.getElementsByTagName("span")[0].textContent.trim();
    return `Le topic a été vérouillé pour la raison suivante : "${reason}"`;
}

function getTopicError(elem) {
    let error = elem.getElementsByClassName("img-erreur")[0];
    if (error === undefined) {
        return error;
    }
    return `Le topic présente une erreur: ${error.getAttribute("alt")}`;
}

function tryCatch(func) {
    function wrapped(optArg) {
        try {
            func(optArg);
        } catch(err) {
            let message = `Une erreur est survenue dans JVChat Premium: '${err.message}' (line ${err.lineNumber})`;
            console.error(message);
            try {
                addAlertbox("danger", message);
            } catch(e) {
                alert(message);
            }
        }
    }
    return wrapped;
}

function toggleTextarea() {
    let isDown = isScrollDown();
    document.getElementById("bloc-formulaire-forum").getElementsByClassName("jv-editor-toolbar")[0].classList.toggle("jvchat-hide");
    document.getElementById("jvchat-enlarge").classList.toggle("jvchat-hide");
    document.getElementById("jvchat-reduce").classList.toggle("jvchat-hide");
    document.getElementById("jvchat-post").classList.toggle("jvchat-hide");
    document.getElementById("bloc-formulaire-forum").classList.toggle("jvchat-reduced");
    isReduced = !isReduced;
    localStorage.setItem(storageKey, isReduced);
    if (isDown) {
        setScrollDown();
    }
}

function parseURL(url) {
    let regex = /^(.*?)(\/\d+-\d+-\d+-)(\d+)(-\d+-\d+-\d+-)(.*?)(\.htm)(.*)$/i;
    let [_, domain, ids, page, nums, title, htm, anchor] = url.match(regex);
    return {domain: domain, ids: ids, page: page, nums: nums, title: title, htm: htm, anchor: anchor};
}

function buildURL(dict) {
    return `${dict.domain}${dict.ids}${dict.page}${dict.nums}${dict.title}${dict.htm}${dict.anchor}`;
}

function getLastPage(document) {
    let blocPages = document.getElementsByClassName("bloc-liste-num-page")[0];
    let spans = blocPages.getElementsByTagName("span");
    let lastPage = 1;
    for (let span of spans) {
        let page = parseInt(span.textContent.trim());
        if (!isNaN(page) && page > lastPage) {
            lastPage = page;
        }
    }
    return lastPage;
}

function parseMessage(elem) {
    let author = elem.getElementsByClassName("bloc-pseudo-msg")[0].textContent.trim();
    let avatar = elem.getElementsByClassName("user-avatar-msg")[0];
    if (avatar !== undefined) {
        avatar = avatar.getAttribute("data-srcset");
    }
    let date = elem.getElementsByClassName("bloc-date-msg")[0].textContent.trim();
    let content = fixMessage(elem.getElementsByClassName("text-enrichi-forum")[0]);
    let id = parseInt(elem.getAttribute("data-id"));
    return {author: author, date: date, avatar: avatar, id: id, content: content};
}

function parseUserInfo(elem) {
    let mpBox = elem.getElementsByClassName("jv-account-number-mp")[0];
    if (mpBox === undefined) {
        return undefined;
    }
    let notifBox = elem.getElementsByClassName("jv-account-number-notif")[0];
    let avatarBox = elem.getElementsByClassName("account-avatar-box")[0];
    let authorBox = elem.getElementsByClassName("account-pseudo")[0];
    let mp = parseInt(mpBox.getAttribute("data-val"));
    let notif = parseInt(notifBox.getAttribute("data-val"));
    let avatar = avatarBox.style["background-image"].slice(5, -2).replace("/avatar-md/", "/avatar/");
    let author = authorBox.textContent.trim();
    return {author: author, avatar: avatar, mp: mp, notif: notif};
}

function parseTopicInfo(elem) {
    let title = elem.querySelector("#bloc-title-forum").textContent.trim();
    let connected = parseInt(elem.getElementsByClassName("nb-connect-fofo")[0].textContent.trim());
    let lastPage = getLastPage(elem);
    let pageActive = elem.getElementsByClassName("page-active")[0];
    let page = 1;
    if (pageActive !== undefined) {
        page = parseInt(pageActive.textContent.trim());
    }
    return {title: title, connected: connected, lastPage: lastPage, page: page};
}

function fixMessage(elem) {
    let jvcares = Array.from(elem.getElementsByClassName("JvCare"));
    for (let jvcare of jvcares) {
        let a = document.createElement("a");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", jvCake(jvcare.getAttribute("class")));
        a.innerHTML = jvcare.innerHTML;
        jvcare.outerHTML = a.outerHTML;
    }
    return elem;
}

function jvCake(cls) {
  let base16 = '0A12B34C56D78E9F', lien = '', s = cls.split(' ')[1];
  for (let i = 0; i < s.length; i += 2) {
    lien += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
  }
  return lien;
}

function clearPage(document) {
    let buttons = `
        <div id='jvchat-buttons'>
            <button id='jvchat-post' tabindex="4" type="button" class='jvchat-hide icon-reply' title="Envoyer le message"></button>
            <button id='jvchat-reduce' tabindex="5" type="button" class='jvchat-hide icon-arrow-down-entypo' title="Réduire la zone de texte"></button>
            <button id='jvchat-enlarge' tabindex="4" type="button" class='icon-arrow-up-entypo' title="Agrandir la zone de texte"></button>
        <div>`;
    document.head.insertAdjacentHTML("beforeend", CSS);
    let adsIds = ["wads_po_header-top_p", "wads_po_middle_p"];
    for (let adsId of adsIds) {
        let ads = document.getElementById(adsId);
        if (ads) {
            let adsDiv = ads.parentElement.parentElement.parentElement;
            adsDiv.parentElement.removeChild(adsDiv);
        }
    }
    let messageTopic = document.getElementById("message_topic");
    if (messageTopic) {
        messageTopic.setAttribute("placeholder", "Hop hop hop, le message ne va pas s'écrire tout seul !");
        messageTopic.insertAdjacentHTML("afterend", buttons);
        messageTopic.addEventListener("keydown", tryCatch(postMessageIfEnter));
        document.getElementById("jvchat-post").addEventListener("click", tryCatch(postMessage));
        document.getElementById("jvchat-enlarge").addEventListener("click", tryCatch(toggleTextarea));
        document.getElementById("jvchat-reduce").addEventListener("click", tryCatch(toggleTextarea));
    }
    document.getElementsByClassName("conteneur-messages-pagi")[0].insertAdjacentHTML("afterbegin", "<div id='jvchat-main'><hr class='jvchat-ruler'></div>");
    document.getElementById("page-messages-forum").insertAdjacentHTML("afterbegin", "<div id='jvchat-alerts'><div id='jvchat-fixed-alert' class='jvchat-hide'><div class='alert-row'></div></div></div>");

    document.getElementById("content-context").insertAdjacentHTML("afterbegin", PANEL);

    document.getElementById("bloc-formulaire-forum").classList.add("jvchat-reduced");
    document.getElementById("bloc-formulaire-forum").classList.add("jvchat-hide");

    /* Fix Stickers JVC: à cause du flex, je n'arrive pas à limiter leur width sans que cela
    casse le comportement de l'affichage souhaité. A savoir : si l'écran est grand, la leftbar est affichée
    en 15 rem, jusqu'à un certain point diminuer la width de l'écran diminue la zone de texte, après
    une certaine limite, l'avatar commence à se réduire à la place de la zone de texte (celle-ci reste la même),
    une fois la leftbar diminuée au max (avatar = 3rem), la zone de texte continue à diminue puis scrollbar
    horizontale en dernier recours.
    Le problème c'est qu'il y a bcp de stickers qui prennent bcp de place, et ils forcent la réduction
    de la leftbar même si l'écran est grand. Solution : flex doit ignorer les stickers pour son calcul
    de la width, donc on passe les sticckers en positions absolue et on déinie la taille du parent.
    */
    let newStickers = document.getElementsByClassName("new-stickers")[0];
    if (newStickers) {
        let newStickersParent = newStickers.parentElement
        newStickersParent.classList.add("jvchat-new-stickers-parent");
        document.getElementById("bloc-formulaire-forum").addEventListener("click", function(event) {
            let target = event.target;
            if (!target) {
                return;
            }
            if (target.getAttribute("id") === "active-script") {
                newStickersParent.classList.toggle("jvchat-hide");
            }
        });
    }

    let toolbar =  document.getElementById("bloc-formulaire-forum").getElementsByClassName("jv-editor-toolbar")[0];
    if (toolbar) {
        toolbar.classList.add("jvchat-hide");
    }

    document.getElementById("jvchat-main").addEventListener("click", tryCatch(dontScrollOnExpand));

    document.getElementById("jvchat-alerts").addEventListener("click", tryCatch(closeAlert));
}

function closeAlert(event) {
    let target = event.target;
    if (!target) {
        return;
    }
    if (target.classList.contains("jvchat-alert-close")) {
        let parent = target.parentElement;
        parent.parentElement.removeChild(parent);
    }
}

function postMessage() {
    let textarea = document.getElementById("message_topic");

    if (freshForm === undefined) {
        addAlertbox("danger", "Impossible de poster le message, aucun formulaire trouvé");
        return;
    }

    let formData = serializeForm(freshForm);
    formData["message_topic"] = textarea.value;
    let formulaire = document.getElementById("bloc-formulaire-forum");

    formulaire.classList.add("jvchat-disabled-form");

    function onSuccess(res) {
        formulaire.classList.remove("jvchat-disabled-form");
        let alert = parsePage(res).alert;
        if (!alert) {
            textarea.value = "";
        }
    }

    function onError(err) {
        addAlertbox("danger", err);
        formulaire.classList.remove("jvchat-disabled-form");
    }

    function onTimeout(err) {
        addAlertbox("warning", err);
        formulaire.classList.remove("jvchat-disabled-form");
    }

    request("POST", document.URL, onSuccess, onError, onTimeout, makeFormData(formData));
}

function postMessageIfEnter(event) {
    let classes = document.getElementById("bloc-formulaire-forum").classList;
    if (classes.contains("jvchat-reduced") && (event.which == 13 || event.keyCode == 13)) {
        event.preventDefault();
        postMessage();
    }
}

function serializeForm(form) {
    // Useless actually, just use new FormData(form)
    let dict = {};

    for (let select of form.getElementsByTagName("select")) {
        dict[select.name] = select.querySelector("option[selected]").value;
    }

    for (let input of form.getElementsByTagName("input")) {
        dict[input.name] = input.value;
    }

    for (let textarea of form.getElementsByTagName("textarea")) {
        dict[textarea.name] = textarea.value;
    }

    return dict;
}

function makeFormData(dict) {
    var formData = new FormData();
    for (let key in dict) {
        formData.append(key, dict[key]);
    }
    return formData;
}

function getMessages(document) {
    let blocMessages = document.getElementsByClassName("bloc-message-forum");
    let messages = [];
    for (let bloc of blocMessages) {
        messages.push(parseMessage(bloc));
    }
    return messages;
}

function addMessages(document, messages) {
    let main = document.getElementById("jvchat-main");
    let isDown = isScrollDown();
    let hasNewMessages = false;
    for (let message of messages) {
        let id = message.id;

        if (firstMessageId === undefined) {
            firstMessageId = id;
        }
        if (allMessagesId.has(id) || id < firstMessageId) {
            continue;
        }
        allMessagesId.add(id);
        hasNewMessages = true;
        let avatar = message.avatar;
        let date = message.date;
        let exists = avatar !== undefined;
        let author = exists ? message.author : `<i>${message.author}</i>`;
        let avatarSrc = exists ? avatar : "http://image.jeuxvideo.com/avatar-sm/default.jpg";
        let authorHref = exists ? `href="http://www.jeuxvideo.com/profil/${author.toLowerCase()}?mode=infos"` : "";
        let authorTitle = exists ? `title="Ouvrir le profil de ${author}"` : "";
        let html =
            `<div class="jvchat-bloc-message">
                <div class="jvchat-message">
                    <div>
                        <a ${authorHref} target="_blank" ${authorTitle}>
                            <div class="jvchat-bloc-avatar jvchat-rounded" style="background-image: url(${avatarSrc})"></div>
                        </a>
                    </div>
                    <div class="jvchat-bloc-author-content">
                        <div class="jvchat-toolbar">
                            <h5 class="jvchat-author">${author}</h5>
                            <div class="jvchat-tooltip"><small title="${date}">${date.slice(-8)}</small></div>
                        </div>
                        <div class="jvchat-content">${message.content.outerHTML}</div>
                    </div>
                </div>
                <hr class="jvchat-ruler">
            </div>`;

        main.insertAdjacentHTML("beforeend", html);
    }
    if (isDown) {
        let blocMessages = Array.from(main.getElementsByClassName("jvchat-bloc-message"));
        for (let i = 0; i + 100 < blocMessages.length; i++) {
            main.removeChild(blocMessages[i]);
        }
        setScrollDown();
    }

    if (hasNewMessages) {
        decreaseUpdateInterval();
    } else {
        increaseUpdateInterval();
    }
}

function setUser(document, user) {
    let isConnected = (user !== undefined);
    let isDown = isScrollDown();

    if (isConnected) {
        let pseudo = document.getElementById("jvchat-user-pseudo");
        let avatar = document.getElementById("jvchat-user-avatar");
        let mp = document.getElementById("jvchat-user-mp");
        let notif = document.getElementById("jvchat-user-notif");
        let avatarLink = document.getElementById("jvchat-user-avatar-link");
        let notifLink = document.getElementById("jvchat-user-notif-link");

        pseudo.innerHTML = user.author;
        avatar.style["background-image"] = `url("${user.avatar}")`;

        mp.setAttribute("data-val", user.mp);
        if (user.mp > 0) {
            mp.classList.add("has-notif");
        } else {
            mp.classList.remove("has-notif");
        }

        notif.setAttribute("data-val", user.notif);
        if (user.notif > 0) {
            notif.classList.add("has-notif");
        } else {
            notif.classList.remove("has-notif");
        }

        avatarLink.setAttribute("href", `http://www.jeuxvideo.com/profil/${user.author.toLowerCase()}?mode=infos`);
        notifLink.setAttribute("href", `http://www.jeuxvideo.com/profil/${user.author.toLowerCase()}?mode=abonnements`);
    }

    if ((userConnected === undefined && isConnected) || (userConnected !== undefined && isConnected !== userConnected)) {
        document.getElementById("jvchat-profil").classList.toggle("jvchat-hide");
        document.getElementById("bloc-formulaire-forum").classList.toggle("jvchat-hide");
        if (isDown) {
            setScrollDown();
        }
    }

    if (userConnected !== undefined) {
        if (isConnected && !userConnected) {
            addAlertbox("success", "Vous êtes désormais connecté");
        } else if (!isConnected && userConnected) {
            addAlertbox("warning", "Vous avez été déconnecté");
        }
    }

    userConnected = isConnected;
}

function setTopicTitle(document, topicTitle) {
    document.getElementById("jvchat-topic-title").innerHTML = topicTitle;
}

function setTopicNbConnected(document, nbConnected) {
    let txt = `${nbConnected} connectés`;
    if (!(nbConnected > 1)) {
        if (nbConnected === undefined) {
            txt = "? connectés";
        } else {
            txt = txt.slice(0, -1);
        }
    }
    document.getElementById("jvchat-topic-nb-connected").innerHTML = txt;
}

function setTopicNbMessages(document, nbMessages) {
    let txt = `${nbMessages} messages`;
    if (!(nbMessages > 1)) {
        if (nbMessages === undefined) {
            txt = "? messages";
        } else {
            txt = txt.slice(0, -1);
        }
    }
    document.getElementById("jvchat-topic-nb-messages").innerHTML = txt;
}

function triggerJVChat() {
    let topicUrl = document.URL;
    let topic = parseTopicInfo(document);
    let user = parseUserInfo(document);
    let url = parseURL(topicUrl);

    // let currentPage = getCurrentPage(topicUrl);

    clearPage(document);

    setUser(document, user);
    setTopicTitle(document, topic.title);
    setTopicNbMessages(document, undefined);
    setTopicNbConnected(document, topic.connected);

    url.page = 1;
    url.anchor = "";
    document.getElementById("jvchat-topic-title").setAttribute("href", buildURL(url));

    let defaultReduced = localStorage.getItem(storageKey);

    if (defaultReduced === "false") {
        toggleTextarea();
    }

    updateMessages(url, topic.lastPage);
}


function updateMessages(url, page) {
    url.page = page;
    let urlLastPage = buildURL(url);

    function scheduleNextUpdate(interval) {
        setTimeout(tryCatch(function() { updateMessages(url, page); }), interval);
    };

    function onSuccess(res) {
        let lastPage = parsePage(res).lastPage;
        if (page == lastPage || lastPage === undefined) {
            scheduleNextUpdate(updateIntervals[updateIntervalIdx] * 1000);
        } else if (page < lastPage) {
            updateMessages(url, page + 1);
        } else if (page > lastPage) {
            updateMessages(url, lastPage);
        }
    }

    function onError(err) {
        if (!isError) {
            isError = true;
            setFixedAlert("danger", err);
        }
        scheduleNextUpdate(60000);
    }

    function onTimeout(err) {
        addAlertbox("warning", err);
        scheduleNextUpdate(20000);
    }

    request("GET", urlLastPage, onSuccess, onError, onTimeout);
}

function parseAlerts(res) {
    let alerts = [];
    let alertsDiv = res.getElementsByClassName("alert");
    for (let a of alertsDiv) {
        let type = "danger";
        if (a.classList.contains("alert-warning")) {
            type = "warning";
        } else if (a.classList.contains("alert-success")) {
            type = "success";
        }
        let message = a.getElementsByClassName("alert-row")[0].textContent.trim();
        alerts.push({type: type, message: message});
    }
    return alerts;
}

function increaseUpdateInterval() {
    if (updateIntervalIdx < updateIntervalMax) {
        updateIntervalIdx++;
    }
}

function decreaseUpdateInterval() {
    updateIntervalIdx = transisitions[updateIntervalIdx];
}

function parsePage(res) {
    let error = getTopicError(res);
    if (error !== undefined) {
        if (!isError) {
            updateIntervalIdx = updateIntervalMax;
            isError = true;
            setFixedAlert("danger", error);
        }
        return {lastPage: undefined, alert: true}
    } else {
        if (isError) {
            isError = false;
            updateIntervalIdx = 0;
            removeFixedAlert("Le topic ne retourne plus d'erreur");
        }
        let form = getForm(res);
        if (form !== undefined) {
            freshForm = form;
        }
        let messages = getMessages(res);
        addMessages(document, messages);
        let user = parseUserInfo(res);
        setUser(document, user);
        let topic = parseTopicInfo(res);
        let nbMessages = (topic.lastPage - 1) * 20;
        if (topic.page == topic.lastPage) {
            nbMessages += messages.length;
        }
        setTopicNbMessages(document, nbMessages);
        setTopicNbConnected(document, topic.connected);
        let alerts = parseAlerts(res);
        for (let alert of alerts) {
            addAlertbox(alert.type, alert.message);
        }
        let locked = getTopicLocked(res);
        let isLocked_ = (locked !== undefined);

        if (isLocked_ && !isLocked) {
            updateInterval = updateIntervalMax;
            setFixedAlert("warning", locked);
        } else if (!isLocked_ && isLocked) {
            updateInterval = 0;
            removeFixedAlert("Le topic a été dévérouillé");
        }
        isLocked = isLocked_;
        return {lastPage: topic.lastPage, alert: isLocked_ || (alerts.length > 0)};
    }
}

function addAlertbox(type, message) {
    // type: success / warning / danger
    let alert = `<div class="alert alert-${type}">
        <button class="close jvchat-alert-close" aria-hidden="true" data-dismiss="alert" type="button">×</button>
        <div class="alert-row">${message}</div>
        </div>`;
    document.getElementById("jvchat-fixed-alert").insertAdjacentHTML("afterend", alert);
}

function setFixedAlert(type, message) {
    document.getElementById("jvchat-fixed-alert").getElementsByClassName("alert-row")[0].innerHTML = message;
    document.getElementById("jvchat-fixed-alert").setAttribute("class", `alert alert-${type}`);
}

function removeFixedAlert(message) {
    document.getElementById("jvchat-fixed-alert").classList.add("jvchat-hide");
    if (message !== undefined) {
        addAlertbox("success", message);
    }
}

function makeJVChatButton() {
    let cls = 'btn-jvchat';
    let text = 'JVChat';
    let btn = `<button class="btn btn-actu-new-list-forum ${cls}">${text}</button>`;
    return btn;
}

function addJVChatButton(document) {
    let css = `<style type="text/css">
    #forum-main-col .bloc-pre-pagi-forum {
        display: flex;
    }

    #forum-main-col .bloc-pre-pagi-forum .bloc-pre-right {
        position: relative;
        right: unset;
        left: unset;
        top: unset;
        bottom: unset;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-top: auto;
        flex: 1;
    }

    #forum-main-col .bloc-pre-pagi-forum .bloc-pre-right button {
        float: right;
        min-width: 5.25rem;
        margin-left: 0.3125rem;
    }
    </style>`
    document.head.insertAdjacentHTML("beforeend", css);
    let blocPreRight = document.getElementsByClassName("bloc-pre-right");
    let jvchatButton = makeJVChatButton();
    for (let bloc of blocPreRight) {
        bloc.insertAdjacentHTML('afterbegin', jvchatButton);
    }
}

function bindJVChatButton(document) {
    let buttons = document.getElementsByClassName('btn-jvchat');
    for (let btn of buttons) {
        btn.addEventListener('click', tryCatch(triggerJVChat));
    }
}

function raiseHTTPError(text) {
    console.error(text);
}

function request(mode, url, callbackSuccess, callbackError, callbackTimeout, data) {
    let xhr = new XMLHttpRequest();
    xhr.timeout = 20000;

    xhr.ontimeout = tryCatch(function() {
        callbackTimeout(`La delai d'attente de la requête a expiré`);
    });

    xhr.onerror = tryCatch(function() {
        callbackError(`La requête a échoué (${xhr.status}): ${xhr.statusText}`);
    });

    xhr.onload = tryCatch(function() {
        if (xhr.status !== 200) {
            callbackError(`La requête a retourné une erreur (${xhr.status}): ${xhr.statusText}`);
            return;
        }
        let dom = document.createElement("html");
        dom.innerHTML = xhr.responseText;
        callbackSuccess(dom);
    });

    if (data === undefined) {
        data = null;
    }

    xhr.open(mode, url, true);
    xhr.send(data);
};

function dontScrollOnExpand(event) {
    let target = event.target;
    if (!target) {
        return;
    }

    let classes = target.classList;

    if (classes.contains("blockquote-jv")) {
        let isDown = isScrollDown();
        target.setAttribute('data-visible', '1');
        if (isDown) {
            setScrollDown();
        }
    } else if (classes.contains("open-spoil")) {
        // TODO: Fix scroll down not detected on spoilers
    }
}

function isScrollDown() {
    let element = document.getElementById("jvchat-main");
    return element.clientHeight + Math.floor(element.scrollTop) >= element.scrollHeight - 1;
}

function setScrollDown() {
    let element = document.getElementById("jvchat-main");
    element.scrollTop = element.scrollHeight + 100000;
}

function main() {
    addJVChatButton(document);
    bindJVChatButton(document);
}

main();
