// ==UserScript==
// @name         视觉中国下载破解
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  由于视觉中国改版，该插件已失效。
// @author       ZSK
// @match        https://www.vcg.com/creative/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30944/%E8%A7%86%E8%A7%89%E4%B8%AD%E5%9B%BD%E4%B8%8B%E8%BD%BD%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/30944/%E8%A7%86%E8%A7%89%E4%B8%AD%E5%9B%BD%E4%B8%8B%E8%BD%BD%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var elem = $($('.btn.btn-block.btn-hui')[2]);
        var strUrl = $('#source_image').attr("src");
        var reg = /[^\/]*$/;
        var photoImg = reg.exec(strUrl)[0];
        var photoHttp = "https://bj-feiyuantu.oss-cn-beijing.aliyuncs.com/vcgzipdownload/" + photoImg;
        var str;
        var mystyle = `
            .row .side .side-view .btn-red:visited {
              border: 1px solid #3bbf3f;
                background: #3bbf3f;
                color: #fff;
            }

            .row .side .side-view .btn-red:hover {
                 border: 1px solid #3bbf3f;
                background: #3bbf3f;
                color: #fff;
            }

            .btn-red {
                background: #5ecfba;
                color: #fff;
                transition: .5s;
                border: 1px solid #5ecfba;
                border-radius: 2px;
            }
        `;
        $('head').append('<style>' + mystyle + '</style>');
        str = '<a class="btn btn-block btn-red" style="" id="myDown" src="' + photoHttp + '"><i class="icon-images-downyt"></i>破解下载</a>';
        elem.parent().append(str);
        $('body').on('click', "#myDown", function(e) {
            window.open(photoHttp);
        });
    };
})();