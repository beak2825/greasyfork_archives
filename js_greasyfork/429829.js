// ==UserScript==
// @name         2021年广东省教师继续教育公需课-真·全自动版本
// @namespace    https://jsglpt.gdedu.gov.cn
// @version      1.0.1
// @description  《人工智能发展与产业应用》和《科技创新现状与发展趋势》自动识别，自动静音看视频，完成后自动切换到下一个，自动屏蔽中途答题，自动满分考核，考核完成后自动跳转到进度页面，完成情况一目了然，总之自动就完事！
// @author       星星课
// @include      *study/course/c_4e9f50e2756a4bf5ad1ca9696672681a*
// @include      *study/course/c_f03e978ceb05464095427119fd8c9ada*
// @icon         http://jsxx.gdedu.gov.cn/ncts/custom/gongxu/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429829/2021%E5%B9%B4%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE-%E7%9C%9F%C2%B7%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429829/2021%E5%B9%B4%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE-%E7%9C%9F%C2%B7%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var c_f03e978ceb05464095427119fd8c9ada = { "qti_item_Q1:2:1_RESPONSE": [[0], [1]], "qti_item_Q2:3:1_RESPONSE": [[0], [1]], "qti_item_Q3:4:1_RESPONSE": [[1]], "qti_item_Q4:5:1_RESPONSE": [[1]], "qti_item_Q5:6:1_RESPONSE": [[1]], "qti_item_Q6:7:1_RESPONSE": [[0], [1]], "qti_item_Q7:8:1_RESPONSE": [[0], [1]], "qti_item_Q8:9:1_RESPONSE": [[1]], "qti_item_Q9:10:1_RESPONSE": [[0], [1]], "qti_item_Q10:11:1_RESPONSE": [[0], [1]], "qti_item_Q11:12:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q12:13:1_RESPONSE": [[1], [2], [3]], "qti_item_Q13:14:1_RESPONSE": [[2], [3]], "qti_item_Q14:15:1_RESPONSE": [[1], [2], [3]], "qti_item_Q15:16:1_RESPONSE": [[1], [2], [3]], "qti_item_Q16:17:1_RESPONSE": [[1], [2], [3]], "qti_item_Q17:18:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q18:19:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q19:20:1_RESPONSE": [[3]], "qti_item_Q20:21:1_RESPONSE": [[1], [2], [3]], "qti_item_Q21:22:1_RESPONSE": [[0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q22:23:1_RESPONSE": [[0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q23:24:1_RESPONSE": [[0, 1, 2, 3]], "qti_item_Q24:25:1_RESPONSE": [[0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q25:26:1_RESPONSE": [[0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q26:27:1_RESPONSE": [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q27:28:1_RESPONSE": [[0, 1, 2, 3]], "qti_item_Q28:29:1_RESPONSE": [[0, 1, 2, 3]], "qti_item_Q29:30:1_RESPONSE": [[1, 3], [2, 3], [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q30:31:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]] };
    var c_4e9f50e2756a4bf5ad1ca9696672681a = { "qti_item_Q1:2:1_RESPONSE": [[0], [1]], "qti_item_Q2:3:1_RESPONSE": [[0], [1]], "qti_item_Q3:4:1_RESPONSE": [[1]], "qti_item_Q4:5:1_RESPONSE": [[1]], "qti_item_Q5:6:1_RESPONSE": [[0], [1]], "qti_item_Q6:7:1_RESPONSE": [[0], [1]], "qti_item_Q7:8:1_RESPONSE": [[1]], "qti_item_Q8:9:1_RESPONSE": [[1]], "qti_item_Q9:10:1_RESPONSE": [[1]], "qti_item_Q10:11:1_RESPONSE": [[0], [1]], "qti_item_Q11:12:1_RESPONSE": [[1], [2], [3]], "qti_item_Q12:13:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q13:14:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q14:15:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q15:16:1_RESPONSE": [[2], [3]], "qti_item_Q16:17:1_RESPONSE": [[1], [2], [3]], "qti_item_Q17:18:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q18:19:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q19:20:1_RESPONSE": [[0], [1], [2], [3]], "qti_item_Q20:21:1_RESPONSE": [[1], [2], [3]], "qti_item_Q21:22:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q22:23:1_RESPONSE": [[0, 1, 2, 3]], "qti_item_Q23:24:1_RESPONSE": [[1, 2, 3], [0, 1, 2, 3]], "qti_item_Q24:25:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q25:26:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q26:27:1_RESPONSE": [[0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q27:28:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q28:29:1_RESPONSE": [[0, 1, 2, 3]], "qti_item_Q29:30:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]], "qti_item_Q30:31:1_RESPONSE": [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3], [0, 1, 2, 3]] };
    var answer_dict = { "c_4e9f50e2756a4bf5ad1ca9696672681a": c_4e9f50e2756a4bf5ad1ca9696672681a, "c_f03e978ceb05464095427119fd8c9ada": c_f03e978ceb05464095427119fd8c9ada }
    setInterval(() => {
        if (typeof (isComplete) == "boolean") {
if(isComplete==false){
            player.videoPlay();
            player.volume = 0;
            $('input[id^=time]').remove();}
else{
 console.log("下一个");
            goNext();
}
        } 
        if (typeof (isComplete) == "undefined") {
            alert("开始考核");
            var paper_name = location.pathname.split("course/")[1];
            var answer = answer_dict[paper_name];
            $.each(answer, function (name, chooses) {
                name = name.replace("item", "response");
                var input_tags = $("input[name=\"" + name + "\"]");
                $.each(chooses[0], function () {
                    input_tags.eq(this).attr("checked", "checked");
                    input_tags.eq(this).parent().addClass("on");
                });
            });
            finishTest();
            window.location = "/" + paper_name + "/study/course/progess"
        }
    }, 3e3);
})();