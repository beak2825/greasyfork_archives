// ==UserScript==
// @name            Kite Script
// @description     Script that Kite Requested
// @author          Jezzarimu / Sibuna (Usernames at Planets.Nu)
// @include         http://planets.nu/*
// @include         http://*.planets.nu/*
// @include         https://planets.nu/*
// @include         https://*.planets.nu/*
// @version         1.01
// @namespace https://greasyfork.org/users/859074
// @downloadURL https://update.greasyfork.org/scripts/520462/Kite%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/520462/Kite%20Script.meta.js
// ==/UserScript==

/*
    Adds Max population to the planet screen
    Adds Chameleon Ship Name to Title
    
    Initial release
    Please send Jezzarimu a message in planets.nu if you find any problems.

    Version History:
    1.00 - Initial Release
*/

function wrapper () {
    var KiteScript = {
        loadplanet: function () {
            let planet = vgap.planetScreen.planet
            if((planet.temp < 16 || planet.temp > 84) && planet.clans !== 0)
                return
            let mult = ((planet.ownerid == 0 && vgap.player.id === 12) || vgap.pl.isOwnedByHorwasp(planet))?1:100
            if(planet.temp !== -1) {
                let maxCols = vgap.pl.maxClans(planet)
                if(planet.ownerid === 0) {
                    maxCols = vgap.pl.maxClans({...planet, ownerid: vgap.player.id})
                }
                if (mult == 100) {
                    maxCols += Math.round((planet.supplies??0) / 5);
                }
                maxCols *= 1
                maxCols = addCommas(maxCols)
                if(document.getElementsByClassName('vval cols')[0]?.children[0]) {
                    document.getElementsByClassName('vval cols')[0].children[0].prepend(`/${maxCols}`)
                    vgap.planetScreen.screen.sections.find(obj=>obj[0].id == 'Colonybar').postload = () => {document.getElementsByClassName('vval cols')[0].children[0].prepend(`/${maxCols}`)}
                } else if(document.getElementsByClassName('vval cols')[0]){
                    document.getElementsByClassName('vval cols')[0].append(`<span>/${maxCols}</span>`)
                    vgap.planetScreen.screen.sections.find(obj=>obj[0].id == 'Colonybar').postload = () => {document.getElementsByClassName('vval cols')[0].append(`<span>/${maxCols}</span>`)}
                } else {
                    vgap.planetScreen.screen.addSection("Colony", function () {
                        colPop = "/" + maxCols
                        let html = "<div id='colonydata'>"
                        html += "<div class='vval cols " + "'>" + "<span>" + colPop + "</span></div>"
                        html += "</div>"
                        return html
                    });
                }
            }
        },
        loadship: function () {
            if(vgap.isChameleonHull(vgap.shipScreen.ship)) {
                vgap.shipScreen.screen.title[0].children[0].style.fontSize = '10px'
                let element = document.createElement('span')
                element.innerHTML = `<span id='ChameleonTitle' style='color:magenta'></span>`
                vgap.shipScreen.screen.title[0].children[0].append(element)
                let postload = function () {
                    let hull = vgap.getHull(vgap.shipScreen.ship.friendlycode)
                    if(hull) {
                        document.getElementById('ChameleonTitle').textContent = " (" + hull.name + ")"
                    } else {
                        document.getElementById('ChameleonTitle').textContent = ''
                    }
                }
                let ShipFriendlybar = vgap.shipScreen.screen.sections.find(obj=>obj[0].id == 'ShipFriendlybar')
                if(ShipFriendlybar.postload instanceof Function) {
                    let functionCopy = ShipFriendlybar.postload
                    ShipFriendlybar.postload = function() {functionCopy(); postload()}
                } else {
                    ShipFriendlybar.postload = postload
                }
                postload()
            }
        }
    }
    vgap.registerPlugin(KiteScript, "KiteScript");
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);