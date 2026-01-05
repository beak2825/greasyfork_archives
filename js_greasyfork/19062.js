// ==UserScript==
// @name        TF.TV Thread Title Hider
// @namespace   sheybey
// @description Hides thread titles you don't want to see immediately
// @include     https://www.teamfortress.tv/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19062/TFTV%20Thread%20Title%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/19062/TFTV%20Thread%20Title%20Hider.meta.js
// ==/UserScript==

// I don't agree with some of jslint's whitespace rules
/*jslint browser, for, multivar, this, white*/
/*global NodeList*/
/*property
    add, addEventListener, appendChild, backgroundColor, border, call,
    classList, clear, color, contains, createElement, currentTarget, dataset,
    display, float, fontSize, fontStyle, forEach, getAttribute, getElementById,
    getItem, height, insertBefore, join, keys, length, lineHeight, marginTop,
    oldHref, oldTitle, overflow, padding, parentNode, parse, position,
    preventDefault, prototype, push, querySelector, querySelectorAll, remove,
    removeChild, removeEventListener, replace, setAttribute, setItem, slice,
    split, stopPropagation, stringify, style, test, textContent, toLowerCase,
    top, trim, value, width, zIndex
*/

(function () {
    "use strict";
    var hidden = localStorage.getItem("user-hidden"),
        def = [
            "esea",
            "etf2l",
            "ozf",
            "lan"
        ],
        // these elements are explained where they are first used
        navbar = document.querySelector("nav"),
        spoiler = document.createElement("a"),
        spoilerdiv = document.createElement("div"),
        spoilericon = document.createElement("i"),
        container = document.createElement("div"),
        add = document.createElement("span"),
        savetext = document.createElement("span"),
        firstrow = document.createElement("div"),
        shown = false,
        before, threads, articles, news;

    if (hidden === null) {
        hidden = def;
    } else {
        hidden = JSON.parse(hidden);
    }
    hidden = (function () {
        var o = {};
        hidden.forEach(function (keyword) {
            o[keyword] = new RegExp("\\b" +
                // this replace call escapes regex characters
                keyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") +
                "\\b", "i");
        });
        return o;
    }());

    // remove the title of a thread from a link, while preserving the effective target
    function sanitize(link, title) {
        link.classList.add("user-hidden");
        link.dataset.oldTitle = title; // <a title="..."> is not always set
        link.dataset.oldHref = link.getAttribute("href");
        // this slice and join removes the last component of the url, which is the slug, from href
        link.setAttribute("href", link.dataset.oldHref.split("/").slice(0, -1).join("/"));
        link.setAttribute("title", "Click to reveal");
    }
    // restore the information removed by sanitize()
    function restore(link) {
        link.classList.remove("user-hidden");
        link.setAttribute("title", link.dataset.oldTitle);
        link.setAttribute("href", link.dataset.oldHref);
    }

    // these functions find link and title elements given a click event and restore information as necessary
    function revealsidebar(event) {
        var link = event.currentTarget,
            span = link.querySelector(".module-item-title");

        event.preventDefault();
        event.stopPropagation();

        restore(link);
        link.removeEventListener("click", revealsidebar);

        span.textContent = link.dataset.oldTitle;
        span.style.fontStyle = "";
    }
    function revealthread(event) {
        var link = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        restore(link);
        link.removeEventListener("click", revealthread);
        link.textContent = link.dataset.oldTitle;
        link.style.fontStyle = "";
    }
    function revealarticle(event) {
        var link = event.currentTarget,
            span = link.querySelector(".news-item-title");

        event.preventDefault();
        event.stopPropagation();

        restore(link);
        link.removeEventListener("click", revealarticle);

        span.textContent = link.dataset.oldTitle;
        span.style.fontStyle = "";
    }

    // basically Array.prototype.forEach, but safer than using it directly
    if (typeof NodeList.prototype.forEach !== "function") {
        NodeList.prototype.forEach = function (f) {
            var i;
            for (i = 0; i < this.length; i += 1) {
                f.call(this[i], this[i], i, this);
            }
        };
    }

    // look for links to sanitize
    // the sidebar exists on all pages
    document.getElementById("sidebar-left").querySelectorAll(".module").forEach(function (module) {
        module.querySelectorAll(".module-item").forEach(function (link) {
            var span = link.querySelector(".module-item-title"),
                title;
            if (span.classList.contains("mod-event")) {
                return; // event posts generally do not have spoilers
            }
            title = span.textContent.trim();
            // Object.keys is usually faster than querySelector[All], so it is on the inside of the loop
            Object.keys(hidden).forEach(function (keyword) {
                var newtitle = "[" + keyword + " thread]";
                if (link.classList.contains("user-hidden")) {
                    return;
                }
                if (hidden[keyword].test(title)) {
                    sanitize(link, title);
                    link.addEventListener("click", revealsidebar);

                    span.textContent = newtitle;
                    span.style.fontStyle = "italic";
                }
            });
        });
    });
    // this element only exists on /forum... and /threads
    threads = document.getElementById("thread-list");
    if (threads !== null) {
        threads.querySelectorAll(".thread-inner").forEach(function (thread) {
            // this element only exists on /threads
            var category = thread.querySelector(".description a"),
                link, title;
            if (category !== null && category.textContent.trim() === "Events") {
                return;
            }
            link = thread.querySelector("a.title");
            title = link.textContent.trim();
            Object.keys(hidden).forEach(function (keyword) {
                var newtitle = "[" + keyword + " thread]";
                if (link.classList.contains("user-hidden")) {
                    return;
                }
                if (hidden[keyword].test(title)) {
                    sanitize(link, title);
                    link.addEventListener("click", revealthread);
                    link.textContent = newtitle;
                    link.style.fontStyle = "italic";
                }
            });
        });
    }
    // this element only exists on the front page
    articles = document.getElementById("article-list");
    if (articles !== null) {
        articles.querySelectorAll("a").forEach(function (link) {
            var span = link.querySelector(".news-item-title"),
                title = span.textContent.trim();

            Object.keys(hidden).forEach(function (keyword) {
                var newtitle = "[" + keyword + " article]";
                if (link.classList.contains("user-hidden")) {
                    return;
                }
                if (hidden[keyword].test(title)) {
                    sanitize(link, title);
                    link.addEventListener("click", revealarticle);

                    span.textContent = newtitle;
                    span.style.fontStyle = "italic";
                }
            });
        });
    }
    // this element only exists on /news
    news = document.querySelector("#content > .list-table:not(#schedule-table)");
    if (news !== null) {
        news.querySelectorAll("a").forEach(function (link) {
            var title = link.textContent.trim();

            Object.keys(hidden).forEach(function (keyword) {
                var newtitle = "[" + keyword + " article]";
                if (link.classList.contains("user-hidden")) {
                    return;
                }
                if (hidden[keyword].test(title)) {
                    sanitize(link, title);
                    link.addEventListener("click", revealthread);
                    link.textContent = newtitle;
                    link.style.fontStyle = "italic";
                }
            });
        });
    }

    // this function creates an <input> and remove button for the config div
    function createrow(word) {
        var row = document.createElement("div"),
            input = document.createElement("input"),
            remove = document.createElement("span");

        if (word === undefined) {
            word = "";
        }

        // the <input>
        input.style.height = "30px";
        input.style.marginTop = "5px";
        input.style.fontSize = "11px";
        input.style.lineHeight = "30px";
        input.style.width = "100px";
        input.value = word;

        // remove button
        remove.style.float = "right";
        remove.classList.add("btn");
        remove.textContent = "Remove";
        remove.addEventListener("click", function () {
            row.parentNode.removeChild(row);
        });

        // containing row
        row.style.height = "40px";
        row.style.padding = "5px 0";
        row.style.clear = "both";
        row.appendChild(input);
        row.appendChild(remove);
        return row;
    }

    // the spoiler <a> in the navbar
    spoiler.classList.add("header-nav-item-wrapper");
    spoiler.classList.add("mod-last");
    spoiler.setAttribute("href", "#");
    spoiler.style.overflow = "visible";
    spoiler.addEventListener("click", function (event) {
        event.preventDefault(); // # causes "scroll jump" to top otherwise
        var newhidden = [];
        if (shown) {
            container.style.display = "none";
            container.querySelectorAll("input").forEach(function (input) {
                newhidden.push(input.value.toLowerCase());
            });

            localStorage.setItem("user-hidden", JSON.stringify(newhidden));

            spoilericon.classList.remove("fa-caret-up");
            spoilericon.classList.add("fa-caret-down");

            shown = false;
        } else {
            container.style.display = "";

            spoilericon.classList.remove("fa-caret-down");
            spoilericon.classList.add("fa-caret-up");

            shown = true;
        }
    });

    // each navbar button has a <div> child that contains its label
    spoilerdiv.classList.add("header-nav-item");
    spoilerdiv.classList.add("mod-solo");
    spoilerdiv.textContent = "Spoilers ";

    // font awesome icon that reflects whether the config <div> is shown or not
    spoilericon.classList.add("fa");
    spoilericon.classList.add("fa-caret-down");

    // this <div> is shown and hidden when the spoiler button is clicked
    container.style.backgroundColor = "#f5f5f5";
    container.style.position = "absolute";
    container.style.top = "40px";
    container.style.display = "none";
    container.style.zIndex = "99";
    container.style.width = "200px";
    container.style.padding = "5px";
    container.style.border = "1px solid #b4b4b4";
    // this is necessary to prevent clicks on the config <div> from propagating to the spoiler button
    container.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    // this row contains the help text and add button
    firstrow.style.height = "40px";
    firstrow.style.padding = "5px 0";
    firstrow.style.clear = "both";

    // help text for config <div>
    savetext.style.fontSize = "11px";
    savetext.style.color = "#555555";
    savetext.style.lineHeight = "40px";
    savetext.textContent = "Close to save";

    // the add button
    add.classList.add("btn");
    add.textContent = "Add";
    add.style.float = "right";
    add.addEventListener("click", function () {
        container.appendChild(createrow());
    });

    firstrow.appendChild(savetext);
    firstrow.appendChild(add);

    container.appendChild(firstrow);
    Object.keys(hidden).forEach(function (keyword) {
        container.appendChild(createrow(keyword));
    });

    spoilerdiv.appendChild(spoilericon);

    spoiler.appendChild(spoilerdiv);
    spoiler.appendChild(container);

    // spoiler button is inserted before this element
    before = navbar.querySelector("#user-actions"); // logged in
    if (before === null) {
        before = navbar.querySelector("a:last-child"); // not logged in
    }
    navbar.insertBefore(spoiler, before);
}());