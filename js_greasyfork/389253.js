// ==UserScript==
// @name        仅更改部分排序规则后作为自用
// @namespace   来自于苏青
// @version     0.5.4
// @author      SuQing
// @date        2019/03/22
// @modified    2019/08/02
// @match       http://*.wsmud.com/*
// @homepage    https://greasyfork.org/zh-CN/scripts/387999
// @description Game Script of WSMud
// @run-at      document-start
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/389253/%E4%BB%85%E6%9B%B4%E6%94%B9%E9%83%A8%E5%88%86%E6%8E%92%E5%BA%8F%E8%A7%84%E5%88%99%E5%90%8E%E4%BD%9C%E4%B8%BA%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/389253/%E4%BB%85%E6%9B%B4%E6%94%B9%E9%83%A8%E5%88%86%E6%8E%92%E5%BA%8F%E8%A7%84%E5%88%99%E5%90%8E%E4%BD%9C%E4%B8%BA%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function(window) {
    "use strict";
    let cloneObject, autoScroll, queue, setTitle, alert, say, getTime, addStyle;
    let websocket, monitor, fakeEvent, progress;
    let cmd, cmds, time_send, timeout_fight, checkState, softerColor, commandsBar;
    let listenerOnSend, listenerOnMessage, listenerOnClose, listenerGetData, listenerGetText;
    let id, name, state, family, cmds_work;
    let roles, npcs, packs, skills, room1, room2, exit, perform;
    let hp, max_hp, mp, max_mp, limit_mp, jing, qian, hurt;
    let reconnect = true, debug = false;
    let closeDialog, getMethodWithEventType, methodToParseData, getItemsAfterSort, getSkillsAfterSort;
    let task, id_sm, id_wdt;
    let $killall, $npc, $item;

    cmd = {
        goeast: "go east",
        goeastup: "go eastup",
        gowest: "go west",
        gowestup: "go westup",
        gonorth: "go north",
        gonorthup: "go northup",
        gosouth: "go south",
        gosouthup: "go southup",
        gosouthwest: "go southwest",
        gosoutheast: "go southeast",
        gonorthwest: "go northwest",
        gonortheast: "go northeast",
        goup: "go up",
        godown: "go down",
        goenter: "go enter",
        breakbi: "break bi",
        opendoor: "open door",
        jumpdown: "jump down",
        score: "score",
        pack: "pack",
        cha: "cha",
        tasks: "tasks",
        stopstate: "stopstate",
        dazuo: "dazuo",
        liaoshang: "liaoshang",
        relive: "relive",
        relivelocal: "relive locale",
        store: "store",
        sellall: "sell all",
        wakuang: "wakuang",
        wa: "wa",
        xiulian: "xiulian",
        yangzhou:  "jh fam 0 start",
        wudang:    "jh fam 1 start",
        shaolin:   "jh fam 2 start",
        huashan:   "jh fam 3 start",
        emei:      "jh fam 4 start",
        xiaoyao:   "jh fam 5 start",
        gaibang:   "jh fam 6 start",
        shashou:   "jh fam 7 start",
        xiangyang: "jh fam 8 start",
        wudaota:   "jh fam 9 start"
    };
    cmds = {};
    cmds.扬州 = {
        醉仙楼: [cmd.yangzhou, cmd.gonorth, cmd.gonorth, cmd.goeast, 512, "list $npc(店小二)"],
        杂货铺: [cmd.yangzhou, cmd.goeast, cmd.gosouth, 512, "list $npc(杨永福)"],
        打铁铺: [cmd.yangzhou, cmd.goeast, cmd.goeast, cmd.gosouth, 512, "list $npc(铁匠)"],
        药铺: [cmd.yangzhou, cmd.goeast, cmd.goeast, cmd.gonorth, 512, "list $npc(平一指)"],
        广场: [cmd.yangzhou],
        钱庄: [cmd.yangzhou, cmd.gonorth, cmd.gowest],
        武庙: [cmd.yangzhou,  cmd.gonorth, cmd.gonorth, cmd.gowest],
        武馆: [cmd.yangzhou, cmd.gosouth, cmd.gosouth, cmd.gowest],
        衙门: [cmd.yangzhou, cmd.gowest, cmd.gonorth, cmd.gonorth],
        镖局: [cmd.yangzhou, cmd.gowest, cmd.gowest, cmd.gosouth, cmd.gosouth],
        矿山: [cmd.yangzhou, cmd.gowest, cmd.gowest, cmd.gowest, cmd.gowest],
    };
    cmds.购买 = {
        "<wht>米饭</wht>": cmds.扬州.醉仙楼,
        "<hiy>神仙醉</hiy>": cmds.扬州.醉仙楼,
        "<hig>醉仙酿</hig>": cmds.扬州.醉仙楼,
        "<wht>女儿红</wht>": cmds.扬州.醉仙楼,
        "<wht>花雕酒</wht>": cmds.扬州.醉仙楼,
        "<wht>米酒</wht>": cmds.扬州.醉仙楼,
        "<wht>扬州炒饭</wht>": cmds.扬州.醉仙楼,
        "<wht>面条</wht>": cmds.扬州.醉仙楼,
        "<wht>包子</wht>": cmds.扬州.醉仙楼,
        "<wht>鸡腿</wht>": cmds.扬州.醉仙楼,
        "<wht>长鞭</wht>": cmds.扬州.杂货铺,
        "<wht>簪子</wht>": cmds.扬州.杂货铺,
        "<wht>铁戒指</wht>": cmds.扬州.杂货铺,
        "<wht>布鞋</wht>": cmds.扬州.杂货铺,
        "<wht>英雄巾</wht>": cmds.扬州.杂货铺,
        "<wht>木棍</wht>": cmds.扬州.杂货铺,
        "<wht>布衣</wht>": cmds.扬州.杂货铺,
        "<wht>铁剑</wht>": cmds.扬州.打铁铺,
        "<wht>钢刀</wht>": cmds.扬州.打铁铺,
        "<wht>铁棍</wht>": cmds.扬州.打铁铺,
        "<wht>铁杖</wht>": cmds.扬州.打铁铺,
        "<wht>飞镖</wht>": cmds.扬州.打铁铺,
        "<hig>金创药</hig>": cmds.扬州.药铺,
        "<hig>引气丹</hig>": cmds.扬州.药铺,
    };

    autoScroll = function(selector) {
        const maxDistance = 120, fps = 120;
        if (typeof selector === "string") {
            let top = $(selector)[0].scrollTop;
            let max = $(selector)[0].scrollHeight;
            let height = Math.ceil($(selector).height());
            if (top < max - height) {
                let inc = (max - height < maxDistance) ? 1 : Math.ceil((max - height) / maxDistance);
                $(selector)[0].scrollTop = top + inc;
                window.setTimeout(() => autoScroll(selector), 1000 / fps);
            }
        }
    };
    cloneObject = function(object) {
        let result = {};
        for (const key in object) {
            result[key] = typeof object[key] === "object" ? cloneObject(object[key]) : object[key];
        }
        return result;
    };
    setTitle = function(title) {
        $("head title").html(title);
    };
    queue = function(any) {
        let delay = 256;
        if (typeof any === "string") {
            let process = {
                "$killall": () => $killall(),
                "$npc": () => $npc(any),
                "$item": () => $item(any)
            };
            let key = Object.keys(process).find(key => {
                return any.includes(key);
            });
            key ? process[key]() : websocket.send(any);
        } else if (typeof any === "function") {
            any();
        } else if (any instanceof Array) {
            if (any.length === 0) {
                return;
            }
            let a = any[0], b = any.slice(1);
            if (typeof a === "string" && /^[0-9]\d*$/.test(a))  {
                a = Number(a);
            }
            if (typeof a === "number") {
                window.setTimeout(() => queue(b), a);
            } else {
                queue(a);
                window.setTimeout(() => queue(b), delay);
            }
        } else {
            console.error(any);
        }
    };
    closeDialog = function() {
        listenerGetData({type: "dialog", dialog: "jh", close: true});
    };
    alert = function(message) {
        $("<div>").appendTo("body").css({
            "display": "none",
            "position": "fixed",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)",
            "min-width": "50%",
            "max-width": "70%",
            "z-index": "9999",
            "text-align": "center",
            "padding": "15px",
            "color": "#a0a0a0",
            "background-color": "#101010",
            "border-radius": "3px",
            "border-color": "#a0a0a0",
        }).html(message).click(function() {
            $(this).remove();
        }).show(1000).delay(3000).fadeOut(1000, function() {
            $(this).remove();
        });
    };
    say = function(text) {
        let language = /.*[\u4e00-\u9fa5]+.*$/.test(text) ? "zh" : "en";
        let url = `https://fanyi.baidu.com/gettts?lan=${language}&text=${text}&spd=5&source=web`;
        let audio = new Audio(url);
        audio.play();
    };
    getTime = function(format) {
        let time = new Date(), toString = function(n) {
            return n < 10 ? `0${n}` : `${n}`;
        };
        format = format.replace("hh", toString(time.getHours()));
        format = format.replace("mm", toString(time.getMinutes()));
        format = format.replace("ss", toString(time.getSeconds()));
        return format;
    };
    addStyle = function(css) {
        $("head style")[0] || $("head").append($("<style>"));
        $("head style").append(css);
    };

    websocket = (function() {
        let ws, fn_onmessage, fn_onerror;
        return {
            init: function() {
                if (WebSocket === null) {
                    window.alert("Error: WebSocket is null.");
                    return;
                } else {
                    window.WebSocket = function(uri) {
                        ws = new WebSocket(uri);
                    };
                }
                window.WebSocket.prototype = {
                    get url() {
                        return ws.url;
                    },
                    get protocol() {
                        return ws.protocol;
                    },
                    get readyState() {
                        return ws.readyState;
                    },
                    get bufferedAmount() {
                        return ws.bufferedAmount;
                    },
                    get extensions() {
                        return ws.extensions;
                    },
                    set binaryType(type) {
                        ws.binaryType = type;
                    },
                    get binaryType() {
                        return ws.binaryType;
                    },
                    set onerror(fn) {
                        ws.onerror = fn;
                    },
                    get onerror() {
                        return ws.onerror;
                    },
                    set onopen(fn) {
                        ws.onopen = fn;
                    },
                    get onopen() {
                        return ws.onopen;
                    },
                    set onclose(fn) {
                        fn_onerror = fn;
                        ws.onclose = websocket.onclose;
                    },
                    get onclose() {
                        return ws.onclose;
                    },
                    set onmessage(fn) {
                        fn_onmessage = fn;
                        ws.onmessage = websocket.onmessage;
                    },
                    get onmessage() {
                        return ws.onmessage;
                    },
                    send: function(command) {
                        websocket.send(command);
                    },
                    close: function() {
                        ws.close();
                    }
                };
            },
            send: function(command) {
                ws.send(command);
                listenerOnSend(command);
            },
            onmessage: function(event) {
                listenerOnMessage(event, fn_onmessage);
            },
            onclose: function(event) {
                fn_onerror.apply(this, [event]);
                listenerOnClose(event);
            }
        };
    })();
    monitor = (function() {
        let mo = [];
        return {
            add: function(fn) {
                let id = mo.length;
                mo.push(fn);
                return id;
            },
            remove: function(id) {
                id > -1 && mo[id] && (mo[id] = 0);
            },
            action: function(data) {
                mo.forEach(fn => {
                    typeof fn === "function" && fn(data.dialog || data.type, data);
                });
                if (data.text) {
                } else {
                    console.log(data);
                }
            }
        };
    })();
    progress = (function() {
        let init = function() {
            $(".tool-bar.bottom-bar").before(
                $(`<span class="funny-progress"><span style="width:0%;"></span></span>`).hide()
            );
            addStyle(`.funny-progress {
                height: 1em;
                line-height: 1em;
                border: 1px solid #004400;
                border-radius: 0.5em;
                margin: 0 3.5em 0.3em 0.5em;
                overflow: hidden
            } .funny-progress span {
                font-size: 12px;
                text-align: right;
                height: 100%;
                min-width: 24px;
                float: left;
                position: relative;
                background-color: #004400;
                border-radius: 0.5em;
                overflow: hidden;
            }`);
        };
        return {
            on: function(percent, text) {
                $(".funny-progress")[0] || init();
                $(".funny-progress").show();
                $(".funny-progress span").animate({width: percent}, 1000, () => {
                    $(".funny-progress span").html(`&nbsp;${text}&nbsp;`);
                });
            },
            off: function() {
                $(".funny-progress").hide();
            }
        };
    })();

    listenerOnSend = function(data) {
        time_send = new Date().getTime();
        debug && listenerGetText(`<hiy>${data}`);
    };
    listenerOnClose = function(event) {
        console.dir(event);
        if (reconnect) {
            listenerGetText("<hiy>链接断开，10秒后尝试重连。");
            let actions = [];
            for (let i = 9; i > 0; i--) {
                actions.push(1000);
                actions.push(() => listenerGetText(`<hiy>${i}..`));
            }
            queue([...actions, () => $("[command=score]").click(), () => closeDialog()]);
        } else {
            listenerGetText("<hiy>链接断开，如需自动重连请修改设置。");
        }
    };
    listenerOnMessage = function(event, fn) {
        if (!fakeEvent) {
            fakeEvent = cloneObject(event);
            fakeEvent.data = "";
        }
        let data = event.data;
        if (data[0] === "{") {
            data = new Function(`return ${data};`)();
        } else {
            data = {type: "text", text: data};
        }
        let type = data.dialog || data.type;
        let action = function() {
            fn.apply(this, [event]);
            monitor.action(data);
        };

        if (!data.fake || data.text) {
            let method = getMethodWithEventType(type);
            let result = method(data);
            result && action();
        } else {
            action();
        }
    };
    listenerGetData = function(data) {
        let event = cloneObject(fakeEvent);
        data.fake = true;
        event.data = JSON.stringify(data);
        websocket.onmessage(event);
    };
    listenerGetText = function(text)  {
        listenerGetData({type: "text", text: text});
    };

    methodToParseData = {
        roles: function(data) {
            methodToParseData.hideAndShow("#role_panel");
            let html = "";
            roles = {};
            for (var i = 0; i < data.roles.length; i++) {
                let select = i === 0 ? "select" : "";
                let title = data.roles[i].title;
                let name = data.roles[i].name;
                let id = data.roles[i].id;
                html += `<li class="role-item ${select}" roleid="${id}">`;
                html += `${title}&nbsp;&nbsp;${name}&nbsp;&nbsp;<ord>[${id}]</ord>`;
                html += `</li>`;
                roles[id] = name;
            }
            $(".role-list").html(html);
            return false;
        },
        hideAndShow: function(selector, callback) {
            let element, p = $(".login-content").children();
            for (var i = 0; i < p.length; i++) {
                if ($(p[i]).css("display") !== "none") {
                    element = $(p[i]);
                    break;
                }
            }
            if (!element) {
                element = $("#login_panel");
            }
            element.animate({opacity: 0}, "fast", function() {
                element.hide();
                if (selector === ".container") {
                    $(".login-content").hide();
                } else {
                    $(".login-content").show();
                }
                if (selector) {
                    $(selector).show().css("opacity", "0").animate({opacity: 1}, "slow", callback);
                }
            });
        },
        login: function(data) {
            console.clear();
            delete methodToParseData.login;
            id = data.id;
            name = roles[id];
            queue([256, () => {
                setTitle(`${name} ${state || (state = "")}`);
                $("[command=showcombat]").click();
                $("[command=skills]").click();
            },
            () => $("[command=pack]").click(), () => $("[command=score]").click(),
            () => $("[command=tasks]").click(), () => $("[command=shop]").click(),
            () => $("[command=message]").click(), () => $("[command=stats]").click(),
            () => $("[command=jh]").click(), () => {
                $("[command=showtool]").click();
                closeDialog();
                // fullSrc();
                listenerGetText(" _____   _   _   __   _   __   _  __    __".replace(/ /g, "&nbsp;"));
                listenerGetText("|  ___| | | | | |  \\ | | |  \\ | | \\ \\  / /".replace(/ /g, "&nbsp;"));
                listenerGetText("| |__   | | | | |   \\| | |   \\| |  \\ \\/ /".replace(/ /g, "&nbsp;"));
                listenerGetText("|  __|  | | | | | |\\   | | |\\   |   \\  /".replace(/ /g, "&nbsp;"));
                listenerGetText("| |     | |_| | | | \\  | | | \\  |   / /".replace(/ /g, "&nbsp;"));
                listenerGetText(`|_|     \\_____/ |_|  \\_| |_|  \\_|  /_/ <hig>${GM_info.script.version}\n`.replace(/ /g, "&nbsp;"));
            }]);
            return true;
        },
        pack: function(data) {
            if (data.items) {
                data.items = getItemsAfterSort(data.items);
                packs = data.items;
                listenerGetData(data);
                return false;
            }
            return true;
        },
        pack2: function(data) {
            if (data.items) {
                data.items = getItemsAfterSort(data.items);
                if (data.max_item_count < data.items.length) {
                    listenerGetText(`<hic>${data.name}的背包物品超过<hiy>${data.max_item_count}<hic>格容量上限，强制显示<hiy>${data.items.length}<hic>格。`);
                    data.max_item_count = data.items.length;
                }
                listenerGetData(data);
                return false;
            }
            return true;
        },
        list: function(data) {
            if (data.stores) {
                data.stores = getItemsAfterSort(data.stores);
                listenerGetData(data);
                return false;
            }
            return true;
        },
        items: function(data) {
            npcs = [];
            data.items.forEach(item => {
                item && !item.p && npcs.push(item);
            });
            return true;
        },
        itemadd: function(data) {
            !data.p && npcs.push(data);
            return true;
        },
        itemremove: function(data) {
            let index = npcs.findIndex(npc => {
                return npc.id === data.id;
            });
            index > -1 && npcs.splice(index, 1);
            return true;
        },
        state: function(data) {
            if (data.state) {
                $(".state-bar").removeClass("hide").html(`<span class="title">${data.state}</span>`);
                $(".state-tool").show();
                state = data.state.replace(/你|正在|中/g, "");
                setTitle(`${name} ${state}`);
            } else {
                $(".state-bar").addClass("hide").empty();
                $(".state-tool").hide();
                state = "";
                setTitle(`${name} ${state}`);
                progress.off();
            }
            return false;
        },
        combat: function(data) {
            if (data.start === 1) {
                timeout_fight && clearInterval(timeout_fight);
                timeout_fight = setInterval(() => {
                    let now = new Date().getTime();
                    perform.find(pfm => {
                        if (pfm.rtime < now) {
                            queue(`perform ${pfm.id}`);
                            return true;
                        }
                    });
                }, 256);
                state = "战斗";
                setTitle(`${name} ${state}`);
                hurt = 0;
            } else if (data.end === 1) {
                clearInterval(timeout_fight);
                state = "";
                setTitle(`${name} ${state}`);
                $(".funny-hurt").remove();
                listenerGetText(`<hiy class="funny-hurt">战斗累计${hurt}点伤害值。`);
            }
            return true;
        },
        score: function(data) {
            if (data.level && data.level.includes("武帝")) {
                cmds_work = [cmd.stopstate, cmd.yangzhou, cmd.gowest, cmd.gowest, cmd.gonorth, cmd.goenter, cmd.gowest, cmd.xiulian];
            } else {
                cmds_work = [cmd.stopstate, cmd.wakuang];
            }
            data.family && (family = data.family);
            data.hp && (hp = data.hp);
            data.mp && (mp = data.mp);
            data.max_hp && (max_hp = data.max_hp);
            data.max_mp && (max_mp = data.max_mp);
            data.limit_mp && (limit_mp = data.limit_mp);
            if (data.kar) {
                data.kar = `<hig>${data.id}`;
                listenerGetData(data);
                return false;
            }
            return true;
        },
        skills: function(data) {
            if (data.items) {
                data.items = getSkillsAfterSort(data.items);
                skills = data.items;
                listenerGetData(data);
                return false;
            } else if (data.item) {
                queue(cmd.cha);
            } else if (typeof data.exp === "number") {
                let skill = skills.find(skill => {
                    return skill.id === data.id;
                });
                if (skill) {
                    if (data.level) {
                        skill.level = data.level;
                        listenerGetText(`你的${skill.name}等级提升到<hig>${skill.level}</hig>级！`);
                    }
                    progress.on(`${data.exp}%`, `<hig>${data.exp}%&nbsp;${skill.name}<hig>&nbsp;${skill.level}级`);
                }
                data.exp = data.exp < 20 ? 20 : Math.floor(data.exp / 5) * 5;
                listenerGetData(data);
                return false;
            } else if (data.desc) {
                let x = data.desc.split("\n");
                let skill = skills.find(skill => {
                    return skill.name === x[0];
                });
                if (skill) {
                    x[1] = `<cyn onclick="copy('${skill.id}')">技能等级：${skill.level} 级\n技能代码：${skill.id}</cyn>`;
                }
                data.desc = x.join("\n");
                listenerGetData(data);
                return false;
            }
            return true;
        },
        master: function(data) {
            if (data.items) {
                data.items = getSkillsAfterSort(data.items);
                listenerGetData(data);
                return false;
            }
            return true;
        },
        text: function(data) {
            let text = data.text;
            let action = function(text) {
                if ($(".content-message pre").length === 0) {
                    $(".content-message").append("<pre></pre>");
                } else if ($(".content-message pre").length > 1) {
                    $(".content-message pre")[0].remove();
                }
                for (let i = 1000; i < $(".content-message pre")[0].childNodes.length; i++) {
                    $(".content-message pre")[0].removeChild($(".content-message pre")[0].childNodes[0]);
                }
                $(".content-message pre").append(`${text}\n`);
                autoScroll(".content-message");
            };
            if (data.fake) {
                action(text);
                return true;
            } else if (/^你对(.+)似乎多了一些理解，当前已领悟(.+)。$/.test(text)) {
                let x = text.match(/你对(.+)似乎多了一些理解，当前已领悟(.+)。/);
                progress.on(x[2], `<hig>${x[2]}&nbsp;${x[1]}`);
            } else if (/^<hiy>你的(.+)等级提升了！<\/hiy>$/.test(text)) {
            } else if (/^【(.+)】只能在战斗中使用。$/.test(text)) {
            } else if (/^(.+)还没准备好，你还不能使用。$/.test(text)) {
            } else if (/^你上个技能还没释放完成。$/.test(text)) {
            } else if (/^<hig>你获得了(.+)点经验，(.+)点潜能。<\/hig>$/.test(text)) {
                let x = text.match(/^<hig>你获得了(.+)点经验，(.+)点潜能。<\/hig>$/);
                let j = parseInt(x[1]), q = parseInt(x[2]);
                jing = (jing || 0) + j;
                qian = (qian || 0) + q;
                listenerGetText(`你获得了${j}点经验，${q}点潜能。`);
            } else if (/^<hig>你获得了(.+)点经验，(.+)点潜能，.+。<\/hig>$/.test(text)) {
                let x = text.match(/^<hig>你获得了(.+)点经验，(.+)点潜能，.+。<\/hig>$/);
                let j = parseInt(x[1]), q = parseInt(x[2]);
                jing = (jing || 0) + j;
                qian = (qian || 0) + q;
                listenerGetText(`你获得了${j}点经验，${q}点潜能。`);
            } else if (/^<hir>看起来(.+)想杀死你！<\/hir>\n$/.test(text)) {
                let x = text.match(/^<hir>看起来(.+)想杀死你！<\/hir>\n$/);
                let name = x[1];
                listenerGetText(`<hir>${name}开始攻击你！`);
            } else if (/^[\s\S]*造成(.+伤害).*\n\((.+)<...>.+<\/...>\)\n$/i.test(text)) {
                let x = text.match(/^[\s\S]*造成(.+伤害).*\n\((.+)<...>.+<\/...>\)\n$/i);
                let number = x[1], name = x[2];
                listenerGetText(`${name}受到了${number}！`);
                if (name !== "你") {
                    hurt += Number(number.replace(/[^0-9]/ig, ""));
                }
            } else if (/^[你|<...>你].+[「|“](.+)[」|”]/.test(text)) {
                let x = text.match(/^[你|<...>你].+[「|“](.+)[」|”]/);
                listenerGetText(`你使出绝招「<hir>${x[1]}</hir>」！`);
            } else if (/-----(.+)!-----/.test(text)) {
                let x = text.match(/-----(.+)!-----/);
                listenerGetText(`<hic>-----${x[1]}-----`);
            } else if (/^<hig>你的最大内力增加了(.+)点。<\/hig>$/.test(text)) {
                let x = text.match(/^<hig>你的最大内力增加了(.+)点。<\/hig>$/);
                let n = parseInt(x[1]);
                let minute = parseInt((limit_mp - max_mp) / (6 * n));
                let time = minute < 60 ? `${minute}分钟` : `${parseInt(minute / 60)}小时${minute % 60}分钟`;
                $(".funny-remove").remove();
                listenerGetText(`你的最大内力增加了${n}点。`);
                listenerGetText(`<span class="funny-remove"><hic>你的最大内力从<hiy>${max_mp}点<hic>打坐到<hiy>${limit_mp}点<hic>还需要<hiy>${time}<hic>。</span>`);
            } else if (/^\n你对著(.+)喝道：「(.+)！」\n$/.test(text)) {
                let x = text.match(/^\n你对著(.+)喝道：「(.+)！」\n$/);
                let name = x[1];
                listenerGetText(`<hir>你开始攻击${name}！`);
            } else if (/^你扑向(.+)！$/.test(text)) {
                let x = text.match(/^你扑向(.+)！$/);
                let name = x[1];
                listenerGetText(`<hir>你开始攻击${name}！`);
            } else if (/^(.+)对你说道：我要的是(.+)，你要是找不到就换别的吧。$/.test(text)) {
                let x = text.match(/^(.+)对你说道：我要的是(.+)，你要是找不到就换别的吧。$/);
                let name = x[1], item = x[2];
                listenerGetText(`<span class="funny-remove">${name}对你说道：快去把${item}找来，这是师门交给你的任务。`);
            } else if (/^(.+)对你说道：为师最近突然想尝一下(.+)，你去帮我找一下吧。$/.test(text)) {
                let x = text.match(/^(.+)对你说道：为师最近突然想尝一下(.+)，你去帮我找一下吧。$/);
                let name = x[1], item = x[2];
                listenerGetText(`<span class="funny-remove">${name}对你说道：快去把${item}找来，这是师门交给你的任务。`);
            } else if (/^(.+)对你说道：最近师门物资紧缺，你去帮我找些(.+)来。$/.test(text)) {
                let x = text.match(/^(.+)对你说道：最近师门物资紧缺，你去帮我找些(.+)来。$/);
                let name = x[1], item = x[2];
                listenerGetText(`<span class="funny-remove">${name}对你说道：快去把${item}找来，这是师门交给你的任务。`);
            } else if (/^(.+)对你说道：最近师门扩招了，需要一些装备衣物补充下，你去帮我找一件(.+)来。$/.test(text)) {
                let x = text.match(/^(.+)对你说道：最近师门扩招了，需要一些装备衣物补充下，你去帮我找一件(.+)来。$/);
                let name = x[1], item = x[2];
                listenerGetText(`<span class="funny-remove">${name}对你说道：快去把${item}找来，这是师门交给你的任务。`);
            } else if (/^(.+)沉吟半晌对你说道：为师最近练功到了瓶颈，需要一些武功秘籍来参考一下，你去帮我找一份(.+)吧。$/.test(text)) {
                let x = text.match(/^(.+)沉吟半晌对你说道：为师最近练功到了瓶颈，需要一些武功秘籍来参考一下，你去帮我找一份(.+)吧。$/);
                let name = x[1], item = x[2];
                listenerGetText(`<span class="funny-remove">${name}对你说道：快去把${item}找来，这是师门交给你的任务。`);
            } else if (/^(.+)愉快的笑了。\n(.+)对你说道：不错，孺子可教！$/.test(text)) {
                let x = text.match(/^(.+)愉快的笑了。\n(.+)对你说道：不错，孺子可教！$/);
                let name = x[1];
                listenerGetText(`<span class="funny-remove">${name}愉快的笑了，对你说道：不错，孺子可教！`);
            } else if (/^(.+)对你点头道：辛苦了， 你先去休息一下吧。$/.test(text)) {
                let x = text.match(/^(.+)对你点头道：辛苦了， 你先去休息一下吧。$/);
                let name = x[1];
                listenerGetText(`${name}对你点头道：辛苦了，今天已经没有师门任务了，你去休息一下明天再来吧。`);
            } else {
                listenerGetText(text);
                console.log(`original text: ${data.text}`);
            }
            return false;
        },
        room: function(data) {
            let array = data.name.split("-");
            room1 = array[0];
            room2 = array[1];
            let description = {
                "住房": {
                    "练功房": "这是一间别致的练功房，散放着几个蒲团，供你打坐吐纳，调气养息，修练内功之用。",
                },
            };
            if (description[room1] && description[room1][room2]) {
                data.desc = description[room1][room2];
                listenerGetData(data);
                return false;
            }

            $(".funny-remove").remove();
            $(".content-message pre .item-commands").remove();

            if ($(".content-message pre")[0]) {
                let html = $(".content-message pre").html();
                html = html.replace(/你来到了(.+)-(.+)。\n/g, "");
                html = html.replace(/\n\n+/g, "\n");
                $(".content-message pre").html(html);
                autoScroll(".content-message pre");
            }
            return true;
        },
        exit: function(data) {
            exit = {};
            for (const key in data.items) {
                exits[key] = data.items[key];
                exits[data.items[key]] = `go ${key}`;
            }
            return true;
        },
        sc: function(data) {
            if (data.id === id) {
                hp = data.hp || hp;
                mp = data.mp || mp;
                max_hp = data.max_hp || max_hp;
                max_mp = data.max_mp || max_mp;
            }
            return true;
        },
        perform: function(data) {
            if (data.skills) {
                perform = [];
                data.skills.forEach(pfm => {
                    perform.push({
                        id: pfm.id,
                        name: pfm.name,
                        distime: pfm.distime,
                        rtime: 0
                    });
                });
            }
            return true;
        },
        dispfm: function(data) {
            perform.forEach(pfm => {
                if (pfm.id === data.id) {
                    pfm.distime = data.distime;
                    pfm.rtime = new Date().getTime() + data.distime;
                }
                if (data.rtime) {
                    let rtime = new Date().getTime() + data.rtime;
                    rtime > pfm.rtime && (pfm.rtime = rtime);
                }
            });
            return true;
        },
    };
    getMethodWithEventType = function(type) {
        let fn = methodToParseData[type];
        return fn || function() {
            return true;
        };
    };
    getItemsAfterSort = function(items) {
        let sortRegExps = [
            /小箱子/, /随从礼包/, /师门补给包/, /背包扩充石/,
            /★★★★★★/, /★★★★★☆/, /★★★★★/, /★★★★☆/, /★★★★/, /★★★☆/, /★★★/, /★★☆/, /★★/, /★☆/, /★/, /☆/,
            /玄晶/, /<hio>武道<\/hio>/, /<hio>元晶<\/hio>/, /<hio>武道残页<\/hio>/, /帝魄碎片/, /神魂碎片/,

            /<hig>养精丹<\/hig>/, /<hic>养精丹<\/hic>/, /<hiy>养精丹<\/hiy>/, /<hiz>养精丹<\/hiz>/, /<hio>养精丹<\/hio>/,
            /<hig>培元丹<\/hig>/, /<hic>培元丹<\/hic>/, /<hiy>培元丹<\/hiy>/, /<hiz>培元丹<\/hiz>/, /<hio>培元丹<\/hio>/,

            /召唤令/, /扫荡符/, /天师符/, /叛师符/, /洗髓丹/, /变性丹/, /顿悟丹/, /玫瑰花/,
            /<hig>喜宴/, /<hic>喜宴/, /<hiy>喜宴/, /进阶秘籍/, /进阶残页/,
            /<ord>..秘籍<\/ord>/, /<ord>...秘籍<\/ord>/, /<ord>....秘籍<\/ord>/, /<ord>.....秘籍<\/ord>/, /<ord>......秘籍<\/ord>/,
            /<hio>..秘籍<\/hio>/, /<hio>...秘籍<\/hio>/, /<hio>....秘籍<\/hio>/, /<hio>.....秘籍<\/hio>/, /<hio>......秘籍<\/hio>/,
            /<hiz>..秘籍<\/hiz>/, /<hiz>...秘籍<\/hiz>/, /<hiz>....秘籍<\/hiz>/, /<hiz>.....秘籍<\/hiz>/, /<hiz>......秘籍<\/hiz>/,
            /<hiy>..秘籍<\/hiy>/, /<hiy>...秘籍<\/hiy>/, /<hiy>....秘籍<\/hiy>/, /<hiy>.....秘籍<\/hiy>/, /<hiy>......秘籍<\/hiy>/,
            /<hic>..秘籍<\/hic>/, /<hic>...秘籍<\/hic>/, /<hic>....秘籍<\/hic>/, /<hic>.....秘籍<\/hic>/, /<hic>......秘籍<\/hic>/,
            /<hig>..秘籍<\/hig>/, /<hig>...秘籍<\/hig>/, /<hig>....秘籍<\/hig>/, /<hig>.....秘籍<\/hig>/, /<hig>......秘籍<\/hig>/,
            /<ord>..残页<\/ord>/, /<ord>...残页<\/ord>/, /<ord>....残页<\/ord>/, /<ord>.....残页<\/ord>/, /<ord>......残页<\/ord>/,
            /<hio>..残页<\/hio>/, /<hio>...残页<\/hio>/, /<hio>....残页<\/hio>/, /<hio>.....残页<\/hio>/, /<hio>......残页<\/hio>/,
            /<hiz>..残页<\/hiz>/, /<hiz>...残页<\/hiz>/, /<hiz>....残页<\/hiz>/, /<hiz>.....残页<\/hiz>/, /<hiz>......残页<\/hiz>/,

            /白虎之魂/, /朱雀之魂/, /青龙之魂/, /玄武之魂/, /攻击之石/, /命中之石/, /躲闪之石/, /气血之石/,
            /<hiz>.+红宝石<\/hiz>/, /<hiz>.+绿宝石<\/hiz>/, /<hiz>.+蓝宝石<\/hiz>/, /<hiz>.+黄宝石<\/hiz>/,
            /<hiy>.+红宝石<\/hiy>/, /<hiy>.+绿宝石<\/hiy>/, /<hiy>.+蓝宝石<\/hiy>/, /<hiy>.+黄宝石<\/hiy>/,
            /<hic>红宝石<\/hic>/, /<hic>绿宝石<\/hic>/, /<hic>蓝宝石<\/hic>/, /<hic>黄宝石<\/hic>/,
            /<hig>.+红宝石<\/hig>/, /<hig>.+绿宝石<\/hig>/, /<hig>.+蓝宝石<\/hig>/, /<hig>.+黄宝石<\/hig>/,

            /<hio>师门令牌<\/hio>/, /<hiz>师门令牌<\/hiz>/, /<hiy>师门令牌<\/hiy>/, /<hic>师门令牌<\/hic>/, /<hig>师门令牌<\/hig>/,
            /<hio>挖矿指南<\/hio>/, /<hiz>挖矿指南<\/hiz>/, /<hiy>挖矿指南<\/hiy>/, /<hic>挖矿指南<\/hic>/, /<hig>挖矿指南<\/hig>/,
            /<hio>鱼饵<\/hio>/, /<hiz>鱼饵<\/hiz>/, /<hiy>鱼饵<\/hiy>/, /<hic>鱼饵<\/hic>/, /<hig>鱼饵<\/hig>/,
            /<hiy>..残页<\/hiy>/, /<hiy>...残页<\/hiy>/, /<hiy>....残页<\/hiy>/, /<hiy>.....残页<\/hiy>/, /<hiy>......残页<\/hiy>/,
            /<hic>..残页<\/hic>/, /<hic>...残页<\/hic>/, /<hic>....残页<\/hic>/, /<hic>.....残页<\/hic>/, /<hic>......残页<\/hic>/,
            /<hig>..残页<\/hig>/, /<hig>...残页<\/hig>/, /<hig>....残页<\/hig>/, /<hig>.....残页<\/hig>/, /<hig>......残页<\/hig>/,

            /<hio>朱果<\/hio>/, /<hiz>朱果<\/hiz>/, /<hiy>朱果<\/hiy>/, /<hic>朱果<\/hic>/, /<hig>朱果<\/hig>/,
            /<hio>潜灵果<\/hio>/, /<hiz>潜灵果<\/hiz>/, /<hiy>潜灵果<\/hiy>/, /<hic>潜灵果<\/hic>/, /<hig>潜灵果<\/hig>/,
            /<hio>聚气丹<\/hio>/, /<hiz>聚气丹<\/hiz>/, /<hiy>聚气丹<\/hiy>/, /<hic>聚气丹<\/hic>/, /<hig>聚气丹<\/hig>/,
            /<hio>突破丹<\/hio>/, /<hiz>突破丹<\/hiz>/, /<hiy>突破丹<\/hiy>/, /<hic>突破丹<\/hic>/, /<hig>突破丹<\/hig>/,

            /残页<\/hio>/, /残页<\/hiz>/, /残页<\/hiy>/, /残页<\/hic>/, /残页<\/hig>/,
            /鲤鱼/, /草鱼/, /鲢鱼/, /鲮鱼/, /鳊鱼/, /鲂鱼/, /黄金鳉/, /黄颡鱼/, /太湖银鱼/, /虹鳟/, /孔雀鱼/, /反天刀/, /银龙鱼/, /黑龙鱼/, /罗汉鱼/, /巨骨舌鱼/, /七星刀鱼/, /帝王老虎魟/,
            /当归/, /芦荟/, /山楂叶/, /柴胡/, /金银花/, /石楠叶/, /茯苓/, /沉香/, /熟地黄/, /九香虫/, /络石藤/, /冬虫夏草/, /人参/, /何首乌/, /凌霄花/, /灵芝/, /天仙藤/, /盘龙参/,
            /四十二章经一/, /四十二章经二/, /四十二章经三/, /四十二章经四/, /四十二章经五/, /四十二章经六/, /四十二章经七/, /四十二章经八/,
            /<wht>.+秘籍<\/wht>/
        ];
        let result = [];
        sortRegExps.forEach(regexp => {
            for (let i = 0; i < items.length; i++) {
                if (items[i]) {
                    items[i].name = items[i].name.toLowerCase();
                    if (regexp.test(items[i].name)) {
                        result.push(items[i]);
                        items[i] = 0;
                    }
                }
            }
        });
        items.forEach(item => {
            item && result.push(item);
        });
        return result;
    };
    getSkillsAfterSort = function(items) {
        let result = [];
        items.forEach(skill => {
            skill.exp = skill.exp < 20 ? 20 : Math.floor(skill.exp / 5) * 5;
            let color = ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
            let index = color.findIndex(tag => {
                return skill.name.includes(tag);
            });
            index > -1 && (skill.color = index);
        });
        items.sort((a, b) => {
            return a.level === b.level ? b.color - a.color : a.level - b.level;
        });
        let basesId = ["force", "dodge", "parry", "unarmed", "sword", "blade", "club", "staff", "whip", "throwing", "bite", "literate", "lianyao"];
        basesId.forEach(id => {
            let index = items.findIndex(skill => {
                return skill && skill.id === id;
            });
            if (index > -1) {
                result.push(items[index]);
                items[index] = 0;
            }
        });
        items.forEach(skill => {
            skill && result.push(skill);
        });
        return result;
    };

    checkState = function() {
        const max = 120000;
        window.setInterval(() => {
            let gap = new Date().getTime() - time_send;
            if (gap > max) {
                if (state === "") {
                    $(".funny-remove").remove();
                    listenerGetText(`<hic class="funny-remove">累计<hiy>${parseInt(gap / 1000)}秒</hiy>无操作，当前为<hiy>空闲</hiy>状态，自动挂机。`);
                    queue(cmds_work);
                } else {
                    $(".funny-remove").remove();
                    listenerGetText(`<hic class="funny-remove">累计<hiy>${parseInt(gap / 1000)}秒</hiy>无操作，当前为<hiy>${state}</hiy>状态。`);
                }
            }
        }, max);
    };
    softerColor = function() {
        addStyle(`.content-bottom {
            -webkit-user-select: none,
            -moz-user-select: none,
            -ms-user-select: none
        }
        .room-commands > .act-item {
            min-width: 1em;
            margin: 0 0 0 0.4em;
        }
        .content-message { padding-right: 3.5em; }
        .container, .login-content { color: #228844; }
        hiw, wht { color: #c0c0c0; }
        hig { color: #44cc44; }
        hic { color: #00cccc; }
        hiy { color: #cccc00; }
        hiz { color: #882cee; }
        hio { color: #cc8800; }
        hir, ord { color: #ee4400; }
        him { color: #cc00cc; }
        .mypanel .content {
            background-color: #222222;
        }
        .hp > .progress-bar { background-color: #880000; }
        .mp > .progress-bar { background-color: #004888; }
        .dialog-stats > .top-item > .top-sc,
        .dialog-stats > .top-item > .top-title,
        .dialog-fb > .fb-left > .fam-item { color: #00cccc; }
        .dialog-fb > .fb-left > .selected, .dialog-fb > .fb-left > .fb-content .selected {
            color: #44cc44;
        }
        .room-title, .dialog-message> .message-list > .message-item > .message-title { color: #cccc00; }`);
    };

    commandsBar = {
        data: {1: {}, 2: {}},
        init: function() {
            $(".room-commands").before(
                $(`<div class="funny-commands funny-commands-1"></div>`),
                $(`<div class="funny-commands funny-commands-2"></div>`)
            );
            addStyle(`.funny-commands {
                display: block;
                line-height: 2em;
                white-space: nowrap;
                overflow-x: auto
            }
            .funny-commands::before {
                content: "\\e006";
                font-family: "Glyphicons Halflings";
                display: inline-block;
                background-color: #232323;
                border-top-right-radius: 0.25em;
            }
            .funny-commands-1::before {
                color: #00cccc;
            }
            .funny-commands-2::before {
                color: #44cc44;
            }
            .funny-keys {
                display: inline-block;
                position: relative;
                text-align: center;
                cursor: pointer;
                border-radius: 0.25em;
                margin: 0 0 0 0.4em;
                padding: 0 0.4em 0 0.4em;
                line-height: 2em;
            }
            .funny-commands-1 > .funny-keys {
                color:#00cccc;
                border: solid 1px #00cccc;
            }
            .funny-commands-2 > .funny-keys {
                color: #44cc44;
                border: solid 1px #44cc44;
            }`);
            this.build(1, this.data[1]);
            this.build(2, this.data[2]);
        },
        clear: function(index) {
            $(`.funny-commands-${index}`).empty();
            return this;
        },
        add: function(index, title, fn) {
            $(`.funny-commands-${index}`).append(
                $(`<span class="funny-keys"></span>`).html(title).click(() => {
                    typeof fn === "function" && fn();
                })
            );
            return this;
        },
        build: function(index, object) {
            this.clear(index);
            Object.keys(object).forEach(title => {
                let value = object[title];
                if (typeof value === "function") {
                    this.add(index, title, value);
                } else if (typeof value === "object") {
                    this.add(index, title, () => {
                        this.build(index, value);
                    });
                }
            });
        }
    };
    commandsBar.data[1] = {
        "击杀": () => $killall(),
        "挂机": () => {
            let str = cmds_work.join("|0|");
            let arr = str.split("|");
            queue(arr);
        },
        "武庙": () => queue([cmd.stopstate, cmds["扬州"]["武庙"]]),
    };
    commandsBar.data[2] = {
        "任务": {
            "←任务": () => commandsBar.build(2, commandsBar.data[2]),
            "查询": () => {
                let id = monitor.add((type, data) => {
                    if (type === "tasks") {
                        monitor.remove(id);
                        let taskData = {
                            sm: [false, 0, 0],
                            fb: [false, 0],
                            wdt: [false, 0, 0],
                            qa: [false],
                            ym: [false, 0, 0],
                            yb: [false, 0, 0],
                        };
                        let process = {
                            signin: function(task) {
                                let fb = parseInt(task.desc.match(/副本：<.+?>(.+?)\/20/)[1]);
                                taskData.fb = [fb >= 20, fb];
                                let wdt = task.desc.match(/武道塔(.+?)，进度(.+?)\/(.+?)<.+?>，/);
                                taskData.wdt = [wdt[1].includes("已"), parseInt(wdt[2]), parseInt(wdt[3])];
                                let qa = task.desc.match(/进度(.+?)首席请安。/);
                                taskData.qa = [qa[1].includes("已")];
                            },
                            sm: function(task) {
                                let sm = task.desc.match(/目前完成(.*)\/20个，共连续完成(.*)个。/);
                                taskData.sm = [parseInt(sm[1]) >= 20, parseInt(sm[1]), parseInt(sm[2])];
                            },
                            yamen: function(task) {
                                let ym = task.desc.match(/目前完成(.*)\/20个，共连续完成(.*)个。/);
                                taskData.ym = [parseInt(ym[1]) >= 20, parseInt(ym[1]), parseInt(ym[2])];
                            },
                            yunbiao: function(task) {
                                let yb = task.desc.match(/本周完成(.*)\/20个，共连续完成(.*)个。/);
                                taskData.yb = [parseInt(yb[1]) >= 20, parseInt(yb[1]), parseInt(yb[2])];
                            }
                        };
                        data.items.forEach(task => {
                            if (task.state === 2) {
                                let cmd_taskover = `taskover ${task.id}`;
                                queue(cmd_taskover);
                            }
                            let result = process[task.id];
                            result && result(task);
                        });
                        listenerGetText(`<span class="funny-remove">
                            师门任务：${taskData.sm[0] ? "已完成；" : `<hig>${taskData.sm[1]}</hig>/20，共连续完成<hig>${taskData.sm[2]}</hig>次；`}
                            副本任务：${taskData.fb[0] ? "已完成；" : `<hig>${taskData.fb[1]}</hig>/20；`}
                            衙门追捕：${taskData.ym[0] ? "已完成；" : `<hig>${taskData.ym[1]}</hig>/20，共连续完成<hig>${taskData.ym[2]}</hig>次；`}
                            武道之塔：${taskData.wdt[0] ? "已完成；" : `<hig>${taskData.wdt[1]}</hig>/${taskData.wdt[2]}`}
                            每日请安：${taskData.qa[0] ? "已完成；" : `<hig>未完成</hig>；`}
                            每周运镖：${taskData.yb[0] ? "已完成。" : `<hig>${taskData.yb[1]}</hig>/20，共连续完成<hig>${taskData.yb[2]}</hig>次。`}
                        </span>`);
                    }
                });
                queue(cmd.tasks);
            },
            "师门": {
                "←师门": () => commandsBar.build(2, commandsBar.data[2]["任务"]),
                "自动": () => task.sm(false, false),
                "自动令牌": () => task.sm(true, false),
                "自动放弃": () => task.sm(false, true),
                "停止": () => monitor.remove(id_sm)
            },
            "追捕": {
                "←追捕": () => commandsBar.build(2, commandsBar.data[2]["任务"]),
                "自动": () => test(),
                "扫荡": () => queue([cmd.stopstate, ...cmds["扬州"]["衙门"], 512, "ask3 $npc(扬州知府)"]),
                "放弃": () => queue([cmd.stopstate, ...cmds["扬州"]["衙门"], 512, "ask1 $npc(扬州知府)", "ask2 $npc(扬州知府)"]),
            },
            "武道塔": {
                "←武道塔": () => commandsBar.build(2, commandsBar.data[2]["任务"]),
                "自动": () => {
                    monitor.remove(id_wdt);
                    id_wdt = monitor.add(function(type, data) {
                        let fn = {
                            text: function() {
                                if (data.text.includes("你现在可以进入下一层")) {
                                    queue([cmd.goup, 768, "kill $npc(武道塔守护者)"]);
                                } else if (data.text.includes("你的挑战失败了")) {
                                    monitor.remove(id_wdt);
                                }
                            }
                        }[type];
                        fn && fn();
                    });
                    queue([cmd.stopstate, cmd.wudaota, cmd.goenter, 768, "kill $npc(武道塔守护者)"]);
                },
                "扫荡": () => queue([cmd.stopstate, cmd.wudaota, 512, "ask3 $npc(守门人)"]),
                "重置": {
                    "←武道塔": () => commandsBar.build(2, commandsBar.data[2]["任务"]),
                    "确认重置": () => queue([cmd.stopstate, cmd.wudaota, 512, "ask1 $npc(守门人)"]),
                },
                "停止": () => monitor.remove(id_wdt)
            },
            "副本": {
                "←副本": () => commandsBar.build(2, commandsBar.data[2]["任务"]),
                "自动": () => test(),
                "扫荡": {
                    "←扫荡": () => commandsBar.build(2, commandsBar.data[2]["任务"]),
                    "血刀(普通)": () => queue([cmd.stopstate, "cr xuedao/shankou 0 20"]),
                    "侠客行(普通)": () => queue([cmd.stopstate, "cr xkd/shimen 0 20"])
                },
            },
            "请安": () => {
                let cmds_path = {
                    "武当派": [cmd.wudang, cmd.gowest, cmd.gonorthup, 512, "ask2 $npc(首席弟子)"],
                    "少林派": [cmd.shaolin, cmd.gonorth, cmd.gonorth, cmd.gonortheast, cmd.gonorthwest, cmd.gonorth, 512, "ask2 $npc(大师兄)"],
                    "华山派": [cmd.huashan, cmd.gowestup, cmd.gonorth, 512, "ask2 $npc(首席弟子)"],
                    "峨眉派": [cmd.emei, cmd.gowest, cmd.gosouth, 512, "ask2 $npc(大师姐)"],
                    "逍遥派": [cmd.xiaoyao, cmd.gowest, 512, "ask2 $npc(首席弟子)"],
                    "丐帮": [cmd.gaibang, cmd.godown, cmd.goeast, cmd.goeast, cmd.goeast, 512, "ask2 $npc(首席弟子)"],
                    "杀手楼": [cmd.shashou, cmd.gonorth, cmd.goup, cmd.goup, cmd.goup, cmd.goup, cmd.goeast, 512, "ask2 $npc(金牌杀手)"],
                    "无门无派": [cmd.yangzhou],
                }[family];
                let autoYangJingDan = function() {
                    let item = packs.find(item => {
                        return item.name.includes("<hig>养精丹</hig>");
                    });
                    let count = 0;
                    item && (count = item.count);
                    if (count >= 10) {
                        listenerGetText(`<hic>你的背包中有<hig>${count}<hic>枚<hig>养精丹<hic>，自动服用。`);
                        let cmd_use = `use ${item.id}`;
                        let cmds_use = [];
                        for (let i = 0; i < 10; i++) {
                            cmds_use.push(cmd_use);
                        }
                        queue([...cmds_use, ...cmds_work]);
                    } else {
                        listenerGetText(`<hic>你的背包中有<hiy>${count}枚<hig>养精丹<hic>，自动购买。`);
                        let id = monitor.add((type, data) => {
                            if (type === "list") {
                                let item = data.selllist.find(item => {
                                    return item.name === "<hig>养精丹</hig>";
                                });
                                item && queue([256, `buy ${10 - count} ${item.id} from ${data.seller}`, cmd.pack, () => monitor.remove(id), () => autoYangJingDan()]);
                            }
                        });
                        queue(cmds.扬州.药铺);
                    }
                };
                queue([cmd.pack, cmd.stopstate, ...cmds_path, () => autoYangJingDan()]);
            },
        },
        "背包": {
            "←背包": () => commandsBar.build(2, commandsBar.data[2]),
            "存仓": () => {
                let id = monitor.add((type, data) => {
                    if (type === "list" && data.stores) {
                        monitor.remove(id);
                        let actions = [];
                        data.stores.forEach(store => {
                            let item = packs.find(item => {
                                return item.name === store.name;
                            });
                            item && actions.push(`store ${item.count} ${item.id}`);
                        });
                        queue([256, ...actions, () => {
                            listenerGetText("<hic>存仓完毕。");
                        }]);
                    }
                });
                queue([cmd.pack, cmd.stopstate, ...cmds.扬州.钱庄, cmd.store, () => {
                    listenerGetText("<hic>查找背包与仓库中的同名物品。");
                }]);
            },
            "售卖": () => queue([cmd.stopstate, cmd.yangzhou, cmd.gosouth, cmd.goeast, cmd.sellall, "list $npc(唐楠)"]),
            "分解": {
                "←分解": () => commandsBar.build(2, commandsBar.data[2]["背包"]),
                "<hig>分解绿装": () => task.fenjie("hig"),
                "<hic>分解蓝装": () => task.fenjie("hic"),
                "<hiy>分解黄装": () => task.fenjie("hiy")
            },
            "丢弃": {
                "←丢弃": () => commandsBar.build(2, commandsBar.data[2]["背包"]),
                "<hig>丢绿残页": () => task.drop("hig"),
                "<hic>丢蓝残页": () => task.drop("hic"),
                "<hiy>丢黄残页": () => task.drop("hiy")
            },
            "收货": () => {
                listenerGetText("<hic>自动前往豪宅的花园，收取随从采集的物品。</hic>");
                queue([cmd.stopstate, cmd.yangzhou, ]);
            }
        },
        "社交": {
            "←社交": () => commandsBar.build(2, commandsBar.data[2]),
            "邮件": {
                "←邮件": () => commandsBar.build(2, commandsBar.data[2]["社交"]),
                "一键领取": () => {
                    let id = monitor.add((type, data) => {
                        let fn = {
                            message: function() {
                                if (data.id === "system") {
                                    monitor.remove(id);
                                    let cmds_get = [];
                                    data.items && data.items.forEach(item => {
                                        if (!item.rec) {
                                            cmds_get.push(`receive system ${item.index}`);
                                        }
                                    });
                                    queue(cmds_get);
                                }
                            }
                        }[type];
                        fn && fn();
                    });
                    queue(["message system"]);
                },
                "强制领取": () => {
                    let id = monitor.add((type, data) => {
                        let fn = {
                            message: function() {
                                if (data.id === "system") {
                                    monitor.remove(id);
                                    if (data.items) {
                                        let cmds_get = [];
                                        let index = data.items[0].index;
                                        for (let i = index; i >= 0; i--) {
                                            cmds_get.push(`receive system ${i}`);
                                        }
                                        queue(cmds_get);
                                    }
                                }
                            }
                        }[type];
                        fn && fn();
                    });
                    queue(["message system"]);
                }
            },
            "帮派": {
                "←帮派": () => commandsBar.build(2, commandsBar.data[2]["社交"]),
                "报到": () => queue(`pty ${getTime("hh:mm:ss")} 到。`),
                "检查活跃": () => {
                    let id = monitor.add((type, data) => {
                        let fn = {
                            party: function() {
                                if (data.roles) {
                                    monitor.remove(id);
                                    let records = [];
                                    data.roles.forEach(role => {
                                        let array = role.name.split(" ");
                                        let name = array[array.length - 1].replace(/<.*?>/g, "");
                                        if (role.online !== 1) {
                                            records.push(`pty ${name}已掉线。`);
                                            records.push(5000);
                                        } else if (role.sc !== 40) {
                                            records.push(`pty ${name}今日${role.sc}活跃值。`);
                                            records.push(5000);
                                        }
                                    });
                                    queue(records);
                                }
                            }
                        }[type];
                        fn && fn();
                    });
                    queue([() => $("[command=message]").click(), () => $("[for=3]").click(), () => closeDialog()]);
                }
            },
            "配偶送花": () => queue("greet 99"),
            "师傅请安": () => queue("greet master"),
        },
    };
    task = {
        sm: function(autoCard, autoGiveUp) {
            let masterData = {
                "武当派": ["谷虚道长", [cmd.wudang, cmd.gonorth]],
                "少林派": ["清乐比丘", [cmd.shaolin]],
                "华山派": ["高根明", [cmd.huashan]],
                "峨眉派": ["苏梦清", [cmd.emei, cmd.gowest]],
                "逍遥派": ["苏星河", [cmd.xiaoyao]],
                "丐帮": ["左全", [cmd.gaibang, cmd.godown]],
                "杀手楼": ["何小二", [cmd.shashou, cmd.gonorth]],
                "无门无派": ["教习", [cmd.yangzhou, cmd.gosouth, cmd.gosouth, cmd.gowest]],
            };
            let masterName = masterData[family][0];
            let masterPath = masterData[family][1];
            let taskItem, cmd_give, cmd_card, time;
            let task = {
                start: function() {
                    time = new Date().getTime();
                    listenerGetText(`<hic>自动师门任务开始，前往寻找<hiy>${masterName}</hiy>。</hic>`);
                    this.ask();
                },
                ask: function() {
                    cmd_give = cmd_card = null;
                    queue([cmd.stopstate, ...masterPath, 512, `task sm $npc(${masterName})`, `task sm $npc(${masterName})`, cmd.tasks]);
                },
                search: function() {
                    let cmds_buy = cmds["购买"][taskItem];
                    if (cmd_give) {
                        queue([256, cmd_give, () => this.ask()]);
                    } else if (cmds_buy) {
                        queue([256, ...cmds_buy]);
                    } else if (autoCard) {
                        if (cmd_card) {
                            queue([256, cmd_card, () => this.ask()]);
                        } else {
                            queue([256, `task sm $npc(${masterName})`, cmd.tasks]);
                        }
                    } else if (autoGiveUp) {
                        queue([256, `task sm $npc(${masterName}) giveup`, () => this.ask()]);
                    } else {
                        this.over();
                    }
                },
                over: function() {
                    let gap = new Date().getTime() - time;
                    let second = parseInt(gap / 1000);
                    listenerGetText(`<hic>自动师门任务用时<hiy>${parseInt(second / 60)}分${second % 60}秒</hiy>结束。</hic>`);
                    monitor.remove(id_sm);
                }
            };
            monitor.remove(id_sm);
            id_sm = monitor.add((type, data) => {
                let fn = {
                    cmds: function() {
                        let index = 99;
                        data.items.forEach(item => {
                            if (item.name.includes("师门令牌")) {
                                let i = ["绿", "蓝", "黄", "紫", "橙"].findIndex(color => {
                                    return item.name.includes(color);
                                });
                                if (i < index) {
                                    index = i;
                                    cmd_card = item.cmd;
                                }
                            } else if (item.name.includes("放弃")) {
                            } else {
                                cmd_give = item.cmd;
                            }
                        });
                    },
                    tasks: function() {
                        let item = data.items.find(item => {
                            return item.id === "sm";
                        });
                        let x = item.desc.match(/寻找(.+?)，/);
                        if (x) {
                            taskItem = x[1];
                            task.search();
                        }
                    },
                    list: function() {
                        let item = data.selllist.find(item => {
                            return item.name === taskItem;
                        });
                        item && queue([256, `buy 1 ${item.id} from ${data.seller}`, () => task.ask()]);
                    },
                    text: function() {
                        if (data.text.includes("今天已经没有师门任务了")) {
                            task.over();
                        } else if (data.text.includes("你拿不下那么多东西。")) {
                            listenerGetText(`<hiy>请检查背包是否已满！`);
                            task.over();
                        }
                    },
                }[type];
                fn && fn();
            });
            task.start();
        },
        fenjie: function(tag) {
            queue([cmd.pack, cmd.stopstate, () => {
                let actions = [];
                packs.forEach(item => {
                    if (/☆|★/.test(item.name)) {
                    } else if (item.can_eq === 1 && item.name.includes(tag)) {
                        actions.push(`fenjie ${item.id}`);
                    }
                });
                queue([...actions, () => listenerGetText("<hic>分解完毕。")]);
            }]);
        },
        drop: function(tag) {
            queue([cmd.pack, cmd.stopstate, () => {
                let actions = [];
                packs.forEach(item => {
                    if (item.name.includes("残页") && item.name.includes(tag)) {
                        actions.push(`drop ${item.count} ${item.id}`);
                    }
                });
                queue([...actions, () => listenerGetText("<hic>丢弃完毕。")]);
            }]);
        }
    };

    websocket.init();

    $(document).ready(function() {
        new MutationObserver(mutations => {
            mutations.forEach(record => {
                record.target.className === "dialog" && autoScroll(".content-message");
            });
        }).observe($(".dialog")[0], {
            attributeFilter: ["class"],
            subtree: true
        });
        $(".room_items").on("click", ".room-item", function() {
            let id = $(this).attr("itemid");
            let hp = $(`[itemid=${id}] .item-status .hp .progress-bar`).attr("max");
            let mp = $(`[itemid=${id}] .item-status .mp .progress-bar`).attr("max");
            let hp_per = $(`[itemid=${id}] .item-status .hp .progress-bar`).attr("style").replace(/width:|%/g, "");
            let mp_per = $(`[itemid=${id}] .item-status .mp .progress-bar`).attr("style").replace(/width:|%/g, "");
            let hp_value = Math.floor(parseInt(hp) * parseFloat(hp_per) / 100);
            let mp_value = Math.floor(parseInt(mp) * parseFloat(mp_per) / 100);
            queue([256, () => {
                listenerGetText(`<hiy class="funny-remove">ID: ${id}\nHP: ${hp_value}/${hp}\nMP: ${mp_value}/${mp}</hiy>`);
            }]);
        });
        commandsBar.init();
        checkState();
        softerColor();
    });

    window.onerror = (message, source, lineno, colno, error) => {
        listenerGetText(`<hir>${message || error}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}`);
    };
    window.copy = function(text) {
        GM_setClipboard(text);
        listenerGetText(`<hic>成功复制<hiy>${text}<hic>到剪贴板。`);
    };
    window.funny = {
        id: id,
        name: name,
    };

    $killall = function() {
        let actions = [cmd.stopstate];
        npcs.forEach(npc => {
            actions.push(`kill ${npc.id}`);
        });
        queue(actions);
    };
    $npc = function(command) {
        let name = command.match(/\$npc\((.*)\)/)[1];
        let npc = npcs.find(npc => {
            return npc.name.includes(name);
        });
        if (npc) {
            queue(command.replace(/\$npc\((.*)\)/, npc.id));
        } else {
            listenerGetText(`<hic>找不到名字中含有<hir>${name}</hir>的人物。`);
        }
    };
    $item = function(command) {
        let name = command.match(/\$item\((.*)\)/)[1];
        let item = packs.find(item => {
            return item.name.includes(name);
        });
        if (item) {
            queue(command.replace(/\$item\((.*)\)/, item.id));
        } else {
            listenerGetText(`<hic>找不到名字中含有<hir>${name}</hir>的物品。`);
        }
    };

    function test() {
        listenerGetText("<hiy>脚本功能有待完善。");
    }

})(unsafeWindow);