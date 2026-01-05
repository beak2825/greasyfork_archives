// ==UserScript==
// @name         Other emotes oh who cares
// @namespace    http://firefox.had.tabs.first/
// @version      14.1
// @description  rip
// @match        http://instasync.com/r/shinyobama
// @match        http://instasync.com/r/Gyiyg_Wanabe
// @match        http://old.instasync.com/rooms/shinyobama
// @match        http://old.instasync.com/rooms/Gyiyg_Wanabe
// @grant        none
// @copyright    I stol this
// @downloadURL https://update.greasyfork.org/scripts/11036/Other%20emotes%20oh%20who%20cares.user.js
// @updateURL https://update.greasyfork.org/scripts/11036/Other%20emotes%20oh%20who%20cares.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
 
// emotes
// by
// Mike Stoklasa
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
        setTimeout(function(){ \
        $codes["cherry"] = \'<img src="http://i.imgur.com/LCJjeJu.png" width="80" height="80">\'; \
        $codes["senora"] = \'<img src="http://i.imgur.com/NHRPjCH.gif" width="63" height="105">\'; \
        $codes["video"] = \'<img src="http://i.imgur.com/TxSYx36.png" width="80" height="80">\'; \
        $codes["games"] = \'<img src="http://i.imgur.com/nP50huu.png" width="80" height="80">\'; \
        $codes["holdonlittleguy"] = \'<img src="http://i.imgur.com/ccQA2bZ.png" width="80" height="80">\'; \
        $codes["dog"] = \'<img src="http://i.imgur.com/BYIhHJH.jpg" width="80" height="80">\'; \
        $codes["meme"] = \'<img src="http://i.imgur.com/GzGsKh7.png" width="80" height="80">\'; \
        $codes["great"] = \'<img src="http://i.imgur.com/7tsSgHQ.jpg" width="80" height="80">\'; \
        $codes["horrifying"] = \'<img src="http://i.imgur.com/42y2oCa.png" width="90" height="68">\'; \
        $codes["tacticaldog"] = \'<img src="http://i.imgur.com/Eq9TRE0.png" width="80" height="80">\'; \
        $codes["postal3"] = \'<img src="http://i.imgur.com/G6yKiEi.png" width="96" height="32">\'; \
        $codes["sundowner"] = \'<img src="http://i.imgur.com/GuFZVba.png" width="80" height="67.36">\'; \
        $codes["snakeeater"] = \'<img src="http://i.imgur.com/ZIT2Bph.png" width="80" height="80">\'; \
        $codes["trash"] = \'<img src="http://i.imgur.com/pseH9FW.png" width="80" height="80">\'; \
        $codes["dickpic"] = \'<img src="http://i.imgur.com/DzlBzXn.jpg" width="108.76404494382022471910112359551" height="80">\'; \
        $codes["digimon"] = \'<img src="http://i.imgur.com/wbHUtH2.png" width="80" height="80">\'; \
        $codes["lucario"] = \'<img src="http://i.imgur.com/6GYuu1Y.png" width="80" height="80">\'; \
        $codes["clg"] = \'<img src="http://i.imgur.com/hJyskIz.png" width="80" height="80">\'; \
        $codes["hey_baby_ever_heard_of_spaghetti?"] = \'<img src="https://i.gyazo.com/6a52e843211c0bebd7081b0508b82f9a.png">\'; \
        $codes["bye"] = \'<img src="http://i.imgur.com/mXHGj9x.gif" width="80" height="80">\'; \
        $codes["anime"] = \'<img src="http://i.imgur.com/fBdg8Az.png" width="80" height="80">\'; \
        $codes["goatboy"] = \'<img src="http://i.imgur.com/67SupTv.png" width="80" height="80">\'; \
        $codes["asriel"] = \'<img src="http://i.imgur.com/TLTucua.png">\'; \
        $codes["booby"] = \'<img src="http://i.imgur.com/q6xU2xQ.png" width="80" height="80">\'; \
        $codes["FOREBODEN"] = \'<img src="http://i.imgur.com/2jkHUye.png" width="80" height="80">\'; \
        $codes["determination"] = \'<img src="http://i.imgur.com/IQ1mqFT.png" width="100" height=100">\'; \
        $codes["alphys"] = \'<img src="http://i.imgur.com/pVqZGkL.png" width="80" height=80">\'; \
        $codes["soul"] = \'<img src="http://i.imgur.com/aQClPdm.png">\'; \
        $codes["undyne"] = \'<img src="http://i.imgur.com/xLcVXH7.png" width="80" height=80">\'; \
        $codes["rawr"] = \'<img src="http://i.imgur.com/8q4Z9N7.png" width="80" height=80">\'; \
        $codes["confused"] = \'<img src="https://a.pomf.cat/xdhxlc.gif" width="50" height="68.2">\'; \
        $codes["furry"] = \'<img src="https://a.pomf.cat/zoctmp.png">\'; \
        $codes["witcher3"] = \'<img src="https://a.pomf.cat/agjqvu.png" width="80" height="80">\'; \
        $codes["doubledown"] = \'<img src="https://a.pomf.cat/kjgmhy.png" width="80" height="140">\'; \
        $codes["ye"] = \'<img src="https://a.pomf.cat/brsdhg.PNG" height="80">\'; \
        $codes["hug"] = \'<img src="https://a.pomf.cat/gjnxht.jpg" width="80">\'; \
        $codes["boss"] = \'<img src="https://a.pomf.cat/ymweyn.jpg" width="80">\'; \
        $codes["annotations"] = \'<img src="https://a.pomf.cat/lzlovz.png" width="80" height="80">\'; \
	}, 2000);'
        ;
document.body.appendChild(script);