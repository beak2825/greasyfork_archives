// ==UserScript==
// @name         学习通题目共享
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://mooc1.chaoxing.com/exam-ans/mooc2/*
// @match        https://mooc1.chaoxing.com/mooc2/work/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454569/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%A2%98%E7%9B%AE%E5%85%B1%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/454569/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%A2%98%E7%9B%AE%E5%85%B1%E4%BA%AB.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var userCode = '781031'
    var host_port = 'http://101.43.206.250:8888'

    setTimeout(function(){
        var questionList1 = document.getElementsByClassName('stem_answer')
        var GapList = document.getElementsByClassName('Answer sub_que_div')
        //获得选项类题目的每一个题号

        for(let i = 0; i < questionList1.length; i++)
        {
            //获得选项类题目的每一个题号
            var ID_div = questionList1[i].getElementsByTagName('div')


            // 遍历该题目下的所有选项
            let answer_list2 = questionList1[i].getElementsByClassName('clearfix answerBg')
            for(let j = 0; j < answer_list2.length; j++)
            {
                let answer_div = answer_list2[j].getElementsByClassName('fl answer_p')

                let para = document.createElement("p"); //创建新的<p> 元素
                let node = document.createTextNode("选择人: "); //创建文本节点
                para.appendChild(node); //向 <p> 元素追加这个文本节点
                para.setAttribute("class", "texttext")
                answer_div[0].appendChild(para)
            }
        }

        for(let j = 0; j < GapList.length; j++)
        {
            let para = document.createElement("p"); //创建新的<p> 元素
            let node = document.createTextNode("选择人: "); //创建文本节点
            para.appendChild(node); //向 <p> 元素追加这个文本节点
            para.setAttribute("class", "texttext")
            GapList[j].appendChild(para)
        }

    }, 1000)


    setInterval(function(){

        //begin
        var questionList = document.getElementsByClassName('stem_answer')
        //按键选择题
        for(let i = 0; i < questionList.length; i++)
        {
            //获得选项类题目的每一个题号
            var ID_div = questionList[i].getElementsByClassName('clearfix answerBg')
            if(ID_div.length > 0)
            {
                var ID_span = ID_div[0].getElementsByTagName('span')
                var ID = ID_span[0].getAttribute('qid')
                //如果用户选项非空的话，发送request
                if(ID != null)
                {
                    let answer_to_push = document.getElementById('answer' + ID)
                    //alert('answer' + ID)
                    let Val = answer_to_push.getAttribute('value')

                    if (Val != "")
                    {
                        let xhr = new XMLHttpRequest();
                        //设置请求方法
                        let send = host_port + '/push/' + userCode + '/'+ID+'/'+Val+'/'+1
                        xhr.open('GET',send)
                        // 发送数据
                        xhr.send(null)
                    }


                    //获得现有的题目信息，显示到题目当中
                    let xhr = new XMLHttpRequest();
                    //设置请求方法
                    let send = host_port + '/display/' + userCode + '/' +ID
                    //alert(ID + send)
                    xhr.open('GET',send)
                    // 发送数据
                    xhr.send(null)
                    // 拿到服务端数据后执行相关操作
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState==4){
                            let A = xhr.responseText
                            let data_json = JSON.parse(A)


                            // 遍历该题目下的所有选项
                            let answer_list = questionList[i].getElementsByClassName('clearfix answerBg')
                            for(let j = 0; j < answer_list.length; j++)
                            {
                                let answer_div = answer_list[j].getElementsByClassName('fl answer_p')
                                let span = answer_list[j].getElementsByTagName('span')
                                let data_span = span[0].getAttribute('data')

                                let names = data_json[data_span]
                                let split_number = data_json.split_number

                                let p = answer_div[0].getElementsByClassName('texttext')
                                let title = "  题号: " + split_number
                                if (typeof(names) != 'undefined')
                                {
                                    p[0].innerHTML = title + "  答案: " + names
                                }
                                else
                                {
                                    p[0].innerHTML = title + "  答案: "
                                }
                            }

                        }
                    }
                }
            }
        }

    }, 2000)


    setInterval(function(){
        //begin
        var GapList = document.getElementsByClassName('Answer sub_que_div')
        //填空题
        for(let k = 0; k < GapList.length; k++)
        {
            let ID = GapList[k].getAttribute('dataid')
            //alert('answerEditor'+ID)
            let Answer = document.getElementById('answerEditor'+ID)
            let words = Answer.value
            words = words.replace(/<.*?>/ig,"");
            if(words != "")
            {
                let xhr1 = new XMLHttpRequest();
                //设置请求方法
                let send1 = host_port + '/push/' + userCode + '/'+ID+'/'+words+'/'+2
                xhr1.open('GET',send1)
                // 发送数据
                xhr1.send(null)
            }

            //获得现有的题目信息，显示到题目当中
            let xhr = new XMLHttpRequest();
            //设置请求方法
            let send = host_port + '/display/'+ userCode + '/' + ID
            xhr.open('GET',send)
            // 发送数据
            xhr.send(null)
            // 拿到服务端数据后执行相关操作
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4){
                    let A = xhr.responseText
                    let data_json = JSON.parse(A)
                    let split_number = data_json.split_number
                    let title = "  题号: " + split_number

                    let str = "答案: "
                    for (var val in data_json) {
                        if (val != "split_number")
                        {
                            str += val + ": " + data_json[val] + "   "
                        }
                    }

                    //遍历该题目下的所有选项
                    let P = GapList[k].getElementsByClassName('texttext')

                    P[0].innerHTML = title + "   " + str
                }
            }
        }

    }, 2000)
    // Your code here...
})();