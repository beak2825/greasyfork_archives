// ==UserScript==
// @name         Jo's J.AI for Violentmonkey
// @namespace    http://violentmonkey.github.io/
// @version      0.11
// @description  A little thing for janitorai that lets you password protect it with a little copy paste menu that you yourself customize.
// @match        *://janitorai.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492968/Jo%27s%20JAI%20for%20Violentmonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/492968/Jo%27s%20JAI%20for%20Violentmonkey.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var passwordProtectionEnabled = GM_getValue('passwordProtectionEnabled', true);
    var currentPassword = GM_getValue('currentPassword', "ABC123");

    //password stuffs
    if (passwordProtectionEnabled) {
        var password = prompt("Please enter the password to access this site:", "");
        if (password !== currentPassword) {
            alert("Incorrect password. Access denied.");
            window.location.href = "about:blank";
            return;
        }
    }
    //styles :3
    GM_addStyle(`
        #copyPasteMenu, #configMenu {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 250px;
            max-height: 300px;
            overflow-y: auto;
            background-color: purple;
            border: 1px solid black;
            z-index: 10000;
            padding: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            display: none;
        }
        .copyItem {
            margin: 5px;
            padding: 5px;
            background-color: rgba(255, 255, 255, 0.25);
            color: white;
            cursor: pointer;
        }
        .copyItem:hover {
            background-color: rgba(255, 255, 255, 0.35);
        }
    `);


    var copypaste = document.createElement('div');
    copypaste.id = 'copyPasteMenu';
    document.body.appendChild(copypaste);
  //EDIT THIS PART HERE FOR YOUR COPY PASTE MENU
    var items = [
        { display: 'Display Text 1', copy: 'Copy Text 1' },
        { display: 'Display Text 2', copy: 'Copy Text 2' },
        { display: 'Display Text 3', copy: 'Copy Text 3' }
    ];
    items.forEach(function(item) {
        var div = document.createElement('div');
        div.textContent = item.display;
        div.className = 'copyItem';
        div.onclick = function() { GM_setClipboard(item.copy); };
        copypaste.appendChild(div);
    });

    //keybinds
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === '\\') {
            copypaste.style.display = copypaste.style.display === 'none' ? 'block' : 'none';
        }
        if (e.ctrlKey && e.altKey && e.key === 'e') {
            configMenu.style.display = configMenu.style.display === 'none' ? 'block' : 'none';
        }
    });
    //config menu things
    function createConfigMenu() {
        var configMenu = document.createElement('div');
        configMenu.id = 'configMenu';
        configMenu.style.cssText = 'position: fixed; top: 50px; right: 10px; background-color: dimgray; padding: 10px; border: 4px solid black; z-index: 10001; display: none;';
        document.body.appendChild(configMenu);

        var toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = passwordProtectionEnabled;
        var toggleLabel = document.createElement('label');
        toggleLabel.textContent = 'Enable Password Protection';
        configMenu.appendChild(toggleLabel);
        configMenu.appendChild(toggle);

        var passwordInput = document.createElement('input');
        passwordInput.type = 'text';
        passwordInput.value = currentPassword;
        var passwordLabel = document.createElement('label');
        passwordLabel.textContent = 'Change Password: ';
        configMenu.appendChild(passwordLabel);
        configMenu.appendChild(passwordInput);

        var updateButton = document.createElement('button');
        updateButton.textContent = 'Update Settings';
        updateButton.onclick = function() {
            GM_setValue('passwordProtectionEnabled', toggle.checked);
            GM_setValue('currentPassword', passwordInput.value);
            alert('Settings updated successfully!');
            configMenu.style.display = 'none';
        };
        configMenu.appendChild(updateButton);

        return configMenu;
    }

    var configMenu = createConfigMenu();

    copypaste.onmousedown = function(event) {
        event.preventDefault();
        var shiftX = event.clientX - copypaste.getBoundingClientRect().left;
        var shiftY = event.clientY - copypaste.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            copypaste.style.left = pageX - shiftX + 'px';
            copypaste.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        copypaste.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            copypaste.onmouseup = null;
        };
    };

    copypaste.ondragstart = function() {
        return false;
    };
})();
