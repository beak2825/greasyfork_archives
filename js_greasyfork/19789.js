// ==UserScript==
// @name         BitMiner
// @namespace    http://aljotica.eu/
// @version      1.3.6
// @description  Bot for bitmine.xyz, with new methods, tips are welcome!
// @author       JohnAxae
// @match        http://bitmine.xyz/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/19789/BitMiner.user.js
// @updateURL https://update.greasyfork.org/scripts/19789/BitMiner.meta.js
// ==/UserScript==

var tileClicked=[], game=false, goOn=false, method=1, preBet=0, tries=0, lost=false, dev=false;
var xinp = {wins:0,losses:0,prof:0};
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
var clbl = ["cDelayBet","sDelayCash","sDelayNew"];
var cLab = ["Bet Delay (ms)","Cashout Delay (ms)","New Game Delay (ms)"];
var cInf = ["Delay between bets in miliseconds. 0: no delay.","Delay before cashout in miliseconds. 0: no delay.","Delay before new game in miliseconds. 0: no delay."];
var cinp = [0,0,0];

(function() {
    if(dev) loadTerminal();
    terminal("Welcome to JohnAxae's Bitminer!");
    loadSettings();
    setTabs();
    if(dev) setTerminal();
    setConsole();
    setOptions();
    $('.tabular.menu .item').tab();
    $('label').popup();
    setCells();
    terminal("Everything loaded, go your game!");
})();
function loadTerminal(){
    var div = document.createElement("div");
        div.setAttribute("id","term");
        div.setAttribute("class","display:none;");
    document.body.appendChild(div);
}
function setTerminal(){
    var term = document.getElementById("tTerm");
    term.appendChild(createOptionRow("tOp",89,0));
    var tOld = document.getElementById("term");
    var tNew = document.getElementById("tOp");
        tNew.innerHTML=tOld.innerHTML;
        $("#term").remove();
        tNew.setAttribute("style","background:#000;color:#FFF;font-family:monospace;overflow-y:hidden;height:89px;");
        tNew.setAttribute("id","term");
}
function terminal(log){
    if(dev){
        $("#term").append("<div>> "+log+"</div>");
        $("#term").animate({ scrollTop: $('#term').prop("scrollHeight")}, 100);
    } else console.log(log);
}
function getSettings(lbl,inp){
    for(var i=0; i<lbl.length; i++){
        if(lbl[i]=="stopMaxTries") inp[i]=GM_getValue(lbl[i],inp[i]);
        else if(lbl[i]=="rFixedTile"||lbl[i]=="sFixedTile") inp[i]=GM_getValue(lbl[i],inp[i]);
        else inp[i]=parseFloat(GM_getValue(lbl[i],inp[i]));
        if(GM_getValue(lbl[i]) === undefined){
            if(lbl[i]=="stopMaxTries") GM_setValue(lbl[i],inp[i]);
            else if(lbl[i]=="rFixedTile"||lbl[i]=="sFixedTile") GM_setValue(lbl[i],inp[i]);
            else GM_setValue(lbl[i],parseFloat(inp[i]));
        }
    }
}
function setSettings(lbl,inp){
    for(var i=0; i<lbl.length; i++){
        if(lbl[i]=="stopMaxTries"){
             GM_setValue(lbl[i],$("#"+lbl[i]).prop('checked'));
             inp[i]=GM_getValue(lbl[i]);

        } else if(lbl[i]=="rFixedTile"||lbl[i]=="sFixedTile"){
            GM_setValue(lbl[i],$("#"+lbl[i]).val());
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
    getSettings(clbl,cinp);
}
function saveSettings(){
    setSettings(rlbl,rinp);
    setSettings(mlbl,minp);
    setSettings(slbl,sinp);
    setSettings(clbl,cinp);
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
    tabs.appendChild(createOptions("tab",0,"<i class='icon options'></i>","settings",0));
    $(".item:eq(0)").attr("title","settings");
    if(dev){
        tabs.appendChild(createOptions("tab",0,"<i class='icon terminal'></i>","terminal",0));
        $(".item:eq(1)").attr("title","console");
    }
    tabs.appendChild(createOptions("tab",1,"Random clicks","random",1));
    tabs.appendChild(createOptions("tab",0,"Simple","simple",3));
    tabs.appendChild(createOptions("tab",0,"Martingale","martingale",2));
    tabs.appendChild(createOptions("tab",0,"Suggest more","",0));
    conf.appendChild(tabs);
    conf.appendChild(createOptions("con",1,"con1","random",1));
    conf.appendChild(createOptions("con",0,"con2","martingale",2));
    conf.appendChild(createOptions("con",0,"con3","simple",3));
    conf.appendChild(createOptions("con",0,"conf","settings",0));
    if(dev) conf.appendChild(createOptions("con",0,"tTerm","terminal",0));
    document.body.appendChild(conf);
}
function setConsole(){
    terminal("Loading console");
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
    var conf = document.getElementById("conf");
    con1.appendChild(createOptionRow("rOp1",37,10));
    con1.appendChild(createOptionRow("rOp2",37,5));
    con2.appendChild(createOptionRow("mOp1",37,10));
    con2.appendChild(createOptionRow("mOp2",37,5));
    con3.appendChild(createOptionRow("sOp1",37,10));
    con3.appendChild(createOptionRow("sOp2",37,5));
    conf.appendChild(createOptionRow("cOp1",37,10));
    conf.appendChild(createOptionRow("cOp2",37,5));
    cCon.appendChild(createOptionRow("xOp1",37,5));
    cCon.appendChild(createOptionRow("xOp2",37,5));
    document.body.appendChild(cCon);
    return true;
}
function setOptions(){
    setStartButton();
    var xlbl = ["wins","losses","profit"];
    var xLab = ["Wins","Losses","Profit"];
    var xInf = ["","",""];
    setOpts("console","xOp2","xOp2",xlbl,xLab,xinp,xInf);
    setOpts("random","rOp1","rOp2",rlbl,rLab,rinp,rInf);
    setOpts("martingale","mOp1","mOp2",mlbl,mLab,minp,mInf);
    setOpts("simple","sOp1","sOp2",slbl,sLab,sinp,sInf);
    setOpts("settings","cOp1","cOp2",clbl,cLab,cinp,cInf);
}
function setStartButton(){
    var opt1 = document.getElementById("xOp1");
    $("#game_allbets_log table").addClass("small compact");
    terminal("Adding button");
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
    terminal("Adding options for "+name);
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
            if(name=="console") terminal(inp[i]);
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
    terminal("Loading cell values");
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
        terminal("Mission aborted!");
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
    terminal("Checking if you may start.");
    if(game){
        var newDelay = parseInt($("#cDelayNew").val());
        var round = $("#rounds").val();
        var mProf = parseFloat($("#maxProfit").val());
        var mLoss = parseFloat($("#maxLoss").val()) * -1;
        var bet = parseInt($("#bits").val());
        if(round>0 && (cinp.prof-bet)>=mLoss && cinp.prof<mProf){
            round = parseInt(round)-1;
            terminal("You can go on!");
            goOn=true;
            setTimeout(function(){
                newRandomGame();
            },newDelay);
        } else {
            terminal("Abort mission!");
            doBtnWork();
            goOn=false;
        }
    }
}
function newRandomGame(){
    terminal("Starting new game.");
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
        terminal("Choosing a tile.");
        var tile = getFixedTile($("#rFixedTile").val());
        terminal("Clicking tile "+(tile+1)+".");
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
function getFixedTile(fixedTiles){
    var tile;
    if(parseInt(fixedTiles)!==0){
        var tiles = fixedTiles.split(",");
        if(tiles.length==1) tile = parseInt(tiles)-1;
        else tile = parseInt(tiles[tileClicked.length])-1;
    } else {
        tile = newTile();
    }
    tileClicked.push(tile);
    return tile;
}
function checkNewTile(){
    if($("#board").children(".pressed").length == tileClicked.length){
        var betDelay = parseInt($("#cDelayBet").val()), cashDelay = parseInt($("#cDelayCash"));
        if(tileClicked.length < $("#maxClicks").val()){
            var next = parseFloat($("#next_value").html());
            if(next!==0){
                terminal("Can choose another tile!");
                setTimeout(function(){
                    getRandomTile();
                },betDelay);
            } else {
                terminal("Can't choose another tile!");
                setTimeout(function(){
                    getWin(parseFloat($("#bits").val()));
                },cashDelay);
            }
        } else{
            setTimeout(function(){
                setTimeout(function(){
                    getWin(parseFloat($("#bits").val()));
                },cashDelay);
                terminal("Can't choose another tile too!");
            },100);
        }
    } else {
        setTimeout(function(){
            checkNewTile();
        },100);
    }
}
function checkMartingaleGame(){
    terminal("Checking if you may start.");
    if(game){
        var newDelay = parseInt($("#cDelayNew").val());
        var stopMaxTries = $("#stopMaxTries").val();
        var maxTries = parseFloat($("#maxTries").val());
        var bet = parseInt($("#bit").val());
        if(tries<maxTries || lost){
            tries++;
            terminal("You can go on!");
            goOn=true;
            setTimeout(function(){
                newMartingaleGame();
            },newDelay);
        } else if(tries>=maxTries && stopMaxTries===1 ){
            terminal("Abort mission!");
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
            terminal("Abort mission!");
            goOn=false;
            lost=false;
            doBtnWork();
        }
    }
}
function newMartingaleGame(){
    terminal("Starting new game.");
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
        cashDelay = parseInt($("#cDelayCash"));
        terminal("Choosing tile.");
        var tile = $("#tile").val();
        terminal("Clicking tile "+tile+".");
        $(".tile:eq("+(tile-1)+")").click();
        setTimeout(function(){
            getWin(parseFloat($("#bet").val()));
        },cashDelay);
    } else {
        setTimeout(function(){
            getMartingaleTile();
        },100);
    }
}
function checkSimpleGame(){
    terminal("Checking if you may start.");
    if(game){
        var newDelay = parseInt($("#cDelayNew").val());
        var lMpl = (parseFloat($("#sLoss").val())===0)?1:parseFloat($("#sLoss").val());
        var wMpl = (parseFloat($("#sWin").val())===0)?1:parseFloat($("#sWin").val());
        var mBet = parseFloat($("#sStopBet").val());
        var bet = parseFloat($("#sBet").val());
        if(lost){
            if((preBet*lMpl)<mBet){
                terminal("You can go on!");
                goOn=true;
                preBet *= lMpl;
                setTimeout(function(){
                    newSimpleGame();
                },newDelay);
            } else {
                terminal("Abort mission!");
                goOn=false;
                lost=false;
                preBet=0;
                doBtnWork();
            }
        } else {
            if((preBet*wMpl)<mBet){
                terminal("You can go on!");
                goOn=true;
                preBet *= wMpl;
                setTimeout(function(){
                    newSimpleGame();
                },newDelay);
            } else {
                terminal("Abort mission!");
                goOn=false;
                lost=false;
                preBet=0;
                doBtnWork();
            }
        }
    }
}
function newSimpleGame(){
    terminal("Starting new game.");
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
        cashDelay = parseInt($("#cDelayCash"));
        terminal("Choosing tile.");
        var tile = getFixedTile($("#sFixedTile").val());
        terminal("Clicking tile "+tile+".");
        $(".tile:eq("+(tile-1)+")").click();
        setTimeout(function(){
            getWin(parseFloat($("#bet").val()));
        },cashDelay);
    } else {
        setTimeout(function(){
            getSimpleTile();
        },100);
    }
}
function getWin(bet){
    terminal("Getting stake.");
    var stake = parseFloat($("#stake_value").html());
    var gain = stake - bet;
    if(gain !== 0){
        var cons = $("#cons");
        var log = document.createElement("div");
            log.innerHTML = gain.toFixed(2) + "";
        setTimeout(function(){
            if(gain>0){
                terminal("You've won!");
                log.setAttribute("style","color:#8D4;font-weight:600;");
                log.innerHTML = "+ "+log.innerHTML;
                setProfit(true,gain);
                $("#cashoutButton").click();
            }else{
                terminal("You've lost!");
                log.setAttribute("style","color:#E74C3C;");
                log.innerHTML = "- "+log.innerHTML.replace("-","");
                setProfit(false,gain);
                $("#playAgainButton").click();
            }
            terminal("Adding output to console.");
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
