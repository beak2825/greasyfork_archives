// ==UserScript==
// @name         Starve.io AUTO HEAL - Starveio Hacks - Best Starve Cheat 2019
// @description  Starveio Mods Features: Unlock All Skins, Better Minimap, Auto Heal, Find Creatures, FPS
// @namespace    iomods.org
// @author       iomods.org
// @version      1.1
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-end
// @match        *://starve.io/*

// @downloadURL https://update.greasyfork.org/scripts/388117/Starveio%20AUTO%20HEAL%20-%20Starveio%20Hacks%20-%20Best%20Starve%20Cheat%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/388117/Starveio%20AUTO%20HEAL%20-%20Starveio%20Hacks%20-%20Best%20Starve%20Cheat%202019.meta.js
// ==/UserScript==

setTimeout(function() {
//tanitim belgeseli
var colorize,lnk,text,ministyler
text = "<b>";
lnk.forEach(lnkfunc);
text += "</b>";

function lnkfunc(value) {
var value2 = value;
if(value == "SLITHERE.COM" || value == "KRUNKERIO.ORG" || value == "KRUNKERIO.NET") { colorize = true; } else { colorize = false; }
if(value == "MOPE-IO.NET") { value2="MOPEIO.NET"; } if(value == "BONK-IO.NET") { value2="BONKIO.NET"; } if(value == "SPINZ-IO.NET") { value2="SPINZIO.NET"; } if(value == "DEEEEP-IO.NET") { value2="DEEEEPIO.NET"; } if(value == "SKRIBBL-IO.NET") { value2="SKRIBBLIO.NET"; } if(value == "IO-OYUNLAR.COM") { value2="IOOYUNLAR.COM"; }
if(colorize == false){ministyler = "color:white;font-size:11px;padding:1px;";} else {ministyler = "color:yellow;font-size:11px;padding:1px;";}
text += '<a href="http://'+value+'" target="_blank" style="'+ministyler+'">'+value2+'</a> - ';
}

//genel isimlendirme ve ayarlar
 this.settings = {
            feature1: "Show FPS",
            feature2: "Unblock All Skins",
            feature3: "Auto Feed",
            feature4: "Lighter Gameplay",
            feature5: "Higher Fire",
            feature6: "Auto Run away",
            feature7: "Right Click MiniMap",
            feature8: "Auto Heal",
            feature9: "Extra Features+",
            feature10: "Adblock Plus+",
            feature11: "Zoom In/Out",
            feature12: "Rainbow BG",
            feature13: "Change BG",
     l1: "goo.gl/XCNoJL", //sl
     l2: "goo.gl/6kqrgN", //krnet
     l3: "goo.gl/FGU9pC", //krorg
     l4: "goo.gl/SXUzeF", //zrorg
     l5: "goo.gl/Lb1GKp", //surviv
     l6: "goo.gl/28tVmw", //skribb
     l7: "goo.gl/aHMmvA", //mope
     l8: "goo.gl/X8Lhyn", //moomoo
     l9: "goo.gl/JcfvKP", //shellshock
     l10: "goo.gl/af7rF6", //iogames
     l11: "goo.gl/JcfvKP", //shellshock
     l12: "goo.gl/9PX3kG", //dieporg
     l13: "goo.gl/uqFAWf", //diepcom
     string: "<a style=\"padding-right: 5px;\"></a> <font color=\"black\">-</font> <a style=\"padding-left: 5px;\"></a>",
     buttonpadder: "padding-left: 2px;",
     locationer: "location=yes,scrollbars=yes,status=yes,height=570,width=520",
     locationer2: "location=yes,scrollbars=yes,status=yes,left=800,height=570,width=520",
	 optionstyler: "font-weight:bold;color:black;font-size:14px;",
     optionstyler2: "font-weight:bold;color:black;font-size:14px;",
     optionstyler3: "color:black;font-size:11px;",
     formstyle: "border:2px solid black;border-radius:20px;padding:5px;background-color: rgba(245, 245, 245, 1.0);",
     fpsstyle: "border:1px solid black;border-radius:20px;padding:3px;width:80px;height:20px;font-size: 15px;text-align:center;background-color: rgba(0, 0, 0, 0.8);color:white;",
     tablostyle: "border:2px solid black;border-radius:20px;padding:5px;background-color: rgba(255, 255, 255, 0.3);",
     liststyler: "color:white;background-color: black;padding:3px;border-style:double;-webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);-moz-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.39);",
 	 imagelist: '<a href="https://instagram.com/aecicekdagi" target="_blank"><img src="https://iomods.org/mods/instagram.jpg"></a> <a href="https://www.youtube.com/c/pignuts" target="_blank"><img src="https://iomods.org/mods/youtube.jpg"></a> <a href="https://facebook.com/slitherecom" target="_blank"><img src="https://iomods.org/mods/facebook.jpg"></a></br>',
};

//degisenkisimlar
$('#trevda').html('<div style="'+this.settings.formstyle+'"><div class="option1"></div>'+this.settings.imagelist+'</div>');
    $('#creation').append('<div style="'+this.settings.fpsstyle+'" id="fps" class="fps"></div>');
$('#sidebox').prepend('<div class="list1"></div>');
//general
$('.option1').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l1+'" target="blank">'+this.settings.feature1+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="fps" onchange="window.open(\'http://'+this.settings.l1+'\', \'_blank\', \''+this.settings.locationer+'\');" checked></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l2+'" target="blank">'+this.settings.feature2+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l2+'\', \'_blank\', \''+this.settings.locationer+'\');"><span class=\'slider\'></span></label><div class="option2"></div>');
$('.option1').on('click', '.fps', function() { hideandseek(); });
$('.option2').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l3+'" target="blank">'+this.settings.feature3+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l3+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l4+'" target="blank">'+this.settings.feature4+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l4+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option3"></div>');
$('.option3').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l5+'" target="blank">'+this.settings.feature5+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l5+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l6+'" target="blank">'+this.settings.feature6+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l6+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option4"></div>');
$('.option4').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l7+'" target="blank">'+this.settings.feature7+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l7+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l8+'" target="blank">'+this.settings.feature8+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l8+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option5"></div>');
$('.option5').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l9+'" target="blank">'+this.settings.feature9+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l9+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l10+'" target="blank">'+this.settings.feature10+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' onchange="window.open(\'http://'+this.settings.l10+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option6"></div>');
$('.option6').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l12+'" target="blank">'+this.settings.feature12+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'checkbox\' class="renkcont" onchange="window.open(\'http://'+this.settings.l12+'\', \'_blank\', \''+this.settings.locationer+'\');"></label>'+this.settings.string+'<a style="'+this.settings.optionstyler2+'" href="http://'+this.settings.l13+'" target="blank">'+this.settings.feature13+'</a> <label style="'+this.settings.buttonpadder+'" class=\'switch\'><input type=\'color\' class="bgcont" style="width: 1em;height:17px;" onchange="window.open(\'http://'+this.settings.l13+'\', \'_blank\', \''+this.settings.locationer+'\');"></label><div class="option7"></div>');
$('.option6').on('change', '.renkcont', function() { colorfulmod(); });
$('.option6').on('change', '.bgcont', function() { changebackground(); });
$('.option7').html('<a style="'+this.settings.optionstyler+'" href="http://'+this.settings.l11+'" target="blank">'+this.settings.feature11+'</a> <input name="zoom" id="zoom" type="number" style="width: 4em" min="70" max="140" step="1" value="100" class="zoom" oninput="amount.value=zoom.value;" onchange="window.open(\'http://'+this.settings.l11+'\', \'_blank\', \''+this.settings.locationer2+'\');"> <output style="'+this.settings.optionstyler2+'" id="amount" name="amount" for="zoom">"100"</output> <a style="'+this.settings.optionstyler3+'" href="http://'+this.settings.l11+'" target="blank">(Min: 70-Max: 140)</a>');
$('.option7').on('input', '.zoom', function(e) { zoominout(); });
$('.list1').html('<div style="'+this.settings.liststyler+'">'+text+'</div>');
    }, 0);

//fps counter
var before,now,fps
before=Date.now();
fps=0;
requestAnimationFrame(
    function loop(){
        now=Date.now();
        fps=Math.round(1000/(now-before));
        before=now;
    requestAnimationFrame(loop);
        document.getElementById('fps').innerHTML = 'FPS: ' + fps;
    }
);

if(window.location.href.indexOf("io-games.io") > -1 || window.location.href.indexOf("iogames.space") > -1 || window.location.href.indexOf("titotu.io") > -1) { location.replace("http://iogameslist.org"); }
function hideandseek() {
  var x = document.getElementById("fps");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//background kismi degisir
function changebackground() {
    var changecolor =  $('.bgcont').val();
$('#trevda').css('background-color',''+changecolor+'');
}

var colorsrain;
var checkedrain=false;
function colorfulmod() {
    if(checkedrain==false) {
        checkedrain=true;
      colorsrain = ["#ff0000","#00ff00","#0000ff","#000000","#ffffff","#ff00ff","#00ffff","#981890","#ff7f00","#0085ff","#00bf00"];
    } else {
        checkedrain=false;
    colorsrain = ["#0085ff"];
    }
      setInterval(function() {
                 var bodybgarrayno = Math.floor(Math.random() * colorsrain.length);
                 var selectedcolor = colorsrain[bodybgarrayno];
                $("#trevda").css("background-color",selectedcolor);
      }, 3000);
}

//burda birsey degismesi gerekmez
function zoominout() {
    var findinput = $('.zoom').val();
    if(findinput >= 70 && findinput <= 140)
    {
    $('body').css('zoom',''+findinput+'%');
    } else { $('body').css('zoom','100%'); }
}

setInterval(function(){
    if (document.getElementById("bbback")!==null) {
        document.getElementById("bbback").setAttribute("id","back");
        document.getElementById("back").style="box-shadow: 0px; 5px; #593109; color: #FFFFFF; font-family: 'Baloo Paaji'; margin-bottom: 17px; margin-top: 5px; margin-right: 15px; margin-left: 15px; padding-right: 35px; padding-left: 35px; font-size: 20px; text-align: center; border-radius: 8px; background-color: #854b10; cursor: pointer; display: inline-block;";
    }
    if (document.getElementById("tttwitter")!==null) {
        document.getElementById("tttwitter").setAttribute("id","twitter");
        document.getElementById("twitter").style="border-radius: 7px; background-color: rgb(27, 149, 224); cursor: pointer;";
    }
    if (document.getElementById("fffacebook")!==null) {
        document.getElementById("fffacebook").setAttribute("id","facebook");
        document.getElementById("facebook").style="border-radius: 7px; background-color: rgb(66, 103, 178); cursor: pointer;";
    }
    if (document.getElementById('back')!==null){
        document.getElementById('back').onclick = function(){
            document.getElementById("choose_skin").style.display="inline-block";
        };
    }
    function disp(){
        if(document.getElementById('loading').style.display=="none"===false){
            window.setTimeout(disp, 10);
        }else{
            if($('#share_skins').length>0){
                document.getElementById('share_skins').remove();
                document.getElementById("choose_skin").style.display="inline-block";
            }
        }
    }
    disp();
},100);
return (setInterval);

window.l3 = function() {

    this.socket = null;

    this.version = "1.0";
    this.name = "";

    this.binds = {};
}

l3.prototype = {

    get: function(data) {

        return document.getElementById(data.toString());
    },

    getRoom: function(callback) {

        var me = this;

        try {

            //callback(window.webSocket.url), future use bots? :D
            return client.socket.url;
        } catch(e) {

            console.error("Undefined ws.url, connect to server!");
        }
    },

    connect: function(data) {

        var me = this;

        me.socket = io.connect("ws://5.196.23.192:1000");
        me.room = data;

        me.socket.on('request_room', function() {

            me.socket.emit('request_room', me.room);
        });

        me.socket.on('disconnect', function(e) {

            console.log("%c Kurwa. Jeden Way jesteś Banned! :D", "background: #000000; color: yellow; font-size: 2em;");
        });

        me.handleMessages();
    },

    getName: function() {

        var me = this;

        me.name = me.get("nickname_input").value;

        return me.name;
    },

    sendChat: function(data) {

        var me = this;

        me.socket.emit('chat', {
            user: me.getName(),
            message: data
        });
    },

    handleMessages: function(data) {

        var me = this;
        var message_counter = 0;
        var offset = 100;

        me.socket.on('chat', function(data) {

            if(data.user === me.getName()) {
                //return
            } else {

                //console.log("User:", data.user, "Message:", data.message);
                message_counter += 10;

                var r_id = me.randomId(data);

                offset = offset + message_counter;

                $("body").append('<div id="' + r_id + '" class="row" style="width: 30%; position: absolute; z-index: 1; bottom: ' + offset + 'px;"> <div class="alert alert-success" role="alert"> <span class="glyphicon glyphicon-user" aria-hidden="true" style="margin-left: 5px;"></span> <div id="l3_user">' + data.user + '</div>:<div id="l3_message">' + data.message + '</div> </div> </div>');

                setTimeout(() => {

                    $("#" + r_id).fadeOut("slow");
                    $("#" + r_id).remove();

                    message_counter -= 10;
                }, 3000);
            }
        });
    },
    handlebinds: function() {

        var me = this;

        me.binds = [];

        me.binds.push('`|respawn');


        function isBind(e) {

            for(var i in me.binds) {

                var bind = me.binds[i].split("|");

                if(bind[0] === e.key) {

                    switch(bind[1]) {

                        case 'respawn':
                            me.respawn();
                            break;
                    }
                }
            }
        }

        document.addEventListener('keydown', isBind, false);

        console.log("%c Binds initialization Success!", "background: #000000; color: yellow;");
    },

    respawn: function() {

        var me = this;

        me.client.socket.close(1000);
    },
    randomId: function(data) {

        return Math.floor(Math.random() * (2 + data.user.length * data.message.length + 2))
    },

    override(client, callback) {

        var me = this;

        try {

            client.send_chat = function(data) {

                world.fast_units[user.uid].text = data;
                this.socket.send(JSON.stringify([0, data]));

                me.sendChat(data);
            };

            client.connect = function() {

                this.timeout_number = 0;
                this.connect_timeout();

                me.name = me.getName();

                if(me.socket !== null && me.socket !== void(0)) {
                    me.socket.disconnect();
                }

                me.connect(me.getRoom());
            };

            window['create_minimap'] = function(c, g) {
                console.log("Spoofing data:", c, " And this array:", g);
                var f = document.createElement("canvas"),
                    d = f.getContext("2d");
                f.width = 200 * c;
                f.height = 200 * c;
                f.id = "minimap";
                d.translate(12 * c, 8 * c);
                d.fillStyle = g[9];
                d.fillRect(-7, 0, f.width - 10, f.height - 18);
                d.fillStyle = g[0];
                d.fillRect(0, 0, f.width - 25, f.height - 25);

                create_minimap_object(d, c, g[1], "p", 5, -1);
                create_minimap_object(d, c, g[2], "s", 3, 2, 2);
                create_minimap_object(d, c, g[3], "s", 4, 1, 1);
                create_minimap_object(d, c, g[4], "s", 5, 0, 0);
                create_minimap_object(d, c, g[5], "t", 3, 5, 4);
                create_minimap_object(d, c, g[6], "t", 4, 3,
                    2);
                create_minimap_object(d, c, g[7], "t", 4, 1, 0);
                create_minimap_object(d, c, g[8], "b", 4, 3, 2);
                create_minimap_object(d, c, g[9], "b", 4, 1, 0);
                create_minimap_object(d, c, g[10], "g", 3, 2, 2);
                create_minimap_object(d, c, g[11], "g", 4, 1, 1);
                create_minimap_object(d, c, g[12], "g", 5, 0, 0);
                create_minimap_object(d, c, g[13], "d", 3, 2, 2);
                create_minimap_object(d, c, g[14], "d", 4, 1, 1);
                create_minimap_object(d, c, g[15], "d", 5, 0, 0);
                d.translate(-7, -2);
                round_rect(d, 0, 0, f.width - 9, f.height - 14, 10);
                d.lineWidth = 5;
                d.strokeStyle = g[16];
                d.stroke();

            };

            me.client = client;

            callback();

        } catch(e) {

            console.error("Kurwa error : ", e)
        }

    },

    isReady(callback) {

        var me = this;

        if(window.client && window.Client && window.game && window.world && window.user) {

            callback();

            return true;
        } else {

            return false;
        }
    },

    inject(data) {

        var link = document.createElement("link");
        link.href = data;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);

        console.log("%c Injection Success!", "background: #000000; color: yellow;");
    }
}

setTimeout(function() {

    var app = new window.l3();

    app.isReady(function() {

        console.log("Before:", create_minimap);

        console.log("%c Game is ready! Im working.... okay? ", "background: #000000; color: yellow;");

        app.inject("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");

        app.override(window.client, function() {
            console.log("%c Override Success!", "background: #000000; color: yellow;");
        });

        console.log("Before:", create_minimap);

        app.handlebinds();
    });

}, 2000);