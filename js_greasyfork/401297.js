// ==UserScript==
// @name          风暴英雄汉化hotslogs.com heroesprofile.com
// @description 在 hotslogs.com 和 heroesprofile.com 自动汉化风暴英雄英雄名称
// @version      1.3
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include      **hotslogs.com**
// @include      **heroesprofile.com**
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401297/%E9%A3%8E%E6%9A%B4%E8%8B%B1%E9%9B%84%E6%B1%89%E5%8C%96hotslogscom%20heroesprofilecom.user.js
// @updateURL https://update.greasyfork.org/scripts/401297/%E9%A3%8E%E6%9A%B4%E8%8B%B1%E9%9B%84%E6%B1%89%E5%8C%96hotslogscom%20heroesprofilecom.meta.js
// ==/UserScript==
var a = ["Copy to Clipboard","Games Banned","Popularity","Unknown","View Talent Builds","Region","Game Type","Map","Player Rank","Hero Rank","Role Rank","Role","Hero Level","Stat Filter","Win Rate","Win Rates","Hero","Select all","All","All selected","Unranked Draft","Quick Match","Brawl","Storm League","Xul","Kharazim","Samuro","Deathwing","Fenix","Maiev","Raynor","Ana","Mal'Ganis","Lunara","Gazlowe","Rehgar","Malfurion","Kerrigan","E.T.C.","Greymane","Sonya","The Butcher","Lúcio","Malthael","Stukov","Rexxar","Zagara","Valla","Mephisto","Kael'thas","Tracer","Alexstrasza","Varian","Ragnaros","Johanna","Thrall","Azmodan","Nazeebo","Deckard","Li-Ming","Murky","Leoric","Abathur","Tyrael","Muradin","Jaina","Gall","Whitemane","Sgt. Hammer","Kel'Thuzad","Sylvanas","Junkrat","Diablo","Probius","Blaze","Uther","Artanis","Li Li","Auriel","Falstad","Arthas","Illidan","Chromie","Gul'dan","Zul'jin","Yrel","Nova","Anub'arak","Tyrande","Anduin","Brightwing","Garrosh","Alarak","Cho","Valeera","Zeratul","Tychus","Lt. Morales","Stitches","The Lost Vikings","Chen","Hanzo","Genji","Imperius","Orphea","Medivh","Qhira","Cassia","Dehaka","Zarya","Tassadar","D.Va","Mei","Hogger"];
var b = ["复制","被禁场数","流行度","未知","天赋方案","区域","游戏类型","地图","玩家段位","英雄段位","角色段位","角色","英雄等级","状态过滤","胜率","胜率","英雄","选择全部","全部","全部选择","非排名模式","快速比赛","风暴乱斗","排名模式","祖尔","卡拉辛姆","萨穆罗","死亡之翼","菲尼克斯","玛维","雷诺","安娜","玛尔加尼斯","露娜拉","加兹鲁维","雷加尔","玛法里奥","凯瑞甘","精英牛头人酋长","格雷迈恩","桑娅","屠夫","卢西奥","马萨伊尔","斯托科夫","雷克萨","扎加拉","维拉","墨菲斯托","凯尔萨斯","猎空","阿莱克丝塔萨","瓦里安","拉格纳罗斯","乔汉娜","萨尔","阿兹莫丹","纳兹波","迪卡德","李敏","奔波尔霸","李奥瑞克","阿巴瑟","泰瑞尔","穆拉丁","吉安娜","加尔","怀特迈恩","重锤军士","克尔苏加德","希尔瓦娜斯","狂鼠","迪亚波罗","普罗比斯","布雷泽","乌瑟尔","阿塔尼斯","丽丽","奥莉尔","弗斯塔德","阿尔萨斯","伊利丹","克罗米","古尔丹","祖尔金","伊瑞尔","诺娃","阿努巴拉克","泰兰德","安度因","光明之翼","加尔鲁什","阿拉纳克","古","瓦莉拉","泽拉图","泰凯斯","莫拉莉斯中尉","缝合怪","失落的维京人","陈","半藏","源氏","英普瑞斯","奥菲娅","麦迪文","琪拉","卡西娅","德哈卡","查莉娅","塔萨达尔","D.Va","美","霍格"];
var zz = a.length;
function hh(){
    var elements,i,oa,zm,j;
    elements = document.getElementsByTagName("a");
    for ( i=0;i<elements.length;i++){
         oa = elements[i].innerText;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (a[j]!="" && oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].innerText=zm;}}
    elements = document.getElementsByTagName("div");
    for ( i=0;i<elements.length;i++){
         oa = elements[i].innerText;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (a[j]!="" && oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].innerText=zm;}}
    elements = document.getElementsByTagName("strong");
    for ( i=0;i<elements.length;i++){
         oa = elements[i].innerText;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (a[j]!="" && oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].innerText=zm;}}
     elements = document.getElementsByTagName("option");
        for ( i=0;i<elements.length;i++){
         oa = elements[i].text;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (a[j]!="" && oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].text=zm;}}
     elements = document.getElementsByTagName("li");
     for ( i=0;i<elements.length;i++){
         oa = elements[i].textContent;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (a[j]!="" && oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].textContent=zm;}}
     elements = document.getElementsByTagName("span");
     for ( i=0;i<elements.length;i++){
         oa = elements[i].textContent;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (a[j]!="" && oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].textContent=zm;}}
}
hh();
setTimeout(function(){ hh();},1500);
setInterval(function(){ hh();},10000);