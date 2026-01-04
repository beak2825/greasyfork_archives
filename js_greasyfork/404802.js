// ==UserScript==
// @name         wowma.jp
// @namespace    2937902363@qq.com
// @version      0.3
// @description  刷访问量
// @author       Yua
// @match        *://wowma.jp/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/404802/wowmajp.user.js
// @updateURL https://update.greasyfork.org/scripts/404802/wowmajp.meta.js
// ==/UserScript==
































































var $ = $ || window.$;
let setting = {
    isRuning:false,
    pos: 0,
    dict: 600,
    delay: 2
}

!function() {
    'use strict';

    $('head').append('<style>#conf{position:absolute;top:200px;right:300px;padding:5px 10px;background-color:#fff;border:2px #000 solid;border-radius:4px;box-shadow:0 5px 5px #ccc;z-index:999}#conf h3{margin:0;display:flex;justify-content:center}#conf .main>div{margin-top:5px;display:flex;justify-content:space-between;align-items:center}#conf .main>div span{margin-right:4px}#conf .main>div input{width:40px;background:0 0;outline:0;border:1px #000 solid;text-align:center}#conf .main #run{margin-top:6px;display:flex;justify-content:center;align-items:center;cursor:pointer}</style>')
    //console.log( $('#container'))
    $('#container').append($(`<div id="conf">
        <h3>配置</h3>
        <div class="main">
            <div>
                <span>延迟时间：</span>
                <input type="text" id="delay">
            </div>
            <div>
                <span>滑动距离：</span>
                <input type="text" id="dict">
            </div>
            <span id="run">开始运行</span>
        </div>
        <div class="other">
        </div>
    </div>`))
    updateSetting()
    // 初始化数值
    $('#delay').val(setting.delay)
    $('#dict').val(setting.dict)
    if(setting.isRuning){
        run()
        $('.main #run').text('结束运行').on('click',item=>{
            GM_setValue('isRuning', false)
            location.reload()
        })
        return
    }else{
        $('.main #run').on('click',item=>{
            // 保存配置
            GM_setValue('isRuning', true)
            $('.main #run').text('结束运行')

            GM_setValue('pos',0)
            GM_setValue('delay',Number.parseInt($('#delay').val()))
            GM_setValue('dict',Number.parseInt($('#dict').val()))

            updateSetting()
            run()
        })
    }
    function updateSetting(){
        setting.isRuning = GM_getValue('isRuning', false)
        setting.pos = GM_getValue('pos', 0)
        setting.dict = GM_getValue('dict', 600)
        setting.delay = GM_getValue('delay', 2)
    }
    function run(){

        let curUrl = location.pathname
        let mainUrl = GM_getValue('mainUrl', '')
        if(curUrl.match('/user')||curUrl.match('/itemlist')){
            console.log('user')
            user()
        }else if(curUrl.match('/item')){
            console.log('item')
            item()
        }
    }
    function user(){
        let timeId = setInterval(()=>{
            let $items = $('.searchListingItems .productItem')
            let len = $items.length
            if(len==0){
                console.log('未加载')
                return
            }
            if(setting.pos<len){
                $items.eq(setting.pos).css('background-color', '#FD3026')
                let height = $items.eq(setting.pos).outerHeight(true) * setting.pos
                $('.css-scrollWrapper').animate({scrollTop: height}, 800)
                $items.eq(setting.pos).find($('.productName')).trigger('click')
            }else{
                if($('.next a').length != 0){
                    GM_setValue('pos', 0)
                    $('.next a')[0].click()
                }else{
                    // 运行结束
                    GM_setValue('isRuning', false)
                }
            }
            clearInterval(timeId)
        },100)
        }

    function item(){
        let h = 0
        let dey = setting.delay * 1000
        let timeId = setInterval(()=>{
            h += setting.dict
            $('.css-scrollWrapper').animate({scrollTop: h}, 1000)
            // $('.css-scrollWrapper').scrollTop(h);
            if($('.copyright').offset().top<$(window).height()){
                clearInterval(timeId)
                setting.pos += 1
                GM_setValue('pos', setting.pos)
                window.history.back()
            }
        },dey)
        }
}();