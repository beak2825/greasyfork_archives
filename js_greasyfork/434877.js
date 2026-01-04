// ==UserScript==
// @name         重庆法制考试答题
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  支持复制标题、获取当前答案、自动答题
// @author       moxiaoying
// @match        https://ks.cqsdx.cn/exam/user/exam/into*
// @match        https://ks.cqsdx.cn/exam/user/bind*
// @match        https://ks.cqsdx.cn/exam/user/exam_record/view*
// @match        https://ks.cqsdx.cn/exam/user/exam/submit
// @grant        GM_addElement
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434877/%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/434877/%E9%87%8D%E5%BA%86%E6%B3%95%E5%88%B6%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==


const span = createMessage()

const sleep = async (time_delay) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time_delay * 1000)
    })
}
function createMessage() {
    const span = document.createElement('span')
    let style = `position: fixed; right: 10px; top: 80px; width: 500px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`
    span.setAttribute('style', style)
    span.innerText = '脚本启动成功'
    document.body.appendChild(span)
    return span
}

function message(text = '') {
    span.innerHTML = text
}


// 添加按钮到指定父元素
const addBtn = (content, click_func = null, parent_element = '.panel-title') => {
    let heasers = document.querySelector(parent_element);
    let button = document.createElement('button');
    button.innerHTML = content;
    button.className = 'layui-btn layui-btn-warm';
    button.onclick = click_func;
    heasers.append(button);
}


async function completeCurrentQuestion(num = 1) {
    const question = q_list[num - 1]
    for (const answer of question['answer_list']) {
        if (answer['op'] == 1) {
            let op = document.querySelector(`#questions input[value="${answer['id']}"]`)
            if (!op) {
                gen(num)
                await sleep(0.3)
                op = document.querySelector(`#questions input[value="${answer['id']}"]`)
            }
            op.click()
        }

    }
}

async function generateQuestion(num = 1) {
    document.querySelector(`#btn-${num}`).click();
}

const start = async () => {
    const func = async () => {
        for (let i = 1; i <= 100; i++) {
            generateQuestion(i)
            await sleep(0.3)
            await completeCurrentQuestion(i);
            await sleep(2.6)
        }


        // 等待30分钟后点击交卷
        message('等待3秒后点击交卷')
        await sleep(3)
        document.querySelector('body > div.container-fluid > div:nth-child(1) > div.col-md-3 > div > div.block-content.block-content-full.block-content-sm.bg-body-light.font-size-sm.text-center > button').click()
        await sleep(5)
        message('等待5秒后确认')
        document.querySelector('body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm').click()

    }
    if (location.pathname.includes('/user/bind')) {
        addBtn('获取所有答案', func, '.block-header .block-title')
        await sleep(3)
        func()
    }
    else if (location.pathname.includes('submit')) {
        // 如果进入提交页面后点击播放视频
        await sleep(10)
        const video_player = document.querySelector('#myVideo_html5_api')
        video_player.play()
        // 静音
        video_player.volume = 0
        // 16倍数
        video_player.playbackRate = 1
    }
}


// addBtn('获取答案',getCurrentAnswer, '.layui-col-md8 .panel-title')
start()

