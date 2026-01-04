// ==UserScript==
// @name         淘宝图片大图下载
// @namespace    item.taobao.com
// @version      0.1
// @description  下载淘宝大图
// @author       xz
// @match        https://item.taobao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438662/%E6%B7%98%E5%AE%9D%E5%9B%BE%E7%89%87%E5%A4%A7%E5%9B%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/438662/%E6%B7%98%E5%AE%9D%E5%9B%BE%E7%89%87%E5%A4%A7%E5%9B%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
      function addJs(src){
        var element = document.createElement("script");
        element.src = src;
        document.body.before(element);
    }

    addJs('https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js');


    setTimeout(()=>{
        let str=''
        $('#J_UlThumb').find('img').each(function(index,item){
            var jpg = $(item).attr('data-src').replace('_50x50.jpg','');
            console.log(jpg, 'xz2')
            if(!jpg.startsWith('http')){
                jpg='https:'+jpg
            }
            // arr.push();
            if(str){
                str=str+ '\n' + jpg;
            }else{
                str=str+ jpg;
            }
        });
        console.log('请全选下面的大图地址,并使用迅雷下载');
        console.log(str)
    },1000)
})();