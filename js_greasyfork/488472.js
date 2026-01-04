// ==UserScript==
// @name         MH - Consolidated Map Colour Coder
// @description  Colour code your maps
// @author       Chromatical
// @version      1.2.13
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/488472/MH%20-%20Consolidated%20Map%20Colour%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/488472/MH%20-%20Consolidated%20Map%20Colour%20Coder.meta.js
// ==/UserScript==

//Which style to apply
var applyThisStyle;
$(document).ajaxComplete(async(event,xhr,options) => {
    if (options.url == "https://www.mousehuntgame.com/managers/ajax/board/board.php"){
        $("#chro-madcoder-settings-button")[0] ? null : addButtons();
        process();
        //Event listener to change map
        var allMap = $(".treasureMapRootView-tab");
        for (var i=0;i<allMap.length;i++){
            allMap[i].addEventListener("click", function(){
                applyThisStyle = undefined;
                process()
            })
        }
        var goal = $(".treasureMapRootView-subTab")[0];
        goal.addEventListener("click",function(){
            process();
        })
    }
})

//Initial loading of preset
$(document).ready(function(){
    var styles = localStorage.getItem("Chro-mapcoder-styles")
    styles? null : loadPreset()
});

function process(){
    //Check whether there is this style
    var styleCheck = localStorage.getItem("Chro-mapcoder-styles")
    if (styleCheck){
        var parsedStyleCheck = JSON.parse(styleCheck);
        const mapName = $(".treasureMapView-mapMenu-rewardName")[0].innerText.replace(/Rare /g,'');
        for (var i=0; i<parsedStyleCheck.length;i++){
            if (mapName.includes(parsedStyleCheck[i][0])){
                applyThisStyle = parsedStyleCheck[i];
            }
        }
        applyThisStyle == undefined? applyThisStyle = [mapName,[]] : null;
        colourise();
    }
}

function colourise(){
    var map = applyThisStyle;
    //Reset borders
    document
    .querySelectorAll("#mapcoder-master-div")
    .forEach(el=> el.remove());
    //Highlight uncaught only?
    const isChecked = localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;

    //Where to insert
    var insertDiv = $(".treasureMapView-leftBlock .treasureMapView-block-content")[0]

    //Highlight Div
    const masterDiv = insertDiv.insertAdjacentElement("afterbegin", createElement("div",{
        attrs:{
            id: "mapcoder-master-div"
        },
        css:{
            "display": "inline-flex",
            "margin-bottom": "10px",
            "width": "100%",
            "text-align": "center",
            "line-height": "1.5",
            "overflow": "hidden"
        }
    }));

    //All the mice are listed here
    var allList = $(".treasureMapView-goals-group-goal")
    //Reset to white background
    for (var a=0;a<allList.length;a++){
        allList[a].style.backgroundColor = "white"
    };
    var caughtList = [];
    var uncaughtList = [];
    for (var i=0;i<allList.length;i++){
        var mouseName = $(".treasureMapView-goals-group-goal-name")[i].innerText
        if (allList[i].className.includes("complete")){
            caughtList.push(mouseName)
        } else {
            uncaughtList.push(mouseName)
        }
    }
    //Applying styles
    map[1].forEach(el=>{
        var groupName = el[0]
        var colour = el[1]
        var miceGroupList = [];
        el[2].forEach(mice =>{
            miceGroupList.push(mice)
        })
        var count = 0;
        for (var i=0;i<allList.length;i++){
            for (var j=0; j<miceGroupList.length; j++){
                if (allList[i].innerText == miceGroupList[j]){
                    if (uncaughtList.indexOf(allList[i].innerText)>-1){
                        count++
                        allList[i].style.backgroundColor = colour;
                        break;
                    }
                    if (caughtList.indexOf(allList[i].innerText)>-1){
                        isChecked == true? null: allList[i].style.backgroundColor = colour
                        break;
                    }
                }
            }
        }
        const smallDiv = createElement("div",{
            props: {
                class: "mapcoder-highlight-group-div",
                innerText: groupName + "\n" + count
            },
            css: {
                "width": "auto",
                "padding": "5px",
                "font-weight": "bold",
                "font-size": "12.5px",
                backgroundColor: clr(colour)
            }
        })
        function clr(colour){
            var clr;
            count > 0? clr = colour: clr = "grey";
            return clr
        };
        masterDiv.appendChild(smallDiv);
    })
    //Check if you actually have that style
    if(map[1][1]){
        if ($(".treasureMapView-goals-groups")[1]){
            if ($(".treasureMapView-goals-groups")[1].innerText.includes("Missing")){
                filter($(".treasureMapView-goals-groups")[0].children[1]);
                filter($(".treasureMapView-goals-groups")[1].children[1]);
            } else {
                filter($(".treasureMapView-goals-groups")[0].children[1]);
            }
        };
        function filter(oriUnfiltered){
            var countA = oriUnfiltered.getElementsByTagName("a");
            var unfiltered = document.createElement("div")
            while (countA.length > 0){
                var clone = countA[0].cloneNode(true);
                unfiltered.appendChild(clone);
                oriUnfiltered.removeChild(countA[0])
            }
            var countB = unfiltered.getElementsByTagName("a").length;
            for (var q =0; q<map[1].length;q++){
                for (var r=0; r<countB; r++){
                    if ((rgbToHex(unfiltered.getElementsByTagName("a")[r].style.backgroundColor)).toUpperCase() == map[1][q][1].toUpperCase()){
                    var cloneX = unfiltered.getElementsByTagName("a")[r].cloneNode(true);
                    oriUnfiltered.appendChild(cloneX);
                    }
                }
            }
        }
    }
    //RGB componenets ---------------
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    function rgbToHex(colour) {
        if (colour.includes("rgb")){
            var coloursplit = colour.split("rgb(")[1].split(")")[0].split(", ");
            var result = "#" + componentToHex(Number(coloursplit[0])) + componentToHex(Number(coloursplit[1])) + componentToHex(Number(coloursplit[2]));
        } else {
            result = colour
        };
        return result;
    };
}

function addButtons(){
    var spot = $(".treasureMapRootView-subTabRow.treasureMapRootView-padding")[0]

    const settingsButton = spot.appendChild(createElement("img",{
        attrs:{
            id: "chro-madcoder-settings-button",
            src: "https://www.mousehuntgame.com/images/ui/hgbar/icon_preferences.png?asset_cache_version=2"
        },
        css: {
            //fontSize: "10px",
            height: "20px",
            width: "20px",
            marginLeft: "5px"
            //padding: "0"
        },
        action: {
            click(){settings()}
        }
    }))
}

function settings(){
    document
     .querySelectorAll("#chro-mapcode-settings")
     .forEach(el=> el.remove())

    const mainDiv = document.body.appendChild(createElement("div",{
        attrs: {
            id: "chro-mapcode-settings-div",
        },
        css: {
            backgroundColor : "#F5F5F5",
            position: "fixed",
            zIndex: "9999",
            left: "35vw",
            top: "20vh",
            border: "solid 2px #696969",
            borderRadius: "20px",
            padding: "10px",
            textAlign: "center",
            fontSize: "12px",
        },
        children: [buttonDiv(),content()]
    }))

    function buttonDiv(){
        const buttonDiv = createElement("div",{
            attrs: {
                id: "chro-mapcoder-settings-header-div"
            },
            children:[
                createElement("div",{
                    props:{
                        innerText: "Settings"
                    },
                    css:{
                        float: "left",
                        paddingTop: "4px",
                        marginLeft: "52px",
                        fontWeight: "bold"
                    }
                }),
                createElement("button",{
                    attrs:{
                        id: "mapcoder-close-button"
                    },
                    props:{
                        innerText: "x"
                    },
                    css:{
                        float: "right"
                    },
                    action:{
                        click(){close(buttonDiv)}
                    }
                })]
        })

        function close(div){
            document.body.removeChild($("#chro-mapcode-settings-div")[0])
        };

        return buttonDiv
    }

    function content(){
        const content = createElement("div",{
            attrs:{
                id: "chro-mapcode-content-div"
            },
            css: {
               paddingTop: "25px",
               width: "175px"
            },
            children:[checkHighlight(),addManualStyle(),removeManualStyle(),loadPresetStyle()]
        })
        return content
    }

    //Highlight --- uncaught mice or all--------------
    function checkHighlight(){
        var isChecked = localStorage.getItem("highlightPref") == "uncaught-only" ? true : false;
        var isCheckedStr = isChecked ? "checked" : "";

        const highlight = createElement("tr",{
            children:[
                createElement("label",{
                    attrs:{
                        for: "chro-mapcoder-highlight-box"
                    },
                    props:{
                        innerText: "Highlight uncaught mice only"
                    }
                }),
                createElement("input",{
                    attrs:{
                        type: "checkbox",
                        id: "chro-check-box",
                        name: "chro-mopcoder-highlight-box",
                    },
                    action:{
                        click(){changeCheck()}
                    },
                    props:{
                        checked:isChecked
                    }
                })]
        })
        function changeCheck(){
            var check = $("#chro-check-box")[0];
            if (check.checked == true){
                localStorage.setItem("highlightPref","uncaught-only");
                isCheckedStr = "checked"
            } else {
                localStorage.setItem("highlightPref","all");
                isCheckedStr = ""
            }
            colourise();
        };
        return highlight
    }
    //Check highlight end--------------------------------

    //Add manual style begins-----------------------------------------------------------------------
    function addManualStyle(){
        const manualButton = createElement("button",{
            attrs:{
                id:"chro-mapcode-manual-style-button"
            },
            props: {
                innerText: "Add Mice Group"
            },
            css: {
                marginTop: "5px"
            },
            action:{
                click(){addManual()}
            }
        })

        function addManual(){
            document
                .querySelectorAll("#chro-mapcode-pickstyle-div")
                .forEach(el=> el.remove())

            const mainDiv = document.body.appendChild(createElement("div",{
                attrs: {
                    id: "chro-mapcode-pickstyle-div",
                },
                css: {
                    backgroundColor : "#F5F5F5",
                    position: "fixed",
                    zIndex: "9999",
                    left: "35vw",
                    top: "20vh",
                    border: "solid 2px #696969",
                    borderRadius: "20px",
                    padding: "10px",
                    textAlign: "center",
                    fontSize: "12px",
                },
                children: [manualBox()]
            }))

            function manualBox(){
                const manualBox = createElement("div",{
                    children: [table(),selected(),buttons()]
                })

                function table(){
                    const table = createElement("table",{
                        css: {
                            borderSpacing: "1em 2px"
                        },
                        children:[
                            createElement("tr",{
                                children:[
                                    createElement("td",{
                                        children:[
                                            createElement("label",{
                                            attrs:{
                                                id: "chro-mapcoder-manual-label",
                                                for: "chro-mapcoder-manual-input"
                                            },
                                            props:{
                                                innerText: "Group Name:"
                                            }
                                        })]
                                    }),
                                    createElement("td",{
                                        children:[
                                            createElement("input",{
                                                attrs:{
                                                    id: "chro-mapcoder-manual-input",
                                                    type: "text",
                                                    size: "10"
                                                }
                                            })]
                                    })]
                            }),
                            createElement("tr",{
                                children:[
                                    createElement("td",{
                                        children:[
                                            createElement("label",{
                                                attrs:{
                                                   id: "chro-mapcoder-manual-colour-label",
                                                    for: "chro-mapcoder-manual-colour-input"
                                                },
                                                props:{
                                                    innerText: "Colour:"
                                                }
                                            })]
                                    }),
                                    createElement("td",{
                                        children: [
                                            createElement("input",{
                                                attrs:{
                                                    id:"chro-mapcoder-manual-colour-input",
                                                    type: "text",
                                                    size: "10"
                                                }
                                            })]
                                    })]
                            })]
                    })
                    return table
                }
                function selected(){
                    const selected = createElement("div",{
                        attrs:{
                            id: "chro-mapcoder-selected-mice"
                        },
                        props:{
                            innerText: "Selected Mice:"
                        }
                    })
                    return selected
                }
                function buttons(){
                    const buttons = createElement("div",{
                        children:[
                            createElement("button",{
                                attrs:{
                                    id:"chro-mapcoder-manual-confirm-btn"
                                },
                                props:{
                                    innerText: "Confirm"
                                },
                                action:{
                                    click(){add()}
                                }
                            }),
                            createElement("button",{
                                attrs:{
                                    id: "chro-mapcoder-manual-cancel-btn"
                                },
                                props:{
                                    innerText: "Cancel"
                                },
                                action:{
                                    click(){close()}
                                }
                            })]
                    })
                    //Close function
                    function close(){
                        document.body.removeChild($("#chro-mapcode-pickstyle-div")[0]);
                        for (var i=0; i <allSpans.length; i++){
                            allSpans[i].removeEventListener("click",listen)
                        }
                    }
                    //Add mice to list function
                    function add(){
                        var groupName = $("#chro-mapcoder-manual-input")[0].value
                        var colour = $("#chro-mapcoder-manual-colour-input")[0].value
                        var addList = [];
                        var miceList = $("#chro-mapcoder-selected-mice")[0].children
                        for (var i=0;i<miceList.length;i++){
                            addList.push(miceList[i].innerText);
                        }
                        //Gettings styles from localStorage
                        const data = localStorage.getItem("Chro-mapcoder-styles")
                        if (data){var parsedData = JSON.parse(data)}
                        //Checking whether the blanks are filled
                        var map;
                        if (groupName && colour && addList.length > 0 && parsedData){
                            for (var j=0;j<parsedData.length;j++){
                                if ($(".treasureMapView-mapMenu-rewardName")[0].innerText == (parsedData[j][0])){
                                    map = parsedData[j]
                                    }
                            }
                            //If there is no existing map, add a new mao
                           if (map == undefined){
                               parsedData.push(applyThisStyle)
                               var last = parsedData.length-1
                               map = parsedData[last]
                           }
                            //Check whether there is same group name, if yes, delete
                            for (var k=0;k<map[1].length;k++){
                                if (map[1][k][0] == groupName){
                                    map[1].splice(k,1)
                                }
                            }
                            //Adding the group to the map
                            map[1].push([groupName,colour,addList]);
                            localStorage.setItem("Chro-mapcoder-styles",JSON.stringify(parsedData))
                            //Resetting the boxes
                            $("#chro-mapcoder-manual-input")[0].value = "";
                            $("#chro-mapcoder-manual-colour-input")[0].value = "";
                            addList = [];
                            var target = $("#chro-mapcoder-selected-mice")[0]
                            while (target.firstChild){
                                target.removeChild(target.firstChild)
                            }
                            //for some it considers inner text as child node;
                            $("#chro-mapcoder-selected-mice")[0].innerText = "Selected Mice:";
                            //remove previous elements
                            document
                             .querySelectorAll("#mapcoder-master-div")
                             .forEach(el=> el.remove())
                            //colourise it again
                            applyThisStyle = map;
                            colourise();
                        }
                    }
                    return buttons
                }
                return manualBox
            }

            var allSpans = $(".treasureMapView-goals-group-goal")
            var current = [];
            for (var i=0; i <allSpans.length; i++){
                //Remove event listener
                allSpans[i].addEventListener("click",listen,false)
            }

            //Listening function, highlights
            function listen(){
                var mouseName = this.children[0].children[1].innerText;
                var target = $("#chro-mapcoder-selected-mice")[0]
                if (current.indexOf(mouseName)<0){
                    //Highlight background to become light blue
                    this.style.backgroundColor = "#00EEEE";
                    this.style.fontWeight = "bold"
                    current.push(mouseName);
                    target.appendChild(createElement("div",{
                        props:{
                            innerText: mouseName
                        }
                    }));
                } else if (current.indexOf(mouseName)>=0){
                    this.style.backgroundColor = "white";
                    this.style.fontWeight = "";
                    var x = current.indexOf(mouseName);
                    current.splice(x,1);
                    if (target.children.length !== 0){
                        const {children} = target;
                        for (var j=0; j<children.length; j++){
                            if (children[j].innerText == mouseName){
                                target.removeChild(children[j])
                            }
                        }
                    }
                }
            }

        }
        return manualButton
    }
    //Add Manual Style Ends------------------------------------------------------

    //Remove Manual Style Begins-------------------------------------------------
    function removeManualStyle(){
        const removeManualButton = createElement("button",{
            attrs:{
                id:"chro-mapcode-manual-remove-button"
            },
            props: {
                innerText: "Remove Mice Group"
            },
            css: {
                marginTop: "5px"
            },
            action:{
                click(){removeGroup()}
            }
        })
        //Remove whichever group
        function removeGroup(){

            //Stop button starts---------------------------------------------------
            const stopButton = document.body.appendChild(createElement("div",{
                attrs:{
                    id: "chro-mapcode-cancel-div1"
                },
                css: {
                    backgroundColor : "#F5F5F5",
                    position: "fixed",
                    zIndex: "9999",
                    left: "30vw",
                    top: "35vh",
                    border: "solid 2px #696969",
                    borderRadius: "20px",
                    padding: "10px",
                    textAlign: "center",
                    fontSize: "12px",
                },
                children:[
                    createElement("button",{
                        attrs:{
                            id: "chro-mapcode-remove-div"
                        },
                        props:{
                            innerText: "Stop Removing"
                        },
                        action:{
                            click(){stop()}
                        }
                    })]
            }))
            function stop(){
                const masterDiv = $("#mapcoder-master-div")[0];
                for (var i=0;i<masterDiv.children.length;i++){
                    masterDiv.children[i].removeEventListener("click",remove,false)
                };
                document.body.removeChild($("#chro-mapcode-cancel-div1")[0]);
            }

            //Listen to events
            const masterDiv = $("#mapcoder-master-div")[0]
            for (var i=0;i<masterDiv.children.length;i++){
                masterDiv.children[i].addEventListener("click",remove,false);
                masterDiv.children[i].style.cursor = "pointer"
            }

            function remove(){
                var selected = this;
                const removeBox = document.body.appendChild(createElement("div",{
                    attrs:{
                        id: "chro-mapcode-remove-div"
                    },
                    css: {
                        backgroundColor : "#F5F5F5",
                        position: "fixed",
                        zIndex: "9999",
                        left: "40vw",
                        top: "40vh",
                        border: "solid 2px #696969",
                        borderRadius: "20px",
                        padding: "10px",
                        textAlign: "center",
                        fontSize: "12px",
                    },
                    props:{
                        innerText: "Remove this group?"
                    },
                    children:[
                        createElement("div",{
                            attrs:{
                                id: "Chro-mapcode-remove-stop-div"
                            },
                            children:[
                                createElement("button",{
                                    attrs:{
                                        id: "Chro-mapcode-remove-confirm-button"
                                    },
                                    props:{
                                        innerText: "Confirm"
                                    },
                                    action:{
                                        click(){removeGroup1(selected);document.body.removeChild(removeBox)}
                                    }
                                }),
                                createElement("button",{
                                    attrs:{
                                        id: "Chro-mapcode-remove-cancel-button"
                                    },
                                    props:{
                                        innerText: "Cancel"
                                    },
                                    action:{
                                        click(){document.body.removeChild(removeBox)}
                                    }
                                })]
                        })]
                }))
                function removeGroup1(selected){
                    var groupName = selected.innerHTML.split("<br>")[0]
                    console.log(groupName);
                     //Gettings styles from localStorage
                      const data = localStorage.getItem("Chro-mapcoder-styles")
                      if (data){var parsedData = JSON.parse(data)}
                      for (var j=0;j<parsedData.length;j++){
                          if ($(".treasureMapView-mapMenu-rewardName")[0].innerText.includes(parsedData[j][0])){
                              var map = parsedData[j]
                          }
                      }
                    for (var k=0;k<map[1].length;k++){
                        if (map[1][k][0] == groupName){
                            map[1].splice(k,1)
                        }
                    }
                    //Restyle it
                    localStorage.setItem("Chro-mapcoder-styles",JSON.stringify(parsedData))
                    //remove previous elements
                    document
                    .querySelectorAll("#mapcoder-master-div")
                    .forEach(el=> el.remove());
                    //ReColour
                    applyThisStyle = map
                    colourise();
                }
            }
            return masterDiv
        }
        return removeManualButton
    }
    //Remove button ends ----------------------------------------------------------------------

    //Load preset button begins----------------------
    function loadPresetStyle(){
        const presetButton = createElement("button",{
            attrs:{
                id:"chro-mapcode-preset-button"
            },
            props: {
                innerText: "Reset All Presets"
            },
            css: {
                marginTop: "5px"
            },
            action:{
                click(){loadPreset()}
            }
        })
        return presetButton
    }
    dragElement(mainDiv,mainDiv);
}

function loadPreset(){
    alert("Preset styles loaded, reload map to load styles");
    localStorage.setItem("Chro-mapcoder-styles",JSON.stringify([
        //Follow this style
        ["Queso Canyon Grand Tour Treasure Chest",[
            ["KSS","#6699CC",["Kalor'ignis of the Geyser","Stormsurge the Vile Tempest"]], //blue
            ["CinBrut","#99ff66",["Bruticus the Blazing","Cinderstorm"]], //green
            ["BE 3","#ff6666",["Ignatia","Smoldersnap","Bearded Elder"]], //red
            ["SizM","yellow",["Sizzle Pup","Mild Spicekin"]],
            ["Pressure","#cc99ff",["Pyrehyde","Steam Sailor","Vaporior","Warming Wyvern"]], //purple
            ["QR", "#00cc44",["Pump Raider","Tiny Saboteur","Croquet Crusher","Sleepy Merchant"]], //darker green
            ["Corky", "orange",["Fuzzy Drake","Rambunctious Rain Rumbler","Horned Cork Hoarder","Cork Defender","Burly Bruiser","Corky the Collector"]],
            ["PP", "#99ffff",["Old Spice Collector","Spice Farmer","Spice Sovereign","Spice Raider","Granny Spice","Spice Finder","Spice Seer","Spice Reaper"]], //cyan
            ["CQ", "pink",["Rubble Rouser","Rubble Rummager","Tiny Toppler","Ore Chipper","Chip Chiseler","Grampa Golem","Nachore Golem","Fiery Crusher",]],
            ["Boss", "silver",["Inferna, The Engulfed","Nachous, The Molten","Queen Quesada","Emberstone Scaled","Corkataur",]]
        ]],
        ["Sky Pirate Treasure Chest",[
            ["LP","#c97c49",["Skydiver","Skygreaser","Launchpad Labourer","Cloud Miner"]],
            ["Ward","#ffffff",["Warden of Rain","Warden of Wind","Warden of Frost","Warden of Fog"]],
            ["Phys","#59e031",["Ground Gavaleer","Sky Swordsman","Herc","Sky Squire","Paragon of Strength"]],
            ["Shadow","#8f75e2",["Paragon of Shadow","Astrological Astronomer","Overcaster","Stratocaster","Shadow Sage"]],
            ["Tact","#fff935",["Paragon of Tactics","Worried Wayfinder","Gyrologer","Seasoned Islandographer","Captain Cloudkicker"]],
            ["Arc","#0be496",["Paragon of Arcane","Sky Glass Sorcerer","Sky Glass Glazier","Sky Dancer","Sky Highborne"]],
            ["Forg","#338838",["Paragon of Forgotten","Spry Sky Explorer","Spry Sky Seer","Cumulost","Spheric Diviner"]],
            ["Hydro","#5d9fce",["Paragon of Water","Nimbomancer","Sky Surfer","Cute Cloud Conjurer","Mist Maker"]],
            ["Draco","#f06a60",["Paragon of Dragons","Tiny Dragonfly","Lancer Guard","Dragonbreather","Regal Spearman"]],
            ["Law","#f9a645",["Paragon of the Lawless","Devious Gentleman","Stack of Thieves","Lawbender","Agent M"]],
            ["Pirate","#ECA4A6",["Suave Pirate","Cutthroat Pirate","Cutthroat Cannoneer","Scarlet Revenger","Mairitime Pirate"]]
        ]],
        ["Empyrean Sky Palace Treasure Chest",[
            ["LP","#c97c49",["Skydiver","Skygreaser","Launchpad Labourer","Cloud Miner"]],
            ["Ward","#ffffff",["Warden of Rain","Warden of Wind","Warden of Frost","Warden of Fog"]],
            ["Phys","#59e031",["Ground Gavaleer","Sky Swordsman","Herc","Sky Squire","Paragon of Strength","Glamorous Gladiator"]],
            ["Shad","#8f75e2",["Paragon of Shadow","Astrological Astronomer","Overcaster","Stratocaster","Shadow Sage","Zealous Academic"]],
            ["Tact","#fff935",["Paragon of Tactics","Worried Wayfinder","Gyrologer","Seasoned Islandographer","Captain Cloudkicker","Rocketeer"]],
            ["Arc","#0be496",["Paragon of Arcane","Sky Glass Sorcerer","Sky Glass Glazier","Sky Dancer","Sky Highborne","Sky Glider"]],
            ["Forg","#338838",["Paragon of Forgotten","Spry Sky Explorer","Spry Sky Seer","Cumulost","Spheric Diviner","Forgotten Elder"]],
            ["Hyd","#5d9fce",["Paragon of Water","Nimbomancer","Sky Surfer","Cute Cloud Conjurer","Mist Maker","Cloud Strider"]],
            ["Drac","#f06a60",["Paragon of Dragons","Tiny Dragonfly","Lancer Guard","Dragonbreather","Regal Spearman","Empyrean Javelineer"]],
            ["Law","#f9a645",["Paragon of the Lawless","Devious Gentleman","Stack of Thieves","Lawbender","Agent M","Aristo-Cat Burglar"]],
            ["Pir","#ECA4A6",["Suave Pirate","Cutthroat Pirate","Cutthroat Cannoneer","Scarlet Revenger","Mairitime Pirate", "Admiral Cloudbeard"]],
            ["Rich","#E3E024",["Richard the Rich"]],
            ["SP","#7DDBDA",["Fortuitous Fool","Empyrean Appraiser","Empyrean Geologist","Consumed Charm Tinkerer","Empyrean Empress", "Peggy the Plunderer"]]
        ]],
        ["Halloween Treat Treasure Chest",[
            ["Standard","#fff935",["Grey Recluse","Cobweb","Teenage Vampire","Zombot Unipire","Candy Cat","Candy Goblin","Shortcut","Tricky Witch","Sugar Rush"]],
            ["Jack O","#f9a645",["Spirit Light","Gourdborg","Pumpkin Hoarder","Trick","Treat","Wild Chainsaw","Maize Harvester"]]
        ]],
         ["Halloween Trick Treasure Chest",[
            ["Bone","#bfbfbf",["Creepy Marionette","Dire Lycan","Grave Robber","Hollowhead","Mousataur Priestess","Sandmouse","Titanic Brain-Taker","Tomb Exhumer"]],
            ["Polter","#5d9fce",["Admiral Arrrgh","Captain Cannonball","Ghost Pirate Queen","Gourd Ghoul","Scorned Pirate","Spectral Butler","Spectral Swashbuckler"]],
            ["Scream","#5ae031",["Baba Gaga","Bonbon Gummy Globlin","Hollowed","Hollowed Minion","Swamp Thang"]]
        ]],
        ["Nice Treasure Chest",[
            ["Std","#fff935",["Hoarder","Gingerbread"]],
            ["SB","#f7f6f6",["Mouse of Winter Past","Mouse of Winter Present","Mouse of Winter Future","Scrooge"]],
            ["PP","#ba6900",["Builder","Snow Golem Jockey","Nice Knitting","Glacia Ice Fist","Borean Commander","Frigid Foreman","Great Winter Hunt Impostor","Naughty Nougat","Snow Golem Jockey","Snow Scavenger","Ridiculous Sweater","Stuck Snowball","Iceberg Sculptor","Shorts-All-Year","Great Giftnapper"]],
            ["Winter","#dedede",["Snowflake"]],
            ["LISC","#4882d1",["Snow Golem Architect"]]
        ]],
        ["Naughty Treasure Chest",[
            ["PP","#c97c49",["Builder","Snow Golem Jockey","Nice Knitting","Glacia Ice Fist","Borean Commander","Frigid Foreman","Great Winter Hunt Impostor","Naughty Nougat","Snow Golem Jockey","Snow Scavenger","Ridiculous Sweater","Stuck Snowball","Iceberg Sculptor","Shorts-All-Year","Great Giftnapper"]],
            ["Sports","#df74f7",["Sporty Ski Instructor","Young Prodigy Racer","Toboggan Technician","Free Skiing","Nitro Racer","Rainbow Racer","Double Black Diamond Racer","Black Diamond Racer"]],
            ["Toys","#f06a60",["Nutcracker","Toy","Slay Ride","Squeaker Claws","Destructoy","Toy Tinkerer","Mad Elf","Elf"]],
            ["Orna","#5ae031",["Christmas Tree","Stocking","Candy Cane","Ornament","Missile Toe","Wreath Thief","Ribbon","Snowglobe"]],
            ["Snow","#4fcaff",["Snow Fort","Snowball Hoarder","S.N.O.W. Golem","Snow Sorceress","Reinbo","Tundra Huntress","Snowblower","Snow Boulder"]],
            ["Firewks","#cd87ff",["Frightened Flying Fireworks","New Year's","Party Head"]],
            ["Glazy","#fcaf35",["Glazy","Joy"]],
            ["LISC","#4882d1",["Snow Golem Architect"]],
            ["Boss","#999999",["Ol' King Coal"]]
        ]],
        ["Birthday Treasure Chest",[
            ["Std","#ab846a",["Birthday","Buckethead","Present","Pintail","Dinosuit","Sleepwalker","Terrible Twos"]],
            ["SB","#e8e4e7",["Cheesy Party"]],
            ["Mixing","#1ec7b6",["Force Fighter Blue","Force Fighter Green","Force Fighter Pink","Force Fighter Red","Force Fighter Yellow","Super FighterBot MegaSupreme"]],
            ["Break","#e98eb5",["Breakdancer","Fete Fromager","Dance Party","El Flamenco","Para Para Dancer"]],
            ["Pump","#e3ac30",["Reality Restitch","Time Punk","Time Tailor","Time Thief","Space Party-Time Plumber"]],
            ["QA","#6c71c6",["Cupcake Candle Thief","Cupcake Cutie","Sprinkly Sweet Cupcake Cook","Cupcake Camo","Cupcake Runner"]],
            ["FRC","#a9edf9",["Factory Technician"]],
            ["Vince","#cd87ff",["Vincent, The Magnificent"]]
        ]],
        ["Fort Rox Treasure Chest",[
            ["Day","yellow",["Meteorite Snacker","Mining Materials Manager","Mischievous Meteorite Miner","Hardworking Hauler","Meteorite Miner","Meteorite Mover"]],
            ["Dawn","silver",["Dawn Guardian","Monster of the Meteor"]],
            ["Special","pink",["Nightmancer","Nightfire"]],
            ["Shadow","orange",["Night Shift Materials Manager","Werehauler","Wealthy Werewarrior","Mischievous Wereminer","Alpha Weremouse","Wereminer","Reveling Lycanthrope"]],
            ["Arcane","#6699CC",["Hypnotized Gunslinger","Arcane Summoner","Night Watcher","Cursed Taskmaster","Meteorite Golem","Meteorite Mystic"]] //blue
        ]],
    ]))
}

function createElement(tagName, config = {}){
    const el = document.createElement(tagName);
    if (config.attrs) Object.entries(config.attrs).forEach(([attr, val]) => el.setAttribute(attr, val));
    if (config.props) Object.entries(config.props).forEach(([prop, val]) => el[prop] = val);
    if (config.css) Object.entries(config.css).forEach(([prop, val]) => el.style[prop] = val);
    if (config.children) config.children.forEach(child => el.append(child));
    if (config.action) Object.entries(config.action).forEach(([prop,val]) => el.addEventListener(prop,()=>{val()}));
        return el;
};

function dragElement(elmnt,dragEl) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  /*if (elmnt.firstElementChild) {
    // if present, the header is where you move the DIV from:
   elmnt.firstElementChild.onmousedown = dragMouseDown;
  } else {*/
    // otherwise, move the DIV from anywhere inside the DIV:
    dragEl.onmousedown = dragMouseDown;
  //}

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
