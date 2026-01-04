// ==UserScript==
// @name         控制台修真
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  一个在控制台运行的修真游戏
// @author       北冥真人
// @match        *
// @icon         https://www.google.com/s2/favicons?domain=taptap.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license GPLV3
// @downloadURL https://update.greasyfork.org/scripts/438211/%E6%8E%A7%E5%88%B6%E5%8F%B0%E4%BF%AE%E7%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/438211/%E6%8E%A7%E5%88%B6%E5%8F%B0%E4%BF%AE%E7%9C%9F.meta.js
// ==/UserScript==

(function () {
    'use strict'; 
    class Creature{
        constructor(basicAttr){
            this.basicAttr={
                level:0,
                HP:0,
                speed:0,
                antiSpeed:0,
                attack:0,
                defence:0,
                critical:0,
                antiCrit:0,
                name:'',
                outExp:0,
            }
            this.basicAttr=basicAttr;
            this.currentHP;
            this.battlePower;
        }
    
    
        battlePowerCalc(){
            let defencePower=this.basicAttr.HP/(100*100/(this.basicAttr.defence*4));//基础攻击力100*100
            let attackPower=this.basicAttr.attack*this.basicAttr.attack/400;//基础防御100*4
            let speedRate=(this.basicAttr.speed/10000+1)*(this.basicAttr.antiSpeed/10000+1);
            let criticalRate=(this.basicAttr.critical/10000+1)*(this.basicAttr.antiCrit/10000+1);
            this.battlePower=Math.round(Math.pow((defencePower*attackPower*speedRate*criticalRate),0.6));
            return this.battlePower;
        }
    
        async attackAction(target){
            console.log(`---------------------------------------------------------------战斗开始`);    
            let that=this;        
            let battlePromise=new Promise(function(resolve,reject){
                battle(resolve,reject,that,target);
                battle(resolve,reject,target,that);
            })
    
            let battleResult=await battlePromise;
            console.log(`--------------------------------------------------------------战斗结束，胜利者为${battleResult}`);
            return battleResult;
    
            function battle(resolve,reject,attacker,defencer){            
                defencer.currentHP=defencer.basicAttr.HP;
                //console.log(defencer);
    
                let attackerSpeedNum=attacker.basicAttr.speed-defencer.basicAttr.antiSpeed;
                attackerSpeedNum=attackerSpeedNum<0?0:attackerSpeedNum;      
    
                let attackerTimer=setInterval(() => {
                    if(attacker.currentHP<=0 || defencer.currentHP<=0){  
                        window.clearInterval(attackerTimer);
                        let winner=attacker.currentHP>defencer.currentHP?attacker.basicAttr.name:defencer.basicAttr.name;
                        resolve(winner);
                        return;                    
                    }else{
                        console.log(`-------${attacker.basicAttr.name} 开始攻击---------`);
                        let damage=Creature.damageCalc(attacker,defencer); 
                        console.log(`${attacker.basicAttr.name}对${defencer.basicAttr.name}造成${damage}点伤害`);
                        defencer.currentHP-=damage;   
                        console.log(`${defencer.basicAttr.name}当前hp为${defencer.currentHP}`);
                    }       
                }, 2000*(10000/(attackerSpeedNum+10000))); 
            }
        }    
    
        autoAttackTimeCalc(target){        
            target.currentHP=target.basicAttr.HP;
            let hitSpeedNum=this.basicAttr.speed-target.basicAttr.antiSpeed;
            hitSpeedNum=hitSpeedNum<0?0:hitSpeedNum;
    
            let hitNeedTime=2000*(10000/(hitSpeedNum+10000));
            let round=0;
            do{
                round++;
                target.currentHP-=Creature.damageCalc(this,target); 
            }while(target.currentHP>0)
            
            return round*hitNeedTime/1000;
        }
    
        static damageCalc(attacker,defencer){
            let baseDamage=attacker.basicAttr.attack*attacker.basicAttr.attack/(defencer.basicAttr.defence*4);
            let resultDamage=Math.random()*10000<(attacker.basicAttr.critical-defencer.basicAttr.antiCrit)?baseDamage*2:baseDamage;
            
            resultDamage=Math.ceil(resultDamage);
            //console.log(`${attacker.basicAttr.name}造成基础伤害：${Math.round(baseDamage)},暴击伤害:${resultDamage}`);
            return resultDamage;
        }
    
        
    }
    
    class Player extends Creature{
        constructor(basicAttr){
            if(!basicAttr)basicAttr={
                level:0,
                HP:0,
                speed:0,
                antiSpeed:0,
                attack:0,
                defence:0,
                critical:0,
                antiCrit:0,
                name:'player',
                outExp:0,
            }
            super(basicAttr);
            this.levelMonsterData={
                currentLevelCount:1,
                challengeTime:0,
                estimatePlayerPower:0,
                inChallenge:false,
                inRepeatAttack:false,
            }
            this.spriteRoot={
                spriteLevel:1,
                spriteCurrentExp:0,            
                rootTypeAndLevel:{
                    speed:{level:0,attr:0},
                    attack:{level:0,attr:0},
                    defence:{level:0,attr:0},
                    HP:{level:0,attr:0},
                    antiSpeed:{level:0,attr:0},
                    critical:{level:0,attr:0},
                    antiCrit:{level:0,attr:0},
                },
                levelupAttr:{
                    attack:0,
                    defence:0,
                    HP:0,
                    speed:0,
                    antiSpeed:0,
                    critical:0,
                    antiCrit:0
                }            
            }; 
            this.practiceRealm={
                practiceLevel:1,
                practiceCurrentExp:0,
                levelupAttr:{
                    attr:{
                        attack:100,
                        defence:100,
                        HP:150,
                        speed:0,
                        antiSpeed:0,
                        critical:0,
                        antiCrit:0
                    }
                },
                gradeAttr:{
                    level:0,
                    attr:{
                        speed:0,
                        attack:0,
                        defence:0,
                        HP:0,
                        antiSpeed:0,
                        critical:0,
                        antiCrit:0
                    }
                },
                realmAttr:{
                    level:1,
                    attr:{
                        speed:0,
                        attack:0,
                        defence:0,
                        HP:0,
                        antiSpeed:0,
                        critical:0,
                        antiCrit:0
                    }
                }
            };
            this.initAttr={
                speed:200,
                attack:0,
                defence:0,
                HP:0,
                antiSpeed:0,
                critical:500,
                antiCrit:0
            }
            
            this.initFromSave();
        }
    
        initFromSave(){
            if(GM_getValue("saveData")){
                //let saveData=window.localStorage.getItem("saveData");
                let saveData=GM_getValue("saveData");
                //this.basicAttr=saveData.basicAttr;
                this.initAttr=saveData.initAttr;
                this.levelMonsterData=saveData.levelMonsterData;
                this.practiceRealm=saveData.practiceRealm;
                this.spriteRoot=saveData.spriteRoot;
                this.levelMonsterData.inChallenge=false;
                this.levelMonsterData.inRepeatAttack=false;
                this.totalAttrCalc();
            }else{
    
            }
        }
    
        //每次有任何系统升级的时候，都调用一次这个函数，重新计算人物属性
        totalAttrCalc(){
            let attrsString=['attack','defence','HP','speed','antiSpeed','critical','antiCrit'];
    
            attrsString.forEach((attrString)=>{
                //console.log(attrString);
                let totalAttr=this.initAttr[attrString]
                +this.spriteRoot.rootTypeAndLevel[attrString].attr
                +this.practiceRealm.levelupAttr.attr[attrString]
                +this.practiceRealm.gradeAttr.attr[attrString]
                +this.practiceRealm.realmAttr.attr[attrString]
                +this.spriteRoot.levelupAttr[attrString]
                ;
        
                this.basicAttr[attrString]=totalAttr;   
                //console.log(this.basicAttr[attrString])
            })
    
            levelMonster.ifAutoChallenge(this);
        }
    
    }
    
    var spriteRoot={
        rootAwake(player){
            let rootType=Math.floor(Math.random()*7)+1;
            //1攻击	2降速	3气血	4暴击	5防御	6速度	7抗暴
            let enumType=["attack","antiSpeed","HP","critical","defence","speed","antiCrit"];
            let rootAttr;
            let rootTypeLevel=player.spriteRoot.rootTypeAndLevel[enumType[rootType-1]].level+1;
            switch(rootType){
                case 1:
                case 5:
                    rootAttr=100*rootTypeLevel+rootTypeLevel*(rootTypeLevel-1)/2*10;
                    break;
                case 3:
                    rootAttr=150*rootTypeLevel+rootTypeLevel*(rootTypeLevel-1)/2*15;//150+(rootTypeLevel-1)*15;
                    break;
                default:
                    rootAttr=200*rootTypeLevel+rootTypeLevel*(rootTypeLevel-1)/2*20;//200+(rootTypeLevel-1)*20;
                    break;
            }
            player.spriteRoot.rootTypeAndLevel[enumType[rootType-1]].level=rootTypeLevel;
            player.spriteRoot.rootTypeAndLevel[enumType[rootType-1]].attr=rootAttr;        
        },
        levelupProcess(player){
            let rootType=Math.floor(Math.random()*7)+1;
            let enumType=["attack","antiSpeed","HP","critical","defence","speed","antiCrit"];
            let enumNum=[10,30,20,30,20,30,30];        
            let attrNum=Math.floor(Math.random()*enumNum[rootType-1])+1;
    
            player.spriteRoot.levelupAttr[enumType[rootType-1]]+=attrNum;
    
        },
        calcLevel(player){        
            let expTable=`100
            200
            300
            400
            500
            600
            700
            800
            900
            1000
            1500
            2000
            2500
            3000
            3500
            4000
            4500
            5000
            5500
            6000
            8000
            10000
            12000
            14000
            16000
            18000
            20000
            22000
            24000
            26000`;
            expTable = expTable.split("\n");
            let level=player.spriteRoot.spriteLevel;
            let currentExp=player.spriteRoot.spriteCurrentExp;
            let lvlupExp=0;
    
            
            //30s计算一次
            currentExp=currentExp+30*50;
            do{            
                if(level<=30){
                    lvlupExp=parseInt(expTable[level-1]);
                }else{
                    lvlupExp=Math.round((level+26000+(level-30)*1000)/100)*100;
                }
    
                if((currentExp-lvlupExp)>=0){
                    currentExp=currentExp-lvlupExp;
                    level++;
                    player.basicAttr.level=level;
                    //console.log(`灵识等级:${level},升级经验:${lvlupExp},当前经验:${currentExp}`);
                    spriteRoot.levelupProcess(player);
                    if(level%10===0){
                        spriteRoot.rootAwake(player);
                    }
                    player.totalAttrCalc();
                }
                console.log(`灵识等级:${level},升级经验:${lvlupExp},当前经验:${currentExp}`);
            }while(currentExp>lvlupExp)
    
            player.spriteRoot.spriteLevel=level;
            player.spriteRoot.spriteCurrentExp=currentExp; 
        }
    }
    
    /* var createTime;
    if(!GM_getValue('createTime')){
        createTime=d.getTime();
        GM_setValue('createTime',createTime);
    }else{
        createTime=GM_getValue('createTime')
    } */

    var practiceRealm={
        calcLevel(player,levelMonster,expType={time:30}){
            let expTable=`900
            900
            900
            900
            900
            900
            900
            900
            900
            1000
            1000
            1000
            1000
            1000
            1000
            1000
            1000
            1000
            1000
            1000
            1000
            1100
            1100
            1100
            1100
            1100
            1100
            1100
            1100
            1100
            1800
            1800
            1800
            1900
            1900
            1900
            1900
            1900
            1900
            2000
            2000
            2000
            2000
            2000
            2000
            2700
            2700
            2700
            2700
            2800
            2800
            2800
            2800
            2800
            2900
            2900
            2900
            2900
            3500
            3500
            5700
            5800
            5800
            5900
            5900
            6000
            7800
            7900
            7900
            8000
            8100
            8100
            8200
            9300
            9400
            9400
            9500
            9600
            9700
            9800
            9800
            9900
            10000
            10100
            10200
            10200
            10600
            10700
            10700
            10800
            17600
            20400
            20600
            20800
            21000
            21200
            21400
            21600
            21800
            22000
            22200
            22400
            22700
            22900
            23100
            24500
            24700
            24900
            25200
            25400
            25600
            25800
            26000
            26200
            26900
            27100
            27300
            27500
            27700
            27900
            45600
            46000
            55500
            56100
            56700
            57300
            57800
            58500
            59100
            59600
            60500
            61000
            61600
            62300
            62800
            63400
            66800
            67400
            68000
            68500
            69100
            69700
            70200
            70800
            72400
            73000
            73500
            74100
            74700
            75300
            122800
            137800
            139100
            140600
            142200
            143700
            145200
            146800
            148400
            149800
            152000
            153700
            162800
            164200
            165700
            167100
            168600
            170000
            185700
            191400
            193000
            194600
            196200
            204100
            205800
            207400
            209100
            215100
            216800
            218500
            356400
            367500
            371800
            376100
            380500
            392900
            397600
            401800
            406300
            439300
            443400
            447300
            451300
            455300
            463700
            472100
            476200
            480300
            484300
            488400
            492500
            496500
            500600
            504700
            508700
            514100
            519200
            533700
            537900
            582900
            959300
            985300
            995000
            1004600
            1014300
            1144400
            1155300
            1165900
            1176800
            1187600
            1198400
            1209100
            1223100
            1244800
            1260800
            1275800
            1291100
            1305600
            1450800
            1466900
            1490600
            1507100
            1524900
            1541500
            1559500
            1621100
            1667900
            1680900
            1694100
            1707200
            2785500
            2870100
            2898400
            2926200
            2954500
            2982600
            3010900
            3038700
            3304900
            3352600
            3408600
            3513100
            3555300
            3605800
            3654300
            3705500
            3746300
            4083100
            4137400
            4206600
            4267000
            4302200
            4337700
            4535900
            4625500
            4662400
            4699700
            4871700
            5064000
            5128200`
            expTable = expTable.split("\n");
            let level=player.practiceRealm.practiceLevel;
            let currentExp=player.practiceRealm.practiceCurrentExp;
            //console.log(currentExp);
            let lvlupExp=0;
            
     
    
            if(expType.exp){
                currentExp+=expType.exp;
            }else{
                //30秒计算一次经验
                let clearLevelTime=player.autoAttackTimeCalc(levelMonster);
                currentExp+=Math.round(30/clearLevelTime*levelMonster.basicAttr.outExp);
                //console.log(Math.round(30/clearLevelTime*levelMonster.basicAttr.outExp));
                //console.log(currentExp);
            }
    
            
            do{  
                lvlupExp=parseInt(expTable[level-1]);   
                console.log(`境界等级:${level},升级经验:${lvlupExp},当前经验:${currentExp}`);       
                if((currentExp-lvlupExp)>=0){
                    currentExp=currentExp-lvlupExp;
                    level++;
                    //console.log(`境界等级:${level},升级经验:${lvlupExp},当前经验:${currentExp}`);
                    practiceRealm.levelUpProcess(player);
                    if(level%10===0){
                        practiceRealm.gradeProcess(player);
                    }else if(level%30===1 && level>1){
                        practiceRealm.realmProcess(player);
                    }
                    
                    player.totalAttrCalc();
                }
                
            }while(currentExp>lvlupExp)
    
            player.practiceRealm.practiceLevel=level;
            player.practiceRealm.practiceCurrentExp=currentExp;        
        },
        levelUpProcess(player){
            let level=player.practiceRealm.practiceLevel;
            player.practiceRealm.levelupAttr.attr={
                attack:100+(level-1)*25,
                HP:Math.round((100+(level-1)*25)*1.5),
                defence:100+(level-1)*25,
                speed:0,
                antiSpeed:0,
                critical:0,
                antiCrit:0,
            }
        },
        gradeProcess(player){
            player.practiceRealm.gradeAttr.level++;
            let level=player.practiceRealm.gradeAttr.level;
            player.practiceRealm.gradeAttr.attr={
                speed:level*50,
                antiSpeed:level*50,
                critical:level*50,
                antiCrit:level*50,
                attack:0,
                HP:0,
                defence:0,
            }
        },
        realmProcess(player){
            player.practiceRealm.realmAttr.level++;
            let level=player.practiceRealm.realmAttr.level;
    
            let attrTable=`速度	降速	暴击	抗暴	攻击	防御	血量
            0	0	0	0	0	0	0
            500	0	500	0	200	0	300
            1000	0	1000	0	400	200	300
            1000	500	1000	500	400	400	600
            1500	500	1500	500	600	600	600
            1500	1000	2000	1000	600	600	900
            2000	1000	2000	1500	800	800	900
            2500	1500	2500	1500	800	800	1200
            3000	1500	3000	1500	1000	1000	1500     
            `
            let attrArray=attrTable.split("\n");
            let attrs=attrArray[level].split("\t");
    
            
            player.practiceRealm.realmAttr.attr={
                speed:parseInt(attrs[0]),
                attack:parseInt(attrs[4]),
                defence:parseInt(attrs[5]),
                HP:parseInt(attrs[6]),
                antiSpeed:parseInt(attrs[1]),
                critical:parseInt(attrs[2]),
                antiCrit:parseInt(attrs[3]),
            }
    
        }
    
    }

    var levelMonster={
        getMonster(levelCount){
            //攻击	防御	气血	暴击	降速	速度	抗暴	exp
            let levelMonsterTable=`96	96	108	80	0	110	0	10
            74	112	111	99	6	99	4	10
            117	117	158	132	10	96	12	10
            107	95	159	130	12	143	14	10
            132	119	157	126	22	154	16	10
            131	160	237	150	28	180	28	10
            126	126	234	160	36	160	36	10
            205	188	278	187	32	187	32	10
            147	147	326	216	36	180	48	10
            205	205	340	222	59	198	70	11
            210	189	310	200	40	200	60	11
            223	178	296	252	55	252	66	11
            189	236	418	242	60	220	48	11
            224	199	294	184	78	276	52	11
            210	210	463	264	56	264	84	11
            275	330	486	275	68	200	90	11
            346	230	339	260	80	286	80	11
            271	331	532	297	77	216	68	11
            283	345	370	336	81	308	90	11
            340	383	500	415	111	302	111	12
            340	272	400	330	100	360	120	12
            282	353	415	372	95	310	105	12
            439	366	592	352	121	256	121	12
            417	417	446	297	92	297	138	12
            314	314	518	408	120	408	144	12
            486	324	536	385	100	350	100	12
            334	418	737	360	156	360	156	12
            345	431	570	296	108	370	122	12
            355	533	522	418	126	380	112	12
            594	713	698	608	189	608	226	13
            423	376	552	480	180	440	150	13
            531	386	851	369	171	492	186	13
            546	496	582	420	160	504	128	13
            407	509	672	430	132	387	198	13
            574	522	613	352	170	352	187	13
            589	589	864	360	210	450	140	13
            548	493	804	506	144	552	162	13
            505	673	988	376	167	423	185	13
            689	574	842	432	209	480	171	13
            839	610	1119	637	279	510	304	14
            600	720	792	500	180	550	200	14
            552	552	899	561	246	459	246	14
            751	751	734	416	252	520	189	14
            575	767	1031	477	237	477	215	14
            652	522	860	486	176	594	242	14
            665	798	975	605	248	605	203	14
            746	542	1093	616	253	448	207	14
            553	829	810	456	235	570	259	14
            704	563	1135	522	216	580	264	14
            932	746	1093	844	287	920	255	15
            657	730	963	660	200	480	275	15
            892	743	980	488	255	732	230	15
            907	832	1330	620	208	682	208	15
            692	769	1240	567	292	504	239	15
            782	626	1146	768	270	640	243	15
            716	795	1165	715	248	585	248	15
            970	808	1421	594	308	660	336	15
            821	821	1083	804	285	804	228	15
            1001	667	1466	816	290	816	319	15
            991	1211	1613	1076	384	987	460	16
            1032	688	1512	700	270	560	330	16
            1048	1048	1023	852	275	852	305	16
            709	797	1298	648	248	864	310	16
            899	719	1054	876	347	803	347	16
            912	821	1202	888	288	666	352	16
            833	925	1220	600	325	600	358	16
            938	750	1511	912	297	836	264	16
            951	1141	1254	770	402	847	302	16
            771	868	1271	858	374	936	306	16
            1270	1143	2046	1232	359	1130	404	17
            1188	891	1740	800	420	880	280	17
            1003	903	1469	810	391	810	355	17
            914	914	1339	738	324	820	324	17
            1235	1029	1507	664	292	664	329	17
            1042	1042	1831	840	444	756	407	17
            950	844	1236	765	375	935	413	17
            1068	961	1251	946	304	1032	418	17
            973	973	1583	783	347	1044	385	17
            985	875	1282	704	429	792	312	17
            1151	1583	1686	1273	462	1157	565	18
            1232	1120	1640	900	440	810	440	18
            1133	1246	1493	728	486	910	324	18
            1375	1146	1678	1104	328	736	451	18
            927	927	1527	1023	415	930	332	18
            1172	1172	2059	846	378	846	336	18
            1185	1422	1909	1045	340	950	510	18
            1198	1318	1579	1056	387	864	473	18
            1090	969	1596	1067	435	1067	348	18
            1224	1224	1613	882	352	784	396	18
            1769	1930	2590	1287	521	1030	694	19
            1500	1000	1647	1200	360	800	360	19
            1389	1010	1479	808	455	808	364	19
            1276	1404	1681	1122	414	816	460	19
            1547	1418	2076	927	558	1133	558	19
            1042	1432	1715	832	564	832	376	19
            1447	1447	1540	840	380	1155	428	19
            1062	1461	2333	1272	432	954	480	19
            1073	1207	1963	1177	485	1070	582	19
            1489	1354	1586	1296	539	864	392	19
            1422	1955	2341	1417	515	1417	708	20
            1102	1516	2422	1319	499	1319	499	20
            1111	1250	2035	886	503	997	553	20
            1680	1260	1642	1340	507	1117	608	20
            1693	1552	1655	1351	511	1126	511	20
            1564	1422	1669	908	464	1022	464	20
            1146	1290	2524	1030	571	1373	519	20
            1588	1300	1908	1038	418	1384	575	20
            1310	1455	2137	930	580	1394	422	20
            1466	1319	1939	937	584	1054	478	20
            2304	2112	2258	1381	696	1534	626	21
            1786	1339	2626	1189	647	1427	647	21
            1199	1799	2426	958	597	1438	543	21
            1208	1812	2222	1207	656	1448	438	21
            1521	1217	2015	1094	551	973	551	21
            1532	1685	2482	1225	611	1470	555	21
            1543	1389	2046	1234	671	987	671	21
            1399	1554	2061	1243	619	1492	507	21
            1565	1878	1846	1127	454	1252	454	21
            1261	1418	2092	1135	457	1009	571	21
            2269	2269	3043	1321	897	1816	673	22
            1918	1918	2122	1151	695	1535	521	22
            1931	1448	2850	1288	525	1417	583	22
            1944	1296	2631	1297	470	1038	704	22
            1468	1957	1927	1045	709	1567	709	22
            1642	1314	2426	1052	595	1447	476	22
            1984	1653	2443	1456	599	1192	599	22
            1997	1997	2952	1466	543	1600	724	22
            1508	2010	2229	1476	486	1342	486	22
            1517	1349	1995	1621	550	1351	611	22
            2427	2647	2611	2122	720	1945	959	23
            2050	1879	3034	1369	557	1095	743	23
            1891	1547	3054	1240	685	1654	685	23
            1384	1557	2306	1248	502	1387	502	23
            2089	1567	3095	1536	631	1396	505	23
            1402	2102	3115	1686	699	1405	508	23
            1763	2116	3136	1697	511	1414	703	23
            1597	1419	2893	1281	579	1708	643	23
            1607	1964	2118	1575	582	1146	647	23
            1437	1437	2930	1729	781	1729	521	23
            2114	2114	4182	1885	1022	2074	937	24
            1818	2182	3238	1605	593	1459	659	24
            1646	2195	2172	1615	663	1762	796	24
            2208	1656	3005	1329	534	1772	667	24
            1666	2221	3024	1189	537	1783	537	24
            2048	2234	2766	1645	675	1495	608	24
            1498	1686	2226	1354	611	1203	543	24
            2072	1696	3080	1210	615	1816	820	24
            2274	2274	3099	1218	824	1522	687	24
            1525	2287	2834	1531	829	1837	691	24
            2492	1994	3336	2402	723	1602	723	25
            1542	1542	2581	1859	559	1859	839	25
            1551	2133	3174	1558	844	1558	844	25
            1950	1755	2322	1880	636	1567	848	25
            2353	2157	2627	1734	782	1418	569	25
            1578	1972	3230	1744	858	1744	858	25
            2380	1785	2953	1753	863	1594	575	25
            1795	2193	2376	1282	651	1924	651	25
            2406	1805	2688	1290	727	1451	800	25
            1814	2218	2403	1297	585	1783	877	25
            2108	3162	3142	2543	764	2331	764	26
            2242	2242	3038	1311	887	1967	813	26
            2049	1844	2444	1813	669	1813	817	26
            1648	1648	3072	1657	672	1988	747	26
            1864	1864	2471	1999	676	1333	751	26
            1874	2498	2485	1675	831	1508	906	26
            2093	2302	3123	1516	683	1852	759	26
            2314	1894	2826	1524	610	1862	610	26
            1692	1692	3473	1702	767	1362	614	26
            2551	2339	2539	1369	771	1882	848	26
            2778	3056	4978	2683	1008	1789	806	27
            1718	2148	2887	1902	701	1383	857	27
            2591	2159	2903	1564	940	1738	705	27
            2387	2604	2918	1572	787	1398	866	27
            2399	2181	3585	1405	870	1932	791	27
            1973	1754	3931	1589	795	2118	795	27
            2203	1762	3622	1774	719	1597	959	27
            1993	2435	3310	1961	642	2140	883	27
            2670	2225	3660	1792	646	1792	726	27
            2012	2460	2675	1801	892	1981	892	27
            2629	3213	3932	2118	1165	2824	1271	28
            2710	2484	3716	2001	983	2183	901	28
            2723	2496	2716	2194	988	2194	905	28
            2508	2508	3071	1837	662	1653	744	28
            2520	1833	2743	2215	665	1477	748	28
            2762	2762	2757	1670	752	1484	835	28
            2544	2544	2770	2050	1007	1491	1007	28
            1859	2556	2784	2248	759	1498	843	28
            2802	1868	3147	2258	847	1694	847	28
            2346	1877	3163	2080	851	2080	766	28
            2758	3677	3672	2717	1000	2470	1334	29
            2605	2368	2838	1909	859	1527	687	29
            2855	1903	3209	1918	949	1534	1036	29
            2629	2868	3224	1927	780	2312	867	29
            2161	2401	4319	1936	784	1549	871	29
            2653	2412	4339	1751	875	1556	1050	29
            2908	2423	3996	2149	791	1759	791	29
            2677	2921	3285	1963	1060	1570	1060	29
            2690	2690	2934	1578	710	1775	798	29
            1965	2210	3684	1585	802	1585	980	29
            3528	3207	5292	2070	1396	3104	1164	30
            2476	2228	2972	2197	899	2396	1079	30
            2734	2237	4475	1804	993	1603	993	30
            2743	2743	4117	2212	816	1609	907	30
            2253	2253	3006	2422	1002	2422	820	30
            2261	2763	3394	2228	915	2025	824	30
            2521	2269	3028	1829	919	2235	735	30
            2530	3036	3419	2039	738	2039	1108	30
            2285	2793	4194	1841	742	1841	834	30
            2293	2548	3062	1848	931	2464	745	30
            2992	3989	5493	2946	1459	2410	1216	31
            3079	2823	4626	1654	939	1654	1127	31
            2575	3090	4643	2074	754	2489	849	31
            2326	2326	3495	2497	947	1665	1042	31
            2852	2074	4287	2088	951	1879	1046	31
            2862	2082	3911	2095	1146	1676	764	31
            2089	2611	4710	2312	863	2102	1151	31
            2096	2882	3151	2531	867	1687	1059	31
            2629	2103	3558	2539	870	2328	1064	31
            2110	2902	3174	2123	1068	2548	1068	31
            3441	2753	5175	2769	1521	3046	1521	32
            2656	3187	3196	1710	881	2351	979	32
            2132	3198	4811	2358	786	2573	885	32
            2674	3209	4425	2151	790	1936	1184	32
            2146	2146	4441	1726	1189	1726	793	32
            2154	2423	4456	2598	796	2165	1095	32
            2971	2431	4065	1738	999	1738	999	32
            2439	2168	4079	2179	903	1961	1204	32
            2719	2175	4093	1749	906	1967	1007	32
            2728	2182	4107	1974	809	2412	809	32
            3202	2846	4822	2574	1583	2574	1451	33
            2197	3295	3722	2428	1223	2428	917	33
            3031	2480	4149	1993	818	2214	1023	33
            3317	2211	4996	2443	1130	1777	1232	33
            2496	2218	4177	2228	928	2674	1031	33
            3338	3338	3772	2459	932	2682	1035	33
            2791	2233	3785	2466	1247	2690	1143	33
            3080	3360	5063	1799	939	2474	1252	33
            2528	2809	3810	2030	942	1805	1152	33
            2254	3100	5096	2263	1156	2489	1156	33
            4410	2940	5539	3541	1646	2951	1234	34
            2269	3403	4703	2049	847	2505	847	34
            3414	2276	5147	2056	1169	2284	1063	34
            2569	2283	3873	1833	960	2520	1067	34
            2863	3436	4317	2758	1285	2298	857	34
            2872	3446	4764	2305	968	1844	968	34
            2593	3457	3476	2081	1187	2312	863	34
            3179	2890	4359	2087	866	2551	1083	34
            2609	2319	4373	2326	1196	2093	1087	34
            3490	2908	3948	1866	1091	2800	873	34
            4171	3413	5149	3650	1424	3650	1424	35
            2633	3219	5298	2347	1099	2816	1209	35
            3229	3229	4872	2589	993	2589	993	35
            2355	2944	3554	2833	886	1889	1107	35
            2362	3248	4011	2368	1222	2368	1111	35
            2962	2666	3577	2375	1004	2850	1338	35
            2971	3565	5382	2382	1007	1906	895	35
            2682	2384	4049	2628	1235	1911	1235	35
            2989	2690	4964	2156	902	2636	1014	35
            2398	2398	4074	2403	1357	2163	1131	35
            4691	3909	5903	3446	1476	2820	1476	36
            3619	2714	5011	2900	1025	2659	1025	36
            3025	3025	3655	2424	1029	2424	1029	36
            3034	2731	4125	2431	1147	2188	1147	36
            3347	3043	4597	2194	921	2438	1036	36
            2747	3662	4150	2201	924	1956	1271	36
            3367	2755	4625	2452	1391	2207	1043	36
            2763	3070	5103	2951	1047	2705	1163	36
            2771	2771	5118	2219	1050	2713	1167	36
            2779	3088	5134	1978	1288	1978	1288	36
            4429	3623	7302	3869	1680	3546	1833	37
            2795	3417	5165	2487	1061	2984	1297	37
            3738	2804	4238	2743	1183	2245	946	37
            3749	2499	5195	2501	950	3001	1187	37
            2506	2820	5684	2508	1310	2006	1429	37
            2828	3142	4751	2264	1076	3018	1315	37
            2836	3781	3812	3026	1079	2522	959	37
            3160	2844	5735	2023	1444	2529	1444	37
            3169	2852	4793	2029	1086	2029	966	37
            2542	2860	5288	2797	1211	2543	969	37
            4143	3314	6894	3978	1895	2652	1422	38
            3196	3516	4352	3068	1097	2813	1097	38
            3205	3526	4364	2820	1468	2564	1101	38
            3857	2893	4377	2828	1104	2828	1472	38
            3223	2901	4877	2578	1108	3094	985	38
            2909	3878	5380	2068	1482	2844	1482	38
            2917	2917	5396	3110	1363	2592	1115	38
            3575	3250	3935	3119	1492	2339	1367	38
            3911	3911	3946	3127	1372	2867	1496	38
            3268	3268	3958	2874	1251	2874	1376	38
            3408	5112	6449	3406	1958	4087	1305	39
            3286	2629	5473	2364	1511	2364	1133	39
            3625	2966	5987	2107	1137	2634	1137	39
            3634	3634	5003	2641	1520	2641	1014	39
            3313	3313	4014	2383	1017	2118	1144	39
            2658	3986	4528	2390	1020	3186	1403	39
            3664	2998	6054	2130	1407	2396	1023	39
            4008	4008	6071	3203	1283	2135	1540	39
            3014	3014	5580	2676	1544	2408	1030	39
            4030	4030	5087	3220	1420	2951	1033	39
            4815	3939	7958	3847	2020	2798	1347	40
            3036	2698	4599	2695	1556	3234	1038	40
            3041	2703	6143	2970	1559	2430	1429	40
            3385	2708	5128	3246	1431	3246	1431	40
            3730	3391	5137	2439	1564	2710	1173	40
            3397	3737	6175	2444	1305	2172	1305	40
            3743	2722	4640	3264	1046	2992	1438	40
            3750	3409	4648	2725	1178	2180	1047	40
            2732	3074	4138	2457	1180	2730	1442	40
            4105	3079	5700	3009	1313	3282	1313	40
            4455	4010	6748	2850	1368	4274	2051	41
            3433	3090	4160	2745	1054	2471	1317	41
            3783	3439	5209	2200	1187	3025	1319	41
            3790	3101	5740	2755	1057	3306	1585	41
            3796	3796	6272	3036	1058	3312	1191	41
            3111	4148	4712	3318	1325	2212	1458	41
            4156	3463	6294	2770	1592	2493	1592	41
            4163	3469	5254	2775	1196	2498	1462	41
            4170	3128	5263	3336	1065	3336	1331	41
            3829	3481	4745	2785	1333	2507	1600	41
            4533	4080	5492	3264	1736	3627	1736	42
            3493	3144	4232	2236	1471	3075	1337	42
            3149	3849	5299	2520	1607	2520	1205	42
            4206	3856	6370	3086	1073	2525	1207	42
            3511	3862	4785	3091	1209	2248	1074	42
            4220	3869	4261	3097	1345	2815	1211	42
            3171	3523	6402	3384	1616	2820	1078	42
            3529	3882	4810	2260	1079	3108	1484	42
            3889	3535	5353	2830	1351	3113	1081	42
            2833	2833	4826	2268	1218	2552	1218	42
            4611	4150	8379	2954	1409	3323	1409	43
            3198	3908	4304	3414	1357	2561	1086	43
            2847	3559	4850	3420	1087	2565	1631	43
            3209	3209	4318	3426	1633	2284	1497	43
            3214	2857	5407	3432	1363	2288	1227	43
            3935	2862	5416	2579	1092	3438	1229	43
            2866	2866	5425	3444	1094	2870	1094	43
            4307	2871	4347	2300	1095	2875	1506	43
            3595	4314	4899	2304	1371	2592	1371	43
            3601	3961	4907	2308	1373	2885	1510	43
            5627	5158	7809	3006	1788	3006	1430	44
            2890	3613	4923	2316	1515	2895	1102	44
            3257	3619	4383	2320	1655	3190	1241	44
            3263	3625	5488	2324	1243	2324	1243	44
            3631	3994	6596	3492	1106	3201	1245	44
            2910	4364	4405	2915	1662	2624	1247	44
            4372	4007	5515	3212	1248	2628	1387	44
            4014	4379	6076	2633	1389	2340	1111	44
            4021	4386	4426	2930	1669	3223	1113	44
            4027	3661	4434	2935	1254	2348	1393	44
            4767	4767	6495	3058	1995	4586	1995	45
            4040	4408	6672	2945	1676	3534	1118	45
            2943	3679	6683	2950	1679	3540	1259	45
            3685	4422	5020	2364	1261	2364	1681	45
            2953	3691	5028	2664	1684	2960	1263	45
            3327	3327	6715	3262	1265	2669	1686	45
            2962	3333	5605	2970	1266	2970	1126	45
            3338	4080	6737	3570	1409	2975	1691	45
            3715	3715	6185	2384	1693	2980	1411	45
            2977	4465	5632	2985	1696	3284	1696	45
            4361	5814	8067	3498	1656	3498	1840	46
            3360	4480	6780	3594	1559	2696	1559	46
            4113	3739	6225	3000	1419	3000	1135	46
            2996	2996	5101	2705	1421	2404	1705	46
            4126	3001	6245	2408	1565	2709	1281	46
            4508	4508	6823	3015	1283	2412	1283	46
            4516	4139	5126	3020	1570	3322	1142	46
            3015	3769	6845	3025	1572	3328	1572	46
            4153	4153	5142	3030	1717	2424	1574	46
            4537	3403	4578	3339	1433	3642	1433	46
            5415	4431	5960	3162	2239	3952	1679	47
            3793	4552	4592	2436	1437	3350	1724	47
            4559	3799	6324	3355	1295	3660	1151	47
            3044	4566	6910	2750	1441	3055	1297	47
            3811	3430	6344	3672	1587	3672	1732	47
            4199	3435	6931	2452	1590	3372	1445	47
            4205	3058	6942	3070	1302	2763	1158	47
            3063	3829	4635	3383	1449	2460	1449	47
            4219	3452	6383	3080	1451	3080	1451	47
            4225	4609	4650	3394	1744	3085	1453	47
            5001	5501	6054	3615	2270	4017	1892	48
            3468	3468	4664	3405	1603	3405	1166	48
            3859	4631	5255	3100	1605	3410	1751	48
            3865	3865	6433	2795	1461	3416	1315	48
            4258	3484	6443	3110	1756	2488	1317	48
            4265	3877	5279	3115	1172	3738	1172	48
            4271	3883	5288	2496	1467	3120	1320	48
            3111	4278	4707	3750	1763	3125	1616	48
            3116	3895	7072	3130	1177	2817	1471	48
            4291	3121	7082	2508	1178	2508	1620	48
            5079	6095	7684	3674	1534	3674	2301	49
            4696	3522	5328	3145	1182	3145	1182	49
            4311	3527	5929	2835	1627	3150	1775	49
            4710	3140	5344	3786	1333	3786	1481	49
            3931	3145	5947	2528	1186	3476	1631	49
            3937	3937	6552	2532	1634	3165	1485	49
            3154	3549	5369	2853	1487	3804	1338	49
            3159	3949	5377	2858	1638	2858	1340	49
            4746	3164	4786	3498	1789	3180	1640	49
            3565	3961	5992	3504	1344	3185	1792	49
            5673	6189	7801	3732	2138	4976	1555	50
            3178	4768	6611	3834	1647	3515	1647	50
            3183	4775	5417	3520	1349	2560	1649	50
            4782	3188	6028	2564	1501	3205	1501	50
            4390	3193	6641	2568	1804	3531	1353	50
            3597	3198	4837	3858	1355	2572	1806	50
            4003	3603	7266	2576	1808	2576	1356	50
            4811	3608	6670	3225	1207	2580	1207	50
            3212	4417	6680	3876	1209	3553	1662	50
            3217	4423	6690	3235	1210	2912	1513	50
            5759	4712	6335	4633	2166	4212	1970	51
            3630	4436	4880	2596	1365	3894	1365	51
            4847	4039	7331	2600	1215	3250	1215	51
            4450	4854	7342	2930	1217	2930	1521	51
            3646	4051	5514	3586	1675	3260	1371	51
            4057	3651	5522	3265	1220	3265	1220	51
            3250	4063	7374	3597	1680	3270	1527	51
            4069	3662	6769	3603	1835	3930	1682	51
            4483	3260	6163	2952	1378	3280	1378	51
            3673	4081	6789	3614	1533	3285	1380	51
            6376	5844	8839	4277	1996	4277	2395	52
            4502	4093	7428	3954	1691	3625	1691	52
            4099	3279	5579	2970	1693	3960	1847	52
            4926	4105	6829	3966	1233	2975	1849	52
            4522	3289	4974	3641	1234	3972	1852	52
            4529	3705	6849	3647	1545	3647	1854	52
            3298	3298	6859	3652	1238	2988	1702	52
            4955	4955	4995	2660	1394	2660	1859	52
            4135	3722	5002	3330	1551	3996	1396	52
            4141	3313	5010	3669	1398	3335	1553	52
            4852	6469	8152	4776	1819	4342	1617	53
            4568	4568	6908	2676	1713	3011	1868	53
            3743	3743	7547	4020	1715	2680	1871	53
            3332	4998	5668	2684	1717	3355	1405	53
            5005	4171	6307	3360	1876	2688	1250	53
            5012	3759	5053	4038	1878	3702	1252	53
            5020	3765	5693	2696	1410	2696	1254	53
            4608	3351	5067	2700	1255	3375	1255	53
            3776	5034	6977	3042	1257	4056	1885	53
            3781	3781	7622	3385	1416	4062	1258	53
            6016	6016	9923	3526	1638	4848	2252	54
            5056	4634	7644	3735	1419	2716	1577	54
            3797	4219	5741	3060	1737	3400	1737	54
            3380	3380	6388	4086	1581	3746	1739	54
            5077	4654	6397	3069	1900	3751	1425	54
            5084	5084	7687	3074	1744	2732	1902	54
            5092	3394	7698	4104	1270	2736	1587	54
            3399	4249	6424	2740	1271	3425	1430	54
            3830	4255	6433	3087	1750	3430	1750	54
            3409	5113	7730	3779	1434	4122	1434	54
            4992	6102	10064	4472	2488	4919	1866	55
            4700	4700	6460	2756	1278	2756	1757	55
            4707	4707	5822	4140	1279	4140	1439	55
            4714	4714	5830	3801	1441	3455	1601	55
            4291	3433	5838	3114	1763	2768	1282	55
            3438	4297	5197	2772	1926	4158	1605	55
            4733	3873	7806	3470	1446	4164	1446	55
            3878	3878	7817	3823	1448	4170	1287	55
            4747	3452	5218	4176	1289	3132	1611	55
            5185	5185	5226	4182	1936	3137	1290	55
            5625	5063	7653	4083	2100	4083	2309	56
            3900	3466	5895	4194	1940	3845	1940	56
            3471	3471	7871	3500	1619	2800	1295	56
            3911	5214	5911	3155	1783	3856	1783	56
            3481	3916	7235	3510	1623	3510	1298	56
            4357	4793	5927	3867	1625	3515	1300	56
            3927	4799	6595	2816	1790	3872	1952	56
            4369	5243	5283	3525	1955	4230	1792	56
            4813	4813	6613	4236	1957	3530	1794	56
            4819	4381	6622	3535	1306	3182	1960	56
            5703	5133	7758	5522	2126	4142	1913	57
            3954	3954	7968	2836	1964	3191	1473	57
            5279	5279	7979	3905	1311	3550	1475	57
            4405	4405	5992	3911	1969	4266	1313	57
            5293	4852	7334	2848	1479	3916	1807	57
            3975	4417	6676	2852	1645	3565	1810	57
            3981	3538	7354	3927	1647	3927	1812	57
            4429	5315	5355	3218	1979	4290	1814	57
            4435	4879	6033	3938	1816	4296	1321	57
            3997	3997	8054	3585	1653	4302	1653	57
            6937	6937	6990	4667	2152	5600	1936	58
            4453	3562	6730	4314	1657	4314	1657	58
            5351	4905	8087	3960	1825	2880	1659	58
            3572	5358	6748	3605	1827	3605	1827	58
            4024	3577	5406	2888	1829	3610	1663	58
            4029	4925	7443	4338	1332	3615	1499	58
            4035	4931	6098	2896	1334	4344	1667	58
            4938	4040	5427	3263	2003	2900	1669	58
            5394	5394	7472	4356	1337	3993	2005	58
            4051	4501	8162	2908	2008	3272	2008	58
            4687	6445	10625	5678	1960	4732	2613	59
            5416	4513	7502	4374	2012	3281	2012	59
            3615	4971	8195	3650	1343	3285	2015	59
            4073	4978	6838	2924	1513	2924	2017	59
            4078	3625	8216	4026	1851	4026	1346	59
            4537	5444	5485	4032	1517	2932	1854	59
            4543	4543	6865	3670	1856	4404	1856	59
            4094	5004	6874	3675	1689	2940	1689	59
            4555	4100	7571	4416	1353	3312	1691	59
            5017	4105	6892	3317	1862	2948	2032	59
            4750	5937	7177	5756	2424	4317	1983	60
            4573	3658	7601	2956	1358	2956	1527	60
            5037	3663	5535	3330	2039	4070	1529	60
            5502	5044	5542	4446	1531	2964	2041	60
            3673	4591	8324	4452	2044	3339	1362	60
            4137	4597	7641	4087	1876	4087	1535	60
            3682	5524	6260	4092	1878	4464	1366	60
            4609	4148	6268	3725	1880	2980	1538	60
            4154	3692	5578	3357	1540	2984	1882	60
            3697	4159	6284	3362	1884	3362	1370	60
            6015	4812	8179	3890	2230	3890	2230	61
            4170	3706	7700	4494	1889	3371	2060	61
            5103	3711	8411	4500	1891	4500	1891	61
            4645	5110	6316	3004	1377	4131	1377	61
            4651	4651	8432	4136	1551	4136	1723	61
            4657	4191	7740	3765	1553	4142	2070	61
            4663	5129	6341	4524	2072	3770	1382	61
            4669	5603	7054	3020	1383	3775	1902	61
            4208	3740	7769	3024	1731	3402	1558	61
            3745	5617	7779	4164	1386	3028	1733	61
            7312	5484	7364	4434	2030	4927	2481	62
            4224	3754	8508	4554	1390	3795	1563	62
            3759	3759	8519	4180	2087	4560	1391	62
            5176	4705	5686	3425	1393	4186	1393	62
            5182	3769	7117	4191	1394	3048	1917	62
            4245	5189	7839	3815	2094	4578	1920	62
            5195	4723	7135	3820	2096	4202	1922	62
            4256	4256	8573	4590	2099	4590	1399	62
            3788	5682	7868	3447	1576	3447	1576	62
            5215	4741	8594	3452	1402	3068	2104	62
            4937	6171	10255	5491	2738	5491	2738	63
            5704	3802	8616	4614	2108	3845	1933	63
            5711	4759	5751	3465	2111	3080	1407	63
            5718	4289	6478	4626	2113	3084	1585	63
            4294	5725	7207	4632	1763	3860	1410	63
            5732	4299	7216	3479	1765	3479	2118	63
            4305	3826	5780	3483	1944	4644	1414	63
            3831	5268	7957	4263	1769	4263	1592	63
            4795	3836	5794	3880	1771	3880	2125	63
            4801	5281	7252	4274	2128	4274	1596	63
            7499	6874	10383	5563	1846	4551	2769	64
            4813	5294	8724	4674	1955	3506	1777	64
            4337	5783	8007	3900	1779	3120	2135	64
            5308	5308	6559	3515	1959	3515	1425	64
            3865	4831	8756	3910	1426	3910	1426	64
            4353	5321	8037	3524	1785	4698	1428	64
            5812	3874	6584	3528	1608	4312	1966	64
            3879	4364	8056	4710	1610	4318	1789	64
            4370	4855	8800	3930	2149	3930	2149	64
            4375	4375	6608	3148	1614	3542	2152	64
            5694	7593	7645	5634	2100	5634	1867	65
            5848	5360	5888	4340	2156	3156	1438	65
            4391	4879	8843	4740	1619	4740	1979	65
            5862	5374	5902	4351	2161	3955	1441	65
            5869	4402	7387	4356	1623	4752	1442	65
            4407	5387	8136	3172	2166	3569	1444	65
            3922	5884	5924	4367	1807	3573	1446	65
            4909	4418	7414	4770	1809	3975	1990	65
            5407	4424	5938	3184	2173	4378	1992	65
            4429	4921	8175	4384	1813	4782	1813	65
            5765	7046	8706	4668	1888	4150	2124	66
            3946	5426	8940	3596	1454	4794	1454	66
            5927	5927	6713	4400	1455	4000	2001	66
            4945	4945	8962	4806	1457	3605	2185	66
            4951	3961	5982	4010	2188	4812	2005	66
            3966	4957	6737	4417	2008	4818	2008	66
            4963	5956	5996	4020	1462	4020	1827	66
            4969	4472	8254	4428	2195	4428	1646	66
            3980	4975	6762	3224	2014	4433	1648	66
            4483	5977	9026	3228	1650	3228	1466	66
            5186	5835	8811	4727	2386	4727	2147	67
            5992	5492	8294	4045	1837	3236	1837	67
            5499	4999	6039	3240	2207	4860	1839	67
            6006	5005	6046	3650	1841	4461	1473	67
            6013	5512	9080	3248	1659	4060	1843	67
            4014	4515	9091	3659	1661	4065	1476	67
            5525	4521	7585	4477	2032	4070	1478	67
            4526	5029	6835	4890	2219	4890	2219	67
            4028	4028	7603	4896	1481	3672	1851	67
            6049	4033	8373	3268	1853	3677	2224	67
            6561	7873	11889	5849	2170	5317	2170	68
            4548	4042	8393	3686	1671	3686	1486	68
            4047	4553	9167	3690	2231	3690	2045	68
            5065	4559	9178	4105	1861	3284	1489	68
            5071	5578	6891	4110	1490	4110	2236	68
            6092	4569	7666	3292	1679	4115	1492	68
            6100	4066	9210	4532	1494	3708	1867	68
            4071	4580	9221	3300	2056	4950	1869	68
            5095	5605	9232	4130	1497	3717	1497	68
            5611	6121	8472	3722	1498	4962	1686	68
            7967	7303	11027	4306	2925	4844	1950	69
            4090	5113	8492	3731	1502	4974	1502	69
            5119	5119	8502	3735	2255	4150	1691	69
            4613	4613	6190	3740	1881	3324	2257	69
            5644	4105	6198	4160	1695	4992	1883	69
            4623	5651	8532	3332	2074	3749	1697	69
            4114	4114	6212	3336	1698	4587	1887	69
            4634	5664	9329	3340	1511	4593	2078	69
            6186	5155	6226	3344	2269	5016	1891	69
            4645	4645	8571	3767	2272	3767	1704	69
            6045	6045	12170	6536	1971	5992	2710	70
            6208	4656	6248	4615	1518	4195	1897	70
            6215	5179	7037	4620	1899	4200	1899	70
            5704	4148	7828	4205	1521	3364	2091	70
            5710	5191	8621	4631	2093	3789	2284	70
            4158	4158	7061	3372	2286	5058	2286	70
            4162	5203	7070	5064	1907	3798	1526	70
            5730	4167	8650	3803	1718	5070	1909	70
            5737	6258	7873	3384	1911	5076	1720	70
            6265	4177	8670	4659	2296	5082	2296	70
            7475	7475	8207	6614	2987	5512	2490	71
            5756	4186	8690	3396	1534	3821	1534	71
            4191	5239	7909	5100	1919	3825	1919	71
            4721	4196	9502	3404	2305	4255	1921	71
            4201	5776	8720	4260	2308	4260	2115	71
            4731	6308	8730	3839	1540	4692	2310	71
            4210	6316	8740	3416	1734	4270	1542	71
            5269	4742	9545	4703	2122	3848	2122	71
            4220	5275	8759	3424	1545	4708	2124	71
            4225	4225	8769	3428	2320	3428	2320	71
            6873	7560	10375	6135	2264	6692	2264	72
            6352	6352	9588	4725	1743	5154	2131	72
            5299	4239	7999	3870	1551	3440	1745	72
            5305	4775	6406	3444	2329	3875	1941	72
            5842	4780	8017	4310	2137	3448	1943	72
            5849	4785	9631	3884	1751	4747	2334	72
            4258	4258	6428	3456	2336	4320	1558	72
            5329	5329	9653	3893	1754	4325	1949	72
            5335	6402	9664	3897	2341	4763	2341	72
            6409	4273	7256	4769	2148	4335	1953	72
            6256	7646	9443	4514	2542	6206	3050	73
            4282	5888	6464	3476	1761	3476	1566	73
            5895	6431	9707	4785	1763	3480	2155	73
            5902	5365	8098	4791	1961	4791	2157	73
            5908	4834	6486	5232	2356	5232	1963	73
            5915	5915	8116	3492	1965	5238	1769	73
            4845	4306	7313	3496	1770	5244	2164	73
            5928	4850	9761	5250	1969	4813	1575	73
            5395	4316	9772	4380	1971	3504	1971	73
            5401	4321	7337	4824	2170	4385	2368	73
            5623	7732	9548	6278	2054	5136	2568	74
            5413	6496	8170	5274	1977	3516	1779	74
            5961	4877	9815	4840	1781	5280	1979	74
            4340	5425	6550	5286	1585	4405	2377	74
            5974	4345	6558	3528	2380	4410	1983	74
            5437	5437	8206	3974	2184	3974	1787	74
            4899	5443	6572	4862	2384	3536	2384	74
            4359	4904	9046	3540	2387	3983	2387	74
            5455	6546	8233	3987	1593	4430	1593	74
            5461	6007	9890	5322	1594	5322	2392	74
            7818	8529	10726	5195	2853	4618	2075	75
            6568	6568	6608	4445	1797	5334	1997	75
            6027	6575	7442	5340	2199	5340	1999	75
            5485	5485	9934	4901	1801	4901	2001	75
            6040	5491	6630	5352	2203	4906	1803	75
            6047	5497	8296	5358	2406	4465	2206	75
            5503	5503	9136	4023	2007	4470	2408	75
            6060	6611	6651	5370	2210	4923	2009	75
            6618	6618	7491	5376	2212	4480	2011	75
            5521	4969	9998	4037	1610	5382	1610	75
            8622	8622	10843	5837	2881	7004	2096	76
            6640	6640	8350	5394	1815	5394	1614	76
            4985	4985	7523	4050	2221	5400	1817	76
            6100	6654	10042	5406	1617	4956	2425	76
            4441	5551	7539	3608	2428	4510	2428	76
            5557	6668	10063	4967	2025	4515	1823	76
            4450	6676	8395	4068	1824	4520	2027	76
            5569	4455	6723	4525	1623	4978	2435	76
            4460	5018	9254	3624	2234	4077	2234	76
            6697	5023	8422	4535	2236	4535	2033	76
            6537	8716	13152	7082	2646	6492	2116	77
            6712	6712	6752	4545	2037	5000	1630	77
            4479	5039	9294	4550	1835	4095	2039	77
            6166	4484	8458	4100	1633	4100	2041	77
            5050	6733	6774	4560	2452	5472	1634	77
            5617	6179	8476	4109	1636	5022	2250	77
            4498	5061	6788	5484	1842	5484	1842	77
            6755	5629	9343	5033	1844	4118	2254	77
            5635	5635	9353	5496	1641	4122	1846	77
            4513	5077	8512	3668	2053	5044	1848	77
            6607	5873	12185	7160	2939	5967	2672	78
            6218	5088	8530	5055	1851	4136	2263	78
            4527	5093	7685	4140	2471	3680	2059	78
            5665	5665	9403	5526	2267	5066	1855	78
            5671	6238	10268	5532	2063	4610	2269	78
            5677	6245	9423	4615	2065	4154	2478	78
            6251	6820	10290	4620	1654	4620	1654	78
            6827	6258	10301	4625	2276	4163	2483	78
            6265	6834	9452	5093	2278	4630	1864	78
            4561	5131	9462	5562	1866	5562	2073	78
            8161	5935	8955	7238	2967	7238	3237	79
            5713	6284	9482	4645	2492	3716	2492	79
            6291	5719	8629	4185	2287	4650	2287	79
            5153	5153	6910	5586	2497	5121	2497	79
            6304	5731	10376	4194	2083	5592	2083	79
            5163	6884	8656	5598	2294	5132	2294	79
            5743	6317	6932	5137	2296	4203	1670	79
            5174	5174	9541	5143	2089	5143	2089	79
            4604	6906	7815	5616	1882	3744	2091	79
            6337	5761	6954	4685	1884	3748	2093	79
            8997	6747	12442	6097	2724	6707	3268	80
            5196	5773	9581	3756	2097	5634	2097	80
            6357	4623	9591	3760	2099	4230	2519	80
            5207	6364	9601	4235	2101	4705	2101	80
            6370	6370	8737	4710	2103	5652	1893	80
            4638	5797	10495	4244	1895	5187	2316	80
            6964	6964	9631	5192	2107	4248	1896	80
            6390	6971	10517	5670	2531	5198	2320	80
            6978	5234	7018	3784	2111	4730	1689	80
            5239	5239	7904	3788	2324	4262	1690	80
            9090	9090	9143	6778	3024	6778	2200	81
            4666	6416	7920	3796	2117	5220	1905	81
            5839	7007	8809	3800	2331	4275	2119	81
            6430	7014	10582	5231	1909	5706	2333	81
            4681	4681	10592	5236	2123	3808	1911	81
            6443	6443	7952	5242	2338	5718	1700	81
            6449	6449	9730	5724	2127	4293	2127	81
            4695	4695	9739	5730	1703	3820	2555	81
            5288	7050	8863	4780	2557	5258	2344	81
            4705	6469	8872	4307	2346	4785	1920	81
            8418	9184	9236	4982	2498	6227	3053	82
            5304	5304	7112	4795	1923	5275	2351	82
            5899	6489	10679	3840	2139	3840	1925	82
            5905	5315	10690	5286	1927	5766	2569	82
            6502	6502	9809	4329	1929	3848	2357	82
            5917	5325	8926	5297	2145	5778	2574	82
            5923	7108	8935	3856	1718	5784	1932	82
            5336	7115	8050	4343	2579	5308	2149	82
            6529	5935	9848	5313	2581	5313	2581	82
            6535	5347	8066	5319	2584	4835	1938	82
            9277	8504	11662	6292	2521	6921	3362	83
            5953	5953	9878	4845	1726	4845	1726	83
            4767	6555	10787	5335	1727	5335	2375	83
            5965	7158	8998	4370	1729	5826	2377	83
            5374	6568	10808	3888	2596	5832	2163	83
            5379	5379	8114	3892	2598	4379	1732	83
            4786	4786	9928	4383	1734	4870	1734	83
            7187	5989	9034	4875	2169	3900	2386	83
            5396	5995	7234	4392	1954	3904	2388	83
            6601	7201	9052	5862	2173	3908	1956	83
            7809	8590	9423	5086	2545	5086	2545	84
            5412	6013	8163	4406	2395	4895	1742	84
            6621	7223	10895	4900	1961	4410	2179	84
            6628	7230	9997	3924	1963	5886	1963	84
            5428	6031	7278	3928	1965	4910	1965	84
            6037	7244	10017	5407	1748	5407	1748	84
            6647	6647	10938	3936	2624	4428	1750	84
            4839	4839	9124	3940	1751	4925	2189	84
            6661	4844	7306	3944	2629	4437	2191	84
            4849	6061	10056	3948	2193	3948	2412	84
            9465	7887	10707	5138	2568	7064	2854	85
            6073	6680	10076	5934	2197	4945	1977	85
            6687	6687	7335	3960	2639	3960	2419	85
            4868	5477	11014	5451	2421	3964	1981	85
            4873	6700	7350	5456	2423	3968	2644	85
            6097	5487	9196	3972	2426	3972	1764	85
            7324	6103	11046	5467	2648	5467	2648	85
            7331	7331	7371	4975	2430	5473	2430	85
            7338	7338	9223	4482	2211	3984	1769	85
            6121	6733	7386	5484	2213	4985	2656	85
            8762	7965	10812	5190	2592	7136	3167	86
            4906	7360	10175	5994	2439	3996	1995	86
            4911	4911	9259	4500	1775	4000	2441	86
            4916	7374	8341	5005	2665	4505	1777	86
            5536	7381	9277	4008	2001	5010	2001	86
            4926	4926	10215	5015	2225	5517	1780	86
            5547	4930	9295	5522	2672	5522	2227	86
            6786	4935	7443	4020	2229	4020	2675	86
            5558	7410	10244	5533	2677	5030	2008	86
            4945	5563	11186	5539	2010	4028	2456	86
            6434	6434	13343	7862	2615	5897	3487	87
            6812	6193	9340	4036	2684	5045	2684	87
            7439	5579	10284	5050	2687	4040	2239	87
            5585	7446	10294	4550	2241	5561	1793	87
            6832	5590	10304	4048	2692	4048	1794	87
            6839	4974	11251	6078	2245	6078	2021	87
            7468	7468	11262	5577	2472	5577	2696	87
            6852	6852	9394	5075	2699	5583	2024	87
            6235	5612	9403	5588	2476	4064	2251	87
            6865	6241	10353	5594	2478	4577	2478	87
            8121	8121	11023	5955	3225	6617	2345	88
            5628	6253	7544	4586	1806	6114	2257	88
            7511	7511	9439	4590	1807	4080	2033	88
            6892	5639	10393	5616	2713	5616	2035	88
            5644	6898	11348	4088	2716	4599	2716	88
            5022	7532	8519	5115	2492	5627	2039	88
            7540	5026	7580	5632	1814	6144	2494	88
            5660	5031	9484	6150	1815	5638	1815	88
            7554	5666	10442	5130	1817	4617	1817	88
            5041	6301	9502	4108	2273	4622	2728	88
            9019	9019	14837	6682	2662	8018	2366	89
            5682	6313	7616	6174	2277	5145	1822	89
            5055	5687	9529	6180	2279	6180	2507	89
            5060	5060	11446	4124	2737	5671	1825	89
            6331	6331	8592	4128	1826	5676	2740	89
            5703	5070	9556	5682	1828	6198	2285	89
            5074	5074	11478	6204	2744	5170	2516	89
            5079	7619	9574	6210	2060	5175	2060	89
            5084	7626	10541	5180	2291	4662	2749	89
            6361	6997	9592	4148	2293	4148	2752	89
            9105	8277	9985	5398	3580	7422	2387	90
            5736	5736	10571	4676	2297	4676	2067	90
            7655	5741	7695	4680	2299	6240	2069	90
            7024	7662	8665	5205	1841	5205	2531	90
            7669	6391	10601	5731	2764	4168	2073	90
            6397	6397	11575	4694	2075	5215	2766	90
            5122	5122	8690	4698	2076	6264	2538	90
            7050	5127	8698	5748	2078	5225	2771	90
            7698	7057	8706	4707	2773	5230	2311	90
            7705	6421	8714	4188	2313	5759	2544	90
            7520	10026	11338	5450	3010	6812	2408	91
            5146	5790	7760	4196	1854	4721	2549	91
            6439	7083	7767	4200	2087	6300	2551	91
            7734	6445	10690	4204	2553	4204	1857	91
            5161	7096	8754	4734	2323	5786	2788	91
            5166	7103	7789	4739	2558	4739	1860	91
            7109	5170	7796	5270	2327	5270	1862	91
            6469	5822	8779	5275	2562	5803	2795	91
            5828	7123	8787	5808	2331	5280	2797	91
            5185	5833	8795	5285	2100	6342	1866	91
            10120	10120	13987	6189	3643	6877	2732	92
            6493	5194	8811	5295	2103	4766	2804	92
            5199	6499	7839	5830	2339	5830	2807	92
            7806	5855	7846	5836	2575	6366	2341	92
            6511	7813	7854	4779	1874	5310	2577	92
            5865	6517	8843	4252	2814	4252	2345	92
            6523	6523	9835	5320	2112	4256	2112	92
            5223	5223	7875	5858	2114	4260	2114	92
            6535	7842	9853	6396	2351	4797	2116	92
            6541	7195	7890	5869	2588	4802	1882	92
            6809	6809	10266	6248	2755	5554	3368	93
            5242	7208	7904	5880	2828	5880	1886	93
            5247	7215	11867	5350	2359	5885	2359	93
            6565	5252	11878	5891	2833	4820	1889	93
            6571	5914	10898	5896	2363	6432	1890	93
            7235	5262	8924	6438	2129	4829	2129	93
            7241	6583	8933	5907	2367	6444	1894	93
            6589	7907	10927	5375	1895	6450	2132	93
            7255	6595	11932	6456	2134	4842	2845	93
            7921	7921	10947	5924	2610	5924	2848	93
            8589	10307	11654	6306	2779	7708	3396	94
            5290	5952	9970	6474	2139	5935	2139	94
            6619	7281	9979	4320	2617	6480	2617	94
            6625	5963	8989	4324	2143	5405	2857	94
            5968	7957	7998	5410	2860	5410	2621	94
            7301	5973	10006	4332	1908	4332	2385	94
            7972	7307	10015	4336	2387	5962	2864	94
            7979	5319	9022	6510	1911	5425	2150	94
            6655	7986	10033	6516	2869	5973	2391	94
            5995	6661	11046	6522	2154	6522	2632	94
            8667	7800	13066	7072	2802	7779	3114	95
            6006	8008	8048	4901	2876	6534	2637	95
            7347	7347	10069	4360	2399	4360	1919	95
            8022	8022	9070	5455	2161	6001	2881	95
            6022	6691	10087	5460	2643	4368	2403	95
            7367	6697	11106	6558	2886	6012	1924	95
            6703	5362	8084	6017	1926	6564	2648	95
            6038	6709	9103	4380	2409	6570	2891	95
            7387	5372	12148	5480	2893	6576	2893	95
            8065	6049	9119	5485	2172	4937	2172	95
            8745	9620	14502	6423	3767	5710	3767	96
            5386	6060	11165	6045	2417	5495	2900	96
            6739	5391	11175	4950	2419	6600	2177	96
            6745	8094	12202	5505	1937	6606	1937	96
            7426	6076	12212	4959	2908	4408	2908	96
            6081	5406	9167	4964	2425	4964	2910	96
            6087	8116	11215	6072	2184	4416	2912	96
            7446	7446	12245	6078	1943	6078	2672	96
            8130	5420	12256	6083	2674	6083	2917	96
            5425	8137	9200	4982	1946	5535	2676	96
            10588	9705	14630	6482	3799	5762	3799	97
            6114	6114	12288	6100	1950	4991	2924	97
            8159	6799	12299	5550	2683	5550	2195	97
            7486	7486	12310	6111	2685	4444	2197	97
            5449	8173	8214	4448	1954	5560	2443	97
            7499	8180	8221	5565	1956	5565	1956	97
            5458	6823	9257	5570	2447	6684	2692	97
            6829	5463	12353	6133	2939	6133	2204	97
            6835	6152	9273	6696	2206	6138	2451	97
            6841	6841	11343	6702	2944	5027	2453	97
            8901	9791	14759	6540	3830	7267	3511	98
            5482	6853	12396	4476	2948	5595	1966	98
            8231	6173	10339	6720	2213	4480	2705	98
            7552	8238	9313	4484	2461	5605	2461	98
            8245	7558	12428	4488	2956	6732	2956	98
            7565	6189	10366	5615	2958	4492	1972	98
            6883	8260	10375	5058	2220	5620	2714	98
            6889	6889	10384	6750	2222	5063	2963	98
            7585	8274	10393	6193	1977	5067	2471	98
            5521	6211	11442	5635	1978	6762	2968	98
            9877	7183	14888	8065	3539	8065	2574	99
            7604	6222	12504	5645	1982	4516	1982	99
            7611	6919	11472	5085	2231	4520	2975	99
            6233	7618	12526	4524	2481	6786	1985	99
            7624	5545	8358	4528	2731	4528	2980	99
            6937	7631	12547	5665	2734	6798	2237	99
            6249	8332	12558	6237	2984	5670	2238	99
            6254	6949	9427	6810	2240	6243	2489	99
            6955	7651	11531	5112	2491	6816	2740	99
            6961	6961	12590	6254	2742	6254	1994	99
            9963	8151	16382	5918	3892	6657	2595	100
            6276	5578	12612	5126	2497	5695	2247	100
            8375	7677	12623	6270	2249	5700	2749	100
            6287	7684	12634	5135	2501	6846	3001	100
            6991	8389	12644	5139	2753	6281	2753	100
            6997	8396	10546	5144	3006	4572	2505	100
            6303	7003	11611	5148	2006	5720	2006	100
            8411	7009	8451	6870	3011	5153	2007	100
            7717	7717	9516	4584	2762	5730	2762	100
            7723	5617	8466	4588	2010	5735	2262	100
            7308	8222	13768	6716	2943	7462	2616	101
            5626	5626	9540	4596	2517	5171	2014	101
            6335	6335	8487	5175	2015	5750	2519	101
            7045	6341	12742	4604	3025	6906	2269	101
            6346	8461	10627	4608	2523	6336	2018	101
            8468	6351	11700	5189	2525	5765	2525	101
            6357	8476	10645	5770	2022	6347	2274	101
            6362	5655	9589	5198	2276	5775	3035	101
            8490	7783	12796	6358	3037	5202	2531	101
            7789	7081	11739	4628	2533	6942	2786	101
            10134	11056	11108	6774	3955	8280	3625	102
            8512	7802	11759	5795	3044	4636	2537	102
            8519	8519	8559	5220	2285	5220	2285	102
            7105	8526	9637	4644	2287	5225	2541	102
            7111	7822	11789	4648	2543	6391	2543	102
            8540	7117	9653	5234	2291	5234	2545	102
            5698	6411	12882	4656	2802	6984	2292	102
            5703	7129	12893	6990	2549	5825	2294	102
            7135	5708	10753	5247	2041	5830	2806	102
            7141	7141	8610	4668	2298	7002	2042	102
            8362	8362	14002	9110	3986	6833	3654	103
            7153	5722	11858	6430	2557	5261	3068	103
            8591	6443	8631	4680	2047	7020	2047	103
            7882	8598	8638	7026	3073	5855	2561	103
            8605	5737	10807	5274	2307	6446	2819	103
            5742	8612	10816	5865	2309	5279	2822	103
            8620	8620	9743	6457	2567	4696	2054	103
            7908	7908	9751	6463	2826	7050	2055	103
            5756	6476	13012	5292	2314	5292	2057	103
            7201	7201	9767	5297	2058	5297	2573	103
            7495	8432	15531	6891	3682	6891	4017	104
            8656	8656	8696	5895	2062	5306	2062	104
            6497	7219	13055	7080	2063	7080	2321	104
            6503	8670	11977	5315	2065	6496	2581	104
            7231	5785	10897	6501	3100	4728	2066	104
            7961	8684	11997	6507	2585	4732	2844	104
            7967	7243	12007	7104	2070	5920	2070	104
            7974	5799	10924	5333	2330	5925	2589	104
            6530	7255	8746	4744	2591	6523	3109	104
            6535	8713	9848	5935	2593	5935	2074	104
            7558	7558	15660	6178	3374	8494	3036	105
            7273	5818	13152	7134	2857	6540	2597	105
            6551	8735	10969	4760	2859	6545	2599	105
            8742	8742	8782	7146	2601	4764	2861	105
            8020	7291	13184	6556	3124	5364	3124	105
            8756	8756	8797	6562	2866	7158	3126	105
            8033	8764	9905	5970	2086	6567	2346	105
            8771	6578	8811	4780	2348	5378	2348	105
            7315	6584	8818	5382	2611	4784	2350	105
            6589	6589	12135	5985	2352	5985	3136	105
            7620	11430	11483	9344	3739	9344	3060	106
            6600	6600	12155	5995	3140	7194	2617	106
            8073	7339	12165	5400	2095	5400	2881	106
            5876	8080	8854	6005	3145	7206	2883	106
            6616	8821	11077	7212	3148	4808	2098	106
            8828	8093	13303	6617	2625	6015	2888	106
            7363	8099	11095	6020	2890	7224	3152	106
            6632	6632	11104	6025	2629	5423	2103	106
            7375	8850	8890	6633	2894	4824	2105	106
            7381	7381	10010	7242	2106	6035	2370	106
            9603	10563	13023	9422	3083	7852	3083	107
            5914	8132	12254	5441	2637	5441	2110	107
            5919	7399	11149	4840	2111	7260	2903	107
            8886	5924	11158	6661	2377	7266	3169	107
            8152	7411	11167	4848	2114	6666	2907	107
            8900	6675	10058	6065	2116	6672	2116	107
            8908	5938	11185	6677	3176	6677	2118	107
            8172	7429	11194	7290	2119	5468	2649	107
            8922	7435	8962	6688	2121	6688	2386	107
            6697	5953	10091	7302	2122	7302	2388	107
            11617	11617	13129	7125	3452	6334	4142	108
            6708	8944	13476	4876	2126	6095	2126	108
            8205	6713	8991	6710	3191	7320	2127	108
            6719	8212	12373	6105	2129	6105	3193	108
            8218	6724	13508	5499	2663	4888	2929	108
            5982	8972	9013	7338	2399	4892	2132	108
            7483	8980	12403	7344	2400	6120	3200	108
            6740	8987	10156	6738	2135	5513	2669	108
            8245	7495	11293	6743	3205	6743	2938	108
            6001	9001	10172	6749	2940	6749	2673	108
            9759	9759	11763	9578	3825	9578	3825	109
            7513	7513	12452	6145	3212	6145	2142	109
            8271	6015	13595	6150	2947	4920	2947	109
            9030	6773	10204	7386	3217	6155	2413	109
            8284	9037	9078	5544	2415	5544	2951	109
            6030	6030	10220	6782	2148	6782	2417	109
            7543	8297	12502	4936	2956	4936	2956	109
            6039	9059	12511	6175	2958	6793	2420	109
            6800	6800	13660	5562	3229	5562	2960	109
            8317	9073	12531	6804	2962	5567	2424	109
            8853	8853	16303	8047	2803	6438	3854	110
            9088	6058	13692	6815	2427	6815	2158	110
            9095	6821	12561	7440	2429	4960	2969	110
            7585	7585	11428	7446	2701	6205	2971	110
            9109	8350	13724	7452	2703	6210	3244	110
            9116	6078	11446	6215	2705	4972	2705	110
            7603	6082	12601	4976	2707	7464	3248	110
            7609	8370	9171	6848	2709	6225	2438	110
            7615	8377	10326	6853	2711	4984	3253	110
            9145	8383	9186	7482	3256	6859	2984	110
            8924	10907	14938	8923	3882	8923	3177	111
            8396	7633	13800	7494	2717	6870	2174	111
            6875	7639	9207	6875	2447	7500	2719	111
            8410	6881	12670	7506	2177	7506	2721	111
            7651	6121	11527	6260	2178	5008	3268	111
            6891	6891	10382	6892	2725	6892	2998	111
            7663	9196	10391	6270	2727	6897	2454	111
            7669	8436	13865	5648	2183	5020	2456	111
            6140	6140	13876	5652	2185	5652	2458	111
            7681	6913	10415	5657	3280	5657	3280	111
            9993	8994	18066	9812	2844	8177	4267	112
            7693	7693	11590	6925	2737	7554	2737	112
            7699	6929	10439	6930	3013	6300	2191	112
            6164	6164	13930	6305	2467	5675	3289	112
            8482	9253	11617	5048	3292	5679	2469	112
            9260	6174	9301	6315	2745	6947	2196	112
            6178	8495	10472	5688	2747	6952	3022	112
            9275	6956	10480	6325	2749	5693	2199	112
            7735	6962	13984	5697	3026	5697	3026	112
            9289	6193	9330	5068	3304	5068	2753	112
            10071	10071	15172	9890	3223	6594	3223	113
            6202	8528	9344	6980	2757	5076	3308	113
            9311	6983	9351	7620	3311	6985	2207	113
            6989	6212	12868	7626	2209	6355	3037	113
            6217	9325	14048	6360	2487	7632	3039	113
            6222	7777	14059	5729	2212	7638	3318	113
            6226	9340	11725	7644	3044	6370	2490	113
            6231	8568	10561	5738	2492	5738	2215	113
            8575	9354	11743	5104	2771	7656	2217	113
            9361	6241	11752	6385	3050	5108	2496	113
            9134	11164	18347	9968	3608	6646	3247	114
            7813	7032	14124	7674	2222	5116	2499	114
            9383	6255	11779	5760	2501	6400	3335	114
            7825	7043	9430	6405	2503	5765	2503	114
            7831	7048	11797	5128	2505	7051	2783	114
            8621	7053	14167	7698	3342	7057	3064	114
            7843	7843	14178	7062	2230	5778	2787	114
            7064	7849	11824	7710	2231	5140	3068	114
            7855	7855	13016	6430	3070	5787	3070	114
            8647	8647	10658	5148	3352	5792	2793	114
            8182	12273	16947	9209	3997	8372	3997	115
            8660	8660	14232	6445	3077	7090	2517	115
            9455	9455	10682	5160	2799	5160	3359	115
            7885	9462	13066	6455	2521	5164	2241	115
            7891	9469	9510	5814	2803	5814	2242	115
            9476	6318	14275	6465	3366	7112	2525	115
            6322	8693	11905	7764	2807	7117	3368	115
            9491	9491	14297	6475	2528	5180	3090	115
            6332	9498	14308	7776	3092	7128	2811	115
            6337	7129	13125	6485	2813	6485	2250	115
            11336	9275	13971	10124	2928	10124	4025	116
            7933	8726	14340	5846	3380	7145	2535	116
            8733	9527	11959	7150	3101	7150	3383	116
            7151	8740	9574	7806	2257	5204	3385	116
            7156	7951	13175	5208	3105	7161	3105	116
            7957	7957	14383	5864	2543	7818	3390	116
            7963	9556	13195	7824	2262	5216	3110	116
            6375	7172	9603	7830	2263	6525	3395	116
            7975	8773	9610	5877	2265	5224	3397	116
            9577	6385	10820	7189	3400	6535	2550	116
            8306	8306	14076	10202	4423	9352	3317	117
            6394	7194	12040	7200	3404	5236	3404	117
            7999	6399	12049	5240	2839	7205	2555	117
            8806	8806	10852	5244	3125	5900	3409	117
            6409	9613	9654	6560	3127	5248	2559	117
            9620	9620	14491	7222	2845	7878	2276	117
            9628	7221	14502	6570	3416	5256	2278	117
            9635	6423	14513	6575	2849	5260	2279	117
            9642	7232	12103	5264	2566	5264	3421	117
            8041	7237	9690	7244	3424	7244	3138	117
            8369	12553	14182	6854	4454	8567	2969	118
            6442	6442	9704	6595	3428	7914	3143	118
            8865	7253	12139	5280	2573	7920	2287	118
            7259	7259	10933	5945	2575	5284	2289	118
            6457	6457	10941	5288	3436	5949	3436	118
            6462	8885	14599	5954	2865	7277	2292	118
            8891	6466	12175	5296	3440	5296	2294	118
            8089	8089	14621	7288	3156	7950	3443	118
            6476	7286	14632	5304	2297	5304	2297	118
            7291	8911	14642	7299	3448	5308	2873	118
            8431	11593	14287	10358	2990	8632	4485	119
            7302	8113	14664	7974	3452	7310	2877	119
            8931	6495	12229	7980	3455	5320	2591	119
            8125	7313	11014	5990	2881	5990	3169	119
            8944	8944	14696	5328	2306	7326	2306	119
            6510	9764	9805	6665	3462	5332	2597	119
            6514	9772	9812	6003	3464	6670	2887	119
            8964	9779	14729	7343	3178	6675	2889	119
            6524	9786	9826	6680	3469	7348	2891	119
            9793	6529	14750	6017	2893	8022	3472	119
            8494	11679	14392	10436	3387	10436	3387	120
            7356	9808	9848	6026	3187	7365	3187	120
            8179	7361	11087	6030	3189	8040	2899	120
            9822	9004	14794	5364	2321	5364	2321	120
            6553	9010	9870	6710	3193	7381	3193	120
            9017	6558	9877	7387	3196	7387	3196	120
            9023	6562	12355	5376	2616	8064	3488	120
            6567	8209	14837	8070	3200	8070	2909	120
            7394	9858	13610	6730	2329	7403	3202	120
            9865	9865	13620	5388	2913	6735	2330	120
            9626	11765	19330	10514	3411	10514	3411	121
            9880	9056	11160	6071	2625	6745	3209	121
            9063	6591	14891	6750	2919	7425	3503	121
            6596	9894	14902	5404	3505	6080	2921	121
            7426	6601	14912	8112	2338	6084	2338	121
            6606	9083	9949	8118	2925	5412	3510	121
            9916	6610	14934	6093	2342	8124	2927	121
            6615	7442	11209	7453	3222	8130	2343	121
            9930	6620	13709	6780	2638	6102	3224	121
            9109	9109	9978	8142	3520	5428	3520	121
            12928	8618	19470	9710	3052	9710	3434	122
            6634	7464	13739	6795	2937	7475	2937	122
            8299	9959	9999	7480	3233	5440	2939	122
            7475	8305	11257	6125	3529	7486	2941	122
            9973	9142	15020	6129	3237	8172	3237	122
            6654	8317	15031	6815	2945	6134	3534	122
            9988	7491	12535	6138	2358	5456	2947	122
            6663	6663	12544	6825	3244	7508	3539	122
            10002	7502	10042	6830	2656	6830	2656	122
            6673	10009	13818	6152	2362	5468	2953	122
            8681	13021	14708	8003	4226	10670	4610	123
            10024	7518	13838	7530	3253	8214	3253	123
            7523	9195	10071	6165	3551	6850	2663	123
            10038	10038	12598	5484	2961	5484	2665	123
            8371	6697	12607	6174	2667	6860	2963	123
            7539	9215	12616	7552	2965	8238	3262	123
            7545	6706	12625	6870	2967	7557	2967	123
            9228	9228	13897	8250	2969	5500	3266	123
            9235	6716	12643	5504	2674	5504	3565	123
            10081	10081	15182	6885	2973	7574	2378	123
            10929	8743	14813	7166	3481	9853	3094	124
            10096	10096	15204	6206	3275	7585	2977	124
            6735	8419	15215	8280	2979	6900	2979	124
            10110	6740	13957	5524	2981	7596	3279	124
            9274	10117	11427	7601	3281	8292	3281	124
            7593	9281	10165	7607	2985	8298	2985	124
            8443	7599	12715	7612	2390	6920	2390	124
            10139	10139	13996	6233	2391	6925	3587	124
            6764	6764	11460	6237	3290	8316	2991	124
            7615	6769	11468	6935	2993	8322	2694	124
            12108	11007	16576	9924	4672	7218	4672	125
            10168	8473	10208	6945	3297	5556	3596	125
            9327	10175	14046	7645	2999	8340	2699	125
            9334	7637	12778	8346	3001	6955	3301	125
            6793	8491	11508	7656	2703	8352	3303	125
            10196	9347	14076	6269	3306	8358	3606	125
            7653	10204	12805	7667	2706	6970	3007	125
            10211	6807	12814	6975	3611	8370	3611	125
            10218	8515	12823	8376	3613	8376	3011	125
            7669	7669	10266	5588	2410	7684	3013	125
            13302	9977	15024	8178	3528	9087	3920	126
            10240	7680	15420	5596	2414	6995	3620	126
            10247	6831	11573	8400	3019	5600	3321	126
            8545	7691	12868	7005	3021	7005	2719	126
            6841	7696	15452	7010	3325	8412	3325	126
            9413	6846	15463	8418	3328	6314	3630	126
            9419	6850	11606	7020	2422	8424	3632	126
            8569	8569	10323	7728	2423	7025	3029	126
            10290	7718	10330	7030	3031	5624	2425	126
            9439	10297	14214	8442	3640	5628	2730	126
            13396	8930	13448	10982	4340	9152	3946	127
            6874	7734	10352	7750	2733	5636	3644	127
            10319	8599	11654	7755	3039	7755	2735	127
            6884	9466	12958	5644	3345	6350	2737	127
            8611	6889	15560	5648	3347	7766	2434	127
            10340	9479	12976	7772	3045	7065	2436	127
            6898	9485	11687	8484	3352	7070	3047	127
            7766	9492	11695	7075	2744	7075	2744	127
            10362	10362	10402	7788	2441	6372	3051	127
            10369	7777	10410	7794	2748	8502	2748	127
            13489	11241	20313	10139	4369	9217	3177	128
            6922	6922	11727	7805	3057	7805	3668	128
            6927	7793	11735	5680	3365	5680	2447	128
            9532	6932	13048	5684	3367	6395	2449	128
            10405	8671	13057	7110	3063	7821	2757	128
            10412	7809	11759	7115	3372	7115	3065	128
            9551	7815	13075	8544	2454	7832	3067	128
            10427	7820	13084	6413	3376	8550	2455	128
            6956	9565	10474	7843	2457	7843	2457	128
            6961	6961	13102	7135	3688	7135	2766	128
            9055	13583	15340	9282	4397	11138	3598	129
            6970	9584	15744	6431	3385	7860	2769	129
            10463	10463	13129	5720	3387	7865	2771	129
            9598	6980	10510	7155	3081	6440	2465	129
            6985	8731	13147	5728	3700	7876	2775	129
            6990	10484	15787	7165	3702	8598	3702	129
            8743	8743	13165	8604	3087	7170	2470	129
            9624	7874	11857	7893	3398	7893	3089	129
            8755	9631	14501	7898	2473	8616	3400	129
            8761	8761	10554	6467	2784	7904	2784	129
            13677	12537	15445	11216	4426	10282	3219	130
            7018	7896	10568	7195	2478	5756	3716	130
            8779	8779	13219	7200	3719	5760	3409	130
            10542	7907	10582	7926	3101	5764	2791	130
            7912	7033	15884	6489	3103	5768	3103	130
            8797	10556	15895	6494	3726	7937	2484	130
            7042	8803	13255	7220	2486	7220	2486	130
            8809	9690	14590	6503	2798	7225	3109	130
            9697	10578	13273	6507	2489	7953	3422	130
            7057	10585	10626	8682	2490	5788	2802	130
            11475	13770	13823	9412	3240	8471	4859	131
            7066	7950	15960	7970	2494	6521	3117	131
            9723	7071	13309	7975	3119	8700	2807	131
            8845	7076	11986	7981	3745	8706	3121	131
            7966	8851	14660	5808	3748	8712	3435	131
            7086	10628	13336	5812	3125	6539	2813	131
            10636	7090	10676	7270	3440	6543	3440	131
            7982	7982	13354	7275	3129	6548	2503	131
            8875	8875	12027	8736	3757	8008	3131	131
            10657	10657	16046	7285	3760	8742	3446	131
            11553	11553	15656	9477	3260	9477	3260	132
            8004	8893	16068	5836	3137	6566	3764	132
            9789	8899	12059	8030	3767	7300	3767	132
            9796	9796	12067	8036	2827	8766	2827	132
            10693	8020	14759	6579	3772	5848	2829	132
            8917	7134	10741	8047	3460	6584	2516	132
            10708	8031	16122	8052	2832	8784	3462	132
            8036	8036	13444	8790	2519	8058	3464	132
            10722	8042	10762	8063	2521	8063	3466	132
            10729	8047	13462	8069	2838	5868	2522	132
            11631	11631	21015	9542	4102	10496	3691	133
            8953	10744	10784	7345	3473	8080	2841	133
            7167	10751	12140	5880	2527	6615	3475	133
            10758	9862	16198	6620	2845	8826	3161	133
            7177	8074	14858	8096	3796	8096	2530	133
            9875	9875	13516	7365	2849	5892	3165	133
            10780	9881	12173	8107	2534	7370	2850	133
            8989	8090	14887	5900	2852	6638	3486	133
            8995	8096	16252	8856	2854	5904	3488	133
            9901	10801	14907	8862	3490	5908	3808	133
            14051	12880	21155	7686	3715	8646	4128	134
            10816	9914	13570	8135	3177	6656	2542	134
            9921	8117	13579	5920	3815	8140	2861	134
            8123	7220	14947	5924	2545	8886	3817	134
            9031	9031	12237	7410	3183	5928	3501	134
            10844	9941	14967	6674	3504	6674	3504	134
            8139	10852	10892	6678	2550	6678	2868	134
            9049	9954	12262	8910	2870	7425	2551	134
            7244	10866	14996	5944	2553	8173	3191	134
            8155	7249	13642	6692	3832	6692	2554	134
            14145	12966	19521	8705	4984	9672	4569	135
            9073	9073	15026	8190	2877	5956	3517	135
            7263	10895	16403	8195	3839	8940	2879	135
            10902	9085	13678	5964	3841	5964	3841	135
            8182	10000	13687	7460	3844	5968	3523	135
            8187	9097	15066	8212	2564	8212	3526	135
            10013	7282	15076	6723	3848	5976	2886	135
            7287	7287	10971	8223	3851	8223	2567	135
            10938	8204	12351	6732	3532	6732	2569	135
            8209	9121	13732	8234	2892	6737	3213	135
            14238	13052	19650	8763	4180	10711	5015	136
            10960	9133	12375	7495	3860	8994	3217	136
            10967	7311	16511	7500	2897	9000	2897	136
            8231	10060	11014	6004	2899	8256	3221	136
            7321	8236	12399	7510	2901	9012	3868	136
            10073	10073	15165	8267	2580	6764	2580	136
            7330	9163	11036	6768	2582	6768	3227	136
            11003	9169	12424	8278	3229	7525	3229	136
            7340	8258	13813	6024	2585	6777	2908	136
            10099	11017	16586	6782	3233	6028	3556	136
            14332	11943	14384	11762	3785	7842	3785	137
            11032	8274	12456	6791	2913	6036	2913	137
            10119	11039	11079	8305	3887	8305	3563	137
            10126	9205	15244	8311	3241	8311	3565	137
            11053	9211	13867	8316	2594	8316	3567	137
            11060	9217	11101	7565	3245	8322	3570	137
            7378	8301	11108	8327	3572	6813	2922	137
            10152	11075	12505	7575	3899	6060	3249	137
            10159	11082	12513	6822	2601	8338	2926	137
            9241	9241	13912	6827	3904	6068	3578	137
            13223	9617	16288	8880	3385	10854	5078	138
            11104	8328	15323	8355	2606	6076	3583	138
            10185	7407	16727	9120	2607	8360	2607	138
            9265	8339	11158	7605	3913	9126	3261	138
            9271	7417	16748	6088	2610	7610	3916	138
            10205	10205	11173	9138	3918	9138	2939	138
            7426	7426	13975	9144	2940	6858	3267	138
            9289	11147	11187	9150	3923	7625	3269	138
            7436	10225	16792	8393	3271	6867	2944	138
            8371	7441	12602	6872	3273	6872	3928	138
            13309	9679	18214	10925	4258	7946	3832	139
            7450	10244	12618	6881	2949	9174	3932	139
            11183	11183	11223	9180	3279	7650	2623	139
            11190	9325	11230	8421	3281	6124	3281	139
            11197	11197	12642	8426	2626	6894	3940	139
            11204	11204	15462	8432	2957	9198	2628	139
            9343	7474	16878	6903	2958	9204	2958	139
            11219	7479	16889	6908	3947	9210	3289	139
            10291	7484	11266	9216	3620	6144	3291	139
            8425	9361	16910	6148	2634	8454	2634	139
            12177	13395	18331	7998	3427	8997	4284	140
            7498	7498	12699	8465	2967	6926	3627	140
            10317	11255	15531	7700	2639	8470	3629	140
            8447	10324	11302	6935	3301	8476	3631	140
            7513	7513	16964	6168	3303	7710	2973	140
            10337	9397	16975	6944	3966	8487	3305	140
            7522	7522	12740	9264	3307	9264	3638	140
            8468	11291	12748	6180	2647	7725	2647	140
            8474	9415	12756	6184	3311	8503	3642	140
            7537	7537	11346	6962	3976	6188	2982	140
            9804	13481	20293	12074	4310	8050	4310	141
            11320	10376	11360	8520	3980	9294	2985	141
            8495	7551	14209	9300	2655	6200	2655	141
            7556	8501	12796	9306	3653	6204	2657	141
            7561	11341	14227	6984	3988	6208	3323	141
            9457	8511	14236	8542	3325	6212	3325	141
            10409	8517	15670	8547	3660	7770	2662	141
            7575	10416	11403	8553	2996	8553	2663	141
            11370	7580	15689	7002	3664	7002	3997	141
            10429	11377	15699	7007	3333	9342	4000	141
            9866	13566	20422	9114	3902	8102	5203	142
            7594	11392	14290	7016	2670	6236	3337	142
            11399	8549	17159	8580	3005	6240	4007	142
            7604	7604	15739	7805	3007	7025	4009	142
            10462	7609	17180	6248	2674	9372	2674	142
            7614	7614	17191	8597	4014	7815	2676	142
            8571	10475	14335	6256	4016	7820	3347	142
            10482	11435	15778	9390	2679	6260	3014	142
            10489	11442	11482	8613	3351	8613	3016	142
            9541	8587	15798	7052	2682	7052	3688	142
            11170	14893	20551	9173	5234	11211	5234	143
            7642	8598	11504	7061	3021	6276	2686	143
            8603	7647	17267	7065	3359	9420	3359	143
            10522	11478	14398	7855	2689	6284	3025	143
            10528	10528	15848	7074	4036	7074	2690	143
            8619	9577	15858	9438	3702	6292	3365	143
            10541	9583	11540	8657	4040	7870	3030	143
            8630	8630	12991	8663	3706	8663	4043	143
            8636	8636	15887	6304	2697	7092	3371	143
            7681	7681	15897	8674	2698	7097	3373	143
            11240	12489	18799	11283	4388	11283	4388	144
            11536	7690	11576	8685	3377	6316	3039	144
            9619	10581	13031	7110	3717	7110	2703	144
            10588	7700	17386	8696	4057	7905	3381	144
            7705	11557	14497	9492	3045	6328	3721	144
            7710	8673	14506	9498	3385	7915	3385	144
            11572	11572	15967	6336	3048	8712	3726	144
            8684	9649	14524	6340	3728	8718	2711	144
            10621	10621	13080	9516	3730	8723	3391	144
            8695	7729	14542	7935	3054	9522	4072	144
            10054	10054	22700	8258	4414	12386	4414	145
            11608	7738	14560	8740	2718	7945	4076	145
            9679	11615	13112	7950	2719	7155	2719	145
            7748	10654	16036	6364	3061	8751	3401	145
            10660	10660	16046	9552	3403	9552	2722	145
            10667	10667	16056	7965	2724	7169	3746	145
            9703	11644	14605	6376	3066	8767	3407	145
            11651	9709	13153	7975	3409	6380	3409	145
            11658	8744	13161	8778	3070	7980	3070	145
            9721	7777	11706	7985	4096	6388	2730	145
            11381	11381	20937	11426	5327	8310	3996	146
            11680	11680	16115	7196	3075	6396	4100	146
            11687	9739	13193	8000	3077	9600	3761	146
            9745	9745	17602	9606	2737	7205	3421	146
            9751	10726	13209	9612	3423	8811	3765	146
            11708	9757	16155	8817	3425	7214	3768	146
            7810	7810	13226	6416	4112	9624	2742	146
            9769	10746	17645	9630	2743	8828	3086	146
            11730	8798	13242	7227	2745	8833	3431	146
            10759	8803	14722	6428	3433	8839	4120	146
            13995	12723	17235	9407	4466	11497	4912	147
            11752	10772	11792	8045	3781	6436	3781	147
            11759	10779	11799	8050	3439	9660	3439	147
            11766	10786	17710	6444	3441	6444	2753	147
            7849	10792	11814	8866	2754	8060	3787	147
            9817	10799	14776	9678	2756	8872	2756	147
            8841	11788	11828	8070	3792	6456	3102	147
            7863	10812	14794	8075	3104	9690	2759	147
            11802	7868	14803	7272	3106	8888	2761	147
            7873	11809	17774	7277	3108	8894	2762	147
            11521	12801	19267	9465	4042	12620	5390	148
            11824	11824	13347	8095	3803	9714	3457	148
            10845	9859	11871	8100	3459	8100	2767	148
            11838	9865	17818	6484	4153	9726	4153	148
            7897	8884	16343	7299	3117	8110	3463	148
            11852	9877	11893	7304	3465	7304	3119	148
            8895	11860	11900	8120	3467	6496	4160	148
            11867	7911	13396	6500	3816	7313	3816	148
            7916	9895	16382	8130	4165	6504	3471	148
            11881	9901	14902	8135	3473	8135	3820	148
            10303	14167	17446	11640	3614	12698	5421	149
            7930	9913	14920	7331	4172	8145	3477	149
            10911	8927	16422	8150	3479	8150	3479	149
            8933	8933	17926	9786	4177	6524	3481	149
            8938	8938	14947	7344	4180	7344	4180	149
            8943	7950	13460	9798	3485	9798	3485	149
            10937	8949	17958	8170	3138	8987	3487	149
            8954	7959	14974	9810	3489	8175	4187	149
            11946	9955	16481	9816	3491	8180	3840	149
            11953	8965	11994	9004	3842	9004	2794	149
            15549	11661	17551	10647	4089	12776	3635	150
            11968	11968	15010	9015	3847	9834	3497	150
            8981	8981	18023	9020	2799	6560	3849	150
            9985	7988	16531	6564	3851	8205	2801	150
            8992	10990	13533	6568	4204	9031	3153	150
            7998	10997	15046	8215	3155	9037	4206	150
            9003	9003	18066	9864	3858	6576	3858	150
            12011	10009	15064	9048	3860	8225	3860	150
            11017	11017	16580	8230	3862	6584	4213	150
            11023	11023	12066	9059	3162	9882	4216	150
            11732	10428	21580	11783	5026	9641	5483	151
            11036	11036	12080	9070	4220	8245	3165	151
            8031	8031	15109	7425	3167	9900	4223	151
            9041	8036	12094	9081	3521	7430	3169	151
            12061	11056	16640	6608	3523	9912	4228	151
            8046	8046	15136	7439	2820	7439	4230	151
            11069	8050	15145	8270	4232	8270	3527	151
            11076	10069	16669	6620	3176	9103	2823	151
            10075	9068	15163	8280	2825	8280	4237	151
            12097	11089	16689	6628	2826	9942	3180	151
            13113	15736	19735	9699	5055	9699	5515	152
            9084	8074	18228	6636	3891	8295	3537	152
            11109	10099	16719	9130	3185	7470	3539	152
            12126	11116	18250	7475	3541	9136	3187	152
            11122	9100	13695	9972	4252	9141	3897	152
            9105	8094	15226	9978	4254	9978	2836	152
            10123	11135	12188	9984	3902	8320	3192	152
            12155	12155	15244	9990	3549	7493	3904	152
            10135	9122	12202	8330	3551	6664	2841	152
            12169	9127	18314	7502	2842	10002	2842	152
            14510	13191	17867	10842	4622	13010	5084	153
            9138	9138	12224	6676	3557	9180	3913	153
            9143	8127	15289	8350	2847	6680	4271	153
            11182	8132	16828	9191	2849	9191	3561	153
            11188	10171	12246	8360	2850	7524	3207	153
            10177	12212	13784	10038	3565	6692	2852	153
            12220	8146	13793	9207	3210	6696	2854	153
            11208	9170	15334	8375	3926	9213	3212	153
            10195	10195	16877	8380	3571	9218	3214	153
            8161	8161	15352	6708	3930	9224	3573	153
            15923	10615	15975	11998	4648	10907	4648	154
            11234	12256	13833	10074	4292	9235	3219	154
            11241	12263	12303	8400	2863	8400	3221	154
            12270	8180	16927	10086	3581	7565	2865	154
            11254	12277	12318	6728	3225	8410	2866	154
            9213	8190	18487	7574	3944	9257	3585	154
            10243	11267	15415	8420	2870	7578	3946	154
            12299	11274	13882	9268	3589	7583	3948	154
            8204	8204	13890	7587	4309	6744	3591	154
            11287	12313	13898	9279	4312	6748	2874	154
            16017	14682	22095	13166	5141	10972	5141	155
            12328	9246	15460	10134	3957	10134	2878	155
            12335	10279	17016	7605	3599	6760	3599	155
            9257	8228	12382	6764	3241	8455	3961	155
            9262	8233	17036	10152	3243	9306	3243	155
            12356	8238	13946	7619	3245	8465	3605	155
            9273	10303	17056	7623	3968	6776	2886	155
            9278	9278	18617	8475	2887	9323	2887	155
            10315	10315	13971	10176	2889	9328	3250	155
            9289	8257	13979	10182	3974	8485	4336	155
            13425	13425	18183	8830	5169	11037	4700	156
            11366	11366	13995	9345	3617	8495	4340	156
            12407	8271	12447	8500	2895	10200	4343	156
            11380	10345	18682	8505	3621	9356	4345	156
            9316	12421	17135	8510	3261	7659	3985	156
            9321	10357	18703	10218	3263	10218	4350	156
            9327	10363	12476	8520	3990	10224	3627	156
            12443	10369	18725	7673	4355	7673	3992	156
            10375	12450	14052	7677	3268	10236	3631	156
            8305	9343	17184	9389	3270	6828	3270	156
            10802	14853	24384	13322	4253	12212	4726	157
            11432	10393	14076	9400	4364	9400	3637	157
            9359	11439	14084	7695	3275	7695	2911	157
            11446	12486	18790	9411	3277	10266	2913	157
            12493	11452	17234	8560	4372	9416	2914	157
            10417	9375	18811	9422	3645	10278	3645	157
            8338	11465	17254	9427	4376	9427	4376	157
            8343	9386	18833	9433	3284	7718	2919	157
            11479	9392	14133	10296	3286	7722	4381	157
            10441	12529	17283	8585	2922	7727	4018	157
            13581	13581	22481	8934	4276	8934	4276	158
            11498	11498	18876	8595	3291	9455	3291	158
            9413	9413	17313	10320	4391	9460	4025	158
            9419	8372	15748	9466	3295	10326	3295	158
            10471	11518	15757	10332	3663	10332	4029	158
            12572	10477	17343	6892	3665	10338	4398	158
            10483	10483	18930	8620	4400	8620	3300	158
            9440	11538	15784	7763	3302	7763	4036	158
            12594	10495	18952	8630	4405	6904	4405	158
            11551	8401	17382	7772	3306	9499	3306	158
            10927	16391	20554	11232	4300	11232	4778	159
            12616	12616	14238	6916	4412	10374	3677	159
            9467	11571	15829	7785	3679	10380	4047	159
            10525	8420	12670	9521	2945	10386	3313	159
            9478	12637	12678	10392	3683	7794	2946	159
            12644	11591	17442	10398	3685	8665	3685	159
            11597	10543	12692	8670	3318	9537	2950	159
            12659	9494	17461	7808	3320	10410	3689	159
            8444	11611	14295	6944	3691	7812	3691	159
            9505	10561	12714	6948	4432	10422	3693	159
            12363	13737	22738	10167	4323	10167	4804	160
            10573	11630	14319	9565	2958	7826	3697	160
            9521	12695	17511	6960	3699	7830	4439	160
            8468	8468	12742	6964	4071	6964	2961	160
            9532	12709	12750	8710	4444	10452	3333	160
            9537	9537	17541	7844	3335	9587	3705	160
            11663	11663	15955	8720	4078	10464	4078	160
            8487	10609	12771	9598	4080	9598	4080	160
            8492	10615	14376	7857	3711	8730	4082	160
            8497	9559	17580	6988	3342	6988	3342	160
            12434	15197	18709	9090	5795	9090	4830	161
            12760	11696	12800	7871	4089	10494	4089	161
            12767	11703	12807	10500	4091	8750	3347	161
            9581	12774	19222	9631	4465	7004	2977	161
            11716	12781	17630	8760	4468	9636	3351	161
            8526	9591	19243	9642	4470	8765	2980	161
            10663	12796	19254	7016	3727	9647	4472	161
            12803	8535	12843	7898	4475	9653	2983	161
            12810	8540	17669	9658	2985	7024	4104	161
            9613	9613	19286	10542	3360	8785	4480	161
            16672	16672	25086	11427	5827	9142	5341	162
            11762	11762	19308	9675	4111	10554	4484	162
            8559	8559	17709	7920	4113	10560	4113	162
            8564	10705	12886	10566	3741	8805	4115	162
            11782	12853	19340	7048	3743	9691	3743	162
            11789	8574	14513	10578	2996	7052	3371	162
            8578	11795	16135	9702	2998	8820	4122	162
            11802	8583	19373	7060	4124	10590	2999	162
            9662	9662	14538	7064	3376	7064	3751	162
            12889	10741	12930	7952	3002	10602	4128	162
            11177	16765	23125	11492	4882	12641	3905	163
            9678	9678	12944	7961	4508	9730	4508	163
            12911	9683	17808	7965	4511	8850	4135	163
            12918	12918	17818	8855	3385	7970	3761	163
            12925	12925	16207	10632	4516	9746	4139	163
            10777	11855	16216	10638	4142	8865	3765	163
            12940	11861	16225	8870	3014	7096	3390	163
            9710	11868	16234	7988	4523	10650	4523	163
            10795	10795	16243	9768	4525	10656	3771	163
            12961	8641	19502	9774	4528	8885	3773	163
            14049	15454	25367	13868	3926	11557	5398	164
            12976	12976	17897	8895	3777	10674	3022	164
            8655	8655	17907	7120	4157	7120	3023	164
            10825	9743	16288	9796	4159	8015	3781	164
            8665	12997	19556	7128	3783	8019	4540	164
            9753	8670	13045	9807	3028	10698	4542	164
            13012	8674	16315	10704	3787	9812	4166	164
            13019	11934	16324	7140	4547	10710	4168	164
            11941	8684	19600	8037	3791	9823	4170	164
            10861	13033	14708	9829	3034	7148	4172	164
            12714	14127	19131	11622	4934	10460	5920	165
            13048	10873	19632	9840	3038	8945	4177	165
            10879	9791	19643	7160	3799	9845	3419	165
            10885	13062	18016	9851	3801	7164	3041	165
            11980	13069	14748	8064	3423	10752	4564	165
            8718	9807	16396	10758	3425	8069	3044	165
            9813	11993	14765	8970	3426	8073	3046	165
            13091	8727	18055	10770	4190	9873	4190	165
            13098	8732	16423	9878	4192	10776	4192	165
            13105	10921	16432	7188	4576	9884	3050	165
            12785	14205	21373	11687	5951	12856	4464	166
            13120	9840	14805	8995	3817	8096	3817	166
            9845	9845	18105	9000	3819	7200	3055	166
            13134	9851	16468	10806	3439	7204	3821	166
            10951	12046	13182	8109	4205	7208	4588	166
            10957	8766	13189	10818	4208	9015	3060	166
            13156	13156	14846	7216	3444	9020	3444	166
            9872	12066	13203	7220	3446	8123	3063	166
            12073	10975	18164	8127	3831	10836	4214	166
            10981	13177	14870	9035	4600	10842	4216	166
            12855	12855	21490	12927	3988	9402	3988	167
            13192	12092	18194	9045	3453	8141	3453	167
            10999	9899	16549	9955	3071	9050	3455	167
            12106	9905	18214	9961	3457	9055	4225	167
            13213	9910	18224	7248	3074	7248	3843	167
            9915	8814	18234	7252	4230	9972	4614	167
            9921	11023	19902	8163	3078	8163	4232	167
            9926	13235	19913	9983	3079	10890	3079	167
            9932	9932	16603	8172	4236	7264	3466	167
            8833	8833	18273	7268	3853	9085	4624	167
            14361	14361	19447	10635	5012	14180	6014	168
            9948	12158	14967	7276	4243	9095	3857	168
            11059	8847	19967	9100	4631	10010	4631	168
            11065	13278	13318	9105	4633	8195	3089	168
            8857	12178	14991	10021	4249	10021	3863	168
            11077	12185	14999	7292	3092	9115	4252	168
            8866	9975	18343	9120	4254	8208	4254	168
            12198	12198	18352	8213	4256	10950	3869	168
            8876	9986	15024	8217	4258	10956	3871	168
            13321	8881	13362	10962	3873	10962	3873	168
            11551	14439	26069	9506	4534	14258	5038	169
            10002	10002	16720	8231	4652	10060	3489	169
            10007	11119	18402	9150	3491	10065	3879	169
            13350	10013	15064	7324	4657	9155	3493	169
            11131	13357	18422	10076	4271	10992	3883	169
            13364	11137	18432	8249	3497	7332	3885	169
            11143	8914	16765	7336	3498	8253	3498	169
            10034	12264	15097	7340	4278	8258	3500	169
            13386	10040	20140	7344	3891	11016	4669	169
            13393	12277	18471	11022	4672	8267	3114	169
            13065	15969	21841	11947	5064	13142	4051	170
            10056	12290	16810	7356	4287	9195	3507	170
            13415	8943	20183	9200	4679	8280	3119	170
            13422	12304	18511	9205	4681	7364	3511	170
            8953	11191	18521	10131	4684	8289	4684	170
            11197	8958	18531	11058	3515	10137	4296	170
            11203	10083	18541	10142	4298	10142	3126	170
            12330	10088	15178	10148	3127	11070	4691	170
            11215	13458	16873	9230	3911	7384	4693	170
            8977	10099	18570	8312	4304	8312	4304	170
            11676	16055	17567	10811	6107	13213	6107	171
            12356	11233	18590	8321	4309	9245	3917	171
            10115	13487	16909	7400	4311	8325	4703	171
            8996	8996	15226	8330	4313	10181	3137	171
            12376	9001	15234	8334	4315	8334	3138	171
            10131	9006	15242	8339	3925	9265	3925	171
            11263	12389	16945	10197	3142	11124	4320	171
            10142	10142	18649	9275	3536	7420	3929	171
            11275	13530	15267	10208	4717	11136	4324	171
            13537	10153	20366	8357	3933	7428	3933	171
            14673	13206	26490	13285	4092	9662	6139	172
            11293	12422	15291	10225	4724	8366	3150	172
            13559	10169	15299	10230	3151	7440	3939	172
            12436	9044	13606	7444	4335	7444	4335	172
            10180	10180	20420	9310	4337	10241	3154	172
            10185	12449	20431	7452	3156	8384	3551	172
            10191	10191	13628	11184	3947	10252	4736	172
            11329	12462	18748	7460	3949	8393	3949	172
            11335	11335	15348	11196	3161	9330	4741	172
            10207	12475	17062	10269	3162	7468	3953	172
            16226	13276	17754	14570	6170	12142	4627	173
            11353	11353	13664	8411	4353	9345	3166	173
            12495	10223	18798	11220	4751	10285	4751	173
            12502	10229	18808	7484	3565	11226	3169	173
            12508	9097	17107	10296	3567	9360	4359	173
            12515	9102	18828	11238	3965	10302	3965	173
            13660	13660	18838	10307	3967	7496	3967	173
            10250	13667	20561	9375	4366	10313	4763	173
            13674	13674	20572	9380	3574	10318	4368	173
            9121	13681	20582	8447	3576	11262	3576	173
            13346	16312	17847	14648	5684	14648	5684	174
            9130	10272	18887	8456	3977	8456	4772	174
            13703	11419	18897	8460	4775	7520	4775	174
            13710	13710	18907	9405	3583	10346	3185	174
            12574	9145	15477	10351	3585	10351	4780	174
            11437	11437	17206	11298	3188	8474	4782	174
            12587	9154	18937	8478	4386	7536	4386	174
            13739	12594	13779	11310	3590	9425	3590	174
            13746	10310	15510	7544	3592	8487	3991	174
            9169	9169	17242	11322	4392	11322	3993	174
            13416	13416	20184	12272	5713	12272	5713	175
            9178	9178	17260	8501	3597	7556	3198	175
            9183	10331	18996	9450	3199	8505	3599	175
            11485	10337	17278	8510	4401	11346	3201	175
            11491	12640	17287	11352	4403	10406	4403	175
            9198	12647	20755	8519	3204	8519	4406	175
            12653	11503	15575	8523	3606	8523	4007	175
            13811	9207	17314	10423	4811	10423	4811	175
            9212	9212	15591	9480	4011	7584	4813	175
            10369	10369	13866	9485	3612	9485	4816	175
            17982	11988	27052	14804	5220	9870	4698	176
            9226	11533	17350	9495	4017	9495	4419	176
            11539	12693	20831	7600	4421	9500	3215	176
            12700	12700	17368	9505	4423	11406	4423	176
            10396	13861	13902	8559	4023	10461	4425	176
            12713	11557	17386	7612	4025	8564	3220	176
            11563	11563	17395	7616	3624	11424	3624	176
            13883	12726	13923	9525	4029	11430	3223	176
            13890	11575	13930	10483	3225	11436	4031	176
            11581	9265	19164	9535	3226	9535	3226	176
            16569	18076	27192	13642	4196	11162	4196	177
            10434	9274	15696	7636	4037	9545	4441	177
            10439	11599	19194	11460	4443	11460	3231	177
            10445	9284	15712	11466	3637	11466	3233	177
            9289	12772	13974	9560	4447	11472	3234	177
            10455	10455	15728	11478	3236	7652	4854	177
            10461	10461	13988	7656	3238	7656	4047	177
            9303	10466	20993	7660	4049	7660	4859	177
            13962	11635	19253	9580	3241	8622	4861	177
            12805	11641	21014	7668	3648	10544	4053	177
            13627	18169	18222	12467	5272	12467	6326	178
            10488	9322	21036	7676	4463	11514	4057	178
            11659	11659	14031	7680	4059	10560	4059	178
            12832	12832	17548	9605	4061	8645	3655	178
            14005	14005	21068	10571	4876	10571	3250	178
            11677	11677	17566	8654	3659	7692	4472	178
            11683	11683	14060	11544	3660	10582	4474	178
            12858	9351	21101	7700	3255	11550	4069	178
            9356	10526	17593	9630	4071	9630	4478	178
            9361	12871	17602	10599	4888	11562	4073	178
            18263	12175	20605	10026	5298	11279	6357	179
            9370	9370	17620	9645	4077	7716	3262	179
            10547	11719	19392	11580	4895	11580	3671	179
            10553	14070	14110	11586	3265	7724	3673	179
            9385	14077	14118	10626	4900	9660	4491	179
            12911	11737	14125	11598	4902	7732	3268	179
            9394	11743	17665	10637	3270	10637	4496	179
            11749	12924	14139	11610	4498	10643	4089	179
            9404	10580	14146	9680	4909	11616	4091	179
            14113	10585	14154	8717	4093	9685	4912	179
            13767	12238	18409	13857	5324	10078	4259	180
            14128	9418	15939	7756	4916	10665	4097	180
            9423	11779	14175	7760	3279	10670	4919	180
            11785	9428	15955	11646	4511	7764	4921	180
            9433	9433	19511	7768	3693	8739	4924	180
            14156	10617	14197	10687	4105	10687	3695	180
            14164	12983	14204	9720	4107	11664	3286	180
            10628	12990	14211	11670	3698	10698	4931	180
            11815	14178	17773	11676	4933	11676	4111	180
            11821	11821	17782	11682	3702	10709	4524	180
            15375	13838	20815	11396	4815	10130	4280	181
            10650	9466	19580	9745	3294	8771	3705	181
            10655	10655	14247	9750	4119	11700	3707	181
            14214	9476	21382	7804	4533	8780	4533	181
            10666	11851	19610	11712	4123	10736	4123	181
            9486	14228	14269	10742	4950	9765	4538	181
            10677	11863	16061	7816	3302	8793	4127	181
            13056	13056	19639	9775	4129	11730	4955	181
            10688	14250	14290	7824	4957	9780	4957	181
            10693	9505	21446	9785	3720	10764	4133	181
            16998	16998	18596	15272	4838	15272	4838	182
            10704	14272	19679	9795	4137	9795	3723	182
            14279	13089	14319	8820	3311	9800	4553	182
            10715	13096	14326	9805	4555	10786	3727	182
            11911	10720	19709	8829	3314	11772	3729	182
            11917	9534	17926	7852	4560	11778	4974	182
            13115	13115	17935	7856	4976	9820	3732	182
            10736	13122	19738	11790	4149	11790	4979	182
            11935	14322	17953	8847	4981	7864	3321	182
            10747	14329	17962	7868	3322	8852	4984	182
            18637	18637	21026	11513	5942	11513	4861	183
            10758	14344	19778	10830	3741	10830	3326	183
            10763	10763	21587	7880	4159	9850	4159	183
            13162	14358	19798	8870	4993	8870	4993	183
            11971	9577	18007	7888	4579	11832	4579	183
            10779	14372	16214	10852	4582	8879	4582	183
            11983	11983	14420	10857	5000	8883	3334	183
            14387	9591	14427	10863	4586	7900	5003	183
            9596	11995	16239	9880	4171	8892	5005	183
            9601	14401	14442	11862	3338	8897	4173	183
            14048	14048	18783	14143	5970	10286	5970	184
            10812	12013	18070	9895	4177	8906	3759	184
            9615	12019	19887	8910	4179	7920	3343	184
            9620	12025	21706	9905	5017	7924	3763	184
            14437	12031	18097	7928	3765	11892	3765	184
            9630	10833	18106	10907	4604	10907	3348	184
            10839	12043	18115	8928	5024	11904	5024	184
            13254	14459	21749	9925	5027	8933	3770	184
            9644	12055	18133	9930	4191	7944	4191	184
            13267	12061	21770	11922	3774	7948	4612	184
            15687	14118	18877	10338	5999	10338	6544	185
            9658	14488	14528	11934	4617	9945	5036	185
            13287	10871	19986	10945	4619	11940	5039	185
            14502	10877	18178	8960	4621	11946	5041	185
            12091	10882	14550	7968	5044	7968	3362	185
            13307	10887	21835	9965	3364	9965	5046	185
            12103	13313	14564	10967	3786	10967	3786	185
            12109	12109	14571	8978	3788	11970	5051	185
            9692	10904	14578	7984	5053	10978	3369	185
            12121	13333	14586	10984	5056	9985	4634	185
            15765	17342	21342	14286	5480	15584	4384	186
            13346	10920	16425	7996	3374	8996	3374	186
            9711	13353	18259	12000	3797	11000	3797	186
            10931	14574	21922	8004	3799	10005	3799	186
            13366	13366	16449	11011	3801	11011	4223	186
            13373	14588	21943	8012	3380	8012	4648	186
            9730	12163	14636	11022	4650	12024	5072	186
            9735	12169	20134	8020	3383	11028	3806	186
            13393	9740	18313	10030	4654	8024	3385	186
            10963	9745	20154	10035	3810	12042	3810	186
            19012	15843	23830	10442	4404	15662	4955	187
            12193	12193	20174	9041	3390	12054	5084	187
            13419	10979	16514	9045	4239	12060	5087	187
            14646	14646	22030	12066	3817	10055	5089	187
            9769	10990	16530	10060	4243	9054	5092	187
            9774	13439	20214	10065	5094	8052	4670	187
            14668	14668	16547	9063	4247	10070	5096	187
            14675	9783	20233	12090	4249	10075	4674	187
            14682	11012	18403	11088	4251	12096	4676	187
            12241	13465	22094	11094	5104	9077	3828	187
            15921	19105	28737	14429	4425	15740	6085	188
            9802	14704	16587	11105	3831	12114	3406	188
            13485	12259	14751	12120	4685	12120	3833	188
            11039	13492	14758	11116	3409	8084	4687	188
            14725	11044	22148	10110	3837	10110	4689	188
            14732	9822	18466	8092	3839	12138	3839	188
            14740	12283	16628	11132	4694	10120	4694	188
            11060	12289	14787	10125	5123	12150	3842	188
            14754	11066	20342	11143	3417	12156	4698	188
            12301	14761	18502	8108	3418	12162	3846	188
            12799	17599	28877	13182	6113	13182	6669	189
            13544	9850	16668	10145	4277	9131	4277	189
            9855	13551	20382	11165	4707	10150	3423	189
            12325	14790	14830	12186	4709	9140	5137	189
            9865	14797	22256	12192	5140	11176	4711	189
            13571	9870	22267	12198	3857	9149	3428	189
            12343	13577	18565	9153	5144	10170	4287	189
            12349	9879	16717	11193	3431	10175	4718	189
            12355	13591	22300	10180	4291	9162	4720	189
            14833	13597	22310	9167	4722	8148	5152	189
            19293	12862	21763	13247	5584	11922	5584	190
            11136	14848	18610	12234	5156	12234	5156	190
            12379	9903	18619	8160	4729	12240	3439	190
            13624	11147	14902	8164	3871	8164	3871	190
            9913	13630	14910	9189	3442	8168	3873	190
            12397	13637	20511	12258	5166	12258	3875	190
            9922	11163	18655	10220	4307	12264	5168	190
            14891	11168	20530	11248	5171	12270	4740	190
            14898	12415	16806	9207	5173	9207	5173	190
            9937	13663	16814	12282	3882	9212	4313	190
            16155	12924	19439	14643	5610	14643	6731	191
            9946	13676	14960	11270	4317	11270	4317	191
            12439	11195	18709	8200	3455	10250	4751	191
            9956	9956	14974	10255	4753	10255	4753	191
            12451	14941	18727	11286	5188	11286	3458	191
            11211	9966	22483	10265	4758	8212	4758	191
            11217	14956	18745	11297	4327	8216	4760	191
            9975	9975	22505	9248	5195	9248	4329	191
            14970	11228	20639	8224	3898	10280	3465	191
            14977	9985	15018	11314	5200	11314	3900	191
            12986	14610	24415	16052	6199	16052	5072	192
            14992	9994	18790	10295	4771	12354	4337	192
            11249	11249	16919	9270	4773	11330	4773	192
            11255	12505	22570	10305	3907	12366	3473	192
            15013	13762	18817	10310	3909	12372	4343	192
            12517	13769	22591	12378	3911	11347	5214	192
            10018	15028	22602	11352	4782	8256	4347	192
            11276	10023	16960	8260	4784	11358	3479	192
            10028	10028	15082	10330	4786	10330	4786	192
            11287	10033	18862	12402	4788	11369	3918	192
            19573	14680	22079	16130	6794	14786	5662	193
            10042	13808	18880	8276	3486	9311	5228	193
            13815	10047	20778	8280	4795	12420	4795	193
            13822	12565	18898	9320	3489	12426	3925	193
            15085	13828	20798	11396	3927	10360	4799	193
            12577	11319	22699	11402	3492	12438	3492	193
            12583	15100	18925	10370	3930	12444	3930	193
            13848	11330	17041	10375	4806	12450	5243	193
            15114	12595	15154	8304	3934	12456	4808	193
            12601	10081	22742	12462	3498	10385	4373	193
            14750	14750	29579	13507	6256	13507	5688	194
            15136	13874	20867	10395	3939	9356	5252	194
            15143	11357	15183	12480	4817	12480	3503	194
            11363	12625	15190	11446	4381	12486	3943	194
            11368	12631	18997	9369	4383	12492	4383	194
            11373	12637	19006	9374	4385	10415	3508	194
            15172	15172	15212	10420	3948	9378	5264	194
            15179	11384	19024	11468	3950	9383	4389	194
            10124	12655	15226	9387	3513	9387	3952	194
            12661	15193	15234	9392	4832	10435	3954	194
            14820	19761	22290	12215	4571	12215	4571	195
            12673	11406	17154	10445	3518	8356	5276	195
            15215	11411	22883	8360	4839	10450	4839	195
            11417	13954	17170	11501	5281	9410	4401	195
            12691	13960	17178	12552	3963	8368	4843	195
            12697	13967	21006	10465	4405	10465	5286	195
            11433	12703	22926	9423	3526	11517	4848	195
            10167	15251	22937	10475	3968	8380	4409	195
            12715	13987	21035	11528	5293	9432	3529	195
            10177	10177	17219	10485	3972	9437	3530	195
            14891	16545	22395	16364	5740	12273	4592	196
            12733	12733	15320	10495	3975	9446	5300	196
            14013	12739	17243	10500	3535	12600	5303	196
            11471	10196	23002	12606	4421	9455	4421	196
            11476	15301	19177	8408	3538	12612	3538	196
            10206	14033	23023	9464	5310	8412	5310	196
            14039	12763	19195	10520	4870	12624	5312	196
            10215	11492	21124	9473	5315	9473	5315	196
            12775	11498	19213	10530	4431	12636	3545	196
            15337	11503	23066	8428	5320	10535	4876	196
            19948	18285	30000	16442	4612	16442	5766	197
            12793	10234	23088	9491	5324	10545	5324	197
            12799	12799	19249	10550	4439	9495	3995	197
            10244	11525	17332	8444	3997	8444	3997	197
            14092	10249	21194	10560	5332	8448	4887	197
            15380	14099	21204	12678	4445	8452	4445	197
            15388	11541	15428	10570	4002	12684	4892	197
            11546	14112	19294	11633	4004	8460	4449	197
            14119	15402	17373	8464	4451	12696	5341	197
            11557	14125	23174	9527	4453	8468	5344	197
            13361	15031	25117	11014	6371	11014	5792	198
            10282	14138	17397	9536	4011	8476	5348	198
            10287	15431	23207	10600	3567	12720	4013	198
            12865	15438	17413	10605	4461	10605	3569	198
            12871	10297	15486	11671	4909	10610	4463	198
            14165	12877	21303	9554	5358	11677	5358	198
            11595	10306	17438	10620	5360	11682	4467	198
            15467	12889	21322	11688	3575	12750	4916	198
            10316	14185	19393	8504	4918	11693	5365	198
            10321	12901	21342	9572	5368	11699	4473	198
            18457	15101	20187	15215	5818	12449	5818	199
            11622	10330	19420	10645	5372	11710	3582	199
            14211	10335	19429	11715	5375	9585	3583	199
            11633	12925	19438	9590	4929	10655	4481	199
            14224	15517	15558	11726	5380	12792	3586	199
            15524	15524	15565	11732	3588	10665	4485	199
            10354	15532	19465	10670	4038	11737	4487	199
            10359	14244	21421	10675	4040	11743	4040	199
            14251	10364	21431	9612	4491	9612	4042	199
            10369	10369	15594	8548	3594	10685	5392	199
            15171	16857	22816	15287	6428	16676	6428	200
            11676	10378	15608	12834	3598	11765	4497	200
            12979	11681	21471	8560	4499	12840	5399	200
            11687	10388	23434	9635	4051	9635	5401	200
            11692	15589	21491	8568	4953	8568	4503	200
            15596	14297	19546	10715	4505	8572	4505	200
            13003	14303	19555	11792	4056	12864	5408	200
            10407	15611	21520	8580	4058	10725	5411	200
            11714	15618	15658	10730	4962	10730	4511	200
            14323	10417	17624	11809	3610	11809	4513	200
            16935	18629	20375	13962	5870	15358	4696	201
            15640	15640	21560	8596	4065	9671	5420	201
            15647	10431	21570	8600	3615	8600	4067	201
            14350	14350	17656	8604	4973	9680	4069	201
            14356	10441	21590	12912	4071	9684	4523	201
            14363	13057	23563	10765	4073	8612	3620	201
            14369	15676	19645	9693	4527	9693	3622	201
            14376	10455	21619	11853	4982	12930	4529	201
            11768	11768	17697	9702	4078	8624	4984	201
            14389	15697	21639	8628	4533	12942	4080	201
            20416	15312	28144	14027	4716	14027	6485	202
            10474	14402	15752	10795	4991	12954	3630	202
            14409	11789	17729	12960	4085	10800	3631	202
            15726	14416	17737	8644	4541	11886	4995	202
            10489	10489	21689	9729	5452	10810	4543	202
            10494	14429	17753	10815	5454	9734	5454	202
            11811	14435	23682	9738	5456	11902	5456	202
            15755	14442	17770	12990	4094	11908	4549	202
            13135	14449	23704	11913	4551	8664	5461	202
            13141	11827	21738	9752	4553	9752	4098	202
            13673	20509	30843	15501	5329	12683	5329	203
            13153	14468	19780	10845	4557	10845	4101	203
            14475	13159	23747	9765	5015	9765	4559	203
            13165	13165	23758	11941	4105	13026	4561	203
            13171	15805	23768	8688	5019	9774	4107	203
            14495	11859	15853	13038	3652	11952	4565	203
            13183	13183	19825	11957	5480	8696	4110	203
            15827	10551	21817	10875	5483	8700	5026	203
            13195	10556	21827	10880	5028	10880	4571	203
            14521	14521	21837	8708	3658	13062	4116	203
            15452	17169	30983	14157	5353	14157	6542	204
            15856	15856	17883	8716	5035	13074	5035	204
            13219	11897	17891	11990	5495	11990	5495	204
            15870	13225	21877	10905	5039	8724	5039	204
            13231	15877	19897	10910	4125	9819	5500	204
            14561	13237	21897	10915	5502	12007	5044	204
            13243	14567	15932	13104	4587	12012	5504	204
            15899	10599	15939	9833	4130	10925	3671	204
            13255	14581	15946	8744	5509	13116	4591	204
            11935	14587	17948	13122	4134	12029	3674	204
            13798	18972	31124	15644	7168	17066	5376	205
            14600	11946	17964	8756	3678	9851	3678	205
            11951	14607	19969	9855	4599	10950	5059	205
            15942	15942	23974	12051	4141	9860	5061	205
            14620	14620	19987	12056	5063	13152	5524	205
            15956	13297	23995	8772	4145	8772	4145	205
            15964	14633	18005	13164	5068	8776	4607	205
            14640	10647	20014	8780	3687	8780	3687	205
            11984	13315	16018	8784	5533	12078	5072	205
            11989	10657	22035	10985	5074	8788	5074	205
            13860	13860	26053	17144	6000	15716	7199	206
            14666	13333	20050	12095	4155	12095	5540	206
            16007	13339	18053	9900	5081	8800	4157	206
            12011	16014	22075	13206	3697	12106	5545	206
            13351	10681	16062	12111	5085	11010	4623	206
            16028	12021	18077	13218	4163	13218	5088	206
            16036	16036	22105	12122	3702	12122	4627	206
            13369	10695	24125	11025	3703	13230	5092	206
            14713	13375	24136	13236	5094	8824	5094	206
            16057	13381	16098	11035	3706	8828	5096	206
            20884	15663	23553	15787	5423	12917	4820	207
            16072	10714	18126	13254	4637	8836	5101	207
            12059	12059	24179	8840	5103	8840	4175	207
            13405	13405	22174	13266	5569	8844	4177	207
            10729	13411	24200	13272	5107	9954	4643	207
            12075	10734	22194	13278	4181	11065	5110	207
            14765	14765	24222	13284	5576	13284	5112	207
            16115	12086	18175	8860	4184	8860	4184	207
            13435	14779	16162	9972	5581	13296	3721	207
            13441	10753	16170	11085	4653	11085	4188	207
            19229	15733	26287	14417	6052	11534	6657	208
            13453	10762	18207	12205	4657	9986	4657	208
            14805	10767	22263	9990	5591	9990	4659	208
            12119	13465	24298	9995	5593	8884	5593	208
            14818	10777	20257	8888	4663	8888	4663	208
            10782	16172	16213	11115	5598	11115	4199	208
            12135	10786	20275	8896	4667	10008	5134	208
            13489	13489	24341	12238	4669	12238	5136	208
            10796	16194	22322	13356	4671	13356	5605	208
            10801	16201	24362	8908	5608	12249	5140	208
            14047	14047	31685	13034	5470	11586	5470	209
            16216	10810	18288	11145	5612	13374	4677	209
            16223	13519	24395	11150	3743	13380	4211	209
            13525	16230	18304	13386	5149	8924	4681	209
            10825	16237	22382	8928	5620	13392	5620	209
            12183	12183	16285	8932	4685	13398	5154	209
            14897	14897	24438	12287	5624	8936	4218	209
            14904	10839	16299	8940	3751	10058	4220	209
            13555	13555	18345	11180	4691	12298	3753	209
            13561	10849	16314	11185	4224	10067	5632	209
            14110	14110	31826	14547	6104	11638	7324	210`
    
            let levelMonsterArray=levelMonsterTable.split("\n");
            levelCount=levelCount==0?1:levelCount;
            let attr=levelMonsterArray[levelCount-1].split("\t");
            
    
            let monsterBasicAttr={
                    level:0,
                    HP:parseInt(attr[2]),
                    speed:parseInt(attr[5]),
                    antiSpeed:parseInt(attr[4]),
                    attack:parseInt(attr[0]),
                    defence:parseInt(attr[1]),
                    critical:parseInt(attr[3]),
                    antiCrit:parseInt(attr[6]),
                    name:'monster',
                    outExp:parseInt(attr[7]),
            }
    
            let monster=new Creature(monsterBasicAttr);
            return monster;            
        },
        async firstTimeChallenge(player){
            let levelCount=player.levelMonsterData.currentLevelCount;
            let monster=this.getMonster(levelCount);
            let battleResult=await player.attackAction(monster);
    
            if(battleResult==="player"){
                //胜利通关
                //50是首次通关的经验倍数
                let exp=monster.basicAttr.outExp*80;
                practiceRealm.calcLevel(player,monster,{exp:exp});
                player.levelMonsterData.challengeTime=-1;     
                player.levelMonsterData.currentLevelCount++;
                this.firstTimeChallenge(player);
            }else{
                //挑战失败后的处理            
                player.levelMonsterData.challengeTime+=1;
                let estimatePlayerPower=monster.battlePowerCalc()*Math.pow(1.1,player.levelMonsterData.challengeTime);            
                player.levelMonsterData.estimatePlayerPower=Math.round(estimatePlayerPower);
                player.levelMonsterData.inChallenge=false;
            }
        },
        ifAutoChallenge(player){  
            let estimatePlayerPower=player.levelMonsterData.estimatePlayerPower;     
            if(player.battlePowerCalc()>=estimatePlayerPower){
                autoFirst();
            }else if(player.levelMonsterData.challengeTime==-1){
                autoFirst();
            }else{
                return;
            }
            
            function autoFirst(){            
                //player.levelMonsterData.inRepeatAttack=false;
                if(player.levelMonsterData.inChallenge===true){
                    return;
                }else{
                    levelMonster.firstTimeChallenge(player);
                    player.levelMonsterData.inChallenge=true;
                }
            }
        },
        autoChallengeOrRepeatAttack(player){
            if(!player.levelMonsterData.inChallenge){
                this.ifAutoChallenge(player);
            }
    
            if(!player.levelMonsterData.inChallenge && !player.levelMonsterData.inRepeatAttack){            
                let levelCount=player.levelMonsterData.currentLevelCount;
                let monster=levelMonster.getMonster(levelCount-1);
                practiceRealm.calcLevel(player,monster);
            }
        }
        
    }


    let player=new Player();
var loginTime;
    if(!GM_getValue('loginTime')){
        loginTime=new Date().getTime()
        GM_setValue('loginTime',loginTime);
        singelRobot();
    }else{
        singelRobot();
    }

    function singelRobot(){
        let timer=setInterval(() => {
            let now=new Date().getTime();
            if(now-parseInt(GM_getValue('loginTime'))<29000){   
                clearInterval(timer);             
                return;
            }else{
                spriteRoot.calcLevel(player);
                levelMonster.autoChallengeOrRepeatAttack(player);
                //console.log(player);
                befeoreClose();
                GM_setValue('loginTime',now);
                //console.log("setinterval is run");
            }
        }, 30000);
    }

window.onbeforeunload=befeoreClose;

window.onunload=befeoreClose;

function befeoreClose(){
/*     spriteRoot.calcLevel(player);
    levelMonster.autoChallengeOrRepeatAttack(player); */
/*     let saveData=JSON.stringify(player);
    window.localStorage.setItem("saveData",saveData); */
    //let saveData=player;
    GM_setValue('saveData',player);
}
showStatus();
function showStatus(){
    let realmName=["炼气",'筑基','结丹','元婴','化神','炼虚','合体','大乘','渡劫'];
    console.log("玩家基本属性:");
    console.log(player.basicAttr);
    console.log(`灵识等级为:${player.spriteRoot.spriteLevel}`);
    let realm=Math.floor((player.practiceRealm.practiceLevel-1)/30);
    console.log(`修真境界为:${realmName[realm]}`);
    console.log(`通过关卡:${player.levelMonsterData.currentLevelCount}`);
}


})();