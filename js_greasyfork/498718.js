// ==UserScript==
// @name        汉化eu.org
// @namespace   Violentmonkey Scripts
// @match       https://nic.eu.org/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description 汉化界面的部分菜单及内容
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/498718/%E6%B1%89%E5%8C%96euorg.user.js
// @updateURL https://update.greasyfork.org/scripts/498718/%E6%B1%89%E5%8C%96euorg.meta.js
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
['domain', '域名'],
['address', '地址'],
['address', '地址'],
['changed', '已更改'],
['tech-c', '技术-c'],
['admin-c', '管理员-c'],
['Edit', '编辑'],
['Registrant', '注册人'],
['联系人姓名servers', '解析服务器'],
['History', '历史'],
['Contacts', '联系方式'],
['administrative', '行政'],
['technical', '技术'],
      ['Delete 域名', '删除域名'],
['free 域名 names since 1996', '自 1996 年起免费提供域名'],
['Sign-in or sign-up', '登录或注册'],
['Companies have voted with their feet ', '企业用脚投票 '],
['on the issue of 域名s', '在域名问题上'],
['they want to have 域名 names that are international or at least country neutral', '他们希望拥有国际性或至少是国家中立的域名'],
['The same freedom should apply to individuals', '个人也应享有同样的自由'],
['all individuals should be able to have and own their own 域名 names', '所有个人都应能够拥有自己的域名'],
['Paul Mockapetris', '保罗-莫卡佩特里斯'],
['creator of the DNS', '域名系统的创建者'],
[' in On the Internet, September/October 1996', ' 发表于 1996 年 9 月~10 月的《互联网上》'],
[' EU.org signed and invites you to sign the petition at', ' EU.org 签署了请愿书，并邀请您在以下网址签署请愿书'],
['against the sale of the .ORG registry to a private fund', '反对将 .ORG 注册表出售给私人基金'],
['The main goal of EU.org is to provide free sub域名 registration to users or non-profit organizations who cannot afford the fees demanded by some NICs', 'EU.org 的主要目标是为无力支付某些国家互联网注册中心所要求费用的用户或非营利组织提供免费的子域名注册服务。'],
['Any kind of', '欢迎任何形式的'],
['is welcome. EU.org would have been unthinkable without', '都是受欢迎的。如果没有以下各种支持，EU.org 将是不可想象的'],
['a lot of support of many kinds', '各种支持'],
['You can see', '您可以看到'],
['The following country sub域名s are not handled here', '这里不处理以下国家子域名'],
['requests will be rejected', '请求将被拒绝'],
['please go to the indicated servers for the procedure to request a sub域名', '请到指定服务器查看申请子域名的程序'],
['Registration', '注册'],
['The list of ', '名单 '],
['Internet-access providers', '互联网接入服务提供商'],
['who accept to host EU.org 域名s for their users', '接受为其用户托管 EU.org 域名的互联网接入服务提供商列表'],
['Technical information ', '技术信息 '],
['on the DNS', '关于 DNS 的技术信息'],
['No support is provided, but a users mailing list is available. To subscribe, send', '不提供支持，但有用户邮件列表。要订阅，请发送'],
['subscribe freedns-users', '订阅 freedns-users'],
['This site has no relation with the European Union, despite its name.', '本网站虽然名为 "欧盟"，但与欧盟没有任何关系。'],
['If you are looking for Web servers with E.U.-related pages, please have a look at', '如果您正在寻找与欧盟相关的网页服务器，请访问'],
['The server is a ', '服务器是一台 '],
['Unix PC running ', '运行 '],
['a free Web server', '免费网络服务器'],

['for EU.org and its sub域名s;', 'EU.org 及其子域名的一般政策；'],
['域名s open for registration', '域名开放注册名单'],
['EU.org signed and invites you to sign the petition at', 'EU.org签署并邀请您在以下网址签署请愿书'],
['Version française', '法语版本'],
['Polska wersja', '波兰语'],


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