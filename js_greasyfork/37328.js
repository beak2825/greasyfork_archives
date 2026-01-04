// ==UserScript==
// @name         Followed Douban User Status Blocker
// @namespace    Zcc911
// @version      0.5
// @description  Blocking Followed Douban User's Status (including reposts)
// @author       Zcc911
// @match        *://www.douban.com/*
// @match        *://www.douban.com/people/*
// @copyright    Zcc911
// @downloadURL https://update.greasyfork.org/scripts/37328/Followed%20Douban%20User%20Status%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/37328/Followed%20Douban%20User%20Status%20Blocker.meta.js
// ==/UserScript==

var blocked_UID,
    blocked_USR;

// get blocking list
function getBlocked(){
    blocked_UID = JSON.parse(localStorage.getItem('douban_blocked_UID')) || [];
    blocked_USR = JSON.parse(localStorage.getItem('douban_blocked_USR')) || [];
}
getBlocked();

if(window.location.pathname === "/"){   // masking user posts/reposts on douban homepage via blocking list
    console.log("当前屏蔽的用户ID：", blocked_UID);
    console.log("当前屏蔽的用户昵称：", blocked_USR);
    var ids_blocked = new RegExp(blocked_UID.join('|'));
        usr_blocked = new RegExp(blocked_USR.join('|'));
    $(".status-wrapper").each(function(index){  // "this" directly points to DOM object in each method
        if (!blocked_UID.length || !blocked_USR.length) { return false; }
        var resharer = this.querySelector(".reshared_by > a"),
            usrname = resharer.title ? resharer.title : "";
        if (this.dataset.uid.match(ids_blocked) || usrname.match(usr_blocked)) {   // block the posts/reposts
            this.style.display = "none";
        }
    });
}else{  // modify blocking list on user homepage
    var blockStatus = $('.user-opt .user-group'),
        listEle = $('.more-opt .user-group-list');
    if (!listEle.length) { return false; }
    var usrid = people_info.id,     // is this method stable?
        usrname = people_info.name;
    if (blocked_UID.filter(function (num, nickname) {
            nickname = usrname;
            return num == usrid;
        }).length) {    // user already blocked
        blockStatus.append('<span class="user-rs" class="red">已屏蔽</span>');
        listEle.prepend('<li><a href="javascript:;" class="cancel-block">取消屏蔽</a></li>');
    } else {
        blockStatus.append('<span class="user-rs">未屏蔽</span>');
        listEle.prepend($('<li><a href="javascript:;" class="block-status">屏蔽广播</a></li>'));
    }
    listEle.delegate('.cancel-block', 'click', function () {    // event delegation, listening on block canceling event
        getBlocked();
        blocked_UID = blocked_UID.filter(function (num) {
            return usrid != num;
        });
        blocked_USR = blocked_USR.filter(function (nickname) {
            return usrname != nickname;
        });
        localStorage.setItem('douban_blocked_UID', JSON.stringify(blocked_UID));
        localStorage.setItem('douban_blocked_USR', JSON.stringify(blocked_USR));
        $(this).removeClass('cancel-block').addClass('block-status').text('屏蔽广播');
        blockStatus.children().last().removeAttr("style").html("未屏蔽");
        console.log("当前屏蔽用户列表：", blocked_USR);
    })
    .delegate('.block-status', 'click', function () {           // event delegation, listening on block event
        getBlocked();
        blocked_UID.push(parseInt(usrid, 10));
        blocked_USR.push(usrname);
        localStorage.setItem('douban_blocked_UID', JSON.stringify(blocked_UID));
        localStorage.setItem('douban_blocked_USR', JSON.stringify(blocked_USR));
        $(this).removeClass('block-status').addClass('cancel-block').text('取消屏蔽');
        blockStatus.children().last().css("color", "red").html("已屏蔽");
        console.log("当前屏蔽用户列表：", blocked_USR);
    });
}