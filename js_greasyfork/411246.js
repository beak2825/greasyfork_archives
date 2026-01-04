// ==UserScript==
// @name         iCity 网页版小助手
// @namespace    https://limxw.com
// @version      0.4
// @description  优化网页版 iCity 日记体验
// @author       WingLim
// @match        https://icity.ly/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411246/iCity%20%E7%BD%91%E9%A1%B5%E7%89%88%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/411246/iCity%20%E7%BD%91%E9%A1%B5%E7%89%88%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery

    const textarea = $(".content")
    // 隐藏滑动条
    textarea.css("overflow", "hidden")
    // textarea 自动适应高度
    textarea.on("input", function () {
        if (this.scrollHeight > 150) {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        }
    });

    textarea.on("focus", function() {
        textarea.css("min-height", "150px")
    })

    // 失焦后调整高度
    textarea.on("focusout", function() {
        if (textarea.val() == "") {
            textarea.height(96)
            textarea.css("min-height", "")
        }
    })

    // 拖放图片
    const postComposer = $(".post-composer");

    postComposer.on("dragenter", function(e) {
            e.preventDefault();
        }
    );

    postComposer.on("dragover", function(e) {
            e.preventDefault();
        }
    );

    postComposer.on("drop", function(e) {
            dropHandler(e);
        }
    );

    var dropHandler = function(e) {
        e.preventDefault(); // 获取文件列表
        var fileList = e.originalEvent.dataTransfer.files;

        // 检测是否是拖拽文件到页面的操作
        if (fileList.length == 0) {
            return;
        }

        // 检测文件是不是图片
        if (fileList[0].type.indexOf("image") === -1) {
            return;
        }

        // 实例化file reader对象
        let reader = new FileReader();
        const photosQueue = $(".photos-queue")
        postComposer.addClass("with-photos")

        // 预览图片
        reader.onload = function(e) {
            var div = $('<div class="photo-one"></div>'),
                removeBtn = $('<a class="remove" href="#"><i class="fa fa-remove"></i></a>'),
                img = $("<img>")
                img[0].src = this.result
                img.data("file", fileList[0])
                div.append(img)
                div.append(removeBtn)
                photosQueue.append(div)
        };
        reader.readAsDataURL(fileList[0]);
    };

    // 导出日记
    $(".divider").before("<li><a id='export-diary' href='#'>导出</a></li>");
})();