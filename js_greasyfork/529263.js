// ==UserScript==
// @name         艺语图VIP图集免费观看下载
// @namespace    yituyu_vip_pic_free_see_and_download
// @version      1.0
// @description  来不及解释了，快上车！
// @author       w2f
// @match        https://www.yituyu.com/gallery/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yituyu.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @downloadURL https://update.greasyfork.org/scripts/529263/%E8%89%BA%E8%AF%AD%E5%9B%BEVIP%E5%9B%BE%E9%9B%86%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529263/%E8%89%BA%E8%AF%AD%E5%9B%BEVIP%E5%9B%BE%E9%9B%86%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果库劫持失败，可能是其他代码对xhr/fetch进行了二次劫持，protect方法会尝试阻止xhr和fetch被改写。
    ajaxHooker.protect();
    // 为hook方法设置过滤规则，只有符合规则的请求才会触发hook
    ajaxHooker.filter([
        {type: 'xhr', url: '/ajax_gallery/', method: 'POST', async: true},//小狐狸
    ]);
    // 通过一个回调函数进行劫持，每次请求发生时自动调用回调函数。
    ajaxHooker.hook(async request => {
        request.response = async res => {
            let jsonobj = await JSON.parse(res.responseText);
            //console.log("hooked!!! rsp ====>",jsonobj);
            //修改返回值
            jsonobj.data.down_num = jsonobj.data.num;
            jsonobj.data.downhtml = `<a href="${jsonobj.data.down_url}" target="_blank"><button type="button">权限已足！请点击下载❤️</button></a>`;
            jsonobj.data.imgs = jsonobj.data.content.split(',').map(img=>`https://img.yituyu.com${window.location.pathname}${img}`);
            window.rspdata = jsonobj.data;
            console.log("hooked!!! fixrsp ====>",jsonobj);
            //return await JSON.stringify(jsonobj);
        };
    });
    // 将xhr和fetch恢复至劫持前的状态，调用此方法后，hook方法不再生效。
    // ajaxHooker.unhook();

    function check_circle(){
        if(!document.body || !window.rspdata){
            console.log("⌛️加载DOM中...");
            return ;
        }
        const data = window.rspdata;
        var html='';
        for (var i = 5; i < data.imgs.length; i++) {
            html+=`<img class="lazy t1" data-img="${data.imgs[i]}" data-src="${data.imgs[i]}" src="${data.imgs[i]}" alt="${window.title}">`;
        }
        $('.gallerypic').append(html);
        $('#downstr').html(data.downhtml);
        clearInterval(my_timer);
    }
    let my_timer = setInterval(check_circle, 2000);
})();