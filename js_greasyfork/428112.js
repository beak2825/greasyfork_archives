// ==UserScript==
// @name         TuTuLogin
// @version      0.4
// @description  TuTu自动登录
// @author       cA7dEm0n
// @match        https://api.jquery.com/jQuery.get/
// @include      *
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @namespace https://greasyfork.org/users/519996
// @downloadURL https://update.greasyfork.org/scripts/428112/TuTuLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/428112/TuTuLogin.meta.js
// ==/UserScript==


// 服务器
const TUTU_SERVER = "http://127.0.0.1:9877";

// URL路径
const TUTU_SCRIPT_URL = `${TUTU_SERVER}/scripts`;
const TUTU_CONFIG_URL = `${TUTU_SERVER}/config`;

// 参数
const TUTU_ARGS = {
    utils: "",
    $jq:$,
};

var TUTU_STATUS = true;

// 当前链接
const TUTU_LOCATION_URL = window.location.href;

// 默认账号信息
var tutuUserObject = {
    username: "",
    password: "",
    script_name: "",
}

function tutuLoadScript(url) {
    /**
     * @description: 加载脚本
     */
    let _object = document.createElement('script');
    _object.src = url;
    _object.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(_object);
};

function tutuCheckUrl(url) {
    /**
     * @description: 检测页面
     */
     $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function(data) {
            for (let i in data) {
                if (TUTU_LOCATION_URL.indexOf(data[i]) >= 0) {
                    TUTU_STATUS=true
                    return
                }
            }
            TUTU_STATUS=false
        }
     })
};

function tutuInitScript() {
    /**
     * @description: 初始化
     */
    tutuLoadScript(`${TUTU_SCRIPT_URL}/utils.js`);

    setTimeout(()=> {
        TUTU_ARGS["utils"] = new TuTuUtils();

        $.get(`${TUTU_CONFIG_URL}/?key=${TUTU_LOCATION_URL}`, function (data) {
            tutuUserObject.username = data.user;
            tutuUserObject.password = data.password;
            tutuUserObject.script_name = data.script_name;

            tutuLoadScript(`${TUTU_SCRIPT_URL}/${tutuUserObject.script_name}`);
        });
    }, 300);
};


(function () {
    'use strict';

    // 自动刷新配置
    setTimeout(()=> {
        $.get(`${TUTU_SERVER}/reload/`);
    }, 5*1000);

    // 检测
    tutuCheckUrl(`${TUTU_SERVER}/check/`);

    if (!TUTU_STATUS) {
        throw new Error("TuTu: 未找到配置.");
    };

    // 初始化
    tutuInitScript();

    // 挂载
    hotkeys('q+w', function () {
        // 执行登录方法
        tutuLogin(tutuUserObject, TUTU_ARGS);
    });
})();