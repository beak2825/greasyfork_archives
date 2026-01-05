// ==UserScript==
// @name           Star players and match result quickly
// @version        3.7
// @author         Spieler17
// @description    You can immediately find out the result of the league match in the viewing mode of the match, as well as the starting lineups in the stars.
// @include	   https://trophymanager.com/matches/*
// @namespace https://greasyfork.org/users/32455
// @grant       function
// @downloadURL https://update.greasyfork.org/scripts/17808/Star%20players%20and%20match%20result%20quickly.user.js
// @updateURL https://update.greasyfork.org/scripts/17808/Star%20players%20and%20match%20result%20quickly.meta.js
// ==/UserScript==

 var funShowStars;
 
 function isOKForShow(){
    var loading =document.getElementsByClassName("loading")[0];
    var shown=document.getElementById("mystarbox");
    if(loading!=null)
        return false;
    if(shown!=null)
        return false;
    return true;
 }

 function countStars(str) {
    var num1=str.lastIndexOf("_")+1;
    var num2=str.lastIndexOf("\"");
    return parseInt(str.substring(num1,num2));
 }

 function getStars(starnum) {
    
    var num= Math.round(starnum*100/55);
    
    if(num<10)return  "<img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";  
    if(num<20)return  "<img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";  
    if(num<30)return  "<img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";  
    if(num<40)return  "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
    if(num<50)return  "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
    if(num<61)return  "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"><img src=\"/pics/dark_star.png\"> (";
    if(num<72)return  "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"><img src=\"/pics/dark_star.png\"> (";
    if(num<84)return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/dark_star.png\"> (";
    if(num<93.5)return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/half_star.png\"> (";
    
    return "<img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"><img src=\"/pics/star.png\"> (";
 }

 function ShowStars()
    {
    if(isOKForShow()==true)
    {
    var divs=document.getElementsByClassName("player_field")[0].getElementsByTagName("div");
    var i = 0;
    var home=0;
    var away=0;
    for(;i<=10;i++)
    home+=countStars(divs[i*2].innerHTML);
    for(;i<=21;i++)
    away+=countStars(divs[i*2].innerHTML);
    home=home/2;
    home=home.toFixed(1);
    away=away/2;
    away=away.toFixed(1);
    var newdiv=document.createElement("div");        
    newdiv.innerHTML="<br><div id=\"mystarbox\" class=\"home color\" style=\"background-color:rgb(127,127,127)\"><b style=\"color: gold;\">"+getStars(home)+home+"/55)</b></div><div class=\"away color\"  style=\"background-color:rgb(10,5,76)\"><b style=\"color: gold;\">"+getStars(away)+away+"/55)</b></div>";
    document.getElementsByClassName("nameplate")[0].appendChild(newdiv);
    }
}

    if (location.href.indexOf("matches") != -1)
    {
    funShowStars=setInterval(ShowStars,700);
       
    var welcome = document.createElement("div");
       
    welcome.className = "final_score";
    welcome.innerHTML="<center><a href=\"javascript:getResult()\">Match result </a></center>";
    document.getElementsByClassName("abs output stats text_center")[0].appendChild(welcome);
    var MatchId = location.href.split(".com/")[1].split("/")[1].split("#")[0].split("?")[0];
    var title = document.getElementsByTagName("head")[0];
    var myscript = document.createElement("script");
    myscript.type="text/javascript";
    var str= "function getResult(){\n";
    str+="$.ajax({\n"; 
    str+="type: \'GET\',\n";
    str+="url: \'https://trophymanager.com/ajax/match.ajax.php\',\n";
    str+="data: { id: "+MatchId+"},\n";
    str+="dataType: 'json',\n";
    str+="success: function(data){ \n";
    str+="var ObjectReport =data.report;\n";
    str+="if (ObjectReport==null){\n";
    str+="$(\'.final_score\')[0].innerHTML=\"<p>Match result</p>\";}\n";
    str+="else{var size=Object.keys(ObjectReport).length;\n";
    str+="var keys=Object.keys(ObjectReport)[size-1];\n";
    str+="var lastString=data.report[keys][0].chance.text;\n";
    str+="var tableBefore= lastString.toString().split(\' \');\n";
    str+="for (var i = 0; i < tableBefore.length; i++) {	\n";
    str+="var index = tableBefore[i].indexOf(\'-\');\n";
    str+="if (index > -1) { lastIndex=i;}}\n";
    str+="$(\'.final_score\')[0].innerHTML=\"<p style=\'font-family:arial;font-size:14px;\'>Match result <b>\"+tableBefore[lastIndex]+\"</b></p>\";\n";
    str+="}}});}\n";
    myscript.innerHTML=str;
    title.appendChild(myscript);                                      
}