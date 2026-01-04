// ==UserScript==
// @name         OCTP版权增强
// @namespace    http://bytedance.net/
// @homepage     https://bytedance.larkoffice.com/docx/GQfgdGtLko1389xK9QTcxy3On9d
// @version      2024-09-27
// @description  octp enhance
// @author       bytedance
// @match        https://qianxun.bytedance.net/octp/trace/single?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511990/OCTP%E7%89%88%E6%9D%83%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/511990/OCTP%E7%89%88%E6%9D%83%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// ------ 事件处理器 BEG ------ //

let common_handler = function (self, trace) {
    // console.log('[copyright octp] 执行 common_handler', self);
    // let jsonBlocks = getJsonBlocksInCurrentPage();
    // for (let i = 0; i < jsonBlocks.length; i++) {
    //     console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
    // }
};

let copyright_tcr_result_handler = function (self, trace) {
    console.log('[copyright octp] 执行 copyright_tcr_result_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        let dataKvs = {};

        // bes匹配结果跳转链接
        try {
            let aid = searchJson(jsonBlocks[i], 'root.tcr_info.AppID');
            let iid = searchJson(jsonBlocks[i], 'root.tcr_info.ItemID');
            dataKvs['跳转BES'] = buildHref(`https://bes.bytedance.net/associated-service/associated-query?AppID=${aid}&ItemID=${iid}`, '跳转bes查看匹配结果');
        } catch (err) {
            console.log('[copyright octp] copyright_tcr_result_handler get bes link err=', err);
        }

        // 构建tcr匹配结果cid跳转链接
        try {
            let cidDedup = {};
            for (let j = 0; j < 100; j++) {
                let key = `root.tcr_info.MatchResult.${j}`;
                let cid = searchJson(jsonBlocks[i], `${key}.CandID`);
                let rule = searchJson(jsonBlocks[i], `${key}.Rule`);
                if (rule !== 'merge') {
                    continue;
                }
                if (cid !== undefined && cid !== '0' && cid !== '' && !Object.keys(cidDedup).includes(cid)) {
                    cidDedup[cid] = searchJson(jsonBlocks[i], `${key}.Score`);
                }
            }
            let cidIndex = 1;
            for (let k in cidDedup) {
                let link = buildHref(`https://bes.bytedance.net/media-asset/base-info/detail/read/1/${k}`, k);
                dataKvs['匹配CID:' + cidIndex.toString()] = 'cid = ' + link + ' , 得分 =  ' + cidDedup[k];
                cidIndex++;
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcr_result_handler get bes link err=', err);
        }

        // 渲染表格
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let copyright_machine_review_handler = function (self, trace) {
    console.log('[copyright octp] 执行 copyright_machine_review_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        let dataKvs = {};

        let enqueueReason = searchJson(jsonBlocks[i], 'root.enqueue_reason');
        if (enqueueReason !== undefined) {
            dataKvs['机审enqueue_reason'] = enqueueReason;
        }

        let copyrightRelayFrodo = searchJson(jsonBlocks[i], 'root.copyright_relay_frodo');
        if (copyrightRelayFrodo !== undefined) {
            dataKvs['切流到frodo'] = '是';
        }

        // 渲染UI
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let pool_enpool_handler = function (self, trace) {
    console.log('[copyright octp] 执行 pool_enpool_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        let dataKvs = {};
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);

        let poolID = searchJson(jsonBlocks[i], 'root.pool_id');
        dataKvs['内容池'] = buildHref(`https://safe.bytedance.net/v2/community/moderation/workbench/content_pool_detail?draftId=&id=${poolID}`, poolID);

        // 渲染界面
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let copyright_tcr_item_tag_handler = function (self, trace) {
    console.log('[copyright octp] 执行 copyright_tcr_item_tag_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        let dataKvs = {};

        // executor
        try {
            let executor = searchJson(jsonBlocks[i], 'root.executor');
            console.log(executor)
            if (executor === 'risk_builder') {
                dataKvs['打标类型'] = '风险标签';
            } else if (executor === 'label_builder') {
                dataKvs['打标类型'] = '红绿灯标签';
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcr_item_tag_handler get executor err=', err);
        }

        // fail reason
        try {
            let failReason = searchJson(jsonBlocks[i], 'root.fail_reason');
            if (failReason === undefined || failReason === '') {
                dataKvs['失败原因'] = '未失败';
            } else {
                dataKvs['失败原因'] = failReason;
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcr_item_tag_handler get failReason err=', err);
        }

        // 渲染界面
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let pool_strategy_handler = function (self, trace) {
    console.log('[copyright octp] 执行 pool_strategy_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        let dataKvs = {};
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        // 跳转内容治理平台数据分析链接
        try {
            let execTimeUnix = searchJson(jsonBlocks[i], 'root.exec_time');
            let startTime = (execTimeUnix - 3600) * 1000;
            let endTime = (execTimeUnix + 3600) * 1000;
            let iid = searchJson(jsonBlocks[i], 'root.object_id');
            let link = `https://safe.bytedance.net/v2/community/strategy/op/indicator?urlState=` + encodeURIComponent(`{"activeTab":"trace","bizline_id":202,"source":1,"workflow_status":1,"aggregate":"minute","start_time":${startTime},"end_time":${endTime},"time":[${startTime},${endTime}],"scene_event_id":113,"scene_id":113,"hit_type":"hit","item_type":"scene","__caseId":{"idKey":"object_ids","id":"${iid}","refresh":true},"hit":"true"}`);
            dataKvs["内容治理平台链接"] = buildHref(link, "点击跳转内容治理平台");
        } catch (err) {
            console.log('[copyright octp] pool_strategy_handler build safe.v2 link err=', err);
        }

        // 渲染界面
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let copyright_tcs_review_handler = function (self, trace) {
    let dyTagIDMap = { // https://bytedance.larkoffice.com/sheets/XD5NsLHrZhN2BRtihN6cwIQKnFc?sheet=JgJA8N
        '7382051967356390185': 'dy投诉下架|<站内信>',
        '7378878797902039817': 'dy下架|<站内信+二确>',
        '7389508088585636627': 'dy付费视频下架|<站内信>',
        '7378878797902072585': 'dy自见|<站内信+二确>',
        '7382051967356422953': 'dy短剧自见|<站内信+二确>',
        '7389639837772434215': 'dy短剧回查自见',
    }
    let xgTagIDMap = {
        '7381801776787458855': 'xg投诉下架|<站内信>',
        '7378814260295797542': 'xg下架|<站内信+二确>',
        '7378845663158897459': 'xg自见|<站内信+二确>',
        '7382045758801005348': 'xg短剧自见|<站内信+二确>',
        '7389939081116912447': 'xg短剧回查自见',
    }

    console.log('[copyright octp] 执行 copyright_tcs_review_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        let dataKvs = {};
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);

        // project_id task_id verify_status
        try {
            let projectID = searchJson(jsonBlocks[i], 'root.project_id');
            let taskID = searchJson(jsonBlocks[i], 'root.task_id');
            dataKvs["project_id"] = buildHref(`https://tcs.bytedance.net/project/${projectID}/settings/plugin/basic`, projectID);
            dataKvs["task_id"] = buildHref(`https://tcs.bytedance.net/workprocess/${projectID}/?mode=scan&task_ids=${taskID}`, taskID) + '  ' + buildHref(`https://tcs.bytedance.net/worktable/search?blend_id=&tags=&sift_blend_id=${taskID}`, '[tcs审计搜索]');
        } catch (err) {
            console.log('[copyright octp] copyright_tcs_review_handler build project_id task_id verify_status err=', err);
        }

        // amon arbitrate
        try {
            let dyTagID = searchJson(jsonBlocks[i], 'root.arbitrate_result.DyTagID');
            let xgTagID = searchJson(jsonBlocks[i], 'root.arbitrate_result.XgTagID');
            let xgVL = searchJson(jsonBlocks[i], 'root.arbitrate_result.XgVL');
            if (dyTagID !== undefined && dyTagID !== '0') {
                dataKvs["Amon仲裁.抖音TagID"] = `${dyTagID} (${dyTagIDMap[dyTagID]})`;
            }
            if (xgTagID !== undefined && xgTagID !== '0') {
                dataKvs["Amon仲裁.西瓜TagID"] = `${xgTagID} (${xgTagIDMap[xgTagID]})`;
            }
            if (xgVL !== undefined && xgVL !== '0') {
                dataKvs["Amon仲裁.西瓜可见度VL"] = xgVL;
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcs_review_handler build amon arbitrate err=', err);
        }

        // select code
        try {
            let selectedCode = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.selectedcode');
            let selectedTitle = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.selectedTitle');
            let policyCodeRelationMap = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.policy_code_relation_map');
            if (selectedCode !== undefined) {
                dataKvs["片单管理队列:Selected Code"] = selectedCode;
            }
            if (selectedTitle !== undefined) {
                dataKvs["片单管理队列:Selected Title"] = selectedTitle;
            }
            if (policyCodeRelationMap !== undefined) {
                dataKvs["片单管理队列:PolicyCodeRelationMap"] = policyCodeRelationMap;
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcs_review_handler build select code err=', err);
        }

        // 虎符 https://bytedance.larkoffice.com/wiki/G1fBwEaBTigLzokI3QMcQwDYnmk
        try {
            let unpassReasonCode = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.unpass_reason_code');
            let banReason = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.ban_reason');
            let author_see_reason_candidate = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.author_see_reason_candidate');
            let verifyStatus = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.verify_status');
            if (unpassReasonCode !== undefined) {
                dataKvs["虎符:Unpass Reason Code"] = unpassReasonCode + ' (ps: 1005投诉下架 1006影视综主动下架 1071付费影视综主动下架 1058NBA自见 1086短剧自见 1091短剧回查自见 1012西瓜投诉删除 1218西瓜发文删除)';
            }
            if (banReason !== undefined) {
                dataKvs["虎符:Ban Reason"] = banReason;
            }
            if (author_see_reason_candidate !== undefined) {
                dataKvs["自见:Author See Reason Candidate"] = author_see_reason_candidate;
            }
            if (verifyStatus !== undefined) {
                dataKvs["虎符:VerifyStatus"] = verifyStatus + (' (ps: 1=通过 2=自见 3=下架)');
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcs_review_handler build unpass_reason_code err=', err);
        }

        // match_compasses
        try {
            let matchCompassesRaw = searchJson(jsonBlocks[i], 'root.verify_data.main_form_data.match_compasses');
            let matchCompasses = JSON.parse(matchCompassesRaw);
            for (let j = 0; j < matchCompasses.length; j++) {
                let cid = matchCompasses[j]['compass_id'];
                let name = matchCompasses[j]['compass_name'];
                let link = buildHref(`https://bes.bytedance.net/media-asset/base-info/detail/read/1/${cid}`, `${cid}(${name})`);
                dataKvs["Match Compass:" + j] = link;
            }
        } catch (err) {
            console.log('[copyright octp] copyright_tcs_review_handler build match_compasses err=', err);
        }

        // 渲染界面
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let copyright_arbitrate_handler = function (self, trace) {
    console.log('[copyright octp] 执行 copyright_arbitrate_handler', self);
    let policyCodeMap = {
        "12982162": "版权片单管理-剧情解说",
        "999ecd74": "版权片单管理-拆条",
        "874ee345": "版权片单管理-二创",
        "e22d75e8": "版权片单管理-素材引用",
        "2ee1d940": "版权片单管理-分享售卖版权资源",
        "8eac6fcf": "版权片单管理-NBA比赛画面",
        "cf7f000a": "版权片单管理-CBA比赛画面",
        "45ac0d18": "版权片单管理-版权盗录",
        "63c8e88a": "版权片单管理-拆条(新)",
        "4934bad9": "版权片单管理-拼接剪辑(新)",
        "cfd89fd9": "版权片单管理-盘点混剪(新)",
        "bd7d7ef3": "版权片单管理-解说(新)",
        "4af214f1": "版权片单管理-素材引用(新)",
        "7e271473": "版权片单管理-NBA比赛画面(新)",
        "9f113f41": "版权片单管理-CBA比赛画面(新)",
        "3e3ff77e": "版权片单管理-分享售卖版权资源(新)",
        "04945000": "版权片单管理-盗录(新)",
        "6376779c": "版权片单管理-央视版权(新)"
    }
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        let dataKvs = {};
        try {
            let action = searchJson(jsonBlocks[i], 'root.action');
            dataKvs["处置结论"] = action;
        } catch (err) {
            console.log('[copyright octp] copyright_arbitrate_handler find action err=', err);
        }
        try {
            let appID = searchJson(jsonBlocks[i], 'root.app_id');
            dataKvs["平台"] = (appID == 1128) ? '抖音' : '西瓜';
        } catch (err) {
            console.log('[copyright octp] copyright_arbitrate_handler find appID err=', err);
        }
        try {
            let finalStrategy = searchJson(jsonBlocks[i], 'root.final_strategy_name');
            dataKvs["最终处置决策"] = finalStrategy;
        } catch (err) {
            console.log('[copyright octp] copyright_arbitrate_handler find final_strategy err=', err);
        }
        try {
            let policy = searchJson(jsonBlocks[i], 'root.feature_map.selected_policy_code');
            dataKvs["policyCode"] = policy;
            dataKvs["policy名称"] = policyCodeMap[policy];
        } catch (err) {
            console.log('[copyright octp] copyright_arbitrate_handler find policy err=', err);
        }
        try {
            let hitIndex = 0;
            for (let strategyIndex = 0; strategyIndex < 100; strategyIndex++) {
                let hasPunishment = searchJson(jsonBlocks[i], `root.strategy_results.${strategyIndex}.has_punishment`);
                if (hasPunishment === 'true') {
                    dataKvs[`命中处置决策${hitIndex}`] = searchJson(jsonBlocks[i], `root.strategy_results.${strategyIndex}.strategy_name`);
                    hitIndex++;
                }
                if (hasPunishment === undefined) break;
            }
        } catch (err) {
            console.log('[copyright octp] copyright_arbitrate_handler find strategy_results err=', err);
        }
        try {
            let pentaxIndex = 0;
            for (let tagIndex = 0; tagIndex < 100; tagIndex++) {
                let pentaxTag = searchJson(jsonBlocks[i], `root.feature_map.pentax_tags.${tagIndex}`);
                if (pentaxTag === undefined) break;
                if (!pentaxTag.endsWith("_false")) {
                    dataKvs[`pentax标签${pentaxIndex}`] = pentaxTag;
                    pentaxIndex++;
                }
            }
        } catch (err) {
            console.log('[copyright octp] copyright_arbitrate_handler find pentax_tag err=', err);
        }
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
}

let adra_punish_event_handler = function (self, trace) {
    console.log('[copyright octp] 执行 adra_punish_event_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        let dataKvs = {};

        // project_id
        try {
            let parameters = searchJson(jsonBlocks[i], 'root.req.parameters');
            // 这边用正则不用 parameters = JSON.parse(parameters); 是因为队列id是大数，直接转会丢进度
            let projectID = parameters.match(/"project_id":\d+/g)[0].replace('"project_id":', '');
            dataKvs['project_id'] = buildHref(`https://tcs.bytedance.net/project/${projectID}/settings/plugin/basic`, projectID);
        } catch (err) {
            console.log('[copyright octp] adra_punish_event_handler get project_id err=', err);
        }

        // sr_execute_status
        try {
            let result_param = searchJson(jsonBlocks[i], 'root.action.do_action_results.0.result_param');
            result_param = JSON.parse(result_param);
            let executeInfoList = JSON.parse(result_param['ExecuteInfoList'])
            dataKvs['sr_execute_status'] = executeInfoList[0]['sr_execute_status']
        } catch (err) {
            console.log('[copyright octp] adra_punish_event_handler get result_param err=', err);
        }

        // real_action_key
        try {
            let real_action_key = searchJson(jsonBlocks[i], 'root.action.do_action_results.0.real_action_key');
            dataKvs['real_action_key'] = real_action_key
        } catch (err) {
            console.log('[copyright octp] adra_punish_event_handler get real_action_key err=', err);
        }

        // real_action_name
        try {
            let real_action_name = searchJson(jsonBlocks[i], 'root.action.do_action_results.0.real_action_name');
            dataKvs['real_action_name'] = real_action_name
        } catch (err) {
            console.log('[copyright octp] adra_punish_event_handler get real_action_name err=', err);
        }

        // 审核员
        try {
            dataKvs['审核员'] = searchJson(jsonBlocks[i], 'root.req.operator');
        } catch (err) {
            console.log('[copyright octp] adra_punish_event_handler get operator err=', err);
        }

        // tag_id
        try {
            dataKvs['给处置中心的tag_id_list.0'] = searchJson(jsonBlocks[i], 'root.req.tag_id_list.0');
        } catch (err) {
            console.log('[copyright octp] adra_punish_event_handler get tag_id_list.0 err=', err);
        }

        // 渲染数据表格
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

let copyright_tcr_start_handler = function (self, trace) {
    console.log('[copyright octp] 执行 copyright_tcr_start_handler', self);
    let jsonBlocks = getJsonBlocksInCurrentPage();
    for (let i = 0; i < jsonBlocks.length; i++) {
        console.log('[copyright octp] 查到事件数据', i, jsonBlocks[i]);
        let dataKvs = {};

        // project_id
        try {
            let caller = searchJson(jsonBlocks[i], 'root.caller');
            dataKvs['caller'] = `来源psm=${caller}`;
        } catch (err) {
            console.log('[copyright octp] copyright_tcr_start_handler get project_id err=', err);
        }

        // 渲染数据表格
        $(trace).prepend(buildCopyrightTable(dataKvs));
        break;
    }
};

// ------ 事件处理器 END ------ //
// ************************* //
// ************************* //
// ------ 常量区 BEG ------ //

const eventCls = '.css-3bkzoo';    // 上报事件名所属的cls
const jsonVarRwCls = '.variable-row'   // eg. xxx:xxx kv形式的cls
const jsonVarValueCls = '.variable-value'   // eg. kv形式value的cls
const jsonObjKVCls = '.object-key-val' // eg. xxx:[] xxx:{} 形式的cls
const jsonObjKeyCls = '.object-key'   // eg. object形式的cls
const dataTypeLabelCls = '.data-type-label' // 数据类型的cls
const stringValueLabelCls = '.string-value' // 字符串类型值
const copyrightCustomDataBlockCls = '.copyright_custom_data_block'; // 版权增强数据自定义表格
/*
object-key-val
  <span> 获取这个对象的key
    <span>
      <span>
        <span class="object-key">
  <div class="pushed-content object-container"> 对象缩进的数据
    <div class="object-content">
*/

let cpEvents = {
    'copyright_tcr_start': copyright_tcr_start_handler,
    'copyright_tcr_timer': common_handler,
    'copyright_tcr_result': copyright_tcr_result_handler,
    'copyright_tcr_item_tag': copyright_tcr_item_tag_handler,
    'copyright_enqueue': common_handler,
    'copyright_machine_review': copyright_machine_review_handler,
    'copyright_tcs_review': copyright_tcs_review_handler,
    'gorilla_runtime': common_handler,
    'adra_punish_event': adra_punish_event_handler,
    'pool_enpool': pool_enpool_handler,
    'pool_strategy': pool_strategy_handler,
    'send_tcs_review': common_handler,
    'copyright_arbitrate': copyright_arbitrate_handler
};

// ------ 常量区 END ------ //
// ************************* //
// ************************* //
// ---- main BEG ---- //

// 事件分配器，会从屏幕中搜寻事件元素作为锚点
function eventDispatcher() {
    console.log('[copyright octp] 执行 eventDispatcher')
    cleanCopyrightTable(); // 移除自定义添加的table，避免页面延迟导致多次渲染表格
    $(eventCls).each(function (index) { // 找到【上报事件】
        let eventName = $(this).text();
        let funcHandler = cpEvents[eventName];
        if (funcHandler === undefined) { // 版权事件
            //console.log('[copyright octp] 非版权事件 =', eventName);
            return;
        }
        console.log('[copyright octp] 发现版权事件 =', eventName);
        let wrapperContainer = findDivParentByClassName(this, 'traceContentContentWrapper');
        // console.log('[copyright octp] 找到顶级容器', wrapperContainer);
        try {
            funcHandler(this, wrapperContainer);
        } catch (err) {
            console.log('[copyright octp] eventDispatcher调用funcHandler失败，err =', err);
        }
    });
}

(function () { // main函数，监听不同的事件做变更
    'use strict';
    console.log('[copyright octp] OCTP版权增强插件启动');

    // 1.页面初始化时
    $(document).ready(function () {
        console.log('[copyright octp] 页面加载完毕');
        let sh; // 轮询document是否准备完毕
        sh = setInterval(function () {
            console.log('[copyright octp] 进行初始化监听');
            if ($(eventCls).text() !== '') { // 当发现traceWrapper容器准备完毕后
                console.log('[copyright octp] 移除初始化监听并处理事件');
                try {
                    eventDispatcher(); // 处理事件
                } catch (err) {
                    console.log('[copyright octp] 初始化监听事件调用eventDispatcher失败，err=', err);
                }
                clearInterval(sh);
            }
        }, 1000);
    })

    // 2.用户点击事件时
    $(window).click(function (e) {
        // 只监听timeline的点击事件
        let isTimeLineClick = findDivParentByClassName(e.target, 'timelineItemWrapper') !== undefined;
        // console.log('[copyright octp] isTimeLineClick =', isTimeLineClick)
        if (!isTimeLineClick) {
            return;
        }
        cleanCopyrightTable(); // 移除自定义添加的table
        // 如果是timeline的监听事件，若是版权事件则触发版权逻辑
        setTimeout(eventDispatcher, 250);
    });
})();

// ---- main END ---- //
// ************************* //
// ************************* //
// ------- 功能函数 BEG ------- //

// 根据className找到一个顶层父div节点
function findDivParentByClassName(self, parentClassName) {
    let parents = $(self).parents("div");
    for (let i = 0; i < parents.length; i++) {
        if (parents[i].className.includes(parentClassName)) {
            return parents[i];
        }
    }
}

// 基于当前页面，获取所有的JSON数据格子
function getJsonBlocksInCurrentPage() {
    return $('.pretty-json-container').children('div.object-content');
}

// 从json数据里全局搜寻一个key-value
function searchJson(node, pathStr) {
    //console.log('[copyright octp]', '输入path', pathStr);
    let paths = pathStr.split('.');
    let curPath = paths[0]; // 本层要找的路径名
    let nextPaths = paths.slice(1).join('.'); // 传到下一层的路径

    if (paths.length === 1) { // 是最后一个节点了
        let nodes = $(node).children('div' + jsonVarRwCls); // 本层所有variable数据节点
        // console.log('[copyright octp]', '当前path', curPath ,'找到kvs', nodes);
        for (let i = 0; i < nodes.length; i++) {
            let value = _getJsonVarValue(nodes[i], curPath);
            if (value === undefined) {
                // console.log('[copyright octp] 未能找到variable子节点，可能是路径有误, pathStr=', pathStr);
                continue;
            }
            // console.log('[copyright octp]', '当前path', curPath ,'getJsonKey找到value', value);
            return value;
        }
    } else if (!isNaN(Number(curPath, 10))) { // 如果是数字，说明读的是数组中的某一个
        let nextNode = _getArrayValue(node, Number(curPath, 10));
        if (nextNode === undefined) {
            // console.log('[copyright octp] 未能找到Array Dict子节点，可能是路径有误, pathStr=', pathStr);
            return undefined;
        }
        // console.log('[copyright octp]', '当前path', curPath ,'getArrayValue找到node', nextNode);
        return searchJson(nextNode, nextPaths);
    } else {
        let nodes = $(node).children('div' + jsonObjKVCls); // 本层所有object数据节点
        for (let i = 0; i < nodes.length; i++) {
            let key = _getJsonObjectKey(nodes[i])
            if (key === undefined) {
                console.log('[copyright octp] 未能找到Object Dict子节点，可能是路径有误, pathStr=', pathStr);
                continue;
            }
            // console.log('[copyright octp]', '当前path', curPath ,'getJsonObjectKey找到key', key.text());
            if (key.text() === curPath) { // 如果key匹配，则获取其子节点
                let nextNode = $(nodes[i]).children('div.pushed-content').children('div.object-content');
                return searchJson(nextNode, nextPaths);
            }
        }
    }
}

function _getArrayValue(node, index) {
    let nodes = $(node).children(jsonObjKVCls);
    if (index >= nodes.length) {
        return;
    }
    return $(nodes[index]).children('div.pushed-content').children('div.object-content');
}

function _getJsonVarValue(node, targetKey) {
    if (!isNaN(Number(targetKey, 10))) { // 如果是取数组Var
        let keySpan = $(node).children('span');
        for (let i = 0; i < keySpan.length; i++) {
            let key = $(keySpan[i]);
            if (key.text() === `${targetKey}:`) {
                // console.log('[copyright octp] 匹配到数字元素', key.parent().children(`div${jsonVarValueCls}`));
                return _parseVarValueByLabelTypeNode(key.parent().children(`div${jsonVarValueCls}`));
            }
        }
        return undefined;
    }

    let keySpan = $(node).children('span').children('span' + jsonObjKeyCls); // 本层所有的key对象
    for (let j = 0; j < keySpan.length; j++) {
        let keys = $(keySpan[j]).find('span');
        for (let k = 0; k < keys.length; k++) {
            let key = $(keys[k]);
            if (key.text() !== '' && key.text() !== '"' && key.text() === targetKey) {
                return _parseVarValueByLabelTypeNode($(node).children(jsonVarValueCls));
            }
        }
    }
}

// 根据.data-type-label这个类节点的输入，获取具体的json variable的值
function _parseVarValueByLabelTypeNode(node) {
    let dataTypeLabel = $(node).find(dataTypeLabelCls);
    let dataTypeEnum = dataTypeLabel.text();
    if (dataTypeEnum === 'string') {
        return trimOctpRawStr($(node).parent().children(jsonVarValueCls).find(stringValueLabelCls).text());
    } else if (dataTypeEnum === 'bool') {
        return dataTypeLabel.parent().text().replace("bool", "");
    } else if (dataTypeEnum === 'int') {
        return dataTypeLabel.parent().text().replace("int", "");
    } else if (dataTypeEnum === 'float') {
        return dataTypeLabel.parent().text().replace("float", "");
    } else {
        return dataTypeLabel.parent().html();
    }
}

function _getJsonObjectKey(node) {
    let keySpan = $(node).children('span').children('span').children('span').children(jsonObjKeyCls);
    for (let j = 0; j < keySpan.length; j++) { // 该object下的每个key
        let keys = $(keySpan[j]).find('span');
        for (let k = 0; k < keys.length; k++) {
            let key = $(keys[k]);
            if (key.text() !== '' && key.text() !== '"') {
                return key;
            }
        }
    }
}

// octp直接取出来的str用于json反序列化会有问题，前后会带有一个多余的`"`，用这个函数裁剪一下
function trimOctpRawStr(str) {
    if (str == null) return "";
    str = str.substring(1, str.length)
    return str.substring(0, str.length - 1);
}

// 创建一个copyright_表格, class=copyright_custom_data_block，用于展示自定义数据
function buildCopyrightTable(kvs) {
    if (Object.keys(kvs).length === 0) return `</div>`;

    let tableHTML = `<table border="1" width="80%"> <tr align="left"> <th width="30%">  字段名  </th> <th>  字段值  </th> </tr>`
    for (let k in kvs) {
        tableHTML += `<tr align="left"><td> ${k} </td><td> ${kvs[k]} </td></tr>`;
    }
    tableHTML += '</table>';

    return `<div class="${copyrightCustomDataBlockCls.substring(1, copyrightCustomDataBlockCls.length)}">
              </br><h4>版权增强</h4></br>
                 ${tableHTML}
              </br><hr style="FILTER: alpha(opacity=0,finishopacity=100,style=11)" width="99%" color=#808080 SIZE=1>
            </div>`;
}

// 清除表格copyright_custom_data_block
function cleanCopyrightTable() {
    $(copyrightCustomDataBlockCls).remove();
}

// 构建一个超链接
function buildHref(url, text) {
    return `<a href="${url}" target="_blank">${text}</a>`;
}

// ------- 功能函数 END ------- //