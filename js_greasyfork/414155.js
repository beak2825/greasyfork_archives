// ==UserScript==
// @name           在线AI转换
// @description    直接下载
// @author         018(lyb018@gmail.com)
// @contributor    Rhilip
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/368137-encodeToGb2312/code/encodeToGb2312.js?version=601683
// @include        https://www.zaixianai.cn/voiceCompose
// @version        0.1.1
// @icon           https://www.zaixianai.cn/favicon.ico
// @run-at         document-end
// @namespace      http://018.ai
// @downloadURL https://update.greasyfork.org/scripts/414155/%E5%9C%A8%E7%BA%BFAI%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/414155/%E5%9C%A8%E7%BA%BFAI%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

// 不属于豆瓣的页面
if (!/zaixianai.cn/.test(location.host)) {
    return
}

;(function () {
    'use strict';
    function downloadFile(url, fileName = '') {
        let eleLink = document.querySelector('.dlurl');
        if(!eleLink) {
            eleLink = document.createElement('a');
        }
        eleLink.download = fileName;
        eleLink.className = 'dlurl';
        //eleLink.style.display = 'none';
        eleLink.href = url;
        eleLink.textContent = '如果下载失败，请尝试用「链接存储为...」进行下载。';
        $('.downloadEx').after(eleLink);
        eleLink.click();
        //document.body.removeChild(eleLink);
    };

    $(document).ready(function () {
        $('.download').after('<div class="downloadEx"><img src="images/yuyin_10.jpg"><p>点击下载</p></div>');
        $('.download').hide();
        $(".downloadEx").on("click",function () {
            if(file_name==''){
                layer.alert('请先点击立即合成');
                return false;
            }
            downloadFile(host + "/voice/" + file_name, file_name)
            //window.open(host + "/voice/" + file_name);
        });
    })

    // 判断，空返回空字符串
    function opt(val) {
        if (!val) return '';

        if (val instanceof Array) {
            if (val.length > 0) {
                return val[0];
            }
        } else {
            return val;
        }
    }

    // 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
    function page_parser(responseText) {
        // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
        responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
        responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
        return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    // 加载网页
    function loadDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText)
                    callback(doc, responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // get请求
    function doGet (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // post请求
    function doPost (url, headers, data, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: data,
            headers: headers,
            onload: function(responseDetail){
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }
})()
