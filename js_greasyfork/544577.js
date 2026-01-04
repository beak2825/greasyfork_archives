// ==UserScript==
// @name         Penguinmod editor profile card
// @namespace    http://penguinmod.com
// @version      2025-08-04
// @description  A simple userscript that adds a profile card to the top right corner in the Penguinmod editor
// @author       pooiod7
// @match        https://studio.penguinmod.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=penguinmod.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544577/Penguinmod%20editor%20profile%20card.user.js
// @updateURL https://update.greasyfork.org/scripts/544577/Penguinmod%20editor%20profile%20card.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        setInterval(function() {
            var parent = document.querySelector('.menu-bar_account-info-group_MeJZP');
            if (!parent || parent.querySelector('.account-nav_user-info_dUiXV')) return;

            var ud = window.vm && vm.runtime && vm.runtime.ioDevices && vm.runtime.ioDevices.userData;
            var loggedIn = ud && ud._loggedIn;
            var username = loggedIn ? ud._username : null;

            var wrapper = document.createElement('div');
            wrapper.className = 'account-nav_user-info_dUiXV menu-bar_menu-bar-item_NKeCD menu-bar_menu-bar-item_oLDa- menu-bar_hoverable_c6WFB';
            wrapper.style.cssText = 'display:flex;align-items:center;padding:0 10px;';

            var a = document.createElement('a');
            a.style.cssText = 'display:flex;align-items:center;text-decoration:none;color:inherit;';
            a.href = loggedIn ? 'https://penguinmod.com/profile?user=' + username : 'https://penguinmod.com/signin';

            if (loggedIn) {
                var img = document.createElement('img');
                img.className = 'account-nav_avatar_Drhc7 user-avatar_user-thumbnail_G9XFP';
                img.src = 'https://projects.penguinmod.com/api/v1/users/getpfp?username=' + username;
                img.referrerPolicy = 'no-referrer';
                img.style.cssText = 'width:30px;height:30px;border-radius:5px;border:1px solid rgba(0,0,0,0.1);';
                a.appendChild(img);
            }

            var span = document.createElement('span');
            span.className = 'account-nav_profile-name_COfZL';

            if (loggedIn) {
                span.style.marginLeft = '8px';
                span.innerText = username;
            } else {
                span.innerText = 'login';
            }

            a.appendChild(span);
            wrapper.appendChild(a);
            parent.appendChild(wrapper);
        }, 1000);
    }, 1000);
})();