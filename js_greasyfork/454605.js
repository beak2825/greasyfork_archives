// Sunac OA Exam Helper Script
// --------------------------------------------------------------------
// ==UserScript==
// @name        Sunac OA Exam Helper Script
// @author      zdian
// @license     MIT
// @namespace   http://elv.sunac.com.cn/
// @version     1.6
// @description 融创OA融E学考试增强，内部使用。
// @match       http://elv.sunac.com.cn/exam2/*
// @match       http://elv.sunac.com.cn/smartweb/mystudy.aspx
// @connect     10.98.79.19
// @grant       GM_xmlhttpRequest
// @icon        http://10.98.79.19/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/454605/Sunac%20OA%20Exam%20Helper%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/454605/Sunac%20OA%20Exam%20Helper%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        let examstatus_url = "/exam2/examstatus.aspx";
        let examtj_url = "/exam2/examtj.aspx";
        let showexaminfo_url = "/exam2/showexaminfo.aspx";
        let mtks_url = "/exam2/mtks.aspx";
        let ks_pd_url = "/exam2/ks_pd.aspx";
        let mystudy_url = "/smartweb/mystudy.aspx";
        let url = location.pathname;
        console.log(url);
        if(url.indexOf(examstatus_url) != -1) {
            console.log("考试排行榜");
            fix_timer();
        }else if(url.indexOf(examtj_url) != -1) {
            console.log("答卷情况统计");
        }else if(url.indexOf(ks_pd_url) != -1) {
            console.log("考试结果提交");
        }else if(url.indexOf(showexaminfo_url) != -1) {
            console.log("考试情况查询");
            make_div();
            checker("showexaminfo");
        }else if(url.indexOf(mystudy_url) != -1) {
            console.log("我的学习");
            add_link();
        }else if(url.indexOf(mtks_url) != -1) {
            console.log("考试");
            make_div();
            checker("real_exam");
            free_copy();
        }else{
            console.log("其他页面都按考试算");
            make_div();
            checker("real_exam");
            free_copy();
        }
    }, false); // true在捕获阶段触发,false代表在冒泡阶段触发。先捕获再冒泡

    function add_link()
    {   
        let myExam_div = document.evaluate('//div[@onclick="Open(2)"]', document).iterateNext();
        myExam_div.addEventListener('click',() => {
            // console.log("myExam_div");
            document.evaluate('//div[@id="myexam"]', document).iterateNext().setAttribute('style', "display: block;");
            let links = document.evaluate('//ul[@id="myExam"]/li/div[@class="fr"]/p', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (links.snapshotLength > 0){
                let mystudy_objects = get_sjid();
                // console.log(mystudy_objects)
                for (let i = 0; i < links.snapshotLength; i++) {
                    let link = links.snapshotItem(i);
                    let flag_ckdj = 0
                    let flag_ckpm = 0
                    let recid = mystudy_objects[i]['recid']
                    let sjid = mystudy_objects[i]['sjid']
                    let sjmc = mystudy_objects[i]['sjmc']
                    for (let l_child of link.children) {
                        if(l_child.innerText==="查看答卷>>"){
                            flag_ckdj = 1
                        }else if(l_child.innerText==="查看排名>>"){
                            // recid = l_child.children[0].href.match(/^.*recid=(.*)$/)[1];
                            // console.log(recid)
                            flag_ckpm = 1
                        }
                    }
                    if (flag_ckdj === 0){
                        let add_span = document.createElement('span')
                        add_span.innerHTML = '<a target="_blank" href=/exam2/showexaminfo.aspx?recid='+recid+'>查看答卷&gt;&gt;</a>'
                        link.prepend(add_span)
                    }
                    if (flag_ckpm === 0){
                        let add_span = document.createElement('span')
                        add_span.innerHTML = '<a target="_blank" href="/exam2/examstatus.aspx?recid='+recid+'&amp;sjmc='+sjmc+'&amp;sjid='+sjid+'">查看排名&gt;&gt;</a>'
                        link.prepend(add_span)
                    }
                }
            }
            // if (link.snapshotLength > 0){
            //     for (let i = 0; i < timer.snapshotLength; i++) {
            //         let t = timer.snapshotItem(i);
            //         console.log(t.children[0].tagName)
            //     }
            // }
        });
    }
    function fix_timer()
    {
        let time_xpath = "//tr[@align='center']"; //定位考试时间
        let timer = document.evaluate(time_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (timer.snapshotLength > 0){
            for (let i = 0; i < timer.snapshotLength; i++) {
                let t = timer.snapshotItem(i);
                let start_time = new Date(t.children[2].innerText.split("--")[0]).getTime()/1000;
                let end_time = new Date(t.children[2].innerText.split("--")[1]).getTime()/1000;
                t.children[3].innerText = parseInt((end_time - start_time)/60)+"分"+(end_time - start_time)%60+"秒";
            }
        }
    }

    function make_div(){
        let my_div = document.createElement("div");
        my_div.id = 'div_get_answer';
        my_div.setAttribute("align", "center");
        let b = document.getElementsByTagName('body')[0];
        b.prepend(my_div);
        let my_button = document.createElement("button");
        my_button.id = 'get_answer';
        my_button.textContent = "手动获取答案";
        my_button.setAttribute("style", "width: 260px; height: 26px;");
        my_button.onclick = function (){
            checker();
            return;
        };
        let d = document.getElementById('div_get_answer');
        d.append(my_button); //添加一个手动获取按钮，以免页面动态加载导致无法自动获取答案。
    }
    function checker(page_type)
    {
        let question_xpath;
        if (page_type=="showexaminfo"){
            question_xpath = "//span[not(@style) and @class='ex2' and not(./a)]"; // 定位考试情况中的题目
        }else{
            question_xpath = "//li[@class='question_title']"; // 定位题目li元素
        }
        let questions = document.evaluate(question_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (questions.snapshotLength > 0){
            for (let i = 0; i < questions.snapshotLength; i++) {
                let q = questions.snapshotItem(i);
                // console.log(q);
                let console_div = document.createElement("div");
                console_div.id = 'console-div' + i;
                let current_question = q.innerText; //题目文本为：题目元素的innerText
                console.log(current_question);
                console_div.innerHTML = "<span style='color:red'>答案获取中...</span>";
                if(!document.getElementById('console-div' + i)){
                    q.append(console_div);
                };
                update_answer(i, current_question);
            }
        }else{
            console.log("未找到题目");
        }
    }
    function get_sjid() //获取sjid来查看排名
    {
        const request = new XMLHttpRequest();
        let url = "AjaxGet/HandlerGetStudy.ashx?action=GetExam&pageIndex=1&pageCategory=2&pagesize=12&_=" + new Date().getTime()
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);
        if (request.status === 200) {
            let r = JSON.parse(request.responseText);
            // console.log(r)
            return r;
        }
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function(){
        //     if( xhr.readyState == 4){
        //         if( xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
        //             let r = JSON.parse(xhr.responseText)
        //             console.log(r)
        //             return r;
        //         }
        //     }
        // };
        // // 每次需要发请求需要做两步：
        // let url = "AjaxGet/HandlerGetStudy.ashx?action=GetExam&pageIndex=1&pageCategory=2&pagesize=12&_=" + new Date().getTime()
        // xhr.open("get", url, false);
        // xhr.send(null);
    }
    function update_answer(index, question)
    {
        var ans = "获取答案中";
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://10.98.79.19/sunac_exam", //题库请求地址
            data: "operation=get_exam_answer&question=" + question,
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response){
                // console.log("请求成功");
                ans = response.responseText;
                document.getElementById('console-div'+ index).getElementsByTagName('span')[0].innerText = ans;
                console.log(ans);
            },
             onerror: function(response){
              console.log("请求失败");
              document.getElementById('console-div'+ index).getElementsByTagName('span')[0].innerText = "请求失败";
            }
          });
    }
    function free_copy(){
        // document.body.setAttribute("contenteditable",!0);
        var t=function(t){
            t.stopPropagation();
            t.stopImmediatePropagation&&t.stopImmediatePropagation();
        };
        ["copy","cut","contextmenu","selectstart","mousedown","mouseup","keydown","keypress","keyup"].forEach(function(e){
            document.documentElement.addEventListener(e,t,{capture:!0})
        });
    };
})();

// Update log
// v1.6 2022/11/18 我的学习-我的考试，添加查看答卷 查看排名
// v1.5 2022/11/18 更新页面匹配，优化耗时显示
// v1.4 2022/11/17 修正考试排行榜-耗时，优化代码逻辑
// v1.3 2022/11/17 更新在考试情况显示答案
// v1.2 2022/11/17 更新提示
// v1.1 2022/11/17 更新定位
// v1.0 2022/11/16 初始版本
// http://elv.sunac.com.cn/smartweb/AjaxGet/HandlerGetStudy.ashx?action=GetExam&pageIndex=1&pageCategory=2&pagesize=12&_=1668754044875