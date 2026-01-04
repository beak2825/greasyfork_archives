// ==UserScript==
// @name         Telegram UI 中文翻译 (扩展词典 v1.0.7 - 隐私描述文本修正)
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  尝试将 Telegram Web (K/A) 界面中的英文文本翻译成中文 (合并修正, 持续维护)
// @author       AI Assistant / Community
// @match        https://web.telegram.org/k/*
// @match        https://web.telegram.org/a/*
// @grant        GM_info
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534288/Telegram%20UI%20%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%20%28%E6%89%A9%E5%B1%95%E8%AF%8D%E5%85%B8%20v107%20-%20%E9%9A%90%E7%A7%81%E6%8F%8F%E8%BF%B0%E6%96%87%E6%9C%AC%E4%BF%AE%E6%AD%A3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534288/Telegram%20UI%20%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%20%28%E6%89%A9%E5%B1%95%E8%AF%8D%E5%85%B8%20v107%20-%20%E9%9A%90%E7%A7%81%E6%8F%8F%E8%BF%B0%E6%96%87%E6%9C%AC%E4%BF%AE%E6%AD%A3%29.meta.js
// ==/UserScript==

(function() { // <--- 开始自执行函数
    'use strict';

    // --- !!! 完整合并翻译词典 (v1.0.7 - 隐私描述文本修正) !!! ---
    const translations = {
        // === 通用 & 顶部栏 ===
        "Search": "搜索",
        "Send": "发送",
        "Cancel": "取消",
        "Save": "保存",
        "Close": "关闭",
        "Edit": "编辑",
        "Delete": "删除",
        "Loading...": "加载中...",
        "Loading": "加载中",
        "OK": "确定",
        "Retry": "重试",
        "Back": "返回",
        "Done": "完成",
        "Info": "信息",
        "Warning": "警告",
        "Error": "错误",
        "User Info": "用户信息",
        "Message": "消息",
        "Message...": "消息...",
        "Write a message...": "写消息...",
        "Add": "添加",
        "Remove": "移除",
        "Yes": "是",
        "No": "否",
        "Skip": "跳过",
        "Next": "下一步",
        "Previous": "上一步",
        "Connecting...": "连接中...",
        "Connecting": "连接中",
        "Updating...": "更新中...",
        "Updating": "更新中",
        "Syncing": "同步中...",
        "ago": "前",
        "Apply": "应用",
        "Choose": "选择",
        "Upload": "上传",
        "Download": "下载",
        "View": "查看",
        "Show": "显示",
        "Hide": "隐藏",
        "Confirm": "确认",
        "Discard": "放弃",
        "Discard Changes?": "放弃更改？",
        "Confirmation": "确认操作",
        "Are you sure?": "您确定吗？",
        "This action cannot be undone.": "此操作无法撤销。",
        "No results found": "未找到结果",
        "An error occurred. Please try again.": "发生错误，请重试。",
        "Waiting for network...": "等待网络连接...",

        // === 主菜单 (左侧栏) ===
        "Add Account": "添加账号",
        "Saved Messages": "收藏消息",
        "Archived Chats": "归档对话",
        "My Stories": "我的快拍",
        "Contacts": "联系人",
        "Settings": "设置",
        "More": "更多",
        "New Message": "新消息",
        "New Group": "新建群组",
        "New Channel": "新建频道",
        "New Private Chat": "新建私密聊天",
        "Night Mode": "夜间模式",
        "Dark Mode": "深色模式",
        "Disable Dark Mode": "禁用夜间模式",
        "Enable Dark Mode": "启用夜间模式",
        "Animations": "动画效果",
        "Disable Animations": "禁用动画效果",
        "Enable Animations": "启用动画效果",
        "Switch to A version": "切换到 A 版本",
        "Switch to K version": "切换到 K 版本",
        "Telegram Features": "Telegram 功能",
        "Report Bug": "报告问题",
        "Log Out": "退出登录",

        // === 聊天列表 & 聊天视图 & 右键菜单 ===
        "online": "在线",
        "typing": "正在输入",
        "recording voice message": "正在录制语音",
        "recording video message": "正在录制视频消息",
        "uploading photo": "正在上传照片",
        "uploading video": "正在上传视频",
        "uploading document": "正在上传文件",
        "Select Messages": "选择消息",
        "Forward": "转发",
        "Reply": "回复",
        "Edit": "编辑",
        "Translate": "翻译",
        "Pin": "置顶",
        "Unpin": "取消置顶",
        "Mute": "静音",
        "Unmute": "取消静音",
        "Mute forever": "永久静音",
        "Mute for 1 hour": "静音 1 小时",
        "Mute for 8 hours": "静音 8 小时",
        "Mute for 2 days": "静音 2 天",
        "Enable Notifications": "开启通知",
        "Disable Notifications": "关闭通知",
        "Clear History": "清空历史记录",
        "Block User": "屏蔽用户",
        "Block user": "屏蔽用户",
        "BLOCK USER": "屏蔽用户",
        "Are you sure you want to block": "您确定要屏蔽",
        "Unblock User": "取消屏蔽",
        "Unblock user": "取消屏蔽",
        "Report": "举报",
        "Leave Group": "离开群组",
        "Leave Channel": "离开频道",
        "Return to channel": "返回频道",
        "Join Channel": "加入频道",
        "Join Group": "加入群组",
        "View Group Info": "查看群组信息",
        "View Channel Info": "查看频道信息",
        "Share contact": "分享联系人",
        "Gift Premium": "赠送 Premium",
        "Delete Chat": "删除对话",
        "Delete": "删除",
        "Copy": "复制",
        "Copy Link": "复制链接",
        "Copy Username": "复制用户名",
        "Copy Phone Number": "复制手机号",
        "Copy Selected Text": "复制选中文本",
        "Select": "选择",
        "Select All": "全选",
        "Clear Selection": "取消选择",
        "mention": "提及",
        "GIF": "动图",
        "GIFs": "动图",
        "Sticker": "贴纸",
        "Stickers": "贴纸",
        "edited": "已编辑",
        "Open in new tab": "在新标签页打开",
        "Mark as Unread": "标记为未读",
        "Mark as Read": "标记为已读",
        "Unarchive": "取消归档",
        "Archive": "归档",
        "Pinned Message": "置顶消息",
        "Scroll to bottom": "滚动到底部",
        "Attach File": "附加文件",
        "Record Voice Message": "录制语音消息",
        "Record Video Message": "录制视频消息",
        "Choose Emoji": "选择表情符号",
        "Choose Sticker": "选择贴纸",
        "Choose GIF": "选择动图",
        "Search in Chat": "在聊天中搜索",
        "View Pinned Messages": "查看置顶消息",
        "React": "回应",
        "View Reactions": "查看回应",
        "Seen by": "已阅者",
        "Replies": "回复",
        "Message deleted": "消息已删除",
        "Photo": "照片",
        "Photos": "照片",
        "Video": "视频",
        "Videos": "视频",
        "Document": "文件",
        "Documents": "文件",
        "File": "文件",
        "Files": "文件",
        "Link": "链接",
        "Links": "链接",
        "Audio": "音频",
        "Music": "音乐",
        "Voice": "语音",
        "Voice Message": "语音消息",
        "Voice Messages": "语音消息", // <<< 用于隐私设置页面标题

        // === 联系人/群组/频道信息面板 & 添加联系人 ===
        "User Info": "用户信息",
        "Info": "信息",
        "Notifications": "通知",
        "Phone": "电话",
        "Username": "用户名", // Label in info panel & Proxy setting & Edit section title
        "Bio": "简介", // Label in info panel & Privacy Page Title & Edit section title
        "Shared Media": "共享媒体",
        "Media": "媒体",
        "Saved": "已保存", // Shared Media Tab
        "Files": "文件",
        "Links": "链接",
        "Music": "音乐",
        "Voice": "语音",
        "Members": "成员",
        "Subscribers": "订阅者",
        "Administrators": "管理员",
        "Add Member": "添加成员",
        "Add Members": "添加成员",
        "Add Subscriber": "添加订阅者",
        "View Members": "查看成员",
        "View Subscribers": "查看订阅者",
        "Edit Contact": "编辑联系人",
        "Share Contact": "分享联系人",
        "Delete Contact": "删除联系人",
        "Add Contact": "添加联系人",
        "Add to Contacts": "添加到联系人",
        "Start secret chat": "开始加密对话",
        "Secret Chat": "加密对话",
        "Call": "呼叫",
        "Video Call": "视频通话",
        "Common Groups": "共同群组",
        "Invite Link": "邀请链接",
        "Create Invite Link": "创建邀请链接",
        "Revoke Link": "撤销链接",
        "Copy Invite Link": "复制邀请链接",
        "Permissions": "权限",
        "Recent Actions": "最近操作",
        "Slow Mode": "慢速模式",
        " seconds": " 秒",
        " minute": " 分钟",
        " hour": " 小时",
        "Chat History for New Members": "新成员聊天记录",
        "Visible": "可见",
        "Hidden": "隐藏",
        "Boost Channel": "为频道助力",
        "Boosts": "助力值",

        // === 编辑联系人/个人资料/群组/频道 ===
        "Edit Profile": "编辑个人资料", // Page title
        "Edit Group": "编辑群组",
        "Edit Channel": "编辑频道",
        "First name (required)": "名字 (必填)",
        "Last name (optional)": "姓氏 (选填)",
        "Username (optional)": "用户名 (选填)", // Username Input Label
        "Name": "名字",
        "First Name": "名字",
        "Last Name": "姓氏",
        "Set Profile Photo": "设置头像",
        "Upload Photo": "上传照片",
        "Take Photo": "拍摄照片",
        "Choose from Gallery": "从相册选择",
        "Remove Photo": "移除照片",
        "Choose Username": "设置用户名",
        "Change Phone Number": "更换手机号码",
        "Description": "描述",
        "Group Type": "群组类型",
        "Public Group": "公开群组",
        "Private Group": "私密群组",
        "Channel Type": "频道类型",
        "Public Channel": "公开频道",
        "Private Channel": "私密频道",
        "Public Link": "公开链接",
        "Bio (optional)": "简介 (选填)", // <<< Bio 输入框标签
        "Any details such as age, occupation or city.": "个性签名，可以填写年龄、职业、城市等。", // <<< Bio 下描述1
        "Example: 23 y.o. designer from San Francisco": "例如：23岁 设计师 来自旧金山", // <<< Bio 下描述2
        "You can choose a username on Telegram. If you do, people will be able to find you by this username and contact you without needing your phone number.": "您可以在 Telegram 上选择一个用户名。如果您设置了用户名，人们将能够通过此用户名找到您并与您联系，而无需知道您的手机号码。", // <<< Username 下描述1
        "You can use a-z, 0-9 and underscores. Minimum length is 5 characters.": "您可以使用 a-z、0-9 和下划线。最小长度为 5 个字符。", // <<< Username 下描述2
        "This username is available.": "此用户名可用。",
        "This username is already taken.": "此用户名已被占用。",
        "Username must be at least 5 characters long.": "用户名必须至少包含 5 个字符。",

        // === 设置主页 ===
        "Settings": "设置",
        "General Settings": "通用设置",
        "Notifications and Sounds": "通知和声音",
        "Data and Storage": "数据和存储",
        "Privacy and Security": "隐私和安全",
        "Chat Settings": "聊天设置",
        "Appearance": "外观",
        "Chat Background": "聊天背景",
        "Chat Folders": "对话文件夹",
        "Stickers and Emoji": "贴纸和表情",
        "Language": "语言",
        "Devices": "设备",
        "Active Sessions": "活动会话",
        "Telegram Premium": "Telegram Premium",
        "Premium Gifting": "Premium 赠送",
        "Gift": "赠送",
        "Ask a Question": "提问",
        "Telegram FAQ": "Telegram 常见问题",
        "Privacy Policy": "隐私政策",
        "Terms of Service": "服务条款",
        "Version": "版本",
        "English": "英语",

        // === 设置 - 通知和声音 ===
        "Notifications and Sounds": "通知和声音",
        "Show Notifications From": "显示通知来自",
        "All Accounts": "所有账号",
        "Current Account Only": "仅当前账号",
        "Turn this off if you want to receive notifications only from the account you are currently using.": "关闭后，您将仅收到当前正在使用的账号的通知。",
        "Private Chats": "私聊",
        "Notifications for private chats": "私聊通知",
        "Message Preview": "消息预览",
        "Show Sender Name": "显示发送者姓名",
        "Show Message Text": "显示消息内容",
        "Groups": "群组",
        "Notifications for groups": "群组通知",
        "Channels": "频道",
        "Notifications for channels": "频道通知",
        "Stories": "快拍",
        "Notifications for stories": "快拍通知",
        "Calls": "通话",
        "Notifications for calls": "通话通知",
        "Other": "其他",
        "Contact joined Telegram": "联系人加入 Telegram",
        "Pinned messages": "置顶消息通知",
        "In-App Sounds": "应用内声音",
        "In-App Vibrate": "应用内振动",
        "In-App Preview": "应用内预览",
        "Notification Sound": "通知提示音",
        "Importance": "重要程度",
        "Reset All Notifications": "重置所有通知设置",

        // === 设置 - 数据和存储 ===
        "Data and Storage": "数据和存储",
        "Storage Usage": "存储空间使用情况",
        "Calculating...": "计算中...",
        "Clear Cache": "清除缓存",
        "Telegram Cache": "Telegram 缓存",
        "Database": "本地数据库",
        "Keep Media": "媒体文件保留期限",
        "Forever": "永久",
        "1 week": "1 周",
        "1 month": "1 个月",
        "3 months": "3 个月",
        "Network Usage": "网络使用情况",
        "Mobile Data": "移动数据",
        "Wi-Fi": "Wi-Fi",
        "Roaming": "漫游",
        "Total": "总计",
        "Sent": "已发送",
        "Received": "已接收",
        "Reset Statistics": "重置统计数据",
        "Automatic Media Download": "自动下载媒体",
        "Automatic media download": "自动下载媒体",
        "Auto-Download Media": "自动下载媒体",
        "Using Mobile Data": "使用移动数据时",
        "Using Wi-Fi": "使用 Wi-Fi 时",
        "When Roaming": "漫游时",
        "Photos": "照片",
        "Videos": "视频",
        "Files": "文件",
        "On in all chats": "在所有聊天中开启",
        "Up to": "最大",
        "in all chats": "在所有聊天中",
        "Reset Auto-Download Settings": "重置自动下载设置",
        "Voice messages are tiny, so they're always downloaded automatically.": "语音消息很小，始终会自动下载。",
        "Auto-play media": "自动播放媒体",
        "GIFs": "动图",
        "Stream Videos": "流式传输视频",
        "Stream Audio Files": "流式传输音频文件",
        "Download Path": "下载路径",
        "Connection Type": "连接类型",
        "Proxy": "代理",
        "Use Proxy": "使用代理",
        "Proxy Settings": "代理设置",
        "Add Proxy": "添加代理",
        "SOCKS5": "SOCKS5",
        "MTProto": "MTProto",
        "Server": "服务器",
        "Port": "端口",
        "Secret": "密钥",
        "Use proxy for calls": "通话使用代理",

        // === 设置 - 隐私和安全 ===
        "Privacy and Security": "隐私和安全",
        "Privacy": "隐私",
        "Blocked Users": "已屏蔽用户",
        "Phone Number": "手机号码",
        "Last Seen & Online": "最后上线及在线状态",
        "Profile Photos": "头像",
        "Forwarded Messages": "转发消息",
        "Calls": "通话",
        "Groups & Channels": "群组和频道",
        "Groups and Channels": "群组和频道",
        "Voice Messages": "语音消息", // Menu item & Page Title
        "Video Messages": "视频消息",
        "Bio": "简介", // Menu item & Page Title
        "Messages": "消息",
        "Who can see my phone number?": "谁可以看到我的手机号码？",
        "Nobody": "不允许任何人", // Privacy option
        "My Contacts": "我的联系人", // Privacy option
        "Everybody": "允许所有人", // Privacy option
        "Who can find me by my number?": "谁能通过手机号找到我？",
        "Who can see my Last Seen time?": "谁可以看到我的最后上线时间？",
        "Who can see my profile photos?": "谁可以看到我的头像？",
        "Who can see my bio?": "谁可以看到我的简介？",
        "Who can forward my messages?": "谁可以转发我的消息？", // Menu Item Title
        "Who can add a link to my account when forwarding my messages?": "谁可以在转发我的消息时添加指向我账号的链接？", // Question under Forwarded Messages
        "Who can call me?": "谁可以呼叫我？",
        "Peer-to-Peer": "点对点连接 (用于通话)",
        "Never": "从不",
        "Who can add me to group chats?": "谁可以拉我进群聊？",
        "Who can send me voice or video messages?": "谁可以向我发送语音或视频消息？",
        "You can restrict who can send you voice or video messages with granular precision.": "您可以精确地限制谁能向您发送语音或视频消息。",
        "Who can send me messages?": "谁可以向我发送消息？",
        "Change who can send you messages.": "更改谁可以向您发送消息。",
        "Contacts and Premium": "联系人和 Premium 用户",
        "Charge for Messages": "收费消息",
        "You can restrict messages from users who are not in your contacts and don't have Premium.": "您可以限制非联系人且没有 Premium 的用户向您发送消息。",
        "What is Telegram Premium?": "什么是 Telegram Premium？",
        "Exceptions": "例外情况",
        "Always Share With": "总是允许",
        "Never Share With": "从不允许",
        "Always Allow": "总是允许", // Exception list title
        "Never Allow": "从不允许", // Exception list title
        "Add Users": "添加用户",
        "Add Users...": "添加用户...",
        "Add Groups": "添加群组",
        "Add exceptions": "添加例外",
        "Remove User": "移除用户",
        "Remove Group": "移除群组",
        "Example": "示例",
        "You can add users or entire groups as exceptions that will override the settings above.": "您可以添加用户或整个群组为例外，这将覆盖上述设置。",
        "Hide Read Time": "隐藏阅读时间",
        "Hide the time when you read messages from people who can't see your last seen. If you turn this on, their read time will also be hidden from you (unless you are a Premium user).": "对无法看到您最后上线时间的用户隐藏您的消息阅读时间。开启后，您也将无法看到他们的阅读时间（除非您是 Premium 用户）。",
        "This setting does not affect group chats.": "此设置不影响群组聊天。",
        "Subscribed to Telegram Premium": "已订阅 Telegram Premium",
        "Because you are a Telegram Premium subscriber, you will see the last seen and read time of all users who are sharing it with you – even if you are hiding yours.": "因为您是 Telegram Premium 订阅者，您将能看到所有与您分享状态的用户的最后上线和已读时间 - 即使您隐藏了自己的状态。",
        "You can restrict who can see your phone number with granular precision.": "您可以精确地限制谁能看到您的手机号码。",
        "Users who add your number to their contacts will see it on Telegram only if they are your contacts.": "将您的号码添加到通讯录的用户只有在他们是您联系人的情况下才能在 Telegram 上看到它。",
        "You can restrict who can see your profile photo with granular precision.": "您可以精确地限制谁能看到您的头像。",
        "You can restrict who can see the bio on your profile with granular precision.": "您可以精确地限制谁能看到您个人资料上的简介。", // Description under Bio setting
        "You can restrict who can call you with granular precision.": "您可以精确地限制谁能给您打电话。",
        "You can restrict who can add a link to your account when forwarding your messages.": "您可以限制在转发您的消息时谁可以添加指向您账号的链接。", // Description Text
        "You can restrict who can add you to groups and channels with granular precision.": "您可以精确地限制谁能将您添加到群组和频道。",
        "Security": "安全",
        "Passcode Lock": "密码锁",
        "Turn Passcode On": "启用密码锁",
        "Turn Passcode Off": "关闭密码锁",
        "Change Passcode": "更改密码",
        "Auto-Lock": "自动锁定",
        "If inactive for": "如果无活动超过",
        "1 minute": "1 分钟",
        "5 minutes": "5 分钟",
        "1 hour": "1 小时",
        "5 hours": "5 小时",
        "Show content in notifications": "在通知中显示内容",
        "Two-Step Verification": "两步验证",
        "Set Additional Password": "设置两步验证密码",
        "Change Password": "更改密码",
        "Disable Password": "关闭密码",
        "Set Recovery Email": "设置恢复邮箱",
        "Change Recovery Email": "更改恢复邮箱",
        "Active Sessions": "活动会话",
        "Manage your sessions on all your devices.": "管理您所有设备上的登录会话。",
        "Terminate All Other Sessions": "终止所有其他会话",
        "Logs out all devices except for this one.": "登出除当前设备外的所有其他设备。",
        "Terminate Session": "终止会话",
        "This device": "本设备",
        "Current Session": "当前会话",
        "Last active": "上次活动",
        "IP Address": "IP 地址",
        "Location": "位置",
        "Device": "设备",
        "App": "应用",
        "Terminate": "终止",
        "Data Settings": "数据设置",
        "Sync Contacts": "同步联系人",
        "Delete Synced Contacts": "删除已同步联系人",
        "Suggest Frequent Contacts": "建议常用联系人",
        "Secret Chats": "加密对话",
        "Delete My Account": "删除我的账号",
        "If away for": "如果离线时间超过",
        "6 months": "6 个月",
        "1 year": "1 年",
        "Delete Account Now": "立即删除账号",
        "Are you sure you want to delete your account?": "您确定要删除您的账号吗？",
        "Advanced": "高级",
        "New chats from unknown users": "来自未知用户的消息",
        "Archive and Mute": "归档并静音",
        "Automatically archive and mute new chats, groups and channels from non-contacts.": "自动归档并静音来自非联系人的新私聊、群组和频道。",
        "Sensitive Content": "敏感内容",
        "Disable filtering": "禁用过滤",
        "Show Sensitive Content": "显示敏感内容",
        "Do not hide media that contains content suitable only for adults.": "显示可能包含敏感内容的媒体。",
        "Payments": "支付",
        "Clear Payment and Shipping Info": "清除支付和配送信息",
        "You can delete your shipping info and instruct all payment providers to remove your saved credit cards. Note that Telegram never stores your credit card data.": "您可以删除配送信息并指示所有支付提供商移除您保存的信用卡。请注意，Telegram 从不存储您的信用卡数据。",
        "Bots and Websites": "机器人和网站",
        "Logged In With Telegram": "通过 Telegram 登录",
        "Clear All Cloud Drafts": "清除所有云端草稿",
        // --- v1.0.7 新增/修正 ---
        "Unless you are a Premium user, you won't see Last Seen or Online statuses for people with whom you don't share yours. Approximate times will be shown instead (recently, within a week, within a month).": "除非您是 Premium 用户，否则您将无法看到未与您分享状态的人的最后上线或在线状态。系统将仅显示大致时间（例如：最近、一周内、一个月内）。",
        "Subscribe to Telegram Premium": "订阅 Telegram Premium",
        "If you subscribe to Premium, you will see other users' last seen and read time even if you hid yours from them (unless they specifically restricted it).": "如果您订阅 Premium，即使您对其他用户隐藏了自己的状态，您仍能看到他们的最后上线和消息阅读时间（除非他们明确限制了您）。",
        "Disabling peer-to-peer will relay all calls through Telegram servers to avoid revealing your IP address, but may slightly decrease audio and video quality.": "禁用点对点连接将通过 Telegram 服务器转发所有通话，以避免暴露您的 IP 地址，但这可能会略微降低音频和视频质量。",
        "Subscribe to Telegram Premium to restrict who can send you voice or video messages.": "订阅 Telegram Premium 以限制谁可以向您发送语音或视频消息。",
        // --- End v1.0.7 ---

        // === 设置 - 常规/外观/聊天设置 ===
        "General": "通用",
        "Chat Settings": "聊天设置",
        "Appearance": "外观",
        "Message Text Size": "消息字号",
        "px": "像素",
        "Chat Wallpaper": "聊天背景",
        "Choose from Photos": "从照片选择",
        "Set a Color": "设置颜色",
        "Reset Chat Backgrounds": "重置聊天背景",
        "Color Theme": "颜色主题",
        "Theme": "主题",
        "Classic": "经典",
        "Day": "日间",
        "Night": "夜间",
        "Tinted": "彩色",
        "Dark": "深色",
        "System Default": "系统默认",
        "Auto-Night Mode": "自动夜间模式",
        "Scheduled": "定时切换",
        "Adaptive": "根据屏幕亮度",
        "From": "从",
        "To": "到",
        "Use System Dark Mode": "使用系统深色模式",
        "Enable Animations": "启用动画效果",
        "Large Emoji": "大号表情符号",
        "Raise to Speak": "抬起说话",
        "Raise to Listen": "抬起收听",
        "Send by Enter": "按 Enter键 发送",
        "New line by Shift + Enter": "按 Shift + Enter 换行",
        "Send by Ctrl + Enter": "按 Ctrl + Enter 发送",
        "New line by Enter": "按 Enter键 换行",
        "Time Format": "时间格式",
        "12-hour": "12 小时制",
        "24-hour": "24 小时制",
        "Saving settings...": "正在保存设置...",
        "Settings saved.": "设置已保存。",

        // === 设置 - 对话文件夹 ===
        "Chat Folders": "对话文件夹",
        "Create folders for different groups of chats and quickly switch between them.": "为不同的对话组创建文件夹，以便快速切换。",
        "Create New Folder": "创建新文件夹",
        "Create Folder": "创建文件夹",
        "Edit Folder": "编辑文件夹",
        "Delete Folder": "删除文件夹",
        "Folder Name": "文件夹名称",
        "Included Chats": "包含的对话",
        "Excluded Chats": "排除的对话",
        "Add Chats": "添加对话",
        "Select Chat Type": "选择对话类型",
        "Contacts": "联系人",
        "Non-Contacts": "非联系人",
        "Bots": "机器人",
        "Muted": "已静音",
        "Unmuted": "未静音",
        "Read": "已读",
        "Unread": "未读",
        "Archived": "已归档",
        "All Chats": "所有对话",
        "Recommended Folders": "推荐文件夹",
        "Personal": "个人",
        "Folders view": "文件夹视图",
        "Folders on the Left": "文件夹在左侧",
        "Folders above chats": "文件夹在对话上方",

        // === 设置 - 贴纸和表情 (Stickers and Emoji) ===
        "Stickers and Emoji": "贴纸和表情",
        "Stickers": "贴纸",
        "Trending Stickers": "热门贴纸",
        "Archived Stickers": "归档贴纸",
        "Masks": "面具",
        "Featured Stickers": "精选贴纸",
        "Installed Sticker Sets": "已安装贴纸包",
        "Share": "分享",
        "View Pack": "查看贴纸包",
        "Stickers by": "贴纸作者：",
        "Suggest Stickers by Emoji": "通过表情符号建议贴纸",
        "Loop Animated Stickers": "循环播放动态贴纸",
        "Animated stickers will play continuously in chats.": "动态贴纸将在聊天中持续播放。",
        "Emoji": "表情符号",
        "Emoji Statuses": "表情符号状态",
        "Custom Emoji": "自定义表情符号",
        "Emoji Packs": "表情符号包",
        "Suggest Emoji": "建议表情符号",
        "Quick Reaction": "快速回应",
        "Default Reaction": "默认回应表情",
        "Change Default Reaction": "更改默认回应表情",
        "Dynamic Pack Order": "动态排序贴纸包",
        "Automatically place recently used sticker packs at the front of the panel.": "自动将最近使用的贴纸包置于面板顶部。",

        // === 设置 - 语言 ===
        "Language": "语言",

        // === 设置 - 值/选项/通用按钮 ===
        "None": "无",
        "Off": "关闭",
        "On": "开启",
        "Enabled": "已启用",
        "Disabled": "已禁用",
        "Allow": "允许",
        "Deny": "拒绝",
        "user": "名用户",
        "users": "名用户",
        "member": "名成员",
        "members": "名成员",
        "subscriber": "名订阅者",
        "subscribers": "名订阅者",
        "admin": "名管理员",
        "admins": "名管理员",
        "bot": "个机器人",
        "bots": "个机器人",
        "chat": "个对话",
        "chats": "个对话",
        "channel": "个频道",
        "channels": "个频道",
        "group": "个群组",
        "groups": "个群组",
        "photo": "张照片",
        "photos": "张照片",
        "video": "个视频",
        "videos": "个视频",
        "file": "个文件",
        "files": "个文件",
        "link": "条链接",
        "links": "条链接",
        "message": "条消息",
        "messages": "条消息",
        "sticker": "张贴纸",
        "stickers": "张贴纸",

        // === Premium 弹窗/相关 ===
        "Telegram Premium": "Telegram Premium",
        "Unlock Premium Features": "解锁 Premium 功能",
        "Subscribe": "订阅", // Button text
        "Subscribed": "已订阅",
        "Monthly": "按月",
        "Yearly": "按年",
        "Save": "节省",
        "Gift Premium": "赠送 Premium",
        "Gift": "赠送",
        "You are all set!": "一切就绪！",
        "Thank you for subscribing to Telegram Premium.": "感谢您订阅 Telegram Premium。",
        "Here's what is now unlocked.": "以下是您已解锁的功能。",
        "Stories": "快拍",
        "Unlimited posting, priority order, stealth mode, permanent view history and more.": "无限发布、优先排序、隐身模式、永久查看历史等。",
        "Stealth Mode": "隐身模式",
        "Permanent View History": "永久查看历史",
        "Priority Order": "优先排序",
        "Unlimited Cloud Storage": "无限云存储",
        "4 GB Upload Size": "4 GB 文件上传",
        "4 GB per each document, unlimited storage for your chats and media overall.": "单个文件最高 4 GB，您的聊天和媒体拥有无限的整体存储空间。",
        "Doubled Limits": "双倍上限",
        "Up to 1000 channels, 30 folders, 10 pins, 20 public links and more.": "最多 1000 个频道、30 个文件夹、10 个置顶对话、20 个公开链接等。",
        "Channels and Chats": "频道和对话",
        "Folders": "文件夹",
        "Pinned Chats": "置顶对话",
        "Public Links": "公开链接",
        "Favorite Stickers": "收藏贴纸",
        "Saved GIFs": "保存的 GIF",
        "Last Seen Times": "最后上线时间",
        "Last Seen & Read Time": "最后上线和阅读时间",
        "View the last seen and read times of others even if you hide yours.": "即使您隐藏了自己的最后上线和已读时间，也能查看分享状态的他人的时间。",
        "Voice-to-Text Conversion": "语音转文本",
        "Ability to read the transcript of any incoming voice message.": "能够阅读任何收到的语音消息的文本转录。",
        "Transcription": "转录文本",
        "Faster Download Speed": "更快的下载速度",
        "Faster Downloads": "更快的下载速度",
        "No more limits on the speed with which media and documents are downloaded.": "媒体和文件的下载速度将无限制。",
        "Increased download speed for media and documents.": "提升媒体和文件的下载速度。",
        "Real-Time Translation": "实时翻译",
        "Real-time translation of chats and channels into other languages.": "实时翻译聊天和频道内容至其他语言。",
        "Animated Emoji": "动态表情符号",
        "Include animated emoji from different packs in any message you send.": "在你发送的任何消息中包含来自不同表情包的动态表情符号。",
        "Emoji Statuses": "表情符号状态",
        "Choose from thousands of emoji to display current activity next to your name.": "从数千种表情符号中选择，以在你的名字旁边显示当前活动状态。",
        "Tags for Messages": "消息标签",
        "Organize your Saved Messages with tags for quicker access.": "使用标签整理你的收藏消息以便更快访问。",
        "Name and Profile Colors": "名字和个人资料颜色",
        "Choose a color and logo for your profile and replies to your messages.": "为您的个人资料和消息回复选择颜色和图标。",
        "Wallpapers for Both Sides": "为双方设置壁纸",
        "Set custom wallpapers for you and your chat partner.": "为你和你的聊天伙伴设置自定义壁纸。",
        "Set different chat backgrounds for you and your chat partners.": "为你和你的聊天对象设置不同的聊天背景。",
        "Profile Badge": "个人资料徽章",
        "An exclusive badge next to your name showing that you subscribe to Telegram Premium.": "一个显示您已订阅 Telegram Premium 的专属徽章将出现在您的名字旁边。",
        "Message Privacy": "消息隐私",
        "Limit messages from strangers or charge for incoming messages.": "限制陌生人消息或对收到的消息收费。",
        "Advanced Chat Management": "高级对话管理",
        "Tools to set default folder, auto-archive and hide new chats.": "设置默认文件夹、自动归档和隐藏新对话的工具。",
        "Default Folder": "默认文件夹",
        "Auto-Archive": "自动归档",
        "No Ads": "无广告",
        "No more ads in public channels where Telegram sometimes shows ads.": "Telegram 有时会在公开频道展示的广告将不再显示。",
        "Sponsored messages in public channels will no longer be shown.": "公开频道中的赞助消息将不再显示。",
        "Infinite Reactions": "无限回应",
        "React with thousands of emoji – with multiple reactions per message.": "使用数千种表情符号回应——每条消息可添加多个回应。",
        "Premium Reactions": "Premium 回应",
        "Exclusive Reactions": "专属回应",
        "Animated Profile Pictures": "动态头像",
        "Animated Avatars": "动态头像",
        "Animated Userpics": "动态头像",
        "Video avatars animated in chat lists and chats to allow for additional self-expression.": "视频头像在聊天列表和对话中播放动画，提供更多自我表达方式。",
        "Premium Stickers": "Premium 贴纸",
        "Exclusive Stickers": "专属贴纸",
        "Exclusive enlarged stickers featuring additional effects, updated monthly.": "独家放大贴纸，具有额外效果，每月更新。",
        "Premium Support": "优先支持",
        "App Icons": "应用图标",
        "Your Premium Subscription is active.": "您的 Premium 订阅有效。",
        "It expires on": "到期时间：",
        "The subscription was anonymously gifted to you.": "此订阅是匿名赠送给您的。",
        "NEW": "新",
        //"What is Telegram Premium?": "什么是 Telegram Premium？", // Already exists
        "Learn More": "了解更多",
        //"OK": "确定", // Already exists
        //"Done": "完成", // Already exists

        // --- 静态部分 & 动态状态/日期词典 ---
        "last seen": "上次在线",
        "online": "在线",
        "typing": "正在输入",
        "recently": "刚刚",
        "just now": "刚刚",
        "yesterday": "昨天",
        "today": "今天",
        "within a week": "一周内",
        "within a month": "一个月内",
        "a long time ago": "很久以前",
        "at": "于",
        "on": "于",
        "in": "在",
        "minute": "分钟",
        "minutes": "分钟",
        "hour": "小时",
        "hours": "小时",
        "day": "天",
        "days": "天",
        "week": "周",
        "weeks": "周",
        "month": "个月",
        "months": "个月",
        "year": "年",
        "years": "年",
        "Monday": "周一", "Tuesday": "周二", "Wednesday": "周三",
        "Thursday": "周四", "Friday": "周五", "Saturday": "周六", "Sunday": "周日",
        "Mon": "周一", "Tue": "周二", "Wed": "周三", "Thu": "周四", "Fri": "周五", "Sat": "周六", "Sun": "周日",
        "Jan": "1月", "January": "一月",
        "Feb": "2月", "February": "二月",
        "Mar": "3月", "March": "三月",
        "Apr": "4月", "April": "四月",
        "May": "5月",
        "Jun": "6月", "June": "六月",
        "Jul": "7月", "July": "七月",
        "Aug": "8月", "August": "八月",
        "Sep": "9月", "September": "九月",
        "Oct": "10月", "October": "十月",
        "Nov": "11月", "November": "十一月",
        "Dec": "12月", "December": "十二月",
        "AM": "上午",
        "PM": "下午",

        // === 登录/注册流程 ===
        "Log in to Telegram": "登录 Telegram",
        "Scan QR Code": "扫描二维码",
        "Log in by Phone Number": "通过手机号登录",
        "Your Phone Number": "您的手机号码",
        "Country": "国家/地区",
        "Code": "验证码",
        "Phone Code": "手机验证码",
        "Password": "密码",
        "Please enter your phone number.": "请输入您的手机号码。",
        "Please enter the code we sent to your Telegram app.": "请输入我们发送到您 Telegram 应用内的验证码。",
        "Please enter the code we sent via SMS.": "请输入我们通过短信发送的验证码。",
        "Send code via SMS": "通过短信发送验证码",
        "Sent code to your Telegram app": "验证码已发送至您的 Telegram 应用",
        "Incorrect code.": "验证码错误。",
        "Phone number incorrect.": "手机号码错误。",
        "Too many attempts. Please try again later.": "尝试次数过多，请稍后再试。",
        "Enter Password": "输入密码",
        "Forgot Password?": "忘记密码？",
        "Check your email": "检查您的邮箱",

        // === 其他可能遗漏 ===
        "Bot": "机器人",
        "Channel": "频道",
        "Group": "群组",
        "Supergroup": "超级群组",
        "Select chat": "选择对话",
        "Forward to": "转发给",
        "Search Messages": "搜索消息",
        "Search Chats": "搜索对话",
        "Search Users": "搜索用户",
        "Send Message": "发送消息",
        "Send Media": "发送媒体",
        "Send Stickers & GIFs": "发送贴纸和动图",
        "Embed Links": "嵌入链接",
        "Change Chat Info": "更改群组/频道信息",

    }; // <--- 词典对象结束

    // --- 翻译核心逻辑 (v1.0.7 - 基于 v1.0.6) ---
    const translatedMark = 'data-ui-translated-v107'; // 更新标记 v1.0.7
    const inputSelector = 'div.input-message-input[contenteditable="true"]';
    const dateSeparatorSelector = '.chat-history .DateSeparator, .chat-history .chat-date, .chat-history .sticky-date';
    const chatListDateSelector = '.chat-list .chat-item-meta .date span, .chat-list .chat-item-meta .date div';
    const stickerCountSelector = '.sticker-set-info .sticker-count';
    const exceptionCountSelector = '.settings-section .section-item-subtitle.text-muted, .settings-value .text-muted';
    const descriptionSelector = '.settings-section .form-text.text-muted, .settings-section .text-muted:not(.section-item-subtitle):not(.settings-value), .settings-section .ListItem-description'; // General selector for descriptions

    // Helper function to check if a node or its ancestors match a selector
    function doesNodeMatchOrHaveAncestor(node, selector) {
        if (!node || !selector) return false;
        if (node.nodeType === Node.DOCUMENT_NODE || !node.parentElement) return false;
        let checkNode = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (!checkNode) return false;
        if (checkNode.nodeType === Node.ELEMENT_NODE && typeof checkNode.matches === 'function' && checkNode.matches(selector)) return true;
        return checkNode.parentElement?.closest(selector) !== null;
    }


    function translateTextNode(node) {
        if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue || !node.nodeValue.trim()) {
            return;
        }

        const parent = node.parentElement;
        if (!parent) return;

        const parentMark = parent.getAttribute(translatedMark);
        if (parentMark === 'true') return; // Already fully translated statically

        const tagName = parent.tagName?.toUpperCase();
        if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'TEXTAREA' || parent.isContentEditable) {
            if (!parent.matches(inputSelector)) return;
        }

        // Exclusion logic simplified: Check if inside known untranslatable containers UNLESS it's a specific known description element
        const closestExcludedAncestor = parent.closest?.(
             '.message.bubble .message-content-wrapper,' +
             '.sticker-set-name, .sticker-pack-title,' +
             'code, pre,' +
             '.peer-title > span, .profile-name, .chat-info-container .peer-title, .phone-number, .username > span,' +
             '.input-field-input[data-placeholder*="Bio"], .input-field-input[data-placeholder*="Username"]'
         );

        if (closestExcludedAncestor) {
             // Allow translation if the parent matches the general description selector OR specific date/count selectors
             const isInAllowedContext =
                 doesNodeMatchOrHaveAncestor(node, descriptionSelector) || // Check if it's a description text container
                 doesNodeMatchOrHaveAncestor(node, chatListDateSelector) ||
                 doesNodeMatchOrHaveAncestor(node, dateSeparatorSelector) ||
                 doesNodeMatchOrHaveAncestor(node, stickerCountSelector) ||
                 doesNodeMatchOrHaveAncestor(node, exceptionCountSelector);

             if (!isInAllowedContext) {
                 // Also allow known status words in chat list last message
                  if (!(parent.matches('.chat-list .chat-item-content .last-message > .text > span') || parent.matches('.chat-list .chat-item-content .last-message > .text')) || !translations[node.nodeValue.trim().toLowerCase()]) {
                      return;
                  }
             }
        }


        let originalText = node.nodeValue.trim();
        if (!originalText) return;

        // Combine multiple spaces/newlines into single space for matching
        const normalizedText = originalText.replace(/\s+/g, ' ');

        let translatedText = null;
        let textModified = false;
        let isDynamicContent = false; // Assume static unless proven otherwise

        const isChatListDate = doesNodeMatchOrHaveAncestor(node, chatListDateSelector);
        const isDateSeparator = doesNodeMatchOrHaveAncestor(node, dateSeparatorSelector);
        const isDescription = doesNodeMatchOrHaveAncestor(node, descriptionSelector);
        const isCount = doesNodeMatchOrHaveAncestor(node, stickerCountSelector) || doesNodeMatchOrHaveAncestor(node, exceptionCountSelector);

        // --- Translation Logic ---
        // 1. Check dynamic/formatted content first
        if (normalizedText.startsWith("last seen ")) {
            isDynamicContent = true;
            // ... (Existing last seen logic) ...
            let tempText = normalizedText.substring("last seen ".length).trim().toLowerCase();
            let baseTranslated = translations["last seen"] || "上次在线";
            if (tempText === "just now" || tempText === "recently") { translatedText = baseTranslated + " " + (translations["just now"] || translations["recently"] || "刚刚"); }
            else if (tempText === "an hour ago" || tempText === "1 hour ago") { translatedText = baseTranslated + " 1 " + (translations["hour"] || "小时") + (translations["ago"] || "前"); }
            else if (tempText === "yesterday") { translatedText = baseTranslated + " " + (translations["yesterday"] || "昨天"); }
            else if (tempText === "within a week") { translatedText = baseTranslated + " " + (translations["within a week"] || "一周内"); }
            else if (tempText === "within a month") { translatedText = baseTranslated + " " + (translations["within a month"] || "一个月内"); }
            else if (tempText === "a long time ago") { translatedText = baseTranslated + " " + (translations["a long time ago"] || "很久以前"); }
            else if (/^(\d+)\s+minutes? ago$/.test(tempText)) { translatedText = baseTranslated + " " + tempText.replace(/^(\d+)\s+minutes? ago$/, `$1 ${translations["minutes"] || "分钟"}${translations["ago"] || "前"}`); }
            else if (/^(\d+)\s+hours? ago$/.test(tempText)) { translatedText = baseTranslated + " " + tempText.replace(/^(\d+)\s+hours? ago$/, `$1 ${translations["hours"] || "小时"}${translations["ago"] || "前"}`); }
            else if (/^today at (\d{1,2}:\d{2}(?:\s*[ap]m)?)$/i.test(tempText)) { const timePart = tempText.match(/^today at (\d{1,2}:\d{2}(?:\s*[ap]m)?)$/i)[1]; translatedText = baseTranslated + " " + (translations["today"] || "今天") + " " + timePart.toUpperCase().replace("AM", translations["AM"] || "上午").replace("PM", translations["PM"] || "下午"); }
            else if (/^yesterday at (\d{1,2}:\d{2}(?:\s*[ap]m)?)$/i.test(tempText)) { const timePart = tempText.match(/^yesterday at (\d{1,2}:\d{2}(?:\s*[ap]m)?)$/i)[1]; translatedText = baseTranslated + " " + (translations["yesterday"] || "昨天") + " " + timePart.toUpperCase().replace("AM", translations["AM"] || "上午").replace("PM", translations["PM"] || "下午"); }
            else if (/^(mon|tue|wed|thu|fri|sat|sun)$/i.test(tempText)) { const dayAbbr = tempText.charAt(0).toUpperCase() + tempText.slice(1); translatedText = baseTranslated + " " + (translations[dayAbbr] || dayAbbr); }
            else if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2}(?:\s*[ap]m)?)$/i.test(tempText)) { const match = tempText.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2}(?:\s*[ap]m)?)$/i); if (match) { const monthAbbr = match[1].charAt(0).toUpperCase() + match[1].slice(1); const monthTranslated = translations[monthAbbr] || monthAbbr; const day = match[2]; const time = match[3].toUpperCase().replace("AM", translations["AM"] || "上午").replace("PM", translations["PM"] || "下午"); const atTranslated = translations["at"] || "于"; translatedText = `${baseTranslated} ${monthTranslated}${day}日 ${atTranslated} ${time}`; } }
            else if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(tempText)) { const match = tempText.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (match) { translatedText = `${baseTranslated} ${match[3]}年${match[1]}月${match[2]}日`; } }
            else if (/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.test(tempText)) { const match = tempText.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/); if (match) { translatedText = `${baseTranslated} ${match[3]}年${match[2]}月${match[1]}日`; } }
            else { translatedText = baseTranslated + " " + tempText; }
        }
        else if (isChatListDate) {
            isDynamicContent = true;
            // ... (Existing chat list date logic) ...
             const lowerText = normalizedText.toLowerCase();
             if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})$/.test(lowerText)) { const match = lowerText.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})$/); if (match) { const monthAbbr = match[1].charAt(0).toUpperCase() + match[1].slice(1); const monthTranslated = translations[monthAbbr] || monthAbbr; const day = match[2]; translatedText = `${monthTranslated}${day}日`; } }
             else if (/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.test(originalText)) { const match = originalText.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/); if (match) { const year = match[3].length === 2 ? '20' + match[3] : match[3]; translatedText = `${year}年${match[1]}月${match[2]}日`; } }
             else if (/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/.test(originalText)) { const match = originalText.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/); if (match) { const year = match[3].length === 2 ? '20' + match[3] : match[3]; translatedText = `${year}年${match[2]}月${match[1]}日`; } }
             else if (/^\d{1,2}:\d{2}$/.test(originalText)) { translatedText = originalText; }
             else if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(originalText)) { translatedText = originalText.toUpperCase().replace("AM", translations["AM"] || "上午").replace("PM", translations["PM"] || "下午"); }
             else if (lowerText === 'today') { translatedText = translations['today'] || '今天'; }
             else if (lowerText === 'yesterday') { translatedText = translations['yesterday'] || '昨天'; }
             else if (/^(mon|tue|wed|thu|fri|sat|sun)$/i.test(lowerText)) { const dayAbbr = lowerText.charAt(0).toUpperCase() + lowerText.slice(1); translatedText = translations[dayAbbr] || dayAbbr; }
             else { translatedText = originalText; }
        }
        else if (isDateSeparator) {
            isDynamicContent = true;
            // ... (Existing date separator logic) ...
             const lowerText = normalizedText.toLowerCase();
             if (/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:,\s*(\d{4}))?$/i.test(lowerText)) {
                 const match = lowerText.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:,\s*(\d{4}))?$/i);
                 if (match) {
                     const monthFull = match[1]; const monthCap = monthFull.charAt(0).toUpperCase() + monthFull.slice(1); const monthTranslated = translations[monthCap] || monthFull; const day = match[2]; const year = match[3] ? ` ${match[3]}年` : "";
                     translatedText = `${monthTranslated}${day}日${year}`;
                 }
             }
             else if (lowerText === 'today') { translatedText = translations['today'] || '今天'; }
             else if (lowerText === 'yesterday') { translatedText = translations['yesterday'] || '昨天'; }
             else { translatedText = originalText; }
        }
        else if (isCount) {
            isDynamicContent = true;
            // ... (Existing count logic) ...
             if (/^(\d+)\s+stickers?$/i.test(originalText)) { translatedText = originalText.replace(/\s+stickers?$/i, ` ${translations["stickers"] || "张贴纸"}`); }
             else if (/^(\d+)\s+users?$/i.test(originalText)) { translatedText = originalText.replace(/\s+users?$/i, ` ${translations["users"] || "名用户"}`); }
             else if (/^(\d+)\s+members?$/i.test(originalText)) { translatedText = originalText.replace(/\s+members?$/i, ` ${translations["members"] || "名成员"}`); }
             else if (/^(\d+)\s+subscribers?$/i.test(originalText)) { translatedText = originalText.replace(/\s+subscribers?$/i, ` ${translations["subscribers"] || "名订阅者"}`); }
             else if (/^(\d+)\s+(photos?|videos?|files?|links?|messages?)$/i.test(originalText)) {
                 const match = originalText.match(/^(\d+)\s+(photos?|videos?|files?|links?|messages?)$/i);
                 if (match) { const count = match[1]; const type = match[2].replace(/s$/, ''); const translatedUnit = translations[type + 's'] || translations[type] || type; translatedText = `${count} ${translatedUnit}`; }
             }
        }
        else if (['online', 'typing', 'edited'].includes(normalizedText.toLowerCase())) {
            const lowerOriginal = normalizedText.toLowerCase();
            if (translations.hasOwnProperty(lowerOriginal)) {
                isDynamicContent = true;
                translatedText = translations[lowerOriginal];
            }
        }
        else if (normalizedText.startsWith("It expires on ")) {
             isDynamicContent = true;
             // ... (Existing expiry date logic) ...
             const datePart = normalizedText.substring("It expires on ".length);
             const prefixTranslated = translations["It expires on"] || "到期时间：";
             let dateTranslated = datePart;
             if (/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.test(datePart)) { const match = datePart.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/); dateTranslated = `${match[3]}年${match[2]}月${match[1]}日`; }
             else if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/i.test(datePart)) {
                  try {
                      const parts = datePart.match(/^(\w+)\s+(\d{1,2}),\s+(\d{4})$/i);
                      if (parts) { const monthAbbr = parts[1].charAt(0).toUpperCase() + parts[1].slice(1); const monthTranslated = translations[monthAbbr] || monthAbbr; dateTranslated = `${monthTranslated}${parts[2]}日, ${parts[3]}年`; }
                  } catch (e) {/* ignore */}
             }
             translatedText = prefixTranslated + dateTranslated;
        }

        // 2. If no specific case matched, try general dictionary lookup using normalized text
        if (translatedText === null && translations.hasOwnProperty(normalizedText)) {
             translatedText = translations[normalizedText];
             isDynamicContent = isDescription ? false : isDynamicContent; // Descriptions are static
        }
        // 2.5 Try original text if normalized didn't match (handles cases with specific whitespace)
        else if (translatedText === null && normalizedText !== originalText && translations.hasOwnProperty(originalText)) {
             translatedText = translations[originalText];
             isDynamicContent = isDescription ? false : isDynamicContent;
        }


        // 3. Apply translation if found and different
        if (translatedText !== null && originalText !== translatedText) {
             try {
                 node.nodeValue = translatedText; // Replace entire node value
                 textModified = true;
             } catch (e) {
                 console.error("[TG Translate] Error replacing text node value:", e, "Node:", node, "Original:", originalText, "Translated:", translatedText);
             }
        }

        // 4. Mark parent element appropriately
        if (textModified && parent) {
             const existingMark = parent.getAttribute(translatedMark);
             if (existingMark !== 'true') { // Don't overwrite 'true' unless upgrading to 'dynamic'
                 parent.setAttribute(translatedMark, isDynamicContent ? 'dynamic' : 'true');
             } else if (isDynamicContent) {
                 parent.setAttribute(translatedMark, 'dynamic'); // Upgrade to dynamic if needed
             }
        }
    }


    function translateElementAttributes(element) {
         if (!element || typeof element.hasAttribute !== 'function') return;

         const currentMark = element.getAttribute(translatedMark);
         if (currentMark === 'true') return; // Already fully translated

         let markedAttribute = false;
         const attributesToTranslate = ['placeholder', 'data-placeholder', 'title', 'aria-label'];

         for (const attr of attributesToTranslate) {
             const originalValue = element.getAttribute(attr);
             if (originalValue) {
                 const normalizedValue = originalValue.replace(/\s+/g, ' '); // Normalize whitespace
                 const translatedValue = translations[normalizedValue] || translations[originalValue]; // Try normalized then original
                 if (translatedValue && originalValue !== translatedValue) {
                     element.setAttribute(attr, translatedValue);
                     markedAttribute = true;
                 }
             }
         }

         if (element.matches(inputSelector)) {
              const placeholderAttr = element.getAttribute('placeholder') || element.getAttribute('data-placeholder');
              if (placeholderAttr) {
                  const normalizedPlaceholder = placeholderAttr.replace(/\s+/g, ' ');
                  const translatedPlaceholder = translations[normalizedPlaceholder] || translations[placeholderAttr];
                  if (translatedPlaceholder && placeholderAttr !== translatedPlaceholder) {
                      element.setAttribute('placeholder', translatedPlaceholder);
                      if (element.hasAttribute('data-placeholder')) { element.setAttribute('data-placeholder', translatedPlaceholder); }
                      markedAttribute = true;
                  }
              }
         }


         if (markedAttribute) {
             // Mark as 'attribute' only if not already dynamic/true
             if (currentMark !== 'dynamic' && currentMark !== 'true') {
                element.setAttribute(translatedMark, 'attribute');
             }
         }
    }

    function traverseAndTranslate(node) {
        if (!node) return;

        // Early exit for comments and specific tags (unless it's the message input)
        if (node.nodeType === Node.COMMENT_NODE) return;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName?.toUpperCase();
            if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'TEXTAREA' || tagName === 'CODE' || tagName === 'PRE') {
                 if (!node.matches(inputSelector)) return;
            }
            if (node.isContentEditable && !node.matches(inputSelector)) return;
        }

        let processChildren = true;

        if (node.nodeType === Node.ELEMENT_NODE) {
            const markValue = node.getAttribute(translatedMark);
            if (markValue === 'true') return; // Skip if already fully translated statically

            // Translate attributes first
            translateElementAttributes(node);
            const updatedMarkValue = node.getAttribute(translatedMark); // Re-check mark
            if (updatedMarkValue === 'true') return; // Exit if marked 'true' after attr translation


             // Exclusion logic: Skip children if inside certain containers, UNLESS the node itself is a known description/date/count
             const closestExcludedAncestor = node.closest?.(
                 '.message.bubble .message-content-wrapper,' +
                 '.sticker-set-name, .sticker-pack-title,' +
                 '.peer-title > span, .profile-name, .chat-info-container .peer-title, .phone-number, .username > span,' +
                 '.input-field-input[data-placeholder*="Bio"], .input-field-input[data-placeholder*="Username"]'
             );

             if (closestExcludedAncestor) {
                 const isInAllowedContext =
                     doesNodeMatchOrHaveAncestor(node, descriptionSelector) ||
                     doesNodeMatchOrHaveAncestor(node, chatListDateSelector) ||
                     doesNodeMatchOrHaveAncestor(node, dateSeparatorSelector) ||
                     doesNodeMatchOrHaveAncestor(node, stickerCountSelector) ||
                     doesNodeMatchOrHaveAncestor(node, exceptionCountSelector);

                 if (!isInAllowedContext) {
                     processChildren = false;
                 }
             }

            // Special handling for last message container: process only specific children directly
            if (node.matches?.('.chat-list .chat-item-content .last-message > .text')) {
                 const childNodes = Array.from(node.childNodes);
                 for (const child of childNodes) {
                     if (child.nodeType === Node.ELEMENT_NODE && doesNodeMatchOrHaveAncestor(child, chatListDateSelector)) {
                         traverseAndTranslate(child);
                     } else if (child.nodeType === Node.TEXT_NODE) {
                          translateTextNode(child); // Handles status words
                     }
                     // Skip other unknown children
                 }
                 processChildren = false; // Prevent default recursive call for children of this node
             }

        } else if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node);
            processChildren = false; // Text nodes have no children to process
        } else {
            processChildren = false; // Skip children for other node types
        }

        // Recursively translate children if allowed and exist
        if (processChildren && node.childNodes && node.childNodes.length > 0) {
             const children = Array.from(node.childNodes);
             for (let i = 0; i < children.length; i++) {
                 traverseAndTranslate(children[i]);
             }
        }
    }


    // --- MutationObserver 设置 ---
    const observer = new MutationObserver((mutationsList) => {
        window.requestAnimationFrame(() => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                            traverseAndTranslate(node);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    const targetNode = mutation.target;
                    if (targetNode.parentElement && targetNode.parentElement.getAttribute(translatedMark) !== 'true') {
                         if (targetNode.parentElement.hasAttribute(translatedMark)) {
                            targetNode.parentElement.removeAttribute(translatedMark);
                         }
                         translateTextNode(targetNode);
                    }
                } else if (mutation.type === 'attributes') {
                    const targetElement = mutation.target;
                     if (targetElement.nodeType === Node.ELEMENT_NODE) {
                         const attributeName = mutation.attributeName;
                          if (['placeholder', 'data-placeholder', 'title', 'aria-label'].includes(attributeName))
                          {
                               if (targetElement.getAttribute(translatedMark) === 'attribute') {
                                    targetElement.removeAttribute(translatedMark);
                               }
                               if (targetElement.getAttribute(translatedMark) !== 'true' && targetElement.getAttribute(translatedMark) !== 'dynamic') {
                                    translateElementAttributes(targetElement);
                               }
                          }
                          // Re-evaluate children if class changes might affect layout/visibility significantly
                          // else if (attributeName === 'class' && targetElement.getAttribute(translatedMark) !== 'true') {
                          //    traverseAndTranslate(targetElement); // Re-traverse subtree on class change if not fully static
                          // }
                     }
                }
            }
        });
    });

    // --- 初始化 ---
    function initialize() {
        const scriptVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '1.0.7';
        const currentMarkAttr = translatedMark; // data-ui-translated-v107
        console.log(`[TG Translate v${scriptVersion}] Initializing...`);

        // --- Clean up old marks ---
        const oldMarkSelectors = [
            '[data-ui-translated-v106]', // Previous version
            '[data-ui-translated-v105]',
            '[data-ui-translated-v104]',
            '[data-ui-translated-v103]',
            '[data-ui-translated]'
        ].filter(selector => selector !== `[${currentMarkAttr}]`).join(',');

        if (oldMarkSelectors) {
             try {
                 document.querySelectorAll(oldMarkSelectors).forEach(el => {
                     Array.from(el.attributes).forEach(attr => {
                         if (attr.name.startsWith('data-ui-translated-')) {
                             el.removeAttribute(attr.name);
                         }
                     });
                 });
                 console.log(`[TG Translate v${scriptVersion}] Cleaned up old translation marks.`);
             } catch (e) {
                 console.error("[TG Translate] Error cleaning old marks:", e);
             }
        }

        console.log(`[TG Translate v${scriptVersion}] Running initial translation pass...`);
        const startTime = performance.now();
        traverseAndTranslate(document.body);
        const endTime = performance.now();
        console.log(`[TG Translate v${scriptVersion}] Initial translation finished in ${((endTime - startTime)/1000).toFixed(2)} seconds.`);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'data-placeholder', 'title', 'aria-label', 'class', 'style']
        });
        console.log(`[TG Translate v${scriptVersion}] MutationObserver started.`);
    }

    // --- Initialization Timing ---
    const INIT_DELAY = 3000; // ms
    let initScheduled = false;
    let initialized = false;

    function scheduleInit() {
         if (initScheduled || initialized) return;
         initScheduled = true;
         console.log(`[TG Translate] Scheduling initialization in ${INIT_DELAY}ms.`);
         setTimeout(() => {
             if (initialized) return;
             initialized = true;
              // Mark body to indicate initialization started (optional)
              // document.body.setAttribute('data-tg-translate-init-status', 'started');
              initialize();
              // Mark body to indicate initialization finished (optional)
              // document.body.setAttribute('data-tg-translate-init-status', 'finished');
         }, INIT_DELAY);
    }

    // Prefer 'interactive' but ensure body exists, fall back to DOMContentLoaded/load
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        if (document.body) {
            // console.log(`[TG Translate] Document ready state is '${document.readyState}'. Body exists.`);
            scheduleInit();
        } else {
            // console.log(`[TG Translate] Document ready state is '${document.readyState}', but body doesn't exist yet. Waiting for DOMContentLoaded.`);
            document.addEventListener('DOMContentLoaded', () => {
                 // console.log("[TG Translate] DOMContentLoaded fired.");
                 scheduleInit();
            }, { once: true });
        }
    } else {
         // console.log("[TG Translate] Adding DOMContentLoaded event listener.");
        document.addEventListener('DOMContentLoaded', () => {
             // console.log("[TG Translate] DOMContentLoaded fired.");
             scheduleInit();
        }, { once: true });
    }
     // Add a 'load' listener as a final fallback
     window.addEventListener('load', () => {
          // console.log("[TG Translate] 'load' event fired.");
          scheduleInit();
     }, { once: true });


})(); // <--- 结束自执行函数