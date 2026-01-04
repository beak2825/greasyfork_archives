// ==UserScript==
// @name         一键加分
// @namespace    WLXC
// @namespace    https://greasyfork.org/zh-CN/scripts/453406
// @author       WLXC
// @version      0.3
// @description  一键给某个楼层进行加分处理
// @icon         http://bbs.nga.cn/favicon.ico
// @grant        none
// @license      MIT License
// @run-at document-end
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://bbs.ngacn.cc/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @downloadURL https://update.greasyfork.org/scripts/453406/%E4%B8%80%E9%94%AE%E5%8A%A0%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/453406/%E4%B8%80%E9%94%AE%E5%8A%A0%E5%88%86.meta.js
// ==/UserScript==

//加分理由
var add_info="TEST活动加分";

//加分规则
//128,       默认,加60声望0金币0威望
//4194372,   加减声望，发送私信
//4194368，  加减声望，不发送私信
//100663428，评分，60声望+发送私信
//100663424，评分，60声望+不发送私信
//100663436，评分，60声望+发送私信+主题加入精华区
//100663432，评分，60声望+不发送私信+主题加入精华区
//100663438，评分，60声望+发送私信+加精+0.4威望+不加金币
//100663437，评分，60声望+发送私信+加精+0.6金币+不加威望
//100663431，评分，60声望+发送私信+0.6金币+0.4威望
//100663430，评分，60声望+发送私信+0.4威望
//100663429，评分，60声望+发送私信+0.6金币
//100663815，评分，105声望+0.7威望+1.05金币
var add_opt=4194304;

//加减分规则
//正为加分，负为减分，不涉及威望与金币
var add_value=105;

var post_infos = document.getElementsByClassName('postInfo');
var i=0;
let filtered = [];
for(let postInfo of post_infos) {
    if(postInfo.id.startsWith('comment')){
        continue;
    }
    filtered.push(postInfo);
}
post_infos = filtered;

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
function add_score(pid,tid,fid){
    __NUKE.doRequest({
        u:{u:__API._base,
           a:{__lib:"add_point_v3",__act:"add",opt:add_opt,fid:fid,tid:tid,pid:pid,info:add_info,value:add_value,raw:3}
          },
        b:this
    })
}
function test_add_btn(pid,tid,fid){
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[0].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = '加分';
    template.title = "Test";
    template.style.marginLeft=0.5+"em";
    template.onclick = async (event) => {
        //这里写触发的函数
        add_score(pid,tid,fid);
    console.log("test:"+pid);
    }
    return template;
}
forEach(post_infos, i, function(o) {
    var buttons = getButtons(o);
    var pid = buttons.parentElement/*.parentElement*/.firstElementChild.id.slice(3,-6);
    var tid = commonui.postArg.def.tid;
    var fid = commonui.postArg.def.fid;
    console.log(pid,tid,fid);
     buttons.appendChild(test_add_btn(pid,tid,fid))
});