// ==UserScript==
// @name         Steam Achievements Filter
// @name:zh      Steam 成就过滤
// @name:zh-CN   Steam 成就过滤
// @name:zh-HK   Steam 成就過濾
// @name:zh-TW   Steam 成就過濾
// @name:en      Steam Achievements Filter
// @description       Steam achievements filtering to show all, completed and uncompleted
// @description:zh    Steam 成就过滤，显示全部、已完成和未完成
// @description:zh-CN Steam 成就过滤，显示全部、已完成和未完成
// @description:zh-HK Steam 成就過濾，顯示全部、已完成和未完成
// @description:zh-TW Steam 成就過濾，顯示全部、已完成和未完成
// @description:en    Steam achievements filtering to show all, completed and uncompleted
// @version      0.3.1
// @author       Ifover
// @match        *://steamcommunity.com/stats/*/achievements*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0 License
// @namespace    https://greasyfork.org/zh-CN/scripts/439041
// @supportURL   https://github.com/Ifover/JS_jioben
// @homepageURL  https://github.com/Ifover/JS_jioben
// @downloadURL https://update.greasyfork.org/scripts/439041/Steam%20Achievements%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/439041/Steam%20Achievements%20Filter.meta.js
// ==/UserScript==

var achievementsStatus;
var id

function _init() {
    var append_style = `
      <style type="text/css">
          .achievements-txt{color: #898989;}
      </style>
    `
    jQuery('head').append(append_style);



    let headerContentLeft = jQuery('#headerContentLeft')
    let action = jQuery(`
      <div>
          成就状态: 
          <a class="achievements-txt all" style="color: #fff">全部</a>
           /         
          <a class="achievements-txt unlocked">已完成</a>
           / 
          <a class="achievements-txt locked">未完成</a>
      </div>
    `)
    headerContentLeft.append(action)


    jQuery('.achievements-txt').on('click', function () {
        handleToggle(jQuery(this).index());
        GM_setValue('achievements' + id, jQuery(this).index())

        jQuery('.achievements-txt').css({color: "#898989"})
        jQuery(this).css({color: "#fff"})
    })


    let match = location.pathname.match(/\d+/g)
    id = match[0]

    if (GM_getValue('achievements' + id)) {
        achievementsStatus = GM_getValue('achievements' + id)
        jQuery('.achievements-txt').css({color: "#898989"})
        jQuery(jQuery('.achievements-txt')[achievementsStatus]).css({color: "#fff"})
    } else {
        GM_setValue('achievements' + id, 0)
    }

    handleToggle()

}

function handleToggle(aStatus = achievementsStatus) {
    switch (aStatus) {
        case 1:
            // only show unlocked
            jQuery('.achieveRow').show()
            jQuery('.achieveRow').not('.unlocked').hide()
            break
        case 2:
            // only show locked
            jQuery('.achieveRow').show()
            jQuery('.achieveRow.unlocked').hide()
            break
        default:
            // Show All
            jQuery('.achieveRow').show()
            break
    }
}


(function () {
    'use strict';
    _init()


})();
