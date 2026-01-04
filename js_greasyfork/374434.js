// ==UserScript==
// @name         巴哈姆特之隨時隨地使用樓層電梯
// @description  在Co頁(單一樓層文章)也能使用樓層電梯，不限於C頁。
// @namespace    nathan60107
// @version      2.1
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @match      https://forum.gamer.com.tw/Co.php?*
// @downloadURL https://update.greasyfork.org/scripts/374434/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E9%9A%A8%E6%99%82%E9%9A%A8%E5%9C%B0%E4%BD%BF%E7%94%A8%E6%A8%93%E5%B1%A4%E9%9B%BB%E6%A2%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/374434/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E9%9A%A8%E6%99%82%E9%9A%A8%E5%9C%B0%E4%BD%BF%E7%94%A8%E6%A8%93%E5%B1%A4%E9%9B%BB%E6%A2%AF.meta.js
// ==/UserScript==

Forum.C.elevator = function (event, bsn, snA) { //改寫電梯function使得Co頁也能使用
    event = event || window.event;
    if (event.keyCode == 13) {
        var to = parseInt((event.target || event.srcElement).value, 10);
        if (!isNaN(to)) {
            if ($('[data-floor=' + to + ']').length) {
                var elem = $('[data-floor=' + to + ']:visible').parents('.c-post, .c-disable');
                var scrollTop = elem.offset().top - 130;
                jQuery('html, body').scrollTop(scrollTop);
                elem.css('animation', '2s highlight')
            } else {
                var loc = window.location;
                loc.href = 'https://' + loc.host + "/C.php" + '?bsn=' + bsn + '&snA=' + snA + '&to=' + to
            }
        }
    }
}

const query = jQuery('.BH-menu-forumA-back > a')[0].href
const bsn = query.match(/bsn=(\d+)/)[1]
const snA = query.match(/snA=(\d+)/)[1]

//啟用被隱藏的電梯相關界面
var obj = jQuery(".baha_quicktool").prepend(`
<div class="quicktool jumpfloor">
  <input onkeypress="Forum.C.elevator(event, ${bsn}, ${snA});if (event.keyCode == 13) {dataLayer.push({'event': 'keypress-enter'});}" type="text" placeholder="？樓" data-gtm="點擊電梯" data-gtm_type_name="自行輸入" data-gtm_service_name="forum" data-gtm_page_name="哈啦板文章內容頁">
  <button onclick="Forum.C.elevator({keyCode: 13, manual: true, target: {value: 1}}, ${bsn}, ${snA})" data-gtm="點擊電梯" data-gtm_type_name="到一樓" data-gtm_service_name="forum" data-gtm_page_name="哈啦板文章內容頁">一樓</button>
  <button onclick="Forum.C.elevator({keyCode: 13, manual: true, target: {value: 99999}}, ${bsn}, ${snA})" data-gtm="點擊電梯" data-gtm_type_name="到最新" data-gtm_service_name="forum" data-gtm_page_name="哈啦板文章內容頁">最新</button>
</div>
`)
