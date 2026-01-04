// ==UserScript==
// @name          深学苑直链
// @namespace  http://tampermonkey.net/
// @version         0.4
// @description  解析深学苑网站的文件（视频、PPT）下载链接。使用方法：修改代码中的 local_directory 变量，指向你的视频存储文件夹。下载的视频直接（不要重命名）放到 local_directory 文件夹中，然后在网页点击“本地播放”就可以拉起 potplayer 播放器来播放该文件了。
// @author         沧沧沧沧音
// @match          https://college.atrust.sangfor.com:8555/my/course/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=sangfor.com
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/447239/%E6%B7%B1%E5%AD%A6%E8%8B%91%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/447239/%E6%B7%B1%E5%AD%A6%E8%8B%91%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在这个变量指明本地目录，使用纯英文路径
    var local_directory = "M:/Downloads/sangfor-video-cache";

    var e_task_list = $("section.es-section ul.task-list");
    var ajax_list = [];
    var l = [];

    // 在页面下方添加div
    var div = $("<div style='border: 1px solid gray;'>");
    var ul = $("<ul>");
    e_task_list.parent().append(div);
    div.append(ul);

    // 收集所有标题及其链接
    e_task_list.find("li.task-content>a").each((i,e_task)=>{
        var title = e_task.text.trim();
        var _url = e_task.getAttribute("href");
        var iframe_url = document.location.origin + _url.slice(0, _url.lastIndexOf('/') + 1) + "activity_show?pullRule=1";

        l[i] = []; // empty placeholder

        // get first level iframe content
        ajax_list.push( $.ajax({
            url: iframe_url,
            type: "GET",
            success: (function (_data){
                var [i, e_task, iframe_url] = this;
                var data = $(_data);
                var e_video = data.find("div#lesson-video-content").addBack("div#lesson-video-content");
                var e_ppt = data.find("iframe#activity-ppt-content").addBack("iframe#activity-ppt-content");

                // 如果是视频
                if (e_video.length == 1){
                    var file_url = e_video.attr("data-url");
                    if ( file_url == undefined )
                        file_url = "";
                    var filename = file_url.split("?")[0];
                    filename = filename.slice(filename.lastIndexOf("/") + 1);

                    l[i] = [e_task, file_url, filename];
                    // 添加 “本地播放” 链接
                    $(e_task).parent().find("span.right-menu").append("<a href='potplayer://" + local_directory + "/" + filename + "'>本地播放</a>")

                // 如果是PPT
                }else if (e_ppt.length == 1){
                    var preview_url = decode_base64_in_url_param( decode_base64_in_url_param (e_ppt.attr("src"), "hash"), "callURL");
                    ajax_list.push( $.ajax({
                        url: preview_url,
                        type: "GET",
                        success: (function (data){
                            var [i, e_task] = this;
                            var file_url = data.doc.fetchUrl;
                            var filename = data.doc.title;

                            l[i] = [e_task, file_url, filename];
                            // 添加 “本地打开” 链接
                            // $(e_task).parent().find("span.right-menu").append("<a href='ms-powerpoint://" + local_directory + "/" + filename + "'>本地打开</a>")
                        }).bind([i, e_task])
                    }));

                }else{
                    console.log("Error ! Unrecognized page type!", iframe_url);
                }
            }).bind([i, e_task, iframe_url])
        }) );
    })

    Promise.all(ajax_list).then(() =>{
        Promise.all(ajax_list).then(() => {
            var text = "";

            for (var [e_task, file_url, filename] of l) {
                if ( e_task == undefined )
                    continue;

                var title = e_task.text.trim();
                text += title + '\t' + file_url + "\n";

                // 添加下载链接
                if (file_url.indexOf("/player/") != -1)
                    ul.append("<li><a style='background-color: yellow;' href='" + file_url + "'>" + title + "</a></li>")
                else
                    ul.append("<li><a href='" + file_url + "'>" + title + "</a></li>")
            }

            // 存为文件 | 复制到剪贴板
            var span = $("<span>");
            div.append(span);

            var e = $("<a>将链接存为文件</a>");
            e.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            e.attr('download', $("span.course-detail-heading")[0].childNodes[0].textContent.trim());
            span.append(e);

            e = $("<a href='' style='margin-left: 10px;' >将链接复制到剪贴板</a>");
            e.click(()=>{
                copyTextToClipboard(text);
                alert("链接列表已经复制到剪贴板！");
                return false;
            });
            span.append(e);
        })
    }); // end Promise.all

})();

function decode_base64_in_url_param (url_text, key_of_encoded_param){
    if(url_text.indexOf("?") != -1)
        url_text = url_text.split("?")[1]
    return atob(new URLSearchParams(url_text).get(key_of_encoded_param));
}
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}
