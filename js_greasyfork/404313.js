// ==UserScript==
// @name         Login link at the top on OxygenBuilder.com
// @namespace    https://wpdevdesign.com/
// @version      0.1
// @description  Adds links to Login and Downloads in the top nav menu on OxygenBuilder.com
// @author       Sridhar Katakam
// @match        https://oxygenbuilder.com*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404313/Login%20link%20at%20the%20top%20on%20OxygenBuildercom.user.js
// @updateURL https://update.greasyfork.org/scripts/404313/Login%20link%20at%20the%20top%20on%20OxygenBuildercom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.indexOf('portal') === -1) { // if the URL does not contain `portal`
        var div = document.createElement('div');

        document.getElementById('div_block-330-6').appendChild(div);

        var loginLink = document.createElement('a');
        if (document.body.classList.contains('logged-in')) {
            loginLink.innerText = 'Logout';
            loginLink.setAttribute('href','https://oxygenbuilder.com/wp-login.php?action=logout');
        } else {
            loginLink.innerText = 'Login';
            loginLink.setAttribute('href','https://oxygenbuilder.com/portal/');
        }
        loginLink.classList.add('oxy-dropdown-link');
        div.appendChild(loginLink);

        var downloadsLink = document.createElement('a');
        downloadsLink.setAttribute('href','https://oxygenbuilder.com/portal/purchase-history');
        downloadsLink.innerText = 'Downloads';
        downloadsLink.classList.add('oxy-dropdown-link');
        div.appendChild(downloadsLink);

        /* var blogLink = document.createElement('a');
        blogLink.setAttribute('href','https://oxygenbuilder.com/blog/');
        blogLink.innerText = 'Blog';
        blogLink.classList.add('oxy-dropdown-link');
        div.appendChild(blogLink); */
    }

})();