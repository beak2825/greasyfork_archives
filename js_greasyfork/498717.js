// ==UserScript==
// @name        汉化duckyci.com
// @namespace   Violentmonkey Scripts
// @match       https://*.duckyci.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/498717/%E6%B1%89%E5%8C%96duckycicom.user.js
// @updateURL https://update.greasyfork.org/scripts/498717/%E6%B1%89%E5%8C%96duckycicom.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Free', '免费'],
['Donate', '捐赠'],
['Paid', '付费'],
['Capacity', '容量'],

['Telegram', '电报'],
['Contact', '联系我们'],
['Report Abuse', '举报滥用'],
['Account', '账户'],
['Login', '登录'],
['Register', '注册'],
['VPS comes with 共享 IPv4 and Dedicated IPv6', 'VPS 附带共享 IPv4 和专用 IPv6'],
['CREATE VPS', '创建 VPS'],
['Name', '名称'],
['Point', '点'],
['Detail', '详细内容'],
['On-demand', '按需'],
['Preemptible', '可抢占'],
['Price', '价格'],
 ['Refresh', '刷新'],
 ['Show', '显示'],
['Running', '运行'],
['Stopped', '停止运行'],
['Pending', '待处理'],
['Other', '其他'],
['System Load', '系统负载'],
['Cpu Usage', 'CPU 使用率'],

['Compute Status', '计算状态'],
['Issue', '问题'],
['Our Cloud Infrastructure in US - Sanjose ', '我们在美国 Sanjose 的云计算基础设施 '],
['US - Sanjose', '美国 - Sanjose'],
['experienced service outage', '出现服务中断'],
['users may not be able to use compute service in this', '用户可能无法使用该数据中心的计算服务。'],
['datacenter', '数据中心'],
['We apologize for any inconvenience and are working hard to fix it. ', '我们对造成的不便深表歉意，并正在努力修复。'],
['Please follow the channel for more notifications', '请关注该频道以获取更多通知'],
['You are using a Always 免费 账户', '您正在使用 Always 账户 免费'],
['To upgrade to a paid account, pay ', '要升级到付费帐户，请支付 0.5 美元或更多'],
['Recharge', '充值'],
['Amount ', '金额 '],
['The payment amount must be a multiple of ', '支付金额必须是 0.5 美元的倍数'],
['and the maximum amount is', '最高金额为 20 美元'],
['Method', '使用方法'],
['Always 免费 Resources', '始终免费 资源'],
['付费 Resources', '付费资源'],
['Limit', '限制'],
['Used', '已使用'],
['Remain', '剩余'],
['Note', '备注'],



['Database Cluster', '数据库集群'],
      ['instances are good for full-duty workloads where consistent performance is important.', '实例适合对性能要求较高的全负荷工作。'],








      ['with your bank or credit card.', '.'],

    ])

    replaceText(document.body)
//   |
//  ₘₙⁿ
// ▏n
// █▏　､⺍             所以，不要停下來啊（指加入词条
// █▏ ⺰ʷʷｨ
// █◣▄██◣
// ◥██████▋
// 　◥████ █▎
// 　　███▉ █▎
// 　◢████◣⌠ₘ℩
// 　　██◥█◣\≫
// 　　██　◥█◣
// 　　█▉　　█▊
// 　　█▊　　█▊
// 　　█▊　　█▋
// 　　 █▏　　█▙
// 　　 █ ​
    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();