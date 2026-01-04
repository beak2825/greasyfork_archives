// ==UserScript==
// @name         快捷Wiki键
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  添加一个wiki键
// @author       cureDovahkiin + CryoVit + 墨云
// @match        https://bangumi.tv/subject/*
// @match        https://bgm.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516497/%E5%BF%AB%E6%8D%B7Wiki%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/516497/%E5%BF%AB%E6%8D%B7Wiki%E9%94%AE.meta.js
// ==/UserScript==

/*global $*/

var isSubjectPage = window.location.href.match(/\/subject\/(.*)$/i);

if (isSubjectPage && !isSubjectPage[1].includes('/')) {
    var id = isSubjectPage[1];
    if (id) {
        var li = document.createElement('li');
        var href = '/subject/' + id + '/edit_detail';
        li.innerHTML = "<a href=\"" + href + "\" target=\"_blank\">Wiki</a>";
        $('.subjectNav .navTabs').append(li);
    }
}