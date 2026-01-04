// ==UserScript==
// @name         temu关闭弹窗
// @namespace    http://tampermonkey.net/
// @version      2024.3.2
// @description  zh-cn
// @author       daozei698
// @match        https://kuajing.pinduoduo.com/*
// @match        https://seller.kuajingmaihuo.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490321/temu%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/490321/temu%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==


(async function () {
    'use strict';

    // 隐藏弹窗
    function hide_wrapper(){
        // 选择 body 的直接子 div 元素
        var divs = document.querySelectorAll('body > div');

        // 遍历这些元素
        Array.prototype.forEach.call(divs, function(div) {
          // 检查元素的 id 是否不是 'sc-container-root'
          if (!['dz_auto_ship', 'sc-container-root'].includes(div.id)){
            // 隐藏元素
            div.style.display = 'none';
          }
        });
    }

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


    // 自动关闭弹窗, 每秒关闭1次弹窗， 15s内没有关闭弹窗则结束
    async function auto_close_wrapper(){
        let end_time = (new Date()).getTime() + 15 * 1000

        async function interval_check_wrapper(){
            // 检查并关闭弹窗
            const BUTTON_TEXTS = [
                '下一条',
                '我知道了',
                '我已阅读',
            ]
            let wrappers = $('[data-testid="beast-core-modal-innerWrapper"]')
            // 从上往下关闭弹窗
            wrappers.sort(function(a, b){
                return Number($(b).css('z-index')) - Number($(a).css('z-index'))
            })
            for(let wrapper of wrappers.get()){
                // let title = $(wrapper).find('[class^="modal_title"]')
                // let title_text = $.trim(title.text())
                let buttons = $(wrapper).find('button[data-testid="beast-core-button"]')
                // 一行可能有多个按钮
                for(let button of buttons.get()){
                    let button_text = $.trim($(button).text())
                    let all_text = $(wrapper).text()

                    // 排除切换店铺的弹窗
                    if(all_text.includes('切换店铺')){
                        continue
                    }

                    console.log('button_text', button_text, (new Date()).toLocaleString())
                    if(BUTTON_TEXTS.includes(button_text)){
                        await sleep(1000)
                        end_time = (new Date()).getTime() + 10000
                        $(button).click()
                    }
                }
            }
        }

        while((new Date()).getTime() < end_time){
            console.log('end_time', end_time)
            await interval_check_wrapper()
            await sleep(1000)
        }
        console.log('end close')

    }

    function init(){
        // 插入按钮
        let dz_html = `
        <div style="position: fixed; top: 0;left:0;z-index:999999;width:150px;">
            <div style="display: flex;flex-direction: column;">
                <button id="dz_close_btn">点击后台关闭弹窗</button>
            </div>
        </div>
        `
        let now = new Date()
        let [year, quarter, version] = GM_info.script.version.split('.')
        $('body').after(dz_html)
        $('#dz_close_btn').on('click', function(){
            if(now < new Date(year, 3 * Number(quarter) - 3) || now > new Date(year, 3 * Number(quarter))){
                return ''
            }
            hide_wrapper()
            $(this).hide()
            let this_url = window.location.href
            if(this_url.includes('?')){
                this_url += '&dz_auto_close=1'
            }else{
                this_url += '?dz_auto_close=1'
            }
            window.open(this_url)
        })

        document.addEventListener('keydown', function(e) {
            // 检查是否按下了 Ctrl+B 或 Command+B
            if ((e.ctrlKey || e.metaKey) && e.keyCode == 66) {
                e.preventDefault(); // 阻止默认行为
                // 在这里编写你想要执行的代码
                console.log('组合快捷键 Ctrl+B 或 Command+B 被触发');
                $('#dz_close_btn').click()
            }
        }, false);

        if(window.location.href.includes('dz_auto_close')){
            auto_close_wrapper()
        }
    }

    init()
})();