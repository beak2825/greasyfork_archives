// ==UserScript==
// @match        https://*.reddit.com/*
// @name         reddditttrippperr
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  makes reddit text glow randomly and images and stuff hueshift and contrast increase stuff
// @author       liam g
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/387672/reddditttrippperr.user.js
// @updateURL https://update.greasyfork.org/scripts/387672/reddditttrippperr.meta.js
// ==/UserScript==

(function() {

    this.$ = this.jQuery = jQuery.noConflict(true);

    var xx=0;

    RANDOMIZE_SHIT();
    setTimeout(huerot, 1000);
    setTimeout(contrasta, 1000);
    setInterval($(".bBQgFn").css("width", "100%"), 1000);
    //setInterval($(".LxwR").css("width", "100%"), 500);
    //setInterval($(".LxwR").css("max-width", "100%"), 500);
    //setInterval($(".s60uip8-0.hyNbat").css("width", "100%"), 500);
    //setInterval($("._1vyLCp-v-tE5QvZovwrASa").css("max-width", "100%"), 500);

//$("SHORTCUT_FOCUSABLE_DIV > div.next > div > div['aria-hidden','false'] > ").css();
   // setInterval($("#overlayScrollContainer > div[tabindex='-1']").children().css("width", "100%"), 500);
//setInterval($("div#overlayScrollContainer").css("max-width", "10%"), 500);
   //setInterval($('div[data-test-id="post-content"]:parent:parent').css("max-width", "100%"), 500);

    var numv= {};
    for(var z = 0; z<9999; z++){
        numv[z]=666;
    }
    var sinew = 0;
    var ccc = Math.random();
    var cccc = Math.random();

    function huerot(){
        var cc = 0;
        //if(add){imagesVis[imgPushCount]=elementz;orderPushed[imgPushCount]=elementz;imgPushCount++;}else{imagesVis[imgPushCount]=}
        $("img").each(function(){if(numv[cc] != 666){ var rand4 = Math.floor(Math.random() * 50)+100;var rand3 = (Math.random() * 1); var rand1 = ((numv[cc]+(Math.floor(Math.random() * 2)+1)) % 360); }else{ rand1 = (Math.floor(Math.random() * 360)+180);} var $img = $(this); var filename = $img.attr('src'); $img.attr('style', 'filter:hue-rotate('+rand1+'deg) blur('+rand3+'px) saturate('+rand4+'%);'); cc++; numv[cc] = rand1;});
        var rand2 = Math.ceil((Math.random() * 150)+800);
        setTimeout(huerot, rand2);
    }
    var sinew360;
    function contrasta(){
        ccc=(ccc+0.002);
        if(ccc>3000000)ccc=0;
        cccc=(cccc+0.0025);
        if(cccc>3000000)cccc=0;

        sinew = Math.round(Math.abs(Math.sin(ccc)*150))+100;
        sinew360 = Math.round(Math.abs(Math.sin(cccc)*360));

        $("body").css("filter", "hue-rotate("+Math.round(sinew360)+"deg) contrast("+Math.round(sinew)+"%)");
        setTimeout(contrasta, 10);
    }

    function RANDOMIZE_SHIT(){
        var randomColor = {};
        var randomNum = {};
        var randomNum2 = {};
        var COOLcolors = ["#FF1493","#00BFFF","#FFD700","#DAA520","#ADFF2F","#008000","#FF00FF","#20B2AA","#800000","#7B68EE","#FF4500","#663399","#4169E1","#708090"];

        for(var rr = 0; rr<16; rr++){
            randomColor[rr] = COOLcolors[Math.floor(Math.random() * COOLcolors.length)];
        }

        for(var rrr = 0; rrr<16; rrr++){
            randomNum[rrr] = (Math.floor(Math.random() * 2)+1);
            randomNum2[rrr] = (Math.floor(Math.random() * 12)+3);
        }
        var rndNumSeconds = (Math.floor(Math.random() * 5)+1);
        function posDiff(ra){
            ra = 2;
            return Math.round((Math.random()*ra)-ra);
        }
        var randy = 0;//Math.floor(Math.random()*2);
        switch(randy){
            case 0:
                addGlobalStyle('.glow{-webkit-animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;-moz-animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;}@-webkit-keyframes glow{from{text-shadow: '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[0]+'px '+randomColor[0]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[1]+'px '+randomColor[1]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[2]+'px '+randomColor[2]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[3]+'px '+randomColor[3]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[4]+'px '+randomColor[4]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[5]+'px '+randomColor[5]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum[6]+'px'+randomColor[6]+';}to{text-shadow: '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[0]+'px '+randomColor[7]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[1]+'px '+randomColor[8]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[2]+'px '+randomColor[9]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[3]+'px '+randomColor[10]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[4]+'px '+randomColor[11]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[5]+'px '+randomColor[12]+', '+posDiff(2)+'px '+posDiff(2)+'px '+randomNum2[6]+'px'+randomColor[13]+';}}');
                break;
            case 1:
                addGlobalStyle('.glow{-webkit-animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;-moz-animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;}@-webkit-keyframes glow{from{text-shadow: 0 0 '+randomNum[0]+'px '+randomColor[0]+', 0 0 '+randomNum[1]+'px '+randomColor[1]+', 0 0 '+randomNum[2]+'px '+randomColor[2]+', 0 0 '+randomNum[3]+'px '+randomColor[3]+', 0 0 '+randomNum[4]+'px '+randomColor[4]+', 0 0 '+randomNum[5]+'px '+randomColor[5]+', 0 0 '+randomNum[6]+'px'+randomColor[6]+';}to{text-shadow: 0 0 '+randomNum2[0]+'px '+randomColor[7]+', 0 0 '+randomNum2[1]+'px '+randomColor[8]+', 0 0 '+randomNum2[2]+'px '+randomColor[9]+', 0 0 '+randomNum2[3]+'px '+randomColor[10]+', 0 0 '+randomNum2[4]+'px '+randomColor[11]+', 0 0 '+randomNum2[5]+'px '+randomColor[12]+', 0 0 '+randomNum2[6]+'px'+randomColor[13]+';}}');
                break;
            case 2:
                addGlobalStyle('.glow{-webkit-animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;-moz-animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;animation: glow '+rndNumSeconds+'s ease-in-out infinite alternate;}@-webkit-keyframes glow{from{text-shadow: 0 0 '+randomNum[0]+'px '+randomColor[0]+', 0 0 '+randomNum[1]+'px '+randomColor[1]+', 0 0 '+randomNum[2]+'px '+randomColor[2]+', 0 0 '+randomNum[3]+'px '+randomColor[3]+', 0 0 '+randomNum[4]+'px '+randomColor[4]+', 0 0 '+randomNum[5]+'px '+randomColor[5]+', 0 0 '+randomNum[6]+'px'+randomColor[6]+';}to{text-shadow: 0 0 '+randomNum2[0]+'px '+randomColor[7]+', 0 0 '+randomNum2[1]+'px '+randomColor[8]+', 0 0 '+randomNum2[2]+'px '+randomColor[9]+', 0 0 '+randomNum2[3]+'px '+randomColor[10]+', 0 0 '+randomNum2[4]+'px '+randomColor[11]+', 0 0 '+randomNum2[5]+'px '+randomColor[12]+', 0 0 '+randomNum2[6]+'px'+randomColor[13]+';}}');
                break;
        }
        $("body").addClass( "glow" );
        //randomColor[(Math.floor(Math.random() * 15))]);
        setTimeout(RANDOMIZE_SHIT, (Math.ceil(Math.random() * 4000)+4000));
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

})();