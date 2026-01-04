// ==UserScript==
// @name         天翼云盘大文件直接下载，启用分享功能
// @namespace    https://greasyfork.org/zh-CN/users/4330
// @version      0.3
// @description  处理大于50M的文件需要客户端下载的问题
// @author       x2009again
// @match        http*://cloud.189.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423948/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E5%A4%A7%E6%96%87%E4%BB%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%EF%BC%8C%E5%90%AF%E7%94%A8%E5%88%86%E4%BA%AB%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/423948/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E5%A4%A7%E6%96%87%E4%BB%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%EF%BC%8C%E5%90%AF%E7%94%A8%E5%88%86%E4%BA%AB%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.responseURL.indexOf("listFiles.action")>-1&&this.readyState==3)
                {
                    if(window.location.href=="https://cloud.189.cn/main.action"||window.location.href=="https://cloud.189.cn/main.action#home"){
                        console.log("主页")
                        mainView.fileListTabObj[mainView.options.fileId].fileListView.filePreview.downloadFile=function (model, downloadType) {
                            var that = this,
                                opts = that.mainView.options;
                            that.isSecurity = '' != opts.isSecurity && 'undefined' != typeof opts.isSecurity && opts.isSecurity;
                            var models;
                            if (void 0 === model || null == model) {
                                var fileList = that.mainView.fileList || that.mainView.fileListTabObj[that.mainView.options.fileId].fileList;
                                models = fileList.selected()
                            } else models = [
                                model
                            ];
                            if (0 != models.length) if (1 == models.length) if (models[0].get('isFolder')) that.isSecurity ? that.downloadPackage(models[0].get('fileId'), downloadType) : that.downloadPackageByClient(models);
                                else {
                                    var firstFileSize = models[0].attributes.firstFileSize || 0;
                                    if (!that.isSecurity || firstFileSize <= 52428800) {
                                        if (models[0].get('downloadUrl')) {
                                            var downloadIframe = document.createElement('iframe');
                                            downloadIframe.src = models[0].get('downloadUrl'),
                                                downloadIframe.style.display = 'none',
                                                document.body.appendChild(downloadIframe)
                                        }
                                    } else that.downloadPackageByClient(models)
                                } else {
                                    var fileList = that.mainView.fileList || that.mainView.fileListTabObj[that.mainView.options.fileId].fileList,
                                        fileIds = fileList.getFileIdList(models);
                                    that.isSecurity ? that.downloadPackage(fileIds, downloadType) : that.downloadPackageByClient(models)
                                }
                        }
                    }
                    else
                    {
                        console.log("非主页")
                        mainView.options.isSecurity=true;
                    }
                    mainView.showButtonGroupHandle=function (buttonGroup, selectedLength) {
                        var that = this,
                            hasFileLength = that.fileListTabObj[that.options.fileId].fileList.hasFile().length,
                            hasFolderLength = that.fileListTabObj[that.options.fileId].fileList.hasFolder().length;
                        $(buttonGroup.allAction).removeClass('disable');
                        0 == selectedLength ? ($(buttonGroup.optionWrap).hide(), $(buttonGroup.allAction).addClass('disable')) : 0 == hasFolderLength ? (1 == hasFileLength ? ($(buttonGroup.singleFile).removeClass('disable'), 1 == that.fileListTabObj[that.options.fileId].fileList.isDoc().length && $(buttonGroup.singleDoc).removeClass('disable'), '' != that.options.keyword && $(buttonGroup.singleSearchFile).removeClass('disable')) : $(buttonGroup.multiFiles).removeClass('disable'), selectedLength == that.fileListTabObj[that.options.fileId].fileList.isPhoto().length && $(buttonGroup.multiPhoto).removeClass('disable')) : 0 == hasFileLength ? 1 == hasFolderLength ? $(buttonGroup.singleFolder).removeClass('disable') : $(buttonGroup.multiFolder).removeClass('disable') : $(buttonGroup.mixedAction).removeClass('disable')
                    }
                }
                else if(window.location.href.indexOf("https://cloud.189.cn/t/")==0&& this.responseURL.indexOf("getWebImUrl.action")>-1&&this.readyState==3){
                    window.fileSize=200;
                    $(".btn-download").removeClass("disable");
                }

            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);


})();