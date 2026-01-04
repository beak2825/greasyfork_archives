// ==UserScript==
// @name         t66y clear datda-src
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  图片加载完毕后去除懒加载配置，修改链接直跳
// @author       You
// @match        http://www.t66y.com/htm_data/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414003/t66y%20clear%20datda-src.user.js
// @updateURL https://update.greasyfork.org/scripts/414003/t66y%20clear%20datda-src.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    2020年10月21日 10:50:13 图片加载完毕后去除懒加载配置，修改链接为直跳
    2020年10月22日 11:44:44 修改链接为直跳
    */



    ////////////////////////////////////////////
    /////////////// 修改链接直跳 ///////////////
    ///////////////              ///////////////
    $('a').each(function(){
        var href = $(this).attr('href')
        if(href && href.indexOf('http://www.viidii.info/?') >-1){
            var newhref = href.replace('http://www.viidii.info/?', '').replace(/______/g, '.').replace('&z', '')
            console.log(newhref)
            $(this).attr('href', newhref)
        }
    })

    //////////////////////////////////////////////
    /////////////// 去除图片懒加载 ///////////////
    ///////////////                ///////////////
    var need_log = true;//需要打印进度
    var td_imgs_length = 'nil';
    var td_imgs_idx = 0;
    setTimeout(function(){
        while(true){
            var imgs = $('img[ess-data]');
            if(td_imgs_length == 'nil'){
                td_imgs_length = imgs.length
            }

            if(imgs.length){
                // console.log("======= " + imgs.length + " =======")
                imgs.each(function(){
                    if($(this).attr('src') == $(this).attr('ess-data')){
                        $(this).removeAttr("ess-data").removeAttr("iyl-data").removeAttr("data-link").removeAttr("vzt-data")
                        td_imgs_idx ++
                        // console.log($(this).attr('src'))
                        if(need_log){
                            console.log(td_imgs_idx + ' / ' + td_imgs_length)
                        }

                        if($(this).click){
                            $(this).unbind("click").click(function(){
                                window.open($(this).attr("src"))
                                return false;
                            })
                        }
                    }
                });
            }
            else{
                console.log("========= over ========")
                return
            }
        }
    },3000)

})();