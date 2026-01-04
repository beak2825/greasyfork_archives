// ==UserScript==
// @name        MouseHunt - Valour Rift Simulator
// @author      Re, plasmoidia
// @version    	1.23
// @description Click the Boss icon beside the floor progress bar to simulate your run!
// @include	http://mousehuntgame.com/*
// @include	https://mousehuntgame.com/*
// @include	http://www.mousehuntgame.com/*
// @include	https://www.mousehuntgame.com/*
// @grant       none
// @namespace   https://greasyfork.org/users/413177
// @downloadURL https://update.greasyfork.org/scripts/393436/MouseHunt%20-%20Valour%20Rift%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/393436/MouseHunt%20-%20Valour%20Rift%20Simulator.meta.js
// ==/UserScript==

// Sets the display for the percentages
// Set to true or false depending on which display you want
var cumulativeDisplay = true
var exactDisplay = false
var useUConEclipse = false

const cacheLoot =
[[0,0],
[7,0],
[16,0],
[24,0],
[32,0],
[40,0],
[48,0],
[50,0],
[59,8],
[69,10],
[80,11],
[88,13],
[98,14],
[107,16],
[118,17],
[120,17],
[135,20],
[150,22],
[165,24],
[182,26],
[199,28],
[217,31],
[235,33],
[254,33],
[272,37],
[290,40],
[308,43],
[325,45],
[342,48],
[357,51],
[372,54],
[386,54],
[399,60],
[410,63],
[421,66],
[430,70],
[439,73],
[446,77],
[453,80],
[459,80],
[464,88],
[469,92],
[473,96],
[477,101],
[480,105],
[482,109],
[485,113],
[487,113],
[489,123],
[490,128],
[492,133],
[493,138],
[494,143],
[495,148],
[495,153],
[496,153],
[497,161],
[497,167],
[497,173],
[498,178],
[498,184],
[498,190],
[499,196],
[500,196],
[500,205],
[500,212],
[500,218],
[500,224],
[500,231],
[500,237],
[500,244],
[500,244],
[500,253],
[500,260],
[500,267],
[500,274],
[500,282],
[500,289],
[500,296],
[500,300]]

var normalAR = [[0.00000,0.00000,0.00000,0.00000],
                [0.00000,0.00000,0.00000,0.00000],
                [0.08246,0.05616,0.04866,0.04231],
                [0.08246,0.05616,0.04866,0.04231],
                [0.08246,0.05616,0.04866,0.04231],
                [0.08246,0.05616,0.04866,0.04231],
                [0.08246,0.05616,0.04866,0.04231],
                [0.08246,0.05616,0.04866,0.04231],
                [0.08246,0.05616,0.04866,0.04231],
                [0.00000,0.00000,0.00000,0.00000],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.01658,0.02836,0.04121],
                [0.00000,0.00000,0.00000,0.00000],
                [0.17073,0.06332,0.06193,0.08571],
                [0.04065,0.01583,0.02368,0.01978],
                [0.03252,0.01583,0.02732,0.01209],
                [0.00000,0.29288,0.11840,0.03626],
                [0.00000,0.00000,0.12750,0.07473],
                [0.00000,0.00000,0.00000,0.09725],
                [0.17886,0.10290,0.10200,0.08956],
                [0.00000,0.00000,0.00000,0.00000],
                [0.00000,0.00000,0.00000,0.00000]]

var umbraAR = [[0.00000,0.00000,0.00000,0.00000],
               [0.00000,0.00000,0.00000,0.00000],
               [0.06600,0.04129,0.03857,0.03100],
               [0.06600,0.04129,0.03857,0.03100],
               [0.06600,0.04129,0.03857,0.03100],
               [0.06600,0.04129,0.03857,0.03100],
               [0.06600,0.04129,0.03857,0.03100],
               [0.06600,0.04129,0.03857,0.03100],
               [0.06600,0.04129,0.03857,0.03100],
               [0.00000,0.00000,0.00000,0.00000],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.01043,0.01886,0.03600],
               [0.00000,0.00000,0.00000,0.00000],
               [0.11500,0.07200,0.06500,0.05600],
               [0.03800,0.02300,0.02000,0.01700],
               [0.02300,0.01400,0.01300,0.00900],
               [0.00000,0.23110,0.10806,0.03300],
               [0.00000,0.00000,0.09800,0.05500],
               [0.00000,0.00000,0.00000,0.08100],
               [0.18300,0.11200,0.10200,0.08000],
               [0.17900,0.18600,0.19200,0.20000],
               [0.00000,0.00000,0.00000,0.00000]]

var mouseDrops = [[0.00000,0.00000,0.00000,0.00000,1982],
                  [0.00000,0.00000,0.00000,0.00000,4250],
                  [0.60515,0.60515,0.00000,0.00000,1000],
                  [0.63774,0.63774,0.00000,0.00000,1250],
                  [0.56444,0.56444,0.00000,0.00000,1500],
                  [0.57674,0.57674,0.00000,0.00000,2000],
                  [0.63102,0.63102,0.00000,0.00000,2500],
                  [0.57209,0.57209,0.00000,0.00000,3000],
                  [0.59000,0.59000,0.00000,0.00000,4000],
                  [2.40541,0.98649,0.00000,0.00000,25000],
                  [0.01000,0.01000,1.10000,1.00000,6000],
                  [0.00000,0.00000,1.10000,1.00000,6000],
                  [0.00909,0.00909,1.10000,1.00000,6000],
                  [0.00000,0.00000,1.10000,1.00000,6000],
                  [0.00800,0.00800,1.10000,1.00000,6000],
                  [0.00826,0.00826,1.10000,1.00000,6000],
                  [0.03150,0.03150,1.10000,1.00000,6000],
                  [3.82927,1.00000,0.00000,0.00000,100000],
                  [0.01770,0.01770,0.00000,0.00000,2000],
                  [0.00000,0.00000,0.00000,0.00000,1500],
                  [0.01429,0.01429,0.00000,0.00000,1000],
                  [0.00643,0.00643,1.10000,1.00000,5000],
                  [0.00000,0.00000,1.15000,1.00000,5000],
                  [0.02475,0.02475,1.75000,1.00000,8000],
                  [0.99597,0.99396,0.00000,0.00000,4795],
                  [0.00000,0.00000,0.00000,0.00000,12000],
                  [0.00000,0.00000,0.00000,0.00000,0]]

var mouseStats = [[3300,1],
                  [5050,1],
                  [2900,1],
                  [6650,2],
                  [8800,3],
                  [11750,4],
                  [16000,5],
                  [21500,6],
                  [29000,7],
                  [7000000,1000],
                  [72000,9],
                  [72000,9],
                  [72000,9],
                  [72000,9],
                  [72000,9],
                  [72000,9],
                  [72000,9],
                  [13500000,1000],
                  [4800,1.75],
                  [8250,1.75],
                  [23000,1.75],
                  [38000,10],
                  [150000,25],
                  [350000,50],
                  [100,2],
                  [818250,75],
                  [1e30,1]]

function getCacheLoot(floor){
    var idx = floor > 1 ? (floor - 1) : 0
    if(idx >= cacheLoot.length) { idx = cacheLoot.length-1 }
    var loot = cacheLoot[idx]
    return loot
}

function convertToCR(power,luck,stats){
    var mPower = stats[0]
    var mEff = stats[1]
    return Math.min(1, (power*mEff + 2*Math.pow(luck*Math.min(mEff,1.4),2)) / (mPower + power*mEff))
}

function simulate() {
    var time = (new Date()).getTime()/1000

    // Building catchProfile ------------------------------------------------------------------------

    var lvSpeed = window.user.enviroment_atts.power_up_data.long_stride.current_value
    var lvSync = window.user.enviroment_atts.power_up_data.hunt_limit.current_level + 1
    var lvSiphon = window.user.enviroment_atts.power_up_data.boss_extension.current_level + 1
    var siphon = window.user.enviroment_atts.power_up_data.boss_extension.current_value
    var sync = window.user.enviroment_atts.hunts_remaining
    var steps = window.user.enviroment_atts.current_step
    var torchState = window.user.enviroment_atts.is_fuel_enabled
    var torchEclipse = true
    var umbra = window.user.enviroment_atts.active_augmentations.tu
    var superSiphon = window.user.enviroment_atts.active_augmentations.ss
    var strStep = window.user.enviroment_atts.active_augmentations.sste
    const curFloor = window.user.enviroment_atts.floor
    const sh = window.user.enviroment_atts.active_augmentations.hr
    const sr = window.user.enviroment_atts.active_augmentations.sr
    var bail = 999 // this is only here so I don't have to maintain two versions of this code :^)

    var power = window.user.trap_power
    var luck = (window.user.trinket_name == "Ultimate Charm")
        ? 100000
        : window.user.trap_luck

    try{
        var altpower = Number(document.getElementsByClassName("campPage-trap-trapStat power")[0].children[1].innerText.match(/[0-9]/g).join(""))
        var altluck = Number(document.getElementsByClassName("campPage-trap-trapStat luck")[0].children[1].innerText)
        power = Number.isNaN(altpower)
            ? power
        : Math.max(power,altpower)
        luck = Number.isNaN(altluck)
            ? luck
        : Math.max(luck,altluck)
    }
    catch(err){console.log(err)}

    // debugging section
    if(false){
        torchState = true
        umbra = false
        superSiphon = false
        strStep = false

        lvSpeed = 5

        steps = 48
        sync = 1
        siphon = 10
        power = 6825
        luck = 53
    }

    var mouseCR = mouseStats.map(function(stats){return convertToCR(power,luck,stats)})
    if(useUConEclipse){
        mouseCR[9] = 1
        mouseCR[17] = 1
    }
    console.log(mouseCR)
    var mouseAR = umbra
        ? umbraAR
        : normalAR
    var eclipseCR = umbra
        ? mouseCR[17]
        : mouseCR[9]
    var eclipseSG = umbra
        ? mouseDrops[17][0]
        : mouseDrops[9][0]
    var eclipseSC = umbra
        ? mouseDrops[17][2]
        : mouseDrops[9][2]
    var eclipseGold = umbra
        ? mouseDrops[17][4]
        : mouseDrops[9][4]
    var catchProfile = {
        push: [eclipseCR],
        ta: [0],
        kb: [1-eclipseCR],
        bkb: [0],
        fta: [0],
        sg: [eclipseSG*eclipseCR],
        sgi: [0],
        sc: [eclipseSC*eclipseCR],
        sci: [0],
        gold: [eclipseGold*eclipseCR],
        cf: [0]
    }

    for(var j = 1; j <= 4; j++){
        catchProfile.ta[j] = mouseCR[24] * mouseAR[24][j-1]
        catchProfile.bkb[j] = (1 - mouseCR[25]) * mouseAR[25][j-1]
        catchProfile.fta[j] = 0
        catchProfile.sg[j] = 0
        catchProfile.sgi[j] = 0
        catchProfile.sc[j] = 0
        catchProfile.sci[j] = 0
        catchProfile.gold[j] = 0
        catchProfile.cf[j] = 0
        catchProfile.push[j] = -catchProfile.ta[j]
        mouseCR.map(function(cr,index){
            catchProfile.push[j] += cr*mouseAR[index][j-1]
            catchProfile.sg[j] += cr*mouseAR[index][j-1]*mouseDrops[index][0]
            catchProfile.sgi[j] += cr*mouseAR[index][j-1]*mouseDrops[index][1]
            catchProfile.sc[j] += cr*mouseAR[index][j-1]*mouseDrops[index][2]
            catchProfile.sci[j] += cr*mouseAR[index][j-1]*mouseDrops[index][3]
            catchProfile.gold[j] += cr*mouseAR[index][j-1]*mouseDrops[index][4]
        })
        catchProfile.kb[j] = 1 -catchProfile.ta[j] - catchProfile.bkb[j] - catchProfile.push[j]
    }
    console.log(catchProfile)

    var speed = torchState ? Number(lvSpeed) + 1 : lvSpeed
    siphon = superSiphon ? siphon*2 : siphon

     // Simulating Run ------------------------------------------------------------------------

    var sigils = 0
    var secrets = 0
    var gold = 0
    var cfDrops = 0
    var totalHunts = 0
    var catches = 0

    function addRate(step,hunts,change){
        if(runValues[step] == null){
            runValues[step] = []
        }
        if(runValues[step][hunts] == null){
            runValues[step][hunts] = 0
        }
        runValues[step][hunts] += change
    }

    function stepBuild(step){
        stepDetails[step] = {}
        var lap = Math.floor(Math.pow(step/35 + 2809/1225, 0.5) - 53/35) + 1
        var checkLap = Math.floor(Math.pow((step + 1)/35 + 2809/1225, 0.5) - 53/35) + 1
        var toEC = checkLap * (106 + 35 * (checkLap)) - 1
        var floorLength = 10 * (lap + 1)
        var onEC = lap * (106 + 35 * (lap)) - 1
        var flFromEC = Math.ceil((onEC - step)/floorLength)
        var floorStart = onEC - flFromEC*floorLength
        stepDetails[step].floor = lap*8 - flFromEC
        stepDetails[step].sync = siphon * (lap - 1) - syncSpent
        stepDetails[step].toPush = (flFromEC == 0)
            ? Math.min(step + speed - torchState + torchEclipse, toEC)
            : Math.min(step + speed, toEC)
        stepDetails[step].toTA = strStep
            ? Math.min(step + 4*speed, toEC) // string stepping
            : Math.min(step + 2*speed, toEC) // normal TA
        stepDetails[step].toKB = umbra === true
            ? Math.max(step - 5, floorStart) // knockback
            : Math.max(step, floorStart) // normal run FTC
        stepDetails[step].toBKB = Math.max(step - 10, floorStart) // bulwarked
        if(flFromEC == 0) lap = 0
        lap = Math.min(lap, 4)
        stepDetails[step].cPush = catchProfile.push[lap]
        stepDetails[step].cTA = catchProfile.ta[lap]
        stepDetails[step].cKB = catchProfile.kb[lap]
        stepDetails[step].cBKB = catchProfile.bkb[lap]
        stepDetails[step].cFTA = catchProfile.fta[lap]
        stepDetails[step].sg = catchProfile.sg[lap]
        stepDetails[step].sgi = catchProfile.sgi[lap]
        stepDetails[step].sc = catchProfile.sc[lap]
        stepDetails[step].sci = catchProfile.sci[lap]
        stepDetails[step].gold = catchProfile.gold[lap]
        stepDetails[step].cf = catchProfile.cf[lap]
    }

    var syncSpent = 0
    var valuesDistribution = Array(500)
    for(var i = 0; i < 500; i++) valuesDistribution[i] = []
    var stepDetails = []
    var loopActive = 1
    var startActive = steps
    var endActive = steps
    var loopEnd

    for(var k = 0; k < valuesDistribution.length; k++){
        valuesDistribution[k][0] = 0
    }
    var runValues = []
    for(var step = 0; step < steps; step++){
        runValues[step] = []
        runValues[step][0] = 0
    }
    runValues[steps] = [1]

    stepBuild(steps)
    syncSpent = stepDetails[steps].sync - sync
    stepBuild(steps)

    // runDetails[step][detail] = value
    // detail: lap (0), toEC (1), fltoEC (2)
    // runValues[step][hunts] = probability

    for(var hunts = 1; loopActive == 1; hunts++){
        loopActive = 0
        loopEnd = endActive
        for(step = startActive; step <= loopEnd; step++){
            if(runValues[step] == null){
                runValues[step] = []
            }
            else{
                var rate = runValues[step][hunts-1]
                if(rate != null && rate > 1e-8){
                    if(stepDetails[step] == null){
                        stepBuild(step)
                    }
                    gold += rate*stepDetails[step].gold
                    cfDrops += rate*stepDetails[step].cf
                    sigils += rate*stepDetails[step].sg
                    secrets += rate*stepDetails[step].sc
                    if((torchState && (stepDetails[step].floor % 8 != 0)) || (torchEclipse && (stepDetails[step].floor % 8 == 0))){
                        sigils += rate*stepDetails[step].sgi
                        secrets += rate*stepDetails[step].sci
                    }
                    if(hunts <= stepDetails[step].sync && rate != 0 && stepDetails[step].floor < bail){
                        loopActive = 1
                        startActive = Math.min(startActive,stepDetails[step].toBKB)
                        endActive = Math.max(endActive,stepDetails[step].toTA)
                        addRate(stepDetails[step].toPush,hunts,rate*stepDetails[step].cPush)
                        addRate(stepDetails[step].toTA,hunts,rate*stepDetails[step].cTA)
                        addRate(stepDetails[step].toKB,hunts,rate*stepDetails[step].cKB)
                        addRate(stepDetails[step].toBKB,hunts,rate*stepDetails[step].cBKB)
                        addRate(step,hunts,rate*stepDetails[step].cFTA) // FTA
                        catches += rate*(stepDetails[step].cPush + stepDetails[step].cTA)
                    }
                    else if(hunts - 1 == stepDetails[step].sync || stepDetails[step].floor >= bail){
                        totalHunts += (hunts-1)*rate
                        valuesDistribution[stepDetails[step].floor - 1][0] += rate
                    }
                }
            }
        }
    }

    // Results Display ------------------------------------------------------------------------

    var averageFloor = 0
    valuesDistribution.map(function(a,b){averageFloor += a*(b+1)})

    var loopDistribution = Array(25).fill(0).map(
        function(a,index){
            var sum = 0
            valuesDistribution.slice(index * 8, (index + 1) * 8).map(
                function(a){
                    sum += Number(a)
                }
            )
            return Number(sum)
        }
    )

    var runningProbability = 1
    var loopCumulative = loopDistribution.map(function(a){
        var result = runningProbability
        runningProbability -= a
        return result
    })
    var loopCopy = loopDistribution.slice(0).filter(function(a){return a > 0.001})


    const avgFloor = Math.round(averageFloor)
    const curCache = getCacheLoot(curFloor)
    const avgCache = getCacheLoot(avgFloor)
    const mult = [sh ? 1.5 : 1.0, sr ? 1.5 : 1.0]
    const deltaCache = [Math.ceil(avgCache[0]*mult[0]) - Math.ceil(curCache[0]*mult[0]), Math.ceil(avgCache[1]*mult[1]) - Math.ceil(curCache[1]*mult[1])]

    var display = ["VRift Sim: "+lvSpeed+"/"+lvSync+"/"+lvSiphon+(torchState ? " CF" : "")+(superSiphon ? " SS" : "")+(umbra ? " UU" : "")+(strStep ? " SSt" : "")+(useUConEclipse ? " (UC Eclipse)" : ""),
                   "Steps: " + steps + "    Sync: " + sync,
                   "Power: " + power + "    Luck: " + luck,
                   "Average Highest Floor: " + avgFloor + ",    Average Hunts: " + Math.round(totalHunts),
                   "| Loot:  Sigils: +" + Math.round(sigils) + ",    Secrets: +" + Math.round(secrets),
                   "| Cache: Sigils: +" + deltaCache[0] + ",    Secrets: +" + deltaCache[1],
                   ""]
    var startDisplay = display.length
    var fullDisplay = ["VRift Run Simulation: " + ((new Date()).getTime()/1000 - time) + " seconds taken.",
                       "Speed: " + lvSpeed,
                       "Siphon: " + siphon,
                       (torchState ? "CF " : "")+(superSiphon ? "SS " : "")+(umbra ? "UU " : "")+(strStep ? "SSt " : ""),
                       "Steps: " + steps,
                       "Sync: " + sync,
                       "Power: " + power,
                       "Luck: " + luck,
                       "Sigils: " + sigils,
                       "Secrets: " + secrets,
                       "Gold: " + gold,
                       "Average Highest Floor: " + Math.round(averageFloor),
                       "Average Hunts: " + Math.round(totalHunts),
                       ""]

    var startFullDisplay = fullDisplay.length

    for(i = 0; i < loopCopy.length; i++){
        var loopIndex = loopDistribution.indexOf(loopCopy[i])

        var eEntry = (loopCopy[i]*100).toFixed(1)
        var cEntry = (loopCumulative[loopIndex]*100).toFixed(1)
        var entry = "Eclipse #" + loopIndex.toString() + ": "
        var fullEntry = entry + eEntry +"% (" + cEntry + "% cumulative)"
        if(exactDisplay && cumulativeDisplay){
            entry = fullEntry
        }
        else if(cumulativeDisplay){
            entry += cEntry + "%"
        }
        else{
            entry += eEntry + "%"
        }

        display[startDisplay + i] = entry
        fullDisplay[startFullDisplay + i] = fullEntry
    }

    console.log(fullDisplay.join("\n"))
    alert(display.join("\n"))
}

function addButton(){
    if(document.getElementsByClassName("valourRiftHUD-floorProgress-boss").length > 0){
        document.getElementsByClassName("valourRiftHUD-floorProgress-boss")[0].style["box-shadow"] = "0px 0px 5px 3px #F00"
        document.getElementsByClassName("valourRiftHUD-floorProgress-boss")[0].onclick = simulate
        document.getElementsByClassName("valourRiftHUD-floorProgress")[0].getElementsByClassName("mousehuntTooltip-arrow")[0].onclick = simulate
    }
}

window.onload = addButton