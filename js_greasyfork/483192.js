// ==UserScript==
// @name         统计数据
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  是否接口上线后查询日志麻烦，统计繁琐，使用本插件可以直接一次性查询
// @author       DaiXukai（xkplan@163.com）
// @match        https://next.api.aliyun.com/**
// @icon         https://next.api.aliyun.com/favicon.ico
// @license      GNU GPLv3
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/483192/%E7%BB%9F%E8%AE%A1%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/483192/%E7%BB%9F%E8%AE%A1%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

// 使用方式：
//     1. 打开网站 https://next.api.aliyun.com/api/Sls/2020-12-30/GetHistograms
//     2. 登录 RAM 账号
//     3. 点击脚本“执行”，输入参数等待结果

// 插件配置
const config = {
    // 日志库配置
    logstore: {
        // 访问日志
        access: "hd_manbo_portal_access",
        // 错误日志
        error: "hd_manbo_portal_error",
    }
}
// 运行状态
const state = {
    running: false,
    inputQuery: "",
    inputDate: "1,2",
    eleBox: undefined
}

/**
 * prompt 用户输入，忽略空字符串
 * @param {string} promptMsg 输入提示信息
 * @param {string} def 默认输入内容（占位）
 * @param {RegExp} regex 校验内容正则表达式
 * @throws 1 点击取消抛出
 * @returns string 用户输入内容
 */
function input(promptMsg, def, regex) {
    let tmpInput = "";
    while (!regex.test(tmpInput)) {
        tmpInput = prompt(promptMsg, def);
        if (tmpInput === null || tmpInput === undefined) {
            // 点击取消
            throw 1;
        }
        tmpInput = tmpInput.trim();
    }
    return tmpInput;
}

/**
 * 请求接口查询日志统计数
 * @param {string} logstore 日志库名
 * @param {number} from 开始时间戳（秒）
 * @param {number} to 结束时间戳（秒）
 * @param {string} query 查询语句
 * @returns Promise 结果为统计到的日志数量
 */
async function request(logstore, from, to, query) {
    let resp = await fetch("https://next.api.aliyun.com/api/auth/product/openAPIRequest", {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "bx-v": "2.5.6",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://next.api.aliyun.com/api/Sls/2020-12-30/GetHistograms?sdkStyle=dara&params=%7B%22to%22:1703073392,%22from%22:1703072486,%22logstore%22:%22hd_service_live_info%22,%22project%22:%22hd-live%22,%22query%22:%22444%22%7D&tab=DEBUG&lang=PYTHON",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"action\":\"GetHistograms\",\"product\":\"Sls\",\"bodyStyle\":null,\"apiStyle\":\"ROA\",\"apiVersion\":\"2020-12-30\",\"accessKeyId\":null,\"proxyEndpoint\":\"http://popunify-inner-pre.aliyuncs.com\",\"endpoint\":\"cn-beijing.log.aliyuncs.com\",\"regionId\":\"cn-beijing\",\"paramObject\":{\"method\":\"GET\",\"path\":\"/logstores/{logstore}/index?type=histogram\",\"params\":\"[{\\\"name\\\":\\\"project\\\",\\\"position\\\":\\\"Host\\\",\\\"required\\\":true,\\\"checkBlank\\\":false,\\\"visibility\\\":\\\"Public\\\",\\\"deprecated\\\":false,\\\"type\\\":\\\"String\\\",\\\"title\\\":\\\"project 名称。\\\",\\\"example\\\":\\\"ali-test-project\\\",\\\"description\\\":\\\"project 名称。\\\"},{\\\"name\\\":\\\"logstore\\\",\\\"position\\\":\\\"Path\\\",\\\"required\\\":true,\\\"checkBlank\\\":false,\\\"visibility\\\":\\\"Public\\\",\\\"deprecated\\\":false,\\\"type\\\":\\\"String\\\",\\\"title\\\":\\\"logstore 名称。\\\",\\\"example\\\":\\\"test-logstore\\\",\\\"description\\\":\\\"Logstore名称。\\\"},{\\\"name\\\":\\\"from\\\",\\\"position\\\":\\\"Query\\\",\\\"required\\\":true,\\\"checkBlank\\\":false,\\\"visibility\\\":\\\"Public\\\",\\\"deprecated\\\":false,\\\"type\\\":\\\"Long\\\",\\\"title\\\":\\\"查询开始时间点。UNIX时间戳格式，表示从1970-1-1 00:00:00 UTC计算起的秒数。\\\\n\\\\n时间区间遵循“左闭右开”原则，即该时间区间包括区间开始时间点，但不包括区间结束时间点。如果from和to的值相同，则为无效区间，函数直接返回错误。\\\",\\\"example\\\":\\\"1409529600\\\",\\\"description\\\":\\\"子时间区间的开始时间点。UNIX时间戳格式，表示从1970-1-1 00:00:00 UTC计算起的秒数。\\\"},{\\\"name\\\":\\\"to\\\",\\\"position\\\":\\\"Query\\\",\\\"required\\\":true,\\\"checkBlank\\\":false,\\\"visibility\\\":\\\"Public\\\",\\\"deprecated\\\":false,\\\"type\\\":\\\"Long\\\",\\\"title\\\":\\\"查询结束时间点。UNIX时间戳格式，表示从1970-1-1 00:00:00 UTC计算起的秒数。\\\\n\\\\n时间区间遵循“左闭右开”原则，即该时间区间包括区间开始时间点，但不包括区间结束时间点。如果from和to的值相同，则为无效区间，函数直接返回错误。\\\",\\\"example\\\":\\\"1409569200\\\",\\\"description\\\":\\\"子时间区间的结束时间点。UNIX时间戳格式，表示从1970-1-1 00:00:00 UTC计算起的秒数。\\\"},{\\\"name\\\":\\\"topic\\\",\\\"position\\\":\\\"Query\\\",\\\"required\\\":false,\\\"checkBlank\\\":false,\\\"visibility\\\":\\\"Public\\\",\\\"deprecated\\\":false,\\\"type\\\":\\\"String\\\",\\\"title\\\":\\\"日志主题。\\\",\\\"example\\\":\\\"topic\\\",\\\"description\\\":\\\"日志主题。\\\"},{\\\"name\\\":\\\"query\\\",\\\"position\\\":\\\"Query\\\",\\\"required\\\":false,\\\"checkBlank\\\":false,\\\"visibility\\\":\\\"Public\\\",\\\"deprecated\\\":false,\\\"type\\\":\\\"String\\\",\\\"title\\\":\\\"查询语句。仅支持查询语句，不支持分析语句。关于查询语句的详细语法，请参见查询语法。\\\",\\\"example\\\":\\\"with_pack_meta\\\",\\\"description\\\":\\\"查询语句。仅支持查询语句，不支持分析语句。关于查询语句的详细语法，请参见[查询语法](~~43772~~)。\\\"}]\",\"protocol\":\"HTTP|HTTPS\"},\"params\":{\"to\":" + to + ",\"from\":" + from + ",\"logstore\":\"" + logstore + "\",\"project\":\"hd-live\",\"query\":\"" + query + "\"},\"credential\":{\"type\":\"ak\"}}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    if (resp.status !== 200) {
        alert("请求失败，请重试");
        throw Error(`请求失败 logstore=${logstore}, from=${from}, to=${to}, query=${query}\nresponse=>${JSON.stringify(resp)}`);
    }
    let data = await resp.json();
    if (data.code === "E_NEED_LOGIN") {
        // 未登录
        alert("请先登录后重试\nhttps://next.api.aliyun.com/api/Sls/2020-12-30/GetHistograms");
        throw Error(`未登录`);
    }
    if (data.code !== 0) {
        alert("请求失败，未知异常，请重试");
        throw Error(`请求失败 logstore=${logstore}, from=${from}, to=${to}, query=${query}\nresponse=>${JSON.stringify(resp)}`);
    }
    data = data.data
    // 计数
    let count = 0;
    if (data.result === undefined){
        return 0;
    }
    for (let item of data.result) {
        count += item.count;
    }
    return count;
}

/**
 * html 字符串转换为 Node 对象
 * @param {string} html html 代码段
 * @returns Node 转换出的 Node 元素
 */
function parseDom(html) {
    let template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes[0];
}

function closeResult() {
    if (state.eleBox) {
        state.eleBox.remove();
        state.eleBox = undefined;
    }
}

unsafeWindow.closeResult = closeResult;

function showResult(data) {
    console.log("result", data);
    let eleBox = parseDom(`<div id="_sls_result_box_" style="padding: 12px; background: white; border-radius: 16px; position: fixed; z-index: 999; top: 0; bottom:0; left: 0; right: 0; margin: auto auto; width: fit-content; height: fit-content; box-shadow: rgba(0, 0, 0, 0.3) 0 19px 38px, rgba(0, 0, 0, 0.22) 0 15px 12px; display: flex; flex-direction: column; align-items: center;"></div>`)
    let eleTable = parseDom(`<table style="background: white; border: 1px solid #818181; border-collapse: collapse;"></table>`);
    let eleThead = document.createElement('thead');
    let eleTbody = document.createElement('tbody');
    eleTable.appendChild(eleThead);
    eleTable.appendChild(eleTbody);
    eleBox.appendChild(eleTable);
    let eleButton = parseDom(`<button onclick="window.closeResult()" style="background: #00adff; margin-top: 16px; border: 0; border-radius: 8px; padding: 4px 24px; color: white;">关闭</button>`)
    eleBox.appendChild(eleButton);

    // 表头
    let eleTr = document.createElement('tr');
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>日期</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>查询接口（已排除登录校验和用户禁用）</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>接口名称</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>全天请求次数</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>失败总数</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>成功率</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>晚高峰请求次数</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>晚高峰失败次数</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>晚高峰成功率</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>晚高峰QPS</th>"));
    eleThead.appendChild(eleTr);

    // 表内容
    for (let item of data) {
        eleTr = document.createElement('tr');
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.date}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.api}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'></td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.dayAccessCount}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.dayErrorCount}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${parseFloat(Math.floor(item.daySuccessRatio * 100) / 100)}%</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.peakAccessCount}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.peakErrorCount}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${parseFloat(Math.floor(item.peakSuccessRatio * 100) / 100)}%</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${parseFloat(Math.floor(item.peakQps * 10000) / 10000)}</td`));
        eleTbody.appendChild(eleTr);
    }

    document.body.appendChild(eleBox);
    state.eleBox = eleBox;

    GM_notification({
        title: "有咖互动接口数据统计",
        text: "统计完成",
        timeout: 3000,
    });
}

// 脚本主体
GM_registerMenuCommand("执行", async () => {
    if (state.running) {
        return;
    }
    try {
        state.running = true;
        closeResult();
        // 输入查询参数
        state.inputQuery = input(`请输入查询接口（英文逗号分隔，如 "/dynamic/lottery/basic/info, /dynamic/lottery/detail"）`, state.inputQuery, /^.+(,.+)*$/);
        state.inputDate = input(`请输入查询日期（前一天为 1，前第二天为 2，以此类推，英文逗号分隔，如 "1,2" 查询前两天）`, state.inputDate, /^[1-9]\d{0,6}(,[1-9]\d{0,6})*$/);

        // 解析参数
        let apiList = state.inputQuery.split(",");
        for (let i in apiList) {
            apiList[i] = apiList[i].trim();
        }
        let dateList = state.inputDate.split(",");
        for (let i in dateList) {
            dateList[i] = parseInt(dateList[i].trim());
        }

        GM_notification({
            title: "有咖互动接口数据统计",
            text: "执行统计中，请勿关闭窗口，请稍等...",
            timeout: 3000,
        });

        // 获取今天的开始时间戳（秒）
        const now = new Date();
        const todayStartTimestamp = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} 00:00:00`).getTime() / 1000;

        let data = [];
        for (let api of apiList) {
            for (let date of dateList) {
                let startTimestamp = todayStartTimestamp - date * 24 * 3600;
                let startTime = new Date(startTimestamp * 1000);
                let endTimestamp = todayStartTimestamp - (date - 1) * 24 * 3600;
                // 全天请求次数
                let dayAccessCount = await request(config.logstore.access, startTimestamp, endTimestamp, `#\\"${api} remote\\"`);
                // 失败总数
                let dayErrorCount = await request(config.logstore.error, startTimestamp, endTimestamp, `#\\"| requestURI:${api} |\\" not 用户鉴权失败 not 用户已被禁用`);
                // 成功率
                let daySuccessRatio = dayAccessCount === 0 ? 100 : ((1 - dayErrorCount / dayAccessCount) * 100);
                // 晚高峰请求次数 20:00-24:00
                let peakAccessCount = await request(config.logstore.access, endTimestamp - 4 * 3600, endTimestamp, `#\\"${api} remote\\"`);
                // 晚高峰失败次数 20:00-24:00
                let peakErrorCount = await request(config.logstore.error, endTimestamp - 4 * 3600, endTimestamp, `#\\"| requestURI:${api} |\\" not 用户鉴权失败 not 用户已被禁用`);
                // 晚高峰成功率
                let peakSuccessRatio = peakAccessCount === 0 ? 100 : ((1 - (peakErrorCount / peakAccessCount)) * 100);
                // 晚高峰QPS
                let peakQps = peakAccessCount / (4 * 3600);
                data.push({
                    date: `${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`,
                    api,
                    dayAccessCount,
                    dayErrorCount,
                    daySuccessRatio,
                    peakAccessCount,
                    peakErrorCount,
                    peakSuccessRatio,
                    peakQps
                });
            }
        }
        showResult(data);
    } finally {
        state.running = false;
    }
}, "Random");

// 脚本主体
GM_registerMenuCommand("kafka 消息发送统计", async () => {
    if (state.running) {
        return;
    }
    try {
        state.running = true;
        closeResult();

        GM_notification({
            title: "有咖互动接口数据统计",
            text: "执行统计中，请勿关闭窗口，请稍等...",
            timeout: 3000,
        });

        // 获取今天的开始时间戳（秒）
        const todayStartTimestamp = new Date(`2024-03-24 00:00:00`).getTime() / 1000;

        let topicList = [
            "add_room_tags",
            "adv_balance_deduction_check",
            "async_forbid_2_im_server",
            "async_forbid_4_living_room_2_im_server",
            "async_group_change",
            "async_h5_cancellation_account",
            "async_push_activity_message",
            "async_send_audit_message",
            "async_send_fans_group_member_change",
            "async_send_talker_audit_message",
            "backpack_operation",
            "calculate_novel_rank_list_score",
            "calculate_ranking_information",
            "calculate_user_ranking_information",
            "chapter_publish",
            "collect_update_sync_to_all",
            "combination_goods_reward",
            "comment_incr_sort_value",
            "comment_info_sync",
            "communicate_accept",
            "communicate_accept_by_id",
            "communicate_add_rmb",
            "communicate_invite",
            "communicate_refund",
            "dispatch_apns_message",
            "dispatch_jiguang_message",
            "doudian_message_handle_push",
            "drama_count_sync_to_es",
            "drama_pay_to_vip_return_gold",
            "drama_resource_zip_retry",
            "drama_role_add_popularity",
            "fans_group_member_consume",
            "fans_group_order",
            "fans_ranking_user_action",
            "full_site_float_screen_first_level",
            "full_site_float_screen_second_level",
            "gacha_broadcast_fist_push_consume",
            "gacha_broadcast_second_push_consume",
            "get_attention_weibouid_from_openapi",
            "gift_bag_gift_queue",
            "gift_push_msg_first_level",
            "gift_push_msg_second_level",
            "global_index_create",
            "global_index_update",
            "global_index_update_video_info",
            "global_index_video_info",
            "good_msg_database_sync_h5",
            "good_msg_sync_h5",
            "good_msg_sync_h5_live_show",
            "google_renewal_retry",
            "google_renewal_status_retry",
            "group_discovery_content_base_score_sync",
            "group_discovery_group_base_score_sync",
            "gt_push",
            "h5_activity_topic",
            "h5_bi_data_monitor",
            "h5_event_good_reward",
            "h5_gacha_info_topic",
            "h5_live_room_heart_beat",
            "h5_specific_repost_vip",
            "h5_sync_server_api_niudan_log",
            "h5_sync_server_api_room_log",
            "h5_user_exp_result",
            "hidden_lottie_gift_send",
            "hongdou_grab_red_packet_reward",
            "huajiao_big_gift_notify_queue",
            "ice_chaved_topic",
            "init_novice_mission",
            "init_user_send_gold",
            "ios_renewal_retry",
            "ios_renewal_status_retry",
            "ios_retry_verify_receipt",
            "kila-user-change-log",
            "kila_client_upload_log",
            "klive_h5_activity",
            "klive_h5_room_heartbeat",
            "klive_inviter_reward",
            "klive_sync_h5_user_exp_add",
            "klive_user_exp_activity",
            "link_small_video",
            "lottery_condition_status_info",
            "meet_game_record_queue",
            "noble_push_msg",
            "novel_es_info",
            "novel_monitor",
            "novel_msg_sync_h5",
            "novel_pay_sync_h5",
            "novel_statistic_count_sync_to_es",
            "novice_follow_user",
            "operate_room_to_category",
            "order_send_category_reward",
            "order_send_communicate_reward",
            "order_send_gift_reward",
            "order_send_house_reward",
            "order_send_question_reward",
            "order_send_recharge_reward",
            "order_send_reward",
            "order_send_share_question_reward",
            "other_platform_buy_member",
            "pendant_gift_push_msg",
            "pika_month_live_reward",
            "pika_ranklist_topic",
            "process_when_drama_zip_complete",
            "purify_word_sync_new_es",
            "push_jiguang_retry",
            "push_message",
            "question_add_rmb",
            "question_refund",
            "question_video_process",
            "radio_drama_collect_push",
            "random_video_match_push_queue",
            "random_video_match_queue",
            "record_month_active_user_for_push",
            "red_packet_grab_im",
            "red_packet_grab_over",
            "red_packet_refund",
            "red_packet_refund_new",
            "red_packet_send_im",
            "renewal_unsign",
            "room_record_profit",
            "room_resource_zip",
            "room_resource_zip_retry",
            "room_server_test_topic",
            "room_timeline_auto_recommend",
            "room_weight_update",
            "search_server_test_topic",
            "send_chat_room_message",
            "send_hongdou_diamond_queue",
            "send_sms_after_user_withdraw",
            "send_sms_when_create_room",
            "send_weibo_when_create_room",
            "slive_gift_queue",
            "sync_account_trans_detail",
            "sync_account_trans_detail_for_h5",
            "sync_api_log_for_h5",
            "sync_audit_text",
            "sync_biz_data_2_h5",
            "sync_change_user_image",
            "sync_elastic_search_consumer_center",
            "sync_h5_command_kafka_log",
            "sync_h5_heat_beat_user_exp_add",
            "sync_h5_ios_order",
            "sync_h5_user_exp_add",
            "sync_h5_user_exp_add_h5",
            "sync_interaction_data_2_h5",
            "sync_oms_auditing_info",
            "sync_oms_auditing_info_live_show",
            "sync_pika_room_heart_beat",
            "sync_room_counters_change",
            "sync_room_end_for_h5",
            "sync_room_exposure_gacha_log_to_h5",
            "sync_room_number_to_weibo",
            "sync_room_statistic_to_es",
            "sync_send_audit_result",
            "sync_specific_log_for_h5",
            "sync_star_pamper_value",
            "sync_trans_detail_for_statistics",
            "sync_trans_detail_to_statistics",
            "sync_user_like_record",
            "sync_user_relation_to_es",
            "sync_user_stats_to_es",
            "sync_user_work_role",
            "sync_waku_h5_user_exp_add",
            "sync_weibo_comment",
            "sync_year_end_new_user_task_activity",
            "synd_h5_msg",
            "talker_match",
            "talker_user_close",
            "test1",
            "third_user_add_portrait",
            "ugc_keyword_audit",
            "ugc_keyword_remove",
            "user_add_balance_act",
            "user_device_emulator_info",
            "user_letter_image",
            "user_relation_update",
            "video_resource_pack",
            "video_statistic_count_sync_to_es",
            "weibo_livecard_callback_update_trigger",
            "weibo_login_recommend_attention_anchor",
        ];
        let logList = [
            "chat_service_info",
            "hd_callback",
            "hd_manbo_portal_info",
            "hd_oms_live_info",
            "hd_portal_live_info",
            "hd_push_dispatcher_live_info",
            "hd_push_live_info",
            "hd_service_live_info",
            "room_kila_info",
            "room_manbo_info",
            "room_server_info",
            "base_manbo_info",
            "base_portal_info",
        ];
        let data = [];
        let error = [];
        for (let topic of topicList) {
            let startTimestamp = todayStartTimestamp;
            let startTime = new Date(startTimestamp * 1000);
            let endTimestamp = todayStartTimestamp + 24 * 3600;
            let dayAccessCount = 0;
            let peakAccessCount = 0;
            try{
                for (let logName of logList) {
                    // 全天请求次数
                    let tmp = await request(logName, startTimestamp, endTimestamp, `#\\"MQ send topic:${topic},\\"`);
                    dayAccessCount += tmp;
                    if(tmp > 0){
                        // 晚高峰请求次数 20:00-24:00
                        peakAccessCount += await request(logName, endTimestamp - 4 * 3600, endTimestamp, `#\\"MQ send topic:${topic},\\"`);
                    }
                }
            }catch(err){
                error.push(topic);
                console.error(err);
                continue;
            }
            data.push({
                topic,
                dayAccessCount,
                peakAccessCount
            });
        }
        showResultKafka(data);
        console.log(error);
        let csvData = [["查询 topic", "全天请求次数", "晚高峰请求次数"]];
        data.forEach(record => csvData.push([record.topic, record.dayAccessCount, record.peakAccessCount]));
        exportCSV(csvData, "topic.csv");
    } finally {
        state.running = false;
    }
}, "Random");


function exportCSV(data, filename) {
    let csv = data.map(row => row.join(',')).join('\n');
    let blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function showResultKafka(data) {
    console.log("result", data);
    let eleBox = parseDom(`<div id="_sls_result_box_" style="padding: 12px; background: white; border-radius: 16px; position: fixed; z-index: 999; top: 0; bottom:0; left: 0; right: 0; margin: auto auto; width: fit-content; height: fit-content; box-shadow: rgba(0, 0, 0, 0.3) 0 19px 38px, rgba(0, 0, 0, 0.22) 0 15px 12px; display: flex; flex-direction: column; align-items: center;"></div>`)
    let eleTable = parseDom(`<table style="background: white; border: 1px solid #818181; border-collapse: collapse;"></table>`);
    let eleThead = document.createElement('thead');
    let eleTbody = document.createElement('tbody');
    eleTable.appendChild(eleThead);
    eleTable.appendChild(eleTbody);
    eleBox.appendChild(eleTable);
    let eleButton = parseDom(`<button onclick="window.closeResult()" style="background: #00adff; margin-top: 16px; border: 0; border-radius: 8px; padding: 4px 24px; color: white;">关闭</button>`)
    eleBox.appendChild(eleButton);

    // 表头
    let eleTr = document.createElement('tr');
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>查询 topic</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>全天请求次数</th>"));
    eleTr.append(parseDom("<th style='padding: 8px 16px; border: 1px solid #818181'>晚高峰请求次数</th>"));
    eleThead.appendChild(eleTr);

    // 表内容
    for (let item of data) {
        eleTr = document.createElement('tr');
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.topic}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.dayAccessCount}</td>`));
        eleTr.append(parseDom(`<td style='padding: 8px 16px; border: 1px solid #818181'>${item.peakAccessCount}</td>`));
        eleTbody.appendChild(eleTr);
    }

    document.body.appendChild(eleBox);
    state.eleBox = eleBox;

    GM_notification({
        title: "有咖互动接口数据统计",
        text: "统计完成",
        timeout: 3000,
    });
}
