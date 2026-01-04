// ==UserScript==
// @name         Offcloud-Remote-Switch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动修改Offcloud网站里Remote功能的发送对象
// @author       维克牛
// @match        https://*.offcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394115/Offcloud-Remote-Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/394115/Offcloud-Remote-Switch.meta.js
// ==/UserScript==

//脚本编写日期：2019年12月24日


//

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){ document.getElementsByTagName("option")[3].selected = true;}, 3000);

})();
