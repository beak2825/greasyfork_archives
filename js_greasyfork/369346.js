// ==UserScript==
// @name         论剑日常
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  游戏辅助脚本
// @author       Yu
// @include      http://*.yytou.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369346/%E8%AE%BA%E5%89%91%E6%97%A5%E5%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/369346/%E8%AE%BA%E5%89%91%E6%97%A5%E5%B8%B8.meta.js
// ==/UserScript==

(function() {

    var isDelayCmd = 1, // 是否延迟命令
    cmdCache = [],      // 命令池
    timeCmd = null,     // 定时器句柄
    cmdDelayTime = 300; // 命令延迟时间

    // 找哪个奇侠
    function setQiXiaObj(){
        getQiXiaObj('穆妙羽'); 
    }

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
    async function clickButtonAsync(s) {
        clickButton(s);
        await new Promise(function (resolve) {
            setTimeout(resolve, 300);
        });
    }

    var fightQixiaSwitch = true;
    var qixiaObj= {}; 

    var btnGroup = [
            {
                'id' : '0',
                'name' : '隐藏按键',
                'function': function(e){
                    hideShowBtn(e);
                }
            },
            {
                'id' : '1',
                'name' : '更换技能',
                'function': function(e){
                    interServerFn1(e);
                }
            },
            {
                'id' : '2',
                'name' : '签到',
                'function': function(){
                    CheckIn();
                }
            },{
                'id' : '3',
                'name' : '刷碎片',
                'function': function(){
                    killDrunkManFunc();
                }
            },{
                'id' : '5',
                'name' : '搜尸',
                'function': function(e){
                    setCsearch(e);
                }
            },{
                'id' : '8',
                'name' : '自动战斗',
                'function': function(e){
                    autoKill(e);
                }
            },{
                'id' : '11',
                'name' : '杀天剑',
                'function': function(e){
                    killTianJianTargetFunc(e);
                }
            }
        ];

    var btnVipGroup = [
            {
                'id' : 'v1',
                'name' : 'VIP签到',
                'function': function(e){
                    CheckInFunc(e);
                }
            },{
                'id' : 'v6',
                'name' : '其他Vip',
                'function': function(e){
                    CheckInFunc1()
                }
            },{
                'id' : 'v2',
                'name' : '侠客岛',
                'function': function(e){
                    newGetXiaKe(e);
                }
            },{
                'id' : 'v3',
                'name' : '苗疆炼药',
                'function': function(e){
                    MjlyFunc(e)
                }
            },{
                'id' : 'v14',
                'name' : '天山玄冰',
                'function': function(e){
                    TianShanFunc(e)
                }
            },{
                'id' : 'v4',
                'name' : '大昭壁画',
                'function': function(e){
                    MianBiFunc(e)
                }
            },{
                'id' : 'v7',
                'name' : '冰月2',
                'function': function(e){
                    getBingyue2()
                }
            },{
                'id' : 'v11',
                'name' : '铜人脱衣',
                'function': function(e){
                    beforeFightTongren(e);
                }
            },{
                'id' : 'v12',
                'name' : '铜人穿衣',
                'function': function(e){
                    fightTongren(e);
                }
            },{
                'id' : 'v13',
                'name' : '随机跑',
                'function': function(e){
                    randomRunButtonFunc(e);
                }
            }
    ];

    var btnOtherGroup = [
            {
                'id' : 'o1',
                'name' : '比试奇侠',
                'function': function(e){
                    startFightQixiaFn(e);
                }
            },{
                'id' : 'o18',
                'name' : '结交奇侠',
                'function': function(e){
                    giveJinToQixiaFn(e);
                }
            },{
                'id' : 'o2',
                'name' : '撩奇侠',
                'function': function(e){
                    talkSelectQiXia(e);
                }
            },
            {
                'id' : 'o3',
                'name' : '试剑',
                'function': function(e){
                    CheckIn1(e);
                }
            },{
                'id' : 'o4',
                'name' : '答题',
                'function': function(e){
                    answerQuestionsFunc(e);
                }
            },{
                'id' : 'o5',
                'name' : '存东西',
                'function': function(e){
                    baoguoZhengliFunc()
                }
            },{
                'id' : 'o9',
                'name' : '逃跑吃药',
                'function': function(e){
                    escapeAndEat(e);
                }
            },{
                'id' : 'o12',
                'name' : '杀好人',
                'function': function(e){
                    killGoodNpc(e);
                }
            },{
                'id' : 'o12',
                'name' : '杀坏人',
                'function': function(e){
                    killBadNpc(e);
                }
            },{
                'id' : 'o13',
                'name' : '更换奇侠',
                'function': function(e){
                    changeQiXiaName(e);
                }
            },{
                'id' : 'o15',
                'name' : '双儿',
                'function': function(e){
                    clickShuangEr(e);
                }
            },{
                'id' : 'o16',
                'name' : '拿玄铁',
                'function': function(e){
                    getXuanTie()
                }
            },{
                'id' : 'o19',
                'name' : '战斗装备',
                'function': function(e){
                    ZhuangBei(e);
                }
            },{
                'id' : 'o21',
                'name' : '开打碎片',
                'function': function(e){
                    ditusuipianFunc(e);
                }
            },{
                'id' : 'o22',
                'name' : '交碎片',
                'function': function(e){
                    submitSuipian(e);
                }
            },{
                'id' : 'o25',
                'name' : '合宝石',
                'function': function(e){
                    heBaoshi(e);
                }
            },{
                'id' : 'o26',
                'name' : '定时恢复',
                'function': function(e){
                    recoverOnTimes(e);
                }
            },{
                'id' : 'o27',
                'name' : '一键恢复',
                'function': function(e){
                    recoverOnByClick(e);
                }
            },{
                'id' : 'o28',
                'name' : '跟招',
                'function': function(e){
                    followPozhaoFn(e);
                }
            }
    ];

    window.searchName = null;
    var Base = {
        init: function(){
            this.btnArrSet();
            this.writeBtn();
        },
        qi: 6,
        buttonWidth: '80px',
        buttonHeight: '20px',
        currentPos: 60,
        delta: 30,
        timeInter: 2000,
        pozhaoNum : '1',
        DrunkMan_targetName: 'luoyang_luoyang26',
        correctQu: function(){
            var url = window.location.href;
            var qu = 37;
            if(url.indexOf('38.yytou') != '-1' ){
                qu = 38;
            }
            return qu;
        },
        getCorrectText: function(txt){
            var url = window.location.href;
            var correctSwitch = false;
            if(url.indexOf(txt) != '-1' ){
                correctSwitch = true;
            }
            return correctSwitch;
        },
        mySkillLists: '破军棍诀；千影百伤棍；九溪断月枪；燎原百破；九天龙吟剑法；覆雨剑法；排云掌法；如来神掌',
        btnArrSet: function(){
            var btnGroupArr = btnGroup;

            for(var i = 0; i <btnOtherGroup.length; i++){
                btnGroupArr.push(btnOtherGroup[i]);
            }
            
            for(var i = 0; i <btnVipGroup.length; i++){
                btnGroupArr.push(btnVipGroup[i]);
            }

            this.btnArr = btnGroupArr;
        },
        btnArr: [],
        writeBtn: function(){
            var btnArr = this.btnArr;
            for(var i = 0; i< btnArr.length; i++){
                var rightPos = 0;
                if(i > 18){
                    rightPos = '180';
                }
                if(i > 38){
                    rightPos = '270';
                }
                if(i == 19){
                    this.currentPos = 90;
                }
                if(i == 39){
                    this.currentPos = 120;
                }
                var btnName = 'btn' + i;
                btnName = document.createElement('button');
                btnName.innerText = btnArr[i].name;
                btnName.style.width = this.buttonWidth;
                btnName.style.height = this.buttonHeight;
                btnName.style.position = 'absolute';
                btnName.style.right = rightPos +'px';
                btnName.id = 'btn' + btnArr[i].id;
                btnName.className = 'btn-add';
                btnName.style.top = this.currentPos + 'px';
                this.currentPos = this.currentPos + this.delta;
                document.body.appendChild(btnName);
                if(btnArr[i].function){
                    btnName.addEventListener('click', btnArr[i].function)
                }
            }
        }
    }
    var timeInter = Base.timeInter;


    function hideShowBtn(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if(DomTxt == '隐藏按键'){
            Dom.html('显示按键');
            $('.btn-add').each(function(i){
                if(i> 6){
                    $(this).hide();
                }
            })
            $('#btnS').show();
        }else{
            Dom.html('隐藏按键');
            $('.btn-add').show();
        }
    }

    /* 更换技能方法 :start */
    var kuafuNpc = '',
        isInKuafu = false;
    async function interServerFn1(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        var skillsText = '破军棍诀；千影百伤棍；九溪断月枪；燎原百破；九天龙吟剑法；覆雨剑法；排云掌法；如来神掌';
        var skills = prompt("请输入要使用的技能", skillsText);
        if(skills){
            Base.mySkillLists = skills;
        }
    }
    /* 更换技能方法 :end */

    /* 更换奇侠 方法 :start */
    var QiXiaIndex = 0;
    function changeQiXiaName(){
        var qixiaText = qixiaObj.name;

        var qixiaName = prompt("请输入要比试的奇侠名字", qixiaText);
        if(qixiaName){
            for(var i = 0; i <QixiaInfoList.length; i++){
                if(QixiaInfoList[i].name == qixiaName){
                    qixiaObj= QixiaInfoList[i];
                }
            }
        }
    }
    /* 更换奇侠 方法 :end */
    function beforeFightTongren(){
        timeCmd=0;
        go('enableskill enable paiyun-zhang attack_select,enableskill enable unarmed wuxiang-jingang-quan,enable unmap_all,auto_equip off');
        go('event_1_14757697');
    }
    function fightTongren(){
        go('auto_equip on');
        go('enable mapped_skills restore go 1');
    }
    // 签到--------------------------------------------------------
    function CheckInFunc(){
        timeCmd=0;
        console.log(getTimes() +'VIP签到');
        go('vip drops');//领通勤
        go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');//10次暴击
        // clickButton('vip buy_task', 0)
        // go('vip buy_task;vip buy_task;vip buy_task;vip buy_task;vip buy_task'); // 购买5次
        // go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');
        go('vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan;vip finish_clan');// 20次帮派
        // clickButton('vip finish_clan', 0) clickButton('vip finish_family', 0)
        go('vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family;vip finish_family');//25次师门
        go('vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig;vip finish_dig');//挖宝
        go('vip finish_fb dulongzhai;vip finish_fb dulongzhai;vip finish_fb junying;vip finish_fb junying;vip finish_fb beidou;vip finish_fb beidou;vip finish_fb youling;vip finish_fb youling,vip finish_fb siyu');//副本扫荡
        go('vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;vip finish_diaoyu;');  //钓鱼
        // go('sort;sort fetch_reward;');//排行榜奖励
        // go('shop money_buy shop1_N_10;home;');//买引路蜂10个
        // go('exercise stop;exercise;');//打坐
        // go("share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;");//分享
        // clickButton('vip finish_fb siyu', 0)
        go('cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;');//闯楼奖励
        // go('jh 5;n;n;n;w;sign7;home;');//扬州签到
        // go('jh 1;event_1_763634;home;');//雪亭立冬礼包
        // go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;home;');//消费积分和谜题卡
        // go("jh 1;e;n;e;e;e;e;n;lq_bysf_lb;lq_lmyh_lb;home;");//比翼双飞和劳模英豪
        go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n;n;w;event_1_31320275;home');//采莲
        go('jh 26;w;w;n;e;e;event_1_18075497;home');//大招采矿
        go('jh 26;w;w;n;n;event_1_14435995;home');//大招破阵
        go("jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home");//绝情谷鳄鱼
        if(Base.getCorrectText('4254240')){
            go('home;jh 5;n;n;n;n;n;n;n;n;n;n;ne;chuhaigo;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
        }else{
            go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
        }
    }

    function CheckInFunc1(){
        timeCmd=0;
        console.log(getTimes() +'VIP签到-正邪-逃犯-打榜');
        go('vip buy_task;vip buy_task;vip buy_task;vip buy_task;vip buy_task'); // 购买5次暴击
        go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');//暴击
        go('vip finish_task,vip finish_task,vip finish_task,vip finish_task,vip finish_task');
        go('vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;');//10次正邪
        go('vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;');//5次逃犯
        go('vip finish_sort;vip finish_sort;vip finish_sort;vip finish_sort;vip finish_sort;');//5次打榜
    }

    /* 签到 方法 :start */
    async function CheckIn(){
        console.log(getTimes() +'签到一次！');
        await clickButtonAsync('jh 1');        // 进入章节
        await clickButtonAsync('look_npc snow_mercenary');
        getNewLibao();
        setTimeout(function(){
            checkInList();
        },2000)
    }
    async function checkInList(){
        await clickButtonAsync('share_ok 1'); //分享
        await clickButtonAsync('share_ok 2'); //分享
        await clickButtonAsync('share_ok 3'); //分享
        await clickButtonAsync('share_ok 4'); //分享
        await clickButtonAsync('share_ok 5'); //分享
        // await clickButtonAsync('share_ok 6'); //分享
        await clickButtonAsync('share_ok 7'); //分享
        await clickButtonAsync('exercise stop'); //取消打坐
        await clickButtonAsync('exercise');     //打坐
        await clickButtonAsync('sleep_hanyuchuang'); // 睡床
        await clickButtonAsync('jh 5');       // 进入扬州
        await clickButtonAsync('go north');     // 南门大街
        await clickButtonAsync('go north');   // 十里长街3
        await clickButtonAsync('go east');    // 十里长街2
        await clickButtonAsync('event_1_44528211');  // 双儿-6.1礼包
        await clickButtonAsync('jh 5');       // 进入扬州
        await clickButtonAsync('go north');     // 南门大街
        await clickButtonAsync('go north');   // 十里长街3
        await clickButtonAsync('go north');    // 十里长街2
        await clickButtonAsync('go west');    // 黄记杂货
        await clickButtonAsync('sign7');      //签到
        await clickButtonAsync('home');         //回主页
        await clickButtonAsync('jh 1');        // 进入章节
        await clickButtonAsync('go east') ;     // 广场
        await clickButtonAsync('go north');     // 雪亭镇街道
        await clickButtonAsync('go east');     // 淳风武馆大门
        await clickButtonAsync('go east') ;    // 淳风武馆教练场
        await clickButtonAsync('event_1_8041045');//谜题卡
        await clickButtonAsync('event_1_8041045');//谜题卡
        await clickButtonAsync('event_1_44731074');//消费积分
        await clickButtonAsync('event_1_34254529');
        //clickButton('event_1_29721519', 1)
        await clickButtonAsync('event_1_29721519'); // 狗年礼券
        // await clickButtonAsync('event_1_16891630'); // 狗年礼券
        await clickButtonAsync('home');  //回主页
        await clickButtonAsync('sort');//排行榜
        await clickButtonAsync('sort fetch_reward', 1);// 领取排行奖励
        await clickButtonAsync('home');  //回主页
        await clickButtonAsync('jh 2');
        await clickButtonAsync('go north');  // 南郊小路
        await clickButtonAsync('go north');  // 南门
        await clickButtonAsync('go north');  // 南大街
        await clickButtonAsync('go north');  // 洛川街
        await clickButtonAsync('go north');  // 中心鼓楼
        await clickButtonAsync('go north');  // 中州街
        await clickButtonAsync('go north');  // 北大街
        await clickButtonAsync('go east');   // 钱庄
        await clickButtonAsync('tzjh_lq');   // 钱庄  clickButton('tzjh_lq', 1)
        await clickButtonAsync('home');
        await clickButtonAsync('items use obj_bingzhen_suanmeitang');   // 酸梅汤       
        await clickButtonAsync('items use obj_baicaomeijiu');           // 百草美酒
        await clickButtonAsync('items use obj_niangao');                // 年糕
        await clickButtonAsync('shop money_buy shop1_N_10'); // 引路蜂
        await clickButtonAsync('cangjian get_all'); // 一键领取藏剑楼奖励
        await clickButtonAsync('xueyin_shenbinggu blade get_all'); // 一键领取霸刀楼奖励
        await clickButtonAsync('xueyin_shenbinggu unarmed get_all'); // 一键领取铁拳楼奖励
        await clickButtonAsync('xueyin_shenbinggu throwing get_all'); // 一键领取天机楼奖励
        await clickButtonAsync('home');     //回主页
    }
    // 领取礼包
    async function getNewLibao(){
       setTimeout(function(){
            clickLibaoBtn();
       },1000)
    }
    async function clickShuangEr(){
        await clickButtonAsync('home');     //回主页
        await clickButtonAsync('jh 5');       // 进入扬州
        await clickButtonAsync('go north');     // 南门大街
        await clickButtonAsync('go north');   // 十里长街3
        await clickButtonAsync('go east');    // 十里长街2
        await clickButtonAsync('look_npc yangzhou_yangzhou9');
        setTimeout(function (){clickShuangErLibaoBtn()},3000);
    }

    // 判断是什么礼包
    async function clickShuangErLibaoBtn(){
        var btn = $('.cmd_click2');
        btn.each(function(){
            var txt = $(this).text();
            if(txt != "比试"){
                var clickText = $(this).attr('onclick');
                var clickAction = getLibaoId(clickText);
                triggerClick(clickAction);
            }
        })
        await clickButtonAsync('home');
    }
    // 获取礼包方法的名称
    function getLibaoId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split("'");
        return nowArr[1];
    }
    // 判断是什么礼包
    async function clickLibaoBtn(){
        var LiBaoName = ['兑换礼包','1元礼包'];
        var btn = $('.cmd_click2');
        btn.each(function(){
            var txt = $(this).text();
            if(txt.indexOf('礼包') != '-1'){
                if($.inArray(txt, LiBaoName) == -1){
                    var clickText = $(this).attr('onclick'); // clickButton('event_1_41502934', 1)
                    var clickAction = getLibaoId(clickText);
                    triggerClick(clickAction);
                }
            }
        })
        await clickButtonAsync('home');
    }

    // 获取礼包方法的名称
    function getLibaoId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split("'");
        return nowArr[1];
    }
    // 触发领方法
    async function triggerClick(name){
        await clickButtonAsync(name);
    }
    /* 签到 方法 :end */
    /* 刷碎片 方法 :start */
    var counthead = null;
    var killDrunkIntervalFunc =  null;
    async function killDrunkManFunc(){
        counthead = 20;
        $('span:contains(胜利)').remove();
        await clickButtonAsync('jh 2');        // 进入章节
        await clickButtonAsync('go north');      // 南郊小路
        await clickButtonAsync('go north');     // 南门
        await clickButtonAsync('go north');     // 南大街
        await clickButtonAsync('go north');     // 洛川街
        killDrunkIntervalFunc = setInterval(killDrunMan,3000);
    }
    function isContains(str,substr) {
        let indexNum = str.indexOf(substr);
        return indexNum >= 0;
    }
    async function killDrunMan(){
        getInfoFromDown('/20', getSuiPianNum);
        await clickButtonAsync('kill ' + Base.DrunkMan_targetName);
        doKillSetSuiPian();
    }

    // 获取碎片信息
    function getInfoFromDown(text, callback){
        var out = $('#out2 .out2');
        out.each(function(){
            if($(this).hasClass('doneCommon')){
                return
            }
            $(this).addClass('doneCommon');
            var txt = $(this).text();
            // 获得朱雀碎片x1 (7/20)
            if(txt.indexOf(text) != '-1' ){
                 callback(txt);
            }else{
                // console.log('无碎片,请刷新取消刷碎片');
            }
        });
    }

    async function getSuiPianNum(text){
        var num = 0;
        num = text.split('(')[1].split('/')[0];
        if(num >= 20){
            console.log(getTimes() +'完成20个碎片');
            await clickButtonAsync('home');
            clearInterval(killDrunkIntervalFunc);
        }else{
            console.log(getTimes() +'杀人一次，杀人次数：%d！', parseInt(num));
            clickButton('prev_combat');
            $('span:contains(胜利)').html('')
        }
    }
    /* 刷碎片 方法 :end */

    function hasDog(){
        var nameArr = [];
        var nameDom = $('.outkee_text');
        nameDom.each(function(){
            var name = $(this).prev().text();
            if(name != ''){
                nameArr.push(name);
            }
        })
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
    /* 获取正气 方法 :end */
    /* 搜尸 方法 :start */
    var doGetCorpse = null;
    function setCsearch(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if(DomTxt == '搜尸'){
            doGetCorpse = setInterval(function(){
                getC();
            },2000)
            console.log(getTimes() +'开始搜尸');
            Dom.html('取消搜尸');
        }else{
            clearInterval(doGetCorpse);
            Dom.html('搜尸')
            console.log(getTimes() +'停止搜尸');
        }
    }
    function getC(){
        $('.cmd_click3').each(function(){
            var txt = $(this).text();
            if(txt.indexOf('的尸体') != '-1' || txt.indexOf('枯乾的骸骨') != '-1' ){
                var npcText = $(this).attr('onclick');
                var id = getId(npcText);
                clickButton('get '+id);
            }
        })
    }
    /* 搜尸 方法 :end */
    /* 地图碎片 */
    function submitSuipian(){
        go('clan bzmt puzz');
    }
    var suipianInterval = null;
    function ditusuipianFunc(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if(DomTxt == '开打碎片'){
            var msg = "已经进洛阳云远寺地道了吗？\n没有就点取消！";
            if (confirm(msg)===true){
                foundSuiPian();
                suipianInterval = setInterval(function(){
                    foundSuiPian();
                },2*60*1000)
                console.log(getTimes() +'开始地图碎片');
                Dom.html('停止碎片');
            }
        }else{
            clearInterval(suipianInterval);
            console.log(getTimes() +'停止打碎片');
            Dom.html('开打碎片');
        }
    }
    function foundSuiPian(){
        var place = $('#out .outtitle').text();
        var placeArr = ['地室','万蛊堂','百毒池','十恶殿','千蛇窟'];      
        var index = $.inArray(place, placeArr);
        
        if(index  >= 0){
            if(index == '0'){
                goPlaceBtnClick('地室');
                goPlaceBtnClick('万蛊堂');
            }else{
                var name = getBtnText();
                console.log(name);
                if(name){
                    if(name == '翼国公'){
                        clickButton('kill changan_yiguogong1');
                    }
                    if(name == '黑袍公'){
                        clickButton('kill changan_heipaogong1');
                    }
                    if(name == '云观海'){
                        clickButton('kill changan_yunguanhai1');
                    }
                    if(name == '独孤须臾'){
                        clickButton('kill changan_duguxuyu1');
                    }
                }else{
                    if(index == '4'){
                        index = 0;
                    }
                    goNextRoom(index + 1);
                }
            }
        }
    } 
    function getBtnText(){
        var npcName = ['独孤须臾','云观海','黑袍公','翼国公'];
        var targetName = null;
        var btn = $('.cmd_click3');
        for(var i = 0; i <npcName.length; i++){
            var name = npcName[i];
            btn.each(function(){
                if($(this).text() == name){
                    targetName = name;
                }
            })
        }
        console.log(targetName);
        return targetName;
    }

    function goNextRoom(index){
        goPlaceBtnClick('地室');
        console.log(index);
        setTimeout(function(){
            if(index == '1'){
                goPlaceBtnClick('万蛊堂');
            }else if(index == '2'){
                goPlaceBtnClick('百毒池');
            }else if(index == '3'){ 
                goPlaceBtnClick('十恶殿');
            }else if(index == '4'){
                goPlaceBtnClick('千蛇窟');
            }
        },2000)
    }
    function checkHeal(){
        var hp = geKeePercent();
        var qiNumber = gSocketMsg.get_xdz();
        if(qiNumber < 3){
            return;
        }
        var neili = geForcePercent();
        var hasHeal = false;
        if((hp < 50 && maxQiReturn < 3 ) || parseInt(neili) < 10 ){
            var skillArr = ["茅山道术","道种心魔经"];
            if(Base.getCorrectText('4253282')){
                var skillArr = ["道种心魔经"];
                console.log(getTimes() +'内力或血过少，使用技能【道种心魔经】');
            }
            var skillIdA = ['1','2','3','4'];
            $.each(skillArr, function(index, val){
                var skillName = val;

                for(var i = 0; i<skillIdA.length; i++){
                    var btnNum = skillIdA[i];
                    var btn = $('#skill_'+btnNum);
                    var btnName = btn.text();

                    if(btnName == skillName){
                        btn.find('button').trigger('click');
                        hasHeal = true;
                        maxQiReturn ++;
                        break;
                    }
                }
            })
        }
        return hasHeal;
    }
    
    /* 自动战斗 方法 :start */
    var autoKillInter = null;
    function autoKill(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if(DomTxt == '自动战斗'){
            autoKillInter = setInterval(function(){
                doKillSetAuto();
            },timeInter);
            console.log(getTimes() +'开始自动战斗,内力少于30%回内力');
            Dom.html('取消自动');
        }else{
            clearInterval(autoKillInter);
            console.log(getTimes() +'停止自动战斗');
            Dom.html('自动战斗')
        }
    }
    function doKillSet(){
        if($('span.outbig_text:contains(战斗结束)').length>0){
            go('prev_combat');
        }
        if($('#skill_1').length == 0){
            return;
        }
        var qiText = gSocketMsg.get_xdz();
        if(qiText < 3){
            return;
        }

        var skillArr = Base.mySkillLists.split('；');

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
        if(!clickSkillSwitch){
            clickButton('playskill 1');
        }
    }

    function doKillSetSuiPian(){
        if($('#skill_1').length == 0){
            return;
        }

        var skillArr = Base.mySkillLists.split('；');

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
        if(!clickSkillSwitch){
            clickButton('playskill 1');
        }
    }

    function doKillSetAuto(){
        if($('span.outbig_text:contains(战斗结束)').length>0){
            go('prev_combat');
        }
        if($('#skill_1').length == 0){
            return;
        }
        var qiText = gSocketMsg.get_xdz();
        if(qiText < Base.qi){
            return;
        }
        var skillArr = Base.mySkillLists.split('；');
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
        if(!clickSkillSwitch){
            clickButton('playskill 1');
        }
    }
    /* 自动战斗 方法 :end */

    // 杀死XXX
    async function killE(name){
        await clickButton('kill '+name);
    }

    // 获取Dog的数量
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
        })

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
    // 获取id
    function getId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split(' ');
        var str = nowArr[1];
        var id = str.substr(0,str.length-1);
        return id;
    }
    // 去书院
    async function goSyuan(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 1');
        await clickButtonAsync('go east');  // 广场
        await clickButtonAsync('go south'); // 街口
        await clickButtonAsync('go west');  // 街道
        await clickButtonAsync('go south'); // 书院
    }
    // 去书房
    async function goSfang(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 1');
        await clickButtonAsync('go east');  // 广场
        await clickButtonAsync('go north'); // 街道
        await clickButtonAsync('go east');  // 大门
        await clickButtonAsync('go east');  // 教练场
        await clickButtonAsync('go east');  // 大厅
        await clickButtonAsync('go east');  // 天井
        await clickButtonAsync('go north'); // 进书房
    }
    // 去药店
    async function goYao(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 1');
        await clickButtonAsync('go east');  // 广场
        await clickButtonAsync('go north'); // 街道
        await clickButtonAsync('go north'); // 街道
        await clickButtonAsync('go north'); // 街道
        await clickButtonAsync('go west'); // 进药店
    }
    // 去铁匠铺
    async function goTie(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 1');
        await clickButtonAsync('go east');  // 广场
        await clickButtonAsync('go north'); // 街道
        await clickButtonAsync('go north'); // 街道
        await clickButtonAsync('go west')
    }
    // 去南市
    async function goNan(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 2');
        await clickButtonAsync('go north');  // 南郊小路
        await clickButtonAsync('go north');  // 南门
        await clickButtonAsync('go east');  // 南市
    }
    // 去北大街
    async function goNStreet(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 2');
        await clickButtonAsync('go north');  // 南郊小路
        await clickButtonAsync('go north');  // 南门
        await clickButtonAsync('go north');  // 南大街
        await clickButtonAsync('go north');  // 洛川街
        await clickButtonAsync('go north');  // 中心鼓楼
        await clickButtonAsync('go north');  // 中州街
        await clickButtonAsync('go north');  // 北大街
    }
    // 去北大街
    async function goQian(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 2');
        await clickButtonAsync('go north');  // 南郊小路
        await clickButtonAsync('go north');  // 南门
        await clickButtonAsync('go north');  // 南大街
        await clickButtonAsync('go north');  // 洛川街
        await clickButtonAsync('go north');  // 中心鼓楼
        await clickButtonAsync('go north');  // 中州街
        await clickButtonAsync('go north');  // 北大街
        await clickButtonAsync('go east');   // 钱庄
    }
    // 去桃花别院
    async function goTao(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 2');
        await clickButtonAsync('go north');  // 南郊小路
        await clickButtonAsync('go north');  // 南门
        await clickButtonAsync('go north');  // 南大街
        await clickButtonAsync('go north');  // 洛川街
        await clickButtonAsync('go west');   // 铜驼巷
        await clickButtonAsync('go south');  // 桃花别院
    }
    // 去绣楼
    async function goXiu(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 2');
        await clickButtonAsync('go north');  // 南郊小路
        await clickButtonAsync('go north');  // 南门
        await clickButtonAsync('go north');  // 南大街
        await clickButtonAsync('go north');  // 洛川街
        await clickButtonAsync('go west');   // 铜驼巷
        await clickButtonAsync('go south');  // 桃花别院
        await clickButtonAsync('go west');   // 绣楼
    }
    // 去杂货店
    async function goZa(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 3');
        await clickButtonAsync('go south');  // 青石街
        await clickButtonAsync('go south');  // 银杏广场
        await clickButtonAsync('go east');  // 杂货店
    }
    // 去祠堂大门
    async function goCi(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 3');
        await clickButtonAsync('go south');  // 青石街
        await clickButtonAsync('go south');  // 银杏广场
        await clickButtonAsync('go west');   // 祠堂大门
    }
    // 去厅堂
    async function goTing(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 3');
        await clickButtonAsync('go south');  // 青石街
        await clickButtonAsync('go south');  // 银杏广场
        await clickButtonAsync('go west');   // 祠堂大门
        await clickButtonAsync('go north');   // 厅堂
    }

    /* 玄铁: start */
    function getXuanTie(){
        console.log(getTimes() +'冰火岛玄铁');
        go('home;jh 5;n;n;n;n;n;n;n;n;n;n;ne;chuhaigo;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
    }

    function getBingyue2(){
        console.log(getTimes() +'开始冰月2');
        go('home;jh 14;w;n;n;n;n;event_1_32682066;event_1_35756630;kill bingyuegu_yueyihan;');
        setTimeout(function(){
            console.log(getTimes() +'开始打第二层');
            go('event_1_55319823,kill bingyuegu_xuanwujiguanshou');
        },30000)
    }
    /* 玄铁: end */
    /* 比试奇侠  :start */
    var QixiaInfoList = [];
    var qixiaPlace = false;
    function GetNewQiXiaList(){
        clickButton('open jhqx');
        setTimeout(function(){
            getQiXiaList();
        },1000);
    }

    function getQiXiaList(){
        var html=g_obj_map.get("msg_html_page");
        if (html==undefined){
            setTimeout(function(){GetNewQiXiaList();},1000);
        }else if(g_obj_map.get("msg_html_page").get("msg").match("江湖奇侠成长信息")==null){
            setTimeout(function(){GetNewQiXiaList();},1000);
        }else{
            console.log('获取奇侠列表成功');
            var firstQiXiaList =formatQx(g_obj_map.get("msg_html_page").get("msg"));
            QixiaInfoList = SortNewQiXia(firstQiXiaList);
            setQiXiaObj();
        }
    }

    function SortNewQiXia(firstQiXiaList){//冒泡法排序
        var temp={};
        var temparray=[];
        var newarray=[];
        for (var i=0;i<firstQiXiaList.length;i++){
            for (var j=1;j<firstQiXiaList.length-i;j++){
                if (parseInt(firstQiXiaList[j-1]["degree"])<parseInt(firstQiXiaList[j]["degree"])){
                    temp=firstQiXiaList[j-1];
                    firstQiXiaList[j-1]=firstQiXiaList[j];
                    firstQiXiaList[j]=temp;
                }
            }
        }
        var tempcounter=0;
        // console.log("奇侠好感度排序如下:");
        // console.log(firstQiXiaList);
        //首次排序结束 目前是按照由小到大排序。现在需要找出所有的超过25000 小于30000的奇侠。找到后 排序到最上面；
        var newList = [];
        for (var i=0;i<firstQiXiaList.length;i++){
            if (parseInt(firstQiXiaList[i]["degree"])>=30000){
                temparray[tempcounter]=firstQiXiaList[i];
                tempcounter++;
                newarray.push(firstQiXiaList[i]);
            }else{
                newList.push(firstQiXiaList[i]);
            }
        }
        // console.log(newList);
        var firstInsertIndex = 4;
        for(var i =0; i <newarray.length; i++){
            newList.splice(firstInsertIndex, 0, newarray[i]);
            firstInsertIndex++;
        }
        return newList;
    }

    function getQiXiaObj(name){
        var newArr = [];
        if(name){
            for(var i = 0; i <QixiaInfoList.length; i++){
                if(QixiaInfoList[i].name == name){
                    qixiaObj= QixiaInfoList[i];
                }
            }
        }
        console.log('当前结交的奇侠是:' +  qixiaObj.name);
    }

    // 比试奇侠设置
    var fightSkillInter = null;
    var setFight = null;
    var zhaobing = true;
    var mijingNum = 0;
    var isTalkQiXia = false;
    // 给奇侠金锭设置
    var giveJinInterval = null;
    var giveQixiaSwitch = false;

    // 给奇侠1金
    function giveJinToQixiaFn(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if(DomTxt == '结交奇侠'){
            $('#out2 .out2').addClass('done');
            console.log(getTimes() +'开始奇侠'+qixiaObj.name+'！');
            isTalkQiXia = false;
            giveQixiaSwitch = true;
            isInMijing = false;
            $('#out2 .out2').addClass('doneQiXia1');
            Dom.html('取消结交');
            giveJinQiXiaFunc();
        }else{
            giveQixiaSwitch = false;
            clearInterval(giveJinInterval);
            Dom.html('结交奇侠');
        }
    }

    function giveJinQiXiaFunc(){
        clearInterval(giveJinInterval);
        clickButton('home');
        clickButton('open jhqx');
        clickButton('find_task_road qixia '+qixiaObj.index);
        if(giveQixiaSwitch){
            setTimeout(function(){
                var QiXiaId = getNewQiXiaId(qixiaObj.name, qixiaObj.index);
                var qixiaName1 = QiXiaId.split('_')[0];
                if(!isTalkQiXia){
                    if(mijingNum == 3){
                        eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
                    }else if(mijingNum == 4){
                        eval("clickButton('auto_zsjd20_" + qixiaName1 + "')");
                    }else{
                        eval("clickButton('ask " + QiXiaId + "')");
                    }
                }else{
                    eval("clickButton('ask " + QiXiaId + "')");
                }
                
            },1000)
            giveJinInterval = setInterval(function(){
                geiJinQiXiaInfo();
            }, 1000)
        }
    }

    // 获取面板信息
    var isInMijing = false;
    var doGiveSetTimeout = null;
    function geiJinQiXiaInfo(){
        var out = $('#out2 .out2');
        out.each(function(){
            if($(this).hasClass('doneQiXia1')){
                return
            }
            $(this).addClass('doneQiXia1');
            var txt = $(this).text();
            if(txt.indexOf('悄声') != '-1' ){
                mijingNum++;
                giveQixiaSwitch = false;
                var place = getQxiaQuestionPlace(txt);
                console.log(getTimes() + '这是第'+mijingNum+'次秘境，地址是：' + place);
                isInMijing = true;
                doGiveSetTimeout = setTimeout(function(){
                    $('#out2 .out2').addClass('doneQiXia1')
                    GoPlaceInfo(place);
                },1500)
            }else if(txt.indexOf('20/20') != '-1' ){
                isInMijing = false;
                giveQixiaSwitch = false;
                isTalkQiXia = false;
                clearInterval(giveJinInterval);
                clickButton('home');
                $('#btno18').html('给奇侠金');
                $('#btno23').html('对话奇侠');
            }else if(txt.indexOf('太多关于亲密度') != '-1' ){
                isInMijing = false;
                giveQixiaSwitch = false;
                isTalkQiXia = false;
                clearInterval(giveJinInterval);
                clickButton('home');
                $('#btno18').html('给奇侠金');
                $('#btno23').html('对话奇侠');
            }else if(txt.indexOf('你搜索到一些') != '-1'){
                doGiveSetTimeout = setTimeout(function(){
                    clickBtnByName('仔细搜索');
                },2000)
            }else if(txt.indexOf('秘境任务') != '-1' || txt.indexOf('秘境地图') != '-1'){
                doGiveSetTimeout = setTimeout(function(){
                    clickBtnByName('仔细搜索');
                },2000)
            }else if(txt.indexOf('秘密地图') != '-1'){
                doGiveSetTimeout = setTimeout(function(){
                    clickBtnByName('仔细搜索');
                },2000)
            }else if(txt.indexOf('你开始四处搜索') != '-1'){
                if(!hasSaoDan()){
                    doGiveSetTimeout = setTimeout(function(){
                        isInMijing = false;
                        giveQixiaSwitch = true;
                        giveJinQiXiaFunc();
                    },1500)
                }else{
                    clickBtnByName('仔细搜索');
                    clickBtnByName('扫荡');
                    doGiveSetTimeout = setTimeout(function(){
                        $('.cmd_click2').trigger('click');
                    },2000)
                }
            }else if(txt.indexOf('扫荡成功') != '-1'){
                doGiveSetTimeout = setTimeout(function(){
                    isInMijing = false;
                    giveQixiaSwitch = true;
                    giveJinQiXiaFunc();
                },1500)
            }else if(txt.indexOf('今日亲密度操作次数') != '-1'){
                if(!isInMijing){
                    doGiveSetTimeout = setTimeout(function(){
                        if(giveQixiaSwitch){
                            giveJinQiXiaFunc();
                        }
                    },2500)
                }
            }else if(txt.indexOf('此地图还未解锁') != '-1'){
                doGiveSetTimeout = setTimeout(function(){
                    giveQixiaSwitch = true;
                    isInMijing = false;
                    giveJinQiXiaFunc();
                },10000)
            }else if(txt.match(qixiaObj.name + "往(.*?)离开。")){
                clearTimeout(doGiveSetTimeout);
                doGiveSetTimeout = setTimeout(function(){
                    giveQixiaSwitch = true;
                    isInMijing = false;
                    giveJinQiXiaFunc();
                },3000)
            }
        });
    }
    // 是否可以扫荡
    function hasSaoDan(){
        var btns = $('.cmd_click3');
        var hasSD = false;
        btns.each(function(){
            if($(this).text() == '扫荡'){
                hasSD = true;
            }
        });
        return hasSD;
    }
    // 扫荡
    function clickBtnByName(txt){
        var btns = $('.cmd_click3');
        btns.each(function(){
            if($(this).text() == txt){
                $(this).trigger('click');
                setTimeout(function(){
                    console.log(getTimes() +'点击扫荡');
                },1000)
            }
        });
    }
    // 打奇侠方法
    function startFightQixiaFn(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if(DomTxt == '比试奇侠'){
            $('#out2 .out2').addClass('doneQiXia');
            fightQixiaSwitch = true;
            Dom.html('取消奇侠');
            fightQiXiaFunc();
        }else{
            fightQixiaSwitch = false;
            clearInterval(fightSkillInter);
            clearInterval(setFight);
            Dom.html('比试奇侠');
        }
    }

    // 获取奇侠ID
    function getNewQiXiaId(name, QXindex){
        console.log("开始寻找奇侠："+name);
        var QX_ID = "";
        var npcindex=0;
        var els=g_obj_map.get("msg_room").elements;
        for (var i = els.length - 1; i >= 0; i--) {
            if (els[i].key.indexOf("npc") > -1) {
                if (els[i].value.indexOf(",") > -1) {
                    var elsitem_ar = els[i].value.split(',');
                    if (elsitem_ar.length > 1 && elsitem_ar[1] == name) {
                        // console.log(elsitem_ar[0]);
                        npcindex=els[i].key;
                        QX_ID = elsitem_ar[0];
                    }
                }
            }
        }
        if(QX_ID){
            return QX_ID
        }
        return false;
      
    }
    // 打奇侠
    function fightQiXiaFunc(){
        clickButton('home');
        zhaobing = true;
        console.log(getTimes() +'开始比试'+qixiaObj.name+'！');
        clickButton('open jhqx');
        clickButton('find_task_road qixia '+qixiaObj.index);
        if(fightQixiaSwitch){
            setTimeout(function(){
                var QiXiaId = getNewQiXiaId(qixiaObj.name, qixiaObj.index);
                eval("clickButton('fight " + QiXiaId + "')");
                fightSkillInter = setInterval(function(){
                    getQiXiaInfo();
                }, 2000)
                setFight = setInterval(function(){
                    dofightQixiaSet();
                }, 2000)
            },1000)
        }
    }

    // 比试奇侠技能
    function dofightQixiaSet(){
        var skillArr = Base.mySkillLists.split('；');
        if(zhaobing){
            skillArr = ['茅山道术','天师灭神剑'];
        }

        if(hasDog().length >0 && zhaobing){
            clickButton('escape');
            return false;
        }
        var skillIdA = ['1','2','3','4'];
        var clickSkillSwitch = false;
        $.each(skillIdA, function(index, val){
            var btn = $('#skill_'+val);
            var btnName = btn.text();
            for(var i = 0; i<skillArr.length; i++){
                var skillName = skillArr[i];
                if(btnName == skillName){
                    btn.find('button').trigger('click');
                    clickSkillSwitch = true;
                    break;
                }
            }
        })
    }
    
    // 获取面板信息
    function getQiXiaInfo(){
        var out = $('#out2 .out2');
        out.each(function(){
            if($(this).hasClass('doneQiXia')){
                return
            }
            $(this).addClass('doneQiXia');
            var txt = $(this).text();
            if(txt.indexOf('悄声') != '-1' ){
                mijingNum++;
                fightQixiaSwitch = false;
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                var place = getQxiaQuestionPlace(txt);
                console.log(getTimes() + '这是第'+mijingNum+'次秘境，地址是：' + place);
                setTimeout(function(){
                    fightQixiaSwitch = false;
                    clearInterval(fightSkillInter);
                    clearInterval(setFight);
                    GoPlaceInfo(place);
                },2000)
            }else if(txt.indexOf('20/20') != '-1' ){
                fightQixiaSwitch = false;
                clearInterval(fightSkillInter);
                clearInterval(setFight);
            }else if(txt.indexOf('逃跑成功') != '-1'){
                clickButton('home');
                clickButton('open jhqx');
                clickButton('find_task_road qixia '+qixiaObj.index);
                setTimeout(function(){
                    fightDog();
                },1000)
            }else if(txt.indexOf('今日亲密度操作次数') != '-1'){
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                setTimeout(function(){
                    fightQiXiaFunc();
                },1000)
            }else if(txt.match(qixiaObj.name + "往(.*?)离开。")){
                clearInterval(fightSkillInter);
                clearInterval(setFight);
                setTimeout(function(){
                    fightQiXiaFunc();
                },1000)
            }
        });
    }
    // 比试狗
    function fightDog(){
        if(getDogNum().length >0){
            doFightDog();
        }
    }
    function doFightDog(){
        var nameArr = [];
        var nameDom = $('.cmd_click3');
        console.log(getTimes() +'开始打兵');
        nameDom.each(function(){
            var name = $(this).text();
            if(name == '金甲符兵' || name == '玄阴符兵'){
                var npcText = $(this).attr('onclick');
                var id = getId(npcText);
                clickButton('fight '+id);
                zhaobing = false;
            }
        })
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
    function GoPlaceInfo(place){
        var placeNum = '';
        var placeSteps = [];
        switch(place){
            case '卢崖瀑布':
                placeNum = '22';
                placeSteps = [{'road': 'north'}];
                break;
            case '戈壁':
                placeNum = '21';
                placeSteps = [{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '草原':
                placeNum = '26';
                placeSteps = [{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;    
            case '天梯':
                placeNum = '24';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '观景台':
                placeNum = '24';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'east'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '启母石':
                placeNum = '22';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'west'},{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '无极老姆洞':
                placeNum = '22';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'west'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '千尺幢':
                placeNum = '4';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '猢狲愁':
                placeNum = '4';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'event_1_91604710'},{'road':'northwest'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '潭畔草地':
                placeNum = '4';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'event_1_91604710'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '临渊石台':
                placeNum = '4';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '玉女峰':
                placeNum = '4';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '长空栈道':
                placeNum = '4';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '山坳':
                placeNum = '1';
                placeSteps = [{'road': 'east'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '山溪畔':
                placeNum = '22';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'west'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'event_1_88705407'},{'road': 'south'},{'road': 'south'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '小洞天':
                placeNum = '24';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '观景台':
                placeNum = '24';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'east'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;          
            case '云步桥':
                placeNum = '24';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '桃花泉':
                placeNum = '3';
                placeSteps = [{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'northwest'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '碧水寒潭':
                placeNum = '18';
                placeSteps = [{'road': 'north'},{'road': 'northwest'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'northeast'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'east'},{'road': 'southeast'},{'road': 'southeast'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '玉壁瀑布':
                placeNum = '16';
                placeSteps = [{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'east'},{'road': 'north'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '湖边':
                placeNum = '16';
                placeSteps = [{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'east'},{'road': 'north'},{'road': 'east'},{'event': 'event_1_5221690'},{'road': 'south'},{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;    
            case '悬根松':
                placeNum = '9';
                placeSteps = [{'road': 'north'},{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '夕阳岭':
                placeNum = '9';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '沙丘小洞':
                placeNum = '6';
                placeSteps = [{'event': 'event_1_98623439'},{'road': 'northeast'},{'road': 'north'},{'road': 'northeast'},{'road': 'northeast'},{'road': 'northeast'},{'event': 'event_1_97428251'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '寒水潭':
                placeNum = '20';
                placeSteps = [{'road': 'west'},{'road': 'west'},{'road': 'south'},{'road': 'east'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'southwest'},{'road': 'southwest'},{'road': 'south'},{'road': 'east'},{'road': 'southeast'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '青云坪':
                placeNum = '13';
                placeSteps = [{'road': 'east'},{'road': 'south'},{'road': 'south'},{'road': 'west'},{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '悬崖':
                placeNum = '20';
                placeSteps = [{'road': 'west'},{'road': 'west'},{'road': 'south'},{'road': 'east'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'south'},{'road': 'southwest'},{'road': 'southwest'},{'road': 'south'},{'road': 'south'},{'road': 'east'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '奇槐坡':
                placeNum = '23';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '无名山峡谷':
                placeNum = '29';
                placeSteps = [{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'}];
                break;
            case '危崖前':
                placeNum = '25';
                placeSteps = [{'road': 'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
            case '九老洞':
                placeNum = '8';
                placeSteps = [{'road': 'west'},{'road': 'northwest'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'east'},{'road': 'north'},{'road': 'north'},{'road': 'east'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'west'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road': 'north'},{'road':'northwest'},{'road':'southwest'},{'road':'west'},{'road':'northwest'},{'road':'west'},{'event': 'find_task_road secret'},{'event': 'secret_op1'}];
                break;
        }

        GoPlace(placeNum, placeSteps);
    }
    async function GoPlace(num, steps){
        await clickButtonAsync('home');
        await clickButtonAsync('jh '+num);
        for(var i = 0 ; i<steps.length; i ++){
            for(var j in steps[i]){
                if(j == 'road'){
                    await clickButtonAsync('go '+steps[i][j]);
                }else if( j == 'event'){
                    await clickButtonAsync(steps[i][j]);
                }
            }
        }
    }
    /* 比试奇侠  :end */
    /* 撩奇侠  :start */
    function talkSelectQiXia(){
        GetNewQiXiaList();
        setTimeout(function(){
            startTalk();
        },3000)
    }
    function startTalk(){
         var isLive = true;
        for(var i = 0; i <4; i++){
            if(!QixiaInfoList[i].isOk){
                isLive = false;
            }
        }
        if(!isLive){
            console.log(getTimes() +'前4排名奇侠在浪中，请稍后再试');
            return;
        }
        for(var i =0 ; i<QixiaInfoList.length; i++){
            doTalkWithQixia(QixiaInfoList[i]);
        }
    }

    function doTalkWithQixia(info){
        var maxLength = 5;
        var QiXiaId = info.id;

        if(!QiXiaId){
            return;
        }
        if(!info.isOk){
            console.log(getTimes() + '没找到'+info.name+",请稍后再试");
            return;
        }

        console.log(getTimes() + "开始撩"+info.name+"！");
        go('open jhqx');
        go('find_task_road qixia '+info.index);
        
        for(var i = 0; i<maxLength; i++){
            go('ask '+ QiXiaId);
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
    /* 撩奇侠  :end */
    /* 杀天剑  :start */
    var TianJianNPCList = ["银狼军","铁狼军","镇擂斧将","甲士","赤豹死士","黑鹰死士","金狼死士","暗灵杀手","暗灵旗主","天剑真身","虹风","虹雨","虹雷","虹电","镇谷神兽","守谷神兽","饕餮幼崽","饕餮分身","饕餮兽魂","饕餮战神","镇潭神兽","守潭神兽","螣蛇幼崽","螣蛇分身","螣蛇兽魂","螣蛇战神","镇山神兽","守山神兽","应龙幼崽","应龙兽魂","应龙分身","应龙战神","镇殿神兽","守殿神兽","幽荧幼崽","幽荧兽魂","幽荧分身","幽荧战神"];
    var killTianJianIntervalFunc =  null;
    var currentNPCIndex = 0;
    function killTianJianTargetFunc(e){
        var mySkillLists =  Base.mySkillLists;
        var Dom = $(e.target);
        if (Dom.html() == '杀天剑'){
            currentNPCIndex = 0;
            console.log("开始杀天剑目标NPC！");
            Dom.html('停天剑');
            killTianJianIntervalFunc = setInterval(killTianJian, 1000);

        }else{
            console.log("停止杀天剑目标NPC！");
            Dom.html('杀天剑');
            clearInterval(killTianJianIntervalFunc);
        }
    }
    async function killTianJian(){
        if ($('span').text().slice(-7) == "不能杀这个人。"){
            currentNPCIndex = currentNPCIndex + 1;
            console.log("不能杀这个人！");
        }
        getTianJianTargetCode();
        if(genZhaoMode != 1){
            setTimeout(doKillSet, 1000);
        }
        if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
            currentNPCIndex = 0;
            console.log(getTimes() +'杀人一次！');
            await clickButtonAsync('prev_combat');
        }
    }
    async function getTianJianTargetCode(){
        var peopleList = $(".cmd_click3");
        var thisonclick = null;
        var targetNPCListHere = [];
        var countor= 0;
        for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
            // 打印 NPC 名字，button 名，相应的NPC名
            thisonclick = peopleList[i].getAttribute('onclick');
            var btnText = peopleList[i].innerText;
            if(btnText.indexOf('尸体') != '-1'){
                continue;
            }
            if(btnText.indexOf('离开') != '-1'){
                continue;
            }
            if(btnText.indexOf('接引') != '-1'){
                continue;
            }
            if(btnText.indexOf('骸骨') != '-1'){
                continue;
            }
            if (TianJianNPCList.contains(btnText)){
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
            var neili = geForcePercent();
            if(neili <50){
                await clickButtonAsync('items use snow_qiannianlingzhi');
                await clickButtonAsync('items use snow_qiannianlingzhi');
                await clickButtonAsync('items use snow_qiannianlingzhi');
                await clickButtonAsync('items use snow_qiannianlingzhi');
                await clickButtonAsync('items use snow_qiannianlingzhi');
            }
            console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
            await clickButtonAsync('kill ' + targetCode); // 点击杀人
            setTimeout(detectKillTianJianInfo,1000); // 200 ms后获取杀人情况，是满了还是进入了
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
            if (obj.indexOf(this[i]) != '-1') {
                return true;
            }
        }
        return false;
    }
    /* 杀天剑  :end */
    /* 喂鳄鱼+侠客岛  :start */
    function newGetXiaKe(){
        goXiaKe();
    }
    async function goXiaKe(){
        await clickButtonAsync('home');
        await clickButtonAsync('jh 36');
        await clickButtonAsync('yell');
        setTimeout(function(){
            goRead();
        },25000);
    }
    async function goRead(){
        await clickButtonAsync('go east');
        await clickButtonAsync('go northeast');
        await clickButtonAsync('go northeast');
        await clickButtonAsync('go northeast');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        setTimeout(function(){
            clickBtn('进入侧厅');
            readBoard();
        },3000)
    }
    async function readBoard(){
        await clickButtonAsync('go east');
        setTimeout(function(){
            clickBtn('观阅');
            goJump();
        },3000)
    }
    async function goJump(){
        await clickButtonAsync('go west');
        await clickButtonAsync('go north');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        await clickButtonAsync('go south');
        await clickButtonAsync('go east');
        setTimeout(function(){
            clickBtn('跳下去')
            setTimeout(function(){
                isCorrectJump();
            },2000)
        },3000)
    }
    async function goBackXiaKe(){
        await clickButtonAsync('go northwest');
        await clickButtonAsync('go west');
        await clickButtonAsync('go southwest');
        await clickButtonAsync('go west');
        await clickButtonAsync('go north');
        await clickButtonAsync('go north');
        await clickButtonAsync('go north');
        await clickButtonAsync('go west');
        await clickButtonAsync('go west');
        await clickButtonAsync('go south');
        await clickButtonAsync('go west');
        await clickButtonAsync('go northwest');
        await clickButtonAsync('go west');
        await clickButtonAsync('go east');
        await clickButtonAsync('go northeast');
        await clickButtonAsync('go northeast');
        await clickButtonAsync('go northeast');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        await clickButtonAsync('go east');
        await clickButtonAsync('go south');
        await clickButtonAsync('go east');
        setTimeout(function(){
            clickBtn('跳下去')
            setTimeout(function(){
                isCorrectJump();
            },2000)
        },2000)

    }
    async function isCorrectJump(){
        var clickName = getClickName('进入甬道');
        if(clickName){
            clickBtn('进入甬道');
            setTimeout(function(){
                clickButtonAsync('go east');
                clickButtonAsync('go east');
                clickButtonAsync('go south');
                setTimeout(function(){
                    clickBtn('领悟');
                    clickButtonAsync('home');
                },2000);
            },2000)
        }else{
            setTimeout(function(){
                clickBtn('游出去');
            },2000)
            setTimeout(function(){
                goBackXiaKe();
            },4000);
        }
    }
    function clickBtn(name){
        var btn = $('.cmd_click3');
        btn.each(function(){
            var _name = $(this).text();
            if(_name == name){
                $(this).trigger('click');
            }
        })
    }
    function getClickName(name){
        var nameSwitch = false;
        var btn = $('.cmd_click3');
        btn.each(function(){
            var _name = $(this).text();
            if(_name == name){
                nameSwitch = true;
            }
        })
        return nameSwitch;
    }
    /* 喂鳄鱼+侠客岛  :end */
    /* 试剑  :start */
    var  zdskill111 = Base.mySkillLists;
    var killDrunkIntervalFunc1 =  null;
    async function CheckIn1(e){
        await clickButtonAsync('home');
        window.Dom = $(e.target);
        if(Dom.html() == "试剑"){
            console.log(getTimes() +'开始试剑');
            Dom.html("停止");
            await clickButtonAsync('swords report go');
            await clickButtonAsync('swords');
            await clickButtonAsync('swords select_member heimuya_dfbb');   // 东方
            await clickButtonAsync('swords select_member qingcheng_mudaoren');   //木道人
            if(!Base.getCorrectText('4253282')){
                await clickButtonAsync('swords select_member tangmen_madam');  //欧阳敏
            }
            await clickButtonAsync('swords fight_test go');
            killDrunkIntervalFunc1=setInterval(killDrunMan1,2000);//code
        }
        else{
            console.log(getTimes() +'停止试剑');
            Dom.html("试剑");
            clearInterval(killDrunkIntervalFunc1)
        }
    }
    function isContains1(str, substr) {
        if(!str){
            return -1;
        }
        return str.indexOf(substr) >= 0;
    }
    function killDrunMan1(){
        var doneShijian = $('span:contains(你今天试剑次数已达限额)');
        if(doneShijian.length >0){
            Dom.html("试剑");
            clearInterval(killDrunkIntervalFunc1);
            return;
        }else{
            clickButton('swords fight_test go');
            doKillSet();
        }
    }
    /* 试剑  :end */
    /* 答题  :start */
    var answerQuestionsInterval = null;
    var QuestAnsLibs = {
        "铁手镯 可以在哪位npc那里获得？":"a",
        "首次通过乔阴县不可以获得那种奖励？":"a",
        "“白玉牌楼”场景是在哪个地图上？":"c",
        "“百龙山庄”场景是在哪个地图上？":"b",
        "“冰火岛”场景是在哪个地图上？":"b",
        "“常春岛渡口”场景是在哪个地图上？":"c",
        "“跪拜坪”场景是在哪个地图上？":"b",
        "“翰墨书屋”场景是在哪个地图上？":"c",
        "“花海”场景是在哪个地图上？":"a",
        "“留云馆”场景是在哪个地图上？":"b",
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
        "8级的装备摹刻需要几把刻刀":"a",
        "NPC公平子在哪一章地图":"a",
        "瑷伦在晚月庄的哪个场景":"b",
        "安惜迩是在那个场景":"c",
        "黯然销魂掌有多少招式？":"c",
        "黯然销魂掌是哪个门派的技能":"a",
        "八卦迷阵是哪个门派的阵法？":"b",
        "八卦迷阵是那个门派的阵法":"a",
        "白金戒指可以在哪位那里获得？":"b",
        "白金手镯可以在哪位那里获得？":"a",
        "白金项链可以在哪位那里获得？":"b",
        "白蟒鞭的伤害是多少？":"a",
        "白驼山第一位要拜的师傅是谁":"a",
        "白银宝箱礼包多少元宝一个":"d",
        "白玉腰束是腰带类的第几级装备？":"b",
        "拜师风老前辈需要正气多少":"b",
        "拜师老毒物需要蛤蟆功多少级":"a",
        "拜师铁翼需要多少内力":"b",
        "拜师小龙女需要容貌多少":"c",
        "拜师张三丰需要多少正气":"b",
        "包家将是哪个门派的师傅":"a",
        "包拯在哪一章":"d",
        "宝石合成一次需要消耗多少颗低级宝石？":"c",
        "宝玉帽可以在哪位那里获得？":"d",
        "宝玉鞋击杀哪个可以获得":"a",
        "宝玉鞋在哪获得":"a",
        "暴雨梨花针的伤害是多少？":"c",
        "北斗七星阵是第几个的组队副本":"c",
        "北冥神功是哪个门派的技能":"b",
        "北岳殿神像后面是哪位":"b",
        "匕首加什么属性":"c",
        "碧海潮生剑在哪位师傅处学习":"a",
        "碧磷鞭的伤害是多少？":"b",
        "镖局保镖是挂机里的第几个任务":"d",
        "冰魄银针的伤害是多少？":"b",
        "病维摩拳是哪个门派的技能":"b",
        "不可保存装备下线多久会消失":"c",
        "不属于白驼山的技能是什么":"b",
        "沧海护腰可以镶嵌几颗宝石":"d",
        "沧海护腰是腰带类的第几级装备？":"a",
        "藏宝图在哪个NPC处购买":"a",
        "藏宝图在哪个处购买":"b",
        "藏宝图在哪里那里买":"a",
        "草帽可以在哪位那里获得？":"b",
        "成功易容成异性几次可以领取易容成就奖":"b",
        "成长计划第七天可以领取多少元宝？":"d",
        "成长计划六天可以领取多少银两？":"d",
        "成长计划需要多少元宝方可购买？":"a",
        "城里打擂是挂机里的第几个任务":"d",
        "城里抓贼是挂机里的第几个任务":"b",
        "充值积分不可以兑换下面什么物品":"d",
        "出生选武学世家增加什么":"a",
        "闯楼第几层可以获得称号“藏剑楼护法”":"b",
        "闯楼第几层可以获得称号“藏剑楼楼主”":"d",
        "闯楼第几层可以获得称号“藏剑楼长老”":"c",
        "闯楼每多少层有称号奖励":"a",
        "春风快意刀是哪个门派的技能":"b",
        "春秋水色斋需要多少杀气才能进入":"d",
        "从哪个处进入跨服战场":"a",
        "摧心掌是哪个门派的技能":"a",
        "达摩在少林哪个场景":"c",
        "达摩杖的伤害是多少？":"d",
        "打开引路蜂礼包可以得到多少引路蜂？":"b",
        "打排行榜每天可以完成多少次？":"a",
        "打土匪是挂机里的第几个任务":"c",
        "打造刻刀需要多少个玄铁":"a",
        "打坐增长什么属性":"a",
        "大保险卡可以承受多少次死亡后不降技能等级？":"b",
        "大乘佛法有什么效果":"d",
        "大旗门的修养术有哪个特殊效果":"a",
        "大旗门的云海心法可以提升哪个属性":"c",
        "大招寺的金刚不坏功有哪个特殊效果":"a",
        "大招寺的铁布衫有哪个特殊效果":"c",
        "当日最低累积充值多少元即可获得返利？":"b",
        "刀法基础在哪掉落":"a",
        "倒乱七星步法是哪个门派的技能":"d",
        "等级多少才能在世界频道聊天？":"c",
        "第一个副本需要多少等级才能进入":"d",
        "貂皮斗篷是披风类的第几级装备？":"b",
        "丁老怪是哪个门派的终极师傅":"a",
        "丁老怪在星宿海的哪个场景":"b",
        "东方教主在魔教的哪个场景":"b",
        "斗转星移是哪个门派的技能":"a",
        "斗转星移阵是哪个门派的阵法":"a",
        "毒龙鞭的伤害是多少？":"a",
        "毒物阵法是哪个门派的阵法":"b",
        "独孤求败有过几把剑？":"d",
        "独龙寨是第几个组队副本":"a",
        "读书写字301-400级在哪里买书":"c",
        "读书写字最高可以到多少级":"b",
        "端茶递水是挂机里的第几个任务":"b",
        "断云斧是哪个门派的技能":"a",
        "锻造一把刻刀需要多少玄铁碎片锻造？":"c",
        "锻造一把刻刀需要多少银两？":"a",
        "兑换易容面具需要多少玄铁碎片":"c",
        "多少消费积分换取黄金宝箱":"a",
        "多少消费积分可以换取黄金钥匙":"b",
        "翻译梵文一次多少银两":"d",
        "方媃是哪个门派的师傅":"b",
        "飞仙剑阵是哪个门派的阵法":"b",
        "风老前辈在华山哪个场景":"b",
        "风泉之剑加几点悟性":"c",
        "风泉之剑可以在哪位那里获得？":"b",
        "风泉之剑在哪里获得":"d",
        "疯魔杖的伤害是多少？":"b",
        "伏虎杖的伤害是多少？":"c",
        "副本完成后不可获得下列什么物品":"b",
        "副本一次最多可以进几人":"a",
        "副本有什么奖励":"d",
        "富春茶社在哪一章":"c",
        "改名字在哪改？":"d",
        "丐帮的绝学是什么":"a",
        "丐帮的轻功是哪个":"b",
        "干苦力是挂机里的第几个任务":"a",
        "钢丝甲衣可以在哪位那里获得？":"d",
        "高级乾坤再造丹加什么":"b",
        "高级乾坤再造丹是增加什么的？":"b",
        "高级突破丹多少元宝一颗":"d",
        "割鹿刀可以在哪位npc那里获得？":"b",
        "葛伦在大招寺的哪个场景":"b",
        "根骨能提升哪个属性":"c",
        "功德箱捐香火钱有什么用":"a",
        "功德箱在雪亭镇的哪个场景？":"c",
        "购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？":"b",
        "孤独求败称号需要多少论剑积分兑换":"b",
        "孤儿出身增加什么":"d",
        "古灯大师是哪个门派的终极师傅":"c",
        "古灯大师在大理哪个场景":"c",
        "古墓多少级以后才能进去？":"d",
        "寒玉床睡觉修炼需要多少点内力值":"c",
        "寒玉床睡觉一次多久":"c",
        "寒玉床需要切割多少次":"d",
        "寒玉床在哪里切割":"a",
        "寒玉床在那个地图可以找到？":"a",
        "黑狗血在哪获得":"b",
        "黑水伏蛟可以在哪位npc那里获得？":"c",
        "红宝石加什么属性":"b",
        "洪帮主在洛阳哪个场景":"c",
        "虎皮腰带是腰带类的第几级装备？":"a",
        "花不为在哪一章":"a",
        "花花公子在哪个地图":"a",
        "华山村王老二掉落的物品是什么":"a",
        "华山施戴子掉落的物品是什么":"b",
        "华山武器库从哪个NPC进":"d",
        "黄宝石加什么属性":"c",
        "黄岛主在桃花岛的哪个场景":"d",
        "黄袍老道是哪个门派的师傅":"c",
        "积分商城在雪亭镇的哪个场景？":"c",
        "技能柳家拳谁教的？":"a",
        "技能数量超过了什么消耗潜能会增加":"b",
        "嫁衣神功是哪个门派的技能":"b",
        "剑冢在哪个地图":"a",
        "街头卖艺是挂机里的第几个任务":"a",
        "金弹子的伤害是多少？":"a",
        "金刚不坏功有什么效果":"a",
        "金刚杖的伤害是多少？":"a",
        "金戒指可以在哪位npc那里获得？":"d",
        "金手镯可以在哪位npc那里获得？":"b",
        "金丝鞋可以在哪位npc那里获得？":"b",
        "金项链可以在哪位npc那里获得？":"d",
        "金玉断云是哪个门派的阵法":"a",
        "锦缎腰带是腰带类的第几级装备？":"a",
        "精铁棒可以在哪位那里获得？":"d",
        "九区服务器名称":"d",
        "九阳神功是哪个门派的技能":"c",
        "九阴派梅师姐在星宿海哪个场景":"a",
        "军营是第几个组队副本":"b",
        "开通VIP月卡最低需要当天充值多少元方有购买资格？":"a",
        "可以召唤金甲伏兵助战是哪个门派？":"a",
        "客商在哪一章":"b",
        "孔雀氅可以镶嵌几颗宝石":"b",
        "孔雀氅是披风类的第几级装备？":"c",
        "枯荣禅功是哪个门派的技能":"a",
        "跨服是星期几举行的":"b",
        "跨服天剑谷每周六几点开启":"a",
        "跨服需要多少级才能进入":"c",
        "跨服在哪个场景进入":"c",
        "兰花拂穴手是哪个门派的技能":"a",
        "蓝宝石加什么属性":"a",
        "蓝止萍在哪一章":"c",
        "蓝止萍在晚月庄哪个小地图":"b",
        "老毒物在白驮山的哪个场景":"b",
        "老顽童在全真教哪个场景":"b",
        "莲花掌是哪个门派的技能":"a",
        "烈火旗大厅是那个地图的场景":"c",
        "烈日项链可以镶嵌几颗宝石":"c",
        "林祖师是哪个门派的师傅":"a",
        "灵蛇杖法是哪个门派的技能":"c",
        "凌波微步是哪个门派的技能":"b",
        "凌虚锁云步是哪个门派的技能":"b",
        "领取消费积分需要寻找哪个NPC？":"c",
        "鎏金缦罗是披风类的第几级装备？":"d",
        "柳淳风在哪一章":"c",
        "柳淳风在雪亭镇哪个场景":"b",
        "柳文君所在的位置":"a",
        "六脉神剑是哪个门派的绝学":"a",
        "陆得财是哪个门派的师傅":"c",
        "陆得财在乔阴县的哪个场景":"a",
        "论剑每天能打几次":"a",
        "论剑是每周星期几":"c",
        "论剑是什么时间点正式开始":"a",
        "论剑是星期几进行的":"c",
        "论剑是星期几举行的":"c",
        "论剑输一场获得多少论剑积分":"a",
        "论剑要在晚上几点前报名":"b",
        "论剑在周几进行？":"b",
        "论剑中步玄派的师傅是哪个":"a",
        "论剑中大招寺第一个要拜的师傅是谁":"c",
        "论剑中古墓派的终极师傅是谁":"d",
        "论剑中花紫会的师傅是谁":"c",
        "论剑中青城派的第一个师傅是谁":"a",
        "论剑中青城派的终极师傅是谁":"d",
        "论剑中逍遥派的终极师傅是谁":"c",
        "论剑中以下不是峨嵋派技能的是哪个":"b",
        "论剑中以下不是华山派的人物的是哪个":"d",
        "论剑中以下哪个不是大理段家的技能":"c",
        "论剑中以下哪个不是大招寺的技能":"b",
        "论剑中以下哪个不是峨嵋派可以拜师的师傅":"d",
        "论剑中以下哪个不是丐帮的技能":"d",
        "论剑中以下哪个不是丐帮的人物":"a",
        "论剑中以下哪个不是古墓派的的技能":"b",
        "论剑中以下哪个不是华山派的技能的":"d",
        "论剑中以下哪个不是明教的技能":"d",
        "论剑中以下哪个不是魔教的技能":"a",
        "论剑中以下哪个不是魔教的人物":"d",
        "论剑中以下哪个不是全真教的技能":"d",
        "论剑中以下哪个不是是晚月庄的技能":"d",
        "论剑中以下哪个不是唐门的技能":"c",
        "论剑中以下哪个不是唐门的人物":"c",
        "论剑中以下哪个不是铁雪山庄的技能":"d",
        "论剑中以下哪个不是铁血大旗门的技能":"c",
        "论剑中以下哪个是大理段家的技能":"a",
        "论剑中以下哪个是大招寺的技能":"b",
        "论剑中以下哪个是丐帮的技能":"b",
        "论剑中以下哪个是花紫会的技能":"a",
        "论剑中以下哪个是华山派的技能的":"a",
        "论剑中以下哪个是明教的技能":"b",
        "论剑中以下哪个是青城派的技能":"b",
        "论剑中以下哪个是唐门的技能":"b",
        "论剑中以下哪个是天邪派的技能":"b",
        "论剑中以下哪个是天邪派的人物":"a",
        "论剑中以下哪个是铁雪山庄的技能":"c",
        "论剑中以下哪个是铁血大旗门的技能":"b",
        "论剑中以下哪个是铁血大旗门的师傅":"a",
        "论剑中以下哪个是晚月庄的技能":"a",
        "论剑中以下哪个是晚月庄的人物":"a",
        "论剑中以下是峨嵋派技能的是哪个":"a",
        "论语在哪购买":"a",
        "骆云舟在哪一章":"c",
        "骆云舟在乔阴县的哪个场景":"b",
        "落英神剑掌是哪个门派的技能":"b",
        "吕进在哪个地图":"a",
        "绿宝石加什么属性":"c",
        "漫天花雨匕在哪获得":"a",
        "茅山的绝学是什么":"b",
        "茅山的天师正道可以提升哪个属性":"d",
        "茅山可以招几个宝宝":"c",
        "茅山派的轻功是什么":"b",
        "茅山天师正道可以提升什么":"c",
        "茅山学习什么技能招宝宝":"a",
        "茅山在哪里拜师":"c",
        "每次合成宝石需要多少银两？":"a",
        "每个玩家最多能有多少个好友":"b",
        "vip每天不可以领取什么":"b",
        "每天的任务次数几点重置":"d",
        "每天分享游戏到哪里可以获得20元宝":"a",
        "每天能挖几次宝":"d",
        "每天能做多少个谜题任务":"a",
        "每天能做多少个师门任务":"c",
        "每天微信分享能获得多少元宝":"d",
        "每天有几次试剑":"b",
        "每天在线多少个小时即可领取消费积分？":"b",
        "每突破一次技能有效系数加多少":"a",
        "密宗伏魔是哪个门派的阵法":"c",
        "灭绝师太在第几章":"c",
        "灭绝师太在峨眉山哪个场景":"a",
        "明教的九阳神功有哪个特殊效果":"a",
        "明月帽要多少刻刀摩刻？":"a",
        "摹刻10级的装备需要摩刻技巧多少级":"b",
        "摹刻烈日宝链需要多少级摩刻技巧？":"c",
        "摹刻扬文需要多少把刻刀？":"a",
        "魔鞭诀在哪里学习":"d",
        "魔教的大光明心法可以提升哪个属性":"d",
        "莫不收在哪一章":"a",
        "墨磷腰带是腰带类的第几级装备？":"d",
        "木道人在青城山的哪个场景":"b",
        "慕容家主在慕容山庄的哪个场景":"a",
        "慕容山庄的斗转星移可以提升哪个属性":"d",
        "哪个NPC掉落拆招基础":"a",
        "哪个处可以捏脸":"a",
        "哪个分享可以获得20元宝":"b",
        "哪个技能不是魔教的":"d",
        "哪个门派拜师没有性别要求":"d",
        "哪个npc属于全真七子":"b",
        "哪样不能获得玄铁碎片":"c",
        "能增容貌的是下面哪个技能":"a",
        "捏脸需要花费多少银两？":"c",
        "捏脸需要寻找哪个NPC？":"a",
        "欧阳敏是哪个门派的？":"b",
        "欧阳敏是哪个门派的师傅":"b",
        "欧阳敏在哪一章":"a",
        "欧阳敏在唐门的哪个场景":"c",
        "排行榜最多可以显示多少名玩家？":"a",
        "逄义是在那个场景":"a",
        "披星戴月是披风类的第几级装备？":"d",
        "劈雳拳套有几个镶孔":"a",
        "霹雳掌套的伤害是多少":"b",
        "辟邪剑法是哪个门派的绝学技能":"a",
        "辟邪剑法在哪学习":"b",
        "婆萝蜜多心经是哪个门派的技能":"b",
        "七宝天岚舞是哪个门派的技能":"d",
        "七星鞭的伤害是多少？":"c",
        "七星剑法是哪个门派的绝学":"a",
        "棋道是哪个门派的技能":"c",
        "千古奇侠称号需要多少论剑积分兑换":"d",
        "乾坤大挪移属于什么类型的武功":"a",
        "乾坤一阳指是哪个师傅教的":"a",
        "青城派的道德经可以提升哪个属性":"c",
        "青城派的道家心法有哪个特殊效果":"a",
        "清风寨在哪":"b",
        "清风寨在哪个地图":"d",
        "清虚道长在哪一章":"d",
        "去唐门地下通道要找谁拿钥匙":"a",
        "全真的道家心法有哪个特殊效果":"a",
        "全真的基本阵法有哪个特殊效果":"b",
        "全真的双手互搏有哪个特殊效果":"c",
        "日月神教大光明心法可以提升什么":"d",
        "如何将华山剑法从400级提升到440级？":"d",
        "如意刀是哪个门派的技能":"c",
        "山河藏宝图需要在哪个NPC手里购买？":"d",
        "上山打猎是挂机里的第几个任务":"c",
        "少林的混元一气功有哪个特殊效果":"d",
        "少林的易筋经神功有哪个特殊效果":"a",
        "蛇形刁手是哪个门派的技能":"b",
        "什么影响打坐的速度":"c",
        "什么影响攻击力":"d",
        "什么装备不能镶嵌黄水晶":"d",
        "什么装备都能镶嵌的是什么宝石？":"c",
        "什么装备可以镶嵌紫水晶":"c",
        "神雕大侠所在的地图":"b",
        "神雕大侠在哪一章":"a",
        "神雕侠侣的时代背景是哪个朝代？":"d",
        "神雕侠侣的作者是?":"b",
        "升级什么技能可以提升根骨":"a",
        "生死符的伤害是多少？":"a",
        "师门磕头增加什么":"a",
        "师门任务每天可以完成多少次？":"a",
        "师门任务每天可以做多少个？":"c",
        "师门任务什么时候更新？":"b",
        "师门任务一天能完成几次":"d",
        "师门任务最多可以完成多少个？":"d",
        "施令威在哪个地图":"b",
        "石师妹哪个门派的师傅":"c",
        "使用朱果经验潜能将分别增加多少？":"a",
        "首次通过桥阴县不可以获得那种奖励？":"a",
        "受赠的消费积分在哪里领取":"d",
        "兽皮鞋可以在哪位那里获得？":"b",
        "树王坟在第几章节":"c",
        "双儿在扬州的哪个小地图":"a",
        "孙天灭是哪个门派的师傅":"c",
        "踏雪无痕是哪个门派的技能":"b",
        "踏云棍可以在哪位那里获得？":"a",
        "唐门的唐门毒经有哪个特殊效果":"a",
        "唐门密道怎么走":"c",
        "天蚕围腰可以镶嵌几颗宝石":"d",
        "天蚕围腰是腰带类的第几级装备？":"d",
        "天山姥姥在逍遥林的哪个场景":"d",
        "天山折梅手是哪个门派的技能":"c",
        "天师阵法是哪个门派的阵法":"b",
        "天邪派在哪里拜师":"b",
        "天羽奇剑是哪个门派的技能":"a",
        "铁戒指可以在哪位那里获得？":"a",
        "铁血大旗门云海心法可以提升什么":"a",
        "通灵需要花费多少银两？":"d",
        "通灵需要寻找哪个NPC？":"c",
        "突破丹在哪里购买":"b",
        "屠龙刀法是哪个门派的绝学技能":"b",
        "屠龙刀是什么级别的武器":"a",
        "挖剑冢可得什么":"a",
        "弯月刀可以在哪位那里获得？":"b",
        "玩家每天能够做几次正邪任务":"c",
        "玩家想修改名字可以寻找哪个NPC？":"a",
        "晚月庄的内功是什么":"b",
        "晚月庄的七宝天岚舞可以提升哪个属性":"b",
        "晚月庄的小贩在下面哪个地点":"a",
        "晚月庄七宝天岚舞可以提升什么":"b",
        "晚月庄主线过关要求":"a",
        "王铁匠是在那个场景":"b",
        "王重阳是哪个门派的师傅":"b",
        "魏无极处读书可以读到多少级？":"a",
        "魏无极身上掉落什么装备":"c",
        "魏无极在第几章":"a",
        "闻旗使在哪个地图":"a",
        "乌金玄火鞭的伤害是多少？":"d",
        "乌檀木刀可以在哪位npc那里获得？":"d",
        "钨金腰带是腰带类的第几级装备？":"d",
        "武当派的绝学技能是以下哪个":"d",
        "武穆兵法提升到多少级才能出现战斗必刷？":"d",
        "武穆兵法通过什么学习":"a",
        "武学世家加的什么初始属性":"a",
        "舞中之武是哪个门派的阵法":"b",
        "西毒蛇杖的伤害是多少？":"c",
        "吸血蝙蝠在下面哪个地图":"a",
        "下列哪项战斗不能多个玩家一起战斗？":"a",
        "下列装备中不可摹刻的是":"c",
        "下面哪个不是古墓的师傅":"d",
        "下面哪个不是门派绝学":"d",
        "下面哪个不是魔教的":"d",
        "下面哪个地点不是乔阴县的":"d",
        "下面哪个门派是正派":"a",
        "下面哪个是天邪派的师傅":"a",
        "下面有什么是寻宝不能获得的":"c",
        "向师傅磕头可以获得什么？":"b",
        "逍遥步是哪个门派的技能":"a",
        "逍遥林是第几章的地图":"c",
        "逍遥林怎么弹琴可以见到天山姥姥":"b",
        "逍遥派的绝学技能是以下哪个":"a",
        "萧辟尘在哪一章":"d",
        "小李飞刀的伤害是多少？":"d",
        "小龙女住的古墓是谁建造的？":"b",
        "小男孩在华山村哪里":"a",
        "新人礼包在哪个npc处兑换":"a",
        "新手礼包在哪里领取":"a",
        "新手礼包在哪领取？":"c",
        "需要使用什么衣服才能睡寒玉床":"a",
        "选择孤儿会影响哪个属性":"c",
        "选择商贾会影响哪个属性":"b",
        "选择书香门第会影响哪个属性":"b",
        "选择武学世家会影响哪个属性":"a",
        "学习屠龙刀法需要多少内力":"b",
        "雪莲有什么作用":"a",
        "雪蕊儿是哪个门派的师傅":"a",
        "雪蕊儿在铁雪山庄的哪个场景":"d",
        "扬文的属性":"a",
        "扬州询问黑狗能到下面哪个地点":"a",
        "扬州在下面哪个地点的处可以获得玉佩":"c",
        "羊毛斗篷是披风类的第几级装备？":"a",
        "阳刚之劲是哪个门派的阵法":"c",
        "杨过小龙女分开多少年后重逢?":"c",
        "杨过在哪个地图":"a",
        "夜行披风是披风类的第几级装备？":"a",
        "夜皇在大旗门哪个场景":"c",
        "一个队伍最多有几个队员":"c",
        "一天能完成谜题任务多少个":"b",
        "一天能完成师门任务有多少个":"c",
        "一天能完成挑战排行榜任务多少次":"a",
        "一张分身卡的有效时间是多久":"c",
        "一指弹在哪里领悟":"b",
        "移开明教石板需要哪项技能到一定级别":"a",
        "以下不是步玄派的技能的哪个":"c",
        "以下不是天宿派师傅的是哪个":"c",
        "以下不是隐藏门派的是哪个":"d",
        "以下哪个宝石不能镶嵌到戒指":"c",
        "以下哪个宝石不能镶嵌到内甲":"a",
        "以下哪个宝石不能镶嵌到披风":"c",
        "以下哪个宝石不能镶嵌到腰带":"c",
        "以下哪个宝石不能镶嵌到衣服":"a",
        "以下哪个不是道尘禅师教导的武学？":"d",
        "以下哪个不是何不净教导的武学？":"c",
        "以下哪个不是慧名尊者教导的技能？":"d",
        "以下哪个不是空空儿教导的武学？":"b",
        "以下哪个不是梁师兄教导的武学？":"b",
        "以下哪个不是论剑的皮肤？":"d",
        "以下哪个不是全真七子？":"c",
        "以下哪个不是宋首侠教导的武学？":"d",
        "以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？":"a",
        "以下哪个不是岳掌门教导的武学？":"a",
        "以下哪个不是在洛阳场景":"d",
        "以下哪个不是在雪亭镇场景":"d",
        "以下哪个不是在扬州场景":"d",
        "以下哪个不是知客道长教导的武学？":"b",
        "以下哪个门派不是隐藏门派？":"c",
        "以下哪个门派是正派？":"d",
        "以下哪个门派是中立门派？":"a",
        "以下哪个是步玄派的祖师":"b",
        "以下哪个是封山派的祖师":"c",
        "以下哪个是花紫会的祖师":"a",
        "以下哪个是晚月庄的祖师":"d",
        "以下哪些物品不是成长计划第二天可以领取的？":"c",
        "以下哪些物品不是成长计划第三天可以领取的？":"d",
        "以下哪些物品不是成长计划第一天可以领取的？":"d",
        "以下哪些物品是成长计划第四天可以领取的？":"a",
        "以下哪些物品是成长计划第五天可以领取的？":"b",
        "以下属于邪派的门派是哪个":"b",
        "以下属于正派的门派是哪个":"a",
        "以下谁不精通降龙十八掌？":"d",
        "以下有哪些物品不是每日充值的奖励？":"d",
        "倚天剑加多少伤害":"d",
        "倚天屠龙记的时代背景哪个朝代？":"a",
        "易容后保持时间是多久":"a",
        "易容面具需要多少玄铁兑换":"c",
        "易容术多少级才可以易容成异性NPC":"a",
        "易容术可以找哪位NPC学习？":"b",
        "易容术向谁学习":"a",
        "易容术在哪里学习":"a",
        "易容术在哪学习？":"b",
        "银手镯可以在哪位那里获得？":"b",
        "银丝链甲衣可以在哪位npc那里获得？":"a",
        "银项链可以在哪位那里获得？":"b",
        "尹志平是哪个门派的师傅":"b",
        "隐者之术是那个门派的阵法":"a",
        "鹰爪擒拿手是哪个门派的技能":"a",
        "影响你出生的福缘的出生是？":"d",
        "油流麻香手是哪个门派的技能":"a",
        "游龙散花是哪个门派的阵法":"d",
        "玉蜂浆在哪个地图获得":"a",
        "玉女剑法是哪个门派的技能":"b",
        "岳掌门在哪一章":"a",
        "云九天是哪个门派的师傅":"c",
        "云问天在哪一章":"a",
        "在洛阳萧问天那可以学习什么心法":"b",
        "在庙祝处洗杀气每次可以消除多少点":"a",
        "在哪个NPC可以购买恢复内力的药品？":"c",
        "在哪个处可以更改名字":"a",
        "在哪个处领取免费消费积分":"d",
        "在哪个处能够升级易容术":"b",
        "在哪里可以找到“香茶”？":"a",
        "在哪里捏脸提升容貌":"d",
        "在哪里消杀气":"a",
        "在逍遥派能学到的技能是哪个":"a",
        "在雪亭镇李火狮可以学习多少级柳家拳":"b",
        "在战斗界面点击哪个按钮可以进入聊天界面":"d",
        "在正邪任务中不能获得下面什么奖励？":"d",
        "怎么样获得免费元宝":"a",
        "赠送李铁嘴银两能够增加什么":"a",
        "张教主在明教哪个场景":"d",
        "张三丰在哪一章":"d",
        "张三丰在武当山哪个场景":"d",
        "张松溪在哪个地图":"c",
        "张天师是哪个门派的师傅":"a",
        "张天师在茅山哪个场景":"d",
        "长虹剑在哪位那里获得？":"a",
        "长剑在哪里可以购买？":"a",
        "正邪任务杀死好人增长什么":"b",
        "正邪任务一天能做几次":"a",
        "正邪任务中客商的在哪个地图":"a",
        "正邪任务中卖花姑娘在哪个地图":"b",
        "正邪任务最多可以完成多少个？":"d",
        "支线对话书生上魁星阁二楼杀死哪个NPC给10元宝":"a",
        "朱姑娘是哪个门派的师傅":"a",
        "朱老伯在华山村哪个小地图":"b",
        "追风棍可以在哪位npc那里获得？":"a",
        "追风棍在哪里获得":"b",
        "紫宝石加什么属性":"d",
        "下面哪个npc不是魔教的":"d",
        "藏宝图在哪里npc那里买":"a",
        "从哪个npc处进入跨服战场":"a",
        "钻石项链在哪获得":"a",
        "在哪个npc处能够升级易容术":"b",
        "扬州询问黑狗子能到下面哪个地点":"a",
        "北岳殿神像后面是哪位npc":"b",
        "兽皮鞋可以在哪位npc那里获得？":"b",
        "在哪个npc处领取免费消费积分":"d",
        "踏云棍可以在哪位npc那里获得？":"a",
        "钢丝甲衣可以在哪位npc那里获得？":"d",
        "哪个npc处可以捏脸":"a",
        "草帽可以在哪位npc那里获得？":"b",
        "铁戒指可以在哪位npc那里获得？":"a",
        "银项链可以在哪位npc那里获得？":"b",
        "在哪个npc处可以更改名字":"a",
        "长剑在哪里可以购买？":"a",
        "宝玉帽可以在哪位npc那里获得？":"d",
        "论剑中以下哪个不是晚月庄的技能":"d",
        "清风寨在哪":"b",
        "精铁棒可以在哪位npc那里获得？":"d",
        "弯月刀可以在哪位npc那里获得？":"b",
        "密宗伏魔是哪个门派的阵法":"c",
        "vip每天不可以领取什么":"b",
        "华山施戴子掉落的物品是什么":"b",
        "钻石项链在哪获得":"a",
        "藏宝图在哪个npc处购买":"b",
        "宝玉鞋击杀哪个npc可以获得":"a",
        "银手镯可以在哪位npc那里获得？":"b",
        "莲花掌是哪个门派的技能":"a",
        "九区服务器名称":"d",
        "以下哪个不是在洛阳场景":"d",
        "红宝石加什么属性":"b",
        "摹刻10级的装备需要摩刻技巧多少级":"b",
        "军营是第几个组队副本":"b",
        "朱姑娘是哪个门派的师傅":"a",
        "金项链可以在哪位npc那里获得？":"d",
        "魏无极在第几章":"a",
        "清风寨在哪":"b",
        "以下哪个不是在洛阳场景":"d",
        "风泉之剑可以在哪位npc那里获得？":"b",
        "魔鞭诀在哪里学习":"d",
        "副本一次最多可以进几人":"a",
        "城里抓贼是挂机里的第几个任务":"b",
        "扬州在下面哪个地点的npc处可以获得玉佩":"c",
        "白金戒指可以在哪位npc那里获得？":"b",
        "长虹剑在哪位npc那里获得？":"a",
        "跨服天剑谷是星期几举行的":"b",
        "白金手镯可以在哪位npc那里获得？":"a",
        "白金项链可以在哪位npc那里获得？":"b"
    }
    function answerQuestionsFunc(e){
        clickButton('home');
        window.Dom = $(e.target);
        if(Dom.html() == "答题"){
            console.log("准备自动答题！");
            answerQuestions();
            answerQuestionsInterval = setInterval(answerQuestions, 2000);
            Dom.html("停答题");
        }else{
            console.log("停止自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
        }
    }
    function answerQuestions(){
        if($('span:contains(每日武林知识问答次数已经)').text().slice(-46) == "每日武林知识问答次数已经达到限额，请明天再来。每日武林知识问答次数已经达到限额，请明天再来。") {
            // 今天答题结束了
            console.log("完成自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
            return;
        }
        clickButton('question');
        setTimeout(getAndAnsQuestion, 300); // 300 ms之后提取问题，查询答案，并回答
    }
    function getAndAnsQuestion(){
        // 提取问题
        var firstSplitArr = $(".out").text().split("题");
        if(firstSplitArr.length < 2){
            return;
        }
        var theQuestion = firstSplitArr[1].split("A")[0];
        // 左右去掉空格
        // theQuestion = theQuestion.trim(" ","left").trim(" ","right");
        theQuestion=theQuestion.replace( /^\theQuestion*/, "");
        theQuestion=theQuestion.replace( /\theQuestion*$/, "");
        theQuestion = $.trim(theQuestion);
        // theQuestion=theQuestion.slice(1);
        // 查找某个问题，如果问题有包含关系，则
        var theAnswer = getAnswer2Question(theQuestion);
        if (theAnswer !== "failed"){
            eval("clickButton('question " + theAnswer + "')");
        }else{
            // alert("没有找到答案，请手动完成该题目！");
            console.log("停止自动答题！");
            Dom.html("答题");
            clearInterval(answerQuestionsInterval);
            return;
        }
        console.log($('span:contains(知识问答第)').text().split("继续答题")[0]);
        setTimeout(function(){
            printAnswerInfo(theAnswer);
        },300)
    }
    function printAnswerInfo(theAnswer){
        console.log("完成一道武林知识问答：" + "答案是：" + theAnswer );
        console.log($('span:contains(知识问答第)').text().split("继续答题")[0]);
    }
    function getAnswer2Question(localQuestion){
        // 如果找到答案，返回响应答案，a,b,c或者d
        // 如果没有找到答案，返回 "failed"
        if(localQuestion.indexOf('铁手镯') >=0){
            return 'a';
        }
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
    /* 答题  :end */
    // 一键恢复
    function recoverOnByClick(){
        recoverIntervalFn();
    }
    // 定时恢复
    var recoverInterval = null;
    function recoverOnTimes(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if(DomTxt == '定时恢复'){
            recoverInterval = setInterval(recoverIntervalFn, 2*60*1000);
            console.log(getTimes() +'开始定时恢复');
            Dom.html('取消恢复');
        }else{
            clearInterval(recoverInterval);
            console.log(getTimes() +'结束定时恢复');
            Dom.html('定时恢复')
        }
    }

    function recoverIntervalFn(){
        if($("#skill_1")[0]==undefined){
            healFunc();
        }
    }

    function healFunc(){
        var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
        var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
        var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
        var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));
        console.log("血量是: "+kee+"/"+max_kee);
        console.log("内力是: "+force+"/"+max_force);
        if (kee<max_kee){
            if (force>0)
                clickButton('recovery',0);
            else
                clickButton('items use snow_qiannianlingzhi');
                setTimeout(function(){healFunc()},200);
        }else{
            if (force<max_force){
                clickButton('items use snow_qiannianlingzhi');
                setTimeout(function(){healFunc()},200);
            }
        }
    }


    var isAutoOn = false;
    function doOnAuto(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if(DomTxt == '定时任务'){
            isAutoOn = true;
            Dom.html('取消定时')
        }else{
            isAutoOn = false;
            Dom.html('定时任务')
        }
    }

    // 吃药 ------------------------------------------------------------------------------------------------------
    function userMedecineFunc(){
        clickButton('items use snow_qiannianlingzhi');
    }

    // 随机跑
    var randomRunJianIntervalFunc = null;
    function randomRunButtonFunc(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();

        if(DomTxt == '随机跑'){
            isAutoOn = true;
            randomRunJianIntervalFunc = setInterval(function(){RandomRunOnce()}, 1000);
            Dom.html('停跑步');
        }else{
            isAutoOn = false;
            Dom.html('随机跑');
            clearInterval(randomRunJianIntervalFunc);
        }
    }
    async function RandomRunOnce(){
        console.log('随机跑一次！');
        var randDirect = {1:'west', 2:'east', 3:'north', 4:'south', 5:'northwest', 6:'northeast', 7:'southwest', 8:'southeast'};
        var direct = Math.floor(Math.random()*8+1);
        var dicListHere = $("button[class*=cmd_click_exits]");
        var findBetterWay = false;
        var cmd = "";
        for(var i = 0; i < dicListHere.length; i ++){
            if(!isContains(dicListHere[i].innerText,"峡谷")){
                findBetterWay = true;
                cmd = dicListHere[i].getAttribute('onclick');
                break;
            }
        }
        if(findBetterWay){
            eval(cmd);
            return;
        }else{
                var cmd = clickButton('go ' + randDirect[direct] );
                eval(cmd);
            return;
        }


    }

    /**/
    async function findQLHPath(targetLocation){
        switch(targetLocation)
        {
            case '打铁铺子':
                // 打铁铺子：饮风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 打铁铺子 
                await clickButtonAsync('jh 1');       // 进入章节
                await clickButtonAsync('go east');     // 广场
                await clickButtonAsync('go north');   // 雪亭镇街道
                await clickButtonAsync('go north');    // 雪亭镇街道
                await clickButtonAsync('go west');      // 打铁铺子
                break;
            case '桑邻药铺':
                // 桑林药铺：迎风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 雪亭镇街道 --> 桑林药铺
                await clickButtonAsync('jh 1');        // 进入章节
                await clickButtonAsync('go east');      // 广场
                await clickButtonAsync('go north');     // 雪亭镇街道
                await clickButtonAsync('go north') ;    // 雪亭镇街道
                await clickButtonAsync('go north');     // 雪亭镇街道
                await clickButtonAsync('go west') ;    // 桑林药铺
                break;
            case '书房':
                // 书房：迎风客栈 --> 广场 -->  雪亭镇街道 --> 淳风武馆大门 --> 淳风武馆教练场 --> 淳风武馆大厅 -->  天井 --> 书房
                await clickButtonAsync('jh 1');        // 进入章节
                await clickButtonAsync('go east') ;     // 广场
                await clickButtonAsync('go north');     // 雪亭镇街道
                await clickButtonAsync('go east');     // 淳风武馆大门
                await clickButtonAsync('go east') ;    // 淳风武馆教练场
                await clickButtonAsync('go east');     // 淳风武馆大厅
                await clickButtonAsync('go east') ;    // 天井
                await clickButtonAsync('go north');    // 书房
                break;
            case '南市':
                // 南市：  龙门石窟 --> 南郊小路 -->  南门 --> 南市 # 客商#  或者 # 坏人#
                await clickButtonAsync('jh 2');        // 进入章节
                await clickButtonAsync('go north') ;     // 南郊小路
                await clickButtonAsync('go north');     // 南门
                await clickButtonAsync('go east');     // 南市
                break;
            case '北大街':
                // 北大街： 龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 中心鼓楼 --> 中州街 --> 北大街 
                await clickButtonAsync('jh 2');        // 进入章节
                await clickButtonAsync('go north');      // 南郊小路
                await clickButtonAsync('go north');     // 南门
                await clickButtonAsync('go north');     // 南大街
                await clickButtonAsync('go north');     // 洛川街
                await clickButtonAsync('go north');     // 中心鼓楼
                await clickButtonAsync('go north');     // 中州街
                await clickButtonAsync('go north');     // 北大街
                break;
            case '钱庄':
                // 钱庄：  龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 中心鼓楼 --> 中州街 --> 北大街--> 钱庄 
                await clickButtonAsync('jh 2');        // 进入章节
                await clickButtonAsync('go north');      // 南郊小路
                await clickButtonAsync('go north');     // 南门
                await clickButtonAsync('go north');     // 南大街
                await clickButtonAsync('go north');     // 洛川街
                await clickButtonAsync('go north');     // 中心鼓楼
                await clickButtonAsync('go north');     // 中州街
                await clickButtonAsync('go north');     // 北大街
                await clickButtonAsync('go east');     // 钱庄
                break;
            case '绣楼':
                // 绣楼：  龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 铜锣巷 --> 桃花别院 --> 绣楼 
                await clickButtonAsync('jh 2');        // 进入章节
                await clickButtonAsync('go north');      // 南郊小路
                await clickButtonAsync('go north');     // 南门
                await clickButtonAsync('go north');     // 南大街
                await clickButtonAsync('go north');     // 洛川街
                await clickButtonAsync('go west') ;    // 铜锣巷
                await clickButtonAsync('go south');     // 桃花别院
                await clickButtonAsync('go west');     // 绣楼
                break;
            case '祠堂大门':
                // 祠堂大厅：华山村村口 --> 青石街 -->  银杏广场 --> 祠堂大门
                await clickButtonAsync('jh 3');        // 进入章节
                await clickButtonAsync('go south');      // 青石街
                await clickButtonAsync('go south');     // 银杏广场
                await clickButtonAsync('go west') ;    // 祠堂大门
                break;
            case '厅堂':
                // 厅堂：华山村村口 --> 青石街 -->  银杏广场 --> 祠堂大门 -->  厅堂
                await clickButtonAsync('jh 3');        // 进入章节
                await clickButtonAsync('go south');      // 青石街
                await clickButtonAsync('go south');     // 银杏广场
                await clickButtonAsync('go west');     // 祠堂大门
                await clickButtonAsync('go north');     // 厅堂
                break;
            case '杂货铺':
                // 杂货铺：华山村村口 --> 青石街 -->  银杏广场 --> 杂货铺 
                await clickButtonAsync('jh 3');        // 进入章节
                await clickButtonAsync('go south');      // 青石街
                await clickButtonAsync('go south');     // 银杏广场
                await clickButtonAsync('go east');     // 杂货铺
                break;
            case '进跨服':
                // 桑林药铺：迎风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 雪亭镇街道 --> 驿站
                await clickButtonAsync('jh 1');        // 进入章节
                await clickButtonAsync('go east');      // 广场
                await clickButtonAsync('go north');     // 雪亭镇街道
                await clickButtonAsync('go north') ;    // 雪亭镇街道
                await clickButtonAsync('go north');     // 雪亭镇街道
                await clickButtonAsync('go north');     // 雪亭镇街道
                await clickButtonAsync('go west') ;     // 驿站
                await clickButtonAsync('event_1_36344468')
                break;    
            case '云远寺':
                // 杂货铺：华山村村口 --> 青石街 -->  银杏广场 --> 杂货铺 
                await clickButtonAsync('jh 2');        // 进入章节
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');  
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north');
                await clickButtonAsync('go north'); 
                await clickButtonAsync('go west');  
                await clickButtonAsync('go south');
                await clickButtonAsync('go south');
                await clickButtonAsync('go south');
                await clickButtonAsync('go south'); 
                await clickButtonAsync('go east');
                break;    
            default:
                // 如果没找到，发出警告
                console.log('## 找不到该目的地：' + targetLocation + '！');
        }
    }

    var QLHLocList = ['主页','状态','背包','技能','打铁铺子','桑邻药铺','书房','南市','北大街','钱庄','绣楼','祠堂大门','厅堂','杂货铺','进跨服','云远寺'];
    var QLHchapMapButton = [];
    function makeOtherBtns(){
        currentPos = 90;
        delta = 30;
        for(var i = 0; i < QLHLocList.length; i++){
            dis_right = "90";
            QLHchapMapButton[i] = document.createElement('button');
            QLHchapMapButton[i].innerText = QLHLocList[i];
            QLHchapMapButton[i].style.position = 'absolute';
            QLHchapMapButton[i].style.right = dis_right + 'px';
            QLHchapMapButton[i].style.top = currentPos + 'px';
            currentPos = currentPos + delta;
            QLHchapMapButton[i].style.width = Base.buttonWidth;
            QLHchapMapButton[i].style.height = Base.buttonHeight;
            QLHchapMapButton[i].className = 'btn-add';
            document.body.appendChild(QLHchapMapButton[i]);
            if(QLHLocList[i] == "技能"){
                currentPos = currentPos + 30;
            }
            (function(i){QLHchapMapButton[i].onclick = function () {
                if (QLHLocList[i] == "主页"){
                    clickButton('quit_chat');
                    clickButton('home');
                }else if(QLHLocList[i] == "状态"){
                    clickButton('quit_chat');
                    clickButton('score');
                }else if(QLHLocList[i] == "背包"){
                    clickButton('quit_chat');1
                    clickButton('items');
                }else if(QLHLocList[i] == "技能"){
                    clickButton('quit_chat');
                    clickButton('skills');
                }else{
                    findQLHPath(QLHLocList[i]);
                }
            }
                        })(i);
        }
    }
 var startAutoOnTimeButton = null;
var getRewardsButton = null;
var digTreasureButton = null;
var userMedecineButton = null;
var useSkillsButton = null;
var randomRunButton = null;
var findSpecTargetButton = null;
    function makeMoreBtns(){

        startAutoOnTimeButton = document.createElement('button');
        startAutoOnTimeButton.innerText = '定时任务';
        startAutoOnTimeButton.style.position = 'absolute';
        startAutoOnTimeButton.style.right = '0px';
        startAutoOnTimeButton.style.top = '30px';
        currentPos = Base.currentPos + Base.delta;
        startAutoOnTimeButton.style.width = Base.buttonWidth;
        startAutoOnTimeButton.style.height = Base.buttonHeight;
        startAutoOnTimeButton.className = 'btn-add';
        startAutoOnTimeButton.id = 'btnOnTime';
        document.body.appendChild(startAutoOnTimeButton);
        startAutoOnTimeButton.addEventListener('click', doOnAuto);

        userMedecineButton = document.createElement('button');
        userMedecineButton.innerText = '吃补药';
        userMedecineButton.style.position = 'absolute';
        userMedecineButton.style.right = '90px';
        userMedecineButton.style.top = '60px';
        currentPos = Base.delta;
        userMedecineButton.style.width = Base.buttonWidth;
        userMedecineButton.style.height = Base.buttonHeight;
        userMedecineButton.id = 'btnS';
        userMedecineButton.className = 'btn-add';
        document.body.appendChild(userMedecineButton);
        userMedecineButton.addEventListener('click', userMedecineFunc);
    }

    // 苗疆炼药
    function MjlyFunc(){
        var msg = "毒藤胶和毒琥珀准备好了吗？\n苗疆地图开了吗？\n没有就点取消！";
        if (confirm(msg)===true){
            console.log("去苗疆。");
            setTimeout(Mjly1Func,200);
        }else{
            return false;
        }
    }
    function Mjly1Func(){
        go('jh 40;s;s;s;s;e;s;se;sw;s;sw;e;e;sw;se;sw;se;');
        console.log("铁索桥。");
        go('event_1_8004914;');
        setTimeout( Mjly2Func,10000);
     }
     function  Mjly2Func(){
        var place = $('#out .outtitle').text();
        if (place !== "澜沧江南岸"){
            console.log("重新跑。");
            setTimeout(Mjly1Func,2000);
        }else{
            console.log("继续走。");
            go('se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;');
            setTimeout( Mjly3Func,5000);
        }
    }
    function  Mjly3Func(){
        if( isContains($('span.out2:contains(炼药的丹炉)').text().slice(-6), '明天再来吧！')){
            console.log("炼完了。");
            go('home');
        }else{
            go('lianyao;');
            setTimeout( Mjly3Func,6000);
        }
    }
    
    // 天山玄冰
    function TianShanFunc(){
        var msg = "御寒衣和掌门手谕准备好了吗？\n天山地图开了吗？\n没有就点取消！";
        if (confirm(msg)===true){
            console.log("去天山。");
            setTimeout(TianShan1Func,200);
        }else{
            return false;
        }
    }
    function TianShan1Func(){
        go('jh 39;ne;e;n;ne;ne;n;ne;nw;');
        console.log("攀山绳。");
        go('event_1_58460791;');
        setTimeout( TianShan2Func,6000);
     }
     function  TianShan2Func(){
        var place = $('#out .outtitle').text();
        if (place !== "失足岩"){
            console.log("重新跑。");
            setTimeout(TianShan1Func,100);
        }else{
            console.log("继续走。");
            go('nw;n;ne;nw;nw;w;n;n;n;e;e;s;');
            go('give tianshan_hgdz');
            setTimeout(TianShan3Func,3000);
        }
    }
    function TianShan3Func(){
        go('ask tianshan_hgdz');
        go('ask tianshan_hgdz');
        setTimeout( TianShan4Func,3000);
    }
    function TianShan4Func(){
        go('s');
        go('event_1_34855843');
        setTimeout( TianShan5Func,3000);
    }
    
    function  TianShan5Func(){
        if( isContains($('span.out2:contains(此打坐许久)').text().slice(-8), '离开了千年玄冰。')){
            console.log("天山玄冰完了。");
            go('home');
        }else{
            setTimeout( TianShan5Func,3000);
        }
    }

    // 大昭寺壁画
    function MianBiFunc(){
        console.log(getTimes() +'大昭壁画');
        go('jh 26;w;w;n;w;w;w;n;n;e;event_1_12853448'); //大昭壁画
    }
    
    function ZhuangBei(e){
        var Dom = $(e.target);
        var DomTxt = Dom.html();
        if(DomTxt == '战斗装备'){ 
            console.log("切换战斗装备！");
            go('wield weapon_sb_sword10');      // 九天龙吟剑
            go('wear equip_moke_finger10');     // 斩龙戒指
            go('wear equip_moke_head10');       // 斩龙帽子
            go('wield weapon_sb_sword11');      // 11套剑
            go('wear equip_moke_finger11');     // 11套戒指
            go('wear equip_moke_head11');       // 11套帽子
            Dom.html('打坐装备');
        }else{
            console.log("切换打坐装备！");
            go('unwield weapon_sb_sword10');        // 脱九天龙吟剑
            go('unwield weapon_sb_sword11');        // 脱轩辕剑
            go('wear dream hat');                   // 迷幻经纶
            go('wear langya_diaozhui');             // 狼牙吊坠
            go('wield sword of windspring');        // 风泉
            go('wear longyuan banzhi moke');        // 龙渊
            Dom.html('战斗装备');
        }
    }

    //存储
    async function putStore(){
        console.log(getTimes() +'存仓库');
        await clickButtonAsync('items put_store leftweapon book');
        await clickButtonAsync('items put_store baiyin box');
        await clickButtonAsync('items put_store meigui hua');
        await clickButtonAsync('items put_store zishuijing1')
        await clickButtonAsync('items put_store zishuijing2');
        await clickButtonAsync('items put_store zishuijing3');
        await clickButtonAsync('items put_store lanbaoshi1');
        await clickButtonAsync('items put_store lanbaoshi2');
        await clickButtonAsync('items put_store lanbaoshi3');
        await clickButtonAsync('items put_store hongbaoshi1');
        await clickButtonAsync('items put_store hongbaoshi2');
        await clickButtonAsync('items put_store hongbaoshi3');
        await clickButtonAsync('items put_store lvbaoshi1');
        await clickButtonAsync('items put_store lvbaoshi2');
        await clickButtonAsync('items put_store lvbaoshi3');
        await clickButtonAsync('items put_store huangbaoshi1');
        await clickButtonAsync('items put_store huangbaoshi2');
        await clickButtonAsync('items put_store huangbaoshi3');
        await clickButtonAsync('items put_store huangjinbox key');
        await clickButtonAsync('items put_store obj_baibaoling');
        await clickButtonAsync('items put_store obj_wumu-yishu');
        await clickButtonAsync('items put_store obj_kongshi_juanxiu');
        await clickButtonAsync('items put_store obj_xuanzhongtie');
        await clickButtonAsync('items put_store obj_shenmi_box');
        await clickButtonAsync('items put_store kuangbao dan');
        await clickButtonAsync('items put_store gaoji kuangbao dan');
        await clickButtonAsync('items put_store dahuan dan');
        await clickButtonAsync('items put_store gaoji dahuan dan');
        await clickButtonAsync('items put_store qiankun dan');
        await clickButtonAsync('items put_store gaoji qiankun dan');
        await clickButtonAsync('items put_store changan_lianpeng');
        await clickButtonAsync('items put_store dali_changshengshibaoxiang');
        await clickButtonAsync('items put_store xiaohuan dan');

        await clickButtonAsync('items use obj_bingzhen_suanmeitang');
        await clickButtonAsync('items use obj_baicaomeijiu');           // 百草美酒
    }
    // 逃跑吃药
    async function escapeAndEat(){
        await clickButtonAsync('escape');
        await clickButtonAsync('items use snow_qiannianlingzhi');
    }

    // 面板触发
    // window.game = this;

    window.attach = function() {
        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;

        gSocketMsg.dispatchMessage = function(b) {
            this.old(b);
            if (genZhaoMode == 1){
                zhanDouView.dispatchMessage(b);
            }
        }
    };

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

    attach();
    
    // 定时任务
    var hasDoOnece = false;
    var hasSendMsg = false;
    // 到时做XXX
    function doOnTime(){
        var hours = getHours();
        var week = getWeek();
        
        // 1、6、15 点
        if(hours == 1 || hours == 8 || hours == 15 ){
            hasDoOnece = false;
        }

        // 1点 签到
        if(hours == 1){
            $('span:contains(你今天试剑次数已达限额)').html('');
            mijingNum = 0;
            CheckIn();
        }

        // 2点双儿
        if(hours == 2){
            clickShuangEr();
        }

        // 5、6点 签到
        if(hours == 5 || hours == 6){
            CheckIn();
        }

        // 8点试剑
        if(hours == 8){
            if($('#btno3').html() == "试剑"){
                $('#btno3').trigger('click');
            }
        }
        // 9点刷碎片
        if(hours == 9){
           doOnce(2);
        }
        // 10点做奇侠
        if(hours == 10){
            GiveMoneyOnTime();
        }

        // 15点领取VIP
        if(hours == 15){
            CheckInFunc();
        }

        // 16点 答题
        if(hours == 16){
            doOnce(4);
        }

        // 17点与奇侠聊天
        if(hours == 17){
            talkSelectQiXia();
        }
        // 18点领奖励
        if(hours == 18){
            doReplay();
        }

        //  20点回帮派
        if(hours == 20){
            clickButton('clan scene');
        }
        //  周三21点领取论剑奖励
        if(hours == 21){
            if(getWeek() == '3'){
                go('swords get_drop go');   // 领取论剑奖励
            }
        }

    }

    // 每天执行一次
    function doOnce(type){

        if(!hasDoOnece){
            hasDoOnece = true;
            if(type == '2'){
                killDrunkManFunc();     // 刷碎片
            }
            if(type == '3'){
                newGetXiaKe();          // 侠客岛
            }
            if(type == '4'){
                $('#btno4').trigger('click')    // 答题
            }
        }

        if(type == '5'){ 
            doReplay();
        }

    }
    // 获取当前时间
    function getHours() {
        var date = new Date();
        var currentdate =  date.getHours();
        return currentdate;
    }
    // 获取当前时间
    function getTimes() {
        var date = new Date();
        return date.toLocaleString();
    }
    function getWeek(){
        var week = new Date().getDay();
        return week;
    }
    function doReplay(){
        $('span:contains(你今天试剑次数已达限额)').html('')
        CheckIn();
    }
    function doVipReplay(){
        $('span:contains(你今天试剑次数已达限额)').html('')
        CheckInFunc();
    }
    async function dazuoAndSleep(){
        await clickButtonAsync('home');
        await clickButtonAsync('exercise');
        await clickButtonAsync('sleep_hanyuchuang');
    }

    function GiveMoneyOnTime(){
        var btn = $('#btno18');
        btn.trigger('click');
    }

    // 点击去哪个方向
    function goPlaceBtnClick(placeName){
        var btn = $('#out button');

        btn.each(function(){
            var btnName = $(this).text();
            if(btnName == placeName){
                $(this).trigger('click');
            }
        })
    }
    //
    var killerSetInterval = null;
    function killGoodNpc(e){
        var player = ['守楼虎将','王铁匠','杨掌柜','柳绘心','客商','卖花姑娘','刘守财','柳小花','朱老伯', '方寡妇','方老板'];

        var Dom = $(e.target);
        var DomTxt = Dom.html();

        clearInterval(killerSetInterval);

        if(DomTxt == '杀好人'){
            killerSetInterval = setInterval(function(){
                killSet(player);
            },400)
            console.log(getTimes() +'开始杀好人');
            Dom.html('取消杀好人');
        }else{
            clearInterval(killerSetInterval);
            Dom.html('杀好人')
            console.log(getTimes() +'停止杀好人');
        }
    }
    //
    function killBadNpc(e){
        var player = ['攻楼死士','段老大','二娘','岳老三','云老四','剧盗','恶棍','流寇'];

        var Dom = $(e.target);
        var DomTxt = Dom.html();
        clearInterval(killerSetInterval);

        if(DomTxt == '杀坏人'){
            killerSetInterval = setInterval(function(){
                killSet(player);
            },400)
            console.log(getTimes() +'开始杀坏人');
            Dom.html('取消杀坏人');
        }else{
            clearInterval(killerSetInterval);
            Dom.html('杀坏人')
            console.log(getTimes() +'停止杀坏人');
        }
    }
    // 杀指定目标
    function killSet(player){
        var btn = $('.cmd_click3');
        var idArr = [];
        for(var i = 0; i<player.length; i++){
            var Qname = player[i];
            for(var j = 0;  j <btn.length ; j++){
                var txt = btn.eq(j).text();
                if(txt == Qname){
                    var npcText = btn.eq(j).attr('onclick');
                    var id = getId(npcText);
                    idArr.push(id);
                    break;
                }
            }
        }
        var maxId = idArr[0];
        if(maxId){
            killE(maxId);
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
                if(arr[i].indexOf('-') > 0){
                    continue;
                }
                qxInfo = {};
                arr[i] = arr[i].replace('朱果', '');
                arr2 = arr[i].match(/<td[^>]*>([^\d\(]*)\(?(\d*)\)?<\/td><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><td[^>]*>.*?<\/td>/);
                qxInfo["name"] = arr2[1].replace('(', '').replace(')', '');
                qxInfo["degree"] = arr2[2] == "" ? 0 : arr2[2];
                if (arr2[3].match("未出世")!=null||arr2[4].match("师门")!=null){
                    qxInfo["isOk"]=false;
                }else{
                    qxInfo["isOk"]=true;
                }
                qxInfo["index"]=i;
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

    function zhengli(itemName, itemid, action, limit) {
        var m = $('#out table:eq(2) tr span:contains('+itemName+')');
        if (m != null) {
            m = m.parent().parent().find('span').filter(function () {
                return new RegExp("[0-9]+").test($(this).text());
            });
            var num = m.text().match(/(\d+)/);
            if (num == null)
                return;
            //   var exec = "clickButton('items "+action+" "+itemid+"')";
            var exec = "items "+action+" "+itemid;
    
            // console.log(exec);
            num = parseInt(num[0]);
            if (action == "put_store")
                num = 1;
            if (limit != null)
                num = limit;
            var largerNum = parseInt(num/10);  
            if(largerNum >0 && itemName != '玫瑰花' && itemName != '突破丹礼包'){
                var smallNum = parseInt(num%10);
                var newExec = exec + '_N_10';
                for (var i = 0; i < largerNum; ++i) {
                    //      eval(exec);
                    go(newExec);
                }
                for (var i = 0; i < smallNum; ++i) {
                    //      eval(exec);
                    go(exec);
                }
            }else{
                for (var i = 0; i < num; ++i) {
                    //      eval(exec);
                    go(exec);
                }
            }   
        }
    }
    
    function baoguoZhengli1Func() {
        timeCmd=0;
        //宝石
        zhengli("碎裂的红宝石", "hongbaoshi1", "put_store");
        zhengli("裂开的红宝石", "hongbaoshi2", "put_store");
        zhengli("碎裂的绿宝石", "lvbaoshi1", "put_store");
        zhengli("裂开的绿宝石", "lvbaoshi2", "put_store");
        zhengli("碎裂的黄宝石", "huangbaoshi1", "put_store");
        zhengli("裂开的黄宝石", "huangbaoshi2", "put_store");
        zhengli("碎裂的紫宝石", "zishuijing1", "put_store");
        zhengli("裂开的紫宝石", "zishuijing2", "put_store");
        zhengli("碎裂的蓝宝石", "lanbaoshi1", "put_store");
        zhengli("裂开的蓝宝石", "lanbaoshi2", "put_store");

        zhengli("龙庭魄", "obj_longtingpo1", "put_store");
        zhengli("昆仑印", "obj_kunlunyin1", "put_store");
        zhengli("帝玺碎", "obj_dixisui1", "put_store");
        zhengli("东海碧", "obj_donghaibi1", "put_store");
        zhengli("钜子墨", "obj_juzimo1", "put_store");
        zhengli("轩辕烈", "obj_xuanyuanlie1", "put_store");
        zhengli("九天落", "obj_jiutianluo1", "put_store");

        zhengli("武穆遗书",    "obj_wumu-yishu", "put_store");
        zhengli("百宝令",    "obj_baibaoling", "put_store");
        zhengli("白银宝箱",    "baiyin box", "put_store");
        zhengli("玄铁令", "obj_xuantieling", "put_store");
        zhengli("玄重铁", "obj_xuanzhongtie", "put_store");
        zhengli("黄金宝箱", "huangjin box", "put_store");
        zhengli("铂金宝箱", "obj_box3", "put_store");
        zhengli("黄金钥匙", "huangjinbox key", "put_store");
        zhengli("左手兵刃研习", "leftweapon book", "put_store");
        zhengli("驻颜丹", "zhuyan dan", "put_store");
        zhengli("空识卷轴","obj_kongshi_juanxiu", "put_store");
        zhengli("帮派令","obj_bangpailing", "put_store");
    
        // sell
        zhengli("钢剑","gangjian1", "sell");
        zhengli("钢剑","weapon_sword2", "sell");
        zhengli("长剑","changjian_cj", "sell");
        zhengli("长剑","long sword", "sell");
        zhengli("单刀","weapon_blade1", "sell");
        zhengli("鬼头刀","weapon_blade2", "sell");
        zhengli("单刀","blade", "sell");
        zhengli("割鹿刀","weapon_blade4", "sell");
        zhengli("铁戒","equip_finger1", "sell");
        zhengli("破披风","equip_surcoat1", "sell");
        zhengli("布衣","cloth", "sell");
        zhengli("布衣","equip_cloth1", "sell");
        zhengli("长斗篷","equip_surcoat2", "sell");
        zhengli("军袍","equip_surcoat3", "sell");
        zhengli("丝质披风","equip_surcoat4", "sell");
        zhengli("木盾","equip_shield1", "sell");
        zhengli("牛皮带","equip_waist3", "sell");
        zhengli("铁盾","equip_shield2", "sell");
        zhengli("藤甲盾","equip_shield3", "sell");
        zhengli("青铜盾","equip_shield4", "sell");
        zhengli("麻带","equip_waist1", "sell");
        zhengli("鞶革","equip_waist2", "sell");
        zhengli("锦缎腰带","equip_waist4", "sell");
        zhengli("树枝","binghuo_shuzhi", "sell");
        zhengli("鲤鱼","binghuo_liyu", "sell");
        zhengli("鲫鱼","binghuo_jiyu", "sell");
        zhengli("破烂衣服","binghuo_polanyifu", "sell");
        zhengli("水草","binghuo_shuicao", "sell");
        zhengli("莲蓬","changan_lianpeng", "sell");
        zhengli("剑术基础","sword jichu", "sell");
        zhengli("搏斗基础","bodou jichu", "sell");
        zhengli("刀法基础","blade jichu", "sell");
        zhengli("拆招基础","chaizhao jichu", "sell");
        zhengli("丝绸衣","equip_cloth2", "sell");
        zhengli("钢丝甲衣","equip_cloth3", "sell");
        zhengli("铁手镯","equip_wrists1", "sell");
        zhengli("银手镯","equip_wrists2", "sell");
        zhengli("鹿皮手套","weapon_unarmed2", "sell");
        zhengli("长虹剑","weapon_sword3", "sell");
        zhengli("粉红绸衫","pink cloth", "sell");
        zhengli("绣花小鞋","shoes", "sell");
        zhengli("铁项链","equip_neck1", "sell");
        zhengli("银项链","equip_neck2", "sell");
        zhengli("铁戒","equip_finger1", "sell");
        zhengli("银戒","equip_finger2", "sell");
        zhengli("布鞋","equip_boots1", "sell");
        zhengli("黑狗血","obj_heigouxue", "sell");
        zhengli("桃符纸","obj_paper_seal", "sell");
        zhengli("旧书","obj_old_book", "sell");
        zhengli("牛皮酒袋","wineskin", "sell");
        zhengli("银丝甲","equip_armor4", "sell");
        zhengli("匕首","weapon_dagger1", "sell");
        zhengli("羊角匕","weapon_dagger2", "sell");
        zhengli("梅花匕","weapon_dagger3", "sell");
        zhengli("逆钩匕","weapon_dagger4", "sell");
        zhengli("拜月掌套","weapon_unarmed6", "sell");
        zhengli("金弹子","weapon_throwing6", "sell");
        zhengli("铁甲","equip_armor1", "sell");
        zhengli("精铁甲","equip_armor2", "sell");
        zhengli("重甲","equip_armor3", "sell");
        zhengli("软甲衣","equip_cloth6", "sell");
        zhengli("斩空刀","weapon_blade6", "sell");
        zhengli("新月棍","weapon_stick6", "sell");
        zhengli("天寒手镯","equip_wrists6", "sell");
        zhengli("天寒项链","equip_neck6", "sell");
        zhengli("天寒戒","equip_finger6", "sell");
        zhengli("天寒帽","equip_head6", "sell");
        zhengli("天寒鞋","equip_boots6", "sell");
        
        zhengli("羊毛斗篷","equip_surcoat5", "splite");
        zhengli("夜行披风","equip_surcoat6", "splite");
        zhengli("破军盾","equip_shield5", "splite");
        zhengli("玄武盾","equip_shield6", "splite");
        zhengli("金丝甲","equip_armor5", "splite");
        zhengli("金丝宝甲衣","equip_cloth7", "splite");
        zhengli("红光匕","weapon_dagger5", "splite");
        zhengli("天寒匕","weapon_dagger6", "splite");
        zhengli("虎皮腰带","equip_waist5", "splite");
        zhengli("沧海护腰","equip_waist6", "splite");
        zhengli("残雪戒","equip_finger7", "splite");
        zhengli("残雪手镯","equip_wrists7", "splite");
        zhengli("残雪帽","equip_head7", "splite");
        zhengli("残雪项链","equip_neck7", "splite");
        zhengli("残雪鞋","equip_boots7", "splite");
    
        zhengli("神秘宝箱","obj_shenmi_box", "use");
        zhengli("长生石宝箱","dali_changshengshibaoxiang", "use");
        zhengli("灵草","qiannian lingcao", "use");
        zhengli("百年灵草","bainian qiannian lingcao", "use");
        zhengli("紫芝","qiannian zizhi", "use");
        zhengli("百年紫芝","bainian qiannian zizhi", "use");
        zhengli("乾坤再造丹","qiankun dan", "use");
        zhengli("高级乾坤再造丹","gaoji qiankun dan", "use");
        zhengli("高级狂暴丹","gaoji kuangbao dan", "use");
        zhengli("高级大还丹","gaoji dahuan dan", "use");
        zhengli("小还丹","xiaohuan dan", "use");
        zhengli("大还丹","dahuan dan", "use");
        zhengli("狂暴丹","kuangbao dan", "use");
        zhengli("突破丹礼包","tupodan_libao", "use");
        zhengli("冰镇酸梅汤","obj_bingzhen_suanmeitang", "use", 1);
        zhengli("百草美酒","obj_baicaomeijiu", "use", 1);
        zhengli("元宵","obj_yuanxiao", "use", 1);
        zhengli("粥","obj_labazhou", "use", 1);
        zhengli("年糕","obj_niangao", "use", 1);
        zhengli("冰糖葫芦","obj_bingtanghulu", "use", 1);
        zhengli("茉莉汤","obj_molitang", "use", 1);
        zhengli("玫瑰花","meigui hua", "use");
    }
    
    function baoguoZhengliFunc() {
        // timeCmd = 1;
        go("score");
        go("items", 0);
        setTimeout(baoguoZhengli1Func,1000);
    }


    function heBaoshi(){
        // timeCmd = 1;
        go("score");
        go("items", 0);
        setTimeout(heBaoshiFunc,1000);
    }
    function heBaoshiFunc(){
        timeCmd=0;
        baoshi("碎裂的红宝石", "hongbaoshi1");
        baoshi("裂开的红宝石", "hongbaoshi2");
        // baoshi("红宝石",      "hongbaoshi3");
        baoshi("无暇的红宝石", "hongbaoshi4");
        baoshi("完美的红宝石", "hongbaoshi5");
        baoshi("碎裂的绿宝石", "lvbaoshi1");
        baoshi("裂开的绿宝石", "lvbaoshi2");
        // baoshi("绿宝石",      "lvbaoshi3");
        baoshi("无暇的绿宝石", "lvbaoshi4");
        baoshi("完美的绿宝石", "lvbaoshi5");
        baoshi("碎裂的黄宝石", "huangbaoshi1");
        baoshi("裂开的黄宝石", "huangbaoshi2");
        // baoshi("黄宝石",      "huangbaoshi3");
        baoshi("无暇的黄宝石", "huangbaoshi4");
        baoshi("完美的黄宝石", "huangbaoshi5");
        baoshi("碎裂的紫宝石", "zishuijing1");
        baoshi("裂开的紫宝石", "zishuijing2");
        // baoshi("紫宝石",      "zishuijing3");
        baoshi("无暇的紫宝石", "zishuijing4");
        baoshi("完美的紫宝石", "zishuijing5");
        baoshi("碎裂的蓝宝石", "lanbaoshi1");
        baoshi("裂开的蓝宝石", "lanbaoshi2");
        // baoshi("蓝宝石",      "lanbaoshi3");
        baoshi("无暇的蓝宝石", "lanbaoshi4");
        baoshi("完美的蓝宝石", "lanbaoshi5");
    }

    function baoshi(itemName, itemid, action, limit) {
        var m = $('#out table:eq(2) tr span:contains('+itemName+')');
        if (m != null) {
            m = m.parent().parent().find('span').filter(function () {
                return new RegExp("[0-9]+").test($(this).text());
            });
            // console.log(m);
            var num = m.text().match(/(\d+)/);
        
            if (num == null)
                return;

            var exec = "items hecheng"+" "+itemid;
    
            num = parseInt(num[0]);

            if (action == "put_store")
                num = 1;
            if (limit != null)
                num = limit;
            var larger10 = parseInt(num/30);

            if(larger10 >0){
                var smallNum = parseInt(num%30);
                var endNum = parseInt(smallNum/3);

                var newExec = exec + '_N_10';

                for (var i = 0; i < larger10; i++) {
                    go(newExec);
                }

                for (var i = 0; i < endNum; i++) {
                    exec = exec + '_N_1'
                    go(exec);
                }

            }else{
                var endNum = parseInt(num/3);
                for (var i = 0; i < endNum; i ++) {
                    exec = exec + '_N_1'
                    go(exec);
                }
            }   
        }
    }

    function SmallInit(){
        $('#btn8').trigger('click');
        $('#btnOnTime').trigger('click');
    }

    // 跟招
    var genZhaoMode = 0;
    function followPozhaoFn(e){
        var Dom = $(e.target);
        var text = Dom.html();
        if(text == '跟招'){
            Dom.html('停止跟招');
            genZhaoMode = 1;
        }else{
            genZhaoMode = 0;
            Dom.html('跟招');
        }
    }

    function ZhanDouView(){
        this.dispatchMessage=function(b){
            // console.log(b);
            if($('#skill_1').length == 0){
                maxQiReturn = 0;
                return;
            }
            var type = b.get("type"), subType = b.get("subtype");
            if (type=="vs" && subType=="text"){
                var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));

                // 跟招
                if(genZhaoMode == 1){
                    if(msg !==""&&(msg.indexOf("--破军棍诀--")>-1 || msg.indexOf("--千影百伤棍--")>-1)){
                        var qiNumber = gSocketMsg.get_xdz();
                        var qiText = gSocketMsg.get_xdz();
                        if(qiText > 3){
                            doKillSet();
                        }
                    }
                }
            }
        }
    }

    var zhanDouView = new ZhanDouView;

    // 加载完后运行
    $(function(){
        Base.init();
        makeOtherBtns();
        makeMoreBtns();
        GetNewQiXiaList();
        SmallInit();
        var doOntimeInterval = setInterval(function(){
            if(isAutoOn){
                doOnTime();
            }
        },15*60*1000);
    })
})();
