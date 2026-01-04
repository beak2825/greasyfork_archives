// ==UserScript==
// @name         feedback_to_jump
// @namespace    https://uu.163.com/
// @version      1.3.5
// @description  通过此脚本实现反馈后台到游戏后台和QQ好友添加!
// @author       ming
// @match        https://feedback.uu.x.netease.com/transfer/list*
// @match        https://feedback.uu.x.netease.com/feedback/logs*
// @include      /^https:\/\/feedback\.uu\.x\.netease\.com\/[0-9a-z]{24}$/
// @match        https://feedback.uu.netease.com/transfer/list*
// @match        https://feedback.uu.netease.com/feedback/logs*
// @include      /^https:\/\/feedback\.uu\.netease\.com\/[0-9a-z]{24}$/
// @icon         http://cos.qaming.cn/monkey/%E9%85%B8%E5%A5%B6-Yogurt.png
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      Apache License 2.0
// @connect      qa.devouter.uu.netease.com
// @connect      qa.devouter.uu.163.com
// @downloadURL https://update.greasyfork.org/scripts/440176/feedback_to_jump.user.js
// @updateURL https://update.greasyfork.org/scripts/440176/feedback_to_jump.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let LOGURL = "https://qa.devouter.uu.netease.com/statistics/temPoint";

    function feedback_to_jump() {
        //获取使用者信息
        let userInfo = document.getElementsByClassName("nav navbar-nav navbar-right")[0].childNodes[1].outerText.trim();

        // 跳转黑名单
        let lableWarns = document.getElementsByClassName("label label-warning");
        for (const lableWarn of lableWarns) {
            if (lableWarn.innerText === "黑名单") {
                lableWarn.href = "https://admin.uu.x.netease.com/user/blacklist";
                lableWarn.target = "_blank";
                lableWarn.onclick = function () {
                    $.ajax({
                        url: LOGURL,
                        data: {habit: "blacklist", userInfo: userInfo},
                        type: "POST",
                    });
                };
            }
        }

        const table = document.getElementsByClassName("table");
        for (let i = 0; i < table.length; i++) {
            let elementsByTagName = table[i].getElementsByTagName("tr");
            const table_tr_2 = elementsByTagName[1];
            let td_qq = table_tr_2.children;
            // 跳转手机号对应的加速日志信息
            let phone_text = td_qq[0].outerText.substring(5,);
            if (phone_text.search("信息") !== -1) {
                let phone_number = phone_text.substring(0, phone_text.length - 2).trim();
                td_qq[0].onclick = function () {
                    $.ajax({
                        url: LOGURL,
                        data: {habit: "logView", userInfo: userInfo},
                        type: "POST",
                    });
                };
                td_qq[0].innerHTML += ("<a href='https://feedback.uu.x.netease.com/user/log/list?log=user_acc_log&uid=" + phone_number + "' target = '_blank' > 日志 </a>");
            }

            // 跳转添加QQ好友
            let qq_text = td_qq[3].outerText;
            // copyText("test_123");
            const qq = qq_text.substring(4,);
            // const href_qq = "tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&fuin=*&website=www.oicqzone.com&uin=" + qq;
            if (qq.length > 0) {
                let copy_name = "copy_" + qq;
                td_qq[3].innerHTML = qq_text + '&nbsp' + '<button name=' + copy_name + ' class="btn btn-xs btn-info" data-toggle="modal" value = ' + qq + '>复制</button>';
                let copyQQ = document.getElementsByName(copy_name);
                copyQQ[0].onclick = function () {
                    $.ajax({
                        url: LOGURL,
                        data: {habit: "copyQQ", userInfo: userInfo},
                        type: "POST",
                    });
                    let name = $(this)[0].value;
                    let text = name;
                    if (navigator.clipboard) {
                        // clipboard api 复制
                        navigator.clipboard.writeText(text);
                    } else {
                        const textarea = document.createElement('textarea');
                        document.body.appendChild(textarea);
                        // 隐藏此输入框
                        textarea.style.position = 'fixed';
                        textarea.style.clip = 'rect(0 0 0 0)';
                        textarea.style.top = '10px';
                        // 赋值
                        textarea.value = text;
                        // 选中
                        textarea.select();
                        // 复制
                        document.execCommand('copy', true);
                        // 移除输入框
                        document.body.removeChild(textarea);
                    }
                }
            }

            // td_qq[3].innerHTML = "<a href=" + href_qq + " target='_blank'>" + qq_text + "</a>"
            // 包括图片栏在内刚好三行，小于三行就不请求跳转游戏后台了
            if (elementsByTagName.length <= 3) {
                continue;
            }
            const table_tr_3 = elementsByTagName[2];
            const td_name = table_tr_3.children;
            const td_acc = elementsByTagName[3].children;
            // 跳转查看线路
            const name_acc = td_acc[1].outerText;
            let href_acc = "https://admin.uu.x.netease.com/acc/virtual/server/query/?name=" + name_acc.substring(4,);
            td_acc[1].innerHTML = "<a href=" + href_acc + " target='_blank'>" + name_acc + "</a>"
            td_acc[1].onclick = function () {
                $.ajax({
                    url: LOGURL,
                    data: {habit: "accline", userInfo: userInfo},
                    type: "POST",
                });
            };
            const name_text = td_name[0].outerText;
            // 截取这部分为了可以跳转到后台的query界面
            const game_overview = name_text.substring(0, 4);
            const game_name = name_text.substring(4,);
            let api_url = "https://qa.devouter.uu.163.com/apis/game_id_dau?";
            const params = "name=" + game_name;
            api_url = api_url + params;
            let id = ''
            // 请求游戏名称对应的id，插入跳转的href
            GM_xmlhttpRequest({
                url: api_url,
                method: "GET",
                data: "",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload: function (xhr) {
                    console.log(xhr.responseText);
                    let res = JSON.parse(xhr.responseText);
                    id = res['id']
                    let href_game_overview = "https://admin.uu.x.netease.com/game/overview/?product=&is_oversea=&preline=&game=" + encodeURIComponent(game_name) + "&page=";
                    let href_game_edit = 'https://admin.uu.x.netease.com/game/edit/' + id;
                    let href_disabled_type = "https://admin.uu.x.netease.com/game/mode/?game=" + encodeURIComponent(game_name)
                    let game_overview_a = document.createElement('a');
                    let game_name_a = document.createElement('a');
                    let disabled_type_a = document.createElement('a');
                    game_overview_a.href = href_game_overview;
                    game_name_a.href = href_game_edit;
                    disabled_type_a.href = href_disabled_type;
                    game_overview_a.target = '_blank';
                    game_name_a.target = '_blank';
                    disabled_type_a.target = '_blank';
                    game_overview_a.text = game_overview;
                    game_name_a.text = game_name;
                    disabled_type_a.text = " 模式禁用";
                    game_overview_a.onclick = function () {
                        $.ajax({
                            url: LOGURL,
                            data: {habit: "showGameOnly", userInfo: userInfo},
                            type: "POST",
                        });
                    };
                    game_name_a.onclick = function () {
                        $.ajax({
                            url: LOGURL,
                            data: {habit: "showGameDetail", userInfo: userInfo},
                            type: "POST",
                        });
                    };
                    disabled_type_a.onclick = function () {
                        $.ajax({
                            url: LOGURL,
                            data: {habit: "disabledType", userInfo: userInfo},
                            type: "POST",
                        });
                    }
                    td_name[0].innerHTML = "";
                    td_name[0].appendChild(game_overview_a);
                    td_name[0].appendChild(game_name_a);
                    td_name[0].appendChild(disabled_type_a);
                    if (res['dau_flag'] == 0) {
                        let hot_flag = document.createElement("img");
                        hot_flag.src = "https://uu-test-cdn.s3.netease.com/images_bed/cold.png";
                        td_name[0].appendChild(hot_flag);
                    }
                },
                onerror: function (err) {
                    console.log('error')
                }
            });
        }
        // collect_feedback();
    }

    function collect_feedback() {
        $("div.panel.panel-default").each(function () {
            let mac, ip, isp, clientVersion,
                submissionTime, userId, operator, clientSystem, qq, game, area, gameServer, boostedType, boostedNode,
                boostedDesc, boostedLine = null;
            let id = $(this).attr("id");
            let problem = $(this).find("strong")[0].outerText.split(";");
            let descriptionInfo = "";
            for (let i = 0; i < problem.length - 1; i++) {
                descriptionInfo += problem[i];
            }
            let questionType = problem[problem.length - 1];
            let info_table = $(this).find("table")[0];
            let table_tr = info_table.getElementsByTagName("tr");
            for (let i = 0; i < 2; i++) {
                let tr_td = table_tr[i].getElementsByTagName("td");
                if (i === 0) {
                    mac = tr_td[0].outerText.split(":")[1];
                    ip = tr_td[1].outerText.split(":")[1];
                    isp = tr_td[2].outerText.split(":")[1];
                    clientVersion = tr_td[3].outerText.split(":")[1];
                    submissionTime = tr_td[4].outerText;
                    submissionTime = submissionTime.substring(3,);
                } else {
                    userId = tr_td[0].outerText.split(":")[1];
                    userId = userId.substring(0, userId.length - 6)
                    operator = tr_td[1].outerText.split(":")[1];
                    clientSystem = tr_td[2].outerText.split(":")[1];
                    let td_qq = tr_td[3].outerText.split(": ")[1];
                    if (td_qq !== undefined) {
                        qq = td_qq.substring(0, td_qq.length - 3);
                    }
                }
            }
            if (table_tr.length !== 3) {
                for (let i = 2; i < 4; i++) {
                    let tr_td = table_tr[i].getElementsByTagName("td");
                    if (i === 2) {
                        game = tr_td[0].outerText.split(": ")[1];
                        area = tr_td[1].outerText.split(": ")[1];
                        gameServer = tr_td[2].outerText.split(": ")[1];
                    } else {
                        boostedType = tr_td[0].outerText.split(": ")[1];
                        boostedNode = tr_td[1].outerText.split(": ")[1];
                        boostedDesc = tr_td[2].outerText.split(": ")[1];
                        boostedLine = tr_td[3].outerText.split(": ")[1];
                    }
                }
            }
            let feedback = {
                id: id,
                descriptionInfo: descriptionInfo,
                questionType: questionType,
                mac: mac,
                ip: ip,
                isp: isp,
                clientVersion: clientVersion,
                submissionTime: submissionTime,
                userId: userId,
                operator: operator,
                clientSystem: clientSystem,
                qq: qq,
                game: game,
                area: area,
                gameServer: gameServer,
                boostedType: boostedType,
                boostedNode: boostedNode,
                boostedDesc: boostedDesc,
                boostedLine: boostedLine,
            };
            $.ajax({
                url: "https://qa.devouter.uu.netease.com/uu/saveFeedback",
                data: feedback,
                type: "GET",
                dataType: "jsonp",
                contentType: "application/json"
            });
        });
    }

    setTimeout(feedback_to_jump, 1000);
})();
