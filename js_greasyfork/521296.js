// ==UserScript==
// @name         Beyond-HD & BTN 汉化
// @namespace    https://greasyfork.org/zh-CN/users/1413398-babalala
// @version      1.9
// @description  Beyond-HD & BTN 汉化 .
// @author       BABAlala
// @match        https://beyond-hd.me/*
// @match        https://broadcasthe.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521296/Beyond-HD%20%20BTN%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521296/Beyond-HD%20%20BTN%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------- 汉化部分 --------------------
    const translations = {
        "BHD": {
            "Words": {
                "Downloaded": "已下载",
                "Uploaded": "已上传",
                "Buffer": "缓冲",
                "Ratio": "分享率",
                "Comments": "评论",
                "Forums": "论坛",
                "Requests": "求种",
                "Gaming": "游戏",
                "Other": "其他",
                "Enlisted": "已登记",
                "ATTEMPT": "尝试",
                "Snatches": "已完成",
                "Posts": "帖子",
                "Requested": "已求种",
                "Documentarian": "纪录片制作人/发布员",
                "Refunded": "已退款",
                "Refunds": "退款",
                "Viewed": "已阅",
                "Accept": "同意",
                "ACCOUNT": "账号",
                "Activity": "活跃度",
                "Age": "发布时长",
                "All": "全部",
                "Announcements": "公告",
                "Anything Goes": "随意",
                "Archive": "归档",
                "Audios": "音轨",
                "Available": "可用的",
                "Average": "平均",
                "Badges": "徽章",
                "Battles": "战斗",
                "Bets": "打赌",
                "Birthdays": "生日",
                "BitTorrent": "BT",
                "Blackmarket": "黑市",
                "Blockbusters": "大片",
                "BM": "收藏", // 建议改为 "书签" 更贴切
                "Bookmarks": "书签",
                "Bounty": "悬赏",
                //"Buffer": "缓冲", // 重复
                "By": "发布者",
                "Cancelled": "已取消",
                "Capped FL": "限制的免费",
                "Category": "分类",
                "Claimed": "已认领",
                "Classes": "等级",
                "Closed": "已关闭",
                "Codec": "编码",
                "Collectibles": "收藏品",
                "Community": "社区",
                "Completed": "已完成",
                "Comparisons": "对比",
                "Countries": "国家",
                "Covers": "封面",
                "Currencies": "货币",
                "Current": "当前的",
                "Descending": "降序",
                "Direction": "排序方向",
                "Discount": "折扣",
                "Donate": "捐赠",
                "Download": "下载",
                "Drafts": "草稿",
                "Encoding": "编码格式",
                "FAQ": "常见问题",
                "Features": "特性",
                "Film Club": "电影俱乐部",
                "Filtered": "已筛选",
                //"Forums": "论坛", // 重复
                "Freeleech": "免费",
                "Games": "游戏",
                "Genres": "类型",
                "Gift": "礼物",
                "Gifted": "已赠送",
                "Golden": "金色",
                "Health": "健康度",
                "Heists": "抢劫",
                "Help": "帮助",
                "Helpdesk": "帮助中心",
                "Home": "首页",
                "ID": "编号",
                "IMDB": "IMDB评分",
                "In": "发布于", // 保持原样或改为 "时间"
                "Info": "信息",
                "Internal": "内站发布",
                "Internals": "内站发布",
                "Introductions": "介绍",
                "Invite": "邀请",
                "LABS": "实验室",
                "Languages": "语言",
                "Last": "最后",
                "Leechers": "下载者",
                "Library": "资源库",
                "Lists": "列表",
                "Log": "日志",
                "Logout": "退出",
                "Manual": "手动",
                "Mediahub": "媒体中心",
                "Missing": "待补",
                "Movies": "电影",
                "Name": "名称",
                "Networking": "网络",
                "None": "无",
                "Official": "官方的",
                "Open": "开启",
                //"Other": "其他", // 重复
                "Overview": "概览",
                "Peers": "用户",
                "People": "影人",
                "Permanent": "永久的",
                "Polls": "投票",
                "Poster": "海报",
                "Private": "私有的",
                "Promos": "促销",
                "Quantity": "数量",
                "Rain Drops": "雨滴",
                //"Ratio": "分享率", // 重复
                "Ratings": "评分",
                "Read": "阅读",
                "Received": "收到",
                //"Refunded": "已退款", // 重复
                "Remuxing": "原盘压制",
                //"Requested": "已求种", // 重复
                //"Requests": "求种", // 重复
                "Rescues": "拯救",
                "Reseed": "补种",
                "Reset": "重置",
                "Restrictions": "限制",
                "Returns": "返回",
                "Rewards": "奖励",
                "Rewinds": "回顾",
                "Rules": "规则",
                "RT": "烂番茄评分",
                "Sandbox": "沙盒",
                "SD": "标清",
                "Search": "搜索",
                "Seeders": "做种者",
                "Silver": "银色",
                "Size": "大小",
                "Snatched": "已下载",
                "Sort": "排序",
                "Source": "来源",
                "Special": "特别版块",
                "Spent": "已花费",
                "Staff": "管理组",
                "Stats": "统计信息",
                "Store": "商店",
                "Subtitles": "字幕",
                "Superbads": "超级坏蛋",
                "Support": "技术支持",
                "Swaps": "交换",
                "Tasks": "任务",
                "Television": "电视剧",
                "Theatre": "剧院",
                "Ticket": "工单",
                "Tips": "小费",
                "Title": "标题",
                "Torrents": "种子",
                "Trending": "流行趋势",
                "TV Shows": "剧集",
                "TV Packs": "剧包",
                "Type": "类型",
                "Unaccepted": "未接受的",
                "Upload": "上传",
                "Uploader": "上传者",
                "Unsatisfied": "不满意的",
                "Vault": "金库",
                "Voted": "已投票",
                "Warnings": "警告",
                "Watchlist": "想看",
                "Workhouse": "工作坊",
                "Year": "年份",
                "Reviews": "剧评",
                "Recommendations": "推荐",
                "Knowledge": "知识库",
                "Browse": "浏览",
                "Foreign": "外语",
                "Collages": "合集",
                "Request":"请求",
                "Actors": "演员",
                "NFODb": "NFO 数据库",
                "WebIRC": "网页版 IRC",
                "Inbox": "收件箱",
                "Notifications": "通知",
                "Friends": "好友",
                "Bookmarks": "书签",
                "Invites": "邀请",
                "Donate": "捐赠",
                "Uploads": "上传列表",
                "Exchange": "兑换",
                "Stamps": "邮票",
                "Promotion": "晋升",
                "View": "查看",
                "Totals": "总计",
                "Profile": "个人资料",
                "Statistics": "统计",
                "Joined": "加入时间",
                "Invited": "已邀请",
                "Bonus": "奖励积分",
                "Hours": "小时",
                "Seeding": "做种中",
                "Seeding Size": "做种大小",
                "Downloaded": "已下载",
                "Snatched": "已完成",
                "Leeching": "下载中",
                "Subject": "主题",
                "Sender": "发送者",
                "Scrubs": "实习医生风云",
                "Comedy": "喜剧",
                "Containers": "容器格式",
                "Codecs": "编码",
                "Sources": "来源",
                "Resolutions": "分辨率",
                "Origins": "地区",
                "Wall": "留言板",
                "Shows": "剧集",
                "Recommendation": "推荐",
                "Donated": "已捐赠",
            },
            "Phrases": {
                // A
                "Active Downloads": "进行中的下载",
                "Active Rescues": "进行中的拯救",
                "Active Seed Size": "活跃种子大小",
                "Active Seeds": "活跃种子",
                "Active Topics": "活跃话题",
                "Active Warnings": "当前警告", // Duplicate
                "Additional Perks": "额外福利",
                "All Time Warnings": "所有警告", // Duplicate
                "Article Comments Made": "文章评论数",
                "Average Seedtime": "平均做种时间", // Duplicate
                "Available Invites": "可用邀请",
                // B
                "BeyondHD has a Discord server": "BeyondHD 有一个 Discord 服务器",
                "Bonus Points": "奖励积分", // Duplicate
                "Bounty Given": "发出的悬赏",
                "Bounty Received": "收到的悬赏",
                "Bypass Upload Check": "绕过上传检查",

                // C
                "Can Accept Gifts": "可接受礼物",
                "Can Comment": "可以评论",
                "Can Download": "可以下载",
                "Can Post": "可以发帖",
                "Can Request": "可以求种",
                "Certified Seeder": "认证做种者",
                "Client Blocklist": "客户端黑名单",
                "Closed Tickets": "已关闭工单",
                "Completed Rescues": "已完成的拯救",
                "Completed Seeds": "已完成的种子",

                // E
                "Edit Movie / TV Details": "编辑影视详情",
                "Enable Filters": "启用过滤",
                "Exchange BP for Buffer": "用BP兑换缓冲",

                // F
                "Filled Members Requests": "满足会员求种数",
                "FL Tokens": "免费令牌",
                "Forum Contests": "论坛竞赛", // Duplicate
                "Forum Games": "论坛游戏", // Duplicate

                // G
                "Gift Given": "赠送礼物",
                "Gift Received": "收到礼物", // Duplicate
                "Gift Sent": "送出礼物",
                "Gifted Tokens": "赠送的令牌",

                // H
                "Hero Seed Size": "英雄种子大小",

                // I
                "IMDB Top 250": "IMDB Top 250榜单",
                "IMPORTANT NOTICE": "重要通知",

                // L
                "Largest Pot Won": "赢得最大彩池",
                "Latest Posts": "最新帖子", // Duplicate
                "Latest Topics": "最新话题", // Duplicate
                "Likes Received": "收到的赞",

                // M
                "Min. BHD rating": "最低BHD评分", // Duplicate
                "Min. IMDB rating": "最小IMDB评分", // Duplicate
                "Min. TMDB rating": "最小TMDB评分", // Duplicate
                "Min. votes": "最小投票数", // Duplicate
                "My Badges": "我的勋章",
                "My Bookmarks": "我的书签",
                "My Collectibles": "我的收藏品",
                "My Harvests": "我的收获",
                "My Notifications": "我的通知",
                "My Posts": "我的帖子",
                "My Privacy": "隐私设置",
                "My Profile": "我的资料",
                "My Ratings": "我的评分",
                "My Security": "安全设置",
                "My Settings": "账号设置",
                "My Theme": "我的主题",
                "My Topics": "我的话题",
                "My Uploads": "我的上传",
                "My Viewed": "我的已阅",
                "My Watchlist": "我的想看",

                // N
                "Network Node": "网络节点", // Duplicate
                "New Request": "发布新求种", // Duplicate
                "News & Current Events": "新闻和时事", // Duplicate

                // O
                "Official Upload Rules Guide": "官方上传规则指南",
                "Open Tickets": "待处理工单",

                // P
                "Permanent Freeleech Tokens": "永久免费令牌",
                "Poster": "海报",

                // R
                "Rain Drops": "雨滴", // Duplicate
                "Read Rules": "阅读规则",
                "Real Ratio": "真实分享率",
                "Real Seedtime": "实际做种时间",
                "Release Date": "发布日期",
                "Request Comments Made": "求种评论数",
                "Rescue Points": "救援积分", // Duplicate
                "Reseed": "请求补种",
                "RSS feed": "RSS订阅",

                // S
                "Search & Hide": "搜索和隐藏",
                "Search & Save": "搜索和保存",
                "Seed Help": "请求协助", // Duplicate
                "Site & Tracker Discussions": "站点和追踪器讨论", // Duplicate
                "Site & Tracker Discussions": "站点与PT站讨论", // Duplicate
                "Site Bugs/Issues": "站点错误/问题", // Duplicate
                "Site Contests": "站点竞赛", // Duplicate
                "Site Features": "站点功能", // Duplicate
                "Site Games": "站点游戏", // Duplicate
                "Site Suggestions": "站点建议", // Duplicate
                "Snatched": "已下载",
                "Snatches of Uploads": "上传的完成数",
                "Special Seed Size": "特殊种子大小",
                "Staff Approved Tutorials": "管理员批准的教程", // Duplicate
                "START NEW TICKET": "发起新工单",
                "Subtitles (comma-separated)": "字幕 (逗号分隔)",
                "Support": "技术支持",

                // T
                "Temporary Freeleech Tokens": "临时免费令牌", // Duplicate
                "Thanks Given": "发出的感谢",
                "Thanks Received": "收到的感谢",
                "The Art Gallery": "艺术馆", // Duplicate
                "The Laugh Factory": "笑料工厂", // Duplicate
                "The Mountain View Job": "山景城任务",
                "Tips Given": "给出小费",
                "Tips Received": "收到小费",
                "Title Comments Made": "标题评论数",
                "Title Ratings": "标题评分",
                "TMDB Top 250": "TMDB Top 250榜单",
                "Topics Started": "发起的主题数",
                "Torrent Comments Made": "种子评论数",
                "Torrent Files": "种子文件",
                "Torrent Statistics": "种子统计",
                "Total Downloads": "总下载数",
                "Total Seedtime": "总做种时间", // Duplicate
                "Tracker Codes": "站点代码", // Duplicate

                // U
                "Unaccepted Invites": "未接受的邀请",
                "Upcoming Internal Releases": "即将发布的内种",
                "Upcoming Releases": "即将发布",
                "User Submitted Tutorials": "用户提交的教程", // Duplicate
                "User Statistics": "用户统计",

                // V
                "View Torrent Changes": "查看种子更改",
                "View Torrent History": "查看种子历史",

                // W
                "Warned On": "警告于",
                "Warnings": "警告",
                "WarningsReal Ratio": "警告真实分享率",
                //other
                "TV News": "剧集新闻",
                "TV Favorites": "收藏的剧集",
                "Random Series": "随机剧集",
                "Shows List": "剧集列表",
                "Series List": "系列列表",
                "Vision and Values": "愿景和价值观",
                "Known Issues": "已知问题",
                "Spend Points": "消费积分",
                "Spend Lumens": "消费 Lumens",
                "Buy Stamps": "购买邮票",
                "Bonus Rates": "奖励比率",
                "Edit Profile": "编辑个人资料",
                "Subscribed Threads": "订阅的主题",
                "Torrent History": "种子历史",
                "Snatchlist": "已完成列表",
                "Next Class": "下一等级",
                "SiteWide 2x Upload": "全站双倍上传",
                "Latest blog posts": "最新博客文章",
                "Last 5 Uploads": "最近 5 个上传",
                "Exchange BTN Lumens": "兑换 BTN Lumens",
                "Add to Request Pool": "添加到求种池",
                "Send Currency": "发送货币",
                "Feature Disabled": "功能已禁用",
                "Buy some profile stamps": "购买一些个人资料邮票",
                "Automatically added to old low-bounty requests at the first of each month": "每月月初自动添加到旧的低悬赏求种",
                "View the rate of your bonus": "查看您的奖励比率",
                "Buy your way to the top": "购买晋升资格",
                "About Bonus": "关于奖励积分",
                "This profile is currently empty": "此个人资料当前为空",
                "User Class": "用户等级",
                "Last Seen": "最后上线时间",
                "Just now": "刚刚",
                "Per Month": "每月",
                "Per Week": "每周",
                "Per Day": "每天",
                "Requests filled": "已满足的求种",
                "Mutual Friends": "共同好友",
                "Friend Of": "的好友",
                "Wall Posts made": "发出的留言",
                "Wall Posts received": "收到的留言",
                "Forum Posts": "论坛帖子",
                "Torrent Comments": "种子评论",
                "Uploads Snatched": "已完成的上传",
                "Average Time Seeded": "平均做种时间",
                "Total Time Seeded": "总做种时间",
                "Total Traffic": "总流量",
                "Current Page": "当前页面",
                "Profile views": "个人资料查看次数",
                "Last 5 Viewed": "最近 5 个浏览",
                "Time On Site": "在线时长",
                "Avg. Seed Time": "平均做种时间",
                "Requests Filled": "已满足的求种",
                "IRC Idle": "IRC 挂机时间",
                "Favorite Tv Shows": "收藏的电视剧",
                "No Recommendation": "暂无推荐",
                "Leave a comment": "发表评论",
                "News Announcement": "新闻公告",
                "Notify me of all new torrents with": "当有新种子满足以下条件时通知我",
                "Label": "标签",
                "A label for the filter set": "过滤器组的标签",
                "to tell different filters apart": "用于区分不同的过滤器",
                "All fields below here are optional": "以下所有字段均为可选",
                "One of these Series": "以下剧集之一",
                "Comma-separated list - eg": "逗号分隔列表 - 例如",
                "How I Met Your Mother": "老爸老妈的浪漫史",
                "of these tags": "包含这些标签",
                "before a tag to exclude it - eg.": "在标签前添加“-”以排除它 - 例如",
                "Sci-Fi": "科幻",
                "Show Tags": "显示标签",
                "Only these Categories": "仅限这些分类",
                "Only these Containers": "仅限这些容器格式",
                "Only these Codecs": "仅限这些编码",
                "Only these Sources": "仅限这些来源",
                "Only these Resolutions": "仅限这些分辨率",
                "Only These Origins": "仅限这些地区",
                "Foreign Selection": "外语选择",
                "IRC Notification": "IRC 通知",
                "Mobile Notification": "移动通知",
                "Notify me on IRC when feed is updated": "当订阅源更新时通过 IRC 通知我",
                "Notify me via mobile": "通过移动设备通知我",
                "Required stats to progress to Elite": "晋升到 Elite 所需的统计数据",
                "Total data": "总数据量",
                "Minimum bonus points": "最低奖励积分",
                "Minimum snatches": "最低完成数",
                "Minimum time": "最少时间",
                "Class Requirements": "等级要求",
                "Client Whitelist": "客户端白名单",
                "Main Rules": "主要规则",
                "Seeding Requirements": "做种要求",
                "Here you can find the requirements for each of BTN's user classes": "在这里您可以找到 BTN 每个用户等级的要求",
                "These are the clients we allow to connect to our tracker and rules specific to them": "这些是我们允许连接到我们 Tracker 的客户端以及针对它们的特定规则",
                "Read these rules before posting in the forums or talking on IRC": "在论坛发帖或在 IRC 上交谈之前，请阅读这些规则",
                "These rules govern the use of invites": "这些规则适用于邀请的使用",
                "You should read them before inviting anybody": "在邀请任何人之前，您应该阅读这些规则",
                "Read these rules before doing anything else": "在做任何其他事情之前，请阅读这些规则",
                "These rules explain the minimum seeding requirements": "这些规则解释了最低做种要求",
                "read them before downloading": "在下载之前阅读它们",
                "Read these rules before uploading": "在上传之前阅读这些规则",
            },
            "Short Sentences": {
                "Advent Calendar": "降临节日历",
                "Christmas Raffle": "圣诞抽奖",
                "New Year Raffle": "新年抽奖",
                "Accept Gifts": "接受礼物",
                "Anything Goes": "随意",
                "Bounty Given": "给出悬赏",
                "Bounty Received": "收到悬赏",
                "Can Chat": "可以聊天",
                "Can Upload": "可以上传",
                "Documentarian": "纪录片制作者",
                "Exchange BP for Buffer": "BP兑换缓冲",
                "How Can I Join the BHD IRC?": "如何加入 BHD IRC?",
                "Toggle": "切换",
                "Where does the donated money go?": "捐赠的钱去哪儿了？",
                "You can find additional information in SalmonAct's Unofficial BHD FAQ": "你可以在 SalmonAct 的非官方 BHD FAQ 中找到更多信息",
                "Further Rules": "更多规则",
                "Further Details": "更多详情",
                "Other Sections": "其他版块",
            }
        },
        "BTN": {
            "Words": {
            },
            "Phrases": {
            },
            "Short Sentences": {
            }
        }
    };

    // 预先创建正则表达式对象 (如果 translations 是固定的)
    const wordsRegex = {};
    for (const key in translations.BHD.Words) {
        wordsRegex[key] = new RegExp("\\b" + key + "\\b", 'g');
    }

    function translatePage() {
        const elements = document.querySelectorAll('body *:not(script):not(style)');

        elements.forEach(element => {
            if (element.children.length === 0) {
                let textContent = element.textContent;
                let site = window.location.hostname === 'beyond-hd.me' ? 'BHD' : 'BTN';

                // 使用 BHD 的翻译作为基础
                for (const type in translations.BHD) {
                    for (const key in translations.BHD[type]) {
                        if (type === "Words") {
                            const regex = wordsRegex[key];
                            if (regex.test(textContent)) {
                                textContent = textContent.replace(regex, translations.BHD.Words[key]);
                            }
                        } else {
                            if (textContent.includes(key)) {
                                textContent = textContent.replace(new RegExp(key, 'g'), translations.BHD[type][key]);
                            }
                        }
                    }
                }

                // 如果存在 BTN 的特定翻译，则覆盖 BHD 的翻译
                if (site === 'BTN' && translations.BTN) {
                    for (const type in translations.BTN) {
                        for (const key in translations.BTN[type]) {
                            if (type === "Words") {
                                const regex = new RegExp("\\b" + key + "\\b", 'g'); // 为 BTN 翻译创建新的正则表达式
                                if (regex.test(textContent)) {
                                    textContent = textContent.replace(regex, translations.BTN.Words[key]);
                                }
                            } else {
                                if (textContent.includes(key)) {
                                    textContent = textContent.replace(new RegExp(key, 'g'), translations.BTN[type][key]);
                                }
                            }
                        }
                    }
                }

                element.textContent = textContent;
            }
        });
    }
    // -------------------- 汉化部分结束 --------------------
    // -------------------- 修改 FAQ 页面内容 --------------------
    if (window.location.href === 'https://beyond-hd.me/faq') {
        const targetElementStart = document.querySelector('a[href="/faq"].beta-link-blend');
        const targetElementEnd = document.querySelector('div.text-center');

        if (targetElementStart && targetElementEnd) {
            let nextSibling = targetElementStart.nextSibling;
            const nodesToRemove = [];

            while (nextSibling && nextSibling !== targetElementEnd) {
                nodesToRemove.push(nextSibling);
                nextSibling = nextSibling.nextSibling;
            }

            nodesToRemove.forEach(node => {
                node.remove();
            });

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .faq-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .faq-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                }
                .faq-section h3 {
                    font-size: 18px;
                }
                .faq-section p {
                    font-size: 14px;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(style);

            // 插入新的HTML内容
            const replacementHTML = `
                <div class="faq-section">
                    <h2>站点信息</h2>
                    <h3>这到底是个啥 BT 玩意儿？</h3>
                    <p>请查阅 <a href="https://en.wikipedia.org/wiki/BitTorrent">种子 101：种子下载如何工作</a>。</p>
                    <h3>捐赠的钱都去哪儿了？</h3>
                    <p>BeyondHD 的所有工作人员都是志愿者，组织内没有有偿职位。因此，所有捐款都用于支付网站每个月的运营成本。</p>
                    <ul>
                        <li>站点服务器</li>
                        <li>Tracker 服务器</li>
                        <li>IRC 服务器</li>
                        <li>站点上传机器人服务器</li>
                        <li>站点存档种子服务器</li>
                        <li>开发测试服务器</li>
                        <li>域名注册</li>
                        <li>电子邮件主机</li>
                        <li>SSL 证书</li>
                        <li>站点竞赛</li>
                    </ul>
                    <h3>我该如何加入 BHD IRC？</h3>
                    <p>最简单的方法是使用网站上的网页客户端，<a href="/chat">点此访问</a>。如果您希望使用自己的客户端，则可以使用以下信息进行连接：</p>
                    <p>服务器：irc.beyond-hd.me</p>
                    <p>SSL 端口：6697</p>
                    <p>非 SSL 端口：6667</p>
                    <p>您必须使用您的网站用户名作为您的昵称，否则您将被踢出频道，并且无法使用支持频道。</p>
                    <p>当前公共频道：</p>
                    <ul>
                        <li>#beyondhd - 公共聊天频道（链接到聊天框）</li>
                        <li>#bhd_support - 公共支持频道（请勿在此处闲逛）</li>
                        <li>#bhd_announce - 公共公告频道（用于自动下载）</li>
                    </ul>
                    <h3>有关使用 IRC 或设置您自己的客户端的说明超出了本常见问题解答的范围。IRC 教程可以在论坛中找到。</h3>
                    <h3>在哪里可以找到有关 BHD 上可用功能的更多信息？</h3>
                    <p>您可以在 SalmonAct 的非官方 BHD 常见问题解答中找到更多信息：<a href="https://beyond-hd.me/forums/topic/salmons-unofficial-bhd-faq.2530">Salmon 的非官方 BHD 常见问题解答</a></p>
                </div>
            `;

            targetElementStart.insertAdjacentHTML('afterend', replacementHTML);
        }
    }
    // -------------------- 修改 FAQ 页面内容结束 --------------------

    // -------------------- 修改 Beyond-HD Rules 页面内容 --------------------
    if (window.location.href === 'https://beyond-hd.me/rules') {
        const targetElementStart = document.querySelector('a[href="/rules"].beta-link-blend');
        const targetElementEnd = document.querySelector('div[class="rule-line"]');

        if (targetElementStart && targetElementEnd) {
            let nextSibling = targetElementStart.nextSibling;
            const nodesToRemove = [];

            while (nextSibling && nextSibling !== targetElementEnd) {
                nodesToRemove.push(nextSibling);
                nextSibling = nextSibling.nextSibling;
            }

            nodesToRemove.forEach(node => {
                node.remove();
            });

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .rule-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .rule-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                }
                .rule-section h3 {
                    font-size: 18px;
                }
                .rule-section p {
                    font-size: 14px;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(style);

            // 插入新的HTML内容
            const replacementHTML = `
                <div class="rule-section">
                    <h2>上传</h2>
                    <p>关于上传的规则位于另一个页面。如果您希望上传，请务必阅读我们的上传规则，请访问<a href="https://beyond-hd.me/forums/topic/upload-rules-beyondhd.2518">官方上传规则指南</a>。</p>
                </div>

                <div class="rule-section">
                    <h2>基本规则</h2>
                    <h3>违反任何这些规则将导致您的帐户被封禁。</h3>
                    <p>所有新成员必须在加入后的 30 天内产生一些活跃度。这意味着成员必须上传、下载或辅种。未能满足这些标准的成员可能会被自动禁用。</p>
                    <p>所有种子必须<Strong>做种 120 小时（5 天）或达到 1:1 的分享率</Strong>。只有在您完成 100% 的种子下载后才开始计算做种时间。如果您在完成下载后连续 48 小时未做种，您将收到预警。收到预警后，如果您在 3 天内仍未做种，您将累积一个 <abbr title="Hit and Run">跑路 (H&R)</abbr> 记录。如果您的帐户累积 3 个 H&R，您将失去下载权限。只有在您将 H&R 的种子补种完毕后，您的帐户才会恢复这些权限。您可以重新下载 .torrent 文件和数据（如果缓冲足够）。</p>
                    <p>成员必须保持大于 0.25 的分享率。分享率低于 0.25 的成员将自动失去下载能力。只有当成员通过上传、辅种或补种过去的下载将分享率提高到最低限额时，下载权限才会恢复。</p>
                    <p>不活跃的帐户将在 90 天后被禁用。（更多详细信息请参阅不活动规则）</p>
                    <p>不允许拥有多个或“重复”帐户。每个家庭只允许 1 个帐户，例如，每个 IP 地址 1 个帐户。（如有例外，请提交帮助中心工单）</p>
                    <p>管理组可以对他们认为适合且公正的成员采取任何行动，以处理网站上的活动或行为。</p>
                    <h3>重要提示：</h3>
                    <p><strong>120 小时（5 天）或 1:1 的做种要求只是避免 H&R 的绝对最低限度。</strong> 希望成员保持健康的总体平均做种时间。</p>
                </div>

                <div class="rule-section">
                    <h2>主要规则</h2>
                    <h3>违反任何这些规则将导致您的帐户被封禁。</h3>
                    <p>您必须使用家庭 IP 地址注册。如果您使用 VPN/代理注册，您的帐户将被自动禁用。此外，管理组可能随时要求您使用家庭 IP 登录以确认您的帐户详细信息。</p>
                    <p>在任何情况下都不得交易或出售邀请。您将被永久封禁，并且您邀请树中的所有成员都将被禁用。</p>
                    <p>不要交易、出售、公开赠送或公开提供邀请。这包括在其他站点/论坛上发布“非官方邀请”帖子。您将被永久封禁，并且您邀请树中的所有成员都将被禁用。</p>
                </div>

                <div class="rule-section">
                    <h2>Seedbox/VPN/代理/IP 地址</h2>
                                        <h3>违反任何这些规则将导致您的帐户收到警告、失去下载权限或被封禁。</h3>
                    <p>Seedbox 在本站上被视为任何其他客户端（没有处罚或注册要求），但是，如果您计划与其他成员共享 Seedbox，最好通知管理组，但这目前不是强制性的。</p>
                    <p>如果您计划通过 VPN 浏览网站或下载，建议您提交一份帮助中心工单，说明您的提供商名称。如果需要，您可能需要提供其他信息。</p>
                    <p>不鼓励通过代理浏览网站或下载。如果系统检测到您通过代理浏览或下载，您的帐户将来可能会被自动禁用。</p>
                </div>

                <div class="rule-section">
                    <h2>不活跃规则</h2>
                    <h3>违反任何这些规则将导致您的帐户因不活跃而被禁用。</h3>
                    <p>所有成员都必须在社区内保持活跃。成员必须至少每 90 天登录一次网站，否则他们的帐户将因不活跃而被禁用。（唯一的例外是您是活跃的捐赠者或您正在积极做种）。</p>
                </div>

                <div class="rule-section">
                    <h2>下载</h2>
                    <h3>违反任何这些规则将导致您的帐户收到警告、跑路记录或被封禁。</h3>
                    <p>所有种子必须<Strong>做种 120 小时（5 天）或达到 1:1 的分享率</Strong>。只有在您完成 100% 的种子下载后才开始计算做种时间。如果您在完成下载后连续 48 小时未做种，您将收到预警。收到预警后，如果您在 3 天内仍未做种，您将累积一个 <abbr title="Hit and Run">跑路 (H&R)</abbr> 记录。如果您的帐户累积 3 个 H&R，您将失去下载权限。只有在您将 H&R 的种子补种完毕后，您的帐户才会恢复这些权限。您可以重新下载 .torrent 文件和数据（如果缓冲足够）。</p>
                    <p>如果您下载的种子不足 30%，然后停止种子，则不会累积 H&R。</p>
                    <p>如果您下载的种子达到或超过 30%，您必须完成 100% 的下载并正常做种以避免 H&R。</p>
                    <p>分享率低于 0.25 的用户将自动被移除下载权限，直到他们的分享率高于 0.25。</p>
                    <p>用户必须拥有下载的任何文件的合法权利。</p>
                    <h3>重要提示：</h3>
                    <p>管理组成员可以对累积大量 H&R 的成员采取手动操作（包括封禁），无论其 H&R 是否处于活动状态。</p>
                </div>
                                <div class="rule-section">
                    <h2>将种子上传到其他站点</h2>
                    <h3>违反任何这些规则将导致您的帐户被封禁。</h3>
                    <p>请理解，BeyondHD 的安全依赖于成员遵守以下规则。内种发布者投入时间和精力来帮助大家分享资源，但是当他们的发布出现在公共站点上时，往往会引起不必要的关注。请遵守这套规则，尊重他们的安全和其他成员的安全。</p>
                    <p>站点上不允许存在下载/上传机器人帐户。</p>
                    <p>禁止将我们的内种大量上传到任何站点（手动或自动）。</p>
                    <p>将我们的内种上传到 IPT 将导致立即封禁。</p>
                    <p>将我们的内种上传到公共站点将导致立即封禁。</p>
                    <p>禁止将我们的内种上传到任何文件共享或 DDL 站点。（例如，托管在 Rapidshare 或类似站点上）</p>
                    <p>禁止将我们的内种上传到 Usenet 或 NZB 索引器。</p>
                    <p>在任何情况下都不应重新标记/重命名内种。向内种添加字幕并不会使其成为您自己的作品；如果您添加字幕并在其他地方上传，则发布名称应类似于 "The.Hitmans.Bodyguard.2017.BluRay.1080p.TrueHD.Atmos.7.1.AVC.REMUX.RoSubbed-FraMeSToR"。</p>
                    <p>最后，如果特定种子被标记为独家（无论是否具有到期日期），请不要在其保持独家期间上传或辅种到任何其他站点。独家期结束后，您可以自由地在其他地方上传/辅种（只要是 приват 站点）。此规则旨在让上传者有机会在其他地方上传自己的作品，而不必担心与他人竞争首发，因此请尊重他们。发现违反此规则的成员将被立即封禁。</p>
                    <p>转载者：如果您想将大量来自 BeyondHD 的内容上传到其他站点，或希望获得任何这些规则的豁免，请提交帮助中心工单，寻求高级管理组的批准。</p>
                    <p>上传者：如果您希望能够将您的种子标记为独家，请提交帮助中心工单，申请解锁该功能的徽章。</p>
                    <p>最后说明：由于过去发生的事件，除了上述规则外，管理组保留对任何被认为在批量下载或转载内种时行为不端的成员采取行动的权利。此规则并非阻止成员下载或共享内容，仅用于涵盖极端情况（由管理组确定何为极端情况）。</p>
                </div>
                <div class="rule-section">
                    <h2>站点与通用规则</h2>
                    <h3>违反任何这些规则将导致您的帐户收到警告、暂停或被封禁。</h3>
                    <p>不要违抗管理组明确表达的意愿。</p>
                    <p>不要在闲聊框或论坛上链接或宣传其他站点（公共或 приват），官方邀请论坛除外。</p>
                    <p>不允许出现攻击性和破坏性行为。</p>
                    <p>请在本站使用英语。</p>
                    <p>请尽量减少污言秽语和可能令人反感的材料：色情内容、宗教材料、虐待动物/人类以及任何其他品味不佳的话题。</p>
                    <p>禁止请求或发布 варез, 序列号, CD 密钥, 密码或破解程序。</p>
                    <p>不要在其他地方上传我们的 .torrent 文件，它们包含链接到您帐户的密钥。这样做会导致您的帐户被禁用。</p>
                    <p>拥有捐赠者身份的成员仍然会累积 H&R 警告，但在身份保持激活状态时，他们可以免于失去下载权限。（如果 H&R 未被补种，则在捐赠者身份结束后，权限可能会自动丢失）</p>
                </div>

                <div class="rule-section">
                    <h2>论坛</h2>
                    <h3>违反任何这些规则将导致您的帐户收到警告。</h3>
                    <p>确保所有主题都发布在正确的版块！（游戏问题发布在游戏版块，应用程序问题发布在应用程序版块等）</p>
                    <p>禁止重复发帖。</p>
                    <p>每 24 小时只允许提升帖子一次。</p>
                    <p>请仅发布经过网页优化的图片 - 单击后可展开为完整分辨率的缩略图；或者只使用非巨型图片。</p>
                    <p>在提出任何问题之前，请务必阅读 FAQ 和置顶论坛帖子。</p>
                </div>

                <div class="rule-section">
                    <h2>闲聊框/IRC</h2>
                    <h3>违反任何这些规则将导致您的帐户收到警告或失去聊天/IRC 权限。</h3>
                    <p>不要在聊天框中报告与站点相关的功能中的错误或故障。请使用帮助中心。</p>
                    <p>不要剧透最近的电影、电视剧或体育赛事。</p>
                    <p>请在闲聊框和 IRC 中使用英语。</p>
                    <p>在您发出正式的新种子/补种请求之前，不要讨论新的种子或补种请求。</p>
                    <p>尊重社区其他成员的观点。</p>
                    <p>如果链接到“不适合工作场所”的内容，请通过说“NSFW”告知他人。</p>
                    <p>不要索要或提供其他站点的邀请，也不要进行关于其他站点的冗长对话。</p>
                    <p>请尽可能使用其他站点的缩写名称。例如：BeyondHD = BHD，TrackerNameHere = TNH 等。</p>

                </div>
            `;

            targetElementStart.insertAdjacentHTML('afterend', replacementHTML);
        }
    }
    // -------------------- 修改 Beyond-HD Rules 页面内容结束 --------------------
 // -------------------- 修改 BTN Rules 页面内容 --------------------
    if (window.location.href === 'https://broadcasthe.net/rules.php') {
        // 使用 id="general" 的 h3 元素作为目标元素
        const targetElement = document.querySelector('h3#general');

        if (targetElement) {
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .rule-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .rule-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                }
                .rule-section h3 {
                    font-size: 18px;
                }
                .rule-section p,li {
                    font-size: 14px;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(style);

            // 插入新的HTML内容
            const replacementHTML = `
                <div class="rule-section">
                    <h2>一般规则</h2>
                    <ul>
                    <li>一个人一生只能拥有一个帐户。如果您创建多个帐户，您的所有帐户都将被禁用，并且您的邀请人也可能受到处罚。</li>
                    <li>禁止交易、出售、共享或赠送您的帐户。如果您不再需要您的帐户，只需停止登录，它将在 90 天后因不活动而被自动禁用。</li>
                    <li>如果您 90 天内没有登录，您的帐户将被自动禁用。如果您的帐户因不活动而被禁用，则无法保证它会被重新启用。</li>
                    <li>在任何情况下，您都不得使用公共代理/VPN 浏览本站。如果您想请求使用私人代理/VPN 的许可，您必须发送 <a href="/staffpm.php">管理员私信</a>。要使 VPN/代理被视为私有，它必须提供专用 IP，并且您必须是唯一有权访问该 IP 的人。在大多数情况下，共享的 Seedbox 不提供专用 IP。</li>
                    <li>严禁操纵或利用任何 BTN 系统或资源来使任何个人或团体获得不公平的优势或收益。</li>
                    <li>不允许为了晋级而大量下载旧种子。如果您计划成为旧种子的永久做种者，则可能会获得例外。如果您有任何疑问，请提交 <a href="/staffpm.php">管理员私信</a>。</li>
                    <li>我们相信分享并鼓励您尽可能多地分享。如果管理员认为您没有真诚地回馈社区，您的帐户可能会受到处罚。</li>
                    <li>推荐/联盟链接仅允许出现在广告子论坛中。您不能在其他任何地方拥有推荐/联盟链接，包括但不限于：您的个人资料、自定义标题和签名。</li>
                    <li>请不要发布不希望被提及的网站的链接或全名。不要在论坛或 IRC 频道上发表关于其他 Tracker 的负面言论来表示不尊重。</li>
                    <li>不要在其他网站上共享任何敏感帐户信息。敏感帐户信息包括但不限于：您的密码、密钥、身份验证密钥、API 密钥和 IRC 密钥。请记住，您的密钥嵌入在您下载的 .torrent 文件中。如果您共享您的 .torrent 文件或密钥，您的帐户将被自动禁用。</li>
                    <li>禁止出于任何原因泄露或威胁泄露用户的私人信息。私人信息包括但不限于个人身份信息（例如，姓名、记录、传记详情、照片）。未经允许，不得讨论或共享其他用户的私人信息。这包括通过调查公开自愿提供的信息而收集的私人信息（例如，谷歌搜索结果）。</li>
                    <li>尊重管理员的决定，并在必要时私下向做出决定的版主或站点管理员提出疑虑。</li>
                    </ul>
                </div>
            `;

            targetElement.insertAdjacentHTML('afterend', replacementHTML);
        }
    }
    // -------------------- 修改 BTN Rules 页面内容结束 --------------------
    // -------------------- 修改 BTN Rules (Clients) 页面内容 --------------------
    if (window.location.href === 'https://broadcasthe.net/rules.php?p=clients') {
        // Client Whitelist 翻译
        const clientWhitelistTarget = document.querySelector('h2.center');
        if (clientWhitelistTarget) {
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .rule-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .rule-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                }
                .rule-section h3 {
                    font-size: 18px;
                }
                .rule-section p,li {
                    font-size: 14px;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(style);

            const clientWhitelistTranslate = `
                <div class="rule-section">
                    <p>客户端规则是我们维护群体完整性的方式。这允许我们过滤掉可能损害 Tracker 或个人 Peer 性能的破坏性和不诚实的客户端。</p>
                </div>
            `;
            clientWhitelistTarget.insertAdjacentHTML('afterend', clientWhitelistTranslate);
        }
        // Further Rules 翻译
        const furtherRulesTarget = document.evaluate("//h3[text()='Further Rules']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (furtherRulesTarget) {
            const furtherRulesTranslate = `
                <div class="rule-section">
                    <p>明确禁止修改客户端以绕过我们的客户端要求（欺骗）。被发现这样做的人将被立即永久禁止。这是你唯一的警告。</p>
                    <p>不允许使用已修改为向 Tracker 报告不正确统计数据（作弊）的客户端或代理，否则将被永久禁止。此外，您的信息将被传递给其他 Tracker 的代表，您也可能在那里被禁止。</p>
                    <p>除非得到管理员的批准，否则不允许开发人员测试不稳定的客户端。</p>
                </div>
            `;
            furtherRulesTarget.insertAdjacentHTML('afterend', furtherRulesTranslate);
        }

        // Further Details 翻译
        const furtherDetailsTarget = document.evaluate("//h3[text()='Further Details']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (furtherDetailsTarget) {
            const furtherDetailsTranslate = `
                <div class="rule-section">
                    <p>如果您邀请的人违反了上述规则，您将被封禁。</p>
                    <p>如果您是被违反上述规则的人邀请的，您的帐户将被禁用，恕不另行通知。</p>
                </div>
            `;
            furtherDetailsTarget.insertAdjacentHTML('afterend', furtherDetailsTranslate);
        }
    }
    // -------------------- 修改 BTN Rules (Clients) 页面内容结束 --------------------
    // -------------------- 修改 BTN FAQ Index 页面内容 --------------------
    if (window.location.href === 'https://broadcasthe.net/kb.php?id=159') {
        const targetElement = document.querySelector('div.head');

        if (targetElement) {
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .faq-index-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .faq-index-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                }
                .faq-index-section h3 {
                    font-size: 18px;
                }
                .faq-index-section p,li {
                    font-size: 14px;
                    line-height: 1.5;
                }
                .faq-index-section .size4 {
                    font-size: 16px;
                }
                .faq-index-section .size5 {
                    font-size: 20px;
                }
            `;
            document.head.appendChild(style);

            // 插入新的HTML内容
            const replacementHTML = `
                <div class="faq-index-section">
                    <pre><div style="text-align: center;"><span class="size5"><strong>常见问题 Index</strong></span></div></pre><br>
                    <br>
                    <span class="size4"><strong>General Site (常规站点问题)</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=96">我可以使用 Tor 或代理浏览 BTN 吗？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=102">我如何联系管理员？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=102">我如何找到有关 X 的更多信息？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=96">我如何避免因不活跃而被禁用？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=152">我如何浏览种子？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=137">我如何重新做种剧集包？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=270">我如何设置我的自定义标题？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=270">我如何设置我的签名？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=218">什么是奖励积分？什么是 Lumens？我如何获得它们？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=163">这个警告是什么意思？为什么我会收到它？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=85">如果我和其他 BTN 用户住在一起怎么办？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=282">什么是“已完成”？我如何获得它们？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=58">BTN 的用户等级系统是什么？管理员等级是什么？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=181">为什么我丢失了我获得的成就？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=165">为什么我收不到通知？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=29">为什么我不能使用我的邀请？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=268">为什么我的个人资料中有重复的种子？</a>  <br>
                    <br>
                    <span class="size4"><strong>H&Rs and Seeding Times (H&R 和做种时间)</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">我的 seedbox/硬盘坏了，我会收到大量的 H&R！</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=96">做种可以防止我因不活跃而被禁用吗？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=119">我如何重新做种/交叉做种一个种子？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">我如何查看我已经做种一个种子多长时间了？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">我收到了一个 H&R！我该如何修复它？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">为什么我会收到这个 H&R？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=109">为什么我的一些种子显示为未注册？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">为什么我在一个我一直在做种的种子上没有任何做种时间？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">为什么我的做种时间比这个种子上的应有时间短？</a> <br>
                    <br>
                    <span class="size4"><strong>Downloading (下载)</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=139">我可以下载剧集包的一部分吗？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=96">我可以使用多个 IP 下载吗？Seedbox 呢？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=94">什么是客户端白名单？我的客户端在白名单上吗？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=82">为什么我的统计数据没有被正确报告？</a><br>
                    <br>
                    <span class="size4"><strong>Uploading (上传)</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=279">什么是 MediaInfo？我如何使用和阅读它？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=1880">禁止的发布组</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=252">为什么我不能上传已完结剧集中的一集？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=164">为什么我的种子被删除了？</a><br>
                    <br>
                    <span class="size4"><strong>Clients (客户端)</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=273">“可连接”是什么意思？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=273">什么是 IOError？我如何修复它？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=273">为什么我下载的数据比种子的大小还大？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=273">为什么我卡在 99% 了？</a><br>
                    <br>
                    <span class="size4"><strong>IRC</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=96">使用 IRC 可以防止我因不活跃而被禁用吗？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=266">我如何注册我的昵称？我如何向 NickServ 识别？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=266">我如何获得 IRC 奖励？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=251">我按照上面的文章操作，但我仍然没有获得奖励！</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=266">为什么我不能加入 #BTN？</a><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=266">为什么我的昵称一直变成 GuestXXXX？</a><br>
                    <br>
                    <span class="size4"><strong>Troubleshooting (故障排除)</strong></span><br>
                    <span class="size1">o</span> <a rel="noreferrer" href="kb.php?id=280">我如何刷新我的 DNS 缓存？</a><br>
                    <br>
                    <pre> </pre>
                </div>
            `;

            targetElement.insertAdjacentHTML('afterend', replacementHTML);
        }
    }
    // -------------------- 修改 BTN FAQ Index 页面内容结束 --------------------
        // -------------------- 修改 BTN 新用户指南页面内容 --------------------
    if (window.location.href === 'https://broadcasthe.net/kb.php?id=96') {
        const targetElement = document.querySelector('div.pad');

        if (targetElement) {
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .new-user-guide-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 15px;
                    border-radius: 5px;
                }
                .new-user-guide-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                    text-align: center;
                }
                .new-user-guide-section h3 {
                    font-size: 20px;
                    margin-top: 15px;
                }
                .new-user-guide-section h4 {
                    font-size: 16px;
                    margin-top: 10px;
                }
                .new-user-guide-section p,
                .new-user-guide-section li {
                    font-size: 14px;
                    line-height: 1.6;
                }
                .new-user-guide-section ul {
                    padding-left: 20px;
                }
                .new-user-guide-section a {
                    color: #007bff;
                    text-decoration: none;
                }
                .new-user-guide-section a:hover {
                    text-decoration: underline;
                }
            `;
            document.head.appendChild(style);

            // 插入新的HTML内容
            const replacementHTML = `
                <div class="new-user-guide-section">
                    <h2>新手指南</h2>
                    <h3>1: 新手指南</h3>
                    <p>本指南涵盖了种子下载和 BTN 的基本知识。 如果这是您第一次使用 PT 站，或者您经验不足，那么您来对地方了。</p>

                    <h3>1.1: 什么是 .torrent 文件？</h3>
                    <p>种子文件 (.torrent) 是一个包含 Tracker 的 URL（在 BTN 的情况下，它只包含 BTN 的 Tracker 信息）以及构成种子中文件的所有分块的完整性信息的文件。</p>

                    <h3>1.2: 保持我的分享率高于 1.0 有什么好处吗？</h3>
                    <p>BTN 是一个不考核分享率的站点，因此分享率高于 1.0 没有额外的好处。 但是，您应该尽量多回馈社区。 此外，做种可以为您赚取 <a rel="noreferrer" href="kb.php?id=218">奖励积分</a>，您需要这些积分才能提升 <a rel="noreferrer" href="kb.php?id=58">用户等级</a>。 请记住，<a rel="noreferrer" href="rules.php?p=ratio">不考核分享率并不意味着可以不辅种</a>。</p>

                    <h3>1.3: 如何上传种子？</h3>
                    <p>如果您使用的是 µTorrent 或其他客户端，则有一些教程解释了如何使用这些客户端制作和上传种子。 在上传任何内容之前，请务必查看<a rel="noreferrer" href="rules.php?p=upload">上传规则</a>。</p>

                    <h3>1.4: 为什么上传后需要下载种子？</h3>
                    <p>如果您在创建种子时未设置私有标记，您将被迫重新下载已设置该标记的新创建的种子副本。</p>
                    <p>当您重新下载种子文件时，您需要在您的客户端中手动打开它（除非它已存储在您的默认下载文件夹中）并显示您的客户端文件所在的位置； 或者，在某些客户端（特别是 uTorrent）中，更简单的方法是开始辅种您创建的种子（通过选中种子创建工具中的框），然后重新下载种子并照常打开它。 客户端将发出警告，提示种子已打开，并询问您是否要从中加载 Tracker 列表； 单击“是”，一切都将照常工作。 （如果您对状态的更改感到恼火，可以从 Tracker 列表中删除没有密钥的 announce URL。）</p>

                    <h3>1.5: 我下载了一些东西，但从我的客户端中删除了，如何重新辅种？</h3>
                    <p>如果您将下载内容保留在默认下载目录中，您可以直接从 BTN 重新下载 .torrent 文件并继续辅种。 如果您已将其移动，则需要保存种子，然后在客户端中手动打开它（在 µTorrent 中选择“文件”>“打开”（不默认保存），在 Azureus 中选择“文件”>“打开”并选择其存储的目录）。</p>
                    <p>如果这不起作用，则可能是您选择了错误的内容； 重要的是要记住，您可以使种子包含单个文件或整个目录。 如果种子仅包含一个文件，则需要选择文件本身； 如果它包含多个文件，则需要将其定向到包含这些文件的目录，或者在某些客户端中，定向到该目录的上一级目录。 如果种子保持在“正在下载”状态，请检查您的下载存储在哪个目录中 - 如果其中有另一个同名目录，则需要将客户端指向上一级目录。</p>

                    <h3>1.6: 我上传了一些东西并重新下载了种子，但它不起作用！</h3>
                    <p>请参阅 1.5。</p>

                    <h3>1.7: 如果我下载的某些东西不起作用，我该怎么办？</h3>
                    <p>首先，请务必确保不是您的系统出现故障。 如果您在播放文件时遇到问题，请确保您没有安装太多的解码器/解码器包 - 如果它在 mplayer 或 VLC 中不起作用，则您可能会遇到问题。</p>
                    <p>如果文件确实有问题，请在种子的评论区询问，看看是否有其他人遇到同样的问题。 如果不仅仅是您遇到问题并且这是一个严重的错误，您可以要求上传者上传修复版本，或举报该种子。</p>

                    <h3>1.8: 我可以使用代理或 Tor 浏览 BTN 吗？</h3>
                    <p>不可以，您不得使用 Tor 或其他公共代理浏览 BTN。 但是，经过版务事先批准（通过<a rel="noreferrer" href="staffpm.php">私信</a>），您可以使用私人代理（例如个人服务器上的 VPN）进行浏览。 要使代理被视为私有，它必须具有专用 IP，并且您必须是该 IP 上唯一的用户。 如果您想请求使用此类代理的权限，请发送<a rel="noreferrer" href="staffpm.php">私信</a>。 但是，您可以通过任何您喜欢的方式进行辅种/下载。 代理与否均可。 这些规则适用于 BTN 的<strong>浏览</strong>，而不是辅种/下载。 请访问我们站点论坛中有关 VPN 使用具体规则的帖子<a rel="noreferrer" href="forums.php?action=viewthread&threadid=16972">此处</a>。</p>

                    <h3>1.9: 如何避免因不活跃而被禁用？</h3>
                    <p>为避免因不活跃而被禁用，您必须至少每 90 天登录一次站点。 使用 IRC 或 Tracker（辅种/下载/API）并不能防止因不活跃而被禁用。 捐赠者和 VIP+ 用户等级可以免于因不活跃而被禁用。 如果您知道自己将无法登录该站点超过 90 天，您应该发送<a rel="noreferrer" href="staffpm.php">私信</a>，以便我们可以记录在您的帐户上。</p>

                    <h3>1.10: 我可以使用多个 IP 同时下载吗？ Seedbox 呢？</h3>
                    <p>简短的答案：可以。</p>
                    <p>BTN 可以跟踪来自同一用户的不同 IP 的会话。 种子通过唯一的嵌入式密钥与用户关联； IP 更改不会以任何方式影响这一点。 关闭种子时，您无需再次登录。 您最多可以同时从每个种子三个 IP 进行辅种/下载。</p>
                    <p>Seedbox 也属于此规则。 欢迎 BTN 上的任何人使用 Seedbox 进行下载和上传，并且您可以让您的家用计算机同时执行相同的操作。 Seedbox 是提高需要分享率的站点的分享率的好方法，但在 BTN，这不是必需的。 有关更多信息，请参阅<a rel="noreferrer" href="kb.php?id=136">这篇关于 Seedbox 的文章</a>。</p>

                    <h3>1.11: 我可以重新下载之前下载过的种子吗？</h3>
                    <p>这个答案可能会因您的具体情况而略有不同。</p>
                    <p>您可以重新下载以前下载过的种子，以修复 H&R，或者可能更严重的问题，例如您丢失了硬盘并想要恢复数据。 如果您的硬盘发生故障，请发送私信。</p>
                    <p>如果您的用户帐户因未经版务批准而重新下载多个种子而被记录，并且您使用这些获得的统计数据来获得等级晋升，您的帐户可能会被重置统计数据，您将重新成为用户。 或者您的帐户将被禁用。</p>
                </div>
            `;

            targetElement.insertAdjacentHTML('beforebegin', replacementHTML);
        }
    }
    // -------------------- 修改 BTN 新用户指南页面内容结束 --------------------
    // -------------------- 修改 BTN 寻求信息和联系工作人员页面内容 --------------------
    if (window.location.href === 'https://broadcasthe.net/kb.php?id=102') {
        const targetElement = document.querySelector('div.head');

        if (targetElement) {
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .kb-102-section {
                    border: 1px solid #ccc;
                    margin-bottom: 20px;
                    padding: 15px;
                    border-radius: 5px;
                }
                .kb-102-section h2 {
                    font-size: 24px;
                    margin-top: 0;
                    text-align: center;
                }
                .kb-102-section h3 {
                    font-size: 20px;
                    margin-top: 15px;
                }
                .kb-102-section h4 {
                    font-size: 16px;
                    margin-top: 10px;
                }
                .kb-102-section p,
                .kb-102-section li,
                .kb-102-section span:not(.size5):not(.size4):not(.size2){
                    font-size: 14px;
                    line-height: 1.6;
                }
                .kb-102-section ul {
                    padding-left: 20px;
                }
                .kb-102-section a {
                    color: #007bff;
                    text-decoration: none;
                }
                .kb-102-section a:hover {
                    text-decoration: underline;
                }
                .kb-102-section .size4 {
                    font-size: 16px;
                }
                .kb-102-section .size5 {
                    font-size: 20px;
                }
                .kb-102-section .size2 {
                    font-size: 12px;
                }
            `;
            document.head.appendChild(style);

            // 插入新的HTML内容
            const replacementHTML = `
                <div class="kb-102-section">
                    <div style="text-align: center;"><a rel="noreferrer" href="kb.php?id=159"><img onload="Scale(this);" onclick="Scale(this);" src="//imgbin.broadcasthe.net/i/oRfoZP1QZB4Vs_KFhmpWF.png" alt="https://imgbin.broadcasthe.net/i/oRfoZP1QZB4Vs_KFhmpWF.png"></a></div><br>
                    <br>
                    <pre><div style="text-align: center;"><span class="size5"><strong>寻求信息和联系工作人员</strong></span></div></pre><br>
                    <br>
                    <span class="size5">1: 寻求信息</span><br>
                    <br>
                    欢迎您在论坛发帖或在 IRC 的支持频道提问。您会发现它们通常是友好和乐于助人的地方，前提是您检查以确保您的问题尚未被提出和回答。您应该检查：<br>
                    <br>
                    <span class="size4">1.1: 知识库</span><br>
                    <br>
                    确保您的问题确实不在本知识库中 - 使用 <a rel="noreferrer" href="kb.php">搜索</a> 功能（它位于知识库索引屏幕的右侧），并务必尝试不同的搜索措辞。如果只是为了被送回这里而在其他地方提问是没有意义的。<br>
                    <br>
                    <span class="size4">1.2: 常见问题解答</span><br>
                    <br>
                    与上面类似，确保您的问题确实不在常见问题解答中 - 使用 <a rel="noreferrer" href="kb.php?id=159">搜索</a> 功能（它位于常见问题解答索引屏幕的右侧），并务必尝试不同的搜索措辞。如果只是为了被送回这里而在其他地方提问是没有意义的。<br>
                    <br>
                    <span class="size4">1.3: 论坛</span><br>
                    <br>
                    最后，确保您的问题尚未在论坛中讨论过 - 再次使用 <a rel="noreferrer" href="forums.php?action=search&search=">搜索</a> 功能并尝试不同的搜索措辞。如果只是为了被送回到之前的主题而在那里发帖是没有意义的。在发帖之前，请务必阅读论坛顶部的置顶主题。很多时候，您可以在那里找到尚未纳入知识库的新信息。<br>
                    <br>
                    <span class="size5">2: 获得帮助</span><br>
                    <br>
                    您可以从各种来源获得帮助：<br>
                    <br>
                    <span class="size4">2.1: 论坛</span><br>
                    <br>
                    特别是 <a rel="noreferrer" href="forums.php?action=viewforum&forumid=13">技术难题论坛</a>。该论坛由 FLS 团队和几名工作人员监控。如果有人能够提供帮助，他们通常会在 24 小时内回复您的帖子。请考虑在那里发布您认为可能会影响多个人的问题，或者如果答案可能对更广泛的社区有益。<br>
                    <br>
                    <span class="size4">2.2: IRC</span><br>
                    <br>
                    通过 <a rel="noreferrer" href="irc.php">IRC</a> 在我们的帮助和支持频道 #BTN-Support 中实时获取帮助（如果您没有 IRC 客户端，BTN 网站上有一个 WEB IRC 应用程序供您使用）。FLS 和工作人员团队在大多数时候都可以访问。这是寻求帮助以解决当前正在发生或非常紧急的问题的最佳场所。<br>
                    <br>
                    <span class="size4">2.3: 以高效的方式获得帮助</span><br>
                    <br>
                    帮助我们帮助您。不要只说“它不起作用！”提供详细信息，这样我们就不必猜测或浪费时间询问。您使用什么客户端？您的操作系统是什么？您的网络设置是什么？您收到的确切错误消息是什么（如果有）？您遇到问题的种子是什么？您问题的屏幕截图可以提供<strong>很大</strong>帮助。您提供的信息越多，我们就越容易为您提供帮助，并且您的帖子越有可能获得能够快速帮助您的回复。<br>
                    <br>
                    请保持礼貌。要求帮助很少奏效，请求帮助通常可以解决问题。<br>
                    <br>
                    <span class="size5">3: 联系工作人员</span><br>
                    <br>
                    <span class="size4">3.1: IRC</span><br>
                    <br>
                    您可以通过加入 <a rel="noreferrer" href="irc.php">IRC</a> 上的 #BTN-Support 联系工作人员以获得实时帮助。如果您需要快速获得帮助，这是最佳选择，但不要高亮工作人员或私信人员（在 IRC 中“高亮”是指在某人所在的频道中说出某人的完整用户名）。加入支持频道后，只需说明您的站点昵称和您遇到的问题，就会有人帮助您。工作人员会尽量及时提供帮助，并且随时都有人可用，但如果您没有立即得到回复，请耐心等待。<br>
                    <br>
                    <span class="size4">3.2: 发送工作人员私信</span><br>
                    <br>
                    联系工作人员的最佳方式是发送 <a rel="noreferrer" href="staffpm.php">工作人员私信</a>。默认情况下，整个工作人员团队都可以看到该私信，这意味着您将更快地获得帮助。如果您的问题的性质比较敏感，您可以将私信发送给特定的工作人员类别。除了 IRC 支持频道外，工作人员私信是获得帮助的最快方式。<br>
                    <br>
                    <span class="size4">3.3: 直接私信工作人员</span><br>
                    <br>
                    只有当您有充分的理由认为您的问题无法通过工作人员私信或 IRC 解决时，才应该这样做。一个好的经验法则是，只有当您认为他们是唯一可以帮助您的人时，才直接私信工作人员。<a rel="noreferrer" href="staff.php">此处</a>可以查看所有工作人员的列表。<br>
                    <br>
                    <pre> </pre><br>
                    <a rel="noreferrer" href="kb.php">返回知识库主页</a><br>
                    <br>
                    <span class="size2"><em>有关本文的更多帮助或任何其他查询，请访问 #BTN-Support IRC 频道。您也可以发起 <a rel="noreferrer" href="staffpm.php">工作人员私信</a>。</em></span>
                </div>
            `;

            targetElement.insertAdjacentHTML('afterend', replacementHTML);
        }
    }
    // -------------------- 修改 BTN 寻求信息和联系工作人员页面内容结束 --------------------

    // 页面加载完成后执行汉化和 Rules 页面修改
    window.addEventListener('load', () => {
        translatePage();
    });
})();