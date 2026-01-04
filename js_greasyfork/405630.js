// ==UserScript==
// @name         bahaBye-kan - 動畫瘋彈幕過濾器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  💡過濾巴哈姆特動畫瘋簡體字彈幕用腳本⚾
// @author       sodais69
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @grant        GM_log
// @require      https://greasyfork.org/scripts/405629-simplist/code/simpList.js?version=817690
// @downloadURL https://update.greasyfork.org/scripts/405630/bahaBye-kan%20-%20%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95%E9%81%8E%E6%BF%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/405630/bahaBye-kan%20-%20%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95%E9%81%8E%E6%BF%BE%E5%99%A8.meta.js
// ==/UserScript==

//個人化設定

//🛠簡體字留言的處理方式🛠
/*
如果修改 filterStyle 後面的數字成
    1   文字會改成「根據相關法律該留言已經被隱藏了。」
    2   文字會被消失
*/
var filterStyle = 1;

var blockWord=2;

var filterWord={0:'屏蔽',1:'遮蔽',2:'隱藏',3:'阻擋',4:'消失'};


//consloe log?
//
var clog=true;


var filterStr = ' ';
if (filterStyle == 1) {
    filterStr = '「⚠️根據相關法律該留言已經被'+filterWord[blockWord]+'了。⚠️」';
} else {
    filterStr = ' ';
}


window.addEventListener('load', function () {
    clog?GM_log('hello world'):clog=false ;

    var self = animefun;

    var checkExist = setInterval(function () {
        if (self.danmuLoaded == true) {
            
            clog?console.log("Got danmu"):clog=false ;
            parseDanmu();
            clearInterval(checkExist);
        }
    }, 100);

}, false);

function parseDanmu() {

    var self = animefun;
    var danmu = self.danmu;
    clog?GM_log('subs length:' + danmu.length):clog=false ;
    
    for (var i = 0; i < danmu.length; i++) {
        var innersub = danmu[i]['text'];
        //GM_log('i='+i+':'+innersub);
        Object.keys(TongWen_st).every(key => {
            var searchResult = innersub.indexOf(key);
            if (searchResult != -1) {
                clog?GM_log('Simplified Chinese found! content:' + innersub + " Bingo word:" + innersub.substr(searchResult, 1)):clog=false ;
                
                animefun.danmu[i]['text'] = filterStr;
                animefun.danmu[i]['size']=0;
                animefun.danmu[i]['color']='#ff6565';
                return false;
            } else {
                return true;
            }
        });
    }
}

//todo regex