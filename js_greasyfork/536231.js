// ==UserScript==
// @name         SpankBang 汉化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  全面翻译 SpankBang 网站界面为中文，包括动态加载内容、输入框、标题等
// @author       ChatGPT
// @match        https://spankbang.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536231/SpankBang%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/536231/SpankBang%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 翻译映射表（优先写长句）
    const translationMap = {
        "dumplingcoke": "dumplingcoke",
        "dumpling coke": "dumpling coke",
        "We couldn't verify your email. Please check your email and complete the verification process.": "我们无法验证您的邮箱。请检查您的邮箱并完成验证流程。",
        "Liked porn videos": "点赞的色情视频",
        "Videos that you liked": "你点赞的视频",
        "Trending Porn Videos": "热门色情视频",
        "Welcome to Spankbang, your ultimate destination for some hot and steamy free porn videos! Dive into a world of sexual fantasies, adult entertainment, and unbound carnal pleasures. Whether you are in the mood for something more soft, mainstream and vanilla, or if you are into something more bold, kinky and naughty, Spankbang has you covered with a wide range of XXX videos. Boasting an impressive collection of scenes from countless categories, niches, pornstars, you will be able to indulge yourselves with sensual videos of hot, tight college aged teens touching themselves until they explode in wet orgasms, or some well- directed gonzo style sex scene, with rough, no-nonsense pacing, hot and famous porn stars getting fucked from one wet orgasms into another from your favorite positions. Join this thriving community where pleasure-seekers can converge to find their most niche type of porn, from the more tame, light BDSM sessions to some curated and beautifully choreographed latex play dominatrix sex scenes. Whether you are a connoisseur of this adult art, or just a curious explorer, on Spankbang you will find a treasure trove of naughtiness.": "欢迎来到 Spankbang——你尽情享受火辣激情免费视频的终极天堂！在这里，你可以沉浸于性幻想、成人娱乐和无尽的肉欲快感。无论你喜欢温柔主流的“香草”风格，还是大胆、怪癖和调皮的内容，Spankbang都能满足你，拥有丰富多样的XXX视频。我们汇集了无数类别、细分领域和知名女优的精彩片段，让你尽情欣赏：从火辣紧致的大学生自慰到高潮迭起的湿润体验；从节奏紧凑、直白粗犷的Gonzo风格性爱，到著名女优在你喜爱的体位中尽情享受连绵不断的高潮。加入这个蓬勃发展的社区，和众多寻欢者一起探索你最钟爱的色情类型——无论是温和的轻度BDSM，还是精心策划、华丽编排的乳胶女王支配性爱场景。无论你是这门成人艺术的鉴赏家，还是好奇的探索者，Spankbang都将是你发现无尽欲望宝藏的最佳去处。",
        "Recommended Porn videos in": "推荐的色情视频 国家：",
        "Unbelievable Jav PMV": "超赞日本AV片混剪 Jav PMV",
        "Success": "成功",
        "Related Playlists": "相关播放列表",
        "Recent Porn Videos by": "最新发布的色情视频 作者：",
        "thumbs up": "点赞",
        "sorted by:": "排序方式：",
        "best": "精选",
        "new": "最新",
        "top": "热门",
        "Shake It": "摇起来",
        "Douyin": "抖音",
        "Sexy Bom": "骚舞",
        "Users": "用户",
        "Check this page again after watching a few videos.": "观看几个视频后，请再次查看此页面。",
        "Recommended videos for you": "为你推荐的视频",
        "You don't have any recommendations.": "您暂无任何推荐。",
        "Search porn videos": "搜索色情视频",
        "Resend Verification Email": "重新发送验证邮件",
        "Liked Videos": "点赞的视频",
        "Activity History": "观看记录",
        "Your Playlists": "你的播放列表",
        "Edit Member Account": "编辑账户",
        "Log out": "退出登录",
        "Content Partnership": "内容合作",
        "Content Creators": "内容创作者",
        "Terms of Service": "服务条款",
        "Privacy Policy": "隐私政策",
        "Português (Portugal)": "葡萄牙语（葡萄牙）",
        "For You": "为你推荐",
        "Straight": "异性恋",
        "Gay": "男同性恋",
        "Transexual": "变性人",
        "Lesbian": "女同性恋",
        "Content removal/DMCA": "内容移除/版权投诉 (DMCA)",
        "Content protection": "内容保护",
        "2257 statement": "2257 免责声明",
        "EU DSA": "欧盟数字服务法 (EU DSA)",
        "Mobile Version": "手机版",
        "© 2025 MMB Ventures LLC. SPANKBANG™. All rights reserved.": "© 2025 MMB Ventures LLC.SPANKBANG™.版权所有",
        "Upload": "上传",
        "Edit your account": "编辑您的账户",
        "Email address": "邮箱地址",
        "Trending Live Models": "热门直播主播",
        "Recent Porn Videos by Verified Creators": "认证作者的最新色情视频",
        "Embed this porn video": "嵌入此色情视频",
        "press enter to post": "按回车发送",
        "press": "按",
        "enter": "回车",
        "to post": "发送",
        "Leave a comment for this video": "发表评论",
        "Subscribe": "订阅",
        "Join Now": "立即加入",
        "Foot fetish sea RELAX sound.": "恋足癖海洋放松音效。",
        "Quality": "画质",
        "minutes": "分钟",
        "hd porn": "高清色情视频",
        "hardcore": "激烈性爱",
        "rachael cavalli": "蕾切尔·卡瓦利",
        "sadie summers": "萨迪·萨默斯",
        "missonary": "传统体位",
        "big tits": "大胸",
        "licking": "舔舐",
        "big dick": "大阴茎",
        "blonde": "金发女郎",
        "big ass": "大屁股",
        "babe": "美女",
        "brunette": "深色发女郎",
        "milf": "熟女",
        "cumshot": "射精镜头",
        "interracial": "跨种族",
        "amateur": "业余",
        "Eva Ray Keeps Her Stepdad Quiet By Pleasing His Stiff Meat": "伊娃·雷用嘴巴伺候继父，让他闭嘴",
        "Gender": "性别",
        "Male": "男性",
        "Female": "女性",
        "Country": "国家",
        "Nhdta พี่เลี้ยง": "Natural High 系列 - 保姆",
        "Birth year": "出生年份",
        "e.g. 1985 - Required by law, you need to be at least 18.": "例如 1985 - 法律要求，您必须至少18岁。",
        "New password": "新密码",
        "Update account": "更新账户",
        "Linked accounts": "已关联账户",
        "Link your account with Google": "将您的账户与谷歌关联",
        "Link your account if your Google email matches your existing user email.": "如果您的谷歌邮箱与现有用户邮箱匹配，请关联您的账户。",
        "Email Preferences": "邮件偏好设置",
        "Special Promotions and Product Information": "特别促销及产品信息",
        "Receive emails from us about special promotions, important site updates and other valuable information.": "接收我们发送的特别促销、重要网站更新及其他有价值的信息。",
        "Save Email Preferences": "保存邮件偏好设置",
        "Delete account": "删除账户",
        "Your avatar": "您的头像",
        "Edit Account": "编辑账户",
        "Change your profile picture": "更换您的头像",
        "Afghanistan": "阿富汗",
        "Åland Islands": "奥兰群岛",
        "Albania": "阿尔巴尼亚",
        "Algeria": "阿尔及利亚",
        "American Samoa": "美属萨摩亚",
        "Andorra": "安道尔",
        "Angola": "安哥拉",
        "Anguilla": "安圭拉",
        "Antigua & Barbuda": "安提瓜和巴布达",
        "Argentina": "阿根廷",
        "Armenia": "亚美尼亚",
        "Aruba": "阿鲁巴",
        "Ascension Island": "阿森松岛",
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
        "Bosnia & Herzegovina": "波斯尼亚和黑塞哥维那",
        "Botswana": "博茨瓦纳",
        "Bouvet Island": "布韦岛",
        "Brazil": "巴西",
        "British Indian Ocean Territory": "英属印度洋领地",
        "British Virgin Islands": "英属维尔京群岛",
        "Brunei": "文莱",
        "Bulgaria": "保加利亚",
        "Burkina Faso": "布基纳法索",
        "Burundi": "布隆迪",
        "Cambodia": "柬埔寨",
        "Cameroon": "喀麦隆",
        "Canada": "加拿大",
        "Cape Verde": "佛得角",
        "Cayman Islands": "开曼群岛",
        "Central African Republic": "中非共和国",
        "Chad": "乍得",
        "Chile": "智利",
        "China": "中国",
        "Christmas Island": "圣诞岛",
        "Cocos (Keeling) Islands": "科科斯（基林）群岛",
        "Colombia": "哥伦比亚",
        "Comoros": "科摩罗",
        "Congo - Brazzaville": "刚果（布拉柴维尔）",
        "Congo - Kinshasa": "刚果（金夏沙）",
        "Cook Islands": "库克群岛",
        "Costa Rica": "哥斯达黎加",
        "Côte d’Ivoire": "科特迪瓦",
        "Croatia": "克罗地亚",
        "Cuba": "古巴",
        "Cyprus": "塞浦路斯",
        "Czechia": "捷克",
        "Denmark": "丹麦",
        "Djibouti": "吉布提",
        "Dominica": "多米尼加",
        "Dominican Republic": "多米尼加共和国",
        "Ecuador": "厄瓜多尔",
        "Egypt": "埃及",
        "El Salvador": "萨尔瓦多",
        "Equatorial Guinea": "赤道几内亚",
        "Eritrea": "厄立特里亚",
        "Estonia": "爱沙尼亚",
        "Eswatini": "斯威士兰",
        "Ethiopia": "埃塞俄比亚",
        "Falkland Islands": "福克兰群岛",
        "Faroe Islands": "法罗群岛",
        "Fiji": "斐济",
        "Finland": "芬兰",
        "France": "法国",
        "French Guiana": "法属圭亚那",
        "French Polynesia": "法属波利尼西亚",
        "French Southern Territories": "法属南部领地",
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
        "Guernsey": "根西岛",
        "Guinea": "几内亚",
        "Guinea-Bissau": "几内亚比绍",
        "Guyana": "圭亚那",
        "Haiti": "海地",
        "Heard & McDonald Islands": "赫德岛和麦克唐纳群岛",
        "Honduras": "洪都拉斯",
        "Hong Kong SAR China": "中国香港特别行政区",
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
        "Jersey": "泽西岛",
        "Jordan": "约旦",
        "Kazakhstan": "哈萨克斯坦",
        "Kenya": "肯尼亚",
        "Kiribati": "基里巴斯",
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
        "Macao SAR China": "中国澳门特别行政区",
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
        "Myanmar (Burma)": "缅甸",
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
        "Panama": "巴拿马",
        "Papua New Guinea": "巴布亚新几内亚",
        "Paraguay": "巴拉圭",
        "Peru": "秘鲁",
        "Philippines": "菲律宾",
        "Pitcairn Islands": "皮特凯恩群岛",
        "Poland": "波兰",
        "Portugal": "葡萄牙",
        "Puerto Rico": "波多黎各",
        "Qatar": "卡塔尔",
        "Réunion": "留尼汪",
        "Romania": "罗马尼亚",
        "Russia": "俄罗斯",
        "Rwanda": "卢旺达",
        "Samoa": "萨摩亚",
        "San Marino": "圣马力诺",
        "Ascension Island": "阿森松岛",
        "British Indian Ocean Territory": "英属印度洋领地",
        "British Virgin Islands": "英属维尔京群岛",
        "Cocos (Keeling) Islands": "科科斯（基林）群岛",
        "Congo - Brazzaville": "刚果（布拉柴维尔）",
        "Congo - Kinshasa": "刚果（金夏沙）",
        "Cook Islands": "库克群岛",
        "Equatorial Guinea": "赤道几内亚",
        "Falkland Islands": "福克兰群岛",
        "French Guiana": "法属圭亚那",
        "French Polynesia": "法属波利尼西亚",
        "French Southern Territories": "法属南部领地",
        "Greenland": "格陵兰",
        "Guadeloupe": "瓜德罗普",
        "Guam": "关岛",
        "Guernsey": "根西岛",
        "Isle of Man": "马恩岛",
        "Jersey": "泽西岛",
        "Kosovo": "科索沃",
        "Kyrgyzstan": "吉尔吉斯斯坦",
        "Laos": "老挝",
        "Macau SAR China": "中国澳门特别行政区",
        "Mayotte": "马约特",
        "Micronesia": "密克罗尼西亚",
        "Moldova": "摩尔多瓦",
        "Montenegro": "黑山",
        "Montserrat": "蒙特塞拉特",
        "Nauru": "瑙鲁",
        "New Caledonia": "新喀里多尼亚",
        "Niue": "纽埃",
        "Norfolk Island": "诺福克岛",
        "North Korea": "朝鲜",
        "North Macedonia": "北马其顿",
        "Northern Mariana Islands": "北马里亚纳群岛",
        "Palau": "帕劳",
        "Pitcairn Islands": "皮特凯恩群岛",
        "Puerto Rico": "波多黎各",
        "Réunion": "留尼汪",
        "Sao Tomé & Príncipe": "圣多美和普林西比",
        "Saudi Arabia": "沙特阿拉伯",
        "Senegal": "塞内加尔",
        "Serbia": "塞尔维亚",
        "Seychelles": "塞舌尔",
        "Sierra Leone": "塞拉利昂",
        "Singapore": "新加坡",
        "Slovakia": "斯洛伐克",
        "Slovenia": "斯洛文尼亚",
        "Solomon Islands": "所罗门群岛",
        "Somalia": "索马里",
        "South Africa": "南非",
        "South Georgia & South Sandwich Islands": "南乔治亚岛和南桑威奇群岛",
        "South Korea": "韩国",
        "Sri Lanka": "斯里兰卡",
        "St. Helena": "圣赫勒拿",
        "St. Kitts & Nevis": "圣基茨和尼维斯",
        "St. Lucia": "圣卢西亚",
        "St. Pierre & Miquelon": "圣皮埃尔和密克隆",
        "St. Vincent & Grenadines": "圣文森特和格林纳丁斯",
        "Svalbard & Jan Mayen": "斯瓦尔巴和扬马延",
        "Syria": "叙利亚",
        "Taiwan": "台湾",
        "Tajikistan": "塔吉克斯坦",
        "Tanzania": "坦桑尼亚",
        "Timor-Leste": "东帝汶",
        "Togo": "多哥",
        "Tokelau": "托克劳",
        "Tonga": "汤加",
        "Trinidad & Tobago": "特立尼达和多巴哥",
        "Tristan da Cunha": "特里斯坦-达库尼亚",
        "Turkmenistan": "土库曼斯坦",
        "Turks & Caicos Islands": "特克斯和凯科斯群岛",
        "U.S. Outlying Islands": "美国本土外小岛屿",
        "U.S. Virgin Islands": "美属维尔京群岛",
        "United Arab Emirates": "阿拉伯联合酋长国",
        "United Kingdom": "英国",
        "Uruguay": "乌拉圭",
        "Uzbekistan": "乌兹别克斯坦",
        "Vanuatu": "瓦努阿图",
        "Vatican City": "梵蒂冈",
        "Venezuela": "委内瑞拉",
        "Vietnam": "越南",
        "Wallis & Futuna": "瓦利斯和富图纳",
        "Yemen": "也门",
        "Zambia": "赞比亚",
        "Zimbabwe": "津巴布韦",
        "United States": "美国",
        "EN": "英语",
        "Your notifications": "你的通知",
        "result": "结果",
        "New achievement unlocked!": "新成就解锁！",
        "months": "月",
        "Giving Likes": "点赞",
        "Level": "等级",
        "This achievement is unlocked when users watch your videos.": "当用户观看你的视频时解锁此成就。",
        "Your achievements": "你的成就",
        "This achievement is unlocked when you like videos.": "当你点赞视频时解锁此成就。",
        "Watch": "观看",
        "Giving Likes": "点赞",
        "Medals:": "奖牌：",
        "Current points:": "当前积分：",
        "points are needed for the next level": "积分后升级",
        "This achievement is unlocked when users subscribe to your profile.": "当用户订阅你的主页时解锁此成就。",
        "Getting subscribers": "获得订阅者",
        "Search": "搜索",
        "porn": "色情",
        "Videos": "视频",
        "Getting Likes": "获得点赞",
        "Upcoming": "即将上线",
        "blowjob": "口交",
        "blowjob": "口交",
        "missionary": "传教士体位",
        "misionary": "传教士体位",
        "cowgirl": "女上位体位",
        "doggy": "后入式体位",
        "japanese": "日本风格",
        "professional": "专业的",
        "creampie": "内射",
        "min": "分钟",
        "All": "所有",
        "Likes": "点赞",
        "Achievements": "成就",
        "Porn playlists collection": "色情播放列表合集",
        "asian": "亚洲",
        "pmv": "PMV（视频混剪）",
        "homemade": "自制",
        "pantyhose": "丝袜",
        "pmv jav": "PMV JAV（日本成人视频混剪）",
        "dance fuck": "舞蹈性交",
        "pmv fuck": "PMV Fuck（性交视频混剪）",
        "Recommended": "推荐的",
        "videos": "视频",
        "Liked": "已点赞的",
        "views": "观看次数",
        "Activity": "活动",
        "History": "历史",
        "Your": "你的",
        "Playlists": "播放列表",
        "Subscriptions": "订阅",
        "Pornstars": "演员",
        "Notifications": "通知",
        "Comments": "评论",
        "Messages": "消息",
        "Broadcasts": "直播",
        "Edit": "编辑",
        "Member": "会员",
        "Account": "账户",
        "Log": "登出",
        "out": "退出",
        "Upload": "上传",
        "Download": "下载",
        "Login": "登录",
        "Sign Up": "注册",
        "Categories": "分类",
        "Tags": "标签",
        "Views": "观看次数",
        "Duration": "时长",
        "Share": "分享",
        "Report": "举报",
        "Premium": "高级会员",
        "Photos": "照片",
        "GIFs": "动图",
        "Live Cams": "直播",
        "Support": "支持",
        "Home": "首页",
        "Popular": "热门",
        "New": "最新",
        "Top Rated": "评分最高",
        "Most Viewed": "最多观看",
        "Longest": "最长",
        "Shortest": "最短",
        "HD": "高清",
        "SD": "标清",
        "No results found": "未找到结果",
        "Load more": "加载更多",
        "Show more": "显示更多",
        "Show less": "显示更少",
        "Related searches": "相关搜索",
        "Suggested": "推荐",
        "Trending": "热门",
        "Favorites": "收藏",
        "My Profile": "我的资料",
        "Settings": "设置",
        "Channels": "频道",
        "Creators": "创作者",
        "TV": "电视",
        "Gifs": "动图",
        "Shop": "商店",
        "Offers": "优惠",
        "English": "英语",
        "Español (América Latina)": "西班牙语（拉丁美洲）",
        "Español": "西班牙语",
        "Português (Brasil)": "葡萄牙语（巴西）",
        "Français": "法语",
        "Deutsch": "德语",
        "Nederland": "荷兰语",
        "Polski": "波兰语",
        "Türkçe": "土耳其语",
        "Italiano": "意大利语",
        "Русский": "俄语",
        "日本語": "日语",
        "Svenska": "瑞典语",
        "हिन्दी": "印地语",
        "ภาษาไทย": "泰语",
        "Bahasa Melayu": "马来语",
        "Bahasa Indonesia": "印尼语",
        "Erotic": "情色",
        "Seduction": "诱惑",
        "Intimate": "亲密",
        "Passion": "激情",
        "Temptation": "诱惑",
        "Desire": "欲望",
        "Pleasure": "快感",
        "Adult": "成人",
        "Fantasy": "幻想",
        "Exotic": "异国风情",
        "Wild": "狂野",
        "Sensual": "感官的",
        "Explicit": "露骨的",
        "Private": "私人",
        "Forbidden": "禁忌",
        "Hot": "火辣",
        "Sexy": "性感",
        "Naughty": "调皮",
        "Tease": "挑逗",
        "Playful": "俏皮",
        "Risque": "大胆的",
        "Tempting": "诱人的",
        "Desktop Version": "桌面版",
        "This achievement is unlocked when you subscribe to users or pornstars.": "当您订阅用户或色情明星时即可解锁此成就。",
        "More": "更多",
        "Close": "关闭",
        "Cams": "摄像头",
        "Live Cams": "直播摄像头",
        "Security Cams": "安防摄像头",
        "Webcams": "网络摄像头",
        "Cam Girls": "视频主播",
        "Cam Sites": "视频直播平台",
        "Adult Cams": "成人直播",
        "Cam Shows": "视频表演",
        "Camshaft": "凸轮轴",
        "Cam Mechanism": "凸轮机构",
        "Surveillance Cams": "监控摄像头",
        "Traffic Cams": "交通监控",
        "This achievement is unlocked when you watch videos.": "观看视频即可解锁此成就。",
        "Playlist": "播放列表",
        "This achievement is unlocked when you add videos to your playlists.": "当您将视频添加到播放列表时即可解锁此成就。",
        "This achievement is unlocked when users like your videos.": "当用户点赞您的视频时即可解锁此成就。",
        "This achievement is unlocked when you post comments on videos.": "当您在视频下发表评论时即可解锁此成就。",
        "This achievement is unlocked when users post comments on your videos.": "当用户在您的视频下发表评论时即可解锁此成就。",
        "Getting comments": "获得评论",
        "Posting comments": "发表评论",
        "TOP": "置顶",
        "TOP 10": "前十名",
        "TOP 50": "前五十名",
        "TOP 100": "前一百名",
        "TOP LIST": "排行榜",
        "TOP CHART": "冠军榜",
        "TOP RANK": "巅峰排名",
        "TOP VIEWED": "观看量最高",
        "TOP RATED": "评分最高",
        "TOP TRENDING": "热门榜首",
        "TOP PICKS": "精选推荐",
        "TOP CREATORS": "顶级创作者",
        "TOP CONTRIBUTORS": "贡献达人",
        "TOP PERFORMING": "表现最佳",
        "TOP VIDEO": "巅峰视频",
        "TOP COMMENT": "热评第一",
        "TOP DONATOR": "打赏榜首",
        "Top Tags": "热门标签",
        "Top Trending Tags": "飙升标签",
        "Top Search Tags": "热搜标签",
        "Top Content Tags": "热门内容标签",
        "Top Creator Tags": "创作者热门标签",
        "Top Category Tags": "分类热门标签",
        "Top Weekly Tags": "每周热门标签",
        "Top Monthly Tags": "每月热门标签",
        "Top All-Time Tags": "历史热门标签",
        "tags": "标签",
        "Chinese Av": "中国AV",
        "cum in mouth": "口内射精",
        "cum inside me": "体内射精",
        "Cum Twice": "二次射精",
        "Multiple Ejaculation": "多次射精",
        "Refractory Period": "贤者时间",
        "Orgasm": "性高潮",
        "cuckold": "绿帽情节",
        "Humiliation": "羞辱",
        "wife": "妻子",
        "account": "账户",
        "Your account": "你的账户",
        "user account": "用户账户",
        "account settings": "账户设置",
        "create an account": "创建账户",
        "login to your account": "登录您的账户",
        "account balance": "账户余额",
        "account security": "账户安全",
        "account management": "账户管理",
        "delete account": "删除账户",
        "account information": "账户信息",
        "account holder": "账户持有人",
        "Information": "信息",
        "Personal Information": "个人信息",
        "Account Information": "账户信息",
        "Contact Information": "联系信息",
        "Payment Information": "支付信息",
        "Important Information": "重要信息",
        "Additional Information": "附加信息",
        "Information Security": "信息安全",
        "Information Update": "信息更新",
        "Information Center": "信息中心",
        "Public Information": "公共信息",
        "Humiliation fantasy": "羞辱幻想",
        "Roleplay humiliation": "角色扮演羞辱",
        "Wife sharing": "伴侣共享",
        "Switch to Desktop?": "切换到电脑版？",
        "Verification Email Sent Successfully": "验证邮件已发送成功",
        "Return to Home Page": "返回首页",
        "We've sent a verification email to": "我们已发送验证邮件至",
        ". Please check your email inbox to verify your email address. If you didn't receive an email check your spam folder.": "。请检查您的邮箱并验证邮件地址。如未收到邮件，请查看垃圾邮件箱。",
        "For any issues, resend the verification email from your": "如遇任何问题，请前往",
        "page": "页面。",
        "Click here": "忘记密码？",
        "if you forgot your password!": "请点击此处！",
        "Sign in": "登录",
        "Don't have an account?": "没有账号？",
        "Join Now for FREE": "免费注册",
        "Your email address was successfully verified. Login now to complete your account.": "您的邮箱地址已验证成功。立即登录以完成账户设置。",
        "Continue with Google": "使用Google账号继续",
        "or": "或",
        "Account link is active.": "账户关联已生效。",
        "Revoke access": "撤销访问权限",
        "Body Building": "健身",
        "Bodybuilding Training": "健身训练",
        "Bodybuilding Gym": "健身房",
        "Bodybuilding Plan": "健身计划",
        "Azur_Lane": "碧蓝航线",
        "Discord": "Discord",
        "Can I be in your sex videos": "我可以出现在你的性爱视频里吗",
        "chinese": "中国",
        "girl": "女孩",
        "chinese girl": "中国女孩",
        "Hi": "嗨",
        "can any of you make an anal sex video of me": "你们中有人能帮我拍一个肛交视频吗",
        "(": "（",
        "the model": "该模特",
        ")": "）",
        "with the name of the title being my name": "标题用我的名字",
        "I have the link attached": "我已经附上链接",
        "The file can’t be downloaded it failed": "文件下载失败，无法完成下载",
        "It's an interesting premise as a character": "这个角色设定很有意思",
        "but I can't get over the fact that the account is run by a man lol": "但知道账号运营者是个男的还是让我有点绷不住哈哈",
        "Jennie": "Jennie",
        "The issue when videos cannot be viewed": "视频无法播放的问题",
        "Video playback failed": "视频播放失败",
        "Unable to load the video": "无法加载视频",
        "Video not available": "视频不可用",
        "Please check your network connection": "请检查您的网络连接",
        "This video is restricted in your region": "该视频在您所在地区受限",
        "Error Code 404: Video not found": "错误代码404：视频未找到",
        "Try refreshing the page or contact support": "请尝试刷新页面或联系支持团队",
        "looking for hmv": "寻找HMV",
        "hmv request": "HMV请求",
    };

    // 翻译文本函数
    function translateText(text) {
        if (!text || typeof text !== 'string') return text;

        const lowerText = text.toLowerCase();
        const entries = Object.entries(translationMap).sort((a, b) => b[0].length - a[0].length);

        // 1. 优先检测 key === value 的映射，且文本包含 key
        for (let [key, value] of entries) {
            if (key === value && lowerText.includes(key.toLowerCase())) {
                // 直接优先返回原文本（或你想保持原样的处理）
                return text;
            }
        }

        // 2. 其他情况，长key优先替换，忽略大小写
        for (let [key, value] of entries) {
            if (key !== value) {
                const re = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                if (re.test(text)) {
                    text = text.replace(re, value);
                }
            }
        }

        return text;
    }


    // 翻译所有文本节点
    function translateAllTextNodes() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const original = node.nodeValue;
            const translated = translateText(original);
            if (original !== translated) {
                node.nodeValue = translated;
            }
        }
    }

    // 翻译所有 placeholder
    function translatePlaceholders() {
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            const original = el.getAttribute('placeholder');
            const translated = translateText(original);
            if (original && translated && original !== translated) {
                el.setAttribute('placeholder', translated);
            }
        });
    }

    // 翻译 title 和 aria-label 属性
    function translateAttributes() {
        document.querySelectorAll('[title], [aria-label]').forEach(el => {
            if (el.hasAttribute('title')) {
                const title = el.getAttribute('title');
                const translated = translateText(title);
                if (title !== translated) {
                    el.setAttribute('title', translated);
                }
            }
            if (el.hasAttribute('aria-label')) {
                const label = el.getAttribute('aria-label');
                const translated = translateText(label);
                if (label !== translated) {
                    el.setAttribute('aria-label', translated);
                }
            }
        });
    }

    // 执行所有翻译
    function translateAll() {
        translateAllTextNodes();
        translatePlaceholders();
        translateAttributes();
    }

    // 创建复制菜单
    function createCopyMenu() {
        const styleContent = `
            .translation-copy-menu {
                position: absolute;
                display: none;
                background: #222;
                color: #eee;
                border: 1px solid #444;
                border-radius: 6px;
                z-index: 999999;
                font-family: Arial, sans-serif;
                user-select: none;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            }
            .translation-copy-btn {
                padding: 8px 12px;
                cursor: pointer;
                font-size: 14px;
                white-space: nowrap;
            }
            .translation-copy-btn:hover {
                background-color: #333;
            }
            .translation-copy-separator {
                border-top: 1px solid #555;
                margin: 0;
            }
        `;

        if (typeof GM_addStyle === 'function') {
            GM_addStyle(styleContent);
        } else {
            const style = document.createElement('style');
            style.textContent = styleContent;
            document.head.appendChild(style);
        }

        const menu = document.createElement('div');
        menu.className = 'translation-copy-menu';

        const copyOriginalBtn = document.createElement('div');
        copyOriginalBtn.className = 'translation-copy-btn';
        copyOriginalBtn.textContent = '复制原文';

        const separator = document.createElement('div');
        separator.className = 'translation-copy-separator';

        const copyTranslatedBtn = document.createElement('div');
        copyTranslatedBtn.className = 'translation-copy-btn';
        copyTranslatedBtn.textContent = '复制译文';

        menu.append(copyOriginalBtn, separator, copyTranslatedBtn);
        document.body.appendChild(menu);

        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
            } catch (e) {
                if (typeof GM_setClipboard === 'function') {
                    GM_setClipboard(text);
                } else {
                    alert('复制失败，请手动复制:\n' + text);
                }
            }
        }

        function findOriginalByTranslated(translatedText) {
            for (const [key, val] of Object.entries(translationMap)) {
                if (val === translatedText) return key;
            }
            return null;
        }

        function showMenu(x, y) {
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.display = 'block';
        }

        function hideMenu() {
            menu.style.display = 'none';
        }

        document.addEventListener('mouseup', (e) => {
            setTimeout(() => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed) {
                    hideMenu();
                    return;
                }
                const selectedText = selection.toString().trim();
                if (!selectedText) {
                    hideMenu();
                    return;
                }

                showMenu(e.pageX, e.pageY - 40);

copyTranslatedBtn.onclick = async () => {
    hideMenu();
    window.getSelection().removeAllRanges(); // 取消选中
    await copyToClipboard(selectedText);
};

copyOriginalBtn.onclick = async () => {
    const original = findOriginalByTranslated(selectedText);
    hideMenu();
    window.getSelection().removeAllRanges(); // 取消选中
    if (original) {
        await copyToClipboard(original);
    } else {
        await copyToClipboard(selectedText);
        alert('未找到对应的原文，已复制译文');
    }
};

            }, 10);
        });

        document.addEventListener('mousedown', (e) => {
            if (!menu.contains(e.target)) {
                hideMenu();
            }
        });
    }

    // 初始化
    translateAll();
    setTimeout(translateAll, 1000);
    setTimeout(translateAll, 3000);
    createCopyMenu();

    const observer = new MutationObserver(() => {
        clearTimeout(mutationTimer);
        mutationTimer = setTimeout(() => {
            translateAll();
        }, 300);
    });
    let mutationTimer;
    observer.observe(document.body, { childList: true, subtree: true });

})();