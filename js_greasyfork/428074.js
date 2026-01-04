// ==UserScript==
// @name         Auto complete Health Declaration Form
// @license      MIT
// @namespace    http://supermicro.com/
// @version      0.3
// @description  Auto choose every "No" checkbox
// @author       ME
// @match        http://mpweb01-tw.supermicro.com/GAMgmt/HealthyReports/Create
// @match        http://mpweb01-tw/GAMgmt/HealthyReports/Create
// @match        http://mpweb01-tw.supermicro.com/GAMgmt/HealthyReports
// @match        http://mpweb01-tw/GAMgmt/HealthyReports
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428074/Auto%20complete%20Health%20Declaration%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/428074/Auto%20complete%20Health%20Declaration%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var debug = false;
    var maxNumber = 100;
    var delay = 2000;
    var id = setInterval(function(){
        if(debug){
            console.log("script runing...");
        }
        if ("/GAMgmt/HealthyReports" == getUrlRelativePath()) {
            if (document.querySelector("#DataTables_Table_1 > tbody > tr:nth-child(1) > td:nth-child(4)") != null) {
                if(debug){
                    console.log("page loaded");
                }
                clearInterval(id);
                var textProperty = 'textContent' in document ? 'textContent' : 'innerText';
                var lastSubmitDate = document.querySelector("#DataTables_Table_1 > tbody > tr:nth-child(1) > td:nth-child(4)")[textProperty].trim();
                if(!isThisWeek(lastSubmitDate)) {
                    document.querySelector("#content > div > div > div > div.card-body > p > a").click();
                }
            }
        }
        else if ("/GAMgmt/HealthyReports/Create" == getUrlRelativePath()) {
            if(document.querySelector("#Q01No")!=null){
                if(debug){
                    console.log("page loaded");
                }
                clearInterval(id);
                for(var i=1;i<=maxNumber;i++){
                    var selectorName = "#Q" + (i<10?"0"+i:i) + "No";
                    if(document.querySelector(selectorName)!=null){
                        document.querySelector(selectorName).checked=true;
                    }
                }
                if(debug){
                    console.log("done choosing No");
                }
            }
        }
    },delay);
})();


function getUrlRelativePath() {
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}


function isThisWeek(date){
    let today = new Date()
    let week = today.getDay() == 0 ? 7 : today.getDay()
    let mon = time2date(1 - week).date
    let monstamp = new Date(mon).getTime() - 8 * 60 * 60 * 1000
    let tempdate = new Date(date).getTime() - 8 * 60 * 60 * 1000
    if( tempdate >= monstamp ){
        return true;
    }else{
        return false;
    }
}

//计算前几天是几号的转换函数
function time2date(temp = 0, isweek = true, time) {
    let temptime
    if (isweek) {
        temptime = new Date().getTime() + temp * 24 * 60 * 60 * 1000
    } else {
        temptime = time
    }
    let date = new Date(temptime)
    let yy = date.getFullYear()
    let mm = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    let dd = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
    let hh = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
    let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let weekday = week[date.getDay()]
    return { 'date': yy + '-' + mm + '-' + dd, 'week': weekday, 'hh': hh }
}