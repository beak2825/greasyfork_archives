// ==UserScript==
// @name         ptt防爆雷
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       vi000246
// @run-at       document-start
// @description  try to take over the world!
// @author       You
// @match        https://term.ptt.cc/
// @match        https://iamchucky.github.io/PttChrome/index.html
// @grant        none
//@require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/382161/ptt%E9%98%B2%E7%88%86%E9%9B%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/382161/ptt%E9%98%B2%E7%88%86%E9%9B%B7.meta.js
// ==/UserScript==

(function() {
    var keyword = "鋼鐵人,黑寡婦,復仇,復4,復聯,美隊,美國隊長,索爾,浩克,涅布拉,驚奇隊長,Iron,肛鐵人,蟻人,鷹眼,漫威,無限,死,滅,殺,die,kill,剩,消失,不見,天國,升天,鴨蛋,故,逝,去世,去了,掛掉,掛了,掛點,爆炸,救,活,格魯特,火箭,熊,蜘蛛,彼得,帕克,星爵,復四,終局之戰,薩諾斯";
    var substrings = keyword.split(',');

 setInterval(function () {
        $("span[type='bbsrow']").css({ opacity: 1 });
        if($("#mainContainer > span:nth-child(3)").find("span.q0.b7:contains('編號    日 期 作  者       文  章  標  題')").text().length>0){
            var matchRow = $("span[type='bbsrow']").filter(function () {
                return new RegExp(substrings.join("|"), 'gi').test($(this).html());
            });
            matchRow.css({ opacity: 0.0 });
        }

    },500);

})();