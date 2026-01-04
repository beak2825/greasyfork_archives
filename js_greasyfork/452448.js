// ==UserScript==
// @name         申精楼处理
// @namespace    PermissionError
// @author       PermissionError
// @version      1.2
// @description  一键单锁定回复并PM“已处理”
// @grant none
// @run-at document-end
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://bbs.ngacn.cc/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @downloadURL https://update.greasyfork.org/scripts/452448/%E7%94%B3%E7%B2%BE%E6%A5%BC%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/452448/%E7%94%B3%E7%B2%BE%E6%A5%BC%E5%A4%84%E7%90%86.meta.js
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

function generate_Done(pid, uid) {
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[0].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = '已处理';
    template.title = "单锁定回复并PM“已处理”";
    template.style.marginLeft=buttons_gap+"em";
    template.onclick = async (event) => {
        event.preventDefault();
        window.__NUKE.doRequest({
            u: window.__API.setPost(window.__CURRENT_TID.toString() + ',' + pid, 0, 0, 1024, 0, 1, '已处理', undefined, window.__CURRENT_FID),
            f: () => {alert('操作成功 ' + pid)}
        });
    }
    return template;
}
forEach(post_infos, i, function(o) {
    if(!window.__GP.admincheck) return;
    //将此变量编辑为申精楼的TID，可加多个
    let appTopics = ['28340190', '32673298'];
    if(!appTopics.find((element) => element === window.__CURRENT_TID.toString())) return;
    var buttons = getButtons(o);
    var users = getButtons(o);
    var pid = buttons.parentElement/*.parentElement*/.firstElementChild.id;
    var fp = buttons.parentElement.id;
    //var uid = document.getElementsByName('uid');
    pid = pid.substr(3, pid.length - 9);
    fp = fp.substr(13);
    var uid = document.getElementsByName('uid')[fp%20].text;
    console.log(uid);
    buttons.appendChild(generate_Done(pid, uid));
});