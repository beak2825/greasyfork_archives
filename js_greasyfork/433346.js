// ==UserScript==
// @name         北航课程中心下载助手
// @namespace    http://course.buaa.edu.cn/
// @version      0.1
// @description  北航course中心，课程资源下载
// @author       liucp
// @match        http://course.buaa.edu.cn/portal/site/*/page/*
// @match        http://course.buaa.edu.cn/portal/tool/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433346/%E5%8C%97%E8%88%AA%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433346/%E5%8C%97%E8%88%AA%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let iframe_id;
let iframe_contents;
let selected_link_num = 0;
let links_num = 0;

let selected_links = [];
let clipboard;
(function () {
    var frm = document.getElementsByTagName('iframe')[0];
    $(frm).load(function () {                             //  等iframe加载完毕
        main();
    });
})();

// 主程序
function main() {
    // 获取iframe id
    iframe_id = '#' + $("iframe")[0]["id"]
    iframe_contents = $(iframe_id).contents()
    console.log("main entered")
    if ($(".selectedTool").find('.menuTitle').html() == '资源') {
        console.log("资源页面 selected")
        // console.log(iframe_contents)

        // 添加下载复制按钮
        addButtons()
        selectBoxClicked()
    }
}

// 添加按钮，并设置事件监听
function addButtons() {
    console.log("addDownloadButton")

    let download_button_html = '<span><input id="download-button" type="button" value="下载选中" disabled="disabled" alt="download"></span>'
    let copy_clipboard_button_html = '<span><input id="copy-clipboard-button" type="button" value="复制选中链接至剪切板" disabled="disabled" alt="download"></span>'
    // $("#copy-button").after('<div class="navIntraToolLink viewNav"><span><input id="download-button" type="button" value="下载选中" disabled="disabled" alt="download"></span></div>')
    // 添加下载选中按钮，并绑定事件
    iframe_contents.find("#copy-button").after(download_button_html)
    iframe_contents.find("#download-button").on("click", function () {
        // 找到所有选中链接，并点击
        iframe_contents.find("[name='selectedMembers']").each(function (index, element) {
            if ($(this).prop("checked") == true) {
                let filename = $.trim($(this).parent().parent().find("a")[1].text)
                console.log("创建下载任务：" + filename)
                $(this).parent().parent().find("a")[1].click()
            }
        })
    })

    iframe_contents.find("#copy-button").after(copy_clipboard_button_html)

    iframe_contents.find("#copy-clipboard-button").on("click", function () {
        // 找到所有选中链接，并复制链接
        let urls = []
        let copy_contents = ""
        iframe_contents.find("[name='selectedMembers']").each(function (index, element) {
            if ($(this).prop("checked") == true) {
                let url = $.trim($(this).parent().parent().find("a")[1]["href"])
                urls.push(url)
            }
        })
        copy_contents = urls.join("\n")
        console.log(copy_contents)

        copyToClip(copy_contents)

    })
}

// 将文本复制到剪切板
function copyToClip(content, tips) {
    console.log("复制的内容", content, '复制成功后的提示文本', tips);
    let ele = document.createElement("input"); //创建一个input标签
    ele.setAttribute("value", content); // 设置改input的value值
    document.body.appendChild(ele); // 将input添加到body
    ele.select();  // 获取input的文本内容
    document.execCommand("copy"); // 执行copy指令
    document.body.removeChild(ele); // 删除input标签
    if (tips == null) { // 显示复制成功之后的提示文本
        alert('已将内容复制到剪切板')
    } else {
        alert(tips)
    }
}

function selectBoxClicked() {
    console.log("selectedBoxClicked")
    // 表格中的单选checkbox
    let links_num = iframe_contents.find("[name='selectedMembers']").length
    iframe_contents.find("[name='selectedMembers']").each(function (index, element) {
        $(this).click(function () {
            // 判断点击情况
            if ($(this).prop("checked") == true) {
                selected_link_num += 1
            }
            if ($(this).prop("checked") == false && selected_link_num != 0) {
                selected_link_num -= 1
            }
            // 依据选中情况，更新下载和复制按钮的状态
            if (selected_link_num != 0) {
                iframe_contents.find("#download-button").prop("disabled", "")
                iframe_contents.find("#copy-clipboard-button").prop("disabled", "")
            }
            if (selected_link_num == 0) {
                iframe_contents.find("#download-button").prop("disabled", "disabled")
                iframe_contents.find("#copy-clipboard-button").prop("disabled", "disabled")
            }
            console.log("selected links: " + selected_link_num)

        })
    })
    // 表格中的全选checkbox
    iframe_contents.find("#selectall").click(function () {
        // 判断点击情况
        if ($(this).prop("checked") == true) {
            selected_link_num = links_num
        }
        if ($(this).prop("checked") == false && selected_link_num != 0) {
            selected_link_num = 0
        }
        // 依据选中情况，更新下载和复制按钮的状态
        if (selected_link_num != 0) {
            iframe_contents.find("#download-button").prop("disabled", "")
            iframe_contents.find("#copy-clipboard-button").prop("disabled", "")
        }
        if (selected_link_num == 0) {
            iframe_contents.find("#download-button").prop("disabled", "disabled")
            iframe_contents.find("#copy-clipboard-button").prop("disabled", "disabled")
        }
        console.log("selected links: " + selected_link_num)

    })

    console.log("total links: " + links_num)
}