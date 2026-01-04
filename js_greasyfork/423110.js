// ==UserScript==
// @name        美剧播出时间表 今天
// @namespace   superszy
// @author      superszy
// @description 适用于huo720.com
// @match       https://huo720.com/calendar*
// @match       http://huo720.com/calendar*
// @run-at document-end
// @version     1.0.6
// @downloadURL https://update.greasyfork.org/scripts/423110/%E7%BE%8E%E5%89%A7%E6%92%AD%E5%87%BA%E6%97%B6%E9%97%B4%E8%A1%A8%20%E4%BB%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/423110/%E7%BE%8E%E5%89%A7%E6%92%AD%E5%87%BA%E6%97%B6%E9%97%B4%E8%A1%A8%20%E4%BB%8A%E5%A4%A9.meta.js
// ==/UserScript==

{
    const url = location.href;

    const today = new Date().getFullYear() + "-" + ((new Date().getMonth()+1)>9 ? "" : "0") + (new Date().getMonth()+1) + "-" + (new Date().getDate()>9 ? "" : "0") + new Date().getDate();
    const month1 = new Date().getFullYear() + "-" + ((new Date().getMonth()+1)>9 ? "" : "0") + (new Date().getMonth()+1) + "-01";

    const findDate = url.indexOf("date");
    const findMonth1 = url.indexOf("month1");

    var btn = "<a class=\"jump px-1 link-light\" href=";
    if ( findDate > 0 && findMonth1 == -1 ) {
        btn += "?date=" + month1;
    }
    btn += "#" + today;
    btn += " one-link-mark=\"yes\">今天</a>";

    document
        .querySelector('.jump.px-1.link-light')
        .insertAdjacentHTML('beforeBegin', btn);

    if ( findDate == -1 || findMonth1 > 0 ) {
        window.location.href = '#' + today;
    }
}