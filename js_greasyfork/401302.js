// ==UserScript==
// @name          守望先锋 暴雪滚蛋
// @description 守望先锋滚蛋 暴雪滚蛋
// @version      1.2
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include      **overbuff.com**
// @include      **overwatch.op.gg**
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/401302/%E5%AE%88%E6%9C%9B%E5%85%88%E9%94%8B%20%E6%9A%B4%E9%9B%AA%E6%BB%9A%E8%9B%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/401302/%E5%AE%88%E6%9C%9B%E5%85%88%E9%94%8B%20%E6%9A%B4%E9%9B%AA%E6%BB%9A%E8%9B%8B.meta.js
// ==/UserScript==
var a = ["Echo","Torbjörn","Baptiste","Brigitte","Wrecking Ball","Sigma","Moira","Ana","Reinhardt","Genji","Genji Shimada","Soldier: 76","Jack Morrison","McCree","Jesse McCree","Tracer","Lena Oxton","Reaper","Gabriel Reyes","Pharah","Fareeha Amari","Ana Amari","Mei","Mei-Ling Zhou","Junkrat","Jamison Fawkes","Widowmaker","Amélie Lacroix","Gérard Lacroix","Torbjörn Lindholm","Ingrid Lindholm","Brigitte Lindholm","Bastion","Hanzo","Hanzo Shimada","D.Va","Hana Song","Roadhog","Mako Rutledge","Zarya","Aleksandra Zaryanova","Winston","Reinhardt Wilhelm","Lúcio","Lúcio Correia dos Santos","Symmetra","Satya Vaswani","Mercy","Angela Ziegler","Zenyatta","Sombra","Olivia Colomar","Moira O'Deorain","Doomfist","Akande Ogundimu","Orisa","Tekhartha Mondatta","Harold Winston","Lynx Seventeen","Katya Volskaya","Okoro","Alejandra","Hakim","Hanna","Sven","Efi Oladele","Marc Guerra","Ayisha Ekwensi","Erik Swift","Olaf Stout","Baleog Fierce","Olivia Rai","Jack Stirling","Robert Greenways","Madeline O'Neal","Maisie Jones","Bruce","Anya Al-Shahrani","J. Chamberlain","Calado","Rivera","Rosa","Adhabu Ngumi","Akinjide Adeyemi","Nandah","Ganymede","Sam","Timmy","Brian","Athena","Maximilien","Ashe","Elizabeth Ashe","B.O.B.","Balderich von Adler"];
var b = ["回声","托比昂","巴蒂斯特","布丽吉塔","破坏球","西格玛","莫伊拉","安娜","莱因哈特","源氏","岛田源氏","士兵：76","杰克·莫里森","麦克雷","杰西·麦克雷","猎空","莉娜·奥克斯顿","死神","加布里尔·莱耶斯","法老之鹰","法芮尔·艾玛莉","安娜·艾玛莉","美","周美灵","狂鼠","詹米森·法尔克斯","黑百合","艾米丽·拉克瓦","杰哈·拉克瓦","托比昂·林德霍姆","英格瑞德·林德霍姆","布丽吉塔·林德霍姆","堡垒","半藏","岛田半藏","D.Va","宋哈娜","路霸","马可·拉特莱奇","查莉娅","亚历山德拉·查莉娅诺娃","温斯顿","莱因哈特·威尔海姆","卢西奥","卢西奥·科雷亚·多斯桑托斯","秩序之光","塞特娅·法斯瓦尼","天使","安吉拉·齐格勒","禅雅塔","黑影","奥利维娅·科罗玛","莫伊拉·奥德莱恩","末日铁拳","阿坎·奥古迪姆","奥丽莎","泰哈撒·孟达塔","哈罗德·温斯顿","林克斯·赛文汀","卡特娅·沃斯卡娅","奥科罗","阿莉汉德拉","哈金姆","汉娜","斯文","伊菲·奥拉迪尔","马克·盖拉","阿伊莎·埃克文西","艾瑞克·斯威夫特","奥拉夫·斯托特","巴尔洛戈·菲尔斯","奥利维亚·莱","杰克·斯特林","罗伯特·格林维斯","玛德琳·奥尼尔","梅齐·琼斯","布鲁斯","安雅·阿尔莎拉尼","J. 张伯伦","卡尔拉多","里韦拉","罗莎","阿德哈布·恩古米","阿金吉·奥迪耶米","内达尔","妮妮","萨姆","提米","布莱恩","雅典娜","马克西米里安","艾什","伊丽莎白·艾什","鲍勃","鲍德里奇·冯阿德勒"];
var zz = a.length;
function hh(){
    var elements,i,oa,zm,j;
    elements = document.getElementsByTagName("a","div");
    for ( i=0;i<elements.length;i++){
         oa = elements[i].innerText;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].innerText=zm;}}
    elements = document.getElementsByTagName("strong");
    for ( i=0;i<elements.length;i++){
         oa = elements[i].innerText;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].innerText=zm;}}
     elements = document.getElementsByTagName("option");
        for ( i=0;i<elements.length;i++){
         oa = elements[i].text;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].text=zm;}}
     elements = document.getElementsByTagName("li");
     for ( i=0;i<elements.length;i++){
         oa = elements[i].textContent;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].textContent=zm;}}
     elements = document.getElementsByTagName("span");
     for ( i=0;i<elements.length;i++){
         oa = elements[i].textContent;
        if (oa!=null) { zm = ""; for ( j=0;j<zz;j++){if (oa == a[j]) { /* console.log(oa,'    ',a[j],'    ',b[j]); */zm = b[j]; break; }}
         if (zm != "")elements[i].textContent=zm;}}
}
hh();
setInterval(function(){ hh();},10000);