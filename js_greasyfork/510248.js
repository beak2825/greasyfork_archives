// ==UserScript==
// @name         Yousy
// @namespace    https://wilchan.org
// @version      2.0
// @description  Dodaje (You) do twoich odpowiedzi, umożliwia oznaczanie i odznaczanie posta jako (You).
// @author       Anonimas
// @match        https://wilchan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510248/Yousy.user.js
// @updateURL https://update.greasyfork.org/scripts/510248/Yousy.meta.js
// ==/UserScript==

let style = document.createElement("style");
style.innerHTML = `:root{--yous-border-color: #96562c}section.quotes-you{border-left:1px solid var(--yous-border-color)!important}section.your-post{border-left:1px dashed var(--yous-border-color)!important}`;
document.head.appendChild(style);

let yous = {};
if (!localStorage.yous) {
    localStorage.yous = "{}";
} else {
    yous = JSON.parse(localStorage.yous);
}
if (!yous[boardConfiguration.boardId]) {
    yous[boardConfiguration.boardId] = {};
}

for (let key in yous) {
    for (let id in yous[key]) {
        if (yous[key][id] < Date.now() - 1000 * 60 * 60 * 24 * 60) {
            yous[key][id] = undefined;
        }
    }
}
localStorage.yous = JSON.stringify(yous);


window.addEventListener("after-create-post-section-element-event", function (event) {
    let section = event.detail.element;
    addYouOption(section);
    if (yous[event.detail.post.boardId][event.detail.post.postId]) section.classList.add("your-post");
    section.querySelectorAll("a.outcoming-post-mention").forEach(link => {
        let postId = link.getAttribute("data-postid"),
            boardId = link.getAttribute("data-boardid");
        if (yous[boardId][postId]) {
            link.classList.add("you");
            link.textContent += " (You)";
            section.classList.add("quotes-you");
        }
    })
})

let _createMention = createIncomingPostMentionHyperlinkElement;
createIncomingPostMentionHyperlinkElement = function(...args) {
    let element = _createMention(...args);
    if (yous[args[0]][args[2]]) {
        element.classList.add("you");
        element.textContent += " (You)";
    }
    return element;
}

document.querySelectorAll("a.incoming-post-mention").forEach(link => {
    let postId = link.getAttribute("data-postid"),
        boardId = link.getAttribute("data-boardid");
    if (yous[boardId][postId]) {
        link.classList.add("you");
        link.textContent += " (You)";
    }
});

document.querySelectorAll("a.outcoming-post-mention").forEach(link => {
    let postId = link.getAttribute("data-postid"),
        boardId = link.getAttribute("data-boardid");
    if (yous[boardId][postId]) {
        link.classList.add("you");
        link.textContent += " (You)";
        link.parentNode.parentNode.parentNode.classList.add("quotes-you");
    }
});

document.querySelectorAll("section.reply, main:not(.catalog) section.thread").forEach(section => {
    addYouOption(section);
    if (yous[boardConfiguration.boardId][section.getAttribute("data-postid")]) section.classList.add("your-post");
});

const updateOnResponse = (data) => {
    let section = document.querySelector(`section[data-postid="${data.postId}"]`);
    if (data.remove) {
        if (section) {
            section.classList.remove("your-post");
            updateYouOption(section.querySelector("aside.options a.you"), false);
        }
        document.querySelectorAll(`a.incoming-post-mention[data-boardid="${data.boardId}"][data-postid="${data.postId}"]`).forEach(link => {
            link.classList.remove("you");
            link.textContent = link.textContent.replace(" (You)", "");
        });
        document.querySelectorAll(`a.outcoming-post-mention[data-boardid="${data.boardId}"][data-postid="${data.postId}"]`).forEach(link => {
            link.classList.remove("you");
            link.textContent = link.textContent.replace(" (You)", "");
            link.closest("section").classList.remove("quotes-you");
        });
    } else {
        if (section) {
            section.classList.add("your-post");
            updateYouOption(section.querySelector("aside.options a.you"), true);
        }
        document.querySelectorAll(`a.incoming-post-mention:not(.you)[data-boardid="${data.boardId}"][data-postid="${data.postId}"]`).forEach(link => {
            link.classList.add("you");
            link.textContent += " (You)";
        });
        document.querySelectorAll(`a.outcoming-post-mention:not(.you)[data-boardid="${data.boardId}"][data-postid="${data.postId}"]`).forEach(link => {
            link.classList.add("you");
            link.textContent += " (You)";
            link.closest("section").classList.add("quotes-you");
        });
    }
}

let bc = new BroadcastChannel("you");
bc.onmessage = ev => {
    let info = ev.data;
    yous = JSON.parse(localStorage.yous);
    if (boardConfiguration.boardId == info.boardId) updateOnResponse(info);
}

function addYouOption(postElement) {
    let postId = postElement.getAttribute("data-postid");
    let optionsElement = postElement.querySelector("aside.options");

    let optionElement = document.createElement("a");
    optionElement.setAttribute("class", "you");

    if (yous[boardConfiguration.boardId][postId]) {
        updateYouOption(optionElement, true);
    } else {
        updateYouOption(optionElement, false);
    }
    optionsElement.appendChild(optionElement);
}

function updateYouOption(optionElement, status) {
    if (status) {
        optionElement.textContent = "Not You";
        optionElement.removeEventListener('click', addYou);
        optionElement.addEventListener('click', removeYou);
    }
    else {
        optionElement.textContent = "You";
        optionElement.removeEventListener('click', removeYou);
        optionElement.addEventListener('click', addYou);
    }
}

function addYou(event) {
    event.preventDefault();

    let optionElement = event.currentTarget;
    let postElement = optionElement.closest("section[data-postid]");

    postElement.classList.add("your-post");

    let postId = postElement.getAttribute("data-postid");
    document.querySelectorAll(`a.incoming-post-mention[data-postid="${postId}"], a.outcoming-post-mention[data-postid="${postId}"]`).forEach(link => {
        link.classList.add("you");
        link.textContent += " (You)";
    });

    postElement.querySelectorAll("a.incoming-post-mention").forEach(link => {
        let postId = link.getAttribute("data-postid");
        document.querySelectorAll(`section[data-postid="${postId}"]`).forEach(section => section.classList.add("quotes-you"));
    });

    updateYouOption(optionElement, true);

    yous[boardConfiguration.boardId][postId] = Date.now();
    localStorage.yous = JSON.stringify(yous);
    bc.postMessage({ boardId: boardConfiguration.boardId, postId: postId });
}

function removeYou(event) {
    event.preventDefault();

    let optionElement = event.currentTarget;
    let postElement = optionElement.closest("section[data-postid]");

    postElement.classList.remove("your-post");

    let postId = postElement.getAttribute("data-postid");
    document.querySelectorAll(`a.incoming-post-mention[data-postid="${postId}"], a.outcoming-post-mention[data-postid="${postId}"]`).forEach(link => {
        link.classList.remove("you");
        link.textContent = link.textContent.replace(" (You)", "");
    });

    postElement.querySelectorAll("a.incoming-post-mention").forEach(link => {
        let postId = link.getAttribute("data-postid");
        document.querySelectorAll(`section[data-postid="${postId}"]`).forEach(section => section.classList.remove("quotes-you"));
    });

    updateYouOption(optionElement, false);

    yous[boardConfiguration.boardId][postId] = undefined;
    localStorage.yous = JSON.stringify(yous);
    bc.postMessage({ boardId: boardConfiguration.boardId, postId: postId, remove: true });
}

let _handleReadyStateChange = handleReadyStateChange;
handleReadyStateChange = (submitInputElement, submitInputElementInitialValue, event) => {
    let xmlHttpRequest = event.currentTarget;
    if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.responseText) {
        let response = JSON.parse(xmlHttpRequest.responseText);
        yous[response.data.boardId][response.data.postId] = Date.now();
        localStorage.yous = JSON.stringify(yous);
        updateOnResponse(response.data);
        bc.postMessage(response.data);
    }
    _handleReadyStateChange(submitInputElement, submitInputElementInitialValue, event);
}

let elements = document.querySelectorAll("section.post input[type=submit]");
elements.forEach(el => {
    el.removeEventListener("click", postAsynchronous);
    el.addEventListener("click", postAsynchronous);
});