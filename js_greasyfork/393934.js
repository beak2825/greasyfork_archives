// ==UserScript==
// @name         每天都要开心呀
// @namespace    http://www.jmwpower.top/
// @version      0.1
// @description  网页标题动态增加[开心的剪刀手小人脸]表情
// @author       Jmw-Power
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393934/%E6%AF%8F%E5%A4%A9%E9%83%BD%E8%A6%81%E5%BC%80%E5%BF%83%E5%91%80.user.js
// @updateURL https://update.greasyfork.org/scripts/393934/%E6%AF%8F%E5%A4%A9%E9%83%BD%E8%A6%81%E5%BC%80%E5%BF%83%E5%91%80.meta.js
// ==/UserScript==

(function() {
    var t = document.title ;
    var t01 = t + "♪♫¸（ >‿◠）✌";
    var t02 = t + "♪♫¸（⊙‿⊙）✌";
    var t03 = t + "♪♫¸（◠▽◠）✌";
    var t04 = t + "♪♫¸（ ô‿ô ） ✌";
    var t05 = t + "♪♫¸（͡° ʖ ͡°）✌";
    var t06 = t + "♪♫¸（͡ Ö‿Ö ） ✌";
    var t07 = t + "♪♫¸（＾▽＾）✌";
    var t08 = t + "♪♫¸（ •◡• ）✌";
    var t09 = t + "♪♫¸（ ¬‿¬ ）✌";
    var t10 = t + "♪♫¸（◉◡◉）✌";
    var t11 = t + "♪♫¸（◔◡◔）✌";
    var t12 = t + "♪♫¸（ˇωˇ）✌";
    var t13 = t + "♪♫¸（ô ◡ ô）✌";
    var t14 = t + "♪♫¸（∩▽∩）✌";
    var t15 = t + "♪♫¸（⊙△⊙）✌";
    var t16 = t + "♪♫¸（≧▽≦）✌";
    var t17 = t + "♪♫¸（ ^人^ ）✌";
    var t18 = t + "♪♫¸（°ω°）✌";
    var t19 = t + "♪♫¸（ˋωˊ）✌";
    var t20 = t + "♪♫¸（ˋ△ˊ）✌";
    var t21 = t + "♪♫¸（ˇ▽ˇ）✌";
    var t22 = t + "♪♫¸（°ο°）✌";
    var t23 = t + "♪♫¸（ˇ◡ˇ）✌";
    var t24 = t + "♪♫¸（ ⊙ʖ⊙）✌";
    var t25 = t + "♪♫¸（ˉ▽ˉ）✌";
    var t26 = t + "♪♫¸（￣□￣）✌";
    var myObj = {"title":[ t01,t02,t03,t04,t05,t06,t07,t08,t09,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20,t21,t22,t23,t24,t25,t26 ]}
    var x = myObj.title.length;
    var i = 0 ;
    function tit(){document.getElementsByTagName("title")[0].innerText = myObj.title[i];i++;if( i == x ){ i = 0 ;}setTimeout(function (){tit()}, 1000);}
    tit()
})();