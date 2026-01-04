// ==UserScript==
// @name         继续教育自动答题
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  进入考试页面后自动答题，每秒答一次
// @author       moxiaoying
// @match        http*://cqrl.21tb.com/ems/html/examCenter/fullExamTemp.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427972/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/427972/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const answer_dict = {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3,
        'E': 4,
        'F': 5,
        'G': 6
    }
    const parser = new DOMParser();
    function parseAnswer(t) {
        let htmlDoc = parser.parseFromString(t, "text/html")
        let answer_area = htmlDoc.getElementsByClassName('span_1_of_b')
        let a = answer_area[0].children[1].innerHTML.match(/[a-g].*?</ig)
        let answer_list = answer_area[0].getElementsByClassName('ture-answer')[0].innerText.match(/[a-g]/gi)
        return answer_list      
    }

    function sleep(times) {
        return new Promise(resolve=>{
            setTimeout(()=>resolve(), times * 1000)
        }
                          )
    }
    function getHtml(title) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("csrfmiddlewaretoken", "qJTdZ0lxtz29XBG04b9VZaM9jsOhhXbf0FItG0wlAhBsQrAqfJwbnchW4CyMRYr3");
        urlencoded.append("QuestionTitle", title);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        return fetch("https://gongxukemu.cn/search.html", requestOptions).then(response=>response.text())
    }
    async function getAnswer(title) {
        let t = await getHtml(title)
        ,answer_list = parseAnswer(t)
        console.log(answer_list)
        return answer_list
    }
    async function submit() {
        const singles = document.getElementsByClassName('question-panel-middle')
        // const singles = document.getElementsByClassName('MULTIPLE')
        for (let item of singles) {
            let title = item.getElementsByClassName('question-stem')[0].innerText
            , options = item.getElementsByClassName('form-cell')
            ,answer_list = await getAnswer(title)
            if (options.length<answer_list.length){
                continue;
                console.log('答案长度不匹配');
            }
            for (let answer of answer_list) {
                try{
                    options[answer_dict[answer]].children[0].click()

                }catch(e){
                    console.log(e)
                }
            }
            await sleep(1)
        }
    }
    submit()
})();