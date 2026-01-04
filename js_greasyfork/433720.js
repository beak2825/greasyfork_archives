/** @format */

// ==UserScript==
// @name         jueshi4
// @namespace    https://baidu.com
// @version      4.3
// @description  绝世神功
// @author       suoa
// @require https://cdn.staticfile.org/jquery//2.0.2/jquery.min.js
// @match        *://fa.jygame.net/jssg/h5/zhuzhu.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433720/jueshi4.user.js
// @updateURL https://update.greasyfork.org/scripts/433720/jueshi4.meta.js
// ==/UserScript==

(function () {
    window.hook_ = {};
    window.jssg = {};
    window.hook_.parseIntCount = 0;
    window.jssg.zdgj = 0;
    window.jssg.cs = 0;
    window.hook_.parseInt_ = parseInt;
    window.jssg.zjdt = 0;
    window.jssg.xhzjid = 0;
    window.jssg.jscs = 0;
    window.gjlx = 0;
    //排序
    window.PX = function (a, b) {
        return b.maxHp - a.maxHp;
    };
    parseInt = function (x) {
        window.hook_.parseIntCount = window.hook_.parseIntCount + 1;
        if (window.hook_.parseIntCount == 3) {
            return 999999999999;
        }
        return window.hook_.parseInt_(x);
    };
    window.jqyb = function (str) {
        let index = str.lastIndexOf("-");
        if (index > -1) {
            str = str.substring(index + 1, str.length);
        }
        return str;
    };
    //人物离开
    window.rwsc = function (id) {
        try {
            for (let index = 0; index < window.hook_websock.r.length; index++) {
                if (window.hook_websock.r[index].id == id) {
                    window.hook_websock.r.splice(index, 1);
                    window.hook_websock.r = window.hook_websock.r.sort(fwindow.PX);
                }
            }
        } catch (error) {
        }
    };

    function ks() {
        if (window.hook_websock.oksock.length > 0) {
            if (window.hook_websock.oksock[0].readyState == 1) {
                setTimeout(jszr(0), 1000);
                window.clearInterval(window.hook_websock.dsqid);
                window.hook_websock.ljs = 1;
            }
        }
    }

    //监听连接
    function jkxlj() {
        if (window.hook_websock.ljs != window.hook_websock.oksock.length) {
            window.hook_websock.ljs = window.hook_websock.oksock.length;
            setTimeout(jszr(window.hook_websock.oksock.length - 1), 1000);
        }
    }

    //声音提示
    function jszr(ljsy) {
        mjs = window.hook_websock.oksock[ljsy].onmessage;
        window.hook_websock.oksock[ljsy].onmessage = function (msg) {
            var newmsg = msg;
            Object.defineProperty(newmsg, "data", {
                value: window.hook_websock.sjcl(newmsg.data),
            });
            try {
                mjs.apply(this, [newmsg]);
            } catch (error) {
            }
        };
        let mp3 = "https://cp.zyl1230.com/ts.mp3";
        let audio = new Audio(mp3);
        try {
            //audio.play() // 播放音频对象
        } catch (error) {
        }
        if (ljsy > 0) {
            window.clearInterval(window.hook_websock.gjqid);
        }
        window.hook_websock.gjqid = setTimeout(zdgj, 1100);
        window.dqsy = ljsy;
        if (window.hook_websock.oksock.length == 1) {
            setInterval(jkxlj, 1500);
        }
    }

    ("use strict");

    window.hook_websock = {}; //创建hook对象
    window.hook_websock.ysock = WebSocket; //保存原有web对象
    window.hook_websock.oksock = []; //创建sock连接数组
    //添加名字
    window.hook_websock.tjmz = function (mzid, mz, qf) {
        var data = {
            mzid: mzid,
            mz: jqyb(mz),
            qf: qf,
        };
        $.ajax({
            type: "post",
            url: "https://134.175.38.223/jueshi/mz/tj",
            data: data,
            success: function (fdata) {
                if (fdata.code === 0) {
                    window.hook_websock.mz.push(data);
                    console.log("添加成功");
                }
            },
        });
    };
    //寻找名字
    window.xzmz = function (id, ym) {
        for (let index = 0; index < window.hook_websock.mz.length; index++) {
            if (window.hook_websock.mz[index].mzid === id) {
                return window.hook_websock.mz[index].mz;
            }
        }
        return ym;
    };
    //自动攻击
    window.zdgj = function () {
        if (
            window.jssg.dtid != undefined &&
            window.hook_websock.r != undefined &&
            window.jssg.dtid != 6010 &&
            window.jssg.dtid != 10 &&
            window.jssg.dtid !== 220
        ) {
            if (window.jssg.bossid === 81120 || window.jssg.bossid === 81110 || window.jssg.bossid === 81130) {
                try {
                    window.hook_websock.oksock[window.dqsy].send(gjsj(window.jssg.bossid, 1));
                } catch (error) {
                    console.log(error);
                }
                return;
            }
            window.hook_websock.r = window.hook_websock.r.sort(window.PX);
            for (let index = 0; index < window.hook_websock.r.length; index++) {
                if (window.hook_websock.r[index].country != window.jssg.zy) {
                    if (sfhmd(window.hook_websock.r[index].id)) {
                        if (window.gjlx === 1) {
                            setTimeout(function () {
                                try {
                                    window.hook_websock.oksock[window.dqsy].send(
                                        gjsj(window.hook_websock.r[index].id, 10)
                                    );
                                    window.gjlx = 0;
                                } catch (error) {
                                    console.log(error);
                                }
                            }, 900)
                        } else {
                            try {
                                window.hook_websock.oksock[window.dqsy].send(
                                    gjsj(window.hook_websock.r[index].id, 10)
                                );
                                window.gjlx = 0;
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        return;
                    }
                }
            }
            if (window.jssg.bossid != undefined && window.jssg.bossid != 0) {
                if (window.jssg.zdgj == 1) {
                    if (window.gjlx === 0) {
                        setTimeout(function () {
                                try {
                                    window.hook_websock.oksock[window.dqsy].send(
                                        gjsj(window.jssg.bossid, 1)
                                    );
                                } catch (error) {
                                    console.log(error);
                                }
                            },
                            900
                        )

                    } else {
                        try {
                            window.hook_websock.oksock[window.dqsy].send(
                                gjsj(window.jssg.bossid, 1)
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    window.gjlx = 1;
                    return;
                }
            }
        }
    };
    //攻击数据
    window.gjsj = function (id, lx) {
        lsdx = {
            target: id,
            type: lx,
            sid: window.hook_websock.jn[window.hook_websock.jnsy].id,
            cmd: 1003,
        };
        window.hook_websock.jnsy++;
        if (window.hook_websock.jnsy > 5) {
            window.hook_websock.jnsy = 0;
        }
        return JSON.stringify(lsdx);
    };
    window.jssg.smbl = 40;
    //是否黑名单
    window.sfhmd = function (id) {
        for (let index = 0; index < window.hook_websock.mz.length; index++) {
            if (window.hook_websock.mz[index].mzid == id) {
                if (window.hook_websock.mz[index].hmd != 2) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    };
    WebSocket = function (url, protocols) {
        //重写websock
        this.cxsend = function (msg) {
        };
        var cxscok = new Object();
        cxscok.ID = window.hook_websock.oksock.length + 1;
        var cjysock = new window.hook_websock.ysock(url, protocols);
        cjysock.cxsend = cjysock.send;
        cjysock.send = (msg) => {
            try {
                let lsdx = JSON.parse(msg);
                if (lsdx.cmd != undefined && lsdx.cmd === 1018) {
                    window.jssg.zjdt = lsdx.map;
                    //console.log('准备进入'+window.jssg.zjdt);
                }
                cjysock.cxsend(msg);
            } catch (error) {
            }
        };
        window.hook_websock.oksock.push(cjysock);
        return cjysock;
    };
    //数据处理
    window.hook_websock.sjcl = function (data) {
        var dx = JSON.parse(data);
        try {
            switch (dx.cmd) {
                case 1003:
                    if (dx.message != undefined && dx.message != "") {
                    } else {
                        setTimeout(zdgj, 1000);
                    }
                    break;
                case 1:
                    let script = document.createElement("link");
                    script.setAttribute("rel", "stylesheet");
                    script.setAttribute("type", "text/css");
                    script.href =
                        "https://i.gtimg.cn/vipstyle/frozenui/2.0.0/css/frozen.css";
                    document.documentElement.appendChild(script);
                    $("body").append(
                        '<div class="ui-row-flex ui-whitespace ui-tooltips-action"><button class="ui-btn ui-btn-primary ui-col " type="submit" id="kg">攻击</button><button class="ui-btn ui-btn-primary ui-col " type="submit" id="zj">召集</button><button class="ui-btn ui-btn-primary ui-col " type="submit" id="js">解散</button><button class="ui-btn ui-btn-primary ui-col " type="submit" id="kzj">开召</button><button class="ui-btn ui-btn-primary ui-col " type="submit" id="tp">逃跑</button><button class="ui-btn ui-btn-primary ui-col " type="submit" id="lq">领</button></div></div>'
                    );
                    $("#kg").click(function () {
                        if (window.jssg.zdgj === 0) {
                            window.jssg.zdgj = 1;
                            zdgj();
                            $("#kg").text("停止");
                        } else {
                            window.jssg.zdgj = 0;
                            $("#kg").text("攻击");
                        }
                    });
                    $("#zj").click(function () {
                        if (window.jssg.zjdt != 0) {
                            window.hook_websock.oksock[window.dqsy].send(
                                JSON.stringify({map: window.jssg.zjdt, cmd: 7030})
                            );
                        }
                    });
                    $("#lq").click(function () {
                        for (let index = 0; index < 3; index++) {
                            window.hook_websock.oksock[window.dqsy].send(
                                JSON.stringify({cmd: 3005})
                            );
                        }
                        for (let index = 0; index < 3; index++) {
                            window.hook_websock.oksock[window.dqsy].send(
                                JSON.stringify({cmd: 2202})
                            );
                        }
                    });
                    $("#js").click(function () {
                        window.hook_websock.oksock[window.dqsy].send(
                            JSON.stringify({convention: window.jssg.jscs, cmd: 7033})
                        );
                    });
                    $("#kzj").click(function () {
                        if ($("#kzj").text() == "开召") {
                            window.hook_websock.oksock[window.dqsy].send(
                                JSON.stringify({convention: window.jssg.jscs, cmd: 7033})
                            );
                            window.hook_websock.oksock[window.dqsy].send(
                                JSON.stringify({map: window.jssg.zjdt, cmd: 7030})
                            );
                            window.jssg.xhzjid = setInterval(function () {
                                //先解散再召集
                                window.hook_websock.oksock[window.dqsy].send(
                                    JSON.stringify({convention: window.jssg.jscs, cmd: 7033})
                                );
                                window.hook_websock.oksock[window.dqsy].send(
                                    JSON.stringify({map: window.jssg.zjdt, cmd: 7030})
                                );
                            }, 30000);
                            $("#kzj").text("停召");
                        } else {
                            window.clearInterval(window.jssg.xhzjid);
                            window.hook_websock.oksock[window.dqsy].send(
                                JSON.stringify({convention: window.jssg.jscs, cmd: 7033})
                            );
                            $("#kzj").text("开召");
                        }
                    });
                    $("#tp").click(function () {
                        window.hook_websock.oksock[window.dqsy].send(
                            JSON.stringify({cmd: 1005})
                        );
                    });
                    window.jssg.zy = dx.data.player.country;
                    window.jssg.rwid = dx.data.player.id;
                    window.hook_websock.r = [];
                    switch (window.jssg.rwid) {
                        case 17372025:
                            window.jssg.smbl = 25;
                            break;
                        case 173755:
                            window.jssg.smbl = 25;
                            break;
                        case 1715950:
                            window.jssg.smbl = 20;
                            break;
                        default:
                            window.jssg.smbl = 40;
                            break;
                    }
                    break;
                case 3:
                    if (
                        dx.data.roleInfo != undefined &&
                        dx.data.roleInfo.country != undefined
                    ) {
                        window.jssg.zy = dx.data.roleInfo.country;
                    }
                    if (dx.data.roleInfo.sync.conventionId != undefined) {
                        window.jssg.jscs = dx.data.roleInfo.sync.conventionId;
                    }
                    break;
                case 1000:
                    try {
                        window.jssg.dtid = dx.data.map;
                    } catch (error) {
                    }
                    break;
                case 7019:
                    try {
                        window.jssg.dtid = dx.data.map;
                    } catch (error) {
                    }
                    break;
                case 1001:
                    window.jssg.zdgj = 1;
                    //setTimeout(zdgj, 500);
                    try {
                        window.jssg.rwzx = dx.data.mapData.hp;
                    } catch (error) {
                    }
                    if (
                        dx.data.mapData.monsters != undefined &&
                        dx.data.mapData.monsters.length > 0
                    ) {
                        window.jssg.bossid = dx.data.mapData.monsters[0].id;
                        window.jssg.bszx = dx.data.mapData.monsters[0].maxHp;
                        window.jssg.bssx = dx.data.mapData.monsters[0].hp;
                        window.jssg.zdgj = 1;
                        setTimeout(zdgj, 500);
                    } else {
                        window.jssg.bossid = 0;
                        setTimeout(zdgj, 100);
                    }
                    for (let index = 0; index < dx.data.mapData.players.length; index++) {
                        if (
                            dx.data.mapData.players[index].name == "蒙面人" ||
                            dx.data.mapData.players[index].name == "蒙面侠客"
                        ) {
                            dx.data.mapData.players[index].name = xzmz(
                                dx.data.mapData.players[index].id,
                                dx.data.mapData.players[index].name
                            );
                        }
                    }
                    if (
                        dx.data.mapData.copy != undefined &&
                        dx.data.mapData.copy.length > 0
                    ) {
                        for (let index = 0; index < dx.data.mapData.copy.length; index++) {
                            if (
                                dx.data.mapData.copy[index].name == "蒙面人" ||
                                dx.data.mapData.copy[index].name == "蒙面侠客"
                            ) {
                                dx.data.mapData.copy[index].name = xzmz(
                                    dx.data.mapData.copy[index].id,
                                    dx.data.mapData.copy[index].name
                                );
                            }
                        }
                    }
                    window.hook_websock.jn = dx.data.mapData.skills;
                    window.hook_websock.jnsy = 0;
                    if (dx.data.mapData.players != undefined) {
                        if (jssg.cs > 0) {
                            window.hook_websock.r = dx.data.mapData.players;
                            window.hook_websock.r = window.hook_websock.r.sort(window.PX);
                        } else {
                            jssg.cs = 1;
                        }
                    }
                    break;
                case 1500:
                    if (
                        (dx.data.chat.type != undefined && dx.data.chat.type == 1) ||
                        dx.data.chat.type == 4
                    ) {
                        window.hook_websock.tjmz(
                            dx.data.chat.pid,
                            dx.data.chat.name,
                            dx.data.chat.server
                        );
                    }
                    break;
                case 1004:
                    if (
                        dx.data.msg != undefined &&
                        dx.data.msg.type != undefined &&
                        dx.data.msg.type == 4 &&
                        (dx.data.msg.ext.name == "蒙面人" ||
                            dx.data.msg.ext.name == "蒙面侠客")
                    ) {
                        window.jssg.dtid = dx.data.msg.map;
                        dx.data.msg.ext.name = xzmz(
                            dx.data.msg.ext.id,
                            dx.data.msg.ext.name
                        );
                        window.hook_websock.r.push({
                            id: dx.data.msg.ext.id,
                            name: dx.data.msg.ext.name,
                            country: dx.data.msg.ext.country,
                        });
                        setTimeout(zdgj, 1000);
                    }
                    if (dx.data.mapPlayerList != undefined) {
                        for (let index = 0; index < dx.data.mapPlayerList.length; index++) {
                            if (
                                dx.data.mapPlayerList[index].name == "蒙面人" ||
                                dx.data.mapPlayerList[index].name == "蒙面侠客"
                            ) {
                                dx.data.mapPlayerList[index].name = xzmz(
                                    dx.data.mapPlayerList[index].id
                                );
                            }
                        }
                        window.hook_websock.r = dx.data.mapPlayerList;
                        setTimeout(zdgj, 500);
                    }
                    if (
                        dx.data.msg != undefined &&
                        dx.data.msg.type != undefined &&
                        dx.data.msg.type == 5
                    ) {
                        rwsc(dx.data.msg.target);
                        setTimeout(zdgj, 100);
                    }
                    //血量返回1

                    if (
                        dx.data.msg != undefined &&
                        dx.data.msg.type != undefined &&
                        dx.data.msg.type == 3 &&
                        window.jssg.dtid != 10014 &&
                        window.jssg.dtid != 10015 &&
                        window.jssg.dtid != 10016
                    ) {
                        if (dx.data.msg.target == window.jssg.rwid) {
                            let bl = (dx.data.msg.events[0].bHp / window.jssg.rwzx) * 100;
                            console.log(dx.data.msg.events[0].bHp, bl);
                            if (dx.data.msg.events[0].bHp < 60000 || bl < window.jssg.smbl) {
                                window.hook_websock.oksock[window.dqsy].send(
                                    JSON.stringify({cmd: 1005})
                                );
                                console.log("逃跑1");
                                window.jssg.bossid = 0;
                                break;
                            }
                        }
                        /* if (dx.data.msg.target == window.jssg.bossid) {
                            if (
                                dx.data.msg.events[0].bHp <= 0 &&
                                window.jssg.dtid != 6290 &&
                                window.jssg.dtid != 6300 &&
                                window.jssg.dtid != 6310 &&
                                window.jssg.dtid != 6320 &&
                                window.jssg.dtid != 6330 &&
                                window.jssg.dtid != 6340 &&
                                window.jssg.dtid != 10014 &&
                                window.jssg.dtid != 10015 &&
                                window.jssg.dtid != 10016
                            ) {
                                setTimeout(function () {
                                    window.hook_websock.oksock[window.dqsy].send(
                                        JSON.stringify({cmd: 1005})
                                    );
                                    console.log("怪物死1");
                                    window.jssg.bossid = 0;
                                }, 900)
                                break;
                            }
                        } */
                    }
                    //血量返回2
                    if (
                        dx.data.msg != undefined &&
                        dx.data.msg.type != undefined &&
                        dx.data.msg.type == 2
                    ) {
                        if (dx.data.msg.target == window.jssg.rwid) {
                            let bl = (dx.data.msg.ext.value / window.jssg.rwzx) * 100;
                            console.log(data.msg.ext.value, bl);
                            if (dx.data.msg.ext.value < 60000 || bl < window.jssg.smbl) {
                                window.hook_websock.oksock[window.dqsy].send(
                                    JSON.stringify({cmd: 1005})
                                );
                                console.log("逃跑2");
                                window.jssg.bossid = 0;
                                break;
                            }
                        }
                        /* if (dx.data.msg.target == window.jssg.bossid) {
                            if (
                                dx.data.msg.hp <= 0 &&
                                window.jssg.dtid != 6290 &&
                                window.jssg.dtid != 6300 &&
                                window.jssg.dtid != 6310 &&
                                window.jssg.dtid != 6320 &&
                                window.jssg.dtid != 6330 &&
                                window.jssg.dtid != 6340 &&
                                window.jssg.dtid != 10014 &&
                                window.jssg.dtid != 10015 &&
                                window.jssg.dtid != 10016
                            ) {
                                setTimeout(function () {
                                    window.hook_websock.oksock[window.dqsy].send(
                                        JSON.stringify({cmd: 1005})
                                    );
                                    console.log("怪物死2");
                                    window.jssg.bossid = 0;
                                }, 900)
                                break;
                            }
                        } */
                        if (dx.data.msg.target == window.jssg.rwid) {
                            let bl = (dx.data.msg.ext.value / window.jssg.rwzx) * 100;
                            console.log(data.msg.ext.value, bl);
                            if (dx.data.msg.ext.value < 60000 || bl < window.jssg.smbl) {
                                window.hook_websock.oksock[window.dqsy].send(
                                    JSON.stringify({cmd: 1005})
                                );
                                console.log("逃跑2");
                                window.jssg.bossid = 0;
                                break;
                            }
                        }
                        if (dx.data.msg.target == window.jssg.bossid) {
                            if (
                                dx.data.msg.hp <= 0 &&
                                window.jssg.dtid != 6290 &&
                                window.jssg.dtid != 6300 &&
                                window.jssg.dtid != 6310 &&
                                window.jssg.dtid != 6320 &&
                                window.jssg.dtid != 6330 &&
                                window.jssg.dtid != 6340 &&
                                window.jssg.dtid != 10014 &&
                                window.jssg.dtid != 10015 &&
                                window.jssg.dtid != 10016
                            ) {
                                window.hook_websock.oksock[window.dqsy].send(
                                    JSON.stringify({cmd: 1005})
                                );
                                console.log("怪物死2");
                                window.jssg.bossid = 0;
                                break;
                            }
                        }
                    }
                    //图内刷bbos
                    if (
                        dx.data.msg != undefined &&
                        dx.data.msg.type != undefined &&
                        dx.data.msg.type == 6
                    ) {
                        window.jssg.bossid = dx.data.msg.ext.id;
                        window.jssg.bszx = dx.data.msg.ext.maxHp;
                        window.jssg.bssx = dx.data.msg.ext.hp;
                        setTimeout(zdgj, 500);
                    }
                    if (dx.data.bossTarget != undefined && window.jssg.zy != undefined) {
                        if (dx.data.bossTarget.name == null) {
                            window.jssg.zdgj = 1;
                            setTimeout(zdgj, 500);
                            break;
                        }
                        if (dx.data.bossTarget.country != window.jssg.zy) {
                            window.jssg.zdgj = 0;
                            $("#kg").text("攻击");
                        } else {
                            window.jssg.zdgj = 1;
                            $("#kg").text("停止");
                            setTimeout(zdgj, 500);
                        }
                    }
                    if (dx.data.msg != undefined &&
                        dx.data.msg.type != undefined &&
                        dx.data.msg.type == 6) {
                        if (window.jssg.bossid === 81120 || window.jssg.bossid === 81110 || window.jssg.bossid === 81130) {
                            window.jssg.bossid = dx.$data.msg.target;
                        }
                    }
                    break;
                case 4200:
                    /* window.hook_websock.oksock[window.dqsy].send(
                        JSON.stringify({cmd: 1005})
                    ); */
                    console.log("宝藏完");
                    break;
                case 1005:
                    setTimeout(function(){
                        window.jssg.zdgj = 0;
                        $("#kg").text("攻击");
                    },800)
                    break;

            }
        } catch (error) {
        }
        if (dx.message == "E00006" || dx.message == "E00002") {
            if (
                window.jssg.dtid == 6290 ||
                window.jssg.dtid == 6300 ||
                window.jssg.dtid == 6310 ||
                window.jssg.dtid == 6320 ||
                window.jssg.dtid == 6330 ||
                window.jssg.dtid == 6340
            ) {
                window.jssg.bossid = 0;
            }
        }
        return JSON.stringify(dx);
    };
    window.hook_websock.dsqid = setInterval(ks, 10);
    //获取全部名字信息
    $.ajax({
        url: "https://134.175.38.223/jueshi/mz/hq",
        success: function (data) {
            window.hook_websock.mz = data.data;
        },
    });
})();
