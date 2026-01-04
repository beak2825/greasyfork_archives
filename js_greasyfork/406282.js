// ==UserScript==
// @name         自动配置微信服务器信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mp.weixin.qq.com/wxamp/devprofile/**
// @grant        none
//
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/406282/%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE%E5%BE%AE%E4%BF%A1%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/406282/%E8%87%AA%E5%8A%A8%E9%85%8D%E7%BD%AE%E5%BE%AE%E4%BF%A1%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        hotkeys('ctrl+shift+f', function (event, handler){
            if (handler.key === 'ctrl+shift+f') {
                let infoArrays = $('div.config_info_meta.frm_control_group')
                if (infoArrays.length !== 5) {
                    alert('请点开配置服务器信息界面')
                    return
                }
                let waitHandles = []
                infoArrays.each(function () {
                    let infoItem = $(this)
                    let label = $.trim(infoItem.find('label.frm_label.tips_global').text())
                    if (label === 'request合法域名'
                        || label === 'socket合法域名'
                        || label === 'uploadFile合法域名'
                        || label === 'downloadFile合法域名'
                       ) {
                        let lastInput = infoItem.find('div.frm_controls>div.config_info_item:last-child input.frm_input')
                        let addBtn = infoItem.find('a.config_info_item_opr.icon_add')[0]
                        console.log(label, addBtn)
                        let lastInputVal = lastInput.val()
                        if (lastInputVal) {
                          addBtn.click()
                          addBtn.click()
                        } else {
                          addBtn.click()
                        }
                        waitHandles.push(infoItem)
                    }
                })

                setTimeout(function () {
                    waitHandles.forEach(infoItem => {
                        let allInput = infoItem.find('div.frm_controls>div.config_info_item input.frm_input')
                        let waitIpt = []
                        allInput.each(function () {
                            if ($.trim($(this).val()) === '') {
                                waitIpt.push($(this))
                            }
                        })
                        if (waitIpt.length >= 1) {
                           waitIpt[0].val('api.jiazhiguang.vip')
                        }
                        if (waitIpt.length >= 2) {
                           waitIpt[1].val('jiazhiguang.oss-cn-shenzhen.aliyuncs.com')
                        }
                    })
                }, 2000)
            }
        })
    })
})();