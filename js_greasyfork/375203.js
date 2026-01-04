// ==UserScript==
// @name         巴哈姆特之收藏前確認
// @description  為了我每次都手殘點到收藏的朋友而做，可以防止誤觸收藏按鈕。
// @namespace    nathan60107
// @version      1.6
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      https://forum.gamer.com.tw/C*
// @include      https://home.gamer.com.tw/bahawall.php?*
// @include      *.gamer.com.tw/singleACMsg.php*
// @include      https://guild.gamer.com.tw/guild.php*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/375203/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E6%94%B6%E8%97%8F%E5%89%8D%E7%A2%BA%E8%AA%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/375203/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E6%94%B6%E8%97%8F%E5%89%8D%E7%A2%BA%E8%AA%8D.meta.js
// ==/UserScript==

(function() {
    if(location.href.match("https://forum.gamer.com.tw/C")!=null){
        let newFunc = FORUM_homeBookmark.toString();
        newFunc = newFunc.replace(`function FORUM_homeBookmark(area,bsn,sn,atitle,dc1,dc2,dtype,dmachine,dname){`, `function FORUM_homeBookmark(area,bsn,sn,atitle,dc1,dc2,dtype,dmachine,dname){Dialogify.confirm('確定要收藏?',{ok: function(){`);
        newFunc = newFunc.replace(`;return false}`, `;return false}})}`);
        FORUM_homeBookmark = new Function("return "+newFunc)();
    }else if(location.href.match("https://home.gamer.com.tw/bahawall.php")!=null || location.href.match(".gamer.com.tw/singleACMsg.php")!=null || location.href.match("https://guild.gamer.com.tw/guild.php")!=null){
        var newFunc = giveGPBP.toString();
        newFunc = newFunc.replace(`function giveGPBP(e,t){$`, `function giveGPBP(e,t){function postGBP(){$`);
        newFunc = newFunc.replace(`})}`, `})}
if (e == "GP") postGBP();
else if (e == "BP") Dialogify.confirm('確定要噓?', {
    ok: function(){postGBP();}
})}`);
        giveGPBP = new Function("return "+newFunc)();
    }
})();

