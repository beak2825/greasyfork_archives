// ==UserScript==
// @name         Bonk Commands Moving 1
// @namespace    https://greasyfork.org/en/scripts/451341-bonk-commands-Moving-1
// @version      20.2
// @description  Adds lots of commands to bonk.io. Type /? or /help in bonk chat to get started. with Moving 1 admin
// @author       LEGENDBOSS123 + left paren + mastery3 edited moving 1
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @match        https://multiplayer.gg/physics/*
// @run-at       document-idle
// @grant        none
// @unwrap
// @licence     MIT
// @downloadURL https://update.greasyfork.org/scripts/499248/Bonk%20Commands%20Moving%201.user.js
// @updateURL https://update.greasyfork.org/scripts/499248/Bonk%20Commands%20Moving%201.meta.js
// ==/UserScript==

function BonkCommandsScriptInjector(f){
    if(window.location == window.parent.location){
        if(document.readyState == "complete"){f();}
        else{document.addEventListener('readystatechange',function(){setTimeout(f,1500);});}
    }
}
 
BonkCommandsScriptInjector(function(){
var scope = window;
scope.scope = scope;
scope.Gwindow = document.getElementById("maingameframe").contentWindow;
scope.Gdocument = document.getElementById("maingameframe").contentDocument;
Gwindow.Gwindow = window;
Gwindow.Gdocument = document;
 
scope.link2pastebin = "https://pastebin.com/2b8XqqYu";
scope.link2greasyfork = "https://greasyfork.org/en/scripts/451341-bonk-commands";
 
if(typeof(scope.injectedBonkCommandsScript)=='undefined'){
    scope.injectedBonkCommandsScript = true;
}
else{
    clearInterval(injectedBonkCommandsScript);
}
scope.GENERATE_COPRIME_NUMBER = function(mini = 0,maxi = 0,coprimewith = 0,choices = []){
    if(choices.length == 0){
        for(var i = mini;i<maxi+1;i++){
            choices.push(i);
        }
    }
    firstTry = choices[Math.floor(Math.random()*choices.length)];
    for(var i = 2; i<firstTry+1;i++){
        if(firstTry%i == 0 && coprimewith%i == 0){
            choices.splice(choices.indexOf(firstTry),1);
            if(choices.length == 0){
                return 0;
            }
            return GENERATE_COPRIME_NUMBER(mini,maxi,coprimewith,choices);
        }
    }
    return firstTry;
};
scope.GENERATE_PRIME_NUMBER = function(mini = 0,maxi = 0,choices = []){
    if(choices.length == 0){
        for(var i = mini;i<maxi+1;i++){
            choices.push(i);
        }
    }
    firstTry = choices[Math.floor(Math.random()*choices.length)];
    for(var i = 2; i<Math.floor(Math.sqrt(firstTry)+1);i++){
        if(i!=firstTry){
            if(firstTry%i == 0){
                choices.splice(choices.indexOf(firstTry),1);
                if(choices.length == 0){
                    return 0;
                }
                return GENERATE_PRIME_NUMBER(mini,maxi,choices);
            }
        }
    }
    return firstTry;
};
scope.SHUFFLE_LIST = function(x){
    var nl = x.slice();
    for(var i = nl.length - 1;i>0;i--){
        var r = Math.floor(Math.random()*(i+1));
        var t = nl[i];
        nl[i] = nl[r];
        nl[r] = t;
    }
    return nl;
};
scope.str2ab = function(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};
scope.ab2str = function(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
};
scope.GENERATE_KEYS = async function(){
    return crypto.subtle.generateKey({name: "RSA-OAEP",modulusLength: 2048,publicExponent: new Uint8Array([1, 0, 1]),hash: {name: "SHA-256"}},true,["encrypt","decrypt"]);
};
scope.CRYPT_NUMBER = function(key, data){
 
    result = 1;
 
    for(var i = 0;i<key[1];i++){
        result*=data;
        result = result%key[0];
    }
    return result%key[0];
 
};
 
scope.ENCRYPT_MESSAGE = async function(key,data){
    try{
        var encrypted = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            new TextEncoder().encode(data)
        );
        return btoa(ab2str(encrypted));
    }
    catch(E){
        console.log(E);
        return 0;
    }
};
 
scope.DECRYPT_MESSAGE = async function(key,data){
    try{
        var decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            str2ab(atob(data))
        );
        return new TextDecoder().decode(decrypted);
    }
    catch{
        return 0;
    }
};
scope.IMPORT_KEY = async function(key){
    return await crypto.subtle.importKey("spki", str2ab(atob(key)),public_key.algorithm,true,["encrypt"]);
};
scope.EXPORT_KEY = async function(key){
    var result = await crypto.subtle.exportKey("spki",key);
    return btoa(ab2str(result));
};
if(typeof(scope.textdecoder)=='undefined'){scope.textdecoder = new Gwindow.TextDecoder;}
if(typeof(scope.textencoder)=='undefined'){scope.textencoder = new Gwindow.TextEncoder;}
 
class bytebuffer2 {
  constructor() {
    var g1d = [arguments];
    this.index = 0;
    this.buffer = new ArrayBuffer(100*1024);
    this.view = new DataView(this.buffer);
    this.implicitClassAliasArray = [];
    this.implicitStringArray = [];
    this.bodgeCaptureZoneDataIdentifierArray = [];
  }
  
  readByte() {
    var N0H = [arguments];
    N0H[4] = this.view.getUint8(this.index);
    this.index += 1;
    return N0H[4];
  }
  writeByte(z0w) {
    var v8$ = [arguments];
    this.view.setUint8(this.index, v8$[0][0]);
    this.index += 1;
  }
  readInt() {
    var A71 = [arguments];
    A71[6] = this.view.getInt32(this.index);
    this.index += 4;
    return A71[6];
  }
  writeInt(W6i) {
    var p5u = [arguments];
    this.view.setInt32(this.index, p5u[0][0]);
    this.index += 4;
  }
  readShort() {
    var R1R = [arguments];
    R1R[9] = this.view.getInt16(this.index);
    this.index += 2;
    return R1R[9];
  }
  writeShort(H8B) {
    var d_3 = [arguments];
    this.view.setInt16(this.index, d_3[0][0]);
    this.index += 2;
  }
  readUint() {
    var W2$ = [arguments];
    W2$[8] = this.view.getUint32(this.index);
    this.index += 4;
    return W2$[8];
  }
  writeUint(B2X) {
    var f8B = [arguments];
    this.view.setUint32(this.index, f8B[0][0]);
    this.index += 4;
  }
  readBoolean() {
    var h6P = [arguments];
    h6P[6] = this.readByte();
    return h6P[6] == 1;
  }
  writeBoolean(Y3I) {
    var l79 = [arguments];
    if (l79[0][0]) {
      this.writeByte(1);
    } else {
      this.writeByte(0);
    }
  }
  readDouble() {
    var V60 = [arguments];
    V60[4] = this.view.getFloat64(this.index);
    this.index += 8;
    return V60[4];
  }
  writeDouble(z4Z) {
    var O41 = [arguments];
    this.view.setFloat64(this.index, O41[0][0]);
    this.index += 8;
  }
  readFloat() {
    var I0l = [arguments];
    I0l[5] = this.view.getFloat32(this.index);
    this.index += 4;
    return I0l[5];
  }
  writeFloat(y4B) {
    var B0v = [arguments];
    this.view.setFloat32(this.index, B0v[0][0]);
    this.index += 4;
  }
  readUTF() {
    var d6I = [arguments];
    d6I[8] = this.readByte();
    d6I[7] = this.readByte();
    d6I[9] = d6I[8] * 256 + d6I[7];
    d6I[1] = new Uint8Array(d6I[9]);
    for (d6I[6] = 0; d6I[6] < d6I[9]; d6I[6]++) {
      d6I[1][d6I[6]] = this.readByte();
    }
    return textdecoder.decode(d6I[1]);
  }
  writeUTF(L3Z) {
    var Z75 = [arguments];
    Z75[4] = textencoder.encode(Z75[0][0]);
    Z75[3] = Z75[4].length;
    Z75[5] = Math.floor(Z75[3]/256);
    Z75[8] = Z75[3] % 256;
    this.writeByte(Z75[5]);
    this.writeByte(Z75[8]);
    Z75[7] = this;
    Z75[4].forEach(I_O);
    function I_O(s0Q, H4K, j$o) {
      var N0o = [arguments];
      Z75[7].writeByte(N0o[0][0]);
    }
  }
  toBase64() {
    var P4$ = [arguments];
    P4$[4] = "";
    P4$[9] = new Uint8Array(this.buffer);
    P4$[8] = this.index;
    for (P4$[7] = 0; P4$[7] < P4$[8]; P4$[7]++) {
      P4$[4] += String.fromCharCode(P4$[9][P4$[7]]);
    }
    return Gwindow.btoa(P4$[4]);
  }
  fromBase64(W69, A8Q) {
    var o0n = [arguments];
    o0n[8] = Gwindow.pako;
    o0n[6] = Gwindow.atob(o0n[0][0]);
    o0n[9] = o0n[6].length;
    o0n[4] = new Uint8Array(o0n[9]);
    for (o0n[1] = 0; o0n[1] < o0n[9]; o0n[1]++) {
      o0n[4][o0n[1]] = o0n[6].charCodeAt(o0n[1]);
    }
    if (o0n[0][1] === true) {
      o0n[5] = o0n[8].inflate(o0n[4]);
      o0n[4] = o0n[5];
    }
    this.buffer = o0n[4].buffer.slice(
      o0n[4].byteOffset,
      o0n[4].byteLength + o0n[4].byteOffset
    );
    this.view = new DataView(this.buffer);
    this.index = 0;
  }
};
 
if(typeof(scope.originalSend)=='undefined'){scope.originalSend = Gwindow.WebSocket.prototype.send;}
if(typeof(scope.originalDatenow)=='undefined'){scope.originalDatenow = Gwindow.Date.now;}
 
if(typeof(scope.originalXMLOpen)=='undefined'){scope.originalXMLOpen = Gwindow.XMLHttpRequest.prototype.open;}
if(typeof(scope.originalXMLSend)=='undefined'){scope.originalXMLSend = Gwindow.XMLHttpRequest.prototype.send;}
if(typeof(scope.searchrequested)=='undefined'){scope.searchrequested = 0;}
if(typeof(scope.originalDrawCircle)=='undefined'){scope.originalDrawCircle = Gwindow.PIXI.Graphics.prototype.drawCircle;}
if(typeof(scope.parentDraw)=='undefined'){scope.parentDraw = 0;}
if(typeof(scope.pixiCircle)=='undefined'){scope.pixiCircle = new Gwindow.PIXI.Graphics();}
if(typeof(scope.container)=='undefined'){scope.container = new Gwindow.PIXI.Container();container.addChild(pixiCircle);}
if(typeof(scope.canvasWidth)=='undefined'){scope.canvasWidth = -1;}
if(typeof(scope.savedrooms)=='undefined'){scope.savedrooms = [];}
if(typeof(scope.inroom)=='undefined'){scope.inroom = false;}
if(typeof(scope.currentroomaddress)=='undefined'){scope.currentroomaddress = -1;}
if(typeof(scope.savedroomsdata)=='undefined'){scope.savedroomsdata = {};}
if(typeof(scope.jukeboxplayerURL)=='undefined'){scope.jukeboxplayerURL = "";}
if(typeof(scope.jukeboxplayervolume)=='undefined'){scope.jukeboxplayervolume = 20;}
if(typeof(scope.gameStartTimeStamp)=='undefined'){scope.gameStartTimeStamp = 0;}
scope.checkInstance = async function(index){
    var doesitwork = false;
    await fetch(pipedurllist[index]+"dQw4w9WgXcQ").then(
        function(r){
            return r.json();
        }
    ).then(async function(r){
        if (r.audioStreams && !r.error){
            for(var i2 = 0;i2<r.audioStreams.length;i2++){
                if(r.audioStreams[i2].url){
                    try{
                        var f = await fetch(r.audioStreams[i2].url);
                        if(f.ok){
                            doesitwork = true;
                            return;
                        }
 
                    }
                    catch(e){}
                }
            }
        }
    }).catch(function(e){});
    if(!doesitwork){
        return -1;
    }
    return index;
};
scope.checkJukeboxStream = async function(index,id){
    var doesitwork = false;
    var urlreturn = [];
    await fetch(pipedurllist[index]+id).then(
        function(r){
            return r.json();
        }
    ).then(async function(r){
        if (r.audioStreams && !r.error){
            for(var i2 = 0;i2<r.audioStreams.length;i2++){
                if(r.audioStreams[i2].url){
                    try{
                        var f = await fetch(r.audioStreams[i2].url);
                        if(f.ok){
                            doesitwork = true;
                            urlreturn = [r.audioStreams[i2].url,r.title,r.uploader];
                            return;
                        }
 
                    }
                    catch(e){}
                }
            }
        }
    }).catch(function(e){});
    if(!doesitwork){
        return -1;
    }
    return urlreturn;
};
 
scope.checkInstances = async function (){
    pipedindexes = [];
    for (var index = 0;index<pipedurllist.length;index++){
        checkInstance(index).then(function(value){
            if(value!=-1){
                pipedindexes.push(value);
            }
        });
    }    
};
if(typeof(scope.pipedurllist)=='undefined'){
    scope.pipedurllist = [
        "https://pipedapi.kavin.rocks/streams/",
        "https://pipedapi.syncpundit.io/streams/",
        "https://api-piped.mha.fi/streams/",
        "https://piped-api.garudalinux.org/streams/",
        "https://pipedapi.rivo.lol/streams/",
        "https://pipedapi.leptons.xyz/streams/",
        "https://piped-api.lunar.icu/streams/",
        "https://ytapi.dc09.ru/streams/",
        "https://piped.tokhmi.xyz/streams/",
        "https://pipedapi.aeong.one/streams/"];
    scope.pipedindexes = [];
    checkInstances();
}
 
 
 
if(typeof(scope.requestAnimationFrameOriginal)=='undefined'){scope.requestAnimationFrameOriginal = Gwindow.requestAnimationFrame;}
 
 
if(typeof(scope.bonkwss)=='undefined'){scope.bonkwss = 0;}
if(typeof(scope.bonkwssextra)=='undefined'){scope.bonkwssextra = [];}
if(typeof(scope.chatlog)=='undefined'){scope.chatlog = ["ROOM START"];}
if(typeof(scope.wsssendrecievelog)=='undefined'){scope.wsssendrecievelog = [];}
if(typeof(scope.wsssendlog)=='undefined'){scope.wsssendlog = [];}
if(typeof(scope.wssrecievelog)=='undefined'){scope.wssrecievelog = [];}
if(typeof(scope.wsslogpaused)=='undefined'){scope.wsslogpaused = false;}
if(typeof(scope.debuggeropen)=='undefined'){scope.debuggeropen = false;}
if(typeof(scope.debuggercount)=='undefined'){scope.debuggercount = true;}
if(typeof(scope.packetcount)=='undefined'){scope.packetcount = 0;}
if(typeof(scope.requestedmaps)=='undefined'){scope.requestedmaps = [];}
if(typeof(scope.maponclick)=='undefined'){scope.maponclick = 0;}
if(typeof(scope.LZString)=='undefined'){scope.LZString = Gwindow.LZString;}
if(typeof(scope.PSON)=='undefined'){scope.PSON = Gwindow.dcodeIO.PSON;}
if(typeof(scope.bytebuffer)=='undefined'){scope.bytebuffer = Gwindow.dcodeIO.ByteBuffer;}
if(typeof(scope.speech)=='undefined'){scope.speech = new SpeechSynthesisUtterance();speech.pitch = 0.75;}
if(typeof(scope.sayer)=='undefined'){scope.sayer = speechSynthesis;sayer.volume = 0.5;sayer.rate = 1.25;}
if(typeof(scope.pollactive)=='undefined'){scope.pollactive = [false,0,0,[]];}
if(typeof(scope.pollactive2)=='undefined'){scope.pollactive2 = [false,0,[]];}
if(typeof(scope.mode)=='undefined'){scope.mode = '';}
if(typeof(scope.FFA)=='undefined'){scope.FFA = true;}
if(typeof(scope.recording)=='undefined'){scope.recording = false;}
if(typeof(scope.recordingdata)=='undefined'){scope.recordingdata = [];}
if(typeof(scope.recorddata)=='undefined'){scope.recorddata = {};}
if(typeof(scope.recordingid)=='undefined'){scope.recordingid = -1;}
if(typeof(scope.wordlist)=='undefined'){
    scope.wordlist = [];
    fetch("https://api.github.com/repos/first20hours/google-10000-english/contents/20k.txt").then(function(data){
        return data.json();
    }).then(function(data){
        fetch("https://api.github.com/repos/first20hours/google-10000-english/git/blobs/"+data.sha).then(function(data){
            return data.json();
        }).then(function(data){
            scope.wordlist = atob(data.content).split("\n");
        });
    });
}
 
if(typeof(scope.allstyles)=='undefined'){scope.allstyles = {};}
if(typeof(scope.mystyle)=='undefined'){scope.mystyle = [0,0,0];}
if(typeof(scope.ISpsonpair)=='undefined'){scope.ISpsonpair = new Gwindow.dcodeIO.PSON.StaticPair(["physics", "shapes", "fixtures", "bodies", "bro", "joints", "ppm", "lights", "spawns", "lasers", "capZones", "type", "w", "h", "c", "a", "v", "l", "s", "sh", "fr", "re", "de", "sn", "fc", "fm", "f", "d", "n", "bg", "lv", "av", "ld", "ad", "fr", "bu", "cf", "rv", "p", "d", "bf", "ba", "bb", "aa", "ab", "axa", "dr", "em", "mmt", "mms", "ms", "ut", "lt", "New body", "Box Shape", "Circle Shape", "Polygon Shape", "EdgeChain Shape", "priority", "Light", "Laser", "Cap Zone", "BG Shape", "Background Layer", "Rotate Joint", "Slider Joint", "Rod Joint", "Gear Joint", 65535, 16777215]);}
if(typeof(scope.sandboxon)=='undefined'){scope.sandboxon = false;}
if(typeof(scope.sandboxid)=='undefined'){scope.sandboxid = 200;}
if(typeof(scope.playerids)=='undefined'){scope.playerids = {};}
if(typeof(scope.delplayerids)=='undefined'){scope.delplayerids = {};}
if(typeof(scope.myid)=='undefined'){scope.myid = -1;}
if(typeof(scope.hostid)=='undefined'){scope.hostid = -1;}
if(typeof(scope.sandboxplayerids)=='undefined'){scope.sandboxplayerids = {};}
if(typeof(scope.originalMapLoad)=='undefined'){scope.originalMapLoad = Gdocument.getElementById("maploadwindowmapscontainer").appendChild;}
if(typeof(scope.originalLobbyChat)=='undefined'){scope.originalLobbyChat = Gdocument.getElementById("newbonklobby_chat_content").appendChild;}
if(typeof(scope.originalIngameChat)=='undefined'){scope.originalIngameChat = Gdocument.getElementById("ingamechatcontent").appendChild;}
if(typeof(scope.private_chat_keys)=='undefined'){GENERATE_KEYS().then(function(e){scope.private_chat_keys = e;scope.private_key = private_chat_keys.privateKey;scope.public_key = private_chat_keys.publicKey;});}
 
if(typeof(scope.jukeboxplayer)=='undefined'){
    scope.jukeboxplayer = Gdocument.createElement("audio");
    jukeboxplayer.controls = true;
    jukeboxplayer.loop = true;
}
 
if(Gdocument.getElementById("savedroombutton") == null){
    scope.savedroombutton = Gdocument.createElement("div");
    savedroombutton.id = "savedroombutton";
    savedroombutton.className = "brownButton brownButton_classic buttonShadow brownButtonDisabled";
    savedroombutton.textContent = "Save Room";
    savedroombutton.style["left"] = "120px";
    savedroombutton.style["position"] = "absolute";
    savedroombutton.style["width"] = "90px";
    savedroombutton.style["height"] = "30px";
    savedroombutton.style["color"] = "#ffffff";
    savedroombutton.style["text-align"] = "center";
    savedroombutton.style["vertical-align"] = "middle";
    savedroombutton.style["line-height"] = "30px";
    savedroombutton.style["right"] = "0";
    savedroombutton.style["cursor"] = "pointer";
    savedroombutton.style["bottom"] = "10px";
    savedroombutton.style["margin"] = "auto";
    savedroombutton.style["bottom"] = "10px";
    savedroombutton.onclick = function(){
        if(!savedrooms.includes(currentroomaddress) && currentroomaddress!=-1){
            savedrooms.push(currentroomaddress);
            savedroomsdata[currentroomaddress] = {"exists":true};
        }
        Gdocument.getElementById("sm_connectingWindowCancelButton").click();
    };
    Gdocument.getElementById("sm_connectingWindowCancelButton").style["left"] = "-120px";
    Gdocument.getElementById("sm_connectingWindow").appendChild(savedroombutton)
}
    
if(Gdocument.getElementById("maploadtypedropdowntitlerequested") == null){
    scope.clearmaprequests = Gdocument.createElement("div");
    clearmaprequests.id = "clearmaprequests";
    clearmaprequests.classList.value = "brownButton brownButton_classic buttonShadow";
    clearmaprequests.textContent = "Clear";
    clearmaprequests.style["position"] = "absolute";
    clearmaprequests.style["display"] = "none";
    if(typeof(ishost)!='undefined'){
        if(ishost && Gdocument.getElementById("maploadtypedropdowntitle").textContent == "MAP REQUESTS"){
            clearmaprequests.style["display"] = "block";
        }
    }
    clearmaprequests.style["right"] = "306px";
    clearmaprequests.style["top"] = "57px";
    clearmaprequests.style["height"] = "23px";
    clearmaprequests.style["width"] = "47px";
    clearmaprequests.style["line-height"] = "23px";
    clearmaprequests.style["font-size"] = "14px";
    clearmaprequests.addEventListener("click",function(){
        requestedmaps = [];
        Gdocument.getElementById("maploadwindowstatustext").style["visibility"] = "inherit";
        Gdocument.getElementById("maploadwindowstatustext").textContent = "No Maps";
        while(Gdocument.getElementById("maploadwindowmapscontainer").children.length>0){
            Gdocument.getElementById("maploadwindowmapscontainer").removeChild(Gdocument.getElementById("maploadwindowmapscontainer").firstChild);
        }
    });
    Gdocument.getElementById("maploadwindow").insertBefore(clearmaprequests,Gdocument.getElementById("maploadwindowsearchinput"));
    
    scope.refreshmaprequests = Gdocument.createElement("div");
    refreshmaprequests.id = "refreshmaprequests";
    refreshmaprequests.classList.value = "brownButton brownButton_classic buttonShadow";
    refreshmaprequests.textContent = "Refresh";
    refreshmaprequests.style["position"] = "absolute";
    refreshmaprequests.style["display"] = "none";
    if(typeof(ishost)!='undefined'){
        if(ishost && Gdocument.getElementById("maploadtypedropdowntitle").textContent == "MAP REQUESTS"){
            refreshmaprequests.style["display"] = "block";
        }
    }
    refreshmaprequests.style["right"] = "357px";
    refreshmaprequests.style["top"] = "57px";
    refreshmaprequests.style["height"] = "23px";
    refreshmaprequests.style["width"] = "47px";
    refreshmaprequests.style["line-height"] = "23px";
    refreshmaprequests.style["font-size"] = "14px";
    refreshmaprequests.addEventListener("click",function(){
        searchrequested = 1;
        
        Gdocument.getElementById("maploadtypedropdowntitle").click();
        Gdocument.getElementById("maploadtypedropdowntitle").textContent = dropdownrequested.textContent;
        dropdownrequested.style["display"] = "none";
        clearmaprequests.style["display"] = "block";
        refreshmaprequests.style["display"] = "block";
        Gdocument.getElementById("maploadwindowhotnessslider").style["visibility"] = "hidden";
        Gdocument.getElementById("maploadwindowsearchoptions").style["visibility"] = "hidden";
        Gdocument.getElementById("maploadtypedropdownoption10").click();
        
    });
    Gdocument.getElementById("maploadwindow").insertBefore(refreshmaprequests,Gdocument.getElementById("maploadwindowsearchinput"));
 
    
    
    scope.dropdownrequested = Gdocument.createElement("div");
    dropdownrequested.classList = "dropdown-option dropdown_classic";
    dropdownrequested.style["display"] = "none";
    dropdownrequested.id = "maploadtypedropdowntitlerequested";
 
    if(Gdocument.getElementById("maploadtypedropdownoption10").style["display"] == "block"){
        dropdownrequested.style["display"] = "block";
    }
    dropdownrequested.textContent = "MAP REQUESTS";
    dropdownrequested.onclick = function(){
        searchrequested = 1;
        Gdocument.getElementById("maploadtypedropdowntitle").click();
        Gdocument.getElementById("maploadtypedropdowntitle").textContent = dropdownrequested.textContent;
        dropdownrequested.style["display"] = "none";
        clearmaprequests.style["display"] = "block";
        refreshmaprequests.style["display"] = "block";
        Gdocument.getElementById("maploadwindowhotnessslider").style["visibility"] = "hidden";
        Gdocument.getElementById("maploadwindowsearchoptions").style["visibility"] = "hidden";
        Gdocument.getElementById("maploadtypedropdownoption10").click();
        
    };
    (new MutationObserver(function(){if(Gdocument.getElementById("maploadtypedropdownoption10").style["display"] == "none"){ dropdownrequested.style["display"] = "none"; clearmaprequests.style["display"] = "none";refreshmaprequests.style["display"] = "none"; } else{ dropdownrequested.style["display"] = "block";}})).observe(Gdocument.getElementById("maploadtypedropdownoption10"),{attributes:true,childList:true});
    
    
        
    Gdocument.getElementById("maploadtypedropdown").insertBefore(dropdownrequested,Gdocument.getElementById("maploadtypedropdownoption1"));
    Gdocument.getElementById("maploadwindowmapscontainer").__defineGetter__("clientHeight",function(){if(Gdocument.getElementById("maploadtypedropdowntitle").textContent != "MAP REQUESTS"){return Gdocument.getElementById("maploadwindowmapscontainer").getClientRects()[0].height;}else{return 0;}});
 
};
scope.sandboxonclick = function(){
    Gdocument.getElementById("roomlistrefreshbutton").click();
    Gdocument.getElementById("roomlistcreatebutton").click();
    sandboxon = true;
};
scope.checkboxclearbuttononclick = function(){
    var classes = Gdocument.getElementsByClassName("quickplaycheckbox");
    var e = true;
    for(var i = 0; i<classes.length;i++){
        if(classes[i].checked == true){
            e = false
        }
        classes[i].checked = false;
    }
    if(e){
        for(var i = 0; i<classes.length;i++){
            classes[i].checked = true;
        }
    }
};
Gdocument.getElementById("ingamechatcontent").__defineGetter__("childElementCount",function(){return this.children.length/50;});
if(Gdocument.getElementById("classic_mid_sandbox")==null){
    Gdocument.getElementById("roomlistrefreshbutton").click();
    scope.sandboxbutton = Gdocument.createElement("div");
    sandboxbutton.id = "classic_mid_sandbox";
    sandboxbutton.classList.value = "brownButton brownButton_classic classic_mid_buttons";
    sandboxbutton.textContent = "Sandbox";
    sandboxbutton.addEventListener("click",sandboxonclick);
    Gdocument.getElementById("classic_mid").insertBefore(sandboxbutton,Gdocument.getElementById("classic_mid_news"));
 
}
if(Gdocument.getElementById("clearallcheckboxes")==null){
    scope.checkboxclearbutton = Gdocument.createElement("div");
    checkboxclearbutton.id = "clearallcheckboxes";
    checkboxclearbutton.classList.value = "brownButton brownButton_classic buttonShadow";
    checkboxclearbutton.textContent = "On/Off";
    checkboxclearbutton.style["position"] = "absolute";
    checkboxclearbutton.style["display"] = "none";
    if(typeof(ishost)!='undefined'){
        if(ishost && stopquickplay == 0){
            checkboxclearbutton.style["display"] = "block";
        }
    }
    checkboxclearbutton.style["right"] = "255px";
    checkboxclearbutton.style["top"] = "57px";
    checkboxclearbutton.style["height"] = "23px";
    checkboxclearbutton.style["width"] = "47px";
    checkboxclearbutton.style["line-height"] = "23px";
    checkboxclearbutton.style["font-size"] = "13px";
    checkboxclearbutton.addEventListener("click",checkboxclearbuttononclick);
    Gdocument.getElementById("maploadwindow").insertBefore(checkboxclearbutton,Gdocument.getElementById("maploadwindowsearchinput"));
 
}
scope.holdloadbuttonTimeout = [];
scope.holdloadbutton = function(){
    var scrollcount = 0;
    var mapwindow = Gdocument.getElementById("maploadwindowmapscontainer");
    mapwindow.scroll(0,mapwindow.scrollHeight);
};
    
 
if(Gdocument.getElementById("mapwindowloadall")==null){
    scope.loadall = Gdocument.createElement("div");
    loadall.id = "mapwindowloadall";
    loadall.classList.value = "brownButton brownButton_classic buttonShadow";
    loadall.textContent = "Load";
    loadall.style["position"] = "absolute";
    loadall.style["display"] = "block";
    loadall.style["left"] = "204px";
    loadall.style["top"] = "57px";
    loadall.style["height"] = "23px";
    loadall.style["width"] = "34px";
    loadall.style["line-height"] = "23px";
    loadall.style["font-size"] = "12px";
    var repeat = function(){holdloadbutton();holdloadbuttonTimeout.push(setTimeout(repeat,25));};
    loadall.onmousedown = function(){repeat();};
    loadall.onmouseup = function(){for(var i = 0; i<holdloadbuttonTimeout.length; i++){clearTimeout(holdloadbuttonTimeout[i]);}};
    loadall.onmouseout = function(){for(var i = 0; i<holdloadbuttonTimeout.length; i++){clearTimeout(holdloadbuttonTimeout[i]);}};
 
    Gdocument.getElementById("maploadwindow").insertBefore(loadall,Gdocument.getElementById("maploadwindowsearchinput"));
 
}
if(Gdocument.getElementById("BonkCommandsDebuggerContainer")==null){
    Gdocument.getElementById("leaveconfirmwindow").style["z-index"]=3;
    scope.debuggermenu = Gdocument.createElement("div");
    debuggermenu.id = "BonkCommandsDebuggerContainer";
    debuggermenu.style["position"] = "absolute";
    debuggermenu.style["display"] = "none";
    if(typeof(debuggeropen)!='undefined'){
        if(debuggeropen){
            debuggermenu.style["display"] = "block";
        }
    }
    
    debuggermenu.style["width"] = Gdocument.getElementById("bonkiocontainer").style["width"];
    debuggermenu.style["height"] = Gdocument.getElementById("bonkiocontainer").style["height"];
 
    debuggermenu.style["background"] = "rgb(26, 39, 51)";
 
    
    scope.width = parseInt(Gdocument.getElementById("bonkiocontainer").style["width"])-20;
    scope.height = parseInt(Gdocument.getElementById("bonkiocontainer").style["height"])-210;
 
    
    scope.logmenu = Gdocument.createElement("div");
    logmenu.id = "BonkCommandsWebSocketLog";
    logmenu.style["position"] = "absolute";
    logmenu.style["width"] = width.toString()+"px";
    logmenu.style["height"] = height.toString()+"px";
    logmenu.style["top"] = "80px";
    logmenu.style["left"] = "10px";
    logmenu.style["background"] = "rgb(207, 216, 220)";
    
    
    
    
    scope.logmenutopleft = Gdocument.createElement("div");
    logmenutopleft.id = "BonkCommandsWebSocketLog";
    logmenutopleft.style["position"] = "absolute";
    logmenutopleft.textContent = "Sending";
    logmenutopleft.classList = "newbonklobby_boxtop newbonklobby_boxtop_classic";
    
    logmenutopleft.style["width"] = (width/2).toString()+"px";
    logmenutopleft.style["height"] = "30px";
    logmenutopleft.style["top"] = "-30px";
    logmenutopleft.style["background"] = "rgb(0, 150, 136)";
    
    
    logmenu.appendChild(logmenutopleft);
    
    scope.logmenutopright = Gdocument.createElement("div");
    logmenutopright.id = "BonkCommandsWebSocketLog";
    logmenutopright.style["position"] = "absolute";
    logmenutopright.textContent = "Recieving";
    logmenutopright.classList = "newbonklobby_boxtop newbonklobby_boxtop_classic";
    logmenutopright.style["width"] = (width/2).toString()+"px";
    logmenutopright.style["height"] = "30px";
    logmenutopright.style["left"] = (width/2).toString()+"px";
    logmenutopright.style["top"] = "-30px";
    logmenutopright.style["background"] = "rgb(0, 150, 136)";
    logmenu.appendChild(logmenutopright);
    
    
    scope.logmenutable = Gdocument.createElement("table");
    logmenutable.id = "BonkCommandsWebSocketTable";
    logmenutable.style["position"] = "absolute";
    logmenutable.style["border-spacing"] = "0px";
    logmenutable.style["font-size"] = "12px";
    logmenutable.style["display"] = "table-cell";
    logmenutable.style["width"] = "50%";
    logmenutable.style["height"] = "100%";
    logmenutable.style["table-layout"] = "fixed";
    logmenutable.style["overflow-y"] = "scroll";
 
    scope.logmenutable2 = Gdocument.createElement("table");
    logmenutable2.id = "BonkCommandsWebSocketTable2";
    logmenutable2.style["position"] = "absolute";
    logmenutable2.style["width"] = "50%";
    logmenutable2.style["left"] = "50%";
    logmenutable2.style["font-size"] = "12px";
    logmenutable2.style["display"] = "table-cell";
    logmenutable2.style["height"] = "100%";
    logmenutable2.style["table-layout"] = "fixed";
    logmenutable2.style["overflow-y"] = "scroll";
    logmenutable2.style["border-spacing"] = "0px";
    scope.leftsync = false;
    scope.rightsync = false;
    logmenutable2.onscroll = function(){
        if(!leftsync){
            rightsync = true;
            logmenutable.scrollTop = this.scrollTop;
        }
        else{
            leftsync = false;
        }
    };
    logmenutable.onscroll = function(){
        if(!rightsync){
            leftsync = true;
            logmenutable2.scrollTop = this.scrollTop;
        }
        else{
            rightsync = false
        }
    };
    
    logmenu.appendChild(logmenutable);
    logmenu.appendChild(logmenutable2);
    
    debuggermenu.appendChild(logmenu);
    
    scope.debuggermenuclose = Gdocument.createElement("div");
    debuggermenuclose.id = "debuggerclose";
    debuggermenuclose.classList = "windowCloseButton brownButton brownButton_classic buttonShadow";
    debuggermenuclose.style["position"] = "absolute";
    debuggermenuclose.style["top"] = "40px";
    debuggermenuclose.style["right"] = "5px";
    debuggermenuclose.onclick = function(){debuggeropen = false;debuggermenu.style["display"] = "none";Gdocument.getElementById("newbonklobby_chat_input").style["display"]="";
Gdocument.getElementById("ingamechatinputtext").style["display"] = "";};
    
    debuggermenu.appendChild(debuggermenuclose);
    
    
    
    scope.debuggerform = Gdocument.createElement("form");
    debuggerform.autocomplete = "off";
    
    scope.debuggerinput = Gdocument.createElement("input");
    debuggerinput.style["position"] = "absolute";
    debuggerinput.style["width"] = width.toString()+"px";
    debuggerinput.style["left"] = "10px";
    debuggerinput.style["top"] = (height+90).toString()+"px";
    debuggerinput.style["font-size"] = "12px";
    debuggerinput.style["height"] = "20px";
    debuggerform.appendChild(debuggerinput);
    
    
    
    scope.debuggersendrecieve = Gdocument.createElement("div");
    debuggersendrecieve.style["position"] = "absolute";
    debuggersendrecieve.style["width"] = "140px";
    debuggersendrecieve.style["left"] = "10px";
    debuggersendrecieve.style["top"] = (height+120).toString()+"px";
    debuggersendrecieve.style["font-size"] = "15px";
    debuggersendrecieve.style["height"] = "20px";
    debuggersendrecieve.classList = "brownButton brownButton_classic buttonShadow";
    debuggersendrecieve.textContent = "Send";
    debuggersendrecieve.value = 0;
    debuggersendrecieve.onclick = function(){if(this.value == 0){this.textContent = "Recieve";this.value = 1;}else{this.textContent = "Send";this.value = 0;}};
 
    debuggermenu.appendChild(debuggersendrecieve);
    
    scope.debuggerpausebutton = Gdocument.createElement("div");
    debuggerpausebutton.style["position"] = "absolute";
    debuggerpausebutton.style["width"] = "140px";
    debuggerpausebutton.style["left"] = "10px";
    debuggerpausebutton.style["top"] = (height+150).toString()+"px";
    debuggerpausebutton.style["font-size"] = "15px";
    debuggerpausebutton.style["height"] = "20px";
    debuggerpausebutton.classList = "brownButton brownButton_classic buttonShadow";
    debuggerpausebutton.textContent = "Pause";
    debuggerpausebutton.value = 0;
    debuggerpausebutton.onclick = function(){if(this.value == 0){this.textContent = "Play";this.value = 1;wsslogpaused = true}else{this.textContent = "Pause";this.value = 0;wsslogpaused = false;}};
 
    debuggermenu.appendChild(debuggerpausebutton);
    
    scope.debuggereval = Gdocument.createElement("input");
    debuggereval.style["position"] = "absolute";
    debuggereval.style["width"] = (width-150).toString()+"px";
    debuggereval.style["right"] = "10px";
    debuggereval.style["top"] = (height+120).toString()+"px";
    debuggereval.style["font-size"] = "12px";
    debuggereval.style["height"] = "20px";
    debuggereval.addEventListener("keypress",function(e){if(e.repeat){return;}if(e.code == "Enter" && this.value.length>0){if(debuggersendrecieve.value == 0){SEND(this.value);}else{RECIEVE(this.value);}}});
    
    
    debuggerform.appendChild(debuggereval);
    debuggermenu.appendChild(debuggerform);
    Gdocument.getElementById("newbonkgamecontainer").appendChild(debuggermenu);
 
}
scope.ISdecode = function(rawdata) {
    rawdata_caseflipped = "";
    for (i = 0; i < rawdata.length; i++) {
        if (i <= 100 && rawdata.charAt(i) === rawdata.charAt(i).toLowerCase()) {
            rawdata_caseflipped += rawdata.charAt(i).toUpperCase();
        } else if (i <= 100 && rawdata.charAt(i) === rawdata.charAt(i).toUpperCase()) {
            rawdata_caseflipped += rawdata.charAt(i).toLowerCase();
        } else {
            rawdata_caseflipped += rawdata.charAt(i);
        }
    }
 
    data_deLZd = LZString.decompressFromEncodedURIComponent(rawdata_caseflipped);
    databuffer = bytebuffer.fromBase64(data_deLZd);
    data = ISpsonpair.decode(databuffer.buffer);
    return data;
};
    
scope.ISencode = function(obj) {
    data = ISpsonpair.encode(obj);
    b64 = data.toBase64();
    lzd = LZString.compressToEncodedURIComponent(b64);
 
    caseflipped = "";
    for (i = 0; i < lzd.length; i++) {
        if (i <= 100 && lzd.charAt(i) === lzd.charAt(i).toLowerCase()) {
            caseflipped += lzd.charAt(i).toUpperCase();
        } else if (i <= 100 && lzd.charAt(i) === lzd.charAt(i).toUpperCase()) {
            caseflipped += lzd.charAt(i).toLowerCase();
        } else {
            caseflipped += lzd.charAt(i);
        }
    }
 
 
    return caseflipped;
};
    
scope.decodeIS = function(x){
    return ISdecode(x);
};
scope.encodeIS = function(x){
    return ISencode(x);
};
scope.encodeToDatabase = function (W2A) {
    var M3n = [arguments];
    M3n[1] = new bytebuffer2;
    M3n[9] = M3n[0][0].physics;
    M3n[0][0].v = 15;
    M3n[1].writeShort(M3n[0][0].v);
    M3n[1].writeBoolean(M3n[0][0].s.re);
    M3n[1].writeBoolean(M3n[0][0].s.nc);
    M3n[1].writeShort(M3n[0][0].s.pq);
    M3n[1].writeFloat(M3n[0][0].s.gd);
    M3n[1].writeBoolean(M3n[0][0].s.fl);
    M3n[1].writeUTF(M3n[0][0].m.rxn);
    M3n[1].writeUTF(M3n[0][0].m.rxa);
    M3n[1].writeUint(M3n[0][0].m.rxid);
    M3n[1].writeShort(M3n[0][0].m.rxdb);
    M3n[1].writeUTF(M3n[0][0].m.n);
    M3n[1].writeUTF(M3n[0][0].m.a);
    M3n[1].writeUint(M3n[0][0].m.vu);
    M3n[1].writeUint(M3n[0][0].m.vd);
    M3n[1].writeShort(M3n[0][0].m.cr.length);
    for (
        M3n[84] = 0;
        M3n[84] < M3n[0][0].m.cr.length;
        M3n[84]++
    ) {
        M3n[1].writeUTF(M3n[0][0].m.cr[M3n[84]]);
    }
    M3n[1].writeUTF(M3n[0][0].m.mo);
    M3n[1].writeInt(M3n[0][0].m.dbid);
    M3n[1].writeBoolean(M3n[0][0].m.pub);
    M3n[1].writeInt(M3n[0][0].m.dbv);
    M3n[1].writeShort(M3n[9].ppm);
    M3n[1].writeShort(M3n[9].bro.length);
    for (M3n[17] = 0; M3n[17] < M3n[9].bro.length; M3n[17]++) {
        M3n[1].writeShort(M3n[9].bro[M3n[17]]);
    }
    M3n[1].writeShort(M3n[9].shapes.length);
    for (M3n[80] = 0; M3n[80] < M3n[9].shapes.length; M3n[80]++) {
        M3n[2] = M3n[9].shapes[M3n[80]];
        if (M3n[2].type == "bx") {
        M3n[1].writeShort(1);
        M3n[1].writeDouble(M3n[2].w);
        M3n[1].writeDouble(M3n[2].h);
        M3n[1].writeDouble(M3n[2].c[0]);
        M3n[1].writeDouble(M3n[2].c[1]);
        M3n[1].writeDouble(M3n[2].a);
        M3n[1].writeBoolean(M3n[2].sk);
        }
        if (M3n[2].type == "ci") {
        M3n[1].writeShort(2);
        M3n[1].writeDouble(M3n[2].r);
        M3n[1].writeDouble(M3n[2].c[0]);
        M3n[1].writeDouble(M3n[2].c[1]);
        M3n[1].writeBoolean(M3n[2].sk);
        }
        if (M3n[2].type == "po") {
        M3n[1].writeShort(3);
        M3n[1].writeDouble(M3n[2].s);
        M3n[1].writeDouble(M3n[2].a);
        M3n[1].writeDouble(M3n[2].c[0]);
        M3n[1].writeDouble(M3n[2].c[1]);
        M3n[1].writeShort(M3n[2].v.length);
        for (M3n[61] = 0; M3n[61] < M3n[2].v.length; M3n[61]++) {
            M3n[1].writeDouble(M3n[2].v[M3n[61]][0]);
            M3n[1].writeDouble(M3n[2].v[M3n[61]][1]);
        }
        }
    }
    M3n[1].writeShort(M3n[9].fixtures.length);
    for (M3n[20] = 0; M3n[20] < M3n[9].fixtures.length; M3n[20]++) {
        M3n[7] = M3n[9].fixtures[M3n[20]];
        M3n[1].writeShort(M3n[7].sh);
        M3n[1].writeUTF(M3n[7].n);
        if (M3n[7].fr === null) {
        M3n[1].writeDouble(Number.MAX_VALUE);
        } else {
        M3n[1].writeDouble(M3n[7].fr);
        }
        if (M3n[7].fp === null) {
        M3n[1].writeShort(0);
        }
        if (M3n[7].fp === false) {
        M3n[1].writeShort(1);
        }
        if (M3n[7].fp === true) {
        M3n[1].writeShort(2);
        }
        if (M3n[7].re === null) {
        M3n[1].writeDouble(Number.MAX_VALUE);
        } else {
        M3n[1].writeDouble(M3n[7].re);
        }
        if (M3n[7].de === null) {
        M3n[1].writeDouble(Number.MAX_VALUE);
        } else {
        M3n[1].writeDouble(M3n[7].de);
        }
        M3n[1].writeUint(M3n[7].f);
        M3n[1].writeBoolean(M3n[7].d);
        M3n[1].writeBoolean(M3n[7].np);
        M3n[1].writeBoolean(M3n[7].ng);
        M3n[1].writeBoolean(M3n[7].ig);
    }
    M3n[1].writeShort(M3n[9].bodies.length);
    for (M3n[37] = 0; M3n[37] < M3n[9].bodies.length; M3n[37]++) {
        M3n[4] = M3n[9].bodies[M3n[37]];
        M3n[1].writeUTF(M3n[4].type);
        M3n[1].writeUTF(M3n[4].n);
        M3n[1].writeDouble(M3n[4].p[0]);
        M3n[1].writeDouble(M3n[4].p[1]);
        M3n[1].writeDouble(M3n[4].a);
        M3n[1].writeDouble(M3n[4].fric);
        M3n[1].writeBoolean(M3n[4].fricp);
        M3n[1].writeDouble(M3n[4].re);
        M3n[1].writeDouble(M3n[4].de);
        M3n[1].writeDouble(M3n[4].lv[0]);
        M3n[1].writeDouble(M3n[4].lv[1]);
        M3n[1].writeDouble(M3n[4].av);
        M3n[1].writeDouble(M3n[4].ld);
        M3n[1].writeDouble(M3n[4].ad);
        M3n[1].writeBoolean(M3n[4].fr);
        M3n[1].writeBoolean(M3n[4].bu);
        M3n[1].writeDouble(M3n[4].cf.x);
        M3n[1].writeDouble(M3n[4].cf.y);
        M3n[1].writeDouble(M3n[4].cf.ct);
        M3n[1].writeBoolean(M3n[4].cf.w);
        M3n[1].writeShort(M3n[4].f_c);
        M3n[1].writeBoolean(M3n[4].f_1);
        M3n[1].writeBoolean(M3n[4].f_2);
        M3n[1].writeBoolean(M3n[4].f_3);
        M3n[1].writeBoolean(M3n[4].f_4);
        M3n[1].writeBoolean(M3n[4].f_p);
        M3n[1].writeBoolean(M3n[4].fz.on);
        if (M3n[4].fz.on) {
        M3n[1].writeDouble(M3n[4].fz.x);
        M3n[1].writeDouble(M3n[4].fz.y);
        M3n[1].writeBoolean(M3n[4].fz.d);
        M3n[1].writeBoolean(M3n[4].fz.p);
        M3n[1].writeBoolean(M3n[4].fz.a);
        M3n[1].writeShort(M3n[4].fz.t);
+       M3n[1].writeDouble(M3n[4].fz.cf);
        }
        M3n[1].writeShort(M3n[4].fx.length);
        for (M3n[28] = 0; M3n[28] < M3n[4].fx.length; M3n[28]++) {
        M3n[1].writeShort(M3n[4].fx[M3n[28]]);
        }
    }
    M3n[1].writeShort(M3n[0][0].spawns.length);
    for (
        M3n[30] = 0;
        M3n[30] < M3n[0][0].spawns.length;
        M3n[30]++
    ) {
        M3n[6] = M3n[0][0].spawns[M3n[30]];
        M3n[1].writeDouble(M3n[6].x);
        M3n[1].writeDouble(M3n[6].y);
        M3n[1].writeDouble(M3n[6].xv);
        M3n[1].writeDouble(M3n[6].yv);
        M3n[1].writeShort(M3n[6].priority);
        M3n[1].writeBoolean(M3n[6].r);
        M3n[1].writeBoolean(M3n[6].f);
        M3n[1].writeBoolean(M3n[6].b);
        M3n[1].writeBoolean(M3n[6].gr);
        M3n[1].writeBoolean(M3n[6].ye);
        M3n[1].writeUTF(M3n[6].n);
    }
    M3n[1].writeShort(M3n[0][0].capZones.length);
    for (
        M3n[74] = 0;
        M3n[74] < M3n[0][0].capZones.length;
        M3n[74]++
    ) {
        M3n[3] = M3n[0][0].capZones[M3n[74]];
        M3n[1].writeUTF(M3n[3].n);
        M3n[1].writeDouble(M3n[3].l);
        M3n[1].writeShort(M3n[3].i);
        M3n[1].writeShort(M3n[3].ty);
    }
    M3n[1].writeShort(M3n[9].joints.length);
    for (M3n[89] = 0; M3n[89] < M3n[9].joints.length; M3n[89]++) {
        M3n[5] = M3n[9].joints[M3n[89]];
        if (M3n[5].type == "rv") {
        M3n[1].writeShort(1);
        M3n[1].writeDouble(M3n[5].d.la);
        M3n[1].writeDouble(M3n[5].d.ua);
        M3n[1].writeDouble(M3n[5].d.mmt);
        M3n[1].writeDouble(M3n[5].d.ms);
        M3n[1].writeBoolean(M3n[5].d.el);
        M3n[1].writeBoolean(M3n[5].d.em);
        M3n[1].writeDouble(M3n[5].aa[0]);
        M3n[1].writeDouble(M3n[5].aa[1]);
        }
        if (M3n[5].type == "d") {
        M3n[1].writeShort(2);
        M3n[1].writeDouble(M3n[5].d.fh);
        M3n[1].writeDouble(M3n[5].d.dr);
        M3n[1].writeDouble(M3n[5].aa[0]);
        M3n[1].writeDouble(M3n[5].aa[1]);
        M3n[1].writeDouble(M3n[5].ab[0]);
        M3n[1].writeDouble(M3n[5].ab[1]);
        }
        if (M3n[5].type == "lpj") {
        M3n[1].writeShort(3);
        M3n[1].writeDouble(M3n[5].pax);
        M3n[1].writeDouble(M3n[5].pay);
        M3n[1].writeDouble(M3n[5].pa);
        M3n[1].writeDouble(M3n[5].pf);
        M3n[1].writeDouble(M3n[5].pl);
        M3n[1].writeDouble(M3n[5].pu);
        M3n[1].writeDouble(M3n[5].plen);
        M3n[1].writeDouble(M3n[5].pms);
        }
        if (M3n[5].type == "lsj") {
        M3n[1].writeShort(4);
        M3n[1].writeDouble(M3n[5].sax);
        M3n[1].writeDouble(M3n[5].say);
        M3n[1].writeDouble(M3n[5].sf);
        M3n[1].writeDouble(M3n[5].slen);
        }
        if(M3n[5].type == "g"){
            M3n[1].writeShort(5);
            M3n[1].writeUTF(M3n[5].n);
            M3n[1].writeShort(M3n[5].ja);
            M3n[1].writeShort(M3n[5].jb);
            M3n[1].writeDouble(M3n[5].r);
        }
        if(M3n[5].type != "g"){
            M3n[1].writeShort(M3n[5].ba);
            M3n[1].writeShort(M3n[5].bb);
            M3n[1].writeBoolean(M3n[5].d.cc);
            M3n[1].writeDouble(M3n[5].d.bf);
            M3n[1].writeBoolean(M3n[5].d.dl);
        }
    }
    M3n[32] = M3n[1].toBase64();
    M3n[77] = LZString.compressToEncodedURIComponent(M3n[32]);
    return M3n[77];
};
scope.decodeFromDatabase = function (map) {
    var F5W = [arguments];
    var b64mapdata = LZString.decompressFromEncodedURIComponent(map);
    var binaryReader = new bytebuffer2;
    binaryReader.fromBase64(b64mapdata, false);
    map = { v: 1, s: { re: false, nc: false, pq: 1, gd: 25, fl: false }, physics: { shapes: [], fixtures: [], bodies: [], bro: [], joints: [], ppm: 12, }, spawns: [], capZones: [], m: { a: "noauthor", n: "noname", dbv: 2, dbid: -1, authid: -1, date: "", rxid: 0, rxn: "", rxa: "", rxdb: 1, cr: [], pub: false, mo: "", }};
    map.physics = map.physics;
    map.v = binaryReader.readShort();
    if (map.v > 15) {
        throw new Error("Future map version, please refresh page");
    }
    map.s.re = binaryReader.readBoolean();
    map.s.nc = binaryReader.readBoolean();
    if (map.v >= 3) {
        map.s.pq = binaryReader.readShort();
    }
    if (map.v >= 4 && map.v <= 12) {
        map.s.gd = binaryReader.readShort();
    } else if (map.v >= 13) {
        map.s.gd = binaryReader.readFloat();
    }
    if (map.v >= 9) {
        map.s.fl = binaryReader.readBoolean();
    }
    map.m.rxn = binaryReader.readUTF();
    map.m.rxa = binaryReader.readUTF();
    map.m.rxid = binaryReader.readUint();
    map.m.rxdb = binaryReader.readShort();
    map.m.n = binaryReader.readUTF();
    map.m.a = binaryReader.readUTF();
    if (map.v >= 10) {
        map.m.vu = binaryReader.readUint();
        map.m.vd = binaryReader.readUint();
    }
    if (map.v >= 4) {
        F5W[7] = binaryReader.readShort();
        for (F5W[83] = 0; F5W[83] < F5W[7]; F5W[83]++) {
        map.m.cr.push(binaryReader.readUTF());
        }
    }
    if (map.v >= 5) {
        map.m.mo = binaryReader.readUTF();
        map.m.dbid = binaryReader.readInt();
    }
    if (map.v >= 7) {
        map.m.pub = binaryReader.readBoolean();
    }
    if (map.v >= 8) {
        map.m.dbv = binaryReader.readInt();
    }
    map.physics.ppm = binaryReader.readShort();
    F5W[4] = binaryReader.readShort();
    for (F5W[15] = 0; F5W[15] < F5W[4]; F5W[15]++) {
        map.physics.bro[F5W[15]] = binaryReader.readShort();
    }
    F5W[6] = binaryReader.readShort();
    for (F5W[28] = 0; F5W[28] < F5W[6]; F5W[28]++) {
        F5W[5] = binaryReader.readShort();
        if (F5W[5] == 1) {
        map.physics.shapes[F5W[28]] = { type: "bx", w: 10, h: 40, c: [0, 0], a: 0.0, sk: false };
        map.physics.shapes[F5W[28]].w = binaryReader.readDouble();
        map.physics.shapes[F5W[28]].h = binaryReader.readDouble();
        map.physics.shapes[F5W[28]].c = [
            binaryReader.readDouble(),
            binaryReader.readDouble(),
        ];
        map.physics.shapes[F5W[28]].a = binaryReader.readDouble();
        map.physics.shapes[F5W[28]].sk = binaryReader.readBoolean();
        }
        if (F5W[5] == 2) {
        map.physics.shapes[F5W[28]] = { type: "ci", r: 25, c: [0, 0], sk: false };
        map.physics.shapes[F5W[28]].r = binaryReader.readDouble();
        map.physics.shapes[F5W[28]].c = [
            binaryReader.readDouble(),
            binaryReader.readDouble(),
        ];
        map.physics.shapes[F5W[28]].sk = binaryReader.readBoolean();
        }
        if (F5W[5] == 3) {
        map.physics.shapes[F5W[28]] = { type: "po", v: [], s: 1, a: 0, c: [0, 0] };
        map.physics.shapes[F5W[28]].s = binaryReader.readDouble();
        map.physics.shapes[F5W[28]].a = binaryReader.readDouble();
        map.physics.shapes[F5W[28]].c = [
            binaryReader.readDouble(),
            binaryReader.readDouble(),
        ];
        F5W[74] = binaryReader.readShort();
        map.physics.shapes[F5W[28]].v = [];
        for (F5W[27] = 0; F5W[27] < F5W[74]; F5W[27]++) {
            map.physics.shapes[F5W[28]].v.push([
            binaryReader.readDouble(),
            binaryReader.readDouble(),
            ]);
        }
        }
    }
    F5W[71] = binaryReader.readShort();
    for (F5W[17] = 0; F5W[17] < F5W[71]; F5W[17]++) {
        map.physics.fixtures[F5W[17]] = { sh: 0, n: "Def Fix", fr: 0.3, fp: null, re: 0.8, de: 0.3, f: 0x4f7cac, d: false, np: false, ng: false };
        map.physics.fixtures[F5W[17]].sh = binaryReader.readShort();
        map.physics.fixtures[F5W[17]].n = binaryReader.readUTF();
        map.physics.fixtures[F5W[17]].fr = binaryReader.readDouble();
        if (map.physics.fixtures[F5W[17]].fr == Number.MAX_VALUE) {
        map.physics.fixtures[F5W[17]].fr = null;
        }
        F5W[12] = binaryReader.readShort();
        if (F5W[12] == 0) {
        map.physics.fixtures[F5W[17]].fp = null;
        }
        if (F5W[12] == 1) {
        map.physics.fixtures[F5W[17]].fp = false;
        }
        if (F5W[12] == 2) {
        map.physics.fixtures[F5W[17]].fp = true;
        }
        map.physics.fixtures[F5W[17]].re = binaryReader.readDouble();
        if (map.physics.fixtures[F5W[17]].re == Number.MAX_VALUE) {
        map.physics.fixtures[F5W[17]].re = null;
        }
        map.physics.fixtures[F5W[17]].de = binaryReader.readDouble();
        if (map.physics.fixtures[F5W[17]].de == Number.MAX_VALUE) {
        map.physics.fixtures[F5W[17]].de = null;
        }
        map.physics.fixtures[F5W[17]].f = binaryReader.readUint();
        map.physics.fixtures[F5W[17]].d = binaryReader.readBoolean();
        map.physics.fixtures[F5W[17]].np = binaryReader.readBoolean();
        if (map.v >= 11) {
        map.physics.fixtures[F5W[17]].ng = binaryReader.readBoolean();
        }
        if (map.v >= 12) {
        map.physics.fixtures[F5W[17]].ig = binaryReader.readBoolean();
        }
    }
    F5W[63] = binaryReader.readShort();
    for (F5W[52] = 0; F5W[52] < F5W[63]; F5W[52]++) {
        map.physics.bodies[F5W[52]] ={ type: "s", n: "Unnamed", p: [0, 0], a: 0, fric: 0.3, fricp: false, re: 0.8, de: 0.3, lv: [0, 0], av: 0, ld: 0, ad: 0, fr: false, bu: false, cf: { x: 0, y: 0, w: true, ct: 0 }, fx: [], f_c: 1, f_p: true, f_1: true, f_2: true, f_3: true, f_4: true, fz: { on: false, x: 0, y: 0, d: true, p: true, a: true, t: 0, cf: 0}};
        map.physics.bodies[F5W[52]].type = binaryReader.readUTF();
        map.physics.bodies[F5W[52]].n = binaryReader.readUTF();
        map.physics.bodies[F5W[52]].p = [binaryReader.readDouble(), binaryReader.readDouble()];
        map.physics.bodies[F5W[52]].a = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].fric = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].fricp = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].re = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].de = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].lv = [
        binaryReader.readDouble(),
        binaryReader.readDouble(),
        ];
        map.physics.bodies[F5W[52]].av = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].ld = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].ad = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].fr = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].bu = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].cf.x = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].cf.y = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].cf.ct = binaryReader.readDouble();
        map.physics.bodies[F5W[52]].cf.w = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].f_c = binaryReader.readShort();
        map.physics.bodies[F5W[52]].f_1 = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].f_2 = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].f_3 = binaryReader.readBoolean();
        map.physics.bodies[F5W[52]].f_4 = binaryReader.readBoolean();
        if (map.v >= 2) {
        map.physics.bodies[F5W[52]].f_p = binaryReader.readBoolean();
        }
        if (map.v >= 14) {
        map.physics.bodies[F5W[52]].fz.on = binaryReader.readBoolean();
        if (map.physics.bodies[F5W[52]].fz.on) {
            map.physics.bodies[F5W[52]].fz.x = binaryReader.readDouble();
            map.physics.bodies[F5W[52]].fz.y = binaryReader.readDouble();
            map.physics.bodies[F5W[52]].fz.d = binaryReader.readBoolean();
            map.physics.bodies[F5W[52]].fz.p = binaryReader.readBoolean();
            map.physics.bodies[F5W[52]].fz.a = binaryReader.readBoolean();
            if(map.v >= 15){
                map.physics.bodies[F5W[52]].t = binaryReader.readShort();
                map.physics.bodies[F5W[52]].cf = binaryReader.readDouble();
            }
        }
        }
        F5W[88] = binaryReader.readShort();
        for (F5W[65] = 0; F5W[65] < F5W[88]; F5W[65]++) {
        map.physics.bodies[F5W[52]].fx.push(binaryReader.readShort());
        }
    }
    F5W[97] = binaryReader.readShort();
    for (F5W[41] = 0; F5W[41] < F5W[97]; F5W[41]++) {
        map.spawns[F5W[41]] = {"x":400,"y":300,"xv":0,"yv":0,"priority":5,"r":true,"f":true,"b":true,"gr":false,"ye":false,"n":"Spawn"};
        F5W[35] = map.spawns[F5W[41]];
        F5W[35].x = binaryReader.readDouble();
        F5W[35].y = binaryReader.readDouble();
        F5W[35].xv = binaryReader.readDouble();
        F5W[35].yv = binaryReader.readDouble();
        F5W[35].priority = binaryReader.readShort();
        F5W[35].r = binaryReader.readBoolean();
        F5W[35].f = binaryReader.readBoolean();
        F5W[35].b = binaryReader.readBoolean();
        F5W[35].gr = binaryReader.readBoolean();
        F5W[35].ye = binaryReader.readBoolean();
        F5W[35].n = binaryReader.readUTF();
    }
    F5W[16] = binaryReader.readShort();
    for (F5W[25] = 0; F5W[25] < F5W[16]; F5W[25]++) {
        map.capZones[F5W[25]] = {"n":"Cap Zone","ty":1,"l":10,"i":-1};
        map.capZones[F5W[25]].n = binaryReader.readUTF();
        map.capZones[F5W[25]].l = binaryReader.readDouble();
        map.capZones[F5W[25]].i = binaryReader.readShort();
        if (map.v >= 6) {
        map.capZones[F5W[25]].ty = binaryReader.readShort();
        }
    }
    F5W[98] = binaryReader.readShort();
    for (F5W[19] = 0; F5W[19] < F5W[98]; F5W[19]++) {
        F5W[31] = binaryReader.readShort();
        if (F5W[31] == 1) {
        map.physics.joints[F5W[19]] =  {"type":"rv","d":{"la":0,"ua":0,"mmt":0,"ms":0,"el":false,"em":false,"cc":false,"bf":0,"dl":true},"aa":[0,0]};
        F5W[20] = map.physics.joints[F5W[19]];
        F5W[20].d.la = binaryReader.readDouble();
        F5W[20].d.ua = binaryReader.readDouble();
        F5W[20].d.mmt = binaryReader.readDouble();
        F5W[20].d.ms = binaryReader.readDouble();
        F5W[20].d.el = binaryReader.readBoolean();
        F5W[20].d.em = binaryReader.readBoolean();
        F5W[20].aa = [binaryReader.readDouble(), binaryReader.readDouble()];
        }
        if (F5W[31] == 2) {
        map.physics.joints[F5W[19]] = {"type":"d","d":{"fh":0,"dr":0,"cc":false,"bf":0,"dl":true},"aa":[0,0],"ab":[0,0]};
        F5W[87] = map.physics.joints[F5W[19]];
        F5W[87].d.fh = binaryReader.readDouble();
        F5W[87].d.dr = binaryReader.readDouble();
        F5W[87].aa = [binaryReader.readDouble(), binaryReader.readDouble()];
        F5W[87].ab = [binaryReader.readDouble(), binaryReader.readDouble()];
        }
        if (F5W[31] == 3) {
        map.physics.joints[F5W[19]] = {"type":"lpj","d":{"cc":false,"bf":0,"dl":true},"pax":0,"pay":0,"pa":0,"pf":0,"pl":0,"pu":0,"plen":0,"pms":0};
        F5W[90] = map.physics.joints[F5W[19]];
        F5W[90].pax = binaryReader.readDouble();
        F5W[90].pay = binaryReader.readDouble();
        F5W[90].pa = binaryReader.readDouble();
        F5W[90].pf = binaryReader.readDouble();
        F5W[90].pl = binaryReader.readDouble();
        F5W[90].pu = binaryReader.readDouble();
        F5W[90].plen = binaryReader.readDouble();
        F5W[90].pms = binaryReader.readDouble();
        }
        if (F5W[31] == 4) {
        map.physics.joints[F5W[19]] = {"type":"lsj","d":{"cc":false,"bf":0,"dl":true},"sax":0,"say":0,"sf":0,"slen":0};
        F5W[44] = map.physics.joints[F5W[19]];
        F5W[44].sax = binaryReader.readDouble();
        F5W[44].say = binaryReader.readDouble();
        F5W[44].sf = binaryReader.readDouble();
        F5W[44].slen = binaryReader.readDouble();
        }
        if(F5W[31] == 5){
            map.physics.joints[F5W[19]] = {type:"g",n:"",ja:-1,jb:-1,r:1};
            F5W[91] = map.physics.joints[F5W[19]];
            F5W[91].n = binaryReader.readUTF();
            F5W[91].ja = binaryReader.readShort();
            F5W[91].jb = binaryReader.readShort();
            F5W[91].r = binaryReader.readDouble();

        }
        if(F5W[31]!=5){
            map.physics.joints[F5W[19]].ba = binaryReader.readShort();
            map.physics.joints[F5W[19]].bb = binaryReader.readShort();
            map.physics.joints[F5W[19]].d.cc = binaryReader.readBoolean();
            map.physics.joints[F5W[19]].d.bf = binaryReader.readDouble();
            map.physics.joints[F5W[19]].d.dl = binaryReader.readBoolean();
        }
        
    }
    return map;
    };
    
scope.updateWssLog = function(){
    if(!wsslogpaused){
        if(logmenutable.children.length < wsssendrecievelog.length){
            var bottomscroll = logmenutable.clientHeight + logmenutable.scrollTop >= logmenutable.scrollHeight-1;
            while (logmenutable.children.length>1000) {
                logmenutable.removeChild(logmenutable.firstChild);
                logmenutable2.removeChild(logmenutable2.firstChild);
            }
            var loopthro = wsssendrecievelog.slice(packetcount);
            for(var i = 0; i < loopthro.length;i++){
                packetcount++;
                var row = document.createElement("tr");
                var row2 = document.createElement("tr");
 
                var cell1 = document.createElement("td");
                cell1.style["overflow-x"] = "scroll";
                cell1.style["padding"] = "0px";
                cell1.style["width"] = "100000px";
 
                var cell2 = document.createElement("td");
                cell2.style["overflow-x"] = "scroll";
                cell2.style["padding"] = "0px";
                cell2.style["width"] = "100000px";
                
                if(debuggercount){
                    cell1.style["background"] = "rgb(178, 185, 189)";
                    debuggercount = false;
                }
                else{
                    cell2.style["background"] = "rgb(178, 185, 189)";
                    debuggercount = true;
                }
                cell1.textContent = loopthro[i][1];
                cell2.textContent = loopthro[i][1];
                if(loopthro[i][0] == 0){
                    cell2.style["color"] = "transparent";
                    cell1.onclick = function(){debuggerinput.value = this.textContent};
                }
                else{
                    cell1.style["color"] = "transparent";
                    cell2.onclick = function(){debuggerinput.value = this.textContent};
                }
                row.appendChild(cell1);
                row2.appendChild(cell2);
                logmenutable.appendChild(row);
                logmenutable2.appendChild(row2);
            }
            while (logmenutable.children.length>1000) {
                logmenutable.removeChild(logmenutable.firstChild);
                logmenutable2.removeChild(logmenutable2.firstChild);
            }
            if(bottomscroll){
                logmenutable.scrollTop = logmenutable.scrollHeight;
                logmenutable2.scrollTop = logmenutable.scrollHeight;
            }
        }
    }
};
Gdocument.getElementById("maploadwindowmapscontainer").appendChild = function(args){
 
    var checkbox = Gdocument.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style["position"]="absolute";
    checkbox.style["margin-top"] = "135px";
    checkbox.style["margin-left"] = "140px";
    checkbox.style["scale"] = "2";
    checkbox.style["display"] = "none";
    checkbox.className = "quickplaycheckbox quickplayunchecked";
    if(ishost && stopquickplay==0){
        checkbox.style["display"] = "block";
        checkbox.className = "quickplaycheckbox quickplaychecked";
    }
    checkbox.checked = true;
    checkbox.onclick = function(e){e.stopPropagation();};
    args.appendChild(checkbox);
    originalMapLoad.call(this,args);
};
Gdocument.getElementById("newbonklobby_chat_content").appendChild = function(args){
    if(beenKickedTimeStamp+100>Date.now() && args.children.length>0){
        if(args.children[0].textContent.endsWith(" has left the game ") && args.children[0].textContent.startsWith("* ")){
            var kickedorbanned = "banned";
            if(onlykicked){
                kickedorbanned = "kicked";
            }
            args.children[0].textContent = args.children[0].textContent.substring(0,args.children[0].textContent.length-19)+" has been "+kickedorbanned+" from the game ";
        }
    }
    setTimeout(function(){
    if(args.textContent.startsWith("* ") && args.children.length>=5){
        var newarg = args.cloneNode();
        for(var i = 0;i<args.children.length;i++){
            var newarg2 = args.children[i].cloneNode();
            newarg2.textContent = args.children[i].textContent;
            newarg2.style.color = '#ffffffd6';
            newarg2.onclick = args.children[i].onclick;
            newarg2.suggestID = args.children[i].suggestID;
            newarg.appendChild(newarg2);
        }
        Gdocument.getElementById("ingamechatcontent").appendChild(newarg);
        Gdocument.getElementById("ingamechatcontent").scrollTop = Number.MAX_SAFE_INTEGER;
    }},0);
    originalLobbyChat.call(this,args);
};
Gdocument.getElementById("ingamechatcontent").appendChild = function(args){
    if(beenKickedTimeStamp+100>Date.now() && args.children.length>0){
        if(args.children[0].textContent.endsWith(" has left the game.") && args.children[0].textContent.startsWith("* ")){
            var kickedorbanned = "banned";
            if(onlykicked){
                kickedorbanned = "kicked";
            }
            args.children[0].textContent = args.children[0].textContent.substring(0,args.children[0].textContent.length-19)+" has been "+kickedorbanned+" from the game.";
        }
    }
    if(recordedTimeStamp+100>Date.now() && args.children.length>0){
        if(args.children[0].textContent.includes("seconds") && args.children[0].textContent.startsWith("* ")){
            args.children[0].textContent = args.children[0].textContent + " - " + playerids[recordedId].userName;
        }
    }
    originalIngameChat.call(this,args);
};  
Gwindow.Date.now = function(){
    if(overideDate[0]){
        return overideDate[1];
    }
    else if(causelag){
        return originalDatenow.call(this,...arguments)-causelag2;
    }
    return originalDatenow.call(this,...arguments);
};
Gwindow.XMLHttpRequest.prototype.open = function(_, url) {
    if (url.includes("scripts/map_get") || url.includes("scripts/map_b1_get") || url.includes("scripts/hotmaps/")) {
        if(searchrequested==1){
            Gdocument.getElementById("maploadtypedropdowntitle").click();
            Gdocument.getElementById("maploadtypedropdowntitle").textContent = dropdownrequested.textContent;
            dropdownrequested.style["display"] = "none";
            clearmaprequests.style["display"] = "block";
            refreshmaprequests.style["display"] = "block";
            Gdocument.getElementById("maploadwindowhotnessslider").style["visibility"] = "hidden";
            Gdocument.getElementById("maploadwindowsearchoptions").style["visibility"] = "hidden";
            searchrequested = 0;
            this.isSearchMap = true;
        }
    }
    else if(url.includes("getrooms.php")){
        this.isGetRooms = true;
    }
    else if(url.includes("getroomaddress.php")){
        this.isGetRoomAddress = true;
    }
    originalXMLOpen.call(this, ...arguments);
};
    
Gwindow.XMLHttpRequest.prototype.send = function(data) {
    if(this.isGetRoomAddress){
        currentroomaddress = parseInt(data.slice(3));
    }
    else if(this.isGetRooms && inroom){
        this.onreadystatechange = function(){
            if(this.readyState == 4){
                lastrooms = JSON.parse(this.response)["rooms"];
                if(lastrooms){
                    var keys = Object.keys(savedroomsdata);
                    for(var i = 0;i<lastrooms.length;i++){
                        if(savedrooms.includes(lastrooms[i].id)){
                            exists = true;
                            savedroomsdata[lastrooms[i].id] = lastrooms[i];
                            savedroomsdata[lastrooms[i].id].exists = true;
                            savedroomsdata[lastrooms[i].id].exists2 = true;
                            if(lastrooms[i].maxplayers>lastrooms[i].players){
                                if(inroom){
                                    if(lastrooms[i].id!=currentroomaddress){
                                        displayInChat('The room '+JSON.stringify(lastrooms[i].roomname)+' is now open with '+lastrooms[i].players+"/"+lastrooms[i].maxplayers+" players.","#DA0808","#1EBCC1");
                                        savedrooms.splice(savedrooms.indexOf(lastrooms[i].id),1);
                                        delete savedroomsdata[lastrooms[i].id];
                                        keys.splice(keys.indexOf((lastrooms[i].id).toString()),1);
                                    }
                                    else{
                                        savedrooms.splice(savedrooms.indexOf(lastrooms[i].id),1);
                                        delete savedroomsdata[lastrooms[i].id];
                                        keys.splice(keys.indexOf((lastrooms[i].id).toString()),1);
                                    }
                                }
                            }
                        }
                    }
                    for(var i = 0;i<keys.length;i++){
                        if(!savedroomsdata[keys[i]].exists2){
                            savedroomsdata[keys[i]].exists = false;
                        }
                        savedroomsdata[keys[i]].exists2 = false;
                        
                    }
                    for(var i = 0;i<keys.length;i++){
                        if(!savedroomsdata[keys[i]].exists){
                            savedrooms.splice(savedrooms.indexOf(parseInt(keys[i])),1);
                            displayInChat('The room '+JSON.stringify(savedroomsdata[keys[i]].roomname)+" does not exist anymore.","#DA0808","#1EBCC1");
                            delete savedroomsdata[keys[i]];
                        }
                    }
                }
            }
        }
    }
    else if (this.isSearchMap) {
        this.onreadystatechange = function () {
            if (this.readyState == 4){
                
                var jsonargs = {r:"success",maps:[],more:true};
                
                for(var i = 0; i<requestedmaps.length; i++){
                    var dec = requestedmaps[i][0];
                    var undec = requestedmaps[i][1];
                    var map = {};
                    map.id = dec["m"]["dbid"];
                    map.name = dec["m"]["n"];
                    map.authorname = dec["m"]["a"];
                    map.leveldata = undec;
                    map.publisheddate = dec["m"]["date"];
                    map.remixauthor = dec["m"]["rxa"];
                    map.remixdb = dec["m"]["rxdb"];
                    map.remixid = dec["m"]["rxid"];
                    map.remixname = dec["m"]["rxn"];
                    map.vd = dec["m"]["vd"];
                    map.vu = dec["m"]["vu"];
                    jsonargs.maps.push(map);
                        
                }
                jsonargs2 = JSON.stringify(jsonargs);
                function stringifyjsonargs(){
                    return jsonargs2;
                }
                this.__defineGetter__("responseText", stringifyjsonargs);
                this.__defineGetter__("response", stringifyjsonargs);
                
                
            }
        }
    }
    originalXMLSend.call(this, ...arguments);
};
scope.STB = function(x){
    if(x == "0"){
        return 0;
    }
    else{
        return 1;
    }
};
scope.BTS = function(x){
    if(x == 0){
        return "0";
    }
    else{
        return "1";
    }
};
scope.GET_KEYS = function(x){
    var x2 = ((x+64)>>>0).toString(2).substring(1).split("");
    return {"left":STB(x2[5]),"right":STB(x2[4]),"up":STB(x2[3]),"down":STB(x2[2]),"heavy":STB(x2[1]),"special":STB(x2[0])}
};
scope.MAKE_KEYS = function(x){
    return x.special*32+x.heavy*16+x.down*8+x.up*4+x.right*2+x.left
};
 
Gwindow.PIXI.Graphics.prototype.drawCircle = function(...args){
    
    var This = this;
    var Args = [...args];
    setTimeout(function(){
        if(This.parent){
            var childs = This.parent.children;
            var user = 0;
            for(var i = 0;i<childs.length;i++){
                if(childs[i]._text){
                    user = childs[i]._text;
                }
                if(i==2 && childs[i]!=This){
                    return;
                }
            }
            var keys = Object.keys(playerids);
            for(var i = 0;i<keys.length;i++){
                if(playerids[keys[i]].userName == user){
                    playerids[keys[i]].playerData = This.parent;
                    if(!playerids[keys[i]].playerData2){
                        playerids[keys[i]].playerData2 = {alive:true,radius:12,timeStamp:0,timeStamp2:0,px:0,py:0,pvx:0,pvy:0,xacc:0,yacc:0,xvel:0,yvel:0,balance:0};
                    }
                    playerids[keys[i]].playerData2.radius = Args[2];
                    parentDraw = This.parent;
                    while(parentDraw.parent){
                        parentDraw = parentDraw.parent;
                    }
                }
            }
        }
    },0);
    return originalDrawCircle.call(this,...args);
};    
    
Gwindow.requestAnimationFrame = function(...args){
    if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
        while(parentDraw.parent){
            parentDraw = parentDraw.parent;
        }
        var canv = 0;
        for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
            if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                canv = Gdocument.getElementById("gamerenderer").children[i];
                break;
            }
        }
        var width = parseInt(canv.style["width"]);
        var height = parseInt(canv.style["height"]);
        scale = (parseInt(canv.style["width"])/730);
        var now = Date.now();
        var keys = Object.keys(playerids);
        addto = {"children":[]};
        for(var i = 0;i<parentDraw.children.length;i++){
            if(parentDraw.children[i].constructor.name == "e"){
                addto = parentDraw.children[i];
                break;
            }
        }
        if(pan_enabled && Gdocument.getElementById("gamerenderer")?.childElementCount>0 && (keys_being_held["ShiftLeft"] || keys_being_held["ShiftRight"])){
            var temp_zoom = zoom;
            if(keys_being_held["ArrowUp"]){
                pan.y+=pan_speed/temp_zoom;
            }
            if(keys_being_held["ArrowDown"]){
                pan.y-=pan_speed/temp_zoom;
            }
            if(keys_being_held["ArrowRight"]){
                pan.x-=pan_speed/temp_zoom;
            }
            if(keys_being_held["ArrowLeft"]){
                pan.x+=pan_speed/temp_zoom;
            }
        }
        var panx = 0;
        var pany = 0;
        if(pan){
            panx = pan.x;
            pany = pan.y;
        }
        if(autocam){
            var autocamx = 365*scale;
            var autocamy = 250*scale;
            if(FollowCam && playerids[myid].playerData?.transform){
                autocamx =  playerids[myid].playerData.transform.position.x;
                autocamy =  playerids[myid].playerData.transform.position.y;
            }
            var distances = {};
            for(var i = 0;i<keys.length;i++){
                if(playerids[keys[i]].playerData && playerids[keys[i]].playerData2){
                    if(playerids[keys[i]].playerData.transform){
                        var ypos = playerids[keys[i]].playerData.transform.position.y;
                        if(ypos>460*scale && ypos< 500 * scale){
                            ypos = scale * 460;
                        }
                        distances[keys[i]] = [playerids[keys[i]].playerData.transform.position.x-autocamx,ypos-autocamy];
                    }
                }
            }
        
            distances["topleft"] = [autocamx-40,autocamy-40];
            distances["topright"] = [690*scale-autocamx,autocamy-40];
            distances["bottomleft"] = [autocamx-40,460*scale-autocamy];
            distances["bottomright"] = [690*scale-autocamx,460*scale-autocamy];
            var lowestD = [-1,-1];
            var keys2 = Object.keys(distances);
            for(var i = 0;i<keys2.length;i++){
                
                if(Math.abs(distances[keys2[i]][0]/scale)>lowestD[0]){
                    lowestD[0] = Math.abs(distances[keys2[i]][0]/scale);
                }
                if(Math.abs(distances[keys2[i]][1]/scale)>lowestD[1]){
                    lowestD[1] = Math.abs(distances[keys2[i]][1]/scale);
                }
            
            }
            
            var horizontal = (lowestD[0])/345;
            var vertical = (lowestD[1])/230;
            newzoom = Math.min(Math.abs(1/Math.max(horizontal,vertical)),1);
            
        }
        else{
            newzoom = 1;
        }
 
        newzoom2 = newzoom2 + 0.15*(newzoom-newzoom2);
        zoom2 = zoom2 + 0.15*(zoom-zoom2);
        addto.scale.x = newzoom2 * zoom2;
        addto.scale.y = newzoom2 * zoom2;
 
        
        if(holdheavy>0){
            if(holdheavy==1){
                holdheavy = -1;
            }
            else{
                holdheavy-=1;
            }
        }
        if(playerids[myid].playerData?.children){
            for(var i = 0;i<playerids[myid].playerData.children.length;i++){
                if(playerids[myid].playerData.children[i].alpha!=1){
                    heavyid = i;
                }
                if(playerids[myid].playerData.children[i].vertextData){
                    if(playerids[myid].playerData.children[i].vertextData.length == 0){
                        specialid = i;   
                    }
                }
            }
        }
        for(var i = 0;i<keys.length;i++){
            if(allstyles[playerids[keys[i]].userName]){
                var isadmin = [false,0];
                for(var i3 = 0;i3<admins.length;i3++){
                    if(admins[i3][0] == playerids[keys[i]].userName && !playerids[keys[i].guest]){
                        isadmin = [true,i3];
                        break;
                    }
                }
                
                if(playerids[keys[i]].playerData?.children){
                        for(var i2 = 0;i2<playerids[keys[i]].playerData.children.length;i2++){
                            
                            if(playerids[keys[i]].playerData.children[i2].text){
                                if(allstyles[playerids[keys[i]].userName][0]==0 && allstyles[playerids[keys[i]].userName][1]==0 && allstyles[playerids[keys[i]].userName][2]==0){
                                    playerids[keys[i]].playerData.children[i2].tint = 255*256**3-1;
                                }
                                else{
                                    playerids[keys[i]].playerData.children[i2].tint = allstyles[playerids[keys[i]].userName][0]*256**2 + allstyles[playerids[keys[i]].userName][1]*256 + allstyles[playerids[keys[i]].userName][2];
                                }
                            }
                        }
                    }
                if(isadmin[1]<=3){
                if(isadmin[0]){
                    if(playerids[keys[i]].playerData?.children && playerids[keys[i]].guest==false){
                        for(var i2 = 0;i2<playerids[keys[i]].playerData.children.length;i2++){
                            if(playerids[keys[i]].playerData.children[i2].text && (allstyles[playerids[keys[i]].userName][0]==0 && allstyles[playerids[keys[i]].userName][1]==0 && allstyles[playerids[keys[i]].userName][2]==0)){
                                playerids[keys[i]].playerData.children[i2].tint = (75+Math.abs(180-admins[isadmin[1]][1][0]))*256**2 + (75+Math.abs(180-admins[isadmin[1]][1][1]))*256 + 75+Math.abs(180-admins[isadmin[1]][1][2]);
                            }
                            if(!Array.isArray(playerids[keys[i]].playerData.children[i2].filters)){
                                playerids[keys[i]].playerData.children[i2].filters = [new Gwindow.PIXI.filters.ColorMatrixFilter()];
                                playerids[keys[i]].playerData.children[i2].filters[0].resolution = 3;
                            }
                            var rotatevalue = 0;
                            if(admins[isadmin[1]][1][3]<90){
                                rotatevalue = admins[isadmin[1]][1][3]/2;
                            }
                            else if(admins[isadmin[1]][1][3]<270){
                                rotatevalue =(180-admins[isadmin[1]][1][3])/2;
                            }
                            else if(admins[isadmin[1]][1][3]<360){
                                rotatevalue = (-360+admins[isadmin[1]][1][3])/2;
                            }
                            
                            playerids[keys[i]].playerData.children[i2].filters[0].hue(rotatevalue);
                        }
                    }
                }
                }
            }
        }
        
        parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
        parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
        parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
        parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
        if(canvasWidth!=width){
            canvasWidth = width;
            pixiCircle.clear();
            pixiCircle.x = parseInt(canv.style["width"])/2;
            pixiCircle.y = parseInt(canv.style["height"])/2;
            pixiCircle.lineStyle(3, 0x8B8000);
            pixiCircle.drawRect(-parseInt(canv.style["width"])/2,-parseInt(canv.style["height"])/2,parseInt(canv.style["width"]),parseInt(canv.style["height"]));
            pixiCircle.lineStyle(3, 0xFF0000);
            pixiCircle.arc(0, 0, 850*scale,Math.atan2(250,-100*Math.sqrt(66)),Math.atan2(250,100*Math.sqrt(66)));
            pixiCircle.lineTo(-100*Math.sqrt(66)*scale,250*scale);
            parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
            parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
            parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
            parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
        }
 
        if(!addto.children.includes(container)){
            addto.addChild(container);
        }
        if(keys.length>0){
            if(playerids[myid].playerData && playerids[myid].playerData2){
                if(aimbot || heavybot || staystill){
                    var targetid = -1;
                    var distances = {};
                    if(Gdocument.getElementById("ingamecountdown").style["visibility"] == "hidden"){
                        if(playerids[myid].playerData.transform){
                            var teamok = true;
                            if(playerids[myid].team>1){
                                teamok = false;
                            }
                            for(var i = 0;i<keys.length;i++){
                                if(playerids[keys[i]].playerData && playerids[keys[i]].playerData2 && keys[i]!=myid){
                                    if(playerids[keys[i]].playerData.transform && (playerids[keys[i]].team != playerids[myid].team || teamok || FFA)){
                                        distances[keys[i]] = Math.sqrt((playerids[keys[i]].playerData.transform.position.x-playerids[myid].playerData.transform.position.x)**2+(playerids[keys[i]].playerData.transform.position.y-playerids[myid].playerData.transform.position.y)**2);
                                    }
                                }
                            }
                        }
                    }
                    var lowestD = [-1,-1];
                    var keys2 = Object.keys(distances);
                    for(var i = 0;i<keys2.length;i++){
                        if(myid != keys2[i]){
                            if(lowestD[1] == -1){
                                lowestD[1] = distances[keys2[i]];
                                lowestD[0] = keys2[i];
                            }
                            else if(distances[keys2[i]]<lowestD[1]){
                                lowestD[1] = distances[keys2[i]];
                                lowestD[0] = keys2[i];
                            }
                        }
                    }
                    targetid = lowestD[0];
                    if(playerids[myid].playerData?.transform && playerids[myid].playerData2){
                        if(staystill & staystillpos[0]!=null){
                            var playerpos = playerids[myid].playerData.transform.position;
                            if(Math.abs(staystillpos[0]-playerpos.x/scale)<3){
                                if(playerids[myid].playerData2.xvel/scale>0){
                                    fire("keydown",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                    fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                }
                                else if(playerids[myid].playerData2.xvel/scale<0){
                                    fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                    fire("keydown",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                }
                                else{
                                    fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                    fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                }
                            }
                            else{
                                if(staystillpos[0]>playerpos.x/scale){
                                    if(playerids[myid].playerData2.xvel/scale>10){
                                        fire("keydown",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                        fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                    }
                                    else{
                                        fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                        fire("keydown",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                    }
                                }
                                else if(staystillpos[0]<playerpos.x/scale){
                                    if(playerids[myid].playerData2.xvel/scale<-10){
                                        fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                        fire("keydown",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                    }
                                    else{
                                        fire("keydown",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                        fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                    }
                                }
                            }
                        }
                    }
                    if(targetid != -1 && playerids[myid].playerData?.transform){
                        if(playerids[myid].playerData.children.length >= 7 && playerids[targetid].playerData && playerids[targetid].playerData.transform && playerids[targetid].playerData2 && aimbot){
                            var indexE = -1;
                            for(var i = 0;i<playerids[myid].playerData.children.length;i++){
                                if(playerids[myid].playerData.children[i].constructor.name == "e"){
                                    indexE = i;
                                    break;
                                }
                            }
                            if(indexE != -1 && playerids[myid].playerData.children[indexE].visible){
                                if(started == 0){
                                    started = now;
                                }
                                var scale2=1/(parseInt(canv.style["width"])/730);
                                scale2 /= scale/(1 + playerids[myid].playerData2.balance*0.0088)*(playerids[myid].playerData2.radius/12);
                                var Dstarted = (Math.min((now-started)/1000,10/3)/(10/3));
                                var v = multiplier * (Dstarted*100+15)*scale2;
                                var g = gravity;
                                var mypos = playerids[myid].playerData.transform.position;
                                var targetpos = playerids[targetid].playerData.transform.position;
                                var deltapos = [(targetpos.x-mypos.x)*scale2,(targetpos.y-mypos.y)*scale2];
                                var dis = (Math.sqrt(deltapos[0]**2 + deltapos[1]**2))/v*prediction;
                                deltapos[0]+=(playerids[targetid].playerData2.xvel*scale2*dis+(playerids[targetid].playerData2.xacc*scale2*(dis))**2/2);
                                deltapos[1]+=(playerids[targetid].playerData2.yvel*scale2*dis+(playerids[targetid].playerData2.yacc*scale2*(dis))**2/2);
                                deltapos[1] = -deltapos[1];
                                var angle = positive(-Math.atan2(deltapos[1],deltapos[0]));
                                var rot = playerids[myid].playerData.children[indexE].transform.rotation;
                                rot = positive(rot);
                                angle = positive(angle);
 
                                var alpha = deltapos[0];
                                var beta = deltapos[1];
                                var v_squared = v**2;
                                var eff = 2*v_squared/g;
                                var rootterm = eff*(eff-2*beta)-2*alpha**2;
                                if(rootterm < 0) {
                                } else {
                                    gamma_first = (eff + Math.sqrt(rootterm));
                                    gamma_second = (eff - Math.sqrt(rootterm));
                                    theta_first = positive(-Math.atan2(gamma_first, alpha));
                                    theta_second = positive(-Math.atan2(gamma_second, alpha));
                                    if(angle_between(angle,theta_first)<angle_between(angle,theta_second)){
                                        angle = theta_first;
                                    }
                                    else{
                                        angle = theta_second;
                                    }
                                }
                                var min = angle_between(angle,rot);
                                if(angle_between2(angle,rot)<0){
                                    fire("keydown",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                    fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                }
                                else{
                                    fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                    fire("keydown",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                }
                                if(min<0.05){
                                    fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                    fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                                }
                            }
                            else if(started>0){
                                started = 0;
                                fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                                fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                            }
                        }
                    }
                    if(playerids[myid].playerData?.transform && heavybot && mode!="f" && mode!="bs"){
                        var myradius = playerids[myid].playerData2.radius / scale;
                        var mypos = playerids[myid].playerData.transform.position;
                        var breakout = false;
                        for(var i = 0;i<keys2.length;i++){
                            var targetradius = playerids[keys2[i]].playerData2.radius / scale;
                            var targetpos = playerids[keys2[i]].playerData.transform.position;
                            var deltapos = [(targetpos.x-mypos.x)/scale,(targetpos.y-mypos.y)/scale];
                            for(var i2 = 0;i2<160;i2++){
                                deltapos2 = [...deltapos];
                                var i3 = i2*0.5;
                                deltapos2[0]+=((playerids[keys2[i]].playerData2.xvel-playerids[myid].playerData2.xvel)/scale*i3);
                                deltapos2[1]+=((playerids[keys2[i]].playerData2.yvel-playerids[myid].playerData2.yvel)/scale*i3);
                                var dis = Math.sqrt(deltapos2[0]**2+deltapos2[1]**2);
                                if(dis<myradius+targetradius){
                                    breakout = true;
                                    holdheavy = 20;
                                    break;
                                }
                            }
                            if(breakout){
                                break;
                            }
                        }
                        
                        if(holdheavy>0){
                            if(!heavyheld2){
                                heavyheld = playerids[myid].playerData.children[heavyid].alpha>0;
                            }
                            fire("keydown",{"keyCode":heavy},Gdocument.getElementById("gamerenderer"));
                            heavyheld2 = true;
                            if(mode == "sp"){
                                if(!grappleheld2){
                                    grappleheld = playerids[myid].playerData.children[specialid].vertexData?.length>0;
                                }
                                if(grappleheld){
                                    fire("keyup",{"keyCode":special},Gdocument.getElementById("gamerenderer"));
                                }
                                grappleheld2 = true;
                            }
                        }
                        else if(holdheavy<0){
                            holdheavy = 0;
                            heavyheld2 = false;
                            grappleheld2 = false;
                            if(!heavyheld){
                                heavyheld = false;
                                fire("keyup",{"keyCode":heavy},Gdocument.getElementById("gamerenderer"));
                            }
                            if(grappleheld && mode == "sp"){
                                grappleheld = false;
                                fire("keydown",{"keyCode":special},Gdocument.getElementById("gamerenderer"));
                            }
                        }
                        else{
                            heavyheld2 = false;
                            heavyheld = false;
                            grappleheld2 = false;
                            grappleheld = false;
                        }
                    }
 
                }
                if(FollowCam){
                    if(playerids[myid].playerData?.transform){
 
                        pixiCircle.visible = true;
 
                        parentDraw.x = -playerids[myid].playerData.x*addto.scale.x+parseInt(width)/2;
                        parentDraw.y = -playerids[myid].playerData.y*addto.scale.y+parseInt(height)/2;
                        parentDraw.children[0].x = playerids[myid].playerData.x*addto.scale.x-parseInt(width)/2;
                        parentDraw.children[0].y = playerids[myid].playerData.y*addto.scale.y-parseInt(height)/2;
                    }
                    else{
                        parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                        parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                        parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                        parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                        if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999){
                            pixiCircle.visible = false;
                        }
                        else{
                            pixiCircle.visible = true;
                        }
                    }
                }
            }
        }
        if(!FollowCam){
            if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999 && !pan_enabled){
                pixiCircle.visible = false;
            }
            else{
                pixiCircle.visible = true;
            }
        }
        parentDraw.x+=panx*addto.scale.x;
        parentDraw.y+=pany*addto.scale.y;
        parentDraw.children[0].x-=panx*addto.scale.x;
        parentDraw.children[0].y-=pany*addto.scale.y;
    }
    if(maxfps){
        return setTimeout.call(this,...args);
    }
    return requestAnimationFrameOriginal.call(this,...args);
};    
    
    
scope.SENDFUNCTION = function(args){return args;};
scope.RECIEVEFUNCTION = function(args){return args;};
scope.EVENTLOOPFUNCTION = function(){};
 
Gwindow.WebSocket.prototype.send = function(args) {
    if(this.url.includes("socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string" && !bonkwssextra.includes(this)){
            args = SENDFUNCTION(args);
            wsssendlog.push(args);
            wsssendrecievelog.push([0,args]);
            if(!bonkwss){
                bonkwss = this;
            }
            if(args.startsWith('42[26,')){
                var jsonargs = JSON.parse(args.substring(2));
                if(sandboxon){
                    if(typeof(sandboxplayerids[jsonargs[1]["targetID"]])!='undefined'){
                        var packet = '42[18,'+jsonargs[1]["targetID"]+','+jsonargs[1]["targetTeam"]+']';
                        RECIEVE(packet);
                        SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":[packet],to:[-1]}]));
                    }
                }
            }
            if(args.startsWith('42[9,')){
                var jsonargs = JSON.parse(args.substring(2));
                if(sandboxon){
                    
                    if(typeof(sandboxplayerids[jsonargs[1]["banshortid"]])!='undefined'){
                        if(Gdocument.getElementById("gamerenderer").style["visibility"] == "hidden"){
                            var packet = '42[24,'+jsonargs[1]["banshortid"].toString()+','+jsonargs[1]["kickonly"]+']';
                            var packet2 = '42[5,'+jsonargs[1]["banshortid"].toString()+',0]';
                            RECIEVE(packet);
                            RECIEVE(packet2);
                            SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":[packet,packet2],to:[-1]}]));
                        }
                        else{
                            displayInChat("Cannot delete players while ingame.","#DA0808","#1EBCC1");
                        }
                    }
                }
            }
            if(args.startsWith('42[1,')){
                return;
            }
 
            if(args.startsWith('42[4,')){
                var jsonargs = JSON.parse(args.substring(2));
                
                if(sandboxcopyme==myid && typeof(jsonargs[1]["i"])!="undefined"){
                    var jsonkeys = Object.keys(sandboxplayerids);
                    var jsonargs2 = jsonargs[1];
                    for(var i = 0; i<jsonkeys.length;i++){
                        jsonargs2["c"] = playerids[jsonkeys[i]].movecount;
                        var packet = '42[7,'+jsonkeys[i].toString()+','+JSON.stringify(jsonargs2)+']';
                        RECIEVE(packet);
                    }
                    jsonargs2["c"] = "CVALUE";
                    jsonargs2 = JSON.stringify(jsonargs2).replace('"CVALUE"',"CVALUE");
                    SEND("42"+JSON.stringify([4,{"type":"customfakerecieve","from":username,"packet":['42[7,ID,'+jsonargs2+']'],to:[-1]}]));
                }
                if(typeof(jsonargs[1]["i"]) != "undefined"){
                    if(playerids[myid].movecount>=jsonargs[1]["c"]){
                        jsonargs[1]["c"] = playerids[myid].movecount;
                        playerids[myid].movecount+=1;
                    }
                    else{
                        playerids[myid].movecount = jsonargs[1]["c"]+1;
                    }
                }
                if(recording && typeof(jsonargs[1]["i"])!="undefined"){
                    if(myid.toString() == recordingid){
                        if(recordingdata.length == 0){
                            recordingdata.push([jsonargs[1]["i"],jsonargs[1]["f"]]);
                        }
                        else{
                            recordingdata.push([jsonargs[1]["i"],jsonargs[1]["f"]-recordingdata[0][1]]);
                        }
                    }
                }
                playerids[myid].lastmove = Date.now();
                if(ishost && typeof(jsonargs[1]["i"])!="undefined"){
                    for(var i = 0;i<disabledkeys.length;i++){
                        if(GET_KEYS(jsonargs[1]["i"])[disabledkeys[i]]){
                            if(Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden" && !killedids.includes(myid)){
                                killedids.push(myid);
                                currentFrame = Math.floor((Date.now() - gameStartTimeStamp)/1000*30);
                                SEND('42[25,{"a":{"playersLeft":['+myid.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                                RECIEVE('42[31,{"a":{"playersLeft":['+myid.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                                break;
                            }
                        }
                    }
                }
                args = "42"+JSON.stringify(jsonargs);
            }
            if(args.startsWith('42[29,')){
                var jsonargs = JSON.parse(args.substring(2));
                playerids[jsonargs[1]["sid"]].playerData2.balance = jsonargs[1]["bal"];
                if(sandboxon){
                    if(typeof(sandboxplayerids[jsonargs[1]["sid"]])!='undefined'){
                        var packet = '42[36,'+jsonargs[1]["sid"]+','+jsonargs[1]["bal"]+']';
                        RECIEVE(packet);
                        SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":[packet],to:[-1]}]));
                    }
                }
            }
            if(args.startsWith('42[12,')){
                playerids = {};
                var jsonargs2 = JSON.parse(args.substring(2));
                var jsonargs = jsonargs2[1];
                playerids["0"] = {"peerID":jsonargs["peerID"],"userName":username,"level":Gdocument.getElementById("pretty_top_level").textContent == "Guest" ? 0 : parseInt(Gdocument.getElementById("pretty_top_level").textContent.substring(3)),"guest":typeof(jsonargs.token)=="undefined","team":1,"avatar":jsonargs["avatar"],"movecount":0,"commands":true,"ratelimit":{"pm":0,"mode":0,"team":0,"poll":0,"join":Date.now(),"style":0},"vote":{"poll":-1}};
                allstyles[username] = [0,0,0];
                myid = 0;
                bonkwss = this;
                hostid = 0;
                inroom = true;
                if(savedrooms.length>0){
                    Gdocument.getElementById("roomlistrefreshbutton").click();
                }
            }
            if(args.startsWith('42[10')){
                var jsonargs = JSON.parse(args.substring(2));
                if(jsonargs[2]){
                    args = "42"+JSON.stringify([10,jsonargs[1]]);
                }
                else if(translating2[0]){
                    text = translate(jsonargs[1]["message"],"auto",translating2[1]).then(function(r){SEND("42"+JSON.stringify([10,{"message":r},true]))});
                    return;
                }
            }
            if(args.startsWith('42[23,') && recteams){
                var jsonargs = JSON.parse(args.substring(2));
                var map = decodeFromDatabase(jsonargs[1]["m"]);
                var spawns = map["spawns"];
                var teamsneeded = true;
                var excludedindexes = [];
                var ffaspawns = false;
                var ffaforsure = false;
                for(var i = 0; i<spawns.length;i++){
                    var currentSpawn = spawns[i];
                    if(Math.sqrt(currentSpawn.x**2 + currentSpawn.y**2)>=850 || currentSpawn.y>250){
                        excludedindexes.push(i);
                    }
                    else if(!(currentSpawn.f || currentSpawn.r || currentSpawn.b || currentSpawn.gr || currentSpawn.ye)){
                        excludedindexes.push(i);
                    }
                    else if(currentSpawn.f){
                        ffaspawns = true;
                        if(!(currentSpawn.r || currentSpawn.b || currentSpawn.gr || currentSpawn.ye)){
                            excludedindexes.push(i);
                            ffaforsure = true
                        }
                    }
                }
                if(!ffaspawns && !ffaforsure){
                    teamsneeded = true;
                }
                else{
                    teamsneeded = false;
                }
                if(teamsneeded){
                    var newspawns = [];
                    for(var i = 0; i<spawns.length;i++){
                        if(!excludedindexes.includes(i)){
                            newspawns.push({"r":spawns[i]["r"],"g":spawns[i]["gr"],"b":spawns[i]["b"],"y":spawns[i]["ye"],"total":spawns[i]["r"]+spawns[i]["ye"]+spawns[i]["gr"]+spawns[i]["b"],"priority":spawns[i]["priority"]});
                        }
                    }
                    
                    if(newspawns.length>0){
                        
                        var teamletters = ["r","g","b","y"];
                        var ratios = {"r":0,"g":0,"b":0,"y":0};
                        for(var i = 0; i < newspawns.length;i++){
                            for(var i2 = 0; i2<teamletters.length;i2++){
                                var ct = teamletters[i2];
                                if(newspawns[i]["priority"]!=0){
                                    ratios[ct]+=(newspawns[i][ct])/newspawns[i]["total"]*newspawns[i]["priority"];
                                }
                            }
                        }
                        var highest = ["",0];
                        for(var i = 0; i<teamletters.length;i++){
                            var ct = teamletters[i];
                            if(ratios[ct]>0 && highest[1]<ratios[ct]){
                                highest = [ct,ratios[ct]];
                            }
                        }
                        if(highest[0]!=""){
                            for(var i = 0; i<teamletters.length;i++){
                                var ct = teamletters[i];
                                ratios[ct] = ratios[ct]/highest[1];
                            }
                        }
                        var playerids3 = Object.keys(playerids);
                        var playerids2 = [];
                        for(var i = 0; i<playerids3.length;i++){
                            if(playerids[playerids3[i]].team>0){
                                playerids2.push(playerids3[i]);
                            }
                        }
                        
                        var pi2l = playerids2.length;
                        var ratios2 = {"r":0,"r1":0,"g":0,"g1":0,"b":0,"b1":0,"y":0,"y1":0};
                        var items = Object.entries(ratios);
                        items.sort(function(a,b){return a[1]-b[1];});
                        var items = items.map(function(e){return e[0];});
                        var highest2 = ["",0];
                        while(pi2l>0){
                            var done = false;
                            for(var i2 = 0; i2<items.length;i2++){
                                var ci = items[i2];
                                var ci2 = items[i2]+"1";
                                for(var i = 0; i<teamletters.length;i++){
                                    var ct = teamletters[i];
                                    if(ratios2[ct]>0 && highest2[1]<ratios2[ct]){
                                        highest2 = [ct,ratios2[ct]];
                                    }
                                }
                                if(highest2[0]!=""){
                                    for(var i = 0; i<teamletters.length;i++){
                                        var ct = teamletters[i];
                                        ratios2[ct+"1"] = ratios2[ct]/highest2[1];
                                    }
                                }
                                if(ratios[ci]>0 && ratios[ci]>=ratios2[ci2] && pi2l>0){
                                    ratios2[ci]+=1;
                                    pi2l--;
                                    done = true;
                                }
                            }
                            if(pi2l>0 && !done){
                                ratios2[highest2[0]]+=1;
                                pi2l--;
                            }
                        }
                        SEND('42[32,{"t":true}]');
                        RECIEVE('42[39,true]');
                        for(var i = 0; i<ratios2["r"];i++){
                            var pid = playerids2.splice(Math.floor(Math.random()*playerids2.length),1)[0];
                            SEND('42[26,{"targetID":'+pid+',"targetTeam":2}]');
                            if(playerids[pid].peerID!="sandbox"){
                                RECIEVE('42[18,'+pid+',2]');
                            }
                        }
                        for(var i = 0; i<ratios2["g"];i++){
                            var pid = playerids2.splice(Math.floor(Math.random()*playerids2.length),1)[0];
                            SEND('42[26,{"targetID":'+pid+',"targetTeam":4}]');
                            if(playerids[pid].peerID!="sandbox"){
                                RECIEVE('42[18,'+pid+',4]');
                            }
                        }
                        for(var i = 0; i<ratios2["b"];i++){
                            var pid = playerids2.splice(Math.floor(Math.random()*playerids2.length),1)[0];
                            SEND('42[26,{"targetID":'+pid+',"targetTeam":3}]');
                            if(playerids[pid].peerID!="sandbox"){
                                RECIEVE('42[18,'+pid+',3]');
                            }
                        }
                        for(var i = 0; i<ratios2["y"];i++){
                            var pid = playerids2.splice(Math.floor(Math.random()*playerids2.length),1)[0];
                            SEND('42[26,{"targetID":'+pid+',"targetTeam":5}]');
                            if(playerids[pid].peerID!="sandbox"){
                                RECIEVE('42[18,'+pid+',5]');
                            }
                        }
                        
                    }
                }
                else{
                    SEND('42[32,{"t":false}]');
                    RECIEVE('42[39,false]');
                }
                
                
            }
 
            if(args.startsWith('42[47,') && stopquickplay == 0 && ishost && document.hidden && !qppaused){
                roundsperqp2++;
                if(roundsperqp2>=roundsperqp){
                    if(shuffle){
                        var e2 = Gdocument.getElementById("maploadwindowmapscontainer").children;
                        var available = [];
                        var availableindexes = [];
                        var notempty = false;
                        for(var i = 0; i<e2.length;i++){
                            var a = false;
                            [...e2[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                            available.push(a);
                            if(a){
                                availableindexes.push(i);
                                notempty = true;
                            }
                        }
                        if(notempty){
 
                            if(availableindexes.length!=1){
                                availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                            }
                            quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                        }
                    }
                    else{
                        var e2 = Gdocument.getElementById("maploadwindowmapscontainer").children;
                        var available = [];
                        var availableindexes = [];
                        var notempty = false;
                        for(var i = 0; i<e2.length;i++){
                            var a = false;
                            [...e2[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                            available.push(a);
                            if(a){
                                availableindexes.push(i);
                                notempty = true;
                            }
                        }
                        if(notempty){
                            var above = [];
                            for(var i = 0;i<availableindexes.length;i++){
                                if(availableindexes[i]>quicki && !reverseqp){
                                    above.push(availableindexes[i]);   
                                }
                                else if(availableindexes[i]<quicki && reverseqp){
                                    above.push(availableindexes[i])
                                }
                            }
                            if(above.length>0){
                                quicki = above[0];
                                if(reverseqp){
                                    quicki = above[above.length-1];
                                }
                            }
                            else{
                                quicki = availableindexes[0];
                                if(reverseqp){
                                    quicki = availableindexes[availableindexes.length-1];
                                }
                            }
                        }
                    }
                }
                canceled = false;
                startedinqp = true;
                window.map(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length),0); 
                
            }
            if(args.startsWith('42[32,')){
                var jsonargs = JSON.parse(args.substring(2));
                var keys = Object.keys(playerids);
                if(!jsonargs[1]["t"]){
                    FFA = true;
                    for(var i = 0;i<keys.length;i++){
                        if(playerids[keys[i]].team!=0){
                            playerids[keys[i]].team = 1;
                        }
                    }
                }
                else{
                    FFA = false;
                }
            }
            
            if(args.startsWith('42[5,')){
                var jsonargs = JSON.parse(args.substring(2));
                
                if(stopquickplay!=1 && startedinqp){
                    startedinqp = false;
                    jsonargs[1]["gs"]["wl"] = 999;
                    if(!instaqp){
                        var jsonargs2 = decodeIS(jsonargs[1]["is"]);
                        jsonargs2["ftu"] = 60;
                        if(jsonargs2["mm"]["rxa"] != ""){
                            jsonargs2["mm"]["a"] = jsonargs2["mm"]["rxa"];
                            jsonargs2["mm"]["n"] = jsonargs2["mm"]["rxn"];
                        }
                        jsonargs2 = encodeIS(jsonargs2);
                        jsonargs[1]["is"] = jsonargs2;
                        
                        var jsonargs3 = decodeFromDatabase(jsonargs[1]["gs"]["map"]);
                        if(jsonargs3["m"]["rxa"] != ""){
                            jsonargs3["m"]["a"] = jsonargs3["m"]["rxa"];
                            jsonargs3["m"]["n"] = jsonargs3["m"]["rxn"];
                        }
 
                        jsonargs3 = encodeToDatabase(jsonargs3);
                        jsonargs[1]["gs"]["map"] = jsonargs3;
                    }
                    
                    
                }
 
                args = "42"+JSON.stringify(jsonargs);
            }
        }
 
    }
    else{
        if(args.includes("rport")){
            return;
        }
    }
    if(this.url.includes("socket.io/?EIO=3&transport=websocket&sid=") && !this.injected){
        this.injected = true;
 
        var originalRecieve = this.onmessage;
        this.onmessage = function(args){
            if(!bonkwssextra.includes(this)){
            wssrecievelog.push(args.data);
            wsssendrecievelog.push([1,args.data]);
            if(typeof(args.data)=="string"){
            args = {"data":RECIEVEFUNCTION(args.data)};
            if(args.data.startsWith('42[1,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                originalSend.call(this,'42[1,{"id":'+jsonargs[2]+'}]');
            }
            if(args.data.startsWith('42[36,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                playerids[jsonargs[1]].playerData2.balance = jsonargs[2];
            }
            
            if(args.data.startsWith('42[24,')){
                beenKickedTimeStamp = Date.now();
                onlykicked = JSON.parse(args.data.substring(2))[2];
            }
            if(args.data.startsWith('42[21,')){
                recievedinitdata = true;
            }
            if(args.data.startsWith('42[48,')){
                recievedinitdata = true;
            }
            if(args.data.startsWith('42[23,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                if(causelag){
                    jsonargs[1]["result"]-=causelag2;
                }
                args.data = '42'+JSON.stringify(jsonargs);
            }
            if(args.data.startsWith('42[16,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                var now = Date.now();
                if(jsonargs[1]=="chat_rate_limit"){
                    if(pollactive[1]+100>now){
                        pollactive = [false,0,0,[]];
                        displayInChat("Your poll failed due to chat rate limit.","#DA0808","#1EBCC1");
                        displayInChat("Please try again.","#DA0808","#1EBCC1");
                    }
                }
                else if(jsonargs[1]=="room_full"){
                    if(!savedrooms.includes(currentroomaddress)){
                        savedroombutton.className = "brownButton brownButton_classic buttonShadow";
                    }
                }
            }
            if(args.data.startsWith('42[6,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                if(typeof(playerids[jsonargs[1]])!='undefined'){
                    delplayerids[jsonargs[1]] = playerids[jsonargs[1]];
                    delete playerids[jsonargs[1]];
                }
                hostid = jsonargs[2];
            }
            if(args.data.startsWith('42[39,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                var keys = Object.keys(playerids);
                if(!jsonargs[1]){
                    FFA = true;
                    for(var i = 0;i<keys.length;i++){
                        if(playerids[keys[i]].team!=0){
                            playerids[keys[i]].team = 1;
                        }
                    }
                }
                else{
                    FFA = false;
                }
            }
            if(args.data.startsWith('42[41,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                hostid = jsonargs[1]["newHost"];
            }
            if(args.data.startsWith('42[20,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                if(translating[0]){
                    translate(jsonargs[2],"auto",translating[1]).then(function(r){if(r==jsonargs[2]){return;} displayInChat(playerids[jsonargs[1]].userName+": "+r,"#DA0808","#1EBCC1")});
                }
                if(echo_list.includes(playerids[jsonargs[1]].userName)){
                    chat(flag_manage(echotext.replaceAll("username",playerids[jsonargs[1]].userName).replaceAll("message",jsonargs[2])));
                }
                if(randomchat){
                    var isin = false;
                    for(var i = 0;i<randomchatpriority[1].length;i++){
                        if(randomchatpriority[1][i][0] == jsonargs[2]){
                            isin = true;
                            if(myid!=jsonargs[1]){
                                randomchatpriority[1][i][1]+=2;
                                randomchatpriority[0]+=2;
                            }
                            break;
                        }
                    }
                    if(!isin){
                        randomchatpriority[1].push([jsonargs[2],Math.max(35-Math.abs(35-jsonargs[2].length),1)]);
                        randomchatpriority[0]+=Math.max(35-Math.abs(35-jsonargs[2].length),1);
                    }
                }
                if(pollactive[0] || pollactive2[0]){
                    var chatmessage = jsonargs[2].toUpperCase().trim().replace(")","");
                    var lettersindex = letters.indexOf(chatmessage);
                    if(ishost){
                        if(pollactive[3].length>0 && lettersindex!=-1 && lettersindex<pollactive[3].length){
                            playerids[jsonargs[1]].vote.poll = lettersindex;
                        }
                    }
                    else{
                        if(pollactive2[2].length>0 && lettersindex!=-1 && lettersindex<pollactive2[2].length){
                            playerids[jsonargs[1]].vote.poll = lettersindex;
                        }
                    }
                }
            }
            if(args.data.startsWith('42[32')){
                SEND('42[4,{"type":"inactive kick counter"}]');
            }
            if(args.data.startsWith('42[18')){
                var jsonargs = JSON.parse(args.data.substring(2));
                playerids[jsonargs[1]].team = jsonargs[2];
            }
            if(args.data.startsWith('42[40,')){
                recordedTimeStamp = Date.now();
                recordedId = JSON.parse(args.data.substring(2))[1];
            }
            
            if(args.data.startsWith('42[3,')){
                playerids = {};
                var jsonargs = JSON.parse(args.data.substring(2));
                var jsonargs2 = JSON.parse(args.data.substring(2));
                for(var i = 0; i<jsonargs[3].length;i++){
                    if(jsonargs[3][i]!=null){
                        if(jsonargs[3][i].userName == "Juice1313" && jsonargs[3][i].level > 0){
                            jsonargs2[3][i].userName = "Piss1313";
                            jsonargs[3][i].userName = "Piss1313";
                        }
                        if(jsonargs[3][i].userName == "LEGENDBOSS123" && jsonargs[3][i].level > 0){
                            jsonargs2[3][i].level = -jsonargs2[3][i].level;
                        }
                        playerids[i.toString()] = jsonargs[3][i];
                        playerids[i.toString()].commands = false;
                        playerids[i.toString()].ratelimit = {"pm":0,"mode":0,"team":0,"poll":0,"join":Date.now(),"style":0};
                        playerids[i.toString()].vote = {"poll":-1};
                        allstyles[playerids[i.toString()].userName] = [0,0,0];
                    }
                }
                if(playerids[jsonargs[1]].userName.startsWith(Gdocument.getElementById("pretty_top_name").textContent)){
                    myid = jsonargs[1];
                    bonkwss = this;
                    playerids[myid].commands = true;
                    /*setTimeout(function(){var me = playerids[myid];RECIEVE('42'+JSON.stringify([4,myid,me.peerID,me.userName,me.guest,me.level,me.team,me.avatar]));});*/
                }
                else{
                    bonkwssextra.push(this);
                }
                inroom = true;
                hostid = jsonargs[2];
                SEND('42[4,{"type":"commands"}]');
                SEND("42"+JSON.stringify([4,{"type":"style","from":username,"style":mystyle}]));
                allstyles[playerids[myid].userName] = [...mystyle];
                ghostroomwss = bonkwss;
                Gdocument.getElementById("roomlistrefreshbutton").click();
                
                setTimeout(function(){if(bonkwss == ghostroomwss && !sandboxon && !recievedinitdata && myid!=0){RECIEVE('42[21,{"map":{"v":13,"s":{"re":false,"nc":false,"pq":1,"gd":25,"fl":false},"physics":{"shapes":[],"fixtures":[],"bodies":[],"bro":[],"joints":[],"ppm":12},"spawns":[],"capZones":[],"m":{"a":"","n":"","dbv":0,"dbid":0,"authid":-1,"date":"","rxid":0,"rxn":"","rxa":"","rxdb":0,"cr":[],"pub":false,"mo":"","vu":0,"vd":0}},"gt":2,"wl":3,"q":false,"tl":false,"tea":false,"ga":"b","mo":"b","bal":[]}]');displayInChat("You have joined a ghost room.","#DA0808","#1EBCC1");}},6000);
                args.data = "42"+JSON.stringify(jsonargs2);
            }
            if(args.data.startsWith('42[21,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                mode = jsonargs[1]["mo"];
                FFA = !jsonargs[1]["tea"];
            }
            if(args.data.startsWith('42[48,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                mode = jsonargs[1]["gs"]["mo"];
                FFA = !jsonargs[1]["gs"]["tea"];
            }
            if(args.data.startsWith('42[49,')){
                /*
                var me = playerids[myid];
                RECIEVE('42'+JSON.stringify([4,myid,me.peerID,me.userName,me.guest,me.level,me.team,me.avatar]));
                */
            }
            if(args.data.startsWith('42[15,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                dontswitch = false;
                mode = jsonargs[3]["mo"];
                gameStartTimeStamp = jsonargs[1];
                killedids = [];
                Gdocument.getElementById("newbonklobby").style["z-index"] = "unset";
                Gdocument.getElementById("mapeditorcontainer").style["z-index"] = "unset";
            }
            if(args.data.startsWith('42[33,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                var decodedmap = decodeFromDatabase(jsonargs[1]);
                if(decodedmap!=0){
                    requestedmaps = [[decodedmap,jsonargs[1]]].concat(requestedmaps);
                }
            }
            if(args.data.startsWith('42[7,')){
                var jsonargs2 = JSON.parse(args.data.substring(2));
                var idofpacket = jsonargs2[1];
                jsonargs = jsonargs2[2];
                if(typeof(jsonargs["i"]) == "undefined"){
                    
                    if(jsonargs["type"]=="private chat" && jsonargs["to"] == username){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        if(!ignorepmlist.includes(from)){
                            if(typeof(jsonargs["message"])=="string"){
                                var now = Date.now();
                                if(playerids[idofpacket].ratelimit.pm+500<now){
                                    playerids[idofpacket].ratelimit.pm = now;
                                    DECRYPT_MESSAGE(private_key,jsonargs["message"]).then(function(e){
                                        var encodedtext = e;
                                        var code = 'Gwindow.private_chat = "'+from+'"; Gwindow.SEND("42"+JSON.stringify([4,{"type":"request public key","from":Gwindow.username,"to":Gwindow.private_chat}])); Gwindow.request_public_key_time_stamp = Date.now(); setTimeout(function(){if(Gwindow.private_chat_public_key[0]!=Gwindow.private_chat){Gwindow.displayInChat("Failed to connect to "+Gwindow.private_chat+".","#DA0808","#1EBCC1");Gwindow.private_chat = Gwindow.private_chat_public_key[0];}},1600);';
                                        displayInChat('> '+'<a onclick = \''+code+'\' style = "color:green;" href = "javascript:void(0);">'+sanitize(from)+'</a>'+': ',"#DA0808","#1EBCC1",{sanitize:false},encodedtext);
 
                                        Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true;
                                        Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true;
                                        
                                        Laster_message = lastmessage();
                                    }).catch(function(){EXPORT_KEY(public_key).then(function(e){SEND("42"+JSON.stringify([4,{"type":"public key correction","from":username,"to":private_chat_public_key[0],"public key":e}]));});});
                                }
                            }
                        }
                    }
                    
                    if(jsonargs["type"]=="request public key" && jsonargs["to"] == username){
                        EXPORT_KEY(public_key).then(function(e){SEND("42"+JSON.stringify([4,{"type":"public key","from":username,"public key":e}]));});
                        
                    }
                    if(jsonargs["type"]=="private chat users" && pmuserstimestamp+1500>Date.now()){
                        
                        if(typeof(jsonargs["from"])!='undefined'){
                            from = jsonargs["from"];
                            if(Object.keys(playerids).includes(idofpacket.toString())){
                                from = playerids[idofpacket].userName;
                            }
                            if(!pmusers.includes(from) && username == jsonargs["to"]){
                                pmusers.push(from);
                            }
                        }
                    }
                    if(jsonargs["type"]=="style" && playerids[idofpacket].ratelimit["style"]+3000<Date.now()){
                        playerids[idofpacket].ratelimit["style"] = Date.now();
                        if(Array.isArray(jsonargs["style"])){
                            if(jsonargs["style"].length == 3){
                                var valid = true;
                                
                                for(var i = 0;i<jsonargs["style"].length;i++){
                                    if(Number.isInteger(jsonargs["style"][i])){
                                        if(jsonargs["style"][i]>255 || jsonargs["style"][i]<0){
                                            valid = false;
                                            break;
                                        }
                                    }
                                    else{
                                        valid = false;
                                        break;
                                    }
                                }
                                if(valid){
                                    allstyles[playerids[idofpacket].userName] = jsonargs["style"];
                                }
                            }
                        }
                    }
                    if(jsonargs["type"]=="request private chat users"){
                        if(typeof(jsonargs["from"])!='undefined'){
                            from = jsonargs["from"];
                            if(Object.keys(playerids).includes(idofpacket.toString())){
                                from = playerids[idofpacket].userName;
                            }
                            SEND("42"+JSON.stringify([4,{"type":"private chat users","from":username,"to":from}]));
                        }
                    }
                    if(jsonargs["type"]=="public key" && request_public_key_time_stamp+1500>Date.now()){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        if(from == private_chat){
                            IMPORT_KEY(jsonargs["public key"]).then(function(key){private_chat_public_key = [private_chat,key];displayInChat("Private chatting with "+private_chat+".","#DA0808","#1EBCC1");});
                        }
                    }
                    if(jsonargs["type"]=="fakerecieve" && hostid == idofpacket && sandboxon && ((jsonargs["to"].includes(myid) && jsonargs["to"][0]!=-1) || (!jsonargs["to"].includes(myid) && jsonargs["to"][0]==-1))){
                        for(var i = 0;i<jsonargs["packet"].length;i++){
                            if(!jsonargs["packet"][i].trim().startsWith("42[20,") && !jsonargs["packet"][i].trim().startsWith("41")){
                                RECIEVE(sanitize(jsonargs["packet"][i]));
                            }
                        }
                    }
                    if(jsonargs["type"]=="customfakerecieve" && hostid == idofpacket && sandboxon && ((jsonargs["to"].includes(myid) && jsonargs["to"][0]!=-1) || (!jsonargs["to"].includes(myid) && jsonargs["to"][0]==-1))){
                        for(var i2 = 0;i2<jsonargs["packet"].length;i2++){
                            var keys = Object.keys(sandboxplayerids);
                            for(var i = 0;i<keys.length;i++){
                                if(jsonargs["packet"][i2].startsWith("42[7,")){
                                    originalRecieve.call(this,{data:jsonargs["packet"][i2].replace("ID",keys[i].toString()).replace("CVALUE",playerids[keys[i]].movecount.toString())});
                                    playerids[keys[i]].movecount+=1;
                                }
                            }
                        }
                    }
                    if(jsonargs["type"]=="commands"){
                        playerids[idofpacket].commands = true;
                    }
                    if(jsonargs["type"]=="sandboxid" && hostid == idofpacket && sandboxon && ((jsonargs["to"].includes(myid) && jsonargs["to"][0]!=-1) || (!jsonargs["to"].includes(myid) && jsonargs["to"][0]==-1))){
                        sandboxid = jsonargs["lastid"];
                    }
                    if(jsonargs["type"]=="sandboxon" && idofpacket == hostid){
                        if(!sandboxon){
                            displayInChat("This is a sandbox lobby.","#DA0808","#1EBCC1");
                            sandboxon = true;
                        }
                    }
                    if(jsonargs["type"]=="vote poll"){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        if(typeof(jsonargs["vote"]) == 'number' && idofpacket!=hostid){
                            var now = Date.now();
                            if(ishost && pollactive[3].length>1 && pollactive[0]){
                                if(jsonargs["vote"]>=0 && jsonargs["vote"]<pollactive[3].length){
                                    playerids[idofpacket].vote.poll = jsonargs["vote"];
                                }
                            }
                            else if(pollactive2[0] && pollactive2[2].length>1){
                                if(jsonargs["vote"]>=0 && jsonargs["vote"]<pollactive2[2].length){
                                    playerids[idofpacket].vote.poll = jsonargs["vote"];
                                }
                            }
                        }
 
                    }
                    if(jsonargs["type"]=="poll end"){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        var now = Date.now();
                        if(hostid == idofpacket && playerids[idofpacket].ratelimit.poll+5000<now){
                            playerids[idofpacket].ratelimit.poll = now;
                            var count = [0,0,0,0];
                            var keys = Object.keys(playerids);
                            for(var i = 0;i<keys.length;i++){
                                if(playerids[keys[i]].vote.poll!=-1 && playerids[keys[i]].vote.poll<pollactive2[2].length-1){
                                    count[playerids[keys[i]].vote.poll]++;
                                }
                                playerids[keys[i]].vote.poll = -1;
                            }
                            displayInChat("The poll ended.","#DA0808","#1EBCC1");
                            for(var i = 0;i<count.length;i++){
                                if(count[i]>1){
                                    displayInChat(count[i].toString()+" people voted for option "+letters[i]+".","#DA0808","#1EBCC1");
                                }
                                if(count[i]==1){
                                    displayInChat(count[i].toString()+" person voted for option "+letters[i]+".","#DA0808","#1EBCC1");
                                }
                            }
                            pollactive2 = [false,0,[]];
                        }
 
                    }
                    if(jsonargs["type"] == "video player" && idofpacket == hostid && ((jsonargs["to"].includes(myid) && jsonargs["to"][0]!=-1) || (!jsonargs["to"].includes(myid) && jsonargs["to"][0]==-1))){
                        changeJukeboxURL(jsonargs["url"],jsonargs["timestamp"]);
                    }
                    if(jsonargs["type"]=="poll" && idofpacket == hostid){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        if(Array.isArray(jsonargs["poll"])){
                            var propperpoll = true;
                            var pollifproper = [];
                            if(jsonargs["poll"].length>5){
                                propperpoll = false;
                            }
                            else{
                                for(var i = 0;i<jsonargs["poll"].length;i++){
                                    if(typeof(jsonargs["poll"][i]) == 'string'){
                                        if(jsonargs["poll"][i].length>50){
                                            propperpoll = false;
                                            break;
                                        }
                                        else{
                                            pollifproper.push(jsonargs["poll"][i]);
                                        }
                                    }
                                    else{
                                        propperpoll = false;
                                        break;
                                    }
                                }
                            }
                            if(propperpoll){
                                var now = Date.now();
                                var keys = Object.keys(playerids);
                                for(var i = 0;i<keys.length;i++){
                                    playerids[keys[i]].vote.poll = -1;
                                }
                                pollactive2 = [true,now,pollifproper];
                                playerids[idofpacket].ratelimit.poll = now;
                                displayInChat(from+" started a poll:","#DA0808","#1EBCC1");
                                for(var i = 0;i<pollifproper.length;i++){
                                    var code = 'Gwindow.displayInChat("You voted for option '+letters[i]+'.","#DA0808","#1EBCC1",{sanitize:false},"",true);Gwindow.SEND("42"+JSON.stringify([4,{"type":"vote poll","from":Gwindow.username,"vote":'+i+'}]));Gwindow.playerids[Gwindow.myid].vote.poll='+i+';Gwindow.Gdocument.getElementById("newbonklobby_chat_content").children[Gwindow.Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true;Gwindow.Gdocument.getElementById("ingamechatcontent").children[Gwindow.Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true;Gwindow.Laster_message = Gwindow.lastmessage();';
                                    
                            
                                    displayInChat('<a onclick = \''+code+'\' style = "color:green;" href = "javascript:void(0);">'+letters[i]+')</a>',"#DA0808","#1EBCC1",{sanitize:false}," "+pollifproper[i]);
                                }
                                
                            }
                        }
                    }
                    if(jsonargs["type"]=="request mode" && playerids[idofpacket].ratelimit.mode+1000<Date.now()){
                        playerids[idofpacket].ratelimit.mode = Date.now();
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        var req_mode = jsonargs["mode"];
                        var req_mode2 = "";
                        if(req_mode){
                            if(req_mode == "b"){
                                req_mode2 = "Classic";
                            }
                            else if(req_mode == "sp"){
                                req_mode2 = "Grapple";
                            }
                            else if(req_mode == "ar"){
                                req_mode2 = "Arrows";
                            }
                            else if(req_mode == "ard"){
                                req_mode2 = "Death Arrows";
                            }
                        }
                        if(req_mode2){
                            var code = 'if(!Gwindow.ishost){Gwindow.displayInChat("You must be host to change the mode.","#DA0808","#1EBCC1",{sanitize:false},"",true)}else{Gwindow.changemode("'+req_mode+'")}';
                            
                            displayInChat('> '+playerids[idofpacket].userName+' requests [<a onclick = \''+code+'\' style = "color:green;" href = "javascript:void(0);">'+req_mode2+'</a>]',"#DA0808","#1EBCC1",{sanitize:false}," mode.");
                        }
 
                    }
                    if(jsonargs["type"]=="public key correction" && private_chat_public_key[0] == private_chat){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket].userName;
                        }
                        if(from == private_chat){
                            IMPORT_KEY(jsonargs["public key"]).then(function(public_key){private_chat_public_key = [private_chat,public_key]; ENCRYPT_MESSAGE(private_chat_public_key[1],pmlastmessage).then(function(e){
                                setTimeout(function(){SEND("42"+JSON.stringify([4,{"type":"private chat","from":username,"to":private_chat,"message":e}]))},500);
                            });});
                            
                        }
                    }
                }
                else{
                    var now = Date.now();
                    if(playerids[idofpacket.toString()]){
                        playerids[idofpacket.toString()].lastmove = now;
                    }
                    if(idofpacket!=myid){
                        playerids[idofpacket.toString()].movecount+=1;
                    }
                    if(Math.abs(gameStartTimeStamp - (now-1000*jsonargs["f"]/30))>1000 && idofpacket!=myid){
                        gameStartTimeStamp = now-1000*jsonargs["f"]/30;
                    }
                    if(recording){
                        if(idofpacket.toString() == recordingid){
                            if(recordingdata.length == 0){
                                recordingdata.push([jsonargs["i"],jsonargs["f"]]);
                            }
                            recordingdata.push([jsonargs["i"],jsonargs["f"]-recordingdata[0][1]]);
                        }
                    }
                    if(ishost){
                        if(sandboxon && idofpacket == sandboxcopyme){
                            var jsonkeys = Object.keys(sandboxplayerids);
                            if(!jsonkeys.includes(sandboxcopyme.toString())){
                                var jsonargs2 = jsonargs;
                                for(var i = 0; i<jsonkeys.length;i++){
                                    jsonargs2["c"] = playerids[jsonkeys[i]].movecount;
                                    var packet = '42[7,'+jsonkeys[i].toString()+','+JSON.stringify(jsonargs2)+']';
                                    RECIEVE(packet);
                                }
                                jsonargs2["c"] = "CVALUE";
                                jsonargs2 = JSON.stringify(jsonargs2).replace('"CVALUE"',"CVALUE");
                                SEND("42"+JSON.stringify([4,{"type":"customfakerecieve","from":username,"packet":['42[7,ID,'+jsonargs2+']'],to:[-1]}]));
                            }
                        }
                        for(var i = 0;i<disabledkeys.length;i++){
                            var get_keys_var = GET_KEYS(jsonargs["i"]);
                            if(get_keys_var[disabledkeys[i]]){
                                if(Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden" && !killedids.includes(idofpacket)){
                                    killedids.push(idofpacket);
                                    currentFrame = Math.floor((Date.now() - gameStartTimeStamp)/1000*30);
                                    SEND('42[25,{"a":{"playersLeft":['+idofpacket.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                                    RECIEVE('42[31,{"a":{"playersLeft":['+idofpacket.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                                    break;
                                }
                            }
                        }
                    }
                }
            }
 
            if(args.data.startsWith('42[4,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                if(jsonargs[3] == "Juice1313" && jsonargs[5] > 0){
                    jsonargs[3] = "Piss1313";
                }
                
                playerids[jsonargs[1]] = {"peerID":jsonargs[2],"userName":jsonargs[3],"guest":jsonargs[4],"level":jsonargs[5],"team":jsonargs[6],"avatar":jsonargs[7],"movecount":0,"ratelimit":{"pm":0,"mode":0,"team":0,"poll":0,"join":Date.now(),"style":0},"vote":{"poll":-1}};
                if(jsonargs[2]!="sandbox"){
                    SEND('42[4,{"type":"commands"}]');
                    if(!Object.keys(allstyles).includes(jsonargs[3])){
                        allstyles[jsonargs[3]] = [0,0,0];
                        SEND("42"+JSON.stringify([4,{"type":"style","from":username,"style":allstyles[playerids[myid].userName]}]));
                    }
                }
                if(sandboxon){
                    var sandboxkeys = Object.keys(sandboxplayerids);
                    if(sandboxkeys.includes(jsonargs[1].toString())){
                        delete sandboxplayerids[jsonargs[1]];
                    }
                    if(jsonargs[2]=="sandbox"){
                        sandboxplayerids[jsonargs[1]] = jsonargs[3];
                        if(jsonargs[1]>sandboxid){
                            sandboxid = parseInt(jsonargs[1])+1;
                        }
                    }
                    else{
                        if(ishost){
                            SEND('42[4,{"type":"sandboxon"}]');
                            var sandboxkeys = Object.keys(sandboxplayerids);
                            var packets = [];
                            for(var i = 0;i<sandboxkeys.length;i++){
                                var p = playerids[sandboxkeys[i]];
                                var packet = '42'+JSON.stringify([4,sandboxkeys[i],p.peerID,p.userName,p.guest,p.level,p.team,p.avatar]);
                                packets.push(packet);
                            }
                            SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":packets,to:[jsonargs[1]]}]));
                            SEND("42"+JSON.stringify([4,{"type":"sandboxid","from":username,"lastid":sandboxid,to:[jsonargs[1]]}]));
                        
                        }
                    }
                }
                if(ishost){
                    if(jointext!="" && jsonargs[2]!="sandbox"){
                        chat(flag_manage(jointext.replaceAll("username",jsonargs[3])));
                    }
                    if(jointeam!=-1 && jsonargs[2]!="sandbox"){
                        SEND('42[26,{"targetID":'+jsonargs[1].toString()+',"targetTeam":'+jointeam.toString()+'}]');
                        setTimeout(function(){RECIEVE('42[18,'+jsonargs[1].toString()+','+jointeam.toString()+']');});
                    }
                    if(jukeboxplayer.src!="" && !jukeboxplayer.paused){
                        SEND("42"+JSON.stringify([4,{"type":"video player","from":username,"url":jukeboxplayerURL,"timestamp":Date.now()-jukeboxplayer.currentTime*1000,"to":[jsonargs[1]]}]));
                    }
                    if(freejoin){
                        var count = 0;
                        var keys = Object.keys(playerids);
                        for(var i = 0; i<keys.length;i++){
                            if(playerids[keys[i]].team!=0){
                                count++;
                            }
                        }
                        if(count <= 2 && jsonargs[6]!=0){
                            setTimeout(function(){
                                Gdocument.getElementById("newbonklobby_editorbutton").click();
                                Gdocument.getElementById("mapeditor_close").click();
                                Gdocument.getElementById("newbonklobby").style["display"] = "none";
                                Gdocument.getElementById("mapeditor_midbox_testbutton").click();
                                if(transitioning == true){
                                    canceled = true;
                                }
                            },150);
                        }
                    }
                }
                if(jsonargs[3] == "LEGENDBOSS123" && jsonargs[5] > 0){
                    jsonargs[5] = -jsonargs[5];
                }
                args.data = "42" + JSON.stringify(jsonargs);
            }
            if(args.data.startsWith('42[5,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                if(typeof(playerids[jsonargs[1]])!='undefined'){
                    delplayerids[jsonargs[1]] = playerids[jsonargs[1]];
                    delete allstyles[playerids[jsonargs[1]].userName];
                    delete playerids[jsonargs[1]];
                }
                if(sandboxon && typeof(sandboxplayerids[jsonargs[1]])!='undefined'){
                    delete sandboxplayerids[jsonargs[1]];
                }
            }
            }}
            return originalRecieve.call(this,args);
        };
 
        var originalClose = this.onclose;
        this.onclose = function () {
            
            if(bonkwssextra.includes(this)){
                bonkwssextra.splice(bonkwssextra.indexOf(this),1)
            }
            else{
                window.bonkwss = 0;
            }
            return originalClose.call(this);
        }
 
    }
    return originalSend.call(this,args);
};
 
scope.SEND = function(args){
    if(bonkwss!=0){
        bonkwss.send(args);
    }
};
scope.RECIEVE = function(args){
    if(bonkwss!=0){
        bonkwss.onmessage({data:args});
    }
};
 
 
 
scope.dontswitch = false;
scope.username = 0;
scope.timedelay = 1400;
scope.ishost = false;
scope.checkboxhidden = true;
scope.quicki=0;
scope.defaultmode = "d";
scope.recmodebool = false;
scope.shuffle = false;
scope.startedinqp = false;
scope.instaqp = false;
scope.freejoin = false;
scope.recordedTimeStamp = 0;
scope.recordedId = 0;
scope.smartteams = false;
scope.beenKickedTimeStamp = 0;
scope.stopquickplay = 1;
scope.currentFrame = 0;
scope.text2speech = false;
scope.canceled = false;
scope.wintext = "";
scope.banned = [];
scope.transitioning = false;
scope.echo_list = [];
scope.echoAppend = "";
scope.message = "";
scope.private_chat = "";
scope.private_chat_public_key = ["",[0,0]];
scope.disabledkeys = [];
scope.actuallyhost = false;
scope.pmusers = [];
scope.pmlastmessage = "";
scope.pmuserstimestamp = 0;
scope.ignorepmlist = [];
scope.scroll = false;
scope.elem = Gdocument.getElementById("maploadwindowmapscontainer");
scope.npermissions = 1;
scope.space_flag = false;
scope.rcaps_flag = false;
scope.number_flag = false;
scope.reverse_flag = false;
scope.autocorrect = false;
scope.request_public_key_time_stamp = 0;
scope.sandboxcopyme = -1;
scope.recteams = false;
scope.chatheight = 128;
scope.onlykicked = false;
scope.killedids = [];
scope.jointext = "";
scope.randomchat = false;
scope.randomchatpriority = [0,[]];
scope.randomchatlastmessage = ["",0];
scope.afkkill = -1;
scope.tournament_mode = "";
scope.tournament_scores = [];
scope.tournament_in_and_out = {"in":[],"out":[]};
scope.echotext = "message";
scope.nextafter = 0;
scope.nextafterbuffer = -1;
scope.roundsperqp = 1;
scope.roundsperqp2 = 0;
scope.autorecord = false;
scope.poll = [];
scope.letters = ["A","B","C","D","E"];
scope.qppaused = false;
scope.FollowCam = false;
scope.autocam = false;
scope.gravity = 20;
scope.randomchat = false;
scope.randomchat_randomtimestamp = 0;
scope.randomchat_timestamp = 0;
scope.multiplier = 3.65;
scope.aimbot = false;
scope.recievedinitdata = false;
scope.heavybot = false;
scope.zoom = 1;
scope.prediction = 350;
scope.started = 0;
scope.holdheavy = 0;
scope.maxfps = false;
scope.grappleheld = false;
scope.grappleheld2 = false;
scope.heavyheld = false;
scope.reverseqp = false;
scope.jointeam = -1;
scope.heavyheld2 = false;
scope.heavyid = 3;
scope.specialid = 0;
scope.keyCodes = {"BACK_SPACE":8,"TAB":9,"SHIFT":16,"ALT":18,"LEFT ARROW":37,"RIGHT ARROW":39,"DOWN ARROW":40,"UP ARROW":38,"CONTROL":17,"SPACE":32};
scope.leftRight = [37,39];
scope.upDown = [38,40];
scope.heavy = 88;
scope.special = 90;
scope.newzoom2 = 1;
scope.staystill = false;
scope.staystillpos = [0,0];
scope.zoom2 = 1;
scope.admins = [["LEGENDBOSS123",[0,0,0,0]],["iNeonz",[0,0,0,0]],["left paren",[0,0,0,0]],["Moving 1",[0,0,0,0]],["An Admin",[0,0,0,0]],["L armee d LS",[0,0,0,0]],["Pixelmelt",[0,0,0,0]],["pro9905",[0,0,0,0]],["JustANameForMe",[0,0,0]],["nefarious mouse",[0,0,0,0]],["Annihilate Red",[0,0,0,0]],["Ghost_mit",[0,0,0,0]],["Neptune_1",[0,0,0,0]]];

scope.letters2 = Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
scope.superscript_letters = Array.from("ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ");
scope.hollow_letters = Array.from("𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ");
scope.block_letters = Array.from("🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉");
scope.bold_letters = Array.from("𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙");
scope.italicized_letters = Array.from("𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡");
scope.glitched_letters = Array.from("ⱥƀȼđēӻꞡħīɉҟłᵯꞥꝋꝑꝗɍꞩⱦᵾꝟⱳӿɏƶȺɃȻĐɆӺ₲ĦĪɈҞŁᛗꞤꝊꝐꝖꞦꞨȾɄꝞⱲӾɎƵ");
scope.cursive_letters = Array.from("𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵");

scope.letter_dictionary = {};
for(var i = 0;i<letters2.length;i++){
    letter_dictionary[letters2[i]] = [superscript_letters[i],hollow_letters[i],block_letters[i],bold_letters[i],italicized_letters[i],glitched_letters[i],cursive_letters[i]];
}
scope.textmode = -1;
scope.autokickban = 0;
scope.ghostroomwss = -1;
scope.autokickbantimestamp = 0;
scope.getroomslastcheck = 0;
scope.causelag = false;
scope.causelag2 = 0;
scope.overideDate = [false,0];
scope.scale = 1;
scope.translating = [false,""];
scope.translating2 = [false,""];
scope.translatingkeys = {"english":"en","chinese":"zh","japanese":"ja","dutch":"nl","hindi":"hi","spanish":"es","portugese":"pt","french":"fr","arabic":"ar","russian":"ru","korean":"ko"};
scope.translate = function(text,fromL,toL) {
    var fL = fromL || 'en';
    var tL = toL || 'de';
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl='+ fL + "&tl=" + tL + "&dt=t&q=" + encodeURI(text);
    var parseJSON = txt => JSON.parse(txt.split(',').map( x => x || 'null').join(',')) ;
    var joinSnippets = json => json[0].map( x => x[0] ).join('');
    return fetch(url).then(function(res){
        return res.text();
    }).then(function(text){
        return joinSnippets(parseJSON(text));
    });
};
scope.positive = function(angle){
    if(angle<0){
        angle += 2*Math.PI;
    }
    return angle%(Math.PI*2);
};
scope.angle_between = function(angle,angle2){
    return Math.min(Math.abs(positive(angle)-positive(angle2)),Math.PI*2-Math.abs(positive(angle)-positive(angle2)));
};
scope.angle_between2 = function(angle,angle2){
    if(angle_between(angle,angle2+Math.PI/2)<Math.PI/2){
        return 1;
    }
    return -1;
};
 
scope.stringdistance = function(s1,s2){
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    var matrix = Array(s1.length+1);
    for(var i = 0;i<matrix.length;i++){
        matrix[i] = Array(s2.length+1);
        matrix[i][0] = i;
    }
    for(var i = 0;i<matrix[0].length;i++){
        matrix[0][i] = i;
    }
    for(var i = 1;i<s1.length+1;i++){
        for(var i2 = 1;i2<s2.length+1;i2++){
            if(s1[i-1]==s2[i2-1]){  
                matrix[i][i2] = matrix[i-1][i2-1];
            }
            else{
                matrix[i][i2] = Math.min(matrix[i][i2-1],matrix[i-1][i2],matrix[i-1][i2-1])+1;
            }
        }
    }
    return matrix[s1.length][s2.length];
};
scope.closestWord = function(word){
    if(word.length>20 || word.length<2){
        return word;
    }
    var distances = [word.length,""];
    var playernamelist = [];
    var keys = Object.keys(playerids);
    for(var i = 0;i<keys.length;i++){
        playernamelist.push(playerids[keys[i]].userName);
    }
    var wordlist2 = playernamelist.concat(wordlist);
    for(var i = 0;i<wordlist2.length;i++){
        var distance = stringdistance(word,wordlist2[i]);
        if(distance<=distances[0]){
            distances[0] = distance;
            distances[1] = wordlist2[i];
            if(distance == 0){
                return wordlist2[i];
            }
        }
    };
    if(distances[1] == ""){
        return word;
    }
    return distances[1];
};
 
 
 
scope.replay = function(){
    var frame = getCurrentFrame();
    /*var replaycounter = 0;
    while(1){
        if(replaycounter != recordingdata.length-1){
            for(var i = 0;i<recordingdata[replaycounter+1][1]-recordingdata[replaycounter][1];i++){
                RECIEVE('42[7,'+myid+',{"i":'+recordingdata[replaycounter][0]+',"f":'+(frame+i+recordingdata[replaycounter][1]).toString()+',"c":'+playerids[myid].movecount+'}]');
                playerids[myid].movecount+=1;
            }
            replaycounter+=1;
        }
        else{
            break;
        }
    }*/
    
    for(var i = 0;i<recordingdata.length;i++){
        SEND('42[4,{"i":'+recordingdata[i][0]+',"f":'+(frame+recordingdata[i][1]).toString()+',"c":'+playerids[myid].movecount+'}]');
    }
};
scope.presskeys = function(x,y){
    if(!x.left && y.left){
        fire("keydown",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
    }
    else if(x.left && !y.left){
        fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
    }
    if(!x.right && y.right){
        fire("keydown",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
    }
    else if(x.right && !y.right){
        fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
    }
    if(!x.up && y.up){
        fire("keydown",{"keyCode":upDown[0]},Gdocument.getElementById("gamerenderer"));
    }
    else if(x.up && !y.up){
        fire("keyup",{"keyCode":upDown[0]},Gdocument.getElementById("gamerenderer"));
    }
    if(!x.down && y.down){
        fire("keydown",{"keyCode":upDown[1]},Gdocument.getElementById("gamerenderer"));
    }
    else if(x.down && !y.down){
        fire("keyup",{"keyCode":upDown[1]},Gdocument.getElementById("gamerenderer"));
    }
    if(!x.heavy && y.heavy){
        fire("keydown",{"keyCode":heavy},Gdocument.getElementById("gamerenderer"));
    }
    else if(x.heavy && !y.heavy){
        fire("keyup",{"keyCode":heavy},Gdocument.getElementById("gamerenderer"));
    }
    if(!x.special && y.special){
        fire("keydown",{"keyCode":special},Gdocument.getElementById("gamerenderer"));
    }
    else if(x.special && !y.special){
        fire("keyup",{"keyCode":special},Gdocument.getElementById("gamerenderer"));
    }
    
};
scope.getplayerkeys = function(){
    var keykeys = Object.keys(keyCodes);
    var keyslist = Array.from(Gdocument.getElementById("redefineControls_table").children[0].children[1].children).slice(1);
    var keyslist2 = Array.from(Gdocument.getElementById("redefineControls_table").children[0].children[2].children).slice(1);
    var keyslist3 = Array.from(Gdocument.getElementById("redefineControls_table").children[0].children[3].children).slice(1);
    var keyslist4 = Array.from(Gdocument.getElementById("redefineControls_table").children[0].children[4].children).slice(1);
    var keyslist5 = Array.from(Gdocument.getElementById("redefineControls_table").children[0].children[5].children).slice(1);
    var keyslist6 = Array.from(Gdocument.getElementById("redefineControls_table").children[0].children[6].children).slice(1);
    for(var i = 0;i<keyslist.length;i++){
        if(keykeys.includes(keyslist[i].textContent)){
            leftRight[0] = keyCodes[keyslist[i].textContent];
            break;
        }
        else{
            leftRight[0] = keyslist[i].textContent.charCodeAt(0);
            break
        }
    }
    for(var i = 0;i<keyslist2.length;i++){
        if(keykeys.includes(keyslist2[i].textContent)){
            leftRight[1] = keyCodes[keyslist2[i].textContent];
            break;
        }
        else{
            leftRight[1] = keyslist2[i].textContent.charCodeAt(0);
            break
        }
    }
    for(var i = 0;i<keyslist3.length;i++){
        if(keykeys.includes(keyslist3[i].textContent)){
            upDown[0] = keyCodes[keyslist3[i].textContent];
            break;
        }
        else{
            upDown[0] = keyslist3[i].textContent.charCodeAt(0);
            break
        }
    }
    for(var i = 0;i<keyslist4.length;i++){
        if(keykeys.includes(keyslist4[i].textContent)){
            upDown[1] = keyCodes[keyslist4[i].textContent];
            break;
        }
        else{
            upDown[1] = keyslist4[i].textContent.charCodeAt(0);
            break
        }
    }
    for(var i = 0;i<keyslist5.length;i++){
        if(keykeys.includes(keyslist5[i].textContent)){
            heavy = keyCodes[keyslist5[i].textContent];
            break;
        }
        else{
            heavy = keyslist5[i].textContent.charCodeAt(0);
            break
        }
    }
    for(var i = 0;i<keyslist6.length;i++){
        if(keykeys.includes(keyslist6[i].textContent)){
            special = keyCodes[keyslist6[i].textContent];
            break;
        }
        else{
            special = keyslist6[i].textContent.charCodeAt(0);
            break
        }
    }
};
scope.changeJukeboxURL = function(url,timestamp = 0){
    if(pipedurllist.length == 0){
        displayInChat("The jukebox is still being set up.","#DA0808","#1EBCC1");
        return;
    }
    if(url == ""){
        jukeboxplayer.pause();
        jukeboxplayer.src = '';
        displayInChat("The jukebox has been paused.","#DA0808","#1EBCC1");
    }
    else if(url == jukeboxplayerURL && Date.now()-timestamp >= 2000){
        jukeboxplayer.volume = jukeboxplayervolume/100;
        displayInChat("The jukebox has been unpaused or reset.","#DA0808","#1EBCC1",{sanitize:false});
        jukeboxplayer.play();
        jukeboxplayer.currentTime = (Date.now()-timestamp)/1000;
    }
    else{
        var id = url.match(/youtu\.?be.com\/watch\?.*v=[a-z|A-Z|0-9|_|-]{11}/)[0].split("?v=");
        id = id[id.length-1];
        var loaded = false;
        var loaded2 = 0;
        for(var inst = 0;inst<pipedindexes.length;inst++){
            checkJukeboxStream(pipedindexes[inst],id).then(function(value){
                loaded2+=1;
                if(value!=-1 && !loaded){
                    loaded = true;
                    jukeboxplayer.src = value[0];
                    jukeboxplayer.volume = jukeboxplayervolume/100;
                    jukeboxplayerURL = url;
                    jukeboxplayer.oncanplaythrough = function(){
                        displayInChat("The jukebox has been changed to: ","#DA0808","#1EBCC1",{sanitize:false},url);
                        displayInChat("Jukebox is now playing: "+value[1]+" by "+value[2]+".","#DA0808","#1EBCC1");
                        jukeboxplayer.play();
                        jukeboxplayer.currentTime = (Date.now()-timestamp)/1000;
                        jukeboxplayer.oncanplaythrough = null;
                    };
                    jukeboxplayer.onerror = function(){
                        displayInChat("The jukebox failed to load. Please try again.","#DA0808","#1EBCC1");
                    };
                }
            });
        }
        new Promise(function(r){
            var interv = setInterval(function(){
                if(loaded2>=pipedindexes.length){
                    if(!loaded){
                        displayInChat("The jukebox failed to load. Please try again.","#DA0808","#1EBCC1");
                    }
                    clearInterval(interv);
                }
            },60)
        });
    }
};
scope.help = ["All the commands are:","/help","/?","/advhelp [command]","/space","/rcaps","/number","/autocorrect","/translateto [language]","/translate [language]","/randomchat","/speech","/savedroom","/clearsavedroom","/pan","/resetpan","/style [R G B]","/maxfps","/textmode [1-7]","/followcam","/autocam","/zoom [in/out/reset]","/xray","/aimbot","/heavybot","/still","/echo [username]","/clearecho","/remove [username]","/echotext [text]","/chatw [username]","/msg [text]","/ignorepm [username]","/record [username]","/replay","/stoprecord","/loadrecording [text]","/saverecording [text]","/delrecording [text]","/volume [0-100]","/pmusers","/pollstat","/lobby","/score","/team [letter]","/mode [mode]","/scroll","/hidechat","/showchat","/notify","/stopnotify","/support","Host commands are:","/startqp","/stopqp","/pauseqp","/revqp","/next","/nextafter [seconds]","/previous","/shuffle","/instaqp","/jukebox [link]","/pausejukebox","/resetjukebox","/playjukebox","/freejoin","/recmode","/recteam","/defaultmode [mode]","/start","/balanceA [number]","/moveA [letter]","/moveT [letter] [letter]","/balanceT [letter] [number]","/killA","/rounds [number]","/roundsperqp [number]","/disablekeys [keys]","/jointext [text]","/jointeam [letter]","/wintext [text]","/autorecord","/afkkill [number]","/ban [username]","/kill [username]","/resetpoll","/addoption [text]","/deloption [letter]","/startpoll [seconds]","/endpoll","/autokick","/autoban","/sandbox","Sandbox commands are:","/addplayer [number]","/addname [text]","/delplayer [number]","/copy [username]","Debugging commands are:","/eval [code]","/debugger","Hotkeys are:","Alt L","Alt B","Alt C","Alt I","Alt <","Alt >","Alt N","Alt V","Alt G","Alt H","Alt J","Alt W","Host hotkeys are:","Alt S","Alt P","Alt T","Alt E","Alt K","Alt M","Alt Q","Alt A","Alt D","Alt F","Alt R","Alt [","Alt ]"];
 
scope.adv_help = {"help":"Shows all command names.",
                "?":"Shows all command names.",
                "advhelp":"Shows a command in detail.",
                "space":"Toggles space. When space is on, whatever you type will be spaced apart.",
                "rcaps":"Toggles rcaps. When rcaps is on, each letter will randomly get capitalized.",
                "number":"Toggles number. When number is on, 'a' becomes 4, 'e' becomes 3, 's' becomes 5, 'o' becomes 0, 'l' and 'i' become 1.",
                "speech":"Turns on text to speech for the chat.",
                "savedroom":"Displays all the rooms you have saved, you can remove individual ones from the saved rooms by clicking \"Remove\".",
                "maxfps":"Toggles maxfps. When maxfps is on, your fps will be increased.",
                "clearsavedroom":"Clears all the saved rooms.",
                "echo":"Echoes a username. It copies the username's chat messages.",
                "echotext":"Sets a message when someone who is echoed chats. \"message\" will get replaced by the person's message. \"username\" will get replaced by the person's username.",
                "remove":"Removes username from echo list. You will not echo that username anymore.",
                "clearecho":"Clears echo list. You will not echo anyone anymore.",
                "chatw":"It private chats with username. Type /msg to message that username.",
                "msg":"Messages with what username you are chatting with. Type /chatw to chat with a username.",
                "ignorepm":"Ignores the username's private chat messages. To unignore, type '/ignorepm [username]'.",
                "pmusers":"Dispays who you can private chat with.",
                "pollstat":"Displays the current poll and its votes.",
                "textmode":"Changes the text font.",
                "eval":"Evaluates code. Only use this if you are experienced in javascript.",
                "debugger":"Opens debugger.",
                "style":"Change the color of your username, level, and background. For example, '/style 255 0 0' will make your username red.",
                "translate":"Translates peoples texts to the chosen language.",
                "translateto":"You will now speak the chosen language.",
                "autocorrect":"Fixes spelling mistakes.",
                "randomchat":"Spams random chat messages from the past.",
                "lobby":"Makes lobby visible when you are ingame. Type '/lobby' again to close lobby.",
                "score":"Displays the current score while ingame. Type '/score' again to hide the score.",
                "pan":"Toggles pan mode. Use Shift+Arrow Keys to move the camera around.",
                "resetpan":"Resets pan.",
                "team":"Joins a specific team. 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "scroll":"Toggles a scrollbar in ingame chat.",
                "followcam":"Enables follow camera. Your character will be centered on the screen.",
                "autocam":"Zooms in/out enough for you to see everyone on the screen.",
                "zoom":"Zooms in, out, or resets zoom.",
                "xray":"Removes all shapes that don't have a shadow. This means all non-physics shapes will be hidden.",
                "aimbot":"Toggles aimbot. Aimbot will aim for you in arrows or death arrows mode.",
                "heavybot":"Enables heavy bot. Heavy bot will heavy right before collision. Turn this off when player collision is off, because heavy bot will still function.",
                "still":"Saves your position, and tries to reach it constantly. This is useful in parkour if you want to go afk. Use Alt+W instead, because this feature will fail when you are in chat.",
                "lagbot":"Makes your movements very laggy. Type '/lagbot 0' to turn it off.",
                "hidechat":"Hides ingame chat. Type '/showchat' to show it again.",
                "showchat":"Shows ingame chat. '/hidechat' hides the chat.",
                "notify":"You will be notified if a person types @username",
                "stopnotify":"You will not be notified if a person types @username",
                "support":"Displays all the people who have supported this mod.",
                "startqp":"Starts cycling maps in your map menu.",
                "stopqp":"Stops cycling maps in your map menu.",
                "revqp":"Reverses the order of quickplay. '/next', '/previous' will be inverted.",
                "pauseqp":"Only pauses or unpauses the quickplay cycle due to round end. '/next', '/previous' still work. Type 'pauseqp' to unpause quickplay.",
                "next":"Skips the map. Usable only with '/startqp'.",
                "nextafter":"Skips the map if no one is able to win/draw within a certain amount of time.",
                "previous":"Goes to previous map. Usable only with '/startqp'.",
                "shuffle":"Makes quickplay play random maps instead of in order.",
                "freejoin":"Toggles freejoin. If freejoin is on, starts the game instantly if there are 1 or less players currently playing.",
                "recmode":"In quickplay, it switches mode to recommended mode, according to editor.",
                "recteam":"In quickplay, it sorts people into teams when teams are necessary.",
                "defaultmode":"Switches mode to defaultmode if there is no recmode.",
                "start":"Starts game instantly.",
                "instaqp":"Rounds will instantly start without a countdown.",
                "balanceA":"Balances everyone with balance number.",
                "moveA":"Sets everyones team. 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "balanceT":"Sets everyones balance to the number. The team is 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "killA":"Kills everyone.",
                "jointeam":"Sets the team of anyone who joins. 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "moveT":"Sets everyone in one team to another team. 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "rounds":"Sets rounds to win.",
                "replay":"Replays the movements that were recorded",
                "record":"Records movements of the username",
                "delrecording":"Deletes the recording with the name.",
                "saverecording":"Saves the recording with the name.",
                "loadrecording":"Loads the recording with the name. Type '/replay' to replay it.",
                "stoprecord":"Stops recording the player. Type '/saverecording [text]' to save it.",
                "jukebox":"Sets the jukebox to a link. That link will play for everyone who has this mod.",
                "volume":"Sets the volume of the jukebox.",
                "pausejukebox":"If the jukebox is playing, it pauses it.",
                "resetjukebox":"Resets the jukebox, so it starts from the very beginning.",
                "playjukebox":"If the jukebox is paused, it plays it.",
                "roundsperqp":"After that many rounds, the map will change. Normally, the map will change after 1 round.",
                "autorecord":"After a round ends, automatically records the last 15 seconds.",
                "mode":"If host, switches mode. Otherwise, it requests the host to switch mode, as long as the host has this mod.",
                "disablekeys":"If anyone presses a disabled key, they get killed. Key options: left right up down heavy special.",
                "jointext":"Chats the jointext whenever someone joins. \"username\" will get replaced by the joining person's username.",
                "wintext":"Chats the wintext whenever someone wins. \"username\" will get replaced by the winning person's username.",
                "afkkill":"If a person stays afk for that many seconds, they get automatically killed.",
                "ban":"Bans username from lobby. If they rejoin, it automatically bans.",
                "kill":"Kills the person ingame.",
                "resetpoll":"Clears the poll.",
                "addoption":"Adds the option to the poll. You can only have 4 maximum options. Type '/deloption [letter]' to remove an option.",
                "deloption":"Removes the option with that letter.",
                "startpoll":"Starts a poll that lasts for at least 10 seconds. Type '/endpoll' to end it early.",
                "endpoll":"Ends the poll early if the poll lasted for at least 10 seconds.",
                "addplayer":"In sandbox, it adds bots.",
                "addname":"Adds a bot with a specific name. If that name already exists, it will copy the skin of that player to the bot.",
                "delplayer":"In sandbox, it deletes bots.",
                "copy":"In sandbox, it makes all bots copy the username's movements.",
                "sandbox":"Turns a normal lobby into a sandbox lobby. You cannot turn a sandbox lobby back into a normal lobby.",
                "autokick":"Automatically kicks everyone who is not using this mod.",
                "autoban":"Automatically bans everyone who is not using this mod.",
                "Alt L":"Makes lobby visible when you are ingame. Press Alt L again to close lobby.",
                "Alt C":"Hides ingame chat. Press Alt C again to show ingame chat.",
                "Alt S":"Starts game instantly.",
                "Alt T":"Toggles teams.",
                "Alt N":"Enables follow camera. Your character will be centered on the screen.",
                "Alt G":"Zooms in.",
                "Alt H":"Resets zoom.",
                "Alt J":"Zooms out.",
                "Alt Y":"Enables xray. Removes all shapes that don't have a shadow. This means all non-physics shapes will be hidden.",
                "Alt E":"Toggles editor.",
                "Alt K":"Exits ingame and returns to lobby.",
                "Alt M":"Switches modes.",
                "Alt V":"Toggles autocam. Autocam zooms in/out enough for you to see everyone on the screen.",
                "Alt Q":"Toggles quickplay.",
                "Alt B":"Displays the current score while ingame. Press Alt B again to hide the score.",
                "Alt A":"Skips the map if quickplay is on.",
                "Alt D":"Goes to previous map if quickplay is on.",
                "Alt F":"Toggles freejoin. If freejoin is on, starts the game instantly if there are 1 or less players currently playing.",
                "Alt O":"Enables heavy bot. Heavy bot will heavy right before collision. Turn this off when player collision is off, because heavy bot will still function.",
                "Alt U":"Toggles aimbot. Aimbot will aim for you in arrows or death arrows mode.",
                "Alt P":"Only pauses or unpauses the quickplay cycle due to round end. '/next', '/previous' still work. Type 'pauseqp' to unpause quickplay.",
                "Alt R":"In quickplay, it switches mode to recommended mode, according to editor.",
                "Alt I":"Opens debugger.",
                "Alt W":"Saves your position, and tries to reach it constantly. This is useful in parkour if you want to go afk.",
                "Alt <":"Lowers ingame chat height.",
                "Alt >":"Highers ingame chat height.",
                "Alt [":"Toggles pan mode. Use Shift+Arrow Keys to move the camera around.",
                "Alt ]":"Resets pan."
                 };
scope.displayadvhelp = function(command){
    displayInChat(adv_help[command],"#009398","#DA0808",{sanitize:true},"",true);
};
scope.changemode = function(mode){
    SEND('42[20,{"ga":"b","mo":"'+mode+'"}]');
    RECIEVE('42[26,"b","'+mode+'"]');
};
Gdocument.getElementById("ingamechatcontent").style["pointer-events"]="all";
Gdocument.getElementById("ingamechatcontent").style["max-height"]=chatheight.toString()+"px";
Gdocument.getElementById("ingamechatcontent").style["height"]=chatheight.toString()+"px";
Gdocument.getElementById("ingamechatbox").style["height"]="100%";
 
document.getElementById('adboxverticalCurse').style["display"] = "none";
document.getElementById('adboxverticalleftCurse').style["display"] = "none";
elem.onclick=function(e){
    if(stopquickplay==0 && ishost == true && e.isTrusted == true){
        quicki = (Array.from(e.target.parentElement.parentNode.children).indexOf(e.target.parentNode)-1)%(Gdocument.getElementById("maploadwindowmapscontainer").children.length);
        if(reverseqp){
            quicki+=2;
            quicki = quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length);
        }
    }
};
scope.getCurrentFrame = function(){
    currentFrame = Math.floor((Date.now() - gameStartTimeStamp)/1000*30);
    return currentFrame;
};
scope.urlify = function(text) {
    if(!Gdocument.getElementById('bl_Menu')){
    return text.replace(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:;%.\-_\+~#=]{2,256}\.[\-a-z]{2,6}\b([\-a-zA-Z0-9@:;%_\+.~#?&//=]*)/ig, function(url) {
        var extratext = "";
        var matches = url.match(/youtu\.?be.com\/watch\?.*v=[a-z|A-Z|0-9|_|-]{11}/);
        if(matches){
            var button = Gdocument.createElement("a");
            button.style["color"] = "green";
            button.textContent = "Play";
            button.href = "javascript:void(0)";
            button.setAttribute("onclick",function(){
                if(Gwindow.ishost){
                    Gwindow.SEND("42"+JSON.stringify([4,{"type":"video player","from":Gwindow.username,"url":"URL INSERT HERE","timestamp":Gwindow.Date.now()+2000,"to":[-1]}]));
                    Gwindow.displayInChat("Jukebox is loading... Please wait a few seconds.","#DA0808","#1EBCC1");
                    Gwindow.changeJukeboxURL("URL INSERT HERE",Gwindow.Date.now()+2000);
                }
                else{
                    Gwindow.displayInChat("You need to be host.","#DA0808","#1EBCC1");
                }
            });
            
            button.attributes["onclick"].nodeValue = button.attributes["onclick"].nodeValue.slice(11,-1).replaceAll("URL INSERT HERE","https://www."+matches[0]);
            
            var extratext = ' ['+button.outerHTML+']';
        }
        if(url.startsWith('https://') || url.startsWith('http://')){return '<a href="' + url + '" target="_blank" style = "color:orange">' + sanitize(url) + '</a>'+extratext;}
        else{return '<a href="https://' + url + '" target="_blank" style = "color:orange">' + sanitize(url) + '</a>'+extratext;}
  })}return text;
};
scope.fire = function(type,options,d = Gdocument){
     var event= document.createEvent("HTMLEvents");
     event.initEvent(type,true,false);
     for(var p in options){
         event[p]=options[p];
     }
     d.dispatchEvent(event);
};
 
scope.chat = function(message){
    SEND('42[10,{"message":'+JSON.stringify(message)+'}]');
};
scope.chat2 = function(message,enteragain=false){
    mess = Gdocument.getElementById("newbonklobby_chat_input").value;
    mess2 = Gdocument.getElementById("ingamechatinputtext").value;
    Gdocument.getElementById("newbonklobby_chat_input").value = message;
    Gdocument.getElementById("ingamechatinputtext").value = message;
    fire("keydown",{keyCode:13});
    if(!enteragain){
        fire("keydown",{keyCode:13});
    }
    Gdocument.getElementById("newbonklobby_chat_input").value = mess;
    Gdocument.getElementById("ingamechatinputtext").value = mess2;
};
scope.sanitize = function(message){
    return message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
};
scope.displayInChat = function(message, LobbyColor, InGameColor, options, message2, BringDown) {
            options = options ?? {};
            BringDown = BringDown ?? false;
            message2 = message2 ?? "";            
            LobbyColor = LobbyColor ?? "#8800FF";
            InGameColor = InGameColor ?? "#AA88FF";
            var A = Gdocument.createElement("div");
            var B = Gdocument.createElement("span");
            B.className = "newbonklobby_chat_status";
            B.style.color = LobbyColor;
            A.appendChild(B);
            B.innerHTML = (options.sanitize ?? true) ? message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;') : message;
            B.innerHTML+=urlify(message2.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;'));
            var C = Gdocument.createElement("div");
            var D = Gdocument.createElement("span");
            D.style.color = InGameColor;
            C.appendChild(D);
            D.innerHTML = (options.sanitize ?? true) ? message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;') : message;
            D.innerHTML+=urlify(message2.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;'));
            var a = BringDown;
            if(Gdocument.getElementById("newbonklobby_chat_content").clientHeight + Gdocument.getElementById("newbonklobby_chat_content").scrollTop >= Gdocument.getElementById("newbonklobby_chat_content").scrollHeight-1) {
                a = true;
            }
            var b = BringDown;
            if(Gdocument.getElementById("ingamechatcontent").clientHeight + Gdocument.getElementById("ingamechatcontent").scrollTop >= Gdocument.getElementById("ingamechatcontent").scrollHeight-1) {
                b = true;
            }
            A.style["parsed"] = true;
            C.style["parsed"] = true;
            Gdocument.getElementById("newbonklobby_chat_content").appendChild(A);
            Gdocument.getElementById("ingamechatcontent").appendChild(C);
            if (a) { Gdocument.getElementById("newbonklobby_chat_content").scrollTop = Gdocument.getElementById("newbonklobby_chat_content").scrollHeight;};
            if (b) { Gdocument.getElementById("ingamechatcontent").scrollTop = Gdocument.getElementById("ingamechatcontent").scrollHeight;};
            if(Gdocument.getElementById("newbonklobby_chat_input").style["pointer-events"]!="auto" && !Gdocument.getElementById("ingamechatinputtext").classList.value.includes("ingamechatinputtextbg")){
                chat2("");
            }
};
 
scope.lobby = function(){
    if (Gdocument.getElementById("newbonklobby").style["display"]=="none"){
 
        Gdocument.getElementById("newbonklobby_editorbutton").click();
        Gdocument.getElementById("mapeditor_close").click();
        if(Gdocument.getElementById("newbonklobby_playerbox_elementcontainer").children.length+Gdocument.getElementById("newbonklobby_specbox_elementcontainer").children.length-3>0){
            Gdocument.getElementById("newbonklobby").style["z-index"]=1;
            Gdocument.getElementById("maploadwindowcontainer").style["z-index"]=1;
            Gdocument.getElementById("mapeditorcontainer").style["z-index"]=1;
            Gdocument.getElementById("pretty_top").style["z-index"]=3;
            Gdocument.getElementById("settingsContainer").style["z-index"]=3;
            Gdocument.getElementById("leaveconfirmwindow").style["z-index"]=3;
            Gdocument.getElementById("hostleaveconfirmwindow").style["z-index"]=3;
            debuggermenu.style["z-index"] = 2;
        }
        else{
            Gdocument.getElementById("newbonklobby").style["opacity"]=0;
            Gdocument.getElementById("newbonklobby").style["display"]="none";
            Gdocument.getElementById("mapeditorcontainer").style["z-index"]=0;
 
        }
 
    }
    else if(Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
        Gdocument.getElementById("newbonklobby").style["opacity"]=0;
        Gdocument.getElementById("newbonklobby").style["display"]="none";
        Gdocument.getElementById("mapeditorcontainer").style["z-index"]=0;
 
    }
};
 
scope.lastmessage = function(){
    if(Gdocument.getElementById("newbonklobby_chat_content").children.length!=0){
        var lm = Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children;
        var lm2 = "";
        for(var i = 0; i<lm.length;i++){
            lm2+="  "+lm[i].textContent.trim();
        }
        lm2 = lm2.trim();
        if(lm2.startsWith("*")){
            return lm2;
        }
    }
    if(Gdocument.getElementById("ingamechatcontent").children.length!=0){
        var lm = Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children;
        var lm2 = "";
        for(var i = 0; i<lm.length;i++){
            lm2+="  "+lm[i].textContent.trim();
        }
        return lm2.trim();
    }
    return "";
 
};
scope.map = function(e,t=timedelay){
    if(e<0){
        displayInChat("There is no previous map.","#DA0808","#1EBCC1");
        quicki = 0;
        return;
    }
    if(Gdocument.getElementById("maploadwindowmapscontainer").children[e] == undefined){
        displayInChat("Click the maps button.","#DA0808","#1EBCC1");
        return;
    }
 
    setTimeout(function(){if(!canceled){
                          startedinqp = true;
                          if(roundsperqp2>=roundsperqp){
                              roundsperqp2 = 0;
                          }
                          Gdocument.getElementById("maploadwindowmapscontainer").children[e].click();
                          Gdocument.getElementById("newbonklobby_editorbutton").click();
                          if(recmodebool && ishost){
                              var mode = Gdocument.getElementById("mapeditor_modeselect").value;
                              if(mode == "" && defaultmode!="d"){
                                      mode = defaultmode;
                              }
                              if(mode != ""){
                                  RECIEVE('42[26,"b","'+mode+'"]');
                              }
                          }
                          var displayblock = Gdocument.getElementById("newbonklobby").style["display"] == "block";
                          Gdocument.getElementById("mapeditorcontainer").style["display"] = "none";
                          Gdocument.getElementById("newbonklobby").style["display"] = "none";
                          if(displayblock){
                              Gdocument.getElementById("newbonklobby").style["display"] = "block";
                          }
                          Gdocument.getElementById("mapeditor_midbox_testbutton").click();}
                          canceled = false;
                          transitioning = false;
                         },t);
 
};
 
scope.gotonextmap = function(e){
    if(e<0){
        displayInChat("There is no previous map.","#DA0808","#1EBCC1");
        quicki = 0;
        return;
    }
    if(Gdocument.getElementById("maploadwindowmapscontainer").children[e] == undefined){
        displayInChat("Click the maps button.","#DA0808","#1EBCC1");
        return;
    }
    Gdocument.getElementById("maploadwindowmapscontainer").children[e].click();
    Gdocument.getElementById("newbonklobby_editorbutton").click();
    if(recmodebool && ishost){
        var mode = Gdocument.getElementById("mapeditor_modeselect").value;
        if(mode == "" && defaultmode!="d"){
                mode = defaultmode;
        }
        if(mode != ""){
            RECIEVE('42[26,"b","'+mode+'"]');
        }
    }
    startedinqp = true;
    if(roundsperqp2>=roundsperqp){
        roundsperqp2 = 0;
    }
    var displayblock = Gdocument.getElementById("newbonklobby").style["display"] == "block";
    Gdocument.getElementById("mapeditorcontainer").style["display"] = "none";
    Gdocument.getElementById("newbonklobby").style["display"] = "none";
    if(displayblock){
        Gdocument.getElementById("newbonklobby").style["display"] = "block";
    }
    Gdocument.getElementById("mapeditor_midbox_testbutton").click();
    Gdocument.getElementById("newbonklobby").style["visibility"] = "visible";
};
scope.commandhandle = function(chat_val){
    if (chat_val.substring(1,6)=="echo " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        if (chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"")==username){
            displayInChat("You cannot echo yourself.","#DA0808","#1EBCC1");
            return "";
        }
        else if (echo_list.indexOf(chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',""))===-1) {
 
            echo_list.push(chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',""));
            displayInChat(chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"") + " is being echoed.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            displayInChat(chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"") + " is already being echoed.","#DA0808","#1EBCC1");
            return "";
        }
    }
    else if (chat_val.substring(1,8)=="remove "  && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        if (echo_list.indexOf(chat_val.substring(7).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',""))!==-1){
            echo_list.splice(echo_list.indexOf(chat_val.substring(7).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"")),1);
            displayInChat(chat_val.substring(7).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"")+" is not being echoed.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            displayInChat("You cannot remove someone that you didn't echo.","#DA0808","#1EBCC1");
            return "";
        }
 
    }
    else if (chat_val.substring(1,10)=="echotext "  && chat_val.replace(/^\s+|\s+$/g, '').length>=9){
        echotext = chat_val.substring(9).replace(/^\s+|\s+$/g, '');
        displayInChat("Set echotext as: "+echotext,"#DA0808","#1EBCC1");
        displayInChat("Type '/echotext' to reset echotext.","#DA0808","#1EBCC1");
        return "";
 
    }
    else if (chat_val.substring(1,9)=="echotext"){
        echotext = "message";
        displayInChat("Reset echotext.","#DA0808","#1EBCC1");
        return "";
 
    }
    else if (chat_val.substring(1,10)=="clearecho"){
        echo_list = [];
        displayInChat("Cleared the echo list.","#DA0808","#1EBCC1");
        return "";
    }
    else if (chat_val.substring(1,11)=="randomchat"){
        if(randomchat == true){
            displayInChat("Random chat is now off.","#DA0808","#1EBCC1");
            randomchat = false;
        }
        else{
            displayInChat("Random chat is now on.","#DA0808","#1EBCC1");
            randomchat = true;
        }
        return "";
    }
    else if (chat_val.substring(1,12)=="autocorrect"){
        if(autocorrect == true){
            displayInChat("Autocorrect is now off.","#DA0808","#1EBCC1");
            autocorrect = false;
        }
        else{
            displayInChat("Autocorrect is now on.","#DA0808","#1EBCC1");
            autocorrect = true;
        }
        return "";
    }
    else if (chat_val.substring(1,13)=="translateto " && chat_val.replace(/^\s+|\s+$/g, '').length>=14){
        var text = chat_val.substring(13).replace(/^\s+|\s+$/g, '').toLowerCase();
        var keys = Object.keys(translatingkeys);
        if(keys.includes(text)){
            translating2 = [true,translatingkeys[text]];
            displayInChat("You will now speak the "+text+" language.","#DA0808","#1EBCC1");
        }
        else{
            displayInChat("Invalid language. Here are the current language options:","#DA0808","#1EBCC1");
            for(var i = 0;i<keys.length;i++){
                displayInChat(keys[i],"#DA0808","#1EBCC1");
            }
        }
        return "";
    }
    else if (chat_val.substring(1,12)=="translateto"){
       translating2 = [false,""];
       displayInChat("You will not speak another language anymore.","#DA0808","#1EBCC1");
       return "";
    }
    else if (chat_val.substring(1,11)=="translate " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
        var text = chat_val.substring(11).replace(/^\s+|\s+$/g, '').toLowerCase();
        var keys = Object.keys(translatingkeys);
        if(keys.includes(text)){
            translating = [true,translatingkeys[text]];
            displayInChat("Translator has been set to the "+text+" language.","#DA0808","#1EBCC1");
        }
        else{
            displayInChat("Invalid language. Here are the current language options:","#DA0808","#1EBCC1");
            for(var i = 0;i<keys.length;i++){
                displayInChat(keys[i],"#DA0808","#1EBCC1");
            }
        }
        return "";
    }
    else if (chat_val.substring(1,10)=="translate"){
       translating = [false,""];
       displayInChat("Translator has been turned off.","#DA0808","#1EBCC1");
       return "";
    }
    
    else if (chat_val.substring(1,6)=="space"){
        if(space_flag == true){
            displayInChat("Space is now off.","#DA0808","#1EBCC1");
            space_flag = false;
        }
        else{
            displayInChat("Space is now on.","#DA0808","#1EBCC1");
            space_flag = true;
        }
        return "";
    }
    else if (chat_val.substring(1,6)=="rcaps"){
        if(rcaps_flag == true){
            displayInChat("Rcaps is now off.","#DA0808","#1EBCC1");
            rcaps_flag = false;
        }
        else{
            displayInChat("Rcaps is now on.","#DA0808","#1EBCC1");
            rcaps_flag = true;
        }
 
        return "";
    }
    else if (chat_val.substring(1,7)=="number"){
        if(number_flag == true){
            displayInChat("Number is now off.","#DA0808","#1EBCC1");
            number_flag = false;
        }
        else{
            displayInChat("Number is now on.","#DA0808","#1EBCC1");
            number_flag = true;
        }
 
        return "";
    }
    else if (chat_val.substring(1,8)=="reverse"){
        if(reverse_flag == true){
            displayInChat("Reverse is now off.","#DA0808","#1EBCC1");
            reverse_flag = false;
        }
        else{
            displayInChat("Reverse is now on.","#DA0808","#1EBCC1");
            reverse_flag = true;
        }
 
        return "";
    }
    else if (chat_val.substring(1,7)=="speech"){
        if(text2speech == true){
            displayInChat("Text to speech is now off.","#DA0808","#1EBCC1");
            text2speech = false;
        }
        else{
            displayInChat("Text to speech is now on.","#DA0808","#1EBCC1");
            text2speech = true;
        }
 
        return "";
    }
    else if (chat_val.substring(1,7)=="maxfps"){
        if(maxfps){
            displayInChat("Max FPS is now off.","#DA0808","#1EBCC1");
            maxfps = false;
        }
        else{
            displayInChat("Max FPS is now on.","#DA0808","#1EBCC1");
            maxfps = true;
        }
        return "";
    }
    else if (chat_val.substring(1,6)=="eval " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        var ev = "";
        try{
            ev = eval(chat_val.substring(6).replace(/^\s+|\s+$/g, ''));
        }
        catch(e){
            displayInChat(e.message,"#DA0808","#1EBCC1");
        }
        try{
            displayInChat(ev.toString(),"#DA0808","#1EBCC1");
        }
        catch{
        }
 
        return "";
 
    }
    else if (chat_val.substring(1,10)=="textmode " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
        var text = chat_val.substring(10).replace(/^\s+|\s+$/g, '');
        var parsed = parseInt(text);
        if(!isNaN(parsed)){
            if(parsed<=7 && parsed>=1){
                textmode = parsed-1;
                displayInChat("Type '/textmode' to reset textmode.","#DA0808","#1EBCC1");
            }
            else{
                displayInChat("Please enter a integer from 1-7 inclusive.","#DA0808","#1EBCC1");
            }
        }
        else{
            displayInChat("Please enter a integer from 1-7 inclusive.","#DA0808","#1EBCC1");
        }
        return "";

    }
    else if (chat_val.substring(1,9)=="textmode"){
        textmode = -1;
        displayInChat("Reset textmode.","#DA0808","#1EBCC1");
        return "";
    }
    else if (chat_val.substring(1,10)=="savedroom"){
        if(savedrooms.length == 0){
            displayInChat("You do not have any saved rooms.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            var keys = Object.keys(savedroomsdata);
            for(var i = 0;i<keys.length;i++){
                var code = 'this.parentElement.remove();delete Gwindow.savedroomsdata["'+keys[i]+'"];Gwindow.savedrooms.splice(Gwindow.savedrooms.indexOf('+keys[i]+'),1);';
                displayInChat('<a onclick = \''+code+'\' style = "color:green;" href = "javascript:void(0);">Remove</a>'+' - ',"#DA0808","#1EBCC1",{sanitize:false},JSON.stringify(savedroomsdata[keys[i]].roomname)+" - "+savedroomsdata[keys[i]].players+"/"+savedroomsdata[keys[i]].maxplayers+" players.");
 
                Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true;
                Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true;
                
                Laster_message = lastmessage();
            }
        }
        return "";
    }
    else if (chat_val.substring(1,15)=="clearsavedroom"){
        if(savedrooms.length == 0){
            displayInChat("You do not have any saved rooms.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            var keys = Object.keys(savedroomsdata);
            for(var i = 0;i<keys.length;i++){
                savedrooms.splice(savedrooms.indexOf(parseInt(keys[i])),1);
                delete savedroomsdata[keys[i]];
                
            }
        }
        return "";
    }
    else if (chat_val.substring(1,10)=="followcam"){
        if(FollowCam == true){
            displayInChat("Follow Camera is now off.","#DA0808","#1EBCC1");
            FollowCam = false;
            if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                var addto = {"children":[]};
                for(var i = 0;i<parentDraw.children.length;i++){
                    if(parentDraw.children[i].constructor.name == "e"){
                        addto = parentDraw.children[i];
                        break;
                    }
                }
                var canv = 0;
                for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
                    if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                        canv = Gdocument.getElementById("gamerenderer").children[i];
                        break;
                    }
                }
                var width = parseInt(canv.style["width"]);
                var height = parseInt(canv.style["height"]);
                parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999){
                    pixiCircle.visible = false;
                }
                else{
                    pixiCircle.visible = true;
                }
            }
        }
        else{
            displayInChat("Follow Camera is now on.","#DA0808","#1EBCC1");
            FollowCam = true;
        }
 
        return "";
    }
    else if (chat_val.substring(1,8)=="autocam"){
        if(autocam == true){
            displayInChat("Auto Cam is now off.","#DA0808","#1EBCC1");
            autocam = false
        }
        else{
            displayInChat("Auto Cam is now on.","#DA0808","#1EBCC1");
            autocam = true;
        }
 
        return "";
    }
    else if (chat_val.substring(1,4)=="pan"){
        if(pan_enabled == true){
            displayInChat("Pan is now off.","#DA0808","#1EBCC1");
            pan_enabled = false;
            pan = {"x":0,"y":0};
        }
        else{
            displayInChat("Pan is now on. Shift + Arrow Keys to pan.","#DA0808","#1EBCC1");
            pan_enabled = true;
        }
        return "";
    }
    else if (chat_val.substring(1,9)=="resetpan"){
        pan = {"x":0,"y":0};
        displayInChat("Reset pan.","#DA0808","#1EBCC1");
        return "";
    }
    else if (chat_val.substring(1,7)=="aimbot"){
        if(aimbot == true){
            displayInChat("Aimbot is now off.","#DA0808","#1EBCC1");
            aimbot = false;
        }
        else{
            displayInChat("Aimbot is now on.","#DA0808","#1EBCC1");
            aimbot = true;
            getplayerkeys();
        }
 
        return "";
    }
    else if (chat_val.substring(1,8)=="volume " && chat_val.replace(/^\s+|\s+$/g, '').length>=9){
        var text = chat_val.substring(8).replace(/^\s+|\s+$/g, '');
        if(!isNaN(parseInt(text))){
            int_text = parseInt(text);
            if(int_text>=0 && int_text<=100){
                jukeboxplayer.volume = int_text/100;
                jukeboxplayervolume = int_text;
                displayInChat("Jukebox volume set to: "+int_text.toString()+" percent.","#DA0808","#1EBCC1");
            }
            else{
                displayInChat("Volume must be between 0 and 100 percent.","#DA0808","#1EBCC1");
            }
        }
        return "";
    }
    else if (chat_val.substring(1,6)=="still"){
        if(staystill == true){
            displayInChat("Still is now off.","#DA0808","#1EBCC1");
            staystill = false;
            staystillpos = [0,0];
            fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
            fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
        }
        else{
            if(playerids[myid].playerData?.transform){
                displayInChat("Still is now on.","#DA0808","#1EBCC1");
                staystill = true;
                staystillpos = [playerids[myid].playerData.transform.position.x/scale,playerids[myid].playerData.transform.position.y/scale];
                getplayerkeys();
                fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
            }
            else{
                displayInChat("You have to be alive to use this command.","#DA0808","#1EBCC1");
            }
        }
 
        return "";
    }
    else if (chat_val.substring(1,9)=="heavybot"){
        if(heavybot == true){
            displayInChat("Heavy bot is now off.","#DA0808","#1EBCC1");
            heavybot = false;
        }
        else{
            displayInChat("Heavy bot is now on.","#DA0808","#1EBCC1");
            heavybot = true;
            getplayerkeys();
        }
 
        return "";
    }
    else if (chat_val.substring(1,5)=="xray"){
        Gdocument.getElementById("pretty_top_settings").click();
        Gdocument.getElementById("settings_close").click();
        if(Gdocument.getElementById("settings_graphicsquality").value==1){
            displayInChat("You must have medium or high quality enabled to use this feature.","#DA0808","#1EBCC1");
            return "";
        }
 
 
        if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
            var addto = {"children":[]};
            for(var i = 0;i<parentDraw.children.length;i++){
                if(parentDraw.children[i].constructor.name == "e"){
                    addto = parentDraw.children[i];
                    break;
                }
            }
            var addto2 = {"children":[]};
            for(var i = 0;i<addto.children.length;i++){
                if(addto.children[i].constructor.name == "e"){
                    addto2 = addto.children[i];
                    break;
                }
            }
            var checkxray = addto2.children[0];
            var addto3 = addto2.children[0].children;
            if(addto3.length==1){
                checkxray = checkxray.children[0];
                addto3 = addto3[0].children;
            }
            var xrayon = false;
            if(checkxray.xrayon){
                checkxray.xrayon = false;
                xrayon = false;
            }
            else{
                checkxray.xrayon = true;
                xrayon = true;
            }
            if(xrayon){
                displayInChat("Xray is now on.","#DA0808","#1EBCC1");
                for(var i = 0;i<addto3.length;i++){
                    if(addto3[i].children.length>0){
                        var ids = [];
                        var ids2 = [];
                        for(var i3 = 0;i3<addto3[i].children.length;i3++){
                            addto3[i].children[i3].visible = false;
                            if(addto3[i].children[i3].children.length>0){
                                for(var i4 = 0;i4<addto3[i].children[i3].children.length;i4++){
                                    if(addto3[i].children[i3].children[i4].geometry?.id){
                                        ids.push(addto3[i].children[i3].children[i4].geometry.id);
                                    }
                                    else if(addto3[i].children[i3].children[i4].texture?.baseTexture?.uid){
                                        ids2.push(addto3[i].children[i3].children[i4].texture.baseTexture.uid);
                                    }
                                }
                            }
                        }
                        for(var i3 = 0;i3<addto3[i].children.length;i3++){
                            if(addto3[i].children[i3].children.length==0){
                                if(addto3[i].children[i3].geometry?.id){
                                    if(ids.includes(addto3[i].children[i3].geometry.id+1)){
                                        addto3[i].children[i3].visible = true;
                                        addto3[i].children[i3].alpha = 0.5;
                                    }
                                }
                                else if(addto3[i].children[i3].texture?.baseTexture?.uid){
                                    if(ids2.includes(addto3[i].children[i3].texture.baseTexture.uid+1)){
                                        addto3[i].children[i3].visible = true;
                                        addto3[i].children[i3].alpha = 0.5;
                                    }
                                }
                                if(addto3[i].children[i3].batchDirty){
                                    addto3[i].children[i3].visible = true;
                                    addto3[i].children[i3].alpha = 0.5;
                                    if(addto3[i].children[i3+1]){
                                        addto3[i].children[i3+1].visible = true;
                                        addto3[i].children[i3+1].alpha = 0.5;
                                    }
                                }

                            }
                        }
                    }
                }
 
            }
            else{
                displayInChat("Xray is now off.","#DA0808","#1EBCC1");
                for(var i = 0;i<addto3.length;i++){
                    for(var i2 = 0;i2<addto3[i].children.length;i2++){
                        addto3[i].children[i2].visible = true;
                        addto3[i].children[i2].alpha = 1;
                    }
                }
            }
        }
 
        return "";
    }
    else if (chat_val.substring(1,6)=="zoom "){
        var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '');
        if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
            var addto = 0;
            for(var i = 0;i<parentDraw.children.length;i++){
                if(parentDraw.children[i].constructor.name == "e"){
                    addto = parentDraw.children[i];
                    break;
                }
            }
            var canv = 0;
            for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
                if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                    canv = Gdocument.getElementById("gamerenderer").children[i];
                    break;
                }
            }
            var width = parseInt(canv.style["width"]);
            var height = parseInt(canv.style["height"]);
            if(addto){
                if(text == "in"){
                    zoom *= 1.1;
                }
                else if(text == "out"){
                    zoom /= 1.1;
                }
                else if(text == "reset"){
                    zoom = 1;
                }
                else{
                    displayInChat("Options for zooming:","#DA0808","#1EBCC1");
                    displayInChat("in","#DA0808","#1EBCC1");
                    displayInChat("out","#DA0808","#1EBCC1");
                    displayInChat("reset","#DA0808","#1EBCC1");
                    return "";
                }
                addto.scale.x=zoom;
                addto.scale.y=zoom;
                parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999 && !FollowCam){
                    pixiCircle.visible = false;
                }
                else{
                    pixiCircle.visible = true;
                }
            }
        }
        return "";
    }
    else if (chat_val.substring(1,9)=="hidechat"){
        Gdocument.getElementById("ingamechatcontent").style["max-height"]="0px";
        return "";
    }
    else if (chat_val.substring(1,9)=="showchat"){
        Gdocument.getElementById("ingamechatcontent").style["max-height"]=chatheight.toString()+"px";
        return "";
    }
    else if (chat_val.substring(1,6)=="score"){
        var element = Gdocument.getElementById("ingamewinner_scores");
        if(element.style["opacity"]<1){
            element.style["opacity"] = 1;
            element.style["visibility"] = "visible";
        }
        else{
            element.style["opacity"] = 0;
            element.style["visibility"] = "unset";
        }
        return "";
    }
 
    else if (chat_val.substring(1,7)=="scroll"){
        if(scroll==false){
            scroll = true;
            Gdocument.getElementById("ingamechatcontent").style["overflow-y"]="scroll";
            Gdocument.getElementById("ingamechatcontent").style["overflow-x"]="hidden";
        }
        else if(scroll==true){
            scroll = false;
            Gdocument.getElementById("ingamechatcontent").style["overflow-y"]="hidden";
            Gdocument.getElementById("ingamechatcontent").style["overflow-x"]="hidden";
        }
 
        return "";
    }
 
    else if (chat_val.substring(1,7)=="chatw "){
        var text = chat_val.substring(7).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"");
 
        if(username == text){
            displayInChat("You cannot private chat with yourself.","#DA0808","#1EBCC1");
            return "";
        }
        private_chat = text;
 
        SEND("42"+JSON.stringify([4,{"type":"request public key","from":username,"to":private_chat}]));
        request_public_key_time_stamp = Date.now();
        setTimeout(function(){if(private_chat_public_key[0]!=private_chat){displayInChat("Failed to connect to "+private_chat+".","#DA0808","#1EBCC1");private_chat = private_chat_public_key[0];}},1600);
        return "";
    }
    else if (chat_val.substring(1,8)=="lagbot " && chat_val.replace(/^\s+|\s+$/g, '').length>=9){
        var text = chat_val.substring(8).replace(/^\s+|\s+$/g, '');
        if(!isNaN(parseInt(text))){
            int_text = parseInt(text);
            if(int_text == 0){
                causelag = false;
                causelag2 = 0;
                displayInChat("Lagbot is now off.","#DA0808","#1EBCC1");
                displayInChat("To enable lagbot, type '/lagbot [number]' with a number between 1 and 10.","#DA0808","#1EBCC1");
            }
            else if(int_text>0 && int_text<=10){
                causelag = true;
                causelag2 = 45*int_text;
                displayInChat("Lagbot is now on with a lag setting of "+int_text.toString()+" (~"+(45*int_text).toString()+"MS).","#DA0808","#1EBCC1");
                displayInChat("Type '/lagbot 0' to turn off lagbot.","#DA0808","#1EBCC1");
            }
            else{
                displayInChat("To enable lagbot, type '/lagbot [number]' with a number between 1 and 10.","#DA0808","#1EBCC1");
                displayInChat("Type '/lagbot 0' to turn off lagbot.","#DA0808","#1EBCC1");
            }
            return "";
        }
    }
    else if (chat_val.substring(1,8)=="record " && chat_val.replace(/^\s+|\s+$/g, '').length>=9){
        var text = chat_val.substring(8).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"");
        var keys = Object.keys(playerids);
        var recordingid2 = -1;
        for(var i = 0;i<keys.length;i++){
            if(playerids[keys[i]].userName == text){
                recordingid2 = keys[i];
            }
        }
        if(recordingid2 == -1){
            displayInChat("Player not found. Please type a valid username.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            recording = true;
            recordingid = recordingid2;
            displayInChat(playerids[recordingid].userName+" is now being recorded.","#DA0808","#1EBCC1");
            if(recordingdata.length>0){
                displayInChat("Any unsaved recording data is now cleared.","#DA0808","#1EBCC1");
            }
            recordingdata = [];
        }
        return "";
    }
    else if (chat_val.substring(1,11)=="stoprecord"){
        if(recording){
            displayInChat(playerids[recordingid].userName+" is not being recorded anymore.","#DA0808","#1EBCC1");
            displayInChat("Type '/saverecording [text]' to save this recording.","#DA0808","#1EBCC1");
            recording = false;
            recordingid = -1;
            recordingdata[0][1] = 0;
        }
        else{
            displayInChat("No one is being recorded.","#DA0808","#1EBCC1");
        }
        return "";
    }
    else if (chat_val.substring(1,15)=="saverecording " && chat_val.replace(/^\s+|\s+$/g, '').length>=16){
        var text = chat_val.substring(15).replace(/^\s+|\s+$/g, '');
        if(Object.keys(recorddata).includes(text)){
            displayInChat("This recording already exists. Please use a different name or type '/delrecording "+text+"'.","#DA0808","#1EBCC1");
        }
        else if(recordingdata.length>0){
            recorddata[text] = JSON.parse(JSON.stringify(recordingdata));
            displayInChat("Recording saved as: "+text,"#DA0808","#1EBCC1");
        }
        else{
            displayInChat("There is no recording data to save. Please record data using '/record [username]'","#DA0808","#1EBCC1");
        }
        return "";
    }
    else if (chat_val.substring(1,14)=="delrecording " && chat_val.replace(/^\s+|\s+$/g, '').length>=15){
        var text = chat_val.substring(14).replace(/^\s+|\s+$/g, '');
        if(Object.keys(recorddata).includes(text)){
            displayInChat("Recording deleted.","#DA0808","#1EBCC1");
            delete recorddata[text];
        }
        else{
            displayInChat("This recording does not exist.","#DA0808","#1EBCC1");
        }
        return "";
    }
    else if (chat_val.substring(1,15)=="loadrecording " && chat_val.replace(/^\s+|\s+$/g, '').length>=16){
        var text = chat_val.substring(15).replace(/^\s+|\s+$/g, '');
        if(!Object.keys(recorddata).includes(text)){
            displayInChat("This recording does not exist.","#DA0808","#1EBCC1");
        }
        else{
            if(recordingdata.length>0){
                displayInChat("Any unsaved recording data is now cleared.","#DA0808","#1EBCC1");
            }
            recordingdata = JSON.parse(JSON.stringify(recorddata[text]));
            displayInChat("Recording data is now loaded.","#DA0808","#1EBCC1");
        }
        return "";
    }
    else if (chat_val.substring(1,7)=="replay"){
        if(recording){
            displayInChat(playerids[recordingid].userName+" is not being recorded anymore.","#DA0808","#1EBCC1");
            displayInChat("Type '/saverecording [text]' to save this recording.","#DA0808","#1EBCC1");
            recordingid = -1;
            recording = false;
            recordingdata[0][1] = 0;
        }
        replay();
        return "";
    }
    else if (chat_val.substring(1,5)=="msg " && chat_val.replace(/^\s+|\s+$/g, '').length>=6){
        if(private_chat_public_key[1][0] != 0 && private_chat_public_key[1][1] != 0 && private_chat_public_key[0] == private_chat){
            var text = chat_val.substring(5).replace(/^\s+|\s+$/g, '');
            pmlastmessage = text.slice(0,400);
            ENCRYPT_MESSAGE(private_chat_public_key[1],text).then(function(e){
                SEND("42"+JSON.stringify([4,{"type":"private chat","from":username,"to":private_chat,"message":e}]));
            });
            displayInChat("> "+username+": ","#DA0808","#1EBCC1",{sanitize:false},text,false);
            Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true;
            Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true;
            Laster_message = lastmessage();
 
        }
        return "";
    }
    else if (chat_val.substring(1,10)=="ignorepm " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
        var text = chat_val.substring(10).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"");
        if(ignorepmlist.includes(text)){
            var index = ignorepmlist.indexOf(text);
            ignorepmlist.splice(index,1);
            displayInChat("You are not ignoring private messages from "+text+".","#DA0808","#1EBCC1");
 
        }
        else{
            ignorepmlist.push(text);
            displayInChat("You are now ignoring private messages from "+text+".","#DA0808","#1EBCC1");
        }
        
        return "";
    }
    else if (chat_val.substring(1,8)=="pmusers"){
        pmusers = [];
        SEND("42"+JSON.stringify([4,{"type":"request private chat users","from":username}]));
        pmuserstimestamp = Date.now();
        
        setTimeout(function(){if(pmusers.length == 0){displayInChat("You cannot private chat with anyone.","#DA0808","#1EBCC1");
}else{displayInChat("You can private chat with:","#DA0808","#1EBCC1");for(var i = 0;i<pmusers.length;i++){var code = 'Gwindow.private_chat = "'+pmusers[i]+'"; Gwindow.SEND("42"+JSON.stringify([4,{"type":"request public key","from":Gwindow.username,"to":Gwindow.private_chat}])); Gwindow.request_public_key_time_stamp = Date.now(); setTimeout(function(){if(Gwindow.private_chat_public_key[0]!=Gwindow.private_chat){Gwindow.displayInChat("Failed to connect to "+Gwindow.private_chat+".","#DA0808","#1EBCC1");Gwindow.private_chat = Gwindow.private_chat_public_key[0];}},1600);';displayInChat('<a onclick = \''+code+'\' href = "javascript:void(0);" style = "color:green">'+sanitize(pmusers[i])+'</a>',"#DA0808","#1EBCC1",{sanitize:false}); Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true; Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true; Laster_message = lastmessage(); }}},1600);
        return "";
    }
    else if (chat_val.substring(1,6)=="lobby"){
        lobby();
        return "";
    }
    else if (chat_val.substring(1,7)=="style " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
        var text = chat_val.substring(7).replace(/^\s+|\s+$/g, '');
        var text2 = text.split(" ");
        var array = [];
        for(var i = 0;i<text2.length;i++){
            var parsed = parseInt(text2[i]);
            if(!isNaN(parsed)){
                array.push(parsed);
            }
        }
        if(array[0]+array[1]+array[2] == 0){
            array = [1,1,1];
        }
        if(array.length == 3){
            SEND("42"+JSON.stringify([4,{"type":"style","from":username,"style":array}]));
            allstyles[username] = array;
            mystyle = [...array];
            displayInChat("Set style to ("+array.toString()+"). Type '/style' to reset style.","#DA0808","#1EBCC1");
        }
        else{
            displayInChat("Please enter a valid RGB color code seperated by space. For example, white = '/style 255 255 255'. Type '/style' to reset style.","#DA0808","#1EBCC1");
        }
        return "";
    }
    else if (chat_val.substring(1,6)=="style"){
        SEND("42"+JSON.stringify([4,{"type":"style","from":username,"style":[0,0,0]}]));
        allstyles[username] = [0,0,0];
        mystyle = [0,0,0];
    
        displayInChat("Reset style.","#DA0808","#1EBCC1");
        return "";
    }
    else if (chat_val.substring(1,6)=="lobby"){
        lobby();
        return "";
    }
    else if (chat_val.substring(1,9)=="debugger"){
        if(Gdocument.getElementById("BonkCommandsDebuggerContainer").style["display"] == "none"){
            debuggeropen = true;
            Gdocument.getElementById("BonkCommandsDebuggerContainer").style["display"]="block";
            Gdocument.getElementById("newbonklobby_chat_input").style["display"]="none";
            Gdocument.getElementById("ingamechatinputtext").style["display"] = "none";
        }
        else{
            debuggeropen = false;
            Gdocument.getElementById("BonkCommandsDebuggerContainer").style["display"]="none";
            Gdocument.getElementById("newbonklobby_chat_input").style["display"]="";
            Gdocument.getElementById("ingamechatinputtext").style["display"] = "";
        }
        return "";
    }
    else if (chat_val.substring(1,6)=="team " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '');
        if(text == "r"){Gdocument.getElementById("newbonklobby_redbutton").click();}
        else if(text == "g"){Gdocument.getElementById("newbonklobby_greenbutton").click();}
        else if(text == "y"){Gdocument.getElementById("newbonklobby_yellowbutton").click();}
        else if(text == "b"){Gdocument.getElementById("newbonklobby_bluebutton").click();}
        else if(text == "s"){Gdocument.getElementById("newbonklobby_specbutton").click();}
        else if(text == "f"){Gdocument.getElementById("newbonklobby_ffabutton").click();}
        return "";
    }
    else if (chat_val.substring(1,7)=="notify"){
        npermissions = 1;
        return "";
    }
    else if (chat_val.substring(1,11)=="stopnotify"){
        npermissions = 0;
        return "";
    }
    else if (chat_val.substring(1,8)=="support"){
        displayInChat("Thanks everyone for helping me make this mod - LEGENDBOSS123","#0000FF","#FFFFFF");
        displayInChat("mastery3","#0000FF","#FFFFFF");
        displayInChat("UnmatchedBracket aka Left Paren","#0000FF","#FFFFFF");
        displayInChat("iNeonz","#0000FF","#FFFFFF");
        return "";
    }
    else if (chat_val.substring(1,9)=="pollstat"){
        if(pollactive[0] || pollactive2[0]){
            var count = [0,0,0,0];
            var keys = Object.keys(playerids);
            for(var i = 0;i<keys.length;i++){
                if(ishost){
                    if(playerids[keys[i]].vote.poll!=-1 && playerids[keys[i]].vote.poll<pollactive[3].length-1){
                        count[playerids[keys[i]].vote.poll]++;
                    }
                }
                else{
                    if(playerids[keys[i]].vote.poll!=-1 && playerids[keys[i]].vote.poll<pollactive2[2].length-1){
                        count[playerids[keys[i]].vote.poll]++;
                    }
                }
            }
            for(var i = 0;i<count.length;i++){
                if(count[i]>1){
                    displayInChat(count[i].toString()+" people voted for option "+letters[i]+".","#DA0808","#1EBCC1");
                }
                if(count[i]==1){
                    displayInChat(count[i].toString()+" person voted for option "+letters[i]+".","#DA0808","#1EBCC1");
                }
            }
            if(ishost){
                displayInChat("The poll will end in: "+((pollactive[2]-Date.now())/1000).toString()+" seconds.","#DA0808","#1EBCC1");
            }
            displayInChat("The poll is:","#DA0808","#1EBCC1");
            if(ishost){
                for(var i = 0;i<pollactive[3].length;i++){
                    displayInChat(letters[i]+") "+pollactive[3][i],"#DA0808","#1EBCC1");
                }
            }
            else{
                for(var i = 0;i<pollactive2[2].length;i++){
                    displayInChat(letters[i]+") "+pollactive2[2][i],"#DA0808","#1EBCC1");
                }
            }
        }
        else{
            displayInChat("No poll has been started.","#DA0808","#1EBCC1");
            if(ishost){
                displayInChat("Type '/startpoll [seconds]' to start a poll.","#DA0808","#1EBCC1");
                if(poll.length>0){
                    displayInChat("The poll is:","#DA0808","#1EBCC1");
                    for(var i = 0;i<poll.length;i++){
                        displayInChat(letters[i]+") "+poll[i],"#DA0808","#1EBCC1");
                    }
                }
            }
        }
        return "";
    }
    else if (chat_val.substring(1,5)=="help" || chat_val.substring(1,2)=="?"){
        for(var i = 0;i<help.length;i++){
            if(help[i].startsWith("/")){
                var splitted = help[i].substring(1).split(" ");
                var command = splitted[0];
                var rest = "";
                if(splitted.length>1){
                    rest = " "+splitted.slice(1).join(" ");
                }
                displayInChat("/"+'<a onclick = \'Gwindow.displayadvhelp("'+command+'");\' style = "color:green;" href = "javascript:void(0);">'+command+'</a>'+rest,"#DA0808","#1EBCC1",{sanitize:false},"",false);   
            }
            else if(help[i].startsWith("Alt ")){
                displayInChat('<a onclick = \'Gwindow.displayadvhelp("'+help[i]+'");\' style = "color:green;" href = "javascript:void(0);">'+help[i]+'</a>',"#DA0808","#1EBCC1",{sanitize:false},"",false);   
            }
            else{
                displayInChat(help[i],"#DA0808","#1EBCC1");
            }
            
 
        }
        return "";
    }
    else if (chat_val.substring(1,9)=="advhelp " && chat_val.replace(/^\s+|\s+$/g, '').length>=10){
        var text = chat_val.substring(9).replace(/^\s+|\s+$/g, '');
        if(typeof(adv_help[text])!='undefined'){
            displayInChat(adv_help[text],"#DA0808","#1EBCC1");
        }
        return "";
    }
    else if (chat_val.substring(1,6)=="mode " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '');
        var mode = "";
        var text2 = text;
        if(text == "arrows"){
            text2 = "Arrows";
            mode = "ar";
        }
        else if(text == "death arrows"){
            mode = "ard";
            text2 = "Death Arrows";
        }
        else if(text == "grapple"){
            mode = "sp";
            text2 = "Grapple";
        }
        else if(text == "classic"){
            mode = "b";
            text2 = "Classic";
        }
        else{
            displayInChat("Mode options:","#DA0808","#1EBCC1");
            displayInChat("classic","#DA0808","#1EBCC1");
            displayInChat("arrows","#DA0808","#1EBCC1");
            displayInChat("death arrows","#DA0808","#1EBCC1");
            displayInChat("grapple","#DA0808","#1EBCC1");
        }
        if(mode != ""){
            if(ishost){
                SEND('42[20,{"ga":"b","mo":"'+mode+'"}]');
                RECIEVE('42[26,"b","'+mode+'"]');
                displayInChat("Changed mode to "+text+".","#DA0808","#1EBCC1");
            }
            else{
                if(playerids[myid].ratelimit.mode+1000<Date.now()){
                    playerids[myid].ratelimit.mode=Date.now();
                    SEND("42"+JSON.stringify([4,{"type":"request mode","from":username,"mode":mode}]));
                    var code = 'if(!Gwindow.ishost){Gwindow.displayInChat("You must be host to change the mode.","#DA0808","#1EBCC1",{sanitize:false},"",true)}else{Gwindow.changemode("'+mode+'")}';        
                    displayInChat('> '+username+' requests [<a onclick = \''+code+'\' style = "color:green;" href = "javascript:void(0);">'+text2+'</a>]',"#DA0808","#1EBCC1",{sanitize:false}," mode.");
 
                }
                else{
                    displayInChat("You are requesting modes too quickly.","#DA0808","#1EBCC1");
                }
            }
        }
        return "";
 
    }
    else if(ishost){
        if (chat_val.substring(1,11)=="nextafter " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
            var text = parseFloat(chat_val.substring(11).replace(/^\s+|\s+$/g, ''));
            if(isNaN(text)){
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                return "";
            }
            else if(text<=0){
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                return "";
            }
            nextafter = text;
            displayInChat("Set next after to: " + text.toString()+" seconds.","#DA0808","#1EBCC1");
            displayInChat("Type '/nextafter' to reset next after.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,10)=="nextafter"){
            nextafter = 0;
            displayInChat("Reset next after.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,5)=="next" && stopquickplay == 0){
            roundsperqp2 = 0;
            if(shuffle){
                var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                var available = [];
                var availableindexes = [];
                var notempty = false;
                for(var i = 0; i<e.length;i++){
                    var a = false;
                    [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                    available.push(a);
                    if(a){
                        availableindexes.push(i);
                        notempty = true;
                    }
                }
                if(notempty){
 
                    if(availableindexes.length!=1){
                        availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                    }
                    quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                }
            }
            else{
                var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                var available = [];
                var availableindexes = [];
                var notempty = false;
                for(var i = 0; i<e.length;i++){
                    var a = false;
                    [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                    available.push(a);
                    if(a){
                        availableindexes.push(i);
                        notempty = true;
                    }
                }
                if(notempty){
                    var above = [];
                    for(var i = 0;i<availableindexes.length;i++){
                        if(availableindexes[i]>quicki && !reverseqp){
                            above.push(availableindexes[i]);   
                        }
                        else if(availableindexes[i]<quicki && reverseqp){
                            above.push(availableindexes[i])
                        }
                    }
                    if(above.length>0){
                        quicki = above[0];
                        if(reverseqp){
                            quicki = above[above.length-1];
                        }
                    }
                    else{
                        quicki = availableindexes[0];
                        if(reverseqp){
                            quicki = availableindexes[availableindexes.length-1];
                        }
                    }
                }
            }
            gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
            displayInChat("Switched to next map.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,9)=="freejoin"){
            if(freejoin == false){
                freejoin = true;
                displayInChat("Freejoin is now on.","#DA0808","#1EBCC1");
 
            }
            else{
                freejoin = false;
                displayInChat("Freejoin is now off.","#DA0808","#1EBCC1");
            }
 
            return "";
 
        }
        else if (chat_val.substring(1,8)=="instaqp"){
            if(instaqp == false){
                instaqp = true;
                displayInChat("Instaqp is now on.","#DA0808","#1EBCC1");
 
            }
            else{
                instaqp = false;
                displayInChat("Instaqp is now off.","#DA0808","#1EBCC1");
            }
 
            return "";
 
        }
 
        else if (chat_val.substring(1,9)=="previous" && stopquickplay == 0){
            roundsperqp2 = 0;
            if(shuffle){
                var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                var available = [];
                var availableindexes = [];
                var notempty = false;
                for(var i = 0; i<e.length;i++){
                    var a = false;
                    [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                    available.push(a);
                    if(a){
                        availableindexes.push(i);
                        notempty = true;
                    }
                }
                if(notempty){
 
                    if(availableindexes.length!=1){
                        availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                    }
                    quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                }
            }
            else{
                var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                var available = [];
                var availableindexes = [];
                var notempty = false;
                for(var i = 0; i<e.length;i++){
                    var a = false;
                    [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                    available.push(a);
                    if(a){
                        availableindexes.push(i);
                        notempty = true;
                    }
                }
                if(notempty){
                    var above = [];
                    for(var i = 0;i<availableindexes.length;i++){
                        if(availableindexes[i]<quicki && !reverseqp){
                            above.push(availableindexes[i]);   
                        }
                        else if(availableindexes[i]>quicki && reverseqp){
                            above.push(availableindexes[i])
                        }
                    }
                    if(above.length>0){
                        quicki = above[above.length-1];
                        if(reverseqp){
                            quicki = above[0];
                        }
                    }
                    else{
                        quicki = availableindexes[availableindexes.length-1];
                        if(reverseqp){
                            quicki = availableindexes[0];
                        }
                    }
                }
            }
            gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
 
            displayInChat("Switched to previous map.","#DA0808","#1EBCC1");
            return "";
        }
        else if (chat_val.substring(1,6)=="start" && chat_val.length == 6){
            if(Gdocument.getElementById("mapeditorcontainer").style["display"]!="block"){
                Gdocument.getElementById("newbonklobby_editorbutton").click();
            }
            if(recmodebool && ishost){
                var mode = Gdocument.getElementById("mapeditor_modeselect").value;
                if(mode == "" && defaultmode!="d"){
                        mode = defaultmode;
                }
                if(mode != ""){
                    RECIEVE('42[26,"b","'+mode+'"]');
                }
            }
            Gdocument.getElementById("mapeditor_close").click();
            Gdocument.getElementById("newbonklobby").style["display"] = "none";
            roundsperqp2 = 0;
            Gdocument.getElementById("mapeditor_midbox_testbutton").click();
 
            return "";
        }
 
        else if (chat_val.substring(1,8)=="startqp" && stopquickplay == 1){
            stopquickplay = 0;
            quicki = 0;
            qppaused = false;
            displayInChat("Enabled quickplay.","#DA0808","#1EBCC1");
            return "";
        }
        else if (chat_val.substring(1,7)=="stopqp" && stopquickplay == 0){
            stopquickplay = 1;
            quicki = 0;
            qppaused = false;
            displayInChat("Disabled quickplay.","#DA0808","#1EBCC1");
            return "";
        }
        else if (chat_val.substring(1,8)=="pauseqp" && stopquickplay == 0){
            if(qppaused == false){
                qppaused = true;
                displayInChat("Paused quickplay.","#DA0808","#1EBCC1");
            }
            else{
                qppaused = false;
                displayInChat("Unpaused quickplay.","#DA0808","#1EBCC1");
            }
            return "";
        }
        else if (chat_val.substring(1,6)=="revqp" && stopquickplay == 0){
            if(reverseqp == false){
                reverseqp = true;
                displayInChat("Reverseqp is now on..","#DA0808","#1EBCC1");
            }
            else{
                reverseqp = false;
                displayInChat("Reverseqp is now off.","#DA0808","#1EBCC1");
            }
            return "";
        }
        else if (chat_val.substring(1,9)=="jukebox " && chat_val.replace(/^\s+|\s+$/g, '').length>=10){
            var text = chat_val.substring(9).replace(/^\s+|\s+$/g, '');
            SEND("42"+JSON.stringify([4,{"type":"video player","from":username,"url":text,"timestamp":Date.now()+2000,"to":[-1]}]));
            displayInChat("Jukebox is loading... Please wait a few seconds.","#DA0808","#1EBCC1");
            changeJukeboxURL(text,Date.now()+2000);
            return "";
        }
        else if (chat_val.substring(1,13)=="pausejukebox"){
            if(jukeboxplayer.src!="" && !jukeboxplayer.paused){
                displayInChat("Jukebox is now paused.","#DA0808","#1EBCC1");
                jukeboxplayer.pause();
                SEND("42"+JSON.stringify([4,{"type":"video player","from":username,"url":"","timestamp":Date.now(),"to":[-1]}]));
            }
            return "";
        }
        else if (chat_val.substring(1,13)=="resetjukebox"){
            if(jukeboxplayer.src!=""){
                jukeboxplayer.currentTime = 0;
                displayInChat("Jukebox has reset.","#DA0808","#1EBCC1");
                changeJukeboxURL(jukeboxplayerURL,Date.now()+2000);
                SEND("42"+JSON.stringify([4,{"type":"video player","from":username,"url":jukeboxplayerURL,"timestamp":Date.now()+2000,"to":[-1]}]));
            }
            return "";
        }
        else if (chat_val.substring(1,12)=="playjukebox"){
            if(jukeboxplayer.src!="" && jukeboxplayer.paused){
                changeJukeboxURL(jukeboxplayerURL,Date.now()-jukeboxplayer.currentTime*1000);
                SEND("42"+JSON.stringify([4,{"type":"video player","from":username,"url":jukeboxplayerURL,"timestamp":Date.now()-jukeboxplayer.currentTime*1000,"to":[-1]}]));
            }
            return "";
        }
        else if (chat_val.substring(1,5)=="ban " && chat_val.replace(/^\s+|\s+$/g, '').length>=6){
            banned.push(chat_val.substring(5).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',""));
            displayInChat("Banned "+chat_val.substring(5).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"")+".","#DA0808","#1EBCC1");
            return "/kick '" + chat_val.substring(5).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"") + "'";
        }
        else if (chat_val.substring(1,6)=="kill " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
            var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"");
            var keys = Object.keys(playerids);
            var killid = undefined;
            for(var i = 0; i<keys.length; i++){
                if(playerids[keys[i]].userName == text){
                    killid = keys[i];
                }
            }
            if(typeof(killid)!="undefined" && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden" && !killedids.includes(killid)){
                currentFrame = Math.floor((Date.now() - gameStartTimeStamp)/1000*30);
                
                killedids.push(killid);
                SEND('42[25,{"a":{"playersLeft":['+killid.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                RECIEVE('42[31,{"a":{"playersLeft":['+killid.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
            }
            
            return "";
        }
        else if (chat_val.substring(1,6)=="killA"){
            var keys = Object.keys(playerids);
            if(Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                currentFrame = Math.floor((Date.now() - gameStartTimeStamp)/1000*30);
                SEND('42[25,{"a":{"playersLeft":['+keys.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                RECIEVE('42[31,{"a":{"playersLeft":['+keys.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
            }
            
            return "";
        }
        else if (chat_val.substring(1,10)=="balanceA " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
            var text = chat_val.substring(10).replace(/^\s+|\s+$/g, '');
            if(!isNaN(parseInt(text))){
                if(parseInt(text)>=-100 && parseInt(text)<=100){
                    var keys = Object.keys(playerids);
                    for(var i = 0; i<keys.length;i++){
                        SEND('42[29,{"sid":'+keys[i]+',"bal":'+text+'}]');
                        RECIEVE('42[36,'+keys[i]+','+text+']');
                    }
                }
            }
            return "";
 
        }
        else if (chat_val.substring(1,10)=="balanceT " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
            var text = chat_val.substring(10).replace(/^\s+|\s+$/g, '');
            var text2 = text.split(" ").filter(function(e){if(e!=""){return true;}return false;});
            if(text2.length!=2 || isNaN(parseInt(text2[1])) || !["s","r","b","y","g","f"].includes(text2[0])){
                displayInChat("Please enter a team letter and a number to balance.","#DA0808","#1EBCC1");
                return "";
            }
            var teamdict = {"s":0,"f":1,"r":2,"b":3,"g":4,"y":5};
            if(parseInt(text2[1])>=-100 && parseInt(text2[1])<=100){
                var keys = Object.keys(playerids);
                for(var i = 0; i<keys.length;i++){
                    if(playerids[keys[i]].team == teamdict[text2[0]]){
                        SEND('42[29,{"sid":'+keys[i]+',"bal":'+text2[1]+'}]');
                        RECIEVE('42[36,'+keys[i]+','+text2[1]+']');
                    }
                }
            }
            return "";
 
        }
        else if (chat_val.substring(1,10)=="resetpoll"){
            poll = [];
            displayInChat("The poll has been reset.","#DA0808","#1EBCC1");
            return "";
        }
        else if (chat_val.substring(1,11)=="addoption " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
            var text = chat_val.substring(11).replace(/^\s+|\s+$/g, '');
            if(text.length>50){
                displayInChat("Your option is greater than 50 characters.","#DA0808","#1EBCC1");
                return "";
            }
            if(poll.includes(text)){
                displayInChat("This option already exists.","#DA0808","#1EBCC1");
            }
            else if(poll.length>=4){
                displayInChat("Your poll already has the max 4 amounts of options.","#DA0808","#1EBCC1");
                displayInChat("Type '/deloption [letter]' to remove a option.","#DA0808","#1EBCC1");
                displayInChat("The poll is:","#DA0808","#1EBCC1");
                for(var i = 0;i<poll.length;i++){
                    displayInChat(letters[i]+") "+poll[i],"#DA0808","#1EBCC1");
                }
            }
            else{
                poll.push(text);
                displayInChat("The poll is now:","#DA0808","#1EBCC1");
                for(var i = 0;i<poll.length;i++){
                    displayInChat(letters[i]+") "+poll[i],"#DA0808","#1EBCC1");
                }
            }
            return "";
        }
        else if (chat_val.substring(1,11)=="deloption " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
            var text = letters.indexOf(chat_val.substring(11).replace(/^\s+|\s+$/g, ''));
            if(text==-1 || text>=poll.length){
                if(poll.length>0){
                    displayInChat("Available options are:","#DA0808","#1EBCC1");
                    for(var i = 0;i<poll.length;i++){
                        displayInChat(letters[i],"#DA0808","#1EBCC1");
                    }
                }
                else{
                    displayInChat("Your poll is empty.","#DA0808","#1EBCC1");
                    displayInChat("Type '/addoption [text]' to add an option.","#DA0808","#1EBCC1");
                }
            }
            else{
                poll.splice(text,1);
                displayInChat("The poll is now:","#DA0808","#1EBCC1");
                for(var i = 0;i<poll.length;i++){
                    displayInChat(letters[i]+") "+poll[i],"#DA0808","#1EBCC1");
                }
            }
            return "";
        }
        else if (chat_val.substring(1,11)=="startpoll " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
            var text = parseFloat(chat_val.substring(11).replace(/^\s+|\s+$/g, ''));
            if(isNaN(text)){
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                return "";
            }
            else if(text<=0){
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                return "";
            }
            else if(text<10){
                displayInChat("Your poll has to last for at least 10 seconds.","#DA0808","#1EBCC1");
                return "";
            }
            if(pollactive[0]){
                displayInChat("There is already an ongoing poll.","#DA0808","#1EBCC1");
                displayInChat("Type '/endpoll' to end the poll.","#DA0808","#1EBCC1");
                return "";
            }
            if(poll.length<2){
                displayInChat("Your poll needs at least 2 options.","#DA0808","#1EBCC1");
                displayInChat("Type '/addoption' to add to the poll.","#DA0808","#1EBCC1");
                return "";
            }
            
            var now = Date.now();
            pollactive = [true,now,now+text*1000,[...poll]];
            playerids[myid].ratelimit.poll = now;
            var chatpoll = [...poll];
            chatpoll.push("Cancel vote.");
            pollactive[3].push("Cancel vote.");
            for(var i = 0;i<chatpoll.length;i++){
                chatpoll[i] = letters[i]+") "+chatpoll[i];
            }
            chat(chatpoll.join("     "));
            setTimeout(function(){
                if(pollactive[0]){
                    SEND("42"+JSON.stringify([4,{"type":"poll","from":username,"poll":pollactive[3]}]));
                    var keys = Object.keys(playerids);
                    for(var i = 0;i<keys.length;i++){
                        playerids[keys[i]].vote.poll = -1;
                    }
                    displayInChat("The poll will end in: " + text.toString()+" seconds.","#DA0808","#1EBCC1");
                    displayInChat("Type '/endpoll' to end the poll early.","#DA0808","#1EBCC1");
                }
            },200);
            return "";
        }
        else if (chat_val.substring(1,8)=="endpoll"){
            if(pollactive[0]){
                if(playerids[myid].ratelimit.poll+10000>Date.now()){
                    displayInChat("Your poll has to be at least 10 seconds.","#DA0808","#1EBCC1");
                    displayInChat("There are "+((playerids[myid].ratelimit.poll+10000-Date.now())/1000).toString()+" seconds left until you can end the poll early.","#DA0808","#1EBCC1");
                    return "";
                }
                playerids[myid].ratelimit.poll = Date.now();
                SEND("42"+JSON.stringify([4,{"type":"poll end","from":username}]));
                displayInChat("The poll ended.","#DA0808","#1EBCC1");
                var count = [0,0,0,0];
                var keys = Object.keys(playerids);
                for(var i = 0;i<keys.length;i++){
                    if(playerids[keys[i]].vote.poll!=-1 && playerids[keys[i]].vote.poll<pollactive[3].length-1){
                        count[playerids[keys[i]].vote.poll]++;
                    }
                    playerids[keys[i]].vote.poll = -1;
                }
                for(var i = 0;i<count.length;i++){
                    if(count[i]>1){
                        displayInChat(count[i].toString()+" people voted for option "+letters[i]+".","#DA0808","#1EBCC1");
                    }
                    if(count[i]==1){
                        displayInChat(count[i].toString()+" person voted for option "+letters[i]+".","#DA0808","#1EBCC1");
                    }
                }
                displayInChat("The poll was:","#DA0808","#1EBCC1");
                for(var i = 0;i<pollactive[3].length;i++){
                    displayInChat(letters[i]+") "+pollactive[3][i],"#DA0808","#1EBCC1");
                }
                pollactive = [false,0,0,[]];
            }
            else{
                displayInChat("No poll has been started","#DA0808","#1EBCC1");
                displayInChat("Type '/startpoll [seconds]' to start a poll.","#DA0808","#1EBCC1");
            }
            return "";
        }
        else if (chat_val.substring(1,7)=="moveA " && chat_val.replace(/^\s+|\s+$/g, '').length>=8){
            var text = chat_val.substring(7).replace(/^\s+|\s+$/g, '');
            var keys = Object.keys(playerids);
            var t = -1;
            if(text == "f"){
                t = 1;
            }
            else if(text == "b"){
                t = 3;
            }
            else if(text == "g"){
                t = 4;
            }
            else if(text == "r"){
                t = 2;
            }
            else if(text == "y"){
                t = 5;
            }
            else if(text == "s"){
                t = 0;
            }
            if(t == -1){
                displayInChat("The format for this command is:","#DA0808","#1EBCC1");
                displayInChat("/moveA [letter]","#DA0808","#1EBCC1");
                displayInChat("For example: '/moveA r' would move everyone to red team.","#DA0808","#1EBCC1");
                return "";
            }
            for(var i = 0;i<keys.length;i++){
                SEND('42[26,{"targetID":'+keys[i].toString()+',"targetTeam":'+t.toString()+'}]');
                if(playerids[keys[i]].peerID!="sandbox"){
                    RECIEVE('42[18,'+keys[i].toString()+','+t.toString()+']');
                }
            }
            
            return "";
        }
        else if (chat_val.substring(1,7)=="moveT " && chat_val.replace(/^\s+|\s+$/g, '').length>=8){
            var text = chat_val.substring(7).replace(/^\s+|\s+$/g, '').split(" ").filter(function(i){if(i==""){return false}else{return true}});
            if(text.length == 2){
                var firstteam = -1;
                var secondteam = -1;
                for(var i = 0;i<2;i++){
                    var t = -1;
                    if(text[i] == "f"){
                        t = 1;
                    }
                    else if(text[i] == "b"){
                        t = 3;
                    }
                    else if(text[i] == "g"){
                        t = 4;
                    }
                    else if(text[i] == "r"){
                        t = 2;
                    }
                    else if(text[i] == "y"){
                        t = 5;
                    }
                    else if(text[i] == "s"){
                        t = 0;
                    }
                    if(t==-1){
                        displayInChat("The format for this command is:","#DA0808","#1EBCC1");
                        displayInChat("/moveT [letter] [letter]","#DA0808","#1EBCC1");
                        displayInChat("For example: '/moveT s r' would move everyone in spectate to red team.","#DA0808","#1EBCC1");
                        return "";
                    }
                    else{
                        if(i == 0){
                            firstteam = t;
                        }
                        else{
                            secondteam = t;
                        }
                    }
                }
                var keys = Object.keys(playerids);
                for(var i = 0;i<keys.length;i++){
                    if(playerids[keys[i]].team == firstteam){
                        SEND('42[26,{"targetID":'+keys[i].toString()+',"targetTeam":'+secondteam.toString()+'}]');
                        if(playerids[keys[i]].peerID!="sandbox"){
                            RECIEVE('42[18,'+keys[i].toString()+','+secondteam.toString()+']');
                        }
                    }
                }
            }
            else{
                displayInChat("The format for this command is:","#DA0808","#1EBCC1");
                displayInChat("/moveT [team] [team]","#DA0808","#1EBCC1");
                displayInChat("For example: '/moveT s r' would move everyone in spectate to red team.","#DA0808","#1EBCC1");
                return "";
            }
            
            return "";
        }
        if (chat_val.substring(1,13)=="roundsperqp " && chat_val.replace(/^\s+|\s+$/g, '').length>=14){
            var text = parseInt(chat_val.substring(13).replace(/^\s+|\s+$/g, ''));
            if(isNaN(text)){
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                return "";
            }
            else if(text<=0){
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                return "";
            }
            roundsperqp = text;
            roundsperqp2 = 0;
            displayInChat("Set rounds per quickplay to: " + text.toString(),"#DA0808","#1EBCC1");
            displayInChat("Type '/roundsperqp' to reset rounds per quickplay.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,12)=="roundsperqp"){
            roundsperqp = 1;
            roundsperqp2 = 0; 
            displayInChat("Reset rounds per quickplay.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,8)=="rounds " && chat_val.replace(/^\s+|\s+$/g, '').length>=9){
            var text = chat_val.substring(8).replace(/^\s+|\s+$/g, '');
            if(!isNaN(parseInt(text))){
                text = parseInt(text).toString();
                SEND('42[21,{"w":'+text+'}]');
                RECIEVE('42[27,'+text+']');
            }
            return "";
 
        }
        else if (chat_val.substring(1,13)=="disablekeys " && chat_val.replace(/^\s+|\s+$/g, '').length>=14){
            var text = chat_val.substring(13).replace(/^\s+|\s+$/g, '');
            var keys = text.split(" ");
            var disabledkeys2 = [];
            var possiblekeys = ["left","right","up","down","heavy","special"];
            for(var i = 0; i<keys.length; i++){
                if(keys[i]!="" && !disabledkeys2.includes(keys[i])){
                    if(possiblekeys.includes(keys[i])){
                        disabledkeys2.push(keys[i]);
                    }
                    else{
                        displayInChat("Key options: " + possiblekeys.join(" ") + ".","#DA0808","#1EBCC1");
                        return "";
                    }
                }
            
            }
            disabledkeys = disabledkeys2;
            displayInChat("Set disabled keys to: " + disabledkeys.join(" ") + ".","#DA0808","#1EBCC1");
            displayInChat("Type '/disablekeys' to reset disabled keys.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,12)=="disablekeys"){
            displayInChat("Reset disabled keys.","#DA0808","#1EBCC1");
            disabledkeys = [];
            return "";
 
        }
        else if (chat_val.substring(1,10)=="jointext " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
            jointext = chat_val.substring(10).replace(/^\s+|\s+$/g, '');
            displayInChat("Set jointext to: " + jointext,"#DA0808","#1EBCC1");
            displayInChat("Type '/jointext' to reset jointext.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,9)=="jointext"){
            jointext = "";
            displayInChat("Reset jointext.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,10)=="jointeam " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
            var text = chat_val.substring(10).replace(/^\s+|\s+$/g, '');
            var keys = Object.keys(playerids);
            var t = -1;
            if(text == "f"){
                t = 1;
                displayInChat("Set jointeam to FFA.","#DA0808","#1EBCC1");
            }
            else if(text == "b"){
                t = 3;
                displayInChat("Set jointeam to blue team.","#DA0808","#1EBCC1");
            }
            else if(text == "g"){
                t = 4;
                displayInChat("Set jointeam to green team.","#DA0808","#1EBCC1");
            }
            else if(text == "r"){
                t = 2;
                displayInChat("Set jointeam to red team.","#DA0808","#1EBCC1");
            }
            else if(text == "y"){
                t = 5;
                displayInChat("Set jointeam to yellow team.","#DA0808","#1EBCC1");
            }
            else if(text == "s"){
                t = 0;
                displayInChat("Set jointeam to spectate.","#DA0808","#1EBCC1");
            }
            if(t == -1){
                displayInChat("The format for this command is:","#DA0808","#1EBCC1");
                displayInChat("/jointeam [letter]","#DA0808","#1EBCC1");
                displayInChat("For example: '/jointeam r' would move every joined person to red team.","#DA0808","#1EBCC1");
                return "";
            }
            displayInChat("Type '/jointeam' to reset jointeam.","#DA0808","#1EBCC1");
            jointeam = t;
            
            return "";
        }
        else if (chat_val.substring(1,9)=="jointeam"){
            jointeam = -1;
            displayInChat("Reset jointeam.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,9)=="wintext " && chat_val.replace(/^\s+|\s+$/g, '').length>=10){
            wintext = chat_val.substring(9).replace(/^\s+|\s+$/g, '');
            displayInChat("Set wintext to: " + wintext,"#DA0808","#1EBCC1");
            displayInChat("Type '/wintext' to reset wintext.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,8)=="wintext"){
            wintext = "";
            displayInChat("Reset wintext.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,11)=="autorecord"){
            if(autorecord){
                autorecord = false;
                displayInChat("Autorecord is now off.","#DA0808","#1EBCC1");
            }
            else{
                autorecord = true;
                displayInChat("Autorecord is now on.","#DA0808","#1EBCC1");
            }            
            return "";
 
        }
        else if (chat_val.substring(1,9)=="afkkill " && chat_val.replace(/^\s+|\s+$/g, '').length>=10){
            var text = parseFloat(chat_val.substring(9).replace(/^\s+|\s+$/g, ''));
            if(!isNaN(text)){
                if(text>0){
                    displayInChat("Set afk kill to: " + text.toString()+" seconds.","#DA0808","#1EBCC1");
                    displayInChat("Type '/afkkill' to reset afk kill.","#DA0808","#1EBCC1");
                    var keys = Object.keys(playerids);
                    var now = Date.now();
                    for(var i = 0;i<keys.length;i++){
                        playerids[keys[i]].lastmove = now;
                    }
                    afkkill = text;
                }
                else{
                     displayInChat("Type a positive number.","#DA0808","#1EBCC1");
                }
            }
            else{
                displayInChat("Type a positive number.","#DA0808","#1EBCC1");
            }
            return "";
 
        }
        else if (chat_val.substring(1,9)=="afkkill"){
            afkkill = -1;
            displayInChat("Reset afk kill.","#DA0808","#1EBCC1");
            return "";
 
        }
        else if (chat_val.substring(1,13)=="defaultmode " && chat_val.replace(/^\s+|\s+$/g, '').length>=14){
            var text = chat_val.substring(13).replace(/^\s+|\s+$/g, '');
            if(text == "default"){
                defaultmode = "";
                displayInChat("Changed default mode to default.","#DA0808","#1EBCC1");
            }
            else if(text == "arrows"){
                defaultmode = "ar";
                displayInChat("Changed default mode to arrows.","#DA0808","#1EBCC1");
            }
            else if(text == "death arrows"){
                defaultmode = "ard";
                displayInChat("Changed default mode to death arrows.","#DA0808","#1EBCC1");
            }
            else if(text == "grapple"){
                defaultmode = "sp";
                displayInChat("Changed default mode to grapple.","#DA0808","#1EBCC1");
            }
            else if(text == "classic"){
                defaultmode = "b";
                displayInChat("Changed default mode to classic.","#DA0808","#1EBCC1");
 
            }
            else{
                displayInChat("Default mode options:","#DA0808","#1EBCC1");
                displayInChat("default","#DA0808","#1EBCC1");
                displayInChat("classic","#DA0808","#1EBCC1");
                displayInChat("arrows","#DA0808","#1EBCC1");
                displayInChat("death arrows","#DA0808","#1EBCC1");
                displayInChat("grapple","#DA0808","#1EBCC1");
            }
            return "";
 
        }
        else if (chat_val.substring(1,8)=="recmode"){
            if(recmodebool == true){
                recmodebool = false;
                displayInChat("Recmode is now off.","#DA0808","#1EBCC1");
 
            }
            else{
                recmodebool = true;
                displayInChat("Recmode is now on.","#DA0808","#1EBCC1");
 
            }
 
            return "";
 
        }
        else if (chat_val.substring(1,8)=="recteam"){
            if(recteams == true){
                recteams = false;
                displayInChat("Recteam is now off.","#DA0808","#1EBCC1");
 
            }
            else{
                recteams = true;
                displayInChat("Recteam is now on.","#DA0808","#1EBCC1");
 
            }
            return "";
        }
        else if (chat_val.substring(1,8)=="shuffle"){
            if(shuffle == true){
                shuffle = false;
                displayInChat("Shuffle is now off.","#DA0808","#1EBCC1");
 
            }
            else{
                shuffle = true;
                displayInChat("Shuffle is now on.","#DA0808","#1EBCC1");
 
            }
 
            return "";
 
        }
        else if (chat_val.substring(1,9)=="autokick"){
            if(autokickban == 0){
                displayInChat("Autokick is now on.","#DA0808","#1EBCC1");
                autokickban = 1;
            }
            else if(autokickban == 1){
                autokickban = 0;
                displayInChat("Autokick is now off.","#DA0808","#1EBCC1");
            }
            else{
                autokickban = 1;
                displayInChat("Autokick is now on, and Autoban is now off.","#DA0808","#1EBCC1");
            }
 
            return "";
        }
        else if (chat_val.substring(1,8)=="autoban"){
            if(autokickban == 0){
                displayInChat("Autoban is now on.","#DA0808","#1EBCC1");
                autokickban = 2;
            }
            else if(autokickban == 2){
                autokickban = 0;
                displayInChat("Autoban is now off.","#DA0808","#1EBCC1");
            }
            else{
                autokickban = 2;
                displayInChat("Autoban is now on, and Autokick is now off.","#DA0808","#1EBCC1");
            }
 
            return "";
        }
        else if (chat_val.substring(1,8)=="sandbox"){
            if(sandboxon == false){
                displayInChat("This room is now a sandbox room.","#DA0808","#1EBCC1");
                sandboxon = true;
                SEND('42[4,{"type":"sandboxon"}]');
                var sandboxkeys = Object.keys(sandboxplayerids);
                var packets = [];
                for(var i = 0;i<sandboxkeys.length;i++){
                    var p = playerids[sandboxkeys[i]];
                    var packet = '42'+JSON.stringify([4,sandboxkeys[i],p.peerID,p.userName,p.guest,p.level,p.team,p.avatar]);
                    packets.push(packet);
                }
                SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":packets,to:[-1]}]));
                SEND("42"+JSON.stringify([4,{"type":"sandboxid","from":username,"lastid":sandboxid,to:[-1]}]));
            }
            else{
                displayInChat("You cannot turn a sandbox room back into a normal room.","#DA0808","#1EBCC1");
            }
 
            return "";
        }
        else if(sandboxon){
            if (chat_val.substring(1,11)=="addplayer " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
                var text = chat_val.substring(11).replace(/^\s+|\s+$/g, '');
                if(!isNaN(parseInt(text))){
                    var text2 = parseInt(text);
                    if(text2>0){
                        for(var i = 0;i<text2;i++){
                            while(playerids[sandboxid]){
                                sandboxid+=1;
                            }
                            var color = Math.floor(Math.random() * 16777215).toString();
                            var packet = '42'+JSON.stringify([4,sandboxid,"sandbox",sandboxid.toString(),true,0,0,{"layers":[],"bc":color}]);
                            RECIEVE(packet);
                            SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":[packet],to:[-1]}]));
                            sandboxplayerids[sandboxid] = sandboxid.toString();
                            sandboxid+=1;
                        }
 
                    }
                }
                return "";
 
            }
            if (chat_val.substring(1,9)=="addname " && chat_val.replace(/^\s+|\s+$/g, '').length>=10){
                var text = chat_val.substring(9).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"");
                while(playerids[sandboxid]){
                    sandboxid+=1;
                }
                var keys = Object.keys(playerids);
                var addon = "";
                var escape = false;
                var keysi = -1;
                while(!escape){
                    escape = true;
                    for(var i = 0;i<keys.length;i++){
                        if(playerids[keys[i]].userName == text+addon){
                            addon+="‎";
                            var escape = false;
                        }
                        if(playerids[keys[i]].userName == text){
                            keysi = keys[i];
                        }
                    }
                }
                if(keysi!=-1){
                    var packet = '42'+JSON.stringify([4,sandboxid,"sandbox",text+addon,playerids[keysi].guest,playerids[keysi].level,0,playerids[keysi].avatar]);
                    RECIEVE(packet);
                    SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":[packet],to:[-1]}]));
                }
                else{
                    var color = Math.floor(Math.random() * 16777215).toString();
                    var packet = '42'+JSON.stringify([4,sandboxid,"sandbox",text+addon,true,0,0,{"layers":[],"bc":color}]);
                    RECIEVE(packet);
                    SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":[packet],to:[-1]}]));
                }
                sandboxplayerids[sandboxid] = sandboxid.toString();
                sandboxid+=1;
                return "";
 
            }
            else if (chat_val.substring(1,11)=="delplayer " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
                var text = chat_val.substring(11).replace(/^\s+|\s+$/g, '');
                if(!isNaN(parseInt(text))){
                    var text2 = parseInt(text);
                    if(text2>0){
                        if(Gdocument.getElementById("gamerenderer").style["visibility"] == "hidden"){
                            var jsonkeys = Object.keys(sandboxplayerids).reverse();
                            var packets = [];
                            for(var i = 0;i<text2 && i<jsonkeys.length;i++){
                                var packet = '42[5,'+jsonkeys[i]+',0]';
                                RECIEVE(packet);
                                packets.push(packet);
                                delete sandboxplayerids[jsonkeys[i]];
                            }
                            SEND("42"+JSON.stringify([4,{"type":"fakerecieve","from":username,"packet":packets,to:[-1]}]));
                        }
                        else{
                            displayInChat("Cannot delete players while ingame.","#DA0808","#1EBCC1");
                        }
 
                    }
                }
                return "";
            }
            else if (chat_val.substring(1,6)=="copy " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
                var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '').replaceAll("'","").replaceAll('"',"");
                var keys = Object.keys(playerids);
                var keys2 = Object.keys(sandboxplayerids);
                
                var copiedperson = -1;
                for(var i = 0;i<keys.length;i++){
                    if(playerids[keys[i]].userName==text){
                        copiedperson = keys[i];
                    }
                }
                if(copiedperson==-1){
                    displayInChat(playerids[copiedperson].userName + " was not found in this room.","#DA0808","#1EBCC1");
                    return "";
                }
                if(keys2.includes(copiedperson.toString())){
                    displayInChat("Bots cannot copy a bot.","#DA0808","#1EBCC1");
                    return "";
                }
                displayInChat("All bots will now copy "+playerids[copiedperson].userName+".","#DA0808","#1EBCC1");
                displayInChat("To reset copy, type '/copy'.","#DA0808","#1EBCC1");
                sandboxcopyme = copiedperson;
                
 
                return "";
            }
            else if (chat_val.substring(1,5)=="copy"){
                sandboxcopyme = -1;
                displayInChat("Copy is now off.","#DA0808","#1EBCC1");
                return "";
            }
            
        }
    }
    return chat_val;
};
 
scope.flag_manage = function(t){
    var text = t;
    if(autocorrect == true){
        var text2 = text.split(" ");
        for(var i = 0;i<text2.length;i++){
            text2[i] = closestWord(text2[i]);
        }
        text = text2.join(" ");
    }
    if(reverse_flag == true){
        text = text.split("").reverse().join("")
    }
    if(rcaps_flag == true){
        text = text.split('');
        for(var i = 0; i<text.length;i++){
            if(Math.floor(Math.random()*2)){
                text[i] = text[i].toUpperCase();
            }
            else{
                text[i] = text[i].toLowerCase();
            }
        }
        text = text.join('');
    }
    if(space_flag == true){
        text = text.split('').join(' ')
    }
    if(textmode!=-1){
        newtext = "";
        for(var i = 0;i<text.length;i++){
            if(letter_dictionary[text[i]]){
                newtext+=letter_dictionary[text[i]][textmode];
            }
            else{
                newtext+=text[i];
            }
        }
        text = newtext;
    }
    if(number_flag == true){
        text = text.replace(/[t|T][Oo]+/g,"2");
        text = text.replace(/[f|F][o|O][r|R]/g,"4");
        text = text.replace(/[a|A][t|T][e|E]/g,"8");
        text = text.replace(/[e|E]/g,"3");
        text = text.replace(/[a|A]/g,"4");
        text = text.replace(/[o|O]/g,"0");
        text = text.replace(/[s|S]/g,"5");
        text = text.replace(/[i|I|l|L]/g,"1");
    }
    return text;
};
Gdocument.getElementById("newbonklobby_chat_input").onkeydown = function(e){
    if(e.keyCode==13){
 
        var chat_val = Gdocument.getElementById("newbonklobby_chat_input").value;
 
        if (chat_val!="" && chat_val[0]=="/"){
 
            Gdocument.getElementById("newbonklobby_chat_input").value = "";
            chat2(commandhandle(chat_val));
        }
        else{
            Gdocument.getElementById("newbonklobby_chat_input").value = "";
            chat2(flag_manage(chat_val));
        }
 
    }
};
Gdocument.getElementById("ingamechatinputtext").onkeydown = function(e){
    if(e.keyCode==13){
 
        var chat_val = Gdocument.getElementById("ingamechatinputtext").value;
 
        if (chat_val!="" && chat_val[0]=="/"){
 
            Gdocument.getElementById("ingamechatinputtext").value = "";
            chat2(commandhandle(chat_val));
        }
        else{
            Gdocument.getElementById("ingamechatinputtext").value = "";
            chat2(flag_manage(chat_val));
        }
    }
};
scope.Last_message = "";
scope.Laster_message = "";
scope.new_message = false;
scope.changed_chat = false;
scope.injectedBonkCommandsScript = setInterval(timeout123,60);

scope.pan_enabled = false;
scope.pan = {"x":0,"y":0};
scope.pan_speed = 5;
scope.keys_being_held = {};
scope.hotkeys_keyup = function(e){
    if(keys_being_held[e.code]){
        keys_being_held[e.code] = false;
    }
};
Gdocument.onkeyup = hotkeys_keyup;
scope.hotkeys = function(e){
    
    
    var keycode = e.code;
    if(!keys_being_held[keycode]){
        keys_being_held[keycode] = true;
    }
    if(!e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey){
        if(pan_enabled && Gdocument.getElementById("gamerenderer")?.childElementCount>0){
            if(keycode == "ArrowUp"){
                e.stopPropagation();
                e.preventDefault();
            }
            else if(keycode == "ArrowDown"){
                e.stopPropagation();
                e.preventDefault();
            }
            else if(keycode == "ArrowLeft"){
                e.stopPropagation();
                e.preventDefault();
            }
            else if(keycode == "ArrowRight"){
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }

    if(e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey){
        if(keycode == "Period"){
            if(Gdocument.getElementById("ingamechatcontent").style["max-height"]!="0px"){
                chatheight+=5;
                if(chatheight>600){chatheight = 600;}
                Gdocument.getElementById("ingamechatcontent").style["max-height"]=chatheight.toString()+"px";
                Gdocument.getElementById("ingamechatcontent").style["height"]=chatheight.toString()+"px";
                Gdocument.getElementById("ingamechatbox").style["height"]="100%";
            }
            e.preventDefault();
        }
        if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
            if(keycode == "KeyG"){
                var addto = 0;
                for(var i = 0;i<parentDraw.children.length;i++){
                    if(parentDraw.children[i].constructor.name == "e"){
                        addto = parentDraw.children[i];
                        break;
                    }
                }
                var canv = 0;
                for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
                    if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                        canv = Gdocument.getElementById("gamerenderer").children[i];
                        break;
                    }
                }
                var width = parseInt(canv.style["width"]);
                var height = parseInt(canv.style["height"]);
                if(addto){
                    zoom *= 1.1;
                }
                addto.scale.x = zoom;
                addto.scale.y = zoom;
                parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999 && !FollowCam){
                    pixiCircle.visible = false;
                }
                else{
                    pixiCircle.visible = true;
                }
                e.preventDefault();
            }
            if(keycode == "KeyH"){
                var addto = 0;
                for(var i = 0;i<parentDraw.children.length;i++){
                    if(parentDraw.children[i].constructor.name == "e"){
                        addto = parentDraw.children[i];
                        break;
                    }
                }
                var canv = 0;
                for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
                    if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                        canv = Gdocument.getElementById("gamerenderer").children[i];
                        break;
                    }
                }
                var width = parseInt(canv.style["width"]);
                var height = parseInt(canv.style["height"]);
                if(addto){
                    zoom = 1;
                }
                addto.scale.x = zoom;
                addto.scale.y = zoom;
                parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999 && !FollowCam){
                    pixiCircle.visible = false;
                }
                else{
                    pixiCircle.visible = true;
                }
                e.preventDefault();
            }
            if(keycode == "KeyJ"){
                var addto = 0;
                for(var i = 0;i<parentDraw.children.length;i++){
                    if(parentDraw.children[i].constructor.name == "e"){
                        addto = parentDraw.children[i];
                        break;
                    }
                }
                var canv = 0;
                for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
                    if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                        canv = Gdocument.getElementById("gamerenderer").children[i];
                        break;
                    }
                }
                var width = parseInt(canv.style["width"]);
                var height = parseInt(canv.style["height"]);
                if(addto){
                    zoom /= 1.1;
                }
                addto.scale.x = zoom;
                addto.scale.y = zoom;
                parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999 && !FollowCam){
                    pixiCircle.visible = false;
                }
                else{
                    pixiCircle.visible = true;
                }
                e.preventDefault();
            }
        }
        if(keycode == "Comma"){
            if(Gdocument.getElementById("ingamechatcontent").style["max-height"]!="0px"){
                chatheight-=5;
                if(chatheight<100){chatheight = 100;}
                Gdocument.getElementById("ingamechatcontent").style["max-height"]=chatheight.toString()+"px";
                Gdocument.getElementById("ingamechatcontent").style["height"]=chatheight.toString()+"px";
                Gdocument.getElementById("ingamechatbox").style["height"]="100%";
            }
            e.preventDefault();
        }
    }
    if(e.repeat){return;}
    
    if(e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey){
        if(ishost){
            if(keycode == "KeyE"){
                if(Gdocument.getElementById("newbonklobby").style["display"] == "block"){
                    Gdocument.getElementById("newbonklobby_editorbutton").click();
                }
                else if(Gdocument.getElementById("mapeditorcontainer").style["display"] == "block"){
                    Gdocument.getElementById("mapeditor_close").click();
                }
                e.preventDefault();
 
            }
            else if(keycode == "KeyT"){
                Gdocument.getElementById("newbonklobby_teamsbutton").click();
                e.preventDefault();
            }
            else if(keycode == "KeyM"){
                Gdocument.getElementById("newbonklobby_modebutton").click();
                e.preventDefault();
            }
            else if(keycode == "KeyK"){
                if(Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                    Gdocument.getElementById("pretty_top_exit").click();
                }
                e.preventDefault();
            }
            else if(keycode == "KeyS"){
                if(Gdocument.getElementById("mapeditorcontainer").style["display"]!="block"){
                    Gdocument.getElementById("newbonklobby_editorbutton").click();
                }
                if(recmodebool && ishost){
                    var mode = Gdocument.getElementById("mapeditor_modeselect").value;
                    if(mode == "" && defaultmode!="d"){
                            mode = defaultmode;
                    }
                    if(mode != ""){
                        RECIEVE('42[26,"b","'+mode+'"]');
                    }
                }
                Gdocument.getElementById("mapeditor_close").click();
                Gdocument.getElementById("newbonklobby").style["display"] = "none";
                roundsperqp2 = 0;
                Gdocument.getElementById("mapeditor_midbox_testbutton").click();
                e.preventDefault();
            }
            else if(keycode == "KeyD"){
                roundsperqp2 = 0;
                if(stopquickplay == 0){
                    if(shuffle){
                        var e2 = Gdocument.getElementById("maploadwindowmapscontainer").children;
                        var available = [];
                        var availableindexes = [];
                        var notempty = false;
                        for(var i = 0; i<e2.length;i++){
                            var a = false;
                            [...e2[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                            available.push(a);
                            if(a){
                                availableindexes.push(i);
                                notempty = true;
                            }
                        }
                        if(notempty){
 
                            if(availableindexes.length!=1){
                                availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                            }
                            quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                        }
                    }
                    else{
                        var e2 = Gdocument.getElementById("maploadwindowmapscontainer").children;
                        var available = [];
                        var availableindexes = [];
                        var notempty = false;
                        for(var i = 0; i<e2.length;i++){
                            var a = false;
                            [...e2[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                            available.push(a);
                            if(a){
                                availableindexes.push(i);
                                notempty = true;
                            }
                        }
                        if(notempty){
                            var above = [];
                            for(var i = 0;i<availableindexes.length;i++){
                                if(availableindexes[i]>quicki && !reverseqp){
                                    above.push(availableindexes[i]);   
                                }
                                else if(availableindexes[i]<quicki && reverseqp){
                                    above.push(availableindexes[i])
                                }
                            }
                            if(above.length>0){
                                quicki = above[0];
                                if(reverseqp){
                                    quicki = above[above.length-1];
                                }
                            }
                            else{
                                quicki = availableindexes[0];
                                if(reverseqp){
                                    quicki = availableindexes[availableindexes.length-1];
                                }
                            }
                        }
                    }
                    gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
                }
                e.preventDefault();
            }
            else if(keycode == "KeyA"){
                if(stopquickplay == 0){
                    roundsperqp2 = 0;
                    if(shuffle){
                        var e2 = Gdocument.getElementById("maploadwindowmapscontainer").children;
                        var available = [];
                        var availableindexes = [];
                        var notempty = false;
                        for(var i = 0; i<e2.length;i++){
                            var a = false;
                            [...e2[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                            available.push(a);
                            if(a){
                                availableindexes.push(i);
                                notempty = true;
                            }
                        }
                        if(notempty){
 
                            if(availableindexes.length!=1){
                                availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                            }
                            quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                        }
                    }
                    else{
                        var e2 = Gdocument.getElementById("maploadwindowmapscontainer").children;
                        var available = [];
                        var availableindexes = [];
                        var notempty = false;
                        for(var i = 0; i<e2.length;i++){
                            var a = false;
                            [...e2[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                            available.push(a);
                            if(a){
                                availableindexes.push(i);
                                notempty = true;
                            }
                        }
                        if(notempty){
                            var above = [];
                            for(var i = 0;i<availableindexes.length;i++){
                                if(availableindexes[i]<quicki && !reverseqp){
                                    above.push(availableindexes[i]);   
                                }
                                else if(availableindexes[i]>quicki && reverseqp){
                                    above.push(availableindexes[i])
                                }
                            }
                            if(above.length>0){
                                quicki = above[above.length-1];
                                if(reverseqp){
                                    quicki = above[0];
                                }
                            }
                            else{
                                quicki = availableindexes[availableindexes.length-1];
                                if(reverseqp){
                                    quicki = availableindexes[0];
                                }
                            }
                        }
                    }
                    gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
                }
                e.preventDefault();
            }
            else if(keycode == "KeyQ"){
                if(stopquickplay == 1){
                    stopquickplay = 0;
                    quicki = 0;
                    qppaused = false;
                    displayInChat("Enabled quickplay.","#DA0808","#1EBCC1");
                }
                else{
                    stopquickplay = 1;
                    quicki = 0;
                    qppaused = false;
                    displayInChat("Disabled quickplay.","#DA0808","#1EBCC1");
                }
                e.preventDefault();
            }
            else if(keycode == "KeyP" && stopquickplay==0){
                if(qppaused == true){
                    qppaused = false;
                    displayInChat("Unpaused quickplay.","#DA0808","#1EBCC1");
                }
                else{
                    qppaused = true;
                    displayInChat("Paused quickplay.","#DA0808","#1EBCC1");
                }
                e.preventDefault();
            }
            else if(keycode == "KeyR"){
                if(recmodebool == true){
                    recmodebool = false;
                    displayInChat("Recmode is now off.","#DA0808","#1EBCC1");
 
                }
                else{
                    recmodebool = true;
                    displayInChat("Recmode is now on.","#DA0808","#1EBCC1");
 
                }
            }
            else if(keycode == "KeyF"){
                if(freejoin == false){
                    freejoin = true;
                    displayInChat("Freejoin is now on.","#DA0808","#1EBCC1");
 
                }
                else{
                    freejoin = false;
                    displayInChat("Freejoin is now off.","#DA0808","#1EBCC1");
                }
                e.preventDefault();
            }
            
        }
        else{
            if(keycode == "KeyE"){
                e.preventDefault();
            }
            else if(keycode == "KeyT"){
                e.preventDefault();
            }
            else if(keycode == "KeyM"){
                e.preventDefault();
            }
            else if(keycode == "KeyK"){
                e.preventDefault();
            }
            else if(keycode == "KeyS"){
                e.preventDefault();
            }
            else if(keycode == "KeyD"){
                e.preventDefault();
            }
            else if(keycode == "KeyA"){
                e.preventDefault();
            }
            else if(keycode == "KeyQ"){
                e.preventDefault();
            }
            else if(keycode == "KeyP"){
                e.preventDefault();
            }
            else if(keycode == "KeyF"){
                e.preventDefault();
            }
            else if(keycode == "KeyR"){
                e.preventDefault();
            }
 
        }
        
        if(keycode == "KeyL"){
            lobby();
            e.preventDefault();
        }
        if(keycode == "KeyC"){
            if(Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                if(Gdocument.getElementById("ingamechatcontent").style["max-height"]=="0px"){
                    Gdocument.getElementById("ingamechatcontent").style["max-height"]=chatheight.toString()+"px";
                }
                else{
                    Gdocument.getElementById("ingamechatcontent").style["max-height"]="0px";
                }
            }
            e.preventDefault();
        }
        if(keycode == "KeyI"){
            if(Gdocument.getElementById("BonkCommandsDebuggerContainer").style["display"] == "none"){
                debuggeropen = true;
                Gdocument.getElementById("BonkCommandsDebuggerContainer").style["display"]="block";
                Gdocument.getElementById("newbonklobby_chat_input").style["display"]="none";
                Gdocument.getElementById("ingamechatinputtext").style["display"] = "none";
            }
            else{
                debuggeropen = false;
                Gdocument.getElementById("BonkCommandsDebuggerContainer").style["display"]="none";
                Gdocument.getElementById("newbonklobby_chat_input").style["display"]="";
                Gdocument.getElementById("ingamechatinputtext").style["display"] = "";
            }
            e.preventDefault();
        }
        if(keycode == "KeyB"){
            var element = Gdocument.getElementById("ingamewinner_scores");
            if(element.style["opacity"]<1){
                element.style["opacity"] = 1;
                element.style["visibility"] = "visible";
            }
            else{
                element.style["opacity"] = 0;
                element.style["visibility"] = "unset";
            }
            e.preventDefault();
        }
        if(keycode == "KeyY"){
            Gdocument.getElementById("pretty_top_settings").click();
            Gdocument.getElementById("settings_close").click();
            if(Gdocument.getElementById("settings_graphicsquality").value==1){
                displayInChat("You must have medium or high quality enabled to use this feature.","#DA0808","#1EBCC1");
                return "";
            }
 
 
            if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                var addto = {"children":[]};
                for(var i = 0;i<parentDraw.children.length;i++){
                    if(parentDraw.children[i].constructor.name == "e"){
                        addto = parentDraw.children[i];
                        break;
                    }
                }
                var addto2 = {"children":[]};
                for(var i = 0;i<addto.children.length;i++){
                    if(addto.children[i].constructor.name == "e"){
                        addto2 = addto.children[i];
                        break;
                    }
                }
                var checkxray = addto2.children[0];
                var addto3 = addto2.children[0].children;
                if(addto3.length==1){
                    checkxray = checkxray.children[0];
                    addto3 = addto3[0].children;
                }
                var xrayon = false;
                if(checkxray.xrayon){
                    checkxray.xrayon = false;
                    xrayon = false;
                }
                else{
                    checkxray.xrayon = true;
                    xrayon = true;
                }
                if(xrayon){
                    displayInChat("Xray is now on.","#DA0808","#1EBCC1");
                    for(var i = 0;i<addto3.length;i++){
                        if(addto3[i].children.length>0){
                            var ids = [];
                            var ids2 = [];
                            for(var i3 = 0;i3<addto3[i].children.length;i3++){
                                addto3[i].children[i3].visible = false;
                                
                                if(addto3[i].children[i3].children.length>0){
                                    for(var i4 = 0;i4<addto3[i].children[i3].children.length;i4++){
                                        if(addto3[i].children[i3].children[i4].geometry?.id){
                                            ids.push(addto3[i].children[i3].children[i4].geometry.id);
                                        }
                                        else if(addto3[i].children[i3].children[i4].texture?.baseTexture?.uid){
                                            ids2.push(addto3[i].children[i3].children[i4].texture.baseTexture.uid);
                                        }
                                    }
                                }
                            }
                            for(var i3 = 0;i3<addto3[i].children.length;i3++){
                                if(addto3[i].children[i3].children.length==0){
                                    if(addto3[i].children[i3].geometry?.id){
                                        if(ids.includes(addto3[i].children[i3].geometry.id+1)){
                                            addto3[i].children[i3].visible = true;
                                            addto3[i].children[i3].alpha = 0.5;
                                        }
                                    }
                                    else if(addto3[i].children[i3].texture?.baseTexture?.uid){
                                        if(ids2.includes(addto3[i].children[i3].texture.baseTexture.uid+1)){
                                            addto3[i].children[i3].visible = true;
                                            addto3[i].children[i3].alpha = 0.5;
                                        }
                                    }
                                    if(addto3[i].children[i3].batchDirty){
                                        addto3[i].children[i3].visible = true;
                                        addto3[i].children[i3].alpha = 0.5;
                                        if(addto3[i].children[i3+1]){
                                            addto3[i].children[i3+1].visible = true;
                                            addto3[i].children[i3+1].alpha = 0.5;
                                        }
                                    }
                                }
                            }
                        }
                    }
 
                }
                else{
                    displayInChat("Xray is now off.","#DA0808","#1EBCC1");
                    for(var i = 0;i<addto3.length;i++){
                        for(var i2 = 0;i2<addto3[i].children.length;i2++){
                            addto3[i].children[i2].visible = true;
                            addto3[i].children[i2].alpha = 1;
                        }
                    }
                }
            }
            e.preventDefault();
        }
        if(keycode == "KeyN"){
            if(FollowCam == true){
                displayInChat("Follow Camera is now off.","#DA0808","#1EBCC1");
                FollowCam = false;
                if(parentDraw && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                    var addto = {"children":[]};
                    for(var i = 0;i<parentDraw.children.length;i++){
                        if(parentDraw.children[i].constructor.name == "e"){
                            addto = parentDraw.children[i];
                            break;
                        }
                    }
                    var canv = 0;
                    for(var i = 0;i<Gdocument.getElementById("gamerenderer").children.length;i++){
                        if(Gdocument.getElementById("gamerenderer").children[i].constructor.name == "HTMLCanvasElement"){
                            canv = Gdocument.getElementById("gamerenderer").children[i];
                            break;
                        }
                    }
                    var width = parseInt(canv.style["width"]);
                    var height = parseInt(canv.style["height"]);
                    parentDraw.x = -addto.scale.x * parseInt(width)/2 + parseInt(width)/2;
                    parentDraw.y = -addto.scale.y * parseInt(height)/2 + parseInt(height)/2;
                    parentDraw.children[0].x = parseInt(width)/2*addto.scale.x-parseInt(width)/2;
                    parentDraw.children[0].y = parseInt(height)/2*addto.scale.y-parseInt(height)/2;
                    if(addto.scale.x>=0.99999 && addto.scale.y>=0.99999){
                        pixiCircle.visible = false;
                    }
                    else{
                        pixiCircle.visible = true;
                    }
                }
            }
            else{
                displayInChat("Follow Camera is now on.","#DA0808","#1EBCC1");
                FollowCam = true;
            }
            e.preventDefault();
        }
        if(keycode == "KeyV"){
            if(autocam == true){
                displayInChat("Auto Cam is now off.","#DA0808","#1EBCC1");
                autocam = false
            }
            else{
                displayInChat("Auto Cam is now on.","#DA0808","#1EBCC1");
                autocam = true;
            }
            e.preventDefault();
        }
        if (keycode == "BracketLeft"){
            if(pan_enabled == true){
                displayInChat("Pan is now off.","#DA0808","#1EBCC1");
                pan = {"x":0,"y":0};
                pan_enabled = false;
            }
            else{
                displayInChat("Pan is now on. Shift + Arrow Keys to pan.","#DA0808","#1EBCC1");
                pan_enabled = true;
            }
            return "";
        }
        if (keycode == "BracketRight"){
            pan = {"x":0,"y":0};
            displayInChat("Reset pan.","#DA0808","#1EBCC1");
            return "";
        }
        if(keycode == "KeyO"){
                if(heavybot == true){
                displayInChat("Heavy bot is now off.","#DA0808","#1EBCC1");
                heavybot = false;
            }
            else{
                displayInChat("Heavy bot is now on.","#DA0808","#1EBCC1");
                heavybot = true;
                getplayerkeys();
            }
            e.preventDefault();
        }
        if(keycode == "KeyU"){
            if(aimbot == true){
                displayInChat("Aimbot is now off.","#DA0808","#1EBCC1");
                aimbot = false;
            }
            else{
                displayInChat("Aimbot is now on.","#DA0808","#1EBCC1");
                aimbot = true;
                getplayerkeys();
            }
            e.preventDefault();
        }
        if(keycode == "KeyW"){
            if(staystill == true){
                displayInChat("Still is now off.","#DA0808","#1EBCC1");
                staystill = false;
                staystillpos = [0,0];
                fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
            }
            else{
                if(playerids[myid].playerData?.transform){
                    displayInChat("Still is now on.","#DA0808","#1EBCC1");
                    staystill = true;
                    staystillpos = [playerids[myid].playerData.transform.position.x/scale,playerids[myid].playerData.transform.position.y/scale];
                    getplayerkeys();
                    fire("keyup",{"keyCode":leftRight[0]},Gdocument.getElementById("gamerenderer"));
                    fire("keyup",{"keyCode":leftRight[1]},Gdocument.getElementById("gamerenderer"));
                }
                else{
                    displayInChat("You have to be alive to use this command.","#DA0808","#1EBCC1");
                }
            }
            e.preventDefault();
        }
        
        
    }
    if(!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey){
        if(keycode == "Slash" && !(Gdocument.getElementById("gmeditor")?.style["transform"] == "scale(1)")){
            if(Gdocument.getElementById("newbonklobby").style["display"]=="block" && Gdocument.getElementById("newbonklobby_chat_input").value == ""  && Gdocument.getElementById("maploadwindowcontainer").style["display"]!="block" && Gdocument.getElementById("newbonklobby_chat_input").style["display"]==""){
                Gdocument.getElementById("newbonklobby_chat_input").value = "/";
                if(Gdocument.getElementById("newbonklobby_chat_input").style["pointer-events"] == "none"){
                    fire("keydown",{keyCode:13});
                }
                else{
                    Gdocument.getElementById("newbonklobby_chat_input").focus();
                }
                e.preventDefault();
 
            }
            else if(Gdocument.getElementById("ingamechatinputtext").style["visibility"]=="visible" && Gdocument.getElementById("ingamechatinputtext").style["display"]=="" && Gdocument.getElementById("mapeditorcontainer").style["display"]!="block" && Gdocument.getElementById("ingamechatinputtext").value == ""){
                Gdocument.getElementById("ingamechatinputtext").value = "/";
                if(!Gdocument.getElementById("ingamechatinputtext").classList.value.includes("ingamechatinputtextbg")){
                    fire("keydown",{keyCode:13});
                }
                else{
                    Gdocument.getElementById("ingamechatinputtext").focus();
                }
                e.preventDefault();
 
            }
            
        }
    }
};
 
Gdocument.onkeydown = hotkeys;
 
Gwindow.addEventListener('resize',function(e){
    debuggermenu.style["width"] = Gdocument.getElementById("bonkiocontainer").style["width"];
    debuggermenu.style["height"] = Gdocument.getElementById("bonkiocontainer").style["height"];
    scope.width = parseInt(Gdocument.getElementById("bonkiocontainer").style["width"])-20;
    scope.height = parseInt(Gdocument.getElementById("bonkiocontainer").style["height"])-210;
    logmenu.style["width"] = width.toString()+"px";
    logmenu.style["height"] = height.toString()+"px";
    logmenutopleft.style["width"] = (width/2).toString()+"px";
    logmenutopright.style["width"] = (width/2).toString()+"px";
    logmenutopright.style["left"] = (width/2).toString()+"px";
    debuggerinput.style["width"] = width.toString()+"px";
    debuggerinput.style["top"] = (height+90).toString()+"px";
    debuggersendrecieve.style["top"] = (height+120).toString()+"px";
    debuggerpausebutton.style["top"] = (height+150).toString()+"px";
    debuggereval.style["width"] = (width-150).toString()+"px";
    debuggereval.style["top"] = (height+120).toString()+"px";},true);
 
 
function timeout123() {
    updateWssLog();
    EVENTLOOPFUNCTION();
    var now = Date.now();
    var keys = Object.keys(playerids);
    if(getroomslastcheck+3000<now){
        getroomslastcheck = now;
        if(inroom && savedrooms.length>0){
            Gdocument.getElementById("roomlistrefreshbutton").click();
        }
    }
    var namelist = Gdocument.getElementsByClassName("newbonklobby_playerentry_name");
    for(var i = 0;i<namelist.length;i++){
        var level = 0;
        var levelelement = 0;
        var pingelement = 0;
        var avatarelement = 0;
        var children = namelist[i].parentElement.children;
        for(var i2 = 0;i2<children.length;i2++){
            if(children[i2].className == "newbonklobby_playerentry_level"){
                levelelement = children[i2];
                level = parseInt(children[i2].textContent.slice(6));
            }
            else if(children[i2].className == "newbonklobby_playerentry_pingtext"){
                pingelement = children[i2];
            }
            else if(children[i2].className == "newbonklobby_playerentry_avatar"){
                avatarelement = children[i2];
            }
        }
        var isadmin = [false,0];
        for(var i3 = 0;i3<admins.length;i3++){
            if(admins[i3][0] == namelist[i].textContent){
                isadmin = [true,i3];
                break;
            }
        }
        if(level){
            if(isadmin[0]){
                namelist[i].style["color"] = "rgb("+admins[isadmin[1]][1].slice(0,-1).toString()+")";
                if(isadmin[1]<=3){
                    
                    
                    var rotatevalue = 0;
                    if(admins[isadmin[1]][1][3]<90){
                        rotatevalue = admins[isadmin[1]][1][3]/2;
                    }
                    else if(admins[isadmin[1]][1][3]<270){
                        rotatevalue =(180-admins[isadmin[1]][1][3])/2;
                    }
                    else if(admins[isadmin[1]][1][3]<360){
                        rotatevalue = (-360+admins[isadmin[1]][1][3])/2;
                    }
                    namelist[i].parentElement.style["filter"] = "hue-rotate("+rotatevalue.toString()+"deg)";
                    namelist[i].parentElement.style["font-size"] = "17px";
                    namelist[i].parentElement.style["background"] = "rgb("+[255-admins[isadmin[1]][1][0],255-admins[isadmin[1]][1][1],255-admins[isadmin[1]][1][2]].toString()+")";
                    if(levelelement){
                        levelelement.style["color"] = "rgb("+admins[isadmin[1]][1].slice(0,-1).toString()+")";
                    }
                    if(pingelement){
                        pingelement.style["color"] = "rgb("+admins[isadmin[1]][1].slice(0,-1).toString()+")";
                    }
                    if(avatarelement){
                        avatarelement.style["filter"] = "hue-rotate("+rotatevalue.toString()+"deg)";
                    }
                }
                
            }
        }
        var stylekeys = Object.keys(allstyles);
        for(var i3 = 0;i3<stylekeys.length;i3++){
            if(stylekeys[i3] == namelist[i].textContent){
                if(namelist[i].style["color"]!="rgb("+allstyles[stylekeys[i3]].toString()+")" && (allstyles[stylekeys[i3]][0]+allstyles[stylekeys[i3]][1]+allstyles[stylekeys[i3]][2]!=0 || !isadmin[0])){
                    var rgbvalue = [allstyles[stylekeys[i3]][0],allstyles[stylekeys[i3]][1],allstyles[stylekeys[i3]][2]];
                    namelist[i].style["color"] = "rgb("+rgbvalue.toString()+")";
                    if(!isadmin[0]){
                        var n = 255;
                        namelist[i].parentElement.style["background"] = "rgb("+[(203+rgbvalue[0])%n,(212+rgbvalue[1])%n,(215+rgbvalue[2])%n].toString()+")";
                    }
                    if(levelelement){
                        levelelement.style["color"] = "rgb("+rgbvalue.toString()+")";
                    }
                    if(pingelement){
                        pingelement.style["color"] = "rgb("+rgbvalue.toString()+")";
                    }
                }
            }
        }
    }
    for(var i3 = 0;i3<admins.length;i3++){
        if(admins[i3][1][0]==0 && admins[i3][1][1]==0 && admins[i3][1][2]==0){
            admins[i3][1][2] = 180;
            admins[i3][1][1] = 0;
            admins[i3][1][0] = 0;
        }
        var rate = 5;
        var lowest = 0;
        var number = 360;
        admins[i3][1][3] = (admins[i3][1][3]%number+4+number)%number;
        
        if(admins[i3][1][0]>lowest && admins[i3][1][1] == lowest){
            admins[i3][1][0]-=rate;
            admins[i3][1][2]+=rate;
        }
        if(admins[i3][1][2]>lowest && admins[i3][1][0] == lowest){
            admins[i3][1][2]-=rate;
            admins[i3][1][1]+=rate;
        }
        if(admins[i3][1][1]>lowest && admins[i3][1][2] == lowest){
            admins[i3][1][0]+=rate;
            admins[i3][1][1]-=rate;
        }
        for(var i4 = 0;i4<3;i4++){
            if(admins[i3][1][i4]<lowest){
                admins[i3][1][i4]=lowest;
            }
            else if(admins[i3][1][i4]>255){
                admins[i3][1][i4]=255;
            }
        }
    }
    if(randomchat){
        if(randomchat_timestamp+randomchat_randomtimestamp<now){
            randomchat_timestamp = now;
            randomchat_randomtimestamp = 2000+Math.random()*2000;
            var randnumber = Math.floor(Math.random()*randomchatpriority[0])-randomchatlastmessage[1];
            for(var i = 0;i<randomchatpriority[1].length;i++){
                if(randomchatpriority[1][i][0]!=randomchatlastmessage[0]){
                    randnumber-=randomchatpriority[1][i][1];
                    if(randnumber<=0){
                        chat(flag_manage(randomchatpriority[1][i][0]));
                        randomchatpriority[1][i][1]+=2;
                        randomchatpriority[0]+=2;
                        randomchatlastmessage = randomchatpriority[1][i];
                        break;
                    }
                }
            }
        }
    }
    for(var i = 0;i<keys.length;i++){
        if(autokickbantimestamp+500<now && keys[i]!=myid && !playerids[keys[i]]?.commands && autokickban>0 && playerids[keys[i]].peerID!="sandbox" && ishost && playerids[keys[i]].ratelimit.join+750<now){
            SEND('42[9,{"banshortid":'+keys[i].toString()+',"kickonly":'+(autokickban == 1).toString()+'}]');
            autokickbantimestamp = now;
        }
        
        if(playerids[keys[i]].playerData){
            if(playerids[keys[i]].playerData2){
                if(playerids[keys[i]].playerData.transform){
                    playerids[keys[i]].playerData2.alive = true;
                    if(playerids[keys[i]].playerData2.timeStamp == 0){
                        playerids[keys[i]].playerData2.px = playerids[keys[i]].playerData.transform.position.x;
                        playerids[keys[i]].playerData2.py = playerids[keys[i]].playerData.transform.position.y;
                        playerids[keys[i]].playerData2.timeStamp = performance.now();
                    }
                    else{
                        playerids[keys[i]].playerData2.xvel = (playerids[keys[i]].playerData2.px - playerids[keys[i]].playerData.transform.position.x)/(playerids[keys[i]].playerData2.timeStamp-performance.now());
                        playerids[keys[i]].playerData2.yvel = (playerids[keys[i]].playerData2.py - playerids[keys[i]].playerData.transform.position.y)/(playerids[keys[i]].playerData2.timeStamp-performance.now());
                        playerids[keys[i]].playerData2.px = playerids[keys[i]].playerData.transform.position.x;
                        playerids[keys[i]].playerData2.py = playerids[keys[i]].playerData.transform.position.y;
                        playerids[keys[i]].playerData2.timeStamp = performance.now();
                    }
                    if(playerids[keys[i]].playerData2.timeStamp2 == 0){
                        playerids[keys[i]].playerData2.pvx = playerids[keys[i]].playerData2.xvel;
                        playerids[keys[i]].playerData2.pvy = playerids[keys[i]].playerData2.yvel;
                        playerids[keys[i]].playerData2.timeStamp2 = performance.now();
                    }
                    else{
                        playerids[keys[i]].playerData2.xacc = (playerids[keys[i]].playerData2.pvx - playerids[keys[i]].playerData2.xvel)/((playerids[keys[i]].playerData2.timeStamp2-performance.now()));
                        playerids[keys[i]].playerData2.yacc = (playerids[keys[i]].playerData2.pvy - playerids[keys[i]].playerData2.yvel)/((playerids[keys[i]].playerData2.timeStamp2-performance.now()));
                        playerids[keys[i]].playerData2.pvx = playerids[keys[i]].playerData2.xvel;
                        playerids[keys[i]].playerData2.pvy = playerids[keys[i]].playerData2.yvel;
                        playerids[keys[i]].playerData2.timeStamp2 = performance.now();
                    }
                }
                else{
                    if(playerids[keys[i]].playerData2.alive){
 
                    }
                    playerids[keys[i]].playerData2.alive = false;
                }
            }
            else{
                playerids[keys[i]].playerData2 = {alive:true,radius:12,timeStamp:0,timeStamp2:0,px:0,py:0,pvx:0,pvy:0,xacc:0,yacc:0,xvel:0,yvel:0,balance:0};
            }
        }
    }
    
    for(var i = 0;i<keys.length;i++){
        if(!playerids[keys[i]].playerData2){
            playerids[keys[i]].playerData2 = {alive:true,radius:12,timeStamp:0,timeStamp2:0,px:0,py:0,pvx:0,pvy:0,xacc:0,yacc:0,xvel:0,yvel:0,balance:0};
        }
    }
    if(Gdocument.getElementById("redefineControls_table").children[0].children.length<=1 && keys.length>0){
        Gdocument.getElementById("pretty_top_settings").click();
        Gdocument.getElementById("settings_close").click();
    }
    if(pollactive[0] && pollactive[2]<now && ishost){
        playerids[myid].ratelimit.poll = Date.now();
        SEND("42"+JSON.stringify([4,{"type":"poll end","from":username}]));
        var count = [0,0,0,0];
        var keys = Object.keys(playerids);
        for(var i = 0;i<keys.length;i++){
            if(playerids[keys[i]].vote.poll!=-1 && playerids[keys[i]].vote.poll<pollactive[3].length-1){
                count[playerids[keys[i]].vote.poll]++;
            }
            playerids[keys[i]].vote.poll = -1;
        }
        displayInChat("The poll ended due to time.","#DA0808","#1EBCC1");
        for(var i = 0;i<count.length;i++){
            if(count[i]>1){
                displayInChat(count[i].toString()+" people voted for option "+letters[i]+".","#DA0808","#1EBCC1");
            }
            if(count[i]==1){
                displayInChat(count[i].toString()+" person voted for option "+letters[i]+".","#DA0808","#1EBCC1");
            }
        }
        displayInChat("The poll was:","#DA0808","#1EBCC1");
        for(var i = 0;i<pollactive[3].length;i++){
            displayInChat(letters[i]+") "+pollactive[3][i],"#DA0808","#1EBCC1");
        }
        pollactive = [false,0,0,[]];
    }
    if(!ishost && sandboxcopyme!=-1){
        sandboxcopyme = -1;
    }
    
    if(afkkill>0 && ishost){
        var keys = Object.keys(playerids);
        currentFrame = Math.floor((now - gameStartTimeStamp)/1000*30);
        for(var i = 0; i<keys.length;i++){
            if(typeof(playerids[keys[i]].lastmove)=="undefined"){
                playerids[keys[i]].lastmove = now;
            }
            else{
                if(playerids[keys[i]].playerData2?.alive && now-playerids[keys[i]].lastmove>=afkkill*1000 && now-gameStartTimeStamp>=afkkill*1000 && !killedids.includes(keys[i])){
                    killedids.push(keys[i]);
                    SEND('42[25,{"a":{"playersLeft":['+keys[i]+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                    RECIEVE('42[31,{"a":{"playersLeft":['+keys[i]+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                    break;
                }
            }
        }
    }
    if(ishost && Gdocument.getElementById("maploadtypedropdowntitle").textContent == "MAP REQUESTS"){
        clearmaprequests.style["display"] = "block";
        refreshmaprequests.style["display"] = "block";
    }
    else{
        clearmaprequests.style["display"] = "none";
        refreshmaprequests.style["display"] = "none";
    }
    if(Gdocument.getElementById("gamerenderer").style["visibility"]=="hidden"){
       Gdocument.getElementById("ingamewinner_scores").style["visibility"] = "unset";
       Gdocument.getElementById("ingamechatcontent").style["max-height"]=chatheight.toString()+"px";
       pan = {"x":0,"y":0};
    }
    if(Gdocument.getElementById("maploadwindowmapscontainer").children.length>0 && maponclick == 0){
        maponclick = Gdocument.getElementById("maploadwindowmapscontainer").children[0].onclick;
    }
    
    if((Gdocument.getElementById("sm_connectingContainer").style["visibility"] == "hidden" || Gdocument.getElementById("sm_connectingContainer").style["visibility"] == "") && (Gdocument.getElementById("roomlistcreatewindowcontainer").style["visibility"] == "hidden" || Gdocument.getElementById("roomlistcreatewindowcontainer").style["visibility"] == "")){
        var chatbox = Gdocument.getElementById("newbonklobby_chat_content");
        while (chatbox.firstChild) {
            chatbox.removeChild(chatbox.firstChild);
        }
        chatbox = Gdocument.getElementById("ingamechatcontent");
        while (chatbox.firstChild) {
            chatbox.removeChild(chatbox.firstChild);
        }
        rcaps_flag = false;
        space_flag = false;
        number_flag = false;
        reverse_flag = false;
        autocorrect = false;
        translating2 = [false,""];
        translating = [false,""];
        echo_list = [];
        scroll = false;
        FollowCam = false;
        autocam = false;
        aimbot = false;
        recievedinitdata = false;
        zoom = 1;
        zoom2 = 1;
        newzoom = 1;
        newzoom2 = 1;
        FFA = true;
        mode = "b";
        ghostroomwss = -1;
        heavybot = false;
        stopquickplay = 1;
        roundsperqp = 1;
        roundsperqp2 = 0;
        staystill = false;
        staystillpos = [0,0];
        recording = false;
        recordingid = -1;
        reverseqp = false;
        jointeam = -1;
        currentroomaddress = -1;
        checkboxhidden = false;
        freejoin = false;
        shuffle = false;
        textmode = -1;
        defaultmode = "";
        recmodebool = false;
        recteams = false;
        autorecord = false;
        pollactive = [false,0,0,[]];
        pollactive2 = [false,0,[]];
        afkkill = -1;
        nextafter = 0;
        jointext = "";
        ishost = false;
        parentDraw = 0;
        sandboxplayerids = {};
        sandboxcopyme = -1;
        wintext = "";
        sandboxon = false;
        sandboxid = 200;
        disabledkeys = [];
        myid = -1;
        randomchat = false;
        savedroombutton.className = "brownButton brownButton_classic buttonShadow brownButtonDisabled";
        randomchatpriority = [0,[]];
        randomchatlastmessage = ["",0];
        autokickbantimestamp = 0;
        autokickban = 0;
        inroom = false;
        causelag = false;
        causelag2 = 0;
        jukeboxplayerURL = "";
        jukeboxplayer.src = "";
        jukeboxplayervolume = 20;
        allstyles = {};
        pan = {"x":0, "y":0};
        if(!bonkwss){
            playerids = {};
        }
 
        qppaused = false;
        nextafterbuffer = -1;
        hostid = -1;
        if(chatlog[chatlog.length-1]!="ROOM END"){
            chatlog.push("ROOM END");
        }
    }
    else{
        if(chatlog[chatlog.length-1]=="ROOM END"){
            chatlog.push("ROOM START");
        }
        
    }
 
    if(Gdocument.getElementById("newbonklobby").style["display"]=="block"){
        Gdocument.getElementById("ingamechatinputtext").style["visibility"]="hidden";
    }
    else{
        Gdocument.getElementById("ingamechatinputtext").style["visibility"]="visible";
 
    }
    if((myid == hostid && myid!=-1) || Gdocument.getElementsByClassName('newbonklobby_settings_button brownButton brownButton_classic buttonShadow brownButtonDisabled').length == 0){
        ishost = true;
    }
    else{
        ishost = actuallyhost;
    }
 
    if(Gdocument.getElementById("pretty_top_name")!=null){
        username = Gdocument.getElementById("pretty_top_name").textContent;
        if(myid!=-1){
            username = playerids[myid].userName;
        }
    }
    try{
        Last_message = lastmessage()
    } catch{
        Last_message = "";
    }
    if (Laster_message != Last_message){
        Laster_message = Last_message;
        if(changed_chat==false){
            new_message = true;
        }
        else{
            changed_chat = false;
        }
    }
    if(new_message){
        chatlog.push(Last_message);
        var lm = "";
        try{
            lm = Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children;
            if(typeof(lm[0].parentElement.style["parsed"]) == 'undefined'){
                if (lm[0].className == "newbonklobby_chat_msg_colorbox"){
                    lm[2].innerHTML = urlify(lm[2].innerHTML);
                    Laster_message = lastmessage();
                    lm[0].parentElement.style["parsed"] = true;
                }
                if (lm[0].className == "newbonklobby_chat_status"){
                    lm[0].innerHTML = urlify(lm[0].innerHTML);
                    Laster_message = lastmessage();
                    lm[0].parentElement.style["parsed"] = true;
                }
            }
        }
        catch{
            lm = "";
        }
 
        if(Last_message.indexOf("@"+username)!=-1 && npermissions == 1){
            if(Notification.requestPermission()){
                var n = new Notification(Last_message);
            }
        }
 
        try{
            lm = Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children;
            if(typeof(lm[0].parentElement.style["parsed"])=='undefined'){
                if(lm[0].className == "ingamechatname"){
                    lm[1].innerHTML = urlify(lm[1].innerHTML);
                    Laster_message = lastmessage();
                    lm[0].parentElement.style["parsed"] = true;
                }
                if(lm[0].className == ""){
                    lm[0].innerHTML = urlify(lm[0].innerHTML);
                    Laster_message = lastmessage();
                    lm[0].parentElement.style["parsed"] = true;
                }
            }
        }
        catch{
            lm = "";
        }
        
        if(text2speech){
            if(!sayer.speaking){
                if(Last_message.includes(":  ")){
                    speech.text = Last_message.substring(0,Last_message.indexOf(":")).toLowerCase();
                    speech.rate = 2.25;
                    sayer.speak(speech);
                    speech.text = Last_message.substring(Last_message.indexOf(":  ")+3).toLowerCase();
                    speech.rate = 1.25;
                    sayer.speak(speech);
                }
                else{
                    speech.text = Last_message.toLowerCase();
                    sayer.speak(speech);
                }
            }
        }
    }
    if (ishost==true && new_message){
        for(i=0;i<banned.length;i++){
            if(Last_message.startsWith("* "+banned[i]+" has joined the game")){
                chat2("/kick '"+banned[i]+"'");
            }
        }
    }
    if(Gdocument.getElementById("gamerenderer").style["visibility"] == "hidden" && ishost){
        roundsperqp2 = 0;
    }
    if(Gdocument.getElementById("ingamewinner").style["visibility"]=="inherit" && ishost){
        if(Gdocument.getElementById("ingamewinner").style["parsed"] != true){
            if(stopquickplay!=1){
                roundsperqp2++;
            }
            if(autorecord){
                Gdocument.getElementById("pretty_top_replay").click();
            }
        }
        if(Gdocument.getElementById("ingamewinner").style["parsed"] != true && wintext!="" && Gdocument.getElementById("ingamewinner_bottom").textContent!="DRAW"){
            chat(flag_manage(wintext.replaceAll("username",Gdocument.getElementById("ingamewinner_top").textContent)));
        }
        Gdocument.getElementById("ingamewinner").style["parsed"] = true;
    }
    else{
        Gdocument.getElementById("ingamewinner").style["parsed"] = false;
    }
    if(ishost && stopquickplay == 0){
        if(checkboxhidden){
            checkboxhidden = false;
            var classes = Gdocument.getElementsByClassName("quickplaycheckbox");
            for(var i = 0; i<classes.length;i++){
                classes[i].style["display"] = "block";
                classes[i].className = "quickplaycheckbox quickplaychecked";
            }
            Gdocument.getElementById('clearallcheckboxes').style["display"] = "block";
 
        }
        if(nextafter>0 && gameStartTimeStamp+nextafter*1000<=now && Gdocument.getElementById("gamerenderer").style["visibility"] != "hidden" && dontswitch == false && Gdocument.getElementById("ingamewinner").style["visibility"]!="inherit" && !qppaused){
            roundsperqp2 = 0;
            if(shuffle){
                var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                var available = [];
                var availableindexes = [];
                var notempty = false;
                for(var i = 0; i<e.length;i++){
                    var a = false;
                    [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                    available.push(a);
                    if(a){
                        availableindexes.push(i);
                        notempty = true;
                    }
                }
                if(notempty){
 
                    if(availableindexes.length!=1){
                        availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                    }
                    quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                }
            }
            else{
                var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                var available = [];
                var availableindexes = [];
                var notempty = false;
                for(var i = 0; i<e.length;i++){
                    var a = false;
                    [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                    available.push(a);
                    if(a){
                        availableindexes.push(i);
                        notempty = true;
                    }
                }
                if(notempty){
                    var above = [];
                    for(var i = 0;i<availableindexes.length;i++){
                        if(availableindexes[i]>quicki && !reverseqp){
                            above.push(availableindexes[i]);   
                        }
                        else if(availableindexes[i]<quicki && reverseqp){
                            above.push(availableindexes[i]);  
                        }
                    }
                    if(above.length>0){
                        quicki = above[0];
                        if(reverseqp){
                            above[above.length-1];
                        }
                    }
                    else{
                        quicki = availableindexes[0];
                        if(reverseqp){
                            quicki = availableindexes[availableindexes.length-1];
                        }
                    }
                }
            }
            startedinqp = true;
            dontswitch = true;
            gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
        }
        if(Gdocument.getElementById("ingamewinner").style["visibility"]=="inherit" && dontswitch == false && !document.hidden && !qppaused){
            if(roundsperqp2>=roundsperqp){
                if(shuffle){
                    var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                    var available = [];
                    var availableindexes = [];
                    var notempty = false;
                    for(var i = 0; i<e.length;i++){
                        var a = false;
                        [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                        available.push(a);
                        if(a){
                            availableindexes.push(i);
                            notempty = true;
                        }
                    }
                    if(notempty){
 
                        if(availableindexes.length!=1){
                            availableindexes.splice(availableindexes.indexOf(quicki%Gdocument.getElementById("maploadwindowmapscontainer").children.length),1);
                        }
                        quicki = availableindexes[Math.floor(Math.random()*availableindexes.length)];
                    }
                }
                else{
                    var e = Gdocument.getElementById("maploadwindowmapscontainer").children;
                    var available = [];
                    var availableindexes = [];
                    var notempty = false;
                    for(var i = 0; i<e.length;i++){
                        var a = false;
                        [...e[i].children].forEach(function(e1){if(e1.className=="quickplaycheckbox quickplaychecked"){a = e1.checked}});
                        available.push(a);
                        if(a){
                            availableindexes.push(i);
                            notempty = true;
                        }
                    }
                    if(notempty){
                        var above = [];
                        for(var i = 0;i<availableindexes.length;i++){
                            if(availableindexes[i]>quicki && !reverseqp){
                                above.push(availableindexes[i]);   
                            }
                            else if(availableindexes[i]<quicki && reverseqp){
                                above.push(availableindexes[i])
                            }
                        }
                        if(above.length>0){
                            quicki = above[0];
                            if(reverseqp){
                                quicki = above[above.length-1];
                            }
                        }
                        else{
                            quicki = availableindexes[0];
                            if(reverseqp){
                                quicki = availableindexes[availableindexes.length-1];
                            }
 
                        }
                    }
                }
            }
            transitioning = true;
            startedinqp = true;
            map(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length)); 
            dontswitch = true;
            setTimeout(function(){Gdocument.getElementById("ingamewinner").style["visibility"]="hidden"; dontswitch = false;},timedelay);
 
        }
    }
    else{
        if(!checkboxhidden){
            checkboxhidden = true;
            var classes = Gdocument.getElementsByClassName("quickplaycheckbox");
            for(var i = 0; i<classes.length;i++){
                classes[i].style["display"] = "none";
                classes[i].className = "quickplaycheckbox quickplayunchecked";
            }
            Gdocument.getElementById('clearallcheckboxes').style["display"] = "none";
        }
    }
    new_message = false;
};
});
