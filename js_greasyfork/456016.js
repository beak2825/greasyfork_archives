// ==UserScript==
// @name         Bonk Commands
// @namespace    https://greasyfork.org/en/scripts/451341-bonk-commands
// @version      7.9
// @description  Adds lots of commands to bonk.io. Type /? or /help in bonk chat to get started.
// @author       LEGENDBOSS123 + left paren + mastery3
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/456016/Bonk%20Commands.user.js
// @updateURL https://update.greasyfork.org/scripts/456016/Bonk%20Commands.meta.js
// ==/UserScript==
function BonkCommandsScriptInjector(f){
    if(window.location == window.parent.location){
        if(document.readyState == "complete"){f();}
        else{document.addEventListener('readystatechange',function(){setTimeout(f,1500);});}
    }
}
 
BonkCommandsScriptInjector(function(){
var scope = window;
 
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
    for (var i = 0; i < 100000; i++){
        clearInterval(i);
    }
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
 
scope.GENERATE_KEYS = function(){
    interval = [];
    for(var i = 100;i<301;i++){
        interval.push(i);
    }
    random_prime = [GENERATE_PRIME_NUMBER(0,0,choices = interval),0];
    interval.splice(interval.indexOf(random_prime[0]),1);
    random_prime[1] = GENERATE_PRIME_NUMBER(0,0,choices = interval);
 
    n = random_prime[0]*random_prime[1];
    n2 = (random_prime[0]-1)*(random_prime[1]-1);
 
    e = GENERATE_COPRIME_NUMBER(2,n2-1,n2);
    d = 0;
    redo = true;
    for(var i = 0;i<1000000;i++){
        if((e*i-1)%n2 == 0 && i!=e){
            d = i;
            redo = false;
            break;
        }
    }
    if(redo){
        return GENERATE_KEYS();
    }
    else{
        return [[n,e],[n,d]];
    }
 
};
scope.CRYPT_NUMBER = function(key, data){
 
    result = 1;
 
    for(var i = 0;i<key[1];i++){
        result*=data;
        result = result%key[0];
    }
    return result%key[0];
 
};
 
scope.CRYPT_MESSAGE = function(key,data){
    var resulttext = [];
    for(var i = 0;i<data.length;i++){
        resulttext.push(CRYPT_NUMBER(key,data[i]));
    }
    return resulttext;
 
};
 
if(typeof(scope.originalSend)=='undefined'){scope.originalSend = Gwindow.WebSocket.prototype.send;}
if(typeof(scope.bonkwss)=='undefined'){scope.bonkwss = 0;}
if(typeof(scope.chatlog)=='undefined'){scope.chatlog = ["ROOM START"];}
if(typeof(scope.sandboxon)=='undefined'){scope.sandboxon = false;}
if(typeof(scope.sandboxid)=='undefined'){scope.sandboxid = 1;}
if(typeof(scope.playerids)=='undefined'){scope.playerids = {};}
if(typeof(scope.pingids)=='undefined'){scope.pingids = {};}
if(typeof(scope.sandboxplayerids)=='undefined'){scope.sandboxplayerids = {};}
if(typeof(scope.originalMapLoad)=='undefined'){scope.originalMapLoad = Gdocument.getElementById("maploadwindowmapscontainer").appendChild;}
if(typeof(scope.originalLobbyChat)=='undefined'){scope.originalLobbyChat = Gdocument.getElementById("newbonklobby_chat_content").appendChild;}
if(typeof(scope.originalIngameChat)=='undefined'){scope.originalIngameChat = Gdocument.getElementById("ingamechatcontent").appendChild;}
if(typeof(scope.private_chat_keys)=='undefined'){scope.private_chat_keys = GENERATE_KEYS();scope.private_key = private_chat_keys[0];scope.public_key = private_chat_keys[1];}
function sandboxonclick(){
    Gdocument.getElementById("roomlistcreatewindowmaxplayers").value = 1;
    Gdocument.getElementById("roomlistcreatewindowunlistedcheckbox").checked = true;
    Gdocument.getElementById("roomlistcreatecreatebutton").click();
    sandboxon = true;
}
 
function checkboxclearbuttononclick(){
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
}
 
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
    checkboxclearbutton.textContent = "CLEAR ALL";
    checkboxclearbutton.style["position"] = "absolute";
    checkboxclearbutton.style["display"] = "none";
    if(typeof(ishost)!='undefined'){
        if(ishost && stopquickplay == 0){
            checkboxclearbutton.style["display"] = "block";
        }
    }
    checkboxclearbutton.style["right"] = "260px";
    checkboxclearbutton.style["top"] = "57px";
    checkboxclearbutton.style["height"] = "23px";
    checkboxclearbutton.style["width"] = "70px";
    checkboxclearbutton.style["line-height"] = "23px";
    checkboxclearbutton.style["font-size"] = "14px";
    checkboxclearbutton.addEventListener("click",checkboxclearbuttononclick);
    Gdocument.getElementById("maploadwindow").insertBefore(checkboxclearbutton,Gdocument.getElementById("maploadwindowsearchinput"));
 
}
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
            args.children[0].textContent = args.children[0].textContent.substring(0,args.children[0].textContent.length-19)+" has been kicked from the game ";
        }
    }
    originalLobbyChat.call(this,args);
};
Gdocument.getElementById("ingamechatcontent").appendChild = function(args){
    if(beenKickedTimeStamp+100>Date.now() && args.children.length>0){
        if(args.children[0].textContent.endsWith(" has left the game.") && args.children[0].textContent.startsWith("* ")){
            args.children[0].textContent = args.children[0].textContent.substring(0,args.children[0].textContent.length-19)+" has been kicked from the game.";
        }
    }
    if(recordedTimeStamp+100>Date.now() && args.children.length>0){
        if(args.children[0].textContent.includes("seconds") && args.children[0].textContent.startsWith("* ")){
            args.children[0].textContent = args.children[0].textContent + " - " + playerids[recordedId]
        }
    }
    originalIngameChat.call(this,args);
};
Gwindow.WebSocket.prototype.send = function(args) {
    if(this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")){
        bonkwss = this;
        if(args.startsWith('42[26,')){
            if(sandboxon){
                var jsonargs = JSON.parse(args.substring(2))[1];
                if(typeof(sandboxplayerids[jsonargs["targetID"]])!='undefined'){
                    RECIEVE('42[18,'+jsonargs["targetID"]+','+jsonargs["targetTeam"]+']');
 
                }
            }
        }
 
        if(args.startsWith('42[4,')){
            var jsonargs = JSON.parse(args.substring(2));
            if(sandboxcopyme && typeof(jsonargs[1]["type"])=="undefined"){
                var jsonkeys = Object.keys(sandboxplayerids);
                for(var i = 0; i<jsonkeys.length;i++){
                    RECIEVE('42[7,'+jsonkeys[i].toString()+','+JSON.stringify(jsonargs[1])+']');
                }
            }
            args = "42"+JSON.stringify(jsonargs);
        }
 
        if(args.startsWith('42[5,')){
            var jsonargs = JSON.parse(args.substring(2));
 
            if(stopquickplay!=1){
                jsonargs[1]["gs"]["wl"] = 999;
            }
 
            args = "42"+JSON.stringify(jsonargs);
        }
 
    }
    if(this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=") && !this.injected){
        this.injected = true;
 
        var originalRecieve = this.onmessage;
        this.onmessage = function(args){
            if(args.data.startsWith('42[24,')){
                beenKickedTimeStamp = Date.now();
            }
            if(args.data.startsWith('42[32')){
                SEND('42[4,{"type":"inactive kick counter"}]');
                RECIEVE('42[7,{"type":"inactive kick counter"}]');
            }
            if(args.data.startsWith('42[40,')){
                recordedTimeStamp = Date.now();
                recordedId = JSON.parse(args.data.substring(2))[1];
            }
            if(args.data.startsWith('42[1,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                SEND('42[1,{"id":'+jsonargs[2]+'}]');
                pingids = jsonargs[1];
            }
            if(args.data.startsWith('42[3,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                for(var i = 0; i<jsonargs[3].length;i++){
                    if(jsonargs[3][i]!=null){
                        playerids[i.toString()] = jsonargs[3][i]["userName"];
                    }
                }
            }
            if(args.data.startsWith('42[15,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                gameStartTimeStamp = jsonargs[1];
            }
            if(args.data.startsWith('42[7,')){
                var jsonargs2 = JSON.parse(args.data.substring(2));
                var idofpacket = jsonargs2[1];
                jsonargs = jsonargs2[2];
                if(typeof(jsonargs["type"]) != "undefined"){
 
                    if(jsonargs["type"]=="private chat" && jsonargs["to"] == username){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket];
                        }
                        if(!ignorepmlist.includes(from)){
                            if(typeof(jsonargs["message"])=="object" && typeof(jsonargs["password"]) == "object"){
                                if(public_key[0]==jsonargs["public key"][0] && public_key[1]==jsonargs["public key"][1]){
                                    if(jsonargs["password"].length<=25){
                                        var password = CRYPT_MESSAGE(private_key,jsonargs["password"]);
                                        var decodedtext = jsonargs["message"].slice(0,400);
                                        var encodedtext = "";
                                        for(var i=0;i<decodedtext.length;i++){
                                            if(password[i%password.length]<1000){
                                                encodedtext+=String.fromCharCode(password[i%password.length]^decodedtext[i]);
                                            }
                                        }
                                        var code = 'Gwindow.private_chat = "'+from+'"; Gwindow.SEND("42"+JSON.stringify([4,{"type":"request public key","from":Gwindow.username,"to":Gwindow.private_chat}])); Gwindow.request_public_key_time_stamp = Date.now(); setTimeout(function(){if(Gwindow.private_chat_public_key[0]!=Gwindow.private_chat){Gwindow.displayInChat("Failed to connect to "+Gwindow.private_chat+".","#DA0808","#1EBCC1");Gwindow.private_chat = Gwindow.private_chat_public_key[0];}},1600);';
                                        displayInChat('> '+'<a onclick = \''+code+'\' style = "color:green;" href = "javascript:void(0);">'+from+'</a>'+': ',"#DA0808","#1EBCC1",{sanitize:false},encodedtext);
 
                                        Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true;
                                        Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true;
 
                                        Laster_message = lastmessage();
 
 
 
                                    }
                                }
                                else{
                                    SEND("42"+JSON.stringify([4,{"type":"public key correction","from":username,"to":private_chat_public_key[0],"public key":public_key}]));
                                }
                            }
                        }
                    }
 
                    if(jsonargs["type"]=="request public key" && jsonargs["to"] == username){
                        SEND("42"+JSON.stringify([4,{"type":"public key","from":username,"public key":public_key}]));
                    }
                    if(jsonargs["type"]=="private chat users" && pmuserstimestamp+1500>Date.now()){
 
                        if(typeof(jsonargs["from"])!='undefined'){
                            from = jsonargs["from"];
                            if(Object.keys(playerids).includes(idofpacket.toString())){
                                from = playerids[idofpacket];
                            }
                            if(!pmusers.includes(from) && username == jsonargs["to"]){
                                pmusers.push(from);
                            }
                        }
                    }
                    if(jsonargs["type"]=="request private chat users"){
                        if(typeof(jsonargs["from"])!='undefined'){
                            from = jsonargs["from"];
                            if(Object.keys(playerids).includes(idofpacket.toString())){
                                from = playerids[idofpacket];
                            }
                            SEND("42"+JSON.stringify([4,{"type":"private chat users","from":username,"to":from}]));
                        }
                    }
                    if(jsonargs["type"]=="public key" && request_public_key_time_stamp+1500>Date.now()){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket];
                        }
                        if(from == private_chat){
                            private_chat_public_key = [private_chat,jsonargs["public key"]];
                            displayInChat("Private chatting with "+private_chat+".","#DA0808","#1EBCC1");
                        }
 
                    }
                    if(jsonargs["type"]=="public key correction" && private_chat_public_key[0] == private_chat){
                        from = jsonargs["from"];
                        if(Object.keys(playerids).includes(idofpacket.toString())){
                            from = playerids[idofpacket];
                        }
                        if(from == private_chat){
                            private_chat_public_key = [private_chat,jsonargs["public key"]];
                            var text = pmlastmessage;
                            var password = [];
                            for(var i = 0;i<10;i++){
                                password.push(Math.floor(Math.random()*100+50));
                            }
                            var text2 = [];
                            for(var i = 0;i<text.length ;i++){
                                text2.push(password[i%password.length]^text.slice(0,400).charCodeAt(i));
                            }
                            SEND("42"+JSON.stringify([4,{"type":"private chat","from":username,"to":private_chat,"public key":private_chat_public_key[1],"message":text2,"password":CRYPT_MESSAGE(private_chat_public_key[1],password)}]));
                        }
                    }
 
                }
                else{                    
                    gameStartTimeStamp = Date.now()-1000*jsonargs["f"]/30;
 
                }
            }
 
            if(args.data.startsWith('42[4,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                playerids[jsonargs[1]] = jsonargs[3];
 
            }
            if(args.data.startsWith('42[5,')){
                var jsonargs = JSON.parse(args.data.substring(2));
                if(typeof(playerids[jsonargs[1]])!='undefined'){
                    delete playerids[jsonargs[1]];
                }
            }
            return originalRecieve.call(this,args);
        };
 
        var originalClose = this.onclose;
        this.onclose = function () {
            window.bonkwss = 0;
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
Gdocument.getElementById("ingamechatcontent").style["pointer-events"]="all";
Gdocument.getElementById("ingamechatcontent").style["max-height"]="250px";
Gdocument.getElementById("ingamechatcontent").style["height"]="128px";
Gdocument.getElementById("ingamechatbox").style["height"]="250px";
 
document.getElementById('adboxverticalCurse').style["display"] = "none";
document.getElementById('adboxverticalleftCurse').style["display"] = "none";
 
 
scope.comandosplus = 0;
scope.dontswitch = false;
scope.username = 0;
scope.timedelay = 1400;
scope.ishost = false;
scope.checkboxhidden = true;
scope.quicki=0;
scope.defaultmode = "d";
scope.recmodebool = false;
scope.shuffle = false;
scope.freejoin = false;
scope.recordedTimeStamp = 0;
scope.recordedId = 0;
scope.beenKickedTimeStamp = 0;
scope.stopquickplay = 1;
scope.currentFrame = 0;
scope.gameStartTimeStamp = 0;
scope.canceled = false;
scope.banned = [];
scope.transitioning = false;
scope.echo_list = [];
scope.message = "";
scope.mode = "";
scope.private_chat = "";
scope.private_chat_public_key = ["",[0,0]];
scope.users = [];
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
scope.request_public_key_time_stamp = 0;
scope.sandboxcopyme = false;
scope.help = ["All the commands are:","/help","/?","/advhelp [command]","/space","/rcaps","/number","/echo [username]","/clearecho","/remove [username]","/chatw [username]","/msg [text]","/ignorepm [username]","/pmusers","/eval [code]","/lobby","/team [letter]","/scroll","/hidechat","/showchat","/notify","/stopnotify","Host commands are:","/startqp","/stopqp","/next","/previous","/shuffle","/freejoin","/recmode","/defaultmode [mode]","/start","/balanceA [number]","/moveA [letter]","/rounds [number]","/mode [mode]","/ban [username]","/kill [username]","Sandbox commands are:","/addplayer [number]","/delplayer [number]","/copyme","/randmode","Hotkeys are:","Alt L","Alt C","Host hotkeys are:","Alt S","Alt T","Alt E","Alt K","Alt M","Alt Q","Alt A","Alt D","Alt F","Alt R"];
 
scope.adv_help = {"help":"Shows all command names.",
                "?":"Shows all command names.",
                "advhelp":"Shows a command in detail.",
                "space":"Toggles space. When space is on, whatever you type will be spaced apart.",
                "rcaps":"Toggles rcaps. When rcaps is on, each letter will randomly get capitalized.",
                "number":"Toggles number. When number is on, 'a' becomes 4, 'e' becomes 3, 's' becomes 5, 'o' becomes 0, 'l' and 'i' become 1.",
                "echo":"Echoes a username. It copies the username's chat messages.",
                "remove":"Removes username from echo list. You will not echo that username anymore.",
                "clearecho":"Clears echo list. You will not echo anyone anymore.",
                "chatw":"It private chats with username. Type /msg to message that username.",
                "msg":"Messages with what username you are chatting with. Type /chatw to chat with a username.",
                "ignorepm":"Ignores the username's private chat messages. To unignore, type /ignorepm [username].",
                "pmusers":"Dispays who you can private chat with.",
                "eval":"Evaluates code. Only use this if you are experienced in javascript.",
                "lobby":"Makes lobby visible when you are ingame. Type /lobby again to close lobby.",
                "team":"Joins a specific team. 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "scroll":"Toggles a scrollbar in ingame chat.",
                "hidechat":"Hides ingame chat. Type /showchat to show it again.",
                "showchat":"Shows ingame chat. /hidechat hides the chat.",
                "notify":"You will be notified if a person types @MYUSERNAME",
                "stopnotify":"You will not be notified if a person types @MYUSERNAME",
                "startqp":"Starts cycling maps in your map menu.",
                "stopqp":"Stops cycling maps in your map menu.",
                "next":"Skips the map. Usable only with /startqp.",
                "previous":"Goes to previous map. Usable only with /startqp.",
                "shuffle":"Makes quickplay play random maps instead of in order.",
                "freejoin":"Toggles freejoin. If freejoin is on, starts the game instantly if there are 1 or less players currently playing.",
                "recmode":"In quickplay, it switches mode to recommended mode, according to editor.",
                "defaultmode":"Switches mode to defaultmode if there is no recmode.",
                "start":"Starts game instantly.",
                "balanceA":"Balances everyone with balance number.",
                "moveA":"Sets everyones team. 'r' = red, 'b' = blue, 'g' = green, 'y' = yellow, and 's' = spectate.",
                "rounds":"Sets rounds to win.",
                "mode":"Switches modes.",
                "ban":"Bans username from lobby. If they rejoin, it automatically bans.",
                "kill":"Kills the person ingame.",
                "addplayer":"In sandbox, it adds players.",
                "delplayer":"In sandbox, it deletes players.",
                "copyme":"In sandbox, it makes each player copy your movements.",
                "randmode":"It chooses a random mode from 5.",
                "Alt L":"Makes lobby visible when you are ingame. Press Alt L again to close lobby.",
                "Alt C":"Hides ingame chat. Press Alt C again to show ingame chat.",
                "Alt S":"Starts game instantly.",
                "Alt T":"Toggles teams.",
                "Alt E":"Toggles editor.",
                "Alt K":"Exits ingame and returns to lobby.",
                "Alt M":"Switches modes.",
                "Alt Q":"Toggles quickplay.",
                "Alt A":"Skips the map if quickplay is on.",
                "Alt D":"Goes to previous map if quickplay is on.",
                "Alt F":"Toggles freejoin. If freejoin is on, starts the game instantly if there are 1 or less players currently playing",
                "Alt R":"In quickplay, it switches mode to recommended mode, according to editor."
                 };
 
elem.onclick=function(e){
    if(stopquickplay==0 && ishost == true && e.isTrusted == true){
        quicki = (Array.from(e.target.parentElement.parentNode.children).indexOf(e.target.parentNode)-1)%(Gdocument.getElementById("maploadwindowmapscontainer").children.length);
    }
};
scope.urlify = function(text) {
    return text.replace(/(?:https?:\/\/)?(?:[A-Za-z0-9-ßàÁâãóôþüúðæåïçèõöÿýòäœêëìíøùîûñé]+)(?:\.[A-Za-z0-9-ßàÁâãóôþüúðæåïçèõöÿýòäœêëìíøùîûñé]+)+(?:\/(?:[A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;=]|%[0-9a-fA-F]{2})*)?(?:\?(?:[^=]+=[^&](?:&[^=]+=[^&])*)?)?/g, function(url) {
    return '<a href="' + url + '" target="_blank" style = "color:orange">' + url + '</a>';
  })
};
 
scope.fire = function(type,options,d = Gdocument){
     var event=new CustomEvent(type);
     for(var p in options){
         event[p]=options[p];
     }
     d.dispatchEvent(event);
};
 
scope.chat = function(message){
    mess = Gdocument.getElementById("newbonklobby_chat_input").value;
    mess2 = Gdocument.getElementById("ingamechatinputtext").value;
    Gdocument.getElementById("newbonklobby_chat_input").value = message;
    Gdocument.getElementById("ingamechatinputtext").value = message;
    fire("keydown",{keyCode:13});
    fire("keydown",{keyCode:13});
    Gdocument.getElementById("newbonklobby_chat_input").value = mess;
    Gdocument.getElementById("ingamechatinputtext").value = mess2;
};
scope.displayInChat = function(message, LobbyColor, InGameColor, options, message2) {
            options = options ?? {};
            message2 = message2 ?? "";
            LobbyColor = LobbyColor ?? "#8800FF";
            InGameColor = InGameColor ?? "#AA88FF";
            let A = Gdocument.createElement("div");
            let B = Gdocument.createElement("span");
            B.className = "newbonklobby_chat_status";
            B.style.color = LobbyColor;
            A.appendChild(B);
            B.innerHTML = (options.sanitize ?? true) ? message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;') : message;
            B.innerHTML+=urlify(message2.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;'));
            let C = Gdocument.createElement("div");
            let D = Gdocument.createElement("span");
            D.style.color = InGameColor;
            C.appendChild(D);
            D.innerHTML = (options.sanitize ?? true) ? message.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;') : message;
            D.innerHTML+=urlify(message2.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;'));
 
            let a = false;
            if(Gdocument.getElementById("newbonklobby_chat_content").scrollHeight - Gdocument.getElementById("newbonklobby_chat_content").scrollTop > Gdocument.getElementById("newbonklobby_chat_content").clientHeight - 1) {
                a = true;
            }
            Gdocument.getElementById("newbonklobby_chat_content").appendChild(A);
            Gdocument.getElementById("ingamechatcontent").appendChild(C);
            if (a) { Gdocument.getElementById("newbonklobby_chat_content").scrollTop = Number.MAX_SAFE_INTEGER;};
            Gdocument.getElementById("ingamechatcontent").scrollTop = Number.MAX_SAFE_INTEGER;
            chat("");
};
 
scope.lobby = function(){
    if (Gdocument.getElementById("newbonklobby").style["display"]=="none"){
 
        Gdocument.getElementById("newbonklobby_editorbutton").click();
        Gdocument.getElementById("mapeditor_close").click();
        if(Gdocument.getElementsByClassName("newbonklobby_playerentry").length>0){
            Gdocument.getElementById("newbonklobby").style["z-index"]=1;
            Gdocument.getElementById("maploadwindowcontainer").style["z-index"]=1;
            Gdocument.getElementById("mapeditorcontainer").style["z-index"]=1;
            Gdocument.getElementById("pretty_top").style["z-index"]=2;
            Gdocument.getElementById("settingsContainer").style["z-index"]=2;
            Gdocument.getElementById("leaveconfirmwindow").style["z-index"]=2;
            Gdocument.getElementById("hostleaveconfirmwindow").style["z-index"]=2;
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
scope.map = function(e){
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
                          Gdocument.getElementById("mapeditor_close").click();
                          Gdocument.getElementById("newbonklobby").style["display"] = "none";
                          Gdocument.getElementById("mapeditor_midbox_testbutton").click();}
                          canceled = false;
                          transitioning = false;
                         },timedelay);
 
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
 
    Gdocument.getElementById("mapeditor_close").click();
    Gdocument.getElementById("newbonklobby").style["display"] = "none";
    Gdocument.getElementById("mapeditor_midbox_testbutton").click();
    Gdocument.getElementById("newbonklobby").style["visibility"] = "visible";
};
scope.commandhandle = function(chat_val){
    if (chat_val.substring(1,6)=="echo " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        if (chat_val.substring(6).replace(/^\s+|\s+$/g, '')==username){
            displayInChat("You cannot echo yourself.","#DA0808","#1EBCC1");
            return "";
        }
        else if (echo_list.indexOf(chat_val.substring(6).replace(/^\s+|\s+$/g, ''))===-1) {
 
            echo_list.push(chat_val.substring(6).replace(/^\s+|\s+$/g, ''));
            displayInChat(chat_val.substring(6).replace(/^\s+|\s+$/g, '') + " is being echoed.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            displayInChat(chat_val.substring(6).replace(/^\s+|\s+$/g, '') + " is already being echoed.","#DA0808","#1EBCC1");
            return "";
        }
    }
    else if (chat_val.substring(1)=="comandosplus"){
        scope.comandosplus = !scope.comandosplus
        if(scope.comandosplus){
            chat(flag_manage('Commands enabled. Type !help'))
        }
    }
    else if (chat_val.substring(1,9)=="randmode"){
           RECIEVE('42[26,"b","'+['b','ar','ard','sp','f'][Math.floor(Math.random()*5)]+'"]');
        }
    else if (chat_val.substring(1,8)=="remove "  && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
        if (echo_list.indexOf(chat_val.substring(7).replace(/^\s+|\s+$/g, ''))!==-1){
            echo_list.splice(echo_list.indexOf(chat_val.substring(7).replace(/^\s+|\s+$/g, '')),1);
            displayInChat(chat_val.substring(7).replace(/^\s+|\s+$/g, '')+" is not being echoed.","#DA0808","#1EBCC1");
            return "";
        }
        else{
            displayInChat("You cannot remove someone that you didn't echo.","#DA0808","#1EBCC1");
            return "";
        }
 
    }
    else if (chat_val.substring(1,10)=="clearecho"){
        echo_list = [];
        displayInChat("Cleared the echo list.","#DA0808","#1EBCC1");
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
 
    else if (chat_val.substring(1,9)=="hidechat"){
        Gdocument.getElementById("ingamechatcontent").style["max-height"]="0px";
        return "";
    }
    else if (chat_val.substring(1,9)=="showchat"){
        Gdocument.getElementById("ingamechatcontent").style["max-height"]="250px";
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
        var text = chat_val.substring(7).replace(/^\s+|\s+$/g, '');
 
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
 
    else if (chat_val.substring(1,5)=="msg " && chat_val.replace(/^\s+|\s+$/g, '').length>=6){
        if(private_chat_public_key[1][0] != 0 && private_chat_public_key[1][1] != 0 && private_chat_public_key[0] == private_chat){
            var text = chat_val.substring(5).replace(/^\s+|\s+$/g, '');
            var password = [];
            for(var i = 0;i<10;i++){
                password.push(Math.floor(Math.random()*100+50));
            }
            var text2 = [];
            for(var i = 0;i<text.slice(0,400).length ;i++){
                text2.push(password[i%password.length]^text.slice(0,400).charCodeAt(i));
            }
            pmlastmessage = text.slice(0,400);
            SEND("42"+JSON.stringify([4,{"type":"private chat","from":username,"to":private_chat,"public key":private_chat_public_key[1],"message":text2,"password":CRYPT_MESSAGE(private_chat_public_key[1],password)}]));
            displayInChat("> "+username+": "+text,"#DA0808","#1EBCC1");
 
        }
        return "";
    }
    else if (chat_val.substring(1,10)=="ignorepm " && chat_val.replace(/^\s+|\s+$/g, '').length>=11){
        var text = chat_val.substring(10).replace(/^\s+|\s+$/g, '');
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
}else{displayInChat("You can private chat with:","#DA0808","#1EBCC1");for(var i = 0;i<pmusers.length;i++){var code = 'Gwindow.private_chat = "'+pmusers[i]+'"; Gwindow.SEND("42"+JSON.stringify([4,{"type":"request public key","from":Gwindow.username,"to":Gwindow.private_chat}])); Gwindow.request_public_key_time_stamp = Date.now(); setTimeout(function(){if(Gwindow.private_chat_public_key[0]!=Gwindow.private_chat){Gwindow.displayInChat("Failed to connect to "+Gwindow.private_chat+".","#DA0808","#1EBCC1");Gwindow.private_chat = Gwindow.private_chat_public_key[0];}},1600);';displayInChat('<a onclick = \''+code+'\' href = "javascript:void(0);" style = "color:green">'+pmusers[i]+'</a>',"#DA0808","#1EBCC1",{sanitize:false}); Gdocument.getElementById("newbonklobby_chat_content").children[Gdocument.getElementById("newbonklobby_chat_content").children.length-1].children[0].parentElement.style["parsed"] = true; Gdocument.getElementById("ingamechatcontent").children[Gdocument.getElementById("ingamechatcontent").children.length-1].children[0].parentElement.style["parsed"] = true; Laster_message = lastmessage(); }}},1600);
        return "";
    }
    else if (chat_val.substring(1,6)=="lobby"){
        lobby();
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
    else if (chat_val.substring(1,5)=="help" || chat_val.substring(1,2)=="?"){
        for(var i = 0;i<help.length;i++){
            displayInChat(help[i],"#DA0808","#1EBCC1");
 
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
    else if(ishost){
 
        if (chat_val.substring(1,5)=="next" && stopquickplay == 0){
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
                        if(availableindexes[i]>quicki){
                            above.push(availableindexes[i]);   
                        }
                    }
                    if(above.length>0){
                        quicki = above[0];
                    }
                    else{
                        quicki = availableindexes[0];
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
 
        else if (chat_val.substring(1,9)=="previous" && stopquickplay == 0){
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
                        if(availableindexes[i]<quicki){
                            above.push(availableindexes[i]);   
                        }
                    }
                    if(above.length>0){
                        quicki = above[above.length-1];
                    }
                    else{
                        quicki = availableindexes[availableindexes.length-1];
                    }
                }
            }
            gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
 
            displayInChat("Switched to previous map.","#DA0808","#1EBCC1");
            return "";
        }
        else if (chat_val.substring(1,6)=="start" && chat_val.length == 6){
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
            Gdocument.getElementById("mapeditor_close").click();
            Gdocument.getElementById("newbonklobby").style["display"] = "none";
            Gdocument.getElementById("mapeditor_midbox_testbutton").click();
 
            return "";
        }
 
        else if (chat_val.substring(1,8)=="startqp" && stopquickplay == 1){
            stopquickplay = 0;
            quicki = 0;
            displayInChat("Enabled quickplay.","#DA0808","#1EBCC1");
            return "";
        }
        else if (chat_val.substring(1,7)=="stopqp" && stopquickplay == 0){
            stopquickplay = 1;
            quicki = 0;
            displayInChat("Disabled quickplay.","#DA0808","#1EBCC1");
            return "";
        }
 
        else if (chat_val.substring(1,5)=="ban " && chat_val.replace(/^\s+|\s+$/g, '').length>=6){
            banned.push(chat_val.substring(5).replace(/^\s+|\s+$/g, ''));
            displayInChat("Banned "+chat_val.substring(5).replace(/^\s+|\s+$/g, '')+".","#DA0808","#1EBCC1");
            return "/kick '" + chat_val.substring(5).replace(/^\s+|\s+$/g, '') + "'";
        }
        else if (chat_val.substring(1,6)=="kill " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
            var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '');
            var keys = Object.keys(playerids);
            var killid = undefined;
            for(var i = 0; i<keys.length; i++){
                if(playerids[keys[i]] == text){
                    killid = keys[i];
                }
            }
            if(typeof(killid)!="undefined" && Gdocument.getElementById("gamerenderer").style["visibility"]!="hidden"){
                currentFrame = Math.floor((Date.now() - gameStartTimeStamp)/1000*30);
 
 
                SEND('42[25,{"a":{"playersLeft":['+killid.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
                RECIEVE('42[31,{"a":{"playersLeft":['+killid.toString()+'],"playersJoined":[]},"f":'+currentFrame.toString()+'}]');
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
        else if (chat_val.substring(1,7)=="moveA " && chat_val.replace(/^\s+|\s+$/g, '').length>=8){
            var text = chat_val.substring(7).replace(/^\s+|\s+$/g, '');
            var keys = Object.keys(playerids);
            if(text == "f"){
                for(var i = 0; i<keys.length;i++){
                    SEND('42[26,{"targetID":'+keys[i]+',"targetTeam":1}]')
                }
            }
            else if(text == "b"){
                for(var i = 0; i<keys.length;i++){
                    SEND('42[26,{"targetID":'+keys[i]+',"targetTeam":3}]')
                }
            }
            else if(text == "g"){
                for(var i = 0; i<keys.length;i++){
                    SEND('42[26,{"targetID":'+keys[i]+',"targetTeam":4}]')
                }
            }
            else if(text == "r"){
                for(var i = 0; i<keys.length;i++){
                    SEND('42[26,{"targetID":'+keys[i]+',"targetTeam":2}]')
                }
            }
            else if(text == "y"){
                for(var i = 0; i<keys.length;i++){
                    SEND('42[26,{"targetID":'+keys[i]+',"targetTeam":5}]')
                }
            }
            else if(text == "s"){
                for(var i = 0; i<keys.length;i++){
                    SEND('42[26,{"targetID":'+keys[i]+',"targetTeam":0}]')
                }
            }
 
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
        else if (chat_val.substring(1,6)=="mode " && chat_val.replace(/^\s+|\s+$/g, '').length>=7){
            var text = chat_val.substring(6).replace(/^\s+|\s+$/g, '');
            var mode = "";
            if(text == "arrows"){
                mode = "ar";
                displayInChat("Changed mode to arrows.","#DA0808","#1EBCC1");
            }
            else if(text == "death arrows"){
                mode = "ard";
                displayInChat("Changed mode to death arrows.","#DA0808","#1EBCC1");
            }
            else if(text == "grapple"){
                mode = "sp";
                displayInChat("Changed mode to grapple.","#DA0808","#1EBCC1");
            }
            else if(text == "classic"){
                mode = "b";
                displayInChat("Changed mode to classic.","#DA0808","#1EBCC1");
 
            }
            else{
                displayInChat("Mode options:","#DA0808","#1EBCC1");
                displayInChat("classic","#DA0808","#1EBCC1");
                displayInChat("arrows","#DA0808","#1EBCC1");
                displayInChat("death arrows","#DA0808","#1EBCC1");
                displayInChat("grapple","#DA0808","#1EBCC1");
            }
            if(mode != ""){
                SEND('42[20,{"ga":"b","mo":"'+mode+'"}]');
                RECIEVE('42[26,"b","'+mode+'"]');
            }
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
        else if(sandboxon){
            if (chat_val.substring(1,11)=="addplayer " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
                var text = chat_val.substring(11).replace(/^\s+|\s+$/g, '');
                if(!isNaN(parseInt(text))){
                    var text2 = parseInt(text);
                    if(text2>0){
                        for(var i = 0;i<text2;i++){
                            RECIEVE('42[4,'+sandboxid+',"0123456789abcdef","'+sandboxid.toString()+'",true,0,1,{"layers":[],"bc":'+Math.floor(Math.random() * 16777215).toString()+'}]');
                            sandboxplayerids[sandboxid] = sandboxid.toString();
                            sandboxid+=1;
                        }
 
                    }
                }
                return "";
 
            }
            else if (chat_val.substring(1,11)=="delplayer " && chat_val.replace(/^\s+|\s+$/g, '').length>=12){
                var text = chat_val.substring(11).replace(/^\s+|\s+$/g, '');
                if(!isNaN(parseInt(text))){
                    var text2 = parseInt(text);
                    if(text2>0){
                        if(Gdocument.getElementById("gamerenderer").style["visibility"] == "hidden"){
                            var jsonkeys = Object.keys(sandboxplayerids).reverse();
                            for(var i = 0;i<text2 && i<jsonkeys.length;i++){
                                RECIEVE('42[5,'+jsonkeys[i]+',0]');
                                delete sandboxplayerids[jsonkeys[i]];
                            }
                        }
                        else{
                            displayInChat("Cannot delete players while ingame.","#DA0808","#1EBCC1");
                        }
 
                    }
                }
                return "";
            }
            else if (chat_val.substring(1,7)=="copyme"){
                if(sandboxcopyme == true){
                    displayInChat("Copyme is now off.","#DA0808","#1EBCC1");
                    sandboxcopyme = false;
                }
                else{
                    displayInChat("Copyme is now on.","#DA0808","#1EBCC1");
                    sandboxcopyme = true;
                }
 
                return "";
            }
        }
    }
    return chat_val;
};
 
scope.flag_manage = function(t){
    var text = t;
 
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
            chat(commandhandle(chat_val));
        }
        else{
            Gdocument.getElementById("newbonklobby_chat_input").value = "";
            chat(flag_manage(chat_val));
        }
 
    }
};
Gdocument.getElementById("ingamechatinputtext").onkeydown = function(e){
    if(e.keyCode==13){
 
        var chat_val = Gdocument.getElementById("ingamechatinputtext").value;
 
        if (chat_val!="" && chat_val[0]=="/"){
 
            Gdocument.getElementById("ingamechatinputtext").value = "";
            chat(commandhandle(chat_val));
        }
        else{
            Gdocument.getElementById("ingamechatinputtext").value = "";
            chat(flag_manage(chat_val));
        }
    }
};
scope.Last_message = "";
scope.Laster_message = "";
scope.new_message = false;
scope.changed_chat = false;
scope.interval = setInterval(timeout123,100);
 
 
scope.hotkeys = function(e){
 
    if(e.repeat){return;}
    var keycode = e.code;
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
                Gdocument.getElementById("mapeditor_close").click();
                Gdocument.getElementById("newbonklobby").style["display"] = "none";
                Gdocument.getElementById("mapeditor_midbox_testbutton").click();
                e.preventDefault();
            }
            else if(keycode == "KeyD"){
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
                                if(availableindexes[i]>quicki){
                                    above.push(availableindexes[i]);   
                                }
                            }
                            if(above.length>0){
                                quicki = above[0];
                            }
                            else{
                                quicki = availableindexes[0];
                            }
                        }
                    }
                    gotonextmap(quicki%(Gdocument.getElementById("maploadwindowmapscontainer").children.length));
                }
                e.preventDefault();
            }
            else if(keycode == "KeyA"){
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
                                if(availableindexes[i]<quicki){
                                    above.push(availableindexes[i]);   
                                }
                            }
                            if(above.length>0){
                                quicki = above[above.length-1];
                            }
                            else{
                                quicki = availableindexes[availableindexes.length-1];
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
                    displayInChat("Enabled quickplay.","#DA0808","#1EBCC1");
                }
                else{
                    stopquickplay = 1;
                    quicki = 0;
                    displayInChat("Disabled quickplay.","#DA0808","#1EBCC1");
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
                    Gdocument.getElementById("ingamechatcontent").style["max-height"]="250px";
                }
                else{
                    Gdocument.getElementById("ingamechatcontent").style["max-height"]="0px";
                }
            }
            e.preventDefault();
        }
 
    }
    if(!e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey){
        if(keycode == "Slash"){
            if(Gdocument.getElementById("newbonklobby").style["display"]=="block" && Gdocument.getElementById("newbonklobby_chat_input").value == ""  && Gdocument.getElementById("maploadwindowcontainer").style["display"]!="block"){
                Gdocument.getElementById("newbonklobby_chat_input").value = "/";
                if(Gdocument.getElementById("newbonklobby_chat_input").style["pointer-events"] == "none"){
                    fire("keydown",{keyCode:13});
                }
                else{
                    Gdocument.getElementById("newbonklobby_chat_input").focus();
                }
                e.preventDefault();
 
            }
            else if(Gdocument.getElementById("ingamechatinputtext").style["visibility"]=="visible" && Gdocument.getElementById("mapeditorcontainer").style["display"]!="block" && Gdocument.getElementById("ingamechatinputtext").value == ""){
                Gdocument.getElementById("ingamechatinputtext").value = "/";
                if(Gdocument.getElementById("ingamechatinputtext").classList.value == "js-bound"){
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
 
 
 
 
function timeout123() {
 
    if(Gdocument.getElementById("gamerenderer").style["visibility"]=="hidden"){
       Gdocument.getElementById("ingamechatcontent").style["max-height"]="250px";
    }
    if(Gdocument.getElementById("sm_connectingContainer").style["visibility"] == "hidden"){
        var chatbox = Gdocument.getElementById("newbonklobby_chat_content");
        while (chatbox.firstChild) {
            chatbox.removeChild(chatbox.firstChild);
        }
        rcaps_flag = false;
        space_flag = false;
        number_flag = false;
        echo_list = [];
        scroll = false;
        stopquickplay = 1;
        checkboxhidden = false;
        freejoin = false;
        shuffle = false;
        defaultmode = "";
        recmodebool = false;
        playerids = {};
        pingids = {};
        ishost = false;
        sandboxplayerids = {};
        sandboxcopyme = false;
        sandboxon = false;
        sandboxid = 1;
        if(chatlog[chatlog.length-1]!="ROOM END"){
            chatlog.push("ROOM END");
        }
    }
    else{
        if(chatlog[chatlog.length-1]=="ROOM END"){
            chatlog.push("ROOM START");
        }
        var pingidkey = Object.keys(pingids);
        var playeridkey = Object.keys(playerids);
        for(var i = 0; i<pingidkey.length;i++){
            if(!playeridkey.includes(pingidkey[i])){
                var pingtext = Gdocument.getElementsByClassName("newbonklobby_playerentry_pingtext");
                var found = [];
                if(Gdocument.getElementById("newbonklobby").style["display"] != "block"){
                    mess2 = Gdocument.getElementById("ingamechatinputtext").value;
                    Gdocument.getElementById("ingamechatinputtext").value = "";
                    Gdocument.getElementById("newbonklobby_editorbutton").click();
                    Gdocument.getElementById("mapeditor_close").click();
                    Gdocument.getElementById("newbonklobby").style["display"] = "none";
                    Gdocument.getElementById("ingamechatinputtext").value = mess2;
 
                }
                for(var e=0; e<pingtext.length;e++){
                    if(pingtext[e].textContent == pingids[pingidkey[i]].toString()+"ms"){
                        found.push(pingtext[e].parentElement);
                    }
                }
                if(found.length == 1){
                    playerids[pingidkey[i]] = found[0].children[1].textContent;
                    break;
                }
            }
        }
        pingids = {};
    }
 
    if(Gdocument.getElementById("newbonklobby").style["display"]=="block"){
        Gdocument.getElementById("ingamechatinputtext").style["visibility"]="hidden";
    }
    else{
        Gdocument.getElementById("ingamechatinputtext").style["visibility"]="visible";
 
    }
    mode = Gdocument.getElementById("newbonklobby_modetext").textContent;
    var userlist = Gdocument.getElementsByClassName("newbonklobby_playerentry_name");
    users = [];
    for(var i = 0;i<userlist.length;i++){
        users.push(userlist[i].textContent);
    }
    if(Gdocument.getElementsByClassName('newbonklobby_settings_button brownButton brownButton_classic buttonShadow brownButtonDisabled').length == 0){
        ishost = true;
    }
    else{
        ishost = false;
    }
 
    if(Gdocument.getElementById("pretty_top_name")!=null){
        username = Gdocument.getElementById("pretty_top_name").textContent;
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
        if(freejoin && Last_message.startsWith("* ") && Last_message.endsWith(" has joined the game") && ishost){
 
            var userjoined = Last_message.substring(2,Last_message.length-20);
 
            if(Gdocument.getElementById("newbonklobby").style["display"] != "block"){
                mess2 = Gdocument.getElementById("ingamechatinputtext").value;
                Gdocument.getElementById("ingamechatinputtext").value = "";
                Gdocument.getElementById("newbonklobby_editorbutton").click();
                Gdocument.getElementById("mapeditor_close").click();
                Gdocument.getElementById("newbonklobby").style["display"] = "none";
                Gdocument.getElementById("ingamechatinputtext").value = mess2;
 
            }
            var playing = Gdocument.getElementsByClassName("newbonklobby_playerentry newbonklobby_playerentry_half");
            var inplaying = false;
            for(var i = 0;i<playing.length;i++){
                if(userjoined == playing[i].children[1].textContent){
                    inplaying = true;
                    break;
                }
            }
 
            if(playing.length<=2 && inplaying){
                Gdocument.getElementById("newbonklobby_editorbutton").click();
                Gdocument.getElementById("mapeditor_close").click();
                Gdocument.getElementById("newbonklobby").style["display"] = "none";
                Gdocument.getElementById("mapeditor_midbox_testbutton").click();
                if(transitioning == true){
                    canceled = true;
                }
            }
 
        }
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
            var n = new Notification(Last_message);
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
        for(i=0;i<echo_list.length;i++){
            if(Last_message.substring(0,echo_list[i].length+2) == echo_list[i]+": "){
                message = Last_message.substring(echo_list[i].length+2);
                chat(flag_manage(message));
            }
        }
        if(scope.comandosplus){
            if(Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+3,Last_message.substring(0,Last_message.indexOf(':')).length+14).toLowerCase() == "!percentage"){
                a=Last_message.substring(Last_message.indexOf('(')+1,Last_message.indexOf(')'))
                b=Last_message.substring(Last_message.lastIndexOf('(')+1,Last_message.lastIndexOf(')'))
                if(a==''||Last_message.indexOf('(')==Last_message.lastIndexOf('(')){
                    return chat(flag_manage('Your command usage is wrong. Example on using this command: !percentage (BOT_1) (funny)'))
                }
                chat(flag_manage(a+' is '+Math.floor(Math.random()*101)+'% '+b))
            }
            if(Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+3).toLowerCase() == "!command"){
                localStorage.thing++
                chat(flag_manage('This command was ran '+localStorage.thing+' times!'))
            }
            if(Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+3).toLowerCase() == "!help"){
                chat(flag_manage('Help: (!percentage) [Tells you a percentage] | (!command) [Gives you the amount of times the command !command was ran] | (!say) [Repeats a message you say]'))
            }
            if(Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+3,Last_message.substring(0,Last_message.indexOf(':')).length+7).toLowerCase() == "!say"){
                if(Last_message.substring(0,Last_message.indexOf(':')).toLowerCase() != "helloim0_0"){
                    chat(Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+8) != "" ? Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+8) : 'Your command usage is wrong. Example on using this command: !say My day was pretty good today.')
                }
            }
            if(Last_message.substring(Last_message.substring(0,Last_message.indexOf(':')).length+3)== "!fecharsala"){
                Gdocument.getElementById('hostleaveconfirmwindow_endbutton').click()
            }
        }
    }
    if (ishost==true && new_message){
        for(i=0;i<banned.length;i++){
            if(Last_message.startsWith("* "+banned[i]+" has joined the game")){
                chat("/kick '"+banned[i]+"'");
            }
        }
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
        if(Gdocument.getElementById("ingamewinner").style["visibility"]=="inherit" && stopquickplay == 0 && dontswitch == false){
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
                        if(availableindexes[i]>quicki){
                            above.push(availableindexes[i]);   
                        }
                    }
                    if(above.length>0){
                        quicki = above[0];
                    }
                    else{
                        quicki = availableindexes[0];
                    }
                }
            }
            transitioning = true;
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
 