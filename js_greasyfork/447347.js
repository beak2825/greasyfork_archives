// ==UserScript==
// @name         方正教务系统期末教学评价助手
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  用于自动完成期末教学评价
// @author       Eduarte
// @match        *://*/xspjgl/xspj_cxXspjIndex.html*
// @license MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/447347/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%9C%9F%E6%9C%AB%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447347/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%9C%9F%E6%9C%AB%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const toInject = document.createElement('script')
    toInject.innerHTML = `
    function setUA() {
        // 修改UA绕过检测
        const UAs = [
            'Mozilla/5.0 (Linux; Android 12.0; Pixel 5 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'Mozilla/5.0 (Linux; Android 10.0.0; Pixel 5 XL Build/OPP3.9705110.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.36 Mobile Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 10.1; Pixel 5 XL Build/OPM1.67011110.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.50 Mobile Safari/537.36'
        ]
        Object.defineProperty(navigator, 'userAgent', {
            value: UAs[Math.floor(Math.random() * 5)],
            writable: false
        })
    }

    async function start(awaitTime){
        setUA()
        console.log("等待", awaitTime, "ms")
        const sleep = ms => new Promise(r => setTimeout(r, ms))
        let courseList = document.getElementsByTagName('tbody')[0].childNodes
        for (let id_ in courseList)
        {
            if (typeof(courseList[id_]) === 'object')
            {
                if (courseList[id_].getAttribute('role') === 'row')
                {
                    let stat = courseList[id_].childNodes[7].getAttribute('title')
                    let teacher = courseList[id_].childNodes[8].getAttribute('title')
                    let blacklist = ["万艳玲", "潘保兴"]
                    if (stat === '未评')
                    {
                        console.log("发现未评课程，上课教师：", teacher)
                        courseList[id_].click()
                        console.log("等待", awaitTime, "ms")
                        await sleep(awaitTime)
                        let checkboxes = document.getElementsByClassName("radio-pjf")
                        let tot = 0
                        for (let id in checkboxes)
                        {
                            if (typeof(checkboxes[id]) === 'object' && checkboxes[id].getAttribute('data-sfzd') === '1')
                            {
                                tot++
                            }
                        }
                        let rnd = Math.floor(Math.random() * tot)
                        for (let id in checkboxes)
                        {
                            if (typeof(checkboxes[id]) === 'object')
                            {
                                if (blacklist.indexOf(teacher) !== -1) {
                                    if (id == rnd * 5)
                                    {
                                        checkboxes[parseInt(id) + 3].checked = true
                                    }
                                    else if (checkboxes[id].getAttribute('data-sfzd') === '1')
                                    {
                                        checkboxes[parseInt(id) + 4].checked = true
                                    }
                                }
                                else {
                                    if (id == rnd * 5)
                                    {
                                        checkboxes[parseInt(id) + 1].checked = true
                                    }
                                    else if (checkboxes[id].getAttribute('data-sfzd') === '1')
                                    {
                                        checkboxes[id].checked = true
                                    }
                                }
                            }
                        }
                        document.getElementById('btn_xspj_tj').click()
                    }
                }
            }
        }

		alert('已完成评教，请刷新页面查看')
		location.reload()
    }
    `
    const style = document.createElement('link')
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('href', 'https://www.bootcss.com/p/buttons/css/buttons.css')
    const menu = document.createElement('div')
    menu.innerHTML = `
    <style>
        .closeBtn {
            transition: background-color 0.5s;
            border-radius: 2px
        }
        .closeBtn:hover {
            background-color: #cccccc;
            transition: background-color 0.5s;
            border-radius: 2px;
            cursor: pointer
        }
        .panel_ {
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(204,204,204,.6);
            transition: opacity 0.5s linear;
            width: 320px;
            opacity: 0.8;
            position: fixed;
            top: 18vh;
            right: 50px;
            background-color: #ffffff;
            border-radius: 5px
        }
        .panel_.hidden {
            opacity: 0
        }
        .title_ {
            font-size: 15px;
            font-weight:bold
        }
        .input_ {
            height: 26px;
            width: 120px;
            outline-style: none;
            border: none;
            border-radius: 2px;
            background-color: rgba(245, 245, 245, .98);
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
            transition: all 0.2s;
        }
        .input_:hover {
            background-color: rgba(248, 248, 248, .98);
        }
        .input_:focus {
            outline: none;
            box-shadow: 0 0 8px rgba(204,204,204,.6);
        }
    </style>
	<div
        id="panel_"
        class="panel_"
	>
		<div
			style="padding: 20px 0 0 20px"
		>
			<p class="title_">
                方正教务系统期末教学评价助手 v2.7
			</p>
		</div>
        <div
            style="padding: 20px 0 0 20px; line-height: 26px"
        >
            <p style="display:inline">等待表单加载时间：</p>
            <input type="text" id= "awaitTime" class="input_" style="display:inline" value="1000" />
        </div>
		<div
			style="padding: 20px 0 0 20px"
		>
			<button
				onclick="start(document.getElementById('awaitTime').value)"
				class="button button-primary button-small"
			>
				开始
			</button>
		</div>
		<div
			style="padding: 20px 0 20px 20px"
		>
			<p>
				&copy; 2025 oxdl.cn
			</p>
		</div>
        <div
            style="position:absolute;top:10px;right:10px"
            class="closeBtn"
            onclick="document.getElementById('panel_').classList.add('hidden')"
        >
            <img src="https://www.pngall.com/wp-content/uploads/4/Cancel-PNG.png" alt="cancel" style="width:18px;height:14px;padding: 1px 4px 3px 4px" />
        </div>
	</div>
	`

    document.getElementsByTagName('body')[0].appendChild(menu)
    document.body.appendChild(style)
    document.body.appendChild(toInject)
})();