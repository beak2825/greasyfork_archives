// ==UserScript==
// @name         掘金后台效率工具
// @namespace    https://juejin.im/
// @version      1.0.4
// @description  try to take over the world!
// @author       Glowin
// @match        http://admin.juejin.id/*
// @match        https://juejin.im/*
// @match        http://audit.juejin.id/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/387724/%E6%8E%98%E9%87%91%E5%90%8E%E5%8F%B0%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/387724/%E6%8E%98%E9%87%91%E5%90%8E%E5%8F%B0%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
'use strict';

GM_addStyle ( `
    .el-table__row:hover>td {background-color: #fff !important}
    .el-table .warning-row {background:#fdf5e6}
    .el-table .success-row {background:#f0f9eb}
    .el-table .success-row:hover>td {background:#f0f9eb !important}
    .done { font-size: 13px; font-weight: bold; color: red;}
    .aliyun, .normal { font-size: 13px; color: #8a9aa9;}
` );

function goBottom() {
    let selected = document.querySelector(".success-row");
    selected !== null ? selected.classList.remove("success-row") : null;
    let _tb = document.querySelector(".el-table__body");
    let _main = document.querySelector(".main-content");
    let _latest = document.querySelector(".el-table__row:last-child");
    _latest.focus();
    _latest.classList.add("success-row");
    foldComment(_latest, "open");
    _main.scrollTo(0, _tb.offsetHeight);
}

function goTo(u) {
    let selected = document.querySelector(".success-row");
    if (selected === null) {
        selected = document.querySelector(".el-table__row:first-child");
        selected.classList.add("success-row");
        foldComment(selected, "open");
        return
    }

    let next;
    if(u === "up") {
        next = selected.previousSibling;
    } else if( u === "down") {
        next = getNextSibling(selected, ".el-table__row");
    }

    if(next === null) {
        next = selected;
        return
    }

    let _main = document.querySelector(".main-content");
    selected.classList.remove("success-row");
    next.classList.add("success-row");
    foldComment(selected, "close");
    sleep(100).then(() => {
        foldComment(next, "open");
    });

    _main.scrollTo(0, next.offsetTop);
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function navTo(u) {
    let selected = document.querySelector(".view .is-active");
    if (selected === null) {
        selected = document.querySelector(".view .el-tabs__item");
        selected.classList.add(".is-active");
        return
    }

    let next;
    if(u === "prev") {
        next = selected.previousSibling;
    } else if( u === "next") {
        next = selected.nextSibling;
    }

    if(next === null) {
        next = selected;
        return
    }

    let _main = document.querySelector(".main-content");
    next.click();
    _main.scrollTo(0, next.offsetTop);
}

function foldComment(node, status) {
    let commentNode = node.querySelector(".el-table__expand-icon");
    if(commentNode === null) return

    if(status === "open" && !commentNode.classList.contains("el-table__expand-icon--expanded")) {
        commentNode.click();
    } else if(status === "close" && commentNode.classList.contains("el-table__expand-icon--expanded")) {
        commentNode.click();
    }
}

function getNextSibling(elem, selector) {

	// Get the next sibling element
	var sibling = elem.nextElementSibling;

	// If there's no selector, return the first sibling
	if (!selector) return sibling;

	// If the sibling matches our selector, use it
	// If not, jump to the next sibling and continue the loop
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling
	}

};

function openLink() {
    let selected = document.querySelector(".success-row");
    let href = selected.querySelector("a").href;
    window.open(href);
}

function action(a) {
    let selected = document.querySelector(".success-row");
    let actionBtn;

    if(a === "publish") {
        actionBtn = selected.querySelector(".primary");
    } else if(a === "mute") {
        actionBtn = selected.querySelector(".ctrl-box .el-button:first-child");
    } else if(a === "edit") {
        actionBtn = selected.querySelector(".ctrl-box .el-button:last-child");
    } else if(a === "reset") {
        actionBtn = document.querySelector(".success-row .reset-btn");
    }

    actionBtn.click();
}

// 后台快捷键绑定事件
document.addEventListener('keydown', function (e) {
    if ( document.activeElement.tagName === "INPUT" ) return

    if (e.key === 'G') {
        goBottom()
    } else if (e.key === 'j') {
        goTo("down")
    } else if (e.key === 'k') {
        goTo("up")
    } else if (e.key === 'h') {
        navTo("prev")
    } else if (e.key === 'l') {
        navTo("next")
    } else if (e.key === 'v') {
        openLink()
    } else if (e.key === 'y') {
        action("publish")
    } else if (e.key === 'n') {
        action("mute")
    } else if (e.key === 'e') {
        action("edit")
    } else if (e.key === 'r') {
        action("reset")
    }
});

// 提交垃圾评论功能
// 节点添加举报入口
document.addEventListener("mouseover", function(event) {
    let target = event.target;
    // 浮动到文章评论页面时，显示提交阿里云评论按钮
    if (target.querySelector(".delete") && !target.querySelector(".aliyun")) {
        target.querySelectorAll(".delete").forEach(edButton => {
            edButton.outerHTML += '<div class="time aliyun"> &nbsp;·&nbsp;阿里云评论</div><div class="time normal"> &nbsp;·&nbsp;正常评论</div>';
        });
    }
    // 浮动到 audit 后台页面时，显示提交阿里云评论按钮
    if (target.querySelector(".reason") && !target.querySelector(".aliyun") && !target.querySelector(".done") ) {
        target.querySelectorAll(".reason").forEach(edButton => {
            edButton.innerHTML += '<span class="time aliyun"> &nbsp;·&nbsp;阿里云评论</span>';
        });
    }
}, false);


document.addEventListener('click', function(event) {
    let target = event.target;
    // 如果点击的是「阿里云评论」按钮
    if (target.classList.contains("aliyun") || target.classList.contains("normal")) {
        let commentContent;
        if        (target.parentNode.parentNode.classList.contains("content-box")) {
            commentContent = target.parentNode.parentNode.querySelector(".content").innerText;    
        } else if (target.parentNode.classList.contains("reason")) { // audit 后台专用
            commentContent = target.parentNode.parentNode.querySelector(".text").innerText;
        }
        console.log(commentContent);
        // 去除换行符
        commentContent = commentContent.replace(/[\r\n]/g,"");
        
        let commentType;
        if (target.classList.contains("aliyun")) {
            commentType = "aliyun_ad";
        } else if (target.classList.contains("normal")) {
            commentType = "normal";
        }
        let edJson = `{
            "type":"TEXT_CLASSIFICATION",
            "dataset_id": 59189,
            "appendLabel": true,
            "entity_content":"${commentContent}",
            "entity_name": "532.txt",
            "labels": [{"label_name":"${commentType}"}]
        }`;

        // 提交阿里云评论内容到 easydl 训练集
        // console.log(edJson)
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://aip.baidubce.com/rpc/2.0/easydl/dataset/addentity?access_token=24.d5b6747a9f23ece0eb4851aecbfd0858.2592000.1587547017.282335-18114004",
            data: edJson,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
              if (response.responseText.indexOf("log") > -1) {
                target.outerHTML = '<div class="time done"> &nbsp;·&nbsp;提交成功！</div>';
              } else if (response.responseText.indexOf("error") > -1) {
                target.outerHTML = '<div class="time done"> &nbsp;·&nbsp;token 过期，请联系江昪更新</div>';
              }
            }
        });
    }
});

})();