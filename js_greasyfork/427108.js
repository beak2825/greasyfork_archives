// ==UserScript==
// @name         MH - BWRift Portal Statistics Tracker (Private Tracking)
// @version      1.1.7
// @description  Tracks and upload your data on Bristle Wood Rift portals.
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
// @downloadURL https://update.greasyfork.org/scripts/427108/MH%20-%20BWRift%20Portal%20Statistics%20Tracker%20%28Private%20Tracking%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427108/MH%20-%20BWRift%20Portal%20Statistics%20Tracker%20%28Private%20Tracking%29.meta.js
// ==/UserScript==

//Instructions and Spreadsheet can be found at https://tinyurl.com/bwrift-portal
$(document).ready(function() {
    var cssTxt = GM_getResourceText ("YOUR_CSS");
    GM_addStyle (cssTxt);
});

(function() {
    const Timeout = setTimeout(function(){
        if (user.environment_name == "Bristle Woods Rift"){
            console.log("BWRift Portal Tracker Enabled");
            createBox();
            checkportal();
            observe();
            //listen(); deprecated
        }
    },1000);
})();

//Observes changes to DOM
function observe(){
    const observer = new MutationObserver(function(){
        if (user.quests.QuestRiftBristleWoods.chamber_status == "open"){
            bwriftTrack();
            submitData2();
        }
    });
    const observerTarget = $('.riftBristleWoodsHUD-portalContainer')[0];
    const config = {childList: true, subtree: true};
    observer.observe(observerTarget,config);
}

//Listens to scramble being clicked
/*function listen(){
    var clicked = $(".riftBristleWoodsHUD-portalEquipment-action")[0]
    clicked.addEventListener("click",function(){
        console.log("clicked");
        var clicked2 = $(".mousehuntActionButton")[26]
        clicked.addEventListener("click",function(){
            bwriftTrack()
        })
    })
}*/

//Checks for localstorage
function checkportal(){
    var portalArr = localStorage.getItem("bwrift-portal-stats");
    if (portalArr === null){
        var emptySet = []
        localStorage.setItem("bwrift-portal-stats",JSON.stringify(emptySet))
    }
}

//Main function
function bwriftTrack(){
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
        } else if (effects.ex.indexOf("active">-1)){
            ic = "Buffed"
        } else if (effects.ex == "default"){
            ic = "Default"
        };
        //Record the data
        if(portalName[0] !== ""){
            var Arr = JSON.parse(localStorage.getItem("bwrift-portal-stats"));
            var newArr = [now,sandAmt,gb,fa,ic,portalName]
            Arr.push(newArr);
            localStorage.setItem("bwrift-portal-stats",JSON.stringify(Arr));
        }
    }
}

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
                    text: 'Submit Data',
                    btnClass: 'btn-blue',
                    action: function(){
                        const link = this.$content.find('.webapp.link').val();
                        if(link){
                            localStorage.setItem('bwrift-portal.link',link)
                        }
                        submitData();
                    }
                },
                cancel: function(){
                },
            }
        })
    })
}

function submitData(){
    //This submits the entire log from localstorage, will replace everything in the sheets
    //Triggers everything you click 'submit'
    const stats = localStorage.getItem('bwrift-portal-stats')
    const webAppUrl = localStorage.getItem('bwrift-portal.link')
    if (webAppUrl){
        GM_xmlhttpRequest({
            method: "POST",
            url: webAppUrl,
            data: stats,
            onload: function(response){
                console.log("data submitted")
            },
            onerror: function(response){
                console.log("data submission failed")
            }
        })
    }
}

function submitData2(){
    //This submits the latest data when triggered by Observer Mutation
    //Theoretically if you're using the same computer both submission method doesn't matter
    const stats = JSON.parse(localStorage.getItem('bwrift-portal-stats'))
    var a = stats.length
    var b = a-1; // >.< can i do [a-1]?
    var lastArray = ["short",stats[b]]
    var arraystring = JSON.stringify(lastArray)
    const webAppUrl = localStorage.getItem('bwrift-portal.link')
    if (webAppUrl){
        GM_xmlhttpRequest({
            method: "POST",
            url: webAppUrl,
            data: arraystring,
            onload: function(response){
                console.log("data submitted")
            },
            onerror: function(response){
                console.log("data submission failed")
            }
        })
    }
}
