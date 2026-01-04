// ==UserScript==
// @name         2.0
// @namespace    2.0
// @version      1.5
// @description  Use for good please play more the game with this script.
// @author       Hacker
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395051/20.user.js
// @updateURL https://update.greasyfork.org/scripts/395051/20.meta.js
// ==/UserScript==

window.UIList.push({

    level: 2,
    x: 1,
    html: '<div onclick=bots()>Bots</div>'
},{
    level: 2,
    x: 0,
    html: '<div onclick=add()>+</div>'
},{
    level: 2,
    x: 2,
    html: '<div onclick=kill()>-</div>'
},{
    level: 2,
    x: 4,
    html: '<div onclick=msg()>Bot msg</div>'
});

window.sockets = [];
function init() {
    window.add = function() {
        

            BotAmout(xy,name);
           var xy = parseInt(prompt("QUANTIDADE BOT"));
            var name = prompt("NOME DOS BOT...");
            BotAmout(xy, name);
            alert("Bots COLOCADO...");
        }
    window.kill = function() {
            socketClose();
            window.sockets = [];
            alert("Bots eliminados");
    }
    window.msg = function() {
            var x = prompt("Bots falará...");
            sendChatMessage(x);
    }
    window.unlockSkins();
            function newSocket(botName) {
        $.get("/getIP", {
            sip: lobbyURLIP
        }, function(data) {
window.socketBot = io.connect("http://" + data.ip + ":" + data.port, {
                "connect timeout": 0,
                reconnection: true,
                query: "cid=" + UTILS.getUniqueID() + "&rmid=" + lobbyRoomID
            });
            window.sockets.push(window.socketBot);
            spawnBot(botName);
        });
    }

    function BotAmout(number, botName) {
        for (var i = 0; i < number; i++) {
            newSocket(botName);
        }
    }
    function spawnBot(nameBot) {
        window.sockets.forEach(socket => {
            socket.emit("spawn", {
                 name: nameBot + "",
                skin: 0
            });
        });
    }
    function generateRandomBlocks() {

        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
// ==UserScript==
// @name         Defend Auto Base de 179 Soldiers
// @namespace    -
// @version      1.5
// @description  HIHIHIHIHI
// @author       Coelho
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoDefense = false;
window.UIList.push({
level: 1,
    x: 5,
    html: '<div id=auto onclick=autodefense()>base dos bot: Active</div>'
});
window.autodefense = function () {
    var elaa = document.getElementById('auto');
    if (autoDefense) {
        autoDefense = false
        elaa.textContent = ' Base: Off'
        clearInterval(teste)
    } else {
        autoDefense = true;
        elaa.textContent = 'Base: On';
        window.teste = setInterval(autodefesa, 250)
        function autodefesa() {

        setTimeout(function() {
            gens1();
        }, 1000);
        setTimeout(function() {
            gens1();
        }, 10000);
        setTimeout(function() {
            gens1();
        }, 20000);
        setTimeout(function() {
            gens1();
        }, 30000);
        setTimeout(function() {
            gens1();
        }, 50000);
        setTimeout(function() {
            gens1();
        }, 55000);
        setTimeout(function() {
            cam311();
        }, 80000);
        setTimeout(function() {
            micro();
        }, 93000);
          setTimeout(function() {
            power1();
        }, 105000);
            setTimeout(function() {
            power1();
        }, 115000);
            setTimeout(function() {
            power1();
        }, 125000);
            setTimeout(function() {
            power1();
        }, 135000);
            setTimeout(function() {
            power1();
        }, 175000);
         setTimeout(function() {
           barraca1();
        }, 200000);
        setTimeout(function() {
           barraca2();
        }, 210000);
          setTimeout(function() {
           barraca3();
        }, 240000);
          setTimeout(function() {
           Amory();
        }, 260000);
      setTimeout(function() {
           Amory();
        }, 260000);
        setTimeout(function() {
           Amory();
        }, 270000);
          setTimeout(function() {
           Amory();
        }, 280000);
       setTimeout(function() {
           gerador();
        }, 300000);
          setTimeout(function() {
           House();
        }, 310000);
          setTimeout(function() {
          UP();
        }, 320000);
          setTimeout(function() {
           UP1();
        }, 330000);
                  setTimeout(function() {
           Sell();
        }, 350000);
         setTimeout(function() {
           barraca4();
        }, 360000);
        setTimeout(function() {
           barraca5();
        }, 365000);


    }
    };

    function gens1() {
        socket.emit("1",4.73,245,3);
                socket.emit("1",5.0025,245,3);
                socket.emit("1",5.275,245,3);
                socket.emit("1",5.5475,245,3);
                socket.emit("1",5.82,245,3);
                socket.emit("1",6.0925,245,3);
                socket.emit("1",6.365,245,3);
                socket.emit("1",6.6375,245,3);
                socket.emit("1",6.91,245,3);
                socket.emit("1",7.1825,245,3);
                socket.emit("1",7.455,245,3);
                socket.emit("1",7.7275,245,3);
                socket.emit("1",8.0025,245,3);
                socket.emit("1",8.275,245,3);
                socket.emit("1",8.5475,245,3);
                socket.emit("1",8.82,245,3);
                socket.emit("1",9.0925,245,3);
                socket.emit("1",9.3675,245,3);
socket.emit("1",9.64,245,3);
                socket.emit("1",9.9125,245,3);
                socket.emit("1",10.1875,245,3);
                socket.emit("1",10.4625,245,3);
                socket.emit("1",10.7375,245,3);
                socket.emit("1",4.5889,186.5,);
                socket.emit("1",5.085,180.5,);
                socket.emit("1",5.64,180,3);
                socket.emit("1",5.999,180,3);
                socket.emit("1",6.51,185,3);
                socket.emit("1",7.05,185,3);
                socket.emit("1",7.6,185,3);
                socket.emit("1",8.15,185,3);
                socket.emit("1",8.675,185,3);
                socket.emit("1",9.225,185,3);
socket.emit("1",9.78,185,3);
                socket.emit("1",10.325,185,3);
                socket.emit("1",4.81,130,);
                socket.emit("1",5.36,130,3);
                socket.emit("1",6.275,130,3);
                socket.emit("1",6.775,130,3);
                socket.emit("1",7.3,130,3);
                socket.emit("1",7.85,130,3);
                socket.emit("1",8.4,130,3);
                socket.emit("1",8.925,130,3);
                socket.emit("1",9.5,130,3);
                socket.emit("1",10.05,130,3);
                socket.emit("1",10.6,130,);
socket.emit("1",4.725,130,7);
    }

    function cam311() {
                       socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,);
    }
 function barraca2() {


                socket.emit("1",11.93,311,8);
    }

    function micro() {

               for(i=0;i<units.length;++i){
            if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,1);
            }
        }
    }

    function power1() {
for(i=0;i<units.length;++i){
            if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
       function barraca1() {
 for(i=0;i<units.length;++i)2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

  function barraca3() {
       for(i=0;i<units.length;++i)2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,2)}

    function Amory() {
 for (i = 0; i < units.length; ++i) { //armory upgrade
                    if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {
                        socket.emit("4", units[i].id, 0);
            }
        }
    }
                 function gerador(){
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
 function House() {
                            socket.emit("1",4.725,130,7);
                socket.emit("1",5.245,130,1);
                socket.emit("1",5.715,130,4);
                socket.emit("1",6.185,130,4);
                socket.emit("1",6.655,130,4);
                socket.emit("1",7.13,130,4);
                socket.emit("1",7.6,130,4);
                socket.emit("1",1.85,130,4);
                socket.emit("1",2.32,130,4);
                socket.emit("1",2.79,130,4);
                socket.emit("1",3.265,130,4);
                socket.emit("1",3.735,130,4);
                socket.emit("1",4.205,130,1);
                socket.emit("1",5.06,185,1);
                socket.emit("1",5.4,185,4);
                socket.emit("1",5.725,190,4);
                socket.emit("1",6.045,186,4);
                socket.emit("1",6.374,185,4);
                socket.emit("1",6.7215,189.5,4);
                socket.emit("1",7.0425,188.5,4);
                socket.emit("1",7.365,185,4);
                socket.emit("1",7.712,187.45,4);
                socket.emit("1",8.035,188.5,4);
                socket.emit("1",8.36,185,4);
                socket.emit("1",2.425,188,4);
                socket.emit("1",2.75,190,4);
                socket.emit("1",3.075,184,4);
                socket.emit("1",3.42,186,4);
                socket.emit("1",3.74,190,4);
                socket.emit("1",4.06,186,4);
                socket.emit("1",4.39,185,1);
                socket.emit("1",4.8625,245,1);
                socket.emit("1",5.1125,245,4);
                socket.emit("1",5.3625,245,4);
                socket.emit("1",5.6125,245,4);
                socket.emit("1",5.8625,245,4);
                socket.emit("1",6.1125,245,4);
                socket.emit("1",6.3625,245,4);
                socket.emit("1",6.6125,245,4);
                socket.emit("1",6.8625,245,4);
                socket.emit("1",7.14,245,4);
                socket.emit("1",7.39,245,4);
                socket.emit("1",7.64,246,4);
                socket.emit("1",7.89,246,4);
                socket.emit("1",8.14,246,4);
                socket.emit("1",8.39,246,4);
                socket.emit("1",8.635,246,4);
                socket.emit("1",8.885,246,4);
                socket.emit("1",2.5825,245,4);
                socket.emit("1",2.8625,245,4);
                socket.emit("1",3.1125,245,4);
                socket.emit("1",3.3625,245,4);
                socket.emit("1",3.6125,245,4);
                socket.emit("1",3.8625,245,4);
                socket.emit("1",4.1125,245,4);
                socket.emit("1",4.3625,245,4);
                socket.emit("1",4.3625,245,1);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
                socket.emit("1",4.725,130,1);
                socket.emit("1",5.245,130,1);
                socket.emit("1",5.715,130,1);
                socket.emit("1",6.185,130,1);
                socket.emit("1",6.655,130,1);
                socket.emit("1",7.13,130,1);
                socket.emit("1",7.6,130,1);
                socket.emit("1",1.85,130,1);
                socket.emit("1",2.32,130,1);
                socket.emit("1",2.79,130,1);
                socket.emit("1",3.265,130,1);
                socket.emit("1",3.735,130,1);
                socket.emit("1",4.205,130,1);
                socket.emit("1",5.06,185,1);
                socket.emit("1",5.4,185,1);
                socket.emit("1",5.725,190,1);
                socket.emit("1",6.045,186,1);
                socket.emit("1",6.374,185,1);
                socket.emit("1",6.7215,189.5,1);
                socket.emit("1",7.0425,188.5,1);
                socket.emit("1",7.365,185,1);
                socket.emit("1",7.712,187.45,1);
                socket.emit("1",8.035,188.5,1);
                socket.emit("1",8.36,185,1);
                socket.emit("1",2.425,188,1);
                socket.emit("1",2.75,190,1);
                socket.emit("1",3.075,184,1);
                socket.emit("1",3.42,186,1);
                socket.emit("1",3.74,190,1);
                socket.emit("1",4.06,186,1);
                socket.emit("1",4.39,185,1);
                socket.emit("1",4.8625,245,1);
                socket.emit("1",5.1125,245,1);
                socket.emit("1",5.3625,245,1);
                socket.emit("1",5.6125,245,1);
                socket.emit("1",5.8625,245,1);
                socket.emit("1",6.1125,245,1);
                socket.emit("1",6.3625,245,1);
                socket.emit("1",6.6125,245,1);
                socket.emit("1",6.8625,245,1);
                socket.emit("1",7.14,245,1);
                socket.emit("1",7.39,245,1);
                socket.emit("1",7.64,246,1);
                socket.emit("1",7.89,246,1);
                socket.emit("1",8.14,246,1);
                socket.emit("1",8.39,246,1);
                socket.emit("1",8.635,246,1);
                socket.emit("1",8.885,246,1);
                socket.emit("1",2.5825,245,1);
                socket.emit("1",2.8625,245,1);
                socket.emit("1",3.1125,245,1);
                socket.emit("1",3.3625,245,1);
                socket.emit("1",3.6125,245,1);
                socket.emit("1",3.8625,245,1);
                socket.emit("1",4.1125,245,1);
                socket.emit("1",4.3625,245,1);
                socket.emit("1",4.6125,245,1);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,1);
                socket.emit("1",10.49,311,1);
                socket.emit("1",11.51,311,1);
                socket.emit("1",11.93,311,1);
     };
  function UP() {
                 for(i=0;i<units.length;++i){
            if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
     }
         function UP1() {
        for(i=0;i<units.length;++i){
            if(3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
     }


      function Sell() {
        for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Siege Factory' && a.push(units[d].id);
    socket.emit("3", a)
            }

 function barraca4() {


                socket.emit("1",11.93,311,8);
    }
 function barraca5() {

for(i=0;i<units.length;++i)2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

             }

    window.statusBar();
    return autoDefense()

        });
}

    addEventListener("keydown", function(ev) {
        if (ev.keyCode == 32) {
            generateRandomBlocks();
        }
    });
    function sendChatMessage(str) {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.emit("ch", str);
        });
    }

    addEventListener("keydown", function(ev) {
        if (ev.keyCode == 00) {
            var y = prompt("Bots vão falar:");
            sendChatMessage(y)
        }
        if (ev.keyCode === 0) {
            var xy = parseInt(prompt("Número de BOTs: 55"));
            var name = prompt("Nome dos BOTs:")
            BotAmout(xy, name);
        }
        if (ev.keyCode == 00) {
            socketClose();
            window.sockets = [];
        }
        if (ev.keyCode == 0) {
            alert("F2:Cria Full Gens\nF4:Ativa os BOTs\nF6:Desativa Bots\nF7:Use para os BOTs falarem INTERRUPT\nBOTs ativos: \nF9:Use para os BOTs falarem" + window.sockets.length);
        }
        if (ev.keyCode == 81) {
            generateRandomBlocks();
        }
    });


    function socketClose() {
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
            socket.close();
        });
    }
        }

        if (window.scroll == 1) {
            if (maxScreenHeight > 1080) {
                (maxScreenHeight -= 250, maxScreenWidth -= 250, resize(true))
                window.scroll = 0
            }
        }

    function updatePlayer() {
        socket.emit("2", 0, 0);
        socket.emit("2", Math.round(camX), Math.round(camY));
    }

init();
