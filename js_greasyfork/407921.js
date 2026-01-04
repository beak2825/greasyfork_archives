// ==UserScript==
// @name         GBF auto poker
// @namespace    
// @version      0.1
// @description  auto poker
// @author       You
// @grant        none

// @run-at       document-idle
// 尝试使用脚本生成匹配规则

// @include http://gbf.game.mbga.jp/*


// @downloadURL https://update.greasyfork.org/scripts/407921/GBF%20auto%20poker.user.js
// @updateURL https://update.greasyfork.org/scripts/407921/GBF%20auto%20poker.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var regx = /poker/;
if(regx.test(location.hash)){
    setTimeout(function(){
        (function(){
            var za
            ,zb
            ,et = 'ontouchstart' in window ? 'touchstart' : 'mousedown'
            ,md = 0
            ,nl = '\n'
            ,zc = ['color:#000000','color:#307730','color:#AAAAAA','color:white; background-color:#77A8F3','color:white; background-color:#0055CC','color:white; background-color:#B03939']
            ,sout = function(inf,sty){if(!av.是否在控制台输出信息){sout=function(){};return}console.info('%c'+inf,zc[~~sty])}
            ,tp = function(sel){$(sel).trigger('tap')}
            ,tz = function(sel){var _=$('div',sel),__=_.size()-1,___=0;_.each(function(i,____){___+=~~____.className.split('_')[1]*Math.pow(10,__-i)});return ___}
            ,ce = function(en){$('#canv').trigger(en)}
            ,ce2 = function(b){exportRoot["card_" + b + "_select"]=1}
            ,pc = function(fn){return Math.round(fn*10000)/100+'%'}
            ,iv = function(sel){return $(sel).is(':visible')}
            ,ih = function(tex){return $('.prt-navigation').text()==tex}
            ,sstat = function(){var _=[],__=read.medal();for(var k in st){_.push(k+': '+st[k])}_.push('现在游戏筹码: '+__);_.push('累计筹码收益: '+(__-st.初始游戏筹码));console.info(_.join(''+nl+''))}
            ,gsay = function(sor,sow){if(sm.gchoice!=''){if((sm.gchoice=='大' && read.doub(1).点数 < read.doub(2).点数) || (sm.gchoice!='大' && read.doub(1).点数 > read.doub(2).点数)){st.薛定谔猜对次数++;sout(sor)}else{st.薛定谔猜错次数++;sout(sow)}sm.gchoice=''}}
            ,sm = {
                running:false,
                timeout:0,
                deck:0,
                doubleup:0,
                doubletimes:0,
                lastchoice:'',
                gchoice:''
            }
            ,st = {
                脚本启动时间:new Date().toLocaleString(),
                最后一次操作:'未操作',
                每局筹码:0,
                双倍最高回数:0,
                累计牌桌游戏次数:0,
                累计双倍游戏次数:0,
                累计双倍赌对次数:0,
                累计双倍赌错次数:0,
                薛定谔猜对次数:0,
                薛定谔猜错次数:0,
                初始游戏筹码:0
            }
            ,dbg = function(){console.debug(sm)}
            ,gdeck = function(){if(check.canstart()){return [0,0]}else if(check.canok()){return [1,0]}else if(check.candoubleup()){return [2,0]}else if(check.canhighlow()){return [3,0]}else if(check.canyesno()){return [3,1]}}
            ,udeck = function(){var _=gdeck();if(_){sm.deck=_[0];sm.doubleup=_[1]}else{sout('Oh my god!你可能不在打牌界面。',2)}}
            ,udo = function(){st.最后一次操作=new Date().toLocaleString()}
            ,rt = {}
            ,gsr = function(){for(var p=2;p<=14;p++){
                rt[p]={小:(p-2)/12,大:1-(p-2)/12}
            }}
            ,sp = {过期时间:0,数据:{}}
            ,sp2 = {过期时间:0,数据:[]}
            ,ssamp = function(){var _={},_2={};for(var k in sp.数据){var __=sp.数据[k],___=sampr(k),_____={};for(var k2 in __){_____[k2]=__[k2]}_____.可信度=pc(___.可信度),_____.出大概率=pc(___.大),_____.出大基准=pc(rt[k].大),_____.出小概率=pc(___.小),_____.出小基准=pc(rt[k].小);_[k]=_____}for(var i=0;i<sp2.数据.length;i++){_2[i]={出小次数:sp2.数据[i][0],出大次数:sp2.数据[i][1],正确次数:sp2.数据[i][2],错误次数:sp2.数据[i][3]}}console.info('双卡模式:');console.table(_);console.info('无限模式:');console.table(_2);return '样本过期时间: '+new Date(sp.过期时间).toLocaleString()}
            ,gsamp = function(p){sp.数据[p]={总:0,大:0,小:0,平:0}}
            ,gls = function(){var _=localStorage['wg_casino_poker_samples'];if(_){sp=JSON.parse(_)}}
            ,gls2 = function(){var _=localStorage['wg_casino_poker_samples2'];if(_){sp2=JSON.parse(_)}}
            ,sls = function(){localStorage['wg_casino_poker_samples']=JSON.stringify(sp)}
            ,sls2 = function(){localStorage['wg_casino_poker_samples2']=JSON.stringify(sp2)}
            ,gav = function(){var _=localStorage['wg_casino_poker_config'];if(_){av=JSON.parse(_);}else{av=pav;localStorage['wg_casino_poker_config']=JSON.stringify(av)}}
            ,sav = function(){localStorage['wg_casino_poker_config']=JSON.stringify(av)}
            ,cst = function(){if(new Date().getTime()>sp.过期时间){var _=new Date();if(_.getHours()>=av.收集的样本在每天几点时过期){_=new Date(_.getTime()+24*60*60*1000)}_.setHours(av.收集的样本在每天几点时过期),_.setMinutes(0),_.setSeconds(0),_.setMilliseconds(0);sp={过期时间:_.getTime(),数据:{}}}}
            ,cst2 = function(){if(new Date().getTime()>sp2.过期时间){var _=new Date();if(_.getHours()>=av.收集的样本在每天几点时过期){_=new Date(_.getTime()+24*60*60*1000)}_.setHours(av.收集的样本在每天几点时过期),_.setMinutes(0),_.setSeconds(0),_.setMilliseconds(0);sp2={过期时间:_.getTime(),数据:[]}}}
            ,rsamp = function(){if(check.issinglecard()){return};cst();var p=read.doub(1).点数,r=read.doub(2).点数;if(!(p in sp.数据)){gsamp(p)}sp.数据[p].总++;if(r>p){sp.数据[p].大++}else if(r<p){sp.数据[p].小++}else{sp.数据[p].平++}sls()}
            ,rsamp2 = function(r){if(!check.issinglecard()){return};cst2();var c=read.doub(1).点数,i=sm.doubletimes;if(!sp2.数据[i]){sp2.数据[i]=[0,0,0,0]}sp2.数据[i][r+1]++;if(c==99 || c==14){sls2();return}if(c>=8){sp2.数据[i][1]++}else{sp2.数据[i][0]++}sls2()}
            ,sampr = function(p){var _=sp.数据[p];if(_.总-_.平==0){return null}_=_.小/(_.总-_.平);return {小:_,大:1-_,可信度:Math.min(1,sp.数据[p].总/av.样本可信度分母)}}
            ,ca = function(raw,pos){
                var _ = raw.split('_');
                this.花色 = ~~_[0];
                this.点数 = ~~_[1];
                if(this.点数==1){this.点数=14}
                this.位置 = pos+1;
            }
            ,co = {
                conv:function(raw){return raw.map(function(v,i){return new ca(v,i)})},
                sort:function(ar,pr){for(var i=0,l=ar.length;i<l;i++){for(var j=i+1;j<l;j++){if(ar[i][pr]>ar[j][pr]){var _=ar[j];ar[j]=ar[i];ar[i]=_}}}}
            }
            ,read = {
                deck:function(){return co.conv(cards_1_Array)},
                doub:function(i){return new ca(window['doubleUp_card_'+i],0)},
                bet:function(){return tz('.prt-bet')},
                medal:function(){return tz('.prt-medal')}
            }
            ,check = {
                canstart:function(){return iv('.prt-start')},
                canok:function(){return iv('.prt-ok')},
                canyesno:function(){return iv('.prt-yes')},
                canhighlow:function(){return iv('.prt-double-select')},
                candoubleup:function(){return ih('ダブルアップに挑戦しますか？')},
                issinglecard:function(){return Game.view.doubleKind=='1'}
            }
            ,act = {
                tapstart:function(){sout('点击START',1);udo();tp('.prt-start')},
                tapok:function(){sout('点击OK',1);udo();tp('.prt-ok')},
                tapyes:function(){sout('点击YES',1);udo();tp('.prt-yes')},
                tapno:function(){sout('点击NO',1);udo();tp('.prt-no')},
                taphigh:function(){sout('点击HIGH',1);udo();tp('.prt-double-select[select=high]')},
                taplow:function(){sout('点击LOW',1);udo();tp('.prt-double-select[select=low]')},
                keep1pos:function(){sout('保持第1张卡',1);ce('set1');ce2(1)},
                keep2pos:function(){sout('保持第2张卡',1);ce('set2');ce2(2)},
                keep3pos:function(){sout('保持第3张卡',1);ce('set3');ce2(3)},
                keep4pos:function(){sout('保持第4张卡',1);ce('set4');ce2(4)},
                keep5pos:function(){sout('保持第5张卡',1);ce('set5');ce2(5)}
            }
            ,ai = {
                keep:function(){
                    var ar = read.deck();
                    co.sort(ar,'点数');
                    //如果有王牌，保持王牌；如果有对子或以上，保持对子；如果都没有，则先检查是否顺子，是则保持，否则保持同花色最多的牌。
                    var kp={},jo=false,pa=0,mi=Infinity,ft=[],sl={};
                    for(var i=0,l=ar.length;i<l;i++){
                        if(ar[i].花色 in sl){
                            sl[ar[i].花色].push(ar[i].位置);
                        }else if(ar[i].花色==99){
                            jo = true;
                            kp[ar[i].位置]=true;
                        }else{
                            sl[ar[i].花色]=[ar[i].位置];
                        }

                        if(ar[i+1] && ar[i].点数==ar[i+1].点数){
                            kp[ar[i].位置]=true;
                            kp[ar[i+1].位置]=true;
                            pa++;
                        }

                        if(ar[i].点数!=99){
                            if(ar[i].点数<mi){
                                mi = ar[i].点数;
                            }
                            ft[ar[i].点数] = ar[i].位置;
                        }
                    }
                    if(pa==0){
                        var mslc=0,mslk=0,mcj=1,fsi=0,fei=0,mfc=0;
                        for(var k in sl){if(sl[k].length>mslc){mslc=sl[k].length;mslk=k}}
                        if(jo){mslc++;mcj++}
                        ft = ft.slice(mi);
                        for(var i=0,l=ft.length;i<l;i++){
                            if(ft[i]==undefined){continue}
                            var nj = 0, nl = 0;
                            for(var j=i;j<l;j++){
                                if(nl>=5){
                                    break;
                                }
                                nl++;
                                if(ft[j]==undefined){
                                    nj++;
                                    if(nj>mcj){
                                        break;
                                    }
                                }
                            }
                            if(nl-nj>mfc){
                                mfc=nl-nj;
                                fsi=i;
                                fei=nl+i;
                            }
                        }
                        if(jo){mfc++}
                        sout('顺子'+mfc+'枚,同花'+mslc+'枚',2);
                        if(mfc==5 || mslc==5){
                            kp={1:true,2:true,3:true,4:true,5:true};
                        }else if(mslc>=mfc){
                            for(var i=0,l=sl[mslk].length;i<l;i++){kp[sl[mslk][i]]=true}
                        }else{
                            for(var i=fsi;i<fei;i++){if(ft[i]!=undefined){kp[ft[i]]=true}}
                        }
                    }
                    return kp;
                },
                hol:function(){
                    if(check.issinglecard()){
                        if(sp2[sm.doubletimes] && sp2.数据[sm.doubletimes][0]!=sp2.数据[sm.doubletimes][1]){
                            sout('过去的样本中,第'+sm.doubletimes+'次出现小的次数为'+sp2.数据[sm.doubletimes][0]+',出现大的次数为'+sp2.数据[sm.doubletimes][1],2);
                            return sp2.数据[sm.doubletimes][0]<sp2.数据[sm.doubletimes][1]?'HIGH':'LOW';
                        }
                        sout('过去没有样本,或样本中的大小概率一致,无参考价值',2);
                        return Math.random()>0.5?'HIGH':'LOW';
                    }
                    var card = read.doub(1);
                    sout('キター!你的对手是:'+card,4);
                    if(!(card.点数 in sp.数据)){
                        gsamp(card.点数);
                    }
                    if(av.薛定谔陪你玩){
                        var _=sampr(card.点数),__=rt[card.点数];
                        if(_ && sp.数据[card.点数].总>=av.模式设定[md].样本收集几次后开始使用){
                            sout('样本可信度'+pc(_.可信度),2);
                            sout('出大概率'+pc(_.大)+', 基准'+pc(__.大),2);
                            sout('出小概率'+pc(_.小)+', 基准'+pc(__.小),2);
                            if(_.大==__.大){
                                var r = (_.大>_.小)?'大':'小';
                                sm.gchoice = r;
                                sout('完全的一致！薛定谔默默地选择了'+r);
                            }else{
                                var s = _.大*_.可信度 + __.大*(1-_.可信度);
                                if(Math.abs(s-__.大)>=0.02+0.016*Math.abs(card.点数-av.赌双倍的高低分水点数)){
                                    var r = (_.大>_.小)?'小':'大';
                                    sm.gchoice = r;
                                    sout('选择'+r+'！薛定谔毫不犹豫地作出了选择。');
                                }else{
                                    var r = (_.大>_.小)?'大':'小';
                                    sm.gchoice = r;
                                    sout('太难以决择了...薛定谔犹豫了一下，还是选胸'+r+'的吧。');
                                }
                            }
                        }else{
                            sout('我还没有准备好！薛定谔生气地拒绝作出选择。');
                        }
                    }
                    if(sp.数据[card.点数].总>=av.模式设定[md].样本收集几次后开始使用 && sp.数据[card.点数].大!=sp.数据[card.点数].小){
                        if(sp.数据[card.点数].小>sp.数据[card.点数].大){
                            return 'LOW'
                        }
                        return 'HIGH'
                    }
                    if(card.点数>av.赌双倍的高低分水点数){
                        return 'LOW'
                    }else if(card.点数<av.赌双倍的高低分水点数){
                        return 'HIGH'
                    }
                    return Math.random()>0.5?'HIGH':'LOW';
                },
                yon:function(){
                    if(check.issinglecard()){
                        return true;
                    }
                    var card = read.doub(2);
                    if(av.模式设定[md].允许一站到底 && read.medal()>=av.模式设定[md].本钱大于多少后开始一站到底){
                        if(card.点数 in sp.数据){
                            if(sp.数据[card.点数].总>=av.模式设定[md].样本收集多少份才允许一站到底){
                                sout('Fairy Fevering',2);
                                return true
                            }
                        }
                    }
                    var nga = av.模式设定[md].赌双倍遇到这些点数就不要继续;
                    if(sm.doubletimes>=av.模式设定[md].赌双倍连续获胜几回合后进入谨慎状态 || read.bet()>=av.模式设定[md].赌双倍赢筹码达到多少后进入谨慎状态){
                        sout('AT-Field FullPower',2);
                        nga = av.模式设定[md].赌双倍谨慎状态下遇到这些点数就不要继续;
                    }
                    for(var i=0,l=nga.length;i<l;i++){
                        if(card.点数==nga[i]){
                            sout('Oh my god!出现了不再继续的卡片:'+card,4);
                            return false;
                        }
                    }
                    return true;
                }
            }
            ,uo = {
                sleep:function(caf){if(sm.timeout++>20){location.reload()}var slt=av.模式设定[md].点击动作延迟几秒+Math.random()*av.模式设定[md].随机增加的延迟秒数;sout('Relax! 我只睡'+Math.round(slt*10)/10+'秒',2);za=setTimeout(caf,slt*1000)},
                deck:function(){
                    switch(sm.deck){
                        case 0:
                            if(new Date().getTime()>=zb){
                                pgo();
                                return;
                            }
                            if(check.canstart()){
                                sm.timeout=0;
                                act.tapstart();
                                st.累计牌桌游戏次数++;
                                sm.deck++;
                            }
                            uo.sleep(uo.deck);
                            break;
                        case 1:
                            if(check.canok()){
                                sm.timeout=0;
                                if(!st.每局筹码){
                                    st.每局筹码 = read.bet();
                                }
                                sout('桌上出现的卡片为:'+read.deck().join(','),2);
                                var 要保持的卡片位置 = ai.keep();
                                for(var k in 要保持的卡片位置){
                                    act['keep'+k+'pos']();
                                }
                                act.tapok();
                                sm.deck++;
                            }
                            uo.sleep(uo.deck);
                            break;
                        case 2:
                            if(check.canyesno()){
                                sm.timeout=0;
                                act.tapyes();
                                sout('进入双倍',3);
                                sm.deck=0;
                                st.累计双倍游戏次数++;
                                /*if(check.issinglecard()){
							sout('请手动赌大小！',3);
							uo.sleep(uo.deck);
						}else{*/
                                uo.sleep(uo.doub);
                                //}
                            }else if(check.canstart()){
                                sm.timeout=0;
                                sout('失败',3);
                                sm.deck=0;
                                uo.deck();
                            }else{
                                uo.sleep(uo.deck);
                            }
                            break;
                        case 3:
                            sm.deck=0;
                            /*if(check.issinglecard()){
						sout('请手动赌大小！',3);
						uo.sleep(uo.deck);
					}else{*/
                            uo.sleep(uo.doub);
                            //}
                            break;
                    }
                },
                doub:function(){
                    switch(sm.doubleup){
                        case 0:
                            if(check.canhighlow()){
                                sm.timeout=0;
                                var bs = ai.hol();
                                sm.lastchoice = bs;
                                act['tap'+bs.toLowerCase()]();
                                sm.doubleup++;
                            }
                            uo.sleep(uo.doub);
                            break;
                        case 1:
                            if(check.canyesno()){
                                sm.timeout=0;
                                rsamp();
                                rsamp2(1);
                                sout('愉♂悦吧!双赔获胜',4);
                                sm.doubletimes++;
                                if(sm.doubletimes>st.双倍最高回数){
                                    st.双倍最高回数=sm.doubletimes;
                                }
                                st.累计双倍赌对次数++;
                                gsay('我早就看到是这个结局了，像我这种天才少女怎么可能会有控制不了的概率呢？哦呵呵呵呵～'+nl+'薛定谔自豪地挺了挺胸。虽然她没有。','切！薛定谔在角落里嘟囔了一句。');
                                var cm = read.bet();
                                sout('累计赌对'+sm.doubletimes+'回,当前筹码:'+cm,5);
                                if(av.模式设定[md].赌双倍连续获胜几回合后停止<=sm.doubletimes || av.模式设定[md].赌双倍筹码达到多少后停止<=cm){
                                    act.tapno();
                                    sm.doubletimes=0;
                                    sm.doubleup=0;
                                    uo.sleep(uo.deck);
                                    return;
                                }
                                if(ai.yon()){
                                    act.tapyes();
                                    sm.doubleup=0;
                                    uo.sleep(uo.doub);
                                }else{
                                    var _=read.bet();
                                    act.tapno();
                                    sout('收入'+_,5);
                                    sm.doubleup=0;
                                    sm.doubletimes=0;
                                    uo.sleep(uo.deck);
                                }
                            }else if(check.canstart()){
                                sm.timeout=0;
                                rsamp();
                                rsamp2(2);
                                if(check.issinglecard()){
                                    sout('Holy shit!双倍失败!出现的卡片是:'+read.doub(1),4);
                                    st.累计双倍赌错次数++;
                                }else if((sm.lastchoice=='HIGH' && read.doub(1).点数 <= read.doub(2).点数) || (sm.lastchoice!='HIGH' && read.doub(1).点数 >= read.doub(2).点数)){
                                    sout('Oh my god!达到回合上限',4);
                                    var _=read.bet();
                                    gsay('我早就看到是这个结局了，像我这种天才少女怎么可能会有控制不了的概率呢？哦呵呵呵呵～'+nl+'薛定谔自豪地挺了挺胸。虽然她没有。','切！薛定谔在角落里嘟囔了一句。');
                                    sout('收入'+_,5);
                                    st.累计双倍赌对次数++;
                                }else{
                                    sout('Holy shit!双倍失败!出现的卡片是:'+read.doub(2),4);
                                    st.累计双倍赌错次数++;
                                    gsay('哇咔咔咔～活该！让你不听天才少女的忠告！'+nl+'薛定谔用非常亲切和蔼地表情对你说道。','这！这不可能！一定是CY使诈！薛定谔愤怒地一拳砸在你的屏幕上。');
                                }
                                sm.doubleup=0;
                                sm.doubletimes=0;
                                uo.deck();
                            }else{
                                uo.sleep(uo.doub);
                            }
                            break;
                    }
                }
            }
            ,boot = function(){
                if(sm.running){return}
                st.初始游戏筹码 = read.medal();
                udeck();
                zb = new Date().getTime()+av.模式设定[md].自动值守不超过几小时*60*60*1000;
                sm.running=true;
                uo.sleep(uo.deck);
            }
            ,pgo = function(){
                var bt = av.模式设定[md].自动值守停止后休息几小时再继续值守+av.模式设定[md].随机增加的休息小时数*Math.random();
                sout('已停止值守，并在'+Math.round(bt*10)/10+'小时后重新值守',2);
                sm.running=false;
                za = setTimeout(boot,bt*60*60*1000);
            }
            ,stop = function(){
                clearTimeout(za);
                sm.running=false;
            }
            ,pav = {
                模式设定:[
                    {
                        模式名:'双倍赌到底模式',
                        样本收集几次后开始使用:20,
                        赌双倍遇到这些点数就不要继续:[],
                        赌双倍连续获胜几回合后进入谨慎状态:7,
                        赌双倍赢筹码达到多少后进入谨慎状态:20000,
                        赌双倍谨慎状态下遇到这些点数就不要继续:[7,8,9],
                        赌双倍连续获胜几回合后停止:12,
                        赌双倍筹码达到多少后停止:200000,
                        允许一站到底:true,
                        本钱大于多少后开始一站到底:50000,
                        样本收集多少份才允许一站到底:30,
                        点击动作延迟几秒:1.5,
                        随机增加的延迟秒数:1,
                        自动值守不超过几小时:5,
                        自动值守停止后休息几小时再继续值守:0,
                        随机增加的休息小时数:0
                    }
                ],
                收集的样本在每天几点时过期:4,
                样本可信度分母:48,
                赌双倍的高低分水点数:8,
                是否在控制台输出信息:true,
                立即自动值守:true,
                薛定谔陪你玩:true
            }
            ,pw = $('<div class="pw" style="display:none">\
<style>.pw{position:absolute;left:0;top:0;z-index:100;background-color:white;padding:20px}</style>\
<p><button data-option="y1" data-operate="arr">遇到这些点数就不要继续:<span></span></button></p>\
<p><button data-option="y2" data-operate="num">连续获胜几回合后进入谨慎状态:<span></span></button></p>\
<p><button data-option="y3" data-operate="num">赢筹码达到多少后进入谨慎状态:<span></span></button></p>\
<p><button data-option="y4" data-operate="arr">谨慎状态下遇到这些点数就不要继续:<span></span></button></p>\
<p><button data-option="y5" data-operate="num">连续获胜几回合后停止:<span></span></button></p>\
<p><button data-option="y6" data-operate="num">筹码达到多少后停止:<span></span></button></p>\
<p><button data-option="y7" data-operate="tof">允许一站到底:<span></span></button></p>\
<p><button data-option="y8" data-operate="num">本钱大于多少后开始一站到底:<span></span></button></p>\
</div>').appendTo(document.body)
            ,cc = $('<div class="wg"><style>.wg{text-align:right}.wg button{width:42px;height:22px;margin-right:4px}</style></div>').appendTo(document.body)
            ,cmd1 = $('<button>停止</button>').appendTo(cc)
            ,cmd2 = $('<button>设置</button>').appendTo(cc)
            ,getValueByRel = function(el){switch(el.dataset.option){case 'y1':return av.模式设定[md].赌双倍遇到这些点数就不要继续;case 'y2':return av.模式设定[md].赌双倍连续获胜几回合后进入谨慎状态;case 'y3':return av.模式设定[md].赌双倍赢筹码达到多少后进入谨慎状态;case 'y4':return av.模式设定[md].赌双倍谨慎状态下遇到这些点数就不要继续;case 'y5':return av.模式设定[md].赌双倍连续获胜几回合后停止;case 'y6':return av.模式设定[md].赌双倍筹码达到多少后停止;case 'y7':return av.模式设定[md].允许一站到底;case 'y8':return av.模式设定[md].本钱大于多少后开始一站到底}}
            ,setValueByRel = function(el,val){switch(el.dataset.option){case 'y1':av.模式设定[md].赌双倍遇到这些点数就不要继续=val;break;case 'y2':av.模式设定[md].赌双倍连续获胜几回合后进入谨慎状态=val;break;case 'y3':av.模式设定[md].赌双倍赢筹码达到多少后进入谨慎状态=val;break;case 'y4':av.模式设定[md].赌双倍谨慎状态下遇到这些点数就不要继续=val;break;case 'y5':av.模式设定[md].赌双倍连续获胜几回合后停止=val;break;case 'y6':av.模式设定[md].赌双倍筹码达到多少后停止=val;break;case 'y7':av.模式设定[md].允许一站到底=val;break;case 'y8':av.模式设定[md].本钱大于多少后开始一站到底=val;break}sav()}
            ,av = null;
            ca.prototype.toString = function(){if(this.花色!=99){return ['黑桃','红桃','方块','草花'][this.花色-1]+(this.点数>10?['J','Q','K','A'][this.点数-11]:this.点数)}return 'JOKER'};
            gav();
            gsr();
            gls();
            gls2();
            window.wg={};
            Object.defineProperties(wg,{
                debug:{get:dbg},
                启动:{get:boot},
                停止:{get:stop},
                情况:{get:sstat},
                样本:{get:ssamp}
            });
            if(av.立即自动值守){
                boot();
            }
            cmd1.on(et,function(){
                if(cmd1.text()=='停止'){
                    cmd1.text('启动');
                    stop();
                }else{
                    cmd1.text('停止');
                    boot();
                }
            });
            cmd2.on(et,function(){
                pw.toggle();
            });
            pw.find('button').on(et,function(){
                var el = this;
                var v = getValueByRel(el);
                if(el.dataset.operate=='tof'){
                    $('span',el).text(!v);
                    setValueByRel(el,!v);
                }else{
                    var i = prompt(el.text(),v);
                    sout(i);
                }
                sout(el.dataset.operate);
            }).each(function(i,el){
                var v = getValueByRel(el);
                $('span',el).text(v);
            });
            return '进入'+av.模式设定[md].模式名;
        })();

    },10000);
}