// ==UserScript==
// @name         download163musiclist
// @namespace    http://tampermonkey.net/
// @version      2024-04-17
// @description  用于备份网易云音乐网页版的歌单,在 https://music.163.com/#/playlist?id= 页添加 备份歌单 的红色按钮
// @author       xueque
// @license      MIT
// @match        *://music.163.com/playlist?*
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon         https://s1.music.126.net/style/favicon.ico
// @grant        none
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/441655/download163musiclist.user.js
// @updateURL https://update.greasyfork.org/scripts/441655/download163musiclist.meta.js
// ==/UserScript==
!function () {
    'use strict';

    // 获取歌单信息
    function get_playlist_information(dom) {
        const song_sheet = []
        // 获得歌单 table 的全部 tr 行
        const rows = dom.querySelector('tbody').rows
        //遍历取得歌曲信息,并格式化
        for (let i = 0; i < rows.length; i++) {
            const info = {}
            const td_list = rows[i].getElementsByTagName('td')
            info.id = td_list[0]?.innerText
            info.title = td_list[1]?.querySelector('b')?.title
            info.duration = td_list[2]?.querySelector('span')?.innerText
            info.singer = td_list[3]?.querySelector('div')?.title
            info.album = td_list[4]?.querySelector('a')?.title
            song_sheet.push(info)
        }
        return song_sheet
    }

    // 保存到文件
    function saveAsText(name, str) {
        // 定义保存的文件格式
        const blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        // 保存到文件
        saveAs(blob, `${name}.txt`);
    }

    // 构建歌单
    function download_playlist(dom) {
        // 定义歌单格式转换方案
        const format = (info) => `${info.id}: ${info.title} - ${info.singer}`
        // 转换歌单信息为字符串
        const list_str = get_playlist_information(dom).map(item => format(item)).join('')
        // console.log(list_str)
        // 得到歌单名
        const sheet_name = dom.querySelector('.f-ff2').innerText
        // console.log(sheet_name)
        saveAsText(sheet_name, list_str)
    }

    // 创建按钮
    const creat_button = (txt,id="my_download_button") => {
        // 注入一个下载歌单的按钮
        const button = document.createElement("button")
        button.innerHTML = txt
        button.setAttribute('id', id)
        button.setAttribute('class', `more`)
        button.setAttribute('style', `margin-right:15px;background-color: red;color: white;`)
        return button
    }
    // 移除
    function remove_el(el_id_array = []) {
        el_id_array.forEach(id => {
            const el = document.getElementById(id)
            if (el) el.remove()
        })
    }

    // 注入按钮
    function inject_button() {
        console.log("添加自定义按钮")
        // 未进入 playlist 页面,等待1s后重新检测
        const is_right_page = window.location.href.includes('playlist?')
        // 如果没有 element,等待1s后重新检测
        const topWin = window.top.document.getElementById('g_iframe')?.contentWindow
        const element = topWin?.document.querySelector('.u-title,.u-title-1.f-cb')
        if (!is_right_page || !element) {
            setTimeout(() => inject_button(), 1000)
        } else {
            // 如果存在,先移除
            remove_el(["my_download_button"])
            const button = creat_button("备份歌单")
            button.addEventListener('click', (e) => {
                download_playlist(topWin.document)
                e.preventDefault()
            })
            element.appendChild(button)
        }
    }

    inject_button()
}();
