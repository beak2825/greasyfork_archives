// ==UserScript==
// @name         队列监控-超时告警【旧版停用】
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  支持多个队列发送多个群，支持总群汇总及逐条推送
// @match        https://wanx.myapp.com/omp/data-manage/quick-look*
// @grant        GM_xmlhttpRequest
// @connect      qyapi.weixin.qq.com
// @author       刚学会做蛋饼
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539987/%E9%98%9F%E5%88%97%E7%9B%91%E6%8E%A7-%E8%B6%85%E6%97%B6%E5%91%8A%E8%AD%A6%E3%80%90%E6%97%A7%E7%89%88%E5%81%9C%E7%94%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/539987/%E9%98%9F%E5%88%97%E7%9B%91%E6%8E%A7-%E8%B6%85%E6%97%B6%E5%91%8A%E8%AD%A6%E3%80%90%E6%97%A7%E7%89%88%E5%81%9C%E7%94%A8%E3%80%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultWebhook = ''; // 默认群留空
    const summaryWebhook = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=bf3c31d9-dcee-445e-b18c-1f9ab01520b6'; // 总群-队列超时响应群
    const summaryWebhook2 = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=145043f9-cede-4d6d-9d59-50f34342b495'; // 总群-报时
    const queueWebhookMap = {
        "珠宝": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
        "酒": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
        "文玩": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
        "食品生鲜": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=9a102ab1-3f9d-43cb-b073-8c1207292278",//食品提问群
        ],
        "保健品": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7cbd5fe1-d9ed-40b9-ac15-d9cdb8f1aec1",//保健品提问群
        ],
        "图书潮玩": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=9a102ab1-3f9d-43cb-b073-8c1207292278xxx",//食品提问群
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b72c58eb-c0b6-46c2-9fc9-7fc843561c1a"//图书提问群
        ],
        "服饰钟表": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2d0c3be7-8d5d-4b11-8160-df4c91dc04c0",//服饰提问群
        ],
        "成人用品": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c67daf41-4474-4828-b34c-2ab3dc1cf413",//成人用品提问群
        ],
        "美妆个护": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1165a099-5bd7-4fbc-af86-73c490ce9bee",//美妆提问群
        ],
        "好店": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=024081c8-2d25-47f6-b66c-158530ede4da",//好店提问群
        ],
        "家清家装日用": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=c2e24f55-852c-4c9b-8588-d29d9e69d058",//五组报时-家清提问群
        ],
        "教育培训": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93",//五组报时-专审群
        ],
        "本地生活2.0": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93",//五组报时-专审群
        ],
        "高热召回": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93",//五组报时-专审群
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=024081c8-2d25-47f6-b66c-158530ede4da"//好店提问群
        ],
        "达人专属": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=de9ad613-852d-49d5-af45-663b226bca93",//五组报时-专审群
        ],
        "宠物农资": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=58afbcdc-e96e-457b-ba16-15f378cfecbe",//宠物提问群
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=B_KEY"
        ],
        "电子数码": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=aacebbfc-40c7-4cc5-bd46-d4e9e990641a",//宠物提问群
        ],
        "先发后审": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
        "高风险曝光召回": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
        "低风险曝光召回": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
        "先发后审-复审": [
            "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1df9a180-69aa-4c83-a3c0-b17100ba9f75",//二组专审提问群
        ],
    };

    const queues = [
    {
    name: "珠宝",
    xpaths: {
        pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/div[1]/label[1]/span/div[2]',
        overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/div[1]/label[2]/span/div[2]',
        maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/section[2]/div[1]/span',
        manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[1]/ul/li[1]/span[2]'
    }
},
                {
            name: "酒",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[2]/ul/li[1]/span[2]'
            }
        },
                {
            name: "文玩",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[3]/ul/li[1]/span[2]'
            }
        },
                {
            name: "食品生鲜",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[4]/ul/li[1]/span[2]'
            }
        },
                {
            name: "保健品",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[5]/ul/li[1]/span[2]'
            }
        },
                {
            name: "图书潮玩",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[6]/ul/li[1]/span[2]'
            }
        },
                {
            name: "服饰钟表",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[7]/ul/li[1]/span[2]'
            }
        },
                {
            name: "成人用品",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[8]/ul/li[1]/span[2]'
            }
        },
                {
            name: "美妆个护",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[9]/ul/li[1]/span[2]'
            }
        },
                {
            name: "好店",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[10]/ul/li[1]/span[2]'
            }
        },
                {
            name: "家清家装日用",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[11]/ul/li[1]/span[2]'
            }
        },
                {
            name: "教育培训",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[12]/ul/li[1]/span[2]'
            }
        },
                {
            name: "本地生活2.0",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[13]/ul/li[1]/span[2]'
            }
        },
                {
            name: "高热召回",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[14]/ul/li[1]/span[2]'
            }
        },
                {
            name: "达人专属",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[15]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[15]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[15]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[15]/ul/li[1]/span[2]'
            }
        },
                {
            name: "宠物农资",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[16]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[16]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[16]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[16]/ul/li[1]/span[2]'
            }
        },
                {
            name: "电子数码",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[17]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[17]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[17]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[17]/ul/li[1]/span[2]'
            }
        },
                {
            name: "先发后审",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[18]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[18]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[18]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[18]/ul/li[1]/span[2]'
            }
        },
                {
            name: "高风险曝光召回",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[19]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[19]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[19]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[19]/ul/li[1]/span[2]'
            }
        },
                {
            name: "低风险曝光召回",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[20]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[20]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[20]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[20]/ul/li[1]/span[2]'
            }
        },
                {
            name: "先发后审-复审",
            xpaths: {
                pending: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[21]/div[1]/label[1]/span/div[2]',
                overtime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[21]/div[1]/label[2]/span/div[2]',
                maxOvertime: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[21]/section[2]/div[1]/span',
                manpower: '/html/body/div[2]/div[2]/div[1]/main/div/div/div/div[1]/section/section[21]/ul/li[1]/span[2]'
            }
        }
    ];

    function parseMaxOvertime(text) {
        if (!text) return 0;
        const parts = text.trim().split(':');
        if (parts.length === 3) {
            const [hh, mm, ss] = parts.map(n => parseInt(n) || 0);
            return hh * 60 + mm + (ss >= 30 ? 1 : 0);
        }
        const match = text.match(/(\d+)\s*分钟/);
        return match ? parseInt(match[1]) : 0;
    }

    function getXPathText(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue ? result.singleNodeValue.textContent.trim() : '';
    }

    function sendToWebhooks(content, webhooks) {
        const list = Array.isArray(webhooks) ? webhooks : [webhooks];
        list.forEach(url => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    msgtype: "markdown",
                    markdown: { content }
                }),
                onload: res => console.log(`[发送成功]`, url, res.responseText),
                onerror: err => console.error(`[发送失败]`, url, err)
            });
        });
    }

function checkAndSend() {
    console.log('====== 开始检测 ======');
    let detailLines = [];
    let overtimeCount = 0;
    let totalManpower = 0;

    // 💡 先统一解析每个队列的数据，避免多次解析
    const parsedQueues = queues.map(queue => {
        const pending = getXPathText(queue.xpaths.pending);
        const overtime = getXPathText(queue.xpaths.overtime);
        const maxOvertimeText = getXPathText(queue.xpaths.maxOvertime);
        const manpower = getXPathText(queue.xpaths.manpower);

        const pendingNum = parseInt(pending) || 0;
        const manpowerNum = parseInt(manpower) || 0;
        const maxOvertimeMins = parseMaxOvertime(maxOvertimeText);

        totalManpower += manpowerNum;

        return {
            ...queue,
            pending,
            overtime,
            maxOvertimeText,
            manpower,
            pendingNum,
            manpowerNum,
            maxOvertimeMins
        };
    });

    // 遍历队列数据，判断是否需要告警
    parsedQueues.forEach(q => {
        const shouldAlert = q.pendingNum > 100 || q.maxOvertimeMins >= 10;
        if (shouldAlert) {
            overtimeCount++;
            detailLines.push(`${q.name}：最长超时 ${q.maxOvertimeText}，待审量 ${q.pending}，在岗${q.manpower}`);

            const msg = `【${q.name}】\n最长超时：${q.maxOvertimeText}\n待审量：${q.pending}\n超时量：${q.overtime}\n在岗人力：${q.manpower}\n时间：${new Date().toLocaleString()}\n⚠ 超时提醒`;
            const webhooks = queueWebhookMap[q.name] || defaultWebhook;

            sendToWebhooks(msg, webhooks);
            sendToWebhooks(msg, summaryWebhook); // 发到总群每条
        }
    });

    // 汇总推送（无论是否有超时）
    if (overtimeCount > 0 || detailLines.length > 0) {
        const summary = `**队列监控总结（${new Date().toLocaleString()}）**\n\n在岗人数：${totalManpower}人\n超时/堆积队列：${overtimeCount} 个\n\n${detailLines.join('\n')}`;
        sendToWebhooks(summary, summaryWebhook);
        if (summaryWebhook2) {
            sendToWebhooks(summary, summaryWebhook2);
        }
    } else {
        console.log('无超时，无需汇总');
    }
}


    function waitForElement(xpath, callback, timeout = 15000) {
        let elapsed = 0;
        const interval = setInterval(() => {
            const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (el) {
                clearInterval(interval);
                callback();
                setInterval(callback, 5 * 60 * 1000);//5分钟检测一次
            } else {
                elapsed += 500;
                if (elapsed >= timeout) {
                    clearInterval(interval);
                    console.warn('元素加载超时');
                }
            }
        }, 500);
    }

    window.addEventListener('load', () => {
        waitForElement(queues[0].xpaths.maxOvertime, checkAndSend);
    });
})();
