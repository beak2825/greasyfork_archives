// ==UserScript==
// @name         郑大网络教育计算机系自动答题
// @namespace    好好学习天天向上
// @version      0.2
// @author       Wzzq
// @match        http://ols.v.zzu.edu.cn/*
// @description 郑大网络教育
// @icon         https://gitee.com/yjgame-mark/tampermonkey/raw/master/autoPlayByZhengDa/log.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        unsafeWindow
// @connect      119.29.15.252
// @grant        GM_xmlhttpRequest
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/441856/%E9%83%91%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/441856/%E9%83%91%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const xhrOpen = XMLHttpRequest.prototype.open;
    const xhrSend = XMLHttpRequest.prototype.send;
    let res = [];
    let edu = [];
    const HttpUrl = ["http://ols.v.zzu.edu.cn/s/appCourseSubject/queryChaptersTest", "http://ols.v.zzu.edu.cn/s/appCourseSubject/checkUserSubjectAnswer2", "http://ols.v.zzu.edu.cn/s/appCourseSubject/queryCurErrorSubject"]

    $(() => {
        findNoQuestion()
        setInterval(()=>{
            location.reload()
        },3*60000)
        window.addEventListener('popstate', function (event) {
            let href = window.location.href;
            if (href.indexOf('/index/testsu') == -1 &&document.getElementById('answerMask')) {
                let answerMask = document.getElementById('answerMask');
                let body = document.getElementsByTagName('body')[0];
                body.removeChild(answerMask);
            }
        });
    })

    function findNoQuestion() {
        window.location.href = "#/index/testdire"
        let init = setInterval(() => {
            let noQuestionArr = []
            let subject = $(".ant-collapse-item.testdire_cuon__3LUPV")
            let i = 0
            if (subject.length > 0) {
                clearInterval(init)
                for (const subjectElement of subject) {
                    // 展开所有课程的答题
                    $(subjectElement).find('i').click()
                    i++
                    if (i == subject.length) {
                        // 获取所有试题
                        let question = $(".testdire_list__1ldxL")

                        for (const questionElement of question) {
                            if ($(questionElement).find(".testdire_score__1ITpq")[0].innerText = '' || $(questionElement).find(".testdire_score__1ITpq")[0].innerText != '得分100/100分') {
                                noQuestionArr.push($(questionElement).find("button"))
                            }

                        }
                    }

                }
                if (noQuestionArr.length == 0) {
                    return
                }
                setTimeout(() => {
                    console.log("延迟2s");
                }, 2000)

                for (const subjectElement of noQuestionArr) {
                    $(subjectElement).click();
                    let quertionInfo = setInterval(() => {
                        // 开始按钮
                        let startButton = $(".testmess_main__15rlg a")
                        if (startButton.length > 0) {
                            clearInterval(quertionInfo)
                            window.location.href = $(startButton)[0].href;
                            // 开始答题
                            startAnswer();

                        }
                    }, 500)

                }
            }

        }, 500)
    }

    function startAnswer() {
        XMLHttpRequest.prototype.open = function () {
            const xhr = this;
            if (HttpUrl.findIndex(item => item === arguments[1]) !== -1) {
                edu[arguments[1]] = {}
                const url = arguments[1]
                if (
                    arguments[1] ===
                    'http://ols.v.zzu.edu.cn/s/appCourseSubject/checkUserSubjectAnswer2'
                ) {
                    Object.defineProperty(xhr, 'send', {
                        value() {
                            edu[url].send = arguments[0]
                            return xhrSend.apply(xhr, arguments);
                        }
                    });
                }
                const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response').get;
                Object.defineProperty(xhr, 'responseText', {
                    get() {
                        let result = getter.call(xhr);
                        edu[url].data = JSON.parse(result).data
                        api(url, edu[url].data, edu[url].send || "")
                        return result;
                    }
                });
            }
            return xhrOpen.apply(xhr, arguments);
        };
    }

    function api(url, data, send) {
        if (
            url ===
            'http://ols.v.zzu.edu.cn/s/appCourseSubject/queryChaptersTest'
        ) {
            res = data[0].list;
            getAnwer(res);
        } else if (
            url ===
            'http://ols.v.zzu.edu.cn/s/appCourseSubject/checkUserSubjectAnswer2'
        ) {
            let checkResult = data[0].result;
            let checkSend = send
                .split('&')[0]
                .split('=')[1]
                .split('~~');
            for (let i = 0; i < checkResult.length; i++) {
                let item = checkResult[i];
                if (item === '对') {
                    let answerIndex = checkSend[i].split('~');
                    if (res[i].answer.length === answerIndex.length) {
                        continue;
                    }
                    res[i].answer = [];
                    answerIndex.forEach((item) => {
                        res[i].answer.push(res[i].options[Number(item)]);
                    });
                    update(res[i]);
                }
            }
            if (checkResult.find(text => text === "错")) {
                goErrorQutions()
            }
        } else if (
            url ===
            'http://ols.v.zzu.edu.cn/s/appCourseSubject/queryCurErrorSubject'
        ) {
            let arr = data;
            arr.forEach((item) => {
                item.answer = item.answerList;
                update(item);
            });
        }
    }


    function getAnwer(data) {
        GM_xmlhttpRequest({
            url: 'http://119.29.15.252/service/question/getAll',
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            data: JSON.stringify(data),
            onload: (r) => {
                let arr = JSON.parse(r.response).data;
                res.forEach((item) => {
                    for (const value of arr) {
                        if (item.content === value.content) {
                            item.answer = value.answer || [];
                            break;
                        }
                    }
                });
                const node = document.querySelectorAll(".testsub_notCon__2dYQU .ant-btn")
                selectOptions(res, node)
                appendHtml(arr);
            },
        });
    }

    function update(data) {
        GM_xmlhttpRequest({
            url: 'http://119.29.15.252/service/question/update',
            headers: {'Content-Type': 'application/json'},
            method: 'PUT',
            data: JSON.stringify(data),
            onload: (r) => {

            },
        });
    }

    function goErrorQutions() {
        setTimeout(() => {
            document.querySelector(".testsub_main1__1LipC section a").click();
        }, 4000)

    }

    function selectOptions(data, btn) {
        const num = document.querySelector(".testsub_notCon__2dYQU .testsub_page__1NVs_ span").innerText;

        const node = document.querySelector(".testsub_notCon__2dYQU .testsub_con__2XFa0 section>div").children
        if (data[num - 1].answer.length) {
            data[num - 1].answer.forEach(item => {
                for (let i = 0; i < node.length; i++) {
                    const val = node[i]
                    if (val.innerText.indexOf(item.trim()) !== -1) {
                        val.children[0].click()
                    }
                }

            })
        } else {
            node[0].children[0].click()//没有答案默认选择第一个
        }
        if (num * 1 < 10) {
            setTimeout(() => {
                btn[1].click()
                selectOptions(data, btn)
            }, 4500)
        } else if (num * 1 === 10) {
            setTimeout(() => {
                btn[2].click()
            }, 2 * 60 * 1000 - 4000 * 9)

        }

    }

    function appendHtml(data) {
        let str = '';
        let answerMask = document.getElementById('answerMask');
        let body = document.getElementsByTagName('body')[0];
        if (answerMask) body.removeChild(answerMask);
        data.forEach((item, index) => {
            let answer = '';
            item.answer != null
                ? item.answer.forEach((item) => (answer += item + '<br/><br/>'))
                : (answer = '暂未答案');
            //     position: fixed;top: 0;right: 0; zoom: 1;z-index: 555;
            str += `<tr>
    <td style="border: 1px solid; text-align: center;">${index + 1}</td>
    <td style="border: 1px solid;" title="">${item.content}</td>
    <td style="border: 1px solid;" title="">${answer}</td>
  </tr>`;
        });
        const begin = `<div id='answerMask1' style="zoom: 1;z-index: 555;">

  <div
    style="border: 2px dashed rgb(255 ,fdsdf130 ,71); position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(135,206,250, 0.6); overflow-x: auto;display:none;">
    ◻</div>
  <div
    style="border: 2px dashed rgb(255, 130, 71); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(135,206,250, 1); overflow-x: auto;">
    <span style="font-size: medium;"></span>
<button flag=true id="answerClose">折叠面板</button><br><div style="max-height: 300px; overflow-y: auto;">
      <table border="1" style="font-size: 12px; border: 1px solid;">
        <thead  >
          <tr>
            <th style="width: 25px; min-width: 25px; border: 1px solid;">题号</th>
            <th style="width: 60%; min-width: 130px; border: 1px solid;">题目</th>
            <th style="min-width: 130px; border: 1px solid;">答案</th>
          </tr>
        </thead>
        <tfoot id="tfoot" style="display: none;">
          <tr>
            <th colspan="3" style="border: 1px solid;">答案提示框 已折叠</th>
          </tr>
        </tfoot>
        <tbody id="tbody">`,
            end = ` </tbody>
        </table>
      </div>
    </div>

  </div>`;

        var tag = document.createElement('div');
        tag.setAttribute('id', 'answerMask'); //setAttribute 插入属性
        tag.innerHTML = begin + str + end;
        body.appendChild(tag);
        let btn = document.getElementById('answerClose');
        btn.addEventListener('click', function (e) {
            let tfoot = document.getElementById('tfoot');
            let tbody = document.getElementById('tbody');
            if (this.getAttribute('flag') == 'true') {
                this.setAttribute('flag', 'false');
                tfoot.style.display = '';
                tbody.style.display = 'none';
            } else {
                this.setAttribute('flag', 'true');
                tfoot.style.display = 'none';
                tbody.style.display = '';
            }
        });
    }



})();