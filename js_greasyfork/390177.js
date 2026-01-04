// ==UserScript==
// @name         国家计量技术规范文件下载插件
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  国家计量技术规范文件下载插件，修复部分技术规范文件不能下载的问题。更新：优化网站下载逻辑，使用自定义的下载方式。下载时文件时，文件名自动加上规程名称，体验更优。
// @author       vx:2535688890
// @match        http://jjg.spc.org.cn/resmea/standard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390177/%E5%9B%BD%E5%AE%B6%E8%AE%A1%E9%87%8F%E6%8A%80%E6%9C%AF%E8%A7%84%E8%8C%83%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/390177/%E5%9B%BD%E5%AE%B6%E8%AE%A1%E9%87%8F%E6%8A%80%E6%9C%AF%E8%A7%84%E8%8C%83%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //################下载保存模块######################
    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {Promise}
     */
    function getBlob(url) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
            };
            xhr.send();
        });
    }

    /**
     * 保存
     * @param  {Blob} blob
     * @param  {String} filename 想要保存的文件名称
     */
    function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            const body = document.querySelector('body');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            // fix Firefox
            link.style.display = 'none';
            body.appendChild(link);
            
            link.click();
            body.removeChild(link);

            window.URL.revokeObjectURL(link.href);
        }
    }

    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    $.download = function(url, filename) {//注册download为JQ的全局函数
        getBlob(url).then(blob => {
            saveAs(blob, filename);
        });
    }
    //################以上是下载保存模块######################

    //开始执行逻辑
    if ($('.flexible').length == 1) {
        $('.flexible').remove();
    }
    console.log('插件加载成功');
    window.ch_name = $('.left li span')[2].innerHTML;
    window.guifan_num = $('.left_bore span')[0].innerHTML;
    var html_button =
        '<a style="cursor:pointer" class="flexible" href="javascript:;" onclick="$.download(\'http:\/\/jjg.spc.org.cn\/resmea\/standard\/downPdf?stdno=\'+window.guifan_num, window.guifan_num + window.ch_name+\'.pdf\');"><button style="cursor:pointer">下载😀😀😀</button></a>';
    $('.btnbox').append(html_button);
    $('#detail .content .btnbox button').css('background', 'green');
    $('#detail .content .btnbox').css('width', '600px');
})();