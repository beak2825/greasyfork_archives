// ==UserScript==
// @name         北航课程中心添加下载文件按钮
// @namespace    BUAA_Ofyue
// @version      0.4
// @description  在北航课程中心资源列表，选中资源后即可下载选中资源!欢迎关注“怎么可能”VX公众号，我们带你上天入地！
// @author       Ofyue
// @include      https://course.e2.buaa.edu.cn/portal/site/*
// @include      https://course.e1.buaa.edu.cn/portal/site/*
// @include      https://course.buaa.edu.cn/portal/site/*
// @include      http://course.e2.buaa.edu.cn/portal/site/*
// @include      http://course.e1.buaa.edu.cn/portal/site/*
// @include      http://course.buaa.edu.cn/portal/site/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396861/%E5%8C%97%E8%88%AA%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/396861/%E5%8C%97%E8%88%AA%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


function getElementByAttr(tag, attr, value,frame) {
    var aElements = frame.contentWindow.document.getElementsByTagName(tag);
    var aEle = [];
    for (var i = 0; i < aElements.length; i++) {
        if (aElements[i].getAttribute(attr) == value){
            aEle.push(aElements[i]);}
    }
    return aEle;
}

function selected_files(frame) {
    var aDiv = getElementByAttr('td', 'headers', 'checkboxes',frame);
    var files = [];
    for (var i = 1; i < aDiv.length; i++) {
        var checkbox = aDiv[i];
        if (checkbox.firstElementChild.checked) {
            var t = checkbox.nextElementSibling;
            var file_obj = t.querySelectorAll("h4 a")[1];
            var name = file_obj.innerText;
            file_obj.setAttribute("download", name);
            files.push(file_obj);
        }
    }
    return files;
}

function download_btn() {
    var frame = document.querySelector('.portletMainIframe');
    var copy_btn = frame.contentWindow.document.querySelectorAll("input#copy-button");
    if (copy_btn.length == 0) { return 0 };
    var need_add = frame.contentWindow.document.querySelectorAll("input#download-button").length;
    if (need_add) { return 0; }
    var btn = document.createElement("input");
    var btn_loc = copy_btn[0].parentElement.parentElement;
    btn_loc.appendChild(btn);
    btn.setAttribute("type", "button");
    btn.id = "download-button";
    btn.value = "下载选中文件";

    btn.addEventListener("click", function() {
        var files = selected_files(frame);
        if (files.length == 0) {
            alert("没有选中的文件！(文件夹不算)");
        } else {
            for (var i = 0; i < files.length; i++) {
                files[i].click();
            }
        }
    })
}


window.addEventListener("load",function(){
    setInterval(download_btn, 1000);
});

