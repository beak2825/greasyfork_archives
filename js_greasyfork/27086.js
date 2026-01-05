// ==UserScript==
// @name        实时计算点数分配方案低配简化版
// @namespace   hinomiya
// @author      hinomiya
// @homepage    read.php?tid=589364
// @include     http://*2dkf.com/kf_fw_ig_index.php*
// @include     http://*9moe.com/kf_fw_ig_index.php*
// @include     http://*kfgal.com/kf_fw_ig_index.php*
// @include     https://*.miaola.info/kf_fw_ig_index.php*
// @version     1.6
// @grant       none
// @run-at      document-end
// @trigger     start
// @description KFOL助手的自定义点数分配脚本，可根据当前状态实时计算点数分配方案，运行速度最快，比劣化版也要快2-3倍，60层以下精度与原版相差无几
// @downloadURL https://update.greasyfork.org/scripts/27086/%E5%AE%9E%E6%97%B6%E8%AE%A1%E7%AE%97%E7%82%B9%E6%95%B0%E5%88%86%E9%85%8D%E6%96%B9%E6%A1%88%E4%BD%8E%E9%85%8D%E7%AE%80%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/27086/%E5%AE%9E%E6%97%B6%E8%AE%A1%E7%AE%97%E7%82%B9%E6%95%B0%E5%88%86%E9%85%8D%E6%96%B9%E6%A1%88%E4%BD%8E%E9%85%8D%E7%AE%80%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==
'use strict';

// 玩家当前状态
var currentLevel; // 当前层数
var currentLife; // 当前剩余生命值
var availablePoint; // 可分配属性点
var extraPointList; // 道具加成点数列表
var itemUsedNumList; // 道具使用情况列表
var basePoints; // 基础点数对象
var enemyList;  // 各层遭遇NPC列表
var totalStrongNum; // 目前出现强化怪个数

// 基础参数（全局变量）

var playerAttackCoefficient = 5; // 玩家攻系数
var playerHPCoefficient = 20; // 玩家血系数
var playerSpeedCoefficient = 2; // 玩家速系数

var CHCardinal = 100; // 暴击率基数
var SKLCardinal = 90; // 技能率基数
var DFCardinal = 150; // 防御基数

var antiAgilityCoefficient = 3; // 灵活抵消系数
var antiInteligenceCoefficient = 3; // 智力抵消系数

var CDNum; // CD使用数量
var CDCoefficient = 0.008; // 1张CD减npc血系数
var fullCDCoefficient; // 满CD减npc攻系数

var fullRemiHP; // 满蕾米加成生命，注意在技能伤害中不等同于35点数
var fullIzayoiSpeed; // 满16夜加成攻速


// npc参数

// npc参数基础数据（全局变量）

var npcPowerStepNum = 6; // npc力量递增数值
var npcHealthStepNum = 7; // npc体质递增数值
var npcQuickStepNum = 3; // npc敏捷递增数值
var npcAgilityStepNum = 2; // npc灵活递增数值
var npcInteligenceStepNum = 2; // npc智力递增数值
var npcWillStepNum = 2; // npc意志递增数值

var npcAttackCoefficient = 3; // npc攻系数
var npcHPCoefficient = 10; // npc血系数
var npcSpeedCoefficient = 2; // npc速系数

var npcSKLAttack = 0.25; // npc技能伤害加成

// npc强化系数（全局变量） 索引：普通npc为0，boss为1，壮汉为2，记者为3, 脆弱为4，缓慢为5 （待增加代码，可根据npc数据自动计算系数）

var npcPowerIntensiveCoefficient = [1, 1.5, 2, 1, 1, 1]; // npc力量强化系数
var npcHealthIntensiveCoefficient = [1, 2, 1.5, 1, 0.5, 1]; // npc体质强化系数
var npcQuickIntensiveCoefficient = [1, 1.5, 1, 2, 1, 0.3]; // npc敏捷强化系数
var npcAgilityIntensiveCoefficient = [1, 1.2, 1, 1.5, 1, 1]; // npc灵活强化系数
var npcInteligenceIntensiveCoefficient = [1, 1.2, 1, 1.5, 1, 1]; // npc智力强化系数
var npcWillIntensiveCoefficient = [1, 1.2, 1.5, 1, 0.5, 1]; // npc意志强化系数


// 需要玩家自行调整的变量，希望提供可视化接口
var playerPropability = 0.7;   // 默认事件发生概率初始值，脸越黑设得越大
var npcPropability = 0.3; // 默认npc事件发生概率初始值，脸越黑设得越小
var recoverLevel = 2.5;  // 预计回复楼层系数，根据连续几层不碰到强化npc进行估算，脸越黑设得越小



// 数学计算用函数

function factorial(intNum) {
// 计算阶乘
    var factnum = 1;
    for (var i = 1; i <= intNum; i++) {
        factnum *= i;
    }
    return factnum;
}
function getTimesProbability(trials, happenningTimes, Probablity_s) {
// 计算概率为Probablity_s的二项分布在总次数(trials)下成功次数至少为happenningTimes的概率
    var totalProbability = 0;
    var i = trials + 1;
    while(i > happenningTimes){
        i--;
        var tempProb = (factorial(trials) / factorial(trials - i) / factorial(i)) * Math.pow(1 - Probablity_s, trials - i) * Math.pow(Probablity_s, i);
        totalProbability += tempProb;
    }
    return totalProbability;
}
function getNPCPerByPoint(propertyName, currentLevel, npcFlag, pointNum) {
// 计算玩家（npc）暴击、技能率,npcFlag，即npc强化系数中对应索引
    var propertyNum = 0.000001;
    switch (propertyName) {
        case "灵活":
            var npcAgility = Math.round(npcAgilityStepNum * (currentLevel + 1) * npcAgilityIntensiveCoefficient[npcFlag]); // npc灵活
            npcAgility = npcAgility - Math.round((npcAgility + basePoints["灵活"] + pointNum) / antiAgilityCoefficient);
            propertyNum = Math.max(Math.round(npcAgility / (npcAgility + CHCardinal) * 100) / 100, 0.000001);
            break;
        case "智力":
            pointNum = pointNum + basePoints["智力"] - Math.round((pointNum + basePoints["智力"] + Math.round(npcInteligenceStepNum * (currentLevel) * npcInteligenceIntensiveCoefficient[npcFlag])) / antiInteligenceCoefficient);
            var npcInteligence = Math.round(npcInteligenceStepNum * (currentLevel + 1) * npcInteligenceIntensiveCoefficient[npcFlag]); // npc智力
            npcInteligence = npcInteligence - Math.round((npcInteligence + basePoints["智力"] + pointNum) / antiInteligenceCoefficient);
            propertyNum = Math.max(Math.round(npcInteligence / (npcInteligence + SKLCardinal) * 100) / 100, 0.000001);
            break;
        default:
            // 出错处理
            propertyNum = 0.000001;
    }
    return propertyNum;
}

function CritBinom(trials, Probablity_s, Alpha) {
// 仿制Excel函数，计算二项分布累积概率的临界次数
    if (Alpha === 0) {
        // Alpha只能取(0,1)间的值，取1或0时应按出错处理
        return 0;
    }
    if (Alpha === 1) {
        // Alpha只能取(0,1)间的值，取1或0时应按出错处理
        return trials;
    }

    if (Probablity_s === 0 || Probablity_s === 1) {
        // Probablity_s只能取(0,1)间的值，取1或0时应按出错处理
        return 0;
    }

    var exprimentTimes = 0; // 累积概率对应的事件发生次数
    var cumulativeProb = 0; // 累积概率
    while (cumulativeProb < Alpha) {
        // 二项分布概率
        var tempProb = (factorial(trials) / factorial(trials - exprimentTimes) / factorial(exprimentTimes)) * Math.pow(1 - Probablity_s, trials - exprimentTimes) * Math.pow(Probablity_s, exprimentTimes);
        // 计算累积概率
        cumulativeProb += tempProb;
        exprimentTimes++;
    }
    exprimentTimes--;
    return exprimentTimes;
}


function getEventProbability(happenningTimes, trials, defaultProbablity) {
// 计算二项分布在总次数(trials)下成功次数至少为happenningTimes的概率大于defaultProbablity时，单次事件成功概率的临界值
    if (happenningTimes === 0) {
        // 至少发生0次概率始终为1，返回单次事件成功概率的最小值

        return 0.000001;
    }
    if (defaultProbablity === 0) {
        // defaultProbablity只能取(0,1)间的值，取1或0时应按出错处理

        return 0;
    }
    if (defaultProbablity === 1) {
        // defaultProbablity只能取(0,1)间的值，取1或0时应按出错处理

        return 1;
    }

    var eventProbability = 0; // 单次事件成功概率 * 100，取整数便于迭代
    var eventProbability1 = 0; // 二分法下限
    var eventProbability2 = 100; // 二分法上限
    while (eventProbability1 < eventProbability2) {
        // 使用二分法迭代找出合适的单次事件成功概率
        eventProbability = Math.floor((eventProbability1 + eventProbability2) / 2);
        var hTimes = trials - CritBinom(trials, 1 - eventProbability / 100, defaultProbablity); // 概率不小于defaultProbablity时，事件至少发生次数
        if (hTimes < happenningTimes) {
            // eventProbability偏小，需要将二分法下限提高
            eventProbability1 = Math.ceil((eventProbability1 + eventProbability2) / 2);
        }
        else {
            // eventProbability偏大，需要将二分法上限降低
            eventProbability2 = Math.floor((eventProbability1 + eventProbability2) / 2);
        }
    }
    eventProbability = eventProbability1;
    return eventProbability / 100;
}


// 策略计算

function getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints) {
// 计算下一层npc参数，npcFlag，即npc强化系数中对应索引，返回npc参数对象

    var npcHP = Math.ceil(Math.ceil(npcHealthStepNum * (currentLevel + 1) * npcHealthIntensiveCoefficient[npcFlag]) * npcHPCoefficient * (1 - CDNum * CDCoefficient)); // npc血
    var npcAttack = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[npcFlag]) * npcAttackCoefficient * fullCDCoefficient); // npc攻
    var npcSpeed = Math.ceil(npcQuickStepNum * (currentLevel + 1) * npcQuickIntensiveCoefficient[npcFlag]) * npcSpeedCoefficient; // npc速

    var npcAgility = Math.round(npcAgilityStepNum * (currentLevel + 1) * npcAgilityIntensiveCoefficient[npcFlag]); // npc灵活
    npcAgility = npcAgility - Math.round((npcAgility + extraPointList.get('灵活') + levelPoints["灵活"]) / antiAgilityCoefficient);
    var npcCHPer = Math.max(Math.ceil(npcAgility / (npcAgility + CHCardinal) * 100) / 100, 0.000001); // npc暴击率

    var npcInteligence = Math.round(npcInteligenceStepNum * (currentLevel + 1) * npcInteligenceIntensiveCoefficient[npcFlag]); // npc智力
    npcInteligence = npcInteligence - Math.round((npcInteligence + extraPointList.get('智力') + levelPoints["智力"]) / antiInteligenceCoefficient);
    var npcSKLPer = Math.max(Math.ceil(npcInteligence / (npcInteligence + SKLCardinal) * 100) / 100, 0.000001); // npc技能率

    var npcWill = Math.ceil(npcWillStepNum * (currentLevel + 1) * npcWillIntensiveCoefficient[npcFlag]); // npc意志
    var npcDefence = Math.round(npcWill / (npcWill + DFCardinal) * 100) / 100; // npc防

    return {"血": npcHP, "攻": npcAttack, "速": npcSpeed, "暴击率": npcCHPer, "技能率": npcSKLPer, "防": npcDefence};

}

function getPropertyByPoint(propertyName, pointNum) {
// 因调用问题重写点数及属性计算函数
    var propertyNum = 1;
    switch (propertyName) {
        case "力量":
            propertyNum = (pointNum + basePoints["力量"]) * playerAttackCoefficient;
            break;
        case "体质":
            propertyNum = (pointNum + basePoints["体质"]) * playerHPCoefficient + fullRemiHP;
            break;
        case "敏捷":
            propertyNum = (pointNum + basePoints["敏捷"]) * playerSpeedCoefficient + fullIzayoiSpeed;
            break;
        case "意志":
            propertyNum = Math.round((pointNum + basePoints["意志"]) / ((pointNum + basePoints["意志"]) + DFCardinal) * 100) / 100;
            break;
        default:
            // 出错处理
            propertyNum = 1;
    }
    return propertyNum;
}

function getPointByProperty(propertyName, propertyNum) {
// 因调用问题重写点数及属性计算函数，防御等百分数用2位小数表示，如25%=0.25
    var pointNum = 1;
    switch (propertyName) {
        case "力量":
            pointNum = Math.max(Math.ceil(propertyNum / playerAttackCoefficient) - basePoints["力量"], 1);
            break;
        case "体质":
            pointNum = Math.max(Math.ceil((propertyNum - fullRemiHP) / playerHPCoefficient) - basePoints["体质"], 1);
            break;
        case "敏捷":
            pointNum = Math.max(Math.ceil((propertyNum - fullIzayoiSpeed) / playerSpeedCoefficient) - basePoints["敏捷"], 1);
            break;
        case "意志":
            pointNum = Math.max(Math.round(DFCardinal / (1 - propertyNum) - DFCardinal) - basePoints["意志"], 1);
            break;
        default:
            // 出错处理
            pointNum = 1;
    }
    return pointNum;

}

function getPerByPoint(propertyName, currentLevel, npcFlag, pointNum) {
// 计算玩家（npc）暴击、技能率,npcFlag，即npc强化系数中对应索引
    var propertyNum = 0.000001;
    switch (propertyName) {
        case "灵活":
            pointNum = pointNum + basePoints["灵活"] - Math.round((pointNum + basePoints["灵活"] + Math.round(npcAgilityStepNum * (currentLevel) * npcAgilityIntensiveCoefficient[npcFlag])) / antiAgilityCoefficient);
            propertyNum = Math.max(Math.round(pointNum / (pointNum + CHCardinal) * 100) / 100, 0.000001);
            break;
        case "智力":
            pointNum = pointNum + basePoints["智力"] - Math.round((pointNum + basePoints["智力"] + Math.round(npcInteligenceStepNum * (currentLevel) * npcInteligenceIntensiveCoefficient[npcFlag])) / antiInteligenceCoefficient);
            propertyNum = Math.max(Math.round(pointNum / (pointNum + SKLCardinal) * 100) / 100, 0.000001);
            break;
        default:
            // 出错处理
            propertyNum = 0.000001;
    }
    return propertyNum;

}

function getPointByPer(propertyName, currentLevel, npcFlag, propertyNum, pnflag) {
// 计算保持玩家（npc）暴击、技能率所需参数，npcFlag，即npc强化系数中对应索引，暴击率等百分数用2位小数表示，如25%=0.25；pnflag：玩家为0，npc为1
    var pointNum = 1;
    if (propertyNum < 0.01 && pnflag === 0) {
        // 不需要发动玩家暴击、技能
        return 1;
    }
    if (propertyNum > 0.99 && pnflag === 1) {
        // 不需要抑制npc暴击、技能
        return 1;
    }
    switch (propertyName) {
        case "灵活":
            var npcAgility = Math.ceil(npcAgilityStepNum * currentLevel * npcAgilityIntensiveCoefficient[npcFlag]);
            if (pnflag === 0) {
                pointNum = Math.max(Math.ceil((CHCardinal * antiAgilityCoefficient / (1 - propertyNum) - CHCardinal * antiAgilityCoefficient + npcAgility) / (antiAgilityCoefficient - 1)) - basePoints["灵活"], 1);
            }
            else if (pnflag === 1) {
                pointNum = Math.max(Math.ceil(CHCardinal * antiAgilityCoefficient + npcAgility * (antiAgilityCoefficient - 1) - CHCardinal * antiAgilityCoefficient / (1 - propertyNum)) - basePoints["灵活"], 1);
            }
            break;
        case "智力":
            var npcInteligence = Math.ceil(npcInteligenceStepNum * currentLevel * npcInteligenceIntensiveCoefficient[npcFlag]);
            if (pnflag === 0) {
                pointNum = Math.max(Math.ceil((SKLCardinal * antiInteligenceCoefficient / (1 - propertyNum) - SKLCardinal * antiInteligenceCoefficient + npcInteligence) / (antiInteligenceCoefficient - 1)) - basePoints["智力"], 1);
            }
            else if (pnflag === 1) {
                pointNum = Math.max(Math.ceil(SKLCardinal * antiInteligenceCoefficient + npcInteligence * (antiInteligenceCoefficient - 1) - SKLCardinal * antiInteligenceCoefficient / (1 - propertyNum)) - basePoints["智力"], 1);
            }
            break;
        default:
            // 出错处理
            pointNum = 1;
    }
    return pointNum;

}

function getPointForSP(propertyName, currentLevel, npcFlag, spTimes, attackTimes, defaultProbablity) {
// 暴击流或技能流加点，propertyName为灵活或智力，spTimes为暴击(技能)次数，attackTimes为总攻击次数，defaultProbablity为默认事件发生概率，函数返回相应灵活(智力)
    var spProbablity = getEventProbability(spTimes, attackTimes, defaultProbablity); // 计算玩家暴击（技能）率
    var spPoint = getPointByPer(propertyName, currentLevel, npcFlag, spProbablity, 0);
    return (spPoint);
}


function getPointAgainstSP(propertyName, currentLevel, npcFlag, spTimes, attackedTimes, defaultProbablity) {
// 封住npc暴击或技能，propertyName为灵活或智力，spTimes为暴击(技能)次数，attackedTimes为总被攻击次数，defaultProbablity为默认npc事件发生概率，函数返回相应灵活(智力)
    var spProbablity = Math.max(getEventProbability(spTimes + 1, attackedTimes, defaultProbablity) - 0.01, 0.000001); // 计算npc暴击（技能）率
    var spPoint = getPointByPer(propertyName, currentLevel, npcFlag, spProbablity, 1);
    return (spPoint);
}



function getNextLevelPointsByCHStrategy(currentLevel , currentLife , npcFlag, npcFlag2 , levelCHSStrategy){
// 通过方案参数，结合npc种类(npcFlag，即npc强化系数中对应索引)，计算出下一层点数分配方案，力量只与受攻击次数相关，灵活只与暴击率相关，意志为最优加点

    var playerPower = 1; // 玩家力量点数
    var playerHealth = 1; // 玩家体质点数
    var playerQuick = 1; // 玩家敏捷点数

    // 计算玩家敏捷点数
    var npcSpeed = Math.ceil(npcQuickStepNum * npcSpeedCoefficient * (currentLevel + 1) * npcQuickIntensiveCoefficient[npcFlag]); // npc速度
    playerQuick = getPointByProperty('敏捷', npcSpeed * levelCHSStrategy["攻速比"] + 1 * npcSpeedCoefficient); // 计算玩家敏捷加点
    // 计算玩家力量点数
    var playerSpeed = getPropertyByPoint('敏捷', playerQuick); // 玩家速度

    var attackTimes = levelCHSStrategy["攻击次数"]; // 玩家攻击npc次数
    var attackedNum = levelCHSStrategy["被攻击次数"]; // 被攻击次数

    var npcHP = Math.ceil(Math.ceil(npcHealthStepNum * npcHPCoefficient * (currentLevel + 1) * npcHealthIntensiveCoefficient[npcFlag]) * (1 - CDNum * CDCoefficient)); // npc血
    var npcWill = Math.ceil(npcWillStepNum * (currentLevel + 1) * npcWillIntensiveCoefficient[npcFlag]); // npc意志
    var npcDefence = Math.round(npcWill / (npcWill + DFCardinal) * 100) / 100; // npc防
    var npcAttack = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[npcFlag]) * npcAttackCoefficient * fullCDCoefficient); // npc攻

    var basePower = basePoints["力量"]; // 计算基础力量
    var baseInteligence = basePoints["智力"]; // 计算基础智力
    var baseHealth = basePoints["体质"]; // 计算基础体质

    playerPower = npcHP + 1 - Math.floor(playerAttackCoefficient * basePower * (1 - npcDefence)) * attackTimes;
    playerPower = Math.ceil((playerPower + attackTimes)/ (playerAttackCoefficient * (1 - npcDefence) * attackTimes));
    playerPower = Math.max(playerPower, 1); // 计算玩家力量加点

    var playerAgility = getPointByPer("灵活", currentLevel, npcFlag2, levelCHSStrategy["期望暴击率"], 0);
   // var playerAgility1 = attackedNum == 0 ? 1 : getPointAgainstSP("灵活", currentLevel, npcFlag, 0, attackedNum, npcPropability);
    // playerAgility = Math.max(playerAgility,playerAgility1);

    var playerInteligence = getPointByPer("智力", currentLevel, npcFlag2, levelCHSStrategy["期望技能率"], 0);
     // var playerInteligence1 = attackedNum == 0 ? 1 : getPointAgainstSP("智力", currentLevel, npcFlag, 0, attackedNum, npcPropability);
     // playerInteligence = Math.max(playerInteligence,playerInteligence1);

//console.log("攻击次数： " + attackTimes + " 被攻击次数 " + attackedNum);
    // 使用微分近似计算最优意志加点
    var playerWill = attackedNum == 0 ? 1 : Math.floor(Math.sqrt(DFCardinal * npcAttack / (playerHPCoefficient * extraPointList.get('耐力') / 100))) - 150;
    playerWill = Math.max(playerWill,1);
    var maxHPPlayerHealth = getPointByProperty("体质", currentLife);
    var maxPlayerHealth = basePoints["分配点"] - playerAgility - 1 - playerInteligence - playerPower - playerQuick;
    playerHealth = basePoints["分配点"] - playerAgility - playerWill - playerInteligence - playerPower - playerQuick; // 计算玩家体质加点
    if(playerHealth < maxHPPlayerHealth){
        // 意志加点已损害最大生命值，需减小至不损害最大生命值
        var diffPoint = Math.min(maxHPPlayerHealth - playerHealth,playerWill - 1);
        playerHealth += diffPoint;
        playerWill -= diffPoint;
    }
//console.log("计算体质： " + playerHealth + "  " + basePoints["分配点"] + "  " + playerAgility + "  " + playerWill + "  " + playerInteligence + "  " + playerPower + "  " + playerQuick);
    // 生成下一层分配点方案
    return {
        "力量": playerPower,
        "体质": playerHealth,
        "敏捷": playerQuick,
        "灵活": playerAgility,
        "智力": playerInteligence,
        "意志": playerWill
    };

}

function getNextAttackedTimes(currentLevel, npcFlag, levelPoints) {
// 通过配点参数计算攻略下一层玩家受攻击次数

    var npcParam = getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints); //计算下一层npc参数

    var attackTimes = Math.ceil(npcParam["血"] / Math.floor(getPropertyByPoint("力量", levelPoints["力量"]) * (1 - npcParam["防"]))); // 计算攻击npc次数，上限为不发生暴击（技能）的情况
    var npcHP = -1;
    while (npcHP <= 0 && attackTimes > 0) {
        // 计算打倒npc所需攻击次数临界值
        npcHP = npcParam["血"];
        attackTimes--;
        var expectCriticalHitNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("灵活", currentLevel + 1, npcFlag, levelPoints["灵活"]), playerPropability); // 期望玩家暴击次数
        var expectSkillNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("智力", currentLevel + 1, npcFlag, levelPoints["智力"]), playerPropability); // 期望玩家技能次数
        var expectCHSNum = attackTimes - CritBinom(attackTimes, 1 - getPerByPoint("灵活", currentLevel + 1, npcFlag, levelPoints["灵活"]) * getPerByPoint("智力", currentLevel + 1, npcFlag, levelPoints["智力"]), playerPropability); // 期望玩家技能、暴击叠加次数
        var npcDamage = Math.floor(getPropertyByPoint("力量", levelPoints["力量"]) * (1 - npcParam["防"])) * (attackTimes + expectCriticalHitNum); //+暴击伤害
        var antiInteligence = Math.round((levelPoints["智力"] + basePoints["智力"] + Math.ceil(npcInteligenceStepNum * (currentLevel + 1) * npcInteligenceIntensiveCoefficient[npcFlag])) / antiInteligenceCoefficient);
        var sumHealthInteligence = basePoints["体质"] + levelPoints["体质"] + basePoints["智力"] + levelPoints["智力"] - antiInteligence;
        npcDamage += Math.floor(sumHealthInteligence * 5 * (1 - npcParam["防"])) * expectSkillNum; //+技能伤害
        npcDamage += Math.floor(sumHealthInteligence * 5 * (1 - npcParam["防"])) * expectCHSNum; //+暴击、技能叠加伤害
        npcHP = npcHP - npcDamage;
    }
    attackTimes++;

    return Math.floor(attackTimes * npcParam["速"] / getPropertyByPoint('敏捷', levelPoints["敏捷"]));

}

function restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints) {
// 通过配点参数计算攻略下一层玩家的剩余生命值，加点参数是独立存在，不依赖与npc种类，故可以随便用（计算量更大）
    if(levelPoints["体质"] < 1){
        return 0;
    }
    var npcParam = getParamForNPCNextLevel(currentLevel, npcFlag, levelPoints); //计算下一层npc参数
    var attackedTimes = getNextAttackedTimes(currentLevel, npcFlag, levelPoints); // 玩家被攻击次数
    var playerDamage = 0; // 计算受到伤害


    var expectCriticalHitNum = attackedTimes - CritBinom(attackedTimes, 1 - npcParam["暴击率"], npcPropability); // 期望npc暴击次数
    var expectSkillNum = attackedTimes - CritBinom(attackedTimes, 1 - npcParam["技能率"], npcPropability); // 期望npc技能次数
    playerDamage += Math.ceil((attackedTimes + expectCriticalHitNum) * (1 - getPropertyByPoint("意志", levelPoints["意志"])) * npcParam["攻"]); //+暴击
    playerDamage += Math.ceil((expectSkillNum * (expectSkillNum + 1) / 2 + expectSkillNum * (attackedTimes - expectSkillNum - 1)) * npcSKLAttack * npcParam["攻"]); //+技能
    if (currentLife === 0) {
        // currentLife为0表示刚开始打
        return Math.max(getPropertyByPoint("体质", levelPoints["体质"]) - playerDamage, 0);
    }
    if (currentLife <= playerDamage) {
        // 被击败，来不及回血
        return 0;
    }
    playerDamage -= Math.floor(extraPointList.get('耐力') / 100 * getPropertyByPoint("体质", levelPoints["体质"]));
    return Math.min(currentLife - playerDamage, getPropertyByPoint("体质", levelPoints["体质"]));

}



// 安全系数
var securityStrong = 0.8;  // 针对壮汉
var securitySwift = 0.5;  // 针对记者
var securityRecover = 0.6;  // 回血期

playerPropability = 0.5;   // 默认事件发生概率初始值，脸越黑设得越大
npcPropability = 0.3; // 默认npc事件发生概率初始值，脸越黑设得越小

var playerPropability0 = 0.5;   // 默认事件发生概率初始值，脸越黑设得越大
var npcPropability0 = 0.3; // 默认npc事件发生概率初始值，脸越黑设得越小
var recoverLevel = 2.5;  // 预计回复楼层系数，根据连续几层不碰到强化npc进行估算，脸越黑设得越小

var safeHP = 150;

// 策略参数

// levelCHSStrategy为自定制方案，攻速比、攻击次数与getNextLevelByCHStrategy的第一个npcFlag（npcFlag）配合，确定针对npcFlag2无暴击技能的敏捷、力量；
// 被攻击次数确定意志，及封住npc暴击技能的灵活、智力；
// 期望暴击率与getNextLevelByCHStrategy的第二个npcFlag（npcFlag2）配合，求出针对npcFlag2暴击技能的灵活、智力
var LevelCHStrategy1 = {"攻速比": 2, "攻击次数": 4, "被攻击次数": 1, "期望暴击率": 0.21, "期望技能率": 0.001};  // 自定制方案 （4刀流）
var LevelCHStrategy2 = {"攻速比": 2, "攻击次数": 2, "被攻击次数": 0, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （2刀流）
var LevelCHStrategy3 = {"攻速比": 2, "攻击次数": 3, "被攻击次数": 0, "期望暴击率": 0.3, "期望技能率": 0.001};  // 自定制方案 （3刀流）
var LevelCHStrategy4 = {"攻速比": 2, "攻击次数": 7, "被攻击次数": 0, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （7刀流）
var LevelCHStrategy5 = {"攻速比": 2, "攻击次数": 5, "被攻击次数": 0, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （5刀流）
var LevelCHStrategy6 = {"攻速比": 2, "攻击次数": 6, "被攻击次数": 0, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （6刀流）
var LevelCHStrategy7 = {"攻速比": 2, "攻击次数": 4, "被攻击次数": 1, "期望暴击率": 0.21, "期望技能率": 0.001};  // 自定制方案 （4刀流）
var LevelCHStrategy8 = {"攻速比": 2, "攻击次数": 5, "被攻击次数": 1, "期望暴击率": 0.21, "期望技能率": 0.001};  // 自定制方案 （4刀流）
var LevelCHStrategy9 = {"攻速比": 1.5, "攻击次数": 3, "被攻击次数": 1, "期望暴击率": 0.21, "期望技能率": 0.001};  // 自定制方案 （4刀流）
var LevelCHStrategy10 = {"攻速比": 1.5, "攻击次数": 4, "被攻击次数": 1, "期望暴击率": 0.21, "期望技能率": 0.001};  // 自定制方案 （4刀流）

// 对boss加点方案；
var LevelCHStrategyboss = {"攻速比": 1.25, "攻击次数": 5, "被攻击次数": 3, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （boss5刀流）
var LevelCHStrategyboss1 = {"攻速比": 1.25, "攻击次数": 6, "被攻击次数": 3, "期望暴击率": 0.28, "期望技能率": 0.001};  // 自定制方案 （boss6刀流）
var LevelCHStrategyboss2 = {"攻速比": 1.25, "攻击次数": 7, "被攻击次数": 3, "期望暴击率": 0.5, "期望技能率": 0.001};  // 自定制方案 （boss7刀流）
var LevelCHStrategyboss3 = {"攻速比": 1.25, "攻击次数": 8, "被攻击次数": 3, "期望暴击率": 0.5, "期望技能率": 0.001};  // 自定制方案 （boss8刀流）
var LevelCHStrategyboss4 = {"攻速比": 1.333333333, "攻击次数": 5, "被攻击次数": 2, "期望暴击率": 0.34, "期望技能率": 0.001};  // 自定制方案 （boss5刀流）
var LevelCHStrategyboss5 = {"攻速比": 1.333333333, "攻击次数": 6, "被攻击次数": 2, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （boss6刀流）
var LevelCHStrategyboss6 = {"攻速比": 1.333333333, "攻击次数": 7, "被攻击次数": 2, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （boss7刀流）
var LevelCHStrategyboss7 = {"攻速比": 1.5, "攻击次数": 6, "被攻击次数": 1, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （boss4刀流）
var LevelCHStrategyboss8 = {"攻速比": 1.5, "攻击次数": 5, "被攻击次数": 1, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （boss5刀流）
var LevelCHStrategyboss9 = {"攻速比": 1.25, "攻击次数": 5, "被攻击次数": 3, "期望暴击率": 0.001, "期望技能率": 0.001};  // 自定制方案 （boss5刀流）

function getOptimalNextLevelPoints(currentLevel, currentLife, npcFlag) {
// 根据下一层各种npc数值及玩家属性及剩余生命情况，计算出最优方案参数,根据情况比较4刀、2刀、3刀的暴击流
    var npcAttackn = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[0]) * npcAttackCoefficient * fullCDCoefficient); // 普通npc攻
    var npcAttacks1 = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[2]) * npcAttackCoefficient * fullCDCoefficient); // 强壮npc1次攻击
    var npcAttacks2 = 2 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[2]) * npcAttackCoefficient * fullCDCoefficient); // 强壮npc2次攻击
    var npcAttackq = 2 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[3]) * npcAttackCoefficient * fullCDCoefficient); // 快速npc2次攻击
    var npcAttackb1 = 2 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[1]) * npcAttackCoefficient * fullCDCoefficient); // bossnpc2次攻击
    var npcAttackb2 = 2.25 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[1]) * npcAttackCoefficient * fullCDCoefficient); // bossnpc2次攻击
    var npcAttackb3 = 3.5 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[1]) * npcAttackCoefficient * fullCDCoefficient); // bossnpc3次攻击
    var npcAttackb4 = 3 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[1]) * npcAttackCoefficient * fullCDCoefficient); // bossnpc3次攻击
    var npcAttackb5 = 1 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[1]) * npcAttackCoefficient * fullCDCoefficient); // bossnpc3次攻击
    var npcAttackb6 = 3.25 * Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[1]) * npcAttackCoefficient * fullCDCoefficient); // bossnpc3次攻击

    var baseWill = basePoints["意志"] + 1;
    var baseDefence = Math.round(baseWill / (baseWill + DFCardinal) * 100) / 100; //玩家基础防
    var basedn = Math.floor(currentLife / npcAttackn * 100) / 100; // 普通npc安全防
    var basefn = getPointByProperty('意志', 1.01 - basedn); // 计算玩家对普通npc安全意志加点
 if(currentLevel % 10 == 9){
        // 针对boss加点


    var levelPoints = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss);
    var levelPoints1 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss1);
    var levelPoints2 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss2);
    var levelPoints3 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss3);
    var levelPoints4 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss4);
    var levelPoints5 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss5);
    var levelPoints6 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss6);
    var levelPoints7 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss7);
    var levelPoints8 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss8);
    var levelPoints9 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss9);

    levelPoints["灵活"] = getPointByPer("灵活", currentLevel + 1, 1, 0.2, 1);
    levelPoints["意志"] = 1;
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    levelPoints1["意志"] = 1;
    levelPoints1["体质"] = basePoints["分配点"] - levelPoints1["力量"] - levelPoints1["敏捷"] - levelPoints1["灵活"] - levelPoints1["智力"] - levelPoints1["意志"];
    levelPoints1["体质"] = Math.max(levelPoints1["体质"], 1);
    levelPoints1["灵活"] = Math.min(levelPoints1["灵活"], basePoints["分配点"] - levelPoints1["力量"] - levelPoints1["敏捷"] - levelPoints1["体质"] - levelPoints1["智力"] - levelPoints1["意志"]);
if(levelPoints1["体质"] >= levelPoints["体质"]){
    var levelPoints = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss1);
    levelPoints["灵活"] =  Math.max(levelPoints1["灵活"], getPointByPer("灵活", currentLevel + 1, 1, 0.11, 1));
    levelPoints1["灵活"] =  Math.max(levelPoints1["灵活"], getPointByPer("灵活", currentLevel + 1, 1, 0.11, 1));
    levelPoints1["意志"] = 1;
    levelPoints1["体质"] = basePoints["分配点"] - levelPoints1["力量"] - levelPoints1["敏捷"] - levelPoints1["灵活"] - levelPoints1["智力"] - levelPoints1["意志"];
    levelPoints1["体质"] = Math.max(levelPoints1["体质"], 1);
    levelPoints1["灵活"] = Math.min(levelPoints1["灵活"], basePoints["分配点"] - levelPoints1["力量"] - levelPoints1["敏捷"] - levelPoints1["体质"] - levelPoints1["智力"] - levelPoints1["意志"]);
    levelPoints2["意志"] = 1;
    levelPoints2["灵活"] = Math.max(levelPoints2["灵活"], getPointByPer("灵活", currentLevel + 1, 1, 0.11, 1));
    levelPoints2["体质"] = basePoints["分配点"] - levelPoints2["力量"] - levelPoints2["敏捷"] - levelPoints2["灵活"] - levelPoints2["智力"] - levelPoints2["意志"];
    levelPoints2["体质"] = Math.max(levelPoints2["体质"], 1);
    levelPoints2["灵活"] = Math.min(levelPoints2["灵活"], basePoints["分配点"] - levelPoints2["力量"] - levelPoints2["敏捷"] - levelPoints2["体质"] - levelPoints2["智力"] - levelPoints2["意志"]);
    var Probability1 = getTimesProbability(5,1,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints1["灵活"])) * (1 - getTimesProbability(3,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints1["灵活"])));
    var Probability2 = getTimesProbability(5,2,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints2["灵活"])) * (1 - getTimesProbability(3,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints2["灵活"])));
	    if(levelPoints2["体质"] * Probability2 >= levelPoints1["体质"] * Probability1){
		var levelPoints = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss2);
		    levelPoints["灵活"] = levelPoints2["灵活"];
		    levelPoints3["意志"] = 1;
		    levelPoints3["灵活"] = Math.max(levelPoints3["灵活"], getPointByPer("灵活", currentLevel + 1, 1, 0.001, 1));
		    levelPoints3["体质"] = basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["灵活"] - levelPoints3["智力"] - levelPoints3["意志"];
		    levelPoints3["体质"] = Math.max(levelPoints3["体质"], 1);
		    levelPoints3["灵活"] = Math.min(levelPoints3["灵活"], basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["体质"] - levelPoints3["智力"] - levelPoints3["意志"]);
		var Probability1 = getTimesProbability(5,3,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints3["灵活"])) * (1 - getTimesProbability(3,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints3["灵活"])));
			if(levelPoints3["体质"] * Probability1 >= levelPoints2["体质"] * Probability2){
				var levelPoints = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss3);
				levelPoints["灵活"] = levelPoints3["灵活"];
			}
	   }
 }
    var basehp = basePoints["体质"] * 20 + fullRemiHP;
    var basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - baseDefence) - basehp / 20), 1); // 基础体质点数
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["体质"] = Math.max(levelPoints["体质"], 1);
    levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];



    levelPoints["意志"] = Math.max(Math.floor(levelPoints["意志"] / 2), 1);
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["意志"] = Math.floor((basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"]- levelPoints["意志"]) / 2) + levelPoints["意志"];
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["意志"] = Math.floor((basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"]- levelPoints["意志"]) / 2) + levelPoints["意志"];
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["意志"] = Math.floor((basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"]- levelPoints["意志"]) / 2) + levelPoints["意志"];
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["意志"] = Math.floor((basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"]- levelPoints["意志"]) / 2) + levelPoints["意志"];
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["意志"] = Math.floor((basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"]- levelPoints["意志"]) / 2) + levelPoints["意志"];
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb3 /20 * 1.08 * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对boss基础体质点
    levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];



    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
    levelPoints["体质"] = Math.max(levelPoints["体质"], 1);
    levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
    levelPoints["灵活"] = Math.max(levelPoints["灵活"], 1);
    levelPoints["力量"] = basePoints["分配点"] - levelPoints["灵活"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];

if (levelPoints["灵活"] + levelPoints["意志"] -getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb4 * 100) / 100) > 1) {
	levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb4 * 100) / 100)); // 安全意志
	levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
}
if (levelPoints["灵活"] + levelPoints["意志"] -getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb6 * 100) / 100) > 1) {
	levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb6 * 100) / 100)); // 安全意志
	levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
}
if (levelPoints["灵活"] + levelPoints["意志"] -getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb3 * 100) / 100) > 1) {
	levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb3 * 100) / 100)); // 安全意志
	levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
}





    levelPoints4["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 1, 0.34, 0), getPointByPer("灵活", currentLevel + 1, 1, 0.16, 1));
    levelPoints4["意志"] = 1;
    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
    levelPoints4["体质"] = Math.max(levelPoints4["体质"], 1);
    levelPoints4["灵活"] = Math.min(levelPoints4["灵活"], basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["体质"] - levelPoints4["智力"] - levelPoints4["意志"]);
if(levelPoints4["灵活"] > 0){
    levelPoints5["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 1, 0.59, 0), getPointByPer("灵活", currentLevel + 1, 1, 0.16, 1));
	    levelPoints5["意志"] = 1;
	    levelPoints5["体质"] = basePoints["分配点"] - levelPoints5["力量"] - levelPoints5["敏捷"] - levelPoints5["灵活"] - levelPoints5["智力"] - levelPoints5["意志"];
	    levelPoints5["体质"] = Math.max(levelPoints5["体质"], 1);
	    levelPoints5["灵活"] = Math.min(levelPoints5["灵活"], basePoints["分配点"] - levelPoints5["力量"] - levelPoints5["敏捷"] - levelPoints5["体质"] - levelPoints5["智力"] - levelPoints5["意志"]);
		    if(levelPoints5["灵活"] > 0){
			    var Probability1 = getTimesProbability(4,2,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints5["灵活"])) * (1 - getTimesProbability(2,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints5["灵活"])) - getTimesProbability(2,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints5["灵活"])));
			    var Probability2 = getTimesProbability(4,1,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints4["灵活"])) * (1 - getTimesProbability(2,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints4["灵活"])) - getTimesProbability(2,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints4["灵活"])));
				if(levelPoints5["体质"] * Probability1 >= levelPoints4["体质"] * Probability2){
					var levelPoints4 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 1, 1 , LevelCHStrategyboss5);
					levelPoints4["灵活"] = levelPoints5["灵活"];

				}

		    }
		    var basehp = basePoints["体质"] * 20 + fullRemiHP;
		    var basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - baseDefence) - basehp / 20), 1); // 基础体质点数
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"];
		    levelPoints4["意志"] = Math.max(Math.floor(levelPoints4["意志"] / 2), 1);
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
		    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - Math.round((levelPoints4["意志"] + basePoints["意志"]) / (levelPoints4["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = Math.floor((basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"]- levelPoints4["意志"]) / 2) + levelPoints4["意志"];
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
		    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - Math.round((levelPoints4["意志"] + basePoints["意志"]) / (levelPoints4["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = Math.floor((basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"]- levelPoints4["意志"]) / 2) + levelPoints4["意志"];
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
		    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - Math.round((levelPoints4["意志"] + basePoints["意志"]) / (levelPoints4["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = Math.floor((basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"]- levelPoints4["意志"]) / 2) + levelPoints4["意志"];
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
		    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - Math.round((levelPoints4["意志"] + basePoints["意志"]) / (levelPoints4["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = Math.floor((basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"]- levelPoints4["意志"]) / 2) + levelPoints4["意志"];
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
		    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - Math.round((levelPoints4["意志"] + basePoints["意志"]) / (levelPoints4["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = Math.floor((basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"]- levelPoints4["意志"]) / 2) + levelPoints4["意志"];
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];
		    basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - npcAttackb2 /20 * 1.08 * (1 - Math.round((levelPoints4["意志"] + basePoints["意志"]) / (levelPoints4["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) - basehp / 20), 1);
		    levelPoints4["体质"] = Math.min(levelPoints4["体质"], basehppoint);  // 对boss基础体质点
		    levelPoints4["意志"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["体质"];
		    levelPoints4["意志"] = Math.max(levelPoints4["意志"], 1);
		    levelPoints4["体质"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["灵活"] - levelPoints4["智力"] - levelPoints4["意志"];

	if (levelPoints4["灵活"] + levelPoints4["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb1 * 100) / 100) > 0) {
		levelPoints4["意志"] = Math.max(levelPoints4["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb1 * 100) / 100)); // 安全意志
		levelPoints4["灵活"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["体质"] - levelPoints4["智力"] - levelPoints4["意志"];
	}

	if (levelPoints4["灵活"] + levelPoints4["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb2 * 100) / 100) > 0) {
		levelPoints4["意志"] = Math.max(levelPoints4["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb2 * 100) / 100)); // 安全意志
		levelPoints4["灵活"] = basePoints["分配点"] - levelPoints4["力量"] - levelPoints4["敏捷"] - levelPoints4["体质"] - levelPoints4["智力"] - levelPoints4["意志"];
	}


		    var restLife1 = currentLife - npcAttackb3 * (1 - (levelPoints["意志"] + basePoints["意志"])/(150 + levelPoints["意志"] + basePoints["意志"]));
		    restLife1 = Math.min(restLife1, (levelPoints["体质"] + basePoints["体质"]) * 20);  
		    var restLife2 = currentLife - npcAttackb2 * (1 - (levelPoints4["意志"] + basePoints["意志"])/(150 + levelPoints4["意志"] + basePoints["意志"]));
		    restLife2 = Math.min(restLife2, (levelPoints4["体质"] + basePoints["体质"]) * 20);  
			if(levelPoints1["力量"] === levelPoints["力量"]){
				var Probability1 = getTimesProbability(5,1,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints["灵活"])) * (1 - getTimesProbability(3,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])) - getTimesProbability(3,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])) - getTimesProbability(3,3,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])));
			}
			if(levelPoints2["力量"] === levelPoints["力量"]){
				var Probability1 = getTimesProbability(5,2,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints["灵活"])) * (1 - getTimesProbability(3,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])) - getTimesProbability(3,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])) - getTimesProbability(3,3,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])));
			}
			if(levelPoints3["力量"] === levelPoints["力量"]){
				var Probability1 = getTimesProbability(5,3,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints["灵活"])) * (1 - getTimesProbability(3,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])) - getTimesProbability(3,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])) - getTimesProbability(3,3,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"])));
			}
		    var Probability2 = getTimesProbability(4,1,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints4["灵活"])) * (1 - getTimesProbability(2,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints4["灵活"])) - getTimesProbability(2,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints4["灵活"])));
			if(levelPoints4["力量"] === levelPoints5["力量"]){
				var Probability2 = getTimesProbability(4,2,getPerByPoint("灵活", currentLevel + 1, 1, levelPoints4["灵活"])) * (1 - getTimesProbability(2,1,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints4["灵活"])) - getTimesProbability(2,2,getNPCPerByPoint("灵活", currentLevel, 1, levelPoints4["灵活"])));
			}

			restLife1 = restLife1 - npcAttackb5 * (1 - Probability1) *(1 - (levelPoints["意志"] + basePoints["意志"])/(150 + levelPoints["意志"] + basePoints["意志"])); 
			restLife2 = restLife2 - npcAttackb5 * (1 - Probability2) * (1 - (levelPoints4["意志"] + basePoints["意志"])/(150 + levelPoints4["意志"] + basePoints["意志"]));
		    if(restLife2 > restLife1){
				levelPoints["体质"] = levelPoints4["体质"];
				levelPoints["力量"] = levelPoints4["力量"];
				levelPoints["体质"] = levelPoints4["体质"];
				levelPoints["敏捷"] = levelPoints4["敏捷"];
				levelPoints["灵活"] = levelPoints4["灵活"];
				levelPoints["智力"] = levelPoints4["智力"];
				levelPoints["意志"] = levelPoints4["意志"];
		    restLife1 = restLife2;  
		    }
		    if(restLife1 < 0){
				levelPoints["体质"] = levelPoints4["体质"];
				levelPoints["力量"] = levelPoints4["力量"];
				levelPoints["体质"] = levelPoints4["体质"];
				levelPoints["敏捷"] = levelPoints4["敏捷"];
				levelPoints["灵活"] = levelPoints4["灵活"];
				levelPoints["智力"] = levelPoints4["智力"];
				levelPoints["意志"] = levelPoints4["意志"];
		    restLife1 = restLife2;  
		    }



}


if(levelPoints1["敏捷"] === levelPoints["敏捷"]){
	var restLife1 = currentLife - npcAttackb4 * (1 - (levelPoints["意志"] + basePoints["意志"])/(150 + levelPoints["意志"] + basePoints["意志"]));

            levelPoints5["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 1, 0.59, 0), getPointByPer("灵活", currentLevel + 1, 1, 0.16, 1));
	    levelPoints5["意志"] = 1;
	    levelPoints5["体质"] = basePoints["分配点"] - levelPoints5["力量"] - levelPoints5["敏捷"] - levelPoints5["灵活"] - levelPoints5["智力"] - levelPoints5["意志"];
	    levelPoints5["体质"] = Math.max(levelPoints5["体质"], 1);
	    levelPoints5["灵活"] = Math.min(levelPoints5["灵活"], basePoints["分配点"] - levelPoints5["力量"] - levelPoints5["敏捷"] - levelPoints5["体质"] - levelPoints5["智力"] - levelPoints5["意志"]);

		    if(restLife1 < 0){
				levelPoints["体质"] = levelPoints5["体质"];
				levelPoints["力量"] = levelPoints5["力量"];
				levelPoints["体质"] = levelPoints5["体质"];
				levelPoints["敏捷"] = levelPoints5["敏捷"];
				levelPoints["灵活"] = levelPoints5["灵活"];
				levelPoints["智力"] = levelPoints5["智力"];
				levelPoints["意志"] = levelPoints5["意志"];
				if (levelPoints["灵活"] + levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb1 * 100) / 100) > 0) {
					levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb1 * 100) / 100)); // 安全意志
					levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
				}
				if (levelPoints["灵活"] + levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb2 * 100) / 100) > 0) {
					levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb2 * 100) / 100)); // 安全意志
					levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
				}

		    }

}
if(levelPoints5["敏捷"] === levelPoints["敏捷"]){
	var restLife1 = currentLife - npcAttackb1 * (1 - (levelPoints["意志"] + basePoints["意志"])/(150 + levelPoints["意志"] + basePoints["意志"]));

            levelPoints7["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 1, 0.59, 0), getPointByPer("灵活", currentLevel + 1, 1, 0.16, 1));
	    levelPoints7["意志"] = 1;
	    levelPoints7["体质"] = basePoints["分配点"] - levelPoints7["力量"] - levelPoints7["敏捷"] - levelPoints7["灵活"] - levelPoints7["智力"] - levelPoints7["意志"];
	    levelPoints7["体质"] = Math.max(levelPoints7["体质"], 1);
	    levelPoints7["灵活"] = Math.min(levelPoints7["灵活"], basePoints["分配点"] - levelPoints7["力量"] - levelPoints7["敏捷"] - levelPoints7["体质"] - levelPoints7["智力"] - levelPoints7["意志"]);

		    if(restLife1 < 0){
				levelPoints["体质"] = levelPoints7["体质"];
				levelPoints["力量"] = levelPoints7["力量"];
				levelPoints["体质"] = levelPoints7["体质"];
				levelPoints["敏捷"] = levelPoints7["敏捷"];
				levelPoints["灵活"] = levelPoints7["灵活"];
				levelPoints["智力"] = levelPoints7["智力"];
				levelPoints["意志"] = levelPoints7["意志"];
					if (getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb5 * 100) / 100) - levelPoints["意志"] < levelPoints["灵活"]) {
						levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackb5 * 100) / 100)); // 安全意志
						levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
					}


		    }



}
	levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
	levelPoints["体质"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"], 1);
	levelPoints["意志"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"], 1);
	levelPoints["体质"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"], 1);
	levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
	levelPoints["意志"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"], 1);
	levelPoints["力量"] = basePoints["分配点"] - levelPoints["体质"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];



	    
	    levelPoints["敏捷"] = Math.max(levelPoints["敏捷"] - 1, 1);

	    var pointNump1 = getPropertyByPoint("意志", levelPoints["意志"]);
	    var pointNump2 = getPropertyByPoint("意志", levelPoints["意志"]);
	    while (pointNump1 === pointNump2 && levelPoints["意志"] > 0) {
		levelPoints["意志"]--;
		pointNump2 = getPropertyByPoint("意志", levelPoints["意志"]);
	       
	    }
		levelPoints["意志"]++;
				       

		levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["意志"] - levelPoints["智力"] - levelPoints["体质"];
		var point1 = levelPoints["灵活"];
		var point2 = 0;
		var point3 = 0;
		var pointNump1 = getNPCPerByPoint("灵活", currentLevel , 1, levelPoints["灵活"]);
		var pointNump2 = getNPCPerByPoint("灵活", currentLevel , 1, levelPoints["灵活"]);
		while (pointNump1 === pointNump2 && levelPoints["灵活"] > 0) {
			levelPoints["灵活"]--;
			pointNump2 = getNPCPerByPoint("灵活", currentLevel , 1, levelPoints["灵活"]);
		   
		}
		levelPoints["灵活"]++;
		point2 = point1 - levelPoints["灵活"];
		levelPoints["灵活"] = point1;
		var pointNump1 = getPerByPoint("灵活", currentLevel + 1, 1, levelPoints["灵活"]);
		var pointNump2 = getPerByPoint("灵活", currentLevel + 1, 1, levelPoints["灵活"]);
		while (pointNump1 === pointNump2 && levelPoints["灵活"] > 0) {
			levelPoints["灵活"]--;
			pointNump2 = getPerByPoint("灵活", currentLevel + 1, 1, levelPoints["灵活"]);
		   
		}
		levelPoints["灵活"]++;
		point3 = point1 - levelPoints["灵活"];
		levelPoints["灵活"] = point1 - Math.min(point2, point3);


		levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
	    var pointNump1 = getPropertyByPoint("意志", levelPoints["意志"]);
	    var pointNump2 = getPropertyByPoint("意志", levelPoints["意志"]);
	    while (pointNump1 === pointNump2 && levelPoints["意志"] > 0) {
		levelPoints["意志"]--;
		pointNump2 = getPropertyByPoint("意志", levelPoints["意志"]);
	       
	    }
		levelPoints["意志"]++;


		
	    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];






   return levelPoints;
    }


    // 4刀暴击流
    attackFlag = 4;
    var levelPoints = getNextLevelPointsByCHStrategy(currentLevel , currentLife , npcFlag, 3 , LevelCHStrategy1);
    var levelPoints2 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , npcFlag, 0 , LevelCHStrategy2);
    var levelPoints3 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , npcFlag, 0 , LevelCHStrategy3);
    var levelPoints4 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 2, 2 , LevelCHStrategy4);
    var levelPoints5 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 2, 2 , LevelCHStrategy5);
    var levelPoints6 = getNextLevelPointsByCHStrategy(currentLevel , currentLife , 2, 2 , LevelCHStrategy6);
    var levelPoints7 = getNextLevelPointsByCHStrategy(currentLevel , currentLife ,0, 3 , LevelCHStrategy7);
    var levelPoints8 = getNextLevelPointsByCHStrategy(currentLevel , currentLife ,0, 3 , LevelCHStrategy8);
    var levelPoints9 = getNextLevelPointsByCHStrategy(currentLevel , currentLife ,0, 3 , LevelCHStrategy9);
    var levelPoints10 = getNextLevelPointsByCHStrategy(currentLevel , currentLife ,0, 3 , LevelCHStrategy10);
    var npcAttackn1 = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[0]) * npcAttackCoefficient * fullCDCoefficient); // 普通npc攻

if(basePoints["灵活"] < 50){
     levelPoints["力量"] = levelPoints6["力量"];
     levelPoints["意志"] = 1;
     levelPoints["灵活"] = getPointByPer("灵活", currentLevel + 1, 0, 0.2, 1);
     levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
     var basehp = basePoints["体质"] * 20 + fullRemiHP;
     var basehppoint = Math.max(Math.floor(currentLife /20 * 1.08 - basehp / 20), 1); // 基础体质点数
	if (currentLevel > 0) {
	     var powerppointn = Math.max(levelPoints["体质"] - basehppoint, 0); // 对普通npc自由属性点
	    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对普通npc基础体质点
	    }
     levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
     if (levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks2 * 100) / 100) < 0) {
	levelPoints["力量"] = levelPoints7["力量"];
	levelPoints["体质"] = levelPoints["体质"] + levelPoints6["力量"] - levelPoints7["力量"];
	levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
     }
        if(levelPoints3["力量"] - levelPoints6["力量"] < powerppointn){
	    levelPoints["力量"] = levelPoints3["力量"];
	    levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
			if (levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100) < 0) {
			levelPoints["力量"] = levelPoints7["力量"];
			levelPoints["体质"] = levelPoints["体质"] + levelPoints6["力量"] - levelPoints7["力量"];
			levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
			   }
			if(basePoints["灵活"] > 20){
				levelPoints["力量"] = levelPoints5["力量"];
				levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - 1 - levelPoints["智力"] - levelPoints["体质"];
				levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
				levelPoints["意志"] = Math.max(levelPoints["意志"], 1);
				levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
				if (levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100) < 0) {
					levelPoints["力量"] = levelPoints7["力量"];
					levelPoints["灵活"] = getPointByPer("灵活", currentLevel + 1, 0, 0.2, 1);
					levelPoints["意志"] = 1;
					levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
					levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对普通npc基础体质点
				        levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];

				}

			}

	}
	var basevit = levelPoints3["灵活"] + levelPoints3["体质"];
	if(basevit > 1){
		levelPoints3["力量"] = levelPoints3["力量"];
		levelPoints3["意志"] = 1;
		levelPoints3["体质"] = Math.max(levelPoints3["体质"], 1);
		levelPoints3["灵活"] = basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["体质"] - levelPoints3["智力"] - levelPoints3["意志"];
		var npcAttackn1 = (fullRemiHP + (levelPoints["体质"] + basePoints["体质"]) * 20) * 0.08 + currentLife - (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) * npcAttackn;
		var npcAttackn2 = (fullRemiHP + (levelPoints3["体质"] + basePoints["体质"]) * 20) * 0.08 + currentLife - npcAttackn * (1 - getTimesProbability(2,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints3["灵活"])));
		if(levelPoints["力量"] > levelPoints7["力量"]){
			var npcAttackn1 = (fullRemiHP + (levelPoints["体质"] + basePoints["体质"]) * 20) * 0.08 + currentLife - npcAttackn * (1 - getTimesProbability(2,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"])));
		}
		    npcAttackn1 = Math.min(npcAttackn1, fullRemiHP + (levelPoints["体质"] + basePoints["体质"]) * 20);
		    npcAttackn2 = Math.min(npcAttackn2, fullRemiHP + (levelPoints3["体质"] + basePoints["体质"]) * 20);

		if(npcAttackn2 >= npcAttackn1){
			levelPoints["力量"] = levelPoints3["力量"];
			levelPoints["意志"] = 1;
			levelPoints["体质"] = levelPoints3["体质"];
			levelPoints["灵活"] = levelPoints3["灵活"];
			if (levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100) >= 0) {
				levelPoints["力量"] = levelPoints5["力量"];
				levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
				levelPoints["灵活"] = Math.max(levelPoints["灵活"], 1);
				levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
			}

		}
	}

}
if(basePoints["灵活"] >= 50){
	if (basePoints["灵活"] < 60) {
	      levelPoints["灵活"] = getPointByPer("灵活", currentLevel + 1, 0, 0.24, 0);
	    }

    levelPoints["意志"] = 1;
    levelPoints["力量"] = Math.max(levelPoints["力量"], levelPoints4["力量"]); // 比较力量加点
	if (currentLevel > 49) {
	      levelPoints["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 0, 0.2, 1), getPointByPer("灵活", currentLevel + 1, 0, 0.43, 0));
    levelPoints["力量"] = levelPoints7["力量"]; // 比较力量加点
	    }
    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"]; // 重新计算体质
    var basehp = basePoints["体质"] * 20 + fullRemiHP;
    var basehppoint = Math.max(Math.round(currentLife /20 * 1.08 - basehp / 20), 1); // 基础体质点数
	if (currentLevel > 0) {
		levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对普通npc基础体质点
	}
    levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
    var basevit = levelPoints3["灵活"] + levelPoints3["体质"];

	if (levelPoints["体质"] + levelPoints["意志"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks2 * 100) / 100) < 1) {
		levelPoints["力量"] = levelPoints7["力量"];
		levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
		if (levelPoints["体质"] + levelPoints["意志"] + levelPoints["灵活"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100) > 2) {
			levelPoints["意志"] = Math.max(levelPoints["意志"], getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100)); // 安全意志
			levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
			levelPoints["灵活"] = Math.max(levelPoints["灵活"], 1);
			levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
		}	

	}
	if (currentLevel > 49) {
		  levelPoints3["灵活"] = getPointByPer("灵活", currentLevel + 1, 0, 0.4, 0);
		  levelPoints3["体质"] = basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["灵活"] - levelPoints3["智力"] - levelPoints3["意志"];
		  levelPoints5["力量"] = levelPoints3["力量"];

	}
	var basevit = levelPoints3["灵活"] + levelPoints3["体质"];
	if(basevit > 1){
		levelPoints3["力量"] = levelPoints3["力量"];
		levelPoints3["意志"] = 1;
		levelPoints3["体质"] = Math.max(levelPoints3["体质"], 1);
		levelPoints3["灵活"] = basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["体质"] - levelPoints3["智力"] - levelPoints3["意志"];
		var npcAttackn1 = (fullRemiHP + (levelPoints["体质"] + basePoints["体质"]) * 20) * 0.08 + currentLife - (1 - getTimesProbability(2,2,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]))) * (1 - Math.round((levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) * npcAttackn * (1 + getNPCPerByPoint("灵活", currentLevel, 1, levelPoints["灵活"]));
		var npcAttackn2 = (fullRemiHP + (levelPoints3["体质"] + basePoints["体质"]) * 20) * 0.08 + currentLife - (1 - Math.round((levelPoints3["意志"] + basePoints["意志"]) / (levelPoints3["意志"] + basePoints["意志"] + DFCardinal) * 100) / 100) * npcAttackn * (1 + getNPCPerByPoint("灵活", currentLevel, 1, levelPoints3["灵活"])) * (1 - getTimesProbability(2,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints3["灵活"])));
		    npcAttackn1 = Math.min(npcAttackn1, fullRemiHP + (levelPoints["体质"] + basePoints["体质"]) * 20);
		    npcAttackn2 = Math.min(npcAttackn2, fullRemiHP + (levelPoints3["体质"] + basePoints["体质"]) * 20);

		if(npcAttackn2 >= npcAttackn1){
			levelPoints["力量"] = levelPoints3["力量"];
			levelPoints["意志"] = 1;
			levelPoints["体质"] = levelPoints3["体质"];
			levelPoints["灵活"] = levelPoints3["灵活"];


		}
	}
}
console.log(levelPoints);
    var restLife1 = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints);
console.log("4刀流生命： " + restLife1);
    // 2刀暴击流
if(levelPoints2["体质"] >= 1){
     var restLife2 = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints2);
            if(restLife1 < restLife2){
                // 2刀暴击流由于4刀
                levelPoints["力量"] = levelPoints2["力量"];
                levelPoints["体质"] = levelPoints2["体质"];
                levelPoints["敏捷"] = levelPoints2["敏捷"];
                levelPoints["灵活"] = levelPoints2["灵活"];
                levelPoints["智力"] = levelPoints2["智力"];
                levelPoints["意志"] = levelPoints2["意志"];
	    levelPoints["敏捷"] = Math.max(levelPoints["敏捷"] - 1, 1);
	    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
      return levelPoints;
                attackFlag = 2;
            }
    }
if (currentLevel > 49) {
	  levelPoints3["灵活"] = getPointByPer("灵活", currentLevel + 1, 0, 0.4, 0);
	  levelPoints3["体质"] = basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["灵活"] - levelPoints3["智力"] - levelPoints3["意志"];
	  levelPoints5["力量"] = levelPoints3["力量"];

}
console.log(levelPoints2);
    var restLife2 = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints2);
console.log("2刀流生命： " + restLife2);

console.log(levelPoints3);
    var restLife3 = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints3);
console.log("3刀流生命： " + restLife3);
if(levelPoints3["体质"] >= 1){
        var restLife3 = restLifeInNextLevelByPoints(currentLevel, currentLife, npcFlag, levelPoints3);
        if(restLife3 >= restLife1){
              levelPoints["力量"] = levelPoints3["力量"];
              levelPoints["体质"] = levelPoints3["体质"];
              levelPoints["敏捷"] = levelPoints3["敏捷"];
              levelPoints["灵活"] = levelPoints3["灵活"];
              levelPoints["智力"] = levelPoints3["智力"];
              levelPoints["意志"] = levelPoints3["意志"]; 
	      var basehppoint = Math.max(Math.ceil(currentLife /20 * 1.08 - basehp / 20), 1); // 基础体质点数
	if (currentLevel > 0) {
	     var powerppointn = Math.max(levelPoints["体质"] - basehppoint, 0); // 对普通npc自由属性点
	    levelPoints["体质"] = Math.min(levelPoints["体质"], basehppoint);  // 对普通npc基础体质点
	    }
	if (powerppointn + 1 >= getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackn * 100) / 100)) {
	      levelPoints["意志"] = getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackn * 100) / 100); // 安全意志
        }

	if (levelPoints3["体质"] - basehppoint - levelPoints5["力量"] + levelPoints3["力量"] > 0) {
	      levelPoints["力量"] = levelPoints5["力量"];

	     if (levelPoints3["体质"] - basehppoint - levelPoints5["力量"] + levelPoints3["力量"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100) >= 0) {
			levelPoints["意志"] = getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100); // 安全意志

		}
        }

              levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["意志"] - levelPoints["智力"] - levelPoints["体质"]; 
		if (currentLevel < 49) {
		      levelPoints["灵活"] =  Math.min(levelPoints["灵活"], getPointByPer("灵活", currentLevel + 1, 3, 0.3, 0));
		}
		if (currentLevel > 49) {
			levelPoints["灵活"] =  Math.min(levelPoints["灵活"], getPointByPer("灵活", currentLevel + 1, 0, 0.46, 0) - 2);
		}
		if (currentLevel > 59) {
		      levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["意志"] - levelPoints["智力"] - levelPoints["体质"]; 
		      levelPoints["灵活"] =  Math.min(levelPoints["灵活"], getPointByPer("灵活", currentLevel + 1, 0, 0.5, 0) - 2);
		}

		if (currentLevel % 10 > 3) {
		    levelPoints["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 0, 0.2, 1), getPointByPer("灵活", currentLevel + 1, 0, 0.51, 0));
		    levelPoints["灵活"] =  Math.min(levelPoints["灵活"], basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"]);
		    levelPoints["意志"] =  Math.min(getPointByProperty('意志', 0.3), basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"]);
		    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];

		}

		    levelPoints["意志"] =  Math.min(getPointByProperty('意志', 0.3), basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"]);
		    levelPoints["灵活"] =  Math.max(getPointByPer("灵活", currentLevel + 1, 0, 0.2, 1), getPointByPer("灵活", currentLevel + 1, 0, 0.51, 0));
		    levelPoints["灵活"] =  Math.min(levelPoints["灵活"], basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"]);
		    levelPoints["意志"] =  Math.min(getPointByProperty('意志', 0.5), basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"]);
		    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];
		    if (levelPoints3["体质"] - basehppoint - levelPoints5["力量"] + levelPoints3["力量"] - getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttacks1 * 100) / 100) < 0) {
				levelPoints["力量"] = levelPoints3["力量"];
				levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["意志"] - levelPoints["智力"] - levelPoints["体质"];
			}


          }
}



		levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["体质"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["意志"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"], 1);
		levelPoints["体质"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["意志"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"], 1);
		levelPoints["力量"] = basePoints["分配点"] - levelPoints["体质"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];



if (levelPoints["意志"] < getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackn * 100) / 100)) {

	if(levelPoints["力量"] === levelPoints7["力量"]){
		levelPoints["意志"] = 1;
		levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
		var respoint1 = getTimesProbability(2,2,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]));
	}

	if(levelPoints["力量"] > levelPoints7["力量"]){
		var respoint1 = getTimesProbability(2,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]));
	}


     levelPoints3["体质"] = 1; 
     levelPoints3["意志"] = 1;
     levelPoints3["灵活"] = basePoints["分配点"] - levelPoints3["力量"] - levelPoints3["敏捷"] - levelPoints3["体质"] - levelPoints3["智力"] - levelPoints3["意志"];
		if(levelPoints3["灵活"] > 0){
		var respoint2 = getTimesProbability(2,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints3["灵活"]));
			if(respoint2 > respoint1){
				respoint1 = respoint2;
				levelPoints["力量"] = levelPoints3["力量"];
				levelPoints["体质"] = levelPoints3["体质"];
				levelPoints["敏捷"] = levelPoints3["敏捷"];
				levelPoints["灵活"] = levelPoints3["灵活"];
				levelPoints["智力"] = levelPoints3["智力"];
				levelPoints["意志"] = levelPoints3["意志"];

			}
		}


	levelPoints["意志"] = getPointByProperty('意志', 1.01 - Math.floor(currentLife / npcAttackn * 100) / 100);

    var npcAttackn1 = Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[0]) * npcAttackCoefficient * fullCDCoefficient); // 普通npc攻
	    while (npcAttackn > 0 && levelPoints["意志"] > 0) {
		levelPoints["意志"]--;
		npcAttackn = currentLife - Math.round(npcAttackn1 * Math.round((1- (levelPoints["意志"] + basePoints["意志"]) / (levelPoints["意志"] + basePoints["意志"] + 150 )) * 100) / 100);
	       
	    }
		levelPoints["意志"]++;

     var playwill = levelPoints["意志"];
     levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];
		if(levelPoints["灵活"] < 0){
			levelPoints["意志"] = 1;
		}
     levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"];


     levelPoints7["体质"] = 1; 
     levelPoints7["意志"] = playwill;
     levelPoints7["灵活"] = basePoints["分配点"] - levelPoints7["力量"] - levelPoints7["敏捷"] - levelPoints7["体质"] - levelPoints7["智力"] - levelPoints7["意志"];

		if(levelPoints7["灵活"] > 0){
		var respoint2 = 1;
			if(respoint2 > respoint1){
				respoint1 = respoint2;
				levelPoints["力量"] = levelPoints7["力量"];
				levelPoints["体质"] = levelPoints7["体质"];
				levelPoints["敏捷"] = levelPoints7["敏捷"];
				levelPoints["灵活"] = levelPoints7["灵活"];
				levelPoints["智力"] = levelPoints7["智力"];
				levelPoints["意志"] = levelPoints7["意志"];

			}
		}

     levelPoints8["体质"] = 1; 
     levelPoints8["意志"] = playwill;
     levelPoints8["灵活"] = basePoints["分配点"] - levelPoints8["力量"] - levelPoints8["敏捷"] - levelPoints8["体质"] - levelPoints8["智力"] - levelPoints8["意志"];
		if(levelPoints8["灵活"] > 0){
		var respoint2 = (1 - getNPCPerByPoint("灵活", currentLevel, 1, levelPoints8["灵活"])) * getTimesProbability(4,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints8["灵活"]));
			if(respoint2 > respoint1){
				respoint1 = respoint2;
				levelPoints["力量"] = levelPoints8["力量"];
				levelPoints["体质"] = levelPoints8["体质"];
				levelPoints["敏捷"] = levelPoints8["敏捷"];
				levelPoints["灵活"] = levelPoints8["灵活"];
				levelPoints["智力"] = levelPoints8["智力"];
				levelPoints["意志"] = levelPoints8["意志"];

			}
		}

     levelPoints9["体质"] = 1; 
     levelPoints9["意志"] = playwill;
     levelPoints9["灵活"] = basePoints["分配点"] - levelPoints9["力量"] - levelPoints9["敏捷"] - levelPoints9["体质"] - levelPoints9["智力"] - levelPoints9["意志"];
		if(levelPoints9["灵活"] > 0){
		var respoint2 = 1;
			if(respoint2 > respoint1){
				respoint1 = respoint2;
				levelPoints["力量"] = levelPoints9["力量"];
				levelPoints["体质"] = levelPoints9["体质"];
				levelPoints["敏捷"] = levelPoints9["敏捷"];
				levelPoints["灵活"] = levelPoints9["灵活"];
				levelPoints["智力"] = levelPoints9["智力"];
				levelPoints["意志"] = levelPoints9["意志"];

			}
		}

     levelPoints10["体质"] = 1; 
     levelPoints10["意志"] = playwill;
     levelPoints10["灵活"] = basePoints["分配点"] - levelPoints10["力量"] - levelPoints10["敏捷"] - levelPoints10["体质"] - levelPoints10["智力"] - levelPoints10["意志"];
		if(levelPoints10["灵活"] > 0){
		var respoint2 = (1 - getNPCPerByPoint("灵活", currentLevel, 1, levelPoints10["灵活"])) * getTimesProbability(3,1,getPerByPoint("灵活", currentLevel + 1, 0, levelPoints10["灵活"]));
			if(respoint2 > respoint1){
				respoint1 = respoint2;
				levelPoints["力量"] = levelPoints10["力量"];
				levelPoints["体质"] = levelPoints10["体质"];
				levelPoints["敏捷"] = levelPoints10["敏捷"];
				levelPoints["灵活"] = levelPoints10["灵活"];
				levelPoints["智力"] = levelPoints10["智力"];
				levelPoints["意志"] = levelPoints10["意志"];

			}
		}


}

	    	var point1 = levelPoints["灵活"];
		var point2 = 0;
		var point3 = 0;
		var pointNump1 = getNPCPerByPoint("灵活", currentLevel , 0, levelPoints["灵活"]);
		var pointNump2 = getNPCPerByPoint("灵活", currentLevel , 0, levelPoints["灵活"]);
		while (pointNump1 === pointNump2 && levelPoints["灵活"] > 0) {
			levelPoints["灵活"]--;
			pointNump2 = getNPCPerByPoint("灵活", currentLevel , 0, levelPoints["灵活"]);
		   
		}
		levelPoints["灵活"]++;
		point2 = point1 - levelPoints["灵活"];
		levelPoints["灵活"] = point1;
		var pointNump1 = getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]);
		var pointNump2 = getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]);
		while (pointNump1 === pointNump2 && levelPoints["灵活"] > 0) {
			levelPoints["灵活"]--;
			pointNump2 = getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]);
		   
		}
		levelPoints["灵活"]++;
		point3 = point1 - levelPoints["灵活"];
		levelPoints["灵活"] = point1 - Math.min(point2, point3);


		levelPoints["敏捷"] = Math.max(levelPoints["敏捷"] - 1, 1);


	if (levelPoints["意志"] >= getPointByProperty('意志', 1.01 - Math.floor(currentLife / Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[0]) * npcAttackCoefficient * fullCDCoefficient) * 100) / 100)) {
		levelPoints["意志"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["体质"];
	}

	    var pointNump1 = getPropertyByPoint("意志", levelPoints["意志"]);
	    var pointNump2 = getPropertyByPoint("意志", levelPoints["意志"]);
	    while (pointNump1 === pointNump2 && levelPoints["意志"] > 0) {
		levelPoints["意志"]--;
		pointNump2 = getPropertyByPoint("意志", levelPoints["意志"]);
	       
	    }
		levelPoints["意志"]++;
	if (levelPoints["意志"] < getPointByProperty('意志', 1.01 - Math.floor(currentLife / Math.ceil(Math.ceil(npcPowerStepNum * (currentLevel + 1) * npcPowerIntensiveCoefficient[0]) * npcAttackCoefficient * fullCDCoefficient) * 100) / 100)) {
		levelPoints["灵活"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["意志"] - levelPoints["智力"] - levelPoints["体质"];
	    var pointNump1 = getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]);
	    var pointNump2 = getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]);
	    while (pointNump1 === pointNump2 && levelPoints["灵活"] > 0) {
		levelPoints["灵活"]--;
		pointNump2 = getPerByPoint("灵活", currentLevel + 1, 0, levelPoints["灵活"]);
	       
	    }

		levelPoints["灵活"]++;
	}


	    levelPoints["体质"] = basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];

		levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["体质"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["意志"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"], 1);
		levelPoints["体质"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["灵活"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["意志"], 1);
		levelPoints["意志"] = Math.max(basePoints["分配点"] - levelPoints["力量"] - levelPoints["敏捷"] - levelPoints["体质"] - levelPoints["智力"] - levelPoints["灵活"], 1);
		levelPoints["力量"] = basePoints["分配点"] - levelPoints["体质"] - levelPoints["敏捷"] - levelPoints["灵活"] - levelPoints["智力"] - levelPoints["意志"];







    return levelPoints;
}


function getDiffMinIntPoint(propertyName, pointNum){
    var diffPoints = 0;
    var newPointNum = 0;
    var propertyNum = 0;
    if(pointNum <= 1) return diffPoints;
    switch (propertyName) {
        case "灵活":
            propertyNum = Math.max(Math.round((pointNum + basePoints["灵活"]) / ((pointNum + basePoints["灵活"]) + CHCardinal) * 100) / 100 - 0.005,0);
            break;
        case "智力":
            propertyNum = Math.max(Math.round((pointNum + basePoints["智力"]) / ((pointNum + basePoints["智力"]) + SKLCardinal) * 100) / 100 - 0.005,0);
            break;
        case "意志":
            propertyNum = Math.max(Math.round((pointNum + basePoints["意志"]) / ((pointNum + basePoints["意志"]) + DFCardinal) * 100) / 100 - 0.005,0);
            break;
        default:
            // 出错处理
            propertyNum = 0;
    }
    switch (propertyName) {
        case "灵活":
            newPointNum = Math.max(Math.ceil(CHCardinal * propertyNum / (1 - propertyNum)) - basePoints["灵活"], 1);
            break;
        case "智力":
            newPointNum = Math.max(Math.ceil(SKLCardinal * propertyNum / (1 - propertyNum)) - basePoints["智力"], 1);
            break;
        case "意志":
            newPointNum = Math.max(Math.ceil(DFCardinal * propertyNum / (1 - propertyNum)) - basePoints["意志"], 1);
            break;
        default:
            // 出错处理
            diffPoints = 0;
    }
    diffPoints = pointNum - newPointNum;
    return diffPoints;
}

var attackFlag = 4;

var getCustomPoints = function (data) {
    currentLevel = data.currentLevel;
    currentLife = data.currentLife;
    availablePoint = data.availablePoint;
    extraPointList = data.extraPointList;
    itemUsedNumList = data.itemUsedNumList;
    enemyList = data.enemyList;
    basePoints = {
        "分配点": availablePoint,
        "力量": extraPointList.get('力量'),
        "体质": extraPointList.get('体质'),
        "敏捷": extraPointList.get('敏捷'),
        "灵活": extraPointList.get('灵活'),
        "智力": extraPointList.get('智力'),
        "意志": extraPointList.get('意志')
    };
    console.log(data);
    CDNum = itemUsedNumList.get('傲娇LOLI娇蛮音CD');
    fullCDCoefficient = CDNum === 30 ? 0.9 : 1;
    fullRemiHP = itemUsedNumList.get('蕾米莉亚同人漫画') === 50 ? 700 : 0;
    fullIzayoiSpeed = itemUsedNumList.get('十六夜同人漫画') === 50 ? 100 : 0;

    if (currentLevel % 10 === 9) {
         // boss楼层加点
        levelPoints = getOptimalNextLevelPoints(currentLevel, currentLife, 1);
        if (levelPoints["体质"] < 1) {
            // 搜索最优方案失败，返回当前加点
            return false;
        }
        var diffPoints = 0;
        var diffPoints1 = 0;
        //diffPoints = levelPoints["敏捷"] > 1 ? diffPoints + 1 : diffPoints;
        //levelPoints["敏捷"] = levelPoints["敏捷"] > 1 ? levelPoints["敏捷"] - 1 : levelPoints["敏捷"];

        //diffPoints1 = getDiffMinIntPoint("灵活",levelPoints["灵活"]);
        //levelPoints["灵活"] -= diffPoints1;
        //diffPoints += diffPoints1;
        //diffPoints1 = getDiffMinIntPoint("智力",levelPoints["智力"]);
        //levelPoints["智力"] -= diffPoints1;
        //diffPoints += diffPoints1;
        diffPoints1 = getDiffMinIntPoint("意志",levelPoints["意志"]);
        levelPoints["意志"] -= diffPoints1;
        diffPoints += diffPoints1;
        levelPoints["体质"] += diffPoints;

        console.log(levelPoints);
        console.log((currentLevel + 1) + "层，预计剩余生命值：" + restLifeInNextLevelByPoints(currentLevel, currentLife, 1, levelPoints));
        return levelPoints;
    }
    else {
        // 普通npc楼层加点
        var levelPoints = getOptimalNextLevelPoints(currentLevel, currentLife, 0);
        if (levelPoints["体质"] < 1) {
            // 搜索最优方案失败，返回当前加点
            return false;
        }
        var diffPoints = 0;
        var diffPoints1 = 0;
        //diffPoints = levelPoints["敏捷"] > 1 ? diffPoints + 1 : diffPoints;
        //levelPoints["敏捷"] = levelPoints["敏捷"] > 1 ? levelPoints["敏捷"] - 1 : levelPoints["敏捷"];

        //diffPoints1 = getDiffMinIntPoint("灵活",levelPoints["灵活"]);
        //levelPoints["灵活"] -= diffPoints1;
        //diffPoints += diffPoints1;
        //diffPoints1 = getDiffMinIntPoint("智力",levelPoints["智力"]);
        //levelPoints["智力"] -= diffPoints1;
        //diffPoints += diffPoints1;
        diffPoints1 = getDiffMinIntPoint("意志",levelPoints["意志"]);
        levelPoints["意志"] -= diffPoints1;
        diffPoints += diffPoints1;
        levelPoints["体质"] += diffPoints;

        console.log(levelPoints);
        console.log((currentLevel + 1) + "层，" + attackFlag + "刀流，预计剩余生命值：" + restLifeInNextLevelByPoints(currentLevel, currentLife, 0, levelPoints));
        return levelPoints;
    }

};


if (location.pathname === '/kf_fw_ig_index.php') {
    $(function () {
        if (typeof Const === 'undefined' && typeof require === 'function') {
            var Const = require('./Const').default;
            Const.getCustomPoints = getCustomPoints;
        }
        else {
            var w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            w.Const.getCustomPoints = getCustomPoints;
        }
        $('[name="customPointsScriptEnabled"]').prop('disabled', false).triggerHandler('click');

    });
}