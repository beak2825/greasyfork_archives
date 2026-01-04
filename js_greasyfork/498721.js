// ==UserScript==
// @name        汉化optiklink.com
// @namespace   Violentmonkey Scripts
// @match       https://*.optiklink.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/498721/%E6%B1%89%E5%8C%96optiklinkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/498721/%E6%B1%89%E5%8C%96optiklinkcom.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Free', '免费'],
['Dashboard', '仪表板'],
['Web hosting', '虚拟主机'],
['Create Server', '创建服务器'],
['My Plan', '我的计划'],
['Login to Panel', '登录面板'],
['Customize Resources', '自定义资源'],
['Earn Resources', '赚取资源'],
['Earn Coins', '赚取金币'],
['Service Status', '服务状态'],
['Pricing', '定价'],
['Logout', '注销'],
['Discord', '论坛'],
['Need any help?', '需要任何帮助？'],
['Create a support ticket on our Discord.', '在我们的 Discord 上创建支持票据。'],
['DASHBOARD', '仪表板'],
['RUNNING SERVERS', '运行中的服务器'],
['2021 servers', '2021 服务器'],
['Created in last 30 minutes', '最近 30 分钟内创建'],
['REGISTERED USERS', '注册用户'],
['users', '用户'],
['Logged in last 24 hours', '过去 24 小时登录'],
['CURRENTLY OLINE NOW', '现在在线'],
['Logged in last 30 minutes', '最近 30 分钟登录'],
['BANNED USERS', '被禁用的用户'],
['Banned in last 24 hours', '过去 24 小时内被禁用'],
['Servers', '服务器'],
['Earn Coins. Click here to start earning.', '赚取金币 单击此处开始赚钱。'],
['Welcome', '欢迎'],
['to your Dashboard', '到您的控制面板'],
['If you don\'t have any server', '如果您没有任何服务器'],
['feel free to create it yourself', '请自行创建'],
['You server limit is', '您的服务器上限为'],
['REMINDER: In order to keep your servers running', '提醒：为了保证您服务器的运行'],
['and to keep you updated we need you to be a member of our Discord', '并保持更新，我们需要您成为我们 Discord 的成员。'],
['If you leave our Discord server, all your servers will be deleted.', '如果您离开我们的 Discord 服务器，您的所有服务器都将被删除。'],
['SERVICE EXPIRE', '服务终止'],
['Your servers will be deleted on date', '您的服务器将在以下日期被删除'],
['Please login to our dashboard once every 7 days and your servers won\'t be deleted and this expire date will be extended.', '请每 7 天登录一次我们的控制面板，这样您的服务器就不会被删除，过期日期也会延长。'],
['INACTIVITY SYSTEM', '不活动系统'],
['If you didn\'t login to dashboard for more than 3 days', '如果您超过 3 天未登录控制面板'],
['system will shutdown your server.', '系统将关闭您的服务器。'],
['Quick Links', '快速链接'],
['Create Server', '创建服务器'],
['Login to Panel', '登录面板'],
['Change Panel Password', '更改面板密码'],
['Customize Resources', '自定义资源'],
['Coins Store', '金币商店'],
['Sincerely provided by', '诚挚提供'],
['User Agreement', '用户协议'],
['Android WebApp', '安卓网络应用程序'],
['Light', '浅色'],
['Dark', '深色'],
['NAME', '名称'],
['SERVER ID', '服务器 ID'],
['RAM', '内存'],
['DISK SPACE', '磁盘空间'],
['CPU CORES', 'CPU 性能'],
['CPU USAGE', 'CPU 使用量'],
['PLAYERS', '播放器'],
['SERVER STATUS', '服务器状态'],
['ACTIONS', '行动'],
['REMINDER', '提醒'],
['In order to keep your servers running', '为了保证您的服务器运行'],
['and to keep you updated we need you to be a member of our 论坛', '并保持更新，我们需要您成为我们论坛的会员。'],
['If you leave our 论坛 server', '如果您离开我们的论坛服务器'],
['all your servers will be deleted', '您的所有服务器将被删除'],
['欢迎 to your Web Hosting Management', '欢迎来到您的虚拟主机管理'],
['If you don\'t have any site', '如果您没有任何网站'],
['请自行创建. You site limit is', '请自行创建。您的网站限制为'],
['Your website will be deleted on date', '您的网站将于 日被删除。'],
['Please login to our website once every 7 days and your website won\'t be deleted and this expire date will be extended', '请每 7 天登录一次我们的网站，这样您的网站就不会被删除，过期日期也会延长。'],
['Create Site', '创建网站'],
['You don\'t have any web hosting created yet', '您尚未创建任何虚拟主机'],
['You are currently on', '您正在浏览'],
['免费 Plan', '免费计划'],
['Your plan gives you', '您的计划为您提供'],
['Your plan will expire on', '您的计划将于'],
['Never', '从未'],
['You have additional', '您有额外的'],
['Your Panel Username', '您的面板用户名'],
['Your Panel Password', '您的面板密码'],
['Click here to view', '单击此处查看'],
['SFTP Password is same as your panel password', 'SFTP 密码与您的面板密码相同'],
['NOTICE', '注意事项'],
['You can change your password by clicking on your 论坛 Username in right corner', '您可以点击右上角的论坛用户名更改密码。'],
['to server customization', '到服务器自定义'],
['On all your servers you can change Slots', '您可以在所有服务器上更改插槽'],
['CPU Cores', 'CPU 内核'],
['Disk Space and 内存', '磁盘空间和内存'],
['Its fast and easy', '简单快捷'],
['Please select on resources that you want to change', '请选择要更改的资源'],
['Just a simple click on button and it will redirect you to customization', '只需点击按钮，它就会跳转到自定义页面'],
['Change CPU Cores', ' 更改 CPU 核心'],
['Change Disk Space', ' 更改磁盘空间'],
['Change 内存', ' 更改内存'],
['Change Max Players', ' 更改最大播放器'],
['Total servers created so far', '迄今创建的服务器总数'],
['107392 servers', '107392 个服务器'],
['Your used 内存 balance is', '您已使用的内存余额为'],
['Your used Disk balance is', '您已使用的磁盘余额为'],
['Number of servers you can create', '您可以创建的服务器数量'],
['Server Name:', '服务器名称：'],
['Server 内存', '服务器 内存'],
['Server Disk Space', '服务器磁盘空间'],
['Location', '服务器位置'],
['Please select', '请选择'],
['Game', '游戏'],
['Select Game', '选择游戏'],
['Server Type', '服务器类型'],
['Select Server Type', '选择服务器类型'],
['Error\!', '错误'],
['Oops\! ', '哎呀!'],
['You tried to create server in Japan location but there isn\'t space for it', '您试图在日本位置创建服务器，但空间不足'],
['请选择 other server location or try again later', '请选择其他服务器位置或稍后再试'],
['Minecratt', 'OopsaMinecratt'],
['Voice Hosting', '语音托管'],
['Grand Theft Auto', '侠盗猎车手'],
['Call of Duty', '使命召唤'],
['Bot Hostingames', '所有其他游戏'],
['Radio Hosting', '电台托管'],
['Bungeecora Proxy', '邦吉科拉代理'],
['Forge Minecraft', '锻造威廉与'],
['Paper', '纸'],
['Sponge(SpongeVanilla)', '海绵(SpongeVanilla)'],
['Vanilla Minecraft', '香草威廉与'],
['Purpur(recommended)', 'Purpur(recommended)'],
['Bedrock:PocketmineMP', '基岩：口袋妖怪MP'],
['Bedrock:Vanilla', '基岩：香草'],
['Bedrock:Nukkit', '基岩：Nukkit'],
['Bedrock:GoMint', '基岩：GoMint'],
['Success', '成功'],
['You have successfully created server with following', '您已成功创建服务器，内容如下'],
['Please navigate to \"登录面板\" tab for your game panel details', '请导航至 "登录面板 "选项卡查看您的游戏面板详情'],
['Information only for FREE 用户', '信息仅供免费用户使用'],
['premium 用户 can ignore this message', 'premium 用户可以忽略此信息'],
['You must login once every 3 days to our website', '您必须每 3 天登录一次我们的网站'],
['to keep your servers online, otherwise in 7 days our system will delete your servers', '以保持您的服务器在线，否则 7 天后我们的系统将删除您的服务器'],
['Console', '控制台'],
['Players', '玩家'],
['Files', '文件'],
['Plugins', '插件'],
['MySQL', 'MySQL'],
['Users', '用户'],
['Network', '网络'],
['Startup', '启动'],
['Logs', '日志'],
['Staff Requests', '员工请求'],
['Settings', '设置'],
['Update Password', '更新密码'],
['CURRENT PASSWORD', '当前密码'],
['NEW PASSWORD', '新密码'],
['Your new password should be at least 8 characters in length and unique to this website', '您的新密码长度应至少为 8 个字符，并且是本网站唯一的密码'],
['CONFIRM NEW PASSWORD', '确认新密码'],
['Password confirmation does not match the password you entered', '确认密码与您输入的密码不匹配'],
['UPDATE PASSWORD', '更新密码'],
['Configure Two Factor', '配置双因素'],
['You do not currently have two-factor authentication enabled on your account', '您的账户目前尚未启用双因素身份验证'],
['Click the button below to begin configuring it', '单击下面的按钮开始配置'],
['ENABLE', '启用'],
['SEARCH TERM', '搜索词'],
['Enter a server name, uuid, or allocation to begin searching', '输入服务器名称、uuid 或分配以开始搜索'],
['API Credentials', 'API 证书'],
['Create API Key', '创建 API 密钥'],
['DESCRIPTION', '描述'],
['A description of this API key', '此 API 密钥的说明'],
['ALLOWED IPS', '允许的 IPS'],
['Leave blank to allow any IP address to use this API key', '留空表示允许任何 IP 地址使用此 API 密钥'],
['otherwise provide each IP address on a new line', '否则在新行中提供每个 IP 地址'],
['CREATE', '创建'],
['API Keys', 'API 密钥'],
['No API keys exist for this account', '此账户不存在任何 API 密钥'],
['SERVER INFORMATION', '服务器信息'],
['Nothing to show', '无显示'],
['MEMORY USAGE', '内存使用情况'],
['CPU USAGE', 'CPU 使用情况'],
['Type a command', '键入命令'],
['SFTP DETAILS', 'SFTP 详情'],
['SERVER ADDRESS', '服务器地址'],
['USERNAME', '用户名'],
['Your SFTP password is the same as the password you use to access this panel', '您的 SFTP 密码与访问此面板的密码相同'],
['If you forgot your password, you can reset it from', '如果忘记密码，可以从'],
['dashboard', '仪表盘'],
['Please use ', '请使用 '],
['program to connect to SFTP server.', '程序连接到 SFTP 服务器。'],
['LAUNCH SFTP', '启动 SFTP'],
['DEBUG INFORMATION', '调试信息'],
['Node', '节点'],
['Server ID', '服务器 ID'],
['CHANGE SERVER NAME', '更改服务器名称'],
['SERVER NAME', '服务器名称'],
['SAVE', '保存'],
['REINSTALL SERVER', '重装服务器'],
['Reinstalling your server will stop it', '重新安装服务器将停止'],
['and then re-run the installation script that initially set it up', '然后重新运行最初设置它的安装脚本'],
['All your files may be deleted or modified during this process', '在此过程中，您的所有文件可能会被删除或修改'],
['your server files before continuing', '请备份您的服务器'],




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