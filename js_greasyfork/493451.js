// ==UserScript==
// @name         查询下载地址
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  查询少编资料库的付费文件下载地址,仅供内部使用!
// @author       Giotto
// @match        https://yun.tqredu.cn/web/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493451/%E6%9F%A5%E8%AF%A2%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/493451/%E6%9F%A5%E8%AF%A2%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    var download_url,message
    var button = '<button type="button" id="v-download" style="margin:10px;padding:10px 10px" class="el-button"><span>下载地址</span></button>'
    $('#app > header > div > div.header-right.flex-center').prepend(button)
    $('#v-download').click(function () {
        if ($('#app')[0].__vue__.sucai_doc) {
            download_url = $('#app')[0].__vue__.sucai_doc
            console.log('下载地址：\n' + download_url)
            message = '下载地址：' + download_url
            alert(message)
        } else if ($('#app > div.page-detail > div.left-block > div.info-content > div.sucai-pan > div > div.el-input.el-input-group.el-input-group--append > input')[0]) {
            download_url = $('#app > div.page-detail > div.left-block > div.info-content > div.sucai-pan > div > div.el-input.el-input-group.el-input-group--append > input')[0].value
            console.log('下载地址：\n' + download_url)
            message = '下载地址：' + download_url
            alert(message)
        } else {
            alert('获取下载地址失败！！！')
        }

    });


    // var text = $("#app > div.page-detail > div.left-block > div.info > div:nth-child(3)").text()
    // if (text.includes('文档')) {
    //     download_url = $('#app')[0].__vue__.sucai_doc
    //     console.log('下载地址：\n'+download_url)
    //     message = '下载地址：'+download_url
    //     alert(message)
    //   } else if (text.includes('网盘')) {
    //     download_url = $('#app > div.page-detail > div.left-block > div.info-content > div.sucai-pan > div > div.el-input.el-input-group.el-input-group--append > input')[0].value
    //     console.log('下载地址：\n'+download_url)
    //     message = '下载地址：'+download_url
    //     alert(message)
    //   } else {
    //     alert('获取下载地址失败！！！')
    //   }
})();