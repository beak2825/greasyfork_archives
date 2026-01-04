// ==UserScript==
// @name         Infinite powers + Multidrop*PUBLIC RELEASE*
// @namespace    http://tampermonkey.net/
// @version      3
// @description  easy :D
// @author       Turbo
// @match        https://agma.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488215/Infinite%20powers%20%2B%20Multidrop%2APUBLIC%20RELEASE%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/488215/Infinite%20powers%20%2B%20Multidrop%2APUBLIC%20RELEASE%2A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //virus not made yet cuz im lazy
    /*
    YOU SET THE KEYS U WANT IN SETTINGS
*/
    //important variables

    let socket = new WebSocket("wss://agma.io")
    var $ = window.$
    var pwAmnt = $("invRecombine").value
    var pwAmnt2 = $("invSpeed").value
    var pwAmnt3 = $("invVirus").value
    var user = document.getElementByClassName("username")
    var keyLol1 = "E";
    var keyLol2 = "S";
    var keyLol3 = "X";
    var keyLol4 = "1";
    var keyLol5 = "Q";
    var keyLol6 = "2";
    var keyLol7 = "3";
    var scriptSuccess = true;

window.addEventListener('keydown', keydown);
setTimeout(function() {
    keyLol1 = keyLol1.charCodeAt(0)
    keyLol2 = keyLol2.charCodeAt(0)
    keyLol3 = keyLol3.charCodeAt(0)
    keyLol4 = keyLol4.charCodeAt(0)
    keyLol5 = keyLol5.charCodeAt(0)
    keyLol6 = keyLol6.charCodeAt(0)
    keyLol7 = keyLol7.charCodeAt(0)
}, 5000)
    window.alert("Script is already started, no buttons")
    //this code has been patched, make new version
    /*if(event.keyCode == keyLol1){
        socket.send("#invRecombine", () => {
            class AddRecs {
                constructor(){
                    pwAmnt++
                }
            }
            this.recombine = new AddRecs()
            this.recombine.init()
            user.pwAmnt = user.pwAmnt + 1
            
        })
    }*/
    const funcmain = () => {

    
    if(e.which == keyLol1){
        socket.send("#invRecombine", () => {
            class NewRec {
                constructor(){
                    pwAmnt.getUint64(32, dataPosOnScreen(this, false))
                    pwAmnt++
                }
                recval(val){
                    return new Array(32)
                    $("#invRecombine").removeAttr("undef")
                }
                recall(byte){
                    //recall incase agma doesnt join 2 arrays
                    byte.DataArray(() =>{
                        return async function(){
                            await DelayNode(59)
                            DataTransfer.redefine()
                        }
                    })
                    agma.innerJs.getUint8(1, 130).removeAttr("block")
                }
            }
            if( style.display.document.chatBox == "block") return
            NewRec.recall("recombine")
            setUint8(fetch(document.agma(js, true)))
            NewRec.recval()
        })
    }
    /* =========================================================================================
    if(event.keyCode == keyLol2){
        socket.send("#invSpeed", () => {
            class AddSpeed {
                constructor(){
                    pwAmnt2++
                }
            }
            this.speed = new AddSpeed()
            this.speed.init()
            user.pwAmnt2 = user.pwAmnt2 + 1
            
        })
    }
     ============================================================================================
    */
     if(e.which == keyLol1){
        socket.send("#invSpeed", () => {
            class NewSpeed {
                constructor(){
                    pwAmnt.getUint64(32, dataPosOnScreen(this, false))
                    pwAmnt++
                }
                speedval(val){
                    return new Array(16)
                    $("#invSpeed").removeAttr("undef")
                }
                recall(byte){
                    //recall incase agma doesnt join 2 arrays
                    byte.DataArray(() =>{
                        return async function(){
                            await DelayNode(59)
                            DataTransfer.redefine()
                        }
                    })
                    agma.innerJs.getUint8(1, 140).removeAttr("block")
                }
            }
            if( style.display.document.chatBox == "block") return
            NewSpeed.recall("speed")
            setUint8(fetch(document.agma(js, true)))
            NewSpeed.speedval()
        })
      }
      
    // VIRUS COMING SOON!
        if(event.keyCode == keyLol3){
        socket.send("#invVirus", () => {
            class AddVirus {
                constructor(){
                    pwAmnt3++
                }
            }
            if(e.which != 1){return false;}
            
            this.virus = new AddVirus()
            this.virus.init(() => {if(user.usedVirus) new AddVirus()})
            user.pwAmnt3 = user.pwAmnt3 + 1
            
        })
    }
    parseFloat(pwAmnt.val())
    parseFloat(pwAmnt2.val())
  }
    try{
      funcmain()
    }catch{
      window.alert("Script unsuccessful. Contact the owner in Vaqu's Server:https://discord.gg/gdz2x3puxr")
    }
//admin commands ;D
    setTimeout(() => {
        //apply settings to menu
        const mainSettings = {
            enableAdmin: false,
            freeGM: false,
            freeBots: false,
            freeCoins: false
        }
    //main
    const userDef = document.getElementById("username")
    const goldMember = "goldMember"
    //run the functions to get Admin

    const giveUserAdmin = (user) => {
      this.user = user
      this.user.getUint32(2502, this.location)
      user.args.apply("adminPerms", this.user)
    }

    const giveUserGM = (user) => {
    if(user.inAccounts != goldMember) user.apply(goldMember)
    }

    const giveUserBots = (user) => {
      //this isnt a bot script, just gives u 500xl bots for infinity time
      user.apply(500, "xxl")
      //var bots = botLength
      window.on("load", () => {
        botLength.length == "24h" ? botLength.length = Infinity : botLength.length = Infinity
      })
    }

    const giveUserCoins = (user, coinAmnt) => {
        //change so it works
        const returnArray = (numba, val) => {
            return new indexArray([numba, val])
        }
        if(DataView.prototype.getUint8(returnArray(clientVer, 16)) != undefined) return new Scope({index: serverVer}, [8, 16, 32, 64, 128])
        JSON.manifest(DataView.prototype.getUint32([{coins: true}, 32]).parseFloat(coinAmnt))
        //apply to the user
        user.coinAmount += coinAmnt
        localStorage.getItem("coinMenu").appendChild(coinAmnt, user)
        //the hard part is making a menu for how much coins u want
        var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'myCheckbox';
    checkbox.name = 'myCheckbox';
var label = document.createElement('label');
label.textContent = 'Press to get infinite coins!';
label.setAttribute('for', 'myCheckbox');
var settingTab3 = document.getElementById('userSettings');
settingTab3.appendChild(checkbox);
settingTab3.appendChild(label);
checkbox.addEventListener('change', function() {
  if (checkbox.checked) {
    console.log('Checkbox is checked. Set to true.');
    ischecked = true;
    var coinPrompt = window.prompt("How much coins do u want?\n Type a number below")
    var coinPromptNum = coinPrompt.value
    document.getElementById("coinsDash").textContent = coinPrompt;
    document.getElementById("coins").textContent = coinPrompt
    curserMsg(`Coins Applied!`, 'green')
  } else {
    console.log('Checkbox is not checked. Set to false.');
    ischecked = false;
    curserMsg(`Check the box again to change coins`, 'red')
  }
});


    }
    if(userDef.args.database != "admin" || window.client.args === null) giveUserAdmin(userDef)
    if(userDef.args.database != "goldMember") giveUserGM(userDef)
    if(userDef.args.database.doesNotContain("bots")) giveUserBots(userDef)
}, 15000)
})(); 