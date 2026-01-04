// ==UserScript==
// @name        汉化zerotier
// @namespace   Violentmonkey Scripts
// @match       https://*.zerotier.com/*
// @version     3.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/474313/%E6%B1%89%E5%8C%96zerotier.user.js
// @updateURL https://update.greasyfork.org/scripts/474313/%E6%B1%89%E5%8C%96zerotier.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Download', '下载'],
['Knowledge Base', '知识库'],
['Community', '社区'],
['Account', '帐户'],
['Networks', '网络'],
['Logout', '注销'],
['Settings', '设置'],
['Basics', '基本设置'],
['Network ID', '网络 ID'],
['Name', '名称'],
['Description', '简介'],
['Access Control', '访问控制'],
['Private', '私有'],
['Nodes must be authorized to become members', '节点必须获得授权才能成为成员'],
['Public', '公开'],
['Any node that knows the 网络 ID can become a member', '任何知道网络 ID 的节点都可以成为成员'],
['Members cannot be de-authorized or deleted', '成员不能被取消授权或删除'],
['Members that haven\'t been online in 30 days will be removed', '30 天内未在线的成员将被删除'],
['but can rejoin', '但可以重新加入'],
['Advanced', '高级'],
['Managed Routes ', '管理路由 '],
['Add Routes', '添加路由'],
['Destination', '目的地'],
['Submit', '提交'],
['IPv4 Auto-Assign', 'IPv4 自动分配'],
['Auto-Assign from Range', '从范围自动分配'],
['IPv6 Auto-Assign', 'IPv6 自动分配'],
['128 for each device', '每个设备 128'],
['80 routable for each device', '每个设备 80 个可路由'],
['Multicast', '组播'],
['组播 Recipient Limit', '组播接收者限制'],
['Broadcast', '广播'],
['Enable 广播', '启用广播'],
['Requires ZeroTier version 1.6. See 设置 Help below.', '需要 ZeroTier 1.6 版本。请参阅下面的设置帮助。'],
['Search Domain', '搜索域'],
['Server Address', '服务器地址'],
['Manually Add Member', '手动添加成员'],
['Node Id', '节点 ID'],
['Adds a node to this network before it joins.', '在节点加入之前将其添加到此网络。'],
['Can be used to undelete a member.', '可用于取消删除成员。'],
['The network\'s globally unique 16-digit ID. This cannot currently be changed.', '网络的全球唯一 16 位 ID。目前无法更改。'],
['A user-defined short name for this network that is visible to members. ', '成员可见的用户自定义网络简称。'],
['We recommend using something like a domain name', '建议使用域名,如'],
['or e-mail address.', '或电子邮件地址。'],
['A longer description of this network.', '对该网络的较长描述。'],
['How is membership controlled', '如何控制成员资格'],
['This should be left on its default', '除非你想创建一个'],
['setting unless you want to create a ', '完全开放的网络用于测试、游戏等'],
['totally open network for testing, gaming, etc', '否则应保留默认证书设置'],
['The maximum number of recipients that can receive an Ethernet multicast or broadcast. If the number of recipients exceeds this limit', '可接收以太网组播或广播的最大接收者数量。如果接收者数量超过此限制'],
['a random subset will receive the announcement. Setting this higher makes multicasts more reliable on large networks at the expense of bandwidth.', '随机子集将收到公告。设置得越高，组播在大型网络中就越可靠，但会牺牲带宽。'],
['Setting to ', '设置为'],
['disables multicast', '则禁用组播'],
['but be aware that only IPv6 with NDP emulation', '但要注意，只有具有 NDP 仿真'],
['RFC4193 or 6PLANE addressing modes', 'RFC4193 或 6PLANE 寻址模式'],
['or other unicast-only protocols will work without multicast', '的 IPv6 。或其他单播协议才能在没有组播的情况下工作'],
['Managed Routes', '管理路由'],
['IPv4 and IPv6 routes to be published to network members. ', '向网络成员发布 IPv4 和 IPv6 路由。'],
['This can be used to create routes to other networks via gateways on a ZeroTier network. Note that for security reasons most clients will not use default routes or routes that overlap with public IP address space unless this is specifically allowed by the user. 公开 IP ranges are marked with an icon', '这可用于通过 ZeroTier 网络上的网关创建通往其他网络的路由。请注意，出于安全考虑，大多数客户端不会使用默认路由或与公共 IP 地址空间重叠的路由，除非用户特别允许。公开 IP 范围用图标标出'],
['IPv4 range from which to auto-assign IPs', '自动分配 IP 的 IPv4 范围'],
['Note that IPs will only be assigned if they also fall within a defined route', '请注意，只有当 IP 也在定义的路由范围内时，才会分配 IP。'],
['Easy mode allows users to pick an IP range and a route and pool definition will automatically be created.', '简易模式允许用户选择 IP 范围，路由和池定义将自动创建。'],
['IPv6 addresses can be automatically assigned with the RFC4193 or 6PLANE addressing schemes, or from a user-defined IPv6 range.', 'IPv6 地址可以通过 RFC4193 或 6PLANE 寻址方案自动分配，也可以通过用户定义的 IPv6 范围自动分配。'],
['RFC4193 assigns each device a single IPv6 /128 address computed from the network ID and device address', 'RFC4193 为每台设备分配一个 IPv6 /128 地址，该地址由网络 ID 和设备地址计算得出。'],
['and uses NDP emulation to make these addresses instantly resolvable without multicast.', '并使用 NDP 仿真使这些地址无需组播即可即时解析。'],
['6PLANE assigns each device a single IPv6 address within a fully routable /80 block and uses NDP emulation to “magically” route the entire /80 to its owner', '6PLANE 在一个完全可路由的 /80 块内为每台设备分配一个 IPv6 地址，并使用 NDP 仿真将整个 /80 "神奇地 "路由至其所有者'],
['allowing each device to assign up to', '允许每个设备分配多达'],
['IPs without additional configuration', '允许每个设备分配多达个 IP，无需额外配置'],
['This is designed for use with Docker or on VM hosts.', '专为与 Docker 或虚拟机主机配合使用而设计。'],
['Range assigns each device an IP from a user-defined IPv6 range', '从用户定义的 IPv6 范围为每个设备分配一个 IP'],
['An example might look like: “2001:abcd:ef00::” to', '示例如下 "2001:abcd:ef00:: "到'],
['DNS Push', 'DNS 推送'],
['Requires ZeroTier version 1.6', '需要 ZeroTier 1.6 版本'],
['Older versions of ZeroTier will ignore these settings', '旧版本的 ZeroTier 将忽略这些设置'],
['On macOS, iOS, Windows, and Android', '在 macOS、iOS、Windows 和 Android 上'],
['ZeroTier can automatically add DNS servers for a specific domain', 'ZeroTier 可为特定域自动添加 DNS 服务器'],
['It does not set up or host a DNS server. You must host your own.', '它不会设置或托管 DNS 服务器。您必须托管自己的服务器。'],
['If you configure', '如果将'],
['as your search domain', '配置为搜索域'],
['as a server address', '作为服务器地址'],
['then your computer will ask ', '则计算机将请求'],
['hostnames ending in', ' 查找以 zt.example.com 结尾的主机名的 IP 地址。'],
['This must be enabled on each client with the allowDNS option', '每个客户端都必须使用 allowDNS 选项启用此功能。'],
['There is a checkbox in the UI in each network\'s details, near the Allow Managed checkbox.', '用户界面中每个网络的详细信息中都有一个复选框，就在允许托管复选框附近。'],
['Members', '会员'],
['Search (Address / 名称)', '搜索 (地址 / 名称)'],
['Display Filter', '显示过滤器'],
['Authorized', '已授权'],
['Not 已授权', '未授权'],
['Bridges', '桥梁'],
['Inactive', '不活动'],
['Active', '激活'],
['Hidden', '隐藏'],
['Sort By', '排序方式'],
['Address', '地址'],
['Auth?', '认证'],
['Managed IPs', '管理 IP'],
['Last Seen', '最后查看'],
['Version', '版本'],
['Physical IP', '物理 IP'],
['LESS THAN A MINUTE', '不到一分钟'],
['MONTHS', '月'],
['DAYS', '天'],
['MINUTE', '分钟'],
['ABOUT 1 HOURS', '约 1 小时'],
['ABOUT 2 HOURS', '约 2 小时'],
['ABOUT 3 HOURS', '约 3 小时'],
['ABOUT 4 HOURS', '约 4 小时'],
['ABOUT 5 HOURS', '约 5 小时'],
['ABOUT 6 HOURS', '约 6 小时'],
['ABOUT 7 HOURS', '约 7 小时'],
['ABOUT 8 HOURS', '约 8 小时'],
['ABOUT 9 HOURS', '约 9 小时'],
['ABOUT 10 HOURS', '约 10 小时'],
['ABOUT 11 HOURS', '约 11 小时'],
['ABOUT 12 HOURS', '约 12 小时'],
['ABOUT 13 HOURS', '约 13 小时'],
['ABOUT 14 HOURS', '约 14 小时'],
['ABOUT 15 HOURS', '约 15 小时'],
['ABOUT 16 HOURS', '约 16 小时'],
['ABOUT 17 HOURS', '约 17 小时'],
['ABOUT 18 HOURS', '约 18 小时'],
['ABOUT 19 HOURS', '约 19 小时'],
['ABOUT 20 HOURS', '约 20 小时'],
['ABOUT 21 HOURS', '约 21 小时'],
['ABOUT 22 HOURS', '约 22 小时'],
['ABOUT 23 HOURS', '约 23 小时'],
['ABOUT 24 HOURS', '约 24 小时'],
['E-Mail Join Instructions', '电子邮件加入说明'],
['Invite', '邀请'],
['Add New Member', '添加新会员'],
['Administrators', '管理员'],
['to ZeroTier Professional to enable Network 管理员', '升级到 ZeroTier 专业版 以启用网络管理员'],
['Network 管理员 can be allowed to', '网络管理员允许'],
['View this network', '查看该网络'],
['Authorize members', '授权成员'],
['Modify network settings', '修改网络设置'],
['Delete the network', '删除网络'],
['Upgrade', '升级'],
['Add User', '添加用户'],
['Share administrative access to this network with your teammates', '与队友共享此网络的管理访问权限'],
['No users to select', '没有用户可选'],
['Add them to your Organization first from the', '请先从账户页面将他们添加到您的组织。'],
['Add User', '添加用户'],
['Permissions', '权限'],
['Read', '阅读'],
['Authorize', '授权'],
['Modify', '修改'],
['Delete', '删除'],
['When a node joins a ZeroTier network, we call it a member.', '当节点加入 ZeroTier 网络时，我们称其为成员。'],
['When a member is authorized, it\'s allowed to talk to other members of the network.', '成员获得授权后，就可以与网络中的其他成员对话。'],
['If you don\'t have an Auth column', '如果没有 Auth 列'],
['your network is set to public access', '您的网络被设置为公共访问'],
['See the 设置 section of this network.', '请参见该网络的设置部分。'],
['A ZeroTier Node\'s 地址', '零层节点的地址'],
['This is the node\'s unique ZeroTier ID.', '这是该节点唯一的 ZeroTier ID。'],
['You can put whatever you like here', '您可以随心所欲地在这里输入'],
['It is hard to remember node IDs', '节点 ID 很难记住'],
['so names help you remember which device is which.', '因此名称可以帮助您记住哪个设备是哪个。'],
['If you use a DNS tool with your network, like zeronsd', '如果您在网络中使用 DNS 工具，如 zeronsd'],
['you may want to use valid hostnames for your member names', '等 DNS 工具时，您可能需要使用有效的主机名作为成员名称。'],
['Something like', '比如'],
['These are the IP addresses you use when you use ZeroTier', '这些是您使用 ZeroTier 时使用的 IP 地址。'],
['Typically Easy Auto-Assign is enabled and you do not need to change anything', '通常情况下，Easy Auto-Assign 已启用，您无需做任何更改。'],
['You can set 管理 IP manually if you like.', '如果愿意，您可以手动设置管理 IP。'],
['The last time this member checked in with the network controller for this network.', '该成员最后一次在该网络的网络控制器上签到的时间。'],
['The physical IP address the member is connecting to the controller', '成员连接到控制器的物理 IP 地址'],
['It is Probably the IP address of your internet router/modem.', '可能是互联网路由器/调制解调器的 IP 地址。'],
['If you never want to see a node in this member list again', '如果您不想再看到此成员列表中的节点'],
['you can delete it.', '可以将其删除。'],
['If you deleted a member and decide you want it back', '如果您删除了一个成员，但又决定要恢复它'],
['you can use the "manually add member" form.', '可以使用 "手动添加成员 "表单。'],
['This deauthorizes and hides the member from the list', '这将取消成员的授权并将其从列表中隐藏。'],
['You can select the', '您可以选择'],
['checkbox to show hidden members.', '复选框来显示隐藏的成员。'],
['Authentication', '认证'],
['Manage 帐户', '管理 帐户'],
['E-Mail Notifications', '电子邮件通知'],
['I would like to receive emails about new features, updates, and announcements.', '我希望收到有关新功能、更新和公告的电子邮件。'],
['Current Plan', '当前计划'],
['BasicFREE', '基本免费'],
['Current Assets', '当前资产'],
['IN USE', '使用中'],
['SUBSCRIBED', '已订阅'],
['NODES', '节点'],
['SSO SEATS', 'SSO 席位'],
['修改 Plan', '修改 计划'],
['Manage Billing', '管理账单'],
['Your Organization', '您的组织'],
['Add Admins to your Organization', '为您的组织添加管理员'],
['Organization Help', '组织帮助'],
['API Access Tokens', 'API 访问令牌'],
['New Token', '新令牌'],
['API access tokens are used to access the ZeroTier Central API.', 'API 访问令牌用于访问 ZeroTier Central API。'],
['Danger Zone', '危险区域'],
['Deleting your account will also delete your networks', '删除您的帐户也会删除您的网络'],
['Devices on your networks will lose access to each other', '网络上的设备将失去相互访问权'],
['There is no going back.', '无法挽回。'],
['Basic FREE', '基本免费'],
['Features', '功能'],
['Pricing', '定价'],
['Company', '公司'],
['Support', '支持'],
['Login', '登录'],
['ZeroTier works on the devices and platforms you love', 'ZeroTier 可在您喜爱的设备和平台上运行'],
['Microsoft Windows', '微软视窗'],
['Be sure to approve installation of the driver during the install process', '请确保在安装过程中批准安装驱动程序'],
['Note: Windows 7 and Server 2012 usersplease ', '注：Windows 7 和 Server 2012 用户请 '],
['download ZeroTier 1.6.6', '下载 ZeroTier 1.6.6'],
['as there is no Windows 7 support in ZeroTier 1.8 or later. ', '因为 ZeroTier 1.8 或更高版本不支持 Windows 7。'],
['If you are installing via a remote desktop session ', '如果您要通过远程桌面会话进行安装 '],
['read this knowledge base entry.', '请阅读本知识库条目。'],
['MSI Installer (x86/x64)', 'MSI 安装程序（x86/x64）'],
['SUBNET', '子网'],
['NODES', '节点'],
['CREATED', '创建'],
['Page has expired', '页面已过期'],
['To restart the login process ', '重新启动登录程序 '],
['Click here', '点击此处'],
['To continue the login process', '继续登录'],
['Log In', '登录'],
['Remember me', '记住我 '],
['Forgot Password', '忘记密码'],
['Or sign in with', '或登录'],
['New User', '新用户'],
['Welcome to ZeroTier Central', '欢迎访问 ZeroTier Central'],
['ZeroTier Central provides a friendly web UI and API for managing ZeroTier network controllers as well as related services that can be added to networks.', 'ZeroTier Central 提供友好的 Web UI 和 API，用于管理 ZeroTier 网络控制器以及可添加到网络的相关服务。'],
['Log In / Sign up', '登录/注册'],
['MacOS', 'MacOS'],
['MacOS 10.13\+ or newer is supported.', '支持 MacOS 10.13+ 或更新版本。'],



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