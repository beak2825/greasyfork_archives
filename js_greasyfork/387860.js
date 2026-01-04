// ==UserScript==
// @name         中华网答题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动勾选答案!
// @author       You
// @match        http://jxjyxuexi.chinaacc.com/webexam/examscoreNew.aspx*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387860/%E4%B8%AD%E5%8D%8E%E7%BD%91%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/387860/%E4%B8%AD%E5%8D%8E%E7%BD%91%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var answerItems = [
        {"id":"12512020","answer":["D"]},
        {"id":"12863477","answer":["A"]},
        {"id":"12588680","answer":["D"]},
        {"id":"12524385","answer":["C"]},
        {"id":"12863591","answer":["B"]},
        {"id":"12863242","answer":["C"]},
        {"id":"12360270","answer":["B"]},
        {"id":"12524389","answer":["D"]},
        {"id":"12524392","answer":["A"]},
        {"id":"12863586","answer":["C"]},
        {"id":"12589462","answer":["D"]},
        {"id":"12512011","answer":["D"]},
        {"id":"12644370","answer":["B"]},
        {"id":"12589414","answer":["A"]},
        {"id":"12863583","answer":["B"]},
        {"id":"12644373","answer":["A"]},
        {"id":"12588689","answer":["B"]},
        {"id":"12863582","answer":["C"]},
        {"id":"12589464","answer":["B"]},
        {"id":"12644365","answer":["B"]},
        {"id":"12588682","answer":["B"]},
        {"id":"12588681","answer":["C"]},
        {"id":"12360262","answer":["D"]},
        {"id":"12524394","answer":["D"]},
        {"id":"12863474","answer":["C"]},
        {"id":"12360272","answer":["A","B","C","D"]},
        {"id":"12644382","answer":["A","B","C"]},
        {"id":"12524399","answer":["A","B","D"]},
        {"id":"12360280","answer":["A","B","C"]},
        {"id":"12512029","answer":["A","B","C"]},
        {"id":"12360275","answer":["A","B","C","D"]},
        {"id":"12512035","answer":["Y"]},
        {"id":"12524411","answer":["Y"]},
        {"id":"12588705","answer":["Y"]},
        {"id":"12588703","answer":["N"]},
        {"id":"12588706","answer":["Y"]},
        {"id":"12512031","answer":["Y"]},
        {"id":"12360283","answer":["N"]},
        {"id":"12644390","answer":["N"]},
        {"id":"12524414","answer":["N"]},
        {"id":"12524408","answer":["Y"]}
    ];

    answerItems.forEach(e => {
        if (!e["answer"]) {
            return;
        }
        e["answer"].forEach(aw => {
            $("#answer" + e["id"] + " input[value='" + aw + "']").prop("checked", true);
        });
    });

    $("#a").on("click", function(){
        $("html").scrollTop(20000);
    });

})();