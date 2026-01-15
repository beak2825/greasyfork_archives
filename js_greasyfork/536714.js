// ==UserScript==
// @name         MZ Colorized Skills (Mobile Version)
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Colorize Managerzone players skills valid for mobile versions
// @author       xente
// @contributor  vanjoge (https://greasyfork.org/es/users/220102-vanjoge)
// @match        https://www.managerzone.com/*
// @icon         https://statsxente.com/MZ1/View/Images/main_icon.png
// @grant        GM_xmlhttpRequest
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/536714/MZ%20Colorized%20Skills%20%28Mobile%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536714/MZ%20Colorized%20Skills%20%28Mobile%20Version%29.meta.js
// ==/UserScript==

// Based in the vanjoge original script: https://greasyfork.org/es/scripts/373382-van-mz-playeradvanced
// Thanks vanjoge for the original code!

(function() {
    'use strict';

    var max_skill="<img src='data:image/gif;base64,R0lGODlhDAAKAJEDAP////8AAMyZmf///yH5BAEAAAMALAAAAAAMAAoAAAIk3BQZYp0CAAptxvjMgojTEVwKpl0dCQrQJX3T+jpLNDXGlDUFADs='/>"
    var unmaxed_skill="<img src='data:image/gif;base64,R0lGODlhDAAKAJEDAP///8zM/wAA/////yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs='/>"

    var maxed_skill_hockey


     let maxed_imgs = new Map();

    maxed_imgs.set('maxed_soccer', "<img src='data:image/gif;base64,R0lGODlhDAAKAJEDAP////8AAMyZmf///yH5BAEAAAMALAAAAAAMAAoAAAIk3BQZYp0CAAptxvjMgojTEVwKpl0dCQrQJX3T+jpLNDXGlDUFADs='/>");
    maxed_imgs.set('unmaxed_soccer', "<img src='data:image/gif;base64,R0lGODlhDAAKAJEDAP///8zM/wAA/////yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs='/>");

    maxed_imgs.set('maxed_hockey', "<img src='data:image/gif;base64,R0lGODlhDAAKANUkAOXq//8pKunt//ZTVPz19dXZ+tzk/+NAV+bl+Ojs//4wMeWkreXp/f4tLvRMT+Dm/+Xr/7lra/4vMepKSv7///ZRUvz8/tmHhs/Z/+xKSfVeYNCJkfhFRPUxOuBUZvRsb9ri//39//hDQv8oKf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACQALAAAAAAMAAoAAAZCQBLpMhqJMgiLkEQoOkeDwnLzdIowwuoTlNUWDRSSF/oIkUQBZ6BRAWiEkIlopPgsEhzPMgIQCBgOEiNLQh1PB4RBADs='/>");
    maxed_imgs.set('unmaxed_hockey', "<img src='data:image/gif;base64,R0lGODlhDAAKALMNAOnt/+Xr/9ri/6/A/6G1/73L/52x/8/Z/4Wf/32Z/1x9/0Rr/x9N/////wAAAAAAACH5BAEAAA0ALAAAAAAMAAoAAAQwsDXD2FJB6sot0UnHLYckdoJ5VmmzWoi0nAuxSIEyW0qxJBrFAAAYKCoaSYgD1EQAADs='/>");

    let colors = new Map();
    colors.set('skc_4', '#ff00ff');
    colors.set('skc_3', '#0000ff');
    colors.set('skc_2', '#b8860b');
    colors.set('skc_1', '#ff0000');

        function waitToDOM(function_to_execute, classToSearch, elementIndex,miliseconds) {
        let interval = setInterval(function () {
            let elements = document.querySelectorAll(classToSearch);
            if (elements.length > 0 && elements[elementIndex]) {
                clearInterval(interval);
                clearTimeout(timeout);
                function_to_execute();
            }
        }, 100);


        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, miliseconds);
    }



    (function() {
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            if (url.includes('ajax.php?p=transfer&sub=transfer-search')) {
                waitToDOM(colorizeSkills, ".playerContainer", 0,7000)
            }
        });
        return open.apply(this, arguments);
    };
})();




    let params = new URLSearchParams(window.location.search);
var type="players"
if (params.get('p') === 'transfer') {
 type="market";
}

    setSport()
    setDeviceFormat()


document.addEventListener('click', function(event) {
    const link = event.target.closest('.player_link'); // Busca el ancestro más cercano con esa clase
    if (link) {
         waitToDOM(colorizeSkills, ".playerContainer", 0,7000)
    }
});


    waitToDOM(colorizeSkills, ".playerContainer", 0,7000)


   


    async function colorizeSkills() {
        var playerDivs = document.querySelectorAll('div.playerContainer');
        playerDivs.forEach((div, divIndex) => {
var tableIndex=0;
            if( window.stx_device=="mobile"){
                tableIndex=1;
            }

var spanClass="clippable"

            var skillsTable = playerDivs[divIndex].querySelectorAll('table.player_skills.player_skills_responsive');
             if(type==="market"){
             skillsTable = playerDivs[divIndex].querySelectorAll('table.player_skills.player_skills_transfer');
                 tableIndex=0;
spanClass="skill_name"
             }

            var span_id = playerDivs[divIndex].querySelectorAll("span.player_id_span")
            var player_id = span_id[0].innerHTML
            var h2 = playerDivs[divIndex].querySelectorAll("h2.subheader.clearfix")
            var stx_class=h2[0].querySelectorAll("span.stx_scout");

           if((stx_class.length===0)&&(skillsTable.length>0)){
            var filas = skillsTable[tableIndex].querySelectorAll('tr');
            var contSkill = 0
            let maxIndex=11;
            if(window.sport==="hockey"){
                contSkill=-1;
                 maxIndex=10;
            }


            filas.forEach((fila, i) => {
                if ((contSkill>-1)&&(contSkill < maxIndex)) {
                    var divContainer = fila.querySelector('div#container');
                    var hiddenDiv = divContainer.querySelectorAll('img.skill');
                    hiddenDiv[0].style.display = 'none';


                    var skillval = fila.querySelectorAll('td.skillval');
                    var skillValue = skillval[0].querySelectorAll("span")
                    const valor = parseInt(skillValue[0].innerHTML, 10); // convertir a entero
                    var dataToInsert = '<div class="skill" style="font-size:0;padding: 0 0 0 4px;">'
                    for (let i = 0; i < valor; i++) {
                        if (skillValue[0].classList.contains('maxed')) {
                            dataToInsert += maxed_imgs.get('maxed_'+window.sport)
                        } else {
                            dataToInsert += maxed_imgs.get('unmaxed_'+window.sport)
                        }

                    }
                    dataToInsert += +'</div>'

                    divContainer.innerHTML += dataToInsert


                    var primeraCelda = fila.querySelectorAll('td');

                    var skillName = primeraCelda[0].querySelectorAll("span."+spanClass)
var idValue=skillName[0].innerHTML
if(type==="market"){
                    var aux=skillName[0].querySelectorAll("span")
                    idValue=aux[0].textContent
}
                    skillName[0].id = idValue + "_" + player_id

                    
                }
                contSkill++
            });

            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.managerzone.com/ajax.php?p=players&sub=scout_report&pid=' + player_id + '&sport=' + window.sport,
                onload: function (responseDetailsScout) {
                    let valores = [];
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(responseDetailsScout.responseText, 'text/html');
                    const aTags = doc.querySelectorAll('span.stars');
                    var index = 0
                    var hp_stars = 0
                    var lp_stars = 0
                    var ts_stars =0
                    aTags.forEach(tag => {
                        const is = tag.querySelectorAll('i');
                        is.forEach(i => {
                            if (index <= 3) {
                                if (i.className == "fa fa-star fa-2x lit") {
                                    hp_stars++;
                                }
                            }


                            if (index > 3 && index <= 7) {
                                if (i.className == "fa fa-star fa-2x lit") {
                                    lp_stars++;
                                }
                            }

                               if (index > 7) {
                                        if (i.className == "fa fa-star fa-2x lit") {
                                            ts_stars++
                                        }
                                    }

                            index++;
                        });

                    });



                    var hp_value,hp_value1,lp_value,lp_value1

                    const uls = doc.querySelectorAll('ul');
                    index = 0;
                    uls.forEach(ul => {
                            var lis = ul.querySelectorAll('li');
                            if (lis.length > 2) {
                                var stars_value = 0
                                var spanIndex = 0;
                                var spans1 = lis[1].querySelectorAll('span')
                                var spans2 = lis[2].querySelectorAll('span')
                                if (spans1.length > 1) {
                                    spanIndex = 1
                                }
                                if (index == 0) {
                                    stars_value = hp_stars
                                    hp_value=spans1[spanIndex].textContent
                                    hp_value1=spans2[spanIndex].textContent
                                     if(skillsTable.length>0){
                                    document.getElementById(spans1[spanIndex].textContent + "_" + player_id).style.fontWeight = "bold"
                                    document.getElementById(spans2[spanIndex].textContent + "_" + player_id).style.fontWeight = "bold"
                                     }
                                } else {
                                    stars_value = lp_stars
                                }
                                lp_value=spans1[spanIndex].textContent
                                lp_value1=spans2[spanIndex].textContent
                                 if(skillsTable.length>0){
                                document.getElementById(spans1[spanIndex].textContent + "_" + player_id).style.color = colors.get("skc_" + stars_value)
                                document.getElementById(spans2[spanIndex].textContent + "_" + player_id).style.color = colors.get("skc_" + stars_value)
                                 }
                                index++
                            }

                        }
                    );

                                var as = h2[0].querySelectorAll("a.subheader")

if((stx_class.length===0)&&(hp_value1!==undefined)){
             if( window.stx_device=="mobile"){
                 h2[0].innerHTML+='<span class="stx_scout" style="font-size: smaller; white-space: nowrap;"> [H'+hp_stars+' '+hp_value+','+hp_value1+'] [L'+lp_stars+' '+lp_value+','+lp_value1+'] S'+ts_stars+'</span>'
             }else{
                 let newSpan = document.createElement('span');
                 newSpan.className="stx_scout"
                 newSpan.style.whiteSpace = "nowrap";
                 newSpan.innerHTML = ' [H'+hp_stars+' '+hp_value+','+hp_value1+'] [L'+lp_stars+' '+lp_value+','+lp_value1+'] S'+ts_stars
                 as[0].insertAdjacentElement('afterend',newSpan);
             }
}else{
    let newSpan = document.createElement('span');
    newSpan.className="stx_scout"
    newSpan.style.display = "none";
    as[0].insertAdjacentElement('afterend',newSpan);
}



                }
            });

        });

    }



    function setSport(){

        let sportCookie=getSportByMessenger()
        if(sportCookie===""){
            sportCookie = getCookie("MZSPORT");
        }
        if(sportCookie===""){
            sportCookie=getSportByLink()
        }
        if(sportCookie===""){
            sportCookie=getSportByScript()
        }

         window.sport = sportCookie;


    }

    function setDeviceFormat(){
        if(!document.getElementById("deviceFormatStx")){
            var script = document.createElement('script');
            script.textContent = `
        var newElemenDeviceSTX = document.createElement("input");
        newElemenDeviceSTX.id= "deviceFormatStx";
        newElemenDeviceSTX.type = "hidden";
        newElemenDeviceSTX.value=window.device;
        document.body.appendChild(newElemenDeviceSTX);

`;
            document.documentElement.appendChild(script);
            script.remove();
            window.stx_device=document.getElementById("deviceFormatStx").value
        }
    }

    function getSportByMessenger() {
        if (document.getElementById("messenger")) {

            if ((document.getElementById("messenger").className === "soccer") || (document.getElementById("messenger").className === "hockey")) {
                return document.getElementById("messenger").className
            }
        }
        return ""
    }

    function getSportByLink(){
        let element = document.getElementById("settings-wrapper");
        if (element) {
            let firstLink = element.getElementsByTagName("a")[0];
            if (firstLink) {
                if(firstLink.href.includes("soccer")){
                    return "hockey"
                }else{
                    return "soccer"
                }
            }
        }
    }

    function getSportByScript(){
        const script = document.createElement('script');
        script.textContent = `
    let newElement = document.createElement("input");
        newElement.id= "stx_sport";
        newElement.type = "hidden";
        newElement.value=window.ajaxSport;
        let body = document.body;
        body.appendChild(newElement);

`;
        document.documentElement.appendChild(script);
        script.remove();
        return document.getElementById("stx_sport").value
    }

    function getCookie(nombre) {
        let regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        let valorCookie = document.cookie.replace(regex, "$1");
        return decodeURIComponent(valorCookie);
    }




})();
