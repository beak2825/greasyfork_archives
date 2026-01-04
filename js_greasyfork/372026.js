// ==UserScript==
// @name         叔叔不约屏蔽注册页面
// @namespace    undefined
// @version      0.1.3
// @description  自动屏蔽注册页面，减少操作复杂度
// @author       UohUy
// @match        http://unclenoway.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/372026/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%B1%8F%E8%94%BD%E6%B3%A8%E5%86%8C%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/372026/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%B1%8F%E8%94%BD%E6%B3%A8%E5%86%8C%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 屏蔽注册页面
    var register = document.getElementById('popupRegister');
    if (register != null){
        register.parentNode.removeChild(register);
    }
    
    // 离开时自动点击确定
    var p = document.getElementById('button-link chat-control');
    p.addEventListener('click', function(e) {
        document.getElementById('modal-button modal-button-bold').onclick();
    })
})();