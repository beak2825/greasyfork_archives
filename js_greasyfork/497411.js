// ==UserScript==
// @name         纸条助手
// @namespace    TornExtensions
// @version      1.2.1.2
// @description  在搜索界面快速查询当前列表的无职属性，脑袋=每天0.7xan+，火焰=活跃14天+，手袋=基础工作满级
// @author       Pldada [2783662]
// @match        https://www.torn.com/page.php?sid=UserList*
// @downloadURL https://update.greasyfork.org/scripts/497411/%E7%BA%B8%E6%9D%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/497411/%E7%BA%B8%E6%9D%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

jQuery(document).ready(function($) {
    'use strict';

    let yourAd = `hey there, would you be interesting in joining my company? We have daily trains meaning faster stat gain than principal and pay according to stats. Check it out here: https://www.torn.com/joblist.php#!p=corpinfo&ID=97721`;
        //`hey there, would you be interesting in joining a logistics? We have free trains meaning second fastest stat gains in the game and pay according to stats`;
        //`hey there, would you be interesting in joining my company? We have daily trains meaning faster stat gain than principal and pay according to stats. Check it out here: https://www.torn.com/joblist.php#!p=corpinfo&ID=97721`;
//your ad here

    // avoid over loading in pda
    try {
        const __win = window.unsafeWindow || window;
        if (__win.CrimeShortCut) return;
        __win.CrimeShortCut = true;
        window = __win; // fix unsafeWindow
    } catch (err) {
        console.log(err);
    }

    //const $ = window.jQuery;

    function getAPIKey() {
        let key = window.localStorage.getItem("APIKey");
        if(key == null || key == "") {
            console.log('no key...');
            if(window.location.href.indexOf('preferences.php') >= 0) {
                console.log('on setting page');
                const refresher = setInterval(function() {
                    console.log('refreshing');
                    $("input").each(function() {
                        const input_value = $(this).val();
                        if (input_value.length == 16) {
                            key = input_value;
                            window.localStorage.setItem("APIKey",key);
                            console.log("apikey get "+key);
                            clearInterval(refresher);
                            alert('APIKey设置成功，点击确定前往主页');
                            window.location.href = 'https://www.torn.com/index.php';
                        }
                    });
                }, 300);
            }
            else {
                console.log('switch to setting page');
                alert('APIKey未设置或设置错误，点击确定前往设置页面');
                window.location.href = 'https://www.torn.com/preferences.php#tab=api';
            }
        }
        return key;
    }

    function formatNumber(x) {
        if (x < 0) {
            return '-' + formatNumber(-x);
        } else if (x == 0) {
            return '0';
        } else if (x <= 1) {
            return (x * 100).toFixed(2) + '%';
        } else if (x < 1e3) {
            return '' + parseInt(x);
        } else if (x >= 1e3 && x < 1e6) {
            return (x / 1e3).toFixed(2) + 'k';
        } else if (x >= 1e6 && x < 1e9) {
            return (x / 1e6).toFixed(2) + 'm';
        } else if (x >= 1e9 && x < 1e12) {
            return (x / 1e9).toFixed(2) + 'b';
        } else if (x >= 1e12 && x < 1e15) {
            return (x / 1e12).toFixed(2) + 't';
        } else if (x >= 1e15) {
            return (x / 1e12).toFixed(2) + 'q';
        }
    }

    function getLocalStorageRootNode(key1) {
        if (window.localStorage === undefined) {
            return undefined;
        } else if (window.localStorage.getItem(key1) === null) {
            return null;
        } else {
            const json = JSON.parse(window.localStorage.getItem(key1));
            return json;
        }
    }

    function getLocalStorage(key1, key2) {
        const json = getLocalStorageRootNode(key1);
        if (json === undefined) {
            return undefined;
        } else if (json === null) {
            return null;
        } else {
            if (json[key2] === undefined) {
                return undefined;
            } else {
                return json[key2];
            }
        }
    }

    function tct2timestamp(tct_time_str) {
        const time_chat = tct_time_str.split("-")[0].trim();
        const date_chat = tct_time_str.split("-")[1].replace("TCT", "").trim();
        const year_chat = "20" + date_chat.split("/")[2].trim();
        const month_chat = date_chat.split("/")[1].trim();
        const day_chat = date_chat.split("/")[0].trim();
        const last_chat = new Date(year_chat + "/" + month_chat + "/" + day_chat + " " + time_chat);
        last_chat.setHours(last_chat.getHours() - new Date().getTimezoneOffset() / 60); // +8 hours if beijing timezone
        return parseInt(last_chat.getTime() / 1000);
    }

    function isChatted(userName) {
        const chat_history = getLocalStorage("CHAT_LAST_MESSAGE", userName);
        if (chat_history) {
            let chat_timestr = "";
            if (chat_history.indexOf("|||") >= 0) {
                chat_timestr = chat_history.split("|||")[0];
            }
            else {
                chat_timestr = chat_history;
            }
            const chat_ts = tct2timestamp(chat_timestr);
            const diff_ts = parseInt((new Date()).getTime() / 1000) - chat_ts;
            let diff_ts_format = "";
            let diff_ts_color = "";
            if (diff_ts < 3600) {
                diff_ts_format = parseInt(diff_ts / 60) + "m";
                diff_ts_color = "#5d9525";
            } else if (diff_ts >= 3600 && diff_ts < 86400) {
                diff_ts_format = parseInt(diff_ts / 3600) + "h";
                diff_ts_color = "#DAA520";
            } else if (diff_ts >= 86400 && diff_ts < 86400 * 35) {
                diff_ts_format = parseInt(diff_ts / 86400) + "d";
                diff_ts_color = "#c0542f";
            } else if (diff_ts >= 86400 * 35) {
                diff_ts_format = parseInt(diff_ts / 86400) + "d";
                diff_ts_color = "#777";
            }
            return [diff_ts_color, diff_ts_format];
        } else {
            return undefined;
        }
    }

    let APIKey = window.localStorage.getItem("APIKey");
    if (!APIKey)
    {
        getAPIKey();
    }

    function makeShortcuts() {
        var idlist = []
        if (window.location.href.indexOf('page.php') < 0) {
            $(".extcs-wrapper").remove();
            return;
        }
        let title = $(".content-title");
        if ($(".captcha").length > 0 || $(".extcs-wrapper").length > 0) {
            if (title.next()[0] != $(".extcs-wrapper")[0]) {
                $(".extcs-wrapper").remove();
            }
            return;
        };
        title.after(`
            <div class="extcs-wrapper" style="margin:5px 0;">
                <div class="title-black" style="border-radius: 5px 5px 0 0; font-size:15px;">
                    <span>无职搜寻:</span>
                </div>
                <div class="cont-gray extcs" style="padding:5px 0;border-radius:0 0 5px 5px; font-size:15px;">
                    <span id="sshn">
                        <button class="torn-btn" style="margin-left: 5px;">开始检索</button>
                    </span>
                    <span id="qllb_bs">
                        <button class="torn-btn" style="margin-left: 5px;">清理列表</button>
                    </span>
                </div>
                <div class="cont-gray extcs" id="bscont" style="background: azure;padding:5px 0;border-radius:0 0 5px 5px; font-size:15px;">
                    <table border="1" class="unemployed" id="blacks_list">
                        <tr height="22">
                            <td style="width: 12%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">Id(Mail)</td>
                            <td style="width: 23%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">名</td>
                            <td style="width: 10%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">Trains</td>
                            <td style="width: 20%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">Ws(估)</td>
                            <td style="width: 8%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">Xan</td>
                            <td style="width: 9%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">日嗑</td>
                            <td style="width: 8%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">连登</td>
                            <td style="width: 20%;border: 1px solid darkgray;
                            padding: 5px;
                            background-color: black;
                            color: white;
                            font-weight: bold;
                            text-align: center;">资产</td>
                        </tr>
                    </table>
                </div>
            </div>`);

        let unemployed = $("#blacks_list");
        // for (let i = 0; i < crimeMap.length; i++) {
        //     for (let j = 0; j < crimeMap[i].length; j++) {
        //         shortcuts.append(makeShortcutBtn(`${i}-${j+1}`));
        //     }
        // }
        function checkFinishDetect(delay) {
            setTimeout(waitten, delay);
        }

        function waitten(){
            console.log("歇息");
        }

        $("#sshn").click(() => {
            $("#bscont").replaceWith((`<div class="cont-gray extcs" id="bscont" style="background: azure;padding:5px 0;border-radius:0 0 5px 5px; font-size:15px;">
            <table border="1" class="unemployed" id="blacks_list">
            <tr height="22">
            <td style="width: 12%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Id(Mail)</td>
            <td style="width: 23%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">名</td>
            <td style="width: 10%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Train</td>
            <td style="width: 20%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Ws(估)</td>
            <td style="width: 8%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Xan</td>
            <td style="width: 9%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">日嗑</td>
            <td style="width: 8%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">连登</td>
            <td style="width: 20%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">资产</td>
        </tr>
            </table>
        </div>`));

            unemployed = $("#blacks_list");
            idlist = []
            var liIDs = $('.user-info-list-wrap').children("li").map(function(i,n) {
                let id_txt = $(n).attr('class');
                let afet_id = '';
                if (id_txt.indexOf(" ") != -1){
                    var arr = id_txt.split(" ");
                    afet_id = arr[0].substr(4);
                }else{
                    afet_id = id_txt.substr(4)
                }
                idlist.push(afet_id);
            });
            console.log(idlist)
            let time = Math.round((Date.now()/1000)-604800,0);
            console.log(time)

            for (let i = 0; i < idlist.length; i++) {
                let id = idlist[i];
                let API = `https://api.torn.com/user/${id}?selections=profile,crimes,personalstats,bazaar&key=${APIKey}`;
                let API1 = `https://api.torn.com/user/${id}?selections=personalstats&stat=exttaken,lsdtaken,xantaken&timestamp=${time}&key=${APIKey}`;
                let name = "";
                let train = "";
                let ws = "";
                let xan = "";
                let adu = "";
                let cs = "";
                let nw = "";
                unemployed.append(`<tr id = "${id}" style="width: 10%;" height="22"">
                <td id = "myLink${id}" style="width: 12%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span><a href="https://www.torn.com/messages.php#/p=compose&XID=${id}" target="_blank">${id}</a></span></td>
                <td style="width: 27%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span><a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank"><span id = "${id}name">${name}</span></a></span></td>
                <td style="width: 10%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span id = "${id}train">${train}</span></td>
                <td style="width: 20%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span id = "${id}WS">${ws}</span></td>
                <td style="width: 8%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span id = "${id}xan">${xan}</span></td>
                <td style="width: 9%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;" ><span id = "${id}adu">${adu}</span></td>
                <td style="width: 8%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span id = "${id}cs">${cs}</span></td>
                <td style="width: 20%;border: 1px solid darkgray;
                padding: 5px;
                text-align: center;"><span id = "${id}nw">${nw}</span></td>
                </tr>`)
                fetch(API1)
                .then((res) => res.json())
                .then((res) => {
                    if (res.personalstats){
                        console.log(res);
                        const exttaken = res.personalstats.exttaken || 0;
                        const lsdtaken = res.personalstats.lsdtaken || 0;
                        const xantaken = res.personalstats.xantaken || 0;
                        let Weekdrugsuse = exttaken + lsdtaken + xantaken;
                        getdtect(API,id, Weekdrugsuse);
                    }
                });
                checkFinishDetect(1000);
            }

        });

        //function waitten(){
            //console.log("歇息");
        //}

        $("#qllb_bs").click(() => {

            $("#bscont").replaceWith((`<div class="cont-gray extcs" id="bscont" style="background: azure;padding:5px 0;border-radius:0 0 5px 5px; font-size:15px;">
            <table border="1" class="unemployed" id="blacks_list">
            <tr height="22">
            <td style="width: 12%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Id(Mail)</td>
            <td style="width: 23%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">名</td>
            <td style="width: 10%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Train</td>
            <td style="width: 20%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Ws(估)</td>
            <td style="width: 8%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">Xan</td>
            <td style="width: 9%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">日嗑</td>
            <td style="width: 8%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">连登</td>
            <td style="width: 20%;border: 1px solid darkgray;
            padding: 5px;
            background-color: black;
            color: white;
            font-weight: bold;
            text-align: center;">资产</td>
        </tr>
            </table>
        </div>`));
        unemployed = $("#blacks_list");

        });
    }

    function getdtect(API,userId,weekdata) {

        fetch(API)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.personalstats) {
                const data = res.personalstats;
                const trainsreceived = data.trainsreceived || 0;
                const age = res.age || 1;
                const last_action_str = res.last_action.relative;
                const online = res.last_action.status;
                res.last_action_brief = last_action_str.replace(" minute ago", "m").replace(" minutes ago", "m").replace(" hours ago", "h").replace(" hour ago", "h").replace(" days ago", "d").replace(" day ago", "d");
                let last_action_days = 0;

                if (last_action_str.includes("d")) {
                    last_action_days = parseInt(last_action_str.replace(/[^0-9|-]/ig, ""));
                }
                const useractivity = data.useractivity || 0;
                const activestreak = data.activestreak || 0;
                const traveltime = data.traveltime || 0;
                const activity_days = useractivity / 86400;
                const travel_days = traveltime / 86400;
                const nw = data.networth;
                const lx = res.basicicons.icon26 || res.basicicons.icon25 || res.basicicons.icon24 || res.basicicons.icon23 || res.basicicons.icon22 || res.basicicons.icon21 || '';
                const ched_active_days = 3 * activity_days + travel_days;
                const max_active_days = Math.max(1, (age - last_action_days) * 21 / 24);
                const cantaken = data.cantaken || 0;
                const exttaken = data.exttaken || 0;
                const kettaken = data.kettaken || 0;
                const lsdtaken = data.lsdtaken || 0;
                const opitaken = data.opitaken || 0;
                const pcptaken = data.pcptaken || 0;
                const shrtaken = data.shrtaken || 0;
                const spetaken = data.spetaken || 0;
                const victaken = data.victaken || 0;
                const xantaken = data.xantaken || 0;
                const xan_lsd_ecs = exttaken + lsdtaken + xantaken;
                res.xan_lsd_ecs = xan_lsd_ecs;
                const average_drugs = ((xan_lsd_ecs - weekdata) / 7).toFixed(2);
                console.log(weekdata, average_drugs);
                res.average_drugs = average_drugs;
                const daysbeendonator = data.daysbeendonator || 0;
                const max_donator_days = Math.min(age, parseInt(((new Date()) - (new Date('2011/11/22'))) / 86400000)); // 这一天才开始统计DP时间
                const donator_percent = Math.min(daysbeendonator / max_donator_days, 1);
                res.donator_percent = donator_percent.toFixed(2);
                const energy_per_day = 480 + 240 * donator_percent;
                const cap_need_energy = 611255; // 实现CAP消耗的能量
                const cap_need_days = cap_need_energy / energy_per_day;
                const crime2 = res.criminalrecord.other || 0;
                const crime3 = res.criminalrecord.selling_illegal_products || 0;
                const crime4 = res.criminalrecord.theft || 0; // 4,5,6,7,15
                const crime8 = res.criminalrecord.drug_deals || 0;
                const crime9 = res.criminalrecord.computer_crimes || 0; // 9,18
                const crime10 = res.criminalrecord.murder || 0;
                const crime11 = res.criminalrecord.fraud_crimes || 0; // 11,13,14,17
                const crime12 = res.criminalrecord.auto_theft || 0;
                const drug_active_days = (cantaken * 75 + exttaken * 210 + kettaken * 52.5 + lsdtaken * 425 + opitaken * 215 + pcptaken * 430 + shrtaken * 209.5 + spetaken * 301 + victaken * 300 + xantaken * 420) / 1440;
                const chat_display_arr = isChatted(res.name);
                let crime_active_days = (crime2 * 2 + crime3 * 3 + crime4 * 5 + crime8 * 8 / 0.8 + crime9 * 9 / 0.75 + crime10 * 10 / 0.75 + crime11 * 11 / 0.95 + crime12 * 12 / 0.7) * 5 / 1440;
                if (crime_active_days < cap_need_days) {
                    const crime_active_days_modifier = Math.min(cap_need_days / crime_active_days, 3);
                    crime_active_days *= crime_active_days_modifier;
                }
                const estimate_active_days = Math.min(max_active_days, Math.max(ched_active_days, drug_active_days, crime_active_days)).toFixed(2);
                var estimate_ws;
                if(age<1000){estimate_ws=parseInt(75*trainsreceived+70*age)}else{estimate_ws=parseInt(75*trainsreceived+90*age)};
                let txt = '#' + userId + 'WS';
                let target_id = $(txt);
                let chattime = "";
                $(target_id).replaceWith("<span>"+formatNumber(estimate_ws)+"</span>");
                if (chat_display_arr) {
                    console.log("Pldada=====唠过=====")
                    chattime = chat_display_arr[1];
                } else {
                    console.log("Pldada======没唠过=====")
                }
                txt = '#' + userId + 'name';
                target_id = $(txt);
                let islx = '';
                if (res.average_drugs >= 0.7){
                    islx = "🧠";
                }

                let streak = '';
                if (activestreak >= 14){
                    streak = "🔥";
                }
                let workrank = '';
                if (lx.includes("Principal")||lx.includes("General")||lx.includes("Manager at a Grocery")||lx.includes("Casino President")||lx.includes("Brain surgeon")||lx.includes("Federal Judge")){
                    workrank = "💼";
                }
                if (estimate_ws >= 80000 && res.average_drugs < 0.5 && workrank){
                    $(target_id).replaceWith("<span style='color: green;float: left;'>"+res.name+islx+streak+workrank+"</span>"+"<span style='float: right;'>"+chattime+"</span>");
                }else if (estimate_ws < 80000 || res.average_drugs > 0.5){
                    $(target_id).replaceWith("<span style='color: red;float: left;'>"+res.name+islx+streak+workrank+"</span>"+"<span style='float: right;'>"+chattime+"</span>");
                }else{
                    $(target_id).replaceWith("<span style='color: #cfcf04;float: left;'>"+res.name+islx+streak+workrank+"</span>"+"<span style='float: right;'>"+chattime+"</span>");
                }
                txt = '#' + userId + 'train';
                target_id = $(txt);
                $(target_id).replaceWith("<span>"+trainsreceived+"</span>");
                txt = '#' + userId + 'cs';
                target_id = $(txt);
                $(target_id).replaceWith("<span>"+activestreak+"</span>");
                txt = '#' + userId + 'nw';
                target_id = $(txt);
                $(target_id).replaceWith("<span>"+formatNumber(nw)+"</span>");
                txt = '#' + userId + 'xan';
                target_id = $(txt);
                $(target_id).replaceWith("<span>"+xantaken+"</span>");
                txt = '#' + userId + 'adu';
                target_id = $(txt);
                $(target_id).replaceWith("<span>"+res.average_drugs+"</span>");
            }
            else if(res.error.code == 2) {
                console.log("Incorrect key");
                window.localStorage.setItem("APIKey","");
                APIKey = getAPIKey();
            }
            else {
                console.log("other api error");
            }
        })
        .catch(e => console.log("fetch error", e));

    }

    makeShortcuts();
});