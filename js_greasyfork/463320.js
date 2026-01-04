// ==UserScript==
// @name        eu.org汉化
// @namespace   Violentmonkey Scripts
// @match       https://nic.eu.org/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description 汉化界面的部分菜单及内容
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/463320/euorg%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463320/euorg%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==





(function() {
    'use strict';

    const i18n = new Map([

['Filter', '过滤器'],
['Domains', '域名'],
['Two-Factor Authentication', '双因素认证'],
['Information ', '信息 '],
['New Domain', '新域名'],
['Domain', '域名'],
['Created', '已创建'],
['Updated', '更新'],
['DNSSEC', '域名安全协议'],
['Flags', '标志'],
['Eligible', '合格的'],
['Password Change', '密码更改'],
['Current Password:', '当前密码：'],
['New Password:', '新密码：'],
['Confirm Password:', '确认密码：'],
['Contact handle: ', '联系处理： '],
['Contact Information', '联系信息'],
['Name', '联系人姓名'],
['E-mail', '电子邮件'],
['Country', '国家'],
['Phone', '电话'],
['Fax', '传真'],
['Private', '私有'],
['not shown in the public Whois', '不显示在公共Whois中'],
['Two-factor Authentication is set', '双因素认证已设置'],
['Enter code to deactivate', '输入代码以停用'],
['You currently have 10 recovery codes remaining. ', '您目前还有10个恢复代码。'],
['You can regenerate new codes, cancelling the current ones', '您可以重新生成新的代码，取消当前的代码'],
      ['New domain request', '新域名申请'],
['Requesting domain from EU.org implies that you accept the', '向EU.org申请域名，意味着你接受了'],
['domain policy', '域名政策'],
['Complete domain name', '完整的域名'],
['full domain name, including the enclosing domain. See the', '完整的域名，包括包围的域名。见'],
['Organization', '组织机构'],
['Administrative contact', '行政联系人'],
['The person in charge of administrative matters regarding the domain', '负责有关该域名的行政事务的人'],
['It is set to your handle', '它被设置为你的手柄'],
['You can change this later in the domain contact interface', '你可以在以后的域名联系人界面中改变这一点'],
['Technical contact', '技术联系人'],
['The person in charge of technical matters regarding the domain', '负责该域名技术事务的人'],
['An existing handle; see', '一个现有的手柄；见'],
['to create one', '来创建一个'],
['Check for correctness of', '检查以下内容是否正确'],
['server names', '服务器名称'],
['replies on SOA', '检查SOA授权机构起始记录'],
['replies on NS', '检查NS域名服务器记录'],
['recommended', '建议'],
['Fill', '填写 '],
['with the fully qualified domain names', '填上完全合格的域名'],
['If necessary', '如有必要'],
['with the IPv4 or IPv6 addresses', '用IPv4或IPv6地址填写IP1...IPX'],
['Address', '地址'],
['line 1', '第1行'],
['line 2', '第2行'],
['line 3', '第3行'],
['line 4', '第4行'],
['line 5', '第5行'],
['with the fully qualified domain names', '与完全合格的域名'],
['fill IP1...IPX with the IPv4 or IPv6 addresses', '用IPv4或IPv6地址填写IP1...IPX'],
['submit', '提交'],

['Generate new recovery codes', '生成新的恢复代码'],
['Deactivate', '停用'],
['Logout', '登出'],
['already exists', '已经存在'],
      ['Servers and domain names check', '服务器和域名检查'],
['Checking SOA records for', '检查SOA记录'],
['Checking NS records for', '检查NS记录为'],
['Error: Answer not authoritative', '错误：域名没有正确绑定到相应的 DNS 服务器上'],
['Getting IP for', '获取IP的'],
['SOA from', 'SOA来自'],
['NS from', 'NS来自'],
      ['No error', '没有错误'],
['storing for validation', '储存用于验证'],
['IGNORED', '忽视'],
['you already have a pending request', '你已经有一个待处理的请求'],
['for that domain.', '该域名的请求。'],
      ['Invalid domain name', '无效域名'],
      ['length too short', '长度太短'],
['Saved as request', '保存请求'],



['Information', '信息'],




         ['Updated', '更新于'],


      ['Forks', '复刻'],

    ])

    replaceText(document.body)
//   |

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