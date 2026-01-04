// ==UserScript==
// @name         云班课脚本
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  1.可取消老师不可快进的视频,2.添加电脑下载文件，本来只能在手机上下载文件,3.优化，将下载按钮放至旁边，避免一起打开文件,4.优化文件下载功能
// @author       JackyMao
// @match        https://www.mosoteach.cn/web/index.php?c=res&m=index&clazz_course_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402719/%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/402719/%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var i=0;
    var row_video = document.getElementsByClassName("res-row-open-enable res-row preview  drag-res-row");
    var row_file = document.getElementsByClassName("res-row-open-enable res-row preview-file");
    //视频处理
    for (i=0;i<row_video.length;i++)
    {
        row_video[i].onclick= function(){video()};
    }
    function video(){
        var x = document.getElementsByTagName("video");
        x[0].controls=true;
        console.log(x[0]);
        var y = document.getElementsByClassName("mejs__controls");
        y[0].remove();
        console.log(y[0]);
    }
    //文件下载
    for (i=0;i<row_file.length;i++)
    {
        var file_path = row_file[i].getAttribute("data-href");
        var file_title = row_file[i].getElementsByClassName('res-name');
        console.log(file_path);
        var information = row_file[i].getElementsByClassName("create-box manual-order-hide-part");
        //新建一个节点
        var para = document.createElement("a");
        para.href=file_path;
        var node = document.createTextNode("下载"+file_title[0].title);
        para.append(node);
        //在父节点前添加一个超链接节点
        row_file[i].parentNode.insertBefore(para, row_file[i]);
        //information[0].appendChild(para);
    }

    // Your code here...
})();
