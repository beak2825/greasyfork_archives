// ==UserScript==
// @name         日常本子-小鹿日用(21修改版)
// @namespace    http://tampermonkey.net/
// @version      2023
// @description  脚本有风险 使用需谨慎
// @author       坏熊无双和毛毛，后期筑梦师幻影修改,江南改版,仙剑维护,小鹿拿来就用
// @match        http://121.40.177.24:8001/*
// @match        http://110.42.64.223:8021/*
// @match        http://121.40.177.24:8041/*
// @match        http://121.40.177.24:8061/*
// @match        http://110.42.64.223:8081/*
// @match        http://121.40.177.24:8101/*
// @match        http://121.40.177.24:8102/*
// @match        http://swordman-s1.yytou.com/*
// @exclude      http://res.yytou.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501598/%E6%97%A5%E5%B8%B8%E6%9C%AC%E5%AD%90-%E5%B0%8F%E9%B9%BF%E6%97%A5%E7%94%A8%2821%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501598/%E6%97%A5%E5%B8%B8%E6%9C%AC%E5%AD%90-%E5%B0%8F%E9%B9%BF%E6%97%A5%E7%94%A8%2821%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==
/**
	 * Created by MoBeiHuYang on 2017/7/5.
	 *	Updated by Jeffrey on 20/10/2017 and shadow 7/7/2018 and nokill 18/7/2018
	 */

var lj_paras = {
    newday:'_0',
    wushi:{},
    wushu:'',
    zhanzhao:0,
    wushujifen:0,
    ptTimes:0,
    maxptTimes:4,
    TfTimes:0,
    maxTfTimes:5,
    XSTimes:0,
    maxXSTimes:5,
    xhtimes:0,
    xhMaxtimes:15,
    xsNpcID:4,	//默认白衣神君
    options:'LianZhao,clearlog',
    huixue:'force1',
    huinei:'nei1',
    qianlong:'云梦璃,花无缺,三少爷,浪翻云,乔峰,令狐冲',
}
var wushuList = ['钻天鼠','锦毛鼠','穿山鼠','彻地鼠','翻江鼠']
var DragonBonusA = ["明月鞋","月光宝甲衣","明月戒","明月帽","明月项链","明月手镯","屠龙刀","倚天剑","冰魄银针","墨玄掌套","碧磷鞭","烈日棍","西毒蛇杖","星月大斧","碧玉锤","霸王枪"];
var DragonBonusB = ["烈日宝靴","日光宝甲衣","烈日宝戒","烈日帽","烈日宝链","烈日宝镯","斩神刀","诛仙剑","暴雨梨花针","龙象拳套","七星鞭","残阳棍","伏虎杖","破冥斧","撼魂锤","赤焰枪"];
var DragonBonusC = ["斩龙宝靴","龙皮至尊甲衣","斩龙宝戒","斩龙帽","斩龙宝链","斩龙宝镯","飞宇天怒刀","九天龙吟剑","小李飞刀","天罡掌套","乌金玄火鞭","开天宝棍","达摩杖","天雷断龙斧","烛幽鬼煞锤","斩龙鎏金枪"];
var DragonBonusD = ["君影草","矢车菊","忘忧草","仙客来","雪英","朝开暮落花","夕雾草","凤凰木","熙颜花","晚香玉","凌霄花","彼岸花","洛神花","百宜雪梅","胤天宝帽碎片","胤天项链碎片","胤天宝戒碎片","鱼肠碎片","轩辕剑碎片","破岳拳套碎片","胤天宝镯碎片","胤天宝靴碎片","胤天紫金衣碎片","昊天龙旋铠碎片","水羽云裳碎片","奉天金带碎片","凤羽乾坤盾碎片","玄冰凝魄枪碎片","雷霆诛神刀碎片","天雨玄镖碎片","天神杖碎片","轰天巨棍碎片","神龙怒火鞭碎片","胤武伏魔斧碎片","九天灭世锤碎片"];
var DragonBonus = [];
var DragonBonus0 = [];
var DragonBonus1 = [];
var DragonBonus2 = [];
var DragonBonus3 = [];
var DragonBonus4 = [];
var DragonBonus5 = [];
var enforcePoints = 895;
var mySkillLists = " ";
var spearSkillLists = "燎原百破";
var otherSkillLists = "飞刀绝技;";
var qianlongList = [
    {'id':'renxia','name':'任侠','exp':45000000},
    {'id':'cike','name':'暗刺客','exp':90000000},
    {'id':'daoke','name':'金刀客','exp':135000000},
    {'id':'zhui','name':'追三','exp':180000000},
    {'id':'wu','name':'无花','exp':225000000},
    {'id':'chuan','name':'传鹰','exp':270000000},
    {'id':'ling','name':'令东来','exp':630000000},
    {'id':'ximen','name':'西门吹雪','exp':720000000},
    {'id':'shizhixuan','name':'石之轩','exp':810000000},
    {'id':'zhudawang','name':'朱大天王','exp':900000000},
    {'id':'chuzhaonan','name':'楚昭南','exp':990000000},
    {'id':'aqing','name':'阿青','exp':1080000000},
    {'id':'chuliuxiang','name':'楚留香','exp':1170000000},
    {'id':'tonglao','name':'天山童姥','exp':1260000000},
    {'id':'qianluo','name':'乾罗','exp':1350000000},
    {'id':'linghuchong','name':'令狐冲','exp':1440000000},
    {'id':'qiaofeng','name':'乔峰','exp':1530000000},
    {'id':'langfanyun','name':'浪翻云','exp':1620000000},
    {'id':'sanshaoye','name':'三少爷','exp':1710000000},
    {'id':'huawuque','name':'花无缺','exp':1800000000},
    {'id':'yunmengli','name':'云梦璃','exp':1890000000},
]
var autoBangFour = false;
var autoJINGMAI = false;
var buttonHeight = '20px';
var currentPos = 50;
var connectTimeout = null;
var xiaohaoID = 'u7592247';
var forceSkills = ['紫血大法'];//回血技能
var forceSkills2 = ['不动明王诀'];//回内技能
var url= 'http://47.94.105.83:9099/test';	//服务器地址
var minYuanbao = 110000;	//保留最低元宝数量

var version = 't3.1.92-200306';
var knownlist=[];
var ButtonId = "";
var autoreconnectTrigger=0;
var healflg = 0;
var AutoRecoverFlg = 0;
var BB3flg = 0;
var Learderflg = 0;
var xuanhong_flag =0;
var buff_flag = 0,bx_flag = 0,bx_flag2 = 0,tx_flag = 0,lx_flag = 0,bs_flag = 0,holdflg=0,dodge_flag=0,zixia_flag=0,buxuan_flag=0,yihan_flag=0;
var fight_tx = 0,fight_bx = 0,fight_lx = 0,fight_bs = 0,fight_dodge=0,fight_zixia=0,fight_buxuan=0,fight_yihan=0,fight_bing1=0,fight_bing2=0,yihan_time=0,yihan_time2=0,buxuan_time=0,buxuan_time2=0,tx_time = 0,dodge_time=0,zixia_time=0,fight_blood = 0,fight_blood2 = 0,bloodTmp = 0,checkBS=0;
var buxuan_default = 12000,yihan_default=11000,lastBusy='';
var connectTime = new Date().getTime();
var conTimes=0;
var AutoXuanhong = false;
var busy = 0;
var userid = '';		//当前角色id
var username = '';		//当前角色姓名
var user_kee = 1;		//当前角色气血
var user_maxkee = 1;	//当前角色最大气血明月
var user_force = 1;		//当前角色内力
var user_maxforce = 1;	//当前角色最大内力
var user_xdz = 0;		//当前角色行动条
var user_yuanbao = 0;	//元宝数量
var genzhaoTrigger = 0;
var bangpailing = 0;	//帮派令数量
var shimenling = 0;		//师门令数量
var jianghuling = 0;	//江湖令数量
var zhuangyuantie = 0;	//状元贴数量

document.onkeydown=function(c){/*
        //小键盘操作
		var a=c||window.event||arguments.callee.caller.arguments[0];
		if(a&&107==a.keyCode){	//小键盘 +
			var b=prompt("请输入要前往的章节","1");
			b&&clickButton("jh "+b)
		}
		if(a&&68==a.keyCode){	//键盘 d
			var b=prompt("请输入要前往的章节","1");
			b&&clickButton("jh "+b)
		}
//		a&&83==a.keyCode&&clickButton("escape",0);
		a&&97==a.keyCode&&clickButton("go southwest");	//小键盘1
		a&&98==a.keyCode&&clickButton("go south");		//小键盘2
		a&&99==a.keyCode&&clickButton("go southeast");	//小键盘3
		a&&100==a.keyCode&&clickButton("go west");		//小键盘4
		a&&101==a.keyCode&&clickButton('skills');		//小键盘5
		a&&102==a.keyCode&&clickButton("go east");		//小键盘6
		a&&103==a.keyCode&&clickButton("go northwest");	//小键盘7
		a&&104==a.keyCode&&clickButton("go north");		//小键盘8
		a&&105==a.keyCode&&clickButton("go northeast");	//小键盘9
		a&&96==a.keyCode&&clickButton('golook_room');	//小键盘0
		a&&110==a.keyCode&&clickButton('score');		//小键盘.
		a&&106==a.keyCode&&clickButton('score_info');	//小键盘*
		a&&109==a.keyCode&&1==confirm("确认离开？")&&clickButton("home");//小键盘-
		a&&111==a.keyCode&&clickButton('items');		//小键盘 /
		a&&81==a.keyCode&&clickButton("playskill 1");   //键盘 q
		a&&87==a.keyCode&&clickButton("playskill 2");   //键盘 w
		a&&69==a.keyCode&&clickButton("playskill 3");   //键盘 e
		a&&82==a.keyCode&&clickButton("playskill 4");   //键盘 r
        */
};
var isDelayCmd = 1, // 是否延迟命令
    cmdCache = [],      // 命令池
    cmdCache2 = [],      // 命令池
    timeCmd = null,     // 定时器句柄
    timeCmd2 = null,     // 定时器句柄
    cmdNow = '',		//	当前命令
    paustStatus = 0,	//是否暂停执行
    find_time = null,
    cmdDelayTime = 200; // 命令延迟时间

// 执行命令串
function go3(str) {
    let arr = str.split(";");
    for(let i=0;i<arr.length;i++){
        arr[i] = arr[i].replace('chuaimo go,','chuaimo go--')
        arr[i] = arr[i].replace('tupo go,','tupo go--')
        let arr1=arr[i].split(",");
        for(let j=0;j<arr1.length;j++){
            let tmp = arr1[j];
            if (tmp.charAt(0) === '#' && tmp.charAt(1) !== 'w') {
                let r = tmp.match('#(.*?) (.*)');
                let repeatTimes = parseInt(r[1]);
                for (let j = 0; j < repeatTimes; j++) {
                    r[2] = r[2].replace('--',',');
                    cmdCache2.push(r[2]);
                }
            } else {
                tmp = tmp.replace('--',',');
                cmdCache2.push(tmp);
            }
        }
    }
    if (!timeCmd2 && cmdCache2.length>0)
        timeCmd2 = setInterval(delayCmd3,cmdDelayTime)
    //console.log(cmdCache2)

}

function delayCmd3(){
    if(!sock) {return}
    let cmd=cmdCache2.shift();
    clickButton(cmd);
    if (cmdCache2.length==0){
        clearInterval(timeCmd2);
        timeCmd2 = 0;
        return;
    }
}


// 执行命令串
function godirect(str) {
    var arr = str.split(";");
    if (isDelayCmd && cmdDelayTime) {
        // 把命令存入命令池中
        cmdCache = cmdCache.concat(arr);
        // 当前如果命令没在执行则开始执行
        if (!timeCmd) delayCmd();
    } else {
        for (var i = 0; i < arr.length; i++) clickButton(arr[i]);
    }
}

// 执行命令池中的命令
function delayCmd() {
    // 执行命令池中第一个命令，并从池中删除
    if(paustStatus === 1) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
        return;
    }
    var cmd=cmdCache.shift();
    if(cmd == 'home') cmdCache.unshift('sleep_hanyuchuang')
    if(!cmd) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
        //    console.log("cmd error!");
        return;

    }
    var arr=cmd.split(",");
    if(!arr) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
        console.log("arr error!");
        return;

    }
    if(!sock) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
        console.log("sock error!");
        return;
    }
    if (paustStatus === 0){
        if(isContains(arr[0],'halt')||
           isContains(arr[0],'kill')||
           isContains(arr[0],'fight')){
            paustStatus = 1;
        }
        if(isContains(arr[0],'eval'))
        {
            console.log(arr[0].replace('eval_',''));
            eval(arr[0].replace('eval_',''));

        }else{

            clickButton(arr[0]);
        }
    }
    for(var i=arr.length-1;i>0;i--){
        cmdCache.unshift(arr[i]);
    }

    // 如果命令池还有命令，则延时继续执行
    if (cmdCache.length > 0) {
        timeCmd = setTimeout(delayCmd, cmdDelayTime);
    } else {
        // 没有命令 则归零
        timeCmd = 1;
        setTimeout(function(){
            if(cmdCache.length === 0)
                timeCmd=0;
            else
                delayCmd();
        },cmdDelayTime);
    }

}
// 停止执行
function stopDelayCmd() {
    // 清除计时器
    clearTimeout(timeCmd);

    // 归零计时器
    timeCmd = 0;

    // 清除命令池
    cmdCache = [];

    clearInterval(timeCmd2);
    timeCmd2 = 0;
    cmdCache2 = [];
}

//----------------------------
var nextFun = function() {};
var TriggerFuc = function(){};
var cmdTrigger = function(){};
function go2(str) {
    var arr = str.split(";");
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i].replace('chuaimo go,','chuaimo go--')
        arr[i] = arr[i].replace('tupo go,','tupo go--')
        var arr1=arr[i].split(",");
        for(var j=0;j<arr1.length;j++){
            var tmp = arr1[j];
            if (tmp.charAt(0) === '#' && tmp.charAt(1) !== 'w') {
                let r = tmp.match('#(.*?) (.*)');
                let repeatTimes = parseInt(r[1]);
                for (let j = 0; j < repeatTimes; j++) {
                    r[2] = r[2].replace('--',',');
                    cmdCache.push(r[2]);
                }
            } else {
                tmp = tmp.replace('--',',');
                cmdCache.push(tmp);
            }
        }
    }
    if (!timeCmd && cmdCache.length>0) delayCmd2();
}
function say(str){
    clickButton('go_chat');
    clickButton('go_chat say');
    $('#chat_msg').val(str);
    clickButton('send_chat');
    clickButton('quit_chat');
}
var gogo = function(){
    paustStatus = 0;
    cmdTrigger = function(){}
}
var yellFuc = function(b){
    var pn = 0;
    var type=b.get('type');

    if(type == 'main_msg'){
        var msg=b.get('msg');
        if(msg.indexOf('大船终于抵达了南海岸边')>-1
           ||msg.indexOf('你们可以下船了')>-1
           ||msg.indexOf('船终于靠岸了')>-1
           ||msg.indexOf('艄公将船靠岸')>-1
           ||msg.indexOf('木筏终于靠岸了')>-1
           ||msg.indexOf('终于到了!')>-1
          ){
            gogo()
        }else if(msg.indexOf('没有腰牌想坐竹篮？')>-1){
            gogo()
            console.log('无腰牌无法坐竹篮');
        }else if(msg.indexOf('还没有达到这儿')>-1){
            setTimeout(function(){clickButton('yell')},1000);
        }
    }else if(type == 'jh' && b.get('subtype') == 'info'){
        var boat = '小船,客船,渔船,木筏,木船,竹篮';
        if(boat.indexOf(g_simul_efun.replaceControlCharBlank(b.get('short'))) == -1){
            if(pn == 0){
                pn++;
                setTimeout(clickButton,600,'golook_room');
            }
            else
                gogo()
        }
    }else if(type=='notice'){
        let msg = b.get('msg')
        if(msg.indexOf('这儿没有船可以喊')>-1){
            gogo()
        }else if(msg.indexOf('所有队友必须杀完所有敌人')>=0){
            console.log('队友没完事')
            setTimeout(function(){clickButton(cmdNow)},500);
        }
    }
    b=null;
}

var benTenFuc = function(b){
    let type = b.get('type');
    let msg = b.get('msg');
    if(type == 'notice' && msg.indexOf('所有队友必须杀完所有敌人')>=0){
        console.log('队友没完事')
        setTimeout(function(){clickButton(cmdNow)},600);
    }else if(type == 'jh' && b.get('subtype') == 'info'){
        gogo()
    }
}

var killFuc = function(b){
    var type=b.get('type');
    var msg = b.get('msg');
    if(type == 'vs' && b.get('subtype') == 'combat_result'){
        setTimeout(function(){
            gogo()
        },1500)
    }else if(type=='notice'){
        if(msg.indexOf('已经太多人了')>-1 || msg.indexOf('此人现在已不在这儿了')>-1 ){
            setTimeout(function(){clickButton(cmdNow)},1000);
        }else if(msg.indexOf('这儿没有这个人')>-1){
            setTimeout(function(){clickButton(cmdNow)},3000);
        }
    }else if(type == 'unknow_command')
        gogo()
    b=null;
}
var eventFuc = function(b){
    var type=b.get('type');
    var gogo = function(){
        paustStatus = 0;
        cmdTrigger = function(){}
    }
    var msg = b.get('msg');
    if(type == 'main_msg'){
        if(msg.indexOf('你身轻如燕')>-1
           || msg.indexOf('你水淋淋地爬上岸')>-1
           || msg.indexOf('葛伦师傅在幻境之中')>-1
          ){
            gogo()
        }else if(msg.indexOf('一阵狂风吹倒，坠入山下')>-1){
            if(cmdNow == 'event_1_58460791')	//天山爬绳1
                cmdCache.unshift('se','s','e','n','ne','nw','event_1_58460791')
            else if(cmdNow == 'event_1_17801939')	//天山爬绳1
                cmdCache.unshift('se','s','e','n','ne','nw','ne','nw','event_1_17801939')
            gogo()
        }
        else if(msg.indexOf('有惊无险的走到了对岸')>-1){//苗疆过江成功
            if(cmdNow == '1_event_1_8004914')//希望掉江下，去蓝姑娘
                cmdCache.unshift('jh 40','s','s','s','s','e','s','se','sw','s','sw','e','e','sw','se','sw','se','1_event_1_8004914')
            gogo()
        }
        else if(msg.indexOf('重心不稳坠入江下')>-1){//苗疆，掉江下
            if(cmdNow == '0_event_1_8004914')//希望过江
                cmdCache.unshift('jh 40','s','s','s','s','e','s','se','sw','s','sw','e','e','sw','se','sw','se','0_event_1_8004914')
            gogo()
        }else if(msg.indexOf('干嘛呢，小偷讨打')>-1){//没偷成功
            go2("fight songshan_songshan14;event_1_75701369")
        }else if(msg.indexOf('你神不知鬼不觉将嵩山弟子身上的衣服扒个精光')>-1){//偷成功
            gogo()
        }else if(msg.indexOf('你一不小心又摔了下来')>-1){
            cmdCache.unshift(cmdNow)
            gogo()
        }else if(msg.indexOf('你抓住最粗的一根')>-1){
            if(cmdNow == '0_event_1_65661209'){
                cmdCache.unshift('w','event_1_60035830','0_event_1_65661209')
                gogo()
            }
            else if(cmdNow == '1_event_1_65661209'){
                gogo()
            }
        }else if(msg.indexOf('果然是一道门，缓缓移开，露出一洞来')>-1){
            gogo()
        }else if(msg.indexOf('石壁刚打开一条缝，就又合上了')>-1){
            setTimeout(function(){cmdCache.unshift('event_1_38333366')},100)
        }else if(msg.indexOf('你向西边游去')>-1||msg.indexOf('连忙加速游过去')>-1||msg.indexOf('游近一看')>-1||msg.indexOf('越来越近了，不过你也冷得直发抖')>-1){
            setTimeout('clickButton("event_1_35141481")',cmdDelayTime)
        }else if(msg.indexOf('灵空说道：我佛无上')>-1 || msg.indexOf('灵空说道：这儿就是大昭寺')>-1){
            setTimeout('clickButton("ask lama_master")',cmdDelayTime)
        }
    }else if(type == 'jh' && b.get('subtype') == 'info'){
        if(b.get('short') == '洞口'){
            if(cmdNow == '0_event_1_65661209')
                gogo()
            else if(cmdNow == '1_event_1_65661209'){
                cmdCache.unshift('s','1_event_1_65661209')
                gogo()
            }
        }
        else if(b.get('short') == '平台'){
            if(cmdNow == 'event_1_60035830')
                gogo()
        }
    }else if(type == 'jh' && b.get('subtype') == 'info'){
        if(b.get('short') == '荒漠'){
            if(cmdNow == '0_event_1_65661209')
                gogo()
            else if(cmdNow == '1_event_1_65661209'){
                cmdCache.unshift('s','1_event_1_65661209')
                gogo()
            }
        }
        else if(b.get('short') == '平台'){
            if(cmdNow == 'event_1_60035830'){
                gogo()}
        }
        else if(b.get('short') == '龙城道场'){
            if(cmdNow == 'event_1_27333767'){
                setTimeout(gogo(),5000)}
        }
    }
    else if(
        (type == 'vs' && b.get('subtype') == 'combat_result')
        ||(type=='notice' && msg.indexOf('这儿没有这个人')>-1)
        ||(type=='notice' &&b.get('msg').indexOf('你今天已经战胜过铜人了')>-1)
    ){
        setTimeout(function(){
            gogo()
        },500)
    }else if(type=='notice'){
        msg=b.get('msg');
        if(msg.indexOf('已经太多人了')>-1 || msg.indexOf('此人现在已不在这儿了')>-1 || msg.indexOf('击杀请求过于频繁')>-1){
            setTimeout(function(){clickButton(cmdNow)},1000);
        }
    }else if(type == 'jh' && b.get('subtype') == 'new_item'){
        let corpseid = b.get('id');
        if(g_obj_map.get('msg_room')){
            let room = g_obj_map.get('msg_room').get("obj_p")
            if(room == '2922' || room == '2309')
                clickButton('get '+corpseid);
        }
    }else if(type == 'unknow_command')
        gogo()
    b=null;
}

function delayCmd2() {
    if(!sock) {timeCmd = setTimeout(delayCmd2,3000);return}
    //console.log(1)
    if (paustStatus === 0){
        var cmd=cmdCache.shift();
        if(cmd == 'home') cmdCache.unshift('sleep_hanyuchuang')
        if(cmd == null || cmd == undefined) {
            if(cmdCache.length > 0) timeCmd = setTimeout(delayCmd2, cmdDelayTime);
            return;
        }
        cmdNow = cmd;
        if(
            isContains(cmd,'yell')
        ){
            paustStatus = 1;
            cmdTrigger = yellFuc;
        }else if(//本10
            cmd == 'event_1_98378977'
            ||cmd == 'event_1_26309841'
            ||cmd == 'event_1_5916858'
            ||cmd == 'event_1_24864938'
            ||cmd == 'event_1_5376728'
            ||cmd == 'event_1_75397642'){
            paustStatus = 1;
            cmdTrigger = benTenFuc;
        }else if(cmd.substr(0,5) == 'kill2'){
            paustStatus = 1;
            cmdTrigger = killFuc;
            cmdNow = cmd = cmd.replace('kill2','kill')
            setTimeout(chuzhao6,2000)
        }else if(cmd.substr(0,4) == 'kill'
                 ||cmd.substr(0,5) == 'fight'
                 ||isContains(cmd,'event_1_58460791')	//天山爬绳1
                 ||isContains(cmd,'event_1_17801939')	//天山爬绳2
                 ||isContains(cmd,'event_1_60035830')	//茅山1
                 ||isContains(cmd,'event_1_65661209')	//茅山2
                 ||isContains(cmd,'event_1_75701369')	//偷窃嵩山弟子
                 ||isContains(cmd,'event_1_38333366')	//逍遥祖师
                 ||cmd == 'event_1_27333767'				//心魔
                 ||cmd == 'event_1_35141481'				//慕容划水
                 ||cmd == 'event_1_37376258'				//挑战七侠
                 ||cmd == 'event_1_14757697'				//铜人
                 ||cmd == 'event_1_35095441'				//铜人
                 ||cmd == 'event_1_86676244'				//白猿
                 ||cmd == 'event_1_10117215'				//铁剑
                 ||cmd.substr(0,16) == 'event_1_70249808'//格斗场
                 ||cmd == 'event_1_42093689'				//南诏密探
                ){
            paustStatus = 1;
            cmdTrigger = eventFuc;
            if(isContains(cmd,'event_1_65661209')){
                cmd = 'event_1_65661209';}
            setTimeout(chuzhao6,2000)
        }
        else if(cmd.substr(0,3) =="mst"){
            cmdTrigger = mst_gogo;
        }
        else if(cmd.substr(0,6) =="gofind"){
            paustStatus = 1;
            cmdTrigger = eventFuc;
        }
        else if(cmd.substr(0,4) =="stop"){
            paustStatus = 1;
            var stoptime=remove(cmd,"stop")
            setTimeout(gogo,stoptime)
        }
        /*else if(cmd.substr(0,3) =="say"){
            var textsay,removesay;
            removesay=remove(cmd,"say")
            textsay=remove(removesay)
            clickButton('go_chat');
            clickButton('go_chat say');
            $('#chat_msg').val(textsay);
            clickButton('send_chat');
            clickButton('quit_chat');
        }*/
        else if(cmd.substr(0,4) =="talk"){
            var texttalk;
            texttalk=remove(cmd,"talk")
            Infor_OutFunc(texttalk);
        }
        else if(cmd.substr(0,4) =="chat"){
            var textchat,removechat;
            removechat=remove(cmd,"chat")
            textchat=remove(removechat)
            clickButton('go_chat');
            clickButton('go_chat chat');
            $('#chat_msg').val(textchat);
            clickButton('send_chat');
            clickButton('quit_chat');
        }
        else if(cmd.substr(0,4) =="tell"){
            var texttell;
            texttell=remove(cmd,"tell")
            clickButton('go_chat');
            clickButton('go_chat tell');
            $('#chat_msg').val(texttell);
            clickButton('send_chat');
            clickButton('quit_chat');
        }
        else if(cmd.substr(0,4) =="clan"){
            var textclan;
            textclan=remove(cmd,"clan")
            clickButton('go_chat');
            clickButton('go_chat clan');
            $('#chat_msg').val(textclan);
            clickButton('send_chat');
            clickButton('quit_chat');
        }
        else if(cmd.substr(0,6) =="findqx"){
            var name=remove(cmd,"findqx");
            name=String(name);
            var m=findqx(name);
            setTimeout(function(){clickButton('find_task_road qixia '+m)},500)
        }
        else if(cmd == '0_event_1_8004914' || cmd == '1_event_1_8004914'){//苗疆
            paustStatus = 1;
            cmdTrigger = eventFuc;
            cmd = 'event_1_8004914'
        }else if(cmd == 'em1'){
            if(g_obj_map.get('msg_attrs').get('family_name') != '峨嵋派'){
                cmdNow = cmd = 'kill emei_shoushan';
                paustStatus = 1;
                cmdTrigger = eventFuc;
                setTimeout(chuzhao6,2000)
            }
        }else if(cmd == 'em2'){
            if(g_obj_map.get('msg_attrs').get('family_name') != '峨嵋派'){
                cmdNow = cmd = 'kill emei_wenyue';
                paustStatus = 1;
                cmdTrigger = eventFuc;
                setTimeout(chuzhao6,2000)
            }
        }else if(cmd == 'ss1'){//嵩山
            cmdNow = cmd = 'kill songshan_songshan18';
            paustStatus = 1;
            cmdTrigger = eventFuc;
            setTimeout(chuzhao6,2000)
        }else if(cmd=='dzgl'){//大昭寺葛伦
            cmdNow = cmd = 'ask lama_master';
            paustStatus = 1;
            cmdTrigger = eventFuc;
        }

        if(isContains(cmd,'eval'))
        {
            eval(cmd.replace('eval_',''));
        }
        clickButton(cmd);
    }

    let cmdtime = cmdDelayTime;
    if(syncHandle.openFlag && g_obj_map.get("msg_team") && g_obj_map.get("msg_team").get("is_leader") && g_obj_map.get("msg_team").get("is_leader") == '1')
        cmdtime = 350;
    if (cmdCache.length > 0) {
        timeCmd = setTimeout(delayCmd2, cmdtime);
    } else {
        timeCmd = 1;
        setTimeout(function(){
            if(cmdCache.length === 0){
                timeCmd=0;
                nextFun()
                nextFun = function() {}
                //注意：因为执行nextFun后马上执行了清空 nextFun函数命令， 所以如果 nextFun 函数中如果有再次定义 nextFun函数的命令，请延迟1秒再执行，例如 nextFun=function(){setTimeout(xxxx,1000)}
            }
            else
                delayCmd2();
        },cmdtime);
    }
}

var _$ = function(url, param, fun=function(){}, errorFun = function(){}) {
    param.version=version;
    $.ajax({
        type: "post",
        url: url,
        // timeout:2000,
        data: param,
        cache: false,
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        tryCount : 0,
        retryLimit : 3,
        success: function(data) {
            if (data != null) {
                if(data.code != 200){
                    InforOutFunc(data.msg)
                    //return;
                }
                fun(data);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + ' --- ' + errorThrown)
            console.log(XMLHttpRequest)
            this.tryCount++;
            errorFun()
            return;
            if (this.tryCount <= this.retryLimit) {
                //try again
                $.ajax(this);
                return;
            }
        }
    });
};

function clearTrigger(){
    TriggerFuc = function(){}
    cmdTrigger = function(){}
    paustStatus = 0;
    nextFun = function() {};
    stopDelayCmd();

    //xueshan.npc = '';
    busy = 0;
    clearInterval(lianyaoInterval);
    clearTimeout(rcTime);
    clearTimeout(kfTimeout);
}
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function sleep(d){
    for(var t = Date.now();Date.now() - t <= d;);
}
function MyNavigatorFunc(){
    var ljsonpath ={};
    var llnpcList = [];
    var lspath,pathindex=0;
    var ll_mapname="";
    var ll_npcname="";
    var ll_tipinfo='';
    var ll_targetName=prompt("请输入导航的目标名称/部分名称：\nNPC名称\n如：血刀老祖、血刀","");
    if (!ll_targetName) {
        return;
    }
    //InforOutFunc(ll_targetName);
    var param = {
        types:'findPath',
        npc:ll_targetName,
        userID:g_obj_map.get("msg_attrs").get('id'),
        qu:'21',
    }
    _$(url, param, function(data){
        var npcdata = data.data;
        if(!npcdata){
            console.log('没有找到npc')
            return;
        }
        for(var i=0;i<npcdata.length;i++){
            llnpcList[pathindex]=(pathindex +1)+':'+ npcdata[i].place+' '+npcdata[i].short_name+':'+npcdata[i].npc+' '+npcdata[i].color+':'+npcdata[i].path;
            ll_tipinfo=ll_tipinfo+llnpcList[pathindex]+'\n';
            pathindex=pathindex +1;
        }
        if (pathindex>1)
        {
            var ll_targetIndex=prompt("请输入导航的目标序号：\n"+ll_tipinfo,"1");
            if (!ll_targetIndex) {
                return;
            }
            ll_targetIndex=parseInt(ll_targetIndex) - 1;
            if( ll_targetIndex < 0 || ll_targetIndex > llnpcList.length ){
                InforOutFunc("导航的目标序号不正确");
                return;

            }
            lspath=llnpcList[ll_targetIndex].split(':')[3];
            InforOutFunc(npcdata[ll_targetIndex].npc);
            InforOutFunc(lspath);
            go2(lspath);

        }else if (pathindex===1)
        {
            lspath=llnpcList[0].split(':')[3];
            InforOutFunc(npcdata[0].npc);
            InforOutFunc(lspath);
            go2(lspath);
        }else{
            InforOutFunc("导航的目标不在数据库中！");
        }
    });
}


var TupoSkillList = [
];

//武林广场自动回休息室
function gohome() {
    var locationname=g_obj_map.get("msg_room").get("short");
    if(locationname=="武林广场1"){
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场2"){
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场3"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场4"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场5"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场6"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场7"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场8"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场9"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
    if(locationname=="武林广场10"){
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go west");
        overrideclick("go north");
        overrideclick("event_1_18378233");
    }
}

//孤傲自动批准帮派
var uid = window.location.href.split("&")[1].split("=")[1];
function listenBPFunc(){
    var msgtxt=null;
    var msghtml=null;
    if(uid=="3739896"){
        //获取out2的数据变化判断
        $("#out2").bind('DOMNodeInserted', function(e) {
            msgtxt = $(e.target).text() ;
            msghtml = $(e.target).html() ;
            var targetCode = null;
            if (msgtxt.indexOf("申请加入帮派") > -1 )  {
                targetCode = msghtml.split("'")[3];
                clickButton(targetCode);
            }
        });
    }else{
        $("#out2").unbind();
    }
}
listenBPFunc();

/*战斗系统开始*/
//自动出招
var damage = 8000000;
var skillcombo = [];
var combo = [skillcombo];

var dodgeSkills = ['万流归一'];
var skills = [];
var huixueThresh = 0.5;//回血阈值
var huineiThresh = 0.2;//回内阈值
var enemySide = 0;
var enemyKee = {};
var lastPlaySkill = ''; //上次出招技能

function getSkills(){
    let skills = [];
    if (g_obj_map.get("skill_button1")!=undefined)
        skills[0]=ansi_up.ansi_to_text(g_obj_map.get("skill_button1").get("name"));
    else
        skills[0]="";
    if (g_obj_map.get("skill_button2")!=undefined)
        skills[1]=ansi_up.ansi_to_text(g_obj_map.get("skill_button2").get("name"));
    else
        skills[1]="";
    if (g_obj_map.get("skill_button3")!=undefined)
        skills[2]=ansi_up.ansi_to_text(g_obj_map.get("skill_button3").get("name"));
    else
        skills[2]="";
    if (g_obj_map.get("skill_button4")!=undefined)
        skills[3]=ansi_up.ansi_to_text(g_obj_map.get("skill_button4").get("name"));
    else
        skills[3]="";
    if (g_obj_map.get("skill_button5")!=undefined)
        skills[4]=ansi_up.ansi_to_text(g_obj_map.get("skill_button5").get("name"));
    else
        skills[4]="";
    if (g_obj_map.get("skill_button6")!=undefined)
        skills[5]=ansi_up.ansi_to_text(g_obj_map.get("skill_button6").get("name"));
    else
        skills[5]="";
    return skills;
}

function chuzhao3() {
    //console.log('3气出招');
    let skills = getSkills();
    // 遍历所有的可能组合
    //for (var i = 0; i < combo.length; i++) {
    //        for (var j = 0; j < combo[0].length; j++) {
    // 当前组合是否在技能列表里，在就返回
    if(combo.length == 0) return;
    if(combo[0].length == 0) return;
    //console.log(combo)
    comboSkill = combo[0][0];
    if(combo[0].length>1)
        comboSkill = combo[0][1];
    //console.log(comboSkill)
    for (var k = 0; k < skills.length; k++) {
        if (skills[k].indexOf(comboSkill) >= 0){
            clickButton('playskill ' + (k + 1)); //出招
            return;
        }
    }
    //        }
    //}
}

function chuzhao6() {
    //console.log('6气出招');
    var pos = [];
    var comboed = false;
    var i,j,k;
    let skills = getSkills();

    // 遍历所有的可能组合
    for (i = 0; i < combo.length; i++) {
        var comboSkill = combo[i];
        pos = [];
        for (j = 0; j < comboSkill.length; j++) {
            // 当前组合是否在技能列表里
            for (k = 0; k < skills.length; k++) {
                if (skills[k].indexOf(combo[i][j]) >= 0) {
                    ////console.log(k);
                    pos.push(k);
                }
            }
        }

        //按钮技能必须和combo列表符合
        if (pos.length == comboSkill.length)
            break;
    }

    // 出招
    //for (i = 0; i < pos.length && i< Math.floor(gSocketMsg.get_xdz()/3); i++)
    for (i = 0; i < pos.length; i++)
        clickButton('playskill ' + (pos[i] + 1));
}

/* 破招开始 */
var attackKey = ["你如","教你","向你","点你","指你","你只觉","你为","往你","割向你","你反应","青城","大嵩阳","裹向你","你的对攻无法击破","推向你","倒刺","击向你",
                 "准你","你的姿态","奔你","渡你","取你","朝你","刺你","击你","你面对","你根本","抓向你","劈下","砍向你","扣你","并力","你这一招","吹向你",
                 "到你","至你","你被","卷你","将你","了你","于你","你再","你已是","你已是","双目内视",
                 "你愕然","扫你","从你","你的招式尽","削你","扑你","取你","令你",
                 "单手舞动，单刀离背而出","冲你","你一时","落在你","拍你","切你","斩你",
                 "砍你","砸你","趁你","封你","待你","在你","与你","劈你","然你",
                 "你正搜寻","你发现时","你犹如","袭你","使你","你受困","你在极端",
                 "钻你","你未被击中却亦是身受","你避无可避","你分身乏术","算你","你被滚滚",
                 "哪怕你","你唯有","你瞬不及","你步步陷危","你顿时","你已呈九死","锁你","你观之",
                 "中你","只见你","你受此浩劲","你急急而挡","你神识早已","你纵使","你难抗",
                 "瞬间你已是","你愕然","使你","你躲闪不及","逼近你","你宛如一叶","你抵御不住",
                 "你自感","纵是你","捣你","你唯有","你颓然","你挡无可挡","你心头一痛","尽的你",
                 "你当场受创","你脸露惧","管你"];
//'招式之间组合','这几招配合起来','将招式连成', todo
var ignoreList = ['你招式之间组合', '将你的力道卸去大半', '你这几招配合起来', '你将招式连成'];
var bCounterStrike = false;
var pozhao = 0;
function counterStrike(msg) {
    //var xdz = parseInt(b.get('xdz'));
    //if (xdz >= 3) {
    let xdz = gSocketMsg.get_xdz()
    if(pozhao == 1 || xdz<=3) return;
    for (var i = 0; i < attackKey.length; i++) {
        // find key
        if (msg.indexOf(attackKey[i]) >= 0) {
            // if in banlist
            for (var j = 0; j < ignoreList.length; j++) {
                if (msg.indexOf(ignoreList[j]) >= 0)
                    return;
            }
            console.log('反击：' + msg);
            pozhao = 1;
            chuzhao3();
            setTimeout(function(){pozhao=0},500)
            return;
        }
    }
    if(xdz>=9){chuzhao6();;}
    //倾泻一下行动值
    //if (xdz >= 9) {
    //    qinggong();
    //}
    //}
}
var obside=0;
var myside=0;
function Combat(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type == "vs" && subType == "text") {
            var oblist=[];
            var melist=[];
            var obxdz=[];
            var mexdz=[];
            var who=0; //1是自己这边 2是敌人
            ngcount =0;

            //要找到我在哪边。。。。。这个比较恶心。
            if (b.get("msg")==undefined){return;}
            if(gSocketMsg.get_xdz()<3){return;}

            var msg=b.get("msg");
            if (msg == undefined){return;}
            msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            counterStrike(msg);

        }
        if (type == "notice" && subType == "escape") {
            //console.log(g_simul_efun.replaceControlCharBlank(b.get("msg")));
        }
        else if (type=="vs"&&subType=="combat_result"){//战斗结束 继续调取击
            ngcount =0;}
    }

}

function buzhao(){
    var myxdz=gSocketMsg.get_xdz();
    if (myxdz>=3){
        for (var i=1;i<=4;i++){
            if (g_obj_map.get("skill_button"+i)!=undefined&&(ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="飞刀绝技"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="孔雀翎"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="雪饮狂刀"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="翻云刀法"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="九天龙吟剑法"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="覆雨剑法"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="织冰剑法"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="排云掌法"||ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name"))=="如来神掌")){
                if (g_obj_map.get("skill_button"+i).get("xdz")==3){
                    clickButton('playskill '+i,0);
                }
            }

        }
    }else if (myxdz==2){
        for (var i=1;i<=4;i++){
            if (g_obj_map.get("skill_button"+i)!=undefined){
                if (g_obj_map.get("skill_button"+i).get("xdz")==2){
                    clickButton('playskill '+i,0);
                }
            }

        }
    }
}
var combat=new Combat;

var Debug=0;
/*
	var DebugButton = document.createElement('button');
	DebugButton.innerText = '脚本调试';
	DebugButton.style.position = 'absolute';
	DebugButton.style.left = '0px';
	DebugButton.style.top = 30 + 'px';
	DebugButton.style.width = buttonWidth+12;
	DebugButton.style.height = buttonHeight;
	document.body.appendChild(DebugButton);
	DebugButton.addEventListener('click', DebugFunc)
	function DebugFunc(){
		if (Debug==0){
			Debug=1;
			DebugButton.innerText = '停止调试';
		}else{
			Debug=0;
			DebugButton.innerText = '脚本调试';
		}
	}*/
var lastheartbeat=0;
var currentheartbeat=0;
function DebugMode(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type!="channel"){
            console.log(type);console.log(subType);
            console.log(b);
        }
    }
}

//显示隐藏
var hideNpc = 0;
function killhideFunc(){
    if (hideNpc==0){
        hideNpc=1;
        for (var i=1;i<5;i++){
            if(g_obj_map.get("msg_vs_info")){
                var div = document.getElementById('out2');
                if(g_obj_map.get("msg_vs_info").get("vs1_pos"+i)!=undefined){
                    $("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs1_name1")+"<a style='color:rgb(255, 0, 0)' href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs1_pos1")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs1_pos1")+"', 0);\">比试</a></span>")
                }
                if(g_obj_map.get("msg_vs_info").get("vs1_pos"+i)!=undefined){
                    $("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs2_name1")+"<a style='color:rgb(255, 0, 0)' href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs2_pos1")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs2_pos1")+"', 0);\">比试</a></span>")
                }
                div.scrollTop = div.scrollHeight;
            }}
    }else{
        hideNpc=0;
    }
    /*var cmd=$.trim(prompt("请输入命令：","list"));
		if(cmd=="list"){
			if(g_obj_map.get("msg_vs_info")){
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs1_name1")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs1_pos1")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs1_pos1")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs1_name2")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs1_pos2")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs1_pos2")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs1_name3")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs1_pos3")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs1_pos3")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs1_name4")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs1_pos4")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs1_pos4")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs2_name1")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs2_pos1")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs2_pos1")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs2_name2")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs2_pos2")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs2_pos2")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs2_name3")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs2_pos3")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs2_pos3")+"', 0);\">比试</a></span>")
				$("#out2").append("<span class='out2'>"+g_obj_map.get("msg_vs_info").get("vs2_name4")+"<a href=\"javascript:clickButton('kill "+g_obj_map.get("msg_vs_info").get("vs2_pos4")+"', 0);\">击杀</a><a href=\"javascript:clickButton('fight "+g_obj_map.get("msg_vs_info").get("vs2_pos4")+"', 0);\">比试</a></span>")
			}
		}else{
			go($.trim(prompt()));
		}*/
}
function showkillHide(){
    this.dispatchMessage=function(b){
        // 刚进入房间，获取好人和恶人id
        if (b.get('type') == 'jh' && b.get('subtype') == 'info') {
            var keys = b.keys();
            var Id='';
            var Name='';
            var qixiaList = ["步惊鸿", "郭济", "浪唤雨", "火云邪神", "逆风舞", "风南", "狐苍雁", "王蓉", "李宇飞", "庞统", "风行骓", "吴缜", "护竺","玄月研","狼居胥","烈九州","穆妙羽","宇文无敌","李玄霸","八部龙将","风无痕","厉沧若","夏岳卿","妙无心","巫夜姬"];
            for (i = 0; i < keys.length; i++) {
                //console.log( b.get(keys[i])+"；和innerText："+b.get(keys[i]).split(','));
                if (keys[i].indexOf('npc') >= 0) {
                    var npc = b.get(keys[i]).split(',');
                    Id = npc[0];
                    Name = npc[1];
                    if($.inArray(Name,qixiaList)>-1){
                        Id=npc[0].split('_')[0];
                        $("#out").append("<span class='out'><span style='color:rgb(255, 0, 0);font-size:15px'>【</span><span style='color:rgb(255, 128, 0);font-size:15px'>"+g_simul_efun.replaceControlCharBlank(npc[1])+"</span><span style='color:rgb(255, 0, 0);font-size:15px'>】</span><span style='color:rgb(255, 128, 0);font-size:15px'>    <a style='color:rgb(255, 0, 0)' href=\"javascript:clickButton('kill "+npc[0]+"', 0);\">击杀</a>    <a style='color:rgb(255, 128, 128)' href=\"javascript:clickButton('fight "+npc[0]+"', 0);\">比试</a>    <a style='color:rgb(255, 255, 0)' href=\"javascript:clickButton('ask "+npc[0]+"', 0);\">对话</a>    <a style='color:rgb(255, 0, 255)' href=\"javascript:clickButton('auto_zsjd_"+Id+"', 1);\">1金锭</a>    <a style='color:rgb(255, 0, 255)' href=\"javascript:clickButton('auto_zsjd20_"+Id+"', 1);\">15金锭</a></span></span>");
                    }
                    else{
                        $("#out").append("<span class='out' style='color:rgb(255, 0, 255);font-size:15px'>【"+g_simul_efun.replaceControlCharBlank(npc[1])+"】    <a style='color:rgb(255, 0, 0)' href=\"javascript:clickButton('kill "+Id+"', 0);\">击杀</a>    <a style='color:rgb(255, 128, 128)' href=\"javascript:clickButton('fight "+Id+"', 0);\">比试</a>    <a style='color:rgb(255, 255, 0)' href=\"javascript:clickButton('ask "+Id+"', 0);\">对话</a></span>");
                    }
                }
            }
        }
    }
}

var showhide=new showkillHide;
var debugm=new DebugMode;
var combat1=[{},{},{},{}];
var combat2=[{},{},{},{}];
var GodMode=0;
var qgSkills = "万流归一;幽影幻虚步;";
var GodButton = document.createElement('button');
GodButton.innerText = '战斗强化';
//right0ButtonArray.push(GodButton);
GodButton.addEventListener('click', GodFunc);
var hitnpctarget=0;
var hitNPCButton = document.createElement('button');
hitNPCButton.innerText = '打击NPC';
//right0ButtonArray.push(hitNPCButton);
hitNPCButton.addEventListener('click', hitNPCFunc);
function hitNPCFunc(){
    if (hitnpctarget==0){
        hitnpctarget=1;
        hitNPCButton.innerText = '取消NPC';
    }else if (hitnpctarget==1){
        hitnpctarget=0;
        hitNPCButton.innerText = '打击NPC';
    }
    ngcount =0;
    if(hitnpctarget==1){
        //获取out的数据变化判断
        $("#out").bind('DOMNodeInserted', function(e) {
            var oblist=[];
            var melist=[];
            var obxdz=[];
            var mexdz=[];
            var who=0; //1是自己这边 2是敌人
            //要找到我在哪边。。。。。这个比较恶心。
            if(gSocketMsg.get_xdz()<3){return;}
            if (g_obj_map.get("msg_attrs").get("name").match("]")==null){
                var myname=ansi_up.ansi_to_text(g_obj_map.get("msg_attrs").get("name"));
            }

            else{
                var myname=ansi_up.ansi_to_text(g_obj_map.get("msg_attrs").get("name")).split("]")[1];
            }
            //console.log(myname);
            for (var i=0;i<8;i++){
                if (g_obj_map.get("msg_vs_info")!=undefined){
                    if(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))!=undefined){
                        if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))).match("]")!=null){
                            //console.log(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))).split("]")[1]);
                            if (isContains(myname,ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))).split("]")[1])){
                                obside=1;
                                myside=2;
                            }
                        }else{
                            if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1)))==myname){
                                obside=1;
                                myside=2;
                            }
                        }

                    }
                }
                if (g_obj_map.get("msg_vs_info")!=undefined){
                    if(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))!=undefined){
                        if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))).match("]")!=null){
                            //console.log(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))).split("]")[1]);
                            if (isContains(myname,ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))).split("]")[1])){
                                obside=2;
                                myside=1;
                            }
                        }else{
                            if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1)))==myname){
                                obside=2;
                                myside=1;
                            }
                        }
                    }
                }
            }
            //console.log(obside);
            for (var i=0;i<8;i++){//获取整个战场信息
                if (g_obj_map.get("msg_vs_info")!=undefined&&g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1))!=undefined){
                    if (g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1)).match("]")!=null)
                        oblist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1))).split("]")[1]);
                    else
                        oblist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1))));
                    obxdz.push(g_obj_map.get("msg_vs_info").get("vs"+obside+"_xdz"+(i+1)));
                }
                if (g_obj_map.get("msg_vs_info")!=undefined&&g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1))!=undefined){
                    if (g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1)).match("]")!=null)
                        melist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1))).split("]")[1]);
                    else
                        melist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1))));
                    mexdz.push(g_obj_map.get("msg_vs_info").get("vs"+myside+"_xdz"+(i+1)));
                }
            }
            //console.log(oblist);
            //console.log(melist);
            var msg = $(e.target).text();
            if (msg == undefined){return;}
            //console.log(msg);
            //判断出招按钮位置
            var zhaoshi=0; //1是剑法 2是拳法 3是刀法。
            if (whofighting(msg,oblist,melist)){//敌人出招
                zhaoshi=fighttype(msg);
                //伪装代码
                kezhi(zhaoshi,obside);

            }
            //尴尬了，克制都没有成功。现在只能补招了。补招的计算是优先判断是否3气 如果3气就用绝学补招 不够3气就用2气跟招。
            if (pozhaofailed(msg,oblist)){
                buzhao();
            }
        });
    }else if(hitnpctarget==0){
        $("#out").unbind();
    }
}

//自动瞄准
var FightTrigger = 0;

//自动避开
var FriendTrigger = 0;
var FriendFeed = new Friendfeedback();
function Friendfeedback(){
    this.dispatchMessage=function(b){
        //console.log('Friendfeedback')
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="vs"&&subType=="text"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            if(((msg.indexOf('扫你') > -1) ||
                (msg.indexOf('在你') > -1) ||
                (msg.indexOf('四面八方') > -1) ||
                (msg.indexOf('对准你') > -1) ||
                (msg.indexOf('点你') > -1) ||
                (msg.indexOf('劈你') > -1) ||
                (msg.indexOf('取你') > -1) ||
                (msg.indexOf('抓破你') > -1) ||
                (msg.indexOf('往你') > -1) ||
                (msg.indexOf('向你') > -1) ||
                (msg.indexOf('奔你') > -1) ||
                (msg.indexOf('朝你') > -1) ||
                (msg.indexOf('击你') > -1) ||
                (msg.indexOf('斩你') > -1) ||
                (msg.indexOf('对着你') > -1) ||
                (msg.indexOf('直扑你') > -1)) &&
               (msg.indexOf(sessionStorage.getItem("Friend")) == '-1') &&
               (msg.indexOf('紧接着') == '-1') &&
               (msg.indexOf('同时') == '-1') &&
               (msg.indexOf('身形再转') == '-1') &&
               (msg.indexOf('迅疾无比') == '-1'))
            {
                chuzhao6();
            }
        }
    }
}


var hitplayertarget=0;
var hitlist = null;

//跨服破招
var kuafufanjiTriger=0;
function kuafufanjiFunc(){
    if (kuafufanjiTriger==0){
        kuafufanjiTriger=1;
    }else if (kuafufanjiTriger==1){
        kuafufanjiTriger=0;
        $("#out").unbind();
    }
    ngcount =0;
    if(kuafufanjiTriger==1){
        //获取out的数据变化判断
        $("#out").bind('DOMNodeInserted', function(e) {
            var msg = $(e.target).text();
            let xdz = gSocketMsg.get_xdz()
            if (msg.match('你骤地怒吼一声')!=null){
                g_gmain.notify_fail(HIG+"狂吐一口血："+RED+"恭喜你碧血成功！！使劲的撸吧"+NOR);
                g_gmain.notify_fail(HIG+"狂吐一口血："+RED+"恭喜你碧血成功！！使劲的撸吧"+NOR);
            }
            if(xdz<3||msg==undefined){return;}
            if(msg.indexOf("施展出九阳神功") >=0|| msg.indexOf("铁锁横江") >=0
               || msg.indexOf("运起太极神功") >=0|| msg.indexOf("手脚无力") >=0
               || msg.indexOf("的招式尽数被") >=0|| msg.indexOf("打了个寒颤") >=0
               || msg.indexOf("心神一动") >=0|| msg.indexOf("使出一招「苦海无涯」") >=0
               || msg.indexOf("似乎受了点轻伤") >=0|| msg.indexOf("手脚迟缓") >=0
               || msg.indexOf("这几招配合起来") >=0|| msg.indexOf("受伤过重") >=0
               || msg.indexOf("身型微展") >=0|| msg.indexOf("深深吸了几口气") >=0
               || msg.indexOf("心中默念") >=0|| msg.indexOf("双目赤红") >=0
               || msg.indexOf("身子突然晃了两晃") >=0|| msg.indexOf("脸上突然冒出一阵红光") >=0
               || msg.indexOf("加入了战团") >=0|| msg.indexOf("已是飞出数丈之外") >=0){
                return;
            }
            if (msg.indexOf("你如")>-1||msg.indexOf("上了你")>-1||xdz>=9
                ||msg.indexOf("你的招式尽数被")>-1||msg.indexOf("向你")>-1||msg.indexOf("点你")>-1||msg.indexOf("指你")>-1||msg.indexOf("你只觉")>-1||msg.indexOf("你为")>-1
                ||msg.indexOf("往你")>-1||msg.indexOf("准你")>-1||msg.indexOf("你的姿态")>-1||msg.indexOf("奔你")>-1||msg.indexOf("渡你")>-1
                ||msg.indexOf("取你")>-1||msg.indexOf("朝你")>-1||msg.indexOf("刺你")>-1||msg.indexOf("击你")>-1||msg.indexOf("你面对")>-1
                ||msg.indexOf("到你")>-1||msg.indexOf("至你")>-1||msg.indexOf("你被")>-1||msg.indexOf("卷你")>-1||msg.indexOf("将你")>-1
                ||msg.indexOf("了你")>-1||msg.indexOf("于你")>-1||msg.indexOf("你再")>-1||msg.indexOf("你已是")>-1||msg.indexOf("你愕然")>-1
                ||msg.indexOf("扫你")>-1||msg.indexOf("从你")>-1||msg.indexOf("你的招式尽")>-1||msg.indexOf("削你")>-1||msg.indexOf("扑你")>-1
                ||msg.indexOf("取 你")>-1||msg.indexOf("令你")>-1||msg.indexOf("单手舞动，单刀离背而出")>-1||msg.indexOf("冲你")>-1||msg.indexOf("你一时")>-1
                ||msg.indexOf("落在你")>-1||msg.indexOf("拍你")>-1||msg.indexOf("切你")>-1||msg.indexOf("斩你")>-1||msg.indexOf("砍你")>-1){ //敌人出招
                //console.log(msg);
                chuzhao6();

            }
        });
    }else if(kuafufanjiTriger==0){
        $("#out").unbind();
    }
}


var followplayertarget=0;
var followPLYButton = document.createElement('button');
followPLYButton.innerText = '跟随大佬';
//right0ButtonArray.push(followPLYButton);
followPLYButton.addEventListener('click', followPLYFunc);
function followPLYFunc(){
    if (followplayertarget==0){
        followplayertarget=1;
        followPLYButton.innerText = '取消跟随';
    }else if (followplayertarget==1){
        followplayertarget=0;
        $("#out").unbind();
        followPLYButton.innerText = '跟随大佬';
    }
    ngcount =0;
    if(followplayertarget==1){
        //获取out的数据变化判断
        $("#out").bind('DOMNodeInserted', function(e) {
            var oblist=[];
            var melist=[];
            var obxdz=[];
            var mexdz=[];
            var who=0; //1是自己这边 2是敌人
            //要找到我在哪边。。。。。这个比较恶心。
            if(gSocketMsg.get_xdz()<3){return;}
            if (g_obj_map.get("msg_attrs").get("name").match("]")==null){
                var myname=ansi_up.ansi_to_text(g_obj_map.get("msg_attrs").get("name"));
            }

            else{
                var myname=ansi_up.ansi_to_text(g_obj_map.get("msg_attrs").get("name")).split("]")[1];
            }
            //console.log(myname);
            for (var i=0;i<8;i++){
                if (g_obj_map.get("msg_vs_info")!=undefined){
                    if(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))!=undefined){
                        if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))).match("]")!=null){
                            //console.log(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))).split("]")[1]);
                            if (isContains(myname,ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))).split("]")[1])){
                                obside=1;
                                myside=2;
                            }
                        }else{
                            if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1)))==myname){
                                obside=1;
                                myside=2;
                            }
                        }

                    }
                }
                if (g_obj_map.get("msg_vs_info")!=undefined){
                    if(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))!=undefined){
                        if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))).match("]")!=null){
                            //console.log(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))).split("]")[1]);
                            if (isContains(myname,ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))).split("]")[1])){
                                obside=2;
                                myside=1;
                            }
                        }else{
                            if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1)))==myname){
                                obside=2;
                                myside=1;
                            }
                        }
                    }
                }
            }
            //console.log(obside);
            for (var i=0;i<8;i++){//获取整个战场信息
                if (g_obj_map.get("msg_vs_info")!=undefined&&g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1))!=undefined){
                    if (g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1)).match("]")!=null)
                        oblist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1))).split("]")[1]);
                    else
                        oblist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+(i+1))));
                    obxdz.push(g_obj_map.get("msg_vs_info").get("vs"+obside+"_xdz"+(i+1)));
                }
                if (g_obj_map.get("msg_vs_info")!=undefined&&g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1))!=undefined){
                    if (g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1)).match("]")!=null)
                        melist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1))).split("]")[1]);
                    else
                        melist.push(ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs"+myside+"_name"+(i+1))));
                    mexdz.push(g_obj_map.get("msg_vs_info").get("vs"+myside+"_xdz"+(i+1)));
                }
            }
            //console.log(oblist);
            //console.log(melist);
            var msg=g_simul_efun.replaceControlCharBlank($(e.target).text());
            if (msg == undefined){return;}
            //console.log(msg);
            //判断出招按钮位置
            var zhaoshi=0; //1是剑法 2是拳法 3是刀法。
            if (whofighting(msg,oblist,melist)){//敌人出招
                zhaoshi=fighttype(msg);
                //伪装代码
                kezhi(zhaoshi,obside);
                $("#out").empty();
            }
            //尴尬了，克制都没有成功。现在只能补招了。补招的计算是优先判断是否3气 如果3气就用绝学补招 不够3气就用2气跟招。
            if (pozhaofailed(msg,oblist)){
                buzhao();
            }
        });
    }else if(followplayertarget==0){
        $("#out").unbind();
    }
}
var qgTimer=null;
function GodFunc(){
    if (GodMode==0){
        GodMode=1;
        setTimeout(kuafuQinggong,500);
        qgTimer=setInterval(kuafuQinggong,500);
        GodButton.innerText = '停止强化';
    }else{
        GodMode=0;
        clearInterval(qgTimer);
        GodButton.innerText = '战斗强化';
    }
}
var fightflag=0;
var engage=0;
var combattext="";
var enemylist=[];
var Enemy = '';
var alliancelist=[];
var meside=0;
var aboutme=0;
var involewho="";
var meattack=0;
var attackme=0;
var genzhao=0;
var enemyindex=0;
//var kuafu=0;
var followNPC = "";
var qgtargetSkill = [];
var qgtargetIndex = [];
var qgcountor= 0;
var skillbutton=[];
function kuafuQinggong(){
    var neigongCount = 0;
    var xdz = gSocketMsg.get_xdz();
    if(g_obj_map.get("msg_attrs")!=undefined&&fightflag==1){
        if(xdz<3){
            return;
        }
        //出内功
        if(+g_obj_map.get("msg_attrs").get("kee")/+g_obj_map.get("msg_attrs").get("max_kee")<0.5 && neigongCount<3){
            //var neigong=["生生造化功","紫血大法","易筋经神功","八荒功","葵花宝典","紫霞神功","天邪神功","不动明王诀"];
            var neigong=["生生造化功","紫血大法"];
            for (var i=1;i<=4;i++){
                if(g_obj_map.get("skill_button"+i)!=undefined&&$.inArray(ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name")),neigong)>-1){
                    clickButton('playskill '+i,0);
                    neigongCount++;
                    return;
                }
            }
        }
    }
}
function GodView(){
    this.dispatchMessage=function(b){
        //console.log('GodView')
        var type = b.get("type"), subType = b.get("subtype");
        var me=g_obj_map.get("msg_attrs").get("id").split("-")[0];
        if (type=="vs"){
            if (subType=="vs_info"){//获得一次全场更新的机会
                fightflag=1;
                var target1={};
                var target2={};
                meside=0;
                alliancelist=[];
                enemylist=[];
                for (var i=1;i<8;i++){
                    //console.log(b.get("vs1_pos"+i));
                    //console.log(b.get("vs2_pos"+i));
                    if (b.get("vs1_pos"+i)!=undefined&&b.get("vs1_pos"+i).split("-")[0]==me){
                        engage=1;
                        meside=1;
                        //console.log("我参与了战斗");
                    }
                    if (b.get("vs2_pos"+i)!=undefined&&b.get("vs2_pos"+i).split("-")[0]==me){
                        engage=1;
                        meside=2;
                        //console.log("我参与了战斗");
                    }
                }
                //console.log(meside);
                for (var i=1;i<=8;i++){
                    if (b.get("vs1_pos"+i)!=undefined){
                        target1={};
                        target1["vs1_pos"+i]=b.get("vs1_pos"+i).split("-")[0];
                        target1["vs1_pos_v"+i]=b.get("vs1_pos_v"+i);
                        if (b.get("vs1_name"+i).match("]")!=null){
                            //console.log('kuafu:'+kuafu);
                            target1["vs1_name"+i]=ansi_up.ansi_to_text(b.get("vs1_name"+i)).split("]")[1];
                            if (meside==1){
                                alliancelist.push(ansi_up.ansi_to_text(b.get("vs1_name"+i)).split("]")[1]);
                            }else if(meside==2){
                                enemylist.push(ansi_up.ansi_to_text(b.get("vs1_name"+i)).split("]")[1]);
                            }
                        }
                        else{
                            target1["vs1_name"+i]=ansi_up.ansi_to_text(b.get("vs1_name"+i));
                            if (meside==1){
                                alliancelist.push(ansi_up.ansi_to_text(b.get("vs1_name"+i)));
                            }else if(meside==2){
                                enemylist.push(ansi_up.ansi_to_text(b.get("vs1_name"+i)));
                            }
                        }
                        target1["vs1_xdz"+i]=b.get("vs1_xdz"+i);
                        target1["vs1_kee"+i]=b.get("vs1_kee"+i);
                        target1["empty"]=0;
                        combat1[i-1]=target1;

                    }else if(b.get("vs1_pos"+i)==undefined){
                        target1={};
                        target1["empty"]=1;
                        combat1[i-1]=target1;
                    }
                    if (b.get("vs2_pos"+i)!=undefined){
                        target2={};
                        target2["vs2_pos"+i]=b.get("vs2_pos"+i).split("-")[0];
                        target2["vs2_pos_v"+i]=b.get("vs2_pos_v"+i);
                        if (b.get("vs2_name"+i).match("]")!=null){
                            target2["vs2_name"+i]=ansi_up.ansi_to_text(b.get("vs2_name"+i)).split("]")[1];
                            if (meside==2){
                                alliancelist.push(ansi_up.ansi_to_text(b.get("vs2_name"+i)).split("]")[1]);
                            }else if(meside==1){
                                enemylist.push(ansi_up.ansi_to_text(b.get("vs2_name"+i)).split("]")[1]);
                            }
                        }
                        else{
                            target2["vs2_name"+i]=ansi_up.ansi_to_text(b.get("vs2_name"+i));
                            if (meside==2){
                                alliancelist.push(ansi_up.ansi_to_text(b.get("vs2_name"+i)));
                            }else if(meside==1){
                                enemylist.push(ansi_up.ansi_to_text(b.get("vs2_name"+i)));
                            }
                        }
                        target2["vs2_xdz"+i]=b.get("vs2_xdz"+i);
                        target2["vs2_kee"+i]=b.get("vs2_kee"+i);
                        target2["empty"]=0;
                        combat2[i-1]=target2;

                    }else if(b.get("vs2_pos"+i)==undefined){
                        target2={};
                        target2["empty"]=1;
                        combat2[i-1]=target2;
                    }
                }
            }else if(subType=="text"){//预留位置 以后可以判断
                //console.log(b.get("msg"));
                /*if (b.get("msg").match("你")!=null&&aboutme==0){//跟我有关
						for (var i=0;i<4;i++){
							if (b.get("msg").indexOf(enemylist[i])>=0){
								combattext=ansi_up.ansi_to_text(b.get("msg"));
								involewho=enemylist[i];
								enemyindex=i+1;
								console.log(involewho);
								aboutme=1;
								break;
							}
						}
						//console.log(enemyindex);

					}*/
                var mengyou1=alliancelist[0]
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                if(gSocketMsg.get_xdz()>3&&msg !==""&&msg.indexOf(mengyou1) == 0 && (msg.indexOf(mengyou1+"施展出九阳神功") == -1
                                                                                     || msg.indexOf(mengyou1+"运起太极神功") == -1|| msg.indexOf(mengyou1+"手脚无力") == -1
                                                                                     || msg.indexOf(mengyou1+"的招式尽数被") == -1|| msg.indexOf(mengyou1+"打了个寒颤") == -1
                                                                                     || msg.indexOf(mengyou1+"心神一动") == -1|| msg.indexOf(mengyou1+"使出一招「苦海无涯」") == -1
                                                                                     || msg.indexOf(mengyou1+"似乎受了点轻伤") == -1|| msg.indexOf(mengyou1+"手脚迟缓") == -1
                                                                                     || msg.indexOf(mengyou1+"这几招配合起来") == -1|| msg.indexOf(mengyou1+"受伤过重") == -1
                                                                                     || msg.indexOf(mengyou1+"身型微展") == -1|| msg.indexOf(mengyou1+"深深吸了几口气") == -1
                                                                                     || msg.indexOf(mengyou1+"心中默念") == -1|| msg.indexOf(mengyou1+"双目赤红") == -1)){
                    //console.log("第一盟友数据："+msg);
                    // 检测轻功绝学
                    if (g_obj_map.get("skill_button1")!=undefined)
                        skillbutton[0]=ansi_up.ansi_to_text(g_obj_map.get("skill_button1").get("name"));
                    else
                        skillbutton[0]=0;
                    if (g_obj_map.get("skill_button2")!=undefined)
                        skillbutton[1]=ansi_up.ansi_to_text(g_obj_map.get("skill_button2").get("name"));
                    else
                        skillbutton[1]=0;
                    if (g_obj_map.get("skill_button3")!=undefined)
                        skillbutton[2]=ansi_up.ansi_to_text(g_obj_map.get("skill_button3").get("name"));
                    else
                        skillbutton[2]=0;
                    if (g_obj_map.get("skill_button4")!=undefined)
                        skillbutton[3]=ansi_up.ansi_to_text(g_obj_map.get("skill_button4").get("name"));
                    else
                        skillbutton[3]=0;
                    if ($.inArray("万流归一", skillbutton)>-1 && $.inArray("幽影幻虚步", skillbutton)>-1 ){
                        qgcountor = 2;
                        qgtargetIndex[0]=$.inArray("万流归一", skillbutton)+1;
                        qgtargetIndex[1]=$.inArray("幽影幻虚步", skillbutton)+1;
                        //console.log('轻功绝学数量:'+qgcountor);
                    }
                    else if($.inArray("万流归一", skillbutton)>-1 || $.inArray("幽影幻虚步", skillbutton)==-1 ){
                        qgcountor = 1;
                        qgtargetIndex[0]=$.inArray("万流归一", skillbutton)+1;
                        //console.log('轻功绝学数量:'+qgcountor);
                    }
                    else if( $.inArray("万流归一", skillbutton)==-1 || $.inArray("幽影幻虚步", skillbutton)>-1 ){
                        qgcountor = 1;
                        qgtargetIndex[0]=$.inArray("幽影幻虚步", skillbutton)+1;
                        //console.log('轻功绝学数量:'+qgcountor);
                    }
                    if (gSocketMsg.get_xdz() >= 3&&qgcountor==1) {
                        clickButton('playskill '+qgtargetIndex[0]);
                    }
                    else if (gSocketMsg.get_xdz() >= 6&&qgcountor==2) {
                        clickButton('playskill '+qgtargetIndex[0]);
                        clickButton('playskill '+qgtargetIndex[1]);
                    }
                }
                /*
					if (combattext.match(involewho+"的招式并未有明显破绽")!=null||combattext.match("你的对攻无法击破")!=null){
							g_gmain.notify_fail(HIR+"你破招失败了！"+NOR);
						}*/

            }else if(subType=="playskill"){
                if (aboutme==1){
                    if (b.get("uid").split("-")[0]==me){//我的出招。问题是打向了谁？//combattext里已经预存了信息 可以利用
                        if (meattack==0){
                            if (meside==1){//
                                //console.log(enemyindex);
                                //document.getElementById("vs2"+enemyindex).style.border="thick solid green";
                            }else if(meside==2){
                                //console.log(enemyindex);
                                //document.getElementById("vs1"+enemyindex).style.border="thick solid green";
                            }
                            //g_gmain.notify_fail(HIG+"打击提示：你的攻击打向了"+RED+involewho+NOR);

                            meattack=1;

                        }
                    }
                    aboutme=0;
                }

            }else if(subType=="attack"){
                if (b.get("aid").split("-")[0]==me){	//我打中别人
                    meattack=0;
                    if (meside==1){//
                        document.getElementById("vs2"+enemyindex).style.border="0 solid green";
                    }else if(meside==2){
                        document.getElementById("vs1"+enemyindex).style.border="0 solid green";
                    }
                }
                //console.log((new Date()).valueOf());
            }else if(subType=="die"){
                //console.log((new Date()).valueOf());
            }else if(subType=="combat_result"){//清空存储
                fightflag=0;
                combat1=[{},{},{},{}];
                combat2=[{},{},{},{}];
                attackme=0;
                meattack=0;
                involewho="";
                meside=0;
                alliancelist=[];
                enemylist=[];
                aboutme=0;
                combattext="";
                engage=0;
                qgcountor=0;
            }
        }
    }
}

var godview=new GodView;


var fanjiTrigger=0;

var kuafuButton = document.createElement('button');
kuafuButton.innerText = '跨服抢坑';
//right0ButtonArray.push(kuafuButton);
kuafuButton.addEventListener('click', kuafuFunc);
var kuafuTrigger=0;
function kuafuFunc(){
    if (kuafuTrigger==0){
        kuafuButton.innerText = '停止抢坑';
        kuafuTrigger=1;
    }else if (kuafuTrigger==1){
        kuafuButton.innerText = '跨服抢坑';
        kuafuTrigger=0;
    }
}

//跨服天剑谷
var tianjianTrigger=0;
var killTJIntervalFunc =  null;
var path=[];
var tjfight=0;
var tjroomclear=0;
var preroomrandom="";
var direction=["west","east","south","north","southwest","southeast","northeast","northwest"];//八个方向
function tianjianmove(){
    var roominfo=g_obj_map.get("msg_room");
    if ((roominfo==undefined||tjroomclear==0)&&tianjianTrigger==1){//房间信息没有刷新，或者在战斗，或者房间内还有npc
        setTimeout(function(){tianjianmove();},1000);
    }else{
        //console.log(path);
        for (var i=0;i<8;i++){
            if (roominfo.get(direction[i])!=undefined){
                if ((roominfo.get(direction[i]).match("峡谷")==null&&(path.length<=10||Math.random()>0.4)) && (sessionStorage.getItem("boss") == "1")){//不包含峡谷两个字，为特殊房间
                    preroomrandom=roominfo.get("go_random");
                    tjroomclear=0;
                    path.push(g_obj_map.get("msg_room").get(direction[i]));
                    clickButton("go "+direction[i]); //移动到特殊房间
                    if (tianjianTrigger==1){
                        setTimeout(function(){tianjianmove();},1000);
                    }
                    return;
                } else if ((roominfo.get(direction[i]).match("峡谷")!=null) && (sessionStorage.getItem("boss") == "2")){
                    preroomrandom=roominfo.get("go_random");
                    tjroomclear=0;
                    path.push(g_obj_map.get("msg_room").get(direction[i]));
                    clickButton("go "+direction[i]); //移动到普通房间
                    if (tianjianTrigger==1){
                        setTimeout(function(){tianjianmove();},1000);
                    }
                    return;
                }
            }
        }
        //没有特殊房间，开始寻找普通房间
        for (var i=0;i<8;i++){
            if (roominfo.get(direction[i])!=undefined){
                if (path.indexOf(g_obj_map.get("msg_room").get(direction[i]))==-1){
                    path.push(g_obj_map.get("msg_room").get(direction[i]));
                    preroomrandom=roominfo.get("go_random");
                    tjroomclear=0;
                    clickButton("go "+direction[i],0);
                    if (tianjianTrigger==1){
                        setTimeout(function(){tianjianmove();},1000);
                    }
                    return;
                }
            }
        }
        preroomrandom=roominfo.get("go_random");
        var randomdirect=Math.round((Math.random()*7));
        while(roominfo.get(direction[randomdirect])==undefined){
            randomdirect=Math.round((Math.random()*7));
        }
        tjroomclear=0;
        clickButton("go "+direction[randomdirect],0);
        if (tianjianTrigger==1){
            setTimeout(function(){tianjianmove();},1000);
        }
    }
}
function tianjianGu(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        //console.log(type);console.log(subType);
        if (type=="vs"&&subType=="vs_info"){ //这是进入战斗的提示
            tjfight=1;
            ninesword();//放个绝学先
        }else if (type=="vs"&&subType=="combat_result"){//战斗结束 继续调取击
            tjfight=0;
            send("look_room\n");
        }
    }
}
function killtianjian(){
    var npclist=g_obj_map.get("msg_room");
    if ((tjfight==1)&&tianjianTrigger==1){
    }else{
        /*
			var boss = sessionStorage.getItem("boss");
			for (var i=1;i<12;i++){
				if (npclist.get("npc"+i)==undefined){
					break;
				}
				var tmp = npclist.get("npc"+i).split(",");
				if(tmp[1].indexOf("符兵") >= 0)
					continue;
				if (tmp[0]!="kuafu_tjgws"){
					if(boss == "1")
						continue;
					clickButton("kill "+npclist.get("npc"+i).split(",")[0]);
					break;
				}

			}
*/
        for (var i=1;i<12;i++){
            if (npclist.get("npc"+i)==undefined){
                break;
            }
            if (npclist.get("npc"+i).split(",")[0]!="kuafu_tjgws"&&npclist.get("npc"+i).split(",")[1].match("符兵")==null){
                clickButton("kill "+npclist.get("npc"+i).split(",")[0]);
                break;
            }
        }
        for (var i=1;i<12;i++){
            if (npclist.get("npc"+i)==undefined){
                tjroomclear=1;
                return;
            }
            if (npclist.get("npc"+i).split(",")[0]=="kuafu_tjgws"){
                //console.log("kill "+npclist.get("npc"+i).split(",")[0]);
                clickButton("kill "+npclist.get("npc"+i).split(",")[0]);
            }
            return;
        }
    }
}

var tianjian=new tianjianGu;

//循环点击
var xunhuandianji_int = null;
function xunhuandianji_func(){
    if(xunhuandianji_int == null){
        let s = prompt("请输入要点击的按钮","帮助天魔");
        g_gmain.recvNetWork2("循环点击开启，当前点击的是按钮是"+s);
        xunhuandianji_int = setInterval(xunhuandianji_int_func,200,s);
    }else{
        g_gmain.recvNetWork2("循环点击关闭");
        clearInterval(xunhuandianji_int);
        xunhuandianji_int = null;
    }
}
function xunhuandianji_int_func(name){
    if(fond_cmd(name)!=null){
        clickButton(fond_cmd(name));
    }
}
function fond_cmd(name){
    try{
        let return_text = "";
        for(let i=1;i<1000;i++){
            let text = "cmd"+i;
            try{
                if(g_obj_map.get("msg_room").get(text)!=undefined){
                    if(ansi_up.ansi_to_text(g_obj_map.get("msg_room").get(text+"_name"))==name){
                        return_text = g_obj_map.get("msg_room").get(text);
                        return return_text;
                    }
                }else{
                    break;
                }
            }catch(e){}
        }
        return null;
    }catch(e){}
}

/*****帮副&刷碎片start*******/
var TianJianNPCList = ["天剑", "天剑真身", "虹风", "虹雨","虹雷", "虹电",
                       "镇谷神兽", "镇山神兽", "镇殿神兽", "镇潭神兽","守谷神兽",
                       "守山神兽", "守殿神兽", "守潭神兽","饕餮幼崽", "螣蛇幼崽",
                       "应龙幼崽","幽荧幼崽", "饕餮兽魂", "螣蛇兽魂", "应龙兽魂",
                       "幽荧兽魂", "幽荧王","饕餮王", "螣蛇王", "应龙王","饕餮分身",
                       "螣蛇分身", "应龙分身","幽荧战神","饕餮战神", "螣蛇战神", "应龙战神"];
var pathSenlin = ['look_room;w', 'look_room;w', 'look_room;w', 'e;e;e;e', 'look_room;e', 'look_room;e', 'w;w;w;s', /*一层*/
                  'look_room;w', 'look_room;w', 'look_room;w', 'e;e;e;e', 'look_room;e', 'look_room;e', 'w;w;w;s',  /*二层*/
                  'look_room;w', 'look_room;w', 'look_room;w', 'e;e;e;e', 'look_room;e', 'look_room;e', 'w;w;w;s', /*三层*/
                  'look_room;w', 'look_room;w', 'look_room;w', 'e;e;e;e', 'look_room;e', 'look_room;e', 'w;w;w;s', /*四层*/
                  'look_room;w', 'look_room;w', 'look_room;w', 'e;e;e;e', 'look_room;e', 'look_room;e', 'w;w;w;s'];/*五层*/

var bangfuTrigger=0;
var bangfuKilling=false;
var bangfuTimer=null;
var skillsTimer=null;
var currentStep = 0;
function bangfuFunc(){
    if (bangfuTrigger==0){
        //currentStep = 0;
        bangfuTrigger=1;
        clearInterval(bangfuTimer);
        bangfuTimer=setInterval(autoKill,500);
    }else if (bangfuTrigger==1){
        bangfuTrigger=0;
        clearInterval(bangfuTimer);
        clearInterval(skillsTimer);
    }
}


//领队自动------------------------------------------------------------------
var lianZhaoSkill = ["无剑之剑",'九幽棍魔',"月夜鬼萧","打狗棒法","火贪一刀","小李飞刀","披罗紫气","天魔策","天刀八诀","天外飞仙","朝天一棍","温候戟舞","天雷落","神龙东来","玉石俱焚","燎原百击","冰月破魔枪"];
var Learder = 0,gzhao = 0,gzsetTime=null;
function LearderFunc(){
    if (Learder == 0 ){
        currentStep = 0;
        Learder =1;
    }else if (Learder == 1){
        Learder =0;
    }
}
var neigongPlayCount=0;
var isGenzhao = 0;

function bangfuDo(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        let xdz = gSocketMsg.get_xdz()
        //console.log(type);console.log(subType);
        if (type=="vs"&&subType=="text" ){
            //console.log(type);console.log(subType);
            if (b.get("msg")==undefined){return;}
            if(isGenzhao == 1 || xdz<3){
                return;
            }

            var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
            var genzhaoSkill='';
            for(i=0;i<lianZhaoSkill.length;i++){
                if(msg.indexOf(lianZhaoSkill[i])>=0){
                    //console.log('跟招 '+new Date().getTime())
                    isGenzhao = 1;
                    genzhaoSkill = lianZhaoSkill[i];
                    ninesword61(1)
                    setTimeout(function(){isGenzhao=0},500)
                    return;
                }
            }
            /*
				if(xdz>=8){
					//console.log('补招'+new Date().getTime())
					isGenzhao = 1;
					ninesword61()
					setTimeout(function(){isGenzhao=0},1000)
				}
				*/
        }else if (type=="vs"&&subType=="combat_result"){//战斗结束 继续调取击
            neigongPlayCount=0;
            clickButton("look_room");
            var mapinfor=g_obj_map.get("msg_room").get("map_id");
            if(mapinfor=='shenshousenlin' && Learder==1){
                go(pathSenlin[currentStep++]);
                //console.log("当前step："+ currentStep);
                if (currentStep>=pathSenlin.length)
                    currentStep=0;
            }
            clearInterval(skillsTimer);
            bangfuKilling=false;
        }
    }
}

function autoSkill(){
    if(gSocketMsg.get_xdz()<3){
        return;
    }
    //出内功
    if(+g_obj_map.get("msg_attrs").get("kee")/+g_obj_map.get("msg_attrs").get("max_kee")<0.3 && neigongPlayCount<3){
        //var neigong=["生生造化功","紫血大法","易筋经神功","八荒功","葵花宝典","紫霞神功","天邪神功","不动明王诀"];
        var neigong=["生生造化功","紫血大法"];
        for (var i=1;i<=4;i++){
            if(g_obj_map.get("skill_button"+i)!=undefined&&$.inArray(ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name")),neigong)>-1){
                clickButton('playskill '+i,0);
                neigongPlayCount++;
                return;
            }
        }
    }
    //江湖攻击技能
    var jianghu=["九溪断月枪","燎原百破","排云掌法","飞刀绝技","孔雀翎","雪饮狂刀","翻云刀法","九天龙吟剑法","覆雨剑法","织冰剑法","如来神掌","玄天杖法","千影百伤棍"];
    for (var i=1;i<=4;i++){
        if(g_obj_map.get("skill_button"+i)!=undefined&&$.inArray(ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name")),jianghu)>-1){
            clickButton('playskill '+i,0);
            return;
        }
    }
    //随便出一个
    //clickButton('playskill 1',0);
}
function autoSkill1(){
    //if(neigongPlayCount>=3 && +g_obj_map.get("msg_attrs").get("force")/+g_obj_map.get("msg_attrs").get("max_force")<0.2){
    //逃跑回坑
    //	escapeStart1();
    //}
    if(gSocketMsg.get_xdz()<3){
        return;
    }
    //出内功
    if(+g_obj_map.get("msg_attrs").get("kee")/+g_obj_map.get("msg_attrs").get("max_kee")<0.5 && neigongPlayCount<3){
        //var neigong=["生生造化功","紫血大法","易筋经神功","八荒功","葵花宝典","紫霞神功","天邪神功","不动明王诀"];
        var neigong=["生生造化功","紫血大法"];
        for (var i=1;i<=4;i++){
            if(g_obj_map.get("skill_button"+i)!=undefined&&$.inArray(ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name")),neigong)>-1){
                clickButton('playskill '+i,0);
                neigongPlayCount++;
                return;
            }
        }
    }
    var jianghu=["九溪断月枪","燎原百破","排云掌法","飞刀绝技","孔雀翎","雪饮狂刀","翻云刀法","九天龙吟剑法","覆雨剑法","织冰剑法","如来神掌","玄天杖法","千影百伤棍"];
    /*//江湖攻击技能
		var jianghu=["飞刀绝技","孔雀翎","雪饮狂刀","翻云刀法","九天龙吟剑法","覆雨剑法","织冰剑法","排云掌法","如来神掌"];
		for (var i=1;i<=4;i++){
			if(g_obj_map.get("skill_button"+i)!=undefined&&$.inArray(ansi_up.ansi_to_text(g_obj_map.get("skill_button"+i).get("name")),jianghu)>-1){
				clickButton('playskill '+i,0);
				return;
			}
		}*/
    //随便出一个
    //clickButton('playskill 1',0);
}

function autoKill(){
    //send("look_room\n");
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    if(healtriger==1){
        return;
    }
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (TianJianNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[0].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        //console.log("准备杀目标NPC名字：" + targetNPCListHere[0].innerText + "，代码：" + targetCode +"，目标列表中序号：");
        clickButton('kill ' + targetCode); // 点击杀人
        bangfuKilling=true;
        //clearInterval(bangfuTimer);
        //setTimeout(detectKillTianJianInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
    /*setTimeout(function(){
			if(healtriger==1){
				return;
			}
			var npclist=g_obj_map.get("msg_room");
			if (npclist!=undefined && npclist.get("npc1")!=undefined && npclist.get("npc1").split(",")[1].match("符兵")==null){
				clickButton("kill "+npclist.get("npc1").split(",")[0],0);
				bangfuKilling=true;
				clearInterval(bangfuTimer);
			}
		},200)*/
}

var bangfu=new bangfuDo;
/****帮副end****/

/**循环比试start**/
var qiecuoIterval = null;
function fightQiecuo(){
    let objs = g_obj_map.get('msg_room')
    if(!g_gmain.is_fighting){
        for(let i=0;i<objs.keys().length;i++){
            let n=objs.keys()[i]
            //console.log(n)
            if(n.substr(0,3)=='npc' || n.substr(0,4)=='user'){
                let npc = objs.get(n);
                let ll = npc.split(',')
                //console.log(g_simul_efun.replaceControlCharBlank(ll[1]))
                if(Enemy == g_simul_efun.replaceControlCharBlank(ll[1])){
                    clickButton('fight '+ll[0])
                    //console.log('找到了'+ll[0])
                    return;
                }
            }
        }
    }
}
/**循环比试end**/

// 杀敌人----------------------------------------------------------------------------------------------------------------
var killEnemyIntervalFunc =  null;
var currentNPCIndex = 0;

function killEnemy(){
    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    getEnemyTargetCode();

	if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
		currentNPCIndex = 0;
		console.log('杀人一次！');
		$('span:contains(胜利)').text('');
		//$('span:contains(战败了)').text('');
		clickButton('golook_room');
	}

}
function killNpc(name){
    let objs = g_obj_map.get('msg_room')
    if(!g_gmain.is_fighting){
        for(let i=0;i<objs.keys().length;i++){
            let n=objs.keys()[i]
            if(n.substr(0,3)=='npc'){
                let npc = objs.get(n);
                let ll = npc.split(',')
                if(name == g_simul_efun.replaceControlCharBlank(ll[1])){
                    clickButton('kill '+ll[0])
                    return;
                }
            }
        }
    }
}
function getEnemyTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        let npcname = peopleList[i].innerText.toString();

        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (peopleList[i].innerText.toString().match(sessionStorage.getItem("Enemy")) != null){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (currentNPCIndex >= targetNPCListHere.length){
        currentNPCIndex = 0;
    }

    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        //console.log("准备杀目标敌人名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillEnemyInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillEnemyInfo(){
    var EnemyInfo = $('span').text();
    if (EnemyInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        currentNPCIndex = currentNPCIndex + 1;
    }
    else if (EnemyInfo.slice(-5) == "先饶了吧。")
    {
        currentNPCIndex = currentNPCIndex + 1;
    }
    else if (EnemyInfo.slice(-6) == "明天继续吧。")
    {
        currentNPCIndex = currentNPCIndex + 1;
    }
    else if (EnemyInfo.slice(-7) == "荣威镖局任务。")
    {
        currentNPCIndex = currentNPCIndex + 1;
    }
    else{
        currentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

// 杀坏人----------------------------
var HongMingNPCList =["无『双』公主","天魔真身","攻楼死士","[一]镇擂斧将","[21-25区]恶棍", "[21-25区]流寇", "[21-25区]剧盗","[21-25区]云老四", "[21-25区]岳老三","[21-25区]二娘","[21-25区]段老大", "[21-25区]墟归一","[21-25区]上官晓芙","[21-25区]洪昭天"];
var killHongMingIntervalFunc =  null;
var currentNPCIndex = 0;
var killHongMingTargetFlg = 0;

function killHongMingTargetFunc(){
    zdskill =  null;
    if (killHongMingTargetFlg == 0){
        currentNPCIndex = 0;
        console.log("开始杀红名目标NPC！");
        skillLists = mySkillLists;
        killHongMingTargetFlg = 1;
        killHongMingIntervalFunc = setInterval(killHongMing, 200);

    }else{
        console.log("停止杀红名目标NPC！");
        killHongMingTargetFlg = 0;
        clearInterval(killHongMingIntervalFunc);
    }
}

function killHongMing(){
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));

    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    if ((AutoRecoverFlg == 1 && kee==max_kee && force>max_force*0.9) || AutoRecoverFlg == 0)
    {
        getHongMingTargetCode();
    }
    /*
	if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
		currentNPCIndex = 0;
		console.log('杀人一次！');
		$('span:contains(胜利)').text('');
		//$('span:contains(战败了)').text('');
		clickButton('prev_combat');
	}
	*/
}

function getHongMingTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (HongMingNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (currentNPCIndex >= targetNPCListHere.length){
        currentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        //console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillHongMingInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillHongMingInfo(){
    var HongMingInfo = $('span').text();
    if (HongMingInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        currentNPCIndex = currentNPCIndex + 1;
    }else{
        currentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};


// 杀好人----------------------------
var HuangMingNPCList = ["不『二』剑客","守楼虎将","[一]镇擂斧将","年兽","[21-25区]王铁匠", "[21-25区]杨掌柜", "[21-25区]柳绘心", "[21-25区]柳小花", "[21-25区]卖花姑娘","[21-25区]刘守财","[21-25区]朱老伯","[21-25区]方老板", "[21-25区]客商","[21-25区]方寡妇","[21-25区]花落云","[21-25区]辰川","[21-25区]王世仲","[21-25区]无一" , "天剑", "天剑真身", "虹风", "虹雨","虹雷", "虹电", "天剑谷卫士" , "镇谷神兽", "镇山神兽", "镇殿神兽", "镇潭神兽","守谷神兽",
                        "守山神兽", "守殿神兽", "守潭神兽","饕餮幼崽", "螣蛇幼崽",
                        "应龙幼崽","幽荧幼崽", "饕餮兽魂", "螣蛇兽魂", "应龙兽魂",
                        "幽荧兽魂", "幽荧王","饕餮王", "螣蛇王", "应龙王","幽荧战神","饕餮战神", "螣蛇战神", "应龙战神",
                        "铁狼军","银狼军","金狼军","金狼将","十夫长","百夫长","濯缨剑士","对影剑士","月幽剑士","夏花剑士",
                        "采菊童子","欢喜罗汉","魔郡主","血斧客","龙山徒","纵横圣使","千夜暗影","天梵僧","贰壹刀客","紫神将","快活居士",
                        "血剑客","白骨秀士","鬼杀","幽冥鬼杀","绛衣杀手","绛衣剑客"];
var killHuangMingIntervalFunc =  null;
var currentNPCIndex = 0;
var killHuangMingTargetFlg = 0;

function killHuangMingTargetFunc(){
    zdskill =  null;
    if (killHuangMingTargetFlg == 0){
        currentNPCIndex = 0;
        console.log("开始杀好人目标NPC！");
        skillLists = mySkillLists;
        killHuangMingTargetFlg = 1;
        killHuangMingIntervalFunc = setInterval(killHuangMing, 200);
    }else{
        console.log("停止杀好人目标NPC！");
        killHuangMingTargetFlg = 0;
        clearInterval(killHuangMingIntervalFunc);
    }
}

function killHuangMing(){
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));

    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    if ((AutoRecoverFlg == 1 && kee==max_kee && force>max_force*0.9) || AutoRecoverFlg == 0)
    {
        getHuangMingTargetCode();
    }
    /*
	if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
		currentNPCIndex = 0;
		console.log('杀人一次！');
		$('span:contains(胜利)').text('');
		//$('span:contains(战败了)').text('');
		clickButton('prev_combat');
	}
	*/
}
function getHuangMingTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (HuangMingNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (currentNPCIndex >= targetNPCListHere.length){
        currentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        //console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillHuangMingInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillHuangMingInfo(){
    var HuangMingInfo = $('span').text();
    if (HuangMingInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        currentNPCIndex = currentNPCIndex + 1;
    }else{
        currentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

// 杀全服坏人----------------------------
var qfHongMingNPCList =["段老大","二娘","岳老三","云老四"];
var qfkillHongMingIntervalFunc =  null;
var qfcurrentNPCIndex = 0;
var qfkillHongMingTargetFlg = 0;

function qfkillHongMingTargetFunc(){
    zdskill =  null;
    if (qfkillHongMingTargetFlg == 0){
        qfcurrentNPCIndex = 0;
        console.log("开始杀全服坏人目标NPC！");
        skillLists = mySkillLists;
        qfkillHongMingTargetFlg = 1;
        qfkillHongMingIntervalFunc = setInterval(qfkillHongMing, 200);

    }else{
        console.log("停止杀全服坏人目标NPC！");
        qfkillHongMingTargetFlg = 0;
        clearInterval(qfkillHongMingIntervalFunc);
    }
}

function qfkillHongMing(){
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));

    if ($('span').text().slice(-7) == "不能杀这个人。"){
        qfcurrentNPCIndex = qfcurrentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    if ((AutoRecoverFlg == 1 && kee==max_kee && force>max_force*0.9) || AutoRecoverFlg == 0)
    {
        qfgetHongMingTargetCode();
    }
    /*
	if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
		qfcurrentNPCIndex = 0;
		console.log('杀人一次！');
		$('span:contains(胜利)').text('');
		clickButton('prev_combat');
	}
	*/
}
function qfgetHongMingTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (qfHongMingNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (qfcurrentNPCIndex >= targetNPCListHere.length){
        qfcurrentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[qfcurrentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        //console.log("准备杀目标NPC名字：" + targetNPCListHere[qfcurrentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (qfcurrentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(qfdetectKillHongMingInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function qfdetectKillHongMingInfo(){
    var HongMingInfo = $('span').text();
    if (HongMingInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        qfcurrentNPCIndex = qfcurrentNPCIndex + 1;
    }else{
        qfcurrentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

// 杀全服好人----------------------------

var qfHuangMingNPCList = ["王铁匠", "杨掌柜","柳绘心", "柳小花", "卖花姑娘","刘守财","朱老伯","方老板", "客商","方寡妇", "无一","铁二","追三","冷四", "红衣捕快","黄衣捕快","锦衣捕快"];
var qfkillHuangMingIntervalFunc =  null;
var qfcurrentNPCIndex = 0;
var qfkillqfHuangMingTargetFlg = 0;

function qfkillqfHuangMingTargetFunc(){
    zdskill =  null;
    if (qfkillqfHuangMingTargetFlg == 0){
        qfcurrentNPCIndex = 0;
        console.log("开始杀全服好人目标NPC！");
        skillLists = mySkillLists;
        qfkillqfHuangMingTargetFlg = 1;
        qfkillHuangMingIntervalFunc = setInterval(qfkillHuangMing, 200);
    }else{
        console.log("停止杀全服好人目标NPC！");
        qfkillqfHuangMingTargetFlg = 0;
        clearInterval(qfkillHuangMingIntervalFunc);
    }
}

function qfkillHuangMing(){
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));

    if ($('span').text().slice(-7) == "不能杀这个人。"){
        qfcurrentNPCIndex = qfcurrentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    if ((AutoRecoverFlg == 1 && kee==max_kee && force>max_force*0.9) || AutoRecoverFlg == 0)
    {
        qfgetHuangMingTargetCode();
    }
    /*
	if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
		qfcurrentNPCIndex = 0;
		console.log('杀人一次！');
		$('span:contains(胜利)').text('');
		clickButton('prev_combat');
	}
	*/
}

function qfgetHuangMingTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (qfHuangMingNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (qfcurrentNPCIndex >= targetNPCListHere.length){
        qfcurrentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[qfcurrentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        //console.log("准备杀目标NPC名字：" + targetNPCListHere[qfcurrentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (qfcurrentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(qfdetectKillHuangMingInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function qfdetectKillHuangMingInfo(){
    var HuangMingInfo = $('span').text();
    if (HuangMingInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        qfcurrentNPCIndex = qfcurrentNPCIndex + 1;
    }else{
        qfcurrentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

function FollowLeader(){//帮本三中间大路专用跟随队长函数
    let vs_hp11 = $("#vs_hp11").children().children().text();
    if(vs_hp11 == "" || vs_hp11 == 0){
        var peopleList = $(".cmd_click3");
        var countor= 0;
        for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
            let npcname = peopleList[i].innerText.toString();
            if (peopleList[i].innerText.toString().match(sessionStorage.getItem("Leader")) != null){
                countor = countor +1;
                Learderflg = 0;//找到了，Learderflg清零
            }
        }
        if (countor == 0)
        {
            Learderflg = Learderflg + 1; //一次找不到，Learderflg+1
            if (Learderflg > 1) // 两次找不到，确定队长不在，走人
            {
                Learderflg = 0;
                overrideclick("go north");
            }
        }
    }

    if (BB3flg == 1)
    {
        setTimeout(FollowLeader,500); //如果开着帮三跟杀，500ms后继续检查队长是否在场景中
    }
}

/**秘境最优化**/
var mijingTrigger=0;
function mijingFunc(){
    /*
		var roominfor=g_obj_map.get("msg_room").get("map_id");
		var mijingid=["tianlongshan","dafuchuan","fomenshiku","dilongling","luanshishan","lvzhou","taohuadu","炼丹室","daojiangu","binhaigucheng","baguamen","lvshuige","langhuanyudong","shanya","wujinshenyuan","qiaoyinxiaocun","nanmanzhidi","fengduguicheng","duzhanglin"];
		if (mijingid.indexOf(roominfor)==-1){
			g_gmain.notify_fail(HIR+"当前秘境不支持优化。"+NOR);
			return;
		}else{




		}
		*/
}
function startOptimize(roominfor){
    /*
		var promt=g_obj_map.get("msg_prompt");
		console.log(roominfor);
		if (roominfor=="langhuanyudong"){
					overrideclick("go northwest");
					overrideclick("event_1_92817399");
					overrideclick("go west");
					overrideclick("event_1_91110342");
					overrideclick("go south");
					overrideclick("event_1_74276536");
					overrideclick("go southeast");
					overrideclick("event_1_14726005");
					overrideclick("go southwest");
					overrideclick("event_1_66980486");
					overrideclick("go northwest");
					overrideclick("event_1_39972900");
					overrideclick("go northwest");
					overrideclick("event_1_61689122");
					overrideclick("go west");
					overrideclick("event_1_19336706");
					overrideclick("go south");
					overrideclick("event_1_30457951");
					overrideclick("go southwest");
					overrideclick("event_1_96023188");
					overrideclick("go south");
			return;
		}
		if (promt==undefined){
			setTimeout(function(){startOptimize(roominfor)},500);
		}else{
			var msg=promt.get("msg");
			var zhuguo=parseInt(msg.split("朱果")[1].split("。")[0].split("x")[1]);
			if (zhuguo==0){
				alert("当前扫荡出错了。");
				return;
			}else{
				console.log("目前朱果为:"+zhuguo);
				if (roominfor=="daojiangu"){
					if (zhuguo>=1535){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="taohuadu"){
					if (zhuguo>=1785){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="lvshuige"){
					if (zhuguo>=1255){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="lvzhou"){
					if (zhuguo>=2035){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="luanshishan"){
					if (zhuguo>=2350){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="dilongling"){
					if (zhuguo>=2385){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="fomenshiku"){
					if (zhuguo>=2425){

						clickButton(roominfor+'_saodang go',0);

					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="dafuchuan"){
					if (zhuguo>=3050){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="tianlongshan"){
					if (zhuguo>=3100){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="baguamen"){
					if (zhuguo>=3635){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="shanya"){
					if (zhuguo>=2920){
						clickButton('event_1_97070517 go',0);
					}else{
						clickButton('event_1_97070517',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="wujinshenyuan"){
					if (zhuguo>=2980){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="qiaoyinxiaocun"){
					if (zhuguo>=2980){
						clickButton('event_1_26314975 go',0);
				}else{
						clickButton('event_1_26314975',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="nanmanzhidi"){
					if (zhuguo>=3890){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="duzhanglin"){
					if (zhuguo>=2910){
						clickButton('event_1_30944031 go', 0);
					}else{
						clickButton('event_1_30944031', 0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="liandanshi"){
					if (zhuguo>=2920){
						clickButton('event_1_99063572 go',0);
					}else{
						clickButton('event_1_99063572',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="fengduguicheng"){
					if (zhuguo>=3860){
						clickButton(roominfor+'_saodang go',0);
					}else{
						clickButton(roominfor+'_saodang',0);
						setTimeout(function(){startOptimize(roominfor)},500);
					}
				}else if (roominfor=="binhaigucheng"){
				if (zhuguo>=3300){
					clickButton(roominfor+'_saodang go',0);
				}else{
					clickButton(roominfor+'_saodang',0);
					setTimeout(function(){startOptimize(roominfor)},500);
				}
			}else if (roominfor=="yaowanggu"){
				if (zhuguo>=5920){
					clickButton('event_1_18864573 go', 0);
				}else{
					clickButton('event_1_18864573', 0);
					setTimeout(function(){startOptimize(roominfor)},500);
				}
			}else if (roominfor=="leichishan"){
				if (zhuguo>=5920){
					clickButton('event_1_32379200 go', 0);
				}else{
					clickButton('event_1_32379200', 0);
					setTimeout(function(){startOptimize(roominfor)},500);
				}
			}else if (roominfor=="langhuanyudong"){
				if (zhuguo>=2910){
					clickButton('event_1_74168671 go', 0);
				}else{
					clickButton('event_1_74168671', 0);
					setTimeout(function(){startOptimize(roominfor)},500);
				}
			}else if (roominfor=="dixiamigong"){
				if (zhuguo>=2910){
					clickButton('event_1_3668752 go', 0);
				}else{
					clickButton('event_1_3668752', 0);
					setTimeout(function(){startOptimize(roominfor)},500);
				}
			}
		}
	}*/
}
function mijingProtection(){
    if(g_obj_map.get("msg_room")==undefined || g_obj_map.get("msg_room").get("map_id")==undefined){
        return true;
    }
    send("look_room\n");
    var roominfor=g_obj_map.get("msg_room").get("map_id");
    var mijingid=["tianlongshan","dafuchuan","fomenshiku","dilongling","luanshishan","lvzhou","taohuadu","daojiangu","binhaigucheng","baguamen","lvshuige","langhuanyudong","shanya","wujinshenyuan","qiaoyinxiaocun","nanmanzhidi","fengduguicheng"];
    if (mijingid.indexOf(roominfor)>-1){
        g_gmain.notify_fail(HIR+"又手抖了？该戒撸了！！！"+NOR);
        return false;
    }
    return true;

}

var jiaozheng=0;
var jzstamp=0;
var killlock=0;
function kuafulistener(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="vs"&&subType=="out_watch"){ //这是离开观战进入战斗的提示
            kuafuTrigger=0;
            kuafuButton.innerText = '跨服抢坑';
        }else if(type=="vs"&&subType=="attack"){//文字有刷新，那么就意味着我可能是在观战，如果stopqiang为0 那么我就是在观战
            //所以每次有text进来都有可能有一个玩家滚蛋。 我们就在这判断。
            var targetnpc=g_obj_map.get("msg_npc").get("id");//获取目标NPC的 id
            var fighting=g_obj_map.get("msg_vs_info");
            if (fighting.get("vs1_pos1")==targetnpc){
                //先检查我们自己进没进战斗
                for (var i=2;i<=8;i++){
                    if(fighting.get("vs2_pos"+i)==b.get("uid")){//npc 在vs1一号位 从2号位开始记录玩家ID
                        //clickButton("kill "+targetnpc);
                        break;
                    }
                }
            }else if(fighting.get("vs2_pos1")==targetnpc){
                for (var i=2;i<=8;i++){
                    if(fighting.get("vs1_pos"+i)==b.get("uid")){//npc 在vs2一号位 从2号位开始记录玩家ID
                        //clickButton("kill "+targetnpc);
                        break;
                    }
                }
            }
        }else if (type=="vs"&&subType=="add_xdz"){

            var targetnpc=g_obj_map.get("msg_npc").get("id");//获取目标NPC的 id
            if (b.get("uid")==targetnpc){
                setTimeout(function(){clickButton("kill "+targetnpc);},950);
                setTimeout(function(){clickButton("kill "+targetnpc);},1950);
            }

        }
    }
}
var jzstart=0;
function jztime(){
    jzstart=1;
    jzstamp=(new Date()).valueOf();
    send('kill 9527\n');//校正命令 无意义
    setTimeout(jztime,6000);//每隔一分钟校正一次 网络状况
}
var yanchi=0;
function jztimerec(){
    this.dispatchMessage = function(b) {
        var type = b.get("type"), subType=b.get("subtype");
        if (type=="notice"&&subType=="notify_fail"){
            if (b.get("msg").match("这儿没有这个人")!=null){
                jzstart=0;
                console.log("校正延迟");
                yanchi=((new Date()).valueOf()-jzstamp)/2;
                console.log("延迟计算:"+yanchi);
            }
        }
    }
}
var jz=new jztimerec;
var kuafu=new kuafulistener;
function kuafuqiang(){
    if (stopqiang==0){
        //setTimeout(function(){kuafuqiang();},100);// 循环抢坑
    }else{
        return;
    }
}
// 试剑----------------------------
var ShiJianFlg = 0;
function ShiJianFunc(){
    if(ShiJianFlg == 0){
        clickButton('swords');
        clickButton('swords select_member xiaoyao_tonglao');   //天山童姥
        clickButton('swords select_member taoist_zhangtianshi');  //张天师
        clickButton('swords select_member mingjiao_zhang');   //张教主
        clickButton('swords fight_test go');
        ShiJianFlg = 1;
    }
    else{
        ShiJianFlg = 0;
    }

}

// 打排行榜----------------------------
var PaiHangFlg = 0;
function PaiHangFunc(){
    if(PaiHangFlg == 0){
        //if(jianghuling >=3){
        go2('items use obj_jianghuling')
        go2('items use obj_jianghuling')
        go2('items use obj_jianghuling')
        //}

        go2('home');
        go2('fight_hero 1');
        PaiHangFlg = 1;
    }
    else{
        PaiHangFlg = 0;
    }
}

// 整理包裹----------------------------------------------------
var od_ar;
var go_arst;
var od;
var go_st;
var go_delay_def = 150;
var go_delay = 150;
var nextgo = function() {};
var go_time;
var go_bb = function(a) {
    go_reset();
    if (a != undefined) {
        od_ar = a.split("|");
        od = od_ar[0].split(";")
    }
    go_time = setTimeout(go_step, go_delay)
};

function go_reset() {
    clearTimeout(go_time);
    od_ar = [];
    go_arst = 0;
    go_st = 0;
    od = []
}

var gofast = function(a) {
    var d = a.split(";");
    for (var i = 0; i < d.length; i++) clickButton(d[i], 0)
};

function go_step() {
    if (go_st < od.length) {
        console.debug("开始执行：", od[go_st]);
        clickButton(od[go_st], 0);
        go_st++;
        if (go_st % 3 == 0) {
            go_time = setTimeout(go_step, go_delay)
        } else {
            go_time = setTimeout(go_step, go_delay)
        }
    } else {
        go_arst++;
        if (go_arst < od_ar.length) {
            go_st = 0;
            od = [];
            od = od_ar[go_arst].split(";");
            nextdo = go_step;
            setTimeout(checkbusy, go_delay)
        } else {
            go_delay = go_delay_def;
            go_time = setTimeout(nextgo, 300);
            nextgo = function() {}
        }
    }
}

function go_rp(a, n) {
    go_reset();
    for (var i = 0; i < n; i++) {
        od[i] = a
    }
    go_time = setTimeout(go_step, go_delay)
}

var clb_time;

//金狮盾宝玉甲苍狼护臂青鸾护臂翎眼赤护玄武盾月光宝甲衣红光匕天寒匕无心匕星河剑沧海护腰貂皮斗篷隐龙纹臂夜行披风虎皮腰带破军盾金丝甲疯魔杖毒龙鞭玉清棍生死符霹雳掌套血屠刀残雪帽残雪戒残雪鞋残雪手镯残雪项链金丝宝甲衣';
//软猬甲墨玄掌套陨铁盾孔雀氅烈日棍屠龙刀残阳棍倚天剑金狮盾碧磷鞭月光宝甲明月帽明月鞋墨磷腰带明月戒明月项链西毒蛇杖明月手镯宝玉甲扬文
var items_sell2 = '白凤丸白金戒指白金手镯白色劲服白色圣衣板斧冰魄银针吹雪残云带吹雪残云巾吹雪残云靴吹雪残云衣点钢枪断水剑符咒亮银枪芦苇绿色圣衣蛮刀猛虎战甲梦里拨雾剑梦里望月剑梦里寻梦剑魔剑炼魂牛皮靴怒龙锦胄三环禅杖珊瑚白菜石锁天剑铜号小猪耳朵邪剑穿灵银丝鞋中级刀法技巧猪上肉紫花瓣儿大青树叶狼牙棒青铜斧轻红罗衣全真道袍纱裙石斧水烟阁司事褂水烟阁司事帽水烟阁武士氅鲜红金乌冠鲜红锦衣妖刀狗屠长剑闪避基础虎皮腰带天寒匕貂皮斗篷白玉腰束无心匕玄武盾破军盾金狮盾月光宝甲沧海护腰夜行披风红光匕金丝甲羊毛斗篷金丝甲疯魔杖毒龙鞭玉清棍生死符霹雳掌套血屠刀无心锤八角锤咒剑王□三清神冠七星翻云靴粗布鹅黄袍虞姬剑大光明经红色绸裙麻衣漫天花雨匕银丝帽天怒斧青色丝袍真武剑船桨白金项链断云斧乌夷长裙红色绸裙包子大剪刀黑水伏蛟帝王剑麻布手套银丝帽吴钩绵裙铜钹大刀紫袍铁笛圣火令绿罗裙绣花针清心散垓下刀紫金杖阿拉伯弯刀青锋剑青布袍淑女剑紫霜血蝉衣软金束带穿花蛇影鞋魔鞭翩珑大红僧袍九环禅杖精铁棒暗灵桃木剑横断钩银丝链甲衣天魔刀玉竹杖叫化鸡七星剑逆钩匕银丝甲天寒帽天寒戒天寒鞋天寒项链天寒手镯软甲衣金刚杖飞羽剑斩空刀拜月掌套金弹子新月棍白蟒鞭硫磺木戟黑袍粗布白袍长戟回旋镖拂尘松子白色棋子黑色棋子竹节鞭白棋子木叉银色丝带波斯长袍铁鞭竹刀长虹剑窄裉袄灵芝锦衣台夷头巾毛毯废焦丹废药渣台夷头巾粉红绸衫岩鸽灰雁野山鸡麻雀瑶琴维吾尔族长袍旧书桃符纸木锤木钩竹鞭木刀木枪木剑彩巾彩靴彩帽彩带彩镯彩衣砍刀绣花鞋舞蝶彩衫军刀铁扇剑割鹿刀大理雪梨圆领小袄皮帽弯月刀兔肉粗磁大碗羊肉串天山雪莲青铜盾禅杖金刚罩丝质披风暗箭青葫芦松子铁斧水蜜桃蓑衣破弯刀柴刀丝衣长鞭道德经布裙钢丝甲衣牛皮带制服金刚杖斩空刀拜月掌套金弹子新月棍白蟒鞭-草莓玉蜂浆玉蜂蜜蜂浆瓶豆浆蛋糕菠菜粉条包裹鸡叫草水密桃--新月棍银簪重甲羊角匕梅花匕日月神教腰牌船篙-丝绸马褂白缨冠白色长袍蛇杖鬼头刀拐杖古铜缎子袄裙大环刀鹿皮手套丝绸衣羊毛裙牧羊鞭牛皮酒袋麻带钢剑钢杖藤甲盾长斗篷军袍破披风木盾铁盾锦缎腰带鞶革青色道袍水草破烂衣服鹿皮小靴青绫绸裙粗布衣草帽草鞋布鞋精铁甲-柳玉刀玉竹剑钢刀戒刀单刀长剑长枪铁锤木棍轻罗绸衫兽皮鞋皮鞭铁棍飞镖匕首细剑绣鞋绣花小鞋狼皮雪靴金戒金手镯铁戒银戒铁手镯银手镯铁项链银项链铁戒布衣怒火浪心剑玄苏剑单刀刀法基础剑术进阶拆招基础天师道袍布衣鸡叫草七星翻云靴黑狗血银翅金簪铜鼓搏斗基础棍法基础闪避进阶道德经拆招进阶金算盘黄衣军服灰色道袍黑布袍黑棋子中级拆招技巧格斗进阶剑术基础獐腿肉狂风鞭';
var items_clear=0;
var items_sell="",
    //var items_sell='废料废药渣',
    items_store=
    "『秘籍木盒』冰影仙露云梦青汤圆驻颜丹月饼白糖罂荔枝妃子笑荔枝桂味荔枝糯米糍荔枝三月红荔枝锦鲤银龙鱼金龙鱼白金龙鱼雷龙鱼血龙鱼天龙鱼王神匠宝箱九转神花种子秘籍木盒周年礼券两周年礼券瑞雪针扣长生石双旦礼券金矿矿髓银矿矿髓宝石矿矿髓玄重铁鱼竿鱼饵玄铁令高级乾坤袋武穆遗书狗年礼券『隐武竹笺』烧香符空识卷轴鎏金黑玉锥冰月羽暗香灯盏百宜雪梅彼岸花采掘许可（地）采掘许可（天）苍山绿雪苍梧洞参藏宝图朝开暮落花抽奖券大原石毒琥珀风花琼酿高级突破秘术古树大红袍黑枣冰糖葫芦技能链搭配秘籍鲫鱼金刚舍利金瓜贡茶金矿石九转金丹九转神丹君山银针君影草开元宝票昆仑火莲雷龙鱼鲤鱼莲蓬凌霄花凌云白毫六安瓜片龙火藤鹿茸秘籍木盒普通锦袋奇香迷醉散巧果儿山楂冰糖葫芦上古锻火尸丹矢车菊天魔场秘籍天魔焚身秘籍铁观音突破加速卡忘忧草武夷岩茶舞鸢尾夕雾草西湖龙井西陵虫草熙颜花仙客来小加速突破卡邪帝舍利修炼室基础提速卡修炼室中级提速卡玄铁重剑雪英野猪血银矿石银丝锦袋云梦香盏中原石竹叶青醉仙灵芙丸百年灵草百年紫芝大还丹顶级狂暴补丸顶级乾坤补丸高级大还丹高级狂暴丹高级乾坤再造丹狂暴丹灵草千年灵草千年紫芝乾坤再造丹顶级大还丹特级大还丹特级狂暴丹特级乾坤再造丹万年灵草万年紫芝小还丹紫芝",
    items_use="包月分身卡茶叶惊喜礼包茶叶礼盒2倍周打坐卡寒玉床加速周卡周年英雄令周年热血令风云宝箱神秘宝箱神鸢宝箱青凤纹绶热血令",
    items_splite="残雪帽残雪戒残雪鞋残雪手镯残雪项链金丝宝甲衣翎眼赤护青鸾护臂苍狼护臂宝玉甲星河剑",
    items_study = '御蜂术左手兵刃研习',
    items_useonce = '力贯九天丸不动如山丹血气罡天丹神准一眼丸逍遥游龙丹万寿灵桃玄冰寒露丸薄暮幽影丹神准一眼丸血气罡天丹力贯九天丸不动如山丹逍遥游龙丹无尽真元丸碧波春水丹地灵康复丸风驰电掣散金刚霸体丸药罐';
//清包代码
function clearBag(x=0){clickButton("items",0);setTimeout(function (){clearitem(x)},1800)}
function clearitem(x=0){
    clearTrigger();
    cmdDelayTime = 300;
    if(g_obj_map.get('msg_items') == undefined){
        //clickButton("items",0);gSocketMsg2.show_items(0);setTimeout(function (){clearitem(x)},1000)
        return;
    }
    var c=g_obj_map.get('msg_items').elements
    var y = 0,f;
    if(0 < c.length){
        for(var a=0;a<c.length;a++){
            if(c[a].key.indexOf('items')>=0){
                var temp;
                if(Array.isArray(c[a].value))
                    temp = c[a].value;
                else
                    temp = c[a].value.split(',');
                //console.log(temp[1])
                var b=g_simul_efun.replaceControlCharBlank(temp[1]),
                    d=parseInt(temp[2]),
                    e=temp[0];
                b=b.trim()
                //console.log(b)
                if(-1!=items_use.indexOf(b)){
                    f = d;
                    for(j=0;j<Math.floor(f/10000);j++)
                        cmdCache.push('items use '+e+'_N_10000')
                    f = f%10000;
                    for(j=0;j<Math.floor(f/1000);j++)
                        cmdCache.push('items use '+e+'_N_1000')
                    f = f%1000;
                    for(j=0;j<Math.floor(f/100);j++)
                        cmdCache.push('items use '+e+'_N_100')
                    f = f%100;
                    for(j=0;j<Math.floor(f/50);j++)
                        cmdCache.push("items use "+e+"_N_50");
                    f=f%50;
                    for(j=0;j<Math.floor(f/10);j++)
                        cmdCache.push("items use "+e+"_N_10");
                    f=f%10;
                    for(j=0;j<f%10;j++)
                        cmdCache.push("items use "+e);
                }
                else if(-1!=items_store.indexOf(b)){
                    cmdCache.push("items put_store "+e);
                }
                else if(
                    (items_clear==0 && items_sell.indexOf(b)>=0)
                    ||(items_clear==1 && -1!=items_sell2.indexOf(b))
                ){
                    f = d;
                    for(j=0;j<Math.floor(f/10000);j++)
                        cmdCache.push('items sell '+e+'_N_10000')
                    f = f%10000;
                    for(j=0;j<Math.floor(f/1000);j++)
                        cmdCache.push('items sell '+e+'_N_1000')
                    f = f%1000;
                    for(j=0;j<Math.floor(f/100);j++)
                        cmdCache.push('items sell '+e+'_N_100')
                    f = f%100;
                    for(j=0;j<Math.floor(f/50);j++)
                        cmdCache.push("items sell "+e+"_N_50");
                    f=f%50;
                    for(j=0;j<Math.floor(f/10);j++)
                        cmdCache.push("items sell "+e+"_N_10");
                    f=f%10;
                    for(j=0;j<f%10;j++)
                        cmdCache.push("items sell "+e)
                }
                else if(-1!=items_splite.indexOf(b)){
                    f = d;
                    for(j=0;j<Math.floor(f/1000);j++)
                        cmdCache.push('items splite '+e+'_N_1000')
                    f = f%1000;
                    for(j=0;j<Math.floor(f/100);j++)
                        cmdCache.push('items splite '+e+'_N_100')
                    f = f%100;
                    for(j=0;j<Math.floor(f/50);j++)
                        cmdCache.push("items splite "+e+"_N_50");
                    f=f%50;
                    for(j=0;j<Math.floor(f/10);j++)
                        cmdCache.push("items splite "+e+"_N_10");
                    f=f%10;
                    for(j=0;j<f%10;j++)
                        cmdCache.push("items splite "+e);
                }//合成宝石
                else if(x==1 && d>=3 && -1!= b.indexOf('宝石') && -1== b.indexOf('皇帝') && -1== b.indexOf('天神')){
                    nextFun = function(){clearBag(1)}
                    f = d
                    for(j=0;j<Math.floor(f/300);j++)
                        cmdCache.push('items hecheng '+e+'_N_100')
                    f = f%300
                    for(j=0;j<Math.floor(f/150);j++)
                        cmdCache.push('items hecheng '+e+'_N_50')
                    f = f%150
                    for(j=0;j<Math.floor(f/90);j++)
                        cmdCache.push('items hecheng '+e+'_N_30')
                    f = f%90
                    for(j=0;j<Math.floor(f/30);j++)
                        cmdCache.push('items hecheng '+e+'_N_10')
                    f = f%30
                    for(j=0;j<Math.floor(f/3);j++)
                        cmdCache.push('items hecheng '+e+'_N_1')
                    y = 1
                    break
                }//合成玉
                else if( x==1 && d>=7 &&(-1!=b.indexOf("】璞玉")||-1!=b.indexOf("】青玉")||-1!=b.indexOf("】墨玉"))){
                    nextFun = function(){clearBag(1)}
                    f = d
                    for(j=0;j<Math.floor(f/700);j++)
                        cmdCache.push('hhjz hecheng_ys '+e+'_N_100')
                    f = f%700
                    //for(j=0;j<Math.floor(f/70);j++)
                    cmdCache.push('hhjz hecheng_ys '+e+'_N_'+Math.floor(f/70)+'0')
                    f = f%70
                    for(j=0;j<Math.floor(f/7);j++)
                        cmdCache.push('hhjz hecheng_ys '+e+'_N_1')
                    y = 1
                    break
                }else if (items_study.indexOf(b) != -1) {
                    for (j = 0; j < d; j++) {
                        cmdCache.push('study ' + e)
                    }
                }else if (x != 1 && items_useonce.indexOf(b) != -1) {
                    f = d;
                    for(j=0;j<Math.floor(f);j++)
                        cmdCache.push('items use ' + e)
                }else if(x == 0 && (-1!=b.indexOf("宝石")||-1!=b.indexOf("璞玉")||-1!=b.indexOf("青玉")||-1!=b.indexOf("墨玉")||-1!=b.indexOf("白玉")||-1!=b.indexOf("残页")||(-1!=b.indexOf("碎片") && -1==b.indexOf("玄铁"))||-1!=b.indexOf("钥匙")||-1!=b.indexOf("宝箱"))){
                    cmdCache.push("items put_store "+e)
                }
                /*else if(items_clear ==1 && (
						-1!=b.indexOf("中级")||-1!=b.indexOf("进阶")||-1!=b.indexOf("劲服")||-1!=b.indexOf("\u5439\u96ea")||-1!=b.indexOf("\u5723\u8863")
						)
					)
						for(j=0;j<d;j++)
							cmdCache.push("items sell "+e)
						*/
            }
        }
        if(x == 1 && y==0){
            console.log('合成完毕，存仓库')
            nextFun = function(){clearBag(0)}
        }
        cmdCache.push("prev");
        delayCmd2();
    }
}


//  四大绝杀------------------------------------------------------------------------------------------------------
function Juesha(){ // 四大绝杀
    if(!mijingProtection()){
        return;
    }
    GoJuesha();
}
function GoJuesha(){
    go("jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n;");
}
//  十八木人------------------------------------------------------------------------------------------------------
function Muren(){ // 十八木人
    if(!mijingProtection()){
        return;
    }
    GoMuren();
}
function GoMuren(){
    go("jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;");
}
//  出关礼包------------------------------------------------------------------------------------------------------
function Poshi(){ // 出关礼包
    if(!mijingProtection()){
        return;
    }
    GoPoshi();
}
function GoPoshi(){
    go("jh 1;w;event_1_79135363;event_1_36858443");
}
//  苗疆主线------------------------------------------------------------------------------------------------------
function miao(){ // 苗疆主线

    miao();
}
function miao(){
    go("jh 40;s;s;s;s;w;w;w;ask miaojiang_miaosanjin;e;e;e;e;s;se;sw;s;sw;e;ask miaojiang_qiaofu;e;sw;se;sw;se;");
}
//  闻香寻芳------------------------------------------------------------------------------------------------------
function Xunhua(){ // 闻香寻芳
    if(!mijingProtection()){
        return;
    }
    GoXunhua();
}

function GoXunhua(){
    go("jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw");
}
//  佳人觅香------------------------------------------------------------------------------------------------------
function Jiaren(){ // 佳人觅香
    if(!mijingProtection()){
        return;
    }
    GoJiaren();
}
function GoJiaren(){
    go("jh 32;n;n;se;e;s;s;look_npc murong_azhu;event_1_99232080;e;e;s;e;s;e;e;e;look_npc murong_fangling;event_1_2207248");
}
//  破障除魔------------------------------------------------------------------------------------------------------
function PoZhangChuMo(){ // 破障除魔
    if(!mijingProtection()){
        return;
    }
    go2('daily go 21;event_1_85535721')
    //		GoPoZhangChuMo();
}
function GoPoZhangChuMo(){
    go("jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590;event_1_85535721");
}
//  大乘忘武------------------------------------------------------------------------------------------------------
function DaChengWangWu(){ // 破障除魔
    if(!mijingProtection()){
        return;
    }
    go2('daily go 22;event_1_71997825')
    //GoDaChengWangWu();
}
function GoDaChengWangWu(){
    go("jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457;event_1_71997825");
}
// 苗疆炼药 ------------------------------------------------------------------------------------------------------
function Miaojianglianyao(){ // 苗疆炼药
    if(!mijingProtection()){
        return;
    }
    GoToCanglangjiang();
}
function GoToCanglangjiang(){
    go("jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;event_1_8004914");
    GoToLianyaoshi();
}
function GoToLianyaoshi(){
    if(!hasGoToEnd()){
        setTimeout(GoToLianyaoshi,300);
        return;
    }
    if(g_obj_map.get("msg_room").get("short")!="澜沧江南岸"){
        GoToCanglangjiang();
    }else{
        go("se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;lianyao");
        DoLianyao();
    }
}
function DoLianyao(){
    if(!hasGoToEnd()){
        setTimeout(DoLianyao,300);
        return;
    }
    setTimeout(LianYaoIt,400);
}

function LianYaoIt(){
    return;
    if ($('span:contains(炼药需要毒琥珀和毒藤胶，你还没有)').length>0)		{
        go('shop money_buy mny_shop9_N_10;shop money_buy mny_shop10_N_10;lianyao');
        $('span:contains(炼药需要毒琥珀和毒藤胶，你还没有)').text("炼药需要毒琥珀和毒藤胶，刚买了10组")
        setTimeout(LianYaoIt, 2000);
    }else if($('span:contains(炼药的丹炉已经是滚得发烫)').length>0){
        clickButton('home');
    }else{
        clickButton('lianyao');
        setTimeout(LianYaoIt, 2000);
    }
}
//  天山打坐------------------------------------------------------------------------------------------------------
function TianShanDaZuo(){ // 天山打坐
    if(!mijingProtection()){
        return;
    }
    go2('daily go 20;event_1_34855843')
}


// 大招壁画 ------------------------------------------------------------------------------------------------------
var DaZhaoBiHuastep=0;
function DaZhaoBiHua(){ // 大招壁画
    if(!mijingProtection()){
        return;
    }
    overrideclick('jh');
    if (g_obj_map.get("msg_jh_list")==undefined){
        setTimeout(function(){DaZhaoBiHua();},500);
    }else{
        go("jh 26;w;w;n;w;w;w");
        gobihua();

    }
}
var directions=["west","east","north","south","northwest","northeast","southwest","southeast"];
var bihuataopaoTrigger=0;
function gobihua(){
    if(!g_obj_map.get("msg_room")){
        setTimeout(function(){gobihua();},500);
    }else if(cmdlist.length>0){
        setTimeout(function(){gobihua();},100);
    }else if(g_obj_map.get("msg_room").get("short")=="阴山密林"||g_obj_map.get("msg_room").get("short")=="狼山"){
        bihuataopaoTrigger=1;
        for(var i=0;i<directions.length;i++){
            if(g_obj_map.get("msg_room").get(directions[i])=="阴山密林"){
                overrideclick("go "+directions[i]);
                break;
            }
        }
        gobihua();
    }else if(g_obj_map.get("msg_room").get("short")=="阴山古刹"){
        DaZhaoBiHua();
    }else if(g_obj_map.get("msg_room").get("short")=="狼山"){//头狼不杀人后遗症
        DaZhaoBiHua();
    }else if(g_obj_map.get("msg_room").get("short")=="阴山岩画"){
        bihuataopaoTrigger=0;
        go('event_1_12853448;home');
        setTimeout(function(){ShiJianFunc();},5000);
    }else{
        setTimeout(function(){gobihua();},500);
    }
}
var bihuataopaoTimer=null;
function Bihuataopao(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="vs"&&subType=="vs_info"){ //这是进入战斗的提示
            Bihuataopaoescapeloop();
            clearInterval(bihuataopaoTimer);
            setTimeout(autoSkill,500);
            bihuataopaoTimer=setInterval(autoSkill,1000);
        }else if (type=="vs"&&subType=="combat_result"){
            clearInterval(bihuataopaoTimer);
            DaZhaoBiHua();
        }
    }
}
function Bihuataopaoescapeloop(){
    neigongPlayCount=0;
    overrideclick('escape', 0) //循环逃跑判定
    if (bihuataopaoTrigger==1)
        setTimeout(function(){Bihuataopaoescapeloop();},500);
}
var bihuataopao=new Bihuataopao();


// 跨本1自动 ---------------------------
function kuaben1(){
    if(!mijingProtection()){
        return;
    }
    go2('fb 1;w;s;e;kill jiwutan_jiwutandizi;e;kill jiwutan_shiergongmenren;e;e;e;nw;w;kill jiwutan_jiwutandizi;ne;kill jiwutan_shiergongmenren;sw;nw;'
        +'kill jiwutan_shiergongmenren;nw;kill jiwutan_tianhai;se;se;ne;se;kill jiwutan_kunpeng;nw;sw;nw;e;kill jiwutan_xuetong;w;ne;kill jiwutan_zuifa;'
        +'sw;w;kill jiwutan_jinxi;e;se;ne;n;kill jiwutan_yinbao;s;ne;kill jiwutan_shouxu;sw;e;kill jiwutan_xiaori;w;nw;kill jiwutan_diehun;se;sw;nw;n;'
        +'kill jiwutan_huokuang;s;sw;kill jiwutan_dianxing;ne;se;ne;w;kill jiwutan_daoxing;e;sw;event_1_40536215;kill jiwutan_sanlaoshicong;n;kill jiwutan_sanlaoshicong;'
        +'n;kill jiwutan_sanlaoshicong;s;w;kill jiwutan_sanlaoshicong;e;e;kill jiwutan_sanlaoshicong;w;event_1_63703896;kill jiwutan_jiwusheng');
}

// 跨本2自动 ---------------------------
function kuaben2(){
    if(!mijingProtection()){
        return;
    }
    go2('fb 2;s;e;e;e;e;s;event_1_78544045;w;kill shiwanmiaozhai_fanjiangjiao;s;kill shiwanmiaozhai_gubuming;event_1_89737948;nw;kill shiwanmiaozhai_heimiaozhanshen;'
        +'se;ne;kill shiwanmiaozhai_shengushi;sw;s;kill shiwanmiaozhai_yuewuxin;n;event_1_25832680;w;n;e;e;s;s;w;w');
}


// 跨本3自动 ---------------------------
function kuaben3(){
    if(!mijingProtection()){
        return;
    }
    go2("fb 3;kill zhenwuwendao_duizewushi;n;kill zhenwuwendao_genshanwushi;n;kill zhenwuwendao_lihuowushi;n;kill zhenwuwendao_kanshuiwushi;n;kill zhenwuwendao_zhenleiwushi;"
        +"n;kill zhenwuwendao_xunfengwushi;n;kill zhenwuwendao_kundiwushi;n;kill zhenwuwendao_qiantianwushi;n;kill zhenwuwendao_houtushi;n;kill zhenwuwendao_liehuoshi;"
        +"n;kill zhenwuwendao_heishuishi;n;kill zhenwuwendao_qingmushi;n;kill zhenwuwendao_ruijinshi;event_1_26550007;kill zhenwuwendao_jiuwushenjiang;"
        +"fb 3;#12 n;event_1_92918916;kill zhenwuwendao_jiuwuxuannv;event_1_42015129;kill zhenwuwendao_taijizhenren;open_box")
}

// 团建自动 ---------------------------
function tuanjian(){
    if(!mijingProtection()){
        return;
    }
    //teamjob.nextjob = function(){
    teamjob.nextjob = function(){
        teamjob.nextjob = function(){
            teamjob.nextjob = function(){}
            youming11();
            youming11();
        }
        teamjob.go(1)
    }
    teamjob.go(2)
    //}
    //teamjob.go(5)
}

function richangFB(){
    ben10();
    youming11();
    ben10();
    youming11();
    tiejian();
    yanwang10();
    //zangjian15();
    baiyuan();
    gedou50();
}

function youming11(){ // 后院自动
    if(!mijingProtection()){
        return;
    }
    go2("jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145 ymsz_houyuan;se;kill ymsz_houyuan_guisha;se;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_guisha;"
        +"w;kill ymsz_houyuan_youmingguisha;e;e;kill ymsz_houyuan_youmingguisha;w;s;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_guisha;w;kill ymsz_houyuan_youmingguisha;"
        +"e;e;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_youmingguisha;n;e;kill ymsz_houyuan_guisha;e;kill ymsz_houyuan_guisha;n;kill ymsz_houyuan_youmingguisha;s;e;kill ymsz_houyuan_guisha;"
        +"e;kill ymsz_houyuan_guisha;n;kill ymsz_houyuan_shiyouming");
}

function youming10(){//花园自动
    if(!mijingProtection()){
        return;
    }
    go2('jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145 ymsz_huayuan;e;kill ymsz_huayuan_baiguxiushi;e;kill ymsz_huayuan_baiguxiushi;ne;kill ymsz_huayuan_baiguxiushi;'
        +'nw;kill ymsz_huayuan_xuejianke;se;ne;kill ymsz_huayuan_baiguxiushi;ne;kill ymsz_huayuan_xuejianke;sw;se;kill ymsz_huayuan_baiguxiushi;se;kill ymsz_huayuan_baiguxiushi;e;kill ymsz_huayuan_xuejianke;'
        +'w;sw;kill ymsz_huayuan_baiguxiushi;sw;kill ymsz_huayuan_baiguxiushi;se;kill ymsz_huayuan_xuejianke;nw;sw;kill ymsz_huayuan_baiguxiushi;sw;kill ymsz_huayuan_yuwenxiufenshen'
       )
}

//前院自动
function youming9(){ // 前院自动
    if(!mijingProtection()){
        return;
    }
    go2("jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145 ymsz_qianyuan;e;kill ymsz_qianyuan_jiangyishashou;e;kill ymsz_qianyuan_jiangyishashou;"
        +"n;kill ymsz_qianyuan_jiangyijianke;s;s;kill ymsz_qianyuan_jiangyijianke;n;e;kill ymsz_qianyuan_jiangyishashou;e;kill ymsz_qianyuan_jiangyishashou;ne;kill ymsz_qianyuan_jiangyijianke;"
        +"sw;s;kill ymsz_qianyuan_jiangyishashou;s;kill ymsz_qianyuan_jiangyishashou;s;kill ymsz_qianyuan_jiangyishashou;e;kill ymsz_qianyuan_jupeng");
}

//本9自动
function ben9(){
    if(!mijingProtection()){
        return;
    }

    go2("fb 9;kill tianshanlongxue_jianyingfenshen;n;kill tianshanlongxue_jianlangfenshen;n;kill tianshanlongxue_jianbaofenshen;n;kill tianshanlongxue_jianmangfenshen;n;kill tianshanlongxue_jianfeifenshen;n;kill tianshanlongxue_jianshenfenshen");
}
//自动南瓜
function NGMZ1(){
    go2("rank go 237;nw;n;n;n;n;n;n;n;nw;nw;n;kill tianlongsi_baikaixin;mst白开心");//

}

function ben10(){
    go2('fb 10;event_1_31980331;kill sizhanguangmingding_jumuqijiang;fb 10;event_1_23348240;kill sizhanguangmingding_hongshuiqijiang;fb 10;event_1_84015482;kill sizhanguangmingding_ruijinqijiang;'
        +'fb 10;event_1_25800358;kill sizhanguangmingding_houtuqijiang;event_1_24864938;kill sizhanguangmingding_kunlunjianke;'
        +'fb 10;event_1_31980331;event_1_98378977;kill sizhanguangmingding_liehuoqijiang;event_1_5376728;kill sizhanguangmingding_emeijiannv;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;event_1_5914414')
}

function baiyuan(){
    go2('jh 50;ne;ne;#3 n;#3 ne;#3 n;items get_store /obj/snmf/bianhuan;event_1_86676244')
}

function tiejian(){
    go2('jh 47,ne,n,n,n,ne,ne,e,e,e,e,ne,n,ne,n,n,n,n,n,nw,nw,ne,n,ne,n,event_1_10117215')
}

function zangjian15(){
    go2('rank go 222;event_1_92368450;kill zangjiangu_wangchongyang;event_1_16117859')
}

function yanwang10(){
    go2('rank go 220;event_1_42827171;kill yanwangshidian_zhuanlunwang;event_1_45876452')
}

function gedou50(){
    go2('jh 49;#5 n;w;w;n;event_1_23520182;event_1_70249808 go 50')
}

//日常潜能
function CheckIn4(){
    if(!mijingProtection()){
        return;
    }
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    g_gmain.notify_fail(HIG+"开始领取日常潜能"+NOR);
    nextFun = function(){setTimeout(getXZT,1000)}
    //鳄鱼
    go2('jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911');
    //大招
    go2('jh 26;w;w;n;e;e;event_1_18075497;w;w;n;event_1_14435995');
    //侠客岛
    //go2('jh 36;yell;e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543');

    //冰月
    go2('jh 14;w;n;n;n;n;event_1_32682066;event_1_52117466;kill bingyuegu_baiyishaonv;event_1_65929969;kill bingyuegu_xuanwujiguanshou;'
        +'event_1_17623983;event_1_41741346;kill bingyuegu_jiuyoumoling;s;kill bingyuegu_xianrenfenshen;s');
    //fb6
    go2('team quit;team create;fb 6;event_1_8221898;kill changleweiyang_shaofuqing;fb 6;event_1_18437151;kill changleweiyang_yulinwei;fb 6;event_1_74386803;kill changleweiyang_wunvling;s')
    //fb7
    //go2('fb 7;event_1_20980858;kill heishuihuangling_duanlongfuwei;fb 7;event_1_81463220;kill heishuihuangling_jinchuilishi;fb 7;event_1_5770640;kill heishuihuangling_zhongjiamaoshi;fb 7;event_1_56340108;kill heishuihuangling_daxiashenjian;event_1_21387224;s;kill heishuihuangling_jinchuihujiang;s;event_1_94902320')
}

function getXZT(){//冰火玄重铁
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    TriggerFuc = function(b){
        var type = b.get('type'),msg=b.get('msg'),subtype = b.get('subtype');
        if(type == 'notice' ){
            if(msg.indexOf('看起来火麒麟王想杀死你') > -1)
                clickButton('escape', 0)
            else if(msg.indexOf('逃跑失败')>-1 || msg.indexOf('频繁临阵脱逃')>-1)
                setTimeout(clickButton,1000,'escape')
        }else if(type == 'vs' &&  subtype == 'combat_result'){
            clickButton('w', 0)
        }else if(type == 'jh' && b.get("obj_p") == 3902){
            clearTrigger();
            nextFun = function(){setTimeout(goTSqixia,1000)}
            go2('nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo')
        }
    }
    go2('jh 35;nw;nw;nw;n;ne;nw;w');
}

function goTSqixia(){
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    nextFun = function(){setTimeout(function(){cecj.x=1;cecj.goAsk()},3000)}
    //天山七侠
    go2('jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;ne;ne;nw;nw;event_1_37376258;l');
}

function Mjly1Func(x=0){
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    if(g_obj_map.get('msg_jh_list') == undefined){
        clickButton('jh')
        setTimeout(function(){Mjly1Func(x)},1000)
        return;
    }
    if(g_obj_map.get('msg_jh_list').get('finish40') == 0){
        console.log('未解锁苗疆')
        return;
    }
    nextFun = function(){setTimeout(function(){Mjly2Func(x)},2000)};
    go2('jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;0_event_1_8004914;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w');
}

var lianyaoInterval = null
function  Mjly2Func(x=0){
    //console.log('苗疆2')
    //console.log(x)
    TriggerFuc = function(b){
        if(b.get('type')=='notice'){
            if(b.get('msg').indexOf('你还没有药材')>-1){
                clickButton('shop money_buy mny_shop9_N_10', 0)
                clickButton('shop money_buy mny_shop10_N_10', 0)
            }else if(b.get('msg').indexOf('明天再来吧')>-1){
                console.log('炼药结束')
                clearInterval(lianyaoInterval)
                clearTrigger()
                if(x == 1) dcww()
            }
        }
    }
    clearInterval(lianyaoInterval)
    lianyaoInterval = setInterval(function(){clickButton('lianyao')},2000)
}

var rcTime = null;
function dcww(){
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    go2('daily go 22;event_1_71997825;event_1_10395181')
    rcTime = setTimeout(pzcm,5*60000)
}
function pzcm(){
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    nextFun= function(){
        ButtonManager.resetButtonById("CheckIn1");
        answerTrigger=1;
        if(zhuangyuantie >=2){
            clickButton('items use obj_zhuangyuantie')
            clickButton('items use obj_zhuangyuantie')
        }
        answerQuestions();
    }

    go2('daily go 21;event_1_85535721')
}

function jobnums(job){
    var nums,tmp;
    if(job.indexOf('saodang_fb')>=0){
        if(g_obj_map.get('msg_vip').get(job))
            tmp = Number(g_obj_map.get('msg_vip').get(job).split(',')[2])
        else
            return 0;
    }
    else
        tmp = Number(g_obj_map.get('msg_vip').get(job))
    return nums = Math.floor(tmp/1000) - tmp%1000
}

//一键VIP
function shimenvipFunc(){
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    if(!g_obj_map.get('msg_vip')){
        clickButton('vip')
        setTimeout(shimenvipFunc,1000)
        return;
    }
    var vip = Number(g_obj_map.get('msg_vip').get('vip_tm'))
    if(vip == 0){
        console.log('无vip')
        swordsGo();
        return;
    }
    var i=0;
    nextFun = function(){
        setTimeout(swordsGo,1000)
    }

    go2('home;vip drops');//通勤
    for (i = 0; i < jobnums('family_quest_count'); i++) { //师门 family_quest_count
        go2('vip finish_family');
    };

    //帮派 clan_quest_count
    for (i = 0; i < jobnums('clan_quest_count'); i++) {
        go2('vip finish_clan');
    };

    //谜题暴击10次 do_task_num
    /*
		var tmp = jobnums('do_task_num')
		if(tmp > 10) tmp=10
		for (i = 0; i < tmp; i++) {
			go2('vip finish_big_task');
		}
*/
    //挖宝10次
    for (i = 0; i < jobnums('finish_dig'); i++) {
        go2('vip finish_dig');
    }

    //钓鱼10次
    for (i = 0; i < jobnums('finish_diaoyu'); i++) {
        go2('vip finish_diaoyu');
    }

    //独龙寨
    for (i = 0; i < jobnums('saodang_fb_1'); i++) {
        go2('vip finish_fb dulongzhai');
    }
    //军营	junying
    for (i = 0; i < jobnums('saodang_fb_2'); i++) {
        go2('vip finish_fb junying');
    }
    //北斗	beidou
    for (i = 0; i < jobnums('saodang_fb_3'); i++) {
        go2('vip finish_fb beidou');
    }
    //幽灵	youling
    for (i = 0; i < jobnums('saodang_fb_4'); i++) {
        go2('vip finish_fb youling');
    };
    //本5
    for (i = 0; i < jobnums('saodang_fb_5'); i++) {
        go2('vip finish_fb siyu');
    };
    //本6
    for (i = 0; i < jobnums('saodang_fb_6'); i++) {
        go2('vip finish_fb changleweiyang');
    };
    //本7
    for (i = 0; i < jobnums('saodang_fb_7'); i++) {
        go2('vip finish_fb heishuihuangling');
    };
    //本8
    for (i = 0; i < jobnums('saodang_fb_8'); i++) {
        go2('vip finish_fb jiandangfenglingdu');
    };
    //本9
    for (i = 0; i < jobnums('saodang_fb_9'); i++) {
        go2('vip finish_fb tianshanlongxue');
    };
    //本10
    for (i = 0; i < jobnums('saodang_fb_10'); i++) {
        go2('vip finish_fb sizhanguangmingding');
    };
    for (i=0; i<2; i++)
    {
        go2('clan fb go_saodang longwulianmoge');//帮本3 2次
    }
}

var sjfight = function(){
    clearTrigger()
    setTimeout(function(){
        TriggerFuc = function(b){
            if(b.get('type') == 'vs' && b.get('subtype') == 'combat_result'){
                clickButton('swords fight_test go')
            }else if(b.get('type') == "notice" && (b.get('msg').indexOf('你今天试剑次数已达限额')>-1 || b.get('msg').indexOf('不可试剑')>-1 )){
                clearTrigger()
                CheckIn4()
            }
        }
        clickButton('swords fight_test go')
    },1000);
}
var swordon=1;
function swordsGo() {
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    console.log('试剑')
    swordon = 1;
    TriggerFuc = function(b){
        if(swordon != 1)
            return;
        var targetNPCListHere = []
        var countor = 0
        var targetCode
        var npcid_temp
        var npc_name
        var find = 0;
        if(b.get('type') == "notice" && b.get('msg').indexOf('无法报名了')>-1){
            console.log('无法报名了')
            clearTrigger()
            CheckIn4()
        }
        else if(b.get('type') == 'swords' && b.get('subtype') == 'main' ){
            if(b.get('next_swords_try'))
            {
                sjfight()
            }else if(b.get('reported')){
                if(b.get('reported')!= 1)
                    clickButton('swords report go')
                sjfight()
            }
        }
    }
    go2('home;swords;swords report go;swords select_member xiaoyao_tonglao;swords select_member taoist_zhangtianshi;swords select_member mingjiao_zhang')
}

//签到、礼包
function CheckIn1(){
    if(!mijingProtection()){
        return;
    }

    g_gmain.notify_fail(HIG+"开始领取签到、奖励和礼包"+NOR);
    nextFun = function(){
        setTimeout(function(){libao.n=0;libao.start()},1000)
    }
    //分享奖励
    go2('items get_store /obj/shop/jianghuling;items get_store /obj/shop/shimenling;items get_store /obj/shop/bangpailing;items get_store /obj/shop/zhuangyuantie;items');
    go2('home;sort fetch_reward;fudi houshan fetch;fudi juxian fetch_zhuguo')
    go2('vip;share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 6;share_ok 7;exercise stop;exercise');
    //任务奖励
    go2("work click maiyi;work click xuncheng;work click datufei;work click dalei;work click kangjijinbin;work click zhidaodiying;work click dantiaoqunmen;work click shenshanxiulian;work click jianmenlipai;work click dubawulin; work click youlijianghu;work click yibangmaoxian;work click zhengzhanzhongyuan");
    go2('public_op3'); // 向师傅磕头
    go2('cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu axe get_all;xueyin_shenbinggu spear get_all;xueyin_shenbinggu hammer get_all;xueyin_shenbinggu stick get_all;xueyin_shenbinggu whip get_all;xueyin_shenbinggu staff get_all');//爬楼奖励
    //vip

    go2('vip;vip drops');//VIP福利
    go2('vip finish_family');//VIP师门
    go2('vip finish_clan');//VIP帮派
    go2('vip finish_fb dulongzhai');//副本1扫荡
    go2('vip finish_fb junying');//副本2扫荡
    go2('vip finish_fb beidou');//副本3扫荡
    go2('vip finish_fb youling');//副本4扫荡
    go2('vip finish_fb siyu');//副本5扫荡
    go2('vip finish_fb changleweiyang');//副本6扫荡
    go2('vip finish_fb heishuihuangling');//副本7扫荡
    go2('vip finish_fb jiandangfenglingdu');//副本8扫荡
    go2('vip finish_fb tianshanlongxue');//副本9扫荡
    go2('vip finish_fb sizhanguangmingding');//副本10扫荡
    go2('vip finish_sort');//排行榜立即完成
    go2('vip finish_dig');//挖宝立即完成
    go2('vip finish_diaoyu');//钓鱼立即完成
    go2('jh 1;event_1_76648488;');//潜龙礼包
    //吃药
    go2('items use obj_jiuhuayulouwan;');//吃九花丸
    go2('items use obj_xuanbingbihuojiu;');//玄冰碧火酒-白
    go2('items use obj_xuanbingbihuojiu1;');//玄冰碧火酒-彩
    go2('items use obj_yuanxiao;');//元宵
    go2('items use changan_yunmengqing;');//云梦青
    go2('items use obj_qiaoguoer;');//巧果儿
    go2('items use obj_niangao;');//年糕
    go2('items use obj_labazhou;');//腊八粥
    go2('items use obj_baicaomeijiu;');//百草美酒
    go2('exercise;');//打坐睡床
    go2('shop money_buy mny_shop2_N_10;');//买引路蜂
    go2('fudi juxian fetch_zhuguo;');//游侠朱果
    go2('fudi houshan fetch;');//府邸资源
    //帮派上香
    for(j=0;j<20;j++)
        go2('clan incense yx');//线香
    for(j=0;j<20;j++)
        go2('clan incense jx');//檀香
    for(j=0;j<5;j++)
        go2('clan incense cx');//元宝香


}
var libao={
    n:0,
    place:'',
    path:'',
    npcList:[],
    code:'',
    List:[
        {
            place:'御街南',
            path:'jh 17;n',
        },
        {
            place:'中院',
            path:'#3 n;w;w;w',
        },
        {
            place:'饮风客栈',
            path:'jh 1',
        },
        {
            place:'书房',
            path:'wsnjc clan;wsnjc user;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;event_1_60133236;e;e;n',
            //顺便领李火狮
        },
        {
            place:'天龙八部',
            path:'jh 1;#5 w;n',
        },
        {
            place:'鹿鼎记',
            path:'s;w;w;w;n',
        },
        {
            place:'小宝斋',
            path:'jh 5;n;n;n;w;sign7;e;s;e',
            //顺便签到
        },
        {
            place:'桃花别院',
            path:'jh 2;n;n;n;n;w;s',
        },
        {
            place:'北大街',
            path:'n;e;#3 n'
        },
        {
            place:'钱庄',
            path:'e;tzjh_lq;touzi_jihua2 buygo go6;tzjh_lq;tzjh_lq'
        },
        {
            place:'中院',
            path:'jh 17,n,n,n,n,w,w,w'
        },
    ],
    start(){
        if(RCtrigger == 0){
            InforOutFunc('日常停止')
            return;
        }
        var a = libao.List.length;
        if(libao.n < a){
            libao.place = libao.List[libao.n].place;
            libao.path = libao.List[libao.n].path;
            libao.goact();
            libao.n++;
        }else{
            clearTrigger();
            libao.n = 0;
            //clickButton('home');
            nextFun = function(){
                setTimeout(shimenvipFunc,1000)
            }
            if(g_obj_map.get('msg_vip') && g_obj_map.get('msg_vip').get('vip_tm') > '0'){
                if(shimenling >=3)	go2('#3 items use obj_shimenling')
                if(bangpailing >=3)	go2('#3 items use obj_bangpailing')
            }
            go2('vip;w;#3 n')
            if(user_yuanbao > minYuanbao){//自动挖地矿和普通矿
                go('w,w,event_1_42250469,event_1_48689119,w,w,event_1_22034949,#5 event_1_40548659,event_1_83697921,#5 event_1_64388826,e,e,e,e')
            }
            go2('#9 n;e;n;n;n;w;event_1_31320275')//采莲
        }
    },
    goact(){
        libao.npcList = [];
        TriggerFuc = function(b){
            var type = b.get('type');
            if(type == 'jh' && b.get('subtype') == 'info' && g_simul_efun.replaceControlCharBlank(b.get('short'))==libao.place){
                var objs = b.keys(),tmp;
                for(var i=0;i<objs.length;i++){
                    if(objs[i].indexOf('npc')==0){
                        tmp = b.get(objs[i]);
                        libao.npcList.push(tmp.split(',')[0])
                    }
                }
                clearTrigger();
                //console.log(libao.place)
                libao.goLook();
            }
        }
        go2(libao.path)
    },
    goLook(){
        if(libao.npcList.length>0){
            TriggerFuc = function(b){
                if(b.get('type') == 'look_npc'){
                    var objs = b.keys();
                    var temp,ll,i;
                    libao.code = '';
                    for(i=0;i<objs.length;i++){
                        if(ll = objs[i].match(/cmd(.*)_name/)){
                            temp = b.get(objs[i])
                            if((temp.match('礼包') || temp.match('奖励')) && temp != '兑换礼包' && temp != '1元礼包'){
                                libao.code += b.get('cmd'+ll[1]) + ';'
                                //console.log(temp +':'+b.get('cmd'+ll[1]))
                            }
                        }
                    }
                    clearTrigger();
                    if(libao.code != ''){
                        libao.code = libao.code.substr(0, libao.code.length - 1);
                        nextFun = function(){
                            setTimeout(libao.goLook,1000);
                        }
                        go2(libao.code)
                    }else{
                        console.log('此人没有礼包')
                        setTimeout(libao.goLook,200);
                    }
                }else if(b.get('type') == 'notice' && b.get('msg').indexOf("这儿没有这个人物")>=0){
                    clearTrigger();
                    setTimeout(libao.goLook,200);
                }
            }
            clickButton('look_npc '+libao.npcList[0])
            libao.npcList.shift()
        }else{
            console.log('没有人了，去下一个地方')
            libao.start()
        }
    },
}


var curstamp=0;
var prestamp=0;
var cmdlist=[];

var deadlock=0;
var ovtime = null;
function overrideclick(cmd){
    deadlock=1;
    cmdlist.push(cmd);
    //console.log(cmdlist);
    deadlock=0;
}

function newoverrideclick(){
    if (cmdlist.length==0){
        //clearTimeout(ovtime);
        ovtime = setTimeout(newoverrideclick,150);
    }else{
        if (cmdlist.length>0&&deadlock==1){//有指令写入 不动数组
            //clearTimeout(ovtime);
            ovtime = setTimeout(newoverrideclick,150);
        }else if(deadlock==0&&cmdlist.length>0){
            curstamp=(new Date()).valueOf();
            if ((curstamp-prestamp)>200){
                if (cmdlist.length!=0){
                    //console.log("发送指令"+cmdlist[0]);
                    if (qiangdipiTrigger==0){//我没有在抢物品，那么所有get带1的指令全被无视
                        if (cmdlist[0].match("get1")==null){
                            clickButton(cmdlist[0]);
                            cmdlist.shift();
                            prestamp=curstamp;
                        }else{
                            cmdlist.shift();
                            prestamp=curstamp;
                        }
                    }else if (qiangdipiTrigger==1){
                        if (cmdlist[0].match("get1")==null){
                            clickButton(cmdlist[0]);
                            cmdlist.shift();
                            prestamp=curstamp;
                        }else{
                            if (knownlist.indexOf(cmdlist[0].split("get1")[1])<0&&cmdlist[0].split("get1")[1].match("corpse")!=null){//当前这个尸体不在列表中
                                knownlist.push(cmdlist[0].split("get1")[1]);
                            }
                            clickButton("get"+cmdlist[0].split("get1")[1]);
                            cmdlist.shift();
                            prestamp=curstamp;
                        }
                    }


                }
                //clearTimeout(ovtime);
                ovtime = setTimeout(newoverrideclick,150);
            }else{
                //clearTimeout(ovtime);
                ovtime = setTimeout(newoverrideclick,150);//等待150毫秒执行下一次
            }
        }
    }
}
newoverrideclick();
var stime4

function binghuodao(){
    //var jhlist=g_obj_map.get("msg_jh_list").get("finish35");
    //if (jhlist!=undefined&&jhlist!=0){
    overrideclick('jh 35');
    overrideclick('go northwest');      // 熔岩滩头
    overrideclick('go northwest');      // 海蚀涯
    overrideclick('go northwest');      // 峭壁崖道
    overrideclick('go north');      // 峭壁崖道
    overrideclick('go northeast') ;     // 炙溶洞口
    overrideclick('go northwest');      // 炙溶洞
    overrideclick('go west') ;     // 炙溶洞口
    overrideclick('go northwest') ;     // 熔岩小径
    overrideclick('go east') ;     // 熔岩小径
    overrideclick('go east');      // 石华林
    overrideclick('go east');      // 分岛岭
    overrideclick('go east');      // 跨谷石桥
    overrideclick('go east') ;     // 大平原
    overrideclick('go southeast');overrideclick('go north'); overrideclick('go north'); overrideclick('go west') ; overrideclick('go north');overrideclick('go west') ;overrideclick('event_1_53278632');overrideclick('sousuo');overrideclick('sousuo');overrideclick('home');
    g_gmain.notify_fail(HIG+"冰火岛日常结束"+NOR);
    //}else{

    //		}

}
function pozhen(){
    var jhlist=g_obj_map.get("msg_jh_list").get("finish26");
    if (jhlist!=undefined&&jhlist!=0){
        overrideclick('jh 26');
        overrideclick('go west');
        overrideclick('go west');
        overrideclick('go north');
        overrideclick('go north');
        overrideclick('event_1_14435995');
        overrideclick('go south');
        overrideclick('go east');
        overrideclick('go east');
        overrideclick('event_1_18075497');
        g_gmain.notify_fail(HIG+"破阵日常结束"+NOR);
        setTimeout(function(){binghuodao();},500);
    }else{
        //clearTimeout(stime4);
        stime4 = setTimeout(function(){binghuodao();},500);
    }
}

// 钓鱼------------------------------------------------------------------------------------------------------
var fishingTrigger=0;
var fishingButton = document.createElement('button');
fishingButton.innerText = '开始钓鱼';
//left0ButtonArray.push(fishingButton);
fishingButton.addEventListener('click', fishingFunction);
function fishingFunction(){
    console.log("打开江湖");
    overrideclick('jh',0);
    if (fishingTrigger==0){
        fishingFirstFunc();
        fishingButton.innerText = '停止钓鱼';
        fishingTrigger=1;
    }else{
        fishingButton.innerText = '开始钓鱼';
        fishingTrigger=0;
    }

}
function fishingFirstFunc(){
    //    console.clear();
    console.log("开始钓鱼！");
    console.log("判断是否已经开放冰火岛");
    setTimeout(function(){fishstart();},1000);
}
function fishstart(){
    var location=g_obj_map.get("msg_room").get("short");
    if (location=="冰湖"){
        overrideclick('diaoyu');
        return;
    }
    if (g_obj_map.get("msg_jh_list").get("finish35")==2){
        overrideclick("jh 35",0);
        fishingSecondStage();
    }else{
        fishingFirstStage();
    }
}

function fishingFirstStage(){
    // 进入扬州
    overrideclick('jh 5');       // 进入章节
    overrideclick('go north');     // 南门大街
    overrideclick('go north');   // 十里长街3
    overrideclick('go north');    // 十里长街2
    overrideclick('go north');      // 十里长街1
    overrideclick('go north');      // 中央广场
    overrideclick('go north');      // 十里长街4
    overrideclick('go north');      // 十里长街5
    overrideclick('go north');      // 十里长街6
    overrideclick('go north');      // 北门大街
    overrideclick('go north');      // 镇淮门
    overrideclick('go northeast') ;     // 扬州港
    overrideclick('look_npc yangzhou_chuanyundongzhu');
    overrideclick('chuhai go');
    setTimeout(function(){fishingSecondStage();},1000);
}
// 挖鱼饵参数
var resFishingParas = 100;   // 系统里默认最多挖50次
var buttonName_digworm = 'event_1_59308235';
var cutTreeButtonName = 'event_1_45715622';
var diaoyu_buttonName = 'diaoyu';
var digWormFun=null;
var firstFishingParas = true;
var  resFishToday = 10;
var lastFishMsg = "";
function fishingSecondStage(){
    // 到达冰火岛
    overrideclick('chuhaigo', 0);
    overrideclick('go northwest');      // 熔岩滩头
    overrideclick('go northwest');      // 海蚀涯
    overrideclick('go northwest');      // 峭壁崖道
    overrideclick('go north');      // 峭壁崖道
    overrideclick('go northeast') ;     // 炙溶洞口
    overrideclick('go northwest');      // 炙溶洞
    overrideclick('go west') ;     // 炙溶洞口
    overrideclick('go northwest') ;     // 熔岩小径
    overrideclick('go east') ;     // 熔岩小径
    overrideclick('go east');      // 石华林
    overrideclick('go east');      // 分岛岭
    overrideclick('go east');      // 跨谷石桥
    overrideclick('go east') ;     // 大平原
    overrideclick('go southeast');
    overrideclick('go east');
    overrideclick('diaoyu');
}
var kanshufinish=0;
var kanshuing=0;
var wachonging=0;
var wachongfinish=0;
function kanshu(){
    overrideclick('go west');
    overrideclick('go south');
    overrideclick('go southeast');
    overrideclick('go west');
    overrideclick('go northwest');
    overrideclick('go south');overrideclick('go south');overrideclick('go south');overrideclick('go south');overrideclick('go south');overrideclick('go south');overrideclick('go west');overrideclick('go west');overrideclick('go north');overrideclick('go east');overrideclick('go north');overrideclick('go west');overrideclick('go west');overrideclick('go south');
    overrideclick('event_1_45715622');
}
function wachong(){
    overrideclick('go west');
    overrideclick('go northwest');
    overrideclick('event_1_59308235');
}
function fishingfeedback(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="notice"||type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            overrideclick('look_room', 0);
            //console.log(msg);
            //开始判断钓鱼情况
            if (msg.match("整个冰湖的渔获都快被你钓光了")!=null){
                console.log("今天钓鱼结束了");
                fishingButton.innerText = '开始钓鱼';
                fishingTrigger=0;
            }else if (msg.match("突然")!=null){
                setTimeout(function(){overrideclick('diaoyu');},5000);
            }else if (msg.match("你目前正在钓鱼中")!=null){
                setTimeout(function(){overrideclick('diaoyu');},300);
            }else if(kanshufinish==0&&msg.match("你还没有鱼竿")!=null){
                kanshu();
                kanshuing=1;
            }else if(kanshufinish==1&&msg.match("你还没有鱼竿")!=null){
                //overrideclick('shop money_buy shop5');
                overrideclick('diaoyu');
            }else if(wachongfinish==0&&msg.match("你还没有鱼饵")!=null){
                wachong();
                wachonging=1;
            }else if(wachongfinish==1&&msg.match("你还没有鱼饵")!=null){
                //overrideclick('shop money_buy shop6');
                overrideclick('diaoyu');
            }else if(kanshuing==1&&msg.match("你调运内功向林海一掌打去")!=null){
                setTimeout(function(){overrideclick('event_1_45715622');},5000);
            }else if(wachonging==1&&msg.match("你在湿润的土地上四处翻动")!=null){
                setTimeout(function(){overrideclick('event_1_59308235');},5000);
            }else if(wachonging==1&&msg.match("你挖掘的太快了")!=null){
                setTimeout(function(){overrideclick('event_1_59308235');},300);
            }else if(kanshuing==1&&msg.match("你砍伐树木太快了")!=null){
                setTimeout(function(){overrideclick('event_1_45715622');},300);
            }else if (kanshuing==1&&msg.match("你今天已经够累得了")!=null){
                kanshuing=0;
                kanshufinish=1;
                overrideclick('go north');overrideclick('go north');
                overrideclick('go east');overrideclick('go north');
                overrideclick('go southeast');overrideclick('go east');overrideclick('go northwest');overrideclick('go north');
                overrideclick('go east');overrideclick('diaoyu');
            }else if (wachonging==1&&msg.match("你今天已经够累得了")!=null){
                wachonging=0;
                wachongfinish=1;
                overrideclick('go southeast');
                overrideclick('go east');
                overrideclick('diaoyu');

            }
        }
    }
}
var fishfeedback=new fishingfeedback;
var qiangdipiTrigger=0;

// 去除链接以及特殊字符
function removeSpec(str) {
    var tmp = g_simul_efun.replaceControlCharBlank(str.replace(/\u0003.*?\u0003/g, ""));
    tmp = tmp.replace(/[\x01-\x09|\x11-\x20]+/g, "");
    return tmp;
}


// 自动恢复 ------------------------------------------------------------------------------------------------------
var healIntervalFunc=null;
function doheal(){
    let vs_hp11 = $("#vs_hp11").children().children().text();
    if(vs_hp11 == "" || vs_hp11 == 0){
        NewhealFunc();
    }
}

function NewhealFunc(){
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));
    //console.log("血量是: "+kee+"/"+max_kee);
    //console.log("内力是: "+force+"/"+max_force);
    if (kee<max_kee){
        if (force>0) {
            clickButton('recovery',0);
        }
        else {
            clickButton('items use snow_wannianlingzhi');
        }
    }else {
        if (force<max_force * 0.5){
            clickButton('items use snow_wannianlingzhi');
        }
    }
}
// 一键恢复------------------------------------------------------------------------------------------------------
var healtriger=0;
function userMedecineFunc(){
    if (healtriger==0){
        healtriger=1;
        healFunc();
        g_gmain.notify_fail(HIG+"开始恢复血量和内力"+NOR);
    }else{
        g_gmain.notify_fail(HIR+"已经停止一键恢复功能"+NOR);
        healtriger=0;
    }
}

// 自动突破 ------------------------------------------------------------------------------------------------------
var autotupoTrigger=0;
function autotupoFunc(){
    if(autotupoTrigger){
        autotupoTrigger=0;
    }else{
        autotupoTrigger=1;
    }
}
var AutoTupo =new AutoTupo();
function AutoTupo(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (b.get('type') == 'notice') {
            var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
            let matches = msg.match(/你的(.*)成功向前突破/);
            if (matches) {
                var skillname = [matches[1]];
                var skillid = TupoSkillList.filter((item, i) =>{
                    let myitem = '';
                    skillname.filter((value, b) =>{
                        if(item[0] == value) {
                            myitem = value;
                        }
                    });
                    return myitem;
                });

                go2('enable '+skillid[0][1]);
                go2('tupo go,'+skillid[0][1]);
                go2('tupo_speedup2 '+skillid[0][1]+' go');
                go2('tupo_speedup3 '+skillid[0][1]+' go');
                go2('tupo_speedup3_1 '+skillid[0][1]+' go');

                //clickButton('tupo_speedup2 xueyin-blade go');
                //clickButton('tupo_speedup budongmwj go');
                //overrideclick('golook_room');
            }
        }
    }
}

//  切换跨服------------------------------------------------------------------------------------------------------
var qiehuankuafuTrigger=0;
function qiehuankuafuFunc(){
    if(qiehuankuafuTrigger){
        qiehuankuafuTrigger=0;

        g_world_uid = g_world_port = g_world_ip = 0
        sock.close(),
            sock = 0,
            g_gmain.g_delay_connect = 0,
            connectServer();

        //qiehuankuafuButton.innerText = '进入跨服';
    }else{
        qiehuankuafuTrigger=1;

        g_world_ip = "sword-inter1-direct.yytou.cn",
            g_world_port = 8881,
            g_world_uid = g_obj_map.get("msg_attrs").get("id").replace("u","")+"-21a1a",
            sock.close(),
            sock = 0,
            g_gmain.g_delay_connect = 0,
            connectServer();

        //qiehuankuafuButton.innerText = '回到本服';
    }
}
(function(){
    if(g_world_uid){
        qiehuankuafuTrigger=1;
    }
})();

//拼图监听
var PTtrigger=0;
var ptFlag=0;
function pinTuFunc(){
    if (PTtrigger==0){
        PTtrigger=1;
        ptFlag=0;
    }else if (PTtrigger==1){
        PTtrigger=0;
    }
}
function PingTuMon() {
    this.dispatchMessage = function(b) {
        var type = b.get("type"), subType = b.get("subtype"),ctype=b.get('ctype');
        var msg = b.get("msg");
        if (type == "channel" && subType == "sys"&&ptFlag==0) {
            //逃犯监听
            msg = g_simul_efun.replaceControlCharBlank(msg);
            //console.log("type:"+type+";subType:"+subType+";msg:"+msg);
            if (msg.indexOf("今天你可是在我的地盘，看来你是在劫难逃") > 0) {
                var l = msg.match(/系统】(.*)对着(.*)叫道：(.*)，今天你可是在我的地盘，看来你是在劫难逃/);
                if(!mijingProtection()){
                    return;
                }

                var locationname=g_obj_map.get("msg_room").get("short");
                if(locationname=="地室") {
                } else if (locationname=="万蛊堂")
                {
                    overrideclick("go south");
                } else if (locationname=="百毒池")
                {
                    overrideclick("go east");
                } else if (locationname=="十恶殿")
                {
                    overrideclick("go west");
                } else if (locationname=="千蛇窟")
                {
                    overrideclick("go north");
                } else {
                    overrideclick("jh 2");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go north");
                    overrideclick("go west");
                    overrideclick("go south");
                    overrideclick("go south");
                    overrideclick("go south");
                    overrideclick("go south");
                    overrideclick("go east");
                    overrideclick("event_1_2215721");
                }

                if (l&&l[2]=="云观海") {
                    overrideclick("go north");
                    overrideclick('kill changan_yunguanhai1');
                }else if(l&&l[2]=="翼国公"){
                    overrideclick("go south");
                    overrideclick('kill changan_yiguogong1');
                }else if(l&&l[2]=="黑袍公"){
                    overrideclick("go west");
                    overrideclick('kill changan_heipaogong1');
                }else if(l&&l[2]=="独孤须臾"){
                    overrideclick("go east");
                    overrideclick('kill changan_duguxuyu1');
                }
            }
        }
        else if(((type=="notice" && msg && msg.indexOf("你今天完成的宝藏秘图任务数量已经超量了")>-1)||(type == "main_msg" && ctype == "text"&& msg &&msg.indexOf("这是你今天完成的第4/4")>-1))&&ptFlag==0){
            ptFlag = 1;
            console.log("拼图打npc任务数量完成！");

        }
        //else if(ptFlag == 1){
        //					ButtonManager.resetButtonById("btnpinTu");
        //			}
    }
}
var ptMon = new PingTuMon;

/**本服青龙监听start**/
var BFQLtrigger=0;
function listenBFQLFunc(){
    if (BFQLtrigger==0){
        var msgtxt=null;
        var msghtml=null;
        BFQLtrigger=1;
    }else if (BFQLtrigger==1){
        BFQLtrigger=0;
    }
    if(BFQLtrigger==1 && busy == 0){
        //获取out2的数据变化判断
        $("#out2").bind('DOMNodeInserted', function(e) {
            msgtxt = $(e.target).text() ;
            msghtml = $(e.target).html() ;
            var targetCode = null;
            if (msgtxt.indexOf("青龙会组织：") > -1 ) {
                var l = msgtxt.match(/青龙会组织：(.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/);
                //寻找清单内对应碎片
                if(DragonBonus0.contains(l[3]) || DragonBonus1.contains(l[3]) || DragonBonus2.contains(l[3]) || DragonBonus3.contains(l[3]) || DragonBonus4.contains(l[3]) || DragonBonus5.contains(l[3])){
                    targetCode = msghtml.split("'")[1];
                    clickButton(targetCode);
                    badName = l[1];
                    setTimeout(fightSwordsmanBF,200);
                }
            }
        });
    }else{
        $("#out2").unbind();
    }
    function fightSwordsmanBF(){
        //杀对应好人
        /* var peopleList = $(".cmd_click3");
			//var thisonclick = null;
			for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
				// 打印 NPC 名字，button 名，相应的NPC名
				//thisonclick = peopleList[i].getAttribute('onclick');
				if (peopleList[i].innerText === badName){
					eval(peopleList[i-1].getAttribute('onclick').replace("look_npc","kill"));
					return;
				}
			}*/
        // 寻找指定名称的坏人并开始击杀
        $("button.cmd_click3").each(
            function(){
                if($(this).text() === badName)
                    eval($(this).attr("onclick").replace("look_npc","kill"));
            });
        // 战斗结束自动退出战斗界面
        if($('span.outbig_text:contains(战斗结束)').length>0){
           // clickButton('prev_combat');
        }

    }
}

/**跨服青龙镖车监听start**/
var QLtrigger=0;
function listenQLFunc(){
    if (QLtrigger==0){
        var msgtxt=null;
        var msghtml=null;
        QLtrigger=1;
    }else if (QLtrigger==1){
        QLtrigger=0;
    }
    if(QLtrigger==1){
        //获取out2的数据变化判断
        $("#out2").bind('DOMNodeInserted', function(e) {
            msgtxt = $(e.target).text() ;
            msghtml = $(e.target).html() ;
            var targetCode = null;
            if (msgtxt.indexOf("青龙会组织：[21-25区]") > -1 ) {
                var m = msgtxt.match(/青龙会组织：\[21-25区\](.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/);
                //寻找清单内对应碎片
                if(DragonBonus0.contains(m[3]) || DragonBonus1.contains(m[3]) || DragonBonus2.contains(m[3]) || DragonBonus3.contains(m[3]) || DragonBonus5.contains(m[3])){
                    targetCode = msghtml.split("'")[1];
                    clickButton(targetCode);
                }
            }
            if (msgtxt.indexOf("荣威镖局:[21-25区]") > -1 )  {
                targetCode = msghtml.split("'")[1];
                clickButton(targetCode);
            }
        });
    }else{
        $("#out2").unbind();
    }
}

/**全服青龙监听start**/
var QFQLtrigger=0;
function listenQFQLFunc(){
    if (QFQLtrigger==0){
        var msgtxt=null;
        var msghtml=null;
        QFQLtrigger=1;
    }else if (QFQLtrigger==1){
        QFQLtrigger=0;
    }
    if(QFQLtrigger==1){
        //获取out2的数据变化判断
        $("#out2").bind('DOMNodeInserted', function(e) {
            msgtxt = $(e.target).text() ;
            msghtml = $(e.target).html() ;
            var targetCode = null;
            if (msgtxt.indexOf("新区") > -1) {return;}
            if (msgtxt.indexOf("武林广场") > -1&&msgtxt.indexOf("青龙") > -1) {
                var n = msgtxt.match(/青龙会组织：(.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/);
                if (DragonBonus.contains(n[3]))
                {
                    targetCode = msghtml.split("'")[1];
                    clickButton(targetCode);
                }
            }
        });
    }else{
        $("#out2").unbind();
    }
}
function QinglongMon() {
    this.dispatchMessage = function(b) {
        var type = b.get("type"), subType = b.get("subtype");
        if (type == "channel" && subType == "sys" ) {
            var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
            //逃犯监听
            if (msg.indexOf("[21-25区]段老大") > 0) {
                var targetCode = null;
                var l = msg.match(/系统】\[21-25区\]段老大慌不择路，逃往了(.*)-(.*)/);
                //得到逃犯的链接
                if (l&&QLtrigger==1) {
                    var targetCode1 = l[2].split(";")[2];
                    var ChineseADD=targetCode1.match(/[\u4e00-\u9fa5]/g).join("");
                    targetCode=targetCode1.split(ChineseADD)[0];
                    //执行寻找对应的NPC
                    clickButton(targetCode);
                    return;
                }
            }//逃犯跨服
        }
    }
}
var qlMon = new QinglongMon;

//定时睡床监听
var DsQLtrigger=0;
function listenDingFunc(){
    if(DsQLtrigger==1){
        var timeTask=setInterval(function(){
            var date=new Date();
            var w=date.getDay();
            var h=date.getHours();
            var m=date.getMinutes();
            var s=date.getSeconds();
            var AutoTime = sessionStorage.getItem("AutoTime");
            //alert("时间:"+h+m+s);
            if(h==5 && m==55){
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                overrideclick('vip finish_bad 2');
                console.log("正邪任务清理！");
            }
            else if(h==6 && m==0){
                ButtonManager.clickButtonById("btnpinTu");
            }
            else if(w == 1 && h==1 && m==0){
                //setTimeout(CheckIn1,1000);
            }
            else if(h==18 && m==1){
                go("home;sort fetch_reward");
            }
            else if(h==21 && m==45){
                clickButton('clan scene', 0);
            }
        },60000);
    }else{
        clearInterval(timeTask);}
}
/**逃跑回坑并且自动进入战斗 --start**/
var escapeTrigger=0;
function escapeStart(){
    escapeTrigger=1;
    escapeloop();
}
function escapeloop(){
    console.log("我逃");
    overrideclick('escape', 0) //循环逃跑判定
    if (escapeTrigger==1)
        setTimeout(function(){escapeloop();},500);
}

function EscapeFunc(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        //console.log(type);
        //console.log(subType);
        var combat=g_obj_map.get("msg_vs_info");
        if (combat==undefined){
            return;
        }
        var npcid;
        var opnpc;
        var me=g_obj_map.get("msg_attrs").get("id");
        for (var i=0;i<4;i++){
            if (combat.get("vs1_pos"+i)==me){
                opnpc=combat.get("vs1_pos1");
                npcid=combat.get("vs2_pos1");
            }else if (combat.get("vs2_pos"+i)==me){
                opnpc=combat.get("vs2_pos1");
                npcid=combat.get("vs1_pos1");
            }
        }
        if (type == "notice" && subType == "escape") {
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            //console.log(msg);
            if (msg.match("逃跑成功")!=null){
                escapeTrigger=0;
                //开始恢复
                if (changeTrigger==1){
                    changeTrigger=0;
                    clickButton("fight "+opnpc,0);
                    clickButton("kill "+opnpc,0);
                }
                else if(changeTrigger==0){
                    clickButton("fight "+npcid,0);
                    clickButton("kill "+npcid,0);
                }

            }
        }
    }
}
function healFunc(){
    if (healtriger==0){
        return;
    }
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));
    //console.log("血量是: "+kee+"/"+max_kee);
    //console.log("内力是: "+force+"/"+max_force);
    if (kee<max_kee){
        if (force>0) {
            clickButton('recovery',0);
        } else {
            clickButton('items use snow_wannianlingzhi');
        }
        //console.log("治疗中.....");
        setTimeout(function(){healFunc()},200);
    }else{
        if (force<max_force * 0.5){
            clickButton('items use snow_wannianlingzhi');
            //console.log("治疗中.....");
            setTimeout(function(){healFunc()},200);
        }
        else if (force<max_force * 0.95){
            clickButton('items use snow_wannianlingzhi');
            //console.log("治疗中.....");
            setTimeout(function(){healFunc()},200);
        }else{
            setTimeout(function(){ButtonManager.clickButtonById("Recover")},200);
        }
    }
}

var escape=new EscapeFunc;
var escape1=new Escape1Func;

/**自动战斗 start**/
//自动战斗--------------------------
var AutoKillIntervalFunc = null;
function NewAutoKill(){
    //ninesword1();
    setTimeout(function(){ninesword61(1)},500);
    //if($('span.outbig_text:contains(战斗结束)').length>0){
  go2('golook_room');
    //prev_combat
    //}
}

/**6气2连 start**/
var xdz = 0;
var sixqpvp = 0;
var AutoKill61FuncIntervalFunc=null;
function LianZhao(x=0){
    if(sixqpvp  == 0){
        sixqpvp = 1;
        Auto6qFunc(x);
    }
    else{
        clearKill6();
        ngcount =0;
        sixqpvp = 0;
    }
}
function Auto6qFunc(x=0){
    // 间隔500毫秒查找比试一次
    clearInterval(AutoKill61FuncIntervalFunc);
    if(x==0)
        AutoKill61FuncIntervalFunc = setInterval(ninesword6,700);
    else
        AutoKill61FuncIntervalFunc = setInterval(ninesword61,700,x);
}

function clearKill6(){
    clearInterval(AutoKill61FuncIntervalFunc);
}

//战斗调用通用脚本----------------------------------------------------
var banSkills = "天师灭神剑|茅山道术|碧血心法|不动明王诀|生生造化功|道种心魔经|万流归一";
var skillName = "";
function ninesword(){
    setTimeout(ninesword1,1000);
    //if($('span.outbig_text:contains(战斗结束)').length>0){
    //   clickButton('prev_combat');
    //}
}
function ninesword1(){
    zdskill = spearSkillLists;
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    if (force<max_force*0.2){
        // 释放回内技能
        for(var i = 1;i < 7;i++){
            skillName = $('#skill_'+i).children().children().text();
            if(skillName == "不动明王诀"){
                //console.log(skillName);
                go('playskill '+i);
                return;
            }
        }
    }
    if (force>=max_force*0.2)
    {
        if (kee<max_kee*0.5){
            // 释放大回血技能
            for(var i = 1;i < 7;i++){
                skillName = $('#skill_'+i).children().children().text();
                if(skillName == "紫血大法"){
                    //console.log(skillName);
                    go('playskill '+i);
                    return;
                }
            }
        }
        // 如果找到设置的枪技能则释放
        for(var i = 1;i < 7;i++){
            skillName = $('#skill_'+i).children().children().text();
            if(skillName !== "" && isContains(zdskill, skillName)){
                //console.log(skillName);
                clickButton('playskill '+i);
                return;
            }
        }
        zdskill = otherSkillLists;
        // 如果没有枪技能，则找到设置的拳剑暗刀技能释放
        for(var i = 1;i < 7;i++){
            skillName = $('#skill_'+i).children().children().text();
            if(skillName !== "" && isContains(zdskill, skillName)){
                //console.log(skillName);
                clickButton('playskill '+i);
                return;
            }
        }
    }
    // 如果没找到设置技能，随便用一个非招bb的技能
    for(i = 1;i < 7;i++){
        skillName = $('#skill_'+i).children().children().text();
        if(skillName !== "" && !isContains(banSkills, skillName)){
            //console.log(skillName);
            clickButton('playskill '+i);
            return;
        }
    }
}

function huifu(x=0){
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));

    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    var skillName = '';
    //console.log(user_force +'/'+user_maxforce)
    var huifuForce =  max_force/5;
    if(x==1){
        huifuForce =  max_force/3;
    }
    if (force < huifuForce && user_force < huifuForce){
        // 释放回内技能
        //console.log("内力："+user_force +"/"+ user_maxforce)
        for(i = 1;i < 7;i++){
            skillName = $('#skill_'+i).children().children().text();
            if(skillName == forceSkills2){
                //console.log(skillName);
                clickButton('playskill '+i);
                return true;
            }
        }
    }else if ((fight_blood <3 || ( fight_blood2 <5 && forceSkills == '紫血大法')) && user_kee < user_maxkee*55/100 && kee < max_kee*55/100){
        // 释放大回血技能
        //console.log('紫血次数：'+fight_blood2)
        for(i = 1;i < 7;i++){
            skillName = $('#skill_'+i).children().children().text();
            if(skillName == forceSkills){
                //console.log(skillName);
                clickButton('playskill '+i);
                return true;
            }
        }
    }
    return false;
}

function buff(){
    let pos=[],skillName='';
    let xdz= gSocketMsg.get_xdz();
    var now = new Date().getTime();
    if(fight_tx==1 && now - tx_time > 30000)
        fight_tx = 0;
    if(fight_dodge==1 && now - dodge_time > 25000)
        fight_dodge = 0;
    if(fight_zixia==1 && now - zixia_time > 5000)
        fight_zixia = 0;

    if(buxuan_flag && fight_buxuan==1 && now - buxuan_time > buxuan_default){
        fight_buxuan = 0;
        //console.log('步玄过期：'+now)
    }

    if( buff_flag == 1 && (
        (bx_flag==1 && fight_bx == 0 )
        || (bx_flag2==1 && fight_bx == 0 )
        || (tx_flag == 1 && fight_tx == 0)
        || (bs_flag == 1 && fight_bs == 0)
        || (lx_flag == 1 && fight_lx == 0)
        || (dodge_flag == 1 && fight_dodge == 0)
        || (buxuan_flag==1 && fight_buxuan==0)
    )
      ){
        let ef = 1;
        //if(gSocketMsg.get_max_xdz()<12 && g_obj_map.get('msg_score') && g_obj_map.get("msg_attrs").get("force_factor") != '0'){
        //				ef = 0;
        //		}
        for(let i = 1;i < 7;i++){
            skillName = $('#skill_'+i).children().children().text();

            if(buxuan_flag==1 && fight_buxuan==0 && skillName.indexOf('步玄七诀') >= 0){

                pos.push({'sk': i,'xdz':2})
                //console.log('步玄'+skillName+'+'+i)
            }

            if( bs_flag == 1 && fight_bs == 0 && skillName.indexOf('白首太玄经') >= 0){
                //pos.push(i)
                pos.push({'sk': i,'xdz':3})
                checkBS = 1;
                clearTimeout(bstime)
                bstime = setTimeout(function(){checkBS=0},1500)
                //console.log('白首'+skillName+'+'+i)
            }
            if( tx_flag == 1 && fight_tx == 0 && skillName.indexOf('天邪神功') >= 0){
                //pos.push(i)
                pos.push({'sk': i,'xdz':2})
                //console.log('天邪'+skillName+'+'+i)
            }
            if (bx_flag == 1 && fight_bx == 0 && (skillName.indexOf('碧血心法') >= 0 || skillName.indexOf('西凉心法') >= 0 ||skillName.indexOf('龙象般若功') >= 0)) {
                //pos.push(i)
                pos.push({'sk': i,'xdz':3})
                //console.log('碧血'+skillName+'+'+i)
            }
            else if (bx_flag2 == 1 && fight_bx == 0 && skillName.indexOf('龙象般若功') >= 0) {
                //pos.push(i)
                pos.push({'sk': i,'xdz':3})
            }
            if( lx_flag == 1 && fight_lx == 0 && skillName.indexOf('龙象般若功') >= 0){
                if(pos.indexOf(i) == -1)
                    //pos.push(i)
                    pos.push({'sk': i,'xdz':3})
                //console.log('龙象'+skillName+'+'+i)
            }
            if( dodge_flag == 1 && fight_dodge == 0
               && (skillName.indexOf('万流归一') >= 0 || skillName.indexOf('凤舞九天') >= 0 || skillName.indexOf('踏月留香') >= 0|| skillName.indexOf('云梦归月') >= 0 || skillName.indexOf('天魔妙舞') >= 0)
              ){
                //pos.push(i)
                pos.push({'sk': i,'xdz':3})
                fight_dodge = 1;
                dodge_time = new Date().getTime();
                //console.log('轻功:'+skillName+'+'+i)
            }

        }
        let xdz2 = xdz;
        if(pos.length > 0){
            for(i=0;i<pos.length;i++){
                //if(Math.floor(xdz/3) == i+1)
                //	return 0;
                if(xdz2 < pos[i].xdz)
                    return 0;
                clickButton('playskill '+pos[i].sk);
                xdz2 = xdz2 - pos[i].xdz;
            }
            return (xdz2>0)?xdz2:0;
        }
        return xdz2;
    }
    else
        return xdz;
}

//6气连招
var ngcount =0;
var stime1 = null;
function ninesword6(){
    if(!g_gmain.is_fighting){
        return;
    }
    ninesword61()
    //stime1 = setTimeout(ninesword61,500);
}
var stime2 = null;
var bstime = null;
function ninesword61(x=0){
    //x 0 六气，1 三气，2 六九气，3九气
    var i,xdz,pos=[],skillName='';
    xdz= gSocketMsg.get_xdz();
    if(!g_gmain.is_fighting || xdz<3){
        return;
    }

    if(huifu())
        return;
    xdz = buff();
    if(xdz<3)
        return;
    //zixia_time
    //console.log(fight_bx + ' --- ' + fight_tx)
    if( zixia_flag == 1 && fight_zixia == 0 ){
        for(let i = 1;i < 7;i++){
            let skillName = $('#skill_'+i).children().children().text();
            if(
                skillName.indexOf('紫霞神功') >= 0 || skillName.indexOf('葵花宝典') >= 0
            ){
                fight_zixia = 1;
                zixia_time = new Date().getTime();
                clickButton('playskill '+i);
                if(xdz>=5)
                    chuzhao3();
                return;
            }
        }
    }
    if(x==3 && xdz<9)	return;
    if (xdz >= 9 ||(xdz>=6 && x != 2)) {
        chuzhao6();
        //console.log(x+'出2招')
    }else if(x==1 ||(xdz>=6 && x==2)){
        chuzhao3();
        //console.log(x+'单招')
    }
    //else if (xdz >= 9) {
    //			chuzhao9();
    //}
}

function dantiao(){
    var i,xdz,pos=[],skillName='';
    xdz= gSocketMsg.get_xdz();
    if(!g_gmain.is_fighting || xdz<3){
        return;
    }

    if(huifu(1))
        return;
    xdz = buff();
    if(xdz<3)
        //if(buff())
        return;
    //console.log('循环，目前'+xdz+'气')
    let maxXdz = Number(gSocketMsg.get_max_xdz());
    let x1=9,x2=6,x3=3;

    if(maxXdz>=12)
        x1=10,x2=8,x3=3;
    if (xdz >= x1 || ((fight_buxuan==1) && xdz>=6)) {
        chuzhao6();
    }else if(xdz >=x2 ){
        if(combo.length == 0) return;
        if(combo[0].length == 0) return;
        if(combo[0].length>1)
            comboSkill = combo[0][combo[0].length-1];
        else
            comboSkill = combo[0][0];
        //console.log('单招'+comboSkill)
        let skills = getSkills();
        for (var k = 0; k < skills.length; k++) {
            if (skills[k].indexOf(comboSkill) >= 0){
                clickButton('playskill ' + (k + 1)); //出招
                return;
            }
        }
    }
    //}
}
/*
	function dantiao2(){
		let pos=[],skillName='';
		let xdz= gSocketMsg.get_xdz();
		if(!g_gmain.is_fighting || xdz<2)
			return
		if(huifu(1))
			return;
		var now = new Date().getTime();
		if(fight_tx==1 && now - tx_time > 30000)
			fight_tx = 0;

		if(fight_buxuan==1 && now - buxuan_time > 20000){
			fight_buxuan = 0;
		}
		for(let i = 1;i < 7;i++){
			skillName = $('#skill_'+i).children().children().text();
			if(fight_buxuan==0 && now - buxuan_time2 > 5000 && skillName.indexOf('步玄七诀') >= 0){
				pos.unshift({'sk': i,'xdz':2,name:skillName})
			}
			if(skillName.indexOf('意寒神功') >= 0){
				pos.unshift({'sk': i,'xdz':2,name:skillName})
			}

			if(fight_bing1==0 && skillName.indexOf('茅山道术') >= 0){
				pos.push({'sk': i,'xdz':2,name:skillName})
			}
		}
		var pos2 = []
		var comboSkill = combo[0];
		let skills = getSkills();
		for (j = 0; j < comboSkill.length; j++) {
			// 当前组合是否在技能列表里
			for(let i = 1;i < 7;i++){
				skillName = $('#skill_'+i).children().children().text();
				if (skillName.indexOf(comboSkill[j]) >= 0) {
					pos2.push({'sk': i,'xdz':3,name:skillName})
				}
			}
		}

		pos = pos.concat(pos2)
		//console.log(pos)
		let xdz2 = xdz;
		if(pos.length > 0){
			for(i=0;i<pos.length;i++){
				//if(Math.floor(xdz/3) == i+1)
				//	return 0;
				if(xdz2 < pos[i].xdz)
					return 0;
				clickButton('playskill '+pos[i].sk);
				xdz2 = xdz2 - pos[i].xdz;
			}
			return 0;
		}
		return xdz2;
	}
*/
var dtpd=0
var dantiaoTrigger = 0;
function dantiaoPanduan(b){
    if(dtpd == 1 || gSocketMsg.get_xdz()<3) return;
    let i;
    let user_xdz = gSocketMsg.get_xdz();
    if(huifu()){
        dtpd = 1;
        gzsetTime = setTimeout(function(){dtpd = 0},300);
        return;
    }
    let type = b.get('type');
    let subtype = b.get('subtype');
    if(type != 'vs') return;
    if(subtype == "attack" && b.get('rid') == g_obj_map.get("msg_attrs").get('id')){
        dtpd = 1;
        gzsetTime = setTimeout(function(){dtpd = 0},300);
        //console.log('反击')
        if(user_xdz >=6)
            chuzhao6()
    }else if(b.get('msg') && subtype == 'text'){
        let msg = g_simul_efun.replaceControlCharBlank(b.get('msg'));
        let now = new Date().getTime();
        if(
            msg.indexOf('被你所破')>=0
            ||msg.indexOf('希望扰乱你的视线')>=0
            ||msg.indexOf('仍被你招式紧逼')>=0
            ||msg.indexOf('但你招式在真气之中仍旧施展自如')>=0
            ||msg.indexOf('你的招式并未有明显破绽')>=0
            ||msg.indexOf('无法击破你的攻势')>=0
            ||msg.indexOf('无法完全将你逼开')>=0
            ||msg.indexOf('但你招式更快，并未放弃攻击')>=0
            //				||msg.indexOf('头昏目眩，几乎无法动弹')>=0
            //||msg.indexOf('【当头棒喝】')>=0
            ||msg.indexOf('找到了闪躲的空间')>=0
            ||msg.indexOf('朝边上一步闪开')>=0
            ||msg.indexOf('他机灵地躲开了') >=0
            ||msg.indexOf('真气直接将你逼开')>=0
            ||msg.indexOf('你顿时被冲开老远')>=0
            ||msg.match(/你被(.*)的真气所迫/)
            ||msg.match(/你这一招正好击向了(.*)的破绽/)
        ){
            //console.log('追击')
            dtpd = 1;
            gzsetTime = setTimeout(function(){dtpd = 0},300);
            if(user_xdz >=6)
                chuzhao6()
            //else
            //	chuzhao3()
        }
        /*
			else if(msg.indexOf('【当头棒喝】')>=0){
				fight_buxuan = 1;
				if(now-buxuan_time<4000)
					buxuan_time = now + 3000
			}
			else if(msg.indexOf('头昏目眩，几乎无法动弹')>=0){
				fight_buxuan = 1;
				if(now-buxuan_time<2000)
					buxuan_time = now + 2000
			}
			*/
    }
    msg = '';
    b=null;
}
/*

哆啦◆A梦四处飘动，令『江洋大盗』觉得头晕目眩，失去了方向！
*/
/**逃跑换边 start**/
var escapechangeButton = document.createElement('button');
escapechangeButton.innerText = '逃跑换边';
//right0ButtonArray.push(escapechangeButton);
escapechangeButton.addEventListener('click', escapechangeStart);
var changeTrigger=0;
function escapechangeStart(){
    escapeTrigger=1;
    changeTrigger=1;
    escapeloop();
}
/**逃跑回坑 start**/
var escapeButton = document.createElement('button');
escapeButton.innerText = '逃跑回坑';
//right0ButtonArray.push(escapeButton);
escapeButton.addEventListener('click', escapeStart1);
var escapeTrigger1=0;
function escapeStart1(){
    escapeTrigger1=1;
    escapeloop1();
}
function escapeloop1(){
    console.log("我逃");
    overrideclick('escape', 0) //循环逃跑判定
    if (escapeTrigger1==1)
        setTimeout(function(){escapeloop1();},500);
}

function Escape1Func(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        //console.log(type);
        //console.log(subType);
        var combat=g_obj_map.get("msg_vs_info");
        if (combat==undefined){
            return;
        }
        var npcid;
        var opnpc;
        var me=g_obj_map.get("msg_attrs").get("id");
        for (var i=0;i<4;i++){
            if (combat.get("vs1_pos"+i)==me){
                opnpc=combat.get("vs1_pos1");
                npcid=combat.get("vs2_pos1");
            }else if (combat.get("vs2_pos"+i)==me){
                opnpc=combat.get("vs2_pos1");
                npcid=combat.get("vs1_pos1");
            }
        }
        if (type == "notice" && subType == "escape") {
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            //console.log(msg);
            if (msg.match("逃跑成功")!=null){
                escapeTrigger1=0;
            }
        }
    }
}

function killer(){
    overrideclick("jh 3");
    overrideclick("go west");
    overrideclick("event_1_59520311");
    overrideclick("go north");overrideclick("go north");overrideclick("go north");overrideclick("go north");
    killwatch();
}
function killwatch(){
    var room=g_obj_map.get("msg_room");
    if (room==undefined){
        setTimeout(killwatch,200);
    }else{
        var npc=room.get("npc1");
        if (npc==undefined){
            setTimeout(killwatch,200);
        }else{
            overrideclick("watch_vs huashancun_huashancun_fb4");
        }
    }
}
function bekilled(){
    overrideclick("jh 3");
    overrideclick("go west");
    overrideclick("event_1_59520311");
    overrideclick("go north");overrideclick("go north");overrideclick("go north");overrideclick("go north");
    overrideclick("kill huashancun_huashancun_fb4");
}
function selfprotection(){
    if (killerTrigger==1&&killedid==""){
        setTimeout(selfprotection,200);
    }else if(killerTrigger==1&&killedid!=""){
        clickButton("fight "+killedid,0);
        setTimeout(selfprotection,3000);
    }
}

function autoGodview(){
    if (g_obj_map.get("msg_attrs")==undefined){
        setTimeout(autoGodview,500);
    }else{
        GodMode=1;
        GodButton.innerText = '停止强化';
    }
}

function killingstart(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="vs"&&killorkilled==1&&killedid==""){//我还不知道对手是谁
            var combat_info=g_obj_map.get("msg_vs_info");
            if (combat_info!=undefined){
                if (combat_info.get("vs1_pos1")=="huashancun_huashancun_fb4"){
                    killedid=combat_info.get("vs2_pos1");
                }else{
                    killedid=combat_info.get("vs1_pos1");
                }
                overrideclick("fight "+killedid);
                overrideclick("playskill 1");
            }
        }else if(type=="vs"&&subType=="combat_result"){
            if (killorkilled==2){//被杀者
                overrideclick("kill huashancun_huashancun_fb4");
            }else{
                overrideclick("fight "+killedid);
                overrideclick("playskill 1");
            }
        }

    }
}
var killing=new killingstart;

var fullpower=0;

//默认自动事件
function autoEvent(){
    var ManSecret = "";
    var dictSecret = {
        '小洞天': 'jh 24;n;n;n;n;e;e;find_task_road secret',
        '沙丘小洞': 'jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251;find_task_road secret',
        '戈壁': 'jh 21;find_task_road secret',
        '潭畔草地': 'jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;find_task_road secret',
        '青云坪': 'jh 13;e;s;s;w;w;find_task_road secret',
        '九老洞': 'jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;sw;w;nw;w',
        '石街': 'jh 2',
        '天梯': 'jh 24;n;n;n;find_task_road secret',
        '湖边': 'jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;find_task_road secret',
        '山溪畔': 'jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;find_task_road secret',
        '碧水寒潭': 'jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e;find_task_road secret',
        '卢崖瀑布': 'jh 22;n;n;n;n;e;n;find_task_road secret',
        '悬根松': 'jh 9;n;w;find_task_road secret',
        '玉壁瀑布': 'jh 16;s;s;s;s;e;n;e;find_task_road secret',
        '启母石': 'jh 22;n;n;w;w;find_task_road secret',
        '奇槐坡': 'jh 23;n;n;n;n;n;n;n;n;find_task_road secret',
        '草原': 'jh 26;w;find_task_road secret',
        '悬崖': 'jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e;find_task_road secret',
        '云步桥': 'jh 24;n;n;n;n;n;n;n;n;n;find_task_road secret',
        '寒水潭': 'jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;find_task_road secret',
        '千尺幢': 'jh 4;n;n;n;n;find_task_road secret',
        '危崖前': 'jh 25;w;find_task_road secret',
        '山坳': 'jh 1;e;n;n;n;n;n;find_task_road secret',
        '猢狲愁': 'jh 4;n;n;n;n;n;n;n;event_1_91604710;nw;find_task_road secret',
        '桃花泉': 'jh 3;s;s;s;s;s;nw;n;n;e;find_task_road secret',
        '观景台': 'jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;find_task_road secret',
        '临渊石台': 'jh 4;n;n;n;n;n;n;n;n;n;e;n;find_task_road secret',
        '无极老姆洞': 'jh 22;n;n;w;n;n;n;n;find_task_road secret',
        '夕阳岭': 'jh 9;n;n;e;find_task_road secret',
        '玉女峰': 'jh 4;n;n;n;n;n;n;n;n;w;find_task_road secret',
        '无名山峡谷': 'jh 29;n;n;n;n',
        '长空栈道': 'jh 4;n;n;n;n;n;n;n;n;n;e;find_task_road secret'
    };

    var pathSecret = [];
    this.dispatchMessage=function(b){
        var type = b.get("type"),subtype = b.get("subtype");
        if (b.get("type") == 'notice') {
            //你打坐完毕，收起全身的真气游走，站起身来
            if (b.get('msg').indexOf('你打坐完毕') >= 0) {
                clickButton('exercise', 0);
            }
            //自动回到悬红
            //if (b.get('msg').indexOf('【江湖悬红榜】任务已完成') >= 0) {
            //go('jh 1;w;event_1_40923067');
            //}


            //你从寒玉床上爬起，结束了这次练功
            if (b.get('msg').indexOf('你从寒玉床上爬起') >= 0) {
                if (holdflg)
                {
                    clickButton('home');
                }
                clickButton('look room');
                clickButton('sleep_hanyuchuang', 0);
            }
            if (PaiHangFlg == 1 && b.get('msg').indexOf('挑战排行榜高手胜利') >= 0) {
                clickButton('fight_hero 1');
            }
            if (ShiJianFlg == 1 && b.get('msg').indexOf('试剑胜利') >= 0) {
                clickButton('swords fight_test go');
            }
            //今日挑战高手的次数已达上限，明日再来
            if (PaiHangFlg == 1 && b.get('msg').indexOf('今日挑战高手的次数已达上限') >= 0) {
                ButtonManager.resetButtonById("paihang");
                //clickButton('home');
            }
            if (ShiJianFlg == 1 && b.get('msg').indexOf('你今天试剑次数已达限额') >= 0) {
                ButtonManager.resetButtonById("shijian");
            }
            if (b.get('msg').indexOf('南斗鬼煞阵升级完毕') >= 0) {
                clickButton('hhjz xiulian go', 1);
            }
        }


        if (b.get('type') == 'main_msg' && b.get('ctype') == 'text') {
            //你打坐完毕，收起全身的真气游走，站起身来
            if (b.get('msg').indexOf('你打坐完毕') >= 0) {
                clickButton('exercise', 0);
            }
            //自动回到悬红
            //if (b.get('type').indexOf('【江湖悬红榜】任务已完成') >= 0) {
            //go('jh 1;w;event_1_40923067');
            //}
            //你从寒玉床上爬起，结束了这次练功
            if (b.get('msg').indexOf('你从寒玉床上爬起') >= 0) {
                if (holdflg)
                {
                    clickButton('home');
                }
                clickButton('sleep_hanyuchuang', 0);
            }
            if (b.get('msg').indexOf('再继续下去全身经脉恐怕要被被极寒冻断') >= 0) {
                clickButton('home');
            }
            if (b.get('msg').indexOf('片玄铁碎片') >= 0 && b.get('msg').indexOf('的尸体里搜出') >= 0) {
                clearInterval(getYXIntervalFunc);
                clickButton('home');
            }
            if (b.get('msg').indexOf('这是你今天完成的第') >= 0 && (b.get('msg').indexOf('游侠') >= 0 || b.get('msg').indexOf('场跨服青龙') >= 0 || b.get('msg').indexOf('逃犯') >= 0)) {
                clickButton('home');
                setTimeout(gohome,1000);
            }
            if (b.get('msg').indexOf('好在有保险卡，没有降低技能等级！') >= 0) {
                //clickButton('score');
                //clickButton('prev');
            }
            if (BB3flg == 1) {
                let BB3msg = g_simul_efun.replaceControlCharBlank(b.get('msg')).match('(.*?)对著(.*?)喝道(.*?)');
                if (BB3msg != null)
                {
                    sessionStorage.setItem("Enemy",BB3msg[2]);
                }
            }
        }

    }
}

var syncHandle  = {
    openFlag:false,
    start(){
        clickButton('team')
        syncHandle.openFlag = true;
        clickButton = syncHandle.clickButton;
    },
    end(){
        syncHandle.openFlag = false;
    },
    clickButton(a,e){
        if(
            syncHandle.openFlag
            && g_obj_map.get("msg_team") && g_obj_map.get("msg_team").get("is_leader") && g_obj_map.get("msg_team").get("is_leader") == '1'
            && a.indexOf('playskill')== -1	//出招
            && a.indexOf('chat')== -1	//说话
            //&& a.indexOf('items')== -1		//物品相关
            && a.indexOf('recovery')== -1	//恢复
            && a.indexOf('look_npc') == -1
            && a.indexOf('attrs') == -1
        ){
            let tmp = a.replace(/ /g,'$')
            //console.log(tmp)
            clickButton('team chat synCmd='+tmp)
        }
        if(a&&!(0==a.length||"none"==a||""==a||"0"==a)){
            var g=a.split(" "),f,c;
            0<g.length?(f=g[0],c=g.slice(1).join(" ")):(f=a,c="");
            var d=g_obj_map.get("msg_attrs"),h;
            h=d?parseInt(d.get("lvl")):1;
            var b=0;
            if(d){
                if(b=d.get("master_id"),""==b||"0"==b)b=0
            }
            else
                b=0;
            if("fullScreen"==f)
                g_gmain.goFullScreen();
            else if("score_base"==f)
                gSocketMsg.show_score();
            else if("score_info"==f)
                gSocketMsg.show_score_info();
            else if("prev"==f)
                gSocketMsg.showPrev();
            else if("prev_combat"==f)
                gSocketMsg.showPrev(),$("div#out").scrollTop(0),gSocketMsg._page_scrollTop=0;
            else if("jhgo"==f)
                gSocketMsg.jh_go(1<g.length?g[1]:"");
            else if("fbgo"==f)
                gSocketMsg.fb_go(1<g.length?g[1]:"");
            else if("jhselect"==f)
                gSocketMsg.jh_select();
            else if("fbselect"==f)
                gSocketMsg.fb_select();
            else if("my_skills"==f)
                gSocketMsg.show_skills(0,1<g.length?g[1]:"");
            else if("show_my_skills"==f)
                gSocketMsg.show_skills(0);
            else if("shopinfo"==f)
                0<g.length&&(d=g_obj_map.get("msg_shops"))&&d.put("selected",g[1]),gSocketMsg.show_shop_info();
            else if("swords_shopinfo"==f)
                0<g.length&&(d=g_obj_map.get("msg_swords_shop"))&&d.put("selected",g[1]),gSocketMsg.show_swords_shop_info();
            else if("sortinfo"==f)
                0<g.length&&(d=g_obj_map.get("msg_sorts"))&&d.put("selected",g[1]),gSocketMsg.show_sort_info();
            else if("buyinfo"==f)
                0<g.length&&(d=g_obj_map.get("msg_buys"))&&d.put("selected",g[1]),gSocketMsg.show_buy_info();
            else{
                if("enableskill"==f)
                    if(1<c.length)
                        send(c+"\n"),clickButton("enable");
                    else
                        return;
                else{
                    if("show_enable"==f){
                        3<=g.length&&enable_select_click(g[1],g[2]);
                        return
                    }
                    if("go_chat"==f){
                        if(15>h){
                            g_gmain.notify_fail("15\u7ea7\u5f00\u653e\u6b64\u529f\u80fd\u3002");
                            return
                        }
                        0==c.length?gSocketMsg.show_channel():gSocketMsg.show_channel(c);
                        return
                    }
                    if("goscore"==f){
                        if(7>h){
                            g_gmain.notify_fail("7\u7ea7\u5f00\u653e\u6b64\u529f\u80fd\u3002");
                            return
                        }
                        a="score"
                    }
                    else if("golook_room"==f){
                        if(!b&&100>h){
                            g_gmain.notify_fail("\u62dc\u5e08\u540e\u5f00\u653e\u6b64\u529f\u80fd\u3002");
                            return
                        }
                        a="look_room"
                    }
                    else if("gohome"==f)
                        a="home";
                    else{
                        if("cancel_tell"==f){
                            gSocketMsg.cancel_tell();
                            return
                        }
                        if("send_chat"==f){
                            gSocketMsg.send_chat();
                            return
                        }
                        if("quit_chat"==f)
                            if(gSocketMsg.quit_chat(),g_combat_chat)
                                gSocketMsg.go_combat(),a="refresh_vs";
                            else
                                return;
                        else{
                            if("quit_exercise"==f){
                                gSocketMsg2.quit_exercise();
                                return
                            }
                            if("telluser"==f){
                                0<c.length&&(gSocketMsg.show_channel(),g_obj_map.put("tell_to_uid",c),gSocketMsg.show_channel("tell"),gSocketMsg.get_chat_bottom_msg());
                                return
                            }
                            if("gopay"==f){
                                gSocketMsg.go_pay();
                                return
                            }
                            if("client_prompt"==f){
                                f=(d=g_obj_map.get("msg_attrs"))?(f=d.get("s_user"))?parseInt(f):0:0;
                                g=4<=g.length&&0==c.indexOf("home apprentice")?f?"  \u662f\u5426\u786e\u5b9a\u8981\u52a0\u5165\u6b64\u95e8\u6d3e\uff1f\n\n\n\n":"  \u662f\u5426\u786e\u5b9a\u8981\u52a0\u5165"+HIG+g[3]+NOR+"\uff1f\n\n\n\n":3<=g.length&&0==c.indexOf("exercise stop")?"  \u662f\u5426\u786e\u5b9a\u8981\u505c\u6b62\u6253\u5750\uff1f\n\n\n\n":3<=g.length&&0==c.indexOf("work stop")?"  \u662f\u5426\u786e\u5b9a\u8981\u505c\u6b62\u6302\u673a\uff1f\n\n\n\n":3<=g.length&&0==c.indexOf("practice stop")?"  \u662f\u5426\u786e\u5b9a\u8981\u505c\u6b62\u7ec3\u4e60\u6280\u80fd\uff1f\n\n\n\n":
                                3<=g.length&&0==c.indexOf("tupo stop")?"  \u662f\u5426\u786e\u5b9a\u8981\u505c\u6b62\u7a81\u7834\u6280\u80fd\uff1f\n\n\n\n":"  \u662f\u5426\u786e\u5b9a\u64cd\u4f5c\uff1f\n\n\n\n";
                                g_gmain.send_prompt(g,c,"\u786e\u5b9a",e);
                                return
                            }
                            if("home_prompt"==f)
                                if(gSocketMsg.is_in_home())
                                    a="home";
                                else{
                                    g_gmain.send_prompt("  \u662f\u5426\u786e\u5b9a\u8981\u79bb\u5f00\u95ef\u8361\u6c5f\u6e56\uff0c\u53bb\u5f80\u6e38\u620f\u4e3b\u9875\uff1f\n\n\n\n","home","\u786e\u5b9a");
                                    return
                                }
                            else{
                                if("cancel_prompt"==f){
                                    gSocketMsg.showPrev();
                                    return
                                }
                                if("client_map"==f){
                                    gSocketMsg.show_map();
                                    return
                                }
                                if("client_reload"==f){
                                    window.location.reload();
                                    return
                                }
                                if("client_apprentice"==f){
                                    gSocketMsg.show_family_info(c);
                                    return
                                }
                                if("skin_select"==f){
                                    c=parseInt(c);
                                    if(1>c||3<c)
                                        c=1;
                                    if("undefined"!=typeof localStorage)
                                        try{localStorage.removeItem("game_skin"),localStorage.setItem("game_skin",""+c)}
                                    catch(i){}
                                    g=document.location.href;
                                    g=change_game_skin(g,c);
                                    document.location.href=g;
                                    return
                                }
                                if("client_exercise"==f){
                                    gSocketMsg2.client_exercise_click();
                                    return
                                }
                                if("exercise_list"==f){
                                    if("exercise_list click go"==a&&(d=g_obj_map.get("msg_exercise_list"))&&0>=parseInt(d.get("tl"))&&0<gSocketMsg2.g_no_exercise_click){
                                        gSocketMsg2.g_no_exercise_click--;
                                        return
                                    }
                                }
                                else{
                                    if("empty_chat"==f){
                                        chatMsg=[];
                                        gSocketMsg.show_channel();
                                        g_save_chat_cache=1;
                                        return
                                    }
                                    if("combat_chat"==f){
                                        if(15>h)
                                            return;
                                        fight(0);
                                        g_combat_chat=1;
                                        gSocketMsg.show_channel();
                                        return
                                    }
                                    if("show_jm"==f){
                                        gSocketMsg2.show_jm(c);
                                        return
                                    }
                                    if("clan_view"==f){
                                        gSocketMsg2.show_clan();
                                        return
                                    }
                                    if("clan_members"==f){
                                        gSocketMsg2.show_clan_members();
                                        return
                                    }
                                    if("clan_member_info"==f){
                                        0<g.length&&(d=g_obj_map.get("msg_clan_view"))&&d.put("selected_member",g[1]);
                                        gSocketMsg2.show_clan_member_info();
                                        return
                                    }
                                    if("clan_shop"==f){
                                        gSocketMsg2.show_clan_shop();
                                        return
                                    }
                                    if("clan_role_detail"==f){
                                        gSocketMsg2.show_clan_role_detail();
                                        return
                                    }
                                }
                            }
                        }
                    }
                }
                send(a+"\n");
                "attrs"!=f&&"swords"!=f&&g_gmain.show_loading();
                if(e){
                    e=parseInt(e);
                    1>e&&(e=1);
                    for(c=0;c<e;c++)
                        gSocketMsg.showPrev()
                }
            }
        }
    },
}

var autoEvent=new autoEvent();
//抢红包
function GetHongbao(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), msg = b.get("msg"),subtype = b.get("subtype");
        //console.log("type:"+type+";msg:"+msg+";subtype:"+b.get("subtype"));
        if (type == "channel" && subtype=="hongbao" && /hongbao qiang \d gn(\d){16}/.test(msg)) {
            if(hongbaoGetFull && /hongbao qiang 2 gn(\d){16}/.test(msg)){
                return;
            }
            var regexObj=new RegExp(/hongbao qiang \d gn(\d){16}/,"g");
            var a=regexObj.exec(msg);
            HongBaoList.unshift(a[0]);
            if(!qianghongbaoTimer){
                RunHongBao();
            }
        }

        else if(hongbaoGetFull==false && type=="notice" && subtype=="notify_fail" && msg && msg.indexOf("新春红包的次数已达到上限了，明天再抢吧")>-1){
            HongBaoList=[];
            hongbaoGetFull=true;
            setTimeout(function(){hongbaoGetFull=false;},3600000);
        }
    }
}
function RunHongBao(){
    if(HongBaoList.length>0){
        var up=HongBaoList.length;
        var index=Math.floor((Math.random()*up));
        var item=HongBaoList[index];
        HongBaoList.splice(index,1);
        go(item);
        qianghongbaoTimer=setTimeout(function(){RunHongBao();},5000);
    }else{
        qianghongbaoTimer=null;
    }
}
var qianghongbaoTimer=null;
var HongBaoList=[];
var getHongBao=new GetHongbao();
var hongbaoGetFull=false;

(function (window) {
    window.go = function(dir) {
        //console.debug("开始执行：", dir);
        var d = dir.split(";");
        for (var i = 0; i < d.length; i++)
            overrideclick(d[i], 0);
    };
    window.singleBattleTrigger=0;
    window.singleBattleInstance=null;
    window.singleBattle=function(callback){
        this.timer=null;
        this.dispatchMessage=function(b){

            var type = b.get("type"), subType = b.get("subtype");
            if (type=="vs"&&subType=="vs_info"){ //这是进入战斗的提示
                neigongPlayCount=0;
                clearInterval(this.timer);
                setTimeout(ninesword6,500);
                this.timer=setInterval(ninesword6,1000);
            }else if (type=="vs"&& subType=="combat_result"){
                window.singleBattleTrigger=0;
                clearInterval(this.timer);
                if(callback){
                    callback();
                }
            }
        }
    };
    window.hasGoToEnd=function(){
        return cmdlist.length<=0;
    }

    var ql_w = {
        '书房': 1,
        '打铁铺子': 2,
        '桑邻药铺': 3,
        '南市': 4,
        '桃花别院': 5,
        '绣楼': 6,
        '北大街': 7,
        '钱庄': 8,
        '杂货铺': 9,
        '祠堂大门': 10,
        '厅堂': 11
    };
    window.go_ql = function(w) {
        zx(ql_w[w]);
    }

    //autoGodview();
    function go_yx(w){
        if (w.startsWith("雪亭镇")) {
            go("jh 1;e;n");
        } else if (w.startsWith("洛阳")) {
            go("jh 2;n;n");
        } else if (w.startsWith("华山村")) {
            go("jh 3;s;s");
        } else if (w.startsWith("华山")) {
            go("jh 4;n;n");
        } else if (w.startsWith("扬州")) {
            go("jh 5;n;n");
        } else if (w.startsWith("丐帮")) {
            go("jh 6;event_1_98623439;s");
        } else if (w.startsWith("乔阴县")) {
            go("jh 7;s;s;s");
        } else if (w.startsWith("峨眉山")) {
            go("jh 8;w;nw;n;n;n;n");
        } else if (w.startsWith("恒山")) {
            go("jh 9;n;n;n");
        } else if (w.startsWith("武当山")) {
            go("jh 10;w;n;n");
        } else if (w.startsWith("晚月庄")) {
            go("jh 11;e;e;s;sw;se;w");
        } else if (w.startsWith("水烟阁")) {
            go("jh 12;n;n;n");
        } else if (w.startsWith("少林寺")) {
            go("jh 13;n;n");
        } else if (w.startsWith("唐门")) {
            go("jh 14;w;n;n;n");
        } else if (w.startsWith("青城山")) {
            go("jh 15;s;s");
        } else if (w.startsWith("逍遥林")) {
            go("jh 16;s;s");
        } else if (w.startsWith("开封")) {
            go("jh 17;n;n");
        } else if (w.startsWith("明教")) {
            go("jh 18;n;nw;n;n");
        } else if (w.startsWith("全真教")) {
            go("jh 19;s;s");
        } else if (w.startsWith("古墓")) {
            go("jh 20;w;w");
        } else if (w.startsWith("白驮山")) {
            go("jh 21;nw;w");
        } else if (w.startsWith("嵩山")) {
            go("jh 22;n;n");
        } else if (w.startsWith("寒梅庄")) {
            go("jh 23");
        } else if (w.startsWith("泰山")) {
            go("jh 24");
        } else if (w.startsWith("大旗门")) {
            go("jh 25");
        } else if (w.startsWith("大昭寺")) {
            go("jh 26");
        } else if (w.startsWith("魔教")) {
            go("jh 27");
        }

        random_move();
    }

    function random_move() {
        var v = Math.random();
        if (v < 0.25) go("e")
        else if (v < 0.5) go("w")
        else if (v < 0.75) go("s")
        else go("n");
    }

    function zx(x) {
        x = parseInt(x);
        //console.debug(x);

        if (x == 1) {
            go("jh 1;e;n;e;e;e;e;n");
        } else if (x == 2) {
            go("jh 1;e;n;n;w");
        } else if (x == 3) {
            go("jh 1;e;n;n;n;w");
        }

        if (x == 4) {
            go("jh 2;n;n;e")
        }

        if (x == 5) {
            go("jh 2;n;n;n;n;w;s");
        }
        if (x == 6) {
            go("jh 2;n;n;n;n;w;s;w");
        }
        if (x == 7) {
            go("jh 2;n;n;n;n;n;n;n");
        }
        if (x == 8) {
            go("jh 2;n;n;n;n;n;n;;n;e");
        }

        if (x == 9) {
            go("jh 3;s;s;e");
        }
        if (x == 10) {
            go("jh 3;s;s;w");
        }
        if (x == 11) {
            go("jh 3;s;s;w;n");
        }

    }


    function MyMap(){
        this.elements = [];
        this.size = function() {
            return this.elements.length

        };
        this.isEmpty = function() {
            return 1 > this.elements.length
        };
        this.clear = function() {
            this.elements = []
        };
        this.put = function(a, b) {
            for (var c = !1, d = 0; d < this.elements.length; d++)
                if (this.elements[d].key == a) {
                    c = !0;
                    this.elements[d].value = b;
                    break
                }
            !1 == c && this.elements.push({
                key: a,
                value: b
            })
        };
        this.remove = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key == a)
                        return this.elements.splice(c, 1), !0
            } catch (d) {
                b =
                    !1
            }
            return b
        };
        this.get = function(a) {
            try {
                for (var b = 0; b < this.elements.length; b++)
                    if (this.elements[b].key == a)
                        return this.elements[b].value
            } catch (c) {
                return null
            }
        };
        this.copy = function(a) {
            null == a && (a = new Map);
            try {
                for (var b = 0; b < this.elements.length; b++)
                    a.put(this.elements[b].key, this.elements[b].value);
                return a
            } catch (c) {
                return null
            }
        };
        this.element = function(a) {
            return 0 > a || a >= this.elements.length ? null : this.elements[a]
        };
        this.containsKey = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key ==
                        a) {
                        b = !0;
                        break
                    }
            } catch (d) {
                b = !1
            }
            return b
        };
        this.containsValue = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].value == a) {
                        b = !0;
                        break
                    }
            } catch (d) {
                b = !1
            }
            return b
        };
        this.values = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].value);
            return a
        };
        this.keys = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].key);
            return a
        }
    }

    function Trigger(r, h, c, n) {
        this.regexp = r;
        this.handler = h;
        this.class = c;
        this.name = n;

        this.enabled = true;

        this.trigger = function(line) {
            if (!this.enabled) return;

            if (!this.regexp.test(line)) return;

            //console.log("触发器: " + this.regexp + "触发了");
            var m = line.match(this.regexp);
            this.handler(m);
        }

        this.enable = function() {
            this.enabled = true;
        }

        this.disable = function() {
            this.enabled = false;
        }

    }

    jh = function(w) {
        if (w == 'xt') w = 1;
        if (w == 'ly') w = 2;
        if (w == 'hsc') w = 3;
        if (w == 'hs') w = 4;
        if (w == 'yz') w = 5;
        if (w == 'gb') w = 6;
        if (w == 'qy') w = 7;
        if (w == 'em') w = 8;
        if (w == 'hs2') w = 9;
        if (w == 'wd') w = 10;
        if (w == 'wy') w = 11;
        if (w == 'sy') w = 12;
        if (w == 'sl') w = 13;
        if (w == 'tm') w = 14;
        if (w == 'qc') w = 15;
        if (w == 'xx') w = 16;
        if (w == 'kf') w = 17;
        if (w == 'gmd') w = 18;
        if (w == 'qz') w = 19;
        if (w == 'gm') w = 20;
        if (w == 'bt') w = 21;
        if (w == 'ss') w = 22;
        if (w == 'mz') w = 23;
        if (w == 'ts') w = 24;


        overrideclick("jh " + w, 0);

    };


    function Triggers() {
        this.allTriggers = [];

        this.trigger = function(line) {
            var t = this.allTriggers.slice(0);
            for (var i = 0, l = t.length; i < l; i++) {
                t[i].trigger(line);
            }
        }

        this.newTrigger = function(r, h, c, n) {
            var t = new Trigger(r, h, c, n);
            if (n) {
                for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                    if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1);
                }
            }

            this.allTriggers.push(t);

            return t;
        }

        this.enableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.enable();
            }
        }

        this.disableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.disable();
            }
        }

        this.enableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.enable();
            }
        }

        this.disableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.disable();
            }
        }

        this.removeByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t && t.class == c) this.allTriggers.splice(i, 1);
            }
        }

        this.removeByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) this.allTriggers.splice(i, 1);
            }
        }
    }

    window.triggers = new Triggers;

    //window.game = this;

    window.attach = function() {
        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function(a, e, f, g) {
            var hidemsg=a.replace(/<[^>]*>/g, "");
            oldWriteToScreen(a, e, f, g);
            a = a.replace(/<[^>]*>/g, "");
            triggers.trigger(a);
        };

        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;

        gSocketMsg.dispatchMessage = function(b) {
            this.old(b);
            TriggerFuc(b);
            cmdTrigger(b);
            var a = b.get("type"), c = b.get("subtype"),msg = b.get('msg');
            var objs,i,lz;
            //console.log("type:"+a+";subtype:"+c+";msg:"+b.get("msg"));
            //自动重连
            if(!g_gmain.is_fighting && (fight_bx == 1)){
                //console.log('非战斗，重置buff状态')
                fight_tx = 0;
                fight_bx = 0;
                fight_bs = 0;
                fight_lx = 0;
                fight_blood = 0;
                fight_blood2 = 0;
                fight_dodge = 0;
                fight_zixia = 0;
                fight_buxuan=0;
                fight_yihan = 0;
                fight_bing1 = 0;
                fight_bing2 = 0;
                lastBusy = '';
            }
            if (a=="disconnect" && c=="change")
            {
                //connectTime = new Date().getTime();

                let tmpTime = new Date().getTime();
                if (autoreconnectTrigger == 2)
                {

                    if(tmpTime - connectTime < 5000 && conTimes>2){
                        conTimes=0;
                        ButtonManager.resetButtonById("holdconnect");
                        ButtonManager.clickButtonById("autoreconnect");
                        clearTimeout(connectTimeout)
                        connectTimeout = setTimeout(function(){
                            g_gmain.g_delay_connect=0;
                            connectServer();
                        },850*1000)
                    }else{
                        g_gmain.g_delay_connect=0;
                        connectServer();
                        if(tmpTime - connectTime > 10000)
                            conTimes = 0;
                        conTimes ++;
                    }
                }
                else if (autoreconnectTrigger == 1){
                    conTimes = 0;
                    clearTimeout(connectTimeout)
                    connectTimeout = setTimeout(function(){
                        g_gmain.g_delay_connect=0;
                        connectServer();
                    },850*1000)
                }
                connectTime = tmpTime;
            }
            else if(a=="g_login" && c=="login_ret"){//重新连接
                if(new Date().getTime() - connectTime > 10000){
                    console.log('重连，同步数据')
                    //console.log(connectTime)
                    //console.log(new Date().getTime())
                    getOption();
                }
            }else if (a =="vs"){
                if(dantiaoTrigger == 1)
                    dantiaoPanduan(b)
                if (c=="combat_result"){
                    fight_tx = 0;
                    fight_bx = 0;
                    fight_bs = 0;
                    fight_lx = 0;
                    fight_blood = 0;
                    fight_blood2 = 0;
                    fight_dodge = 0;
                    fight_zixia = 0;
                    fight_buxuan = 0;
                    fight_yihan = 0;
                    fight_bing1 = 0;
                    fight_bing2 = 0;
                    lastBusy = '';
                    qfcurrentNPCIndex = 0;
                    currentNPCIndex = 0;
                    ngcount = 0;
                    //console.log('战斗结束，重置状态'+new Date().getTime())
                  //clickButton('prev_combat');
                    clickButton('golook_room');
                }else if (c == "text") {
                    if(msg){
                        msg = g_simul_efun.replaceControlCharBlank(msg)
                        if(fight_bx == 0 && (msg.match('你骤地怒吼一声') || msg.match('你歇斯底里的咆哮'))){
                            fight_bx = 1;
                        }
                        if(bloodTmp == 0 && msg.match('你深深吸了几口气，脸色看起来好多了')){
                            fight_blood ++;
                            bloodTmp = 1;
                            //clearTimeout(stime2);
                            stime2 = setTimeout(function(){bloodTmp = 0},200)
                        }
                        if(msg.match('全身血液由红转紫，你的气血在短时间内提高了')){
                            fight_blood2 ++;
                            //console.log('紫血')
                        }

                        if(fight_tx == 0 && msg.match('你运起天邪神功')){
                            fight_tx = 1;
                            tx_time = new Date().getTime();
                            //console.log(tx_time);
                        }
                        if(fight_bs == 0 && checkBS==1 && msg.indexOf('念心为我，玄天之志。你短时间内提升')>=0){
                            fight_bs = 1;
                            //console.log('获得白首')
                            clearTimeout(bstime)
                            checkBS = 0;
                        }
                        if(fight_lx == 0 && msg.indexOf('龙象般若功终于在顶层爆发出骇人威力')>=0){
                            fight_lx = 1;
                            //console.log('获得龙象')
                        }
                        if(fight_buxuan == 0 && msg.indexOf('觉得头晕目眩，失去了方向')>=0){
                            fight_buxuan = 1;
                            lastBusy = 'bx'
                            buxuan_time = new Date().getTime();
                            //console.log('步玄中了：'+buxuan_time)
                        }
                    }
                }
                else if (c == "attack"){	//战斗中同步气血
                    var kee = b.get('kee');
                    var rid = b.get('rid');
                    if (rid == g_obj_map.get("msg_attrs").get('id')) {
                        user_kee = kee;
                    }
                }else if (c == "lose_force"){	//战斗中同步内力
                    var id = b.get('id');
                    var force = b.get('force');
                    if (id == g_obj_map.get("msg_attrs").get('id')) {
                        user_force = force;
                    }
                }
            }else if (a == 'attr' || (a == 'score' && c == 'user')) {
                //获取个人属性
                if(userid == ''){
                    userid = b.get('id');
                    username = b.get('name');
                    //getOption();
                }
                if(b.get('id') == g_obj_map.get("msg_attrs").get('id')){
                    if(b.get('kee')) user_kee = Number(b.get('kee'));
                    if(b.get('max_kee')) user_maxkee = Number(b.get('max_kee'));
                    if(b.get('force')) user_force = Number(b.get('force'));
                    if(b.get('max_force')) user_maxforce = Number(b.get('max_force'));
                    if(b.get('yuanbao')) user_yuanbao = Number(b.get('yuanbao'));
                }
                return
            } else if (a == "attrs_changed") {
                //属性变化
                if(b.get('kee')) user_kee = Number(b.get('kee'));
                if(b.get('max_kee')) user_maxkee = Number(b.get('max_kee'));
                if(b.get('force')) user_force = Number(b.get('force'));
                if(b.get('max_force')) user_maxforce = Number(b.get('max_force'));
                return
            }
            else if (a == 'main_msg' && b.get('ctype') == 'text') {
                if(syncHandle.openFlag){
                    if(ll = msg.match(/【队伍】.*?：synCmd=(.*)/)){
                        if(g_obj_map.get("msg_team") && g_obj_map.get("msg_team").get("is_leader") && g_obj_map.get("msg_team").get("is_leader") != '1'){
                            let cmd = ll[1]
                            cmd = cmd.replace(/\$/g,' ')
                            cmd = cmd.replace(/。/g,'.')
                            cmd = cmd.replace(/，/g,',')
                            //console.log(cmd)
                            clickButton(cmd)
                        }
                    }
                }
                if(autoBangFour){
                    if(ll = msg.match(/开启了帮派副本.*十月围城.*【(.*)】/)){
                        if(!g_gmain.is_fighting){

                            let tmp = ll[1]
                            let n = '一二三'.indexOf(tmp)
                            if(n>=0){
                                busy = 1;
                                clickButton('clan fb enter shiyueweiqiang-'+(n+1), 0)
                            }
                            clearTimeout(rcTime);
                            rcTime = setTimeout(function(){
                                busy = 0
                            },15*50*1000)
                        }
                    }
                }
                if(autoJINGMAI){
                    if(msg.match(/你的八荒功已臻化境无人能及，前往江湖与有缘人会面/)){
                        go2('jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637');
                        go2('#7 ask xiaoyao_tonglao');//天山姥姥
                    }
                    else if(msg.match(/童冰烟说道：你的八荒功非比寻常，想必是我逍遥派之人/)> -1){
                        go2('jh 2;n;n;n;n;w;s;w');
                        go2('#7 ask luoyang_luoyang9');
                        //柳小花
                    }
                }
                if (msg.indexOf('场逃犯') > -1) {//这是你今天完成的第1/5场逃犯任务！
                    if(ll = msg.match(/第(.*)\/(.*)场逃犯/)){
                        lj_paras.TfTimes = parseInt(ll[1]);
                        lj_paras.maxTfTimes = parseInt(ll[2]);
                        saveOption(lj_paras,1);
                    }
                }else if(msg.indexOf('雪山派活动任务')>=0){
                    if(ll = msg.match(/第(.*)\/(.*)个雪山派/)){
                        lj_paras.XSTimes = parseInt(ll[1]);
                        lj_paras.maxXSTimes = parseInt(ll[2]);
                        saveOption(lj_paras,1);
                    }
                }else if(ll = msg.match(/完成(.*)_(.*)任务(。得到|，消耗).*当前积分：(.*)，/)){
                    if(ll[1].indexOf('鼠')>=0){
                        if(lj_paras.wushu.indexOf(ll[1]) == -1){
                            lj_paras.wushu += ll[1]+'，'
                            lj_paras.wushujifen = g_simul_efun.replaceControlCharBlank(ll[4])
                            saveOption(lj_paras,1);

                            for(let i=0;i<wushuList.length;i++){
                                if(lj_paras.wushu.indexOf(wushuList[i]) == -1)
                                    return;
                            }
                            go2('jh 17;n;event_1_55568398')

                        }
                    }
                }else if(ll=msg.match(/完成展昭任务(。得到|，消耗).*当前积分：(.*)，/)){
                    lj_paras.zhanzhao ++
                    lj_paras.wushujifen = g_simul_efun.replaceControlCharBlank(ll[2])
                    saveOption(lj_paras,1);
                    if(wushu.trigger == 1 && lj_paras.zhanzhao < 3){
                        if(g_obj_map.get('msg_room').get("obj_p") == '4208'){
                            setTimeout(function(){
                                TriggerFuc = wushu.ask
                                wushu.npc = '展昭'
                                clickButton('say 五鼠')
                            },1000)
                        }
                    }
                }
                else if(msg.indexOf('场宝藏') > -1){//这是你今天完成的第1/4场宝藏秘图之战！
                    if(ll = msg.match(/第(.*)\/(.*)场宝藏/)){
                        lj_paras.ptTimes = parseInt(ll[1]);
                        lj_paras.maxptTimes = parseInt(ll[2]);
                        saveOption(lj_paras,1);
                    }
                }else if(msg.indexOf('帮派副本完成')>-1 || msg.indexOf('帮派副本胜利')>=0){
                    busy = 0
                    setTimeout(clickButton,1000,'home')
                    ButtonManager.resetButtonById("killgood");
                    //帮派副本完成。
                }
                else if(wushi.lingjiang == 0 && msg.match(/【潜龙在渊】(.*)大战已结束/)){
                    wushi.lingjiang = 1;
                    setTimeout(function(){wushi.lingjiang = 0},3000)
                    console.log('开始识别舞狮奖励')
                }
                else if(wushi.lingjiang == 1 && msg.match(/获得了潜能：(.*)/)){
                    //console.log(msg)
                    ll = msg.match(/获得了潜能：(.*)/)
                    if(!ll) return;
                    //console.log(ll)
                    let qn = Number(ll[1])
                    for(let i=0;i<qianlongList.length;i++){
                        let tmp = qianlongList[i]
                        if (qn == tmp.exp){
                            lj_paras.wushi[tmp.id] = 1;
                            saveOption(lj_paras,1);
                            console.log(tmp.id+'领奖')
                            break;
                        }
                    }
                }
                else if(msg.indexOf('收起全身的真气游走')>-1){
                    clickButton('exercise', 0)
                }
            }

            else if(a == 'notice'){
                if(msg.indexOf('你今天的逃犯任务次数已达到上限') > -1){
                    lj_paras.TfTimes = lj_paras.maxTfTimes;
                    saveOption(lj_paras,1);
                }else if(msg.indexOf('你从地髓石乳中出来') >= 0){
                    clickButton('sleep_hanyuchuang', 1)
                }else if(msg.indexOf('【我和我的祖国】')>=0){
                    //changge.go(msg)
                    setTimeout(changge.go,500,msg)
                    return;
                }else if(msg.indexOf('击杀雪山派弟子次数已达到上限')>-1){
                    lj_paras.XSTimes = lj_paras.maxXSTimes;
                    saveOption(lj_paras,1);
                }else if(ll = msg.match(/你今天已完成(.*)的任务/)){
                    if(ll[1].indexOf('鼠')>=0){
                        if(lj_paras.wushu.indexOf(ll[1]) == -1){
                            lj_paras.wushu += ll[1]+'，'
                            saveOption(lj_paras,1);
                        }
                    }
                }
                else if(msg.indexOf('今天的展昭任务已完成了')>=0){
                    lj_paras.zhanzhao = 3
                    saveOption(lj_paras,1);
                }
                if(ll = msg.match(/浸泡地髓石乳增加了(.*)/)){
                    console.log('浸泡地髓石乳增加：'+ll[1]+'  '+new Date().format("yyyy-MM-dd hh:mm:ss"));
                }
            }

            else if(a == 'items'){
                objs = b.keys();
                for(i=0;i<objs.length;i++){
                    if(objs[i].match(/items(.*)/)){
                        if(lz = b.get(objs[i]).match(/obj_jianghuling,.*?江湖令.*?,(.*),0,枚/))
                            jianghuling = Number(lz[1]);
                        else if(lz = b.get(objs[i]).match(/obj_shimenling,师门令,(.*),0,枚/))
                            shimenling = Number(lz[1]);
                        else if(lz = b.get(objs[i]).match(/obj_bangpailing,.*?帮派令.*?,(.*),0,枚/))
                            bangpailing = Number(lz[1]);
                        else if(lz = b.get(objs[i]).match(/obj_zhuangyuantie,.*?状元贴.*?,(.*),0,张/))
                            zhuangyuantie = Number(lz[1]);
                        else if(lz = b.get(objs[i]).match(/obj_zuguo(.*),.*?,(.*),0,/)){
                            let n = Number(lz[1]);
                            let m = Number(lz[2]);
                            changge.gc['zuguo'+n] = m;
                        }
                    }
                }
                return
            }

            //if(answerTrigger==1){
            //					question.dispatchMessage(b);
            //}
            //if (fishingTrigger==1){
            //	fishfeedback.dispatchMessage(b);
            //}


            if (escapeTrigger==1){
                escape.dispatchMessage(b);
            }
            if (escapeTrigger1==1){
                escape1.dispatchMessage(b);
            }
            if(fanjiTrigger==1||hitnpctarget==1||hitplayertarget==1||followplayertarget==1){
                combat.dispatchMessage(b);
            }
            if (kuafuTrigger==1){
                kuafu.dispatchMessage(b);
            }
            if (tianjianTrigger==1){
                tianjian.dispatchMessage(b);
            }
            if (Debug==1){
                debugm.dispatchMessage(b);
            }

            //if (GodMode==1){
            //	godview.dispatchMessage(b);
            //}
            if (jzstart==1){
                jz.dispatchMessage(b);
            }

            //if (FriendTrigger == 1){
            //	FriendFeed.dispatchMessage(b);
            //}
            if (bangfuTrigger==1 || genzhaoTrigger == 1){
                bangfu.dispatchMessage(b);
            }

            if (QLtrigger==1 && busy == 0){
                qlMon.dispatchMessage(b);
            }

            if(bihuataopaoTrigger==1){
                bihuataopao.dispatchMessage(b);
            }
            if(PTtrigger==1 && lj_paras.ptTimes <lj_paras.maxptTimes && busy == 0){
                ptMon.dispatchMessage(b);
            }
            if(hideNpc==1){
                showhide.dispatchMessage(b);
            }
            if(window.singleBattleTrigger==1 && window.singleBattleInstance){
                window.singleBattleInstance.dispatchMessage(b);
            }
            if(autotupoTrigger==1){
                AutoTupo.dispatchMessage(b);
            }
            //getHongBao.dispatchMessage(b);
            autoEvent.dispatchMessage(b);
        }
    };
    attach();


})(window);


var CONST_DEBUG_MODE = true;

/**
*   Job Manager
*/
var JobManager = {
    Const: {
        INTERVAL_ROUTINE_TASKS: 1000 * 60 * 30,
        INTERVAL_BATTLE: 1000,
        INTERVAL_KNIGHT_TALKING: 500,
        INTERVAL_KNIGHT_ESCAPING: 200,
        INTERVAL_KNIGHT_FIGHTING: 1000,
        INTERVAL_CHECKING_DRAGONS: 50,
        INTERVAL_IDLE_CHECKER: 1000 * 60 * 15
    },

    Timer: {
        routineTasks: 0,
        knightTalking: 0,
        battle: 0,
        knightFighting: 0,
        dragons: 0,
        kfdragons: 0,
        idleChecker: 0
    },

    RoutineTasksMonitor: {
        start: function () {
            log("Start automated kowtow, serving tea...");
            JobManager.Timer.routineTasks = setInterval(RoutineTasksManager.checkRegularTasks, JobManager.Const.INTERVAL_ROUTINE_TASKS);
        },
        stop: function () {
            log("Stop automated Kowtow, serving tea.");
            clearInterval(JobManager.Timer.routineTasks);
        }
    },

    KnightMonitor: {
        startTalking: function () {
            log("Start talking to the knights...");
            JobManager.Timer.knightTalking = setInterval(KnightManager.talkToTheKnights, JobManager.Const.INTERVAL_KNIGHT_TALKING);
        },
        stopTalking: function () {
            log("Stop talking to the knights.");
            clearInterval(JobManager.Timer.knightTalking);
        },
        startFighting: function () {
            JobManager.Timer.knightFighting = setInterval(KnightManager.fight, JobManager.Const.INTERVAL_KNIGHT_FIGHTING);
        },
        stopFighting: function () {
            clearInterval(JobManager.Timer.knightFighting);
        }
    },

    BattleMonitor: {
        start: function () {
            log("Start battle...");
            JobManager.Timer.battle = setInterval(BattleManager.fight, JobManager.Const.INTERVAL_BATTLE);
        },
        stop: function () {
            log("Stop battle.");
            clearInterval(JobManager.Timer.battle);
        }
    },

    EscapeMonitor: {
        start: function () {
            log("Start escaping...");
            JobManager.Timer.escaping = setInterval("clickButton('escape')", JobManager.Const.INTERVAL_KNIGHT_ESCAPING);
        },
        stop: function () {
            log("Stop escaping.");
            clearInterval(JobManager.Timer.escaping);
        }
    },

    KFDragonMonitor: {
        start: function () {
            log("Start monitoring KFdragons...");
            JobManager.Timer.kfdragons = setInterval(KFDragonManager.check, JobManager.Const.INTERVAL_CHECKING_DRAGONS);
        },
        stop: function () {
            log("Stop monitoring dragons.");
            clearInterval(JobManager.Timer.kfdragons);
        }
    },

    DragonMonitor: {
        start: function () {
            log("Start monitoring dragons...");
            if (DragonBonus.length === 0)
            {
                DragonBonus.push.apply(DragonBonus,DragonBonusA);
                DragonBonus.push.apply(DragonBonus,DragonBonusB);
                DragonBonus.push.apply(DragonBonus,DragonBonusC);
                DragonBonus.push.apply(DragonBonus,DragonBonusD);
            }

            JobManager.Timer.dragons = setInterval(DragonManager.check, JobManager.Const.INTERVAL_CHECKING_DRAGONS);
        },
        stop: function () {
            log("Stop monitoring dragons.");
            clearInterval(JobManager.Timer.dragons);
        }
    },


    IdleMonitor: {
        start: function () {
            log("Start idle monitoring...");
            JobManager.Timer.idleChecker = setInterval(IdleChecker.fire, JobManager.Const.INTERVAL_IDLE_CHECKER);
        },
        stop: function () {
            log("Stop idle monitoring.");
            clearInterval(JobManager.Timer.idleChecker);
        }
    }
}

/**
*   Regular Tasks Manager
*/
var RoutineTasksManager = {
    regularTasks: [
        "public_op3",
        "work click maikuli",
        "work click duancha",
        "work click dalie",
        "work click baobiao",
        "work click maiyi",
        "work click xuncheng",
        "work click datufei",
        "work click dalei",
        "work click kangjijinbin",
        "work click zhidaodiying",
        "work click dantiaoqunmen",
        "work click shenshanxiulian",
        "work click jianmenlipai",
        "work click dubawulin"
    ].join(";"),

    checkRegularTasks: function () {
        log("Checking regular tasks...");
        ButtonManager.click(RoutineTasksManager.regularTasks);
        log("Regular tasks done.");
    }
}

class Debate {

    async selectMembers() {
        await ButtonManager.click("swords select_member huashan_feng;swords select_member xiaoyao_tonglao;swords select_member wudang_zhang;swords fight_test go");
    }

    async start() {
        await ButtonManager.click("score");
        let currentEnforce = Panels.Score.getEnforceValue();
        await ButtonManager.click('prev;auto_fight 1;enforce 0');

        await this.checkStatus();

        await ButtonManager.click('auto_fight 0;enforce ' + currentEnforce);
    }

    async checkStatus() {
        if (Panels.Notices.containsMessage("试剑胜利\\(5/5\\)！")) {
            //ButtonManager.click("prev_combat;prev");
            return true;
        } else if (BattleManager.readyForHit(3)) {
            await BattleManager.perform(["排云掌"]);
        } else if (BattleManager.battleFinished()) {
          //  ButtonManager.click("prev_combat;swords fight_test go");
        }

        await ExecutionManager.sleep(2000);
        return await this.checkStatus();
    }
}

class Npc {
    constructor(name) {
        this._name = name;
    }

    setId(id) {
        this._id = id;
    }

    getId() {
        return this._id ? this._id : Objects.Npc.getIdByName(this._name);
    }
}

class Task {

    setNpc(npc) {
        this._npc = npc;
    }

    getNpc() {
        return this._npc;
    }

    setRoom(room) {
        this._room = room;
    }

    getRoom() {
        return this._room;
    }

    setAction(action) {
        this._action = action;
    }

    getAction() {
        return this._action;
    }

    setItem(item) {
        this._item = item;
    }

    getItem() {
        return this._item;
    }
}

/**
 * Task Manager For Gang
*/
var GenericTaskManager = {

    handleTask: async function () {
        let task = await GenericTaskManager.identifyTask();
        await Navigation.goto(task.getRoom());

        if (task.getAction()) {
            let battle = new Battle(task.getNpc());
            return await battle.start(task.getAction(), ["排云掌法"]);
        } else {
            let item = Objects.Room.getTargetObject(task.getItem());
            if (item) {
                await ExecutionManager.asyncExecute(item.attr("onclick"));
            }
        }
    },

    identifyTask: async function () {
        let task = new Task();

        let message = Panels.Notices.filterMessageObjectsByKeyword("任务所在地方好像是").last().text();
        let fightEvent = message.match("你现在的任务是(杀|战胜)(.*?)。") || message.match("给我在.*?内(杀|战胜)(.*?)。");
        if (fightEvent) {
            task.setAction({ "战胜": "fight", "杀": "kill" }[fightEvent[1]]);
            task.setNpc(new Npc(fightEvent[2]));
        } else {
            let findEvent = message.match("给我在.*?内寻找(.*?)。");
            if (findEvent) {
                task.setItem(findEvent[1]);
            }
        }

        let place = message.match("任务所在地方好像是：(.*?)你")[1].split("-");
        task.setRoom(place[place.length - 1]);

        return task;
    }
}

class Battle {
    constructor(npc) {
        this._npc = npc;
    }

    async start(action, skills) {
        this._skills = skills;

        if (!this._npc.getId()) {
            debugging("npc " + this._npc + " is not here.");
            return false;
        } else {
            await ButtonManager.click(action + " " + this._npc.getId());
            BattleManager.perform(skills);
            return await this.checkBattleStatus();
        }
    }

    async checkBattleStatus() {
        if (!Panels.Battle.containsMessage("战斗结束")) {
            if (this.readyForHit(3)) BattleManager.perform(this._skills);

            await ExecutionManager.sleep(2000);
            return await this.checkBattleStatus();
        }

        return true;
    }

    readyForHit(bufferThreshold) {
        return bufferThreshold <= Panels.Battle.getCurrentBuffer();
    }
}

var IdleChecker = {
    lastRoom: "",

    async fire() {
        await ButtonManager.click("golook_room");
        if ($("span:contains(寒玉床)").text()) return;
        if ($("span:contains(千年玄冰)").text()) return;

        let currentRoom = Objects.Room.getName();
        if (!currentRoom) return;

        if (currentRoom != IdleChecker.lastRoom) {
            IdleChecker.lastRoom = currentRoom;
        } else {
            log("Idle longer than " + JobManager.Const.INTERVAL_IDLE_CHECKER / (1000 * 60) + " min detected. Get back to home.");
            ButtonManager.click("home");
        }
    }
}

/**
*   Battle Manager
*/
var BattleManager = {
    Const: {
        //SKILLS_COMBO: ['排云掌法', '九天龙吟剑法'],
        //SKILLS_COVER: ['紫血大法'],
        COVER_REQUIRED: 3,
        BUFFER_REQUIRED: 6,
        BUFFER_RESERVED: 1
    },

    fight: function () {
        var SKILLS_COMBO = sessionStorage.getItem("FightSkill");
        var SKILLS_COVER = sessionStorage.getItem("CoverSkill");
        let kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
        let max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
        let force=parseInt(g_obj_map.get("msg_attrs").get("force"));
        let max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));

        if (BattleManager.battleFinished()) {
            finishBattle();
        } else if (((kee<max_kee*0.5) || (force<max_force*0.3)) && BattleManager.readyForHit(BattleManager.Const.COVER_REQUIRED))
        {
            BattleManager.perform(SKILLS_COVER);
        }  else if (BattleManager.readyForHit(BattleManager.Const.BUFFER_REQUIRED + BattleManager.Const.BUFFER_RESERVED)) {
            BattleManager.perform(SKILLS_COMBO);
        }

        function finishBattle() {
            //clickButton("prev_combat");
        }
    },

    battleFinished: function () {
        return Panels.Battle.containsMessage("战斗结束");
    },

    readyForHit: function (bufferThreshold) {
        return bufferThreshold <= Panels.Battle.getCurrentBuffer();
    },

    perform: function (skills) {
        ExecutionManager.execute(Panels.Battle.getSkillLinks(skills));
    },

    escape: function () {
        BattleManager.perform(["茅山道术"]);
        $("#btnEscape").click();
    }
}

/**
 * Panels
*/
var Panels = {

    Chatting: {
        filterMessageObjectsByKeyword: function (regKeyword) {
            return $("span .out3_auto").filter(function () { return $(this).text().match(regKeyword); });
        }
    },

    Notices: {
        filterMessageObjectsByKeyword: function (regKeyword) {
            return $(".out2").filter(function () { return $(this).text().match(regKeyword); });
        },

        containsMessage: function (regKeyword) {
            return Panels.Notices.filterMessageObjectsByKeyword(regKeyword).length > 0
        },

        getLastMessage: function () {
            return $(".out2").last().text();
        },
        getLastChatting: function () {
            return $(".out3_auto").last().text();
        },

        getLatestDragonLink: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织："); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestKFDragonLink: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：(.*?)21-25区(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestQFDragonLink1: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：段老大正在武林广场(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestQFDragonLink2: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：二娘正在武林广场(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestQFDragonLink3: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：岳老三正在武林广场(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestQFDragonLink4: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：云老四正在武林广场(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestTFLink: function () {
            return $(".out3_auto").filter(function () { return $(this).text().match("【系统】(.*?)21-25区(.*?)段老大慌不择路，逃往了(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestBCLink: function () {
            return $(".out2").filter(function () { return $(this).text().match("荣威镖局:(.*?)21-25区(.*?)押运镖车行至(.*?)"); }).last().html().match("(find_qinglong_road.*?)'")[1];
        },
        getLatestDragonMessage: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织："); }).last().text();
        },
        getLatestKFDragonMessage: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：(.*?)21-25区(.*?)"); }).last().text();
        },
        getLatestQFDragonMessage1: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：段老大正在武林广场(.*?)"); }).last().text();
        },
        getLatestQFDragonMessage2: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：二娘正在武林广场(.*?)"); }).last().text();
        },
        getLatestQFDragonMessage3: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：岳老三正在武林广场(.*?)"); }).last().text();
        },
        getLatestQFDragonMessage4: function () {
            return $(".out2").filter(function () { return $(this).text().match("青龙会组织：云老四正在武林广场(.*?)"); }).last().text();
        },
        getLatestTFMessage: function () {
            return $(".out3_auto").filter(function () { return $(this).text().match("【系统】(.*?)21-25区(.*?)段老大慌不择路，逃往了(.*?)"); }).last().text();
        }
    },

    Score: {
        getEnforceValue() {
            return parseInt($("span .out3").text().match("【内力】.*?/.*?\\\(\\\+(.*?)\\\)")[1]);
        }
    },

    Battle: {
        containsMessage: function (regKeyword) {
            return $(".out").filter(function () { return $(this).text().match(regKeyword); }).length > 0;
        },

        getSkillLinks: function (skills) {
            let links = [];
            $(".cmd_skill_button").filter(function () {
                return skills.includes($(this).text());
            }).each(function () {
                links.push($(this).attr("onclick"));
            })
            return links;
        },

        getCurrentBuffer: function () {
            return parseInt($("#combat_xdz_text").text());
        }
    },

    Master: {
        containsMessage: function (regKeyword) {
            return Panels.Master.filterMessageObjectsByKeyword(regKeyword).length > 0;
        },

        filterMessageObjectsByKeyword: function (regKeyword) {
            return $(".out").filter(function () { return $(this).text().match(regKeyword); });
        }
    },

    Skills: {
        group: ["my_skills attack", "my_skills recovery", "my_skills force", "my_skills known"],
        defaultSkills: ["enableskill enable parry iron-sword"],

        findCurrentSkillIds: async function () {
            await ButtonManager.click("enable");

            SkillManager.oldSkillIds = ["parry iron-sword"];
        },

        findSkillIdByStatus: async function (status) {
            SkillManager.newSkillId = 0;
            for (let i = 0; i < Panels.Skills.group.length; i++) {
                await ButtonManager.click(Panels.Skills.group[i]);

                let findStatus = $("span .out2:contains(" + status + ")");
                if (findStatus.length) {
                    SkillManager.newSkillId = findStatus.parent().parent().attr("onclick").match(".*?skills info .*? (.*)'\\\)")[1];
                    break;
                }
            }
        },

        findSkillIdByName: async function (name) {
            for (let i = 0; i < Panels.Skills.group.length; i++) {
                await ButtonManager.click(Panels.Skills.group[i]);

                let findStatus = $("span .out3:contains(" + name + ")");
                if (findStatus.length) {
                    SkillManager.newSkillId = findStatus.parent().parent().attr("onclick").match(".*?skills info .*? (.*)'\\\)")[1];
                    break;
                }
            }
        },
        findStatusByName: async function (name) {
            for (let i = 0; i < Panels.Skills.group.length; i++) {
                await ButtonManager.click(Panels.Skills.group[i]);

                let findStatus = $("span .out3:contains(" + name + ")");

                if (findStatus.length) {
                    SkillManager.status = findStatus.next().text();
                    break;
                }
            }
        }
    },

    Knights: {
        findKnightLink: function (knight) {
            return $("a").filter(function () { return $(this).text() === knight; }).attr("href");
        }
    }
}

/**
 * Objects
*/
var Objects = {
    Room: {
        filterTargetObjectsByKeyword: function (regKeyword) {
            return $(".cmd_click3").filter(function () { return $(this).text().match(regKeyword); });
        },

        getTargetObject: function (name) {
            return $(".cmd_click3").filter(function () { return $(this).text() === name; });
        },

        searchTargetObject: function (name) {
            return $(".cmd_click3").filter(function () { return $(this).text().indexof(name); });
        },

        hasNpc: function (name) {
            return Objects.Room.getTargetObject(name).length > 0;
        },

        LikeNpc: function (name) {
            return Objects.Room.searchTargetObject(name).length > 0;
        },

        getName: function () {
            return $(".out").find(".outtitle").text();
        },

        getAvailableNpcs() {
            let npcs = [];
            $(".cmd_click3").each(function () {
                npcs.push(new Npc($(this).text()));
            })

            return npcs;
        }
    },

    Npc: {
        getActionLink: function (action) {
            return $(".cmd_click2").filter(function () { return $(this).text() === action; }).attr("onclick");
        },

        triggerAction: async function (npc, action) {
            await ExecutionManager.asyncExecute(Objects.Room.getTargetObject(npc.getName()).attr("onclick"), 200);
            await ExecutionManager.asyncExecute(Objects.Npc.getActionLink("观战"));
        },

        getIdByName: function (name) {
            let find = Objects.Room.getTargetObject(name).last();
            if (find.length > 0) {
                return find.attr("onclick").match(".*?look_npc (.*?)'")[1];
            }
        }
    }
}

class Skill {
    constructor(name) {
        this._name = name;
    }

    getCode() {
        return this._code;
    }

    setCode(code) {
        this._code = code;
    }

    isEnabled() {
        return this._isEnabled;
    }

    setEnable(isEnabled) {
        this._isEnabled = isEnabled;
    }

    selectedForAttack() {
        return this._selectedForAttack;
    }

    setSelectedForAttack(selectedForAttack) {
        this._selectedForAttack = selectedForAttack;
    }
}

var SkillManagerV2 = {

    async getSkillsEnabled() {
        await ButtonManager.click("skills");

        let skills = [];
        $("button.cmd_click3").each(function () {
            let name = $(this).text();
            if (!name.match("一键")) {
                let skill = new Skill(name.replace("*", ""));
                skill.setSelectedForAttack(name.substr(0, 1) === "*");
                skills.push(skill);
            }
        });

        return skills;
    },

    getSkillsSelectedForAttack() {

    },

    getSkillCodeByName(name) {

    },

    getSkillInPractice() {

    },

    enableSkill(skill) {

    },

    selectForAttack(skill) {

    },

    practice(skill) {

    }

}

/**
 * Skill Manager
 */
var SkillManager = {
    oldSkillIds: [],
    newSkillId: 0,
    status: "",

    defaultSkillsEnabled: [
        "enableskill enable paiyun-zhang attack_select",
        "enableskill enable unarmed rulai-zhang",
        "enableskill enable jiutian-sword attack_select",
        "enableskill enable iron-sword",
        "enableskill enable dzxinmojing attack_select",
        "enableskill enable force yijinjing",
        "enableskill enable wanliuguiyi attack_select",
        "enableskill enable dodge yyhuanxubu",
        "enableskill enable parry liumai-shenjian",
        "enableskill enable parry xianglong-zhang"
    ].join(";"),

    restartPractice: async function () {
        await Panels.Skills.findCurrentSkillIds();

        await Panels.Skills.findSkillIdByStatus("练习中");
        if (!SkillManager.newSkillId) {
            let answer = prompt("没有检查到任何技能在练习中。请指定需要练习的技能名字？");
            if (!answer) return;

            log("answer=" + answer);
            await Panels.Skills.findSkillIdByName(answer);
            if (!SkillManager.newSkillId) {
                log("Skill " + answer + " doesn't exist. Action cancelled.");
                return;
            }
        }

        ButtonManager.click("practice stop;enable " + SkillManager.newSkillId + ";practice " + SkillManager.newSkillId);
    },

    restartTupo: async function () {

        let Tuposkills = sessionStorage.getItem("Tuposkills");
        answer = Tuposkills.split(",");

        for (let i = 0; i < answer.length; i++) {
            await Panels.Skills.findSkillIdByName(answer[i]);
            if (!SkillManager.newSkillId) {
                log("Skill " + answer[i] + " doesn't exist. Action cancelled.");
                return;
            }
            ButtonManager.click("tupo_speedup " + SkillManager.newSkillId + " go" + ";tupo_speedup2 " + SkillManager.newSkillId + " go");
            await ExecutionManager.sleep(500);
        }
        await Panels.Skills.findSkillIdByStatus("突破中");
        if (!SkillManager.newSkillId) {
            for (let i = 0; i < answer.length; i++) {
                await Panels.Skills.findSkillIdByName(answer[i]);
                if (!SkillManager.newSkillId) {
                    log("Skill " + answer[i] + " doesn't exist. Action cancelled.");
                    return;
                }
                ButtonManager.click("enable " + SkillManager.newSkillId + ";tupo go," + SkillManager.newSkillId);
                await ExecutionManager.sleep(500);
            }
        }
    },

    reEnableSkills: function () {
        ButtonManager.click(SkillManager.defaultSkillsEnabled, 500);
    }
}

/**
 * Button Manager
 */
var ButtonManager = {

    click: async function (actionString, delay = 200) {
        let array = actionString.split(";").extract();

        for (let i = 0; i < array.length; i++) {
            await ExecutionManager.asyncExecute("clickButton('" + array[i] + "')", delay);
        }
    },

    toggleButtonEvent: function (button) {
        let statusOn = false;

        if (button.innerText != button.name) {
            button.innerText = button.name;
            button.style.color = "";
            button.style.backgroundColor ="red";
        } else {
            button.innerText = 'x ' + button.name;
            button.style.color = "black";
            button.style.backgroundColor ="";


            statusOn = true;
        }

        return statusOn;
    },

    resetButtonById: function (buttonId) {
        let button = $("#" + buttonId);
        if (button.css('color') != 'rgb(0, 0, 0)') button.click();
    },

    clickButtonById: function (buttonId) {
        let button = $("#" + buttonId);
        //if (button.css('color') == 'rgb(0, 0, 0)') button.click();
        button.click();
    },

    toggleButton2Event: function (buttonId,no) {
        var button;
        for(var i=1;i<6;i++){
            if(i == no ) continue;
            if(button = $("#" + buttonId+''+i)){
                button.text(button.attr('name'));
                button.css("color","black");
            }
        }
        button = $("#" +  buttonId+''+no);
        button.text('x '+button.attr('name'));
        button.css("color","red");
        if(buttonId == 'force')
            lj_paras.huixue = buttonId+''+no
        else if(buttonId == 'nei')
            lj_paras.huinei = buttonId+''+no
        saveOption(lj_paras);
    },
}

/**
 * Execution Manager
*/
var ExecutionManager = {

    execute: function (commands) {
        for (let i = 0; i < commands.length; i++) eval(commands[i]);
    },

    asyncExecute: async function (commands, delay = 200) {
        if (!Array.isArray(commands)) commands = [commands];

        for (let i = 0; i < commands.length; i++) {
            await eval(commands[i]);
            await ExecutionManager.sleep(Math.floor(Math.random() * 50 + delay));
        }
    },

    sleep: async function (timeout) {
        return new Promise((resolve, reject) => { setTimeout(function () { resolve(); }, timeout); });
    }
}


/**
 * Path Manager
*/
var PathManager = {
    getTraversalPathByCity: function (city) {
        return PathManager.Const.CITIES[city];
    },

    getPathByRoom: function (room) {
        return PathManager.Const.ROOMS[room];
    },

    getPathByNpc: function (npc) {
        return PathManager.Const.NPC[npc];
    },

    getPathForSpecificEvent: function (event) {
        return PathManager.Const.OTHER[event];
    },

    getPathByTarget: function (target) {
        return PathManager.Const.NPC[target] || PathManager.Const.ROOMS[target];
    },

    Const: {
        CITIES: {
            "雪亭镇": "jh 1;inn_op1;n;s;w;e;e;w;s;e;s;w;w;e;s;n;e;e;ne;ne;sw;sw;n;w;n;w;e;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;n;w;e;n;w;e;e;e;w;w;n;w;e;e;w;n",
            "洛阳": "jh 2;n;n;e;s;luoyang317_op1;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;s;w;e;n;event_1_98995501;n;w;e;n;e;w;s;s;s;e;n;w;s;luoyang111_op1;e;n;n;n;w;e;s;s;w;n;w;get_silver;s;e;n;n;e;get_silver;n;w;s;s;s;e;e;e;n;op1;s;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;luoyang14_op1;n;e;e;w;n;e;n;n;s;s;w;n;n;n;n;",
            "华山村": "jh 3;n;e;w;s;w;n;s;e;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;huashancun15_op1;event_1_46902878;w;w;w;n;s;get_silver;n;e;s;e;w;nw;n;n;e;jh 3;w;event_1_59520311;n;n;w;get_silver;s;e;n;n;e;get_silver;n;w;n;e",
            "华山": "jh 4;n;n;w;e;n;e;w;n;n;n;e;n;n;event_1_91604710;s;s;s;w;e;s;e;w;n;n;n;n;nw;s;s;w;n;n;s;n;w;w;n;get_xiangnang2;w;s;e;e;n;n;w;e;n;n;w;e;e;n;n;s;s;s;s;n;n;w;n;get_silver;s;s;s;s;s;e;n;n;w;e;n;e;w;n;e;w;n;s;s;s;s;s;w;n;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e",
            "扬州": "jh 5;n;e;#3 w;n;s;e;e;n;e;w;w;e;n;w;e;n;w;yangzhou16_op1;e;e;n;w;w;s;s;#5 n;s;e;w;w;#3 n;#3 s;e;s;s;#3 e;#3 n;s;s;w;#3 n;e;n;n;s;s;e;s;s;w;n;ns;s;e;s;w;s;w;n;w;e;e;n;n;w;get_silver;s;e;e;w;n;n;#4 s;w;n;w;e;e;get_silver;s;w;n;w;w;n;get_silver;s;s;w;#3 e;n;e;s;e;#3 s;#3 n;w;n;w;n;ne;sw;s;w;s;n;w;n;e;w;w;e;n;n;w;n;s;e;e;s;n;w;n",
            "丐帮": "jh 6;event_1_98623439;s;w;e;n;ne;ne;ne;sw;sw;n;ne;ne;ne;event_1_97428251",
            "乔阴县": "jh 7;#3 s;w;s;#3 w;#4 e;event_1_65599392;w;e;n;s;ne;s;s;e;n;n;e;w;s;s;w;s;#3 w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e",
            "峨眉山": 'jh 8;w;nw;#4 n;w;e;se;nw;e;n;s;e;n;n;e;#4 n;e;e;w;w;w;#3 n;#4 w;sw;ne;n;s;e;e;s;s;e;w;w;e;n;e;w;w;e;n;n;e;w;w;e;n;e;w;w;e;n;#3 w;#3 n;#3 s;#9 e;w;w;s;e;w;w;e;s;e;w;w;e;s;w;#3 e;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;#4 n;w;w;e;n;s;e;#4 n;s;s;nw;sw;w;nw;w;e;se;e;ne;nw;n;n;s;s;se;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e',
            "恒山": "jh 9;n;w;e;n;e;get_silver;w;w;n;w;e;n;e;w;henshan15_op1;e;n;event_1_85624865;n;w;e;e;w;n;n;henshan_zizhiyu11_op1;e;n;#4 s;w;n;n;w;n;s;s;n;#3 e;w;n;s;w;n;n;w;n;e;henshan_qinqitai23_op1;s;w;n;n;n;s;w;get_silver",
            "武当山": "jh 10;w;n;n;#3 w;#5 n;w;n;s;#5 e;w;w;s;n;w;w;#4 n;#5 s;#4 e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;#3 s",
            "晚月庄": "jh 11;s;e;s",
            "水烟阁": "jh 12;n;e;w;#3 n;s;w;n;n;e;w;s;nw;e;n;s;e;sw;n;s;s;e",
            "少林寺": "jh 13;e;s;s;w;w;w;e;e;n;n;w;n;w;w;n;shaolin012_op1;s;s;e;e;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;shaolin27_op1;event_1_34680156;s;w;n;w;e;e;w;n;shaolin25_op1;w;n;w;#8 s;#8 n;e;e;#8 s;#8 n;w;n;w;e;e;w;n;w;n;get_silver",
            "唐门": "jh 14;w;#4 n;s;#4 w;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;e;s;n;e;n;e;w;n;n;s;#3 ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;" + "s;s" + "jh 14;e;event_1_10831808;n;s;s;w;sw;s;e;s;s;sw;sw;w;w;s;s;e",
            "逍遥林": "jh 16;#4 s;e;e;s;w;n;#3 s;n;n;w;n;n;#4 s;n;n;w;w;n;s;s;n;w;#6 e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;n;s;w;#3 e;n;s;e;n;n;w;n;e",
            "开封": "jh 17;n;w;e;e;s;n;w;n;w;n;n;#3 s;n;#3 e;s;#3 n;s;get_silver;e;s;w;#3 s;w;e;s;w;e;n;e;n;s;s;n;e;e;#3 w;#3 n;w;n;e;w;n;e;#3 w;n;s;s;n;w;s;s;w;e;#4 n;w;e;s;s;w;#4 e;n;e;#3 n;event_1_27702191;w;#3 s;w;#5 s;e;#3 s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;e;#5 n;w;event_1_97081006;#5 s;w;w;e;kaifeng_yezhulin05_op1;s;e;n;n;e;kaifeng_yezhulin23_op1;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168",
            "光明顶": "jh 18;e;w;w;n;s;e;n;nw;sw;ne;n;n;w;e;#3 n;ne;n;n;w;e;e;w;n;w;e;e;w;#4 n;e;w;n;e;w;w;e;n;w;nw;nw;se;se;w;#4 s;n;e;e;n;w;#3 e;s;w;e;se;se;e;w;nw;nw;n;n;ne;sw;n;w;w;#3 n;w;e;n;event_1_90080676;event_1_56007071;nw;ne;n;nw",
            "全真教": "jh 19;#3 s;sw;s;e;n;nw;#4 n;e;w;w;e;n;#3 w;s;n;w;s;n;#5 e;n;s;e;e;w;n;n;s;s;w;w;n;n;w;w;s;s;n;n;w;s;s;n;n;w;#4 n;e;n;#3 s;e;n;n;w;e;e;s;s;n;n;e;n",
            "古墓": "jh 20;w;w;s;e;#5 s;sw;sw;s;s;e;w;#4 s",
            "白驼山": "jh 21;#4 n;#4 s;nw;s;n;w;n;s;w;nw;e;w;nw;nw;n;w;sw;jh 21;nw;w;w;nw;n;e;w;n;n;w;e;n;n;e;e;w;ne;sw;e;se;nw;w;n;s;s;n;w;w;#4 n;#3 s;#4 e;n;n;e;e;w;w;w;e;n;nw;se;ne;e;w;n;jh 21;nw;ne;ne;sw;n;n;ne;w;e;n;n;w;w"
        },

        NPC: {
            "野狗": "jh 1;e;e;s;ne",
            "青竹蛇": "jh 2;#9 n;e",
            "朱先生": "jh 5;#5 n;e;#3 n",
            "贵公子": "jh 7;#6 s;e;n",
            "游方郎中": "jh 15;n",
            "村妇": "jh 18;w",
            "樵夫": "jh 21;nw;w;w;#3 nw",
            "店老板": "jh 26;#6 w;s;e",
            "牧羊人": "jh 28;n",
            "星宿派钹手": "jh 28;n;n",
            "慕容老夫人": "jh 32;n;n;se;n",
            "黑袍老人": "jh 34;ne;#5 e;n;e;n",
            "神仙姐姐": "jh 32;n;n;se;#4 n;#3 w;n;w;n;e;n;e;n;e",
            "玉娘": "jh 2;#5 n;w;w;#3 n;e",
            "村姑": "jh 21;nw;w;w",
            "黑狗": "jh 3;#3 s",
            "芳绫": "jh 11;s;e;s;sw;se;w;w;n;w",
            "农夫": "jh 1;e;s;w",
            "老农夫": "jh 1;e;s;w",
            "李火狮": "jh 1;e;n;e;e",
            "收破烂的": "jh 1;e;n;n",
            "泼皮头子": "jh 3;s",
            "卖饼大叔": "jh 7;s",
            "守城武将": "jh 2;#8 n",
            "安惜迩": "jh 1;e;n;w",
            "山蛇": "jh 9;#5 n",

            "柳绘心": "jh 1;e;n;e;e;e;e;n",
            "王铁匠": "jh 1;e;n;n;w",
            "杨掌柜": "jh 1;e;n;n;n;w",
            "柳小花": "jh 2;n;n;n;n;w;s;w",
            "卖花姑娘": "jh 2;n;n;n;n;n;n;n",
            "客商": "jh 2;n;n;e",
            "刘守财": "jh 2;n;n;n;n;n;n;n;e",
            "方老板": "jh 3;s;s;e",
            "方寡妇": "jh 3;s;s;w;n",
            "朱老伯": "jh 3;s;s;w"
        },

        ROOMS: {
            "书房": "jh 1;e;n;e;e;e;e;n",
            "打铁铺子": "jh 1;e;n;n;w",
            "桑邻药铺": "jh 1;e;n;n;n;w",
            "南市": "jh 2;n;n;e",
            "钱庄": "jh 2;n;n;n;n;n;n;n;e",
            "绣楼": "jh 2;n;n;n;n;w;s;w",
            "北大街": "jh 2;n;n;n;n;n;n;n",
            "石板桥": "jh 3;s;s;s",
            "杂货铺": "jh 3;s;s;e",
            "祠堂大门": "jh 3;s;s;w",
            "厅堂": "jh 3;s;s;w;n",
            "桃花泉": "jh 3;#5 s;nw;n;n;e",
            "潭畔草地": "jh 4;#7 n;event_1_91604710;s;s;s",
            "千尺幢": "jh 4;#4 n",
            "玉女峰": "jh 4;#8 n;w",
            "山坳": "jh 1;e;#5 n",
            "九老洞": 'jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;sw;w;nw;w',
            "猢狲愁": "jh 4;#6 n;e;n;n",
            "长空栈道": "jh 4;#9 n;e",
            "临渊石台": "jh 4;#9 n;e;n",
            "沙丘小洞": "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251",
            "悬根松": "jh 9;n;w",
            "夕阳岭": "jh 9;n;n;e",
            "青云坪": "jh 13;e;s;s;w;w",
            "玉壁瀑布": "jh 16;#4 s;e;n;e",
            "湖边": "jh 16;#4 s;e;n;e;event_1_5221690;s;w",
            "碧水寒潭": "jh 18;n;nw;#5 n;ne;#5 n;e;e;se;se;e",
            "寒水潭": "jh 20;w;w;s;e;#5 s;sw;sw;s;e;se",
            "悬崖": "jh 20;w;w;s;e;#5 s;sw;sw;s;s;e",
            "戈壁": "jh 21",
            "山溪畔": "jh 22;n;n;w;#4 n;look_npc songshan_songshan7;event_1_88705407;s;s",
            "启母石": "jh 22;n;n;w;w",
            "卢崖瀑布": "jh 22;#3 n;#5 escape;n;e;n",
            "无极老姆洞": "jh 22;n;n;w;#4 n",
            "奇槐坡": "jh 23;#8 n",
            "小洞天": "jh 24;#4 n;e;e",
            "云步桥": "jh 24;#9 n",
            "观景台": "jh 24;#12 n;e;e;n",
            "天梯": "jh 24;#3 n",
            "危崖前": "jh 25;w",
            "草原": "jh 26;w",
            "无名山峡谷": "jh 29;#4 n",
            "无名峡谷": "jh 29;#4 n;event_1_60035830;event_1_65661209",
            "饮风客栈": "jh 1",
            "龙门石窟": "jh 2",
            "华山村村口": "jh 3",
            "华山山脚": "jh 4",
            "安定门": "jh 5",
            "树洞内部": "jh 6",
            "乔阴县城北门": "jh 7",
            "十二盘": "jh 8",
            "大字岭": "jh 9",
            "林中小路": "jh 10",
            "竹林": "jh 11",
            "青石官道": "jh 12",
            "丛林山径": "jh 13",
            "少林寺山门": "jh 13;n",
            "蜀道": "jh 14",
            "北郊": "jh 15",
            "青石大道": "jh 16",
            "朱雀门": "jh 17",
            "小村": "jh 18",
            "终南山路": "jh 19",
            "山路": "jh 20",
            "戈壁": "jh 21",
            "淳风武馆大门": "jh 1;e;n;e",
            "桑邻药铺": "jh 1;e;#3 n;w",
            "中心鼓楼": "jh 2;#5 n",
            "山脚": "jh 3;#5 s;nw",
            "神女冢": "jh 3;n;e",
            "华山村村口": "jh 3",
            "银杏广场": "jh 3;s;s",
            "后院": "jh 4;#12 n",
            "厨房": "jh 4;#12 n;w",
            "崎岖山路": "jh 4;#6 n;e;n;n;event_1_91604710",
            "十里长街3": "jh 5;n;n",
            "十里长街6": "jh 5;#8 n",
            "树王坟内部": "jh 7;#3 s;w;s;#3 w;#4 e;event_1_65599392;n",
            "福林酒楼": "jh 7;#6 s;e;n",
            "火龙将军庙": "jh 7;#7 s;sw;w",
            "长廊": "jh 9;#8 n",
            "鸡叫石": "jh 9;#3 n;w",
            "见性峰山道": "jh 9;#5 n",
            "秘道": "jh 9;#4 n;henshan15_op1",
            "茶室": "jh 10;w;n;n;#3 w;#5 n;e;e;e",
            "蜿蜒小径": "jh 11;s;e;s",
            "武当牌坊": "jh 10;w;n;n;w;w",
            "黄土路": "jh 10;w;n;n;w",
            "桃园小路": "jh 10;w;n;n;#3 w;#4 n;#4 e;s;e;s;e;n",
            "羊肠小道": "jh 17;event_1_97081006",
            "丛林山径": "jh 13",
            "唐门厨房": "jh 14;w;#3 n;e;s",
            "北郊": "jh 15",
            "镖局车站": "jh 15;#3 s;w;w;n",
            "练武场": "jh 15;#3 s;w;w;s;s",
            "福州大街": "jh 15;s;s",
            "酒家二楼": "jh 15;s;s;w;n",
            "小木屋": "jh 16;#4 s;e;e;s;w;n;s;w;n;n",
            "湖边": "jh 16;#4 s;e;n;e;event_1_5221690;s;w",
            "朱雀门": "jh 17",
            "柳树林": "jh 17;#5 n;e;#3 n",
            "杂草小路": "jh 17;event_1_97081006;s",
            "卧房": "jh 18;w;n",
            "民居": "jh 18;w",
            "小饭厅": "jh 18;e;w;w;n;s;e;n;nw;sw;ne;n;n;w;e;#3 n;ne;#9 n;w;nw",
            "终南石阶": "jh 19;#3 s;sw;s;e;n;nw",
            "终南山游客": "jh 19;#3 s;sw;s;e;n;nw",
            "大堂一进": "jh 19;#3 s;sw;s;e;n;nw;#4 n",
            "蜂屋": "jh 20;w;w;s;e;#5 s;sw;sw;#6 s",
            "草地": "jh 20;w;w;s;e;#5 s;sw;sw;s",
            "悬崖": "jh 20;w;w;s;e;#5 s;sw;sw;s;s;e",
            "打铁铺": "jh 21;nw;s",
            "花园": "jh 21;nw;w;w;nw;#7 n",
            "嵩岳山道": "jh 22;n;n;w;n",
            "魔云洞口": "jh 22;n;n;w;w;s",
            "山楂林": "jh 22;n;n;w;#5 n",
            "石板路": "jh 24;#4 n",
            "桃花路": "jh 24;#12 n;w;n",
            "海边路": "jh 25;#3 e",
            "八角街": "jh 26;#6 w;s;s;#4 w",
            "驿站": "jh 26;#6 w;s;w",
            "子午楼": "jh 27;ne;w",
            "天山山路": "jh 28;n;n",
            "伊犁": "jh 28;nw",
            "巴依家院": "jh 28;nw;e",
            "星宿海": "jh 28;#4 n;ne;nw",
            "百龙山": "jh 28;n;#4 w;n",
            "三清宫厨房": "jh 29;#4 n;#3 event_1_60035830;event_1_65661209;#7 n;event_1_98579273;e",
            "三清宫储藏室。": "jh 29;#4 n;#3 event_1_60035830;event_1_65661209;#7 n;event_1_98579273;n;e",
            "兵器室": "jh 30;#10 n;w;w",
            "练功室": "jh 31;#3 n;#4 w;#4 n;w",
            "羊肠小道": "jh 31;#3 n",
            "云锦二楼": "jh 32;n;n;se;#4 n;#3 w;n;w;n;e;n;e;n;n",
            "山庄门口": "jh 32;n;n",
            "雅致大厅": "jh 32;n;n;se;n",
            "白曲湖": "jh 32;n;n;se;#4 n;#3 w;n;w",
            "碧鸡山顶": "jh 33;sw;sw;#4 s;#4 e;se;s;e",
            "剑川镇": "jh 33;sw;sw;#3 s;nw;n;nw;n",
            "下棋亭": "jh 34;ne;#5 e;n;e;n",
            "花路": "jh 34;ne;#5 e;#3 n;#3 w;n;n;yell;#3 n",
            "冰湖": "jh 5;#10 n;ne;chuhaigo;#3 nw;n;ne;nw;w;nw;#5 e;se;e",
            "海边": "jh 25;#5 e;s",
            "巨石": "jh 18;n;nw;#5 n",

            "星宿海-杂货铺-买卖提|寻找火折": "jh 28;nw;w;buy /map/xingxiu/npc/obj/fire from xingxiu_maimaiti;clan submit_task",
            "星宿海-天山山路|战胜狮吼师兄": "jh 28;n;n;",
        },

        OTHER: {
            "扬州出发钓鱼加玄铁": "jh 5;#10 n;ne;chuhaigo;#3 nw;n;ne;nw;w;nw;#5 e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;cancel_prompt;s;e;s;e;s;s;e",
            "钓鱼加玄铁": "jh 35;#3 nw;n;ne;nw;w;nw;#5 e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;cancel_prompt;s;e;s;e;s;s;e"
        }
    }
}

/**
 * Maps Manager
 */
var Navigation = {

    traversal: async function (city, target) {
        let path = PathManager.getTraversalPathByCity(city);
        if (!path) {
            log("No available map for " + city + " for now.");
            return;
        }

        let steps = path.split(";").extract();
        for (let i = 0; i < steps.length; i++) {
            await Navigation.move(steps[i]);

            if (Panels.Notices.getLastMessage().match("这儿没有这个方向")) {
                log("Wrong path: " + steps[i] + ", at " + Objects.Room.getName());
                break;
            }

            if (Objects.Room.getName() === target || Objects.Room.LikeNpc(target)) break;
        }
    },

    goto: async function (target) {
        let path = PathManager.getPathByTarget(target);
        if (path) {
            await Navigation.move(path);
        } else if (1) {
            await Navigation.move("find_family_quest_road");
            await Navigation.move("find_clan_quest_road");
        } else {
            log("No available path for " + target);
        }
    },

    move: async function (path) {
        let steps = path.split(";").extract();

        for (let i = 0; i < steps.length; i++) {
            await ExecutionManager.asyncExecute("clickButton('" + steps[i] + "')");

            if (Navigation.checkRisk()) {
                Navigation.escape();
                break;
            }
        }
    },

    checkRisk: function () {
        return Panels.Notices.getLastMessage().match("^看起来火麒麟王想杀死你！");
    },

    escape: function () {
        BattleManager.perform(["茅山道术"]);
        $("#btnEscape").click();
    }
}

function log(message) {
    console.log(message);
}

function debugging(message) {
    if (CONST_DEBUG_MODE) console.log("debugging: " + message);
}

Array.prototype.extract = function () {
    let result = [];

    for (let i = 0; i < this.length; i++) {
        if (this[i].charAt(0) === "#") {
            let r = this[i].match("#(.*?) (.*)");
            let repeatTimes = parseInt(r[1]);
            for (let j = 0; j < repeatTimes; j++) {
                result.push(r[2]);
            }
        } else {
            result.push(this[i]);
        }
    }

    return result;
}

/**
 * DailyTasks Bar Setup
*/
var RCtrigger = 0;
var DailyTasksConfigurations = [{
    subject: "Daily Tasks|常用-签到",

    buttons: [{
        label: 'CheckIn1|一键日常',
        title: "一键日常",
        id : "CheckIn1",
        eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                RCtrigger=1;
                cmdDelayTime = 300;
                CheckIn1();
            } else {
                RCtrigger=0;
                clearTrigger();
                cmdDelayTime = 200;
                //clearTimeout(rcTime);
            }
        }
    },
              {label: 'yandixiang|扬州炎帝香',title: "扬州炎帝香",id:'yandi',eventOnClick() {go2("jh 5;n;n;n;n;n;n;w;event_1_69751810;event_1_43899943 go 5;home;");}},//扬州炎帝祭典
              {label: 'diaoyuqiandao|活动签到',title: "活动签到",id:'huodongqiandao',eventOnClick() {go2("jh 1;w;w;w;w;n;event_1_68865904");go2("jh 5;n;w;event_1_3144437;home;");go2("jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n;event_1_355715;event_1_355715;home;");go2("jh 1;event_1_38436482;home;"); go2("jh 1;w;event_1_89921927;home;"); }},//钓鱼签到-乔峰甲辰礼包-剑大师礼包
              {label: 'diaoyuqiandao2|小号签到',title: "活动签到",id:'diaoyuqiandao',eventOnClick() {go2("jh 1;w;w;w;w;n;event_1_68865904");go2("jh 5;n;w;event_1_3144437;home;");go2("jh 1;w;w;w;w;w;n;event_1_66563556;home;");go2("items get_store /obj/quest/jinyuhufusuipian;event_1_56364978;");go2("jh 1;e;n;n;n;n;w;event_1_90287255 go go_lsyj;event_1_49251725;home");}},//钓鱼签到-乔峰甲辰礼包-取虎符、合成-新地图换礼包
              {label: 'jiachengame1|小二抽奖',title: '1000次抽奖',id:'diaoyuqiandao',eventOnClick() {go2("jh 1;items get_store /obj/shop/choujiangquan;");if (ButtonManager.toggleButtonEvent(this)){go2('#101 go_choujiang 10')}else{clearTrigger()}}},
              {label: 'jiachengame1|小二抽奖',title: '1000次抽奖',id:'diaoyuqiandao',eventOnClick() {go2("jh 1;items get_store /obj/shop/choujiangquan;");if (ButtonManager.toggleButtonEvent(this)){go2('#101 go_choujiang 10')}else{clearTrigger()}}},
              {
                  label: 'richang2|日常潜能',
                  title: "白陀、青城、峨眉、毒魔等潜能日常",
                  id : "richang2",
                  eventOnClick() {
                      if (ButtonManager.toggleButtonEvent(this)) {
                          richang()
                      } else {
                          clearTrigger();
                          cmdDelayTime = 200;
                      }
                  }
              },{
                  label: 'qixia|自动奇侠',
                  title: '自动奇侠',
                  eventOnClick() {
                      qixia.Start(1)
                  }
              },{
                  label: 'zhaochaishao|寻柴邵',
                  title: '寻找柴邵',
                  eventOnClick() {

                      go2('rank go 232;s;s;s;se;se;e;s;s;s;s;se;se;s;s;s;event_1_83417762;')
                      go2('#900 ask tianlongsi_chaishao')

                  }
              },{
                  label: 'askchaishao|对话柴邵',
                  title: '对话柴邵',
                  eventOnClick() {
                      if (ButtonManager.toggleButtonEvent(this)){
                          go2('#900 ask tianlongsi_chaishao')
                      }else{
                          clearTrigger()
                      }
                  }
              },{
                  label: 'zhuyuyan|祝玉妍',
                  title: '祝玉妍',
                  id:'zhuyuyan',
                  eventOnClick() {
                      if (ButtonManager.toggleButtonEvent(this)){
                          zhuyuyan.start()
                      }else{
                          zhuyuyan.end()
                      }
                  }
              },{
                  label: 'tongling|通灵',
                  title: '增加技能数量上限',
                  id:'tongling',
                  eventOnClick() {

                      let n=prompt("请输入通灵次数：","");
                      n=Number(n)
                      go("jh 7;s;s;s;s;s;s;s;sw;w;");
                      if (!n) {
                          return;
                      }
                      for(j=0; j<n; j++)
                          go("event_1_83700396");
                  }
              },{
                  label: 'shuangxiu|符谣红',
                  title: '生死双休',
                  id:'shuangxiu',
                  eventOnClick() {
                      go("rank go 234;s;s;s;e;ne;");
                  }
              },{
                  label: 'erengu|离别钩',
                  title: '打离别钩',
                  id:'erengu',
                  eventOnClick() {
                      go("rank go 237;nw;n;n;n;n;w;");
                  }
              },{
                  label: 'hangjie|杭界山',
                  title: '杭界山',
                  id:'hangjie',
                  eventOnClick() {
                      go("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;");
                  }
              },{
                  label: 'hengtiao|左右横跳',
                  title: '杭界山乱走',
                  id:'hengtiao',
                  eventOnClick() {
                      go("nw;se");
                  }
              },{
                  label: 'bangpaixaing|帮派上香',
                  title: '帮派香',
                  id:'bangpaixiang',
                  eventOnClick() {
                      go2("items get_store /obj/shop/shaoxiangfu;");//取烧香符
                      for(let j=0;j<3;j++)
                      {go2("#20 clan incense jx;#5 clan incense cx;items use obj_shaoxiangfu;");}
                  }
              },{
                  label: 'xiuchangcheng|修补长城',
                  title: '修补长城，一周一次',
                  id:'xiuchangcheng',
                  eventOnClick() {

                      go2("rank go 263;e;s;w;w;s;sw;sw;sw;sw;nw;nw;n;nw;sw;sw;event_1_31278422;");//修长城

                  }
              },{
                  label: 'chinangua|吃南瓜',
                  title: '吃南瓜',
                  id:'chinangua',
                  eventOnClick() {

                      go("get corpse3422904;items use tianlongsi_nanguagu;items use tianlongsi_sanxiangmenmgzhuling;");//

                  }
              },{
                  label: 'ceshi|自动南瓜',
                  title: '自动杀白开心',
                  id:'ceshi11',
                  eventOnClick() {
                      NGMZ1()
                  }
              },{
                  label: 'maijiu|买酒',
                  title: '方秀珣买酒，做玄冰烈火酒',
                  id:'maijiu',
                  eventOnClick() {

                      go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w");//买酒

                  }
              },{
                  label: 'tangmenyao|唐门炼药',
                  title: '九转丹药，玄冰烈火酒',
                  id:'tangmenyao',
                  eventOnClick() {

                      go("jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se");//唐门炼药

                  }
              },{
                  label: 'qucailiao1|取酒材料',
                  title: '玄冰烈火酒',
                  id:'qucailiao1',
                  eventOnClick() {
                      go("items get_store /obj/snmf/baiyixuemei");		//百宜雪梅彩
                      go("items get_store /obj/snmf/baiyixuemei1");		//百宜雪梅白
                      go("items get_store /obj/snmf/fenghuaqunniang");	//风花琼酿
                      go("items get_store /obj/shop/wuyiwei");		//舞鸢尾
                      go("items get_store /obj/snmf/wanxiangyu");		//晚香玉
                      go("items get_store /obj/snmf/zhaokaimuluohua");	//朝开暮落花
                  }
              },{
                  label: 'maidanyao3|买回内药',
                  title: '买药',
                  id:'fangpao',
                  eventOnClick() {
                      go("rank go 232;s;s;s;se;se;e;s;s;s;s;w;w;sw;sw;s;");//找浮沉子
                      for(j=0;j<5;j++)
                          go("buy /map/tianlongsi/obj/sanqingwan_N_10 from tianlongsi_fuchenzi;");//买三清丹
                      go("jh 1;e;n;n;n;w;");//找杨掌柜
                      for(j=0;j<10;j++)
                          go("buy /map/snow/obj/wannianlingzhi_N_10 from snow_herbalist;");//买万年
                      for(j=0;j<50;j++)
                          go("buy /map/snow/obj/qiannianlingzhi_N_10 from snow_herbalist;");//买千年
                      go("home");
                  }
              },{
                  label: 'qingshaqi|杀气清零',
                  title: '清杀气',
                  id:'shaqi',
                  eventOnClick() {
                      let n=prompt("请输入杀气值：","");
                      n=Number(n)
                      go2("jh 1;e;e;");
                      for(j=0; j<Math.floor(n/10000); j++)
                          go("event_1_75058126");
                      n=n%10000
                      for(j=0; j<Math.floor(n/100); j++)
                          go("event_1_42553559");
                      n=n%1000
                      for(j=0; j<Math.floor(n/10); j++)
                          go("event_1_2912009");
                      go("event_1_2912009");
                  }
              },{
                  label: 'linghuiyuan|领会员',
                  title: '雪婷会员点',
                  id:'huiyuan',
                  eventOnClick() {
                      go2("jh 1;event_1_85373703;home;");//找逄义领会员
                  }
              },{
                  label: 'linglunjianjifen|领论剑积分',
                  title: '论剑积分',
                  id:'jifen',
                  eventOnClick() {
                      go2("home;swords get_drop go;jh 4;n;n;n;e;lq_twar;home;");//找逄义领会员
                  }
              },{
                  label: 'zuduibang1|组队帮本1',
                  title: '带队',
                  id:'zuduibang1',
                  eventOnClick() {
                      go2("team create;");//建队伍
                      go2("clan;clan scene;clan fb;clan fb go_saodang shenshousenlin;");//扫荡帮本1
                      go2("clan fb enter daxuemangongdao;");//进入帮本2


                  }
              },{
                  label: 'zuduibang2|组队帮本2',
                  title: '跟队',
                  id:'zuduibang2',
                  eventOnClick() {

                      go2("clan;clan scene;clan fb;clan fb go_saodang shenshousenlin;");//扫荡帮本1
                      go2("team join u8122979(3);");//进队伍
                      go2("clan fb enter daxuemangongdao;");//进入帮本2


                  }
              },{
                  label: 'fennghuamijing1|风花玄铁1',
                  title: '琅嬛玉洞',
                  id:'fenghuamijing1',
                  eventOnClick() {
                      for(let i=0;i<5;i++){
                          go2("jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;");//风花选秘境
                          go2("event_1_52732806;");//进琅嬛玉洞
                          go2("ne;n;se;se;se;se;");//去扫荡
                      }

                  }
              },{
                  label: 'fennghuamijing2|风花玄铁2',
                  title: '山崖',
                  id:'fenghuamijing2',
                  eventOnClick() {
                      for(let i=0;i<5;i++){
                          go2("jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;");//风花选秘境
                          go2("event_1_64526228;");//进山崖
                          go2("w;n;n;n;n;n;w");//去扫荡
                      }

                  }
              },{
                  label: 'fennghuamijing3|小号风花1',
                  title: '琅嬛玉洞',
                  id:'fenghuamijing3',
                  eventOnClick() {
                      for(let i=0;i<5;i++){
                          go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 6;");//雪婷搭马车
                          go2("nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;");//风花选秘境
                          go2("event_1_52732806;kill langhuanyudong_qixing;kill langhuanyudong_benkuangxiao;");//进琅嬛玉洞
                          go2("ne;n;se;se;se;se;event_1_61856223;event_1_74168671;event_1_74168671 go");//去扫荡
                      }
                  }
              },{
                  label: 'fennghuamijing4|小号风花2',
                  title: '山崖',
                  id:'fenghuamijing3',
                  eventOnClick() {
                      for(let i=0;i<5;i++){
                          go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 6;");//雪婷搭马车
                          go2("nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;");//风花选秘境
                          go2("event_1_64526228;");//进山崖
                          go2("kill shanya_muzhaoxue;kill shanya_qiongduwu;kill shanya_yuanzhenheshang;w;n;n;n;n;n;;w;event_1_66983665;event_1_97070517;event_1_97070517 go");//去扫荡
                      }
                  }
              },{
                  label: 'lv13|十三剑',
                  title: '十三级剑',
                  id:'zhandouzhuangbei1',
                  eventOnClick() {
                      go2("wield obj_ryxxj");//十三
                  }
              },{
                  label: 'zhandouzhuangbei1|战斗装备1',
                  title: '离别钩，棍，拳',
                  id:'zhandouzhuangbei1',
                  eventOnClick() {
                      go("unwield obj_ryxxj");//十三剑
                      go("unwield tianlongsi_sb_libiegou;unwield weapon_sb_stick12;unwield weapon_sb_unarmed12");//小鹿
                      go("wield tianlongsi_sb_libiegou;wield weapon_sb_stick12;wield weapon_sb_unarmed12 rumai");//小鹿

                  }
              },{
                  label: 'zhandouzhuangbei2|战斗装备2',
                  title: '离别钩，棍，斧',
                  id:'zhandouzhuangbei2',
                  eventOnClick() {
                      go("unwield obj_ryxxj");//十三剑
                      go("unwield tianlongsi_sb_libiegou;unwield weapon_sb_stick12;unwield weapon_sb_unarmed12");//小鹿
                      go("wield tianlongsi_sb_libiegou;wield weapon_sb_stick12;wield weapon_sb_axe12 rumai");//零一二三

                  }
              },{
                  label: 'zhandouzhuangbei3|战斗装备3',
                  title: '离别钩，棍，锤',
                  id:'zhandouzhuangbei3',
                  eventOnClick() {
                      go("unwield obj_ryxxj");//十三剑
                      go("unwield tianlongsi_sb_libiegou;unwield weapon_sb_stick12;unwield weapon_sb_hammer12");//小鹿
                      go("wield tianlongsi_sb_libiegou;wield weapon_sb_stick12;wield weapon_sb_hammer12 rumai");//四号

                  }
              },{
                  label: 'zhandouzhuangbei4|战斗装备4',
                  title: '离别钩，刀，棍',
                  id:'zhandouzhuangbei4',
                  eventOnClick() {
                      go("unwield obj_ryxxj");//十三剑
                      go("unwield tianlongsi_sb_libiegou;unwield weapon_sb_stick12;unwield weapon_sb_hammer12");//小鹿
                      go("wield tianlongsi_sb_libiegou;wield weapon_sb_blade12;wield weapon_sb_stick12 rumai");//四号

                  }
              },{
                  label: 'jianshen|装备剑神',
                  title: '装备剑神套装',
                  id:'jianshen',
                  eventOnClick() {
                      go2("");//卸载垂钓
                      go2("remove obj_zhongzuiduxing;remove obj_qingtianwanshi;remove obj_lankeyimeng;remove obj_shanyecunfu;remove obj_xianzhe-xianglian;remove obj_xianzhe-shouzhuo;remove obj_xianzhe-jiezhi;");//卸载贤者
                      //穿剑神
                      go2("wear obj_jianyironghen;wear obj_wuyinglou-jiezhi;wear obj_jianxinbumie;wear obj_jiandaozhangcun;wear obj_wuyinglou-xianglian;wear obj_wuwozhijian;wear obj_wuyinglou-shouzhuo;");//
                  }
              },{
                  label: 'chuidiao|装备垂钓',
                  title: '装备垂钓套装',
                  id:'chuidiao',
                  eventOnClick() {
                      go2("remove obj_jianyironghen;remove obj_wuyinglou-jiezhi;remove obj_jianxinbumie;remove obj_jiandaozhangcun;remove obj_wuyinglou-xianglian;remove obj_wuwozhijian;remove obj_wuyinglou-shouzhuo;");//卸载剑神
                      go2("remove obj_zhongzuiduxing;remove obj_qingtianwanshi;remove obj_lankeyimeng;remove obj_shanyecunfu;remove obj_xianzhe-xianglian;remove obj_xianzhe-shouzhuo;remove obj_xianzhe-jiezhi;");//卸载贤者
                      //穿垂钓
                      go2("");//
                  }
              },{
                  label: 'xianzhe|装备贤者',
                  title: '装备贤者套装',
                  id:'xianzhe',
                  eventOnClick() {
                      go2("");//卸载垂钓
                      go2("remove obj_jianyironghen;remove obj_wuyinglou-jiezhi;remove obj_jianxinbumie;remove obj_jiandaozhangcun;remove obj_wuyinglou-xianglian;remove obj_wuwozhijian;remove obj_wuyinglou-shouzhuo;");//卸载剑神
                      //穿贤者
                      go2("wear obj_zhongzuiduxing;wear obj_qingtianwanshi;wear obj_lankeyimeng;wear obj_shanyecunfu;wear obj_xianzhe-xianglian;wear obj_xianzhe-shouzhuo;wear obj_xianzhe-jiezhi;");//
                  }
              },{
                  label: 'zhiliao|回血',
                  title: '测试',
                  id:'huixue',
                  eventOnClick() {
                      getMaxMP()
                  }
              },{
                  label: 'biguanxiulian|闭关修炼',
                  title: '任意位置打开修炼侍修炼，闭关修炼',
                  id:'huixue',
                  eventOnClick() {
                      go2("xls show;xls practice;golook_room;");
                  }
              },{
                  label: 'fudilianyao|府邸炼药',
                  title: '任意位置打开府邸开始炼药',
                  id:'fudilianyao',
                  eventOnClick() {
                      go("items get_store /obj/med/qnlc2");
                      go("items get_store /obj/med/qnzz2");
                      go("items get_store /obj/snmf/bingyingxianlu");
                      go("items get_store /obj/snmf/cangwudongshen");
                      go("items get_store /obj/med/dahuandan");
                      go("items info obj_dahaidan4");
                      go("items get_store /obj/med/kuangbaodan4");
                      go("items get_store /obj/med/qiankundan4");
                      go("items get_store /obj/med/dahuandan2");
                      go("items get_store /obj/med/kuangbaodan2");
                      go("items get_store /obj/med/qiankundan2");
                      go("items get_store /obj/med/kuangbaodan");
                      go("items get_store /obj/snmf/kunlunhuolian");
                      go("items get_store /obj/med/qnlc");
                      go("items get_store /obj/snmf/longhuoteng");
                      go("items get_store /obj/med/qnlc3");
                      go("items get_store /obj/med/qnzz3");
                      go("items get_store /obj/med/qiankundan");
                      go("items get_store /obj/med/dahuandan3");
                      go("items get_store /obj/med/kuangbaodan3");
                      go("items get_store /obj/med/qiankundan3");
                      go("items get_store /obj/med/qnlc4");
                      go("items get_store /obj/med/qnzz4");
                      go("items get_store /obj/snmf/xilingchongcao");
                      go("items get_store /obj/med/xiaohuandan");
                      go("items get_store /obj/med/qnzz");
                      go2("fudi shennong;fudi shennong fetch;");//府邸收获丹药
                  }
              },{label: 'ZDlianyao|自动炼药',
                 title: '自动每一小时炼药一次',
                 id:'zdlianyao',
                 eventOnClick() {
                     if (ButtonManager.toggleButtonEvent(this)){
                         FDlianyao();
                     }else{
                         clearInterval(lianyao_interval);
                         Infor_OutFunc("自动炼药已停止，穷鬼赶紧氪个小明吧");
                     }
                 }},{label: 'GWqz|观舞抢座',
                     title: '观舞抢座',
                     id:'gwqz',
                     eventOnClick() {
                         if (ButtonManager.toggleButtonEvent(this)){
                             GWqiangzuo();
                         }else{
                             clearInterval(QiangZuo);
                             Infor_OutFunc("老色批，居然被你抢到了，仙子要遭罪了");
                         }
                     }},{label: 'makeDC1|冰月材料',
                         title: '买冰月材料',
                         id:'makeDC',
                         eventOnClick() {
                             go2("reclaim buy 11 1400;items get_store /obj/quest/jueshiyinxiasuipian;items get_store /obj/shop/dog_liquan;");
                         }},{label: 'makeDC2|底材制作',
                             title: '制作13级装备的底材，\n 斩龙升级至12级装备，\n 并升级冰月一二三 \n 492000万消费积分、4500绝世碎片、2000源质 \n 700长生石，1400冰月羽，金锭银锭、一级宝石玉石若干 \n 狗券等材料',
                             id:'makeDC',
                             eventOnClick() {
                                 up13amor()
                             }},{label: 'makelv13|制作13级',
                                 title: '制作13级装备，需要选择装备种类，镶嵌宝石，并装备',
                                 id:'',
                                 eventOnClick() {
                                     lv13amormake()
                                 }},

             ]
}]
var DailyTasksConfigurations2 = [{
    subject: "Daily Tasks|常用-签到",

    buttons: [{}]
}
                                ]
//按钮参数设置
var CONST_BUTTON_WIDTH = 100;//按钮宽度
var CONST_BUTTON_HEIGHT = 20;//按钮高度
var CONST_BUTTON_OFFSET_LANDSCAPE = 5;//按钮水平间距
var CONST_BUTTON_NUMBER_EACH_COLUMN = 25;//按键单列数量
var CONST_DEFAULT_TOP = 30;//按键首行位置

var topPx = CONST_DEFAULT_TOP;
var rightPx = 0;
var counter = 0;

function adjustPosition(button) {
    let column = (Math.ceil((counter + 1) / CONST_BUTTON_NUMBER_EACH_COLUMN) - 1);

    rightPx = (column+1) * (CONST_BUTTON_WIDTH + CONST_BUTTON_OFFSET_LANDSCAPE);
    topPx = (counter - column * CONST_BUTTON_NUMBER_EACH_COLUMN) % CONST_BUTTON_NUMBER_EACH_COLUMN === 0 ? CONST_DEFAULT_TOP : topPx + 25;

    button.style.width = CONST_BUTTON_WIDTH + 'px';
    button.style.height = CONST_BUTTON_HEIGHT + 'px';
    button.style.position = 'absolute';
    button.style.right = rightPx + 'px';
    button.style.top = topPx + "px";
    counter++;
}

function createReservedPosition(number) {
    for (let i = 0; i < number; i++) {
        let button = document.createElement('button');

        adjustPosition(button);
        button.innerText = "";
        button.hidden = true;
        document.body.appendChild(button);
    }
}
function buildLabel(labelConf) {
    let labels = labelConf.split("|");

    if (CONST_LANGUAGE_IN_CHINESE && labels.length > 1) {
        return labels[1];
    } else {
        return labels[0];
    }
}

function createSubject(subject,className) {
    let button = document.createElement('button');

    button.innerText = buildLabel(subject);
    console.log(button.innerText)
    adjustPosition(button);
    button.style.border = "none";
    button.style.background = "white";
    button.disabled = true;
    button.className = className;

    document.body.appendChild(button);
}

function createButtons(buttons,className) {
    for (let j = 0; j < buttons.length; j++) {
        if (buttons[j].hidden) continue;

        let button = createButton(buttons[j],className);
        button.addEventListener('click', buttons[j].eventOnClick);
    }
}

function createButton(conf,className) {
    let button = document.createElement('button');

    adjustPosition(button);
    button.innerText = buildLabel(conf.label);
    button.name = button.innerText;
    button.className = className;

    if (conf.id) button.id = conf.id;
    if (conf.title) button.title = conf.title;

    document.body.appendChild(button);
    return button;
}
var CONST_LANGUAGE_IN_CHINESE = "zh" === (navigator.systemLanguage ? navigator.systemLanguage : navigator.language).substr(0, 2);

var initializeDailyTasksButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < DailyTasksConfigurations.length; i++) {
        let group = DailyTasksConfigurations[i];

        createSubject(group.subject,'canBeHiddenDailyTasks');
        createButtons(group.buttons,'canBeHiddenDailyTasks');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "常用-签到";
        button.title = "可以来回切换";
        button.id = "DailyTasksConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenDailyTasks").attr("hidden", "true");
                if (ButtonId == "DailyTasksConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenDailyTasks").removeAttr("hidden");
                if (ButtonId != "DailyTasksConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "DailyTasksConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeDailyTasksButtons();

/**
 * AutoFight Bar Setup
*/
var AutoFightConfigurations = [{
    subject: "AutoFight1|日常爬塔",
    buttons: [

        {label: 'killLR|杀小龙人',title: "杀两次小龙人",id:'gota1',eventOnClick() {go2("jh 2;event_1_69287816;#2 kill snow_xiaolongren;");}},
        {label: 'killCH|杀斥候',title: "用一次，杀四个，打不过开循环杀",id:'gota1',eventOnClick() {go2("home;items use obj_yech_csf;#4 kill snow_yech;");}},
        {label: 'zdSCH|自动斥候',
         title: "输入门票数量，自动杀幽厄斥候，杀完即止。 \n没打过会接着打，妈妈再也不担心我浪费门票了",
         id:'gota1',eventOnClick() {
                 autokillCH()
         }},
        {label: 'longchenSG|龙辰',title: "龙辰",id:'gota1',eventOnClick() {go2("items get_store /obj/quest/jinyuhufusuipian;event_1_56364978;");go2("jh 1;e;n;n;n;n;w;event_1_90287255 go go_lsyj;event_1_49251725;");}},
        {label: 'xiandiao|天龙闲钓',title: "天龙闲钓",id:'gota1',eventOnClick() {go2("rank go 233;s;s;s;s;s;s;sw;se;sw;se;s;s;diaoyu;")}},
        {label: 'caicha|天龙采茶',title: "天龙采茶",id:'gota1',eventOnClick() {go2("rank go 233;s;s;s;e;ne;e;ne;ne;e;e;e;diaoyu;");}},
        {label: 'lingyun1|通天塔',title: "通天塔",id:'gota1',eventOnClick() {go2("rank go 194");}},
        {label: 'lingyun2|红螺寺',title: "红螺寺",id:'gota2',eventOnClick() {go2("rank go 195");}},
        {label: 'lingyun3|越女剑楼',title: "越女楼",id:'gota3',eventOnClick() {go2("rank go 205");}},
        {label: 'lingyun4|铸剑洞',title: "铸剑洞",id:'gota4',eventOnClick() {go2("rank go 211");}},
        {label: 'lingyun5|阎王殿',title: "阎王殿",id:'gota5',eventOnClick() {go2("rank go 222");}},
        {label: 'lingyun6|霹雳堂',title: "霹雳堂",id:'gota6',eventOnClick() {go2("rank go 223");}},
        {label: 'lingyun7|葬剑谷',title: "葬剑谷",id:'gota7',eventOnClick() {go2("rank go 224");}},
        {label: 'lingyun8|无湘楼',title: "无湘楼",id:'gota8',eventOnClick() {go2("rank go 230");}},
        {label: 'lingyun9|藏典塔',title: "藏典塔",id:'gota9',eventOnClick() {go2("rank go 233");}},
        {label: 'lingyun10|魔皇殿',title: "魔皇殿",id:'gota10',eventOnClick() {go2("rank go 237");}},
        {label: 'lingyun11|名将堂',title: "名将堂",id:'gota11',eventOnClick() {go2("rank go 263");}},
        {label: 'lingyun12|一品堂',title: "一品堂",id:'gota12',eventOnClick() {go2("rank go 296");}},
        {label: 'lingyun13|灵鹫宫',title: "灵鹫宫",id:'gota13',eventOnClick() {go2("rank go 312");}},
        {label: 'lingyun14|无为寺',title: "无为寺",id:'gota14',eventOnClick() {go2("jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;n;n;n;ne;ne;nw;nw;n;n;n;n;n;n;");}},
        {label: 'lingyun15|石棺',title: "石棺",id:'gota15',eventOnClick() {go2("jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;n;n;n;nw;nw;w;nw;n;n;w;n;n;");}},
        {label: 'lingyun16|拱辰楼',title: "拱辰楼",id:'gota16',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;n;");}},
        {label: 'lingyun30|龙辰试炼',title: "龙辰试炼",id:'gota16',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go go_lsyj;event_1_49251725;s;s;s;s;s;s;w;w;w;w;");}},
        {label: 'lingyun31|龙神秘境',title: "龙神秘境",id:'gota16',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go go_lsyj;event_1_49251725;s;s;s;s;s;s;s;s;s;s;s;s;");}},
    ]}
                               //  ,{subject: "zhanhang|",buttons: []}
                               // ,{subject: "zhanhang|",buttons: []}
                               ,{
                                   subject: "AutoFight2|日常周常",
                                   buttons: [
                                       {label: 'fishtogift|老头换鱼',title: "老头换鱼",id:'huashanjijiu',eventOnClick() {go2("jh 5;n;w;event_1_6795209;"); }},//扬州姜子牙换鱼
                                       {label: 'newmijing1|秘境炼药',title: "老头换鱼",id:'huashanjijiu',eventOnClick() {go2("jh 1;e;#4 n;w;event_1_90287255 go go_lsyj;#6 s;e;se;se;se;"); }},//
                                       {label: 'newmijing2|秘境锻造',title: "老头换鱼",id:'huashanjijiu',eventOnClick() {go2("jh 1;e;#4 n;w;event_1_90287255 go go_lsyj;#4 s;#3 w;#4 n"); }},//
                                       {label: 'newmijing3|秘境破石',title: "老头换鱼",id:'huashanjijiu',eventOnClick() {go2("jh 1;e;#4 n;w;event_1_90287255 go go_lsyj;#4 s;#4 e;ne;ne;ne;event_1_76186619");}},//
                                       {label: 'huashanjijiu|华山祭酒',title: "华山祭酒",id:'huashanjijiu',eventOnClick() {go2("jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n;event_1_355715;event_1_355715;"); }},//华山祭酒
                                       {label: 'luoyangCK|洛阳采矿',title: "华山祭酒",id:'huashanjijiu',eventOnClick() {go2("jh 2;#10 n;w;w;event_1_85264690;w;w;event_1_37287831;event_1_7731992;"); }},//洛阳采矿
                                       {label: 'zhuangbeijinjie|装备进阶',title: "铁雪欧冶子装备进阶",id:'zhuangbeijinjie',eventOnClick() {go2("jh 31;n;n;n;w;w;w"); }},//装备进阶
                                       {label: 'shoushijinjie|首饰进阶',title: "西安李靖首饰进阶",id:'shoushijinjie',eventOnClick() { go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;");}},//首饰进阶
                                       {label: 'chasheng|茶圣学艺',title: "京城万福楼茶圣学艺",id:'chasheng',eventOnClick() {go2("jh 49;n;n;n;n;n;e;e;s;event_1_34417168;");}},//京城万福楼茶圣学艺
                                       {label: 'rongbao|荣宝斋',title: "酒馆到荣宝斋，换武林绝学",id:'mache',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;w;w;s;s;s;s;s;s;s;s;s;s;w;w;n;");}},//搭乘马车去南诏，从酒馆到荣宝斋
                                       {label: 'mache1|南诏马车',title: "mache1",id:'mache',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;");}},//搭乘马车去南诏
                                       {label: 'nanzhaoshuyuan|南诏理财',title: "马车到书院理财",id:'nanzhaoshuyuan',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;e;e;e;e;e;s;s;s;s;e;e;e;e;e;se;ne;sw;nw;e;ne;e;e;n;e;event_1_30634412;e;ne;e;e;s;e;e;n;e;e;");}},//搭乘马车去南诏，从酒馆到书院
                                       {label: 'lingyun32|华山厨房',title: "华山厨房",id:'gota18',eventOnClick() {go2("jh 4;n;n;n;n;n;n;n;n;n;n;n;n;w;");}},
                                       {label: 'lingyun33|武当茶室',title: "武当茶室",id:'gota18',eventOnClick() {go2("jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s;");}},
                                       {label: 'lingyun34|雪婷山坳',title: "雪婷山坳",id:'gota18',eventOnClick() {go2("jh 1;e;n;n;n;n;n;");}},
                                       {label: 'lingyun351|观舞-二楼',title: "醉梦楼",id:'gota18',eventOnClick() {go2("jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;");}},
                                       {label: 'lingyun351|观舞-白银',title: "醉梦楼",id:'gota18',eventOnClick() {go2("jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n;");}},
                                       {label: 'lingyun351|观舞-青木',title: "醉梦楼",id:'gota18',eventOnClick() {go2("jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;e;");}},
                                       {label: 'lingyun352|观舞-源质',title: "醉梦楼",id:'gota18',eventOnClick() {go2("jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s;event_1_29896809 go;");}},
                                       {label: 'lingyun354|称号飞醉梦楼',title: "醉梦楼",id:'gota18',eventOnClick() {go2("rank go 171;w;w;w;w;w;n;n;n;e;e;");}},
                                       {label: 'lingyun36|扬州武庙',title: "扬州武庙",id:'gota18',eventOnClick() {go2("jh 5;n;n;n;n;n;n;w;event_1_69751810;");}},
                                       //{label: 'lingyun37|',title: "",id:'gota18',eventOnClick() {go("");}},
                                       {label: 'lingyun17|哈日',title: "没到的话，再点一下",id:'gota17',eventOnClick() {goHR();}},
                                       {label: 'lingyun18|剑宫白猿',title: "剑宫白猿",id:'gota18',eventOnClick() {go2("rank go 205;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;");}},
                                       {label: 'lingyun19|云远寺',title: "云远寺",id:'gota19',eventOnClick() {go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721;");}},
                                       {label: 'lingyun20|闯入冥庄',title: "闯入冥庄",id:'gota20',eventOnClick() {go2("jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145");}},
                                       {label: 'lingyun21|冥庄前院',title: "冥庄前院",id:'gota21',eventOnClick() {go2("e;kill ymsz_qianyuan_jiangyishashou;e;kill ymsz_qianyuan_jiangyishashou;n;kill ymsz_qianyuan_jiangyijianke;s;s;kill ymsz_qianyuan_jiangyijianke;n;e;kill ymsz_qianyuan_jiangyishashou;e;kill ymsz_qianyuan_jiangyishashou;ne;kill ymsz_qianyuan_jiangyijianke;sw;s;kill ymsz_qianyuan_jiangyishashou;s;kill ymsz_qianyuan_jiangyishashou;s;kill ymsz_qianyuan_jiangyishashou;e;kill ymsz_qianyuan_jupeng");}},
                                       {label: 'lingyun22|冥庄花园',title: "冥庄花园",id:'gota22',eventOnClick() {go2("e;kill ymsz_huayuan_baiguxiushi;e;kill ymsz_huayuan_baiguxiushi;ne;kill ymsz_huayuan_baiguxiushi;nw;kill ymsz_huayuan_xuejianke;se;ne;kill ymsz_huayuan_baiguxiushi;ne;kill ymsz_huayuan_xuejianke;sw;se;kill ymsz_huayuan_baiguxiushi;se;kill ymsz_huayuan_baiguxiushi;e;kill ymsz_huayuan_xuejianke;w;sw;kill ymsz_huayuan_baiguxiushi;sw;kill ymsz_huayuan_baiguxiushi;se;kill ymsz_huayuan_xuejianke;nw;sw;kill ymsz_huayuan_baiguxiushi;sw;kill ymsz_huayuan_yuwenxiu");}},
                                       {label: 'lingyun23|冥庄后院',title: "冥庄后院",id:'gota23',eventOnClick() {go2("se;kill ymsz_houyuan_guisha;se;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_guisha;w;kill ymsz_houyuan_youmingguisha;e;e;kill ymsz_houyuan_youmingguisha;w;s;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_guisha;w;kill ymsz_houyuan_youmingguisha;e;e;kill ymsz_houyuan_guisha;s;kill ymsz_houyuan_youmingguisha;n;e;kill ymsz_houyuan_guisha;e;kill ymsz_houyuan_guisha;n;kill ymsz_houyuan_youmingguisha;s;e;kill ymsz_houyuan_guisha;e;kill ymsz_houyuan_guisha;n;kill ymsz_houyuan_shiyouming");}},
                                       {label: 'lingyun24|西凉铁剑',title: "西凉铁剑",id:'gota24',eventOnClick() {go2("jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;event_1_10117215;");}},
                                       {label: 'lingyun25|四大绝杀',title: "四大绝杀",id:'gota25',eventOnClick() {go2("jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;n;event_1_33144912;");}},
                                       {label: 'lingyun26|十八木人',title: "十八木人",id:'gota26',eventOnClick() {go2("jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;");}},
                                       {label: 'lingyun28|本11',title: "打不过，只能测试了",id:'gota26',eventOnClick() {go2("fb 11;nw;kill bajieshendian_zhushajun;se;n;kill bajieshendian_shishenyiya;s;ne;kill bajieshendian_shashenyanmin;sw;e;kill bajieshendian_daoshenwentao;w;se;kill bajieshendian_xieshenyecha;nw;s;kill bajieshendian_shangbaozheng;n;sw;kill bajieshendian_libai;ne;w;kill bajieshendian_yangguang;w;kill bajieshendian_yingzheng;e;e;nw;nw;kill bajieshendian_chengzhuanlaozhu;se;se;n;n;kill bajieshendian_penzhu;s;s;ne;ne;kill bajieshendian_shashenbaiqi;sw;sw;e;e;kill bajieshendian_daoshenwudaojianjun;w;w;se;se;kill bajieshendian_xieshenxintian;nw;nw;s;s;kill bajieshendian_maxinkong;n;n;sw;sw;kill bajieshendian_jiushenyidi;kill bajieshendian_luanzhixinmo;kill bajieshendian_xinmofenshen;event_1_68529291;event_1_68529291;kill bajieshendian_luanzhixinmo;kill bajieshendian_xinmofenshen;");}},
                                       {label: 'jin12|本12',title: '进队',id:'进队',eventOnClick() {go2("fb 12");}},
                                       {label: 'lingyun37|一键周常',title: "元帅府-荣宝斋-医馆",id:'gota26',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;w;w;s;s;s;s;s;s;s;s;w;n;event_1_83706838;s;e;s;s;w;w;n;event_1_27429615;kill nanzhaoguo_wongbaozhaizhu;s;e;e;n;n;n;n;n;n;n;n;n;n;;w;w;s;event_1_27222525;home;");}},//元帅府-荣宝斋-医馆;
                                       {label: 'lingyun38|医馆问诊',title: "医馆",id:'gota26',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;w;w;w;w;s;event_1_27222525;home");}},//搭乘马车去南诏医馆，问诊后返回首页
                                       {label: 'lingyun39|元帅府奏乐',title: "元帅府奏乐,结束返回首页",id:'gota26',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;w;w;s;s;s;s;s;s;s;s;w;n;event_1_83706838;");}},//元帅府;
                                       {label: 'lingyun39|荣宝斋挑战',title: "挑战荣宝斋馆主",id:'gota26',eventOnClick() {go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;w;w;s;s;s;s;s;s;s;s;s;s;w;w;n;event_1_27429615;");}},//荣宝斋;
                                       {label: 'goteam1|扫荡帮本',title: '进队',id:'进队',eventOnClick() {go2("clan fb go_saodang shenshousenlin;clan fb go_saodang daxuemangongdao;clan fb go_saodang longwulianmoge;home;"); }},
                                       {label: 'teamgo|建队伍',title: "建队伍",id:'gota1',eventOnClick() {go2("team create;golook_room;");}},
                                       {label: 'goteam1|进小鹿队',title: '进队',id:'进队',eventOnClick() {go2("team join u3915953(3)"); }},
                                       {label: 'goteam2|进零号队',title: '进队',id:'进队',eventOnClick() {go2("team join u8122979(3)");}},
                                       {label: 'goteam3|进一号队',title: '进队',id:'进队',eventOnClick() {go2("team join u8125822(1)");}},
                                       {label: 'goteam4|进三号队',title: '进队',id:'进队',eventOnClick() {go2("team join u8125829(3)");}},
                                       {label: 'goteam5|进四号队',title: '进队',id:'进队',eventOnClick() {go2("team join u8503311(1)");}},
                                       {label: 'goteam6|进五号队',title: '进队',id:'进队',eventOnClick() {go2("team join u8429988(1)");}},
                                   ],
                               }]

var initializeAutoFightButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < AutoFightConfigurations.length; i++) {
        let group = AutoFightConfigurations[i];

        createSubject(group.subject,'canBeHiddenAutoFight');
        createButtons(group.buttons,'canBeHiddenAutoFight');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "日常-爬塔";
        button.title = "可以来回切换";
        button.id = "AutoFightConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenAutoFight").attr("hidden", "true");
                if (ButtonId == "AutoFightConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenAutoFight").removeAttr("hidden");
                if (ButtonId != "AutoFightConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "AutoFightConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeAutoFightButtons();


/**
 * SpecialEvent Bar Setup
*/
var SpecialEventConfigurations = [{
    subject: "SpecialEvent|特殊事件",

    buttons: [{
        label: 'get_ID|获取代码',
        title: '获取代码',
        id:'getid',
        eventOnClick() {
            //获取代码

            var llnpcList = [];
            var lspath,pathindex=0;
            var ll_tipinfo='';
            var arr = document.getElementsByTagName('*');

            for(var i = 0;i<arr.length;i++){
                if(arr[i].getAttribute('onclick') && arr[i].innerText){
                    var paths = arr[i].getAttribute('onclick');
                    var text= arr[i].innerText;
                    var text2=text.replace(/[^\w\s]/g, '');
                    llnpcList[pathindex]=(pathindex +1)+':'+setText(text2) + ':'+paths;
                    ll_tipinfo=ll_tipinfo+(pathindex +1)+':'+arr[i].innerText + ':'+paths+'\n';
                    pathindex=pathindex +1;
                }
            }
            YFUI.showPop({
                title: "当前页面的代码如下：\n ",
                text: document.getElementById("ll_tipinfo").innerText,
                text: ll_tipinfo,
                okText: "",

            });

            // alert("当前页面的代码如下：\n"+ll_tipinfo);

        }
    },{
        label: 'clubfight|代码测试',
        title: '代码测试',
        eventOnClick() {

            var peopleList = $(".cmd_click3");
            var thisonclick = null;
            var dade="";
            var num=peopleList.length;
            for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
                // 打印 NPC 名字，button 名，相应的NPC名
                thisonclick =peopleList[i].getAttribute('onclick');
               dade = dade+peopleList[i].innerText+"\n";



            }
            alert(dade+num);
        }

    },{
        label: 'CTcs|窗体测试',
        title: '窗体测试',
        eventOnClick() {
            checkqixia();
            go2("talk奇侠检测完成");
        }
    },
              {
                  label: 'swordCH|论剑称号',
                  title: '论剑积分全部称号兑换',

                  eventOnClick() {
                      go("home;swords shop go;swords shop_buy 9;swords shop_buy 10;swords shop_buy 11;swords shop_buy 12;swords shop_buy 13;swords shop_buy 14;swords shop_buy 15;swords shop_buy 16;swords shop_buy 17;swords shop_buy 18;swords shop_buy 19;swords shop_buy 20;swords shop_buy 21;swords shop_buy 22;home;");
                  }
              }, {
                  label: 'clearPuzzle|清谜题',
                  title: '清除谜题...',

                  eventOnClick() {
                      go2('auto_tasks cancel');
                  }
              }, {
                  label: 'changge|自动接唱',
                  title: '自动接唱...',
                  id:'唱歌',
                  eventOnClick() {
                      if (ButtonManager.toggleButtonEvent(this)) {
                          changge.ready();
                          console.log('开始')
                      }else{
                          changge.end();
                      }
                  }
              },
              {
                  label: 'learnskill|学习技能',
                  title: '和师父在同一房间，点击学习即可学习所有技能',
                  id:'学习技能',
                  eventOnClick() {
                      learnSkill()
                  }
              },{
                  label: 'teachYouxia|传授游侠',
                  title: '打开游侠技能页面，然后点击按钮',
                  id:'传授游侠',
                  eventOnClick() {
                      teachYouxia()
                  }
              },{
                  label: 'upgradeYouxia|升级游侠',
                  title: '打开聚贤堂，然后点击按钮',
                  id:'升级游侠',
                  eventOnClick() {
                      clickButton('fudi juxian')
                      setTimeout(upgradeYouxia,1500)
                  }
              },


              {
                  label: 'findmap|地图寻人',
                  title: '地图寻人...',
                  id:'findmap',
                  eventOnClick() {
                      if (ButtonManager.toggleButtonEvent(this)) {
                          let place = prompt("请输入完整地图名称，例如雪亭镇，目前地图仅支持到机关城",'');
                          if(!place) return;
                          let npc = prompt("请输入要寻人姓名",'');
                          if(!npc) return;
                          if(!places[place]){
                              InforOutFunc('未知地点')
                          }
                          turnFind.goFind(npc,place,function(){ButtonManager.resetButtonById("findmap")})
                      }else{
                          clearTrigger();
                      }
                  }
              },
              {
                  label: 'synchandle|队伍同步',
                  title: '同步操作...',
                  id:'synchandle',
                  eventOnClick() {
                      if (ButtonManager.toggleButtonEvent(this)) {
                          syncHandle.start();
                      }else{
                          syncHandle.end()
                      }
                  }
              },{
                  label: 'canwujianzhen|参悟剑阵',
                  title: '浣花剑阵参悟武学,除去防御敏捷',
                  id:'canwujianzhen',
                  eventOnClick() {
                      for(i=0;i<2;i++)
                          go("hhjz canwu xtzf by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xtzf by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xtzf by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xtzf by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu xtzf by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu xtzf by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu xtzf by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu binggong-jianfa by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu xueyin-blade by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu shdcz by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu shdcz by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu shdcz by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu shdcz by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu shdcz by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu shdcz by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu shdcz by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu kongqueling by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu kongqueling by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu kongqueling by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu kongqueling by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu kongqueling by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu kongqueling by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu kongqueling by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu zhjyb by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu zhjyb by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu zhjyb by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu zhjyb by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu zhjyb by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu zhjyb by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu zhjyb by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu qybsg by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu qybsg by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu qybsg by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu qybsg by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu qybsg by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu qybsg by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu qybsg by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hyzf by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hyzf by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hyzf by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hyzf by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu hyzf by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu hyzf by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu hyzf by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu feidao by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu feidao by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu feidao by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu feidao by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu feidao by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu feidao by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu feidao by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu paiyun-zhang by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu rulai-zhang by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu jiutian-sword by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu fanyun-blade by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu pjgj by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu pjgj by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu pjgj by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu pjgj by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu pjgj by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu pjgj by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu pjgj by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu fuyu-sword by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hypzf by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hypzf by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hypzf by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu hypzf by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu hypzf by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu hypzf by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu hypzf by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu snjls by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu snjls by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu snjls by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu snjls by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu snjls by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu snjls by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu snjls by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu yyhuanxubu by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu sszaohuagong by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu dzxinmojing by 10 obj_changshengjianfacanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_xiaoyunlongtengjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_jiuyinxuanbingjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_yuenvleihenjiancanye");
                      for(i=0;i<2;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_huajianzuiyingjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_tianmoxuejiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_baifashenjiancanye");
                      for(i=0;i<4;i++)
                          go("hhjz canwu wanliuguiyi by 10 obj_changshengjianfacanye");

                  }
              },{
                  label: 'fenjieyuzun|分解玉尊',
                  title: '结合帮助文档使用',
                  id:'分解玉尊',
                  eventOnClick() {

                  }
              },{
                  label: 'yuzunchuli|玉尊处理',
                  title: '玉尊打孔、镶嵌紫宝石，结合帮助文档使用',
                  id:'玉尊处理',
                  eventOnClick() {
                      for(i=0;i<5;i++){
                          go("hhjz embc_up go 472565_25608");
                          go("hhjz embc_up go 472565_621864");
                          go("hhjz embc_up go 472565_528737");
                          go("hhjz embc_up go 472565_790492");
                          go("hhjz embc_up go 472565_236345");
                          go("hhjz embc_up go 472565_891619");
                          go("hhjz embc_up go 472565_140390");
                      }//打孔
                      for(i=0;i<10;i++){
                          go("hhjz emb_bs 472565_25608 zishuijing8");
                          go("hhjz emb_bs 472565_621864 zishuijing8");
                          go("hhjz emb_bs 472565_528737 zishuijing8");
                          go("hhjz emb_bs 472565_790492 zishuijing8");
                          go("hhjz emb_bs 472565_236345 zishuijing8");
                          go("hhjz emb_bs 472565_891619 zishuijing8");
                          go("hhjz emb_bs 472565_140390 zishuijing8");
                      }//镶嵌
                  }
              },{
                  label: 'baiyushici|百次玉尊',
                  title: '结合帮助文档使用',
                  id:'合成玉尊',
                  eventOnClick() {
                      go("hhjz hecheng_yz obj_longtingpo4_N_100;");
                  }
              },{
                  label: 'baoshizhenfa|13级宝石阵',
                  title: '13级装备宝石阵法',
                  id:'13级宝石阵',
                  eventOnClick() {
                      go("imbed equip_moke_head12 remove hongbaoshi8;")//红烛龙神武冕
                      go("imbed equip_moke_head12 remove lvbaoshi8;")//绿烛龙神武冕
                      go("imbed equip_moke_head12 remove lanbaoshi8;")//蓝烛龙神武冕
                      go("imbed equip_moke_head12 remove huangbaoshi8;")//黄烛龙神武冕
                      go("imbed equip_moke_head12 remove zishuijing8;")//紫烛龙神武冕
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_head12 wear lanbaoshi8;")//蓝烛龙神武冕
                      for(j=0; j<3; j++)
                          go("imbed equip_moke_head12 wear lvbaoshi8;")//绿烛龙神武冕

                      go("imbed equip_by_neck12 remove hongbaoshi8;")//红九鼎宝链
                      go("imbed equip_by_neck12 remove lvbaoshi8;")//绿九鼎宝链
                      go("imbed equip_by_neck12 remove lanbaoshi8;")//蓝九鼎宝链
                      go("imbed equip_by_neck12 remove huangbaoshi8;")//黄九鼎宝链
                      go("imbed equip_by_neck12 remove zishuijing8;")//紫九鼎宝链
                      for(j=0; j<4; j++)
                          go("imbed equip_by_neck12 wear lanbaoshi8;")//蓝九鼎宝链
                      for(j=0; j<3; j++)
                          go("imbed equip_by_neck12 wear lvbaoshi8;")//绿九鼎宝链

                      go("imbed weapon_moke_dagger12 remove hongbaoshi8;")//红灭魂匕
                      go("imbed weapon_moke_dagger12 remove lvbaoshi8;")//绿灭魂匕
                      go("imbed weapon_moke_dagger12 remove lanbaoshi8;")//蓝灭魂匕
                      go("imbed weapon_moke_dagger12 remove huangbaoshi8;")//黄灭魂匕
                      go("imbed weapon_moke_dagger12 remove zishuijing8;")//紫灭魂匕
                      for(j=0; j<2; j++)
                          go("imbed weapon_moke_dagger12 wear hongbaoshi8;")//红灭魂匕
                      for(j=0; j<5; j++)
                          go("imbed weapon_moke_dagger12 wear zishuijing8;")//紫灭魂匕

                      go("imbed equip_moke_shield12 remove hongbaoshi8;")//红皇天无极盾
                      go("imbed equip_moke_shield12 remove lvbaoshi8;")//绿皇天无极盾
                      go("imbed equip_moke_shield12 remove lanbaoshi8;")//蓝皇天无极盾
                      go("imbed equip_moke_shield12 remove huangbaoshi8;")//黄皇天无极盾
                      go("imbed equip_moke_shield12 remove zishuijing8;")//紫皇天无极盾
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_shield12 wear lvbaoshi8;")//绿皇天无极盾
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_shield12 wear lanbaoshi8;")//蓝皇天无极盾
                      for(j=0; j<5; j++)
                          go("imbed equip_moke_shield12 wear huangbaoshi8;")//黄皇天无极盾

                      go("imbed weapon_sb_stick12 remove hongbaoshi8;")//红倾宇破穹棍
                      go("imbed weapon_sb_stick12 remove lvbaoshi8;")//绿倾宇破穹棍
                      go("imbed weapon_sb_stick12 remove lanbaoshi8;")//蓝倾宇破穹棍
                      go("imbed weapon_sb_stick12 remove huangbaoshi8;")//黄倾宇破穹棍
                      go("imbed weapon_sb_stick12 remove zishuijing8;")//紫倾宇破穹棍
                      for(j=0; j<2; j++)
                          go("imbed weapon_sb_stick12 wear hongbaoshi8;")//红倾宇破穹棍
                      for(j=0; j<5; j++)
                          go("imbed weapon_sb_stick12 wear zishuijing8;")//紫倾宇破穹棍

                      go("imbed equip_barcer10 remove hongbaoshi8;")//红隐龙纹臂
                      go("imbed equip_barcer10 remove lvbaoshi8;")//绿隐龙纹臂
                      go("imbed equip_barcer10 remove lanbaoshi8;")//蓝隐龙纹臂
                      go("imbed equip_barcer10 remove huangbaoshi8;")//黄隐龙纹臂
                      go("imbed equip_barcer10 remove zishuijing8;")//紫隐龙纹臂
                      for(j=0; j<2; j++)
                          go("imbed equip_barcer10 wear hongbaoshi8;")//红隐龙纹臂
                      for(j=0; j<5; j++)
                          go("imbed equip_barcer10 wear zishuijing8;")//紫隐龙纹臂

                      go("imbed equip_moke_wrists12 remove hongbaoshi8;")//红天武护镯
                      go("imbed equip_moke_wrists12 remove lvbaoshi8;")//绿天武护镯
                      go("imbed equip_moke_wrists12 remove lanbaoshi8;")//蓝天武护镯
                      go("imbed equip_moke_wrists12 remove huangbaoshi8;")//黄天武护镯
                      go("imbed equip_moke_wrists12 remove zishuijing8;")//紫天武护镯
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_wrists12 wear hongbaoshi8;")//红天武护镯
                      for(j=0; j<2; j++)
                          go("imbed equip_moke_wrists12 wear lvbaoshi8;")//绿天武护镯
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_wrists12 wear lanbaoshi8;")//蓝天武护镯

                      go("imbed weapon_sb_sword12 remove hongbaoshi8;")//红傲世圣极剑
                      go("imbed weapon_sb_sword12 remove lvbaoshi8;")//绿傲世圣极剑
                      go("imbed weapon_sb_sword12 remove lanbaoshi8;")//蓝傲世圣极剑
                      go("imbed weapon_sb_sword12 remove huangbaoshi8;")//黄傲世圣极剑
                      go("imbed weapon_sb_sword12 remove zishuijing8;")//紫傲世圣极剑
                      for(j=0; j<2; j++)
                          go("imbed weapon_sb_sword12 wear hongbaoshi8;")//红傲世圣极剑
                      for(j=0; j<5; j++)
                          go("imbed weapon_sb_sword12 wear zishuijing8;")//紫傲世圣极剑

                      go("imbed equip_moke_finger12 remove hongbaoshi8;")//红紫贪狼戒
                      go("imbed equip_moke_finger12 remove lvbaoshi8;")//绿紫贪狼戒
                      go("imbed equip_moke_finger12 remove lanbaoshi8;")//蓝紫贪狼戒
                      go("imbed equip_moke_finger12 remove huangbaoshi8;")//黄紫贪狼戒
                      go("imbed equip_moke_finger12 remove zishuijing8;")//紫紫贪狼戒
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_finger12 wear hongbaoshi8;")//红紫贪狼戒
                      for(j=0; j<2; j++)
                          go("imbed equip_moke_finger12 wear lvbaoshi8;")//绿紫贪狼戒
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_finger12 wear lanbaoshi8;")//蓝紫贪狼戒

                      go("imbed equip_moke_armor12 remove hongbaoshi8;")//红皇极圣战铠
                      go("imbed equip_moke_armor12 remove lvbaoshi8;")//绿皇极圣战铠
                      go("imbed equip_moke_armor12 remove lanbaoshi8;")//蓝皇极圣战铠
                      go("imbed equip_moke_armor12 remove huangbaoshi8;")//黄皇极圣战铠
                      go("imbed equip_moke_armor12 remove zishuijing8;")//紫皇极圣战铠
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_armor12 wear lvbaoshi8;")//绿皇极圣战铠
                      for(j=0; j<2; j++)
                          go("imbed equip_moke_armor12 wear lanbaoshi8;")//蓝皇极圣战铠
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_armor12 wear huangbaoshi8;")//黄皇极圣战铠
                      go("imbed equip_moke_surcoat12 remove hongbaoshi8;")//红霸天圣袍
                      go("imbed equip_moke_surcoat12 remove lvbaoshi8;")//绿霸天圣袍
                      go("imbed equip_moke_surcoat12 remove lanbaoshi8;")//蓝霸天圣袍
                      go("imbed equip_moke_surcoat12 remove huangbaoshi8;")//黄霸天圣袍
                      go("imbed equip_moke_surcoat12 remove zishuijing8;")//紫霸天圣袍
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_surcoat12 wear hongbaoshi8;")//红霸天圣袍
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_surcoat12 wear lvbaoshi8;")//绿霸天圣袍
                      for(j=0; j<2; j++)
                          go("imbed equip_moke_surcoat12 wear lanbaoshi8;")//蓝霸天圣袍

                      go("imbed equip_moke_neck12 remove hongbaoshi8;")//红九鼎宝链
                      go("imbed equip_moke_neck12 remove lvbaoshi8;")//绿九鼎宝链
                      go("imbed equip_moke_neck12 remove lanbaoshi8;")//蓝九鼎宝链
                      go("imbed equip_moke_neck12 remove huangbaoshi8;")//黄九鼎宝链
                      go("imbed equip_moke_neck12 remove zishuijing8;")//紫九鼎宝链
                      for(j=0; j<3; j++)
                          go("imbed equip_moke_neck12 wear lvbaoshi8;")//绿九鼎宝链
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_neck12 wear lanbaoshi8;")//蓝九鼎宝链

                      go("imbed equip_moke_boots12 remove hongbaoshi8;")//红山海羲皇靴
                      go("imbed equip_moke_boots12 remove lvbaoshi8;")//绿山海羲皇靴
                      go("imbed equip_moke_boots12 remove lanbaoshi8;")//蓝山海羲皇靴
                      go("imbed equip_moke_boots12 remove huangbaoshi8;")//黄山海羲皇靴
                      go("imbed equip_moke_boots12 remove zishuijing8;")//紫山海羲皇靴
                      for(j=0; j<3; j++)
                          go("imbed equip_moke_boots12 wear lvbaoshi8;")//绿山海羲皇靴
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_boots12 wear lanbaoshi8;")//蓝山海羲皇靴

                      go("imbed equip_moke_waist12 remove hongbaoshi8;")//红魔尊腰带
                      go("imbed equip_moke_waist12 remove lvbaoshi8;")//绿魔尊腰带
                      go("imbed equip_moke_waist12 remove lanbaoshi8;")//蓝魔尊腰带
                      go("imbed equip_moke_waist12 remove huangbaoshi8;")//黄魔尊腰带
                      go("imbed equip_moke_waist12 remove zishuijing8;")//紫魔尊腰带
                      for(j=0; j<4; j++)
                          go("imbed equip_moke_waist12 wear hongbaoshi8;")//红魔尊腰带
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_waist12 wear lvbaoshi8;")//绿魔尊腰带
                      for(j=0; j<2; j++)
                          go("imbed equip_moke_waist12 wear lanbaoshi8;")//蓝魔尊腰带
                      go("imbed equip_moke_cloth12 remove hongbaoshi8;")//红凤麟天华衣
                      go("imbed equip_moke_cloth12 remove lvbaoshi8;")//绿凤麟天华衣
                      go("imbed equip_moke_cloth12 remove lanbaoshi8;")//蓝凤麟天华衣
                      go("imbed equip_moke_cloth12 remove huangbaoshi8;")//黄凤麟天华衣
                      go("imbed equip_moke_cloth12 remove zishuijing8;")//紫凤麟天华衣
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_cloth12 wear lvbaoshi8;")//绿凤麟天华衣
                      for(j=0; j<1; j++)
                          go("imbed equip_moke_cloth12 wear lanbaoshi8;")//蓝凤麟天华衣
                      for(j=0; j<5; j++)
                          go("imbed equip_moke_cloth12 wear huangbaoshi8;")//黄凤麟天华衣

                      go("imbed equip_by_yupei12 remove hongbaoshi8;")//红九龙玉佩
                      go("imbed equip_by_yupei12 remove lvbaoshi8;")//绿九龙玉佩
                      go("imbed equip_by_yupei12 remove lanbaoshi8;")//蓝九龙玉佩
                      go("imbed equip_by_yupei12 remove huangbaoshi8;")//黄九龙玉佩
                      go("imbed equip_by_yupei12 remove zishuijing8;")//紫九龙玉佩
                      for(j=0; j<5; j++)
                          go("imbed equip_by_yupei12 wear hongbaoshi8;")//红九龙玉佩
                      for(j=0; j<1; j++)
                          go("imbed equip_by_yupei12 wear lvbaoshi8;")//绿九龙玉佩
                      for(j=0; j<1; j++)
                          go("imbed equip_by_yupei12 wear lanbaoshi8;")//蓝九龙玉佩


                  }
              },{
                  label: 'quxiaozhunbei|取消准备',
                  title: '学奇侠技能',
                  id:'取消准备',
                  eventOnClick() {
                      go("enable;enable unmap_all;");

                  }
              },{
                  label: 'openqx|奇侠列表',
                  title: '学奇侠技能',
                  id:'open jhqx',
                  eventOnClick() {
                      go("open jhqx");

                  }
              },{
                  label: 'upbox|拓展背包',
                  title: '直接拓展至850，新号准备最少30万元宝',
                  id:'拓展背包',
                  eventOnClick() {
                      upbox();

                  }
              },{
                  label: 'upbox|拓展背包2',
                  title: '可选择拓展的数量',
                  id:'拓展背包',
                  eventOnClick() {
                      upbox2();

                  }
              },{
                  label: 'zidongsend|自动发送',
                  title: '学奇侠技能',
                  id:'自动发送',
                  eventOnClick() {

                      clickButton('go_chat');
                      clickButton('go_chat tell');
                      clickButton('telluser u3915953(3)_U_迷失小鹿');
                      $('#chat_msg').val("暴击播报：『");
                      clickButton('send_chat');


                  }
              },{
                  label: 'xuebangpai|帮派技能学习',
                  title: '一键学习帮派技能，背包得有1800空时卷轴',
                  id:'帮派技能学习',
                  eventOnClick() {
                      for(j=0; j<60; j++)
                          go("clan_skills 0 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 1 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 2 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 3 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 4 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 5 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 6 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 7 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 8 10;");
                      for(j=0; j<60; j++)
                          go("clan_skills 9 10;");


                  }
              },{
                  label: 'teshushijian|自定义事件',
                  title: '手动改代码',
                  id:'自定义事件',
                  eventOnClick() {

                      clickButton('telluser u3915953(3)_U_迷失小鹿');
                      // $('#chat_msg').val("暴击播报：『"+planemapnum+"V"+xhnum1+"』时间： "+bj_h+"："+bj_m);
                      $('#chat_msg').val("暴击播报：");
                      clickButton('send_chat');
                  }
              },

             ]
},{
    subject: "jichuxiulian|十三级装备",
    buttons: [
        {label: 'lv13-1|买斩龙',title: "买斩龙",id:'lv13-1',eventOnClick() {lv13amor1();} },
        {label: 'lv13-2|升12级',title: "升12级",id:'lv13-2',eventOnClick() {lv13amor2();} },
        {label: 'lv13-3|搞冰月',title: "搞冰月",id:'lv13-3',eventOnClick() {lv13amor3();} },
        {label: 'lv13-4|宝石阵法',title: "搞冰月",id:'lv13-4',eventOnClick() {lv13amor4();} },
        {label: 'lv13-5|冰月材料',title: "冰月材料",id:'lv13-4',eventOnClick() {go2("reclaim buy 10 700;reclaim buy 11 1400;items get_store /obj/quest/jueshiyinxiasuipian;items get_store /obj/shop/dog_liquan;");} },
        {label: 'lv13-6|十三级2',title: "袍子、玉佩、衣服、盾牌",id:'lv13-4',eventOnClick() {
            setTimeout(()=>{
                //移除12级装备
                go2("imbed equip_by_surcoat12 remove lvbaoshi8;");
                go2("imbed equip_by_surcoat12 remove lanbaoshi8;");
                go2("imbed equip_by_surcoat12 remove hongbaoshi8;");
                go2("remove equip_by_surcoat12;");
                go2("imbed equip_by_shield12 remove lvbaoshi8;");
                go2("imbed equip_by_shield12 remove lanbaoshi8;");
                go2("imbed equip_by_shield12 remove huangbaoshi8;");
                go2("remove equip_by_shield12;");
                go2("imbed equip_by_yupei12 remove hongbaoshi8;");
                go2("imbed equip_by_yupei12 remove lvbaoshi8;");
                go2("imbed equip_by_yupei12 remove lanbaoshi8;");
                go2("remove equip_by_yupei12;");
                go2("imbed equip_by_cloth12 remove lvbaoshi8;");
                go2("imbed equip_by_cloth12 remove lanbaoshi8;");
                go2("imbed equip_by_cloth12 remove huangbaoshi8;");
                go2("remove equip_by_cloth12;");
                //制作剑神套2
                //1.取出绝世碎片、一级宝石、神兵源质
                //2.到李靖那
                go2("items upgrade_13shoushi2 go 0");
                go2("items upgrade_13shoushi2 go 1");
                go2("items upgrade_13shoushi2 go 2");
                go2("items upgrade_13shoushi2 go 3");
                //镶嵌宝石
                //袍子
                go2("#4 imbed obj_wuyinglou-daoshan wear hongbaoshi8;#2 imbed obj_wuyinglou-daoshan wear lanbaoshi8;imbed obj_wuyinglou-daoshan wear lvbaoshi8;wear obj_wuyinglou-daoshan;");
                //玉佩
                go2("#5 imbed obj_wuyinglou-xianzhuan wear hongbaoshi8;imbed obj_wuyinglou-xianzhuan wear lanbaoshi8;imbed obj_wuyinglou-xianzhuan wear lvbaoshi8;wear obj_wuyinglou-xianzhuan;");
                //衣服
                go2("#5 imbed obj_wuyinglou-guwan wear huangbaoshi8;imbed obj_wuyinglou-guwan wear lanbaoshi8;imbed obj_wuyinglou-guwan wear lvbaoshi8;wear obj_wuyinglou-guwan;");
                //盾牌
                go2("#5 imbed obj_wuyinglou-renshu wear huangbaoshi8;imbed obj_wuyinglou-renshu wear lvbaoshi8;imbed obj_wuyinglou-renshu wear lanbaoshi8;wear obj_wuyinglou-renshu;");

            },500)
        }},
    ]
}
                                  ,{subject: "zhanhang|",buttons: []}
                                 ]

var initializeSpecialEventButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < SpecialEventConfigurations.length; i++) {
        let group = SpecialEventConfigurations[i];

        createSubject(group.subject,'canBeHiddenSpecialEvent');
        createButtons(group.buttons,'canBeHiddenSpecialEvent');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "特殊事件";
        button.title = "可以来回切换";
        button.id = "SpecialEventConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenSpecialEvent").attr("hidden", "true");
                if (ButtonId == "SpecialEventConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenSpecialEvent").removeAttr("hidden");
                if (ButtonId != "SpecialEventConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "SpecialEventConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeSpecialEventButtons();

/**
 * Battle Bar Setup
*/
var cC,Cc;
var BattleConfigurations = [{
    subject: "Battle|迷宫寻人",

    buttons: [
        {
            label: 'tieshi|铁尸',
            title: "梅师姐出点",
            id : "tieshi",

            eventOnClick() {
                go("nw;sw;sw;nw;nw;se;sw");
            }
        },        {
            label: 'meishijie|梅师姐',
            title: "梅师姐",
            id : "meishijie",

            eventOnClick() {
                go("jh 28;sw");
            }
        },        {
            label: 'daozhu|黄岛主',
            title: "黄岛主",
            id : "daozhu",

            eventOnClick() {
                go("jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n");
            }
        },        {
            label: 'tianshi|张天师',
            title: "张天师",
            id : "tianshi",

            eventOnClick() {
                go("jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?无名山峡谷;n");
            }
        },        {
            label: 'tieshao|铁少',
            title: "铁少",
            id : "tieshao",

            eventOnClick() {
                go("jh 31;n;n;n;w;w;w;w;n;n;n");
            }
        },        {
            label: 'huabuwei|花不为',
            title: "花不为",
            id : "huabuwei",

            eventOnClick() {
                go("jh 1;e;n;n;n;n;e;");
            }
        },{
            label: 'tiejiang1|雪婷铁匠',
            title: "雪婷铁匠",
            id : "tiejiang1",

            eventOnClick() {
                go("jh 1;e;n;n;w;");
            }
        },        {
            label: 'tiejiang2|华山村铁匠',
            title: "华山村铁匠",
            id : "tiejiang2",

            eventOnClick() {
                go("jh 3;s;e;n;");
            }
        },{
            label: 'tiejiang3|扬州铁匠',
            title: "扬州铁匠",
            id : "tiejiang3",

            eventOnClick() {
                go("jh 5;n;n;w;");
            }
        }, {
            label: 'lingkong|灵空',
            title: "灵空",
            id : "lingkong",

            eventOnClick() {
                go("jh 26;w;w;w;w;w;w;w;w;w;w");
            }
        },{
            label: 'huixin|柳绘心',
            title: "柳绘心",
            id : "huixin",

            eventOnClick() {
                go("jh 1;e;n;e;e;e;e;n");
            }
        }, {
            label: 'zuijiuhanzi|醉汉',
            title: "醉汉",
            id : "醉酒汉子",

            eventOnClick() {
                go("jh 1;e;n;n");
            }
        }, {
            label: 'baixiao|百晓居士',
            title: "百晓居士",
            id : "baixiao",

            eventOnClick() {
                go("jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e");
            }
        }, {
            label: 'miequanzhen|屠戮全真',
            title: "屠戮全真",
            id : "miequanzhen",
            eventOnClick() {
                go2("jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;kill quanzhen_yin;s;kill quanzhen_cheng;n;n;n;kill quanzhen_qiu;w;w;w;w;n;n;n;n;e;s;kill quanzhen_wantong;");
            }
        }, {
            label: 'zhaosihai|游四海',
            title: "游四海",
            id : "zhaosihai",

            eventOnClick() {
                go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w");
            }
        }

    ]
}]

function clearlog_ft() {
    if (is_fighting) {
        $("span.out").remove()
    }
}
function clearchat(){
    if (!is_fighting) {
        godirect('client_prompt empty_chat;empty_chat;quit_chat;cancel_prompt');
    }
}
var initializeBattleButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < BattleConfigurations.length; i++) {
        let group = BattleConfigurations[i];

        createSubject(group.subject,'canBeHiddenBattle');
        createButtons(group.buttons,'canBeHiddenBattle');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "迷宫寻人";
        button.title = "可以来回切换";
        button.id = "BattleConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenBattle").attr("hidden", "true");
                if (ButtonId == "BattleConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenBattle").removeAttr("hidden");
                if (ButtonId != "BattleConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "BattleConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeBattleButtons();

/**
 * Dragon Bar Setup
*/
var DragonConfigurations = [{
    subject: "zhuxian1|主线任务",

    buttons: [
        {label: 'jhgo1|开新号',title: "雪亭镇",id : "雪亭镇",eventOnClick() {startlj();}},
        {label: 'jhgo1|雪亭镇',title: "雪亭镇",id : "雪亭镇",eventOnClick() {xt_job();}},
        {label: 'jhgo2|洛阳',title: "洛阳",id : "洛阳",eventOnClick() {ly_job();}},
        {label: 'jhgo3|华山村',title: "华山村",id : "华山村",eventOnClick() {hsc_job();}},
        {label: 'jhgo4|华山',title: "华山",id : "华山",eventOnClick() {hs_job();}},
        {label: 'jhgo5|扬州',title: "扬州",id : "扬州",eventOnClick() {yz_job();}},
        {label: 'jhgo6|丐帮',title: "丐帮",id : "丐帮",eventOnClick() {gb_job();}},
        {label: 'jhgo7|乔阴县',title: "乔阴县",id : "乔阴县",eventOnClick() {qyx_job();}},
        {label: 'jhgo8|峨眉山',title: "峨眉山",id : "峨眉山",eventOnClick() {ems_job();}},
        {label: 'jhgo9|恒山',title: "恒山",id : "恒山",eventOnClick() {hengs_job();}},
        {label: 'jhgo10|武当山',title: "武当山",id : "武当山",eventOnClick() {wds_job();}},
        {label: 'jhgo11|晚月庄',title: "晚月庄",id : "晚月庄",eventOnClick() {wyz_job();}},
        {label: 'jhgo12|水烟阁',title: "水烟阁",id : "水烟阁",eventOnClick() {syg_job();}},
        {label: 'jhgo13|少林寺',title: "少林寺",id : "少林寺",eventOnClick() {sl_job();}},
        {label: 'jhgo14|唐门',title: "唐门",id : "唐门",eventOnClick() {tm_job();}},
        {label: 'jhgo15|青城山',title: "青城山",id : "青城山",eventOnClick() {qcs_job();}},
        {label: 'jhgo16|逍遥林',title: "逍遥林",id : "逍遥林",eventOnClick() {xyl_job();}},
        {label: 'jhgo17|开封',title: "开封",id : "开封",eventOnClick() {kf_job();}},
        {label: 'jhgo18|明教',title: "明教",id : "明教",eventOnClick() {mj_job();}},
        {label: 'jhgo19|全真教',title: "全真教",id : "全真教",eventOnClick() {qzj_job();}},
        {label: 'jhgo20|古墓',title: "古墓",id : "古墓",eventOnClick() {gm_job();}},
        {label: 'jhgo21|白驮山',title: "白驮山",id : "白驮山",eventOnClick() {bts_job();}},
        {label: 'jhgo22|嵩山',title: "嵩山",id : "嵩山",eventOnClick() {ss_job();}},
        {label: 'jhgo23|寒梅庄',title: "寒梅庄",id : "寒梅庄",eventOnClick() {hmz_job();}},
        {label: 'jhgo24|泰山',title: "泰山",id : "泰山",eventOnClick() {ts_job();}},
        {label: 'jhgo25|大旗门',title: "大旗门",id : "大旗门",eventOnClick() {dqm_job();}},
        {label: 'jhgo26|大昭寺',title: "大昭寺",id : "大昭寺",eventOnClick() {dzs_job();}},
        {label: 'jhgo27|魔教',title: "魔教",id : "魔教",eventOnClick() {mojiao_job();}},
        {label: 'jhgo212|杀堂主长老',title: "魔教",id : "魔教",eventOnClick() {go2("ask heimuya_jianqiankai;w;n;ne;kill heimuya_wangcheng;sw;nw;kill heimuya_tongbaixiong;se;w;nw;kill heimuya_getingxiang;se;n;kill heimuya_shangguanyun;s;ne;kill heimuya_sangsanniang;ne;se;kill heimuya_luolie;nw;sw;kill heimuya_jiabu;ne;w;kill heimuya_baodachu;e;e;n;n;n;n;n;e;kill heimuya_dugufeng;e;kill heimuya_yangyanqing;e;kill heimuya_fansong;e;kill heimuya_juling;e;kill heimuya_chutong;e;kill zonshi_nangongyu;e;kill zonshi_yangliexu;w;w;w;w;w;w;w;w;kill heimuya_huaxiangrong;w;kill heimuya_quyang;w;kill heimuya_zhangchengfeng;w;kill heimuya_zhangchengyun;w;kill heimuya_zhaohe;e;e;e;e;e;n;ask heimuya_yanglianting;ask heimuya_yanglianting;ask heimuya_yanglianting;");}},
        {label: 'jhgo213|杀教主',title: "魔教",id : "魔教",eventOnClick() {go2("n;event_1_57107759;e;e;n;w;kill heimuya_dfbb;");}},
        {label: 'jhgo28|星宿海',title: "星宿海",id : "星宿海",eventOnClick() {xxh_job();}},
        {label: 'jhgo29|茅山',title: "茅山",id : "茅山",eventOnClick() {ms_job();}},
        {label: 'jhgo30|桃花岛',title: "桃花岛",id : "桃花岛",eventOnClick() {thd_job();}},
        {label: 'jhgo31|铁雪山庄',title: "铁雪山庄",id : "铁雪山庄",eventOnClick() {txsz_job();}},
        {label: 'jhgo32|慕容山庄',title: "慕容山庄",id : "慕容山庄",eventOnClick() {mrsz_job();}},
        {label: 'jhgo33|大理',title: "大理",id : "大理",eventOnClick() {dl_job();}},
        {label: 'jhgo34|断剑山庄',title: "断剑山庄",id : "断剑山庄",eventOnClick() {djsz_job();}},
        {label: 'jhgo35|冰火岛',title: "冰火岛",id : "冰火岛",eventOnClick() {bhd_job();}},
        {label: 'jhgo361|侠客岛',title: "侠客岛",id : "侠客岛",eventOnClick() {xkd_job();}},
        {label: 'jhgo362|找张三',title: "侠客岛",id : "侠客岛",eventOnClick() {go2("s;w;w;sw;w;n;n;w;w;w;s;w;nw;give xiakedao_zhangsan;");}},
        {label: 'jhgo37|绝情谷',title: "绝情谷",id : "绝情谷",eventOnClick() {jueqingg_job();}},
        {label: 'jhgo38|碧海山庄',title: "碧海山庄",id : "碧海山庄",eventOnClick() {bihaisz_job();}},
        {label: 'jhgo39|天山',title: "天山",id : "天山",eventOnClick() {tianshan_job();}},
        {label: 'jhgo40|苗疆',title: "苗疆",id : "苗疆",eventOnClick() {miaojiang_job();}},
        {label: 'jhgo41|白帝城',title: "白帝城",id : "白帝城",eventOnClick() {baidicheng();}},
        {label: 'jhgo42|墨家机关城',title: "墨家机关城",id : "墨家机关城",eventOnClick() {jiguancheng()}},
        {label: 'jhgo43|掩月城',title: "掩月城",id : "掩月城",eventOnClick() {yanyuecheng();}},
        {label: 'jhgo44|海云阁',title: "海云阁",id : "海云阁",eventOnClick() {haiyunge();}},
        {label: 'jhgo45|幽冥山庄',title: "幽冥山庄",id : "幽冥山庄",eventOnClick() {youmingshanzhuang();}},
        {label: 'jhgo46|花街',title: "花街",id : "花街",eventOnClick() {huajie();}},
        {label: 'jhgo47|西凉城',title: "西凉城",id : "西凉城",eventOnClick() {xiliang();}},
        {label: 'jhgo48|高昌迷宫',title: "高昌迷宫",id : "高昌迷宫",eventOnClick() {gaochang();}},
        {label: 'jhgo49|京城',title: "京城",id : "京城",eventOnClick() {jingcheng();}},
        {label: 'jhgo50|越王剑宫',title: "越王剑宫",id : "越王剑宫",eventOnClick() {jiangong();}},
        {label: 'jhgo51|江陵',title: "江陵",id : "江陵",eventOnClick() {jiangling();}},
        {label: 'jhgo52|天龙寺',title: "天龙寺",id : "天龙寺",eventOnClick() {tianlong();}},
        {label: 'jhgo53|西夏',title: "西夏",id : "西夏",eventOnClick() {xixia();}},
        {label: 'jhgo54|南诏国',title: "南诏国",id : "南诏国",eventOnClick() {nanzhao();}},

    ]
},{
    subject: "zhixian1|支线任务",

    buttons: [
        {label: 'ZX1|南诏支线1',title: "开始支线一直到对话完嵇康等一小时",id : "南诏国",eventOnClick() {nanzhaozhixian1()}},
        {label: 'ZX2|南诏支线2',title: "对话完嵇康一小时后对话大将军完成支线并领奖",id : "南诏国",eventOnClick() {nanzhaozhixian2()}},
    ]
},
                           ]

var initializeDragonButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < DragonConfigurations.length; i++) {
        let group = DragonConfigurations[i];

        createSubject(group.subject,'canBehiddenDragon');
        createButtons(group.buttons,'canBehiddenDragon');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "主线支线";
        button.title = "自动主线任务支线任务";
        button.id = "DragonConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBehiddenDragon").attr("hidden", "true");
                if (ButtonId == "DragonConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBehiddenDragon").removeAttr("hidden");
                if (ButtonId != "DragonConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "DragonConfig";
            }
        });

        document.body.appendChild(button);
    }

}
initializeDragonButtons();
//==========================================================
//======================自定义首页按钮======================
//==========================================================
/**
 * 门派拜师
*/
var JiangHuZhiXianConfigurations = [
    {
        subject: "baishiQZ|拜师前置",
        buttons: [
            {label: 'ZDbaishi0-0|学习技能',title: "偷学还是光明正大的学这是一个问题",id:'gota18',eventOnClick() {learnSkill()}},
            {label: 'Zdbaishi0-1|易容前置',title: "距离变身美女只差一步",id:'',eventOnClick() {yirong()}},
            {label: 'Zdbaishi0-2|学易容术',title: "江湖第一步，先学易容术",id:'',eventOnClick() {studyYiRong()}},
            {label: 'Zdbaishi0-3|易容男',title: "摇身一变，看我眼睛迷离不？",id:'',eventOnClick() {YRboy()}},
            {label: 'Zdbaishi0-4|易容女',title: "化身美女，天下哪里去不得",id:'',eventOnClick() {YRgirl()}},
            {label: 'Zdbaishi0-5|捏脸500',title: "这是什么手，捏两下我就成仙了？",id:'',eventOnClick() {nielian()}},
            {label: 'Zdbaishi0-6|佛家录',title: "不给杀了等会再来",id:'',eventOnClick() {fojialu()}},
            {label: 'Zdbaishi0-7|洛阳支线',title: "不给杀了等会再来",id:'',eventOnClick() {

                go2("jh 2;#3 n;w;ask luoyang_luoyang15;ask luoyang_luoyang15;e;n;w;s;kill luoyang_hongniang;");
                mst_go();
                setTimeout(()=>{go2("n;e;s;w;give luoyang_luoyang15;putuan;ask luoyang_luoyang25;fight luoyang_luoyang25;ask luoyang_luoyang25;n;e;n;n;e;n;op1");},100000);
                setTimeout(clearInterval(mst_interval),1000000);
            }
            },
        ],//
    },
    {
        subject: "zhengpaiBS|正派拜师",
        buttons: [
            {label: 'Zdbaishi1-1|正-碧落城',title: "我貌似踏遍了杭界山的每一寸土地",id:'',eventOnClick() {biluocheng()}},
            {label: 'Zdbaishi1-2|正-少林派',title: "秃驴貌似只收男娃，那还等什么，割以永治！",id:'',eventOnClick() {shaolin()}},
            {label: 'Zdbaishi1-3|正-华山派',title: "最好先别去，别问我怎么知道的！",id:'',eventOnClick() {huashan()}},
            {label: 'Zdbaishi1-4|正-大理段家',title: "六脉神剑不是让你随便乱射的",id:'',eventOnClick() {dali()}},
            {label: 'Zdbaishi1-5|正-武当派',title: "张老道有话想说",id:'',eventOnClick() {wudang()}},
            {label: 'Zdbaishi1-6|正-铁血大旗门',title: "师傅五湖四海都有，这么爱跑吗？",id:'',eventOnClick() {daqimen()}},
            {label: 'Zdbaishi1-7|正-明教',title: "开局直接拜就完了",id:'',eventOnClick() {mingjiao()}},
            {label: 'Zdbaishi1-8|正-全真派',title: "道士貌似也是只要男娃，教练我不服，凭啥武当收女娃！",id:'',eventOnClick() {quanzhen()}},
            {label: 'Zdbaishi1-9|正-丐帮',title: "先搞洛阳支线，老叫花子真是事多",id:'',eventOnClick() {GaiBang()}},
            {label: 'Zdbaishi1-10|正-峨嵋派',title: "只收女娃，你懂得！割吧",id:'',eventOnClick() {emei()}},
            {label: 'Zdbaishi1-11|正-步玄派',title: "550读书，去断剑之前先搞这个",id:'',eventOnClick() {buxuan()}},
        ],//
    },
    {
        subject: "xiepaipaiBS|邪派拜师",
        buttons: [
            {label: 'Zdbaishi2-1|邪-镜星府',title: "我貌似踏遍了杭界山的每一寸土地",id:'',eventOnClick() {jingxingfu()}},
            {label: 'Zdbaishi2-2|邪-九阴派',title: "入门第一步，先杀两千条蛇！\n 两千入门，一万毕业 \n 江湖邪教人人得而诛之！！！！",id:'',eventOnClick() {jiuyin()}},
            {label: 'Zdbaishi2-3|邪-白驼山派',title: "普普通通！随便搞就行",id:'',eventOnClick() {baituo()}},
            {label: 'Zdbaishi2-4|邪-唐门',title: "五百轻功貌似得拜这个，男女分开",id:'',eventOnClick() {tangmen()}},
            {label: 'Zdbaishi2-5|邪-日月神教',title: "少年你割了吗？",id:'',eventOnClick() {mojiao()}},
            {label: 'Zdbaishi2-6|邪-青城派',title: "少年你要学变脸吗？",id:'',eventOnClick() {qingcheng()}},
            {label: 'Zdbaishi2-7|邪-星宿派',title: "丁老怪等你来试药！",id:'',eventOnClick() {xingxiu()}},
            {label: 'Zdbaishi2-8|邪-天邪派',title: "什么狗屁门派，拜个师还得发誓，啊呸！！！\n 先把杀气搞起来，要不然连门都不让你进！\六阴剑得练习放到最后再拜！",id:'',eventOnClick() {tianxie()}},
            {label: 'Zdbaishi2-9|邪-大招寺',title: "西边的和尚抗揍是有原因的",id:'',eventOnClick() {dazhaosi()}},
            {label: 'Zdbaishi2-10|邪-晚月庄',title: "一庄子美女，就问你想不想嘿嘿嘿~",id:'',eventOnClick() {wanyuezhuang()}},
            {label: 'Zdbaishi2-11|邪-花紫会',title: "我有钱居然不让我拜师？狗花子屁事真多！\n 把钱都花了，剩不到100就行",id:'',eventOnClick() {huazihui()}},
        ],
    },
    {
        subject: "zhongliBS|中立拜师",
        buttons: [
            {label: 'Zdbaishi3-1|中-荣威镖局',title: "我貌似踏遍了杭界山的每一寸土地",id:'',eventOnClick() {rongweibiaojv()}},
            {label: 'Zdbaishi3-2|中-逍遥派',title: "满突八荒，横推大理",id:'',eventOnClick() {xiaoyao()}},
            {label: 'Zdbaishi3-3|中-慕容世家',title: "狗贼纳命来！",id:'',eventOnClick() {murong()}},
            {label: 'Zdbaishi3-4|中-古墓派',title: "没拜师的时候先去捡钥匙，别问怎么知道的",id:'',eventOnClick() {gumu()}},
            {label: 'Zdbaishi3-5|中-桃花岛',title: "貌似没啥东西",id:'',eventOnClick() {taohua()}},
            {label: 'Zdbaishi3-6|中-茅山派',title: "来人！关门、放狗！",id:'',eventOnClick() {maoshan()}},
            {label: 'Zdbaishi3-7|中-铁雪男',title: "男女各行其道，阴阳和合而生\n 新号丐帮、明教完了先搞这个，满突棋道助你直推南召",id:'',eventOnClick() {tiexueshanzhaungB()}},
            {label: 'Zdbaishi3-8|中-铁雪女',title: "男女各行其道，阴阳和合而生\n 新号丐帮、明教完了先搞这个，满突棋道助你直推南召",id:'',eventOnClick() {tiexueshanzhaungG()}},
            {label: 'Zdbaishi3-9|中-封山剑派',title: "滥竽充数的玩意",id:'',eventOnClick() {fengshanjianpai()}},
            {label: 'Zdbaishi3-10|中-断剑山庄',title: "600基础必学",id:'',eventOnClick() {duanjianshanzhuang()}},
        ],
    },
    {
        subject: "newjubBS|新门派",
        buttons: [
            {label: 'ZDbaishi4-0|杭界山',title: "镜星府：那罗、洪昭天、白一珠、裴若海、上官晓芙 \n 碧落城：铁术、萧正、呼延铮、厉乘风，花落云 \n 荣威镖局：马万啸、高芝城、王世仲、辰川、墟归一 \n",id:'gota18',eventOnClick() {goHJS()}},
            {label: 'Zdbaishi4-1|新-风花牧场',title: "",id:'',eventOnClick() {fenghuamuchang()}},
            {label: 'Zdbaishi4-2|新-西夏堂',title: "准备好100武穆、一个蛋壳、还有啥好像忘了",id:'',eventOnClick() {xixiatang()}},
            {label: 'Zdbaishi4-3|新-燕云世家',title: "学满600斧再来",id:'',eventOnClick() {yanyunshijia()}},
            {label: 'Zdbaishi4-4|新-天波杨门',title: "学满600枪再来",id:'',eventOnClick() {tianboyangmen()}},
        ],
    },
]

var initializeJiangHuZhiXianButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < JiangHuZhiXianConfigurations.length; i++) {
        let group = JiangHuZhiXianConfigurations[i];

        createSubject(group.subject,'canBeHiddenJiangHuZhiXian');
        createButtons(group.buttons,'canBeHiddenJiangHuZhiXian');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "自动拜师";
        button.title = "自动拜师、学习技能、自动出师\n 先入丐帮,再上武当，一统江湖，唯吾得昌！ \n 丐帮-明教-铁雪其他顺序随意";
        button.id = "JiangHuZhiXianConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenJiangHuZhiXian").attr("hidden", "true");
                if (ButtonId == "JiangHuZhiXianConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenJiangHuZhiXian").removeAttr("hidden");
                if (ButtonId != "JiangHuZhiXianConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "JiangHuZhiXianConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeJiangHuZhiXianButtons();
/*

神兵冰月
*/
//二级子菜单
var shenbingbingyueConfigurations = [
    {
        subject: "zhuangbeiqianzhi|前置内容",
        buttons: [
            {label: 'buyZL|一套斩龙',title: "买一套斩龙防具加剑棍,准备96万消费积分",
             eventOnClick() {
                 //赶路花不为
                 go2("jh 1;e;#4 n;e;");
                 //买装备
                 go2("shop xf_buy xf_shop43;shop xf_buy xf_shop44;shop xf_buy xf_shop45;shop xf_buy xf_shop46;shop xf_buy xf_shop47;shop xf_buy xf_shop48;shop xf_buy xf_shop49;shop xf_buy xf_shop50;shop xf_buy xf_shop51;shop xf_buy xf_shop52;shop xf_buy xf_shop54;shop xf_buy xf_shop58;shop xf_buy xf_shop60;shop xf_buy xf_shop60;");
                 //摹刻装备
                 go2("moke weapon_dagger10;moke weapon_stick10;moke weapon_sword10;moke equip_wrists10;moke equip_waist10;moke equip_surcoat10;moke equip_shield10;moke equip_neck10;moke equip_head10;moke equip_finger10;moke equip_cloth10;moke equip_boots10;moke equip_armor10;");
             }},
            {label: 'buyzhuangbei1|一套胤天',title: "换一套胤天装备+剑棍",
             eventOnClick() {
                 //买刻刀
                 go2("jh 1;e;n;n;w;#200 event_1_58404606;");
                 //找四海
                 go2("jh 2;#16 n;#4 w;n;w;");
                 //取天神
                 go2("items get_store /obj/quest/xuantie_suipian;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/baoshi/lanbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/zishuijing8;");
                 //回收天神各一万
                 go2("reclaim recl 10000 zishuijing8;reclaim recl 10000 lvbaoshi8;reclaim recl 10000 lanbaoshi8;reclaim recl 10000 huangbaoshi8;reclaim recl 10000 hongbaoshi8;");
                 //买12、13碎片
                 go2("reclaim buy 0 4000;reclaim buy 1 5000;");
                 //兑换11装备
                 go2("jh 3;s;e;n;duihuan_mieshen_go gift1;duihuan_mieshen_go gift2;duihuan_mieshen_go gift3;duihuan_mieshen_go gift4;duihuan_mieshen_go gift5;duihuan_mieshen_go gift6;duihuan_mieshen_go gift7;duihuan_mieshen_go gift8;duihuan_mieshen_go gift9;duihuan_mieshen_go gift10;duihuan_mieshen_go gift11;duihuan_mieshen_go gift12;duihuan_mieshen_go gift13;duihuan_mieshen_go gift14;duihuan_mieshen_go gift15;duihuan_mieshen_go gift16;duihuan_mieshen_go gift17;duihuan_mieshen_go gift18;duihuan_mieshen_go gift19;duihuan_mieshen_go gift20;duihuan_mieshen_go gift21;duihuan_mieshen_go gift22;");
                 //摹刻11装备
                 go2("moke weapon_stick11;moke weapon_sword11;moke equip_shield11;moke equip_waist11;moke equip_surcoat11;moke weapon_dagger11;moke equip_armor11;moke equip_cloth11;moke equip_boots11;moke equip_finger11;moke equip_wrists11;moke equip_neck11;moke equip_head11;");
             }},
            {label: 'buyzhuangbei2|一套12级',title: "换一套12级装备+剑棍",
             eventOnClick() {
                 //取狗券
                 go2("items get_store /obj/shop/dog_liquan;");
                 //兑换12装备
                 go2("items get_store /obj/shop/dog_liquan;duihuan_eq12_go gift1;duihuan_eq12_go gift2;duihuan_eq12_go gift3;duihuan_eq12_go gift4;duihuan_eq12_go gift5;duihuan_eq12_go gift6;duihuan_eq12_go gift7;duihuan_eq12_go gift8;duihuan_eq12_go gift9;duihuan_eq12_go gift10;duihuan_eq12_go gift11;duihuan_eq12_go gift12;duihuan_eq12_go gift13;duihuan_eq12_go gift14;duihuan_eq12_go gift15;duihuan_eq12_go gift16;duihuan_eq12_go gift17;duihuan_eq12_go gift18;duihuan_eq12_go gift19;duihuan_eq12_go gift20;duihuan_eq12_go gift21;duihuan_eq12_go gift22;");
                 //摹刻12装备
                 go2("moke weapon_stick12;moke weapon_sword12;moke equip_shield12;moke equip_waist12;moke equip_surcoat12;moke weapon_dagger12;moke equip_armor12;moke equip_cloth12;moke equip_boots12;moke equip_finger12;moke equip_wrists12;moke equip_neck12;moke equip_head12;");
             }},
            {label: 'shangbaoshi|宝石阵法',title: "12防具加剑棍匕首阵法",
             eventOnClick() {
                 go2("imbed equip_moke_head12 remove hongbaoshi8;")//红烛龙神武冕
                 go2("imbed equip_moke_head12 remove lvbaoshi8;")//绿烛龙神武冕
                 go2("imbed equip_moke_head12 remove lanbaoshi8;")//蓝烛龙神武冕
                 go2("imbed equip_moke_head12 remove huangbaoshi8;")//黄烛龙神武冕
                 go2("imbed equip_moke_head12 remove zishuijing8;")//紫烛龙神武冕
                 go2("#4 imbed equip_moke_head12 wear lanbaoshi8;")//蓝烛龙神武冕
                 go2("#3 imbed equip_moke_head12 wear lvbaoshi8;")//绿烛龙神武冕

                 go2("imbed equip_by_neck12 remove hongbaoshi8;")//红九鼎宝链
                 go2("imbed equip_by_neck12 remove lvbaoshi8;")//绿九鼎宝链
                 go2("imbed equip_by_neck12 remove lanbaoshi8;")//蓝九鼎宝链
                 go2("imbed equip_by_neck12 remove huangbaoshi8;")//黄九鼎宝链
                 go2("imbed equip_by_neck12 remove zishuijing8;")//紫九鼎宝链
                 go2("#4 imbed equip_by_neck12 wear lanbaoshi8")//蓝九鼎宝链
                 go2("#3 imbed equip_by_neck12 wear lvbaoshi8")//绿九鼎宝链

                 go2("imbed weapon_moke_dagger12 remove hongbaoshi8;")//红灭魂匕
                 go2("imbed weapon_moke_dagger12 remove lvbaoshi8;")//绿灭魂匕
                 go2("imbed weapon_moke_dagger12 remove lanbaoshi8;")//蓝灭魂匕
                 go2("imbed weapon_moke_dagger12 remove huangbaoshi8;")//黄灭魂匕
                 go2("imbed weapon_moke_dagger12 remove zishuijing8;")//紫灭魂匕

                 go2("#2 imbed weapon_moke_dagger12 wear hongbaoshi8;")//红灭魂匕
                 go2("#5 imbed weapon_moke_dagger12 wear zishuijing8;")//紫灭魂匕

                 go2("imbed equip_moke_shield12 remove hongbaoshi8;")//红皇天无极盾
                 go2("imbed equip_moke_shield12 remove lvbaoshi8;")//绿皇天无极盾
                 go2("imbed equip_moke_shield12 remove lanbaoshi8;")//蓝皇天无极盾
                 go2("imbed equip_moke_shield12 remove huangbaoshi8;")//黄皇天无极盾
                 go2("imbed equip_moke_shield12 remove zishuijing8;")//紫皇天无极盾
                 go2("imbed equip_moke_shield12 wear lvbaoshi8;")//绿皇天无极盾
                 go2("imbed equip_moke_shield12 wear lanbaoshi8;")//蓝皇天无极盾
                 go2("#5 imbed equip_moke_shield12 wear huangbaoshi8;")//黄皇天无极盾

                 go2("imbed weapon_sb_stick12 remove hongbaoshi8;")//红倾宇破穹棍
                 go2("imbed weapon_sb_stick12 remove lvbaoshi8;")//绿倾宇破穹棍
                 go2("imbed weapon_sb_stick12 remove lanbaoshi8;")//蓝倾宇破穹棍
                 go2("imbed weapon_sb_stick12 remove huangbaoshi8;")//黄倾宇破穹棍
                 go2("imbed weapon_sb_stick12 remove zishuijing8;")//紫倾宇破穹棍
                 go2("#2 imbed weapon_sb_stick12 wear hongbaoshi8;")//红倾宇破穹棍
                 go2("#5 imbed weapon_sb_stick12 wear zishuijing8;")//紫倾宇破穹棍

                 go2("imbed equip_barcer10 remove hongbaoshi8;")//红隐龙纹臂
                 go2("imbed equip_barcer10 remove lvbaoshi8;")//绿隐龙纹臂
                 go2("imbed equip_barcer10 remove lanbaoshi8;")//蓝隐龙纹臂
                 go2("imbed equip_barcer10 remove huangbaoshi8;")//黄隐龙纹臂
                 go2("imbed equip_barcer10 remove zishuijing8;")//紫隐龙纹臂
                 go2("#2 imbed equip_barcer10 wear hongbaoshi8;")//红隐龙纹臂
                 go2("#5 imbed equip_barcer10 wear zishuijing8;")//紫隐龙纹臂

                 go2("imbed equip_moke_wrists12 remove hongbaoshi8;")//红天武护镯
                 go2("imbed equip_moke_wrists12 remove lvbaoshi8;")//绿天武护镯
                 go2("imbed equip_moke_wrists12 remove lanbaoshi8;")//蓝天武护镯
                 go2("imbed equip_moke_wrists12 remove huangbaoshi8;")//黄天武护镯
                 go2("imbed equip_moke_wrists12 remove zishuijing8;")//紫天武护镯
                 go2("#4 imbed equip_by_wrists12 wear hongbaoshi8;")//红天武护镯
                 go2("imbed equip_by_wrists12 wear lvbaoshi8;")//绿天武护镯
                 go2("#2 imbed equip_by_wrists12 wear lanbaoshi8;")//蓝天武护镯

                 go2("imbed weapon_sb_sword12 remove hongbaoshi8;")//红傲世圣极剑
                 go2("imbed weapon_sb_sword12 remove lvbaoshi8;")//绿傲世圣极剑
                 go2("imbed weapon_sb_sword12 remove lanbaoshi8;")//蓝傲世圣极剑
                 go2("imbed weapon_sb_sword12 remove huangbaoshi8;")//黄傲世圣极剑
                 go2("imbed weapon_sb_sword12 remove zishuijing8;")//紫傲世圣极剑
                 go2("#2 imbed weapon_sb_sword12 wear hongbaoshi8;")//红傲世圣极剑
                 go2("#5 imbed weapon_sb_sword12 wear zishuijing8;")//紫傲世圣极剑

                 go2("imbed equip_moke_finger12 remove hongbaoshi8;")//红紫贪狼戒
                 go2("imbed equip_moke_finger12 remove lvbaoshi8;")//绿紫贪狼戒
                 go2("imbed equip_moke_finger12 remove lanbaoshi8;")//蓝紫贪狼戒
                 go2("imbed equip_moke_finger12 remove huangbaoshi8;")//黄紫贪狼戒
                 go2("imbed equip_moke_finger12 remove zishuijing8;")//紫紫贪狼戒
                 go2("#4 imbed equip_moke_finger12 wear hongbaoshi8;")//红紫贪狼戒
                 go2("#2 imbed equip_moke_finger12 wear lvbaoshi8;")//绿紫贪狼戒
                 go2("imbed equip_moke_finger12 wear lanbaoshi8;")//蓝紫贪狼戒

                 go2("imbed equip_moke_armor12 remove hongbaoshi8;")//红皇极圣战铠
                 go2("imbed equip_moke_armor12 remove lvbaoshi8;")//绿皇极圣战铠
                 go2("imbed equip_moke_armor12 remove lanbaoshi8;")//蓝皇极圣战铠
                 go2("imbed equip_moke_armor12 remove huangbaoshi8;")//黄皇极圣战铠
                 go2("imbed equip_moke_armor12 remove zishuijing8;")//紫皇极圣战铠
                 go2("imbed equip_moke_armor12 wear lvbaoshi8;")//绿皇极圣战铠
                 go2("#2 imbed equip_moke_armor12 wear lanbaoshi8;")//蓝皇极圣战铠
                 go2("#4 imbed equip_moke_armor12 wear huangbaoshi8;")//黄皇极圣战铠

                 go2("imbed imbed equip_by_neck12 remove hongbaoshi8;")//红霸天圣袍
                 go2("imbed imbed equip_by_neck12 remove lvbaoshi8;")//绿霸天圣袍
                 go2("imbed imbed equip_by_neck12 remove lanbaoshi8;")//蓝霸天圣袍
                 go2("imbed imbed equip_by_neck12 remove huangbaoshi8;")//黄霸天圣袍
                 go2("imbed imbed equip_by_neck12 remove zishuijing8;")//紫霸天圣袍
                 go2("#4 imbed equip_by_surcoat12 wear hongbaoshi8;")//红霸天圣袍
                 go2("imbed equip_by_surcoat12 wear lvbaoshi8;")//绿霸天圣袍
                 go2("#2 imbed equip_by_surcoat12 wear lanbaoshi8;")//蓝霸天圣袍

                 go2("imbed equip_moke_neck12 remove hongbaoshi8;")//红九鼎宝链
                 go2("imbed equip_moke_neck12 remove lvbaoshi8;")//绿九鼎宝链
                 go2("imbed equip_moke_neck12 remove lanbaoshi8;")//蓝九鼎宝链
                 go2("imbed equip_moke_neck12 remove huangbaoshi8;")//黄九鼎宝链
                 go2("imbed equip_moke_neck12 remove zishuijing8;")//紫九鼎宝链
                 go2("#3 imbed equip_moke_neck12 wear lvbaoshi8;")//绿九鼎宝链
                 go2("#imbed equip_moke_neck12 wear lanbaoshi8;")//蓝九鼎宝链

                 go2("imbed equip_moke_boots12 remove hongbaoshi8;")//红山海羲皇靴
                 go2("imbed equip_moke_boots12 remove lvbaoshi8;")//绿山海羲皇靴
                 go2("imbed equip_moke_boots12 remove lanbaoshi8;")//蓝山海羲皇靴
                 go2("imbed equip_moke_boots12 remove huangbaoshi8;")//黄山海羲皇靴
                 go2("imbed equip_moke_boots12 remove zishuijing8;")//紫山海羲皇靴
                 go2("#3 imbed equip_moke_boots12 wear lvbaoshi8;")//绿山海羲皇靴
                 go2("#4 imbed equip_moke_boots12 wear lanbaoshi8;")//蓝山海羲皇靴

                 go2("imbed equip_moke_waist12 remove hongbaoshi8;")//红魔尊腰带
                 go2("imbed equip_moke_waist12 remove lvbaoshi8;")//绿魔尊腰带
                 go2("imbed equip_moke_waist12 remove lanbaoshi8;")//蓝魔尊腰带
                 go2("imbed equip_moke_waist12 remove huangbaoshi8;")//黄魔尊腰带
                 go2("imbed equip_moke_waist12 remove zishuijing8;")//紫魔尊腰带
                 go2("#4 imbed equip_by_waist12 wear hongbaoshi8;")//红魔尊腰带
                 go2("imbed equip_by_waist12 wear lvbaoshi8;")//绿魔尊腰带
                 go2("#2 imbed equip_by_waist12 wear lanbaoshi8;")//蓝魔尊腰带

                 go2("imbed equip_moke_cloth12 remove hongbaoshi8;")//红凤麟天华衣
                 go2("imbed equip_moke_cloth12 remove lvbaoshi8;")//绿凤麟天华衣
                 go2("imbed equip_moke_cloth12 remove lanbaoshi8;")//蓝凤麟天华衣
                 go2("imbed equip_moke_cloth12 remove huangbaoshi8;")//黄凤麟天华衣
                 go2("imbed equip_moke_cloth12 remove zishuijing8;")//紫凤麟天华衣
                 go2("imbed equip_moke_cloth12 wear lvbaoshi8;")//绿凤麟天华衣
                 go2("imbed equip_moke_cloth12 wear lanbaoshi8;")//蓝凤麟天华衣
                 go2("#5 imbed equip_moke_cloth12 wear huangbaoshi8;")//黄凤麟天华衣

                 go2("imbed equip_by_yupei12 remove hongbaoshi8;")//红九龙玉佩
                 go2("imbed equip_by_yupei12 remove lvbaoshi8;")//绿九龙玉佩
                 go2("imbed equip_by_yupei12 remove lanbaoshi8;")//蓝九龙玉佩
                 go2("imbed equip_by_yupei12 remove huangbaoshi8;")//黄九龙玉佩
                 go2("imbed equip_by_yupei12 remove zishuijing8;")//紫九龙玉佩
                 go2("#5 imbed equip_by_yupei12 wear hongbaoshi8;")//红九龙玉佩
                 go2("imbed equip_by_yupei12 wear lvbaoshi8;")//绿九龙玉佩
                 go2("imbed equip_by_yupei12 wear lanbaoshi8;")//蓝九龙玉佩
                 go2("#5 imbed weapon_moke_stick12 wear zishuijing8;#2 imbed weapon_moke_stick12 wear hongbaoshi8;")//
                 go2("#5 imbed weapon_moke_sword12 wear zishuijing8;#2 imbed weapon_moke_sword12 wear hongbaoshi8;")//
             }},
            {label: 'autopeishi|一键配饰',title: "自动买玉玺、勋章等并打孔",
             eventOnClick() {
                 //买
                 go2("jh 1;e;n;n;upgrade_yupei;upgrade_yupei buy;upgrade_yupei 11;upgrade_xinwu;upgrade_xinwu buy;upgrade_xinwu 6;upgrade_peishi;upgrade_peishi buy;upgrade_peishi 7;upgrade_xunzhang;upgrade_xunzhang buy;upgrade_xunzhang 8;s;#4 e;n;upgrade_jinxiujie;upgrade_jinxiujie buy;upgrade_jinxiujie 6;");
                 //打孔
                 go2("jh 2;#16 n;#4 w;n;w;items get_store /obj/baoshi/hongbaoshi8;items get_store /obj/baoshi/huangbaoshi8;items get_store /obj/baoshi/lanbaoshi8;items get_store /obj/baoshi/lvbaoshi8;items get_store /obj/baoshi/zishuijing8;reclaim recl 10000 zishuijing8;reclaim recl 10000 lvbaoshi8;reclaim recl 10000 lanbaoshi8;reclaim recl 10000 huangbaoshi8;reclaim recl 10000 hongbaoshi8;reclaim buy 8 10000;jh 1;e;n;n;w;#30 event_1_7394551 go equip_xinwu12;#30 event_1_7394551 go equip_xunzhang12;#30 event_1_7394551 go equip_peishi_m12;jh 1;e;n;#4 e;n;#30 dakong go equip_jinxiujie12;");
                 //镶嵌
                 go2("#40 imbed equip_jinxiujie12 wear zishuijing8;#40 imbed equip_xunzhang12 wear zishuijing8;#40 imbed equip_peishi_m12 wear zishuijing8;#40 imbed equip_xinwu12 wear zishuijing8;#5 imbed equip_moke_yupei12 wear hongbaoshi8;imbed equip_moke_yupei12 wear lanbaoshi8;imbed equip_moke_yupei12 wear lvbaoshi8;wear equip_jinxiujie12;wear equip_xunzhang12;wear equip_peishi_m12;wear equip_xinwu12;wear equip_moke_yupei12;");
             }},


        ]},
    {
        subject: "WQshenbing|武器神兵",
        buttons: [
            {label: 'shenbingbingyue|按钮名(中文)',//按钮名
             title: "(中英文)",//按钮注释
             id:'gota18',//按钮ID
             eventOnClick() {
                 //命令区域

             }},
        ]},{
            subject: "FJbingyue|防具冰月",
            buttons: [
                {label: 'startBY|开冰月(没用)',title: "",id:'gota18',eventOnClick() {alert("都说了没用了还点！ \n....0.0....");}},
                {label: 'bingyue0|说明书一',title: "查看说明书",id:'gota18',eventOnClick() {
                    alert("开冰月先做好12级装备，并且不要开脉或者提前完成开脉任务。 \n冰月一没啥注意的直接点按钮自动完成。");
                }},
                //{label: 'bingyue|',title: "",id:'gota18',eventOnClick() {go2(""); }},
                {label: 'bingyue1|冰月一',title: "",id:'gota18',eventOnClick() {
                    go2("home;golook_room;public_op6;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;ne;#10 ask dali_shaonu;ask dali_shaonu;event_1_6191337;sw;w;se;#10 ask dali_laojisi;jh 34;ne;e;e;e;e;e;n;e;n;#20 ask duanjian_baipao;;;;;;jh 31;n;n;n;w;w;w;w;n;#5 ask resort_guard;give resort_guard;jh 15;s;s;s;s;s;s;w;#10 ask qingcheng_mudaoren;give qingcheng_mudaoren;items get_store /obj/quest/waist_suipian11;give qingcheng_mudaoren;jh 15;s;s;s;w;w;s;s;#5 ask qingcheng_biaoshi3;jh 26;w;w;w;ask guanwai_baiyishaonian;kill guanwai_baiyishaonian;jh 15;s;s;s;w;w;s;s;give qingcheng_biaoshi3;#5 ask qingcheng_biaoshi3;jh 15;s;s;s;s;s;s;w;give qingcheng_mudaoren;jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;ne;give dali_shaonu;sw;w;se;#10 ask dali_laojisi;"); }},
                {label: 'bingyue2|做冰一装备',title: "",id:'gota18',eventOnClick() { go2("jh 33;sw;sw;#4 s;#5 w;n;ne;;sw;w;se;by_upgrade 1 equip_moke_surcoat12;by_upgrade 1 equip_moke_waist12;by_upgrade 1 equip_moke_wrists12;by_upgrade 1 equip_moke_neck12;by_upgrade 1 equip_moke_yupei12;");}},
                {label: 'bingyue3|说明书二',title: "查看说明书",id:'gota18',eventOnClick() {
                    alert("冰月二分步做，先开冰月，然后场景回复，再找东西。 \n按键顺序：冰月二-白衣少年-冰月二续-装备一-装备二-装备三-冰月二终 \n装备二三记得摸尸体 \n做完绝对不要进冰月谷 \n不要进！ \n不要进！ \n不要进！ \n不要进！");
                }},
                {label: 'bingyue4|冰月二',title: "",id:'gota18',eventOnClick() {
                    go2("home;golook_room;public_op6;");
                    go2("jh 14;w;n;n;n;w;w;w;n;#5 ask tangmen_tangfang;give tangmen_tangfang;say 白衣少年");}},
                {label: 'bingyue6|冰月二续',title: "",id:'gota18',eventOnClick() {
                    go2("ask tangmen_tangfang;fight tangmen_tangfang;give tangmen_tangfang;#5 ask tangmen_tangfang;");
                    go2("jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;");
                    go2("#10 ask tangmen_madam;give tangmen_madam;#20 ask tangmen_madam;give tangmen_madam;#10 ask tangmen_madam;");
                    go2("team create;fb 5;event_1_26662342;kill siyu_gouchenzhanglao;se;kill siyu_gouchenzhangjiao;");
                    go2("jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;#10 ask tangmen_madam;fight tangmen_madam;#10 ask tangmen_madam;");
                    go2("jh 14;w;#4 n;#10 ask tangmen_fangrou;"); }},
                {label: 'bingyue7|装备一',title: "",id:'gota18',eventOnClick() {go2("jh 1;e;#4 n;e;shop xf_buy xf_shop17;"); }},
                {label: 'bingyue8|装备二',title: "",id:'gota18',eventOnClick() {go2("jh 20;w;w;s;e;#5 s;sw;sw;#4 s;e;e;kill gumu_longnv;"); }},
                {label: 'bingyue9|装备三',title: "",id:'gota18',eventOnClick() {go2("jh 26;#10 w;kill lama_master;"); }},
                {label: 'bingyue10|冰月二终',title: "",id:'gota18',eventOnClick() {go2("jh 14;w;#4 n;give tangmen_fangrou;#10 ask tangmen_fangrou;"); }},
                {label: 'bingyue11|说明书三',title: "查看说明书",id:'gota18',eventOnClick() {
                    alert("冰月三比较麻烦，但是不做又不行，艹艹艹艹艹艹 \n按钮顺序：冰月三-虚归一-冰月三续-冰月三终 \n冰三续完了之后等一天再做终");
                }},
                {label: 'bingyue12|冰月三',title: "",id:'gota18',eventOnClick() {go2("public_op6;jh 14;w;#4 n;event_1_32682066;event_1_48044005;kill bingyuegu_binglinshou;event_1_95129086;kill bingyuegu_xuanwujiguanshou;event_1_17623983;#10 event_1_44840772;jh 15;#6 s;w;#20 ask qingcheng_mudaoren;fight qingcheng_mudaoren;#20 ask qingcheng_mudaoren;kill qingcheng_mudaoren;jh 15;#3 s;w;w;s;s;kill qingcheng_biaoshi3;"); }},
                {label: 'bingyue13|虚归一',title: "",id:'gota18',eventOnClick() {
                    alert("点杭界山去荣威镖局找虚归一，对话然后杀了");
                }},
                {label: 'bingyue14|冰月三续',title: "",id:'gota18',eventOnClick() {go2("jh 13;#9 n;#10 ask shaolin_xuan-ci;jh 26;#5 w;n;#10 ask guanwai_ziyiyaoseng;kill guanwai_ziyiyaoseng;"); }},
                {label: 'bingyue15|冰月三终',title: "",id:'gota18',eventOnClick() {go2("jh 14;w;#4 n;event_1_32682066;event_1_48044005;kill bingyuegu_binglinshou;event_1_95129086;kill bingyuegu_xuanwujiguanshou;event_1_17623983;#3 event_1_45410498;"); }},
                {label: 'doBY|做冰月(没用)',title: "",id:'gota18',eventOnClick() {alert("都说了没用了还点！ \n....0.0....");}},
                {label: 'dobingyue0|第一轮(没用)',title: "",id:'gota18',eventOnClick() {alert("都说了没用了还点！ \n....0.0....");}},
                {label: 'dobingyue1|冰月1.1',title: "",id:'gota18',eventOnClick() {go2("jh 33;sw;sw;#4 s;#5 w;n;ne;;sw;w;se;by_upgrade 1 equip_by_surcoat12;by_upgrade 1 equip_by_waist12;by_upgrade 1 equip_by_wrists12;by_upgrade 1 equip_by_neck12;by_upgrade 1 equip_by_yupei12;"); }},
                {label: 'dobingyue2|冰月1.2',title: "",id:'gota18',eventOnClick() {
                    go2("jh 2;#16 n;#4 w;n;w;event_1_32991030;");
                    go2("reclaim recl 10000 hongaoshi8;");
                    go2("reclaim recl 10000 huangbaoshi8;");
                    go2("reclaim recl 10000 lanbaoshi8;");
                    go2("reclaim recl 10000 lvbaoshi8;");
                    go2("reclaim recl 10000 zishuijing8;");
                    go2("reclaim buy 10 10000;");
                    go2("jh 14;w;#4 n;");
                    go2("#100 by_upgrade 2 equip_by_surcoat12;");
                    go2("#100 by_upgrade 2 equip_by_waist12;");
                    go2("#100 by_upgrade 2 equip_by_wrists12;");
                    go2("#100 by_upgrade 2 equip_by_neck12;");
                    go2("#100 by_upgrade 2 equip_by_yupei12;"); }},
                {label: 'dobingyue3|冰月1.3',title: "",id:'gota18',eventOnClick() {go2("jh 2;#16 n;#4 w;n;w;reclaim buy 11 10000;jh 26;#5 w;n;#100 by_upgrade 3 equip_by_surcoat12;#100 by_upgrade 3 equip_by_waist12;#100 by_upgrade 3 equip_by_wrists12;#100 by_upgrade 3 equip_by_neck12;#100 by_upgrade 3 equip_by_yupei12;"); }},
                {label: 'dobingyue4|第二轮(没用)',title: "",id:'gota18',eventOnClick() {alert("都说了没用了还点！ \n....0.0....");}},
                {label: 'dobingyue5|冰月2.1',title: "",id:'gota18',eventOnClick() {go2("jh 33;sw;sw;#4 s;#5 w;n;ne;;sw;w;se;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_cloth12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_shield12;by_upgrade 1 equip_moke_finger12;by_upgrade 1 equip_moke_boots12;"); }},
                {label: 'dobingyue6|冰月2.2',title: "",id:'gota18',eventOnClick() {go2("jh 14;w;#4 n;#100 by_upgrade 2 equip_by_head12;#100 by_upgrade 2 equip_by_cloth12;#100 by_upgrade 2 equip_by_armor12;#100 by_upgrade 2 equip_by_shield12;#100 by_upgrade 2 equip_by_finger12;#100 by_upgrade 2 equip_by_boots12;"); }},
                {label: 'dobingyue7|冰月2.3',title: "",id:'gota18',eventOnClick() {go2("jh 26;#5 w;n;#100 by_upgrade 3 equip_by_head12;#100 by_upgrade 3 equip_by_cloth12;#100 by_upgrade 3 equip_by_armor12;#100 by_upgrade 3 equip_by_shield12;#100 by_upgrade 3 equip_by_finger12;#100 by_upgrade 3 equip_by_boots12;"); }},


            ]},
]
//初始化按钮
var initializeshenbingbingyueButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < shenbingbingyueConfigurations.length; i++) {
        let group = shenbingbingyueConfigurations[i];

        createSubject(group.subject,'canBeHiddenshenbingbingyue');
        createButtons(group.buttons,'canBeHiddenshenbingbingyue');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "神兵冰月";//主菜单按钮名
        button.title = "可以来回切换";//主菜单按钮注释
        button.id = "shenbingbingyueConfig";////主菜单按钮ID，按钮声明用的就是这个
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenshenbingbingyue").attr("hidden", "true");
                if (ButtonId == "shenbingbingyueConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenshenbingbingyue").removeAttr("hidden");
                if (ButtonId != "shenbingbingyueConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "shenbingbingyueConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeshenbingbingyueButtons();
//奇侠秘境
var qixiamijingConfigurations = [
    {subject: "automijing|自动秘境",
     buttons: [
         //{label: '按钮名(英文)|按钮名(中文)',title: "(中英文)",id:'gota18',eventOnClick() { }},
         {label: 'mijing1|八卦门',title: "(中英文)",id:'gota18',eventOnClick() {go2("#4 n;#4 ne;ask baguamen_baguamendizi;ask baguamen_baguamendizi;fight baguamen_baguamendizi;ask baguamen_baguamendizi;nw;nw;w;#3 n;ask baguamen_laozhangzhe;fight baguamen_laozhangzhe;s;n;ask baguamen_laozhangzhe;s;n;event_1_40416342;ne;fight baguamen_huilan;sw;e;fight baguamen_xuqi;w;se;fight baguamen_yangyuanzhi;playskill 1;nw;s;fight baguamen_wangjianyi;playskill 3;n;sw;fight baguamen_wangjianzhi;playskill 1;ne;w;fight baguamen_wenhongdashi;e;nw;fight baguamen_chenluodashi;playskill 3;se;n;fight baguamen_shangfeijian;ask baguamen_shangfeijian;s;n;event_1_33912567;n;ask baguamen_wangyangyuan;n;w;#20 event_1_7335134;e;e;#20 event_1_21755461;w;s;give baguamen_wangyangyuan;fight baguamen_wangyangyuan;ask baguamen_wangyangyuan;n;event_1_47202841;#3 n;e;n;fight baguamen_heiyicike;n;kill baguamen_heiyicike;n;kill baguamen_zhangzhaoqin;");}},
         {label: 'mijing2|蛮王城寨',title: "(中英文)",id:'gota19',eventOnClick() {go2("sw;#3 n;s;kill nanmanzhidi_manzumenwei;s;w;nw;n;event_1_53189765;s;se;e;e;ne;n;event_1_13279753;s;n;event_1_31798882;kill nanmanzhidi_manzushaobing2;event_1_48004127;s;sw;w;w;nw;n;event_1_77016328;kill nanmanzhidi_manzushaobing;event_1_51939861;s;se;e;#5 n;w;n;ne;n;kill nanmanzhidi_manwang;");}},
         {label: 'mijing3|滨海古城',title: "(中英文)",id:'gota20',eventOnClick() {go2("#4 w;nw;nw;kill binhaigucheng_bianyiwokou;sw;kill binhaigucheng_bianyiwokou;nw;kill binhaigucheng_bianyiwokou;nw;kill binhaigucheng_panzei;nw;w;kill binhaigucheng_wokouduizhang;w;kill binhaigucheng_wokoumoushi;");}},
         {label: 'mijing4|天龙山',title: "(中英文)",id:'gota21',eventOnClick() {go2("n;e;n;nw;w;n;ne;nw;n;nw;ne;n;nw;nw;n;n;kill tianlongshan_longdaxia");}},
         {label: 'mijing5|佛门石窟',title: "(中英文)",id:'gota22',eventOnClick() {go2("n;e;#5 n;e;s;#3 e;n;n;e;n;e;e;event_1_17813974;n;n;kill fomenshiku_renjielama;");}},
         {label: 'mijing6|雷池山',title: "(中英文)",id:'gota23',eventOnClick() {go2("ne;e;se;s;e;se;s;e;e;kill leichishan_xunluoehan;se;s;ask leichishan_luopolaotou;ask leichishan_luopolaotou;n;nw;w;w;n;nw;#3 w;sw;kill leichishan_xunluoehan;playskill 1;#3 s;se;e;kill leichishan_xunluoehan;e;e;#3 n;kill leichishan_xunluoehan;n;nw;w;w;s;kill leichishan_xunluoehan;s;se;e;n;nw;kill leichishan_xunluoehan;nw;event_1_92437008;event_1_92437008;event_1_92437008;event_1_92437008;event_1_33600872;;n;ne;ask leichishan_shoumenehan;ask leichishan_shoumenehan;s;event_1_91406228;e;e;s;ask leichishan_xueyichuzi;ask leichishan_xueyichuzi;n;w;w;event_1_13419569;e;e;s;ask leichishan_xueyichuzi;stop300000;ask leichishan_xueyichuzi;w;s;s;e;s;kill leichishan_ehan;se;event_1_3167441;sw;s;e;kill leichishan_ehan;sw;s;ask leichishan_tutoulaoren;kill leichishan_tutoulaoren;#3 s;kill leichishan_dazongguan;");}},
         {label: 'mijing7|绿水山庄',title: "(中英文)",id:'gota24',eventOnClick() {go2("lvshuige1_op1;#7 n;kill lvshuige_lijuee;n;kill lvshuige_lijuee;n;kill lvshuige_lijuee;n;kill lvshuige_lijuee;n;event_1_95017501;kill lvshuige_lijuee;event_1_95017501;#6 n;event_1_95017501;n;kill lvshuige_caoceao");}},
         {label: 'mijing8|龙渊刀楼',title: "(中英文)",id:'gota25',eventOnClick() {go2("#12 n;kill daojiangu_daojianguzhu");}},
         {label: 'mijing9|戈壁绿洲',title: "(中英文)",id:'gota26',eventOnClick() {go2("#3 e;n;w;n;e;e;#5 s;w;w;kill lvzhou_tujuewangzi");}},
         {label: 'mijing10|乱石山',title: "(中英文)",id:'gota27',eventOnClick() {go2("e;n;n;e;e;nw;e;#4 n;#4 e;kill luanshishan_caobalong;");}},
         {label: 'mijing11|桃花渡',title: "(中英文)",id:'gota28',eventOnClick() {go2("e;s;w;s;#4 e;#3 s;e;e;kill taohuadu_zhangbangzhu;");}},
         {label: 'mijing12|酆都鬼城',title: "(中英文)",id:'gota29',eventOnClick() {go2("n;n;nw;nw;nw;n;ask fengduguicheng_qingmiannanzi;n;ask fengduguicheng_qingmiangui;prev;e;ask fengduguicheng_yinsizhushi;w;s;;s;se;se;se;ne;ne;ne;#4 n;event_1_16839782;n;#3 s;ask fengduguicheng_fengduligui;#3 n;event_1_16839782;n;ask fengduguicheng_yanluo;kill fengduguicheng_yanluo;");}},
         {label: 'mijing13|药王谷',title: "(中英文)",id:'gota30',eventOnClick() {
             go2("n;nw;sw;n;ask yaowanggu_qingniandizi;ask yaowanggu_qingniandizi;n;e;kill yaowanggu_shiren;n;ne;n;n;ask yaowanggu_shoumendizi;s;s;sw;s;e;e;ask yaowanggu_dazhanglao;#4 e;ask yaowanggu_yaowang;ask yaowanggu_yaowang;#6 w;n;ne;n;n;w;");setTimeout(autoXYL(),5000)}},
         {label: 'mijing14|帝龙陵',title: "(中英文)",id:'gota28',eventOnClick() {go2("n;n;kill dilongling_jinjinbaiehu;n;w;w;event_1_69170893;#4 e;event_1_27672237;w;w;n;n;event_1_25559375;n;event_1_13219206;w;event_1_53161823;w;event_1_15911907;get obj_yinyaoshi;w;event_1_13219206;n;event_1_52207992;;se;s;sw;look_item obj_yangyaoshi;get obj_yangyaoshi;n;nw;#4 n;nw;#7 n;ne;#8 n;e;#8 n;w;event_1_17986956;#6 n;nw;event_1_13219206;w;w;event_1_15911907;se;event_1_47700649;se;event_1_61445609;e;event_1_52207992;se;event_1_15911907;se;event_1_47700649;#4 n;#4 ne;#3 n;nw;#7 n;event_1_68105893;n;e;e;kill dilongling_jinjinbaiehu;e;#3 w;n;e;e;#3 w;e;n;kill dilongling_jinjinbaiehu;n;n;event_1_89415643;n;kill dilongling_jinjinbaiehu;#3 n;kill dilongling_yinlongdizun;n;n;kill dilongling_konghunshi");}},
    {label: 'mijing15|大福船',title: "(中英文)",id:'gota28',eventOnClick() {go2("w;n;n;w;s;w;#3 n;e;n;#4 e;#4 n;w;n;kill dafuchuan_chuanlaoda;");}},
     ]},
    {
        subject: "qixiaskills|自动奇侠",
        buttons: [
            {label: '按钮名(英文)|按钮名(中文)',//按钮名
             title: "(中英文)",//按钮注释
             id:'gota18',//按钮ID
             eventOnClick() {
                 //命令区域

             }},
        ]},
]
//初始化按钮
var initializeqixiamijingButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < qixiamijingConfigurations.length; i++) {
        let group = qixiamijingConfigurations[i];

        createSubject(group.subject,'canBeHiddenqixiamijing');
        createButtons(group.buttons,'canBeHiddenqixiamijing');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "奇侠秘境";//主菜单按钮名
        button.title = "可以来回切换";//主菜单按钮注释
        button.id = "qixiamijingConfig";////主菜单按钮ID，按钮声明用的就是这个
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenqixiamijing").attr("hidden", "true");
                if (ButtonId == "qixiamijingConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenqixiamijing").removeAttr("hidden");
                if (ButtonId != "qixiamijingConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "qixiamijingConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeqixiamijingButtons();
/*
自动外传

*/
//二级子菜单
var waizhuanConfigurations = [
    {subject: "wz1|外传一",
     buttons: [
         {label: 'waizhuan0|外传1.1.1', title: "外一第一卷第一部分，先到副本一拿到满江红",id:'waizhuan',eventOnClick() {
             go2("jh 23;n;n;e;event_1_50956819;give meizhuang_wudao;#50 ask meizhuang_wudao;");
             go2("jh 1;e;n;n;n;w;#20 ask snow_herbalist;say 杨再兴;#20 ask snow_herbalist;");
             go2("jh 17;sw;s;sw;nw;ne;event_1_38940168;fight kaifeng_yelvyilie;#5 ask kaifeng_yelvyilie;");
             go2("jh 6;event_1_98623439;ne;ne;#2 ask gaibang_mo-bu;kill gaibang_mo-bu;home;shop buy shop1;");
             go2("jh 17;sw;s;sw;nw;ne;event_1_38940168;give kaifeng_yelvyilie;");
             go2("jh 1;e;n;n;n;w;give snow_herbalist;talk外传告一段落，一天后再来;");}},
         {label: 'waizhuan1|外传1.1.2', title: "外一第一卷第二部分，1.1.1一天后",id:'waizhuan',eventOnClick() {
             go2("jh 1;e;n;n;n;w;ask snow_herbalist;");
             go2("jh 1;e;#4 n;e;ask snow_chefu;");
             go2("jh 12;n;n;n;w;n;nw;e;#5 ask waterfog_watcher;");
             go2("jh 27;ne;nw;w;nw;w;w;;kill heimuya_shaogong;@船夫;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;#5 ask heimuya_yangyanqing;#3 w;#5 ask heimuya_huaxiangrong;");
             go2("jh 28;n;w;w;w;se;#5 ask xingxiu_xuanyidaoyao;kill xingxiu_xuanyidaoyao;w;event_1_53845206;talk杭界山找花落云;");}},
         {label: 'waizhuan2|外传1.1.3', title: "外一第一卷第二部分续，杭界山找完花落云后点",id:'waizhuan',eventOnClick() {
             go2("jh 14;e;#5 ask tangmen_gaoyiyi;event_1_10831808;n;#10 ask tangmen_zhangzhiyue;s;s;#5 ask tangmen_gaoyiyi;");
             go2("jh 15;n;nw;w;nw;n;event_1_14401179;ask qingcheng_nielongzhiling;kill qingcheng_nielongzhiling;");
             go2("jh 14;e;event_1_10831808;n;give tangmen_zhangzhiyue;ask tangmen_zhangzhiyue;");
             go2("jh 12;n;e;event_1_66940918;jh 14;e;give tangmen_gaoyiyi;ask tangmen_gaoyiyi;");
             go2("jh 23;n;n;e;event_1_50956819;#10 ask meizhuang_wudao;");
             go2("jh 27;ne;nw;w;nw;w;w;;kill heimuya_shaogong;@船夫;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;#5 ask heimuya_yangyanqing;#3 w;#5 ask heimuya_huaxiangrong;");
             go2("jh 27;ne;n;ne;#5 ask heimuya_ranwuwang;fight heimuya_ranwuwang;#5 ask heimuya_ranwuwang;");
             go2("jh 32;n;n;se;#4 n;w;w;n;kill murong_murongfu;s;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w;kill murong_murongbo;");
             go2("jh 27;ne;n;ne;#5 ask heimuya_ranwuwang;");
             go2("jh 14;e;give tangmen_gaoyiyi;team create;");
             go2("fb 4;n;kill youling_fanyun-daoshen;n;kill youling_zhibing-jianke;n;kill youling_fuyu-jianshen;n;kill youling_paiyun-kuangshen;n;kill youling_jiutian-laozu3;");
             go2("jh 14;e;give tangmen_gaoyiyi;jh 23;n;n;e;event_1_50956819;#10 ask meizhuang_wudao;talk第二卷结束，一天后开始下一步;");}},
         {label: 'waizhuan3|外传1.2.1', title: "第二卷第一部分：苟书痴到大理武将",id:'waizhuan',eventOnClick() {
             //苟书痴
             go2("jh 16;#4 s;e;e;s;#3 w;give xiaoyao_goudu;");
             //背刀人
             go2("jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;e;#5 ask duanjian_beidaoren;fight duanjian_beidaoren;#5 ask duanjian_beidaoren;");
             //戚继光
             go2("jh 30;yell;w;n;e;ask taohua_qizongbing;#5 ask taohua_qizongbing;fight taohua_qizongbing;#5 ask taohua_qizongbing;");
             //福州府尹
             go2("jh 15;#5 s;e;#10 ask qingcheng_fuyin;");
             //副本五
             go2("jh 30;yell;w;n;e;#20 ask taohua_qizongbing;fb 5;event_1_12238479;kill siyu_changshengzhanglao;sw;kill siyu_changshengzhangjiao;");
             //戚继光
             go2("jh 30;yell;w;n;e;#20 ask taohua_qizongbing;");
             //大理武将
             go2("jh 33;sw;sw;s;s;#5 ask dali_jiang;talk外传告一段落，一天后再对话武将。");
         }},
         {label: 'waizhuan4|外传1.2.2', title: "",id:'waizhuan',eventOnClick() {
             //对话武将
             go2("jh 33;sw;sw;s;s;#5 ask dali_jiang;");
             //对话阳明居士
             go2("jh 29;n;n;n;n;event_1_60035830;gofind平台;e;#10 ask taoguan_yangmingjushi;event_1_27333767;#50 ask taoguan_yangmingjushi;");
             //杀死后土堂香主
             go2("fb 5;event_1_889199;kill siyu_houtuxiangzhu;jh 29;n;n;n;n;event_1_60035830;gofind平台;e;#10 ask taoguan_yangmingjushi;");
             //对话石公子
             go2("jh 36;yell;e;ne;ne;ne;e;n;ask xiakedao_shigongzi;ask xiakedao_shigongzi;ask xiakedao_shigongzi;");
             //杀侠客岛云游高僧
             go2("s;w;sw;ask xiakedao_yunyougaoseng;kill xiakedao_yunyougaoseng;ne;e;n;ask xiakedao_shigongzi;");
             //对话泰山掌门
             go2("jh 24;#17 n;ask taishan_taishan17;");
             //对话冯太监
             go2("jh 24;#12 n;e;e;#4 n;#5 ask taishan_fengtaijian;fight taishan_fengtaijian;#5 ask taishan_fengtaijian;");
             //对话戚继光
             go2("jh 30;yell;w;n;e;ask taohua_qizongbing;ask taohua_qizongbing;");
             //对话泰山掌门
             go2("jh 24;#17 n;ask taishan_taishan17;");
             //侠客岛找谢烟客
             go2("jh 36;yell;e;ne;ne;ne;#6 e;n;e;e;ne;give xiakedao_xieyanke;fight xiakedao_xieyanke;#50 ask xiakedao_xieyanke;fight xiakedao_xieyanke;");
             //，对话戚继光
             go2("jh 30;yell;w;n;e;#10 ask taohua_qizongbing;");
             //对话王阳明
             go2("jh 29;n;n;n;n;event_1_60035830;gofind平台;e;#50 ask taoguan_yangmingjushi;");
             //对接酒店女老板
             go2("jh 15;s;s;w;n;#10 ask qingcheng_mboss;give qingcheng_mboss;#10 ask qingcheng_mboss;");
             //对话钱庄刘守才
             go2("jh 2;#7 n;e;#50 ask luoyang_luoyang4;team create;golook_room;");
             //杀副本四排云狂神
             go2("fb 4;n;kill youling_fanyun-daoshen;n;kill youling_zhibing-jianke;n;kill youling_fuyu-jianshen;n;kill youling_paiyun-kuangshen;");
             //对话钱庄刘守才
             go2("jh 2;#7 n;e;#50 ask luoyang_luoyang4;");
             //找侠客岛矮老者
             go2("jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw;#5 ask xiakedao_ailaozhe;fight xiakedao_ailaozhe;#5 ask xiakedao_ailaozhe;");
             //:对话王阳明
             go2("jh 29;n;n;n;n;event_1_60035830;gofind平台;e;#50 ask taoguan_yangmingjushi;");
         }},
         {label: 'waizhuan5|外传1.3.1', title: "",id:'waizhuan',eventOnClick() {
             //对话王阳明
             go2("jh 29;n;n;n;n;event_1_60035830;gofind平台;e;#50 ask taoguan_yangmingjushi;");
             //对话尉迟敬德(
             go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;give changan_xuanjiaweishi;#5 n;e;#20 ask changan_weichijingde;");
             //玄武门的金甲卫士
             go2("jh 2;#27 n;event_1_18305491;event_1_26539519;fight changan_shengejiguanshi;;;");
             //对话尉迟敬德。对话秦王
             go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;#5 n;e;#10 ask changan_weichijingde;w;#50 ask changan_qinwang;");
             //对话红色的牧羊女，对话李将军
             go2("jh 26;w;w;#5 ask guanwai_muyangnv;n;#10 ask guanwai_lijiangjun;s;#10 ask guanwai_muyangnv;n;#10 ask guanwai_lijiangjun;");
             //杀死突厥大将
             go2("n;n;kill guanwai_tujuexianfengdajiang;s;#10 ask guanwai_lijiangjun;s;#10 ask guanwai_muyangnv;");
             //对话大昭寺葛伦
             go2("#8 w;#20 ask lama_master;event_1_91837538;ask lama_gelun;");
             //对话哥舒翰
             go2("jh 2;#16 n;#4 w;n;e;ask changan_geshuhan;");
             //对话大昭寺葛伦
             go2("jh 26;w;w;w;w;w;w;w;w;w;w;#20 ask lama_master;event_1_91837538;#10 ask lama_gelun;stop5000;#10 ask lama_gelun;ask lama_gelun");
             //对话哥舒翰
             go2("jh 2;#16 n;#4 w;n;e;ask changan_geshuhan;");
             //对话程知节
             go2("w;#11 n;w;#50 ask changan_chengzhijie;");
             //对话欧阳敏
             go2("jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;#5 ask tangmen_madam;fight tangmen_madam;#5 ask tangmen_madam;");
             //对话余沧海
             go2("jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;ask qingcheng_masteryu;");
             //对话程知节
             go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;w;#20 ask changan_chengzhijie;");
         }},
         {label: 'waizhuan6|外传1.4.1', title: "",id:'waizhuan',eventOnClick() {
             //对话天策府秦王李世民
             go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;#50 ask changan_qinwang;");
             //风花酒馆卫青(
             go2("#9 s;w;#10 ask changan_weiqing;give changan_weiqing;");
             //对话侠客岛李四
             go2("jh 36;yell;e;ne;ne;ne;e;e;n;ask xiakedao_lisi;kill xiakedao_lisi;");
             //再次对话卫青
             go2("jh 2;#16 n;#4 w;#3 n;w;#50 ask changan_weiqing;");
             //狼居胥楼霍去病
             go2("e;n;w;w;#9 n;#10 ask changan_huobiaoyao;");
             //李元帅、乔阴酒楼武官、大理武将，回去对话霍去病
             go2("jh 2;#8 n;w;luoyang14_op1;#5 ask luoyang_luoyang23;jh 7;#6 s;e;#5 ask choyin_sergeant;jh 33;sw;sw;s;s;#5 ask dali_jiang;jh 2;#15 n;#6 w;#13 n;#6 ask changan_huobiaoyao;#6 fight changan_huobiaoyao;#6 ask changan_huobiaoyao;");
             //魔风阁张矮子
             go2("jh 27;ne;nw;w;nw;w;w;;kill heimuya_shaogong;mst船夫;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w;#5 ask heimuya_zhangchengfeng;fight heimuya_zhangchengfeng;#5 ask heimuya_zhangchengfeng;");
             //对话血手天魔对话霍去病
             go2("jh 2;#15 n;#6 w;#6 n;#5 ask changan_xueshoutianmo;fight changan_xueshoutianmo;#7 n;#20 ask changan_huobiaoyao;");
             //傅介子
             go2("jh 21;#10 ask baituo_fujiezi;#4 n;w;kill baituo_qingyidunwei;w;kill baituo_feiyushenjian;w;kill baituo_yinlangjinwei;w;fight baituo_junzhongzhushuai;jh 21;#5 ask baituo_fujiezi;");
             //对话玉门关守将
             go2("#5 n;e;#5 ask baituo_yumenshoujiang;");
             //对话风花酒馆卫青
             go2("jh 2;#16 n;#4 w;#3 n;w;#50 ask changan_weiqing;#2 give changan_weiqing;#5 ask changan_weiqing;talk第四卷告一段落，一天后再来。");
         }},
         {label: 'waizhuan7|外传1.4.2-1', title: "",id:'waizhuan',eventOnClick() {
             //对话卫青
             go2("jh 2;#16 n;#4 w;#3 n;w;#50 ask changan_weiqing;");
             //药铺买3千年灵芝
             go2("jh 1;e;#3 n;w;buy /map/snow/obj/qiannianlingzhi_N_10 from snow_herbalist;home;");
             //青城游方郎中买3大补丸
             go2("jh 15;n;#2 buy /map/qingcheng/npc/obj/spile from qingcheng_doctor;");
             //大理捡八宝妆。
             go2("jh 33;sw;sw;#5 s;e;n;se;#3 e;ne;talk往右走捡八宝妆");

         }},
         {label: 'waizhuan8|外传1.4.2-2', title: "",id:'waizhuan',eventOnClick() {
             //东西给卫青
             go2("jh 2;#16 n;#4 w;#3 n;w;give changan_weiqing;");
             //对话玉门守将
             go2("jh 21;#4 n;e;#10 ask baituo_yumenshoujiang;w;");
             //傅介子
             go2("#4 s;#10 ask baituo_fujiezi;");
             //杀匈奴杀手
             go2("#4 n;e;#3 n;kill baituo_xiongnushashou;");
             //对话傅介子
             go2("#3 s;w;#4 s;#10 ask baituo_fujiezi;");
             //对话玉门守将对话卫青
             go2("#4 n;e;ask baituo_yumenshoujiang;jh 2;#16 n;#4 w;#3 n;w;#10 ask changan_weiqing;talk外一结束！！！！");
         }},

     ]},
    {
        subject: "wz2|外传二",
        buttons: [
            {label: 'waizhuan9|外传2.1.1', title: "外一完了之后可以直接搞 \n开始先输入风行骓的序号",id:'waizhuan',eventOnClick() {
                //
                go2("open jhqx");
                let n = prompt("输入奇侠序号","23");
                //六扇门捕头
                go2("jh 2;#16 n;e;give changan_bukuai;");
                //董老板-六扇门捕头
                go2("#3 e;#3 n;s;e;give changan_donglaoban;#5 ask changan_donglaoban;w;s;s;#3 w;#5 ask changan_bukuai;");
                //董老板
                go2("#3 e;#3 n;s;e;give changan_donglaoban;");
                //孽龙之灵
                go2("jh 15;n;nw;w;nw;n;event_1_14401179;ask qingcheng_nielongzhiling;kill qingcheng_nielongzhiling;");
                //董老板
                go2("jh 2;#16 n;#4 e;#3 n;s;e;#10 ask changan_donglaoban;");
                //仇老板
                go2("w;s;w;#10 ask changan_choulaoban;fight changan_choulaoban;#10 ask changan_choulaoban;");
                //梅超风
                go2("jh 28;sw;#20 ask baituo_meichaofeng;");
                //卫青
                go2("jh 2;#16 n;#4 w;#3 n;w;#10 ask changan_weiqing;");
                //霍去病
                go2("e;n;w;w;#9 n;#10 ask changan_huobiaoyao;fihgt changan_huobiaoyao;");
                //梅师姐
                go2("jh 28;sw;#20 ask baituo_meichaofeng;");
                //卫青
                go2("jh 2;#16 n;#4 w;#3 n;w;#10 ask changan_weiqing;");
                //风行骓
                go2("find_task_road qixia "+n);
                //打听
                go2("#2 auto_dispatch_fengxingzhui event_1_18259345;");
                //雪鸳
                go2("jh 31;#3 n;#4 w;n;n;#5 ask resort_xueyuan;");
                //风行骓
                go2("find_task_road qixia "+n);
                //打听
                go2("#2 auto_dispatch_fengxingzhui event_1_18259345;");
                //雪鸳
                go2("jh 31;#3 n;#4 w;n;n;#5 ask resort_xueyuan;");
                //孔翎
                go2("jh 24;#8 n;w;#5 n;#20 ask taishan_taishan_fb42;fight taishan_taishan_fb42;#20 ask taishan_taishan_fb42;");
                //风行骓
                go2("find_task_road qixia "+n);
                //打听
                go2("#2 auto_dispatch_fengxingzhui event_1_18259345;");
                //对话雪若云-操作不一定管用，有问题请手动（懒省事想的非常规操作）
                go2("jh 37;n;e;e;nw;nw;w;n;e;n;#3 e;ne;ne;ne;event_1_16813927;#20 ask jueqinggu_xueruoyun;fight jueqinggu_xueruoyun;#20 ask jueqinggu_xueruoyun;fight jueqinggu_xueruoyun;#20 ask jueqinggu_xueruoyun;fight jueqinggu_xueruoyun;#20 ask jueqinggu_xueruoyun;fight jueqinggu_xueruoyun;");
                //对话雪若云
                go2("find_task_road qixia "+n);
                //把浅香纱信物给风行骓
                go2("give fengxingzhui_1499607287_3736");
                //把布防图给卫青
                go2("jh 2;#16 n;#4 w;#3 n;w;give changan_weiqing;");
            }},
            {label: 'waizhuan|外传2.1.2', title: "",id:'waizhuan',eventOnClick() {

            }},
            {label: 'waizhuan|外传2.', title: "",id:'waizhuan',eventOnClick() {

            }},
            {label: 'waizhuan|外传2.', title: "",id:'waizhuan',eventOnClick() {

            }},
            {label: 'waizhuan|外传2.', title: "",id:'waizhuan',eventOnClick() {

            }},
            {label: 'waizhuan|外传2.', title: "",id:'waizhuan',eventOnClick() {

            }},
            {label: 'waizhuan|外传2.', title: "",id:'waizhuan',eventOnClick() {

            }},
            {label: 'waizhuan|外传2.', title: "",id:'waizhuan',eventOnClick() {

            }},
        ]},
    {
        subject: "wz3|外传三",
        buttons: [
        ]},
    {
        subject: "wz4|外传四",
        buttons: [
        ]},
    {
        subject: "wz5|外传五",
        buttons: [
        ]},
    {
        subject: "wz6|外传六",
        buttons: [
        ]},
]
//初始化按钮
var initializewaizhuanButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < waizhuanConfigurations.length; i++) {
        let group = waizhuanConfigurations[i];

        createSubject(group.subject,'canBeHiddenwaizhuan');
        createButtons(group.buttons,'canBeHiddenwaizhuan');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "自动外传";//主菜单按钮名
        button.title = "可以来回切换";//主菜单按钮注释
        button.id = "waizhuanConfig";////主菜单按钮ID，按钮声明用的就是这个
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenwaizhuan").attr("hidden", "true");
                if (ButtonId == "waizhuanConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenwaizhuan").removeAttr("hidden");
                if (ButtonId != "waizhuanConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "waizhuanConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializewaizhuanButtons();
/*
自动经脉
*/
//二级子菜单
var autojingmaiConfigurations = [
    {
        subject: "经脉前置",
        buttons: [
            {label: 'qianzhiwupin|前置物品',title: "",id:'imageContainer',eventOnClick() {
                //雪亭店小二买-10根烤鸡腿
                go2("jh 1;#5 buy /obj/example/chicken_leg from snow_waiter;");
                //杨掌柜-5个雪莲-买金仓药
                go2("jh 1;e;#3 n;w;buy /map/snow/npc/obj/ice_lotus_N_10 from snow_herbalist;buy /obj/food/medicine_N_10 from snow_herbalist;");
                //买买提-买马奶酒壶-买火折子
                go2("jh 28;nw;w;buy /map/xingxiu/npc/obj/fire_N_10 from xingxiu_maimaiti;buy /map/xingxiu/npc/obj/hu_N_10 from xingxiu_maimaiti;");
                //卖花姑娘买-10朵黄玫瑰
                go2("jh 2;#7 n;buy /map/luoyang/obj/huangmeigui_N_10 from luoyang_luoyang3;");
                //游四海-买五本突破秘术
                go2("jh 2;#16 n;#4 w;n;w;reclaim buy 22 10;");
                //卖包子的买-5个包子
                go2("jh 7;#3 s;buy /obj/example/dumpling_N_10 from choyin_dumpling_seller;");
                //李莫愁冰魄银针
                go2("jh 5;n;n;n;n;n;w;kill gumu_limochou;mst李莫愁;;home;");

            }},
        ]},
    {
        subject: "冲脉",
        buttons: [
            {label: 'kaimai1-1|商曲穴1',title: "",id:'kaimai1',eventOnClick() {shangquXUE1();}},
            {label: 'kaimai1-2|商曲穴2',title: "",id:'kaimai1',eventOnClick() {shangquXUE2();}},
            {label: 'kaimai2-1|阴都穴1',title: "当天不要做暴击任务、备好十个鸡腿、马奶酒壶、偷窃300级",id:'kaimai2',eventOnClick() {yinduXUE1();}},
            {label: 'kaimai2-2|阴都穴2',title: "",id:'kaimai2',eventOnClick() {yinduXUE2();}},
            {label: 'kaimai3-1|石关穴1',title: "",id:'kaimai3',eventOnClick() {shiguanXUE1();}},
            {label: 'kaimai3-2|石关穴2',title: "",id:'kaimai3',eventOnClick() {shiguanXUE2();}},
            {label: 'kaimai4-1|通谷穴1',title: "",id:'kaimai4',eventOnClick() {tongguXUE1();}},
            {label: 'kaimai4-2|通谷穴2',title: "",id:'kaimai4',eventOnClick() {tongguXUE2();}},
            {label: 'kaimai5-1|幽门穴1',title: "",id:'kaimai5',eventOnClick() {youmenXUE1();}},
            {label: 'kaimai5-2|幽门穴2',title: "",id:'kaimai5',eventOnClick() {youmenXUE2();}},
            {label: 'kaimai5-3|幽门穴3',title: "",id:'kaimai5',eventOnClick() {youmenXUE3();}},
            {label: 'kaimai6|大赫穴',title: "",id:'kaimai6',eventOnClick() {daheXUE();}},
        ]
    },
    {
        subject: "阳蹻脉",
        buttons: [
            {label: 'kaimai13|巨骨穴',title: "",id:'kaimai13',eventOnClick() {jvguXUE();}},
            {label: 'kaimai14|天髎穴',title: "",id:'kaimai14',eventOnClick() {tianmiuXUE();}},
            {label: 'kaimai15|地仓穴',title: "",id:'kaimai15',eventOnClick() {dicangXUE();}},
            {label: 'kaimai16-1|巨髎穴1',title: "",id:'kaimai16',eventOnClick() {jvmiuXUE1x1();}},
            {label: 'kaimai16-2|巨髎穴2',title: "",id:'kaimai16',eventOnClick() {jvmiuXUE1x2();}},
            {label: 'kaimai17-1|承泣穴1',title: "",id:'kaimai17',eventOnClick() {chengqiXUE1();}},
            {label: 'kaimai17-2|承泣穴2',title: "",id:'kaimai17',eventOnClick() {chengqiXUE2();}},
            {label: 'kaimai18|肩髃穴',title: "",id:'kaimai18',eventOnClick() {jianouXUE();}},
        ]
    },
    {
        subject: "阴维脉",
        buttons: [
            {label: 'kaimai31|府舍穴',title: "",id:'kaimai31',eventOnClick() {fusheXUE();}},
            {label: 'kaimai32-1|大横穴1',title: "",id:'kaimai32',eventOnClick() {dahengXUE1();}},
            {label: 'kaimai32-2|大横穴2',title: "",id:'kaimai32',eventOnClick() {dahengXUE2();}},
            {label: 'kaimai33|腹哀穴',title: "",id:'kaimai33',eventOnClick() {fuaiXUE();}},
            {label: 'kaimai34|天突穴1',title: "",id:'kaimai34',eventOnClick() {tiantuXUE1();}},
            {label: 'kaimai34|天突穴2',title: "",id:'kaimai34',eventOnClick() {tiantuXUE3();}},
            {label: 'kaimai35|廉泉穴',title: "",id:'kaimai35',eventOnClick() {lianquanXUE();}},
            {label: 'kaimai36-1|期门穴',title: "",id:'kaimai36',eventOnClick() {qimenXUE1();}},
            {label: 'kaimai36-2|期门穴',title: "",id:'kaimai36',eventOnClick() {qimenXUE2();}},
            {label: 'kaimai36-3|期门穴',title: "",id:'kaimai36',eventOnClick() {qimenXUE3();}},
        ]
    },
    {
        subject: "带脉",
        buttons: [
            {label: 'kaimai7|五枢穴',title: "",id:'kaimai7',eventOnClick() {wushuXUE();}},
            {label: 'kaimai8-1|维道穴1',title: "",id:'kaimai8',eventOnClick() {weidaoXUE1();}},
            {label: 'kaimai8-2|维道穴2',title: "",id:'kaimai8',eventOnClick() {weidaoXUE2();}},
            {label: 'kaimai9-1|居髎穴1',title: "",id:'kaimai9',eventOnClick() {jvmiuXUE1();}},
            {label: 'kaimai9-2|居髎穴',title: "",id:'kaimai9',eventOnClick() {jvmiuXUE2();}},
            {label: 'kaimai10-1|外枢穴1',title: "",id:'kaimai10',eventOnClick() {waishuXUE1();}},
            {label: 'kaimai10-2|外枢穴2',title: "",id:'kaimai10',eventOnClick() {waishuXUE2();}},
            {label: 'kaimai11-1|京门穴1',title: "",id:'kaimai11',eventOnClick() {jingmenXUE1();}},
            {label: 'kaimai11-2|京门穴2',title: "",id:'kaimai11',eventOnClick() {jingmenXUE2();}},
            {label: 'kaimai12-1|脾俞穴1',title: "",id:'kaimai12',eventOnClick() {piyuXUE1();}},
            {label: 'kaimai12-2|脾俞穴2',title: "",id:'kaimai12',eventOnClick() {piyuXUE2();}},
        ]
    },
    {
        subject: "阴蹻脉",
        buttons: [
            {label: 'kaimai25-1|照海穴1',title: "",id:'kaimai25',eventOnClick() {zhaohaiXUE1();}},
            {label: 'kaimai25-2|照海穴2',title: "",id:'kaimai25',eventOnClick() {zhaohaiXUE2();}},
            {label: 'kaimai26-1|关元穴1',title: "",id:'kaimai26',eventOnClick() {guanyuanXUE1();}},
            {label: 'kaimai26-2|关元穴2',title: "",id:'kaimai26',eventOnClick() {guanyuanXUE2();}},
            {label: 'kaimai27-1|血海穴1',title: "",id:'kaimai27',eventOnClick() {xuehaiXUE1();}},
            {label: 'kaimai27-2|血海穴2',title: "",id:'kaimai27',eventOnClick() {xuehaiXUE2();}},
            {label: 'kaimai28-1|交信穴1',title: "",id:'kaimai28',eventOnClick() {jiaoxinXUE1();}},
            {label: 'kaimai28-2|交信穴2',title: "",id:'kaimai28',eventOnClick() {jiaoxinXUE2();}},
            {label: 'kaimai29|晴明穴',title: "",id:'kaimai29',eventOnClick() {qingmingXUE();}},
            {label: 'kaimai30-1|中极穴1',title: "",id:'kaimai30',eventOnClick() {zhongjiXUE1();}},
            {label: 'kaimai30-2|中极穴2',title: "",id:'kaimai30',eventOnClick() {zhongjiXUE2();}},
            {label: 'kaimai30-3|中极穴3',title: "",id:'kaimai30',eventOnClick() {zhongjiXUE3();}},
        ]
    },
    {
        subject: "阳维脉",
        buttons: [
            {label: 'kaimai19|承灵穴',title: "",id:'kaimai19',eventOnClick() {chenglingXUE();}},
            {label: 'kaimai20|脑空穴',title: "",id:'kaimai20',eventOnClick() {naokongXUE();}},
            {label: 'kaimai21|风池穴',title: "",id:'kaimai21',eventOnClick() {fengchiXUE();}},
            {label: 'kaimai22-1|风府穴1',title: "找天师",id:'kaimai22',eventOnClick() {fengfuXUE1();}},
            {label: 'kaimai22-2|风府穴2',title: "",id:'kaimai22',eventOnClick() {fengfuXUE2();}},
            {label: 'kaimai22-3|风府穴3',title: "",id:'kaimai22',eventOnClick() {fengfuXUE3();}},
            {label: 'kaimai22-4|风府穴4',title: "",id:'kaimai22',eventOnClick() {fengfuXUE4();}},
            {label: 'kaimai23|哑门穴',title: "",id:'kaimai23',eventOnClick() {yamenXUE();}},
            {label: 'kaimai24|阳交穴',title: "",id:'kaimai24',eventOnClick() {yangjiaoXUE();}},
        ]
    },
]
//初始化按钮
var initializeautojingmaiButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < autojingmaiConfigurations.length; i++) {
        let group = autojingmaiConfigurations[i];

        createSubject(group.subject,'canBeHiddenautojingmai');
        createButtons(group.buttons,'canBeHiddenautojingmai');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "自动开脉";//主菜单按钮名
        button.title = "可以来回切换";//主菜单按钮注释
        button.id = "autojingmaiConfig";////主菜单按钮ID，按钮声明用的就是这个
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenautojingmai").attr("hidden", "true");
                if (ButtonId == "autojingmaiConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenautojingmai").removeAttr("hidden");
                if (ButtonId != "autojingmaiConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "autojingmaiConfig";
            }
        });

        document.body.appendChild(button);
    }
}

initializeautojingmaiButtons();
//==========================================================
//======================自定义内容结束======================
//==========================================================
/**
 * Skill Bar Setup
*/
var SkillConfigurations = [{
    subject: "xunrenID1|雪停镇",
    buttons: [{
        label: 'xunren1|逄义',
        title: "寻人",
        id:'xunren1',
        eventOnClick() {
            go("jh 1;");//雪亭镇--逄义
        }
    },{
        label: 'xunren2|店小二',
        title: "寻人",
        id:'xunren2',
        eventOnClick() {
            go("jh 1;");//雪亭镇--店小二
        }
    },{
        label: 'xunren3|庙祝',
        title: "寻人",
        id:'xunren3',
        eventOnClick() {
            go("jh 1;e;e;");//雪亭镇--庙祝
        }
    },{
        label: 'xunren4|李火狮',
        title: "寻人",
        id:'xunren4',
        eventOnClick() {
            go("jh 1;e;n;e;e;");//雪亭镇--李火狮
        }
    },{
        label: 'xunren5|柳淳风',
        title: "寻人",
        id:'xunren5',
        eventOnClick() {
            go("jh 1;e;n;e;e;e;");//雪亭镇--柳淳风
        }
    },{
        label: 'xunren6|柳绘心',
        title: "寻人",
        id:'xunren6',
        eventOnClick() {
            go("jh 1;e;n;e;e;e;e;n;");//雪亭镇--柳绘心
        }
    },{
        label: 'xunren7|醉汉',
        title: "寻人",
        id:'xunren7',
        eventOnClick() {
            go("jh 1;e;n;n;");//雪亭镇--醉汉
        }
    },{
        label: 'xunren8|收破烂的',
        title: "寻人",
        id:'xunren8',
        eventOnClick() {
            go("jh 1;e;n;n;");//雪亭镇--收破烂的
        }
    },{
        label: 'xunren9|花不为',
        title: "寻人",
        id:'xunren9',
        eventOnClick() {
            go("jh 1;e;n;n;n;n;e;");//雪亭镇--花不为
        }
    },{
        label: 'xunren10|杜宽',
        title: "寻人",
        id:'xunren10',
        eventOnClick() {
            go("jh 1;e;n;n;n;n;w;");//雪亭镇--杜宽
        }
    },{
        label: 'xunren11|杨掌柜',
        title: "寻人",
        id:'xunren11',
        eventOnClick() {
            go("jh 1;e;n;n;n;w;");//雪亭镇--杨掌柜
        }
    },{
        label: 'xunren12|王铁匠',
        title: "寻人",
        id:'xunren12',
        eventOnClick() {
            go("jh 1;e;n;n;w;");//雪亭镇--王铁匠
        }
    },{
        label: 'xunren13|安惜迩',
        title: "寻人",
        id:'xunren13',
        eventOnClick() {
            go("jh 1;e;n;w;");//雪亭镇--安惜迩
        }
    },{
        label: 'xunren14|魏无极',
        title: "寻人",
        id:'xunren14',
        eventOnClick() {
            go("jh 1;e;s;w;s;");//雪亭镇--魏无极
        }
    }
             ]},{
                 subject: "xunrenID2|落阳",
                 buttons: [{
                     label: 'xunren15|邵空子',
                     title: "寻人",
                     id:'xunren15',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w;");//洛阳-冶炼场-邵空子
                     }
                 },{
                     label: 'xunren16|云梦璃',
                     title: "寻人",
                     id:'xunren16',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_95312623;");//洛阳-长安-云梦璃
                     }
                 },{
                     label: 'xunren17|捕快统领',
                     title: "寻人",
                     id:'xunren17',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;");//洛阳-长安-捕快统领
                     }
                 },{
                     label: 'xunren18|卓小妹',
                     title: "寻人",
                     id:'xunren18',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w;");//洛阳-长安-卓小妹
                     }
                 },{
                     label: 'xunren19|独孤须臾',
                     title: "寻人",
                     id:'xunren19',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;");//洛阳-长安-独孤须臾
                     }
                 },{
                     label: 'xunren20|高铁匠',
                     title: "寻人",
                     id:'xunren20',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e;");//洛阳-长安-高铁匠
                     }
                 },{
                     label: 'xunren21|秦王',
                     title: "寻人",
                     id:'xunren21',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;");//洛阳-长安-秦王
                     }
                 },{
                     label: 'xunren22|卫青',
                     title: "寻人",
                     id:'xunren22',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w;");//洛阳-长安-卫青
                     }
                 },{
                     label: 'xunren23|游四海',
                     title: "寻人",
                     id:'xunren23',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w;");//洛阳-长安-游四海
                     }
                 },{
                     label: 'xunren24|霍骠姚',
                     title: "寻人",
                     id:'xunren24',
                     eventOnClick() {
                         go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;");//洛阳-长安-霍骠姚
                     }
                 },{
                     label: 'xunren25|庙祝',
                     title: "寻人",
                     id:'xunren25',
                     eventOnClick() {
                         go("jh 2;n;n;n;w;");//洛阳--庙祝
                     }
                 }
                          ]},{
                              subject: "xunrenID3|划山村",
                              buttons: [{
                                  label: 'xunren26|冯铁匠',
                                  title: "寻人",
                                  id:'xunren26',
                                  eventOnClick() {
                                      go("jh 3;s;e;n;");//华山村--冯铁匠
                                  }
                              },{
                                  label: 'xunren27|剑大师',
                                  title: "寻人",
                                  id:'xunren27',
                                  eventOnClick() {
                                      go("jh 3;s;s;w;n;");//华山村--剑大师
                                  }
                              },{
                                  label: 'xunren28|黑狗',
                                  title: "寻人",
                                  id:'xunren28',
                                  eventOnClick() {
                                      go("jh 3;s;s;s;");//华山村-黑狗

                                  }
                              }
                                       ]},{
                                           subject: "TYup|小号升级",
                                           buttons: [{
                                               label: 'tiaoyaup1|乔峰',
                                               title: "寻人",
                                               id:'tiaoyaup1',
                                               eventOnClick() {
                                                   go2("jh 1;w;w;w;w;w;n;ask snow_qiaofeng;");//对话雪婷乔峰
                                               }
                                           },{
                                               label: 'tiaoyaup2|牧童称号',
                                               title: "寻人",
                                               id:'tiaoyaup2',
                                               eventOnClick() {
                                                   go2("rank go 185;nw;ask yanyuecheng_fanchuanjushi;ask yanyuecheng_fanchuanjushi;se;ask yanyuecheng_shutong;ask yanyuecheng_shutong;say 借问酒家何处有？牧童遥指杏花村。");//对话梵川居士和书童

                                               }
                                           },{
                                               label: 'tiaoyaup3|游四海',
                                               title: "寻人",
                                               id:'tiaoyaup3',
                                               eventOnClick() {
                                                   go("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w;");//洛阳-游四海
                                                   go("reclaim recl 6666 go obj_kunlun_pantao;reclaim buy 5 go 860;");//洛阳-游四海
                                               }
                                           },{
                                               label: 'shuarenwu|师门刷任务',
                                               title: "寻人",
                                               id:'shuarenwu',
                                               eventOnClick() {
                                                   go2("family_quest cancel go;family_quest;");//入帮-露露鹿

                                               }
                                           },{
                                               label: 'tiaoyaup4|甄大海支线',
                                               title: "寻人",
                                               id:'tiaoyaup4',
                                               eventOnClick() {
                                                   go2("jh 2;n;n;n;n;w;event_1_98995501;n;n;e;fight luoyang_luoyang_fb2;");//洛阳-甄大海
                                               }
                                           },{
                                               label: 'tiaoyaup5|大海到泼皮',
                                               title: "寻人",
                                               id:'tiaoyaup5',
                                               eventOnClick() {
                                                   go2("ask luoyang_luoyang_fb2;");//洛阳-甄大海
                                                   go2("jh 3;s;ask huashancun_popitouzi;ask huashancun_popitouzi;ask huashancun_popitouzi;");//破皮
                                               }
                                           },{
                                               label: 'tiaoyaup6|大海到扬州',
                                               title: "寻人",
                                               id:'tiaoyaup6',
                                               eventOnClick() {
                                                   go2("event_1_49472949;jh 2;n;n;n;n;w;event_1_98995501;n;n;e;ask luoyang_luoyang_fb2;ask luoyang_luoyang_fb2;");//洛阳-甄大海
                                               }
                                           },{
                                               label: 'tiaoyaup7|监牢到书院',
                                               title: "寻人",
                                               id:'tiaoyaup7',
                                               eventOnClick() {
                                                   go2("w;w;s;s;e;e;e;n;n;ask yangzhou_guanjia;n;ask yangzhou_yangzhou17;say 磨石麻粉，分米庶可充饥。");//

                                               }
                                           },{
                                               label: 'tiaoyaup9|四海兑奖',
                                               title: "寻人",
                                               id:'tiaoyaup9',
                                               eventOnClick() {
                                                   go("reclaim recl 10666 go obj_kunlun_pantao");
                                                   go("reclaim recl 150 go obj_yinwuzhujian");
                                                   go("reclaim recl 100 go obj_kongshi_juanxiu");
                                                   go("reclaim buy 5 go 2000");
                                                   go("use_all;home;");

                                               }
                                           },
                                                    ]}
                          ]


var initializeSkillButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < SkillConfigurations.length; i++) {
        let group = SkillConfigurations[i];

        createSubject(group.subject,'canBehiddenSkill');
        createButtons(group.buttons,'canBehiddenSkill');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "章节寻人";
        button.title = "六气阵组合设定";
        button.id = "SkillConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBehiddenSkill").attr("hidden", "true");
                if (ButtonId == "SkillConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBehiddenSkill").removeAttr("hidden");
                if (ButtonId != "SkillConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "SkillConfig";
            }
        });

        document.body.appendChild(button);
    }
}

/**
 * Tu Po Setup
*/
var TupoConfigurations = [
    {
        subject: "shengjin|升级技能",
        buttons: [
            {
                label: 'jinengtupo1|门派技能突破',
                title: '突破技能',
                eventOnClick() {
                    go("enable unmap_all;");
                    go("enable baoyu-lihua;");
                    go("tupo go,baoyu-lihua;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 baoyu-lihua go;");
                    go("enable hamashengong;");
                    go("tupo go,hamashengong;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 hamashengong go;");
                    go("enable lianzhu-fushi;");
                    go("tupo go,lianzhu-fushi;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 lianzhu-fushi go;");
                    go("enable jiuyang-zhisheng;");
                    go("tupo go,jiuyang-zhisheng;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 jiuyang-zhisheng go;");
                    go("enable spring-blade;");
                    go("tupo go,spring-blade;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 spring-blade go;");
                    go("enable hamaquan;");
                    go("tupo go,hamaquan;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 hamaquan go;");
                    go("enable anran-zhang;");
                    go("tupo go,anran-zhang;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 anran-zhang go;");
                    go("enable tulong-blade;");
                    go("tupo go,tulong-blade;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 tulong-blade go;");
                    go("enable bihai-sword;");
                    go("tupo go,bihai-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 bihai-sword go;");
                    go("enable kuihua-shengong;");
                    go("tupo go,kuihua-shengong;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 kuihua-shengong go;");
                    go("enable bihai-sword;");
                    go("tupo go,bihai-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 bihai-sword go;");
                    go("enable qiankun-danuoyi;");
                    go("tupo go,qiankun-danuoyi;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 qiankun-danuoyi go;");
                    go("enable lingboweibu;");
                    go("tupo go,lingboweibu;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 lingboweibu go;");
                    go("enable sevenstar-sword-plus;");
                    go("tupo go,sevenstar-sword-plus;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 sevenstar-sword-plus go;");
                    go("enable yitian-sword;");
                    go("tupo go,yitian-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 yitian-sword go;");
                    go("enable dugu-jiujian;");
                    go("tupo go,dugu-jiujian;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 dugu-jiujian go;");
                    go("enable zhenwu-jian;");
                    go("tupo go,zhenwu-jian;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 zhenwu-jian go;");
                    go("enable king-sword;");
                    go("tupo go,king-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 king-sword go;");
                    go("enable anran-zhang;");
                    go("tupo go,anran-zhang;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 anran-zhang go;");
                    go("enable iron-sword;");
                    go("tupo go,iron-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 iron-sword go;");
                    go("enable xianglong-zhang;");
                    go("tupo go,xianglong-zhang;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 xianglong-zhang go;");
                    go("enable liumai-shenjian;");
                    go("tupo go,liumai-shenjian;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 liumai-shenjian go;");
                    go("enable baoyu-lihua;");
                    go("tupo go,baoyu-lihua;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 baoyu-lihua go;");
                    go("enable wuxiang-jingang-quan;");
                    go("tupo go,wuxiang-jingang-quan;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 wuxiang-jingang-quan go;");
                    go("enable qixing-sword;");
                    go("tupo go,qixing-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 qixing-sword go;");
                    go("enable tao-mieshen-sword;");
                    go("tupo go,tao-mieshen-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 tao-mieshen-sword go;");
                    go("enable pixie-sword;");
                    go("tupo go,pixie-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 pixie-sword go;");
                    go("enable jiuyin-baiguzhao;");
                    go("tupo go,jiuyin-baiguzhao;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 jiuyin-baiguzhao go;");
                    go("enable king-sword;");
                    go("tupo go,king-sword;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 king-sword go;");
                    go("enable jiuyin-blade;");
                    go("tupo go,jiuyin-blade;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 jiuyin-blade go;");
                    go("enable jiuyin;");
                    go("tupo go,jiuyin;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 jiuyin go;");
                    go("enable tianyu-qijian;");
                    go("tupo go,tianyu-qijian;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 tianyu-qijian go;");
                    go("enable tulong-blade;");
                    go("tupo go,tulong-blade;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 tulong-blade go;");
                    go("enable yijinjing;");
                    go("tupo go,yijinjing;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 yijinjing go;");
                    go("enable bahuang-gong;");
                    go("tupo go,bahuang-gong;");
                    for(j=0; j<3; j++)
                        go("event_1_66830905 bahuang-gong go;");

                }
            },{
                label: 'jinengtupo2|奇侠技能突破',
                title: '突破技能',
                eventOnClick() {
                    go("enable unmap_all;");
                    go("enable xtzf;");
                    go("tupo go,xtzf;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 xtzf go;");
                    go("enable binggong-jianfa;");
                    go("tupo go,binggong-jianfa;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 binggong-jianfa go;");
                    go("enable xueyin-blade;");
                    go("tupo go,xueyin-blade;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 xueyin-blade go;");
                    go("enable kongqueling;");
                    go("tupo go,kongqueling;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 kongqueling go;");
                    go("enable zhjyb;");
                    go("tupo go,zhjyb;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 zhjyb go;");
                    go("enable qybsg;");
                    go("tupo go,qybsg;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 qybsg go;");
                    go("enable lybp;");
                    go("tupo go,lybp;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 lybp go;");
                    go("enable hyzf;");
                    go("tupo go,hyzf;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 hyzf go;");
                    go("enable pjgj;");
                    go("tupo go,pjgj;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 pjgj go;");
                    go("enable feidao;");
                    go("tupo go,feidao;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 feidao go;");
                    go("enable fuyu-sword;");
                    go("tupo go,fuyu-sword;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 fuyu-sword go;");
                    go("enable paiyun-zhang;");
                    go("tupo go,paiyun-zhang;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 paiyun-zhang go;");
                    go("enable rulai-zhang;");
                    go("tupo go,rulai-zhang;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 rulai-zhang go;");
                    go("enable hypzf;");
                    go("tupo go,hypzf;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 hypzf go;");
                    go("enable shdcz;");
                    go("tupo go,shdcz;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 shdcz go;");
                    go("enable jiutian-sword;");
                    go("tupo go,jiutian-sword;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 jiutian-sword go;");
                    go("enable fanyun-blade;");
                    go("tupo go,fanyun-blade;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 fanyun-blade go;");
                    go("enable snjls;");
                    go("tupo go,snjls;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 snjls go;");
                    go("enable jxdyq;");
                    go("tupo go,jxdyq;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 jxdyq go;");
                    go("enable yyhuanxubu;");
                    go("tupo go,yyhuanxubu;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 yyhuanxubu go;");
                    go("enable wanliuguiyi;");
                    go("tupo go,wanliuguiyi;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 wanliuguiyi go;");
                    go("enable sszaohuagong;");
                    go("tupo go,sszaohuagong;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 sszaohuagong go;");
                    go("enable dzxinmojing;");
                    go("tupo go,dzxinmojing;");
                    for(j=0; j<4; j++)
                        go("event_1_66830905 dzxinmojing go;");

                }
            },{
                label: 'jinengtupo3|游侠技能突破',
                title: '突破技能',
                eventOnClick() {
                    go("enable unmap_all;");
                    go("enable zixubixiejian;");
                    go("tupo go,zixubixiejian;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 zixubixiejian go;");
                    go("enable liaoyuanbaiji;");
                    go("tupo go,liaoyuanbaiji;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 liaoyuanbaiji go;");
                    go("enable zimulongfenghuan;");
                    go("tupo go,zimulongfenghuan;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 zimulongfenghuan go;");
                    go("enable jiuxingdingxingzhen;");
                    go("tupo go,jiuxingdingxingzhen;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 jiuxingdingxingzhen go;");
                    go("enable youlongjian;");
                    go("tupo go,youlongjian;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 youlongjian go;");
                    go("enable shijianianhuazhi;");
                    go("tupo go,shijianianhuazhi;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 shijianianhuazhi go;");
                    go("enable zuoshoudaofa;");
                    go("tupo go,zuoshoudaofa;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 zuoshoudaofa go;");
                    go("enable zhehuabaishi;");
                    go("tupo go,zhehuabaishi;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 zhehuabaishi go;");
                    go("enable xuanbingbianfa;");
                    go("tupo go,xuanbingbianfa;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 xuanbingbianfa go;");
                    go("enable shenjianhuimang;");
                    go("tupo go,shenjianhuimang;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 shenjianhuimang go;");
                    go("enable tianmomiaowu;");
                    go("tupo go,tianmomiaowu;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 tianmomiaowu go;");
                    go("enable longxiangbanruogong;");
                    go("tupo go,longxiangbanruogong;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 longxiangbanruogong go;");
                    go("enable zixuedafa;");
                    go("tupo go,zixuedafa;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 zixuedafa go;");
                    go("enable yihuajieyudao;");
                    go("tupo go,yihuajieyudao;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 yihuajieyudao go;");
                    go("enable jiuzizhenyanyin;");
                    go("tupo go,jiuzizhenyanyin;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 jiuzizhenyanyin go;");
                    go("enable dagoubangfa;");
                    go("tupo go,dagoubangfa;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 dagoubangfa go;");
                    go("enable feihongbianfa;");
                    go("tupo go,feihongbianfa;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 feihongbianfa go;");
                    go("enable wuxiangliuyangzhang;");
                    go("tupo go,wuxiangliuyangzhang;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 wuxiangliuyangzhang go;");
                    go("enable xiangmozhangfa;");
                    go("tupo go,xiangmozhangfa;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 xiangmozhangfa go;");
                    go("enable yueyeguixiao;");
                    go("tupo go,yueyeguixiao;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 yueyeguixiao go;");
                    go("enable bingyuepomoqiang;");
                    go("tupo go,bingyuepomoqiang;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 bingyuepomoqiang go;");
                    go("enable bufansanjian;");
                    go("tupo go,bufansanjian;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 bufansanjian go;");
                    go("enable tanzhishentong;");
                    go("tupo go,tanzhishentong;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 tanzhishentong go;");
                    go("enable xianglongnianbazhang;");
                    go("tupo go,xianglongnianbazhang;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 xianglongnianbazhang go;");
                    go("enable yunmengguiyue;");
                    go("tupo go,yunmengguiyue;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 yunmengguiyue go;");
                    go("enable baishoutaixuanjing;");
                    go("tupo go,baishoutaixuanjing;");
                    for(j=0; j<24; j++)
                        go("event_1_66830905 baishoutaixuanjing go;");

                }
            },{
                label: 'jinengtupo4|宗师技能突破',
                title: '突破技能',
                eventOnClick() {
                    go("enable unmap_all;");
                    go("enable tianmoce;");
                    go("tupo go,tianmoce;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 tianmoce go;");
                    go("enable tianwaifeixian;");
                    go("tupo go,tianwaifeixian;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 tianwaifeixian go;");
                    go("enable jiuyinni;");
                    go("tupo go,jiuyinni;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 jiuyinni go;");
                    go("enable tiandaobajue;");
                    go("tupo go,tiandaobajue;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 tiandaobajue go;");
                    go("enable xiaolifeidao;");
                    go("tupo go,xiaolifeidao;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 xiaolifeidao go;");
                    go("enable shenlongdonglai;");
                    go("tupo go,shenlongdonglai;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 shenlongdonglai go;");
                    go("enable tayueliuxiang;");
                    go("tupo go,tayueliuxiang;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 tayueliuxiang go;");
                    go("enable changchunbulaogong;");
                    go("tupo go,changchunbulaogong;");
                    for(j=0; j<32; j++)
                        go("event_1_66830905 changchunbulaogong go;");

                }
            },{
                label: 'jinengtupo5|超级宗师突破',
                title: '突破技能',
                eventOnClick() {
                    go("enable unmap_all;");
                    go("enable huotanyidao;");
                    go("tupo go,huotanyidao;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 huotanyidao go;");
                    go("enable wenhoujiwu;");
                    go("tupo go,wenhoujiwu;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 wenhoujiwu go;");
                    go("enable piluoziqi;");
                    go("tupo go,piluoziqi;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 piluoziqi go;");
                    go("enable gufanbianying;");
                    go("tupo go,gufanbianying;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 gufanbianying go;");
                    go("enable wujianzhijian;");
                    go("tupo go,wujianzhijian;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 wujianzhijian go;");
                    go("enable tianleiluo;");
                    go("tupo go,tianleiluo;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 tianleiluo go;");
                    go("enable fengwujiutian;");
                    go("tupo go,fengwujiutian;");
                    for(j=0; j<36; j++)
                        go("event_1_66830905 fengwujiutian go;");

                }
            },{
                label: 'jinengstudy1|侠客邪武学习',
                title: '突破技能',
                eventOnClick() {
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill linyuantu zixubixiejian 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill liruohai liaoyuanbaiji 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill shangguanjinhong zimulongfenghuan 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill liannichang jiuxingdingxingzhen 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill sunen youlongjian 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill jiumozhi shijianianhuazhi 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill fenghan zuoshoudaofa 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill houxibai zhehuabaishi 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill qianluo xuanbingbianfa 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill zhuolingzhao shenjianhuimang 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill wanwan tianmomiaowu 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill jinlunfawang longxiangbanruogong 10;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill ligong zixuedafa 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill huawuque yihuajieyudao 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill xuziling jiuzizhenyanyin 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill hongqigong dagoubangfa 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill hamaya feihongbianfa 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill xuzhu wuxiangliuyangzhang 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill kezhene xiangmozhangfa 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill xuyeyue yueyeguixiao 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill fengxinglie bingyuepomoqiang 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill ningbufan bufansanjian 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill huangyaoshi tanzhishentong 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill qiaofeng xianglongnianbazhang 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill yunmengli yunmengguiyue 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill shipotian baishoutaixuanjing 100;");
                }
            },{
                label: 'jinengstudy2|宗师魔尊学习',
                title: '突破技能',
                eventOnClick() {
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill pangban tianmoce 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill yegucheng tianwaifeixian 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill ouyangfeng jiuyinni 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill songque tiandaobajue 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill lixunhuan xiaolifeidao 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill lingdonglai shenlongdonglai 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill chuliuxiang tayueliuxiang 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill xiaoyaozi changchunbulaogong 100;");
                }
            },{
                label: 'jinengstudy3|超级宗师学习',
                title: '突破技能',
                eventOnClick() {
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill fangzijing huotanyidao 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill hanyi wenhoujiwu 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill wudingyuan piluoziqi 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill luguzhan gufanbianying 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill baiyuntian wujianzhijian 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill shigang tianleiluo 100;");
                    for(j=0; j<9; j++)
                        go("fudi juxian learn_skill gongjiu fengwujiutian 100;");
                }
            },{
                label: 'zidongCSHOU|自动传授',
                title: '自动传授',
                eventOnClick() {
                    go('fudi juxian view wudingyuan');//真龙传人伍定远宗师
                    teachYouxia()
                    go('fudi juxian view fangzijing');//【九州神剑】方子敬魔尊
                    teachYouxia()
                    go('fudi juxian view luguzhan');//【江东孤帆】陆孤瞻魔尊
                    teachYouxia()
                    go('fudi juxian view ouyangfeng');//【西毒】欧阳锋魔尊
                    teachYouxia()
                    go('fudi juxian view pangban');//【魔师】庞斑魔尊
                    teachYouxia()
                    go('fudi juxian view shigang');//【气冲塞北】石刚魔尊
                    teachYouxia()
                    go('fudi juxian view yangsuguan');//【修罗王】杨肃观魔尊
                    teachYouxia()
                    go('fudi juxian view yegucheng');//【白云城主】叶孤城魔尊
                    teachYouxia()
                    go('fudi juxian view hongqigong');//【北丐】洪七公侠客
                    teachYouxia()
                    go('fudi juxian view huangyaoshi');//【东邪】黄药师侠客
                    teachYouxia()
                    go('fudi juxian view huawuque');//【无缺公子】花无缺侠客
                    teachYouxia()
                    go('fudi juxian view kezhene');//【飞天蝙蝠】0柯镇恶侠客
                    teachYouxia()
                    go('fudi juxian view ningbufan');//【九州剑尊】宁不凡侠客
                    teachYouxia()
                    go('fudi juxian view qiaofeng');//【战神】乔峰侠客
                    teachYouxia()
                    go('fudi juxian view shipotian');//【狗杂种】石破天侠客
                    teachYouxia()
                    go('fudi juxian view xuzhu');//【灵鹫宫主】虚竹侠客
                    teachYouxia()
                    go('fudi juxian view yunmengli');//【无影仙子】云梦璃侠客
                    teachYouxia()
                    go('fudi juxian view fenghan');//【左手刀】封寒邪武
                    teachYouxia()
                    go('fudi juxian view houxibai');//【多情公子】侯希白邪武
                    teachYouxia()
                    go('fudi juxian view jinlunfawang');//【蒙古国师】金轮法王邪武
                    teachYouxia()
                    go('fudi juxian view jiumozhi');//【大轮明王】鸠摩智邪武
                    teachYouxia()
                    go('fudi juxian view lianhongshang');//【玉罗刹】练霓裳邪武
                    teachYouxia()
                    go('fudi juxian view ligong');//【血手】厉工邪武
                    teachYouxia()
                    go('fudi juxian view linyuantu');//【禅师】林远图邪武
                    teachYouxia()
                    go('fudi juxian view qianluo');//【阀主】乾罗邪武
                    teachYouxia()
                    go('fudi juxian view shangguanjinhong');//【龙凤环】上官金虹邪武
                    teachYouxia()
                    go('fudi juxian view sunen');//【剑贼】孙恩邪武
                    teachYouxia()
                    go('fudi juxian view wanwan');//【魔女】婠婠邪武
                    teachYouxia()
                    go('fudi juxian view yemo');//【千夜长老】夜魔邪武
                    teachYouxia()
                    go('fudi juxian view zhuolinzhao');//【血剑】卓凌昭邪武
                    teachYouxia()
                    go('fudi juxian view duguqiubai');//【至尊】独孤求败侠客
                    teachYouxia()
                    go('fudi juxian view xuyeyue');//【妙仙子】虚夜月侠客
                    teachYouxia()
                    go('fudi juxian view xuziling');//【陵少】徐子陵侠客
                    teachYouxia()
                    go('fudi juxian view chuliuxiang');//【盗帅】楚留香宗师
                    teachYouxia()
                    go('fudi juxian view hamaya');//【飞红巾】哈玛雅侠客
                    teachYouxia()
                    go('fudi juxian view chengying');//【落花独立】程瑛门客
                    teachYouxia()
                    go('fudi juxian view guoxiang');//【小东邪】郭襄门客
                    teachYouxia()
                    go('fudi juxian view shuisheng');//【在水一方】水笙门客
                    teachYouxia()
                    go('fudi juxian view lixunhua');//【多情公子】李寻欢宗师
                    teachYouxia()
                    go('fudi juxian view xiaoyaozi');//【天山剑尊】逍遥子宗师
                    teachYouxia()

                }
            },


        ]
    },{subject: "JZchuanshou|超级宗师",
       buttons: [
           {label: 'shigangJZ|暗-石刚',title: '传授游侠',id:'石刚',eventOnClick() {go("fudi juxian view shigang;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'luguzhanJZ|鞭-陆孤瞻',title: '传授游侠',id:'陆孤瞻',eventOnClick() {go("fudi juxian view luguzhan;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'waerlaqiJZ|锤-瓦耳拉齐',title: '传授游侠',id:'瓦耳拉齐',eventOnClick() {go("fudi juxian view waerlaqi;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'fangzijingJZ|刀-方子敬',title: '传授游侠',id:'方子敬',eventOnClick() {go("fudi juxian view fangzijing;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'liuxianshengJZ|斧-六先生',title: '传授游侠',id:'六先生',eventOnClick() {go("fudi juxian view liuxiansheng;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'baiyuntianJZ|剑-白云天',title: '传授游侠',id:'白云天',eventOnClick() {go("fudi juxian view baiyuntian;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'hanyiJZ|枪-韩毅',title: '传授游侠',id:'韩毅',eventOnClick() {go("fudi juxian view hanyi;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'gongjiuJZ|轻-宫九',title: '传授游侠',id:'宫九',eventOnClick() {go("fudi juxian view gongjiu;");setTimeout(function(){teachYouxia()},1000)}},
           {label: 'wudingyuanJZ|掌-伍定远',title: '传授游侠',id:'伍定远',eventOnClick() {go("fudi juxian view wudingyuan;");setTimeout(function(){teachYouxia()},1000)}},
       ]},
    {subject: "JZchuanshou|宗师魔尊",
     buttons: [
         {label: 'lixunhuaJZ|暗-李寻欢',title: '传授游侠',id:'李寻欢',eventOnClick() {go("fudi juxian view lixunhua;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'yankuangtuJZ|锤-燕狂徒',title: '传授游侠',id:'燕狂徒',eventOnClick() {go("fudi juxian view yankuangtu;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'songqueJZ|刀-宋缺',title: '传授游侠',id:'宋缺',eventOnClick() {go("fudi juxian view songque;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'yangsuguanJZ|斧-杨肃观',title: '传授游侠',id:'杨肃观',eventOnClick() {go("fudi juxian view yangsuguan;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'yeguchengJZ|剑-叶孤城',title: '传授游侠',id:'叶孤城',eventOnClick() {go("fudi juxian view yegucheng;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'ouyangfengJZ|内-欧阳锋',title: '传授游侠',id:'欧阳锋',eventOnClick() {go("fudi juxian view ouyangfeng;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'xiaoyaoziJZ|内-逍遥子',title: '传授游侠',id:'逍遥子',eventOnClick() {go("fudi juxian view xiaoyaozi;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'lingdonglaiJZ|枪-令东来',title: '传授游侠',id:'令东来',eventOnClick() {go("fudi juxian view lingdonglai;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'chuliuxiangJZ|轻-楚留香',title: '传授游侠',id:'楚留香',eventOnClick() {go("fudi juxian view chuliuxiang;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'pangbanJZ|掌-庞斑',title: '传授游侠',id:'庞斑',eventOnClick() {go("fudi juxian view pangban;");setTimeout(function(){teachYouxia()},1000)}},
     ]},
    {subject: "JZchuanshou|侠客邪武",
     buttons: [
         {label: 'shangguanjinhongJZ|暗-上官金虹',title: '传授游侠',id:'上官金虹',eventOnClick() {go("fudi juxian view shangguanjinhong;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'lianhongshangJZ|暗-练霓裳',title: '传授游侠',id:'练霓裳',eventOnClick() {go("fudi juxian view lianhongshang;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'xuzilingJZ|暗-徐子陵',title: '传授游侠',id:'徐子陵',eventOnClick() {go("fudi juxian view xuziling;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'qianluoJZ|鞭-乾罗',title: '传授游侠',id:'乾罗',eventOnClick() {go("fudi juxian view qianluo;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'hamayaJZ|鞭-哈玛雅',title: '传授游侠',id:'哈玛雅',eventOnClick() {go("fudi juxian view hamaya;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'chengkunJZ|锤-成昆',title: '传授游侠',id:'成昆',eventOnClick() {go("fudi juxian view chengkun;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'luyunJZ|锤-卢云',title: '传授游侠',id:'卢云',eventOnClick() {go("fudi juxian view luyun;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'fenghanJZ|刀-封寒',title: '传授游侠',id:'封寒',eventOnClick() {go("fudi juxian view fenghan;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'huawuqueJZ|刀-花无缺',title: '传授游侠',id:'花无缺',eventOnClick() {go("fudi juxian view huawuque;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'yemoJZ|斧-夜魔',title: '传授游侠',id:'夜魔',eventOnClick() {go("fudi juxian view yemo;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'duguqiubaiJZ|斧-独孤求败',title: '传授游侠',id:'独孤求败',eventOnClick() {go("fudi juxian view duguqiubai;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'xuyeyueJZ|棍-虚夜月',title: '传授游侠',id:'虚夜月',eventOnClick() {go("fudi juxian view xuyeyue;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'hongqigongJZ|棍-洪七公',title: '传授游侠',id:'洪七公',eventOnClick() {go("fudi juxian view hongqigong;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'linyuantuJZ|剑-林远图',title: '传授游侠',id:'林远图',eventOnClick() {go("fudi juxian view linyuantu;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'zhuolinzhaoJZ|剑-卓凌昭',title: '传授游侠',id:'卓凌昭',eventOnClick() {go("fudi juxian view zhuolinzhao;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'sunenJZ|剑-孙恩',title: '传授游侠',id:'孙恩',eventOnClick() {go("fudi juxian view sunen;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'ningbufanJZ|剑-宁不凡',title: '传授游侠',id:'宁不凡',eventOnClick() {go("fudi juxian view ningbufan;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'ligongJZ|内-厉工',title: '传授游侠',id:'厉工',eventOnClick() {go("fudi juxian view ligong;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'jinlunfawangJZ|内-金轮法王',title: '传授游侠',id:'金轮法王',eventOnClick() {go("fudi juxian view jinlunfawang;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'shipotianJZ|内-石破天',title: '传授游侠',id:'石破天',eventOnClick() {go("fudi juxian view shipotian;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'liruohaiJZ|枪-厉若海',title: '传授游侠',id:'厉若海',eventOnClick() {go("fudi juxian view liruohai;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'fengxinglieJZ|枪-风行烈',title: '传授游侠',id:'风行烈',eventOnClick() {go("fudi juxian view fengxinglie;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'wanwanJZ|轻-婠婠',title: '传授游侠',id:'婠婠',eventOnClick() {go("fudi juxian view wanwan;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'yunmengliJZ|轻-云梦璃',title: '传授游侠',id:'云梦璃',eventOnClick() {go("fudi juxian view yunmengli;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'jiumozhiJZ|掌-鸠摩智',title: '传授游侠',id:'鸠摩智',eventOnClick() {go("fudi juxian view jiumozhi;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'houxibaiJZ|掌-侯希白',title: '传授游侠',id:'侯希白',eventOnClick() {go("fudi juxian view houxibai;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'qiaofengJZ|掌-乔峰',title: '传授游侠',id:'乔峰',eventOnClick() {go("fudi juxian view qiaofeng;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'xuzhuJZ|掌-虚竹',title: '传授游侠',id:'虚竹',eventOnClick() {go("fudi juxian view xuzhu;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'huangyaoshiJZ|掌-黄药师',title: '传授游侠',id:'黄药师',eventOnClick() {go("fudi juxian view huangyaoshi;");setTimeout(function(){teachYouxia()},1000)}},
         {label: 'kezheneJZ|杖-柯镇恶',title: '传授游侠',id:'0柯镇恶',eventOnClick() {go("fudi juxian view kezhene;");setTimeout(function(){teachYouxia()},1000)}},
     ]},
]

var initializeTupoButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < TupoConfigurations.length; i++) {
        let group = TupoConfigurations[i];

        createSubject(group.subject,'canBehiddenTupo');
        createButtons(group.buttons,'canBehiddenTupo');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "指定突破";
        button.title = "双加速突破固定技能";
        button.id = "TupoConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBehiddenTupo").attr("hidden", "true");
                if (ButtonId == "TupoConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBehiddenTupo").removeAttr("hidden");
                if (ButtonId != "TupoConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "TupoConfig";
            }
        });

        document.body.appendChild(button);
    }
}

/**
 * ItemUse Bar Setup
*/
var ItemUseConfigurations = [{
    subject: "ItemUse|物品使用",

    buttons: [{
        label: 'jianghuling|吃江湖令',
        title: '吃江湖令',
        eventOnClick() {
            clickButton('items get_store /obj/shop/jianghuling');
            clickButton('items use obj_jianghuling');
            clickButton('items use obj_jianghuling');
            clickButton('items use obj_jianghuling');
            clickButton('items put_store obj_jianghuling');
        }
    },{
        label: 'zhengxieling|吃正邪令',
        title: '吃正邪令',
        eventOnClick() {
            clickButton('items get_store /obj/shop/zhengxieling');
            clickButton('items use obj_zhengxieling');
            clickButton('items use obj_zhengxieling');
            clickButton('items use obj_zhengxieling');
            clickButton('items put_store obj_zhengxieling');
        }
    },{
        label: 'mitiling|吃谜题令',
        title: '吃谜题令',
        eventOnClick() {
            clickButton('items get_store /obj/shop/mitiling');
            clickButton('items use obj_mitiling');
            clickButton('items put_store obj_mitiling');
        }
    },{
        label: 'baojigoumai|购买暴击',
        title: '暴击购买',
        eventOnClick() {
            //clickButton('vip buy_task');
            clickButton('items use miticska')
        }
    },{
        label: 'qutianshen|取天神',
        title: '取出天神宝石',
        eventOnClick() {
            overrideclick('items get_store /obj/baoshi/hongbaoshi8');
            overrideclick('items get_store /obj/baoshi/huangbaoshi8');
            overrideclick('items get_store /obj/baoshi/lanbaoshi8');
            overrideclick('items get_store /obj/baoshi/lvbaoshi8');
            overrideclick('items get_store /obj/baoshi/zishuijing8');

        }
    },{
        label: 'qusuipian1|取碎片',
        title: '取出11、12碎片',
        eventOnClick() {
            overrideclick('items get_store /obj/quest/hat_suipian11');
            overrideclick('items get_store /obj/quest/waist_suipian11');
            overrideclick('items get_store /obj/quest/shield_suipian11');
            overrideclick('items get_store /obj/quest/blade_suipian11');
            overrideclick('items get_store /obj/quest/sword_suipian11');
            overrideclick('items get_store /obj/quest/unarmed_suipian11');
            overrideclick('items get_store /obj/quest/throwing_suipian11');
            overrideclick('items get_store /obj/quest/staff_suipian11');
            overrideclick('items get_store /obj/quest/stick_suipian11');
            overrideclick('items get_store /obj/quest/whip_suipian11');
            overrideclick('items get_store /obj/quest/axe_suipian11');
            overrideclick('items get_store /obj/quest/necklace_suipian11');
            overrideclick('items get_store /obj/quest/hammer_suipian11');
            overrideclick('items get_store /obj/quest/spear_suipian11');
            overrideclick('items get_store /obj/quest/wrists_suipian11');
            overrideclick('items get_store /obj/quest/finger_suipian11');
            overrideclick('items get_store /obj/quest/boots_suipian11');
            overrideclick('items get_store /obj/quest/cloth_suipian11');
            overrideclick('items get_store /obj/quest/armor_suipian11');
            overrideclick('items get_store /obj/quest/dagger_suipian11');
            overrideclick('items get_store /obj/quest/surcoat_suipian11');
            overrideclick('items get_store /obj/quest/hat_suipian12');
            overrideclick('items get_store /obj/quest/waist_suipian12');
            overrideclick('items get_store /obj/quest/shield_suipian12');
            overrideclick('items get_store /obj/quest/blade_suipian12');
            overrideclick('items get_store /obj/quest/sword_suipian12');
            overrideclick('items get_store /obj/quest/unarmed_suipian12');
            overrideclick('items get_store /obj/quest/throwing_suipian12');
            overrideclick('items get_store /obj/quest/staff_suipian12');
            overrideclick('items get_store /obj/quest/stick_suipian12');
            overrideclick('items get_store /obj/quest/whip_suipian12');
            overrideclick('items get_store /obj/quest/axe_suipian12');
            overrideclick('items get_store /obj/quest/necklace_suipian12');
            overrideclick('items get_store /obj/quest/hammer_suipian12');
            overrideclick('items get_store /obj/quest/spear_suipian12');
            overrideclick('items get_store /obj/quest/wrists_suipian12');
            overrideclick('items get_store /obj/quest/finger_suipian12');
            overrideclick('items get_store /obj/quest/boots_suipian12');
            overrideclick('items get_store /obj/quest/cloth_suipian12');
            overrideclick('items get_store /obj/quest/armor_suipian12');
            overrideclick('items get_store /obj/quest/dagger_suipian12');
            overrideclick('items get_store /obj/quest/surcoat_suipian12');
        }
    },{
        label: 'qusuipian2|取一级石头',
        title: '取出一级玉石、宝石',
        eventOnClick() {
            overrideclick('items get_store /obj/yushi/dixisui1');//【帝玺碎】璞玉
            overrideclick('items get_store /obj/yushi/donghaibi1');//【东海碧】璞玉
            overrideclick('items get_store /obj/yushi/jiutianluo1');//【九天落】璞玉
            overrideclick('items get_store /obj/yushi/juzimo1');//【钜子墨】璞玉
            overrideclick('items get_store /obj/yushi/kunlunyin1');//【昆仑印】璞玉
            overrideclick('items get_store /obj/yushi/longtingpo1');//【龙庭魄】璞玉
            overrideclick('items get_store /obj/yushi/xuanyuanlie1');//【轩辕烈】璞玉
            overrideclick('items get_store /obj/baoshi/hongbaoshi1');
            overrideclick('items get_store /obj/baoshi/huangbaoshi1');
            overrideclick('items get_store /obj/baoshi/lanbaoshi1');
            overrideclick('items get_store /obj/baoshi/lvbaoshi1');
            overrideclick('items get_store /obj/baoshi/zishuijing1');

        }
    },{
        label: 'qubaoshi|取宝石',
        title: '取出天神之前的宝石，用于合成',
        eventOnClick() {
            overrideclick('items get_store /obj/baoshi/hongbaoshi1');
            overrideclick('items get_store /obj/baoshi/hongbaoshi2');
            overrideclick('items get_store /obj/baoshi/hongbaoshi3');
            overrideclick('items get_store /obj/baoshi/hongbaoshi4');
            overrideclick('items get_store /obj/baoshi/hongbaoshi5');
            overrideclick('items get_store /obj/baoshi/hongbaoshi6');
            overrideclick('items get_store /obj/baoshi/hongbaoshi7');
            overrideclick('items get_store /obj/baoshi/huangbaoshi1');
            overrideclick('items get_store /obj/baoshi/huangbaoshi2');
            overrideclick('items get_store /obj/baoshi/huangbaoshi3');
            overrideclick('items get_store /obj/baoshi/huangbaoshi4');
            overrideclick('items get_store /obj/baoshi/huangbaoshi5');
            overrideclick('items get_store /obj/baoshi/huangbaoshi6');
            overrideclick('items get_store /obj/baoshi/huangbaoshi7');
            overrideclick('items get_store /obj/baoshi/lanbaoshi1');
            overrideclick('items get_store /obj/baoshi/lanbaoshi2');
            overrideclick('items get_store /obj/baoshi/lanbaoshi3');
            overrideclick('items get_store /obj/baoshi/lanbaoshi4');
            overrideclick('items get_store /obj/baoshi/lanbaoshi5');
            overrideclick('items get_store /obj/baoshi/lanbaoshi6');
            overrideclick('items get_store /obj/baoshi/lanbaoshi7');
            overrideclick('items get_store /obj/baoshi/lvbaoshi1');
            overrideclick('items get_store /obj/baoshi/lvbaoshi2');
            overrideclick('items get_store /obj/baoshi/lvbaoshi3');
            overrideclick('items get_store /obj/baoshi/lvbaoshi4');
            overrideclick('items get_store /obj/baoshi/lvbaoshi5');
            overrideclick('items get_store /obj/baoshi/lvbaoshi6');
            overrideclick('items get_store /obj/baoshi/lvbaoshi7');
            overrideclick('items get_store /obj/baoshi/zishuijing1');
            overrideclick('items get_store /obj/baoshi/zishuijing2');
            overrideclick('items get_store /obj/baoshi/zishuijing3');
            overrideclick('items get_store /obj/baoshi/zishuijing4');
            overrideclick('items get_store /obj/baoshi/zishuijing5');
            overrideclick('items get_store /obj/baoshi/zishuijing6');
            overrideclick('items get_store /obj/baoshi/zishuijing7');


        }
    },{
        label: 'qu玉石|取玉石',
        title: '取出玉石',
        eventOnClick() {
            overrideclick('items get_store /obj/yushi/dixisui1');//【帝玺碎】璞玉
            overrideclick('items get_store /obj/yushi/dixisui2');//【帝玺碎】青玉
            overrideclick('items get_store /obj/yushi/dixisui3');//【帝玺碎】墨玉
            overrideclick('items get_store /obj/yushi/dixisui4');//【帝玺碎】墨玉
            overrideclick('items get_store /obj/yushi/donghaibi1');//【东海碧】璞玉
            overrideclick('items get_store /obj/yushi/donghaibi2');//【东海碧】青玉
            overrideclick('items get_store /obj/yushi/donghaibi3');//【东海碧】墨玉
            overrideclick('items get_store /obj/yushi/donghaibi4');//【东海碧】白玉
            overrideclick('items get_store /obj/yushi/jiutianluo1');//【九天落】璞玉
            overrideclick('items get_store /obj/yushi/jiutianluo2');//【九天落】青玉
            overrideclick('items get_store /obj/yushi/jiutianluo3');//【九天落】墨玉
            overrideclick('items get_store /obj/yushi/jiutianluo4');//【九天落】白玉
            overrideclick('items get_store /obj/yushi/juzimo1');//【钜子墨】璞玉
            overrideclick('items get_store /obj/yushi/juzimo2');//【钜子墨】青玉
            overrideclick('items get_store /obj/yushi/juzimo3');//【钜子墨】墨玉
            overrideclick('items get_store /obj/yushi/juzimo4');//【钜子墨】白玉
            overrideclick('items get_store /obj/yushi/kunlunyin1');//【昆仑印】璞玉
            overrideclick('items get_store /obj/yushi/kunlunyin2');//【昆仑印】青玉
            overrideclick('items get_store /obj/yushi/kunlunyin3');//【昆仑印】墨玉
            overrideclick('items get_store /obj/yushi/kunlunyin4');//【昆仑印】白玉
            overrideclick('items get_store /obj/yushi/longtingpo1');//【龙庭魄】璞玉
            overrideclick('items get_store /obj/yushi/longtingpo2');//【龙庭魄】青玉
            overrideclick('items get_store /obj/yushi/longtingpo3');//【龙庭魄】墨玉
            overrideclick('items get_store /obj/yushi/longtingpo4');//【龙庭魄】白玉
            overrideclick('items get_store /obj/yushi/xuanyuanlie1');//【轩辕烈】璞玉
            overrideclick('items get_store /obj/yushi/xuanyuanlie2');//【轩辕烈】青玉
            overrideclick('items get_store /obj/yushi/xuanyuanlie3');//【轩辕烈】墨玉
            overrideclick('items get_store /obj/yushi/xuanyuanlie4');//【轩辕烈】白玉




        }
    },{
        label: 'canyequchu|取出残页',
        title: '取出残页',
        eventOnClick() {
            overrideclick('items get_store /obj/book/baifashenjiancanye');
            overrideclick('items get_store /obj/book/jiuyinxuanbingjiancanye');
            overrideclick('items get_store /obj/book/tianmoxuejiancanye');
            overrideclick('items get_store /obj/book/xiaoyunlongtengjiancanye');
            overrideclick('items get_store /obj/book/yuenvleihenjiancanye');
            overrideclick('items get_store /obj/book/changshengjianfacanye');
            overrideclick('items get_store /obj/book/zhoutianjianpucanye');
        }
    },{
        label: 'quchumiji|取秘籍',
        title: '取出秘籍',
        eventOnClick() {
            go("items get_store /obj/book/anqishiyongjinjie;");//取出暗器使用进阶
            go("items get_store /obj/book/jibenbianshumiji;");//取出基本鞭术秘籍
            go("items get_store /obj/book/jibenchuifamiji;");//取出基本锤法秘籍
            go("items get_store /obj/book/jibendaofamiji;");//取出基本刀法秘籍
            go("items get_store /obj/book/jibenfufamiji;");//取出基本斧法秘籍
            go("items get_store /obj/book/jibenjianfamiji;");//取出基本剑法秘籍
            go("items get_store /obj/book/jibenqiangfamiji;");//取出基本枪法秘籍
            go("items get_store /obj/book/jichufashumiji;");//取出基础法术秘籍
            go("items get_store /obj/book/neigongxinfamiji;");//取出内功心法秘籍
            go("items get_store /obj/book/pujigedoumiji;");//取出扑击格斗秘籍
            go("items get_store /obj/book/sizhuzhijimiji;");//取出丝竹之技秘籍
            go("items get_store /obj/book/tiebushanmiji;");//取出铁布衫秘籍
            go("items get_store /obj/book/zongyueshanbimiji;");//取出纵跃闪躲秘籍
        }
    },{
        label: 'cunrumiji|存秘籍',
        title: '存秘籍',
        eventOnClick() {
            go("items put_store obj_anqishiyongjinjie;");//放入暗器使用进阶
            go("items put_store obj_jibenbianshumiji;");//放入基本鞭术秘籍
            go("items put_store obj_jibenchuifamiji;");//放入基本锤法秘籍
            go("items put_store obj_jibendaofamiji;");//放入基本刀法秘籍
            go("items put_store obj_jibenfufamiji;");//放入基本斧法秘籍
            go("items put_store obj_jibenjianfamiji;");//放入基本剑法秘籍
            go("items put_store obj_jibenqiangfamiji;");//放入基本枪法秘籍
            go("items put_store obj_jichufashumiji;");//放入基础法术秘籍
            go("items put_store obj_neigongxinfamiji;");//放入内功心法秘籍
            go("items put_store obj_pujigedoumiji;");//放入扑击格斗秘籍
            go("items put_store obj_sizhuzhijimiji;");//放入丝竹之技秘籍
            go("items put_store obj_tiebushanmiji;");//放入铁布衫秘籍
            go("items put_store obj_zongyueshanbimiji;");//放入纵跃闪躲秘籍
        }
    },{label: 'qudanyao|取出丹药',title: '取出全部丹药',eventOnClick() {
        //取出全部丹药
        go("items get_store /obj/med/qnlc2");
        go("items get_store /obj/med/qnzz2");
        go("items get_store /obj/snmf/bingyingxianlu");
        go("items get_store /obj/snmf/cangwudongshen");
        go("items get_store /obj/med/dahuandan");
        go("items info obj_dahaidan4");
        go("items get_store /obj/med/kuangbaodan4");
        go("items get_store /obj/med/qiankundan4");
        go("items get_store /obj/med/dahuandan2");
        go("items get_store /obj/med/kuangbaodan2");
        go("items get_store /obj/med/qiankundan2");
        go("items get_store /obj/med/kuangbaodan");
        go("items get_store /obj/snmf/kunlunhuolian");
        go("items get_store /obj/med/qnlc");
        go("items get_store /obj/snmf/longhuoteng");
        go("items get_store /obj/med/qnlc3");
        go("items get_store /obj/med/qnzz3");
        go("items get_store /obj/med/qiankundan");
        go("items get_store /obj/med/dahuandan3");
        go("items get_store /obj/med/kuangbaodan3");
        go("items get_store /obj/med/qiankundan3");
        go("items get_store /obj/med/qnlc4");
        go("items get_store /obj/med/qnzz4");
        go("items get_store /obj/snmf/xilingchongcao");
        go("items get_store /obj/med/xiaohuandan");
        go("items get_store /obj/med/qnzz");

    }}
              ,{label: 'quchaye|取出茶叶',title: '取出全部茶叶',eventOnClick() {
                  //取出全部茶叶
                  go("items get_store /map/tianlongsi/obj/cangshanlvxue");//苍绿雪
                  go("items get_store /map/tianlongsi/obj/gushudahongpao");//古树大红袍
                  go("items get_store obj_huotuizongzi");//火腿粽子
                  go("items get_store /map/tianlongsi/obj/jinguagongcha1");//金瓜贡茶
                  go("items get_store /map/tianlongsi/obj/junshanyinzhen");//君山银针
                  go("items get_store /map/tianlongsi/obj/lingyunbaihao");//凌云白毫
                  go("items get_store /map/tianlongsi/obj/liuanguapian");//六安瓜片
                  go("items get_store /map/tianlongsi/obj/tieguanyin");//铁观音
                  go("items get_store /map/tianlongsi/obj/wuyiyancha");//武夷岩茶
                  go("items get_store /map/tianlongsi/obj/xihulongjing");//西湖龙井
                  go("items get_store /map/tianlongsi/obj/yunmengxiangzhan");//云梦香盏
                  go("items get_store /map/tianlongsi/obj/zhuyeqing");//竹叶青
              }}
              ,{label: 'quyuhuo|取出鱼获',title: '取出全部鱼获',eventOnClick() {
                  //取出全部鱼获
                  go("items get_store /obj/med/baijinlongyu");//白金龙鱼
                  go("items get_store /map/binghuo/obj/jiyu");//鲫鱼
                  go("items get_store /obj/med/jinlongyu");//金龙鱼
                  go("items get_store /map/tianlongsi/obj/jinli");//锦鲤
                  go("items get_store /obj/med/leilongyu");//雷龙鱼
                  go("items get_store /map/binghuo/obj/liyu");//鲤鱼
                  go("items get_store /obj/med/xuelongyu");//血龙鱼
                  go("items get_store /obj/med/yinlongyu");//银龙鱼
              }},{
                  label: 'qukuangsui|取出矿髓',
                  title: '取矿髓',
                  eventOnClick() {
                      overrideclick('items get_store /obj/shop/baoshikuangks');
                      overrideclick('items get_store /obj/shop/jinkuangks');
                      overrideclick('items get_store /obj/shop/yinkuangks');

                  }
              },{
                  label: 'qulingpai|取出令牌',
                  title: '取令牌',
                  eventOnClick() {
                      overrideclick('items get_store /obj/shop/jianghuling');
                      overrideclick('items get_store /obj/shop/zhengxieling');
                      overrideclick('items get_store /obj/shop/zhuangyuantie');
                      overrideclick('items get_store /obj/shop/mitiling');
                      overrideclick('items get_store /obj/shop/bangpailing');
                      overrideclick('items get_store /obj/shop/shimenling');
                      overrideclick('items get_store /obj/shop/baibaoling');
                  }
              },{
                  label: 'cunlingpai|存令牌',
                  title: '存令牌',
                  eventOnClick() {
                      overrideclick('items put_store obj_jianghuling');
                      overrideclick('items put_store obj_zhengxieling');
                      overrideclick('items put_store obj_zhuangyuantie');
                      overrideclick('items put_store obj_mitiling');
                      overrideclick('items put_store obj_bangpailing');
                      overrideclick('items put_store obj_shimenling');
                      overrideclick('items put_store obj_baibaoling');
                  }
              },{
                  label: 'qugezhonghua|取出各种花',
                  title: '取出各种花，药材',
                  eventOnClick() {
                      go("items get_store /obj/snmf/baiyixuemei;");//百宜雪梅-彩
                      go("items get_store /obj/snmf/baiyixuemei1;");//百宜雪梅-白
                      go("items get_store /obj/snmf/bianhuan;");//彼岸花
                      go("items get_store /obj/snmf/bingyingxianlu;");//冰影仙露
                      go("items get_store /obj/snmf/zhaokaimuluohua;");//朝开暮落花
                      go("items get_store /map/miaojiang/obj/duhupo;");//毒琥珀
                      go("items get_store /map/dali/obj/duqingwa;");//毒青蛙
                      go("items get_store /map/miaojiang/obj/dutengjiao;");//毒藤胶
                      go("items get_store /map/tianlongsi/obj/dujuanhua;");//杜鹃花
                      go("items get_store /obj/snmf/fenghuangmu;");//凤凰木
                      go("items get_store /obj/snmf/junyingcao;");//君影草
                      go("items get_store /obj/snmf/kunlunhuolian;");//昆仑火莲
                      go("items get_store /obj/snmf/lingxiaohua;");//凌霄花
                      go("items get_store /obj/snmf/longhuoteng;");//龙火藤
                      go("items get_store /obj/snmf/shicheju;");//矢车菊
                      go("items get_store /obj/snmf/wanxiangyu;");//晚香玉
                      go("items get_store /obj/snmf/wangyoucao;");//忘忧草
                      go("items get_store /obj/shop/wuyiwei;");//舞鸢尾
                      go("items get_store /obj/snmf/xiwucao;");//夕雾草
                      go("items get_store /obj/snmf/xilingchongcao;");//西陵虫草
                      go("items get_store /obj/snmf/xiankelai;");//仙客来
                      go("items get_store /obj/fight_item/xianlingcao;");//仙灵草
                      go("items get_store /obj/snmf/xueying;");//雪英
                      go("items get_store /obj/snmf/youhaoxianlou;");//优昙仙露

                  }
              },{
                  label: 'cungezhonghua|存出各种花',
                  title: '存出各种花，药材',
                  eventOnClick() {
                      go("items put_store obj_baiyixuemei;");//百宜雪梅-彩
                      go("items put_store obj_baiyixuemei1;");//百宜雪梅-白
                      go("items put_store obj_bianhuan;");//彼岸花
                      go("items put_store obj_bingyingxianlu;");//冰影仙露
                      go("items put_store obj_zhaokaimuluohua;");//朝开暮落花
                      go("items put_store miaojiang_duhupo;");//毒琥珀
                      go("items put_store dali_duqingwa;");//毒青蛙
                      go("items put_store miaojiang_dutengjiao;");//毒藤胶
                      go("items put_store tianlongsi_dujuanhua;");//杜鹃花
                      go("items put_store obj_fenghuangmu;");//凤凰木
                      go("items put_store obj_junyingcao;");//君影草
                      go("items put_store obj_kunlunhuolian;");//昆仑火莲
                      go("items put_store obj_lingxiaohua;");//凌霄花
                      go("items put_store obj_longhuoteng;");//龙火藤
                      go("items put_store obj_shicheju;");//矢车菊
                      go("items put_store obj_wanxiangyu;");//晚香玉
                      go("items put_store obj_wangyoucao;");//忘忧草
                      go("items put_store obj_wuyiwei;");//舞鸢尾
                      go("items put_store obj_xiwucao;");//夕雾草
                      go("items put_store obj_xilingchongcao;");//西陵虫草
                      go("items put_store obj_xiankelai;");//仙客来
                      go("items put_store obj_xianlingcao;");//仙灵草
                      go("items put_store obj_xueying;");//雪英
                      go("items put_store obj_youhaoxianlou;");//优昙仙露

                  }
              },{
                  label: 'xiaotupo|小突破',
                  title: '小突破',
                  eventOnClick() {
                      //overrideclick('shop buy shop38');
                      overrideclick('event_1_67961149');
                  }
              },{
                  label: 'sanshengshi|三生石',
                  title: '三生石',
                  eventOnClick() {
                      clickButton('event_1_66830905');
                  }
              },{
                  label: 'putongtupo|金刚舍利',
                  title: '金刚舍利',
                  eventOnClick() {
                      clickButton('tupo_speedup4_1');
                  }
              },{
                  label: 'gaojitupo|高级突破',
                  title: '高级突破',
                  eventOnClick() {
                      clickButton('tupo_speedup2');
                  }
              },{
                  label: 'chaojitupo|超级突破',
                  title: '超级突破',
                  eventOnClick() {
                      clickButton('tupo_speedup3');
                  }
              },{
                  label: 'tongtianwan|通天丸',
                  title: '通天丸',
                  eventOnClick() {
                      clickButton('tupo_speedup3_1');
                  }
              },{
                  label: 'tongtianwan|火腿粽子',
                  title: '火腿粽子',
                  eventOnClick() {
                      clickButton('items use obj_huotuizongzi');
                  }
              },{
                  label: 'rumaitupo|入脉突破',
                  title: '通天丸，金刚舍利',
                  eventOnClick() {
                      go("enable tianleiluo;tupotry,tianleiluo;tupo go,tianleiluo;tupo_speedup4_1 tianleiluo go;tupo_speedup3_1 tianleiluo go;");
                      go("enable fengwujiutian;tupotry,fengwujiutian;tupo go,fengwujiutian;tupo_speedup4_1 fengwujiutian go;tupo_speedup3_1 fengwujiutian go;");
                      go("enable changchunbulaogong;tupotry,changchunbulaogong;tupo go,changchunbulaogong;tupo_speedup4_1 changchunbulaogong go;tupo_speedup3_1 changchunbulaogong go;");
                  }
              },{
                  label: 'automiaotu|自动秒突',
                  title: '自动秒突',
                  eventOnClick() {
                      clickButton('enable unmap_all')
                      go("enable yihuajieyudao;tupotry,yihuajieyudao;tupo go,yihuajieyudao;tupo_speedup4_1 yihuajieyudao go;tupo_speedup3 yihuajieyudao go;");
                      go("enable zixubixiejian;tupotry,zixubixiejian;tupo go,zixubixiejian;tupo_speedup4_1 zixubixiejian go;tupo_speedup3 zixubixiejian go;");
                      go("enable liaoyuanbaiji;tupotry,liaoyuanbaiji;tupo go,liaoyuanbaiji;tupo_speedup4_1 liaoyuanbaiji go;tupo_speedup3 liaoyuanbaiji go;");
                      go("enable jiuzizhenyanyin;tupotry,jiuzizhenyanyin;tupo go,jiuzizhenyanyin;tupo_speedup4_1 jiuzizhenyanyin go;tupo_speedup3 jiuzizhenyanyin go;");
                      go("enable dagoubangfa;tupotry,dagoubangfa;tupo go,dagoubangfa;tupo_speedup4_1 dagoubangfa go;tupo_speedup3 dagoubangfa go;");
                      go("enable zimulongfenghuan;tupotry,zimulongfenghuan;tupo go,zimulongfenghuan;tupo_speedup4_1 zimulongfenghuan go;tupo_speedup3 zimulongfenghuan go;");
                      go("enable feihongbianfa;tupotry,feihongbianfa;tupo go,feihongbianfa;tupo_speedup4_1 feihongbianfa go;tupo_speedup3 feihongbianfa go;");
                      go("enable wuxiangliuyangzhang;tupotry,wuxiangliuyangzhang;tupo go,wuxiangliuyangzhang;tupo_speedup4_1 wuxiangliuyangzhang go;tupo_speedup3 wuxiangliuyangzhang go;");
                      go("enable xiangmozhangfa;tupotry,xiangmozhangfa;tupo go,xiangmozhangfa;tupo_speedup4_1 xiangmozhangfa go;tupo_speedup3 xiangmozhangfa go;");
                      go("enable shijianianhuazhi;tupotry,shijianianhuazhi;tupo go,shijianianhuazhi;tupo_speedup4_1 shijianianhuazhi go;tupo_speedup3 shijianianhuazhi go;");
                      go("enable yueyeguixiao;tupotry,yueyeguixiao;tupo go,yueyeguixiao;tupo_speedup4_1 yueyeguixiao go;tupo_speedup3 yueyeguixiao go;");
                      go("enable bingyuepomoqiang;tupotry,bingyuepomoqiang;tupo go,bingyuepomoqiang;tupo_speedup4_1 bingyuepomoqiang go;tupo_speedup3 bingyuepomoqiang go;");
                      go("enable bufansanjian;tupotry,bufansanjian;tupo go,bufansanjian;tupo_speedup4_1 bufansanjian go;tupo_speedup3 bufansanjian go;");
                      go("enable zuoshoudaofa;tupotry,zuoshoudaofa;tupo go,zuoshoudaofa;tupo_speedup4_1 zuoshoudaofa go;tupo_speedup3 zuoshoudaofa go;");
                      go("enable zhehuabaishi;tupotry,zhehuabaishi;tupo go,zhehuabaishi;tupo_speedup4_1 zhehuabaishi go;tupo_speedup3 zhehuabaishi go;");
                      go("enable xuanbingbianfa;tupotry,xuanbingbianfa;tupo go,xuanbingbianfa;tupo_speedup4_1 xuanbingbianfa go;tupo_speedup3 xuanbingbianfa go;");
                      go("enable shenjianhuimang;tupotry,shenjianhuimang;tupo go,shenjianhuimang;tupo_speedup4_1 shenjianhuimang go;tupo_speedup3 shenjianhuimang go;");
                      go("enable tanzhishentong;tupotry,tanzhishentong;tupo go,tanzhishentong;tupo_speedup4_1 tanzhishentong go;tupo_speedup3 tanzhishentong go;");
                      go("enable xianglongnianbazhang;tupotry,xianglongnianbazhang;tupo go,xianglongnianbazhang;tupo_speedup4_1 xianglongnianbazhang go;tupo_speedup3 xianglongnianbazhang go;");
                      go("enable yunmengguiyue;tupotry,yunmengguiyue;tupo go,yunmengguiyue;tupo_speedup4_1 yunmengguiyue go;tupo_speedup3 yunmengguiyue go;");
                      go("enable tianmomiaowu;tupotry,tianmomiaowu;tupo go,tianmomiaowu;tupo_speedup4_1 tianmomiaowu go;tupo_speedup3 tianmomiaowu go;");
                      go("enable longxiangbanruogong;tupotry,longxiangbanruogong;tupo go,longxiangbanruogong;tupo_speedup4_1 longxiangbanruogong go;tupo_speedup3 longxiangbanruogong go;");
                      go("enable baishoutaixuanjing;tupotry,baishoutaixuanjing;tupo go,baishoutaixuanjing;tupo_speedup4_1 baishoutaixuanjing go;tupo_speedup3 baishoutaixuanjing go;");
                      go("enable tianwaifeixian;tupotry,tianwaifeixian;tupo go,tianwaifeixian;tupo_speedup4_1 tianwaifeixian go;tupo_speedup3 tianwaifeixian go;");
                      go("enable tianmoce;tupotry,tianmoce;tupo go,tianmoce;tupo_speedup4_1 tianmoce go;tupo_speedup3 tianmoce go;");
                      go("enable zixuedafa;tupotry,zixuedafa;tupo go,zixuedafa;tupo_speedup4_1 zixuedafa go;tupo_speedup3 zixuedafa go;");
                      go("enable jiuxingdingxingzhen;tupotry,jiuxingdingxingzhen;tupo go,jiuxingdingxingzhen;tupo_speedup4_1 jiuxingdingxingzhen go;tupo_speedup3 jiuxingdingxingzhen go;");
                      go("enable youlongjian;tupotry,youlongjian;tupo go,youlongjian;tupo_speedup4_1 youlongjian go;tupo_speedup3 youlongjian go;");
                      go("enable xiaolifeidao;tupotry,xiaolifeidao;tupo go,xiaolifeidao;tupo_speedup4_1 xiaolifeidao go;tupo_speedup3 xiaolifeidao go;");
                      go("enable shenlongdonglai;tupotry,shenlongdonglai;tupo go,shenlongdonglai;tupo_speedup4_1 shenlongdonglai go;tupo_speedup3 shenlongdonglai go;");
                      go("enable tayueliuxiang;tupotry,tayueliuxiang;tupo go,tayueliuxiang;tupo_speedup4_1 tayueliuxiang go;tupo_speedup3 tayueliuxiang go;");
                      go("enable piluoziqi;tupotry,piluoziqi;tupo go,piluoziqi;tupo_speedup4_1 piluoziqi go;tupo_speedup3 piluoziqi go;");
                      go("enable mapped_skills restore go 1");
                  }
              }, /*{
		label: 'depClearBag|深度清理',
		title: '深度清理背包，售卖零散物品',
	 eventOnClick() {
			items_clear = 0;
			clearBag(0)
		}
	},*/{
        label: 'ClearBag|清理背包',
        title: '清理背包，不卖物品',
        eventOnClick() {
            items_clear = 1;
            clearBag(0)

        }
    },
              {
                  label: 'hecheng|一键合成',
                  title: '一键合成，请先将要合成的碎片从仓库中取出',
                  eventOnClick() {
                      if(confirm('请先将要合成的碎片从仓库中取出，可以合成宝石和玉石，是否立即合成？')){
                          clearBag(1)
                      }
                  }
              },{
                  label: 'xiangzi|开箱子',
                  title: '批量开箱子',
                  eventOnClick() {
                      useItems.start()
                  }
              }
              ,{
                  label: 'shoutao|王母寿桃',
                  title: '吃寿桃',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }

                      for(j=0; j<n; j++)
                          go("items use obj_wangmushoutao");
                  }
              },{
                  label: 'jinsi|金丝袋N次',
                  title: '金丝袋N次',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }

                      for(j=0; j<n; j++)
                          go("items use obj_jinsijindai");
                  }
              },{
                  label: 'yinsi|银丝袋N次',
                  title: '银丝袋N次',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }

                      for(j=0; j<n; j++)
                          go("items use obj_yinsijindai");
                  }
              },{
                  label: 'jinengshu|技能书N百次',
                  title: '使用技能书N百次',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }

                      for(j=0; j<n; j++)
                          go("items use obj_jinengshu_N_100");
                  }
              },{
                  label: 'jinengshu|技能书N千次',
                  title: '使用技能书N千次',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }

                      for(j=0; j<n; j++)
                          go("items use obj_jinengshu_N_1000");
                  }
              },{
                  label: 'jinengshu|清杀气一百',
                  title: '清杀气一百',
                  eventOnClick() {

                      go("jh 1;e;e;e;event_1_2912009");
                  }
              },{
                  label: 'jinengshu|清杀气一千',
                  title: '清杀气一千',
                  eventOnClick() {

                      go("jh 1;e;e;event_1_42553559");
                  }
              },{
                  label: 'jinengshu|清杀气一万',
                  title: '清杀气一万',
                  eventOnClick() {

                      go("jh 1;e;e;event_1_75058126");
                  }
              },{
                  label: 'bangling|帮派令',
                  title: '帮派令',
                  eventOnClick() {

                      go("items use obj_bangpailing;items use obj_bangpailing;");
                      for(j=0; j<60; j++)
                          go("vip finish_clan");
                  }
              },{
                  label: 'shiling|师门令',
                  title: '师门令',
                  eventOnClick() {

                      go("items use obj_shimenling;items use obj_shimenling;items use obj_shimenling;");
                      for(j=0; j<100; j++)
                          go("vip finish_family");

                  }
              },{
                  label: 'qubaoxiang|取宝箱',
                  title: '取宝箱',
                  eventOnClick() {

                      go("items get_store /obj/shop/box3");//铂金宝箱
                      go("items get_store /obj/shop/bojin_key");//铂金钥匙
                      go("items get_store /obj/shop/box2");//黄金宝箱
                      go("items get_store /obj/shop/huangjin_key");//黄金钥匙
                      go("items get_store /obj/shop/qingmubaoxiang");//青木
                      go("items get_store /obj/shop/yaoyubaoxiang");//曜玉宝箱
                      go("items get_store /obj/shop/yaoyuyaoshi");//曜玉钥匙
                      go("items get_store /obj/shop/box1");//白银宝箱

                  }
              },{
                  label: 'kaibaiyin|开白银',
                  title: '开白银',
                  eventOnClick() {

                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }
                      for(j=0; j<Math.floor(n/1000000); j++)
                          go("items use baiyin box_N_1000000");
                      n = n%1000000+Math.floor(n/1000000)*200000;
                      for(j=0; j<Math.floor(n/100000); j++)
                          go("items use baiyin box_N_100000");
                      n = n%100000+Math.floor(n/100000)*20000;
                      for(j=0; j<Math.floor(n/10000); j++)
                          go("items use baiyin box_N_10000");
                      n = n%10000+Math.floor(n/10000)*2000;
                      for(j=0; j<Math.floor(n/1000); j++)
                          go("items use baiyin box_N_1000");
                      n = n%1000+Math.floor(n/1000)*200;
                      for(j=0; j<Math.floor(n/100); j++)
                          go("items use baiyin box_N_100");
                      n = n%100+Math.floor(n/100)*20;
                      for(j=0; j<Math.floor(n/50); j++)
                          go("items use baiyin box_N_50");
                      n = n%50+Math.floor(n/50)*10;
                      for(j=0; j<Math.floor(n/10); j++)
                          go("items use baiyin box_N_10");


                  }
              },{
                  label: 'kaiqingmu|开青木',
                  title: '开青木',
                  eventOnClick() {

                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      if (!n) {
                          return;
                      }

                      for(j=0; j<(n/1000000); j++)
                          go("items use obj_qingmubaoxiang_N_1000000");
                      n = n%1000000;
                      for(j=0; j<(n/100000); j++)
                          go("items use obj_qingmubaoxiang_N_100000");
                      n = n%100000;
                      for(j=0; j<(n/10000); j++)
                          go("items use obj_qingmubaoxiang_N_10000");
                      n = n%10000;
                      for(j=0; j<(n/1000); j++)
                          go("items use obj_qingmubaoxiang_N_1000");
                      n = n%1000;
                      for(j=0; j<(n/100); j++)
                          go("items use obj_qingmubaoxiang_N_100");
                      n = n%100;
                      for(j=0; j<(n/10); j++)
                          go("items use obj_qingmubaoxiang_N_10");
                      n = n%10;
                      for(j=0; j<n; j++)
                          go("items use obj_qingmubaoxiang");

                  }
              },{
                  label: 'chizhuha|吃朱蛤',
                  title: '吃朱蛤',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      for(j=0; j<n; j++)
                          go("items use obj_mangmuzhuha");

                  }
              },{
                  label: 'shuabaoji|刷暴击次数',
                  title: '刷暴击次数',
                  eventOnClick() {

                      for(i=0;i<21;i++)
                          go2("items use obj_mitiling");
                      go2("#15 vip finish_big_task;");
                      for(b=0; b<7; b++)
                          go2("#15 vip buy_task;#15 vip finish_big_task;");
                      setTimeout(Infor_OutFunc("暴击已完成"),1000*60);

                  }
              },{
                  label: 'lihea|钓鱼礼盒',
                  title: '钓鱼礼盒',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      for(j=0; j<n; j++)
                          go("items use obj_chuidiaoyixialihe");

                  }
              },{
                  label: 'liheb|暴击礼盒',
                  title: '暴击礼盒',
                  eventOnClick() {
                      let n=prompt("请输入打开次数：","");
                      n=Number(n)
                      for(j=0; j<n; j++)
                          go("items use obj_baojimiti_baohe");

                  }
              },{
                  label: 'huanshangquan1|蟠桃换商券',
                  title: '蟠桃换商券',
                  eventOnClick() {

                      let n=prompt("请输入蟠桃数量：","");
                      n=Number(n)
                      if(n>750000){
                          for(j=0; j<Math.floor(n/750000); j++)
                              go("reclaim recl 50000 go obj_kunlun_pantao");
                          n=n%750000
                          for(j=0; j<Math.floor(n/150000); j++)
                              go("reclaim recl 10000  go obj_kunlun_pantao");
                          n=n%150000
                          for(j=0; j<Math.floor(n/15000); j++)
                              go("reclaim recl 1000 go obj_kunlun_pantao");

                      }
                      else{
                          for(j=0; j<Math.floor(n/150000); j++)
                              go("reclaim recl 10000 go obj_kunlun_pantao");
                          n=n%150000
                          for(j=0; j<Math.floor(n/15000); j++)
                              go("reclaim recl 1000 go obj_kunlun_pantao");
                      }

                  }
              },{
                  label: 'huanshangquan2|朱果换商券',
                  title: '朱果换商券',
                  eventOnClick() {

                      let n=prompt("请输入朱果数量：","");
                      n=Number(n)
                      if(n>7500000){
                          for(j=0; j<Math.floor(n/7500000); j++)
                              go("reclaim recl 50000 go zhu guo");
                          n=n%7500000
                          for(j=0; j<Math.floor(n/1500000); j++)
                              go("reclaim recl 10000 go zhu guo");
                          n=n%1500000
                          for(j=0; j<Math.floor(n/15000); j++)
                              go("reclaim recl 1000 go zhu guo");

                      }
                      else{
                          for(j=0; j<Math.floor(n/1500000); j++)
                              go("reclaim recl 10000 go zhu guo");
                          n=n%1500000
                          for(j=0; j<Math.floor(n/150000); j++)
                              go("reclaim recl 1000 go zhu guo");
                      }

                  }
              },{
                  label: 'huanshangquan3|商券换朱果',
                  title: '全部商券换朱果',
                  eventOnClick() {

                      let n=prompt("请输入商券数量：","");
                      n=Number(n)
                      let m=Math.floor(n/500000)
                      for(let j=0; j<m; j++)
                      {go("reclaim buy 5 go 50000");
                      }
                      m=(n/500000)/10;
                      cmdCache.push('reclaim buy 5 go '+m)

                  }

              } ,{
                  label: 'huanshangquan4|啃完朱果',
                  title: '吃全部朱果',
                  eventOnClick() {

                      go("use_all");


                  }

              } ,{
                  label: 'huinei1|吃万年',
                  title: '吃万年灵芝会内力',
                  eventOnClick() {
                      for(j=0; j<5; j++)
                          go("items use snow_wannianlingzhi");
                      for(j=0; j<5; j++)
                          go("items use tianlongsi_sanqingwan");
                  }

              },{
                  label: 'chiyuebing|吃月饼',
                  title: '吃全部月饼',
                  eventOnClick() {
                      var a,b,c,d,e;
                      let n=prompt("请输入数量： \n例如： \n[例1] 单个总量：100 \n[例1]:豆沙|奶油|冰啤|冰淇淋|茶叶：100,100,100,100,100 \n","100,100,100,100,100");
                       if(!n) return
                      let nn=n.split(',');
                      if(nn.length>4){
                          a=nn[0];b=nn[1];c=nn[2];d=nn[3];e=nn[4];
                      }
                      else
                      {a=nn[0];b=nn[0];c=nn[0];d=nn[0];e=nn[0];}
                      for(j=0; j<a; j++)
                          go2("items use obj_doushashyuebing;");
                      for(j=0; j<b; j++)
                          go2("items use obj_naiyouyuebing;");
                      for(j=0; j<c; j++)
                          go2("items use obj_bingpiyuebing;");
                      for(j=0; j<d; j++)
                          go2("items use obj_bingjilingyuebing;");
                      for(j=0; j<e; j++)
                          go2("items use obj_chayeyuebing;");
                  }
              },{
                  label: 'chilizhi|吃荔枝',
                  title: '吃全部荔枝',
                  eventOnClick() {
                      var a,b,c,d,e;
                      let n=prompt("请输入数量： \n例如： \n[例1] 单个总量：100 \n[例1]:妃子笑|白糖罂|三月红|桂味|糯米糍：100,100,100,100,100 \n","100,100,100,100,100");
                       if(!n) return
                      let nn=n.split(',');
                      if(nn.length>4){
                          a=nn[0];b=nn[1];c=nn[2];d=nn[3];e=nn[4];
                      }
                      else
                      {a=nn[0];b=nn[0];c=nn[0];d=nn[0];e=nn[0];}
                      for(j=0; j<a; j++)
                          go2("items use obj_feizixiaolizhi;");
                      for(j=0; j<b; j++)
                          go2("items use obj_baitangyinglizhi;");
                      for(j=0; j<c; j++)
                          go2("items use obj_sanyuehonglizhi;");
                      for(j=0; j<d; j++)
                          go2("items use obj_guiwei;");
                      for(j=0; j<e; j++)
                          go2("items use obj_nuomicilizhi;");
                  }
              },
              {
                  label: 'chitangyuan|吃汤圆',
                  title: '吃全部汤圆',
                  eventOnClick() {
                      var a,b,c,d,e;
                      let n=prompt("请输入数量： \n例如： \n[例1] 单个总量：100 \n[例1]:红豆|酒酿|奇异果|芝麻|汤圆：100,100,100,100,100 \n","100,100,100,100,100");
                      if(!n) return
                      let nn=n.split(',');
                      if(nn.length>4){
                          a=nn[0];b=nn[1];c=nn[2];d=nn[3];e=nn[4];
                      }
                      else
                      {a=nn[0];b=nn[0];c=nn[0];d=nn[0];e=nn[0];}
                      for(j=0; j<a; j++)
                          go2("items use obj_hongdoutangyuan;");
                      for(j=0; j<b; j++)
                          go2("items use obj_jiuniangtangyuan;");
                      for(j=0; j<c; j++)
                          go2("items use obj_qiyiguotangyuan;");
                      for(j=0; j<d; j++)
                          go2("items use obj_zhimatangyuan;");
                      for(j=0; j<e; j++)
                          go2("items use tang yuan;");
                  }
              },
              {
                  label: 'quyuebing|取月饼',
                  title: '吃全部月饼',
                  eventOnClick() {
                      go2("items get_store /obj/shop/chayeyuebing;items get_store /obj/shop/bingjilingyuebing;items get_store /obj/shop/bingpiyuebing;items get_store /obj/shop/naiyouyuebing;items get_store /obj/shop/doushashyuebing;");
                  }

              },
              {
                  label: 'quyuhuo|取出荔枝',
                  title: '取出全部荔枝',
                  eventOnClick() {
                      //取出全部荔枝
                      go("items get_store /obj/med/feizixiaolizhi;items get_store /obj/med/baitangyinglizhi;items get_store /obj/med/sanyuehonglizhi;items get_store /obj/med/guiwei;items get_store /obj/med/nuomicilizhi;");

                  }},
              {
                  label: 'qutangyuan|取出汤圆',
                  title: '取出全部汤圆',
                  eventOnClick() {
                      //取出全部汤圆
                      go2("items get_store /obj/shop/hongdoutangyuan;items get_store /obj/shop/jiuniangtangyuan;items get_store /obj/shop/qiyiguotangyuan;items get_store /obj/med/tangyuan;items get_store /obj/shop/zhimatangyuan;");
                  }},
              {
                  label: 'buykedao|买刻刀',
                  title: '买刻刀',
                  eventOnClick() {
                      let n=prompt("请输入数量：","");
                      n=Number(n)
                      go("jh 1;e;n;n;w;");
                      for(j=0; j<Math.floor(n/10); j++)
                          go("event_1_58404606");
                      for(j=0; j<(n%10); j++)
                          go("event_1_73534133");
                      go("home");


                  }

              },{
                  label: 'jiamingwang|江山图',
                  title: '名望加50%',
                  eventOnClick() {
                      go2("items use obj_qianlitu;");
                  }
              },{
                  label: 'eatyao|吃药',
                  title: '名望加50%',
                  eventOnClick() {

                  }
              },{
                  label: 'JNcailiao1|金身诀材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/neigongxinfamiji");//内功秘籍
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/jiuyinxuanbingjiancanye");//九阴玄冰剑残页
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/huangbaoshi8");//天神黄宝石
                  }
              },{
                  label: 'JNcailiao2|龙爪手材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/pujigedoumiji");//扑击格斗秘籍
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/tianshanfeijiancanye");//天山飞剑残页
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/lanbaoshi8");//天神蓝宝石
                  }
              },{
                  label: 'JNcailiao3|湿魂剑材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/jibenjianfamiji");//基本剑法秘籍
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/baifashenjiancanye");//白发神剑残页
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/zishuijing8");//天神紫宝石
                  }
              },{
                  label: 'JNcailiao4|强身术材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/neigongxinfamiji");//内功秘籍
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/xiaoyunlongtengjiancanye");//霄云龙腾剑残页
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/hongbaoshi8");//天神红宝石
                  }
              },{
                  label: 'JNcailiao5|破海棍材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/pujigedoumiji");//基本棍
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/changshengjianfacanye");//长生剑法残页
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/lvbaoshi8");//天神绿宝石
                  }
              },{
                  label: 'JNcailiao6|渡厄杖材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/pujigedoumiji");//基本杖
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/zhoutianjianpucanye");//周天剑谱残页
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/lanbaoshi8");//天神蓝宝石
                  }
              },{
                  label: 'JNcailiao7|轻灵鞭材料',
                  title: '材料',
                  eventOnClick() {
                      go("items get_store /obj/book/jibenbianshumiji;");//基本鞭
                      go("items get_store /obj/shop/jiuzhuanshendan");//九转神丹
                      go("items get_store /obj/book/tianmoxuejiancanye;");//
                      go("items get_store /obj/shop/wulingchangye");//武林至高绝学残页
                      go("items get_store /obj/baoshi/hongbaoshi8");//天神红宝石
                      go("items get_store /map/tianlongsi/obj/xiedisheli;");//邪帝
                  }
              },{
                  label: 'bagnum|背包排序',
                  title: '背包排序',
                  eventOnClick() {
                          eval("javascript:gSocketMsg2.show_items(1)");
                  }
              },{
                  label: 'bagnum|吃悬红',
                  title: '吃悬红令',
                  eventOnClick() {
                      go2("items use obj_xuankongling;jh 1;w;event_1_40923067;");
                  }
              },{
                  label: 'bagnum|买悬红',
                  title: '买100悬红令',
                  eventOnClick() {
                      go2('home;#10 shop buy shop30_N_10;');
                  }
              },{
                  label: 'bagnum|元宝取消悬红',
                  title: '元宝取消悬红',
                  eventOnClick() {
                      go2("jh 1;w;event_1_72202956 go;event_1_40923067;");
                  }
              }




             ]
}]

//秒突
function automiaotuFunc(){
    //剑法
    tupo('bufansanjian')		//不凡三剑
    tupo('youlongjian')			//游龙剑
    tupo('zixubixiejian')		//紫虚剑
    tupo('shenjianhuimang')		//神剑慧芒
    tupo('tianwaifeixian')		//天外飞仙
    tupo('wujianzhijian')		//无剑之剑

    //刀法
    tupo('yihuajieyudao')		//移花接玉刀
    tupo('zuoshoudaofa')		//左手刀
    tupo('tiandaobajue')		//天刀八诀
    tupo('huotanyidao')			//火贪一刀

    //暗器
    tupo('jiuzizhenyanyin')		//九字真言印
    tupo('zimulongfenghuan')	//子母龙凤环
    tupo('jiuxingdingxingzhen')	//九星定形针
    tupo('xiaolifeidao')		//小李飞刀
    tupo('tianleiluo')			//天雷落

    //杖法
    tupo('xiangmozhangfa')		//降魔杖法

    //鞭法
    tupo('feihongbianfa')		//飞鸿鞭法
    tupo('xuanbingbianfa')		//冰玄鞭法
    tupo('gufanbianying')		//孤帆鞭影
    tupo('riyuebianfa')			//日月鞭法

    //棍法
    tupo('dagoubangfa')			//打狗棒法
    tupo('yueyeguixiao')		//月夜鬼萧
    tupo('chaotianyigun')		//朝天一棍
    tupo('jiuyougunmo')			//九幽棍魔

    //轻功
    tupo('yunmengguiyue')		//云梦归月
    tupo('tianmomiaowu')		//天魔妙舞
    tupo('tayueliuxiang')		//踏月留香
    tupo('fengwujiutian')		//凤舞九天
    tupo('tianmochang')			//天魔场

    //掌法
    tupo('tanzhishentong')		//弹指神通
    tupo('xianglongnianbazhang')//降龙二十八
    tupo('zhehuabaishi')		//折花百式
    tupo('wuxiangliuyangzhang')	//无相六阳掌
    tupo('shijianianhuazhi')	//释迦拈花指
    tupo('tianmoce')			//天魔策
    tupo('piluoziqi')			//披罗紫气
    tupo('tianmofenshen')		//天魔焚身


    //枪法
    tupo('liaoyuanbaiji')		//燎原百击
    tupo('bingyuepomoqiang')	//冰月破魔枪
    tupo('shenlongdonglai')		//神龙东来
    tupo('wenhoujiwu')			//温候戟舞

    //锤法
    tupo('zhengdaoshiqi')		//正道十七
    tupo('huanyinzhichui')		//幻阴指锤
    tupo('yushijufen')			//玉石俱焚
    tupo('wushuanglianchui')	//无双连锤

    //内功
    tupo('baishoutaixuanjing')	//白首太玄经
    tupo('zixuedafa')			//紫血大法
    tupo('longxiangbanruogong')	//龙象般若功
    tupo('jiuyinni')			//九阴逆
    tupo('changchunbulaogong')	//长春不老功
}


var initializeItemUseButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < ItemUseConfigurations.length; i++) {
        let group = ItemUseConfigurations[i];

        createSubject(group.subject,'canBeHiddenItemUse');
        createButtons(group.buttons,'canBeHiddenItemUse');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "物品使用";
        button.title = "可以来回切换";
        button.id = "ItemUseConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenItemUse").attr("hidden", "true");
                if (ButtonId == "ItemUseConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenItemUse").removeAttr("hidden");
                if (ButtonId != "ItemUseConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "ItemUseConfig";
            }
        });

        document.body.appendChild(button);
    }
}

/**
 * Yuanbao Bar Setup
*/
var YuanbaoConfigurations = [{
    subject: "Yuanbao|元宝日常",

    buttons: [{
        label: 'huajiegongji|花街攻击',
        title: '花街攻击',
        eventOnClick() {
            go('jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n;event_1_5392021 go');
        }

    },{
        label: 'huajieneili|花街内力',
        title: '花街内力',
        eventOnClick() {
            go('jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s;event_1_29896809 go');
        }

    },{
        label: 'yangzhouwumiao|扬州武庙',
        title: '扬州武庙',
        eventOnClick() {
            overrideclick("shop buy shop39");
            go('jh 5;n;n;n;n;n;n;w;event_1_69751810;');
            overrideclick("event_1_43899943 go 4");
            overrideclick("home");
        }
    },{
        label: 'kuangshanwakuang|矿山挖矿',
        title: '矿山挖矿',
        eventOnClick() {
            go('jh 2;n;n;n;n;n;n;n;n;n;n;w;w;');
            overrideclick("event_1_85329567");
            overrideclick("event_1_42250469");
            overrideclick("event_1_48689119");
            overrideclick("w");
            overrideclick("w");
            overrideclick("event_1_22034949");
            for (i=0; i<5; i++){
                overrideclick('event_1_40548659');
            }
            overrideclick("event_1_83697921");
            for (i=0; i<5; i++){
                overrideclick('event_1_64388826');
            }
        }
    },{
        label: 'tianzikuang|天矿N次',
        title: '天矿N次',
        eventOnClick() {
            let n=prompt("请输入挖矿次数：","");
            n=Number(n)
            if (!n) {
                return;
            }

            for(j=0; j<n; j++)
                go3("event_1_7898524;#5 event_1_22920188");
        }
    },{
        label: 'dikuang|地矿N次',
        title: '地矿N次',
        eventOnClick() {
            let n=prompt("请输入挖矿次数：","");
            n=Number(n)
            if (!n) {
                return;
            }
            for(j=0; j<n; j++)
                go3("event_1_39762344,#5 event_1_64388826");
        }
    },{
        label: 'licai|自动理财',
        title: '自动理财',
        eventOnClick() {
            go('jh 2;n;n;n;n;n;n;n;e');
            overrideclick('client_prompt touzi_jihua2 buy 6');
            overrideclick('touzi_jihua2 buy 6', 1);
            overrideclick('touzi_jihua2 buygo go6');
            overrideclick('tzjh_lq');
            go('home');
        }
    },{
        label: 'xiangzi|开箱子',
        title: '批量开箱子',
        eventOnClick() {
            useItems.start()
        }
    },
             ]
}]

var initializeYuanbaoButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < YuanbaoConfigurations.length; i++) {
        let group = YuanbaoConfigurations[i];

        createSubject(group.subject,'canBeHiddenYuanbao');
        createButtons(group.buttons,'canBeHiddenYuanbao');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "元宝日常";
        button.title = "可以来回切换";
        button.id = "YuanbaoConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 25;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenYuanbao").attr("hidden", "true");
                if (ButtonId == "YuanbaoConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenYuanbao").removeAttr("hidden");
                if (ButtonId != "YuanbaoConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "YuanbaoConfig";
            }
        });

        document.body.appendChild(button);
    }
}

/**
 * autofuben Bar Setup
*/
var autofubenConfigurations = [{
    subject: "autofuben|自动副本",

    buttons: [{
        label: 'kuaben1|跨1自动',
        title: "自动跨1小怪",
        id : "kuaben1",

        eventOnClick() {
            kuaben1();
        }
    },{
        label: 'kuaben2|跨2自动',
        title: "自动跨2小怪",
        id : "kuaben2",

        eventOnClick() {
            kuaben2();
        }
    }, {
        label: 'kuaben3|跨3自动',
        title: "自动跨3小怪",
        id : "kuaben3",

        eventOnClick() {
            kuaben3();
        }
    },{
        label: 'youming9|前院自动',
        title: "自动前院小怪",
        id : "youming9",

        eventOnClick() {
            youming9();
        }
    },{
        label: 'youming10|花园自动',
        title: "自动花园",
        id : "youming10",
        eventOnClick() {
            youming10();
        }
    },{
        label: 'youming11|后院自动',
        title: "自动后院小怪",
        id : "youming11",

        eventOnClick() {
            youming11();
        }
    },{
        label: 'ben9|本9自动',
        title: "本9自动",

        eventOnClick() {
            ben9();
        }
    },{
        label: 'ben10|本10自动',
        title: "本10自动",

        eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                teamjob.nextjob = function(){}
                teamjob.go(6);
            }else{
                clearTrigger();
            }
        }
    },{
        label: 'baiyuan|挑战白猿',
        title: "挑战白猿",

        eventOnClick() {
            teamjob.nextjob = function(){}
            teamjob.go(2);
        }
    },{
        label: 'tiejian|铁剑山庄',
        title: "铁剑山庄",
        eventOnClick() {
            teamjob.nextjob = function(){}
            teamjob.go(1);
        }
    },{
        label: 'jianlou|剑楼9',
        title: "剑楼9层",
        eventOnClick() {
            teamjob.nextjob = function(){}
            teamjob.go(5);
        }
    },{
        label: 'tuanjian|团建',
        title: "白猿、铁剑、本9、后院",

        eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                tuanjian();
            }else{
                clearTrigger();
            }

        }
    },
              {label: 'gofb1|进副本1',title: "大",eventOnClick() {go2("fb 1");}},
              {label: 'gofb2|进副本2',title: "大",eventOnClick() {go2("fb 2");}},
              {label: 'gofb3|进副本3',title: "大",eventOnClick() {go2("fb 3");}},
              {label: 'gofb4|进副本4',title: "大",eventOnClick() {go2("fb 4");}},
              {label: 'gofb5|进副本5',title: "大",eventOnClick() {go2("fb 5");}},
              {label: 'gofb6|进副本6',title: "大",eventOnClick() {go2("fb 6");}},
              {label: 'gofb7|进副本7',title: "大",eventOnClick() {go2("fb 7");}},
              {label: 'gofb8|进副本8',title: "大",eventOnClick() {go2("fb 8");}},
              {label: 'gofb9|进副本9',title: "大",eventOnClick() {go2("fb 9");}},
              {label: 'gofb10|进副本10',title: "大",eventOnClick() {go2("fb 10");}},
              {label: 'gofb11|进副本11',title: "大",eventOnClick() {go2("fb 11");}},
              {label: 'gofb12|进副本12',title: "大",eventOnClick() {go2("fb 12;event_1_14070916;team quit;home;");}},
              // {label: 'gofb13|进副本13',title: "大",eventOnClick() {go2("");}},
              {label: 'DSfbnews|副本飞机',
               title: '十分钟发送一次飞机的队伍',
               id:'zdfeiji',
               eventOnClick() {
                   if (ButtonManager.toggleButtonEvent(this)){
                       fbnews()
                   }else{
                       clearInterval(fbteam);
                   }
               }},
              {label: 'goteam1|进小鹿队',title: '进队',id:'进队',eventOnClick() {go2("team join u3915953(3)"); }},
              {label: 'goteam9|进九号队',title: '进队',id:'进队',eventOnClick() {go2("team join u7531873(2);"); }},
              {label: 'helpfb10|带过本10',title: '进队',id:'进队',eventOnClick() {daiduifb10();}},
              {label: 'teamquit|退队伍',title: "退出队伍",eventOnClick() {go2("team quit;golook_room");}},
             ]
}]

var initializeautofubenButtons = function () {
    topPx = CONST_DEFAULT_TOP;
    rightPx = 0;
    counter = 0;
    createGeneralControlButton();

    for (let i = 0; i < autofubenConfigurations.length; i++) {
        let group = autofubenConfigurations[i];

        createSubject(group.subject,'canBeHiddenautofuben');
        createButtons(group.buttons,'canBeHiddenautofuben');
        if (group.additionalPosition) {
            createReservedPosition(group.additionalPosition);
        }
    }

    function createGeneralControlButton() {
        let button = document.createElement('button');
        button.innerText = button.name = "自动副本";
        button.title = "可以来回切换";
        button.id = "autofubenConfig";
        button.style.width = CONST_BUTTON_WIDTH + 'px';
        button.style.height = 20 + 'px';
        button.style.position = 'absolute';
        button.style.right = rightPx;
        button.style.top = currentPos+"px";
        currentPos += 75;

        button.addEventListener('click', function eventOnClick() {
            if (ButtonManager.toggleButtonEvent(this)) {
                $(".canBeHiddenautofuben").attr("hidden", "true");
                if (ButtonId == "autofubenConfig")
                {
                    ButtonId = "";
                }
            } else {
                $(".canBeHiddenautofuben").removeAttr("hidden");
                if (ButtonId != "autofubenConfig")
                {
                    ButtonManager.clickButtonById(ButtonId);
                }
                ButtonId = "autofubenConfig";
            }
        });

        document.body.appendChild(button);
    }
}
//首页主菜单按钮声明
function initializeAllSettings() {
    ButtonManager.clickButtonById("DailyTasksConfig");
    ButtonManager.clickButtonById("AutoFightConfig");
    ButtonManager.clickButtonById("SpecialEventConfig");
    ButtonManager.clickButtonById("autofubenConfig");
    ButtonManager.clickButtonById("BattleConfig");
    ButtonManager.clickButtonById("JiangHuZhiXianConfig");
    ButtonManager.clickButtonById("shenbingbingyueConfig");
    ButtonManager.clickButtonById("qixiamijingConfig");
    ButtonManager.clickButtonById("waizhuanConfig");
    ButtonManager.clickButtonById("autojingmaiConfig");
    ButtonManager.clickButtonById("DragonConfig");
    ButtonManager.clickButtonById("SkillConfig");
    ButtonManager.clickButtonById("TupoConfig");
    ButtonManager.clickButtonById("ItemUseConfig");
    ButtonManager.clickButtonById("YuanbaoConfig");
    ButtonManager.clickButtonById("autoreconnect");
    /*autoreconnect
	ButtonManager.clickButtonById("LianZhao");
//    ButtonManager.clickButtonById("clearlog");
//    ButtonManager.clickButtonById("holdconnect");

//    ButtonManager.clickButtonById("killhide");
	ButtonManager.clickButtonById("force1");
	ButtonManager.clickButtonById("nei1");
	ButtonManager.clickButtonById("buf1");
	if(uid=="3778114"){
		ButtonManager.clickButtonById("Moon");
		ButtonManager.clickButtonById("Sun");
		ButtonManager.clickButtonById("drug");
		ButtonManager.clickButtonById("Yintian");
		ButtonManager.clickButtonById("Dragon");
		ButtonManager.clickButtonById("qianying");
		ButtonManager.clickButtonById("liaoyuan");
		ButtonManager.clickButtonById("autoreconnect");
	}
	if(uid=="6645812"){
		ButtonManager.clickButtonById("Yintian");
		ButtonManager.clickButtonById("Dragon");
		ButtonManager.clickButtonById("Flower");
//        ButtonManager.clickButtonById("AutoKill");
		ButtonManager.clickButtonById("liaoyuanbaiji");
		ButtonManager.clickButtonById("autobuf");
	}
	if(uid=="6644281"){
		ButtonManager.clickButtonById("Learder");
		ButtonManager.clickButtonById("Moon");
		ButtonManager.clickButtonById("Sun");
		ButtonManager.clickButtonById("drug");
		ButtonManager.clickButtonById("Dragon");
		ButtonManager.clickButtonById("moxuan");
		ButtonManager.clickButtonById("bingpo");
		ButtonManager.clickButtonById("riguang");
	}
	if(uid=="6732731"){
		ButtonManager.clickButtonById("Learder");
		ButtonManager.clickButtonById("Moon");
		ButtonManager.clickButtonById("Sun");
		ButtonManager.clickButtonById("drug");
		ButtonManager.clickButtonById("Dragon");
		ButtonManager.clickButtonById("moxuan");
		ButtonManager.clickButtonById("bingpo");
		ButtonManager.clickButtonById("riguang");
		ButtonManager.clickButtonById("liaoyuan");
	}
	if(uid=="3764304"){
		ButtonManager.clickButtonById("Learder");
		ButtonManager.clickButtonById("Moon");
		ButtonManager.clickButtonById("Sun");
		ButtonManager.clickButtonById("drug");
		ButtonManager.clickButtonById("Dragon");
		ButtonManager.clickButtonById("moxuan");
		ButtonManager.clickButtonById("bingpo");
		ButtonManager.clickButtonById("riguang");
		ButtonManager.clickButtonById("liaoyuan");
		ButtonManager.clickButtonById("qianying");
	}
	if(uid=="3722239"){
		ButtonManager.clickButtonById("pomoqiang");

	}
	*/
}

function DisplayAndHiddenBtn(btnId, type) {
    var currentBtn = document.getElementById(btnId);
    if (type == "d") {
        currentBtn.style.display = "block"; //style中的display属性
    }
    else if (type == "h") {
        currentBtn.style.display = "none";
    }
}

function answerQuestions() {
    if(answerTrigger == 0) return;
    TriggerFuc = function(b){
        var type = b.get('type');
        var ll,l;
        if(type == 'show_html_page'){
            var msg = b.get('msg');
            if(msg.indexOf('回答正确')>-1){
                clearTrigger();
                setTimeout(answerQuestions,cmdDelayTime);
                return;
            }else if(msg.indexOf('回答错误')>-1 ){
                clearTrigger();
                InforOutFunc('回答错误');
                setTimeout(answerQuestions,300);
                return;
            }
            l = msg.split(/\n/g)
            if(l.length > 2 && l[0].match(/知识问答第 (.*)\/(.*) 题<\/p>/)){
                var question = g_simul_efun.replaceControlCharBlank(l[1]);
                if(question.trim() == '')
                    question = g_simul_efun.replaceControlCharBlank(l[2]);
                var param = {
                    types:'answerQuestion',
                    question:question,
                    userID:g_obj_map.get("msg_attrs").get('id'),
                    qu:g_area_id,
                }
                _$(url, param, function(data){
                    var aswdata = data.data;
                    if(!aswdata){
                        InforOutFunc('没有找到答案！！')
                        return;
                    }
                    clickButton('question '+aswdata)
                },function(){
                    InforOutFunc('没有找到答案！！')
                });
            }
        }else if(type == 'notice' && b.get('msg').indexOf('每日武林知识问答次数已经达到限额')>-1){
            console.log('完成自动答题！')
            clearTrigger();
            answerTrigger = 0
            ButtonManager.resetButtonById("answerQuestion");
            return;
        }
    }
    clickButton('question')
}
//自动悬红
xuanhong_flag = 0;
var xuanhong = {
    place:'',
    npcText:'',
    npc:'',
    xhdata:[],
    lastpath:'',
    minute:0,
    findTimes:0,
    timeLimit:false,
    AutoXuanhong:false,
    ready(){
        if(xuanhong_flag == 0)
            return;
        TriggerFuc = function(b){
            let type = b.get('type');
            let ll = null,msg=b.get('msg');
            if(type == 'prompt' && msg.indexOf('元宝取消【江湖悬红榜】任务吗')>=0){
                clearTrigger()
                InforOutFunc('前一个没有完成，自行处理后重试')
                ButtonManager.resetButtonById("xuanhong");
                return;
            }else if(type == 'notice' && msg.indexOf('没有接到【江湖悬红榜】')>=0){
                clearTrigger()
                setTimeout(xuanhong.goAsk,500)
            }
        }
        go('jh 1;w;event_1_72202956')
    },
    goAsk(){
        if(xuanhong_flag == 0)
            return;
        TriggerFuc = function(b){
            var type = b.get('type');
            var ll = null,msg;
            if(type == 'main_msg'){
                msg = g_simul_efun.replaceControlCharBlank(b.get('msg'));
                if(ll = msg.match(/位于『(.*)』的『(.*)』打听.*你还有 (.*)分.*秒/)){
                    //。(你还有 17分00秒/17分钟 去完成)
                    xuanhong.place = ll[1]
                    xuanhong.npcText = ll[2]
                    let minute = Number(ll[3])
                    let endtime = new Date(new Date().getTime() + minute*60*1000).format('hh:mm')
                    InforOutFunc('剩余'+minute+'分钟，预计到期时间：'+endtime)
                    if(xuanhong.timeLimit && minute < xuanhong.minute){
                        InforOutFunc(minute+'分钟不够，元宝取消')
                        xuanhong.xhCancel()
                        return;
                    }
                    var param = {
                        types:'findNpc',
                        place:xuanhong.place,
                        info:xuanhong.npcText,
                        userID:g_obj_map.get("msg_attrs").get('id'),
                        qu:g_area_id,
                    }

                    _$(url, param, xuanhong.xhFuc);
                }else if(msg.indexOf('【江湖悬红榜】你的任务超时了')>-1 || msg.indexOf('等下再来好吗')>-1){
                    clearTrigger()
                    setTimeout(xuanhong.goAsk,1000)
                }
            }else if(type=='notice'){
                msg = g_simul_efun.replaceControlCharBlank(b.get('msg'));
                //if(ll = msg.match(/红榜】任务奖励获得朱果(.*)，这是今天第(.*)\/(.*)次任务，已连续完成(.*)次/)){
                if(msg.indexOf('【江湖悬红榜】任务奖励获得')>=0){
                    clearTrigger()
                    //xhtimes = parseInt(ll[2])
                    //xhMaxtimes = parseInt(ll[3])
                    setTimeout(xuanhong.goAsk,500)
                }
                else if(msg.indexOf('你的背包里没有这个物品')>-1 ||msg.indexOf('你目前不能使用『悬红令』')>-1){
                    clearTrigger()
                    //xhtimes = xhMaxtimes;
                    InforOutFunc('悬红结束')
                    ButtonManager.resetButtonById("xuanhong");
                    lj_paras.xhtimes = lj_paras.xhMaxtimes;
                    saveOption(lj_paras,1);
                }
                else if(msg.indexOf('江湖悬红榜任务数量已经达到上限')>-1){
                    //clearTrigger()
                    clickButton('items use obj_xuankongling', 0)
                    clickButton('event_1_40923067')
                }else if(msg.indexOf('系统更新中，请稍候再试')>-1 || msg.indexOf('等下再来好吗')>-1){
                    clearTrigger()
                    setTimeout(xuanhong.goAsk,1000)
                }
            }
        }
        xuanhong.lastpath = ''
        clickButton('jh 1')
        clickButton('w')
        clickButton('event_1_40923067')
    },
    xhFuc(data){
        xuanhong.xhdata = data.data;
        if(!xuanhong.xhdata){
            InforOutFunc('没有找到npc')
            xuanhong.xhCancel()
            return;
        }
        xuanhong.findFuc()
    },
    xhCancel(){
        if(!xuanhong.AutoXuanhong)
            return;
        clearTrigger()
        clickButton('jh 1')
        clickButton('w')
        if(user_yuanbao > minYuanbao)
            clickButton('event_1_72202956 go')
        else{
            InforOutFunc('元宝不足')
            return;
            //clickButton('event_1_8142288 go')
        }
        setTimeout(xuanhong.goAsk,1000)
    },
    findFuc(){
        if(!xuanhong.xhdata || xuanhong.xhdata.length == 0){
            InforOutFunc('已经没有更多数据')
            xuanhong.xhCancel()
            return;
        }
        var data = xuanhong.xhdata[0];
        xuanhong.xhdata.shift();
        InforOutFunc(data.place+'  '+data.npc+' '+data.color)
        InforOutFunc('路径：'+data.path)
        xuanhong.npc = data.npc
        xuanhong.findTimes=0;
        if(data.path_type <=3){
            /*
				nextFun = function(){
					setTimeout(xuanhong.findNpc,1000,data.npc)
				}
				*/
            TriggerFuc = function(b){
                let type = b.get('type'),msg = b.get('msg')
                if(type == 'main_msg' &&  msg.indexOf('你说道：悬红')>=0){
                    //TriggerFuc = function(){}
                    xuanhong.findNpc(xuanhong.npc)
                }
                if(type == 'notice' && msg.indexOf('【江湖悬红榜】任务已完成')>-1){
                    clearTrigger()
                    setTimeout(xuanhong.goAsk,1000)
                }
            }
            if(data.path == xuanhong.lastpath)
                go2('golook_room')
            else if(xuanhong.lastpath.length > 0 && data.path.length > xuanhong.lastpath.length){
                if(data.path.substr(0,xuanhong.lastpath.length) == xuanhong.lastpath)
                    go2(data.path.substr(xuanhong.lastpath.length))
                else{
                    if(data.npc == '魔教犯人' && data.jh == '27'){
                        var tmp = g_obj_map.get("msg_room").get("obj_p");
                        if(tmp == '2846'){
                            go2('s;e;e;n');
                        }else if(tmp == '2851' || tmp == '2856' || tmp == '2837'){
                            go2('s;e;n');
                        }
                        else
                            go2(data.path)
                    }else{
                        go2(data.path)
                    }
                }
            }
            else{
                go2(data.path)
            }
            go2('say 悬红')
            xuanhong.lastpath = data.path;
            if(data.path_type ==3)
                console.log(data.bak+'(需要手动关注)')
        }else{
            InforOutFunc(data.bak+'(需要手动关注)')
            if(xuanhong.AutoXuanhong){
                xuanhong.xhCancel()
                return;
            }
            go2(data.path)
            for(i=0;i<xuanhong.xhdata.length;i++){
                InforOutFunc(xuanhong.xhdata[i].place+'  '+xuanhong.xhdata[i].npc+' '+xuanhong.xhdata[i].color)
                console.log('路径：'+xuanhong.xhdata[i].path)
            }
        }
    },
    findNpc(npc){
        let find=0;
        for(let i=0;i<g_obj_map.get("msg_room").size();i++){
            let npcinfo=g_obj_map.get("msg_room").get("npc"+(i+1));
            if(npcinfo){
                let npcinfoarr=npcinfo.split(",");
                //console.log(npcinfoarr)
                npcinfoarr[1] = g_simul_efun.replaceControlCharBlank(npcinfoarr[1]);
                if(npcinfoarr[1].indexOf(npc)>-1){
                    find=1;
                    clickButton("ask "+npcinfoarr[0],0);
                    break;
                }
            }
        }
        if(find == 0){
            InforOutFunc('未找到'+npc)
            /*
				xuanhong.findTimes ++;
				if(xuanhong.findTimes <3)
					setTimeout(xuanhong.findNpc,1000,npc)
				else
				*/
            xuanhong.xhCancel()
        }
        else{
            setTimeout(function(){if(!g_gmain.is_fighting) xuanhong.findFuc()},1000)
        }
    },
}
//惩恶扬善
var cecj = {
    x:0,
    askpath:'jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;ne;ne;nw;nw;event_1_20668593',
    path_list:[],
    npcList:[],
    killList:[],
    goAsk(){
        if(!g_obj_map.get('msg_score')){
            clickButton('score')
            setTimeout(cecj.goAsk,500)
            return
        }			var shen = parseInt(g_obj_map.get('msg_score').get('shen'))
        if(shen < 50000){
            InforOutFunc('正气不足')
            cecj.cjend2();
            return;
        }
        cecj.path_list = ['jh 21','nw','w','w','nw','n','n','n','n','n','n','n','n','ne','n'];
        cecj.npcList = ['星宿恶徒【一】','星宿恶徒【二】','星宿恶徒【三】','星宿恶徒【四】'];
        cecj.killList = [];
        TriggerFuc = function(b){
            var type = b.get('type');
            var msg;
            if(type == 'main_msg' && b.get('msg').indexOf('一些星宿恶徒正从白驼山前往星宿海')>-1){
                TriggerFuc = cecj.findkill;
                cecj.gopath();
            }
            else if(type == 'main_msg' && b.get('msg').indexOf('做得好，这是给你应得的')>-1){
                console.log('完成惩奸除恶')
                cecj.cjend2();
            }else if(type == 'notice' && (b.get('msg').indexOf('已经完成过【惩奸除恶】')>-1 || b.get('msg').indexOf('才可以接受此任务')>-1)){
                console.log('已完成或不能接惩奸除恶')
                cecj.cjend2();
            }
        }
        if(g_obj_map.get('msg_room').get("obj_p") == "4510")
            go2('event_1_20668593');
        else
            go2(cecj.askpath);
    },
    gopath(){
        if (cecj.path_list.length>0) {
            var order = cecj.path_list[0];
            clickButton(order);
            cecj.path_list.shift();
        } else {
            cecj.cjend();
        }
    },
    cjend (){
        clearTrigger();
        if(cecj.x == 1) nextFun = function(){setTimeout(tongren,2000)}
        go2(cecj.askpath);
    },
    cjend2(){
        clearTrigger();
        if(cecj.x==1)
            tongren();
    },
    findkill(b){
        var type = b.get('type');
        if(cecj.npcList.length == 0)
            return;
        if(type == 'jh' && b.get('subtype') == 'info'){
            var find = 0;
            var objs = b.keys();
            for(var i=0;i<objs.length;i++){
                if(objs[i].indexOf('npc')==0){
                    var value = b.get(objs[i]);
                    var ll = value.split(',');
                    var npc_name = g_simul_efun.replaceControlCharBlank(ll[1]);
                    if(npc_name == cecj.npcList[0]){
                        find = 1;
                        cecj.killList.push(ll[0])
                    }
                }
            }
            if(find == 1){
                TriggerFuc = cecj.killnpc;
                clickButton('kill '+cecj.killList[0])
            }else
                setTimeout(cecj.gopath,cmdDelayTime);
        }else if(type == 'notice'){
            var msg = b.get('msg');
            if(msg.indexOf('这儿没有这个方向')>-1){
                setTimeout(cecj.gopath,cmdDelayTime);
            }
        }
    },
    killnpc(b){
        var type = b.get('type');
        var msg;
        if(type == 'notice'){
            msg = b.get('msg');
            if(msg.indexOf('这儿没有这个人')>-1 || msg.indexOf('你现在还不能杀这个人')>-1){
                cecj.killList.shift()
                if(cecj.killList.length>0)
                    setTimeout(function(){clickButton('kill '+cecj.killList[0])},cmdDelayTime)
                else{
                    TriggerFuc = cecj.findkill;
                    setTimeout(cecj.gopath,cmdDelayTime);
                }
            }
        }
        else if(type == 'vs' && b.get('subtype') == 'combat_result'){
            cecj.killList = [];
            cecj.npcList.shift();
            if(cecj.npcList.length == 0)
                cecj.cjend();
            else{
                TriggerFuc = cecj.findkill;
                clickButton('golook_room')
            }
        }
    }
}

var RCtrigger2 = 0;
function richang(){
    cmdDelayTime = 300;
    TriggerFuc = function(b){
        if(b.get('type') == "show_html_page" && b.get('title') == "日常任务"){
            clearTrigger()
            var msg = b.get('msg');
            nextFun=function(){
                cmdDelayTime = 200;
                setTimeout(ButtonManager.resetButtonById,1000,"richang2")
            }
            //console.log(msg)
            if(msg.indexOf(';daily finish 19')>=0){
                go2('daily go 19;kill2 mingjiao_jiuyoudumo');
                //console.log('毒魔')
            }if(msg.indexOf(';daily finish 15')>=0){
                go2('jh 13;e;s;w;s;w;w;w;event_1_38874360;kill2 shaolin_dufengshenshi');
                //console.log('少林')
            }if(msg.indexOf(';daily finish 3')>=0){
                go2('daily go 3;event_1_14401179;kill2 qingcheng_nielongzhiling');
                //console.log('青城')
            }
            if(msg.indexOf(';daily finish 10')>=0){
                go2('jh 9;event_1_20960851;kill2 henshan_shashenzhaitoumu');
                //console.log('恒山')
            }
            if(msg.indexOf(';daily finish 5')>=0){
                go2('daily go 5;kill2 emei_chibaosishi;n;n;kill2 emei_heiyingsishi;n;n;kill2 emei_jinlangdajiang');
                //console.log('峨眉1')
            }
            if(msg.indexOf(';daily finish 13')>=0){
                go2('daily go 13;event_1_53216521;event_1_55885405;w;n;kill2 emei_qili;s;s;kill2 emei_heiyudijiang;n;w;s;kill2 emei_abaojia;n;e;e;event_1_53216521');
                //console.log('峨眉2')
            }
            if(msg.indexOf(';daily finish 2')>=0){
                go2('jh 21;#4 n;w;kill2 baituo_qingyidunwei;w;kill2 baituo_feiyushenjian;w;kill2 baituo_yinlangjinwei;w;fight baituo_junzhongzhushuai');
                //console.log('白陀1')
            }
            if(msg.indexOf(';daily finish 16')>=0){
                go2('daily go 16;event_1_53430818;n;kill2 baituo_baojunzhushuai;s;s;nw;n;n;kill2 baituo_hujunzhushuai;s;s;se;#3 e;kill2 baituo_yingjunzhushuai;#3 w;nw;w;nw;event_1_89411813;kill2 baituo_xieli;l')
                //console.log('白陀2')
            }
            go2('l')
        }
    }
    go2('home;public_op12')
}

function tongren(){
    if(RCtrigger == 0){
        InforOutFunc('日常停止')
        return;
    }
    nextFun = function(){
        setTimeout(shuangxiu,1000,1)
    }
    go2('clan zsdg enter;n;n;n;n;n;event_1_14757697;s;s;e;e;e;e;e;e;e;e;n;n;event_1_35095441;l')
}

var sxstart = 0;
function shuangxiu(){
    sxstart = 0;
    TriggerFuc = function(b){
        let type = b.get('type'),subtype = b.get('subtype'),msg=b.get('msg');
        if(type == 'main_msg' && msg.indexOf('你说道：开始')>=0){
            sxstart=1
            clickButton('event_1_66728795')
        }else if(
            sxstart == 1
            && ((type == 'vs' && subtype == "combat_result")
                ||((type == 'main_msg' || type=='notice')&& msg.indexOf('每天只能修练一次')>=0)
               )
        ){
            clearTrigger()
            setTimeout(dcww,1500)
        }
    }
    go2('rank go 233;s;s;s;e;ne;say 开始')
}



var places = {
    '雪亭镇': {id:1,first_place:'饮风客栈',path:'jh 1,inn_op1,n,s,e,w,w,jh 1,e,s,w,s,n,w,e,e,e,ne,ne,jh 1,e,e,w,n,w,e,n,w,e,n,w,e,e,e,w,w,n,w,e,e,w,n,s,s,s,s,e,e,n,s,e,e,n,s,e,w,s,n,jh 1,w,w,s,n,n,s,w,s,n,n,s,w,s,n,n,s,w,s,n,n,s,w,s,n,n,s,w,s,n,n,s,w,n,s,s,n,w'},
    //		'洛阳': {id:2,first_place:'龙门石窟',path:'jh 2,n,n,e,s,luoyang317_op1,n,n,w,n,w,putuan,n,e,e,s,n,w,n,e,s,n,w,w,s,w,e,n,event_1_98995501,n,w,e,n,e,w,s,s,s,e,n,w,s,luoyang111_op1,e,n,n,n,w,e,s,s,w,n,w,e,n,n,e,get_silver,n,w,s,s,s,e,e,e,n,s,e,n,n,w,e,e,n,s,w,n,w,e,n,e,w,n,w,e,s,s,s,s,s,w,w,n,w,e,e,n,s,w,n,e,w,n,e,w,w,luoyang14_op1,n,e,n,e,n,n,s,s,w,n,n,n,n'},
    '洛阳': {id:2,first_place:'龙门石窟',path:'jh 2,n,n,e,s,luoyang317_op1,n,n,w,n,w,putuan,n,e,e,s,n,w,n,e,s,n,w,w,s,w,e,n,event_1_98995501,n,w,e,n,e,w,s,s,s,e,n,w,s,luoyang111_op1,e,n,n,n,w,e,s,s,w,n,w,get_silver_s,s,e,n,n,e,get_silver_n,n,w,s,s,s,e,e,e,n,op1,s,s,e,n,n,w,e,e,n,s,w,n,w,e,n,e,w,n,w,e,s,s,s,s,s,w,w,n,w,e,e,n,s,w,n,e,w,n,e,w,w,luoyang14_op1,n,e,n,e,n,n,n,s,s,s,w,n,w,e,n,n,n'},
    '华山村': {id:3,first_place:'华山村村口',path:'jh 3,n,e,w,s,w,n,s,event_1_59520311,n,n,w,e,n,n,e,w,n,e,jh 3,s,e,n,s,w,s,e,s,huashancun24_op2,w,n,w,w,n,s,e,s,s,huashancun15_op1,event_1_46902878,w,w,w,n,s,get_silver,n,e,s,e,w,nw,n,n,e,get_silver,s,w,n,w,e,n,n,e,w,w,e,n'},
    //'华山': {id:4,first_place:'华山山脚',path:'jh 4,n,n,w,e,n,e,w,n,n,n,e,n,n,event_1_91604710,s,s,s,w,e,s,e,w,n,n,n,n,nw,s,s,w,n,n,w,s,n,w,n,s,e,e,n,e,n,n,w,e,n,e,w,n,e,w,n,s,s,s,s,s,w,n,n,n,w,e,n,s,e,n,n,s,s,s,s,n,n,w,s,s,w,event_1_30014247,s,w,e,s,e,w,s,s,s,e'},
    '华山': {id:4,first_place:'华山山脚',path:'jh 4,n,n,w,e,n,e,w,n,n,n,e,n,n,event_1_91604710,s,s,s,w,get_silver_s,s,e,s,e,w,jh 4,n,n,n,n,n,n,n,n,w,s,n,w,n,get_xiangnang2,w,s,e,e,n,e,n,n,w,w,event_1_26473707,e,e,e,n,e,s,event_1_11292200,n,n,w,n,e,w,n,s,s,s,s,s,w,n,n,n,w,e,n,get_silver_s,s,s,e,n,n,s,s,s,s,n,n,w,s,s,w,event_1_30014247,s,w,e,s,e,w,s,s,s,e'},
    '扬州': {id:5,first_place:'安定门',path:'jh 5,n,e,w,w,w,n,s,e,e,n,e,w,w,e,n,w,e,n,w,yangzhou16_op1,e,e,n,w,w,s,s,n,n,n,n,e,w,w,n,n,n,s,s,s,e,n,s,s,s,e,e,e,n,n,n,s,s,e,n,n,n,w,n,n,s,s,w,s,s,e,n,n,s,s,w,s,e,s,w,n,w,e,e,n,n,w,e,e,w,n,n,s,s,s,s,w,n,w,e,e,get_silver,s,w,n,w,w,w,e,n,get_silver,s,s,e,e,n,n,ne,sw,s,e,s,e,s,s,s,n,n,n,w,n,w,w,s,n,w,n,e,w,w,e,n,n,e,s,n,w,w,n,s,e,n,jh 5,n,n,n,event_1_8220256,n,w,e,n,e,w,w,n,s,e,n,e,w,n'},
    '丐帮': {id:6,first_place:'树洞内部',path:'jh 6,event_1_98623439,s,w,e,n,ne,ne,ne,sw,sw,n,ne,ne,ne,event_1_97428251'},
    '乔阴县': {id:7,first_place:'乔阴县城北门',path:'jh 7,s,s,s,w,s,w,w,w,e,e,e,e,event_1_65599392,w,e,n,s,ne,s,s,e,n,n,e,w,s,s,w,s,w,w,w,n,s,s,e,n,s,e,ne,s,e,n,e,s,e'},
    '峨眉山': {id:8,first_place:'十二盘',path:'jh 8,w,nw,n,n,n,n,w,e,se,nw,e,n,s,e,n,n,e,em1,n,em2,n,n,n,e,e,w,w,w,n,n,n,w,w,s,w,e,e,w,s,w,e,e,w,n,n,w,w,n,s,sw,ne,e,e,n,w,e,e,w,n,w,e,e,w,n,w,w,w,n,n,n,s,s,s,e,e,e,e,e,s,s,s,e,e,e,e,w,w,s,w,e,e,w,s,w,e,e,w,n,n,n,w,e,e,w,n,w,e,e,w,n,e,e,w,w,w,w,n,w,n,s,w,e,s,n,e,n,n,nw,nw,n,n,s,s,se,sw,w,nw,w,e,se,e,ne,se,n,n,s,s,ne,se,s,se,nw,n,nw,ne,se,e,w,nw,n'},
    '恒山': {id:9,first_place:'大字岭',path:'jh 9,n,w,e,n,e,w,n,w,e,n,henshan15_op1,e,e,w,n,event_1_85624865,n,w,e,e,w,n,n,n,s,s,s,s,w,n,n,w,n,s,s,n,e,e,n,s,e,w,w,n,n,w,n,e,w,n,n,w,e,n'},
    '武当山': {id:10,first_place:'林中小路',path:'jh 10,w,n,n,w,w,w,n,n,n,n,n,w,n,s,e,n,n,n,n,s,s,s,s,e,e,s,n,e,e,w,w,w,w,s,e,e,e,e,s,e,s,e,n,s,s,n,e,e,e,w,n,s,s,s,s'},
    '晚月庄': {id:11,first_place:'竹林',path:'jh 11,n,n,e,e,e,s,n,nw,w,nw,e,e,e,se,nw,n,w,jh 11,e,e,s,sw,se,w,n,s,w,n,w,e,s,w,w,e,s,n,e,s,w,e,s,w,s,n,w,n,s,s,n,e,e,e,e,e,w,w,w,s,e,s,s,s,e,w,w,s,e,e,w,w,n,e,w,w,w'},
    //晚月只到了二楼
    '水烟阁': {id:12,first_place:'青石官道',path:'jh 12,n,e,w,n,n,n,s,e,e,w,n,n,s,ne,w,n,s,w,se,n,e,w,s,s'},
    '少林寺': {id:13,first_place:'丛林山径',path:'jh 13,e,s,s,w,w,w,jh 13,n,w,w,n,shaolin012_op1,s,s,e,e,n,e,w,w,e,n,n,e,w,w,e,n,n,e,w,w,e,n,shaolin27_op1,event_1_34680156,s,w,n,e,w,w,e,n,shaolin25_op1,w,n,e,s,s,s,s,s,s,s,s,n,n,n,n,n,n,n,n,w,w,s,s,s,s,s,s,s,s,n,n,n,n,n,n,n,n,e,n,e,w,w,e,n,w,n,get_silver'},
    //'唐门': {id:14,first_place:'蜀道',path:'jh 14,e,w,w,n,n,n,n,s,w,n,s,s,n,w,n,s,s,n,w,n,s,s,n,w,e,e,e,e,e,s,n,e,n,e,w,n,n,s,e'},
    '唐门': {id:14,first_place:'蜀道',path:'jh 14,e,w,w,n,n,n,n,s,w,n,s,s,n,w,n,s,s,n,w,n,s,s,n,w,e,e,e,e,e,s,n,e,n,e,w,n,n,s,e,w,tmdd,n,e,e,s,e,n,s,s,n,s,s,s,s,s,e,n,e,w,w,e,e,e,w,e,n,e,e,s,e,n,w,n,n'},
    //ask tangmen_tangmei,e,event_1_8413183,event_1_39383240,e,s,e,n,w,n,n
    '青城山': {id:15,first_place:'北郊',path:'jh 15,s,ne,sw,s,e,w,w,n,s,e,s,e,w,w,w,n,s,w,w,w,n,s,w,e,e,e,e,s,s,n,n,e,e,s,e,w,w,e,s,e,w,s,w,s,ne,s,s,s,e,s,jh 15,n,nw,w,nw,n,s,w,s,s,s,kill qingcheng_renjie,w,w,n,e,w,w,e,n,s,s,w,s,n,n,n,s,s,w,n'},
    '逍遥林': {id:16,first_place:'青石大道',path:'jh 16,s,s,s,s,e,e,s,w,s,s,n,n,n,s,w,n,n,s,s,s,s,n,n,w,w,n,s,s,n,w,e,e,e,e,e,e,n,n,e,event_1_5221690,s,w,event_1_57688376,n,n,w,n,s,w,e,e,e,e,n,n,w,n,e,w,s,e,s,s,w,n'},
    '开封': {id:17,first_place:'朱雀门',path:'jh 17,n,w,e,e,s,n,w,n,w,s,n,n,n,s,s,e,e,e,s,n,n,n,s,s,w,s,s,s,w,e,s,w,e,n,e,n,s,s,n,e,e,w,w,w,n,n,n,w,n,e,w,n,e,w,w,w,n,s,s,n,w,w,e,n,n,w,e,s,s,s,s,w,e,n,n,e,e,e,n,e,se,nw,n,n,n,event_1_27702191,jh 17,event_1_97081006,s,s,s,e,kaifeng_yezhulin23_op1,n,w,s,s,w,w,e,kaifeng_yezhulin05_op1,jh 17,sw,nw,se,s,sw,nw,ne,event_1_38940168,jh 17,e,s,s,s,e,kaifeng_yuwangtai23_op1,s,w,s,s,w'},
    '明教': {id:18,first_place:'小村',path:'jh 18,e,w,w,n,s,e,n,nw,sw,ne,n,n,w,e,n,n,n,ne,n,n,e,w,w,e,n,e,w,w,e,n,n,w,w,s,n,n,n,n,e,nw,nw,se,se,e,s,w,e,e,w,s,e,w,s,w,e,e,w,s,e,e,se,se,e,w,nw,nw,n,n,ne,e,w,nw,w,w,n,n,n,w,e,n,event_1_90080676,event_1_56007071,ne,s,w,e,ne,n,nw'},
    '光明顶': {id:18,first_place:'小村',path:'jh 18,e,w,w,n,s,e,n,nw,sw,ne,n,n,w,e,n,n,n,ne,n,n,e,w,w,e,n,e,w,w,e,n,n,w,w,s,n,n,n,n,e,nw,nw,se,se,e,s,w,e,e,w,s,e,w,s,w,e,e,w,s,e,e,se,se,e,w,nw,nw,n,n,ne,e,w,nw,w,w,n,n,n,w,e,n'},
    '全真教': {id:19,first_place:'终南山路',path:'jh 19,s,s,s,sw,s,e,n,nw,n,n,n,n,w,e,e,w,n,e,n,s,e,n,n,s,s,e,w,w,w,w,w,w,s,n,w,s,n,e,e,e,e,n,n,w,w,s,s,n,n,w,s,s,n,n,w,n,n,n,n,e,n,s,s,s,e,n,n,n,s,w,w,n,n,e,n,e,e,n,n,s,s,e,e,e,e,s,e,s,s,s,n,w,n,s,s,s,s,w,s,n,w,w,e,n,n,n,e,n,s,s,s,w,n,n,n,n,n'},
    '古墓': {id:20,first_place:'山路',path:'jh 20,s,s,n,n,w,w,s,e,s,s,w,s,s,s,sw,sw,s,e,se,nw,w,s,e,w,w,e,s,s,w,w,e,s,sw,ne,e,s,s,w,w,e,e,s,n,e,e,e,e,s,e,w,n,w,n,e,w,n,s,w,s,n,n,e,w,n,n,s,s,w,e,event_1_3723773,se,n,e,s,e,s,e'},
    '白驼山': {id:21,first_place:'戈壁',path:'jh 21,nw,s,n,ne,ne,sw,n,n,ne,w,e,n,n,w,w,jh 21,nw,w,n,s,w,nw,e,w,nw,nw,n,w,sw,ne,e,s,se,se,n,e,w,n,n,w,e,n,n,e,e,w,ne,sw,e,nw,se,e,se,nw,w,n,s,s,n,w,w,n,n,n,n,s,s,s,s,e,e,e,n,n,w,e,e,e,w,w,n,nw,se,ne,e,w,w,e,n'},
    '嵩山': {id:22,first_place:'太室阙',path:'jh 22,n,n,w,w,s,s,e,w,s,s,w,e,s,n,n,n,n,n,e,n,n,n,n,event_1_88705407,s,s,e,w,s,s,n,n,n,n,w,n,e,n,e,e,w,w,n,w,n,s,e,n,n,n,e,songshan33_op1,n,w,w,w,e,n,w,e,n,s,s,e,n,e,w,n,e,w,n,get_silver,jh 22,n,n,n,kill songshan_songshan18,n,e,n,event_1_1412213,s,event_1_29122616'},
    '寒梅庄': {id:23,first_place:'柳树林',path:'jh 23,n,n,e,w,n,n,n,n,n,e,s,n,w,w,w,e,e,n,e,n,s,w,w,w,e,n,s,e,n,n,e,w,w,n,s,e,event_1_8188693,n,n,w,e,n,n,s,e,n'},
    '梅庄': {id:23,first_place:'柳树林',path:'jh 23,n,n,e,w,n,n,n,n,n,e,s,n,w,w,w,e,e,n,e,n,s,w,w,w,e,n,s,e,n,n,e,w,w,n,s,e,event_1_8188693,n,n,w,e,n,n,s,e,n'},
    '泰山': {id:24,first_place:'岱宗坊',path:'jh 24,se,nw,n,n,n,n,w,e,e,e,w,s,n,w,n,n,w,e,e,w,n,e,w,n,w,n,n,n,n,n,s,s,w,n,s,e,s,s,s,e,n,e,w,n,w,e,n,n,w,n,e,w,n,w,e,n,n,e,w,s,s,s,s,e,n,n,w,e,e,w,n,n,w,e,e,w,n,s,s,s,s,s,e,s,n,e,n,e,w,n,w,e,e,w,n,n,jh 24,n,n,n,n,n,n,n,n,w,n,n,n,w,n,event_1_15941870,n,w,e,n,e,w,n,w,e,n,n'},
    '大旗门': {id:25,first_place:'小路',path:'jh 11,e,e,s,n,nw,w,nw,e,e,e,se,nw,n,w,jh 25,w,e,e,e,e,e,s,yell,n,s,e,ne,se,e,e,e,e,w,w,w,w,nw,sw,w,s,e,event_1_81629028,w,e,s,w,e,s,e,n,w,w,s,w'},
    '铁血大旗门': {id:25,first_place:'小路',path:'jh 11,e,e,s,n,nw,w,nw,e,e,e,se,nw,n,w,jh 25,w,e,e,e,e,e,s,yell,n,s,e,ne,se,e,e,e,e,w,w,w,w,nw,sw,w,s,e,event_1_81629028,w,e,s,w,e,s,e,n,w,w,s,w'},
    '大昭寺': {id:26,first_place:'草原',path:'jh 26,w,w,w,w,w,n,s,w,w,w,n,w,e,e,w,s,w,n,s,s,n,w,e,e,e,e,s,w,e,e,e,w,w,s,w,w,w,s,n,w,n,n,n,n,n,e,e,e,e,e,w,s,s,jh 26,w,w,n,e,e,e,w,w,w,n,s,w'},
    '魔教': {id:27,first_place:'驿道',path:'jh 27,se,e,n,s,s,n,e,e,jh 27,ne,w,e,n,ne,sw,s,nw,w,nw,w,w,kill heimuya_shaogong,yell,w,nw,sw,ne,n,n,n,n,n,n,n,w,n,n,n,n,n,n,n,n,n,n,yell,n,n,n,n,w,e,e,w,n,e,n,s,w,n,nw,n,s,se,ne,n,s,sw,w,n,n,s,s,nw,n,s,se,w,n,s,e,sw,n,s,ne,se,n,s,nw,ne,n,s,ne,e,e,n,s,s,n,e,n,s,s,n,e,n,s,s,n,e,n,s,s,n,e,n,s,s,n,w,w,w,w,w,n,n,n,n,n,e,e,e,e,e,w,w,w,w,w,w,w,w,w,w,e,e,e,e,e,n,n,event_1_57107759,e,n,e,n,w'},
    '黑木崖': {id:27,first_place:'驿道',path:'jh 27,se,e,n,s,s,n,e,e,jh 27,ne,w,e,n,ne,sw,s,nw,w,nw,w,w'},
    '星宿海': {id:28,first_place:'天山下',path:'jh 28,nw,nw,se,w,e,sw,ne,e,e,jh 28,n,n,e,ne,n,s,sw,w,n,n,n,s,ne,nw,se,sw,nw,w,se,jh 28,n,w,n,n,n,s,se,nw,s,s,w,w,se,nw,w,n,w,e,s,w,w,nw,ne,nw,w,e,ne,nw,ne,e,w,nw,ne,nw,w,e,ne,nw,ne,e,w,nw,jh 28,sw,nw,sw,sw,nw,nw,se,sw'},
    '茅山': {id:29,first_place:'无名山脚',path:'jh 29,n,n,n,n,event_1_60035830,e,w,1_event_1_65661209,n,jh 29,n,n,n,n,event_1_60035830,0_event_1_65661209,n,n,n,n,n,e,w,n,e,w,n,event_1_98579273,w,e,nw,se,e,w,n,e'},
    '桃花岛': {id:30,first_place:'海滩',path:'jh 30,n,n,ne,sw,n,n,n,w,e,e,w,n,n,w,w,e,e,e,n,s,s,n,w,n,n,n,w,w,s,s,n,n,e,e,e,n,s,s,n,e,n,s,e,n,s,s,n,w,w,w,nw,w,e,se,n,n,n,e,e,w,w,n,se,s,jh 30,yell,w,n,e,w,n'},
    '铁雪山庄': {id:31,first_place:'羊肠小道',path:'jh 31,n,n,n,w,w,w,w,n,n,n,n,w,e,e,jh 31,n,se,e,se,s,s,sw,se,se,e,nw,e,ne,n,ne,n,n,n,n,n,n,w,n,s,w,sw,ne,e,e,e,n,s,e,event_1_47175535,nw,w,w,n,n,n,n,n,n,s,s,s,w,w,event_1_57281457,se,e,e,e,e,event_1_94442590,jh 31,n,se,jh 31,n,se,e,se,s,w'},
    //'慕容山庄': {id:32,first_place:'回望桥',path:'jh 32,n,n,se,w,e,n,w,e,ne,sw,n,n,n,n,s,e,w,w,s,n,w,n,s,s,n,w,n,event_1_72278818,event_1_35141481,w,e,s,w,n,e,n,n,w,n,w,e,s,e,e,n,n,s,w,e,e,jh 32,n,n,se,e,s,s,event_1_99232080,e,e,s,e,s,e,e,e,n,n,s,s,s,s,event_1_92057893,e,n,s,s,event_1_8205862'},
    '慕容山庄': {id:32,first_place:'回望桥',path:'jh 32,n,n,se,w,e,n,w,e,ne,sw,n,n,n,n,s,e,w,w,s,n,w,n,s,s,n,w,n,w,n,e,n,n,w,n,w,e,s,e,e,n,n,s,w,e,e,jh 32,n,n,se,n,n,n,n,w,w,w,n,event_1_72278818,event_1_35141481,w,jh 32,n,n,se,e,s,s,event_1_99232080,e,e,s,e,s,e,e,e,n,n,s,s,s,s,event_1_92057893,e,n,s,s,event_1_8205862'},
    '大理': {id:33,first_place:'官道',path:'jh 33,sw,sw,s,s,s,nw,n,ne,e,se,n,n,n,s,s,s,nw,w,n,n,se,nw,ne,sw,s,s,sw,nw,n,n,n,n,n,s,e,n,s,s,n,e,w,w,s,s,s,s,sw,w,w,s,s,e,w,s,e,w,w,se,nw,e,jh 33,sw,sw,s,s,s,s,w,w,n,se,nw,s,s,nw,n,e,se,n,n,w,se,nw,e,e,se,nw,e,se,nw,w,w,s,s,nw,w,s,se,n,w,w,w,s,s,w,w,e,e,se,e,w,s,jh 33,sw,sw,s,s,s,s,s,w,n,n,n,n,n,s,w,e,e,w,s,s,s,s,e,e,n,se,w,e,n,w,e,e,w,n,s,s,e,e,s,n,n,n,w,e,e,w,n,ne,n,s,e,e,n,s,e,w,w,w,sw,s,s,s,e,n,s,s,n,e,ne,n,s,sw,se,ne,jh 33,sw,sw,s,s,s,s,s,s,w,w,e,e,e,n,s,s,n,e,w,w,s,e,n,s,w,s,e,n,s,s,n,w,w,s,w,e,n,n,se,n,s,ne,jh 33,sw,sw,s,s,s,s,s,s,s,s,s,e,ne,s,n,sw,w,s,w,e,se,nw,s,s,s,e,n,s,w,sw,sw,n,n,s,s,w,e,s,n,ne,ne,s,e,n,n,n,s,s,s,s,n,e,w,w,se,s,n,sw,n,s,s,n,w,jh 33,sw,sw,s,s,s,s,e,e,n,s,s,n,e,e,se,s,s,w,n,n,s,s,e,s,s,n,n,n,e,e,e,ne,sw,w,w,w,n,e,e,se,n,n,n,n,n,n,s,s,s,s,s,s,nw,e,n,n,n,s,s,s,e,e,se,e,s,ne_s,s,n,e,se,e,e,s,n,ne,e,n,s,w,sw,sw,s,s,e,e,w,s,e,w,n,n,e,n'},
    '断剑山庄': {id:34,first_place:'官道',path:'jh 34,ne,e,e,e,e,e,n,e,n,n,s,s,w,n,n,n,n,w,e,n,e,w,s,s,s,w,w,w,n,n,yell,n,n,w,w,e,s,w,e,n,e,e,e,w,s,n,w,n,e,e,w,n,e,w,s,w,n,w,w,e,e,n,n,n,n,s,s,e,e,event_1_10251226jh 34,ne,e,e,e,e,e,n,e,n,n,s,s,w,n,n,n,n,w,e,n,e,w,s,s,s,w,w,w,n,n,yell,n,n,w,w,e,s,w,e,n,e,e,e,w,s,n,w,n,e,e,w,n,e,w,s,w,n,w,w,e,e,n,n,n,n,s,s,e,e,event_1_10251226'},
    '冰火岛': {id:35,first_place:'冰火峡湾',path:'jh 35,nw,nw,nw,n,ne,nw,w,w,s,w,e,e,w,n,e,nw,e,e,n,nw,se,s,e,e,e,se,e,w,n,n,ne,n,s,sw,w,n,w,ne,sw,event_1_53278632,s,nw,sw,se,s,sw,sw,se,se,jh 35,nw,nw,nw,n,ne,nw,w,w,s,w,e,e,w,n,e,nw,e,e,n,nw,se,s,e,e,e,se,s,se,w,nw,s,s,s,s,s,s,e,w,w,w,n,e,n,w,w,s,s'},
    '侠客岛': {id:36,first_place:'东海码头',path:'jh 36,yell,e,ne,ne,ne,e,n,n,s,w,e,s,s,w,e,e,w,n,e,n,s,e,event_1_9179222,e,w,n,e,e,s,e,w,n,e,n,e,e,ne,sw,w,w,s,n,n,n,e,ne,nw,w,jh 36,yell,e,se,e,e,e,e,w,w,w,s,s,s,s,w,e,s,n,e,s,n,ne,e,se,nw,e,n,e,n'},
    '绝情谷': {id:37,first_place:'山路',path:'jh 37,n,e,e,nw,nw,w,n,nw,n,n,ne,n,nw,sw,event_1_12492702,jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,se,ne,sw,n,ne,sw,s,s,s,s,w,w,s,n,e,e,n,n,n,nw,sw,sw,nw,w,n,ne,sw,nw,n,ne,e,ne,se,nw,sw,w,sw,nw,n,ne,e,ne,e,n,ne,sw,s,w,sw,w,n,ne,ne,sw,sw,s,sw,nw,n,nw,jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,event_1_16813927jh 37,n,e,e,nw,nw,w,n,nw,n,n,ne,n,nw,sw,event_1_12492702,jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,se,ne,sw,n,ne,sw,s,s,s,s,w,w,s,n,e,e,n,n,n,nw,sw,sw,nw,w,n,ne,sw,nw,n,ne,e,ne,se,nw,sw,w,sw,nw,n,ne,e,ne,e,n,ne,sw,s,w,sw,w,n,ne,ne,sw,sw,s,sw,nw,n,nw,jh 37,n,e,e,nw,nw,w,n,e,n,e,e,e,ne,ne,ne,event_1_16813927'},
    '碧海山庄': {id:38,first_place:'石阶',path:'jh 38,n,n,w,w,s,w,w,e,e,n,e,e,n,n,w,w,n,e,w,w,e,s,w,e,e,e,n,n,n,w,w,nw,w,w,n,n,n,s,s,s,e,e,se,e,e,n,n,e,se,s,e,w,n,nw,w,n,n,n,n,n,n,s,s,s,s,e,e,se,se,e,n,n,n,n'},
    //'天山': {id:39,first_place:'官道',path:'jh 39,ne,e,n,ne,ne,se,e,e,w,n,s,s,e,se,nw,w,n,w,nw,w,n,nw,se,s,e,n,ne,nw,ne,nw,event_1_17801939,ne,ne,nw,nw,nw,w,jh 39,ne,e,n,ne,ne,n,ne,nw,event_1_58460791,nw,n,ne,nw,nw,n,s,w,w,e,s,n,n,n,w,e,e,w,n,e,e,s,n,w,nw,w,ne,sw,nw,jh 39,ne,e,n,nw,nw,w,s,s,sw,n,nw,e,sw,w,s,w,n,w'},
    '天山': {id:39,first_place:'官道',path:'jh 39,ne,e,n,ne,ne,se,e,e,w,n,s,s,e,se,nw,w,n,w,nw,w,n,nw,se,s,e,n,ne,nw,ne,nw,jh 39,ne,e,n,nw,nw,w,s,s,sw,n,nw,e,sw,w,s,w,n,w'},
    //'苗疆': {id:40,first_place:'岸边路',path:'jh 40,s,s,s,s,w,w,w,w,e,n,s,s,sw,ne,n,se,s,n,nw,e,e,e,e,s,se,sw,s,s,s,s,sw,jh 40,s,s,s,s,e,s,se,sw,s,sw,e,e,sw,se,sw,se,0_event_1_8004914,se,s,s,e,n,n,e,s,e,ne,s,sw,e,e,ne,ne,nw,ne,ne,n,n,e,w,w,sw,ne,e,n,n,e,w,nw,ne,nw,sw,ne,se,ne,se,se,nw,nw,nw,ne,e,jh 40,s,s,s,s,e,s,se,sw,s,s,s,e,e,sw,se,sw,se,1_event_1_8004914,sw,se,event_1_41385370,e,ne,nw,e,sw,se,s,ne,e'},
    '苗疆': {id:40,first_place:'岸边路',path:'jh 40,s,s,s,s,w,w,w,w,e,n,s,s,sw,ne,n,se,s,n,nw,e,e,e,e,s,se,sw,s,s,s,s,sw,jh 40,s,s,s,s,e,s,se,sw,s,sw,e,e,sw,se,sw,se'},
    '白帝城': {id:41,first_place:'岸边路',path:'jh 41,se,e,e,ne,ne,se,e,n,s,e,ne,sw,se,se,nw,nw,s,w,e,e,jh 41,se,e,e,nw,nw,n,n,w,w,n,n,e,n,s,e,w,w,s,s,e,e,e,ne,s,n,e,w,n,nw,n,jh 41,se,e,e,se,se,se,se,s,s,s,e,e,ne,sw,w,w,n,n,n,se,se,event_1_57976870,e,e,e,w,ne,n,w,e,s,sw,w,w,n,n,n,ne,n,nw,se,s,sw,nw,n,s,se,s,s,s,w,w,w,n,ne'},
    '墨家机关城': {id:42,first_place:'云海山谷',path:'jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,e,s,w,w,n,e,n,n,n,n,n,n,n,n,n,s,s,s,s,s,w,w,n,e,w,n,e,w,n,e,w,ne,w,e,n,s,sw,s,s,s,e,e,e,e,n,w,e,n,w,e,n,w,e,nw,e,w,n,s,se,s,event_1_39026213,n,ne,se,s,event_1_623818,e,n,e,s,e,n,nw,e,nw,w,w,e,e,e,w,sw,ne,n,e,w,w,e,nw,se,ne,sw,jh 42,nw,ne,n,e,nw,e,nw,w,ne,se,n,nw,e,n,w,n,n,n,n,e,e,n,n,event_1_39026213,n,ne,se,s,event_1_623818,e,s,e,s,ne,s,sw,nw,s,se,s,e,e,e,w,w,w,sw,s,s,n,se,s'},
    '掩月城': {id:43,first_place:'越女玉雕',path:''},
    '海云阁': {id:44,first_place:'海运镇',path:''},
    '幽冥山庄':{id:45,first_place:'幽暗山路',path:''},
    '花街': {id:46,first_place:'官路',path:''},
    '西凉城':{id:47,first_place:'荒漠',path:''},
    '高昌迷宫':{id:48,first_place:'大沙漠',path:''},
    '京城':{id:49,first_place:'大沙漠',path:''},
}
var stime3 = null;
var turnFind = {
    path:'',
    path_list:'',
    name:'',
    n:0,
    kill_id:'',
    result:{},
    endFuc(data){},
    findend (){
        clearTrigger();
        turnFind.endFuc(turnFind.result);
    },
    goFind(name,place,endFuc){
        turnFind.endFuc=endFuc || function(data){};
        turnFind.path = (places[place].path)?places[place].path:'';
        turnFind.path = turnFind.path.replace(';',',')
        turnFind.path_list = turnFind.path.split(',');
        turnFind.name = name;
        turnFind.n = 0;
        turnFind.result = {
            find:0,
            npcID:'',
        };
        TriggerFuc = turnFind.goplace;
        turnFind.gopath();
    },
    gopath (){
        if(paustStatus == 1){
            //clearTimeout(stime3);
            stime3 = setTimeout(turnFind.gopath,cmdDelayTime);
            return;
        }
        if (turnFind.n < turnFind.path_list.length) {
            var cmd = turnFind.path_list[turnFind.n];
            if(isContains(cmd,'yell')){
                paustStatus = 1;
                cmdTrigger = yellFuc;
            }else if(cmd.substr(0,4) == 'kill'
                     ||cmd.substr(0,5) == 'fight'){
                paustStatus = 1;
                cmdTrigger = eventFuc;
                setTimeout(turnFind.gopath,500);
                setTimeout(chuzhao6,2000)
            }
            else if(isContains(cmd,'event_1_37376258')	//天山七侠
                    ||isContains(cmd,'event_1_58460791')	//天山爬绳1
                    ||isContains(cmd,'event_1_17801939')	//天山爬绳2
                    ||isContains(cmd,'event_1_60035830')	//茅山1
                    ||isContains(cmd,'event_1_65661209')	//茅山2
                    ||isContains(cmd,'event_1_38333366')	//逍遥祖师
                    ||isContains(cmd,'event_1_35141481')	//慕容划水
                   ){
                paustStatus = 1;
                cmdTrigger = eventFuc;
                if(isContains(cmd,'event_1_65661209'))
                    cmd = 'event_1_65661209';
            }else if(cmd == '0_event_1_8004914' || cmd == '1_event_1_8004914'){//苗疆
                paustStatus = 1;
                cmdTrigger = eventFuc;
                cmd = 'event_1_8004914'
            }else if(cmd == 'get_silver_s' || cmd == 'get_silver_n' || cmd == 'get_silver_w'){
                cmd = 'get_silver'
            }else if(cmd == 'em1'){
                if(g_obj_map.get('msg_attrs').get('family_name') != '峨嵋派'){
                    cmdNow = cmd = 'kill emei_shoushan';
                    paustStatus = 1;
                    cmdTrigger = eventFuc;
                    setTimeout(turnFind.gopath,500);
                    setTimeout(chuzhao6,2000)
                }else{
                    cmd='golook_room'
                }
            }else if(cmd == 'em2'){
                if(g_obj_map.get('msg_attrs').get('family_name') != '峨嵋派'){
                    cmdNow = cmd = 'kill emei_wenyue';
                    paustStatus = 1;
                    cmdTrigger = eventFuc;
                    setTimeout(turnFind.gopath,500);
                    setTimeout(chuzhao6,2000)
                }else
                    cmd='golook_room'
            }else if(cmd=='tmdd'){
                paustStatus = 1;
                setTimeout(function(){
                    clickButton('ask tangmen_tangmei');
                    clickButton('ask tangmen_tangmei');
                    clickButton('e');
                    clickButton('event_1_8413183');
                    clickButton('event_1_39383240');
                    setTimeout(function(){
                        paustStatus = 0;
                        clickButton('e')
                        turnFind.n++;
                    },2000)

                },1500)
                return;
            }

            clickButton(cmd);
            turnFind.n++;
            //console.log(cmd)
        } else {
            turnFind.n = 0;
            turnFind.findend();
        }
    },
    goplace (b){
        var find = 0;
        if(paustStatus==1) return;
        if(b.get('type') == 'jh' && b.get('subtype') == 'info'){
            var objs = b.keys();
            for(var i=0;i<objs.length;i++){
                if(objs[i].indexOf('npc')==0){
                    var value = b.get(objs[i]);
                    var ll = value.split(',');
                    var npc_name = g_simul_efun.replaceControlCharBlank(ll[1]);
                    if(ll[1] == turnFind.name || npc_name == turnFind.name){
                        find = 1;
                        turnFind.result.npcID = ll[0];
                        turnFind.result.find = 1;
                        turnFind.findend();
                        console.log(b.get('short')+'：找到'+ll[0]);
                        break;
                        return;
                    }
                }
            }
            if(find == 0){
                //clearTimeout(stime3);
                stime3 = setTimeout(turnFind.gopath,cmdDelayTime);
            }
        }else if(b.get('type') == 'notice' &&
                 (b.get('msg').indexOf('这儿没有这个方向')>-1
                  ||b.get('msg').indexOf('目前无法走动去那里')>-1)
                ){
            //clearTimeout(stime3);
            stime3 = setTimeout(turnFind.gopath,cmdDelayTime);
        }
    },
}

var cjgold = 8;
var choujiang_flag = 0;
var choujiang = function(){
    if(g_obj_map.get('msg_jh_list') == undefined){
        clickButton('jh')
        setTimeout(function(){choujiang()},1000)
        return;
    }
    var temp = prompt('选择多少金收？例如8，那么8金以上不追', cjgold)
    if(temp == null){
        ButtonManager.resetButtonById("choujiang");
        return
    }
    cjgold = Number(temp);

    TriggerFuc = function(b){
        var ll,nums,msg,type = b.get('type')
        if(type == 'notice'){
            msg = b.get('msg')
            if(msg.indexOf('此轮游戏结束')>-1){
                clickButton('event_1_36867949 get', 0)
                clickButton('event_1_36867949 pay', 1)
                if(choujiang_flag == 1)
                    setTimeout(clickButton,cmdDelayTime,'event_1_36867949 take')
                else
                    clearTrigger();
            }else if(msg.indexOf('今天的游戏次数已达到上限了')>-1){
                clearTrigger()
                ButtonManager.resetButtonById("choujiang");
            }else if(ll = msg.match(/奖池提升至(.*)金锭/)){
                nums=ll[1]
                if(nums >= cjgold){
                    clickButton('event_1_36867949 get', 0)
                    clickButton('event_1_36867949 pay', 1)
                }
                setTimeout(clickButton,cmdDelayTime,'event_1_36867949 take')
            }
        }
    }
    if(g_obj_map.get('msg_jh_list').get('finish49') == 0){
        console.log('未解锁京城')
        go2('rank go 194;event_1_36867949 pay;event_1_36867949 take')
    }
    else
        go2('jh 49;#5 n;w;w;n;event_1_36867949 pay;event_1_36867949 take')
}


var compare = function (prop,order=1) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if(order == 1){
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
        else{
            if (val2 < val1) {
                return -1;
            } else if (val2 > val1) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
//奇侠
var qixia={
    qixiaNow:'',
    qixiano:7,
    qixiaid:'',
    sd_nums:1000,
    sd_act:'',
    TKqixiaid:'',
    TKqxname:'',
    qxTalkIndex:0,
    auto:0,
    findmijing:0,
    place:'',
    QxTimes:0,
    maxQxTimes:20,
    mijingtimes:0,
    finish:0,
    qixiaArr:{
        '玄月研':{no: 0, id: '',skills:'玄天杖法',maxQinmi:80000,qxplace:''},
        '宇文无敌':{no: 1, id: '',skills:'破军棍诀',maxQinmi:80000,qxplace:''},
        '风无痕':{no: 2, id: '',skills:'千影百伤棍',maxQinmi:80000,qxplace:''},
        '厉沧若':{no: 3, id: '',skills:'燎原百破',maxQinmi:80000,qxplace:''},
        '夏岳卿':{no: 4, id: '',skills:'天火飞锤',maxQinmi:80000,qxplace:''},
        '妙无心':{ no: 5, id: '',skills:'拈花解语鞭',maxQinmi:80000,qxplace:''},
        '巫夜姬':{no: 6, id: '',skills:'辉月杖法',maxQinmi:80000,qxplace:''},
        '烈九州':{no: 7, id: '',skills:'昊云破周斧',maxQinmi:80000,qxplace:''},
        '穆妙羽':{no: 8, id: '',skills:'九溪断月枪',maxQinmi:80000,qxplace:''},
        '李玄霸':{no: 9, id: '',skills:'玄胤天雷',maxQinmi:80000,qxplace:''},
        '八部龙将':{no: 10, id: '',skills:'十怒绞龙索',maxQinmi:80000,qxplace:''},
        '狼居胥':{no: 11, id: '',skills:'四海断潮斩',maxQinmi:80000,qxplace:''},
        '庞统':{no: 12, id: '',skills:'翻云刀法',maxQinmi:80000,qxplace:''},
        '王蓉':{no: 13, id: '',skills:'织冰剑法',maxQinmi:80000,qxplace:''},
        '风南':{no: 14, id: '',skills:'孔雀翎',maxQinmi:80000,qxplace:''},
        '李宇飞':{no: 15, id: '',skills:'飞刀绝技',maxQinmi:80000,qxplace:''},
        '步惊鸿':{no: 16, id: '',skills:'九天龙吟剑法',maxQinmi:80000,qxplace:''},
        '浪唤雨':{no: 17, id: '',skills:'覆雨剑法',maxQinmi:80000,qxplace:''},
        '逆风舞':{no: 18, id: '',skills:'雪饮狂刀',maxQinmi:80000,qxplace:''},
        '火云邪神':{no: 19, id: '',skills:'如来神掌',maxQinmi:80000,qxplace:''},
        '郭济':{no: 20, id: '',skills:'排云掌法',maxQinmi:80000,qxplace:''},
        '狐苍雁':{no: 21, id: '',skills:'幽影幻虚步',maxQinmi:80000,qxplace:''},
        '护竺':{no: 22, id: '',skills:'生生造化功',maxQinmi:80000,qxplace:''},
        '风行骓':{no: 23, id: '',skills:'万流归一',maxQinmi:80000,qxplace:''},
        '吴缜':{no: 24, id: '',skills:'道种心魔经',maxQinmi:80000,qxplace:''}
    },
    qixiaArr2:[],
    qixiaArr3:[],
    qixiaplace:{
        '山坳':['jh 1;e;n;n;n;n;n'],
        '黄土小径':['jh 1;e;s;e'],
        '桃花泉':['jh 3;s;s;s;s;s;nw;n;n;e'],
        '千尺幢':['jh 4;n;n;n;n'],
        '玉女峰':['jh 4;n;n;n;n;n;n;n;n;w'],
        '长空栈道':['jh 4;n;n;n;n;n;n;n;n;n;e'],
        '临渊石台':['jh 4;n;n;n;n;n;n;n;n;n;e;n'],
        '猢狲愁':['jh 4;n;n;n;n;n;n;n;event_1_91604710;nw'],
        '潭畔草地':['jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s'],
        '沙丘小洞':['jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251'],
        '九老洞':['jh 8;w;nw;n;n;n;n;e;e;n;n;e;em1;n;em2;n;n;n;w;n;n;n;n;n;n;n;n;n;nw;sw;w;nw;w'],
        '悬根松':['jh 9;n;w'],
        '夕阳岭':['jh 9;n;n;e'],
        '青云坪':['jh 13;e;s;s;w;w'],
        '湖边':['jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w'],
        '玉壁瀑布':['jh 16;s;s;s;s;e;n;e'],
        '碧水寒潭':['jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e'],
        '寒水潭':['jh 20;w;w;s;e;s;s;s;w;s;s;s;sw;sw;s;e;se'],
        '悬崖':['jh 20;w;w;s;e;s;s;s;w;s;s;s;sw;sw;s;s;e'],
        '戈壁':['jh 21'],
        '启母石':['jh 22;n;n;w;w'],
        '无极老姆洞':['jh 22;n;n;w;n;n;n;n'],
        '山溪畔':['jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s'],
        '卢崖瀑布':['jh 22;n;n;n;ss1;n;e;n'],
        '奇槐坡':['jh 23;n;n;n;n;n;n;n;n'],
        '天梯':['jh 24;n;n;n'],
        '小洞天':['jh 24;n;n;n;n;e;e'],
        '云步桥':['jh 24;n;n;n;n;n;n;n;n;n'],
        '观景台':['jh 24;n;n;n;n;n;n;n;n;;n;n;n;n;e;e;n'],
        '危崖前':['jh 25;w'],
        '草原':['jh 26;w'],
        '无名山峡谷':['jh 29;n;n;n;n;event_1_60035830;1_event_1_65661209;1']
    },
    mijing:[
        {place:'炼丹室',short:'大厅',long:'炼丹室大厅',nums:2900},
        {place:'乔阴小村',short:'后山',long:'村庄的后山，附近有个枯井',nums:2900},
        {place:'地下迷宫',short:'地下迷宫',long:'这里没有一丝光线射入',nums:2900},
        {place:'帝龙陵',short:'陵宫入口',long:'前朝皇陵的入口',nums:2350},
        {place:'八卦门',short:'山脚',long:'这里是一座不知名的山脚',nums:3600},
        {place:'山崖',short:'密道',long:'此条密道痕迹尚新',nums:2900},
        {place:'绿水山庄',short:'绿水虹桥',long:'这座虹桥极高极长',nums:1200},
        {place:'乱石山',short:'蜿蜒小径',long:'这是一条弯弯曲曲的乱石小径',nums:2300},
        {place:'桃花渡',short:'渡口泥路',long:'这是一条通往渡口小路',nums:1700},
        {place:'佛门石窟',short:'南天门',long:'门坊乃开凿石窟时得来的石料所制',nums:2350},
        {place:'大福船',short:'沙滩',long:'迎面扑来的是粘粘的海风',nums:3050},
        {place:'滨海古城',short:'中央大街',long:'这是这座滨海古城的中心',nums:3350},
        {place:'琅嬛玉洞',short:'通道',long:'这是一条地下通道',nums:2900},
        {place:'天龙山',short:'森林',long:'狭窄的林间小道',nums:3050},
        {place:'戈壁绿洲',short:'戈壁荒漠',long:'这是一处无边无际的荒漠',nums:2000},
        {place:'蛮王城寨',short:'南蛮山林',long:'这里是南蛮地区的一处山林之地',nums:3880},
        {place:'毒瘴林',short:'丛林小道',long:'这条小道旁边丛林密布，前方好像有雾弥漫着',nums:2900},
        {place:'龙渊刀楼',short:'无涛海',long:'帆船缓缓驶抵岸边',nums:1500},
        {place:'酆都鬼城',short:'荒芜山阶',long:'此山阶非常长，而且周边异常安静',nums:3880},
        {place:'莲花山脉',short:'山脚',long:'沿着蜿蜒小径，来到山脚下',nums:2900},
        {place:'雷池山',short:'坡路',long:'一条长路斜斜地向东北方向蜿蜒而去',nums:5900},
        {place:'药王谷',short:'药王谷口',long:'这是一座山谷的谷口，从这里便能闻到一阵阵药草的香气',nums:5900},
        {place:'无尽深渊',short:'无尽深渊',long:' 这深渊充满迷雾，伸手不见五指，不知通往何方。',nums:-1}
    ],
    getQixiaListFuc(){
        var l,ll,l2,no,name,qxtemp,qm,qxplace;
        var yx = $('table')[1].rows;
        var nums = yx.length;
        qixia.qixiaArr2 = [];
        qixia.qixiaArr3 = [];
        qixia.finish = 0;
        for(var i=0;i<nums;i++){
            qxplace = yx[i].cells[2].innerText;
            l = yx[i].cells[0].children[0];
            ll = l.href.match(/qixia (.*)'/);
            no = ll[1];
            name = l.innerText;
            qixia.qixiaArr[name].no = no;
            if(l2 = yx[i].cells[0].innerText.match(/(.*)\((.*)\)(.*)/)){
                qixia.qixiaArr[name].qm = Number(l2[2]);
                if(l2[3] == '朱果')
                    qixia.finish = 1;
            }else
                qixia.qixiaArr[name].qm = 0;
            //if(qixia.qixiaArr[name].qm > 0){
            if(qixia.qixiaArr[name].qm >= 25000 && qixia.qixiaArr[name].qm < 30000)
                qm = 100000;
            else if(qixia.qixiaArr[name].qm > 30000)
                qm = 0;
            else
                qm = qixia.qixiaArr[name].qm;
            qixia.qixiaArr[name].qxplace = qxplace;
            qxtemp = {name:name,qm:qm}
            qixia.qixiaArr2.push(qxtemp)
            qixia.qixiaArr3.push({name:name,qm:qixia.qixiaArr[name].qm})
        }
        qixia.qixiaArr2.sort(compare('qm',0))
        qixia.qixiaArr3.sort(compare('qm',1))
    },
    Start(x){
        if(g_gmain.is_fighting){
            InforOutFunc('关自动状态或战斗中，奇侠暂停');
            return;
        }
        var qxtemp = '';
        if(x==1){
            qxtemp = prompt('请输入奇侠名称,如未输入或奇侠休假则自动寻找亲密度最低奇侠', '')
            if(qxtemp == null)
                return
        }
        var qixiaList = qxtemp.trim();
        clearTrigger();
        var qixiaTmp = '';
        clickButton('open jhqx');
        setTimeout(function(){
            var i,qx;
            qixia.getQixiaListFuc();
            if(qixia.finish == 1){
                InforOutFunc('今日亲密操作已满')
                qixia.QiXiaTalkFunc();
                return;
            }
            if(qixiaList != ''){
                var ll = qixiaList.split(',');
                for(i=0;i<ll.length;i++){
                    if(qx = qixia.qixiaArr[ll[i]]){
                        if(qx.qm < qx.maxQinmi)	{
                            qixiaTmp = ll[i];
                            break;
                        }
                    }else{
                        InforOutFunc('未识别的奇侠')
                        return;
                    }
                }
            }
            if(qixiaTmp != ''){
                qixia.goAsk(qixiaTmp)
            }
            else{
                for(i in qixia.qixiaArr3){
                    var tmp = qixia.qixiaArr3[i].name;
                    var qxplace = qixia.qixiaArr[tmp].qxplace;
                    if(qxplace != '师门' && qxplace != '隐居修炼'){
                        qixia.goAsk(tmp)
                        break;
                    }
                }
            }
        },2000)
    },
    goplace(place){
        if(qixia.qixiaplace[place] == undefined || qixia.qixiaplace[place] == null)
        {
            InforOutFunc('未识别的地点')
            return;
        }
        nextFun = function() {
            clickButton('find_task_road secret', 0)
            setTimeout(qixia.saodang,1000);
        };
        go2(qixia.qixiaplace[place][0])
    },
    goAsk(qixiaName,auto=1){
        if(qixia.QxTimes >= qixia.maxQxTimes)
        {
            clearTrigger();
            qixia.QiXiaTalkFunc();
            return;
        }
        qixia.auto = auto;
        if(qixia.qixiaArr[qixiaName] == undefined || qixia.qixiaArr[qixiaName] == null)
        {
            InforOutFunc('没有此奇侠资料');
            clearTrigger();
            return;
        }
        qixia.findmijing = 0;
        qixia.place = '';
        qixia.qixiaNow = qixiaName;
        qixia.qixiano = qixia.qixiaArr[qixiaName].no;
        qixia.qixiaid = qixia.qixiaArr[qixiaName].id;
        TriggerFuc = function(b) {
            if((b.get('type') == 'jh' && b.get('subtype') == 'info')){
                var objs = b.keys();
                for(var i=0;i<objs.length;i++){
                    if(objs[i] != 'npc_arrays' && objs[i].match(/npc(.*)/)){
                        var temp = b.get(objs[i]);
                        var ll = temp.split(',');
                        if(g_simul_efun.replaceControlCharBlank(ll[1]) == qixia.qixiaNow){
                            qixia.qixiaid = ll[0];
                            if(qixia.auto ==1){
                                TriggerFuc = qixia.qixiaAct;
                                temp = qixia.qixiaid.split('_');
                                if(qixia.mijingtimes < 3)
                                    clickButton('auto_zsjd20_'+temp[0], 1)
                                else if(qixia.mijingtimes == 3)
                                    clickButton('auto_zsjd20_'+temp[0], 1)
                                //else if(qixia.mijingtimes == 4 && gold15)
                                //										clickButton('auto_zsjd20_'+temp[0], 1)
                                else
                                    clickButton('auto_zsjd20_'+temp[0], 1);
                            }
                            break;
                        }
                    }
                }
            }else if(b.get('type') == 'notice' && b.get('msg').indexOf('这个奇侠还没有入世')>-1){
                InforOutFunc('奇侠不在，自动切换最低亲密奇侠')
                clearTrigger();
                //setTimeout(function(){qixia.goAsk(qixia.qixiaNow)},2*60*1000);
                qixia.Start(0);
            }
        }
        clickButton('find_task_road qixia '+qixia.qixiano, 0);
    },
    qixiaAct(b) {
        var ll,temp;
        var msg_type = b.get('type')
        var msg_subtype = b.get('subtype')
        var msg = b.get('msg');
        if (msg_type == 'main_msg' && b.get('ctype') == 'text') {
            if(msg.indexOf('亲密度操作') > -1){
                ll = msg.match(/今日亲密度操作次数\((.*)\/(.*)\)/);
                qixia.QxTimes = parseInt(ll[1]);
                qixia.maxQxTimes = parseInt(ll[2]);
                setTimeout(function(){
                    if(qixia.findmijing == 1)
                        qixia.goplace(qixia.place);
                    else{
                        if(qixia.auto ==1)
                            qixia.goAsk(qixia.qixiaNow);
                    }
                },1000);
            }
        }
        else if (msg_type == 'notice') {
            if(msg.indexOf('对你悄声道') > -1){
                ll = msg.match(/对你悄声道：你现在去(.*)，应当会有发现/);
                qixia.findmijing = 1;
                qixia.mijingtimes ++;
                qixia.place = g_simul_efun.replaceControlCharBlank(ll[1]);
            }
            else if(msg.indexOf('这个奇侠还没有入世') > -1 && msg.indexOf('此人现在已不在这儿') > -1){
                setTimeout(function(){
                    if(qixia.auto ==1){
                        clickButton('find_task_road qixia '+qixia.qixiano, 0)
                        clickButton('ask '+qixia.qixiaid);
                    }
                },3000)
            }else if(msg.indexOf('今日做了太多关于亲密度的操作') > -1){
                clearTrigger();
                closeAuto(0);
                qixia.QiXiaTalkFunc();
            }else if(msg.indexOf('你要跟谁对话') > -1){
                setTimeout(function(){
                    if(qixia.auto ==1){
                        clickButton('find_task_road qixia '+qixia.qixiano, 0)
                        clickButton('ask '+qixia.qixiaid);
                    }
                },500)
            }else if(msg.indexOf('你身上没有这么多金锭') >-1){
                clickButton('ask '+qixia.qixiaid);
            }
        }
    },
    saodang(){
        TriggerFuc = function(b) {
            var sd = '',ss = '',shortname = '',longname = '';
            var a,cname,temp,ll,i;
            if(b.get('type') == 'jh' && b.get('subtype') == 'info'){
                longname = b.get('long');
                shortname = b.get('short');
                var objs = b.keys();
                for(i=0;i<objs.length;i++){
                    if(a = objs[i].match(/cmd(.*)_name/)){
                        cname = b.get(objs[i])
                        if(cname == '仔细搜索'){
                            go('mijing_wb')
                            ss = b.get('cmd'+a[1])

                        }else if(cname.indexOf('扫荡')>-1){
                            sd = b.get('cmd'+a[1])
                        }else if(cname.indexOf('翻查')>-1){
                            clickButton(b.get('cmd'+a[1]))
                        }
                    }
                    else if(objs[i] != 'npc_arrays' && objs[i].match(/npc(.*)/) && b.get(objs[i]).indexOf('符兵') == -1 && b.get(objs[i]).indexOf('游客') == -1){
                        TriggerFuc = function(b) {
                            if((b.get('type') == 'vs' && b.get('subtype') == 'combat_result') ||(b.get('type')=='notice' &&b.get('msg').indexOf('这儿没有这个人')>-1)){
                                setTimeout(qixia.saodang, 1000);
                            }
                        }
                        temp = b.get(objs[i]);
                        ll = temp.split(',');
                        clickButton('kill ' +ll[0]);
                        return;

                    }else if(objs[i].match(/item(.*)/)){
                        temp = b.get(objs[i]);
                        ll = temp.split(',');
                        clickButton('get ' +ll[0]);
                    }
                }
                clickButton(ss);
                qixia.sd_act = sd;
                if(b.get('map_id') == 'public')
                {
                    clearTrigger();
                    qixia.goAsk(qixia.qixiaNow);
                    return;
                }else if(sd == ''){
                    clearTrigger();
                    if(shortname == '无尽深渊')
                    {
                        TriggerFuc = function(b){
                            if(b.get('type') == 'jh' && b.get('subtype') == 'info'){
                                var objs = b.keys();
                                for(var i=0;i<objs.length;i++){
                                    if(a = objs[i].match(/cmd(.*)_name/)){
                                        cname = b.get(objs[i])
                                        if(cname.indexOf('翻查')>-1){
                                            clickButton(b.get('cmd'+a[1]))
                                            break;
                                        }
                                    }
                                }
                            }
                            else if(b.get('type') == 'vs' && b.get('subtype') == 'combat_result'){
                                qixia.goAsk(qixia.qixiaNow)
                            }
                        }
                        cmdDelayTime = 500;
                        nextFun = function(){cmdDelayTime = 200}
                        go2('e;e;s;w;w;s;s;e;n;e;s;e;e;n;w;n;e;n;w;fight henshan_guguai_laozhe')
                        return;
                    }
                    InforOutFunc('此副本未通关或者还不能扫荡');
                    return;
                }
                var findmj = 0;
                for(i=0;i<qixia.mijing.length;i++){
                    if(qixia.mijing[i].short == shortname){
                        if(longname.indexOf(qixia.mijing[i].long)>-1){
                            qixia.sd_nums = qixia.mijing[i].nums
                            findmj = 1
                        }
                    }
                }
                if(findmj == 0){
                    clearTrigger();
                    InforOutFunc('没有记录的地点');
                    return;
                }
                TriggerFuc = function(b) {
                    var a;
                    if(b.get('type') == 'prompt'){
                        if(a = b.get('msg').match(/朱果x(.*)。/)){
                            var nums = Number(a[1])
                            if(nums > qixia.sd_nums){
                                clearTrigger()
                                clickButton(b.get('cmd1'))
                                setTimeout(function(){qixia.goAsk(qixia.qixiaNow)},1000)

                            }
                            else{
                                setTimeout(function(){clickButton(qixia.sd_act)},300)

                            }
                        }
                    }
                }
                clickButton(qixia.sd_act);
            }
        }
        clickButton('golook_room');
    },
    QiXiaTalkFunc() {
        clickButton('open jhqx');
        setTimeout(function(){
            qixia.getQixiaListFuc();
            qixia.qxTalkIndex = 0;
            qixia.talk2QiXiabyName(qixia.qixiaArr2[qixia.qxTalkIndex].name)
        },2000)
    },
    talk2QiXiabyName(localname) {
        var qixianpc;
        qixia.TKqixiaid = '';
        qixia.TKqxname = localname;
        if(qixianpc = qixia.qixiaArr[qixia.TKqxname]){
            if(qixianpc.qm < qixianpc.maxQinmi){
                TriggerFuc = function(b){
                    if((b.get('type') == 'jh' && b.get('subtype') == 'info')){
                        var objs = b.keys();
                        for(var i=0;i<objs.length;i++){
                            if(objs[i] != 'npc_arrays' && objs[i].match(/npc(.*)/)){
                                var temp = b.get(objs[i]);
                                var ll = temp.split(',');
                                if(g_simul_efun.replaceControlCharBlank(ll[1]) == qixia.TKqxname){
                                    qixia.TKqixiaid = ll[0];
                                    break;
                                }
                            }
                        }
                        //奇侠对话朱果
                        if(qixia.TKqixiaid != ''){
                            nextFun = function() {
                                clearTrigger()
                                qixia.qxTalkIndex ++
                                if(qixia.qxTalkIndex < qixia.qixiaArr2.length)
                                    qixia.talk2QiXiabyName(qixia.qixiaArr2[qixia.qxTalkIndex].name)
                            };
                            go2('#5 ask ' + qixia.TKqixiaid)
                        }
                    }else if(b.get('type') == 'notice' && b.get('msg').indexOf('这个奇侠还没有入世')>-1){
                        console.log(qixia.TKqxname+'不在');
                        clickButton('open jhqx ' + qixianpc.no)
                        qixia.qxTalkIndex ++
                        if(qixia.qxTalkIndex < qixia.qixiaArr2.length)
                            setTimeout(function(){qixia.talk2QiXiabyName(qixia.qixiaArr2[qixia.qxTalkIndex].name)},500)
                        //else
                        //go2('home')
                    }

                    if(b.get('type') == 'notice' && b.get('msg').indexOf('此人现在已不在这儿了。')>-1){
                        clearTrigger()
                        setTimeout(function (){qixia.talk2QiXiabyName(localname)},500)
                    }
                }
                clickButton('find_task_road qixia ' + qixianpc.no)
            }else{
                clickButton('open jhqx ' + qixianpc.no)
                qixia.qxTalkIndex ++
                if(qixia.qxTalkIndex < qixia.qixiaArr2.length)
                    setTimeout(function(){qixia.talk2QiXiabyName(qixia.qixiaArr2[qixia.qxTalkIndex].name)},300)
                //else
                //go2('home')
            }
        }
        else
            InforOutFunc('没有找到该奇侠：' + qixia.TKqxname + ' ！')
    },
}

function RecoveryAll(next=function(){}) {
    //clearTimeout(kfTimeout)
    var r_kee = user_maxkee - user_kee;
    var r_force = user_maxforce - user_force;
    var m = 0;
    if(r_kee > 100 && user_force/user_maxforce>1/3){
        clickButton('recovery')
        clickButton('recovery')
        clickButton('recovery')
    }
    else if (r_force > 80000) {
        clickButton('items use snow_wannianlingzhi');
        clickButton('items use snow_wannianlingzhi');
        clickButton('items use snow_wannianlingzhi');
    }
    else if (r_force > 50000) {
        clickButton('items use snow_wannianlingzhi');
        clickButton('items use snow_wannianlingzhi');
    }
    else if (r_force > 25000) {
        clickButton('items use snow_wannianlingzhi');
    } else if (r_force > 9000) {
        clickButton('items use snow_qiannianlingzhi');
        clickButton('items use snow_qiannianlingzhi');
    }
    else if (r_force > 5000)
        clickButton('items use snow_qiannianlingzhi');
    else
        m = 1;
    if(m==0){
        setTimeout(function(){RecoveryAll(next)},600)
    }else{
        next()
    }
}

var teamjob={
    jobArr:[
        //红螺9
        {name:'红螺9',map_id:"jingcheng",short:'红螺寺',path:'jh 49;#9 n;w;w;nw;w;n;n;n;w;nw;nw;nw;n',order:'event_1_21438965',kill:'jingcheng_qinzhonghai',lingjiang:'event_1_37448022',next:false},
        //铁剑
        {name:'铁剑',map_id:"xiliangcheng",short:'正堂',path:'jh 47,ne,n,n,n,ne,ne,e,e,e,e,ne,n,ne,n,n,n,n,n,nw,nw,ne,n,ne,n',order:'event_1_10117215',kill:false,lingjiang:false,next:false},
        //白猿
        {name:'挑战白猿',map_id:"yuewangjiangong",short:'竹林',path:'jh 50;ne;ne;#3 n;#3 ne;#3 n;items get_store /obj/snmf/bianhuan',order:'event_1_86676244',kill:false,lingjiang:false,next:false},
        //绝杀
        {name:'绝杀',map_id:"haiyunge",short:'海云堂',path:'jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n',order:'event_1_33144912',kill:false,lingjiang:false,next:false},
        //木人18
        {name:'木人18',map_id:"baidicheng",short:'璇玑地阁',path:'jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;',order:'event_1_85950082',kill:false,lingjiang:false,next:false},
        {name:'剑楼9',map_id:"yuewangjiangong",short:'越女剑楼',path:'jh 50;ne;ne;#3 n;#3 ne;#3 se;#4 s;se;se;e;#8 n;w',order:'event_1_53092576',kill:'yuewangjiangong_aqing',lingjiang:'event_1_28607033',next:false},
        //本10
        {name:'本10',map_id:"sizhanguangmingding",short:'山下',path:'fb 10',order:'golook_room',kill:false,lingjiang:false,
         next:{
             0:'fb 10;event_1_31980331;kill sizhanguangmingding_jumuqijiang;fb 10;event_1_23348240;kill sizhanguangmingding_hongshuiqijiang;fb 10;event_1_84015482;kill sizhanguangmingding_ruijinqijiang;fb 10;event_1_25800358;kill sizhanguangmingding_houtuqijiang;event_1_24864938;kill sizhanguangmingding_kunlunjianke;fb 10;event_1_31980331;event_1_98378977;kill sizhanguangmingding_liehuoqijiang;event_1_5376728;kill sizhanguangmingding_emeijiannv;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;event_1_5914414',
             1:'event_1_31980331;kill sizhanguangmingding_jumuqijiang;event_1_98378977;kill sizhanguangmingding_liehuoqijiang;event_1_5376728;kill sizhanguangmingding_emeijiannv;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;event_1_5914414',
             2:'event_1_23348240;kill sizhanguangmingding_hongshuiqijiang;event_1_26309841;kill sizhanguangmingding_kunlunjianke;event_1_75397642;kill sizhanguangmingding_emeijiannv;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;event_1_5914414',
             3:'event_1_84015482;kill sizhanguangmingding_ruijinqijiang;event_1_5916858;kill sizhanguangmingding_liehuoqijiang;event_1_5376728;kill sizhanguangmingding_emeijiannv;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;event_1_5914414',
             4:'event_1_25800358;kill sizhanguangmingding_houtuqijiang;event_1_24864938;kill sizhanguangmingding_kunlunjianke;event_1_75397642;kill sizhanguangmingding_emeijiannv;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;event_1_5914414',
         }
        },
    ],
    job:{},
    men:1,
    go(n=0){
        teamjob.job = teamjob.jobArr[n];
        if(teamjob.job.next){
            let n=prompt("请输入进哪个门，例如第一个门输入1，如果单挑请输入0","");
            if(n==null){
                return;
            }
            teamjob.men = n;
            if(teamjob.men == 0){
                go2(teamjob.job.next[teamjob.men]);
                return;
            }
        }
        TriggerFuc = teamjob.ready;
        clickButton('team');
        setTimeout(go2,1000,teamjob.job.path);
    },
    ready(b){
        let type = b.get('type'),subtype = b.get('subtype');
        let i=0,tmp='',ll;
        if(type == 'jh' && subtype == 'info'){
            if(b.get('map_id') != teamjob.job.map_id || b.get('short') != teamjob.job.short)
                return;

            //
            let team = g_obj_map.get("msg_team");
            if(team.get("is_member_of")!=1 || team.get("is_leader") != 1){
                return;//非队长不予处理
            }
            let teamMember = [];
            for(i=2;i<=team.get("member_num");i++){
                tmp = team.get("member"+i).split(',')
                //console.log(team.get("member"+i))
                //console.log(tmp)
                teamMember.push(tmp[0])
            }
            let objs = b.keys();
            let n=0;
            let m=0;
            for(i=0;i<objs.length;i++){
                if(teamjob.job.name == '挑战白猿' && objs[i].match(/cmd.*name/) && b.get(objs[i]) == '挑战白猿'){
                    m = 1;
                }
                if(objs[i].indexOf('user') == 0){
                    if(teamMember.indexOf(b.get(objs[i]).split(',')[0])>=0){
                        n++;
                    }
                }
            }
            if(teamjob.job.name == '挑战白猿' && m==0){
                return;
            }
            //console.log(teamMember)
            //console.log(n)
            if(n == teamMember.length){//人到齐
                if(teamjob.job.order !='') clickButton(teamjob.job.order)
                if(teamjob.job.kill)
                    clickButton('team chat teamkill'+teamjob.job.kill)
                else if(teamjob.job.next){
                    clickButton('team chat gonext')
                }
            }else{
                clearTrigger()
                setTimeout(function(){
                    TriggerFuc = teamjob.ready;
                    clickButton('golook_room');
                },3000)
                return;
            }
        }
        else if(type == 'main_msg'){
            if(ll = b.get('msg').match(/【队伍】.*?：teamkill(.*)/)){
                clickButton('kill '+ll[1]);
            }else if(ll = b.get('msg').match(/【队伍】.*?：gonext/)){
                TriggerFuc = function(){};
                nextFun = teamjob.end;
                //console.log(teamjob.men)
                //console.log(teamjob.job.next[teamjob.men])
                go2(teamjob.job.next[teamjob.men]);
            }
        }else if(type == 'vs' && b.get('subtype') == 'combat_result'){
            teamjob.end()
        }else if(type == 'notice' && b.get('msg').indexOf('这儿没有这个人')>=0){
            teamjob.end()
        }
    },
    end(){
        clearTrigger()
        if(teamjob.job.lingjiang)
            clickButton(teamjob.job.lingjiang);
        setTimeout(teamjob.nextjob,1000)
    },
    nextjob(){},
}

var xueyeTrigger = 0;
var kfTimeout=null;
var xueye = {
    start:0,
    zhenying:[
        {//千夜
            fx:'s',
            npc:'xueyeyanyue_yanyuezhenwei',
            wushen:'xueyeyanyue_yanyuewushen',
        },
        {//偃月
            fx:'n',
            npc:'xueyeyanyue_qianyezhenwei',
            wushen:'xueyeyanyue_qianyemoshen',
        },
    ],
    xy:{},
    teamList:[],
    killid:'',
    ready(){
        if(g_obj_map.get('msg_status').get('area') != '100000'){
            InforOutFunc('只有在跨服才可以开启血液')
            return;
        }
        console.log('血液准备')
        xueye.teamList = [];
        TriggerFuc=function(b){
            var type = b.get('type');
            var msg = b.get('msg');
            if(type=='jh' && b.get('subtype') == 'info'){
                var place = g_simul_efun.replaceControlCharBlank(b.get('short'));
                if(place == '千夜陵'){
                    xueye.xy=xueye.zhenying[0];
                    xueye.go();
                    clearTimeout(kfTimeout)
                    return;
                }
                else if(place == '掩月宫'){
                    xueye.xy=xueye.zhenying[1];
                    xueye.go();
                    clearTimeout(kfTimeout)
                    return;
                }
            }else if(type == 'main_msg' || type == 'notice'){
                if(msg.match('【血夜掩月】第(.?)轮对战失败获得') || msg.indexOf('【血夜掩月】第4轮对战胜利获得')>=0){
                    //	console.log(msg)
                    console.log('血液结束')
                    clearTrigger();
                    xueye.start = 0;
                    return;
                }
            }
            //失败
            clearTimeout(kfTimeout)
            kfTimeout = setTimeout(clickButton,3000,'golook_room')
        }
        clickButton('golook_room')
    },
    go(){
        clearTrigger();
        TriggerFuc = function(b){
            var type = b.get('type');
            var subtype = b.get('subtype');
            var i,ll,tmp,objs,msg=b.get('msg');
            if(type=='jh' && b.get('subtype') == 'info'){
                var place = g_simul_efun.replaceControlCharBlank(b.get('short'));
                //console.log(place);
                if(place.indexOf('千夜') == -1
                   && place.indexOf('掩月') == -1
                   && place.indexOf('新月') == -1
                   && place.indexOf('真武') == -1
                   && place.indexOf('白夜') == -1
                  ){
                    clearTrigger();
                    xueye.ready();
                    return;
                }
                objs = b.keys();
                var n=0;
                for(i=0;i<objs.length;i++){
                    if(objs[i].indexOf('npc')==0){
                        tmp = b.get(objs[i]);
                        if(tmp.indexOf(xueye.xy.npc) >= 0){
                            xueye.killid = xueye.xy.npc;
                            n++;
                            break;
                        }
                        if(tmp.indexOf(xueye.xy.wushen) >= 0){
                            xueye.killid = xueye.xy.wushen;
                            n++;
                            break;
                        }
                    }else if(objs[i].indexOf('user')==0){

                        tmp = b.get(objs[i]).split(',');
                        //console.log(tmp[0])
                        //console.log(xueye.teamList)
                        if(xueye.teamList.indexOf(tmp[0])==-1){
                            xueye.killid=tmp[0];
                            n++;
                            break;
                        }
                    }
                }
                if(n>0){
                    console.log('发现敌人');
                    clickButton('kill '+xueye.killid);
                }else{
                    console.log('前进')
                    setTimeout(clickButton,200,xueye.xy.fx)
                }
            }else if(type == 'notice'){
                if(msg.indexOf('必须杀掉所有敌人才能离开')>=0 || msg.indexOf('这儿没有这个人')>=0){
                    setTimeout(clickButton,200,'golook_room')
                }else if(msg.indexOf('不能杀自己方的战友')>=0){
                    xueye.teamList.push(xueye.killid)
                    setTimeout(clickButton,200,'golook_room')
                }else if(ll = msg.match(/才可以离开复活点，目前还剩余(.*)秒/)){
                    console.log('要等会儿才能离开复活点');
                    setTimeout(clickButton,(Number(ll[1])+1)*1000,xueye.xy.fx)
                }else if(msg.indexOf('你败出此战场中，不能重新进入')>=0){
                    setTimeout(clickButton,2000,'golook_room')
                }
            }else if(type == 'vs'){
                if(subtype == 'die' && g_obj_map.get("msg_attrs").get('id') == b.get('uid')){
                    console.log('你挂了');
                    clearTrigger();
                    RecoveryAll(xueye.go);
                }else if(subtype == 'combat_result'){
                    //clearTrigger();
                    console.log('战斗结束，胜利')
                    clickButton('golook_room')
                }
            }
        }
        //clickButton(xueye.xy.fx)
        clickButton('golook_room')
    },
}
var wushi = {lingjiang:0,start:0,npc:''}
function showStatus(){
    let txt = "<br>";
    let done='';
    let noget='';
    for(let i=0;i<qianlongList.length;i++){
        let tmp = qianlongList[i]
        if(lj_paras.wushi[tmp.id]){
            if(done=='')
                done += tmp.name;
            else
                done += '，'+tmp.name;
        }else{
            if(noget=='')
                noget += tmp.name;
            else
                noget += '，'+tmp.name;
        }
    }

    if(done == '') done = '还没开始 \(╯-╰)/'
    if(noget == '') noget = '都搞定啦  └(^o^)┘';

    let tf = '';
    if(lj_paras.TfTimes==0)
        tf = '未开始';
    else
        tf = lj_paras.TfTimes+'/'+lj_paras.maxTfTimes;
    let xs = '';
    if(lj_paras.XSTimes==0)
        xs = '未开始';
    else
        xs = lj_paras.XSTimes+'/'+lj_paras.maxXSTimes;
    g_gmain.recvNetWork2(g_obj_map.get("msg_attrs").get('name')+'('+g_obj_map.get("msg_attrs").get('id')+')'
                         +"：<br><span style='color:rgb(0, 140, 200)'>逃犯："+tf
                         //+"：</span><span style='color:rgb(0, 140, 200)'>雪山："+xs
                         +"：</span><span style='color:rgb(0, 140, 200)'>拼图："+lj_paras.ptTimes+"/"+lj_paras.maxptTimes
                         +"</span><br>"
                         //+"</span><br><span style='color:rgb(0, 140, 200)'>五鼠积分："+lj_paras.wushujifen+"：展昭："+lj_paras.zhanzhao+"/3：五鼠："+lj_paras.wushu+"</span><br>"
                         +"<span style='color:rgb(0, 170, 0)'>已完成潜龙："+done
                         +"</span><br><span style='color:rgb(255, 100, 30)'>未完成潜龙："
                         +noget+"</span>");
}

var tianjiangu = {
    killType:1,//0 全杀，1只杀小兵，2只杀四虹，3杀四虹和天剑
    state:0,//0未启动，1启动
    direction:["west","east","south","north","southwest","southeast","northeast","northwest"],
    npcList:[],
    path:'',
    places:'巨石，小木屋，湖边，山洞，隘口',
    start(){
        if(!g_obj_map.get("msg_team")){
            clickButton('team')
            setTimeout(tianjiangu.start,500)
            return;
        }
        let tj=prompt("选择杀怪类型：0，全杀，1只杀小兵，2只杀四虹，3杀四虹和天剑","3");
        if(tj == null) return;
        //btnList["天剑谷"].innerText = '停天剑谷'
        tianjiangu.killType = Number(tj);
        tianjiangu.state = 1;
        TriggerFuc = tianjiangu.find;
        clickButton('golook_room')
    },
    find(b){
        let type = b.get('type')
        if(b.get('type') == 'jh' && b.get('subtype') == 'info'){
            let objs = b.keys();
            let pathList = [];
            tianjiangu.path = '';
            tianjiangu.npcList = [];
            for(let i=0;i<objs.length;i++){
                if(objs[i].indexOf('npc')==0){
                    let npc=b.get(objs[i])
                    let tmp = npc.split(',')
                    let npcName = tmp[1]
                    let npcCode = tmp[0]
                    if(npcName.indexOf('符兵')>=0)
                        continue;
                    if(npcName == '天剑谷卫士' && tianjiangu.killType <2)
                        tianjiangu.npcList.push(npcCode)
                    else if(npcName.indexOf('虹')>=0 && tianjiangu.killType != 1)
                        tianjiangu.npcList.unshift(npcCode)
                    else if((npcName == '天剑')&& (tianjiangu.killType == 3 || tianjiangu.killType == 0))
                        tianjiangu.npcList.unshift(npcCode)
                }
                else if(tianjiangu.direction.indexOf(objs[i])>=0){
                    let place = b.get(objs[i]);
                    //'巨石，小木屋，湖边，山洞，隘口'
                    if(place != b.get('short') && tianjiangu.places.indexOf(place) >=0){
                        tianjiangu.path = objs[i]
                    }else{
                        pathList.push(objs[i])
                    }
                }
            }
            if(tianjiangu.npcList.length>0){
                let killnpc = tianjiangu.npcList.shift()
                TriggerFuc = tianjiangu.kill;
                clickButton('kill '+ killnpc)
                return;
            }

            if(g_obj_map.get("msg_team").get("is_leader") != "1")
                return;
            //没有目标，开始判断路径

            if(tianjiangu.path == ''){
                if(pathList.length>0){
                    let n = Math.round(Math.random()*(pathList.length-1))
                    tianjiangu.path = pathList[n]
                }else
                    tianjiangu.path = 'east'
            }
            setTimeout(function(){
                clickButton('go '+tianjiangu.path)
            },250)
        }else if(b.get('type') == 'notice' && b.get('msg').indexOf('这儿没有这个方向')>-1){
            setTimeout(clickButton,250,'golook_room')
            //clickButton('golook_room')
        }
    },
    kill(b){
        let type = b.get('type')
        let subtype = b.get('subtype')
        let msg = b.get('msg')
        if((type == 'vs' && subtype == 'combat_result')
           || (type=='notice' && (msg.indexOf('这儿没有这个人')>-1 || msg.indexOf('你要杀谁？')>-1))
          ){
            TriggerFuc = tianjiangu.find;
            clickButton('golook_room')
        }else if(type=='notice' && (msg.indexOf('已经太多人了')>-1 || msg.indexOf('击杀请求过于频繁')>-1)){
            TriggerFuc = null;
            let killnpc = tianjiangu.npcList.length>0?tianjiangu.npcList.shift():'';
            setTimeout(function(){
                TriggerFuc = tianjiangu.kill;
                clickButton('kill '+ killnpc)
            },250)
        }
    },
    end(){
        clearTrigger()
        tianjiangu.state = 0;
        //btnList["天剑谷"].innerText = '天剑谷'
    }
}

var useItems={
    boxList:['baiyin box','obj_qingmubaoxiang','obj_chilibaoxiang','huangjin box','obj_box3','obj_yaoyubaoxiang','obj_mijimuhe'],
    start(){
        let n=prompt("选择箱子：0白银，1青木，2赤璃，3黄金，4铂金，5曜玉，6秘籍木盒","0");
        if(n == null) return;
        n = Number(n);
        let box=useItems.boxList[n];
        let num=prompt("选择开箱子数量","");
        if(!num) return;
        num = Number(num);
        if(n>2){
            go3('#'+num +' items use '+box)
            return;
        }

        let d = Math.floor(num/100)
        if(d>0) go3('#'+d +' items use '+box+'_N_100')
        num = num%100;
        d = Math.floor(num/50)
        if(d>0) go3('#'+d +' items use '+box+'_N_50')

        num = num%50;
        d = Math.floor(num/10)
        if(d>0) go3('#'+d +' items use '+box+'_N_10')
        d = num%10;
        if(d>0) go3('#'+d +' items use '+box)
    },
}


function teachYouxia(){
    let skillList = $('table')[2].rows;
    let x = 0;
    for(let i=0;i<skillList.length;i++){
        if($('table')[2].rows[i].cells[1].children[0] == undefined)
            continue;
        let b = $('table')[2].rows[i].cells[1].innerHTML;
        let ll =b.match(/授(.*)clickButton\('(.*)', 0\)/);
        if(!ll) return;
        //console.log(i)
        //console.log(ll)
        let cmd = ll[2]+'0';
        //			console.log(cmd)
        let a = $('table')[2].rows[i].cells[0].children[0].innerText;
        ll=a.match(/ (.*)\/(.*)级/);
        let n = (Number(ll[2]) - Number(ll[1]))/100;
        n=Math.ceil(n);
        if(n>0){
            go2('#'+n+' '+cmd);
            x++;
        }
    }
    if(x==0)
        InforOutFunc('没有可传授技能')
}

function upgradeYouxia(){
    let skillList = $('table')[3].rows
    let x = 0
    let menkeList = ['神仙姐姐王语嫣','【丞相】范蠡','【药仙子】程灵素','【玉盏清露】水灵光','【翠羽黄衫】霍青桐','【夜仙子】石青璇','【红袖添香】李红袖','【天刀仙子】宋玉致','【医圣】华佗','【天玑楼主】鲁妙子','【巧笑倩兮】顾倩兮','【在水一方】水笙','【美人儿】林仙儿','【小东邪】郭襄','【落花独立】程瑛','【魔仙子】任盈盈','【雁双飞】阿朱','【禅仙子】袁紫衣','【敏敏郡主】赵敏','【圣女】小昭','【鹿鼎公】韦小宝']
    let upList = []
    let str = ""
    if($('table')[3].rows[0].cells[0].innerText === '游侠'){
        for(let i=0;i<skillList.length;i++){
            if(i == 0 || $('table')[3].rows[i].cells[1] == undefined)
                continue
            //let b = $('table')[3].rows[i].cells[1].innerHTML;
            let youxia = $('table')[3].rows[i].cells[0].innerText
            let level = Number($('table')[3].rows[i].cells[2].innerText)
            if(menkeList.indexOf(youxia)>=0)
                continue
            let b = $('table')[3].rows[i].cells[4].innerHTML
            //<a style="text-decoration:underline;color:cyan" href="javascript:clickButton('fudi juxian view chuliuxiang', 0);">查看</a>"
            let ll = b.match(/clickButton\('fudi juxian view (.*)', 0\).*查看/)
            if(!ll) continue;
            if(level >= 2000)
                continue
            let tmp = {name:youxia,id:ll[1]}
            upList.push(tmp)
            str += x + " " + youxia +'，'
            x ++
        }
    }
    if(x==0){
        InforOutFunc('没有可升级游侠')
        return
    }
    console.log(str)
    console.log(upList)
    //console.log(upList[index].id)
    go2('#5 fudi juxian upgrade go '+upList[0].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[1].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[2].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[3].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[4].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[5].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[6].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[7].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[8].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[9].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[10].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[11].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[12].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[13].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[14].id + ' 100')
    go2('#5 fudi juxian upgrade go '+upList[15].id + ' 100')
}

var myskills = {}
function learnSkill(){
    this.npcs = [];
    TriggerFuc = function(b){
        var type = b.get('type')
        var objs,value,ll,level;
        if(type == 'skills'){
            if(b.get('id') && b.get('id') == g_obj_map.get("msg_attrs").get('id')){
                objs = b.keys();
                for(var i=0;i<objs.length;i++){
                    if(objs[i].substr(0,5) == 'skill'){
                        value = b.get(objs[i])
                        ll = value.split(',')
                        myskills[ll[0]] = parseInt(ll[2])
                    }
                }
                clearTrigger()
                TriggerFuc = this.masterskill
                clickButton('skills '+g_obj_map.get("msg_attrs").get('master_id'))
            }
        }
    }
    this.masterskill = function(b){
        var type = b.get('type')
        var objs,value,ll,level;
        if(type == 'master_skills'){
            clearTrigger()
            objs = b.keys();
            var n=0;
            for(var i=0;i<objs.length;i++){
                if(objs[i].substr(0,5) == 'skill'){
                    value = b.get(objs[i])
                    ll = value.split(',')
                    if(myskills[ll[0]] == undefined){
                        myskills[ll[0]] = 0
                    }

                    level = parseInt(ll[2]) - myskills[ll[0]]
                    if(parseInt(ll[2]) > myskills[ll[0]]){
                        n++;
                        console.log('学习'+level+'级'+ll[0])
                        for(var j=0;j<Math.ceil(level/10);j++){
                            go('learn '+ll[0]+' from '+b.get('id')+' to 10')
                        }
                    }
                }
            }
            if(n == 0){
                InforOutFunc('你的师傅已经没有什么可教你的了')
            }else
                clickButton('enable mapped_skills restore go 1');
        }else if(type == 'notice' && b.get('msg').indexOf('这儿没有这个人')>-1){
            InforOutFunc('没有找到师傅')
            clearTrigger()
        }
    }
    clickButton('skills')
    clickButton('golook_room')
}

/*
	function saveOption(obj,x=0){
		//localStorage.setItem(name,JSON.stringify(obj))
		name = g_obj_map.get("msg_attrs").get('id')+'_save'
		//console.log(name)

		//console.log(obj)
		//console.log(name + ' '+x)
		localStorage.setItem(name,JSON.stringify(obj))
		if(x==0) return;
		var param = {
			types:'saveOption',
			userID:g_obj_map.get("msg_attrs").get('id'),
			//userName:username,
			userName:g_simul_efun.replaceControlCharBlank(g_obj_map.get("msg_attrs").get('name')),
			option:'',
			paras:JSON.stringify(obj),
			qu:g_area_id,
		}
		//console.log('保存到服务器')
		//console.log(lj_paras)
		_$(url, param)
	}

	var tryTimes = 0;
	function getOption(x=0){
		if(!g_obj_map.get("msg_attrs") || !g_obj_map.get("msg_attrs").get('id')){
			setTimeout(getOption,200,x)
			console.log('未加载完成')
			return;
		}
		let name = g_simul_efun.replaceControlCharBlank(g_obj_map.get("msg_attrs").get('name'))
		InforOutFunc(name+'：开始同步数据。。。')
		if(temp = JSON.parse(localStorage.getItem(g_obj_map.get("msg_attrs").get('id')+'_save'))){
			//console.log(g_obj_map.get("msg_attrs").get('id')+'_save')
			console.log('读取本地数据')
			for(let i in temp){
				lj_paras[i] = temp[i]
			}
			if(x==1) setButtonOption()
		}
		//console.log('准备从服务器获取数据')
		//console.log(lj_paras)
		let param = {
			types:'getOption',
			userID:g_obj_map.get("msg_attrs").get('id'),
			qu:g_area_id,
		}
		connectTime = new Date().getTime();
		_$(url, param, function(data){
			//console.log(data)
			//console.log('urlx:'+x)
			let userdata = data.data;
			let temp = null;
			if(userdata.userParas){
				temp = JSON.parse(userdata.userParas)
				//console.log(temp)
				for(i in temp){
					if(i != 'options' && i !='huixue' && i != 'huinei')
						lj_paras[i] = temp[i]
				}
				//saveOption(lj_paras)
				InforOutFunc('同步数据成功')
			}else{
				InforOutFunc('此id没有存储数据')
			}

			tryTimes = 0;
			if(x==1){
				//InforOutFunc('开启计时')
				setTimeout(resettimes,1000);
			}
		},
		function(){
			if(tryTimes<=3){
				InforOutFunc('网络同步数据失败，稍后重试')
				setTimeout(getOption,2000,x);
				tryTimes++;
			}
			else{
				InforOutFunc('无法获取同步数据')
				if(x==1) setTimeout(resettimes,1000);
				tryTimes=0;
			}
		})
	}
	function setButtonOption(){
		let arr = lj_paras.options.split(',')
		arr.forEach(function(val){
			//console.log(val)
			if(val)
				ButtonManager.clickButtonById(val);
		})
		if(lj_paras.huixue) ButtonManager.clickButtonById(lj_paras.huixue);
		if(lj_paras.huinei) ButtonManager.clickButtonById(lj_paras.huinei);
	}

	function parasOptions(v,n){
		let arr =[];
		if(lj_paras.options != '')
			arr = lj_paras.options.split(',')
		let c = arr.indexOf(v)
		if(c>=0){//存在
			if(n==0)	//删除
				arr.splice(c,1);
		}else{
			if(n==1)	//添加
				arr.push(v)
		}
		lj_paras.options = arr.join(',');
		saveOption(lj_paras)
	}
*/
var resetTimer=null;
function resettimes() {
    //北京时间
    var day = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
    var time1 = day.format("hh:mm");
    var today = day.format("yyyy-MM-dd");
    var week = day.getDay();
    if(time1 >= '00:00' && time1 < '05:50')
        today = new Date(day-24*60*60*1000).format("yyyy-MM-dd");
    if (time1 >= '05:50' && time1 < '06:00') {
        if (lj_paras.newday.substr(-2) == '_0') {
            lj_paras.newday = today+'_1';
            clickButton('score');
            clickButton('vip');
            clearTrigger()
            setTimeout(function(){
                var bad = 1;
                go2('vip drops');
                var shen = parseInt(g_obj_map.get('msg_score').get('shen'));

                console.log('vip点掉剩余正邪、暴击、逃犯、打榜次数');
                //if(user_yuanbao > lj_option.minYuanbao){
                go2('clan fb go_saodang shenshousenlin')	//扫荡帮派副本1
                go2('clan fb go_saodang shenshousenlin')	//扫荡帮派副本1
                //go2('clan fb go_saodang daxuemangongdao')	//扫荡帮派副本2
                //go2('clan fb go_saodang daxuemangongdao')	//扫荡帮派副本2
                go2('clan fb go_saodang longwulianmoge')	//扫荡帮本3
                go2('clan fb go_saodang longwulianmoge')	//扫荡帮本3
                //}
                //for (var i = 0; i < jobnums('badd_task'); i++)//正邪
                //	go2('vip finish_bad ' + bad);
                //console.log('vip finish_bad ' + bad+' --- '+jobnums('badd_task')+'次')
                let tmp = jobnums('do_task_num');
                let i=0;
                if(tmp > 10) tmp = 10
                for (i = 0; i < tmp; i++)//暴击谜题
                    go2('vip finish_big_task');
                for (i = 0; i < jobnums('do_task_num'); i++)//谜题
                    go2('vip finish_task');
                for (i = 0; i < jobnums('taofan_task'); i++)//逃犯
                    go2('vip finish_taofan ' + bad);
                for (i = 0; i < jobnums('finish_sort'); i++)//打榜
                    go2('vip finish_sort');
                for(i=0;i<4;i++)	//拼图
                    go2('clan bzmt puzz');

                //独龙寨
                for (i = 0; i < jobnums('saodang_fb_1'); i++) {
                    go2('vip finish_fb dulongzhai');
                }
                //军营	junying
                for (i = 0; i < jobnums('saodang_fb_2'); i++) {
                    go2('vip finish_fb junying');
                }
                //北斗	beidou
                for (i = 0; i < jobnums('saodang_fb_3'); i++) {
                    go2('vip finish_fb beidou');
                }
                //幽灵	youling
                for (i = 0; i < jobnums('saodang_fb_4'); i++) {
                    go2('vip finish_fb youling');
                };
                //本5
                for (i = 0; i < jobnums('saodang_fb_5'); i++) {
                    go2('vip finish_fb siyu');
                };
                //本6
                for (i = 0; i < jobnums('saodang_fb_6'); i++) {
                    go2('vip finish_fb changleweiyang');
                };
                //本7
                for (i = 0; i < jobnums('saodang_fb_7'); i++) {
                    go2('vip finish_fb heishuihuangling');
                };
                //本8
                for (i = 0; i < jobnums('saodang_fb_8'); i++) {
                    go2('vip finish_fb jiandangfenglingdu');
                };
                //本9
                for (i = 0; i < jobnums('saodang_fb_9'); i++) {
                    go2('vip finish_fb tianshanlongxue');
                };
                //本10
                for (i = 0; i < jobnums('saodang_fb_10'); i++) {
                    go2('vip finish_fb sizhanguangmingding');
                };
                if(!g_gmain.is_fighting){
                    go2('jh 1,wsnjc clan;wsnjc user,e,n,n,n,w,event_1_47493781,event_1_88213675');
                    go2('jh 17;n;event_1_55568398;event_1_36603700')
                    go2('jh 5,n,n,n,w,sign7,home,sleep_hanyuchuang');
                    //gonext();
                }
            },2000)
        }
    }else{
        if (lj_paras.newday != today+'_0') {//每日初始化
            //console.log(lj_paras.newday)
            //console.log(today+'_0')
            console.log('每日初始化参数')
            InforOutFunc('每日初始化参数')
            lj_paras.newday = today+'_0';
            lj_paras.wushi = {};
            lj_paras.TfTimes = 0;
            lj_paras.kfTfTimes = 0;
            lj_paras.XSTimes = 0;
            lj_paras.xhtimes = 0;
            lj_paras.ptTimes =0;
            lj_paras.get_lhs = 0;
            lj_paras.rcQixia = 0;
            lj_paras.richang = 0;
            lj_paras.yxTimes = 0;
            lj_paras.xhtimes = 0;
            lj_paras.guanwu = 0;
            lj_paras.wushu = '';
            lj_paras.wushujifen = 0;
            lj_paras.zhanzhao = 0;

            qixia.QxTimes = 0;
            qixia.mijingtimes = 0;
            xueye.start = 0;
            //clickButton('clan bzmt select go 1', 1);//帮派选图，默认选第一个
            //开帮派副本
            //clickButton('clan fb open shenshousenlin', 0)
            //clickButton('clan fb open daxuemangongdao', 0)
            //clickButton('clan fb open longwulianmoge', 0)
            saveOption(lj_paras,1)
        }
    }
    if(xueyeTrigger == 1 && (week == 1||week==5||week==0) && g_obj_map.get('msg_status').get('area') == '100000'){
        if(xueye.start == 0 && time1 >= '20:50' && time1 < '21:00'){
            xueye.start = 1;
            //kbs=0
            xueye.ready();
        }
        else if(xueye.start==1 && time1 >= '21:50' && time1 < '21:59'){
            console.log('血液结束')
            clearTrigger();
            xueye.start = 0;
        }
    }
    if(time1 >= '23:55' && time1 < '23:58'){
        if(g_obj_map.get('msg_status').get('area') == '100000')
            go2('sort global fetch_reward', 0);
        else{
            go2('sort fetch_reward;items use obj_fengyunbaoxiang', 0);
            if(!g_gmain.is_fighting){
                //	go2('jh 1;lq_znboss_rewards;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;event_1_16891630;event_1_60133236');//李火师
                //	go2('clan scene;give_geling;give_geling;give_fengyunling');//交帮战令牌
                //	go2('jh 4;n;n;n;e;lq_twar');//跨服论剑奖励
                //	go2('jh 5,n,n,n;w;sign7;home');//签到
            }
        }
    }
    clearTimeout(resetTimer)
    resetTimer = setTimeout(resettimes, 3 * 60000);
}

var zhuyuyan = {
    times:0,
    maxtimes:0,
    start(){
        let num=prompt("选择打祝玉妍次数","1");
        if(!Number(num))
            return
        zhuyuyan.maxtimes = Number(num)
        zhuyuyan.times = 0;
        TriggerFuc = function(b){
            let type = b.get('type'),subtype = b.get('subtype')
            if(type == 'vs'){
                if(subtype == 'combat_result'){
                    zhuyuyan.times ++
                    if(zhuyuyan.times >= zhuyuyan.maxtimes){
                        zhuyuyan.end()
                        InforOutFunc('打完收工')
                    } else {
                        setTimeout(go2,1000,'e;w')
                    }
                }else if(subtype == 'die' && g_obj_map.get("msg_attrs").get('id') == b.get('uid')){
                    zhuyuyan.end()
                    InforOutFunc('你挂了')
                }
            }
        }
        go2('team quit;rank go 233,s,s,s')
    },
    end(){
        clearTrigger()
        zhuyuyan.times = 0
        ButtonManager.resetButtonById("zhuyuyan")
    }
}

var wushu = {
    trigger: 0,
    iskill: 0,
    npc:'',
    job:'',
    killnpc:'',
    askid: '',
    askpath: 'home,jh 2,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n',
    done: 0,
    killList:{
        '艳无忧':'jh 45,ne,ne,n,n,ne,ne,e,ne,n,n,n,n,n,ne,ne,n,n,n,nw,nw,n,e,e,e,kill youmingshanzhuang_yanwuyou',
        '封寒':'jh 46,e,e,e,e,e,e,e,e,n,n,n,e,e,kill huajie_fenghan',
        '止观大师':'jh 47,ne,n,n,n,ne,ne,e,e,e,e,ne,n,ne,e,e,n,n,n,n,n,kill xiliangcheng_zhiguandashi',
        '瓦耳拉齐':'jh 48,e,se,se,e,ne,se,e,e,e,ne,ne,event_1_54621,n,n,n,kill youxia_waerlaqi',
        '越王':'rank go 203;e;n;n;kill yuewangjiangong_yuewang',
        '剑之亡魂':'rank go 222;kill jiangling_jianzhiwanghun',
        '严松':'rank go 192;team create;event_1_54676242;kill jingcheng_yansong',
        '项天寿':'rank go 193;team create;event_1_15467958;kill jingcheng_xiangtianshou',
        '秦仲海':'rank go 193;team create;event_1_21438965;kill jingcheng_qinzhonghai',
        '三少爷':'rank go 203;team create;event_1_61129504;kill yuewangjiangong_sanshaoye',
        '唐经天':'rank go 221;team create;event_1_61129504;kill pilitang_tangjingtian',
        '陈家洛':'rank go 222;team create;event_1_61129504;kill zangjiangu_chenjialuo',

    },
    start(){
        wushu.trigger = 1;
        let tmp = prompt("五鼠监听仅为接任务，是否自动做杀人任务：1 是，0否",wushu.iskill)
        tmp = Number(tmp)
        if(tmp == 1)
            wushu.iskill = 1
        else
            wushu.iskill = 0
    },
    end(){
        wushu.trigger = 0;
    },
    go(msg){
        let ll;
        msg = g_simul_efun.replaceControlCharBlank(msg)
        if( ll = msg.match(/五鼠闹京城：(.*)哈哈大笑：大爷来了/)){
            wushu.npc = ll[1]
        }else{
            return;
        }
        console.log('五鼠：'+ll[1] +' 出现 '+new Date().format("yyyy-MM-dd hh:mm:ss"))
        if(wushu.trigger == 0){
            console.log('未开启')
            return;
        }
        let npctmp = wushu.npc.split('_')[0]
        if(wushi.start == 1 || g_gmain.is_fighting || busy == 1){
            console.log('忙着呢')
            return
        }
        if(lj_paras.wushu.indexOf(npctmp)>=0 || (npctmp == '展昭') && lj_paras.zhanzhao >=3){
            console.log('已完成')
            return;
        }
        clearTrigger()
        wushu.done = 0
        busy = 1
        setTimeout(function(){busy=0},1000)
        setTimeout(wushu.goask,3000)
    },
    goask(){
        TriggerFuc = wushu.ask
        if(g_obj_map.get('msg_room') && g_obj_map.get('msg_room').get("obj_p") == '4208')
            go2('items get_store /map/gumu/obj/silverkey,say 五鼠')
        else
            go2(wushu.askpath+',items get_store /map/gumu/obj/silverkey,say 五鼠')
    },
    ask(b){
        let type = b.get('type'),msg = b.get('msg')
        let askAr=null;
        if(type == 'main_msg'){
            msg = g_simul_efun.replaceControlCharBlank(msg)
            if(msg.indexOf('你说道：五鼠')>=0){
                console.log(wushu.npc)
                let keys = g_obj_map.get('msg_room').keys();

                for(let i=0;i<keys.length;i++){
                    if(keys[i].substr(0,3)=='npc'){
                        let tmp = g_obj_map.get('msg_room').get(keys[i])
                        let ll = tmp.split(',')
                        let npc = g_simul_efun.replaceControlCharBlank(ll[1])
                        let id = ll[0]
                        wushu.askid = id;
                        if(npc == wushu.npc){
                            clickButton('ask '+id)
                            clickButton('ask '+id)
                            break;
                        }
                    }
                }
            }

            if(askAr = msg.match(/(.*)需要你帮忙杀死(.*)。任务时间/)){
                clearTrigger()
                if(!wushu.iskill)
                    return;
                let path = null;
                wushu.killnpc = g_simul_efun.replaceControlCharBlank(askAr[2])
                //console.log('杀'+wushu.killnpc)
                if(wushu.killList[wushu.killnpc]){
                    path = wushu.killList[wushu.killnpc]
                    TriggerFuc = wushu.gokill
                    //go2(path)
                    //console.log('出发')
                    setTimeout(go2,1000,path)
                    //cmdCache
                }else{
                    InforOutFunc('未识别的名称')
                    clearTrigger()
                }
                //TriggerFuc
            }
        }

        //穿山鼠_戊需要你帮忙杀死项天寿。任务时间剩余：07分05秒。

    },
    gokill(b){
        //console.log(b)
        let type = b.get('type'),subtype = b.get('subtype'),msg = b.get('msg')
        if(msg) msg = g_simul_efun.replaceControlCharBlank(msg)
        if(
            (type == 'notice' && msg.indexOf('这儿没有这个人')>=0)
            ||(type == 'vs' && subtype == 'die' && g_obj_map.get("msg_attrs").get('id') == b.get('uid'))
        ){
            clearTrigger();
            InforOutFunc('杀人失败：'+wushu.killnpc);
        }

        if(type == 'main_msg' && msg.indexOf('的任务，回去回复它吧')>=0){
            wushu.done = 1
            //console.log('完成')
        }
        if(type == 'vs' && subtype == 'combat_result'){
            //console.log('战斗结束')
            setTimeout(function(){
                clearTrigger();
                if(wushu.done == 1)
                    go2(wushu.askpath+',ask '+wushu.askid)
            },2000)
        }
    }
}
//处理文本内容
function setText(val) {
    if (val != null && val != "") {
        var re1 = new RegExp("<.+?>|&.+?;","g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
        var msg = val.replace(re1,""); //执行替换成空字符
        msg = msg.replace(/\s/g,""); //去掉所有的空格（中文空格、英文空格都会被替换）
        msg = msg.replace(/[\r\n]/g,""); //去掉所有的换行符
        return msg.substr(0, 100); //获文本文字内容的前100个字符
    } else return ''
}
function tupo(skill){
    go2('enable '+ skill);
    go2('tupo go,'+ skill);
    go2('tupo_speedup3 '+ skill+' go');		//超级加速卡

    go2('tupo_speedup3_1 '+ skill+' go');	//通天丸
    go2('tupo_speedup4_1 '+ skill+' go');	//金刚舍利
    go2('tupo_speedup2 '+ skill+' go');		//高级加速卡
}

var btnList = {};
function newCreateButton(btnName,func){
    btnList[btnName] = document.createElement('button');
    let myBtn = btnList[btnName];
    myBtn.innerText = myBtn.name = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '0px';
    myBtn.style.top = currentPos + 'px';
    currentPos += 25;
    myBtn.style.width = CONST_BUTTON_WIDTH + 'px';
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);
}
//主菜单按钮参数设置
var SettingButton = document.createElement('button');
var hiddenflg = 0;
SettingButton.innerText = '';
SettingButton.style.position = 'absolute';
SettingButton.style.left = '50px';
SettingButton.style.top = '0px';
SettingButton.style.width = "120px";
SettingButton.style.height = "30px";
SettingButton.style.backgroundColor="transparent";
SettingButton.style.border="none";
document.body.appendChild(SettingButton);

SettingButton.addEventListener('click', function eventOnClick() {
    if (hiddenflg == 0) {
        hiddenflg = 1;
        DisplayAndHiddenBtn("DailyTasksConfig", "h");
        DisplayAndHiddenBtn("JiangHuZhiXianConfig", "h");
        DisplayAndHiddenBtn("shenbingbingyueConfig", "h");
        DisplayAndHiddenBtn("qixiamijingConfig", "h");
        DisplayAndHiddenBtn("waizhuanConfig", "h");
        DisplayAndHiddenBtn("autojingmaiConfig", "h");
        DisplayAndHiddenBtn("AutoFightConfig", "h");
        DisplayAndHiddenBtn("SpecialEventConfig", "h");
        DisplayAndHiddenBtn("BattleConfig", "h");
        DisplayAndHiddenBtn("DragonConfig", "h");
        DisplayAndHiddenBtn("SkillConfig", "h");
        DisplayAndHiddenBtn("TupoConfig", "h");
        DisplayAndHiddenBtn("ItemUseConfig", "h");
        DisplayAndHiddenBtn("YuanbaoConfig", "h");
        DisplayAndHiddenBtn("autofubenConfig", "h");
        btnList['导航仪'].style.display = 'none';
        btnList['获取代码'].style.display ='none';
        btnList['执行代码'].style.display ='none';
        btnList['自定命令'].style.display = 'none';
        btnList['看首页'].style.display = 'none';
        btnList['回首页'].style.display = 'none';
        btnList['查看状态'].style.display = 'none';
        ButtonManager.clickButtonById(ButtonId);
    } else {
        hiddenflg = 0;
        DisplayAndHiddenBtn("DailyTasksConfig", "d");
        DisplayAndHiddenBtn("JiangHuZhiXianConfig", "d");
        DisplayAndHiddenBtn("shenbingbingyueConfig", "d");
        DisplayAndHiddenBtn("qixiamijingConfig", "d");
        DisplayAndHiddenBtn("waizhuanConfig", "d");
        DisplayAndHiddenBtn("autojingmaiConfig", "d");
        DisplayAndHiddenBtn("AutoFightConfig", "d");
        DisplayAndHiddenBtn("SpecialEventConfig", "d");
        DisplayAndHiddenBtn("BattleConfig", "d");
        DisplayAndHiddenBtn("DragonConfig", "d");
        DisplayAndHiddenBtn("SkillConfig", "d");
        DisplayAndHiddenBtn("TupoConfig", "d");
        DisplayAndHiddenBtn("ItemUseConfig", "d");
        DisplayAndHiddenBtn("YuanbaoConfig", "d");
        DisplayAndHiddenBtn("autofubenConfig", "d");
        btnList['导航仪'].style.display = 'block';
        btnList['获取代码'].style.display = 'block';
        btnList['执行代码'].style.display = 'block';
        btnList['自定命令'].style.display = 'block';
        btnList['看首页'].style.display = 'black';
        btnList['回首页'].style.display = 'block';
        btnList['查看状态'].style.display = 'block';
        //ButtonManager.clickButtonById("BattleConfig");
    }
});

//clickButton('score');
initializeSkillButtons();
initializeTupoButtons();
initializeYuanbaoButtons();
initializeItemUseButtons();
initializeautofubenButtons();

initializeAllSettings();
newCreateButton('查看状态',showStatus)
newCreateButton('获取代码',getID)
newCreateButton('执行代码',doID)
newCreateButton('自定命令',function(){
    let string = prompt("按提示输入命令，用英文逗号或分号隔开，重复命令可以使用#次数，例如 #6 n,#5 e","");
    if(!string) return;
    go2(string)
})
newCreateButton('导航仪',MyNavigatorFunc)
newCreateButton('看首页',function(){clickButton('prev_combat')})
newCreateButton('回首页',function(){clickButton('home')})
//InforOutFunc('开始获取同步数据。。。')
//setTimeout(getOption,1000,1);
getOption(1)
//setTimeout(resettimes,5000);
////////////////////////////////////*******************////////////////////////////////////
///////////////////////////////////*******其他移植******////////////////////////////////////
//////////////////////////////////*******************////////////////////////////////////
var bjbx="";
function autob111(){
    go('fb 11;nw;kill bajieshendian_zhushajun');
    setTimeout(autob112,5000);
}
function autob112(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob112();},200);
    }else{
        go('se;n;kill bajieshendian_shishenyiya');
        setTimeout(autob113,5000);
    }
}
function autob113(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob113();},200);
    }else{
        go('s;ne;kill bajieshendian_shashenyanmin');
        setTimeout(autob114,5000);
    }
}
function autob114(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob114();},200);
    }else{
        go('sw;e;kill bajieshendian_daoshenwentao');
        setTimeout(autob115,5000);
    }
}
function autob115(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob115();},200);
    }else{
        go('w;se;kill bajieshendian_xieshenyecha');
        setTimeout(autob116,5000);
    }
}
function autob116(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob116();},200);
    }else{
        go('nw;s;kill bajieshendian_shangbaozheng');
        setTimeout(autob117,5000);
    }
}
function autob117(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob117();},200);
    }else{
        go('n;sw;kill bajieshendian_libai');
        setTimeout(autob118,5000);
    }
}
function autob118(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob118();},200);
    }else{
        go('ne;w;kill bajieshendian_yangguang');
        setTimeout(autob119,5000);
    }
}
function autob119(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob119();},200);
    }else{
        go('w;kill bajieshendian_yingzheng');
        setTimeout(autob1110,5000);
    }
}
function autob1110(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1110();},200);
    }else{
        go('e;e;nw;nw;kill bajieshendian_chengzhuanlaozhu');
        setTimeout(autob1111,5000);
    }
}
function autob1111(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1111();},200);
    }else{
        go('se;se;n;n;kill bajieshendian_penzhu');
        setTimeout(autob1112,5000);
    }
}
function autob1112(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1112();},200);
    }else{
        go('s;s;ne;ne;kill bajieshendian_shashenbaiqi');
        setTimeout(autob1113,5000);
    }
}
function autob1113(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1113();},200);
    }else{
        go('sw;sw;e;e;kill bajieshendian_daoshenwudaojianjun');
        setTimeout(autob1114,5000);
    }
}
function autob1114(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1114();},200);
    }else{
        go('w;w;se;se;kill bajieshendian_xieshenxintian');
        setTimeout(autob1115,5000);
    }
}
function autob1115(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1115();},200);
    }else{
        go('nw;nw;s;s;kill bajieshendian_maxinkong');
        setTimeout(autob1116,5000);
    }
}
function autob1116(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1116();},200);
    }else{
        go('n;n;sw;sw;kill bajieshendian_jiushenyidi');
        setTimeout(autob1117,5000);
    }
}
function autob1117(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1117();},200);
    }else{
        setTimeout(function(){go('kill bajieshendian_luanzhixinmo;kill bajieshendian_xinmofenshen');},3000);
        setTimeout(autob1118,5000);
    }
}
function autob1118(){
    if (document.getElementById("combat_xdz_text")) {
        setTimeout(function(){autob1118();},200);
    }else{
        bjbx=setInterval(autob1119,500);
        setTimeout(function(){go('event_1_68529291;event_1_68529291');},1000);
    }
}
function autob1119(){
    if ($('span.out2:contains(必须杀完所有的怪物才可以打开宝箱)').length > 0) {
        setTimeout(autob1120,1000);
        document.getElementById("out2").innerHTML="<span style=color:rgb(0,255,0)>杀心魔</span>";
        clearInterval(bjbx);
    }
    if ($('span.out2:contains(宝箱已经被打开过了)').length > 0) {
        clearInterval(bjbx);
    }
}
function autob1120(){
    go('kill bajieshendian_luanzhixinmo;kill bajieshendian_xinmofenshen');
    setTimeout(autob1118,5000);
}
////////////////////////////////////*******************////////////////////////////////////
///////////////////////////////////*******80移植******////////////////////////////////////
//////////////////////////////////*******************////////////////////////////////////
function boxset()
{
    // 获取当前页面链接
    var url = window.location.href;
    // 获取链接中的ID和key
    var id = url.split('?')[1].split('=')[1];
    var key = url.split('&')[1].split('=')[1];
    return top.localStorage.setItem(id + "_" + key, 1)
}

////////////////////////////////////*******************////////////////////////////////////
///////////////////////////////////*******自定义******////////////////////////////////////
//////////////////////////////////*******************////////////////////////////////////
//执行代码
function doID(){
    var do_ac= prompt("请输入执行代码：循环次数|执行内容;执行内容;","1|home");
    var ll_n=do_ac.split('|'); // [1,home]
    let LL_num=ll_n[0];
    let LL_g = ll_n[1];
    let LL_go = LL_g.toString();
    for(let i=0;i<Math.abs(LL_num);i++){
        go2(LL_go);
    }
}

function getID(){
    //获取代码

    var llnpcList = [];
    var lspath,pathindex=0;
    var ll_tipinfo='';
    var arr = document.getElementsByTagName('*');

    for(var i = 0;i<arr.length;i++){
        if(arr[i].getAttribute('onclick') && arr[i].innerText){
            var paths = arr[i].getAttribute('onclick');
            var text= arr[i].innerText;
            var text2=text.replace(/[^\w\s]/g, '');
            llnpcList[pathindex]=(pathindex +1)+':'+setText(text2) + ':'+paths;
            ll_tipinfo=ll_tipinfo+(pathindex +1)+':'+arr[i].innerText + ':'+paths+'\n';
            pathindex=pathindex +1;
        }
    }

    alert("当前页面的代码如下：\n"+ll_tipinfo);

}
//拓展背包2-可选择目标背包数量
function upbox2()
{
    let m=prompt("请输入当前乾坤袋大小及目标乾坤袋大小数值，当前大小,目标大小：","50,850"),
        m2=m.split(','),
        n=m2[0],//当前大小
        maxN=m2[1];//目标大小
    n=Number(n)
    maxN=Number(maxN)
    if (!n||!maxN||n>maxN||n<50||maxN<50) {
        alert("输入数据有误，请核对后再次操作\n")
        return;

    }
    if(maxN<=100&maxN>=50){
        //只用乾坤袋
        let a1=maxN-n;//买乾坤袋数量
        for(i=0;i<Math.floor(a1/10);i++)
            go2("shop buy shop21_N_10");//买10个乾坤袋
        for(i=0;i<(a1%10);i++)
            go2("shop buy shop21");//买一个乾坤袋
        for(i=0;i<a1;i++)
            go2("items use qiankundai");//用a1个乾坤袋
    }
    else if(maxN<=300&maxN>100) {
        //用乾坤袋和高级乾坤袋
        if(n<=100){
            let a2=100-n;//买乾坤袋数量
            let b2=maxN-100;//买高级乾坤袋数量
            //乾坤袋
            for(i=0;i<Math.floor(a2/10);i++)
                go2("shop buy shop21_N_10");//买10个乾坤袋
            for(i=0;i<(a2%10);i++)
                go2("shop buy shop21");//买一个乾坤袋
            for(i=0;i<a2;i++)
                go2("items use qiankundai");//用a2个乾坤袋
            //高级乾坤袋
            for(i=0;i<Math.floor(b2/10);i++)
                go2("shop buy shop22_N_10");//买10个高级乾坤袋
            for(i=0;i<Math.floor(b2%10);i++)
                go2("shop buy shop22");//买1个高级乾坤袋
            for(i=0;i<b2;i++)
                go2("items use qiankundai2");//用b2个高级乾坤袋
        }
        else {
            //高级乾坤袋
            let b2=maxN-n;//买高级乾坤袋数量
            for(i=0;i<Math.floor(b2/10);i++)
                go2("shop buy shop22_N_10");//买10个高级乾坤袋
            for(i=0;i<Math.floor(b2%10);i++)
                go2("shop buy shop22");//买1个高级乾坤袋
            for(i=0;i<b2;i++)
                go2("items use qiankundai2");//用b2个高级乾坤袋
        }
    }
    else if(maxN<=550&maxN>300){
        //用乾坤袋、高级乾坤袋、特级乾坤袋
        if(n<=100){
            let a3=100-n;//买乾坤袋数量
            let b3=200;//买高级乾坤袋数量
            let c3=maxN-300;//买特级乾坤袋数量
            //乾坤袋
            for(i=0;i<Math.floor(a3/10);i++)
                go2("shop buy shop21_N_10");//买10个乾坤袋
            for(i=0;i<(a3%10);i++)
                go2("shop buy shop21");//买一个乾坤袋
            for(i=0;i<a3;i++)
                go2("items use qiankundai");//用a3个乾坤袋
            //高级乾坤袋
            for(i=0;i<Math.floor(b3/10);i++)
                go2("shop buy shop22_N_10");//买10个高级乾坤袋
            for(i=0;i<Math.floor(b3%10);i++)
                go2("shop buy shop22");//买1个高级乾坤袋
            for(i=0;i<b3;i++)
                go2("items use qiankundai2");//用b3个高级乾坤袋
            //特级乾坤袋
            for(i=0;i<Math.floor(c3/10);i++)
                go2("shop buy shop23_N_10");//买10个特级乾坤袋
            for(i=0;i<Math.floor(c3%10);i++)
                go2("shop buy shop23");//买1个特级乾坤袋
            for(i=0;i<c3;i++)
                go2("items use obj_bag3");//用c3个特级乾坤袋

        }
        else if(n<=300&n>100){
            let b3=300-n;//买高级乾坤袋数量
            let c3=maxN-300;//买特级乾坤袋数量
            //高级乾坤袋
            for(i=0;i<Math.floor(b3/10);i++)
                go2("shop buy shop22_N_10");//买10个高级乾坤袋
            for(i=0;i<Math.floor(b3%10);i++)
                go2("shop buy shop22");//买1个高级乾坤袋
            for(i=0;i<b3;i++)
                go2("items use qiankundai2");//用b3个高级乾坤袋
            //特级乾坤袋
            for(i=0;i<Math.floor(c3/10);i++)
                go2("shop buy shop23_N_10");//买10个特级乾坤袋
            for(i=0;i<Math.floor(c3%10);i++)
                go2("shop buy shop23");//买1个特级乾坤袋
            for(i=0;i<c3;i++)
                go2("items use obj_bag3");//用c3个特级乾坤袋
        }
        else {
            let c3=maxN-n;//买特级乾坤袋数量
            //特级乾坤袋
            for(i=0;i<Math.floor(c3/10);i++)
                go2("shop buy shop23_N_10");//买10个特级乾坤袋
            for(i=0;i<Math.floor(c3%10);i++)
                go2("shop buy shop23");//买1个特级乾坤袋
            for(i=0;i<c3;i++)
                go2("items use obj_bag3");//用c3个特级乾坤袋
        }
    }
    else if(maxN<=850&maxN>550){
        //用乾坤袋、高级乾坤袋、特级乾坤袋、无级乾坤袋
        if(n<=100){
            let a4=100-n;//买乾坤袋数量
            let b4=200;//买高级乾坤袋数量
            let c4=250;//买特级乾坤袋数量
            let d4=maxN-550;//买无极乾坤袋数量
            //乾坤袋
            for(i=0;i<Math.floor(a4/10);i++)
                go2("shop buy shop21_N_10");//买10个乾坤袋
            for(i=0;i<(a4%10);i++)
                go2("shop buy shop21");//买一个乾坤袋
            for(i=0;i<a4;i++)
                go2("items use qiankundai");//用a4个乾坤袋
            //高级乾坤袋
            for(i=0;i<Math.floor(b4/10);i++)
                go2("shop buy shop22_N_10");//买10个高级乾坤袋
            for(i=0;i<Math.floor(b4%10);i++)
                go2("shop buy shop22");//买1个高级乾坤袋
            for(i=0;i<b4;i++)
                go2("items use qiankundai2");//用b4个高级乾坤袋
            //特级乾坤袋
            for(i=0;i<Math.floor(c4/10);i++)
                go2("shop buy shop23_N_10");//买10个特级乾坤袋
            for(i=0;i<Math.floor(c4%10);i++)
                go2("shop buy shop23");//买1个特级乾坤袋
            for(i=0;i<c4;i++)
                go2("items use obj_bag3");//用c4个特级乾坤袋
            //无级乾坤袋
            for(i=0;i<Math.floor(d4/10);i++)
                go2("shop buy shop24_N_10");//买10个无极乾坤袋
            for(i=0;i<Math.floor(d4%10);i++)
                go2("shop buy shop24");//买1个无级乾坤袋
            for(i=0;i<d4;i++)
                go2("items use obj_wujiqiankundai");//用d4个无极乾坤袋
        }
        else if(n<=300&n>100){
            let b4=300-n;//买高级乾坤袋数量
            let c4=250;//买特级乾坤袋数量
            let d4=maxN-550;//买特级乾坤袋数量
            //高级乾坤袋
            for(i=0;i<Math.floor(b4/10);i++)
                go2("shop buy shop22_N_10");//买10个高级乾坤袋
            for(i=0;i<Math.floor(b4%10);i++)
                go2("shop buy shop22");//买1个高级乾坤袋
            for(i=0;i<b4;i++)
                go2("items use qiankundai2");//用b4个高级乾坤袋
            //特级乾坤袋
            for(i=0;i<Math.floor(c4/10);i++)
                go2("shop buy shop23_N_10");//买10个特级乾坤袋
            for(i=0;i<Math.floor(c4%10);i++)
                go2("shop buy shop23");//买1个特级乾坤袋
            for(i=0;i<c4;i++)
                go2("items use obj_bag3");//用c4个特级乾坤袋
            //无级乾坤袋
            for(i=0;i<Math.floor(d4/10);i++)
                go2("shop buy shop24_N_10");//买10个无极乾坤袋
            for(i=0;i<Math.floor(d4%10);i++)
                go2("shop buy shop24");//买1个无级乾坤袋
            for(i=0;i<d4;i++)
                go2("items use obj_wujiqiankundai");//用d4个无极乾坤袋
        }
        else if(n<=550&n>300){
            let c4=550-n;//买特级乾坤袋数量
            let d4=maxN-550;//买无级乾坤袋数量
            //特级乾坤袋
            for(i=0;i<Math.floor(c4/10);i++)
                go2("shop buy shop23_N_10");//买10个特级乾坤袋
            for(i=0;i<Math.floor(c4%10);i++)
                go2("shop buy shop23");//买1个特级乾坤袋
            for(i=0;i<c4;i++)
                go2("items use obj_bag3");//用c4个特级乾坤袋
            //无级乾坤袋
            for(i=0;i<Math.floor(d4/10);i++)
                go2("shop buy shop24_N_10");//买10个无极乾坤袋
            for(i=0;i<Math.floor(d4%10);i++)
                go2("shop buy shop24");//买1个无级乾坤袋
            for(i=0;i<d4;i++)
                go2("items use obj_wujiqiankundai");//用d4个无极乾坤袋
        }
        else{
            let d4=maxN-n;//买无级乾坤袋数量
            //无级乾坤袋
            for(i=0;i<Math.floor(d4/10);i++)
                go2("shop buy shop24_N_10");//买10个无极乾坤袋
            for(i=0;i<Math.floor(d4%10);i++)
                go2("shop buy shop24");//买1个无级乾坤袋
            for(i=0;i<d4;i++)
                go2("items use obj_wujiqiankundai");//用d4个无极乾坤袋

        }
    }
    else{
        alert("乾坤袋已经最大了\n")
    }
}
//拓展背包1-直接升到850
function upbox()
{
    let m1=prompt("请输入当前背包大小及目标背包大小数值，当前大小,目标大小：","50,850"),
        m2=m.split(','),
        n=m2[0],//当前大小
        maxN=m2[1];//目标大小
    n=Number(n)
    if (!n) {
        return;
    }
    if(n>=850){ alert("背包已经最大了\n");}
    else if(n>=550&n<850){
        let a1=850-n;//买无极数量
        for(i=0;i<Math.floor(a1/10);i++)
            go("shop buy shop22_N_10");//买10个无极背包
        for(i=0;i<(a1%10);i++)
            go("shop buy shop22");//买一个无极背包
        for(i=0;i<a1;i++)
            go("items use obj_wujiqiankundai");//用a1个无极背包
    }
    else if(n>=300&n<550){
        let a2=550-n;//买特级背包数量
        for(i=0;i<Math.floor(a2/10);i++)
            go("shop buy shop21_N_10");//买10个特级背包
        for(i=0;i<(a2%10);i++)
            go("shop buy shop21");//买一个特级背包
        for(i=0;i<a2;i++)
            go("items use obj_bag3");//用a2个特级背包
        for(i=0;i<30;i++)
            go("shop buy shop22_N_10");//买10个无极背包
        for(i=0;i<300;i++)
            go("items use obj_wujiqiankundai");//用300个无极背包
    }
    else if(n>=100&n<300){
        let a3=300-n;//买高级背包数量
        for(i=0;i<Math.floor(a3/10);i++)
            go("shop buy shop20_N_10");//买10个高级背包
        for(i=0;i<(a3%10);i++)
            go("shop buy shop20");//买一个高级背包
        for(i=0;i<a3;i++)
            go("items use qiankundai2");//用a3个高级背包
        for(i=0;i<25;i++)
            go("shop buy shop21_N_10");//买10个特级背包
        for(i=0;i<250;i++)
            go("items use obj_bag3");//用200个特级背包
        for(i=0;i<30;i++)
            go("shop buy shop22_N_10");//买10个无极背包
        for(i=0;i<300;i++)
            go("items use obj_wujiqiankundai");//用300个无极背包
    }
    else{
        let a4=100-n;//买乾坤袋数量
        for(i=0;i<Math.floor(a4/10);i++)
            go("shop buy shop19_N_10");//买10个乾坤袋
        for(i=0;i<(a4%10);i++)
            go("shop buy shop19");//买一个乾坤袋
        for(i=0;i<a4;i++)
            go("items use qiankundai");//用a4个乾坤袋
        for(i=0;i<20;i++)
            go("shop buy shop20_N_10");//买10个高级背包
        for(i=0;i<200;i++)
            go("items use qiankundai2");//用200个高级背包
        for(i=0;i<25;i++)
            go("shop buy shop21_N_10");//买10个特级背包
        for(i=0;i<250;i++)
            go("items use obj_bag3");//用250个特级背包
        for(i=0;i<30;i++)
            go("shop buy shop22_N_10");//买10个无极背包
        for(i=0;i<300;i++)
            go("items use obj_wujiqiankundai");//用300个无极背包
    }

}
//分解装备
var WCC = '扬文软猬甲烈日棍西毒蛇杖冰魄银针碧磷鞭--倚天剑屠龙刀墨玄掌套明月帽明月鞋明月项链明月戒月光宝甲衣明月手镯星月大斧碧玉锤霸王枪';
function fenjiefunc() {
    var d = [];
    var t = $("tr[bgcolor]:contains(两)").siblings();
    if (t.length > 0) {
        for (var i = 0; i < t.length; i++) {
            if (t.eq(i)[0].innerText.replace(/\s+/g, "") != "") {
                var a = t.eq(i).find('td')[0].innerText.replace('\n', "");
                var b = parseInt(t.eq(i).find('td')[1].innerText.match(/\d+/g)[0]);
                var c = t[i].getAttribute('onclick').split("'")[1].split("info ")[1];
                if (WCC.indexOf(a) != -1) {
                    console.log("分解：" + a + " 数量：" + b);
                    for (let j = 0; j < b; j++) {
                        d.push('items splite ' + c)
                    }
                }
            }
        }
    }
    d.push('prev;!分解任务执行完毕');
    go('=300');
    for (i = 0; i < d.length; i++) {
        go(d[i])
    }
    go('=150')
}
function getHP(){
    let a = parseInt(g_obj_map.get("msg_attrs").get("kee"));
    let b = parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    let d = parseInt(g_obj_map.get("msg_attrs").get("max_force"));
    a=Number(a)
    b=Number(b)
    for(let m=0;m<Math.floor(b/d);m++){
        getMaxMP(); //回满内力
        for(let j=0;j<10;j++)
            go("recovery")

    }


}
//回满内力
function getMaxMP(){
    let c = parseInt(g_obj_map.get("msg_attrs").get("force"));
    let d = parseInt(g_obj_map.get("msg_attrs").get("max_force"));
    let e=d-c;
    if(c<d){
        for( let j=0;j<Math.floor(e/500000);j++)
            go("items use tianlongsi_sanqingwan");//吃三清
        e=e%500000;
        for(let j=0;j<Math.floor(e/50000);j++)
            go("items use snow_wannianlingzhi");//吃万年
        e=e%50000;
        for(let j=0;j<Math.floor(e/5000)+1;j++)
            go("items use tianlongsi_sanqingwan");//吃千年
    }
    else{
        InforOutFunc("当前内力充足，无需嗑药！");
    }

}
//遍历执行命令-------------------------------
var bl_place={
    '雪亭镇': 'jh 1;inn_op1;n;s;e;w;w;jh 1;e;s;w;s;n;w;e;e;e;ne;ne;jh 1;e;e;w;n;w;e;n;w;e;n;w;e;e;e;w;w;n;w;e;e;w;n;s;s;s;s;e;e;n;s;e;e;n;s;e;w;s;n;jh 1;w;w;s;n;n;s;w;s;n;n;s;w;s;n;n;s;w;s;n;n;s;w;s;n;n;s;w;s;n;n;s;w;n;s;s;n;w;home',
    '洛阳': 'jh 2;n;n;e;s;luoyang317_op1;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;s;w;e;n;event_1_98995501;n;w;e;n;e;w;s;s;s;e;n;w;s;luoyang111_op1;e;n;n;n;w;e;s;s;w;n;w;e;n;n;e;get_silver;n;w;s;s;s;e;e;e;n;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;e;w;w;luoyang14_op1;n;e;n;e;n;n;s;s;w;n;n;n;n;home',
    '西安': 'jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w;w;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;s;s;s;s;w;w;n;w;n;n;s;s;s;s;s;s;s;n;e;n;n;n;s;s;s;w;s;w;w;n;n;n;n;n;n;n;n;s;w;e;e;w;s;s;w;e;e;w;s;s;s;s;n;s;w;s;s;e;s;w;e;e;w;s;w;e;e;w;s;w;e;e;w;s;e;e;e;s;s;s;s;w;e;s;n;e;w;n;n;n;n;w;n;w;e;n;n;e;w;n;w;w;w;e;e;e;e;e;s;s;s;s;e;e;n;s;w;e;n;n;n;w;n;n;n;w;n;s;e;s;s;s;w;n;e;e;e;e;s;w;e;e;w;s;w;e;e;w;s;w;e;e;w;s;n;n;n;n;e;e;n;n;w;n;w;n;s;s;w;w;n;n;n;n;n;w;s;w;e;s;s;s;e;n;n;n;n;n;n;s;e;e;e;e;s;s;s;s;s;s;s;ne;sw;s;s;s;s;s;s;s;w;w;w;w;w;w;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;n;n;ne;e;se;n;n;n;n;n;n;n;e;e;e;e;s;s;s;s;s;s;s;s;s;n;e;w;s;s;s;e;s;s;s;s;s;n;e;event_1_2215721;n;s;w;e;e;w;s;home',
    '华山村': 'jh 3;n;e;w;s;w;n;s;event_1_59520311;n;n;w;e;n;n;e;w;n;e;jh 3;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;huashancun15_op1;event_1_46902878;w;w;w;n;s;get_silver;n;e;s;e;w;nw;n;n;e;get_silver;s;w;n;w;e;n;n;e;w;w;e;n;home',
    '华山': 'jh 4;n;n;w;e;n;e;w;n;n;n;e;n;n;event_1_91604710;s;s;s;w;e;s;e;w;jh 4;n;n;n;n;n;n;n;n;w;s;n;w;n;get_xiangnang2;w;s;e;e;n;e;n;n;w;w;event_1_26473707;e;e;e;n;e;s;event_1_11292200;n;n;w;n;e;w;n;s;s;s;s;s;w;n;n;n;w;e;n;get_silver;s;s;e;n;n;s;s;s;s;n;n;w;s;s;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e;home',
    '扬州': 'jh 5;n;e;w;w;w;n;s;e;e;n;e;w;w;e;n;w;e;n;w;yangzhou16_op1;e;e;n;w;w;s;s;n;n;n;n;e;w;w;n;n;n;s;s;s;e;n;s;s;s;e;e;e;n;n;n;s;s;e;n;n;n;w;n;n;s;s;w;s;s;e;n;n;s;s;w;s;e;s;w;n;w;e;e;n;n;w;e;e;w;n;n;s;s;s;s;w;n;w;e;e;get_silver;s;w;n;w;w;w;e;n;get_silver;s;s;e;e;n;n;ne;sw;s;e;s;e;s;s;s;n;n;n;w;n;w;w;s;n;w;n;e;w;w;e;n;n;e;s;n;w;w;n;s;e;n;jh 5;n;n;n;event_1_8220256;n;w;e;n;e;w;w;n;s;e;n;e;w;n;home',
    '丐帮': 'jh 6;event_1_98623439;s;w;e;n;ne;ne;ne;sw;sw;n;ne;ne;ne;event_1_97428251;home',
    '乔阴县': 'jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;w;e;n;s;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e;home',
    '峨眉山': 'jh 8;ne;e;e;e;e;w;n;s;s;n;w;w;w;sw;w;nw;n;n;n;n;w;e;se;nw;e;n;s;e;n;n;e;fight emei_shoushan;eval_busy11_move();eval_busy_move();n;eval_busy11_move();eval_busy_move();n;n;n;e;e;w;w;w;n;n;n;w;w;s;e;w;s;e;w;w;e;n;w;e;n;w;w;n;s;sw;ne;e;e;n;e;w;w;e;n;e;w;w;e;n;w;w;w;n;n;n;s;s;s;e;e;e;e;e;e;e;e;e;w;w;s;e;w;w;e;s;e;w;w;e;s;e;e;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;n;n;n;n;w;n;s;w;e;s;n;e;n;n;n;n;s;s;nw;nw;n;n;s;s;se;sw;w;nw;w;e;se;e;ne;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e;home',
    '恒山': 'jh 9;n;w;e;n;e;w;n;w;e;n;henshan15_op1;e;e;w;n;event_1_85624865;n;w;e;e;w;n;n;n;s;s;s;s;w;n;n;w;n;s;s;n;e;e;n;s;e;w;w;n;n;w;n;e;w;n;n;w;e;n;home',
    '武当山': 'jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n;s;e;n;n;n;n;s;s;s;s;e;e;s;n;e;e;w;w;w;w;s;e;e;e;e;s;e;s;e;n;s;s;n;e;e;e;w;n;s;s;s;s;jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;w;nw;sw;ne;n;nw;se;s;se;e;n;n;n;nw;nw;n;s;se;se;n;n;n;s;s;s;ne;s;sw;ne;e;s;n;w;n;e;w;n;n;e;home',
    '晚月庄': 'jh 11;e;e;s;n;nw;w;nw;e;e;e;se;nw;n;w;jh 11;e;e;n;e;s;sw;se;s;s;s;s;s;s;se;s;n;ne;n;nw;w;w;s;s;w;e;se;e;n;n;n;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e;w;w;w;w;w;n;s;s;n;e;s;n;e;s;w;w;e;e;e;s;s;e;w;w;s;e;e;w;w;n;e;w;w;w;e;n;n;n;s;w;e;s;e;s;n;n;e;home',
    '水烟阁': 'jh 12;n;e;w;n;n;n;s;e;e;w;n;n;s;ne;w;n;s;w;se;n;e;w;s;s;home',
    '少林寺': 'jh 13;e;s;s;w;w;w;jh 13;n;w;w;n;shaolin012_op1;s;s;e;e;n;e;w;w;e;n;n;e;w;w;e;n;n;e;w;w;e;n;shaolin27_op1;event_1_34680156;s;w;n;e;w;w;e;n;shaolin25_op1;w;n;e;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;w;w;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;e;n;e;w;w;e;n;w;n;get_silver;home',
    '唐门': 'jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;home',
    '青城山': 'jh 15;s;s;e;w;w;n;s;e;s;e;w;w;w;n;s;s;s;n;n;w;w;w;n;s;w;e;e;e;e;e;e;s;e;w;w;e;s;e;w;s;w;s;ne;s;s;s;e;s;n;w;n;n;n;n;n;n;n;n;n;n;nw;w;nw;n;s;w;s;s;s;kill qingcheng_renjie;eval_busy11_move();eval_busy_move();w;w;n;e;w;w;e;n;w;s;w;s;e;s;home',
    '逍遥林': 'jh 16;s;s;s;s;e;e;e;s;w;w;w;w;w;e;n;s;s;n;e;e;n;n;s;s;s;s;n;n;e;n;s;s;s;n;n;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w;e;n;s;e;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;s;s;e;n;n;w;n;e;home',
    '开封': 'jh 17;n;w;e;e;s;n;w;n;w;s;n;n;n;s;s;e;e;e;s;n;n;n;s;s;w;s;s;s;w;e;s;w;e;n;e;n;s;s;n;e;e;w;w;w;n;n;n;w;n;e;w;n;e;w;w;w;n;s;s;n;w;w;e;n;n;w;e;s;s;s;s;w;e;n;n;e;e;e;n;e;se;nw;n;n;n;event_1_27702191;jh 17;event_1_97081006;s;s;s;e;kaifeng_yezhulin23_op1;n;w;s;s;w;w;e;kaifeng_yezhulin05_op1;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168;jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;home',
    '明教': 'jh 18;e;w;w;n;s;e;n;nw;n;n;w;e;n;n;n;ne;n;n;w;e;e;w;n;w;e;e;w;n;n;w;w;s;n;n;e;e;e;e;s;se;se;e;w;nw;nw;w;w;n;w;w;n;n;e;nw;se;e;e;e;se;e;w;sw;s;w;w;n;e;w;n;e;w;w;e;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n;home',
    '光明顶': 'jh 18;e;w;w;n;s;e;n;nw;n;n;w;e;n;n;n;ne;n;n;w;e;e;w;n;w;e;e;w;n;n;w;w;s;n;n;e;e;e;e;s;se;se;e;w;nw;nw;w;w;n;w;w;n;n;e;nw;se;e;e;e;se;e;w;sw;s;w;w;n;e;w;n;e;w;w;e;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n;home',
    '全真教': 'jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;e;w;w;e;n;e;n;s;e;e;w;n;n;s;s;w;w;w;w;w;w;s;n;e;s;n;e;e;e;n;n;w;w;s;s;n;n;w;s;s;n;n;w;n;n;n;n;n;n;e;n;e;e;n;n;s;s;e;e;e;e;s;e;s;s;s;n;w;n;s;s;s;s;w;s;n;w;n;e;n;n;n;s;w;n;n;n;s;s;s;w;n;s;w;n;s;s;s;e;n;n;e;s;s;s;w;home',
    '古墓': 'jh 20;s;s;n;n;w;w;s;e;s;s;w;s;s;s;sw;sw;s;e;se;nw;w;s;e;w;w;e;s;s;w;w;e;s;sw;ne;e;s;s;w;w;e;e;s;n;e;e;e;e;s;e;w;n;w;n;e;w;n;s;w;s;n;n;e;w;n;n;s;s;w;e;event_1_3723773;se;n;e;s;e;s;e;home',
    '白驼山': 'jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;w;w;jh 21;nw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;e;s;se;se;n;e;w;n;n;w;e;n;n;e;e;w;ne;sw;e;nw;se;e;se;nw;w;n;s;s;n;w;w;n;n;n;n;s;s;s;s;e;e;e;n;n;w;e;e;e;w;w;n;nw;se;ne;e;w;w;e;n;home',
    '嵩山': 'jh 22;n;n;w;w;s;s;e;w;s;s;w;e;s;n;n;n;n;n;e;n;n;n;n;event_1_88705407;s;s;e;w;s;s;n;n;n;n;w;n;e;n;e;e;w;w;n;w;n;s;e;n;n;n;e;songshan33_op1;n;w;w;w;e;n;w;e;n;s;s;e;n;e;w;n;e;w;n;get_silver;jh 22;n;n;n;eval_busy11_move();eval_busy_move();n;e;n;event_1_1412213;s;event_1_29122616;home',
    '寒梅庄': 'jh 23;n;n;e;w;n;n;n;n;n;e;s;n;w;w;w;e;e;n;e;n;s;w;w;w;e;n;s;e;n;n;e;w;w;n;s;e;event_1_8188693;n;n;w;e;n;n;s;e;n;home',
    '梅庄': 'jh 23;n;n;e;w;n;n;n;n;n;e;s;n;w;w;w;e;e;n;e;n;s;w;w;w;e;n;s;e;n;n;e;w;w;n;s;e;event_1_8188693;n;n;w;e;n;n;s;e;n;home',
    '泰山': 'jh 24;se;nw;n;n;n;n;w;e;e;e;w;s;n;w;n;n;w;e;e;w;n;e;w;n;w;n;n;n;n;n;s;s;w;n;s;e;s;s;s;e;n;e;w;n;w;e;n;n;w;n;e;w;n;w;e;n;n;e;w;s;s;s;s;e;n;n;w;e;e;w;n;n;w;e;e;w;n;s;s;s;s;s;e;s;n;e;n;e;w;n;w;e;e;w;n;n;jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;w;e;n;e;w;n;w;e;n;n;home',
    '铁血大旗门':'jh 11;e;e;s;n;nw;w;nw;e;e;e;se;nw;n;w;jh 25;w;e;e;e;e;e;s;yell;eval_busy11_move();eval_busy_move();n;s;e;ne;se;e;e;e;e;w;w;w;w;nw;sw;w;s;e;event_1_81629028;s;e;n;w;w;s;w;home',
    '大旗门':'jh 11;e;e;s;n;nw;w;nw;e;e;e;se;nw;n;w;jh 25;w;e;e;e;e;e;s;yell;eval_busy11_move();eval_busy_move();n;s;e;ne;se;e;e;e;e;w;w;w;w;nw;sw;w;s;e;event_1_81629028;s;e;n;w;w;s;w;home',
    '大昭寺': 'jh 26;w;w;w;w;w;n;s;w;w;w;n;w;e;e;w;s;w;n;s;s;n;w;e;e;e;e;s;w;e;e;e;w;w;s;w;w;w;s;n;w;n;n;n;n;n;e;e;e;e;e;w;s;s;jh 26;w;w;n;e;e;e;w;w;w;n;s;w;home',
    '魔教': 'jh 27;se;e;n;s;s;n;e;e;jh 27;ne;w;e;n;ne;sw;s;nw;w;nw;w;w;yell;eval_busy11_move();eval_busy1_move();w;nw;sw;ne;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;eval_busy_move();n;n;n;n;w;e;e;w;n;e;n;s;w;n;nw;n;s;se;ne;n;s;sw;w;n;n;s;s;nw;n;s;se;w;n;s;e;sw;n;s;ne;se;n;s;nw;ne;n;s;ne;e;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;w;w;w;w;w;n;n;n;n;n;e;e;e;e;e;w;w;w;w;w;w;w;w;w;w;e;e;e;e;e;n;n;event_1_57107759;e;n;e;n;w;home',
    '黑木崖': 'jh 27;se;e;n;s;s;n;e;e;jh 27;ne;w;e;n;ne;sw;s;nw;w;nw;w;w;yell;eval_busy11_move();eval_busy1_move();w;nw;sw;ne;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;eval_busy_move();n;n;n;n;w;e;e;w;n;e;n;s;w;n;nw;n;s;se;ne;n;s;sw;w;n;n;s;s;nw;n;s;se;w;n;s;e;sw;n;s;ne;se;n;s;nw;ne;n;s;ne;e;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;w;w;w;w;w;n;n;n;n;n;e;e;e;e;e;w;w;w;w;w;w;w;w;w;w;e;e;e;e;e;n;n;event_1_57107759;e;n;e;n;w;home',
    '星宿海': 'jh 28;nw;nw;se;w;e;sw;ne;e;e;jh 28;n;n;e;ne;n;s;sw;w;n;n;n;s;ne;nw;se;sw;nw;w;se;jh 28;n;w;n;n;n;s;se;nw;s;s;w;w;se;nw;w;n;w;e;s;w;w;nw;ne;nw;w;e;ne;nw;ne;e;w;nw;ne;nw;w;e;ne;nw;ne;e;w;nw;jh 28;sw;nw;sw;sw;nw;nw;se;sw;home',
    '茅山': 'jh 29;n;n;n;n;eval_busy6_2_move();e;w;eval_busy6_1_move();n;s;w;eval_busy6_move();n;n;n;n;n;e;w;n;e;w;n;event_1_98579273;w;e;nw;se;e;w;n;e;home',
    '桃花岛': 'jh 30;n;n;ne;sw;n;n;n;w;e;e;w;n;n;w;w;e;e;e;n;s;s;n;w;n;n;n;w;w;s;s;n;n;e;e;e;n;s;s;n;e;n;s;e;n;s;s;n;w;w;w;nw;w;e;se;n;n;n;e;e;w;w;n;se;s;jh 30;yell;eval_busy11_move();eval_busy_move();w;n;e;w;n;home',
    '铁雪山庄': 'jh 31;n;n;n;w;w;w;w;n;n;n;n;w;e;e;jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;n;s;w;sw;ne;e;e;e;n;s;e;event_1_47175535;nw;w;w;n;n;n;n;n;n;s;s;s;w;w;event_1_57281457;se;e;e;e;e;event_1_94442590;jh 31;n;se;jh 31;n;se;e;se;s;w;home',
    '慕容山庄': 'jh 32;n;n;se;w;e;e;s;s;n;n;w;n;w;e;ne;sw;n;n;n;n;s;e;w;w;w;s;n;n;s;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w;e;s;w;n;e;n;w;n;w;e;s;e;e;n;n;s;w;e;e;jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;n;n;s;s;s;s;event_1_92057893;e;n;s;s;event_1_8205862;home',
    '大理': 'jh 33;sw;sw;s;s;s;nw;n;ne;e;se;n;n;n;s;s;s;nw;w;n;n;se;nw;ne;sw;s;s;sw;nw;n;n;n;n;n;s;e;n;s;s;n;e;w;w;s;s;s;s;sw;w;w;s;s;e;w;s;e;w;w;se;nw;e;jh 33;sw;sw;s;s;s;s;w;w;n;se;nw;s;s;nw;n;e;se;n;n;w;se;nw;e;e;se;nw;e;se;nw;w;w;s;s;nw;w;s;se;n;w;w;w;s;s;w;w;e;e;se;e;w;s;jh 33;sw;sw;s;s;s;s;s;w;n;n;n;n;n;s;w;e;e;w;s;s;s;s;e;e;n;se;w;e;n;w;e;e;w;n;s;s;e;e;s;n;n;n;w;e;e;w;n;ne;n;s;e;e;n;s;e;w;w;w;sw;s;s;s;e;n;s;s;n;e;ne;n;s;sw;se;ne;jh 33;sw;sw;s;s;s;s;s;s;w;w;e;e;e;n;s;s;n;e;w;w;s;e;n;s;w;s;e;n;s;s;n;w;w;s;w;e;n;n;se;n;s;ne;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;e;ne;s;n;sw;w;s;w;e;se;nw;s;s;s;e;n;s;w;sw;sw;n;n;s;s;w;e;s;n;ne;ne;s;e;n;n;n;s;s;s;s;n;e;w;w;se;s;n;sw;n;s;s;n;w;jh 33;sw;sw;s;s;s;s;e;e;n;s;s;n;e;e;se;s;s;w;n;n;s;s;e;s;s;n;n;n;e;e;e;ne;sw;w;w;w;n;e;e;se;n;n;n;n;n;n;s;s;s;s;s;s;nw;e;n;n;n;s;s;s;e;e;se;e;s;ne_s;s;n;e;se;e;e;s;n;ne;e;n;s;w;sw;sw;s;s;e;e;w;s;e;w;n;n;e;n;home',
    '断剑山庄': 'jh 34;ne;e;e;e;e;e;n;e;n;n;s;s;w;n;n;n;n;w;e;n;e;w;s;s;s;w;w;w;n;n;yell;eval_busy11_move();eval_busy_move();n;n;w;w;e;s;w;e;n;e;e;e;w;s;n;w;n;e;e;w;n;e;w;s;w;n;w;w;e;e;n;n;n;n;s;s;e;e;event_1_10251226;home',
    '冰火岛': 'jh 35;nw;nw;nw;n;ne;nw;w;w;s;w;e;e;w;n;e;nw;e;e;n;nw;se;s;e;e;e;se;e;w;n;n;ne;n;s;sw;w;n;w;ne;sw;event_1_53278632;s;nw;sw;se;s;sw;sw;se;se;jh 35;nw;nw;nw;n;ne;nw;w;w;s;w;e;e;w;n;e;nw;e;e;n;nw;se;s;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e;w;w;w;n;e;n;w;w;s;s;home',
    '侠客岛': 'jh 36;yell;eval_busy11_move();eval_busy_move();e;ne;ne;ne;e;n;n;s;w;e;s;s;w;e;e;w;n;e;n;s;e;event_1_9179222;e;w;n;e;e;s;e;w;n;e;n;e;e;ne;sw;w;w;s;n;n;n;e;ne;nw;w;jh 36;yell;eval_busy11_move();eval_busy_move();e;se;e;e;e;e;w;w;w;s;s;s;s;w;e;s;n;e;s;n;ne;e;se;nw;e;n;e;n;home',
    '绝情谷': 'jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;ne;sw;n;ne;sw;s;s;s;s;w;w;s;n;e;e;n;n;n;nw;sw;sw;nw;w;n;ne;sw;nw;n;ne;e;ne;se;nw;sw;w;sw;nw;n;ne;e;ne;e;n;ne;sw;s;w;sw;w;n;ne;ne;sw;sw;s;sw;nw;n;nw;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;event_1_16813927jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;ne;sw;n;ne;sw;s;s;s;s;w;w;s;n;e;e;n;n;n;nw;sw;sw;nw;w;n;ne;sw;nw;n;ne;e;ne;se;nw;sw;w;sw;nw;n;ne;e;ne;e;n;ne;sw;s;w;sw;w;n;ne;ne;sw;sw;s;sw;nw;n;nw;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;event_1_16813927;home',
    '碧海山庄': 'jh 38;n;n;w;w;s;w;w;e;e;n;e;e;n;n;w;w;n;e;w;w;e;s;w;e;e;e;n;n;n;w;w;nw;w;w;n;n;n;s;s;s;e;e;se;e;e;n;n;e;se;s;e;w;n;nw;w;n;n;n;n;n;n;s;s;s;s;e;e;se;se;e;n;n;n;n;home',
    '天山': 'jh 39;ne;e;n;ne;ne;se;e;e;w;n;s;s;e;se;nw;w;n;w;nw;w;n;nw;se;s;e;n;ne;nw;ne;nw;event_1_17801939;eval_busy4_move();ne;ne;nw;nw;nw;w;jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;eval_busy3_move();nw;n;ne;nw;nw;n;s;w;w;e;s;n;n;n;w;e;e;w;n;e;e;s;n;w;nw;w;ne;sw;nw;jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w;home',
    '苗疆': 'jh 40;s;s;s;s;w;w;w;w;e;n;s;s;sw;ne;n;se;s;n;nw;e;e;e;e;s;se;sw;s;s;s;s;sw;jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;event_1_8004914;eval_busy3_move();se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;e;w;w;sw;ne;e;n;n;e;w;nw;ne;nw;sw;ne;se;ne;se;se;nw;nw;nw;ne;e;jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;eval_busy3_move();sw;se;event_1_41385370;e;ne;nw;e;sw;se;s;ne;e;home',
    '白帝城': 'jh 41;se;e;e;ne;ne;se;e;n;s;e;ne;sw;se;se;nw;nw;s;w;e;e;jh 41;se;e;e;nw;nw;n;n;w;w;n;n;e;n;s;e;w;w;s;s;e;e;e;ne;s;n;e;w;n;nw;n;jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne;sw;w;w;n;n;n;se;se;event_1_57976870;e;e;e;w;ne;n;w;e;s;sw;w;w;n;n;n;ne;n;nw;se;s;sw;nw;n;s;se;s;s;s;w;w;w;n;ne;home',
    '墨家机关城': 'jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;e;s;w;w;n;e;n;n;n;n;n;n;n;n;n;s;s;s;s;s;w;w;n;e;w;n;e;w;n;e;w;ne;w;e;n;s;sw;s;s;s;e;e;e;e;n;w;e;n;w;e;n;w;e;nw;e;w;n;s;se;s;event_1_39026213;n;ne;eval_busy8_move();e;n;e;s;e;n;nw;e;nw;w;w;e;e;e;w;sw;ne;n;e;w;w;e;nw;se;ne;sw;jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;eval_busy8_move();e;s;e;s;ne;s;sw;nw;s;se;s;e;e;e;w;w;w;sw;s;s;n;se;s;home',
    '掩月城': 'jh 43;w;n;n;n;ne;nw;nw;nw;se;ne;sw;se;se;sw;s;w;e;s;s;w;s;n;w;n;n;n;n;n;s;s;w;e;e;w;s;s;s;w;nw;n;n;s;s;se;e;e;e;e;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw;ne;ne;ne;ne;n;ne;n;n;nw;nw;ne;n;nw;ne;e;se;se;se;se;ne;n;ne;ne;ne;n;n;ne;ne;sw;sw;s;s;sw;sw;sw;n;e;e;n;n;s;s;s;s;n;n;e;e;n;n;s;s;s;s;n;n;e;e;w;w;w;w;w;w;s;s;sw;nw;nw;nw;nw;w;sw;se;sw;sw;w;nw;nw;w;w;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s;s;ne;s;ne;s;n;sw;n;sw;n;n;n;n;ne;ne;ne;ne;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s;e;w;n;n;n;e;e;n;e;e;n;e;e;n;w;n;ne;ne;nw;nw;nw;w;sw;s;s;sw;sw;se;sw;sw;s;s;s;s;se;se;e;s;s;sw;sw;s;se;s;s;sw;sw;s;sw;sw;sw;s;se;se;se;e;e;w;e;n;n;s;s;n;e;n;s;sw;se;se;se;s;s;sw;se;n;s;ne;se;s;e;e;e;ne;se;s;s;se;e;e;w;w;nw;n;s;sw;sw;sw;ne;ne;ne;n;n;nw;ne;ne;nw;nw;w;e;se;se;sw;sw;sw;w;w;n;nw;sw;n;ne;sw;s;nw;n;ne;sw;s;nw;n;ne;sw;s;n;ne;sw;s;ne;sw;se;ne;sw;nw;nw;n;ne;sw;s;ne;home',
    '海云阁': 'jh 44;n;n;w;e;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;s;s;s;s;w;s;s;sw;s;s;se;e;n;e;n;e;e;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;e;n;e;e;n;n;s;w;w;w;w;n;n;n;n;n;n;n;n;nw;w;w;nw;se;e;e;s;s;s;n;e;e;w;w;s;s;s;s;s;s;w;w;w;w;n;n;n;s;s;s;e;e;s;e;s;s;s;s;e;s;w;w;w;w;w;w;n;n;n;n;n;e;e;s;s;n;n;n;w;w;n;n;n;n;n;n;n;n;n;e;e;e;e;e;s;s;s;s;s;s;n;n;n;n;n;n;n;n;nw;w;w;nw;se;e;e;s;s;e;e;e;e;e;e;s;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw;se;s;s;s;s;sw;sw;nw;nw;nw;w;sw;sw;w;w;e;e;ne;w;w;e;e;ne;sw;w;w;s;s;s;s;s;s;s;w;w;s;s;n;n;e;e;s;s;s;s;s;w;w;w;w;w;s;s;s;;home',
    '幽冥山庄': 'jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e;w;s;s;s;sw;w;nw;nw;nw;n;n;n;n;n;s;w;e;e;w;s;s;s;s;se;se;se;e;ne;n;n;n;n;n;ne;ne;n;n;e;e;w;w;n;nw;nw;n;w;e;e;e;e;e;e;home',
    '花街': 'jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e;w;w;w;w;w;w;w;w;n;n;n;e;e;s;n;e;w;n;home',
    '西凉城': 'jh 47;ne;n;n;n;nw;se;ne;ne;e;e;e;e;ne;se;s;s;s;n;n;n;nw;n;ne;e;e;n;n;n;n;n;n;ne;n;s;sw;s;s;s;s;s;s;w;w;n;n;w;w;w;e;e;e;n;n;n;nw;nw;ne;n;ne;n;s;sw;s;sw;nw;nw;nw;w;nw;n;home',
    '高昌迷宫': 'jh 48;e;ne;ne;se;nw;s;s;s;n;n;n;sw;sw;w;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se;nw;ne;n;ne;ne;n;n;n;nw;nw;ne;event_1_54621;n;n;n;home',
    '京城': 'jh 49;n;n;n;w;w;s;s;s;sw;w;w;w;w;w;w;w;w;w;n;n;n;n;ne;e;e;e;e;e;e;e;e;s;s;s;s;sw;w;w;w;w;n;n;w;w;w;w;w;w;n;s;e;e;s;n;e;e;e;e;w;w;n;s;s;n;w;e;e;e;e;e;s;w;e;n;n;e;e;n;s;w;w;w;n;n;n;n;w;w;nw;n;n;n;n;ne;e;e;s;s;s;s;s;s;s;s;s;s;s;s;e;e;ne;n;n;nw;w;w;s;s;s;s;s;s;s;s;s;s;nw;nw;n;n;ne;sw;s;s;se;se;ne;ne;n;n;nw;se;s;s;sw;n;n;n;n;n;n;n;n;n;n;n;s;e;e;se;nw;w;w;n;e;e;e;w;w;w;w;w;w;sw;s;s;w;nw;nw;nw;se;se;se;e;s;n;n;n;ne;e;e;e;e;e;e;se;s;s;s;s;s;s;n;e;ne;ne;n;s;sw;sw;w;w;sw;w;w;w;nw;n;n;n;n;ne;e;e;e;e;se;s;s;s;s;e;s;se;nw;home',
    '越王剑宫': 'jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n;n;ne;home',
    '江陵': 'jh 51;n;n;e;w;w;e;n;n;w;w;n;n;s;s;e;e;n;n;w;e;n;nw;n;s;se;s;s;s;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se;home',
};
var BL_npc="小龙人";
var BL_city="青城山";
var QLNPCList
function BL_mapFunc(){
    var PL_Name= prompt("请输入[地图名称]。","青城山");
    var bl_map=PL_Name.split(',')[1];
    var lj=bl_place[bl_map];
    alert("当前页面的代码如下：\n"+bl_map);
    //cmdCache.push(bl_place[bl_map]);
    //ergodic_go(bl_place[bl_map]);
}
function JT(){
    if (type == "channel" && subType == "sys") {
        var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
        if (msg.indexOf("醉梦销魂") > -1 && ZDFind == 1) {
            var b_j = msg.match("【醉梦销魂】：各位大侠请知晓了，我醉梦楼的(.*)仙子此刻心情大好，小舞一曲以飨同好。座位有限，请速速前来。");
            Infor_OutFunc("表演仙子："+b_j);
        }
    }
}
//----------------------------
var zdcl_Interval;
function zdcl_Func(){
    clearInterval(zdcl_Interval);
    zdcl_Interval = setInterval(function(){
        g_gmain.g_delay_connect = 0;
        connectServer();
    },60000);
}
//-----------显示状态栏内容------------------
function InforOutFunc(text) {
    var node = document.createElement("span");
    node.className = "out2";
    node.style = "color:rgb(255, 127, 0)";
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    document.getElementById("out2").appendChild(node);
    var scrollDom = document.getElementById('out2');
    scrollDom.scrollTop = scrollDom.scrollHeight;
}
//----------------------------------------------
function Infor_OutFunc(text,c) {
    var node = document.createElement("span");
    node.className = "out2";
    node.style = "color:rgb(255, 127, 0)";
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    node.style = "color:rgb(255, 200, 0);text-decoration:underline;background-color:transparent;border-color:transparent";
    node.addEventListener('click', c);
    document.getElementById("out2").appendChild(node);
    var scrollDom = document.getElementById('out2');
    scrollDom.scrollTop = scrollDom.scrollHeight;
}
//-----------------------------------------
function InforOut1Func(a,b,c,n) {
    btnList[a] = document.createElement('button');
    var d = btnList[a];
    d.innerText = a;
    d.style.padding = '0';
    if(c==csFunc){
        d.style = "color:rgb(255, 127, 0);background-color:transparent;border-color:transparent";
    }else{
        d.style = "color:rgb(255, 200, 0);text-decoration:underline;background-color:transparent;border-color:transparent";
    }
    d.style.margin = '-3px -2.7% -3px -2.7%';
    d.style.width = '25%';
    d.style.height = '25px';
    d.onmouseup = function(){
        // InforOutFunc(a);
        // jnname=a;
    };
    d.addEventListener('click', c);
    popList[b].appendChild(d);
    if(n=="1"){
        var newline= document.createElement('br');
        popList[b].appendChild(newline);}
    var scrollDom = document.getElementById('out2');
    scrollDom.scrollTop = scrollDom.scrollHeight;
}
function InforOut2Func(a,b,c,n) {
    btnList[a] = document.createElement('button');
    var d = btnList[a];
    d.innerText = a;
    d.style.padding = '0';
    //d.style.height='25px';
    if(c==csFunc){
        d.style = "color:rgb(255, 127, 0);background-color:transparent;border-color:transparent";
    }else{
        d.style = "color:rgb(255, 200, 0);text-decoration:underline;background-color:transparent;border-color:transparent";
    }
    //d.style = "color:rgb(255, 127, 0);background-color:transparent;border-color:transparent";
    d.addEventListener('click', c);
    popList[b].appendChild(d);
    if(n=="1"){
        var newline= document.createElement('br');
        popList[b].appendChild(newline);
    }
    var scrollDom = document.getElementById('out2');
    scrollDom.scrollTop = scrollDom.scrollHeight;
}
//---------------------主线任务集---------------------------//
//开新号
function startlj() {
    go2('ask start_zhongshanglaozhe;lookroom;fight start_mengmianren;lookroom;ask start_zhongshanglaozhe;lookroom;s;guanchaxuanya;lookroom;tiaoxiaxuanya;lookroom;qiguaiguozi;lookroom;e;guanchashendiao;lookroom;ask start_shendiao;work do maikuli;exercise;');
}
function xt_job() {
    go2('jh 1;ask snow_waiter;ask snow_mercenary;e;fight snow_worker');
}
function ly_job() {

    go2('jh 2;n;ask luoyang_luoyang18;n;kill luoyang_xiaotou;n;kill luoyang_xiaotou;e;kill luoyang_xiaotou;fight luoyang_luoyang27;s;kill luoyang_xiaotou;');

}
function hsc_job() {

    go2('jh 3;ask huashancun_huashancun12;fight huashancun_huashancun12;n;event_1_38583676;s;s;fight huashancun_popitouzi;s;fight huashancun_huashancun1;w;give huashancun_huashancun6;');

}
function hs_job() {

    go2('jh 4;ask huashan_huashan14;fight huashan_huashan14;n;n;fight huashan_huashan2;n;n;fight huashan_huashan25;n;n;fight huashan_huashan26;n;n;fight huashan_huashan27;n;kill huashan_huashan24;n;fight huashan_huashan8;n;ask huashan_gao;n;n;n;ask huashan_lao;fight huashan_lao;s;w;#20 event_1_60189725;e;s;ask huashan_yue')}
function yz_job() {

    go2('jh 5;ask yangzhou_yangzhou16;n;n;n;ask yangzhou_yangzhou19;n;w;ask yangzhou_xiaofeizei;fight yangzhou_xiaofeizei;ask yangzhou_yangzhou3;yangzhou16_op1;fight yangzhou_yangzhou18;e;e;s;ask yangzhou_yangzhou19;fight yangzhou_yangzhou19;n;n;n;n;n;n;e;kill yangzhou_yangzhou24;w;s;s;s;kill yangzhou_yangzhou28;s;s;s;s;s;s;ask yangzhou_yangzhou16;')
}
function gb_job() {

    go2('jh 6;event_1_98623439;kill gaibang_haozi;ne;kill gaibang_haozi;ne;ne;kill gaibang_haozi;sw;sw;n;kill gaibang_haozi;ne;kill gaibang_haozi;ne;ne;event_1_97428251;kill gaibang_haozi;')
}
function qyx_job() {

    go2('jh 3;s;s;s;kill huashancun_heigou;mst_go();jh 7;event_1_57435070;kill choyin_ghost;s;s;s;s;event_1_65599392;kill choyin_shadow;ne;s;s;s;sw;kill choyin_p_ghost;')
}
function ems_job() {

    go2('jh 8;w;nw;n;n;auto_equip off;n;auto_equip on;n;e;e;n;n;e;fight emei_shoushan;n;fight emei_wenyue;fight emei_wenxin;n;fight emei_xunshan;n;n;w;n;n;n;n;n;n;n;n;n;fight emei_hufa;ne;ne;fight emei_hufa2;n;ask houshan_miejue')
}
function hengs_job() {

    go2('jh 9;fight henshan_henshan10;n;fight henshan_henshan1;n;fight henshan_henshan3;n;n;kill henshan_henshan12')
}
triggers.newTrigger(/^石高达：竟敢惹我，我这就找人来收拾你！/, function(m) {
    go2('n;n;n;e;e;kill henshan_heiyiren');
    runhit_open()
}, "zxjob", "");
function wds_job() {

    go2('jh 10;fight wudang_tufeitou;w;n;fight wudang_tufei2;n;w;w;ask wudang_xiaosong;fight wudang_xiaosong;w;n;n;n;n;n;ask wudang_guxu;fight wudang_guxu;n;fight wudang_yu')
}
function wyz_job() {

    go2('jh 11;e;e;s;sw;fight latemoon_lm_guard;se;w;fight dancer_master')
}
function syg_job() {

    go2('jh 12;n;n;n;kill waterfog_guard;w;n;nw;e;kill waterfog_watcher;w;se;s;e;n;fight fighter_master')
}
function sl_job() {

    go2(';;;;jh 13;n;n;n;n;n;n;n;n;n;n;e;fight shaolin_cheng-guan;s;s;s;s;fight shaolin_cheng-jian;s;s;fight shaolin_cheng-ji;s;s;fight shaolin_cheng-he;n;fight shaolin_cheng-mie;n;n;n;n;fight shaolin_cheng-jing;n;fight shaolin_cheng-ming;n;n;w;w;s;s;s;s;s;s;fight shaolin_cheng-ling;s;s;fight shaolin_cheng-shang;n;n;n;n;n;fight shaolin_cheng-shi;n;fight shaolin_cheng-si;n;n;fight shaolin_cheng-xin;s;fight shaolin_cheng-yi;s;s;s;s;fight shaolin_cheng-xin2;s;s;fight shaolin_cheng-yu;n;n;n;n;n;n;n;e;n;n;kill shaolin_cheng-xing')
}
function tm_job() {

    go2('jh 14;w;n;n;n;ask tangmen_tangbing;fight tangmen_tangbing;e;e;n;fight tangmen_tangjian;s;w;w;w;w;s;fight tangmen_tangbai;n;e;e;e;e;n;n;fight tangmen_tangzhu;fight tangmen_tangmei;s;e;fight tangmen_tanghong;w;s;w;w;w;w;w;n;fight tangmen_tangfang;s;s;fight tangmen_tangyuan')
}
function qcs_job() {

    go2('jh 15;n;nw;w;nw;w;s;s;fight qingcheng_dizi1;s;auto_equip off;w;auto_equip on;w;fight qingcheng_renying;w;ask qingcheng_masteryu;e;e;e;n;n;n;e;se;e;se;s;s;s;s;s;s;s;w;ask qingcheng_mudaoren')
}
function xyl_job() {

    go2('jh 16;s;s;s;s;e;e;s;w;ask xiaoyao_mengmianr;kill xiaoyao_mengmianr;w;ask xiaoyao_suxinghe;fight xiaoyao_suxinghe;e;e;e;n;n;e')
}
function kf_job() {

    go2('jh 17;n;e;fight kaifeng_kaifeng19;s;ask kaifeng_kaifeng3;n;w;w;ask kaifeng_kaifeng2;e;n;n;n;n;e;n;n;ask kaifeng_kaifeng28;n;event_1_27702191;ask kaifeng_kaifeng30;fight kaifeng_kaifeng30;w;s;s;s;w;s;s;s;s;e;s;ask kaifeng_kaifeng3')
}
function mj_job() {

    go2('jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;ask mingjiao_zhang;s;s;s;s;s;s;fight mingjiao_weiyixiao;n;n;n;n;n;n;ask mingjiao_zhang;s;w;fight mingjiao_longwang;e;n;ask mingjiao_zhang;s;e;fight mingjiao_shiwang;w;n;ask mingjiao_zhang;s;fight mingjiao_yingwang')
}
function qzj_job() {

    go2('jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;e;fight quanzhen_sun;w;w;w;n;fight quanzhen_ma;n;fight quanzhen_qiu;n;n;fight quanzhen_wangchuy;e;n;n;fight quanzhen_tan;e;fight quanzhen_liu;w;w;w;w;w;s;fight quanzhen_hao')
}
function gm_job() {

    go2('jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e;ask gumu_longnv;e')
}
function bts_job() {

    go2('jh 21;nw;w;w;nw;e;ask baituo_woman;w;se;e;e;ne;n;n;fight baituo_shanzei1;ne;fight baituo_shanzei2;n;n;fight baituo_shanzei3;w;ask baituo_jinhua;e;s;s;sw;s;s;sw;w;w;nw;n;n;n;n;ask btshan_ouyangke;ask btshan_ouyangke;fight btshan_ouyangke;s;s;s;s;e;ask baituo_woman;')
}
function ss_job() {

    go2('jh 22;n;n;w;n;n;n;n;n;e;n;n;n;fight songshan_songshan22;n;fight songshan_songshan23;n;fight songshan_songshan24;n;fight songshan_songshan27;n;fight songshan_songshan29;n;kill songshan_songshan_zhanglao3;')
}
function hmz_job() {

    go2('jh 23;n;n;n;n;fight meizhuang_meizhuang13;n;n;n;e;s;fight meizhuang_meizhuang4;n;w;n;n;n;e;fight meizhuang_meizhuang11;w;w;n;fight meizhuang_meizhuang10;s;e;s;s;e;n;fight meizhuang_meizhuang8')
}
function ts_job() {

    go2('jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;ask taishan_taishan17;fight taishan_taishan17;s;s;s;s;s;w;event_1_87037293;fight taishan_taishan35;e;ask taishan_taishan9;ask taishan_taishan9;fight taishan_taishan9;')
}
function dqm_job() {

    go2('jh 25;e;e;e;e;s;yell;e;ne;se;e;e;e;e;ask tieflag_master2;ask tieflag_master2;fight tieflag_master2;w;w;w;w;nw;sw;w;s;e;event_1_81629028;ask tieflag_master;ask tieflag_master;fight tieflag_master;s;e;n;w;w;ask tieflag_yedi;')
}
function dzs_job() {

    go2('jh 26;w;w;w;w;w;w;w;w;w;w;ask lama_master;e;e;e;e;n;n;e;kill guanwai_puying;MSmoshiti(大地飞鹰的尸体);w;s;s;w;w;w;w;w;give lama_master;fight lama_master;e;e;e;e;s;e;ask guanwai_waiter;ask guanwai_waiter;w;n;w;w;w;w;');

}
function mojiao_job() {

    go2('jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;setTimeout(myc,1000);yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;e;');
}
function xxh_job() {

    go2('jh 28;ask xingxiu_trader;n;n;fight xingxiu_shihou;n;fight xingxiu_zhaixing;n;nw;w;ask xingxiu_caihua;fight xingxiu_caihua;e;se;n;kill xingxiu_shihou;')
}
function ms_job() {

}
function thd_job() {

    go2('jh 30;fight taohua_lushengf;n;n;n;n;n;n;n;n;n;n;n;n;n;n;ask taohua_huang;fight taohua_huang;s;s;s;s;e;e;n;ask taohua_qulingf;ask taohua_qulingf;fight taohua_qulingf;s;w;w;n;n;n;n;ask taohua_huang;')
}
function txsz_job() {

    go2('jh 31;n;n;n;w;w;w;w;n;fight resort_guard;n;fight resort_xueyuan;n;ask resort_master;fight resort_master2;n;fight resort_w_guy')
}
function mrsz_job() {

    go2('jh 32;n;n;se;n;n;n;n;w;w;n;ask murong_murongfu;fight murong_murongfu;s;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w;ask murong_murongbo;fight murong_murongbo;')
}
function dl_job() {

    go2('jh 33;sw;sw;s;s;s;s;s;e;n;fight dali_zhuwanli;se;e;e;n;n;n;ne;n;ask dali_duanzc;s;sw;s;s;s;w;w;nw;s;w;s;s;s;s;e;ne;n;n;e;e;e;ne;ask dali_duanyu;nw;w;w;n;ask dali_kurong;fight dali_kurong;s;w;w;w;nw;w;w;w;w;s;s;s;s;s;s;s;s;s;s;ask dali_yideng;fight dali_yideng;')
}

function djsz_job() {
    go2('jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;e;e;ask duanjian_tiannu;ask duanjian_tiannu;fight duanjian_tiannu;w;w;n;n;n;n;e;e;event_1_10251226;ask duanjian_feng;ask duanjian_feng;fight duanjian_feng;');
}
function bhd_job() {
    go2('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;n;n;e;e;s;w;s;e;e;e;ask binghuo_yinsusu;ask binghuo_yinsusu;ask binghuo_yinsusu;ask binghuo_yinsusu;fight binghuo_yinsusu;w;n;e;e;n;se;e;nw;n;n;n;ask binghuo_zhaojunzhu;ask binghuo_zhaojunzhu;fight binghuo_zhaojunzhu;s;s;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;ask binghuo_zhangwuxia;n;n;e;e;s;w;s;e;e;e;w;n;e;e;n;se;e;nw;n;n;n;ne;n;ask binghuo_xieshiwang;ask binghuo_xieshiwang;ask binghuo_xieshiwang;s;sw;w;n;w;nw;kill binghuo_heiyishashou;sw;se;s;kill binghuo_heiyishashou;sw;sw;se;kill binghuo_heiyishashou;se;kill binghuo_yuanzhen;nw;nw;ne;ne;n;nw;ne;se;e;s;e;ne;n;ask binghuo_xieshiwang;ask binghuo_xieshiwang;home;');
}
function xkd_job() {

    go2('jh 36;yell;e;ask xiakedao_zhangsan;ask xiakedao_zhangsan;ne;ne;ne;e;e;n;ask xiakedao_lisi;ask xiakedao_lisi;s;w;n;w;ask xiakedao_baizhangmen;ask xiakedao_baizhangmen;fight xiakedao_baizhangmen;e;s;e;e;e;e;e;n;n;n;e;ne;nw;ask xiakedao_ailaozhe;ask xiakedao_ailaozhe;fight xiakedao_ailaozhe;w;ask xiakedao_gaolaozhe;ask xiakedao_gaolaozhe;ask xiakedao_gaolaozhe;fight xiakedao_gaolaozhe;e;se;sw;w;s;s;s;')
}
function jueqingg_job() {

    go2('jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw;kill jueqinggu_guzhu')
}
function bihaisz_job() {

    go2('jh 38;n;n;w;ask bihaishanzhuang_faming;e;n;n;n;n;n;n;n;n;n;n;n;n;n;kill bihaishanzhuang_wangxin')
}
function tianshan_job() {

    setTimeout(tianshan_joba, 200)
}
function tianshan_joba() {
    go2('jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;');
    setTimeout(tianshan_jobb, 5000)
}
function tianshan_jobb() {
    if (g_obj_map.get("msg_room") == undefined) {
        setTimeout(function() {
            tianshan_jobb()
        }, 200)
    } else {
        var a = g_obj_map.get("msg_room").get("short").match(/[\u4e00-\u9fa5]/g).join("");
        console.log(a);
        if (a == "失足岩") {
            console.log("继续走。");
            go2('nw;n;ne;nw;nw;w;n;n;ask tianshan_fuzhenshen;n;e;nw;w;nw;ask tianshan_tianshandajianshi;fight tianshan_tianshandajianshi;se;se;w;s;ask tianshan_fuzhenshen;ask tianshan_fuzhenshen;ask tianshan_fuzhenshen')
        } else {
            setTimeout(tianshan_joba, 200)
        }
    }
}
function miaojiang_job() {
    go2('jh 40;s;s;s;s;w;w;w;ask miaojiang_miaosanjin;ask miaojiang_miaosanjin;e;e;e;e;s;se;sw;s;s;s;e;ask miaojiang_qiaofu;ask miaojiang_qiaofu;e;sw;se;sw;se;event_1_8004914')
    setTimeout(miaojiang1(),2000);
}
var miaojiangZX;
function miaojiang1(){
    miaojiangZX=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        if (curName == "澜沧江北岸" && roomInfo.get("northwest") == "江边小路") go("event_1_8004914");
        else if (curName == "澜沧江南岸" && roomInfo.get("southeast") == "草地") go("event_1_85349264");
        else if (curName == "澜沧峡" && roomInfo.get("southwest") == "澜沧峡")
        {clearInterval(miaojiangZX);
         setTimeout(miaojiang2(),2000);
        }
    },1000);
}
function miaojiang2(){
    go2("sw;ask miaojiang_languniang;kill miaojiang_languniang;se;event_1_41385370;e;ne;nw;e;sw;se;s;ne;e;s;s;e;n;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;#4 n;nw;ne;ne;nw;ne;e;ask miaojiang_hejiaozhu;ask miaojiang_hejiaozhu;kill miaojiang_hejiaozhu");
}
function baidicheng(){
    go2("jh 41;se;e;e;ask baidicheng_baiyidizi;ask baidicheng_baiyidizi;kill baidicheng_baiyidizi;nw;nw;ask baidicheng_shoumenshibing;kill baidicheng_shoumenshibing;n;n;w;w;ask baidicheng_baiyishibing;prev;n;items use ice lotus;items use ice lotus;n;e;ask baidicheng_wenjiangjun;kill baidicheng_wenjiangjun;e;ne;se;s;e;items use ice lotus;items use ice lotus;ask baidicheng_gongsunjiangjun;kill baidicheng_gongsunjiangjun;");
}
function jiguancheng(){
    go2("jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;ask mojiajiguancheng_suolucan;ask mojiajiguancheng_suolucan;#5 n;ask mojiajiguancheng_yandan;ask mojiajiguancheng_yandan;ask mojiajiguancheng_jingke;ask mojiajiguancheng_jingke;;kill mojiajiguancheng_jingke;n;n;e;se;s;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;w;w;ask mojiajiguancheng_dajiangshi;ask mojiajiguancheng_dajiangshi;e;e;se;");
    setTimeout(jiguancheng1(),20000);
}
var jiguanchengZX;
function jiguancheng1(){
    jiguanchengZX=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        if (curName == "变化道" && roomInfo.get("northwest") == "石板大道") setTimeout(()=>{go("se;s;")},2000);
        else if (curName == "变化道" && roomInfo.get("west") == "变化道") setTimeout(()=>{go("se;s;")},2000);
        else if (curName == "变化道" && roomInfo.get("west") == "神龙山")
        {clearInterval(jiguanchengZX);
         setTimeout(jiguancheng2(),2000);
        }
    },1000);
}
function jiguancheng2(){
    go2("w;e;s;e;s;ne;s;sw;nw;s;se;s;sw;s;s;ask mojiajiguancheng_xufuzi;ask mojiajiguancheng_xufuzi;n;n;ne;#3 e;kill mojiajiguancheng_tjz;#3 w;sw;s;s;ask mojiajiguancheng_xufuzi;");
}
function yanyuecheng(){

}
function haiyunge(){

}
function youmingshanzhuang(){

}
function huajie(){

}
function xiliang(){

}
function gaochang(){

}
function jingcheng(){

}
function jiangong(){

}
function jiangling(){

}
function tianlong(){

}
function xixia(){

}
function nanzhao(){

}



//-----------------主线任务集结束------------------------

//复制内容
function copyToClipboard(str){
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
          document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
}

//摸尸体
var mst_interval = null;
function mst_go(){
    var corpse = [];
    var mst_i = 0;
    mst_interval = setInterval(function(){
        if(cmdCache.length!=0||g_gmain.is_fighting){
            return;
        }
        var m = g_obj_map.get("msg_room");
        for(var i =1;m.get('item'+i);i++){
            if((m.get('item'+i)).indexOf("硫磺") > -1 || (m.get('item'+i)).indexOf("佛灯") > -1 || (m.get('item'+i)).indexOf("粉金小炉") > -1){//佛灯//粉金小炉
                clickButton('get '+m.get('item'+i).split(',')[0]);
                return;
            }
            if(!corpse.contains(m.get('item'+i).split(',')[0])){
                corpse.push(m.get('item'+i).split(',')[0]);
            }
        }
        if(corpse.length>0 && mst_i<corpse.length){
            clickButton('get '+corpse[mst_i]);
            mst_i++;
        }
    },100)
    //setTimeout(clearInterval(mst_interval),10*1000);
}
//摸一次
var mst_gogo=function(b){
    var mmmm = g_obj_map.get("msg_room");
    var type=b.get('type');
    var msg = b.get('msg');
    for(var i =1;i<10;i++){
        if((mmmm.get('item'+i)).indexOf("的尸体") > -1 ){
            clickButton('get '+mmmm.get('item'+i).split(',')[0]);
                       }
    }
}
var lianyao_interval = null;
function FDlianyao(){
    go2("items get_store /obj/med/qnlc2");
    go2("items get_store /obj/med/qnzz2");
    go2("items get_store /obj/snmf/bingyingxianlu");
    go2("items get_store /obj/snmf/cangwudongshen");
    go2("items get_store /obj/med/dahuandan");
    go2("items info obj_dahaidan4");
    go2("items get_store /obj/med/kuangbaodan4");
    go2("items get_store /obj/med/qiankundan4");
    go2("items get_store /obj/med/dahuandan2");
    go2("items get_store /obj/med/kuangbaodan2");
    go2("items get_store /obj/med/qiankundan2");
    go2("items get_store /obj/med/kuangbaodan");
    go2("items get_store /obj/snmf/kunlunhuolian");
    go2("items get_store /obj/med/qnlc");
    go2("items get_store /obj/snmf/longhuoteng");
    go2("items get_store /obj/med/qnlc3");
    go2("items get_store /obj/med/qnzz3");
    go2("items get_store /obj/med/qiankundan");
    go2("items get_store /obj/med/dahuandan3");
    go2("items get_store /obj/med/kuangbaodan3");
    go2("items get_store /obj/med/qiankundan3");
    go2("items get_store /obj/med/qnlc4");
    go2("items get_store /obj/med/qnzz4");
    go2("items get_store /obj/snmf/xilingchongcao");
    go2("items get_store /obj/med/xiaohuandan");
    go2("items get_store /obj/med/qnzz");
    go2("fudi shennong;fudi shennong fetch;");//府邸收获丹药
    go2("fudi shennong make 1;fudi shennong make 2;fudi shennong make 3;fudi shennong make 4;fudi shennong make 5;");
    lianyao_interval= setInterval(function(b){
        go2("fudi shennong;fudi shennong fetch;");//府邸收获丹药
        go2("fudi shennong make 1;fudi shennong make 2;fudi shennong make 3;fudi shennong make 4;fudi shennong make 5;");
        go2("golook_room");//回当前页面
    },1000*60*60+1000*60)//

}
function nanzhaozhixian1(){
    go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;w;w;w;s;s;s;s;s;s;s;s;s;s;w;#20 ask nanzhaoguo_puganmeinv;event_1_59185970;#20 ask nanzhaoguo_puganmeinv;e;n;n;w;n;#20 ask nanzhaoguo_duwenxu;s;e;s;s;s;e;e;e;event_1_42093689;n;n;n;n;n;n;n;e;e;e;e;e;e;e;event_1_42093689;n;n;n;n;n;n;n;n;;;w;w;w;w;w;w;w;w;w;w;w;w;w;w;event_1_42093689;n;n;n;n;n;n;n;n;e;e;e;e;event_1_42093689;#20 s;w;n;#20 ask nanzhaoguo_duwenxu;say洞经音乐;#20 ask nanzhaoguo_duwenxu;s;e;#12 n;e;n;#50 ask nanzhaoguo_changxuechangshi;s;#5 e;#4 s;e;e;n;#50 ask nanzhaoguo_xuyunchangshi;s;w;w;#12 n;#7 w;#6 n;e;n;e;#50 ask nanzhaoguo_wujichangshi;w;s;w;#6 s;e;e;e;#18 s;e;#50 ask nanzhaoguo_daikang;w;#6 n;e;e;s;#50 ask nanzhaoguo_jinxiangyu;#50 ask nanzhaoguo_liyu;jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;n;n;n;nw;nw;w;nw;n;n;w;n;n;event_1_55401669;jh 1;e;n;n;n;n;w;event_1_90287255 go 9;#50 ask nanzhaoguo_jinxiangyu;#50 ask nanzhaoguo_liyu;#50 ask nanzhaoguo_jinxiangyu;n;w;w;#6 s;e;give nanzhaoguo_daikang;w;#6 n;w;w;w;n;n;w;ask nanzhaoguo_shenminanren;kill nanzhaoguo_shenminanren;ask nanzhaoguo_shenminanren;e;s;s;e;e;e;#6 s;e;ask nanzhaoguo_daikang;jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n;#100 ask huajie_yingsanhua;say 君王城上竖降旗，妾在深宫哪得知。十四万人齐解甲，宁无一个是男儿！;#100 ask huajie_yingsanhua;jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;s;s;s;s;s;s;e;#100 ask nanzhaoguo_daikang;talk支线告一段落，一小时后再找嵇康对话的乐谱;");
}
function nanzhaozhixian2(){
    go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;w;w;s;s;s;s;s;s;e;#20 ask nanzhaoguo_daikang;w;s;s;w;w;w;w;n;give nanzhaoguo_duwenxu;event_1_83706838;talk支线结束,之后可以开始周常——元帅府奏乐！;")
}

//13级装备底材制作
function lv13amor1(){
    //兑换装备底材
    go2("jh 1;e;n;n;n;n;e;shop xf_buy xf_shop51;shop xf_buy xf_shop52;shop xf_buy xf_shop48;shop xf_buy xf_shop47;shop xf_buy xf_shop46;shop xf_buy xf_shop44;shop xf_buy xf_shop43;");
    //摹刻底材
    go2("moke equip_armor10;moke equip_boots10;moke equip_finger10;moke equip_head10;moke equip_neck10;moke equip_wrists10;moke equip_waist10");
}
function lv13amor2(){
    //取出装备碎片
    go2("items get_store /obj/quest/hat_suipian11;items get_store /obj/quest/waist_suipian11;items get_store /obj/quest/shield_suipian11;items get_store /obj/quest/blade_suipian11;items get_store /obj/quest/sword_suipian11;items get_store /obj/quest/unarmed_suipian11;items get_store /obj/quest/throwing_suipian11;items get_store /obj/quest/staff_suipian11;items get_store /obj/quest/stick_suipian11;items get_store /obj/quest/whip_suipian11;items get_store /obj/quest/axe_suipian11;items get_store /obj/quest/necklace_suipian11;items get_store /obj/quest/hammer_suipian11;items get_store /obj/quest/spear_suipian11;items get_store /obj/quest/wrists_suipian11;items get_store /obj/quest/finger_suipian11;items get_store /obj/quest/boots_suipian11;items get_store /obj/quest/cloth_suipian11;items get_store /obj/quest/armor_suipian11;items get_store /obj/quest/dagger_suipian11;items get_store /obj/quest/surcoat_suipian11;items get_store /obj/quest/hat_suipian12;items get_store /obj/quest/waist_suipian12;items get_store /obj/quest/shield_suipian12;items get_store /obj/quest/blade_suipian12;items get_store /obj/quest/sword_suipian12;items get_store /obj/quest/unarmed_suipian12;items get_store /obj/quest/throwing_suipian12;items get_store /obj/quest/staff_suipian12;items get_store /obj/quest/stick_suipian12;items get_store /obj/quest/whip_suipian12;items get_store /obj/quest/axe_suipian12;items get_store /obj/quest/necklace_suipian12;items get_store /obj/quest/hammer_suipian12;items get_store /obj/quest/spear_suipian12;items get_store /obj/quest/wrists_suipian12;items get_store /obj/quest/finger_suipian12;items get_store /obj/quest/boots_suipian12;items get_store /obj/quest/cloth_suipian12;items get_store /obj/quest/armor_suipian12;items get_store /obj/quest/dagger_suipian12;items get_store /obj/quest/surcoat_suipian12;");
    //找华山村铁匠
    go2("jh 3;s;e;n");
    //兑换11级装备
    go2("duihuan_mieshen_go gift1;duihuan_mieshen_go gift10;duihuan_mieshen_go gift2;duihuan_mieshen_go gift3;duihuan_mieshen_go gift4;duihuan_mieshen_go gift5;duihuan_mieshen_go gift7;");
    //摹刻11级装备
    go2("moke equip_armor11;moke equip_boots11;moke equip_finger11;moke equip_wrists11;moke equip_neck11;moke equip_waist11;moke equip_head11");
    //兑换12级装备
    go2("duihuan_eq12_go gift1;duihuan_eq12_go gift10;duihuan_eq12_go gift2;duihuan_eq12_go gift3;duihuan_eq12_go gift4;duihuan_eq12_go gift5;duihuan_eq12_go gift7;");
    //摹刻12级装备
    go2("moke equip_armor12;moke equip_boots12;moke equip_finger12;moke equip_wrists12;moke equip_neck12;moke equip_waist12;moke equip_head12;");
}
function lv13amor3(){
    //穿上底材
    go2("wear equip_moke_head12;wear equip_moke_waist12;wear equip_moke_neck12;wear equip_moke_wrists12;wear equip_moke_finger12;wear equip_moke_boots12;wear equip_moke_armor12;");
    //老祭祀冰月1-1
    go2("jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_waist12;by_upgrade 1 equip_moke_wrists12;by_upgrade 1 equip_moke_neck12;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12");
    //穿上冰月1-1装备
    go2("wear equip_by_neck12;wear equip_by_wrists12;wear equip_by_waist12");
    //方糅冰月2-1
    go2("jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_waist12;#100 by_upgrade 2 equip_by_wrists12;#100 by_upgrade 2 equip_by_neck12;");
    //妖僧冰月3-1
    go2("jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_waist12;#100 by_upgrade 3 equip_by_wrists12;#100 by_upgrade 3 equip_by_neck12;");
    //老祭祀1-2
    go2("jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12;by_upgrade 1 equip_moke_boots12;");
    //穿上冰月1-2装备
    go2("wear equip_by_boots12;wear equip_by_finger12;wear equip_by_armor12;wear equip_by_head12;");
    //方糅冰月2-2
    go2("jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_head12;#100 by_upgrade 2 equip_by_armor12;#100 by_upgrade 2 equip_by_finger12;#100 by_upgrade 2 equip_by_boots12");
    //妖僧冰月3-2
    go2("jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_head12;#100 by_upgrade 3 equip_by_armor12;#100 by_upgrade 3 equip_by_finger12;#100 by_upgrade 3 equip_by_boots12");
    //脱下材料
    go2("remove equip_by_boots12;remove equip_by_finger12;remove equip_by_armor12;remove equip_by_head12;remove equip_by_neck12;remove equip_by_waist12;remove equip_by_wrists12;");

}
//十三级装备宝石阵法
function lv13amor4(){
    let n= prompt("请输入装备类别{1：剑神套，2：垂钓者，3：隐居贤者}","1");
    n=Number(n);
    switch(n){
        case 1:
            //剑神装备上宝石
            go2("#4 imbed obj_jianyironghen wear hongbaoshi8;#2 imbed obj_jianyironghen wear lanbaoshi8;#1 imbed obj_jianyironghen wear lvbaoshi8;#4 imbed obj_jiandaozhangcun wear lanbaoshi8;#3 imbed obj_jiandaozhangcun wear lvbaoshi8;#4 imbed obj_jianxinbumie wear huangbaoshi8;#2 imbed obj_jianxinbumie wear lanbaoshi8;#1 imbed obj_jianxinbumie wear lvbaoshi8;#4 imbed obj_wuwozhijian wear lanbaoshi8;#3 imbed obj_wuwozhijian wear lvbaoshi8;#4 imbed obj_wuyinglou-xianglian wear lanbaoshi8;#3 imbed obj_wuyinglou-xianglian wear lvbaoshi8;#4 imbed obj_wuyinglou-shouzhuo wear hongbaoshi8;#2 imbed obj_wuyinglou-shouzhuo wear lanbaoshi8;#1 imbed obj_wuyinglou-shouzhuo wear lvbaoshi8;#5 imbed obj_wuyinglou-jiezhi wear hongbaoshi8;#1 imbed obj_wuyinglou-jiezhi wear lvbaoshi8;#1 imbed obj_wuyinglou-jiezhi wear lanbaoshi8;");
            break;
        case 2:
            //钓鱼装备上宝石
            go2("");
            break;
        case 3:
            //贤者装备上宝石
            go2("#4 imbed obj_zhongzuiduxing wear hongbaoshi8;#2 imbed obj_zhongzuiduxing wear lanbaoshi8;#1 imbed obj_zhongzuiduxing wear lvbaoshi8;#4 imbed obj_qingtianwanshi wear lanbaoshi8;#3 imbed obj_qingtianwanshi wear lvbaoshi8;#4 imbed obj_lankeyimeng wear huangbaoshi8;#2 imbed obj_lankeyimeng wear lanbaoshi8;#1 imbed obj_lankeyimeng wear lvbaoshi8;#4 imbed obj_shanyecunfu wear lanbaoshi8;#3 imbed obj_shanyecunfu wear lvbaoshi8;#4 imbed obj_xianzhe-xianglian wear lanbaoshi8;#3 imbed obj_xianzhe-xianglian wear lvbaoshi8;#4 imbed obj_xianzhe-shouzhuo wear hongbaoshi8;#2 imbed obj_xianzhe-shouzhuo wear lanbaoshi8;#1 imbed obj_xianzhe-shouzhuo wear lvbaoshi8;#5 imbed obj_xianzhe-jiezhi wear hongbaoshi8;#1 imbed obj_xianzhe-jiezhi wear lvbaoshi8;#1 imbed obj_xianzhe-jiezhi wear lanbaoshi8;");
            break;
        default:
            alert("输入参数错误，请重新输入");
    }
}
function up13amor(){

    //兑换装备底材
    go2("jh 1;e;n;n;n;n;e;shop xf_buy xf_shop51;shop xf_buy xf_shop52;shop xf_buy xf_shop48;shop xf_buy xf_shop47;shop xf_buy xf_shop46;shop xf_buy xf_shop44;shop xf_buy xf_shop43;");
    //摹刻底材
    go2("moke equip_armor10;moke equip_boots10;moke equip_finger10;moke equip_head10;moke equip_neck10;moke equip_wrists10;moke equip_waist10");
    //取出装备碎片
    go2("items get_store /obj/quest/hat_suipian11;items get_store /obj/quest/waist_suipian11;items get_store /obj/quest/shield_suipian11;items get_store /obj/quest/blade_suipian11;items get_store /obj/quest/sword_suipian11;items get_store /obj/quest/unarmed_suipian11;items get_store /obj/quest/throwing_suipian11;items get_store /obj/quest/staff_suipian11;items get_store /obj/quest/stick_suipian11;items get_store /obj/quest/whip_suipian11;items get_store /obj/quest/axe_suipian11;items get_store /obj/quest/necklace_suipian11;items get_store /obj/quest/hammer_suipian11;items get_store /obj/quest/spear_suipian11;items get_store /obj/quest/wrists_suipian11;items get_store /obj/quest/finger_suipian11;items get_store /obj/quest/boots_suipian11;items get_store /obj/quest/cloth_suipian11;items get_store /obj/quest/armor_suipian11;items get_store /obj/quest/dagger_suipian11;items get_store /obj/quest/surcoat_suipian11;items get_store /obj/quest/hat_suipian12;items get_store /obj/quest/waist_suipian12;items get_store /obj/quest/shield_suipian12;items get_store /obj/quest/blade_suipian12;items get_store /obj/quest/sword_suipian12;items get_store /obj/quest/unarmed_suipian12;items get_store /obj/quest/throwing_suipian12;items get_store /obj/quest/staff_suipian12;items get_store /obj/quest/stick_suipian12;items get_store /obj/quest/whip_suipian12;items get_store /obj/quest/axe_suipian12;items get_store /obj/quest/necklace_suipian12;items get_store /obj/quest/hammer_suipian12;items get_store /obj/quest/spear_suipian12;items get_store /obj/quest/wrists_suipian12;items get_store /obj/quest/finger_suipian12;items get_store /obj/quest/boots_suipian12;items get_store /obj/quest/cloth_suipian12;items get_store /obj/quest/armor_suipian12;items get_store /obj/quest/dagger_suipian12;items get_store /obj/quest/surcoat_suipian12;");
    //找华山村铁匠
    go2("jh 3;s;e;n");
    //兑换11级装备
    go2("duihuan_mieshen_go gift1;duihuan_mieshen_go gift10;duihuan_mieshen_go gift2;duihuan_mieshen_go gift3;duihuan_mieshen_go gift4;duihuan_mieshen_go gift5;duihuan_mieshen_go gift7;");
    //摹刻11级装备
    go2("moke equip_armor11;moke equip_boots11;moke equip_finger11;moke equip_wrists11;moke equip_neck11;moke equip_waist11;moke equip_head11");
    //兑换12级装备
    go2("duihuan_eq12_go gift1;duihuan_eq12_go gift10;duihuan_eq12_go gift2;duihuan_eq12_go gift3;duihuan_eq12_go gift4;duihuan_eq12_go gift5;duihuan_eq12_go gift7;");
    //摹刻12级装备
    go2("moke equip_armor12;moke equip_boots12;moke equip_finger12;moke equip_wrists12;moke equip_neck12;moke equip_waist12;moke equip_head12;");
    //穿上底材
    go2("wear equip_moke_head12;wear equip_moke_waist12;wear equip_moke_neck12;wear equip_moke_wrists12;wear equip_moke_finger12;wear equip_moke_boots12;wear equip_moke_armor12;");
    //老祭祀冰月1-1
    go2("jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_waist12;by_upgrade 1 equip_moke_wrists12;by_upgrade 1 equip_moke_neck12;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12");
    //穿上冰月1-1装备
    go2("wear equip_by_neck12;wear equip_by_wrists12;wear equip_by_waist12");
    //方糅冰月2-1
    go2("jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_waist12;#100 by_upgrade 2 equip_by_wrists12;#100 by_upgrade 2 equip_by_neck12;");
    //妖僧冰月3-1
    go2("jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_waist12;#100 by_upgrade 3 equip_by_wrists12;#100 by_upgrade 3 equip_by_neck12;");
    //老祭祀1-2
    go2("jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se;by_upgrade 1 equip_moke_head12;by_upgrade 1 equip_moke_armor12;by_upgrade 1 equip_moke_finger12;by_upgrade 1 equip_moke_boots12;");
    //穿上冰月1-2装备
    go2("wear equip_by_boots12;wear equip_by_finger12;wear equip_by_armor12;wear equip_by_head12;");
    //方糅冰月2-2
    go2("jh 14;w;n;n;n;n;#100 by_upgrade 2 equip_by_head12;#100 by_upgrade 2 equip_by_armor12;#100 by_upgrade 2 equip_by_finger12;#100 by_upgrade 2 equip_by_boots12");
    //妖僧冰月3-2
    go2("jh 26;w;w;w;w;w;n;#100 by_upgrade 3 equip_by_head12;#100 by_upgrade 3 equip_by_armor12;#100 by_upgrade 3 equip_by_finger12;#100 by_upgrade 3 equip_by_boots12");
    //脱下材料
    go2("remove equip_by_boots12;remove equip_by_finger12;remove equip_by_armor12;remove equip_by_head12;remove equip_by_neck12;remove equip_by_waist12;remove equip_by_wrists12;");

}
function lv13amormake(){
    let n= prompt("请输入兑换的装备类别{1：剑神套，2：垂钓者，3：隐居贤者}","1");
    if(!n) return;
    n=Number(n);
    //取出材料（一级宝石、玉石，绝世隐侠碎片，狗年礼券，金锭、银锭，玄铁碎片）
    //长安李靖
    go2("jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;");
    switch(n){
        case 1:
            //兑换剑神装备
            go2("items upgrade_13shoushi go 0;items upgrade_13shoushi go 1;items upgrade_13shoushi go 2;items upgrade_13shoushi go 3;items upgrade_13shoushi go 4;items upgrade_13shoushi go 5;items upgrade_13shoushi go 6;");
            //装备上宝石
            go2("");
            //装上装备
            go2("wear obj_jianyironghen;wear obj_wuyinglou-jiezhi;wear obj_jianxinbumie;wear obj_jiandaozhangcun;wear obj_wuyinglou-xianglian;wear obj_wuwozhijian;wear obj_wuyinglou-shouzhuo;");
            break;
        case 2:
            //兑换垂钓者装备
            go2("items upgrade_13shoushi go 7;items upgrade_13shoushi go 8;items upgrade_13shoushi go 9;items upgrade_13shoushi go 10;items upgrade_13shoushi go 11;items upgrade_13shoushi go 12;items upgrade_13shoushi go 13;");
            //装备上宝石
            go2("");
            //装上装备
            go2("");
            break;
        case 3:
            //兑换隐居贤者装备
            go2("items upgrade_13shoushi go 14;items upgrade_13shoushi go 15;items upgrade_13shoushi go 16;items upgrade_13shoushi go 17;items upgrade_13shoushi go 18;items upgrade_13shoushi go 19;items upgrade_13shoushi go 20;");
            //装备上宝石
            go2("#4 imbed obj_zhongzuiduxing wear hongbaoshi8;#2 imbed obj_zhongzuiduxing wear lanbaoshi8;#1 imbed obj_zhongzuiduxing wear lvbaoshi8;#4 imbed obj_qingtianwanshi wear lanbaoshi8;#3 imbed obj_qingtianwanshi wear lvbaoshi8;#4 imbed obj_lankeyimeng wear huangbaoshi8;#2 imbed obj_lankeyimeng wear lanbaoshi8;#1 imbed obj_lankeyimeng wear lvbaoshi8;#4 imbed obj_shanyecunfu wear lanbaoshi8;#3 imbed obj_shanyecunfu wear lvbaoshi8;#4 imbed obj_xianzhe-xianglian wear lanbaoshi8;#3 imbed obj_xianzhe-xianglian wear lvbaoshi8;#4 imbed obj_xianzhe-shouzhuo wear hongbaoshi8;#2 imbed obj_xianzhe-shouzhuo wear lanbaoshi8;#1 imbed obj_xianzhe-shouzhuo wear lvbaoshi8;#5 imbed obj_xianzhe-jiezhi wear hongbaoshi8;#1 imbed obj_xianzhe-jiezhi wear lvbaoshi8;#1 imbed obj_xianzhe-jiezhi wear lanbaoshi8;");
            //装上装备
            go2("wear obj_zhongzuiduxing;wear obj_qingtianwanshi;wear obj_lankeyimeng;wear obj_shanyecunfu;wear obj_xianzhe-xianglian;wear obj_xianzhe-shouzhuo;wear obj_xianzhe-jiezhi;");
            break;
        default:
            alert("输入参数错误，请重新输入");
    }
}

var QiangZuo = null;
function GWqiangzuo(){
    let n= prompt("请输入观舞类别{1：白银，2：青木，3：源质}","3");
    n=Number(n);
    switch(n){
        case 1:
            QiangZuo= setInterval(function(b){
                go2("event_1_5392021 go");
            },100)
            break;
        case 2:
            QiangZuo= setInterval(function(b){
                go2("event_1_48561012 go");
            },100)
            break;
        case 3:
            QiangZuo= setInterval(function(b){
                go2("event_1_29896809 go");
            },100)
            break;
        default:
            alert("输入参数错误，请重新输入");
    }
}
//杭界山
var gohjs;
function goHJS(){
    go2("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;");
    setTimeout(hjs(),2000);
}
function hjs(){
    gohjs=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        if (curName == "青苔石阶" && roomInfo.get("northwest") == "青苔石阶") clickButton("nw");
        else if (curName == "青苔石阶" && roomInfo.get("northeast") == "青苔石阶") clickButton("ne");
        else if (curName == "青苔石阶" && roomInfo.get("southwest") == "青苔石阶") clickButton("sw");
        else if (curName == "榆叶林" && roomInfo.get("north") == "榆叶林") clickButton("n");
        else if (curName == "榆叶林" && roomInfo.get("south") == "榆叶林") clickButton("s");
        else if (curName == "世外桃源" )
        {clearInterval(gohjs);
         cmdCache = [];
         cmdCache2 = [];
        }
    },1000);
}
//哈日
var goHR2s;
function goHR(){
    go2("rank go 312;s;s;sw;se;se;se;e;se;se;ne;");
    setTimeout(hari(),2000);
}
function hari(){
    goHR2s=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        if (curName == "沙漠迷宫") {
            if (roomInfo.get("east") == "沙漠迷宫") go("e");
            else if (roomInfo.get("north") == "沙漠迷宫") go("n");
            else if (roomInfo.get("west") == "沙漠迷宫") go("w");
            else if (roomInfo.get("south") == "沙漠迷宫") go("s");
        }
        else if (curName == "荒漠") {
            clearInterval(goHR2s);
            go2("n;n;nw;n;ne;");
            Infor_OutFunc("<span style='color:#FFF;'>--到达--</span>");
        }
        else {
            clearInterval(goHR2s);
            goHR();
            //go2("rank go 312;s;s;sw;se;se;se;e;se;se;ne;()=>{hari();}");
        }
    },1000);
}
//辛夷林
var XYL;
function autoXYL(){
    XYL=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        var peopleList = $(".cmd_click3");
        var thisonclick = null,thatonclick = null;
        thisonclick = peopleList[0].getAttribute('onclick');
        thatonclick = peopleList[1].getAttribute('onclick');
        if(curName == "辛夷林" && thisonclick=="clickButton('look_npc yaowanggu_guaishu', 0)"){
            clickButton("event_1_79224473");
        }
        else if(curName == "林中小路" && thisonclick=="clickButton('event_1_4618810', 0)"){
            clickButton("event_1_4618810");
        }
        else if(thisonclick=="clickButton('event_1_59581969', 0)"&& thatonclick=="clickButton('event_1_91521992', 0)"){
            clickButton("event_1_91521992");
        }
        else{
            clearInterval(XYL);
            go2("ne;n;e;se;n;n;ask yaowanggu_laoyaowang;");
        }
    },1000)
}
//***********************************************************//
//***********************************************************//
//*******************门派拜师********************************//
//***********************************************************//
//***********************************************************//
//拜师前置任务
function yirong(){
    go2("jh 5;#7 n;e;get_silver;ask yangzhou_yangzhou22;w;#6 s;w;w;n;ask yangzhou_yangzhou15;ask yangzhou_yangzhou15;prev;s;e;e;#4 n;w;w;s;s;ask yangzhou_yangzhou14;ask yangzhou_yangzhou14;prev;n;n;e;e;#4 n;e;kill yangzhou_yangzhou24;w;#4 s;w;w;s;s;give yangzhou_yangzhou14;n;n;#2 e;n;n;e;get_silver;");
}
function studyYiRong(){
    go2("jh 5;n;n;n;n;n;n;n;e;get_silver;#200 event_1_32217584;#200 event_1_94400675");
}
function YRboy(){
    go2("jh 1;yirong snow_mercenary;");
}
function YRgirl(){
    go2("jh 1;w;w;w;n;yirong snow_miaoruolan;");
}
function nielian(){
    go2("jh 7;s;#500 event_1_89798265;");
}
function fojialu(){
    go2("jh 13;e;s;s;w;w;w;ask shaolin_du-jie;ask shaolin_du-jie;kill shaolin_du-jie;");
}
//正派
function GaiBang(){
    go2("home apprentice 丐帮;public_op1;#20 learn huntian-qigong from gaibang_he-bj to 10;#20 learn liuhe-dao from gaibang_he-bj to 10;#20 learn lianhua-zhang from gaibang_he-bj to 10;#20 learn xiaoyaoyou from gaibang_he-bj to 10;#20 learn stealing from gaibang_he-bj to 10;#20 learn begging from gaibang_he-bj to 10;apprentice gaibang_kongkong;#20 learn huntian-qigong from gaibang_kongkong to 10;#20 learn liuhe-dao from gaibang_kongkong to 10;#20 learn lianhua-zhang from gaibang_kongkong to 10;#20 learn checking from gaibang_kongkong to 10;#20 learn xiaoyaoyou from gaibang_kongkong to 10;#20 learn xianglong-zhang from gaibang_kongkong to 10;#20 learn stealing from gaibang_kongkong to 10;#20 learn begging from gaibang_kongkong to 10;apprentice gaibang_li-sh;public_op1;#30 learn dagou-bang from gaibang_li-sh to 10;#30 learn huntian-qigong from gaibang_li-sh to 10;#30 learn liuhe-dao from gaibang_li-sh to 10;#30 learn lianhua-zhang from gaibang_li-sh to 10;#30 learn xiaoyaoyou from gaibang_li-sh to 10;#30 learn xianglong-zhang from gaibang_li-sh to 10;#30 learn begging from gaibang_li-sh to 10;apprentice gaibang_lu;public_op1;#30 learn huntian-qigong from gaibang_lu to 10;#30 learn dagou-bang from gaibang_lu to 10;#30 learn liuhe-dao from gaibang_lu to 10;#30 learn lianhua-zhang from gaibang_lu to 10;#30 learn xiaoyaoyou from gaibang_lu to 10;#30 learn xianglong-zhang from gaibang_lu to 10;#30 learn begging from gaibang_lu to 10;jh 2;n;n;n;n;n;e;n;op1;apprentice gaibang_hong;skills gaibang_hong;#30 learn huntian-qigong from gaibang_hong to 10;#30 learn dagou-bang from gaibang_hong to 10;#30 learn lianhua-zhang from gaibang_hong to 10;#30 learn checking from gaibang_hong to 10;#30 learn xiaoyaoyou from gaibang_hong to 10;#30 learn xianglong-zhang from gaibang_hong to 10;#30 learn begging from gaibang_hong to 10;chushi gaibang_hong;fight gaibang_hong;chushi gaibang_hong;");
}
function biluocheng(){
    alert("点杭界山慢慢搞！！！！！！！！！！");
}
function huashan(){
    go2("home apprentice 华山派;public_op1;#8 learn huashan-neigong from huashan_yueling to 10;#12 learn huashan-shenfa from huashan_yueling to 10;#9 learn huashan-jianfa from huashan_yueling to 10;#10 learn hunyuan-zhang from huashan_yueling to 10;apprentice huashan_liangfa;public_op1;#20 learn huashan-neigong from huashan_liangfa to 10;#20 learn huashan-shenfa from huashan_liangfa to 10;#20 learn huashan-jianfa from huashan_liangfa to 10;#20 learn hunyuan-zhang from huashan_liangfa to 10;#20 learn poyu-quan from huashan_liangfa to 10;apprentice huashan_yue;public_op1;#10 learn huashan-shenfa from huashan_yue to 10;#10 learn huashan-jianfa from huashan_yue to 10;#10 learn hunyuan-zhang from huashan_yue to 10;#36 learn zixia-shengong from huashan_yue to 10;#30 learn junzi-sword from huashan_yue to 10;#10 learn poyu-quan from huashan_yue to 10;#20 learn purple from huashan_yue to 10;apprentice huashan_fengbuping;public_op1;#20 learn huashan-neigong from huashan_fengbuping to 10;#10 learn huashan-shenfa from huashan_fengbuping to 10;#10 learn huashan-jianfa from huashan_fengbuping to 10;#10 learn hunyuan-zhang from huashan_fengbuping to 10;#40 learn kuang-jian from huashan_fengbuping to 10;enable huashan-jianfa;practice huashan-jianfa;");
    alert("开始学习华山剑法，这是真剑啊");
}
function shaolin(){
    go2("home apprentice 少林派;public_op1;#6 learn hunyuan-yiqi from shaolin_qing-wei to 10;#6 learn banruo-zhang from shaolin_qing-wei to 10;#7 learn zui-gun from shaolin_qing-wei to 10;#7 learn damo-jian from shaolin_qing-wei to 10;#6 learn shaolin-shenfa from shaolin_qing-wei to 10;apprentice shaolin_dao-chen;public_op1;#10 learn hunyuan-yiqi from shaolin_dao-chen to 10;#10 learn banruo-zhang from shaolin_dao-chen to 10;#10 learn zui-gun from shaolin_dao-chen to 10;#10 learn damo-jian from shaolin_dao-chen to 10;#10 learn shaolin-shenfa from shaolin_dao-chen to 10;apprentice shaolin_hui-ming;public_op1;#15 learn hunyuan-yiqi from shaolin_hui-ming to 10;#15 learn yingzhua-gong from shaolin_hui-ming to 10;#15 learn banruo-zhang from shaolin_hui-ming to 10;#15 learn zui-gun from shaolin_hui-ming to 10;#15 learn damo-jian from shaolin_hui-ming to 10;#15 learn shaolin-shenfa from shaolin_hui-ming to 10;apprentice shaolin_cheng-ming;public_op1;#20 learn hunyuan-yiqi from shaolin_cheng-ming to 10;#20 learn yingzhua-gong from shaolin_cheng-ming to 10;#20 learn banruo-zhang from shaolin_cheng-ming to 10;#20 learn zui-gun from shaolin_cheng-ming to 10;#20 learn damo-jian from shaolin_cheng-ming to 10;#20 learn shaolin-shenfa from shaolin_cheng-ming to 10;apprentice shaolin_xuan-bei;public_op1;#30 learn hunyuan-yiqi from shaolin_xuan-bei to 10;#30 learn cibei-dao from shaolin_xuan-bei to 10;#30 learn banruo-zhang from shaolin_xuan-bei to 10;#30 learn damo-jian from shaolin_xuan-bei to 10;#30 learn qianye-shou from shaolin_xuan-bei to 10;#30 learn longzhua-gong from shaolin_xuan-bei to 10;#30 learn shaolin-shenfa from shaolin_xuan-bei to 10;apprentice shaolin_du-jie;public_op1;#40 learn hunyuan-yiqi from shaolin_du-jie to 10;#40 learn yizhi-chan from shaolin_du-jie to 10;#40 learn banruo-zhang from shaolin_du-jie to 10;#40 learn riyue-bian from shaolin_du-jie to 10;#40 learn yijinjing from shaolin_du-jie to 10;#40 learn shaolin-shenfa from shaolin_du-jie to 10;jh 13;#11 n;apprentice shaolin_hui-xu;skills shaolin_hui-xu;#20 learn fengyun-shou from shaolin_hui-xu to 10;n;apprentice shaolin_hui-xiu;skills shaolin_hui-xiu;#20 learn pudu-zhang from shaolin_hui-xiu to 10;#20 learn jingang-quan from shaolin_hui-xiu to 10;#3 ask shaolin_shaolin15;w;n;get_silver;apprentice shaolin_dmlzh;skills shaolin_dmlzh;#50 learn jingang-quan from shaolin_dmlzh to 10;#50 learn wuxiang-jingang-quan from shaolin_dmlzh to 10;#50 learn zui-gun from shaolin_dmlzh to 10;#50 learn riyue-bian from shaolin_dmlzh to 10;#50 learn damo-jian from shaolin_dmlzh to 10;#50 learn wuchang-zhang from shaolin_dmlzh to 10;#50 learn nianhua-zhi from shaolin_dmlzh to 10;#50 learn hunyuan-yiqi from shaolin_dmlzh to 10;#50 learn qianye-shou from shaolin_dmlzh to 10;#50 learn yijinjing from shaolin_dmlzh to 10;#50 learn sanhua-zhang from shaolin_dmlzh to 10;#50 learn longzhua-gong from shaolin_dmlzh to 10;#50 learn shaolin-shenfa from shaolin_dmlzh to 10;chushi shaolin_dmlzh;fight shaolin_dmlzh;chushi shaolin_dmlzh;");
}
function dali(){
    go2("home apprentice 大理段家;public_op1;#11 learn kurong-changong from dali_zhudanchen to 10;#14 learn tiannan-step from dali_zhudanchen to 10;#14 learn jinyu-quan from dali_zhudanchen to 10;#15 learn duanjia-sword from dali_zhudanchen to 10;apprentice dali_gaoshengtai;public_op1;#20 learn kurong-changong from dali_gaoshengtai to 10;#20 learn tiannan-step from dali_gaoshengtai to 10;#20 learn wuluo-zhang from dali_gaoshengtai to 10;#20 learn jinyu-quan from dali_gaoshengtai to 10;#20 learn duanjia-sword from dali_gaoshengtai to 10;apprentice dali_duanzc;public_op1;#10 learn kurong-changong from dali_duanzc to 10;#16 learn tiannan-step from dali_duanzc to 10;#36 learn sun-finger from dali_duanzc to 10;#16 learn wuluo-zhang from dali_duanzc to 10;#12 learn jinyu-quan from dali_duanzc to 10;#32 learn duanyun-fu from dali_duanzc to 10;#12 learn duanjia-sword from dali_duanzc to 10;apprentice dali_kurong;public_op1;#10 learn kurong-changong from dali_kurong to 10;#10 learn tiannan-step from dali_kurong to 10;#10 learn duanjia-sword from dali_kurong to 10;jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;apprentice dali_yideng;skills dali_yideng;#10 learn kurong-changong from dali_yideng to 10;#20 learn tiannan-step from dali_yideng to 10;#20 learn jinyu-quan from dali_yideng to 10;#20 learn duanyun-fu from dali_yideng to 10;#20 learn duanjia-sword from dali_yideng to 10;#20 learn sun-finger from dali_yideng to 10;#50 learn liumai-shenjian from dali_yideng to 10;#20 learn wuluo-zhang from dali_yideng to 10;#20 learn buddhism from dali_yideng to 10;chushi dali_yideng;fight dali_yideng;chushi dali_yideng;");
}
function wudang(){
    go2("home;home apprentice 武当派;public_op1;#8 learn taiji-shengong from wudang_zhike to 10;#10 learn taiji-jian from wudang_zhike to 10;#10 learn tiyunzong from wudang_zhike to 10;#4 learn taoism from wudang_zhike to 10;apprentice wudang_guxu;public_op1;#12 learn taiji-shengong from wudang_guxu to 10;#10 learn taiji-jian from wudang_guxu to 10;#10 learn tiyunzong from wudang_guxu to 10;#20 learn taiji-quan from wudang_guxu to 10;#20 learn taoism from wudang_guxu to 10;apprentice wudang_song;public_op1;#20 learn taiji-shengong from wudang_song to 10;#20 learn taiji-jian from wudang_song to 10;#20 learn tiyunzong from wudang_song to 10;#20 learn taiji-quan from wudang_song to 10;#40 learn taiji-dao from wudang_song to 10;jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n;apprentice wudang_zhang;skills wudang_zhang;#20 learn taiji-shengong from wudang_zhang to 10;#20 learn taiji-jian from wudang_zhang to 10;#20 learn tiyunzong from wudang_zhang to 10;#50 learn zhenwu-jian from wudang_zhang to 10;#20 learn taiji-quan from wudang_zhang to 10;#20 learn taiji-dao from wudang_zhang to 10;#20 learn taoism from wudang_zhang to 10;chushi wudang_zhang;fight wudang_zhang;chushi wudang_zhang;");
}
function daqimen(){
    go2("home apprentice 铁血大旗门;public_op1;#20 learn dormancy from tieflag_master2 to 10;#20 learn jiayiforce from tieflag_master2 to 10;#20 learn ill-quan from tieflag_master2 to 10;#20 learn tie-steps from tieflag_master2 to 10;#20 learn fy-sword from tieflag_master2 to 10;jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;apprentice tieflag_master;skills tieflag_master;#20 learn dormancy from tieflag_master to 10;#20 learn jiayiforce from tieflag_master to 10;#20 learn ill-quan from tieflag_master to 10;#20 learn tie-steps from tieflag_master to 10;#20 learn fy-sword from tieflag_master to 10;jh 5;n;n;n;n;n;n;n;e;apprentice tieflag_yunjiuxiao;#10 learn dormancy from tieflag_yunjiuxiao to 10;#10 learn ill-quan from tieflag_yunjiuxiao to 10;#40 learn yunhai-force from tieflag_yunjiuxiao to 10;#10 learn tie-steps from tieflag_yunjiuxiao to 10;#10 learn jiayiforce from tieflag_yunjiuxiao to 10;#10 learn fy-sword from tieflag_yunjiuxiao to 10;jh 17;n;n;w;n;n;apprentice tieflag_tieyi;skills tieflag_tieyi;#15 learn dormancy from tieflag_tieyi to 10;#10 learn ill-quan from tieflag_tieyi to 10;#10 learn yunhai-force from tieflag_tieyi to 10;#10 learn tie-steps from tieflag_tieyi to 10;#10 learn jiayiforce from tieflag_tieyi to 10;#10 learn fy-sword from tieflag_tieyi to 10;jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;apprentice tieflag_yedi;skills tieflag_yedi;#50 learn king-sword from tieflag_yedi to 10;chushi tieflag_yedi;fight tieflag_yedi;chushi tieflag_yedi;");
}
function mingjiao(){
    go2("home apprentice 明教;public_op1;#10 learn jiuyang-shengong from mingjiao_yanyuan to 10;#10 learn xiaoyao-zhang from mingjiao_yanyuan to 10;#10 learn xiaoyao-jian from mingjiao_yanyuan to 10;#10 learn xiaoyao-bu from mingjiao_yanyuan to 10;apprentice mingjiao_lengqianpublic_op1;#20 learn jiuyang-shengong from mingjiao_lengqian to 10;#20 learn xiaoyao-zhang from mingjiao_lengqian to 10;#20 learn xiaoyao-jian from mingjiao_lengqian to 10;#20 learn xiaoyao-bu from mingjiao_lengqian to 10;apprentice mingjiao_weiyixiao;public_op1;#30 learn jiuyang-shengong from mingjiao_weiyixiao to 10;#30 learn xiaoyao-zhang from mingjiao_weiyixiao to 10;#30 learn shenghuo-shengong from mingjiao_weiyixiao to 10;#30 learn xiaoyao-jian from mingjiao_weiyixiao to 10;#30 learn fuwang-shenfa from mingjiao_weiyixiao to 10;apprentice mingjiao_yangxiao;public_op1;#40 learn shenghuo-shengong from mingjiao_yangxiao to 10;#40 learn jiuyang-shengong from mingjiao_yangxiao to 10;#40 learn xiaoyao-zhang from mingjiao_yangxiao to 10;#40 learn xiaoyao-jian from mingjiao_yangxiao to 10;#40 learn xiaoyao-bu from mingjiao_yangxiao to 10;#40 learn qiankun-danuoyi from mingjiao_yangxiao to 10;jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;apprentice mingjiao_longwang;skills mingjiao_longwang;#40 learn lieyan-kuangdao from mingjiao_longwang to 10;e;apprentice mingjiao_yingwang;skills mingjiao_yingwang;#40 learn yingzhao-qinnashou from mingjiao_yingwang to 10;e;apprentice mingjiao_shiwang;skills mingjiao_shiwang;#50 learn tulong-blade from mingjiao_shiwang to 10;w;n;apprentice mingjiao_zhang;skills mingjiao_zhang;#50 learn shenghuo-shengong from mingjiao_zhang to 10;#50 learn qiankun-danuoyi from mingjiao_zhang to 10;#50 learn jiuyang-shengong from mingjiao_zhang to 10;#50 learn iron-cloth from mingjiao_zhang to 10;#50 learn xiaoyao-zhang from mingjiao_zhang to 10;#50 learn xiaoyao-bu from mingjiao_zhang to 10;#50 learn jiuyang-zhisheng from mingjiao_zhang to 10;#50 learn qishang-quan from mingjiao_zhang to 10;chushi mingjiao_zhang;fight mingjiao_zhang;chushi mingjiao_zhang;");
}
function quanzhen(){
    go2("home apprentice 全真派;public_op1;#12 learn taoism from quanzhen_yin to 10;#12 learn xiantian-gong from quanzhen_yin to 10;#12 learn yangxin-quan from quanzhen_yin to 10;#12 learn quanzhen-jian from quanzhen_yin to 10;#12 learn fx-step from quanzhen_yin to 10;apprentice quanzhen_qiu;public_op1;#30 learn taoism from quanzhen_qiu to 10;#30 learn xiantian-gong from quanzhen_qiu to 10;#30 learn tonggui-jian from quanzhen_qiu to 10;#30 learn tiangang-beidou from quanzhen_qiu to 10;#30 learn yangxin-quan from quanzhen_qiu to 10;#30 learn quanzhen-jian from quanzhen_qiu to 10;#30 learn kongming-quan from quanzhen_qiu to 10;#30 learn fx-step from quanzhen_qiu to 10;jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;s;apprentice quanzhen_wang;skills quanzhen_wang;#40 learn tonggui-jian from quanzhen_wang to 10;#40 learn xiantian-gong from quanzhen_wang to 10;#40 learn yangxin-quan from quanzhen_wang to 10;#40 learn yiyang-zhi from quanzhen_wang to 10;#40 learn quanzhen-jian from quanzhen_wang to 10;#40 learn kongming-quan from quanzhen_wang to 10;#40 learn fx-step from quanzhen_wang to 10;#40 learn taoism from quanzhen_wang to 10;n;w;w;#4 n;e;s;apprentice quanzhen_wantong;skills quanzhen_wantong;#10 learn xiantian-gong from quanzhen_wantong to 10;#50 learn zuoyou-hubo from quanzhen_wantong to 10;#10 learn kongming-quan from quanzhen_wantong to 10;#10 learn fx-step from quanzhen_wantong to 10;#10 learn taoism from quanzhen_wantong to 10;chushi quanzhen_wantong;fight quanzhen_wantong;chushi quanzhen_wantong;");
}
function emei(){
    go2("jh 1;#3 w;n;yirong snow_miaoruolan;home apprentice 峨嵋派;public_op1;#14 learn linji-zhuang from emei_wenxu to 10;#14 learn buddhism from emei_wenxu to 10;#14 learn zhutian from emei_wenxu to 10;#14 learn fuliu-jian from emei_wenxu to 10;#14 learn jinding-mianzhang from emei_wenxu to 10;#14 learn fuliu-jian from emei_wenxu to 10;apprentice emei_jingxuan;public_op1;#20 learn buddhism from emei_jingxuan to 10;#20 learn linji-zhuang from emei_jingxuan to 10;#20 learn zhutian from emei_jingxuan to 10;#20 learn jinding-mianzhang from emei_jingxuan to 10;#20 learn tiangang-zhi from emei_jingxuan to 10;#20 learn fuliu-jian from emei_jingxuan to 10;apprentice emei_bjyi;public_op1;#30 learn buddhism from emei_bjyi to 10;#30 learn linji-zhuang from emei_bjyi to 10;#30 learn jinding-mianzhang from emei_bjyi to 10;#30 learn yanxing-dao from emei_bjyi to 10;#30 learn tiangang-zhi from emei_bjyi to 10;#30 learn zhutian from emei_bjyi to 10;jh 8;w;nw;n;n;n;n;e;e;n;n;e;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n;apprentice houshan_miejue;skills houshan_miejue;#50 learn yitian-sword from houshan_miejue to 10;#20 learn zhutian from houshan_miejue to 10;#20 learn tiangang-zhi from houshan_miejue to 10;#20 learn fuliu-jian from houshan_miejue to 10;#20 learn jinding-mianzhang from houshan_miejue to 10;#20 learn linji-zhuang from houshan_miejue to 10;chushi houshan_miejue;fight houshan_miejue;chushi houshan_miejue;");
}
function buxuan(){
    go2("jh 7;#8 s;e;n;e;s;e;apprentice scholar_master;skills scholar_master;#55 learn literate from scholar_master to 10;#36 learn force from scholar_master to 10;#36 learn sword from scholar_master to 10;#40 learn dodge from scholar_master to 10;#20 learn move from scholar_master to 10;#32 learn parry from scholar_master to 10;#50 learn perception from scholar_master to 10;#16 learn unarmed from scholar_master to 10;#40 learn mysterrier from scholar_master to 10;#40 learn mystforce from scholar_master to 10;#40 learn mystsword from scholar_master to 10;#50 learn music from scholar_master to 10;chushi scholar_master;fight scholar_master;chushi scholar_master;");
}
//中立
function rongweibiaojv(){
    alert("点杭界山慢慢搞！！！！！！！！！！");
}
function xiaoyao(){
    go2("home apprentice 逍遥派;public_op1;#8 learn beiming-shengong from xiaoyao_shiqinglu to 10;#10 learn ruyi-dao from xiaoyao_shiqinglu to 10;#10 learn liuyang-zhang from xiaoyao_shiqinglu to 10;#8 learn lingboweibu from xiaoyao_shiqinglu to 10;apprentice xiaoyao_kangguangling;public_op1;#20 learn beiming-shengong from xiaoyao_kangguangling to 10;#20 learn ruyi-dao from xiaoyao_kangguangling to 10;#20 learn liuyang-zhang from xiaoyao_kangguangling to 10;#20 learn lingboweibu from xiaoyao_kangguangling to 10;apprentice xiaoyao_suxinghe;public_op1;#30 learn beiming-shengong from xiaoyao_suxinghe to 10;#30 learn ruyi-dao from xiaoyao_suxinghe to 10;#30 learn liuyang-zhang from xiaoyao_suxinghe to 10;#30 learn lingboweibu from xiaoyao_suxinghe to 10;#30 learn zhemei-shou from xiaoyao_suxinghe to 10;apprentice xiaoyao_xiaoyaozi;public_op1;#50 learn ruyi-dao from xiaoyao_xiaoyaozi to 10;#50 learn liuyang-zhang from xiaoyao_xiaoyaozi to 10;#50 learn bahuang-gong from xiaoyao_xiaoyaozi to 10;#50 learn beiming-shengong from xiaoyao_xiaoyaozi to 10;#50 learn lingboweibu from xiaoyao_xiaoyaozi to 10;#50 learn zhemei-shou from xiaoyao_xiaoyaozi to 10;jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;apprentice xiaoyao_tonglao;skills xiaoyao_tonglao;#50 learn yueying-wubu from xiaoyao_tonglao to 10;#50 learn tianyu-qijian from xiaoyao_tonglao to 10;chushi xiaoyao_tonglao;fight xiaoyao_tonglao;chushi xiaoyao_tonglao;");
}
function murong(){
    go2("home apprentice 慕容世家;public_op1;#10 learn murong-xinfa from murong_azhu to 10;#10 learn sevenstar-sword from murong_azhu to 10;#10 learn lingxubu from murong_azhu to 10;#10 learn qiqin-zhang from murong_azhu to 10;apprentice murong_baobutong;public_op1;#20 learn murong-xinfa from murong_baobutong to 10;#20 learn douzhuan-xingyi from murong_baobutong to 10;#20 learn sevenstar-sword from murong_baobutong to 10;#20 learn lingxubu from murong_baobutong to 10;#20 learn qiqin-zhang from murong_baobutong to 10;apprentice murong_murongfu;public_op1;#20 learn murong-xinfa from murong_murongfu to 10;#20 learn sevenstar-sword from murong_murongfu to 10;#20 learn douzhuan-xingyi from murong_murongfu to 10;#20 learn lingxubu from murong_murongfu to 10;#20 learn qiqin-zhang from murong_murongfu to 10;jh 32;n;n;se;n;n;n;n;w;w;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w;apprentice murong_murongbo;skills murong_murongbo;#20 learn murong-xinfa from murong_murongbo to 10;#20 learn sevenstar-sword from murong_murongbo to 10;#20 learn douzhuan-xingyi from murong_murongbo to 10;#20 learn lingxubu from murong_murongbo to 10;#20 learn qiqin-zhang from murong_murongbo to 10;#50 learn sevenstar-sword-plus from murong_murongbo to 10;chushi murong_murongbo;fight murong_murongbo;chushi murong_murongbo;");
}
function gumu(){
    go2("home apprentice 古墓派;public_op1;#16 learn yunv-xinfa from gumu_limochou to 10;#16 learn qiufeng-chenfa from gumu_limochou to 10;#16 learn meinv-quan from gumu_limochou to 10;apprentice gumu_sun;public_op1;#24 learn yunv-xinfa from gumu_sun to 10;#24 learn yunv-jian from gumu_sun to 10;#24 learn meinv-quan from gumu_sun to 10;#24 learn yunv-shenfa from gumu_sun to 10;apprentice gumu_longnv;public_op1;#20 learn yunv-xinfa from gumu_longnv to 10;#20 learn yunv-jian from gumu_longnv to 10;#20 learn meinv-quan from gumu_longnv to 10;#20 learn yunv-shenfa from gumu_longnv to 10;apprentice gumu_lin;public_op1;#10 learn yunv-xinfa from gumu_lin to 10;#10 learn yunv-jian from gumu_lin to 10;#10 learn meinv-quan from gumu_lin to 10;#40 learn qiufeng-chenfa from gumu_lin to 10;#10 learn yunv-shenfa from gumu_lin to 10;jh 30;n;n;ne;apprentice gumu_yangguo;skills gumu_yangguo;#10 learn yunv-xinfa from gumu_yangguo to 10;#10 learn yunv-jian from gumu_yangguo to 10;#50 learn anran-zhang from gumu_yangguo to 10;#50 learn iron-sword from gumu_yangguo to 10;#10 learn meinv-quan from gumu_yangguo to 10;#10 learn yunv-shenfa from gumu_yangguo to 10;chushi gumu_yangguo;fight gumu_yangguo;chushi gumu_yangguo;");
}
function taohua(){
    go2("home apprentice 桃花岛;public_op1;#10 learn taohua-force from taohua_shagu to 10;#10 learn yuxiao-jian from taohua_shagu to 10;#10 learn qimen-bagua from taohua_shagu to 10;#10 learn baguabu from taohua_shagu to 10;apprentice taohua_lushengf;public_op1;#20 learn taohua-force from taohua_lushengf to 10;#20 learn yuxiao-jian from taohua_lushengf to 10;#20 learn qimen-bagua from taohua_lushengf to 10;#20 learn luoying-zhang from taohua_lushengf to 10;#20 learn baguabu from taohua_lushengf to 10;#20 learn lanhua-shou from taohua_lushengf to 10;apprentice taohua_rong;public_op1;#20 learn taohua-force from taohua_rong to 10;#20 learn yuxiao-jian from taohua_rong to 10;#20 learn luoying-zhang from taohua_rong to 10;#20 learn baguabu from taohua_rong to 10;#20 learn qimen-bagua from taohua_rong to 10;#20 learn lanhua-shou from taohua_rong to 10;jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n;apprentice taohua_huang;skills taohua_huang;#20 learn taohua-force from taohua_huang to 10;#20 learn yuxiao-jian from taohua_huang to 10;#20 learn qimen-bagua from taohua_huang to 10;#50 learn bihai-sword from taohua_huang to 10;#20 learn luoying-zhang from taohua_huang to 10;#20 learn baguabu from taohua_huang to 10;#20 learn lanhua-shou from taohua_huang to 10;chushi taohua_huang;fight taohua_huang;chushi taohua_huang;");
}
function maoshan(){
    //林忌之前
    go2("home apprentice 茅山派;public_op1;#12 learn gouyee from taoguan_reg_taoist to 10;#12 learn magic from taoguan_reg_taoist to 10;#12 learn spells from taoguan_reg_taoist to 10;#12 learn taosword from taoguan_reg_taoist to 10;#12 learn taoism-kep from taoguan_reg_taoist to 10;#12 learn qingcheng-steps from taoguan_reg_taoist to 10;apprentice taoguan_up_taoist;public_op1;#20 learn magic from taoguan_up_taoist to 10;#20 learn necromancy from taoguan_up_taoist to 10;#20 learn spells from taoguan_up_taoist to 10;#20 learn taosword from taoguan_up_taoist to 10;#20 learn taoism-kep from taoguan_up_taoist to 10;#20 learn gouyee from taoguan_up_taoist to 10;#20 learn qingcheng-steps from taoguan_up_taoist to 10;apprentice taoguan_waiter_taoist;public_op1;#30 learn gouyee from taoguan_waiter_taoist to 10;#30 learn magic from taoguan_waiter_taoist to 10;#30 learn taoism-kep from taoguan_waiter_taoist to 10;#30 learn taosword from taoguan_waiter_taoist to 10;#30 learn spells from taoguan_waiter_taoist to 10;#30 learn necromancy from taoguan_waiter_taoist to 10;#30 learn qingcheng-steps from taoguan_waiter_taoist to 10;apprentice taoist_taolord;public_op1;#10 learn gouyee from taoist_taolord to 10;#10 learn magic from taoist_taolord to 10;#10 learn necromancy from taoist_taolord to 10;#10 learn taosword from taoist_taolord to 10;#10 learn spells from taoist_taolord to 10;#10 learn taoism-kep from taoist_taolord to 10;#10 learn qingcheng-steps from taoist_taolord to 10;");
    go2("jh 29;n;n;n;n;");
    setTimeout(findtianshi(),1000*60*2);
}
var zhaotianshi;
function findtianshi(){
    zhaotianshi=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        if (curName == "雾中" && roomInfo.get("south") == "山道") go("event_1_60035830");
        else if (curName == "平台" && roomInfo.get("south") == "雾中") go("event_1_65661209");
        else if (curName == "洞口" && roomInfo.get("south") == "平台") go("s;");
        else if (curName == "无名山峡谷" && roomInfo.get("north") == "山洞") go("n;");
        else if (curName == "山洞" && roomInfo.get("south") == "无名山峡谷")
        {clearInterval(zhaotianshi);
         cmdCache = [];
         cmdCache2 = [];
         setTimeout(studytianshi(),2000);
        }
    },1000);

}
var zhaotianshi2;
function findtianshi2(){
    zhaotianshi=setInterval(function (b){
        let roomInfo = g_obj_map.get("msg_room");
        let curName = g_obj_map.get("msg_room").get("short");
        if (curName == "雾中" && roomInfo.get("south") == "山道") go("event_1_60035830");
        else if (curName == "平台" && roomInfo.get("south") == "雾中") go("event_1_65661209");
        else if (curName == "洞口" && roomInfo.get("south") == "平台") go("s;");
        else if (curName == "无名山峡谷" && roomInfo.get("north") == "山洞") go("n;");
        else if (curName == "山洞" && roomInfo.get("south") == "无名山峡谷")
        {clearInterval(zhaotianshi);
         cmdCache = [];
         cmdCache2 = [];
        }
    },1000);

}
function studytianshi(){
    go2("apprentice taoist_zhangtianshi;skills taoist_zhangtianshi;#10 learn gouyee from taoist_zhangtianshi to 10;#10 learn magic from taoist_zhangtianshi to 10;#10 learn taoism-kep from taoist_zhangtianshi to 10;#10 learn necromancy from taoist_zhangtianshi to 10;#20 learn taosword from taoist_zhangtianshi to 10;#10 learn spells from taoist_zhangtianshi to 10;#10 learn qingcheng-steps from taoist_zhangtianshi to 10;#50 learn tao-mieshen-sword from taoist_zhangtianshi to 10;#20 learn move from taoist_zhangtianshi to 10;chushi taoist_zhangtianshi;fight taoist_zhangtianshi;chushi taoist_zhangtianshi;");
}
//铁雪男
function tiexueshanzhaungB(){
    go2("home;home apprentice 铁雪山庄;jh 31;n;n;n;w;w;w;w;n;n;n;skills resort_maste;#40 learn qidaoforce from resort_master to 10;#40 learn meihua-shou from resort_master to 10;#40 learn fall-steps from resort_master to 10;#40 learn shortsong-blade from resort_master to 10;chushi resort_master;fight resort_master;chushi resort_master;");
}
//铁雪女
function tiexueshanzhaungG(){
    go2("home;home apprentice 铁雪山庄;apprentice resort_master2;jh 31;n;n;n;w;w;w;w;n;n;n;skills resort_maste;#40 learn qidaoforce from resort_master to 10;#40 learn meihua-shou from resort_master to 10;#40 learn fall-steps from resort_master to 10;#40 learn shortsong-blade from resort_master to 10;chushi resort_master;fight resort_master;chushi resort_master;");
}
//封山剑派
function fengshanjianpai(){
    go2("jh 1;e;n;e;e;e;apprentice swordsman_master;skills swordsman_master;#12 learn literate from swordsman_master to 10;#32 learn force from swordsman_master to 10;#36 learn sword from swordsman_master to 10;#36 learn dodge from swordsman_master to 10;#40 learn parry from swordsman_master to 10;#28 learn unarmed from swordsman_master to 10;#36 learn chaos-steps from swordsman_master to 10;#36 learn fonxansword from swordsman_master to 10;#32 learn fonxanforce from swordsman_master to 10;#28 learn liuh-ken from swordsman_master to 10;chushi swordsman_master;fight swordsman_master;chushi swordsman_master;");
}
//断剑山庄
function duanjianshanzhuang(){
    go2("home apprentice 断剑山庄;public_op1;#55 learn axe from duanjian_tiannu to 10;#55 learn sword from duanjian_tiannu to 10;#55 learn blade from duanjian_tiannu to 10;#55 learn force from duanjian_tiannu to 10;#55 learn throwing from duanjian_tiannu to 10;#55 learn spear from duanjian_tiannu to 10;#55 learn staff from duanjian_tiannu to 10;#55 learn dodge from duanjian_tiannu to 10;#55 learn hammer from duanjian_tiannu to 10;#55 learn parry from duanjian_tiannu to 10;#55 learn stick from duanjian_tiannu to 10;#55 learn whip from duanjian_tiannu to 10;#55 learn unarmed from duanjian_tiannu to 10;jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;e;e;event_1_10251226;apprentice duanjian_feng;skills duanjian_feng;#10 learn axe from duanjian_feng to 10;#10 learn sword from duanjian_feng to 10;#10 learn blade from duanjian_feng to 10;#10 learn force from duanjian_feng to 10;#10 learn throwing from duanjian_feng to 10;#10 learn spear from duanjian_feng to 10;#10 learn staff from duanjian_feng to 10;#10 learn dodge from duanjian_feng to 10;#50 learn jibenfashu from duanjian_feng to 10;#10 learn parry from duanjian_feng to 10;#10 learn stick from duanjian_feng to 10;#10 learn hammer from duanjian_feng to 10;#10 learn whip from duanjian_feng to 10;#10 learn unarmed from duanjian_feng to 10;#10 learn iron-cloth from duanjian_feng to 10;#10 learn music from duanjian_feng to 10;chushi duanjian_feng;fight duanjian_feng;chushi duanjian_feng;");
}
//邪派
//镜星府
function jingxingfu(){
    alert("点杭界山慢慢搞！！！！！！！！！！");
}
//九阴派
function jiuyin(){
    go2("");
}
//白驼山庄
function baituo(){
    go2("home apprentice 白驼山派;public_op1;#10 learn hamagong from baituo_menwei to 10;#10 learn chanchu-bufa from baituo_menwei to 10;#10 learn lingshe-zhangfa from baituo_menwei to 10;apprentice baituo_guanjia;public_op1;#10 learn hamagong from baituo_guanjia to 10;#10 learn lingshe-zhangfa from baituo_guanjia to 10;#10 learn chanchu-bufa from baituo_guanjia to 10;#20 learn shexing-diaoshou from baituo_guanjia to 10;apprentice btshan_ouyangke;public_op1;#10 learn hamagong from btshan_ouyangke to 10;#10 learn lingshe-zhangfa from btshan_ouyangke to 10;#10 learn chanchu-bufa from btshan_ouyangke to 10;#10 learn shexing-diaoshou from btshan_ouyangke to 10;#30 learn training from btshan_ouyangke to 10;jh 21;nw;w;w;nw;n;n;n;n;n;n;n;apprentice btshan_ouyangfeng;#20 learn hamagong from btshan_ouyangfeng to 10;#20 learn training from btshan_ouyangfeng to 10;#20 learn lingshe-zhangfa from btshan_ouyangfeng to 10;#20 learn chanchu-bufa from btshan_ouyangfeng to 10;#20 learn shexing-diaoshou from btshan_ouyangfeng to 10;#50 learn hamashengong from btshan_ouyangfeng to 10;#50 learn hamaquan from btshan_ouyangfeng to 10;#50 learn move from btshan_ouyangfeng to 10;chushi btshan_ouyangfeng;fight btshan_ouyangfeng;chushi btshan_ouyangfeng;");
}
//唐门
function tangmen(){
    go2("home apprentice 唐门;public_op1;#14 learn tangmen-xinfa from tangmen_tangbai to 10;#14 learn dugong from tangmen_tangbai to 10;#14 learn tangmen-duzhang from tangmen_tangbai to 10;#14 learn tangshi-jian from tangmen_tangbai to 10;apprentice tangmen_tangjian;public_op1;#20 learn tangmen-xinfa from tangmen_tangjian to 10;#20 learn dugong from tangmen_tangjian to 10;#20 learn mantian-huayu from tangmen_tangjian to 10;#20 learn tangmen-duzhang from tangmen_tangjian to 10;#20 learn tangshi-jian from tangmen_tangjian to 10;apprentice tangmen_tangyun;public_op1;#20 learn tangmen-xinfa from tangmen_tangyun to 10;#20 learn dugong from tangmen_tangyun to 10;#20 learn tangmen-duzhang from tangmen_tangyun to 10;#20 learn tangshi-jian from tangmen_tangyun to 10;#20 learn mantian-huayu from tangmen_tangyun to 10;#32 learn taxue-wuhen from tangmen_tangyun to 10;#20 learn fanwen from tangmen_tangyun to 10;apprentice tangmen_tangfeng;public_op1;#12 learn tangmen-xinfa from tangmen_tangfeng to 10;#12 learn dugong from tangmen_tangfeng to 10;#12 learn tangmen-duzhang from tangmen_tangfeng to 10;#12 learn tangshi-jian from tangmen_tangfeng to 10;#12 learn mantian-huayu from tangmen_tangfeng to 10;#40 learn tiannv-sanhua from tangmen_tangfeng to 10;#12 learn taxue-wuhen from tangmen_tangfeng to 10;#3 ask tangmen_tangmei;#3 ask tangmen_tangyun;#3 ask tangmen_tangmei;jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;apprentice tangmen_madam;skills tangmen_madam;#50 learn tangmen-xinfa from tangmen_madam to 10;#50 learn dugong from tangmen_madam to 10;#50 learn tiannv-sanhua from tangmen_madam to 10;#50 learn tiannv-sanhua from tangmen_madam to 10;#50 learn wuying-dugong from tangmen_madam to 10;#50 learn baoyu-lihua from tangmen_madam to 10;#50 learn tangmen-duzhang from tangmen_madam to 10;#50 learn tangshi-jian from tangmen_madam to 10;#50 learn mantian-huayu from tangmen_madam to 10;#50 learn tangmen-dujing from tangmen_madam to 10;#50 learn taxue-wuhen from tangmen_madam to 10;chushi tangmen_madam;fight tangmen_madam;chushi tangmen_madam;");
}
//魔教
function mojiao(){
    go2("home apprentice 日月神教;public_op1;#12 learn tianmo-dafa from heimuya_jianqiankai to 10;#12 learn mo-jian-jue from heimuya_jianqiankai to 10;#12 learn mo-shan-jue from heimuya_jianqiankai to 10;apprentice heimuya_shangguanyun;public_op1;#30 learn tianmo-dafa from heimuya_shangguanyun to 10;#30 learn mo-zhang-jue from heimuya_shangguanyun to 10;#30 learn daguanming from heimuya_shangguanyun to 10;#30 learn mo-jian-jue from heimuya_shangguanyun to 10;#30 learn mo-shan-jue from heimuya_shangguanyun to 10;apprentice heimuya_dugufeng;public_op1;#10 learn tianmo-dafa from heimuya_dugufeng to 10;#10 learn mo-zhang-jue from heimuya_dugufeng to 10;#10 learn mo-jian-jue from heimuya_dugufeng to 10;#10 learn mo-shan-jue from heimuya_dugufeng to 10;apprentice heimuya_yangyanqing;public_op1;#36 learn mo-qiang-jue from heimuya_yangyanqing to 10;");
    mst_go();
    setTimeout(clearInterval(mst_interval),1000*60*10);
    go2("jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;apprentice heimuya_fansong;#36 learn mo-fu-jue from heimuya_fansong to 10;e;apprentice heimuya_juling;#36 learn mo-chui-jue from heimuya_juling to 10;e;apprentice heimuya_chutong;#36 learn mo-bian-jue from heimuya_chutong to 10;#6 w;apprentice heimuya_huaxiangrong;#36 learn mo-dao-jue from heimuya_huaxiangrong to 10;w;apprentice heimuya_quyang;#36 learn mo-gou-jue from heimuya_quyang to 10;w;apprentice heimuya_zhangchengfeng;#36 learn mo-ji-jue from heimuya_zhangchengfeng to 10;w;w;apprentice heimuya_zhaohe;#36 learn mo-cha-jue from heimuya_zhaohe to 10;e;e;e;e;e;n;n;event_1_57107759;e;e;n;w;apprentice heimuya_dfbb;#10 learn tianmo-dafa from heimuya_dfbb to 10;#10 learn mo-jian-jue from heimuya_dfbb to 10;#50 learn pixie-sword from heimuya_dfbb to 10;#20 learn mo-zhang-jue from heimuya_dfbb to 10;#10 learn daguanming from heimuya_dfbb to 10;#50 learn kuihua-shengong from heimuya_dfbb to 10;chushi heimuya_dfbb;fight heimuya_dfbb;chushi heimuya_dfbb;");
}
//青城派
function qingcheng(){
    go2("home apprentice 青城派;public_op1;#28 learn qingcheng-force from qingcheng_renying to 10;#28 learn cuixin-zhang from qingcheng_renying to 10;#28 learn qingcheng-steps from qingcheng_renying to 10;#28 learn pine-sword from qingcheng_renying to 10;apprentice qingcheng_masteryu;public_op1;#10 learn qingcheng-force from qingcheng_masteryu to 10;#36 learn dusha-zhang from qingcheng_masteryu to 10;#10 learn taoism from qingcheng_masteryu to 10;#10 learn cuixin-zhang from qingcheng_masteryu to 10;#10 learn qingcheng-steps from qingcheng_masteryu to 10;#10 learn pine-sword from qingcheng_masteryu to 10;jh 15;s;s;s;s;s;s;w;apprentice qingcheng_mudaoren;#15 learn qingcheng-force from qingcheng_mudaoren to 10;#15 learn dusha-zhang from qingcheng_mudaoren to 10;#50 learn qixing-sword from qingcheng_mudaoren to 10;#15 learn cuixin-zhang from qingcheng_mudaoren to 10;#15 learn qingcheng-steps from qingcheng_mudaoren to 10;#50 learn daode-jing from qingcheng_mudaoren to 10;#15 learn pine-sword from qingcheng_mudaoren to 10;chushi qingcheng_mudaoren;fight qingcheng_mudaoren;chushi qingcheng_mudaoren;");
}
//星宿派
function xingxiu(){
    go2("home apprentice 星宿派;public_op1;#12 learn huagong-dafa from xingxiu_shihou to 10;#12 learn zhaixinggong from xingxiu_shihou to 10;#12 learn xingxiu-duzhang from xingxiu_shihou to 10;#12 learn tianshan-zhang from xingxiu_shihou to 10;apprentice xingxiu_zhaixing;public_op1;#20 learn huagong-dafa from xingxiu_zhaixing to 10;#20 learn zhaixinggong from xingxiu_zhaixing to 10;#24 learn xingxiu-duzhang from xingxiu_zhaixing to 10;#22 learn tianshan-zhang from xingxiu_zhaixing to 10;apprentice xingxiu_azi;public_op1;#10 learn huagong-dafa from xingxiu_azi to 10;#10 learn zhaixinggong from xingxiu_azi to 10;#10 learn xingxiu-duzhang from xingxiu_azi to 10;#10 learn tianshan-zhang from xingxiu_azi to 10;jh 28;n;n;n;n;n;apprentice xingxiu_ding;#20 learn huagong-dafa from xingxiu_ding to 10;#20 learn zhaixinggong from xingxiu_ding to 10;#20 learn xingxiu-duzhang from xingxiu_ding to 10;#20 learn tianshan-zhang from xingxiu_ding to 10;#50 learn lianzhu-fushi from xingxiu_ding to 10;chushi xingxiu_ding;fight xingxiu_ding;chushi xingxiu_ding;");
}
//天邪派
function tianxie(){
    go2("jh 12;n;n;n;n;apprentice fighter_master;event_1_46925867;apprentice fighter_master;#20 learn celestial from fighter_master to 10;#20 learn celestrike from fighter_master to 10;#16 learn pyrobat-steps from fighter_master to 10;#20 learn six-chaos-sword from fighter_master to 10;s;w;n;nw;e;n;apprentice fighter_champion;#25 learn celestial from fighter_champion to 10;#25 learn celestrike from fighter_champion to 10;#25 learn pyrobat-steps from fighter_champion to 10;#50 learn spring-blade from fighter_champion to 10;enable six-chaos-sword;practice six-chaos-sword;");
    alert("又得练剑了，六阴追魂剑，还是真剑！！！！！！！！！！！！！！");
}
//大昭寺
function dazhaosi(){
    go2("home apprentice 大招寺;public_op1;#36 learn notracesnow from lama_master to 10;#36 learn bolomiduo from lama_master to 10;#36 learn magic from lama_master to 10;#36 learn jin-gang from lama_master to 10;#36 learn buddhism from lama_master to 10;#36 learn essencemagic from lama_master to 10;#36 learn cloudstaff from lama_master to 10;#36 learn bloodystrike from lama_master to 10;#36 learn iron-cloth from lama_master to 10;jh 26;w;w;w;w;w;w;w;w;w;w;ask lama_master;ask lama_master;ask lama_master;event_1_91837538;apprentice lama_gelun;#44 learn magic from lama_gelun to 10;#40 learn cloudstaff from lama_gelun to 10;#36 learn notracesnow from lama_gelun to 10;#50 learn bolomiduo from lama_gelun to 10;#50 learn jin-gang from lama_gelun to 10;#40 learn buddhism from lama_gelun to 10;#50 learn essencemagic from lama_gelun to 10;#50 learn bloodystrike from lama_gelun to 10;#40 learn iron-cloth from lama_gelun to 10;chushi lama_gelun;fight lama_gelun;chushi lama_gelun;");
}
//晚月庄
function wanyuezhuang(){
    go2("home apprentice 晚月庄;public_op1;#20 learn iceforce from dancer_master to 10;#20 learn stormdance from dancer_master to 10;#18 learn snowwhip from dancer_master to 10;#20 learn tenderzhi from dancer_master to 10;enable snowwhip;practice snowwhip;");
    alert("又得练剑了，易寒剑法，啊呸！易寒鞭法！！但是依然很贱");
}
//花子会
function huazihui(){
    go2("home apprentice 花紫会;public_op1;#20 learn stealing from beggar_master to 10;#20 learn begging from beggar_master to 10;#30 learn spicyclaw from beggar_master to 10;#30 learn serpentforce from beggar_master to 10;jh 7;s;chushi beggar_master;fight beggar_master;chushi beggar_master;");
}
//新门派
//风花牧场
function fenghuamuchang(){
    go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 6;nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;event_1_52732806;apprentice langhuanyudong_qixing;#20 learn pianxuejijian from langhuanyudong_qixing to 10;#20 learn wanrenshadao from langhuanyudong_qixing to 10;#20 learn sumagong from langhuanyudong_qixing to 10;apprentice langhuanyudong_benkuangxiao;#10 learn pianxuejijian from langhuanyudong_benkuangxiao to 10;#10 learn wanrenshadao from langhuanyudong_benkuangxiao to 10;#10 learn sumagong from langhuanyudong_benkuangxiao to 10;jh 1;e;n;n;n;n;w;event_1_90287255 go 6;nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;event_1_64526228;apprentice shanya_qiongduwu;#10 learn pianxuejijian from shanya_qiongduwu to 10;#10 learn wanrenshadao from shanya_qiongduwu to 10;#10 learn sumagong from shanya_qiongduwu to 10;apprentice shanya_muzhaoxue;#10 learn pianxuejijian from shanya_muzhaoxue to 10;#10 learn wanrenshadao from shanya_muzhaoxue to 10;#10 learn sumagong from shanya_muzhaoxue to 10;jh 1;e;n;n;n;n;w;event_1_90287255 go 6;nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;event_1_90371900;apprentice wujinshenyuan_songhou;#50 learn shuangxinjue from wujinshenyuan_songhou to 10;#50 learn jiananjun from wujinshenyuan_songhou to 10;#50 learn wanxianglyd from wujinshenyuan_songhou to 10;#50 learn jiumiaofts from wujinshenyuan_songhou to 10;#50 learn budongmwj from wujinshenyuan_songhou to 10;#50 learn shiyangjian from wujinshenyuan_songhou to 10;chushi wujinshenyuan_songhou;kill wujinshenyuan_songhou;chushi wujinshenyuan_songhou;");
}
//西夏堂
function xixiatang(){
    go2("home apprentice 西夏堂;public_op1;#40 learn xlxf from jueqinggu_tbs to 10;#40 learn bxcf from jueqinggu_tbs to 10;#40 learn ylsz from jueqinggu_tbs to 10;apprentice jueqinggu_mzyw;public_op1;items get_store /obj/book/wumu-yishu;#40 learn sycf from jueqinggu_mzyw to 10;#40 learn mzsz from jueqinggu_mzyw to 10;apprentice jueqinggu_ylrr;public_op1;#50 learn msbf from jueqinggu_ylrr to 10;#10 learn mzsz from jueqinggu_ylrr to 10;#10 learn xlxf from jueqinggu_ylrr to 10;apprentice jueqinggu_kmyh;public_op1;#10 learn sycf from jueqinggu_kmyh to 10;#10 learn ylsz from jueqinggu_kmyh to 10;#10 learn bxcf from jueqinggu_kmyh to 10;#50 learn zylxc from jueqinggu_kmyh to 10;#50 learn xhzq from jueqinggu_kmyh to 10;jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne;se;chushi jueqinggu_kmyh;fight jueqinggu_kmyh;chushi jueqinggu_kmyh;");
}
//燕云世家
function yanyunshijia(){
    go2("home apprentice 燕云世家;public_op1;#40 learn txzf from kaifeng_yelvyilie to 10;#40 learn hlff from kaifeng_yelvyilie to 10;apprentice shaolin_xiaoyuanshan;public_op1;#40 learn myzq from shaolin_xiaoyuanshan to 10;#40 learn pyff from shaolin_xiaoyuanshan to 10;#40 learn tmzf from shaolin_xiaoyuanshan to 10;apprentice emei_yelvba;public_op1;#50 learn jgxf from emei_yelvba to 10;#10 learn myzq from emei_yelvba to 10;#10 learn tmzf from emei_yelvba to 10;apprentice bihaishanzhuang_yelvchuge;public_op1;#50 learn yysqz from bihaishanzhuang_yelvchuge to 10;#10 learn hlff from bihaishanzhuang_yelvchuge to 10;#10 learn pyff from bihaishanzhuang_yelvchuge to 10;#50 learn jlwd from bihaishanzhuang_yelvchuge to 10;#10 learn txzf from bihaishanzhuang_yelvchuge to 10;jh 38;n;n;n;n;n;n;n;n;n;chushi bihaishanzhuang_yelvchuge;fight bihaishanzhuang_yelvchuge;chushi bihaishanzhuang_yelvchuge;");
}
//天波杨门
function tianboyangmen(){
    go2("home apprentice 天波杨门;public_op1;#40 learn bxxf from kaifeng_yangpaifeng to 10;#40 learn ymqf from kaifeng_yangpaifeng to 10;apprentice kaifeng_chaijunzhu;public_op1;#40 learn tbjz from kaifeng_chaijunzhu to 10;#40 learn wwzf from kaifeng_chaijunzhu to 10;#40 learn lxss from kaifeng_chaijunzhu to 10;apprentice kaifeng_muguiying;public_op1;#10 learn wwzf from kaifeng_muguiying to 10;#50 learn sjfd from kaifeng_muguiying to 10;#10 learn bxxf from kaifeng_muguiying to 10;apprentice kaifeng_yangyanzhao;public_op1;skills info kaifeng_yangyanzhao zglq;#50 learn zglq from kaifeng_yangyanzhao to 10;#10 learn lxss from kaifeng_yangyanzhao to 10;#10 learn ymqf from kaifeng_yangyanzhao to 10;#10 learn tbjz from kaifeng_yangyanzhao to 10;#50 learn jlzb from kaifeng_yangyanzhao to 10;jh 17;n;n;n;n;w;w;w;w;chushi kaifeng_yangyanzhao;fight kaifeng_yangyanzhao;chushi kaifeng_yangyanzhao;");
}
//***********************************************************//
//***********************************************************//
//***********************************************************//
//***********************************************************//
//***********************************************************//
//杭界山自动-测试
var where,npc;
function ZDhjs(){
    var b=prompt("请输入门派和师傅：\n 镜星府：那罗、洪昭天、白一珠、裴若海、上官晓芙 \n 碧落城：铁术、萧正、呼延铮、厉乘风，花落云 \n 荣威镖局：马万啸、高芝城、王世仲、辰川、墟归一 \n","荣威镖局|马万啸");
    var sub=b.split('|');
    where = sub[0];
    npc = sub[1];
    go2("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;")
    setTimeout(zidonghangjie(),1000*2);
}

function zidonghangjie(){
    //测试一
    /*    let roomInfo = g_obj_map.get("msg_room");
    let curName = g_obj_map.get("msg_room").get("short");
    if (curName == "青苔石阶" && roomInfo.get("northeast")== "青苔石阶"&& roomInfo.get("northwest")== "青苔石阶"&& roomInfo.get("south")== "杭界大门") {go2("nw");setTimeout(zidonghangjie(),1000)}
    else if (curName == "青苔石阶" && roomInfo.get("northeast")== "青苔石阶"&& roomInfo.get("southeast")== "青苔石阶") {go2("ne");setTimeout(zidonghangjie(),1000)}
    else if (curName == "青苔石阶" && roomInfo.get("northeast")== "青苔石阶"&& roomInfo.get("southwest")== "青苔石阶") {go2("ne");setTimeout(zidonghangjie(),1000)}
    else if (curName == "青苔石阶" && roomInfo.get("southwest")== "青苔石阶"&& roomInfo.get("southeast")== "青苔石阶") {go2("se");setTimeout(zidonghangjie(),1000)}
    else if (curName == "青苔石阶" && roomInfo.get("northwest")== "青苔石阶"&& roomInfo.get("southeast")== "青苔石阶") {go2("se");setTimeout(zidonghangjie(),1000)}
    else if (curName == "青苔石阶" && roomInfo.get("northwest")== "青苔石阶"&& roomInfo.get("southwest")== "青苔石阶") {go2("sw");setTimeout(zidonghangjie(),1000)}
    else if (curName == "青苔石阶" && roomInfo.get("northeast")== "青苔石阶"&& roomInfo.get("southwest")== "青苔石阶") {go2("sw");setTimeout(zidonghangjie(),1000)}
    else if (curName == "杭界大门" && roomInfo.get("north")== "青苔石阶"&& roomInfo.get("east")== "山道") {go2("n");setTimeout(zidonghangjie(),1000)}
    else if (curName == "榆叶林" && roomInfo.get("north")== "榆叶林"&& roomInfo.get("south")== "榆叶林"&& roomInfo.get("southwest")== "榆叶林"&& roomInfo.get("snorthwest")== "榆叶林") {go2("s");setTimeout(zidonghangjie(),1000)}
    else if (curName == "榆叶林" && roomInfo.get("north")== "榆叶林"&& roomInfo.get("east")== "榆叶林") {go2("e");setTimeout(zidonghangjie(),1000)}
    else if (curName == "榆叶林" && roomInfo.get("north")== "榆叶林"&& roomInfo.get("west")== "榆叶林") {go2("n");setTimeout(zidonghangjie(),1000)}
    else if (curName == "榆叶林" && roomInfo.get("north")== "榆叶林"&& roomInfo.get("south")== "榆叶林") {go2("n");setTimeout(zidonghangjie(),1000)}
    else if (curName == "榆叶林" && roomInfo.get("south")== "榆叶林"&& roomInfo.get("west")== "榆叶林") {go2("w");setTimeout(zidonghangjie(),1000)}
    else if (curName == "榆叶林" && roomInfo.get("southeast")== "榆叶林"&& roomInfo.get("south")== "榆叶林") {go2("s");setTimeout(zidonghangjie(),1000)}
    else if (curName == "世外桃源"&& where == "荣威镖局" ) {go2("ne");setTimeout(zidonghangjie(),1000)}
    else if (curName == "世外桃源"&& where == "镜星府" ) {go2("nw");setTimeout(zidonghangjie(),1000)}
    else if (curName == "世外桃源"&& where == "碧落城" ) {go2("s");setTimeout(zidonghangjie(),1000)}
    else {
        return;
        Infor_OutFunc("<span style='color:#FFF;'>--到达--</span>");
    }*/
    //测试一结束
    //测试二
    let roomInfo = g_obj_map.get("msg_room");
    let curName = g_obj_map.get("msg_room").get("short");
    if (curName == "青苔石阶" && roomInfo.get("northwest") == "青苔石阶") {
        go("nw;");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "青苔石阶" && roomInfo.get("northeast") == "青苔石阶") {
        go("ne;");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "青苔石阶" && roomInfo.get("southwest") == "青苔石阶") {
        go("sw;");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "榆叶林" && roomInfo.get("north") == "榆叶林") {
        go("n;");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "榆叶林" && roomInfo.get("south") == "榆叶林") {
        go2("s;");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "世外桃源"&& where == "荣威镖局" ) {
        go("ne");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "世外桃源"&& where == "镜星府" ) {
        go("nw");
        setTimeout(zidonghangjie(),100)
    }
    else if (curName == "世外桃源"&& where == "碧落城" ) {
        go("s");
        setTimeout(zidonghangjie(),100)
    }
    else {
        return;
        Infor_OutFunc("<span style='color:#FFF;'>--到达--</span>");
    }

}
//***********************************************************//
//***********************************************************//
//**********************各种弹窗***************************//
//***********************************************************//
//***********************************************************//
//按钮加入窗体中----------------------------
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}
var popbk = {};
var popList = {};
var popBtnList = {};
var popButtonHeight = '20px';

function createPop(a) {
    var b = document.createElement('div');
    popbk[a] = b;
    b.style.position = 'absolute';
    b.style.top = '0';
    b.style.width = '100%';
    b.style.height = '100%';
    b.style.zIndex = '100';
    b.style.display = 'none';
    document.body.appendChild(b);
    var c = document.createElement('div');
    c.style.position = 'absolute';
    c.style.top = '0';
    c.style.width = '100%';
    c.style.height = '100%';
    b.appendChild(c);

    function closepop() {
        b.style.display = 'none'
    }
    c.addEventListener('click', closepop);

    var d = document.createElement('div');
    popList[a] = d;
    d.style.position = 'absolute';
    d.style.top = '100px';
    d.style.width = '265px';
    d.style.padding = '10px 5px 10px 0px';
    d.style.background = "rgba(175,175, 100, 0.9)"; // '#f0f0f0';
    d.style.textAlign = 'center';
    d.style.border = '2px solid #ccc';
    b.appendChild(d);
    return b
}

function createPopButton(a, b, c) {
    var d = document.createElement('button');
    d.innerText = a;
    d.style.padding = '0';
    d.style.margin = '5px 0 0 5px';
    d.style.width = '60px';
    d.style.height = '20px';
    d.style.height = popButtonHeight;
    d.addEventListener('click', c);
    popList[b].appendChild(d);
    popBtnList[a] = d;
}

// 显示弹出式菜单
function showPopGroup(b) {
    for (var key in popbk) {
        if (key == b) {
            popbk[key].style.display = '';
            var rightMenuStart = 0;
            if (innerWidth > innerHeight) {
                rightMenuStart = innerWidth - innerHeight * 9 / 16 - 420
            }
            // rightMenuStart = rightMenuStart / 16 转为字符长度
            popList[b].style.left = (innerWidth - rightMenuStart - 265) / 2 + 'px';
        } else {
            popbk[key].style.display = 'none';
        }
    }
}

// 隐藏弹出式菜单
function hidePopGroup(b) {
    popbk[b].style.display = 'none';
}
// 弹框显示池
var swalArr = [];
var swalShowing = false;

function closeSwal() {
    swal.close();
    showNext();
}

function showNext() {
    var next = swalArr.shift();
    if (!next) {
        swalShowing = false;
        return;
    }

    var showObj = {
        background: menuBackground,
        animation: false,
        reverseButtons: true,
        confirmButtonText: '确定',
        confirmButtonClass: "swal-btn-size",
        allowOutsideClick: false,
        allowEscapeKey: true,
        allowEnterKey: true,
    };
    switch (next.type) {
        case "tips":
            showObj.html = "<div style='text-align:left !important;font-size:1rem !important'>" + next.msg + "</div>";
            break;
        case "alert":
            showObj.html = "<div style='text-align:center !important;font-size:1rem !important'>" + next.msg + "</div>";
            break;
        case "confirm":
            showObj.html = "<div style='text-align:center !important;font-size:1rem !important'>" + next.msg + "</div>";
            showObj.showCancelButton = true
            showObj.cancelButtonText = '取消'
            showObj.cancelButtonClass = "swal-btn-size"
            break;
        case "message":
            showObj.html = "<div style='text-align:center !important;font-size:1.5rem !important'>" + next.title + "</div>" +
                "<div style='text-align:left !important;font-size:1rem !important'>" + next.msg + "</div>";
            showObj.showCancelButton = true
            showObj.cancelButtonText = '返回'
            showObj.cancelButtonClass = "swal-btn-size"
            break;

        case "input":
            if (next.val == null) {
                next.val = "";
            }
            showObj.html = "<div style='padding-left:0.6rem;text-align:left !important;font-size:1rem !important'>" + next.msg + "</div>";
            showObj.input = 'text'
            showObj.inputValue = next.val
            showObj.inputClass = "swal-input-bottom"
            showObj.showCancelButton = true
            showObj.cancelButtonText = '取消'
            showObj.cancelButtonClass = "swal-btn-size"
            break;
    }

    var s;
    try {
        swalShowing = true;
        s = swal(showObj);
    } catch (e) {
        alert(e);
        showNext();
        return;
    };
    if (!s) {
        alert("no swal");
        showNext();
        return;
    }

    var timeout = null;
    if (next.timeout) {
        timeout = setTimeout(function() {
            closeSwal();
            if (next.timeoutCb) next.timeoutCb()
            // 递归调用直到读空为止
            showNext();
        }, next.timeout);
    }

    s.then(function(...args) {
        clearTimeout(timeout);
        // 递归调用直到读空为止
        showNext();

        if (args && args.length > 0 && args[0].dismiss) {
            if (next.cancelCb) {
                next.cancelCb(...args);
            }
        } else {
            if (next.confirmCb) {
                next.confirmCb(...args);
            }
        }
    }, function(...args) {
        clearTimeout(timeout);
        // 递归调用直到读空为止
        showNext();

        if (next.cancelCb) {
            next.cancelCb(...args);
        }
    })

}
function showSwal(obj) {
    swalArr.push(obj)
    if (swalShowing) {
        return;
    }
    showNext();
};
function AutoAlert(msg, timeout, cb) {
    showSwal({
        type: "alert",
        msg: msg + "<br/>(" + timeout / 1000 + "秒后将自动关闭)",
        confirmCb: cb,
        timeout: timeout,
        timeoutCb: cb,
    });
}
// 警告框
function Alert(msg, cb) {
    AutoAlert(msg, 10 * 1000, cb);
};

// 提示框
function Tips(msg, cb) {
    showSwal({
        type: "tips",
        msg: msg,
        confirmCb: cb,
    });
}

// 带自动确认的计时器
// timeout -- 单位为秒
function AutoConfirm(msg, timeout, confirmCb, cancelCb) {
    Confirm(msg + "<br/>(" + timeout / 1000 + "秒后自动确定)", confirmCb, cancelCb, {
        timeout: timeout,
        timeoutCb: function() {
            if (confirmCb) confirmCb();
        },
    })
}

// 带自动取消的确认框
function AutoCancel(msg, timeout, confirmCb, cancelCb) {
    Confirm(msg + "<br/>(" + timeout / 1000 + "秒后自动取消)", confirmCb, cancelCb, {
        timeout: timeout,
        timeoutCb: function() {
            if (cancelCb) cancelCb();
        },
    })
}

// 确认框
function Confirm(msg, confirmCb, cancelCb, opt) {
    showSwal({
        type: "confirm",
        msg: msg,
        confirmCb: confirmCb,
        cancelCb: cancelCb,
        timeout: opt ? opt.timeout : null,
        timeoutCb: opt ? opt.timeoutCb : null,
    })
    return;
};

// 带确认的消息
function Message(title, msg, confirmCb, cancelCb) {
    showSwal({
        type: "message",
        title: title,
        msg: msg,
        confirmCb: confirmCb,
        cancelCb: cancelCb,
    })
    return;
};

// 带输入的框
function Input(msg, val, confirmCb, cancelCb) {
    showSwal({
        type: "input",
        msg: msg,
        val: val,
        confirmCb: confirmCb,
        cancelCb: cancelCb,
    })
    return;
}
//***********************************************************//
//***********************************************************//
//**********************提示框结束***************************//
//***********************************************************//
//***********************************************************//
//定时发消息
var fbteam;
function fbnews(){
    fbteam=setInterval(function (b){
        clickButton('go_chat');
        clickButton('go_chat chat');
        $('#chat_msg').val("本12飞机，进队，直接领奖励；领完退出队伍");
        clickButton('send_chat');
    },1000*60*10)
}
//整理字符串

function remove(str, substr) {
    return str.replace(substr, '');
}
function removeChars(str, num) {
    return str.replace(new RegExp(`^.{${num}}`), '');
}
function removesym(str) {
  return str.replace(/"/g, '');
}
//自动学奇侠技能
function ZDqixia(){
    var b=prompt("输入要学习技能的奇侠 \n 玄月研、宇文无敌、风无痕、厉沧若、夏岳卿、妙无心 \n 巫夜姬、烈九州、穆妙羽、李玄霸、八部龙将、狼居胥 \n 庞统、王蓉、风南、李宇飞、步惊鸿、浪唤雨 \n 逆风舞、火云邪神、郭济、狐苍雁、护竺、风行骓 \n 吴缜 \n ","风无痕");
    var qixia=['玄月研','宇文无敌','风无痕','厉沧若','夏岳卿','妙无心','巫夜姬','烈九州','穆妙羽','李玄霸','八部龙将','狼居胥','庞统','王蓉','风南','李宇飞','步惊鸿','浪唤雨','逆风舞','火云邪神','郭济','狐苍雁','护竺','风行骓','吴缜'];
    var f1,f2,ff;
    f1="javascript:clickButton('";
    f2="', 0);"
    // 获取所有带有href属性的元素
    const links = document.querySelectorAll('a[href]');
    // 定义一个用于存储结果的对象
    var cc="";
    // 遍历所有链接
    links.forEach((link) => {
        // 获取href属性值
        const href = link.getAttribute('href');
        ff=String(href);
        ff=remove(ff,f1);
        ff=remove(ff,f2);
        // 获取显示名（链接文本内容）
        const text = link.textContent.trim();
        if(qixia.includes(text)){
            // 存储到结果对象中
            cc=cc+text+"|"+ff+";";
        }
    });
    var qixialist=cc.split(';');
    for(let i=0;i<qixialist.length;i++){
        var aa=qixialist[i].split('|');
        if(aa[0]==b){
            go2(aa[1]);
            studyQX(b)
        }
    }
}
function studyQX(qixiaNM){
    switch(qixiaNM){
        case '玄月研':
        case '宇文无敌':
        case '风无痕':
        case '厉沧若':
        case '夏岳卿':
        case '妙无心':
        case '巫夜姬':
        case '烈九州':
        case '穆妙羽':
        case '李玄霸':
        case '八部龙将':
        case '狼居胥':
        case '庞统':
        case '王蓉':
        case '风南':
        case '李宇飞':
        case '步惊鸿':
        case '浪唤雨':
        case '逆风舞':
        case '火云邪神':
        case '郭济':
        case '狐苍雁':
        case '护竺':
        case '风行骓':
        case '吴缜':
        default:
            alert("没这家伙，重新输入");
    }
}
/*
//自动斥候
var killchihou;
function autokillCH(){
 var n=prompt("输入门票数量","3");
    if(!n) return;
    var killCHnum=Number(n);
    var num=0;
    go2("items use obj_yech_csf,kill snow_yech");
    killchihou=setInterval(function (b){
        var peopleList = $(".cmd_click3");
        var thisonclick = null;
        thisonclick = peopleList[0].getAttribute('onclick');
        if(thisonclick=="clickButton('look_npc snow_yech', 0)"){
          go2("kill snow_yech;");
        }
        else{
            if(num>killCHnum){
                //结束
                go2("talk结束");
                clearInterval(killchihou);
            }
            else{
                //吃门票
                // InforOutFunc("talk吃门票");
                //  InforOutFunc("num="+num);
                //  InforOutFunc("killCHnum="+killCHnum);
                go2("items use obj_yech_csf");
                num=num+1;
            }
        }
    },1000)
}
*/

//自动斥候-改
var killchihou;
function autokillCH(){
    var n=prompt("输入门票数量","3");
    if(!n) return;
    var num1=Number(n);
    var num2=0;
    var time=0;
    go2("items use obj_yech_csf,kill snow_yech");
    killchihou=setInterval(function (b){
        var peopleList = $(".cmd_click3");
        var thisonclick = null;
        var first=peopleList[0].innerText;
        thisonclick =peopleList[0].getAttribute('onclick');
        if(peopleList[0].innerText=="幽厄斥候"){
            go2("kill snow_yech;");
        }else if(first.indexOf('的尸体')>-1||!first){
            go2("items use obj_yech_csf");
            //go2("talk用门票;");
            InforOutFunc("num2:"+num2)
            num2=num2+1;
        }
        if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
            go2('golook_room');
        }
        if(num2>num1-1){
            go2("talk结束");
            clearInterval(killchihou);
        }
        time=time+1;
        InforOutFunc("time:"+time)
    },1000*5)
}
//********************************************************//
//********************************************************//
//********************自动开脉****************************//
//********************************************************//
//********************************************************//
//商曲穴***
function shangquXUE1(){
    go2("jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;ask tangmen_madam;ask tangmen_madam;fight tangmen_madam;");
    go2("jh 21;nw;w;w;nw;n;n;n;n;n;ask baituo_li;ask baituo_li;");
}
function shangquXUE2(){
    //易容妹子
    go2("jh 1;#3 w;n;yirong snow_miaoruolan;");
    //白驼继续经脉
    go2("jh 21;nw;w;w;nw;#5 n;ask baituo_li;ask baituo_li;");
    //扬州拿药
    go2("jh 5;#6 n;e;n;n;e;ask yangzhou_yangzhou_fb14;ask yangzhou_yangzhou_fb14;");
    //洛阳拉皮条
    go2("jh 2;#5 n;w;s;luoyang111_op1;ask luoyang_luoyang8;ask luoyang_luoyang8;#10 give luoyang_luoyang8;");
    //扬州传信
    go2("jh 5;#6 n;e;n;n;e;ask yangzhou_yangzhou_fb14;");
    //白驼给药，拿杖
    go2("jh 21;nw;w;w;nw;#5 n;ask baituo_li;ask baituo_li;ask baituo_li;give baituo_li;event_1_8579060;#3 w;#3 n;event_1_1895890;event_1_35275956;");
    //唐门给杖
    go2("jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;give tangmen_madam;");
}
//阴都穴
function yinduXUE1(){
    go2("jh 21;nw;w;w;nw;n;n;n;n;#10 ask btshan_ouyangke;#10 vip finish_big_task;jh 21;nw;w;w;nw;n;n;n;n;#10 ask btshan_ouyangke;");
}
function yinduXUE2(){
    go2("");
    go2("jh 5;#5 n;#10 ask gaibang_kongkong;#10 give gaibang_kongkong;");
    go2("jh 28;nw;nw;event_1_99917641;se;se;n;w;n;n;se;event_1_43114913;");
    go2("jh 5;#5 n;#15 give gaibang_kongkong;n;event_1_82501729;");
    go2("jh 21;nw;w;w;nw;n;n;n;n;give btshan_ouyangke;fight btshan_ouyangke;#10 ask btshan_ouyangke;");
}
//石关穴***
function shiguanXUE1(){
    //开经脉
    go2("jh 21;nw;w;w;nw;n;n;n;n;n;n;n;ask btshan_ouyangfeng;");
    //杀正派
    for(let i=0;i<3;i++){
        go2("jh 4;n;n;n;n;n;n;n;n;n;n;n;kill huashan_yue;");
        go2("jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2;");
        go2("jh 2;n;n;n;n;n;e;n;op1;kill gaibang_hong;");
        go2("jh 13;n;n;n;n;n;n;n;n;n;kill shaolin_xuan-ci;");
        go2("jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n;kill wudang_zhang;");}
    //找老毒物
    go2("jh 21;nw;w;w;nw;n;n;n;n;n;n;n;#5 ask btshan_ouyangfeng;");
    //雪婷
    go2("jh 1;ask snow_mercenary;#10 give snow_mercenary;");
}
function shiguanXUE2(){
    go2("jh 1;inn_op1;kill snow_cuiyuanji;jh 21;nw;w;w;nw;#7 n;ask btshan_ouyangfeng;#7 s;se;e;e;ne;n;n;ne;n;n;w;w;event_1_4287382;event_1_74340701;event_1_95250520;s;event_1_13015348;event_1_13015348;");
}
//通谷穴***
function tongguXUE1(){
    go2("jh 28;n;n;n;n;n;ask xingxiu_ding;home;swords report go;");
}
function tongguXUE2(){
    go2("jh 28;#5 n;ask xingxiu_ding;jh 16;#4 s;e;e;s;w;w;ask xiaoyao_suxinghe;e;w;zhenlong_qiju;zhenlong_qiju 5;zhenlong_qiju 4;zhenlong_qiju 2;zhenlong_qiju 1;zhenlong_qiju 3;#5 ask xiaoyao_suxinghe;fight xiaoyao_suxinghe;give xiaoyao_suxinghe;jh 28;#5 n;ask xingxiu_ding;");
}
//幽门穴***
function youmenXUE1(){
    go2("jh 30;n;n;ne;#3 ask gumu_yangguo;");
    //深渊
    go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 6;nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;team create;event_1_90371900;");
    //对话老者
    go2("#10 ask henshan_guguai_laozhe;stop65000;#20 escape;#20 ask henshan_guguai_laozhe;items get_store /obj/med/qnlc3;#3 give henshan_guguai_laozhe;");
}
function youmenXUE2(){
    go2("jh 30;n;n;ne;#3 give gumu_yangguo;");
    go2("jh 1;e;n;n;n;n;w;event_1_90287255 go 6;nw;nw;nw;n;ne;ne;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;team create;event_1_90371900;");
    go2("ask henshan_guguai_laozhe;fight henshan_guguai_laozhe;kill wujinshenyuan_songhou;");
}
function youmenXUE3(){
    go2("jh 30;n;n;ne;give gumu_yangguo;");
}
//大赫穴***
function daheXUE(){
    go2("jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n;#3 ask binghuo_xieshiwang;");
    go2("jh 13;e;s;s;w;w;w;ask shaolin_du-e;");
    go2("jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n;#3 ask binghuo_xieshiwang;");
    go2("jh 13;n;n;n;ask shaolin_xuan-tong;#4 n;shaolin27_op1;ask shaolin_shaolin27;w;#7 s;e;event_1_4055659;");
    go2("jh 10;w;n;n;w;w;ask wudang_xiaosong;ask wudang_xiaosong;fight wudang_xiaosong;w;#5 n;#3 e;event_1_53097344;ask wudang_chenyouliang;kill wudang_chenyouliang;s;#3 w;#3 s;s;s;e;ask wudang_xiaosong;give wudang_xiaosong;");
    go2("jh 2;#4 n;w;w;event_1_98995501;n;w;event_1_89286832;event_1_26794500;");
    go2("jh 13;n;n;n;ask shaolin_xuan-tong;");
    go2("jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n;give binghuo_xieshiwang;");
}
//巨骨穴***
function jvguXUE(){
    go2("jh 2;#5 n;e;n;op1;ask gaibang_hong;jh 23;n;n;ask meizhuang_wangxingyufu;fight meizhuang_wangxingyufu;playskill 3;playskill 4;jh 2;#5 n;e;n;op1;ask gaibang_hong;#10 vip finish_bad 1;#5 vip finish_taofan 1;jh 2;#5 n;e;n;op1;ask gaibang_hong;jh 21;nw;w;w;nw;#7 n;ask btshan_ouyangfeng;fight btshan_ouyangfeng;jh 2;#5 n;e;n;op1;ask gaibang_hong;");
}
//天髎穴***
function tianmiuXUE(){
    go2("jh 13;#12 n;w;n;get_silver;ask shaolin_dmlzh;s;s;e;#5 s;shaolin27_op1;ask shaolin_shaolin27;event_1_34680156;ask shaolin_shoujingsengren;jh 33;sw;sw;#4 s;#4 e;se;#3 e;n;ask dali_kurong;jh 26;#10 w;#10 ask lama_master;event_1_91837538;#5 ask lama_gelun;jh 30;#14 n;#5 ask taohua_huang;#4 s;nw;w;event_1_84563112;w;sw;nw;n;w;event_1_68203652;jh 26;#10 w;#10 ask lama_master;event_1_91837538;#5 ask lama_gelun;give lama_gelun;jh 13;#7 n;shaolin27_op1;event_1_34680156;give shaolin_shoujingsengren;s;w;#5 n;w;n;get_silver;ask shaolin_dmlzh;");
}
//地仓穴***
function dicangXUE(){
    go2("jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu;ask dali_duanyu;ask dali_duanyu;prev;jh 32;n;n;se;#4 n;#3 w;n;w;n;e;n;e;n;n;ask murong_wangfuren;ask murong_wangfuren;ask murong_wangfuren;jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu;ask dali_duanyu;ask dali_duanyu;nw;w;w;n;ask dali_kurong;ask dali_kurong;fight dali_kurong;jh 33;sw;sw;#14 s;fight dali_yideng;jh 33;sw;sw;#5 s;e;n;se;e;e;#3 n;ne;n;fight dali_duanzc;jh 19;#3 s;sw;s;e;n;nw;#7 n;w;w;s;fight quanzhen_wang;jh 33;sw;sw;#4 s;#4 e;se;#3 e;n;ask dali_kurong;s;e;e;se;ask dali_duanyu;jh 33;sw;sw;#5 s;e;n;se;e;e;#3 n;ne;n;ask dali_duanzc;give dali_duanzc;jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu;jh 32;n;n;se;#4 n;#3 w;n;w;n;e;n;e;n;n;ask murong_wangfuren;give murong_wangfuren;s;n;event_1_22871357;event_1_61856223;nw;w;s;se;sw;nw;nw;w;s;sw;s;event_1_25147624;jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu;jh 33;sw;sw;#5 s;e;n;se;e;e;#3 n;ne;n;ask dali_duanzc;jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu");
}
//巨髎穴***
function jvmiuXUE1x1(){
    go2("jh 14;w;#3 n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;ask tangmen_madam;jh 12;#3 n;w;n;nw;e;n;#3 ask fighter_champion;jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2;ask huashan_feng;fight huashan_feng;w;ask huashan_linghu;jh 13;#7 n;shaolin27_op1;event_1_34680156;ask shaolin_shoujingsengren;s;w;n;n;ask shaolin_xuan-ci;give shaolin_xuan-ci;s;s;shaolin27_op1;event_1_34680156;ask shaolin_shoujingsengren;jh 4;#8 n;w;w;n;ask huashan_linghu;give huashan_linghu;jh 12;#3 n;w;n;nw;e;n;give fighter_champion;jh 14;w;#3 n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;give tangmen_madam;");
}
function jvmiuXUE1x2(){
    go2("jh 14;w;#3 n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n;ask tangmen_madam;");
}
//承泣穴***
function chengqiXUE1(){
    go2("jh 13;#9 n;ask shaolin_xuan-ci;s;s;shaolin27_op1;event_1_34680156;ask shaolin_shoujingsengren;jh 5;#6 n;e;ask yangzhou_shijiueseng;event_1_90021082;give yangzhou_shijiueseng；");
}
function chengqiXUE2(){
    go2("jh 5;#6 n;e;ask yangzhou_shijiueseng;;fight yangzhou_shijiueseng;w;#3 n;w;s;event_1_29301572;event_1_49807481;jh 13;#7 n;shaolin27_op1;event_1_34680156;give shaolin_shoujingsengren;s;w;n;n;ask shaolin_xuan-ci");
}
//肩髃穴***
function jianouXUE(){
    go2("jh 30;#14 n;#5 ask taohua_huang;jh 30;yell;w;n;#5 ask taohua_shagu;n;event_1_20936381;event_1_95234061;jh 30;#14 n;#5 ask taohua_huang;give taohua_huang;jh 28;sw;#5 ask baituo_meichaofeng;nw;sw;sw;nw;nw;se;sw;#5 ask baituo_chenxuanfeng;jh 30;#14 n;#5 ask taohua_huang;jh 28;sw;kill baituo_meichaofeng;nw;sw;sw;nw;nw;se;sw;kill baituo_chenxuanfeng;jh 30;#14 n;ask taohua_huang;se;s;ask taohua_rong;vip;#5 vip finish_taofan 1;ask taohua_huang;n;nw;ask taohua_huang;");
}
//府舍穴
function fusheXUE(){
                go2('jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637');
                go2('#7 ask xiaoyao_tonglao');//天山姥姥
                go2('jh 2;n;n;n;n;w;s;w');
                go2('#7 ask luoyang_luoyang9');//柳小花
                go2('jh 7;s;#100 event_1_89798265;');
                go2('jh 2;n;n;n;n;w;s;w;#7 ask luoyang_luoyang9');//柳小花
                go2('items get_store /obj/shop/box2;items get_store /obj/shop/huangjin_key;');
                go2('#2 give luoyang_luoyang9;');//柳小花
                go2('jh 15;s;s;w;n;#2 ask qingcheng_mboss;give qingcheng_mboss');
                go2('jh 2;n;n;n;n;w;s;w;#7 ask luoyang_luoyang9');//柳小花
                go2('event_1_46098066;#3 ask luoyang_limeinv');//李美女
                go2('give luoyang_limeinv;event_1_34838172;ask luoyang_limeinv;give luoyang_limeinv;event_1_50586885');//柳小花
                go2('jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;')
                go2("#5 ask xiaoyao_tonglao");
}
//大横穴event_1_38333366
function dahengXUE1(){
    go2("jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;ask xiaoyao_xiaoyaozi;fight xiaoyao_xiaoyaozi;");
    go2("jh 22;n;n;w;#5 n;e;n;event_1_75701369");
}
function dahengXUE2(){
    go2("jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;ask xiaoyao_xiaoyaozi;");
    go2("jh 22;n;n;w;#5 n;e;n;yirong songshan_songshan14;#7 n;ask songshan_songshan30;");
    go2("s;ask songshan_songshan29;e;ask songshan_songshan9;w;n;ask songshan_songshan30;get_silver;feiyue;open_jiguan 1;w;#8 s;w;#5 s;#5 ask songshan_songshan4;");
    go2("jh 1;e;#4 n;e;shop xf_buy xf_shop14;");
    go2("jh 22;n;n;w;give songshan_songshan4;#5 n;e;#8 n;get_silver;feiyue;open_jiguan 2;open_jiguan 4;open_jiguan 8;open_jiguan 6;open_jiguan 4;fight songshan_songshan30;");
    go2("jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;give xiaoyao_xiaoyaozi;");
}
//腹哀穴***
function fuaiXUE(){
    go2("jh 16;#4 s;e;e;s;w;#5 ask xiaoyao_wulingjun;");
    go2("jh 17;n;e;s;#5 ask kaifeng_kaifeng3;n;#5 ask kaifeng_kaifeng19;");
    go2("jh 17;n;n;e;e;#5 ask kaifeng_kaifeng7;w;w;s;e;#5 ask kaifeng_kaifeng19;");
    go2("jh 17;n;n;w;n;#5 ask kaifeng_kaifeng20;#2 give kaifeng_kaifeng20;");
    go2("jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1;kill kaifeng_qishatangzongduozhu;");
    go2("jh 17;n;e;s;give kaifeng_kaifeng3;");
    go2("jh 16;#4 s;e;e;s;w;ask xiaoyao_wulingjun;");
}
//天突穴***
function sayheiyi(){
    var n="地振高冈,一派溪山千古秀;门朝大海,三合河水万年流。";
    clickButton('go_chat');
    clickButton('go_chat say');
    $('#chat_msg').val(n);
    clickButton('send_chat');
    clickButton('quit_chat');
    setTimeout(tiantuXUE2(),3000)
}
function tiantuXUE1(){

    go2("jh 18;n;nw;#5 n;ne;#9 n;e;#5 ask mingjiao_shiwang;");
    go2("jh 18;w;#5 ask mingjiao_woman;");
    go2("jh 18;n;nw;n;n;w;#5 ask mingjiao_singing;fight mingjiao_singing;");
    go2("jh 18;n;nw;#5 n;ne;#12 n;#5 ask mingjiao_xiaozhao;n;event_1_90080676;event_1_56007071;ne;n;nw;#5 ask mingjiao_mengmianren;say 地振高冈,一派溪山千古秀;门朝大海,三合河水万年流。");
    setTimeout(sayheiyi(),3000)
}
function tiantuXUE2(){
    go2("#5 ask mingjiao_mengmianren;");
    go2("jh 18;n;nw;#5 n;ne;#9 n;e;ask mingjiao_shiwang;give mingjiao_shiwang");
}
function tiantuXUE3(){
    go2("jh 18;n;nw;#5 n;ne;#13 n;event_1_90080676;event_1_56007071;ne;n;nw;#5 ask mingjiao_mengmianren;");
    go2("event_1_49811328;event_1_86449371;event_1_66983665;e;s;s;ask mingjiao_mengmianrentoumu;kill mingjiao_mengmianrentoumu;#3 s;e;ask shanya_yuanzhenheshang;kill shanya_yuanzhenheshang");
    go2("jh 18;n;nw;#5 n;ne;#9 n;e;#5 ask mingjiao_shiwang;");
}
//廉泉穴***
function lianquanXUE(){
    go2("jh 32;n;n;se;#4 n;w;w;n;ask murong_murongfu;");
    go2("jh 33;sw;sw;#4 s;w;w;n;se;ask dali_duanyanqing;fight dali_duanyanqing;ask dali_duanyanqing;give dali_duanyanqing;ask dali_duanyanqing;");
    go2("vip;vip finish_taofan 2;ask dali_duanyanqing;give dali_duanyanqing;");
    go2("jh 32;n;n;se;#4 n;w;w;n;ask murong_murongfu;");
}
//期门穴***
function qimenXUE1(){
    go2("jh 8;w;nw;#4 n;e;e;n;n;e;kill emei_shoushan;n;kill emei_wenyue;#3 n;w;#9 n;ne;ne;n;ask houshan_miejue;");
    go2("jh 28;sw;ask baituo_meichaofeng;ask baituo_meichaofeng;jh 28;n;#4 w;ask xingxiu_zhounvxia;");
}
function qimenXUE2(){
    go2("jh 28;n;#4 w;ask xingxiu_zhounvxia;");
    go2("jh 8;w;nw;#4 n;e;e;n;n;e;kill emei_shoushan;n;kill emei_wenyue;#3 n;w;#9 n;ne;ne;n;ask houshan_miejue;");
    go2("jh 28;n;#4 w;ask xingxiu_zhounvxia;");
    go2("jh 28;sw;ask baituo_meichaofeng;");
    go2("jh 17;n;n;ask kaifeng_kaifeng4;give kaifeng_kaifeng4;jh 28;n;#4 w;yirong xingxiu_zhounvxia;jh 17;n;n;ask kaifeng_kaifeng4;");
}
function qimenXUE3(){
   go2("jh 17;event_1_97081006;s;s;s;s;s;w;");
}
//五枢穴***
function wushuXUE(){
    go2("jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2;ask huashan_feng;fight huashan_feng;w;s;e;e;#3 n;ask huashan_yue;#3 s;w;w;n;ask huashan_linghu;s;e;e;#4 n;e;s;ask huashan_huashan21;");
    go2("jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;ask qingcheng_masteryu;ask qingcheng_masteryu;kill qingcheng_masteryu;");
    go2("jh 15;#6 s;w;ask qingcheng_mudaoren;kill qingcheng_mudaoren;");
    go2("jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s;give huashan_huashan21;give huashan_huashan21;n;w;#3 s;e;#5 n;fight huashan_xiaolinzi;#5 s;w;s;w;w;n;get_xiangnang2;ask huashan_feng;");
}
//维道穴***
function weidaoXUE1(){
    go2("jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n;ask wudang_zhang;ask wudang_zhang;#4 s;ask wudang_song;ask wudang_song;n;ask wudang_yu;ask wudang_yu;give wudang_yu;give wudang_yu;");
}
function weidaoXUE2(){
    go2("jh 10;w;n;n;w;w;w;n;n;n;n;n;n;ask wudang_yu;s;#4 e;fight wudang_yuerxia;");
    go2("#4 w;n;#3 n;ask wudang_zhang;");
    go2("jh 17;event_1_97081006;#5 s;w;w;kill kaifeng_hefalaoren;");
    go2("jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n;ask wudang_zhang;#3 s;give wudang_yu;#3 n;ask wudang_zhang;");
}
//居髎穴
function jvmiuXUE1(){
    go2("jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;#5 ask tieflag_master;#5 vip finish_bad 1;#5 ask tieflag_master;");
    go2("jh 1;e;#4 n;e;#5 ask snow_chefu;");
    go2("jh 1;#5 ask snow_waiter;#2 give snow_waiter;");
}
function jvmiuXUE2(){
    go2("jh 1;inn_op1;ask snow_shenminanzi;kill snow_shenminanzi;");
    go2("jh 1;e;#4 n;e;give snow_chefu;kaowen;kaowen 4;kaowen 5;kaowen 2;kaowen 6;kaowen 1;kaowen 3;#10 vip finish_dig;");
    go2("jh 24;#12 n;w;#4 n;e;ask taishan_tieeren;kill taishan_tieeren;jh 25;#4 e;s;yell;s;e;event_1_81629028;give tieflag_master;");
}
//外枢穴***
function waishuXUE1(){
    go2("jh 7;s;s;s;buy /obj/example/dumpling_N_10 from choyin_dumpling_seller;jh 5;n;n;n;n;n;w;ask gumu_limochou;jh 17;#4 n;ask kaifeng_kaifeng25;#5 give kaifeng_kaifeng25;n;e;n;event_1_19768361;n;ask kaifeng_kaifeng28;n;event_1_27702191;ask kaifeng_kaifeng30;jh 2;#4 n;e;buy /map/luoyang/obj/huajuan from luoyang_luoyang12;jh 17;#3 n;e;#5 ask kaifeng_kaifeng10;#5 give kaifeng_kaifeng10;#5 ask kaifeng_kaifeng10;");
}
function waishuXUE2(){
    go2("jh 17;#3 n;e;ask kaifeng_kaifeng10;w;n;n;e;#3 n;event_1_27702191;ask kaifeng_kaifeng30;give kaifeng_kaifeng30;w;#3 s;kill kaifeng_kaifeng12;jh 17;n;n;e;s;s;s;s;w;kill kaifeng_kaifeng17;jh 5;n;n;n;n;n;w;ask gumu_limochou;");
}
//京门穴***
function jingmenXUE1(){
    go2("jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;jh 35;nw;nw;nw;n;ne;nw;w;nw;#5 e;se;s;se;w;nw;#6 s;w;w;n;e;n;w;w;s;s;#5 ask binghuo_zhangwuxia;jh 5;#9 n;w;w;n;ask yangzhou_yangzhou26;#2 n;w;n;event_1_75353509;ask binghuo_yuanzhen;fight binghuo_yuanzhen;jh 35;nw;nw;nw;n;ne;nw;w;nw;#5 e;se;s;se;w;nw;#6 s;w;w;n;e;n;w;w;s;s;#5 ask binghuo_zhangwuxia;jh 28;;n;#4 w;n;w;open_jiguan;open_jiguan 6;open_jiguan 2;open_jiguan 7;open_jiguan 3;open_jiguan 1;open_jiguan 5;kill xingxiu_qianfuzhang;event_1_29427375;event_1_84441582;event_1_56967533;event_1_56967533;event_1_84441582;e;e;s;w;w;s;e;e;s;#3 w;#4 n;kill dixiamigong_ruyangwang;event_1_47178532;jh 35;nw;nw;nw;n;ne;nw;w;nw;#5 e;se;s;se;w;nw;#6 s;w;w;n;e;n;w;w;s;s;#5 ask binghuo_zhangwuxia;jh 30;#14 n;ask taohua_huang;items get_store /obj/med/qnzz3;give taohua_huang;");
}
function jingmenXUE2(){
    go2("jh 30;#14 n;ask taohua_huang;jh 35;nw;nw;nw;n;ne;nw;w;nw;#5 e;se;s;se;w;nw;#6 s;w;w;n;e;n;w;w;s;s;#5 ask binghuo_zhangwuxia;give binghuo_zhangwuxia;jh 18;n;nw;#5 n;ne;#10 n;jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;");
}
//脾俞穴***
function piyuXUE1(){
    go2("jh 20;w;w;s;e;#5 s;sw;sw;#4 s;e;e;event_1_3723773;se;n;e;s;e;s;e;ask gumu_lin;");
}
function piyuXUE2(){
    go2("jh 20;w;w;s;e;#5 s;sw;sw;#4 s;e;e;event_1_3723773;se;n;e;s;e;s;e;ask gumu_lin;");
    go2("jh 19;#3 s;sw;s;e;n;nw;#7 n;w;w;s;give quanzhen_wang;ask quanzhen_wang;");
    go2("jh 20;w;w;s;e;#5 s;sw;sw;#4 s;e;e;event_1_3723773;se;n;e;s;e;s;e;ask gumu_lin;;give gumu_lin;");
    go2("jh 19;#3 s;sw;s;e;n;nw;#5 n;kill quanzhen_yin;s;kill quanzhen_cheng;#3 n;kill quanzhen_qiu;#4 w;#4 n;e;s;kill quanzhen_wantong;");
    go2("jh 19;#3 s;sw;s;e;n;nw;#7 n;w;w;s;give quanzhen_wang;ask quanzhen_wang;");
    go2("fight quanzhen_wang;jh 20;w;w;s;e;#5 s;sw;sw;#4 s;e;e;event_1_3723773;se;n;e;s;e;s;e;ask gumu_lin;jh 2;#4 n;w;s;#5 ask luoyang_hongniang;give luoyang_hongniang;");
    go2("jh 20;w;w;s;e;#5 s;sw;sw;#4 s;e;e;event_1_3723773;se;n;e;s;e;s;e;ask gumu_lin;shop money_buy mny_shop5_N_10;#5 give gumu_lin;#5 ask gumu_lin;");
}
//照海穴***
function zhaohaiXUE1(){
    go2("jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;ask mingjiao_zhang;fight mingjiao_zhang;ask mingjiao_zhang;#3 n;event_1_90080676;event_1_56007071;ne;n;event_1_79261758;event_1_67718844;jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;jh 1;e;n;n;w;;ask snow_smith;jh 28;nw;event_1_23998414;sw;ask xingxiu_xiyutiejiang;give xingxiu_xiyutiejiang;");
}
function zhaohaiXUE2(){
    go2("jh 28;nw;sw;ask xingxiu_xiyutiejiang;");
    go2("jh 18;n;nw;#5 n;ne;#10 n;#3 n;event_1_90080676;event_1_56007071;ne;n;event_1_79261758;event_1_67718844;");
    go2("kill mingjiao_kuilei;event_1_63559635;jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;");
    go2("jh 28;nw;sw;ask xingxiu_xiyutiejiang;kill xingxiu_xiyutiejiang;");
    go2("jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;");
}
//关元穴***
function guanyuanXUE1(){
    go2("jh 28;sw;ask baituo_meichaofeng;jh 28;#5 n;ask xingxiu_ding;fight xingxiu_ding;event_1_87377529;ask xingxiu_ding;jh 33;sw;sw;#3 s;nw;n;nw;#5 n;event_1_8709344;kill dali_dumayi;get corpse808288;n;kill dali_duqingwa;get corpse7414221;w;kill dali_duwugong;get corpse1294282;e;n;kill dali_duxiezi;get corpse8407082;s;e;kill dali_duzhizhu;get corpse6198816;jh 28;sw;give baituo_meichaofeng;jh 30;#14 n;ask taohua_huang;fight taohua_huang;playskill 2;#4 s;nw;w;event_1_84563112;w;sw;nw;n;w;event_1_68203652;jh 28;sw;give baituo_meichaofeng;");
}
function guanyuanXUE2(){
    go2("jh 28;sw;ask baituo_meichaofeng;");
}
//血海穴***
function xuehaiXUE1(){
    go2("jh 25;#4 e;s;yell;s;e;event_1_81629028;s;e;n;w;w;ask tieflag_yedi;jh 15;#9 s;e;s;#5 ask qingcheng_beijianlaoren;event_1_69635266;ask qingcheng_beijianlaoren;fight qingcheng_beijianlaoren;jh 34;ne;#5 e;#3 n;#3 w;n;n;yell;#6 n;e;e;event_1_10251226;fight duanjian_feng;jh 15;#9 s;e;s;ask qingcheng_beijianlaoren;give qingcheng_beijianlaoren;jh 25;#4 e;s;yell;s;e;event_1_81629028;s;e;n;w;w;give tieflag_yedi;");
}
function xuehaiXUE2(){
    go2("jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;#5 ask tieflag_yedi;");
}
//交信穴***
function jiaoxinXUE1(){
    go2("jh 28;sw;nw;sw;sw;nw;nw;se;sw;ask baituo_chenxuanfeng;jh 25;#3 e;#5 ask tieflag_fishman;e;s;event_1_69816506;jh 28;sw;nw;sw;sw;nw;nw;se;sw;give baituo_chenxuanfeng;#5 ask baituo_chenxuanfeng;jh 1;e;n;n;w;#5 ask snow_smith;jh 34;ne;#5 e;#3 n;#3 w;n;n;yell;#8 n;event_1_38240031;event_1_42474908;jh 1;e;n;n;w;give snow_smith;");
}
function jiaoxinXUE2(){
    go2("jh 1;e;n;n;w;;ask snow_smith;jh 28;sw;nw;sw;sw;nw;nw;se;sw;give baituo_chenxuanfeng");
}
//晴明穴***
function qingmingXUE(){
    go2("jh 12;#3 n;w;n;nw;e;n;#5 ask fighter_champion;fight fighter_champion;#5 ask fighter_champion;");
    go2("jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu;");
    go2("jh 33;sw;sw;#5 s;e;n;se;e;e;ask dali_duanwangfei;golook_room;#3 n;ne;n;fight dali_duanzc;s;sw;#3 s;ask dali_duanwangfei;");
    go2("jh 33;sw;sw;#4 s;#4 e;se;s;#3 e;ne;ask dali_duanyu;");
    go2("jh 18;n;nw;#5 n;ne;#10 n;#3 ask mingjiao_zhang;fight mingjiao_zhang;");
    go2("jh 31;#3 n;event_1_72916663;se;event_1_2274020;");
    go2("jh 12;#3 n;w;n;nw;e;n;give fighter_champion;");
}
//中极穴***
function zhongjiXUE1(){
    go2("jh 19;#3 s;sw;s;e;n;nw;#7 n;w;w;s;ask quanzhen_wang;jh 21;nw;w;w;nw;#7 n;kill btshan_ouyangfeng;jh 19;#3 s;sw;s;e;n;nw;#7 n;w;w;s;ask quanzhen_wang;jh 19;#3 s;sw;s;e;n;nw;#9 n;w;w;n;ask quanzhen_wantong;caidengmi;");
}
function zhongjiXUE2(){
    go2("ask quanzhen_wantong;jh 19;#3 s;sw;s;e;n;nw;#7 n;w;w;s;ask quanzhen_wang;jh 28;#5 n;ask xingxiu_ding;jh 33;sw;sw;#3 s;nw;n;nw;#5 n;event_1_8709344;kill dali_dumayi;n;e;kill dali_duqingwa;e;kill dali_duzhizhu;e;e;ask dali_yingpopo");
}
function zhongjiXUE3(){
    go2("jh 19;#3 s;sw;s;e;n;nw;#9 n;w;w;n;ask quanzhen_wantong;jh 2;#6 n;w;ask luoyang_luoyang5;#10 vip finish_bad 1;ask luoyang_luoyang5;");
}
//承灵穴***
function chenglingXUE(){
    go2("jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;mst船夫;;;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w;ask heimuya_dfbb;e;s;#3 w;s;n;s;ask heimuya_yanglianting;#6 s;e;n;kill heimuya_fanren1;s;s;kill heimuya_fanren1;n;e;n;kill heimuya_fanren1;s;s;kill heimuya_fanren1;n;e;n;kill heimuya_fanren2;s;s;kill heimuya_fanren2;n;e;n;s;s;n;e;n;kill heimuya_fanren4;s;s;kill heimuya_fanren4;n;#5 w;#6 n;ask heimuya_yanglianting;n;event_1_57107759;e;e;n;w;ask heimuya_dfbb;e;s;#3 w;s;n;s;give heimuya_yanglianting;ask heimuya_yanglianting;jh 23;#10 n;w;n;kill meizhuang_meizhuang10;mst春雷;;;s;e;#3 s;w;w;kill meizhuang_meizhuang3;jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;mst船夫;;;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;ask heimuya_yanglianting;n;event_1_57107759;e;e;n;w;ask heimuya_dfbb;give heimuya_dfbb;#5 ask heimuya_dfbb;give heimuya_dfbb;");
}
//脑空穴***
function naokongXUE(){
    go2("jh 12;#3 n;w;n;nw;e;n;ask fighter_champion;fight fighter_champion;playskill 2;playskill 3;ask fighter_champion;jh 18;n;nw;#5 n;ne;#9 n;e;kill mingjiao_shiwang;jh 12;#3 n;w;n;nw;e;n;#3 ask fighter_champion;jh 33;sw;sw;#14 s;ask dali_yideng;jh 12;#3 n;w;n;nw;e;n;ask fighter_champion;jh 33;sw;sw;#14 s;ask dali_yideng;ask dali_yideng;jh 16;#4 s;e;e;s;w;w;ask xiaoyao_suxinghe;ask xiaoyao_suxinghe;ask xiaoyao_suxinghe;dati;dati 1;dati 0;");
}
//风池穴***
function fengchiXUE(){
    go2("jh 15;#6 s;w;#5 ask qingcheng_mudaoren;jh 4;#8 n;w;w;n;get_xiangnang2;fight huashan_feng;jh 15;#6 s;w;#5 ask qingcheng_mudaoren;jh 27;ne;nw;w;nw;w;w;kill heimuya_shaogong;mst船夫;;;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w;#5 ask heimuya_dfbb;fight heimuya_dfbb;#5 ask heimuya_dfbb;jh 15;#6 s;w;#5 ask qingcheng_mudaoren;give qingcheng_mudaoren;#5 ask qingcheng_mudaoren;fb 3;w;kill beidou_beidou1;e;s;kill beidou_beidou4;n;e;kill beidou_beidou5;event_1_9777898;fight beidou_beidou7;jh 15;#6 s;w;#5 ask qingcheng_mudaoren;event_1_90021978;mijing_wb;event_1_97878928;nw;n;n;e;kill liandanshi_liandanshi;");
}
//风府穴
function fengfuXUE1(){//找天师
    go2("jh 29;n;n;n;n;");
    setTimeout(findtianshi2(),4000);
}
function fengfuXUE2(){
    go2("ask taoist_zhangtianshi;jh 3;#3 s;kill huashancun_heigou;stop1000;mst黑狗;jh 7;event_1_57435070;kill choyin_ghost;talk挂循环杀再杀四次，然后找天师。");
}
function fengfuXUE3(){
    go2("ask taoist_zhangtianshi;");
    go2("jh 7;s;s;s;s;s;s;s;sw;w;ask choyin_crone;e;ne;#3 n;event_1_65599392;ask choyin_shadow;ask choyin_shadow;ne;#3 s;sw;w;ask choyin_crone;");
    go2("jh 19;#3 s;sw;s;e;n;nw;#7 n;ask quanzhen_qiu;");
    go2("jh 1;e;#4 n;e;shop xf_buy xf_shop24;");
    go2("jh 28;n;n;s;#3 w;e;");

}
function fengfuXUE4(){
    go2("jh 19;#3 s;sw;s;e;n;nw;#7 n;#6 give quanzhen_qiu;ask quanzhen_qiu;");

}
//哑门穴***
function yamenXUE(){
    go2("jh 30;#14 n;ask taohua_huang;se;s;ask taohua_rong;ask taohua_rong;jh 2;#5 n;e;n;op1;ask gaibang_hong;jh 1;buy snow_waiter;buyinfo 4;buy /obj/example/chicken_leg from snow_waiter;buy /obj/example/chicken_leg from snow_waiter;buy /obj/example/chicken_leg from snow_waiter;buy /obj/example/chicken_leg from snow_waiter;buy /obj/example/chicken_leg from snow_waiter;jh 2;#5 n;e;n;op1;give gaibang_hong;jh 30;#14 n;se;s;ask taohua_rong;n;nw;ask taohua_huang;jh 21;nw;w;w;nw;#4 n;kill btshan_ouyangke;jh 30;#14 n;ask taohua_huang;");
}
//阳交穴***
function yangjiaoXUE(){
    go2("jh 15;#3 s;#5 w;n;#5 ask qingcheng_lin;");
    go2("jh 4;#11 n;#5 ask huashan_yue;give huashan_yue;");
    go2("jh 15;#3 s;#5 w;n;#5 ask qingcheng_lin;");
    go2("jh 4;#8 n;w;s;#5 ask huashan_yueling;");
    go2("jh 15;#3 s;#5 w;n;#5 ask qingcheng_lin;");
    go2("jh 4;#8 n;w;s;give huashan_yueling;ask huashan_yueling;");
    go2("jh 15;#3 s;#5 w;n;ask qingcheng_lin;");
    go2("jh 4;#13 n;get_silver;ask huashan_ning;");
    go2("jh 15;#3 s;#5 w;n;ask qingcheng_lin;");
}
//********************************************************//
//********************************************************//
//********************自动开脉结束************************//
//********************************************************//
//********************************************************//

//********************************************************//
//********************************************************//
//**********************经脉监听*************-************//
//********************************************************//
//********************************************************//

triggers.newTrigger(/你的八荒功已臻化境无人能及，前往江湖与有缘人会面，开展奇遇历练后即可打通阴维脉之府舍穴/, function(m) {
    go2('jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637');
    go2('#7 ask xiaoyao_tonglao');//天山姥姥
}, "jingmai3-1", "");
triggers.newTrigger(/童冰烟说道：你的八荒功非比寻常，想必是我逍遥派之人/, function(m) {
    go2('jh 2;n;n;n;n;w;s;w');
    go2('#7 ask luoyang_luoyang9');//柳小花
}, "jingmai3-1", "");
triggers.newTrigger(/柳小花说道：瞧瞧你现在的样子，我家主人可看不上你哦/, function(m) {
    go2('jh 7;s;#100 event_1_89798265;');
    go2('jh 2;n;n;n;n;w;s;w;#7 ask luoyang_luoyang9');//柳小花
}, "jingmai3-1", "");
triggers.newTrigger(/柳小花说道：你也是想与我家主人共饮风月是吧/, function(m) {
    go2('items get_store /obj/shop/box2;items get_store /obj/shop/huangjin_key;');
    go2('#2 give luoyang_luoyang9;');//柳小花
}, "jingmai3-1", "");
triggers.newTrigger(/柳小花说道：这位公子，你真有眼光，我家主人很是喜欢，但想与我家主人共饮还需美酒，你去江湖上准备妥当再来吧/, function(m) {
    go2('jh 15;s;s;w;n;#2 ask qingcheng_mboss;give qingcheng_mboss');
}, "jingmai3-1", "");
triggers.newTrigger(/获得花月红/, function(m) {
    go2('jh 2;n;n;n;n;w;s;w;#7 ask luoyang_luoyang9');//柳小花
}, "jingmai3-1", "");
triggers.newTrigger(/柳小花说道：哎哟，这位公子这么快就买回美酒佳肴，我家主人也是久候多时了。这边请吧/, function(m) {
    go2('event_1_46098066;#3 ask luoyang_limeinv');//李美女
}, "jingmai3-1", "");
triggers.newTrigger(/李美女说道：这位官人，咱们素昧平生，先来痛饮数杯拉近彼此的距离吧/, function(m) {
    go2('give luoyang_limeinv;vent_1_34838172;ask luoyang_limeinv;give luoyang_limeinv;event_1_50586885');//柳小花
}, "jingmai3-1", "");
triggers.newTrigger(/你摸出一捆绳子，将李美女绑个结实，一把扛在肩膀上/, function(m) {
    go2('jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637');//柳小花
    go2("#5 ask xiaoyao_tonglao");
}, "jingmai3-1", "");
triggers.newTrigger(/获得府舍丹/, function(m) {
    waizhuan_close()
}, "jingmai3-1", "");
//********************************************************//
//********************************************************//
//********************监听结束****************************//
//********************************************************//
//********************************************************//
function daiduifb10(){
    go2("fb 10;event_1_23348240;kill sizhanguangmingding_hongshuiqijiang;fb 10;event_1_84015482;kill sizhanguangmingding_ruijinqijiang;fb 10;event_1_25800358;kill sizhanguangmingding_houtuqijiang;prev;golook_room;event_1_24864938;kill sizhanguangmingding_hetaichong;fb 10;event_1_84015482;event_1_5916858;kill sizhanguangmingding_liehuoqijiang;event_1_5376728;kill sizhanguangmingding_miejueshitai;event_1_43541317;kill sizhanguangmingding_shaolinzhanglao;");
}

//测试
var ceshi=function(b){

}
//奇侠检测
function checkqixia(){
            var qixialist={};
            var i=0;
            var qixia=['玄月研','宇文无敌','风无痕','厉沧若','夏岳卿','妙无心','巫夜姬','烈九州','穆妙羽','李玄霸','八部龙将','狼居胥','庞统','王蓉','风南','李宇飞','步惊鸿','浪唤雨','逆风舞','火云邪神','郭济','狐苍雁','护竺','风行骓','吴缜'];
            var f1,f2,ff;
            f1="javascript:clickButton('find_task_road qixia ";
            f2="', 0);"
            // 获取所有带有href属性的元素
            const links = document.querySelectorAll('a[href]');
            // 定义一个用于存储结果的对象
            var cc="";
            // 遍历所有链接
            links.forEach((link) => {
                // 获取href属性值
                const href = link.getAttribute('href');
                ff=String(href);
                ff=remove(ff,f1);
                ff=remove(ff,f2);
                // 获取显示名（链接文本内容）
                const text = link.textContent.trim();
                if(qixia.includes(text)){
                    //设置奇侠id
                    qixialist[text]=ff;
                }
            });
    return qixialist;
}
function findqx(b){
    const findqixia=checkqixia();
    var n=findqixia[b]
    return n;
}










