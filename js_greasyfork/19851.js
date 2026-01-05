// ==UserScript==
// @name         BitMiner Beta
// @namespace    http://aljotica.eu/
// @version      1.3.1
// @description  Bot for bitmine.xyz, with new methods, tips are welcome!
// @author       JohnAxae
// @match        http://bitmine.xyz/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/19851/BitMiner%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/19851/BitMiner%20Beta.meta.js
// ==/UserScript==

var tileClicked=[], game=false, goOn=false, method=1, preBet=0, tries=0, lost=false;
var cinp = {wins:0,losses:0,prof:0};
var rlbl = ["rounds","bombs","bits","maxProfit","maxLoss","maxClicks","rFixedTile"];
var rLab = ["Rounds","Bombs","Bits","Max. Profit","Max. Loss","Max. Clicks","Fixed Tile"];
var rInf = ["The max. rounds you want to do the bot before getting to Max. Loss or Max. Profit.","How many bomb you want to have in a game.","How many bits you want to bet every game.","The max. profit you want to reach.","The max. loss you want to get.","How many click you want to have per game.","Fixed tiles for the clicks. More tiles can seperated with comma. 0: no fixed tile."];
var rinp = [100,9,1,5,5,1,0];
var mlbl = ["bit","tile","bomb","maxTries","stopMaxTries"];
var mLab = ["Base Bet","Tile","Bombs","Max. Tries","Stop Max.Tries"];
var mInf = ["The base bet.","The tile you want to click every game.","How many bomb you want to have in a game.","The tries the bot can do before going back to base bet.","If tries run out, do you want to stop the bot?"];
var minp = [1,13,5,7,false];
var slbl = ["sBet","sLoss","sWin","sStopBet","sBomb","sFixedTile"];
var sLab = ["Base Bet","Loss Increase","Win Increase","Stop Bet","Bombs","Fixed Tile"];
var sInf = ["The base bet.","Multiply the bet on loss.","Multiply the bet on win.","Stop bot when bet reaches this amount.","How many bomb you want to have in a game.","Fixed tiles for the clicks. More tiles can seperated with comma. 0: no fixed tile."];
var sinp = [1,0,0,1000000,0];

(function() {
    console.log("Welcome to JohnAxae's BitMiner!");
    loadSettings();
    setTabs();
    setConsole();
    setOptions();
    $('.tabular.menu .item').tab();
    $('label').popup();
    setCells();
    console.log("Everything loaded, go your game!");
})();
function getSettings(lbl,inp){
    for(var i=0; i<lbl.length; i++){
        if(lbl[i]=="stopMaxTries") inp[i]=GM_getValue(lbl[i],inp[i]);
        else inp[i]=parseFloat(GM_getValue(lbl[i],inp[i]));
        if(GM_getValue(lbl[i]) === undefined){
            if(lbl[i]=="stopMaxTries") GM_setValue(lbl[i],inp[i]);
            else GM_setValue(lbl[i],parseFloat(inp[i]));
        }
    }
}
function setSettings(lbl,inp){
    for(var i=0; i<lbl.length; i++){
        if(lbl[i]=="stopMaxTries"){
             GM_setValue(lbl[i],$("#"+lbl[i]).prop('checked'));
             inp[i]=GM_getValue(lbl[i]);
        } else {
             GM_setValue(lbl[i],parseFloat($("#"+lbl[i]).val()));
             inp[i]=parseFloat(GM_getValue(lbl[i]));
        }
    }
}
function loadSettings(){
    getSettings(rlbl,rinp);
    getSettings(mlbl,minp);
    getSettings(slbl,sinp);
}
function saveSettings(){
    setSettings(rlbl,rinp);
    setSettings(mlbl,minp);
    setSettings(slbl,sinp);
}
function createOptionRow(id,height,marginTop){
    var opRw = document.createElement("div");
        opRw.setAttribute("id",id);
        opRw.setAttribute("style","height:"+height+"px;margin-top:"+marginTop+"px;");
    return opRw;
}
function createOptions(sort,active,title,name,method){
    var clas,elem;
    if(sort=="tab"){
        clas = (active)?"active item":"item";
        elem = document.createElement("a");
            elem.setAttribute("class",clas);
            elem.setAttribute("style","color:#FFF;");
            elem.setAttribute("data-tab",name);
            elem.setAttribute("data-method",method);
            elem.innerHTML = title;
    } else if(sort=="con"){
        clas = (active)?"ui bottom attached tab active":"ui bottom attached tab";
        elem = document.createElement("div");
            elem.setAttribute("class",clas);
            elem.setAttribute("data-tab",name);
            elem.setAttribute("id",title);
            elem.setAttribute("style","margin-top:5px;");
    }
    return elem;
}
function setTabs(){
    var conf = document.createElement("div");
        conf.setAttribute("style","position:absolute;left:5px;width:60%;bottom:5px;height:140px;");
    var tabs = document.createElement("div");
        tabs.setAttribute("class","ui top attached pointing secondary tabular menu teal");
        tabs.setAttribute("id","method");
    tabs.appendChild(createOptions("tab",1,"Random clicks","random",1));
    tabs.appendChild(createOptions("tab",0,"Simple","simple",3));
    tabs.appendChild(createOptions("tab",0,"Martingale","martingale",2));
    tabs.appendChild(createOptions("tab",0,"Suggest more","",0));
    conf.appendChild(tabs);
    conf.appendChild(createOptions("con",1,"con1","random",1));
    conf.appendChild(createOptions("con",0,"con2","martingale",2));
    conf.appendChild(createOptions("con",0,"con3","simple",3));
    document.body.appendChild(conf);
}
function setConsole(){
    console.log("Loading console");
    var cons = document.createElement("code");
        cons.setAttribute("id","cons");
        cons.setAttribute("class","ui inverted segment");
        cons.setAttribute("style","height:190px;width:135px;padding:5px;position:absolute;right:5px;bottom:5px;text-align:right;overflow-y:hidden;font-size:1.1em;");
    document.body.appendChild(cons);
    var cCon = document.createElement("div");
        cCon.setAttribute("style","position:absolute;right:145px;width:calc(40%-145px);bottom:5px;height:90px;");
    var con1 = document.getElementById("con1");
    var con2 = document.getElementById("con2");
    var con3 = document.getElementById("con3");
    con1.appendChild(createOptionRow("rOp1",37,10));
    con1.appendChild(createOptionRow("rOp2",37,5));
    con2.appendChild(createOptionRow("mOp1",37,10));
    con2.appendChild(createOptionRow("mOp2",37,5));
    con3.appendChild(createOptionRow("sOp1",37,10));
    con3.appendChild(createOptionRow("sOp2",37,5));
    cCon.appendChild(createOptionRow("cOp1",37,5));
    cCon.appendChild(createOptionRow("cOp2",37,5));
    document.body.appendChild(cCon);
    return true;
}
function setOptions(){
    setStartButton();
    var clbl = ["wins","losses","profit"];
    var cLab = ["Wins","Losses","Profit"];
    var cInf = ["","",""];
    setOpts("console","cOp2","cOp2",clbl,cLab,cinp,cInf);
    setOpts("random","rOp1","rOp2",rlbl,rLab,rinp,rInf);
    setOpts("martingale","mOp1","mOp2",mlbl,mLab,minp,mInf);
    setOpts("simple","sOp1","sOp2",slbl,sLab,sinp,sInf);
}
function setStartButton(){
    var opt1 = document.getElementById("cOp1");
    $("#game_allbets_log table").addClass("small compact");
    console.log("Adding button");
    var btn = document.createElement("button");
        btn.innerHTML = "START!";
        btn.setAttribute("id","btn");
        btn.setAttribute("class","compact large ui green button");
        btn.setAttribute("style","width:128px;margin:0 10px;display:inline-block;float:right;");
        btn.addEventListener("click", function(){
            doBtnWork();
        });
    opt1.appendChild(btn);
}
function setOpts(name,op1,op2,lbls,lab,inp,inf){
    console.log("Adding options for "+name);
    var opt1 = document.getElementById(op1);
    var opt2 = document.getElementById(op2);
    for(var i=0; i<lbls.length; i++){
        var div = document.createElement("div");
        if(lbls[i]=="stopMaxTries"){
            div.setAttribute("class","ui small right labeled checkbox");
            div.setAttribute("style","margin: 0 10px 0 5px;display:inline-block;");
        } else {
            div.setAttribute("class","ui small right labeled input");
            div.setAttribute("style","margin:0 10px;display:inline-block;");
        }
        var lbl = document.createElement("label");
        if(name=="console"){
            lbl.setAttribute("class","ui blue label");
            lbl.setAttribute("style","height:34.63px;width:68px;");
        } else if(lbls[i]=="stopMaxTries") {
            lbl.setAttribute("class","ui teal label");
            lbl.setAttribute("style","height:34.63px;min-width:160px;");
        } else{
            lbl.setAttribute("class","ui teal label");
            lbl.setAttribute("style","height:34.63px;min-width:100px;");
        }
            lbl.setAttribute("for",lbls[i]);
        if(inf[i]!==""){
            lbl.setAttribute("data-content",inf[i]);
            lbl.setAttribute("data-variation","inverted");
        }
            lbl.innerHTML = lab[i];
        var opt = document.createElement("input");
        if(lbls[i]=="stopMaxTries"){
            opt.setAttribute("type","checkbox");
            opt.checked = inp[i];
        } else {
            opt.setAttribute("type","text");
            opt.setAttribute("style","width:60px; text-align:right;");
        }
            opt.setAttribute("value",inp[i]);
            if(name=="console") console.log(inp[i]);
            opt.setAttribute("id",lbls[i]);
            opt.addEventListener("change",function(){
                saveSettings();
            });
        div.appendChild(opt);
        div.appendChild(lbl);
        if(i<lbls.length/2) opt1.appendChild(div);
        else opt2.appendChild(div);
    }
}
function setCells(){
    console.log("Loading cell values");
    cinp.wins = 0; cinp.losses = 0; cinp.prof = 0;
    $("#wins").val(cinp.wins);
    $("#losses").val(cinp.losses);
    $("#profit").val(cinp.prof);
    $("#rounds").val(rinp[0]);
    $("#cons").empty();
    for(var i=0;i<12;i++){
        $("#cons").append("<div>&nbsp;</div>");
    }
}
function setAbleClick(){
    if(game){
        $("#con1, #con2, #con3").removeAttr("data-tab");
    } else {
        $("#con1").attr("data-tab","random");
        $("#con2").attr("data-tab","martingale");
        $("#con3").attr("data-tab","simple");
    }
}
function doBtnWork(){
    method = parseInt($("#method .item.active").attr("data-method"));
    if(game){
        $("#btn").html("START!");
        $("#btn").removeClass("red").addClass("green");
        $("#rounds").val(rinp[0]);
        game=false;
        console.log("Mission aborted!");
        setAbleClick();
    } else {
        $("#btn").html("STOP!");
        $("#btn").removeClass("green").addClass("red");
        game=true;
        setCells();
        if(method==1)
            checkRandomGame();
        else if(method==2)
            checkMartingaleGame();
        else if(method==3)
            checkSimpleGame();
        setAbleClick();
    }
}
function checkRandomGame(){
    console.log("Checking if you may start.");
    if(game){
        var round = $("#rounds").val();
        var mProf = parseFloat($("#maxProfit").val());
        var mLoss = parseFloat($("#maxLoss").val()) * -1;
        var bet = parseInt($("#bits").val());
        if(round>0 && (cinp.prof-bet)>=mLoss && cinp.prof<mProf){
            round = parseInt(round)-1;
            console.log("You can go on!");
            goOn=true;
            newRandomGame();
        } else {
            console.log("Abort mission!");
            doBtnWork();
            goOn=false;
        }
    }
}
function newRandomGame(){
    console.log("Starting new game.");
    if(goOn){
        $("#rounds").val(parseInt($("#rounds").val())-1);
        $("#bet").val(parseFloat($("#bits").val()));
        $(".customBombsButton").click();
        $("#customBombs").val(parseInt($("#bombs").val()));
        tileClicked.length = 0; tileClicked = [];
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){} else {
            setBet(parseFloat($("#bits").val()));
            setBombs(parseInt($("#bombs").val()));
        }
        $("#startNewGameButton").click();
        setTimeout(function(){
            getRandomTile();
        },250);
    }
}
function getRandomTile(){
    if($("#board").children("li").length){
        console.log("Choosing a tile.");
        var tile = getFixedTile($("#rFixedTile").val());
        console.log("Clicking tile "+(tile+1)+".");
        $(".tile:eq("+tile+")").click();
        checkNewTile();
    } else {
        setTimeout(function(){
            getRandomTile();
        },100);
    }
}
function newTile(){
    var tile;
    do {
        tile = Math.floor((Math.random() * 21 + 1 + Math.random() * 25 + 1 + Math.random() * 29 + 1) / 3);
    } while (tileClicked.indexOf(tile) > -1);
    return tile;
}
function removeLastComma(strng){        
    var n=strng.lastIndexOf(",");
    var a=strng.substring(0,n);
    return a;
}
function getFixedTile(fixedTiles){
    var tile;
    if(parseInt(fixedTiles)!==0){
        var tiles = removeLastComma(fixedTiles).split(",");
        if(tiles.length==1)
            tile = parseInt(tiles);
        else 
            tile = parseInt(tiles[Math.floor((Math.random() * (tiles.length-1)) + 1)]);
    } else {
        tile = newTile();
    }
    tileClicked.push(tile);
    return tile;
}
function checkNewTile(){
    if($("#board").children(".pressed").length == tileClicked.length){
        if(tileClicked.length < $("#maxClicks").val()){
            var next = parseFloat($("#next_value").html());
            if(next!==0){
                console.log("Can choose another tile!");
                getRandomTile();
            } else {
                console.log("Can't choose another tile!");
                getWin(parseFloat($("#bits").val()));
            }
        } else{
            setTimeout(function(){
                getWin(parseFloat($("#bits").val()));
                console.log("Can't choose another tile too!");
            },100);
        }
    } else {
        setTimeout(function(){
            checkNewTile();
        },100);
    }
}
function checkMartingaleGame(){
    console.log("Checking if you may start.");
    if(game){
        var stopMaxTries = $("#stopMaxTries").val();
        var maxTries = parseFloat($("#maxTries").val());
        var bet = parseInt($("#bit").val());
        if(tries<maxTries || lost){
            tries++;
            console.log("You can go on!");
            goOn=true;
            newMartingaleGame();
        } else if(tries>=maxTries && stopMaxTries===1 ){
            console.log("Abort mission!");
            goOn=false;
            lost=false;
            preBet=0;
            doBtnWork();
        } else if((tries>=maxTries || !lost) && stopMaxTries!==1 ){
            tries=0;
            lost=false;
            goOn=true;
            preBet=0;
            setTimeout(function(){
                checkMartingaleGame();
            },100);
        } else {
            console.log("Abort mission!");
            goOn=false;
            lost=false;
            doBtnWork();
        }
    }
}
function newMartingaleGame(){
    console.log("Starting new game.");
    if(goOn){
        var mpli = parseInt($("#bomb").val()) - ((25-parseInt($("#bomb").val()))/25) + 1;
        if(preBet===0)
            preBet = parseFloat($("#bit").val());
        else
            preBet *= mpli;
        var bet = Math.round(preBet*100)/100;
        $(".customBombsButton").click();
        $("#customBombs").val(parseInt($("#bomb").val()));
        $("#bet").val(parseFloat(bet));
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){} else {
            setBet(parseFloat(bet));
            setBombs(parseInt($("#bomb").val()));
        }
        $("#startNewGameButton").click();
        setTimeout(function(){
            getMartingaleTile();
        },250);
    }
}
function getMartingaleTile(){
    if($("#board").children("li").length){
        console.log("Choosing tile.");
        var tile = $("#tile").val();
        console.log("Clicking tile "+tile+".");
        $(".tile:eq("+(tile-1)+")").click();
        getWin(parseFloat($("#bet").val()));
    } else {
        setTimeout(function(){
            getMartingaleTile();
        },100);
    }
}
function checkSimpleGame(){
    console.log("Checking if you may start.");
    if(game){
        var lMpl = (parseFloat($("#sLoss").val())===0)?1:parseFloat($("#sLoss").val());
        var wMpl = (parseFloat($("#sWin").val())===0)?1:parseFloat($("#sWin").val());
        var mBet = parseFloat($("#sStopBet").val());
        var bet = parseFloat($("#sBet").val());
        if(lost){
            if((preBet*lMpl)<mBet){
                console.log("You can go on!");
                goOn=true;
                preBet *= lMpl;
                newSimpleGame();
            } else {
                console.log("Abort mission!");
                goOn=false;
                lost=false;
                preBet=0;
                doBtnWork();
            }
        } else {
            if((preBet*wMpl)<mBet){
                console.log("You can go on!");
                goOn=true;
                preBet *= wMpl;
                newSimpleGame();
            } else {
                console.log("Abort mission!");
                goOn=false;
                lost=false;
                preBet=0;
                doBtnWork();
            }
        }
    }
}
function newSimpleGame(){
    console.log("Starting new game.");
    if(goOn){
        var bet = Math.round(preBet*100)/100;
        $(".customBombsButton").click();
        $("#customBombs").val(parseInt($("#sBomb").val()));
        $("#bet").val(parseFloat(bet));
        tileClicked.length = 0; tileClicked = [];
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){} else {
            setBet(parseFloat(bet));
            setBombs(parseInt($("#sBomb").val()));
        }
        $("#startNewGameButton").click();
        setTimeout(function(){
            getSimpleTile();
        },250);
    }
}
function getSimpleTile(){
    if($("#board").children("li").length){
        console.log("Choosing tile.");
        var tile = getFixedTile($("#sFixedTile").val());
        console.log("Clicking tile "+tile+".");
        $(".tile:eq("+(tile-1)+")").click();
        getWin(parseFloat($("#bet").val()));
    } else {
        setTimeout(function(){
            getSimpleTile();
        },100);
    }
}
function getWin(bet){
    console.log("Getting stake.");
    var stake = parseFloat($("#stake_value").html());
    var gain = stake - bet;
    if(gain !== 0){
        var cons = $("#cons");
        var log = document.createElement("div");
            log.innerHTML = gain.toFixed(2) + "";
        setTimeout(function(){
            if(gain>0){
                console.log("You've won!");
                log.setAttribute("style","color:#8D4;font-weight:600;");
                log.innerHTML = "+ "+log.innerHTML;
                setProfit(true,gain);
                $("#cashoutButton").click();
            }else{
                console.log("You've lost!");
                log.setAttribute("style","color:#E74C3C;");
                log.innerHTML = "- "+log.innerHTML.replace("-","");
                setProfit(false,gain);
                $("#playAgainButton").click();
            }
            console.log("Adding output to console.");
            cons.append(log);
            $("#cons").animate({ scrollTop: $('#cons').prop("scrollHeight")}, 500);
            setTimeout(function(){
                $('#cons').find('div:first').remove();
            },550);
            if(method==1)
                checkRandomGame();
            else if(method==2)
                checkMartingaleGame();
            else if(method==3)
                checkSimpleGame();
        },500);
    } else{
        setTimeout(function(){
            getWin(bet);
        },100);
    }
}
function setProfit(win,gain){
    if(win){
        cinp.wins++;
        $("#wins").val(cinp.wins);
    } else {
        cinp.losses++;
        $("#losses").val(cinp.losses);
    }
    lost=(!win);
    cinp.prof += gain;
    $("#profit").val(Math.round(cinp.prof*100)/100);
}
