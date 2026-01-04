// ==UserScript==
// @name         bangumi 点格子上方的分类按钮生效
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  喵喵
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/$/
// @downloadURL https://update.greasyfork.org/scripts/392858/bangumi%20%E7%82%B9%E6%A0%BC%E5%AD%90%E4%B8%8A%E6%96%B9%E7%9A%84%E5%88%86%E7%B1%BB%E6%8C%89%E9%92%AE%E7%94%9F%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/392858/bangumi%20%E7%82%B9%E6%A0%BC%E5%AD%90%E4%B8%8A%E6%96%B9%E7%9A%84%E5%88%86%E7%B1%BB%E6%8C%89%E9%92%AE%E7%94%9F%E6%95%88.meta.js
// ==/UserScript==

(function() {
    let btns = $("#prgCatrgoryFilter").find("a");
    let subjects = $("#prgManagerMain").find(".infoWrapper");
    btns.click(function() {
        let subject_type = $(this).attr("subject_type");
        let num = 0;
        for(let i=0;i < subjects.length;i++) {
            let subject = subjects.eq(i);
            if(subject.attr("subject_type") != subject_type && subject_type != 0) {
                subject.hide();
            } else {
                subject.show();
                num++;
                if(num % 2 != 0) {
                    subject.addClass("odd");
                } else {
                    subject.removeClass("odd");
                }
            }
        }
    });
})();