// ==UserScript==
// @name         CSDN-copy-without-login
// @namespace    lytning98_CSDN-copy-without-login
// @version      0.1
// @description  Allow copying code in CSDN posts without logging in.
// @author       lytning98
// @source       https://github.com/lytning98/CSDN-copy-without-login
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431113/CSDN-copy-without-login.user.js
// @updateURL https://update.greasyfork.org/scripts/431113/CSDN-copy-without-login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var engine = hljs.copyCode ? 'hljs' : 'mdcp';
    var $bindee = engine == 'hljs' ? $('.hljs-button.signin') : $('.prettyprint > code');

    eval(engine).signin = Function();
    $bindee.attr('onclick', engine + '.copyCode(event)');
    $('.hljs-button.signin').attr('class', 'hljs-button {2}').attr('data-title', '不登录也复制');

})();
