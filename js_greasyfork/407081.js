// ==UserScript==
// @name         Inspection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  巡查便捷脚本
// @author       zhangchun
// @match        https://global-oss-jf2jja.bigo.tv/bigoLiveInfo/live-real-time-info/show-detail*
// @match        https://global-oss-jf2jja.bigo.tv/bigoLiveInfo/live-real-time-info/index?app_id=60*
// @match        https://global-oss.zmqdez.com/bigoLiveInfo/live-real-time-info/show-detail*
// @match        https://global-oss.zmqdez.com/bigoLiveInfo/live-real-time-info/index?app_id=60*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407081/Inspection.user.js
// @updateURL https://update.greasyfork.org/scripts/407081/Inspection.meta.js
// ==/UserScript==


(function(){

    var ContryColorConfig = {

        //严格版
        "strict":{
            country:["严格版", "AE", "SA", "KW", "LB", "IQ", "PS", "JO", "YE", "OM", "SY", "QA", "BH", "EG", "SD", "LY", "TN", "DZ", "MA", "SO", "IR", "IL", "MR", "DJ", "KM"],
            bgcolor:"red"
        },
        //偏严版
        "slight_strict":{
            country:["偏严版", "IN","PK","TR","KR","CN","TW","HK","MO","SG","AU","NZ","MY","BN"],
            bgcolor:"orange"
        },
        //日韩国家
        "Japan_and_Korea":{
            country:["JP","KR"],
            bgcolor:"lightgreen"
        },
        //孟加拉
        "Bengal":{
            country:["BD"],
            bgcolor:"black"
        },

        changeColor : function(countryCode){
            var color;
            if(ContryColorConfig.strict.country.includes(countryCode))
            {
                color = "red";
            }
            else if(ContryColorConfig.slight_strict.country.includes(countryCode))
            {
                color = "orange";
            }
            else if(ContryColorConfig.Japan_and_Korea.country.includes(countryCode))
            {
                color = "lightgreen";
            }
            else if(ContryColorConfig.Bengal.country.includes(countryCode))
            {
                color = "black";
            }
            else
            {
                color = "#006699";
            }
            return color;
        },
    }

    var Rooms = document.querySelectorAll(".picture-font") //获取页面所有的房间列表
    var RoomCountryCode = [];//所有房间对应的国家码
    var IframContry;
    var IframContryCode;
    var timer;

    //巡查首页国家码颜色
    for(var i = 0;i<Rooms.length;i++){
        //获取国家码
        RoomCountryCode[i] = Rooms[i].children[8].innerText
        Rooms[i].children[8].style.backgroundColor = ContryColorConfig.changeColor(RoomCountryCode[i]);
       
    }
        
    //IFRAM国家码颜色
    timer = setInterval(function(){
        if(document.querySelector(".div-m1"))
        {
            IframContry = document.querySelectorAll(".div-m1>div")[1];
            IframContryCode = IframContry.innerText;
            IframContry.style.backgroundColor = ContryColorConfig.changeColor(IframContryCode);
            clearInterval(timer);
        }
    },1);
})();