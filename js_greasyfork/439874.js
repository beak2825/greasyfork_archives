// ==UserScript==
// @name            TM Training History (CN)
// @version         0.7.20220214
// @description     Based on the saved trainings, it shows the decimals of each skill (warning: activating during the training update could mess up your saved data!)
// @author          Andrizz aka Jimmy il Fenomeno (club ID: 3257254)
// @include			/https:\/\/trophymanager\.com\/players\//
// @exclude         /https:\/\/trophymanager\.com\/players\/\d/
// @license         MIT
// @namespace       wfefwf
// @downloadURL https://update.greasyfork.org/scripts/439874/TM%20Training%20History%20%28CN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439874/TM%20Training%20History%20%28CN%29.meta.js
// ==/UserScript==
$("#toggle_b_team").parent().css("padding-top","5px");
$("#toggle_b_team").parent().append("<span class='padding' style='cursor:pointer;'> 训练历史记录<img id='history' src='/pics/sort_btn_gray_off.gif'></span>");
$("div.left_skill").find("img").not("#history").each(function(){ $(this).click(function(){ $("#history").attr("src","/pics/sort_btn_gray_off.gif") }); });
$("select#select_age_min, select#select_age_max").change(function(){ $("#history").attr("src","/pics/sort_btn_gray_off.gif") });
var lastTraining = [];
var pastTraining = [];
var clubID = SESSION.main_id;
var training0 = new Date("08 06 2019 01:00:00 GMT");
var today = new Date();
var day = (today.getTime()-training0.getTime())/1000/3600/24;
while (day > 84-16/24) day -= 84;
var session = Math.floor(day/7)+1;
if (localStorage.getItem("LTsave"+clubID) !== null) {
    var saved = JSON.parse(localStorage.getItem("LTsave"+clubID));
    var savedSess = saved[0].session;
    if (session!==savedSess){
        pastTraining=saved;
        localStorage.setItem("PTsave"+clubID, JSON.stringify(pastTraining));
    } else {
        if (localStorage.getItem("PTsave"+clubID) !== null) {
            var psaved = JSON.parse(localStorage.getItem("PTsave"+clubID));
            var psavedSess = psaved[0].session;
            if (session!==psavedSess) { pastTraining=psaved; }
        }
    }
}
$("#history").click(function(){
    var checkON = $(this).attr("src");
    if (checkON!=="/pics/sort_btn_gray_on.gif") {
        if ($("div.left_skill>div>span.padding:eq(0)").find("img").attr("src")==="/pics/sort_btn_gray_off.gif") { $("div.left_skill>div>span.padding:eq(0)").click(); }
        if ($("span#toggle_a_team>img").attr("src")==="/pics/sort_btn_gray_off.gif") { $("span#toggle_a_team").click(); }
        if ($("span#toggle_b_team>img").attr("src")==="/pics/sort_btn_gray_off.gif") { $("span#toggle_b_team").click(); }
        $("div.left_skill").find("span.padding:eq(3)>img").click();
        $.when(getLastTraining()).then(showTraining());
    }
});

function getLastTraining(){
    $("table.zebra").find("tr").not(".header").each(function(){
        var id = $(this).find("td:eq(1)>div.name>a").attr("player_link");
        var TI = $(this).find("td:eq(18)").text();
        var c1 = $(this).find("td:eq(4)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(4)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(4)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(4)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c2 = $(this).find("td:eq(5)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(5)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(5)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(5)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c3 = $(this).find("td:eq(6)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(6)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(6)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(6)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c4 = $(this).find("td:eq(7)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(7)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(7)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(7)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c5 = $(this).find("td:eq(8)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(8)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(8)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(8)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c6 = $(this).find("td:eq(9)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(9)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(9)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(9)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c7 = $(this).find("td:eq(10)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(10)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(10)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(10)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c8 = $(this).find("td:eq(11)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(11)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(11)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(11)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c9 = $(this).find("td:eq(12)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(12)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(12)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(12)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c10 = $(this).find("td:eq(13)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(13)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(13)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(13)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c11 = $(this).find("td:eq(14)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(14)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(14)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(14)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c12 = $(this).find("td:eq(15)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(15)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(15)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(15)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c13 = $(this).find("td:eq(16)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(16)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(16)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(16)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var c14 = $(this).find("td:eq(17)>div").attr("class")==="skill training one_up" ? 2 : $(this).find("td:eq(17)>div").attr("class")==="skill training part_up" ? 1 : $(this).find("td:eq(17)>div").attr("class")==="skill training part_down" ? -1 : $(this).find("td:eq(17)>div").attr("class")==="skill training one_down" ? -2 : 0;
        var totUp = 0;
        totUp = ($(this).find("td:eq(4)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(4)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(5)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(5)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(6)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(6)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(7)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(7)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(8)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(8)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(9)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(9)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(10)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(10)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(11)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(11)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(12)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(12)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(13)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(13)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(14)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(14)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(15)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(15)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(16)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(16)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        totUp = ($(this).find("td:eq(17)>div").attr("class")==="skill training one_up" || $(this).find("td:eq(17)>div").attr("class")==="skill training part_up") ? totUp+1 : totUp;
        var lt = {"id":id, "totUp":totUp, "TI":TI, "c1":c1, "c2":c2, "c3":c3, "c4":c4, "c5":c5, "c6":c6, "c7":c7, "c8":c8, "c9":c9, "c10":c10, "c11":c11, "c12":c12, "c13":c13, "c14":c14};
        lastTraining.push(lt);
    });
};

function showTraining(){
    $("div.skill.training.one_down").css({"font-weight":"inherit","font-size":"inherit"});
    $("div.skill.training.one_up").css({"font-weight":"inherit","font-size":"inherit"});
    var savedTraining = [];
    $("table.zebra").find("tr").not(".header").each(function(){
        var s1 = 1*($(this).find("td:eq(4)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(4)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(4)>div").text());
        var s2 = 1*($(this).find("td:eq(5)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(5)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(5)>div").text());
        var s3 = 1*($(this).find("td:eq(6)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(6)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(6)>div").text());
        var s4 = 1*($(this).find("td:eq(7)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(7)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(7)>div").text());
        var s5 = 1*($(this).find("td:eq(8)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(8)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(8)>div").text());
        var s6 = 1*($(this).find("td:eq(9)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(9)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(9)>div").text());
        var s7 = 1*($(this).find("td:eq(10)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(10)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(10)>div").text());
        var s8 = 1*($(this).find("td:eq(11)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(11)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(11)>div").text());
        var s9 = 1*($(this).find("td:eq(12)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(12)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(12)>div").text());
        var s10 = 1*($(this).find("td:eq(13)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(13)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(13)>div").text());
        var s11 = 1*($(this).find("td:eq(14)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(14)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(14)>div").text());
        var s12 = 1*($(this).find("td:eq(15)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(15)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(15)>div").text());
        var s13 = 1*($(this).find("td:eq(16)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(16)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(16)>div").text());
        var s14 = 1*($(this).find("td:eq(17)>div>img").attr("src")==="/pics/star.png" ? 20 : $(this).find("td:eq(17)>div>img").attr("src")==="/pics/star_silver.png" ? 19 : $(this).find("td:eq(17)>div").text());
        var id = $(this).find("td:eq(1)>div.name>a").attr("player_link");
        var d1=0; var d2=0; var d3=0; var d4=0; var d5=0; var d6=0; var d7=0; var d8=0; var d9=0; var d10=0; var d11=0; var d12=0; var d13=0; var d14=0;
        if (pastTraining.length>0){
            for (var j=0;j<pastTraining.length;j++){
                if (id===pastTraining[j].id){
                    d1=pastTraining[j].d1*1; d2=pastTraining[j].d2*1; d3=pastTraining[j].d3*1; d4=pastTraining[j].d4*1; d5=pastTraining[j].d5*1; d6=pastTraining[j].d6*1; d7=pastTraining[j].d7*1;
                    d8=pastTraining[j].d8*1; d9=pastTraining[j].d9*1; d10=pastTraining[j].d10*1; d11=pastTraining[j].d11*1; d12=pastTraining[j].d12*1; d13=pastTraining[j].d13*1; d14=pastTraining[j].d14*1;
                }
            }
        }
        for (var i=0;i<lastTraining.length;i++){
            if (id===lastTraining[i].id){
                var TI=lastTraining[i].TI;
                var totUp=lastTraining[i].totUp;
                var avgDec = Math.floor(TI/totUp)/10;
                if (avgDec<=0) avgDec=1/10;
                var c1=lastTraining[i].c1; var c2=lastTraining[i].c2; var c3=lastTraining[i].c3; var c4=lastTraining[i].c4; var c5=lastTraining[i].c5;
                var c6=lastTraining[i].c6; var c7=lastTraining[i].c7; var c8=lastTraining[i].c8; var c9=lastTraining[i].c9; var c10=lastTraining[i].c10;
                var c11=lastTraining[i].c11; var c12=lastTraining[i].c12; var c13=lastTraining[i].c13; var c14=lastTraining[i].c14;
                var sd1 = c1===2 ? (s1===20 ? 20 : s1+(avgDec-1/10)) : c1===1 ? (Math.trunc((s1+d1+avgDec).toFixed(1))>s1 ? s1+9/10 : (s1+d1+avgDec).toFixed(1)) : c1===-1 ? s1+(d1===0 ? 8/10 : d1-1/10) : c1===-2 ? s1+9/10 : s1+d1;
                var sd2 = c2===2 ? (s2===20 ? 20 : s2+(avgDec-1/10)) : c2===1 ? (Math.trunc((s2+d2+avgDec).toFixed(1))>s2 ? s2+9/10 : (s2+d2+avgDec).toFixed(1)) : c2===-1 ? s2+(d2===0 ? 8/10 : d2-1/10) : c2===-2 ? s2+9/10 : s2+d2;
                var sd3 = c3===2 ? (s3===20 ? 20 : s3+(avgDec-1/10)) : c3===1 ? (Math.trunc((s3+d3+avgDec).toFixed(1))>s3 ? s3+9/10 : (s3+d3+avgDec).toFixed(1)) : c3===-1 ? s3+(d3===0 ? 8/10 : d3-1/10) : c3===-2 ? s3+9/10 : s3+d3;
                var sd4 = c4===2 ? (s4===20 ? 20 : s4+(avgDec-1/10)) : c4===1 ? (Math.trunc((s4+d4+avgDec).toFixed(1))>s4 ? s4+9/10 : (s4+d4+avgDec).toFixed(1)) : c4===-1 ? s4+(d4===0 ? 8/10 : d4-1/10) : c4===-2 ? s4+9/10 : s4+d4;
                var sd5 = c5===2 ? (s5===20 ? 20 : s5+(avgDec-1/10)) : c5===1 ? (Math.trunc((s5+d5+avgDec).toFixed(1))>s5 ? s5+9/10 : (s5+d5+avgDec).toFixed(1)) : c5===-1 ? s5+(d5===0 ? 8/10 : d5-1/10) : c5===-2 ? s5+9/10 : s5+d5;
                var sd6 = c6===2 ? (s6===20 ? 20 : s6+(avgDec-1/10)) : c6===1 ? (Math.trunc((s6+d6+avgDec).toFixed(1))>s6 ? s6+9/10 : (s6+d6+avgDec).toFixed(1)) : c6===-1 ? s6+(d6===0 ? 8/10 : d6-1/10) : c6===-2 ? s6+9/10 : s6+d6;
                var sd7 = c7===2 ? (s7===20 ? 20 : s7+(avgDec-1/10)) : c7===1 ? (Math.trunc((s7+d7+avgDec).toFixed(1))>s7 ? s7+9/10 : (s7+d7+avgDec).toFixed(1)) : c7===-1 ? s7+(d7===0 ? 8/10 : d7-1/10) : c7===-2 ? s7+9/10 : s7+d7;
                var sd8 = c8===2 ? (s8===20 ? 20 : s8+(avgDec-1/10)) : c8===1 ? (Math.trunc((s8+d8+avgDec).toFixed(1))>s8 ? s8+9/10 : (s8+d8+avgDec).toFixed(1)) : c8===-1 ? s8+(d8===0 ? 8/10 : d8-1/10) : c8===-2 ? s8+9/10 : s8+d8;
                var sd9 = c9===2 ? (s9===20 ? 20 : s9+(avgDec-1/10)) : c9===1 ? (Math.trunc((s9+d9+avgDec).toFixed(1))>s9 ? s9+9/10 : (s9+d9+avgDec).toFixed(1)) : c9===-1 ? s9+(d9===0 ? 8/10 : d9-1/10) : c9===-2 ? s9+9/10 : s9+d9;
                var sd10 = c10===2 ? (s10===20 ? 20 : s10+(avgDec-1/10)) : c10===1 ? (Math.trunc((s10+d10+avgDec).toFixed(1))>s10 ? s10+9/10 : (s10+d10+avgDec).toFixed(1)) : c10===-1 ? s10+(d10===0 ? 8/10 : d10-1/10) : c10===-2 ? s10+9/10 : s10+d10;
                var sd11 = c11===2 ? (s11===20 ? 20 : s11+(avgDec-1/10)) : c11===1 ? (Math.trunc((s11+d11+avgDec).toFixed(1))>s11 ? s11+9/10 : (s11+d11+avgDec).toFixed(1)) : c11===-1 ? s11+(d11===0 ? 8/10 : d11-1/10) : c11===-2 ? s11+9/10 : s11+d11;
                var sd12 = c12===2 ? (s12===20 ? 20 : s12+(avgDec-1/10)) : c12===1 ? (Math.trunc((s12+d12+avgDec).toFixed(1))>s12 ? s12+9/10 : (s12+d12+avgDec).toFixed(1)) : c12===-1 ? s12+(d12===0 ? 8/10 : d12-1/10) : c12===-2 ? s12+9/10 : s12+d12;
                var sd13 = c13===2 ? (s13===20 ? 20 : s13+(avgDec-1/10)) : c13===1 ? (Math.trunc((s13+d13+avgDec).toFixed(1))>s13 ? s13+9/10 : (s13+d13+avgDec).toFixed(1)) : c13===-1 ? s13+(d13===0 ? 8/10 : d13-1/10) : c13===-2 ? s13+9/10 : s13+d13;
                var sd14 = c14===2 ? (s14===20 ? 20 : s14+(avgDec-1/10)) : c14===1 ? (Math.trunc((s14+d14+avgDec).toFixed(1))>s14 ? s14+9/10 : (s14+d14+avgDec).toFixed(1)) : c14===-1 ? s14+(d14===0 ? 8/10 : d14-1/10) : c14===-2 ? s14+9/10 : s14+d14;
            }
        }
        var td1=parseFloat(sd1%1).toFixed(1); var td2=parseFloat(sd2%1).toFixed(1); var td3=parseFloat(sd3%1).toFixed(1); var td4=parseFloat(sd4%1).toFixed(1); var td5=parseFloat(sd5%1).toFixed(1);
        var td6=parseFloat(sd6%1).toFixed(1); var td7=parseFloat(sd7%1).toFixed(1); var td8=parseFloat(sd8%1).toFixed(1); var td9=parseFloat(sd9%1).toFixed(1); var td10=parseFloat(sd10%1).toFixed(1);
        var td11=parseFloat(sd11%1).toFixed(1); var td12=parseFloat(sd12%1).toFixed(1); var td13=parseFloat(sd13%1).toFixed(1); var td14=parseFloat(sd14%1).toFixed(1);
        var st = {"id":id, "session":session, "totUp":totUp, "TI":TI, "d1":td1, "d2":td2, "d3":td3, "d4":td4, "d5":td5, "d6":td6, "d7":td7, "d8":td8, "d9":td9, "d10":td10, "d11":td11, "d12":td12, "d13":td13, "d14":td14};
        savedTraining.push(st);
        $(this).find("td:eq(4)>div").text(sd1); $(this).find("td:eq(5)>div").text(sd2); $(this).find("td:eq(6)>div").text(sd3); $(this).find("td:eq(7)>div").text(sd4); $(this).find("td:eq(8)>div").text(sd5);
        $(this).find("td:eq(9)>div").text(sd6); $(this).find("td:eq(10)>div").text(sd7); $(this).find("td:eq(11)>div").text(sd8); $(this).find("td:eq(12)>div").text(sd9); $(this).find("td:eq(13)>div").text(sd10);
        $(this).find("td:eq(14)>div").text(sd11); $(this).find("td:eq(15)>div").text(sd12); $(this).find("td:eq(16)>div").text(sd13); $(this).find("td:eq(17)>div").text(sd14);
    });
    $("#history").attr("src","/pics/sort_btn_gray_on.gif");
    $("table.zebra").find("tr.header").find("th").each(function(){ $(this).find("div").click(function(){ $("#history").attr("src","/pics/sort_btn_gray_off.gif") }); });
    localStorage.setItem("LTsave"+clubID, JSON.stringify(savedTraining));
};