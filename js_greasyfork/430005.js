// ==UserScript==
// @name         MCBBS 用户资料页一键叠BUFF
// @namespace    Sheep-realms
// @version      1.0
// @description  《超 级 管 理 员》
// @author       Sheep-realms
// @match        *://www.mcbbs.net/home.php?mod=space&uid=*
// @match        *://www.mcbbs.net/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430005/MCBBS%20%E7%94%A8%E6%88%B7%E8%B5%84%E6%96%99%E9%A1%B5%E4%B8%80%E9%94%AE%E5%8F%A0BUFF.user.js
// @updateURL https://update.greasyfork.org/scripts/430005/MCBBS%20%E7%94%A8%E6%88%B7%E8%B5%84%E6%96%99%E9%A1%B5%E4%B8%80%E9%94%AE%E5%8F%A0BUFF.meta.js
// ==/UserScript==

let $ = jQuery;
let getRequest = (variable, url = "") => {
    let query = url ? /\?(.*)/.exec(url)[1] : window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

var forumList = [
    {fid:2, name:"公告和反馈"},
    {fid:39, name:"游戏技巧"},
    {fid:43, name:"软件资源"},
    {fid:44, name:"材质资源"},
    {fid:45, name:"Mod发布"},
    {fid:52, name:"矿工茶馆"},
    {fid:67, name:"周边创作"},
    {fid:68, name:"旧服务器"},
    {fid:108, name:"版主沙龙"},
    {fid:110, name:"原版问答"},
    {fid:125, name:"泰拉瑞亚Terraria"},
    {fid:137, name:"展示&共享"},
    {fid:138, name:"服务端插件"},
    {fid:139, name:"新闻资讯"},
    {fid:140, name:"MCBBS擂台"},
    {fid:155, name:"已关闭"},
    {fid:156, name:"擂台赛历届作品"},
    {fid:157, name:"Mod回收区"},
    {fid:158, name:"整合包回收区"},
    {fid:164, name:"基岩版技巧教程"},
    {fid:169, name:"皮肤分享"},
    {fid:170, name:"整合包发布"},
    {fid:173, name:"服务器需求区"},
    {fid:174, name:"插件回收区"},
    {fid:176, name:"服务端整合包"},
    {fid:177, name:"服务端整合包回收区"},
    {fid:178, name:"联机教程"},
    {fid:179, name:"服务器"},
    {fid:185, name:"Mod讨论"},
    {fid:188, name:"末路之地"},
    {fid:239, name:"举报与反馈"},
    {fid:246, name:"反馈和投诉"},
    {fid:247, name:"综合申请"},
    {fid:258, name:"插件衍生资源"},
    {fid:265, name:"基岩版问答"},
    {fid:266, name:"Mod问答"},
    {fid:290, name:"服务器/玩家评论"},
    {fid:296, name:"服务器审核区"},
    {fid:362, name:"服务器回收区"},
    {fid:365, name:"基岩版软件资源"},
    {fid:366, name:"基岩版地图作品"},
    {fid:399, name:"魔方世界CubeWorld"},
    {fid:431, name:"联机问答"},
    {fid:435, name:"基岩版服务器讨论"},
    {fid:436, name:"基岩版服务器"},
    {fid:437, name:"PocketMine插件专区"},
    {fid:463, name:"视频实况"},
    {fid:479, name:"编程开发"},
    {fid:488, name:"星界边境StarBound"},
    {fid:499, name:"MCBBS创意馆"},
    {fid:618, name:"基岩版服务器人才市场"},
    {fid:626, name:"你问我答公告"},
    {fid:627, name:"人才市场"},
    {fid:646, name:"基岩版新闻资讯"},
    {fid:647, name:"交易代理"},
    {fid:651, name:"临时出售、求购专区"},
    {fid:710, name:"未转变者Unturned"},
    {fid:720, name:"过期资源"},
    {fid:732, name:"历届作品"},
    {fid:801, name:"搬运&鉴赏"},
    {fid:930, name:"围攻Besiege"},
    {fid:1015, name:"翻译&Wiki"},
    {fid:1030, name:"交易代理审核区"},
    {fid:1062, name:"我的世界：故事模式"},
    {fid:1088, name:"基岩版服务器审核"},
    {fid:1099, name:"主机交流"},
    {fid:1107, name:"【推荐服务器】国家建筑师"},
    {fid:1125, name:"建议&投诉版"},
    {fid:1126, name:"服务器申请版"},
    {fid:1163, name:"基岩版插件&服务端"},
    {fid:1200, name:"基岩版作品精选"},
    {fid:1244, name:"基岩版不合格资源"},
    {fid:1245, name:"基岩版过期资源"},
    {fid:1276, name:"匠人酒馆"},
    {fid:1326, name:"Mod教程"},
    {fid:1344, name:"钴Cobalt"},
    {fid:1357, name:"Mod衍生资源"},
    {fid:1369, name:"异星旅人Astroneer"},
    {fid:1472, name:"创意馆评选通道（停用）"},
    {fid:1485, name:"基岩版过期教程"},
    {fid:1556, name:"过期资源"},
    {fid:1563, name:"基岩版服务端整合包"},
    {fid:1566, name:"周边问答"},
    {fid:1582, name:"签到记录"},
    {fid:1657, name:"账号注销"},
    {fid:1662, name:"基岩版问答"},
    {fid:1663, name:"综合游戏讨论区"},
    {fid:1664, name:"我的世界：地球[停服]"},
    {fid:1665, name:"我的世界：地下城"},
    {fid:1674, name:"Hytale"},
    {fid:1698, name:"重组Reassembly"},
    {fid:1709, name:"旧版材质"},
    {fid:1716, name:"BDServer插件专区"},
    {fid:1718, name:"Nukkit插件专区"},
    {fid:1755, name:"基岩版服务器回收区"},
    {fid:1853, name:"BLHX"},
    {fid:1861, name:"1.7.10专区"},
    {fid:2049, name:"【推荐服务器】Bilicraft"},
    {fid:2050, name:"白名单申请版"},
    {fid:2051, name:"建议&投诉版"},
    {fid:2052, name:"新人报到"},
];

var $hygk = $('.mbn:contains("活跃概况")').parents('.pbm.mbm.bbda.cl');

$hygk.children('ul').eq(0).html('<li><em class="xg1">管理组&nbsp;&nbsp;</em><span style="color:#FF0000"><a href="home.php?mod=spacecp&amp;ac=usergroup&amp;gid=48" target="_blank"><font color="#FF0000">管理员</font></a></span> </li><li><em class="xg1">用户组&nbsp;&nbsp;</em><span style="color:#FF0000"><a href="home.php?mod=spacecp&amp;ac=usergroup&amp;gid=48" target="_blank"><font color="#FF0000">管理员</font></a></span>  </li><li><em class="xg1">扩展用户组&nbsp;&nbsp;</em>Lv.12 屠龙者,<font color="#660000">版主</font>,<font color="#660000">实习版主</font>,<font color="#FF0000">超级版主</font>,<font color="#660099">大区版主</font>,<font color="#660099">问答区版主</font>,<font color="#660000">荣誉版主</font>,<font color="#FF0000">管理员助理</font>,<font color="#660000">村民</font>,<font color="#666600">专区版主</font>,<font color="#946CE6">电鳗</font>,<font color="#0000FF">认证用户</font>,<font color="#0099FF">Lv.Inf 艺术家</font>,哔,游客,等待验证会员,QQ游客,Lv-? 禁止发言,Lv-? 禁止访问,Lv-? 禁止IP</li>');

var $glbk = $('.mbn:contains("管理以下版块")').parents('.pbm.mbm.bbda.cl');

var txtBk = '<h2 class="mbn">管理以下版块</h2><a href="forum-' + forumList[0].fid + '-1.html" target="_blank">' + forumList[0].name + '</a>';

for(var i = 1; i<forumList.length; i++) {
    txtBk += ' &nbsp; <a href="forum-' + forumList[i].fid + '-1.html" target="_blank">' + forumList[i].name + '</a>';
}

$glbk.html(txtBk);