// ==UserScript==
// @name         添加开发环境jenkins分类
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  开发环境 jenkins 添加分类标签
// @author       gkshi
// @match        http://dev.jenkins.xq5.com/job/%E6%A3%8B%E7%89%8Cweb%E5%89%8D%E7%AB%AF/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xq5.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448533/%E6%B7%BB%E5%8A%A0%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83jenkins%E5%88%86%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/448533/%E6%B7%BB%E5%8A%A0%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83jenkins%E5%88%86%E7%B1%BB.meta.js
// ==/UserScript==



(function() {
    'use strict';
    setTimeout(() => {
      addExtraTypeIntoTrEl()
      addTypeTabIntoMenu()
    })
})();


function addExtraTypeIntoTrEl() {
    const data = getData()

    const trList = document.querySelectorAll('#projectstatus tr')
    trList.forEach(tr => {
        if (!data[tr.id]) return
        tr.setAttribute('type', data[tr.id])
        tr.classList.add('project-extra')
    })

}


function addTypeTabIntoMenu() {
    const tabs = getTypes()
    const tabEls = []
    tabs.forEach(t => {
        const div = document.createElement('div')
        div.className = 'tab'
        div.setAttribute('type', t)
        const a = document.createElement('a')
        a.setAttribute('type', t)
        a.href = 'javascript:void(0);'
        a.textContent = t

        div.appendChild(a)
        div.addEventListener('click', clickHandler)

        tabEls.push(div)

        const tabParent = document.querySelector('.tabBarFrame .tabBar')
        tabEls.forEach(t => {
            tabParent.appendChild(t)
        })
    })
}


function clickHandler(e) {
    const type = e.target.type
    activeThisTab(type)
    filterProjectByType(type)
}


function activeThisTab(type) {
    const tabs = document.querySelectorAll('.tabBarFrame .tabBar .tab')
    tabs.forEach(t => {
        const cType = t.getAttribute('type')
        if (cType !== type) {
            t.classList.remove('active')
            return
        }
        t.classList.add('active')
    })
}

function filterProjectByType(type) {
    const trList = document.querySelectorAll('.project-extra')
    trList.forEach(tr => {
       const trType = tr.getAttribute('type')
       if (trType === type) tr.style.display = 'table-row'
       else tr.style.display = 'none'

    })
}


function getTypes() {
    const types = ['vuejs-dev', 'rawjs-dev', 'xyx-vuejs-dev', 'xyx-rawjs-dev', 'out-vue-js-dev']
    return types
}

function getData() {
    const data = {"monapp-dev":"vuejs-dev","job_wycwapp-dev":"vuejs-dev","job_itmadmin-dev":"vuejs-dev","job_agentapp-dev":"vuejs-dev","job_annual-meeting-2022":"vuejs-dev","job_apiapp-dev":"vuejs-dev","job_authmgrapp-dev":"vuejs-dev","job_bas-dev":"vuejs-dev","job_behavior-report-dev":"vuejs-dev","job_buyProduct-dev":"vuejs-dev","job_ccdata-dev":"vuejs-dev","job_clientlogapp-dev":"vuejs-dev","job_customer-complaint-dev":"vuejs-dev","job_dazhuanpanapp-dev":"vuejs-dev","job_deployapp-dev":"vuejs-dev","job_hotupdate-dev":"vuejs-dev","job_hotupdate-dev3d":"vuejs-dev","job_hotupdate-dev3d-ios":"vuejs-dev","job_imapp-dev":"vuejs-dev","job_index-management-dev":"vuejs-dev","job_jiAnGameAreaProxy-dev":"vuejs-dev","job_kfdh-dev":"vuejs-dev","job_ksapp-dev":"vuejs-dev","job_middle-log-center-web-dev":"vuejs-dev","job_monitor-report-dev":"vuejs-dev","job_moveksapp-dev":"vuejs-dev","job_opapp-dev":"vuejs-dev","job_opdata-dev":"vuejs-dev","job_opsapp-dev":"vuejs-dev","job_redwolfapp":"vuejs-dev","job_serverapp-dev":"vuejs-dev","job_smsapisrv-dev":"vuejs-dev","job_sse-dev":"vuejs-dev","job_test-host-login":"vuejs-dev","job_training-ground-dev":"vuejs-dev","job_union-general-agent-dev":"vuejs-dev","job_user-kfdh-dev":"vuejs-dev","job_vue-element-component-dev":"vuejs-dev","job_vue-element-component-storybook-dev":"vuejs-dev","job_wechatmgrapp-dev":"vuejs-dev","job_wxopapp-dev-test":"vuejs-dev","job_zdapp-dev":"vuejs-dev","job_用户权限管理后台-authmgrapp-dev":"vuejs-dev","job_财务后台前端-cwapp-dev":"vuejs-dev","job_赢大师运营数据后台bigWinner-dev":"vuejs-dev","job_赢大师运营管理后台bigWinnerManage-dev":"vuejs-dev","job_集团官网管理后台gowbapp-dev":"vuejs-dev","job_active-king-dev":"rawjs-dev","job_assistant":"rawjs-dev","job_baiwanhongbaojs-dev":"rawjs-dev","job_bigWinnerH5-dev":"rawjs-dev","job_bigWinnerProduct-dev":"rawjs-dev","job_common-mp-dev":"rawjs-dev","job_dazhuanpanjs-dev":"rawjs-dev","job_dynamicdzpjs-dev":"rawjs-dev","job_help-dev":"rawjs-dev","job_icp-record-dev":"rawjs-dev","job_indexapp-dev":"rawjs-dev","job_matchrankjs-dev":"rawjs-dev","job_new-assistant":"rawjs-dev","job_popup-test":"rawjs-dev","job_redrecall-dev":"rawjs-dev","job_reportSystem-dev":"rawjs-dev","job_verification-dev":"rawjs-dev","job_withdraw-test":"rawjs-dev","job_xinshoulibaojs-dev":"rawjs-dev","job_ydsDownload":"rawjs-dev","job_yonghuyaoqingjs-dev":"rawjs-dev","job_zonstloginapp-dev":"rawjs-dev","job_七夕活动-qixi-dev":"rawjs-dev","job_我的名片和战绩展示-myCard-dev":"rawjs-dev","job_比赛场奖励信息页面-matchawardjs-dev":"rawjs-dev","job_集团官网-dev":"rawjs-dev","job_bigdataapp-dev":"xyx-vuejs-dev","job_ddzops-dev":"xyx-vuejs-dev","job_wxopapp-dev":"xyx-vuejs-dev","job_wxopdata-dev":"xyx-vuejs-dev","job_wxopdata_mobile-dev":"xyx-vuejs-dev","job_xxkf-dev":"xyx-vuejs-dev","job_datasrv-paiku-dev":"xyx-rawjs-dev","job_ddzDownload_single-dev":"xyx-rawjs-dev","job_unionhonggutan-dev":"xyx-rawjs-dev","job_xyxH5_share-dev":"xyx-rawjs-dev","job_company-research-dev":"out-vue-js-dev","job_household-management-dev":"out-vue-js-dev"}
    return data
}
/*
vuejs-dev: ['job_agentapp-dev', 'job_annual-meeting-2022', 'job_apiapp-dev', 'job_authmgrapp-dev', 'job_bas-dev', 'job_behavior-report-dev', 'job_buyProduct-dev', 'job_ccdata-dev', 'job_clientlogapp-dev', 'job_customer-complaint-dev', 'job_dazhuanpanapp-dev', 'job_deployapp-dev', 'job_hotupdate-dev', 'job_hotupdate-dev3d', 'job_hotupdate-dev3d-ios', 'job_imapp-dev', 'job_index-management-dev', 'job_jiAnGameAreaProxy-dev', 'job_kfdh-dev', 'job_ksapp-dev', 'job_middle-log-center-web-dev', 'job_monitor-report-dev', 'job_moveksapp-dev', 'job_opapp-dev', 'job_opdata-dev', 'job_opsapp-dev', 'job_redwolfapp', 'job_serverapp-dev', 'job_smsapisrv-dev', 'job_sse-dev', 'job_test-host-login', 'job_training-ground-dev', 'job_union-general-agent-dev', 'job_user-kfdh-dev', 'job_vue-element-component-dev', 'job_vue-element-component-storybook-dev', 'job_wechatmgrapp-dev', 'job_wxopapp-dev-test', 'job_zdapp-dev', 'job_用户权限管理后台-authmgrapp-dev', 'job_财务后台前端-cwapp-dev', 'job_赢大师运营数据后台bigWinner-dev', 'job_赢大师运营管理后台bigWinnerManage-dev', 'job_集团官网管理后台gowbapp-dev']

rawjs-dev: ['job_active-king-dev', 'job_assistant', 'job_baiwanhongbaojs-dev', 'job_bigWinnerH5-dev', 'job_bigWinnerProduct-dev', 'job_common-mp-dev', 'job_dazhuanpanjs-dev', 'job_dynamicdzpjs-dev', 'job_help-dev', 'job_icp-record-dev', 'job_indexapp-dev', 'job_matchrankjs-dev', 'job_new-assistant', 'job_popup-test', 'job_redrecall-dev', 'job_reportSystem-dev', 'job_verification-dev', 'job_withdraw-test', 'job_xinshoulibaojs-dev', 'job_ydsDownload', 'job_yonghuyaoqingjs-dev', 'job_zonstloginapp-dev', 'job_七夕活动-qixi-dev', 'job_我的名片和战绩展示-myCard-dev', 'job_比赛场奖励信息页面-matchawardjs-dev', 'job_集团官网-dev']

xyx-vuejs-dev: ['job_bigdataapp-dev', 'job_ddzops-dev', 'job_wxopapp-dev', 'job_wxopdata-dev', 'job_wxopdata_mobile-dev', 'job_xxkf-dev']

xyx-rawjs-dev: ['job_datasrv-paiku-dev', 'job_ddzDownload_single-dev', 'job_unionhonggutan-dev', 'job_xyxH5_share-dev']

out-vue-js-dev: ['job_company-research-dev', 'job_household-management-dev']
*/