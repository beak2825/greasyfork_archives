// ==UserScript==
// @name         Translate from JPopsuki to zh-cn
// @name:zh-CN   将jpopsuki翻译为中国语
// @version      0.1.5.0
// @description  This script was translated from JPopsuki,
// @description:zh-CN 这个脚本会将JPopsuki的部分内容翻译
// @author       Non author @ 201511
// @include      *://jpopsuki.eu/*
// @namespace    Violentmonkey Scripts
// @namespace    https://greasyfork.org/users/129719
// @mail         None@to.mail
// @run-at       document-end
// @license      Creative Commons BY-NC-SA
// @license      MIT License; https://pastebin.com/raw.php?i=4TMeeUXC
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_ApiBrowserCheck
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=rixixi@sina.com&item_name=Greasy+Fork+donation
// @supportURL   http://www.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/30342/Translate%20from%20JPopsuki%20to%20zh-cn.user.js
// @updateURL https://update.greasyfork.org/scripts/30342/Translate%20from%20JPopsuki%20to%20zh-cn.meta.js
// ==/UserScript==

var htmlstr=document.getElementsByTagName('html')[0].innerHTML;

htmlstr=htmlstr.replace("News :: JPopsuki 2.0", "最新动态 :: JPopsuki 2.0");
htmlstr=htmlstr.replace("Browse Torrents :: JPopsuki 2.0", "浏览资源 :: JPopsuki 2.0");

htmlstr=htmlstr.replace("Torrent", "种子");
htmlstr=htmlstr.replace("Search", "搜索");

htmlstr=htmlstr.replace("You should also try to get an invite from a good friend of yours, other users on asian related forums or similar...", "你也可以尝试着从你的好友那里得到一个邀请，或者去一些亚洲相关论坛寻找类似的其他用户...");
htmlstr=htmlstr.replace("JPopsuki Radio or watch JPopsuki TV", "JPopsuki Radio 或者观赏下 JPopsuki TV");
htmlstr=htmlstr.replace("or open registrations", "或开放注册的同时");
htmlstr=htmlstr.replace("So check ", "所以查看 ");
htmlstr=htmlstr.replace("to see how to listen/watch and enjoy.", "来获取如何听/看以及欣赏.");
htmlstr=htmlstr.replace("While you are waiting for an ", "当你在等待一个");

htmlstr=htmlstr.replace("And check out our new streaming PV site:", "来看看我们新的PV视频站点:");
htmlstr=htmlstr.replace(">Loading<", ">读取中<");
htmlstr=htmlstr.replace(">Home</", ">首页</");
htmlstr=htmlstr.replace(">Login</", ">登录</");

htmlstr=htmlstr.replace(">Registrations are closed.", ">自由注册当前已经关闭.");
htmlstr=htmlstr.replace("is invite only.</", "只允许邀请注册.</");

htmlstr=htmlstr.replace("There will most likely be no more open registrations so follow us on <", "今后很有可能不会再开放注册，所以如果你想要获取可能开放的相关消息请务必关注我们的<");
htmlstr=htmlstr.replace(">Twitter</a> if you want news about a possible opening.", "a href=http://twitter.com/JPopsuki>Twitter</a>.");

htmlstr=htmlstr.replace("This is J", "这里是 J");                        
htmlstr=htmlstr.replace("View all recommendations", "查看所有推荐内容"); 
htmlstr=htmlstr.replace("Latest 10 Recommendations", "最新的 10 项推荐内容"); 
//Invites
htmlstr=htmlstr.replace("<h2>Invites</h2>", "<h2>邀请</h2>");
htmlstr=htmlstr.replace(">Send invite</td>", ">邀请人邮箱:</td>");
htmlstr=htmlstr.replace("Send invite", "发送邀请");
htmlstr=htmlstr.replace("<td>Uploaded</td>", "<td>上传量</td>");
htmlstr=htmlstr.replace("<td>Downloaded</td>", "<td>下载量</td>");

htmlstr=htmlstr.replace("You did not enter a valid email address", "您没有输入有效的电子邮件地址");

htmlstr=htmlstr.replace("Invites", "邀请");
htmlstr=htmlstr.replace("Do <b>NOT</b> send invites to", "请<b>不要</b>将邀请发送到");
htmlstr=htmlstr.replace("[Invite tree]", "邀请列表");
htmlstr=htmlstr.replace("Current invites", "当前邀请");
htmlstr=htmlstr.replace("Invitee tree", "被邀请人列表");
htmlstr=htmlstr.replace("Please note that the selling of our invitations is strictly forbidden, and will result in you and your entire invite tree being banned", "请注意，禁止贩卖本站的邀请连接，这将会导致您和您的整个邀请列表全都被禁止");
htmlstr=htmlstr.replace("Make sure that the user you are about to invite knows the basics about torrenting and how to keep up his ratio, if not - teach him! If a user you invited shows up on the forum asking questions that he should already know the answer to, you MIGHT get into trouble", "请确保您将邀请的用户知道并了解torrent相关的基础知识以及如何保持其分享率, 如果没有-教他!假如你邀请的用户出现在论坛上，提问他应该知道答案的问题，你可能会遇到麻烦");

htmlstr=htmlstr.replace("mail accounts, they will never arrive!", "的邮箱账户中, 因为永远无法到达!");

htmlstr=htmlstr.replace(/View/g, "查看");
htmlstr=htmlstr.replace("New ratio after downloading (without uploading)", "下载此种后新的的分享率(上传量不算的情况)");
htmlstr=htmlstr.replace("Requested On", "求种时间");
htmlstr=htmlstr.replace("Tags:", "标签:");
htmlstr=htmlstr.replace("Ranks (percentile)", "等级 (百分比%)");


htmlstr=htmlstr.replace("Recent Snatches", "最近完成");
htmlstr=htmlstr.replace("'s profile :: ", "的用户详情 :: ");
htmlstr=htmlstr.replace("This profile is currently empty.", "当前配置文件为空。");

htmlstr=htmlstr.replace(/Joined: /g, "加入日期: ");
htmlstr=htmlstr.replace(/Last Seen: /g, "最后浏览: ");
htmlstr=htmlstr.replace(/Data downloaded: /g, "数据下载: ");
htmlstr=htmlstr.replace(/Data uploaded: /g, "数据上传: ");

htmlstr=htmlstr.replace("Freeleech!", "免流量!");
htmlstr=htmlstr.replace("Uploads Snatches:", "上传认领:");

htmlstr=htmlstr.replace("Forum Posts: ", "论坛发帖数: ");
htmlstr=htmlstr.replace("Torrent Comments: ", "种子评论: ");

htmlstr=htmlstr.replace(/Torrents uploaded: /g, "资源上传: ");
htmlstr=htmlstr.replace(/Posts made: /g, "发表帖子: ");
htmlstr=htmlstr.replace(/Overall rank: /g, "总排名: ");
htmlstr=htmlstr.replace(/Requests filled: /g, "请求提供: ");
htmlstr=htmlstr.replace("Username", "用户名");
htmlstr=htmlstr.replace("Estimated Calculation. This assumes you're not downloading any other torrent.", "数据为假设你没有下载任何其他 torrent 的估算值.");
htmlstr=htmlstr.replace(/swapTorrent/g, "swapTorrent");

htmlstr=htmlstr.replace("Uploaded:", "上传: ");
htmlstr=htmlstr.replace(/Vote/g, "投票");
htmlstr=htmlstr.replace(/Stats/g, "统计");
htmlstr=htmlstr.replace("Bonus Points per Hour/Day:", "每小时/天 所能获得积分:");
htmlstr=htmlstr.replace(/Bonus Points/g, "奖励积分");

htmlstr=htmlstr.replace("Request Name", "请求名称");
htmlstr=htmlstr.replace("Nothing found!", "未找到相关内容!");
htmlstr=htmlstr.replace("Bounty", "悬赏");

htmlstr=htmlstr.replace("Seeding: ", "当前做种: ");
htmlstr=htmlstr.replace("Leeching: ", "当前下载: ");
htmlstr=htmlstr.replace("Recent Snatches", "最近认领");

htmlstr=htmlstr.replace(/Sex: Male/g, "性别: 男性");
htmlstr=htmlstr.replace(/Sex: Female/g, "性别: 女性");
htmlstr=htmlstr.replace(/Personal/g, "个人信息");
htmlstr=htmlstr.replace(/Class: User/g, "等级: User");
htmlstr=htmlstr.replace(/Paranoia Level: /g, "强迫症等级: ");
htmlstr=htmlstr.replace(/Bailed Out By/g, "曾经被保释");
htmlstr=htmlstr.replace(/Community/g, "社区");
// General Stuff

htmlstr=htmlstr.replace("Please do not join to request an invite - you will be ignored.", "请勿加入请求邀请 - 这样你会被忽略.<br>风斗车汉化组 友情汉化^_^");

htmlstr=htmlstr.replace("Search Terms:", "搜索 关键字:");
htmlstr=htmlstr.replace("Tags (comma-separated):", "Tags (多个请使用逗号分开):");
htmlstr=htmlstr.replace("Order By:", "排序:");
htmlstr=htmlstr.replace(">Disable Grouping<", ">禁用分组<");
htmlstr=htmlstr.replace("Make Default", "设为默认");
htmlstr=htmlstr.replace("Clear Default", "清空默认");

htmlstr=htmlstr.replace("Latest 5 Torrents", "最新上传的5个资源");
htmlstr=htmlstr.replace(/Log In!/g, "登录");
htmlstr=htmlstr.replace(/Torrents/g, "资源区");
htmlstr=htmlstr.replace(/Artists/g, "艺术家");
htmlstr=htmlstr.replace(/Artist/g, "艺术家");
htmlstr=htmlstr.replace("Uploads", "已上传");

htmlstr=htmlstr.replace(/Requests/g, "资源请求");
htmlstr=htmlstr.replace(/Home/g, "首页");
htmlstr=htmlstr.replace(/Collages/g, "合集");
htmlstr=htmlstr.replace(/Forums/g, "论坛");
htmlstr=htmlstr.replace(/Top10/g, "Top 10");
htmlstr=htmlstr.replace(/IRC/g, "IRC");
htmlstr=htmlstr.replace(/RadioTV/g, "Radio / TV");
htmlstr=htmlstr.replace(/Rules/g, "规则");
htmlstr=htmlstr.replace(/Help/g, "帮助");
htmlstr=htmlstr.replace(/Staff/g, "管理团队");

htmlstr=htmlstr.replace(/Users/g, "用户");
htmlstr=htmlstr.replace(/User/g, "用户");
htmlstr=htmlstr.replace(/Username/g, "用户名");
htmlstr=htmlstr.replace(/Logout/g, "退出");
htmlstr=htmlstr.replace(/Log/g, "历史记录");
htmlstr=htmlstr.replace(/Artist/g, "艺术家");

htmlstr=htmlstr.replace(/Edit/g, "编辑");
htmlstr=htmlstr.replace(/Donate/g, "捐赠");
htmlstr=htmlstr.replace(/Invited: /g, "已邀请: ");
htmlstr=htmlstr.replace("Invite", "邀请");

htmlstr=htmlstr.replace(/Up:/g, "上传量");
htmlstr=htmlstr.replace(/Upload/g, "上传");
htmlstr=htmlstr.replace(/Downloaded/g, "下载");
htmlstr=htmlstr.replace(/Download/g, "下载");
htmlstr=htmlstr.replace(/Down/g, "下载量");
htmlstr=htmlstr.replace(/Avatar/g, "头像");

htmlstr=htmlstr.replace(/Ratio/g, "分享率");
htmlstr=htmlstr.replace(/Bonus/g, "积分");

htmlstr=htmlstr.replace(/Inbox/g, "收件箱");
htmlstr=htmlstr.replace(/Notices/g, "公告");
htmlstr=htmlstr.replace(/Bookmarks/g, "收藏");
htmlstr=htmlstr.replace(/SubTopics/g, "订阅");
htmlstr=htmlstr.replace(/Notifications/g, "提醒");
htmlstr=htmlstr.replace(/Posts/g, "发表");
htmlstr=htmlstr.replace(/Friends/g, "好友");

htmlstr=htmlstr.replace(/Snatches/g, "认领数");
htmlstr=htmlstr.replace(/Snatched/g, "已完成");
htmlstr=htmlstr.replace(/Peers/g, "连接数");
htmlstr=htmlstr.replace(/Seeders/g, "做种者");
htmlstr=htmlstr.replace(/Leechers/g, "下载者");

htmlstr=htmlstr.replace(/Show/g, "显示");
htmlstr=htmlstr.replace(/Hide/g, "隐藏");
htmlstr=htmlstr.replace(/First/g, "首页");
htmlstr=htmlstr.replace(/Prev/g, "前一页");
htmlstr=htmlstr.replace(/Next/g, "后一页");
htmlstr=htmlstr.replace(/Last/g, "最后一页");
htmlstr=htmlstr.replace(/Delete/g, "删除");
htmlstr=htmlstr.replace(/Rename/g, "重命名");
htmlstr=htmlstr.replace(/Remove/g, "移除");
htmlstr=htmlstr.replace(/Manage/g, "管理");
htmlstr=htmlstr.replace(/Sort/g, "排序");
htmlstr=htmlstr.replace(/Forums/g, "论坛");
htmlstr=htmlstr.replace("listen to", "也来听听");
htmlstr=htmlstr.replace(/Peeps/g, "会员");

htmlstr=htmlstr.replace("Polls <", "调查 <");
htmlstr=htmlstr.replace("you may", "你不妨");



htmlstr=htmlstr.replace("Use this webchat link and ask for support from our Team (Pop-Up)", "使用这个网络聊天链接向我们团队获取技术支持(将弹出窗口打开)");
htmlstr=htmlstr.replace("Or use your own IRC client", "或使用你自己的IRC客户端访问");
htmlstr=htmlstr.replace("You did not receive your confirmation email", "您没有收到验证邮件");
htmlstr=htmlstr.replace("Account disabled for rule violation", "账号因违反规则被禁用");

htmlstr=htmlstr.replace("<p>Site and design © 2017 JPopsuki 2.0</p>", "<p>网页设计 by © 2017 JPopsuki 2.0</p><p>风斗车汉化组 版本0.1.4.9</p>");

document.getElementsByTagName('html')[0].innerHTML=htmlstr;