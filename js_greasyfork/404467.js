// ==UserScript==
// @icon            https://s.sstmlt.com/img/2021/02/06/e7b0642ad5b160d3f28f6d32ec1111fbb384934fef54b38e.png
// @name            ss同盟妖精助手
// @namespace       [url=mailto:1585493716@qq.com]1585493716@qq.com[/url]
// @author          梦幻妖精
// @description     方便漫区版主们查版的小工具~
// @match           *://sstm.moe/*
// @version         2.0.2
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/404467/ss%E5%90%8C%E7%9B%9F%E5%A6%96%E7%B2%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404467/ss%E5%90%8C%E7%9B%9F%E5%A6%96%E7%B2%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
            《开关设置区》
*/
// 4 删除版头功能开关
GM_registerMenuCommand("【删除版头功能】 启用/禁用", function() {
    // 切换选项的值
    var currentValue = GM_getValue("qingKongZhiDingEnabled", true);
    GM_setValue("qingKongZhiDingEnabled", !currentValue);
});
// 7 自动点开隐藏功能开关
GM_registerMenuCommand("【自动点开隐藏功能】 启用/禁用", function() {
    // 切换选项的值
    var currentValue = GM_getValue("yinCangXianShiEnabled", true);
    GM_setValue("yinCangXianShiEnabled", !currentValue);
});
// 11 表区锁帖辅助功能开关
GM_registerMenuCommand("【表区锁帖辅助功能】 启用/禁用", function() {
    // 切换选项的值
    var currentValue = GM_getValue("suoTieFuZhuEnabled", true);
    GM_setValue("suoTieFuZhuEnabled", !currentValue);
});
// 13 母母定制功能开关
GM_registerMenuCommand("【母母定制功能（默认禁用）】 启用/禁用", function() {
    // 切换选项的值
    var currentValue = GM_getValue("mumuEnabled", false);
    GM_setValue("mumuEnabled", !currentValue);
});

/*
            《主要功能区》
*/
function mimi() {
    //1号项目=====================================================================================================================================================================
    //米米个人页面按钮的html代码
    try {
    var mimi_home = '<a href="https://sstm.moe/profile/41311-kami%E4%B8%B6%E7%B1%B3/" data-ipshover="" data-ipshover-target="https://sstm.moe/profile/41311-kami%E4%B8%B6%E7%B1%B3/?do=hovercard" class="ipsUserPhoto ipsUserPhoto_tiny" title="转到 Kami丶米 的个人资料" one-link-mark="yes" id="ips_uid_9014_8"><img src="//s.sstmlt.com/board/monthly_2020_03/7.1.thumb.gif.714cc6cdfa11aa48af6379447f918c50.gif" alt="Kami丶米"></a>';

    mimi_home += '<li><a href="https://sstm.moe/forum/20-1" title="转到 测试区">《测试区》</a></li>';
    mimi_home += '<li><a href="https://sstm.moe/topic/254186-1" title="转到 妖精测试区">《排版测试🦋》</a></li>';

    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.focus-user>ul");
    if (ul_tag) {
        ul_tag.removeClass("???").addClass("elUserNav").append(mimi_home);
    }
//alert("米米运行成功")
} catch (error) {
    console.error("米米运行失败: ", error);
}
}mimi();

function ceBianLan() {
    //2号项目=====================================================================================================================================================================
    //侧边增加快捷入口
try {
    var lala = '<li class="ipsNavBar_active" data-active="" id="elNavSecondary_1" data-role="navBarItem" data-navapp="core" data-navext="CustomItem">';
    lala += '<a href="https://sstm.moe" data-navitem-id="1" data-navdefault="" class="nav-arrow">';
    lala += '▁▂▃▄_漫区查版栏_▄▃▂▁<i class="fa fa-caret-down"></i>';
    lala += '</a>';
    lala += '<ul class="ipsNavBar_secondary " data-role="secondaryNavBar">';
    lala += '<li class="ipsNavBar_active" data-active="" id="elNavSecondary_233" data-role="navBarItem" data-navapp="forums" data-navext="Forums">';
    lala += '<a href="https://sstm.moe/topic/177486-%E5%8A%A8%E6%BC%AB%E8%B5%84%E6%BA%90%E5%8C%BA%E7%89%88%E8%A7%84%EF%BC%88202055%EF%BC%89/" data-navitem-id="233" data-navdefault="">';
    lala += '<——里区/版规——>';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_666" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/36-%E6%96%B0%E7%95%AA%E8%BF%9E%E8%BD%BD/" data-navitem-id="666">';
    lala += '新番连载';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_2333" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/7-%E5%8A%A8%E7%94%BB%E5%88%86%E4%BA%AB/" data-navitem-id="2333">';
    lala += '动画分享';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_23333" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/23-%E5%8A%A8%E7%94%BB%E9%87%8C%E5%8C%BA/" data-navitem-id="23333">';
    lala += '动画里区';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_66666" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/16-%E6%BC%AB%E7%94%BB%E4%B8%96%E7%95%8C/" data-navitem-id="66666">';
    lala += '漫画世界';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_555" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/22-%E6%BC%AB%E7%94%BB%E9%87%8C%E5%8C%BA/" data-navitem-id="555">';
    lala += '漫画里区';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_8888" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/78-%E5%8A%A8%E6%BC%AB%E8%87%AA%E8%B4%AD%E8%87%AA%E7%BF%BB%E5%8C%BA/" data-navitem-id="8888">';
    lala += '动漫自购/自翻区';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_789456" data-role="navBarItem" data-navapp="core" data-navext="Leaderboard">';
    lala += '<a href="https://sstm.moe/topic/257355-%E6%96%B0%E4%B8%B6%E5%8A%A8%E6%BC%AB%E8%B5%84%E6%BA%90%E5%8C%BA%E4%BC%98%E7%A7%80%E4%BC%9A%E5%91%98%E7%94%B3%E8%AF%B7%E5%A4%84%E2%88%9A%E3%80%9078%E3%80%91/" data-navitem-id="789456">';
    lala += 'AC御宅申请处（新）';
    lala += '</a>';
    lala += '</li>';
    lala += '<li class="ipsNavBar_active" data-active="" id="elNavSecondary_233" data-role="navBarItem" data-navapp="forums" data-navext="Forums">';
    lala += '<a href="https://sstm.moe/topic/63249-ss%E5%8A%A8%E6%BC%AB%E7%BB%BC%E5%90%88%E5%8C%BA%E7%89%88%E8%A7%84-%EF%BC%882020%E5%B9%B45%E6%9C%8821%E6%97%A5%E4%BF%AE%E8%AE%A2%EF%BC%89/" data-navitem-id="233" data-navdefault="">';
    lala += '<——表区/版规——>';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_666" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/forum/74-%E5%8A%A8%E6%BC%AB%E8%AE%A8%E8%AE%BA%E5%8C%BA/" data-navitem-id="666">';
    lala += '动漫讨论区';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_2333" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/topic/189934-%E5%8A%A8%E6%BC%AB%E5%8C%BA%E9%95%BF%E6%9C%9F%E6%B4%BB%E5%8A%A8%E7%B3%BB%E7%BB%9F%E3%80%90%E6%AD%A3%E5%BC%8F%E7%89%88%E3%80%91%E5%BC%80%E5%A7%8B%E5%85%AC%E6%B5%8B%E5%95%A6~da%E2%98%86ze%EF%BC%81%EF%BC%8820%E5%B9%B45%E6%9C%881%E6%97%A5%E6%9B%B4%E6%96%B0%EF%BC%89/" data-navitem-id="2333">';
    lala += '周任务';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_23333" data-role="navBarItem" data-navapp="core" data-navext="YourActivityStreamsItem">';
    lala += '<a href="https://sstm.moe/topic/182457-%E3%80%90%E6%96%B0%E6%89%8B%E4%BB%BB%E5%8A%A1%E3%80%91%E6%9D%A5%E8%AE%B0%E5%BD%95%E7%A9%BF%E6%A2%AD%E4%BA%8E%E5%90%84%E6%AC%A1%E5%85%83%E7%9A%84%E5%9B%9E%E5%BF%86%E5%90%A7%EF%BC%81%EF%BC%8820%E5%B9%B45%E6%9C%881%E6%97%A5%E6%9B%B4%E6%96%B0%EF%BC%89/" data-navitem-id="23333">';
    lala += '新手任务';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_66666" data-role="navBarItem" data-navapp="core" data-navext="Leaderboard">';
    lala += '<a href="https://sstm.moe/topic/230776-%E5%8A%A8%E6%BC%AB%E7%BB%BC%E5%90%88%E5%8C%BA%E6%AC%A1%E5%85%83%E6%97%85%E8%80%85%E7%94%B3%E8%AF%B7%E5%A4%84%EF%BC%88%E4%BA%BA%E6%BB%A1%EF%BC%8C%E6%9A%82%E5%81%9C%E6%8B%9B%E6%96%B0%EF%BC%89/" data-navitem-id="66666">';
    lala += '旅者申请处';
    lala += '</a>';
    lala += '</li>';
    lala += '<li id="elNavSecondary_66666" data-role="navBarItem" data-navapp="core" data-navext="Leaderboard">';
    lala += '<a href="https://sstm.moe/topic/250949-%E3%80%90202077-%E4%BA%BA%E6%BB%A1-%E5%81%9C%E6%AD%A2%E6%8B%9B%E5%8B%9F%E3%80%91%E5%8A%A8%E6%BC%AB%E5%9C%B0%E5%B8%A6%E7%89%88%E4%B8%BB%E6%8B%9B%E5%8B%9F%E5%B8%96%E3%80%8A%E4%BB%86%E3%82%89%E3%81%AE%E6%89%8B%E3%81%AB%E3%81%AF%E4%BD%95%E3%82%82%E3%81%AA%E3%81%84%E3%81%91%E3%81%A9%E3%80%8B/" data-navitem-id="66667">';
    lala += '版主招募贴';
    lala += '</a>';
    lala += '</li>';
    lala += '</ul>';
    lala += '</li>';

    var ul_tag = $("div.ipsNavBar_primary>ul");
    if (ul_tag) {
        ul_tag.removeClass("???").addClass("primaryNavBar").append(lala);
    }
//alert("侧边栏运行成功")
} catch (error) {
    console.error("侧边栏运行失败: ", error);
}
}ceBianLan();

function zhiDing() {
    //3号项目=====================================================================================================================================================================
    //新增一个置顶按钮
    /*参考资料
    https://blog.51cto.com/u_13409958/3669946                                   div跳转
    https://blog.csdn.net/weixin_39984963/article/details/112998151         div元素置顶
    https://www.jianshu.com/p/eff1a7f1c7e8                                  div元素置顶
    https://blog.csdn.net/gschen_cn/article/details/119495938            跳转到网页顶端
    https://www.jianshu.com/p/a03f6136ad8c                                      div悬浮
    */
    try {
    var top = '<div class="top" style="position: fixed; height: 70px; width: 70px; bottom: 90px; left: 50px; z-index: 999;"><a href="#"><img src="https://s.sstmlt.com/img/2022/05/15/sstope8c618db97d219e0.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true"></a></div>';
    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.focus-user>ul");
    if (ul_tag) {
        ul_tag.removeClass("???").addClass("elUserNav").append(top);
    }
//alert("置顶按钮运行成功")
} catch (error) {
    console.error("置顶按钮运行失败: ", error);
}
    }zhiDing();

function qingKongZhiDing() {
    //4号项目=====================================================================================================================================================================
    //删除首页外的置顶横条,删除动漫区/节操广场/新手保护区的版头
    /*参考资料
    https://blog.chrxw.com/archives/2021/02/08/1449.html/comment-page-1       删除class
    */
try {
var a=0;
var b=0;
var c=0;
var d=0;
var e=0;
var f=0
var g=0
var h=0
var i=0
var j=0
var str = document.getElementsByTagName('html')[0].innerHTML
  //漫画里区模块>>>>>
  if(str.indexOf("18x相关的单行本本、同人cg、漫画等在此堆叠。")!=-1){
  if(str.indexOf("漫画里区")!=-1){
  //输入指定方案
  a=a+1;
}}
    //动画里区模块>>>>>
  if(str.indexOf("里番、18x同人动画、18x游戏提取动画等都在这里。")!=-1){
  if(str.indexOf("动画里区")!=-1){
  //输入指定方案
  b=b+1;
}}
    //自购区模块>>>>>
  if(str.indexOf("会员自费购买或自行翻译的所有类型的本子、动画、cg等等都在这里汇集。")!=-1){
  if(str.indexOf("动漫自购/自翻区 ")!=-1){
  //输入指定方案
  c=c+1;
}}
        //新番区模块>>>>>
  if(str.indexOf("的地方。欢迎你的到来")!=-1){
  if(str.indexOf("新番连载")!=-1){
  //输入指定方案
  d=d+1;
}}
            //动画分享模块>>>>>
  if(str.indexOf("合集类资源，以及剧场版、OVA等非正常TV播放资源在这里。")!=-1){
  if(str.indexOf("动画分享")!=-1){
  //输入指定方案
  e=e+1;
}}
                //漫画世界模块>>>>>
  if(str.indexOf("正常向短片漫画、长篇漫画等等陈列于此。")!=-1){
  if(str.indexOf("漫画世界")!=-1){
  //输入指定方案
  f=f+1;
}}
      //主页模块>>>>>
  if(str.indexOf("即将发生的事件")!=-1){
  if(str.indexOf("当前热门")!=-1){
  //输入指定方案
  g=g+1;
}}
          //广场模块>>>>>
  if(str.indexOf("日常综合交流区")!=-1){
  if(str.indexOf("节操の广场")!=-1){
  //输入指定方案
  h=h+1;
}}
              //动漫讨论区模块>>>>>
  if(str.indexOf("欢迎一切对动漫的讨论")!=-1){
  if(str.indexOf("动漫讨论区")!=-1){
  //输入指定方案
  i=i+1;
}}
                  //新手区模块>>>>>
  if(str.indexOf("同盟的新人们，先来这里接受调教吧！")!=-1){
  if(str.indexOf("新手保护区")!=-1){
  //输入指定方案
  j=j+1;
}}


//测试专用：
//alert(a+b+c+d+e+f+h+i+j);
if(a+b+c+d+e+f+h+i+j==1){
    document.querySelector('.ipsType_richText.ipsType_normal.ipsSpacer_top').remove(); //删除版头
    document.querySelector('.ipsHr').remove();
}/*
if(g==0){
    document.querySelector('.cAnnouncementsContent').remove(); //删除置顶横梁(妖精代码逻辑不对,无法使用)
}*/
//alert("删除版头运行成功")
} catch (error) {
    console.error("删除版头运行失败: ", error);
}
}

function pingFen() {
    //5号项目=====================================================================================================================================================================
    //查版评分辅助
    /*参考资料：
    https://blog.csdn.net/qq_33019839/article/details/103000717
    https://blog.csdn.net/itmyhome1990/article/details/39230365
    https://www.cnblogs.com/hailexuexi/p/5318255.html
    */
try {
var a=0;
var b=0;
var c=0;
var d=0;
var e=0;
var str = document.getElementsByTagName('html')[0].innerHTML
  //漫画里区模块>>>>>
  if(str.indexOf("<span>漫画里区")!=-1){
  if(str.indexOf("隐藏")!=-1){
  //输入指定方案
  a=a+1;
}}
    //动画里区模块>>>>>
  if(str.indexOf("<span>动画里区")!=-1){
  if(str.indexOf("隐藏")!=-1){
  //输入指定方案
  b=b+1;
}}
    //自购区模块>>>>>
  if(str.indexOf("<span>动漫自购/自翻区")!=-1){
  if(str.indexOf("隐藏")!=-1){
  //输入指定方案
  c=c+1;
}}
        //新番区模块>>>>>
  if(str.indexOf("<span>新番连载")!=-1){
  if(str.indexOf("隐藏")!=-1){
  //输入指定方案
  d=d+1;
}}
            //动画分享模块>>>>>
  if(str.indexOf("<span>动画分享")!=-1){
  if(str.indexOf("隐藏")!=-1){
  //输入指定方案
  e=e+1;
}}


//测试专用：
//alert(a+b+c+d+e);

if(a+b+c+d+e>1){
//数值过多报错提醒
var manhualiqu = '<table border="1" cellpadding="1" cellspacing="1" style="border-style: dashed;border-width: 5px;width: 100%;"><tbody><tr><td style="text-align:center;"><p><span style="font-size:8px;"><font color="#000000"><b>好像这里不是目标耶w</b></font></span></p></td></tr></tbody></table>';
  //将以上拼接的html代码插入到网页里的ul标签中
  var ul_tag = $("aside.ipsComment_author>ul");
  if (ul_tag) {
      ul_tag.removeClass("???").addClass("cAuthorPane_info").append(manhualiqu);
}
}else{
if(a>0){
//1：插入特定图片   漫画里区
var manhualiqu = '<div class="help" style="position: fixed; bottom: 90px; left: 60px; z-index: 9999;"><table border="0" cellpadding="1" cellspacing="1" style="border-style: dashed dashed none dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><div class="huangtang"><span style="color:#dddddd;"><span style="font-size:8px;"><b>------&nbsp;&nbsp;&nbsp;该贴尚未评分&nbsp; &nbsp;------</b></span></span></div></td></tr></tbody></table><table border="1" cellpadding="1" cellspacing="1" style="border-style: dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><p><span style="color:#000000;"><span style="font-size:24px;"><strong>漫画里区</strong></span><strong><span style="font-size:8px;">评分辅助</span></strong></span><br><br></p><p style="text-align: left;"><strong>&nbsp;<u>一般单行本：<span style="color:#e74c3c;">100节操 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'100\'"> 100节操</button></u></strong><br><br></p><p style="text-align: left;"><strong>&nbsp;小于500mb合集：<span style="color:#e74c3c;">250节操 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'250\'"> 250节操</button></strong><br><br></p><p style="text-align: left;"><strong>&nbsp;500mb~3g合集：<span style="color:#e74c3c;">350节操 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'350\'"> 350节操</button></strong></p><p style="text-align: left;"><br><strong>&nbsp;★<span style="font-size:14px;">海内外分流：<span style="color:#e74c3c;">30&nbsp;</span>+ (100) </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'30\'"> 30节操</button></p><p style="text-align: right;"><span style="font-size:8px;">注：之后每增加2g增加200节操<br>奖励上限500~1200</span></p><a href="https://pan.baidu.com/"><img src="https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true" style="width: 50px; height: auto;"></a><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-5)"> 节操+5</button><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-10)"> 节操+10</button><input class="thankYou"></td></tr></tbody></table></div>';
  //将以上拼接的html代码插入到网页里的ul标签中
  var ul_tag = $("aside.ipsComment_author>ul");
  if (ul_tag) {
      ul_tag.removeClass("???").addClass("cAuthorPane_info").append(manhualiqu);
}}
if(b>0){
//1：插入特定图片   动画里区
var donghualiqu = '<div class="help" style="position: fixed; bottom: 90px; left: 60px; z-index: 9999;"><table border="0" cellpadding="1" cellspacing="1" style="border-style: dashed dashed none dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><div class="huangtang"><span style="color:#dddddd;"><span style="font-size:8px;"><b>------&nbsp;&nbsp;&nbsp;该贴尚未评分&nbsp; &nbsp;------</b></span></span></div></td></tr></tbody></table><table border="1" cellpadding="1" cellspacing="1" style="border-style: dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><p><span style="color:#000000;"><span style="font-size:24px;"><strong>动画里区</strong></span><strong><span style="font-size:8px;">评分辅助</span></strong></span><br><br></p><p style="text-align: left;"><strong>&nbsp;预告贴：<span style="color:#e74c3c;">70节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'70\'"> 70节操</button><br><br></p><p style="text-align: left;"><strong>&nbsp;<u>720p里番：<span style="color:#e74c3c;">130节操 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'130\'"> 130节操</button></u><br>&nbsp; &nbsp; ┃<br>&nbsp; &nbsp; ┣ 1~2g合集：<span style="color:#e74c3c;">380节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'380\'"> 380节操</button></p><p style="text-align: left;"><strong>&nbsp; &nbsp; ┗ 4g合集：<span style="color:#e74c3c;">580节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'580\'"> 580节操</button></p><p style="text-align: left;"><br></p><p style="text-align: left;"><strong>&nbsp;1080p里番：<span style="color:#e74c3c;">150节操 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'150\'"> 150节操</button><br>&nbsp; &nbsp; ┃</strong></p><p style="text-align: left;"><strong>&nbsp; &nbsp; ┣&nbsp;1~2g合集：<span style="color:#e74c3c;">400节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'400\'"> 400节操</button></p><p style="text-align: left;"><strong>&nbsp; &nbsp; ┗ 4g合集：<span style="color:#e74c3c;">600节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'600\'"> 600节操</button></p><p style="text-align: left;"><br><strong>&nbsp;★<span style="font-size:14px;">海内外分流：<span style="color:#e74c3c;">30&nbsp;</span>+ (100) </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'30\'"> 30节操</button></p><p style="text-align: right;"><span style="font-size:8px;">注：之后每增加2g增加200节操<br>奖励上限500~1200</span></p><a href="https://pan.baidu.com/"><img src="https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true" style="width: 50px; height: auto;"></a><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-5)"> 节操+5</button><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-10)"> 节操+10</button><input class="thankYou"></td></tr></tbody></table></div>';
//将以上拼接的html代码插入到网页里的ul标签中
var ul_tag = $("aside.ipsComment_author>ul");
if (ul_tag) {
  ul_tag.removeClass("???").addClass("cAuthorPane_info").append(donghualiqu);
}}
if(c>0){
//1：插入特定图片   自购自翻
var donghualiqu = '<div class="help" style="position: fixed; bottom: 90px; left: 60px; z-index: 9999;"><table border="0" cellpadding="1" cellspacing="1" style="border-style: dashed dashed none dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><div class="huangtang"><span style="color:#dddddd;"><span style="font-size:8px;"><b>------&nbsp;&nbsp;&nbsp;该贴尚未评分&nbsp; &nbsp;------</b></span></span></div></td></tr></tbody></table><table border="1" cellpadding="1" cellspacing="1" style="border-style: dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><p><span style="color:#000000;"><span style="font-size:24px;"><strong>自购自翻</strong></span><strong><span style="font-size:8px;">评分辅助</span></strong></span><br><br></p><p style="text-align: left;"><strong>&nbsp;<u>本子：<span style="color:#e74c3c;">360~730节操1福源 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'360\' , document.querySelectorAll(\'.ipsField_short\')[1].value=\'1\'"> 360节操1福源</button></u></strong><br><br></p><p style="text-align: left;"><strong>&nbsp;动画：<span style="color:#e74c3c;">410~730节操1福源 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'410\' , document.querySelectorAll(\'.ipsField_short\')[1].value=\'1\'"> 410节操1福源</button></strong><br><br></p><p style="text-align: left;"><strong>&nbsp;自翻/80页+cg/自制动画：</strong><br><strong><span style="color:#e74c3c;">&nbsp;730~1530节操2福源 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'730\' , document.querySelectorAll(\'.ipsField_short\')[1].value=\'2\'"> 730节操2福源</button></strong><br><strong><span style="color:#e74c3c;">（加精）</span></strong></p><p style="text-align: left;"><br><strong>&nbsp;★<span style="font-size:14px;">海内外分流：<span style="color:#e74c3c;">30&nbsp;</span>+ (100) </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'30\' , document.querySelectorAll(\'.ipsField_short\')[1].value=\'0\'"> 30节操</button></p><p style="text-align: right;"><span style="font-size:8px;">注：首发SSTM+300节操</span></p><a href="https://pan.baidu.com/"><img src="https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true" style="width: 50px; height: auto;"></a><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-5)"> 节操+5</button><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-10)"> 节操+10</button><input class="thankYou"></td></tr></tbody></table></div>';
//将以上拼接的html代码插入到网页里的ul标签中
var ul_tag = $("aside.ipsComment_author>ul");
if (ul_tag) {
  ul_tag.removeClass("???").addClass("cAuthorPane_info").append(donghualiqu);
}}
if(d>0){
//1：插入特定图片   新番连载
var donghualiqu = '<div class="help" style="position: fixed; bottom: 90px; left: 60px; z-index: 9999;"><table border="0" cellpadding="1" cellspacing="1" style="border-style: dashed dashed none dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><div class="huangtang"><span style="color:#dddddd;"><span style="font-size:8px;"><b>------&nbsp;&nbsp;&nbsp;该贴尚未评分&nbsp; &nbsp;------</b></span></span></div></td></tr></tbody></table><table border="1" cellpadding="1" cellspacing="1" style="border-style: dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><p><span style="color:#000000;"><span style="font-size:24px;"><strong>新番连载</strong></span><strong><span style="font-size:8px;">评分辅助</span></strong></span><br><br></p><p style="text-align: left;"><strong>&nbsp;720p：<span style="color:#e74c3c;">90节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'90\'"> 90节操</button><br><br></p><p style="text-align: left;"><strong>&nbsp;<u>1080p：<span style="color:#e74c3c;">110节操 </span><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'110\'"> 110节操</button></u></strong></p><p style="text-align: left;"><br></p><p style="text-align: left;"><strong>&nbsp;数量表（2/3/4/5/6）：<br>&nbsp; 720：<button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'150\'"> 150</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'210\'"> 210</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'270\'"> 270</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'330\'"> 330</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'390\'"> 390</button><br>&nbsp;1080：<button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'190\'"> 190</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'270\'"> 270</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'350\'"> 350</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'430\'"> 430</button><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'510\'"> 510</button></p><p style="text-align: left;"><br><strong>&nbsp;★<span style="font-size:14px;">海内外分流：<span style="color:#e74c3c;">30&nbsp;</span>+ (100) </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'30\'"> 30节操</button></p><p style="text-align: right;"><span style="font-size:8px;">注：奖励上限500~1200</span></p><a href="https://pan.baidu.com/"><img src="https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true" style="width: 50px; height: auto;"></a><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-5)"> 节操+5</button><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-10)"> 节操+10</button><input class="thankYou"></td></tr></tbody></table></div>';
  //将以上拼接的html代码插入到网页里的ul标签中
  var ul_tag = $("aside.ipsComment_author>ul");
  if (ul_tag) {
      ul_tag.removeClass("???").addClass("cAuthorPane_info").append(donghualiqu);
}}
if(e>0){
//1：插入特定图片   动画分享
var donghualiqu = '<div class="help" style="position: fixed; bottom: 90px; left: 60px; z-index: 9999;"><table border="0" cellpadding="1" cellspacing="1" style="border-style: dashed dashed none dashed;border-width: 5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><div class="huangtang"><span style="color:#dddddd;"><span style="font-size:8px;"><b>------&nbsp;&nbsp;&nbsp;该贴尚未评分&nbsp; &nbsp;------</b></span></span></div></td></tr></tbody></table><table border="1" cellpadding="1" cellspacing="1" style="border-style:dashed;border-width:5px;width: 300px;background-color: white;"><tbody><tr><td style="text-align:center;"><p><span style="color:#000000;"><span style="font-size:24px;"><strong>动画分享</strong></span><strong><span style="font-size:8px;">评分辅助</span></strong></span><br><br></p><p style="text-align:left;"><strong>&nbsp; 720p：<span style="color:#e74c3c;">180节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'180\'"> 180节操</button><br><strong>&nbsp; &nbsp; ┗ 完结：<span style="color:#e74c3c;">380节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'380\'"> 380节操</button></p><p style="text-align:left;"><br></p><p style="text-align:left;"><strong>&nbsp;1080p：<span style="color:#e74c3c;">230节操 </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'230\'"> 230节操</button><br><strong>&nbsp; &nbsp; ┗ <u>完结：<span style="color:#e74c3c;">430节操 </span></u></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'430\'"> 430节操</button></p><p style="text-align: left;"><br><strong>&nbsp;★<span style="font-size:14px;">海内外分流：<span style="color:#e74c3c;">30&nbsp;</span>+ (100) </span></strong><button type = "button" onclick = "document.querySelector(\'.ipsField_short\').value=\'30\'"> 30节操</button></p><p style="text-align: right;"><span style="font-size:8px;">注：奖励上限500~1200</span></p><a href="https://pan.baidu.com/"><img src="https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true" style="width: 50px; height: auto;"></a><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-5)"> 节操+5</button><button type="button" onclick="num=document.querySelector(\'.ipsField_short\').value , document.querySelector(\'.ipsField_short\').value=num-(-10)"> 节操+10</button><input class="thankYou"></td></tr></tbody></table></div>';
  //将以上拼接的html代码插入到网页里的ul标签中
  var ul_tag = $("aside.ipsComment_author>ul");
  if (ul_tag) {
      ul_tag.removeClass("???").addClass("cAuthorPane_info").append(donghualiqu);
}}
}
//alert("评分辅助运行成功")
} catch (error) {
    console.error("评分辅助运行失败: ", error);
}
}pingFen();

function shouFeiZhiDing() {
    //6号项目=====================================================================================================================================================================
    //收费显示框提取并悬浮在最上面
    /*
    参考资料:
    https://bbs.csdn.net/topics/392086205?page=1   识别元素为字符串.innerHTML
    https://www.runoob.com/jsref/met-element-queryselector.html   识别和修改元素内容
    https://blog.csdn.net/Gherbirthday0916/article/details/124157582   选择列表第二个元素
    http://www.divcss7.com/jiqiao/1409.html   元素float:left居左float:right居右
    */
try {
    var str = document.getElementsByTagName('html')[0].innerHTML
  if(str.indexOf("查找他们其他文件")!=-1){
  if(str.indexOf("获得支持")!=-1){
  //输入指定方案
    var shoufei = '<div id="shoufei" class="shoufei" style="position: fixed; top: 0px; left: 0px; z-index: 5000;"><table align="center" border="5" cellpadding="1" cellspacing="1" style="width: auto;height: auto;border-style: solid;border-color: black;"><tbody><tr><td style="width:96%;background-color: rgb(136, 136, 136); "><p style="text-align: center;"><span style="color:#f1c40f;"><span style="font-size:22px;"><strong>&lt;付费区内容&gt;</strong></span></span></p><p class="shoufei2"><span style="color:#ffffff;"><strong><span style="font-size:36px;">---- 无 ----</span></strong></span><br></p><p style="text-align: center;"><a href="https://pan.baidu.com/"><img src="https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png" loading="lazy" title=":wn009:" alt=":wn009:" data-emoticon="true" style="width: 40px; height: auto;"></a><button type = "delete" onclick = "document.getElementById(\'shoufei\').remove()" style="float:right;">隐藏悬浮框</button></p></td></tr></tbody></table><table border="1" cellpadding="1" cellspacing="1" style="border-style:dashed;border-width:5px;width:auto;background-color:#FFFFFF;width: 200px;"><tbody><tr><td style="text-align:center;"><div><font color="#000000"><span style="font-size:18px;"><b>快捷购买下载</b></span></font><br><a onclick="document.querySelector(\'.ipsColumn.ipsColumn_wide\').querySelector(\'a\').click()"><img alt="-2022-05-20-2001094605f2cce4eaf61c.png" class="ipsImage ipsImage_thumbnailed" data-ratio="103.45" height="60" width="58" src="https://s.sstmlt.com/img/2022/05/20/image9f017f3f342184d7.png" style="width: 200px;height: auto;"></a><br><a onclick="document.querySelector(\'.ipsColumn.ipsColumn_wide\').querySelectorAll(\'a\')[1].click()"><img alt="-2022-05-20-2001094605f2cce4eaf61c.png" class="ipsImage ipsImage_thumbnailed" data-ratio="103.45" height="60" width="58" src="https://s.sstmlt.com/img/2022/05/20/image1ab31aa2f99df977.png" style="width: 200px;height: auto;"></a></div></td></tr></tbody></table></div>';
    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.focus-user>ul");
    if (ul_tag) {
        ul_tag.removeClass("???").addClass("elUserNav").append(shoufei);
    }
var x = document.getElementById("ipsLayout_mainArea").querySelector(".ipsQuote").innerHTML;
//alert(x)
var y = document.getElementById("shoufei").querySelector(".shoufei2").innerHTML = x;
}}
//alert("收费显示框悬浮运行成功")
} catch (error) {
    console.error("收费显示框悬浮运行失败: ", error);
}
}shouFeiZhiDing();

function yinCangXianShi() {
    //7号项目=====================================================================================================================================================================
    //自动点开隐藏内容
    /*
    参考资料:
    https://blog.csdn.net/Hakim2214/article/details/106493607         .click()点击元素的方法
    https://www.runoob.com/jsref/met-document-queryselectorall.html   对所有class元素进行处理
    */
try {
var i
var x = document.querySelectorAll(".ipsSpoiler_closed");
for (i = 0; i < x.length; i++) {
    x[i].click();
}
x = document.querySelectorAll(".ipsTruncate_more");
for (i = 0; i < x.length; i++) {
    x[i].click();
}
x = document.querySelectorAll(".ipsDialog.ipsDialog_wide");
for (i = 0; i < x.length; i++) {
    x[i].remove();
}
x = document.querySelectorAll(".ipsDialog.ipsDialog_wide");
for (i = 0; i < x.length; i++) {
    x[i].remove();
}
//document.querySelectorAll(".ipsButton.ipsButton_verySmall.ipsButton_narrow")[0].click();  引申用途
//document.querySelectorAll('.ipsComment_content.ipsType_medium')[0].querySelectorAll('.ipsButton_verySmall')[0].click();
//alert("自动点击隐藏运行成功")
} catch (error) {
    console.error("自动点击隐藏运行失败: ", error);
}
}

function anNiuWaiZhi() {
    //8号项目=====================================================================================================================================================================
    //评分和查看文件按钮外置
    /*
    参考资料:
    https://www.runoob.com/jsref/met-element-queryselector.html   选择元素内的第一个子元素
    */
try {
  str = document.getElementsByTagName('html')[0].innerHTML
  if(str.indexOf("https://s.sstmlt.com/img/2022/05/17/8ef0070fb3c0ef72295f02cfa121056363a988d4719b8604.png")!=-1){
  //输入指定方案
    var pingfen = '<div class="pingfen" style="position: fixed; height: 70px; width: 70px; bottom: 135px; left: 355px; z-index: 999;"><table border="1" cellpadding="1" cellspacing="1" style="border-style:dashed;border-width:5px;width:auto;background-color:#FFFFFF;"><tbody><tr><td style="text-align:center;"><div><font color="#000000"><span style="font-size:18px;"><b>评分</b></span></font><br><a onclick="document.querySelectorAll(\'.ipsComment_content.ipsType_medium\')[0].querySelectorAll(\'.ipsButton_verySmall\')[0].click()"><img alt="-2022-05-20-2001094605f2cce4eaf61c.png" class="ipsImage ipsImage_thumbnailed" data-ratio="103.45" height="60" width="58" src="https://s.sstmlt.com/img/2022/05/20/-2022-05-20-2001094605f2cce4eaf61c.png"></a></div></td></tr></tbody></table></div>';
    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.focus-user>ul");
    if (ul_tag) {
        ul_tag.removeClass("???").addClass("elUserNav").append(pingfen);
    }
}
  else{
    var pingfen = '<div class="pingfen" style="position: fixed; height: 70px; width: auto; bottom: 60px; left: 160px; z-index: 999;"><table border="1" cellpadding="1" cellspacing="1" style="border-style:dashed;border-width:5px;width:auto;background-color:#FFFFFF;"><tbody><tr><td style="text-align:center;"><div><a onclick="document.querySelectorAll(\'.ipsComment_content.ipsType_medium\')[0].querySelectorAll(\'.ipsButton_verySmall\')[0].click()"><img alt="-2022-05-20-2001094605f2cce4eaf61c.png" class="ipsImage ipsImage_thumbnailed" data-ratio="103.45" height="60" width="58" src="https://s.sstmlt.com/img/2022/05/20/-2022-05-20-2001094605f2cce4eaf61c.png"></a><a onclick="window.location.href=\'javascript:location.reload();\'"><img alt="-2022-05-20-2001094605f2cce4eaf61c.png" class="ipsImage ipsImage_thumbnailed" data-ratio="103.45" height="60" width="58" src="https://s.sstmlt.com/img/2022/05/21/imagebed20116c031adaa.png"></a></div></td></tr></tbody></table></div>';
    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.focus-user>ul");
    if (ul_tag) {
        ul_tag.removeClass("???").addClass("elUserNav").append(pingfen);
    }
    }
//alert("评分按钮外置运行成功")
} catch (error) {
    console.error("评分按钮外置运行失败: ", error);
}
}anNiuWaiZhi();

function huangTangZhiDing() {
    //9号项目=====================================================================================================================================================================
    //黄糖评分置顶
    /*
    参考资料:
    https://blog.csdn.net/happybear_/article/details/123091562?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~aggregatepage~first_rank_ecpm_v1~rank_v31_ecpm-1-123091562-null-null.pc_agg_new_rank&utm_term=querySelector%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA&spm=1000.2123.3001.4430
    */
try {
  if(str.indexOf("ratePublicFund")!=-1){
  //输入指定方案
      var huangtang = document.querySelector('.cPost_contentWrap').querySelector('.ipsResponsive_hidePhone').innerHTML
      x = document.querySelectorAll(".huangtang");
      for (i = 0; i < x.length; i++) {
          x[i].innerHTML = huangtang;
          x[i].querySelector('.ratePublicFund').style.backgroundColor = "#fff6dd"
      }
      //document.querySelectorAll(".huangtang")[length].innerHTML = huangtang
      //document.querySelectorAll(".huangtang")[length].style.backgroundColor = "#fff6dd"
}
//alert("黄糖置顶运行成功")
} catch (error) {
    console.error("黄糖置顶运行失败: ", error);
}
}huangTangZhiDing();

function ganXie() {
    //10号项目=====================================================================================================================================================================
    //感谢的话语生成器
    /*
    参考资料:
    https://blog.csdn.net/HX13190042/article/details/108332829   内容输入到input
    https://www.runoob.com/jsref/prop-html-innerhtml.html   获取元素内的文字部分
    */
try {
      if(str.indexOf("评分辅助")!=-1){
          if(str.indexOf("thankYou")!=-1){
  //输入指定方案
      var id = document.querySelector('.ipsComment_author.cAuthorPane.ipsColumn.ipsColumn_medium.ipsResponsive_hidePhone').querySelector('a').innerText
      var word = "感谢"+id+"大人分享~"
      x = document.querySelectorAll(".thankYou");
      for (i = 0; i < x.length; i++) {
          x[i].value= word
          x[i].setAttribute("onclick","document.querySelectorAll('.ipsFieldRow_content')[4].querySelector('input').value='"+word+"';")
      }
      x = document.querySelectorAll(".help");
      for (i = 0; i < x.length; i++) {
          x[i].setAttribute("onclick","document.querySelectorAll('.ipsFieldRow_content')[4].querySelector('input').value='"+word+"';")
      }
      }}
//alert("感谢话语运行成功")
} catch (error) {
    console.error("感谢话语运行失败: ", error);
}
}ganXie();

function suoTieFuZhu() {
    //11号项目=====================================================================================================================================================================
    //表区锁帖辅助
    /*
    参考资料:
    https://blog.csdn.net/Yanzudada/article/details/104665199      时间存储和时间对比
    https://www.html.cn/qa/javascript/11150.html                   公式计算出时间差值
    https://www.runoob.com/jsref/met-element-getattribute.html     获取元素特定属性值
    https://blog.csdn.net/living_ren/article/details/79349402      指定元素修改属性
    https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-weight   b元素与粗体属性
    https://zhuanlan.zhihu.com/p/139933822                         获取系统当前时间
    */
    //所有翻页按键增加点击完全刷新功能
try {
    if(document.querySelector(".ipsPagination")){
    x=document.querySelectorAll(".ipsPagination")[0].querySelectorAll("li");
    for(i=0;i<x.length;i++){
        if(x[i].className == "ipsPagination_pageJump"){}else{
            x[i].setAttribute("onclick","window.location.href='javascript:location.reload();'");
        }
    }
    var len = document.querySelectorAll(".ipsPagination").length-1
//alert(len)
    x=document.querySelectorAll(".ipsPagination")[len].querySelectorAll("li");
    for(i=0;i<x.length;i++){
        if(x[i].className == "ipsPagination_pageJump"){}else{
            x[i].setAttribute("onclick","window.location.href='javascript:location.reload();'");
        }
    }}

    if(str.indexOf("动漫讨论区")!=-1){
        if(str.indexOf("欢迎一切对动漫的讨论")!=-1){
    x = document.querySelectorAll('.ipsBox.ipsResponsive_pull')[2].querySelectorAll('.ipsDataItem_responsivePhoto');
    var warning = 0 //计算有多少个需要锁帖的内容
    //判断发帖时间是否超5个月=====================
    for (i = 0; i < x.length; i++) {
var time1 = new Date(x[i].querySelector('time').getAttribute("datetime"))
var time2 = new Date()
    var usedTime = time2 - time1 //两个时间戳相差的毫秒数
    var mounths=Math.floor(usedTime/(30*24*3600*1000));//计算月数
    var leave0=usedTime%(30*24*3600*1000);
    var days=Math.floor(leave0/(24*3600*1000));
    //计算出小时数
    var leave1=usedTime%(24*3600*1000);
    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);
    //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    var time = "== 距今 "+mounths+"月 "+days + "天 "+hours+"时 "+minutes+"分 ==";
    //var time = days;

    //输入到每个帖子列表里面
    var node=document.createElement("b");
	var textnode=document.createTextNode(time);
	node.appendChild(textnode);
    x[i].querySelector('.ipsType_break.ipsContained').querySelector('a').appendChild(node).className="mounthDayHoursminute"
    //document.querySelectorAll('.ipsBox.ipsResponsive_pull')[2].querySelectorAll('.ipsDataItem_responsivePhoto')[0].querySelector('time').innerHTML+=", "+time

    //添加粗体字并颜色警告
    str = x[i].innerHTML
    x[i].querySelector('.mounthDayHoursminute').setAttribute('font-weight','normal')
          if(mounths>=5){
              if(str.indexOf("ipsType_medium fa fa-lock")!=-1){ //如果锁了
                  x[i].querySelector('.mounthDayHoursminute').setAttribute('style','color: #ffcccc;')//浅红
              }else if(str.indexOf("fa fa-eye-slash")!=-1){ //如果隐藏了
                  x[i].querySelector('.mounthDayHoursminute').setAttribute('style','color: #ffcccc;')//浅红
              }else if(str.indexOf("fa fa-thumb-tack")!=-1){ //如果置顶了
                  x[i].querySelector('.mounthDayHoursminute').setAttribute('style','color: #ffcccc;')//浅红
              }else{ //如果没有处理
                  x[i].querySelector('.mounthDayHoursminute').setAttribute('style','color: red;')//深红
                  x[i].querySelector('.ipsType_break.ipsContained').querySelector('b').className="needFix"
                  warning+=1
              }
          }else if(mounths>=3){
              x[i].querySelector('.mounthDayHoursminute').setAttribute('style','color: #ffe0a6;')//橘色
          }else{
              x[i].querySelector('.mounthDayHoursminute').setAttribute('style','color: #e1e1e1;')//灰色
          }
      }



    //判断回帖时间是否超1个月=====================
    for (i = 0; i < x.length; i++) {
        time1 = new Date(x[i].querySelector('.ipsDataItem_lastPoster.ipsDataItem_withPhoto.ipsType_blendLinks').querySelector('time').getAttribute("datetime"))
        time2 = new Date()
        usedTime = time2 - time1 //两个时间戳相差的毫秒数
        mounths=Math.floor(usedTime/(30*24*3600*1000));//计算月数
        leave0=usedTime%(30*24*3600*1000);
        days=Math.floor(leave0/(24*3600*1000));
        //计算出小时数
        leave1=usedTime%(24*3600*1000);
        //计算天数后剩余的毫秒数
        hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        leave2=leave1%(3600*1000);
        //计算小时数后剩余的毫秒数
        minutes=Math.floor(leave2/(60*1000));
        time = " 距今 "+mounths+"月 "+days + "天 "+hours+"时 "+minutes+"分";
        //var time = days;
//alert(time)
        //输入到每个帖子列表里面
        node=document.createElement("b");
        textnode=document.createTextNode(time);
        node.appendChild(textnode);
        x[i].querySelector('.ipsDataItem_lastPoster.ipsDataItem_withPhoto.ipsType_blendLinks').querySelector('.ipsType_light').querySelector('a').appendChild(node).className="mounthDayHours"
        //document.querySelectorAll('.ipsBox.ipsResponsive_pull')[2].querySelectorAll('.ipsDataItem_responsivePhoto')[0].querySelector('time').innerHTML+=", "+time

        //添加粗体字并颜色警告
        str = x[i].innerHTML
        x[i].querySelector('.mounthDayHours').setAttribute('font-weight','normal')
        if(mounths>=1){
            if(str.indexOf("ipsType_medium fa fa-lock")!=-1){ //如果锁了
                x[i].querySelector('.mounthDayHours').setAttribute('style','color: #ffcccc;')//浅红
            }else if(str.indexOf("fa fa-eye-slash")!=-1){ //如果隐藏了
                x[i].querySelector('.mounthDayHours').setAttribute('style','color: #ffcccc;')//浅红
            }else if(str.indexOf("fa fa-thumb-tack")!=-1){ //如果置顶了
                x[i].querySelector('.mounthDayHours').setAttribute('style','color: #ffcccc;')//浅红
            }else{ //如果没有处理
                x[i].querySelector('.mounthDayHours').setAttribute('style','color: red;')//深红
                x[i].querySelector('.ipsDataItem_lastPoster.ipsDataItem_withPhoto.ipsType_blendLinks').querySelector('.ipsType_light').querySelector('b').className="needFix"
                warning+=1
            }
        }else if(days>=15){
            x[i].querySelector('.mounthDayHours').setAttribute('style','color: #ffe0a6;')//橘色
        }else{
            x[i].querySelector('.mounthDayHours').setAttribute('style','color: #e1e1e1;')//灰色
        }
    }

    //Warning提醒有需要锁帖的内容
    if(warning>0){
        node=document.createElement("span");
        textnode=document.createTextNode(" =有贴未锁= ");
        node.appendChild(textnode);
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').appendChild(node).className="warning"
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').querySelector('.warning').setAttribute('style','background-color: #ff1700;color: #ffffff;')
        node=document.createElement("button");
        textnode=document.createTextNode(" 全选未锁帖子 ");
        node.appendChild(textnode);
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').appendChild(node).className="quanxuan"
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').querySelector('.quanxuan').setAttribute('onclick','x = document.querySelectorAll(\'.ipsBox.ipsResponsive_pull\')[2].querySelectorAll(\'.ipsDataItem_responsivePhoto\');for (i = 0; i < x.length; i++) {str = x[i].innerHTML;if(str.indexOf(\'needFix\')!=-1){x[i].querySelector(\'.ipsDataItem_modCheck\').querySelector(\'.ipsCustomInput\').querySelector(\'input\').click();}}')
        /*
        node=document.createElement("button");
        textnode=document.createTextNode(" 跳过⚠️ ");
        node.appendChild(textnode);
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').appendChild(node).className="checkNext"
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').querySelector('.checkNext').setAttribute('onclick','document.querySelector(\'.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear\').querySelector(\'.ipsPagination_next\').querySelector(\'a\').click();window.location.href=\'javascript:location.reload();\'')
*/
}else{
        node=document.createElement("span");
        textnode=document.createTextNode(" =没有问题= ");
        node.appendChild(textnode);
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').appendChild(node).className="warning"
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').querySelector('.warning').setAttribute('style','background-color: #2ecc71;color: #ffffff;')
        /*
        node=document.createElement("button");
        textnode=document.createTextNode(" 检查下一页 ");
        node.appendChild(textnode);
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').appendChild(node).className="checkNext"
        document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsPagination').querySelector('.checkNext').setAttribute('onclick','document.querySelector(\'.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear\').querySelector(\'.ipsPagination_next\').querySelector(\'a\').click();window.location.href=\'javascript:location.reload();\'')
   */
   }
    //一个刷新用的按钮
    node=document.createElement("button");
    textnode=document.createTextNode("刷新脚本♻️");
    node.appendChild(textnode);
    document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsButtonRow').appendChild(node).className="shuaXinAnNiu"
    document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsButtonRow').querySelector('.shuaXinAnNiu').setAttribute('onclick','window.location.href=\'javascript:location.reload();\'')
    document.querySelector('.ipsButtonBar.ipsPad_half.ipsClearfix.ipsClear').querySelector('.ipsButtonRow').querySelector('.shuaXinAnNiu').setAttribute('title','如果没有正常显示日期, 点此来刷新页面和脚本')
    //循环遍历多选(整合到按钮了)
    //x = document.querySelectorAll('.ipsBox.ipsResponsive_pull')[2].querySelectorAll('.ipsDataItem_responsivePhoto');for (i = 0; i < x.length; i++) {str = x[i].innerHTML;if(str.indexOf("needFix")!=-1){x[i].querySelector('.ipsDataItem_modCheck').querySelector('.ipsCustomInput').querySelector('input').click();}}
    //alert(time);
        }}
//alert("锁帖辅助运行成功")
} catch (error) {
    console.error("锁帖辅助运行失败: ", error);
}
}

    //12号项目(预定)=====================================================================================================================================================================
    //挖坟检测辅助
    /*
    参考资料:
    https://blog.csdn.net/Yanzudada/article/details/104665199      时间存储和时间对比
    https://www.html.cn/qa/javascript/11150.html                   公式计算出时间差值
    https://www.runoob.com/jsref/met-element-getattribute.html     获取元素特定属性值
    https://blog.csdn.net/living_ren/article/details/79349402      指定元素修改属性
    https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-weight   b元素与粗体属性
    */

function mumu() {
    //13号项目(母母定制)=====================================================================================================================================================================
    //回了一个贴之后 不跳转到自己刚刚回的页面 而是留在回复前那一页
    //新人回复高亮
    /*
    参考资料:
    https://blog.csdn.net/xiazaixm/article/details/79622997                                             新标签页打开链接
    https://www.cnblogs.com/ajk4/articles/6054410.html                                                  获取当前url
    https://blog.csdn.net/qwezhaohaihong/article/details/78309664                                       刷新页面的两种方法
    https://blog.csdn.net/WMN7Q/article/details/60573697                                                 onclick打开链接
    https://blog.csdn.net/buster2014/article/details/46310335                                           关闭标签页的js方式
    https://blog.csdn.net/qq_26483671/article/details/79464564                                          页面加载完毕后才执行脚本
    https://zh.code-paper.com/javascript/examples-wait-one-second-before-calling-function-javascript    js脚本执行前等待一段时间
    */
    //document.querySelector('.ipsComposeArea_dummy.ipsJS_show').click()  //打开对话框的js
    //window.onload=function(){
try {
    $(document).ready(function(){
    var url;
    var urlX;
    var urlY;
    var name;
    var name_time;
    var s
    var v
        //获取楼主名字和帖子日期
        name = document.getElementById("ipsLayout_contentWrapper").querySelector(".ipsPageHeader").querySelector(".ipsType_normal").querySelector("a").innerText
        name_time = document.getElementById("ipsLayout_contentWrapper").querySelector(".ipsPageHeader").querySelector(".ipsType_normal").querySelector(".ipsType_light").querySelector("time").getAttribute("datetime")
        //alert(name)
    x = document.getElementById("ipsLayout_contentWrapper").querySelectorAll(".cPost");
    for (i = 0; i < x.length; i++) {
        url = x[i].querySelector(".ipsType_reset.ipsResponsive_hidePhone").querySelector("a").getAttribute("href")
        urlX = 'document.querySelector(".ipsToolList.ipsToolList_horizontal.ipsClear.ipsClearfix.ipsJS_hide").querySelectorAll(\'li\')[1].querySelector(\'button\').setAttribute(\'onclick\',\'setTimeout(function(){window.opener=null;window.open("' + url + '");window.close();}, 200)\')'
        urlY = 'document.querySelector(".ipsToolList.ipsToolList_horizontal.ipsClear.ipsClearfix.ipsJS_hide").querySelectorAll(\'li\')[1].querySelector(\'button\').setAttribute(\'onclick\',\'window.open("' + url + '");\')'
        //alert(url)
        //锚点按钮1
        var node=document.createElement("li");
        x[i].querySelector('.ipsComment_controls').appendChild(node).className="maodian1"
        node=document.createElement("a");
        var textnode=document.createTextNode("锚点1");
        node.appendChild(textnode);
        x[i].querySelector('.maodian1').appendChild(node).className="maodian11"
        x[i].querySelector('.maodian1').querySelector('.maodian11').setAttribute('href','javascript:void(0);')
        x[i].querySelector('.maodian1').querySelector('.maodian11').setAttribute('onclick',urlX)
        x[i].querySelector('.maodian1').querySelector('.maodian11').setAttribute('title','锚点1: 点击后设定该回复为锚点, 在本页面进行回帖操作之后将会返回该位置而不是原本的帖子最末尾')
        //锚点按钮2
        node=document.createElement("li");
        x[i].querySelector('.ipsComment_controls').appendChild(node).className="maodian2"
        node=document.createElement("a");
        textnode=document.createTextNode("锚点2");
        node.appendChild(textnode);
        x[i].querySelector('.maodian2').appendChild(node).className="maodian22"
        x[i].querySelector('.maodian2').querySelector('.maodian22').setAttribute('href','javascript:void(0);')
        x[i].querySelector('.maodian2').querySelector('.maodian22').setAttribute('onclick',urlY)
        x[i].querySelector('.maodian2').querySelector('.maodian22').setAttribute('title','锚点2: 点击后设定该回复为锚点, 在本页面进行回帖操作之后将会新建标签并返回该位置而不是原本的帖子最末尾, 另一个标签回到帖子末尾')
/*旧插入机制
        var maodian = '<li><a href="javascript:void(0);" onclick="document.querySelector(&quot;.ipsToolList.ipsToolList_horizontal.ipsClear.ipsClearfix.ipsJS_hide&quot;).querySelectorAll(\'li\')[1].querySelector(\'button\').setAttribute(\'onclick\',\'window.opener=null;window.open(&quot;' + url + '&quot;);window.close();\')">锚点</a></li>'
        //将以上拼接的html代码插入到网页里的ul标签中
        var ul_tag = $("div.ipsItemControls>ul");
        if (ul_tag) {
            ul_tag.x[i].addClass("ipsComment_controls").append(maodian);
        }
*/
        //高亮新人
        if(name == x[i].querySelector('.ipsType_sectionHead').querySelector('a').innerText){}else{
        if(x[i].querySelector('blockquote')){
            if(name == x[i].querySelector('blockquote').querySelectorAll('a')[2].innerText){ //高亮与楼主的互动
                s = x[i].querySelectorAll('blockquote');
                for(v = 0; v < s.length; v++){
                    s[v].querySelectorAll('a')[2].setAttribute('style','background-color: rgb(255 183 115);')
                }
            }
        }else{
            x[i].setAttribute('style','background-color: rgb(255 250 237);'); //高亮没有引用的楼层
        }}
        /*除外引用楼主(判断错误量大)
        if(name == x[i].querySelector('.ipsType_sectionHead').querySelector('a').innerText){}else{
        if(x[i].querySelector('blockquote')){
            if(name == x[i].querySelector('blockquote').querySelectorAll('a')[2].innerText){
                x[i].setAttribute('style','background-color: rgb(255 250 237);');
            }
        }else{
            x[i].setAttribute('style','background-color: rgb(255 250 237);');
        }}*/
    }}, 500)
//alert("母母运行成功")
} catch (error) {
    console.error("母母运行失败: ", error);
}
}

function ziDongFangDa() {
    //14号项目=====================================================================================================================================================================
    //鼠标移动到封面图片自动放大
    /*
    参考资料:
    https://www.runoob.com/jsref/event-onmouseover.html                鼠标移动到元素上执行脚本
    */
try {
    if(str.indexOf("提交者")!=-1){
        if(str.indexOf("提交于")!=-1){
            if(document.querySelector(".cPost_contentWrap").querySelector(".ipsColumn_medium").querySelector("img")){
                document.querySelector(".cPost_contentWrap").querySelector(".ipsColumn_medium").querySelector("img").setAttribute('style',"width: 500px;")
                document.querySelector(".cPost_contentWrap").querySelector(".ipsColumn_medium").setAttribute('onmouseover','style="width: 500px;"')
                document.querySelector(".cPost_contentWrap").querySelector(".ipsColumn_medium").setAttribute('onmouseout','style=""')
        }}}

    document.addEventListener('DOMContentLoaded', function() {
  var searchField = document.getElementById('elSearchField');
  if (searchField) {
    searchField.value = '动漫里区';
  }
});
//alert("封面放大运行成功")
} catch (error) {
    console.error("封面放大运行失败: ", error);
}
}

/*
            《延迟启动区》
*/
window.addEventListener('load', function() {
//mimi();
//ceBianLan();
//zhiDing();

// 4 仅当选项被选中时，运行函数
if (GM_getValue("qingKongZhiDingEnabled", false)) {
    qingKongZhiDing();
}

//pingFen();
//shouFeiZhiDing();

// 7 仅当选项被选中时，运行函数
if (GM_getValue("yinCangXianShiEnabled", false)) {
    yinCangXianShi();
}

//anNiuWaiZhi();
//huangTangZhiDing();
//ganXie();

// 11 仅当选项被选中时，运行函数
if (GM_getValue("suoTieFuZhuEnabled", false)) {
    suoTieFuZhu();
}

// 13 仅当选项被选中时，运行函数
if (GM_getValue("mumuEnabled", false)) {
    mumu();
}

ziDongFangDa();
}, false);
