// ==UserScript==
// @name         uumud
// @namespace    http://tampermonkey.net/
// @version      11.9 增加跟随队伍
// @description  游戏辅助脚本
// @author       Yu
// @include      http://*.yytou.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39659/uumud.user.js
// @updateURL https://update.greasyfork.org/scripts/39659/uumud.meta.js
// ==/UserScript==

var isOnline = true;
(function() {

    var isDelayCmd = 1, // 是否延迟命令
    cmdCache = [],      // 命令池
    timeCmd = null,     // 定时器句柄
    cmdDelayTime = 400; // 命令延迟时间
    
    var bixueSwitch = false;
    
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
                    'id' : '4',
                    'name' : '正气中',
                    'function': function(e){
                        hitScore(e);
                    }
                },{
                    'id' : '5',
                    'name' : '搜尸',
                    'function': function(e){
                        setCsearch(e);
                    }
                },{
                    'id' : '6',
                    'name' : '跨服',
                    'function': function(e){
                        interServerFn(e);
                    }
                },{
                    'id' : '7',
                    'name' : '对招',
                    'function': function(e){
                        fightAllFunc(e);
                    }
                },{
                    'id' : '8',
                    'name' : '自动战斗',
                    'function': function(e){
                        autoKill(e);
                    }
                },{
                    'id' : '9',
                    'name' : '杀青龙',
                    'function': function(e){
                        killQinglong(e);
                    }
                },{
                    'id' : '10',
                    'name' : '抢红包',
                    'function': function(e){
                        killQLHB(e);
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
                'id' : 'v17',
                'name' : '买糖葫芦',
                'function': function(e){
                    BuyTang(e)
                }
            },{
                'id' : 'v4',
                'name' : '铁雪除魔',
                'function': function(e){
                    goZhuHou();
                }
            },{
                'id' : 'v5',
                'name' : '大昭壁画',
                'function': function(e){
                    MianBiFunc(e)
                }
            },{
                'id' : 'v6',
                'name' : '完成其他',
                'function': function(e){
                    CheckInFunc1()
                }
            },{
                'id' : 'v7',
                'name' : '冰月',
                'function': function(e){
                    getBingyue()
                }
            },{
                'id' : 'v8',
                'name' : '十二宫',
                'function': function(e){
                    goCorrectJiWuPlace();
                }
            },{
                'id' : 'v9',
                'name' : '跨服装备',
                'function': function(e){
                    changeQinglong1();
                }
            },{
                'id' : 'v10',
                'name' : '打楼',
                'function': function(e){
                    fightLou(e);
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
                'id' : 'v15',
                'name' : '跟招',
                'function': function(e){
                    followPozhaoFn(e);
                }
            },{
                'id' : 'v16',
                'name' : '天剑目标',
                'function': function(e){
                    changeTianJianTarget(e);
                }
            },{
                'id' : 'v17',
                'name' : '队长说话',
                'function': function(e){
                    teamSay(e);
                }
            },{
                'id' : 'v18',
                'name' : '跟队长走',
                'function': function(e){
                    followTeam(e);
                }
            }
        ];
    
        var btnSelfGroup = [
                /*{
                    'id' : 's1',
                    'name' : '破招',
                    'function': function(e){
                        setPozhaoFn(e);
                    }
                },{
                    'id' : 's3',
                    'name' : '出剑',
                    'function': function(e){
                        doOneSkillsJian(e);
                    }
                },{
                    'id' : 's4',
                    'name' : '出掌',
                    'function': function(e){
                        doOneSkillsZhang(e);
                    }
                }*/
        ];
        var btnMoreGroup =  [
                {
                    'id' : 'm1',
                    'name' : '杀正邪',
                    'function': function(e){
                        killErNiangFn(e);
                    }
                },{
                    'id' : 'm2',
                    'name' : '杀逃犯',
                    'function': function(e){
                        killTaoFanFn(e);
                    }
                },{
                    'id' : 'm3',
                    'name' : '清正邪',
                    'function': function(e){
                        clearNpcFn(e);
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
                    'name' : '给奇侠金',
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
                        // putStore(e);
                        baoguoZhengliFunc()
                    }
                },{
                    'id' : 'o6',
                    'name' : '跨服逃犯',
                    'function': function(e){
                        killKuaFuTaoFanFn(e);
                    }
                },{
                    'id' : 'o8',
                    'name' : '青龙装备',
                    'function': function(e){
                        changeQinglong(e);
                    }
                },{
                    'id' : 'o9',
                    'name' : '逃跑吃药',
                    'function': function(e){
                        escapeAndEat(e);
                    }
                },{
                    'id' : 'o10',
                    'name' : '怼人',
                    'function': function(e){
                        fightAllFunc1(e);
                    }
                },{
                    'id' : 'o11',
                    'name' : '切磋',
                    'function': function(e){
                        fightWithPlayer(e);
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
                },
                // {
                //     'id' : 'o14',
                //     'name' : '新春使者',
                //     'function': function(e){
                //         clickXinChun(e);
                //     }
                // },
                {
                    'id' : 'o15',
                    'name' : '卖花姑娘',
                    'function': function(e){
                        clickMaiHua(e);
                    }
                },
                {
                    'id' : 'o16',
                    'name' : '拿玄铁',
                    'function': function(e){
                        getXuanTie()
                    }
                },{
                    'id' : 'o17',
                    'name' : '非装备',
                    'function': function(e){
                        setDisCareQingLong();
                    }
                },{
                    'id' : 'o19',
                    'name' : '战斗装备',
                    'function': function(e){
                        ZhuangBei(e);
                    }
                },
                // {
                //     'id' : 'o20',
                //     'name' : '新聊奇侠',
                //     'function': function(e){
                //         QiXiaTalkFunc();
                //     }
                // },
                {
                    'id' : 'o21',
                    'name' : '地图碎片',
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
                    'id' : 'o23',
                    'name' : '对话奇侠',
                    'function': function(e){
                        talkToQixiaFn(e);
                    }
                },
                // {
                //     'id' : 'o24',
                //     'name' : '监控年兽',
                //     'function': function(e){
                //         watchNianShou(e);
                //     }
                // },
                {
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
                    'name' : '去给15金',
                    'function': function(e){
                        give15Jin(e);
                    }
                }
        ];
    
        window.searchName = null;
        var Base = {
            init: function(){
                this.skills();
                this.btnArrSet();
                this.writeBtn();
            },
            qi: 7,
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
            tianjianTarget: '',
            mySkillLists: '千影百伤棍；九溪断月枪；燎原百破；破军棍诀；排云掌法；如来神掌；九天龙吟剑法；覆雨剑法；雪饮狂刀；翻云刀法；独孤九剑；玄铁剑法；辟邪剑法；天师剑法',
            skills: function(){
                // 38区laodap123
                if(this.getCorrectText('4316804') && this.correctQu() == '38'){
                    this.qi = 5;
                    this.mySkillLists = '覆雨剑法；六脉神剑';
                }
                // 火狼
                if(this.getCorrectText('4238943')){
                    this.qi = 6;
                    this.mySkillLists = '九溪断月枪；如来神掌；覆雨剑法；排云掌法；九天龙吟剑法';
                }
                // 王有财
                if(this.getCorrectText('4219507')){
                    this.mySkillLists = '九溪断月枪；如来神掌；覆雨剑法；排云掌法；九天龙吟剑法';
                }
                // 38区微信
                if(this.getCorrectText('4254240')){
                    this.qi = 6;
                    this.mySkillLists = '如来神掌；覆雨剑法';
                }
                // 37区东方红
                if(this.getCorrectText('4253282')){
    
                    this.mySkillLists = '九溪断月枪；如来神掌；覆雨剑法；排云掌法；九天龙吟剑法';
                }
                // 38区guaji
                if(this.getCorrectText('4259178')){
                    this.qi = 6;
                    this.mySkillLists = '辟邪剑法';
                }
                // 37区guaji
                if(this.getCorrectText('4316804')  && this.correctQu() == '37'){
                    this.qi = 6;
                    this.mySkillLists = '排云掌法；帝王剑法；真武七截剑';
                }
            },
            btnArrSet: function(){
                var btnGroupArr = btnGroup;
    
                for(var i = 0; i <btnOtherGroup.length; i++){
                    btnGroupArr.push(btnOtherGroup[i]);
                }
                //4316804
                if(this.getCorrectText('4316804') || this.getCorrectText('4219507') || this.getCorrectText('5515016') || this.getCorrectText('4581683') || this.getCorrectText('4253282') || this.getCorrectText('4238943') || this.getCorrectText('424025') || this.getCorrectText('3594649') || (this.getCorrectText('4254240') && this.correctQu() == '38')){
                    for(var i = 0; i <btnVipGroup.length; i++){
                        btnGroupArr.push(btnVipGroup[i]);
                    }
                }else{
                    for(var i = 0; i <btnMoreGroup.length; i++){
                        btnGroupArr.push(btnMoreGroup[i]);
                    }
                }
    
                // if(this.getCorrectText('4253282') || (this.getCorrectText('4254240') && this.correctQu() == '38')){
                //     for(var i = 0; i <btnSelfGroup.length; i++){
                //         btnGroupArr.push(btnSelfGroup[i]);
                //     }
                // }
    
                this.btnArr = btnGroupArr;
            },
            btnArr: [],
            writeBtn: function(){
                var btnArr = this.btnArr;
                for(var i = 0; i< btnArr.length; i++){
                    var rightPos = 0;
                    if(i > 18){
                        rightPos = '360';
                    }
                    if(i > 38){
                        rightPos = '450';
                    }
                    if(i == 19){
                        this.currentPos = 30;
                    }
                    if(i == 39){
                        this.currentPos = 30;
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
                    if(i> 18){
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
        var kuafuNpc = '';
        async function interServerFn1(e){
            var skillsText = '九溪断月枪；千影百伤棍；破军棍诀；如来神掌；九天龙吟剑法；覆雨剑法；雪饮狂刀；辟邪剑法；天师剑法';
            var skills = prompt("请输入要使用的技能", skillsText);
            if(skills){
                Base.mySkillLists = skills;
            }else{
                Base.skills();
            }
        }
        /* 更换技能方法 :end */
    
        function changeTianJianTarget(e){
            var targetText = '天剑谷卫士';
    
            var targetsPro = prompt("请更改天剑目标", targetText);
            if(targetsPro){
                Base.tianjianTarget = targetsPro;
            }else{
                Base.tianjianTarget = '';
            }
        }
        function teamSay(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '队长说话'){
                Dom.html('停止说话');
                $(document).on('click', '.cmd_click2', function(){
                    var text = $(this).text();
                    if(text == '比试' || text == '杀死' || text == '渡劫'){
                        var clickText= $(this).attr('onclick');
                        g_gmain.clickButton('team chat '+ clickText);
                    }
                })
                $(document).on('click', "button[class^='cmd_click_exits']", function(){
                    var clickText= $(this).attr('onclick');
                    g_gmain.clickButton('team chat '+ clickText);
                })
            }else{
                Dom.html('队长说话');
                $(document).off('click', '.cmd_click2');
                $(document).off('click', "button[class^='cmd_click_exits']");
            }
        }
        var followTeamSwitch = 0;
        function followTeam(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '跟队长走'){
                Dom.html('不跟走');
                followTeamSwitch = 1;
            }else{
                Dom.html('跟队长走');
                followTeamSwitch = 0;
            }
        }
    
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
            go('clan zsdg enter,n,n,n,n,n');
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
            go('vip finish_fb dulongzhai;vip finish_fb dulongzhai;vip finish_fb junying;vip finish_fb junying;vip finish_fb beidou;vip finish_fb beidou;vip finish_fb youling;vip finish_fb youling,vip finish_fb siyu,vip finish_fb changleweiyang');//副本扫荡
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
            go('jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
        }
    
        function CheckInFunc1(){
            timeCmd=0;
            console.log(getTimes() +'VIP签到-正邪-逃犯-打榜');
            // go('vip buy_task;vip buy_task;vip buy_task;vip buy_task;vip buy_task'); // 购买5次暴击
            go('vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task;vip finish_big_task');//暴击
            go('vip finish_task,vip finish_task,vip finish_task,vip finish_task,vip finish_task');
            go('vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;vip finish_bad 2;');//10次正邪
            go('vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;vip finish_taofan 2;');//5次逃犯
            go('vip finish_sort;vip finish_sort;vip finish_sort;vip finish_sort;vip finish_sort;');//5次打榜
        }
        function goZhuHou(){
            go('jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590;event_1_85535721');// 铁雪诸侯除魔
        }   
        function BuyTang(){
            go('jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w;event_1_712982 go;daily finish 11;daily finish 12'); // 洛阳买冰糖葫芦
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
            await clickButtonAsync('event_1_60133236'); // 暴击卡福利
            // await clickButtonAsync('event_1_16891630'); // 狗年礼券
            await clickButtonAsync('clan buy 302');        // 帮派买金
            await clickButtonAsync('clan buy 302');        // 帮派买金
            await clickButtonAsync('clan buy 302');        // 帮派买金
            await clickButtonAsync('clan buy 302');        // 帮派买金
            await clickButtonAsync('clan buy 302');        // 帮派买金
            if(!Base.getCorrectText('4219507')){
                await clickButtonAsync('clan buy 501');        // 买黄金钥匙
                await clickButtonAsync('clan buy 601');        // 空驶卷轴
                // await clickButtonAsync('clan buy 701');    // 装备碎片
            }
            await clickButtonAsync('clan buy 502');        // 谜题令
            if(isBangPaiStore()){
                await clickButtonAsync('clan buy 702');    // 买药
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
                await clickButtonAsync('clan buy 703');    // 狗劵
            }
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
            await clickButtonAsync('shop money_buy mny_shop1_N_10')         // 买10个引路蜂
            await clickButtonAsync('cangjian get_all'); // 一键领取藏剑楼奖励
            await clickButtonAsync('xueyin_shenbinggu blade get_all'); // 一键领取霸刀楼奖励
            await clickButtonAsync('xueyin_shenbinggu unarmed get_all'); // 一键领取铁拳楼奖励
            await clickButtonAsync('xueyin_shenbinggu throwing get_all'); // 一键领取天机楼奖励
            await clickButtonAsync('xueyin_shenbinggu stick get_all'); // 一键领取棍楼
            await clickButtonAsync('xueyin_shenbinggu spear get_all');     // 枪楼
            await clickButtonAsync('home');     //回主页
            await clickShuangEr();              // 双儿礼包
        }
        // 领取礼包
        async function getNewLibao(){
           setTimeout(function(){
                clickLibaoBtn();
           },1000)
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
    
        // 新春使者点击
        async function clickXinChun(){
            await clickButtonAsync('home');     //回主页
            await clickButtonAsync('jh 1');        // 进入章节
            await clickButtonAsync('look_npc snow_xinchunshizhe');
            setTimeout(function (){clickXinChunLibaoBtn()},3000);
        }
    
        async function clickShuangEr(){
            await clickButtonAsync('home');     //回主页
            await clickButtonAsync('jh 5');       // 进入扬州
            await clickButtonAsync('go north');     // 南门大街
            await clickButtonAsync('go north');   // 十里长街3
            await clickButtonAsync('go east');    // 十里长街2
            await clickButtonAsync('look_npc yangzhou_yangzhou9');
            setTimeout(function (){clickXinChunLibaoBtn()},3000);
        }
        async function clickMaiHua(){
            await clickButtonAsync('home');     //回主页
            await clickButtonAsync('jh 2');       // 进入扬州
            await clickButtonAsync('go north');     // 南门大街
            await clickButtonAsync('go north');   // 十里长街3
            await clickButtonAsync('go north');     // 南门大街
            await clickButtonAsync('go north');   // 十里长街3
            await clickButtonAsync('go north');     // 南门大街
            await clickButtonAsync('go north');   // 十里长街3
            await clickButtonAsync('go north');     // 南门大街
            await clickButtonAsync('look_npc luoyang_luoyang3');
            setTimeout(function (){clickMaiHuaLibaoBtn()},3000);
        }

        // 判断是什么礼包
        async function clickMaiHuaLibaoBtn(){
    
            var btn = $('.cmd_click2');
            btn.each(function(){
                var txt = $(this).text();
                if(txt.indexOf('礼包') > 0 ){
                    var clickText = $(this).attr('onclick');
                    var clickAction = getLibaoId(clickText);
                    triggerClick(clickAction);
                }
            })
            await clickButtonAsync('home');
        }
    
        // 判断是什么礼包
        async function clickXinChunLibaoBtn(){
    
            var btn = $('.cmd_click2');
            btn.each(function(){
                var txt = $(this).text();
                if(txt != "比试" && txt != "对话"  && txt != "观战"){
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
        function isContains(str, substr) {
            return str.indexOf(substr) >= 0;
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
        /* 获取正气 方法 :start */
        var useDog = false,
            killBadSwitch = true;
        var killTargetArr = ['流寇','恶棍','剧盗','段老大','二娘','岳老三','云老四'];    
        function hitScore(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '正气中'){
                killBadSwitch = false;
                killTargetArr = ['杨掌柜','王铁匠','柳绘心','客商','卖花姑娘','刘守财','柳小花','朱老伯','方寡妇','方老板'];
                Dom.html('负气中');
            }else{
                killBadSwitch = true;
                killTargetArr = ['流寇','恶棍','剧盗','段老大','二娘','岳老三','云老四'];
                Dom.html('正气中')
            }
        }
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
            // clickButton('golook_room');
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
            if(DomTxt == '地图碎片'){
                foundSuiPian();
                suipianInterval = setInterval(function(){
                    foundSuiPian();
                },1*60*1000)
                console.log(getTimes() +'开始地图碎片');
                Dom.html('停止碎片');
            }else{
                clearInterval(suipianInterval);
                console.log(getTimes() +'停止地图碎片');
                Dom.html('地图碎片');
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
                    // console.log(name);
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
            // console.log(targetName);
            return targetName;
        }
    
        function goNextRoom(index){
            goPlaceBtnClick('地室');
            // console.log(index);
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
        /* 切磋 :start */
        var fightInterval = null;
        function fightWithPlayer(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '切磋'){
                var id = prompt("请输入要切磋的ID", "4316804");
                if(!id || id == ''){
                    return
                }
                fightInterval = setInterval(function(){
                    fightWithPlayerFn(id);
                },1000)
                console.log(getTimes() +'开启切磋');
                Dom.html('取消切磋');
            }else{
                clearInterval(fightInterval);
                Dom.html('切磋')
                console.log(getTimes() +'停止切磋');
            }
        }
        function fightWithPlayerFn(id){
            clickButton('fight u'+id);
        }
        /* 切磋 :end*/
        /* 杀正邪 方法 :start */
        var badNameArr = [];
        var killErInterval = null;
        var killErSwitch = false;
        var killENum = 0;
        function killErNiangFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '杀正邪'){
                killENum = 0;
                console.log(getTimes() +'开始杀正邪');
                useDog = false;
                badNameArr = ['段老大','二娘'];
                Dom.html('取消杀正邪');
                killErInterval = setInterval(function(){
                    if(killENum >10){
                        clickButton('escape');
                        useDog = true;
                        console.log(getTimes() +'取消杀正邪');
                        $("#btnm1").html('杀正邪');
                        killErSwitch = false;
                        clearInterval(killErInterval);
                    }else{
                        doClearNpc();
                        killErSwitch = true;
                        // doKillDogSet();
                    }
    
                },10000)
            }else{
                useDog = true;
                console.log(getTimes() +'取消杀正邪');
                Dom.html('杀正邪');
                clearInterval(killErInterval);
            }
        }
        /* 杀正邪 方法 :end */
        /* 杀逃犯 方法 :start */
        var killTaoFanInterval = null;
        var taoPlaceStep = 1;
        function killTaoFanFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '杀逃犯'){
                console.log(getTimes() +'开始杀逃犯');
                useDog = true;
                badNameArr = ['段老大','二娘'];
                Dom.html('取消逃犯');
                killTaoFanInterval = setInterval(function(){
                    doClearTaoFan();
                    doKillTaoFanSet();
                },4000)
            }else{
                useDog = false;
                console.log(getTimes() +'停止杀逃犯');
                Dom.html('杀逃犯');
                clearInterval(killTaoFanInterval);
            }
        }
        // 清狗技能
        function doKillTaoFanSet(){
            var skillArr = Base.mySkillLists.split('；');
            if(hasDog().length <2 && useDog){
                skillArr = ['茅山道术','天师灭神剑'];
            }
    
            if($('.out_top').find('.outkee_text').length >1){
                clickButton('escape');
                return false;
            }
            var skillIdA = ['1','2','3','4','5','6'];
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
            //clickButton('escape');
            if(!clickSkillSwitch && $('.cmd_skill_button').length >0){
                clickButton('playskill 1');
            }
        }
        // 开始打坏人
        function doClearTaoFan(){
            findTaoFan();
        }
        //去位置
        async function goTaoFanPlace(place){
            // await clickButtonAsync('home');
            await clickButtonAsync('jh '+place);
        }
        // 去下一个位置
       async function goNextTaoFanPlace(){
            if(taoPlaceStep <10){
                taoPlaceStep++
            }else{
                taoPlaceStep = 1;
            }
            await goTaoFanPlace(taoPlaceStep);
        }
    
        // 杀逃犯
        async function doKillTaoFan(arr){
            var maxId = arr[0];
            killENum++;
            console.log(getTimes() +'当前第：'+ killENum +'个，'+ bad_target_name +':'+ maxId);
            await new Promise(function (resolve) {
                setTimeout(resolve, 1000);
            });
            await killE(maxId);
        }
        // 找打坏人
        async function findTaoFan(){
            goNpcPlace(taoPlaceStep);
            // javascript:clickButton('golook_room');
            var btn = $('.cmd_click3');
            idArr = [];
            for(var j = 0; j <badNameArr.length; j++){
                var badName = badNameArr[j];
    
                for(var i = btn.length;  i >0 ; i--){
                    var txt = btn.eq(i).text();
                    if(txt == badName){
                        bad_target_name = badName;
                        var npcText = null;
                        if(killBadSwitch){
                            npcText = btn.eq(i).attr('onclick');
                        }else{
                            npcText = btn.eq(i-1).attr('onclick');
                        }
                        var id = getId(npcText);
                        idArr.push(id);
                    }
                    // clickButton('score u4185184-15a1a', 0)
                    var btnClick = btn.eq(i).attr('onclick');
                    // 有玩家就闪过去
                    if(btnClick){
                        if(btnClick.indexOf('score') != '-1'){
                            idArr = [];
                        }
                    }
                }
            }
    
            // 有狗就闪过去
            if(getDogNum().length>0){
               goNextTaoFanPlace();
            }else{
                if(idArr.length == 0){
                    goNextTaoFanPlace();
                }else{
                   await doKillTaoFan(idArr);
                }
            }
    
        }
    
        /* 杀逃犯 方法 :end */
        /* 清正邪 方法 :start */
        var clearNpcInterval = null;
        var placeArr = ['书房','打铁铺子','桑邻药铺','南市','绣楼','北大街','钱庄','桃花别院','杂货铺','祠堂大门','厅堂'];
        var placeStep = 0;
        var killENum = 0;
        var clearNpcIntervalSetSkill = null;
        var bad_target_name = null;
        function clearNpcFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '清正邪'){
                useDog = true;
                badNameArr = ['段老大','二娘','岳老三','云老四','剧盗','恶棍','流寇'];
                console.log(getTimes() +'开始清正邪');
                Dom.html('取消正邪');
                doClearNpc();
                clearNpcInterval = setInterval(function(){
                    doClearNpc();
                },10000)
            }else{
                useDog = false;
                console.log(getTimes() +'停止清正邪');
                Dom.html('清正邪');
                clearInterval(clearNpcInterval);
            }
    
        }
        // 开始打坏人
        function doClearNpc(){
            findNpc();
        }
        // 清狗技能
        function doKillDogSet(){
            var skillArr = Base.mySkillLists.split('；');
            if(hasDog().length <2 && useDog){
                skillArr = ['茅山道术','天师灭神剑'];
            }
    
            if(!killErSwitch){
                if(hasDog().length >0 && useDog || $('.out_top').find('.outkee_text').length >1){
                    clickButton('escape');
                    return false;
                }
            }
    
            var skillIdA = ['1','2','3','4','5','6'];
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
            if(!clickSkillSwitch && $('.cmd_skill_button').length >0){
                clickButton('playskill 1');
            }
        }
        // 找打坏人
        async function findNpc(){
            await clickButtonAsync('golook_room');
            var btn = $('.cmd_click3');
            idArr = [];
            for(var j = 0; j <badNameArr.length; j++){
                var badName = badNameArr[j];
                for(var i = btn.length;  i >0 ; i--){
                    var txt = btn.eq(i).text();
                    if(txt == badName){
                        bad_target_name = badName;
                        var npcText = null;
                        if(killBadSwitch){
                            npcText = btn.eq(i).attr('onclick');
                        }else{
                            npcText = btn.eq(i-1).attr('onclick');
                        }
                        var id = getId(npcText);
                        idArr.push(id);
                    }
                    var btnClick = btn.eq(i).attr('onclick');
                    if(btnClick){
                        if(btnClick.indexOf('score') != '-1'){
                            idArr = [];
                        }
                    }
                }
            }
    
            if(getDogNum().length>0 && !killErSwitch){
                await goNextPlace();
            }else if(getPlayerNum().length >0){
                await goNextPlace();
            }else if($('.cmd_skill_button').length == 0){
                if(idArr.length == 0){
                    await goNextPlace();
                }else{
                    await doKillBadNpc(idArr);
                }
            }
        }
        // 去下一个位置
        async function goNextPlace(){
            clearInterval(clearNpcIntervalSetSkill);
            if(placeStep <10){
                placeStep++
            }else{
                placeStep = 0;
            }
            await goNpcPlace(placeArr[placeStep]);
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
        // 获取在场人的数量
        function getPlayerNum(){
            var nameArr = [];
            var nameDom = $('.cmd_click3');
            var dogName = ['score u'];
            var arr3=[];
            nameDom.each(function(){
                var name = $(this).attr('onclick');
                if(name != ''){
                    nameArr.push(name);
                }
            })
    
            for(var i =0; i<nameArr.length; i++){
                for(var j=0; j<dogName.length; j++){
                    if(nameArr[i].indexOf(dogName[j]) != '-1'){
                        arr3.push(nameArr[i]);
                        break;
                    }
                }
            }
            return arr3;
        }
        // 杀好人
        async function doKillBadNpc(arr){
            // console.log(arr);
            var maxId = null;
            if(arr.length >1){
                var newIdArr = [];
                for(var i =0 ; i<arr.length; i++){
                    if(killBadSwitch){
                        newIdArr.push(idArr[i].replace('eren',''));
                    }else{
                        newIdArr.push(arr[i].replace('bad_target_',''));
                    }
                }
                maxId = newIdArr.max();;
                maxId = arr[maxId];
            }else{
                maxId = arr[0];
            }
            killENum++;
            console.log(getTimes() +'当前第：'+ killENum +'个，'+ bad_target_name +':'+ maxId);  //eren580108074
            await killE(maxId);
    
            clearNpcIntervalSetSkill = setInterval(function(){
                doKillDogSet();
            },7000)
        }
        //去位置
        async function goNpcPlace(place){
            switch(place){
                case "书房":
                    await goSfang();
                    break;
                case "打铁铺子":
                    await goTie();
                    break;
                case "桑邻药铺":
                    await goYao();
                    break;
                case "南市":
                    await goNan();
                    break;
                case "绣楼":
                    await goXiu();
                    break;
                case "北大街":
                    await goNStreet();
                    break;
                case "钱庄":
                    await goQian();
                    break;
                case "桃花别院":
                    await goTao();
                    break;
                case "杂货铺":
                    await goZa();
                    break;
                case "祠堂大门":
                    await goCi();
                    break;
                case "厅堂":
                    await goTing();
                    break;
            }
        }
        /* 清正邪 方法 :end */
        /* 跨服 方法 :start */
        var kuafuNpc = '';
        function interServerFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '跨服'){
                kuafuNpc = '[36-40区]';
                console.log(getTimes() +'开始36-40跨服');
                Dom.html('取消跨服');
            }else{
                kuafuNpc = '';
                console.log(getTimes() +'停止36-40跨服');
                Dom.html('跨服')
            }
    
        }
        /* 跨服 方法 :end */
        
        function doOneSkillsJian(){
            var skillArr = ['九天龙吟剑法','覆雨剑法'];
            var skillIdA = ['1','2','3','4','5','6'];
    
            $.each(skillIdA, function(index, val){
                var btn = $('#skill_'+val);
                var btnName = btn.text();
    
                for(var i = 0; i<skillArr.length; i++){
                    var skillName = skillArr[i];
                    if(btnName == skillName){
                        btn.find('button').trigger('click');
                        break;
                    }
                }
            })
        }
        function doOneSkillsZhang(){
            var skillArr = ['排云掌法','如来神掌'];
            var skillIdA = ['1','2','3','4','5','6'];
            
            $.each(skillIdA, function(index, val){
                var btn = $('#skill_'+val);
                var btnName = btn.text();
    
                for(var i = 0; i<skillArr.length; i++){
                    var skillName = skillArr[i];
                    if(btnName == skillName){
                        btn.find('button').trigger('click');
                        break;
                    }
                }
            })
        }
        /* 打楼 方法 :start */
        var fightLouInterval = null;
        var daLouMode = 0;
        function fightLou(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '打楼'){
                daLouMode = 1;
                console.log(getTimes() +'开始打楼');
                Dom.html('取消打楼');
            }else{
                daLouMode = 0;
                console.log(getTimes() +'停止打楼');
                Dom.html('打楼')
            }
        }
        function chuzhaoNum(){
            $('#btn-chuzhao').html('出招+' + maxQiReturn);
        }
        var maxQiReturn = 0;
        /* 打楼 方法 :end */
        /* 对招 方法 :start */
        var duiZhaoMode = 0;
        function fightAllFunc(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '对招'){
                duiZhaoMode = 1;
                console.log(getTimes() +'开始对招');
                Dom.html('取消对招');
            }else{
                duiZhaoMode = 0;
                console.log(getTimes() +'停止对招');
                Dom.html('对招')
            }
        }
        var maxQiReturn = 0;
        function doFightAll(){
            if($('span.out4:contains(切磋一番)').length>0){
                go('prev_combat');
            }
            if($('#skill_1').length == 0){
                maxQiReturn = 0;
                chuzhaoNum();
                bixueEnd();
                return;
            }
            if(hasQiLin()){
                clickButton('escape');
                clickButton('home');
                setTimeout(function(){
                    clickButton('home');
                },1000)
                setTimeout(function(){
                    clickButton('home');
                },2000)
                return false;
            }
    
            var out = $('#out .out');
            out.each(function(){
    
                if($(this).hasClass('done')){
                    return
                }
    
                $(this).addClass('done');
    
                var txt = $(this).text();
                var qiNumber = gSocketMsg.get_xdz();
                if(qiNumber<3){
                    return;
                }
    
                var clickSkillSwitch = checkHeal();
    
                if(!clickSkillSwitch && $('.cmd_skill_button').length >0){
                    var hitDesList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                    for(var i = 0; i<hitDesList.length; i++){
                        var hitText = hitDesList[i];
                        if(txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1'){
                            if(txt.indexOf(hitText) != '-1'){
                                if(Base.getCorrectText('4253282')){
                                    if(txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1'){
                                        kezhi('2');
                                    }else{
                                        kezhi('1');
                                    }
                                }else{
                                    doKillSet();
                                }
                                return
                            }
                        }
                    }
                }
            })
            var qiText = gSocketMsg.get_xdz();
            if(qiText > 8){
                kezhi('2');
            }
        }
    
        function hasQiLin(){
            var text = $('#vs11').text();
            if(text.indexOf('火麒麟王') != '-1'){
                return true;
            }else{
                return false;
            }
        }
        /* 对招 方法 :end */
        var healSpaceTime = true;
        function checkHeal(){
            var hp = geKeePercent();
            var qiNumber = gSocketMsg.get_xdz();
            if(qiNumber < 3){
                return;
            }
            if(!healSpaceTime){
                return;
            }
            var neili = geForcePercent();
            var hasHeal = false;
            if((hp < 50 && maxQiReturn < 3 )){
                var skillArr = ["道种心魔经","茅山道术"];
                if(Base.getCorrectText('4253282')){
                    var skillArr = ["道种心魔经"];
                    console.log(getTimes() +'血过少，使用技能【道种心魔经】');
                }
                var skillIdA = ['1','2','3','4','5','6'];
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
                            chuzhaoNum();
                            healSpaceTime = false;
                            setTimeout(function(){
                                healSpaceTime = true;
                            },2000)
                            break;
                        }
                    }
                })
            }else if(parseInt(neili) < 10 ){
                var skillArr = ["道种心魔经"];
                console.log(getTimes() +'内力过少，使用技能【道种心魔经】');
                var skillIdA = ['1','2','3','4','5','6'];
                $.each(skillArr, function(index, val){
                    var skillName = val;
    
                    for(var i = 0; i<skillIdA.length; i++){
                        var btnNum = skillIdA[i];
                        var btn = $('#skill_'+btnNum);
                        var btnName = btn.text();
    
                        if(btnName == skillName){
                            btn.find('button').trigger('click');
                            healSpaceTime = false;
                            hasHeal = true;
                            setTimeout(function(){
                                healSpaceTime = true;
                            },2000)
                            break;
                        }
                    }
                })
            }

            if(!bixueSwitch && isBigBixue()){
                var skillArr = ['碧血心法'];
    
                var skillIdA = ['1','2','3','4','5','6'];
    
                $.each(skillArr, function(index, val){
                    var skillName = val;
                    for(var i = 0; i<skillIdA.length; i++){
                        var btnNum = skillIdA[i];
                        var btn = $('#skill_'+btnNum);
                        var btnName = btn.text();
                        if(btnName == skillName){
                            btn.find('button').trigger('click');
                            console.log(getTimes() + '使用鼻血');
                        }
                    }
                })
            }
            return hasHeal;
        }
        /* 怼人 方法 :start */
        var fightAllInter1 = null;
        function fightAllFunc1(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '怼人'){
                var targetNpcName = prompt("请输入要使用的技能", "公主丞,未央公主,百夫长,孽龙之灵,真身,极武圣,拳斗师");
                if(targetNpcName){
                    fightAllInter1 = setInterval(function(){
                        doFightAll1(targetNpcName);
                    },200);
                    console.log(getTimes() +'开始怼人');
                    Dom.html('取消怼人');
                }
            }else{
                clearInterval(fightAllInter1);
                console.log(getTimes() +'停止怼人');
                Dom.html('怼人')
            }
        }
        function doFightAll1(targetNpcName){
            if($('#skill_1').length == 0){
                maxQiReturn = 0;
                chuzhaoNum();
                bixueEnd();
                return;
            }
            var out = $('#out .out');
            out.each(function(){
    
                if($(this).hasClass('doneTarget')){
                    return
                }
    
                $(this).addClass('doneTarget');
    
                var clickSkillSwitch = checkHeal();
    
                var qiText = gSocketMsg.get_xdz();
                if(qiText < 6 && targetNpcName){
                    return;
                }
    
                var txt = $(this).text();
                var hitDesList = null;
                var OldList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                if(targetNpcName){
                    hitDesList = targetNpcName.split(',').concat(killTargetArr);
                }else{
                    hitDesList = OldList;
                }
                for(var i = 0; i<hitDesList.length; i++){
                    var hitText = hitDesList[i];
                    if(txt.indexOf(hitText) != '-1'){
                        if(txt.indexOf('太极神功') != '-1' || txt.indexOf('金刚不坏功力') != '-1' || txt.indexOf('手脚迟缓') != '-1' || txt.indexOf('手脚无力') != '-1' || txt.indexOf('伤害') != '-1' || txt.indexOf('武艺不凡') != '-1' || txt.indexOf('我输了') != '-1' || txt.indexOf('脸色微变') != '-1' || txt.indexOf('直接对攻') != '-1'){
                            return;
                        }
                        else if(txt.indexOf('领教壮士的高招') == '-1' && txt.indexOf('深深吸了几口气') == '-1' && txt.indexOf('希望扰乱你') == '-1' && txt.indexOf('紧接着') == '-1' && txt.indexOf('同时') == '-1' && txt.indexOf('身形再转') == '-1' && txt.indexOf('迅疾无比') == '-1'){
                            if(txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1'){
                                kezhi('2');
                            }else{
                                kezhi('1');
                            }
                            return;
                        }
                    }
                }
            })
        }
        /* 怼人 方法 :end */
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
    
            var skillIdA = ['1','2','3','4','5','6'];
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
    
            var skillIdA = ['1','2','3','4','5','6'];
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
    
            if(qiText < 3){
                return;
            }
    
            var hasHeal = checkHeal();
    
            if(hasHeal){
                return;
            }
            if(qiText < Base.qi){
                return;
            }
            var skillArr = Base.mySkillLists.split('；');
    
            if(daLouMode == 1){
                skillArr = ["万流归一"];
            }
    
            var skillIdA = ['1','2','3','4','5','6'];
            var clickSkillSwitch = false;
            $.each(skillArr, function(index, val){
                var skillName = val;
    
                for(var i = 0; i<skillIdA.length; i++){
                    var btnNum = skillIdA[i];
                    var btn = $('#skill_'+btnNum);
                    var btnName = btn.text();
    
                    if(btnName == skillName){
                        btn.find('button').trigger('click');
                        console.log('自动技能：' + btnName);
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
        /* 更换青龙装备 :start */
        var myCareList = "";    // 关注装备的名称
        function changeQinglong(e){
            var careList = prompt("请输入要使用的技能", myCareList);
            if(careList){
                myCareList = careList;
            }
        }
        /* 更换青龙装备 :end */
        /* 更换跨服青龙装备 :start */
        var myCareKuaFuList = "明月,碧玉锤,星月大斧,霸王枪,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣";    // 关注装备的名称
        function changeQinglong1(e){
            var txt = myCareKuaFuList;
            var careList = prompt("请输入要使用的技能", txt);
            if(careList){
                myCareList = careList;
            }
        }
        /* 更换跨服青龙装备 :end */
    
        /* 更换非关注青龙装备 :start */
        var disCareList = "";    // 非关注装备的名称
        if(Base.getCorrectText('4253282')){
            disCareList = "轩辕剑碎片,破岳拳套碎片,玄冰凝魄枪碎片,胤武伏魔斧碎片,九天灭世锤碎片";        // 非关注装备的名称
        }
        if(Base.getCorrectText('4254240') && Base.correctQu() == '38'){
            disCareList = "轩辕剑碎片,破岳拳套碎片,天神杖碎片,神龙怒火鞭碎片";        // 非关注装备的名称
        }
        if(Base.getCorrectText('3594649')){
            disCareList = "雷霆诛神刀碎片,轩辕剑碎片,破岳拳套碎片,玄冰凝魄枪碎片,胤武伏魔斧碎片,九天灭世锤碎片";    // 非关注装备的名称
        }
        // 有才
        if(Base.getCorrectText('4219507')){
            disCareList = "轩辕剑碎片,破岳拳套碎片,玄冰凝魄枪碎片,胤武伏魔斧碎片,九天灭世锤碎片";    // 非关注装备的名称
        }
        function setDisCareQingLong(e){
            var careList = prompt("请输入要使用的技能", disCareList);
            if(careList){
                disCareList = careList;
            }
        }
        /* 更换非关注青龙装备 :end */
    
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
        /* 年兽 */
        var nianshouInterval = null;
        var nianshouChatInterval = null;
        function watchNianShou(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '监控年兽'){
                nianshouChatInterval = setInterval(autoGetBack, 2*60*1000);
                nianshouInterval = setInterval(function(){
                    getNianInfo();
                },200);
                Dom.html('取消年兽');
            }else{
                clearInterval(nianshouInterval);
                clearInterval(nianshouChatInterval);
                Dom.html('监控年兽');
            }
        }
        function getNianInfo(){
            var len = $("#out>.out").length;
            var liCollection = $("#out>.out");
    
            $("#out>.out").each(function(i){
                var Dom = liCollection.eq(len-i-1);
                if(Dom.hasClass('doneNianshou')){
                    return
                }
                Dom.addClass('doneNianshou');
                var txt = Dom.text();
    
                if(txt.split('：').length >2){
                    return;
                }
                
                if(txt.indexOf('听说年兽被') == '-1' ){
                    return;
                }
    
                console.log(getTimes() + txt);
                go('jh 1;e;n;n;n;n;n');
                setTimeout(function(){
                    if($('#btn5').html() == '搜尸'){
                        $('#btn5').trigger('click');
                    }
                },2000);
                setTimeout(function(){
                    if($('#btn5').html() == '取消搜尸'){
    
                        $('#btn5').trigger('click');
                       clickButton('home');
                    }
                },5*60*1000);
            })
        }
        /* 杀青龙 方法 :start */
        var Qname = '';     // 青龙恶人名称
        var idArr = [];     // 几个青龙人物的名称数组
    
        var ALLNAME = null;     // 装备名称字符串集合
        var qinglong = null;    // 定时查看是否有青龙
        var QLtrigger = 0;
        function killQinglong(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
    
            if(DomTxt == '杀青龙'){
                Dom.html('取消青龙');
                //myCareList = prompt("请输入要监控的装备", "明月,烈日,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,斩神刀,龙象掌套,暴雨梨花针,残阳棍,伏虎杖,七星鞭,日光宝甲衣,龙皮至尊甲衣,碎片,斩龙宝镯,小李飞刀");
                console.log(getTimes() +'开始杀青龙');
    
                if(!Base.getCorrectText('4253282')){
                    // myCareList = "星河剑,屠龙刀,西毒蛇杖,斩龙宝链,斩龙宝靴,斩龙帽,九天龙吟剑,飞宇天怒刀,天罡掌套,小李飞刀,龙皮至尊甲衣";
                    myCareList = "紫芝,灵草,大还丹,狂暴丹,小还丹,乾坤再造丹,碎片";
                    // myCareList = '明月,烈日,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,诛仙剑,斩神刀,龙象掌套,暴雨梨花针,残阳棍,伏虎杖,七星鞭,日光宝甲衣';
                    // myCareList = '烈日,诛仙剑,斩神刀,龙象掌套,暴雨梨花针,残阳棍,伏虎杖,七星鞭,日光宝甲衣';
                }else{
                    myCareList = "紫芝,灵草,大还丹,狂暴丹,小还丹,乾坤再造丹,碎片";
                    // myCareList = "碎片,小李飞刀";
                }
    
                if(Base.getCorrectText('4254240')){
                    myCareList = "紫芝,灵草,大还丹,狂暴丹,小还丹,乾坤再造丹,碎片,斩龙宝靴,小李飞刀";
                }
    
                if(Base.getCorrectText('4316804')){
                    myCareList = "斩龙宝镯";
                }
                if(Base.getCorrectText('4316804') && Base.correctQu() == '38'){
                    myCareList = "斩龙宝靴,斩龙手镯";
                }
                if(Base.getCorrectText('4253282') && Base.correctQu() == '38'){
    
                    myCareList = "星河剑,血屠刀,霹雳掌套,生死符,毒龙鞭,封魔杖,玉清棍,金丝宝甲衣,残雪,明月,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,";
                }
                if(Base.getCorrectText('6759436') || Base.getCorrectText('6759458') || Base.getCorrectText('6759488') || Base.getCorrectText('6759492') || Base.getCorrectText('6759497') || Base.getCorrectText('6759498')){
                    myCareList = "星河剑,血屠刀,霹雳掌套,生死符,毒龙鞭,封魔杖,玉清棍,金丝宝甲衣,残雪,明月,倚天剑,屠龙刀,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,";
                }
                
                QLtrigger = 1;
            }else{
                clearInterval(qinglong);
                clearTimeout(getNameTimeout);
                console.log(getTimes() +'停止杀青龙');
                QLtrigger = 0;
                Dom.html('杀青龙');
            }
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
        //去位置
        async function goPlace(place){
            
            switch(place){
                case "书房":
                    await goSfang();
                    break;
                case "打铁铺子":
                    await goTie();
                    break;
                case "桑邻药铺":
                    await goYao();
                    break;
                case "南市":
                    await goNan();
                    break;
                case "绣楼":
                    await goXiu();
                    break;
                case "北大街":
                    await goNStreet();
                    break;
                case "钱庄":
                    await goQian();
                    break;
                case "桃花别院":
                    await goTao();
                    break;
                case "杂货铺":
                    await goZa();
                    break;
                case "祠堂大门":
                    await goCi();
                    break;
                case "厅堂":
                    await goTing();
                    break;
            }
            await new Promise(function (resolve) {
                setTimeout(resolve, 500);
            });
    
            idArr = [];
            await killQ();
        }
    
    
        function QinglongMon() {
            this.dispatchMessage = function(b) {
                var type = b.get("type"), subType = b.get("subtype");
                
                if (type=="main_msg"){
                    var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));

                    // 无级别限制镖车
                    var m = msg.match(/荣威镖局：\[36-40区\]花落云/);
                    /*if (m != null) {
                        console.log(getTimes() +msg);
                        var urlSplitArr = msg.split("href;0;")[1].split("");
                        var url = urlSplitArr[0];
                        go(url);
                        killQ();
                        return false;
                    }*/

                    if (msg.indexOf('[36-40区]花落云') != '-1') {
                        console.log(getTimes() + msg);
                        Qname = '[36-40区]墟归一';
                        var urlSplitArr = msg.split("href;0;")[1].split("");
                        var url = urlSplitArr[0];
                        go(url);
                        killQ();
                        return false;
                    }
                    //监控有人开帮派拼图
                    if (msg.match("宝藏地图。")!=null){
                        go('clan bzmt puzz');
                        go('clan bzmt puzz');
                        go('clan bzmt puzz');
                        go('clan bzmt puzz');

                        var json_msg = '帮派地图碎片已经开起';
                        var msg = '[CQ:at,qq=35994480] '+json_msg;
                        var json_str = '{"act":"101","groupid":"465355403","msg": "'+msg+'"}';
                        webSocket.send(json_str);
                        return;
                    }

                    if (msg.match("有人取代了你的连线")!=null){
                        isOnline = false;
                        console.log(getTimes() + '被踢了');
                    }
    
                    //监控 青龙
                    if (QLtrigger==1){
    
                        if(msg.indexOf('新区') != '-1' ){
                            return;
                        }
                        
                        if(msg.indexOf('战利品') == '-1' ){
                            return
                        }
                        
                        if(isKuaFu()){
                            if(msg.indexOf(kuafuNpc) == '-1'){
                                return false;
                            }
                        }else{
                            if(msg.indexOf('本大区') != '-1'){
                                return false;
                            }
                        }
                        
                        // console.log(msg);
                        if(getDisName(msg)){
                            return;
                        }
    
                        var pname = getPname(msg);
                        
                        if(pname){
                            console.log(getTimes() +msg);
                            var urlSplitArr = msg.split("href;0;")[1].split("");
                            var url = urlSplitArr[0];
                            Qname = msg.split("组织：")[1].split("正在")[0];
                            getKuaFuNpc(msg);
                            // console.log(urlSplitArr);
                            console.log(getTimes() + Qname);
                            if(Qname){
                                if(isBigId()){
                                    go(url);
                                    killQ();
                                }else{
                                    var placeName  = urlSplitArr[1];
                                    goPlace(placeName);
                                    console.log('还没开通Vip只能步行过去');
                                }
                            }
                        }    
                    }
                }
            }
        }
        var qlMon = new QinglongMon;
    
        async function quickKill(href){
            // console.log(href);
            window.location.href = href;
            idArr = [];
            killQ();
        }
        function isKuaFu(){
            var isTure = false;
            if(kuafuNpc != ''){
                isTure = true;
            }
            return isTure;
        }
        function getKuaFuNpc(msg){
            if(isKuaFu() && !killBadSwitch){
                getNameFromPlace(msg);
            }
        }
        function getNameFromPlace(msg){
            if(msg.indexOf('打铁铺子') != '-1'){
                Qname = '王铁匠';
            }else if(msg.indexOf('桑邻药铺') != '-1'){
                Qname = '杨掌柜';
            }else if(msg.indexOf('书房') != '-1'){
                Qname = '柳绘心';
            }else if(msg.indexOf('南市') != '-1'){
                Qname = '客商';
            }else if(msg.indexOf('北大街') != '-1'){
                Qname = '卖花姑娘';
            }else if(msg.indexOf('钱庄') != '-1'){
                Qname = '刘守财';
            }else if(msg.indexOf('绣楼') != '-1'){
                Qname = '柳小花';
            }else if(msg.indexOf('祠堂大门') != '-1'){
                Qname = '朱老伯';
            }else if(msg.indexOf('厅堂') != '-1'){
                Qname = '方寡妇';
            }else if(msg.indexOf('杂货铺') != '-1'){
                Qname = '方老板';
            }
            Qname = kuafuNpc + Qname;
        }   
        // 找到青龙目标
        var getNameTimeout = null;
        async function killQ(){
            idArr = [];
            var btn = $('.cmd_click3:contains('+Qname+')');
            if(btn.length == 0){
                console.log('没有找到' + Qname + '重新找');
                clearTimeout(getNameTimeout);
                getNameTimeout = setTimeout(function(){
                    killQ();
                },300)
                return;
            }
            
            for(var i = btn.length-1;  i >=0 ; i--){
                var THISBTN = btn.eq(i);
                var txt = THISBTN.text();

                if(txt == Qname){
                    var npcText = null;
                    if(isKuaFu() && !killBadSwitch){
                        npcText = THISBTN.attr('onclick');
                    }else{
                        if(killBadSwitch){
                            npcText = THISBTN.attr('onclick');
                        }else{
                            npcText = THISBTN.prev().attr('onclick');
                        }
                    }
                    // console.log(npcText);
                    var id = getId(npcText);
                    idArr.push(id);
                    break;
                }
            }
            var maxId = null;
            if(idArr.length >1){
                var newIdArr = [];
                for(var i =0 ; i<idArr.length; i++){
                    if(killBadSwitch){
                        newIdArr.push(idArr[i].replace('eren',''));
                    }else{
                        newIdArr.push(arr[i].replace('bad_target_',''));
                    }
                }
                maxId = newIdArr.max();
                maxId = idArr[maxId];
            }else{
                maxId = idArr[0];
            }
            console.log(getTimes() + maxId);
            if(maxId){
                await killE(maxId);
            }
            clearInterval(clearNpcInterval);
            setTimeout(function(){
                if($('#skill_1').length == 0){
                    console.log('没有进入战斗，重新来过');
                    clearTimeout(getNameTimeout);
                    getNameTimeout = setTimeout(function(){
                        killQ();
                    },100)
                }else{
                    clearTimeout(getNameTimeout);
                }
            },300)
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
    
        // 音乐地址
        var myAudio = new Audio();
        myAudio.src = 'http://front.52yingzheng.com/work/2018/Q2/wap-xjpsc/audio/wait.mp3';
        // 播放音乐
        function playMp3(){
            myAudio.play();
        }
        /* 杀青龙 方法 :end */
        // 红包
        var hongBaoInterval = null,chatInterval =null;
        function killQLHB(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
    
            if(DomTxt == '抢红包'){
                
                Dom.html('取消红包');
                //myCareList = prompt("请输入要监控的装备", "明月,烈日,墨玄掌套,冰魄银针,烈日棍,西毒蛇杖,碧磷鞭,月光宝甲衣,斩神刀,龙象掌套,暴雨梨花针,残阳棍,伏虎杖,七星鞭,日光宝甲衣,龙皮至尊甲衣,碎片,斩龙宝镯,小李飞刀");
                console.log(getTimes() +'开始抢红包');
                clickButton('go_chat');
                $('#out .out').addClass('doneHongB');
                hongBaoInterval = setInterval(function(){
                    getQLHBName();
                },200);
                chatInterval = setInterval(function (){
                    autoGetBack();
                },1*60*1000)
            }else{
                clearInterval(hongBaoInterval);
                clearInterval(chatInterval);
                console.log(getTimes() +'停止抢红包');
                Dom.html('抢红包');
            }
        }
        function getQLHBName(){
            var out = $('#out .out');
            out.each(function(){
    
                if($(this).hasClass('doneHongB')){
                    return
                }
    
                $(this).addClass('doneHongB');
    
                var txt = $(this).text();
    
                if(txt.split('：').length >1){
                    return;
                }
                var txt = $(this).text();
    
                if(txt.indexOf('试试新年手气') != '-1' ){
                     var placeDom = $(this).find('a');
                     if(placeDom.length >0){
                        // console.log(txt);
                        var href = placeDom.attr('href');
                        window.location.href = href;
                     }
                }
            })
        }
        /* 玄铁: start */
        function getXuanTie(){
            console.log(getTimes() +'冰火岛玄铁');
            go('home;jh 5;n;n;n;n;n;n;n;n;n;n;ne;chuhaigo;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home'); //冰火岛玄重铁
        }
    
        function getBingyue(){
            console.log(getTimes() +'开始冰月');
            go('home;jh 14;w;n;n;n;n;event_1_32682066;event_1_35756630;kill bingyuegu_yueyihan;');
            setTimeout(function(){
                console.log(getTimes() +'开始打第二层');
                go('event_1_55319823;kill bingyuegu_xuanwujiguanshou');
                setTimeout(function(){
                    go('event_1_17623983;event_1_6670148;kill bingyuegu_hundunyaoling;');
                    setTimeout(function(){
                        go('s;kill bingyuegu_xianrenfenshen');
                    },40000)
                },40000)
            },30000)
            // clickButton('event_1_17623983');
            //clickButton('event_1_6670148');
            // clickButton('kill bingyuegu_hundunyaoling');
        }
        /* 玄铁: end */
        /* 钓鱼 方法 :start */
        var resFishingParas = 100;   // 系统里默认最多挖50次
        var diaoyu_buttonName = 'diaoyu';
        var firstFishingParas = true;
        var resFishToday = 10;
        var lastFishMsg = "";
        var fishFunc = null;
        function fishingFirstFunc(){
            console.log("开始走向冰火岛！");
            fishingFirstStage();
        }
        async function fishingFirstStage(){
            await clickButtonAsync('home');
            clearInterval(fishFunc);
            // 进入扬州
            await clickButtonAsync('jh 5');       // 进入章节
            await clickButtonAsync('go north');     // 南门大街
            await clickButtonAsync('go north');   // 十里长街3
            await clickButtonAsync('go north');    // 十里长街2
            await clickButtonAsync('go north');      // 十里长街1
            await clickButtonAsync('go north');      // 中央广场
            await clickButtonAsync('go north');      // 十里长街4
            await clickButtonAsync('go north');      // 十里长街5
            await clickButtonAsync('go north');      // 十里长街6
            await clickButtonAsync('go north');      // 北门大街
            await clickButtonAsync('go north');      // 镇淮门
            await clickButtonAsync('go northeast') ;     // 扬州港
            await clickButtonAsync('look_npc yangzhou_chuanyundongzhu');
            await clickButtonAsync('chuhai go');
            await clickButtonAsync('chuhaigo');
            await fishingSecondFunc();
        }
        // 挖鱼饵参数
    
        async function fishingSecondFunc(){
            resFishToday = 10;
            console.log("开始挖鱼饵、砍树、钓鱼！");
            fishingSecondStage();
        }
        async function fishingSecondStage(){
            // 到达冰火岛
            await clickButtonAsync('go northwest');      // 熔岩滩头
            await clickButtonAsync('go northwest');      // 海蚀涯
            await clickButtonAsync('go northwest');      // 峭壁崖道
            await clickButtonAsync('go north');      // 峭壁崖道
            await clickButtonAsync('go northeast') ;     // 炙溶洞口
            await clickButtonAsync('go northwest');      // 炙溶洞
            await clickButtonAsync('go west') ;     // 炙溶洞口
            await clickButtonAsync('go northwest') ;     // 熔岩小径
            await clickButtonAsync('go east') ;     // 熔岩小径
            await clickButtonAsync('go east');      // 石华林
            await clickButtonAsync('go east');      // 分岛岭
            await clickButtonAsync('go east');      // 跨谷石桥
            await clickButtonAsync('go east') ;     // 大平原
            await clickButtonAsync('go southeast');
            await clickButtonAsync('go east');
            // 开始钓鱼
            resFishingParas = 100;
            firstFishingParas = true;
            $('#out2 .out2').remove();
            fishIt();
            lastFishMsg = "";
            if(!fishFunc){
                fishFunc=setInterval(fishIt, 6000);
            }
        }
        async function fishIt(){
            // 钓鱼之前先判断上次结果
            // 判断是否调出了东西
            await clickButtonAsync('golook_room');
            // console.log($('span:contains(突然)').text().slice(-9));
    
            if ($('span:contains(突然)').text().slice(-9) !== '没有钓上任何东西。' && ! firstFishingParas){
                if(lastFishMsg !== $('span:contains(突然)').text()) { // 防止钓鱼太快
                    resFishToday = resFishToday - 1;
                    console.log(getTimes() +'钓到一条鱼，剩余钓鱼次数：%d，剩余鱼的条数:%d',resFishingParas, resFishToday);
                }else{
                    // console.log("应该是钓鱼太快了！");
                }
            }
            else{
                if (! firstFishingParas){
                    // console.log(getTimes() +'shit！什么也没钓到！');
                }
            }
            lastFishMsg = $('span:contains(突然)').text();
            if(resFishingParas > 0 && resFishToday > 0){
                clickButton(diaoyu_buttonName);
                resFishingParas = resFishingParas-1;
                console.log(getTimes() +'钓一次鱼，剩余钓鱼次数：%d，剩余鱼的条数:%d',resFishingParas, resFishToday);
                firstFishingParas = false;
                var hasYue = $('span:contains(钓鱼需要)').text().slice(-20);
                if (isContains(hasYue, '钓鱼需要鱼竿和鱼饵，你没有') && hasYue != ''){
                    clearInterval(fishFunc);
                    console.log(getTimes() +'鱼竿或鱼饵不足，停止钓鱼！');
                }
                var hasDoneYue = $('span:contains(被你钓光了)');
                if (hasDoneYue.length >0){
                    clearInterval(fishFunc);
                    console.log(getTimes() +'钓够10条了');
                    if(Base.getCorrectText('4253282')){
                        await clickButtonAsync('go west');
                        await clickButtonAsync('go north');
                        await clickButtonAsync('go north');
                        await clickButtonAsync('go west');
                        await clickButtonAsync('go north');
                        await clickButtonAsync('go west');
                        await clickButtonAsync('event_1_53278632');
                        setTimeout(function(){
                            clickButtonAsync('sousuo');
                            clickButtonAsync('sousuo');
                            clickButtonAsync('home');
                        },5000)
                    }else{
                        await clickButtonAsync('home');
                    }
                }
            }
            else {
                clearInterval(fishFunc);
                if(Base.getCorrectText('4253282')){
                    await clickButtonAsync('go west');
                    await clickButtonAsync('go north');
                    await clickButtonAsync('go north');
                    await clickButtonAsync('go west');
                    await clickButtonAsync('go north');
                    await clickButtonAsync('go west');
                    await clickButtonAsync('event_1_53278632');
                    setTimeout(function(){
                        clickButtonAsync('sousuo');
                        clickButtonAsync('sousuo');
                        clickButtonAsync('home');
                    },5000)
                }else{
                    await clickButtonAsync('home');
                }
            }
        }
        /* 钓鱼 方法 :end */
        function removeByValue(arr, val) {
            for(var i=0; i< arr.length; i++) {
                if(arr[i] == val) {
                    arr.splice(i, 1);
                }
            }
        }
        /* 37 || 38 设置  :start */
        var QIxiaListText = '郭济；步惊鸿；火云邪神；浪唤雨；吴缜；护竺；李宇飞；王蓉；庞统；风行骓；风南；逆风舞；狐苍雁';
        var qixiaPlace = false;
        function doPlace(){
            if(Base.correctQu() == '38'){
                qixiaPlace = true;
            }
        }
        doPlace();
        /* 37 || 38 设置  :end */
        /* 比试奇侠  :start */
        var giveJinSwitch = 0;
        function give15Jin(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '去给15金'){
                Dom.html('在给15金');
                giveJinSwitch = 1;
                console.log(getTimes() +'设置给15金');
            }else if(DomTxt == '在给15金'){
                Dom.html('在给1金');
                giveJinSwitch = 2;
                console.log(getTimes() +'设置给1金');
            }else{
                giveJinSwitch = 0;
                Dom.html('去给15金');
                console.log(getTimes() +'不设置给金');
            }
        }
        var QixiaInfoList = [];
        var QixiaIdList = [
            {
                'name': '浪唤雨',
                'id': qixiaPlace ? 'langfuyu_1494082366_3948' : 'langfuyu_1493782694_7241',
            },{
                'name': '王蓉',
                'id': qixiaPlace ? 'wangrong_1494083286_5287' : 'wangrong_1493782958_7306',
            },{
                'name': '庞统',
                'id': qixiaPlace ? 'pangtong_1494084207_2639' : 'pangtong_1493783879_4255',
            },{
                'name': '李宇飞',
                'id': qixiaPlace ? 'liyufei_1494085130_5201' : 'liyufei_1493784259_6382',
            },{
                'name': '步惊鸿',
                'id': qixiaPlace ? 'bujinghong_1494086054_1635' : 'bujinghong_1493785173_9368',
            },{
                'name': '风行骓',
                'id': qixiaPlace ? 'fengxingzhui_1499611328_9078' : 'fengxingzhui_1499611243_9634',
            },{
                'name': '郭济',
                'id': qixiaPlace ? 'guoji_1494086978_5597' : 'guoji_1493786081_9111',
            },{
                'name': '吴缜',
                'id': qixiaPlace ? 'wuzhen_1499612120_4584' : 'wuzhen_1499612120_7351',
            },{
                'name': '风南',
                'id': qixiaPlace ? 'fengnan_1494087902_8771' : 'fengnan_1493786990_415',
            },{
                'name': '火云邪神',
                'id': qixiaPlace ? 'huoyunxieshen_1494088826_8655' : 'huoyunxieshen_1493787900_1939',
            },{
                'name': '逆风舞',
                'id': qixiaPlace ? 'niwufeng_1494089750_5660' : 'niwufeng_1493788811_7636',
            },{
                'name': '狐苍雁',
                'id': qixiaPlace ? 'hucangyan_1499613025_5192' : 'hucangyan_1499613026_2522',
            },{
                'name': '护竺',
                'id': qixiaPlace ? 'huzhu_1499613932_2191' : 'huzhu_1499613933_1522',
            },{
                'name': '八部龙将',
                'id': qixiaPlace ? 'babulongjiang_1521719740_7754' : 'babulongjiang_1521719730_537',
            },{
                'name': '玄月研',
                'id': qixiaPlace ? 'xuanyueyan_1521600969_7372' : 'xuanyueyan_1521600969_8119',
            },{
                'name': '狼居胥',
                'id': qixiaPlace ? 'langjuxu_1521715080_132' : 'langjuxu_1521715081_4559',
            },{
                'name': '烈九州',
                'id': qixiaPlace ? 'liejiuzhou_1521716031_1449' : 'liejiuzhou_1521716024_5316',
            },{
                'name': '穆妙羽',
                'id': qixiaPlace ? 'mumiaoyu_1521716956_979' : 'mumiaoyu_1521716949_346',
            },{
                'name': '宇文无敌',
                'id': qixiaPlace ? 'yuwenwudi_1521717883_6285' : 'yuwenwudi_1521717874_9561',
            },{
                'name': '李玄霸',
                'id': qixiaPlace ? 'lixuanba_1521718813_5916' : 'lixuanba_1521718806_7259',
            },{
                'name': '风无痕',
                'id': qixiaPlace ? 'fengwuhen_1521720667_2927' : 'fengwuhen_1521720658_2332',
            },{
                'name': '厉沧若',
                'id': qixiaPlace ? 'licangruo_1521721595_4149' : 'licangruo_1521721586_3467',
            },{
                'name': '夏岳卿',
                'id': qixiaPlace ? 'xiaqing_1521722519_8891' : 'xiaqing_1521722508_7807',
            },{
                'name': '妙无心',
                'id': qixiaPlace ? 'miaowuxin_1521723444_5139' : 'miaowuxin_1521723435_7261',
            },{
                'name': '巫夜姬',
                'id': qixiaPlace ? 'wuyeju_1521724375_3924' : 'wuyeju_1521724367_482',
            }
        ]
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
                // console.log(QixiaInfoList);
                QixiaInfoList = SortNewQiXia(firstQiXiaList);
                giveSoreQiXiaListId();
                setQiXiaObj();
            }
        }
        // 给排序的奇侠列表赋予id
        function giveSoreQiXiaListId(){
            for(var i = 0; i <QixiaIdList.length; i++){
                var name = QixiaIdList[i].name;
                for(var j = 0; j<QixiaInfoList.length; j++){
                    var cname = QixiaInfoList[j].name;
                    if(cname == name){
                        QixiaInfoList[j].id = QixiaIdList[i].id;
                    }
                }
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
        }
    
        var fightQixiaSwitch = true;
        var qixiaObj= {}; 
    
        function setQiXiaObj(){
            // 37区大号
            if(Base.getCorrectText('4253282')  && Base.correctQu() == '37'){
                getQiXiaObj('玄月研'); 
            }
            //38区 张三丰
            else if(Base.getCorrectText('4316804') && Base.correctQu() == '38'){
                getQiXiaObj('护竺'); 
            }
            //38区 东方大侠
            else if(Base.getCorrectText('4254240') && Base.correctQu() == '38'){
                getQiXiaObj('风无痕'); 
            }
            // 37区小号  西方失败
            else if(Base.getCorrectText('4316804') && Base.correctQu() == '37'){
                getQiXiaObj('护竺'); 
            }else{
                getQiXiaObj('郭济'); 
            }
            // 38小号 火树银花
            if(Base.getCorrectText('4259178') && Base.correctQu() == '38'){
                getQiXiaObj('步惊鸿'); 
            }
            if(isSixId()){
                getQiXiaObj('吴缜'); 
            }
            //37区
            if(Base.getCorrectText('4254240') && Base.correctQu() == '37'){
                getQiXiaObj('吴缜'); 
            }
            //37区 火狼
            if(Base.getCorrectText('4238943')){
                getQiXiaObj('风无痕'); 
            }
            //37区 王有财
            if(Base.getCorrectText('4219507')){
                getQiXiaObj('玄月研'); 
            }
            // console.log(qixiaObj);
        }
    
        var fightSkillInter = null,
            setFight = null,
            zhaobing = true;
    
        var mijingNum = 0;
        var isTalkQiXia = false;
    
        // 给奇侠1金锭
        var qixiaDone = false;
        var giveJinInterval = null;
        var giveQixiaSwitch = false;
        // 对话奇侠
        function talkToQixiaFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            
            if(DomTxt == '对话奇侠'){
                if(qixiaDone){
                    return;
                }
                isTalkQiXia = true;
                $('#out2 .out2').addClass('done');
                console.log(getTimes() +'开始对话'+qixiaObj.name+'！');
                $('#out2 .out2').addClass('doneQiXia1');
                giveQixiaSwitch = true;
                Dom.html('停止对话');
                giveJinQiXiaFunc();
            }else{
                isTalkQiXia = false;
                giveQixiaSwitch = false;
                clearInterval(giveJinInterval);
                Dom.html('对话奇侠');
            }
        }
        // 给奇侠1金
        function giveJinToQixiaFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '给奇侠金'){
                if(qixiaDone){
                    return;
                }
                $('#out2 .out2').addClass('done');
                console.log(getTimes() +'开始给奇侠1金'+qixiaObj.name+'！');
                isTalkQiXia = false;
                giveQixiaSwitch = true;
                isInMijing = false;
                $('#out2 .out2').addClass('doneQiXia1');
                Dom.html('取消给金');
                giveJinQiXiaFunc();
            }else{
                giveQixiaSwitch = false;
                clearInterval(giveJinInterval);
                Dom.html('给奇侠金');
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
                        // eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
                        // auto_zsjd20_yuwenwudi
                        if(giveJinSwitch == 0){
                            if(mijingNum == 3){
                                eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
                            }else if(mijingNum == 4){
                                eval("clickButton('auto_zsjd20_" + qixiaName1 + "')");
                            }else{
                                // eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
                                eval("clickButton('ask " + QiXiaId + "')");
                            }
                        }else if(giveJinSwitch == 1){
                            eval("clickButton('auto_zsjd20_" + qixiaName1 + "')");
                        }else if(giveJinSwitch == 2){
                            eval("clickButton('auto_zsjd_" + qixiaName1 + "')");
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
                    qixiaDone = true;
                    clearInterval(giveJinInterval);
                    clickButton('home');
                    $('#btno18').html('给奇侠金');
                    $('#btno23').html('对话奇侠');
                }else if(txt.indexOf('太多关于亲密度') != '-1' ){
                    isInMijing = false;
                    giveQixiaSwitch = false;
                    isTalkQiXia = false;
                    qixiaDone = true;
                    clearInterval(giveJinInterval);
                    clickButton('home');
                    $('#btno18').html('给奇侠金');
                    $('#btno23').html('对话奇侠');
                }else if(txt.indexOf('你搜索到一些') != '-1'){
                    doGiveSetTimeout = setTimeout(function(){
                        clickBtnByName('仔细搜索');
                    },2000)
                }else if(txt.indexOf('秘境') != '-1'){
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
                    },3000)
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
                    if(isInMijing){
                        return;
                    }
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
    
        // 
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
        // 打奇侠定时器
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
                    // eval("clickButton('fight " + qixiaObj.id + "')");
                    // clickButton('fight huoyunxieshen_1493787900_1939');
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
            var skillIdA = ['1','2','3','4','5','6'];
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
            //clickButton('escape');
            if(!clickSkillSwitch && $('.cmd_skill_button').length >0){
                clickButton('playskill 1');
            }
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
                    //clearInterval(fightSkillInter);
                    // clickButton('golook_room');
                    clickButton('home');
                    clickButton('open jhqx');
                    clickButton('find_task_road qixia '+qixiaObj.index);
                    setTimeout(function(){
                        fightDog();
                    },1000)
                }else if(txt.indexOf('今日亲密度操作次数') != '-1'){
                    // fightQixiaSwitch = false;
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
            //clickButton('go south');
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
        var TianJianNPCList = [];
        var BaseTarget = [];
        var TianJianNPCList1 = ["十夫长","百夫长","银狼军","铁狼军","金狼军","金狼将","镇擂斧将","赤豹死士","黑鹰死士","金狼死士","暗灵杀手","暗灵旗主","镇谷神兽","守谷神兽","饕餮幼崽","饕餮分身","饕餮兽魂","饕餮战神","镇潭神兽","守潭神兽","螣蛇幼崽","螣蛇分身","螣蛇兽魂","螣蛇战神","镇山神兽","守山神兽","应龙幼崽","应龙兽魂","应龙分身","应龙战神","镇殿神兽","守殿神兽","幽荧幼崽","幽荧兽魂","幽荧分身","幽荧战神"];
        //var TianJianNPCList = ["王铁匠","杨掌柜","柳绘心","柳小花","朱老伯","方老板","醉汉"];
        var killTianJianIntervalFunc =  null;
        var currentNPCIndex = 0;
        function killTianJianTargetFunc(e){
            var mySkillLists =  Base.mySkillLists;
            var Dom = $(e.target);
            if (Dom.html() == '杀天剑'){
                currentNPCIndex = 0;
                if(Base.tianjianTarget != ''){
                    BaseTarget = Base.tianjianTarget.split(',');
                }
                TianJianNPCList = BaseTarget.concat(TianJianNPCList1);
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
            //    clickButton('go east');
            if ($('span').text().slice(-7) == "不能杀这个人。"){
                currentNPCIndex = currentNPCIndex + 1;
                console.log("不能杀这个人！");
                //        return;
            }
            getTianJianTargetCode();
            if(genZhaoMode != '1'){
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
                // if (this[i] === obj) {
                //     return true;
                // }
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
            // clickButton('event_1_9179222');     // 进入侧厅
            setTimeout(function(){
                clickBtn('进入侧厅');
                readBoard();
            },3000)
        }
        async function readBoard(){
            await clickButtonAsync('go east');
            // clickButton('event_1_11720543');    // 观阅
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
            // clickButton('event_1_44025101');    // 跳下去
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
            "铁手镯 可以在哪位npc那里获得？":"a",
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
                answerQuestionsInterval = setInterval(answerQuestions, 6000);
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
            setTimeout(getAndAnsQuestion, 2000); // 300 ms之后提取问题，查询答案，并回答
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
            },1000)
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
            if(resultsFound.length >=1){
                return QuestAnsLibs[resultsFound[0]];
            }
            else {
                console.log("题目 " + localQuestion + " 找不到答案或存在多个答案，请手动作答！");
                return "failed";
            }
        }
        /* 答题  :end */
    
        /* 跨服逃犯 */
        var chatJianTing = null;
        var userClickMouse = false;
        var autoGetBackInterval = null;
        var autoGetBackCMDExced = true;
        var autoGetBackCMDInterval = null;
        var allQLHFinishedFlag = false;
    
        async function autoGetBack(){
    
            if ($("span:contains(清空信息)").text()==""){ // 如果不在聊天
                if($("#skill_1")[0]==undefined){
                    // 如果不在战斗界面，则探测，5分钟无人操作就返回
                    if(autoGetBackCMDExced){
                        console.log("不在战斗界面，2分钟若无人操作，则自动返回主页聊天界面！");
                        userClickMouse =  false;
                        document.body.addEventListener('click', userClickMouseFunc); // 添加鼠标单击命令
                        autoGetBackCMDInterval = setTimeout(auTogoBack2Chat, 1*60*1000); // 如果等待2分钟，尚未完成，返回主页
                        autoGetBackCMDExced = false;
                    }
                }else{
                    console.log("在战斗界面，放弃本次自动返回操作！");
                    clearInterval(autoGetBackCMDInterval);
                    autoGetBackCMDExced = true;
                    return;
                }
            }
        }
    
        function userClickMouseFunc(){
            console.log("探测到用户操作，取消自动返回主页界面！");
            userClickMouse = true;
            document.body.removeEventListener('click', userClickMouseFunc); // 移出鼠标单击命令
        }
        async function auTogoBack2Chat(){
            if (!userClickMouse){
                console.log("未探测到用户操作，自动返回主页界面！");
                clickButton('go_chat');
                await new Promise(function (resolve) {
                    setTimeout(resolve, 200);
                });
                document.body.removeEventListener('click', userClickMouseFunc); // 移出鼠标单击命令
            }
            autoGetBackCMDExced = true;
        }
    
        function killKuaFuTaoFanFn(e){
            var Dom = $(e.target);
            var DomTxt = Dom.html();
            if(DomTxt == '跨服逃犯'){
                autoGetBackInterval = setInterval(autoGetBack, 2*60*1000);
                getChatInfo();
                console.log(getTimes() +'开始跨服逃犯');
                Dom.html('取消跨服逃犯');
            }else{
                clearInterval(chatJianTing);
                clearInterval(autoGetBackInterval);
                console.log(getTimes() +'结束跨服逃犯');
                Dom.html('跨服逃犯')
            }
        }
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
                recoverFn();
            }
        }
    
        function healFunc(){
            var kee=parseInt(g_obj_map.get("msg_attrs").get("kee"));
            var max_kee=parseInt(g_obj_map.get("msg_attrs").get("max_kee"));
            var force=parseInt(g_obj_map.get("msg_attrs").get("force"));
            var max_force=parseInt(g_obj_map.get("msg_attrs").get("max_force"));
            // console.log("血量是: "+kee+"/"+max_kee);
            // console.log("内力是: "+force+"/"+max_force);
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
    
        function recoverFn(){
            var max_hp = g_obj_map.get("msg_attrs").get("max_kee");
            var max_force = g_obj_map.get("msg_attrs").get("max_force");
            var hp = geKeePercent();
            var neili = geForcePercent();
            var n = 0;
            var m = 0;
            var k = 0;
            
            if(hp < 100){
                m = parseInt((100 - hp)*max_hp /1800000) + 1;
            }
            if(neili < 90){
                n = parseInt((100 - neili)*max_force /500000);
            }
            // console.log(getTimes() +'当前血量百分比：'+ hp+',需要回复的次数是'+m);
            // console.log(getTimes() +'当前内力百分比：'+ neili+',需要回复的次数是'+n);
            eatlingzhi(n);
            recoverTimes(m)
            setTimeout(function(){
                var newNeili = geForcePercent();
                if(newNeili < 90){
                    k = parseInt((100 - newNeili)*max_force /500000);;
                }
                eatlingzhi(k);
            },1000)
            
        }
        function recoverTimes(n){
            var txt = '';
            for(var i = 0 ; i < n; i++ ){
                txt += ',recovery'
            }
            go(txt);
        }
        function eatlingzhi(n){
            var txt = '';
            for(var i = 0 ; i < n; i++ ){
                txt += ',items use snow_qiannianlingzhi'
            }
            go(txt);
        }
        function getChatInfo(){
            chatJianTing = setInterval(function(){
                showQ();
            }, 600);
        }
        // 获取青龙信息
        function showQ(){
            var out = $('.out');
            out.each(function(){
    
                if($(this).hasClass('doneKFTF')){
                    return
                }
    
                $(this).addClass('doneKFTF');
    
                var txt = $(this).text();
                var newSplitArr = txt.split('：');
                if(newSplitArr.length >2){
                  return
                }
    
                var indexText = '';
                var indexTextKuFu = '';
    
                if(txt.indexOf('逃') != '-1'){
                    indexText = ['段老大','二娘','岳老三','云老四','剧盗','恶棍','流寇'];
                    for(var i = 0; i< indexText.length; i++){
                        var name = '【系统】' + indexText[i];
                        if(txt.indexOf(name) != '-1'){
                            // console.log(txt);
                            var place = getPlace2(txt);
                            findKuaTaoFan(place);
                        }
                    }
    
                    indexTextKuFu = '【系统】[36-40区]段老大'
                    if(txt.indexOf(indexTextKuFu) != '-1'){
                        // console.log(txt);
                        var place = getPlace2(txt);
                        findKuaTaoFan(place);
                    }
                }
                
            })
        }
    
        /* 跨服逃犯 end*/
        var userClickMouse = false;
        var autoGetBackInterval = null;
        var autoGetBackCMDExced = true;
        var autoGetBackCMDInterval = null;
        var allQLHFinishedFlag = false;
        var currentPos = null;
        var scanEscaped = null;
        var maikuli_i = null;
        var duancha_i = null;
        var dalie_i = null;
        // 领取奖励 ------------------------------------------------------------------------------------------------------
        //document.body.removeChild(getRewardsButton);
    
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
    
        var getRewardsInterval = 30*60*1000; // 30min
        function getRewardsFunc(){
            if (getRewardsButton.innerText == '开领奖'){ // 处于未领奖状态，单击开始领奖,并将状态置于停领奖状态
                console.log("开始自动领取奖励！");
                scanEscapedFish();
                scanEscaped = setInterval(scanEscapedFish,getRewardsInterval);
                getRewardsButton.innerText = '停领奖';
            }else{
                console.log("停止自动领取奖励！");
                clearInterval(scanEscaped);
                clearInterval(maikuli_i);
                clearInterval(duancha_i);
                clearInterval(dalie_i);
                clearInterval(autoGetBackInterval);
                getRewardsButton.innerText = '开领奖';
            }
        }
        async function maikuli() {
            await clickButtonAsync('work click maikuli');
        }
        async function duancha() {
            await clickButtonAsync('work click duancha');
        }
        async function dalie() {
            await clickButtonAsync('work click dalie');
        }
        async function baobiao() {
            await clickButtonAsync('work click baobiao');
        }
        async function maiyi() {
            await clickButtonAsync('work click maiyi');
        }
        async function xuncheng() {
            await clickButtonAsync('work click xuncheng');
        }
        async function datufei() {
            await clickButtonAsync('work click datufei');
        }
        async function dalei() {
            await clickButtonAsync('work click dalei');
        }
        async function kangjijinbin() {
            await clickButtonAsync('work click kangjijinbin');
        }
        async function zhidaodiying() {
            await clickButtonAsync('work click zhidaodiying');
        }
        async function dantiaoqunmen() {
            await clickButtonAsync('work click dantiaoqunmen');
        }
        async function shenshanxiulian() {
            await clickButtonAsync('work click shenshanxiulian');
            await clickButtonAsync('work click jianmenlipai');
            await clickButtonAsync('work click dubawulin');
            await clickButtonAsync('work click youlijianghu');
            await clickButtonAsync('work click yibangmaoxian');
            await clickButtonAsync('work click zhengfuzhongyuan');
        }
        async function scanEscapedFish() {
            await maikuli();
            await duancha();
            await dalie();
            await baobiao();
            await maiyi();
            await xuncheng();
            await datufei();
            await dalei();
            await kangjijinbin();
            await zhidaodiying();
            await dantiaoqunmen();
            await shenshanxiulian();
            await clickButtonAsync('public_op3'); // 向师傅磕头
        }
    
        /**/
        // 开始挖宝
        //document.body.removeChild(CheckInButton);
    
        // 吃药 ------------------------------------------------------------------------------------------------------
        function userMedecineFunc(){
            clickButton('items use snow_qiannianlingzhi');
        }
    
        // 出招 ------------------------------------------------------------------------------------------------------
        function useSkillsFunc(){
            doKillSet();
        }
        // 随机跑
        var randomRunJianIntervalFunc = null;
        function randomRunButtonFunc(){
            if (randomRunButton.innerText == '随机跑'){
                randomRunButton.innerText ='停跑步';
                randomRunJianIntervalFunc = setInterval(function(){RandomRunOnce()}, 400);
            }else{
                console.log("停止自动切图！");
                randomRunButton.innerText ='随机跑';
                clearInterval(randomRunJianIntervalFunc);
            }
        }
        async function RandomRunOnce(){
            
            var randDirect = {1:'west', 2:'east', 3:'north', 4:'south', 5:'northwest', 6:'northeast', 7:'southwest', 8:'southeast'};
            var direct = Math.floor(Math.random()*8+1);
            var dicListHere = $("button[class*=cmd_click_exits]");
            var findBetterWay = false;
            var cmd = "";
            if($('#skill_1').length > 0 || $(".cmd_click3").length == 0 || $('.prev').length > 0){
                return;
            }
            if(hasTianjian()){
                
            }else if(Base.tianjianTarget != '' && hasTianjianShiwei()){
                
            }else{
                for(var i = 0; i < dicListHere.length; i ++){
                    if(isContains(dicListHere[i].innerText,"湖边")){
                        findBetterWay = true;
                        cmd = dicListHere[i].getAttribute('onclick');
                        break;
                    }
                }
                console.log('随机跑一次！');
                if(findBetterWay){
                    eval(cmd);
                    return;
                }else{
                        var cmd = clickButton('go ' + randDirect[direct] );
                        eval(cmd);
                    return;
                }
            }
        }

        function hasTianjianShiwei(name){
            return hasTargetName('天剑谷卫士');
        }
        function hasTianjian(){
            return hasTargetName('天剑');
        }
        function hasTargetName(name){
            var hasName = false;
            var peopleList = $(".cmd_click3");
            peopleList.each(function(){
                var peopleName = $(this).text();
                if(peopleName == name){
                    hasName = true;
                }
            })
            return hasName
        }
    
        /**/
        // 寻目标 ------------------------------------------------------------------------------------------------------
        var searchedLocList = [];
        var continuedSearch = false;
        var chapList = ['雪亭镇',  '洛阳',     '华山村', '华山',     '扬州',   '丐帮',    '乔阴县','峨眉山','恒山',  '武当山',
                        '晚月庄',   '水烟阁',   '少林寺', '唐门',     '青城山', '逍遥林', '开封',  '明教',   '全真教','古墓',
                        '白驮山',   '嵩山',     '寒梅庄', '泰山',     '大旗门', '大昭寺', '魔教',  '星宿海', '茅山',  '桃花岛',
                        '铁雪山庄', '慕容山庄','大理',    '断剑山庄','冰火岛',  '侠客岛'];
        var findSpecTagerInfo = "雪亭镇-王铁匠";
        function findSpecargetFunc(){
            if (!(findSpecTagerInfo = prompt("请输入寻找目标（章节名-目标名）：", findSpecTagerInfo))){
                return;
            };
            continuedSearch = false;
            if (isContains(findSpecTagerInfo,'-')){
                // 包含‘-’
                var tempTargetInfo = findSpecTagerInfo.split('-');
                removeByValue(tempTargetInfo, ""); // 删除空字符串
                for(var i = 0; i < tempTargetInfo.length; i++){
                    tempTargetInfo[i] = tempTargetInfo[i].trim(" ", "left").trim(" ","right"); // 去除空白
                }
                if (tempTargetInfo.length !== 3){
                    searchedLocList = []; // 清空搜索路径
                }else{
                    continuedSearch = true;
                }
                var chapName = tempTargetInfo[0];
                var TargetName = tempTargetInfo[1];
                var ChapIndex  = getChapIndex(chapName);
                if (ChapIndex > 0){
                    searchForSpecificTarget(ChapIndex, TargetName);
                }
            }else{
                // （1） 如果不包含 -，证明只输入目标名，从第一章找起
                TargetName = targetInfo.trim(" ", "left").trim(" ","right");
                for(var i = 0; i < chapList.length; i++){
                    searchedLocList = [];
                    searchForSpecificTarget(i + 1, TargetName);
                }
            }
        }
    
        function autoFindSpecargetFunc(){
            continuedSearch = false;
            if (isContains(findSpecTagerInfo,'-')){
                // 包含‘-’
                var tempTargetInfo = findSpecTagerInfo.split('-');
                removeByValue(tempTargetInfo, ""); // 删除空字符串
                for(var i = 0; i < tempTargetInfo.length; i++){
                    tempTargetInfo[i] = tempTargetInfo[i].trim(" ", "left").trim(" ","right"); // 去除空白
                }
                if (tempTargetInfo.length !== 3){
                    searchedLocList = []; // 清空搜索路径
                }else{
                    continuedSearch = true;
                }
                var chapName = tempTargetInfo[0];
                var TargetName = tempTargetInfo[1];
                var ChapIndex  = getChapIndex(chapName);
                if (ChapIndex > 0){
                    searchForSpecificTarget(ChapIndex, TargetName);
                }
            }else{
                // （1） 如果不包含 -，证明只输入目标名，从第一章找起
                TargetName = targetInfo.trim(" ", "left").trim(" ","right");
                for(var i = 0; i < chapList.length; i++){
                    searchedLocList = [];
                    searchForSpecificTarget(i + 1, TargetName);
                }
            }
        }
    
        function getChapIndex(chap){
            var findChaps = false;
            for(var i=0; i< chapList.length; i++) {
                if(chapList[i] == chap) {
                    findChaps = true;
                    return (i+1);
                }
            }
            if (!findChaps){
                // 如果没找到，发出警告
                console.error('## 找不到该目的地：' + chap + '！');
                return -1;
            }
    
        }
    
        async function clickButtonMapAsync(s) {
            clickButton(s);
            if (s == "client_map"){
                // 从场景切地图
                while (true) {
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 100);
                    });
                    if ($('.out_line')[0])
                        break;
                }
                await new Promise(function (resolve) {
                    setTimeout(resolve, 100);
                });
            }else if (s == "prev"){
                //从地图切场景
                while (true) {
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 100);
                    });
                    if (!$('.out_line')[0])
                        break;
                }
                await new Promise(function (resolve) {
                    setTimeout(resolve, 100);
                });
            }
        }
    
    
        async function isCurrentLocSearched(locID){
            // 判断loc位置，是否已经在列表中
            var descrip = $(".out")[0].textContent.split("这儿有：")[0]; // 获取描述
            var currentLocID  = descrip + locID;
            return searchedLocList.includes(currentLocID);
        }
    
        async function addCurrLoc2List(locID){
            // 判断loc位置，是否已经在列表中
            var descrip = $(".out")[0].textContent.split("这儿有：")[0]; // 获取描述
            var currentLocID  = descrip + locID;
            searchedLocList.push(currentLocID);
            // console.log(currentLocID);
            // console.log(searchedLocList);
        }
    
        async function searchTheMap(targetName) {
            await clickButtonMapAsync('client_map');
    
            var currentLocID = $("button[style*='room_in.png']")[0];
            if (currentLocID !== undefined) {
                currentLocID = currentLocID.parentNode.getAttribute('id');   // 获取在大地图中的位置：
            }else{
                currentLocID = "大地图中不存在该位置！";
            }
            await clickButtonMapAsync('prev');
    
            if (await isCurrentLocSearched(currentLocID)){
                // console.log("此位置已经搜索过：" + $(".cmd_click_room")[0].innerText);
                return;
            }
            if($(".cmd_click_room").length >0){
                console.log(getTimes() +'搜寻位置： ' +  $(".cmd_click_room")[0].innerText);
            }
            await addCurrLoc2List(currentLocID);
            // 判断该位置是否发现目标
            if (findObjectHere(targetName)){
                console.log("发现目标！");
                killQixia(targetName);
                throw new Error('发现目标！', 1);
            }
    
            // 分别判断8个方向
            if($(".cmd_click_exits_n")[0]){ // 北边
                await clickButtonAsync('go north');
                await searchTheMap(targetName);
                await clickButtonAsync('go south');
            }
            if($(".cmd_click_exits_s")[0]){ // 南
                await clickButtonAsync('go south');
                await  searchTheMap(targetName);
                await clickButtonAsync('go north');
            }
            if($(".cmd_click_exits_e")[0]){ // 东边
                await clickButtonAsync('go east');
                await  searchTheMap(targetName);
                await clickButtonAsync('go west');
            }
            if($(".cmd_click_exits_w")[0]){ // 西
                await clickButtonAsync('go west');
                await searchTheMap(targetName);
                await clickButtonAsync('go east');
            }
            if($(".cmd_click_exits_ne")[0]){ // 东北边
                await clickButtonAsync('go northeast');
                await searchTheMap(targetName);
                await clickButtonAsync('go southwest');
            }
    
            if($(".cmd_click_exits_se")[0]){ // 东南
                await clickButtonAsync('go southeast');
                await searchTheMap(targetName);
                await clickButtonAsync('go northwest');
            }
    
            if($(".cmd_click_exits_sw")[0]){ // 西南
                await clickButtonAsync('go southwest');
                await  searchTheMap(targetName);
                await clickButtonAsync('go northeast');
            }
    
            if($(".cmd_click_exits_nw")[0]){ // 西北
                await clickButtonAsync('go northwest');
                await  searchTheMap(targetName);
                await clickButtonAsync('go southeast');
            }
        }
        function findObjectHere(local_obj){
            var NPCList = $(".cmd_click3");  // 先查当前目录下NPC
            for (var i = 0; i < NPCList.length; i++){
                if(NPCList[i].innerText == "探查此地"){
                    eval(NPCList[i].getAttribute('onclick'));
                    console.log("探索一次地方！");
                }
                if (NPCList[i].innerText == local_obj || NPCList[i].innerText == (local_obj + "的尸体")){
                    return true;
                }
            }
            var localLocList = $("button[class*='cmd_click_']"); // 再查当前目录下所有地点按钮
            for (var i = 0; i < localLocList.length; i++){
                if (localLocList[i].innerText == local_obj){
                    // 走到那边，且返回true
                    if (localLocList[i].getAttribute('class') !== "cmd_click_room"){
                        eval(localLocList[i].getAttribute('onclick') ); // 朝这个方向走去
                    }
                    return true;
                }
            }
            return false;
        }
    
        async function searchForSpecificTarget(chapIndex, targetName) {
            try {
                searchName = targetName;
                console.log("开始在第 " + chapIndex + " 章搜寻目标 " + targetName);
                if (!continuedSearch){
                    // 返回主页
                    await clickButtonAsync('home');
                    while (true) {
                        await new Promise(function (resolve) {
                            setTimeout(resolve, 100);
                        });
                        if ($('.cmd_main_jh')[0])
                            break;
                    }
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 100);
                    });
    
                    await clickButtonAsync('jh ' + chapIndex);
                    // 如果在峨眉，或者嵩山，停止搜寻
                    if (chapIndex == 6 || chapIndex == 8 || chapIndex == 22){
                        console.error("在丐帮、峨眉山、嵩山，取消自动搜索！");
                        return;
                    }
                    while (true) {
                        await new Promise(function (resolve) {
                            setTimeout(resolve, 100);
                        });
                        if (!$('.cmd_main_jh')[0])
                            break;
                    }
                    await new Promise(function (resolve) {
                        setTimeout(resolve, 100);
                    });
    
                }
                await clickButtonMapAsync('client_map');
                await new Promise(function (resolve) {
                    setTimeout(resolve, 100);
                });
                await clickButtonMapAsync('prev');
                await searchTheMap(targetName);
            }
            catch (e) {
                console.log(e);
            }
            console.log("搜索完毕！");
            await clickButtonAsync('home');
        }
    
        // 找到青龙目标
        function killQixia(name){
            var btn = $('.cmd_click3');
            idArr = [];
            for(var i = 0;  i <btn.length ; i++){
                var txt = btn.eq(i).text();
    
                if(txt == name){
                    var npcText = btn.eq(i).attr('onclick');
                    var id = getId(npcText);
                    idArr.push(id);
                }
            }
            console.log(idArr);
            var maxId = idArr[0];
    
            // console.log(maxId);  //eren580108074
    
            // followNPC(maxId);
    
            killE(maxId);
            $('#btn5').trigger('click')    // 搜尸
            // setTimeout(function(){
            //     $('#btn4').trigger('click')    // 搜尸
            // },3*60*1000)
        }
    
        function followNPC(name){
            clickButton('follow_play '+name);
        }
    
        /**/
        async function findQLHPath(targetLocation){
            switch(targetLocation)
            {
                case '打铁铺子':
                    // 打铁铺子：饮风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 打铁铺子                                          # 王铁匠 # 或者 # 坏人 #
                    await clickButtonAsync('jh 1');       // 进入章节
                    await clickButtonAsync('go east');     // 广场
                    await clickButtonAsync('go north');   // 雪亭镇街道
                    await clickButtonAsync('go north');    // 雪亭镇街道
                    await clickButtonAsync('go west');      // 打铁铺子
                    break;
                case '桑邻药铺':
                    // 桑林药铺：迎风客栈 --> 广场 -->  雪亭镇街道 --> 雪亭镇街道 --> 雪亭镇街道 --> 桑林药铺                           # 杨掌柜 # 或者 # 坏人 #
                    await clickButtonAsync('jh 1');        // 进入章节
                    await clickButtonAsync('go east');      // 广场
                    await clickButtonAsync('go north');     // 雪亭镇街道
                    await clickButtonAsync('go north') ;    // 雪亭镇街道
                    await clickButtonAsync('go north');     // 雪亭镇街道
                    await clickButtonAsync('go west') ;    // 桑林药铺
                    break;
                case '书房':
                    // 书房：迎风客栈 --> 广场 -->  雪亭镇街道 --> 淳风武馆大门 --> 淳风武馆教练场 --> 淳风武馆大厅 -->  天井 --> 书房  # 柳绘心 #  或者 # 坏人 #
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
                    // 北大街： 龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 中心鼓楼 --> 中州街 --> 北大街              # 卖花姑娘 #  或者 # 坏人 #
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
                    // 钱庄：  龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 中心鼓楼 --> 中州街 --> 北大街--> 钱庄       # 刘守财 #  或者 # 坏人 #
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
                    // 绣楼：  龙门石窟 --> 南郊小路 -->  南门 --> 南大街 -->  洛川街 --> 铜锣巷 --> 桃花别院 --> 绣楼                 # 柳小花 #  或者 # 坏人 #
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
                    // 祠堂大厅：华山村村口 --> 青石街 -->  银杏广场 --> 祠堂大门            # 朱老伯 #  或者 # 坏人 #
                    await clickButtonAsync('jh 3');        // 进入章节
                    await clickButtonAsync('go south');      // 青石街
                    await clickButtonAsync('go south');     // 银杏广场
                    await clickButtonAsync('go west') ;    // 祠堂大门
                    break;
                case '厅堂':
                    // 厅堂：华山村村口 --> 青石街 -->  银杏广场 --> 祠堂大门 -->  厅堂      # 方寡妇 #  或者 # 坏人 #
                    await clickButtonAsync('jh 3');        // 进入章节
                    await clickButtonAsync('go south');      // 青石街
                    await clickButtonAsync('go south');     // 银杏广场
                    await clickButtonAsync('go west');     // 祠堂大门
                    await clickButtonAsync('go north');     // 厅堂
                    break;
                case '杂货铺':
                    // 杂货铺：华山村村口 --> 青石街 -->  银杏广场 --> 杂货铺                # 方老板 #  或者 # 坏人 #
                    await clickButtonAsync('jh 3');        // 进入章节
                    await clickButtonAsync('go south');      // 青石街
                    await clickButtonAsync('go south');     // 银杏广场
                    await clickButtonAsync('go east');     // 杂货铺
                    break;
                case '洛阳寺庙':
                    // 杂货铺：华山村村口 --> 青石街 -->  银杏广场 --> 杂货铺                # 方老板 #  或者 # 坏人 #
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
        var chapList = ['雪亭镇',  '洛阳',     '华山村', '华山',     '扬州',   '丐帮',    '乔阴县','峨眉山','恒山',  '武当山',
                        '晚月庄',   '水烟阁',   '少林寺', '唐门',     '青城山', '逍遥林', '开封',  '光明顶',   '全真教','古墓',
                        '白驼山',   '嵩山',     '寒梅庄', '泰山',     '大旗门', '大昭寺', '魔教',  '星宿海', '茅山',  '桃花岛',
                        '铁雪山庄', '慕容山庄','大理',    '断剑山庄','冰火岛',  '侠客岛', '绝情谷', '碧海山庄'];
    
        currentPos = 60;
        var delta = 30;
        var chapMapButton = [];
        var dis_right = "30";
    
        function makePlaceBtns(){
            currentPos = 60;
            delta = 30;
            dis_right = "30";
            for(var i = 0; i < chapList.length; i++){
                if(i < 19){
                    dis_right = "180";
                }else if (i == 19){
                    dis_right = "90";
                    currentPos = 60;
                }
                chapMapButton[i] = document.createElement('button');
                chapMapButton[i].innerText = chapList[i];
                chapMapButton[i].style.position = 'absolute';
                chapMapButton[i].style.right = dis_right + 'px';
                chapMapButton[i].style.top = currentPos + 'px';
                currentPos = currentPos + delta;
                chapMapButton[i].style.width = Base.buttonWidth;
                chapMapButton[i].style.height = Base.buttonHeight;
                chapMapButton[i].className = 'btn-add';
                document.body.appendChild(chapMapButton[i]);
                (function(i){chapMapButton[i].onclick = function () {
                    var cmd = "clickButton('jh " + (i+1) + "')";
                    eval(cmd);
                }
                            })(i);
            }
        }
    
        var QLHLocList = ['主页','状态','背包','技能','论剑','监控Q群','打铁铺子','桑邻药铺','书房','南市','北大街','钱庄','绣楼','祠堂大门','厅堂','杂货铺','洛阳寺庙'];
        var QLHchapMapButton = [];
        function makeOtherBtns(){
            currentPos = 60;
            delta = 30;
            for(var i = 0; i < QLHLocList.length; i++){
                dis_right = "270";
                QLHchapMapButton[i] = document.createElement('button');
                QLHchapMapButton[i].innerText = QLHLocList[i];
                QLHchapMapButton[i].style.position = 'absolute';
                QLHchapMapButton[i].style.right = dis_right + 'px';
                QLHchapMapButton[i].style.top = currentPos + 'px';
                currentPos = currentPos + delta;
                QLHchapMapButton[i].style.width = Base.buttonWidth;
                QLHchapMapButton[i].style.height = Base.buttonHeight;
                QLHchapMapButton[i].className = 'btn-add';
                if(QLHLocList[i] == "监控Q群"){
                    QLHchapMapButton[i].id = 'btn-watchQQ';
                }
                document.body.appendChild(QLHchapMapButton[i]);
                if(QLHLocList[i] == "监控Q群"){
                    currentPos = currentPos + 60;
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
                    }else if(QLHLocList[i] == "监控Q群"){
                        jianKong(this);
                    }else if(QLHLocList[i] == "论剑"){
                        lunJian(this);
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
    
            getRewardsButton = document.createElement('button');
            getRewardsButton.innerText = '开领奖';
            getRewardsButton.style.position = 'absolute';
            getRewardsButton.style.right = '270px';
            getRewardsButton.style.top = '240px';
            currentPos = Base.currentPos + Base.delta;
            getRewardsButton.style.width = Base.buttonWidth;
            getRewardsButton.style.height = Base.buttonHeight;
            getRewardsButton.className = 'btn-add';
            document.body.appendChild(getRewardsButton);
            getRewardsButton.addEventListener('click', getRewardsFunc);
    
            digTreasureButton = document.createElement('button');
            digTreasureButton.innerText = '挖宝藏';
            digTreasureButton.style.position = 'absolute';
            digTreasureButton.style.right = '180px';
            digTreasureButton.style.top = '30px';
            currentPos = Base.delta;
            digTreasureButton.style.width = Base.buttonWidth;
            digTreasureButton.style.height = Base.buttonHeight;
            digTreasureButton.className = 'btn-add';
            document.body.appendChild(digTreasureButton);
            digTreasureButton.addEventListener('click', WabaoFunc);
    
            userMedecineButton = document.createElement('button');
            userMedecineButton.innerText = '吃补药';
            userMedecineButton.style.position = 'absolute';
            userMedecineButton.style.right = '90px';
            userMedecineButton.style.top = '30px';
            currentPos = Base.delta;
            userMedecineButton.style.width = Base.buttonWidth;
            userMedecineButton.style.height = Base.buttonHeight;
            userMedecineButton.id = 'btnS';
            userMedecineButton.className = 'btn-add';
            document.body.appendChild(userMedecineButton);
            userMedecineButton.addEventListener('click', userMedecineFunc);
    
            useSkillsButton = document.createElement('button');
            useSkillsButton.innerText = '出招';
            useSkillsButton.style.position = 'absolute';
            useSkillsButton.style.right = '450px';
            useSkillsButton.style.top = '544px';
            currentPos = Base.delta;
            useSkillsButton.style.width = Base.buttonWidth;
            useSkillsButton.style.height = '40px';
            useSkillsButton.className = 'btn-add';
            useSkillsButton.id = 'btn-chuzhao';
            document.body.appendChild(useSkillsButton);
            useSkillsButton.addEventListener('click', useSkillsFunc);
    
            randomRunButton = document.createElement('button');
            randomRunButton.innerText = '随机跑';
            randomRunButton.style.position = 'absolute';
            randomRunButton.style.right = '450px';
            randomRunButton.style.top = '600px';
            currentPos = Base.delta;
            randomRunButton.style.width = Base.buttonWidth;
            randomRunButton.style.height = Base.buttonHeight;
            randomRunButton.className = 'btn-add';
            document.body.appendChild(randomRunButton);
            randomRunButton.addEventListener('click', randomRunButtonFunc);
    
            findSpecTargetButton = document.createElement('button');
            findSpecTargetButton.innerText = '寻目标';
            findSpecTargetButton.style.position = 'absolute';
            findSpecTargetButton.style.right = '270px';
            findSpecTargetButton.style.top ='30px';
            findSpecTargetButton.style.width = Base.buttonWidth;
            findSpecTargetButton.style.height = Base.buttonHeight;
            findSpecTargetButton.className = 'btn-add';
            document.body.appendChild(findSpecTargetButton);
            findSpecTargetButton.addEventListener('click', findSpecargetFunc);
    
            bixueTishi = document.createElement('span');
            bixueTishi.style.position = 'absolute';
            bixueTishi.style.left = '2px';
            bixueTishi.innerText = '';
            bixueTishi.style.color = 'red';
            bixueTishi.style.fontSize = '13px';
            bixueTishi.style.top ='53px';
            bixueTishi.className = 'bixueText';
            document.body.appendChild(bixueTishi);
        }
    
        // 监控Q群
        function jianKong(obj){
            // console.log(obj);
            var Dom = $(obj);
            var text = Dom.html();
            if(text == '监控Q群'){
                Dom.html('停止监控');
                webSocketConnet();
            }else{
                Dom.html('监控Q群');
                webSocketClose();
            }
    
        }
        // 论剑
        var lunjianInterval = null;
        function lunJian(obj){
            var Dom = $(obj);
            var text = Dom.html();
            if(text == '论剑'){
                Dom.html('停止论剑');
                lunjianInterval = setInterval(function(){
                    doLunjianSkills();
                },600);
            }else{
                Dom.html('论剑');
                clearInterval(lunjianInterval);
            }
        }
        var lunjianUseDog = false;
        // 论剑释放技能
        function doLunjianSkills(){
    
            if($('#skill_1').length == 0){
                lunjianUseDog = true;
                return;
            }
            // var qiNumber = $('#combat_xdz_text').text().split('/')[0];
            var qiNumber = gSocketMsg.get_xdz();
            if(qiNumber < 3){
                return;
            }
    
            var skillArr = Base.mySkillLists.split('；');
            if(hasDog().length >0 && lunjianUseDog){
                lunjianUseDog = false;
            }
    
            if(lunjianUseDog){
                skillArr = ['茅山道术','天师灭神剑'];
                var skillIdA = ['1','2','3','4','5','6'];
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
            }else{
                var targetName = '九四浪,花飞,东方末明,七武器拳头,魔泣神君,罗将神,爱尔奎特,邱鸣,慕云乐,皮宪泰,邵为浩,稀饭无心,轮回之境,何为江湖';
                var qiText = gSocketMsg.get_xdz();
                if(qiText > 3){
                    doFightAll1(targetName);
                }
            }
            if(qiNumber >9){
                doFightAll();
            }
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
        // 获取对战方的名字
        function getVsName(){
            var c = g_obj_map.get("msg_vs_info"), 
            a = gSocketMsg.get_vs_type(),
            nameArr = [];
            a = 1 == a ? 2 : 1;
            var d, e, f, g, h, j, l = gSocketMsg.get_vs_max_vs();
    
            for(var d = 1; d <= l; d++){
                var b = '';
                1 < d && 0 == (d - 1) % 4 && (b += "</tr><tr>"),
                c.get("vs" + a + "_pos" + d) ? (e = c.get("vs" + a + "_name" + d),
                b += e) : b = "";
                if(b != ''){
                    nameArr.push(g_simul_efun.replaceControlCharBlank(b));
                }
            }
            return nameArr;
        }
    
        function getPozhaoNpcName(){
            var correctNameArr = [];
            for(var k = 0 ; k <killTargetArr.length; k ++){
                var name = killTargetArr[k];
                var vsNameArr = getVsName();
                if(vsNameArr.length >0){
                    for(var i = 0; i< vsNameArr.length; i++){
                        var vsName = vsNameArr[i];
                        if(vsName.indexOf(name) != '-1'){
                            correctNameArr.push(vsName);
                        }
                    }
                }else{
                    return killTargetArr;
                }
            }
            return correctNameArr;
        }
        var correctNameArr = [];
        // function GenZhaoView(){
        //     this.dispatchMessage=function(b){
        //         // console.log(b);
        //         var type = b.get("type"), subType = b.get("subtype");
        //         if (type=="vs"&&subType=="text"){
        //             var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
        //             if(genZhaoMode == 1){
        //                 if(msg !==""&&(msg.indexOf("--破军棍诀--")>-1)){
        //                     var qiText = gSocketMsg.get_xdz();
        //                     if(qiText > 3){
        //                         doKillSet();
        //                     }
        //                 }
    
        //                 var hitDesList = ['刺','斩','劈','扫','射','扑','击','取','往','向','奔','朝','指','点','取','卷'];
        //                 for(var i = 0; i<hitDesList.length; i++){
        //                     var hitText = hitDesList[i];
        //                     if(msg.indexOf('铁锁横江') == '-1' && msg.indexOf('金刚不坏功力') == '-1' && msg.indexOf('太极神功') == '-1' && msg.indexOf('你') == '-1'){
        //                         var targetNameArr  = getPozhaoNpcName();
        //                         for(var k = 0 ; k <targetNameArr.length; k ++){
        //                             var keyWord = hitText + targetNameArr[k];
        //                             if(msg.indexOf(keyWord) != '-1'){
        //                                 // console.log(keyWord);
        //                                 // console.log(msg);
        //                                 doKillSet();
        //                                 return
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        
        //         }
        //     }
        // }
    
        // var genZhaoView = new GenZhaoView;
    
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
    
        // 挖宝
        function WabaoFunc(){
           go('cangbaotu_op1', 1)
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
    
                    // console.log("触发器: " + this.regexp + "触发了");
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
    
        var jh = function(w) {
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
    
    
                go("jh " + w, 0);
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
    
            triggers.newTrigger(/似乎以下地方藏有宝物(.*)/, function(m) {
                m = m[1].split(/\d+/);
                var bl_found = false;
                for (i = 0; i < m.length; i++) {
                    var a = m[i];
                    // console.log(a);
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
                    // if (/这里就是背阴巷了，站在巷口可以万剑阴暗潮湿的窄巷，这里聚集着洛阳的地痞流氓，寻常人不敢近前。/.test(a)) {
                    //     jh('ly');
                    //     go('n;n;n;n;w;event_1_98995501;dig go');
                    //     bl_found = true;
                    //     break;
                    // }
                    // if (/黑暗的街道，几个地痞无赖正慵懒的躺在一旁。/.test(a)) {
                    //     jh('ly');
                    //     go('n;n;n;n;w;event_1_98995501;n;dig go;n;dig go');
                    //     bl_found = true;
                    //     break;
                    // }
                    // if (/这是一家酒肆，洛阳地痞头目甄大海正坐在里面小酌。/.test(a)) {
                    //     jh('ly');
                    //     go('n;n;n;n;w;event_1_98995501;n;n;e;dig go');
                    //     bl_found = true;
                    //     break;
                    // }
                    // if (/院落里杂草丛生，东面的葡萄架早已枯萎。/.test(a)) {
                    //     jh('ly');
                    //     go('n;n;n;n;w;event_1_98995501;n;w;dig go');
                    //     bl_found = true;
                    //     break;
                    // }
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
                    // if (/这儿是牡丹园内的一座小亭子，布置得十分雅致。/.test(a)) {
                    //     jh('ly');
                    //     go('n;n;n;n;n;w;s;luoyang111_op1;dig go');
                    //     bl_found = true;
                    //     break;
                    // }
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
                    // if (/ 这个城楼上的密室显然是守城军士秘密建造的，却不知有何用途。/.test(a)) {
                    //     jh('ly');
                    //     go('n;n;n;n;n;n;n;n;w;luoyang14_op1;dig go');
                    //     bl_found = true;
                    //     break;
                    // }
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
    
    
        // 大昭寺壁画
        function MianBiFunc(){
            console.log(getTimes() +'大昭壁画');
            go('jh 26;w;w;n;w;w;w;n;n;e;event_1_12853448'); //大昭壁画
        }
        
        window.onerror = function() {
            return true
        }
        //-------------------------------------------------------------------------------------------------
    
    // 破招
    function kezhi(zhaoshi){ //1是剑法 2是拳法 3是刀法 4是暗器 5棍子 6枪
            var chuzhao=0; //1剑法 2拳法 3刀法 4暗器 5棍子 6枪
            var skillname="";
            var skillbutton=[];
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
    
            if (zhaoshi==1){ //找自己的技能里有没有剑法
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="九溪断月枪" || skillbutton[i-1]=="燎原百破"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }

                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="九天龙吟剑法"||skillbutton[i-1]=="覆雨剑法"||skillbutton[i-1]=="织冰剑法"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="破军棍诀" || skillbutton[i-1]=="千影百伤棍"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="翻云刀法"||skillbutton[i-1]=="雪饮狂刀"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="飞刀绝技"||skillbutton[i-1]=="孔雀翎"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="排云掌法"||skillbutton[i-1]=="如来神掌"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                //还他妈没有？你是不是没有武墓或者没有江湖绝学啊？那你破个屁招啊
            }else if (zhaoshi==2){  //找自己的技能里有没有拳法
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="九溪断月枪" || skillbutton[i-1]=="燎原百破"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="排云掌法"||skillbutton[i-1]=="如来神掌"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="破军棍诀" || skillbutton[i-1]=="千影百伤棍"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="九天龙吟剑法"||skillbutton[i-1]=="覆雨剑法"||skillbutton[i-1]=="织冰剑法"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="飞刀绝技"||skillbutton[i-1]=="孔雀翎"){
    
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="翻云刀法"||skillbutton[i-1]=="雪饮狂刀"){
    
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
            }else if (zhaoshi==3){
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="翻云刀法"||skillbutton[i-1]=="雪饮狂刀"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="破军棍诀" || skillbutton[i-1]=="千影百伤棍"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="九溪断月枪" || skillbutton[i-1]=="燎原百破"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="排云掌法"||skillbutton[i-1]=="如来神掌"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="飞刀绝技"||skillbutton[i-1]=="孔雀翎"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
    
                }
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="九天龙吟剑法"||skillbutton[i-1]=="覆雨剑法"||skillbutton[i-1]=="织冰剑法"){
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
                
            }else if (zhaoshi==4){ //暗器绝学，无所谓什么招。找到一个绝学就上。
                for (var i=1;i<=4;i++){
                    if (skillbutton[i-1]=="翻云刀法"||skillbutton[i-1]=="雪饮狂刀"){
    
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                    for (var i=1;i<=4;i++){
                        if (skillbutton[i-1]=="破军棍诀" || skillbutton[i-1]=="千影百伤棍"){
                            skillname=skillbutton[i-1];
                            lianzhen(skillname,i);
                            return;
                        }
                    }
                    for (var i=1;i<=4;i++){
                        if (skillbutton[i-1]=="九溪断月枪" || skillbutton[i-1]=="燎原百破"){
                            skillname=skillbutton[i-1];
                            lianzhen(skillname,i);
                            return;
                        }
                    }
                    if (skillbutton[i-1]=="九天龙吟剑法"||skillbutton[i-1]=="覆雨剑法"||skillbutton[i-1]=="织冰剑法"){
    
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                    if (skillbutton[i-1]=="飞刀绝技"||skillbutton[i-1]=="孔雀翎"){
    
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                    if (skillbutton[i-1]=="排云掌法"||skillbutton[i-1]=="如来神掌"){
    
                        skillname=skillbutton[i-1];
                        lianzhen(skillname,i);
                        return;
                    }
                }
            }
        }
        function checkzhen(skillname,skillbutton){//按照按钮编号返回数值 0就是没有可以成阵的按钮
            // console.log(skillname+"是我刚刚用的");
            if (skillname=="九天龙吟剑法"){
                if (skillbutton.indexOf("排云掌法")>=0)
                    return skillbutton.indexOf("排云掌法");
                if (skillbutton.indexOf("雪饮狂刀")>=0)
                    return skillbutton.indexOf("雪饮狂刀");
                return -1;
            }
            if (skillname=="排云掌法"){
                if (skillbutton.indexOf("九天龙吟剑法")>=0)
                    return skillbutton.indexOf("九天龙吟剑法");
                if (skillbutton.indexOf("雪饮狂刀")>=0)
                    return skillbutton.indexOf("雪饮狂刀");
                return -1;
            }
                if (skillname=="雪饮狂刀"){
                if (skillbutton.indexOf("排云掌法")>=0)
                    return skillbutton.indexOf("排云掌法");
                if (skillbutton.indexOf("九天龙吟剑法")>=0)
                    return skillbutton.indexOf("九天龙吟剑法");
                return -1;
            }
                if (skillname=="翻云刀法"){
                if (skillbutton.indexOf("覆雨剑法")>=0)
                    return skillbutton.indexOf("覆雨剑法");
                if (skillbutton.indexOf("飞刀绝技")>=0)
                    return skillbutton.indexOf("飞刀绝技");
                return -1;
            }
                if (skillname=="覆雨剑法"){
                if (skillbutton.indexOf("如来神掌")>=0)
                    return skillbutton.indexOf("如来神掌");
                if (skillbutton.indexOf("翻云刀法")>=0)
                    return skillbutton.indexOf("翻云刀法");
                return -1;
            }
                if (skillname=="飞刀绝技"){
                if (skillbutton.indexOf("翻云刀法")>=0)
                    return skillbutton.indexOf("翻云刀法");
                if (skillbutton.indexOf("织冰剑法")>=0)
                    return skillbutton.indexOf("织冰剑法");
                return -1;
            }
                if (skillname=="织冰剑法"){
                if (skillbutton.indexOf("飞刀绝技")>=0)
                    return skillbutton.indexOf("飞刀绝技");
                if (skillbutton.indexOf("孔雀翎")>=0)
                    return skillbutton.indexOf("孔雀翎");
                return -1;
            }
                if (skillname=="孔雀翎"){
                if (skillbutton.indexOf("织冰剑法")>=0)
                    return skillbutton.indexOf("织冰剑法");
                if (skillbutton.indexOf("如来神掌")>=0)
                    return skillbutton.indexOf("如来神掌");
                return -1;
            }
                if (skillname=="如来神掌"){
                if (skillbutton.indexOf("孔雀翎")>=0)
                    return skillbutton.indexOf("孔雀翎");
                if (skillbutton.indexOf("覆雨剑法")>=0)
                    return skillbutton.indexOf("覆雨剑法");
                return -1;
            }
            if (skillname=="破军棍诀"){
                if (skillbutton.indexOf("翻云刀法")>=0)
                    return skillbutton.indexOf("翻云刀法");
                if (skillbutton.indexOf("飞刀绝技")>=0)
                    return skillbutton.indexOf("飞刀绝技");
                if (skillbutton.indexOf("如来神掌")>=0)
                    return skillbutton.indexOf("如来神掌");    
                return -1;
            }
            if (skillname=="九溪断月枪"){
                if (skillbutton.indexOf("如来神掌")>=0)
                    return skillbutton.indexOf("如来神掌");    
                if (skillbutton.indexOf("孔雀翎")>=0)
                    return skillbutton.indexOf("孔雀翎");    
                return -1;
            }
        }
        function lianzhen(skillname,i){//连阵 连阵毕竟是危险的事情，那么只有在几种情况下。第一 对面敌人数目只有一人。 第二 我的气大于等于6 敌人小于等于3 这样我出阵 大不了敌人破招而已。
            var enemycounter=0;
            // console.log("*目前我有气"+gSocketMsg.get_xdz() + '*');
            for (i=1;i<=8;i++){
                if (g_obj_map.get("msg_vs_info").get("vs"+obside+"_name"+i)!=undefined){
                    enemycounter++;
                }
            }
            var skillbutton=[];
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
            if (g_obj_map.get("skill_button5")!=undefined)
                skillbutton[4]=ansi_up.ansi_to_text(g_obj_map.get("skill_button5").get("name"));
            else
            if (g_obj_map.get("skill_button6")!=undefined)
                skillbutton[5]=ansi_up.ansi_to_text(g_obj_map.get("skill_button6").get("name"));
            else
                skillbutton[3]=0;
            skillname=ansi_up.ansi_to_text(skillname);
            // console.log("使用按钮"+i);
            console.log("出招"+skillname);
            var enemyxdz=0;
            if (enemycounter!=1){
                for (var i=1;i<=4;i++){
                    if (g_obj_map.get("msg_vs_info")!=undefined&&g_obj_map.get("msg_vs_info").get("vs"+obside+"_xdz"+i)!=undefined){
                        enemyxdz=g_obj_map.get("msg_vs_info").get("vs"+obside+"_xdz"+i);
                        break;
                    }
                }
            }
    
            clickButton('playskill '+(skillbutton.indexOf(skillname)+1),0); //无论是谁，我先反击一下
            var xdz=gSocketMsg.get_xdz(); //获取我当时的行动值
            //重新获取我们按钮的布局
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
            if (g_obj_map.get("skill_button5")!=undefined)
                skillbutton[4]=ansi_up.ansi_to_text(g_obj_map.get("skill_button5").get("name"));
            else
            if (g_obj_map.get("skill_button6")!=undefined)
                skillbutton[5]=ansi_up.ansi_to_text(g_obj_map.get("skill_button6").get("name"));
            else
                skillbutton[3]=0;
            var checkbutton=-1;
            checkbutton=checkzhen(skillname,skillbutton);
            if (checkbutton>=0){//enemyxdz<=3
                if (xdz>=6){
                    // console.log("连阵按钮"+(checkbutton+1));
                    // console.log("我要出的绝学是"+g_obj_map.get("skill_button"+(checkbutton+1)).get("name"));
                    clickButton('playskill '+(checkbutton+1),0);
                }
            }
        }
    
        function fighttype(msg){
            var sword,cuff,blade;//判断哪个值大，用来判断最后一个阵法出现的位置
            sword=msg.lastIndexOf("剑");
            cuff=msg.lastIndexOf("掌");
            if (msg.lastIndexOf("拳")>cuff){
                cuff=msg.lastIndexOf("拳");
            }
            blade=msg.lastIndexOf("刀");
            if (sword>cuff&&sword>blade){
                return 2
            }else if (cuff>sword&&cuff>blade){
                return 3;
            }else if (blade>sword&&blade>cuff){
                return 1;
            }else{
                return 4;
            }
        }
    
        var obside=0;
        function Combat(){
            this.dispatchMessage=function(b){
                var type = b.get("type"), subType = b.get("subtype");
                if (type == "vs" && subType == "text") {
    
                    //要找到我在哪边。。。。。这个比较恶心。
                    var myname=ansi_up.ansi_to_text(g_obj_map.get("msg_attrs").get("name"));
    
                    for (var i=0;i<4;i++){
                        if (g_obj_map.get("msg_vs_info")!=undefined){
                            if(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1))!=undefined){
                                if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs2_name"+(i+1)))==myname){
                                    obside=1;
                                }
                            }
                        }
                        if (g_obj_map.get("msg_vs_info")!=undefined){
                            if(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1))!=undefined){
                                if (ansi_up.ansi_to_text(g_obj_map.get("msg_vs_info").get("vs1_name"+(i+1)))==myname){
                                    obside=2;
                                }
                            }
                        }
                    }
                }
            }
        }
        // var combat = new Combat;
    
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
            // await clickButtonAsync('items use snow_qiannianlingzhi');
            await clickButtonAsync('items use snow_wannianlingzhi');
        }
    
        // 面板触发
        // window.game = this;
    
        window.attach = function() {
            var oldWriteToScreen = window.writeToScreen;
            window.writeToScreen = function(a, e, f, g) {
                oldWriteToScreen(a, e, f, g);
                a = a.replace(/<[^>]*>/g, "");
                triggers.trigger(a);
            };
    
            webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;
    
            gSocketMsg.dispatchMessage = function(b) {
                this.old(b);
                qlMon.dispatchMessage(b);
    
                // if (genZhaoMode==1){
                //     genZhaoView.dispatchMessage(b);
                // }
    
                if (duiZhaoMode==1 || genZhaoMode == 1 || daLouMode == 1){
                    zhanDouView.dispatchMessage(b);
                }
                // combat.dispatchMessage(b);
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
    
        // attach();
        // 开启本地服务
        var webSocket;
    
        function webSocketClose(){
            webSocket.close();
        }
        function webSocketConnet(){
            webSocket = new WebSocket("ws://localhost:25303");
    
            webSocket.onerror = function(event) {
                console.log(event)
            };
    
            webSocket.onopen = function(event) {
                console.log(event)
            };
    
            webSocket.onclose = function(event) {
                console.log(event)
            };
    
            webSocket.onmessage = function(event) {
                onMessage(event)
            };
        }
    
        function onMessage(event) {
    
            var obj = eval('(' + decodeURI(event.data) + ')');
            if(obj.error != 0){
                return;
            }
            var name = '';
            if(obj.fromGroup == '465355403'){
                var txt = obj.msg;
                if(txt.indexOf('开帮派副本') != '-1'){
                    openBangFu();
                }
    
                if(obj.fromQQ == '35994480'){
                    if(txt.indexOf('开帮派碎片') != '-1'){
                        openBangSuiPian();
                    }
                }
            }
            //console.log(obj);
            if(obj.fromGroup != '291849393'){
                return;
            }else{
                var txt = obj.msg;
    
                if(isKuaFu()){
                    if(txt.indexOf('跨服时空') != '-1'){
                        getKuaPlace(txt);
                    }
                    return;
                }else{
                    // 出游侠
                    var qu = Base.correctQu();
                    console.log(qu);
                    if(txt.indexOf('出游侠') != '-1'){
                        if(txt.indexOf(qu) != '-1'){
                            goQixia(txt);
                        }
    
                    }
                    if(obj.fromQQ == '35994480'){
                        if(txt.indexOf('do签到') != '-1'){
                            CheckIn();
                        }
                        if(txt.indexOf('doVip签到') != '-1'){
                            CheckInFunc();
                        }
                        if(txt.indexOf('do刷碎片') != '-1'){
                            killDrunkManFunc();
                        }
                        if(txt.indexOf('do存东西') != '-1'){
                            putStore();
                        }
                        if(txt.indexOf('do其他') != '-1'){
                            CheckInFunc1();
                        }
                        if(txt.indexOf('do冰月') != '-1'){
                            getBingyue();
                        }
                    }
                    
                }
            }
    
        }
    
        function goQixia(txt){
            txt = txt.split(',');
            findSpecTagerInfo = txt[1];
            autoFindSpecargetFunc();
        }
    
    
        var hasDoOnece = false;
        var hasSendMsg = false;
        // 到时做XXX
        function doOnTime(){
            var hours = getHours();
            var week = getWeek();
            
            // 1、6、15 点
            if(hours == 1 || hours == 6 || hours == 8 || hours == 15 ){
                hasDoOnece = false;
            }
            // 0点 成长
            if(hours == 0){
                go('vip chengzhang_go');   // 领取成长奖励
            }
    
            // 1点 签到 或双儿
            if(hours == 1){
                $('span:contains(你今天试剑次数已达限额)').html('');
                mijingNum = 0;
                qixiaDone = false;
                CheckIn();
            }
    
            // 2点双儿
            if(hours == 2){
                clickShuangEr();
            }
            // 3点冰月或签到
            if(hours == 3){
                if(isBigId()){
                    getBingyue();
                }else{
                    CheckIn();
                }
            }
    
            // 4点VIP其他（正邪、逃犯、打榜）
            if(hours == 4){
                if(isBigId()){
                    CheckInFunc1();
                }else{
                    clickShuangEr();
                }
            }
            // 6点 签到
            if(hours == 6){
                openBangFu();
                CheckIn();
            }
    
            // 7点刷碎片
            if(hours == 7){
               doOnce(2);
            }
    
            // 8点试剑
            if(hours == 8){
                if(isSmallId() || isSixId() || (Base.getCorrectText('4254240') && Base.correctQu() == '37')){
                    go('clan fb go_saodang shenshousenlin');
                }
                if($('#btno3').html() == "试剑"){
                    $('#btno3').trigger('click');
                }
            }
            // 9 冰火岛 或重新获取奇侠列表
            if(hours == 9){
                if(Base.getCorrectText('4316804')){
                    getXuanTie();
                }else{
                    doOnce(6);
                }
            }
            // 10 撩奇侠
            if(hours == 10 || hours == 11){
                if(isSmallId()){
                    AskOnTime();
                }else if(isLittleId()){
                    GiveMoneyOnTime();
                }
            }
    
            // 13点 14点突破
            if(hours == 13 || hours == 14){
                if(Base.getCorrectText('4240258')  || Base.getCorrectText('3594649')){
                    
                }else if(Base.getCorrectText('4253282')){
                    tupoSkills1();
                }else{
                    tupoSkills2();
                }
            }
    
            // 15点领取奖励
            if(hours == 15){
                if(isBigId() || (Base.getCorrectText('4254240') && Base.correctQu() == '38')){
                    if(Base.getCorrectText('4254240') && Base.correctQu() == '37'){
                        console.log('零号出击！')
                    }else{
                        CheckInFunc();
                    }
                }
            }
    
            // 16点 答题
            if(hours == 16){
                doOnce(4);
            }
    
            // 17点小号与奇侠聊天
            if(hours == 17){
                if(!isBigId()){
                    talkSelectQiXia();
                }
            }
            // 18点领奖励
            if(hours == 18){
                doReplay();
            }
            //baoguoZhengliFunc

            // 19点整理包袱
            if(hours == 19){
                baoguoZhengliFunc();
            }
    
            // 21 回帮派 打坐
            if(hours == 21){
                if(getWeek() == '3'){
                    go('swords get_drop go');   // 领取论剑奖励
                }
                go('clan scene');
                if(Base.getCorrectText('4253282') && !hasSendMsg){
                    go('clan open_double go');
                    if(week == '2' || week == '4' || week == '5' || week == '0'){
                        go('clan open_triple go');
                    }
                    hasSendMsg = true;
                    var json_msg = '重要的事情说三遍，帮派开双倍了';
                    var msg = '[CQ:at,qq=35994480] '+json_msg;
                    var json_str = '{"act":"101","groupid":"465355403","msg": "'+msg+'"}';
                    if(isOnline){
                        webSocket.send(json_str);
                        webSocket.send(json_str);
                        webSocket.send(json_str);
                    }
                    
                }

                if(Base.getCorrectText('6759436')){
                    go('clan open_double go');
                }
            }
    
        }
    
        // 挂机号签到
        function doOnTimeGuaJi(){
            var hours = getHours();
            var week = getWeek();
    
            // 1点签到
            if(hours == 1  && week == 1){
                CheckIn();
            }
            // 2点试剑
            if(hours == 2 ){
               if($('#btno3').html() == "试剑"){
                    $('#btno3').trigger('click');
                }
            }
            // 3点双儿
            if(hours == 3){
                clickShuangEr();
            }
            // 6点签到
            if(hours == 6){
                CheckIn();
            }
            // 13点签到
            if(hours == 13){
                if(Base.getCorrectText('6965572')){
                    go('clan fb go_saodang shenshousenlin');
                }
                CheckIn();
            }
        }
        // 每天执行一次
        function doOnce(type){
    
            if(!hasDoOnece){
                hasDoOnece = true;
                if(type == '1'){
                    fishingFirstFunc();     // 钓鱼
                }
                if(type == '2'){
                    killDrunkManFunc();     // 刷碎片
                }
                if(type == '3'){
                    newGetXiaKe();          // 侠客岛
                }
                if(type == '4'){
                    $('#btno4').trigger('click')    // 答题
                }
                if(type == '6'){
                    GetNewQiXiaList(); // 生成奇侠列表
                }
            }
    
            if(type == '5'){            // 签到
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
    
        async function tupoSkills1(){
            await clickButtonAsync('tupo go,lybp');
            // await clickButtonAsync('tupo go,zglq');
        }
    
        async function tupoSkills2(){
            await clickButtonAsync('tupo go,dzxinmojing');
            await clickButtonAsync('tupo go,sszaohuagong');
            await clickButtonAsync('tupo go,fuyu-sword');
            await clickButtonAsync('tupo go,paiyun-zhang');
            await clickButtonAsync('tupo go,yijinjing');
            await clickButtonAsync('tupo go,bahuang-gong');
            await clickButtonAsync('tupo go,liumai-shenjian');
            await clickButtonAsync('tupo go,tulong-blade');
            await clickButtonAsync('tupo go,qiankun-danuoyi');
            await clickButtonAsync('tupo go,wuxiang-jingang-quan');
            await clickButtonAsync('tupo go,jiumiaofts');
            await clickButtonAsync('tupo go,yyhuanxubu');
        }
    
        async function openBangFu(){
            if(isBigBixue() || Base.getCorrectText('6759436')){
                await clickButtonAsync('clan fb open shenshousenlin');
                await clickButtonAsync('clan fb open daxuemangongdao');
                await clickButtonAsync('clan fb open longwulianmoge');
            }
        }
        async function openBangSuiPian(){
            await clickButtonAsync('clan bzmt cancel go');
            await clickButtonAsync('clan bzmt select go 1');
        }
        function isLittleId(){
            var littleIdArr = ['4240258','4316804','4259178','4254240','6759436','6759488','6759498','6759458','6759492','6759497','7245058','7245076','7245061','7245031','7245082','7245153','7245033','7245124','7245468','7245483'];
            var isLittle = false;
            for(var i = 0; i <littleIdArr.length; i++){
                if(Base.getCorrectText(littleIdArr[i])){
                    isLittle = true;
                    return true;
                }
            }
            return isLittle;
        }
        function isSmallId(){
            var littleIdArr = ['7245058','7245076','7245061','7245031','7245082','7245153','7245033','7245124','7245468','7245483'];
            var isLittle = false;
            for(var i = 0; i <littleIdArr.length; i++){
                if(Base.getCorrectText(littleIdArr[i])){
                    isLittle = true;
                    return true;
                }
            }
            return isLittle;
        }
        function isSixId(){
            var littleIdArr = ['6759436','6759488','6759498','6759458','6759492','6759497'];
            var isLittle = false;
            for(var i = 0; i <littleIdArr.length; i++){
                if(Base.getCorrectText(littleIdArr[i])){
                    isLittle = true;
                    return true;
                }
            }
            return isLittle;
        }
        function isBigId(){
            var bigIdArr = ['4253282','4238943','4240258','3594649','4219507','4254240','4213224'];
            var isBig = false;
            for(var i = 0; i <bigIdArr.length; i++){
                if(Base.getCorrectText(bigIdArr[i])){
                    isBig = true;
                    return true;
                }
            }
            return isBig;
        }
    
        function isBigBixue(){
            var bigIdArr = ['4253282'];
            var isBig = false;
            for(var i = 0; i <bigIdArr.length; i++){
                if(Base.getCorrectText(bigIdArr[i])){
                    isBig = true;
                    return true;
                }
            }
            return isBig;
        }

        function isBangPaiStore(){
            var bigIdArr = ['4253282','4316804','4238943','4219507','5515016'];
            var isBig = false;
            for(var i = 0; i <bigIdArr.length; i++){
                if(Base.getCorrectText(bigIdArr[i])){
                    isBig = true;
                    return true;
                }
            }
            return isBig;
        }
    
        function isSelfId(){
            var bigIdArr = ['4253282','4316804'];
            var isBig = false;
            for(var i = 0; i <bigIdArr.length; i++){
                if(Base.getCorrectText(bigIdArr[i])){
                    isBig = true;
                    return true;
                }
            }
            return isBig;
        }

        function isGuaJiId(){
            var bigIdArr = ['6965572','6984251'];
            var isBig = false;
            for(var i = 0; i <bigIdArr.length; i++){
                if(Base.getCorrectText(bigIdArr[i])){
                    isBig = true;
                    return true;
                }
            }
            return isBig;
        }
    
        function GiveMoneyOnTime(){
            // o18
            var btn = $('#btno18');
            btn.trigger('click');
        }
        function AskOnTime(){
            // o23
            var btn = $('#btno23');
            btn.trigger('click');
        }
        // Your code here...
    
        //去位置
        function getKuaPlace(txt){
            var step = getPlace2(txt);
            findKuaTaoFan(step);
        }
        // 找打坏人
        async function findKuaTaoFan(step){
            await goTaoFanPlace(step);
            await new Promise(function (resolve) {
                setTimeout(resolve, 2000);
            });
            // goNpcPlace(taoPlaceStep);
            // javascript:clickButton('golook_room');
            var btn = $('.cmd_click3');
            idArr = [];
            badNameArr = ['[36-40区]段老大','段老大','二娘','岳老三','云老四','剧盗','恶棍','流寇'];
            if(!killBadSwitch){
                badNameArr = ['[36-40区]无一','无一','铁二','追三','冷四','黄衣捕快','红衣捕快','锦衣捕快'];
            }
    
            for(var j = 0; j <badNameArr.length; j++){
                var badName = badNameArr[j];
    
                for(var i =0;  i <= btn.length ; i++){
                    var txt = btn.eq(i).text();
                    if(txt == badName){
                        console.log(txt);
                        bad_target_name = txt;
                        var npcText = null;
                        npcText = btn.eq(i).attr('onclick');
                        var id = getId(npcText);
                        idArr.push(id);
                    }
                }
            }
            console.log(idArr);
            if(idArr.length >0){
                setTimeout(function(){
                    doKillTaoFan(idArr);
                },2000)
            }
        }
        //
    
        function getPlace2(txt){
            var _place = '';
            var PLACE = ['雪亭镇','洛阳','华山村','华山','扬州','丐帮','乔阴县','峨眉山','恒山','武当山','晚月庄','水烟阁','少林寺','唐门','青城山','逍遥林','开封','光明顶','全真教','古墓','白驮山','嵩山'];
            var place = ['饮风客栈','龙门石窟','华山村村口','华山山脚','安定门','树洞内部','乔阴县城北门','十二盘','大字岭','林中小路','竹林','青石官道','丛林山径','蜀道','北郊','青石大道','朱雀门','小村','终南山路','山路','戈壁','太室阙']
            $.each(place,function(n,v){
                if(txt.indexOf(v) != '-1'){
                    _place = PLACE[n];
                    _place = n;
                    return false;
                }
            })
            _place ++;
            return _place;
        }
    
        
        function bindKey(){
            console.log(getTimes() +'欢迎使用游戏助手!\nwsad表示上下左右\nq左上，z左下，e右上，右下c');
            $(document).keydown(function(e){
                if(e){
                    switch(e.keyCode){
                        case 87:clickButton('go north', 0);break;  //上w
                        case 83:clickButton('go south', 0);break; //下s
                        case 65:clickButton('go west', 0);break; //左a
                        case 68:clickButton('go east', 0);break; //右d
    
                        case 81:clickButton('go northwest', 0);break; //左上q
                        case 69:clickButton('go northeast', 0);break; //左下z
                        case 90:clickButton('go southwest', 0);break; //右上e
                        case 67:clickButton('go southeast', 0);break; //右下c clickButton('home', 1)
    
                        // case 13:clickButton('home', 1);break;//回主页
    
    
                        // case 49:clickButton('jh 1', 0);break;//直接进入第1章
                        // case 50:clickButton('jh 2', 0);break;//2
                        // case 51:clickButton('jh 3', 0);break;//3
                        // case 52:clickButton('jh 4', 0);break;//4
                        // case 53:clickButton('jh 5', 0);break;//5
                        // case 54:clickButton('jh 6', 0);break;//6
                        // case 55:clickButton('jh 7', 0);break;//7
                        // case 56:clickButton('jh 8', 0);break;//8
                        // case 57:clickButton('jh 9', 0);break;//9
                        // case 48:clickButton('jh 10', 0);break;//9
    
                        // case 107:clickButton('items', 0);break;// 小键盘+号 打开背包
                        // case 109:clickButton('score_info', 0);break;//小键盘-号 打开江湖属性
                        // case 106:clickButton('score_base', 0);break;//小键盘*号 打开人物属性
                    }
                }
            });
        }
    
                //          0                 2        3        4                                            9        10
    var jiwuPlaceName = ['麒麟宫','苍鹰宫','白虎宫','金狮宫','凤凰宫','银豹宫','云兽宫','赤龙宫','玄武宫','朱雀宫','荒狼宫','神猿宫'];
    var correctPlace = "正厅";
    window.step = 0;
    var jiwuInter = null;
    function killFirstJiWu(){
        var msg = '十二宫顺序是：'+ jiwuPlaceName.join(',') + '请到十二宫正厅再点击开始\n没有准备好就点取消！';
    
        if (confirm(msg)===true){
            console.log("开始打十二宫");
            goJiWuPlaceWarp();
        }else{
            return false;
        }
    }
    function goCorrectJiWuPlace(){
        clearInterval(jiwuInter);
        jiwuInter = setInterval(function(){
            getJiWuInfo();
        }, 1000)
    }
    function goJiWuPlaceWarp(){
        clearInterval(jiwuInter);
        if(isCorrectJiWuPlace()){
            // 杀
            killJiwuGong();
        }else if(inZhengTing()){
            gojiwuPlace();
        }else{
            goZhengTing();
            setTimeout(function(){
                gojiwuPlace();
            }, 4000)
    
            setTimeout(function(){
                if(isCorrectJiWuPlace()){
                    killJiwuGong();
                }
            }, 8000)
        }
    }
    // 杀十二宫BOSS
    function killJiwuGong(){
        var step = window.step;
        console.log(getTimes() +'杀'+ jiwuPlaceName[step]);
        switch(step){
            case '0':
                clickButton('kill jiwutan_tianhai', 1);
                break;
            case '1':
                clickButton('kill jiwutan_kunpeng', 1);
                break;
            case '2':
                clickButton('kill jiwutan_xuetong', 1);
                break;
            case '3':
                clickButton('kill jiwutan_zuifa', 1);
                break;
            case '4':
                clickButton('kill jiwutan_jinxi', 1);
                break;
            case '5':
                clickButton('kill jiwutan_yinbao', 1);
                break;
            case '6':
                clickButton('kill jiwutan_shouxu', 1);
                break;
            case '7':
                clickButton('kill jiwutan_xiaori', 1);
                break;
            case '8':
                clickButton('kill jiwutan_diehun', 1);
                break;
            case '9':
                clickButton('kill jiwutan_huokuang', 1);
                break;
            case '10':
                clickButton('kill jiwutan_dianxing', 1);
                break;
            case '11':
                clickButton('kill jiwutan_daoxing', 1);
                break;
        }
        goCorrectJiWuPlace();
    }
    function isCorrectJiWuPlace(){
        var step = window.step;
        var placeName = jiwuPlaceName[step];
        var roomName = $('#out .outtitle').text();
        if(roomName == placeName){
            return true;
        }
        return false;
    }
    // 去正厅
    function goZhengTing(){
        if(inJiWuArr()){
            goPlaceBtnClick('甬道');
            setTimeout(function(){
                goPlaceBtnClick('正厅');
            },1000)
        }else{
            goPlaceBtnClick('正厅');
        }
    }
    
    // 位置点击
    function goPlaceBtnClick(placeName){
        var btn = $('#out button');
    
        btn.each(function(){
            var btnName = $(this).text();
            if(btnName == placeName){
                $(this).trigger('click');
            }
        })
    }
    
    // 去十二宫里
    function gojiwuPlace(){
        var step = window.step;
        if(step == '0' || step == '2' || step == '3' || step == '4' || step == '9' || step == '10'){
            go('nw');
        }else{
            go('ne');
        }
    
        setTimeout(function(){
            goJiWuPlace();
        },1000)
    }
    
    function goJiWuPlace(){
        var placeName = jiwuPlaceName[step];;
        var btn = $('#out button');
    
        btn.each(function(){
            var btnName = $(this).text();
            if(btnName == placeName){
                $(this).trigger('click');
            }
        })
    }
    
    // 当前位置是否是12宫中
    function inJiWuArr(){
        var roomName = $('#out .outtitle').text();
        if($.inArray(roomName,jiwuPlaceName) != '-1'){
            return true;
        }
        return false;
    }
    
    // 是否在正厅
    function inZhengTing(){
        var roomName = $('#out .outtitle').text();
        var roomName1 = "正厅";
        if(roomName == roomName1){
            return true;
        }
        return false;
    }
    
    // 获取十二宫面板信息
    function getJiWuInfo(){
        var out = $('#out2 .out2');
        out.each(function(){
            if($(this).hasClass('done12')){
                return
            }
            $(this).addClass('done12');
            var txt = $(this).text();
            var hasName = false;
            var npcName= '极武坛十二宫主';
            if(txt.indexOf(npcName) != '-1' ){
                window.step = $.trim(txt.split(':')[1].split('/')[0]);
                clickButton('golook_room');
                if(window.step >= 12){
                    console.log(getTimes() +'已经打完十二宫主');
                    clearInterval(jiwuInter);
                }else{
                    setTimeout(function(){
                        goJiWuPlaceWarp();
                    },2000)
                }
            }
    
        });
    }
    //
    var killerSetInterval = null;
    function killGoodNpc(e){
        var player = ['守楼虎将','天剑真身','王铁匠','杨掌柜','柳绘心','客商','卖花姑娘','刘守财','柳小花','朱老伯', '方寡妇','方老板'];
    
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
        var player = ['攻楼死士','天魔真身','段老大','二娘','岳老三','云老四','剧盗','恶棍','流寇'];
    
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
            console.log(maxId);
        }
    }
    
        // 新奇侠
    
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
                    // console.log("开始与"+name+"第"+QXTalkcounter+"对话")
                    QXTalkcounter++;
                    clickButton('ask '+QX_ID);
                    clickButton('find_task_road qixia '+QXindex);
                    setTimeout(function(){GetQXID(name,QXindex)},500);
                }else if (QXTalkcounter>5){
                    QXTalkcounter=1;
                    console.log("与"+name+"对话完成");
                    QixiaTotalCounter++;
                    if (QixiaTotalCounter>25){
    
                        console.log("今日奇侠已经完成");
                    }else{
                        console.log("下一个目标是"+finallist[QixiaTotalCounter]["name"]);
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
            go('find_task_road qixia ' + QXindex);
            go('golook_room');
            setTimeout(function(){GetQXID(QX_NAME,QXindex);},500);
        }
    
        var currentTime  = 0;
        var delta_Time = 2000;
        var QXStop=0;
        var qinmiFinished=0;
        var QiXiaList=[], finallist = [];
        function QXWhisper(){
            this.dispatchMessage=function(b){
                var type = b.get("type"), subtype = b.get("subType");
                if (type=="notice"){
                    var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
                    if (msg.match("对你悄声道")!=null){
                        QXStop=1;
                        // console.log(msg);
                        QiXiaTalkButton.innerText = '继续奇侠';
                    }
                    // console.log(msg);
                }else if (type=="main_msg"){
                    var msg=g_simul_efun.replaceControlCharBlank(b.get("msg"));
                    if (msg.match("今日亲密度操作次数")!=null){
                        var qinmi=parseInt(msg.split("(")[1].split("/")[0]);
                        if (qinmi==20){
                            QXStop=1;
                            qinmiFinished=1;
                            // console.log("今日亲密度操作已经达到20，奇侠功能暂停。再次使用请重新点击开始领取果子。");
                            QXTalking=0;
                        }
                    }
                }
            }
        }
        var whipser=new QXWhisper;
        function GetQiXiaList(){
            var html=g_obj_map.get("msg_html_page");
            QxTalking=1;
            if (html==undefined){
                setTimeout(function(){GetQiXiaList();},500);
            }else if(g_obj_map.get("msg_html_page").get("msg").match("江湖奇侠成长信息")==null){
                setTimeout(function(){GetQiXiaList();},500);
            }else{
                QiXiaList=formatQx(g_obj_map.get("msg_html_page").get("msg"));
                // console.log(QiXiaList);
                SortQiXia();
            }
        }
        function SortQiXia(){//冒泡法排序
            var temp={};
            var temparray=[];
            var newarray=[];
            for (var i=0;i<QiXiaList.length;i++){
                for (var j=1;j<QiXiaList.length-i;j++){
                    if (parseInt(QiXiaList[j-1]["degree"])<parseInt(QiXiaList[j]["degree"])){
                        temp=QiXiaList[j-1];
                        QiXiaList[j-1]=QiXiaList[j];
                        QiXiaList[j]=temp;
                    }
                }
            }
            var tempcounter=0;
            // console.log("奇侠好感度排序如下:");
            // console.log(QiXiaList);
            //首次排序结束 目前是按照由小到大排序。现在需要找出所有的超过25000 小于30000的奇侠。找到后 排序到最上面；
            for (var i=0;i<QiXiaList.length;i++){
                if (parseInt(QiXiaList[i]["degree"])>=25000&&parseInt(QiXiaList[i]["degree"])<30000){
                    temparray[tempcounter]=QiXiaList[i];
                    tempcounter++;
                    newarray.push(i);
                }
            }
            // console.log(temparray);
            // console.log("提取满朱果好感度排序如下:");
            for (var i=0;i<QiXiaList.length;i++){
                if (newarray.indexOf(i)==-1){
                    temparray[tempcounter]=QiXiaList[i];
                    tempcounter++;
                }
            }
            // var over3=[];
            // // console.log(temparray);//第一次排序结束。现在要挑出所有超过3万的亲密 并且放到最后。
            // for (var i=0;i<temparray.length;i++){
            //     if (parseInt(temparray[i]["degree"])>=30000){//找到3万以上的
            //         over3.push(i);//push超过3万的序号
            //     }
            // }
            // // console.log(over3);
            // var overarray=[];
            // var overcounter=0;
            // for (var i=0;i<temparray.length;i++){ //第一遍循环 找到不在3万列表中的
            //     if (over3.indexOf(i)<0){
            //         overarray[overcounter]=temparray[i];
            //         overcounter++;
            //     }
            // }
            // // console.log(overarray);
            // for (var i=0;i<temparray.length;i++){//第二遍循环 把列表中的插入
            //     if (over3.indexOf(i)>=0){
            //     overarray[overcounter]=temparray[i];
            //     overcounter++;
            //     }
            // }
            finallist=[];
            finallist=temparray;
            console.log("奇侠好感度排序如下:");
            console.log(finallist);
            getZhuguo();
        }
        function getZhuguo(){
            var msg="";
            // console.log(finallist);
            for (var i=0;i<4;i++){//只检查 头四个奇侠是不是在师门，是不是已经死亡。
                if (finallist[i]["isOk"] != true){
                    msg +=finallist[i]["name"]+" ";
                }
            }
            if (msg !="" ){
                console.log("根据您的奇侠亲密好感度，目前可以最优化朱果数目的以下奇侠不在江湖或者已经死亡："+msg+"。请您稍后再尝试使用奇侠领取朱果服务。");
            }else{//头四位奇侠都在江湖中，可以开始领取朱果
                talktoQixia();
            }
        }
        var unfinish="";
        function talktoQixia(){
            if (QixiaTotalCounter<=24){// 奇侠list仍然有元素。开始调取排列第一个的奇侠
                var Qixianame="";
                var QixiaIndex=0;
                // console.log(finallist[0]["name"]);
                Qixianame=finallist[QixiaTotalCounter]["name"];
                QixiaIndex=finallist[QixiaTotalCounter]["index"];
                if (finallist[QixiaTotalCounter]["isOk"]!=true){
                    console.log("奇侠"+Qixianame+"目前不在江湖，可能死亡，可能在师门。领取朱果中断，请在一段时间之后重新点击领取朱果按钮。无需刷新页面");
                    QixiaTotalCounter++;
                    talktoQixia();
                    return;
                }else{
                    clickButton('find_task_road qixia '+QixiaIndex);
                    GetQXID(Qixianame,QixiaIndex);
                }
            }else{
                clickButton('home');
            }
        }
        var finallist=[];
        function QiXiaTalkFunc(){
            // console.log('stard:奇侠领朱果');
            var QiXiaList_Input= "";
            //打开 江湖奇侠页面。
            if (QXStop==0){
                clickButton('open jhqx', 0);
                GetQiXiaList();
            }else if (QXStop==1&&qinmiFinished==0){
                QXStop=0;
                QiXiaTalkButton.innerText = '奇侠领朱果';
            }else if (QXStop==1&&qinmiFinished==1){
                QXStop=0;
                QixiaList=[];
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
                    if(arr[i].indexOf('-') > 0){
                        continue;
                    }
                    qxInfo = {};
                    arr[i] = arr[i].replace('朱果', '');
                    arr2 = arr[i].match(/<td[^>]*>([^\d\(]*)\(?(\d*)\)?<\/td><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><td[^>]*>.*?<\/td>/);
                    // arr2 = arr[i].match(/<td[^>]*>([^\d\(]*)\\*?<\/td><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><td[^>]*>.*?<\/td>/);
                    // console.log(arr2);
                    // var numbers = arr2[1].match(/\d+/g);    
                    qxInfo["name"] = arr2[1].replace('(', '').replace(')', '');
                    qxInfo["degree"] = arr2[2] == "" ? 0 : arr2[2];
                    // qxInfo["degree"] = numbers == null ? 0 : Number(numbers[0]);
                    // console.log(arr2);
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
            zhengli("玄铁令", "obj_xuantieling", "put_store");
            zhengli("玄重铁", "obj_xuanzhongtie", "put_store");
            zhengli("白银宝箱",    "baiyin box", "put_store");
            zhengli("青木宝箱",    "obj_qingmubaoxiang", "put_store");
            zhengli("黄金宝箱", "huangjin box", "put_store");
            zhengli("铂金宝箱", "obj_box3", "put_store");
            zhengli("赤璃宝箱", "obj_chilibaoxiang", "put_store");
            zhengli("曜玉宝箱", "obj_yaoyubaoxiang", "put_store");
            zhengli("黄金钥匙", "huangjinbox key", "put_store");
            zhengli("赤璃钥匙", "obj_chiliyaoshi", "put_store");
            zhengli("曜玉钥匙", "obj_yaoyuyaoshi", "put_store");
            zhengli("左手兵刃研习", "leftweapon book", "put_store");
            zhengli("驻颜丹", "zhuyan dan", "put_store");
            zhengli("玫瑰花","meigui hua", "put_store");
            zhengli("空识卷轴","obj_kongshi_juanxiu", "put_store");
            zhengli("帮派令","obj_bangpailing", "put_store");
            zhengli("神匠宝箱","obj_shenjiangbaoxiang", "put_store");
            zhengli("秘籍木盒","obj_mijimuhe", "put_store");
            zhengli("谜题令","obj_mitiling", "put_store");
        
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
    
        function ZhanDouView(){
            this.dispatchMessage=function(b){
                // console.log(b);
                var type = b.get("type"), subType = b.get("subtype");
                
                if(type == 'main_msg' && followTeamSwitch){
                    var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                    if(msg.indexOf('队伍') == '-1'){
                        return;
                    }
                    
                    var actionName = null;
                    var actionCode = null;
                    if(msg.indexOf('go') > 0){
                        actionName = msg.split('click')[1].split('。')[0];
                        actionName = 'click' + actionName + "')";
                        actionName = actionName.split('go');
                        actionCode = actionName[0] + 'go ' + actionName[1];
                    }
                    if(msg.indexOf('kill') > 0){
                        actionName = msg.split('click')[1].split('，')[0];
                        actionName = 'click' + actionName + ")";
                        actionName = actionName.split('kill');
                        actionCode = actionName[0] + 'kill ' + actionName[1];
                    }
                    if(msg.indexOf('fight') > 0){
                        actionName = msg.split('click')[1].split('，')[0];
                        actionName = 'click' + actionName + ")";
                        actionName = actionName.split('fight');
                        actionCode = actionName[0] + 'fight ' + actionName[1];
                    }
                    // console.log(actionCode);
                    eval(actionCode);
                }
                if($('#skill_1').length == 0){
                    maxQiReturn = 0;
                    chuzhaoNum();
                    bixueEnd();
                    return;
                }
                if (type=="vs" && subType=="text"){
                    var msg = g_simul_efun.replaceControlCharBlank(b.get("msg"));
                    
                    if(msg.indexOf("你骤地怒吼一声")>-1){
                        bixueStart();
                    }
    
                    // 跟招
                    if(genZhaoMode == 1){
                        if(msg !==""&&(msg.indexOf("--破军棍诀--")>-1 || msg.indexOf("--千影百伤棍--")>-1)){
                            var qiNumber = gSocketMsg.get_xdz();
                            var qiText = gSocketMsg.get_xdz();
                            if(qiText > 3){
                                doKillSet();
                            }
                        }
    
                        // var hitDesList = ['刺','斩','劈','扫','射','扑','击','取','往','向','奔','朝','指','点','取','卷'];
                        // for(var i = 0; i<hitDesList.length; i++){
                        //     var hitText = hitDesList[i];
                        //     if(txt.indexOf('迅疾无比') == '-1' && txt.indexOf('身形再转') == '-1' && txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1' && msg.indexOf('你') == '-1'){
                        //         var targetNameArr  = getPozhaoNpcName();
                        //         for(var k = 0 ; k <targetNameArr.length; k ++){
                        //             var keyWord = hitText + targetNameArr[k];
                        //             if(msg.indexOf(keyWord) != '-1'){
                        //                 doKillSet();
                        //                 return
                        //             }
                        //         }
                        //     }
                        // }
                    }
    
                    // 打楼
                    if(daLouMode == 1){
                        var txt = msg;
                        // var hp = geKeePercent();
                        var qiNumber = gSocketMsg.get_xdz();
                        if(qiNumber<3){
                            return;
                        }
                        var hasHeal = checkHeal();
                        if(hasHeal){
                            return;
                        }
    
                        // 对面使用内功 我就使用轻功
                        var hitDesList = ['涌向你'];
                        var vsForce = g_obj_map.get("msg_vs_info").get("vs2_force1");
                        var hasDoDU = false;
                        if(vsForce >100){
                            for(var i = 0; i<hitDesList.length; i++){
                                var hitText = hitDesList[i];
                                if(txt.indexOf(hitText) != '-1'){
                                    var skillArr = ["无影毒阵"];
                                    var skillIdA = ['1','2','3','4','5','6'];
                                    var userSkillsSwitch = false;
                                    $.each(skillArr, function(index, val){
                                        var skillName = val;
    
                                        for(var i = 0; i<skillIdA.length; i++){
                                            var btnNum = skillIdA[i];
                                            var btn = $('#skill_'+btnNum);
                                            var btnName = btn.text();
                                            if(btnName == skillName){
                                                btn.find('button').trigger('click');
                                                userSkillsSwitch = true;
                                                hasDoDU = true;
                                                break;
                                            }
                                        }
                                    })
                                    if(!userSkillsSwitch){
                                        kezhi('1');
                                    }
                                    return
                                }
                            }
                        }
                        if(!hasDoDU && $('.cmd_skill_button').length >0){
                            var hitDesList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                            for(var i = 0; i<hitDesList.length; i++){
                                var hitText = hitDesList[i];
                                if(txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1'){
                                    if(txt.indexOf(hitText) != '-1'){
                                        // console.log('打楼当前信息：'+ txt);
                                        if(Base.getCorrectText('4253282')){
                                            if(txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1' || txt.indexOf('指') != '-1'){
                                                kezhi('2');
                                            }else{
                                                kezhi('1');
                                            }
                                        }else{
                                            doKillSet();
                                        }
                                        return
                                    }
                                }
                                
                            }
                        }
                    }
                    
                    // 对招
                    if(duiZhaoMode == 1){
                        if(hasQiLin()){
                            go('escape');
                            go('home');
                            setTimeout(function(){
                                go('home');
                            },1000)
                            setTimeout(function(){
                                go('home');
                            },2000)
                            return false;
                        }
    
                        var txt = msg;
    
                        if($('.cmd_skill_button').length >0){
                            var qiNumber = gSocketMsg.get_xdz();
                            if(qiNumber<3){
                                return;
                            }
    
                            var hasHeal = checkHeal();
                            if(hasHeal){
                                return;
                            }
                            var hitDesList = ['刺你','扫你','指你','你如','至你','拍你','向你','在你','准你','点你','劈你','取你','往你','奔你','朝你','击你','斩你','扑你','取你','射你','你淬','卷你','要你','将你','涌向你','对准你','你急急','抓破你','对着你','你已是','你被震','钻入你','穿过你','你愕然','你一时','你难辨','你竭力','纵使你有','围绕着你','你生命之火','你扫荡而去','你反应不及','你再难撑持','你无处可避','贯穿你躯体','你挡无可挡','你大惊失色','你的对攻无法击破','你这一招并未奏效','你只好放弃对攻'];
                            for(var i = 0; i<hitDesList.length; i++){
                                var hitText = hitDesList[i];
                                if(txt.indexOf('铁锁横江') == '-1' && txt.indexOf('金刚不坏功力') == '-1' && txt.indexOf('太极神功') == '-1'){
                                    if(txt.indexOf(hitText) != '-1'){
                                        // console.log('出招当前信息：'+ txt);
                                        if(Base.getCorrectText('4253282')){
                                            if(txt.indexOf('掌') != '-1' || txt.indexOf('拳') != '-1' || txt.indexOf('指') != '-1'){
                                                kezhi('2');
                                            }else{
                                                kezhi('1');
                                            }
                                        }else{
                                            doKillSet();
                                        }
                                        return
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    
        var zhanDouView = new ZhanDouView;
    
        function bixueStart(){
            $('.bixueText').html('已开启鼻血');
            bixueSwitch = true;
            // console.log('已开启鼻血');
        }
    
        function bixueEnd(){
            bixueSwitch = false;
            $('.bixueText').html('');
        }
    
        function SmallInit(){
            if(isSelfId()){
                $('#btn7').trigger('click');
                $('#btn8').trigger('click');
                $('#btn9').trigger('click');
                $('#btno26').trigger('click');
                $('#btnOnTime').trigger('click');
            }else if(isLittleId()){
                $('#btn7').trigger('click');
                $('#btn8').trigger('click');
                $('#btnOnTime').trigger('click');
            }else if(isGuaJiId()){
                $('#btn7').trigger('click');
                $('#btn8').trigger('click');
                $('#btn10').trigger('click');
                $('#btnOnTime').trigger('click');
            }else{
                $('#btn7').trigger('click');
                $('#btn8').trigger('click');
                $('#btno26').trigger('click');
                $('#btnOnTime').trigger('click');
            }
    
            if(isBigBixue()){
                $('#btn-watchQQ').trigger('click');
            }
        }
        // 加载完后运行
        $(function(){
            if(Base.getCorrectText('3594649') || Base.getCorrectText('4238943')){
                bindKey();
            }
            Base.init();
            makePlaceBtns();
            makeOtherBtns();
            makeMoreBtns();
            GetNewQiXiaList();
            SmallInit();
            attach();
            var doOntimeInterval = setInterval(function(){
                if(isAutoOn){
                    if(Base.getCorrectText('6984251') || Base.getCorrectText('6965572')){
                        doOnTimeGuaJi();
                    }else{
                        doOnTime();
                    }
                }
            },15*60*1000);
        })
    })();
    