// ==UserScript==
// @name         从公众号平台获取素材库视频信息
// @namespace    https://liumeng.xyz
// @version      1.0
// @description  柳檬，为您提供公众号、小程序、小游戏等变现方式！！
// @author       Leo
// @license      GPLv2
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg?begin=*&count=*&action=list_video&type=15&token=*&lang=zh_CN
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437886/%E4%BB%8E%E5%85%AC%E4%BC%97%E5%8F%B7%E5%B9%B3%E5%8F%B0%E8%8E%B7%E5%8F%96%E7%B4%A0%E6%9D%90%E5%BA%93%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/437886/%E4%BB%8E%E5%85%AC%E4%BC%97%E5%8F%B7%E5%B9%B3%E5%8F%B0%E8%8E%B7%E5%8F%96%E7%B4%A0%E6%9D%90%E5%BA%93%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
function alertText( msg ){
    let e = document.createElement( 'div' );
    e.style.cssText = "position:fixed;top:10%;background:rgba(0,0,0,0.7);color:#fff;padding:10px 0;width:200px;left:50%;margin-left:-50px;text-align:center;border-radius:5px;";
    e.textContent = "" + msg;
    document.body.appendChild( e );
    setTimeout( function(){
        document.body.removeChild( e );
    }, 5000 );
}
function copyText( str ){
    navigator.clipboard.writeText(str).then(function() { alertText( "拷贝成功" ); }, function() {alertText( "拷贝失败" );});
}
(function() {
    'use strict';

    let items = wx.cgiData.item;
    if(items && items.length > 0){
        items = items.map(function(item){
            return {vid: item.content, thumb: item.img_url, title: item.title};
        });
        copyText(JSON.stringify(items))
    }
    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            handler.next(config);
        },
        onError: (err, handler) => {
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            let res = response.response, items;
            res = typeof res === 'string' ? JSON.parse(res) : res;
            items = res.app_msg_info.item;
            if(items && items.length > 0){
                items = items.map(function(item){
                    return {vid: item.content, thumb: item.img_url, title: item.title};
                });
                copyText(JSON.stringify(items))
            }
            handler.next(response)
        }
    });
})();