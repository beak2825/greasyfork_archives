// ==UserScript==
// @name         gaodingWatermark
// @version      0.0.0.4
// @description  搞定|创客贴小助手。站内其它版本年久失修，佛系修复。点左上角“去除水印”然后自行截图或点击右上角下载(需手动开启)。
// @author       pythonk
// @icon         https://st-gdx.dancf.com/assets/20190910-143541-210a.png
// @icon         https://dynamic-image.bear20.com/640x267/uploadImages/2020/289/34/9DTKT3Y2XR06.jpg
// @match        *://*.gaoding.com/design?id=*
// @match        *://*.chuangkit.com/odyssey/design?*
// @match        *://*.chuangkit.com/design*
// @match        https://*.818ps.com/*
// @match        https://www.eqxiu.com/*
// @match        https://bigesj.com/*
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// 
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// 
// @run-at       document-idle
// @namespace    https://greasyfork.org/zh-CN/users/184803-sevensky
// @downloadURL https://update.greasyfork.org/scripts/441367/gaodingWatermark.user.js
// @updateURL https://update.greasyfork.org/scripts/441367/gaodingWatermark.meta.js
// ==/UserScript==
// @re quire      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js

/*
 * 
@run-at
定义脚本被注入的时刻。
与其他脚本处理程序相反， @run-at 定义了脚本想要运行的第一个可能时刻。这意味着可能会发生，使用 @require 标签的脚本可能会在文档加载后执行，导致获取所需脚本需要很长时间。无论如何，在给定注入时刻之后发生的所有 DOMNodeInserted 和 DOMContentLoaded 事件都被缓存并在注入时传递给脚本。
总共四种时刻
@run-at document-start 脚本将尽快注入。
@run-at document-body 如果 body 元素存在，脚本将被注入。
@run-at document-end 该脚本将在调度 DOMContentLoaded 事件时或之后注入。
@run-at document-idle 该脚本将在调度 DOMContentLoaded 事件后注入。如果没有给出@run-at 标签，这是默认值。
@run-at context-menu 如果在浏览器上下文菜单中单击该脚本（仅限基于 Chrome 的桌面浏览器），则会注入该脚本。注意：如果使用此值，所有@include和@exclude语句都将被忽略，但将来可能会更改。
*/


(function () {
  'use strict';
  let util = {
      getValue(name) { return GM_getValue(name); }, setValue(name, value) { GM_setValue(name, value); },
      include(str, arr) {
          str = str.replace(/[-_]/ig, '');
          for (let i = 0, l = arr.length; i < l; i++) {
              let val = arr[i];
              if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                  return true;
              }
          }
          return false;
      },

      addStyle(id, tag, css) {
          tag = tag || 'style';
          let doc = document, styleDom = doc.getElementById(id);
          if (styleDom) return;
          let style = doc.createElement(tag);
          style.rel = 'stylesheet';
          style.id = id;
          tag === 'style' ? style.innerHTML = css : style.href = css;
          doc.head.appendChild(style);
      }
  };
  
  let main = {
        initValue() {
            let value = [{
                name: 'zoom_links',
                value: false
            },{
                name: 'enable_pdfprint',
                value: true
            }];
            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },
        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                //alert('sd');
                let dom = `<div style="font-size: 1em;">
                <label class="instant-setting-label">PDF打印开关<input type="checkbox" id="S-2" ${util.getValue('enable_pdfprint') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                <label class="instant-setting-label">缩放悬浮按钮<input type="checkbox" id="S-1" ${util.getValue('zoom_links') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                </div>`;
                Swal.fire({
                    title: '设置',
                    html: dom,
                    showCloseButton: true,
                    confirmButtonText: '保存',
                    footer: '<div style="text-align: center;font-size: 1em;"><a href="https://greasyfork.org/scripts/441367-gaodingwatermark/code/gaodingWatermark.user.js">检查更新</a><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M445.956 138.812L240.916 493.9c-11.329 19.528-12.066 44.214 0 65.123 12.067 20.909 33.898 32.607 56.465 32.607h89.716v275.044c0 31.963 25.976 57.938 57.938 57.938h134.022c32.055 0 57.938-25.975 57.938-57.938V591.63h83.453c24.685 0 48.634-12.803 61.806-35.739 13.172-22.844 12.343-50.016 0-71.386l-199.42-345.693c-13.633-23.58-39.24-39.516-68.44-39.516-29.198 0-54.897 15.935-68.438 39.516z" fill="#d81e06"/></svg></div>',
                    customClass: {
                        popup: 'instant-popup',
                    },
                }).then((res) => {
                    if (res.isConfirmed) {
                        history.go(0);
                    }
                });

                document.getElementById('S-1').addEventListener('change', (e) => {
                    util.setValue('zoom_links', e.currentTarget.checked);
                });
                document.getElementById('S-2').addEventListener('change', (e) => {
                    util.setValue('enable_pdfprint', e.currentTarget.checked);
                });
              
            });
        },
        addPluginStyle() {
            let style = `
                .instant-popup { font-size: 14px !important; }
                .instant-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .instant-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                .instant-setting-checkbox { width: 16px;height: 16px; }
                .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                 @keyframes instantAnminate { from { opacity: 1; } 50% { opacity: 0.4 } to { opacity: 0.9; }}
                .link-instanted { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
                .link-instanted * { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('instant-style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('instant-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },
    
        init() {
            this.initValue();
            this.addPluginStyle();
            this.registerMenuCommand();
        }
  };
  main.init();
  console.log('gaoding去水印加载中')
  // 图片缩放按钮
  function addButton() {
      var div = `<div class="zoom-button"> <div class="zoom-icon">Zoom</div> </div>`
      $('body')[0].append($(div)[0]);
      $('.zoom-button').click(function () {
          changeImgSize(() => {
              console.log('100% 无水印。'); //图片渲染已阉掉 generate_img(); 
          })
      })
  }
   // 在下载之前将图片放到最大100%
  function changeImgSize(callback) {
      // $('.editor-bottom .eui-buttons-bar')[0].children[4].firstElementChild.innerText.indexOf('100%') !== -1;
      var childNode = $('.editor-bottom .eui-buttons-bar')[0].children[4] ;
      var isMax = childNode.firstElementChild.innerText.indexOf('100%') !== -1;
      if(!isMax) {
          childNode.click()
      }else
        childNode.click()
      // 放大之后 下载海报
      setTimeout(() => {
          callback( )
      }, 200)
  }

  // $(document).ready(function () {
      var style = document.createElement('style');
      style.innerHTML = ` 
        .zoom-button {position:fixed; right:5%; bottom:20%; width: 60px; height: 60px; transition: all 0.5s ease; background: #3d78e2e6;border-radius: 50%; z-index: 99999; }
        .zoom-icon {text-align:center; line-height: 60px; color: #fff; }
        `;
      $('body').append(style);
  // });

    document.addEventListener('DOMContentLoaded', () => {
      function removeTextWatermark() {
              let app_element = $('#app')[0]
              app_element.addEventListener("DOMNodeInserted", function (event) {
                  if(event.target.className === 'remove-watermark') {
                     $('.remove-watermark').remove() ; // 删除 "移除水印, 畅享高清模板" 文字
                    // 移除会员无风险 字样
                    document.querySelector("#app > div > div > div.eui-base-container > div.eui-header-container > div.eui-header-container__right > button.editor-header-button.editor-header-button-tip.gda-btn.gda-btn-text").remove();
                    // 移除开通vip div  
                    // document.querySelector("#udesk_container").nextSibling.remove() // 费时间放弃了
                  }
              }, false);
      };
      removeTextWatermark();
      if (  GM_getValue('zoom_links') ){
        addButton();
      }
    });
  
    var btn='<div style="width: 80px;height:30px;position:absolute;top:10px;left:13px;z-index: 99999;overflow: visible;">'+
        ' <button id="removeWatermark" style="background-color: rgb(34 84 244);width: 80px;height: 30px;color: white;">去除水印</button></div>';
    $("body").prepend(btn);
    $("button#removeWatermark").click(function(){
        var tit=document.title;
        if (/(稿定设计)/.test(tit)) {
             var gaoding="<style>.editor-watermark{position: static;z-index:-999}</style>"; $("body").prepend(gaoding); 
             $("div.remove-watermark").remove();
        }
        else if (/(图怪兽)/.test(tit)) {
            $("div").remove(".image-watermark");
        }else if (/(易企秀)/.test(tit)) {
            $("div.eqc-watermark").css("position",'static');
        }else if (/(创客贴)/.test(tit)) {
            // $("#center-panel > div.page-wrap > div > div.canvas.canvas_slot.canvas-slot-wrapper > div > div.canvas.water-mark")
            $("div[style*='ckt-watermark']").remove();
            $("div").remove(".templateWaterMark");
            $("div").remove(".water-mark");
          
        }else if (/(比格设计)/.test(tit)) {
            $("div.water").css("position",'static');
            $("div.tool-bar-container").remove();
        }
    });


// 搞定设计 || 创客贴 (屏蔽水印和会员小提示，下载PDF格式！！） 

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
            .templateWaterMark, .remove-cktTemplate-watermark,
            #renderer > div:nth-child(5) > div,
            #renderer > div:nth-child(2) > div > div:nth-child(2) > div,
            #renderer > div:nth-child(6) > div > div:nth-child(2) > div,
            #svePdf { display:none;}
            .design-header-download-span-newDown, .design-header-download-left-download { pointer-events:none; }
    `
        function addStyle(name) {
            $(document).ready(function () {
                var style = document.createElement('style');
                style.innerHTML = name;
                $('body').append(style);
            });
        }
      
        function yes(contentID,DownloadBut) {
            var divHtml = '<button type="button" id="svePdf">pdf</button>'
            setTimeout(function () {
                $(DownloadBut).append(divHtml)
                $(DownloadBut).on('click', function () {
                    alert('艺术字体打印失真！ --  1⃣️打印机选择存储为PDF----2⃣️边距离无-----3⃣️选上背景图形')
                  
                    var diyPrtCss = `@media print {
                                      @page {
                                      size: `+ $(contentID).width() + `px ` + $(contentID).height() + `px;
                                      margin: 0; }
                                      body { margin: 0; }
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
      
        if ( util.getValue('enable_pdfprint') ){
          if (GdurlReg.test(windowUrl)) {//搞定
              addStyle(GddiyCss)
              // 画布        document.querySelector(".editor-canvas")
              // 下载菜单    document.querySelector(".editor-right-actions > .editor-right-actions__dropdown") 
              yes('.editor-canvas','.editor-right-actions > .editor-right-actions__dropdown')
          }
          else if (CkturlReg.test(windowUrl)) { //创客贴
              addStyle(CktdiyCss)
              // 画布     document.querySelector("div.canvas.canvas_slot.canvas-slot-wrapper > div")
              // 下载菜单 document.querySelector(".design-header-download-newDown") 
              yes('#center-panel > div.page-wrap > div > div.canvas.canvas_slot.canvas-slot-wrapper > div','.design-header-download-newDown')
              // yes('#page','.design-header-download-newDown')
          }
        }
    })
  
})( jQuery );

(function () {    })();


/*

// 快速选择素材ID
;(function () {
  'use strict'

  document.addEventListener('DOMContentLoaded', () => {
    // 在素材详情页面 https://sucai.gaoding.com/material/33911264
    if (/gaoding.com\/material\/\d+/.test(window.location.href)) {
      const materialId = window.location.href.match(
        /gaoding.com\/material\/(\d+)/,
      )[1]
      
      //alt 按下 并点击素材图片
      document.querySelector('.gdd-material-detail').firstChild.addEventListener('click', (e) => {
        if (e.altKey) { 
          const avalon = window.open(
            `https://avalon.gaoding.com/c/content/materials/${materialId}`,
          )
        }
      })
    }

    // 其他页面
    document.addEventListener('click', function (e) {
      if (!e.altKey) {
        return
      }
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        const link = e.target.closest('a')
        if (link && /\/material\/\d+\b/.test(link.href)) {
          e.preventDefault()
          const materialId = link.href.match(/\b\d+\b/)[0]
          const avalon = window.open(
            `https://avalon.gaoding.com/c/content/materials/${materialId}`,
          )
        }
      }
    })
  }); 

  document.addEventListener('DOMContentLoaded', () => {
    const selectedIdContainer = document.createElement('div');
    selectedIdContainer.setAttribute('hidden', true);
    selectedIdContainer.style.cssText = `
        position: fixed;
        width: 363px;
        height: 286px;
        border: 1px solid rgb(204, 204, 204);
        z-index: 99999;
        top: 100px;
        left: 20px;
        background-color: rgb(238, 238, 238);
        resize: both;
        overflow: auto;
        padding: 10px;
        overflow-wrap: break-word;
        `
    document.body.appendChild(selectedIdContainer);

    document.addEventListener('dblclick', () => {
        selectedIdContainer.toggleAttribute('hidden');
    });

    const ids = new Set()

    document.addEventListener('click', function (e) {
      if (!e.shiftKey) {
        return
      }
      e.preventDefault();
      e.stopImmediatePropagation()
      if (window.location.host === 'www.gaoding.com') { // 稿定主站上的逻辑
        if (e.target.tagName === 'IMG') {
          const card = e.target.closest('.gdd-material-card__preview');
          if (card) {
            const link = card.nextElementSibling;
            debugger;
            
            if (link && /\/template\/\d+\b/.test(link.href)) {
              e.preventDefault()

              const id = link.href.match(/\b\d+\b/)[0]

              if (ids.has(id)) {
                // 删除
                ids.delete(id)
                card.selectIcon.remove()
              } else {
                // 添加
                ids.add(id)
                toggleSelect(card)
              }

              selectedIdContainer.innerHTML = [...ids].join(',')
            }
          }
        }

      } else if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') { // 稿定素材站逻辑
        const link = e.target.closest('a')
        if (link && /\/material\/\d+\b/.test(link.href)) {
          e.preventDefault()

          const id = link.href.match(/\b\d+\b/)[0]

          if (ids.has(id)) {
            // 删除
            ids.delete(id)
            link.selectIcon.remove()
          } else {
            // 添加
            ids.add(id)
            toggleSelect(link)
          }

          selectedIdContainer.innerHTML = [...ids].join(',')
        }
      }
    }, true);

    function toggleSelect(ele) {
      const selectIcon = document.createElement('div')
      selectIcon.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
        font-size: 120px;
        color: red;
        text-shadow: 1px 3px 2px #fff;
        pointer-events: none;
        z-index: 9;
        top: 0;
        left: 0;
        font-family: none;
    `
      selectIcon.innerHTML = '✓'
      ele.appendChild(selectIcon)
      ele.selectIcon = selectIcon
    }
  })
})();

*/




