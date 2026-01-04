// ==UserScript==
// @name         bt4g添加磁力链接
// @namespace    Xiccnd@qq.com
// @version      0.1.1
// @description  在bt4g的搜索页面直接加入磁力链接
// @match        *://*.bt4g.org/search/*
// @author       Xiccnd

// @license      GPL-3.0 License

// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @icon         https://cdn.jsdelivr.net/gh/Xiccnd/Xiccnd-Pic@master/20220421113011992.1vh7zbll47r4.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443782/bt4g%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/443782/bt4g%E6%B7%BB%E5%8A%A0%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

$(function () {

    'use strict'

    /*
    * 开启或关闭脚本功能
    * */
    //开启添加磁力链接
    xiccndAddMagnet()

    /*
    * 添加磁力链接功能
    * */
    function xiccndAddMagnet() {
        //在标题后添加
        $('h5 a').on('mouseover', function () {//鼠标悬停事件
            //判断是否已添加a标签
            if (!($(this).next('button[value=magnetButton]').length > 0)) {
                //获取链接
                const URL = $(this).attr('href')
                //合成磁力链接
                const SRC = 'magnet:?xt=urn:btih:' + URL.substr(8)
                //生成按钮
                const BUTTON = '<button value="magnetButton" style="margin-left: 10px;">磁力链接</button>'
                //标题后添加按钮
                $(this).parent('h5').append(BUTTON)
                //按钮绑定事件
                $(this).next('button[value=magnetButton]').on('click', function () {
                    //新窗口打开磁力链接
                    window.open(SRC)
                }).on('mouseover', function () {
                    $(this).css('cursor', 'pointer')
                })
            }
        }).trigger('mouseover')//全部触发
    }
})