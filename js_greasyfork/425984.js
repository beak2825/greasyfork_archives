// ==UserScript==
// @name        [MH] VR Prestige
// @author      Re
// @version    	4.1
// @description Prestige Run Optimizer
// @include	    http://mousehuntgame.com/*
// @include	    https://mousehuntgame.com/*
// @include	    http://www.mousehuntgame.com/*
// @include	    https://www.mousehuntgame.com/*
// @grant       none
// @namespace   https://greasyfork.org/users/413177
// @downloadURL https://update.greasyfork.org/scripts/425984/%5BMH%5D%20VR%20Prestige.user.js
// @updateURL https://update.greasyfork.org/scripts/425984/%5BMH%5D%20VR%20Prestige.meta.js
// ==/UserScript==

// Sets the display for the percentages
// Set to true or false depending on which display you want

let re = {
    discord: function(message,withTag,callback = function(){}) {
        if(withTag){
            message = '<@124913170895601666> ' + message
        }
        $.post(
            "https://discordapp.com/api/webhooks/640700570969178122/OQyY7bsFmEaBLRy4dtQXzHFM-MTcZ2nlbpQwMZK3mOPP4fuJ-NzjIvxxq-nzbomv0U2O",
            {
                content: message
            },
            null,
            "application/json"
        ).done(callback);
    }
}

let vr = {
    run: {},
    stored: {},
    presolved: false,
    cached: false,
    storage: function(runData){
        let storage = ""
        let index = 0
        let forStorage = runData.flat(1).sort((a,b) => b.rate - a.rate)
        let closest = {}
        while(storage.length < 4500000){
            let toStore = [forStorage[index].step,
                           forStorage[index].sync,
                           forStorage[index].setup,
                           Math.round(forStorage[index].value)]
            if(!closest[forStorage[index].setup]){
                closest[forStorage[index].setup] = true
                console.log(toStore)
            }
            storage = storage+JSON.stringify(Object.values(toStore))+"|"
            index++
        }
        return storage
    },
    initialize: function(data){
        let run = {}
        run.stats = {
            totalLaps: data.teValues.length - 1,
            startStep: data.runStart[0],
            startHunt: 100 - data.runStart[1]
            + 50*Math.floor(Math.pow(data.runStart[0]/35 + 2809/1225, 0.5) - 53/35),
            cost: 0,
            rateTE: Array(data.teValues.length).fill(0),
            setupUse: {},
            setup1Use: {},
            setupArray: data.setupValues.map(a => a[0]),
            setupDetails: {}
        }

        data.setupValues.map(function(a){
            run.stats.setupDetails[a[0]] = a.slice(3)
        })

        run.stats.totalSync = 50*run.stats.totalLaps + 50
        run.stats.totalSteps = (35*(run.stats.totalLaps) + 106)*(run.stats.totalLaps)-1
        run.stats.setupSync = Array(run.stats.totalSync+1).fill(0).map(() => new Object)
        data.setupValues.map(function(a){
            run.stats.setupUse[a[0]] = 0
            run.stats.setup1Use[a[0]] = 0
        })

        run.data = Array(run.stats.totalSteps+1).fill(0).map(function(stepArray,step){
            let te = Math.floor(Math.pow((step+1)/35 + 2809/1225, 0.5) - 53/35)
            let teCaught = Math.floor(Math.pow((step)/35 + 2809/1225, 0.5) - 53/35)
            let value = step == run.stats.totalSteps ? data.teValues[te] : 0
            let result = Array(run.stats.totalSync+1).fill(0).map(function(syncValue,sync){
                let setValue = teCaught*50+100 > sync ? value : null
                let stats = {
                    step: step,
                    sync: sync,
                    setup: "",
                    rate: 0,
                    value: setValue
                }
                return stats
            })
            result[teCaught*50+100].value = data.teValues[te]
            return result
        })
        run.data[run.stats.startStep][run.stats.startHunt].rate = 1
        return run
    },
    backward: function(data,run){
        for(let hunts = run.stats.totalSync - 1; hunts > -1; hunts--){
            for(let steps = run.stats.totalSteps; steps > -1; steps--){
                if(run.data[steps][hunts].value == 0){
                    let te = Math.floor(Math.pow((steps+1)/35 + 2809/1225, 0.5) - 53/35) + 1
                    let prevte = (te-1) * (106 + 35 * (te-1))
                    let ceiling = te * (106 + 35 * te)-1
                    let bottom = (prevte < steps)
                    ? steps - (steps - prevte)%(te*10+10)
                    : steps
                    let lap = (prevte > steps)
                    ? 0
                    : Math.min(te,4)

                    let options = data.setupValues
                    .filter(entry => (entry[1] === "") || (entry[1] <= te-1))
                    .filter(entry => (entry[2] === "") || (entry[2] >= te-1))
                    .map(function(entry){
                        let toPush = Math.min(steps + entry[3], ceiling, run.stats.totalSteps)
                        let toTA = Math.min(steps + entry[3]*4, ceiling, run.stats.totalSteps)
                        let toKB = Math.max(steps - 5, bottom)
                        let toBKB = Math.max(steps - 10, bottom)
                        let values = [run.data[toPush][hunts+1].value,
                                      run.data[toTA][hunts+1].value,
                                      run.data[toKB][hunts+1].value,
                                      run.data[toBKB][hunts+1].value]
                        .map(a => a == null ? 0 : a)
                        let total = -entry[4]
                        values.map(function(value,index){
                            total += entry[5+index+lap*4]*value
                        })
                        return [entry[0],total]
                    })

                    options = options.sort((a,b) => b[1] - a[1])
                    options[0][1] = Math.max(options[0][1],data.teValues[te-1]) // set to >0 to noretreat
                    run.data[steps][hunts].value = options[0][1]
                    if(options[0][1]>data.teValues[te-1]){
                        run.data[steps][hunts].setup = options[0][0]
                    }
                }
            }
        }
        return run
    },
    forward: function(run,isPDF = true){
        let huntTotal = 1
        for(let hunts = 0; hunts <= run.stats.totalSync; hunts++){
            for(let steps = 0; steps <= run.stats.totalSteps; steps++){
                let current = run.data[steps][hunts].rate
                let setupCode = run.data[steps][hunts].setup
                let setup = run.stats.setupDetails[setupCode]
                let te = Math.floor(Math.pow((steps+1)/35 + 2809/1225, 0.5) - 53/35) + 1
                if(setupCode != ""){
                    let speed = setup[0]
                    run.stats.cost += current*setup[1]//huntTotal
                    run.stats.setupSync[hunts][setupCode] =
                        run.stats.setupSync[hunts][setupCode] + current || current
                    run.stats.setupUse[setupCode] += current
                    run.stats.setup1Use[setupCode] += current/huntTotal
                    let prevte = (te-1) * (106 + 35 * (te-1))
                    let ceiling = te * (106 + 35 * te)-1
                    let bottom = (prevte < steps)
                    ? steps - (steps - prevte)%(te*10+10)
                    : steps
                    let lap = (prevte > steps)
                    ? 0
                    : Math.min(te,4)
                    let toPush = Math.min(steps + speed, ceiling, run.stats.totalSteps)
                    let toTA = Math.min(steps + speed*4, ceiling, run.stats.totalSteps)
                    let toKB = Math.max(steps - 5, bottom)
                    let toBKB = Math.max(steps - 10, bottom)
                    if(isPDF){
                        run.data[toPush][hunts+1].rate += current*setup[2+lap*4]
                        run.data[toTA][hunts+1].rate += current*setup[3+lap*4]
                        run.data[toKB][hunts+1].rate += current*setup[4+lap*4]
                        run.data[toBKB][hunts+1].rate += current*setup[5+lap*4]
                    }
                    else{
                        let position = [toPush,toTA,toKB,toBKB]
                        let accumulator = Math.random()
                        let i = 0
                        for(; (accumulator > 0) && (i < 4); i++){
                            accumulator -= setup[2+lap*4+i]
                        }
                        run.data[position[i-1]][hunts+1].rate += current
                    }
                }
                else{
                    run.stats.rateTE[te-1] += current
                    huntTotal -= current
                }
            }
        }
        return run
    }
}

function simulate() {
    let time = new Date()
    let data = {"runStart":[0,100],
                "teViability":[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true],
                "teValues":[0,21.44,64.32000000000001,128.64000000000001,214.40000000000003,321.6,450.24,600.32,771.84,964.8000000000001,1179.2,1425.76,1704.48,2015.3600000000001,10000,20000,30000,365081.2587665178,3650812.587665178,36508125.87665178],
                "setupValues":[["C",99,"",10,13.38,0.618895145038168,0,0.381104854961832,0,0.7542433189442302,0.183,0.004660589585360975,0.058096091470408784,0.7947915551512792,0.112,0.03284043918673178,0.06036800566198902,0.7819275342186905,0.102,0.053757105097965954,0.06231536068334351,0.7735258165461854,0.08,0.08156234940866515,0.06491183404514948],
                               ["CF",0,"",11,18.68,0.618895145038168,0,0.381104854961832,0,0.7542433189442302,0.183,0.004660589585360975,0.058096091470408784,0.7947915551512792,0.112,0.03284043918673178,0.06036800566198902,0.7819275342186905,0.102,0.053757105097965954,0.06231536068334351,0.7735258165461854,0.08,0.08156234940866515,0.06491183404514948],
                               ["U",0,"",11,803.21,1,0,0,0,0.8170000000000002,0.183,-1.6653345369377348e-16,0,0.8880000000000001,0.112,-1.249000902703301e-16,0,0.8979999999999999,0.102,9.71445146547012e-17,0,0.9199999999999999,0.08,6.938893903907228e-17,0],
                               ["P",99,"",11,28.57,0.6506538532538242,0,0.3493461467461758,0,0.7633700141088724,0.183,0.0010589176976867898,0.05257106819344082,0.8115329213507335,0.112,0.02184015862703189,0.05462692002223459,0.8001920580551019,0.102,0.0414188632122689,0.05638907873262926,0.7949937803070942,0.08,0.06626759601308362,0.05873862367982215],
                               ["L",0,"",11,31.47,0.6510237988073632,0,0.34897620119263684,0,0.7653754262293868,0.183,-1.3877787807814457e-16,0.05162457377061333,0.8265049541067044,0.112,0.007851634042267179,0.05364341185102838,0.8145488169261363,0.102,0.02807733858247953,0.05537384449138413,0.8117648167628765,0.08,0.050554095225265036,0.05768108801185848],
                               ["T",99,"",11,53.45,0.6678203558297348,0,0.33217964417026524,0,0.7679372754026625,0.183,-9.020562075079397e-17,0.04906272459733755,0.8292421257221625,0.112,0.007776495645967198,0.05098137863187031,0.8180681247650008,0.102,0.02730593600210083,0.052625939232898385,0.8160684169749151,0.08,0.04911289632414913,0.054818686700935815],
                               ["E",0,"",11,168.23,0.8087398029808375,0,0.19126019701916253,0,0.7886199889729769,0.183,0.0005063441599438105,0.027873666867079278,0.8482701288353245,0.112,0.010766172632403183,0.028963698532272326,0.8474327265146484,0.102,0.020669262097199523,0.02989801138815208,0.855441381767685,0.08,0.033414856369656555,0.031143761862658416],
                               ["HP",99,"",11,38.57,0.6779569579349904,0,0.32204304206500955,0,0.7678564199395757,0.183,0.000952318057876593,0.04819126200254776,0.81817188386285,0.112,0.019752279642882488,0.05007583649426751,0.8087597745752293,0.102,0.037549039366171995,0.051691186058598716,0.8059600574297221,0.08,0.0601949570925709,0.053844985477707],
                               ["HL",99,"",11,41.47,0.6782979904397706,0,0.32170200956022943,0,0.7696763779804672,0.183,-8.326672684688674e-17,0.04732362201953291,0.8316806169292605,0.112,0.0071451166146884945,0.04917426645605096,0.8217613659381815,0.102,0.025478100945894935,0.05076053311592357,0.8212000813221125,0.08,0.045924363348800415,0.052875555329087054],
                               ["HT",99,"",11,63.45,0.6938810669698693,0,0.3061189330301307,0,0.7720273176851518,0.183,-1.3877787807814457e-16,0.04497268231484838,0.8341894213940177,0.112,0.007079188044184483,0.046731390561797766,0.8249688133162775,0.102,0.024792331910253873,0.04823885477346866,0.8251142247032374,0.08,0.04463696824106611,0.05024880705569652],
                               ["HE",99,"",11,178.23,0.8154208098630137,0,0.18457919013698632,0,0.789649762002241,0.183,0.00048605629629613553,0.02686418170146285,0.8497382435006875,0.112,0.010347020206172331,0.02791473629314017,0.8493114423848571,0.102,0.019873345957707872,0.028815211657435016,0.8578435307824885,0.08,0.03214062374101665,0.030015845476494808],
                               ["WP",99,"",11,38.57,0.6507387171376717,0,0.34926128286232827,0,0.7646435747147237,0.183,0.0000024787520171154487,0.05235394653325923,0.8158412142702567,0.112,0.01775747815887059,0.05440130757087272,0.804131466710823,0.102,0.03771234482892127,0.05615618846025571,0.7992752195414662,0.08,0.062228750812434105,0.058496029646099706],
                               ["WL",99,"",11,41.47,0.6511289893699765,0,0.34887101063002346,0,0.7656445530776358,0.183,-9.020562075079397e-17,0.0513554469223643,0.827779718864399,0.112,0.006856520646440274,0.05336376048916067,0.8171487560440157,0.102,0.025766071838141016,0.05508517211784328,0.8159929321707841,0.08,0.046626680206462524,0.057380387622753416],
                               ["WT",99,"",11,63.45,0.6679185371992596,0,0.33208146280074036,0,0.7681876001511359,0.183,-1.249000902703301e-16,0.04881239984886428,0.830423652665607,0.112,0.006855082686969757,0.050721264647423214,0.8204750215342389,0.102,0.02516754399100165,0.052357434474759455,0.8199833688145023,0.08,0.04547763694095661,0.054538994244541096],
                               ["WE",99,"",11,178.23,0.8087862643009226,0,0.1912137356990774,0,0.7892402677781414,0.183,0.000001185268326851091,0.027758546953531773,0.8503591375370338,0.112,0.008796785740301849,0.0288440767226643,0.8493762963609444,0.102,0.018849172828563465,0.02977453081049218,0.8575934723833184,0.08,0.03139139135575224,0.031015136260929357],
                               ["LU",99,"",11,838.21,1,0,0,0,0.8170000000000002,0.183,-1.6653345369377348e-16,0,0.8880000000000001,0.112,-1.249000902703301e-16,0,0.8979999999999999,0.102,9.71445146547012e-17,0,0.9199999999999999,0.08,6.938893903907228e-17,0],
                               ["LP",99,"",11,63.57,0.651866847809178,0,0.34813315219082197,0,0.7675323414044841,0.183,-1.5265566588595902e-16,0.04946765859551604,0.8365978519622014,0.112,-1.6653345369377348e-16,0.05140214803779879,0.8351623423708161,0.102,0.009777375783714189,0.053060281845469716,0.8452240149443099,0.08,0.01950485813332583,0.05527112692236429],
                               ["LL",99,"",11,66.47,0.6524603868291418,0,0.34753961317085824,0,0.7690508928960534,0.183,-9.020562075079397e-17,0.047949107103946655,0.8381757881489718,0.112,-1.249000902703301e-16,0.049824211851028366,0.8396794892195911,0.102,0.006889066289024762,0.05143144449138412,0.8496981288789046,0.08,0.01672744977590359,0.053574421345191796],
                               ["LT",99,"",11,88.45,0.6691663595311536,0,0.33083364046884645,0,0.7713690673977418,0.183,-4.163336342344337e-17,0.04563093260225824,0.8405846175194414,0.112,-2.0816681711721685e-16,0.04741538248055885,0.842285355286997,0.102,0.006769733765329362,0.04894491094767365,0.8529784960147576,0.08,0.01603722174808233,0.050984282237160054],
                               ["LE",99,"",11,203.23,0.8094038938254081,0,0.19059610617459188,0,0.7907717896217704,0.183,-8.326672684688674e-17,0.02622821037822967,0.8607461054170353,0.112,-2.463307335887066e-16,0.02725389458296491,0.8650411641182072,0.102,0.004825783409054839,0.028133052472737972,0.8809567878999554,0.08,0.009737949107609258,0.02930526299243539]]}


    vr.run = vr.initialize(data)
    let forceInitialize = true // forces data initialization

    if(forceInitialize){
        vr.run = vr.backward(data,vr.run)
        vr.run = vr.forward(vr.run)
        localStorage.setItem("re-vr-cache",vr.storage(vr.run.data))
        vr.presolved = true
        result = vr.run.data[vr.run.stats.startStep][vr.run.stats.startHunt]
        result.type = "Initialized"
        let message = ["`VR Prestige "+result.type+": "+(new Date() - time)/1000+"s. "+"S/H:"+result.step+"/"+result.sync+"`",
                       "**Value: "+result.value+", Setup: "+result.setup+"**"].join("\n")
        console.log(message)
        re.discord("Forced data initialization. \n"+message,true)
    }
    else{
        if(!vr.cached){
            let storedText = localStorage.getItem("re-vr-cache") || ""
            storedText = storedText.split("|")
            storedText.pop()
            storedText.map(function(entry){
                entry = JSON.parse(entry)
                vr.stored[entry[0]+"&"+entry[1]] = [entry[2],entry[3]]
            })
            vr.cached = true
        }

        let result = {}
        if(vr.presolved){
            result = vr.run.data[vr.run.stats.startStep][vr.run.stats.startHunt]
            result.type = "Cached"
        }
        else{
            if(vr.stored[vr.run.stats.startStep+"&"+vr.run.stats.startHunt]){
                result.step = vr.run.stats.startStep
                result.sync = vr.run.stats.startHunt
                result.setup = vr.stored[vr.run.stats.startStep+"&"+vr.run.stats.startHunt][0]
                result.value = vr.stored[vr.run.stats.startStep+"&"+vr.run.stats.startHunt][1]
                result.type = "Retrieved"
            }
            else{
                vr.run = vr.backward(data,vr.run)
                vr.run = vr.forward(vr.run)
                localStorage.setItem("re-vr-cache",vr.storage(vr.run.data))
                vr.presolved = true
                result = vr.run.data[vr.run.stats.startStep][vr.run.stats.startHunt]
                result.type = "Initialized"
            }
        }
        let message = ["`VR Prestige "+result.type+": "+(new Date() - time)/1000+"s. "+"S/H:"+result.step+"/"+result.sync+"`",
                       "**Value: "+result.value+", Setup: "+result.setup+"**"].join("\n")
        console.log(message)
    }
}



function addButton(){
    if(document.getElementsByClassName("valourRiftHUD-floorProgress-boss").length > 0){
        document.getElementsByClassName("valourRiftHUD-floorProgress-boss")[0].style["box-shadow"] = "0px 0px 5px 3px #F00"
        document.getElementsByClassName("valourRiftHUD-floorProgress-boss")[0].onclick = simulate
        document.getElementsByClassName("valourRiftHUD-floorProgress")[0].getElementsByClassName("mousehuntTooltip-arrow")[0].onclick = simulate
    }
}

window.onload = addButton