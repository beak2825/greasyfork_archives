// ==UserScript==
// @name         XXQG_TEST
// @namespace    https://github.com/Avenshy
// @version      0.1
// @description  try to take over the world!
// @author       Avenshy
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html?id=*
// @match        https://pc.xuexi.cn/points/exam-practice.html
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html?id=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/410072/XXQG_TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/410072/XXQG_TEST.meta.js
// ==/UserScript==
let data_str;
let nowanswer = '0';
let temp = JSON.parse;
JSON.parse = function (text, reviver) {
    let returnobj = temp(text, reviver);
    if (text.indexOf('questions') != -1 && text.indexOf('uniqueId') != -1) {
        data_str = returnobj;
        console.log(returnobj);
    }
    return returnobj;
}
let qtag = document.createElement('div');
qtag.setAttribute('class', 'q-tag');
async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function mydebug() {
    try {
        if (nowanswer == '0' && document.querySelector('.question') == null) {
            console.log('未加载完毕');
            setTimeout(mydebug, 500);
            return null;
        }
        else if (nowanswer == document.querySelector(".big").textContent) {
            setTimeout(mydebug, 500);
            return null;
        } else {
            console.log(nowanswer + ' >> ' + document.querySelector(".big").textContent);
            nowanswer = document.querySelector(".big").textContent;
        }
        if (document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span") == null && document.querySelector('.q-body').querySelector('.q-tag') != null) {
            document.querySelector('.q-body').querySelector('.q-tag').remove();
            console.log('removed');
        } else {
            if (document.querySelector('.q-body').querySelector('.q-tag') == null) {
                document.querySelector('.q-body').appendChild(qtag);
            }
            if (data_str) {
                let corrects = data_str['questions'][nowanswer - 1]['correct'];
                if (corrects == undefined) {
                    let match = data_str['questions'][nowanswer - 1]['questionDesc'].match(/(?<=<font\scolor=\"red\">).*?(?=<\/font>)/g);
                    if (match == null) {
                        qtag.innerText = '这道题没有答案 :-(';
                        setTimeout(mydebug, 500);
                        return null;
                    }
                    corrects = [];
                    for (let x of match) {
                        corrects.push({ 'value': x });
                    }
                }
                let answer = '';
                let tixing = document.querySelector('.q-header').textContent; // 题型
                for (let x of corrects) {
                    answer += x['value'] + '\n';
                }
                if (tixing.indexOf('填空题') != -1) {
                    if (corrects.length == 1) {
                        answer += '（已复制）';
                    } else {
                        answer += '（已复制第一空）';
                    }
                    GM_setClipboard(corrects[0]['value']);
                } else if (tixing.indexOf('单选题') != -1 || tixing.indexOf('多选题') != -1) {
                    let choosable = document.querySelectorAll(".q-answer.choosable");
                    if (choosable.length != 0) {
                        for (let x of corrects) {
                            if (x['answerId'] != undefined) {
                                if (choosable[x['value'].charCodeAt(0) - 65].className.indexOf('chosen') == -1) {
                                    choosable[x['value'].charCodeAt(0) - 65].click();
                                }
                            } else {
                                for (let t of choosable) {
                                    for (let i = 0; i < corrects.length; i++) {
                                        if (t.textContent.indexOf(corrects[i]['value']) != -1 && t.className.indexOf('chosen') == -1) {
                                            t.click();
                                            break;
                                        }
                                    }
                                }

                            }


                        }
                    }
                } else {
                    console.log(tixing);
                    return null;
                }
                if (qtag.innerText != answer) {
                    qtag.innerText = answer;
                }

            }


        }
    } catch (error) { }

    setTimeout(mydebug, 500);
};
mydebug();