// ==UserScript==
// @name         Fannstar News
// @namespace    http://tampermonkey.net/
// @description  only for kd
// @author       Wang
// @match        http://en.fannstar.tf.co.kr/mission/news
// @match        http://fannstar.tf.co.kr/mission/news
// @match        http://jp.fannstar.tf.co.kr/mission/news
// @match        http://cn.fannstar.tf.co.kr/mission/news
// @match        http://vn.fannstar.tf.co.kr/mission/news

// @exclude      http://en.fannstar.tf.co.kr/news/view/
// @exclude      http://fannstar.tf.co.kr/news/view/
// @exclude      http://jp.fannstar.tf.co.kr/news/view/
// @exclude      http://cn.fannstar.tf.co.kr/news/view/
// @exclude      http://vn.fannstar.tf.co.kr/news/view/

// @grant        none

// @version     0.1.0

// @downloadURL https://update.greasyfork.org/scripts/395467/Fannstar%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/395467/Fannstar%20News.meta.js
// ==/UserScript==


(function(){
        var links = $(".newsImg > a")
        for (var i=0;i<links.length;i++){
            var href = links[i].href;
            if(href.toLowerCase().indexOf('news/view/') > 0){
               window.open(links[i].href);
            }
        }
})();