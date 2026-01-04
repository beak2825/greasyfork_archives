// ==UserScript==
// @name         Wander Client
// @namespace    TDW
// @version      0.2
// @description  test
// @author       Wander
// @icon         https://i.imgur.com/dT0Osd5.jpg
// @require      http://code.jquery.com/jquery-latest.js
// @match        *://agar.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374563/Wander%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/374563/Wander%20Client.meta.js
// ==/UserScript==

if(window.location.origin == "https://agar.io") {
    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (/agario\.core\.js/i.test(node.src)){
                    observer.disconnect();
                    node.parentNode.removeChild(node);
                    var request = new XMLHttpRequest();
                    request.open("get", node.src, true);
                    request.send();
                    request.onload = function(){
                        var coretext = this.responseText;
                        var newscript = document.createElement("script");
                        newscript.type = "text/javascript";
                        newscript.async = true;
                        newscript.textContent = editCore(coretext);
                        document.body.appendChild(newscript);
                    };
                }
            });
        });
    });
    observer.observe(document, {attributes:true, characterData:true, childList:true, subtree:true});

    function editCore(coretext){
        var addOgarinfinity={
            "Starting":[
                {bul:/\(function\(\w\)\{/i,
                 degistir:`$&
window.op_bots={
skill:{
interactiv_color:true,
attack_range:false,
map_border:true,
map_sector:true,
sector_label:true,
mini_map:true,
no_grid:true,
no_food:false,
transparent:0.7,
virus_mass:false,
other_mass:true,
fps:"180",
zoom_out:true,
auto_zoom:false,
acid:false
},
connect:null,
onPlayerSpawn:null,
onPlayerDeath:null,
setFpsCap:null,
bgtimeout:null,
reset:null,
canvas:null,
sector:5,
sayac:0,
zoomvalue:0.3,
oyunalanı:{},
stopmovement:false,
selectblob:false,
isactive:false,
ismyblob:null,
fixed_mouse_pos_x: 0,
fixed_mouse_pos_y: 0,
myblob:{
x:0,
y:0,
size:[],
selectsize:0,
totalmass:0,
ismycolor:null,
isalive:false
},
minimap:{
fps:50/100,
kontrol:0
},
color:{
big4x:{hex:"#C80815",rgb:[200,8,21]},
big2x:{hex:"#FF0000",rgb:[255,0,0]},
big1x:{hex:"#FF7F00",rgb:[255,127,0]},
similar:{hex:"#0000FF",rgb:[0,0,255]},
small1x:{hex:"#008000",rgb:[0,128,0]},
small2x:{hex:"#00FF00",rgb:[0,255,0]},
small4x:{hex:"#FFFF00",rgb:[255,255,0]},
food:{hex:"#30D5C8",rgb:[48,213,200]},
virus:{hex:"#800080",rgb:[128,0,128]},
mycolor:{hex:"#0000FF",rgb:[0,0,255]},
miniblob:{hex:"#0000FF",rgb:[0,0,255]},
border:{hex:"#000000",rgb:[0,0,0]},
sector:{hex:"#808080",rgb:[128,128,128]},
label:{hex:"#0000FF",rgb:[0,0,255]},
foodrainbow:false
}
};

/******************************************************************/
/******************************************************************/

function appendskill(a){
var elm=[];function sec(a,b){return a==b?"selected":""}function cek(a){return a?"checked":""}
var ad=function(a){var s="";$.each(a.split("_"),function(i,w){s+=w.charAt(0).toUpperCase()+w.slice(1)+" "});return s.trim()};
$.each(a,function(key,val){
if(typeof(val)==="boolean"){
elm.push('<label><input id="'+key+'" type="checkbox" style="margin-top:1px" '+cek(val)+'><span>'+ad(key)+'</span></label>')
}else{
var opt=[];
if(key=="transparent"){
for(i=10;i>0;i--){opt.push('<option '+sec(val,i/10)+'>'+ad(key)+': '+i/10+'</option>')}
elm.push('<select id="'+key+'">'+opt.join("")+'</select>')
}else{
var d={"20":25, "normal":30, "30":35, "40":60, "auto":-1}
$.each(d,function(ky,vl){
opt.push('<option data='+vl+' '+sec(val,ky)+'>'+ad(key)+': '+ky+'</option>')
})
elm.push('<select id="'+key+'">'+opt.join("")+'</select>')
}
}
})
return elm.join("")
};
$("#adbg").remove();
function appendpicker(a){
var elm=[];$.each(a,function(key,val){
if(typeof(val)=="boolean"){
elm.push('<span>'+key+' :<input type="checkbox" id="'+key+'" '+function(){return val&&"checked"}()+'></span>')
}else{
elm.push('<span>'+key+' :<input type="color" id="'+key+'" value="'+val.hex+'"></span>')
}
});return elm.join("")
}
//************************************
$('#options #window.op_botsskill').on('change', 'input', function(){
window.op_bots.skill[this.id]=this.checked;
if(this.id=="mini_map"){
$("#minimap").toggle()
}else if(this.id=="zoom_out"){
this.checked?window.op_bots.zoomvalue=0.3:window.op_bots.zoomvalue=1;
}else if(this.id=="acid"){
window.core.setAcid(this.checked);
}
});
$('#options #window.op_botsskill').on('change', 'select', function(){
var val=this.value.replace(/^.*?: (.*?)$/,'$1'); window.op_bots.skill[this.id]=val;
})
/******************************************************************/

var splittime=null, ejecttime=null, keydown=false;
document.addEventListener("keydown", function(e){
if(!window.op_bots.myblob.isalive){return};
switch (e.code){
case 'KeyD': window.op_bots.stopmovement=!window.op_bots.stopmovement;break;
case 'KeyV': window.op_bots.skill.no_food=!window.op_bots.skill.no_food;break;
case 'KeyW': if(ejecttime)break;keytime("eject");break;
case 'KeyQ': if(splittime||keydown)break;keytime(1);break;
case 'KeyE': if(splittime||keydown)break;keytime(2);break;
case 'KeyShift': if(splittime||keydown)break;keytime(3);break;
}
}),document.addEventListener("keyup", function(t){
keydown=false;clearInterval(ejecttime),ejecttime=null;
});
function keytime(j){
if(j=="eject"){
ejecttime=setInterval(function(){window.core.eject()},100);
}else{
keydown=true;var n=0;
window.core.split(),splittime=setInterval(function(){
window.core.split(),j==++n&&(clearInterval(splittime),splittime=null)
},50);
}
};

/******************************************************************/

$("#window.op_botspicker .button").click(function(){
if(this.id=="ok"){
$("#window.op_botspicker input").each(function(){
if(this.type =="checkbox"){window.op_bots.color[this.id]=this.checked
}else{window.op_bots.color[this.id]={hex:this.value,rgb:hexToRgb(this.value)}}
});
localStorage.setItem("window.op_botschangecolor", JSON.stringify(window.op_bots.color))
}else if(this.id=="default"){
$("#window.op_botspicker input").each(function(){
if(this.type=="checkbox"){this.checked=window.op_botsdefaultcolor[this.id]
}else{this.value=window.op_botsdefaultcolor[this.id].hex}
});return
}
$(this).parents("#window.op_botspicker").hide();
$("#window.op_botsbg").css("z-index","");if(window.op_bots.isactive){$("#window.op_botsbg").hide()};
});
function hexToRgb(h){var rgb=/^#(..)(..)(..)$/.exec(h);return [parseInt(rgb[1],16),parseInt(rgb[2],16),parseInt(rgb[3],16)]};
/******************************************************************/

$("#window.op_botsarena span").click(function(){
var conn, inputtext = $(this).siblings("input").val();
if(/^ws:/.exec(inputtext)){conn=inputtext}else{conn="ws://live-arena-"+inputtext+".agar.io:80"};
window.core.connect(conn);
});
window.op_bots.connect=function(a){
$("#window.op_botsarena input").val(a.replace(/^.*?arena-(.*?)\.agar.*?$/,'$1'));
clearTimeout(window.op_bots.bgtimeout);window.op_bots.bgtimeout=setTimeout(function(){window.core.setFadeout(false),window.core.sendSpectate()}, 500);
$("#window.op_botsbg").show();
};
window.op_bots.onPlayerSpawn=function(){
window.op_bots.myblob.isalive=true; window.op_bots.isactive=true; window.op_bots.reset();
clearTimeout(window.op_bots.bgtimeout);
$("#window.op_botsbg").hide();
};
window.op_bots.onPlayerDeath=function(){
window.op_bots.myblob.isalive=false; window.op_bots.reset();
window.setTimeout(MC.showNickDialog, 500);
};
window.op_bots.setFpsCap=function(){
var cap=$('#window.op_botsskill #fps').find(':selected').attr('data');
return cap
}
$("button.btn-spectate").click(function(){
$("#window.op_botsbg").hide(); window.op_bots.isactive=true;
});
window.op_bots.reset=function(){window.op_bots.stopmovement=false; window.op_bots.myblob.size=[]; window.op_bots.myblob.ismycolor=null;};
/******************************************************************/
`
                }
            ],
            "Map Border & Map Sector &  Sector Label & Mini Map & Transparent & Attack Range & -window.op_botscanvas-oyunalanı-damga":[
                {bul:/((\w)=document\.getElementById\(\w\(\w\)\);)(.*?)(\w=\w\.getContext\("2d"\);)/i,
                 degistir:`$1 $3 if($2.id=="canvas"){window.op_bots.canvas=$4}else{$4};`
                },
                {bul:/0;\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);/i,
                 degistir:`$&
if(Math.abs($3-$1)>14e3 && Math.abs($4-$2)>14e3){
window.op_bots.oyunalanı={minx:$1, miny:$2, maxx:$3, maxy:$4, width:$3-$1, height:$4-$2, xmerkez:($1+$3)/2, ymerkez:($2+$4)/2}
};`
                },
                {bul:/\w+\(\d+,\w+\[\w+>>2\]\|0,\+\-(\+\w\[\w+\+\d+>>3\]),\+\-(\+\w+\[\w\+\d+>>3\])\)\|0;/i,
                 degistir:`$&
window.op_bots.sayac++;

/*** Map Border ****/
if(window.op_bots.skill.map_border){
window.op_bots.canvas.lineWidth=20, window.op_bots.canvas.globalAlpha=0.7, window.op_bots.canvas.strokeStyle=window.op_bots.color.border.hex;
window.op_bots.canvas.strokeRect(window.op_bots.oyunalanı.minx, window.op_bots.oyunalanı.miny, window.op_bots.oyunalanı.width, window.op_bots.oyunalanı.height);
};

var parselw=window.op_bots.oyunalanı.width/window.op_bots.sector, parselh=window.op_bots.oyunalanı.height/window.op_bots.sector;

/*** Map Sector ****/
if(window.op_bots.skill.map_sector){
window.op_bots.canvas.beginPath();
window.op_bots.canvas.lineWidth=10, window.op_bots.canvas.globalAlpha=0.6, window.op_bots.canvas.strokeStyle=window.op_bots.color.sector.hex;
for(var zi=1; zi<window.op_bots.sector; zi++){
window.op_bots.canvas.moveTo(window.op_bots.oyunalanı.minx, window.op_bots.oyunalanı.miny+parselw*zi);window.op_bots.canvas.lineTo(window.op_bots.oyunalanı.maxx, window.op_bots.oyunalanı.miny+parselw*zi);//yatay
window.op_bots.canvas.moveTo(window.op_bots.oyunalanı.minx+parselh*zi, window.op_bots.oyunalanı.miny);window.op_bots.canvas.lineTo(window.op_bots.oyunalanı.minx+parselh*zi, window.op_bots.oyunalanı.maxy);//dikey
}
window.op_bots.canvas.stroke();
};

window.op_bots.canvas.textAlign="center", window.op_bots.canvas.textBaseline="middle";

/*** Sector Label ****/
if(window.op_bots.skill.sector_label){
window.op_bots.canvas.font=parselw/2.8+"px Ubuntu", window.op_bots.canvas.globalAlpha=0.07, window.op_bots.canvas.fillStyle=window.op_bots.color.label.hex;
var bucw=parselw/2, buch=parselh/2;
for(var sat=0;sat<window.op_bots.sector;sat++){
var label=String.fromCharCode(65+sat);
for(var sut=0;sut<window.op_bots.sector;sut++){
window.op_bots.canvas.fillText(label+(sut+1), window.op_bots.oyunalanı.minx+parselw*sut+bucw, window.op_bots.oyunalanı.miny+parselh*sat+buch);
}
}
};
/*** Damga ****/
window.op_bots.canvas.font="380px Ubuntu", window.op_bots.canvas.globalAlpha=0.7, window.op_bots.canvas.fillStyle='#808080';
window.op_bots.canvas.fillText("Wander YT", window.op_bots.oyunalanı.xmerkez, window.op_bots.oyunalanı.ymerkez);

/*** Transparent ****/
window.op_bots.canvas.globalAlpha=window.op_bots.skill.transparent;

/*** Attack Range ****/
if(window.op_bots.myblob.isalive && window.op_bots.skill.attack_range){
window.op_bots.canvas.beginPath();
window.op_bots.canvas.lineWidth=1, window.op_bots.canvas.strokeStyle=window.op_bots.color.mycolor.hex, window.op_bots.canvas.arc($1, $2, window.op_bots.myblob.selectsize+760, 0, 2*Math.PI);
window.op_bots.canvas.stroke();
};

window.op_bots.fixed_mouse_pos_x = $1 - window.op_bots.oyunalanı.xmerkez;
window.op_bots.fixed_mouse_pos_y = $2 - window.op_bots.oyunalanı.ymerkez;

/*** Mini Map ****/
if(window.op_bots.skill.mini_map){
window.op_bots.minimap.kontrol+=window.op_bots.minimap.fps;
if(window.op_bots.minimap.kontrol>=1){
var playerx=$1, playery=$2; //spectate
window.playerX=playerx-window.op_bots.oyunalanı.xmerkez, window.playerY=playery-window.op_bots.oyunalanı.ymerkez;
var minimap = document.getElementById("minimap");
var ctx = minimap.getContext("2d");
var mw=minimap.width/5, blurrylines=1;
var leftrate = (playerx-window.op_bots.oyunalanı.minx)/window.op_bots.oyunalanı.width;
var toprate = (playery-window.op_bots.oyunalanı.miny)/window.op_bots.oyunalanı.height;
var minileft = Math.round(minimap.width * leftrate * 100) / 100;
var minitop = Math.round(minimap.height * toprate * 100) / 100;
ctx.beginPath();
ctx.fillStyle=window.op_bots.color.miniblob.hex;
ctx.clearRect(0, 0, minimap.width, minimap.height);
ctx.globalAlpha=0.5, ctx.lineWidth=0.5, ctx.strokeStyle=window.op_bots.color.sector.hex;
ctx.strokeRect(blurrylines+mw, blurrylines+mw, minimap.width-mw*2, minimap.height-mw*2);
ctx.strokeRect(blurrylines+mw*2, blurrylines+mw*2, minimap.width-mw*4, minimap.height-mw*4);
ctx.font=(minimap.width / window.op_bots.sector)/2.8+"px Ubuntu";
for(var sat=0;sat<window.op_bots.sector;sat++){
var label=String.fromCharCode(65+sat);
for(var sut=0;sut<window.op_bots.sector;sut++){
ctx.fillText(label+(sut+1), (-7) + (minimap.width / window.op_bots.sector)*sut+((minimap.width / window.op_bots.sector) / 2), 5 + (minimap.width / window.op_bots.sector)*sat+((minimap.width / window.op_bots.sector) / 2));
}
}
ctx.globalAlpha=1.0;
ctx.arc(minileft, minitop, 5, 0, 2*Math.PI);
ctx.fill();
ctx.closePath();
window.op_bots.minimap.kontrol-=1;
};
};`
                }
            ],
            "Show Virus Mass && Show Others Mass -ismyblob":[
                {bul:/(if\(\w\[\w\+\d+>>0\]\|0\)\{\w=\w;return\})if\((\w\[\w\+\d+>>0\]\|0)\)\{(\w=\w;return)\}/i,
                 degistir:`$1; var isvirus=$2; if(isvirus && !window.op_bots.skill.virus_mass){$3};`
                },
                {bul:/\w=\w\[(\w)(\+\d+)?>>2\]\|0;\w=\w\[\d+\]\|0;\w=\w\[\d+\]\|0;.*?(\w)=\(\w\|0\)\!=\(\w\|0\);/i,
                 degistir:`$& if(isvirus||window.op_bots.skill.other_mass){$3=true}; if(!window.op_bots.ismyblob){window.op_bots.ismyblob=function($1){$& return $3}};`
                }
            ],
            "No Grid":[
                {bul:/(\w+\(\d+,\w\|0,50\.5,\.5\)\|0;)(\w+\(\d+,\w\|0\)\|0;)/i, degistir:`$1 if(!window.op_bots.skill.no_grid){$2};`}
            ],
            "No Food":[
                {bul:/\}else\{(\w+)=\(\w\[\w\+\d+>>0\]\|0\)==0;/i, degistir:`$& if(!$1 && window.op_bots.skill.no_food){break};`}
            ],
            "Zoom Out & Auto Zoom -window.op_botszoomvalue":[
                {bul:/;if\((\w)<1\.0\){/i, degistir:`;if($1<!window.op_bots.skill.zoom_out|0){`},
                {bul:/(\w)=\w\*\+\w\(\.9,\+\w\);/i, degistir:`;if(window.op_bots.skill.zoom_out){$1=window.op_bots.zoomvalue};$& window.op_bots.zoomvalue=$1;`},
                {bul:/(\w+\(\w\);\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=\w;)/i, degistir:`$1 if(window.op_bots.skill.auto_zoom){$2}else{$3=window.op_bots.zoomvalue};`}
            ],
            "KeyS Stop":[
                {bul:/setTarget:function\((\w),(\w)\)\{/i,
                 degistir:`$& if(window.op_bots.stopmovement){var z=document.getElementById("canvas");$1=z.width/2, $2=z.height/2}`
                }
            ],
            "Fps":[
                {bul:/setFpsCap:function\((\w)\)\{/i,
                 degistir:`$& $1=window.op_bots.setFpsCap();`
                }
            ],
            "Connect":[
                {bul:/connect:function\((\w)\)\{/i,
                 degistir:`$& window.op_bots.connect($1);`
                }
            ],
            "OnPlayerSpawn":[
                {bul:/\w\.MC\.onPlayerSpawn\)/i,
                 degistir:`$& window.op_bots.onPlayerSpawn(),`
                }
            ],
            "OnPlayerDeath":[
                {bul:/\w\.MC\.onPlayerDeath\)/i,
                 degistir:`$& window.op_bots.onPlayerDeath(),`
                }
            ]
        };

        var keyj=0, valj=0, isabet=0, bul;
        coretext = coretext.replace(/([,\/;])\n/gm, "$1");
        $.each(addOgarinfinity, function(key,obj){
            keyj++;
            $.each(obj, function(i,value){
                valj++;
                bul=false;
                if (value.bul.test(coretext)){
                    isabet++;
                    bul=true;
                    coretext = coretext.replace(value.bul, value.degistir);
                }
            });
        });

        $("body").append('<canvas id="minimap" width="180" height="180" style="background-color:rgba(0,0,0,0.4); border:1px solid grey; right:10px; bottom:20px; position:absolute;"></canvas>');
        jQuery(".btn-play").css("width", "240px");
        $("#title").text("🎕");
        $('#title').css('margin-top', 20);
        $("#mainui-play").height("370px");
        $("#nick").width("170px");
        $("#settingsButton").css("background-color","transparent");
        $("#instructions").append('<center><span class=\'text-muted\'> Press <b>Q</b> to Double split</span></center>');
        $("#instructions").append('<center><span class=\'text-muted\'> Press <b>E</b> to 16 TrickSplit</span></center>');
        $("#instructions").append('<center><span class=\'text-muted\'> Press <b>D</b> to LineSplit</span></center>');
        $('#instructions').css('margin', 20);
        $('#instructions').css('color', 'black');
        $("#instructions").css("fontSize", "19px");
        $('#mcbanners').remove();
        $("#socialButtons").remove();
        $("#mainui-ads").remove();
        $("#adsBottomInner").remove();
        "use strict";

        const byId = id => document.getElementById(id);
        const byClass = (clss, prnt) => (prnt || document).getElementsByClassName(clss);
        const observe = (target, options, callback) => {
        (new MutationObserver(callback)).observe(target, options);
        };

        let css = "";

        const mainPanel = byId("mainPanel");
        const playContainer = byClass("play-container")[0];
        const playElm = byId("mainui-play");
        const settingsBtn = byId("settingsButton");
        let settingsElm = null;

        css += `
        .btn-login-play {
            width: 49%;
            margin-left: 0;
            width: 120px;
        }
        .btn-play-guest {
            width: 49%;
            margin-left: 0;
            width: 120px;
        }
        .btn-play {
            left: 30px;
            margin-left: 5px;
            margin-top: 50px;
            width: 240px;
        }
        #mainui-play, #mainui-modes, #mainui-user, #mainui-offers, #mainui-party, #mainui-features {
        border-top: 5px solid #01d9cc;
        padding: 0
        }

	    #exp-imp, #hotkeys, .agario-side-panel, .play-container, .modes-container, .user-container, .dialog {
        background-image: url(http://cdn.ogario.ovh/static/img/pattern.png);
        background-repeat: repeat;
        background-position: top center
        }

        #mainui-features, #mainui-modes, #mainui-offers, #mainui-party, #mainui-play, #mainui-user {
        background-image: url(http://cdn.ogario.ovh/static/img/pattern.png);
        background-repeat: repeat;
        background-position: top center
        }
        `;
        // ** Append CSS To DOM
        const style = document.createElement("style");
        style.id = "agarExtras";
        style.innerHTML = css;
        document.head.appendChild(style);



        return coretext;
    }
}
