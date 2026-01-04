// ==UserScript==
// @name         隐藏B站首页分区
// @version      0.1
// @description  隐藏B站首页不感兴趣的分区
// @author       popner
// @match        https://www.bilibili.com/
// @namespace    https://greasyfork.org/users/686957
// @downloadURL https://update.greasyfork.org/scripts/411250/%E9%9A%90%E8%97%8FB%E7%AB%99%E9%A6%96%E9%A1%B5%E5%88%86%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411250/%E9%9A%90%E8%97%8FB%E7%AB%99%E9%A6%96%E9%A1%B5%E5%88%86%E5%8C%BA.meta.js
// ==/UserScript==

// 自定义要显示的分区
var visibleSections = ["动画", "番剧", "音乐", "游戏", "数码", "生活", "鬼畜"];
// 如果未生效，增加此数值
var timeout = 100;

var sectionToIdMap = new Map([
    ["直播", "bili_live"],
    ["动画", "bili_douga"],
    ["番剧", "bili_anime"],
    ["国创", "bili_guochuang"],
    ["漫画", "bili_manga"],
    ["音乐", "bili_music"],
    ["舞蹈", "bili_dance"],
    ["游戏", "bili_game"],
    ["知识", "bili_technology"],
    ["课堂", "bili_cheese"],
    ["数码", "bili_digital"],
    ["生活", "bili_life"],
    ["鬼畜", "bili_kichiku"],
    ["时尚", "bili_fashion"],
    ["资讯", "bili_information"],
    ["娱乐", "bili_ent"],
    ["专栏", "bili_read"],
    ["电影", "bili_movie"],
    ["TV剧", "bili_teleplay"],
    ["影视", "bili_cinephile"],
    ["纪录片", "bili_documentary"],
]);

function hideSections() {
    // Section elements
    var sectionEls = document.querySelectorAll(".proxy-box > div");
    // Sidenav elements
    var sidenavEls = document.querySelectorAll("#elevator div.item.sortable");
    // IDs of visible sections
    var visibleSectionIds = visibleSections.map(function(section) {return sectionToIdMap.get(section);});
    for(var i = 0; i < sectionEls.length; i++) {
        if(!visibleSectionIds.includes(sectionEls[i].id)) {
            sectionEls[i].style.display = "none";
            sidenavEls[i].style.display = "none";
        }
    }
}

window.onload = function() {
    setTimeout(hideSections, timeout);
};
