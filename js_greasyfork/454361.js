// ==UserScript==
// @name        奥鹏学生空间只看视频，课件与答题自动跳过
// @namespace   http://tampermonkey.net/
// @match       https://yunao.open.com.cn/stuspace/
// @require     https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant       none
// @version     1.6
// @author      youngyy
// @license     MIT
// @description 2022/11/5 11:09:20
// @downloadURL https://update.greasyfork.org/scripts/454361/%E5%A5%A5%E9%B9%8F%E5%AD%A6%E7%94%9F%E7%A9%BA%E9%97%B4%E5%8F%AA%E7%9C%8B%E8%A7%86%E9%A2%91%EF%BC%8C%E8%AF%BE%E4%BB%B6%E4%B8%8E%E7%AD%94%E9%A2%98%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/454361/%E5%A5%A5%E9%B9%8F%E5%AD%A6%E7%94%9F%E7%A9%BA%E9%97%B4%E5%8F%AA%E7%9C%8B%E8%A7%86%E9%A2%91%EF%BC%8C%E8%AF%BE%E4%BB%B6%E4%B8%8E%E7%AD%94%E9%A2%98%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            oldSend.apply(this, arguments);
        }
    }
}

function selectCheck() {
    let html = '';
    // alert("开始获取答案中...")
    // 获取试卷历史作答信息
    let variable = getQueryVariable('homeworkId');
    let his = `https://yunao.open.com.cn/api/student/student-space-service/testExam/getAnswerList?examineId=${variable}`
    req(his, (res) => {
        if (res.code === '1') {
            if (res.content.length === 1) {
                alert("请提交试卷后再次答题，将会自动获取答题正确信息！")
                return
            }
            // 最新答题记录
            let element = res.content[res.content.length - 1];
            let answerId = element.answerId

            let xUrl = `https://yunao.open.com.cn/api/student/student-space-service/examineAnswer/getHistoryDetail?answerId=${answerId}`
            req(xUrl, (res) => {
                if (res.code === '1') {
                    let parse = JSON.parse(res.content.paperInfo);

                    const items = parse?.Items || [];
                    // 遍历题目
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const itemI7 = item?.I7 || [];
                        const itemChoices = item?.Choices || [];
                        console.log(`题：${i+1}___答案：${itemI7}`)
                        // 判断答题类型是否为选择题
                        if(itemChoices.length == 0){
                          continue;
                        }
                        if(itemChoices.length == 2){
                          var xzt = itemChoices[0].I1 == 'T' || itemChoices[0].I1 == 'F'
                          // 获取选择题答案组
                          const selects = `#children${item?.I1} > div > div:nth-child(2) > div`;

                          let dom = document.querySelector(selects);

                          var daan = dom?.children[itemI7]

                          var labels = daan.querySelector(".el-radio__label")
                          if(labels){
                            labels.style.backgroundColor='red'
                          }
                        }else{
                          // 答案
                          itemI7.forEach(c => {
                              const selects = `#children${item?.I1} > div > div:nth-child(2) > div > div:nth-child(${Number(c) + 1}) > div > div > label`;
                              const dom = document.querySelector(selects);
                              dom?.click();
                          });
                        }

                    }
                    // alert("自动答题完成，请对照右侧答案核对一遍\n目前对多选的兼容性较差，保证100分的前提下，需仔细核对多选题、单选题")
                }
            })
        }
    })
}
function hasClass(element, className) {
    if (element?.className?.indexOf(className) > -1) {
        return true;
    } else {
        return false;
    }
}
function req(url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + getCookie("XSKJ-ticket"),
            'open-student-space-profile': decodeURI(getCookie("XSKJ-Admin-Struct"))
        },
        success(data) {
            callback(data)
        }
    });
}

// 获取url参数信息
function getQueryVariable(variable) {
    const query = window.location.href.split("?")[1];
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return null;
}

(function () {
    'use strict';
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("load", function () {
            // 课件 || 答题
            if (xhr.responseURL.includes('student-space-service/file/getFileOw365ById') || xhr.responseURL.includes('student-space-service/testPaper/getPaperById')) {
                // 点击下一课
                let nextDom = document.querySelector("#app > div > div > div.player-content.player-page > div.main > div.footer.clearfix > i.el-icon-arrow-right.fr")
                nextDom.click()
                // 视频清晰度修改
                let videos = document.querySelector("#J_prismPlayer_component_9B1EBA51-2E25-41A2-A8BC-1F4A145FC9C6 > div.prism-clarity-btn > ul > li.SD.clarity-btn")
                videos.click()
            }
            // 在线作业
            if (xhr.responseURL.includes('testExam/goDoExamine')) {
                // 延迟两秒执行
                setTimeout(()=>{selectCheck()},3000)
            }
        });
    });
    // // 添加按键监听
    // document.addEventListener("keydown", function (e) {
    //     console.log(e.key)
    //     if (e.key === 'r' && e.altKey) {
    //         // alert(1)
    //         selectCheck()
    //     }
    // });

})();