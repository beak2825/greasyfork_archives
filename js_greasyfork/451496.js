// ==UserScript==
// @name         武汉专业技术2022-2024年自动答题
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  autoanswer
// @author       Hui
// @match        http://zyjs.21train.cn/my/Default.aspx
// @match        http://zyjs.21train.cn/exam/paper_test.aspx?*
// @match        http://zyjs.21train.cn/exam/exam_result.aspx?historyid=*
// @match        http://zyjs.21train.cn/exam/exam_test.aspx?exam_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21train.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451496/%E6%AD%A6%E6%B1%89%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF2022-2024%E5%B9%B4%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451496/%E6%AD%A6%E6%B1%89%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF2022-2024%E5%B9%B4%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //检查网页
    let href=location.href;
    var check_href=setInterval(function(){
        if(href.includes("my/Default.aspx")){click_text();clearInterval(check_href)}//自动点击答题
        if(href.includes("exam_test.aspx?exam_id=")){agree_text();clearInterval(check_href)}//自动同意答题协议
        if(href.includes("exam/paper_test.aspx?")){start_text();clearInterval(check_href)}//开始答题
        if(href.includes("exam_result.aspx?historyid")){end_text();clearInterval(check_href)}//结束答题
    },2000)
    //自动点击答题
    function click_text(){
        var class_open_ok=false;
        var checkopen=setInterval(function(){if(class_open_ok){window.open('', '_self', '');window.close();}},2000)
        var text=setInterval(function(){
            var class_text=document.querySelector('#ctl13_rptCourseList_ctl00_examlink')
            if(class_text){
                for(var i=0;i<9;i++){
                    class_text=document.querySelector('#ctl13_rptCourseList_ctl0'+i+'_examlink')
                    if(class_text.innerText=="参加"){
                        class_open_ok=true;
                        var class_text_ok=document.querySelector('#ctl13_rptCourseList_ctl0'+i+'_examlink')
                        class_text_ok.click();
                        clearInterval(text)
                        break
                    }
                }

            }
        },2000)
        }
    //自动同意答题协议
    function agree_text(){
        var click_ok=document.getElementsByTagName("input")[3]
        if(click_ok){click_ok.click()}
        click_ok=document.getElementsByTagName("input")[5]
        if(click_ok){click_ok.click()}
    }

    //开始答题
    function start_text(){
        //——————————————————————————————————————2022-2023题目答案——————————————————————————————————————
        var data={
            "坚持人民至上：党百年奋斗的宝贵经验（上）": [
                "A","B","A","A","B","A","A","B","A","A","B","A","A","B","A","A","D","B","C","A","D","C","A","B","D","AB","ABCD","ABC","ABC","ABCD"
            ],
            "坚持人民至上：党百年奋斗的宝贵经验（下）": [
                "A","B","A","A","A","B","A","A","B","A","B","A","A","B","A","A","D","A","D","A","B","A","C","D","C","ABC","ABC","ABCD","ABCD","ABCD"
            ],
            "坚持自我革命——深刻认识党的百年奋斗历史经验（上）": [
                "A","A","B","A","A","A","B","A","A","A","B","A","A","B","A","C","A","B","D","C","A","C","D","D","A","ABC","ABCD","ABCD","BC","ABD"
            ],
            "坚持自我革命——深刻认识党的百年奋斗历史经验（下）": [
                "A","B","A","A","A","A","B","A","A","A","B","A","A","B","A","B","C","A","C","A","D","D","A","A","D","BC","ABCD","ACD","ABCD","ABC"
            ],
            "《中华人民共和国个人信息保护法》重点内容解读（上）": [
                "A","B","A","A","B","A","B","A","A","A","B","A","A","A","A","C","A","A","B","C","B","D","C","A","C","ABCD","AB","ABCD","ABCD","ABCD"
            ],
            "《中华人民共和国个人信息保护法》重点内容解读（下）": [
                "A","A","B","A","A","B","A","A","B","A","A","B","A","A","B","B","C","A","D","B","D","C","B","A","C","AB","ABCD","ABCD","ABCD","ABCD"
            ],
            "数据安全领域的基本法——《中华人民共和国数据安全法》解读（上）": [
                "A","A","B","A","A","B","A","A","B","A","A","B","A","A","A","C","A","B","D","B","D","A","D","C","D","ABCD","ABCD","ABCD","ABC","ABC"
            ],
            "数据安全领域的基本法——《中华人民共和国数据安全法》解读（下）": [
                "A","B","A","A","B","A","A","A","B","A","A","B","A","B","A","A","D","B","C","B","C","D","D","D","D","ACD","ABCD","ABCD","ABC","ABCD"
            ],
            "全面贯彻实施宪法（上）": [
                "A","A","B","A","A","B","A","A","B","A","B","A","A","B","A","A","D","B","D","C","A","D","C","A","A","ABCD","BC","ABC","ABCD","ABCD"
            ],
            "全面贯彻实施宪法（下）": [
                "A","A","B","A","A","B","A","A","A","B","B","A","B","A","A","B","A","D","C","C","D","A","B","D","C","BC","ABCD","ABCD","ABC","ABCD"
            ],
            //2023
            "高举中国特色社会主义伟大旗帜——学习贯彻党的二十大精神（上）": [
                "A","A","B","A","A","A","B","A","A","B","A","A","B","A","A","D","C","A","B","B","C","A","B","D","D","ABC","ABC","ABCD","AC","ABCD"
            ],
            "高举中国特色社会主义伟大旗帜——学习贯彻党的二十大精神（下）": [
                "A","B","A","A","B","A","A","B","A","A","B","A","A","B","A","B","A","D","D","B","C","D","B","D","C","ABC","ABCD","ABCD","ABCD","ABC"
            ],
            "学习贯彻党的二十大精神，自信自强推进中华民族伟大复兴（上）": [
                "A","A","B","A","A","B","A","A","B","A","A","B","A","A","A","A","B","D","C","A","B","D","A","B","C","ABCD","AB","ABCD","ABCD","ABCD"
            ],
            "学习贯彻党的二十大精神，自信自强推进中华民族伟大复兴（下）": [
               "A","A","B","A","A","B","A","A","B","A","A","A","B","A","A","B","A","D","C","A","B","B","D","A","A","ABCD","ABC","ABCD","ABCD","AB"
            ],
            "5G关键技术和网络安全（上）": [
               "B","A","A","B","A","B","A","A","B","A","A","A","A","B","A","C","A","B","C","B","A","D","A","B","C","ABCD","ABCD","ABCD","AB","ABCD"
            ],
            "5G关键技术和网络安全（下）": [
               "A","A","B","A","A","B","A","A","A","B","A","B","A","A","A","A","B","D","C","B","C","C","A","C","D","ACD","AB","ABCD","ABCD","ABCD"
            ],
            "强化保密教育 推动保密工作——《中华人民共和国保守国家秘密法》解读（一）": [
               "A","B","A","A","B","A","A","B","A","A","B","A","A","B","A","A","B","C","D","A","A","C","A","B","D","ABD","ABC","ABCD","BCD","ABCD"
            ],
            "强化保密教育 推动保密工作——《中华人民共和国保守国家秘密法》解读（二）": [
               "A","B","A","A","B","A","A","B","A","A","B","A","A","B","A","A","B","D","A","B","C","D","A","A","D","ABC","ABD","CD","ABCD","ABCD"
            ],
            "强化保密教育 推动保密工作——《中华人民共和国保守国家秘密法》解读（三）": [
               "A","B","A","A","B","A","A","B","A","A","B","A","A","B","A","A","C","B","B","B","C","D","A","D","A","ABC","ABCD","AB","ABC","CD"
            ],
            "强化保密教育 推动保密工作——《中华人民共和国保守国家秘密法》解读（四）": [
               "A","A","B","A","A","B","A","B","A","A","B","A","B","B","B","D","A","A","A","C","A","B","B","C","D","ABCD","AB","ABC","ABD","ABCD"
            ],
            "知识产权运营与管理": [
               "A","A","A","A","B","A","A","A","A","A","B","A","A","A","B","B","C","B","B","C","C","A","C","A","B","ABCD","ABCD","ABCD","ABCD","ABC"
            ],
            "新时代严格保护知识产权": [
               "A","A","A","B","A","A","A","A","A","A","A","A","B","B","A","D","B","C","C","A","A","D","B","B","D","CD","ABCD","ABCD","ABCD","AB"
            ],
            "区块链技术的应用前景与机遇": [
               "B","A","B","A","B","A","A","B","A","A","B","A","A","B","A","B","D","C","A","C","C","A","B","B","A","ABCD","ABCD","ABCD","ABC","ABCD"
            ],
            "《习近平新时代中国特色社会主义思想专题摘编》导读（上）": [
               "A","B","A","A","B","A","A","B","A","B","A","A","B","A","A","D","C","A","B","A","D","C","B","B","C","BD","ABCD","ABCD","ABCD","BCD"
            ],
            "《习近平新时代中国特色社会主义思想专题摘编》导读（下）": [
               "A","B","A","A","B","A","A","B","A","A","B","A","A","B","A","D","A","B","C","A","D","A","B","A","A","ABCD","ABCD","AD","AB","ABCD"
            ],
            "(必修)以中国式现代化全面推进中华民族伟大复兴（上）": [
               "A","A","A","A","B","A","A","A","A","A","B","B","A","A","A","B","D","A","A","D","C","D","A","B","A","ABC","ABCD","ACD","ABC","ABC"
            ],
            "以中国式现代化全面推进中华民族伟大复兴（中）": [
               "A","A","B","A","A","A","A","A","A","A","A","A","A","A","A","D","A","B","B","A","C","B","C","A","A","ABC","BCD","ACD","ABCD","ABCD"
            ],
            "以中国式现代化全面推进中华民族伟大复兴（下）": [
               "A","A","A","A","A","A","A","A","B","A","A","A","A","B","A","B","A","C","D","C","A","C","A","C","A","ABC","BCD","ABCD","ABCD","ABC"
            ]
        }
        //—————————————————————————————————————————————————————————————————————————————————————

        var class_name=document.querySelector("#tdnavgite > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)").innerText
        var answer=data[class_name]
        var map = {'A':1,'B':2,'C':3,'D':4};
        $('.ttr').each(function(index, queEle){
            answer[index].split('').forEach(ol =>{
                $(queEle).find('input')[map[ol]].click();
            })
        })
        var sub_ok=setInterval(function(){
            if(document.querySelector("#lblReTime").innerText.split("分")[0]<50){
                document.getElementById("form1").submit();
                clearInterval(sub_ok);
            }},5000)}
    function end_text(){location.href="http://zyjs.21train.cn/my/Default.aspx"}
    // Your code here...
})();