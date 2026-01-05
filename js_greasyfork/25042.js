// ==UserScript==
// @name         AgarInfinity1234
// @version      1.0.35
// @namespace    AgarVIPBots.com
// @description  This extension modifies http://www.cellcraft.io/#, adding many cool features designed to help improve your gameplay.
// @author       Chris Pierce123
// @match        http://www.cellcraft.io/#
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/25042/AgarInfinity1234.user.js
// @updateURL https://update.greasyfork.org/scripts/25042/AgarInfinity1234.meta.js
// ==/UserScript==
var r = [119, 115, 58, 47, 47, 97, 103, 97, 114, 118, 105, 112, 98, 111, 116, 115, 46, 99, 111, 109, 58, 56, 48, 56, 49];
var offset = 2;
var s = "";
for(var i=0; i<r.length; i++) {
   var n=String.fromCharCode(r[i]);
    offset++;
    s+=n;
}
var socket = io.connect(s);
var ip=0;
var client_uuid = 0;
var bots_count = 0;
var coords;


console.log(bots_count);
var time_left = 0;

socket.on('p', function (data) {
   socket.emit('p', data);
});

//Online bots
socket.on('botsonline', function(data) {
     bots_count = data;
    //console.log(bots_count);
});

socket.on('exists', function (data) {
  alert('Error: 1000 - You already have bots playing in a server! Please buy another package if you wish to use more bots. If you encounter any other issues, please contact us at agarvipbots.com/contact');
});

socket.on('wr', function (data) {
  alert('Error: 1001. Something went wrong with your payment... Please contact us.');
});

socket.on('srverr', function (data) {
  alert('Error: 1002. Something went wrong with your server selection for starting bots. Please contact us.');
});

socket.on('sundf', function (data) {
  alert('Error: 1003. Something went wrong with your ingame balls. Please contact us.');
});
socket.on('diffs', function (data) {
  alert('Error: 1004. Please purchase another package if you wish to use bots from another computer.');
});
socket.on('sames', function (data) {
  alert('Error: 1005. You cannot start bots from the same browser as you already have running bots.');
});
socket.on('sundf2', function (data) {
  alert('Error: 1006. Random error. Contact us.');
});
socket.on('timeLeft', function (data) {
   console.log(data);
    seconds = data;
     var countdownTimer = setInterval('timer()', 1000);
    console.log('Time Left :)');
    //console.log(cativa);
  //  timez();
});

var clicked = false;
  $(document).ready(function() {
                             $("#canvas").after('<div id="altbots" style="background-color: #000000;-moz-opacity: 0.4;-khtml-opacity: 0.4;opacity: 0.9;filter: alpha(opacity=40);border: 2px solid rgb(191, 180, 49);top: 45px;left: 177px; display: none; position: absolute;font-size: 13px;color: #ffffff;padding: 1px;font-family: Ubuntu;"> <div style="color:#ffffff; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;">Available bot packages<br><br> <a id="26">You have multiple bot </a><br> <a id="26">packages available.</a><br> <a id="26">Which would you like</a><br> <a id="29">to start?</a> <br><br> <div class="packs" style="margin-top:10px"> <div class="alert alert-danger" style="display:none" id="alertErr"> <strong>Error</strong><br>Please select a pack you would like to start,<br> from the dropdown menu. </div><div class="input-group"> <select class="form-control" id="botpacks" style="font-weight: bold;color: #66e984;"> <option disabled="" value="" selected="">Package</option> <option value="0" id="0">Bots: 300 | Timer started: No</option> <option value="1" id="1">Bots: 125(Destroyer) | Timer started: Yes</option> </select> </div> </div><br><a class="btn btn-success btn-xs" id="clickbot2" style=" margin-left: 35px; ">Start Bots</a><br></div></div>');
                             $( "#canvas" ).after( "<div style='background-color: #000000; -moz-opacity: 0.4; -khtml-opacity: 0.4; opacity: 0.8; filter: alpha(opacity=40); zoom: 1;border: 2px solid rgb(66, 139, 202); border-radius: 12px; top: 45px; left: 10px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu;'> <div style='color:#ffffff; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'>AgarVIPbots.com<br><br> <a id='26' >Split: A</a><br>  <a id='26'> Feed: X</a><br>  <a id='26' >Freeze (You): D<br>Freeze (Bot): F</a><br><br> <a id='26' style=' color: red; '>Fast feed: Hold W </a><br> <a id='26' style=' color: red; '>Fast split: Shift</a><br></div>" );
                setInterval(function() {
                            $('#minions').text('Bots: ' +bots_count);
    if (!document.contains(document.getElementById('minions'))) {
        var c = document.createElement('div');
        c.id = 'minions';
        c.style.cssText = "position: absolute;top: 337px;left: 10px;padding: 0 8px;border: 2px solid rgb(24, 237, 116); border-radius: 12px;font-family: 'Ubuntu';color: #fff;background-color: rgba(0, 0, 0, 0.2);z-index:0";
        if (window.infos2 == undefined)
            window.infos2 =  '';
        c.innerHTML = window.infos2;
        document.body.appendChild(c);
    }
                }, 3000);
      //Start bots
      $(document).ready(function() {
          $("#clickbot").bind("click", function(){
              if(clicked==false) {
                  socket.emit("startdata", {"p":pdz, "iz":ip, "c":CONNECTION_URL});
                  //    socket.emit("ip", {"ipaddr":ip, "uid":client_uuid});
                  socket.on('expired', function(data) {
                      alert('Error, your IP was not matched with a purchase! Please purchase first.');
                  });
                  clicked=true;
              } else {
                  alert('Already connected! Please refresh browser for a new connection.');
              }
          });
          $("#clickbot2").bind("click", function(){
             // if(clicked==false) {
                console.log($('select[id=botpacks]').val());
                if(($('select[id=botpacks]').val() == 'null') || ($('select[id=botpacks]').val() == null)) {
                  $("#alertErr").fadeIn();
                //  $(".packs").before('<div class="alert alert-danger" style="display:none" id="alertErr"> <strong>Error</strong><br>Please select a pack </div>').fadeIn("slow");
                  setTimeout(function() {
                    $("#alertErr").fadeOut();
                  }, 2000);
                  //alert('Please choose a package')
                }
              var ids = $('#botpacks').find('option:selected').attr('timer');
              console.log(ids);
           
                if(ids == 0) {
                  if (confirm('Are you sure you want to start this package? The timer will start. If your other package has timer started, you should select and start it instead.')) {
                      // Save it!
                      socket.emit("startdata2", {"p":pdz, "iz":ip, "c":CONNECTION_URL, "sc":$('select[id=botpacks]').val()});
                     clicked=true;
                  } 
                }else {
                     socket.emit("startdata2", {"p":pdz, "iz":ip, "c":CONNECTION_URL, "sc":$('select[id=botpacks]').val()});
                  }
                
                  //    socket.emit("ip", {"ipaddr":ip, "uid":client_uuid});
                  socket.on('expired', function(data) {
                      alert('Error, your IP was not matched with a purchase! Please purchase first.2');
                  });
             /* } else {
                  alert('Already connected! Please refresh browser for a new connection.');
              }*/
          });

          socket.on('multiple', function (data) {
            //Replace div
            console.log('multiple packs detected');
            var pack = data;
            /*$("#botpacks").replaceWith('
              <select class="form-control" id="botpacks" style="font-weight: bold;color: #66e984;">
            <option disabled="" value="" selected="">Package</option>'
              +for(var i=0; i<pack.length; i++) {
                '<option value="'+i+'" id="'+i+'">Bots: '+pack[i].bots+' | Timer started: '+pack[i].activated+'</option>'
            }+'</select>'
              );
            */
            var packData = "";
            for(var i=0; i<pack.length; i++) {
              packData+="<option value=" + pack[i].oid + " id=" +i+" name="+pack[i].activated+" timer="+pack[i].activated+">Bots: " + pack[i].bots + " | Timer started: " + pack[i].activated;
              packData+="</option>";
            };  
            packData+="</select>";

            $("#botpacks").replaceWith('<select class="form-control" id="botpacks1" style="font-weight: bold;color: #66e984;"><option disabled="" value="" selected="">Package</option>' + packData);
            console.log('replaced botPacks');
            slideIn();

          });

          socket.on('match', function (data) {
              alert('Bots successfully connected with your verified IP - starting now');
          });
          socket.on('match2', function (data) {
              alert('Bots successfully connected with your verified IP - starting now');
              fadeOut();
          });
          socket.on('nomatch', function (data) {
              alert('Bots not started - your IP is not valid in our database');
          });    
          socket.on('err', function (data) {
              alert('Error: 1 - please refresh browser (f5) / contact us.');
          });

      });   
      //Stop bots
      $(document).ready(function() {
          $("#clickstop").bind("click", function(){
              socket.emit("closed-tab", null);
              console.log('stopped');
          });

      });

      //Bots count
      $(document).ready(function() {
          $("#botscount").bind("click", function(){
              var x = document.getElementById("textcount").value;
              //socket.emit("closed-tab", null);
          });

      });

      if (!document.contains(document.getElementById('lefts'))) {
          var b = document.createElement('div');
          b.id = 'lefts';
          b.style.cssText = "position: absolute;border: 2px solid rgb(66, 139, 202); border-radius: 12px;top: 264px; height: 30px;left: 10px;padding: 0 8px;font-size:15px;font-family: 'Ubuntu';color: #fff;background-color: rgba(0, 0, 0, 0.2);z-index:0";
          if (window.infos == undefined)
              window.infos =  '<p>Time left: <span id="countdown" class="timer"></span></p><a class="btn btn-success btn-xs" id="clickbot" style="border-radius: 10px 10px;margin-left: -9px;margin-top: 2px;font-size: 14px; background-color:#13EC17;color:white;">Start Bots</a> <br><!--<a class="btn btn-danger btn-xs" id="clickstop" style="border-radius: 10px 10px;margin-left: 0px;font-size: 14px;">Stop Bots</a>--> <br><br>';
          b.innerHTML = window.infos;
          document.body.appendChild(b);
      }

  });
function valcompare(Y, Z) {
    return 0.01 > Y - Z && -0.01 < Y - Z
}
function slideIn() {
      $("#altbots").animate({width:'toggle'},350);
}
function fadeOut() {
      $("#altbots").fadeOut();
}
vz = function(a, b, c, d) {
    if (valcompare(c - a, d - b)) {
        f = a;
        g = b;
        h = c;
        j = d
    } else {
        if (valcompare(a, k.minx)) {
            if (0.01 < c - k.maxx || -0.01 > c - k.maxx) {
                f = a;
                h = a + 14142.135623730952
            }
        }
        if (0.01 < a - k.minx || -0.01 > a - k.minx) {
            if (valcompare(c, k.maxx)) {
                h = c;
                f = c - 14142.135623730952
            }
        }
        if (0.01 < b - k.miny || -0.01 > b - k.miny) {
            if (valcompare(d, k.maxy)) {
                j = d;
                g = d - 14142.135623730952
            }
        }
        if (valcompare(b, k.miny)) {
            if (0.01 < d - k.maxy || -0.01 > d - k.maxy) {
                g = b;
                j = b + 14142.135623730952
            }
        }
        if (a < f) {
            f = a;
            h = a + 14142.135623730952
        }
        if (c > h) {
            h = c;
            f = c - 14142.135623730952
        }
        if (b < g) {
            g = b;
            j = b + 14142.135623730952
        }
        if (d > j) {
            j = d;
            g = d - 14142.135623730952
        }
        k.minx = a;
        k.miny = b;
        k.maxy = d;
        k.maxx = c //validate for ingame client
    }
    offset_x = f || -7071;
    offset_y = g || -7071
};