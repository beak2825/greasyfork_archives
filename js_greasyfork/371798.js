// ==UserScript==
// @name        浦发一刷到底
// @description 一刷到底
// @namespace   https://greasyfork.org/zh-CN/scripts/371798-浦发一刷到底
// @match       https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/*
// @match       https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/*
// @match       https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxcheckurl*
// @run-at      document-start
// @require     https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @grant       none
// @version     0.1.20181016.2
// @downloadURL https://update.greasyfork.org/scripts/371798/%E6%B5%A6%E5%8F%91%E4%B8%80%E5%88%B7%E5%88%B0%E5%BA%95.user.js
// @updateURL https://update.greasyfork.org/scripts/371798/%E6%B5%A6%E5%8F%91%E4%B8%80%E5%88%B7%E5%88%B0%E5%BA%95.meta.js
// ==/UserScript==

if (window.location.href.startsWith("https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxcheckurl")) {
    window.location = window.location.href.replace("https://wx.qq.com/", "https://wx2.qq.com/");
    return;
}


// 部分代码来自https://github.com/Tai7sy/js_hijack
var fuckRedpacketFunc = function() {
    return function() {};
};
if (Object.defineProperty) {
    Object.defineProperty(window, "redpacketFunc", {
        get: fuckRedpacketFunc
    });
} else if (Object.prototype.__defineGetter__) {
    window.__defineGetter__("redpacketFunc", fuckRedpacketFunc);
}

var fuckJdetects = function() {
    return {
        create: function() {}
    };
};
if (Object.defineProperty) {
    Object.defineProperty(window, "jdetects", {
        get: fuckJdetects
    });
} else if (Object.prototype.__defineGetter__) {
    window.__defineGetter__("jdetects", fuckJdetects);
}

if (typeof window.name !== 'undefined' && window.name !== "wx_spdb" && window.innerHeight < window.innerWidth) {
    window.open("https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/toGameHome", "wx_spdb", "resizable=no,width=" + window.innerHeight * 0.56 + ",height=" + window.outerHeight);
    return;
}

if (!document.URL.startsWith("https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/gameIndexjsp")) {
    return;
}


var btn = document.createElement("button");
btn.innerText = "已载入";
btn.style = "position: fixed;right: 0;width: 50px;height: 30px;z-index:99999999;text-align: center;background-color: white";
document.body.insertBefore(btn, document.body.firstChild);

var checkScripts = function() {
    var scripts = ["https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/jdetects.min.js?randomNum=20181016",
        "https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/jquery-2.1.3.min.js",
        "https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/jquery.mobile-1.3.2.min.js",
        "https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/common.js?randomNum=20181016",
        "https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/maidian.js?randomNum=20180918",
        "https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/wxrpgameback.js?randomNum=20181016",
        "https://weixin.spdbccc.com.cn/wxrp-page-redpacketsgame/js/wxHideOptionMenu.js?randomNum=20181016",
    ];
    document.querySelectorAll("script").forEach(function(item, index) {
        if (!scripts.includes(item.src)) {
            //console.log(item.src);
            btn.innerText = "浦发已更新";
            btn.style = "position: fixed;right: 0;width: 100px;height: 30px;z-index:99999999;text-align: center;background-color: red";
        }
    });
};

if (window.attachEvent) {
    window.attachEvent('onload', checkScripts);
} else {
    if (window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            checkScripts(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = checkScripts;
    }
}

hookAjax({
    onload: function(xhr) {
        //console.log("onload called: %O",xhr);
        if (xhr.xhr.responseURL.endsWith("/wxrp-page-redpacketsgame/ajaxGameStart") && typeof xhr.responseText == "string") {
            try {
                var jsonData = JSON.parse(xhr.responseText);
                //console.log(jsonData);
                autoSolve(jsonData);
            } catch (e) {
                //console.log(xhr.responseText);
                btn.innerText = "数据有误";
            }
        }
    }
});

function autoSolve(jsonData) {
    if (!jsonData) {
        btn.innerText = "无数据";
        return;
    }

    var g_cnt_x, g_cnt_y;
    [g_cnt_x, g_cnt_y] = jsonData.format.split("*");

    var g_table = [];
    var g_start = null;
    for (var y = 0; y < g_cnt_y; y++) {
        g_table[y] = [];
        for (var x = 0; x < g_cnt_x; x++) {
            g_table[y][x] = {
                id: jsonData.allPoints[y][x],
                is: jsonData.hinders.includes(jsonData.allPoints[y][x]) ? 0 : 1,
                ed: 0,
                y: y,
                x: x
            };
            if (jsonData.startPoint === jsonData.allPoints[y][x]) {
                g_start = g_table[y][x];
            }
        }
    }

    var m_arr = g_table;

    function get_top(e) {
        if (0 === e.y || 0 === m_arr[e.y - 1][e.x].is) {
            return null;
        }
        return m_arr[e.y - 1][e.x];
    }

    function get_right(e) {
        if (g_cnt_x - 1 === e.x || 0 === m_arr[e.y][e.x + 1].is) {
            return null;
        }
        return m_arr[e.y][e.x + 1];
    }

    function get_bottom(e) {
        if (g_cnt_y - 1 === e.y || 0 === m_arr[e.y + 1][e.x].is) {
            return null;
        }
        return m_arr[e.y + 1][e.x];
    }

    function get_left(e) {
        if (0 === e.x || 0 === m_arr[e.y][e.x - 1].is) {
            return null;
        }
        return m_arr[e.y][e.x - 1];
    }

    function isDone() {
        for (var y = 0; y < g_cnt_y; y++) {
            for (var x = 0; x < g_cnt_x; x++) {
                if (m_arr[y][x].is && !m_arr[y][x].ed)
                    return false;
            }
        }
        return true
    }

    function triggerTouchEvent(target, el, eventType) {
        var rect = el.getBoundingClientRect();
        var touch = new Touch({
            identifier: 0,
            target: target,
            pageX: rect.left + rect.width / 2,
            pageY: rect.top + rect.height / 2,
        });
        var touchEvent = new TouchEvent(eventType, {
            cancelable: true,
            bubbles: true,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });
        target.dispatchEvent(touchEvent);
    }

    function solve(arr) {
        for (var i = 0; i < arr.length; i++) {
            var target = document.getElementById(arr[0].id);
            var element = document.getElementById(arr[i].id);
            if (i == 0) {
                triggerTouchEvent(target, element, "touchstart");
                triggerTouchEvent(target, element, "touchmove");
            } else {
                triggerTouchEvent(target, element, "touchmove");
            }
        }
    }

    var m_route = [];

    function find_route(now) {

        var next = null;

        next = get_top(now);
        if (next && !next.ed) {
            next.ed = 1;
            m_route.push(next);
            if (find_route(next))
                return true;
        }

        next = get_right(now);
        if (next && !next.ed) {
            next.ed = 1;
            m_route.push(next);
            if (find_route(next))
                return true;
        }

        next = get_bottom(now);
        if (next && !next.ed) {
            next.ed = 1;
            m_route.push(next);
            if (find_route(next))
                return true;
        }

        next = get_left(now);
        if (next && !next.ed) {
            next.ed = 1;
            m_route.push(next);
            if (find_route(next))
                return true;
        }

        if (isDone()) {
            btn.innerText = "提交";
            btn.onclick = function() {
                solve(m_route);
            }
            setTimeout(function() {
                solve(m_route);
            }, 8500);
            return true;
        }

        if (m_route.length === 0) {
            btn.innerText = '无解';
            return false;
        }

        var last = m_route.pop();
        last.ed = 0;
    }

    g_start.ed = 1;
    m_route.push(g_start);
    find_route(g_start);

}