// ==UserScript==
// @name         jenkins布局调整
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       shihuang
// @match      *://*.jenkins.zonst.com/*
// @match      *://*.jenkins.xq5.com/*
// @icon         https://www.google.com/s2/favicons?domain=zonst.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433139/jenkins%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/433139/jenkins%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var pageFromHome = !/console/ig.test(window.location.href);

    /*  首页调整  start  */
    // 调整左下角构建历史栏
    var historyEl = document.querySelector('#buildHistory .pane-content');
    // 设置样式
    if(historyEl) {
        historyEl.style.height = '200px';
        historyEl.style.overflow = 'scroll';
    }


    // 调整右半部分 wrapper
    var mainPanel = document.getElementById('main-panel');
    if(mainPanel) {
        mainPanel.style.height = 'calc(100vh - 200px)';
        mainPanel.style.overflow = 'scroll';
    }


    // 调整编译框
    var aEl = document.querySelector('#main-panel div>a[name=skip2content]')
    var compilerBox = aEl ? aEl.parentNode : null;
    if(compilerBox) {
        compilerBox.style.width = '60vw';
        compilerBox.style.height = 'calc(100% - 140px)';
        compilerBox.style.overflow = 'scroll';
        compilerBox.scrollTop = 999999; // 始终保持滚动到最下面
    }

    // 构建按钮的监听
    var taskLinks = document.querySelectorAll('#tasks .task-link')
    for (var idx = 0; idx < taskLinks.length; idx++) {
        var linkText = taskLinks[idx].onclick
        if (/build/.test(linkText)) {
            taskLinks[idx].addEventListener('click', () => {
              setTimeout(() => {
                window.location.reload()
            }, 2500)
            })
        }
    }
    // 如果在构建时刷新了
    if (pageFromHome) {
        buildBtnCallback(compilerBox)()
    }

    /*  首页调整  end  */

    /* 详细控制台调整  start */
    if (!pageFromHome) {
        var compilerBoxEl = document.querySelector('#main-panel')
        buildBtnCallback(compilerBoxEl)()
    }
    /* 详细控制台调整  end */

    /* 公共调整  start */
    // 添加一键到顶/底
    var pageBody = document.getElementById('page-body');


    if (pageBody && mainPanel && mainPanel.scrollHeight > (pageBody.offsetHeight + 200) || (!pageFromHome && document.querySelector('#out'))) {
        // 1. 添加样式标签
        setCommonStyle();
        // 2. 添加标签
        createEls();
    }
    /* 公共调整  end */


    function setCommonStyle() {
        var selfGoWrapper = '.self-go-wrapper { position: fixed; bottom: 120px; right: 60px; display: flex; flex-direction: column; }';
        var selfGoA = '.self-go { width: 50px; height: 50px; background: rgba(0,0,0, .4); display: flex; justify-content: center; align-items: center; font-size: 20px; border-radius: 50%; margin-bottom: 10px; }';
        var commonStyle = selfGoWrapper + '\n' + selfGoA;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(commonStyle));

        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    function createEls() {
        var wrapper = document.createElement('div');
        wrapper.className = 'self-go-wrapper';
        var upEl = document.createElement('a');
        var downEl = document.createElement('a');
        upEl.href = downEl.href = 'javascript:;';
        upEl.className = downEl.className = 'self-go';

        upEl.textContent = '🔼';
        upEl.addEventListener('click', function () { goClick('up') });

        downEl.direction = 'down';
        downEl.textContent = '🔽';
        downEl.addEventListener('click', function () { goClick('down') });



        wrapper.appendChild(upEl);
        wrapper.appendChild(downEl);

        var body = document.getElementsByTagName('body')[0];
        body.appendChild(wrapper);
    }


    function goClick(direction) {
        var topVal = direction === 'up' ? 0 : 999999;
        var mainPanel = document.getElementById('main-panel');
        if (mainPanel) mainPanel.scrollTop = topVal;
    }

    function buildBtnCallback(compilerEl, outEl) {
        var pollCount = 0
        var intervalHandle = null
        return function () {
            if (pollCount > 5) {
                clearInterval(intervalHandle)
                return
            }
            // 查找是否出现构建信息的滚动窗口
            intervalHandle = setInterval(function () {
                var out = outEl || document.getElementById('out')
                if (!out) {
                    pollCount++
                    return
                }
                out.addEventListener('DOMNodeInserted', function () {
                    compilerEl.scrollTop = 999999;
                    if (compilerEl.parentNode) {
                        compilerEl.parentNode.scrollTop = 999999;
                    }

                })
                pollCount = 10
                clearInterval(intervalHandle)
            }, 5000)
        }
    }
})();

/*

vuejs-dev: ['job_agentapp-dev', 'job_annual-meeting-2022', 'job_apiapp-dev', 'job_authmgrapp-dev', 'job_bas-dev', 'job_behavior-report-dev', 'job_buyProduct-dev', 'job_ccdata-dev', 'job_clientlogapp-dev', 'job_customer-complaint-dev', 'job_dazhuanpanapp-dev', 'job_deployapp-dev', 'job_hotupdate-dev', 'job_hotupdate-dev3d', 'job_hotupdate-dev3d-ios', 'job_imapp-dev', 'job_index-management-dev', 'job_jiAnGameAreaProxy-dev', 'job_kfdh-dev', 'job_ksapp-dev', 'job_middle-log-center-web-dev', 'job_monitor-report-dev', 'job_moveksapp-dev', 'job_opapp-dev', 'job_opdata-dev', 'job_opsapp-dev', 'job_redwolfapp', 'job_serverapp-dev', 'job_smsapisrv-dev', 'job_sse-dev', 'job_test-host-login', 'job_training-ground-dev', 'job_union-general-agent-dev', 'job_user-kfdh-dev', 'job_vue-element-component-dev', 'job_vue-element-component-storybook-dev', 'job_wechatmgrapp-dev', 'job_wxopapp-dev-test', 'job_zdapp-dev', 'job_用户权限管理后台-authmgrapp-dev', 'job_财务后台前端-cwapp-dev', 'job_赢大师运营数据后台bigWinner-dev', 'job_赢大师运营管理后台bigWinnerManage-dev', 'job_集团官网管理后台gowbapp-dev']

rawjs-dev: ['job_active-king-dev', 'job_assistant', 'job_baiwanhongbaojs-dev', 'job_bigWinnerH5-dev', 'job_bigWinnerProduct-dev', 'job_common-mp-dev', 'job_dazhuanpanjs-dev', 'job_dynamicdzpjs-dev', 'job_help-dev', 'job_icp-record-dev', 'job_indexapp-dev', 'job_matchrankjs-dev', 'job_new-assistant', 'job_popup-test', 'job_redrecall-dev', 'job_reportSystem-dev', 'job_verification-dev', 'job_withdraw-test', 'job_xinshoulibaojs-dev', 'job_ydsDownload', 'job_yonghuyaoqingjs-dev', 'job_zonstloginapp-dev', 'job_七夕活动-qixi-dev', 'job_我的名片和战绩展示-myCard-dev', 'job_比赛场奖励信息页面-matchawardjs-dev', 'job_集团官网-dev']

xyx-vuejs-dev: ['job_bigdataapp-dev', 'job_ddzops-dev', 'job_wxopapp-dev', 'job_wxopdata-dev', 'job_wxopdata_mobile-dev', 'job_xxkf-dev']

xyx-rawjs-dev: ['job_datasrv-paiku-dev', 'job_ddzDownload_single-dev', 'job_unionhonggutan-dev', 'job_xyxH5_share-dev']

out-vue-js-dev: ['job_company-research-dev', 'job_household-management-dev']
 */







