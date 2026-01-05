// ==UserScript==
// @name         Empowerment's Emotes for Unoeme
// @namespace    http://homofaggot.net/gottagofast
// @version      2.2
// @description  Memes
// @match        http://instasynch.com/rooms/unoeme
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/4222/Empowerment%27s%20Emotes%20for%20Unoeme.user.js
// @updateURL https://update.greasyfork.org/scripts/4222/Empowerment%27s%20Emotes%20for%20Unoeme.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
// $codes[""] = \'<img src="">\'; \


var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
        setTimeout(function(){ \
        $codes["bah"] = \'<img src="http://i.imgur.com/nc1vBjz.gif">\'; \
        $codes["panpizza"] = \'<img src="http://i.imgur.com/nUg60dw.gif">\'; \
        $codes["fedorareview"] = \'<img src="http://i.imgur.com/afLBt7S.png">\'; \
        $codes["idk"] = \'<img src="http://i.imgur.com/efVINSS.png">\'; \
        $codes["gofast"] = \'<img src="http://imgur.com/9RflOx4.gif">\'; \
        $codes["dodge"] = \'<img src="http://i.imgur.com/OplSYtW.gif">\'; \
        $codes["knishes"] = \'<img src="http://i.imgur.com/KK5hp4s.gif">\'; \
        $codes["skip"] = \'<img src="http://i.imgur.com/Y1JuG0V.gif">\'; \
        $codes["jewluminati"] = \'<img src="http://i.imgur.com/eyvrLfb.png">\'; \
	$codes["hump"] = \'<img src="http://i.imgur.com/nb984sW.gif" width="30" height="65">\'; \
	$codes["gaben"] = \'<img src="http://i.imgur.com/T5SCh.gif">\'; \
	$codes["euphoria"] = \'<img src="http://puu.sh/41mMg.gif" width="65" height="48">\'; \
	$codes["snoopgirls"] = \'<img src="http://puu.sh/41mQ5.gif" width="85" height="55">\'; \
	$codes["boom"] = \'<img src="http://i.imgur.com/7aPS45l.gif" width="42" height="60">\'; \
	$codes["420"] = \'<img src="http://i.imgur.com/n41tcFI.gif" width="60" height="60">\'; \
	$codes["bluesclues"] = \'<img src="http://i.imgur.com/Na1Wipn.gif">\'; \
	$codes["skeldance"] = \'<img src="http://i.imgur.com/KBautE4.gif">\'; \
	$codes["$"] = \'<img src="http://i.imgur.com/jXNLf0x.png">\'; \
	$codes["joint"] = \'<img src="http://i.imgur.com/zAjMzqy.png">\'; \
	$codes["bong"] = \'<img src="http://i.imgur.com/A5XTIJf.png">\'; \
	$codes["dealwithit"] = \'<img src="http://i.imgur.com/KMBWmUt.png">\'; \
	$codes["franklin"] = \'<img src="http://i.imgur.com/3nywBSo.png">\'; \
	$codes["doritos"] = \'<img src="http://i.imgur.com/qH7KS64.png">\'; \
	$codes["faze"] = \'<img src="http://i.imgur.com/Z1t0aKy.png">\'; \
	$codes["fedora"] = \'<img src="http://i.imgur.com/FUX6ALD.png">\'; \
	$codes["hitmarker"] = \'<img src="http://i.imgur.com/OD8uyNT.png" width="30" height="30">\'; \
	$codes["lenny"] = \'<img src="http://i.imgur.com/7lcdF1C.png">\'; \
	$codes["lensflare"] = \'<img src="http://i.imgur.com/OvpMpYs.png">\'; \
	$codes["marijuana"] = \'<img src="http://i.imgur.com/7W9otgH.png">\'; \
	$codes["mlg"] = \'<img src="http://i.imgur.com/tmGr1eL.png">\'; \
	$codes["mtndew"] = \'<img src="http://i.imgur.com/jAtwTy2.png">\'; \
	$codes["optic"] = \'<img src="http://i.imgur.com/UoA7Qu7.png">\'; \
	$codes["sampletext"] = \'<img src="http://i.imgur.com/F4VMSYu.png">\'; \
	$codes["shrek2"] = \'<img src="http://i.imgur.com/upYCF26.png">\'; \
	$codes["stepitup"] = \'<img src="http://i.imgur.com/JyOvgJD.png">\'; \
	$codes["shrek"] = \'<img src="http://i.imgur.com/dfVfsVO.png">\'; \
	$codes["fedosnoop"] = \'<img src="http://i.imgur.com/rLE0Dtm.png">\'; \
	$codes["bigsnoop"] = \'<img src="http://i.imgur.com/FHhEHHX.png">\'; \
	$codes["swag"] = \'<img src="http://i.imgur.com/wvRJpVJ.png">\'; \
	$codes["wam"] = \'<img src="http://i.imgur.com/8rMVYj6.png">\'; \
	$codes["sickwobs"] = \'<img src="http://i.imgur.com/GqjaBke.png">\'; \
	$codes["wow"] = \'<img src="http://i.imgur.com/lmEBW4b.gif">\'; \
	$codes["pussy"] = \'<img src="http://i.imgur.com/jbtdq0H.gif">\'; \
	$codes["quickscope"] = \'<img src="http://i.imgur.com/NsYbDB1.gif">\'; \
	$codes["horn"] = \'<img src="http://i.imgur.com/KywkuJ2.gif">\'; \
	$codes["swamp"] = \'<img src="http://i.imgur.com/ar6evhQ.gif">\'; \
	$codes["wombo"] = \'<img src="http://i.imgur.com/aHlQ03w.gif">\'; \
	$codes["navy"] = \'<img src="http://i.imgur.com/O8Id2TQ.gif">\'; \
	$codes["greenfrog"] = \'<img src="http://i.imgur.com/aX4drns.gif" width="60" height="44">\'; \
	$codes["browfrog"] = \'<img src="http://i.imgur.com/3Aiun1n.gif" width="60" height="44">\'; \
	$codes["dealfrog"] = \'<img src="http://i.imgur.com/cm7WGLQ.gif" width="60" height="44">\'; \
	$codes["camera"] = \'<img src="http://i.imgur.com/VXQjurI.png" width="62" height="60">\'; \
	$codes["brazzers"] = \'<img src="http://i.imgur.com/YaNg5Ji.jpg">\'; \
	$codes["tesco"] = \'<img src="http://i.imgur.com/aLrl5vI.jpg">\'; \
	$codes["anigay"] = \'<img src="http://i.imgur.com/WBNm8pb.gif">\'; \
        $codes["itsatrap"] = \'<img src="http://i.imgur.com/y2qRSHY.jpg">\'; \
        $codes["getrekt"] = \'<img src="http://i.imgur.com/E9Oy0oV.gif">\'; \
        $codes["plsno"] = \'<img src="http://i.imgur.com/EFG3htP.gif">\'; \
        $codes["tape"] = \'<img src="http://i.imgur.com/Kt1DZ2J.gif">\'; \
        $codes["venus"] = \'<img src="http://i.imgur.com/8w26s0a.gif">\'; \
        }, 1500);'
        ;
 
document.body.appendChild(script);