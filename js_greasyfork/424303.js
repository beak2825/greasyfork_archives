// ==UserScript==
// @name         屏蔽掘金用户
// @namespace    [url=mailto:772332013@qq.com]772332013@qq.com[/url]
// @version      1.1.4
// @description  屏蔽不感兴趣掘金用户，仅限话题区。等页面加载好之后，鼠标移动到每条资讯上，右上角都会有个关闭按钮，点击就会隐藏。如果想取消，自行编辑localStorage的blackList字段
// @author       MO
// @create       2021-04-01
// @match        *://juejin.cn/*
// @run-at       document-start
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/424303/%E5%B1%8F%E8%94%BD%E6%8E%98%E9%87%91%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/424303/%E5%B1%8F%E8%94%BD%E6%8E%98%E9%87%91%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function(win, doc) {
    'use strict'

    if (win.onurlchange === null) {

        // 主元素
        let $el = null
        let $ul = null

        // 黑名单用户id
        let blackList = undefined
        if(localStorage.getItem('blackList')) {
            blackList = localStorage.getItem('blackList').split(',')
        } else {
            blackList = []
        }
        // 校对正则生成
        let blackListReg = new RegExp(blackList.join('|')||'[^\\d]')

        // 计数器
        let len = 0

        // 检测黑名单id
        function checkUser ($el, list) {
            let result = {
                id: undefined,
                match: false
            }
            // 发现包含黑名单id
            let target = $el.querySelector('.user-popover-box[st\\3Astate]');
            if(target){
                result.id = target.getAttribute('st:state');
                if(blackListReg.test(result.id)) {
                    // 标记true
                    result.match = true
                }
            }
            
            return result;
        }

        // 插入隐藏按钮
        function addHideBtn ($el, id) {
            setTimeout(() => {
                let $btn = doc.createElement('button')
                $btn.classList.add('btn','btn-hide')
                $btn.dataset.id = id

                $el.insertAdjacentHTML('afterBegin','<button class="btn btn-hide" data-id="'+ id +'">× 屏蔽此用户</button>')
            }, 100)
        }

        // 设置列表
        function setList () {
            let $li = $ul.querySelectorAll('li')
            // 读取新的列表li
            for(;len < $li.length; len++) {
                // 命中黑名单就去除
                let result = checkUser($li[len], blackList)
                if(result.match){
                    $li[len].style.display = 'none'
                } else {
                    // 忽略树洞id
                    if(result.id == '1398234521548542') return
                    // 插入隐藏按钮
                    result.id && addHideBtn($li[len], result.id)
                }
            }
        }

        // 主元素插入监听
        function insertListenFn () {
            $ul = this.querySelector('.pin-list')
            if($ul) setList()
        }
        // 按钮事件绑定
        function btnHideFn ({ target }) {
            if(target && target.classList.contains('btn-hide')) {
                let id = target.dataset.id
                blackList.push(id)
                localStorage.setItem('blackList', blackList.join())
                blackListReg = new RegExp(blackList.join('|'))

                target.parentNode.style.display = 'none'
            }
        }
        // 事件绑定
        function bindEv () {

            $el && $el.removeEventListener('DOMNodeInserted', insertListenFn, false)
            $el && $el.removeEventListener('click', btnHideFn, false)

            $el = doc.querySelector('.pin-list-view')
            $el && $el.addEventListener('DOMNodeInserted', insertListenFn, false)
            $el && $el.addEventListener('click', btnHideFn, false)
        }

        // url变化事件
        win.addEventListener('urlchange', ({url}) => {

            len = 0

            bindEv()

        })

        // 注入按钮style
        doc.querySelector('head').insertAdjacentHTML('beforeEnd', '<style>.pin-list .item{position:relative}.pin-list .item .btn-hide{line-height:24px;padding:0 12px;position:absolute;top:27px;right:86px;border:1px solid;color:#007fff;background-color:#fff;}</style>')
    }

})(window, document);