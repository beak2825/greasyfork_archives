// ==UserScript==
// @name            根据UID屏蔽主题帖及回复（NGA）-改
// @name:en         Lightened-posts-NGA-Modified
// @namespace       https://github.com/Elypha/lightened-posts
// @version         0.5
// @description     通过指定UID，淡化显示其主题帖及回帖，达到护眼的效果。修改：完全隐藏主题及回复
// @description:en  Alter unpleasing posts, according to posters' uid, into a lightened style.
// @author          金光闪闪大萌德@NGA
// @date            04/08/2018
// @modified        21/10/2018
// @supportURL      https://github.com/Elypha/lightened-posts/issues
// @match           bbs.nga.cn/thread.php*
// @match           bbs.nga.cn/read.php*
// @match           bbs.nga.cn/nuke.php?func=ucp&uid=*
// @grant           none
// @license         GUN 3.0
// @downloadURL https://update.greasyfork.org/scripts/375477/%E6%A0%B9%E6%8D%AEUID%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%E5%B8%96%E5%8F%8A%E5%9B%9E%E5%A4%8D%EF%BC%88NGA%EF%BC%89-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/375477/%E6%A0%B9%E6%8D%AEUID%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%E5%B8%96%E5%8F%8A%E5%9B%9E%E5%A4%8D%EF%BC%88NGA%EF%BC%89-%E6%94%B9.meta.js
// ==/UserScript==

//CLEAR
//localstorage.removeItem(uid_list)

//PAGE_SWITCH
var url = window.location.href;
var switch_url_thread = url.search(/thread\.php/);
var switch_url_read = url.search(/\/read\.php/);
var switch_url_nuke = url.search(/nuke\.php/);

if (switch_url_nuke>0){
    //个人资料页面
    //添加黑名单
    var button_block = document.createElement("button");
    button_block.innerHTML = "BLOCK";

    var body_block = document.querySelector("#ucp_block");
    body_block.appendChild(button_block);

    button_block.addEventListener ("click", function() {
        if(localStorage.getItem("uid_list") === null){
            //初始化
            var uid_list_initialization = "00000000";
            localStorage.setItem("uid_list",uid_list_initialization);
            alert("初始化完成，请刷新后重试");
        }else{
            //非首次运行
            var read_list = localStorage.getItem("uid_list");

            var url = window.location.href;
            var uid = url.replace(/[^\d]/g,'');

            var is_exist = read_list.search(uid);
            if (is_exist>=0){
                alert("此用户已存在于黑名单中")
            }else{
                read_list = uid + "|" + read_list;
                read_list = read_list.replace(/\|\|/g, "|");
                localStorage.setItem("uid_list",read_list);
                alert("成功加入黑名单");
            }
        }
    });
    //移除黑名单
    var button_block_remove = document.createElement("button");
    button_block_remove.innerHTML = "REMOVE";

    var body_block_remove = document.querySelector("#ucp_block");
    body_block_remove.appendChild(button_block_remove);

    button_block_remove.addEventListener ("click", function() {
        if(localStorage.getItem("uid_list") === null){
            //初始化
            var uid_list_initialization = "00000000";
            localStorage.setItem("uid_list",uid_list_initialization);
            alert("初始化完成，请刷新后重试");
        }else{
            //非首次运行
            var read_list = localStorage.getItem("uid_list");

            var url = window.location.href;
            var uid = url.replace(/[^\d]/g,'');

            var is_exist = read_list.search(uid);
            if (is_exist>=0){
                var uid_remove_RE = new RegExp(uid);
                read_list = read_list.replace(uid_remove_RE, "");
                read_list = read_list.replace(/\|\|/g, "|");
                localStorage.setItem("uid_list",read_list);
                alert("已从黑名单中移除");
            }
        }
    });
    //手动输入
    var button_block_input = document.createElement("button");
    button_block_input.innerHTML = "INPUT";

    var body_block_input = document.querySelector("#ucp_block");
    body_block_input.appendChild(button_block_input);

    button_block_input.addEventListener ("click", function() {
        var uid_input = prompt("输入uid，请参照下述格式\n单个uid:\n12340000\n多个uid:\n12340000|23450000|34560000","");
        if(uid_input.length>1){
            uid_input = uid_input.replace("｜", "|");
            var read_list = localStorage.getItem("uid_list");
            read_list = uid_input + "|" + read_list;
            read_list = read_list.replace(/\|\|/g, "|");
            localStorage.setItem("uid_list",read_list);
            alert("成功加入黑名单");
        }
    });
    //展出
    var button_block_view = document.createElement("button");
    button_block_view.innerHTML = "VIEW";

    var body_block_view = document.querySelector("#ucp_block");
    body_block_view.appendChild(button_block_view);

    button_block_view.addEventListener ("click", function() {
        var read_list = localStorage.getItem("uid_list");
        alert(read_list);
    });
}

//TRANSFER_TO_RE
var uid_list = localStorage.getItem("uid_list");
var uid_list_RE = new RegExp(uid_list);

if (switch_url_thread>0){
    //主题帖列表页面
    block_thread();
    var height_thread = document.documentElement.scrollHeight;
    window.addEventListener('scroll', async () => {
        var height_thread_new = document.documentElement.scrollHeight;
        if(height_thread_new - height_thread > 0){
            block_thread();
            height_thread = height_thread_new;
        }
    })

    function block_thread() {
        var rowslength = document.getElementById('topicrows').rows.length;
        var table = document.getElementById('topicrows');
        var i;
        for(i=0;i<rowslength;i++){
            var str = document.getElementById('topicrows').rows[i].cells[2].innerHTML;
            var result = str.search(uid_list_RE);
            if (result > 0) {
                var color_1 = document.getElementById('topicrows').rows[i].cells[2].querySelector("a[title]");
                color_1.style.opacity=0.15;
                var color_2 = document.getElementById('topicrows').rows[i].querySelector("a.topic");
                color_2.style.opacity=0.15;
            }
        }
    }
}

if (switch_url_read>0){
    //贴内页面
    block_read();
    var height_read = document.documentElement.scrollHeight;
    window.addEventListener('scroll', async () => {
        var height_read_new = document.documentElement.scrollHeight;
        if(height_read_new - height_read > 0){
            block_read();
            height_read = height_read_new;
        }
    })

    function block_read() {
        var length = document.getElementById("m_posts_c").getElementsByClassName('postbox').length;
        var first_post_info = document.getElementById("m_posts_c").getElementsByClassName('posterinfo')[0];
        var startpoint = first_post_info.id;
        var first_number = startpoint.replace(/[^\d.]/g,'');
        var terminal = Number(length) + Number(first_number);
        var i;
        for(i=first_number;i<terminal;i++){
            var info_number = 'postauthor' + i;
            var post_number = 'postcontent' + i;
            var post_avatar = 'posterinfo' + i;
            var str_url = document.getElementById(info_number);
            var str = String(str_url);
            var result = str.search(uid_list_RE);
            if (result > 0) {
                document.getElementById(post_number).parentNode.parentNode.parentNode.parentNode.style.display='none';
            }
        }
    }
}