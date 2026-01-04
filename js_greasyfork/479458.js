// ==UserScript==
// @name         sis辅助评分
// @namespace    ashama
// @version      1.12
// @description  sis辅助评分处理脚本
// @license      GPL-3.0
// @author       Am
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @updateUrl    https://greasyfork.org/scripts/400159-sis%E8%BE%85%E5%8A%A9%E8%AF%84%E5%88%86/code/sis%E8%BE%85%E5%8A%A9%E8%AF%84%E5%88%86.user.js
// @require      https://greasyfork.org/scripts/450286-sis%E8%BE%85%E5%8A%A9%E8%AF%84%E5%88%86illegaluidlist-v3/code/sis%E8%BE%85%E5%8A%A9%E8%AF%84%E5%88%86illegalUidList%20v3.js
// @include      http*://*sexinsex.net/bbs/*
// @include      https://sis.xxx/bbs/*
// @include      http://174.127.195*/bbs/*
// @include      http*://*sexinsex.net/forum/*
// @include      http://174.127.195*/forum/*
// @include      https://sis.xxx/forum/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/479458/sis%E8%BE%85%E5%8A%A9%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/479458/sis%E8%BE%85%E5%8A%A9%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==
// changelog：
// v0.1   初版结合键盘宏实现评分，扩大评分按钮
// v0.2   改版，实现脱离键盘宏，直接预设分数评分
// v0.3   2020-04-09 优化，优化部分脚本，调整include适配
// v0.31  2020-04-09 代码优化，无阻塞评分，上在线库
// v0.32  2020-04-10 代码优化，调整mac评分，增加论坛提交反馈信息回显
// v0.33  2020-04-10 fix bugs：调整匹配页面，兼容sexinsex.net的域名
// v0.34  2020-04-10 重构，增加统计栏，按钮样式调整
// v0.35  2020-04-11 重构，优化记分牌，增加签到时间不足的提醒
// v0.40  2020-04-12 调整了签到时间不足判定的阈值，稍微修改逻辑
// v0.41  2020-04-12 增加了用户UID一致性判断
// v0.42  2020-04-13 增加了评分按钮提示，根据用户发帖内容和引用内容，推荐不加分、+5分、+10分、错误留言 和 需要人工判断 5种状态
// v0.43  2020-04-14 去掉了pid判断，评分按钮提示模糊判断改为仅判断 （x次），
// v0.44  2020-04-14 hotfix 去掉debug属性
// v0.45  2020-04-14 调整记分牌显示美观性，增加全角数字兼容
// v0.50  2020-04-15 增加黑名单记录和比对，调整记分牌位置
// v0.51  2020-04-15 hotfix 去掉debug属性，修改几个错字
// v0.52  2020-04-20 调整了一点显示逻辑
// v0.53  2020-04-21 更新了违规名单
// v0.54  2020-04-21 没回复的内容就没有+分了，错误除了黄色还增加了一行提示，更新了违规名单
// v0.55  2020-04-26 记分牌按楼展示，增加了本次评分id记录，如果多次发帖则标识，并提示上次发帖时间和URL
// v0.56  2020-04-26 在线更新（为了违规名单能及时更新）
// v0.60  2020-04-26 大更新，1增加了用户历史记录缓存，2提示用户多次发帖、连续发帖，3用户有违规时记录违规历史
// v0.61  2020-04-26 hotfix 修正了用户第一次回帖时提示信息可能出现两次的问题
// v0.63  2020-04-26 人类可以有多懒？修改了提示信息，修改了检索匹配逻辑，提高兼容性，更新违规名单，记分板智能识别点击（按建议评分或跳转当前行）
// v0.64  2020-04-30 更新了违规名单
// v0.70  2020-05-02 大更新，增加了按页批量评分，增加月签支持，修改匹配模式，修改了代码结构，调整处理结构更新了违规名单。性能得到了极大的反向升级(增至70ms左右)。
// v0.71  2020-05-04 记分板点击一次之后仍然可以通过点击跳转该楼层，微调了月签判断逻辑
// v0.72  2020-05-11 更新了违规名单，微调了月签判断逻辑，记分板时间格式化，增加月签鉴定他人乱入，记分板记录正常按黄色展示，评分成功/失败后应该也能点击记分牌跳转，3个月的违规记录按版规不计入，提示改为pid（避免跳页带来的误导）。
// v0.73  2020-05-13 更新了违规名单，微调了缓存回收逻辑
// v0.74  2020-05-15 更新了违规名单，调整了记分板记录颜色（处理过的黄色，否则白色），恢复了post的提示（还是偷偷保留了pid）
// v0.75  2020-05-19 更新了违规名单
// v0.76  2020-05-20 更新了违规名单加载模式，今后违规名单更新不需要再更新版本了
// v0.77  2020-05-25 再次更新了违规名单加载模式
// v0.78  2020-06-01 严谨化月签逻辑，用户名大小写不再敏感，修复违规名单加载的bug，优化月签综合上报提示，优化日签提示信息，日期兼容yyyy-mm-dd yyyy/mm/dd mm-dd-yyyy mm/dd/yyyy
// v0.79  2020-06-03 修改回复或引用内容有误bug
// v0.80  2020-06-13 在可评分楼层的pid显示区增加点击获取相对链接并复制到剪切板功能
// v0.81  2020-06-15 复制pid功能提供到所有版面
// v0.82  2020-06-17 提供每日三签上报记录生成功能
// v0.83  2020-06-27 逆序显示违规历史
// v0.84  2020-08-02 修改三签提示问题，修改bug：当月签论坛pid顺序错误时会多次计算当日签到数，严谨化月签逻辑，支持上月月末填报的月签信息，综合贴根据发帖时间处理当月月签数
// v0.85  2020-08-02 因为不可描述的原因，jquery原地址无法访问，更新至https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js国内镜像
// v0.86  2020-08-22 添加论坛时间 hh:MM  hh:MM:ss A/PM的支持，jquery地址更新至https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js微软镜像（貌似微软和中国关系不错应该不会被墙了）
// v0.87  2020-08-30 更新每日三签活动贴认定方法，从tid改为标题 [公告] 一天三“日” 福利帖
// v0.88  2020-11-03 增加对sexinsex.net/forum/前缀的支持，增加更多签到格式匹配，替换新的违规库
// v0.89  2020-11-03 月签第一页判断逻辑更新，月签增加对当前签到页的处理和分析，月签增加了对当前月的处理。
// v0.90  2020-11-05 月签匹配也按标题进行匹配，为日后重新迁楼预留兼容
// v0.91  2020-11-15 评分扩展支持按300分分段提交，扩展支持输入分数，增加了对超评分数（如延迟导致重复加分）的对冲。增加了【直达链接】，但是有偶尔失效的问题。相应了调整了记分板对分段提交的展示支持，增加记分板自动隐藏。
// v0.92  2020-11-24 调整日签评分分类及响应：未评（点击可评分）、加分、扣分、可补评（点击补全评分）、已超评（点击冲正超评分数）；采用原生语言优化【直达链接】；
// v0.93  2020-11-24 hotfix 重新发布，修正一个小bug。
// v0.94  2021-01-01 修复跨年月签月份处理错误的bug。
// v0.95  2021-01-01 实现了年签固定加分。
// v0.96  2021-03-18 感谢hellomickey 发现并提供方法，修正因为页面时间没有时区，导致夸市区切所在地有夏令时可能导致差1hr。
// v0.97  2021-03-20 修正时区问题
// v0.98  2021-04-03 改进月签相对链接校验方法，增加验证月签签到数和实际上报月签数的对比
// v0.99  2021-04-03 redirect.php模式最近问题较多，点击PID的【快速复制相对链接到剪贴板】其中相对连接方式重新改为viewthread.php模式
// v1.00  2021-08-01 调整月签综合贴处理和月签处理，增加月签和勋章挂钩的一系列功能，调整了月签综合贴评分格式。DoJob_Base增加了postauthorElement
// v1.01  2021-08-03 修正当增减分最终导致当前分数是0时，解析当前楼层评分情况的错误；修正评分内容的“>”显示转义符的问题。
// v1.02  2021-09-10 月签到支持繁体中文内容。
// v1.03  2021-11-11 增加勋章评分。才发现贡献、声望等也有评分上限，重写了加分算法，可以支持一次加任意分啦！
// v1.04  2021-12-15 增加年签评分功能。
// v1.05  2022-01-06 完成了年签评分，勋章评分的调试。增加了记分牌，优化了部分代码可读性。
// v1.06  2022-01-09 修复了几个bug。
// v1.07  2022-01-14 修复评分算法当扣分时却执行了加分的bug。
// v1.08  2022-02-12 优化部分正则写法，调整了异常逻辑，修正了勋章判断的一个错误，重写了勋章评分和认定的逻辑，增加了勋章评价列表的展示。
// v1.09  2022-03-01 修正了月签综合判断链接是否合理的逻辑
// v1.10  2022-04-02 修正了日签冲正的扣分说明，增加了对繁体勋章申请贴的处理
// v1.11  2022-08-27 增加了对于新https域名的支持，更换了违规用户库illegalUidList v3，微调了年签逻辑
// v1.12  2023-11-11 增加了未定义黑名单或黑名单定义格式错误的容错处理
 
$(document).ready(function(){
    console.time('inject time');
    const regfid = /forum-(\d+)-\d+.html|forumdisplay.php?fid=(\d+)/;
    const regtid1 = /thread-(\d+)-.*\.html/;//location.search
    const regtid2 = /tid=(\d+)/;//location.pathname
    const regpageMax = /(\d+)/; //pageMax
    const regpid = /pid(\d+)/; //pid
    const regpost = /(\d+)/; //post
    const regdate = /(\d+[-\/]\d+[-\/]\d+ \d+:\d+(:\d+)?( [AP]M)?)/; // 论坛日期 yyyy-mm-dd yyyy/mm/dd mm-dd-yyyy mm/dd/yyyy yyyy-mm-dd 论坛时间 hh:MM  hh:MM:ss A/PM
    const remark = /remarks.php?tid=(\d+)&page=(\d+)&pid=(\d+)/;//留言
    // 处理版面贴子
    if (!regfid.exec($("div#nav").prop("innerHTML"))){ return;}
    const fid = regfid.exec($("div#nav").prop("innerHTML"))[1];
    const tid = regtid2.exec(location.search) ? regtid2.exec(location.search)[1] :regtid1.exec(location.pathname)[1];
    const page = $("div.pages strong:first").text();
    const ttype = $("h1 a").text(); // 分类
    const title = $("h1").text().trim();
    const formhash = $("input[name='formhash']").prop("value");
    const urlBase = location.protocol+ "//" +location.hostname+ "/bbs/";
    if (typeof(illegalUidListRemote) == "undefined") {illegalUidListRemote = null} ;// 黑名单容错
    recycleGM();// recycleGM("ama_");
 
    // 初始化
    var do_job = function(fid,tid,page,ttype,title,formhash,urlBase){
        // 日签 每日三签贴
        if(fid == 420 && title == '[公告] 一天三“日” 福利帖') return new DoJob_DailyAward(tid,page,ttype,title,formhash,urlBase,illegalUidListRemote);
        // 月签 综合签到贴
        if(fid == 420 && title == '[公告] 月签到贴奖励上报发放处(次月1号至10为上报期)') return new DoJob_MonthlyAwardReport(tid,page,ttype,title,formhash,urlBase);
        // 月签 个人签到处理
        if(fid == 420 && ["[月签到]","[综合区管理专用]","[图区管理专用]","[文区管理专用]","[BT区管理专用]","[爱心会员专用]"].indexOf(ttype) > -1) return new DoJob_MonthlyAward(tid,page,ttype,title,formhash,urlBase);
        // 年签 综合签到贴
        if(fid == 420 && title == '[公告] 年签到贴奖励上报发放处(次年1月为上报期)') return new DoJob_YearlyAwardReport(tid,page,ttype,title,formhash,urlBase);
        // 年签 个人签到处理
        if(fid == 420 && "[年签汇总]" == ttype) return new DoJob_YearlyAward(tid,page,ttype,title,formhash,urlBase);
        // 勋章 勋章申请贴
        if(fid == 420 && title == '[公告] 会员勋章申请及奖励发放贴') return new DoJob_MedalAward(tid,page,ttype,title,formhash,urlBase);
        // 其他统一处理
        if(tid) return new DoJob_Base(tid,page,ttype,title,formhash,urlBase);
    }(fid,tid,page,ttype,title,formhash,urlBase);
    if (!do_job) return;
    do_job.init()
 
    // 逐个帖子处理 艹 $("table[summary]") ;if ($("div.postactions").length == 1){debugger;} console.log("a:contains('评分')".length , $("div.postactions").length);
    $("table:contains('报告')").each(function(){
        if(!this.id) return;
        // 初始化常用参数
        let pid = regpid.exec(this.id)[1];
        let uid = $("a#userinfo"+pid).text();
        let relativeUrl = "viewthread.php?tid="+tid+ "&page="+page +"#pid"+pid;
        let refer = urlBase + relativeUrl;
        let post = regpost.exec($("strong#postnum_"+pid).text())[1];
        let postElement = $("div.t_msgfont#postmessage_"+pid+":first");
        do_job.runHelper(pid,uid,post,postElement,relativeUrl);
        $(this).find("a:contains('评分')").each(function(){
            if ($(this).text() != "评分") return;
            // 初始化评分用常用参数
            let thisRating = $(this); //艹 $(this).find("a[id^='ajax_rate_']"); //评分按钮
            let actionBar = $(thisRating).parent();
            let postdate = new Date(regdate.exec($("table#pid"+pid).find("div.postinfo").text())[1]);//感谢hellomickey 发现并提供方法，因为页面没有时区，夸市区切所在地有夏令时可能导致差1hr。 + GMT
            let quoteElement = $(postElement).find("div."+"quote"); // 艹 不拆开要不论坛发不了
            let ratedElement = $("a[href='misc.php?action=viewratings&tid="+tid+"&pid="+pid+"']:first");//艹 var ratedElement = $("table#pid"+pid).find("span.postratings a:has(img[src='images/vip/agree.gif'])");
            let postauthorElement = $("a#userinfo"+pid).parent().parent();// 作者信息区
            //$("table#id"+pid+"summary").find("postauthor");
            // 逐贴注入内容处理
            do_job.beforeRunJob(actionBar,post,postdate,postElement,quoteElement,ratedElement,postauthorElement);
            do_job.runjob();
        });
    });
    // 注入收尾
    do_job.finish();
    do_job.finally();
    do_job = null;
 
    console.log ("Total: GM_listValues", "Info\n", GM_listValues().length);
    console.timeEnd('inject time');
});
 
// DoJob基类
class DoJob_Base{
    // 子类完成所有针对页面参数的初始化（可选，包括GM参数）
    constructor(tid,page,ttype,title,formhash,urlBase){
        this.tid=tid;this.page=page;this.ttype=ttype;this.title=title;this.formhash=formhash;this.urlBase=urlBase;
    }
    // 子类完成页面级任务处理（需要实现）
    init(){
    }
    runHelper(pid,uid,post,postElement,relativeUrl){
        this.pid=pid;this.uid=uid;this.post=post;this.postElement=postElement;this.relativeUrl=relativeUrl;this.refer=this.urlBase + relativeUrl;
        var tid = this.tid;
        var fastCopyStr = '<strong title="快速复制相对链接到剪贴板" id="postUrl_' + pid + '" onclick="setClipboard(\'[bbs]' + 'redirect.php?goto=findpost&pid='+pid+'&ptid='+tid + '[/bbs]\')">Pid：' + pid + '</strong>';
        fastCopyStr += '<strong title="快速复制用户名到剪贴板" id="postUid_' + pid + '" onclick="setClipboard(\'' + uid + '\')">Uid：' + uid + '</strong>';
        //         fastCopyStr += '<strong title="快速复制内容到剪贴板" id="postText_' + pid + '" onclick="setClipboard(\'' + postElement.text().replace(/\r/g,"\r") + '\')">复制内容</strong>';
 
        //         var oInput = document.createElement('input');
        //         oInput.value = postElement.text();
        //         document.body.appendChild(oInput);
        //         oInput.select(); // 选择对象
        //         document.execCommand("Copy"); // 执行浏览器复制命令
        //         oInput.className = 'oInput';
 
        $("strong#postnum_"+pid).before(fastCopyStr)
    }
    // 子类完成回复级所有针对回复参数的初始化（可选，包括GM参数）
    beforeRunJob(postActionsBar,post,postdate,postElement,quoteElement,ratedElement,postauthorElement){
        this.postActionsBar=postActionsBar;this.postdate=postdate;this.quoteElement=quoteElement;this.ratedElement=ratedElement;this.postauthorElement=postauthorElement;
        this.suggestion = [0 , "", "", ""];//[0]颜色模式（0:异常,1:正常,2:其他） [1]处理模式 [2]结果 [3]详情
    }
    // 子类完成回复级任务处理
    runjob(){
    }
    // 子类完成页面级收尾
    finish(){
    }
    // 子类完成最终收尾（可选）
    finally(){
        createRealRelativeLink();//创建【直达链接】
    }
}
 
// 仅快速评分
class DoJob_FastRating extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase){
        super(tid,page,ttype,title,formhash,urlBase);
    }
    init(){
        // 创建记分牌头部 左中left: 10px; top: 40%; 右中right: 10px; top: 40%; 中上left: 40%; top: 30px;  onmouseout="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));"
        this.scoreboard ='<div id="resultDiv" style="display: none; left: 50%; top: 30px; width: 390px; background: #3016B0; color:#FFFFFF; opacity:0.8; overflow: hidden; z-index: 9999; position: fixed; padding:5px; text-align:left; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;"><table style="width:100%; cursor:pointer;">';
        this.scoreboard += '<tr><th onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'table-row\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.click()));" colspan="5" style="color:#FFFFFF;">本页评分：共 <ins id="resultTotal" style="font-size: 18px; color: #FFA200; font-weight: bolder;">0</ins> 次，成功<ins id="resultSuccessCount">0</ins>次，失败<ins id="resultFaildCount">0</ins>次。点我完成本页评分。</th><td onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'inherit\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));" style="color:#FFFFFF;text-align:right;">隐藏</td></tr></table><table style="width:100%; cursor:pointer;">';
    }
    // 子类完成回复级任务处理
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
        let suggestion=this.suggestion;//[0]颜色模式（0:未处理,1:已处理） [1]处理模式 [2]结果 [3]详情
 
        var onClickStr = 'this.style=\'pointer-events: none; color: gray; border:2px; font-size:30px;\';fastRating(\'' + refer + '\' , ' + tid + ' , ' + pid + ' , ' + post + ' , ' + page + ' , \'' + formhash + '\');';
        return '<a id="fastRating_pid'+pid+'" onclick=" '+ onClickStr +' " style="font-size:12px; cursor:pointer;">快评</a>';
        $(postActionsBar).append(innerHtml);
 
        // 按楼初始化记分牌内容
        this.scoreboard += '<tr id="res_'+post+'" style="display: none;width:100%;" onclick="window.location.hash=\'#pid' + pid + '\';' + suggestion[1]+'"><td style="color:#FFFFFF; width:60px;">楼:'+post+'</td><td style="color:#FFFFFF; width:60px;" title='+formatDate(postdate, "yyyy-MM-dd HH:mm:ss")+'>发:'+formatDate(postdate, "hh:mm")+'</td><td style="color:#FFFFFF; width:10px;">评:</td><td id="res_'+post+'_1" style="color:#FFFFFF; width:50px;"></td>';
        this.scoreboard += '<td id="res_'+post+'_2" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+'; width:40px;">'+suggestion[2]+'</td><td id="res_'+post+'_3" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+';width:40%;" title="'+suggestion[3]+'">'+((suggestion[3].length>20)?(suggestion[3].substring(0,15)+"..."):suggestion[3])+'</td></tr>';
    }
    // 子类完成页面级收尾
    finish(){
        let scoreboard=this.scoreboard;
        // 补充记分牌尾部，绑定显示隐藏事件并插入页面
        scoreboard += '</table></div>';
        $("body").append(scoreboard);
        $("#resultDiv").show();
    }
}
 
// 日签处理
class DoJob_DailyAward extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase,illegalUidListRemote){
        super(tid,page,ttype,title,formhash,urlBase);
        this.daUserKeyPre = "ada_";
        if (typeof(illegalUidListRemote) == "undefined") {this.illegalUidList = null} else {this.illegalUidList = illegalUidListRemote;};
    }
    init(){
        // 创建记分牌头部 左中left: 10px; top: 40%; 右中right: 10px; top: 40%; 中上left: 40%; top: 30px;
        this.scoreboard ='<div id="resultDiv" style="display: none; left: 50%; top: 30px; width: 390px; background: #3016B0; color:#FFFFFF; opacity:0.8; overflow: hidden; z-index: 9999; position: fixed; padding:5px; text-align:left; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;"><table style="width:100%; cursor:pointer;">';
        this.scoreboard += '<tr><th onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'table-row\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.click()));" colspan="5" style="color:#FFFFFF;">本页评分：共 <ins id="resultTotal" style="font-size: 18px; color: #FFA200; font-weight: bolder;">0</ins> 次，成功<ins id="resultSuccessCount">0</ins>次，失败<ins id="resultFaildCount">0</ins>次。点我完成本页评分。</th><td onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'inherit\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));" style="color:#FFFFFF;text-align:right;">隐藏</td></tr></table><table style="width:100%; cursor:pointer;">';
    }
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
        let suggestion=this.suggestion;//[0]颜色模式（0:未处理,1:已处理） [1]处理模式 [2]结果 [3]详情
        const regpid = /pid=(\d+)/;  //pid
        const regdate = /(\d+[-\/]\d+[-\/]\d+ \d+:\d+(:\d+)?( [AP]M)?)/;;  // 论坛日期 yyyy-mm-dd yyyy/mm/dd mm-dd-yyyy mm/dd/yyyy yyyy-mm-dd 论坛时间 hh:MM  hh:MM:ss A/PM
        const inListMsg = "提示：用户有违规记录，请核实后酌情加重处理。";
        const regAttend1st = /[1１一壹]\s*次|第\s*0*[1１一壹]\D/g;
        const regAttend2nd = /[2２二贰]\s*次|第\s*0*[2２二贰]\D/g;
        const regAttend3rd = /[3３三叁]\s*次|第\s*0*[3３三叁]\D/g;
        const regCurrentScore = /(\d+)/;
        let illegalList=inIllegalUidList(this.illegalUidList, uid, pid);//初始化用户的违规列表
 
        // 收录本帖信息 GM Key:ada_uid Value：[0]pid [1]postdate [2]post [3] relativeUrl
        var daUserKey = this.daUserKeyPre + uid; //dailyAwardUserKey
        var daUserList = GM_getValue(daUserKey, [[0, 0, 0,""]]); //dailyAwardUserList [0]pid [1]postdate [2]post(由于跳页废弃) [3] relativeUrl
        var daUserInd = 0; //dailyAwardUserListIndex 匹配数组序号
 
        // 校验三帖合法性
        try {
            // 判定是否多次发帖
            for (let i = daUserList.length-1; i >= 0; i--) {
                if (pid <= daUserList[i][0]) continue;
                let lastPostDate = new Date(daUserList[i][1]);
                if (postdate.toDateString() != lastPostDate.toDateString()) break;//忽略不是当日记录
                if ((postdate.getTime()-lastPostDate.getTime()) < 18000000) {daUserInd = i;break;}
            }
            // 判定回复内容
            // 艹 console.log(quoteElement.length, quoteElement, quoteElement.text(),);
            if (quoteElement[0]) {
                // 注入按钮 +5 +10
                var innerHtml = '';
                innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,5,0,0,0,'daily award +5','+5金');
                innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,10,0,0,0,'daily award +10','+10金');
                $(postActionsBar).append(innerHtml);
 
                // 验证发帖内容
                let quotePid = regpid.exec(quoteElement.find("a[href]").attr("href"));
                let quoteUid = quoteElement.find("i").text();
                let quoteDate = new Date(regdate.exec(quoteElement.text())[1]);//感谢hellomickey 发现并提供方法，因为页面没有时区，夸市区切所在地有夏令时可能导致差1hr。 + GMT
                let dur = 300-(postdate.getTime()-quoteDate.getTime())/60000;
                if (daUserInd && dur > 0) {
                    suggestion = [0, "", "异常", "回帖时间不足5小时(误差"+dur+"分钟)，且用户在5小时内本帖有其他回复。"];
                    highlightRemarkButton(tid, pid, page);
                    highlightWithNotifcation(quoteElement, suggestion[3], inListMsg, buildNotifcation('上帖Pid：' + daUserList[daUserInd][0]+' 楼：' + daUserList[daUserInd][2], daUserList[daUserInd][3]), illegalList);
                }else if (daUserInd) {
                    suggestion = [0, "", "异常", "用户在5小时内本帖有其他回复。(间隔"+ ((postdate.getTime() - new Date(daUserList[daUserInd][1]).getTime()) /60000) +"分钟)"];
                    highlightRemarkButton(tid, pid, page);
                    highlightWithNotifcation(quoteElement, suggestion[3], inListMsg, buildNotifcation('上帖Pid：' + daUserList[daUserInd][0]+' 楼：' + daUserList[daUserInd][2], daUserList[daUserInd][3]), illegalList);
                }else if (uid != quoteUid) {
                    suggestion = [0, "", "异常", "引用用户名不一致。"];
                    highlightRemarkButton(tid, pid, page);
                    highlightWithoutNotifcation(quoteElement, suggestion[3], inListMsg, illegalList);
                }else if (dur > 0) {
                    suggestion = [0, "", "异常", "回帖时间不足5小时(误差"+dur+"分钟)。"];
                    highlightRemarkButton(tid, pid, page);
                    highlightWithoutNotifcation(quoteElement, suggestion[3], inListMsg, illegalList);
                }else if (postdate.getDate() != quoteDate.getDate()) {
                    suggestion = [0, "", "异常", "引用签到贴非本日。"];
                    highlightRemarkButton(tid, pid, page);
                    highlightWithoutNotifcation(quoteElement, suggestion[3], inListMsg, illegalList);
                }else {
                    // 根据评分内容，提示评分分数或留言
                    var postContent = postElement.text();
                    var quoteContent = quoteElement.text();
                    if (regAttend3rd.exec(postContent) && regAttend2nd.exec(quoteContent)){
                        //引用写2内容写3 应+10分
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '可评分') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 10,0,0,0,\'daily award +10\');", "可评分", "应+10分"];
                        highlightScoreButton(pid, 10);
                        highlightArea(quoteElement, "Green");
                    }else if (regAttend2nd.exec(postContent) && regAttend1st.exec(quoteContent)){
                        //引用写1内容写2 应+5分
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '可评分') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 5,0,0,0,\'daily award +5\');", "可评分", "应+5分"];
                        highlightScoreButton(pid, 5);
                        highlightArea(quoteElement, "Green");
                    }else {
                        //其他所有填写错误，留言警告
                        suggestion = [0, "", "异常", "回复或引用内容有误。"];
                        highlightRemarkButton(tid, pid, page);
                        highlightWithoutNotifcation(quoteElement, suggestion[3], inListMsg, illegalList);
                    }
                }
            }else {
                if (daUserInd) {
                    suggestion = [0, "", "异常", "用户在5小时内本帖有其他回复。(间隔"+ ((postdate.getTime() - new Date(daUserList[daUserInd][1]).getTime()) /60000) +"分钟)"];
                    highlightRemarkButton(tid, pid, page);
                    highlightWithNotifcation(postElement, suggestion[3], inListMsg, buildNotifcation('上帖Pid：' + daUserList[daUserInd][0]+' 楼：' + daUserList[daUserInd][2], daUserList[daUserInd][3]), illegalList);
                }
            }
 
            // 更新用户记录 排序插入合适的位置 一个用户缓存超过30 则删掉第一条
            for (let i = daUserList.length -1 ; i >= 0 ; i--) {
                if (pid < daUserList[i][0]) continue;
                if (pid == daUserList[i][0]) break;
                daUserList.splice( i+1, 0, [pid, postdate.toString(), post, relativeUrl]);
                break;
            }
            $("strong#postnum_"+pid).before('<strong title="快速生成违规上报说明并复制到剪贴板" id="postReport_' + pid + '" onclick="setClipboard(\'违规会员ID：'+ uid + '\\r违规原因：'+ (illegalList?"有前科，":"") + suggestion[3] + (ratedElement[0]?ratedElement.prop("title"):"") +'\\r违规链接：[bbs]' + relativeUrl + '[/bbs]\')">生成违规上报信息</strong>');
            if (daUserList.length > 30) daUserList.shift();
            if (ratedElement[0]){
                let score1 = (parseInt(/(-?\d+)/.exec(ratedElement.prop("title"))))?parseInt(/(-?\d+)/.exec(ratedElement.prop("title"))[1]):0;//实际评分
                let score2 = (/(\d+)/.exec(suggestion[3]))?parseInt((/(\d+)/.exec(suggestion[3]))[1]):0;//应评分
                if (score1==score2){
                    suggestion = [1, "", "加分", ratedElement.prop("title") + " "+ suggestion[3]];
                }else if (score1 < 0){
                    suggestion = [1, "", "扣分", ratedElement.prop("title") + " "+ suggestion[3]];
                }else if (score1 < score2){
                    suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '可补评' && confirm('确定要补评"+post+"楼的分数("+(score2-score1)+"分)么？')) addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , "+(score2-score1)+",0,0,0,\'daily award +"+score2+"\');", "可补评", ratedElement.prop("title") + " "+ suggestion[3]];
                }else {
                    suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '已超评' && confirm('确定要冲正"+post+"楼的超评分数("+(score2-score1)+"分)么？')) addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , "+(score2-score1)+",0,0,0,\'reverse award "+(score2-score1)+" daily award +"+score2+"\');", "已超评", ratedElement.prop("title") + " "+ suggestion[3]];
                }
            };
            console.log("DoJob_DailyAward:runjob", "Info\n", uid, daUserList)
            GM_setValue(daUserKey, daUserList);
            function highlightWithNotifcation(element, msgStr, inListMsg, NotiStr, illegalList){ return illegalList? highlightArea(element, "Red", msgStr + inListMsg, NotiStr, illegalList) : highlightArea(postElement, "Yellow", msgStr, NotiStr);}
            function highlightWithoutNotifcation(element, msgStr, inListMsg, illegalList){ return illegalList? highlightArea(element, "Red", msgStr + inListMsg, illegalList) : highlightArea(postElement, "Yellow", msgStr); }
        }
        catch(e){
            console.log("DoJob_DailyAward:runjob", "Error\n",e);
            suggestion = [0, "", "异常", "异常：因为某些未知的原因使得该贴数据未能成功解析处理，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。"];
            highlightArea(postElement, "Orange", suggestion[3]);
        }
        // 按楼初始化记分牌内容
        this.scoreboard += '<tr id="res_'+post+'" style="display: none;width:100%;" onclick="window.location.hash=\'#pid' + pid + '\';' + suggestion[1]+'"><td style="color:#FFFFFF; width:60px;">楼:'+post+'</td><td style="color:#FFFFFF; width:60px;" title='+formatDate(postdate, "yyyy-MM-dd HH:mm:ss")+'>发:'+formatDate(postdate, "hh:mm")+'</td><td style="color:#FFFFFF; width:10px;">评:</td><td id="res_'+post+'_1" style="color:#FFFFFF; width:50px;"></td>';
        this.scoreboard += '<td id="res_'+post+'_2" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+'; width:40px;">'+suggestion[2]+'</td><td id="res_'+post+'_3" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+';width:40%;" title="'+suggestion[3]+'">'+((suggestion[3].length>20)?(suggestion[3].substring(0,15)+"..."):suggestion[3])+'</td></tr>';
    }
    finish(){
        let scoreboard=this.scoreboard;
        // 补充记分牌尾部，绑定显示隐藏事件并插入页面
        scoreboard += '</table></div>';
        $("body").append(scoreboard);
        $("#resultDiv").show();
    }
}
 
// 月签综合贴处理
class DoJob_MonthlyAwardReport extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase){
        super(tid,page,ttype,title,formhash,urlBase);
        this.maUserKeyPre = "ama_";
    }
    init(){
        this.scoreboard ='<div id="resultDiv" style="display: none; left: 50%; top: 30px; width: 390px; background: #3016B0; color:#FFFFFF; opacity:0.8; overflow: hidden; z-index: 9999; position: fixed; padding:5px; text-align:left; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;"><table style="width:100%; cursor:pointer;">';
        this.scoreboard += '<tr><th onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'table-row\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.click()));" colspan="5" style="color:#FFFFFF;">本页评分：共 <ins id="resultTotal" style="font-size: 18px; color: #FFA200; font-weight: bolder;">0</ins> 次，成功<ins id="resultSuccessCount">0</ins>次，失败<ins id="resultFaildCount">0</ins>次。点我完成本页评分。</th><td onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'inherit\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));" style="color:#FFFFFF;text-align:right;">隐藏</td></tr></table><table style="width:100%; cursor:pointer;">';
    }
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
        let suggestion=this.suggestion;//[0]颜色模式（0:异常,1:正常,2:其他） [1]处理模式 [2]结果 [3]详情
 
        // 检查月签缓存 GM Key:ama_uid Value：[0]pid [1]postdate [2]post [3]relativeUrl [4]err
        var maUserKey = this.maUserKeyPre + uid; //maUserKey
        var maUserList = GM_getValue(maUserKey, [[0, 0, 0,"",0]]); //maUserKey [0]pid [1]postdate [2]post(废弃) [3]relativeUrl [4]err
        // 按ID检查本月签到数
        var total = 0, right = 0, wrong = 0;
        let lastMonthdate = new Date(postdate.getFullYear(),postdate.getMonth(),0);
        for (let i = maUserList.length-1; i > 0; i--) {
            let hispostdate = new Date(maUserList[i][1]);
            if (hispostdate.getFullYear() == lastMonthdate.getFullYear() && ((hispostdate.getMonth() == lastMonthdate.getMonth() && postdate.getDate() <15) || (hispostdate.getMonth() == postdate.getMonth() && postdate.getDate() >15))){//兼容不小心提前开启了月签的情况
                maUserList[i][4] ? right++ : wrong++;
                total++;
            }
        };
 
        // 计算勋章奖励
        let sisMedal = 0;//如果有多个勋章取最高（容错）
        sisMedal = ($(postauthorElement).find("img[src*='images/common/sislv1.gif']")[0])?1:sisMedal;
        sisMedal = ($(postauthorElement).find("img[src*='images/common/sislv2.gif']")[0])?2:sisMedal;
        sisMedal = ($(postauthorElement).find("img[src*='images/common/sislv3.gif']")[0])?3:sisMedal;
        let sisMedalMsgCn = "", sisMedalMsgEn = "", sisMedalName_Short = "", sisMedalAward = 0;
        let sisMedalMissMsgEn = "+0g(<28days)";
        if (sisMedal == 3){
            sisMedalMsgCn = " +70g(3级签到勋章) ";
            sisMedalMsgEn = "+70g(L3Medal)";
            sisMedalName_Short = "L3";
            sisMedalAward = 70;
        }else if (sisMedal == 2){
            sisMedalMsgCn = " +50g(2级签到勋章) ";
            sisMedalMsgEn = "+50g(L2Medal)";
            sisMedalName_Short = "L2";
            sisMedalAward = 50;
        }else if (sisMedal == 1){
            sisMedalMsgCn = " +30g(1级签到勋章) ";
            sisMedalMsgEn = "+30g(L1Medal)";
            sisMedalName_Short = "L1";
            sisMedalAward = 30;
        }
        let msgEnFull=((sisMedal)?(sisMedalMsgEn + "+70g(Full-attend " + total + "/" + right + "/" + wrong + ")"):("+70g(Full-attend " + total + "/" + right + "/" + wrong + ")"));
        let msgEnMost=((sisMedal)?(sisMedalMsgEn + "+50g(Good-attend " + total + "/" + right + "/" + wrong + ")"):("+50g(Good-attend " + total + "/" + right + "/" + wrong + ")"));
        let msgEn25=((sisMedal)?("+30g(25+days " + total + "/" + right + "/" + wrong + ")" + sisMedalMissMsgEn):("+30g(25+days " + total + "/" + right + "/" + wrong + ")"));
        let msgEn20=((sisMedal)?("+20g(>20+days " + total + "/" + right + "/" + wrong + ")" + sisMedalMissMsgEn):("+20g(20+days " + total + "/" + right + "/" + wrong + ")"));
        let msgCnFull=uid + ((sisMedal)?(":+" + (70+sisMedalAward) + "g=" + sisMedalMsgCn + "+70g(满签)"):(":+70g(满签)"));
        let msgCnMost=uid + ((sisMedal)?(":+" + (50+sisMedalAward) + "g=" + sisMedalMsgCn + "+50g(全勤)"):(":+50g(全勤)"));
        let msgCn25=uid + ":+30g(达到25签)";
        let msgCn20=uid + ":+20g(达到20签)";
 
        // 创建评分按钮
        var innerHtml = '';
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,(70+sisMedalAward),0,0,0,msgEnFull,'【'+sisMedalName_Short+'满】');
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,(50+sisMedalAward),0,0,0,msgEnMost,'【'+sisMedalName_Short+'全】');
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,30,0,0,0,msgEn25,'【'+sisMedalName_Short+'>25】');
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,20,0,0,0,msgEn20,'【'+sisMedalName_Short+'>20】');
        $(postActionsBar).append(innerHtml);
 
        //验证申请月签奖励内容
        let postContent = postElement.text();
        try {
            //                                     viewthread.php?tid=9220552&extra=&page=1
            const regUrl1 = /thread-\d+-1-\d+.html|viewthread.php\?.*tid=\d+.*\&page=1$|viewthread.php\?.*tid=\d+.*\&page=1\D|redirect.php\?goto=findpost\&pid=\d+\&ptid=\d+/;// 验证是否有正确的论坛链接（月签）
            let address = checkAddress(postElement);
            const regReportDays = /[(签到.数)|(簽到.數)][:：]\s*(\d+)\s*/;//提取上报月签数
            let reportDays = regReportDays.exec(postContent)[1];
            let msg = "", msgShort = "";
 
            if (address == false){
                msgShort = sisMedalName_Short + "异常";
                msg = uid + "未使用相对链接";
                highlightArea(postElement, "Yellow", "提示：月签未使用相对链接，请使用相对链接指向本人当月月签贴第一楼！");
            }else if (!regUrl1.exec(address)){
                msgShort = sisMedalName_Short + "异常";
                msg = uid + "链接不合规";
                highlightArea(postElement, "Yellow", "提示：月签链接不合规，请使用相对链接指向本人当月月签贴第一楼！");
                suggestion = [0, "", msgShort, msg];
            }else if(maUserList.length ==1){
                msgShort = sisMedalName_Short + "待查";
                msg = uid + "没有本月的月签数据";
                suggestion = [0, "", msgShort, msg];
            }else if(right == 0 && wrong ==0){
                msgShort = sisMedalName_Short + "待查";
                msg = uid + "没有本月的月签数据";
                suggestion = [0, "", msgShort, msg];
            }else if(reportDays == 0){//上报日期和结果不一致
                msgShort = sisMedalName_Short + "异常";
                msg = uid + "月签上报数获取错误！";
                highlightArea(postElement, "Yellow", "提示：月签上报数获取错误，请确认！");
                suggestion = [0, "", msgShort, msg];
            }else if(right != reportDays){//上报日期和结果不一致
                msgShort = sisMedalName_Short + "异常";
                msg = uid + "签到数异常！";
                highlightArea(postElement, "Yellow", "提示：月签上报【"+reportDays+"】日，认定【"+right+"】日，存疑【"+wrong+"】贴。请确认（管理有请假请PM）！（To本版管理：如有漏查签到页、请假或其他异常情况需人工修正）。");
                suggestion = [0, "", msgShort, msg];
            }else if(right == lastMonthdate.getDate()){//上月
                msgShort = sisMedalName_Short + "满签";
                msg = msgCnFull;
                highlightScoreButton(pid, 70+sisMedalAward);
                highlightArea(postElement, "Green");
                suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , " + (70+sisMedalAward) + ",0,0,0,\'" + msgEnFull + "\');", msgShort, msg];
            }else if(right >= 28){
                msgShort = sisMedalName_Short + "全勤";
                msg = msgCnMost;
                highlightScoreButton(pid, 50+sisMedalAward);
                highlightArea(postElement, "Green");
                suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , " + (50+sisMedalAward) + ",0,0,0,\'" + msgEnMost + "\');", msgShort, msg];
            }else if(right >= 25){
                msgShort = sisMedalName_Short + "25签";
                msg = msgCn25;
                highlightScoreButton(pid, 30);
                highlightArea(postElement, "Green");
                suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 30,0,0,0,\'" + msgEn25 + "\');", msgShort, msg];
            }else if(right >= 20){
                msgShort = sisMedalName_Short + "20签";
                msg = msgCn20;
                highlightScoreButton(pid, 20);
                highlightArea(postElement, "Green");
                suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 20,0,0,0,\'" + msgEn20 + "\');", msgShort, msg];
            }else if(right > 0){
                msgShort = sisMedalName_Short + "不足";
                msg = uid + "：<20签：" + total + "/" + right + "/" + wrong + "/+0g";
                suggestion = [0, "", msgShort, msg];
            }else if(right == 0){
                msgShort = sisMedalName_Short + "未报";
                msg = uid + " 未发现本月月报数据。";
                suggestion = [0, "", msgShort, msg];
            }else {
                msgShort = sisMedalName_Short + "异常";
                msg = uid + " 处理本月月报数据异常！请联系脚本作者解决！";
                suggestion = [0, "", msgShort, msg];
            }
        }catch (e){
            console.log("DoJob_MonthlyAwardReport:runjob","Error\n",e);
            highlightArea(postElement, "Orange", "异常：因为某些未知的原因使得该贴数据未能成功解析处理，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
        }
 
        if (ratedElement[0]){ suggestion = [1, "", "已评", ratedElement.prop("title")]};
        //         const subject = "兄弟，你最近经常准时签到，有没有意向加入管理团队呢？";
        //         const message = "兄弟，你最近经常准时签到，有没有意向加入管理团队呢？3-6个月金币可以赚几万甚至更多；勋章五六七八个；全区不设防，包括楼凤信息区、丽人区、超级酷站区等任意版块下载附件不扣金币。没有回复时间限制，享受VIP无广告界面。没有经验不要紧，手把手教会，手把手教你刷金币。前期都有人带着进行管理操作。一天的版务30分钟到一个小时搞定。每天到办公室签个到，处理一下版务。其余时间不限制。轻松愉快，不耽误时间。浏览其他版区的时间也计算到在线时间里，每天刷新几次，月在线时间肯定达标。绝对不会耽误现实中的事情，另外安全问题也不必担心，用代理可以解决一切后顾之忧。 \n 我看你经常在线。还是有空闲时间的。真的不耽误现实的时间哦。 \n 管理的福利还是不错的，只要能保证每天都能上线处理版务，有点空闲时间的话，不妨考虑一下哦~如果有兴趣，直接回复本条信息。我会指导你进行下一步操作。一步步教会。觉得不合适，3个月后辞职，不会有任何处罚。 \n 或者跟帖http://www.sexinsex.net/bbs/thread-5998899-1-1.html";
        //         const archerText = "pm用户，建议加入管理。";
        //         var onClickStr = 'sendPrivateMessage(\'' + uid + '\' , ' + '\'' + formhash + '\' , ' + '\'' + "" + '\' , ' + '\'' + "我的内容" + '\');';
        //         highlightArea(postElement, "White", "用户签到达标。", '<a id="uid'+uid+'_pid'+pid+'" onclick=" '+ onClickStr +' " style="font-size:12px; cursor:pointer;">'+ archerText +'</a>');
 
        // 按楼初始化记分牌内容
        this.scoreboard += '<tr id="res_'+post+'" style="display: none;width:100%;" onclick="window.location.hash=\'#pid' + pid + '\';' + suggestion[1]+'"><td style="color:#FFFFFF; width:60px;">楼:'+post+'</td><td style="color:#FFFFFF; width:60px;" title='+formatDate(postdate, "yyyy-MM-dd HH:mm:ss")+'>发:'+formatDate(postdate, "MM-dd")+'</td><td style="color:#FFFFFF; width:10px;">评:</td><td id="res_'+post+'_1" style="color:#FFFFFF; width:50px;"></td>';
        this.scoreboard += '<td id="res_'+post+'_2" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+'; width:40px;">'+suggestion[2]+'</td><td id="res_'+post+'_3" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+';width:40%;" title="'+suggestion[3]+'">'+((suggestion[3].length>20)?(suggestion[3].substring(0,15)+"..."):suggestion[3])+'</td></tr>';
        function checkAddress(postElement){
            // 验证是否有正确的月签链接
            try {
                return $(postElement).find("a[target=_blank]").attr("href");
            }catch (e){
                return false;
            }
        }
 
    }
    finish(){
        let scoreboard=this.scoreboard;
        // 补充记分牌尾部，绑定显示隐藏事件并插入页面
        scoreboard += '</table></div>';
        $("body").append(scoreboard);
        $("#resultDiv").show();
    }
}
 
// 月签处理
class DoJob_MonthlyAward extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase){
        super(tid,page,ttype,title,formhash,urlBase);
        this.maUserKeyPre = "ama_";
        this.month = /\D(\d+)月/.exec(title.toLowerCase())[1];
    }
    init(){
        let month = this.month;
        // 创建记分牌头部 左中left: 10px; top: 40%; 右中right: 10px; top: 40%; 中上left: 40%; top: 30px;
        this.scoreboard ='<div id="resultDiv" style="display: none; left: 50%; top: 30px; width: 390px; background: #3016B0; color:#FFFFFF; opacity:0.8; overflow: hidden; z-index: 9999; position: fixed; padding:5px; text-align:left; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;"><table style="width:100%; cursor:pointer;">';
        this.scoreboard += '<tr><th onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'table-row\'));" onclick="document.getElementById(\'res_copyme\').select();document.execCommand(\'copy\');" colspan="5" style="color:#FFFFFF;">统计：共<ins id="resultTotal">0</ins>贴，'+month+'月有效签到 <ins id="resultSuccessCount" style="font-size: 18px; color: #FFA200; font-weight: bolder;">0</ins> 日，异常<ins id="resultFaildCount">0</ins>贴。 点我复制结果。</th><td onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'inherit\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));" style="color:#FFFFFF;text-align:right;">隐藏</td></tr></table><table style="width:100%; cursor:pointer;">';
    }
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
        let suggestion=this.suggestion;//[0]颜色模式（0:异常,1:正常,2:其他） [1]处理模式 [2]结果 [3]详情
        let month = this.month;
 
        // 创建月签检查缓存 收录本帖信息 GM Key:ada_uid Value：[0]pid [1]postdate [2]post [3]relativeUrl [4]isOK
        var maUserKey = this.maUserKeyPre + uid; //maUserKey
        var maUserList = GM_getValue(maUserKey, [[0, 0, 0,"",0]]); //maUserKey [0]pid [1]postdate [2]post [3]relativeUrl [4]isOK
        var maUserInd = -1; //dailyAwardUserListIndex 匹配数组序号
 
        var isOK = 0;
        // 每页检查日签合法性，按日计算，去重，统计到用户（[ama_uid, [pid, postdate, post, relativeUrl]]）
        try {
            let postContent = postElement.text();
            let regSignDate = new RegExp((postdate.getMonth()+1) + ".*" + postdate.getDate(),'g');
 
            //高亮留言
            if (post == 1)highlightRemarkButton(tid, pid, page);
            if (title.toLowerCase().indexOf(uid.toLowerCase()) == -1) {// 是否本人月签
                highlightArea(postElement, "Yellow", "异常："+uid+"乱入他人月签贴。");
                suggestion = [0, "", "异常", uid+"乱入他人月签贴。"];
            }else if (postdate.getMonth()+1 != month ){// 是否本月签到
                highlightArea(postElement, "Yellow", "异常：非"+month+"月提交的签到。");
                suggestion = [0, "", "异常", "非"+month+"月提交的签到。"];
            }else {
                // 内容是否正确（各板块规定完全不同，非常模糊，就看月，日数字有没有）
                //if (!regSignDate.exec(postContent)) suggestion = [0, "", "异常", "内容错误：未包含本回复时间的月、日信息。"];
                // 判定是否重复
                suggestion[0] = 1;
                for (let i = maUserList.length-1; i > 0; i--) {
                    let hisPostDate = new Date(maUserList[i][1]);
                    if (postdate.getYear() == hisPostDate.getYear() && postdate.getMonth() == hisPostDate.getMonth() && postdate.getDate() == hisPostDate.getDate() && pid != maUserList[i][0]) {
                        suggestion = ((pid > maUserList[i][0]) ? ([0, "", "重复", "当日重复上报。"]) : ([0, "", "重复", "本帖作为"+formatDate(postdate, "yyyy-MM-dd")+"的报告"]));
                        maUserInd = i;
                        break;
                    };
                }
                if (suggestion[0]){
                    suggestion = [1, "", "正常", "本帖作为"+formatDate(postdate, "yyyy-MM-dd")+"的报告"];
                    highlightArea(postElement, "Green");
                    isOK = 1;
                }else {
                    highlightArea(postElement, "Yellow", "异常", suggestion[3] , buildNotifcation('上帖楼层：' + maUserList[maUserInd][2], maUserList[maUserInd][3]));
                    isOK = 0;
                }
                // 更新用户记录 排序插入合适的位置
                for (let i = maUserList.length -1 ; i >= 0 ; i--) {
                    if (pid < maUserList[i][0]) continue;
                    if (pid == maUserList[i][0]) break;
                    maUserList.splice( i+1, 0, [pid, postdate.toString(), post, relativeUrl, isOK]);
                    break;
                }
                GM_setValue(maUserKey, maUserList);
            }
        }catch (e){
            console.log("DoJob_MonthlyAward:runjob","Error\n",e);
        }
        // 按楼初始化记分牌内容
        this.scoreboard += '<tr id="res_'+post+'" style="display: none" onclick="window.location.hash=\'#pid' + pid + '\';' + suggestion[1]+'"><td style="color:#FFFFFF; width:60px;">楼:'+post+'</td><td style="color:#FFFFFF; width:60px;" title='+formatDate(postdate, "yyyy-MM-dd HH:mm:ss")+'>发:'+formatDate(postdate, "MM-dd")+'</td><td style="color:#FFFFFF; width:10px;">评:</td><td id="res_'+post+'_1" style="color:#FFFFFF; width:50px;"></td>';
        this.scoreboard += '<td id="res_'+post+'_2" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+'; width:40px;">'+suggestion[2]+'</td><td id="res_'+post+'_3" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+';width:45%;" title="'+suggestion[3]+'">'+((suggestion[3].length>20)?(suggestion[3].substring(0,15)+"..."):suggestion[3])+'</td></tr>';
    }
    finish(){
        let uid=this.uid;
        let scoreboard=this.scoreboard;
        let postdate=this.postdate;
        let title=this.title;
        let month = this.month;
        let postauthorElement=this.postauthorElement;
 
        // 检查月签检查缓存 GM Key:ada_uid Value：[0]pid [1]postdate [2]post [3]relativeUrl [4]err
        var maUserKey = this.maUserKeyPre + uid; //maUserKey
        var maUserList = GM_getValue(maUserKey, [[0, 0, 0,"",0]]); //maUserKey [0]pid [1]postdate [2]post [3]relativeUrl [4]err
        var total = maUserList.length-1;
        var right = 0;
        var wrong = 0;
        for (let i = maUserList.length-1; i > 0; i--) {
            let thisDate = new Date(maUserList[i][1]);
            (maUserList[i][4] && thisDate.getFullYear()==postdate.getFullYear() && thisDate.getMonth() == (month-1)) ? right++ : wrong++;
        };
 
        // 生成反馈信息
        var msg = "";
        if(right == new Date(postdate.getFullYear(),(postdate.getMonth()+1),0).getDate()){
            msg = uid + " ： " + postdate.getFullYear() + "年" + month + "月有效签到：" + right + " 日，共" + total + "贴，无效" + wrong + "贴。满签(perfect-attend)。";
        }else if(right >= 28){
            msg = uid + " ： " + postdate.getFullYear() + "年" + month + "月有效签到：" + right + " 日，共" + total + "贴，无效" + wrong + "贴。全勤(most-attend)。";
        }else if(right >= 25){
            msg = uid + " ： " + postdate.getFullYear() + "年" + month + "月有效签到：" + right + " 日，共" + total + "贴，无效" + wrong + "贴。达到25天。";
        }else if(right >= 20){
            msg = uid + " ： " + postdate.getFullYear() + "年" + month + "月有效签到：" + right + " 日，共" + total + "贴，无效" + wrong + "贴。达到20天。";
        }else {
            msg = uid + " ： " + postdate.getFullYear() + "年" + month + "月有效签到：" + right + " 日，共" + total + "贴，无效" + wrong + "贴。少于20天。（无法获得奖励，请再接再厉。）";;
        }
        GM_setClipboard(msg);
 
        // 补充记分牌尾部，绑定显示隐藏事件并插入页面
        scoreboard += '<input id=\'res_copyme\' style="display: none" value=\''+msg+'\'></input></div></table></div>';
        $("body").append(scoreboard);
        $("#resultDiv").show();
        scoreboard_success(right);
        scoreboard_failure(wrong);
    }
}
 
// 年签综合贴处理
class DoJob_YearlyAwardReport extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase){
        super(tid,page,ttype,title,formhash,urlBase);
        this.maUserKeyPre = "aya_";
    }
    init(){
        // 创建记分牌头部 左中left: 10px; top: 40%; 右中right: 10px; top: 40%; 中上left: 40%; top: 30px;  onmouseout="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));"
        this.scoreboard ='<div id="resultDiv" style="display: none; left: 50%; top: 30px; width: 390px; background: #3016B0; color:#FFFFFF; opacity:0.8; overflow: hidden; z-index: 9999; position: fixed; padding:5px; text-align:left; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;"><table style="width:100%; cursor:pointer;">';
        this.scoreboard += '<tr><th onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'table-row\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.click()));" colspan="5" style="color:#FFFFFF;">本页评分：共 <ins id="resultTotal" style="font-size: 18px; color: #FFA200; font-weight: bolder;">0</ins> 次，成功<ins id="resultSuccessCount">0</ins>次，失败<ins id="resultFaildCount">0</ins>次。点我完成本页评分。</th><td onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'inherit\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));" style="color:#FFFFFF;text-align:right;">隐藏</td></tr></table><table style="width:100%; cursor:pointer;">';
    }
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
        let suggestion=this.suggestion;//[0]颜色模式（0:异常,1:正常,2:其他） [1]处理模式 [2]结果 [3]详情
        var innerHtml = '';
        const MSG999G3C = '+999g3c(over 365 days)';
        const MSG666G2C = '+666g2c(over 300 days)';
        const MSG333G1C = '+333g1c(over 250 days)';
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,999,0,0,3,MSG999G3C,'【365+】');
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,666,0,0,2,MSG666G2C,'【300+】');
        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,333,0,0,1,MSG333G1C,'【250+】');
        $(postActionsBar).append(innerHtml);
 
        //验证申请年签奖励内容
        let postContent = postElement.text();
        let postyear = postdate.getFullYear();
        let reportDays = 0;
        let addressRight = false;
        try {
            const regUrl1 = /thread-\d*-1-\d*.html|viewthread.php\?tid=\d*/;// 验证是否有正确的论坛链接
            const regUrl2 = /\&page=[^1]\D/;// 验证是否有不是第一页
            let address = checkAddress(postElement);
            if (address == false){
                highlightArea(postElement, "Yellow", "提示：年签未使用相对链接，请使用相对链接指向本人当年年签贴第一楼！");
            }else{
                if (regUrl1.exec(address) && !regUrl2.exec(address)){
                    addressRight = true;
                }else {
                    highlightArea(postElement, "Yellow", "提示：年签链接不合规，请使用相对链接指向本人当年年签贴第一楼！");
                }
            }
            const regReportDays = /年签到次数[:：]\s*(\d+)\s*[次天]?/;//提取上报年签数
            reportDays = regReportDays.exec(postContent)[1];
        }catch (e){
            console.log("DoJob_YearlyAwardReport:runjob","Error\n",e);
            highlightArea(postElement, "Orange", "异常：因为某些未知的原因使得该贴数据未能成功解析处理，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
        }
 
        // 生成反馈信息
        let msg = "", msgShort = "";
        if(reportDays >= 365){//超过365为满签
            msgShort = "365+";
            msg = MSG999G3C;
            highlightScoreButton(pid, 999);
            highlightArea(postElement, "Green");
            suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 999,0,0,3,\'" + msg + "\');", msgShort, msg];
        }else if(reportDays >= 300 ){
            msgShort = "300+";
            msg = MSG666G2C;
            highlightScoreButton(pid, 666);
            highlightArea(postElement, "Green");
            suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 666,0,0,2,\'" + msg + "\');", msgShort, msg];
        }else if(reportDays >= 250 ){
            msgShort = "250+";
            msg = MSG333G1C;
            highlightScoreButton(pid, 333);
            highlightArea(postElement, "Green");
            suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 333,0,0,01,\'" + msg + "\');", msgShort, msg];
        }else if(reportDays > 0 ){
            msgShort = "不足";
            msg = "less than 250 days";
            suggestion = [0, "", msgShort, msg];
        }else {
            msgShort = "异常";
            msg = uid + " 处理本年签到数据异常！请联系脚本作者解决！";
            suggestion = [0, "", msgShort, msg];
        }
 
        if (ratedElement[0]){ suggestion = [1, "", "已评", ratedElement.prop("title")]};
        //         const subject = "兄弟，你最近经常准时签到，有没有意向加入管理团队呢？";
        //         const message = "兄弟，你最近经常准时签到，有没有意向加入管理团队呢？3-6个月金币可以赚几万甚至更多；勋章五六七八个；全区不设防，包括楼凤信息区、丽人区、超级酷站区等任意版块下载附件不扣金币。没有回复时间限制，享受VIP无广告界面。没有经验不要紧，手把手教会，手把手教你刷金币。前期都有人带着进行管理操作。一天的版务30分钟到一个小时搞定。每天到办公室签个到，处理一下版务。其余时间不限制。轻松愉快，不耽误时间。浏览其他版区的时间也计算到在线时间里，每天刷新几次，月在线时间肯定达标。绝对不会耽误现实中的事情，另外安全问题也不必担心，用代理可以解决一切后顾之忧。 \n 我看你经常在线。还是有空闲时间的。真的不耽误现实的时间哦。 \n 管理的福利还是不错的，只要能保证每天都能上线处理版务，有点空闲时间的话，不妨考虑一下哦~如果有兴趣，直接回复本条信息。我会指导你进行下一步操作。一步步教会。觉得不合适，3个月后辞职，不会有任何处罚。 \n 或者跟帖http://www.sexinsex.net/bbs/thread-5998899-1-1.html";
        //         const archerText = "pm用户，建议加入管理。";
        //         var onClickStr = 'sendPrivateMessage(\'' + uid + '\' , ' + '\'' + formhash + '\' , ' + '\'' + "" + '\' , ' + '\'' + "我的内容" + '\');';
        //         highlightArea(postElement, "White", "用户签到达标。", '<a id="uid'+uid+'_pid'+pid+'" onclick=" '+ onClickStr +' " style="font-size:12px; cursor:pointer;">'+ archerText +'</a>');
 
        // 按楼初始化记分牌内容
        this.scoreboard += '<tr id="res_'+post+'" style="display: none" onclick="window.location.hash=\'#pid' + pid + '\';' + suggestion[1]+'"><td style="color:#FFFFFF; width:60px;">楼:'+post+'</td><td style="color:#FFFFFF; width:60px;" title='+formatDate(postdate, "yyyy-MM-dd HH:mm:ss")+'>发:'+formatDate(postdate, "MM-dd")+'</td><td style="color:#FFFFFF; width:10px;">评:</td><td id="res_'+post+'_1" style="color:#FFFFFF; width:50px;"></td>';
        this.scoreboard += '<td id="res_'+post+'_2" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+'; width:40px;">'+suggestion[2]+'</td><td id="res_'+post+'_3" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+';width:45%;" title="'+suggestion[3]+'">'+((suggestion[3].length>20)?(suggestion[3].substring(0,15)+"..."):suggestion[3])+'</td></tr>';
        function checkAddress(postElement){
            // 验证是否有正确的月签链接
            try {
                return $(postElement).find("a[target=_blank]").attr("href");
            }catch (e){
                return false;
            }
        }
 
    }
    finish(){
        let scoreboard=this.scoreboard;
        // 补充记分牌尾部，绑定显示隐藏事件并插入页面
        scoreboard += '</table></div>';
        $("body").append(scoreboard);
        $("#resultDiv").show();
    }
}
 
// 年签处理
class DoJob_YearlyAward extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase){
        super(tid,page,ttype,title,formhash,urlBase);
        this.maUserKeyPre = "aya_";
        this.year = /(\d\d\d\d)年/.exec(title)[1];
    }
    init(){
    }
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
    }
}
 
// 勋章评分处理
class DoJob_MedalAward extends DoJob_Base{
    constructor(tid,page,ttype,title,formhash,urlBase){
        super(tid,page,ttype,title,formhash,urlBase);
    }
    init(){
        // 创建记分牌头部 左中left: 10px; top: 40%; 右中right: 10px; top: 40%; 中上left: 40%; top: 30px;  onmouseout="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));"
        this.scoreboard ='<div id="resultDiv" style="display: none; left: 50%; top: 30px; width: 390px; background: #3016B0; color:#FFFFFF; opacity:0.8; overflow: hidden; z-index: 9999; position: fixed; padding:5px; text-align:left; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px;"><table style="width:100%; cursor:pointer;">';
        this.scoreboard += '<tr><th onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'table-row\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.click()));" colspan="5" style="color:#FFFFFF;">本页评分：共 <ins id="resultTotal" style="font-size: 18px; color: #FFA200; font-weight: bolder;">0</ins> 次，成功<ins id="resultSuccessCount">0</ins>次，失败<ins id="resultFaildCount">0</ins>次。点我完成本页评分。</th><td onmouseover="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'inherit\'));" onclick="Array.from(document.querySelectorAll(\'tr[id^=res_\')).forEach(e => (e.style.display = \'none\'));" style="color:#FFFFFF;text-align:right;">隐藏</td></tr></table><table style="width:100%; cursor:pointer;">';
    }
    // 子类完成回复级任务处理
    runjob(){
        let postActionsBar=this.postActionsBar, tid=this.tid, page=this.page, ttype=this.ttype, title=this.title, formhash=this.formhash, urlBase=this.urlBase, scoreboard=this.scoreboard, pid=this.pid, uid=this.uid, post=this.post, postdate=this.postdate, relativeUrl=this.relativeUrl, refer=this.refer;
        let postElement=this.postElement, quoteElement=this.quoteElement, ratedElement=this.ratedElement, postauthorElement=this.postauthorElement;
        let suggestion=this.suggestion;//[0]颜色模式（0:未处理,1:已处理） [1]处理模式 [2]结果 [3]详情
 
        // 获取用户勋章
        let sisMedal = 0;//如果有多个勋章取最高（容错）
        sisMedal = ($(postauthorElement).find("img[src*='images/common/sislv1.gif']")[0])?1:sisMedal;
        sisMedal = ($(postauthorElement).find("img[src*='images/common/sislv2.gif']")[0])?2:sisMedal;
        sisMedal = ($(postauthorElement).find("img[src*='images/common/sislv3.gif']")[0])?3:sisMedal;
 
        const regCurrentMedalLevel = /(当前签到勋章|當前簽到勛章|當前簽到勳章)：\s*(.级签到勋章|.級簽到勛章|.級簽到勳章|无|無)\s*/;
        const regReqMedalLevel = /(申请种类|申請種類)：(.)(级签到勋章|級簽到勛章|級簽到勳章)/;
        try {
            //获取申请时勋章等级
            let currentMedalLevelStr = regCurrentMedalLevel.exec(postElement.text())[2].substring(0,1);
            let reqMedalLevelStr = regReqMedalLevel.exec(postElement.text())[2];
            let currentMedalLevel = -1;
            let reqMedalLevel = -1;
            if (currentMedalLevelStr == "1" || currentMedalLevelStr == "１" || currentMedalLevelStr == "一" || currentMedalLevelStr == "壹"){
                currentMedalLevel = 1;
            }else if (currentMedalLevelStr == "2" || currentMedalLevelStr == "２" || currentMedalLevelStr == "二" || currentMedalLevelStr == "贰"){
                currentMedalLevel = 2;
            }else if (currentMedalLevelStr == "3" || currentMedalLevelStr == "３" || currentMedalLevelStr == "三" || currentMedalLevelStr == "叁"){
                currentMedalLevel = 3;
            }else if (currentMedalLevelStr == "无" || currentMedalLevelStr == "無"){
                currentMedalLevel = 0;
            }else {
                highlightArea(postElement, "Orange", "异常：无法读取申请书中当前勋章词条（不是用户佩戴勋章），请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
                throw new Error(uid + pid + "异常：无法读取申请书中当前勋章词条（不是用户佩戴勋章），请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
            }
            //获取申请的勋章等级
            if (reqMedalLevelStr == "一" || reqMedalLevelStr == "1"){
                reqMedalLevel = 1;
            }else if (reqMedalLevelStr == "二" || reqMedalLevelStr == "2"){
                reqMedalLevel = 2;
            }else if (reqMedalLevelStr == "三" || reqMedalLevelStr == "3"){
                reqMedalLevel = 3;
            }else {
                highlightArea(postElement, "Orange", "异常：无法读取申请书中申请勋章词条，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
                throw new Error(uid + pid + "异常：无法读取申请书中申请勋章词条，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
            }
 
            //根据申请勋章等级生成评分
            let innerHtml = '';
            let msg = "", msgShort = "";
            const MSGLV0TO1="+300g1c(MedalLevel Lv0-Lv1)",MSGLV0TO2="+900g4c(MedalLevel Lv0-Lv2)",MSGLV0TO3="+1800g13c(MedalLevel Lv0-Lv3)",MSGLV1TO2="+600g3c(MedalLevel Lv1-Lv2)",MSGLV1TO3="+1500g12c(MedalLevel Lv1-Lv3)",MSGLV2TO3="+900g9c(MedalLevel Lv2-Lv3)";
            const SCORELV0TO1="301",SCORELV0TO2="904",SCORELV0TO3="1813",SCORELV1TO2="603",SCORELV1TO3="1512",SCORELV2TO3="909";
 
            if (reqMedalLevel < sisMedal){
                highlightArea(postElement, "Yellow", "注意：当前用户持有勋章等级超过本贴申请勋章等级！（可能由于后续用户获得了高等级勋章）。");
            }else if (reqMedalLevel > sisMedal){
                //申请中，什么也不做
            }else if (reqMedalLevel == sisMedal){
                highlightArea(postElement, "Green", "当前申请勋章已发放！");
                if (reqMedalLevel == 1){
                    if (currentMedalLevel == 0){
                        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,300,0,0,1,MSGLV0TO1,'【Lv0->1】');
                        $(postActionsBar).append(innerHtml);
                        highlightScoreButton(pid, '300');
                        msgShort = "0=>1";
                        msg = MSGLV0TO1;
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 300,0,0,1,\'" + msg + "\');", msgShort, msg];
                    }else {
                        highlightArea(postElement, "Orange", "异常：申请书中当前勋章等级不对或加分异常，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
                    }
                }else if (reqMedalLevel == 2){
                    if (currentMedalLevel == 0){
                        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,900,0,0,4,MSGLV0TO2,'【Lv0->2】');
                        $(postActionsBar).append(innerHtml);
                        highlightScoreButton(pid, '900');
                        msgShort = "0=>2";
                        msg = MSGLV0TO2;
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 900,0,0,4,\'" + msg + "\');", msgShort, msg];
                    }else if (currentMedalLevel == 1){
                        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,600,0,0,3,MSGLV1TO2,'【Lv1->2】');
                        $(postActionsBar).append(innerHtml);
                        highlightScoreButton(pid, '600');
                        msgShort = "0=>1";
                        msg = MSGLV1TO2;
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 600,0,0,3,\'" + msg + "\');", msgShort, msg];
                    }else {
                        highlightArea(postElement, "Orange", "异常：申请书中当前勋章等级不对或加分异常，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
                    }
                }else if (reqMedalLevel == 3){
                    if (currentMedalLevel == 0){
                        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,1800,0,0,13,MSGLV0TO3,'【Lv0->3】');
                        $(postActionsBar).append(innerHtml);
                        highlightScoreButton(pid, '1800');
                        msgShort = "0=>3";
                        msg = MSGLV0TO3;
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 1800,0,0,13,\'" + msg + "\');", msgShort, msg];
                    }else if (currentMedalLevel == 1){
                        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,1500,0,0,12,MSGLV1TO3,'【Lv1->3】');
                        $(postActionsBar).append(innerHtml);
                        highlightScoreButton(pid, '1500');
                        msgShort = "1=>3";
                        msg = MSGLV1TO3;
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 1500,0,0,12,\'" + msg + "\');", msgShort, msg];
                    }else if (currentMedalLevel == 2){
                        innerHtml += buildAddScoreButton(0,refer,tid,pid,post,page,formhash,900,0,0,9,MSGLV2TO3,'【Lv2->3】');
                        $(postActionsBar).append(innerHtml);
                        highlightScoreButton(pid, '900');
                        msgShort = "2=>3";
                        msg = MSGLV2TO3;
                        suggestion = [0, "if (document.querySelector(\'td[id=res_"+post+"_2\').textContent == '" + msgShort + "') addScore(\'" + refer + "\' , " + tid + " , " + pid + " , " + post + " , " + page + " , \'" + formhash + "\' , 900,0,0,9,\'" + msg + "\');", msgShort, msg];
                    }else {
                        highlightArea(postElement, "Orange", "异常：申请书中当前勋章词条应对应为0-2级，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
                    }
                }else {
                    highlightArea(postElement, "Orange", "异常：申请书中当前勋章等级不对或加分异常，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
                }
            }
 
            if (ratedElement[0]){
                let score_now = (parseInt(/(-?\d+)/.exec(ratedElement.prop("title"))))?parseInt(/(-?\d+)/.exec(ratedElement.prop("title"))[1]):0;//实际评分
                if (currentMedalLevel == 0 && reqMedalLevel == 1){
                    suggestion = (score_now == SCORELV0TO1)?[1, "", "已评", score_now+"|"+MSGLV0TO1]:[0, "", "异常", "应评："+SCORELV0TO1+"实评："+score_now];
                }else if (currentMedalLevel == 0 && reqMedalLevel == 2){
                    suggestion = (score_now == SCORELV0TO2)?[1, "", "已评", score_now+"|"+MSGLV0TO2]:[0, "", "异常", "应评："+SCORELV0TO2+"实评："+score_now];
                }else if (currentMedalLevel == 0 && reqMedalLevel == 3){
                    suggestion = (score_now == SCORELV0TO3)?[1, "", "已评", score_now+"|"+MSGLV0TO3]:[0, "", "异常", "应评："+SCORELV0TO3+"实评："+score_now];
                }else if (currentMedalLevel == 1 && reqMedalLevel == 2){
                    suggestion = (score_now == SCORELV1TO2)?[1, "", "已评", score_now+"|"+MSGLV1TO2]:[0, "", "异常", "应评："+SCORELV1TO2+"实评："+score_now];
                }else if (currentMedalLevel == 1 && reqMedalLevel == 3){
                    suggestion = (score_now == SCORELV1TO3)?[1, "", "已评", score_now+"|"+MSGLV1TO3]:[0, "", "异常", "应评："+SCORELV1TO3+"实评："+score_now];
                }else if (currentMedalLevel == 2 && reqMedalLevel == 3){
                    suggestion = (score_now == SCORELV2TO3)?[1, "", "已评", score_now+"|"+MSGLV2TO3]:[0, "", "异常", "应评："+SCORELV2TO3+"实评："+score_now];
                }else  {
                    suggestion = [0, "", "异常", "评分异常，请检查！"];
                }
            }
        }catch (e){
            console.log("DoJob_MedalAward:runjob","Error\n",e);
            highlightArea(postElement, "Orange", "异常：因为某些未知的原因使得该贴数据未能成功解析处理，请根据版规处理本回复，并记录楼层链接发送给脚本作者检查。");
        }
 
        // 按楼初始化记分牌内容
        this.scoreboard += '<tr id="res_'+post+'" style="display: none" onclick="window.location.hash=\'#pid' + pid + '\';' + suggestion[1]+'"><td style="color:#FFFFFF; width:60px;">楼:'+post+'</td><td style="color:#FFFFFF; width:60px;" title='+formatDate(postdate, "yyyy-MM-dd HH:mm:ss")+'>发:'+formatDate(postdate, "MM-dd")+'</td><td style="color:#FFFFFF; width:10px;">评:</td><td id="res_'+post+'_1" style="color:#FFFFFF; width:50px;"></td>';
        this.scoreboard += '<td id="res_'+post+'_2" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+'; width:40px;">'+suggestion[2]+'</td><td id="res_'+post+'_3" style="color:'+(suggestion[0]?'#FFA200':'#FFFFFF')+';width:45%;" title="'+suggestion[3]+'">'+((suggestion[3].length>20)?(suggestion[3].substring(0,15)+"..."):suggestion[3])+'</td></tr>';
    }
    // 子类完成页面级收尾
    finish(){
        let scoreboard=this.scoreboard;
        // 补充记分牌尾部，绑定显示隐藏事件并插入页面
        scoreboard += '</table></div>';
        $("body").append(scoreboard);
        $("#resultDiv").show();
    }
}
 
// 构建直达链接按钮
function createRealRelativeLink(){
    const sisurlA = /^http(s)?:\/\/.*\/(bbs|forum)\/(thread-|forum-|viewthread.php|redirect.php)(.*)/;
    const sisurlR = /^(thread-|forum-|viewthread.php|redirect.php)(.*)/;
    Array.from(document.querySelectorAll('a')).forEach(function (e){
        var parent = e.parentNode;
        var newElement = createNewArcher(e.href);
        if (!newElement) return;
        if( parent.lastChild == e ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
            parent.appendChild( newElement, e );
        }else{
            parent.insertBefore( newElement, e.nextSibling );
        };
 
        function createNewArcher(thref){
            let tsisurlA = sisurlA.exec(thref);
            let tsisurlR = sisurlR.exec(thref);
            let tmpExec1 = sisurlA.exec(thref) ? sisurlA.exec(thref) :sisurlR.exec(thref);
            if (!tmpExec1) return null;
            let newA = document.createElement("a");
            newA.innerHTML = "【直达】";
            let ttid = /tid=(\d+)/.exec(tmpExec1[0]);
            let tpid = /pid(=?)(\d+)/.exec(tmpExec1[0]);
            //let relativeUrl = "viewthread.php?tid="+ttid+ "&page="+page +"#pid"+tpid;
            if (ttid && tpid) {
                newA.href = 'redirect.php?goto=findpost&pid='+tpid[2]+'&ptid='+ttid[1]; return newA;
            }
            let toPost = /^http(s)?:\/\/(.*)\/(bbs|forum)\/(thread-|forum-)(.*)/.exec(tmpExec1[0]);
            let isLocal = new RegExp(location.hostname,'g').exec(tmpExec1[0]);
            if (toPost && !isLocal) {
                newA.href = toPost[4]+toPost[5]; return newA;
            }
            return null;
        }
    });
 
}
 
// 验证是否有正确的论坛链接并解构[0]flag[0]fid[0]tid[1]pid[2]page[3]post
function checkUrl(address){
    const regUrl1 = /thread-(\d+)-(\d+)-\d+.html/;
 
    const regUrl2 = /viewthread.php\?.*/;
    const regUrl2_1 = /\tid=(\d+)/;
    const regUrl2_2 = /\pid=(\d+)/;
    const regUrl2_3 = /\page=(\d+)/;
 
    const regUrl3 = /redirect.php\?goto=findpost\&pid=(\d+)\&ptid=(\d+)/;
    const regUrl3_1 = /\pid=(\d+)/;
    const regUrl3_2 = /\ptid=(\d+)/;
    let ret = [0,0,0,0,0,0];
 
    //thread
    if (regUrl1.exec(address)){
        return ret;
    }
    //viewthread.php
    if (regUrl2.exec(address)){
        return ret;
    }
    //redirect.php
    if (regUrl3.exec(address)){
        return ret;
    }
    return ret;
}
 
// 构建评分提交按钮
function buildAddScoreButton(id, refer, tid, pid, post, page, formhash, score, org, prestige, contribution, comment, text){
    var onClickStr = 'this.style=\'pointer-events: none; color: gray; border:2px; font-size:30px;\';addScore(\'' + refer + '\' , ' + tid + ' , ' + pid + ' , ' + post + ' , ' + page + ' , \'' + formhash + '\' , ' + score + ',' + org + ',' + prestige + ',' + contribution + ',\'' + comment + '\');';
    return '<a id="score'+score+'_pid'+pid+'" onclick=" '+ onClickStr +' " style="font-size:12px; cursor:pointer;">'+text+'</a>';
}
// 构建信息+链接的提示
function buildNotifcation(msg, href){return '</br>' + msg + ' 链接：<a href="' + href + '">' + href + '</a>';}
// 高亮留言按钮
function highlightRemarkButton(tid, pid, page){ $("a[href='remarks.php?tid="+tid+"&page="+page+"&pid="+pid+"'").css({"font-size":"30px","color":"red", "background":"gold"}); }
// 高亮自定评分按钮
function highlightScoreButton(pid, score){ $('a#score'+ score +'_pid' + pid).css({"font-size":"30px","color":"red", "background":"gold"});}
// 高亮区域并追加提示
function highlightArea(htmlNode, color = "White", msg){
    var innerhtml = '';
    var arg;
    htmlNode.css("background-color", color);
    if (msg) innerhtml += '<p id style="background-color:' + color + '; color:#000000; font-size:15px; border:2px solid black; padding:3px; font-weight:bolder;">' + msg;
    for (let i = 3 ; i<arguments.length ; i++ ){
        arg = arguments[i];
        if (typeof arg == "string" || arg instanceof String) { innerhtml += arg; };
        if (arg instanceof Array) {for (let i =0 ; i < arg.length; i++){innerhtml += buildNotifcation(((arg[i][0]>-1)?"违规历史(本帖)：":"违规历史：") + arg[i][1] + "原因：" + arg[i][3], arg[i][2]);}};
        innerhtml += '</br>';
    }
    arg = null;
    innerhtml += innerhtml? "</p>" :"";
    htmlNode.before(innerhtml);
}
 
// 回收GM空间
function recycleGM(arg){
    const lastDCtimeKey = "LASTDCtime";  // 垃圾回收事件
    let lastDCtime = GM_getValue(lastDCtimeKey, 0);
    let nowDate = new Date();
    if (!arg && (nowDate.getTime() - lastDCtime) < 864000000 ) return; //10天
    GM_setValue(lastDCtimeKey, nowDate.getTime());
    let list = GM_listValues();
    console.log("recycleGMCache starting:",list.length, "LASTDCtime", lastDCtime);
    const clearAll = () => {for (let i = 0 ; i < list.length ; i++) GM_deleteValue(list[i]);};
    const clearByPre = (prefix) => {for (let i = 0 ; i < list.length ; i++) if(list[i].indexOf(prefix) ==0)GM_deleteValue(list[i]);};
    const clearByID = (prefix) => {for (let i = 0 ; i < list.length ; i++) if(list[i] == prefix)GM_deleteValue(list[i]);};
    switch(arg) {
        case "all":
            clearAll();break;
        case "ama_":
            clearByPre("ama_");break;
        case "ada_":
            clearByPre("ada_");break;
        case lastDCtimeKey:
            clearByPre(lastDCtimeKey);break;
        default:
            if (arg) clearByID(arg);
            if (nowDate.getDate() > 10) clearByPre("ama_");
    }
    console.log("recycleGMCache completed:",list.length);
}
 
// 时间格式化函数
function formatDate(date,fmt){ //author: meizz
    let o = {"M+" : date.getMonth()+1,"d+" : date.getDate(),"h+" : date.getHours(),"m+" : date.getMinutes(),"s+" : date.getSeconds(),"q+" : Math.floor((date.getMonth()+3)/3),"S"  : date.getMilliseconds()};
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
 
const hide = (el) => Array.from(el).forEach(e => (e.style.display = 'none')); //function hide(el)
const show = (el) => Array.from(el).forEach(e => (e.style.display = 'none')); //function show(el)
const mergeArray = (a, b) => { b.reduce(function(prev,cur,index,arr){ a.push(cur);}, 0);} //function mergeArray(a, b){ b.reduce(function(prev,cur,index,arr){ a.push(cur);}, 0);}
// 获取用户违规历史
const inIllegalUidList = (arr, uid, pid) => {
    if (!arr) {return;}
    var nowYYYYMM = parseInt(formatDate(new Date(),"yyyyMM"));
    let a = new Array();
    for (let i = arr.length-1 ; i >= 0 ; i--){
        let ym = ((parseInt(arr[i][1].substr(4,2))+3)>12) ? (arr[i][1].substr(0,4)+1)*100 + (parseInt(arr[i][1].substr(4,2))-9) : (arr[i][1].substr(0,4)*100 + (parseInt(arr[i][1].substr(4,2))+3));//3个月
        if (arr[i][0] == uid && ym >= nowYYYYMM) a.push([arr[i][2].indexOf(pid), arr[i][1], arr[i][2], (arr[i].length > 3)?arr[i][3]:""]);//原因可以为空
    }
    return a.length > 0 ? a : 0;
}
 
// 记分牌操作
const scoreboard_rating = (post, score, res, restext) => { $("#res_"+post+"_1").text(score);$("#res_"+post+"_2").text(res);$("#res_"+post+"_3").attr("title",restext);(restext.length > 13) ? $("#res_"+post+"_3").text(restext.substring(0,10)+"...") : $("#res_"+post+"_3").text(restext);}
const scoreboard_coloring = (post, color="#FFA200") => { $("#res_"+post+"_2").css("color",color);$("#res_"+post+"_3").css("color",color);}
const scoreboard_success = (val=1) => { $("#resultTotal").html(function(i,originTxt){ $("#resultTotal").html(parseInt(originTxt)+val);});$("#resultSuccessCount").html(function(i,originTxt){$("#resultSuccessCount").html(parseInt(originTxt)+val);});}
const scoreboard_failure = (val=1) =>{ $("#resultTotal").html(function(i,originTxt){$("#resultTotal").html(parseInt(originTxt)+val);});$("#resultFaildCount").html(function(i,originTxt){$("#resultFaildCount").html(parseInt(originTxt)+val);});}
 
//快速评分
unsafeWindow.fastRating = function fastRating(refer, tid, pid, post, page, formhash){
    var innerHtml = '<form id="ratepostform"">';
    innerHtml += '<input type="hidden" name="formhash" value="' + formhash + '">';
    innerHtml += '<input type="hidden" name="ratesubmit" value="yes">';
    innerHtml += '<input type="hidden" name="referer" value="' + refer + '">';
    innerHtml += '<input type="text" name="score1" value="0" size="3">';
    innerHtml += '<input type="text" name="score2" value="0" size="3">';
    innerHtml += '<input type="text" name="score3" value="0" size="3">';
    innerHtml += '<input type="text" name="score6" value="0" size="3">';
    innerHtml += '<textarea id="reason" name="reason">评分原因</textarea>';
    innerHtml += '<input type="checkbox" name="sendreasonpm" value="1" checked="checked" disabled>';
    innerHtml += '<input type="hidden" name="tid" value="' + tid + '">';
    innerHtml += '<input type="hidden" name="pid" value="' + pid + '">';
    innerHtml += '<input type="hidden" name="page" value="' + page + '">';
    innerHtml += '<button type="submit" name="ratesubmit" value="true" id="postsubmit">提交</button>';
    innerHtml += '</form>';
}
 
//复制到剪切板
unsafeWindow.setClipboard = function setClipboard(relativeUrl){GM_setClipboard(relativeUrl);}
 
//处理加分
unsafeWindow.addScore = function addScore(refer, tid, pid, post, page, formhash, score, org, prestige, contribution, comment){
    // 节日祝福絮语
    const Greetings = "";//Happy spring festival!
    // 快速评价
    if (score == 0 && org== 0 && prestige== 0 && contribution == 0 && comment ==""){return;}
    if (score == "tbd") score = prompt("Please enter your score:","");
 
    const score_max = 300,org_max = 10, prestige_max = 10,contribution_max = 10;// 每次评分最大数
    let score_t = 0, org_t = 0, prestige_t = 0, contribution_t = 0;//本次加数
    let score_sum = score;
    for (let i = 0,times = Math.max(Math.ceil(Math.abs(score)/score_max),Math.ceil(Math.abs(org)/org_max),Math.ceil(Math.abs(prestige)/prestige_max),Math.ceil(Math.abs(contribution)/contribution_max)); i < times; i++){
        score_t = (Math.abs(score)>score_max?score_max*(score>=0?1:-1):score);score -= score_t;
        org_t = (Math.abs(org)>org_max?org_max*(org>=0?1:-1):org);org -= org_t;
        prestige_t = (Math.abs(prestige)>prestige_max?prestige_max*(prestige>=0?1:-1):prestige);prestige -= prestige_t;
        contribution_t = (Math.abs(contribution)>contribution_max?contribution_max*(contribution>=0?1:-1):contribution);contribution -= contribution_t;
 
        //开始加分
        $("body").append(createRatepostform(refer, tid, pid, post, page, formhash, score_t, org_t, prestige_t, contribution_t, Greetings+comment));
        $.ajax({
            type: "POST",
            timeout: 8000,
            dataType: "xml",//预期服务器返回的数据类型
            url: "misc.php?action=rate&inajax=1" ,//url
            data: $("#ratepostform").serialize(),//todo 字符集问题未解决
            contentType: "application/x-www-form-urlencoded",
            beforeSend: function(){
                console.time("unsafeWindow.addScore", "Info\n", pid);
                scoreboard_rating(post, score_sum, "提交中", "已评:"+ (score_sum-score_t) + "应评:"+ score_t);
            },
            success: function (data) {
                if ($(data).find('root').text() == "感谢您的参与。"){
                    scoreboard_success();scoreboard_rating(post, score_sum, (0==score)?"成功":"提交中", ((score_t==score)?"":"已评:"+ score_sum) + " " + ((score_sum==score)?"终评:":"应评:") + score);scoreboard_coloring(post);
                }else {
                    scoreboard_failure();scoreboard_rating(post, score_sum, "失败", $(data).find('root').text());
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("unsafeWindow.addScore", "Info\n", "HttpRequestState:", XMLHttpRequest.readyState, XMLHttpRequest.State, " textStatus:", textStatus, " errorThrown:", errorThrown)
                scoreboard_failure();scoreboard_rating( post, score_sum, "失败", textStatus);
            },
            complete: function(){
                // $("tr[id^=res_").show();// 显示记分牌
                console.timeEnd("unsafeWindow.addScore", "Info\n", pid);
            }
        });
        $("#ratepostform").remove();
    }
 
    // 构建评分提交表单
    function createRatepostform(refer, tid, pid, post, page, formhash, score, org, prestige, contribution, comment){
        var innerHtml = '<form id="ratepostform" style="display:none;">';
        innerHtml += '<input type="hidden" name="formhash" value="' + formhash + '">';
        innerHtml += '<input type="hidden" name="ratesubmit" value="yes">';
        innerHtml += '<input type="hidden" name="referer" value="' + refer + '">';
        innerHtml += '<input type="text" name="score1" value="' + score + '" size="3">';
        innerHtml += '<input type="text" name="score2" value="' + org + '" size="3">';
        innerHtml += '<input type="text" name="score3" value="' + prestige + '" size="3">';
        innerHtml += '<input type="text" name="score6" value="' + contribution + '" size="3">';
        innerHtml += '<textarea id="reason" name="reason">' + comment + '</textarea>';
        innerHtml += '<input type="checkbox" name="sendreasonpm" value="1" checked="checked" disabled>';
        innerHtml += '<input type="hidden" name="tid" value="' + tid + '">';
        innerHtml += '<input type="hidden" name="pid" value="' + pid + '">';
        innerHtml += '<input type="hidden" name="page" value="' + page + '">';
        innerHtml += '<button type="submit" name="ratesubmit" value="true" id="postsubmit">提交</button>';
        innerHtml += '</form>';
        return innerHtml;
    }
}
 
//处理PM
unsafeWindow.sendPrivateMessage = function sendPrivateMessage(uid, formhash, subject, message) {
    // 快速评价
    if (uid == "" && formhash == ""){return;}
    if (subject == "") subject = prompt("Please enter the subject:","");
    if (message == "") message = prompt("Please enter the message:","");
 
    // 提交评分内容
    $("body").append(createPMform(uid, formhash, subject, message));
    $.ajax({
        type: "POST",
        timeout: 8000,
        dataType: "xml",//预期服务器返回的数据类型
        url: "pm.php?action=send&amp;inajax=1" ,//url
        data: $("#postpmform").serialize(),//todo 字符集问题未解决
        contentType: "application/x-www-form-urlencoded",
        beforeSend: function(){
            console.time("unsafeWindow.sendPrivateMessage", "Info\n", uid);
        },
        success: function (data) {
            debugger;
            if ($(data).find('root').text() == "短消息发送成功。"){
                alert("短消息发送成功。");
            }else {
                alert("短消息发送成功。");
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("unsafeWindow.sendPrivateMessage", "Info\n", "HttpRequestState:", XMLHttpRequest.readyState, XMLHttpRequest.State, " textStatus:", textStatus, " errorThrown:", errorThrown)
        },
        complete: function(){
            // 显示记分牌
            console.timeEnd("unsafeWindow.sendPrivateMessage", "Info\n", uid);
        }
    });
    $("#postpmform").remove();
 
    // 构建评分提交表单
    function createPMform(uid, formhash, subject, message){//ajax_uid_185953206_menu
        var innerHtml = '<form id="postpmform" name="postpmform" style="display:none;" accept-charset="GB2312">';
        innerHtml += '<input type="hidden" name="formhash" value="' + formhash + '">';
        innerHtml += '<input type="hidden" name="pmsubmit" value="' + formhash + '">';
        innerHtml += '<input type="text" name="msgto" value="' + uid + '">';//
        innerHtml += '<input type="text" name="subject" value="' + subject + '">';
        innerHtml += '<textarea id="pm_textarea" name="message" >' + message + '</textarea>';
        innerHtml += '<button name="pmsubmit" type="button" class="submit" value="true" >提交</button>';
        innerHtml += '</form>';
        return innerHtml;
    }
}