// ==UserScript==
// @name         Rushnerd
// @namespace    http://use.i.E.your.homepage/
// @version      6.3
// @description  Custom Emotes
// @match        http://instasync.com/r/Rushnerd
// @match        http://instasync.com/r/rushnerd
// @match        http://old.instasync.com/rooms/Kululu
// @match        http://instasync.com/r/Kululu
// @match        http://old.instasync.com/rooms/Rushnerd
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/4558/Rushnerd.user.js
// @updateURL https://update.greasyfork.org/scripts/4558/Rushnerd.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
 
// emotes
// by
 
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
        setTimeout(function(){ \
        $codes["cod"] = \'<img src="http://i.imgur.com/A9cftkr.png" width="80" height="80">\'; \
        $codes["beer"] = \'<img src="http://i.imgur.com/PbjjZNH.jpg" width="80" height="80">\'; \
        $codes["reggie"] = \'<img src="http://i.imgur.com/6NTEerN.png" width="80" height="80">\'; \
        $codes["gabe"] = \'<img src="http://i.imgur.com/8Fl0LgE.png" width="80" height="80">\'; \
        $codes["lain"] = \'<img src="http://i.imgur.com/OiH6MLz.gif" width="80" height="80">\'; \
        $codes["high5"] = \'<img src="http://i.imgur.com/5HGqgOI.gif" width="80" height="80">\'; \
        $codes["happy"] = \'<img src="http://i.imgur.com/CFgU0Fg.jpg" width="80" height="80">\'; \
        $codes["coon"] = \'<img src="http://i.imgur.com/inPDtzG.jpg" width="80" height="80">\'; \
        $codes["sleep"] = \'<img src="http://i.imgur.com/I0PfIMI.png" width="80" height="80">\'; \
        $codes["fat"] = \'<img src="http://i.imgur.com/XVn1OVl.png" width="80" height="80">\'; \
        $codes["coonface"] = \'<img src="http://i.imgur.com/lTk4T9p.jpg" width="80" height="80">\'; \
        $codes["fap"] = \'<img src="http://i.imgur.com/qdc64WS.jpg" width="80" height="80">\'; \
        $codes["kiss"] = \'<img src="http://i.imgur.com/mPJYIjD.jpg" width="80" height="80">\'; \
        $codes["grin"] = \'<img src="http://i.imgur.com/NOV18ZB.gif" width="80" height="80">\'; \
        $codes["computer"] = \'<img src="http://i.imgur.com/h0WHExY.gif" width="80" height="80">\'; \
        $codes["bearsuit"] = \'<img src="http://i.imgur.com/WvNRaEy.gif" width="80" height="80">\'; \
        $codes["sanic"] = \'<img src="http://i.imgur.com/jzyAnhX.png" width="80" height="80">\'; \
        $codes["mysides"] = \'<img src="http://i.imgur.com/U5bwIzm.png" width="80" height="80">\'; \
        $codes["annoy"] = \'<img src="http://i.imgur.com/oFvTMnF.jpg" width="60" height="60">\'; \
        $codes["brock"] = \'<img src="http://i.imgur.com/b6YCnEh.jpg" width="80" height="80">\'; \
        $codes["datass"] = \'<img src="http://i.imgur.com/WyL1dCR.png" width="80" height="80">\'; \
        $codes["furry"] = \'<img src="http://i.imgur.com/HWTXJSz.png" width="140" height="80">\'; \
        $codes["umad"] = \'<img src="http://i.imgur.com/ev8HaOz.jpg" width="80" height="80">\'; \
        $codes["doge"] = \'<img src="http://i.imgur.com/iIcv9ot.jpg" width="80" height="80">\'; \
        $codes["bill"] = \'<img src="http://i.imgur.com/dXyz0WX.gif" width="80" height="80">\'; \
        $codes["usad"] = \'<img src="http://i.imgur.com/6TArzzc.jpg" width="80" height="80">\'; \
        $codes["roll"] = \'<img src="http://i.imgur.com/VUSUBRd.gif" width="80" height="80">\'; \
        $codes["eat"] = \'<img src="http://i.imgur.com/Ef5JYWO.gif" width="80" height="80">\'; \
        $codes["party"] = \'<img src="http://i.imgur.com/GLNQmF0.jpg" width="80" height="80">\'; \
        $codes["dance"] = \'<img src="http://i.imgur.com/0kSBnoU.gif" width="80" height="80">\'; \
        $codes["nom"] = \'<img src="http://i.imgur.com/Lx7I2t7.gif" width="80" height="80">\'; \
        $codes["carlton"] = \'<img src="http://i.imgur.com/u2L7kcT.gif" width="80" height="80">\'; \
        $codes["boogie"] = \'<img src="http://i.imgur.com/IEKY8eG.gif" width="80" height="80">\'; \
        $codes["merica"] = \'<img src="http://i.imgur.com/VPc6Hi0.jpg" width="80" height="80">\'; \
        $codes["facepalm"] = \'<img src="http://i.imgur.com/43tnPmj.jpg" width="80" height="80">\'; \
        $codes["facepaw"] = \'<img src="http://i.imgur.com/NkOQ7Fj.png" width="80" height="80">\'; \
        $codes["pika"] = \'<img src="http://i.imgur.com/AWQAM7c.png" width="80" height="80">\'; \
        $codes["wut"] = \'<img src="http://i.imgur.com/yk3wRAV.gif" width="80" height="80">\'; \
        $codes["scum"] = \'<img src="http://i.imgur.com/WXOF1Ma.png" width="80" height="80">\'; \
        $codes["420"] = \'<img src="http://i.imgur.com/RJzafu6.gif" width="80" height="80">\'; \
        $codes["panchi"] = \'<img src="http://i.imgur.com/b8u441e.gif" width="80" height="80">\'; \
        $codes["genie"] = \'<img src="http://i.imgur.com/Yh9Jqos.gif" width="80" height="80">\'; \
        $codes["what"] = \'<img src="http://i.imgur.com/2ULrUfU.gif" width="80" height="80">\'; \
        $codes["catdance"] = \'<img src="http://i.imgur.com/nxrszFS.gif" width="80" height="80">\'; \
        $codes["fail"] = \'<img src="http://i.imgur.com/a1m7bcB.gif" width="80" height="80">\'; \
        $codes["groove"] = \'<img src="http://i.imgur.com/nR4MwCJ.gif" width="80" height="80">\'; \
        $codes["sexymouse"] = \'<img src="http://i.imgur.com/FnkkrNI.gif" width="80" height="80">\'; \
        $codes["surprise"] = \'<img src="http://i.imgur.com/N86hquW.gif" width="80" height="80">\'; \
        $codes["ratdance"] = \'<img src="http://i.imgur.com/XwHuHzi.gif" width="80" height="80">\'; \
        $codes["frog"] = \'<img src="http://i.imgur.com/5AmA9ao.gif" width="80" height="80">\'; \
        $codes["hug"] = \'<img src="http://i.imgur.com/MBHsHF8.gif" width="80" height="80">\'; \
        $codes["rocket"] = \'<img src="http://i.imgur.com/oeqN7KJ.gif" width="80" height="80">\'; \
        $codes["mike"] = \'<img src="http://i.imgur.com/EKnllY9.png" width="80" height="80">\'; \
        $codes["rlm"] = \'<img src="http://i.imgur.com/BcsLfAJ.gif" width="80" height="80">\'; \
        $codes["evans"] = \'<img src="http://i.imgur.com/qUk3YlA.png" width="80" height="80">\'; \
        $codes["alien"] = \'<img src="http://i.imgur.com/lPGc98U.gif" width="80" height="80">\'; \
        $codes["donnie"] = \'<img src="http://i.imgur.com/vLSAfTo.gif" width="80" height="80">\'; \
        $codes["denny"] = \'<img src="http://i.imgur.com/rrZCPlw.gif" width="80" height="80">\'; \
        $codes["tearmeapart"] = \'<img src="http://i.imgur.com/J6wTB7o.gif" width="80" height="80">\'; \
        $codes["underwears"] = \'<img src="http://i.imgur.com/XECefbR.gif" width="80" height="80">\'; \
        $codes["mark"] = \'<img src="http://i.imgur.com/7JOaU3P.gif" width="80" height="80">\'; \
        $codes["lisa"] = \'<img src="http://i.imgur.com/87YEelJ.gif" width="80" height="80">\'; \
        $codes["drunklisa"] = \'<img src="http://i.imgur.com/Yb79Tv4.gif" width="80" height="80">\'; \
        $codes["ohhai"] = \'<img src="http://i.imgur.com/eIWQCfi.gif" width="80" height="80">\'; \
        $codes["football"] = \'<img src="http://i.imgur.com/adSrmSf.gif" width="80" height="80">\'; \
        $codes["chin"] = \'<img src="https://i.imgur.com/OyAGmB1.jpg" width="80" height="80">\'; \
        $codes["realca"] = \'<img src="https://i.imgur.com/8DNLJNq.jpg" width="80" height="80">\'; \
        $codes["becky"] = \'<img src="http://i.imgur.com/lb0Q3ys.gif" width="80" height="80">\'; \
        $codes["raven"] = \'<img src="http://i.imgur.com/arOQ4N8.png" width="80" height="80">\'; \
        $codes["york"] = \'<img src="http://i.imgur.com/ICSgZ7B.jpg" width="80" height="80">\'; \
        $codes["happyyork"] = \'<img src="http://i.imgur.com/LZKmQov.jpg" width="80" height="80">\'; \
        $codes["devo"] = \'<img src="http://i.imgur.com/PM7QLmG.jpg" width="80" height="80">\'; \
        $codes["ca"] = \'<img src="http://i.imgur.com/RdUwLUv.gif" width="80" height="80">\'; \
        $codes["ru"] = \'<img src="http://i.imgur.com/QzGNniV.jpg" width="80" height="80">\'; \
        $codes["tim"] = \'<img src="http://i.imgur.com/dczH8K7.gif" width="80" height="80">\'; \
        $codes["chicken"] = \'<img src="http://i.imgur.com/kx56UzU.gif" width="80" height="80">\'; \
        $codes["rotor"] = \'<img src="http://i.imgur.com/QHr4n33.gif" width="80" height="80">\'; \
        $codes["vacation"] = \'<img src="http://i.imgur.com/AJsUSRs.jpg" width="80" height="80">\'; \
        $codes["value"] = \'<img src="http://i.imgur.com/jn7BXCQ.gif" width="80" height="80">\'; \
        $codes["kill"] = \'<img src="http://i.imgur.com/bK3QeSv.gif" width="80" height="80">\'; \
        $codes["lewd"] = \'<img src="http://i.imgur.com/B46oV9w.gif" width="80" height="80">\'; \
        $codes["evansdance"] = \'<img src="http://i.imgur.com/NpG29vI.gif" width="80" height="80">\'; \
        $codes["toast"] = \'<img src="http://i.imgur.com/0wl6w4q.gif" width="100" height="80">\'; \
        $codes["starwars"] = \'<img src="http://i.imgur.com/X7o7pBv.gif" width="80" height="80">\'; \
        $codes["hoak"] = \'<img src="http://i.imgur.com/vX9tN07.gif" width="80" height="80">\'; \
        $codes["stare"] = \'<img src="http://i.imgur.com/upvYobM.gif" width="80" height="80">\'; \
        $codes["ninjaroll"] = \'<img src="http://i.imgur.com/ZQmQQCu.gif" width="80" height="80">\'; \
        $codes["confused"] = \'<img src="http://i.imgur.com/ZsrhKli.gif" width="80" height="80">\'; \
        $codes["traitor"] = \'<img src="http://i.imgur.com/qNSkrwT.gif" width="80" height="80">\'; \
        $codes["fire"] = \'<img src="http://i.imgur.com/3erSbOE.gif" width="80" height="80">\'; \
        $codes["dart"] = \'<img src="http://i.imgur.com/0QyReNe.gif" width="80" height="80">\'; \
        $codes["richevansmasturbatesadroid"] = \'<img src="http://i.imgur.com/QCY1rOj.gif" width="80" height="80">\'; \
        $codes["wwf"] = \'<img src="http://i.imgur.com/qv7ZNux.gif" width="80" height="80">\'; \
        $codes["rawraw"] = \'<img src="http://i.imgur.com/d6bTXdD.jpg" width="80" height="80">\'; \
        $codes["glad"] = \'<img src="http://i.imgur.com/gTnX20y.jpg" width="80" height="80">\'; \
        $codes["gay"] = \'<img src="http://i.imgur.com/Ga1GZ5M.png" width="80" height="80">\'; \
        $codes["munch"] = \'<img src="http://i.imgur.com/kAsMFe6.gif" width="80" height="80">\'; \
        $codes["gasp"] = \'<img src="http://i.imgur.com/xttJ7IP.jpg" width="80" height="80">\'; \
        $codes["hey"] = \'<img src="http://i.imgur.com/NA58POs.jpg" width="80" height="80">\'; \
        $codes["wwfhug"] = \'<img src="http://i.imgur.com/S79rB5A.gif" width="80" height="80">\'; \
        $codes["slimjim"] = \'<img src="http://i.imgur.com/sb1g5.gif" width="80" height="80">\'; \
        $codes["ubisoft"] = \'<img src="http://i.imgur.com/B0Rcne2.png" width="80" height="100">\'; \
        $codes["ms"] = \'<img src="http://i.imgur.com/89kPf4J.png" width="100" height="80">\'; \
        $codes["dew"] = \'<img src="http://i.imgur.com/V31cCg6.png" width="80" height="80">\'; \
        $codes["halo"] = \'<img src="http://i.imgur.com/HvnHjhB.png" width="80" height="80">\'; \
        $codes["sony"] = \'<img src="http://i.imgur.com/yQwUc5F.png" width="80" height="80">\'; \
        $codes["god"] = \'<img src="http://i.imgur.com/sHAjAc4.png" width="80" height="80">\'; \
        $codes["dbz"] = \'<img src="http://i.imgur.com/eSaP7hd.jpg" width="80" height="80">\'; \
        $codes["hell"] = \'<img src="http://i.imgur.com/mr5dGtI.gif" width="80" height="80">\'; \
        $codes["gun"] = \'<img src="http://i.imgur.com/FxCRNr2.gif" width="105" height="80">\'; \
        $codes["bozo"] = \'<img src="http://i.imgur.com/DOeTjN6.png" width="100" height="100">\'; \
        $codes["doink"] = \'<img src="http://i.imgur.com/2Nn7GCE.jpg" width="80" height="80">\'; \
        $codes["darksouls"] = \'<img src="http://i.imgur.com/zt6trLg.gif" width="130" height="80">\'; \
        $codes["nervous"] = \'<img src="http://i.imgur.com/lAS9v2k.gif" width="80" height="80">\'; \
        $codes["dress"] = \'<img src="http://i.imgur.com/S3MOrBk.jpg" width="87" height="80">\'; \
        $codes["nervous"] = \'<img src="http://i.imgur.com/lAS9v2k.gif" width="80" height="80">\'; \
        $codes["saiyan"] = \'<img src="http://i.imgur.com/1yVGGT6.gif" width="80" height="80">\'; \
        $codes["mic"] = \'<img src="http://i.imgur.com/WVow2J3.gif" width="80" height="80">\'; \
        $codes["booji"] = \'<img src="http://i.imgur.com/GVD5VBT.png" width="80" height="90">\'; \
        $codes["snake"] = \'<img src="http://i.imgur.com/EmSSeME.gif" width="130" height="80">\'; \
        $codes["pizza"] = \'<img src="http://i.imgur.com/WL1pkyz.gif" width="90" height="80">\'; \
        $codes["photo"] = \'<img src="http://i.imgur.com/epRtYwb.gif" width="130" height="80">\'; \
        $codes["skulls"] = \'<img src="http://i.imgur.com/sUT84sD.gif" width="90" height="80">\'; \
        $codes["walk"] = \'<img src="http://i.imgur.com/gPVA2cx.gif" width="90" height="80">\'; \
        $codes["bones"] = \'<img src="http://i.imgur.com/ZBDhvEJ.gif" width="90" height="80">\'; \
        $codes["skull"] = \'<img src="http://i.imgur.com/heQ7syv.gif" width="90" height="90">\'; \
        $codes["jam"] = \'<img src="http://i.imgur.com/48fQxe7.gif" tywidth="90" height="80">\'; \
        $codes["glasses"] = \'<img src="http://i.imgur.com/7E9GuT5.gif" tywidth="90" height="80">\'; \
        $codes["VR"] = \'<img src="http://i.imgur.com/YyseVHg.gif" tywidth="90" height="80">\'; \
        $codes["spook"] = \'<img src="http://i.imgur.com/C6BPwRL.gif" tywidth="90" height="80">\'; \
        $codes["grenade"] = \'<img src="http://i.imgur.com/pjeVv4k.gif" tywidth="90" height="80">\'; \
        $codes["oreo"] = \'<img src="http://i.imgur.com/Il1t6m4.png" tywidth="90" height="80">\'; \
        $codes["Rich"] = \'<img src="http://i.imgur.com/POpSypt.png" tywidth="90" height="80">\'; \
        $codes["drunk"] = \'<img src="http://i.imgur.com/XlBnuSG.png" tywidth="90" height="80">\'; \
        $codes["sandler"] = \'<img src="http://i.imgur.com/ezGQM6A.png" tywidth="90" height="80">\'; \
        $codes["rushnerd"] = \'<img src="http://i.imgur.com/PWfkmgL.jpg" tywidth="90" height="90">\'; \
        $codes["money"] = \'<img src="http://i.imgur.com/4yny1DN.jpg" tywidth="150" height="80">\'; \
        $codes["meth"] = \'<img src="http://i.imgur.com/BB4amBV.gif" tywidth="90" height="90">\'; \
        $codes["pokemon"] = \'<img src="http://i.imgur.com/PWFXJqf.gif" tywidth="90" height="90">\'; \
        $codes["weed"] = \'<img src="http://i.imgur.com/f8sdq.gif" tywidth="90" height="90">\'; \
        $codes["saul"] = \'<img src="http://i.imgur.com/ThbXd.gif" tywidth="90" height="90">\'; \
	}, 1500);'
        ;
document.body.appendChild(script);