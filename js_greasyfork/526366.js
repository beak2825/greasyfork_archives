// ==UserScript==
// @name         Modrinth-ChineseTranslated
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  一个汉化Modrinth网页的的脚本，将 Modrinth 网站的内容翻译成中文。
// @author       YlovexLN
// @match        https://modrinth.com/*
// @grant        none
// @license      GPL-3.0
// @supportURL https://github.com/YlovexLN/Modrinth-ChineseTranslated/issues
// @downloadURL https://update.greasyfork.org/scripts/526366/Modrinth-ChineseTranslated.user.js
// @updateURL https://update.greasyfork.org/scripts/526366/Modrinth-ChineseTranslated.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 翻译词典
  const translations = {
    "Discover content": "发现内容",
    "Host a server": "托管服务器",
    "Modrinth App": "Modrinth 应用",
    "New project": "新建项目",
    "New collection": "新建收藏夹",
    "New organization": "新建组织",
    "The place for Minecraft mods plugins data packs shaders resource packs modpacks":
      "Minecraft 模组、插件、数据包、光影包、资源包和模组包的家园",
    "Discover, play, and share Minecraft content through our open-source platform built for the community.":
      "通过我们为社区构建的开源平台发现、游玩和分享 Minecraft 内容。",
    Mods: "模组",
    mods: "模组",
    Plugins: "插件",
    plugins: "插件",
    "Data Packs": "数据包",
    "data packs": "数据包",
    Shaders: "光影包",
    shaders: "光影包",
    "resource packs": "资源包",
    "Resource Packs": "资源包",
    Modpacks: "整合包",
    modpacks: "整合包",
    Servers: "服务器",
    servers: "服务器",
    "Upgrade to Modrinth+": "升级到 Modrinth+",
    "Saved projects": "保存的项目",
    "My servers": "我的服务器",
    Notifications: "通知",
    from: "来自",
    project: "项目",
    Revenue: "收入",
    Analytics: "分析",
    "Sign out": "登出",
    "Discover, play, and share Minecraft content through our open-source platform built for the community.":
      "通过我们为社区打造的开源平台发现、游玩和分享 Minecraft 内容。",
    "Discover mods": "发现模组",
    "Go to dashboard": "前往仪表盘",
    "For Players": "面向玩家",
    "Discover over 50,000 creations": "发现超过 50,000 个创作",
    "From magical biomes to cursed dungeons, you can be sure to find content to bring your gameplay to the next level.":
      "从魔法生物群系到诅咒的地牢，你肯定能找到能提升游戏体验的内容。",
    "Find what you want, quickly and easily": "快速轻松地找到你想找的内容",
    "Modrinth's lightning-fast search and powerful filters let you find what you want as you type.":
      "Modrinth 的超快搜索和强大的筛选功能让你在输入时就能找到想要的内容。",
    "View:": "显示:",
    "List view": "列表视图",
    "Grid view": "网格视图",
    "Gallery view": "画廊视图",
    "Sort by:": "排序:",
    Relevance: "相关性",
    Downloads: "下载",
    Follows: "关注",
    download: "下载",
    follower: "关注",
    "Date updated": "更新时间",
    "Date published": "发布时间",
    "Follow projects you love": "关注你喜欢的项目",
    "Get notified every time your favorite projects update and stay in the loop":
      "每次你关注的项目更新时都会收到通知，不错过任何动态",
    "Give an online home to your creations and reach a massive audience of dedicated players":
      "为你创作的内容提供在线家园，并触及大量忠实玩家",
    "Play with your favorite launcher": "使用你喜爱的启动器游玩",
    "Modrinth's open-source API lets launchers add deep integration with Modrinth. You can use Modrinth through":
      "Modrinth 的开源 API 让启动器能够深度集成 Modrinth。你可以通过",
    "our own app": "我们自己的应用程序",
    "and some of the most popular launchers like ATLauncher, MultiMC, and Prism Launcher.":
      "和一些最受欢迎的启动器(如 ATLauncher、MultiMC 和 Prism Launcher)使用 Modrinth。",
    "For Creators": "创作者专区",
    "Share your content with the world": "与世界分享你的内容",
    "Give an online home to your creations and reach a massive audience of dedicated players":
      "为你创作的内容提供在线家园，并触及大量忠实玩家",
    Discovery: "发现",
    "Get your project discovered by thousands of users through search, our home page, Discord server, and more ways to come in the future!":
      "通过搜索、我们的首页、Discord 服务器以及未来更多方式，让你的项目被成千上万的用户发现！",
    "Team Management": "团队管理",
    "Invite your teammates and manage roles and permissions with ease":
      "轻松邀请队友并管理角色和权限",
    Monetization: " 收益",
    "Get paid ad revenue from your project pages and withdraw your funds at any time":
      "从你的项目页面获得广告收入，并随时提现",
    "Diverse Ecosystem": "多样化的生态系统",
    "Integrate with your build tools through Minotaur for automatic uploads right when you release a new version":
      "通过 Minotaur 与构建工具集成，实现在发布新版本时自动上传",
    "Data and Statistics": "数据和统计",
    "Get detailed reports on page views, download counts, and revenue":
      "获取详细的页面浏览量、下载次数和收入报告",
    "Constantly Evolving": "不断进化",
    "Get the best modding experience possible with constant updates from the Modrinth team":
      "通过 Modrinth 团队的持续更新，获得最佳的模组制作体验",
    "Read more about": "了解更多关于",
    "Visit the blog": "访问博客",
    "Modrinth is ": "Modrinth 是 ",
    "open source": "开源的",
    ".": "。",
    Company: "公司",
    Terms: "条款",
    Privacy: "隐私",
    Rules: "规则",
    Careers: "职位",
    Resources: "资源",
    Support: "支持",
    About: "关于",
    News: "新闻",
    Blog: "博客",
    Docs: "文档",
    Status: "状态",
    "Rewards Program": "奖励计划",
    Products: "产品",
    "Modrinth Servers": "Modrinth 服务器",
    "Help Center": "帮助中心",
    Translate: "翻译",
    "Report issues": "报告问题",
    "View source": "查看源代码",
    "Visit wiki": "访问wiki",
    "Join Discord server": "加入Discord服务器",
    "Donate on Ko-fi": "在Ko-fi上捐赠",
    "Donate on Patreon": "在Patreon上捐赠",
    "Donate on PayPal": "在PayPal上捐赠",
    "Sponsor on GitHub": "GitHub上的赞助商",
    "API documentation": "API 文档",
    Legal: "法律",
    "Content Rules": "内容规则",
    "Terms of Use": "使用条款",
    "Security Notice": "安全声明",
    Interact: "互动",
    "X (Twitter)": "X (推特)",
    "Get Modrinth App": "获取 Modrinth 应用",
    "Sign in": "登录",
    "Sign up": "注册",
    "Sign in with": "使用以下方式登录",
    "Or use a password": "或使用密码",
    "Create an account": "创建账户",
    "Enter two-factor code": "输入两步验证码",
    "Please enter a two-factor code to proceed.": "请输入两步验证码以继续。",
    "Change theme": "更改主题",
    "NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.":
      "这不是官方的 Minecraft 服务。未经 Mojang 或 Microsoft 批准或关联。",
    "Join the conversation": "加入讨论",
    "Loading...": "加载中...",
    "No results found": "未找到结果",
    Home: "首页",
    Login: "登录",
    Register: "注册",
    Profile: "个人资料",
    Settings: "设置",
    Logout: "登出",
    Dashboard: "仪表盘",
    "My Projects": "我的项目",
    "My Organizations": "我的组织",
    "My Collections": "我的收藏夹",
    "Create Project": "创建项目",
    "Create Collection": "创建收藏夹",
    "Create Organization": "创建组织",
    "Latest News": "最新新闻",
    Featured: "精选",
    "Support us": "支持我们",
    "Help & Support": "帮助和支持",
    Documentation: "文档",
    "Terms of Service": "服务条款",
    "Privacy Policy": "隐私政策",
    Categories: "分类",
    Features: "特点",
    Trending: "趋势",
    "Featured Packs": "精选包",
    "Recent Activity": "最近活动",
    Community: "社区",
    Popular: "流行",
    "Search results for": "搜索结果",
    Submit: "提交",
    Apply: "应用",
    Cancel: "取消",
    Username: "用户名",
    Password: "密码",
    "Confirm Password": "确认密码",
    "Submit your mod": "提交你的模组",
    "Edit Project": "编辑项目",
    "Delete Project": "删除项目",
    "Project Settings": "项目设置",
    "Manage Organization": "管理组织",
    "Your Projects": "你的项目",
    "Your Collections": "你的收藏夹",
    "Your Organizations": "你的组织",
    "Add New Mod": "添加新模组",
    "Add New Collection": "添加新收藏夹",
    "Add New Organization": "添加新组织",
    "Minecraft Version": "Minecraft 版本",
    "Game Version": "游戏版本",
    "Game versions": "游戏版本",
    "Choose File": "选择文件",
    Upload: "上传",
    Download: "下载",
    "Install Instructions": "安装说明",
    "Change Log": "更新日志",
    Links: "链接",
    Creators: "作者",
    Details: "详情",
    "Report an Issue": "报告问题",
    "View Project": "查看项目",
    "Version History": "版本历史",
    "Modrinth API": "Modrinth API",
    "About Us": "关于我们",
    Contact: "联系方式",
    Support: "支持",
    "API Documentation": "API 文档",
    "Privacy Settings": "隐私设置",
    "Invite a member": "邀请成员",
    "Manage Members": "管理成员",
    "Organization Settings": "组织设置",
    "Request Access": "请求访问",
    "Create New Project": "创建新项目",
    "Project Version": "项目版本",
    Resources: "资源",
    "Installation Instructions": "安装说明",
    "Review and Ratings": "评论与评分",
    "View Comments": "查看评论",
    "Add Comment": "添加评论",
    "Add Review": "添加评分",
    Approve: "批准",
    Reject: "拒绝",
    Draft: "草稿",
    Publish: "发布",
    Published: "发布于",
    Unpublished: "未发布",
    Starred: "收藏",
    Favorites: "收藏夹",
    "User Reviews": "用户评论",
    Organization: "团队",
    Developer: "开发者",
    Owner: "所有者",
    "Created by": "创建者",
    "Version Notes": "版本说明",
    "Mods and Add-ons": "模组和附加组件",
    Contribute: "贡献",
    Donate: "捐赠",
    "Download Now": "立即下载",
    "Latest Release": "最新版本",
    "Upcoming Updates": "即将更新",
    "Install Now": "立即安装",
    Required: "必需",
    Optional: "可选",
    "Add to Favorites": "加入收藏夹",
    "View Details": "查看详情",
    "Related Projects": "相关项目",
    "Related Mods": "相关模组",
    "View All": "查看所有",
    New: "新建",
    Version: "版本",
    Versions: "版本",
    "Link to this page": "链接到此页面",
    "Copy Link": "复制链接",
    Share: "分享",
    "View More": "查看更多",
    Back: "返回",
    "Go Back": "返回",
    Continue: "继续",
    Next: "下一步",
    Previous: "上一页",
    "Cancel Subscription": "取消订阅",
    "Manage Subscription": "管理订阅",
    "Subscribe Now": "立即订阅",
    "Notifications Settings": "通知设置",
    Activate: "激活",
    Deactivate: "停用",
    "Terms and Conditions": "条款与条件",
    "Cookies Policy": "Cookies 政策",
    "Privacy Preferences": "隐私偏好设置",
    "User Agreement": "用户协议",
    "Sign In": "登录",
    "Sign Up": "注册",
    "Forgot Password?": "忘记密码？",
    "Reset Password": "重置密码",
    "Change Email": "更改邮箱",
    "Change Username": "更改用户名",
    "Update Profile": "更新个人资料",
    "Account Settings": "账户设置",
    "Security Settings": "安全设置",
    "Two-factor Authentication": "两步验证",
    "Security Questions": "安全问题",
    "Session Expired": "会话过期",
    "Account Suspended": "账户被暂停",
    "Subscription Expired": "订阅已过期",
    "Confirm Email Address": "确认电子邮件地址",
    "Email Verified": "邮箱已验证",
    Error: "错误",
    Success: "成功",
    Warning: "警告",
    Information: "信息",
    Confirmation: "确认",
    "Action Required": "需要操作",
    Retry: "重试",
    Save: "保存",
    Edit: "编辑",
    Delete: "删除",
    Close: "关闭",
    Description: "描述",
    Tags: "标签",
    Comments: "评论",
    Reviews: "评价",
    Rating: "评分",
    Stars: "星标",
    Members: "成员",
    Projects: "项目",
    Collections: "收藏夹",
    Organizations: "组织",
    Followers: "关注者",
    Following: "正在关注",
    Follow: "关注",
    Unfollow: "取消关注",
    Joined: "加入日期",
    "Last Updated": "最后更新",
    License: "许可证",
    Permissions: "权限",
    Collaborators: "协作者",
    Admin: "管理员",
    Moderator: "版主",
    Member: "成员",
    Guest: "访客",
    Public: "公开",
    Private: "私有",
    Team: "团队",
    Role: "角色",
    Actions: "操作",
    Select: "选择",
    Filter: "筛选",
    Clear: "清除",
    All: "全部",
    Active: "活跃",
    Inactive: "不活跃",
    Online: "在线",
    Offline: "离线",
    Verified: "已验证",
    Pending: "待处理",
    Rejected: "已拒绝",
    Approved: "已批准",
    Blocked: "已阻止",
    Banned: "已封禁",
    Suspended: "已暂停",
    Disabled: "已禁用",
    Enabled: "已启用",
    Visible: "可见",
    Hidden: "隐藏",
    Open: "打开",
    Closed: "关闭",
    Locked: "锁定",
    Unlocked: "解锁",
    Allowed: "允许",
    Forbidden: "禁止",
    Granted: "授予",
    Revoked: "撤销",
    Assigned: "分配",
    Unassigned: "未分配",
    Available: "可用",
    Unavailable: "不可用",
    Installed: "已安装",
    "Not Installed": "未安装",
    Compatible: "兼容",
    Incompatible: "不兼容",
    Supported: "支持",
    Unsupported: "不支持",
    "Required Files": "必需文件",
    "Recommended Files": "推荐文件",
    "Optional Files": "可选文件",
    Dependencies: "依赖项",
    Conflict: "冲突",
    Changelog: "更新日志",
    Gallery: "画廊",
    Channels: "渠道",
    Compatibility: "兼容版本",
    Platforms: "平台",
    Platform: "平台",
    "Supported environments": "运行环境",
    "Client-side": "客户端",
    "Server-side": "服务端",
    "Read more": "阅读更多",
    "See all": "查看全部",
    "Load more": "加载更多",
    Exclude: "排除",
    "More options": "更多选项",
    Report: "举报",
    "Copy ID": "复制ID",
    "Copy permanent link": "复制永久链接",
    Licensed: "许可证 ",
    "Creating a project": "创建项目",
    Name: "名称",
    "Enter project name...": "输入项目名称...",
    Visibility: "可见性",
    "The visibility of your project after it has been approved.":
      "项目审核通过后的可见性。",
    Unlisted: "非公开",
    Summary: "简介",
    "A sentence or two that describes your project.":
      "一句或两句来描述你的项目。",
    "Create project": "创建项目",
    "Creating a collection": "创建收藏夹",
    "Enter collection name...": "输入收藏夹名称...",
    "A sentence or two that describes your collection.":
      "一句或两句来描述你的收藏夹。",
    "Your new collection will be created as a public collection with no projects.":
      "你的新收藏夹将被创建为一个没有项目的公开收藏夹。",
    "Create collection": "创建收藏夹",
    "Creating an organization": "创建组织",
    "Enter organization name...": "输入组织名称...",
    "A sentence or two that describes your organization.":
      "一句或两句来描述你的组织。",
    "You will be the owner of this organization, but you can invite other members and transfer ownership at any time.":
      "你将成为该组织的所有者，但你可以随时邀请其他成员并转让所有权。",
    //Mods页面补全
    "75% of ad revenue goes to creators": "75% 的广告收入归创作者所有",
    "Support creators and Modrinth ad-free with ":
      "通过 Modrinth+ 无广告地支持创作者和 ",
    "Game version": "游戏版本",
    "Search...": "搜索...",
    "Search mods...": "搜索模组...",
    "Search resource packs..": "搜索资源包...",
    "Search data packs...": "搜索数据包...",
    "Search shaders...": "搜索光影包...",
    "Search modpacks...": "搜索整合包...",
    "Search plugins...": "搜索插件...",
    "Show all versions": "显示所有版本",
    Loader: "加载器",
    "Show more": "显示更多",
    "Show fewer": "显示更少",
    Adventure: "冒险",
    Cursed: "鬼畜",
    Decoration: "装饰",
    Economy: "经济",
    Equipment: "装备",
    Food: "食物",
    "Game Mechanics": "游戏机制",
    Library: "库",
    Magic: "魔法",
    Management: "管理",
    Minigame: "小游戏",
    Mobs: "生物",
    Optimization: "优化",
    Social: "社交",
    Storage: "存储",
    Technology: "科技",
    Transportation: "运输",
    Utility: "实用工具",
    "World Generation": "世界生成",
    Environment: "环境",
    "Client or server": "客户端或服务端",
    "Client and server": "客户端和服务端",
    Client: "客户端",
    Server: "服务端",
    "Open source": "开源",
    Updated: "更新于 ",
    yesterday: "昨天",
    "last week": "上周",
    "last month": "上个月",
    "last year": "去年",
    //资源包页面补全
    Combat: "战斗",
    Modded: "修改",
    Realistic: "写实",
    Simplistic: "简洁",
    Themed: "主题",
    Tweaks: "调整",
    "Vanilla-like": "原版风格",
    Audio: "音频",
    Blocks: "方块",
    "Core Shaders": "核心光影",
    Entities: "实体",
    Fonts: "字体",
    Items: "物品",
    Locale: "本地化",
    Models: "模型",
    Resolutions: "分辨率",
    "8x or lower": "8x或更低",
    "512x or higher": "512x或更高",
    //光影包页面补全
    Cartoon: "卡通",
    Fantasy: "幻想",
    "Semi-realistic": "半现实",
    Atmosphere: "大气效果",
    Bloom: "光晕",
    "Colored Lighting": "彩色光照",
    Foliage: "植被",
    "Path Tracing": "路径追踪",
    Reflections: "反射",
    Shadows: "阴影",
    "Performance impact": "性能影响",
    High: "高",
    Low: "低",
    Medium: "中",
    Potato: "土豆",
    Screenshot: "截图",
    //整合包页面补全
    Challenging: "硬核",
    "Kitchen Sink": "水槽",
    Lightweight: "轻量",
    Multiplayer: "多人",
    Quests: "任务",
    //插件页面补全
    Platfrom: "平台",
    //设置页面补全
    "Save changes": "保存更改",
    Display: "显示",
    Appearance: "外观",
    "Color theme": "颜色主题",
    "Select your preferred color theme for Modrinth on this device.":
      "在此设备上为 Modrinth 选择您喜欢的颜色主题。",
    "Sync with system": "与系统同步",
    Light: "浅色",
    Dark: "深色",
    "Project list layouts": "项目列表布局",
    "Select your preferred layout for each page that displays project lists on this device.":
      "为该设备上显示项目列表的每个页面选择您喜欢的布局。",
    Rows: "列表",
    Grid: "网格",
    "Mods page": "模组页面",
    "Plugins page": "插件页面",
    "Data Packs page": "数据包页面",
    "Shaders page": "光影包页面",
    "Resource Packs page": "资源包页面",
    "Modpacks page": "整合包页面",
    "User profile pages": "用户个人资料页面",
    "Toggle features": "切换功能",
    "Advanced rendering": "高级渲染",
    "Open external links in new tab": "在新标签页中打开外部链接",
    "Right-aligned filters sidebar on search pages":
      "搜索页面上右对齐的过滤器侧边栏",
    "Left-aligned sidebar on content pages": "内容页左对齐侧边栏",
    "Enable or disable certain features on this device.":
      "启用或禁用此设备上的某些功能。",
    "Enables advanced rendering such as blur effects that may cause performance issues without hardware-accelerated rendering.":
      "启用高级渲染（例如模糊效果），如果没有硬件加速渲染，可能会导致性能问题。",
    "Make links which go outside of Modrinth open in a new tab. No matter this setting, links on the same domain and in Markdown descriptions will open in the same tab, and links on ads and edit pages will open in a new tab.":
      "让 Modrinth 之外的链接在新标签页中打开。无论此设置如何，同一域名和 Markdown 描述中的链接都会在同一个标​​签页中打开，而广告和编辑页面上的链接则会在新标签页中打开。",
    "Aligns the filters sidebar to the right of the search results.":
      "将过滤器侧边栏与搜索结果的右侧对齐。",
    "Aligns the sidebar to the left of the page's content.":
      "将侧边栏与页面内容左侧对齐。",
    "Manage projects": "管理项目",
    Account: "账户",
    "Public profile": "公开资料",
    "Profile information": "个人资料信息",
    "Your profile information is publicly viewable on Modrinth and through the":
      "您的个人资料信息可在 Modrinth 上以及通过",
    "Modrinth API": " Modrinth API 公开查看",
    "Profile picture": "个人资料头像",
    "Upload image": "上传图片",
    "Remove image": "删除图片",
    "A unique case-insensitive name to identify your profile.":
      "一个不区分大小写的唯一名称，用于标识您的个人资料。",
    Bio: "简介",
    "A short description to tell everyone a little bit about you.":
      "简短的描述，让大家稍微了解一下您。",
    "Changes saved": "保存更改",
    "Account and security": "账户与安全",
    "Account security": "账户安全",
    Email: "电子邮件",
    "Change email": "修改电子邮件",
    "Email address": "电子邮件地址",
    "Enter Your Email Address...": "输入您的电子邮件地址...",
    "Save email": "保存电子邮件",
    "Add password": "添加密码",
    "Save password": "保存密码",
    "Two-factor authentication": "2FA验证",
    "Setup two-factor authentication": "设置2FA验证",
    "Setup 2FA": "设置2FA",
    "Manage authentication providers": "管理身份验证提供程序",
    "Authentication providers": "身份验证提供程序",
    "Manage providers": "管理提供程序",
    Provider: "提供程序",
    Add: "添加",
    Remove: "删除",
    "Data export": "数据导出",
    "Generate export": "生成导出",
    "Delete account": "删除账户",
    "Changes the email associated with your account.":
      "更改与您的帐户关联的电子邮件。",
    "Your account information is not displayed publicly.":
      "您的帐户信息不会公开显示。",
    "Set a permanent password to login to your account.":
      "设置永久密码以登录您的帐户。",
    "New password": "新密码",
    "Confirm new password": "确认新密码",
    "Add an additional layer of security to your account during login.":
      "在登录期间为您的帐户添加额外的安全层。",
    "Two-factor authentication keeps your account secure by requiring access to a second device in order to sign in.":
      "2FA验证要求访问第二台设备才能登录，从而确保您的帐户安全。",
    "Scan the QR code with": "使用",
    ", or any other 2FA app to begin.":
      "或任何其他 2FA 应用扫描二维码即可开始。",
    "If the QR code does not scan, you can manually enter the secret:":
      "如果二维码扫描不出来，可以手动输入密码：",
    "Add or remove sign-on methods from your account, including GitHub, GitLab, Microsoft, Discord, Steam, and Google.":
      "从您的帐户中添加或删除登录方法，包括 GitHub、GitLab、Microsoft、Discord、Steam 和 Google。",
    "Request a copy of all your personal data you have uploaded to Modrinth. This may take several minutes to complete.":
      "请求获取您已上传至 Modrinth 的所有个人数据的副本。这可能需要几分钟才能完成。",
    "Once you delete your account, there is no going back. Deleting your account will remove all attached data, excluding projects, from our servers.":
      "帐户一旦删除，将无法恢复。删除帐户将从我们的服务器中删除所有附加数据（项目除外）。",
    "Authorized apps": "授权应用",
    "You have not authorized any applications.": "您尚未授权任何应用程序。",
    "When you authorize an application with your Modrinth account, you grant it access to your account. You can manage and review access to your account here at any time.":
      "当您使用 Modrinth 帐户授权某个应用程序时，即表示您授予该应用程序访问您帐户的权限。您可以随时在此管理和查看您帐户的访问权限。",
    Sessions: "会话",
    "Here are all the devices that are currently logged in with your Modrinth account. You can log out of each one individually.\n\nIf you see an entry you don't recognize, log out of that device and change your Modrinth account password immediately.":
      "以下是当前使用您的 Modrinth 帐户登录的所有设备。您可以逐个退出。\n\n如果您看到不认识的条目，请立即退出该设备并更改您的 Modrinth 帐户密码。",
    "Current session": "当前会话",
    "Billing and subscriptions": "计费和订阅",
    Subscriptions: "订阅",
    "Manage your Modrinth subscriptions.": "管理您的 Modrinth 订阅",
    "Payment methods": "付款方式",
    "Add payment method": "添加付款方式",
    "View past charges": "查看过去的费用",
    "You have not added any payment methods.": "您尚未添加任何付款方式。",
    "Personal access tokens": "个人访问令牌",
    "Create a PAT": "创建PAT",
    "PATs can be used to access Modrinth's API. For more information, see":
      "PAT 可用于访问 Modrinth 的 API。更多信息请参阅 ",
    "Modrinth's API documentation": "Modrinth 的 API 文档",
    ". They can be created and revoked at any time.":
      "。PAT 可以随时创建和撤销。",
    "Your applications": "您的应用程序",
    "New Application": " 新申请",
    "Applications can be used to authenticate Modrinth's users with your products. For more information, see":
      "应用程序可用于通过您的产品对 Modrinth 的用户进行身份验证。有关更多信息请参阅 ",
    "You don't have any projects.\nWould you like to":
      "您还没有任何项目。您想要",
    "create one": "创建一个吗",
    //仪表板补全
    Overview: "概述",
    "Active reports": "活动报告",
    Manage: "管理",
    "Visit your profile": "访问您的个人资料",
    "You have no unread notifications.": "您没有未读通知。",
    "View notification history": "查看历史消息记录",
    "Total downloads": "总下载量",
    "Total followers": "总关注量",
    "You don't have any unread notifications.": "您没有任何未读通知。",
    Reports: "报告",
    "You don't have any active reports.": "您没有任何活动报告。",
    Views: "浏览量",
    "Refresh the chart": "刷新图表",
    "Download this data as CSV": "将此数据下载为 CSV",
    "Toggle project colors": "切换项目颜色",
    "Previous 30 minutes": "最近30分钟",
    "Previous hour": "最近一小时",
    "Previous 12 hours": "最近12小时",
    "Previous 24 hours": "最近24小时",
    Today: "今天",
    Yesterday: "昨天",
    "This week": "本周",
    "Previous 7 days": "最近7天",
    "This month": "本月",
    "Last month": "上月",
    "Previous 30 days": "最近30天",
    "This quarter": "本季度",
    "Last quarter": "上季度",
    "This year": "今年",
    "Last year": "去年",
    "Previous year": "最近一年",
    "Previous two years": "最近两年",
    "All Time": "全部时间",
    "You don't have any projects yet. Click the green button above to begin.":
      "您还没有任何项目。点击上面的绿色按钮开始。",
    "Create a project": " 创建一个项目",
    "Make an organization!": "创建一个组织！",
    "Create organization": "创建组织",
    "Create new": "新建",
    "Available now": "立即可用",
    "Total pending": "待处理",
    "Available soon": "即将可用",
    "Click to read about how Modrinth handles your revenue.":
      "点击查看 Modrinth 如何处理您的收入。",
    Withdraw: "提现",
    "View transfer history": "查看转账历史",
    "By uploading projects to Modrinth and withdrawing money from your account, you agree to the":
      "通过向 Modrinth 上传项目并从您的帐户中提取资金，即表示您同意",
    "Rewards Program Terms": "奖励计划条款",
    ". For more information on how the rewards system works, see our information page":
      "有关奖励系统运作方式的更多信息，请参阅此处的信息",
    here: "页面",
    "Payout methods": "支付方式",
    "Connect your PayPal account to enable withdrawing to your PayPal balance.":
      "连接您的 PayPal 帐户以启用提现到您的 PayPal 余额。",
    "Sign in with PayPal": " 使用 PayPal 登录 ",
    "Tremendous payments are sent to your Modrinth email. To change/set your Modrinth email, visit":
      "Tremendous的付款将发送到您的 Modrinth 电子邮件。要更改/设置您的 Modrinth 电子邮件，请访问此",
    "Enter your Venmo username below to enable withdrawing to your Venmo balance.":
      "在下方输入您的 Venmo 用户名以启用提现到您的 Venmo 余额。",
    "Save information": "保存信息",
    //News
    Subscribe: "订阅",
    "Subscribe to the Modrinth newsletter": "订阅 Modrinth 新闻",
    "RSS feed": "RSS 订阅",
    "More articles": "更多文章",

    //通知
    "A project you follow": "您关注的项目",
    "has been updated": "已更新",
    Received: "收到",
    View: "查看",
    "more notifications": "更多通知",

    //404
    "Project not found": "未找到项目",
    "Why?": "为什么？",
    "The page you were looking for doesn't seem to exist.":
      "您正在寻找的页面似乎不存在。",
    "You may have mistyped the project's URL.": "您可能输入了项目的错误 URL。",
    "The project's owner may have changed the URL, made the project private, or deleted it.":
      "项目的所有者可能已更改 URL、将项目设为私有或删除了它。",
    "The project may have been taken down by Modrinth's moderation team for violating our":
      "该项目可能已被 Modrinth 管理团队删除，原因是其违反了我们的",

    // 遍历页面内容并替换为翻译
  };

  // 遍历页面内容并替换为翻译
  const translateText = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const originalText = node.textContent.trim();

      // 优先静态翻译
      if (translations[originalText]) {
        node.textContent = translations[originalText];
        return;
      }

      // 处理动态时间（如 "3 days ago"）
      const timeRegex =
        /^(\d+)\s+(minute|hour|day|week|month|year)(?:s?)\s+ago$/i;
      const timeMatch = originalText.match(timeRegex);
      if (timeMatch) {
        const count = timeMatch[1];
        const unit = timeMatch[2].toLowerCase();
        const zhUnit =
          {
            minute: "分钟",
            hour: "小时",
            day: "天",
            week: "周",
            month: "月",
            year: "年",
          }[unit] || unit;
        node.textContent = `${count}${zhUnit}前`;
        return;
      }

      // 处理动态数值（如 "56.13M downloads"）
      const dynamicRegex = /^(\d+\.?\d*)[kKmM] (\w+)$/;
      const dynamicMatch = originalText.match(dynamicRegex);
      if (dynamicMatch) {
        const [_, numberPart, wordPart] = dynamicMatch;
        const translatedWord =
          translations[wordPart.replace(/s$/, "")] || wordPart;
        node.textContent = `${numberPart}${translatedWord}`;
        return;
      }
    }

    // 处理 DOM 元素（含子节点）
    if (node.nodeType === Node.ELEMENT_NODE) {
      // 特殊处理：合并 download + s 的场景
      if (node.classList.contains("stat-label")) {
        const children = Array.from(node.childNodes);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (
            child.nodeType === Node.TEXT_NODE &&
            ["download", "follower"].includes(child.textContent.trim())
          ) {
            const next = children[i + 1];
            if (
              next?.nodeType === Node.ELEMENT_NODE &&
              next.textContent === "s"
            ) {
              child.textContent =
                translations[child.textContent.trim()] ||
                child.textContent.trim();
              next.remove(); // 删除多余的 <span>s</span>
              break;
            }
          }
        }
      }

      // 处理 placeholder 属性
      if (node.hasAttribute("placeholder")) {
        const originalPlaceholder = node.getAttribute("placeholder").trim();
        if (translations[originalPlaceholder]) {
          node.setAttribute("placeholder", translations[originalPlaceholder]);
        }
      }
      // 继续遍历子节点
      for (let child of node.childNodes) {
        translateText(child);
      }
    }
  };

  // 页面加载后开始翻译
  const observer = new MutationObserver(() => {
    translateText(document.body);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 初次加载时立即翻译
  translateText(document.body);
})();
