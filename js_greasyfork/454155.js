// ==UserScript==
// @name          快速签到
// @namespace     http://tampermonkey.net/
// @version       0.3.34
// @description   签到工具
// @author        树
// @license       License
// @match         https://www.52pojie.cn/*
// @match         https://www.iopq.net/*
// @match         https://www.gmbuluo.net/*
// @match         https://www.lspm2.net/*
// @match         https://www.sf2.net/*
// @match         https://www.77boss.com/*
// @match         https://www.108pc.com/*
// @match         https://www.ruciwan.com/*
// @match         https://www.y986.com/*
// @match         https://www.8808gm.com/*
// @match         https://www.88m2.com/*
// @match         https://bbs.6994.cn/*
// @match         https://www.xjyxi.com/*
// @match         http://www.2nzz.com/*
// @match         http://www.ydwgame.net/*
// @match         http://www.ty166.com/*
// @match         https://www.3122.cn/*
// @icon          https://www.iopq.net/favicon.ico
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_listValue
// @grant         GM_deleteValue
// @grant         GM_openInTab
// @grant         GM_addValueChangeListener
// @require       https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		    document-end
// @downloadURL https://update.greasyfork.org/scripts/454155/%E5%BF%AB%E9%80%9F%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/454155/%E5%BF%AB%E9%80%9F%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

https: (() => {
    var info = {
        time: new Date().toLocaleString(),
        state: {
            homePage: "检测到网站主页",
            do: "签到成功",
            done: "签到已完成",
            undone: "签到失败",
            unknown: "未知错误",
        },
        message: {
            true: "今日已经签到",
            false: "今日未签到",
            yes: "加载成功,返回数据:getData()",
            no: "加载失败,返回空数组:getData()",
            none: "签到按钮没找到",
            again: "再次尝试",
            found: "发现签到按钮",
        },
    };
    var message = {
        homePage: `${info.state.homePage},${location.host} ,${info.time}`,
        do: `${info.state.do},${location.host} ,${info.time}`,
        done: `${info.state.done},${location.host} ,${info.time}`,
        undone: `${info.state.undone},${location.host} ,${info.time}`,
        unknown: `${info.state.unknown},${location.host} ,${info.time}`,
    };
    //延时主程序
    if (location.host.indexOf("www.52pojie.cn") != -1) {
        var btn = document.querySelector(
            "#um > p:nth-child(3) > a:nth-child(1) > img"
        );
        if (btn) {
            window.open(
                "https://www.52pojie.cn/home.php?mod=task&do=apply&id=2",
                "_self"
            );
            sign(location.host, btn, info.time);
        }
    }
    if (location.host.indexOf("iopq.net") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }
    if (location.host.indexOf("gmbuluo.net") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }
    if (location.host.indexOf("lspm2.net") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }
    if (location.host.indexOf("sf2.net") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }
    if (location.host.indexOf("77boss.com") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }
    if (location.host.indexOf("108pc.com") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }
    if (location.host.indexOf("ruciwan.com") != -1) {
        setTimeout(function() {
            main();
        }, 3000);
    }

    function main() {
        const loginBtn = document.querySelector(".fastlg_l>.pn");
        const btn = document.querySelector("#g_upmine");
        if (isLogin(loginBtn)) {
            return;
        }
        if (isToday(location.host)) {
            if (getData(location.host)[0].state) {
                console.log(info.state.done);
                return;
            } else {
                //开始签到
                console.log(message.undone);
                console.log(info.message.again);
                sign(location.host, btn, info.time);
            }
        }
        sign(location.host, btn, info.time);
    }
    //签到打卡
    function sign(host, btn, time) {
        if (btn) {
            console.log(btn, info.message.found);
            btn.click();
            console.log("点击完成,跳转新页面");
            if (location.href.indexOf("usergroup") != -1) {
                saveData(host, btn, time);
                console.log(message.do);
            } else {
                console.log("未知错误");
            }
        } else {
            console.log(info.message.none);
            saveData(host, btn, time);
            console.log(message.undone);
        }
    }
    //判断是否登录  loginBtn是登录按钮
    function isLogin(loginBtn) {
        console.log("登录按钮检测");
        if (loginBtn) {
            console.log("登录按钮存在");
            console.log("请登录");
            return true;
        } else {
            console.log("已经登陆");
            return false;
        }
    }

    //判断当日是否签到过
    function isToday(host) {
        console.log("准备读取本地数据");
        let lastSignDate = getData(host);
        console.log(
            lastSignDate,
            `数组长度:${lastSignDate.length}`,
            "加载本地存储数据:isToday()"
        );
        if (lastSignDate && lastSignDate.length !== 0) {
            let isClock =
                lastSignDate[0].time.substr(0, 9) === new Date().toLocaleDateString();
            console.log(
                isClock ? info.message.true : info.message.false,
                lastSignDate[0].time
            );
            return isClock;
        }
        return false;
    }
    //获取数据
    function getData(host) {
        var data = GM_getValue(host);
        // console.log(data, data ? info.message.yes : info.message.no);
        return data ? data : [];
    }
    //保存数据
    function saveData(host, btn, time) {
        console.log("准备保存数据");
        var data = getData(host);
        console.log(data, "获取旧数据");
        deleteData(host);
        console.log(data, "删除旧数据");
        data.push({
            state: btn ? true : false,
            time: time,
            message: btn ? info.state.do : info.state.undone,
        });
        GM_setValue(host, data);
        console.log(data, "保存新数据");
        console.log("数据保存成功");
    }
    //删除数据
    function deleteData(host) {
        GM_deleteValue(host);
    }
})();