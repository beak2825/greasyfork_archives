// ==UserScript==
// @name        OverBuff_zhTW
// @namespace   OverBuffCht
// @description 中文化OverBuff
// @version     2.5
// @include     http*://www.overbuff.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23592/OverBuff_zhTW.user.js
// @updateURL https://update.greasyfork.org/scripts/23592/OverBuff_zhTW.meta.js
// ==/UserScript==

function ChgValue(chgObj, keyValue, replaceValue,  Type){
    switch(Type){
        case 1:
            if (chgObj.html() == keyValue) chgObj.html(replaceValue);
            break;
        case 2:
            if (chgObj.html().indexOf(keyValue) >= 0) chgObj.html(chgObj.html().replace(keyValue, replaceValue));
            break;
        case 3:  //中二兄弟共用技能描述
            if (chgObj.html() == keyValue) {
                chgObj.html(chgObj.parents().eq(3).attr('class').indexOf('genji') > 0 ? "龍一文字平均擊殺" : "龍魂擊平均擊殺");
            }
            break;
    }
};
$('div.label').each(function () {
    ChgValue($(this), "Eliminations", "平均擊殺", 1);
    ChgValue($(this), 'Obj Kills', '平均攻防擊殺', 1);
    ChgValue($(this), 'Obj Time', '平均攻防時間', 1);
    ChgValue($(this), 'Weapon Acc', '平均命中率', 1);
    ChgValue($(this), 'Damage', '平均傷害', 1);
    ChgValue($(this), 'Healing', '平均治療', 1);
    ChgValue($(this), 'Critical Hits', '平均爆頭', 1);
    ChgValue($(this), 'Env Kills', '平均環境擊殺', 1);
    ChgValue($(this), 'Deaths', '平均死亡', 1);
    ChgValue($(this), 'Off Assists', '平均助攻', 1);
    ChgValue($(this), 'Def Assists', '平均協防', 1);
    ChgValue($(this), 'E:D Ratio', '死亡擊殺比', 1);
    ChgValue($(this), 'Voting Cards', '平均得票', 1);
    ChgValue($(this), 'Medals', '平均得牌', 1);
    ChgValue($(this), 'Gold Medals', '平均金牌', 1);
    ChgValue($(this), 'Silver Medals', '平均銀牌', 1);
    ChgValue($(this), 'Bronze Medals', '平均銅牌', 1);
    ChgValue($(this), 'On Fire', '手感發熱', 1);
    ChgValue($(this), 'Time Played', '英雄遊戲時間', 1);
    ChgValue($(this), 'Record', '勝負場次', 1);
    ChgValue($(this), 'Hero Rank', '競技對戰排名', 1);
    ChgValue($(this), 'Quick Rank', '快速對戰排名', 1);
    ChgValue($(this), 'Wins', '勝場', 1);
    ChgValue($(this), 'Win Rate', '勝率', 1);
    ChgValue($(this), 'Skill Rating', '競技天梯分數', 1);
    ChgValue($(this), 'Hero Score', '競技對戰分數', 2);
    ChgValue($(this), 'Quick Score', '快速對戰分數', 2);
    ChgValue($(this), 'Dmg Amped', '傷害強化', 1);

    //肉盾共用
    ChgValue($(this), 'Dmg Blocked', '平均傷害吸收', 1);

    //兄弟G8共用技能描述
    ChgValue($(this), 'Dragon Kills', '裡面才判斷，隨便key', 3);

    //路西歐
    ChgValue($(this), 'Sound Barriers', '平均音波屏障施放', 1);

    //禪亞塔
    ChgValue($(this), 'Final Blows', '平均尾刀', 1);
    ChgValue($(this), 'Trans Healing', '平均超凡入聖治療', 1);

    //辛梅塔
    ChgValue($(this), 'Portal Uptime', '平均傳送器運作時間', 1);
    ChgValue($(this), 'Portal Trips', '平均傳送', 1);
    ChgValue($(this), 'Shields Given', '平均護盾施放', 1);
    ChgValue($(this), 'Photon Kills', '平均光子槍擊殺', 1);
    ChgValue($(this), 'Sentry Kills', '平均哨戒塔擊殺', 1);
    ChgValue($(this), 'Solo Kills', '平均單人擊殺', 1);

    //慈悲
    ChgValue($(this), 'Resurrects', '平均復活人數', 1);

    //安娜
    ChgValue($(this), 'Scoped Acc', '平均狙擊命中率', 1);
    ChgValue($(this), 'Enemies Slept', '平均睡眠', 1);
    ChgValue($(this), 'Boost Assists', '平均奈米強化施放率', 1);

    //莫伊拉
    ChgValue($(this), 'Beam Healing', '聚合光束平均治療量', 1);
    ChgValue($(this), 'Beam Kills', '聚合光束平均擊殺', 1);

    //碧姬
    ChgValue($(this), 'Armor Given', '修復包平均治療量', 1);

    //D.VA
    ChgValue($(this), 'Mech Recalls', '空降機甲率', 1);
    ChgValue($(this), 'Destruct Kills', '平均空投擊殺', 1);

    //札莉亞
    ChgValue($(this), 'Avg Energy', '平均蓄能比', 1);
    ChgValue($(this), 'Power Kills', '平均能量擊殺', 1);
    ChgValue($(this), 'Graviton Kills', '平均引力擊殺', 1);
    ChgValue($(this), 'Proj Barriers', '平均護盾施放', 1);

    //攔路豬
    ChgValue($(this), 'Self Healing', '平均自我治療量', 1);
    ChgValue($(this), 'Heroes Hooked', '平均鉤中', 1);
    ChgValue($(this), 'Hook Acc', '鐵鉤平均命中率', 1);
    ChgValue($(this), 'Hog Kills', '火力全開平均擊殺數', 1);

    //萊茵哈特
    ChgValue($(this), 'Charge Kills', '衝鋒平均擊殺', 1);
    ChgValue($(this), 'Shatter Kills', '地裂擊平均擊殺', 1);
    ChgValue($(this), 'Fire Kills', '烈焰擊平均擊殺', 1);

    //溫斯頓
    ChgValue($(this), 'Melee Kills', '特斯拉砲平均擊殺', 1);
    ChgValue($(this), 'Jump Kills', '噴射跳躍平均擊殺', 1);
    ChgValue($(this), 'Rage Kills', '野性之怒平均擊殺', 1);

    //小美
    ChgValue($(this), 'Enemies Frozen', '平均凍結人數', 1);
    ChgValue($(this), 'Blizzard Kills', '暴風雪平均擊殺', 1);

    //炸彈鼠
    ChgValue($(this), 'Enemy Traps', '平均陷阱發動', 1);
    ChgValue($(this), 'Tire Kills', '地獄飛輪平均擊殺', 1);

    //奪命女
    ChgValue($(this), 'Venom Kills', '毒氣平均擊殺', 1);

    //半藏
    ChgValue($(this), 'Scatter Kills', '裂破箭平均擊殺', 1);

    //壁壘
    ChgValue($(this), 'Tank Kills', '坦克模式平均擊殺', 1);

    //托比昂
    ChgValue($(this), 'Armor Packs', '平均裝甲包提供量', 1);
    ChgValue($(this), 'Weapon Kills', '平均武器擊殺', 1);
    ChgValue($(this), 'Turret Kills', '平均砲塔擊殺', 1);
    ChgValue($(this), 'Molten Kills', '爐心超載平均擊殺', 1);

    //法拉
    ChgValue($(this), 'Direct Hits', '平均直接命中率', 1);
    ChgValue($(this), 'Barrage Kills', '火箭彈幕平均擊殺', 1);

    //源氏
    ChgValue($(this), 'Dmg Reflected', '平均反彈傷害', 1);

    //死神
    ChgValue($(this), 'Souls Gained', '平均靈魂回收', 1);
    ChgValue($(this), 'Blossom Kills', '死亡綻放平均擊殺', 1);

    //閃光
    ChgValue($(this), 'Bombs Stuck', '平均脈衝炸彈黏中', 1);
    ChgValue($(this), 'Bomb Kills', '脈衝炸彈平均擊殺', 1);

    //76
    ChgValue($(this), 'Biotic Fields', '生化力場平均施放', 1);
    ChgValue($(this), 'Helix Kills', '旋風火箭平均擊殺', 1);
    ChgValue($(this), 'Visor Kills', '戰術鎖定平均擊殺', 1);

    //麥卡利
    ChgValue($(this), 'FTH Kills', '六連發平均擊殺', 1);
    ChgValue($(this), 'Deadeye Kills', '彈無虛發平均擊殺', 1);

    //毀滅拳王
    ChgValue($(this), 'Meteor Kills', '流星墜每場擊殺', 1);
    ChgValue($(this), 'Ability Damage', '每場技能傷害量', 1);
    ChgValue($(this), 'Defense Shield', '最佳防禦取得護甲值', 1);

    //駭影
    ChgValue($(this), 'Portals Killed', '每場相位轉換前擊殺', 1);
    ChgValue($(this), 'Enemies Hacked', '每場駭入數', 1);
    ChgValue($(this), 'Enemies Pulsed', '每場電磁脈衝波影響', 1);

});

$('dt').each(function(){
    ChgValue($(this), 'Skill Rank', '競技技術水平', 1);
    ChgValue($(this), 'Skill Rating', '競技天梯分數', 1);
    ChgValue($(this), 'On Fire', '手感發熱', 1);
    ChgValue($(this), 'Wins', '勝場', 1);
    ChgValue($(this), 'Record', '勝負紀錄', 1);
    ChgValue($(this), 'Win Rate','勝率', 1);
});

$('div.filter-option').each(function(){
    ChgValue($(this), 'Quick Play', '快速對戰', 2);
    ChgValue($(this), "Competitive", "競技對戰", 2);
    ChgValue($(this), "All", "全部", 2);
    ChgValue($(this), " Offense", " 攻擊", 2);
    ChgValue($(this), " Defense", " 防禦", 2);
    ChgValue($(this), " Tank", " 肉盾", 2);
    ChgValue($(this), " Support", " 輔助", 2);
    ChgValue($(this), "Skill Rating", "競技天梯分數", 2);
    ChgValue($(this), "On Fire", "手感發燙", 2);
    //選單共用
    ChgValue($(this), "Wins", "勝場", 2);
    ChgValue($(this), "Eliminations", "擊殺", 2);
    ChgValue($(this), "Obj Kills", "攻防擊殺", 2);
    ChgValue($(this), "Obj Time", "攻防時間", 2);
    ChgValue($(this), "Damage", "傷害量", 2);
    ChgValue($(this), "Healing", "治療量", 2);
    ChgValue($(this), "Deaths", "死亡數", 2);
    ChgValue($(this), "Weapon Acc", "命中率", 2);
    ChgValue($(this), "Final Blows", "尾刀數", 2);
    ChgValue($(this), "Solo Kills", "單人擊殺", 2);
    ChgValue($(this), "Env Kills", "環境擊殺", 2);
    ChgValue($(this), "Overview", "總覽", 2);
    ChgValue($(this), "Combat", "對戰分析", 2);
    ChgValue($(this), "Medals", "獎牌分析", 2);
});

$('header').each(function(){
    ChgValue($(this), "Trends", "近況走勢", 2);
    ChgValue($(this), "Roles", "勝場類型", 2);
    ChgValue($(this), "Competitive", "競技對戰", 2);
    ChgValue($(this), "Recent Activity", "最近對戰", 2);
    ChgValue($(this), "Medals", "面獎牌", 2);
    ChgValue($(this), "Most Played Heroes", "最常使用的英雄", 2);
    ChgValue($(this), "Lifetime Stats", "累計統計資料", 2);
});

$('div.grouping.header').find('div.stat.double').each(function(){
    ChgValue($(this), "Competitive", "競技對戰", 2);
    ChgValue($(this), "Quick Play", "快速對戰", 2);
});

$('tbody.stripe-rows').find('a.color-white').each(function(){
    ChgValue($(this), "Offense", "攻擊", 1);
    ChgValue($(this), "Support", "輔助", 1);
    ChgValue($(this), "Tank", "肉盾", 1);
    ChgValue($(this), "Defense", "防禦", 1);
});

$('table.table-data.table-data-vertical').find('th').each(function(){
    ChgValue($(this), "Game Time", "遊戲時數", 1)
    ChgValue($(this), "Medals and Cards", "獎牌＆投票", 1)
    ChgValue($(this), "Eliminations", "死亡數據", 1)
    ChgValue($(this), "Combat Statistics", "戰鬥總計", 1)
});

$('tbody.stripe-rows').find('td').each(function(){
    ChgValue($(this), "Games Won", "總勝場", 1)
    ChgValue($(this), "Games Played", "完賽場次", 1)
    ChgValue($(this), "Avg Game Time", "平均完賽時間", 1)
    ChgValue($(this), "Time Spent Playing", "遊戲時間", 1)
    ChgValue($(this), "Time Spent Alive", "存活時間", 1)
    ChgValue($(this), "Time Spent Dead", "死亡時間", 1)
    ChgValue($(this), "Total Medals", "總獎牌數", 1)
    ChgValue($(this), "Gold Medals", "金牌", 1)
    ChgValue($(this), "Silver Medals", "銀牌", 1)
    ChgValue($(this), "Bronze Medals", "銅牌", 1)
    ChgValue($(this), "Voting Cards", "得票數", 1)
    ChgValue($(this), "Eliminations", "擊殺", 1)
    ChgValue($(this), "Final Blows", "尾刀", 1)
    ChgValue($(this), "Solo Kills", "單人擊殺", 1)
    ChgValue($(this), "Deaths", "死亡次數", 1)
    ChgValue($(this), "E:D Ratio", "死亡擊殺比", 1)
    ChgValue($(this), "Damage Done", "總傷害", 1)
    ChgValue($(this), "Healing Done", "總治療", 1)
});