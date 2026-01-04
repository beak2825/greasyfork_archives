// ==UserScript==
// @name         MH - Quick Travel Tool
// @description  Travel + Arm last saved setup in a button!
// @author       Chromatical
// @version      1.0.1
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428584/MH%20-%20Quick%20Travel%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/428584/MH%20-%20Quick%20Travel%20Tool.meta.js
// ==/UserScript==

$(document).ready(function(){
    addPoint()
    var data = localStorage.getItem("Chro-travel-location")
    data? null: getData()
})

function getData(){
    postReq("https://www.mousehuntgame.com/managers/ajax/pages/page.php",
            `sn=Hitgrab&hg_is_ajax=1&page_class=Travel&last_read_journal_entry_id=${lastReadJournalEntryId}&uh=${user.unique_hash}`)
    .then(res=>{
        try{
            var data = JSON.parse(res.responseText);
            if (data){
                var location = data.page.tabs[0].regions
                var locationData = {}
                location.forEach(el=>{
                    el.environments.forEach(el2=>{
                        var locationName = el2.name
                        var locationType = el2.type
                        locationData[locationName] = locationType
                    })
                })
                localStorage.setItem("Chro-travel-location",JSON.stringify(locationData))
            }
        } catch (error){
            console.log(error)
        }
    })
}

function addPoint(){

    var target = $(".travel")[0]
    if (target){
        const travelButton = target.insertAdjacentElement("beforeend",(createElement('div',{
            action: {
                click(){addTravelBox()}
            },
            children:[
                createElement("ul",{
                    children:[
                        createElement("li",{
                            attrs:{
                                class: 'travel'
                            },
                            children:[
                                createElement("a",{
                                    props:{
                                        innerText: "Quick Travel"
                                    },
                                    children:[
                                        createElement("icon",{
                                            attrs:{
                                                class: "icon"
                                            },
                                            css:{
                                                'background-image': "url'(https://www.mousehuntgame.com/images/ui/hud/menu/travel.png?asset_cache_version=2')"
                                            },
                                        })]
                                })]
                        })]
                })]
        })))
    }
}


function addTravelBox(){

    function getStats() {
        var currentLocation = user.environment_name
        var currentBait = user.bait_item_id;
        var currentCharm = user.trinket_item_id;
        var currentTrap = user.weapon_item_id;
        var currentBase = user.base_item_id;
        var trapName = user.weapon_name;
        var baseName = user.base_name;
        var baitName = user.bait_name;
        var charmName = user.trinket_name;

        var setup = localStorage.getItem("Chro-travel-setup");
        if (setup){
            var parsedSetup = JSON.parse(setup);
            for (var i=0;i<parsedSetup.length;i++){
                if (currentLocation == parsedSetup[i][0]){
                    parsedSetup.splice(i,1)
                }
            }
            parsedSetup.push([currentLocation,currentTrap,currentBase,currentBait,currentCharm,trapName,baseName,baitName,charmName]);
            localStorage.setItem("Chro-travel-setup",JSON.stringify(parsedSetup));
         } else {
             parsedSetup = []
             parsedSetup.push([currentLocation,currentTrap,currentBase,currentBait,currentCharm,trapName,baseName,baitName,charmName]);
             localStorage.setItem("Chro-travel-setup",JSON.stringify(parsedSetup));
         }
    }

    document
     .querySelectorAll("#chro-ttravel-box")
     .forEach(el=> el.remove())

    async function createTravelBox(){
        const travelBox = document.body.appendChild(createElement("div",{
            attrs:{
                id: "chro-travel-box"
            },
            css:{
                backgroundColor : "#F5F5F5",
                position: "fixed",
                zIndex: "9999",
                left: "35vw",
                top: "20vh",
                border: "solid 3px #696969",
                borderRadius: "20px",
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
                "min-width": "177px"
            },
            children:[
                createElement("div",{
                    attrs:{
                        id: "chro-travel-header-div"
                    },
                    props:{
                        innerText: "Quick Travel Tool"
                    },
                    css:{
                        "float": "left",
                        "font-weight":"bold",
                        "width":"120px",
                        "padding-top": "4px"
                    }
                }),
                createElement("div",{
                    attrs:{
                        id: "chro-travel-header-btn-div"
                    },
                    css:{
                        float: "right"
                    },
                    children:[
                        createElement("button",{
                            attrs:{
                            id: "chro-main-min-btn"
                            },
                            props:{
                                textContent: "-"
                            },
                            action:{
                                click(){
                                    var content = $("#chro-travel-content-div")[0]
                                    if (content.style.display != "none"){
                                        content.style.display = "none"
                                        $("#chro-main-min-btn")[0].innerText = "+";
                                    } else {
                                        content.style.display = "";
                                        $("#chro-main-min-btn")[0].innerText = "-";
                                    }
                                }
                            },
                            css:{
                                marginLeft: "5px",
                                cursor: "pointer",
                            }
                        }),
                        createElement("button",{
                            attrs:{
                                id: "chro-main-close-btn"
                            },
                            props:{
                                textContent: "x"
                            },
                            action:{
                                click(){
                                    document.querySelectorAll("#chro-travel-box")
                                        .forEach(el=> el.remove())
                                }
                            },
                            css:{
                                marginLeft: "5px",
                                cursor: "pointer"
                            }
                        })]
                }),
            contentDiv],
        }))
            dragElement(travelBox)
    }

    const locations = JSON.parse(localStorage.getItem("Chro-travel-location"))
    const locationChoices = createElement("datalist",{
        attrs:{
            id: "location-list",
        },
    })
    for (let item of Object.keys(locations).sort()){
          const option = document.createElement("option");
          option.value = item;
          locationChoices.appendChild(option);
    }

    const contentButtonDiv = createElement("div",{
        attrs:{
            id: "chro-travel-content-button-div"
        },
        css:{
            paddingTop: "5px"
        },
        children:[
            createElement("button",{
                attrs:{
                    id: "chro-travel-travel-button",
                },
                props:{
                    className: "chro-travel-buttons",
                    innerText: "Travel"
                },
                action:{
                    async click(){
                        const destinationName = $("#location-choice")[0].value;
                        const travelList = JSON.parse(localStorage.getItem("Chro-travel-location"));
                        const p = await getConfirmation("travel",destinationName)
                        .then(
                            res => {travel(travelList[destinationName])},
                            err => {}
                            )}
                },
                css:{
                    marginLeft: "5px"
                }
            }),
            createElement("button",{
                attrs:{
                    id: "chro-travel-arm-button"
                },
                props:{
                    className: "chro-travel-buttons",
                    innerText: "+Arm"
                },
                action:{
                    async click(){
                        const destinationName = $("#location-choice")[0].value;
                        const travelList = JSON.parse(localStorage.getItem("Chro-travel-location"));
                        const p = await getConfirmation("arm",destinationName)
                        .then(
                            res => {
                                travel(travelList[destinationName]);
                                arm(destinationName)
                                   },
                            err => {}
                            )}
                },
                css:{
                    marginLeft: "5px"
                }
            }),
            createElement("button",{
                attrs:{
                    id: "chro-travel-update-button"
                },
                props:{
                    className: "chro-travel-buttons",
                    innerText: "Update"
                },
                action:{
                    async click(){
                        const p = await getConfirmation("update")
                        .then(
                            res=> getData(),
                            err=> console.log(err)
                            )
                        }
                },
                css:{
                    marginLeft: "5px"
                }
            })]
    });

    const contentDiv = createElement("div",{
        attrs:{
            id: "chro-travel-content-div"
        },
        css:{
            paddingTop: "5px",
            marginTop: "22px"
        },
        children: [
            createElement("tr",{
                children:[
                    createElement("td",{
                        children:[
                            createElement("label",{
                                props: {
                                    innerText: "Location:"
                                },
                                attrs:{
                                    for: "location-choice"
                                }
                            }),
                            locationChoices
                        ]
                    }),
                    createElement("td",{
                        children:[
                            createElement("input",{
                                attrs:{
                                    list: "location-list",
                                    id: "location-choice",
                                    name: "location-choice",
                                    size: "auto"
                                },
                                css: {
                                    marginLeft: "5px"
                                },
                                action: {
                                    change(e){
                                        const destinationName = $("#location-choice")[0].value;
                                        addDiv(destinationName)
                                    }
                                }
                            })]
                    })
                ]
            }),
        contentButtonDiv]
    })

    getStats()
    createTravelBox();
    $("#chro-travel-travel-button")[0].disabled = true;
    $("#chro-travel-arm-button")[0].disabled = true;
}

function addDiv(location){
    document
     .querySelectorAll("#chro-travel-setup-div")
     .forEach(el=> el.remove())

    const children = createElement("table",{
        attrs:{
            id: "chro-travel-setup-table"
        },
        css:{
            "border-spacing": "1em 2px",
        },
    })
    var data = localStorage.getItem("Chro-travel-setup");
    var parsedData = JSON.parse(data);
    for (var i=0;i<parsedData.length;i++){
        if (location == parsedData[i][0]){
            var setup = [parsedData[i][5],parsedData[i][6],parsedData[i][7],parsedData[i][8]]
            }
    }
    const div = createElement("div")
    const header = document.createElement("div")
    header.id = "last-saved-header"
    header.innerText ="Last Saved Setup"
    header.style.fontWeight = "bold"
    header.style.paddingTop = "5px"
    div.appendChild(header)
    div.appendChild(children);
    var headingLabel = ["Trap:","Base:","Bait:","Charm:"]
    if (setup){
        for (var j = 0;j<4;j++){
        const row = document.createElement("tr")
        const heading = createElement("td",{
            props:{
                innerText: headingLabel[j]
            },
            css:{
                textAlign: "right"
            }
        })
        const setupData = createElement("td",{
            props:{
                innerText: setup[j]
            }
        })
        row.appendChild(heading);
        row.appendChild(setupData);
        children.appendChild(row)
        };
        $("#chro-travel-arm-button")[0].disabled = false;
        $("#chro-travel-travel-button")[0].disabled = false;
        header.style.display = ""
    } else {
        $("#chro-travel-arm-button")[0].disabled = true;
        $("#chro-travel-travel-button")[0].disabled = false;
        header.style.display = "none"
    }
    if (location == user.environment_name){
        $("#chro-travel-arm-button")[0].disabled = true;
        $("#chro-travel-travel-button")[0].disabled = true;
    }

    const travelSetupDiv = $("#chro-travel-content-button-div")[0].insertAdjacentElement("beforebegin",(createElement("div",{
        attrs:{
            id: "chro-travel-setup-div"
        },
        children: [div]
    })))
}

async function travel(location){
    await postReq("https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php",`sn=Hitgrab&hg_is_ajax=1&destination=${location}&uh=${user.unique_hash}`)
    .then(
        res=>{
            //Reload page
            $(".mousehuntHud-menu-item.root")[0].click()
        },
        err =>{console.log(err)}
        )
}

function arm(location){
    var setupList = localStorage.getItem("Chro-travel-setup")
    var currentBait = user.bait_item_id;
    var currentCharm = user.trinket_item_id;
    var currentTrap = user.weapon_item_id;
    var currentBase = user.base_item_id;
    if (setupList){
        var parsedSetup = JSON.parse(setupList);
        for (var i=0;i<parsedSetup.length;i++){
            if (location == parsedSetup[i][0]){
                currentTrap == parsedSetup[i][1]? null: hg.utils.TrapControl.setWeapon(parsedSetup[i][1]).go()
                currentBase == parsedSetup[i][2]? null: hg.utils.TrapControl.setBase(parsedSetup[i][2]).go()
                currentBait == parsedSetup[i][3]? null: parsedSetup[i][3] === null? hg.utils.TrapControl.disarmBait().go():hg.utils.TrapControl.setBait(parsedSetup[i][3]).go()
                currentCharm == parsedSetup[i][4]? null: parsedSetup[i][4] === null? hg.utils.TrapControl.disarmTrinket().go():hg.utils.TrapControl.setTrinket(parsedSetup[i][4]).go()
            }
        }
    }
}

function getConfirmation(action,input,input2){
    return new Promise ((resolve,reject)=>{
        const confirmationBox = document.body.appendChild(createElement("div",{
            attrs:{
                id: "chro-confirm-box",
            },
            css:{
                backgroundColor : "#F5F5F5",
                position: "fixed",
                zIndex: "9999",
                left: "35vw",
                top: "20vh",
                border: "solid 3px #696969",
                borderRadius: "20px",
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
                "min-width": "177px"
            },
            children: [
                createElement("div",{
                    attrs:{
                        id: "chro-travel-name-div"
                    },
                    props:{
                        innerText : "0"
                    }
                }),
                createElement("div",{
                    css:{
                        marginTop: "5px"
                    },
                    children:[
                        createElement("button",{
                            props:{
                                innerText: "Confirm"
                            },
                            action:{
                                click(){
                                    document.body.removeChild($("#chro-confirm-box")[0])
                                    resolve()
                                }
                            }
                        }),
                        createElement("button",{
                            props:{
                                innerText: "Cancel"
                            },
                            action:{
                                click(){
                                    document.body.removeChild($("#chro-confirm-box")[0])
                                    reject()
                                }
                            },
                            css:{
                                marginLeft: "5px"
                            }
                        })]
                })]
        }))
        if (action == "travel"){
            $("#chro-travel-name-div")[0].textContent = "Travel to " + input + "?"
        } else if (action == "arm"){
            var data = localStorage.getItem("Chro-travel-setup");
            var parsedData = JSON.parse(data);
            for (var i=0;i<parsedData.length;i++){
                if (input == parsedData[i][0]){
                    var setup = [parsedData[i][5],parsedData[i][6],parsedData[i][7],parsedData[i][8]]
                    }
            }
            setup[2] == null? setup[2] = "Baitless": null
            setup[3] == null? setup[3] = "Charmless": null
            $("#chro-travel-name-div")[0].innerText = "Travel to " + input + " and arm the following?\n\n" + setup[0] + "\n" + setup[1] + "\n" + setup[2] + "\n" + setup[3]
        } else if (action == "update"){
            $("#chro-travel-name-div")[0].textContent = "Get new locations?"
        }
    })
}

function createElement(tagName, config = {}){
    const el = document.createElement(tagName);
        if (config.attrs) Object.entries(config.attrs).forEach(([attr, val]) => el.setAttribute(attr, val));
        if (config.props) Object.entries(config.props).forEach(([prop, val]) => el[prop] = val);
        if (config.css) Object.entries(config.css).forEach(([prop, val]) => el.style[prop] = val);
        if (config.action) Object.entries(config.action).forEach(([prop, val]) => el.addEventListener(prop, (e)=>{val()}));
        if (config.children) config.children.forEach(child => el.append(child));
        return el;
}

function dragElement(elmnt,dragEl) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.firstElementChild) {
    // if present, the header is where you move the DIV from:
   elmnt.firstElementChild.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    dragEl.onmousedown = dragMouseDown;
  }

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

function postReq(url, form) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          resolve(this);
        }
      };
      xhr.onerror = function () {
        reject(this);
      };
      xhr.send(form);
    });
}