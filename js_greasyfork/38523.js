// ==UserScript==
// @name        金剛直播，開播監控程式 --- 3cmFatHome
// @namespace   CheckKingKong discordapp 館粉聊天室 3cmFatHome
// @description 請先安裝擴充套件 Tampermonkey ，監控成吉思汗飆捍館長和其他實況主金剛開播的程式，開播後會自動播放音樂提醒
// @match       https://www.kingkong.com.tw/*?3cmfathome
// @require     http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js
// @version     2018.3.5.41
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38523/%E9%87%91%E5%89%9B%E7%9B%B4%E6%92%AD%EF%BC%8C%E9%96%8B%E6%92%AD%E7%9B%A3%E6%8E%A7%E7%A8%8B%E5%BC%8F%20---%203cmFatHome.user.js
// @updateURL https://update.greasyfork.org/scripts/38523/%E9%87%91%E5%89%9B%E7%9B%B4%E6%92%AD%EF%BC%8C%E9%96%8B%E6%92%AD%E7%9B%A3%E6%8E%A7%E7%A8%8B%E5%BC%8F%20---%203cmFatHome.meta.js
// ==/UserScript==

//监控，館長开播后，播放歌曲30秒鐘
//sessionStorage 新开窗口重新初始化
//alert();
//location.replace(location.href);

var nowplaystat=0;
var loadingnums=0;
webstat=sessionStorage.sessionstat; //无法传递即时状态
console.log('first，nowplaystat : '+nowplaystat+' / webstat : '+webstat);

if (typeof(webstat) == "undefined") {
    console.log('newtab first undefined');
}

/*playstat=localStorage.getItem("playstat");
if (typeof(playstat) == "undefined") {
    localStorage.setItem("playstat", "web11");
playstat=localStorage.getItem("playstat");
    alert(playstat);
}*/

var kingkongtitle=$("title").text();
console.log('kingkongtitle : '+kingkongtitle);
//ERROR: The request could not be satisfied/404_King Kong金剛直播

var kingkonguserid=$("span.anchor-pfid").text();
if (kingkonguserid==""){var kingkonguserid="主播id";}
console.log('kingkonguserid : '+kingkonguserid);
var kingkongusername=$("h5.anchor-nickname").text();
if (kingkongusername==""){var kingkongusername="主播名称";}
console.log('kingkongusername : '+kingkongusername);
var kingkonglivetitle=$("div.room-live-title h3").text();
if (kingkonglivetitle==""){var kingkonglivetitle="实况名称";}
console.log('kingkonglivetitle : '+kingkonglivetitle);

checkPower30678();

function checkPower30678() {



    //查找金刚直播404状态;
    var kingkongtitle=$("title").text();
    var kingkongtitlefound=kingkongtitle.indexOf("404_King Kong");
    console.log('kingkongtitle : '+kingkongtitle);
    if (kingkongtitlefound!=-1) {
        setTimeout(function(){ window.location.reload(); }, 10000);
    }



    if ($('div').is('[class*="kingkong"]')){


        //不在直播狀態
        if ($('div').is('[data-video-stat*="nohome"]')){
            console.log('stat : 小雞雞不在直播狀態');
            nowplaystat="nolive";
            sessionStorage.sessionstat="webnolive";
            //alert(sessionStorage.sessionstat);
            //alert(webstat);
            //localStorage.setItem("playstat", "nolive");
            //playstat=localStorage.getItem("playstat");
            //alert(playstat);
            setTimeout(function(){ window.location.reload(); }, 10000);
        }

        //初始直播狀態，播放歌曲
        if ($('div').is('[data-video-stat*="playing"]')){
            console.log('sessionStorage.sessionstat : '+sessionStorage.sessionstat);

            nowplaystat="living";
            if(sessionStorage.sessionstat=="webnolive"){
                console.log('stat : 小雞雞初始直播狀態，播放歌曲');
                document.head.innerHTML += "<video controls=\"\" id=\"beep\" autoplay=\"\" name=\"media\" style=\"display:none;\"><source src=\"https://raw.githubusercontent.com/3cmFatHome/CDN/master/music/alert1bgm.mp3\" type=\"audio/mpeg\" /></video>";
                setTimeout(function(){ ClearBeep(); }, 40000);
                sessionStorage.sessionstat="webliving";
                console.log('webstat : 小雞雞初始直播狀態，播放歌曲'+sessionStorage.sessionstat);
            }

            /*if (typeof(sessionStorage.sessionstat) == "undefined") {
                console.log('newtab first undefined');
            }


            if(sessionStorage.sessionstat=="undefined"){
                console.log('stat : 小雞雞初始直播狀態，播放歌曲');
                document.head.innerHTML += "<video controls=\"\" id=\"beep\" autoplay=\"\" name=\"media\" style=\"display:none;\"><source src=\"https://raw.githubusercontent.com/3cmFatHome/CDN/master/music/alert1bgm.mp3\" type=\"audio/mpeg\" /></video>";
                setTimeout(function(){ ClearBeep(); }, 40000);
                sessionStorage.sessionstat="webliving";
                console.log('webstat : 小雞雞初始直播狀態，播放歌曲'+sessionStorage.sessionstat);
            }*/
        }

        //正在直播狀態
        if ($('div').is('[data-video-stat*="playing"]')){
            loadingnums=0;
            nowplaystat="living";
            console.log('stat : 小雞雞正在直播狀態');
        }

        //讀取直播狀態
        if ($('div').is('[data-video-stat*="loading"]')){

            if (nowplaystat=="0"){
                //alert("stat : 0-1小雞雞讀取直播狀態,判斷讀取直播狀態是否結束");
                console.log('stat : 0-1小雞雞讀取直播狀態,判斷讀取直播狀態是否結束');
                setTimeout(function(){ checkLoadingPower30678(); }, 30000);
            }
            if (nowplaystat=="loading"){
                //alert("stat : 0-1小雞雞讀取直播狀態,判斷讀取直播狀態是否結束");
                console.log('stat : 0-1小雞雞讀取直播狀態,判斷讀取直播狀態是否結束');
                setTimeout(function(){ checkLoadingPower30678(); }, 30000);
            }
            if (nowplaystat=="nolive"){
                //alert("stat : 0-1小雞雞讀取直播狀態,判斷讀取直播狀態是否結束");
                console.log('stat : 0-1小雞雞讀取直播狀態,判斷讀取直播狀態是否結束');
                setTimeout(function(){ checkLoadingPower30678(); }, 30000);
            }
            if (sessionStorage.sessionstat=="webliving"){
                console.log('stat : 讀取直播狀態,webliving');
                setTimeout(function(){ checkLoadingPower30678(); }, 30000);
            }
        }



    }

    //循环，没有刷新功能
    console.log(kingkongusername+'('+kingkonguserid+')'+' 的游戏监控状态，nowplaystat : '+nowplaystat+' / webstat : '+sessionStorage.sessionstat);
    setTimeout(function(){ checkPower30678(); }, 15000);

}



function ClearBeep() {
    beepElement = document.getElementById('beep');
    beep.parentElement.removeChild(beep);
    console.log('stat : ClearBeep');
}


function checkLoadingPower30678() {
    console.log('stat : checkLoadingPower30678');
    loadingnums=loadingnums+1;
    console.log('stat : checkLoadingPower30678,loadingnums : '+loadingnums);
    if (loadingnums==5){
        console.log('stat : checkLoadingPower30678,loadingnums : '+loadingnums);
        loadingnums=0;
        console.log('stat : checkLoadingPower30678,loadingnums : '+loadingnums);
        setTimeout(function(){ window.location.reload(); }, 10000);
    }
    if ($('div').is('[data-video-stat*="nohome"]')){
        console.log('stat : nohome,checkLoadingPower30678');
        setTimeout(function(){ window.location.reload(); }, 10000);
    }
}


