// ==UserScript==
// @name         妖怪宝可萌本地VIP15辅助
// @namespace    http://tampermonkey.net/
// @version      1.12.8
// @description  自动打副本、地铁。免月卡跳过战斗
// @author       You
// @match        http*://game.pkc.easygametime.com/djs.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376905/%E5%A6%96%E6%80%AA%E5%AE%9D%E5%8F%AF%E8%90%8C%E6%9C%AC%E5%9C%B0VIP15%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/376905/%E5%A6%96%E6%80%AA%E5%AE%9D%E5%8F%AF%E8%90%8C%E6%9C%AC%E5%9C%B0VIP15%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    if(document.location.href=="http://www.7724.com/ygbkm/game"){
        var s=document.getElementById('game_if').src;
        if(s.indexOf('login')==-1)return;
        document.location.href=s;
    }
    if(document.location.host=="http://g.h5uc.com/24/54"){
        s=document.getElementById('h5uc-game-iframe').src;
        if(s.indexOf('login')==-1)return;
        //document.location.href=s;
    }


    if(document.location.host!="game.pkc.easygametime.com"){
        console.info('这不是妖怪宝可萌的真实页面，辅助退出');
        return;
    }else{console.info('妖怪宝可萌本地VIP15辅助 @',document.location.href)}
    var DefMap ={
        0: "baoshifubenDefMap",
        1: "fumoshifubenDefMap",
        2: "qishufubenDefMap",
        3: "chaojinhuafubenDefMap",
        4: "gaojipeiyangshifbDefMap"
    }
    function FuBen4(n){//快速打副本
        if(!bearcat) return;
        typeof n == "number" ?void 0:n=1;
        var plv=bearcat.getBean("userData").level;
        var FuBenList = new Array();
        for(var i in DefMap){
            var dm=bearcat.getBean("formEquipCopy").$gTblContainer[DefMap[i]];
            for(var ii in dm)
                if(dm[ii].level<=plv)
                    FuBenList[i]=dm[ii].id;
        }
        if(!FuBenList || !FuBenList.length) return console.info('妖怪宝辅助：FuBenList为空');
        for(i=0;i<n;i++){
            for (var x in FuBenList){
                if(!FuBenList[x])continue;
                var msg = GameProtocol.FuBenFightPVEReq.get({fuBenType:Number(x)+4,defId:FuBenList[x]});
                bearcat.getBean('socketClient').send(msg);
            }
        }
        bearcat.getBean('socketClient').send(GameProtocol.HeChengBaoShiReq.get({count: -1}));//一键合成宝石
    }

    function zbfb(n){//快速打装备副本
        if(!bearcat) return;
        var plv = bearcat.getBean("userData").level;
        var dm = bearcat.getBean("formEquipCopy").$gTblContainer.zhuangbeifubenDefMap;
        var level = 0;
        for(var ii in dm)
            if(dm[ii].level <= plv)
                level = dm[ii].id;
        if(!level) {return console.info('zbfb level = 0');}
        var msg = GameProtocol.ZhuangBeiFuBenFightPVEReq.get({defId: level});
        for(var i=0;i<n;i++) bearcat.getBean('socketClient').send(msg);
    }

    function DiTie(n){//地铁
        var msg;
        msg = n?GameProtocol.SaoDangFightReq.get({costTiLi: n}):GameProtocol.DiTieFightReq.get()
        bearcat.getBean('socketClient').send(msg);
    }

    function TanXian(){//get探险收益
        var msg= GameProtocol.GetTanXianRewardReq.get();
        bearcat.getBean('socketClient').send(msg);
    }

    function tick(){//本地VIP15、月卡、年卡、终身卡自我安慰
        if(!bearcat) return;
        //bearcat.getBean("userData").viplevel=15;
        bearcat.getBean("userData").isYueKa=true;
        bearcat.getBean("userData").isYearCard=true;
        bearcat.getBean("userData").isZhongShen=true;
        bearcat.getBean("userData").guajiCount=bearcat.getBean("userData").guajiCount?20:0;
    }

    function initWG(){// 外挂注入
        bearcat.getBean('battleScene').ctor.prototype.onMenuSkip=function (a){//取消跳过战斗的条件
            bearcat.getBean('ez').showTip('辅助：跳过战斗');
            return this.toEndLayer();
        };
        bearcat.getBean('layerClubBattle').ctor.prototype.testFight=function(a,b){//取消挑战道馆（非公会）的条件(单个怪物)
            var c,d;
            d = GameProtocol.FightPVEReq.get({nParam: this._nowGkId,fType: 2});
            this.reqGkId = this._nowGkId;
            this.send(d);
            return this.userData._clubInfo = { rotationStatus: this._sp1.rotationStatus, nowPoint: this.nowPoint}
        };

        bearcat.getBean('layerClubBattle').ctor.prototype.onMenuQuickBattle = function (a) {//开放挑战道馆（非公会）的扫荡功能（有一定几率卡出几个升级石）
            for (var i = 0; i <= 5; i++){
                var d = GameProtocol.FightPVEReq.get({
                    nParam: Number(this._nowGkId) + i,
                    fType: 2
                });
                bearcat.getBean('socketClient').send(d);
                bearcat.getBean('socketClient').send(d);
                bearcat.getBean('socketClient').send(d);
                d = GameProtocol.FightPVEReq.get({
                    nParam: 101 + i,
                    fType: 2
                });
                bearcat.getBean('socketClient').send(d);
                bearcat.getBean('socketClient').send(d);
            }
            console.info("this._nowGkId:" + this._nowGkId);
            return a.finishMenuEvent();
        };

        bearcat.getBean('formEquipCopy').ctor.prototype.getZhuangbeiFubenCishuResponse=function(a){//进入装备副本就自动打完
            //原代码：
            if(a.isErrorMessage) return;
            this.newFightTimes = a.newFightTimes;
            a.buyTimes >= 0 ? this.buyTimes = a.buyTimes : this.buyTimes = 0;
            this.setCishu();
            this.createTableView();
            //修改代码：
            var n = Number(this.buyTimes) + Number(this.newFightTimes) + Number(this._quanCount);
            if(n){
                bearcat.getBean('ez').showTip('辅助：5秒后打装备副本 '+ n +' 次，请返回');
                setTimeout(zbfb,5000,n);//延迟5秒，快速打完，方便
            }else{
                bearcat.getBean('ez').showTip('辅助：装备副本不需要打了呢');
            }
        };

        bearcat.getBean('layerLove').ctor = bearcat.getBean('layerLove').ctor.extend( //进入小镇时自动切磋房子
            {
                onEnter: function (){
                    this._super(),
                        this.registerOnSocketEvent(GameProtocol.TownPanelRsp, this.updateView),
                        this.registerOnSocketEvent(GameProtocol.FinishLianAiRenWuRsp, this.submitDesignRsp),
                        this.getList(),
                        cc.spriteFrameCache.addSpriteFrames("res/ui/frmTiequanTarget.plist")
                    for (var i = 1; i <= 6; i++){
                        var msg = GameProtocol.LianAiQieCuoReq.get({renWuId:i});
                        bearcat.getBean('socketClient').send(msg);
                        //console.info('injected!');
                    }
                }
            }
        );

        function getShare(){//获取主页分享奖励函数
            var msg=GameProtocol.GetFenxiangReq.get({channel: sdkManager.sdkType});
            bearcat.getBean('socketClient').send(msg);
        };
        for (var i = 1; i <= 23; i++){ // 一键收获排行榜分享奖励
            setTimeout(function(i){
                msg = GameProtocol.GetPaihangBangShareRewardReq.get({type: i});
                bearcat.getBean('socketClient').send(msg);
                bearcat.getBean('socketClient').send(msg);},i*1000,i)
        };

        //创建各定时器
        setInterval(tick,500);//0.5s刷新自我安慰一次
        setInterval(FuBen4,30000,2);//副本计时器30s
        DiTie(40);setInterval(DiTie,20000);//地铁计时器20s
        setInterval(TanXian,10*60*1000);//定时每10分钟收一次探险
        setTimeout(TanXian,1000);//收一次探险
        getShare();setInterval(getShare,2*60*60*1000+1000);//每两个小时收获一次主页分享奖励
        bearcat.getBean('ez').showTip('辅助：激活！');
    }
    var it=setInterval(function(){
        //每过1s检测是否登陆，登录后注入
        if(typeof(bearcat)=="undefined") return;
        if(typeof(GameProtocol)=="undefined") return;
        if(typeof(bearcat.getBean("ez"))=="undefined") return;
        if(typeof(bearcat.getBean("userData").playerName)=="undefined") return;
        clearInterval(it);
        setTimeout(initWG,4000);
    },1000)

    })();