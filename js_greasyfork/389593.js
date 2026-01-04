// ==UserScript==
// @name         loli图床链接排序
// @namespace    https://sm.ms/
// @version      0.3
// @description  重新排序上传结果
// @author       summer
// @match        https://sm.ms/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389593/loli%E5%9B%BE%E5%BA%8A%E9%93%BE%E6%8E%A5%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389593/loli%E5%9B%BE%E5%BA%8A%E9%93%BE%E6%8E%A5%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.$;
    var $smfile = $("#smfile");
    var dataDetail = [];
    var dataUrlCode = [];
    var dataLinkCode = [];
    var dataHtmlCode = [];
    var dataBBCode = [];
    var dataMarkdown = [];
    var dataRemoveLink = [];

    var outputFunc = function(index, response, files) {
        dataDetail[index] = window.formatHtml(response.data);
        dataUrlCode[index] = response.data.url + "\n";
        dataLinkCode[index] = response.data.page + "\n";
        dataHtmlCode[index] = "&lt;a href=\""+ response.data.page +"\" target=\"_blank\"&gt;&lt;img src=\""+ (response.data.thumb == null ? response.data.url : response.data.thumb.url) + "\" /&gt;&lt;/a&gt;\n";
        dataBBCode[index] = "[url="+response.data.page+"][img]"+ (response.data.thumb == null ? response.data.url : response.data.thumb.url) +"[/img][/url]\n";
        dataMarkdown[index] = "!["+ files[index].name +"](" + (response.data.thumb == null ? response.data.url : response.data.thumb.url) + ")\n";
        dataRemoveLink[index] = response.data.delete + "\n";
    };

    $smfile.on('fileuploaderror', function(event, data) {
        if('image_repeated' !== data.response.code) {
            return;
        }
        data.response.data = {
            delete: "(unknown)",
            file_id: data.index,
            filename: data.filenames[data.index],
            hash: "(unknown)",
            height: '100%',
            page: data.response.images,
            path: "(unknown)",
            size: 2,
            storename: data.filenames[data.index],
            url: data.response.images,
            width: '100%'
        };
        outputFunc(data.index, data.response, data.files)
    });

    $smfile.on('fileuploaded', function(event, data, previewId, index) {
        if ('success' !== data.response.code) {
            return;
        }
        outputFunc(index, data.response, data.files)
    });

    $smfile.on('filebatchuploadcomplete', function() {
        $('#imagedetail').html(dataDetail.join(''));
        $('#urlcode').html(dataUrlCode.join(''));
        $('#linkcode').html(dataLinkCode.join(''));
        $('#htmlcode').html(dataHtmlCode.join(''));
        $('#bbcode').html(dataBBCode.join(''));
        $('#markdown').html(dataMarkdown.join(''));
        $('#removelink').html(dataRemoveLink.join(''));
        $("#showurl").show();
    });
})();