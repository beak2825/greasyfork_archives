// ==UserScript==
// @name        汉化cloudflare
// @namespace   Violentmonkey Scripts
// @match       https://*.cloudflare.com/*
// @match       https://*.cloudflareaccess.com/*
// @version     3.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @license MIT
// @namespace    https://t.me/KingRan_qun
// @downloadURL https://update.greasyfork.org/scripts/474317/%E6%B1%89%E5%8C%96cloudflare.user.js
// @updateURL https://update.greasyfork.org/scripts/474317/%E6%B1%89%E5%8C%96cloudflare.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

['Discover', '发现'],
['Turnstile', '访问控制'],
['Stream', '流媒体'],
['Custom Domains', '自定义域名'],
['Routes', '路由'],
['Cron Triggers', 'Cron 触发器'],
['Email Triggers', '电子邮件触发器'],
['Connected Workers', '连接Worker'],
['Area', '地区'],
['Welcome aboard!', '欢迎加入！'],
['Here\'s a list of suggestions to help you get started with Cloudflare Zero Trust.', '以下是帮助您开始使用 Cloudflare Zero Trust 的建议列表。'],
['Start protecting your applications', '开始保护您的应用程序'],
['Put Zero Trust policies in front of any kind of application.', '将零信任策略置于任何类型的应用程序之前。'],
['Add an application', '添加应用程序'],
['View sample application', '查看应用程序示例'],
['Protect your Internet browsing', '保护您的互联网浏览'],
['28% of data breaches are caused by malware. With one click, you can create a policy to block malware domains', '28% 的数据泄露是由恶意软件造成的。只需单击一下，您就可以创建阻止恶意软件域的策略'],
['Block malware', '阻止恶意软件'],
['Exclude applications incompatible with TLS decryption', '排除与 TLS 解密不兼容的应用程序'],
['Create an HTTP policy to ensure that Gateway does not inspect applications incompatible with Gateway\'s proxy', '创建 HTTP 策略，确保 Gateway 不检查与 Gateway 代理不兼容的应用程序'],
['Create an HTTP policy', '创建 HTTP 策略'],
['Customize your login page', '自定义登录页面'],
['Choose a company name, header and footer, logo, and a background color for the login page users will see when authenticating to an application behind Access', '为登录页面选择公司名称、页眉、页脚、徽标和背景颜色，以便用户在验证 Access 后面的应用程序时看到。'],
['Customize login page', '自定义登录页面'],
['Tutorials', '教程'],
['Block specific sites for users', '阻止用户访问特定网站'],
['Read more', '更多信息'],
['This tutorial covers how to:', '本教程包括如何'],
['Enroll devices into Gateway', '将设备注册到网关'],
['Create a Gateway policy to block URLs that contain a hostname for certain users', '创建 Gateway 策略，为特定用户阻止包含主机名的 URL'],
['Time: 25 minutes', '时间：25 分钟'],
['Filter DNS on home or office network', '在家庭或办公室网络上过滤 DNS'],
['Read more', '更多信息'],
['This tutorial covers how to:', '本教程介绍如何'],
['Create a DNS filtering policy that secures devices by blocking malicious hostnames', '创建 DNS 过滤策略，通过阻止恶意主机名来保护设备安全'],
['Review logs and events that occur on that network', '查看网络上发生的日志和事件'],
['Time: 15 minutes', '时间：15 分钟'],
['Zero Trust resources', '零信任资源'],
['Account & Billing', '账户和账单'],
['Manage your Zero Trust plan.', '管理您的零信任计划。'],
['Radar', '雷达'],
['Up-to-date Internet trends and insights.', '最新的互联网趋势和见解。'],
['Give feedback on Cloudflare Zero Trust', '对 Cloudflare Zero Trust 提出反馈意见'],
['Help us improve and build a better Internet.', '帮助我们改进和建设更好的互联网。'],
['Zero Trust Help Page', '零信任帮助页面'],
['Check your connection to Cloudflare Zero Trust and see if your network is secure.', '检查您与 Cloudflare Zero Trust 的连接，查看您的网络是否安全。'],
['Support', '技术支持'],
['Developer docs', '开发人员文档'],
['Learn more about Cloudflare Zero Trust.', '了解有关 Cloudflare Zero Trust 的更多信息。'],
['Ask the community', '咨询社区'],
['Ask questions, get answers, and share tips.', '提问、获取答案并分享技巧。'],
['Configure the policies, authentication, and settings of your applications.', '配置应用程序的策略、身份验证和设置。'],
['Select type', '选择类型'],
['Configure app', '配置应用程序'],
['Add policies', '添加策略'],
['Setup', '设置'],
['What type of application do you want to add?', '要添加哪种类型的应用程序？'],
['If you\'re not sure, choose self-hosted.', '如果不确定，请选择自托管。'],
['Applications you host in your infrastructure that use Cloudflare\'s authoritative DNS.', '您在自己的基础架构中托管的应用程序，使用 Cloudflare 的权威 DNS。'],
['Self-hosted', '自托管'],
['SaaS', 'SaaS'],
['Applications you do not host. Additional setup is required outside of Cloudflare Zero Trust.', '您不托管的应用程序。需要在 Cloudflare Zero Trust 之外进行额外设置。'],
['Resources you host in your infrastructure that cannot use public DNS records.', '您在基础架构中托管的无法使用公共 DNS 记录的资源。'],
['If you have apps that cannot be put behind Access, we provide a shortcut on our App Launcher', '如果您有不能放在 Access 后面的应用程序，我们会在应用程序启动器上提供快捷方式。'],
['Private network', '专用网络'],
['Bookmark', '书签'],
['Back to Applications', '返回应用程序'],
['Select', '选择'],
['Analytics', '分析'],
['Access', '访问'],
['Gateway', '网关'],
['Gateway', '网关'],
['DNS Locations', 'DNS 位置'],
['Firewall Policies', '防火墙策略'],
['Egress Policies', '出口策略'],
['Access', '访问'],
['Applications', '应用程序'],
['Access GroupsService AuthTunnels', '访问组服务认证隧道'],
['DEXBeta', 'DEXBeta'],
['Monitoring', '监控'],
['Tests', '测试'],
['My Team', '我的团队'],
['Devices', '设备'],
['Users', '用户'],
['Lists', '列表'],
['Logs', '日志'],
['Admin', '管理员'],
['Access', '访问'],
['Gateway', '网关'],
['Posture', '态势'],
['Settings', '设置'],
['Account', '账户'],
['Manage payment methods, seats and plans.', '管理付款方式、席位和计划。'],
['Custom Pages', '自定义页面'],
['Personalize the Cloudflare Zero Trust experience for your end-users.', '为您的最终用户提供个性化的 Cloudflare Zero Trust 体验。'],
['Network', '网络'],
['Manage your filtering preferences for outbound traffic.', '管理您对外部流量的过滤偏好。'],
['Authentication', '身份验证'],
['Set global preferences for applications protected behind 访问.', '为受访问保护的应用程序设置全局首选项。'],
['WARP Client', 'WARP 客户端'],
['Manage preferences for the WARP client.', '管理 WARP 客户端的首选项。'],
['Downloads', '下载'],
['Download WARP Client, Cloudflared, and certificates.', '下载 WARP 客户端、Cloudflared 和证书。'],
['Role', '角色'],
['Content LoadedSuper 管理员istrator', '内容已加载超级管理员'],
['Update plan', '更新计划'],
['Plan type', '计划类型'],
['Zero Trust Free', '零信任免费'],
['3 of 50 available users', '50 个可用用户中的 3 个'],
['Payment', '付款方式'],
['All transactions are secure and encrypted.', '所有交易均安全加密。'],
['Exp date', '过期日期'],
['Payment method', '付款方式'],
['Change', '更改'],
['Billing address', '账单地址'],
['User Seat Expiration', '用户席位到期'],
['This setting will remove user seats from your account for any users that are inactive for the specified time', '此设置将从您的账户中删除在指定时间内不活动的用户席位'],
['Not Enabled', '未启用'],
['User Inactive Time', '用户不活动时间'],
['Terraform read-only mode', 'Terraform 只读模式'],
['Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled.', '在控制面板中将所有设置锁定为只读，与用户权限无关。启用后，只能通过 API 或 Terraform 对该账户进行更新。'],

['Role', '角色'],
['Content LoadedSuper 管理员istrator', '内容已加载超级管理员'],
['Update plan', '更新计划'],
['Plan type', '计划类型'],
['Zero Trust Free', '零信任免费'],
['available users', '个可用用户中的'],
['Payment', '付款方式'],
['All transactions are secure and encrypted.', '所有交易均安全加密。'],
['Exp date', '过期日期'],
['Payment method', '付款方式'],
['Change', '更改'],
['Billing address', '账单地址'],
['User Seat Expiration', '用户席位到期'],
['This setting will remove user seats from your account for any users that are inactive for the specified time', '此设置将从您的账户中删除在指定时间内不活动的用户席位'],
['Not Enabled', '未启用'],
['User Inactive Time', '用户不活动时间'],
['Terraform read-only mode', 'Terraform 只读模式'],
['Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled.', '在控制面板中将所有设置锁定为只读，与用户权限无关。启用后，只能通过 API 或 Terraform 对该账户进行更新。'],
['Block page', '屏蔽页面'],
['用户 will see this page when they reach a website blocked by 网关.', '当用户访问被网关屏蔽的网站时，将看到此页面。'],
['Customize', '自定义'],
['Login page', '登录页面'],
['用户 will see this page when they reach an application behind 访问.', '用户在访问被屏蔽的应用程序时会看到此页面。'],
['Customize', '自定义'],
['Create custom pages to display when a user fails an 访问 authentication requirement.', '创建自定义页面，以便在用户未通过访问验证要求时显示。'],
['Manage', '管理'],
['Team domain', '团队域名'],
['This is where the App Launcher lives, and where users make access requests to applications behind 访问', '这是应用程序启动器所在的位置，也是用户向访问背后的应用程序发出访问请求的位置。'],
['DNS locations are a collection of DNS endpoints which can be mapped to physical entities like offices, homes, or data centers. Once created, you can apply 网关 policies to protect your DNS locations.', 'DNS 位置是 DNS 端点的集合，可以映射到办公室、住宅或数据中心等物理实体。创建后，您可以应用网关策略来保护 DNS 位置。'],
['Learn more', '了解更多'],
['Your DNS locations', '您的 DNS 位置'],
['Showing 1 - 10', '显示 1 - 10'],
['管理 the configuration of your existing DNS locations or set a default DNS location.', '管理现有 DNS 位置的配置或设置默认 DNS 位置。'],
['Add a location', '添加位置'],
['Search', '搜索'],
['Location name ', '位置名称 '],
['Default Location', '默认位置'],
['Firewall policies', '防火墙策略'],
['Protect your users by creating policies that scan, filter, and log traffic. By default, 网关 allows all traffic and DNS queries unless a policy matches.', '通过创建扫描、过滤和记录流量的策略来保护用户。默认情况下，除非策略匹配，否则网关允许所有流量和 DNS 查询。'],
['Start filtering your DNS traffic', '开始过滤 DNS 流量'],
['Create organization-level or user-level DNS policies to protect your network from security risks on the Internet.', '创建组织级或用户级 DNS 策略，保护网络免受互联网上的安全风险。'],
['Create a DNS policy', '创建 DNS 策略'],
['If you need help, here’s our ', '如果您需要帮助，请参阅我们的 '],
['about DNS policies', '关于 DNS 策略'],
['Start filtering your network traffic', '开始过滤网络流量'],
['Create network policies to allow, block or override traffic based on IP addresses and ports.', '创建网络策略，根据 IP 地址和端口允许、阻止或覆盖流量。'],
['Create a network policy', '创建网络策略'],
['Start filtering traffic on the L7 firewall', '开始在 L7 防火墙上过滤流量'],
['Create policies to inspect HTTP traffic and block, allow, or override requests to websites.', '创建策略来检查 HTTP 流量，并阻止、允许或覆盖对网站的请求。'],
['about HTTP policies', '关于 HTTP 策略'],
['network policies', '网络策略'],
['Egress policies specify which IP is used for egress traffic based on identity, IP addresses, network, and geolocation attributes. If no policies are matched, packets will route to the dedicated egress IP closest to the user. Note: Dedicated egress IPs are required to enable traffic egress policies.', '出口策略根据身份、IP 地址、网络和地理位置属性指定哪个 IP 用于出口流量。如果没有匹配的策略，数据包将路由到离用户最近的专用出口 IP。注意：启用流量出口策略需要专用出口 IP。'],
['Create egress policies', '创建出口策略'],
['Egress policies specify the source IP used for egress traffic based on identity, IP addresses, network, and geolocation attributes. Egress traffic will use the default Cloudflare proxy method if no polices are matched.', '出口策略根据身份、IP 地址、网络和地理位置属性指定用于出口流量的源 IP。如果没有匹配的策略，出口流量将使用默认的 Cloudflare 代理方法。'],
['For more about 网关 Policies, see the full 网关', '有关网关策略的更多信息，请参阅完整的网关策略。'],
['Note: Dedicated egress IPs are required to enable traffic egress policies.', '注意：启用流量出口策略需要专用出口 IP。'],
['Create egress policy', '创建出口策略'],
['Protect your Self-Hosted, SaaS and Private applications with Zero Trust policies. Only users who match your policies will have access to your configured applications.', '使用零信任策略保护您的自助托管、SaaS 和专用应用程序。只有符合策略的用户才能访问您配置的应用程序。'],
['Secure your applications', '保护您的应用程序'],
['Protect your internal and SaaS applications behind a layer of Zero Trust policies. Each application type has its own requirements.', '在零信任策略层后保护您的内部和 SaaS 应用程序。每种应用类型都有自己的要求。'],
['自托管 prerequisites', '自托管前提条件'],
['Add your website to Cloudflare', '将您的网站添加到 Cloudflare'],
['更改 your domain nameservers to Cloudflare', '更改您的域名服务器到 Cloudflare'],
['SaaS prerequisites', 'SaaS 先决条件'],
['Obtain your Entity ID URL', '获取您的实体 ID URL'],
['Obtain your application’s SAML endpoint', '获取应用程序的 SAML 端点'],
['Configure an identity provider', '配置身份提供商（推荐）'],
['专用网络 prerequisites', '专用网络前提条件'],
['Know the value of your Destination IP or SNI', '了解目标 IP 或 SNI 的值'],
['Create a tunnel and install cloudflared', '创建隧道并安装 cloudflared'],
['Recommendations', '建议'],
['2 items', '2 项'],
['Hide', '隐藏'],
['Add an identity provider (IdP)', '添加身份提供商 (IdP)'],
['Protect your Self-Hosted, SaaS and Private applications with Zero Trust policies. Only users who match your policies will have access to your configured applications.', '使用零信任策略保护您的自助托管、SaaS 和私有应用程序。只有符合策略的用户才能访问您配置的应用程序。'],
['Add an IdP', '添加 IDP'],
['Create an 访问 group', '创建访问组'],
['A group allows you to configure a reusable set of rules that you can quickly apply across your 访问 applications.', '通过组，您可以配置一组可重复使用的规则，在整个访问应用程序中快速应用。'],
['Add a group', '添加组'],
['访问 groups', '访问组'],
['Create a group to use in 访问 policies for self-hosted and SaaS applications. Groups can contain a mix of users, identity provider groups, and more options like service tokens, device posture, and IP addresses.', '创建一个组，用于自托管和 SaaS 应用程序的访问策略。组可以包含用户、身份提供者组和更多选项（如服务令牌、设备态势和 IP 地址）。'],
['了解更多', '了解更多'],
['Create reusable application policy elements', '创建可重复使用的应用策略元素'],
['Configure groups that include your identity provider groups, IP, device, certificates, or service tokens. Reuse groups across 访问 应用程序.', '配置包括身份提供商组、IP、设备、证书或服务令牌的组。跨访问 应用程序重复使用组。'],
['Grant or restrict user access', '授予或限制用户访问权限'],
['Create a group of employees, IP addresses, or countries.', '创建员工、IP 地址或国家组。'],
['访问 Groups cannot be used in 网关 policies.', '访问 组不能在网关策略中使用。'],
['Apply across 访问 policies', '跨访问策略应用'],
['Updates automatically transfer across any related applications.', '更新可在任何相关应用程序间自动传输。'],
['Create up to 300 groups, or reach out to your account team to request an increase.', '最多可创建 300 个组，或联系您的客户团队申请增加。'],
['Apply groups to 访问 应用程序', '将群组应用到访问 应用程序'],
['Create a group to use in 访问 policies for self-hosted and SaaS applications. Groups can contain a mix of users, identity provider groups, and more options like service tokens, device posture, and IP addresses.', '创建一个组，用于自托管和 SaaS 应用程序的访问策略。组可以包含用户、身份提供者组和更多选项（如服务令牌、设备状态和 IP 地址）。'],
['Install WARP on your devices', '在设备上安装 WARP'],
['Download WARP on user devices to connect to Cloudflare’s network and enforce WARP-based group criteria.', '在用户设备上下载 WARP，以连接 Cloudflare 网络并执行基于 WARP 的组标准。'],
['Download WARP', '下载 WARP'],
['Service Auth', '服务认证'],
['Service 身份验证', '服务 身份验证'],
['Use tokens and certificates to allow automated systems to connect to your 访问 applications or for added user security.', '使用令牌和证书允许自动化系统连接到您的访问应用程序，或增加用户安全性。'],
['Service Tokens', '服务令牌'],
['Service tokens provide credentials for automated tools, scripts, and bots to reach an application protected by 访问.', '服务令牌可为自动化工具、脚本和机器人提供凭证，使其能够访问受访问保护的应用程序。'],
['Create Service Token', '创建服务令牌'],
['Search', '搜索'],
['Token name ', '令牌名称 '],
['Created ', '已创建 '],
['Expires ', '过期 '],
['Last Seen ', '最后查看 '],
['Duration ', '持续时间 '],
['Context menu', '上下文菜单'],
['Content Loaded', '已加载内容'],
['No results... yet!', '暂无结果.....！'],
['Results will appear here once conditions are met.', '一旦满足条件，结果将出现在这里。'],
['In the meantime, here’s our documentationThis link opens in a new tab for Cloudflare Zero Trust', '同时，这里是我们的文档此链接在新标签页中打开 Cloudflare Zero Trust'],

['Application', '申请'],
['No valid options.', '无有效选项。'],
['Generate certificate', '生成证书'],
['Short-lived certificates', '短期证书'],
['访问 will generate short-lived certificates during an SSH Session and issue them to cloudflared. Your origin can use ', '访问将在 SSH 会话期间生成短期证书并将其签发给 cloudflared。您的起源可以使用 '],
['Application name', '应用程序名称'],
['Uh-oh. You need to add an application first', '啊哦。您需要先添加一个应用程序'],
['Once you’ve added your first application, you’ll be able to generate a certificate for it.', '添加第一个应用程序后，您就可以为它生成证书了。'],
['Tunnels', '隧道'],
['隧道 establish a secure connection between Cloudflare’s edge and your infrastructure.', '隧道在 Cloudflare 边缘和您的基础设施之间建立安全连接。'],
['Securely connect to private resources', '安全连接私有资源'],
['Create tunnels to connect to your private resources without opening ports or exposing them to the Internet.', '创建隧道连接到您的私有资源，而无需打开端口或将其暴露于互联网。'],
['Install and authenticate', '安装和验证 Cloudflared'],
['Cloudflared runs alongside origin servers to connect to Cloudflare’s network.', 'Cloudflared 与起源服务器一起运行，以连接 Cloudflare 网络。'],
['You will need to run a command in your terminal window.', '您需要在终端窗口中运行一个命令。'],
['Connect an application or a private network', '连接应用程序或专用网络'],
['Once your tunnel is created, use the Public Hostnames tab to specify the service or the Private 网络s tab to add an IP or CIDR.', '创建隧道后，使用 "公共主机名 "选项卡指定服务，或使用 "专用网络 "选项卡添加 IP 或 CIDR。'],
['Monitor your tunnel', '监控你的隧道'],
['View connector diagnostics for a live stream of a tunnel’s logs.', '查看隧道日志实时流的连接器诊断。'],
['Receive an alert when a tunnel\'s health status changes. Learn how to', '当隧道的健康状态发生变化时接收警报。了解如何打开通知。'],
['Add a tunnel', '添加隧道'],
['Install WARP on user devices', '在用户设备上安装 WARP'],
['To connect to private network resources, end users must have the WARP client installed on their devices.', '要连接到专用网络资源，终端用户必须在其设备上安装 WARP 客户端。'],
['Add Zero Trust policies to your private network', '在专用网络中添加零信任策略'],
['管理 who can reach your private network by creating a private network application in 访问.', '在访问中创建专用网络应用程序，管理谁可以访问您的专用网络。'],
['Verify device posture on all devices enrolled in your Zero Trust organization.', '验证零信任组织中注册的所有设备的设备状态。'],
['Your devices', '您的设备'],
['Showing 1-2 of 2', '显示 1-2 个，共 2 个'],
['管理 and revoke your enrolled devices.', '管理和撤销您注册的设备。'],
['Show filters', '显示过滤器'],
['Device name ', '设备名称 '],
['Client version ', '客户端版本 '],
['Last seen ', '最后查看 '],
['Monitor seat usage and the activity of users in your Zero Trust organization.', '监控零信任组织中的座位使用情况和用户活动。'],
['Your users', '您的用户'],
['Showing 1-3 of 3', '显示 1-3 个，共 3 个'],
['View your users’ devices and activity and revoke active sessions.', '查看用户的设备和活动，撤销活动会话。'],
['Export to CSV', '导出为 CSV'],
['Search', '搜索'],
['选择 all', '选择全部'],
['User name ', '用户名 '],
['Create your first list', '创建第一个列表'],
['Add a list with all the URLs or Hostnames you want to reference when creating your Secure Web 网关 policies.', '添加一个列表，其中包含创建 Secure Web 网关策略时要参考的所有 URL 或主机名。'],
['Create manual list', '创建手动列表'],
['Upload CSV', '上传 CSV'],
['Gain insights on the users and applications on your private network and the status and type of SaaS applications visited by your users.', '深入了解专用网络上的用户和应用程序，以及用户访问的 SaaS 应用程序的状态和类型。'],
['Shadow IT 发现y', '影子 IT 发现y'],
['Private 网络', '私有网络'],
['SaaS', 'SaaS'],
['申请 data will show up here once users have made requests.', '一旦用户提出申请，申请数据就会显示在这里。'],
['Data on approved origins for the time period ‘Last 7 days’ will show up here once available.', '最近 7 天 "时间段内已批准的来源地数据一旦可用，就会显示在这里。'],
['Data on unapproved origins for the time period ‘Last 7 days’ will show up here once available.', '最近 7 天 "期间未获批准的来源地数据一旦可用，将显示在此处。'],
['applications accessed', '访问的应用程序'],
['failed logins', '登录失败'],
['connected users', '已连接用户'],
['Logins forApps', '登录应用程序'],
['You should start seeing data for the time period ‘Last 7 days’ soon otherwise, users may not have authenticated to this application yet.', '您应该很快就能看到 "最近 7 天 "时间段的数据，否则，用户可能尚未对该应用程序进行身份验证。'],
['For troubleshooting, visit our developer docs.', '有关故障排除，请访问我们的开发人员文档。'],
['Refresh', '刷新'],
['Top applications accessed', '访问量最高的应用程序'],
['View more', '查看更多'],
['No applications found for the time period ‘Last 7 days’.', '未找到 "最近 7 天 "时间段的应用程序。'],
['Top connected users', '连接最多的用户'],
['View more', '查看更多'],
['No users found for the time period ‘Last 7 days’.', '最近 7 天 "内未发现任何用户。'],

['Success', '成功'],
['Click ', '点击 '],
['Open Cloudflare WARP', '打开 Cloudflare WARP'],
['on the dialog in your browser', '上的对话框'],
['If you don\'t see the open dialog, click ', '如果看不到打开对话框，请单击 '],
['Open Cloudflare WARP ', '打开 Cloudflare WARP '],
['below', '下面'],
['Authentication Expired', '身份验证已过期'],


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