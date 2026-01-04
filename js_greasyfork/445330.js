// ==UserScript==
// @name            Disboard - Hide Servers
// @namespace       https://github.com/y-mamanaranu
// @license         MIT
// @version         0.1.4
// @description     Hide spesific servers from Disboard
// @description:ja  Disboardで特定のサーバーを非表示にする
// @author          Yoiduki <y-mamanaranu>
// @match           https://disboard.org/*
// @exclude         https://disboard.org/*/server/*
// @exclude         https://disboard.org/*/dashboard/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=disboard.org
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM.getValue
// @grant           GM.setValue
// @supportURL      https://gist.github.com/y-mamanaranu/9c85d2a5f89c7b7111cfd0c2356b3205
// @downloadURL https://update.greasyfork.org/scripts/445330/Disboard%20-%20Hide%20Servers.user.js
// @updateURL https://update.greasyfork.org/scripts/445330/Disboard%20-%20Hide%20Servers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gmc = new GM_config(
        {
            'id': 'MyConfig', // The id used for this instance of GM_config
            'fields': // Fields object
            {
                "SectionExceptServer":{
                    'section': ['Except Server'],
                    'type': 'hidden', // Makes this setting a hidden input
                    'value': '' // Value stored
                },
                'EnableExceptServer':
                {
                    'label': 'Enable', // Appears next to field
                    'type': 'checkbox', // Makes this setting a checkbox input
                    'default': true // Default value if user doesn't change it
                },
                'ReverseExceptServer':
                {
                    'label': 'Reverse', // Appears next to field
                    'type': 'checkbox', // Makes this setting a checkbox input
                    'default': false // Default value if user doesn't change it
                },
                'ExceptServer': // This is the id of the field
                {
                    'label': 'Server List', // Appears next to field
                    'type': 'textarea', // Makes this setting a text field
                    'default': '', // Default value if user doesn't change it
                    rows: 20,
                    cols: 120,
                },
                "SectionExceptTag":{
                    'section': ['Except Tag'],
                    'type': 'hidden', // Makes this setting a hidden input
                    'value': '' // Value stored
                },
                'EnableExceptTag':
                {
                    'label': 'Enable', // Appears next to field
                    'type': 'checkbox', // Makes this setting a checkbox input
                    'default': true // Default value if user doesn't change it
                },
                'ReverseExceptTag':
                {
                    'label': 'Reverse', // Appears next to field
                    'type': 'checkbox', // Makes this setting a checkbox input
                    'default': false // Default value if user doesn't change it
                },
                'ExceptTag': // This is the id of the field
                {
                    'label': 'Tag List', // Appears next to field
                    'type': 'textarea', // Makes this setting a text field
                    'default': '', // Default value if user doesn't change it
                    rows: 20,
                    cols: 120,
                },
                "SectionReload":{
                    'section': ['Reload'],
                    'type': 'hidden', // Makes this setting a hidden input
                    'value': '' // Value stored
                },
                'SaveandReload':
                {
                    'label': 'Save and Reload', // Appears on the button
                    'type': 'button', // Makes this setting a button input
                    'size': 100, // Control the size of the button (default is 25)
                    'click': function() { // Function to call when button is clicked
                        gmc.save();
                        location.reload();
                    }
                }
            },
            'events': {
                'init': onInit
            }
        });

    function onInit() {
        // initialization complete
        // value is now available
        createConfig();
        addExceptButton();
        hideListedServer();
        hideListedTag();
    }

    // Except Server
    const getServerId = () => {
        var ecept_server = gmc.get('ExceptServer');
        ecept_server = ecept_server.split('\n');
        ecept_server = ecept_server.map(server => server.trim());
        ecept_server = ecept_server.filter(server => server)
        ecept_server = ecept_server.filter(server => !server.startsWith("//"));
        return ecept_server
    }

    const judgeServer　= (elem) => {
        var serverjoin = elem.getElementsByClassName("server-join")[0];
        var a = serverjoin.getElementsByTagName("a")[0];
        var num = a.getAttribute("data-id");
        return getServerId().includes(num);
    }

    const hideListedServer_sub = (elem) => {
        if (elem.style.display !="none" ){
            if (judgeServer(elem)){
                elem.style.display="none";
            }
        }
    }

    const hideListedServer_sub_reverse = (elem) => {
        if (elem.style.display !="none" ){
            if (!judgeServer(elem)){
                elem.style.display="none";
            }
        }
    }

    const hideListedServer = () => {
        var enable_server = gmc.get('EnableExceptServer');
        if (enable_server) {
            var reverse = gmc.get('ReverseExceptServer');
            var column = document.getElementsByClassName("column is-half-tablet");
            column = Array.from(column);
            if (reverse) {
                column.forEach((elem) => hideListedServer_sub_reverse(elem));
            } else {
                column.forEach((elem) => hideListedServer_sub(elem));
            }
        }
    }

    // Except Tag
    const getTag = () => {
        var ecept_tag = gmc.get('ExceptTag');
        ecept_tag = ecept_tag.split('\n');
        ecept_tag = ecept_tag.map(server => server.trim());
        ecept_tag = ecept_tag.filter(server => server)
        ecept_tag = ecept_tag.filter(server => !server.startsWith("//"));
        return ecept_tag
    }

    const judgeTag　= (elem) => {
        var tag = elem.getElementsByClassName("tag");
        var tag_list = getTag();
        tag = Array.from(tag);
        tag = tag.map((elem) => elem.getAttribute("title"));
        tag = tag.filter(elem => tag_list.includes(elem))
        return tag.length > 0;
    }

    const hideListedTag_sub = (elem) => {
        if (elem.style.display !="none" ){
            if (judgeTag(elem)){
                elem.style.display="none";
            }
        }
    }

    const hideListedTag_sub_reverse = (elem) => {
        if (elem.style.display !="none" ){
            if (!judgeTag(elem)){
                elem.style.display="none";
            }
        }
    }

    const hideListedTag = () => {
        var enable_server = gmc.get('EnableExceptTag');
        if (enable_server) {
            var reverse = gmc.get('ReverseExceptTag');
            var column = document.getElementsByClassName("column is-half-tablet");
            column = Array.from(column);
            if (reverse) {
                column.forEach((elem) => hideListedTag_sub_reverse(elem));
            } else {
                column.forEach((elem) => hideListedTag_sub(elem));
            }
        }
    }

    // Create Config
    const createConfig = () => {
        var user_menu = document.getElementById("dropdown-user-menu");
        var content = user_menu.getElementsByClassName("dropdown-content")[0];

        var a = document.createElement("a");
        var divider = content.getElementsByClassName("dropdown-divider")[0];
        content.insertBefore(a, divider);
        a.classList.add("dropdown-item")
        a.onclick = function() {
            gmc.open();
        };

        var span = document.createElement("span");
        span.textContent = "除外設定";
        a.appendChild(span);
    }

    // Add excpept button for each server
    const addExceptButton = () => {
        var div_list = document.getElementsByClassName("column is-half-tablet");

        div_list = Array.from(div_list);
        div_list.forEach((elem) => {
            elem.getElementsByClassName("dropdown-menu");
            var menu = elem.getElementsByClassName("dropdown-menu")[0];

            var ul = menu.getElementsByTagName("ul")[0];

            var li = document.createElement("li");
            ul.appendChild(li);

            var a = document.createElement("a");
            li.appendChild(a);
            a.textContent="除外";
            a.classList.add("dropdown-item");

            var res = menu.id.split("-");
            var id = res[res.length-1];

            a.onclick = function() {
                var ecept_server = gmc.get('ExceptServer');
                ecept_server = ecept_server + "\n" + id;
                gmc.set("ExceptServer", ecept_server);
                gmc.save();
                elem.style.display="none";
            };
        });
    }
    })();