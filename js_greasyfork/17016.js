// ==UserScript==
// @name        GitHub: inline patch view
// @namespace   https://akinori.org/
// @description Clicking on a commit ID shows the patch inline.  Second click opens the link.
// @license     2-clause BSDL
// @author      Akinori MUSHA
// @include     https://github.com/*/*/commits
// @include     https://github.com/*/*/commits/*
// @include     https://github.com/*/*/compare/*
// @include     https://github.com/*/*/pull/*
// @version     1.0.2
// @homepage    https://github.com/knu/userjs-github_inline_patch_view
// @homepage    https://greasyfork.org/scripts/17016-github-inline-patch-view
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17016/GitHub%3A%20inline%20patch%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/17016/GitHub%3A%20inline%20patch%20view.meta.js
// ==/UserScript==
"use strict";
(function () {
    let cloneNode = function (node) {
        let clone = document.createElement(node.tagName);
        Array.prototype.forEach.
            call(node.attributes,
                 function (attr) {
                     clone.setAttribute(attr.name, attr.value);
                 });
        return clone;
    };
    let insertInlinePatch = function (commit, sha) {
        if (commit.classList.contains("inline-patch")) {
            return false;
        }
        let url = sha.href;
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let patch = this.responseXML.getElementById("files");
            switch (commit.tagName) {
            case "TR":
                // Split the table to avoid CSS rule conflicts
                let container = null;
                for (let node = commit.parentNode;
                     node !== null;
                     node = node.parentNode) {
                    let clone = cloneNode(node);
                    if (container === null) {
                        // Move following siblings to a new container
                        let siblings = [];
                        for (let sibling = commit.nextSibling;
                             sibling !== null;
                             sibling = sibling.nextSibling) {
                            siblings.push(sibling);
                        }
                        siblings.forEach(function (sibling) {
                            clone.appendChild(sibling);
                        });
                    } else {
                        clone.appendChild(container);
                    }
                    container = clone;
                    if (node.tagName === "TABLE") {
                        node.parentNode.insertBefore(container, node.nextSibling);
                        patch.style.marginLeft = commit.querySelector(".commit-message").offsetLeft.toString() + "px";
                        node.parentNode.insertBefore(patch, container);
                        break;
                    }
                }
                break;
            default:
                let meta = commit.querySelector(".commit-meta");
                if (meta) {
                    meta.parentNode.appendChild(patch);
                }
            }
            commit.classList.add("inline-patch");
            let caret = sha.querySelector('.inline-patch-dropdown');
            if (caret) {
                sha.removeChild(caret);
            }
        };
        xhr.onerror = function () {
            console.log("Failed to load the patch from " + url);
        };
        xhr.open("GET", url);
        xhr.responseType = "document";
        xhr.send();
        return true;
    };
    let activateInlinePatch = function (commit) {
        // */commit/*, */commits/*
        let sha = commit.querySelector("a.sha[href*='/commit'], a.commit-id[href*='/commit']");
        if (!sha) {
            return;
        }
        let caret = document.createElement('span');
        caret.className = 'inline-patch-dropdown dropdown-caret';
        caret.style.display = 'inline';
        sha.appendChild(caret);
        sha.addEventListener("click",
                             function (e) {
                                 if (insertInlinePatch(commit, sha)) {
                                     e.preventDefault();
                                 }
                             },
                             false);
        let expander = commit.querySelector(".hidden-text-expander a[href]");
        if (expander) {
            expander.addEventListener("click",
                                      function (e) {
                                          insertInlinePatch(commit, sha);
                                      },
                                      false);
        }
    };
    Array.prototype.forEach.
        call(document.querySelectorAll(".commit"),
             activateInlinePatch);
})();
