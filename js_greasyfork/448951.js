// ==UserScript==
// @name         Woomy Hunter Tracker
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Keep track of hunters and how many times you got hunted!
// @author       Drako Hyena
// @match        https://woomy.surge.sh/
// @match        https://woomy-arras.netlify.app
// @match        https://www.woomy-arras.xyz/
// @grant        none
// @require      https://greasyfork.org/scripts/448888-woomy-modding-api/code/Woomy%20Modding%20Api.js?version=1082014
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448951/Woomy%20Hunter%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/448951/Woomy%20Hunter%20Tracker.meta.js
// ==/UserScript==
(function() {
    'use strict'
    // Wait for the api to load
    if(window.WMA&&window.WMA.loaded){
        run()
    }else{
        if(window.WMALoadQueue){
            window.WMALoadQueue.push(run)
        }else{
            window.WMALoadQueue = [run]
        }
    }

    let hunterDataStorage = {}

    // Once the api is loaded run this function
    function run(){
        let subId = null
        let button = window.WMA.createButton("Log Hunters", "off", ()=>{
            let moreInfo = button.children[1]
            if(moreInfo.innerHTML === "off"){
                moreInfo.innerHTML = "on"
                subId = window.WMA.packets.receive.sub(logHunters)
            }else if(moreInfo.innerHTML === "on"){
                moreInfo.innerHTML = "off"
                window.WMA.packets.receive.unsub(subId)
                subId = null
            }
        })
        function logHunters(type, data){
            if(type!=="m") return;
            if (/ killed you with a /g.test(data[0])){
                let name = data[0].split(" killed you with a")[0]
                let hunterData = hunterDataStorage[name]
                if(!hunterData){
                    hunterData = {
                        timesKilledThisTime: 0,
                        lastKilledTimeStamp: Date.now(),
                        imageDatas: [],
                        hunter: false,
                    }
                }
                hunterData.timesKilledThisTime++
                if((Date.now()-hunterData.lastKilledTimeStamp)/10000>2.5){// If its been over X mins
                    hunterData.lastKilledTimeStamp = Date.now();
                    hunterData.timesKilledThisTime = 1;
                    hunterData.imageDatas = [];
                    hunterData.hunter = false
                }else if(hunterData.timesKilledThisTime >= 4 && !hunterData.hunter){
                    let hunterConfirm = window.confirm(`Would you like to add ${name} as a hunter?`)
                    if (hunterConfirm){
                        window.alert("All their data is in the console. To get the images from imageDatas find a base64 to image converter to convert them individually to obtain the actual images")
                        hunterData.hunter = true
                        console.log(name + " is a hunter!\nTheir data:")
                        console.log(hunterData)
                    }
                }
                hunterData.lastKilledTimeStamp = Date.now()
                hunterDataStorage[name] = hunterData
                setTimeout(()=>{
                    hunterData.imageDatas.push(document.getElementById("gameCanvas").toDataURL("jpeg"))
                    hunterDataStorage[name].imageDatas = hunterData.imageDatas
                },350)
            }
        }
    }
})();
