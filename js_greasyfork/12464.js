// ==UserScript==
// @name        Match Analyzer Report CN
// @namespace   trophymanager.cn
// @description 比赛分析汉化
// @include     *leohien.net*
// @include     *mmasjafxrevv0.nfshost.com/mma/report*
// @exclude     trophymanager.com
// @version     3.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12464/Match%20Analyzer%20Report%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/12464/Match%20Analyzer%20Report%20CN.meta.js
// ==/UserScript==

var htmlstr=document.getElementsByTagName('html')[0].innerHTML;


//全局
htmlstr=htmlstr.replace(" National Team ","国家队");
htmlstr=htmlstr.replace(" (all)","(全部上场球员)");
htmlstr=htmlstr.replace("Match statistics","比赛统计");
htmlstr=htmlstr.replace("chances analyzed","次进攻机会已经分析完毕");
htmlstr=htmlstr.replace("minutes","分钟");

htmlstr=htmlstr.replace("Lineup and tactics","阵容和战术");
htmlstr=htmlstr.replace("Set pieces","定位球统计");
htmlstr=htmlstr.replace("Overall assisting and defending","全场攻防统计");
htmlstr=htmlstr.replace("Overall assisting","全场进攻统计");
htmlstr=htmlstr.replace("Overall defending (against attack style)","全场防守统计");
htmlstr=htmlstr.replace("Overall finishing","全场射门统计");
htmlstr=htmlstr.replace("Player statistics","球员统计");
htmlstr=htmlstr.replace(/chances/g,"次机会");
htmlstr=htmlstr.replace(/Player name/g,"球员姓名");
htmlstr=htmlstr.replace(/Position/g,"位置");
htmlstr=htmlstr.replace(/Assists/g,"组织");
htmlstr=htmlstr.replace(/Defends/g,"防守");
htmlstr=htmlstr.replace(/Overall/g,"总计");
htmlstr=htmlstr.replace(/Defended/g,"防守成功");
htmlstr=htmlstr.replace(/Missed/g,"射门失败");
htmlstr=htmlstr.replace(/GOAL/g,"进球");
htmlstr=htmlstr.replace(/Saved/g,"扑救成功");
htmlstr=htmlstr.replace(/Defender /g,"防守球员");

htmlstr=htmlstr.replace(/Regulars/g,"禁区内射门");
htmlstr=htmlstr.replace(/Regular/g,"禁区内射门");
htmlstr=htmlstr.replace(/Long Shots/g,"远射");
htmlstr=htmlstr.replace(/Long Shot/g,"远射");
htmlstr=htmlstr.replace(/Shots/g,"射门");
htmlstr=htmlstr.replace(/Headers/g,"头球");
htmlstr=htmlstr.replace(/Header/g,"头球");

htmlstr=htmlstr.replace(/On goal/g,"射正");
htmlstr=htmlstr.replace(/Goals/g,"进球");


htmlstr=htmlstr.replace("Field view","阵容概览");
htmlstr=htmlstr.replace("Tactics info","阵容信息");
htmlstr=htmlstr.replace("Defending bonus","后防奖惩");
htmlstr=htmlstr.replace("Midfield bonus","中场奖惩");
htmlstr=htmlstr.replace("Attacking bonus","进攻奖惩");
htmlstr=htmlstr.replace("Reserves","替补席");
htmlstr=htmlstr.replace("Captain","队长");
htmlstr=htmlstr.replace(/Name/g,"姓名");
htmlstr=htmlstr.replace(/Average /g,"平均");
htmlstr=htmlstr.replace(/Age/g,"年龄");

htmlstr=htmlstr.replace(/Routine/g,"经验");

htmlstr=htmlstr.replace(/(first 11)/g,"首发11人");
htmlstr=htmlstr.replace(/routine/g,"经验");
htmlstr=htmlstr.replace(/REC/g,"评星");
htmlstr=htmlstr.replace(/Rating/g,"比赛评分");
htmlstr=htmlstr.replace(/rating/g,"比赛评分");
htmlstr=htmlstr.replace(/TOTAL OK/g,"总计");
htmlstr=htmlstr.replace(/Total/g,"总计");


htmlstr=htmlstr.replace(/Home Team/g,"主队");
htmlstr=htmlstr.replace(/Away Team/g,"客队");
htmlstr=htmlstr.replace("Mentality","比赛心态");

htmlstr=htmlstr.replace("Attacking style","进攻方式");
//var htmlstr=documen.getElementsByTagName("table")[5].getElementsByTagName("td")[2];
htmlstr=htmlstr.replace(/National Team Friendly/g,"国家队友谊赛");
htmlstr=htmlstr.replace(/Friendly League/g,"友谊联赛");
htmlstr=htmlstr.replace(/Friendly/g,"快速比赛");

htmlstr=htmlstr.replace(/League/g,"联赛");
htmlstr=htmlstr.replace(/cl1/g,"洲冠军联赛");
htmlstr=htmlstr.replace(/ue1/g,"洲联盟杯");
//战术名词


htmlstr=htmlstr.replace(/Penalties/g,"点球");
htmlstr=htmlstr.replace(/Corners/g,"角球");
htmlstr=htmlstr.replace(/Freekicks/g,"任意球");
htmlstr=htmlstr.replace(/Corner/g,"角球");
htmlstr=htmlstr.replace(/Freekick/g,"任意球");
htmlstr=htmlstr.replace(/Penalty/g,"点球");

//打法名词
htmlstr=htmlstr.replace(/GK Counters/g,"门将手抛球反击");
htmlstr=htmlstr.replace(/GK Kicks/g,"门将长传反击");
htmlstr=htmlstr.replace(/Balanced/g,"平衡");
htmlstr=htmlstr.replace(/Shortpassing/g,"短传渗透");
htmlstr=htmlstr.replace(/Short Passes/g,"短传渗透");
htmlstr=htmlstr.replace(/Short Pass/g,"短传渗透");

htmlstr=htmlstr.replace(/Wing Attacks/g,"边路突破");
htmlstr=htmlstr.replace(/Wing Attack/g,"边路突破");

htmlstr=htmlstr.replace(/Wings/g,"边路突破");

htmlstr=htmlstr.replace(/Direct/g,"直接");
htmlstr=htmlstr.replace(/Counters/g,"反击");
htmlstr=htmlstr.replace(/Counter/g,"反击");


htmlstr=htmlstr.replace(/Through Balls/g,"直传身后");
htmlstr=htmlstr.replace(/Through Ball/g,"直传身后");

htmlstr=htmlstr.replace(/Long Balls/g,"长传冲吊");
htmlstr=htmlstr.replace(/Long Ball/g,"长传冲吊");

//天气
htmlstr=htmlstr.replace(/Sunny/g,"晴天");
htmlstr=htmlstr.replace(/Cloudy/g,"多云");
htmlstr=htmlstr.replace(/Rainy/g,"下雨");
htmlstr=htmlstr.replace(/Snowy/g,"下雪");

//球场状态 
htmlstr=htmlstr.replace(/Outstanding/g,"完美(7/7)");
htmlstr=htmlstr.replace(/Superb/g,"卓越(6/7)");
htmlstr=htmlstr.replace(/Excellent/g,"极好(5/7)");
htmlstr=htmlstr.replace(/Good/g,"良好(4/7)");


htmlstr=htmlstr.replace(/Decent/g,"一般(3/7)");
htmlstr=htmlstr.replace(/Poor/g,"勉强(2/7)");
htmlstr=htmlstr.replace(/Despicable/g,"糟透了(0)");


//心态
htmlstr=htmlstr.replace(/Normal/g,"正常");

htmlstr=htmlstr.replace(/Slightly Attacking/g,"略偏进攻");
htmlstr=htmlstr.replace(/Very Attacking/g,"重视进攻");
htmlstr=htmlstr.replace(/Attacking/g,"进攻");

htmlstr=htmlstr.replace(/Slightly Defensive/g,"略偏防守");
htmlstr=htmlstr.replace(/Very Defensive/g,"重视防守");
htmlstr=htmlstr.replace(/Defensive/g,"防守");

//leohien

htmlstr=htmlstr.replace(/MAIN STATS/g,"球队统计");
htmlstr=htmlstr.replace(/Style/g,"进攻方式");
htmlstr=htmlstr.replace(/Focus Side/g,"进攻重心");
htmlstr=htmlstr.replace(/Possession/g,"控球率");
htmlstr=htmlstr.replace(/Chance/g,"进攻机会");
//htmlstr=htmlstr.replace(/Big 进攻机会/g,"大好机会");
htmlstr=htmlstr.replace(/On Goal/g,"射正");
htmlstr=htmlstr.replace(/防守球员Win/g,"防守成功次数");
htmlstr=htmlstr.replace(/MoM/g,"MoM");
htmlstr=htmlstr.replace(/Save/g,"扑救");
htmlstr=htmlstr.replace(/DefWin/g,"防守成功");
htmlstr=htmlstr.replace(/ErrDef/g,"防守失误");
htmlstr=htmlstr.replace(/ErrGoa/g,"导致丢球");
htmlstr=htmlstr.replace(/Assist/g,"助攻");
htmlstr=htmlstr.replace(/Shot/g,"射门");
htmlstr=htmlstr.replace(/OnTagt/g,"射正");
htmlstr=htmlstr.replace(/Goal/g,"进球");
htmlstr=htmlstr.replace(/Summary/g,"比赛摘要");
htmlstr=htmlstr.replace(/TEAM PLAYER STATICTIS/g,"球员统计");
htmlstr=htmlstr.replace(/MoM/g,"MVP");
htmlstr=htmlstr.replace(/Opp Def Win/g,"防守成功");
htmlstr=htmlstr.replace(/反击 Attack/g,"直接反击");
htmlstr=htmlstr.replace(/GK Throw/g,"门将手抛");
htmlstr=htmlstr.replace(/xxx/g,"xxx");
htmlstr=htmlstr.replace(/xxx/g,"xxx");
htmlstr=htmlstr.replace(/xxx/g,"xxx");

htmlstr=htmlstr.replace(/xxx/g,"xxx");

document.getElementsByTagName('html')[0].innerHTML=htmlstr;



document.getElementsByTagName("table")[4].getElementsByTagName("td")[2].innerHTML="主队";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[3].innerHTML="客队";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[4].innerHTML="控球率";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[7].innerHTML="进攻机会比";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[10].innerHTML="进攻机会/全场进攻机会";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[13].innerHTML="射门/进攻机会";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[16].innerHTML="射正/射门";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[19].innerHTML="进球/射正";
document.getElementsByTagName("table")[4].getElementsByTagName("td")[22].innerHTML="进球/射门";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[0].innerHTML="球场信息";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[1].innerHTML="比赛类型";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[3].innerHTML="比赛名称";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[5].innerHTML="比赛时间";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[7].innerHTML="比赛城市";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[9].innerHTML="比赛球场";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[11].innerHTML="上座率/球场容量";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[13].innerHTML="天气情况";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[15].innerHTML="球场状态";
document.getElementsByTagName("table")[5].getElementsByTagName("td")[17].innerHTML="阵容和战术";
document.getElementsByTagName("table")[7].getElementsByTagName("td")[0].innerHTML="阵容概览";











//alert(document.getElementsByTagName("table")[7].getElementsByTagName("td")[0].innerHTML);
