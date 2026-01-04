// ==UserScript==
// @name         去他大爷的答题
// @namespace    https://greasyfork.org/zh-CN/users/563657-seast19
// @description  自动匹配答案，解放你的大脑
// @version      3.0.6
// @author       seast19
// @icon         https://s1.ax1x.com/2020/05/18/YWucdO.png
// @match        http*://zjpt.nnjjtgs.com:8081/*#/ksnr*
// @grant        GM_xmlhttpRequest
//
// @downloadURL https://update.greasyfork.org/scripts/404057/%E5%8E%BB%E4%BB%96%E5%A4%A7%E7%88%B7%E7%9A%84%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/404057/%E5%8E%BB%E4%BB%96%E5%A4%A7%E7%88%B7%E7%9A%84%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
(function () {
    'use strict'

    // ****************全局变量****************************


    // const serverAPI = 'http://127.0.0.1:7001/answer'  // 云函数api
    const serverAPI = 'https://api.leafs.vip/answer'  // 云函数api
    let startFlag = false //全局开始标记
    let globalTimeout //全局计时器


    // *****************工具函数*****************************

    /**
     * 显示信息框
     * @param {string} text 要显示的信息
     */
    function showMsgBox(text) {
        //避免调用频繁导致上一次的隐藏消息框影响到本次显示
        clearTimeout(globalTimeout)

        document.getElementById('wk_msg').innerText = text
        document.getElementById('wk_msg').style.display = 'block'
        globalTimeout = setTimeout(() => {
            document.getElementById('wk_msg').style.display = 'none'
        }, 6000)
    }

    /**
     * 通用从服务器获取答案
     * @param {string} questionText 问题的文本
     * @returns
     */
    function getAnswers(questionText) {
        return new Promise((resolve, reject) => {
            //跨域请求
            GM_xmlhttpRequest({
                method: 'post',
                url: serverAPI,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    text: questionText
                }),
                onload: function (res) {
                    const answerJson = JSON.parse(res.responseText)
                    if (answerJson.code !== 0) {
                        showMsgBox("匹配失败")
                        reject(answerJson.msg)
                        return
                    }
                    resolve(answerJson?.ans.split(''))
                },
                onerror: function (e) {
                    console.log(e)
                    reject('后台服务器连接失败')
                },
            })
        })
    }

    /**
     * 延时函数(ms)
     * @param {number} ms 延迟毫秒数
     * @returns
     */
    async function delay(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve()
            }, ms)
        })
    }

    /**
     * 延时函数(1000~30000ms随机)
     * @returns
     */
    async function delayRand() {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve()
            }, Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000)
        })
    }


    // *****************************************

    /**
     * 职培平台开始答题
     */
    async function startZjpt() {
        // 防止多次点击
        if (startFlag === true) {
            console.log('点击频繁')
            return
        }
        startFlag = true

        showMsgBox('开始答题，请勿操作')

        let ansList = []
        let preQuesText = ""

        while (true) {
            console.log("**********");
            // 匹配题目
            let questionText = document.querySelectorAll('.tmnrbj > span')[1]?.textContent

            if (questionText === undefined) {
                showMsgBox("未找到题目")
                break
            }

            if (preQuesText === questionText) {
                showMsgBox("正常结束答题")
                break
            }

            // 获取选项
            // document.querySelectorAll('.dxt > div')[3]?.textContent

            // 获取答案
            try {
                ansList = await getAnswers(questionText)
            } catch (error) {
                console.log(error);
                showMsgBox("获取答案失败，请在下一题尝试")
                break
            }


            console.log(`-> 题目:${questionText}`);
            console.log(`-> 正确答案:${ansList}`);


            // 点击答案
            for (const ans of ansList) {
                await delayRand()
                console.log(`-> 选择:${ans}`);
                switch (ans.toUpperCase()) {
                    case "A":
                        document.querySelectorAll('.dxt > div')[0].click()
                        break;
                    case "B":
                        document.querySelectorAll('.dxt > div')[1].click()
                        break;
                    case "C":
                        document.querySelectorAll('.dxt > div')[2].click()
                        break;
                    case "D":
                        document.querySelectorAll('.dxt > div')[3].click()
                        break;
                    case "E":
                        document.querySelectorAll('.dxt > div')[4].click()
                        break;
                    case "F":
                        document.querySelectorAll('.dxt > div')[5].click()
                        break;
                    default:
                        break;
                }
            }


            // console.log(ansList);

            // 点击下一题
            await delay(1000)
            console.log('-> 下一题');
            preQuesText = questionText
            document.querySelector('.xyt').click()
            await delay(2000)
        }

        startFlag = false
    }

    // *********************初始化***********************

    // 初始化函数
    function init() {
        //侧边按钮
        let btnBox = document.createElement('div')
        btnBox.id = 'wk_btn'
        btnBox.style =
            'display:block;z-index:999;position:fixed; right:10px;top:45%; width:70px; height:30px;line-height:30px; background-color:#f50;color:#fff;text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold;cursor:pointer'
        btnBox.innerHTML = '生成答案'

        // 消息提示框
        let msgBox = document.createElement('div')
        msgBox.id = 'wk_msg'
        msgBox.style =
            'display:none;z-index:999;position:fixed; left:10%;bottom:10%;width:80%; border-radius: 3px;padding-left: 6px;padding-right: 6px; height:30px;line-height:30px; background-color:#6b6b6b;box-shadow: 6px 6px 4px #e0e0e0;color:#fff;text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold;cursor:pointer'
        msgBox.innerHTML = 'this is dafault msg'

        // 事件注入
        document.querySelector('body').append(btnBox)
        document.querySelector('body').append(msgBox)
        document.getElementById('wk_btn').addEventListener('click', async () => {
            await startZjpt()
        })
    }

    init()
})()