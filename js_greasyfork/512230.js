// ==UserScript==
// @name         杜康自动审批
// @namespace    a23187.cn
// @version      0.1.0
// @description  【WIP】杜康自动审批
// @author       A23187
// @match        https://dk.aliyun-inc.com/dkfed/rds/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512230/%E6%9D%9C%E5%BA%B7%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/512230/%E6%9D%9C%E5%BA%B7%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%89%B9.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const m = window.location.pathname
        .match(/^\/dkfed\/rds\/(?<region>[^/]+)\/(?<dbtype>[^/]+)\/(?<insname>[^/]+)$/);
    if (m === null) {
        return;
    }
    const { region, dbtype, insname } = m.groups;
    if (dbtype !== 'pgsql') {
        return;
    }
    const changeStartTime = Date.now();
    const changeEndTime = changeStartTime + 259200000;
    const entityDbType = dbtype;
    const entityId = insname;
    const entityRegion = region;
    const opUrl = window.location.href;
    const params = [
        {
            ysbg: 0,
            reason: '修改实例状态',
            changeStartTime,
            changeEndTime,
            planChange: '修改实例状态',
            riskLevel: 'HIGH',
            riskDesc: '修改实例状态',
            methodTest: '修改实例状态',
            planSave: '修改实例状态',
            approvers: [],
            opProduct: 'dbaas-meta',
            opEntity: {
                entityType: 'CUST_INSTANCE',
                entityId,
                entityDbType,
                entityRegion,
            },
            opAction: 'UpdateReplicaSetStatus',
            businessType: 0,
            opUrl,
        },
        {
            ysbg: 0,
            reason: '订正实例帐号模式',
            changeStartTime,
            changeEndTime,
            planChange: '订正实例帐号模式',
            riskLevel: 'HIGH',
            riskDesc: '订正实例帐号模式',
            methodTest: '订正实例帐号模式',
            planSave: '订正实例帐号模式',
            approvers: [],
            opProduct: 'dbaas-meta',
            opEntity: {
                entityType: 'OTHER',
                entityId,
                entityRegion,
            },
            opAction: 'UpdateReplicasetAccountMode',
            businessType: 0,
            opUrl,
        },
        {
            ysbg: 0,
            reason: '通过+webshell+登录所有+DB+实例主机,实际方案以操作为准。',
            changeStartTime,
            changeEndTime,
            planChange: '通过+webshell+登录所有+DB+实例主机,实际方案以操作为准。',
            riskLevel: 'HIGH',
            riskDesc: '风险极高，+将被安全审计分析,+请认真填写变更原因。+会黑屏登录所有DB实例所在主机，+可查日志，+变更文件。',
            methodTest: '页面登录，无需验证',
            planSave: '无需回滚',
            approvers: [],
            opProduct: 'dukang',
            opEntity: {
                entityType: 'OTHER',
                entityId,
                entityRegion,
            },
            opAction: 'GetHostWebShell',
            businessType: 0,
            opUrl,
        },
        {
            ysbg: 0,
            reason: '通过dbaas-client登录实例',
            changeStartTime,
            changeEndTime,
            planChange: '通过dbaas-client登录实例',
            riskLevel: 'HIGH',
            riskDesc: '登录实例高风险操作',
            methodTest: '人工验证',
            planSave: '回滚命令',
            approvers: [],
            opProduct: 'dukang',
            opEntity: {
                entityType: 'OTHER',
                entityId,
                entityRegion,
            },
            opAction: 'GetPodWebshell',
            businessType: 0,
            opUrl,
        },
    ];
    const url = 'https://dk.aliyun-inc.com/data/api.json?__action=CreateChangesafeOrder';
    const body = new FormData();
    body.set('action', 'CreateChangesafeOrder');
    body.set('product', 'apsaraops');
    body.set('region', region);
    for (let i = 0; i < params.length; i++) {
        body.set('params', JSON.stringify(params[i]));
        const p = await fetch(url, { method: 'POST', body }).then((resp) => resp.json());
        console.log('批', params[i].opAction, p);
    }
})();
