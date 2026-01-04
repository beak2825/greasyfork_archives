// ==UserScript==
// @name         国家开放大学自动发帖
// @namespace    ouchn.cn
// @version      1.0
// @description  国家开放大学自动发帖能够设置帖子，帖子见自定义
// @author       zidognfatie
// @match        *://*.ouchn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434136/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434136/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%8F%91%E5%B8%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('发帖助手');
    let setting = {
        subject: '好好学习天天向上', // 主题
        body: '好好学习天天向上,说了的话要做到' // 正文
    };
    let lhref = window.location.href;
    let flag = true;
    //刷课对象
    var type = 0;
    var dotime = 0;
    var Cla = {
        doForum: function () {
            if ($('#id_subject').length == 0)
                return;
            if (!$('#collapseAddForm').hasClass('show'))
                $('#collapseAddForm').addClass('show');
            $('#id_subject').val(setting.subject);
            if ($('iframe').length > 0) {
                window.setTimeout(function () {
                    $('iframe:eq(0)').contents().find('body').html(setting.body);
                }, 500);

            }
            window.setTimeout(function () {
                $('#id_submitbutton').click();
                alert('发帖成功');
            }, 1500);

        }

    };
    $(document).ready(function () {
        if (lhref.includes('/mod/forum/view.php')) {

            window.setTimeout(function () {
                  if ($('.alert p').text().includes('您的帖子已成功添加')
                || $('#id_submitbutton').length == 0
            ) {
                return;
            }
                Cla.doForum();
            }, 1500);

        }

    });
})();