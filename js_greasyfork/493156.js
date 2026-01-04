// ==UserScript==
// @name         Atcoder Nickname
// @namespace    https://greasyfork.org/zh-CN/users/1223216-znpdco
// @license      MIT
// @version      1.3
// @description  给 Atcoder 用户添加备注
// @author       ZnPdCo
// @match        https://atcoder.jp/*
// @icon         https://aowuucdn.oss-accelerate.aliyuncs.com/atcoder.png
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://unpkg.com/jquery@3.4.1/dist/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/493156/Atcoder%20Nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/493156/Atcoder%20Nickname.meta.js
// ==/UserScript==

(function() {
    // 引入sweet alert
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-sweetalert/1.0.1/sweetalert.min.js';
    document.head.appendChild(script);
    const css = document.createElement('link');
    css.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-sweetalert/1.0.1/sweetalert.min.css';
    css.rel="stylesheet";
    document.head.appendChild(css);

    if(GM_getValue("namedata") == undefined) {
        GM_setValue("namedata", "{}");
    }
    var namedata = JSON.parse(GM_getValue("namedata"));
    $(`<li style="cursor: pointer;"><a id="nickname_set"><span class="glyphicon glyphicon-tags" aria-hidden="true"></span> 管理备注</a></li>`).insertBefore('#navbar-collapse .divider:eq(1)');
    $('#nickname_set').click(function(e) {
        e.preventDefault();
        swal({
            title: "批量设置备注",
            text: "备注 JSON（格式如 <code>{\"atcoder\": \"at\"}</code>）：",
            type: "input",
            html: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "{\"atcoder\": \"at\"}"
        }, function(json){
            if (json === false) return false;

            var is_json = true;
            try {
                var object = JSON.parse(json);
            } catch (error) {
                is_json = false;
                swal.showInputError("这好像不是一个合法的 JSON！");
            }
            if(!is_json) {
                return false;
            }

            GM_setValue("namedata", json);
            location.reload();
        });
        $(".form-control").val(GM_getValue("namedata"));
    });
    setInterval(function() {
        var ele = $('.username');
        for(let i = 0; i < ele.length; i ++) {
            if($('.username').eq(i).has('.nickname').length == 0) {
                var name = $('.username').eq(i).text().replaceAll(' ', '');
                if(name in namedata) {
                    $('.username').eq(i).append(`<span class="nickname">（${namedata[name]}）</span>`);
                    $(`.nickname`).css({'color': 'black',
                                        'opacity': '.15',
                                        'transition': 'all .5s'});
                    $(`.nickname`).unbind('hover').hover(function(e) { // 鼠标悬浮时触发
                        $(e.target).css('opacity', '1')
                    }, function(e) { // 鼠标离开时触发
                        $(e.target).css('opacity', '.15')
                    })
                }
            }
            if($('.username').eq(i).has('.nickname-edit').length == 0) {
                $('.username').eq(i).append(`<span> </span><span class="nickname-edit glyphicon glyphicon-edit" href=""></span>`);
                $(`.nickname-edit`).css({'color': 'black',
                                         'opacity': '.15',
                                         'transition': 'all .5s',
                                         'cursor': 'pointer'});
                $(`.nickname-edit`).unbind('hover').hover(function(e) { // 鼠标悬浮时触发
                    $(e.target).css('opacity', '1')
                }, function(e) { // 鼠标离开时触发
                    $(e.target).css('opacity', '.15')
                })
                $(`.nickname-edit`).unbind('click').click(function(e) { // 鼠标点击时触发
                    e.preventDefault();
                    var username = $(e.target).parent().find('span:eq(0)').text().replace(' ', '');
                    swal({
                        title: "设置 " + username + " 的备注",
                        text: "备注：",
                        type: "input",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        html: true,
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder:  username + " 的备注",
                    }, function(nickname){
                        if (nickname === false) return false;
                        namedata[username] = nickname;
                        if(nickname == '') {
                            delete namedata[username]
                        }
                        GM_setValue("namedata", JSON.stringify(namedata));
                        location.reload();
                    });
                    if(username in namedata)
                        $(".form-control").val(namedata[username]);
                })
            }
        }
    }, 200);
})();