// ==UserScript==
// @name         同步所有数据
// @namespace    http://tampermonkey.net/
// @version      2024-11-07
// @description  八度云-授权管理-同步所有数据
// @author       You
// @require      https://unpkg.com/axios/dist/axios.min.js
// @match        https://duanshipin.bdsaas.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517857/%E5%90%8C%E6%AD%A5%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/517857/%E5%90%8C%E6%AD%A5%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function () {
    'use strict'
    // Your code here...
    function getEl() {
        const el = document.querySelector('.operation')
        if(el) {
            const btn = document.createElement('button')
            btn.classList.add('ivu-btn', 'ivu-btn-primary')
            btn.innerText = '开始同步数据'
            document.querySelector('.operation').appendChild(btn)
            btn.onclick = startSync
        } else {
            setTimeout(()=>{
                getEl()
            }, 500)
        }
    }
    getEl()

    // 开始同步
    async function startSync() {
        let total = 0,
            success = 0,
            fail = 0
        try {
            let staffList = await getList()
            console.log(staffList)
            total = staffList.length
            message(`总计${total}条，开始同步`)
            ;(async function fn() {
                let takeList = staffList.splice(0, 20)
                let task = takeList.map(item => getItem(item.id))
                const res = await Promise.all(task)
                success += res.length
                if (staffList.length > 0) {
                    message(`总计${total}条，已同步${success}`)
                    fn()
                } else {
                    message(`同步完成，1s后刷新页面`)
                    setTimeout(() => {
                        location.reload()
                    }, 1000);
                }
            })()
        } catch (error) {}
    }

    // 获取所有员工号
    async function getList() {
        const { data } = await axios({
            method: 'post',
            url: 'https://api.tool.duanshipin.com/api/company/account/accountList',
            headers: {
                Token: localStorage.getItem('company-token'),
                'Dg-admin': 'company',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: { page: 1, page_size: 9999, group_id: -1, app: 1, publish_auth: 0 },
        })
        if (data.code === 200) {
            return data.data.data
        } else {
            throw new Error('获取员工列表失败')
        }
    }

    // 单个员工同步
    async function getItem(id) {
        const { data } = await axios({
            method: 'get',
            url: 'https://api.tool.duanshipin.com/api/company/auto/accountSyncData?account_id=' + id,
            headers: {
                Token: localStorage.getItem('company-token'),
                'Dg-admin': 'company',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
        if (data.code === 200) {
            return data.data
        } else {
            throw new Error('同步员工账号失败')
        }
    }
    // 消息提示
    function message (text) {
        let dom = document.querySelector('#myMessage')
        if (!dom) {
            dom = document.createElement('button')
            dom.id = 'myMessage'
            dom.style.position = 'fixed'
            dom.style.top = '-20vh'
            dom.style.left = '50vw'
            dom.style.zIndex = '99'
            dom.style.padding = '10px 20px'
            dom.style.color = '#2d8cf0'
            dom.style.fontSize = '20px'
            dom.style.backgroundColor = '#ffffff'
            dom.style.border = '2px solid #2d8cf0'
            dom.style.borderRadius = '10px'
            dom.style.transition = 'all 0.3s'
            dom.innerText = text
            document.querySelector('body').appendChild(dom)
            dom.style.top = '20px'
        } else {
            dom.innerText = text
        }
        function fn () {
            setTimeout(() => {
                dom.style.top = '-20vh'
            }, 5000)
            setTimeout(() => {
                document.querySelector('body').removeChild(dom)
            }, 5500)
        }
        const deFn = debounce(fn, 5000)
        deFn()
    }

    // 防抖
    function debounce(func, delay) {
        let timer;
        return function (...args) {
            // 清除之前的定时器
            clearTimeout(timer);

            // 设置新的定时器
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
})();