    // ==UserScript==
    // @name         宜宾学院智慧校园
    // @namespace    此智慧校园新增一键选中答案选项，页面简单使用方便，稳定版，些许bug还望能够反馈。作者联系方式： qq： 2644808362 。
    // @version      3.0
    // @description  新增日志功能，实现去jquery化，拥抱原生js，欢迎交流学习油猴脚本编写，关于前端的问题也可以向我提问。
    // @author       qyjbk
    // @match        https://mooc.yibinu.edu.cn/*
    // @run-at       document-end
    // @icon         https://q.qlogo.cn/g?b=qq&nk=2644808362&s=100
    // @grant        GM_xmlhttpRequest
    // @grant        GM_addStyle
    // @grant        GM_getResourceText
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462477/%E5%AE%9C%E5%AE%BE%E5%AD%A6%E9%99%A2%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/462477/%E5%AE%9C%E5%AE%BE%E5%AD%A6%E9%99%A2%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD.meta.js
    // ==/UserScript==
    const document = unsafeWindow.document;
    function writeLogs(msg) {
        const textNode = document.createElement("p")
        const firstChildNode = mybox.firstChild;
        textNode.innerText = msg
        mybox.insertBefore(textNode, firstChildNode)
        return true
    }
    function formatAnswer(obj) {
        writeLogs('解析程序执行中，请稍后')
        const result = [];
        let num = 1;
        obj.forEach((listItem) => {
            // 将题目存到resultObj中
            const resultObj = {
                question: num + '. ' + listItem.quiz.quizContent.replace(/&nbsp;/g, ''),
                options: new Map(),
                answers: [],
                answersId: [],
                quizId: listItem.quizId,
            };
            num += 1;
            // 判断题目是选择题还是判断题
            if (listItem.quiz.quizOptionses.length != 0) {
                // 将遍历出来的options添加到resultObj
                listItem.quiz.quizOptionses.forEach((optionItem, index) => {
                    resultObj.options.set(optionItem.optionId, (String.fromCharCode(65 + index) + "：" + optionItem.optionContent))
                })
                // 将遍历出来的answer添加到答案数组
                listItem.quiz.quizResponses.forEach(answerItem => {
                    resultObj.answers.push(resultObj.options.get(answerItem.optionId));
                    resultObj.answersId.push(answerItem.optionId)
                })
            } else {// 不存在选项，也就是填空题/
                listItem.quiz.quizResponses.forEach(answerItem => {
                    resultObj.answers.push(answerItem.responseContent);
                })
            }
            result.push(resultObj);
        })
        writeLogs('解析成功')
        document.finallyresult = result;
        console.log(result);
        return mountAnswer(result);
    }
    function mountAnswer(result) {
        const container = document.getElementById('insertAnchor');
        const answerBox = document.createElement('table');
        answerBox.classList.add('qyjbk_gridtable')
        const strHead = `<tr>
    <th>题目</th><th>选项</th><th>答案</th>
</tr>`
        let strbody = '';
        result.forEach(resultobj => {
            let options = '';
            let answer = '';
            if (resultobj.options.size != 0) {
                for (let i of resultobj.options.values()) {
                    options += i + ',<br/>';
                }
            }
            for (let i = 0, len = resultobj.answers.length; i < len; i++) {
                if (i > 0) answer += ',<br/>';
                answer += resultobj.answers[i];
            }
            strbody += '<tr><td>' + resultobj.question + '</td><td>' + options + '</td><td>' + answer + '</td></tr>';
        })
        answerBox.innerHTML = strHead + strbody;
        container.appendChild(answerBox);
        return;
    }
    function initview(str) {
        const div = document.createElement('div');

        div.innerHTML = str;
        document.body.appendChild(div)
        const style = document.createElement('style');
        style.innerHTML = `.qyjbk_popover{
            position: fixed;
            top: 20%;
            width: 18%;
            height: 70%;
            background-color: rgba(211,211,211,.8);
        }
        .qyjbk_notice{
            height: 20%;
            background-color: rgb(211,211,211);
            padding: 5px;
            color:black;
            overflow:scroll;
        }
        .qyjbk_button{
            height: 5%;
            box-size:border-box;
            display: flex;
            background-color: antiquewhite;
            justify-content:center;
            padding: 5px 0;
        }
        .qyjbk_button button{
          margin: 0px 8px;
        }
        .qyjbk_main{
            height: 70%;
            overflow: scroll;
        }
        table.qyjbk_gridtable {
            font-size:1em;
            width: 100%;
            color:#333333;
            border-width: 1px;
            border-color: #666666;
            border-collapse: collapse;
        }
        table.qyjbk_gridtable th {
            border-width: 1px;
            width: 33.3%;
            padding: 8px;
            border-style: solid;
            border-color: 666666;
            background-color: rgba(de,de,de,.8);
        }
        table.qyjbk_gridtable td {
            border-width: 1px;
            width: 33.3%;
            border-style: solid;
            border-color: #666666;
            background-color: rgba(ff,ff,ff,.8);
        }`
        document.head.appendChild(style)
    }

    document.qyjbk_debounce = function debounce(func) {
        func();
        writeLogs('由于网页设计问题，仅支持首次点击')
        writeLogs('请勿重复点击，以免答案选中失效')
        writeLogs('若无效请刷新网页重试，或者手动答题')
        document.automaticResponse = () => { console.log('请勿重复点击，以免答案选中失效') }
    }

    document.automaticResponse = function automaticResponse() {
        console.log(document.finallyresult)
        document.finallyresult.forEach((listItem) => {

            // 判断题目是选择题还是判断题
            if (listItem.options.size != 0) {
                // 将遍历出来的答案模拟点击选中
                for (let key of listItem.answersId) {
                    document.querySelector(`div[option_id = "${key}"] > span:nth-child(1) > a:nth-child(1)`).click()
                }
            } else {// 不存在选项，也就是填空题
                for (let i = 0, len = listItem.answers.length; i < len; i++) {
                    let num = i + 2;
                    document.querySelector(`#exam_paper_${listItem.quizId} > div:nth-child(3) > div:nth-child(${num}) > input:nth-child(1)`).value = listItem.answers[i];
                }
            }
        })
    }

    qyjbk_automaticResponse = function () {
        document.qyjbk_debounce(document.automaticResponse)
    }

    qyjbk_passVideo = function passVideo() {
        let video = document.getElementsByTagName("video");
        if (video.length == 0) {
            writeLogs("您当前页面不存在视频，请先打开学习视频页面");
        } else {
            document.getElementsByTagName("video")[0].currentTime = document.getElementsByTagName("video")[0].duration;
            writeLogs("视频已秒刷完成！");
        }
    }
    // 定义弹窗的html
    const strpopover = `<div class="box">
                    <div class="qyjbk_popover">
                        <div class="qyjbk_notice" id='qyjbkLog'></div>
                        <div class="qyjbk_button">
                            <button onclick="qyjbk_automaticResponse()">一键填写答案</button>
                            <button onclick="qyjbk_passVideo()">一键跳过视频</button>
                        </div>
                        <div class="qyjbk_main" id='insertAnchor'>
                        </div>
                    </div>
                    </div>`;
    // 将弹窗渲染到页面上去
    initview(strpopover);
    const mybox = document.getElementById("qyjbkLog");
    writeLogs('欢迎使用qyjbk辅助')
    writeLogs('与作者交流：2644808362')
    writeLogs('请勿用与牟利')
    writeLogs('仅供交流学习使用')

    // 从后台获取答案
    function getAnswer(url, data) {
        const id = url.match(/\/examSubmit\/(\d+)\/getExamPaper/)[1];
        const xhr = new XMLHttpRequest();
        xhr.open('post', url);
        xhr.setRequestHeader('Origin', location.origin);
        xhr.setRequestHeader('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.setRequestHeader('Referer', `https://mooc.yibinu.edu.cn/examTest/stuExamList/${id}.mooc`);
        xhr.send(data);
        xhr.onreadystatechange = function () {
            //处理前判断服务端是否返回所有结果和服务端的状态码是2**
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    writeLogs('获取答案成功，请等待解析')
                    console.log(JSON.parse(xhr.response))
                    const obj = JSON.parse(xhr.response).paper.paperStruct;
                    formatAnswer(obj);
                }
            }
        }
    }

    function initGetAnswer(settings) {
        var url = location.origin + settings.url;
        var data = settings.data.replace(/(testPaperId=).*?(&)/, '$1' + '3301' + '$2');
        console.log(data)
        getAnswer(url, data);
    }

    $(document).ready(function () {
        $(document).ajaxComplete(function (evt, request, settings) {
            if (settings.url.search('getExamPaper') != -1) {
                initGetAnswer(settings);
            }
        });
    })