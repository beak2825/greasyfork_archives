// ==UserScript==
// @name        linode.com汉化
// @namespace   Violentmonkey Scripts
// @match       https://*.linode.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/455588/linodecom%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/455588/linodecom%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([
         ['Products', '产品'],
         ['Solutions', '解决 方案'],
         ['Marketplace', '市场'],
         ['Community', '社区'],
         ['Sign Up', '注册'],
         ['Log In', '登录'],
         ['Careers', '职业'],
         ['Sales', '销售'],
      ['Volumes', '卷'],
['NodeBalancers', '节点平衡器'],
['Firewalls', '防火墙'],
['StackScripts', '堆栈脚本'],
['Images', '图像'],
['Domains', '域名'],
['Databases', '数据库'],
['Kubernetes', 'Kubernetes公司'],
['Object Storage', '对象存储'],
['Longview', 'Longview公司'],
['Marketplace', '市场'],
['Account', '账户'],
['Help Support', '帮助支持'],
         ['Updated', '更新于'],
      ['Personal', '个人'],
      ['Name', '名字'],
      ['Getting Started Guides', '入门指南'],
['Create a Compute Instance', '创建计算实例'],
['Getting Started with Linode Compute Instances', 'Linode计算实例入门'],
['Understanding Billing and Payment', '了解账单和付款'],
['Hosting a Website or Application on Linode', '在Linode上托管网站或应用程序'],
      ['Getting Started Playlist', '入门播放列表'],
['Linode Getting Started Guide', 'Linode入门指南'],
['Common Linux Commands', '常见的Linux命令'],
['Copying Files to a Compute Instance', '将文件复制到计算实例'],
['How to use SSH', '如何使用SSH'],
['View the complete playlist', '查看完整的播放列表'],
['Linodes', 'Linodes公司'],
['Cloud-based virtual machines', '基于云的虚拟机'],
['Host your websites, applications, or any other Cloud-based workloads on a scalable and reliable platform.', '在可扩展和可靠的平台上托管您的网站、应用程序或任何其他基于云的工作负载。'],
['Create Linode', '创建Linode'],
['Effective 1 July 2022, charges for Linode services may appear as', '从2022年7月1日起，Linode服务的费用在您的银行或信用卡上可能显示为'],
['API Reference', 'API参考'],
['Provide Feedback', '提供反馈'],
      ['Deploy an App', '部署一个应用程序'],
['Wordpress', '词库'],
['Cloudron', '云计算'],
['See all', '查看所有'],
      ['Attach additional storage to your Linode.', '在您的Linode上附加额外的存储。'],
['Learn more about Linode Block Storage 卷.', '了解更多关于 Linode Block Storage 卷。'],
['Create Volume', '创建卷'],
['Create NodeBalancer', '创建NodeBalancer'],
['Control network access to your Linodes', '控制对你的Linodes的网络访问'],
['from the Cloud.', '公司从云端。'],
['Get started with Cloud', '开始使用云计算'],
['Adding an image is easy. Click here to', '添加图片很容易。点击这里'],
['learn more about ', '了解更多关于 '],
['deploy an Image to a Linode.', '或部署一个镜像到Linode上。'],
['Create a Domain, add Domain records, import zones and domains.', '创建一个域名，添加域名记录，导入区域和域名。'],
['Get help managing your ', '获取帮助管理您的 '],
['visit our guides and tutorials.', '或访问我们的指南和教程。'],
['Fully managed cloud database clusters', '完全管理的云数据库集群'],
['Deploy popular database engines such as MySQL and PostgreSQL using Linode\'s performant, reliable, and fully managed database solution.', '使用Linode的高性能、可靠和全面管理的数据库解决方案，部署流行的数据库引擎，如MySQL和PostgreSQL。'],
      ['Automate Deployment with', '自动化部署'],
['Learn more about getting started', '了解更多关于开始的信息'],
['Learn how to use ', '了解如何使用 '],
['with your Linode', '与你的Linode'],
['Need help getting started?', '需要帮助吗？'],
['Learn more about getting started with LKE.', '了解更多关于开始使用LKE的信息。'],
['Plan Details', '计划细节'],
['Filter by client label or hostname', '按客户标签或主机名过滤'],
['Filter by client label or hostname', '按客户标签或主机名过滤'],
['Sort by:', '排序方式'],
['Sort by', '按以下方式排序'],
['Client', '客户端'],
['You have no Longview', '你没有配置Longview'],
['clients configured. Click here to add one.', '配置的客户。点击这里添加一个。'],
['Upgrade to Longview', '升级到Longview'],
['Pro for more clients, longer data retention, and more frequent data updates.', '专业版，以获得更多的客户，更长的数据保留时间，以及更频繁的数据更新。'],
['Select Image', '选择图像'],
['No Compatible 图像 Available', '没有可用的兼容图像'],
['Region', '地区'],
['You can use our speedtest page to find the best region for your current location.', '你可以使用我们的速度测试页面，找到适合你当前位置的最佳区域。'],
['Region', '地区'],
['Select a Region', '选择一个地区'],
['Linode Plan', '负载计划'],
['Dedicated CPU', '专属CPU'],
['Shared CPU', '共享的CPU'],
['High Memory', '高内存'],
['GPU', 'GPU'],
['Dedicated CPU instances are good for full-duty workloads where consistent performance is important.', '专门的CPU实例适用于对性能要求较高的全负荷工作。'],
['Linode Label', 'Linode标签'],
['Add Tags', '添加标签'],
['Type to choose or create a tag.', '键入选择或创建一个标签。'],
['Root Password', '根部密码'],
['Enter a password.', '输入一个密码。'],
['Strength: Weak', '强度。较弱'],
['SSH Keys', 'SSH密钥'],
['Attach a VLAN', '附加一个VLAN'],
['VLANs are currently available in Mumbai, IN; Toronto, ON; Sydney, AU; Atlanta, GA; London, UK; Singapore, SG; and Frankfurt, DE.', 'VLAN目前在印度孟买、安大略多伦多、澳大利亚悉尼、美国亚特兰大、英国伦敦、新加坡和德国法兰克福可用。'],
['VLANs are used to create a private L2 Virtual Local Area Network between ', 'VLANs是用来创建一个私有的L2虚拟局域网，该局域网在以下地区之间。'],
['A VLAN created or attached in this section will be assigned to the eth1 interface, with eth0 being used for connections to the public internet. VLAN configurations can be further edited in the', '在本节中创建或附加的VLAN将被分配到eth1接口，而eth0则用于与公共互联网的连接。VLAN配置可以在Linode的配置文件中进一步编辑。'],
['VLAN', 'VLAN'],
['Create or select a VLAN', '创建或选择一个VLAN'],
['IPAM Address (optional)', 'IPAM地址（可选）'],
['Add-ons', '附加组件'],
['Backups', '备份'],
['Three backup slots are executed and rotated automatically: a daily backup, a 2-7 day old backup, and an 8-14 day old backup. Plans are priced according to the Linode plan selected above.', '有三个备份槽被执行并自动轮换：每日备份、2-7天的备份和8-14天的备份。计划的价格是根据上面选择的Linode计划而定的。'],
['Private IP', '私人IP'],
['Summary', '摘要'],
      ['Create', '创建'],
['Distributions', '分布式'],
['Clone Linode', '克隆Linode'],
['Billing Info', '账单信息'],
['Users & Grants', '用户和赠款'],
['Service Transfers', '服务转移'],
['Maintenance', '维护'],
['Settings', '设置'],
['Balance', '余额'],
['You have no balance at this time.', '你现在没有余额。'],
['Promotions', '优惠活动'],
['remaining', '剩余'],
['Expires: ', '过期。'],
['Accrued Charges', '应计费用'],
['Since last invoice', '自上张发票起'],
['Billing Contact', '账单联系人'],
['Chatichai Charanachitta', '查蒂凯-查拉纳奇塔'],
['Srinagarindra Rd, Bang Muang', 'Srinagarindra Rd, Bang Muang'],
['Samut Prakan, Samut Prakan 10270', 'Samut Prakan, Samut Prakan 10270'],
['Thailand', '帐单联系人'],
['Payment Methods', '付款方式'],
['Expires', '过期'],
['DEFAULT', '默认情况下'],
['PayPal is now available for recurring payments. Add PayPal.', 'PayPal现在可用于经常性付款。添加PayPal。'],
['Billing & Payment History', '账单和付款历史'],
['active since', '活动以来'],
['Transaction Types', '交易类型'],
['All Transaction Types', '所有交易类型'],
['Transaction Dates', '交易日期'],
['Description', '说明'],
['Date', '日期'],
['Amount', '交易金额'],
['No data to display.', '没有数据显示。'],
['Make a Payment', '缴费'],
['This controls whether Linode ', '这可以控制Linode '],
['are enabled, by default, for all Linodes', '启用，默认情况下，所有Linode'],
['when they are initially created. For each Linode with', '在最初创建时是否启用。对于每个启用的 Linode'],
['enabled, your account will be billed the additional hourly rate noted on the ', '启用，您的账户将被收取额外的小时费率，在 '],
['pricing page.', '定价页上注明的额外小时费率。'],
['Don’t enroll new Linodes', '不要为新的Linode注册'],
['automatically', '自动'],
['Network Helper automatically deposits a static networking configuration into your Linode at boot.', '网络助手在启动时自动将静态网络配置存入你的 Linode。'],
['Enabled ', '已启用 '],
['default behavior', '默认行为'],
['Content storage and delivery for unstructured data. Great for multimedia, static sites, software delivery, archives, and data backups. To get started with', '非结构化数据的内容存储和交付。非常适用于多媒体、静态网站、软件交付、档案和数据备份。要开始使用'],
['create a Bucket or an Access Key. Learn more.', '创建一个桶或一个访问密钥。了解更多。'],
['Linode Managed includes', 'Linode管理包括'],
['cPanel, and round-the-clock monitoring to help keep your systems up and running. ', 'cPanel，以及24小时监测，以帮助保持您的系统正常运行。'],
['month per Linode. Learn more.', '每个Linode的月费。了解更多。'],
['Display', '显示'],
['API Tokens', 'API令牌'],
['OAuth Apps', 'OAuth应用程序'],
['Login&Authentication', '登录和认证'],
['Referrals', '推荐人'],
['My Settings', '我的设置'],
['LISH ConsoleSettings', 'LISH 控制台设置'],
['Log Out', '注销'],
      ['Notifications', '通知'],
['Email alerts for account activity are enabled', '启用账户活动的电子邮件提醒'],
['Dark Mode', '黑暗模式'],
['Dark mode is disabled', '黑暗模式被禁用'],
['Type-to-Confirm', '类型-确认'],
['For some products and services, the type-to-confirm setting requires entering the label before deletion.', '对于某些产品和服务，键入确认的设置要求在删除前输入标签。'],
['Type-to-confirm is enabled', '键入确认已启用'],
['Third Party Access Tokens', '第三方访问标记'],
['This controls what authentication methods are allowed to connect to the Lish console servers.', '这控制了允许什么样的认证方法来连接到Lish控制台服务器。'],
['Authentication Mode', '认证模式'],
['Allow both password and key authentication', '允许密码和密钥两种认证方式'],
['SSH Public Key', 'SSH公钥'],
['Place your SSH public keys here for use with Lish console access.', '在这里放置你的SSH公钥，用于Lish控制台的访问。'],
['Login Method', '登录方法'],
['You can use your Linode credentials or another provider such as Google or GitHub to log in to your Linode account. More information is available in', '你可以使用你的Linode凭证或其他供应商，如谷歌或GitHub，来登录你的Linode账户。更多信息请见'],
['How to Enable Third Party Authentication on Your Linode ', '如何在您的 Linode 上启用第三方认证 '],
[' We strongly recommend setting up Two-Factor Authentication', ' 我们强烈建议设置双因素认证'],
['Security', '安全性'],
['Password Reset', '密码重置'],
['If you’ve forgotten your password or would like to change it, we’ll send you an e-mail with instructions.', '如果您忘记了您的密码，或者想改变它，我们将向您发送一封带有说明的电子邮件。'],
['Reset Password', '重置密码'],
['Two-Factor Authentication', '双因素认证'],
['Two-factor authentication increases the security of your Linode account by requiring two different forms of authentication to log in: your Linode account password and an authorized security token generated by another platform.', '双因素认证通过要求两种不同形式的认证来登录，增加了您的Linode账户的安全性：您的Linode账户密码和由另一个平台生成的授权安全令牌。'],
['To use two-factor authentication you must set up your security questions listed below.', '要使用双因素认证，您必须设置下面列出的安全问题。'],
['Security Questions', '安全问题'],
      ['questions enable you to regain access to your Linode user account in certain situations,', '问题使您能够在某些情况下重新获得对Linode用户账户的访问。'],
['such as when 2FA is enabled and you no longer have access to the token or recovery codes', '例如，当2FA被启用，而您不再能够访问令牌或恢复代码时。'],
['Answers to security questions should not be easily guessed or discoverable through research.', '安全问题的答案不应该被轻易猜到或通过研究发现。'],

['Question 1', '问题1'],
['Select a question', '选择一个问题'],
['Answer 1', '回答1'],
['Question 2', '问题2'],
['Answer 2', '答案2'],
['Type your answer', '键入你的答案'],
['Question 3', '问题3'],
['Answer 3', '答案3'],
['Phone Verification', '电话验证'],
['A verified phone number provides our team with a secure method of verifying your identity as the owner of your Linode user account. This phone number is only ever used to send an SMS message with a verification code. Standard carrier messaging fees may apply. By clicking Send Verification Code you are opting in to receive SMS messages. You may opt out at any time.', '经过验证的电话号码为我们的团队提供了一种安全的方法来验证您作为Linode用户账户所有者的身份。这个电话号码只用于发送带有验证码的短信。标准的运营商短信费用可能适用。通过点击发送验证码，您将选择接收短信。您可以在任何时候选择退出。'],
['Learn more about security options.', '了解更多关于安全选项的信息。'],
['SMS Messaging', '短信发送'],
['You have opted in to SMS messaging.', '你已经选择了短信服务。'],
['An authentication code is sent via SMS as part of the phone verification process. ', '作为电话验证过程的一部分，将通过短信发送一个认证码。'],
['Messages are not sent for any other reason. SMS authentication is optional and provides an important degree of account security. ', '短信不会因任何其他原因而发送。短信认证是可选的，它提供了一个重要的账户安全程度。'],
['You may opt out at any time and your verified phone number will be deleted.', '你可以在任何时候选择退出，你的验证手机号码将被删除。'],
['Trusted Devices', '受信任的设备'],
['To add a trusted device, check the box \"Trust this device for 30 days\" at login.', '要添加一个受信任的设备，在登录时勾选 信任此设备30天。'],
['Update Username', '更新用户名'],
['Update Email', '更新电子邮件'],
['Update Timezone', '更新时区'],
['Timezone', '时区'],
['Profile photo', '个人照片'],
['upload, and manage your globally recognized avatar from a single place with Gravatar.', '通过Gravatar，您可以在一个地方上传并管理您的全球公认的头像。'],
['Add photo', '添加照片'],
['Login & Authentication', '登录和认证'],
['Opt Out', '选择退出'],
['Send Verification Code', '发送验证码'],
['Last IP', '最后的IP'],
['Last Used', '最后一次使用'],
['No items to display.', '没有要显示的项目。'],
['Help & Support', '帮助与支持'],
['View Scopes', '查看范围'],
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