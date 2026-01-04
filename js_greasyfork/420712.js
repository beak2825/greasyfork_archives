// ==UserScript==
// @name         Aspect's CSGOClicker Script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Aspect's Script, helps make csgoclicker a little less grindy! (plus lots of QoL changes)
// @author       Aspect!
// @match        https://csgoclicker.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420712/Aspect%27s%20CSGOClicker%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/420712/Aspect%27s%20CSGOClicker%20Script.meta.js
// ==/UserScript==

/* What this script does

Adds lots of Styles to CSGOClicker
Increases item display size
Adds odds to the 'possible items' menu
Adds a bunch of CSS Polish
Fixes gray buttons' :hover filter
Styles the scrollbars
*/

(function() {
    // Hello! Change that variable below to change the site's theme color!
    var THEMECOLOR = "white"


    window.console.stdlog = console.log.bind(window.console);
    window.console.logs = [];
    window.console.log = function(){
        window.console.logs.push(Array.from(arguments));
        window.console.stdlog.apply(window.console, arguments);
    }
    'use strict';
    try {
        var ss = document.createElement("link");
        var root = document.documentElement
        ss.type = "text/css";
        ss.rel = "stylesheet";
        ss.href = "https://aspectquote.github.io/CSGOCTools/styles.css";
        var exsc = document.createElement("script")
        ss.src = ''
        document.getElementsByTagName("head")[0].appendChild(ss);
        root.style.setProperty("--ac", THEMECOLOR)
        root.style.setProperty("--dac", THEMECOLOR)
        setTimeout(function(){
            if (document.getElementsByClassName("container")[0]) { // For some reason, the Case Opening UI has it's container's class set to a generic name, you'd think that'd get confusing but whatever
                console.log("%c Aspect's Script: Starting case open script, user is on the appropriate page.",'color: green; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;');
                root.style.setProperty("--csw", "''")
                // Declare Base Content Items
                var contentdiv = document.createElement('div')
                var contentheader = document.createElement('h1')
                // Style Content Items
                contentheader.style.cssText = "width: 100%; text-align: center; font-size: 27px; border-bottom: 1px solid var(--tc); letter-spacing: 2px; padding-bottom: 10px;"
                contentheader.appendChild(document.createTextNode("Automation Options"))
                contentdiv.style.cssText = "color: var(--tc); text-align: center; background-image: none; background-color: rgba(0,0,0,0); padding-right: 20px; padding-top: 20px; height: 130px; overflow-y: auto;"
                contentdiv.id = 'content'
                contentdiv.appendChild(contentheader)
                // Add Base Content Items to the container
                document.getElementsByClassName("container")[0].appendChild(contentdiv)
                var content = document.getElementById("content")
                var optionsform = document.createElement("form")
                // Sell Below X
                var sellbelowxform = document.createElement('input')
                var sellbelowxname = document.createElement('label')
                sellbelowxname.appendChild(document.createTextNode('Sell All Skins Below $'))
                sellbelowxname.setAttribute("for", 'sellbelowxinput')
                sellbelowxform.type = 'text'
                sellbelowxform.id = 'sellbelowxinput'
                sellbelowxform.name = 'sellbelowxinput'
                if (localStorage.getItem('aspectsminprice')) {
                    sellbelowxform.value = localStorage.getItem('aspectsminprice')
                } else {
                    sellbelowxform.value = 50
                }
                sellbelowxform.placeholder = 'Any Number. Price of skins you want to autosell'
                optionsform.appendChild(sellbelowxname)
                optionsform.appendChild(sellbelowxform)
                // Linebreak!
                optionsform.appendChild(document.createElement('br'))
                optionsform.appendChild(document.createElement('br'))
                // Stop when you get to X wallet funds
                var stopwhenmoneyisatxform = document.createElement('input')
                var stopwhenmoneyisatxname = document.createElement('label')
                stopwhenmoneyisatxname.appendChild(document.createTextNode('Stop When Wallet Reaches $'))
                stopwhenmoneyisatxname.setAttribute("for", 'stopwhenmoneyisatxinput')
                stopwhenmoneyisatxform.type = 'text'
                stopwhenmoneyisatxform.id = 'stopwhenmoneyisatxinput'
                stopwhenmoneyisatxform.name = 'stopwhenmoneyisatxinput'
                if (localStorage.getItem('aspectsminwallet')) {
                    stopwhenmoneyisatxform.value = localStorage.getItem('aspectsminwallet')
                } else {
                    stopwhenmoneyisatxform.value = 25
                }
                stopwhenmoneyisatxform.placeholder = 'Any Number. When the script stops opening cases'
                optionsform.appendChild(stopwhenmoneyisatxname)
                optionsform.appendChild(stopwhenmoneyisatxform)
                // Add the form to the content div
                contentdiv.appendChild(optionsform)

                function sellinspectitem() {
                    document.querySelector('.inspectSellItem.btn').click();
                }
                function opencase() {
                    document.querySelector('.openCase.btn').click();
                }
                function closepopup() {
                    if (document.querySelector('.fas.fa-times')) {
                        document.querySelector('.fas.fa-times').click();
                    }
                }
                function buyacase(){
                    document.querySelector('.buyCase.btn.navy.center').click();
                }
                var sessionstats = {
                    itemssold: 0,
                    casesopened: 0,
                    totalvalueofallitemssold: 0
                }
                var caseopenloop = setInterval(function(){
                    if (document.getElementsByClassName('caseOpenerComponent').length !== 1) {
                        console.log("%c Aspect's Script: Stopped Script. Left case page.", "color: #ff0101; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                        clearInterval(caseopenloop)
                        document.documentElement.style.setProperty("--csw", "'Stopped Automation. Left the case opening page. If this was a mistake, then refresh the page.'")
                        console.log("Session Stats: ",sessionstats)
                    } else {
                        var userwalletval = Number(document.querySelector(".wallet").innerText.replace(',','')); // get user wallet val so that we can check it
                        if (userwalletval <= document.getElementById('stopwhenmoneyisatxinput').value) {
                            console.log("%c Aspect's Script: Stopped Script. Wallet is smaller than given param.", "color: #ff0101; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                            clearInterval(caseopenloop)
                            document.documentElement.style.setProperty("--csw", "'Stopped Automation. Wallet funds have run out.'")
                            console.log("Session Stats: ",sessionstats)
                        } else {
                            try { // Wrapped in a try block because while animation is playing, the buy case button is disabled.
                                var casesowned = Number(document.getElementsByClassName('casesOwned')[0].innerText.replace("Owned: ", ""))
                                if (casesowned <= 1) { // If the user has no cases, then buy one. Otherwise don't; it's annoying.
                                    buyacase()
                                }
                            } catch(e) {
                                console.log("Prevented Buy Case.")
                            }
                            opencase()
                            var itemunboxedprice = Number(document.getElementsByClassName("price")[0].innerText.replace("$","").replace(",",""))
                            // Get Unboxed item price
                            if(itemunboxedprice >= document.getElementById("sellbelowxinput").value){
                                closepopup()
                            } else {
                                sellinspectitem()
                                sessionstats.itemssold++
                                sessionstats.totalvalueofallitemssold += itemunboxedprice
                            }
                            localStorage.setItem('aspectsminprice', document.getElementById("sellbelowxinput").value)
                            localStorage.setItem('aspectsminwallet', document.getElementById('stopwhenmoneyisatxinput').value)
                        }
                    }
                }, 7000)
                } else if (document.getElementsByClassName("missions")[0]) {
                    console.log("%c Aspect's Script: Starting mission script, user is on the appropriate page.",'color: green; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;');
                    root.style.setProperty("--missionloading", "'LOADING...'")
                    var ma = { // Get the amount of each type of mission
                        r: document.getElementsByClassName("recruit").length,
                        re: document.getElementsByClassName("regular").length,
                        v: document.getElementsByClassName("veteran").length,
                        e: document.getElementsByClassName("expert").length,
                        s: document.getElementsByClassName("specialOps").length
                    }
                    function removemissions(re, v, e, s) {
                        for (var i=0; i<re; i++) {
                            document.querySelector(".regular").remove();
                        }
                        for (var g=0; g<v; g++) {
                            document.querySelector(".veteran").remove();
                        }
                        for (var z=0; z<e; z++) {
                            document.querySelector(".expert").remove();
                        }
                        for (var x=0; x<s; x++) {
                            document.querySelector(".specialOps").remove();
                        }
                    }
                    if (ma.r >= 3) { // If there are three or more recruit missions
                        // Each code block checks to see if it can fill the gap with a mission of the next tier. the only case scenario where it can't is if there is one of every mission, in which it throws an error.
                        console.log("%c Aspect's Script: Missions Case 1", "color: yellow; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                        root.style.setProperty("--missionloading", "'Using Missions: 3 Recruit Missions. Do not leave this page unless you are done automating your missions.'")
                        removemissions(ma.re, ma.v, ma.e, ma.s)
                    } else if ((ma.r+ma.re) >= 3) {
                        console.log("%c Aspect's Script: Missions Case 2", "color: yellow; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                        root.style.setProperty("--missionloading", "'Using Missions: "+ma.r+" Recruit Mission(s) plus "+(3-ma.r)+" filler mission(s) of REGULAR quality. (Not enough recruit missions) Do not leave this page unless you are done automating your missions.'")
                        removemissions(ma.re-(3-ma.r), ma.v, ma.e, ma.s)
                    } else if ((ma.r+ma.v) >= 3) {
                        console.log("%c Aspect's Script: Missions Case 3", "color: yellow; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                        root.style.setProperty("--missionloading", "'Using Missions: "+ma.r+" Recruit Mission(s) plus "+(3-ma.r)+" filler mission(s) of VETERAN quality. (Not enough recruit missions) Do not leave this page unless you are done automating your missions.'")
                        removemissions(ma.re, ma.v-(3-ma.r), ma.e, ma.s)
                    } else if ((ma.r+ma.e) >= 3) {
                        console.log("%c Aspect's Script: Missions Case 4", "color: yellow; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                        root.style.setProperty("--missionloading", "'Using Missions: "+ma.r+" Recruit Mission(s) plus "+(3-ma.r)+" filler mission(s) of EXPERT quality. (Not enough recruit missions) Do not leave this page unless you are done automating your missions.'")
                        removemissions(ma.re, ma.v, ma.e-(3-ma.r), ma.s)
                    } else if ((ma.r+ma.s) >= 3) {
                        console.log("%c Aspect's Script: Missions Case 5", "color: yellow; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                        root.style.setProperty("--missionloading", "'Using Missions: "+ma.r+" Recruit Mission(s) plus "+(3-ma.r)+" filler mission(s) of SPECIALOPS quality. (Not enough recruit missions) Do not leave this page unless you are done automating your missions.'")
                        removemissions(ma.re, ma.v, ma.e, ma.s-(3-ma.r))
                    } else {
                        root.style.setProperty("--missionloading", "'Fatal Error: Bad missions. Wait until missions refresh then try again.'")
                    }
                    if (ma.r > 3) {
                        for (var i=0; i<(ma.r-3); i++) {
                            document.querySelector(".recruit").remove();
                        }
                    }
                    function redeem(missionnum) {
                        var button = document.getElementsByClassName('btn')[missionnum]
                        if (button != undefined) {
                            if (button.className != "btn pressed locked") { // If the button is locked, don't press it.
                                button.click()
                            }
                        }
                    }
                    function startmissions() { // Press mission number by element's class number in the DOM. When one is pressed, it is destroyed when it recieves a response from the server.
                        if (document.getElementsByClassName("startOverlay")[0]) { // If statements are to prevent rate limiting and server lag. (Everybody hates server lag)
                            document.getElementsByClassName("startOverlay")[0].click()
                        }
                        if (document.getElementsByClassName("startOverlay")[1]) {
                            document.getElementsByClassName("startOverlay")[1].click()
                        }
                        if (document.getElementsByClassName("startOverlay")[2]) {
                            document.getElementsByClassName("startOverlay")[2].click()
                        }
                    }
                    var missioninter = 0
                    var missionloop = setInterval(function(){
                        if (document.getElementsByClassName("missions").length !== 1) { // Check if still on the missions page
                            console.log("%c Aspect's Script: Stopped Script. Left missions page.", "color: #ff0101; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;")
                            clearInterval(missionloop)
                            root.style.setProperty("--missionloading", "'You left the missions page. Loop stopped. Refresh if it was an accident.'")
                        } else {
                            if (missioninter == 3) {
                                missioninter = 0
                            }
                            startmissions()
                            redeem(missioninter)
                            missioninter++
                        }
                    }, 1000)
                    setTimeout(function(){ // Reload every 30 mins to check for missions refresh
                        location.reload()
                    }, 1800000)
                    var tip = document.createElement("div")
                    tip.className = "tip"
                    tip.style.cssText = 'margin-top: 20px;'
                    tip.innerHTML = "If you are getting a lot of error messages very consistently, check your internet connection. It most likely means your ping with CSGOClicker's server is more than 1000ms. If you only get error messages every now and again, <span style='color: var(--ac);'>it's OK</span>. It probably means you or the server just had a lag spike. The script will reload the page every 30 minutes to check for a mission refresh."
                    document.getElementsByClassName('missions')[0].appendChild(tip)
                } else {
                    console.log("%c Aspect's Script: Not starting either script, not on the appropriate page.",'color: yellow; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;');
                }
        }, 5000)
        // Custom Profiles and Stuff for Devs, notable people, and donors (if I ever do donors)
        var vips = {
            "76561198335444084": { // Aspect!
                color: "#dead00",
                bio: "Creator of the script you are using right now! (Pretty cool, right?) Make sure to report bugs to me and shower me with praise!",
                background: "https://tf2clicker.com/sitebackground.jpg",
                backgroundgradient: "rgba(0,0,0,0)"
            },
            "76561198023420319": { // Banned
                color: "#dead00",
                bio: "Frontend Developer of CSGOClicker and Mega Cool dude!",
                background: "https://aspectquote.github.io/CSGOCTools/icons/bannedbg.jpg",
                backgroundgradient: "rgba(0,0,0,0)"
            },
            "76561198040594845": { // Roflzilla
                color: "#057a0d",
                bio: "Backend Developer of CSGOClicker and Uber Mega Cool dude!",
                background: "https://aspectquote.github.io/CSGOCTools/icons/roflbg.jpg",
                backgroundgradient: "rgba(0,0,0,0)"
            },
            "76561198074625962": { // KingOfKFCJamal
                color: "#dead00",
                bio: "Creator of a CSGOClicker Classic mod that added lots of stuff! (And he's super cool.)",
                background: "https://aspectquote.github.io/CSGOCTools/icons/jamal.png",
                backgroundgradient: "rgba(0,0,0,0)"
            }
        }
        function getitemprice(st, p, s, r, f) {
            var floatname = ''
            if (f < 0) {
                floatname = ''
            } else if (f <= 0.07) {
                floatname = ' (Factory New)'
            } else if (f <= 0.15) {
                floatname = ' (Minimal Wear)'
            } else if (f <= 0.37) {
                floatname = ' (Field-Tested)'
            } else if (f <= 0.44) {
                floatname = ' (Well-Worn)'
            } else if (f <= 1) {
                floatname = ' (Battle-Scarred)'
            }
            return window.PriceList[((r=='gold') ? '★ ' : '') + ((st) ? 'StatTrak™ ' : '') + p + ((s!=="Vanilla") ? " | " + s : '') + floatname]
        }
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        setInterval(function(){
            if (document.getElementsByClassName("profileContainer")[0]) {
                var uivv = document.createElement('div')
                uivv.id = 'userinventoryvalue'
                uivv.style.cssText = 'padding-top: 20px; color: var(--tc);'
                if (document.getElementById('userinventoryvalue')) {

                } else {
                    var mostrecentprofilelogs = window.console.logs.filter(log => log[0] == 'Profile Aquired.')
                    console.log(mostrecentprofilelogs)
                    if (mostrecentprofilelogs[mostrecentprofilelogs.length-1] != undefined) {
                        var recentlog = mostrecentprofilelogs[mostrecentprofilelogs.length-1]
                        if (recentlog[1] != undefined) {
                            var currentprofileinventory = window.console.logs[window.console.logs.length-1][1].inventory
                            var invval = 0
                            for (var w=0; w<currentprofileinventory.length; w++) {
                                invval += getitemprice(currentprofileinventory[w].stattrak, currentprofileinventory[w].primaryName, currentprofileinventory[w].secondaryName, currentprofileinventory[w].rarity, currentprofileinventory[w].float)
                            }
                            uivv.innerHTML = 'Inventory Value: <span style="color: var(--ac);">$'+numberWithCommas(invval.toFixed(2))+'</span> in '+currentprofileinventory.length+' Items. DENSITY: $'+((numberWithCommas((invval/currentprofileinventory.length).toFixed(2)) != "NaN") ? (numberWithCommas((invval/currentprofileinventory.length).toFixed(2))) : 0)
                            document.getElementsByClassName('profileContainer')[0].appendChild(uivv)
                        }
                    }
                }
                if (Object.keys(vips).includes(document.getElementsByClassName('subText')[0].textContent)) {
                    var vipid = document.getElementsByClassName('subText')[0].textContent
                    document.getElementsByClassName('subText')[0].textContent += " :o"
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('background')[0].style["background-image"] = `url(${vips[vipid].background})`
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('background')[0].style.filter = "saturate(1) grayscale(0)"
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('background')[0].style.opacity = "0.3"
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('name')[0].style.color = vips[vipid].color
                    document.getElementsByClassName('profileMain')[0].style.background = vips[vipid].backgroundgradient
                    var dbio = document.createElement('div')
                    dbio.appendChild(document.createTextNode(vips[vipid].bio))
                    dbio.style.cssText = "padding-top: 20px; color: var(--tc); max-width: 80%; font-style: italic;"
                    document.getElementsByClassName('profileContainer')[0].appendChild(dbio)
                } else if (Object.keys(vips).includes(document.getElementsByClassName('subText')[0].textContent.replace(" :o", ""))) {

                } else {
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('background')[0].style.removeProperty("background-image")
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('background')[0].style.removeProperty("filter")
                    document.getElementsByClassName('profileMain')[0].getElementsByClassName('background')[0].style.removeProperty("opacity")
                    document.getElementsByClassName('profileMain')[0].style.removeProperty("background")
                }
            }
        }, 100)
        setInterval(function(){
            if (document.getElementsByClassName("float")[0]) {
                if (document.getElementsByClassName("floatbar").length) {
                    document.getElementById('fpb').style.width = (Number(document.getElementsByClassName('float')[0].textContent.replace("FLOAT: ","").replace("FNMWFTWWBS",""))*100)+"%"
                } else {
                    var fb = document.createElement("div")
                    fb.className = 'floatbar'
                    fb.style.cssText = "margin-left: 5%; margin-top: 20px; width: 90%; background: rgba(255,255,255,0.1); position: relative; color: white; height: 15px; border-radius: 4px; border: 1px solid var(--ac);"

                    var ffn = document.createElement("div")
                    ffn.style.cssText = "position: absolute; left: 3.5%; top: -15px; color: inherit; transform: translateX(-50%);"
                    ffn.appendChild(document.createTextNode("FN"))
                    ffn.className = "floatnamedisp"
                    fb.appendChild(ffn)

                    var fmw = document.createElement("div")
                    fmw.style.cssText = "position: absolute; left: 11%; top: -15px; color: inherit; transform: translateX(-50%);"
                    fmw.appendChild(document.createTextNode("MW"))
                    fmw.className = "floatnamedisp"
                    fb.appendChild(fmw)

                    var fft = document.createElement("div")
                    fft.style.cssText = "position: absolute; left: 26%; top: -15px; color: inherit; transform: translateX(-50%);"
                    fft.appendChild(document.createTextNode("FT"))
                    fft.className = "floatnamedisp"
                    fb.appendChild(fft)

                    var fww = document.createElement("div")
                    fww.style.cssText = "position: absolute; left: 41%; top: -15px; color: inherit; transform: translateX(-50%);"
                    fww.appendChild(document.createTextNode("WW"))
                    fww.className = "floatnamedisp"
                    fb.appendChild(fww)

                    var fbs = document.createElement("div")
                    fbs.style.cssText = "position: absolute; left: 70%; top: -15px; color: inherit; transform: translateX(-50%);"
                    fbs.appendChild(document.createTextNode("BS"))
                    fbs.className = "floatnamedisp"
                    fb.appendChild(fbs)

                    var fd1 = document.createElement("div")
                    fd1.style.cssText = "width: 0px; border-right: 1px solid var(--ac); height: 100%; position: absolute; left: 7%; bottom: 0px;"
                    var fd2 = document.createElement("div")
                    fd2.style.cssText = "width: 0px; border-right: 1px solid var(--ac); height: 100%; position: absolute; left: 15%; bottom: 0px;"
                    var fd3 = document.createElement("div")
                    fd3.style.cssText = "width: 0px; border-right: 1px solid var(--ac); height: 100%; position: absolute; left: 37%; bottom: 0px;"
                    var fd4 = document.createElement("div")
                    fd4.style.cssText = "width: 0px; border-right: 1px solid var(--ac); height: 100%; position: absolute; left: 44%; bottom: 0px;"
                    fb.appendChild(fd1)
                    fb.appendChild(fd2)
                    fb.appendChild(fd3)
                    fb.appendChild(fd4)

                    var floatprogressbar = document.createElement("div")
                    floatprogressbar.id = 'fpb'
                    floatprogressbar.style.cssText = "width: "+(Number(document.getElementsByClassName('float')[0].textContent.replace("FLOAT: ",""))*100)+"%; background: green; height: 100%; border-radius: 4px;"
                    fb.appendChild(floatprogressbar)

                    var fd = document.getElementsByClassName("float")[0].appendChild(fb)
                    console.log("%c Aspect's Script: Showed the float bar.",'color: green; font-size: 12px; font-style: italic; text-shadow: 0px 2px 0px black, 0px -2px 0px black, 2px 0px 0px black, -2px 0px 0px black;');
                }
            } else {

            }
        }, 250)
        console.log("Loaded Aspect's CSGOClicker Script Successfully!");
    } catch(e) {
        console.log("An unexpected error occurred while loading Aspect's script.",e)
    }
})();