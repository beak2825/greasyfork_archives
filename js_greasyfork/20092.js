// ==UserScript==
// @name         百度去广告
// @version      0.22
// @description  增加支持贴吧
// @author       Erimus
// @include      *www.baidu.com/s?*
// @include      *tieba.baidu.com/*
// @namespace    https://greasyfork.org/users/46393
// @downloadURL https://update.greasyfork.org/scripts/20092/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/20092/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const SN = '[百度去广告]' // script name
    console.log(SN, '油猴脚本开始')

    let startTime = new Date()

    let remove_ad_in = function(parentName) {
        // parentName 必须是id名
        // 因为用了自动翻页等插件之后，会持续出现广告。
        // 所以interval就不清除了，反正在百度页面也不会停留太久，用性能换清净吧。
        let remove_ad = setInterval(function() {
            let spanAll = document.querySelectorAll('#' + parentName + ' span')
            // console.debug(SN, 'spanAll', spanAll)
            for (let i = 0; i < spanAll.length; i++) {
                if (spanAll[i].innerHTML == '广告') {
                    let laji = spanAll[i].parentNode.parentNode
                    for (let j = 0; j < 99; j++) {
                        if (laji.parentNode.id == parentName) {
                            console.log(SN, '找到广告:', laji)
                            break
                        } else {
                            laji = laji.parentNode
                        }
                    }
                    // laji.style.opacity = 0.5
                    laji.parentNode.removeChild(laji)
                }
            }
            // 如果在百度页面都停留超过2分钟了，那就看一眼人家广告吧。
            if (new Date() - startTime > 120000) {
                clearInterval(remove_ad)
            }
        }, 500)
    }

    if (document.URL.includes('baidu.com/s?')) {
        console.debug(SN, '百度搜索')
        remove_ad_in('content_left')
    } else if (document.URL.includes('tieba')) {
        console.debug(SN, '百度贴吧')
        remove_ad_in('thread_list')
    }

})();
