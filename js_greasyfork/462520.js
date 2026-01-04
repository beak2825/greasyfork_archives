// ==UserScript==
// @name         Agar.io Core Mutation by zagar
// @namespace    agar.io
// @version      3.1
// @description  Adds new skills to Agar.io: Connect server, interactive color, color change, attack range, zoom out, map border/sector/label, mini map, fps control, key for rapid split/feed, stop movement and so on...
// @author       zagar | zagarcore@gmail.com modified to work by Agario-Love🕹️
// @match        http://agar.io/*
// @match        https://agar.io/*
// @connect      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462520/Agario%20Core%20Mutation%20by%20zagar.user.js
// @updateURL https://update.greasyfork.org/scripts/462520/Agario%20Core%20Mutation%20by%20zagar.meta.js
// ==/UserScript==

/*jshint multistr: true */

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
	var addSkill={
		"Başlangıç":[
			{bul:/\(function\(\w\)\{/i,
			degistir:`$&
				var zagar={
					skill:{
                        interactiv_color:true,
                        attack_range:true,
						map_border:true,
						map_sector:true,
                        sector_label:true,
						mini_map:true,
						no_grid:true,
                        no_food:false,
                        transparent:0.8,
						virus_mass:false,
						other_mass:false,
						fps:"normal",
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
					selectblob:true,
                    isactive:false,
					ismyblob:null,
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
                        big4x:{hex:"#C80815",rgb:[200,8,21]},    //if it's split into four, it eat.
						big2x:{hex:"#FF0000",rgb:[255,0,0]},     //if it's split into two, it eat.
						big1x:{hex:"#FF7F00",rgb:[255,127,0]},   //if it catch it, it eat.
						similar:{hex:"#0000FF",rgb:[0,0,255]},   //similar, no eat.
						small1x:{hex:"#008000",rgb:[0,128,0]},   //if you catch it, you eat.
						small2x:{hex:"#00FF00",rgb:[0,255,0]},   //if you split in two, you eat.
						small4x:{hex:"#FFFF00",rgb:[255,255,0]}, //if you split in four, you eat.
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
                var zagardefaultcolor=zagar.color;var storage=localStorage.getItem("zagarchangecolor");if(storage){zagar.color=JSON.parse(storage)};
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
		        $("#mainPanel #options").append('<div id="zagarskill"><p>Zagar Skill</p>\
                                                 <span id="colorsettings">Color Settings <i class="glyphicon glyphicon-cog"></i></span>\
                                                 '+appendskill(zagar.skill)+'\
                                                 </div>');
                $("#mainPanel .text-muted").append('<div style="border:2px solid #DFDFDF;border-radius:5px;margin-top:3px;">\
                                                    <p style="background-color:#DFDFDF;margin:0px;">Zagar Key</p>\
                                                    <span>Press <b>S</b> to start/stop movement</span><br>\
                                                    <span>Press <b>M</b> to minimap show/hide</span><br>\
                                                    <span>Press <b>F</b> to food show/hide</span><br>\
                                                    <span>Press Hold <b>W</b> to rapid eject mass</span><br>\
                                                    <span>Press <b>A</b> to double split</span><br>\
                                                    <span>Press <b>D</b> to triple split</span><br>\
                                                    <span>Press <b>R</b> to quadruple split</span><br>\
                                                    </div>');
				function appendpicker(a){
				   var elm=[];$.each(a,function(key,val){
				      if(typeof(val)=="boolean"){
				         elm.push('<span>'+key+' :<input type="checkbox" id="'+key+'" '+function(){return val&&"checked"}()+'></span>')
				      }else{
				         elm.push('<span>'+key+' :<input type="color" id="'+key+'" value="'+val.hex+'"></span>')
				      }
				   });return elm.join("")
				}
				$("body").append('<center><div id="zagarpicker">\
                                  <span class="button" id="close">&#10008;</span>'+appendpicker(zagar.color)+'\
                                  <div style="margin-top:5px;"><span class="button" id="default">Default</span><span class="button" id="ok">Ok</span></div></div>\
                                  </center>');

                $("head").append("<style>\
                                  #options label{width:33%;}\
                                  #options #zagarskill{border:2px solid #DFDFDF;border-radius:5px;margin-top:2px; padding-left:3px;}\
                                  #options #zagarskill p{border-radius:5px;margin-left:-3px;margin-bottom:4px;background-color:#31B0D5;color:white;font-weight:bold;text-align:center;}\
                                  #options #zagarskill select{width:33%; border:0px; outline:none; -webkit-appearance:none; -moz-appearance:none; appearance:none;}\
                                  #options #zagarskill #colorsettings{display:inline-block;background-color:#E91D00;float:right;color:white; padding-left:6px;padding-right:6px; width:33%; cursor:pointer;}\
		                          #zagarpicker{position:relative; margin-top:5%; display:none; background-color:white; text-align:left; border-radius:5px; font-family:Thoma; width:280px; border:1px solid #808080; padding:28px 5px 10px 5px;}\
		                          #zagarpicker span{margin-left:10px; display:inline-block; white-space:nowrap; width:45%}\
		                          #zagarpicker input{float:right}\
		                          #zagarpicker .button{border-radius:3px; text-align:center; background-color:#C80815; color:white; padding:1px 0px 1px 0px; cursor:pointer;}\
		                          #zagarpicker #close{position:absolute;top:3px;right:3px;padding:0px;width:25px;}\
                                  </style>");

                /******************************************************************/

                $('#options #zagarskill').on('change', 'input', function(){
                   zagar.skill[this.id]=this.checked;
                   if(this.id=="mini_map"){
                      $("#minimap").toggle()
                   }else if(this.id=="zoom_out"){
                      this.checked?zagar.zoomvalue=0.9:zagar.zoomvalue=1;
                   }else if(this.id=="acid"){
                      window.core.setAcid(this.checked);
                   }else if(this.id=="interactiv_color"){
                      $("#noSkins").prop("checked", this.checked);
                      $("#noSkins").prop("disabled", this.checked);
                   }
                });
				$('#options #zagarskill').on('change', 'select', function(){
                    var val=this.value.replace(/^.*?: (.*?)$/,'$1'); zagar.skill[this.id]=val;
				})
                /******************************************************************/

				var splittime=null, ejecttime=null, keydown=false;
				document.addEventListener("keydown", function(e){
				    if(!zagar.myblob.isalive){return};
					switch (e.code){
						case 'KeyS': zagar.stopmovement=!zagar.stopmovement;break;
						case 'KeyM': zagar.skill.mini_map=!zagar.skill.mini_map; $("#minimap").toggle();break;
                        case 'KeyF': zagar.skill.no_food=!zagar.skill.no_food;break;
						case 'KeyW': if(ejecttime)break;keytime("eject");break;//rapid eject mass
						case 'KeyA': if(splittime||keydown)break;keytime(1);break;//double split
						case 'KeyD': if(splittime||keydown)break;keytime(2);break;//triple split
						case 'KeyR': if(splittime||keydown)break;keytime(3);break;//quadruple split
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

                $("#options #zagarskill #colorsettings").click(function(){
                   $("#zagarbg").css("z-index","9998").show();$("#zagarpicker").css("z-index","9999").show()
                });
				$("#zagarpicker .button").click(function(){
				   if(this.id=="ok"){
				      $("#zagarpicker input").each(function(){
					     if(this.type =="checkbox"){zagar.color[this.id]=this.checked
                         }else{zagar.color[this.id]={hex:this.value,rgb:hexToRgb(this.value)}}
					  });
			          localStorage.setItem("zagarchangecolor", JSON.stringify(zagar.color))
				   }else if(this.id=="default"){
				      $("#zagarpicker input").each(function(){
					     if(this.type=="checkbox"){this.checked=zagardefaultcolor[this.id]
						 }else{this.value=zagardefaultcolor[this.id].hex}
					  });return
				   }
				   $(this).parents("#zagarpicker").hide();
                   $("#zagarbg").css("z-index","");if(zagar.isactive){$("#zagarbg").hide()};
				});
				function hexToRgb(h){var rgb=/^#(..)(..)(..)$/.exec(h);return [parseInt(rgb[1],16),parseInt(rgb[2],16),parseInt(rgb[3],16)]};
                /******************************************************************/

                $("#zagararena span").click(function(){
                   var conn, inputtext = $(this).siblings("input").val();
                   if(/^ws:/.exec(inputtext)){conn=inputtext}else{conn="ws://live-arena-"+inputtext+".agar.io:80"};
                   window.core.connect(conn);
                });
                zagar.connect=function(a){
                   $("#zagararena input").val(a.replace(/^.*?arena-(.*?)\.agar.*?$/,'$1'));
                   clearTimeout(zagar.bgtimeout);zagar.bgtimeout=setTimeout(function(){window.core.setFadeout(false),window.core.sendSpectate()}, 500);
                   $("#zagarbg").show();
                };
                zagar.onPlayerSpawn=function(){
                   zagar.myblob.isalive=true; zagar.isactive=true; zagar.reset();
                   clearTimeout(zagar.bgtimeout);
                   $("#zagarbg").hide();
                };
                zagar.onPlayerDeath=function(){
                   zagar.myblob.isalive=false; zagar.reset();
                   window.setTimeout(MC.showNickDialog, 500);
                };
                zagar.setFpsCap=function(){
                   var cap=$('#zagarskill #fps').find(':selected').attr('data');
                   return cap
                }
                $("button.btn-spectate").click(function(){
                   $("#zagarbg").hide(); zagar.isactive=true;
                });
                zagar.reset=function(){zagar.stopmovement=false; zagar.myblob.size=[]; zagar.myblob.ismycolor=null;};
                /******************************************************************/

                $("#canvas").click(function(){
                   zagar.selectblob=!zagar.selectblob;
                   zagar.selectblob?mm="max":mm="min";
                   $("#zagardurum #selectblob").text("selectblob: "+mm)
                });
                setInterval(function(){
                   $("#zagardurum #fps").text("fps: "+zagar.sayac); zagar.sayac=0;
                   $("#zagardurum #piece").text("piece: "+zagar.myblob.size.length);
                   $("#zagardurum #totalmass").text("totalmass: "+zagar.myblob.totalmass);
                },1000);
                /******************************************************************/
                `
            }
        ],
        "Map Border & Map Sector &  Sector Label & Mini Map & Transparent & Attack Range & -zagarcanvas-oyunalanı-damga":[
            {bul:/((\w)=document\.getElementById\(\w\(\w\)\);)(.*?)(\w=\w\.getContext\("2d"\);)/i,
             degistir:`$1 $3 if($2.id=="canvas"){zagar.canvas=$4}else{$4};`
            },
            {bul:/0;\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);/i,
             degistir:`$&
                       if(Math.abs($3-$1)>14e3 && Math.abs($4-$2)>14e3){
                          zagar.oyunalanı={minx:$1, miny:$2, maxx:$3, maxy:$4, width:$3-$1, height:$4-$2, xmerkez:($1+$3)/2, ymerkez:($2+$4)/2}
                       };`
            },
            {bul:/\w+\(\d+,\w+\[\w+>>2\]\|0,\+\-(\+\w\[\w+\+\d+>>3\]),\+\-(\+\w+\[\w\+\d+>>3\])\)\|0;/i,
             degistir:`$&
                   zagar.sayac++;

                   /*** Map Border ****/
                   if(zagar.skill.map_border){
                      zagar.canvas.lineWidth=20, zagar.canvas.globalAlpha=0.7, zagar.canvas.strokeStyle=zagar.color.border.hex;
                      zagar.canvas.strokeRect(zagar.oyunalanı.minx, zagar.oyunalanı.miny, zagar.oyunalanı.width, zagar.oyunalanı.height);
                   };

                   var parselw=zagar.oyunalanı.width/zagar.sector, parselh=zagar.oyunalanı.height/zagar.sector;

                   /*** Map Sector ****/
                   if(zagar.skill.map_sector){
                      zagar.canvas.beginPath();
                      zagar.canvas.lineWidth=10, zagar.canvas.globalAlpha=0.6, zagar.canvas.strokeStyle=zagar.color.sector.hex;
                      for(var zi=1; zi<zagar.sector; zi++){
                         zagar.canvas.moveTo(zagar.oyunalanı.minx, zagar.oyunalanı.miny+parselw*zi);zagar.canvas.lineTo(zagar.oyunalanı.maxx, zagar.oyunalanı.miny+parselw*zi);//yatay
                         zagar.canvas.moveTo(zagar.oyunalanı.minx+parselh*zi, zagar.oyunalanı.miny);zagar.canvas.lineTo(zagar.oyunalanı.minx+parselh*zi, zagar.oyunalanı.maxy);//dikey
                      }
                      zagar.canvas.stroke();
                   };

                   zagar.canvas.textAlign="center", zagar.canvas.textBaseline="middle";

                   /*** Sector Label ****/
                   if(zagar.skill.sector_label){
                      zagar.canvas.font=parselw/2.8+"px Segoe Print", zagar.canvas.globalAlpha=0.07, zagar.canvas.fillStyle=zagar.color.label.hex;
                      var bucw=parselw/2, buch=parselh/2;
                      for(var sat=0;sat<zagar.sector;sat++){
                         var label=String.fromCharCode(65+sat);
                         for(var sut=0;sut<zagar.sector;sut++){
                            zagar.canvas.fillText(label+(sut+1), zagar.oyunalanı.minx+parselw*sut+bucw, zagar.oyunalanı.miny+parselh*sat+buch);
                         }
                      }
                   };
                   /*** Damga ****/
                      zagar.canvas.font="380px Segoe Print", zagar.canvas.globalAlpha=0.07, zagar.canvas.fillStyle='#808080';
                      zagar.canvas.fillText("Zagar Core Mutation", zagar.oyunalanı.xmerkez, zagar.oyunalanı.ymerkez);

                   /*** Transparent ****/
                      zagar.canvas.globalAlpha=zagar.skill.transparent;

                   /*** Attack Range ****/
                   if(zagar.myblob.isalive && zagar.skill.attack_range){
                      zagar.canvas.beginPath();
                      zagar.canvas.lineWidth=1, zagar.canvas.strokeStyle=zagar.color.mycolor.hex, zagar.canvas.arc(zagar.myblob.x, zagar.myblob.y, zagar.myblob.selectsize+760, 0, 2*Math.PI);
                      zagar.canvas.stroke();
                   };

                   /*** Mini Map ****/
                   if(zagar.skill.mini_map){
                      zagar.minimap.kontrol+=zagar.minimap.fps;
                      if(zagar.minimap.kontrol>=1){
                         var playerx=$1, playery=$2; //spectate
                         var minimap = document.getElementById("minimap");
                         var ctx = minimap.getContext("2d");
                         var mw=minimap.width/5, blurrylines=0.5;
                         var leftrate = (playerx-zagar.oyunalanı.minx)/zagar.oyunalanı.width;
                         var toprate = (playery-zagar.oyunalanı.miny)/zagar.oyunalanı.height;
                         var minileft = Math.round(minimap.width * leftrate * 100) / 100;
                         var minitop = Math.round(minimap.height * toprate * 100) / 100;
			             ctx.beginPath();
			             ctx.clearRect(0, 0, minimap.width, minimap.height);
                         ctx.globalAlpha=0.5, ctx.lineWidth=0.5, ctx.strokeStyle=zagar.color.border;
                         ctx.strokeRect(blurrylines+mw, blurrylines+mw, minimap.width-mw*2, minimap.height-mw*2);
                         ctx.strokeRect(blurrylines+mw*2, blurrylines+mw*2, minimap.width-mw*4, minimap.height-mw*4);
                         ctx.globalAlpha=1;
			             ctx.fillStyle=zagar.color.miniblob.hex;
			             ctx.arc(minileft, minitop, 5, 0, 2*Math.PI);
			             ctx.fill();
                         ctx.closePath();
                      zagar.minimap.kontrol-=1;
                      };
                   };`
            }
        ],
        "Show Virus Mass && Show Others Mass -ismyblob":[
            {bul:/(if\(\w\[\w\+\d+>>0\]\|0\)\{\w=\w;return\})if\((\w\[\w\+\d+>>0\]\|0)\)\{(\w=\w;return)\}/i,
             degistir:`$1; var isvirus=$2; if(isvirus && !zagar.skill.virus_mass){$3};`
            },
            {bul:/\w=\w\[(\w)(\+\d+)?>>2\]\|0;\w=\w\[\d+\]\|0;\w=\w\[\d+\]\|0;.*?(\w)=\(\w\|0\)\!=\(\w\|0\);/i,
             degistir:`$& if(isvirus||zagar.skill.other_mass){$3=true}; if(!zagar.ismyblob){zagar.ismyblob=function($1){$& return $3}};`
            }
        ],
        "İnteraktif Color -myblob.size-myblob.totalmass-myblob.selectblob":[
            {bul:/(do\{(\w)=\+\w\[\(\w\[\w>>2\]\|0\)\+\d+>>2\];)(.*?while.*?;\w=(\w);)/i,
             degistir:`zagar.myblob.size=[];$1 zagar.myblob.size.push($2);$3 zagar.myblob.totalmass=$4;
                       if(zagar.myblob.size.length>1){
                          if(zagar.selectblob){zagar.myblob.selectsize=Math.max(...zagar.myblob.size)}else{zagar.myblob.selectsize=Math.min(...zagar.myblob.size)};
                       }else{zagar.myblob.selectsize=zagar.myblob.size[0]};`
            },
            {bul:/\w\[\w>>2\]=\w\+\(\+\w\[(\w)\+\d+>>2\]-\w\)\*\w;/i, degistir:`var nodex=$&; var cellMemOffset=$1;`},
            {bul:/\w\[\w>>2\]=\w\+\w\*\(\+\w\[\w\+\d+>>2\]-\w\);/i, degistir:`var nodey=$&`},
            {bul:/(\w\[\w>>\d\]=\w\?\w:\w;)((\w).*?;)/i, degistir:`var nodesize=$1 $2 if(zagar.skill.interactiv_color){$3=true};`},
            {bul:/(\{(\w)=\w\[\w(\+\d+)?>>2\]\|0;)(\w=\w\}else\{\w=0;\w=0\})/i, degistir:`$1 if(zagar.skill.interactiv_color){$2=0};$4`},
            {bul:/(\w)=-86;(\w)=-86;(\w)=-86;(\w)=-1;(\w)=-1;(\w)=-1\}/i,
             degistir:`$&;
                     var orjstroke=[$1,$2,$3], orjfill=[$4,$5,$6];
                     if(nodesize<=20){
                        if(!zagar.color.foodrainbow){[$1,$2,$3]=[$4,$5,$6]=zagar.color.food.rgb}
                     }else if(zagar.canvas.lineJoin=="miter"){
                        [$1,$2,$3]=[$4,$5,$6]=zagar.color.virus.rgb
                     }else{
                        var lc_ismyblob=false;
                        if(zagar.myblob.isalive && !zagar.myblob.ismycolor){ //play start
                           if(zagar.ismyblob(cellMemOffset)){zagar.myblob.ismycolor=""+$4+$5+$6+"";}
                        };
                        if(zagar.myblob.isalive && zagar.myblob.ismycolor==""+$4+$5+$6+""){ //less CPU: control from the same color
                           if(zagar.ismyblob(cellMemOffset)){
                              lc_ismyblob=true;
                              [$1,$2,$3]=[$4,$5,$6]=zagar.color.mycolor.rgb;
                              if(zagar.myblob.selectsize*0.97<nodesize && nodesize<zagar.myblob.selectsize*1.03){
                                 zagar.myblob.x=nodex; zagar.myblob.y=nodey;
                              }
                           }
                        };
                        if(!lc_ismyblob){ //others
                           var mymass = Math.floor(zagar.myblob.selectsize * zagar.myblob.selectsize / 100), nodemass = Math.floor(nodesize * nodesize / 100);
                           if(!zagar.myblob.isalive){mymass=1000};//spectate
                           if (nodemass > mymass * 1.33*4){ [$1,$2,$3]=[$4,$5,$6]=zagar.color.big4x.rgb}
                           else if (nodemass > mymass * 1.33*2){ [$1,$2,$3]=[$4,$5,$6]=zagar.color.big2x.rgb}
                           else if (nodemass > mymass * 1.33){ [$1,$2,$3]=[$4,$5,$6]=zagar.color.big1x.rgb}
                           else if (nodemass > mymass * 0.75){ [$1,$2,$3]=[$4,$5,$6]=zagar.color.similar.rgb}
                           else if (nodemass > mymass * 0.75/2){ [$1,$2,$3]=[$4,$5,$6]=zagar.color.small1x.rgb}
                           else if (nodemass > mymass * 0.75/4){ [$1,$2,$3]=[$4,$5,$6]=zagar.color.small2x.rgb}
                           else { [$1,$2,$3]=[$4,$5,$6]=zagar.color.small4x.rgb}
                        }
                     };
                     if(!zagar.skill.interactiv_color){[$1,$2,$3]=orjstroke, [$4,$5,$6]=orjfill;}
                     `
            }
        ],
        "No Grid":[
            {bul:/(\w+\(\d+,\w\|0,50\.5,\.5\)\|0;)(\w+\(\d+,\w\|0\)\|0;)/i, degistir:`$1 if(!zagar.skill.no_grid){$2};`}
        ],
        "No Food":[
            {bul:/\}else\{(\w+)=\(\w\[\w\+\d+>>0\]\|0\)==0;/i, degistir:`$& if(!$1 && zagar.skill.no_food){break};`}
        ],
        "Zoom Out & Auto Zoom -zagarzoomvalue":[
            {bul:/;if\((\w)<1\.0\){/i, degistir:`;if($1<!zagar.skill.zoom_out|0){`},
            {bul:/(\w)=\w\*\+\w\(\.9,\+\w\);/i, degistir:`;if(zagar.skill.zoom_out){$1=zagar.zoomvalue};$& zagar.zoomvalue=$1;`},
            {bul:/(\w+\(\w\);\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=\w;)/i, degistir:`$1 if(zagar.skill.auto_zoom){$2}else{$3=zagar.zoomvalue};`}
        ],
        "KeyS Stop":[
            {bul:/setTarget:function\((\w),(\w)\)\{/i,
             degistir:`$& if(zagar.stopmovement){var z=document.getElementById("canvas");$1=z.width/2, $2=z.height/2}`
            }
        ],
        "Fps":[
            {bul:/setFpsCap:function\((\w)\)\{/i,
             degistir:`$& $1=zagar.setFpsCap();`
            }
        ],
        "Connect":[
            {bul:/connect:function\((\w)\)\{/i,
             degistir:`$& zagar.connect($1);`
            }
        ],
        "OnPlayerSpawn":[
            {bul:/\w\.MC\.onPlayerSpawn\)/i,
             degistir:`$& zagar.onPlayerSpawn(),`
            }
        ],
        "OnPlayerDeath":[
            {bul:/\w\.MC\.onPlayerDeath\)/i,
             degistir:`$& zagar.onPlayerDeath(),`
            }
        ]
    };

    var keyj=0, valj=0, isabet=0, bul;
    coretext = coretext.replace(/([,\/;])\n/gm,"$1");
	$.each(addSkill, function(key,obj){keyj++;
		$.each(obj, function(i,value){valj++; bul=false;
			if (value.bul.test(coretext)){isabet++; bul=true;
				coretext = coretext.replace(value.bul, value.degistir);
                                         }
			//console.log(keyj+"."+(i+1), key, bul);
		});
	});
	console.log("zagar isabet:",isabet+"/"+valj);
    $("#mainPanel h2:contains(Agar.io)").parent().html('<h2 style="font-family: Thoma">Zagar Core Mutation</h2><span style="font-family:Thoma; font-size:12px">Inject: ' + isabet + '/' + valj + '</span>');
    $("#mainPanel #nick").before('<div id="zagararena" style="margin-bottom:6px; border:2px solid #DFDFDF; border-radius:5px;"><span style="display:inline-block; border-radius:5px; color:white; font-weight:bold; padding:5px; background-color:#31B0D5; cursor:pointer;">Connect to arena: </span><input style="padding:3px; text-align:center; border:0px; outline:none;" size=20 value=""></div>');
    $("body").append('<canvas id="minimap" width="180" height="180" style="background-color:rgba(0,0,0,0.4); border:1px solid grey; right:10px; bottom:20px; position:absolute;"></canvas>');
    $("body").append('<div id="zagardurum" style="position:absolute; bottom:5px; right:5px; background-color:rgba(0,0,0,0.3); color:#ffffff; line-height:5px; padding-top:10px; padding-left:8px; padding-right:8px;"><table><tr><td id="fps"></td><td>&nbsp;</td><td>&nbsp;</td><td id="piece"></td><td>&nbsp;</td><td>&nbsp;</td><td id="totalmass"></td><td>&nbsp;</td><td>&nbsp;</td><td id="selectblob">selectblob: max</td></tr></div>');
    return coretext;
}