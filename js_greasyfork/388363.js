// ==UserScript==
// @name wsmud_XXX
// @version 0.0.1
// @description 武神传说 MUD
// @author xxx001
// @match http://game.wsmud.com/*
// @match http://www.wsmud.com/*
// @run-at document-end
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GMgetValue
// @grant GM_setValue

// @namespace https://greasyfork.org/users/324956
// @downloadURL https://update.greasyfork.org/scripts/388363/wsmud_XXX.user.js
// @updateURL https://update.greasyfork.org/scripts/388363/wsmud_XXX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var WG = undefined;
    var T = undefined;
    var messageAppend = undefined;
    var messageClear = undefined;

    ///
    ///代码实现
    ///
    ///

    var xxx = {

        jy : 0,
        qn : 0,
        _gains: [], // [{timestamp: number, name: string, count: number, unit: string}]
        items : {},

        init: function() {
            var css = `.zdy-item1{
                            display: inline-block;
                            width: 2.5em;
                            border-radius: 0.875em;
                            float: left;
                            margin-bottom: 0.15em;
                            margin-right: 0.3em;
                            margin-top: 0.2em;
                            height: 2.25em;
                            text-align: center;
                            border: 1px solid #808080;
                            background-color: #808080;
                            color: #343434;
                            cursor: pointer;
                            font-weight: bold;
                            position: relative;
                            line-height:14px;
                        }
                        .WG_button1 { width: calc(100% - 40px);}
                        .room-commands > .act-item, .combat-commands > .pfm-item {
                            margin-left: 0.15em!important;
                            margin-right: 0.15em!important;
                            padding-left: 0.3em!important;
                            padding-right: 0.3em!important;
                        }
                        .state-bar {
                            overflow-x: hidden!important;
                            width: calc(100% - 13em)!important;
                        }
                        `;
            GM_addStyle(css);
            var html = `<div class='WG_button1'>
                        <div style="float: right;">
                        <span class='zdy-item1 clean_button'>清空内容</span>
                        <span class='zdy-item1 sm_button'>师门(Q)</span>
                        <span class='zdy-item1 go_yamen_task'>追捕(W)</span>
                        <span class='zdy-item1 kill_all'>击杀(E)</span>
                        <span class='zdy-item1 get_all'>拾取(R)</span>
                        <span class='zdy-item1 sell_all'>清包(T)</span>
                        <span class='zdy-item1 zdwk'>挖矿(Y)</span>
                        <span class="zdy-item1 auto_perform" style="float:right;margin-right:0em;"> 自动攻击 </span>
                        <span class="zdy-item1 cmd_echo" style="float:right;">显示代码</span> </div></div>`;
            setTimeout(() => {$(".WG_button").remove();
                              $(".WG_log").after(html);
                              $(".clean_button").on("click", this.clean_content);
                              $(".clean_button").on("click", this.clean_content);
                              $(".sm_button").on("click", WG.sm_button);
                              $(".go_yamen_task").on("click", WG.go_yamen_task);
                              $(".kill_all").on("click", WG.kill_all);
                              $(".get_all").on("click", WG.get_all);
                              $(".sell_all").on("click", this.sell_all);
                              $(".zdwk").on("click", WG.zdwk);
                              $(".auto_perform").on("click", WG.auto_preform_switch);
                              $(".cmd_echo").on("click", WG.cmd_echo_button);
                              /*$(".WG_button").append(`<span class='tool-item zdy-item cmd_echo' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">显示代码</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item auto_perform' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">自动攻击</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item zdwk' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">挖矿(Y)</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item sell_all' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">清包(T)</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item get_all' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">拾取(R)</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item kill_all' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">击杀(E)</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item go_yamen_task' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">追捕(W)</span>`);
                              $(".WG_button").append(`<span class='tool-item zdy-item sm_button' style="margin-right:0.3em;margin-left:0em;padding-left:0em;padding-right:0em;line-height:14px;white-space: pre-wrap;">师门(Q)</span>`);
                             */
                             }, 5000);
            WG.add_hook("dialog", function(data) {
                if (data.dialog == "skills") {
                    if (data.level != null) {
                        $(".remove_data_jndj").remove();
                        $(".content-message > pre").append(
                            $(`<span class="remove_data_jndj"></span>`)
                            .append(`<hiy>技能等级: ${data.level}</hiy>\n`));
                    }
                    if (data.exp != null) {
                        $(".remove_data_jnexp").remove();
                        $(".content-message > pre").append(
                            $(`<span class="remove_data_jnexp"></span>`)
                            .append(`<hiy>技能进度: ${data.exp}%</hiy>\n`));
                    }
                }
                if (data.dialog == "pack") {
                    if (data.items != null) {
                        xxx.items = {};
                        for (const item of data.items) {
                            if (item.id) xxx.items[item.id] = item;
                        }
                    }
                }
                if (data.dialog != "pack" || data.id == null || data.name == null || data.unit == null || data.count == null || data.remove != null) return;
                var timestamp = new Date().getTime();
                // [{timestamp: number, name: string, count: number, unit: string}]
                var old = xxx.items[data.id];
                var count = data.count;
                if (old != null && old.count != null) {
                    count -= old.count;
                }
                var gain = {timestamp: timestamp, name: data.name, count: count, unit: data.unit};
                xxx._gains.push(gain);
                if (data.id != null) {
                    if (data.remove == null && data.count != null) {
                        xxx.items[data.id] = data;
                    }
                }

                const gains = xxx._gains.slice();
                var result = {};
                gains.forEach(gain => {
                    var oldCount = 0;
                    var old = result[gain.name];
                    if (old) oldCount = old.count;
                    result[gain.name] = {count: oldCount + gain.count, unit: gain.unit};
                });
                setTimeout(() => {
                    var content = "&nbsp;&nbsp;> 战利品列表如下：<br>";
                    $(".remove_data_gain").remove();
                    //messageAppend("&nbsp;&nbsp;> 战利品列表如下：", 0, 1);
                    for (const name in result) {
                        if (!result.hasOwnProperty(name)) continue;
                        const gain = result[name];
                        //messageAppend("&nbsp;&nbsp;* " + name + " <wht>" + gain.count + gain.unit + "</wht>", 0, 1);
                        content += `&nbsp;&nbsp;* ${name} <wht>${gain.count}${gain.unit}</wht><br>`;
                    }
                    $(".WG_log pre").append(
                            $(`<span class="remove_data_gain"></span>`)
                            .append(content));
                }, 100);
            });
            WG.add_hook('text', function (data) {
                //<hig>你获得了50点经验，50点潜能。</hig>
                let msg = data.msg;
                if (/你获得了(.*)点经验，(.*)点潜能/.test(msg)) {
                    let x = msg.match(/获得了(.*)点经验，(.*)点潜能/);
                    //let array = msg.split("，");
                    //var jy_one = parseInt(array[0].replace("<hig>你获得了", "").replace("点经验", ""));
                    //var qn_one = parseInt(array[1].replace("点潜能。</hig>", ""))
                    xxx.jy += parseInt(x[1]);
                    xxx.qn += parseInt(x[2]);
                    setTimeout(() => {
                        $(".remove_data_jyqn").remove();
                        $(".WG_log pre").append(
                        $(`<span class="remove_data_jyqn"></span>`)
                            .append(`<hig>合计 => 经验:${xxx.jy} 潜能:${xxx.qn}</hig>\n`));
                        var newpre = $(".content-message > pre").html().replace(msg, "");
                        $(".content-message > pre").html(newpre.substring(0, newpre.length-1));
                        $(".content-message > pre").append(
                            $(`<span class="remove_data_jyqn"></span>`)
                            .append(`<hig>单次 => 经验:${x[1]} 潜能:${x[2]}<br>合计 => 经验:${xxx.jy} 潜能:${xxx.qn}</hig>\n`));
                        //$(".content-message pre").remove(/获得了(.*)点经验，(.*)点潜能/g);
                    },10);
                }
                // 开始认真挖矿。
                if (/开始认真挖矿。/.test(msg)) {
                    setTimeout(() => {
                        var newpre = $(".content-message > pre").html().replace(msg, "");
                        $(".content-message > pre").html(newpre.substring(0, newpre.length-1));
                    },10);
                }

                /*if (/你的最大内力增加了/.test(data.msg)) {
                    let item = G.items.get(G.id);
                    let a = data.msg.match(/你的最大内力增加了(.*)点。/);
                    let n = parseInt(a[1]),
                        max = parseInt(item.max_mp),
                        limit = parseInt(G.limit_mp);
                    let time = (limit - max) / (n * 6); // X分钟 => X小时X分钟
                    let timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time / 60)}小时${parseInt(time % 60)}分钟`;
                    $(".remove_dzsj").remove();
                    $(".content-message pre").append(`<span class="remove_dzsj">当前内力: ${max}\n上限内力: ${limit}\n需要时间: ${timeString}\n</span>`);
                }*/
            });
        },
        clean_content: function() {
            $(".content-message pre").empty();
        },
        sell_all: function() {
            WG.sell_all(1, 1, 1);
        },
        AutoScroll: function(name) {
        if (name) {
            let scrollTop = $(name)[0].scrollTop;
            let scrollHeight = $(name)[0].scrollHeight;
            let height = Math.ceil($(name).height());
            if (scrollTop < scrollHeight - height) {
                let add = (scrollHeight - height < 120) ? 1 : Math.ceil((scrollHeight - height) / 120);
                $(name)[0].scrollTop = scrollTop + add;
                setTimeout(function() {
                    AutoScroll(name);
                }, 1000/120);
            }
        }
    }//滚动
    };

    $(document).ready(function () {
        WG = unsafeWindow.WG;
        T = unsafeWindow.T;
        messageAppend = unsafeWindow.messageAppend;
        messageClear = unsafeWindow.messageClear;
        xxx.init();
    });
})();