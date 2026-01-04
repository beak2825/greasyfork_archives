// ==UserScript==
// @name         Skribbl.io+
// @description  Fixes and QoL changes for Skribbl.
// @namespace    none
// @version      0.2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @author       4TSOS & Sunny Buns
// @match        *://skribbl.io/
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451437/Skribblio%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/451437/Skribblio%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = "Skribbl.io+";
    const default_avatar = GM_getValue("plus-default-avatar")
    if (default_avatar) {
        localStorage.setItem("avatar", `[${default_avatar}]`);
    };
    $("document").ready(function() {
        // Containers
        const login_panel = $(".loginPanelContent:nth-child(1)");
        const main_container = $("<div></div>").attr({
            id: "plus-main-container"
        });
        const head_title = $("<a><h1>Skribbl.io+</h1></a>").attr({
            "class": "plus-title",
            id: "plus-main-title",
            href: "https://greasyfork.org/en/users/784494"
        }).appendTo(main_container);
        // Avatar section
        const avatars_div = $("<div></div>").attr({
            "class": "plus-section",
            id: "plus-avatars-section"
        }).appendTo(main_container);
        const avatars_title = $("<h2>Avatars</h2>").appendTo(avatars_div);
        const avatars_saving = $("<div></div>").attr({
            id: "avatars-saving"
        }).appendTo(avatars_div);
        const avatars_save_name = $("<input></input>").attr({
            "class": "plus-input",
            id: "avatars-save-name",
            placeholder: "What will this avatar be named?"
        }).appendTo(avatars_saving);
        const avatars_save_btn = $("<button>Save avatar</button>").attr({
            "class": "plus-button",
            id: "avatars-save-button"
        }).appendTo(avatars_saving);
        const avatars_setting = $("<div></div>").attr({
            "class": "plus-section",
            id: "avatars-setting"
        }).appendTo(avatars_div);
        const avatars_set_content = $("<input></input>").attr({
            "class": "plus-input",
            id: "avatars-setting-field",
            placeholder: "What will your new avatar be?"
        }).appendTo(avatars_setting);
        const avatars_set_button = $("<button>Set avatar</button>").attr({
            "class": "plus-button",
            id: "avatars-set-button"
        }).appendTo(avatars_setting);
        const avatars_perm_save = $("<button>Set default</button>").attr({
            "class": "plus-button",
            id: "avatars-perm-save"
        }).appendTo(avatars_div);
        const avatars_perm_delete = $("<button>Remove default</button>").attr({
            "class": "plus-button",
            id: "avatars-perm-delete"
        }).appendTo(avatars_div);
        const avatars_saved = $("<div></div>").attr({
            id: "avatars-saved"
        }).appendTo(avatars_div);
        // Append new elements
        login_panel.append(main_container);
        // Finalize new elements
        $("#avatars-perm-save").click(function(event) {
            var new_default = JSON.parse(localStorage.getItem("avatar"));
            GM_setValue("plus-default-avatar", new_default);
        });
        $("#avatars-perm-delete").click(function(event) {
            GM_deleteValue("plus-default-avatar");
        });
        $("#avatars-save-name").keyup(function(event) {
            if (event.keyCode == 13) {
                var value = $(this).val();
                $(this).val("");
                console.log(value);
            };
        });
        $("#avatars-set-button").click(function(event) {
        });
        $("#avatars-setting-field").keyup(function(event) {
            if (event.keyCode == 13) {
            };
        });
        // Append custom style
        const style = $(`<style>
        #plus-main-container *:not(.plus-button) {color: #333;}
        .plus-button {background: transparent; color: #366aff; border: none; padding: 0px; width: fit-content;}
        #plus-avatars-section {display: flex; flex-direction: column;}
        #avatars-saving {flex-direction: row;}
        .plus-input {width: 45%;}
        #avatars-setting {flex-direction: row;}
        </style>`).appendTo($("head"));
    });
})();