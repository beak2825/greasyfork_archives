// ==UserScript==
// @name         一页锁隐
// @namespace    PermissionError
// @author       PermissionError
// @version      1.0
// @description  一键为单个帖子里一页所有楼层进行锁隐操作
// @grant none
// @run-at document-end
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://bbs.ngacn.cc/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @downloadURL https://update.greasyfork.org/scripts/462627/%E4%B8%80%E9%A1%B5%E9%94%81%E9%9A%90.user.js
// @updateURL https://update.greasyfork.org/scripts/462627/%E4%B8%80%E9%A1%B5%E9%94%81%E9%9A%90.meta.js
// ==/UserScript==

var buttons_gap=0.5;//默认0.7 ，最小可设为0 。

function doIfExists(obj, func) {
    if (!(obj === undefined || obj === null)) {
        return func(obj);
    }
}

function forEach(obj, i, func) {
    var len = obj.length;
    for (i=0; i<len; i++) {
        // for (var i=0; i<1; i++) {
        func(obj[i]);
    }
}

function getButtons(post_info) {
    //return post_info.getElementsByTagName('a');
    return post_info;
}

var post_infos = document.getElementsByClassName('postInfo');
let filtered = [];
for(let postInfo of post_infos) {
    if(postInfo.id.startsWith('comment')){
        continue;
    }
    filtered.push(postInfo);
}
post_infos = filtered;
var i = 0;

function generate_HidePage(pid, uid) {
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[0].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = '锁隐本页';
    template.title = "锁隐本页全部回复";
    template.style.marginLeft=buttons_gap+"em";
    template.onclick = async (event) => {
        event.preventDefault();
        let cont = confirm('将锁隐本页的全部回复。是否继续？');
        if(!cont) return;

        let fetchPids = async (page) => {
            let pids = [];
            let res = await fetch('/read.php?tid=' + window.__CURRENT_TID + '&__output=11&page=' + page.toString());

            let jsonRes = await res.json();
            for(let post of jsonRes.data.__R) {
                pids.push(post.pid);
            }
            return pids;
        }
        // __PAGE[2] 是页数, 当只有一页是__PAGE 为 undefined
        let pids = await fetchPids(window.__PAGE ? window.__PAGE[2] : 1);
        let apiRoutes = [];
        for(let pid of pids) {
            apiRoutes.push(window.__API.setPost(window.__CURRENT_TID + ',' + (pid), 0, 0, 1026, 0, '', '', undefined, window.__CURRENT_FID));
        }
        let counter = 0;
        let completeTask = () => {
            console.log('Hide ' + pids[counter]);
            counter++;
            if(counter === pids.length) {
                alert('操作成功' + pids.join(' '));
            }
        }
        window.__NUKE.doRequest({
            u: apiRoutes,
            f: () => {completeTask()}
    });
        alert('操作已加入队列 完成之前请勿刷新 会打断处理队列');
    }
    return template;
}
forEach(post_infos, i, function(o) {
    if(!window.__GP.admincheck) return;
    var buttons = getButtons(o);
    var users = getButtons(o);
    var pid = buttons.parentElement/*.parentElement*/.firstElementChild.id;
    var fp = buttons.parentElement.id;
    //var uid = document.getElementsByName('uid');
    pid = pid.substr(3, pid.length - 9);
    fp = fp.substr(13);
    var uid = document.getElementsByName('uid')[fp%20].text;
    buttons.appendChild(generate_HidePage(pid, uid, 'HidePage'));
});