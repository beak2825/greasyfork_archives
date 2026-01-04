// ==UserScript==
// @namespace    -
// @grant        none
// @version      1.2.0.1
// @author       Stew#4055
// @run-at       document-start
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @supportURL   https://discord.com/invite/G2gJFbx7GD
// @name         Make Upgradebar draggable.
// @description  Drag with right-click, upgrade with left click.
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/425212/Make%20Upgradebar%20draggable.user.js
// @updateURL https://update.greasyfork.org/scripts/425212/Make%20Upgradebar%20draggable.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", () => {
    class a {
        constructor() {
            $("body").on("contextmenu", function (e) {
                return false;
            });
            let e = document.getElementById("upgradeHolder");
            e.addEventListener("mousedown", function (t) {
                if (3 === t.which) {
                    let o = t.clientX,
                        i = t.clientY;

                    function n(t) {
                        let n = o - t.clientX,
                            l = i - t.clientY;
                        const c = e.getBoundingClientRect();
                        e.style.left = c.left - n + "px", e.style.top = c.top - l + "px", o = t.clientX, i = t.clientY
                    }
                    window.addEventListener("mousemove", n), window.addEventListener("mouseup", function e() {
                        window.removeEventListener("mousemove", n), window.removeEventListener("mouseup", e)
                    })
                }
            })
        }
    }
    new a;
})