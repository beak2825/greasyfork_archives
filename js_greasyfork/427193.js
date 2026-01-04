// ==UserScript==
// @name         MH - Map Crown Display
// @version      2.0.2
// @description  Adds catch/crown statistics next to mouse names on the map
// @author       Chromatical
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/427193/MH%20-%20Map%20Crown%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/427193/MH%20-%20Map%20Crown%20Display.meta.js
// ==/UserScript==

$(document).ajaxComplete(function(event,xhr,options){
    if (options.url == "https://www.mousehuntgame.com/managers/ajax/board/board.php"){
        $(".treasureMapView-mapMenu-rewardName")[0].innerText.includes("Scavenger")? null : replace()
    };
    localStorage.getItem('Chro-map-tem') !== null? updateTime(): createTime()

    async function updateTime(){
        var date = Date.now()
        var lastTime = localStorage.getItem('Chro-map-tem')
        var d = new Date(lastTime).getTime()
        if (date - d > 43200000){
            const promise = await getCrowns().
            then(res=>{
                 localStorage.setItem('Chro-map-tem',date);
                 localStorage.setItem('Chro-map-tem-mice',JSON.stringify(res));
            })
        }
    }

    async function createTime(){
        var date = Date.now();
        const promise2 = getCrowns() .
        then(res=>{
            localStorage.setItem('Chro-map-tem',date);
            localStorage.setItem('Chro-map-tem-mice',JSON.stringify(res));
        })
    }
})

function getCrowns(){
        return new Promise((resolve, reject) => {
            postReq("https://www.mousehuntgame.com/managers/ajax/mice/getstat.php",`sn=Hitgrab&hg_is_ajax=1&action=get_hunting_stats&uh=${user.unique_hash}`)
                .then(
                res=>{
                    try{
                        var data = JSON.parse(res.responseText);
                        if(data){
                            var miceList={};
                            data.hunting_stats.forEach(mouse=>{
                                var mouseName = mouse.name.replace(/\ mouse$/i, "")
                                miceList[mouseName] = mouse.num_catches
                            })
                        }
                        resolve(miceList)
                    } catch(err) {
                        console.log(err)
                    }
                })
        })
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

document.onclick = function(){
    if ($(".treasureMapRootView")[0]){
        typeof $(".mousebox2")[0] == "object"? null: replace()
    }
}

async function replace(){
    if ($(".mousebox2")[0]){return} else {
    document.querySelectorAll(".treasureMapView-goals-group-goal").forEach(el => {
    var span = el.querySelector("span")
    span.style = "width: auto; height: auto; font-size: 10px;";

    const outer = document.createElement("span");
    outer.className = "mousebox2";
    outer.style.fontColor = "black";
    outer.style.width = "auto";
    outer.style.height = "auto";
    outer.style.margin = "0px";
    outer.style.paddingRight = "8px";
    outer.style.paddingLeft = "3px";
    outer.style.float = "none";

    const crownImg = document.createElement("img");
    crownImg.style.width = "18px";
    crownImg.style.height = "18px";
    crownImg.style.paddingTop = "2px";
    crownImg.style.paddingBottom = "1px";
    crownImg.style.right = "-4px";
    crownImg.style.position = "relative";
    crownImg.style.float = "right";

    var mouseName = el.textContent
    var miceList = JSON.parse(localStorage.getItem('Chro-map-tem-mice'));
    var catches = miceList[mouseName];

    function getCrownSrc(type) {
         return `https://www.mousehuntgame.com/images/ui/crowns/crown_${type}.png`;
    }

            if (!catches || catches < 10) {
                crownImg.src = getCrownSrc("none");
            } else if (catches >= 10 && catches < 100) {
                crownImg.src = getCrownSrc("bronze");
            } else if (catches >= 100 && catches < 500) {
                crownImg.src = getCrownSrc("silver");
            } else if (catches >= 500 && catches < 1000) {
                crownImg.src = getCrownSrc("gold")
            } else if (catches >= 1000 && catches < 2500) {
                crownImg.src = getCrownSrc("platinum");
            } else if (catches >= 2500) {
                crownImg.src = getCrownSrc("diamond");
            }

        const text = document.createElement("div");
        text.innerText = catches || 0
        text.style = "text-align: center"
        text.style.float = "left";
        text.style.color = "black";
        text.style.paddingTop = "5px";

        outer.appendChild(text);
        outer.appendChild(crownImg)
        span.appendChild(outer);

    })}
}

