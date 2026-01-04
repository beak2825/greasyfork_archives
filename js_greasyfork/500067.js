// ==UserScript==
// @name         少前百科 GFWiki 战术人形骨骼数据打包下载
// @namespace    https://github.com/Blue-Roar/gfwiki-spine-packer
// @version      1.2
// @description  打包下载少前百科 GFWiki / IOP Wiki 上的战术人形骨骼数据
// @author       BrightSu
// @license      mit
// @match        *://gfwiki.org/*
// @match        *://iopwiki.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iopwiki.com
// @grant        none
// @run-at       document-idle
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.2.2/jszip.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/1.3.8/FileSaver.min.js
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/500067/%E5%B0%91%E5%89%8D%E7%99%BE%E7%A7%91%20GFWiki%20%E6%88%98%E6%9C%AF%E4%BA%BA%E5%BD%A2%E9%AA%A8%E9%AA%BC%E6%95%B0%E6%8D%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/500067/%E5%B0%91%E5%89%8D%E7%99%BE%E7%A7%91%20GFWiki%20%E6%88%98%E6%9C%AF%E4%BA%BA%E5%BD%A2%E9%AA%A8%E9%AA%BC%E6%95%B0%E6%8D%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 引用必要的库
$('head').append('<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js" crossorigin="anonymous"></script>');
$('head').append('<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.2.2/jszip.min.js" type="application/javascript" crossorigin="anonymous"></script>');
$('head').append('<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip-utils/0.1.0/jszip-utils.min.js" type="application/javascript" crossorigin="anonymous"></script>');
$('head').append('<script src="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/1.3.8/FileSaver.min.js" type="application/javascript" crossorigin="anonymous"></script>');

var attachTimer = setTimeout("appendButton()", 1000);
appendButton();
function appendButton() {
    console.log('等待页面加载...');
    attachTimer = setTimeout("appendButton()", 1000);
    if ($('#packSpine').length>0) {
        clearTimeout(attachTimer);
        console.log('已附加下载按钮');
    } else {
        if (window.location.host == "iopwiki.com") {
            if ($('.gf-droplist.chibi-costume-switcher').length>0) {
                $('.gf-droplist.chibi-costume-switcher').after('<button id="packSpine" onclick="packSpine()" style="width:135px;height:24px;background-color:#222;color:#eaeaea;border-radius:5px;cursor:pointer;">下载当前皮肤</button>');
            } else {
                $('#p-tb-list').append('<li id="packSpine"><a href="javascript:packSpinePromt()">下载皮肤...</a></li>');
            }
        }
        if (window.location.host == "gfwiki.org") {
            if ($('.gf-droplist.chibi-costume-switcher').length>0) {
                $('.chibiAnimationSelect.chibiButton').after('<button id="packSpine" onclick="packSpine()" style="width:135px;height:24px;background-color:#222;color:#eaeaea;border-radius:5px;cursor:pointer;">下载当前皮肤</button>');
            } else {
                $('#MSToolbox').append('<li id="packSpine" class="mw-list-item"><a href="javascript:packSpinePromt()"><span>下载皮肤...</span></a></li>');
            }
        }
    }
}

function packSpinePromt() {
    let tdollId = prompt("请输入战术人形ID，注意区分大小写：", "");
    let tdollCostume = prompt("请输入战术人形皮肤编号，以下划线开始：", "");
    if (tdollId != null) {
        packSpine(tdollId, tdollCostume);
    } else {
        alert("已取消");
    }
}

var filesLoaded = false;
function getChibiFiles(costumeId) {
    let cpp = window.gfUtils.createWikiPathPart;
    let tryFiles = [
        (costumeId + "_chibi_spritemap.png"),
        (costumeId + "_chibi_skel.skel"),
        (costumeId + "_chibi_atlas.txt"),
        (costumeId + "_chibi_dorm_spritemap.png"),
        (costumeId + "_chibi_dorm_skel.skel"),
        (costumeId + "_chibi_dorm_atlas.txt")
    ];
    let files = [];
    filesLoaded = false;
    for (let i=tryFiles.length-1;i>=0;i--) {
        let fileName = tryFiles[i];
        let fileUrl = '/images/' + cpp(fileName) + fileName;
        $.ajax({
            url:fileUrl,
            type:'HEAD',
            success: function() {
                files.push(fileName);
            },
            complete: function() {
                if (i == tryFiles.length-1) {
                    filesLoaded = true;
                }
            }
        });
    }
    return files;
}

function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function packSpine(tdollId = null, tdollCostume = null) {
    if (window.location.host == "iopwiki.com") {
        if (tdollId==null) tdollId = $('#enemyChibiAnimation').attr('data-tdoll-id');
        if (tdollCostume==null) tdollCostume = $('#enemyChibiAnimation').attr('data-tdoll-costume');
    } else if (window.location.host == "gfwiki.org") {
        if (tdollId==null) tdollId = $('#TDollChibiAnimation').attr('data-tdoll-id');
        if (tdollCostume==null) tdollCostume = $('#TDollChibiAnimation').attr('data-tdoll-costume');
    }
    if (!tdollId) tdollId = "";
    if (!tdollCostume) tdollCostume = "";

    if (tdollId) {
        let cpp = window.gfUtils.createWikiPathPart;
        let costumeId = tdollId+tdollCostume;
        let files = getChibiFiles(costumeId);
        
        // “异步”（然而并没能实现）
        // 总之是为了检查文件列表是否获取完毕
        let checkTimer = setTimeout(function() {
            if (filesLoaded) {
                if (files.length >= 3) {
                    clearTimeout(checkTimer);
                    console.log("文件：",files);
                    let zip = new JSZip();
                    let spine = zip.folder(costumeId);
                    
                    $.each(files, function(index, value) {
                        let fileName = value; //files[index];
                        let fileUrl = '/images/' + cpp(fileName) + fileName;
                        fileName = fileName.replace('_chibi','');
                        fileName = fileName.replace('_spritemap.png','.png');
                        fileName = fileName.replace('_skel.skel','.skel');
                        fileName = fileName.replace('_atlas.txt','.atlas');
                        if (fileName.includes('_dorm')) {
                            fileName = fileName.replace('_dorm','');
                            fileName = 'R'+fileName;
                        }
                        costumeId = costumeId;
                        fileName = fileName;
                        let fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
                        if (fileExtension == "atlas") {
                            var promise = $.get(fileUrl);
                            spine.file(fileName, promise, {compression: "DEFLATE", compressionOptions: {level: 9}});
                        } else {
                            spine.file(fileName, urlToPromise(fileUrl), {binary:true});
                        }
                    });
                    
                    if (window.location.host == "iopwiki.com") zip.file("注意.txt", "IOP Wiki 的战术人形数据文件名与原始文件名往往不一致，并且此脚本当前并不支持修改。请手动查看"+costumeId+".atlas内的具体ID并修改文件名", {compression: "DEFLATE", compressionOptions: {level: 9}});
    
                    zip.generateAsync({type:"blob", compression: "DEFLATE", compressionOptions: {level: 9}}).then(function(content) {
                        saveAs(content, costumeId + ".zip");
                    });
                } else if (files.length > 0) {
                    alert("下载失败：数据文件不完整。\n请检查网络连接状态以及战术人形名称与皮肤ID ("+costumeId+")");
                } else {
                    alert("下载失败：无返回结果。\n请检查战术人形名称与皮肤ID ("+costumeId+")");
                }
            }
        }, 1000);
    } else {
        alert("战术人形名称不能为空");
    }
}