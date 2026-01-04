// ==UserScript==
// @name         遇剑辅助
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  脚本有风险 使用需谨慎
// @author       坏熊无双和毛毛、68区神游
// @include      http://*.yytou.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369255/%E9%81%87%E5%89%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/369255/%E9%81%87%E5%89%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
/**
 * Created by MoBeiHuYang on 2017/7/5.
 *  Updated by Jeffrey on 20/10/2017
 *  Update by 神游 on 5/6/2018
 */

var Base = {
    CurrentUser: function(name){
        var url = window.location.href;
        var id = '';
        var correctSwitch = false;
        switch(name){
            case "神游":
                id = '6621432';
                break;
            case "岳曦":
                id = '6621772';
                break;
            case "郭一鼎":
                id = '6621072';
                break;
            case "释天":
                id = '6694116';
                break;
            case "屈风":
                id = '6681135';
                break;
        }
        if(url.indexOf(id) != '-1' ){
            correctSwitch = true;
        }
        return correctSwitch;
    },
}

var knownlist=[];
var curstamp=0;
var prestamp=0;
var cmdlist=[];
var deadlock=0;
function overrideclick(cmd){
    deadlock=1;
    cmdlist.push(cmd);
    console.log(cmdlist);
    deadlock=0;
}

function newoverrideclick(){
    if (cmdlist.length==0){
        setTimeout(function(){newoverrideclick();},10);
    }else{
        if (cmdlist.length>0&&deadlock==1){//有指令写入 不动数组
            setTimeout(function(){newoverrideclick();},10);
        }else if(deadlock==0&&cmdlist.length>0){
            curstamp=(new Date()).valueOf();
            if ((curstamp-prestamp)>200){
                if (cmdlist.length!=0){
                    console.log("发送指令"+cmdlist[0]);
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
                setTimeout(function(){newoverrideclick();},10);
            }else{
                setTimeout(function(){newoverrideclick();},10);//等待10毫秒执行下一次
            }
        }
    }
}
newoverrideclick();

function reloadFunc(){
    var out = $('#out2 .out2');
    out.each(function(){
        if($(this).hasClass('pass')){
            return;
        }
        $(this).addClass('pass');
        var txt = $(this).text();
        if(txt.indexOf('有人取代了你的连线') != '-1' ){
            setTimeout((function(){window.location.reload();}), 15*60*1000);
        }
        //if(txt.indexOf('在下柳淳风，领教') != '-1' ){
        //    go('fight swordsman_master');
        //}
    });
}

var btnList = {};		// 按钮列表
var buttonWidth = '70px';
var buttonHeight = '20px';
var currentPos = 30;
var currentPos2 = 30;
var currentPos3 = 30;
var currentPos4 = 30;
var currentPos5 = 30;
var delta = 22;
function createButton(btnName,func){
    btnList[btnName]=document.createElement('button');//生成按钮
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '0px';
    myBtn.style.top = currentPos + 'px';
    currentPos = currentPos + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);// 按钮加入窗体中
}
function createButton2(btnName,func){
    btnList[btnName]=document.createElement('button');//生成按钮
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '80px';
    myBtn.style.top = currentPos2 + 'px';
    currentPos2 = currentPos2 + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);// 按钮加入窗体中
}
function createButton3(btnName,func){
    btnList[btnName]=document.createElement('button');//生成按钮
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '160px';
    myBtn.style.top = currentPos3 + 'px';
    currentPos3 = currentPos3 + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);// 按钮加入窗体中
}
function createButton4(btnName,func){
    btnList[btnName]=document.createElement('button');//生成按钮
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '240px';
    myBtn.style.top = currentPos4 + 'px';
    currentPos4 = currentPos4 + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);// 按钮加入窗体中
}
function createButton5(btnName,func){
    btnList[btnName]=document.createElement('button');//生成按钮
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '160px';
    myBtn.style.top = currentPos5 + 'px';
    currentPos5 = currentPos5 + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);// 按钮加入窗体中
}

//隐藏所有按钮的按钮
createButton('隐藏按钮',buttonhideFunc);
var buttonhiden=0;
function buttonhideFunc(){
    if (buttonhiden==0){
        buttonhiden=1;
        btnList['隐藏按钮'].innerText = '显示按钮';
        hideButton();
        daybuttonhiden = 0;
        daybuttonhideFunc();
        qlzxlocshow=1;
        qlzxloclistFunc();
    }else{
        buttonhiden=0;
        btnList['隐藏按钮'].innerText = '隐藏按钮';
        showButton();
    }
}
function hideButton(){
    btnList['隐藏日常'].style.visibility="hidden";
    btnList['自动挂机'].style.visibility="hidden";
    btnList['包裹整理'].style.visibility="hidden";
    btnList['在本服'].style.visibility="hidden";
    btnList['回主页'].style.visibility="hidden";
    btnList['清谜题'].style.visibility="hidden";
    btnList['抢物品'].style.visibility="hidden";
    btnList['摸尸体'].style.visibility="hidden";
    btnList['换战斗装'].style.visibility="hidden";
    btnList['切换技能'].style.visibility="hidden";
    btnList['循环击杀'].style.visibility="hidden";
    btnList['逃跑恢复'].style.visibility="hidden";
    btnList['恢复吃药'].style.visibility="hidden";
    btnList['地图循环'].style.visibility="hidden";
    btnList['正邪地点'].style.visibility="hidden";
    btnList['好人血量'].style.visibility="hidden";
    btnList['监控青龙'].style.visibility="hidden";
    btnList['监控游侠'].style.visibility="hidden";
    //    btnList['监控逃犯'].style.visibility="hidden";
    //    btnList['自动正邪'].style.visibility="hidden";
    btnList['江湖绝学'].style.visibility="hidden";
    btnList['对招'].style.visibility="hidden";
    btnList['天剑目标'].style.visibility="hidden";
    btnList['随机走'].style.visibility="hidden";
}
function showButton(){
    btnList['隐藏日常'].style.visibility="visible";
    btnList['自动挂机'].style.visibility="visible";
    btnList['包裹整理'].style.visibility="visible";
    btnList['在本服'].style.visibility="visible";
    btnList['回主页'].style.visibility="visible";
    btnList['清谜题'].style.visibility="visible";
    btnList['抢物品'].style.visibility="visible";
    btnList['摸尸体'].style.visibility="visible";
    btnList['换战斗装'].style.visibility="visible";
    btnList['切换技能'].style.visibility="visible";
    btnList['循环击杀'].style.visibility="visible";
    btnList['逃跑恢复'].style.visibility="visible";
    btnList['恢复吃药'].style.visibility="visible";
    btnList['地图循环'].style.visibility="visible";
    btnList['正邪地点'].style.visibility="visible";
    btnList['好人血量'].style.visibility="visible";
    btnList['监控青龙'].style.visibility="visible";
    btnList['监控游侠'].style.visibility="visible";
    //    btnList['监控逃犯'].style.visibility="visible";
    //    btnList['自动正邪'].style.visibility="visible";
    btnList['江湖绝学'].style.visibility="visible";
    btnList['对招'].style.visibility="visible";
    btnList['天剑目标'].style.visibility="visible";
    btnList['随机走'].style.visibility="visible";
}

//隐藏第二层按钮的按钮
createButton('隐藏日常',daybuttonhideFunc);
var daybuttonhiden=0;
function daybuttonhideFunc(){
    if (daybuttonhiden==0){
        daybuttonhiden=1;
        btnList['隐藏日常'].innerText = '显示日常';
        dayhideButton();
        mijingshow=1;
        mijingshowFunc();
    }else{
        daybuttonhiden=0;
        btnList['隐藏日常'].innerText = '隐藏日常';
        dayshowButton();
    }
}
function dayhideButton(){
    btnList['秘境列表'].style.visibility="hidden";
    btnList['循环领奖'].style.visibility="hidden";
    btnList['分享签到'].style.visibility="hidden";
    btnList['帮派签到'].style.visibility="hidden";
    btnList['月卡半签'].style.visibility="hidden";
    btnList['月卡全签'].style.visibility="hidden";
    btnList['自动答题'].style.visibility="hidden";
    btnList['自动挖宝'].style.visibility="hidden";
    btnList['论剑挑战'].style.visibility="hidden";
    btnList['刷碎片'].style.visibility="hidden";
    btnList['阴山岩画'].style.visibility="hidden";
    btnList['打龙'].style.visibility="hidden";
    btnList['每日一做'].style.visibility="hidden";
    btnList['去钓鱼'].style.visibility="hidden";
    btnList['侠客岛'].style.visibility="hidden";
    btnList['苗疆炼药'].style.visibility="hidden";
    btnList['打榜'].style.visibility="hidden";
    btnList['撩奇侠'].style.visibility="hidden";
    btnList['比试奇侠'].style.visibility="hidden";
    btnList['1金锭'].style.visibility="hidden";
    btnList['15金锭'].style.visibility="hidden";
    btnList['秘境优化'].style.visibility="hidden";
}
function dayshowButton(){
    btnList['秘境列表'].style.visibility="visible";
    btnList['循环领奖'].style.visibility="visible";
    btnList['分享签到'].style.visibility="visible";
    btnList['帮派签到'].style.visibility="visible";
    btnList['月卡半签'].style.visibility="visible";
    btnList['月卡全签'].style.visibility="visible";
    btnList['自动答题'].style.visibility="visible";
    btnList['自动挖宝'].style.visibility="visible";
    btnList['论剑挑战'].style.visibility="visible";
    btnList['刷碎片'].style.visibility="visible";
    btnList['阴山岩画'].style.visibility="visible";
    btnList['打龙'].style.visibility="visible";
    btnList['每日一做'].style.visibility="visible";
    btnList['去钓鱼'].style.visibility="visible";
    btnList['侠客岛'].style.visibility="visible";
    btnList['苗疆炼药'].style.visibility="visible";
    btnList['打榜'].style.visibility="visible";
    btnList['撩奇侠'].style.visibility="visible";
    btnList['比试奇侠'].style.visibility="visible";
    btnList['1金锭'].style.visibility="visible";
    btnList['15金锭'].style.visibility="visible";
    btnList['秘境优化'].style.visibility="visible";
}

var mijingStr="山坳,桃花泉,千尺幢,猢狲愁,潭畔草地,玉女峰,长空栈道,临渊石台,沙丘小洞,九老洞,悬根松,夕阳岭,青云坪,玉壁瀑布,湖边,碧水寒潭,寒水潭,悬崖,戈壁,卢崖瀑布,启母石,无极老姆洞,山溪畔,奇槐坡,天梯,小洞天,云步桥,观景台,危涯前,草原,无名山峡谷,洛阳寺庙,交碎片";
var mijingPlace = mijingStr.split(',');

var mijingshow=0;
function mijingshowFunc(){
    if (mijingshow==0){
        mijingshow=1;
        btnList['秘境列表'].innerText = '关闭列表';
        mijingshowButton();
        qlzxlocshow=1;
        qlzxloclistFunc();
    }else{
        mijingshow=0;
        btnList['秘境列表'].innerText = '秘境列表';
        mijinghideButton();
    }

    function mijingshowButton(){
        for(var i=0;i<mijingPlace.length;i++)btnList[mijingPlace[i]].style.visibility="visible";
    }

    function mijinghideButton(){
        for(var i=0;i<mijingPlace.length;i++)btnList[mijingPlace[i]].style.visibility="hidden";
    }
}

//秘境------------------------------------------
createButton2('秘境列表', mijingshowFunc);

for(var i=0;i<16;i++){createButton3(mijingPlace[i], eval("mijingPlaceFunc"+i));}
for(i=16;i<mijingPlace.length;i++){createButton4(mijingPlace[i], eval("mijingPlaceFunc"+i));}
//for(i=0;i<mijingPlace.length;i++){
//    eval("function mijingPlaceFunc"+i+"(){GoSecretInfo(mijingPlace["+i+"]);}");
//}

function mijingPlaceFunc0(){GoSecretInfo(mijingPlace[0]);}
function mijingPlaceFunc1(){GoSecretInfo(mijingPlace[1]);}
function mijingPlaceFunc2(){GoSecretInfo(mijingPlace[2]);}
function mijingPlaceFunc3(){GoSecretInfo(mijingPlace[3]);}
function mijingPlaceFunc4(){GoSecretInfo(mijingPlace[4]);}
function mijingPlaceFunc5(){GoSecretInfo(mijingPlace[5]);}
function mijingPlaceFunc6(){GoSecretInfo(mijingPlace[6]);}
function mijingPlaceFunc7(){GoSecretInfo(mijingPlace[7]);}
function mijingPlaceFunc8(){GoSecretInfo(mijingPlace[8]);}
function mijingPlaceFunc9(){GoSecretInfo(mijingPlace[9]);}
function mijingPlaceFunc10(){GoSecretInfo(mijingPlace[10]);}
function mijingPlaceFunc11(){GoSecretInfo(mijingPlace[11]);}
function mijingPlaceFunc12(){GoSecretInfo(mijingPlace[12]);}
function mijingPlaceFunc13(){GoSecretInfo(mijingPlace[13]);}
function mijingPlaceFunc14(){GoSecretInfo(mijingPlace[14]);}
function mijingPlaceFunc15(){GoSecretInfo(mijingPlace[15]);}
function mijingPlaceFunc16(){GoSecretInfo(mijingPlace[16]);}
function mijingPlaceFunc17(){GoSecretInfo(mijingPlace[17]);}
function mijingPlaceFunc18(){GoSecretInfo(mijingPlace[18]);}
function mijingPlaceFunc19(){GoSecretInfo(mijingPlace[19]);}
function mijingPlaceFunc20(){GoSecretInfo(mijingPlace[20]);}
function mijingPlaceFunc21(){GoSecretInfo(mijingPlace[21]);}
function mijingPlaceFunc22(){GoSecretInfo(mijingPlace[22]);}
function mijingPlaceFunc23(){GoSecretInfo(mijingPlace[23]);}
function mijingPlaceFunc24(){GoSecretInfo(mijingPlace[24]);}
function mijingPlaceFunc25(){GoSecretInfo(mijingPlace[25]);}
function mijingPlaceFunc26(){GoSecretInfo(mijingPlace[26]);}
function mijingPlaceFunc27(){GoSecretInfo(mijingPlace[27]);}
function mijingPlaceFunc28(){GoSecretInfo(mijingPlace[28]);}
function mijingPlaceFunc29(){GoSecretInfo(mijingPlace[29]);}
function mijingPlaceFunc30(){GoSecretInfo(mijingPlace[30]);}
function mijingPlaceFunc31(){GoSecretInfo(mijingPlace[31]);}
function mijingPlaceFunc32(){GoSecretInfo(mijingPlace[32]);}



createButton('自动挂机',AutoDayFunc);
var autodayTrigger=0;
var autoday_i = null;
function AutoDayFunc(){
    if (autodayTrigger==0){
        autodayTrigger=1;
        btnList['自动挂机'].innerText = '停止挂机';
        rewardsfuncTrigger = 0;
        RewardsFunc();
        autoday_i = setInterval(autoday, 10*1000);
    }else{
        autodayTrigger=0;
        btnList['自动挂机'].innerText = '自动挂机';
        clearInterval(autoday_i);
    }
}



var autoTrigger = true;
var reloadTrigger = true;
var reload_30 = null;

function autoday(){
    var date = new Date();
    var H = date.getHours();
    var M = date.getMinutes();
    var W = date.getDay();

    if(reloadTrigger &&(M == 0 || M == 15 || M == 30 || M == 45) && H !== 18){
        autoTrigger = true;
        reloadTrigger = false;
        setTimeout((function(){reloadTrigger = true;}), 60*1000);
        if(Base.CurrentUser("神游") && $("#skill_1")[0]==undefined){
            ZhuangBeitrigger = 1;
            ZhuangBeiFunc();
        }
        if(Base.CurrentUser("神游") || Base.CurrentUser("岳曦") || Base.CurrentUser("释天")){
            reload_30 = setTimeout((function(){window.location.reload();}), 30*60*1000);
        }
    }

    if(M == 40 && (Base.CurrentUser("郭一鼎") || Base.CurrentUser("屈风"))){
        setTimeout((function(){window.location.reload();}), 5*1000);
    }

    if(H == 0 && M >1 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        go('home');
        VIPCheckIn1();
        ClanCheckIn();
        setTimeout(CheckIn,30*1000);
    }
    else if(H == 4 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        wabaoTrigger = 0;
        wabaoFunc();
        setTimeout((function(){
            wabaoTrigger = 1;
            wabaoFunc();
        }), 2*60*1000);
    }
    else if(H == 4 && M >30 && M < 60 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        FragmentTrigger=0;
        FragmentFunc();
    }
    else if(H == 5 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        go('home');
        VIPCheckIn2();
        ClanCheckIn();
        setTimeout(CheckIn,30*1000);
    }
    else if(H == 5 && M >30 && M < 60 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        autoTrigger = false;
        questionTrigger = 0;
        questionFunc();
        setTimeout((function(){
            swordsTrigger = 0;
            swordsFunc();
        }), 60*1000);
    }
    else if(H == 6 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        CheckIn();
        setTimeout(ClanCheckIn,40*1000);
        setTimeout((function(){
            wabaoTrigger = 0;
            wabaoFunc();
        }), 60*1000);
        setTimeout((function(){
            wabaoTrigger = 1;
            wabaoFunc();
        }), 3*60*1000);
    }
    else if(W !== 0 && H == 6 && M >30 && M < 60 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        go('home');
        VIPCheckIn1();
    }
    else if(H == 23 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        FragmentTrigger=0;
        FragmentFunc();
    }
    else if(W !== 0 && H == 11 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        questionTrigger = 0;
        questionFunc();
        setTimeout((function(){
            swordsTrigger = 0;
            swordsFunc();
        }), 60*1000);
    }
    /*     else if(((H == 11 && M >30 && M < 60) || H === 12) && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        go('home');
        ZhuangBeitrigger = 1;
        ZhuangBeiFunc();
        YXTrigger=2;
        youxiaFunc();
        go('clan scene');
    } */
    else if(H == 14 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        go('home;clan scene');
        YXTrigger=2;
        youxiaFunc();
    }
    /*     else if((H == 14 || H == 15 || H == 16 || H == 17 ) && (M === 1 || M === 31) && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        fightheroTrigger=0;
        fightheroFunc();
    } */
    else if(H == 17 && M >30 && M < 60 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        ZhuangBeitrigger = 0;
        ZhuangBeiFunc();
    }
    else if(H == 18 && M >0 && M < 30 && autoTrigger && $("#skill_1")[0]==undefined){
        autoTrigger = false;
        setTimeout(CheckIn,30*1000);
    }
}

//createButton('状态',PackageFunc);
function PackageFunc(){clickButton('score', 0);}

//createButton('聊天',SkillsFunc);
function SkillsFunc(){clickButton('go_chat', 0);}

createButton('在本服',KuafuFunc);
var KuafuTrigger = false;
var reload_i = setInterval(reloadFunc, 2000);
function KuafuFunc(){
    if(!KuafuTrigger){
        btnList['在本服'].innerText = '在跨服';
        KuafuTrigger = true;
        autodayTrigger=1;
        AutoDayFunc();
        QLTrigger=2;
        qilongFunc();
        YXTrigger=2;
        youxiaFunc();
        rewardsfuncTrigger = 1;
        RewardsFunc();
        clearInterval(reload_i);
        clearTimeout(reload_30);
    }else if(KuafuTrigger){
        btnList['在本服'].innerText = '在本服';
        KuafuTrigger = false;
        QLTrigger=1;
        qilongFunc();
        YXTrigger=1;
        youxiaFunc();
        if(Base.CurrentUser("神游")){
            autodayTrigger=0;
            AutoDayFunc();
        }
        reload_i = setInterval(reloadFunc, 2000);
    }
}

createButton('回主页',HomeFunc);
function HomeFunc(){clickButton('home', 1);}

createButton('包裹整理',baoguoZhengliFunc);
function baoguoZhengliFunc() {
    go("score;items");
    setTimeout(baoguoZhengli1Func,1000);

    function baoguoZhengli1Func() {
        var otherlist = ["碎裂的红宝石","裂开的红宝石","红宝石","碎裂的绿宝石","裂开的绿宝石","绿宝石","碎裂的黄宝石","裂开的黄宝石","黄宝石",
                         "碎裂的紫宝石","裂开的紫宝石","紫宝石","碎裂的蓝宝石","裂开的蓝宝石","蓝宝石","玄铁碎片",
                         "玄武盾","明月戒","明月手镯","明月帽","明月项链","明月鞋","白玉腰束",
                         "青龙碎片","白虎碎片","朱雀碎片","玄武碎片","空识卷轴","白银宝箱","黄金宝箱","黄金钥匙","铂金宝箱","铂金钥匙",
                         "鲤鱼",];
        var selllist = ["细剑","绣花小鞋","粉红绸衫","全真道袍","青色道袍","拂尘","鹿皮手套","灰色长衫","青布袍",
                        "八角锤","铁锤","三字经","孟子","老子","黑狗血","树枝","水草","破烂衣服","鲫鱼","废药渣","废焦丹","藏宝图","莲蓬",
                        "长剑","钢剑","单刀","钢刀",
                        "飞羽剑","割鹿刀","鬼头刀","斩空刀","新月棍","白蟒鞭","金弹子","冰魄银针","皮鞭","断云斧",
                        "匕首","羊角匕","逆钩匕","红光匕","梅花匕",
                        "木盾","铁盾","藤甲盾","青铜盾",
                        "铁戒","银戒","金戒","白金戒","钻石戒","天寒戒",
                        "铁手镯","银手镯","金手镯","白金手镯","钻石手镯","天寒手镯",
                        "铁项链","银项链","金项链","白金项链","钻石项链","天寒项链",
                        "草帽","皮帽","天寒帽",
                        "布衣","蓑衣","丝衣","钢丝甲衣","软甲衣",
                        "草鞋","天寒鞋",
                        "麻带","鞶革","牛皮带","锦缎腰带",
                        "铁甲","精铁甲","重甲","银丝甲",
                        "破披风","长斗篷","军袍","丝质披风",
                       ];
        var splitelist = ["破军盾","残雪戒","残雪手镯","残雪帽","残雪项链","残雪鞋",
                          "虎皮腰带","沧海护腰","金丝甲","羊毛斗篷","夜行披风",
                          "金丝宝甲衣",];
        var uselist = ["神秘宝箱","长生石宝箱","突破丹礼包","百年灵草","灵草","百年紫芝","紫芝","乾坤再造丹","小还丹","大还丹","玫瑰花",];
        var putlist = ["曜玉钥匙","武穆遗书","左手兵刃研习","百宝令","帮派令","玄铁令","谜题卡","玄重铁","驻颜丹",
                       "狗年礼券","鎏金","元宵","朱果","白羽箭",
                       "千年灵草","千年紫芝","高级乾坤再造丹","高级大还丹","高级狂暴丹","狂暴丹",
                       "天雨玄镖碎片",
                       "残页","秘籍木盒","青木宝箱","神匠宝箱"];
        var useonelist = ["冰镇酸梅汤","年糕","茉莉汤",];
        for(var i=0;i<putlist.length;i++)zhengli(putlist[i],"put_store");
        for(i=0;i<selllist.length;i++)zhengli(selllist[i],"sell");
        for(i=0;i<splitelist.length;i++)zhengli(splitelist[i],"splite");
        for(i=0;i<uselist.length;i++)zhengli(uselist[i],"use");
        for(i=0;i<useonelist.length;i++)zhengli(useonelist[i],"use",1);
    }
    function zhengli(itemName,action,limit) {
        var m = $('#out table:eq(2) tr span:contains('+itemName+')');
        if (m != null) {
            var n = m.parent().parent().find('span').filter(function () {
                return new RegExp("[0-9]+").test($(this).text());
            });
            var num = n.text().match(/(\d+)/);
            if (num == null) return;
            var itemid = m.parent().parent().attr('onclick').split("('")[1].split("')")[0].split(" info ")[1];
            var exec = "items "+action+" "+itemid;
            num = parseInt(num[0]);
            if (action == "put_store") num = 1;
            if (limit != null) num = limit;
            for (var i = 0; i < num; ++i) {
                go(exec);
            }
        }
    }
}

createButton2('循环领奖',RewardsFunc);
var rewardsfuncTrigger = 0;
function RewardsFunc(){
    if(rewardsfuncTrigger == 0){
        rewardsfuncTrigger = 1;
        btnList['循环领奖'].innerText = '停止领奖';
        scanEscapedFish();
        var dalie_interval = setInterval(dalie,5*60*1000 + 5000); // 上山打猎, 5 min = 300 s
        var ketou_interval = setInterval(ketou,10*60*1000 + 5000);//15分钟磕头一次
        var task_interval = setInterval(scanEscapedFish,60*60*1000 + 5000);
    }else{
        rewardsfuncTrigger = 0;
        btnList['循环领奖'].innerText = '循环领奖';
        clearInterval(task_interval);
        clearInterval(dalie_interval);
        clearInterval(ketou_interval);
    }
}

// 挂机任务
function maikuli() {
    overrideclick('work click maikuli');
}
function duancha() {
    overrideclick('work click duancha');
}
function dalie() {
    overrideclick('work click dalie');
}
function baobiao() {
    overrideclick('work click baobiao');
}
function maiyi() {
    overrideclick('work click maiyi');
}
function xuncheng() {
    overrideclick('work click xuncheng');
}
function datufei() {
    overrideclick('work click datufei');
}
function dalei() {
    overrideclick('work click dalei');
}
function kangjijinbin() {
    overrideclick('work click kangjijinbin');
}
function zhidaodiying() {
    overrideclick('work click zhidaodiying');
}
function dantiaoqunmen() {
    overrideclick('work click dantiaoqunmen');
}
function shenshanxiulian() {
    overrideclick('work click shenshanxiulian');
}
function jianmenlipai(){
    overrideclick('work click jianmenlipai');
}
function dubawulin(){
    overrideclick('work click dubawulin');
}
function ketou(){
    overrideclick('public_op3'); // 向师傅磕头
}
function cangjianRewards(){
    overrideclick('cangjian get_all');// 一键领取藏剑楼奖励
}
function sortRewards(){
    overrideclick('sort fetch_reward');// 领排名奖励
}
function dazuosleep(){
    overrideclick('exercise'); // 打坐
    overrideclick('sleep_hanyuchuang'); // 睡寒玉床
}

function scanEscapedFish() {
    dalie();
    baobiao();
    maiyi();
    xuncheng();
    datufei();
    dalei();
    kangjijinbin();
    zhidaodiying();
    dantiaoqunmen();
    shenshanxiulian();
    jianmenlipai();
    dubawulin();
    cangjianRewards();
    sortRewards();
    if(Base.CurrentUser("神游")){
        //go('enable jiutian-sword;tupo go,jiutian-sword');clickButton('tupo_speedup anran-zhang', 0)
        go('enable liumai-shenjian;tupo go,liumai-shenjian;tupo_speedup liumai-shenjian go');
        go('enable tulong-blade;tupo go,tulong-blade;tupo_speedup tulong-blade go');
        //go('enable jiutian-sword;tupo go,jiutian-sword;tupo_speedup2 jiutian-sword go');
        go('enable spicyclaw;practice spicyclaw');
        Skilltrigger=1;
        SkillFunc();
    }
    dazuosleep();
}

// 签到按钮---------------------------------------------------
createButton2('分享签到',CheckIn);
function CheckIn(){
    overrideclick('jh');
    if (g_obj_map.get("msg_jh_list")==undefined){
        setTimeout(function(){CheckIn();},500);
    }else{
        //领礼包每天一次
        go('jh 1;look_npc snow_mercenary');
        setTimeout((function(){
            clickLibaoBtn();//每周礼包
            go('jh 5;n;n;e;look_npc yangzhou_yangzhou9');  // 双儿
        }), 2000);
        setTimeout((function(){
            clickLibaoBtn();  // 双儿礼包
            go("share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7");//分享每天一次
            go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;event_1_16891630');//李火狮
            go('e;e;n;look_npc snow_girl;lq_lmyh_lb');//劳模礼包
            go('jh 2;n;n;n;n;n;n;n;e;look_npc luoyang_luoyang4;tzjh_lq');//理财
            go('jh 5;n;n;n;w;sign7');//扬州签到每天一次
            go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home');//采莲
            go('jh 26;w;w;n;n;event_1_14435995;s;e;e;event_1_18075497;');//破阵、玄铁
            go('jh 35;chuhaigo;go northwest;go northwest;go northwest;n;go northeast;go northwest;w;go northwest;e;e;e;e;e;go southeast;n;n;w;n;w;event_1_53278632;sousuo;sousuo'); //重铁
            go('home');//回家
        }), 5000);
    }
}

// 判断是什么礼包
function clickLibaoBtn(){
    var LiBaoName = ['兑换礼包','1元礼包'];
    var btn = $('.cmd_click2');
    btn.each(function(){
        var txt = $(this).text();
        if(txt.indexOf('礼包') != '-1'){
            if($.inArray(txt, LiBaoName) == -1){
                var clickText = $(this).attr('onclick'); // clickButton('event_1_41502934', 1)
                var clickAction = getLibaoId(clickText);
                overrideclick(clickAction);
            }
        }
    });
}

// 获取礼包的名称
function getLibaoId(text){
    var arr = text.split(',');
    var newArr = arr[0].split('(');
    var nowArr = newArr[1].split("'");
    return nowArr[1];
}

// 帮派签到---------------------------------------------------
createButton2('帮派签到',ClanCheckIn);
function ClanCheckIn(){
    //for(i=0;i<20;i++)overrideclick('clan incense yx');
    //for(i=0;i<0;i++)overrideclick('clan incense jx');
    //for(i=0;i<1;i++)overrideclick('clan incense cx');
    for(var i=0;i<5;i++)overrideclick('clan buy 302');
    for(i=0;i<2;i++)overrideclick('clan buy 202');
    //for(i=0;i<0;i++)overrideclick('clan buy 301');
}

// VIP签到---------------------------------------------------
createButton2('月卡半签',VIPCheckIn1);
function VIPCheckIn1(){
    for(var i=0;i<25;i++)overrideclick('vip finish_family'); //师门25次
    for(i=0;i<40;i++)overrideclick('vip finish_clan'); //帮派20次
    for(i=0;i<10;i++)overrideclick('vip finish_big_task'); //谜题暴击9次
    for(i=0;i<2;i++){
        overrideclick('vip finish_fb dulongzhai');
        overrideclick('vip finish_fb junying');
        overrideclick('vip finish_fb beidou');
    }//副本2次
}

createButton2('月卡全签',VIPCheckIn2);
function VIPCheckIn2(){
    overrideclick('vip drops');//每日领取
    for(var i=0;i<25;i++)overrideclick('vip finish_family'); //师门25次
    for(i=0;i<40;i++)overrideclick('vip finish_clan'); //帮派20次
    for(i=0;i<10;i++)overrideclick('vip finish_big_task'); //谜题暴击9次
    for(i=0;i<2;i++){
        overrideclick('vip finish_fb dulongzhai');
        overrideclick('vip finish_fb junying');
        overrideclick('vip finish_fb beidou');
    }//副本2次
    if(Base.CurrentUser("神游")){
        for(i=0;i<20;i++)overrideclick('vip finish_bad 1');//正邪10次，正气1，邪气2
        for(i=0;i<5;i++)overrideclick('vip finish_taofan 1');//逃犯5次，正气1，邪气2
    }else{
        for(i=0;i<20;i++)overrideclick('vip finish_bad 2');//正邪10次，正气1，邪气2
        for(i=0;i<5;i++)overrideclick('vip finish_taofan 2');//逃犯5次，正气1，邪气2
    }
    for(i=0;i<5;i++)overrideclick('vip finish_sort');//排行榜5次
    for(i=0;i<10;i++)overrideclick('vip finish_dig');//寻宝10次
    for(i=0;i<10;i++)overrideclick('vip finish_diaoyu');//钓鱼10次
    for(i=0;i<2;i++){
        overrideclick('vip finish_fb dulongzhai');
        overrideclick('vip finish_fb junying');
        overrideclick('vip finish_fb beidou');
    }//副本2次
    for(i=0;i<5;i++)overrideclick('vip finish_task');//谜题普通5次

}

createButton2('自动答题',questionFunc);
var questionTrigger = 0;
function questionFunc(){
    if (questionTrigger==0){
        btnList['自动答题'].innerText = '停止答题';
        questionTrigger=1;
        overrideclick('question');
    }else if (questionTrigger==1){
        btnList['自动答题'].innerText = '自动答题';
        questionTrigger=0;
    }
}

createButton2('自动挖宝',wabaoFunc);
var wabaoTrigger = 0;
function wabaoFunc(){
    if(wabaoTrigger == 0){
        wabaoTrigger = 1;
        btnList['自动挖宝'].innerText = '停止挖宝';
        buycangbaotuFunc();
        overrideclick('cangbaotu_op1');
    }else{
        wabaoTrigger = 0;
        btnList['自动挖宝'].innerText = '自动挖宝';
        go("home");
        baoguoZhengliFunc();
    }
}

function buycangbaotuFunc(){
    overrideclick('jh 1');        // 进入章节
    overrideclick('go east') ;     // 广场
    overrideclick('go north');     // 雪亭镇街道
    overrideclick('go north');     //
    overrideclick('go north') ;    //
    overrideclick('go north') ;    // clickButton('buy /obj/quest/cangbaotu_N_10 from snow_chefu', 0)clickButton('cangbaotu_op1', 1)
    overrideclick('go east') ;    // clickButton('buy snow_chefu', 0)clickButton('buyinfo 1');clickButton('buy /obj/quest/cangbaotu from snow_chefu', 0)
    overrideclick('buy /obj/quest/cangbaotu_N_10 from snow_chefu');
}

createButton2('论剑挑战',swordsFunc);
var swordsTrigger = 0;
function swordsFunc(){
    if(swordsTrigger == 0){
        swordsTrigger = 1;
        overrideclick('home');
        SwordsFightFunc();
        btnList["论剑挑战"].innerText = '停止论剑';}
    else{
        swordsTrigger = 0;
        clearFight();
        btnList["论剑挑战"].innerText = '论剑挑战';
    }
    function SwordsFightFunc(){
        overrideclick('swords report go');
        overrideclick('swords select_member qingcheng_mudaoren');//木道神
        overrideclick('swords select_member heimuya_dfbb');//东方教主
        overrideclick('swords select_member btshan_ouyangfeng');//老毒物
        SwordsFightIntervalFunc = setInterval(SwordsFight,2000);
    }
    function clearFight(){
        clearInterval(SwordsFightIntervalFunc);
    }
}
function SwordsFight(){
    if(swordsTrigger != 0){
        if($('span.outbig_text:contains(胜利)').length>0){
            overrideclick('prev_combat');
        }
        else if($('span.outbig_text:contains(战败了)').length>0){
            swordsTrigger = 1;
            swordsFunc();
            overrideclick('prev_combat');
            overrideclick('home');
        }
        else if($("#skill_1")[0]==undefined){
            overrideclick('swords fight_test go');
            overrideclick('auto_fight 1'); //自动战斗，可换成技能
        }
    }else{
        swordsTrigger = 1;
        swordsFunc();
    }
}
function swordsfeedback(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="notice"||type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            console.log(msg);
            //开始判断情况
            if ((msg.match("试剑胜利")&&msg.match("5/5"))||msg.match("试剑次数已达限额")!=null){
                console.log("今天试剑结束");
                swordsTrigger = 1;
                swordsFunc();
                overrideclick('home');
            }
        }
    };
}
var swordsfeed = new swordsfeedback();


// 刷碎片
createButton2('刷碎片',FragmentFunc);
var FragmentTrigger=0;
function FragmentFunc(){
    if (FragmentTrigger==0){
        FragmentTrigger=1;
        killDrunkManFunc();
        btnList['刷碎片'].innerText = '停止刷';
    }else{
        FragmentTrigger=0;
        btnList['刷碎片'].innerText = '刷碎片';
        clearkillDrunkMan();
        counthead = 2;
        go('home;');
    }
    function killDrunkManFunc(){
        go('jh 2;n;n;n;n;n;n;n;n;n;e');
        killDrunkManIntervalFunc = setInterval(killDrunkMan,500);
    }
    function clearkillDrunkMan(){
        clearInterval(killDrunkManIntervalFunc);
    }

}

var DrunkMan_targetName = 'luoyang_luoyang20';
var counthead = 2;

function killDrunkMan(){
    if(FragmentTrigger != 0){
        if($('span.outbig_text:contains(胜利)').length>0){
            overrideclick('prev_combat');
            if(counthead < 1){
                FragmentTrigger = 1;
                FragmentFunc();
            }
        }
        else if($('span.outbig_text:contains(战败了)').length>0){
            FragmentTrigger = 1;
            FragmentFunc();
            setTimeout((function(){
                FragmentTrigger = 0;
                FragmentFunc();
            }), 60*1000);
        }
        else if($("#skill_1")[0]==undefined && counthead > 0){
            counthead -= 1;
            overrideclick('kill ' + DrunkMan_targetName);
            overrideclick('auto_fight 1'); //自动战斗，可换成技能
        }
    }else{
        FragmentTrigger = 1;
        FragmentFunc();
    }
}

function fragmentfeedback(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="notice"||type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            console.log(msg);
            //开始判断情况
            if (msg.match("碎片x1") !==null){
                counthead += 1;
            }
        }
    };
}
var fragmentfeed = new fragmentfeedback();

/*
function autorunfeedback(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="notice"||type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            //overrideclick('look_room', 0);
            console.log(msg);
            //开始判断情况
            if ((msg.match("正邪之战")&&msg.match("10/10"))||msg.match("正邪战数量已经超量")!=null){
                console.log("今天正邪战结束");
                autoqlTrigger = 1;
            }else if ((msg.match("逃犯任务")&&msg.match("5/5"))||msg.match("逃犯任务次数已达最大值")!=null){
                console.log("今天抓逃犯结束");
                autotbTrigger = 1;
            }else if ((msg.match("游侠任务")&&msg.match("10/10"))||msg.match("游侠任务次数已达最大值")!=null){
                console.log("今天游侠结束");
                autoyxTrigger = 1;
            }else if ((msg.match("碎片x1 ")&&msg.match("20/20"))!=null){
                console.log("今天碎片结束");
                autofragmentTrigger = 1;
            }else if ((msg.match("试剑胜利")&&msg.match("5/5"))||msg.match("今天试剑次数已达限额")!=null){
                console.log("今天试剑结束");
                autoswordsTrigger = 1;
            }
        }
    };
}
var AutoMon = new autorunfeedback();
*/

// 玄铁重铁破阵
createButton2('每日一做',onceFunction);
function onceFunction(){
    go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home');//采莲
    go('jh 26;w;w;n;n;event_1_14435995;s;e;e;event_1_18075497;');//破阵、玄铁
    go('jh 35;chuhaigo;go northwest;go northwest;go northwest;n;go northeast;go northwest;w;go northwest;e;e;e;e;e;go southeast;n;n;w;n;w;event_1_53278632;sousuo;sousuo'); //重铁
}

// 阴山
createButton2('阴山岩画',yinshanFunction);
function yinshanFunction(){
    go('jh 26;w;w;n;w;w;w;n;n;event_1_12853448');
}

// 打龙
createButton2('打龙',onceFightFunction);
var onceFigntTrigger = 0;
function onceFightFunction(){
    if (onceFigntTrigger==0){
        btnList['打龙'].innerText = '白驮军阵';
        onceFigntTrigger=1;
        go('jh 15;n;nw;w;nw;n;event_1_14401179');
    }else if(onceFigntTrigger==1){
        btnList['打龙'].innerText = '射鸟';
        onceFigntTrigger=2;
        go('jh 21;n;n;n;n;w');
    }else if(onceFigntTrigger==2){
        btnList['打龙'].innerText = '打龙';
        onceFigntTrigger=0;
        go('jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e');
    }
}

// 钓鱼
createButton2('去钓鱼',fishingFunction);
var fishingTrigger = 0;
function fishingFunction(){
    if (fishingTrigger==0){
        fishingFirstFunc();
        btnList['去钓鱼'].innerText = '停止钓鱼';
        fishingTrigger=1;
    }else{
        btnList['去钓鱼'].innerText = '去钓鱼';
        fishingTrigger=0;
        baoguoZhengliFunc();
    }
}
function fishingFirstFunc(){
    go('jh 1;jh');
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
    //go("jh 5;n;n;n;n;n;n;n;n;n;n;go northeast;look_npc yangzhou_chuanyundongzhu;chuhai go");
    //setTimeout(function(){go("chuhaigo;go northwest;go northwest;go northwest;n;go northeast;go northwest;w;go northwest;e;e;e;e;e;go southeast;e;diaoyu");},1000);
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
            //overrideclick('look_room', 0);
            console.log(msg);
            //开始判断钓鱼情况
            if (msg.match("整个冰湖的渔获都快被你钓光了")!=null){
                console.log("今天钓鱼结束了");
                fishingTrigger=1;fishingFunction();
            }else if (msg.match("突然")!=null){
                setTimeout(function(){overrideclick('diaoyu');},100);
            }else if (msg.match("你目前正在钓鱼中")!=null){
                setTimeout(function(){overrideclick('diaoyu');},100);
            }else if(kanshufinish==0&&msg.match("你还没有鱼竿")!=null){
                kanshu();
                kanshuing=1;
            }else if(kanshufinish==1&&msg.match("你还没有鱼竿")!=null){
                overrideclick('shop money_buy shop5');
                overrideclick('diaoyu');
            }else if(wachongfinish==0&&msg.match("你还没有鱼饵")!=null){
                wachong();
                wachonging=1;
            }else if(wachongfinish==1&&msg.match("你还没有鱼饵")!=null){
                overrideclick('shop money_buy shop6');
                overrideclick('diaoyu');
            }else if(kanshuing==1&&msg.match("你调运内功向林海一掌打去")!=null){
                setTimeout(function(){overrideclick('event_1_45715622');},5000);
            }else if(wachonging==1&&msg.match("你在湿润的土地上四处翻动")!=null){
                setTimeout(function(){overrideclick('event_1_59308235');},5000);
            }else if(wachonging==1&&msg.match("你挖掘的太快了")!=null){
                setTimeout(function(){overrideclick('event_1_59308235');},100);
            }else if(kanshuing==1&&msg.match("你砍伐树木太快了")!=null){
                setTimeout(function(){overrideclick('event_1_45715622');},100);
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
    };
}
var fishfeedback=new fishingfeedback();


//侠客岛---------------------------------------------------------------------------------------------------
createButton2('侠客岛',xiakedao2);
function xiakedao2(){
    if (g_obj_map.get("msg_room")==undefined){
        setTimeout(function(){xiaokedao2();},200);
    }else{
        var locationname=g_obj_map.get("msg_room").get("short");
        if((locationname=="侠客岛渡口")){
            overrideclick("go east");
            overrideclick("go northeast");
            overrideclick("go northeast");
            overrideclick("go northeast");
            overrideclick("go east");
            overrideclick("go east");
            overrideclick("go east");
            overrideclick('event_1_9179222');
            overrideclick("go east");
            overrideclick('event_1_11720543');
            overrideclick("go west");
            overrideclick("go north");
            overrideclick("go east");
            overrideclick("go east");
            overrideclick("go south");
            overrideclick("go east");
            overrideclick('event_1_44025101');
            console.log("看书结束，准备跳瀑布");
            setTimeout(function(){xiakedao3();},500);
        }else{
            if(autodayTrigger == 0){alert("请走到侠客岛渡口再执行！");}
        }
    }
}
function xiakedao3(){
    if (g_obj_map.get("msg_room")==undefined){
        setTimeout(function(){xiakedao3();},200);
    }else{
        var locationname=g_obj_map.get("msg_room").get("short");
        console.log(locationname);
        if (locationname=="崖底"&&cmdlist.length==0){
            overrideclick('event_1_4788477');
            overrideclick('go northwest');
            overrideclick('go west');
            overrideclick('go southwest');
            overrideclick('go west');
            overrideclick('go north');
            overrideclick('go north');
            overrideclick('go north');
            overrideclick('go west');
            overrideclick('go west');
            overrideclick('go south');
            overrideclick('go west');
            overrideclick('go northwest');
            overrideclick('go west');
            overrideclick('go east');
            overrideclick('go northeast');
            overrideclick('go northeast');
            overrideclick('go northeast');
            overrideclick('go east');
            overrideclick('go east');
            overrideclick('go east');
            overrideclick('go east');
            overrideclick('go east');
            overrideclick('go south');
            overrideclick('go east');
            overrideclick('event_1_44025101');
            console.log("跳瀑布失败，回到瀑布");
            setTimeout(function(){xiakedao3();},500);
        }else if (locationname=="石门"&&cmdlist.length==0){
            console.log("进入石门");
            overrideclick('event_1_36230918');
            overrideclick('go east');
            overrideclick('go east');
            overrideclick('go south');
            overrideclick('event_1_77496481');
            console.log("侠客岛日常结束");
            //setTimeout(function(){pozhen();},500);
        }else{
            console.log("我在哪里？？");
            setTimeout(function(){xiakedao3();},500);
        }
    }
}

// 炼药------------------------------------------------------------------------------------------------------
createButton2('苗疆炼药',refiningFunction);
var refiningTrigger=0;
function refiningFunction(){
    if (refiningTrigger==0){
        refiningFirstFunc();
        btnList['苗疆炼药'].innerText = '停止炼药';
        refiningTrigger=1;
    }else{
        btnList['苗疆炼药'].innerText = '苗疆炼药';
        refiningTrigger=0;
        baoguoZhengliFunc();
    }
}

function refiningFirstFunc(){
    console.log("开始炼药！");
    setTimeout(function(){refiningstart();},1000);
}

function refiningstart(){
    var location=g_obj_map.get("msg_room").get("short");
    if (location=="炼毒室"){
        overrideclick('lianyao');
        return;
    }else if (location=="官路"){
        go('s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;event_1_8004914');
        return;
    }else if (location=="小村"){
        go('e;e;e;e;s;se;sw;s;sw;e;e;sw;se;sw;se;event_1_8004914');
        return;
    }else if (location=="澜沧江南岸"){
        go('se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;lianyao');
        return;
    }
    else {
        if(autodayTrigger == 0){alert("请到苗疆炼毒室再开始炼药");}
        refiningTrigger=1;refiningFunction();
        return;
    }
}

function refiningfeedback(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type=="notice"||type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            console.log(msg);
            //开始判断炼药情况
            if (msg.match("丹炉已经是滚得发烫")!=null){
                console.log("今天炼药结束了");
                refiningTrigger=1;refiningFunction();
                //overrideclick('home');
            }else if (msg.match("觉到丹炉中的药")!=null){
                setTimeout(function(){overrideclick('lianyao');},500);
            }else if (msg.match("你目前正在炼药中")!=null){
                setTimeout(function(){overrideclick('lianyao');},100);
            }else if(msg.match("你还没有药材")!=null){
                overrideclick('shop money_buy shop9');
                overrideclick('shop money_buy shop10');
                overrideclick('lianyao');
            }
        }
    };
}
var refinefeedback=new refiningfeedback();

//打榜
createButton2('打榜',fightheroFunc);
var fightheroTrigger=0;
var fighthero_i;
var escape_i;
function fightheroFunc(){
    if (fightheroTrigger==0){
        btnList['打榜'].innerText = '停止打榜';
        fightheroTrigger=1;
        var escapeTrriger = false;
        go("home");
        ZhuangBeitrigger = 0;
        ZhuangBeiFunc(); //战斗装
        Skilltrigger = 0;
        SkillFunc(); //放狗
        fighthero_i=setInterval(fighthero, 3000);
    }else{
        btnList['打榜'].innerText = '打榜';
        fightheroTrigger=0;
        clearInterval(fighthero_i);
        clearInterval(escape_i);
        go("home");
        ZhuangBeitrigger = 1;
        ZhuangBeiFunc();
    }

    function fighthero(){
        var out = $('#out2 .out2');
        out.each(function(){
            if($(this).hasClass('done')){
                return;
            }
            $(this).addClass('done');
            var txt = $(this).text();
            if(txt.indexOf('今日挑战高手的次数已达上限') != '-1' || txt.indexOf('逃跑成功') != '-1'){
                fightheroTrigger=1;
                fightheroFunc();
                return;
            }
        });
        if($('span.outbig_text:contains(战败了)').length>0){
            escapeTrriger = false;
            fightheroTrigger=1;
            fightheroFunc();
        }
        if($("#skill_1")[0]!==undefined && !escapeTrriger){
            var herohp = viewhp();
            if(herohp > 10000000){
                escape_i = setInterval((function(){go('escape');}), 500);
                escapeTrriger = true;
            }
        }
        if($("#skill_1")[0]===undefined && fightheroTrigger===1 && !escapeTrriger){
            go("fight_hero 1");
        }
    }
}


//奇侠领朱果
//createButton2('撩奇侠',QiXiaTalkFunc);
var QXretried=0;
var QXStop=0;
var QXTalkcounter=1;
var QxTalking=0;
function GetQXID(name,QXindex){
    if (QXStop==1&&qinmiFinished==1){
        return;
    }else if (g_obj_map.get("msg_room")==undefined||QXStop==1){
        setTimeout(function(){GetQXID(name,QXindex);},500);
    }else{
        console.log("开始寻找"+name+QXindex);
        var QX_ID = "";
        var npcindex=0;
        var els=g_obj_map.get("msg_room").elements;
        for (var i = els.length - 1; i >= 0; i--) {
            if (els[i].key.indexOf("npc") > -1) {
                if (els[i].value.indexOf(",") > -1) {
                    var elsitem_ar = els[i].value.split(',');
                    if (elsitem_ar.length > 1 && elsitem_ar[1] == name) {
                        console.log(elsitem_ar[0]);
                        npcindex=els[i].key;
                        QX_ID = elsitem_ar[0];
                    }
                }
            }
        }
        if (QX_ID==null||QX_ID==undefined||QX_ID==0){
            clickButton('find_task_road qixia '+QXindex);
            setTimeout(function(){GetQXID(name,QXindex);},500);
        }else{
            console.log("找到奇侠编号"+QX_ID);
            if (QXTalkcounter<=5){
                console.log("开始与"+name+"第"+QXTalkcounter+"对话");
                QXTalkcounter++;
                clickButton('ask '+QX_ID);
                clickButton('find_task_road qixia '+QXindex);
                setTimeout(function(){GetQXID(name,QXindex);},500);
            }else if (QXTalkcounter>5){
                QXTalkcounter=1;
                console.log("与"+name+"对话完成");
                QixiaTotalCounter++;
                if (QixiaTotalCounter>24){
                    if(autodayTrigger == 0){alert("今日奇侠已经完成");}
                }
                talktoQixia();
            }
        }

    }
}
var QixiaTotalCounter=0;
function TalkQXBase(name,QXindex){
    var QX_NAME = name;
    console.log("开始撩" + QX_NAME + "！");
    if (g_obj_map.get("msg_room")!=undefined)
        g_obj_map.get("msg_room").clear();
    overrideclick('find_task_road qixia ' + QXindex);
    overrideclick('golook_room');
    setTimeout(function(){GetQXID(QX_NAME,QXindex);},500);
}

function TalkLangHuanYu(){
    // 0 浪欢愉
    if (QXStop==1){
        return;
    }
    TalkQXBase("浪唤雨",0);
}
function TalkWangRong(){
    // 1 王蓉，要果子
    if (QXStop==1){
        return;
    }
    TalkQXBase("王蓉",1);
}
function TalkPangTong(){
    // 2 庞统
    if (QXStop==1){
        return;
    }
    TalkQXBase("庞统",2);
}
function TalkLiYuFei(){
    // 3 李宇飞，要果子
    if (QXStop==1){
        return;
    }
    TalkQXBase("李宇飞",3);
}
function TalkBuJingHong(){
    //4  步惊魂
    if (QXStop==1){
        return;
    }
    TalkQXBase("步惊鸿",4);
}
function TalkFengXingJu(){
    //5 风行骓
    if (QXStop==1){
        return;
    }
    TalkQXBase("风行骓",5);
}
function TalkGuoJI(){
    // 6 郭记
    if (QXStop==1){
        return;
    }
    TalkQXBase("郭济",6);
}
function TalkWuZhen(){
    // 7 吴缜
    if (QXStop==1){
        return;
    }
    TalkQXBase("吴缜",7);
}
function TalkFengNan(){
    // 8 凤南
    if (QXStop==1){
        return;
    }
    TalkQXBase("风南",8);
}
function TalkHuoYunXieShen(){
    //9 火云邪神
    if (QXStop==1){
        return;
    }
    TalkQXBase("火云邪神",9);
}
function TalkNiFengWu(){
    //10 逆风舞
    if (QXStop==1){
        return;
    }
    TalkQXBase("逆风舞",10);
}
function TalkCangGuYan(){
    //11 狐苍雁
    if (QXStop==1){
        return;
    }
    TalkQXBase("狐苍雁",11);
}
function TalkHuZhu(){
    //12 护竺
    if (QXStop==1){
        return;
    }
    TalkQXBase("护竺",12);
}
function TalkXuanYueYan(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("玄月研",13);
}
function TalkLangJuXu(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("狼居胥",14);
}
function TalkLieJiuZhou(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("烈九州",15);
}
function TalkMuMiaoYu(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("穆妙羽",16);
}
function TalkYuWenWuDi(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("宇文无敌",17);
}
function TalkLiXuanBa(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("李玄霸",18);
}
function TalkBaBuLongJiang(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("八部龙将",19);
}
function TalkFengWuHeng(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("风无痕",20);
}
function TalkLiCangRuo(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("厉沧若",21);
}
function TalkXiaYueQing(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("夏岳卿",22);
}
function TalkMiaoWuXin(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("妙无心",23);
}
function TalkWuYeJi(){
    if (QXStop==1){
        return;
    }
    TalkQXBase("巫夜姬",24);
}

var currentTime  = 0;
var delta_Time = 2000;
var QXStop=0;
var qinmiFinished=0;
var QiXiaList=[];
function QXWhisper(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subtype = b.get("subType");
        if (type=="notice"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            if (msg.match("对你悄声道")!=null){
                QXStop=1;
                if(autodayTrigger == 0){alert(msg);}
                //QiXiaTalkButton.innerText = '继续奇侠';
            }
            console.log(msg);
        }else if (type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            if (msg.match("今日亲密度操作次数")!=null){
                var qinmi=parseInt(msg.split("(")[1].split("/")[0]);
                if (qinmi==20){
                    QXStop=1;
                    qinmiFinished=1;
                    if(autodayTrigger == 0){alert("今日亲密度操作已经达到20，奇侠功能暂停。再次使用请重新点击开始领取果子。");}
                    QXTalking=0;
                }
            }
        }
    };
}
var whipser=new QXWhisper();

function GetQiXiaList(){
    var html=g_obj_map.get("msg_html_page");
    QxTalking=1;
    if (html==undefined){
        setTimeout(function(){GetQiXiaList();},500);
    }else if(g_obj_map.get("msg_html_page").get("msg").match("江湖奇侠成长信息")==null){
        setTimeout(function(){GetQiXiaList();},500);
    }else{
        QiXiaList=formatQx(g_obj_map.get("msg_html_page").get("msg"));
        console.log(QiXiaList);
        SortQiXia();
    }
}
function SortQiXia(){//冒泡法排序
    var temp={};
    var temparray=[];
    var newarray=[];
    for (var i=0;i<QiXiaList.length;i++){
        for (var j=1;j<QiXiaList.length-i;j++){
            if (parseInt(QiXiaList[j-1].degree)<parseInt(QiXiaList[j].degree)){
                temp=QiXiaList[j-1];
                QiXiaList[j-1]=QiXiaList[j];
                QiXiaList[j]=temp;
            }
        }
    }
    var tempcounter=0;
    console.log("奇侠好感度排序如下:");
    console.log(QiXiaList);
    //首次排序结束 目前是按照由小到大排序。现在需要找出所有的超过25000 小于30000的奇侠。找到后 排序到最上面；
    for (i=0;i<QiXiaList.length;i++){
        if (parseInt(QiXiaList[i].degree)>=25000&&parseInt(QiXiaList[i].degree)<30000){
            temparray[tempcounter]=QiXiaList[i];
            tempcounter++;
            newarray.push(i);
        }
    }
    console.log(temparray);
    console.log("提取满朱果好感度排序如下:");
    for (i=0;i<QiXiaList.length;i++){
        if (newarray.indexOf(i)==-1){
            temparray[tempcounter]=QiXiaList[i];
            tempcounter++;
        }
    }
    var over3=[];
    console.log(temparray);//第一次排序结束。现在要挑出所有超过3万的亲密 并且放到最后。
    for (i=0;i<temparray.length;i++){
        if (parseInt(temparray[i].degree)>=30000){//找到3万以上的
            over3.push(i);//push超过3万的序号
        }
    }
    console.log(over3);
    var overarray=[];
    var overcounter=0;
    for (i=0;i<temparray.length;i++){ //第一遍循环 找到不在3万列表中的
        if (over3.indexOf(i)<0){
            overarray[overcounter]=temparray[i];
            overcounter++;
        }
    }
    console.log(overarray);
    for (i=0;i<temparray.length;i++){//第二遍循环 把列表中的插入
        if (over3.indexOf(i)>=0){
            overarray[overcounter]=temparray[i];
            overcounter++;
        }
    }
    finallist=[];
    finallist=overarray;
    console.log(finallist);
    getZhuguo();
}
function getZhuguo(){
    var msg="";
    console.log(finallist);
    for (var i=0;i<4;i++){//只检查 头四个奇侠是不是在师门，是不是已经死亡。
        if (finallist[i].isOk!=true){
            msg+=finallist[i].name+" ";
        }
    }
    if (msg!=""){
        if(autodayTrigger == 0){alert("根据您的奇侠亲密好感度，目前可以最优化朱果数目的以下奇侠不在江湖或者已经死亡："+msg+"。请您稍后再尝试使用奇侠领取朱果服务。");}
    }else{//头四位奇侠都在江湖中，可以开始领取朱果
        talktoQixia();
    }
}
var unfinish="";
function talktoQixia(){
    if (QixiaTotalCounter<=24){// 奇侠list仍然有元素。开始调取排列第一个的奇侠
        var Qixianame="";
        var QixiaIndex=0;
        console.log(finallist[0].name);
        Qixianame=finallist[QixiaTotalCounter].name;
        QixiaIndex=finallist[QixiaTotalCounter].index;
        if (finallist[QixiaTotalCounter].isOk!=true){
            if(autodayTrigger == 0){alert("奇侠"+Qixianame+"目前不在江湖，可能死亡，可能在师门。领取朱果中断，请在一段时间之后重新点击领取朱果按钮。无需刷新页面");}
            return;
        }else{
            console.log(finallist[0]);
            clickButton('find_task_road qixia '+QixiaIndex);

            console.log(QixiaIndex);
            GetQXID(Qixianame,QixiaIndex);
        }
    }
}
var finallist=[];

function QiXiaTalkFunc(){
    var QiXiaList_Input= "";
    //打开 江湖奇侠页面。
    if (QXStop==0){
        clickButton('open jhqx', 0);
        GetQiXiaList();
    }else if (QXStop==1&&qinmiFinished==0){
        QXStop=0;
        //QiXiaTalkButton.innerText = '奇侠领朱果';
    }else if (QXStop==1&&qinmiFinished==1){
        QXStop=0;
        //QixiaList=[];
        finallist=[];
        QXTalkcounter=1;
        QixiaTotalCounter=0;
        clickButton('open jhqx', 0);
        GetQiXiaList();
    }
}

// 格式话奇侠数据并返回数组
function formatQx(str){
    var tmpMsg = removeSpec(str);
    var arr = tmpMsg.match(/<tr>(.*?)<\/tr>/g);
    var qxArray = [];
    var qxInfo = {};
    if(arr){
        for(var i = 0;i < arr.length;i++){
            qxInfo = {};
            var arr2 = arr[i].match(/<td[^>]*>([^\d\(]*)\(?(\d*)\)?<\/td><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><td[^>]*>.*?<\/td>/);
            qxInfo.name = arr2[1];
            qxInfo.degree = arr2[2] == "" ? 0 : arr2[2];
            console.log(arr2);
            if (arr2[3].match("未出世")!=null||arr2[4].match("师门")!=null){
                qxInfo.isOk=false;
            }else{
                qxInfo.isOk=true;
            }
            qxInfo.index=i;
            qxArray.push(qxInfo);

        }
        return qxArray;
    }
    return [];
}

// 去除链接以及特殊字符
function removeSpec(str) {
    var tmp = g_simul_efun.replaceControlCharBlank(str.replace(/\u0003.*?\u0003/g, ""));
    tmp = tmp.replace(/[\x01-\x09|\x11-\x20]+/g, "");
    return tmp;
}

function talk2QiXiabyName(localname){
    //    console.log("目前是：" + localname);
    currentTime = currentTime + delta_Time;
    switch(localname){
        case "王蓉":
            setTimeout(TalkWangRong, currentTime); // 王蓉
            break;
        case "浪唤雨":
            setTimeout(TalkLangHuanYu, currentTime);
            break;
        case "庞统":
            setTimeout(TalkPangTong, currentTime);
            break;
        case "李宇飞":
            setTimeout(TalkLiYuFei, currentTime);
            break;
        case "步惊鸿":
            setTimeout(TalkBuJingHong, currentTime);
            break;
        case "风行骓":
            setTimeout(TalkFengXingJu, currentTime);
            break;
        case "郭济":
            setTimeout(TalkGuoJI, currentTime);
            break;
        case "吴缜":
            setTimeout(TalkWuZhen, currentTime);
            break;
        case "风南":
            setTimeout(TalkFengNan, currentTime);
            break;
        case "火云邪神":
            setTimeout(TalkHuoYunXieShen, currentTime);
            break;
        case "逆风舞":
            setTimeout(TalkNiFengWu, currentTime);
            break;
        case "狐苍雁":
            setTimeout(TalkCangGuYan, currentTime);
            break;
        case "护竺":
            setTimeout(TalkHuZhu, currentTime);
            break;
        case "玄月研":
            setTimeout(TalkXuanYueYan, currentTime);
            break;
        case "狼居胥":
            setTimeout(TalkLangJuXu, currentTime);
            break;
        case "烈九州":
            setTimeout(TalkLieJiuZhou, currentTime);
            break;
        case "穆妙羽":
            setTimeout(TalkMuMiaoYu, currentTime);
            break;
        case "宇文无敌":
            setTimeout(TalkYuWenWuDi, currentTime);
            break;
        case "李玄霸":
            setTimeout(TalkLiXuanBa, currentTime);
            break;
        case "八部龙将":
            setTimeout(TalkBaBuLongJiang, currentTime);
            break;
        case "风无痕":
            setTimeout(TalkFengWuHeng, currentTime);
            break;
        case "厉沧若":
            setTimeout(TalkLiCangRuo, currentTime);
            break;
        case "夏岳卿":
            setTimeout(TalkXiaYueQing, currentTime);
            break;
        case "妙无心":
            setTimeout(TalkMiaoWuXin, currentTime);
            break;
        case "巫夜姬":
            setTimeout(TalkWuYeJi, currentTime);
            break;
        default:
            console.error("没有找到该奇侠：" + localname + " ！");
    }
}


createButton2('撩奇侠',liaoqixiaFuncB);
var liaoqixiaTrigger = 0;
function liaoqixiaFuncB(){
    if(liaoqixiaTrigger == 0){
        liaoqixiaTrigger = 1;
        btnList['撩奇侠'].innerText = '停止撩';
        liaoqixiaFunc();
        var passqixia_i = setInterval(passqixia, 200);
    }else{
        liaoqixiaTrigger = 0;
        btnList['撩奇侠'].innerText = '撩奇侠';
        clearInterval(passqixia_i);
    }
    function passqixia(){
        var out = $('#out2 .out2');
        out.each(function(){
            if($(this).hasClass('passqixia')){
                return;
            }
            $(this).addClass('passqixia');
            var txt = $(this).text();
            var qixia=[
                "吴缜","步惊鸿","郭济","火云邪神","浪唤雨","王蓉","狐苍雁","庞统","李宇飞","风南","逆风舞","护竺","风行骓",
                "玄月研","狼居胥","烈九州","穆妙羽","宇文无敌","李玄霸","八部龙将","风无痕","厉沧若","夏岳卿","妙无心","巫夜姬"
            ];
            for(var i=0;i<qixia.length;i++){
                var name=qixia[i];
                var qixiapass = name+"盯着你看了一会儿。"+name+"挺有兴致地跟你聊了起来。"+name+"说道：嗯....江湖上好玩吗？"+name+"摇摇头，说道：你在这做什么？"+name+"疑惑地看着你，道：你想干什么？"+name+"睁大眼睛望着你，似乎想问你天气怎么样。";
                if(qixiapass.indexOf(txt) > -1){
                    todaydone(name);
                    return;
                }
            }
        });
    }
}

var storage = window.localStorage;
function todaydone(arg){
    var date = new Date();
    var now = date.getTime();
    var url = window.location;
    storage.setItem(arg+url, now);
}
function istodaydone(arg,arg2){
    var done = false;
    var url = window.location;
    var date = new Date();
    var H = date.getHours();
    date.setHours(arg2,0,0,0);
    var check = date.getTime();
    if(H < arg2)check -= 24*60*60*1000;
    if(storage.hasOwnProperty(arg+url)){
        var t = parseInt(storage.getItem(arg+url));
        if(check < t){
            done = true;
        }
    }
    return(done);
}

function liaoqixiaFunc(){
    //    var lock = 0;
    //    var qixia=[
    //        "火云邪神","浪唤雨","吴缜","狐苍雁","王蓉","庞统","李宇飞","步惊鸿","风行骓","郭济","风南","逆风舞","护竺",
    //        "玄月研","狼居胥","烈九州","穆妙羽","宇文无敌","李玄霸","八部龙将","风无痕","厉沧若","夏岳卿","妙无心","巫夜姬"
    //    ];
    //var name=qixia[0];
    var qixialist = [];
    var i = 0;
    var name = "";
    go('open jhqx');
    setTimeout(function qixiainfo(){
        if($('#out > span > span.out3 > span > p').text() === '江湖奇侠成长信息'){
            qixiasort();
            setTimeout(liaoqixia,1000);
        }else{
            setTimeout(qixiainfo,100);
        }
    }, 10);

    function qixiasort(){
        var out = $("#out > span > table > tbody > tr");
        out.each(function(){
            //var n = out.filter(function () {
            //    return new RegExp("[0-9]+").test($(this).text());
            //});
            //var degree = n.text().match(/(\d+)/);

            var txt = $(this).text();
            var arr1 = txt.split('(');
            if(arr1[1]){
                var arr2 = arr1[1].split(')');
                var degree = arr2[0].match(/(\d+)/);
            }else{
                degree = 1;
            }
            qixialist.unshift([arr1[0],degree]);
        });
        sort();
        function sort(){
            if(parseInt(qixialist[0][1]) > 30000){
                var temp = qixialist.shift();
                qixialist.push(temp);
                sort();
            }
        }
    }

    function liaoqixia(){
        if(i<qixialist.length){
            name=qixialist[i][0];
            i++;
            go('open jhqx');
            setTimeout(gojhqx,300);
        }else{
            liaoqixiaTrigger = 1;
            liaoqixiaFuncB();
        }

        function gojhqx(){
            var out = $("#out > span > table > tbody > tr");
            out.each(function(){
                var txt = $(this).text();
                if(txt.indexOf(name) > -1){
                    var done = istodaydone(name,6);
                    if(txt.indexOf('师门') > -1 || txt.indexOf('隐居修炼') > -1){
                        if(i>4){
                            liaoqixia();
                        }else{
                            liaoqixiaTrigger = 1;
                            liaoqixiaFuncB();
                        }
                    }else if(done){
                        liaoqixia();
                    }else{
                        var arr = $(this).find('a').attr("href");
                        var cmd = arr.split(':');
                        eval(cmd[1]);
                        setTimeout(function(){
                            for(var j=0;j<6;j++)talkjhqx();
                        },300);
                        setTimeout(liaoqixia,2000);
                    }
                }
            });
        }

        /*        function talkinfo(){
            talkjhqx();
            setTimeout(function(){
            var out = $('#out2 .out2');
            out.each(function(){
                if($(this).hasClass('done')){
                    return;
                }
                $(this).addClass('done');
                var txt = $(this).text();
                if(txt.indexOf('盯着你看了一会儿') != '-1' || txt.indexOf('似乎想问你天气怎么样') != '-1' || txt.indexOf('挺有兴致地跟你聊了起来') != '-1' || txt.indexOf('江湖上好玩吗') != '-1' || txt.indexOf('你在这做什么') != '-1' || txt.indexOf('你想干什么') != '-1' || txt.indexOf('现在已不在这儿了') != '-1'){
                    clearInterval(talkinfo_i);
                    i++;
                    liaoqixia();
                }
            });
            },300);
            repeat++;
            if(repeat>25){
                clearInterval(talkinfo_i);
                i++;
                liaoqixia();
            }
        }
*/
        function talkjhqx(){
            var nameArr = [];
            var nameDom = $('.cmd_click3');
            nameDom.each(function(){
                if(name === $(this).text()){
                    var npcLook = $(this).attr('onclick');
                    var id = getId(npcLook);
                    go('ask '+id);
                }
            });
        }

        function getId(text){
            var arr = text.split(',');
            var newArr = arr[0].split('(');
            var nowArr = newArr[1].split(' ');
            var str = nowArr[1];
            var id = str.substr(0,str.length-1);
            return id;
        }
    }
}



createButton2('比试奇侠',QiXiaFightFunc);
createButton2('1金锭',QiXia1GoldFunc);
createButton2('15金锭',QiXia15GoldFunc);
var currentqixianame = "吴缜";
var qixiafightTrigger = 0;
function QiXiaFightFunc(){
    if(qixiafightTrigger == 0){
        qixiafightTrigger = 1;
        btnList['比试奇侠'].innerText = '停止比试';
        Skilltrigger=0;
        SkillFunc();
        var name = prompt("要比试谁",currentqixianame);
        setTimeout(fightQiXiaFunc,2000);
    }else{
        qixiafightTrigger = 0;
        btnList['比试奇侠'].innerText = '比试奇侠';
        //fightQixiaSwitch = false;
        clearInterval(fightSkillInter);
        clearInterval(setFight);
    }

    function fightQiXiaFunc(){
        zhaobing = true;
        go('open jhqx');
        setTimeout(goqixia, 100);

        if(qixiafightTrigger==1){
            setTimeout(function(){
                fightqixia();
                fightSkillInter = setInterval(function(){
                    getQiXiaInfo();
                }, 500);
                setFight = setInterval(function(){
                    dofightQixiaSet();
                }, 500);
            },1000);
        }
        function goqixia(){
            if($('#out > span > span.out3 > span > p').text() === '江湖奇侠成长信息'){
                var out = $("#out > span > table > tbody > tr");
                out.each(function(){
                    var txt = $(this).text();
                    if(txt.indexOf(name) > -1){
                        if(txt.indexOf('师门') === -1 && txt.indexOf('隐居修炼') === -1){
                            var arr = $(this).find('a').attr("href");
                            var cmd = arr.split(':');
                            eval(cmd[1]);
                        }
                    }
                });
            }else{
                setTimeout(goqixia,10);
            }
        }

        function fightqixia(){
            var nameArr = [];
            var nameDom = $('.cmd_click3');
            nameDom.each(function(){
                if(name === $(this).text()){
                    var npcLook = $(this).attr('onclick');
                    var id = getId(npcLook);
                    go('fight '+id);
                }
            });
        }

        // 获取面板信息
        function getQiXiaInfo(){
            if($('span.outbig_text:contains(战败了)').length>0){
                overrideclick('prev_combat');
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                setTimeout(function(){
                    fightQiXiaFunc();
                },5000);
                return;
            }

            var out = $('#out2 .out2');
            out.each(function(){
                if($(this).hasClass('done')){
                    return;
                }
                $(this).addClass('done');
                var txt = $(this).text();
                if(txt.indexOf('悄声') != '-1' ){
                    qixiafightTrigger = 1;
                    QiXiaFightFunc();
                    var place = getQxiaQuestionPlace(txt);
                    setTimeout(function(){
                        GoSecretInfo(place);
                    },2000);
                }else if(txt.indexOf('20/20') != '-1' ){
                    qixiafightTrigger = 1;
                    QiXiaFightFunc();
                }else if(txt.indexOf('逃跑成功') != '-1'){
                    overrideclick('prev_combat');
                    setTimeout(function(){
                        fightDog();
                    },1000);
                }else if(txt.indexOf('今日亲密度操作次数') != '-1'){
                    // fightQixiaSwitch = false;
                    clearInterval(fightSkillInter);
                    clearInterval(setFight);
                    setTimeout(function(){
                        fightQiXiaFunc();
                    },2000);
                }else if(txt.indexOf('不能重新进入') != '-1'){
                    // fightQixiaSwitch = false;
                    clearInterval(fightSkillInter);
                    clearInterval(setFight);
                    setTimeout(function(){
                        fightQiXiaFunc();
                    },2000);
                }
            });
        }
    }

    var zhaobing = false;

    // 比试奇侠技能
    function dofightQixiaSet(){
        if($('#skill_1')[0]!==undefined){
            //辟邪剑法；覆雨剑法；蛤蟆神拳；如来神掌；凌波微步；无影毒阵；茅山道术；天邪神功
            var skill1 = "茅山道术；天师灭神剑";
            var skill2 = "辟邪剑法；覆雨剑法；蛤蟆神拳；如来神掌";
            var skill3 = "凌波微步；乾坤大挪移；无影毒阵";
            var clickSkillSwitch = false;
            var skillIdA = ['1','2','3','4'];

            if(hasDog().length >0 && zhaobing){
                overrideclick('escape');
                combatskillTrigger = 3;
                combatskillFunc();
                $.each(skillIdA, function(index, val){
                    var btn = $('#skill_'+val);
                    var btnName = btn.text();
                    if(skill3.indexOf(btnName) > -1){
                        btn.find('button').trigger('click');
                        clickSkillSwitch = true;
                    }
                });
            }
            if(hasDog().length == 0 && zhaobing){
                combatskillTrigger = 3;
                combatskillFunc();
                $.each(skillIdA, function(index, val){
                    var btn = $('#skill_'+val);
                    var btnName = btn.text();
                    if(skill1.indexOf(btnName) > -1){
                        btn.find('button').trigger('click');
                        clickSkillSwitch = true;
                    }
                });
            }
            if(!zhaobing){
                combatskillTrigger = 3;
                combatskillFunc();
                $.each(skillIdA, function(index, val){
                    var btn = $('#skill_'+val);
                    var btnName = btn.text();
                    if(skill2.indexOf(btnName) > -1){
                        btn.find('button').trigger('click');
                        clickSkillSwitch = true;
                    }
                });
            }
            if(!clickSkillSwitch){
                clickButton('playskill 1');
            }
        }
    }
    // 比试狗
    function hasDog(){
        var nameArr = [];
        var nameDom = $('.outkee_text');
        nameDom.each(function(){
            var name = $(this).prev().text();
            if(name != ''){
                nameArr.push(name);
            }
        });
        var dogName = ['金甲符兵','玄阴符兵'];

        var arr3=[];
        for(var i =0; i<nameArr.length; i++){
            for(var j=0; j<dogName.length; j++){
                if(nameArr[i]==dogName[j]){
                    arr3.push(nameArr[i]);
                    break;
                }
            }
        }
        return arr3;
    }

    function fightDog(){
        if(getDogNum().length >0){
            doFightDog();
        }
    }

    function getDogNum(){
        var nameArr = [];
        var nameDom = $('.cmd_click3');
        var dogName = ['金甲符兵','玄阴符兵'];
        var arr3=[];
        nameDom.each(function(){
            var name = $(this).text();
            if(name != ''){
                nameArr.push(name);
            }
        });

        for(var i =0; i<nameArr.length; i++){
            for(var j=0; j<dogName.length; j++){
                if(nameArr[i]==dogName[j]){
                    arr3.push(nameArr[i]);
                    break;
                }
            }
        }
        return arr3;
    }


    function doFightDog(){
        var nameArr = [];
        var nameDom = $('.cmd_click3');
        console.log('开始打兵');
        nameDom.each(function(){
            var name = $(this).text();
            if(name == '金甲符兵' || name == '玄阴符兵'){
                var npcText = $(this).attr('onclick');
                var id = getId(npcText);
                overrideclick('fight '+id);
                zhaobing = false;
            }
        });
    }

    function getId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split(' ');
        var str = nowArr[1];
        var id = str.substr(0,str.length-1);
        return id;
    }
}
function QiXia1GoldFunc(){
    QiXiaGoldFunc('赠送金锭');
}
function QiXia15GoldFunc(){
    QiXiaGoldFunc('赠送15金锭');
}
function QiXiaGoldFunc(arg){
    var name = prompt("要找谁",currentqixianame);
    go('open jhqx');
    setTimeout(goqixia, 10);
    setTimeout(function(){
        looknpc(name);
        setTimeout(function(){
            clickbtn(arg);
            setTimeout(function(){
                var out = $('#out2 .out2');
                out.each(function(){
                    if($(this).hasClass('done')){
                        return;
                    }
                    $(this).addClass('done');
                    var txt = $(this).text();
                    if(txt.indexOf('悄声') != '-1' ){
                        var place = getQxiaQuestionPlace(txt);
                        GoSecretInfo(place);
                    }
                });
            },1000);
        },500);
    },500);


    function goqixia(){
        if($('#out > span > span.out3 > span > p').text() === '江湖奇侠成长信息'){
            var out = $("#out > span > table > tbody > tr");
            out.each(function(){
                var txt = $(this).text();
                if(txt.indexOf(name) > -1){
                    if(txt.indexOf('师门') === -1 && txt.indexOf('隐居修炼') === -1){
                        var arr = $(this).find('a').attr("href");
                        var cmd = arr.split(':');
                        eval(cmd[1]);
                    }
                }
            });
        }else{
            setTimeout(goqixia,10);
        }
    }

    function looknpc(name){
        var btn = $('.cmd_click3');
        btn.each(function(){
            var txt = $(this).text();
            if(txt.indexOf(name) > -1){
                var cmd = $(this).attr('onclick');
                eval(cmd);
            }
        });
    }
    function clickbtn(arg){
        var btn = $('.cmd_click2');
        btn.each(function(){
            var txt = $(this).text();
            if(txt.indexOf(arg) > -1){
                var cmd = $(this).attr('onclick');
                eval(cmd);
            }
        });
    }

}



function getQxiaQuestionPlace(txt){
    var correctPlace = txt.split('，')[0].split('去')[1];
    return correctPlace;
}

// east  west south north northeast northwest northsouth southeast
//
// northwest    north(上)     northeast
//
// west(左)                   east(右)
//
// southwest    south(下)     southeast
//

function GoSecretInfo(place){
    var placeNum = '';
    var placeSteps = '';
    var placeSteps2 = '';
    var placeSteps3 = '';

    switch(place){
        case '山坳':
            placeNum = '1';
            placeSteps = 'e;n;n;n;n;n;find_task_road secret;secret_op1';
            break;
        case '桃花泉':
            placeNum = '3';
            placeSteps = 's;s;s;s;s;go northwest;n;n;e;find_task_road secret;secret_op1';
            break;
        case '千尺幢':
            placeNum = '4';
            placeSteps = 'n;n;n;n;find_task_road secret;secret_op1';
            break;
        case '猢狲愁':
            placeNum = '4';
            placeSteps = 'n;n;n;n;n;n;n;event_1_91604710;go northwest;find_task_road secret;secret_op1';
            break;
        case '潭畔草地':
            placeNum = '4';
            placeSteps = 'n;n;n;n;n;n;n;event_1_91604710;s;s;s;find_task_road secret;secret_op1';
            break;
        case '玉女峰':
            placeNum = '4';
            placeSteps = 'n;n;n;n;n;n;n;n;w;find_task_road secret;secret_op1';
            break;
        case '长空栈道':
            placeNum = '4';
            placeSteps = 'n;n;n;n;n;n;n;n;n;e;find_task_road secret;secret_op1';
            break;
        case '临渊石台':
            placeNum = '4';
            placeSteps = 'n;n;n;n;n;n;n;n;n;e;n;event_1_91604710;go northwest;find_task_road secret;secret_op1';
            break;
        case '沙丘小洞':
            placeNum = '6';
            placeSteps = 'event_1_98623439;go northeast;n;go northeast;go northeast;go northeast;event_1_97428251;find_task_road secret;secret_op1';
            break;
        case '九老洞':
            placeNum = '8';
            placeSteps = 'w;go northwest;n;n;n;n;e;e;n;n;e;fight emei_wenxu';
            placeSteps2 = 'prev_combat;n';
            placeSteps3 = 'prev_combat;n;n;n;w;n;n;n;n;n;n;n;n;n;go northwest;go southwest;w;go northwest;w;find_task_road secret;secret_op1';
            break;
        case '悬根松':
            placeNum = '9';
            placeSteps = 'n;w;find_task_road secret;secret_op1';
            break;
        case '夕阳岭':
            placeNum = '9';
            placeSteps = 'n;n;e;find_task_road secret;secret_op1';
            break;
        case '青云坪':
            placeNum = '13';
            placeSteps = 'e;s;s;w;w;find_task_road secret;secret_op1';
            break;
        case '玉壁瀑布':
            placeNum = '16';
            placeSteps = 's;s;s;s;e;n;e;find_task_road secret;secret_op1';
            break;
        case '湖边':
            placeNum = '16';
            placeSteps = 's;s;s;s;e;n;e;event_1_5221690;s;w;find_task_road secret;secret_op1';
            break;
        case '碧水寒潭':
            placeNum = '18';
            placeSteps = 'n;go northwest;n;n;n;n;n;go northeast;n;n;n;n;n;e;e;go southeast;go southeast;e;find_task_road secret;secret_op1';
            break;
        case '寒水潭':
            placeNum = '20';
            placeSteps = 'w;w;s;e;s;s;s;s;s;go southwest;go southwest;s;e;go southeast;find_task_road secret;secret_op1';
            break;
        case '悬崖':
            placeNum = '20';
            placeSteps = 'w;w;s;e;s;s;s;s;s;go southwest;go southwest;s;s;e;find_task_road secret;secret_op1';
            break;
        case '戈壁':
            placeNum = '21';
            placeSteps = 'find_task_road secret;secret_op1';
            break;
        case '卢崖瀑布':
            placeNum = '22';
            placeSteps = 'n;n;n';
            placeSteps2 = 'prev_combat;n;e;n;find_task_road secret;secret_op1';
            break;
        case '启母石':
            placeNum = '22';
            placeSteps = 'n;n;w;w;find_task_road secret;secret_op1';
            break;
        case '无极老姆洞':
            placeNum = '22';
            placeSteps = 'n;n;w;n;n;n;n;find_task_road secret;secret_op1';
            break;
        case '山溪畔':
            placeNum = '22';
            placeSteps = 'n;n;w;n;n;n;n;event_1_88705407;s;s;find_task_road secret;secret_op1';
            break;
        case '奇槐坡':
            placeNum = '23';
            placeSteps = 'n;n;n;n;n;n;n;n;find_task_road secret;secret_op1';
            break;
        case '天梯':
            placeNum = '24';
            placeSteps = 'n;n;n;find_task_road secret;secret_op1';
            break;
        case '小洞天':
            placeNum = '24';
            placeSteps = 'n;n;n;n;e;e;find_task_road secret;secret_op1';
            break;
        case '云步桥':
            placeNum = '24';
            placeSteps = 'n;n;n;n;n;n;n;n;n;find_task_road secret;secret_op1';
            break;
        case '观景台':
            placeNum = '24';
            placeSteps = 'n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;find_task_road secret;secret_op1';
            break;
        case '危崖前':
            placeNum = '25';
            placeSteps = 'w;find_task_road secret;secret_op1';
            break;
        case '草原':
            placeNum = '26';
            placeSteps = 'w;find_task_road secret;secret_op1';
            break;
        case '无名山峡谷':
            placeNum = '29';
            placeSteps = 'n;n;n;n;event_1_60035830;event_1_65661209';
            break;
        case '洛阳寺庙':
            placeNum = '2';
            placeSteps = 'n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721';
            break;
        case '交碎片':
            placeNum = '';
            placeSteps = 'clan bzmt puzz';
            break;
        case '冰火岛':
            placeNum = '5';
            placeSteps = 'n;n;n;n;n;n;n;n;n;n;go northeast;look_npc yangzhou_chuanyundongzhu;chuhai go';
            placeSteps2 = 'chuhaigo;go northwest;go northwest;go northwest;n;go northeast;go northwest;w;go northwest;e;e;e';
            placeSteps3 = 'jh';
            break;
    }

    GoSecret(placeNum, placeSteps, placeSteps2, placeSteps3);
}

function GoSecret(num, steps, steps2, steps3){
    //overrideclick('home');
    overrideclick('jh '+num);
    go(steps);
    setTimeout((function steps2Func(){
        if($("#skill_1")[0]==undefined){
            go(steps2);
            setTimeout((function steps3Func(){
                if($("#skill_1")[0]==undefined){
                    go(steps3);
                }else{
                    setTimeout((function(){steps3Func();}), 2000);
                }
            }), 5000);
        }else{
            setTimeout((function(){steps2Func();}), 2000);
        }
    }), 5000);
}


/* 比试奇侠  :end */



//秘境最优化------------------------------------------
createButton2('秘境优化',mijingFunc);
function mijingFunc(){
    var roominfor=g_obj_map.get("msg_room").get("map_id");
    var mijingid=["lvshuige","tianlongshan","dafuchuan","fomenshiku","dilongling","luanshishan","lvzhou","taohuadu","daojiangu","binhaigucheng","baguamen","fengduguicheng","nanmanzhidi"];
    if (mijingid.indexOf(roominfor)==-1){
        if(autodayTrigger == 0){alert("当前秘境不支持优化。");}
        return;
    }else{
        clickButton(roominfor+'_saodang',0);//点击扫荡 按钮一次;
        startOptimize(roominfor);
    }
}
function startOptimize(roominfor){
    var promt=g_obj_map.get("msg_prompt");
    console.log(roominfor);
    if (promt==undefined){
        setTimeout(function(){startOptimize(roominfor);},500);
    }else{
        var msg=promt.get("msg");
        var zhuguo=parseInt(msg.split("朱果")[1].split("。")[0].split("x")[1]);
        if (zhuguo==0){
            if(autodayTrigger == 0){alert("当前扫荡出错了。");}
            return;
        }else{
            console.log("目前朱果为:"+zhuguo);
            if (roominfor=="daojiangu"){
                if (zhuguo>=1535){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="lvshuige"){
                if (zhuguo>=1255){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="taohuadu"){
                if (zhuguo>=1785){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="lvzhou"){
                if (zhuguo>=2035){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="luanshishan"){
                if (zhuguo>=2350){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="dilongling"){
                if (zhuguo>=2385){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="fomenshiku"){
                if (zhuguo>=2425){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="dafuchuan"){
                if (zhuguo>=3090){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="tianlongshan"){
                if (zhuguo>=3100){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="binhaigucheng"){
                if (zhuguo>=3385){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="baguamen"){
                if (zhuguo>=3635){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="fengduguicheng"){
                if (zhuguo>=3895){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }else if (roominfor=="nanmanzhidi"){
                if (zhuguo>=3895){
                    clickButton(roominfor+'_saodang go',0);
                }else{
                    clickButton(roominfor+'_saodang',0);
                    setTimeout(function(){startOptimize(roominfor);},500);
                }
            }
        }
    }
}


// 清谜题----------------------------------------------------------------
createButton('清谜题',clearPuzzleFunc);
function clearPuzzleFunc(){
    overrideclick('auto_tasks cancel');
}

//抢物品-----------------------------------------------------------------
createButton('抢物品',qiangdipiFunc);
var qiangdipiTrigger=0;
function qiangdipiFunc(){
    if (qiangdipiTrigger==0){
        btnList['抢物品'].innerText = '停抢物品';
        qiangdipiTrigger=1;
        qiangItem();
    }else if (qiangdipiTrigger==1){
        btnList['抢物品'].innerText = '抢物品';
        qiangdipiTrigger=0;
        knownlist=[];//清空已知列表
    }
}

function qiangItem(){
    if (qiangdipiTrigger==1){
        var Objectlist=g_obj_map.get("msg_room").elements;
        for (var i=0;i<Objectlist.length;i++){
            if (Objectlist[i].key.indexOf("item")>=0){
                if (knownlist.indexOf(" "+Objectlist[i].value.split(',')[0])<0){
                    overrideclick('get1 '+Objectlist[i].value.split(',')[0], 0);
                }
            }
        }
        setTimeout(function(){qiangItem();},50);
    }
}


// 摸尸体----------------------------------------------------
createButton('摸尸体',GetCorpseFunc);
var GetCorpseTrigger=0;
function GetCorpseFunc(){
    if(GetCorpseTrigger === 0){
        GetCorpseTrigger=1;
        AutoGet1Func();
        btnList["摸尸体"].innerText  = '不摸了';
    }else{
        GetCorpseTrigger=0;
        clearGet();
        btnList["摸尸体"].innerText  = '摸尸体';
    }

    function AutoGet1Func(){
        AutoGet1IntervalFunc = setInterval(AutoGet1,1700);
    }

    function clearGet(){
        clearInterval(AutoGet1IntervalFunc);
    }

    function AutoGet1(){
        $('.cmd_click3').each(function(){
            var txt = $(this).text();
            if(txt.indexOf('的尸体') != '-1' || txt.indexOf('枯乾的骸骨') != '-1' ){
                var npcText = $(this).attr('onclick');
                var id = getId(npcText);
                clickButton('get '+id);
            }
        })
    }

    function getId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split(' ');
        var str = nowArr[1];
        var id = str.substr(0,str.length-1);
        return id;
    }
}

// 换装备 -------------------------------------------------------
createButton('换战斗装',ZhuangBeiFunc);
var ZhuangBeitrigger=0;
function ZhuangBeiFunc(){
    if(ZhuangBeitrigger == 0){
        ZhuangBeitrigger = 1;
        btnList['换战斗装'].innerText = '战斗装中';
        overrideclick('auto_equip on');       // 一键装备
        overrideclick('wield weapon_sb_sword9');       // 诛仙
        overrideclick('wield weapon_sb_sword10');       // 斩龙剑
        overrideclick('wield weapon_sb_sword11');       // 胤龙剑
        overrideclick('wield weapon_sb_sword12');       // 12级
    }
    else if(ZhuangBeitrigger == 1){
        ZhuangBeitrigger = 2;
        if(Base.CurrentUser("神游"))ZhuangBeitrigger = 0;
        btnList['换战斗装'].innerText = '打坐装中';
        overrideclick('unwield weapon_sb_sword9');       // 下诛仙
        overrideclick('wield sword of windspring');       // 风泉
        overrideclick('wear dream hat');       // 迷幻经纶
        overrideclick('wear longyuan banzhi moke');       // 龙渊
        dazuosleep();
    }
    else if(ZhuangBeitrigger == 2){
        ZhuangBeitrigger = 0;
        btnList['换战斗装'].innerText = '已脱光';
        overrideclick('auto_equip off');       // 一键脱装
    }
}

//换技能
//一键取消 clickButton('enable unmap_all', 0) go('enable mapped_skills restore go 1');
createButton('切换技能',SkillFunc);
var Skilltrigger=0;
function SkillFunc(){
    if(Skilltrigger == 0){
        Skilltrigger = 1;
        btnList['切换技能'].innerText = '技能一中';
        go('enable mapped_skills restore go 1;prev');
    }
    else if(Skilltrigger == 1){
        Skilltrigger = 2;
        btnList['切换技能'].innerText = '技能二中';
        go('enable mapped_skills restore go 2;prev');
    }
    else if(Skilltrigger == 2){
        Skilltrigger = 0;
        btnList['切换技能'].innerText = '技能三中';
        go('enable mapped_skills restore go 3;prev');
    }
}




//循环击杀-------------------------------------
createButton('循环击杀',onekillFunc);
var onekillTrigger=0;
var killpause=0;
function onekillFunc(){
    if (onekillTrigger==0){
        btnList['循环击杀'].innerText = '停止击杀';
        onekillTrigger=1;
        killpause=0;
        killloop();
    }else if (onekillTrigger==1){
        btnList['循环击杀'].innerText = '循环击杀';
        onekillTrigger=0;
        killpause=0;
    }
}

function killloop(){
    if (onekillTrigger==1&&killpause==0){
        var npcid=g_obj_map.get("msg_npc").get("id");
        console.log("我的目标是:"+npcid);
        overrideclick('kill '+npcid);
        setTimeout(function(){killloop();},800);
    }else if(onekillTrigger==1&&killpause==1){
        setTimeout(function(){killloop();},800);
    }
}
function Onekill(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        if (type == "vs") {
            console.log(subType);
            if (subType!="combat_result"&&subType!="text"){
                killpause=1;
            }else if(subType=="combat_result"){
                killpause=0;
            }

        }
    };
}
var onekill=new Onekill();

//逃跑恢复---------------------------------------
createButton('逃跑恢复',escapeStart);
createButton('恢复吃药',healFunc);
var escapeTrigger=0;
function escapeStart(){
    if($("#skill_1")[0]!=undefined){
        escapeTrigger=1;
        healfinished=0;
        recoverFinished=0;
        escapeloop();
    }
}
function escapeloop(){
    console.log("我逃");
    overrideclick('escape', 0); //循环逃跑判定
    if (escapeTrigger==1)
        setTimeout(function(){escapeloop();},500);
}
function EscapeFunc(){
    this.dispatchMessage=function(b){
        var type = b.get("type"), subType = b.get("subtype");
        console.log(type);
        console.log(subType);
        if (type == "notice" && subType == "escape") {
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            console.log(msg);
            if (msg.match("逃跑成功")!=null){
                escapeTrigger=0;
                //开始恢复
                console.log("开始治疗");
                healFunc();
                recoveryFunc();
                backtoCombat();
            }
        }
    };
}
function backtoCombat(){
    var npcid=g_obj_map.get("msg_npc").get("id");
    if (healfinished==0||recoveryFinished==0){
        console.log("恢复尚未完成");
        setTimeout(function(){backtoCombat();},500);
    }else{
        console.log("恢复完成，准备回到战斗！");
        console.log("强制启动循环击杀功能！");
        onekillTrigger=0;
        onekillFunc();
        healfinished=0;
        recoverFinished=0;
    }
}

var healfinished=0;
var recoverFinished=0;
function healFunc(){
    var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
    var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
    console.log("血量是: "+kee+"/"+max_kee);
    if (kee<max_kee){
        clickButton('recovery',0);
        console.log("治疗中.....");
        setTimeout(function(){healFunc();},500);
    }else{
        healfinished=1;
        recoveryFinished=0;
        recoveryFunc();
    }
}
function recoveryFunc(){
    var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
    var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));
    console.log("内力是: "+force+"/"+max_force);
    if (force<max_force){
        console.log("吃药中....");
        clickButton('items use snow_qiannianlingzhi');
        setTimeout(function(){recoveryFunc();},500);
    }else{
        recoveryFinished=1;
    }
}
var escape=new EscapeFunc();

//地图循环----------------------------------
createButton("地图循环",crimerFunc);
var crimerLoc = 1;
function crimerFunc(){
    if(crimerLoc < 26){
        overrideclick("jh "+crimerLoc);
        crimerLoc++;
    }
    else{
        crimerLoc = 1;
        crimerFunc();
    }
}

//正邪地点
createButton("正邪地点",qlzxloclistFunc);

var qlzxlocStr='书房,打铁铺子,桑邻药铺,南市,绣楼,北大街,钱庄,杂货铺,祠堂大门,厅堂';
var qlzxloc = qlzxlocStr.split(',');

var qlzxlocshow=0;
function qlzxloclistFunc(){
    if (qlzxlocshow==0){
        qlzxlocshow=1;
        btnList['正邪地点'].innerText = '关闭列表';
        qlzxlocshowButton();
        mijingshow=1;
        mijingshowFunc();
    }else{
        qlzxlocshow=0;
        btnList['正邪地点'].innerText = '正邪地点';
        qlzxlochideButton();
    }

    function qlzxlocshowButton(){
        for(i=0;i<qlzxloc.length;i++)btnList[qlzxloc[i]].style.visibility="visible";
    }

    function qlzxlochideButton(){
        for(i=0;i<qlzxloc.length;i++)btnList[qlzxloc[i]].style.visibility="hidden";
    }
}

//正邪地点------------------------------------------

for(i=0;i<10;i++){createButton5(qlzxloc[i],eval("qlzxlocFunc"+i));}

function qlzxlocFunc0(){go(qlzxgroup[0].path);}
function qlzxlocFunc1(){go(qlzxgroup[1].path);}
function qlzxlocFunc2(){go(qlzxgroup[2].path);}
function qlzxlocFunc3(){go(qlzxgroup[3].path);}
function qlzxlocFunc4(){go(qlzxgroup[4].path);}
function qlzxlocFunc5(){go(qlzxgroup[5].path);}
function qlzxlocFunc6(){go(qlzxgroup[6].path);}
function qlzxlocFunc7(){go(qlzxgroup[7].path);}
function qlzxlocFunc8(){go(qlzxgroup[8].path);}
function qlzxlocFunc9(){go(qlzxgroup[9].path);}

var qlzxgroup = [
    {
        'id' : 0,
        'place' : '书房',
        'person' : '柳绘心',
        'path' : 'jh 1;e;n;e;e;e;e;n',
    },{
        'id' : 1,
        'place' : '打铁铺子',
        'person' : '王铁匠',
        'path' : 'jh 1;e;n;n;w',
    },{
        'id' : 2,
        'place' : '桑邻药铺',
        'person' : '杨掌柜',
        'path' : 'jh 1;e;n;n;n;w',
    },{
        'id' : 3,
        'place' : '南市',
        'person' : '客商',
        'path' : 'jh 2;n;n;e',
    },{
        'id' : 4,
        'place' : '绣楼',
        'person' : '柳小花',
        'path' : 'jh 2;n;n;n;n;w;s;w',
    },{
        'id' : 5,
        'place' : '北大街',
        'person' : '卖花姑娘',
        'path' : 'jh 2;n;n;n;n;n;n;n',
    },{
        'id' : 6,
        'place' : '钱庄',
        'person' : '刘守财',
        'path' : 'jh 2;n;n;n;n;n;n;n;e',
    },{
        'id' : 7,
        'place' : '杂货铺',
        'person' : '方老板',
        'path' : 'jh 3;s;s;e',
    },{
        'id' : 8,
        'place' : '祠堂大门',
        'person' : '朱老伯',
        'path' : 'jh 3;s;s;w',
    },{
        'id' : 9,
        'place' : '厅堂',
        'person' : '方寡妇',
        'path' : 'jh 3;s;s;w;n',
    }
];

function go_zxplace(place){
    for(i=0;i<10;i++){
        if(place.indexOf(qlzxgroup[i].place) > -1){
            go(qlzxgroup[i].path);
            break;
        }
    }
}

function go_zxperson(person){
    for(i=0;i<10;i++){
        if(person.indexOf(qlzxgroup[i].person) > -1){
            go(qlzxgroup[i].path);
            break;
        }
    }
}



//逃犯地点---------------------------------------------------------------
var tfgroup = [
    {'id' : 0,'map' : '雪亭镇','place' : '饮风客栈','path' : 'jh 1'},
    {'id' : 1,'map' : '洛阳','place' : '龙门石窟','path' : 'jh 2'},
    {'id' : 2,'map' : '华山村','place' : '华山村村口','path' : 'jh 3'},
    {'id' : 3,'map' : '华山','place' : '华山山脚','path' : 'jh 4'},
    {'id' : 4,'map' : '扬州','place' : '安定门','path' : 'jh 5'},
    {'id' : 5,'map' : '丐帮','place' : '树洞内部','path' : 'jh 6'},
    {'id' : 6,'map' : '乔阴县','place' : '乔阴县城北门','path' : 'jh 7'},
    {'id' : 7,'map' : '峨眉山','place' : '十二盘','path' : 'jh 8'},
    {'id' : 8,'map' : '恒山','place' : '大字岭','path' : 'jh 9'},
    {'id' : 9,'map' : '武当山','place' : '林中小路','path' : 'jh 10'},
    {'id' : 10,'map' : '晚月庄','place' : '竹林','path' : 'jh 11'},
    {'id' : 11,'map' : '水烟阁','place' : '青石官道','path' : 'jh 12'},
    {'id' : 12,'map' : '少林寺','place' : '丛林山径','path' : 'jh 13'},
    {'id' : 13,'map' : '唐门','place' : '蜀道','path' : 'jh 14'},
    {'id' : 14,'map' : '青城山','place' : '北郊','path' : 'jh 15'},
    {'id' : 15,'map' : '逍遥林','place' : '青石大道','path' : 'jh 16'},
    {'id' : 16,'map' : '开封','place' : '朱雀门','path' : 'jh 17'},
    {'id' : 17,'map' : '明教','place' : '小村','path' : 'jh 18'},
    {'id' : 18,'map' : '全真教','place' : '终南山路','path' : 'jh 19'},
    {'id' : 19,'map' : '古墓','place' : '山路','path' : 'jh 20'},
    {'id' : 20,'map' : '白驮山','place' : '戈壁','path' : 'jh 21'},
    {'id' : 21,'map' : '嵩山','place' : '太室阙','path' : 'jh 22'},
    {'id' : 22,'map' : '寒梅庄','place' : '柳树林','path' : 'jh 23'},
    {'id' : 23,'map' : '泰山','place' : '岱宗坊','path' : 'jh 24'},
    {'id' : 24,'map' : '大旗门','place' : '小路','path' : 'jh 25'},
    {'id' : 25,'map' : '大昭寺','place' : '草原','path' : 'jh 26'},
    {'id' : 26,'map' : '魔教','place' : '驿道','path' : 'jh 27'},
    {'id' : 27,'map' : '星宿海','place' : '天山下','path' : 'jh 28'},
    {'id' : 28,'map' : '茅山','place' : '无名山脚','path' : 'jh 29'},
    {'id' : 29,'map' : '桃花岛','place' : '海滩','path' : 'jh 30'}
];

function go_tfplace(place){
    for(var i=0;i<30;i++){
        if(place.indexOf(tfgroup[i].place) > -1){
            go(tfgroup[i].path);
            break;
        }
    }
}

function go_yxmap(w,name) {
    // 雪亭镇  洛阳 华山村 华山 扬州 丐帮 乔阴县 峨眉山 恒山 武当山 晚月庄 水烟阁 少林寺 唐门 青城山 逍遥林 开封 光明顶 全真教 古墓 白驮山
    var steps=0;
    if (w.startsWith("雪亭镇")) {
        var go_path = "jh 1;e;s;w;w;e;s;n;e;e;ne;ne;sw;sw;n;w;n;e;e;n;s;e;e;n;s;e;w;s;n;w;w;w;w;w;e;n;w;e;n;w;e;e;e;w;w;n;n;s;e;w;w";
    } else if (w.startsWith("洛阳")) {
        go_path = "jh 2;n;n;e;s;n;w;n;e;s;n;w;w;e;n;w;s;w;e;n;e;e;s;n;w;n;w;n;n;w;e;s;s;s;n;w;n;n;n;e;w;s;s;w;e;s;e;e;e;n;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;e;e;w;n;e;n;n";
    } else if (w.startsWith("华山村")) {
        go_path = "jh 3;n;e;w;s;w;e;s;e;n;s;w;s;e;s;n;w;w;n;s;e;s;s;w;n;s;e;s;e;w;nw;n;n;e;w;n;w;e;n;n;w;e;e;w;n";
    } else if (w.startsWith("华山")) {
        go_path = "jh 4;n;n;w;e;n;e;w;n;n;n;e;n;n;s;s;w;n;n;w;s;n;w;n;s;e;e;n;e;n;n;w;e;n;e;w;n;e;w;n;s;s;s;s;s;w;n;w;e;n;n;w;e;e;s;s;n;n;n;n;s;s;w;n";
    } else if (w.startsWith("扬州")) {
        go_path = "jh 5;n;w;w;n;s;e;e;e;w;n;w;e;e;w;n;w;e;n;w;e;n;w;w;s;s;n;n;n;n;w;n;n;n;s;s;s;e;e;w;n;s;s;s;e;e;e;n;n;n;s;s;w;n;e;n;n;s;s;e;n;n;w;n;n;s;s;w;s;s;e;e;s;w;s;w;n;w;e;e;n;n;e;w;w;e;n;n;s;s;s;s;w;n;w;e;e;w;n;w;w;n;s;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;w;s;n;w;n;w;e;e;w;n;n;w;n;s;e;e;s;n;w;n";
    } else if (w.startsWith("丐帮")) {
        go_path = "jh 6;event_1_98623439;ne;n;ne;ne;ne;sw;sw;sw;s;ne;ne;sw;sw;sw;s;w";
    } else if (w.startsWith("乔阴县")) {
        go_path = "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e";
    } else if (w.startsWith("峨眉山")) {
        go_path = "jh 8;ne;e;e;e;e;w;n;s;s;n;w;w;w;sw;w;nw;n;n;n;n;w;e;se;nw;e;n;s;e;n;n;e;halt;n;n;n;e;e;w;w;w;n;n;n;w;w;s;e;w;s;e;w;w;e;n;w;e;n;w;w;n;s;sw;ne;e;e;n;e;w;w;e;n;e;w;w;e;n;w;w;w;n;n;n;s;s;s;e;e;e;e;e;e;e;e;e;w;w;s;e;w;w;e;s;e;w;w;e;s;e;e;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;n;n;n;n;w;n;s;w;e;s;n;e;n;n;n;n;s;s;nw;nw;n;n;s;s;se;sw;w;nw;w;e;se;e;ne;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e";
    } else if (w.startsWith("恒山")) {
        go_path = "jh 9;n;w;e;n;e;w;n;w;e;n;e;w;n;n;n;w;n;s;s;n;e;e;n;s;e;w;w;n;n;w;n;e;w;n;n;w;e;n";
    } else if (w.startsWith("武当山")) {
        go_path = "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n;s;e;n;n;n;n;s;s;s;s;e;e;s;n;e;e;w;w;w;w;s;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s";
    } else if (w.startsWith("晚月庄")) {
        go_path = "jh 11;e;e;n;e;s;sw;se;s;s;s;s;s;s;se;s;n;ne;n;nw;w;w;s;s;w;e;se;e;n;n;n;n;n;n;w;n;s;w;n;w;e;s;w;w;e;s;n;e;s;w;e;s;e;e;e;w;w;w;w;w;n;s;s;n;e;s;n;e;s;w;w;e;e;e;s;s;e;w;w;s;e;e;w;w;n;e;w;w;w;e;n;n;n;s;w;e;s;e;s;n;n;e";
    } else if (w.startsWith("水烟阁")) {
        go_path = "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;n;s;e;sw;n;s;s;e";
    } else if (w.startsWith("少林寺")) {
        go_path = "jh 13;e;s;s;w;w;w;e;e;n;n;w;n;w;w;n;s;e;e;n;e;w;w;e;n;n;e;w;w;e;n;n;e;w;w;e;n;n;e;w;w;e;n;n;e;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;w;w;s;s;s;s;s;s;s;s;n;n;n;n;n;n;n;n;e;n;e;w;w;e;n;w;n";
    } else if (w.startsWith("唐门")) {
        go_path = "jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s;ask tangmen_tangmei;ask tangmen_tangmei;e;event_1_8413183;event_1_39383240;e;s;e;n;w;n;n";
    } else if (w.startsWith("青城山")) {
        go_path = "jh 15;s;s;e;w;w;n;s;e;s;e;w;w;w;n;s;s;s;n;n;w;w;w;n;s;w;e;e;e;e;e;e;s;e;w;w;e;s;e;w;s;w;s;ne;s;s;s;e;s;n;w;n;n;n;n;n;n;n;n;n;n;nw;w;nw;n;s;w;s;s;s;halt;w;w;w;w;n;e;n;s;s;s;n;e;n;e;w;w;e;n;s;s;e";
    } else if (w.startsWith("逍遥林")) {
        go_path = "jh 16;s;s;s;s;e;e;e;s;w;w;w;w;w;e;n;s;s;n;e;e;n;n;s;s;s;s;n;n;e;n;s;s;s;n;n;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w;e;n;s;e;e;n;s;e;n;n;w;n;e;n";
    } else if (w.startsWith("开封")) {
        go_path = "jh 17;sw;s;sw;nw;ne;sw;se;ne;n;ne;n;w;e;e;s;n;w;n;w;n;n;s;s;e;e;e;n;n;s;s;s;n;w;s;s;s;w;e;e;n;s;e;e;w;w;s;n;w;s;w;e;n;n;n;n;w;n;e;w;n;w;e;e;w;n;e;n;n;n;s;s;s;w;s;s;s;s;s;e;s;s;s;e;w;s;s;w";
    } else if (w.startsWith("光明顶")) {
        go_path = "jh 18;e;w;w;n;s;e;n;nw;n;n;w;e;n;n;n;ne;n;n;w;e;e;w;n;w;e;e;w;n;n;w;w;s;n;n;e;e;e;e;s;se;se;e;w;nw;nw;w;w;n;w;w;n;n;e;nw;se;e;e;e;se;e;w;sw;s;w;w;n;e;w;n;e;w;w;e;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n";
    } else if (w.startsWith("全真教")) {
        go_path = "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;e;w;w;e;n;e;n;s;e;e;w;n;n;s;s;w;w;w;w;w;w;s;n;e;s;n;e;e;e;n;n;w;w;s;s;n;n;w;s;s;n;n;w;n;n;n;n;n;n;e;n;e;e;n;n;s;s;e;e;e;e;s;e;s;s;s;n;w;n;s;s;s;s;w;s;n;w;n;e;n;n;n;s;w;n;n;n;s;s;s;w;n;s;w;n;s;s;s;e;n;n;e;s;s;s;w";
    } else if (w.startsWith("古墓")) {
        go_path = "jh 20;s;s;n;n;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;nw;w;s;w;e;e;w;s;s;w;w;e;s;sw;ne;e;s;s;w;w;e;e;s;n;e;e;e;e;s;e;w;n;w;n;n;s;e;w;w;s;n;n;n;n;s;e;w;w";
    } else if (w.startsWith("白驮山")) {
        go_path = "jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;w;w;e;e;s;s;sw;s;s;sw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;e;s;se;se;n;e;w;n;n;w;e;n;n;w;w;w;n;n;n;n;s;s;s;e;e;e;n;s;s;n;e;e;e;w;ne;sw;n;n;w;e;e;e;w;w;n;nw;se;ne;w;e;e;w;n";
    } else if (w.startsWith("嵩山")) {
        go_path = "jh 22";
    } else if (w.startsWith("寒梅庄")) {
        go_path = "jh 23";
    } else if (w.startsWith("泰山")) {
        go_path = "jh 24";
    } else if (w.startsWith("大旗门")) {
        go_path = "jh 25";
    } else if (w.startsWith("大昭寺")) {
        go_path = "jh 26";
    } else if (w.startsWith("魔教")) {
        go_path = "jh 27";
    }
    go_steps(go_path);
    function go_steps(dir) {
        getTargetInfo(name);

        var d = dir.split(";");
        if(d[steps]=='halt') {
            steps += 1;
            return;
        }
        if(steps < d.length && qlTargetlist[0] == null){
            clickButton(d[steps]);
            steps += 1;
            setTimeout(function(){go_steps(dir);},200);
        }else{
            steps=0;
            if (qlTargetlist[0] != null){
                var nowkill = qlTargetlist[0];
                var followNPC = "星宿";
                if(followNPC.indexOf(name) === -1){
                    healFunc();
                    go('follow_play '+nowkill);
                    checkfollow(name,nowkill);
                }else{
                    killfollow(nowkill);
                }
            }
        }
    }

    var checki = 0;
    var follow = true;
    function checkfollow(NPC,id){
        if(follow){
            var out = $('#out2 .out2');
            out.each(function(){
                if($(this).hasClass('follow')){
                    return;
                }
                $(this).addClass('follow');
                var txt = $(this).text();
                var check = "对著" + NPC + "喝道";
                if(txt.indexOf(check) > -1){
                    go('follow_play none');
                    killfollow(id);
                    follow = false;
                    return;
                }
            });
            checki++;
            if(checki<600){
                setTimeout(function(){checkfollow(NPC,id);},1000);
            }
        }
    }

    function killfollow(id){
        go('kill '+id);
        autokillTrigger = false;
        qlTargetlist = [];
        autokillTarget = '';
        combatskillTrigger = 2;
        combatskillFunc();
        GetCorpseTrigger = 0;
        GetCorpseFunc();
        setTimeout(function(){
            GetCorpseTrigger = 1;
            GetCorpseFunc();
            go('home;enable mapped_skills restore go 1');
        },5*60*1000);
    }
}

// 好人血量----------------------------------------------------------------
createButton("好人血量",viewhp);
function viewhp() {
    var hp = parseInt($("#vs_hp21 > i > span")[0].innerText);
    var per = parseFloat($("#barvader21")[0].style.width);
    var maxhp = parseInt(hp/per*100);
    console.log("好人血量 " + maxhp);
    if(autodayTrigger === 0){alert("好人血量 " + maxhp);}
    return maxhp;
}

createButton('监控青龙',qilongFunc);
var QLTrigger=0;
function qilongFunc(){
    if (QLTrigger==0){
        btnList['监控青龙'].innerText = '自动青龙';
        QLTrigger=1;
    }else if (QLTrigger==1){
        btnList['监控青龙'].innerText = '停止青龙';
        QLTrigger=2;
        Skilltrigger=1;
        SkillFunc();

        $("#out2>.out2").addClass('Qdone');
        qinglong = setInterval(function(){
            getName();
        },200);

    }else if (QLTrigger==2){
        btnList['监控青龙'].innerText = '监控青龙';
        QLTrigger=0;
        clearInterval(qinglong);
        clearTimeout(getNameTimeout);
    }

    var qinglong = null;    // 定时查看是否有青龙
    var Qname = '';     // 青龙恶人名称
    var pname = null;   // 装备名
    var idArr = [];     // 几个青龙人物的名称数组
    var ALLNAME = null;     // 装备名称字符串集合
    var myCareList = "天寒,残雪,刀,剑,拳,鞭,枪,杖,斧,锤"; //抢的
    var disCareList = "碎片"; //不抢
    var getNameTimeout = null;

    if(Base.CurrentUser("神游")){
        myCareList = "紫芝,灵草,大还丹,狂暴丹,小还丹,乾坤再造丹,碎片,斩龙,九天龙吟剑,飞宇天怒刀,天罡掌套,小李飞刀,乌金玄火鞭,达摩杖,天雷断龙斧,烛幽鬼煞锤";
        disCareList = "斩龙宝链,斩龙宝戒,斩龙宝镯,斩龙帽";
    }else if(Base.CurrentUser("岳曦")){
        myCareList = "碎片";
        disCareList = "";
    }else if(Base.CurrentUser("释天")){
        myCareList = "斩龙";
        disCareList = "斩龙宝链,斩龙宝戒,斩龙宝镯,斩龙帽";
    }else if(Base.CurrentUser("郭一鼎")){
        myCareList = "碎片,九天龙吟剑,飞宇天怒刀,小李飞刀";
        disCareList = "";
    }else if(Base.CurrentUser("屈风")){
        myCareList = "斩龙,龙皮,乌金玄火鞭,达摩杖,天雷断龙斧,烛幽鬼煞锤,斩龙鎏金枪,开天宝棍";
        disCareList = "";
    }
    // 获取青龙信息
    function getName(){
        if(QLTrigger !== 0){
            var len = $("#out2>.out2").length;
            var liCollection = $("#out2>.out2");

            $("#out2>.out2").each(function(i){
                var Dom = liCollection.eq(len-i-1);
                if(Dom.hasClass('Qdone')){
                    return
                }

                Dom.addClass('Qdone');
                var txt = Dom.text();

                if(txt.indexOf('战利品') === '-1' ){
                    return
                }

                if(getDisName(txt)){
                    return;
                }

                pname = getPname(txt);
                if(pname){
                    Qname = Dom.find('span').eq(1).html();
                    var placeDom = Dom.find('a');
                    var placeName =  Dom.find('a').text();
                    if(placeName){
                        if(Base.CurrentUser("神游") || Base.CurrentUser("岳曦") || Base.CurrentUser("释天") || Base.CurrentUser("郭一鼎") || Base.CurrentUser("屈风")){
                            var href = placeDom.attr('href');
                            quickKill(href);
                            return false;
                        }else{
                            runKill(placeName);
                            return false;
                        }
                    }
                }
            });
        }
    }
    async function quickKill(href){
        window.location.href = href;
        idArr = [];
        if(QLTrigger == 2)killQ();
    }
    async function runKill(place){
        go_zxplace(place);
        idArr = [];
        if(QLTrigger == 2)killQ();
    }
    // 找到青龙目标
    async function killQ(){
        idArr = [];
        var btnTextArr = [];
        var btn = $('.cmd_click3:contains('+Qname+')');
        if(btn.length == 0){
            getNameTimeout = setTimeout(function(){
                killQ();
            },100)
            return;
        }

        for(var i = btn.length-1;  i >=0 ; i--){
            var THISBTN = btn.eq(i);
            var txt = THISBTN.text();
            btnTextArr.push(txt);
            if(txt == Qname){
                var npcText = null;
                npcText = THISBTN.attr('onclick');
                var id = getId(npcText);
                idArr.push(id);
                break;
            }
        }
        var maxId = null;
        if(idArr.length >1){
            var newIdArr = [];
            for(i =0 ; i<idArr.length; i++){
                newIdArr.push(idArr[i].replace('eren',''));
            }
            maxId = newIdArr.max();
            maxId = idArr[maxId];
        }else{
            maxId = idArr[0];
        }

        //await killE(maxId);
        await killE(idArr[0]);
        setTimeout(function(){
            if($('#skill_1').length == 0){
                //console.log('没有进入战斗，重新来过');
                getNameTimeout = setTimeout(function(){
                    killQ();
                },100)
            }else{
                clearTimeout(getNameTimeout);
                maxId = null;
                idArr = [];
            }
        },200)
    }
    // 获取最近出现的一个青龙
    Array.prototype.max = function() {
        var index = 0;
        var max = this[0];
        var len = this.length;
        for (var i = 1; i < len; i++){
            if (Number(this[i]) >= Number(max)) {
                max = this[i];
                index = i;
            }
        }
        return index;
    }
    // 杀死青龙
    async function killE(name){
        await clickButton('kill '+name);
    }
    // 获取恶人的id
    function getId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split(' ');
        var str = nowArr[1];
        var id = str.substr(0,str.length-1);
        return id;
    }
    // 判断是不是关注的青龙装备
    function getPname(txt){
        var _name = '';
        ALLNAME = myCareList.split(',');
        $.each(ALLNAME,function(n,v){
            if(txt.indexOf(v) != '-1'){
                _name = v;
                return false;
            }
        })
        return _name;
    }

    // 判断不是关注的青龙装备
    function getDisName(txt){
        var _name = '';
        ALLNAME = disCareList.split(',');
        $.each(ALLNAME,function(n,v){
            if(txt.indexOf(v) != '-1'){
                _name = v;
                return false;
            }
        })
        return _name;
    }
}

createButton('监控游侠',youxiaFunc);
var YXTrigger=0;
function youxiaFunc(){
    if (YXTrigger==0){
        btnList['监控游侠'].innerText = '自动游侠';
        YXTrigger=1;
    }else if (YXTrigger==1){
        btnList['监控游侠'].innerText = '停止游侠';
        YXTrigger=2;
    }else if (YXTrigger==2){
        btnList['监控游侠'].innerText = '监控游侠';
        YXTrigger=0;
    }
}

//createButton('监控逃犯',taofanFunc);
var TFTrigger=0;
function taofanFunc(){
    if (TFTrigger==0){
        btnList['监控逃犯'].innerText = '自动正气';
        TFTrigger=1;
    }else if (TFTrigger==1){
        btnList['监控逃犯'].innerText = '自动负气';
        TFTrigger=2;
    }else if (TFTrigger==2){
        btnList['监控逃犯'].innerText = '停止逃犯';
        TFTrigger=3;
    }else if (TFTrigger==3){
        btnList['监控逃犯'].innerText = '监控逃犯';
        TFTrigger=0;
    }
}

//createButton('自动正邪',zhengxieFunc);
var ZXTrigger=0;
function zhengxieFunc(){
    if (ZXTrigger==0){
        btnList['自动正邪'].innerText = '正邪正气';
        ZXTrigger=1;
    }else if (ZXTrigger==1){
        btnList['自动正邪'].innerText = '正邪负气';
        ZXTrigger=2;
    }else if (ZXTrigger==2){
        btnList['自动正邪'].innerText = '自动正邪';
        ZXTrigger=0;
    }
}

var autokillTrigger = false;
var autokillTarget = '';
function QinglongMon() {
    this.dispatchMessage = function(b) {
        var type = b.get("type"), subType = b.get("subtype");
        if (type == "channel" && subType == "sys") {
            var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
            if (msg.indexOf("【系统】") > -1) {
                var l = msg.match(/【系统】青龙会组织：(.*)正在(.*)施展力量，本会愿出(.*)的战利品奖励给本场战斗的最终获胜者。/);
                if (l) {
                    for(var i = 0; i<qiangqinglong.length; i++){
                        if(l[3].match(qiangqinglong[i])){
                            if(QLTrigger===1){ //手动
                                setTimeout((function(){window.location.reload();}), 30*1000);
                                if(confirm('青龙出现，确定前往：' + l[1] + " --- " + l[3] + "  " + l[2])){
                                    go_zxplace(l[2]);
                                }
                                /*                            }else if(QLTrigger===2){ //自动
                                autokillTrigger = true;
                                autokillTarget = l[1];
                                combatskillTrigger = 0;
                                combatskillFunc();
                                go_zxplace(l[2]);
                                setTimeout(function(){killTarget(autokillTarget);}, 10*1000);
*/                            }
                        }
                    }
                }

                var m = msg.match(/【系统】游侠会：听说(.*)出来闯荡江湖了，目前正在前往(.*)的路上。/);
                if (m) {
                    if(YXTrigger===1){
                        setTimeout((function(){window.location.reload();}), 30*1000);
                        if(confirm('游侠出现，确定前往：' + m[1]+ " --- " + m[2])){
                            autokillTrigger = true;
                            autokillTarget = m[1];
                            go_yxmap(m[2],m[1]);
                        }
                    }else if(YXTrigger===2){
                        autokillTrigger = true;
                        autokillTarget = m[1];
                        clickButton('enable mapped_skills restore go 2');
                        go_yxmap(m[2],m[1]);
                    }
                }
                /*
                l = msg.match(/【系统】(.*)慌不择路，逃往了(.*)/);
                if (l&&(l[1]==='段老大'||l[1]==='二娘')){
                    if(TFTrigger===1) { //监控逃犯
                        setTimeout((function(){window.location.reload();}), 30*1000);
                        if(confirm(l[1] + '出现，确定前往：' + l[1]+ " --- " + l[2])){
                            go_tfplace(l[2]);
                        }
                    }else if(TFTrigger===2) { //逃犯正气
                        go_tfplace(l[2]);
                        autokillTrigger = true;
                        autokillTarget = l[1];
                    }else if(TFTrigger===3) { //逃犯负气
                        go_tfplace(l[2]);
                        autokillTrigger = true;
                        //autokillTarget = l[1];
                        if(l[1]==='段老大'){
                            autokillTarget = '无一';
                        }else if(l[1]==='二娘'){
                            autokillTarget = '铁二';
                        }
                    }
                }

                l = msg.match(/【系统】(.*)对着(.*)叫道：喂/);
                if (l){
                    if(ZXTrigger===1 && (l[1]==='段老大'||l[1]==='二娘')) { //正邪正气
                        go_zxperson(l[2]);
                        autokillTrigger = true;
                        autokillTarget = l[1];
                    }else if(ZXTrigger===2){ //正邪负气
                        go_zxperson(l[2]);
                        autokillTrigger = true;
                        autokillTarget = l[2]; //打极品好人
                        //setTimeout((function(){
                        //getTargetInfo();
                        //getqlinfo();
                        //getqlinfo_i = setInterval(getqlinfo, 2000);
                        //}), 8000);
                    }
                }

                l = msg.match(/【系统】(.*)不怀好意地对着(.*)笑道：哟/);
                if (l){
                    if(ZXTrigger===1 && (l[1]==='段老大'||l[1]==='二娘')) { //正邪正气
                        go_zxperson(l[2]);
                        autokillTrigger = true;
                        autokillTarget = l[1];
                    }else if(ZXTrigger===2){ //正邪负气
                        go_zxperson(l[2]);
                        autokillTrigger = true;
                        autokillTarget = l[2]; //打极品好人
                    }
                }
*/
            }
        }
        if (type=="notice"||type=="main_msg"){
            var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
            //console.log(msg);
            //开始判断情况
            if ((msg.match("正邪之战")&&msg.match("10/10"))||msg.match("正邪战数量已经超量")!=null){
                console.log("今天正邪战结束");
                QLTrigger=2;qilongFunc();
                ZXTrigger=2;zhengxieFunc();
            }else if ((msg.match("逃犯任务")&&msg.match("5/5"))||msg.match("逃犯任务次数已达最大值")!=null){
                console.log("今天抓逃犯结束");
                TFTrigger=3;taofanFunc();
            }else if ((msg.match("游侠任务")&&msg.match("10/10"))||msg.match("游侠任务次数已达最大值")!=null){
                console.log("今天游侠结束");
                YXTrigger=2;youxiaFunc();
            }
        }
    };
}

var qlMon = new QinglongMon();

var canxue = ['星河剑','血屠刀','霹雳拳套','生死符','玉清棍','疯魔杖','毒龙鞭','金丝宝甲衣','残雪'];
var mingyue = ['倚天剑','屠龙刀','墨玄掌套','冰魄银针','烈日棍','西毒蛇杖','碧麟鞭','月光宝甲衣','明月'];
var lieri = ['诛仙剑','龙象拳套','小李飞刀','残阳棍','伏虎杖','七星鞭','日光宝甲衣','烈日'];
var zhanlong = ['九天龙吟剑','飞宇天怒刀','天罡拳套','达摩杖','龙皮','斩龙'];
var suipian = ['碎片'];
var qiangqinglong1 = mingyue.concat(lieri.concat(zhanlong.concat(suipian)));
var qiangqinglong = canxue.concat(mingyue.concat(lieri.concat(zhanlong.concat(suipian))));
var qiangqinglong2 = zhanlong.concat(suipian);




var qlTargetlist=[];
function getTargetInfo(NPC){
    var nameArr = [];
    var nameDom = $('.cmd_click3');
    nameDom.each(function(){
        var name = $(this).text();
        if(autokillTrigger && autokillTarget && name === NPC){
            var npcText = $(this).attr('onclick');
            var id = getId(npcText);
            nameArr.unshift(id);
            qlTargetlist = nameArr;
        }
    });
    function getId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split(' ');
        var str = nowArr[1];
        var id = str.substr(0,str.length-1);
        return id;
    }
}

function killTarget(NPC){
    if(autokillTrigger){
        if($("#skill_1")[0] === undefined){
            if($('span.outbig_text:contains(战斗结束)').length>0){
                clickButton('prev_combat');
                return;
            }

            getTargetInfo(NPC);
            if(qlTargetlist.length > 0){
                var nowkill = qlTargetlist[0];
                autokillTrigger = false;
                qlTargetlist = [];
                autokillTarget = '';
                clickButton('kill '+nowkill);
            }
        }
        //setTimeout(killTarget,200);
    }
}

/*
function getqlinfo(){
    var out = $('#out2 .out2');
    out.each(function(){
        if($(this).hasClass('done')){
            return;
        }
        $(this).addClass('done');
        var txt = $(this).text();
        if(txt.indexOf('恶人还没有开始行动') != '-1' ){
        }
        if(txt.indexOf('不能杀') != '-1' ){
        }
    });

    if(autokillTrigger){
        if($('span.outbig_text:contains(战斗结束)').length>0){
            go('prev_combat');
            setTimeout(function(){
                killTarget();
            },1000);
        }else{
            killTarget();
        }
    }else{
        if($('span.outbig_text:contains(战斗结束)').length>0){
            go('prev_combat');
            clearInterval(getqlinfo_i);
        }
    }
    if(ZXTrigger===2){
        ZXCheckGood();
    }
    if(QLTrigger===2){
        //QLCheckGood();
    }
    if(qlTargetlist.length === 0){
        autokillTrigger = false;
    }
}

function ZXCheckGood(){
    if($("#skill_1")[0]!==undefined){
        var maxhp = viewhp();
        if(maxhp < 700000 || maxhp > 1000000)go('escape');
    }
}
function QLCheckGood(){
    if($("#skill_1")[0]!==undefined){
        var maxhp = viewhp();
        if(maxhp < 1000000)go('escape');
    }
}
*/

// 战斗技能
createButton('江湖绝学',combatskillFunc);
var combatskillTrigger = 0;
var combatskill_i = null;
function combatskillFunc(){
    if (combatskillTrigger === 0){
        combatskillTrigger = 1;
        mySkillLists = "覆雨剑法；如来神掌；九天龙吟剑；排云神掌；织冰剑法；翻云刀法；雪饮狂刀；孔雀翎；飞刀绝技";
        clearInterval(combatskill_i);
        combatskill_i = setInterval(doKillSet,500);
        btnList['江湖绝学'].innerText = '普通绝学';
    }else if (combatskillTrigger === 1){
        combatskillTrigger = 2;
        mySkillLists = "黯然销魂掌；暴雨梨花针；碧海潮生剑；春风快意刀；帝王剑法；独孤九剑；蛤蟆神拳；降龙十八掌；九阴白骨爪；九阴噬骨刀；连珠腐尸功；六脉神剑；辟邪剑法；七星夺魄剑；七星剑法；天师灭神剑；天羽奇剑；屠龙刀法；无相金刚掌；玄铁剑法；倚天剑法；真武七截剑";
        clearInterval(combatskill_i);
        combatskill_i = setInterval(doKillSet,1000);
        btnList['江湖绝学'].innerText = '狂放轻功';
    }else if (combatskillTrigger === 2){
        combatskillTrigger = 3;
        mySkillLists = "凌波微步；乾坤大挪移；无影毒阵";
        clearInterval(combatskill_i);
        combatskill_i = setInterval(doKillSet,1000);
        btnList['江湖绝学'].innerText = '自己出招';
    }else if (combatskillTrigger === 3){
        combatskillTrigger = 0;
        clearInterval(combatskill_i);
        btnList['江湖绝学'].innerText = '江湖绝学';
    }
}

var mySkillLists = "覆雨剑法；蛤蟆神拳；凌波微步；无影毒阵；茅山道术；天邪神功";
function doKillSet(){
    if($('span.outbig_text:contains(战斗结束)').length>0){
        go('prev_combat');
    }
    if($('#skill_1').length === 0){
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
    });
    if(!clickSkillSwitch){
        clickButton('playskill 1');
    }
}

/* 对招 方法 :start */
createButton('对招',fightAllFunc);
var fightAllInter = null;
var fightAllTrigger = 0;
function fightAllFunc(){
    if(fightAllTrigger === 0){
        fightAllInter = setInterval(function(){
            doFightAll();
        },1000);
        btnList['对招'].innerText = '取消对招';
        fightAllTrigger = 1;
    }else if(fightAllTrigger === 1){
        clearInterval(fightAllInter);
        btnList['对招'].innerText = '对招';
        fightAllTrigger = 0;
    }
}
function doFightAll(){
    if($('#skill_1').length === 0)return;

    // 获取气血的百分比
    function geKeePercent(){
        var max_kee = g_obj_map.get("msg_attrs").get("max_kee");
        var kee = g_obj_map.get("msg_attrs").get("kee");
        var keePercent = parseInt(kee/max_kee*100);
        return keePercent;
    }
    // 获取内力的百分比
    function geForcePercent(){
        var max_force = g_obj_map.get("msg_attrs").get("max_force");
        var force = g_obj_map.get("msg_attrs").get("force");
        var forcePercent = parseInt(force/max_force*100);
        return forcePercent;
    }

    var out = $('#out .out');
    out.each(function(){
        if($(this).hasClass('done'))return;
        $(this).addClass('done');

        var txt = $(this).text();

        var hitDesList = ['刺你','扫你','指你','至你','围绕着你','卷你','要你','将你','钻入你','穿过你','向你','在你','准你','点你','劈你','取你','抓破你','往你','奔你','朝你','击你','斩你','对着你','扑你','你一时','你难辨','你如','你淬','你竭力','你已是','你被震','你挡无可挡','你大惊失色','你的对攻无法击破','你一不留神'];
        for(var i = 0; i<hitDesList.length; i++){
            var hitText = hitDesList[i];
            if(txt.indexOf(hitText) != '-1'){
                mySkillLists = "覆雨剑法；如来神掌；九天龙吟剑；排云神掌；织冰剑法；翻云刀法；雪饮狂刀；孔雀翎；飞刀绝技";
                doKillSet();
                return;
            }
        }
    });

    var hp = geKeePercent();
    var qiNumber = gSocketMsg.get_xdz();
    if(qiNumber<3)return;
    if(hp < 50){
        mySkillLists = "茅山道术；天邪神功";
        doKillSet();
        return;
    }
    if(qiNumber > 9){
        mySkillLists = "覆雨剑法；如来神掌；九天龙吟剑；排云神掌；织冰剑法；翻云刀法；雪饮狂刀；孔雀翎；飞刀绝技";
        doKillSet();
        return;
    }

}
/* 对招 方法 :end */

//天剑-------------------------------------------
createButton('天剑目标',killTianJianTargetFunc);
var TianJianNPCList = [ "天剑谷卫士"];//"天剑", "天剑真身", "虹风", "虹雨","虹雷", "虹电",
var killTianJianIntervalFunc =  null;
var currentNPCIndex = 0;
function killTianJianTargetFunc(){
    if (btnList["天剑目标"].innerText == '天剑目标'){
        currentNPCIndex = 1;
        btnList["天剑目标"].innerText ='停止天剑目标';
        killTianJianIntervalFunc = setInterval(killTianJian, 500);

    }else{
        btnList["天剑目标"].innerText ='天剑目标';
        clearInterval(killTianJianIntervalFunc);
    }
}

function killTianJian(){
    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
    }
    getTianJianTargetCode();
    if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
        currentNPCIndex = 0;
        clickButton('prev_combat');
    }
}
function getTianJianTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        thisonclick = peopleList[i].getAttribute('onclick');
        if (TianJianNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
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
        targetCode = thisonclick.split("'")[1].split(" ")[1];
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillTianJianInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillTianJianInfo(){
    var TianJianInfo = $('span').text();
    if (TianJianInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
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

//随机走
createButton('随机走',RandomMoveFunc);
var MoveTrigger = 0;
function RandomMoveFunc(){
    if(MoveTrigger == 0){
        MoveTrigger = 1;
        btnList["随机走"].innerText  = '自己走';
        var RandomMove = setInterval(random_move,500);
    }else{
        MoveTrigger = 0;
        btnList["随机走"].innerText  = '随机走';
        clearInterval(RandomMove);
    }
    function random_move() {
        if($('#skill_1')[0]===undefined){
            var v = Math.random();
            if (v < 0.125) clickButton("go north");
            else if (v < 0.25) clickButton("go northeast");
            else if (v < 0.375) clickButton("go east");
            else if (v < 0.5) clickButton("go southeast");
            else if (v < 0.625) clickButton("go south");
            else if (v < 0.75) clickButton("go southwest");
            else if (v < 0.875) clickButton("go west");
            else clickButton("go northwest");
        }
    }
}

//createButton('买千年',buyqiannianFunc);
function buyqiannianFunc(){
    //    go('swords get_drop go');
    go('event_1_83700396');
}


(function (window) {

    function MyMap(){
        this.elements = [];
        this.size = function() {
            return this.elements.length;
        };
        this.isEmpty = function() {
            return 1 > this.elements.length;
        };
        this.clear = function() {
            this.elements = [];
        };
        this.put = function(a, b) {
            for (var c = !1, d = 0; d < this.elements.length; d++)
                if (this.elements[d].key == a) {
                    c = !0;
                    this.elements[d].value = b;
                    break;
                }
            !1 == c && this.elements.push({key:a, value:b});
        };
        this.remove = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key == a)
                        return this.elements.splice(c, 1), !0;
            } catch (d) {
                b = !1;
            }
            return b;
        };
        this.get = function(a) {
            try {
                for (var b = 0; b < this.elements.length; b++)
                    if (this.elements[b].key == a)
                        return this.elements[b].value;
            } catch (c) {
                return null;
            }
        };
        this.copy = function(a) {
            null == a && (a = new Map);
            try {
                for (var b = 0; b < this.elements.length; b++)
                    a.put(this.elements[b].key, this.elements[b].value);
                return a;
            } catch (c) {
                return null;
            }
        };
        this.element = function(a) {
            return 0 > a || a >= this.elements.length ? null : this.elements[a];
        };
        this.containsKey = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key ==
                        a) {
                        b = !0;
                        break;
                    }
            } catch (d) {
                b = !1;
            }
            return b;
        };
        this.containsValue = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].value == a) {
                        b = !0;
                        break;
                    }
            } catch (d) {
                b = !1;
            }
            return b;
        };
        this.values = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].value);
            return a;
        };
        this.keys = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].key);
            return a;
        };
    }

    function Question() {
        this.answers = new MyMap();
        this.answers.put("锦缎腰带是腰带类的第几级装备", "a");
        this.answers.put("扬州询问黑狗子能到下面哪个地点", "a");
        this.answers.put("跨服天剑谷每周六几点开启", "a");
        this.answers.put("青城派的道德经可以提升哪个属性", "c");
        this.answers.put("论剑中以下哪个不是晚月庄的技能", "d");
        this.answers.put("跨服天剑谷是星期几举行的", "b");
        this.answers.put("玉女剑法是哪个门派的技能", "b");
        this.answers.put("玉草帽可以在哪位npc那里获得？", "b");
        this.answers.put("逍遥林是第几章的地图", "c");
        this.answers.put("精铁棒可以在哪位npc那里获得", "d");
        this.answers.put("鎏金缦罗是披风类的第几级装备", "d");
        this.answers.put("神雕大侠在哪一章", "a");
        this.answers.put("华山武器库从哪个NPC进", "d");
        this.answers.put("首冲重置卡需要隔多少天才能在每日充值奖励中领取", "b");
        this.answers.put("以下哪个不是空空儿教导的武学", "b");
        this.answers.put('“迎梅客栈”场景是在哪个地图上', "d");
        this.answers.put('独孤求败有过几把剑', "d");
        this.answers.put('晚月庄的小贩在下面哪个地点', "a");
        this.answers.put('扬州询问黑狗能到下面哪个地点', "a");
        this.answers.put('“清音居”场景是在哪个地图上', "a");
        this.answers.put('一天能完成师门任务有多少个', "c");
        this.answers.put('林祖师是哪个门派的师傅', "a");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('去唐门地下通道要找谁拿钥匙', "a");
        this.answers.put('能增容貌的是下面哪个技能', "a");
        this.answers.put('铁手镯  可以在哪位npc那里获得', "a");
        this.answers.put('街头卖艺是挂机里的第几个任务', "a");
        this.answers.put('“三清宫”场景是在哪个地图上', "c");
        this.answers.put('论剑中以下哪个是大理段家的技能', "a");
        this.answers.put('藏宝图在哪里npc那里买', "a");
        this.answers.put('六脉神剑是哪个门派的绝学', "a");
        this.answers.put('如何将华山剑法从400级提升到440级', "d");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('在庙祝处洗杀气每次可以消除多少点', "a");
        this.answers.put('以下哪个宝石不能镶嵌到衣服', "a");
        this.answers.put('达摩杖的伤害是多少', "d");
        this.answers.put('嫁衣神功是哪个门派的技能', "b");
        this.answers.put('可以召唤金甲伏兵助战是哪个门派', "a");
        this.answers.put('端茶递水是挂机里的第几个任务', "b");
        this.answers.put('下列哪项战斗不能多个玩家一起战斗', "a");
        this.answers.put('寒玉床在哪里切割', "a");
        this.answers.put('拜师风老前辈需要正气多少', "b");
        this.answers.put('每天微信分享能获得多少元宝', "d");
        this.answers.put('丐帮的绝学是什么', "a");
        this.answers.put('以下哪个门派不是隐藏门派', "c");
        this.answers.put('玩家想修改名字可以寻找哪个NPC', "a");
        this.answers.put('论剑中以下哪个不是古墓派的的技能', "b");
        this.answers.put('安惜迩是在那个场景', "c");
        this.answers.put('神雕侠侣的时代背景是哪个朝代', "d");
        this.answers.put('论剑中以下哪个是华山派的技能的', "a");
        this.answers.put('夜皇在大旗门哪个场景', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('乌檀木刀可以在哪位npc那里获得', "d");
        this.answers.put('易容后保持时间是多久', "a");
        this.answers.put('以下哪个不是宋首侠教导的武学', "d");
        this.answers.put('踏云棍可以在哪位npc那里获得', "a");
        this.answers.put('玉女剑法是哪个门派的技能', "b");
        this.answers.put('根骨能提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁血大旗门的技能', "b");
        this.answers.put('明教的九阳神功有哪个特殊效果', "a");
        this.answers.put('辟邪剑法在哪学习', "b");
        this.answers.put('论剑中古墓派的终极师傅是谁', "d");
        this.answers.put('论剑中青城派的终极师傅是谁', "d");
        this.answers.put('逍遥林怎么弹琴可以见到天山姥姥', "b");
        this.answers.put('论剑一次最多能突破几个技能', "c");
        this.answers.put('劈雳拳套有几个镶孔', "a");
        this.answers.put('仓库最多可以容纳多少种物品', "b");
        this.answers.put('以下不是天宿派师傅的是哪个', "c");
        this.answers.put('易容术在哪学习', "b");
        this.answers.put('瑷伦在晚月庄的哪个场景', "b");
        this.answers.put('羊毛斗篷是披风类的第几级装备', "a");
        this.answers.put('弯月刀可以在哪位npc那里获得', "b");
        this.answers.put('骆云舟在乔阴县的哪个场景', "b");
        this.answers.put('屠龙刀是什么级别的武器', "a");
        this.answers.put('天蚕围腰可以镶嵌几颗宝石', "d");
        this.answers.put('“蓉香榭”场景是在哪个地图上', "c");
        this.answers.put('施令威在哪个地图', "b");
        this.answers.put('扬州在下面哪个地点的npc处可以获得玉佩', "c");
        this.answers.put('拜师铁翼需要多少内力', "b");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('"白玉牌楼"场景是在哪个地图上', "c");
        this.answers.put('宝玉鞋在哪获得', "a");
        this.answers.put('落英神剑掌是哪个门派的技能', "b");
        this.answers.put('下面哪个门派是正派', "a");
        this.answers.put('兑换易容面具需要多少玄铁碎片', "c");
        this.answers.put('以下哪些物品是成长计划第五天可以领取的', "b");
        this.answers.put('论剑中以下哪个是晚月庄的人物', "a");
        this.answers.put('论剑中以下哪个不是魔教的技能', "a");
        this.answers.put('匕首加什么属性', "c");
        this.answers.put('钢丝甲衣可以在哪位npc那里获得', "d");
        this.answers.put('论剑中花紫会的师傅是谁', "c");
        this.answers.put('暴雨梨花针的伤害是多少', "c");
        this.answers.put('吸血蝙蝠在下面哪个地图', "a");
        this.answers.put('论剑中以下是峨嵋派技能的是哪个', "a");
        this.answers.put('蓝止萍在晚月庄哪个小地图', "b");
        this.answers.put('下面哪个地点不是乔阴县的', "d");
        this.answers.put('领取消费积分需要寻找哪个NPC', "c");
        this.answers.put('下面哪个不是门派绝学', "d");
        this.answers.put('人物背包最多可以容纳多少种物品', "a");
        this.answers.put('什么装备不能镶嵌黄水晶', "d");
        this.answers.put('古灯大师在大理哪个场景', "c");
        this.answers.put('草帽可以在哪位npc那里获得', "b");
        this.answers.put('西毒蛇杖的伤害是多少', "c");
        this.answers.put('成长计划六天可以领取多少银两', "d");
        this.answers.put('朱老伯在华山村哪个小地图', "b");
        this.answers.put('论剑中以下哪个是唐门的技能', "b");
        this.answers.put('游龙散花是哪个门派的阵法', "d");
        this.answers.put('高级乾坤再造丹加什么', "b");
        this.answers.put('唐门的唐门毒经有哪个特殊效果', "a");
        this.answers.put('葛伦在大招寺的哪个场景', "b");
        this.answers.put('“三清殿”场景是在哪个地图上', "b");
        this.answers.put('哪样不能获得玄铁碎片', "c");
        this.answers.put('在哪里捏脸提升容貌', "d");
        this.answers.put('论剑中以下哪个是天邪派的技能', "b");
        this.answers.put('向师傅磕头可以获得什么', "b");
        this.answers.put('骆云舟在哪一章', "c");
        this.answers.put('论剑中以下哪个不是唐门的技能', "c");
        this.answers.put('华山村王老二掉落的物品是什么', "a");
        this.answers.put('下面有什么是寻宝不能获得的', "c");
        this.answers.put('寒玉床需要切割多少次', "d");
        this.answers.put('绿宝石加什么属性', "c");
        this.answers.put('魏无极处读书可以读到多少级', "a");
        this.answers.put('天山姥姥在逍遥林的哪个场景', "d");
        this.answers.put('天羽奇剑是哪个门派的技能', "a");
        this.answers.put('大招寺的铁布衫有哪个特殊效果', "c");
        this.answers.put('挖剑冢可得什么', "a");
        this.answers.put('灭绝师太在峨眉山哪个场景', "a");
        this.answers.put('论剑是星期几举行的', "c");
        this.answers.put('柳淳风在雪亭镇哪个场景', "b");
        this.answers.put('萧辟尘在哪一章', "d");
        this.answers.put('论剑中以下哪个是明教的技能', "b");
        this.answers.put('天邪派在哪里拜师', "b");
        this.answers.put('钨金腰带是腰带类的第几级装备', "d");
        this.answers.put('灭绝师太在第几章', "c");
        this.answers.put('一指弹在哪里领悟', "b");
        this.answers.put('翻译梵文一次多少银两', "d");
        this.answers.put('刀法基础在哪掉落', "a");
        this.answers.put('黯然消魂掌有多少招式', "c");
        this.answers.put('黑狗血在哪获得', "b");
        this.answers.put('雪蕊儿在铁雪山庄的哪个场景', "d");
        this.answers.put('东方教主在魔教的哪个场景', "b");
        this.answers.put('以下属于正派的门派是哪个', "a");
        this.answers.put('选择武学世家会影响哪个属性', "a");
        this.answers.put('寒玉床睡觉一次多久', "c");
        this.answers.put('魏无极在第几章', "a");
        this.answers.put('孙天灭是哪个门派的师傅', "c");
        this.answers.put('易容术在哪里学习', "a");
        this.answers.put('哪个NPC掉落拆招基础', "a");
        this.answers.put('七星剑法是哪个门派的绝学', "a");
        this.answers.put('以下哪些物品不是成长计划第二天可以领取的', "c");
        this.answers.put('以下哪个门派是中立门派', "a");
        this.answers.put('黄袍老道是哪个门派的师傅', "c");
        this.answers.put('舞中之武是哪个门派的阵法', "b");
        this.answers.put('隐者之术是那个门派的阵法', "a");
        this.answers.put('踏雪无痕是哪个门派的技能', "b");
        this.answers.put('以下哪个不是在雪亭镇场景', "d");
        this.answers.put('排行榜最多可以显示多少名玩家', "a");
        this.answers.put('貂皮斗篷是披风类的第几级装备', "b");
        this.answers.put('武当派的绝学技能是以下哪个', "d");
        this.answers.put('兰花拂穴手是哪个门派的技能', "a");
        this.answers.put('油流麻香手是哪个门派的技能', "a");
        this.answers.put('披星戴月是披风类的第几级装备', "d");
        this.answers.put('当日最低累积充值多少元即可获得返利', "b");
        this.answers.put('追风棍在哪里获得', "b");
        this.answers.put('长剑在哪里可以购买', "a");
        this.answers.put('莫不收在哪一章', "a");
        this.answers.put('读书写字最高可以到多少级', "b");
        this.answers.put('哪个门派拜师没有性别要求', "d");
        this.answers.put('墨磷腰带是腰带类的第几级装备', "d");
        this.answers.put('不属于白驼山的技能是什么', "b");
        this.answers.put('婆萝蜜多心经是哪个门派的技能', "b");
        this.answers.put('乾坤一阳指是哪个师傅教的', "a");
        this.answers.put('“日月洞”场景是在哪个地图上', "b");
        this.answers.put('倚天屠龙记的时代背景哪个朝代', "a");
        this.answers.put('八卦迷阵是哪个门派的阵法', "b");
        this.answers.put('七宝天岚舞是哪个门派的技能', "d");
        this.answers.put('断云斧是哪个门派的技能', "a");
        this.answers.put('跨服需要多少级才能进入', "c");
        this.answers.put('易容面具需要多少玄铁兑换', "c");
        this.answers.put('张教主在明教哪个场景', "d");
        this.answers.put('玉蜂浆在哪个地图获得', "a");
        this.answers.put('在逍遥派能学到的技能是哪个', "a");
        this.answers.put('每日微信分享可以获得什么奖励', "a");
        this.answers.put('红宝石加什么属性', "b");
        this.answers.put('金玉断云是哪个门派的阵法', "a");
        this.answers.put('正邪任务一天能做几次', "a");
        this.answers.put('白金戒指可以在哪位npc那里获得', "b");
        this.answers.put('金戒指可以在哪位npc那里获得', "d");
        this.answers.put('柳淳风在哪哪一章', "c");
        this.answers.put('论剑是什么时间点正式开始', "a");
        this.answers.put('黯然销魂掌是哪个门派的技能', "a");
        this.answers.put('在正邪任务中不能获得下面什么奖励', "d");
        this.answers.put('孤儿出身增加什么', "d");
        this.answers.put('丁老怪在星宿海的哪个场景', "b");
        this.answers.put('读书写字301-400级在哪里买书', "c");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼长老”', "c");
        this.answers.put('以下属于邪派的门派是哪个', "b");
        this.answers.put('论剑中以下哪个不是丐帮的人物', "a");
        this.answers.put('论剑中青城派的第一个师傅是谁', "a");
        this.answers.put('以下哪个不是何不净教导的武学', "c");
        this.answers.put('吕进在哪个地图', "a");
        this.answers.put('拜师老毒物需要蛤蟆功多少级', "a");
        this.answers.put('蛇形刁手是哪个门派的技能', "b");
        this.answers.put('乌金玄火鞭的伤害是多少', "d");
        this.answers.put('张松溪在哪个地图', "c");
        this.answers.put('欧阳敏是哪个门派的', "b");
        this.answers.put('以下哪个门派是正派', "d");
        this.answers.put('成功易容成异性几次可以领取易容成就奖', "b");
        this.answers.put('论剑中以下不是峨嵋派技能的是哪个', "b");
        this.answers.put('城里抓贼是挂机里的第几个任务', "b");
        this.answers.put('每天的任务次数几点重置', "d");
        this.answers.put('莲花掌是哪个门派的技能', "a");
        this.answers.put('大招寺的金刚不坏功有哪个特殊效果', "a");
        this.answers.put('多少消费积分可以换取黄金钥匙', "b");
        this.answers.put('什么装备都能镶嵌的是什么宝石', "c");
        this.answers.put('什么影响打坐的速度', "c");
        this.answers.put('蓝止萍在哪一章', "c");
        this.answers.put('寒玉床睡觉修炼需要多少点内力值', "c");
        this.answers.put('武穆兵法通过什么学习', "a");
        this.answers.put('倒乱七星步法是哪个门派的技能', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼护法”', "b");
        this.answers.put('兽皮鞋可以在哪位npc那里获得', "b");
        this.answers.put('寒玉床在那个地图可以找到', "a");
        this.answers.put('易容术可以找哪位NPC学习', "b");
        this.answers.put('铁戒指可以在哪位npc那里获得', "a");
        this.answers.put('通灵需要寻找哪个NPC', "c");
        this.answers.put('功德箱在雪亭镇的哪个场景', "c");
        this.answers.put('蓝宝石加什么属性', "a");
        this.answers.put('每天分享游戏到哪里可以获得20元宝', "a");
        this.answers.put('选择书香门第会影响哪个属性', "b");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('新手礼包在哪领取', "c");
        this.answers.put('春风快意刀是哪个门派的技能', "b");
        this.answers.put('朱姑娘是哪个门派的师傅', "a");
        this.answers.put('出生选武学世家增加什么', "a");
        this.answers.put('以下哪个宝石不能镶嵌到内甲', "a");
        this.answers.put('生死符的伤害是多少', "a");
        this.answers.put('扬文的属性', "a");
        this.answers.put('云问天在哪一章', "a");
        this.answers.put('首次通过桥阴县不可以获得那种奖励', "a");
        this.answers.put('剑冢在哪个地图', "a");
        this.answers.put('在哪里消杀气', "a");
        this.answers.put('闯楼每多少层有称号奖励', "a");
        this.answers.put('打坐增长什么属性', "a");
        this.answers.put('从哪个npc处进入跨服战场', "a");
        this.answers.put('下面哪个是天邪派的师傅', "a");
        this.answers.put('每天能做多少个谜题任务', "a");
        this.answers.put('小男孩在华山村哪里', "a");
        this.answers.put('追风棍可以在哪位npc那里获得', "a");
        this.answers.put('逍遥派的绝学技能是以下哪个', "a");
        this.answers.put('沧海护腰是腰带类的第几级装备', "a");
        this.answers.put('花花公子在哪个地图', "a");
        this.answers.put('每次合成宝石需要多少银两', "a");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('打排行榜每天可以完成多少次', "a");
        this.answers.put('夜行披风是披风类的第几级装备', "a");
        this.answers.put('白蟒鞭的伤害是多少', "a");
        this.answers.put('易容术向谁学习', "a");
        this.answers.put('支线对话书生上魁星阁二楼杀死哪个NPC给10元宝', "a");
        this.answers.put('斗转星移是哪个门派的技能', "a");
        this.answers.put('杨过在哪个地图', "a");
        this.answers.put('钻石项链在哪获得', "a");
        this.answers.put('多少消费积分换取黄金宝箱', "a");
        this.answers.put('每突破一次技能有效系数加多少', "a");
        this.answers.put('茅山学习什么技能招宝宝', "a");
        this.answers.put('陆得财在乔阴县的哪个场景', "a");
        this.answers.put('独龙寨是第几个组队副本', "a");
        this.answers.put('以下哪个是花紫会的祖师', "a");
        this.answers.put('金弹子的伤害是多少', "a");
        this.answers.put('明月帽要多少刻刀摩刻', "a");
        this.answers.put('论剑输一场获得多少论剑积分', "a");
        this.answers.put('论剑中以下哪个是铁血大旗门的师傅', "a");
        this.answers.put('8级的装备摹刻需要几把刻刀', "a");
        this.answers.put('赠送李铁嘴银两能够增加什么', "a");
        this.answers.put('金刚不坏功有什么效果', "a");
        this.answers.put('少林的易筋经神功有哪个特殊效果', "a");
        this.answers.put('大旗门的修养术有哪个特殊效果', "a");
        this.answers.put('金刚杖的伤害是多少', "a");
        this.answers.put('双儿在扬州的哪个小地图', "a");
        this.answers.put('花不为在哪一章', "a");
        this.answers.put('铁项链可以在哪位npc那里获得', "a");
        this.answers.put('武学世家加的什么初始属性', "a");
        this.answers.put('师门磕头增加什么', "a");
        this.answers.put('全真的道家心法有哪个特殊效果', "a");
        this.answers.put('功德箱捐香火钱有什么用', "a");
        this.answers.put('雪莲有什么作用', "a");
        this.answers.put('论剑中以下哪个是花紫会的技能', "a");
        this.answers.put('柳文君所在的位置', "a");
        this.answers.put('岳掌门在哪一章', "a");
        this.answers.put('长虹剑在哪位npc那里获得？', "a");
        this.answers.put('副本一次最多可以进几人', "a");
        this.answers.put('师门任务每天可以完成多少次', "a");
        this.answers.put('逍遥步是哪个门派的技能', "a");
        this.answers.put('新人礼包在哪个npc处兑换', "a");
        this.answers.put('使用朱果经验潜能将分别增加多少', "a");
        this.answers.put('欧阳敏在哪一章', "a");
        this.answers.put('辟邪剑法是哪个门派的绝学技能', "a");
        this.answers.put('在哪个npc处可以更改名字', "a");
        this.answers.put('毒龙鞭的伤害是多少', "a");
        this.answers.put('晚月庄主线过关要求', "a");
        this.answers.put('怎么样获得免费元宝', "a");
        this.answers.put('成长计划需要多少元宝方可购买', "a");
        this.answers.put('青城派的道家心法有哪个特殊效果', "a");
        this.answers.put('藏宝图在哪个NPC处购买', "a");
        this.answers.put('丁老怪是哪个门派的终极师傅', "a");
        this.answers.put('斗转星移阵是哪个门派的阵法', "a");
        this.answers.put('挂机增长什么', "a");
        this.answers.put('鹰爪擒拿手是哪个门派的技能', "a");
        this.answers.put('八卦迷阵是那个门派的阵法', "a");
        this.answers.put('一天能完成挑战排行榜任务多少次', "a");
        this.answers.put('论剑每天能打几次', "a");
        this.answers.put('需要使用什么衣服才能睡寒玉床', "a");
        this.answers.put('张天师是哪个门派的师傅', "a");
        this.answers.put('技能柳家拳谁教的', "a");
        this.answers.put('九阴派梅师姐在星宿海哪个场景', "a");
        this.answers.put('哪个npc处可以捏脸', "a");
        this.answers.put('论剑中步玄派的师傅是哪个', "a");
        this.answers.put('宝玉鞋击杀哪个npc可以获得', "a");
        this.answers.put('慕容家主在慕容山庄的哪个场景', "a");
        this.answers.put('闻旗使在哪个地图', "a");
        this.answers.put('虎皮腰带是腰带类的第几级装备', "a");
        this.answers.put('在哪里可以找到“香茶”？', "a");
        this.answers.put('打造刻刀需要多少个玄铁', "a");
        this.answers.put('包家将是哪个门派的师傅', "a");
        this.answers.put('论剑中以下哪个是天邪派的人物', "a");
        this.answers.put('升级什么技能可以提升根骨', "a");
        this.answers.put('NPC公平子在哪一章地图', "a");
        this.answers.put('逄义是在那个场景', "a");
        this.answers.put('锻造一把刻刀需要多少银两', "a");
        this.answers.put('以下哪个不是岳掌门教导的武学', "a");
        this.answers.put('捏脸需要寻找哪个NPC？', "a");
        this.answers.put('论剑中以下哪个是晚月庄的技能', "a");
        this.answers.put('碧海潮生剑在哪位师傅处学习', "a");
        this.answers.put('干苦力是挂机里的第几个任务', "a");
        this.answers.put('铁血大旗门云海心法可以提升什么', "a");
        this.answers.put('以下哪些物品是成长计划第四天可以领取的？', "a");
        this.answers.put('易容术多少级才可以易容成异性NPC', "a");
        this.answers.put('摹刻扬文需要多少把刻刀？', "a");
        this.answers.put('正邪任务中客商的在哪个地图', "a");
        this.answers.put('白驼山第一位要拜的师傅是谁', "a");
        this.answers.put('枯荣禅功是哪个门派的技能', "a");
        this.answers.put('漫天花雨匕在哪获得', "a");
        this.answers.put('摧心掌是哪个门派的技能', "a");
        this.answers.put('“花海”场景是在哪个地图上？', "a");
        this.answers.put('雪蕊儿是哪个门派的师傅', "a");
        this.answers.put('新手礼包在哪里领取', "a");
        this.answers.put('论语在哪购买', "a");
        this.answers.put('银丝链甲衣可以在哪位npc那里获得？', "a");
        this.answers.put('乾坤大挪移属于什么类型的武功', "a");
        this.answers.put('移开明教石板需要哪项技能到一定级别', "a");
        this.answers.put('开通VIP月卡最低需要当天充值多少元方有购买资格', "a");
        this.answers.put('黯然销魂掌有多少招式', "c");
        this.answers.put('“跪拜坪”场景是在哪个地图上', "b");
        this.answers.put('孤独求败称号需要多少论剑积分兑换', "b");
        this.answers.put('孔雀氅可以镶嵌几颗宝石', "b");
        this.answers.put('客商在哪一章', "b");
        this.answers.put('疯魔杖的伤害是多少', "b");
        this.answers.put('丐帮的轻功是哪个', "b");
        this.answers.put('霹雳掌套的伤害是多少', "b");
        this.answers.put('方媃是哪个门派的师傅', "b");
        this.answers.put('拜师张三丰需要多少正气', "b");
        this.answers.put('天师阵法是哪个门派的阵法', "b");
        this.answers.put('选择商贾会影响哪个属性', "b");
        this.answers.put('银手镯可以在哪位npc那里获得？', "b");
        this.answers.put('清风寨在哪个地图', "d");
        this.answers.put('清风寨在哪', "b");
        this.answers.put('在雪亭镇李火狮可以学习多少级柳家拳', "b");
        this.answers.put('华山施戴子掉落的物品是什么', "b");
        this.answers.put('尹志平是哪个门派的师傅', "b");
        this.answers.put('病维摩拳是哪个门派的技能', "b");
        this.answers.put('茅山的绝学是什么', "b");
        this.answers.put('茅山派的轻功是什么', "b");
        this.answers.put('风泉之剑可以在哪位npc那里获得？', "b");
        this.answers.put('凌波微步是哪个门派的技能', "b");
        this.answers.put('藏宝图在哪个npc处购买', "b");
        this.answers.put('军营是第几个组队副本', "b");
        this.answers.put('北岳殿神像后面是哪位npc', "b");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('跨服是星期几举行的', "b");
        this.answers.put('学习屠龙刀法需要多少内力', "b");
        this.answers.put('高级乾坤再造丹是增加什么的', "b");
        this.answers.put('银项链可以在哪位npc那里获得', "b");
        this.answers.put('每天在线多少个小时即可领取消费积分', "b");
        this.answers.put('晚月庄的内功是什么', "b");
        this.answers.put('冰魄银针的伤害是多少', "b");
        this.answers.put('论剑中以下哪个是丐帮的技能', "b");
        this.answers.put('神雕大侠所在的地图', "b");
        this.answers.put('突破丹在哪里购买', "b");
        this.answers.put('白金手镯可以在哪位npc那里获得', "a");
        this.answers.put('金手镯可以在哪位npc那里获得', "b");
        this.answers.put('以下哪个不是梁师兄教导的武学', "b");
        this.answers.put('技能数量超过了什么消耗潜能会增加', "b");
        this.answers.put('白金项链可以在哪位npc那里获得', "b");
        this.answers.put('小龙女住的古墓是谁建造的', "b");
        this.answers.put('打开引路蜂礼包可以得到多少引路蜂', "b");
        this.answers.put('购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益', "b");
        this.answers.put('白玉腰束是腰带类的第几级装备', "b");
        this.answers.put('老顽童在全真教哪个场景', "b");
        this.answers.put('神雕侠侣的作者是', "b");
        this.answers.put('晚月庄的七宝天岚舞可以提升哪个属性', "b");
        this.answers.put('论剑在周几进行', "b");
        this.answers.put('vip每天不可以领取什么', "b");
        this.answers.put('每天有几次试剑', "b");
        this.answers.put('晚月庄七宝天岚舞可以提升什么', "b");
        this.answers.put('哪个分享可以获得20元宝', "b");
        this.answers.put('大保险卡可以承受多少次死亡后不降技能等级', "b");
        this.answers.put('凌虚锁云步是哪个门派的技能', "b");
        this.answers.put('屠龙刀法是哪个门派的绝学技能', "b");
        this.answers.put('金丝鞋可以在哪位npc那里获得', "b");
        this.answers.put('老毒物在白驮山的哪个场景', "b");
        this.answers.put('毒物阵法是哪个门派的阵法', "b");
        this.answers.put('以下哪个不是知客道长教导的武学', "b");
        this.answers.put('飞仙剑阵是哪个门派的阵法', "b");
        this.answers.put('副本完成后不可获得下列什么物品', "b");
        this.answers.put('晚月庄意寒神功可以提升什么', "b");
        this.answers.put('北冥神功是哪个门派的技能', "b");
        this.answers.put('论剑中以下哪个是青城派的技能', "b");
        this.answers.put('六阴追魂剑是哪个门派的技能', "b");
        this.answers.put('王铁匠是在那个场景', "b");
        this.answers.put('以下哪个是步玄派的祖师', "b");
        this.answers.put('在洛阳萧问天那可以学习什么心法', "b");
        this.answers.put('在哪个npc处能够升级易容术', "b");
        this.answers.put('摹刻10级的装备需要摩刻技巧多少级', "b");
        this.answers.put('师门任务什么时候更新', "b");
        this.answers.put('哪个npc属于全真七子', "b");
        this.answers.put('正邪任务中卖花姑娘在哪个地图', "b");
        this.answers.put('风老前辈在华山哪个场景', "b");
        this.answers.put('“留云馆”场景是在哪个地图上？', "b");
        this.answers.put('割鹿刀可以在哪位npc那里获得', "b");
        this.answers.put('论剑中以下哪个是大招寺的技能', "b");
        this.answers.put('全真的基本阵法有哪个特殊效果', "b");
        this.answers.put('论剑要在晚上几点前报名', "b");
        this.answers.put('碧磷鞭的伤害是多少？', "b");
        this.answers.put('一天能完成谜题任务多少个', "b");
        this.answers.put('正邪任务杀死好人增长什么', "b");
        this.answers.put('木道人在青城山的哪个场景', "b");
        this.answers.put('论剑中以下哪个不是大招寺的技能', "b");
        this.answers.put('“伊犁”场景是在哪个地图上？', "b");
        this.answers.put('“冰火岛”场景是在哪个地图上', "b");
        this.answers.put('“双鹤桥”场景是在哪个地图上', "b");
        this.answers.put('“百龙山庄”场景是在哪个地图上？', "b");
        this.answers.put('九阳神功是哪个门派的技能', "c");
        this.answers.put('树王坟在第几章节', "c");
        this.answers.put('阳刚之劲是哪个门派的阵法', "c");
        this.answers.put('上山打猎是挂机里的第几个任务', "c");
        this.answers.put('一张分身卡的有效时间是多久', "c");
        this.answers.put('锻造一把刻刀需要多少玄铁碎片锻造', "c");
        this.answers.put('论剑中以下哪个不是铁血大旗门的技能', "c");
        this.answers.put('如意刀是哪个门派的技能', "c");
        this.answers.put('跨服在哪个场景进入', "c");
        this.answers.put('在哪个NPC可以购买恢复内力的药品？', "c");
        this.answers.put('欧阳敏在唐门的哪个场景', "c");
        this.answers.put('密宗伏魔是哪个门派的阵法', "c");
        this.answers.put('孔雀氅是披风类的第几级装备？', "c");
        this.answers.put('天山折梅手是哪个门派的技能', "c");
        this.answers.put('玩家每天能够做几次正邪任务', "c");
        this.answers.put('柳淳风在哪一章', "c");
        this.answers.put('茅山天师正道可以提升什么', "c");
        this.answers.put('洪帮主在洛阳哪个场景', "c");
        this.answers.put('以下哪个不是全真七子？', "c");
        this.answers.put('云九天是哪个门派的师傅', "c");
        this.answers.put('摹刻烈日宝链需要多少级摩刻技巧', "c");
        this.answers.put('伏虎杖的伤害是多少', "c");
        this.answers.put('灵蛇杖法是哪个门派的技能', "c");
        this.answers.put('“子午楼”场景是在哪个地图上', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('石师妹哪个门派的师傅', "c");
        this.answers.put('烈火旗大厅是那个地图的场景', "c");
        this.answers.put('打土匪是挂机里的第几个任务', "c");
        this.answers.put('捏脸需要花费多少银两', "c");
        this.answers.put('大旗门的云海心法可以提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁雪山庄的技能', "c");
        this.answers.put('“白玉牌楼”场景是在哪个地图上', "c");
        this.answers.put('以下哪个宝石不能镶嵌到披风', "c");
        this.answers.put('魏无极身上掉落什么装备', "c");
        this.answers.put('以下不是步玄派的技能的哪个', "c");
        this.answers.put('“常春岛渡口”场景是在哪个地图上', "c");
        this.answers.put('北斗七星阵是第几个的组队副本', "c");
        this.answers.put('宝石合成一次需要消耗多少颗低级宝石', "c");
        this.answers.put('烈日项链可以镶嵌几颗宝石', "c");
        this.answers.put('达摩在少林哪个场景', "c");
        this.answers.put('积分商城在雪亭镇的哪个场景', "c");
        this.answers.put('全真的双手互搏有哪个特殊效果', "c");
        this.answers.put('论剑中以下哪个不是唐门的人物', "c");
        this.answers.put('棋道是哪个门派的技能', "c");
        this.answers.put('七星鞭的伤害是多少', "c");
        this.answers.put('富春茶社在哪一章', "c");
        this.answers.put('等级多少才能在世界频道聊天', "c");
        this.answers.put('以下哪个是封山派的祖师', "c");
        this.answers.put('论剑是星期几进行的', "c");
        this.answers.put('师门任务每天可以做多少个', "c");
        this.answers.put('风泉之剑加几点悟性', "c");
        this.answers.put('黑水伏蛟可以在哪位npc那里获得？', "c");
        this.answers.put('陆得财是哪个门派的师傅', "c");
        this.answers.put('拜师小龙女需要容貌多少', "c");
        this.answers.put('下列装备中不可摹刻的是', "c");
        this.answers.put('古灯大师是哪个门派的终极师傅', "c");
        this.answers.put('“翰墨书屋”场景是在哪个地图上', "c");
        this.answers.put('论剑中大招寺第一个要拜的师傅是谁', "c");
        this.answers.put('杨过小龙女分开多少年后重逢', "c");
        this.answers.put('选择孤儿会影响哪个属性', "c");
        this.answers.put('论剑中逍遥派的终极师傅是谁', "c");
        this.answers.put('不可保存装备下线多久会消失', "c");
        this.answers.put('一个队伍最多有几个队员', "c");
        this.answers.put('以下哪个宝石不能镶嵌到戒指', "c");
        this.answers.put('论剑是每周星期几', "c");
        this.answers.put('茅山在哪里拜师', "c");
        this.answers.put('以下哪个宝石不能镶嵌到腰带', "c");
        this.answers.put('黄宝石加什么属性', "c");
        this.answers.put('茅山可以招几个宝宝', "c");
        this.answers.put('唐门密道怎么走', "c");
        this.answers.put('论剑中以下哪个不是大理段家的技能', "c");
        this.answers.put('论剑中以下哪个不是魔教的人物', "d");
        this.answers.put('每天能做多少个师门任务', "c");
        this.answers.put('一天能使用元宝做几次暴击谜题', "c");
        this.answers.put('成长计划第七天可以领取多少元宝', "d");
        this.answers.put('每天能挖几次宝', "d");
        this.answers.put('日月神教大光明心法可以提升什么', "d");
        this.answers.put('在哪个npc处领取免费消费积分', "d");
        this.answers.put('副本有什么奖励', "d");
        this.answers.put('论剑中以下不是华山派的人物的是哪个', "d");
        this.answers.put('论剑中以下哪个不是丐帮的技能', "d");
        this.answers.put('以下哪个不是慧名尊者教导的技能', "d");
        this.answers.put('慕容山庄的斗转星移可以提升哪个属性', "d");
        this.answers.put('论剑中以下哪个不是铁雪山庄的技能', "d");
        this.answers.put('师门任务一天能完成几次', "d");
        this.answers.put('以下有哪些物品不是每日充值的奖励', "d");
        this.answers.put('论剑中以下哪个不是华山派的技能的', "d");
        this.answers.put('武穆兵法提升到多少级才能出现战斗必刷', "d");
        this.answers.put('论剑中以下哪个不是全真教的技能', "d");
        this.answers.put('师门任务最多可以完成多少个', "d");
        this.answers.put('张三丰在哪一章', "d");
        this.answers.put('倚天剑加多少伤害', "d");
        this.answers.put('以下谁不精通降龙十八掌', "d");
        this.answers.put('论剑中以下哪个不是明教的技能', "d");
        this.answers.put('受赠的消费积分在哪里领取', "d");
        this.answers.put('以下哪个不是道尘禅师教导的武学', "d");
        this.answers.put('古墓多少级以后才能进去', "d");
        this.answers.put('千古奇侠称号需要多少论剑积分兑换', "d");
        this.answers.put('魔鞭诀在哪里学习', "d");
        this.answers.put('通灵需要花费多少银两', "d");
        this.answers.put('白银宝箱礼包多少元宝一个', "d");
        this.answers.put('以下哪个不是论剑的皮肤', "d");
        this.answers.put('小李飞刀的伤害是多少', "d");
        this.answers.put('下面哪个npc不是魔教的', "d");
        this.answers.put('天蚕围腰是腰带类的第几级装备', "d");
        this.answers.put('黄岛主在桃花岛的哪个场景', "d");
        this.answers.put('宝玉帽可以在哪位npc那里获得？', "d");
        this.answers.put('什么影响攻击力', "d");
        this.answers.put('紫宝石加什么属性', "d");
        this.answers.put('少林的混元一气功有哪个特殊效果', "d");
        this.answers.put('以下哪个是晚月庄的祖师', "d");
        this.answers.put('以下不是隐藏门派的是哪个', "d");
        this.answers.put('第一个副本需要多少等级才能进入', "d");
        this.answers.put('风泉之剑在哪里获得', "d");
        this.answers.put('镖局保镖是挂机里的第几个任务', "d");
        this.answers.put('下面哪个不是古墓的师傅', "d");
        this.answers.put('每个玩家最多能有多少个好友', "b");
        this.answers.put('以下哪个不是在扬州场景', "d");
        this.answers.put('茅山的天师正道可以提升哪个属性', "d");
        this.answers.put('“无名山脚”场景是在哪个地图上', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼楼主”', "d");
        this.answers.put('充值积分不可以兑换下面什么物品', "d");
        this.answers.put('魔教的大光明心法可以提升哪个属性', "d");
        this.answers.put('以下哪些物品不是成长计划第三天可以领取的', "d");
        this.answers.put('论剑中以下哪个不是峨嵋派可以拜师的师傅', "d");
        this.answers.put('哪个技能不是魔教的', "d");
        this.answers.put('沧海护腰可以镶嵌几颗宝石', "d");
        this.answers.put('城里打擂是挂机里的第几个任务', "d");
        this.answers.put('以下哪个不是鲁长老教导的武学', "d");
        this.answers.put('以下哪些物品不是成长计划第一天可以领取的', "d");
        this.answers.put('包拯在哪一章', "d");
        this.answers.put('张天师在茅山哪个场景', "d");
        this.answers.put('山河藏宝图需要在哪个NPC手里购买？', "d");
        this.answers.put('影响你出生的福缘的出生是', "d");
        this.answers.put('张三丰在武当山哪个场景', "d");
        this.answers.put('春秋水色斋需要多少杀气才能进入', "d");
        this.answers.put('论剑中以下哪个不是是晚月庄的技能', "d");
        this.answers.put('大乘佛法有什么效果', "d");
        this.answers.put('正邪任务最多可以完成多少个', "d");
        this.answers.put('高级突破丹多少元宝一颗', "d");
        this.answers.put('清虚道长在哪一章', "d");
        this.answers.put('在战斗界面点击哪个按钮可以进入聊天界面', "d");
        this.answers.put('“鹰记商号”场景是在哪个地图上？', "d");
        this.answers.put('改名字在哪改', "d");
        this.answers.put('以下哪个不是在洛阳场景', "d");
        this.answers.put('金项链可以在哪位npc那里获得', "d");
        this.answers.put('首次通过乔阴县不可以获得那种奖励？', "a");

        this.answer = function(a) {
            //          alert("答案是：" + a);
            overrideclick("question " + a,0);
            //            go("question");
        };

        this.dispatchMessage = function(b) {
            var type = b.get("type"), msg= b.get("msg");
            if (type == "show_html_page" && msg.indexOf("知识问答第") > 0) {
                console.log(msg);
                if (msg.indexOf("回答正确！") > 0) {
                    overrideclick("question");
                    return;
                }

                var q = this.answers.keys();
                for (var i in q) {
                    var k = q[i];

                    if (msg.indexOf(k) > 0) {
                        this.answer(this.answers.get(k));
                        break;
                    }
                }
            }
            if (type=="notice"||type=="main_msg"){
                if (msg.match("武林知识问答次数已经达到限额")!=null){
                    console.log("今天知识问答结束了");
                    questionTrigger = 1;
                    questionFunc();
                }
            }
        };
    }
    var question = new Question();


    window.go = function(dir) {
        var d = dir.split(";");
        for (var i = 0; i < d.length; i++)
            overrideclick(d[i], 0);
    };

    function Trigger(r, h, c, n) {
        this.regexp = r;
        this.handler = h;
        this.class = c;
        this.name = n;

        this.enabled = true;

        this.trigger = function(line) {
            if (!this.enabled) return;

            if (!this.regexp.test(line)) return;

            console.log("触发器: " + this.regexp + "触发了");
            var m = line.match(this.regexp);
            this.handler(m);
        };

        this.enable = function() {
            this.enabled = true;
        };

        this.disable = function() {
            this.enabled = false;
        };

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
        };

        this.newTrigger = function(r, h, c, n) {
            var t = new Trigger(r, h, c, n);
            if (n) {
                for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                    if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1);
                }
            }

            this.allTriggers.push(t);

            return t;
        };

        this.enableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.enable();
            }
        };

        this.disableTriggerByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) t.disable();
            }
        };

        this.enableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.enable();
            }
        };

        this.disableByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.class == c) t.disable();
            }
        };

        this.removeByCls = function(c) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t && t.class == c) this.allTriggers.splice(i, 1);
            }
        };

        this.removeByName = function(n) {
            for (var i = this.allTriggers.length - 1; i >= 0; i--) {
                t = this.allTriggers[i];
                if (t.name == n) this.allTriggers.splice(i, 1);
            }
        };
    }
    window.triggers = new Triggers;

    triggers.newTrigger(/似乎以下地方藏有宝物(.*)/, function(m) {
        m = m[1].split(/\d+/);
        var bl_found = false;
        for (var i = 0, l = m.length; i < l; i++) {
            var a = m[i];
            console.log(a);
            if (/一片翠绿的草地/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/大诗人白居易之墓，墓碑上刻着“唐少傅白公墓”。四周环绕着冬青。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在雪亭镇南边的一家小客栈里，这家客栈虽小，却是方圆五百里/.test(a)) {
                jh('xt');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇镇前广场的空地，地上整齐地铺著大石板。广场中央有一个木头搭的架子，经过多年的风吹日晒雨淋，看来非常破旧。四周建筑林立。往西你可以看到一间客栈，看来生意似乎很好。/.test(a)) {
                jh('xt');
                go('e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间十分老旧的城隍庙，在你面前的神桌上供奉著一尊红脸的城隍，庙虽老旧，但是神案四周已被香火薰成乌黑的颜色，显示这里必定相当受到信徒的敬仰。/.test(a)) {
                jh('xt');
                go('e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，弯弯曲曲往东北一路盘旋上山，北边有一间城隍庙，往西则是雪亭镇的街道。/.test(a)) {
                jh('xt');
                go('e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条普通的黄土小径，小径往西南通往一处山间的平地，从这里可以望见不少房屋错落在平地上，往东北则一路上山。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条说宽不宽，说窄倒也不窄的山路，路面用几块生满青苔的大石铺成，西面是一段坡地，从这里可以望见西边有几间房屋错落在林木间，东面则是山壁，山路往西南衔接一条黄土小径，往北则是通往山上的石阶。/.test(a)) {
                jh('xt');
                go('e;e;s;ne;ne;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街口，往北是一个热闹的广场，南边是条小路通往一座林子，东边则有一条小径沿著山腰通往山上，往西是一条比较窄的街道，参差不齐的瓦屋之间传来几声犬吠。从这里向东南走就是进出关的驿道了。/.test(a)) {
                jh('xt');
                go('e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的街道，你的北边有一家客栈，从这里就可以听到客栈里人们饮酒谈笑/.test(a)) {
                jh('xt');
                go('e;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间宽敞的书院，虽然房子看起来很老旧了，但是打扫得很整洁，墙壁上挂著一幅山水画，意境颇为不俗，书院的大门开在北边，西边有一扇木门通往边厢。/.test(a)) {
                jh('xt');
                go('e;s;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条宽敞坚实的青石板铺成的大道，路上车马的痕迹已经在路面上留下一条条明显的凹痕，往东是一条较小的街道通往雪亭镇。/.test(a)) {
                jh('xt');
                go('e;s;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的街道上，东边不远处有一间高大的院子，门口立著一根粗大的旗杆/.test(a)) {
                jh('xt');
                go('e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间素来以公平信用著称的钱庄，钱庄的老板还是个曾经中过举人的读书人/.test(a)) {
                jh('xt');
                go('e;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一间大宅院的入口，两只巨大的石狮镇守在大门的两侧，一阵阵吆喝与刀剑碰撞的声音从院子中传来，通过大门往东可以望见许多身穿灰衣的汉子正在操练。/.test(a)) {
                jh('xt');
                go('e;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正站在一个宽敞的教练场中，地上铺著黄色的细砂，许多人正在这里努力地操练著，北边是一间高大的兵器厅，往东则是武馆师父们休息的大厅。/.test(a)) {
                jh('xt');
                go('e;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间堆满各式兵器、刀械的储藏室，各式武器都依照种类、长短、依次放在一起，并且擦拭得一尘不染，储藏室的出口在你的南边，面对出口的左手边有一个架子/.test(a)) {
                jh('xt');
                go('e;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的正厅，五张太师椅一字排开面对著门口，这是武馆中四位大师傅与馆主柳淳风的座位/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆中的天井，往西走可以回到正厅/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间整理得相当乾净的书房，红木桌椅上铺著蓝绸巾，显得十分考究，西面的立著一个书架，上面放著一排排的古书，往南走出房门可以看到天井。/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间布置得相当雅致的厢房，从窗子可以看到北边的天井跟南边的庭园中各式各样的奇花异草，以及他们所带来的淡淡香气，厢房的东面墙上还挂著一幅仕女图/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这里是淳风武馆的内院，平常武馆弟子没有馆主的允许是不敢到这里来的/.test(a)) {
                jh('xt');
                go('e;n;e;e;e;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/你现在正走在雪亭镇的大街，往南直走不远处是镇上的广场，在你的东边是一间大宅院/.test(a)) {
                jh('xt');
                go('e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一间打铁铺子，从火炉中冒出的火光将墙壁映得通红，屋子的角/.test(a)) {
                jh('xt');
                go('e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，东边有一栋陈旧的建□，看起来像是什麽店铺，但是并没有任何招牌，只有一扇门上面写著一个大大的/.test(a)) {
                jh('xt');
                go('e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家中等规模的当铺，老旧的柜台上放著一张木牌/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是丰登当铺的储藏室，有时候当铺里的大朝奉会把铺里存不下的死当货物拿出来拍卖/.test(a)) {
                jh('xt');
                go('e;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是雪亭镇的大街，一条小巷子通往东边，西边则是一间驿站/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是负责雪亭镇官府文书跟军令往来的雪亭驿/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一间小木屋，在这北方的风中吱吱作响。/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是一处山坳，往南就是雪亭镇，一条蜿蜒的小径往东通往另一个邻近的小山村/.test(a)) {
                jh('xt');
                go('e;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是有名的龙门石窟，石窟造像，密布于两岸的崖壁上。远远可以望见琵琶峰上的白冢。/.test(a)) {
                jh('ly');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/城南官道，道路两旁是一片树林，远处是一片片的农田了。田地里传来农人的呼号，几头黄牛悠闲的趴卧着。/.test(a)) {
                jh('ly');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/由此洛阳城南门出去，就可以通往南市的龙门石窟。城门处往来客商络绎不绝，几名守城官兵正在检查过往行人。/.test(a)) {
                jh('ly');
                go('n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳最繁华的街市，这里聚集着各国客商。/.test(a)) {
                jh('ly');
                go('n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛水渡口静静的洛水由此向东，汇入滚滚黄河。码头上正泊着一艘船坞，常常的缆绳垂在水中。/.test(a)) {
                jh('ly');
                go('n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/一艘普通的船坞，船头坐着一位蓑衣男子。/.test(a)) {
                jh('ly');
                go('n;n;e;s;luoyang317_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳的南面了，街上有好几个乞丐在行乞。/.test(a)) {
                jh('ly');
                go('n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是一座供奉洛神的小庙。小庙的地上放着几个蒲团。/.test(a)) {
                jh('ly');
                go('n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是洛阳金刀世家了。金刀门虽然武功不算高，但也是有两下子的。/.test(a)) {
                jh('ly');
                go('n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/金刀世家的练武场。金刀门的门主王天霸在这儿教众弟子习武。/.test(a)) {
                jh('ly');
                go('n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛神庙下面的地道，上面人走动的声音都隐约可听见。/.test(a)) {
                jh('ly');
                go('n;n;n;w;putuan;dig go');
                bl_found = true;
                break;
            }
            if (/湿润的青石路显然是刚刚下过雨，因为来往行人过多，路面多少有些坑坑凹凹，一不留神很容易被绊到。/.test(a)) {
                jh('ly');
                go('n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿就是菜市口。各种小贩商人十分嘈杂，而一些地痞流氓也混迹人群伺机作案。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/一个猪肉摊，在这儿摆摊卖肉已经十多年了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/你刚踏进巷子，便听得琴韵丁冬，小巷的宁静和外面喧嚣宛如两个世界/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/小院四周满是盛开的桃花，穿过一条长廊，一座别致的绣楼就在眼前了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/绣楼内挂着湖绿色帐幔，一名女子斜靠在窗前的美人榻上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是背阴巷了，站在巷口可以万剑阴暗潮湿的窄巷，这里聚集着洛阳的地痞流氓，寻常人不敢近前。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;dig go');
                bl_found = true;
                break;
            }
            if (/黑暗的街道，几个地痞无赖正慵懒的躺在一旁。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;dig go;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一家酒肆，洛阳地痞头目甄大海正坐在里面小酌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/院落里杂草丛生，东面的葡萄架早已枯萎。/.test(a)) {
                jh('ly');
                go('n;n;n;n;w;event_1_98995501;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/一座跨街大青砖砌的拱洞高台谯楼，矗立在城中心。鼓楼为二层木瓦建筑，设有大鼓大钟，晨钟暮鼓，用以报时。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/相传春秋时代，楚王在此仰望周王城，问鼎重几何。周室暗弱，居然隐忍不发。这便是街名的由来。银钩赌坊也在这条街上。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里便是洛阳有名的悦来客栈，只见客栈大门处人来人往，看来生意很红火。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈大院，院内紫藤花架下放着几张桌椅，东面是一座马厩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/客栈马倌正在往马槽里添草料，旁边草料堆看起来有些奇怪。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/房间布置的极为雅致，没有太多的装饰，唯有屋角放着一个牡丹屏风。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊二楼走廊，两旁房间里不时床来莺声燕语，看来这里不止可以赌。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往赌坊二楼的楼梯，上面铺着大红色地毯。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/大厅满是呼庐喝雉声、骰子落碗声、银钱敲击声，男人和女人的笑声，/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/走出赌坊后门，桂花清香扑面而来，桂花树下的水缸似乎被人移动过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/赌坊门口人马喧哗，门上一支银钩在风中摇晃，不知道多少人咬上了这没有鱼饵的钩/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;w;dig go');
                bl_found = true;
                break;
            }
            if (/自古以来，洛阳墨客骚人云集，因此有“诗都”之称，牡丹香气四溢，又有“花都”的美誉/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是牡丹园内的一座小亭子，布置得十分雅致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;w;s;luoyang111_op1;dig go');
                bl_found = true;
                break;
            }
            if (/也许由于连年的战乱，使得本来很热闹的街市冷冷清清，道路两旁的店铺早已破旧不堪，一眼望去便知道有很久没有人居住了。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这间当铺处于闹市，位置极好。当铺老板正半眯着双眼在高高的柜台上打盹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/你无意中走进一条青石街，这里不同于北大街的繁华热闹，两边是一些小店铺，北面有一家酒肆，里面出入的人看起来衣衫褴褛。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间小酒肆，里面黑暗潮湿，满是油垢的桌旁，几名无赖正百无聊赖的就着一盘花生米喝酒。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是洛阳北边街道，人群熙熙攘攘甚是热闹。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/洛阳城的钱庄，来往的商客往往都会将银两存于此处。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/就是洛阳北门，门口站着的是守城官兵。站在城楼望出去，外面是一片茅草路。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/城北通往邙山的小路，路旁草丛中时有小兽出没。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/一片绿云般的竹林隔绝了喧嚣尘世，步入这里，心不由平静了下来。青石小路在竹林中蜿蜒穿行，竹林深处隐约可见一座小院。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/绿竹环绕的小院，院内几间房舍都用竹子打造，与周围竹林颇为和谐。这小院的主人显然有些独特之处。院内一名老翁正在劈柴。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一间雅致的书斋，透过窗户可以见到青翠修竹，四周如此清幽，竹叶上露珠滴落的声音都能听见。靠墙的书架看起来很别致。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/ 就是洛阳城墙上的城楼，驻守的官兵通常会在这儿歇个脚，或是聊下天。如果心细之人，能看到角落里似乎有一个隐秘的把手。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/ 这个城楼上的密室显然是守城军士秘密建造的，却不知有何用途。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;w;luoyang14_op1;dig go');
                bl_found = true;
                break;
            }
            if (/这就是洛阳城的城墙。洛阳是重镇，因此城墙上驻守的官兵格外多。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/由于连年的战乱，整条金谷街的不少铺子已经荒废掉了。再往东走就是洛阳地痞流氓聚集的背阴巷。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是洛阳首富的庄院，据说家财万贯，富可敌国。庄院的的中间有一棵参天大树。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/这儿是富人家的储藏室，因此有不少奇珍异宝。仔细一看，竟然还有一个红光满面的老人家半躺在角落里。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;n;op1;dig go');
                bl_found = true;
                break;
            }
            if (/一座朴实的石拱桥，清澈河水从桥下流过。对面可见一座水榭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;dig go');
                bl_found = true;
                break;
            }
            if (/荷池旁的水榭，几名游客正在里面小憩。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/回廊两旁便是碧绿荷塘，阵阵荷香拂过。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/荷塘中的观景台，两名女子在这里游玩。远远站着几名护卫，闲杂人等一律被挡在外面。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在一片苍翠树林中的小路，小路尽头有座草屋。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/简陋的茅草小屋，屋内陈设极其简单。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/石阶两侧山泉叮咚，林木森森。漫步而上，可见山腰有亭。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是听伊亭，据说白居易曾与好友在此品茗、论诗。一旁的松树上似乎有什么东西。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/丛林小径，因为走得人少，小径已被杂草覆盖。/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/听着松涛之音，犹如直面大海/.test(a)) {
                jh('ly');
                go('n;n;n;n;n;e;e;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这里是华山村村口，几个草垛随意的堆放在路边，三两个泼皮慵懒躺在那里。/.test(a)) {
                jh('hsc');
                go('dig go');
                bl_found = true;
                break;
            }
            if (/这是一条穿过村口松树林的小路。/.test(a)) {
                jh('hsc');
                go('n;dig go');
                bl_found = true;
                break;
            }
            if (/这就是有名的神女冢，墓碑前散落着游人墨客烧的纸钱，前面不远处有一间破败的土地庙。/.test(a)) {
                jh('hsc');
                go('n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一片溪边的杏树林，一群孩童在此玩耍。/.test(a)) {
                jh('hsc');
                go('w;dig go');
                bl_found = true;
                break;
            }
            if (/村口一个简易茶棚，放着几张木质桌椅，干净齐整，过往路人会在这里喝杯热茶歇歇脚，村里的王老二常常会混在这里小偷小摸。/.test(a)) {
                jh('hsc');
                go('w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间破败的土地庙门口，门旁的对联已经模糊不清，隐约只见上联“德之不修/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;dig go');
                bl_found = true;
                break;
            }
            if (/土地庙庙堂，正中供奉着土地，香案上堆积这厚厚的灰尘。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;dig go');
                bl_found = true;
                break;
            }
            if (/隐藏在佛像后的地道入口，两只黑狗正虎视眈眈的立在那里。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往西侧的通道，前面被铁栅栏挡住了。/.test(a)) {
                jh('hsc');
                bl_found = true;
                go('w;event_1_59520311;n;n;w;dig go');
                break;
            }
            if (/通往地下通道的木楼梯/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通道两侧点着油灯，昏暗的灯光让人看不清楚周围的环境。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/通往东侧的通道，前面传来有水声和痛苦的呻吟。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件宽敞的大厅，正中间摆着一张太师椅，两侧放着一排椅子。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一件布置极为简单的卧房，显然只是偶尔有人在此小憩。床上躺着一名半裸女子，满脸惊恐。/.test(a)) {
                jh('hsc');
                go('w;event_1_59520311;n;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条古老的青石街，几个泼皮在街上游荡。/.test(a)) {
                jh('hsc');
                go('s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一条碎石小路，前面有一个打铁铺。/.test(a)) {
                jh('hsc');
                go('s;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间打铁铺，炉火烧的正旺，一名汉子赤膊挥舞着巨锤，锤落之处但见火花四溅。/.test(a)) {

                jh('hsc');
                go('s;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/一棵千年银杏树屹立在广场中央，树下有一口古井，据说这口古井的水清澈甘甜，村里的人每天都会来这里挑水。/.test(a)) {
                jh('hsc');
                go('s;s;dig go');
                bl_found = true;
                break;
            }
            if (/村里的杂货铺，店老板正在清点货品。/.test(a)) {
                jh('hsc');
                go('s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/杂货铺后院，堆放着一些杂物，东边角落里放着一个马车车厢，一个跛脚汉子坐在一旁假寐。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一个普通的马车车厢，粗布帘挡住了马车车窗和车门，地板上面躺着一个人。/.test(a)) {
                jh('hsc');
                go('s;s;e;s;huashancun24_op2;dig go');
                bl_found = true;
                break;
            }
            if (/这是村内宗祠大门，门口一棵古槐，树干低垂。/.test(a)) {
                jh('hsc');
                go('s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/宗祠的大厅，这里供奉着宗室先祖。/.test(a)) {
                jh('hsc');
                go('s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/青石板铺就的小桥，几棵野草从石缝中钻出，清澈的溪水自桥下湍湍流过。/.test(a)) {
                jh('hsc');
                go('s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/田间泥泞的小路，一个稻草人孤单的立在一旁，似乎在指着某个地方。一个男子神色慌张的从一旁田地里钻出。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间竹篱围城的小院，院内种着几株桃花，屋后竹林环绕，颇为雅致。旁边的西厢房上挂着一把铜制大锁，看起来有些奇怪。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;dig go');
                bl_found = true;
                break;
            }
            if (/这是小院的厅堂，迎面墙壁上挂着一幅山水画，看来小院的主人不是普通农人。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是一间普通的厢房，四周窗户被布帘遮得严严实实。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;w;get_silver;dig go');
                bl_found = true;
                break;
            }
            if (/一条杂草丛生的乡间小路，时有毒蛇出没。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;dig go');
                bl_found = true;
                break;
            }
            if (/一间看起来有些破败的小茅屋，屋内角落里堆着一堆稻草，只见稻草堆悉悉索索响了一阵，竟然从里面钻出一个人来。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨山脚，站在此处可以摇摇望见四面悬崖的清风寨。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;dig go');
                bl_found = true;
                break;
            }
            if (/通往清风寨唯一的山路，一侧便是万丈深渊。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;dig go');
                bl_found = true;
                break;
            }
            if (/两扇包铁木门将清风寨与外界隔绝开来，门上写着“清风寨”三字。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是桃花泉，一片桃林环绕着清澈泉水，据说泉水一年四季不会枯竭。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨前院，地面由坚硬岩石铺就。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨练武场，四周放置着兵器架。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/清风寨议事厅，正中放置着一张虎皮椅。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里是清风寨后院，远角有一颗大树，树旁有一扇小门。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这里就是清风寨兵器库了，里面放着各色兵器。角落里一个上锁的黑铁箱不知道装着什么。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/这里的空气中充满清甜的味道，地上堆积着已经晒干的柿子。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/这是清风寨寨主的卧房，床头挂着一把大刀。/.test(a)) {
                jh('hsc');
                go('s;s;s;s;s;nw;n;n;n;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/这是通往二楼大厅的楼梯，楼梯扶手上的雕花精美绝伦，看来这酒楼老板并不是一般的生意人/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;dig go');
                bl_found = true;
                break;
            }
            if (/二楼是雅座，文人学士经常在这里吟诗作画，富商土豪也在这里边吃喝边作交易。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡绿绸屏风，迎面墙上挂着一副『芙蓉出水』图。厅内陈列奢华，雕花楠/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;w;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡黄绸屏风，迎面墙上挂着一副『芍药』图，鲜嫩欲滴/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;e;dig go');
                bl_found = true;
                break;
            }
            if (/进门绕过一道淡红绸屏风，迎面墙上挂着一副『牡丹争艳』图，牡丹素以富贵著称。图侧对联：“幽径天姿呈独秀，古园国色冠群芳”。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;dig go');
                bl_found = true;
                break;
            }
            if (/你站在观景台上眺望，扬州城的美景尽收眼底。东面是就是小秦淮河岸，河岸杨柳轻拂水面，几簇粉色桃花点缀其间。/.test(a)) {
                jh('yz');
                go('n;n;n;n;n;n;e;n;n;n;n;dig go');
                bl_found = true;
                break;
            }

        }
        if (bl_found) go("cangbaotu_op1");
        //      window.setTimeout('go("cangbaotu_op1")', 3000);
    }, "", "cbt");


    window.game = this;

    window.attach = function() {
        var oldWriteToScreen = window.writeToScreen;
        window.writeToScreen = function(a, e, f, g) {
            oldWriteToScreen(a, e, f, g);
            a = a.replace(/<[^>]*>/g, "");
            if(wabaoTrigger == 1){
                triggers.trigger(a);
            }
        };

        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;
        gSocketMsg.dispatchMessage = function(b) {
            this.old(b);

            if (questionTrigger == 1){
                question.dispatchMessage(b);
            }
            if (swordsTrigger == 1){
                swordsfeed.dispatchMessage(b);
            }
            if (FragmentTrigger == 1){
                fragmentfeed.dispatchMessage(b);
            }
            if (fishingTrigger==1){
                fishfeedback.dispatchMessage(b);
            }
            if (refiningTrigger==1){
                refinefeedback.dispatchMessage(b);
            }
            if (QxTalking==1){
                whipser.dispatchMessage(b);
            }
            if (escapeTrigger==1){
                escape.dispatchMessage(b);
            }
            if (onekillTrigger==1){
                onekill.dispatchMessage(b);
            }
            if (QLTrigger != 0 || YXTrigger != 0){
                qlMon.dispatchMessage(b);
            }
        };
    };
    attach();

    if(Base.CurrentUser("神游")){
        fightAllTrigger = 0;
        fightAllFunc();
        autodayTrigger=0;
        AutoDayFunc();
    }
    if(!Base.CurrentUser("岳曦")){
        QLTrigger=1;
        qilongFunc();
    }
    YXTrigger=1;
    youxiaFunc();


})(window);

