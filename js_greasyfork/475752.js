// ==UserScript==
// @name press z and view quote
// @namespace https://twitter.com/Ozone8Elements
// @version 0.11
// @description ass
// @author ガチムチパンツレスリング
// @match https://twitter.com/*/status
// @grant none
// @license MIT
// @icon  https://pbs.twimg.com/profile_images/1648181252028256257/pEDyJUWY_400x400.jpg
// @downloadURL https://update.greasyfork.org/scripts/475752/press%20z%20and%20view%20quote.user.js
// @updateURL https://update.greasyfork.org/scripts/475752/press%20z%20and%20view%20quote.meta.js
// ==/UserScript==

(function() {

    document.onkeydown = function (e){
        if(e.keyCode == 90){//z押し実行
            var current_url = location.href;//現在のURL取得
            location.href = current_url + "/quotes/";//引用にいく
        }
    };

})();