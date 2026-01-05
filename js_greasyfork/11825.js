// ==UserScript==
// @name        Sponge Fourms Formatter
// @description A script to format posts Spongepowered forums
// @namespace   Thefdjurt.github.io
// @include     https://forums.spongepowered.org/t/*
// @version     1.34
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11825/Sponge%20Fourms%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/11825/Sponge%20Fourms%20Formatter.meta.js
// ==/UserScript==
var f;
var GET = function (URL, callback) {
    var request = new XMLHttpRequest(); request.onerror=function(){};
    request.open('GET', URL, true);
    request.send(null);
    request.onreadystatechange = function(){
        if (request.readyState==4) {
            if (typeof(callback) == "function"){
                callback(request,GET,f);
            }
        }
    };
};
var L=[
    "af", "ar", "ca", "cs", "da", "de", 
    "el", "en-GB", "en-PT", "en", "es-ES", "fi", 
    "fr-CA", "fr", "he", "hu", "it", "ja", 
    "ko", "nb", "nl", "no", "pl", "pt-BR", 
    "pt-PT", "ro", "ru", "sr", "sv-SE", "th", 
    "tr", "uk", "vi", "zh-CN", "zh-HK", "zh-TW"
];
var lang=(function(){
    var l = navigator.languages || [navigator.language];
    for (var i=0;i<l.length;i++){
        if (L.indexOf(l[i])>=0) return l[i];
    }
    return "en-GB"; //Only us 'murcians use color ;D
})();
var format = function(elem){
    f = elem;
    var html = elem.innerHTML.replace(/\\\[/g,"▌").replace(/\\\]/g,"▐");
    var ref = html.match(/(api|doc)\[(.*?)\]/gmi);
    for (var i=0;i<ref.length;i++){
        var v = ref[i].replace(/\▌/g,"[").replace(/\▐/g,"]");
        var s = v.substr(0,3),
            m = v.substring(4,v.length-1).replace(/\\\./g,"⬤").replace(/\./g,"/").replace(/\⬤/g,".");
        var t = (m.split("|")[1] || ((m!=="")? m.substring(m.lastIndexOf("/")+1): s));
        m = m.split("|")[0];
        if (s.toLowerCase()=="api"){
            if (m===""){
                elem.innerHTML = elem.innerHTML.replace(v,"<a href='https://spongepowered.github.io/SpongeAPI/'>"+t+"</a>");
                continue;
            }
            var h = "https://spongepowered.github.io/SpongeAPI/org/spongepowered/api/"+m;
            GET(h+".html",new Function("r","GET","f","\
            if (r.status==404){\
                GET('"+h+"/package-summary.html',function(r,GET,f){\
                    if (r.status!=404) f.innerHTML = f.innerHTML.replace('"+v+"','<a href=\"'+r.responseURL+'\">"+t+"</a>');\
                    else f.innerHTML = f.innerHTML.replace('"+v+"','<span style=\"color:#6E1010;\">"+v+"</span>');\
                });\
            } else {\
                f.innerHTML = f.innerHTML.replace('"+v+"','<a href=\"'+r.responseURL+'\">"+t+"</a>');\
            } if ("+i+"=="+ref.length+"){nt();}"));
    
        } else {
            var h = "https://docs.spongepowered.org/"+lang+"/"+m;
            GET(h+".html",new Function("r","GET","f","\
            if (r.status==404){\
                GET('"+h+"/index.html',function(r,GET,f){\
                    if (r.status!=404) f.innerHTML = f.innerHTML.replace('"+v+"','<a href=\"'+r.responseURL+'\">"+t+"</a>');\
                    else f.innerHTML = f.innerHTML.replace('"+v+"','<span style=\"color:#6E1010;\">"+v+"</span>');\
                });\
            } else {\
                f.innerHTML = f.innerHTML.replace('"+v+"','<a href=\"'+r.responseURL+'\">"+t+"</a>');\
            } if ("+i+"=="+ref.length+"){nt();}"));
        }
    }
};
setTimeout(function(){
    console.log("[Forumatter] Formatting the posts...");
    console.log("[Forumatter] Invalid URLs will throw 404s, so just ignore them :D")
    var cooked = document.querySelectorAll('.cooked');
    for (var n=0;n<cooked.length;n++){
        format(cooked[n]);
    }
}, 5);