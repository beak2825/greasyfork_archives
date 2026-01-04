// ==UserScript==
// @name         巴哈姆特之C頁文章顯示子板
// @description  可以在C頁文章頁面確認子板，無須回到B頁文章列表查看。
// @namespace    nathan60107
// @version      2.5
// @author       nathan60107(貝果)
// @contributor  moontai0724(我是月太 づ(・ω・)づ)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      https://forum.gamer.com.tw/C*
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/374365/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8BC%E9%A0%81%E6%96%87%E7%AB%A0%E9%A1%AF%E7%A4%BA%E5%AD%90%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/374365/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8BC%E9%A0%81%E6%96%87%E7%AB%A0%E9%A1%AF%E7%A4%BA%E5%AD%90%E6%9D%BF.meta.js
// ==/UserScript==

(function(){
    jQuery('head').append('<style type="text/css"> .tag-category_item { display:none!important; } </style>>')

    let bsn = window.location.href.match(/.*[^b]bsn=(\d+).*/)[1]
    let subbsn = jQuery(".more .tippy-option-menu").data("tippy")["subbsn"]

    function expand_title(target, subbsn_name){
        jQuery(target).text(`《${subbsn_name}》${jQuery(target).text()}`)
    }

    function add_subbsn(data){
        let subbsn_name = jQuery(data).find(`.b-tags__item a[href$="${bsn}&subbsn=${subbsn}"]`).text()
        expand_title(".c-post__header__title", subbsn_name)
        expand_title(".c-disable__title", subbsn_name)
        expand_title(".title", subbsn_name)
    }

    jQuery.get({
        url: `https://forum.gamer.com.tw/B.php?bsn=${bsn}`,
        success: add_subbsn,
    })
})();
