// ==UserScript==
// @name         Cellcraft.io - Game Settings 2
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Thanks to cigoz (anda)
// @author       Attack - F8
// @match        https://cellcraft.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496391/Cellcraftio%20-%20Game%20Settings%202.user.js
// @updateURL https://update.greasyfork.org/scripts/496391/Cellcraftio%20-%20Game%20Settings%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        "Afk Botting": false,
        "Anti Afk": false,
        "Auto Split": false,
        "Auto Spawn": false
    };
    const $ = window.jQuery;

    if(null != localStorage.getItem('custom-settings')) {
        const lastSettings = JSON.parse(localStorage.getItem('custom-settings'));
        for(let item in settings) {
            settings[item] = lastSettings[item];
        };
    };
    // SYMBOLS = INTERVALS / VARIABLES, DO NOT CHANGE!.
    let 鱂=+[],勤,鱀=+[],勉,鱁=+[],鱃,鱄;
    function change(e) {
        鱀 = e.clientX;
        鱁 = e.clientY;
    };
    const functions = {
        x: function() {}, b: function() {},
        autospawn: function(d) {
            if(d == true) {
                勤 = setInterval(() => {
                    if(document.getElementById("avModal").style.display == 'block') {
                        setTimeout(function() {
                            window.closeAdvert();
                            setTimeout(function() {
                                window.setNick(document.getElementById("nick").value);
                            }, 2e3);
                        }, 3e3);
                    };
                }, 10);
            } else {
                clearInterval(勤);
                勤 = null;
            };
        },
        autosplit: function(d) {
            if(d == true) {
                勉 = setInterval(() => {
                    $("#canvas").trigger($.Event('keydown', {keyCode: ' '.charCodeAt(0)}));
                    $("#canvas").trigger($.Event('keyup', {keyCode: ' '.charCodeAt(0)}));
                }, 1);
            } else {
                clearInterval(勉);
                勉 = null;
            };
        },
        afkbotting: function(d) {
            function triggerC() {
                $('#canvas').trigger($.Event('keyup', {keyCode: 'C'.charCodeAt(0)}));
                $('#canvas').trigger($.Event('keydown', {keyCode: 'C'.charCodeAt(0)}));
            };

            function swi() {
                switch(鱂) {
                    case 0:
                        $('#canvas').trigger($.Event('mousemove', {clientX: document.getElementById("canvas").width / 2, clientY: -34e6}));
                        break;

                    case 1:
                        $('#canvas').trigger($.Event('mousemove', {clientX: 34e6, clientY: document.getElementById("canvas").height / 2}));
                        break;

                    case 2:
                        $('#canvas').trigger($.Event('mousemove', {clientX: document.getElementById("canvas").width / 2, clientY: 34e6}));
                        break;

                    case 3:
                        $('#canvas').trigger($.Event('mousemove', {clientX: -34e6, clientY: document.getElementById("canvas").height / 2}));
                        break;
                };
                triggerC();
            };
            if(d == true) {
                鱃 = setInterval(function() {
                    鱂++;
                    if(鱂 >= 4) {
                        鱂 = 0;
                    };
                    swi();
                }, 3e3);
            } else {
                clearInterval(鱃);
                鱃 = null;
                $('#canvas').trigger($.Event('keyup', {keyCode: 'C'.charCodeAt(0)}));
            };
        },
        antiafk: function(d) {
            if(d == true) {
                document.getElementById("canvas").addEventListener("mousemove", change);
                鱄 = setInterval(function() {
                    $("#canvas").trigger($.Event('mousemove', {clientX: 鱀 - 1, clientY: 鱁}));
                    $("#canvas").trigger($.Event('mousemove', {clientX: 鱀, clientY: 鱁}));
                }, 2e4);
            } else {
                document.getElementById("canvas").removeEventListener("mousemove", change, false);
                clearInterval(鱄);
                鱄 = null;
            };
        }
    };
    const newSettingNav = document.createElement('div');
    const newSettingBtn = document.createElement('button');
    newSettingBtn.setAttribute('settings-nav', 'game2');
    newSettingNav.setAttribute('settings', 'game2');

    newSettingNav.classList.add("settings-page");
    newSettingNav.style.display = 'none';

    newSettingBtn.onclick = function() {
        document.querySelectorAll('.modals .modal.settings .body .settings-nav button:not([settings-nav="game2"])').forEach(btn => {
            btn.classList.remove("active");
            btn.addEventListener("click", function() {
                newSettingBtn.classList.remove("active");
                newSettingNav.style.display = 'none';
            });
        });
        document.querySelectorAll('.modals .modal.settings .body .settings-page:not([settings="game2"])').forEach(wrap => {
            wrap.style.display = 'none';
        });
        newSettingBtn.classList.add("active");
        newSettingNav.style.display = 'block';
    };
    newSettingBtn.innerText = 'Game 2';

    document.querySelector('.modals .modal.settings .body').appendChild(newSettingNav);
    document.querySelector('.modals .modal.settings .body .settings-nav').appendChild(newSettingBtn);

    let b = 0, z = 1;
    for(let item in settings) {
        let x = b & 1;
        b++;
        x = !x;

        const settingWrapper = document.createElement("div"),
              setting = document.createElement("div"),
              checkbox = document.createElement("div"),
              input = document.createElement("input"),
              label = document.createElement("label");

        settingWrapper.classList.add("settings-wrapper");

        setting.classList.add("setting");

        checkbox.classList.add("checkbox");

        input.type = 'checkbox';
        input.checked = settings[item];
        input.id = item.toLowerCase().replaceAll(' ', '');
        input.onchange = function() {
            settings[item] = input.checked;
            functions[input.id](input.checked);
            localStorage.setItem('custom-settings', JSON.stringify(settings));
        };
        functions[input.id](settings[item]);

        label.setAttribute('for', input.id);
        label.append(document.createElement("span"), item);

        x ? (newSettingNav.appendChild(settingWrapper), settingWrapper.appendChild(setting)) : (newSettingNav.lastChild.appendChild(setting));
        setting.appendChild(checkbox);
        checkbox.append(input, label);
    };
})();