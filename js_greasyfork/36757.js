// ==UserScript==
// @name         新每日任务
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.yytou.cn/*
// @exclude      http://res.yytou.cn/*
// @exclude      http://sword.mud.yytou.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36757/%E6%96%B0%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/36757/%E6%96%B0%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==
var btnList = {};       // 按钮列表
var buttonWidth = '70px';   // 按钮宽度
var buttonHeight = '20px';  // 按钮高度
var currentPos = 50;        // 当前按钮距离顶端高度，初始130
var delta = 25;                 // 每个按钮间隔

//-------------------------分割线-----------

mySkillLists = "九天龙吟剑法;排云掌法";

//-------------------------分割线-----------

function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}

function createButton(btnName,func){
    btnList[btnName]=document.createElement('button');
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '0px';
    myBtn.style.top = currentPos + 'px';
    currentPos = currentPos + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);

    // 按钮加入窗体中
    document.body.appendChild(myBtn);
}

//-------------------------分割线-----------



var isDelayCmd = 1, // 是否延迟命令
    cmdCache = [],      // 命令池
    timeCmd = null,     // 定时器句柄
    cmdDelayTime = 200; // 命令延迟时间

// 执行命令串
function go(str) {
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
    var cmd=cmdCache.shift();
    var arr=cmd.split(",");
    if(!sock) {
        return;
    }
    clickButton(arr[0]);
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
}


/*test:
go("jh 1;e;n;n");go("jh 2;n;n;n")
*/




//-------------------------分割线-----------

createButton('回主页',GoHomeFunc);

//回主页-------------------------
function GoHomeFunc(){
    go('home');     //回主页
}

//-------------------------分割线-----------

createButton('自动战斗',AutoKillFunc);

//自动战斗--------------------------
function AutoKillFunc(){
    if(btnList["自动战斗"].innerText  == '自动战斗'){
        AutoKill1Func();
        btnList["自动战斗"].innerText  = '手动战斗';}
    else{
         clearKill2();
         {btnList["自动战斗"].innerText  = '自动战斗';}
    }

    function AutoKill1Func(){
        // 间隔500毫秒查找比试一次
        AutoKill1FuncIntervalFunc = setInterval(AutoKill1,500);
    }

    function clearKill2(){
        clearInterval(AutoKill1FuncIntervalFunc);
    }

    function AutoKill1(){
        // ninesword();
        if($('#skill_1').length == 0){
            return;
        }
        var skillArr = mySkillLists.split('；');
        var skillIdA = ['1','2','3','4'];
        var clickSkillSwitch = false;
        $.each(skillArr, function(index, val){
            var skillName = val;

            for(var i = 0; i<skillIdA.length; i++){
                var btnNum = skillIdA[i];
                var btn = $('#skill_'+btnNum);
                var btnName = btn.text();

                if(btnName == skillName){
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        })
        if($('span.outbig_text:contains(战斗结束)').length>0){
            go('prev_combat');
        }
        if(!clickSkillSwitch){
            clickButton('playskill 1');
        }
    }
}

//-------------------------分割线-----------

createButton('签到',CheckInFunc);

// 签到--------------------------------------------------------
function CheckInFunc(){
    go('vip drops');//领通勤
    go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;');//10次暴击
    go('vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig');//挖宝
    go('vip finish_fb dulongzhai;vip finish_fb dulongzhai;vip finish_fb junying;vip finish_fb junying;vip finish_fb beidou;vip finish_fb beidou;vip finish_fb youling;vip finish_fb youling');//副本扫荡
    go('sort;sort fetch_reward;');//排行榜奖励
    go('shop money_buy shop1_N_10;home;');//买引路蜂10个
    go('exercise stop;exercise;');//打坐
    go("share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;");//分享
    go('cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;');//闯楼奖励
    go('jh 5;n;n;n;w;sign7;home;');//扬州签到
    go('jh 1;event_1_763634;home;');//雪亭立冬礼包
    go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;home;');//消费积分和谜题卡
    go("jh 1;e;n;e;e;e;e;n;lq_bysf_lb;lq_lmyh_lb;home;");//比翼双飞和劳模英豪
    go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home');//采莲
    go('jh 26;w;w;n;e;e;event_1_18075497;home');//大招采矿
    go('jh 26;w;w;n;n;event_1_14435995;home');//大招破阵
    go("jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home");//绝情谷鳄鱼
    go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
}

//-------------------------分割线-----------

createButton('战斗装',ZhuangBei);

// 换装备 -------------------------------------------------------
function ZhuangBei(){
    if(btnList["战斗装"].innerText == '战斗装')
    { console.log("切换战斗装备！");
     go('wield weapon_sb_sword10');       // 九天龙吟剑
     go('wear equip_moke_finger10');       // 斩龙戒指
     go('wear equip_moke_head10');       // 斩龙帽子
     go('wield weapon_sb_sword10');//11套剑
     go('wear equip_moke_finger10');//11套戒指
     go('wear equip_moke_head10');//11套帽子
     btnList["战斗装"].innerText = '打坐装';
    }
    else
    {console.log("切换打坐装备！");
     go('wear dream hat');       // 迷幻经纶
     go('wield sword of windspring');       // 风泉
     go('wear longyuan banzhi moke');       // 龙渊
     btnList["战斗装"].innerText = '战斗装';
    }
}
//-------------------------分割线-----------

// createButton('帮派21',bangpaiFunc);
//快速帮派---------
function bangpaiFunc(){
    alert("VIP专用\n\n请手动完成最后一个任务");
    go("heme;clan;clan scene;clan task;");
    var num  =21;
    for(var i=0; i < num; i++) { // 从第一个开始循环
        go('vip finish_clan'); //帮派
    }
    go('clan task;');//第21
}
//-------------------------分割线-----------

// createButton('师门26',shimenFunc);
//快速师门---------
function shimenFunc(){
    alert("VIP专用\n\n请手动完成最后一个任务");
    go("heme;family_quest;");
    var num  =25;
    for(var i=0; i < num; i++) { // 从第一个开始循环
        go('vip finish_family'); //师门
    }
    go('family_quest;');//第26
}
//-------------------------分割线-----------

createButton('出海',fishingFirstFunc);

// 出海----------------------------------------------------
function fishingFirstFunc(){
    console.log("开始走向冰火岛！");
    fishingFirstStage();
}
function fishingFirstStage(){
    FishingParas = 0;
    go('jh 5;n;n;n;n;n;n;n;n;n;n;ne;chuhai go');
}

//-------------------------分割线-----------

// createButton('钓鱼',fishingFunc);

//钓鱼-----------------------------------------------------
function fishingFunc(){
    resFishingParas=0;
    console.log("开始钓鱼！");
    // 到达冰火岛
    go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;e;');
    // 开始钓鱼
    setTimeout(fishIt,2000);
}
function fishIt(){
    resFishingParas = resFishingParas+1;
    if ( isContains($('span:contains(钓鱼需要)').text().slice(-17), '钓鱼需要鱼竿和鱼饵，你还没有'))
    {alert('鱼竿或鱼饵不足，停止钓鱼！');
     console.log('没有工具！钓鱼次数：%d次。',resFishingParas);}
    else if( isContains($('span:contains(整个冰湖的)').text().slice(-6), '明天再来吧。')){
        console.log('钓完了！钓鱼次数：%d次。',resFishingParas);
    }
    else{
        go('diaoyu');
        setTimeout(fishIt, 6000);
        console.log($('span:contains(突然)').text().slice(-9));}
}

//-------------------------分割线-----------

createButton('侠客日常',RiChangFunc);

//一键侠客岛--------------------
function RiChangFunc(){
    if ($('.cmd_click_room')[0] === undefined || $('.cmd_click_room')[0].innerText !== "侠客岛渡口"){
        alert("你想干嘛？快送人家回“侠客岛渡口”！");
        return;
    }
    go('e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543;w;n;e;e;s;e;event_1_44025101;');
    setTimeout(XiaKeFunc,2000);
}

// 判断出路
function XiaKeFunc(){
    if ($('span.outtitle')[0].innerText == "崖底")        // 重新跳
        XuanYaFunc();
    else if ($('span.outtitle')[0].innerText == "石门")   // 进门领悟
    {
        console.log("参悟石壁。");
        go('event_1_36230918;e;e;s;event_1_77496481;home;');
    }
    else{
        setTimeout(XiaKeFunc,2000);     // 2秒后重新检查出路
    }
}

// 重新跳崖
function XuanYaFunc(){
    console.log("姿势不对，大侠的屁股摔成了八瓣。。。");
    go('event_1_4788477;nw;w;sw;w;n;n;n;w;w;s;w;nw;ne;ne;ne;e;e;e;e;e;s;e;event_1_44025101');
    setTimeout(XiaKeFunc,2000);
    // 2秒后检查出路
}




//-------------------------分割线-----------
createButton('开答题',answerQuestionsFunc);

// 答题 ---------------------------------------------------

var answerQuestionsInterval = null;
var QuestAnsLibs = {
    "“白玉牌楼”场景是在哪个地图上？":"c",
    "“百龙山庄”场景是在哪个地图上？":"b",
    "“冰火岛”场景是在哪个地图上？":"b",
    "“常春岛渡口”场景是在哪个地图上？":"c",
    "“跪拜坪”场景是在哪个地图上？":"b",
    "“翰墨书屋”场景是在哪个地图上？":"c",
    "“花海”场景是在哪个地图上？":"a",
    "“留云馆”场景是在哪个地图上？":"b",
    "“清音居”场景是在哪个地图上？":"a",
    "“日月洞”场景是在哪个地图上？":"b",
    "“蓉香榭”场景是在哪个地图上？":"c",
    "“三清殿”场景是在哪个地图上？":"b",
    "“三清宫”场景是在哪个地图上？":"c",
    "“双鹤桥”场景是在哪个地图上？":"b",
    "“无名山脚”场景是在哪个地图上？":"d",
    "“伊犁”场景是在哪个地图上？":"b",
    "“鹰记商号”场景是在哪个地图上？":"d",
    "“迎梅客栈”场景是在哪个地图上？":"d",
    "“子午楼”场景是在哪个地图上？":"c",
    "8级的装备摹刻需要几把刻刀？":"a",
    "NPC公平子在哪一章地图？":"a",
    "vip每天不可以领取什么？":"b",
    "瑷伦在晚月庄的哪个场景？":"b",
    "安惜迩是在那个场景？":"c",
    "黯然消魂掌有多少招式？":"c",
    "黯然销魂掌是哪个门派的技能？":"a",
    "黯然销魂掌有多少招式？":"c",
    "八卦迷阵是哪个门派的阵法？":"b",
    "八卦迷阵是那个门派的阵法？":"a",
    "白金戒指可以在哪位npc那里获得？":"b",
    "白金戒指可以在哪位那里获得？":"b",
    "白金手镯可以在哪位npc那里获得？":"a",
    "白金项链可以在哪位npc那里获得？":"b",
    "白金项链可以在哪位那里获得？":"b",
    "白蟒鞭的伤害是多少？":"a",
    "白驼山第一位要拜的师傅是谁？":"a",
    "白银宝箱礼包多少元宝一个？":"d",
    "白玉牌楼场景是在哪个地图上？":"c",
    "白玉腰束是腰带类的第几级装备？":"b",
    "拜师风老前辈需要正气多少？":"b",
    "拜师老毒物需要蛤蟆功多少级？":"a",
    "拜师铁翼需要多少内力？":"b",
    "拜师小龙女需要容貌多少？":"c",
    "拜师张三丰需要多少正气？":"b",
    "包家将是哪个门派的师傅？":"a",
    "包拯在哪一章？":"d",
    "宝石合成一次需要消耗多少颗低级宝石？":"c",
    "宝玉帽可以在哪位npc那里获得？":"d",
    "宝玉帽可以在哪位那里获得？":"d",
    "宝玉鞋击杀哪个npc可以获得？":"a",
    "宝玉鞋击杀哪个可以获得？":"a",
    "宝玉鞋在哪获得？":"a",
    "暴雨梨花针的伤害是多少？":"c",
    "北斗七星阵是第几个的组队副本？":"c",
    "北冥神功是哪个门派的技能？":"b",
    "北岳殿神像后面是哪位？":"b",
    "北岳殿神像后面是哪位npc？":"b",
    "匕首加什么属性？":"c",
    "碧海潮生剑在哪位师傅处学习？":"a",
    "碧磷鞭的伤害是多少？":"b",
    "镖局保镖是挂机里的第几个任务？":"d",
    "冰魄银针的伤害是多少？":"b",
    "病维摩拳是哪个门派的技能？":"b",
    "不可保存装备下线多久会消失？":"c",
    "不属于白驼山的技能是什么？":"b",
    "仓库最多可以容纳多少种物品？":"b",
    "沧海护腰可以镶嵌几颗宝石？":"d",
    "沧海护腰是腰带类的第几级装备？":"a",
    "藏宝图在哪个npc处购买？":"b",
    "藏宝图在哪个处购买？":"b",
    "藏宝图在哪里npc那里买？":"a",
    "藏宝图在哪里那里买？":"a",
    "藏宝图在哪个NPC处购买":"a",
    "草帽可以在哪位npc那里获得？":"b",
    "成功易容成异性几次可以领取易容成就奖？":"b",
    "成长计划第七天可以领取多少元宝？":"d",
    "成长计划六天可以领取多少银两？":"d",
    "成长计划需要多少元宝方可购买？":"a",
    "城里打擂是挂机里的第几个任务？":"d",
    "跨服天剑谷是星期几举行的":"b",
    "城里抓贼是挂机里的第几个任务？":"b",
    "充值积分不可以兑换下面什么物品？":"d",
    "出生选武学世家增加什么":"a",
    "闯楼第几层可以获得称号“藏剑楼护法”？":"b",
    "闯楼第几层可以获得称号“藏剑楼楼主”？":"d",
    "闯楼第几层可以获得称号“藏剑楼长老”？":"c",
    "闯楼每多少层有称号奖励？":"a",
    "春风快意刀是哪个门派的技能？":"b",
    "春秋水色斋需要多少杀气才能进入？":"d",
    "从哪个npc处进入跨服战场？":"a",
    "从哪个处进入跨服战场？":"a",
    "摧心掌是哪个门派的技能":"a",
    "达摩在少林哪个场景？":"c",
    "达摩杖的伤害是多少？":"d",
    "打开引路蜂礼包可以得到多少引路蜂？":"b",
    "打排行榜每天可以完成多少次？":"a",
    "打土匪是挂机里的第几个任务？":"c",
    "打造刻刀需要多少个玄铁？":"a",
    "打坐增长什么属性？":"a",
    "大保险卡可以承受多少次死亡后不降技能等级？":"b",
    "大乘佛法有什么效果？":"d",
    "大旗门的修养术有哪个特殊效果？":"a",
    "大旗门的云海心法可以提升哪个属性？":"c",
    "大招寺的金刚不坏功有哪个特殊效果？":"a",
    "大招寺的铁布衫有哪个特殊效果？":"c",
    "当日最低累积充值多少元即可获得返利？":"b",
    "刀法基础在哪掉落？":"a",
    "倒乱七星步法是哪个门派的技能？":"d",
    "等级多少才能在世界频道聊天？":"c",
    "第一个副本需要多少等级才能进入？":"d",
    "貂皮斗篷是披风类的第几级装备？":"b",
    "丁老怪是哪个门派的终极师傅？":"a",
    "丁老怪在天宿海的哪个场景？":"b",
    "丁老怪在天宿海哪个场景？":"b",
    "丁老怪在星宿海的哪个场景？":"b",
    "东方教主在魔教的哪个场景？":"b",
    "斗转星移是哪个门派的技能？":"a",
    "斗转星移阵是哪个门派的阵法？":"a",
    "毒龙鞭的伤害是多少？":"a",
    "毒物阵法是哪个门派的阵法？":"b",
    "独孤求败有过几把剑？":"d",
    "独龙寨是第几个组队副本？":"a",
    "读书写字301-400级在哪里买书？":"c",
    "读书写字最高可以到多少级？":"b",
    "端茶递水是挂机里的第几个任务？":"b",
    "断云斧是哪个门派的技能？":"a",
    "锻造一把刻刀需要多少玄铁碎片锻造？":"c",
    "锻造一把刻刀需要多少银两？":"a",
    "兑换易容面具需要多少玄铁碎片？":"c",
    "多少消费积分换取黄金宝箱？":"a",
    "多少消费积分可以换取黄金钥匙？":"b",
    "翻译梵文一次多少银两？":"d",
    "方媃是哪个门派的师傅？":"b",
    "飞仙剑阵是哪个门派的阵法？":"b",
    "风老前辈在华山哪个场景？":"b",
    "风泉之剑加几点悟性？":"c",
    "风泉之剑可以在哪位npc那里获得？":"b",
    "风泉之剑可以在哪位那里获得？":"b",
    "风泉之剑在哪里获得？":"d",
    "疯魔杖的伤害是多少？":"b",
    "伏虎杖的伤害是多少？":"c",
    "副本完成后不可获得下列什么物品？":"b",
    "副本一次最多可以进几人？":"a",
    "副本有什么奖励":"d",
    "富春茶社在哪一章？":"c",
    "改名字在哪改？":"d",
    "丐帮的绝学是什么？":"a",
    "丐帮的轻功是哪个？":"b",
    "干苦力是挂机里的第几个任务？":"a",
    "钢丝甲衣可以在哪位npc那里获得？":"d",
    "钢丝甲衣可以在哪位那里获得？":"d",
    "高级乾坤再造丹加什么？":"b",
    "高级乾坤再造丹是增加什么的？":"b",
    "高级突破丹多少元宝一颗？":"d",
    "割鹿刀可以在哪位npc那里获得？":"b",
    "葛伦在大招寺的哪个场景":"b",
    "根骨能提升哪个属性？":"c",
    "功德箱捐香火钱有什么用？":"a",
    "功德箱在雪亭镇的哪个场景？":"c",
    "购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？":"b",
    "孤独求败称号需要多少论剑积分兑换？":"b",
    "孤儿出身增加什么？":"d",
    "古灯大师是哪个门派的终极师傅？":"c",
    "古灯大师在大理哪个场景？":"c",
    "古墓多少级以后才能进去？":"d",
    "挂机增长什么？":"a",
    "寒玉床睡觉修炼需要多少点内力值？":"c",
    "寒玉床睡觉一次多久？":"c",
    "寒玉床需要切割多少次？":"d",
    "寒玉床在哪里切割？":"a",
    "寒玉床在那个地图可以找到？":"a",
    "黑狗血在哪获得？":"b",
    "黑水伏蛟可以在哪位npc那里获得？":"c",
    "黑水伏蛟可以在哪位那里获得？":"c",
    "红宝石加什么属性？":"b",
    "洪帮主在洛阳哪个场景？":"c",
    "虎皮腰带是腰带类的第几级装备？":"a",
    "花不为在哪一章？":"a",
    "花花公子在哪个地图？":"a",
    "华山村王老二掉落的物品是什么？":"a",
    "华山施戴子掉落的物品是什么？":"b",
    "华山武器库从哪个NPC进？":"d",
    "黄宝石加什么属性？":"c",
    "黄岛主在桃花岛的哪个场景？":"d",
    "黄袍老道是哪个门派的师傅？":"c",
    "积分商城在雪亭镇的哪个场景？":"c",
    "技能柳家拳谁教的？":"a",
    "技能数量超过了什么消耗潜能会增加？":"b",
    "嫁衣神功是哪个门派的技能？":"b",
    "剑冢在哪个地图？":"a",
    "街头卖艺是挂机里的第几个任务？":"a",
    "金弹子的伤害是多少？":"a",
    "金刚不坏功有什么效果？":"a",
    "金刚杖的伤害是多少？":"a",
    "金戒指可以在哪位npc那里获得？":"d",
    "金手镯可以在哪位npc那里获得？":"b",
    "金丝鞋可以在哪位npc那里获得？":"b",
    "金项链可以在哪位npc那里获得？":"d",
    "金玉断云是哪个门派的阵法？":"a",
    "锦缎腰带是腰带类的第几级装备？":"a",
    "精铁棒可以在哪位npc那里获得？":"d",
    "精铁棒可以在哪位那里获得？":"d",
    "九区服务器名称？":"d",
    "九阳神功是哪个门派的技能？":"c",
    "九阴派梅师姐在星宿海哪个场景？":"a",
    "军营是第几个组队副本？":"b",
    "开通VIP月卡最低需要当天充值多少元方有购买资格？":"a",
    "可以召唤金甲伏兵助战是哪个门派？":"a",
    "客商在哪一章？":"b",
    "孔雀氅可以镶嵌几颗宝石？":"b",
    "孔雀氅是披风类的第几级装备？":"c",
    "枯荣禅功是哪个门派的技能？":"a",
    "跨服副本周六几点开启？":"a",
    "跨服是星期几举行的？":"b",
    "跨服天剑谷每周六几点开启？":"a",
    "跨服需要多少级才能进入？":"c",
    "跨服在哪个场景进入？":"c",
    "兰花拂穴手是哪个门派的技能？":"a",
    "蓝宝石加什么属性？":"a",
    "蓝止萍在哪一章？":"c",
    "蓝止萍在晚月庄哪个小地图？":"b",
    "老毒物在白驮山的哪个场景？":"b",
    "老顽童在全真教哪个场景？":"b",
    "莲花掌是哪个门派的技能？":"a",
    "烈火旗大厅是那个地图的场景？":"c",
    "烈日项链可以镶嵌几颗宝石？":"c",
    "林祖师是哪个门派的师傅？":"a",
    "灵蛇杖法是哪个门派的技能？":"c",
    "凌波微步是哪个门派的技能？":"b",
    "凌虚锁云步是哪个门派的技能？":"b",
    "领取消费积分需要寻找哪个NPC？":"c",
    "鎏金缦罗是披风类的第几级装备？":"d",
    "柳淳风在哪一章":"c",
    "柳淳风在雪亭镇哪个场景？":"b",
    "柳文君所在的位置？":"a",
    "六脉神剑是哪个门派的绝学？":"a",
    "六阴追魂剑是哪个门派的技能？":"b",
    "陆得财是哪个门派的师傅？":"c",
    "陆得财在乔阴县的哪个场景？":"a",
    "论剑每天能打几次？":"a",
    "论剑是每周星期几？":"c",
    "论剑是什么时间点正式开始？":"a",
    "论剑是星期几进行的？":"c",
    "论剑是星期几举行的？":"c",
    "论剑输一场获得多少论剑积分？":"a",
    "论剑要在晚上几点前报名？":"b",
    "论剑一次最多能突破几个技能？":"c",
    "论剑在周几进行？":"b",
    "论剑中步玄派的师傅是哪个？":"a",
    "论剑中大招寺第一个要拜的师傅是谁？":"c",
    "论剑中古墓派的终极师傅是谁？":"d",
    "论剑中花紫会的师傅是谁？":"c",
    "论剑中青城派的第一个师傅是谁？":"a",
    "论剑中青城派的终极师傅是谁？":"d",
    "论剑中逍遥派的终极师傅是谁？":"c",
    "论剑中以下不是峨嵋派技能的是哪个":"b",
    "论剑中以下不是华山派的人物的是哪个？":"d",
    "论剑中以下哪个不是大理段家的技能？":"c",
    "论剑中以下哪个不是大招寺的技能？":"b",
    "论剑中以下哪个不是峨嵋派可以拜师的师傅？":"d",
    "论剑中以下哪个不是丐帮的技能？":"d",
    "论剑中以下哪个不是丐帮的人物？":"a",
    "论剑中以下哪个不是古墓派的的技能？":"b",
    "论剑中以下哪个不是华山派的技能的？":"d",
    "论剑中以下哪个不是明教的技能？":"d",
    "论剑中以下哪个不是魔教的技能？":"a",
    "论剑中以下哪个不是魔教的人物？":"d",
    "论剑中以下哪个不是全真教的技能？":"d",
    "论剑中以下哪个不是是晚月庄的技能？":"d",
    "论剑中以下哪个不是唐门的技能？":"c",
    "论剑中以下哪个不是唐门的人物？":"c",
    "论剑中以下哪个不是铁雪山庄的技能？":"d",
    "论剑中以下哪个不是铁血大旗门的技能？":"c",
    "论剑中以下哪个不是晚月庄的技能？":"d",
    "论剑中以下哪个是大理段家的技能":"a",
    "论剑中以下哪个是大招寺的技能？":"b",
    "论剑中以下哪个是丐帮的技能？":"b",
    "论剑中以下哪个是花紫会的技能":"a",
    "论剑中以下哪个是华山派的技能的？":"a",
    "论剑中以下哪个是明教的技能？":"b",
    "论剑中以下哪个是青城派的技能？":"b",
    "论剑中以下哪个是唐门的技能？":"b",
    "论剑中以下哪个是天邪派的技能？":"b",
    "论剑中以下哪个是天邪派的人物？":"a",
    "论剑中以下哪个是铁雪山庄的技能？":"c",
    "论剑中以下哪个是铁血大旗门的技能？":"b",
    "论剑中以下哪个是铁血大旗门的师傅？":"a",
    "论剑中以下哪个是晚月庄的技能？":"a",
    "论剑中以下哪个是晚月庄的人物":"a",
    "论剑中以下是峨嵋派技能的是哪个？":"a",
    "论语在哪购买？":"a",
    "骆云舟在哪一章？":"c",
    "骆云舟在乔阴县的哪个场景？":"b",
    "落英神剑掌是哪个门派的技能？":"b",
    "吕进在哪个地图？":"a",
    "绿宝石加什么属性？":"c",
    "漫天花雨匕在哪获得？":"a",
    "茅山的绝学是什么":"b",
    "茅山的天师正道可以提升哪个属性？":"d",
    "茅山可以招几个宝宝？":"c",
    "茅山派的轻功是什么？":"b",
    "茅山天师正道可以提升什么？":"c",
    "茅山学习什么技能招宝宝？":"a",
    "茅山在哪里拜师？":"c",
    "每次合成宝石需要多少银两？":"a",
    "每个玩家最多能有多少个好友？":"b",
    "每日微信分享可以获得什么奖励？":"a",
    "每天的任务次数几点重置？":"d",
    "每天分享游戏到哪里可以获得20元宝？":"a",
    "每天能挖几次宝？":"d",
    "每天能做多少个谜题任务？":"a",
    "每天能做多少个师门任务？":"c",
    "每天微信分享能获得多少元宝？":"d",
    "每天有几次试剑？":"b",
    "每天在线多少个小时即可领取消费积分？":"b",
    "每突破一次技能有效系数加多少":"a",
    "密宗伏魔是哪个门派的阵法？":"c",
    "灭绝师太在第几章？":"c",
    "灭绝师太在峨眉山哪个场景？":"a",
    "明教的九阳神功有哪个特殊效果？":"a",
    "明月帽要多少刻刀摩刻？":"a",
    "摹刻10级的装备需要摩刻技巧多少级？":"b",
    "摹刻烈日宝链需要多少级摩刻技巧？":"c",
    "摹刻扬文需要多少把刻刀？":"a",
    "魔鞭诀在哪里学习？":"d",
    "魔教的大光明心法可以提升哪个属性？":"d",
    "莫不收在哪一章？":"a",
    "墨磷腰带是腰带类的第几级装备？":"d",
    "木道人在青城山的哪个场景？":"b",
    "慕容家主在慕容山庄的哪个场景？":"a",
    "慕容山庄的斗转星移可以提升哪个属性":"d",
    "哪个npc处可以捏脸？":"a",
    "哪个NPC掉落拆招基础？":"a",
    "哪个npc属于全真七子？":"b",
    "哪个处可以捏脸？":"a",
    "哪个分享可以获得20元宝？":"b",
    "哪个技能不是魔教的？":"d",
    "哪个门派拜师没有性别要求？":"d",
    "哪样不能获得玄铁碎片？":"c",
    "能增容貌的是下面哪个技能？":"a",
    "捏脸需要花费多少银两？":"c",
    "捏脸需要寻找哪个NPC？":"a",
    "欧阳敏是哪个门派的？":"b",
    "欧阳敏是哪个门派的师傅？":"b",
    "欧阳敏在哪一章？":"a",
    "欧阳敏在唐门的哪个场景？":"c",
    "排行榜最多可以显示多少名玩家？":"a",
    "逄义是在那个场景？":"a",
    "披星戴月是披风类的第几级装备？":"d",
    "劈雳拳套有几个镶孔？":"a",
    "霹雳掌套的伤害是多少？":"b",
    "辟邪剑法是哪个门派的绝学技能？":"a",
    "辟邪剑法在哪学习？":"b",
    "婆萝蜜多心经是哪个门派的技能？":"b",
    "七宝天岚舞是哪个门派的技能？":"d",
    "七星鞭的伤害是多少？":"c",
    "七星剑法是哪个门派的绝学？":"a",
    "棋道是哪个门派的技能？":"c",
    "千古奇侠称号需要多少论剑积分兑换？":"d",
    "乾坤大挪移属于什么类型的武功？":"a",
    "乾坤一阳指是哪个师傅教的？":"a",
    "青城派的道德经可以提升哪个属性":"c",
    "青城派的道家心法有哪个特殊效果？":"a",
    "清风寨在哪":"b",
    "清虚道长在哪一章？":"d",
    "去唐门地下通道要找谁拿钥匙？":"a",
    "全真的道家心法有哪个特殊效果？":"a",
    "全真的基本阵法有哪个特殊效果？":"b",
    "全真的双手互搏有哪个特殊效果？":"c",
    "人物背包最多可以容纳多少种物品？":"a",
    "日月神教大光明心法可以提升什么":"d",
    "如何将华山剑法从400级提升到440级？":"d",
    "如意刀是哪个门派的技能？":"c",
    "山河藏宝图需要在哪个NPC手里购买？":"d",
    "上山打猎是挂机里的第几个任务？":"c",
    "少林的混元一气功有哪个特殊效果？":"d",
    "少林的易筋经神功有哪个特殊效果？":"a",
    "蛇形刁手是哪个门派的技能？":"b",
    "什么影响打坐的速度？":"c",
    "什么影响攻击力":"d",
    "什么装备不能镶嵌黄水晶？":"d",
    "什么装备都能镶嵌的是什么宝石？":"c",
    "什么装备可以镶嵌紫水晶？":"c",
    "神雕大侠所在的地图？":"b",
    "神雕大侠在哪一章？":"a",
    "神雕侠侣的时代背景是哪个朝代？":"d",
    "神雕侠侣的作者是?":"b",
    "升级什么技能可以提升根骨？":"a",
    "生死符的伤害是多少？":"a",
    "师门磕头增加什么？":"a",
    "师门任务每天可以完成多少次？":"a",
    "师门任务每天可以做多少个？":"c",
    "师门任务什么时候更新？":"b",
    "师门任务一天能完成几次？":"d",
    "师门任务最多可以完成多少个？":"d",
    "施令威在哪个地图？":"b",
    "石师妹哪个门派的师傅？":"c",
    "使用朱果经验潜能将分别增加多少？":"a",
    "首冲重置卡需要隔多少天才能在每日充值奖励中领取？":"b",
    "首次通过桥阴县不可以获得那种奖励？":"a",
    "受赠的消费积分在哪里领取":"d",
    "兽皮鞋可以在哪位npc那里获得？":"b",
    "兽皮鞋可以在哪位那里获得？":"b",
    "树王坟在第几章节？":"c",
    "双儿在扬州的哪个小地图？":"a",
    "孙天灭是哪个门派的师傅？":"c",
    "踏雪无痕是哪个门派的技能？":"b",
    "踏云棍可以在哪位npc那里获得？":"a",
    "踏云棍可以在哪位那里获得？":"a",
    "唐门的唐门毒经有哪个特殊效果？":"a",
    "唐门密道怎么走？":"c",
    "天蚕围腰可以镶嵌几颗宝石？":"d",
    "天蚕围腰是腰带类的第几级装备？":"d",
    "天山姥姥在逍遥林的哪个场景？":"d",
    "天山折梅手是哪个门派的技能？":"c",
    "天师阵法是哪个门派的阵法？":"b",
    "天邪派在哪里拜师？":"b",
    "天羽奇剑是哪个门派的技能？":"a",
    "铁戒指可以在哪位npc那里获得？":"a",
    "铁戒指可以在哪位那里获得？":"a",
    "铁手镯可以在哪位npc那里获得？":"a",
    "铁手镯可以在哪位那里获得？":"a",
    "铁项链可以在哪位npc那里获得？":"a",
    "铁血大旗门云海心法可以提升什么？":"a",
    "通灵需要花费多少银两？":"d",
    "通灵需要寻找哪个NPC？":"c",
    "突破丹在哪里购买？":"b",
    "屠龙刀法是哪个门派的绝学技能？":"b",
    "屠龙刀是什么级别的武器？":"a",
    "挖剑冢可得什么？":"a",
    "弯月刀可以在哪位npc那里获得？":"b",
    "弯月刀可以在哪位那里获得？":"b",
    "玩家每天能够做几次正邪任务？":"c",
    "玩家想修改名字可以寻找哪个NPC？":"a",
    "晚月庄的内功是什么？":"b",
    "晚月庄的七宝天岚舞可以提升哪个属性？":"b",
    "晚月庄的小贩在下面哪个地点？":"a",
    "晚月庄七宝天岚舞可以提升什么？":"b",
    "晚月庄意寒神功可以提升什么？":"b",
    "晚月庄主线过关要求？":"a",
    "王铁匠是在那个场景？":"b",
    "王重阳是哪个门派的师傅？":"b",
    "魏无极处读书可以读到多少级？":"a",
    "魏无极身上掉落什么装备？":"c",
    "魏无极在第几章？":"a",
    "闻旗使在哪个地图？":"a",
    "乌金玄火鞭的伤害是多少？":"d",
    "乌檀木刀可以在哪位npc那里获得？":"d",
    "乌檀木刀可以在哪位那里获得？":"d",
    "钨金腰带是腰带类的第几级装备？":"d",
    "武当派的绝学技能是以下哪个？":"d",
    "武穆兵法提升到多少级才能出现战斗必刷？":"d",
    "武穆兵法通过什么学习？":"a",
    "武学世家加的什么初始属性？":"a",
    "舞中之武是哪个门派的阵法？":"b",
    "西毒蛇杖的伤害是多少？":"c",
    "吸血蝙蝠在下面哪个地图？":"a",
    "下列哪项战斗不能多个玩家一起战斗？":"a",
    "下列装备中不可摹刻的是？":"c",
    "下面哪个npc不是魔教的？":"d",
    "下面哪个不是古墓的师傅？":"d",
    "下面哪个不是门派绝学？":"d",
    "下面哪个不是魔教的？":"d",
    "下面哪个地点不是乔阴县的":"d",
    "下面哪个门派是正派？":"a",
    "下面哪个是天邪派的师傅？":"a",
    "下面有什么是寻宝不能获得的？":"c",
    "向师傅磕头可以获得什么？":"b",
    "逍遥步是哪个门派的技能？":"a",
    "逍遥林是第几章的地图？":"c",
    "逍遥林怎么弹琴可以见到天山姥姥？":"b",
    "逍遥派的绝学技能是以下哪个？":"a",
    "萧辟尘在哪一章？":"d",
    "小李飞刀的伤害是多少？":"d",
    "小龙女住的古墓是谁建造的？":"b",
    "小男孩在华山村哪里？":"a",
    "新人礼包在哪个npc处兑换？":"a",
    "新手礼包在哪里领取":"a",
    "新手礼包在哪领取？":"c",
    "需要使用什么衣服才能睡寒玉床？":"a",
    "选择孤儿会影响哪个属性？":"c",
    "选择商贾会影响哪个属性？":"b",
    "选择书香门第会影响哪个属性？":"b",
    "选择武学世家会影响哪个属性？":"a",
    "学习屠龙刀法需要多少内力？":"b",
    "雪莲有什么作用？":"a",
    "雪蕊儿是哪个门派的师傅？":"a",
    "雪蕊儿在铁雪山庄的哪个场景？":"d",
    "扬文的属性？":"a",
    "扬州询问黑狗能到下面哪个地点？":"a",
    "扬州询问黑狗子能到下面哪个地点？":"a",
    "扬州在下面哪个地点的npc处可以获得玉佩？":"c",
    "扬州在下面哪个地点的处可以获得玉佩？":"c",
    "羊毛斗篷是披风类的第几级装备？":"a",
    "阳刚之劲是哪个门派的阵法？":"c",
    "杨过小龙女分开多少年后重逢?":"c",
    "杨过在哪个地图？":"a",
    "夜行披风是披风类的第几级装备？":"a",
    "夜皇在大旗门哪个场景？":"c",
    "一个队伍最多有几个队员？":"c",
    "一天能使用元宝做几次暴击谜题？":"c",
    "一天能完成谜题任务多少个？":"b",
    "一天能完成师门任务有多少个？":"c",
    "一天能完成挑战排行榜任务多少次":"a",
    "一张分身卡的有效时间是多久？":"c",
    "一指弹在哪里领悟？":"b",
    "移开明教石板需要哪项技能到一定级别？":"a",
    "以下不是步玄派的技能的哪个？":"c",
    "以下不是天宿派师傅的是哪个？":"c",
    "以下不是晚月庄技能？":"d",
    "以下不是隐藏门派的是哪个？":"d",
    "以下哪个宝石不能镶嵌到戒指？":"c",
    "以下哪个宝石不能镶嵌到内甲？":"a",
    "以下哪个宝石不能镶嵌到披风？":"c",
    "以下哪个宝石不能镶嵌到腰带？":"c",
    "以下哪个宝石不能镶嵌到衣服？":"a",
    "以下哪个不是道尘禅师教导的武学？":"d",
    "以下哪个不是何不净教导的武学？":"c",
    "以下哪个不是慧名尊者教导的技能？":"d",
    "以下哪个不是空空儿教导的武学？":"b",
    "以下哪个不是梁师兄教导的武学？":"b",
    "以下哪个不是鲁长老教导的武学？":"d",
    "以下哪个不是论剑的皮肤？":"d",
    "以下哪个不是全真七子？":"c",
    "以下哪个不是宋首侠教导的武学？":"d",
    "以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？":"a",
    "以下哪个不是岳掌门教导的武学？":"a",
    "以下哪个不是在洛阳场景":"d",
    "以下哪个不是在雪亭镇场景":"d",
    "以下哪个不是在扬州场景？":"d",
    "以下哪个不是知客道长教导的武学？":"b",
    "以下哪个门派不是隐藏门派？":"c",
    "以下哪个门派是正派？":"d",
    "以下哪个门派是中立门派？":"a",
    "以下哪个是步玄派的祖师？":"b",
    "以下哪个是封山派的祖师？":"c",
    "以下哪个是花紫会的祖师？":"a",
    "以下哪个是晚月庄的祖师？":"d",
    "以下哪些物品不是成长计划第二天可以领取的？":"c",
    "以下哪些物品不是成长计划第三天可以领取的？":"d",
    "以下哪些物品不是成长计划第一天可以领取的？":"d",
    "以下哪些物品是成长计划第四天可以领取的？":"a",
    "以下哪些物品是成长计划第五天可以领取的？":"b",
    "以下属于邪派的门派是哪个？":"b",
    "以下属于正派的门派是哪个？":"a",
    "以下谁不精通降龙十八掌？":"d",
    "以下有哪些物品不是每日充值的奖励？":"d",
    "倚天剑加多少伤害？":"d",
    "倚天屠龙记的时代背景哪个朝代？":"a",
    "易容后保持时间是多久？":"a",
    "易容面具需要多少玄铁兑换？":"c",
    "易容术多少级才可以易容成异性NPC？":"a",
    "易容术可以找哪位NPC学习？":"b",
    "易容术向谁学习？":"a",
    "易容术在哪里学习？":"a",
    "易容术在哪学习？":"b",
    "银手镯可以在哪位npc那里获得？":"b",
    "银手镯可以在哪位那里获得？":"b",
    "银丝链甲衣可以在哪位npc那里获得？":"a",
    "银项链可以在哪位npc那里获得？":"b",
    "银项链可以在哪位那里获得？":"b",
    "尹志平是哪个门派的师傅？":"b",
    "隐者之术是那个门派的阵法？":"a",
    "鹰爪擒拿手是哪个门派的技能？":"a",
    "影响你出生的福缘的出生是？":"d",
    "油流麻香手是哪个门派的技能？":"a",
    "游龙散花是哪个门派的阵法？":"d",
    "玉草帽可以在哪位npc那里获得？":"b",
    "玉蜂浆在哪个地图获得":"a",
    "玉女剑法是哪个门派的技能？":"b",
    "岳掌门在哪一章？":"a",
    "云九天是哪个门派的师傅？":"c",
    "云问天在哪一章？":"a",
    "在洛阳萧问天那可以学习什么心法":"b",
    "在庙祝处洗杀气每次可以消除多少点？":"a",
    "在哪个npc处可以更改名字？":"a",
    "在哪个npc处领取免费消费积分？":"d",
    "在哪个npc处能够升级易容术？":"b",
    "在哪个NPC可以购买恢复内力的药品？":"c",
    "在哪个处可以更改名字？":"a",
    "在哪个处领取免费消费积分？":"d",
    "在哪个处能够升级易容术？":"b",
    "在哪里可以找到“香茶”？":"a",
    "在哪里捏脸提升容貌":"d",
    "在哪里消杀气？":"a",
    "在逍遥派能学到的技能是哪个？":"a",
    "在雪亭镇李火狮可以学习多少级柳家拳？":"b",
    "在战斗界面点击哪个按钮可以进入聊天界面？":"d",
    "在正邪任务中不能获得下面什么奖励？":"d",
    "怎么样获得免费元宝？":"a",
    "赠送李铁嘴银两能够增加什么？":"a",
    "张教主在明教哪个场景？":"d",
    "张三丰在哪一章":"d",
    "张三丰在武当山哪个场景？":"d",
    "张松溪在哪个地图？":"c",
    "张天师是哪个门派的师傅？":"a",
    "张天师在茅山哪个场景？":"d",
    "长虹剑在哪位npc那里获得？":"a",
    "长虹剑在哪位那里获得？":"a",
    "长剑在哪里可以购买？":"a",
    "正邪任务杀死好人增长什么？":"b",
    "正邪任务一天能做几次？":"a",
    "正邪任务中客商的在哪个地图？":"a",
    "正邪任务中卖花姑娘在哪个地图":"b",
    "正邪任务最多可以完成多少个？":"d",
    "支线对话书生上魁星阁二楼杀死哪个NPC给10元宝？":"a",
    "朱姑娘是哪个门派的师傅？":"a",
    "朱老伯在华山村哪个小地图？":"b",
    "追风棍可以在哪位npc那里获得？":"a",
    "追风棍在哪里获得？":"b",
    "紫宝石加什么属性？":"d",
    "钻石项链在哪获得？":"a"

};
function answerQuestionsFunc(){
    if(btnList["开答题"].innerText == "开答题"){
        console.log("准备自动答题！");
        answerQuestionsInterval = setInterval(answerQuestions, 1000);
        btnList["开答题"].innerText = "停答题";
    }else{
        console.log("停止自动答题！");
        btnList["开答题"].innerText = "开答题";
        clearInterval(answerQuestionsInterval);
    }
}

function answerQuestions(){
    if($('span:contains(每日武林知识问答次数已经)').text().slice(-46) == "每日武林知识问答次数已经达到限额，请明天再来。每日武林知识问答次数已经达到限额，请明天再来。") {
        // 今天答题结束了
        console.log("完成自动答题！");
        btnList["开答题"].innerText = "开答题";
        clearInterval(answerQuestionsInterval);
    }
    go('question');
    setTimeout(getAndAnsQuestion, 200); // 200 ms之后提取问题，查询答案，并回答
}

function getAndAnsQuestion(){
    // 提取问题
    //alert($(".out").text());
    var theQuestion = A = $(".out").text().split("题")[1].split("A")[0];
    // 左右去掉空格

    //var theQuestion = A = $(".out").text();
    //theQuestion=theQuestion.split("题")[1];
    //theQuestion=theQuestion.split("A.")[0];
    theQuestion=theQuestion.replace( /^\theQuestion*/, "");
    theQuestion=theQuestion.replace( /\theQuestion*$/, "");
    theQuestion=theQuestion.slice(1);
    //theQuestion = theQuestion.trim(" ","left").trim(" ","right");
    //alert(theQuestion);
    // 查找某个问题，如果问题有包含关系，则
    var theAnswer = getAnswer2Question(theQuestion);
    if (theAnswer !== "failed"){
        eval   ("go('question " + theAnswer + "')");
    }else{
        alert("没有找到答案，请手动完成该题目！");
        console.log("停止自动答题！");
        btnList["开答题"].innerText = "开答题";
        clearInterval(answerQuestionsInterval);
        return;
    }
    setTimeout(printAnswerInfo, 300);

}
function printAnswerInfo(){
    console.log("完成一道武林知识问答：" );
    console.log($('span:contains(知识问答第)').text().split("继续答题")[0]);
}
function getAnswer2Question(localQuestion){
    // 如果找到答案，返回响应答案，a,b,c或者d
    // 如果没有找到答案，返回 "failed"

    var resultsFound = [];
    var countor = 0;
    for(var quest in QuestAnsLibs){
        if (isContains(quest, localQuestion)){ //包含关系就可
            resultsFound[countor] = quest;
            countor = countor +1;
        }else if(isContains(quest, localQuestion.replace("npc","")) || isContains(quest, localQuestion.replace("NPC",""))){

        }

    }
    if(resultsFound.length ==1){
        return QuestAnsLibs[resultsFound[0]];
    }
    else {
        console.log("题目 " + localQuestion + " 找不到答案或存在多个答案，请手动作答！");
        return "failed";
    }
}


//-------------------------分割线-----------
createButton('刷青竹蛇',SnakeFunc);

// 怼蛇 ----------------------------
var SnakeName = 'luoyang_luoyang20';

function SnakeFunc(){
    if (! (counthead=prompt("请输入剩余数量","20"))){
        return;
    }
    go('jh 2;n;n;n;n;n;n;n;n;n;e;');        // 进入章节
    go('kill ' + SnakeName);
    setTimeout(killsnake,500);
}


function killsnake(){
    if($('span:contains(胜利)').text().slice(-3) == '胜利！'){
        go('prev_combat');
        if(counthead > 1){
            counthead = counthead - 1;
            console.log('杀人一次，剩余杀人次数：%d！',counthead);
            go('kill ' + SnakeName);
        }
        else{
            console.log('刷完了！');
            go('home');
            return;  // 终止
        }
    }
    else{
        if(is_fighting)
            ninesword();
        else
            go('kill ' + SnakeName);
    }
    setTimeout(killsnake,500);
}


//-------------------------分割线-----------
createButton('试剑',ShiJieFunc);

// 试剑----------------------------

function ShiJieFunc(){
    go('swords');
    go('swords select_member huashan_feng');   //风清扬
    go('swords select_member tangmen_madam');  //欧阳敏
    go('swords select_member btshan_ouyangfeng');   //老毒物
    go('swords fight_test go');
    setTimeout(Shijie1,1000);//code
}
function Shijie1(){
    if( isContains($('span:contains(你今天)').text().slice(-12), '你今天试剑次数已达限额。')){
        console.log('打完收工！');
    }
    else{go('swords fight_test go');
         ninesword();
         setTimeout(Shijie1,1000);//code
        }
}

//-------------------------分割线-----------
// createButton('买钓具',buyOneBeeFunc);

// 买钓具 --------------------------------

function buyOneBeeFunc(){
    var object  = "";
    var num  = 0;
    if(!(object  = prompt("请输入要购买的物品：","鱼竿，鱼饵") )){ // 支持 鱼竿，鱼饵
        return;
    }
    if(!( num  = prompt("请输入购买数量，只能输入10的倍数：","10"))){ // 支持 鱼竿，鱼饵
        return;
    }
    num  = parseInt(num/10); // 支持 鱼竿，鱼饵
    //鱼竿
    if (object == "鱼竿"){
        for(var i=0; i < num; i++) { // 从第一个开始循环
            go('shop money_buy shop5_N_10'); // 鱼竿
        }
    }else if (object == "鱼饵"){
        for(var i=0; i < num; i++) { // 从第一个开始循环
            go('shop money_buy shop6_N_10'); // 鱼饵
        }

    }else{
        alert("抱歉，此脚本还不能用于购买此物品！");
    }
}
//-------------------------分割线-----------

createButton('买千年',buyMedecineFunc);


// 买千年灵芝-------------------------------------------
function buyMedecineFunc(){
    go('jh 1;e;n;n;n;w;');
    buy1MedecineFunc();
}
function  buy1MedecineFunc(){
    var num  = 0;
    if(!( num  = prompt("请输入购买数量，只能输入10的倍数：","10"))){
        return;
    }
    num  = parseInt(num/10);
    for(var i=0; i < num; i++) { // 从第一个开始循环
        go('buy /map/snow/obj/qiannianlingzhi_N_10 from snow_herbalist'); //买灵芝
    }
}

//-------------------------分割线-----------

createButton('岩画',yanhuaFunc);

//杀孽龙-------------------------
function yanhuaFunc(){
    go("jh 26;w;w;n;w;");//阴山壁画
}

//-------------------------分割线-----------

createButton('孽龙',nielongFunc);

//杀孽龙-------------------------
function nielongFunc(){
    go('jh 15;n;nw;w;nw;n;event_1_14401179;');     //杀孽龙
}

//-------------------------分割线-----------

createButton('军阵',pozhenFunc);

//白驼军阵-------------------------
function pozhenFunc(){
    go('jh 21;n;n;n;n;w;');     //白驼军阵
}
//-------------------------分割线-----------

createButton('金狼',jinlangFunc);

//峨眉金狼-------------------------
function jinlangFunc(){
    alert("别忘了劳军\n\n1锭换朱果");
    go('jh 8;ne;e;e;e;;');     //白驼军阵
}
//-------------------------分割线-----------

createButton('冰月谷',bingyueFunc);

//冰月谷-------------------------
function bingyueFunc(){
    go('jh 14;w;n;n;n;n;event_1_32682066;');     //唐门冰月
}

//-------------------------分割线-----------

// createButton('买宝图',buybaotuFunc);

//买藏宝图-------------------------
function buybaotuFunc(){
    go('jh 1;e;n;n;n;n;e;buy /obj/quest/cangbaotu_N_10 from snow_chefu;');     //买10藏宝图
}

//-------------------------分割线-----------
// createButton('送郭济令',givextlFunc);
// 送玄铁令-------------------------------------------
function givextlFunc(){
    go('items get_store /obj/shop/xuantieling;find_task_road qixia 6;');
    givextl1Func();
}
function  givextl1Func(){
    var num  =prompt("请输入赠送数量：","1");
    for(var i=0; i < num; i++) { // 从第一个开始循环
        go('give guoji_1487067774_9828'); //送玄铁令
    }
}


//-------------------------分割线-----------
createButton('送花',givemgFunc);
// 送花------------------------------------------
function givemgFunc(){
    var num  =prompt("请输入赠送数量：","1");
    for(var i=0; i < num; i++) { // 从第一个开始循环
        go('items use meigui hua'); //送花
    }
}
//-------------------------分割线-----------
createButton('刷师门',shuasmFunc);
// 刷师门------------------------------------------
function shuasmFunc(){
    go('family_quest cancel go;family_quest'); //放弃重新接
}


//-------------------------分割线-----------

//战斗调用通用脚本----------------------------------------------------
var banSkills = "天师灭神剑|茅山道术";
function ninesword(){
    zdskill = mySkillLists;
    setTimeout(ninesword1,1000);
    if($('span.outbig_text:contains(战斗结束)').length>0){
        go('prev_combat');
    }
}
function ninesword1(){
    // 如果找到设置的技能则释放
    for(var i = 1;i < 5;i++){
        skillName = $('#skill_'+i).children().children().text();
        if(skillName !== "" && isContains(zdskill, skillName)){
            console.log(skillName);
            go('playskill '+i);
            return;
        }
    }

    // 如果没找到设置技能，随便用一个非招bb的技能
    for(i = 1;i < 5;i++){
        skillName = $('#skill_'+i).children().children().text();
        if(skillName !== "" && !isContains(banSkills, skillName)){
            console.log(skillName);
            go('playskill '+i);
            return;
        }
    }
}

//-------------------------分割线-----------
createButton('聊奇侠',startLiao);
// 刷师门------------------------------------------
var qixiaPlace = false, QiXiaIndex = 0;

/* 比试奇侠  :start */
var QixiaInfoList = [
    {
        'name': '浪唤雨',
        'index': '0',
        'id': qixiaPlace ? 'langfuyu_1494082366_3948' : 'langfuyu_1493782694_7241',
    },{
        'name': '王蓉',
        'index': '1',
        'id': qixiaPlace ? 'wangrong_1494083286_5287' : 'wangrong_1493782958_7306',
    },{
        'name': '庞统',
        'index': '2',
        'id': qixiaPlace ? 'pangtong_1494084207_2639' : 'pangtong_1493783879_4255',
    },{
        'name': '李宇飞',
        'index': '3',
        'id': qixiaPlace ? 'liyufei_1494085130_5201' : 'liyufei_1493784259_6382',
    },{
        'name': '步惊鸿',
        'index': '4',
        'id': qixiaPlace ? 'bujinghong_1494086054_1635' : 'bujinghong_1493785173_9368',
    },{
        'name': '风行骓',
        'index': '5',
        'id': qixiaPlace ? 'fengxingzhui_1499611328_9078' : 'fengxingzhui_1499611243_9634',
    },{
        'name': '郭济',
        'index': '6',
        'id': qixiaPlace ? 'guoji_1494086978_5597' : 'guoji_1493786081_9111',
    },{
        'name': '吴缜',
        'index': '7',
        'id': qixiaPlace ? 'wuzhen_1499612120_4584' : 'wuzhen_1499612120_7351',
    },{
        'name': '风南',
        'index': '8',
        'id': qixiaPlace ? 'fengnan_1494087902_8771' : 'fengnan_1493786990_415',
    },{
        'name': '火云邪神',
        'index': '9',
        'id': qixiaPlace ? 'huoyunxieshen_1494088826_8655' : 'huoyunxieshen_1493787900_1939',
    },{
        'name': '逆风舞',
        'index': '10',
        'id': qixiaPlace ? 'niwufeng_1494089750_5660' : 'niwufeng_1493788811_7636',
    },{
        'name': '狐苍雁',
        'index': '11',
        'id': qixiaPlace ? 'hucangyan_1499613025_5192' : 'hucangyan_1499613026_2522',
    },{
        'name': '护竺',
        'index': '12',
        'id': qixiaPlace ? 'huzhu_1499613932_2191' : 'huzhu_1499613933_1522',
    }
]

var QIxiaListText = '';

function startLiao(){
	QIxiaListText = prompt("请输入奇侠的顺序", "浪唤雨；郭济；王蓉；庞统；李宇飞；步惊鸿；风行骓；吴缜；风南；火云邪神；逆风舞；狐苍雁；护竺");
    if(QIxiaListText){
        talkSelectQiXia();
    }
}
async function talkSelectQiXia(){
    var QiXiaTextList = QIxiaListText.split("；");
    for (var i = 0; i < QiXiaTextList.length; i ++){
        // 每个元素删除左右侧的空格
        QiXiaTextList[i] = QiXiaTextList[i].trim(" ", "left").trim(" ","right");
    }

    for (var i = 0; i < QiXiaTextList.length; i ++ ){
        QiXiaIndex = i;
        await talkWithQiXia(QiXiaTextList[i]);
    }
}
async function talkWithQiXia(name){
    var delay_Time = 1000;
    for(var i =0 ; i<QixiaInfoList.length; i++){
        var NAME = QixiaInfoList[i].name;
        if(NAME == name){
            await doTalkWithQixia(QixiaInfoList[i]);
        }
    }
}
async function doTalkWithQixia(info){
    console.log("开始撩"+info.name+"！");
    go('open jhqx');
    go('find_task_road qixia '+info.index);
    var maxLength = 5;
    for(var i = 0; i<maxLength; i++){
        go('ask '+info.id);
    }
    go('home');
}

String.prototype.trim = function (char, type) { // 去除字符串中，头部或者尾部的指定字符串
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};
