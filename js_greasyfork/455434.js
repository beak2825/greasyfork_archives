// ==UserScript==
// @name         清水河畔之谁是懂球帝
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  睡睡睡(>﹏<)
// @author       DARK-FLAME-MASTER FROM RIVERSIDE
// @match        *://*.uestc.edu.cn/forum.php?mod=viewthread*
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uestc.edu.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/455434/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E4%B9%8B%E8%B0%81%E6%98%AF%E6%87%82%E7%90%83%E5%B8%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/455434/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E4%B9%8B%E8%B0%81%E6%98%AF%E6%87%82%E7%90%83%E5%B8%9D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function notice(message) {
        Notification.requestPermission().then((result) => { if (result === 'granted') { let n = new Notification(message); setTimeout(n.close.bind(n), 1800) } })
    }
    function generate(matches) {
        let reg = /["',，.。/、\]|[【】\\n\s！!?？——_<>%;‘’；)《（）》(&+=`“”·*#@@]/
        wrong = []
        let names = data.map((u) => u.name)
        data.forEach((d, i) => {
            let predict = i != 0 ? d.content.length == matches ? d.content : d.content.split(reg).join('') : '楼主'
            if (names.indexOf(d.name) != i)
                d.predict = '重复'
            else
                d.predict = predict
            let r = new RegExp(`[胜负平]{${matches}}`)
            if ((predict.length != matches || !predict.match(r) && d.predict != '重复') && i != 0)
                wrong.push(d.floor)
        })
        alert(`请完善${wrong.join('楼，')}的异常信息`)
    }

    function addWater(pid, water, reason, referer) {
        return fetch("https://bbs.uestc.edu.cn/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1", {
            "headers": {
                'content-type': 'application/x-www-form-urlencoded'
            },
            "body": `tid=${tid}&pid=${pid}&formhash=${formhash}&referer=${encodeURI(referer)}&handlekey=rate&score2=${water}&reason=${reason}`,
            "method": "POST",
        });
    }

    function addWaterAll(water) {
        let addPromises = win.map((index) => addWater(data[index - 1].pid, water, rewardMessage(data[index - 1].accuracy), `https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=${tid}&page=${calcPage(data[index - 1].floor)}#${data[index - 1].pid}`))
        Promise.all(addPromises).then((_)=>_.map((r,i)=>r.ok?'':win[i]+'楼,').reduce((p,c)=>p+c,'')).then((result)=>result==''?alert('完成加水'):alert(result+'需要手动加水'))
    }

    function check(result) {
        if (wrong.length == 0) {
            win = []
            winMaLe = []
            data.forEach((d) => {
                d.accuracy = result.split('').reduce((count, p, i) => count + (p == d.predict[i] ? 1 : 0), 0) / matches
                if (d.accuracy >= 0.5) win.push(d.floor)
                if (d.accuracy == 1) winMaLe.push(d.floor)
            })
            notice('完成准确率计算')
            checked = true
            if (autoAdd){
                document.body.innerHTML += `<div id="prewarda">🧧</div>`
                $('#prewarda').addEventListener('click', () => addWaterAll(20))
            }

        } else {
            notice(`还剩${wrong.join('楼，')}没有完成`)
        }
    }

    function set(predicts, index, predict) {
        predicts[index].predict = predict
        store()
    }

    function search(predicts, index) {
        return predicts[index].predict
    }

    async function getData(url, pages) {
        let p = new Array(pages).fill(0)
        let dataPromise = p.map((_, page) => fetch(url + (page + 1))
            .then(data => data.text())
            .then(data => {
                let doc = new DOMParser().parseFromString(data, 'text/html');
                let users = doc.querySelectorAll('div.authi > a.xw1')
                let contents = doc.querySelectorAll('.t_f')

                return [].slice.call(users, 0).map((user, index) => { return { space: user.href, floor: index + page * 20 + 1, name: user.text, content: contents[index].textContent.replaceAll('\n', ''), pid: contents[index].id.match(/(\d+)/)[1] } })
            }))
        return await Promise.all(dataPromise).then(data => data.reduce((p, c) => p.concat(c)).sort((a, b) => a.floor - b.floor))

    }



    async function initPredict() {
        if (data == undefined) {
            let link = unsafeWindow.location.href
            tid = link.match(/tid=(\d*)/)[1]
            let pages = parseInt($('#pgt > div > div > label > span').textContent.match(/(\d+)/)[1])
            data = await getData(`https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=${tid}&extra=&page=`, pages)
            generate(matches)
            $('#pgwrongf').textContent = wrong ? wrong[0] + '楼' : ''
            store()
        } else
            alert('当前帖子为' + tid)
    }

    function save() {
        let csvContent = '用户名,预测结果,楼层数,空间链接,帖子ID,预测准确率' + data.map(user => user.predict.length == 4 ? `${user.name},${user.predict},${user.floor},${user.space},${user.pid},${user.accuracy ? user.accuracy : 0}` : '').join('\n')
        saveAs(new Blob([Uint8Array.from([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/plain;charset=utf-8" }), new Date().toISOString() + '.csv').then((_) => notice('保存成功'))
    }

    function store() {
        GM_setValue('data', data)
        GM_setValue('wrong', wrong)
        GM_setValue('rewardNow', rewardNow)
        GM_setValue('matches', matches)
        GM_setValue('win', win)
        GM_setValue('winMaLe', winMaLe)
        GM_setValue('tid', tid)
        GM_setValue('checked', checked)
    }

    function load() {
        data = GM_getValue('data', undefined)
        wrong = GM_getValue('wrong', undefined)
        rewardNow = GM_getValue('rewardNow', 0)
        matches = GM_getValue('matches', undefined)
        win = GM_getValue('win', undefined)
        winMaLe = GM_getValue('winMaLe', undefined)
        tid = GM_getValue('tid', undefined)
        autoAdd = GM_getValue('autoAdd', false)
        checked = GM_getValue('checked', false)

    }

    function clear() {
        data = undefined
        wrong = undefined
        rewardNow = undefined
        matches = undefined
        win = undefined
        winMaLe = undefined
        tid = undefined
        checked = false
        store()
        notice('已完成清空')
    }
    function registerEvents() {
        /*         if (autoAdd && reward)
                    addWater(data[win[rewardNow - 1]].pid, 1, 'test', unsafeWindow.location.href) */

        $('#pgenerate').addEventListener('click', function () {
            matches = parseInt(prompt('请输入比赛数：'))
            if (matches) initPredict()
            notice('已加载数据')
        })
        $('#pset').addEventListener('click', () => $('#psetm').style.visibility = ('visible' == $('#psetm').style.visibility ? 'hidden' : 'visible'))
        $('#psearch').addEventListener('click', () => $('#psearchm').style.visibility = ('visible' == $('#psearchm').style.visibility ? 'hidden' : 'visible'))
        $('#preward').addEventListener('click', () => $('#prewardm').style.visibility = ('visible' == $('#prewardm').style.visibility ? 'hidden' : 'visible'))

        $('#psetb').addEventListener('click', function () {
            let predict = $('#psetp').value
            let index = parseInt($('#psetf').value) - 1
            set(data, index, predict)
            notice('设置成功')
        })

        $('#psearchb').addEventListener('click', function () {
            let index = parseInt($('#psearchf').value) - 1
            $('#psearchp').value = search(data, index)
        })

        $('#prewardb').addEventListener('click', function () {
            let result = $('#prewardp').value
            check(result)
            rewardNow = 0
            $('#pgrewardf').textContent = win ? win[rewardNow] + '楼' : ''
            store()
        })
        $('#pgwrong').addEventListener('click', function () {

            if (wrong.length >= 1) {
                let wrongNow = wrong.shift()

                store()
                unsafeWindow.location = `https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=${tid}&page=${calcPage(wrongNow)}#pid${data[wrongNow - 1].pid}`
            }
            $('#pgwrongf').textContent = wrong ? (wrong.length ? wrong[0] + '楼' : '完成') : ''

        })
        $('#pgreward').addEventListener('click', function () {
            rewardNow++
            store()
            unsafeWindow.location = `https://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=${tid}&page=${calcPage(win[rewardNow - 1])}#pid${data[win[rewardNow - 1] - 1].pid}`
            $('#pgrewardf').textContent = win ? win[rewardNow] + '楼' : ''
        })
        $('#pclear').addEventListener('click', clear)
        $('#psave').addEventListener('click', save)
        if (autoAdd && checked) $('#prewarda').addEventListener('click', () => addWaterAll(20))
    }

    function setting() {
        autoAdd = !autoAdd
        GM_setValue('autoAdd', autoAdd)
        location.reload()
    }

    let data, wrong, rewardNow, matches, win, winMaLe, tid, autoAdd, checked, formhash
    const rewardMessage = (accuracy) => accuracy == 1 ? '预测正确率100%' : '预测正确率≥50%'
    const calcPage = (floor) => parseInt((floor - 1) / 20) + 1
    function $(s) {
        return document.querySelector(s)
    }
    load()
    if (unsafeWindow.location.href.match(/tid=(\d*)/)[1] == tid || $('input[name=srhfid]').value == '157' && $("p > em > a").text == '版主' && $('.ts>a').text == '[比赛]') {

        GM_registerMenuCommand((autoAdd ? '☑️' : '❌') + '全自动加水', setting, "h");
        if (autoAdd && checked)
            document.body.innerHTML += `<div id="prewarda">🧧</div>`
        document.body.innerHTML += `<div id="ptool">
        <input type="checkbox" id="popen" style="
        display: none;
    ">
        <div class="ptool pmain" id="pgenerate">
            <svg viewBox="0 0 24 24" width="50" height="50" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
        </div>
        <div style="transform: rotate(-60deg) translate(70px,-50%);" class="ptool pattach" id="pset">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>

            <div></div>
        </div>
        <div style="transform: rotate(60deg) translate(70px,-50%);" class="ptool pattach" id="psearch">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        </div>
        <div style="transform: rotate(-30deg) translate(70px,-50%);" class="ptool pattach" id="preward"><svg
                viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg></div>
        <div style="transform: rotate(30deg) translate(70px,-50%);" class="ptool pattach" id="pgwrong">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <div id="pgwrongf">undefined楼</div>
        </div>

        <div id="pgreward" class="ptool pattach" style="transform: rotate(0deg) translate(70px,-50%);">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
            <div id="pgrewardf"></div>
        </div><label for="popen" class="ptool pattach" style="
    "></label>


        <div style="transform: translate(-50%,-100px);" class="ptool pattach" id="pclear">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
        </div>
        <div style="transform: translate(-50%,70px);" class="ptool pattach" id="psave">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
        </div>


        <div class="psetm pmenu" style="
            transform: translate(70px, -185px);
            box-shadow: 0px 0px 6px rgb(3 169 244 / 40%);
            display: block;
            visibility: hidden;
            " id="psetm">
            <div>楼层数： <input type="number" placeholder="1" id="psetf"></div>
            <div>胜负关系：<input type="text" placeholder="胜胜胜胜" id="psetp"></div>
            <div style="
            float: right;
            border: 1px #e8f1f8 solid;
            border-radius: 5px;
            padding: 1px;
            background-color: #dff0ff;
            cursor: pointer;
            " id="psetb">添加</div>
        </div>
        <div class="psearchm pmenu" style="
            transform: translate(60px, 100px);
            box-shadow: 0px 0px 6px rgb(3 169 244 / 40%);
            visibility: hidden;
            " id="psearchm">
            <div>楼层数： <input type="number" placeholder="1" id="psearchf"></div>
            <div>胜负关系：<input type="text" placeholder="？？？？" disabled="" id="psearchp"></div>
            <div style="
            float: right;
            border: 1px #e8f1f8 solid;
            border-radius: 5px;
            padding: 1px;
            background-color: #dff0ff;
            cursor: pointer;

            " id="psearchb">查询</div>
        </div>
        <div class="prewardm pmenu"
            style="transform: translate(90px, -110px);box-shadow: rgba(3, 169, 244, 0.4) 0px 0px 6px; visibility: hidden; "
            id="prewardm">

            <div>胜负关系：<input type="text" placeholder="？？？？" id="prewardp"></div>
            <div style="
            float: right;
            border: 1px #e8f1f8 solid;
            border-radius: 5px;
            padding: 1px;
            background-color: #dff0ff;
            cursor: pointer;
            " id="prewardb">谁是懂球帝</div>
        </div>
    </div>
        <style>
        .ptool {
            display: flex;
            position: fixed;
            border-radius: 50%;
            top: 50%;
            background: #03a9f445;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .pmain {
            height: 100px;
            width: 100px;
            transform: translate(-50%, -50%);
            transition: 0.2s;
            justify-content: flex-end;
        }


        .ptool:hover {
            background-color: #03a9f4;
        }

        .ptool:active {
            background-color: #2194f2;
        }

        .pmain:hover {
            height: 110px;
            width: 110px;
            box-shadow: 3px 0px 6px 3px rgba(214 227 236 /0.8);
        }

        .pattach {
            height: 30px;
            width: 30px;
            transform-origin: left top;
            transition: 0.2s;

        }

        .pattach:hover {
            height: 40px;
            width: 40px;
            box-shadow: 0px 0px 6px 3px rgba(214 227 236 /0.8);

        }

        div#pgreward:hover {
            width: 100px;
            border-radius: 20px;
        }

        div#pgwrong:hover {
            border-radius: 20px;
            width: 100px;
        }

        .pmenu {
            border-radius: 5px;
            background: #c3e5f4;
            padding: 5px;
            grid-template-columns: 1fr;
            position: fixed;
            top: 50%;
        }

        .pmenu>div {
            padding: 5px;
            display: flex;
            justify-content: space-between;
        }

        .pmenu>div>input {
            width: 50px;
            float: right;
            outline-style: none;
            border: 0;
            border-radius: 3px;
        }

        .pattach:hover>div {
            display: inline;
        }

        .pattach>div {
            font-size: 15px;
            color: white;
            white-space: nowrap;
            display: none;
            cursor: default;
        }

        div#pgreward:hover~label {
            transform: translate(180px, -50%);
        }

        div#pgreward~label {
            transform: translate(110px, -50%);
        }



        #popen:checked~div.pattach {
            width: 0;
            height: 0;
        }

        #popen:checked~div.pmain {
            transform: translate(-100%, -50%);
        }

        #popen:checked~label {
            transform: translate(0, -50%);
        }

        #popen:checked~label::after {
            content: '👉🏻';
        }

        #popen~label::after {
            content: '👈🏻';
        }
        div#prewarda {
            left: calc(100% - 73px);
            justify-content: center;
            font-size: 60px;
            position: fixed;
            top: 50%;
            cursor: pointer;
        }
        </style>`
        formhash = $('input[name=formhash]').value
        $('#pgrewardf').textContent = win ? win[rewardNow] + '楼' : ''
        $('#pgwrongf').textContent = wrong ? (wrong.length ? wrong[0] + '楼' : '完成') : ''

        registerEvents()
    }
    // Your code here...
})();