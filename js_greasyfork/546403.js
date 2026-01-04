// ==UserScript==
// @name         Wplace 汉化脚本
// @namespace    http://tampermonkey.net/
// @version      1.2.40
// @description  将网站 wplace.live 的界面翻译成中文。
// @author       Avava_Ava & AI Optimized
// @match        https://wplace.live/*
// @license      MIT
// @run-at       document-body
// @icon         https://wplace.live/img/favicon-96x96.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/546403
// @downloadURL https://update.greasyfork.org/scripts/546403/Wplace%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546403/Wplace%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Wplace汉化] 脚本开始加载...');

    // 创建一个翻译字典，将英文原文映射到中文译文
    const translations = {
        // ========== 页面标题与信息 ==========
        "Wplace - Paint the world": "Wplace-描绘这世界",
        "Paint the world": "描绘这世界",
        "Wplace": "Wplace",
        "Feedback and bugs": "提供反馈或汇报问题",
        "Map powered by:": "地图技术由以下项目提供：",
        "©\n\t\t\t\t\t\tOpenMapTiles Data from": " ©\n\t\t\t\t\t\tOpenMapTiles 数据来自",
        "Overview": "概览",
        "How to paint faster": "如何画得快一些",
        "Hold": "按住",
        "and move your cursor over the map.": "，随后在地图上移动鼠标。",
        "When painting, click on the button": "在绘制时，点击位于屏幕右上角上的",
        "on the top right corner of the screen. This will lock the screen but it'll also enable painting by moving your finger over the map.": "按钮。点击后屏幕将锁定；此时在屏幕上滑动即可进行绘制。",
        "My map is lagging": "我的地图画面卡顿严重",
        "Verify if": "（如果使用的是 Chrome 浏览器）请查看",
        "is enabled on": "选项是否开启。该选项位于",
        "Email:": "邮箱：",
        "Terms": "服务条款",
        "Privacy": "隐私政策",
        "Refund": "退款政策",
        "Ban appeal": "封禁申诉",
        "Suggestions": "提出建议",
        "Bug report": "汇报问题",
        "Refund Policy": "退款政策",
        "Show profile": "显示个人资料",

        // ========== 文本 ==========
        "Paint pixel": "放置像素点",
        "Pixels painted": "放置像素点总数",
        "Pixels painted:": "已放置的像素点：",
        "Pixels": "放置像素点总数",
        "painted": " ",
        "Region": "区域",
        "Pixels painted inside the region": "放置于该区域内像素点的总数目",
        "Visit": "去看看",
        "Menu": "菜单",
        "Notifications": "通知",
        "No notifications": "暂无通知",
        "Change frame": "更换头像边框",
        "Frame Inventory": "头像边框清点区",
        "Choose a frame for your profile picture": "可在此处为你的头像挑选一个边框",
        "Your frames": "拥有的头像边框",
        "None": "无",
        "No frame": "无边框",
        "No frame in your profile": "暂未设置头像边框",
        "Selected": "已选定",
        "Frames store": "头像边框商店",
        "We don't have frames to buy yet, wait for future updates ;)": "目前我们尚未推出可购买头像边框，敬请期待未来更新 ;)",
        "Preview": "预览",

        // ========== 按钮 & 提示 ==========
        "Info": "信息",
        "Zoom in": "放大",
        "Zoom out": "缩小",
        "Livestreams": "Twitch 相关直播",
        "Refresh": "刷新页面",
        "Previous location": "前一个地点",
        "Toggle art opacity": "切换作品透明度",
        "My location": "我的当前位置",
        "Paint": "绘制",
        "Close": "关闭",
        "Understood": "了解",
        "Confirm": "确认",
        "Store": "商店",
        //必须做i8n才能完全解决这个问题
        //"Move ↑": "移至上方",
        //"Move ↓": "移至下方",
        "Eraser": "擦除",
        "Color Picker": "拾取像素点颜色",
        "Offline": "你已离线",
        "Explore": "看看别处",
        "Favorite": "收藏",
        "Share": "分享",
        "Mute": "禁用音效",
        "Unmute": "启用音效",
        "Default theme": "使用默认主题",
        "Event theme": "使用活动主题",
        //"+2 max. charge/level": "每升一级，像素点储备上限+2",
        "+2 max. charge/niveau": "每升一级，像素点储备上限+2",
        "Purchases": "支付信息",
        "Log Out": "退出登录",
        "Alliance": "联盟",
        "Log in": "登录",
        "Edit profile": "编辑个人资料",
        "Name": "昵称",
        "Your name is how other users will see you in Wplace. It can be changed every 60 days.": "这是你在 Wplace 中向其他玩家展示的称号。每隔 60 天可修改一次昵称。",
        "Show last painted pixel on alliance": "在「联盟」页面显示自己最后放置的像素点",
        "Delete Account": "删除账户",
        "Save": "保存",
        "Add profile picture": "添加头像",
        "Draw profile picture": "绘制头像",
        "Upload": "上传",
        "Preferably, use a 16x16 image": "长宽以 16x16 为佳",
        "Preview:": "预览：",
        "Add": "添加",
        "Discord Username": "Discord 用户名",
        "More": "更多",
        "Log out from all devices": "从所有设备上退出登录",
        "This action will log your account out from all devices.": "该操作将使你从所有设备上退出登录。",
        "This action may take some time to be completed.": "完成该操作可能需要一点时间。",
        "Link your Discord": "绑定自己的 Discord 账号",
        "Unlink Discord": "取消绑定该 Discord 账号",
        "Go to map": "进入地图界面",
        "The Twitch account you tried to migrate has already been migrated to a Wplace account (": "你选择进行迁移操作的 Twitch 账号此前已完成迁移操作  (",
        "). Please log in normally using this email.": ")。请通过该邮箱进行正常登录。",
        "Undo": "撤回",
        "Redo": "重放",
        "Logout": "退出登录",
        "Change language": "更改语言",


        // ========== 弹窗 & 标题 ==========
        "Max. Charges": "最大像素点储备",
        "Welcome to": "欢迎来到",
        "Rules": "规则",
        "Important": "重要",
        "📑 Updated rules": "规则（已更新）",
        "Leaderboard": "排行榜",
        "PIX": "像素点",
        "Location favorited": "已收藏该位置",
        "Location unfavorited": "已取消收藏该位置",
        "Share place": "分享该位置",
        "Image": "图像",
        "Copy": "复制",
        "Download": "下载",
        "No internet access or the servers are offline. Try again later.": "当前无网络连接，或本站服务器已离线。请稍后再试。",
        "Can't reach the server. Maybe you are without internet connection or the server is down. Try again later": "无法同服务器进行通讯。可能当前无网络连接，或本站服务器已离线。请稍后再试。",
        "Our servers are down for maintenance. We should be back soon.": "服务器正在维护中，请稍后再试。",
        "You need to zoom in to select a pixel": "进一步放大地图方可点选像素点",
        "Painted by:": "由该用户绘制：",
        "Not painted": "从未被绘制过",
        "(Verified)": "（已认证用户）",
        "Username copied to clipboard": "已将用户名复制至剪贴板",
        "Zoom in to see the pixels": "放大地图即可看到像素点",
        "Logged out": "已退出登录",
        "Login with Google": "通过 Google 账号进行登录",
        "Login with Twitch": "通过 Twitch 账号进行登录",
        "We are experiencing technical problems. Sorry for the inconvenience 🙇‍♂️": "我们遇到了技术问题，很抱歉为您带来不便🙇‍",
        "By continuing, you agree to our": "继续操作，即表明您同意我们的",
        "Terms of Service": "服务条款",
        "and": "和",
        "Code of Conduct": "用户行为准则",
        "Do you have a Wplace Twitch account?": "已经拥有通过 Twitch 来登录的 Wplace 账号了吗？",
        "Migrate your account": "请点击此处进行账号迁移操作",
        "Leaderboard is temporarily disabled": "排行榜功能已暂时停用",
        "No more charges": "像素点已用尽",
        "You don't have charges to paint.": "你没有像素点了。",
        "You don't have charges to paint. Wait to recharge.": "你没有像素点了。请等待像素点回复。",
        "Pick a color from the map": "在地图上拾取一像素点的颜色",
        "Select a pixel to erase": "选择需要擦除的像素",
        "Click": "点击",
        "or hold": "或按住",
        "to paint,": "按键，即可进行绘制。",
        "Refresh your page to get the latest update": "站点已更新。请刷新本页面",
        "Your account has been banned. Reason: ": "您的账户已被封禁。封禁原因：",
        "Your account has been banned.": "您的账户已被封禁。",
        "Your account has been suspended until": "您的账户已被暂时停用。解除停用状态时间为",
        "Your account has been suspended out until": "您的账户已被暂时停用。解除停用状态时间为",
        "Breaking the rules": "违反本站规则",
        ". Reason: Inappropriate conent (+18, inappropriate link, highly suggestive content, ...)": "创作不当内容（成人内容、不当链接、强暗示性内容等）",
        ". Reason: Hate speech (Racism, homophobia, hate groups, ...)": "。封禁原因：发表仇恨言论（发表种族歧视言论、发表恐同言论、隶属于仇恨特定群体的某个团体，或宣扬该团体，等）",
        ". Reason: Inappropriate content (+18, inappropriate link, highly suggestive content, ...)": "。封禁原因：创作不当内容（成人内容、不当链接、强暗示性内容等）",
        ". Reason: Doxxing (Released other's personal information without their consent)": "。封禁原因：擅自传播隐私信息（未经同意即公开他人个人信息）",
        ". Reason: Botting (Use of software to completely automate painting)": "。封禁原因：使用全自动机器人（使用软件放置像素点，且完全无真人参与）",
        ". Reason: Griefing (Messed up artworks for no reason)": "。封禁原因：恶意涂抹（无故破坏他人艺术作品）",
        "You have broken one of Wplace's rules": "您违反了 Wplace 规则之一",
        "Your account has been suspended for breaking the rules": "由于违反本站规则，您的账户已被暂时停用",
        "Sessions successfully revoked": "所有会话状态均已成功撤销",
        "Successfully linked your Discord account.": "已成功绑定你的 Discord 账号。",
        "Discord unlinked": "已取消绑定当前 Discord 账号",
        "Twitch account migrated successfully.": "已完成 Twitch 账号迁移操作。",
        "You cannot paint over event pixels": "你无法覆盖用于举办活动的像素点。",
        "Reward claimed successfully! 🎄": "成功获取礼品！🎄",
        "Frame equipped!": "已装上此头像边框！",

        // ========== 规则列表 ==========
        "😈 Do not paint over other artworks using random colors or patterns just to mess things up": "😈 禁止使用随机颜色或图样恶意涂抹他人艺术作品",
        "🚫 No inappropriate content (+18, hate speech, inappropriate links, highly suggestive material, ...)": "🚫 禁止绘制不当内容（如成人内容、仇恨言论、不当链接、强暗示性内容等）",
        "🧑‍🤝‍🧑 Do not paint with more than one account": "🧑‍🤝‍🧑 禁止单人使用多个账户进行绘制",
        "🤖 Use of bots is not allowed": "🤖 禁止使用机器人",
        "🙅 Disclosing other's personal information is not allowed": "🙅 禁止泄露他人个人信息",
        "✅ Painting over other artworks to complement them or create a new drawing is allowed": "✅ 允许在他人作品上进行补充创作或绘制新内容",
        "✅ Griefing political party flags or portraits of politicians is allowed": "✅ 允许涂抹政党旗帜或政治人物肖像",
        "Violations of these rules may lead to suspension of your account or removal of drawings.": "违反上述规则可能会导致你的账户被停用或被移除作品",
        "For more details, see our": "如需了解详情，请参阅我们的",
        "Account Enforcement Policy and Code of Conduct": "账户处置政策和用户行为准则",

        // ========== 举报功能 ==========
        "Report User": "举报该用户",
        "Select the reason:": "选择举报理由：",
        "Inappropriate content": "创作不当内容",
        "+18, inappropriate link, highly suggestive content, ...": "如成人内容、不当链接、强暗示性内容等",
        "Hate speech": "发表仇恨言论",
        "Racism, homophobia, hate groups, ...": "如发表种族歧视言论、发表恐同言论、隶属于仇恨特定群体的某个团体，或宣扬该团体，等",
        "Doxxing": "擅自传播隐私信息",
        "Released other's personal information without their consent": "未经同意即公开他人个人信息",
        "Botting": "使用全自动机器人",
        "Use of software to completely automate painting": "使用软件放置像素点，且完全无真人参与",
        "Griefing": "恶意涂抹",
        "Messed up artworks for no reason": "无故破坏他人艺术作品",
        "Other": "其他",
        "Other reason not listed": "存在未列于其上的其他理由",
        "Multi-accounting": "单人使用多个账户",
        "Use more than one account to paint pixels": "使用复数个账户放置像素点",
        "Extra context on what happened (required)": "（必填）在此附加所发生事件的具体信息",
        "Report": "举报",
        "Cancel": "取消",
        "Report sent successfully": "举报已成功发送",
        "Report failed. Please try again later": "举报发送失败。请稍后再试。",
        "Min. characters: 5": "举报信息内容长度必须大于 5 个英语字符",
        "Max. characters: 2056": "举报信息内容长度必须小于 2056 个英语字符",
        "Report name": "举报该用户的用户名",
        "Report alliance name": "举报该用户所属联盟的名称",

        // ========== 搜索功能 ==========
        "Search": "搜索",
        "Recent": "最近搜索记录",
        "Coordinates": "坐标",
        "Random place": "随便看看",

        // ========== 排行榜 & 筛选 ==========
        "Regions": "区域",
        "Countries": "国家和地区",
        "Players": "用户",
        "Alliances": "联盟",
        "Today": "今日",
        "Week": "本周",
        "Month": "本月",
        "All time": "总计",
        "No pixels painted": "无人于此作画",
        "today": "（截至今日）",

        // ========== 活动 ==========
        // ========== 万圣节 - 2025  ==========
        /*"You received 2,000 droplets!": "你收到了 2000 颗小液滴！",
        "SPECIAL EVENT": "特别活动",
        "Halloween": "万圣节",
        "Pumpkin Hunt!": "来找南瓜吧！",
        "Halloween Event at Wplace": "Wplace 正在举办万圣节特别活动",
        "Start": "起始时间",
        "End": "结束时间",
        "Friday, Oct 31": "10 月 31 日，星期五",
        "Monday, Nov 3": "11 月 3 日，星期一",
        "00:00 AM (UTC)": "00:00（UTC 时间）",
        "During this special Halloween event,": "在本次万圣节特别活动中，我们在全地图上散布了",
        "100 numbered pumpkins": " 整整 100 个带有序数的南瓜——但请注意：这些南瓜的位置每过一小时就会变动一次！",
        " will be scattered throughout the Wplace map — and be warned: they change their location every\n\t\t\t\t\t hour!": "——但请注意：这些南瓜的位置每过一小时就会\t\t\t\t\t变动一次！",
        "Your Progress": "你的收集进度",
        "Claimed:": "已收集：",
        "Find the pumpkins": "请找出下图所示的南瓜主题作品",
        "Rewards": "奖励",
        "Earn": "每找到一个南瓜，你就能获得",
        "2,000 droplets": " 2000 颗小液滴作为奖励！",
        " for every unique pumpkin\n\t\t\t\t\t\tyou find!": "作为奖励！",
        "Search with the community where the pumpkins are hidden!": "翻翻社区的讨论，看看这些南瓜都藏在哪里吧！",
        "Claim": "收集",
        "Claimed": "已收集",
        "Event:": "活动物件：",
        "Pumpkin": "南瓜",*/

        // ========== 圣诞节 - 2025  ==========

        "SPECIAL EVENT": "特别活动",
        "Christmas Event:": "万圣节活动：",
        "Christmas Event": "万圣节活动",
        "Start": "起始时间",
        "End": "结束时间",
        "Friday, Dec 19": "12 月 19 日，星期五",
        "Friday, Dec 26": "12 月 26 日，星期五",
        "00:00 AM (UTC)": "00:00（UTC 时间）",
        "Three new Pixel Villages have appeared in the North Pole! Claim daily presents on the villages, and earn more by painting. Open the presents for an exclusive Christmas item, paint charges, droplets, and more!": "极北之境冒出了三个像素村庄！玩家每天都能在三个村庄中收集礼品，进行绘画还能拿得更多。开启礼品盒，即可收获圣诞节专属物品、像素点储备上限、小液滴，更有惊喜好礼相送！",
        "Paint pixels": "绘制像素点",
        "Pixels painted today:": "今天绘制的像素点总数：",
        "Presents earned today:": "因绘制像素点而获得的礼品总数：",
        "Paint more pixels to earn the next present": "绘制更多像素点，即可获得更多礼品",
        "Visit the Villages": "拜访这些村庄",
        "Open Present": "开启礼品盒",
        "Claim": "收集",
        "Claimed": "已收集",
        "Event:": "活动物件：",
        "Christmas": "圣诞",
        "Open special presents and earn exclusive Christmas items!": "打开这些特别礼品，获得圣诞节专属物品吧！",
        "Opening...": "开启中……",
        "You won:": "奖品：",
        "No presents": "无更多礼品",
        "Hide snowflakes": "隐藏飘雪特效",
        "Show snowflakes": "展示飘雪特效",


        // ========== 国家 & 地区 ==========
        "Country": "国家和地区",
        "Afghanistan": "阿富汗",
        "Åland Islands": "奥兰群岛",
        "Albania": "阿尔巴尼亚",
        "Algeria": "阿尔及利亚",
        "American Samoa": "美属萨摩亚",
        "Andorra": "安道尔",
        "Angola": "安哥拉",
        "Anguilla": "安圭拉",
        "Antarctica": "南极洲",
        "Antigua and Barbuda": "安提瓜和巴布达",
        "Argentina": "阿根廷",
        "Armenia": "亚美尼亚",
        "Aruba": "阿鲁巴",
        "Australia": "澳大利亚",
        "Austria": "奥地利",
        "Azerbaijan": "阿塞拜疆",
        "Bahamas": "巴哈马",
        "Bahrain": "巴林",
        "Bangladesh": "孟加拉国",
        "Barbados": "巴巴多斯",
        "Belarus": "白俄罗斯",
        "Belgium": "比利时",
        "Belize": "伯利兹",
        "Benin": "贝宁",
        "Bermuda": "百慕大",
        "Bhutan": "不丹",
        "Bolivia": "玻利维亚",
        "Bonaire": "博奈尔",
        "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
        "Botswana": "博茨瓦纳",
        "Bouvet Island": "布韦岛",
        "Brazil": "巴西",
        "British Indian Ocean Territory": "英属印度洋领地",
        "British Virgin Islands": "英属维尔京群岛",
        "Brunei Darussalam": "文莱",
        "Bulgaria": "保加利亚",
        "Burkina Faso": "布基纳法索",
        "Burundi": "布隆迪",
        "Cambodia": "柬埔寨",
        "Cameroon": "喀麦隆",
        "Canada": "加拿大",
        "Canary Islands": "加那利群岛",
        "Cabo Verde": "佛得角",
        "Cayman Islands": "开曼群岛",
        "Central African Republic": "中非共和国",
        "Chad": "乍得",
        "Chile": "智利",
        "China": "中国",
        "Christmas Island": "圣诞岛",
        "Cocos (Keeling) Islands": "科科斯（基林）群岛",
        "Colombia": "哥伦比亚",
        "Comoros": "科摩罗",
        "Republic of the Congo": "刚果（金）",
        "Congo": "刚果（布）",
        "Cook Islands": "库克群岛",
        "Costa Rica": "哥斯达黎加",
        "Côte d'Ivoire": "科特迪瓦",
        "Croatia": "克罗地亚",
        "Cuba": "古巴",
        "Curaçao": "库拉索",
        "Cyprus": "塞浦路斯",
        "Czechia": "捷克共和国",
        "Denmark": "丹麦",
        "Djibouti": "吉布提",
        "Dominica": "多米尼克",
        "Dominican Republic": "多米尼加共和国",
        "Ecuador": "厄瓜多尔",
        "Egypt": "埃及",
        "El Salvador": "萨尔瓦多",
        "Equatorial Guinea": "赤道几内亚",
        "Eritrea": "厄立特里亚",
        "Estonia": "爱沙尼亚",
        "Eswatini": "斯威士兰",
        "Ethiopia": "埃塞俄比亚",
        "Falkland Islands (Malvinas)": "福克兰群岛（马尔维纳斯）",
        "Faroe Islands": "法罗群岛",
        "Fiji": "斐济",
        "Finland": "芬兰",
        "France": "法国",
        "French Guiana": "法属圭亚那",
        "French Polynesia": "法属波利尼西亚",
        "French Southern Territories": "法属南部和南极领地",
        "Gabon": "加蓬",
        "Gambia": "冈比亚",
        "Georgia": "格鲁吉亚",
        "Germany": "德国",
        "Ghana": "加纳",
        "Gibraltar": "直布罗陀",
        "Greece": "希腊",
        "Greenland": "格陵兰",
        "Grenada": "格林纳达",
        "Guadeloupe": "瓜德罗普",
        "Guam": "关岛",
        "Guatemala": "危地马拉",
        "Guernsey": "根西",
        "Guinea": "几内亚",
        "Guinea-Bissau": "几内亚比绍",
        "Guyana": "圭亚那",
        "Haiti": "海地",
        "Heard Island and McDonald Islands": "赫德岛和麦克唐纳群岛",
        "Honduras": "洪都拉斯",
        "Hong Kong": "中国香港",
        "Hungary": "匈牙利",
        "Iceland": "冰岛",
        "India": "印度",
        "Indonesia": "印度尼西亚",
        "Iran": "伊朗",
        "Iraq": "伊拉克",
        "Ireland": "爱尔兰",
        "Isle of Man": "马恩岛",
        "Israel": "以色列",
        "Italy": "意大利",
        "Jamaica": "牙买加",
        "Japan": "日本",
        "Jersey": "泽西",
        "Jordan": "约旦",
        "Kazakhstan": "哈萨克斯坦",
        "Kenya": "肯尼亚",
        "Kiribati": "基里巴斯",
        "Kosovo": "科索沃",
        "Kuwait": "科威特",
        "Kyrgyzstan": "吉尔吉斯斯坦",
        "Laos": "老挝",
        "Latvia": "拉脱维亚",
        "Lebanon": "黎巴嫩",
        "Lesotho": "莱索托",
        "Liberia": "利比里亚",
        "Libya": "利比亚",
        "Liechtenstein": "列支敦士登",
        "Lithuania": "立陶宛",
        "Luxembourg": "卢森堡",
        "Macao": "中国澳门",
        "Madagascar": "马达加斯加",
        "Malawi": "马拉维",
        "Malaysia": "马来西亚",
        "Maldives": "马尔代夫",
        "Mali": "马里",
        "Malta": "马耳他",
        "Marshall Islands": "马绍尔群岛",
        "Martinique": "马提尼克",
        "Mauritania": "毛里塔尼亚",
        "Mauritius": "毛里求斯",
        "Mayotte": "马约特",
        "Mexico": "墨西哥",
        "Micronesia": "密克罗尼西亚",
        "Moldova": "摩尔多瓦",
        "Monaco": "摩纳哥",
        "Mongolia": "蒙古",
        "Montenegro": "黑山",
        "Montserrat": "蒙特塞拉特",
        "Morocco": "摩洛哥",
        "Mozambique": "莫桑比克",
        "Myanmar": "缅甸",
        "Namibia": "纳米比亚",
        "Nauru": "瑙鲁",
        "Nepal": "尼泊尔",
        "Netherlands": "荷兰",
        "New Caledonia": "新喀里多尼亚",
        "New Zealand": "新西兰",
        "Nicaragua": "尼加拉瓜",
        "Niger": "尼日尔",
        "Nigeria": "尼日利亚",
        "Niue": "纽埃",
        "Norfolk Island": "诺福克岛",
        "North Korea": "朝鲜",
        "North Macedonia": "北马其顿",
        "Northern Mariana Islands": "北马里亚纳群岛",
        "Norway": "挪威",
        "Oman": "阿曼",
        "Pakistan": "巴基斯坦",
        "Palau": "帕劳",
        "Palestine": "巴勒斯坦",
        "Panama": "巴拿马",
        "Papua New Guinea": "巴布亚新几内亚",
        "Paraguay": "巴拉圭",
        "Peru": "秘鲁",
        "Philippines": "菲律宾",
        "Pitcairn": "皮特凯恩群岛",
        "Poland": "波兰",
        "Portugal": "葡萄牙",
        "Puerto Rico": "波多黎各",
        "Qatar": "卡塔尔",
        "Réunion": "留尼汪",
        "Romania": "罗马尼亚",
        "Russia": "俄罗斯",
        "Rwanda": "卢旺达",
        "Saint Barthélemy": "圣巴泰勒米",
        "Saint Helena": "圣赫勒拿",
        "Saint Kitts and Nevis": "圣基茨和尼维斯",
        "Saint Lucia": "圣卢西亚",
        "Saint Martin (French part)": "法属圣马丁",
        "Saint Pierre and Miquelon": "圣皮埃尔和密克隆",
        "Saint Vincent and the Grenadines": "圣文森特和格林纳丁斯",
        "Samoa": "萨摩亚",
        "San Marino": "圣马力诺",
        "Sao Tome and Principe": "圣多美和普林西比",
        "Saudi Arabia": "沙特阿拉伯",
        "Senegal": "塞内加尔",
        "Serbia": "塞尔维亚",
        "Seychelles": "塞舌尔",
        "Sierra Leone": "塞拉利昂",
        "Singapore": "新加坡",
        "Sint Maarten (Dutch part)": "荷属圣马丁",
        "Slovakia": "斯洛伐克",
        "Slovenia": "斯洛文尼亚",
        "Solomon Islands": "所罗门群岛",
        "Somalia": "索马里",
        "South Africa": "南非",
        "South Georgia and the South Sandwich Islands": "南乔治亚和南桑威奇群岛",
        "South Korea": "韩国",
        "South Sudan": "南苏丹",
        "Spain": "西班牙",
        "Sri Lanka": "斯里兰卡",
        "Sudan": "苏丹",
        "Suriname": "苏里南",
        "Svalbard and Jan Mayen": "斯瓦尔巴和扬马延",
        "Sweden": "瑞典",
        "Switzerland": "瑞士",
        "Syrian Arab Republic": "叙利亚",
        "Taiwan": "中国台湾",
        "Tajikistan": "塔吉克斯坦",
        "Tanzania": "坦桑尼亚",
        "Thailand": "泰国",
        "Timor-Leste": "东帝汶",
        "Togo": "多哥",
        "Tokelau": "托克劳",
        "Tonga": "汤加",
        "Trinidad and Tobago": "特立尼达和多巴哥",
        "Tunisia": "突尼斯",
        "Türkiye": "土耳其",
        "Turkmenistan": "土库曼斯坦",
        "Turks and Caicos Islands": "特克斯和凯科斯群岛",
        "Tuvalu": "图瓦卢",
        "U.S. Virgin Islands": "美属维尔京群岛",
        "Uganda": "乌干达",
        "Ukraine": "乌克兰",
        "United Arab Emirates": "阿拉伯联合酋长国",
        "United Kingdom": "英国",
        "United States": "美国",
        "United States Minor Outlying Islands": "美国本土外小岛屿",
        "Uruguay": "乌拉圭",
        "Uzbekistan": "乌兹别克斯坦",
        "Vanuatu": "瓦努阿图",
        "Vatican City": "梵蒂冈",
        "Venezuela": "委内瑞拉",
        "Viet Nam": "越南",
        "Virgin Islands": "维尔京群岛",
        "Wallis and Futuna": "瓦利斯和富图纳",
        "Western Sahara": "西撒哈拉",
        "Yemen": "也门",
        "Zambia": "赞比亚",
        "Zimbabwe": "津巴布韦",

        // ========== 颜色 ==========
        "Black": "Black (黑色)",
        "Dark Gray": "Dark Gray (暗灰色)",
        "Gray": "Gray (灰色)",
        "Medium Gray": "Medium Gray (中灰色)",
        "Light Gray": "Light Gray (浅灰色)",
        "White": "White (白色)",
        "Deep Red": "Deep Red (深红色)",
        "Dark Red": "Dark Red (暗红色)",
        "Red": "Red (红色)",
        "Light Red": "Light Red (浅红色)",
        "Dark Orange": "Dark Orange (暗橙色)",
        "Orange": "Orange (橙色)",
        "Gold": "Gold (金色)",
        "Yellow": "Yellow (黄色)",
        "Light Yellow": "Light Yellow (浅黄色)",
        "Dark Goldenrod": "Dark Goldenrod (暗金菊色)",
        "Goldenrod": "Goldenrod (金菊色)",
        "Light Goldenrod": "Light Goldenrod (浅金菊色)",
        "Dark Olive": "Dark Olive (暗橄榄色)",
        "Olive": "Olive (橄榄色)",
        "Light Olive": "Light Olive (浅橄榄色)",
        "Dark Green": "Dark Green (暗绿色)",
        "Green": "Green (绿色)",
        "Light Green": "Light Green (浅绿色)",
        "Dark Teal": "Dark Teal (暗鸭绿色)",
        "Teal": "Teal (鸭绿色)",
        "Light Teal": "Light Teal (浅鸭绿色)",
        "Dark Cyan": "Dark Cyan (暗青色)",
        "Cyan": "Cyan (青色)",
        "Light Cyan": "Light Cyan (浅青色)",
        "Dark Blue": "Dark Blue (暗蓝色)",
        "Blue": "Blue (蓝色)",
        "Light Blue": "Light Blue (浅蓝色)",
        "Dark Indigo": "Dark Indigo (暗靛色)",
        "Indigo": "Indigo (靛色)",
        "Light Indigo": "Light Indigo (浅靛色)",
        "Dark Slate Blue": "Dark Slate Blue (暗岩蓝色)",
        "Slate Blue": "Slate Blue (岩蓝色)",
        "Light Slate Blue": "Light Slate Blue (浅岩蓝色)",
        "Dark Purple": "Dark Purple (暗紫色)",
        "Purple": "Purple (紫色)",
        "Light Purple": "Light Purple (浅紫色)",
        "Dark Pink": "Dark Pink (暗粉红色)",
        "Pink": "Pink (粉红色)",
        "Light Pink": "Light Pink (浅粉红色)",
        "Dark Peach": "Dark Peach (暗桃色)",
        "Peach": "Peach (桃色)",
        "Light Peach": "Light Peach (浅桃色)",
        "Dark Brown": "Dark Brown (暗棕色)",
        "Brown": "Brown (棕色)",
        "Light Brown": "Light Brown (浅棕色)",
        "Dark Tan": "Dark Tan (暗日晒色)",
        "Tan": "Tan (日晒色)",
        "Light Tan": "Light Tan (浅日晒色)",
        "Dark Beige": "Dark Beige (暗米色)",
        "Beige": "Beige (米色)",
        "Light Beige": "Light Beige (浅米色)",
        "Dark Stone": "Dark Stone (暗岩棕色)",
        "Stone": "Stone (岩棕色)",
        "Light Stone": "Light Stone (浅岩棕色)",
        "Dark Slate": "Dark Slate (暗岩灰色)",
        "Slate": "Slate (岩灰色)",
        "Light Slate": "Light Slate (浅岩灰色)",
        "Transparent": "Transparent (透明)",


        // ========== 商店页面 & 联盟页面 ==========
        "Droplets": "小液滴",
        //"+5 Max. Charges": "像素点储备上限+5",
        "Increase your maximum paint charges capacity": "让你能够储备更多的像素点",
        //"+30 Paint Charges": "现有可用像素点立即+30",
        "Recharge paint charges": "恢复你的像素点储备",
        "MAX": "最大",
        "Profile": "个人资料",
        "Profile picture": "头像",
        "Add a new 16x16 profile picture": "新建一张大小为 16x16 的头像",
        "Flags": "旗帜",
        "Display your country’s flag next to your username. Plus, when painting in regions where you own the corresponding flag, you recover 10% of the charges spent.": "在自己的用户名一旁展示自己所属国家或地区的旗帜。此外，在该旗帜对应区域境内放置任意数量的像素点，放置完成后将返还所消耗像素点的 10%。（例如，一次性放置 75 个，放置完成后将返还 7【向下取整】个像素点；一次性放置 7 个，放置完成后将返还 0【向下取整】个像素点。）",
        "Show more": "更多",
        "Show less": "收起",
        "Items": "购买项",
        "Get more charges": "多储备一些像素点",
        //"You gain 1 droplet per pixel painted and 500 droplets per level": "每放置一个像素点，你将获得一颗小液滴；每升一级，你将获得 500 颗小液滴",
        "You gain 1 droplet per pixel painted and 500 droplets per niveau": "每放置一个像素点，你将获得一颗小液滴；每升一级，你将获得 500 颗小液滴",
        "Not enough droplets": "液滴数不足",
        "+0 bonus": "无赠送政策",
        "75,000 Droplets": "75000 颗小液滴",
        "+3,750 bonus": "，购买即多赠 3750 颗",
        "150,000 Droplets": "150000 颗小液滴",
        "+15,000 bonus": "，购买即多赠 15000 颗",
        "250,000 Droplets": "250000 颗小液滴",
        "+37,500 bonus": "，购买即多赠 37500 颗",
        "375,000 Droplets": "375000 颗小液滴",
        "+75,000 bonus": "，购买即多赠 75000 颗",
        "500,000 Droplets": "500000 颗小液滴",
        "+125,000 bonus": "，购买即多赠 125000 颗",
        "For refund requests and processing details, please see our": "若有退款需求或需查询退款流程细项，请参阅我们的",
        "Flag without region on the map": "该旗帜在地图上无对应区域",
        "The flag of": "该旗帜代表",
        "does not have corresponding areas on the map and will only have cosmetic effects.": "，其在地图上无对应区域，装备该旗帜仅起全局装饰效果。",
        "No corresponding region on the map (cosmetic effect only)": "地图上无该旗帜对应区域（仅起全局装饰效果）",
        "Members:": "成员总数：",
        "Headquarters:": "大本营坐标：",
        "Player": "成员",
        "Leave alliance": "离开当前联盟",


        //倒计时
        //不管是正则还是直接写，都没有效果，必须要联系官方做好i18n才可以
        /*"Next charge in 0:29": "将于 0:29 后恢复一像素点储备",
        "Next charge in 0:28": "将于 0:28 后恢复一像素点储备",
        "Next charge in 0:27": "将于 0:79 后恢复一像素点储备",
        "Next charge in 0:26": "将于 0:26 后恢复一像素点储备",
        "Next charge in 0:25": "将于 0:25 后恢复一像素点储备",
        "Next charge in 0:24": "将于 0:24 后恢复一像素点储备",
        "Next charge in 0:23": "将于 0:23 后恢复一像素点储备",
        "Next charge in 0:22": "将于 0:22 后恢复一像素点储备",
        "Next charge in 0:21": "将于 0:21 后恢复一像素点储备",
        "Next charge in 0:20": "将于 0:20 后恢复一像素点储备",
        "Next charge in 0:19": "将于 0:19 后恢复一像素点储备",
        "Next charge in 0:18": "将于 0:18 后恢复一像素点储备",
        "Next charge in 0:17": "将于 0:17 后恢复一像素点储备",
        "Next charge in 0:16": "将于 0:16 后恢复一像素点储备",
        "Next charge in 0:15": "将于 0:15 后恢复一像素点储备",
        "Next charge in 0:14": "将于 0:14 后恢复一像素点储备",
        "Next charge in 0:13": "将于 0:13 后恢复一像素点储备",
        "Next charge in 0:12": "将于 0:12 后恢复一像素点储备",
        "Next charge in 0:11": "将于 0:11 后恢复一像素点储备",
        "Next charge in 0:10": "将于 0:10 后恢复一像素点储备",
        "Next charge in 0:09": "将于 0:09 后恢复一像素点储备",
        "Next charge in 0:08": "将于 0:08 后恢复一像素点储备",
        "Next charge in 0:07": "将于 0:07 后恢复一像素点储备",
        "Next charge in 0:06": "将于 0:06 后恢复一像素点储备",
        "Next charge in 0:05": "将于 0:05 后恢复一像素点储备",
        "Next charge in 0:04": "将于 0:04 后恢复一像素点储备",
        "Next charge in 0:03": "将于 0:03 后恢复一像素点储备",
        "Next charge in 0:02": "将于 0:02 后恢复一像素点储备",
        "Next charge in 0:01": "将于 0:01 后恢复一像素点储备",*/

        // 其他常见文本
        "Version": "当前版本",
        "Unlock": "需解锁",
        "Unlocked": "已解锁",
        "Pixel:": "坐标：",
        "Permanently unlock the color": "一次花费，永久使用",
        "No country found.": "未搜索到相关国家或地区（仅支持搜索英语世界通行称谓或其变体，如 Viet Nam，Türkiye）",
        "Wplace is a collaborative, real-time pixel canvas layered over the world map, where anyone can paint and create art together.": "Wplace 是一片覆盖在世界地图图层之上的协作式实时像素画布，任何人都可以在其上进行绘画，创作艺术。",

        //JS 中的文本
        "Phone verification required": "需验证您的手机号码",
        "Could not install the app:": "未能作为应用安装：",
        "Install App": "作为应用安装：",
        "Hide UI": "隐藏 UI",
        "Change picture": "更换头像",
        "Are you absolutely sure?": "是否确定删除账户？",
        "This will permanently delete your account and all associated data. This action cannot be undone.": "进行该操作后，你的账户将被永久删除，所有相关数据也将一并被抹除。该操作无法被撤销。",
        "This action is irreversible, do you want to proceed? Please confirm by entering your username:": "账户被删除后，你将没有反悔机会，是否的确需要删除账户？若已确认，请在下方输入你的用户名：",
        "Type your username": "请在此输入你的用户名",
        "Does not need to be equipped to provide the bonus": "即便不装备旗帜，在相应区域进行绘制，像素点返还政策依然生效",
        "Equipped": "已装备",
        "Equip": "装备",
        "You can paint more than 1 pixel": "你有复数个像素点可用于绘制",
        "Not set": "尚未设置",
        "You are not in an alliance": "您未加入联盟",
        "Get invited to an alliance": "您可以以受邀请的形式加入联盟",
        "OR": "也可以",
        "Create an alliance": "组建一个联盟",
        "Invite link": "联盟邀请链接",
        "Send the link below to everybody you want to invite to the alliance": "您可以把下方链接发送给您希望他们加入自己联盟的人",
        "Copied": "链接已复制",
        "No description": "无描述",
        "Invite": "邀请",
        "this week": "（截至本周）",
        "this month": "（截至本月）",
        "Last pixel": "最近活动位置",
        "Create alliance": "组建联盟",
        "Alliance Name": "联盟名称",
        "Create": "组建",
        "ADMIN": "管理",
        "admin": "管理",
        "Give admin": "授予其联盟管理身份",
        "Ban from alliance": "封禁该成员",
        "No action": "无可执行操作",
        "Unban": "解封",
        "No banned users": "尚无被封禁的成员",
        "Update": "更新",
        "Error giving admin to user": "授予该成员联盟管理身份时出现错误",
        "Users": "联盟成员",
        "Banned": "已封禁",
        "Limit reached": "已达上限",
        "Select the headquarters location": "请选择联盟大本营位置",
        "Pixels painted inside the country": "放置于该国家/区域内像素点的总数目",
        "You are not allowed to use multiple accounts. Use your main account to paint.": "禁止单人使用多个账户进行绘制。请使用你的主账户。",
        "SMS sent to": "已将短信发送至",
        "Phone successfully verified": "手机号码验证成功",
        "Not a valid phone number": "该手机号码无效",
        "Giving admin to user": "正在授予该用户联盟管理身份",
        "Profile updated": "已更新个人资料",
        "Account successfully deleted": "成功删除账户",
        "Could not logout. Try refreshing the page.": "退出登录失败。请尝试刷新页面。",
        "Phone verification": "验证手机号码",
        "Please verify your phone number to continue playing. This helps us keep bots out and ensure a safe, creative experience for everyone.": "如需继续游玩，请您验证手机号码。该操作有助于我们防范机器人账户，为全体用户创造安全的，洋溢着创造力的创作环境",
        "Send Code": "发送验证码",
        "Input the code": "输入验证码",
        "Sent to": "发送至",
        "Resend Code": "重新发送",
        "Try another number": "请尝试其他手机号码",
        "Moderation": "Moderation",
        "Clear area": "清理区域",
        "Select the area's first corner": "选择需清理区域的一个顶点",
        "Select the area's opposite corner": "选择需清理区域的对向顶点",
        "Dark mode": "深色模式",
        "Light mode": "浅色模式",

        // chunk 中的 JS 文本
        "Unexpected server error. Try again later.": "服务器发生意外错误。请稍后重试。",
        "You need to be logged in to paint": "登录本站，即可进行绘画",
        "You do not have enough charges to paint. Erase some pixels.": "现有可用像素点不足。请擦除一些像素点。",
        "Error while painting:": "绘制时出现错误：",
        "Invalid phone number": "该手机号码无效",
        "Phone already used": "该手机号码已被使用",
        "You have to wait to resend a code": "请稍作等候，再重新发送验证码",
        "Invalid code": "验证码错误",
        "Operation not allowed. Maybe you have too many favorite locations.": "不允许执行该操作。您收藏的位置可能已达上限。",
        "Location name is too big (max. 128 characters)": "位置名称过长（上限为 128 个英语字符）",
        "Couldn't complete the purchase. This item does not exist.": "购买失败。该购买项不存在。",
        "You do not have enough droplets to buy this item.": "液滴数不足，无法购买该项目。",
        "You already have this item. Please refresh the page.": "您已拥有该购买项。请刷新页面。",
        "Alliance name exceeded the maximum number of characters": "联盟名称超出最大字符上限",
        "Alliance name already taken": "该联盟名称已存在",
        "Alliance with empty name": "联盟名称为空",
        "You are already in an alliance": "您此前已加入联盟",
        "You are not allowed to do this": "您无法做出该操作",
        "You or someone in your network is making a lot of requests to the server. Try again later.": "您或与您处于同一网络中的人向服务器发出了过量请求。请稍后再试。",
        "We’re currently experiencing high traffic. Some requests may not be processed at this time—please try again later. Thank you for your patience": "本站目前处于流量高峰期，部分请求此时可能无法得到处理，请稍后再试。感谢您的耐心等待。",
        "You are not allowed to do this": "您无法做出该操作",
    };

    console.log('[Wplace汉化] 翻译字典已加载，包含', Object.keys(translations).length, '个条目');

    // 标记已翻译的元素，避免重复处理。
    // 注意：此属性现在主要用于标记元素自身的*属性*是否已被处理，
    // 不再用于阻止对该元素内部*文本节点*的独立检查。
    const TRANSLATED_ATTRIBUTE = 'data-wplace-translated';

    // 翻译计数器
    let translationCount = 0;

    /**
     * 翻译文本节点
     * @param {Node} textNode - 文本节点
     */
    function translateTextNode(textNode) {
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

        const originalText = textNode.textContent.trim();
        if (!originalText) return;

        // --- 现有倒计时文本的正则表达式匹配和翻译 ---
        const countdownRegex = /^Next charge in (\d+):(\d{2})$/;
        const matchCountdown = originalText.match(countdownRegex);

        if (matchCountdown) {
            const minutes = matchCountdown[1];
            const seconds = matchCountdown[2];
            const translatedCountdown = `将于 ${minutes}:${seconds} 后恢复一像素点储备`;

            if (textNode.textContent !== translatedCountdown) {
                textNode.textContent = translatedCountdown;
                translationCount++;
                console.log('[Wplace汉化] 倒计时翻译:', originalText, '->', translatedCountdown);
            }
            return;
        }
        // --- End 现有倒计时部分 ---

        // --- 现有动态 “+N Max. Charges” 和 “+N Paint Charges” 文本的正则表达式匹配和翻译 ---
        const maxChargesRegex = /^\+(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\sMax\.\sCharges$/;
        const matchMaxCharges = originalText.match(maxChargesRegex);

        if (matchMaxCharges) {
            const amount = matchMaxCharges[1];
            const translatedText = `像素点储备上限+${amount}`;

            if (textNode.textContent !== translatedText) {
                textNode.textContent = translatedText;
                translationCount++;
                console.log('[Wplace汉化] 动态文本翻译: ', originalText, '->', translatedText);
            }
            return;
        }

        const paintChargesRegex = /^\+(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\sPaint\sCharges$/;
        const matchPaintCharges = originalText.match(paintChargesRegex);

        if (matchPaintCharges) {
            const amount = matchPaintCharges[1];
            const translatedText = `现有可用像素点立即+${amount}`;

            if (textNode.textContent !== translatedText) {
                textNode.textContent = translatedText;
                translationCount++;
                console.log('[Wplace汉化] 动态文本翻译: ', originalText, '->', translatedText);
            }
            return;
        }
        // --- End 现有动态 Charges 部分 ---


        // --- 新增：像素坐标文本的正则表达式匹配和翻译 ---
        // 匹配 "Pixel: X, Y" 格式
        const pixelCoordsRegex = /^Pixel:\s*(-?\d+),\s*(-?\d+)$/;
        const matchPixelCoords = originalText.match(pixelCoordsRegex);

        if (matchPixelCoords) {
            const xCoord = matchPixelCoords[1];
            const yCoord = matchPixelCoords[2];
            const translatedText = `坐标：${xCoord}, ${yCoord}`;

            if (textNode.textContent !== translatedText) {
                textNode.textContent = translatedText;
                translationCount++;
                console.log('[Wplace汉化] 像素坐标翻译:', originalText, '->', translatedText);
            }
            return;
        }

        // 匹配 "(Tl X: ..., Tl Y: ..., Px X: ..., Px Y: ...)" 格式
        // 这里的数字也可能是负数，所以使用 -?\d+
        const fullCoordsRegex = /^\(Tl X:\s*(-?\d+),\s*Tl Y:\s*(-?\d+),\s*Px X:\s*(-?\d+),\s*Px Y:\s*(-?\d+)\)$/;
        const matchFullCoords = originalText.match(fullCoordsRegex);

        if (matchFullCoords) {
            const tlX = matchFullCoords[1];
            const tlY = matchFullCoords[2];
            const pxX = matchFullCoords[3];
            const pxY = matchFullCoords[4];
            // 这里我们只翻译前缀，保持数字不变，如果需要更复杂的翻译，可以调整
            const translatedText = `(TlX: ${tlX}, TlY: ${tlY}, Px X: ${pxX}, Px Y: ${pxY})`;
            // 如果希望更简洁，可以将 `瓦片X`, `瓦片Y` 等也定义在字典中，或者直接用变量。
            // 考虑到原始信息为 "Tl X", "Px X", 保持原始前缀结合中文释义可能更清晰。

            if (textNode.textContent !== translatedText) {
                textNode.textContent = translatedText;
                translationCount++;
                console.log('[Wplace汉化] 完整坐标翻译:', originalText, '->', translatedText);
            }
            return;
        }
        // --- End 新增：像素坐标部分 ---


        // 原有的字典查找逻辑：仅当原始文本在字典中，且当前文本内容与翻译后的文本不同时才进行翻译
        if (translations[originalText] && textNode.textContent !== translations[originalText]) {
            textNode.textContent = translations[originalText];
            translationCount++;
            console.log('[Wplace汉化] 文本翻译:', originalText, '->', translations[originalText]);
        }
    }


    /**
     * 翻译元素属性
     * @param {Element} element - DOM元素
     */
    function translateElementAttributes(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        let translatedAnyAttribute = false;

        // 翻译title属性
        const title = element.getAttribute('title');
        if (title && translations[title] && title !== translations[title]) {
            element.setAttribute('title', translations[title]);
            translatedAnyAttribute = true;
            translationCount++;
            console.log('[Wplace汉化] 标题翻译:', title, '->', translations[title]);
        }

        // 翻译placeholder属性
        const placeholder = element.getAttribute('placeholder');
        if (placeholder && translations[placeholder] && placeholder !== translations[placeholder]) {
            element.setAttribute('placeholder', translations[placeholder]);
            translatedAnyAttribute = true;
            translationCount++;
            console.log('[Wplace汉化] 占位符翻译:', placeholder, '->', translations[placeholder]);
        }

        // 翻译aria-label属性
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel && translations[ariaLabel] && ariaLabel !== translations[ariaLabel]) {
            element.setAttribute('aria-label', translations[ariaLabel]);
            translatedAnyAttribute = true;
            translationCount++;
            console.log('[Wplace汉化] 无障碍标签翻译:', ariaLabel, '->', translations[ariaLabel]);
        }

        // --- 新增：翻译data-tip属性 ---
        const dataTip = element.getAttribute('data-tip');
        if (dataTip && translations[dataTip] && dataTip !== translations[dataTip]) {
            element.setAttribute('data-tip', translations[dataTip]);
            translatedAnyAttribute = true;
            translationCount++;
            console.log('[Wplace汉化] Data-tip翻译:', dataTip, '->', translations[dataTip]);
        }
        // --- End 新增部分 ---

        // 如果有任何属性被翻译，就标记此元素。
        if (translatedAnyAttribute) {
            element.setAttribute(TRANSLATED_ATTRIBUTE, 'true');
        }
    }

    /**
     * 深度遍历并翻译节点
     * @param {Node} node - 要遍历的节点
     */
    function translateNode(node) {
        if (!node) return;

        if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 翻译当前元素自身的属性
            translateElementAttributes(node);

            // 遍历子节点
            const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: function(node) {
                        // 优化：移除此过滤器。
                        // 每个文本节点应独立进行翻译检查，不再依赖父元素的 TRANSLATED_ATTRIBUTE。
                        // translateTextNode 内部的 `textNode.textContent !== translations[originalText]` 检查已足够防止重复。
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );

            let currentNode = walker.nextNode();
            while (currentNode) {
                if (currentNode.nodeType === Node.TEXT_NODE) {
                    translateTextNode(currentNode);
                } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                    // 对子元素的属性进行翻译。
                    // 递归调用 translateElementAttributes 已经包含在此处，因为它在 walker 遍历到的每个 Element 节点上都会被调用
                     translateElementAttributes(currentNode);
                }
                currentNode = walker.nextNode();
            }
        }
    }

    /**
     * 翻译页面元数据
     */
    function translateMetadata() {
        console.log('[Wplace汉化] 开始翻译页面元数据...');

        // 设置语言属性
        if (document.documentElement) {
            document.documentElement.lang = 'zh-CN';
            console.log('[Wplace汉化] 页面语言已设置为 zh-CN');
        }

        // 翻译页面标题
        if (document.title && translations[document.title] && document.title !== translations[document.title]) { // Added check for difference
            const originalTitle = document.title;
            document.title = translations[document.title];
            console.log('[Wplace汉化] 页面标题翻译:', originalTitle, '->', document.title);
            translationCount++;
        }

        // 翻译meta标签
        const metaSelectors = [
            'meta[property="og:title"]',
            'meta[name="twitter:title"]',
            'meta[name="description"]',
            'meta[itemprop="description"]',
            'meta[property="og:description"]',
            'meta[name="twitter:description"]',
            'meta[name="keywords"]',
            'meta[name="apple-mobile-web-app-title"]'
        ];

        metaSelectors.forEach(selector => {
            const metaElement = document.querySelector(selector);
            if (metaElement) {
                const content = metaElement.getAttribute('content');
                if (content && translations[content] && content !== translations[content]) {
                    const originalContent = content;
                    metaElement.setAttribute('content', translations[content]);
                    console.log('[Wplace汉化] Meta标签翻译:', originalContent, '->', translations[content]);
                    translationCount++;
                }
            }
        });
    }

    /**
     * 初始化MutationObserver
     */
    function initMutationObserver() {
        console.log('[Wplace汉化] 初始化DOM变化监听器...');

        const observer = new MutationObserver((mutations) => {
            let hasChanges = false;
            // 优化：避免在每次 mutation 都重新遍历整个 body
            // 遍历 mutaions 时，检查 mutation.target 并根据类型决定如何处理
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                            translateNode(node); // 深度翻译新添加的节点
                            hasChanges = true;
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    // 仅翻译被修改的元素属性
                    translateElementAttributes(mutation.target);
                    // translatedAnyAttribute logic inside translateElementAttributes already handles console.log
                    hasChanges = true;
                } else if (mutation.type === 'characterData') {
                    // 监听文本节点内容的改变
                    translateTextNode(mutation.target);
                    hasChanges = true;
                }
            });

            if (hasChanges && translationCount > 0) { // Using translationCount for a more granular log when actual translations happen
                console.log('[Wplace汉化] 本轮DOM变化处理完成');
            }
        });

        // 配置观察选项
        const config = {
            childList: true, // 监听子节点的添加或移除
            subtree: true, // 监听所有子孙节点的变化
            attributes: true, // 监听属性变化
            attributeFilter: ['title', 'placeholder', 'aria-label', 'data-tip'], // 过滤特定属性
            characterData: true // 新增：监听文本节点内容的改变
        };

        // 开始观察
        observer.observe(document.body, config);
        console.log('[Wplace汉化] DOM变化监听器已启动');

        return observer;
    }

    /**
     * 翻译现有内容
     */
    function translateExistingContent() {
        console.log('[Wplace汉化] 开始翻译页面现有内容...');
        const startTime = Date.now();

        if (document.body) {
            const initialTranslationCount = translationCount; // 记录开始前的总翻译数
            translateNode(document.body);
            const currentRoundTranslations = translationCount - initialTranslationCount;
            const endTime = Date.now();
            console.log('[Wplace汉化] 现有内容翻译完成，耗时:', (endTime - startTime), 'ms，本轮翻译项目:', currentRoundTranslations, '累计翻译项目:', translationCount);
        }
    }

    /**
     * 主初始化函数
     */
    function init() {
        console.log('[Wplace汉化] 开始初始化...');

        // 立即翻译元数据
        translateMetadata();

        // 当DOM准备就绪时
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[Wplace汉化] DOM内容已加载，开始处理页面内容...');
                translateExistingContent();
                initMutationObserver();
            });
        } else {
            // DOM已经准备就绪
            console.log('[Wplace汉化] DOM已准备就绪，立即处理页面内容...');
            translateExistingContent();
            initMutationObserver();
        }

        // 监听页面可见性变化，用于SPA路由切换
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    console.log('[Wplace汉化] 页面重新可见，检查新内容...');
                    translateExistingContent();
                }, 100);
            }
        });

        // 监听pushstate和popstate事件（SPA路由变化）
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        // 确保 originalPopState 不为 null，因为 window.onpopstate 默认可能是 null
        const originalPopState = typeof window.onpopstate === 'function' ? window.onpopstate : null;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            setTimeout(() => {
                console.log('[Wplace汉化] 路由变化（pushState），重新翻译内容...');
                translateExistingContent();
            }, 200);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            setTimeout(() => {
                console.log('[Wplace汉化] 路由变化（replaceState），重新翻译内容...');
                translateExistingContent();
            }, 200);
        };

        window.onpopstate = function(...args) {
            if (originalPopState) { // 仅当原始 onpopstate 存在时才调用
                originalPopState.apply(window, args);
            }
            setTimeout(() => {
                console.log('[Wplace汉化] 路由变化（popstate），重新翻译内容...');
                translateExistingContent();
            }, 200);
        };

        console.log('[Wplace汉化] 初始化完成');
    }

    // 启动脚本
    init();

    // 添加全局状态查询函数（调试用）
    window.wplaceTranslator = {
        getTranslationCount: () => translationCount,
        getTranslations: () => translations,
        retranslate: () => {
            console.log('[Wplace汉化] 手动重新翻译...');
            translateExistingContent();
        }
    };

    console.log('[Wplace汉化] 脚本加载完成！可以通过 window.wplaceTranslator 访问调试功能');

})();