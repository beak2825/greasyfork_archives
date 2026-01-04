// ==UserScript==
// @name         枝网查重
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  枝网查重-左键选择文本然后点击查重
// @author       Seven & Esgloamp
// @match        https://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433731/%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/433731/%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let ___flag___ = false
    let ___x___ = -1
    let ___y___ = -1
    let ___checkbtn___
    let ___checkboard___
    let ___selected___ = false

    function getdatetime(datetime) {
        return `${datetime.getFullYear()}/${datetime.getMonth() + 1}/${datetime.getDate()}` +
            ` ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`
    }

    function showinfo(json) {
        let first = json.data.related[0]
        let rate = (first.rate * 100).toFixed(2) + "%"

        let d = new Date(first.reply.ctime * 1000);
        let now = getdatetime(new Date())
        let ctime = getdatetime(d)
        let user = first.reply.m_name
        let reply_url = first.reply_url

        let info = `查重时间: ${now}<br>
                        查重率　: ${rate}<br>
                        原创时间: ${ctime}<br>
                        原创用户: ${user}<br>
                        原创链接: <a href="${reply_url}" target=_blank>${reply_url}</a><br>
                        查重结果仅作娱乐参考，请注意辨别是否为原创`
        ___checkboard___.innerHTML = info


        ___checkboard___.style.left = ___x___ + "px"
        ___checkboard___.style.top = ___y___ + "px"
        hideboard(false)
        hidebtn(true)
    }

    function check() {
        let s = window.getSelection().toString()
        console.log("checking " + s)
        fetch('https://asoulcnki.asia/v1/api/check', {
            body: JSON.stringify({
                text: s
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST"
        })
            .then(response => response.json())
            .then(json => {

                console.log(json)
                if (json.data.related.length == 0) {
                    alert("没有找到")
                    return
                }
                showinfo(json)
            })
            .catch(err => console.log(err))
        hidebtn()
    }

    function init() {
        ___checkbtn___ = document.createElement('button')
        ___checkbtn___.setAttribute("style", "position: absolute; left: -1px; top: -1px; display: none; z-index: 9999;")
        ___checkbtn___.addEventListener("click", check, false)
        let btnt = document.createTextNode('查重')
        ___checkbtn___.appendChild(btnt)
        document.getElementsByTagName('body')[0].appendChild(___checkbtn___)

        ___checkboard___ = document.createElement('div')
        ___checkboard___.setAttribute("style", `
                position: absolute;
                left: -1px;
                top: -1px;
                display: none;
                padding: 7px;
                border-style: dashed;
                border-radius: 5px;
                border-color: black;
                border-width: 2px;
                background-color: white`)
        document.getElementsByTagName('body')[0].appendChild(___checkboard___)
    }

    function hidebtn(hide) {
        ___checkbtn___.style.display = hide ? "none" : "block"
    }

    function hideboard(hide) {
        ___checkboard___.style.display = hide ? "none" : "block"
    }

    init()
    window.addEventListener('selectstart', () => {
        console.log("select start")
        if (___flag___ == false) {
            ___flag___ = true

            window.addEventListener('mouseup', e => {
                console.log("select end")
                let s = window.getSelection().toString()
                if (e.button == 0) {
                    if (s.length < 10 || s.length > 1000) {
                        console.log("invalid")
                        hidebtn(true)
                        hideboard(true)
                        return
                    }
                    console.log("valid")
                    if (!___selected___) {
                        ___x___ = e.pageX + 10
                        ___y___ = e.pageY + 10
                        ___checkbtn___.style.left = ___x___ + "px"
                        ___checkbtn___.style.top = ___y___ + "px"
                        hidebtn(false)
                        ___selected___ = true
                    } else {
                        hidebtn(true)
                        ___selected___ = false;
                    }
                }
            })
        }
    })
})();