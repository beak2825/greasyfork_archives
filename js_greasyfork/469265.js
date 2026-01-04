// ==UserScript==
// @name        nhentai Navigation Improvements
// @description Clone search page navigation on top for mobile and options for faster tag filtering in top bar
// @namespace   xspeed.net
// @license     MIT
// @version     4
// @icon        https://nhentai.net/favicon.ico
// @match       *://nhentai.net/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/469265/nhentai%20Navigation%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/469265/nhentai%20Navigation%20Improvements.meta.js
// ==/UserScript==

"use strict";

function showTextPrompt(msg) {
    const text = document.createElement("p");
    text.innerText = msg;

    const input = document.createElement("input");
    input.type = "search";

    const link = document.createElement("i");
    link.className = "fa fa-paste";

    const button = document.createElement("button");
    button.className = "btn btn-primary btn-square";
    button.type = "submit";
    button.appendChild(link);

    const form = document.createElement("form");
    form.className = "search";
    form.role = "search";
    form.method = "dialog";
    form.appendChild(input);
    form.appendChild(button);

    const dialog = document.createElement("dialog");
    dialog.appendChild(text);
    dialog.appendChild(form);

    const style = getComputedStyle(document.body);
    dialog.style.backgroundColor = style.getPropertyValue("background-color");
    dialog.style.color = style.getPropertyValue("color");

    document.body.appendChild(dialog);
    dialog.showModal();

    return new Promise((resolve, reject) => form.addEventListener('submit', () => {
        resolve(input.value);
        dialog.remove();
    }, { once: true }));
}

function stopEvent(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
}

async function onChangeTags(event, tags) {
    stopEvent(event);

    const input = document.querySelector("input[type=search]");
    const str = tags ?? await showTextPrompt("Specify tags, separate by commas");

    if (str) {
        str.split(',').map(x => x.trim()).filter(x => x).forEach(x => adjustSearch("tag", x, false));

        document.querySelector("button[type=submit]").click();
    }
}

function adjustSearch(type, item, add) {
    const input = document.querySelector("input[type=search]");
    item = wrap(item);
    const act = " " + (add ? item : `-${type}:${item}`);
    const inv = " " + (add ? `-${type}:${item}` : item);

    if (input.value.indexOf(inv) != -1) input.value = input.value.replace(inv, act);
    else if (input.value.indexOf(act) == -1) input.value += act;

    input.value = input.value.replaceAll('  ', ' ');
    sessionStorage.setItem("lastSearch", input.value);
}

function wrap(txt) {
    return txt.indexOf(" ") == -1 ? txt : `"${txt}"`;
}

function clearSearch(event) {
    stopEvent(event);

    document.querySelector("input[type=search]").value = "";
    sessionStorage.removeItem("lastSearch");
}

function setupBtn(elem) {
    if (!elem) return;

    let item = elem.firstChild.cloneNode(true);

    let link = item.firstChild;
    link.href = "#";
    link.innerText = "Block default";
    link.addEventListener("click", e => onChangeTags(e, "bbm,netorare,vore,scat,guro"));

    elem.insertBefore(item, elem.firstChild);

    item = elem.firstChild.cloneNode(true);

    link = item.firstChild;
    link.href = "#";
    link.innerText = "Block tags";
    link.addEventListener("click", onChangeTags);

    elem.insertBefore(item, elem.firstChild);

    item = elem.firstChild.cloneNode(true);

    link = item.firstChild;
    link.href = "#";
    link.innerText = "Clear search";
    link.addEventListener("click", e => clearSearch(e));

    elem.insertBefore(item, elem.firstChild);
}

function onTagClick(event, elem, add) {
    stopEvent(event);

    const data = elem.pathname.split("/").filter(x => x);
    adjustSearch(data[0], data[1].replaceAll("-", " "), add);
}

function setupTag(elem) {
    if (!elem.querySelector(".count")) return document.createTextNode("");

    const container = document.createElement("span");
    container.addEventListener("click", e => stopEvent(e));
    container.className = "name";

    const add = document.createElement("a");
    add.href = "#";
    add.addEventListener("click", e => onTagClick(e, elem, true));
    add.className = "fa fa-plus";
    add.style.padding = "0.25em 0em";
    add.style.marginRight = "0.4em";

    const del = document.createElement("a");
    del.href = "#";
    del.addEventListener("click", e => onTagClick(e, elem));
    del.className = "fa fa-minus";
    del.style.padding = "0.25em 0em";

    container.appendChild(add);
    container.appendChild(del);
    return container;
}

(function() {
    const content = document.getElementById("content");
    const pagination = document.querySelector("section.pagination");
    const input = document.querySelector("input[type=search]");

    if (content && pagination) {
        const clone = pagination.cloneNode(true);

        const spacer = clone.querySelector(".ios-mobile-webkit-bottom-spacing");
        if (spacer) spacer.remove();

        content.insertBefore(clone, content.firstChild);
    }

    if (!input.value) {
        input.value = sessionStorage.getItem("lastSearch") ?? "english ";
    }
    else if (input.value.trim() != "english") {
        sessionStorage.setItem("lastSearch", input.value);
    }

    setupBtn(document.querySelector("ul.menu"));
    setupBtn(document.querySelector("ul.dropdown-menu"));

    document.querySelectorAll(".tags>.tag").forEach(x => x.appendChild(setupTag(x)));
})();
