// ==UserScript==
// @name         [MH] Floating Islands Helper SEH Edition
// @author       Re
// @version    	 2.4
// @description  Floating islands etc etc
// @include	     http://mousehuntgame.com/*
// @include	     https://mousehuntgame.com/*
// @include	     http://www.mousehuntgame.com/*
// @include	     https://www.mousehuntgame.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/413177
// @downloadURL https://update.greasyfork.org/scripts/425226/%5BMH%5D%20Floating%20Islands%20Helper%20SEH%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/425226/%5BMH%5D%20Floating%20Islands%20Helper%20SEH%20Edition.meta.js
// ==/UserScript==

let re = {
    wait: function(selectorTxt,actionFunction,bWaitOnce,iframeSelector){
        var targetNodes, btargetsFound
        if(typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt)
        else
            targetNodes = $(iframeSelector).contents().find(selectorTxt)

        if(targetNodes && targetNodes.length > 0){
            btargetsFound = true
            targetNodes.each(function(){
                var jThis = $(this)
                var alreadyFound = jThis.data ('alreadyFound') || false

                if(!alreadyFound){
                    var cancelFound = actionFunction(jThis)
                    if(cancelFound)
                        btargetsFound = false
                    else
                        jThis.data ('alreadyFound', true)
                }
            })
        }
        else{
            btargetsFound = false
        }
        var controlObj = re.wait.controlObj || {}
        var controlKey = selectorTxt.replace (/[^\w]/g, "_")
        var timeControl = controlObj[controlKey]
        if(btargetsFound && bWaitOnce && timeControl){
            clearInterval (timeControl)
            delete controlObj [controlKey]
        }
        else{
            if(!timeControl){
                timeControl = setInterval(function(){
                    re.wait(selectorTxt,actionFunction,bWaitOnce,iframeSelector)
                },300)
                controlObj[controlKey] = timeControl
            }
        }
        re.wait.controlObj = controlObj
    }
}

let fi = {
    data: {"islandRates":{"arcane":{"common":0.26198475775721286,"low":0.6936247916234288,"lowGold":11245.22830992859,"high":0.8878404269238934,"highGold":15799.482758946251,"paragon":0.3459787222417359,"snipe":130,"lowRich":0.6611945247004215,"highRich":0.6611945247004215},
                          "forgotten":{"common":0.2429031511244428,"low":0.6343184560384143,"lowGold":10471.459549664443,"high":0.7988036885648433,"highGold":14510.374549240063,"paragon":0.3280895718312034,"snipe":130,"lowRich":0.6241843642317749,"highRich":0.6241843642317749},
                          "hydro":{"common":0.26763019360452467,"low":0.6535586506235331,"lowGold":10378.271134929395,"high":0.8260745698938399,"highGold":16293.05987042952,"paragon":0.30581930870083435,"snipe":130,"lowRich":0.7010971786833856,"highRich":0.7010971786833856},
                          "shadow":{"common":0.2611965971418977,"low":0.6762552874086132,"lowGold":10976.31112867566,"high":0.8569385117786437,"highGold":15406.512093544727,"paragon":0.31270631091418677,"snipe":130,"lowRich":0.653775785795185,"highRich":0.653775785795185},
                          "draconic":{"common":0.26210495795882865,"low":0.6902824949844624,"lowGold":11136.43474608945,"high":0.8978711216341956,"highGold":16082.134390120775,"paragon":0.5131295504162156,"snipe":130,"lowRich":0.6830554439533949,"highRich":0.6830554439533949},
                          "law":{"common":0.24865853658536585,"low":0.71,"lowGold":11447.385365853657,"high":0.9518267762425513,"highGold":20062.543451640362,"paragon":0.47524381442083163,"snipe":130,"lowRich":0.5983977232856419,"highRich":0.5983977232856419},
                          "physical":{"common":0.26978307814310987,"low":0.6831336405438818,"lowGold":10640.711321181658,"high":0.8608190805139793,"highGold":17060.818735072935,"paragon":0.2775477983287954,"snipe":130,"lowRich":0.6938349306250894,"highRich":0.6938349306250894},
                          "tactical":{"common":0.2701849869959045,"low":0.6922157624583332,"lowGold":11207.860365591076,"high":0.8855046022187443,"highGold":18082.350149615602,"paragon":0.33369908641518603,"snipe":130,"lowRich":0.6986130341930488,"highRich":0.6986130341930488},
                          "warden":0.4894927874451577,"pirate":{"cr":[0,0.8859222338218755,0.6611566986757194],"cloudbeard":[0,0,0.1427954576535598],"gold":[0,15599.371916565235,19725.98877436674],"seal":[0,0.8859222338218755,1.529892708240837]},
                          "richGold":50145,"iterations":16700,"glass":4,"ore":4,"curd":2,"loot":2,"corsair":2},
           "itemValues":{"sb":11500,"curd":0.17391304347826086,"curdRate":1,"cloud":0.2608695652173913,"wind":6.763217391304348,"stone":2.608695652173913,"jewel":1159.4202608695653,"hunt":23.590542548496643,"mat":0.06763217391304348,"corsair":2.0004037040673905,"swiss":20.504037040673907,"swissRate":10,"seal":21.032909565217405,"sealTrove":3.2405728985507247,"seal4":21.03290956521739,"seal5":20.94355415019763},
           "reroll":[-249.99403224281295,-258.77171489045696,-275.5159534173649,-317.84523577430406,513.7416594791143]},
  lineValue: function(type,isHigh,hasSnipe,... tiles){
    let profile = fi.dropProfile(type,isHigh,... tiles)
    let bossCR = isHigh ? fi.data.islandRates.warden : fi.data.islandRates[type].paragon
    let shrinePos = (tiles.indexOf(0) == -1) ? 4 : tiles.indexOf(0)
    // profile: value,cr,speed,mat,curds,corsair,wind,stone,seal,windstate,pirate
    // result: value,hunts,mat,curds,corsair,pirate1,pirate2,seals,wind,stone
    let result = {
      value: 0,
      hunts: 0,
      mat: 0,
      curd: 0,
      corsair: 0,
      pirate1: 0,
      pirate2: 0,
      seal: 0,
      wind: 0,
      stone: 0,
      shrine: shrinePos,
      type: type
    }
    let trove = {
      value: (isHigh ? 100000 : 20000)/fi.data.itemValues.sb + (isHigh ? 0.05 :0.01)*fi.data.itemValues.jewel,
      curd: isHigh ? 20 : 5,
      wind: isHigh ? 3 : 1,
      stone: isHigh ? 2.6 : 0.6
    }
    trove.value += trove.curd*fi.data.itemValues.curd
    trove.value += trove.wind*fi.data.itemValues.wind
    trove.value += trove.stone*fi.data.itemValues.stone
    // shrinePos is shrine position (1,2,3 or 4, 0 means shrineless)
    let pdf = Array(75)
    for(let i = 0; i < 75; i++){
      pdf[i] = Array(41)
      for(let j = 0; j < 41; j++){
        pdf[i][j] = Array(42).fill(0)
      }
    }
    pdf[0][0][0] = 1
    // i = hunts (done), j = windProg, k = bossProg
    let huntDist = [0,0,0,0] // section 1/2/3/4
    for(let i = 0; i < 75; i++){
      for(let j = 0; j < 41; j++){
        for(let k = 0; k < 42; k++){
          if(pdf[i][j][k] <= 1e-5){} // don't simulate
          else if(((k == 41) || (shrinePos == 4)) && (j == 40)){
            if(profile[3].value > 0){
              huntDist[3] += pdf[i][j][k]*(75-i)
            }
            // get trove
            Object.entries(trove).map(function(a){
              result[a[0]] += a[1]*pdf[i][j][k]
            })
          }
          else if(j+k >= 40 && k != 41 && shrinePos != 4){
            let level = Math.min(Math.floor(j/10),3)
            if(i < 74){
              let speed = (shrinePos <= level + 1) + 1
              pdf[i+1][Math.min(j+speed,40)][41] += pdf[i][j][k]*bossCR
              pdf[i+1][Math.max(j-1,10*Math.floor(j/10))][Math.min(k+1,40)] += pdf[i][j][k]*(1-bossCR)
            }
            if(isHigh){
              result.value += (fi.data.islandRates[type].snipe*hasSnipe + 80000/fi.data.itemValues.sb)*bossCR*pdf[i][j][k]
            }
            result.value += (fi.data.itemValues.stone + 20000/fi.data.itemValues.sb)*bossCR*pdf[i][j][k]
            result.stone += bossCR*pdf[i][j][k]
            result.hunts += pdf[i][j][k]
            /// add boss drops, maybe trove
          }
          else{
            let level = Math.min(Math.floor(j/10),3)
            let totalCR = profile[level].cr
            let speed = profile[level].speed
            if(i < 74){
              pdf[i+1][Math.min(j+speed,40)][k] += pdf[i][j][k]*(totalCR)
              pdf[i+1][j][k == 41 ? 41 : Math.min(k+1,40)] += pdf[i][j][k]*(1-totalCR)
            }
            huntDist[level] += pdf[i][j][k]
          }
        }
      }
    }
    huntDist.map(function(a,b){
      result.value += a*profile[b].value
      result.hunts += a
      result.shrinePos = shrinePos
      result.mat += a*profile[b].mat
      result.curd += a*profile[b].curd
      result.corsair += a*profile[b].corsair
      result.pirate1 += a*(profile[b].pirate == 1)
      result.pirate2 += a*(profile[b].pirate == 2)
      result.seal += a*profile[b].seal
      result.wind += a*profile[b].wind
      result.stone += a*profile[b].stone
    })
    return result
  },
  dropProfile: function(type,isHigh, ... tiles){
    // tiles are indexed shrine,empty,glass,ore,curd,loot,pirate
    // shrinePos is 1,2,3,4 or 5 if it does not exist
    let profile = []

    let normalCR = isHigh ? 0 : fi.data.islandRates[type].common
    let specialCR = isHigh ? fi.data.islandRates[type].high : fi.data.islandRates[type].low
    let gold = isHigh ? fi.data.islandRates[type].highGold : fi.data.islandRates[type].lowGold
    let rich = isHigh ? fi.data.islandRates[type].highRich : fi.data.islandRates[type].lowRich

    let drop = Array(4)
    let state = Array(4)
    let currentState = [0,0]
    let shrinePos = (tiles.indexOf(0) == -1) ? 4 : tiles.indexOf(0)

    // drop: 0 glass,1 ore,2 curd,3 corsair,4 speed,5 wind,6 stone,7 seals,8 lowTrove,9 highTrove,10 normalCR,11 specialCR, 12 value, 13 pirateState, 14 windState
    // state: 0 pirateTier,1 lootTier
    let badd = [1,1,0,0,1,0,0,0,0,0]
    let eggs = [0,0,0,0,0]
    let bmult = [1+isHigh,1+isHigh,1+isHigh,1+isHigh,1,1,1,1,1,1]
    for(let i = 0; i < 4; i++){
      switch(tiles[i]){
        case 0:
          badd[4] += 1
          break;
        case 2:
          bmult[0] *= 2
          eggs[0] += 0.5
          break;
        case 3:
          bmult[1] *= 2
          eggs[1] += 0.5
          break;
        case 4:
          badd[2] += 2
          eggs[2] += 1
          break;
        case 5:
          for(let j = 0; j < 4; j++){
            bmult[j] *= 2
          }
          currentState[1] += 1
          eggs[4] += 1
          break;
        case 6:
          badd[3] += 2
          currentState[0] += 1
          eggs[3] += 1
          break;
      }
      state[i] = [... currentState]
      drop[i] = [... badd.map((a,b) => a*bmult[b])]
    }
    eggs = eggs.map(a => a >= 1)

    for(let i = 0; i < 4; i++){
      let pirateCR = fi.data.islandRates.pirate.cr[state[i][0]]
      let pirateSeal = fi.data.islandRates.pirate.seal[state[i][0]]
      let pirateGold = fi.data.islandRates.pirate.gold[state[i][0]]
      let pirateCloudbeard = fi.data.islandRates.pirate.cloudbeard[state[i][0]]
      let noWind = [... drop[i],normalCR,specialCR,gold,-1]
      if(state[i][1] == 2){
        noWind[8] = rich*0.2*0.9 // adds 80% lowTrove
        noWind[9] = rich*0.2*0.1 // adds 20% highTrove
        noWind[10] = noWind[10]*0.8 // reduce duds
        noWind[11] = noWind[11]*0.8 + rich*0.2 // modify special
        noWind[12] = noWind[12]*0.8 + fi.data.islandRates.richGold*rich*0.2 // modify gold
      }
      let pirate = [... drop[i],0,pirateCR,pirateGold,state[i][0]]
      pirate[3] = 0 // remove corsair
      pirate[5] = pirateCR // add wind
      pirate[6] = pirateCR*0.5 + pirateCloudbeard // adds 1.5 stones per cloudbeard
      pirate[7] = pirateSeal // add seals
      let hasWind = noWind.map((a,b) => ((a > 0) && (b < 5)) ? a+1 : a)
      let pirateWind = pirate.map((a,b) => ((a > 0) && (b < 5)) ? a+1 : a)
      let data = [[... noWind,false],[...hasWind,true],[...pirate,false],[...pirateWind,true]].map(function(a){
        return {
          value: ((a[12] + 20000*a[8] + 100000*a[9])/fi.data.itemValues.sb) + fi.data.itemValues.jewel*0.01*a[8] + fi.data.itemValues.jewel*0.05*a[9] - fi.data.itemValues.hunt, // value
          cr: a[10]+a[11], // cr
          speed: a[4], //speed
          mat: (a[0]+a[1])*a[11] + (eggs[0]+eggs[1])*2 + eggs[4]*1, // mat
          curd: a[2]*(a[10]+a[11]) + 5*a[8] + 20*a[9], // curds
          corsair: a[3]*a[11] + eggs[3]*0.5, // corsair
          wind: a[5] + a[8] + 3*a[9] - a[14]*0.9, // wind
          stone: a[6] + 0.6*a[8] + 2.6*a[9] + eggs[4]*0.05, // stone
          seal: a[7], //seal
          windState: a[14], //windState
          pirate: a[13], //pirate
          shrine: shrinePos
        }
      })
      data = data.map(function(a){
        a.value += a.mat*fi.data.itemValues.mat + a.curd*fi.data.itemValues.curd + a.corsair*fi.data.itemValues.corsair +a.wind*fi.data.itemValues.wind + a.stone*fi.data.itemValues.stone + a.seal*fi.data.itemValues.seal
        // value randomization
        //a.value += 5-Math.random()*10
        if(a.pirate < 0){
          a.curd -= fi.data.itemValues.curdRate
          a.value -= fi.data.itemValues.cloud
        }
        else{
          a.corsair -= fi.data.itemValues.swissRate
          a.value -= fi.data.itemValues.swiss
        }
        return a
      })
      profile[i] = data
    }
    let costs = profile[3].map(a => a.value)
    let best = costs.indexOf(Math.max(... costs))
    profile[3] = profile[3][best]

    // this took some weird mathematical proving to do but this works don't touch this
    let pivot = Math.max(profile[3].value,0)
    for(let i = 0; i < 3; i++){
      let score = profile[i].map(a => (a.value - pivot)/(a.cr*a.speed))
      let best = score.indexOf(Math.max(... score))
      profile[i] = profile[i][best]
    }
    return profile
  }
}

let bp = {
    boardLib: {
        "Shrine of Rain": 0,
        "Shrine of Frost": 0,
        "Shrine of Fog": 0,
        "Shrine of Wind": 0,
        "Paragon Sprocket Shrine": 0,
        "Paragon Silk Shrine": 0,
        "Paragon Bangle Shrine": 0,
        "Paragon Wing Shrine": 0,
        "Empty Terrain": 1,
        "Sky Glass Formation": 2,
        "Sky Ore Deposit": 3,
        "Cloud Curd Bonus": 4,
        "Loot Cache": 5,
        "Sky Pirate Den": 6
    },
    typeLib: {
        law: "law",
        arcn: "arcane",
        drcnc: "draconic",
        frgttn: "forgotten",
        hdr: "hydro",
        phscl: "physical",
        shdw: "shadow",
        tctcl: "tactical"
    },
    trove: function(isHigh){
        let value = (isHigh ? 100000 : 20000)/fi.data.itemValues.sb + (isHigh ? 0.05 : 0.01)*fi.data.itemValues.jewel
        value += (isHigh ? 20 : 5)*fi.data.itemValues.curd
        value += (isHigh ? 3 : 1)*fi.data.itemValues.wind
        value += (isHigh ? 2.6 : 0.6)*fi.data.itemValues.stone
        return value
    }
}

function checkIsland(){
    let tiles = user.quests.QuestFloatingIslands.hunting_site_atts.island_mod_panels.map(a => bp.boardLib[a.name])
    let isHigh = user.quests.QuestFloatingIslands.hunting_site_atts.is_high_tier_island != null
    let type = bp.typeLib[user.quests.QuestFloatingIslands.hunting_site_atts.island_power_type]
    let values = fi.dropProfile(type,isHigh,... tiles)//.sort((a,b) => b[0] - a[0])
    let actions = values.map(a => [a.pirate > 0,a.windState])
    let trove = bp.trove(isHigh)
    let retreatLimit = Math.floor(trove/(-values[3].value*((values[3].speed + 1)*values[3].cr - 1)))
    let remaining = 40 - user.quests.QuestFloatingIslands.hunting_site_atts.island_progress
    retreatLimit = Math.min(retreatLimit,40)
    alert([//type,
           actions.map((a,b) => ["Tile ",b+1,":",a[0] ? " Pirate" : "",a[1] ? " Wind" : ""].join("")).join("\n"),
           (retreatLimit < 0) ? "Don't depart." : "Depart if "+retreatLimit+" steps away from the trove."].join("\n"))
}

function addIsland(){
    if(document.getElementsByClassName("floatingIslandsHUD-huntsRemaining").length > 0){
        document.getElementsByClassName("floatingIslandsHUD-huntsRemaining")[0].style["box-shadow"] = "0px 0px 5px 3px #0F0"
        document.getElementsByClassName("floatingIslandsHUD-huntsRemaining")[0].onclick = checkIsland
    }
}

function assessBoard(){
    let tiles = Array.from(document.getElementsByClassName("floatingIslandsAdventureBoard-islandModContainer spinIn")[0].children)
    tiles = tiles.map(a => a.textContent).map(a => bp.boardLib[a])
    let wardens = user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught
    let isHigh = user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude != null
    let board = Array(4).fill(0).map(a => Array(4).fill(0))
    tiles.map(function(entry,index){
        board[3 - Math.floor(index/4)][index%4] = entry
    })
    let lines = [fi.lineValue("arcane",isHigh,true,... board[3]),
                 fi.lineValue("forgotten",isHigh,true,... board[2]),
                 fi.lineValue("hydro",isHigh,true,... board[1]),
                 fi.lineValue("shadow",isHigh,true,... board[0]),
                 fi.lineValue("draconic",isHigh,true,... board.map(a => a[0])),
                 fi.lineValue("law",isHigh,true,... board.map(a => a[1])),
                 fi.lineValue("physical",isHigh,true,... board.map(a => a[2])),
                 fi.lineValue("tactical",isHigh,true,... board.map(a => a[3]))]
    lines = lines.map(function(a){
        if(a.shrine == 4){
            a.value += fi.data.reroll[wardens]
        }
        return a
    })
    lines = [["reroll",fi.data.reroll[wardens]],... lines.map(a => [a.type,a.value])].sort((a,b) => b[1] - a[1])
    alert(lines.slice(0,4).map(a => a[0] + ": "+ a[1].toFixed(2)).join("\n"))
}
function boardLoaded(){
    if(document.getElementsByClassName("floatingIslandsAdventureBoard-rerollImage").length > 0){
        document.getElementsByClassName("floatingIslandsAdventureBoard-rerollImage")[0].style["box-shadow"] = "0px 0px 5px 3px #0F0"
        document.getElementsByClassName("floatingIslandsAdventureBoard-rerollImage")[0].onclick = assessBoard
    }
}

function activeAssess(){
    //console.log(document.getElementsByClassName("floatingIslandsAdventureBoard-islandModContainer spinIn")[0])
    let tiles = Array.from(document.getElementsByClassName("floatingIslandsAdventureBoard-islandModContainer spinIn")[0].children)
    tiles = tiles.map(a => a.textContent).map(a => bp.boardLib[a])
    let wardens = user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught
    let isHigh = user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude != null
    let board = Array(4).fill(0).map(a => Array(4).fill(0))
    tiles.map(function(entry,index){
        board[3 - Math.floor(index/4)][index%4] = entry
    })
    let lines = [fi.lineValue("arcane",isHigh,true,... board[3]),
                 fi.lineValue("forgotten",isHigh,true,... board[2]),
                 fi.lineValue("hydro",isHigh,true,... board[1]),
                 fi.lineValue("shadow",isHigh,true,... board[0]),
                 fi.lineValue("draconic",isHigh,true,... board.map(a => a[0])),
                 fi.lineValue("law",isHigh,true,... board.map(a => a[1])),
                 fi.lineValue("physical",isHigh,true,... board.map(a => a[2])),
                 fi.lineValue("tactical",isHigh,true,... board.map(a => a[3]))]
    lines = lines.map(function(a){
        if(a.shrine == 4){
            a.value += fi.data.reroll[wardens]
        }
        return a
    })
    lines = [["reroll",fi.data.reroll[wardens]],... lines.map(a => [a.type,a.value])].sort((a,b) => b[1] - a[1])
    if(lines[0][0] == "reroll"){
        console.log(lines.slice(0,4).map(a => a[0] + ": "+ a[1].toFixed(2)).join("\n"))
        if(user.enviroment_atts.items.sky_scrambler_stat_item.quantity > 20){
            setTimeout(function(){hg.views.FloatingIslandsAdventureBoardView.randomizeAdventureBoard()},Math.random()*1000+250)
        }
    }
    else{
        alert(lines.slice(0,4).map(a => a[0] + ": "+ a[1].toFixed(2)).join("\n"))
    }
}

re.wait(".floatingIslandsAdventureBoard-rerollImage", activeAssess)
addIsland()