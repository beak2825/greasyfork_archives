// ==UserScript==
// @name         s0urce botnet
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A botnet for s0urce!
// @author       cmdenthusiant
// @match        *://s0urce.io/
// @icon         https://www.google.com/s2/favicons?domain=s0urce.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/436892/s0urce%20botnet.user.js
// @updateURL https://update.greasyfork.org/scripts/436892/s0urce%20botnet.meta.js
// ==/UserScript==

var botName = "Botnet";
var Message = "github.com/ cmdenthusiant/s0urce-botnet";
var reHackms = 2000;
var botAmount = 10;
var lastTarget = GM_getValue("target");
var lastMessage = GM_getValue("msg");
var porting = true;
var words;
fetch("https://raw.githubusercontent.com/cmdenthusiant/s0urce-botnet/main/s0urce%20words/words.json").then(r=>{if(r.ok){return r.json()}else{{console.log("Can't get words\nExiting...");setTimeout(()=>{window.open("http://s0urce.io","_self")},1000)}}}).then(json=>{words = json;});
if(GM_getValue("learnedWords")===undefined){GM_setValue("learnedWords",{"e":{},"m":{},"h":{}});}

function bot(){
    $("#login-input").val(botName);
    $("#login-play").click();
    const checkPlLoop = setInterval(()=>{
        const pl = document.getElementById("player-list");
        if(pl.children.length!=1){
            clearInterval(checkPlLoop);
            selectTarget(lastTarget);
            port();
            hack();
            description();
        }
    },100);
}

function hack(){
    let typeBox = document.getElementById("tool-type-word");
    var lags = 0;
    var lagReload = false;
    const loop = setInterval(()=>{
        if(porting){return;}
        if(GM_getValue("target")==undefined){log("! Closing Bot");window.close();return;}
        if(GM_getValue("target")!=lastTarget){lastTarget=GM_getValue("target");selectTarget(lastTarget);port();}
        if(GM_getValue("msg")!=lastMessage){lastMessage=GM_getValue("msg");description();}
        let imgWord = $(".tool-type-img")[0];
        let learnedWords = GM_getValue("learnedWords");
        if(imgWord.src=="http://s0urce.io/client/img/words/template.png"){
            let msgBox = $("#topwindow-success");
            if(msgBox.is(":visible")){
                $("#targetmessage-input").val((GM_getValue("msg")!=undefined)?GM_getValue("msg"):Message);
                $("#targetmessage-input").submit();
            }
            port();
            return;
        }
        let difficulty = imgWord.src.split("http://s0urce.io/client/img/word/")[1].split("/")[0];
        let imgNum = imgWord.src.split("http://s0urce.io/client/img/word/"+difficulty)[1].replace("/","");
        if(learnedWords[difficulty][imgNum]){
            log("> Found word: "+difficulty+" "+imgNum+" "+learnedWords[difficulty][imgNum]);
            typeBox.value = learnedWords[difficulty][imgNum];
        }else{
            findWord(imgWord, difficulty, imgNum);
            return;
        }
        let lastLogNum = $("#cdm-text-container").children().length;
        $("#tool-type-word").submit();
        setTimeout(()=>{if(!($("#cdm-text-container").children().length>lastLogNum)){if(lags>=5){log("! Bot is offine,Reloading...","error");window.open("http://s0urce.io","_self");clearInterval(loop);}else{port();lags+=1;log("! Lagging...","error")}}else{lags=0;}},1000);
    },(GM_getValue("ms")!=undefined)?GM_getValue("ms"):500);
}

function port(){
    porting = true;
    setTimeout(()=>{
        let ports = $("#window-other-attackbutton-wrapper").children();
        let portNum = randomInt(1,3);
        let lastLogNum = $("#cdm-text-container").children().length;
        ports[portNum].click();
        setTimeout(()=>{if($("#cdm-text-container").children().length>lastLogNum){port();}else{porting=false;}},1000);
    },reHackms);
}

function description(){
    $("#window-my-playerquote-wrapper").click();
    $("#playerquote-type-word").val((GM_getValue("msg")!=undefined)?GM_getValue("msg"):Message);
    $("#playerquote-type-word").submit();
}

function main(){
    window.onbeforeunload = (e)=>{GM_deleteValue("target");GM_deleteValue("msg");GM_deleteValue("ms");GM_deleteValue("learnedWords");e.returnValue='';};
    const checkPlLoop = setInterval(()=>{//check if player list was loaded
        const pl = document.getElementById("player-list");
        if(pl.children.length!=1){
            clearInterval(checkPlLoop); //Stop Loop
            $("#targetid-input-form").bind("submit",(e)=>getCmd(e));
            $("#targetid-button").bind("click",(e)=>getCmd(e));
        }
    },100);
};

function getCmd(e){
    let cmdBox = $("#targetid-input");
    if(!cmdBox.val().startsWith("bot!")){return;}
    let cmd = cmdBox.val().replace("bot!","");
    if(cmd==""){return;}
    if(cmd=="stop"){GM_deleteValue("target");log("> Bots Stoped");return;}
    if(cmd.startsWith("botAmount")){
        let amount = parseInt(cmd.split("botAmount ")[1]);
        if(!isNaN(amount)){botAmount=(amount>25)?25:amount;log("> Changed botAmount to "+botAmount);}else{log("! Usage: bot!botAmount <Number>","error");}
        return;
    }
    if(cmd.startsWith("message")){
        let msg = cmd.replace("message ","");
        if(msg!=""){GM_setValue("msg",msg);log("> Changed Message to '"+msg+"'");}else{log("! Usage: bot!message <message>","error");}
        return;
    }
    if(cmd.startsWith("ms")){
        let ms = parseInt(cmd.replace("ms ",""));
        if(!isNaN(ms)){GM_setValue("ms",ms);log("> Changed ms to '"+ms+"'");}else{log("! Usage: bot!ms <ms>","error");}
        return;
    }
    log("> Target's Id: "+cmd);
    if(GM_getValue("target")===undefined){setTimeout(()=>{startBots()},200);}
    GM_setValue("target",cmd);
}

function waitPlLoad(){
    const checkPlLoop = setInterval(()=>{
        const pl = document.getElementById("player-list");
        if(pl.children.length!=1){
            clearInterval(checkPlLoop);
            return;
        }
    },100);
}

function findWord(img,difficulty,imgNum){
    porting = true;
    setTimeout(()=>{
        let code = getBase64Image(img);
        let word = words[difficulty][code];
        let learnedWords = GM_getValue("learnedWords");
        learnedWords[difficulty][imgNum] = word;
        if(word){GM_setValue("learnedWords",learnedWords);porting=false;}else{log("Can't find words,retrying...","error");findWord(img,difficulty,imgNum);}
    },500);
}

function selectTarget(id){
    let cmdBox = $("#targetid-input");
    cmdBox.val(id);
    cmdBox.submit();
}

function startBots(){
    for(let i=0;i<botAmount;i++){window.open("http://s0urce.io","_blank");}
    log("> Created "+botAmount+" Bots");
}

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1)+min)}

function log(msg,type=""){
    let logClass = "window-log-message"+((type=="error")?" window-log-message-danger":"");
    let htmlLog = document.createElement("div");
    htmlLog.className = logClass;
    htmlLog.innerText = msg;
    let logBox = $(".window-log-content")[0];
    logBox.append(htmlLog);
    logBox.scrollTo({top:logBox.scrollHeight,behavior:"smooth"});
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    canvas.toDataURL("image/png");
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

if(lastTarget!=undefined){bot();}else{main();}