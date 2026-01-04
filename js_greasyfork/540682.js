// ==UserScript==
// @name        汉化tailscale.com
// @namespace   Violentmonkey Scripts
// @match       https://*.tailscale.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/540682/%E6%B1%89%E5%8C%96tailscalecom.user.js
// @updateURL https://update.greasyfork.org/scripts/540682/%E6%B1%89%E5%8C%96tailscalecom.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Dashboard', '仪表板'],
['Machines', '机器'],
['Apps', '应用程序'],
['Services', '服务'],
['Users', '用户'],
['Access controls', '访问控制'],
['Logs', '日志'],
['DNS', 'DNS'],
['Settings', '设置'],
['Resource hub', '资源中心'],
['Download', '下载'],
['Support', '支持'],
['Docs', '文档'],
['Manage the devices connected to your tailnet', '管理连接到您 tailnet 的设备'],
['Add device', '添加设备'],
['Search by name', '按名称搜索'],
['owner', '所有者'],
['Filters', '过滤器'],
['machine', '机器'],
['Machine', '机器'],
['Addresses', '地址'],
['Version', '版本'],
['Last Seen', '最后查看'],
['Connected', '已连接'],
['Tailscale works best when it\’s installed on multiple devices', 'Tailscale 安装在多个设备上时效果最佳'],
['Explore what you can do with Tailscale in these environments', '探索在这些环境中使用 Tailscale 的功能'],
['Operating systems', '操作系统'],
['See more', '查看更多'],
['Cloud providers', '云提供商'],
['Containers', '容器'],
['添加设备s to your network', '添加设备到您的网络'],
['Linux server', 'Linux 服务器'],
['Use this for services running on VMs, containers, and functions', '用于在虚拟机、容器和功能上运行的服务'],
['Client device', '客户端设备'],
['Use this for user-owned client devices like macOS, Windows, Linux, iOS, and Android', '用于用户拥有的客户端设备，如 macOS、Windows、Linux、iOS 和 Android'],
['To add a new device to your tailnet, simply install Tailscale on that device and log in as ', '要将新设备添加到您的 tailnet，只需在该设备上安装 Tailscale，然后登录'],
['Send', '发送'],
['We\’ll only use it to send you the install link and nothing else', '我们只会用它向您发送安装链接，而不会发送其他任何信息'],
['Requires Windows 10 or later', '要求使用 Windows 10 或更高版本'],
['下载 and run the Windows installer', '下载并运行 Windows 安装程序'],
['Select Log in from the Tailscale icon now in your system tray and authenticate in your browser', '从系统托盘中的 Tailscale 图标选择登录，然后在浏览器中进行身份验证'],
['Sign in with your identity provider', '使用身份提供商登录'],
['Tailscale can be installed on a Linux 机器 with the single provided command', '只需使用提供的一条命令，即可在 Linux 机器上安装 Tailscale'],
['Copy link', '复制链接'],
['Email link', '电子邮件链接'],
['Read guide', '阅读指南'],
['Select Log in from the Tailscale icon now in your system tray and authenticate in your browser', '现在从系统托盘中的 Tailscale 图标选择登录，并在浏览器中进行验证'],
['Requires macOS Catalina 10.15 or later', '要求 macOS Catalina 10.15 或更高版本'],
['Requires iOS 15 or later', '要求 iOS 15 或更高版本'],
['Requires Android 6 or later', '要求 Android 6 或更高版本'],
['Requires DiskStation Manager 6 or later', '要求 DiskStation Manager 6 或更高版本'],
['下载 and install the Tailscale client using one of the following options', '下载并使用以下选项之一安装 Tailscale 客户端'],
['Standalone variant from the Tailscale package server', '从 Tailscale 软件包服务器下载的独立版本'],
['Mac App Store ', 'Mac App Store'],
['variant. The Tailscale client is free to download,', '版本。Tailscale 客户端可免费下载，'],
['but downloading any app from the Mac App Store may require an Apple ID with a valid credit card attached', '，但从 Mac App Store 下载任何应用程序可能需要一个附有有效信用卡的 Apple ID'],
['Follow the Tailscale onboarding flow, which will guide you to install the Tailscale VPN configuration', '，请按照 Tailscale 上机流程操作、 该流程将引导您安装 Tailscale VPN 配置'],
['Accept the prompts to install a VPN configuration and allow push notifications', '接受提示安装 VPN 配置并允许推送通知'],
['Sign in with your identity provier', '使用您的身份提供商登录'],
['Download and install the Tailscale app from the Play Store', '从 Play Store 下载并安装 Tailscale 应用程序'],
['Accept the prompts to install a VPN configuration', '接受提示安装 VPN 配置'],
['Sign in with your identity provider', '使用您的身份提供商登录'],
['Input the code on your screen', '输入屏幕上的代码'],
['There are 2 ways to install Tailscale on Synology devices', '在 Synology 设备上安装 Tailscale 有 2 种方法'],
['Install Tailscale on DSM manually', '在 DSM 上手动安装 Tailscale'],
['Install using Synology Package Center', '使用 Synology 软件包中心安装'],
['Input code', '输入代码'],
['下载 and install the Tailscale app from the Play Store', '下载并从 Play Store 安装 Tailscale 应用程序'],
['from the Tailscale package server', '从 Tailscale 软件包服务器'],
['Tailscale 客户端可免费下载， but downloading any app from the Mac App Storemay require an Apple ID with a valid credit card attached', 'Tailscale 客户端可免费下载，但从 Mac App Store 下载任何应用程序都需要一个附有有效信用卡的 Apple ID'],
['Select', '从系统托盘中的 Tailscale 图标选择'],
['from the Tailscale icon now in your system tray and authenticate in your browser', '并在浏览器中进行身份验证'],
['Edit 机器 name…', '编辑 机器名称...'],
['Edit 机器 IPv4…', '编辑 机器 IPv4...'],
['Share…', '共享...'],
['Disable key expiry', '禁用密钥过期'],
['View recent activity', '查看最近活动'],
['Edit route settings…', '编辑路由设置...'],
['Edit ACL tags…', '编辑 ACL 标记...'],
['Remove…', '删除...'],
['This 机器 will permanently be removed from your network', '机器将从您的网络中永久删除'],
['To re-add it, you will need to re-authenticate to your tailnet from the device', '要重新添加，您需要从设备重新验证到您的尾网'],
['Hold Alt while clicking \“Remove\” to skip this confirmation', '点击删除时按住 Alt 键跳过确认'],
['Cancel', '取消'],
['Remove 机器', '移除 机器'],
['Hold Alt while clicking ', '点击时按住 Alt 键'],
['Remove', '删除'],
['to skip this confirmation', '跳过此确认'],
['Property', '属性'],
['Last seen', '最后查看'],
['Managed by', '管理者'],
['Shared', '共享'],
['Disabled', '禁用'],
['Auto-update', '自动更新'],
['Ephemeral node', '短暂节点'],
['Exit node', '退出节点'],
['Subnet', '子网'],
['Funnel', '漏斗'],
['Expiry disabled', '过期失效'],
['Connector', '连接器'],
['Expired', '过期'],
['Needs approval', '需要批准'],
['User suspended', '用户被暂停'],
['User needs approval', '用户需要批准'],
['Route traffic to third-party SaaS apps through connectors on your tailnet', '通过您 tailnet 上的连接器将流量路由至第三方 SaaS 应用程序'],
['Add app', '添加应用程序'],
['Add an app', '添加应用程序'],
['应用程序 let you control access to your third-party SaaS applications', '应用程序可让您控制对第三方 SaaS 应用程序的访问'],
['without requiring any end user configuration', '无需任何最终用户配置'],
['Learn more', '了解更多'],
['Monitor live services running on your network\’s 机器s', '监控在您网络的机器上运行的实时服务'],
[' Your network currently does not collect services information from 机器s', ' 您的网络目前不收集来自机器的服务信息'],
['Search services...', '搜索服务...'],
['Enable services to start', '启用服务启动'],
['Enabling services collection allows Tailscale to monitor services on your network', '启用服务收集可让 Tailscale 监控网络上的服务'],
['and list them here in the admin panel', '并在管理面板中列出这些服务。'],
['Enable services collection', '启用服务收集'],
['Your network currently ', '您的网络目前'],
['does not collect ', '不收集'],
['services information from 机器s', '机器的服务信息'],
['Manage the users in your network and their permissions', '管理网络中的用户及其权限'],
['Invite users', '邀请用户'],
['Invite external users', '邀请外部用户'],
['Approval is required', '需要批准'],
['Invited users can only join after being approved by an admin', '被邀请的用户只有在管理员批准后才能加入'],
['Edit in 设置', '去设置'],
['Invite external users', '邀请外部用户'],
['Status', '状态'],
['ldle', 'ldle'],
['Suspended', 'Suspended'],
['Needs ApprovalInvited', 'Needs ApprovalInvited'],
['You can invite users by generating an invite link to share with them', '您可以通过生成邀请链接来邀请用户，与他们共享'],
['You can invite users by generating an invite link to share with them', '您可以通过生成与用户共享的邀请链接来邀请用户'],
['View devices', '查看设备'],
['View access control rules', '查看访问控制规则'],
['Edit role…', '编辑角色...'],
['Edit group membership…', '编辑组成员...'],
['Define a policy for which devices and users are allowed to connect in your network', '定义允许哪些设备和用户在您的网络中连接的策略'],
['Configuration logs', '配置日志'],
['Inspect logs of changes made to your tailnet\’s configuration settings during the last 90 days', '检查过去 90 天内对您的tailnet配置设置所做更改的日志'],
['Looking for network traffic logs', '查找网络流量日志'],
['Tailnets on the Premium plan and above can enable network flow logging to record traffic activity metadata between devices. Traffic contents are end-to-end encrypted and never visible', '高级计划及以上版本的tailnet可以启用网络流量日志，记录设备之间的流量活动元数据。流量内容经过端到端加密，永远不可见'],
['Not streaming', '非流'],
['Timestamp', '时间戳'],
['Local Time', '本地时间'],
['Action', '操作'],
['Actor', '行为者'],
['Target', '目标'],
['Delete node', '删除节点'],
['Update key expiry time for node', '更新节点的密钥过期时间'],
['Log in node', '登录节点'],
['Create node', '创建节点'],
['Create user', '创建用户'],
['Create tailnet', '创建tailnet'],
['Log in to admin console', '登录管理控制台'],
['Manage DNS and nameservers of your network', '管理网络的 DNS 和名称服务器'],
['Tailnet name', 'tailnet名称'],
['This unique name is used when registering DNS entries, sharing your device to other tailnets, and issuing TLS certificates', '在注册 DNS 条目、将设备共享给其他tailnet以及签发 TLS 证书时使用此唯一名称'],
['Rename tailnet...', '重命名tailnet...'],
['Control device and user access to your third-party applications, without requiring any end user configuration', '控制设备和用户对第三方应用程序的访问，无需任何最终用户配置'],
['Manage in 应用程序', '在应用程序中管理'],
['Nameservers', '名称服务器'],
['Set the nameservers used by devices on your network to resolve DNS queries', '设置网络上的设备用于解析 DNS 查询的名称服务器'],
['Global nameservers', '全局名称服务器'],
['Add nameserver', '添加名称服务器'],
['Search Domains', '搜索域'],
['Set custom DNS search domains. With MagicDNS enabled, your tailnet domain is always the first search domain', '设置自定义 DNS 搜索域。启用 MagicDNS 后，您的tailnet域总是第一个搜索域'],
['Add search domain...', '添加搜索域...'],
['MagicDNS', 'MagicDNS'],
['Automatically register domain names for devices in your tailnet', '自动为您tailnet中的设备注册域名'],
['This lets you to use a 机器\’s name instead of its IP address', '这可以让您使用机器的名称而不是其 IP 地址'],
['Disable MagicDNS…', '禁用 MagicDNS...'],
['HTTPS Certificates', 'HTTPS 证书'],
['Allow users to provision HTTPS certificates for their devices', '允许用户为其设备提供 HTTPS 证书'],
['Enable HTTPS...', '启用 HTTPS...'],
['Explore what you can do with Tailscale', '探索你能用 Tailscale 做什么'],
['I want to...', '我想...'],
['发送 files to different devices', '将文件发送到不同的设备'],
['Access my home network', '访问我的家庭网络'],
['Host my own cloud storage', '托管我自己的云存储'],
['Install Tailscale on my Apple TV', '在我的 Apple TV 上安装 Tailscale'],
['Other', '其他'],
['Taildrop allows you to share files seamlessly with any of your devices', 'Taildrop 可让您与您的任何设备无缝共享文件'],
['Taildrop', 'Taildrop'],
['Taildrop lets you send files between your personal devices on a Tailscale network', 'Taildrop 可让您在 Tailscale 网络上的个人设备之间发送文件'],
['known as a tailnet', '称为 tailnet'],
['Was this helpful', '这对你有帮助吗'],
['I\’m not interested in this use case', '我对这个用例不感兴趣'],
['General', '常规'],
['User management', '用户管理'],
['Device management', '设备管理'],
['Policy file management', '策略文件管理'],
['OAuth clients', 'OAuth 客户端'],
['Webhooks', 'Webhooks'],
['Contact preferences', '联系人首选项'],
['Billing', '账单'],
['Personal 设置', '个人设置'],
['Keys', '密钥'],
['General', '常规'],
['Manage your tailnet account settings.', '管理您的 tailnet 帐户设置。'],
['Organization', '组织'],
['This is your organization\’s name. It cannot be changed', '这是您的组织名称。不能更改'],
['Manage in DNS', '在 DNS 中管理'],
['Feature previews', '功能预览'],
['Get early access to features. Feature previews are available for testing, but still in development. ', '获取早期访问功能。功能预览可用于测试，但仍在开发中。'],
['Mullvad VPN', 'Mullvad VPN'],
['Allow users on your network to use Mullvad VPN endpoints as exit-nodes', '允许网络上的用户使用 Mullvad VPN 端点作为出口节点'],
['发送 Files', '发送文件'],
['Allow users on your network to send files between their own devices using Taildrop, Tailscale’s built-in file sharing feature', '允许网络上的用户使用 Taildrop 在自己的设备之间发送文件、 Tailscale 内置的文件共享功能'],
['服务 Collection', '服务收集'],
['Collect and display information about services running on your network in the admin panel', '在管理面板中收集和显示网络上运行的服务信息'],
['Allow users on your network to route traffic from the wider internet to their Tailscale nodes', '允许网络上的用户将来自更广泛互联网的流量路由到他们的 Tailscale 节点'],
['Manage in Access Controls', '在访问控制中管理'],
['Tailnet lock', 'tailnet锁'],
['Verify node keys distributed by the coordination server before trusting them', '在信任协调服务器分发的节点密钥之前，先验证它们'],
['Manage in Device management', '在设备管理中管理'],
['Delete tailnet', '删除tailnet'],
['Permanently delete this tailnet. This action cannot be undone', '永久删除此tailnet。此操作无法撤销'],
['User management', '用户管理'],
['Manage your tailnet user settings', '管理您的 tailnet 用户设置'],
['Identity Provider', '身份提供商'],
['How users log in to your tailnet. Contact support to change this.', '用户如何登录您的 tailnet。请联系支持人员进行更改。'],
['Microsoft', 'Microsoft'],
['User & Group Provisioning', '用户和组供应'],
['Sync users and groups from your identity provider', '从您的身份供应商同步用户和组'],
['Enable provisioning…', '启用供应...'],
['User Approval', '用户批准'],
['Require new users to be approved by admins before they can access the network', '要求新用户在访问网络之前获得管理员批准'],
['Manually approve new users', '手动批准新用户'],
['Admin Console Session Timeout', '管理控制台会话超时'],
['Set the maximum allowed period of inactivity before members of your tailnet are automatically logged out of the Tailscale admin console.', '设置在您的尾网成员自动注销 Tailscale 管理控制台之前允许的最长不活动时间。'],
['This setting is enforced for all members of your tailnet when enabled', '启用此设置后，尾网的所有成员都将执行此设置'],
['Device management', '设备管理'],
['Manage your tailnet device settings', '管理您的 tailnet 设备设置'],
['Device Approval', '设备批准'],
['Require new devices to be approved by admins before they can access the network', '要求新设备在访问网络前获得管理员批准'],
['Manually approve new devices', '手动批准新设备'],
['Manually verify every new device added to your network without trusting Tailscale\’s coordination server', '手动验证添加到您网络的每个新设备，而无需信任 Tailscale 的协调服务器'],
['Key Expiry', '密钥过期'],
['Set the number of days a device can stay logged in to Tailscale before it needs to re-authenticate with Microsoft', '设置设备在登录到 Tailscale 后需要重新验证 Microsoft 的天数'],
['Default new devices on your network to automatically update to the latest Tailscale version. Existing devices are unaffected, but can opt-in from their settings or via MDM', '默认网络上的新设备自动更新到最新的 Tailscale 版本。现有设备不受影响，但可从其设置或通过 MDM 选择加入'],
['OAuth clients', 'OAuth 客户端'],
['Use OAuth 客户端 to provide ongoing fine-grained access to the Tailscale API', '使用 OAuth 客户端持续提供对 Tailscale API 的细粒度访问'],
['OAuth Clients', 'OAuth 客户端'],
['Manage and revoke OAuth 客户端', '管理和撤销 OAuth 客户端'],
['You don\’t have any OAuth 客户端 yet', '您还没有任何 OAuth 客户端'],
['Generate OAuth client…', '生成 OAuth 客户端...'],
['Webhooks', 'Webhooks'],
['Get notified of changes and misconfigurations in your tailnet', '获取您的 tailnet 中的更改和错误配置通知'],
['Endpoints', '端点'],
['View and manage endpoints', '查看和管理端点'],
['You don\’t have any endpoints yet', '您还没有任何端点'],
['Add endpoint...', '添加端点。..'],
['Contact preferences', '联系首选项'],
['Define points of contact for different kinds of transactional emails', '为不同类型的事务性电子邮件定义联系点'],
[' We will only use these to send essential communications related to the functioning of your tailnet, not marketing-related content', ' 我们将仅用于发送与您的 tailnet 运行相关的重要通信，而非营销相关内容'],
['As such, you can\’t opt out, and all emails must be verified', '因此，您无法选择退出，而且所有电子邮件都必须经过验证'],
['Account changes', '帐户更改'],
['Receive communications about important changes to your tailnet', '接收有关您的 tailnet 重要更改的通信'],
['Configuration issues', '配置问题'],
['Receive communications about misconfigurations in your tailnet', '接收有关您的 tailnet 配置错误的通信'],
['Security issues', '安全问题'],
['Receive communications about security issues affecting your tailnet', '接收有关影响您的 tailnet 的安全问题的通信'],
['账单 email', '账单电子邮件'],
['Receive communications about billing matters', '接收有关计费事项的通信'],
['Billing', '账单'],
['Your plan', '您的计划'],
['View and manage your Auth keys and API access tokens', '查看和管理您的认证密钥和 API 访问令牌'],
['Your private device keys are not included here', '这里不包括您的私人设备密钥'],
['they are always private, stay on your devic', '它们始终是私密的，保留在您的设备上'],
['and are never shared with Tailscale', '并且永远不会与 Tailscale 共享'],
['Auth keys', '认证密钥'],
['Authenticate devices without an interactive login', '无需交互式登录即可对设备进行认证'],
['API access tokens', 'API 访问令牌'],
['Access tokens give access to the Tailscale API', '访问令牌允许访问 Tailscale API'],
['You don\’t have any auth keys yet', '您还没有任何认证密钥'],
['You don\’t have any access tokens yet', '您还没有任何访问令牌'],
['Product', '产品'],
['Solutions', '解决方案'],
['Enterprise', '企业'],
['Customers', '客户'],
['Blog', '博客'],
['Pricing', '定价'],
['Admin console', '管理控制台'],
['Contact sales', '联系销售'],
['Get started - it\'s free', '开始使用 - 免费'],




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