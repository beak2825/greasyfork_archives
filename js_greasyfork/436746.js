// ==UserScript==
// @name         懒人全网音乐下载，修复下载按钮
// @namespace    yysheng
// @version      1.0
// @description  懒人全网音乐下载，修复下载按钮，新增悬浮下载按钮，点击即可下载
// @author       yysheng
// @include      *://*.eggvod.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @license      AGPL License
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436746/%E6%87%92%E4%BA%BA%E5%85%A8%E7%BD%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%EF%BC%8C%E4%BF%AE%E5%A4%8D%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/436746/%E6%87%92%E4%BA%BA%E5%85%A8%E7%BD%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%EF%BC%8C%E4%BF%AE%E5%A4%8D%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //音乐解析
    var music_id = Math.ceil(Math.random() * 100000000);
    var music_html = "<div href='javascript:void(0)' id=" + music_id +
        " style='cursor:pointer;z-index:1998;display:block;background-color:#E5E5E5;width:80px;height:30px;line-height:30px;position:fixed;right:0;top:300px;text-align:center;'>点击下载</div>";
    $("body").append(music_html);
    var hostUrl = window.location.href;
    $("#" + music_id).click(function() {
        var hostUrl = window.location.href;
        if (hostUrl.match(/www\.eggvod\.cn/)) {
            let ele = document.getElementsByClassName('am-btn am-btn-default')[0]
            let url = ele.href
            let name = ele.download
            console.log("开始打印下载地址")
            console.log(url)
            console.log(name)
            downloadByURL(url, name)
        }
    });
    /**
     * 下载文件
     * @param url 文件url
     * @param fileName
     */
    function downloadByURL(url, fileName) {
        axios.get(url, {
                responseType: 'blob'
            })
            .then((response) => {
                console.log("返回二进制")
                downloadByFile(response.data, fileName)
            });
    }
    /**
     * 下载文件
     * @param data  二进制文件流数据
     * @param filename
     */
    function downloadByFile(data, filename) {
        if (!data) return
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link);
    }
    // Your code here...
})();
