// ==UserScript==
// @name        考试答案 - edoc2.com
// @namespace   lihuozi
// @match       http://v5.edoc2.com/inbiz/eform/index
// @grant       none
// @version     1.0
// @author      李豁子
// @description 2021/7/12下午8:37:13
// @downloadURL https://update.greasyfork.org/scripts/429279/%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%20-%20edoc2com.user.js
// @updateURL https://update.greasyfork.org/scripts/429279/%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%20-%20edoc2com.meta.js
// ==/UserScript==
var myFuncs = {};
myFuncs.func1 = function () {
    if ($.getQueryString("formId") == '180605145746') {
        console.log('formId=>', $.getQueryString("formId"));
        var actions = $("td[field='action']");
        var rows =
            actions.each(function (i, el) {
                if (i > 0) {
                    console.log('html=>', $(this).html());
                    var id = eform("edoc2ListGrid").method("getRows")[i - 1].ID
                    console.log('id=>', id);
                    var ahtml = '<a class="l-btn" href="' + window.Newurl + '/Testpaper/FindAnswerSituation/?id=' + id + '">答案</a>'
                    $(this).append(ahtml);
                }
            });
    }
};

(function () {
    'use strict';
    try {
        setTimeout(myFuncs.func1, 5000);
    } catch (err) {
        console.log(err);
    }
})();