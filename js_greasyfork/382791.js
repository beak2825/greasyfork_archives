// ==UserScript==
// @name         [1.2.3] Mod
// @namespace    Mod
// @version      7.0.5
// @description  Mod
// @author       nick-op-hacker
// @include      https://blablaland.co/jouer
// @grant        GM_xmlhttpRequest
// @license      Mod
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382791/%5B123%5D%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/382791/%5B123%5D%20Mod.meta.js
// ==/UserScript==    

var checkgameloaded;

  window.WebSocket.prototype.oldSend = WebSocket.prototype.send;
  window.WebSocket.prototype.send = function(m){
        if (!checkgameloaded){
          activatehack(this);
        }
        this.oldSend(m);
  }

window.chatmessage = window.Ze = (t, e, i) => {
        for (chatList.innerHTML += i ? "<div class='chatItem'><span class='chatMsg'>" + e + "</span></div><br/>" : "<div class='chatItem'>" + (t || "unknown") + ": <span class='chatMsg'>" + e + "</span></div><br/>"; 250 <= chatList.scrollHeight;) chatList.removeChild(chatList.childNodes[0])
    }

  function activatehack(socket){
    window.socket = socket;
    checkgameloaded = socket;
window.chatmessage("script helper", `
                             <span style="color: yellow;"><br>[TP]:press-'<span style="color:green">i</span>'
                                <span style="color: yellow;"><br>[test]:press-'<span style="color:green">J</span>'
                                  <span style="color: yellow;"><br>[test]:press-'<span style="color:green">L</span>'
                                    <span style="color: yellow;"><br>[test]:press-'<span style="color:green">H</span>'
                                      <span style="color: yellow;"><br>[test]:press-'<span style="color:green">K</span>'
                                        <span style="color: yellow;"><br>[test]:press-'<span style="color:green">O</span>'
                                      <span style="color: yellow;"><br>[test]:press-'<span style="color:green">G</span>'`);
      
        $("#healthHolder").append('<a style=\"color:yellow;top:1900;\" href="https://goo.gl/XCNoJL" target="_blank"> </a>');
      
        //tanitim belgeseli
var colorize,lnk,text,ministyler
lnk = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "];
text = "<b>";
lnk.forEach(lnkfunc);
text += "</b>";
      
      function lnkfunc(value) {
var value2 = value;
if(value == " " || value == "BLABLALAND.CO" || value == "BLABLALAND.CO") { colorize = true; } else { colorize = false; }
if(value == "MOPE-IO.NET") { value2="MOPEIO.NET"; } if(value == "BONK-IO.NET") { value2="BONKIO.NET"; } if(value == "SPINZ-IO.NET") { value2="SPINZIO.NET"; } if(value == "DEEEEP-IO.NET") { value2="DEEEEPIO.NET"; } if(value == "SKRIBBL-IO.NET") { value2="SKRIBBLIO.NET"; } if(value == "IO-OYUNLAR.COM") { value2="IOOYUNLAR.COM"; }
if(colorize == false){ministyler = "color:white;font-size:11px;padding:0px;";} else {ministyler = "color:yellow;font-size:11px;padding:0px;";}
text += '<a href="http://'+value+'" target="_blank" style="'+ministyler+'">'+value2+'</a> - ';
}

//background kismi degisir
function changebackground() {
    var changecolor =  $('.bgcont').val();
var rgbaC2 = 'rgba(' + parseInt(changecolor.slice(-6, -4), 16) + ',' + parseInt(changecolor.slice(-4, -2), 16) + ',' + parseInt(changecolor.slice(-2), 16) + ',0.25)';
$('#overlay').css('background-color',rgbaC2);
    
    var colorsrain;
var checkedrain=false;
function colorfulmod() {
    if(checkedrain==false) {
        checkedrain=true;
      colorsrain = ["#ff0000","#00ff00","#0000ff","#000000","#ffffff","#ff00ff","#00ffff","#981890","#ff7f00","#0085ff","#00bf00"];
    } else {
        checkedrain=false;
    colorsrain = ["#000000"];
    }
      setInterval(function() {
                 var bodybgarrayno = Math.floor(Math.random() * colorsrain.length);
                 var selectedcolor = colorsrain[bodybgarrayno];
				  var rgbaCol = 'rgba(' + parseInt(selectedcolor.slice(-6, -4), 16) + ',' + parseInt(selectedcolor.slice(-4, -2), 16) + ',' + parseInt(selectedcolor.slice(-2), 16) + ',0.25)';
                $("#overlay").css("background-color",rgbaCol);
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

      checkgameloaded.addEventListener("message", (m) => {
        handleMessage(m);
    });
  }

function handleMessage(m){
}


setTimeout( () => {
    pending = true;
}, 5000);


var OnOffMode;
(function (OnOffMode) {
    OnOffMode["On"] = "<span style=\"color:green;\">ON</span>";
    OnOffMode["Off"] = "<span style=\"color:gray;\">OFF</span>";
})(OnOffMode || (OnOffMode = {}));
class Module {
    constructor() {
        this.allStates = this.getAllModes();
        this.currentModeIndex = this.allStates.indexOf(this.getInitialMode());
    }
    onModeChanged() {
        // Let implementations override this if needed
    }
    onTick() {
        // Let implementations override this if needed
    }
    getInitialMode() {
        return this.allStates[0];
    }
    onKeyPressed() {
        this.currentModeIndex++;
        if (this.currentModeIndex >= this.allStates.length) {
            this.currentModeIndex = 0;
        }
        this.onModeChanged();
    }
    isEnabled() {
        return this.currentModeIndex !== 0;
    }
    getStatus() {
        return this.allStates[this.currentModeIndex].toString();
    }
    getCurrentMode() {
        return this.allStates[this.currentModeIndex];
    }
}
}