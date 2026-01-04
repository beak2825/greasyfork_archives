// ==UserScript==
// @name         zentao fix image type
// @namespace    https://www.zentao.net/
// @version      1.0
// @description  因某些图片上传格式错误，故直接修改文件格式（需要提前安装TIFF viewer）
// @author       Lennon
// @match        http://192.168.25.25:10027/zentao/*
// @run-at       document-end
// @icon         https://www.zentao.net/data/upload/201606/f_4140edf00c28c7f976e1d1aa2796cabc.ico
// @downloadURL https://update.greasyfork.org/scripts/381900/zentao%20fix%20image%20type.user.js
// @updateURL https://update.greasyfork.org/scripts/381900/zentao%20fix%20image%20type.meta.js
// ==/UserScript==
(function () {
    'use strict';

    $('.main-col').find('img').each(function(){
        $(this).attr('src', $(this).attr('src').replace('.png', '.tif'))
    })
})();
