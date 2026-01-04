// ==UserScript==
// @name         联大学堂，自动刷课、答题、考试（OCR版）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  联大学堂高等学历继续教育网络学习平台，自动刷课答题考试，进入答题或课程页面，点击右上角红色“开始”按钮，即可自动刷课、答题、考试。
// @author       三年泪
// @match        *://*.jxjypt.cn/classroom/start*
// @match        *://*.jxjypt.cn/paper/start*
// @icon         https://kc.jxjypt.cn/favicon.ico
// @grant        none
// @license      MIT
// @connect      127.0.0.1 // 允许连接到本地服务器
// @downloadURL https://update.greasyfork.org/scripts/541700/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E3%80%81%E7%AD%94%E9%A2%98%E3%80%81%E8%80%83%E8%AF%95%EF%BC%88OCR%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541700/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E3%80%81%E7%AD%94%E9%A2%98%E3%80%81%E8%80%83%E8%AF%95%EF%BC%88OCR%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

'use strict'

let timer = 0

const btn = document.createElement('button')
;(function () {
    btn.id = 'start-btn'
    btn.style.cssText = `
      position: fixed;
      z-index: 99999;
      top: 0;
      right: 0;
      padding: 10px 50px;
      background: red;
      color: white;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 0 10px #999;
    `
  btn.innerText = '开始'

    btn.addEventListener('click', () => {
        if (timer) {
            clearInterval(timer)
            timer = 0
            btn.innerText = '开始'
        } else {
            btn.innerText = '暂停'
            const path = location.pathname
            if (path === '/classroom/start') {
                // 视频课
                doVideoCourse()
            } else if (path === '/paper/start') {
                // 课程作业或考试
                doPaper()
            } else {
                btn.innerText = '开始'
            }
        }
    })
    document.body.appendChild(btn)
})()

/** 视频课 */
function doVideoCourse() {
    const courseList = document.querySelectorAll('.course-l .course-list-txt')
    const unplayedList = [] // 待做课程id
    courseList.forEach(item => {
        const sections = item.querySelectorAll('dd.z-gery-icon')
        sections.forEach(section => {
            const unplay = section.querySelector('.fa-youtube-play')
            if (unplay) {
                unplayedList.push(section.dataset.jieId)
            }
        })
    })
    // console.log(unplayedList)

    function nextVideo() {
        if (unplayedList.length < 1) {
            clearInterval(timer)
            alert('当前页面全部课程已完成')
            btn.innerText = '开始'
            return
        }
        const section = document.querySelector(
            `dd[data-jie-id="${unplayedList[0]}"]`
    )
        section.parentElement.querySelector('dt.z-gery-icon').click()
        section.click()
        setTimeout(async () => {
            const video = document
            .querySelector('#video-content')
            .querySelector('video')
            if (video) {
                video.play()
            }

            const question = document.querySelector('#question-area .m-question')
            // console.log(question)
            let pageCodeValue = document.getElementById('pagecode').value;
            const qid = question.dataset.qid
            const answer = await getPictureAnswerByQid(qid,pageCodeValue)
            answer.forEach(a => {
                document
                    .querySelector(`.m-question-option[data-value="${a}"]`)
                    .click()
            })

            unplayedList.shift()
            setTimeout(window.submitSelf, 200)
            console.log(`Done ${qid}, ${unplayedList.length} left`)
        }, 1000)
    }

    setTimeout(nextVideo, 1000)
    timer = setInterval(nextVideo, 1000 * 5)
}

/** 课程作业或考试 */
let qIndex = 0
function doPaper() {
    const qList = document.querySelectorAll('#questionModule > ul > li')
    timer = setInterval(async () => {
        if (qIndex === qList.length) {
            clearInterval(timer)
            document.querySelector('#btn_submit').click()
            btn.innerText = '开始'
            return
        }

        const qid = qList[qIndex].querySelector(
            `input[name="qid[${qIndex}]"]`
    ).value
        const pqid = qList[qIndex].querySelector(
            `input[name="pqid[${qIndex}]"]`
    ).value
        const answer = await getAnswerByQid(pqid)

        const options = qList[qIndex].querySelector('dl.sub-answer')
        if (options) {
            // 选择 判断题
            answer.forEach(a => {
                options.querySelector(`dd[data-value="${a}"]`).click()
            })
        } else {
            // 填空 简答
            qList[qIndex].querySelector('.mater-respond textarea').value = answer
        }
        qIndex++
        console.log(`Done ${qid}, ${qList.length - qIndex} left`)
    }, 1000)
}


async function getPictureAnswerByQid(qid, pageCode) {
    // Wrap the entire asynchronous operation in a Promise
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`https://kc.jxjypt.cn/paper/question/resolve/chapter?pagecode=${pageCode}&qid=${qid}&ver=0&width=100`);
            const imageBlob = await response.blob();

            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64String = reader.result;
                console.log(base64String);

                // Assuming setWhiteBackground is defined elsewhere and returns a Promise or is synchronous
                const whiteBackgroundBase64 = await setWhiteBackground(imageBlob);

                const ocrResponse = await fetch("http://127.0.0.1:1224/api/ocr", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        base64: whiteBackgroundBase64.split(",")[1]
                    }),
                });
                const ocrResult = await ocrResponse.json();
                console.log(ocrResult);

                if (ocrResult.code === 100 && ocrResult.data && ocrResult.data.length > 0) {
                    let fullText = "";
                    console.log("OCR 识别结果:");
                    ocrResult.data.forEach(line => {
                        fullText += line.text;
                        console.log(`文本: "${line.text}", 置信度: ${line.score}`);
                    });
                    console.log("完整识别文本:", fullText);

                    const match = fullText.match(/[ABCD]/);
                    if (match) {
                        const extractedLetter = match[0];
                        console.log("提取到的大写字母:", extractedLetter);
                        // Resolve the promise with the extracted letter as an array
                        resolve([extractedLetter]);
                    } else {
                        console.warn("未在 OCR 结果中找到大写字母 A、B、C 或 D。");
                        // Resolve with null or an empty array if no match is found, depending on desired behavior
                        resolve(null);
                    }
                } else {
                    console.warn("OCR 识别失败或无数据:", ocrResult);
                    // Resolve with null or an empty array on OCR failure
                    resolve(null);
                }
            };

            reader.onerror = (error) => {
                console.error("读取 Blob 时出错:", error);
                // Reject the promise if there's an error reading the Blob
                reject(error);
            };

            reader.readAsDataURL(imageBlob);
        } catch (error) {
            console.error("在 getPictureAnswerByQid 函数中发生错误:", error);
            // Catch any errors during the fetch or initial processing and reject the promise
            reject(error);
        }
    });
}

/**
 * 将一个透明底的 Base64 图片背景改为白色。
 * @param {string} base64Image 原始的 Base64 图片字符串 (例如 "data:image/png;base64,...").
 * @param {string} [backgroundColor='#FFFFFF'] 可选参数，要设置的背景颜色，默认为白色。
 * @returns {Promise<string>} 返回一个 Promise，成功时 resolve 新的 Base64 字符串，失败时 reject 错误。
 */
function setWhiteBackground(base64Image, backgroundColor = '#FFFFFF') {
    return new Promise((resolve, reject) => {
        // 1. 创建一个 Image 对象
        const img = new Image();
        img.src = URL.createObjectURL(base64Image);

        // 2. 设置 Image 对象的 onload 事件
        img.onload = () => {
            // 3. 创建一个 canvas 元素
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 4. 设置 canvas 的尺寸与图片一致
            canvas.width = img.width;
            canvas.height = img.height;

            // 5. 在 canvas 上绘制背景色
            // 这是关键步骤：先用指定颜色填充整个画布
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 6. 将原始图片绘制到 canvas 上
            // 由于图片是透明的，绘制上去后，透明部分会显示出下面已经铺好的白色背景
            ctx.drawImage(img, 0, 0);

            // 7. 从 canvas 中导出新的 Base64 图片
            // toDataURL 默认导出为 'image/png' 格式
            const newBase64 = canvas.toDataURL('image/png');

            // 8. Promise 成功，返回新的 Base64
            resolve(newBase64);
        };

        // 9. 设置 Image 对象的 onerror 事件
        img.onerror = (err) => {
            reject(err);
        };
    });
}
/** 获取答案 */
async function getAnswerByQid(qid) {
    // https://kc.jxjypt.cn/paper/question/resolve/txt?uid=${uid}&pqid=${qid}
    const uid = document.querySelector('#captchaId').value
    const data = await fetch(`https://kc.jxjypt.cn/paper/question/resolve/txt?uid=${uid}&pqid=${qid}&_=${Date.now()}`)
    const json = await data.json()
    console.log('=========================================')
    console.log(json)

    const {rightAnswer, plainText} = json.data

    let answer
    if (plainText) {
        // 填空 简答
        answer = rightAnswer
    } else {
        if (rightAnswer == '错') {
            // 判断题
            answer = ['错误']
        } else if (rightAnswer == '对') {
            answer = ['正确']
        } else {
            // 选择题
            answer = rightAnswer.trim().split('')
        }
    }

    return answer
}
