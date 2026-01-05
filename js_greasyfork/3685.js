// ==UserScript==
// @name       montage parodies emotes
// @namespace  http://www.shrekisdreck.com
// @version    8.4208145317
// @description  Mlg emotes
// @match      http://instasynch.com/rooms/montageparodies
// @grant none
// @copyright  2014+, Urmom
// @downloadURL https://update.greasyfork.org/scripts/3685/montage%20parodies%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/3685/montage%20parodies%20emotes.meta.js
// ==/UserScript==

//Thanks to froggyfrog for the basics of this script

var mlg = document.createElement('script');
mlg.setAttribute("type", "application/javascript");
mlg.textContent = 'setTimeout(function(){ \
	$codes["illuminati"] = \'<img src="http://i.imgur.com/eyvrLfb.png">\'; \
	$codes["hump"] = \'<img src="http://i.imgur.com/nb984sW.gif" width="30" height="65">\'; \
	$codes["dewritos"] = \'<img src="http://i.imgur.com/GWYXYBp.gif">\'; \
	$codes["2spooky"] = \'<img src="http://i.imgur.com/VN8Gn.gif">\'; \
	$codes["gaben"] = \'<img src="http://i.imgur.com/T5SCh.gif">\'; \
	$codes["euphoric"] = \'<img src="http://puu.sh/41mMg.gif" width="65" height="48">\'; \
	$codes["snoopgirls"] = \'<img src="http://puu.sh/41mQ5.gif" width="85" height="55">\'; \
	$codes["boom"] = \'<img src="http://i.imgur.com/7aPS45l.gif" width="42" height="60">\'; \
	$codes["420"] = \'<img src="http://i.imgur.com/n41tcFI.gif" width="60" height="60">\'; \
	$codes["skeletons"] = \'<img src="http://i.imgur.com/QzBBZ1L.gif" width="73" height="55">\'; \
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
	document.body.style.fontFamily="Comic Sans MS, cursive, sans-serif"; \
	}, 1500);';
 
document.head.appendChild(mlg);