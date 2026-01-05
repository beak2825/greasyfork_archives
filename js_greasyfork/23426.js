// ==UserScript==
// @name         百度网盘批量离线
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/zh-CN/scripts/23426
// @version      2.5
// @description  批量离线辅助脚本
// @author       fenghengzhi
// @match        http://pan.baidu.com/disk/home*
// @match        http://yun.baidu.com/disk/home*
// @match        https://pan.baidu.com/disk/home*
// @match        https://yun.baidu.com/disk/home*
// @run-at       document-start
// @require      https://unpkg.com/@babel/standalone/babel.min.js
// @require      https://unpkg.com/@babel/preset-env-standalone/babel-preset-env.min.js
// @require      https://unpkg.com/@babel/polyfill/dist/polyfill.min.js
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @note         2.2:解决离线下载过早点击批量离线按钮可能出不来的bug,更新babel到7
// @note         2.5:改进脚本管理器xmlhttpRequest的判断方式
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23426/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E7%A6%BB%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/23426/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E7%A6%BB%E7%BA%BF.meta.js
// ==/UserScript==
var http
if(typeof GM_xmlhttpRequest!='undefined'){
 http=GM_xmlhttpRequest;
}else{
  http=GM.xmlHttpRequest;
}
var click=false; // 判断是否在脚本加载前点击离线下载按钮
// console.log(http);
function btnClick(){
    click=true;
}
http({
    method:'GET',
    url: "https://greasyfork.org/scripts/37905-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E7%A6%BB%E7%BA%BF/code/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E7%A6%BB%E7%BA%BF.js",
    // synchronous:true,
    onload: function(response) {
        var src=response.responseText;
        //var c = Babel.transform(src, { presets: [['es2015',{strictMode:false}], 'es2016','es2017'],sourceType: 'script'});
        var c = Babel.transform(src, { presets: ['env'],sourceType: 'script'});

        console.log(c);
        $(function(){
            /* jshint ignore:start */
            eval(c.code);
            //debugger;
            //console.log(add_multi_button);
            if(click=true){
                $('body').off('click', 'a.g-button:contains(离线下载)', add_multi_button);
                add_multi_button()
            }else{
                $('body').off('click', 'a.g-button:contains(离线下载)', btnClick);
            }
            /* jshint ignore:end */
            // console.log(src,c.code,'success');
        });
    }
});

$(function(){
    $('body').one('click', 'a.g-button:contains(离线下载)', btnClick);
});
