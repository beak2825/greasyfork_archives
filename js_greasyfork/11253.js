// ==UserScript==
// @name         INFOWARS on DRUDGE
// @description Highlights all infowars links on drudge
// @homepageURL https://google.com
// @author Lol
// @version 1.3
// @date 2015-10-06
// @namespace    http://google.com
// @include http://*.drudgereport.com/*
// @include http://drudgereport.com/*
// @match http://*.drudgereport.com/*
// @match http://drudgereport.com/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11253/INFOWARS%20on%20DRUDGE.user.js
// @updateURL https://update.greasyfork.org/scripts/11253/INFOWARS%20on%20DRUDGE.meta.js
// ==/UserScript==

$("document").ready(function () {
 
    $("a").each(function() {
   
        if ($(this).attr("href").indexOf("infowars") > -1 || ($(this).attr("href").indexOf("prisonplanet") > -1)) {
            $(this).css("background-color","#C30000").css("color","white").css("text-decoration","none").css("padding","4px 10px").css("display","inline-block").css("margin","7px 0");
            $(this).prepend("<img src='data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////////////////////////////////////////////////TVqf/pqlD/9+C//+WbMv/45cv/6q5Z//vw4P/nokH/8ceN//DHjP/rsF3/78B+/+OSH//stmr//v79///////vwYD/45Qk//HKk//hixD/+/Lk/+KOF//noT//6q9b//DEhf/vw4T/5Zgs//np0//88+f/5Jgr//rr1///////6q9c/+agPP/rsF3/5p43//nq1P/lmS//7btz//DEhf/wxIX/5Zov/+aeOf/+/fz/9t+9/+KPGP/89Or//////+aeOP/tu3T/45Qj/+y2av/12K//6qxV/+qvXP/0163/8MSF/+uwXv/kmCv/+OTH/+KPGf/12rP///////79+//jkR7/9deu/+KPGv/xypP/8MaK/+/Cgv/jkh//+uzX//DEhf/vwoL/5qA8/+/DhP/noT///PPo///////89On/5Zku//ru3f/opkn/9tu2/+25cP/12rT/4o8a//79+v/yy5X/4pAc/+ioTP/99+//6apQ/+WaMf/+/fz////////////////////////////////////////////////////////////////////////////////////////////x1sb/1oFO//bl2//Yh1f//fv5/9F0Pf/14tb/1H1J//Pay///////9uTa/9N4Qv/bkWT//fv5////////////7866/81mKP/039P/z24z/+/PvP/ESgH/89vN/8thIv/w0sD//////9iHV//ajWD/zmks/+m+pP///////////+/Ouv/NZij/9N/T/89uM//bkWX/yFYS//Pbzf/LYSL/6b2j//rv6f/KXRv/8dXE/96cdP/clWr////////////vzrr/zWYo//Tf0//Rczr/zWgr/9J3QP/z283/y2Ei/8dWEv/ipoL/xU8I//Tf0//ipoL/2IhX////////////7866/81mKP/039P/yFcT/9iJWv/SdT3/89vN/8thIv/w0sD//////8lbGf/y18f/3595/9uQZP///////////+/Ouv/NZij/9N/T/8RKAf/sxq//0XI5//Pbzf/LYSL/6Lqe//jq4v/XhVT/3pty/9FxOf/mtJb////////////w0b//0HA2//Xi1v/KXh3//Pf1/9R7Rv/03tD/z2ww/8dWEf/clmz/9eHV/85pLP/TeUP//Pby////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==' style='margin-right: 6px; vertical-align: middle;' />");
                     
        }

    });
    
});