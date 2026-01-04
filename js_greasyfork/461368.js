// ==UserScript==
// @name         鼠标悬浮查看密码
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  鼠标悬浮在密码框，显示密码，移除恢复。
// @author       Blazing
// @include      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461368/%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E6%9F%A5%E7%9C%8B%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/461368/%E9%BC%A0%E6%A0%87%E6%82%AC%E6%B5%AE%E6%9F%A5%E7%9C%8B%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    var passwordFields = document.querySelectorAll("input[type='password']");
    passwordFields.forEach(function(field) {
        field.addEventListener("mouseover", function() {
            field.type = "text";
        });
        field.addEventListener("mouseout", function() {
            field.type = "password";
        });
    });

})();