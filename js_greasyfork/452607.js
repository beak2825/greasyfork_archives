// ==UserScript==
// @name         九天毕昇
// @namespace    https://greasyfork.org/zh-CN/scripts/452607-%E4%B9%9D%E5%A4%A9%E6%AF%95%E6%98%87
// @version      1.1
// @description  九天毕昇抢V100
// @author       NoahRe1
// @match        https://jiutian.10086.cn/edu/console
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @grant        unsafeWindow
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/452607/%E4%B9%9D%E5%A4%A9%E6%AF%95%E6%98%87.user.js
// @updateURL https://update.greasyfork.org/scripts/452607/%E4%B9%9D%E5%A4%A9%E6%AF%95%E6%98%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        let instance_list = $('.ant-table-row-level-0')
        let instance_num = instance_list.length
        for (let i = 0; i <= instance_num; i++) {
            let instance = instance_list.eq(i)
            let option = instance.find('.options-slot>div')
            let template = instance.find('.btn-retry').clone()
            template.find('.operation-text').text('V100')
            template.attr('class','btn-common btn-v100')
            template.click(function(e) {
                e.stopPropagation()
                e.preventDefault()
                let p = new Promise(function(resolve, reject) {
                    if (instance.find('.location-span').text() != 'NVIDIA V100 1卡 CPU 8核 内存 32G') {
                        let timer = setInterval(function() {
                            let gpu_list = instance.find('.iconbianji:first')
                            gpu_list.click()
                            setTimeout(function() {
                                let radio = $('.ant-radio-input:last')
                                if (radio.attr('disabled') == 'disabled') {
                                    $('.anticon-close').click()
                                } else {
                                    radio.click()
                                    $('.ant-btn-primary').click()
                                    clearInterval(timer)
                                    resolve()
                                }
                            }, 1000)
                        }, 1000)
                    }
                    else{
                        resolve()
                    }
                })
                p.then(function() {
                    let timer = setInterval(function(){
                        let start=instance.find('.btn-retry')
                        if (start.length==1){
                            start.click()
                        }
                        else{
                            console.log(100)
                            clearInterval(timer)
                        }
                    },1000)
                })
            })
            option.append(template)
        }
    }

    $(document).ready(function() {
        setTimeout(addButton, 1000)
    });
})();