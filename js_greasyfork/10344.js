// ==UserScript==
// @name         emojies for /kek/
// @namespace    https://greasyfork.org/en/scripts/bullshitmemes/
// @version      22.889
// @description  fucking bullshit
// @match        https://plug.dj/*
// @grant        none
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/10344/emojies%20for%20kek.user.js
// @updateURL https://update.greasyfork.org/scripts/10344/emojies%20for%20kek.meta.js
// ==/UserScript==
 
//{ src:"", width:, height:, title:''},
 
var emotes = [

    { src:"http://i.imgur.com/TGHRo8W.gif", width:70, height:70, title:'chen'},
    { src:"http://i.imgur.com/MSoQrxX.gif", width:70, height:70, title:'gigachen'},
    { src:"http://i.imgur.com/S417M86.gif", width:70, height:70, title:'buttjuice'},
    { src:"http://i.imgur.com/XoLNR8o.png", width:70, height:70, title:'rude'},
    { src:"http://i.imgur.com/HOdSCiN.gif", width:70, height:70, title:'laughinganime'},
    { src:"http://i.imgur.com/hyJ3wFH.gif", width:70, height:70, title:'dancingalien'},  
    { src:"http://i.imgur.com/SvDjLlY.png", width:70, height:70, title:'wew'},
    { src:"http://i.imgur.com/wAVQL4D.gif", width:70, height:70, title:'wop'},
    { src:"http://i.imgur.com/QCxdQJA.gif", width:70, height:70, title:'miku'},
    { src:"http://i.imgur.com/T1zHDxZ.gif", width:70, height:70, title:'duane'},
    { src:"http://i.imgur.com/7AyGv1a.gif", width:70, height:70, title:'ayylmao'},
    { src:"http://i.imgur.com/BZ3WF.png", width:70, height:70, title:'feelsgud'},
    { src:"http://i.imgur.com/Xa8Xb64.png", width:70, height:70, title:'rip'},
    { src:"http://i.imgur.com/MMdhwkH.gif", width:70, height:70, title:'sad'},
    { src:"http://i.imgur.com/asSh8VE.png", width:70, height:70, title:'reddit'},
    { src:"http://i.imgur.com/ItPkGqJ.gif", width:70, height:70, title:'data'},
    { src:"http://i.imgur.com/FLWIZRu.gif", width:70, height:70, title:'jew'},
    { src:"http://i.imgur.com/qnNGDHs.gif", width:70, height:70, title:'doot'},
    { src:"http://i.imgur.com/4wunBBM.png", width:70, height:70, title:'slut'},
    { src:"http://i.imgur.com/Gx5wmqn.gif", width:70, height:70, title:'wow'},
    { src:"http://i.imgur.com/nfDwcil.png", width:70, height:70, title:'mymomiscool'},
    { src:"http://i.imgur.com/CQqW3YQ.gif", width:60, height:70, title:'dance'},
    { src:"http://i.imgur.com/4cksbbU.gif", width:70, height:70, title:'brobill'},
    { src:"http://i.imgur.com/Xb0UA5e.gif", width:70, height:70, title:'burd'},
    { src:"http://i.imgur.com/3jIEzie.gif", width:70, height:70, title:'happening'},
    { src:"https://i.areyoucereal.com/HGbLpu.gif", width:70, height:70, title:'snoop'},
    { src:"http://i.imgur.com/L7aL3gD.jpg", width:70, height:70, title:'tfw'},
    { src:"http://i.imgur.com/og9In6D.png", width:70, height:70, title:'feelsmug'},
    { src:"http://i.imgur.com/52FF0aK.gif", width:70, height:70, title:'moonman'},
    { src:"http://i.imgur.com/PH339IV.gif", width:70, height:70, title:'cena'},
    { src:"http://i.imgur.com/pKXZaQM.gif", width:70, height:70, title:'monkey2'},
    { src:"http://i.imgur.com/FXmuLOs.gif", width:70, height:70, title:'bustin'},
    { src:"http://i.imgur.com/EOW60AQ.gif", width:70, height:70, title:'sonic2'},
    { src:"http://i.imgur.com/uTUjZpq.png", width:70, height:70, title:'feelsscared'},
    { src:"http://i.imgur.com/O9nDRKJ.gif", width:70, height:70, title:'bravo'},
    { src:"http://i.imgur.com/copQXrP.gif", width:70, height:70, title:'kfc'},
    { src:"http://i.imgur.com/0NFfYFq.gif", width:70, height:70, title:'^'},
    { src:"http://i.imgur.com/RpznRYJ.gif", width:70, height:70, title:'yee'},
    { src:"http://i.imgur.com/ZEE0jZF.gif", width:70, height:70, title:'diddy'},
    { src:"http://i.imgur.com/uDUO8Nw.gif", width:70, height:70, title:'freedum'},
    { src:"http://i.imgur.com/NiMJaW6.png", width:70, height:70, title:'kappa'},
    { src:"http://i.imgur.com/RoQiAtP.png", width:70, height:70, title:'expanddong'},
    { src:"http://i.imgur.com/8WGVGYh.gif", width:70, height:70, title:'cyrax'},
    { src:"http://i.imgur.com/pYdjf10.jpg", width:70, height:70, title:'cec'},
    { src:"http://i.imgur.com/7AyGv1a.gif", width:70, height:70, title:'ayylmao'},
    { src:"http://i.imgur.com/fNkI3M5.gif", width:70, height:70, title:'gigalien'},
    { src:"http://i.imgur.com/RgnpAPE.gif", width:70, height:70, title:'ayylien'},
    { src:"http://i.imgur.com/jBji5uc.gif", width:70, height:70, title:'alien2'},
    { src:"http://i.imgur.com/1ZAz974.jpg", width:70, height:70, title:'jimmies'},
    { src:"http://i.imgur.com/4zsobUd.png", width:70, height:70, title:'disgusting'},
    { src:"http://i.imgur.com/TvtnuqI.gif", width:70, height:70, title:'yes'},
    { src:"http://i.imgur.com/QZ4qCEE.gif", width:70, height:70, title:'calcium'},
    { src:"http://i.imgur.com/MK3AsBi.gif", width:70, height:70, title:'topkek'},
    { src:"http://i.imgur.com/5pDD0HW.gif", width:70, height:70, title:'snab'},
    { src:"http://i.imgur.com/DxlIunk.png", width:70, height:70, title:'sweat'},
    { src:"http://i.imgur.com/EWhvuNJ.png", width:70, height:70, title:'whores'},
    { src:"http://i.imgur.com/qzKaSUr.png", width:70, height:70, title:'333'},
    { src:"http://i.imgur.com/lK4AELc.jpg", width:70, height:70, title:'lebanana'},
    { src:"http://i.imgur.com/jhuvqTo.gif", width:70, height:70, title:'pull'},
    { src:"http://i.imgur.com/WMwbr7n.gif", width:70, height:70, title:'push2'},
    { src:"http://i.imgur.com/b3ex5cx.png", width:70, height:70, title:'riptheskin'},
    { src:"http://i.imgur.com/oDLeCCu.gif", width:70, height:70, title:'iamthesun'},
    { src:"http://i.imgur.com/GI19OKs.png", width:70, height:70, title:'sanic2'},
    { src:"http://i.imgur.com/34vCnqr.gif", width:70, height:70, title:'neat'},
    { src:"http://i.imgur.com/Wwk7Ce2.jpg", width:70, height:70, title:'haruka'},
    { src:"http://i.imgur.com/wAVQL4D.gif", width:70, height:70, title:'wop'},
    { src:"http://i.imgur.com/kXXQOwq.png", width:70, height:70, title:'modabuse'},
    { src:"http://i.imgur.com/JIqXkac.png", width:70, height:70, title:'feelssuicidal'},
    { src:"http://i.imgur.com/zR8xP2G.png", width:70, height:70, title:'feelsmadman'},
    { src:"http://i.imgur.com/zR8xP2G.png", width:70, height:70, title:'feelsmad'},
    { src:"http://i.imgur.com/byEQnHn.png", width:70, height:70, title:'lewd'},
    { src:"http://i.imgur.com/5FtdsyK.gif", width:70, height:70, title:'lewd2'},
    { src:"http://i.imgur.com/SCpPihV.gif", width:70, height:70, title:'smuganime'},
    { src:"http://i.imgur.com/2OmBZZU.gif", width:70, height:70, title:'anime'},
    { src:"http://i.imgur.com/pJznstY.jpg", width:70, height:70, title:'birthday'},
    { src:"http://i.imgur.com/qhJ9UBE.gif", width:70, height:70, title:'blink'},
    { src:"http://i.imgur.com/i807n8q.gif", width:70, height:70, title:'gigashark'},
    { src:"http://i.imgur.com/Uv3e0UT.gif", width:70, height:70, title:'hibiki'},
    { src:"http://i.imgur.com/r8LzdsE.jpg", width:70, height:70, title:'doge'},
    { src:"http://i.imgur.com/d6lNkQR.gif", width:70, height:70, title:'lewd3'},
    { src:"http://i.imgur.com/sccZ18t.gif", width:70, height:70, title:'nyah'},
    { src:"http://i.imgur.com/rcIWIzw.gif", width:70, height:70, title:'nyah2'},
    { src:"http://i.imgur.com/zZzW3S2.gif", width:70,height:70, title:'awoo'},
    { src:"http://i.imgur.com/UlMUlsR.jpg", width:70, height:70, title:'rage'},
    { src:"http://i.imgur.com/mPYJxxt.gif", width:70, height:70, title:'shark'},
    { src:"http://i.imgur.com/iFvF8q0.gif", width:70, height:70, title:'spam'},
    { src:"http://i.imgur.com/cIOR35M.gif", width:70, height:70, title:'lean'},
    { src:"http://i.imgur.com/K3xERS2.png", width:70, height:70, title:'pomf'},
    { src:"http://i.imgur.com/fP7bAxr.gif", width:70, height:70, title:'ballin'},
    { src:"http://i.imgur.com/AJv1S35.gif", width:70, height:70, title:'n64'},
    { src:"http://i.imgur.com/hUvNXZS.gif", width:70, height:70, title:'rekt'},
    { src:"http://i.imgur.com/6UEZ2ar.gif", width:70, height:70, title:'shy'},
    { src:"http://i.imgur.com/6HbdRYv.gif", width:70, height:70, title:'mememe2'},
    { src:"http://i.imgur.com/TC093Pp.gif", width:70, height:70, title:'oo'},
    { src:"http://i.imgur.com/nANdISW.gif", width:70, height:70, title:'hi'},
    { src:"http://i.imgur.com/ZxPeCI7.jpg", width:70, height:70, title:'ree'},
    { src:"http://i.imgur.com/vRgXgKd.gif", width:70, height:70, title:'chen4'},
    { src:"http://i.imgur.com/4qf8zh3.gif", width:70, height:70, title:'wop2'},
    { src:"http://i.imgur.com/FH5Y7Ni.gif", width:70, height:70, title:'ps'},
    { src:"http://i.imgur.com/WlYMFRt.gif", width:70, height:70, title:'doit'},
    { src:"http://i.imgur.com/vETtK.png", width:70, height:70, title:'myfuckingsides'},
    { src:"http://i.imgur.com/NpUPZSn.gif", width:70, height:70, title:'cirno'},
    { src:"http://i.imgur.com/D2kvAo7.gif", width:70, height:70, title:'bye'},
    { src:"http://i.imgur.com/LXaCgmO.png", width:70, height:70, title:'john'},
    { src:"http://i.imgur.com/pd3vXcV.gif", width:70, height:70, title:'spin'},
    { src:"http://i.imgur.com/9M40dsy.png", width:70, height:70, title:'kojima'},
    { src:"http://i.imgur.com/09TQ5oP.png", width:70, height:70, title:'notbad'},
    { src:"http://i.imgur.com/78w0OiM.gif", width:70, height:70, title:'awoo2'},
    { src:"http://i.imgur.com/r5T9ym7.gif", width:70, height:70, title:'ken'},
    { src:"http://i.imgur.com/tGenRHO.gif", width:70, height:70, title:'brushie'},
    { src:"http://i.imgur.com/iADPISq.gif", width:70, height:70, title:'4u'},
    { src:"http://i.imgur.com/80nVcmr.gif", width:70, height:70, title:'fukkireta'},
    { src:"http://i.imgur.com/20tobXF.gif", width:70, height:70, title:'feelsgooddance'},
    { src:"http://i.imgur.com/de9cG0t.gif", width:70, height:70, title:'corey'},
    { src:"http://i.imgur.com/omaV2Sh.png", width:70, height:70, title:'suicide'},
    { src:"http://i.imgur.com/sRGs7fK.gif", width:70, height:70, title:'cia'},
    { src:"http://i.imgur.com/KY2BoER.gif", width:70, height:70, title:'freshest'},
    { src:"http://i.imgur.com/enkUqvD.jpg", width:70, height:70, title:'kek'},
    { src:"http://i.imgur.com/2lLwIeh.jpg", width:70, height:70, title:'ebin'},
    { src:"http://i.imgur.com/zKGfvlb.gif", width:70, height:70, title:'froge'},
    { src:"http://i.imgur.com/cfCxocI.png", width:80, height:80, title:'lel'},
    { src:"http://i.imgur.com/FPoO5KE.png", width:80, height:80, title:'feel'},
    { src:"http://i.imgur.com/QZHrYRY.jpg", width:80, height:80, title:'lestickyman'},
    { src:"http://i.imgur.com/iL1JBid.png", width:80, height:80, title:'snowcone'},
    { src:"http://i.imgur.com/YoCkYHi.jpg", width:80, height:80, title:'no'},
    { src:"http://i.imgur.com/LWhriYX.gif", width:80, height:80, title:'babyguitar'},
    { src:"http://i.imgur.com/7UuOf1V.png", width:80, height:80, title:'ass'},
    { src:"http://i.imgur.com/XYswg3L.png", width:80, height:80, title:'tangeruse'},
   
    ];

// Typically str.replace only checks the first instance so we need to pass in a regex.
// escapeRegExp deals with any special characters to make sure the substitution still works correctly.
// See http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function registerChatListener() {
  API.on(API.CHAT, function(event) {
    var lastmsg = $(".text.cid-" + event.cid).get(0);
    for (var i=0; i<emotes.length; i++) {    
       newhtml = '<img src="' + emotes[i].src + '" height=' + emotes[i].height + ' width=' + emotes[i].width + ' title=' + emotes[i].title + '>';
      lastmsg.innerHTML = replaceAll(lastmsg.innerHTML, ':'+emotes[i].title+':', newhtml);
    }
    // we put in a potentially big image so we need to scroll to the new bottom of the messages
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
  });
}
  
if (window.document.readyState === 'complete') {
  registerChatListener();
} else {
  window.addEventListener('load', registerChatListener, false);
}