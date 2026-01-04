// ==UserScript==
// @name         Новогодниый титл Zelenka
// @author       stealyourbrain
// @license      MIT
// @description  новогодный титл zelenka 
// @match        https://zelenka.guru/*
// @version 0.0.1.20231120103606
// @namespace https://greasyfork.org/users/1220529
// @downloadURL https://update.greasyfork.org/scripts/480356/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D1%8B%D0%B9%20%D1%82%D0%B8%D1%82%D0%BB%20Zelenka.user.js
// @updateURL https://update.greasyfork.org/scripts/480356/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D1%8B%D0%B9%20%D1%82%D0%B8%D1%82%D0%BB%20Zelenka.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const treeEmoji = '\ud83c\udf84';
    const dotEmoji = '\u2022';

    function addTreeAndDotToTabTitle() {
        document.title = `${treeEmoji} ${dotEmoji} ${document.title}`;
    }

    addTreeAndDotToTabTitle();
})();