// ==UserScript==
// @name         搞定设计 || 创客贴 (屏蔽水印和会员小提示，下载PDF格式！！）
// @version      0.24
// @icon        http://dynamic-image.bear20.com/640x267/uploadImages/2020/289/34/9DTKT3Y2XR06.jpg
// @description  出现不能用为正常现象，佛系更新。搞定设计、创客贴 ，屏蔽水印，会员小提示，下载PDF格式！！（创客贴还不能保存PDF）
// @match        *://*.gaoding.com/design?id=*
// @match        *://*.gaoding.com/odyssey/design?*
// @match        *://*.chuangkit.com/design*
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/401870/%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%20%7C%7C%20%E5%88%9B%E5%AE%A2%E8%B4%B4%20%28%E5%B1%8F%E8%94%BD%E6%B0%B4%E5%8D%B0%E5%92%8C%E4%BC%9A%E5%91%98%E5%B0%8F%E6%8F%90%E7%A4%BA%EF%BC%8C%E4%B8%8B%E8%BD%BDPDF%E6%A0%BC%E5%BC%8F%EF%BC%81%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/401870/%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%20%7C%7C%20%E5%88%9B%E5%AE%A2%E8%B4%B4%20%28%E5%B1%8F%E8%94%BD%E6%B0%B4%E5%8D%B0%E5%92%8C%E4%BC%9A%E5%91%98%E5%B0%8F%E6%8F%90%E7%A4%BA%EF%BC%8C%E4%B8%8B%E8%BD%BDPDF%E6%A0%BC%E5%BC%8F%EF%BC%81%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    (function ($) {
    "use strict";
    // A nice closure for our definitions
    function getjQueryObject(string) {
        // Make string a vaild jQuery thing
        var jqObj = $("");
        try {
            jqObj = $(string)
                .clone();
        } catch (e) {
            jqObj = $("<span />")
                .html(string);
        }
        return jqObj;
    }

    function printFrame(frameWindow, content, options) {
        // Print the selected window/iframe
        var def = $.Deferred();
        try {
            frameWindow = frameWindow.contentWindow || frameWindow.contentDocument || frameWindow;
            var wdoc = frameWindow.document || frameWindow.contentDocument || frameWindow;
            if(options.doctype) {
                wdoc.write(options.doctype);
            }
            wdoc.write(content);
            wdoc.close();
            var printed = false;
            var callPrint = function () {
                if(printed) {
                    return;
                }
                // Fix for IE : Allow it to render the iframe
                frameWindow.focus();
                try {
                    // Fix for IE11 - printng the whole page instead of the iframe content
                    if (!frameWindow.document.execCommand('print', false, null)) {
                        // document.execCommand returns false if it failed -http://stackoverflow.com/a/21336448/937891
                        frameWindow.print();
                    }
                    // focus body as it is losing focus in iPad and content not getting printed
                    $('body').focus();
                } catch (e) {
                    frameWindow.print();
                }
                frameWindow.close();
                printed = true;
                def.resolve();
            }
            // Print once the frame window loads - seems to work for the new-window option but unreliable for the iframe
            $(frameWindow).on("load", callPrint);
            // Fallback to printing directly if the frame doesn't fire the load event for whatever reason
            setTimeout(callPrint, options.timeout);
        } catch (err) {
            def.reject(err);
        }
        return def;
    }

    function printContentInIFrame(content, options) {
        var $iframe = $(options.iframe + "");
        var iframeCount = $iframe.length;
        if (iframeCount === 0) {
            // Create a new iFrame if none is given
            $iframe = $('<iframe height="0" width="0" border="0" wmode="Opaque"/>')
                .prependTo('body')
                .css({
                    "position": "absolute",
                    "top": -999,
                    "left": -999
                });
        }
        var frameWindow = $iframe.get(0);
        return printFrame(frameWindow, content, options)
            .done(function () {
                // Success
                setTimeout(function () {
                    // Wait for IE
                    if (iframeCount === 0) {
                        // Destroy the iframe if created here
                        $iframe.remove();
                    }
                }, 1000);
            })
            .fail(function (err) {
                // Use the pop-up method if iframe fails for some reason
                console.error("Failed to print from iframe", err);
                printContentInNewWindow(content, options);
            })
            .always(function () {
                try {
                    options.deferred.resolve();
                } catch (err) {
                    console.warn('Error notifying deferred', err);
                }
            });
    }

    function printContentInNewWindow(content, options) {
        // Open a new window and print selected content
        var frameWindow = window.open();
        return printFrame(frameWindow, content, options)
            .always(function () {
                try {
                    options.deferred.resolve();
                } catch (err) {
                    console.warn('Error notifying deferred', err);
                }
            });
    }

    function isNode(o) {
        /* http://stackoverflow.com/a/384380/937891 */
        return !!(typeof Node === "object" ? o instanceof Node : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string");
    }
    $.print = $.fn.print = function () {
        // Print a given set of elements
        var options, $this, self = this;
        // console.log("Printing", this, arguments);
        if (self instanceof $) {
            // Get the node if it is a jQuery object
            self = self.get(0);
        }
        if (isNode(self)) {
            // If `this` is a HTML element, i.e. for
            // $(selector).print()
            $this = $(self);
            if (arguments.length > 0) {
                options = arguments[0];
            }
        } else {
            if (arguments.length > 0) {
                // $.print(selector,options)
                $this = $(arguments[0]);
                if (isNode($this[0])) {
                    if (arguments.length > 1) {
                        options = arguments[1];
                    }
                } else {
                    // $.print(options)
                    options = arguments[0];
                    $this = $("html");
                }
            } else {
                // $.print()
                $this = $("html");
            }
        }
        // Default options
        var defaults = {
            globalStyles: true,
            mediaPrint: false,
            stylesheet: null,
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 750,
            title: null,
            doctype: '<!doctype html>'
        };
        // Merge with user-options
        options = $.extend({}, defaults, (options || {}));
        var $styles = $("");
        if (options.globalStyles) {
            // Apply the stlyes from the current sheet to the printed page
            $styles = $("style, link, meta, base, title");
        } else if (options.mediaPrint) {
            // Apply the media-print stylesheet
            $styles = $("link[media=print]");
        }
        if (options.stylesheet) {
            // Add a custom stylesheet if given
            $styles = $.merge($styles, $('<link rel="stylesheet" href="' + options.stylesheet + '">'));
        }
        // Create a copy of the element to print
        var copy = $this.clone();
        // Wrap it in a span to get the HTML markup string
        copy = $("<span/>")
            .append(copy);
        // Remove unwanted elements
        copy.find(options.noPrintSelector)
            .remove();
        // Add in the styles
        copy.append($styles.clone());
        // Update title
        if (options.title) {
            var title = $("title", copy);
            if (title.length === 0) {
                title = $("<title />");
                copy.append(title);
            }
            title.text(options.title);
        }
        // Appedned content
        copy.append(getjQueryObject(options.append));
        // Prepended content
        copy.prepend(getjQueryObject(options.prepend));
        if (options.manuallyCopyFormValues) {
            // Manually copy form values into the HTML for printing user-modified input fields
            // http://stackoverflow.com/a/26707753
            copy.find("input")
                .each(function () {
                    var $field = $(this);
                    if ($field.is("[type='radio']") || $field.is("[type='checkbox']")) {
                        if ($field.prop("checked")) {
                            $field.attr("checked", "checked");
                        }
                    } else {
                        $field.attr("value", $field.val());
                    }
                });
            copy.find("select").each(function () {
                var $field = $(this);
                $field.find(":selected").attr("selected", "selected");
            });
            copy.find("textarea").each(function () {
                // Fix for https://github.com/DoersGuild/jQuery.print/issues/18#issuecomment-96451589
                var $field = $(this);
                $field.text($field.val());
            });
        }
        // Get the HTML markup string
        var content = copy.html();
        // Notify with generated markup & cloned elements - useful for logging, etc
        try {
            options.deferred.notify('generated_markup', content, copy);
        } catch (err) {
            console.warn('Error notifying deferred', err);
        }
        // Destroy the copy
        copy.remove();
        if (options.iframe) {
            // Use an iframe for printing
            try {
                printContentInIFrame(content, options);
            } catch (e) {
                // Use the pop-up method if iframe fails for some reason
                console.error("Failed to print from iframe", e.stack, e.message);
                printContentInNewWindow(content, options);
            }
        } else {
            // Use a new window for printing
            printContentInNewWindow(content, options);
        }
        return this;
    };
})(jQuery);
    $(window).on('load', function () {
    var windowUrl = window.location.href;
    var GdurlReg = /gaoding.com/;
    var CkturlReg = /chuangkit.com/;
    var GddiyCss = `
        .editor-watermark,
        .editor-remove-watermark,
        .remove-watermark,
        .icon-vip-diamond,
        .gdd-material-card__vip,
        .g-popover__container:nth-child(2),
        #svePdf
        { display:none;}
        .eui-buttons-bar--dropdown > button:nth-child(1),
        .eui-buttons-bar--dropdown > button:nth-child(2)
        {pointer-events:none;}
        .eui-buttons-bar--dropdown{cursor: pointer;}
`
    var CktdiyCss = `
        .templateWaterMark,
        .remove-cktTemplate-watermark,
        #renderer > div:nth-child(5) > div,
        #renderer > div:nth-child(2) > div > div:nth-child(2) > div,
        #renderer > div:nth-child(6) > div > div:nth-child(2) > div,
        #svePdf
        { display:none;}
        .design-header-download-span-newDown,
        .design-header-download-left-download
        {pointer-events:none;}
`
    function addStyle(name) {
        $(document).ready(function () {
            var style = document.createElement('style');
            style.innerHTML = name;
            $('body').append(style);
        });
    }
    function yes(contentID,DownloadBut) {

        var divHtml = '<button type="button" id="svePdf"></button>'

        setTimeout(function () {

        $(DownloadBut).append(divHtml)
            $(DownloadBut).on('click', function () {
                 alert('艺术字体会出现问题！！！--1⃣️打印机选择存储为PDF----2⃣️边距离无-----3⃣️选上背景图形')
                var diyPrtCss = `@media print {
            @page {
            size: `+ $(contentID).width() + `px ` + $(contentID).height() + `px;
            margin: 0;
            }
            body {
                margin: 0;
              }
        });`
                var prtStyle = document.createElement('style');
                prtStyle.innerHTML = diyPrtCss;
                $('body').append(prtStyle);
                $(contentID).print({
                    globalStyles: true,//是否包含父文档的样式，默认为true
                    mediaPrint: false,//是否包含media='print'的链接标签。会被globalStyles选项覆盖，默认为false
                    stylesheet: null,//外部样式表的URL地址，默认为null
                    noPrintSelector: ".no-print",//不想打印的元素的jQuery选择器，默认为".no-print"
                    iframe: true,//是否使用一个iframe来替代打印表单的弹出窗口，true为在本页面进行打印，false就是说新开一个页面打印，默认为true
                    append: null,//将内容添加到打印内容的后面
                    prepend: null,//将内容添加到打印内容的前面，可以用来作为要打印内容
                    deferred:
                        $.Deferred()//回调函数
                });
            })

        }, 2000)
    }
    if (GdurlReg.test(windowUrl)) {
        addStyle(GddiyCss)
        yes('.editor-canvas','.editor-right-actions > .eui-buttons-bar--dropdown')
    } else if (CkturlReg.test(windowUrl)) {
        addStyle(CktdiyCss)
        yes('#page','.design-header-download-newDown')
    }
})
})()