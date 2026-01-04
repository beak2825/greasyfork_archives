// ==UserScript==
// @name         XJTU安全教育考试助手
// @namespace    http://10.184.203.130/xjtu_ksxt/Home/Examination
// @version      1.0
// @description  XJTU安全教育做题脚本!
// @author       MRT
// @match        http://10.184.203.130/xjtu_ksxt/Home/Examination/startExam.html?examination_no*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475344/XJTU%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475344/XJTU%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(async function () {
    'use strict';
    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function GETMethod(url){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url:url,
                method :"GET",
                onload:function(xhr){
                    resolve(xhr.responseText)
                }
            });
        })
    }
    async function my_get(url){
        let text=await GETMethod(url)
     }

    await sleep(2000);
    alert("脚本开始执行，大概需要3-5分钟，请耐心等待");
    // 在这里执行你的操作
    document.onselectstart = new Function("event.returnValue=true;");
    // 禁止右键
    document.oncontextmenu = new Function("event.returnValue=true;");
    // 使用document.querySelectorAll()获取所有匹配的元素
    var body_div = document.querySelector('.p-ques-list');
    var type = body_div.children;
    var q = "";
    for(var i = 0; i < type.length; i++){
        if (type[i].children == undefined) {
            continue;
        }
        var l1 = type[i].children;
        for(var j = 0; j < l1.length; j++){
            var l2 = l1[j].children;
            for(var k = 0; k < l2.length; k++){
                // 等待3秒后执行操作
                await sleep(1000);
                // 在这里执行你的操作
                var l3 = l2[k].children;
                if (l3.length < 1) {
                    continue;
                }
                q = l3[0].innerText;
                q = q.slice(4,-6);
                if (q.trim().length < 4) {
                    continue;
                }
                var url = "http://10.184.203.130/xjtu_ksxt/Center/Question/questionList.html"
                // 构建GET请求参数
                var params = {
                    'draw': '4',
                    'start': '0',
                    'length': '10',
                    'limit': '10',
                    'base_knowledge': '',
                    'seaKey': q,
                    'professional_level_id': '',
                    'question_type_id': '',
                    'college_id': '',
                    '_': '1694683503197'
                }
                var res = await GETMethod(url + '?' + new URLSearchParams(params))
                var jsonResponse = JSON.parse(res);
                var qn = jsonResponse.data.list[0].question_no;
                url = "http://10.184.203.130/xjtu_ksxt/Center/Question/getQuestionDetail.html"
                params = {
                    'question_no': qn
                }
                res = await GETMethod(url + '?' + new URLSearchParams(params))
                var ans = JSON.parse(res).data.answer;
                console.log("正确答案"+ans);
                l3[0].innerText+= "         正确答案"+ans;
                if(ans == "正确"){
                    ans = "A";
                }else if(ans == "错误"){
                    ans = "B";
                }
                var sel = ans.charCodeAt(0)-65;
                if ( i == 0){
                    var selection = l3[2].children[0].children[sel].children[1]
                }else if(i == 2) {
                    var selection = l2[1].children[0].children[sel].children[1]
                }
                selection.click();
            }
        }
    }
    alert("答题结束");
})();