// ==UserScript==
// @name         一键举报
// @namespace    https://greasyfork.org/zh-CN/scripts/487596
// @author       WLXC
// @version      1.1
// @description  一键举报该楼层到飞书
// @grant none
// @run-at document-end
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://bbs.ngacn.cc/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @license      MIT LICENSE
// @downloadURL https://update.greasyfork.org/scripts/487596/%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/487596/%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5.meta.js
// ==/UserScript==

var buttons_gap=0.5;

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

function generate_report_genshin(pid, uid) {
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[0].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = '一键举报';
    template.title = "一键举报该楼层到飞书";
    template.style.marginLeft=buttons_gap+"em";
    template.onclick = async (event) => {
        event.preventDefault();
        console.log(window.__CURRENT_TID.toString() + ',' + pid);
        var report_url = ''; //请填写你的URL链接
        if(pid!=0){
           window.open(report_url+'?prefill_%E4%B8%BE%E6%8A%A5%E9%93%BE%E6%8E%A5=https://bbs.nga.cn/read.php?pid='+pid+'%26opt=128'+'&prefill_uuid='+uid+'&hide_uuid=1');
        }
        else{
           window.open(report_url+'?prefill_%E4%B8%BE%E6%8A%A5%E9%93%BE%E6%8E%A5=https://bbs.nga.cn/read.php?tid='+window.__CURRENT_TID.toString()+'&prefill_uuid='+uid+'&hide_uuid=1');
        }
    }
    return template;
}
forEach(post_infos, i, function(o) {
    var buttons = getButtons(o);
    var users = getButtons(o);
    var pid = buttons.parentElement/*.parentElement*/.firstElementChild.id;
    var fp = buttons.parentElement.id;
    pid = pid.substr(3, pid.length - 9);
    fp = fp.substr(13);
    var uid = window.__CURRENT_UID;
    buttons.appendChild(generate_report_genshin(pid, uid));
});