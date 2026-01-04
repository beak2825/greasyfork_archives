// ==UserScript==
// @name         [000] 15 Page Multi Faucet Roller (GRAB FREE MONEY EVER HOURE)
// @description  Redeem free money every houre with script, follow the links to get BTC ETH XRP USDT USDC BNB XEM STEAM ADA TRX 
// @description  Get free Crypto every houre on 15 Pages
// @description  To run the script open https://example.com/ 
// @description  Keep the page opened
// @description  Working on the folling pages: please use my Link to support my work and as little thanks for puplishing the script
// @description  Freebitco.in only works if your account got captcha enabled. I gonna include a ReCaptcha solver in one of the next Updates
// @description  Coin: ADA https://freecardano.com/?ref=231952 
// @description  Coin: STEAM https://freesteam.io/?ref=65357
// @description  Coin: TRX https://free-tron.com/?ref=38666
// @description  Coin: USDT https://freetether.com/?ref=76898
// @description  Coin: BTC https://freebitcoin.io/?ref=306602
// @description  Coin: XRP https://coinfaucet.io/?ref=653571
// @description  Coin: ETH https://freeethereum.com/?ref=49803
// @description  Coin: BNB https://freebinancecoin.com/?ref=39696
// @description  Coin: XEM https://freenem.com/?ref=233768
// @description  Coin: DASH https://freedash.io/?ref=18080
// @description  Coin: BTC https://freebitco.in/?r=3114580
// @description  Coin: USDC https://freeusdcoin.com/?ref=42246
// @description  Coin: NEO https://freeneo.io/?ref=16676
// @description  Coin: LINK https://freechain.link/?ref=16437
// @description  Coin: LTC https://free-ltc.com/?ref=47583
// @version      4.0
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @match        https://example.com
// @match        http://example.com
// @match        https://freebitco.in/*
// @match        https://free-tron.com/free
// @match        https://freecardano.com/free
// @match        https://coinfaucet.io/free
// @match        https://freebitcoin.io/free
// @match        https://freesteam.io/free
// @match        https://freetether.com/free
// @match        https://freeusdcoin.com/free
// @match        https://freebinancecoin.com/free
// @match        https://freedash.io/free
// @match        https://freeethereum.com/free
// @match        https://freenem.com/free
// @match        https://freechain.link/free
// @match        https://freeneo.io/free
// @match        https://free-ltc.com/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        window.close
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/410211/%5B000%5D%2015%20Page%20Multi%20Faucet%20Roller%20%28GRAB%20FREE%20MONEY%20EVER%20HOURE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410211/%5B000%5D%2015%20Page%20Multi%20Faucet%20Roller%20%28GRAB%20FREE%20MONEY%20EVER%20HOURE%29.meta.js
// ==/UserScript==
addJS_Node (null, null, overrideSelectNativeJS_Functions);
function overrideSelectNativeJS_Functions () {
    window.alert = function alert (message) {
        console.log (message);
    }
}
function addJS_Node (text, s_URL, funcToRun) {
    var D = document;
    var scriptNode= D.createElement ('script');
    scriptNode.type= "text/javascript";
    if (text)scriptNode.textContent= text;
    if (s_URL)scriptNode.src= s_URL;
    if (funcToRun)scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

var count_min = 1;

function ada(){
return new Promise(res => {
    setTimeout(function(){
       var win = window.open("https://freecardano.com/free");
        setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
        setTimeout(function () { win.close();}, 20000);
        res();
    }, 20000);
})
}

function steam(){
setTimeout(function(){
var win = window.open("https://freesteam.io/free");
        setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},40000);
}

function trx(){
setTimeout(function(){
var win = window.open("https://free-tron.com/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},60000);
}

function usdt(){
setTimeout(function(){
var win = window.open("https://freetether.com/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},80000);
}

function btc(){
setTimeout(function(){
var win = window.open("https://freebitcoin.io/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},100000);
}

function xrp(){
setTimeout(function(){
var win = window.open("https://coinfaucet.io/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},120000);
}

function eth(){
setTimeout(function(){
var win = window.open("https://freeethereum.com/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},140000);
}

function bnb(){
setTimeout(function(){
var win = window.open("https://freebinancecoin.com/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},160000);
}

function xem(){
setTimeout(function(){
var win = window.open("https://freenem.com/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},180000);
}

function dash(){
setTimeout(function(){
var win = window.open("https://freedash.io/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},200000);
}

function usdc(){
setTimeout(function(){
var win = window.open("https://freeusdcoin.com/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},220000);
}

function neo(){
setTimeout(function(){
var win = window.open("https://freeneo.io/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},240000);
}

function link(){
setTimeout(function(){
var win = window.open("https://freechain.link/free");
            setTimeout(function(){
             document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click();
    }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},260000);
}

function fbtc(){
setTimeout(function(){
var win = window.open("https://freebitco.in");
            setTimeout(function(){
               $('#free_play_form_button').click();
                  RedeemRPProduct('free_points_100');
                RedeemRPProduct('free_lott_100')
     }, random(2000,4000));
  setTimeout(function () { win.close();}, 20000);
},280000);
}

function wait(){
setTimeout(function(){
var win = window.open("https://free-ltc.com/free");
            setTimeout(function(){
               $('#free_play_form_button').click();
                  RedeemRPProduct('free_points_100');
                RedeemRPProduct('free_lott_100')
     }, random(2000,4000));
   setTimeout(function () { win.close();}, 3350000);
},300000);
}

async function free(){
await ada();
    steam();
    trx();
    usdt();
    btc();
    xrp();
    eth();
    bnb();
    xem();
    dash();
    usdc();
    neo();
    link();
    fbtc();
    wait();
}
free();


setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " seconds");
        count_min = count_min + 1;
    }, 1000);


function random(min,max){
   return min + (max - min) * Math.random();
}

setTimeout (function() {
    'use strict';
var domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
var body = $('body');
   setTimeout (function () {body.prepend(
        $('<div/>').attr('style',"position:fixed;top:0px;left:0;right:0;z-index:999;width:100%;background-color:black;color: black; text-align: center;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<p/>').text("***"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("14 PAGE CRYPTO MONEY GRABBER SCRIPT"))
                    .append($('<p/>').text("TRX USDT BTC XRP ETH BNB XEM DASH USDC NEO LINK STEAM EVERY HOURE"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("IF YOU DIDNT GOT YOUR ACCOUNTS YET, DEACTIVATE THE SCRIPT NOW AND KLICK ON *KLICK HERE* BELOW"))
.append($('<p/>').attr('style','text-decoration:underline;color: red').text("POPUP NEEDS TO BE ENABLED FOR WWW.EXAMPLE.COM"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').text("MORE PAGES GONNA BE ADDED SOON"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("CREATE ACCOUNTS ON ALL PAGES ON *KLICK HERE*"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: green').text("(KLICK HERE)"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("AFTER CREATING ALL ACCOUNTS JUST LOGIN"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("WHEN ALL ACCOUNTS LOGGED IN OPEN PAGE https://example.com/ AND WAIT FOR 1 MINUTE FOR THE BOT TO START"))
                    .append($('<p/>').text("***"))
                    .append($('<p/>').text("(FOLLOW LIKE AND SHARE THE SHOWN PAGE AT THE END THANKS!)"))
                    .append($('<p/>')
                    )
            ).click(function(){
                window.open("https://freecardano.com/?ref=231952");
                window.open("https://freesteam.io/?ref=65357");
                window.open("https://free-tron.com/?ref=38666");
                window.open("https://freetether.com/?ref=76898");
                window.open("https://freebitcoin.io/?ref=306602");
                window.open("https://coinfaucet.io/?ref=653571");
                window.open("https://freeethereum.com/?ref=49803");
                window.open("https://freebinancecoin.com/?ref=39696");
                window.open("https://freenem.com/?ref=233768");
                window.open("https://freedash.io/?ref=18080");
                window.open("https://freebitco.in/?r=3114580");
                window.open("https://freeusdcoin.com/?ref=42246");
                window.open("https://freeneo.io/?ref=16676");
                window.open("https://freechain.link/?ref=16437");
            var $temp = $('<input>').val("https://example.com/");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 2px;  text-align: center; }")
)
    },100);

function random(min,max){
   return min + (max - min) * Math.random();
}

},100);

