// ==UserScript==
// @name         Weekly Damage
// @namespace    https://www.erepublik.com/es/citizen/profile/2524994
// @version      1.1
// @description  Take the weekly damage for easy export
// @author       Bort
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        https://www.erepublik.com/*
// @downloadURL https://update.greasyfork.org/scripts/33204/Weekly%20Damage.user.js
// @updateURL https://update.greasyfork.org/scripts/33204/Weekly%20Damage.meta.js
// ==/UserScript==

var url_str = window.location.href;
var url = new URL(url_str);
var week = url.searchParams.get("w");
if(week === null){week = 0;}
var WeeklyData = url.searchParams.get("Weekly");

switch(WeeklyData) {
    case null:
        $(".media_widget").after("<div><a href=\"/en?Weekly=DT&w=0\" class=\"std_global_btn smallSize blueColor\" ><span>Weekly Damage</span></a></div>");
        break;
    case "DT":
        var jsonUrl = "https://www.erepublik.com/es/main/leaderboards-codamage-rankings/" + week;
        var title = "DAÑO TANQUES";
        getData("DT");
        break;
    case "DA":
        var jsonUrl = "https://www.erepublik.com/es/main/leaderboards-codamageaircraft-rankings/" + week;
        var title = "DAÑO AIRCRAFT";
        getData("DA");
        break;
    case "KT":
        var jsonUrl = "https://www.erepublik.com/es/main/leaderboards-cokills-rankings/" + week;
        var title = "KILLS TANQUES";
        getData("KT");
        break;
    case "KA":
        var jsonUrl = "https://www.erepublik.com/es/main/leaderboards-cokillsaircraft-rankings/" + week;
        var title = "KILLS AIRCRAFT";
        getData("KA");
        break;
}

function getWeekList(){
    var list = "<form onSubmit=\"gotoWeek()\" name=\"WeekList\" id=\"WeekList\"><input name=\"Weekly\" value=" + WeeklyData + " style=\"display: none\"><select name=\"w\"><option value=\"0\">Esta semana</option><option value=\"1\">Hace 1 semana</option>";
    for(i = 2;i <= 50; i++){
       list += "<option value=\"" + i + "\">Hace " + i + " semanas</option>";
    }
    list += "</select><input type=\"submit\" value=\"Ir\"></form><br><br>";
    switch(week){
        case null:
            list += "<h2>Esta semana</h2>";
            break;
        case "0":
            list += "<h2>Esta semana</h2>";
            break;
        case "1":
            list += "<h2>Hace 1 semana</h2>";
            break;
        default:
            list += "<h2>Hace " + week + " semanas</h2>";
            break;
    }
    return list;
}

function getData() {
    document.getElementById("content").innerHTML = "<span><a href=\"/en?Weekly=DT&w=0\" class=\"std_global_btn smallSize blueColor\"><span>Daño Tanques</span></a></span><span><a href=\"/en?Weekly=KT&w=0\" class=\"std_global_btn smallSize blueColor\"><span>Kills Tanques</span></a></span><span><a href=\"/en?Weekly=DA&w=0\" class=\"std_global_btn smallSize blueColor\"><span>Daño Aircraft</span></a></span><span><a href=\"/en?Weekly=KA&w=0\" class=\"std_global_btn smallSize blueColor\"><span>Kills Aircraft</span></a></span><br><br>";
    $.getJSON( jsonUrl, function(data) {
        var top = data.top;
        for (i = 0; i < top.length; i++) {
            var country_id = top[i].id;
            var countries = "<th>" + top[i].name + "</th><th>" + top[i].values;
            if(i === 0){
                var countriez = "<tr>" + countries+ "</tr>";
            }
            else{
                var countriez = countriez + "<tr>" + countries + "</tr>";
            }
        }
        document.getElementById("content").innerHTML += "<h1>"+ title +"</h1>" + getWeekList() + "<table border=\"1\" style=\"width:50%\" style=\"border: 1px solid black;\">" + countriez + "</table>";
    });
}