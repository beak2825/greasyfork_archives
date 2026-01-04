// ==UserScript==
// @name         LK增强
// @namespace    https://www.lightnovel.cn/
// @namespace    https://www.lightnovel.us/
// @version      1.35
// @description  对LK添加一些评分按钮 页面自动刷新 上传本地/粘贴图片到图床(vim-cn) 分页 回帖跳转的动能
// @require      https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js
// @author       Hugo0
// @license      GPL-3.0
// @match        https://www.lightnovel.cn/*
// @match        https://www.lightnovel.us/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/401963/LK%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/401963/LK%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


GM_config.init({
    'id': 'LK_Enhense',
    'title': 'LK增强',
    'fields': {
        'ratelist': {
            'label': '评分列表(逗号分隔)',
            'type': 'textarea',
            'default': '1,2,3'
        },
        'reason': {
            'label': '评分理由',
            'type': 'text',
            'default': 'test'
        },
        'sendreasonpm': {
            'label': '提醒作者',
            'type': 'checkbox',
            'default': true
        },
        'refreshInterval': {
            'label': '定时刷新间隔/s(0为不刷新)',
            'type': 'int',
            'default': 10
        },
        'refreshonly': {
            'label': '只刷新水楼',
            'type': 'checkbox',
            'default': true
        },
        'numPostPerPage': {
            'label': '每页贴子数',
            'type': 'int',
            'default': 5
        },
        'hotKey': {
            'label': '翻页快捷键(←,→)(可跨页)',
            'type': 'checkbox',
            'default': true
        },
        'replayJump': {
            'label': '回复跳转到页面底部(关闭后会看不到底部自己的回复)',
            'type': 'checkbox',
            'default': true
        }
    },
    'css': '#LK_Enhense textarea { width: 100%; height: auto; }',
    'events':
    {
        'open': function(doc, win, menuFrame) {
            let config = this;
            doc.getElementById(config.id + '_saveBtn').textContent = "保存";
            doc.getElementById(config.id + '_closeBtn').textContent = "关闭";
            doc.getElementById(config.id + '_resetLink').textContent = "默认设置";
            menuFrame.style.cssText += "width: 50%; height: 50%; left: 25%; top: 25%";
        },
        "save": function() {
            let newrefreshInterval = GM_config.get('refreshInterval')*1000;
            scores = GM_config.get('ratelist').split(',').map(s => s.trim()).filter(s => s);
            reason = GM_config.get('reason');
            sendreasonpm = GM_config.get('sendreasonpm');
            refreshonly = GM_config.get('refreshonly');
            numPostPerPage = GM_config.get('numPostPerPage');
            hotKey = GM_config.get('hotKey');
            replayJump = GM_config.get('replayJump');
            title = document.querySelector("#thread_subject").textContent;
            refreshPage();
            if (refreshInterval != newrefreshInterval) {
                window.clearInterval(refreshId);
                refreshInterval = newrefreshInterval
                if (refreshId != 0 && (!refreshonly || title.includes("水楼"))) {
                    refreshId = window.setInterval(intervalRefresh, refreshInterval);
                }
            }
        }
    }
});

let scores = GM_config.get('ratelist').split(',').map(s => s.trim()).filter(s => s);
let reason = GM_config.get('reason');
let sendreasonpm = GM_config.get('sendreasonpm');
let refreshInterval = GM_config.get('refreshInterval')*1000;
let refreshonly = GM_config.get('refreshonly');
let numPostPerPage = GM_config.get('numPostPerPage');
let hotKey = GM_config.get('hotKey');
let replayJump = GM_config.get('replayJump');
let refreshId = 0;
let curpage = 1;

// 添加设置按钮
let z = document.querySelector("#toptb > div > div.z");
let setting = document.createElement("a");
setting.href = "javascript:;"
setting.textContent = "LK增强设置";
setting.addEventListener("click", () => {GM_config.open(); });
z.insertBefore(setting, z.children[3]);

let url = window.location.href;
let title = document.querySelector("#thread_subject").textContent;
let page = document.querySelector("#pgt > div > div > label > input").value;
let postOffset = 0;

if (refreshInterval != 0 && (!refreshonly || title.includes("水楼"))) {
    refreshId = window.setInterval(intervalRefresh, refreshInterval);
}

let formhash = document.getElementsByName("formhash")[0].value;
addButton(document);
setPages(curpage);

let modactions = document.querySelector("#modactions");
let changePage = document.createElement("div");
changePage.className = "pgbtn s";
changePage.innerHTML = "<a id = \"lastPage\" class=\"bm_h l\" style=\"width:47.5%; float:left\">« 上一小页</a><a id = \"nextPage\" class=\"bm_h n\" style=\"width:47.5%; float:right\">下一小页 »</a>";
changePage.children[0].onclick = function() {
    let newPage = setPages(curpage-1);
    if (newPage != -1) {
        curpage = newPage;
        scrollToPost("down");
    }
};
changePage.children[1].onclick = function() {
    let newPage = setPages(curpage+1);
    if (newPage != -1) {
        curpage = newPage;
        scrollToPost("top");
    }
};
modactions.parentElement.insertBefore(changePage, modactions.nextElementSibling);
if (hotKey) {
    document.addEventListener("keydown", (e) => {
        if (e.keyCode == 37 && document.activeElement.type != "textarea") {
            let newPage = setPages(curpage-1);
            if (newPage != -1) {
                curpage = newPage;
                scrollToPost("down");
            }
        }
        else if (e.keyCode == 39 && document.activeElement.type != "textarea") {
            let newPage = setPages(curpage+1);
            if (newPage != -1) {
                curpage = newPage;
                scrollToPost("top");
            }
        }
    });
    let keyup = document.onkeyup;
    document.onkeyup = null;
    document.addEventListener("keyup", (e) => {
        if (e.keyCode == 37 && curpage == 1 && document.activeElement.type != "textarea") {
            document.addEventListener("keyup", keyup);
        }
        else {
            document.removeEventListener("keyup", keyup);
        }
    });
}

if (document.location.hash.includes("#pid")) {
    scrollToPost(document.location.hash);
}

function addButton(doc) {
    let plhin = doc.getElementsByClassName("plhin");
    for (let i of plhin) {
        let pob_cl = i.getElementsByClassName("pob cl")[0];
        let rate_list = pob_cl.children[1];
        for (let score of scores) {
            let node = doc.createElement("a");
            node.href = "javascript:;";
            node.onclick = function() {rate(this, formhash, tid, "rate", score.toString(), reason, sendreasonpm);};
            node.textContent = "评分"+score.toString()+"QB";
            rate_list.insertBefore(node, rate_list.children[0]);
        }
    }

    let scrolltop = doc.querySelector("#scrolltop");
    let span = doc.createElement("span");
    span.innerHTML = "<a class=\"fmg\" title=\"上传图床\" style=\"background: url(https://www.lightnovel.cn/static/image/editor/editor.gif) no-repeat; background-position: -40px -79px\"><b>上传图床</b></a>";
    let imgButton = span.children[0];
    imgButton.onclick = function() {showSubmitImgWindow()};
    scrolltop.insertBefore(span, scrolltop.firstChild);

    if (replayJump) {
        document.querySelector("#postlistreply").hidden=false;
    } else {
        document.querySelector("#postlistreply").hidden=true;
    }
}

function rate(obj, formhash, tid, handlekey, score2, reason, sendreasonpm) {
    let pid = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id.replace("pid", "");
    console.log("rate="+score2+" pid="+pid);
    let data;
    if (sendreasonpm == true) {data = `formhash=${formhash}&tid=${tid}&pid=${pid}&score2=${score2}&reason=${encodeURIComponent(reason)}&sendreasonpm=on`;}
    else {data = data = `formhash=${formhash}&tid=${tid}&pid=${pid}&score2=${score2}&reason=${encodeURIComponent(reason)}`;}
    fetch("forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1", {
        method: 'POST',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        body: data
    }).then(res => res.text()).then(res => {
        let text = res.split("<![CDATA[")[1].split("<script")[0];
        if (text == "") {text = "评分成功"}
        showPrompt(null, null, text, 2000);
        if (text == "评分成功") {
            fetch(window.location.href).then(res => res.text()).then(res => {
                let domparser = new DOMParser();
                let doc = domparser.parseFromString(res, "text/html");
                let content = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[1];
                let newContent = doc.getElementById("pid"+pid).children[0].children[0].children[1];
                content.innerHTML = newContent.innerHTML;
            });
        }
    });
}

function intervalRefresh() {
    fetch(url).then(res => res.text()).then(res => {
        let domparser = new DOMParser();
        let doc = domparser.parseFromString(res, "text/html");
        addButton(doc);
        let postList = document.querySelector("#postlist");
        let newPostList = doc.querySelector("#postlist").children;
        var newPostArray = new Array();
        for (let newPost of newPostList) {
            if (newPost.id.includes("post_")) {newPostArray.push(newPost)}
        }
        for (let newPost of newPostArray) {
            let post = document.getElementById(newPost.id);
            if (post == null) {
                if (postList.lastElementChild.id == "postlistreply") {
                    postList.insertBefore(newPost, postList.lastElementChild);
                } else {
                    postList.appendChild(newPost);
                }
            }
        }
        if (document.querySelector("#ct > div.pgbtn") == null && doc.querySelector("#ct > div.pgbtn") != null) {
            let nextPage = doc.querySelector("#ct > div.pgbtn");
            let pages = document.querySelector("#ct > div.pgs.mtm.mbm.cl");
            pages.parentElement.insertBefore(nextPage, pages);
        }
        if (doc.querySelector("#ct > div.pgbtn") != null) {
            url = doc.querySelector("#ct > div.pgbtn > a").href;
            postOffset += 20;
            let pages = document.querySelector("#ct > div.pgs.mtm.mbm.cl");
            pages.removeChild(pages.firstElementChild);
            pages.insertBefore(doc.querySelector("#ct > div.pgs.mtm.mbm.cl").firstElementChild, pages.firstElementChild);
        }
        setPages(curpage);
    });
}

function refreshPage() {
    fetch(window.location.href).then(res => res.text()).then(res => {
        let domparser = new DOMParser();
        let doc = domparser.parseFromString(res, "text/html");
        addButton(doc);
        document.getElementById("postlist").innerHTML = doc.getElementById("postlist").innerHTML;
        setPages(curpage);
    });
}

function showSubmitImgWindow() {
    let append_parent = document.querySelector("#append_parent")
    let menu = document.createElement("div");
    menu.innerHTML = "<div id=\"postimg_menu\" class=\"p_pof upf\" style=\"width: 240px; position: fixed; z-index: 301; cursor: move; left: 40%; top: 40%;\" initialized=\"true\">\
    <span class=\"y\"><a class=\"flbc\" href=\"javascript:;\">关闭</a></span>\
    <div class=\"p_opt cl\"><div>请选择图片或者Ctrl+V粘贴图片:<br><input type=\"file\" id=\"imgfile\"></div>\
    <div class=\"pns mtn\">\
    <button type=\"submit\" id=\"postimg_submit\" class=\"pn pnc\"><strong>提交</strong></button>\
    <button type=\"button\" class=\"pn\"><em>取消</em></button></div></div></div>";
    menu = menu.children[0];
    menu.onpaste = function(a) {pasteImg(a)};
    menu.children[1].children[1].children[0].onclick = function() {subimtImg()};
    menu.children[0].children[0].onclick = function() {removeWindow()};
    menu.children[1].children[1].children[1].onclick = function() {removeWindow()};
    append_parent.appendChild(menu);
}

function pasteImg(a) {
    let b=a.clipboardData;
    if(b.files.length>0) {
        document.getElementById('imgfile').files=b.files;
        document.getElementById('postimg_submit').onclick();
    }
}

function subimtImg() {
    let imgfile = document.querySelector("#imgfile").files[0];
    var fd = new FormData();
    fd.append("file", imgfile);
    GM_xmlhttpRequest({
        method: 'POST',
        url: `https://img.vim-cn.com/`,
        data: fd,
        onload: response => {
            text = "[img]"+response.response.replace("\n", "")+"[/img]";
            navigator.clipboard.writeText(text);
            showPrompt(null, null, "上传成功， 代码已复制到剪贴板中", 2000);
            let menu = document.querySelector("#postimg_menu");
            menu.parentElement.removeChild(menu);
        }
    });
}

function removeWindow() {
    let menu = document.querySelector("#postimg_menu");
    menu.parentElement.removeChild(menu);
}

function setPages(p) {
    let posts = []
    let postList = document.querySelector("#postlist").children;
    for (let i of postList) {
        if (i.id.includes("post_")) {
            posts.push(i);
        }
    }
    let minPost = (p-1)*numPostPerPage;
    let maxPost = Math.min(p*numPostPerPage, posts.length);
    if (p < 1 || minPost >= posts.length) {
        return -1;
    }
    for (let i = 0; i < posts.length; i++) {
        if (i >= minPost && i < maxPost) {
            posts[i].hidden=false;
        } else {
            posts[i].hidden=true;
        }
    }
    return p;
}

function scrollToPost(p) {
    let pagelist = document.querySelector("#postlist").children;
    if (p == "top") {
        for (let i = 2; i < pagelist.length; i += 1) {
            if (pagelist[i].hidden == false) {
                pagelist[i].scrollIntoView();
                return;
            }
        }
    } else if (p == "down") {
        for (let i = pagelist.length-1; i >= 0; i -= 1) {
            if (pagelist[i].hidden == false) {
                pagelist[i].scrollIntoView();
                return;
            }
        }
    } else if (p.includes("#pid")) {
        let id = p.replace("#pid", "post_");
        for (let i = 1; i < pagelist.length-1; i += 1) {
            if (pagelist[i+1].id == id) {
                let page = Math.ceil(i/numPostPerPage);
                setPages(page);
                curpage = page;
                pagelist[i+1].scrollIntoView();
                return;
            }
        }
        showPrompt(null, null, "未找到该楼层", 2000);
    }
}
