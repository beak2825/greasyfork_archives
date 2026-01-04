// ==UserScript==
// @name         淘宝联盟-采集推广监控单元
// @version      2.0
// @author       川芎
// @description  采集推广监控单元数据
// @match        https://pub.alimama.com/fourth/tool/promotionMonitor/index.htm?mode=unit*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @resource toastr_css https://cdn.bootcdn.net/ajax/libs/toastr.js/1.3.1/css/toastr.min.css
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/1.3.1/js/toastr.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @run-at       document-end
// @namespace https://greasyfork.org/users/728933
// @downloadURL https://update.greasyfork.org/scripts/434810/%E6%B7%98%E5%AE%9D%E8%81%94%E7%9B%9F-%E9%87%87%E9%9B%86%E6%8E%A8%E5%B9%BF%E7%9B%91%E6%8E%A7%E5%8D%95%E5%85%83.user.js
// @updateURL https://update.greasyfork.org/scripts/434810/%E6%B7%98%E5%AE%9D%E8%81%94%E7%9B%9F-%E9%87%87%E9%9B%86%E6%8E%A8%E5%B9%BF%E7%9B%91%E6%8E%A7%E5%8D%95%E5%85%83.meta.js
// ==/UserScript==

let body = {}
GM_cookie('list', {url: location.href}, (cookies) => {
    body = (cookies.map(c => `${c.name}=${c.value}`).join('; '));
});

(function () {
    let host = "http://127.0.0.1:8080/oc/gather_unit_reprot_bak";


    // 设置toast弹窗插件
    var toast_center_center = '<style type="text/css">.toast-center-center {top: 50%;left: 50%;margin-top: -25px;margin-left: -150px; width:500px;}</style>';
    $('head').append(toast_center_center);
    toastr.options = {
        "closeButton": false, //是否显示关闭按钮
        "debug": false, //是否使用debug模式
        "positionClass": "toast-center-center",//弹出窗的位置
        "showDuration": "300",//显示的动画时间
        "hideDuration": "1000",//消失的动画时间
        "timeOut": "3000", //展现时间
        "extendedTimeOut": "1000",//加长展示时间
        "showEasing": "swing",//显示时的动画缓冲方式
        "hideEasing": "linear",//消失时的动画缓冲方式
        "showMethod": "fadeIn",//显示时的动画方式
        "hideMethod": "fadeOut" //消失时的动画方式
    };

    GM_addStyle(GM_getResourceText("toastr_css"));


    function gather() {
        let post_data = {
            cookie: body,
            nick: window.nick_drop,
            tb_token: $.cookie('_tb_token_')
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: host,
            dataType: "json",
            nocache: true,
            data: JSON.stringify(post_data),
            onload: function (save_res) {
                if (save_res.status == 200) {
                    toastr.options.timeOut = "10000000";
                    toastr.info("已通知后端采集，请勿退出当前用户!");
                } else {
                    toastr.options.timeOut = "100000";
                    toastr.info("无法访问采集服务器，请检查网络连接!");
                }
            }
        });
    }


    function run() {
        // 设置toastr弹窗初始关闭时间
        toastr.options.timeOut = "3000";
        gather()
    }

    setTimeout(function () {

        // 添加采集按钮
        let location = $(".panel-title");
        let new_btn = $("<button class='btn' id='gather'></button>").text("采集");
        location.after(new_btn);

        new_btn.click(function () {
            run()
        });

        window.nick_drop = $(".nick-drop").text();
    }, 1000);

})();