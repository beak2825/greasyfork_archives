// ==UserScript==
// @name         EvolutionScript-BT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Utilitie for EvolutionScript
// @author       Jose Enrique Ayala Villegas
// @match        http://*/*.php?view=surfer&t=*
// @match        http://*/index.php?view=ads
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23559/EvolutionScript-BT.user.js
// @updateURL https://update.greasyfork.org/scripts/23559/EvolutionScript-BT.meta.js
// ==/UserScript==
if(localStorage.getItem('imgs') === null) {localStorage.setItem('imgs',',');}
var iframeClicked = false;
function naturalClick(targetNode){
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
getImgCode =function(img,obj){
    var can = document.createElement('canvas');
    var ctx = can.getContext('2d');
    can.width = 50;
    can.height = 50;
    ctx.drawImage(img,(obj[0]==="0")?0:(obj[0]-50),obj[1],obj[2],obj[3],0,0,50,50);
    return can.toDataURL().replace("data:image/png;base64,",'');
};

getImg = function(i){
                     var can = document.createElement('canvas');
                     var ctx = can.getContext('2d');
                     can.width = 50;
                     can.height = 50;
                     ctx.drawImage($('img[usemap="#Map"]')[0],i*50,0,50,50,0,0,50,50);
                     return can.toDataURL().replace("data:image/png;base64,","");
                    };

found = function(){
                   for(var i=0;i<=5;i++){
                       if(localStorage.getItem('imgs').split(',').indexOf(getImgCode($('img[usemap="#Map"]')[0],$('area')[i].coords.split(",")))!=-1)
                           return i;
                   }
                   return -1;
                  };

saveImg = function(obj){
                        var tmp = localStorage.getItem('imgs').split(',');
                        tmp[tmp.length] = getImgCode($('img[usemap="#Map"]')[0],obj.coords.split(","));
                        localStorage.setItem('imgs',tmp);
                        setTimeout(function(){location.href = location.origin + "/" + "index.php?view=ads";},2000);
                       };

veri = function(){
    if(found() != -1){
        var tR = Math.floor(Math.random() * 1000) + 500;
        setTimeout(function(){naturalClick($('area')[found()]);},tR);
        waitVerifi();
    } else {
        $('area').each(function(e){
            this.setAttribute('onclick','saveImg(this);'+this.getAttribute('onclick'));
        });
    }
};

waitVerifi = function(){
    if($('.successbox').length){
        setTimeout(function(){location.href = location.origin + "/" + "index.php?view=ads";},1000);
    } else {
        setTimeout(waitVerifi,1000);
    }
};
waitLoad = function(){
                      if(vnumbers.style.display == "none"){declareAll();setTimeout(waitLoad,1000);} else {
                          setTimeout(function(){veri();},1000);
                      }
                     };
if($('iframe').length > 0 && !iframeClicked){
    try{$('iframe')[0].onload();$('iframe')[0].remove();iframeClicked=true;}catch(e){iframeClicked=true;}
}
if(location.href.indexOf("index.php?view=ads") != -1){
    setTimeout(function(){hacer();},1000);
} else {
    waitLoad();
}
function declareAll(){
    upp = function(){
        var w=window;
        var d=document;

        if( $.browser.opera ){
            var opversion = window.opera.version ();
            if(opversion < 11){
                $(d).focus(function(){lwf=1;}).blur(function(){lwf=1;});
            }else{
                $(w).focus(function(){wo=1;}).blur(function(){wo=1;});
                lwf=((typeof w.hasFocus!='undefined'?w.hasFocus():wo)?1:1);
            }
        }else{
            lwf=((typeof d.hasFocus!='undefined'?d.hasFocus():wf)?1:1);
        }
        if(lwf == 1){
            $("#focusoff").remove();
            if(adloaded !== true){
                $(".adwait").show();
            }
            $("#progress").show();
            $(".errorbox").show();
            $(".successbox").show();
            $("#progressbar").link2progress(secs, function(){
                endprogress('');
            });
        }else{
            $("#progressbar").link2pause();
            $(".adwait").hide();
            $("#progress").hide();
            $(".errorbox").hide();
            $(".successbox").hide();
            if($("#focusoff").length <=0){
                $("#surfbar").append('<div id="focusoff">You need to keep this advert on focus to get credit<br /><a href=javascript:void(0); style=font-size:13px>Please click here to continue</a></span></div>');
            }
        }
    };
    return true;
}

function hacer(){
    try{clearTimeout(dd);}catch(e){}
    dd = setTimeout(function(){
        try{
            ad = $('span[class="pointer"]').filter(function(){
                var price = 1;
                try{price = parseFloat(($(".ad-footer",this.parentElement.parentElement)[0].textContent.indexOf('-')==-1)?1:0);
                   }catch(e){}
                var k=this.parentElement.parentElement.className.indexOf("disabled");
                var j=this.parentElement.parentElement.style.display;
                var s=$('div[class="fads-block disabled"]',this);
                return (k==-1 &&j!="none" && s.length === 0 && price > 0);
            })[0];
            location.href = document.origin+"/"+ad.onclick.toString().split("'")[1];}catch(e){
                view_fixedad = function (url){
                    location.href=url;
                };
                view_ad = view_fixedad;
                window.open = view_ad;
                ad.click();

            }

    },1000);
}

olvidar = function(){
    localStorage.imgs=localStorage.imgs.substring(0,localStorage.imgs.lastIndexOf(','))[localStorage.imgs.substring(0,localStorage.imgs.lastIndexOf(',')).length-1];
};

olvidarN = function(i){
    var arr = localStorage.imgs.split(',');
    arr.forEach(function(e,ii){
        if(ii==i) arr.splice(ii,1);
    });
    localStorage.imgs = arr.toString();
};