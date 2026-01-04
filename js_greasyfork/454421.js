// ==UserScript==
// @name          打开新页面
// @namespace     http://tampermonkey.net
// @version       0.2.26
// @description   签到工具
// @author        树
// @license       License
// @match         https://www.baidu.com/*
// @match         https://www.zhihu.com/*
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
// @grant         GM_deleteValue
// @grant         GM_openInTab
// @grant         GM_addValueChangeListener
// @require       https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		  document-end
// @downloadURL https://update.greasyfork.org/scripts/454421/%E6%89%93%E5%BC%80%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454421/%E6%89%93%E5%BC%80%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

https: (() => {
    var info = {
        time: new Date().toLocaleString(),
        date: new Date().toLocaleDateString(),
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
        },
    };
    var message = {
        homePage: `${info.state.homePage},${location.host} ,${info.time}`,
        do: `${info.state.do},${location.host} ,${info.time}`,
        done: `${info.state.done},${location.host} ,${info.time}`,
        undone: `${info.state.undone},${location.host} ,${info.time}`,
        unknown: `${info.state.unknown},${location.host} ,${info.time}`,
    };
    var newTap;
    var timer = null;
    var loginBtn = document.querySelector(".fastlg_l .pn");
    var btn = document.querySelector("#g_upmine");
    //延时主程序
    function pojie() {
        var btn = document.querySelector(
            "#um > p:nth-child(3) > a:nth-child(1) > img"
        );
        var end = document.querySelector(".qq_bind");
        if (end) {
            console.log("签到已完成");
            return;
        }
        if (btn) {
            window.open(
                "https://www.52pojie.cn/home.php?mod=task&do=apply&id=2",
                "_self"
            );
            sign(location.host, btn, info.time);
        }
    }

    if (location.host.indexOf("52pojie.cn") > -1) {
        pojie();
        newTap();
    } else if (location.host.indexOf("iopq.net") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 3000);
    } else if (location.host.indexOf("gmbuluo.net") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 4000);
    } else if (location.host.indexOf("lspm2.net") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 3000);
    } else if (location.host.indexOf("sf2.net") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 3000);
    } else if (location.host.indexOf("77boss.com") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 3000);
    } else if (location.host.indexOf("108pc.com") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 3000);
    } else if (location.host.indexOf("ruciwan.com") > -1) {
        var btn = document.querySelector("#g_upmine");
        setTimeout(function() {
            if (btn) {
                console.log("预备");
                btn.click();
                main(loginBtn, btn);
            } else {
                console.log("按钮没有刷新出来");
                return;
            }
        }, 10000);
    } else if (location.host.indexOf("y986.com") > -1) {
        btn = document.querySelector("#_sign_btn");
        var sure = document.querySelector(".register");
        setTimeout(function() {
            main(loginBtn, btn);
            if (sure) {
                console.log(host, "确认完成");
                sure.click();
            } else {
                console.log(host, "按钮未刷新");
            }
        }, 8000);
    } else if (location.host.indexOf("www.8808gm.com") > -1) {
        setTimeout(function() {
            main(loginBtn, btn);
        }, 8000);
    } else if (location.host.indexOf("88m2.com") > -1) {
        btn = document.querySelector("#myprompt");
        setTimeout(function() {
            main(loginBtn, btn);
        }, 3000);
    } else if (location.host.indexOf("ydwgame.net") > -1) {
        const btn2 = document.querySelector(".bd>.btn");
        console.log(btn2);
        if (btn2) {
            btn2.click();
        }
        const dk = document.querySelector("#mn_N3c10>a");
        setTimeout(function() {
            const loginBtn = document.querySelector(".deandlu");
            const btn = document.querySelector(".signbtn>.btna");
            dk.click();
            main(loginBtn, btn);
        }, 3000);
    }

    function newTap() {
        var arr = [
            "www.iopq.net",
            "www.gmbuluo.net",
            "www.lspm2.net",
            "www.sf2.net",
            "www.77boss.com",
            "www.108pc.com",
            "www.ruciwan.com",
            "www.y986.com",
            "www.8808gm.com",
            "www.88m2.com",
            "www.ydwgame.net",
        ];
        for (let i = 0; i < arr.length; i++) {
            var host;
            setTimeout(function() {
                host = arr[i];
                console.log("打开新窗口");
                onpenNewTap(host);
                listenNewTap(host);
                //
                console.log(getData(host)[0]);
                console.log(getData(host)[0].time);
                if (
                    getData(host)[0].time.substr(0, 10) === info.date &&
                    getData(host)[0].state
                ) {
                    setTimeout(function() {
                        console.log("今日已经签到,延时2秒关闭");
                        console.log("关闭新窗口");
                        closeNewTap();
                    }, 2000);
                } else {
                    console.log("测试情况");
                    return;
                }
            }, 10000 * i);
        }
    }
    //打开新页面
    function onpenNewTap(host) {
        if (location.host.indexOf("ydwgame.net") > -1) {
            newTap = GM_openInTab(`http://${host}`, {
                active: true,
                setParent: true,
            });
            getData(host);
        } else {
            newTap = GM_openInTab(`https://${host}`, {
                active: true,
                setParent: true,
            });
            getData(host);
        }
    }
    //关闭页面
    function closeNewTap() {
        if (timer !== null) {
            console.log(timer, "清空定时器");
            clearInterval(timer);
            timer = null;
        }
        newTap.close();
    }
    //监听新标签页的状态
    function listenNewTap(host) {
        console.log("开始监控存储值情况");
        GM_addValueChangeListener(
            host,
            function(name, old_value, new_value, remote) {
                console.log("存储值有变化");
                console.log(`签到状态: `, new_value[0]);
                if (new_value[0].time.substr(0, 10) == info.date) {
                    setTimeout(function() {
                        console.log("今日未签到,延时5秒关闭");
                        console.log("关闭窗口");
                        closeNewTap();
                    });
                } else {
                    console.log("处理情况");
                }
            }
        );
    }

    //主程序
    function main(loginBtn, btn) {
        if (isLogin(loginBtn)) {
            console.log("没有登录");
            return;
        }
        if (isToday(location.host)) {
            if (getData(location.host)[0].state) {
                console.log(message.done);
                return;
            } else {
                //开始签到
                console.log(message.undone);
                console.log("再次尝试");
                sign(location.host, btn, info.time);
            }
        } else {
            console.log("开始签到");
            sign(location.host, btn, info.time);
        }
    }
    //签到打卡
    function sign(host, btn, time) {
        if (btn) {
            console.log(btn, "发现签到按钮");
            btn.click();
            console.log("点击完成,跳转新页面");
            if (location.href.indexOf("usergroup" || "notice" || "index.php") != -1) {
                saveData(host, btn, time);
                console.log(message.do);
                return;
            } else {
                console.log("未知错误");
                return;
            }
        } else {
            console.log("签到按钮没找到");
            saveData(host, btn, time);
            console.log(message.undone);
            return;
        }
    }
    //判断是否登录  loginBtn是登录按钮
    function isLogin(loginBtn) {
        console.log("登录按钮检测");
        if (loginBtn) {
            console.log(loginBtn, "登录按钮存在");
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
        let data = getData(host);
        console.log(
            data[0],
            `数组长度:${data.length}`,
            "加载本地存储数据:isToday()"
        );
        if (data && data.length !== 0) {
            let isClock = data[0].time.substr(0, 10) === info.date;
            console.log(
                isClock ? info.message.true : info.message.false,
                ` 签到时间:${data[0].time},签到状态:${data[0].state}`
            );
            return isClock;
        }
        return false;
    }
    //获取数据
    function getData(host) {
        var data = GM_getValue(host);
        // console.log(`${host}数据:`,data,data[0],data ? info.message.yes : info.message.no);
        if (data && data.length > 1) {
            console.log("正在清空数据中..");
            deleteData(host);
        }
        if (!data) {
            data = [];
            data.unshift({
                url: host,
                state: false,
                time: "2020/01/01",
                message: "初始化",
            });
        }
        return data;
    }
    //保存数据
    function saveData(host, btn, time) {
        console.log("准备保存数据");
        var data = getData(host);
        console.log(data[0], "获取旧数据");
        if (data && data.length !== 0) {
            console.log("数据存在");
            data.splice(0, 1, {
                url: host,
                state: btn ? true : false,
                time: time,
                message: btn ? info.state.do : info.state.undone,
            });
            GM_setValue(host, data);
            console.log(data[0], "修改后数据");
        } else {
            console.log("数据不存在,添加新数据");
            data.unshift({
                url: host,
                state: btn ? true : false,
                time: time,
                message: btn ? info.state.do : info.state.undone,
            });
            GM_setValue(host, data);
            console.log(data[0], "保存后新数据");
        }
        console.log("数据保存成功");
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }
    //删除数据
    function deleteData(host) {
        GM_deleteValue(host);
    }
})();