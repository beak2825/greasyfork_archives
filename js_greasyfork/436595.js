
// ==UserScript==
// @name         在etherscan.io和blockstream.info给oklink导流，在百度搜索页添加okex, oklink跳转按钮
// @description  在etherscan.io和blockstream.info给oklink导流。给百度搜索页加入Google，OKLink，OKEx按钮，一键跳转到Google搜索进行相应的检索，一键跳转到OKLink，OKEx；在google搜索页添加百度按钮，一键跳转到百度搜索进行相应的检索。支持去除百度结果页面的广告和右边栏。
// @icon         https://static.okex.com/cdn/assets/imgs/MjAxODg/D91A7323087D31A588E0D2A379DD7747.png
// @namespace    https://greasyfork.org/zh-CN/users/840552
// @version      1.20
// @author       zccst
// @license      MIT
// @run-at       document-start
// @include      http*://*baidu.com/s*
// @include      http*://*baidu.com/baidu*
// @include      *://www.google.com/search?*
// @include      *://www.google.com.*/search?*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/436595/%E5%9C%A8etherscanio%E5%92%8Cblockstreaminfo%E7%BB%99oklink%E5%AF%BC%E6%B5%81%EF%BC%8C%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E6%B7%BB%E5%8A%A0okex%2C%20oklink%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/436595/%E5%9C%A8etherscanio%E5%92%8Cblockstreaminfo%E7%BB%99oklink%E5%AF%BC%E6%B5%81%EF%BC%8C%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E6%B7%BB%E5%8A%A0okex%2C%20oklink%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主流程开始
    var hostname = window.location.hostname;
    // 在etherscan.io
    if (hostname.match(RegExp(/etherscan.io/))) {
        document.addEventListener ("DOMContentLoaded", loadEthereumList);
        // var loadEthereumListHandler = window.setInterval(loadEthereumList, 5 * 1000);
        function loadEthereumList() {
            console.log("eth DOMContentLoaded or setInterval");
            var hrefArr = document.getElementsByTagName('a'); // 获取这个页面的所有A标签
            for ( var i = 0; i < hrefArr.length; i++ ) {
                var hrefURL = hrefArr[i].getAttribute("href");
                if (hrefURL.indexOf('/tx/') >= 0 || hrefURL.indexOf('/address/') >= 0 || hrefURL.indexOf('/block/') >= 0) {
                    // window.clearInterval(loadEthereumListHandler)
                    hrefArr[i].setAttribute('href', 'https://www.oklink.com/zh-cn/eth' + hrefURL);
                    hrefArr[i].setAttribute('target', '_blank');
                    console.log(hrefURL);
                }
            }
        }
    }
    // 在blockchair.com
    else if (hostname.match(RegExp(/blockstream.info/))) {
        console.log('in blockstream.info');
        document.addEventListener ("DOMContentLoaded", loadBitCoinList);
        var loadBitCoinListHandler = window.setInterval(loadBitCoinList, 1 * 1000);
        function loadBitCoinList() {
            console.log("btc DOMContentLoaded or setInterval");
            var hrefObjArr = document.getElementsByTagName('a'); // 获取这个页面的所有A标签
            for ( var i = 0; i < hrefObjArr.length; i++ ) {
                var hrefURL = hrefObjArr[i].getAttribute("href");
                if (hrefURL && hrefURL.indexOf('block/') === 0) {
                    // clearInterval(loadBitCoinListHandler);
                    var height = hrefObjArr[i].firstElementChild.innerHTML;
                    hrefObjArr[i].setAttribute('href', 'https://www.oklink.com/zh-cn/btc/block/' + height);
                    hrefObjArr[i].setAttribute('target', '_blank');
                    console.log(hrefURL);
                }
                else if (hrefURL && hrefURL.indexOf('tx/') === 0) {
                    // clearInterval(loadBitCoinListHandler);
                    var tx = hrefURL.split("/")[1];
                    hrefObjArr[i].setAttribute('href', 'https://www.oklink.com/zh-cn/btc/tx/' + tx);
                    hrefObjArr[i].setAttribute('target', '_blank');
                    console.log(hrefURL);
                }
            }
        }
    }
    // 在百度
    else if (hostname.match(RegExp(/baidu.com/))) {
        // 去除一些无用的百度广告
        var style_tag_baidu = document.createElement('style');
        style_tag_baidu.innerHTML = '#content_right{display:none;}'; // 移除百度右侧栏
        document.head.appendChild(style_tag_baidu);
        $('#content_left>div').has('span:contains("广告")').remove();// 去除常规广告

        // 载入Google，OKLink，OKEx按钮
        document.addEventListener ("DOMContentLoaded",show_buttons_in_baidu);

        // 在百度结果首页开始添加按钮
        function show_buttons_in_baidu () {

            // 添加Google搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="google" value="Google搜索" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:100px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#CC3333;border-bottom:1px solid #CC0033;outline:medium;" onmouseover="this.style.background=\'#CC0033\'" onmouseout="this.style.background=\'#CC3333\'">')
            $("#google").click(function(){
                window.open('https://www.google.com/search?&q=' + encodeURIComponent($('#kw').val()));
            }) // 结束

            // 添加oklink搜索按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="to_oklink" value="OKLink" class="btn self-btn bg" style="outline:none;float:right; font-size:14px; text-align:center; text-decoration:none; width:100px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#3385ff;border-bottom:1px solid #2d78f4;;outline:medium;" onmouseover="this.style.background=\'#317ef3\'" onmouseout="this.style.background=\'#3385ff\'">')
            $("#to_oklink").click(function(){
                window.open('https://www.oklink.com/');
            }) // 结束

            // 添加okex按钮
            $('.s_btn_wr,#s_btn_wr').after('<input type="button" id="to_okex" value="OKEx" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:100px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px; background:#66CC00; border-bottom:1px solid #00CC00; outline:medium;" onmouseover="this.style.background=\'#33CC00\'" onmouseout="this.style.background=\'#66CC00\'">')
            $("#to_okex").click(function(){
                window.open('https://www.okex.com/');
            }) // 结束

            function del_delayed_ads(){
                $('.c-container').has('.f13>span:contains("广告")').remove();
            }
            setTimeout(function () { del_delayed_ads(); }, 2100); // 去除顽固性的延迟加载广告，一般延迟2秒左右。例如搜索“淘宝”，当页面加载完毕之后在搜索结果最前或最后会再插入一个广告。
        }

    } // 百度上添加其他搜索结束

    // 在Google上添加百度搜索
    else if (hostname.match(RegExp(/google.com/))) {
        document.addEventListener ("DOMContentLoaded", show_buttons_in_google);
        function show_buttons_in_google () {
            var url_baidu = "https://www.baidu.com/s?wd=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
            $(".RNNXgb:first").append('<div style="display:inline-block; height:100%; width:0px; box-sizing: border-box; border-radius:30px;"><button id="google++" type="button" style="height:100%; width:100%; border:none; outline:none; border-radius:30px; font-size:15px; cursor:pointer; display:block; float:left; font-size:14px; text-align:center; text-decoration:none; width:100px;  margin-left:30px; color:#fff; letter-spacing:1px; background:#3385ff; " onclick="window.open(\''+ url_baidu + '\')" title="使用百度搜索引擎检索该关键词">百度一下</button></div>');
            $(".gLFyf.gsfi:first").change(function(){
                var url_baidu_new = "https://www.baidu.com/s?wd=" + encodeURIComponent($(".gLFyf.gsfi:first").val()) + "&from=TsingScript";
                $("#google++").attr('onclick','window.open("'+ url_baidu_new + '")');
            });
        }
    } // 结束

    GM_registerMenuCommand ("欢迎提出建议和意见", menu_func, ""); // 注册脚本的菜单选项
    function menu_func () {
        window.open("https://greasyfork.org/zh-CN/scripts/840552/feedback");
    }
})();