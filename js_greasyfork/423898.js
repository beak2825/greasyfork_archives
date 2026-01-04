// ==UserScript==
// @name         天翼云盘跳过客户端下载文件
// @icon         http://cloud.189.cn/logo.ico
// @version      0.2
// @namespace    http://astwy.com
// @description  跳过客户端,直接下载文件
// @author       艾斯托维亚
// @include      *//cloud.189.cn/*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423898/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E8%B7%B3%E8%BF%87%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423898/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E8%B7%B3%E8%BF%87%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.onload = hfxz;
})();

function hfxz()
{
    console.log(1);
    var url = window.location.href;
    var match = url.match(/cloud\.189\.cn\/t\/([0-9a-z]+)/i);
    var shortCode= match ? match[1] : null;
    if (url.indexOf("cloud.189.cn/main") > 0 || url.indexOf("cloud.189.cn/photo") > 0) {
        if ($("#J_Create").length)
        {
            $("#J_Create").after('<a class="btn btn-show-link" style="background: #2b89ea; color: #fff; cursor: pointer">显示链接</a>');
        }
        else if ($(".JC_Refresh").length) {
            $(".JC_Refresh").after('<a class="btn btn-show-link" style="background: #2b89ea; color: #fff; cursor: pointer">显示链接</a>');
        }
        else {}
    }
    else if(url.indexOf("cloud.189.cn/t") > 0){
            if("undefined" != typeof _shareId){
                if ($("#J_SaveAs").length)
                {
                    $("#J_SaveAs").after('<a class="btn btn-show-link" style="background: #2b89ea; color: #fff; cursor: pointer">显示链接</a>');
                    $(".btn-show-link").on("click", showDownload);
                }
                else if ($(".JC_Refresh").length) {
                    $(".JC_Refresh").after('<a class="btn btn-show-link" style="background: #2b89ea; color: #fff; cursor: pointer">显示链接</a>');
                }
                else {}
            }
        else{
            for(var t=document.getElementsByTagName("a"),e=0;e<t.length;e++){"btn btn-download download-link disable"===t[e].getAttribute("class")&&t[e].setAttribute("class","btn btn-download download-link")}
            console.log("恢复单文件下载按钮");
        }
    }
    else{}
};
function getSelectedFileList () {
            var mainView = null, fileList = [];
            if (unsafeWindow.fileId) {
                fileList = [
                    {
                        attributes: unsafeWindow
                    }
                ];
            }
            else if (unsafeWindow._shareId) {
                mainView = unsafeWindow.appRouter.mainView;
                if (mainView instanceof Object && mainView.fileList) {
                    fileList = mainView.fileList;
                    if (fileList.selected().length) {
                        fileList = fileList.selected();
                    }
                }
                //obj.processFileList(fileList, unsafeWindow._shareId);
            }
            else if (unsafeWindow.mainView) {
                mainView = unsafeWindow.mainView;
                if (mainView.fileListTabObj && mainView.fileListTabObj[mainView.options.fileId]) {
                    fileList = mainView.fileListTabObj[mainView.options.fileId].fileList.selected();
                }
                else if (mainView.getSelectedModels) {
                    fileList = mainView.getSelectedModels();
                }
            }

            var selectedFileList = [];
            fileList.forEach(function (item) {
                if (item.attributes.fileId > 0) {
                    selectedFileList.push(item);
                }
            });
            return selectedFileList;
        };

function getMetadata(){
    var url = window.location.href;
    var match = url.match(/cloud\.189\.cn\/t\/([0-9a-z]+)/i);
    var shortCode= match ? match[1] : null;
    var result;
    $.ajax({
        url: "https://cloud.189.cn/v2/listShareDirByShareIdAndFileId.action?shortCode=" + shortCode + "&accessCode="+getCookie("shareId_"+_shareId)+"&verifyCode="+_verifyCode+"&orderBy=1&order=ASC&pageNum=1&pageSize=60",
        type: "get",
        dateType: "json",
        async:false,
        success: function (data) {
            result=data;
            //console.log(_shareId);
        },
        error: function () {
        }
    });
    return result;
}

function buildFolderDownUrl(fileId){
    var sessionKey=getCookie("validCodeTimestamp");
    var result="https://cloud.189.cn/downloadMultiFiles.action?sessionKey="+sessionKey+"&fileIdS="+fileId+"&downloadType=3&shareId="+_shareId;
    return result;
}

function getFileDownUrl(fileId,subFileId){
    var result="";
    var s_url = window.location.href;
    var match = s_url.match(/cloud\.189\.cn\/t\/([0-9a-z]+)/i);
    var shortCode= match ? match[1] : null;
    $.ajax({
        url: "https://cloud.189.cn/v2/getFileDownloadUrl.action?shortCode="+shortCode+"&fileId="+subFileId+"&accessCode="+getCookie("shareId_"+_shareId)+"&subFileId="+fileId+"&noCache=0.1",
        type: "get",
        dateType: "text",
        async:false,
        success: function (data) {
            //console.log(data);
            result= data;
        },
        error: function (data) {
            console.log(666);
        }
    });
    return result;
}

function showDownload () {
    var sels=getSelectedFileList ();
    showDownloadPage();
    var html = '<div style="padding: 20px; height: 410px; overflow-y: auto;">';
    var rowStyle = "margin:10px 0px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;";

    var tmp=getMetadata();
    if (tmp.path) {
        html += '<p>压缩包</p>';
        html += '<p style="' + rowStyle + '"><a title="' + tmp.path[0].fileName + '-打包下载.zip" href="' + buildFolderDownUrl(tmp.path[0].fileId) + '&fileName=打包下载.zip" style="color: blue;">' + tmp.path[0].fileName + '-打包下载.zip</a></p>';
        html += '<p>&nbsp;</p>';
    }

    sels.forEach(function (item, index) {
        var file=item.attributes;
        if(file.isFolder){
            var f_downloadUrl = buildFolderDownUrl(file.fileId)+'&fileName=打包下载.zip';
            html += '<p>' + (++index) + '：' + (file.fileName ? file.fileName : file.fileId) + '打包下载</p>';
            html += '<p style="' + rowStyle + '"><a title="' + f_downloadUrl + '" href="' + f_downloadUrl + '" style="color: blue;">' + f_downloadUrl + '</a></p>';
        }
        else{
            var s_downloadUrl = "https:"+getFileDownUrl(file.fileId,file.parentId)+'&fileName='+file.fileName;
            html += '<p>' + (++index) + '：' + (file.fileName ? file.fileName : file.fileId) +' '+file.fileSize+ '</p>';
            html += '<p style="' + rowStyle + '"><a title="' + s_downloadUrl + '" href="' + s_downloadUrl + '" style="color: blue;">' + s_downloadUrl + '</a></p>';
        }
    });

    html += '<div>';
    $("#J_FileModal .modal-body").html(html);
    $("#J_FileModal").show();
}

function showDownloadPage() {
            var template = '<div id="J_FileModal" class="treeBox-modal modal in" style="display:block"><div class="modal-dialog"><div class="modal-header"><a class="close">×</a><h3>文件下载</h3></div><h3>点击蓝色的链接或右键另存为即可下载，文件夹打包下载必须点击跳转进行下载</h3><div class="modal-body"></div></div></div>';
            if ($("#J_FileModal").length == 0) {
                $("body").append(template);
                $("#J_FileModal .close").on("click", function () {
                    $("#J_FileModal").hide();
                });
            }
        }

function jsdx(num){
}

function getCookie(name){
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name){
            return arr[1];
        }
    }
    return "";
}