// ==UserScript==
// @name         Storm Shield One 简陋翻译
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  把SSO内的文本使用文本替换功能翻译
// @author       Yuzumi
// @match        *://stormshield.one*
// @namespace    https://greasyfork.org/scripts/36762-storm-shield-one-%E7%AE%80%E9%99%8B%E7%BF%BB%E8%AF%91
// @downloadURL https://update.greasyfork.org/scripts/36762/Storm%20Shield%20One%20%E7%AE%80%E9%99%8B%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/36762/Storm%20Shield%20One%20%E7%AE%80%E9%99%8B%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

//读取整个网页内容
var htmlstr=document.getElementsByTagName('body')[0].innerHTML;

//道具.羊驼
htmlstr=htmlstr.replace(/Mini Reward Llama/g,"迷你奖励羊驼");
htmlstr=htmlstr.replace(/Legendary Troll Stash Llama/g,"传奇捣蛋鬼珍藏羊驼");
htmlstr=htmlstr.replace(/Legendary Troll Loot Truck... Llama/g,"传奇捣蛋鬼战利品...豪华羊驼");
htmlstr=htmlstr.replace(/Upgrade Llama \(Seasonal Sale Freebie\!\)/g,"进阶羊驼(时季免费!)");
htmlstr=htmlstr.replace(/Ranged Weapon Llama/g,"远程武器羊驼");
htmlstr=htmlstr.replace(/Super Hero Llama/g,"超级英雄羊驼");
htmlstr=htmlstr.replace(/Super Melee Llama/g,"超级近战羊驼");
htmlstr=htmlstr.replace(/Super People Llama/g,"超级人物羊驼");
htmlstr=htmlstr.replace(/Super Ranged Llama/g,"超级远程武器羊驼");
htmlstr=htmlstr.replace(/Six Pack Llama/g,"6合1羊驼");
htmlstr=htmlstr.replace(/Triple Llama/g,"3合1羊驼");
htmlstr=htmlstr.replace(/Double Llama/g,"2合1羊驼");
htmlstr=htmlstr.replace(/Fiver Llama/g,"5合1羊驼");
htmlstr=htmlstr.replace(/All The Llamas/g,"10合1羊驼");
htmlstr=htmlstr.replace(/12x Upgrade Llama Bundle/g,"12连羊驼");
htmlstr=htmlstr.replace(/11x Upgrade Llama Bundle/g,"11连羊驼");
htmlstr=htmlstr.replace(/It's a Trap! Llama/g,"陷阱羊驼");
htmlstr=htmlstr.replace(/Melee Llama/g,"近战羊驼");
htmlstr=htmlstr.replace(/People Llama/g,"人物羊驼");
htmlstr=htmlstr.replace(/Weapon Llama/g,"武器羊驼");

//道具.物品
htmlstr=htmlstr.replace(/Pure Drop of Rain/g,"纯净雨滴");
htmlstr=htmlstr.replace(/Eye of the Storm/g,"风暴之眼");
htmlstr=htmlstr.replace(/Lightning in a Bottle/g,"瓶中闪电");
htmlstr=htmlstr.replace(/Storm Shard/g,"风暴碎片");
htmlstr=htmlstr.replace(/Hero XP/g,"英雄经验");
htmlstr=htmlstr.replace(/Schematic XP/g,"图纸经验");
htmlstr=htmlstr.replace(/Survivor XP/g,"幸存者经验");
htmlstr=htmlstr.replace(/ Rotating Gizmo/g,"幸存者经验");
htmlstr=htmlstr.replace(/ Rough Ore/g,"矿物原石");
htmlstr=htmlstr.replace(/ Nuts and Bolts/g,"螺丝和螺母");
htmlstr=htmlstr.replace(/ Planks/g,"木板");
htmlstr=htmlstr.replace(/ Shotgun /g,"霰弹枪");
htmlstr=htmlstr.replace(/ Pistol/g,"手枪");
htmlstr=htmlstr.replace(/ Assault Rifle /g,"突击步枪");
htmlstr=htmlstr.replace(/ Trap/g,"陷阱");
htmlstr=htmlstr.replace(/ Active Powercell/g,"启动能量电池");
htmlstr=htmlstr.replace(/ Sniper Rifle/g,"狙击步枪");
htmlstr=htmlstr.replace(/ Scythe/g,"镰刀");
htmlstr=htmlstr.replace(/ Sword/g,"剑");
htmlstr=htmlstr.replace(/ Spear/g,"矛");
htmlstr=htmlstr.replace(/ Hardware Melee Weapon/g,"五金近战武器");
htmlstr=htmlstr.replace(/ Bolt-Action Sniper/g,"栓动式狙击枪");
htmlstr=htmlstr.replace(/ Floor Wood Spikes/g,"木质地板尖刺");
htmlstr=htmlstr.replace(/ Standard Sniper/g,"标准狙击枪");
htmlstr=htmlstr.replace(/ Pump Action Shotgun/g,"泵动式霰弹枪");
htmlstr=htmlstr.replace(/ Ceiling Zapper/g,"电子驱虫天花板陷阱");
htmlstr=htmlstr.replace(/ Axe/g,"斧头");
htmlstr=htmlstr.replace(/ Automatic Sniper/g,"自动狙击枪");
htmlstr=htmlstr.replace(/ Semi-Auto Rifle/g,"半自动步枪");
htmlstr=htmlstr.replace(/ Bruiser/g,"近战专家");
htmlstr=htmlstr.replace(/ Club/g,"运动武器");
htmlstr=htmlstr.replace(/ Bolt Revolver Pistol/g,"螺栓左轮手枪");
htmlstr=htmlstr.replace(/ Healing Pad/g,"治疗平台");
htmlstr=htmlstr.replace(/ Light Sword/g,"小刀");
htmlstr=htmlstr.replace(/ Baseball Bat/g,"棒球棍");
htmlstr=htmlstr.replace(/vBucks/g,"V币");
htmlstr=htmlstr.replace(/Unknown Schematic/g,"未知图纸");
htmlstr=htmlstr.replace(/Unknown Defender/g,"未知守卫者");

//品质和类型
htmlstr=htmlstr.replace(/Transform Key:/g,"转换图:");
htmlstr=htmlstr.replace(/Schematic:/g,"图纸:");
htmlstr=htmlstr.replace(/Ingredient:/g,"素材:");
htmlstr=htmlstr.replace(/\(Common\)/g,"(普通)");
htmlstr=htmlstr.replace(/\(Uncommon\)/g,"(罕见)");
htmlstr=htmlstr.replace(/\(Rare\)/g,"(稀有)");
htmlstr=htmlstr.replace(/\(Epic\)/g,"(史诗)");
htmlstr=htmlstr.replace(/\(Legendary\)/g,"(传说)");
htmlstr=htmlstr.replace(/\(Mythic\)/g,"(神话)");

//分组栏文本
htmlstr=htmlstr.replace(/Save the World Home/g,"拯救世界家园");
htmlstr=htmlstr.replace(/Save the World/g,"拯救世界");
htmlstr=htmlstr.replace(/Battle Royale/g,"大逃杀");
htmlstr=htmlstr.replace(/Event Store/g,"活动商店");
htmlstr=htmlstr.replace("Alert Rewards","警戒奖励");
htmlstr=htmlstr.replace(/Storms/g,"突变风暴");
htmlstr=htmlstr.replace("Llama History","羊驼历史");

//地图
htmlstr=htmlstr.replace(/Ride the Lightning/g,"驾驭闪电");
htmlstr=htmlstr.replace(/Evacuate the Survivors/g,"营救幸存者");
htmlstr=htmlstr.replace(/Rescue the Survivors/g,"营救幸存者");
htmlstr=htmlstr.replace(/Retrieve the Data/g,"回收数据");
htmlstr=htmlstr.replace(/Destroy the Encampments/g,"摧毁营地");
htmlstr=htmlstr.replace(/Build the Radar Grid/g,"搭建雷达网络");
htmlstr=htmlstr.replace(/Deploy the Bomb/g,"运输炸弹");
htmlstr=htmlstr.replace(/Repair the Shelter/g,"修复庇护所");
htmlstr=htmlstr.replace(/Evacuate the Shelter/g,"疏散庇护所");
htmlstr=htmlstr.replace(/Fight the Storm/g,"抗击风暴");
htmlstr=htmlstr.replace(/Category 2 Storm/g,"抗击双风暴");
htmlstr=htmlstr.replace(/Category 3 Storm/g,"抗击三风暴");
htmlstr=htmlstr.replace(/Category 4 Storm/g,"抗击四风暴");

//首页
htmlstr=htmlstr.replace(/Daily Llama/g,"每日羊驼");
htmlstr=htmlstr.replace(/Expires in/g,"距离过期还剩:");
htmlstr=htmlstr.replace(/see more/g,"查看更多");
htmlstr=htmlstr.replace("Mission Timers","任务计时");
htmlstr=htmlstr.replace("Mission alerts expire in","距离警戒任务刷新还有");
htmlstr=htmlstr.replace("Mission Alerts Reward Tally","警戒任务奖励统计");
htmlstr=htmlstr.replace("Mission Alerts","警戒任务");

//PVE玩家资讯内文本
htmlstr=htmlstr.replace("Fortitude","刚毅");
htmlstr=htmlstr.replace("Offense","攻击");
htmlstr=htmlstr.replace("Resistance","抗性");
htmlstr=htmlstr.replace("Tech","科技");
htmlstr=htmlstr.replace("Stats","统计");
htmlstr=htmlstr.replace("Heroes","英雄");
htmlstr=htmlstr.replace("Commander Level","指令官等级");
htmlstr=htmlstr.replace("Collection Level","收藏册等级");
htmlstr=htmlstr.replace("Zones Completed","完成区域次数");
htmlstr=htmlstr.replace("Stored research","已存储的研究点");
htmlstr=htmlstr.replace("Est. Uncollected research","未收取的研究点");
htmlstr=htmlstr.replace("Until research capped","到研究点上限所需时间");
htmlstr=htmlstr.replace("Miniboss cooldowns","迷你Boss奖励剩余次数");
htmlstr=htmlstr.replace("Survival 3-day cooldowns","3天生存奖励剩余次数");
htmlstr=htmlstr.replace("Survival 7-day cooldowns","7天生存奖励剩余次数");
htmlstr=htmlstr.replace("Storm cooldowns","风暴奖励剩余次数");
htmlstr=htmlstr.replace("Alert cooldowns","警戒奖励剩余次数");
htmlstr=htmlstr.replace("Days logged in","已登陆天数");
htmlstr=htmlstr.replace("Zones explored","区域完整探索次数");
htmlstr=htmlstr.replace("Survivors saved","已拯救的幸存者数量");
htmlstr=htmlstr.replace("Play with others","与其他玩家共玩次数");
htmlstr=htmlstr.replace("Structures built","建筑物搭建个数");
htmlstr=htmlstr.replace("Mist monsters killed","精英怪击杀个数");
htmlstr=htmlstr.replace(/Next available/g,"下次奖励次数所需时间");
htmlstr=htmlstr.replace("FORT Stats from Survivor Squads","幸存者小队给予的堡垒属性");
htmlstr=htmlstr.replace("Fortitude: EMT Squad","刚毅加强:EMT小队");
htmlstr=htmlstr.replace("Fortitude: Training Team","刚毅加强:特训小队");
htmlstr=htmlstr.replace("Offense: Fire Team Alpha","攻击加强:阿尔法火力团");
htmlstr=htmlstr.replace("Offense: Close Assault Squad","攻击加强:近战突击小队");
htmlstr=htmlstr.replace("Resistance: Gadgeteers","抗性加强:机件小队");
htmlstr=htmlstr.replace("Resistance: Scouting Party","抗性加强:侦查小队");
htmlstr=htmlstr.replace("Tech: Engineering Corps","科技加强:工程小队");
htmlstr=htmlstr.replace("Tech: Think Tank","科技加强:智库小队");
htmlstr=htmlstr.replace(/Capped \(/g,"已满 (");

//拯救世界主体
htmlstr=htmlstr.replace(/Stonewood/g,"荒木石林");
htmlstr=htmlstr.replace(/Plankerton/g,"普兰克顿");
htmlstr=htmlstr.replace(/Canny Valley/g,"坎尼山谷");
htmlstr=htmlstr.replace(/Twine Peaks/g,"双峰山");
htmlstr=htmlstr.replace(/Expire in/g,"有效期还剩");
htmlstr=htmlstr.replace(/New missions in/g,"距离任务刷新还有");
htmlstr=htmlstr.replace("Player Lookup","查看玩家");
htmlstr=htmlstr.replace(/storm mutations active/g,"个突变风暴活动中");
htmlstr=htmlstr.replace(/ minutes/g," 分钟");

//提示文本
htmlstr=htmlstr.replace(/Account queued up for update./g,"此账户的信息已加入更新队列中");
htmlstr=htmlstr.replace(/Lookup another player/g,"输入玩家名称查看玩家信息");
htmlstr=htmlstr.replace(/Lookup player by Fortnite username/g,"输入玩家在堡垒之夜里的角色名");
htmlstr=htmlstr.replace("Lookup","查询");
htmlstr=htmlstr.replace(/Unknown or incorrect hero?/g,"遇到未知或错误的英雄?");
htmlstr=htmlstr.replace(/Send us the correct information./g,"请告诉我们正确的信息");
htmlstr=htmlstr.replace(/Reward/g,"奖励");

//风暴页面
htmlstr=htmlstr.replace(/Suburbs/g,"郊区");
htmlstr=htmlstr.replace(/Forest/g,"森林");
htmlstr=htmlstr.replace(/Grasslands/g,"草原");
htmlstr=htmlstr.replace(/City/g,"城市");
htmlstr=htmlstr.replace(/Industrial Park/g,"工业区");
htmlstr=htmlstr.replace(/Mission changes in/g,"距离任务变更还有");
htmlstr=htmlstr.replace(/Alert expires in/g,"距离警戒失效还有");

//羊驼页面
htmlstr=htmlstr.replace("Current Llama","当前贩卖的羊驼");
htmlstr=htmlstr.replace("Expired Llamas","已过期的羊驼");
//htmlstr=htmlstr.replace(/Expired less than/g,"过期不到");
htmlstr=htmlstr.replace(/Expired on/g,"过期于:");
//htmlstr=htmlstr.replace(/Expired/g,"已过期");

//大逃杀首页
htmlstr=htmlstr.replace(/<h2>Disabled Game Modes<\/h2>/g,"<h2>禁用的游戏模式</h2>");
htmlstr=htmlstr.replace(/<a class="" href="\/pvp\/solo">solo<\/a>/g,"<a class=\"\" href=\"/pvp/solo\">单排</a>");
htmlstr=htmlstr.replace(/<a class="" href="\/pvp\/duos">duos<\/a>/g,"<a class=\"\" href=\"/pvp/duos\">双排</a>");
htmlstr=htmlstr.replace(/<a class="" href="\/pvp\/squads">squads<\/a>/g,"<a class=\"\" href=\"/pvp/squads\">小队</a>");
htmlstr=htmlstr.replace(/<h2>Leaderboards (solo)/g,"<h2>排行榜 (单排)");
htmlstr=htmlstr.replace(/<th>Name<\/th>/g,"<th>名称</th>");
htmlstr=htmlstr.replace(/<th>W<\/th>/g,"<th>胜</th>");
htmlstr=htmlstr.replace(/<th>K<\/th>/g,"<th>击杀</th>");
htmlstr=htmlstr.replace(/<th>W%<\/th>/g,"<th>胜率%</th>");
htmlstr=htmlstr.replace(/<h2>Weekly Sales<\/h2>/g,"<h2>每周销售</h2>");
htmlstr=htmlstr.replace(/<h2>Daily Sales<\/h2>/g,"<h2>每日销售</h2>");
htmlstr=htmlstr.replace(/<a class="dropdown-item" href="\/pvp">Leaderboards<\/a>/g,"<a class=\"dropdown-item\" href=\"/pvp\">排行榜</a>");
//htmlstr=htmlstr.replace(/Solo/g,"单排");
//htmlstr=htmlstr.replace("Duos","双排");
//htmlstr=htmlstr.replace("Squads","小队");
//htmlstr=htmlstr.replace("Game Type","游戏类型");
//htmlstr=htmlstr.replace("Platform","平台");
//htmlstr=htmlstr.replace("Metric","排行榜类型");
//htmlstr=htmlstr.replace("Player","玩家名");
//htmlstr=htmlstr.replace("Categories","类别");
//htmlstr=htmlstr.replace(/Score/g,"分数");
//htmlstr=htmlstr.replace(/Top 10\/5\/3/g,"前10/5/3名");
//htmlstr=htmlstr.replace(/Top 25\/12\/6/g,"前25/12/6名");
//htmlstr=htmlstr.replace(/Wins/g,"胜利数");
//htmlstr=htmlstr.replace(/Kills\/min/g,"每分钟击杀数");
//htmlstr=htmlstr.replace(/Kills\/match/g,"每盘击杀数");
//htmlstr=htmlstr.replace(/Kills/g,"击杀数");
//htmlstr=htmlstr.replace("Win%","胜率");
//htmlstr=htmlstr.replace(/K\/D Ratio/g,"杀敌阵亡比");
//htmlstr=htmlstr.replace("K/D","杀敌阵亡比");
//htmlstr=htmlstr.replace(/Win Percentage/g,"胜率");
//htmlstr=htmlstr.replace(/Time Played/g,"游戏时间");
//htmlstr=htmlstr.replace(/Matches Played/g,"游戏次数");
//htmlstr=htmlstr.replace("Played","游戏次数");

//其他
htmlstr=htmlstr.replace("<a href=\"/pve/sales\">event store</a>","<a href=\"/pve/sales\">活动商店</a>");
htmlstr=htmlstr.replace("<a href=\"/llamas\">llamas</a>","<a href=\"/llamas\">羊驼</a>");
htmlstr=htmlstr.replace(/Hero/g,"英雄");
htmlstr=htmlstr.replace(/Survivor/g,"幸存者");
htmlstr=htmlstr.replace(/Lead Survivor/g,"领袖幸存者");
htmlstr=htmlstr.replace(/Defender/g,"守卫者");


//把翻译结果替换整个网页内容
document.getElementsByTagName('body')[0].innerHTML=htmlstr;