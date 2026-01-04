// ==UserScript==
// @name         MH - BWrift Portal Tracker (Public)
// @version      1.2.0
// @description  Tracks and upload data on Bwrift Portals
// @author       Chromatical
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @resource     YOUR_CSS https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      self
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/427152/MH%20-%20BWrift%20Portal%20Tracker%20%28Public%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427152/MH%20-%20BWrift%20Portal%20Tracker%20%28Public%29.meta.js
// ==/UserScript==

// Please state whether you want to display your MH name or not in SETTINGS
// A unique name would let you check your own data (in the future)

$(document).ajaxStop(function() {
    var cssTxt = GM_getResourceText ("YOUR_CSS");
    GM_addStyle (cssTxt);
});

//Settings
const useMHname = false; // Set to true to use MH name, false to use 'Anonymous' or unique name
const useThisName = 'Anonymous'; //
const showTrackingName = true; //Set to false to display only "tracking" without the name (to see if you are submitting with your name)
const debug1 = false;
//Settings end

var count = 0 //How many portals have been tracked on this reload

$(function () {
    const Timeout = setTimeout(function(){
        //Listens to bwrift travel requests, parses data (function parsedata) AND runs the same observe(function observe)
        travelListener();
        //If already at bwrift
        if (user.environment_name == "Bristle Woods Rift"){
            if(debug1) createBox();
            checkportal();
            observe();
            render();
        }
    },1000);
});

//Observes changes to DOM
function observe(){
    const observer = new MutationObserver(function(){
        if (user.quests.QuestRiftBristleWoods.chamber_status == "open"){
            bwriftTrack();
            if(debug1) submitDataTest();
        }
    });
    const observerTarget = $('.riftBristleWoodsHUD-portalContainer')[0];
    const config = {childList: true, subtree: true};
    observer.observe(observerTarget,config);
}

//Checks for localstorage
function checkportal(){
    var portalArr = localStorage.getItem("bwrift-portal-stats-p");
    if (portalArr === null){
        var emptySet = []
        localStorage.setItem("bwrift-portal-stats-p",JSON.stringify(emptySet))
    }
}

//Main function
function bwriftTrack(){
    if (debug1){
        console.log("Portal!")
    };
    var now = new Date();
    if (user.quests.QuestRiftBristleWoods.chamber_status == "open"){
        //Sand
        var sandAmt = $(".riftBristleWoodsHUD-footer-item-quantity")[0].innerText

        //Portal
        var portal = document.getElementsByClassName('riftBristleWoodsHUD-portalContainer')[0];
        var portalAmt = portal.children.length;
        var portalName = []
        for (var i=0;i<portalAmt;i++){
            portalName[i] = portal.children[i].getElementsByClassName('riftBristleWoodsHUD-portal-name')[0].textContent;
        };
        //Buffs
        var effects = user.quests.QuestRiftBristleWoods.status_effects;
        var gb,fa,ic;
        //Guard Barracks
        if (effects.un.indexOf("active")>-1){
            gb = "Cursed"
        } else if (effects.ng.indexOf("active")>-1){
            gb = "Buffed"
        } else if (effects.ng == "default"){
            gb = "Default"
        };
        //Frozen Alcove
        if (effects.fr.indexOf("active")>-1){
            fa = "Cursed"
        } else if (effects.ac.indexOf("active")>-1){
            fa = "Buffed"
        } else if (effects.ac == "default"){
            fa = "Default"
        };
        //Ingress
        if (effects.st.indexOf("active")>-1){
            ic = "Cursed"
        } else if (effects.ex.indexOf("active")>-1){
            ic = "Buffed"
        } else if (effects.ex == "default"){
            ic = "Default"
        }

        //Your name
        var name;
        if (useMHname){
            name = user.username
        } else {
            name = useThisName
        };

        //Record the data
        if(portalName[0] !== ""){
            var Arr = JSON.parse(localStorage.getItem("bwrift-portal-stats-p"));
            var newArr = [sandAmt,gb,fa,ic,portalName,name]
            Arr.push(newArr);
            localStorage.setItem("bwrift-portal-stats-p",JSON.stringify(Arr));

         //Submit the data
            var arraystring = JSON.stringify(newArr);
            const webAppUrl = 'https://script.google.com/macros/s/AKfycbyxlMZk2iXty3To2R3Dm_c8zrV_aPfZYrxG9uJF4rXcraCt_YjB4Vmae2Fo8PXyk-oS/exec';
               if (webAppUrl){
                   GM_xmlhttpRequest({
                       method: "POST",
                       url: webAppUrl,
                       data: arraystring,
                       onload: function(response){
                           console.log("data submitted")
                           checkSubmit("success")
                       },
                       onerror: function(response){
                           console.log("data submission failed")
                           checkSubmit("failed")
                       }
                   })
               }
            setInterval(function(){
                checkSubmit("default");
            },1000)
        }
    }
}

//Render the 'track' wording
function render(){
    var name;
        if (useMHname){
            name = user.username
        } else {
            name = useThisName
        };
    //Get data from local storage
    var amt_json = JSON.parse(localStorage.getItem("bwrift-portal-stats-p"));
    var totalSets = amt_json.length

    //Construct "tracking" in main DOM
    const track = document.createElement("div");
    if (showTrackingName){
        track.title = "Tracking portal data as ".concat(name, ".\nDisplayed name can be changed in MH-Bwrift Portal Tracker.\nTotal sets submitted: ",(totalSets))
        track.innerText = "Tracking (".concat(name,")")
    } else {
        track.title = "Tracking portal data. Name can be displayed by changing settings in MH-Bwrift Portal Tracker.\nTotal sets submitted :".concat(totalSets)
        track.innerText = "Tracking"
    }
    track.className = "portal-track-data"
    track.style.cursor = "context-menu"
    track.style.fontWeight = "600"
    track.style.float = "right"
    track.style.marginRight ="40px"
    track.style.color = "silver"
    const bb = $(".riftBristleWoodsHUD-acolyteStats")[0];
    bb.insertAdjacentElement('beforebegin',track);
}

//Listens to travel requests
function travelListener(){
    if (debug1) console.log("Listening to travel requests")
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (){
        this.addEventListener("load",function(){
            if (this.responseURL === "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php"){
                if (debug1){
                    console.log("Travelled Sometwhere")
                };
                try {
                    const data = JSON.parse(this.responseText);
                    if (data)parsedata(data);
                } catch (error){
                    console.log("Error")
                }
            }
        });
        originalOpen.apply(this,arguments);
    }
};

//Checks whether is BWrift or not
function parsedata(data){
    const result = data.user.environment_name
    if (result == "Bristle Woods Rift"){
            checkportal();
            observe();
            render();
    }
}

//Changes status according to data state
function checkSubmit(status){
    if (status == "success"){
        count ++
        $(".portal-track-data")[0].innerText = "Submitting ..."
    } else if (status == "failed"){
        $(".portal-track-data")[0].innerText = "Submission Failed"
    } else if (status == "default"){
        $(".portal-track-data")[0].innerText = 'Sets Submitted: '.concat(count);
        var amt_json = JSON.parse(localStorage.getItem("bwrift-portal-stats-p"));
        var totalSets = amt_json.length
        $(".portal-track-data")[0].title = 'Total sets submitted: '.concat(totalSets)
    }
}

//Debugging----------------------------------------------------
function createBox(){
    var box = $(".riftBristleWoodsHUD-acolyteStats")[0];
    box.addEventListener("click",function(){
        $.confirm({
            title: 'Portal Scramble Tracker',
            boxWidth: '50%',
            useBootstrap: false,
            closeIcon: true,
            draggable: true,
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Paste your WebApp link here. Only needed the first time unless you need to update it.</label>' +
            '<input type="text" placeholder="Paste WebApp Link Here" class="webapp link" size="100" "/>' +
            '</div>' +
            '</form>',
            buttons: {
                formsubmit: {
                    text: 'Submit Link',
                    btnClass: 'btn-blue',
                    action: function(){
                        submitDataTest()
                    }
                },
                cancel: function(){
                },
            }
        })
    })
}

function submitDataTest(){
     var name;
     if (useMHname){
         name = user.username
     } else {
         name = useThisName
     };

    var lastArray = [123,'default','default','default',['test1','test2','test3'],name]
    var arraystring = JSON.stringify(lastArray)
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbw03hvTIV767ZDooo-bv1I3KEKaqd0BYt-jkngevF0/dev'
    if (webAppUrl){
        GM_xmlhttpRequest({
            method: "POST",
            url: webAppUrl,
            data: arraystring,
            onload: function(response){
                if (debug1){
                    console.log("data submitted")
                }
            },
            onerror: function(response){
                if (debug1){
                    console.log("data submission failed")
                }
            }
        })
    }
}