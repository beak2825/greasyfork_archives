// ==UserScript==
// @name                   Enable DLsite work name to be selected
// @name:zh-CN             可以选中 DLsite 作品名
// @namespace              http://tampermonkey.net/
// @version                0.3
// @description            Enable DLsite work name to be selected.
// @description:zh-cn      使 DLsite 作品名可以被选中。
// @author                 Retr#000
// @match                  https://www.dlsite.com/*
// @icon                   https://www.dlsite.com/images/web/common/favicon.ico
// @grant                  none
// @license                MIT
// @downloadURL https://update.greasyfork.org/scripts/455379/Enable%20DLsite%20work%20name%20to%20be%20selected.user.js
// @updateURL https://update.greasyfork.org/scripts/455379/Enable%20DLsite%20work%20name%20to%20be%20selected.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var h = $('h1#work_name');
    $(h).attr({"id":"work_name","style":"color:#333;font-size:20px;background:none;user-select:auto"});

})();