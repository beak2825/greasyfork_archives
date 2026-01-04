// ==UserScript==
// @name         Auto win
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  Deuxsept
// @author       Deux Sept
// @match        https://game.heroestd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroestd.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446079/Auto%20win.user.js
// @updateURL https://update.greasyfork.org/scripts/446079/Auto%20win.meta.js
// ==/UserScript==
let mb_vente=true;
pan=document.createElement("div");
pan.setAttribute("title", "DEUX SEPT ZERO");
pan.setAttribute("id", "panneau");
act=document.createElement("div");
act.setAttribute("id", "act");
act.innerHTML="&#10542;";
ven_text=document.createElement("div");
ven_text.setAttribute("id", "vente_texte");
ven_text.innerText="Win :";

ven_false=document.createElement("div");
ven_false.setAttribute("id", "vente_false");
ven_false.innerHTML="&#10007;";

ven_true=document.createElement("div");
ven_true.setAttribute("id", "vente_true");
ven_true.setAttribute("class", "actif");
ven_true.innerHTML="&#10003;";

robot=document.createElement("div");
robot.setAttribute("id", "robot");
robot.innerHTML="&#129302;";

notouch=document.createElement("div");
notouch.setAttribute("id", "notouch");

aide=document.createElement("div");
aide.setAttribute("id", "aide");
aide.innerHTML="&#129302;";

aide2=document.createElement("div");
aide2.setAttribute("id", "aide2");
aide2.innerHTML="&#129302;";

refresh=document.createElement("div");
refresh.setAttribute("id", "refresh");
refresh.innerText="CANCEL";

sta=document.createElement("div");
sta.setAttribute("id", "start");
sta.innerText="QUEST";

wav=document.createElement("div");
wav.setAttribute("id", "Wave");
wav.innerText="Match : ";

use=document.createElement("div");
use.setAttribute("id", "UserA");
use.innerText="Winrate : ";

ses=document.createElement("div");
ses.setAttribute("id", "Sess");
ses.innerText="WR % : ";

input_match=document.createElement("input");
input_match.setAttribute("id", "input_match");
input_match.setAttribute("type", "number");
input_match.value=65;

document.body.appendChild(pan);
/*
pan.appendChild(ven_true);
pan.appendChild(use);
pan.appendChild(ses);
pan.appendChild(input_match);
pan.appendChild(wav);
pan.appendChild(ven_false);
pan.appendChild(ven_text);*/
pan.appendChild(robot);
pan.appendChild(act);
pan.appendChild(refresh);
pan.appendChild(sta);

select_type=document.createElement("select");
select_type.setAttribute("id", "select_type");

opt0=document.createElement("option");
opt0.setAttribute("id", "opt0");
opt0.value=10;
opt0.innerText="AUTO WIN";

opt1=document.createElement("option");
opt1.setAttribute("id", "opt1");
opt1.value=0;
opt1.innerText="k2a";

opt2=document.createElement("option");
opt2.setAttribute("id", "opt2");
opt2.value=1;
opt2.innerText="  ";

opt3=document.createElement("option");
opt3.setAttribute("id", "opt3");
opt3.value=2;
opt3.innerText="Sega 2";

opt4=document.createElement("option");
opt4.setAttribute("id", "opt4");
opt4.value=3;
opt4.innerText="Sega 3";

opt5=document.createElement("option");
opt5.setAttribute("id", "opt5");
opt5.value=4;
opt5.innerText="Sega 4";

select_type.appendChild(opt0);
select_type.appendChild(opt1);
select_type.appendChild(opt2);
select_type.appendChild(opt3);
select_type.appendChild(opt4);
select_type.appendChild(opt5);

var style=document.createElement("style");
style.type="text/css";

style.innerHTML=`#select_lvl {
    color: black;
    position: absolute;
    bottom: 192px;
    height: 20px;
    left: 100px;
    border-radius: 5px;
    font-size: 12px;
}

#select_type {
    color: black;
    position: absolute;
    top: 12px;
    height: 20px;
    width: 150px;
    left: 70px;
    border-radius: 5px;
    font-size: 12px;
}

.actif {
    color: #67C23A;
}

.actif2 {
    color: #67C23A;
}

#next_true {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    bottom: 104px;
    left: 190px;
    cursor: pointer;
}

#robot {
    font-size: 30px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    top: 10px;
    left: 21px;
    cursor: pointer;
    background-color: #092C6E;
    padding: 7px 12px;
    text-align: center;
    padding-left: 5px;
    border-radius: 50px;
}

#aide {
    font-size: 10px;
    height: 10px;
    display: none;
    line-height: 10px;
    width: 10px;
    position: absolute;
    bottom: 14%;
    left: 35%;
    cursor: pointer;
    background-color: #092C6E;
    padding: 5px 7px;
    text-align: center;
    padding-left: 4px;
    border-radius: 50px;
}

#aide2 {
    font-size: 10px;
    height: 10px;
    display: none;
    line-height: 10px;
    width: 10px;
    position: absolute;
    bottom: 14%;
    left: 22%;
    cursor: pointer;
    background-color: #092C6E;
    padding: 5px 7px;
    text-align: center;
    padding-left: 4px;
    border-radius: 50px;
}

#notouch {
    font-size: 10px;
    height: 200px;
    display: none;
    line-height: 10px;
    width: 200px;
    position: absolute;
    bottom: 7%;
    left: 20%;
    cursor: pointer;
    background-color: #092C6E;
    padding: 5px 7px;
    text-align: center;
    padding-left: 4px;
    border-radius: 50px;
}

#vente_true {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    top: 15px;
    left: 80px;
    cursor: pointer;
}

#next_false {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    bottom: 104px;
    left: 160px;
    cursor: pointer;
}

#next_text {
    height: 10px;
    line-height: 10px;
    position: absolute;
    bottom: 105px;
    left: 20px;
}

#vente_false {
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    top: 15px;
    left: 55px;
    cursor: pointer;
}

#lvl_text {
    height: 10px;
    line-height: 10px;
    position: absolute;
    bottom: 195px;
    left: 20px;
}

#vente_texte {
    height: 10px;
    line-height: 10px;
    position: absolute;
    top: 20px;
    left: 20px;
}

#youtube {
    position: absolute;
    bottom: 16px;
    left: 24px;
}

#k2a {
    position: absolute;
    left: 310px;
    bottom: 149px;
    background-size: cover;
    height: 75px;
    border: 1px solid white;
    width: 75px;
    border-radius: 50%;
    background-image: url('https://static1.purebreak.com/articles/3/16/31/23/@/641710-kaaris-condamne-apres-sa-bagarre-avec-bo-diapo-2.jpg');
}

#save {
    position: absolute;
    left: 20px;
    bottom: 104px;
}

#Recolte {
    position: absolute;
    left: 20px;
    bottom: 24px;
    height: 10px;
    line-height: 10px;
}

#Info {
    position: absolute;
    left: 20px;
    height: 10px;
    line-height: 10px;
    top: 15px;
}

#Match {
    position: absolute;
    left: 20px;
    height: 10px;
    line-height: 10px;
    top: 50px;
}

#Oppo {
    position: absolute;
    left: 20px;
    height: 10px;
    line-height: 10px;
    top: 85px;
}

#Sess {
    position: absolute;
    left: 20px;
    height: 10px;
    line-height: 10px;
    top: 50px;
}

#Wave {
    position: absolute;
    left: 20px;
    height: 10px;
    line-height: 10px;
    top: 80px;
}

#UserA {
    position: absolute;
    left: 20px;
    height: 10px;
    line-height: 10px;
    top: 110px;
}

#input_match {
    color: black;
    position: absolute;
    top: 42px;
    height: 20px;
    width: 50px;
    left: 69px;
    border-radius: 5px;
    font-size: 12px;
}

#refresh2 {
    font-size: 24px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    bottom: 13px;
    left: 24px;
    cursor: pointer;
}

#act {
    font-size: 24px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    position: absolute;
    top: -17px;
    left: -17px;
    cursor: pointer;
    border: 1px solid white;
    padding: 5px;
    border-radius: 12px;
    background-color: #092C6E;
}

#input_sess {
    color: black;
    position: absolute;
    top: 110px;
    height: 20px;
    width: 143px;
    left: 69px;
    border-radius: 5px;
    font-size: 12px;
}

#input_wave {
    color: black;
    position: absolute;
    top: 150px;
    height: 20px;
    width: 143px;
    left: 69px;
    border-radius: 5px;
    font-size: 12px;
}

#input_use {
    color: black;
    position: absolute;
    top: 190px;
    height: 20px;
    width: 143px;
    left: 69px;
    border-radius: 5px;
    font-size: 12px;
}

#input_oppo {
    color: black;
    position: absolute;
    top: 76px;
    height: 20px;
    width: 143px;
    left: 69px;
    border-radius: 5px;
    font-size: 12px;
}

#refresh {
    position: absolute;
    background-color: rebeccapurple;
    right: 10px;
    bottom: 50px;
    cursor: pointer;
    border: 1px solid white;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
    width: 70px;
    text-align: center;
}

#start {
    position: absolute;
    background-color: rebeccapurple;
    right: 10px;
    bottom: 7px;
    cursor: pointer;
    border: 1px solid white;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
    width: 70px;
    text-align: center;
}

#man {
    position: absolute;
    left: 235px;
    bottom: 15px;
    cursor: pointer;
    border: 1px solid white;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
    width: 70px;
    text-align: center;
}

`;

style.innerHTML=style.innerHTML+"#titre{position: absolute;    font-size: 12px;    line-height: 25px;    bottom: 222px;    border: 1px solid white;    width: 130px;    text-align: center;    height: 23px;    background-color: #092C6E;    background-size: cover;    color: white;    left: 129px;    border-radius: 5px;    z-index: 100000;}#panneau{position: absolute;    font-size: 12px;       line-height: 75px;    top: 130px;    border: 1px solid white;    width: 93px;    text-align: center;    height: 140px;    background-color:#092C6E ;    background-size: cover;    color: white;    right: 100px;    border-radius: 5px;    z-index: 1000000;}";

document.getElementsByTagName("head")[0].appendChild(style);

document.getElementById("start").addEventListener("click", function () {
        var myUrl="https://api-zone2.heroestd.com/claimQuest?";

        var myData= {
            questID: 1
        }

        ;

        fetch(myUrl, {

                method: "POST",
                headers: {

                    version: -1,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer $ {
                        firebaseAuth.currentUser.accessToken
                    }

                    `,
                }

                ,
                body: JSON.stringify(myData),
            }

        ).then((response)=> {}

        );
        sta.style.visibility="hidden";
    }

);

function cancelMatch() {
    fetch("https://api-zone2.heroestd.com/onMatchCancel?", {
            method:"POST", headers: {

                version: -1,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer $ {
                    firebaseAuth.currentUser.accessToken
                }

                `,
            }
        }

    )
}

document.getElementById("refresh").addEventListener("click", function () {
        cancelMatch()
    }

);

act.addEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);

function mouseUp() {
    window.removeEventListener("mousemove", move, true);
}

function mouseDown(e) {
    window.addEventListener("mousemove", move, true);
}

function move(e) {
    pan.style.top=e.clientY+"px";
    pan.style.left=e.clientX+"px";
}

act.style.visibility="visible";
pan.style.visibility="visible";

act.addEventListener("dblclick", function (e) {
        if (pan.style.visibility=="hidden") {
            pan.style.visibility="visible";
        }

        else {
            pan.style.visibility="hidden";
        }
    }

);

let botOn=false;




function updateValue(e) {
    input_match.textContent=e.target.value;
    localStorage.winRateUser=e.target.value;
}

function AutoWin() {
    fetch("https://api-zone2.heroestd.com/onEndPvP?", {

            method: "POST",
            headers: {

                version: -1,
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: ` Bearer $ {
                    firebaseAuth.currentUser.accessToken
                }

                `,
            }

            ,
            body: JSON.stringify( {
                    matchID: window.matchID,
                    opponentID: window.opponentID,
                    sessionId: window.sessionId,
                    win: 1,
                    totalWave: 2,
                    userActionCount: 5,
                    cheatCode: 0,
                }

            ),
        }

    ).then((response)=> {
            let nbMatch=parseInt(localStorage.nbMatch) + 1;
            let winMatch=parseInt(localStorage.winMatch) + 1;
            localStorage.winMatch=winMatch;
            localStorage.nbMatch=nbMatch;
            document.location.reload();
        }

    );
}

aide.addEventListener("click", function (e) {
        aide.style.display="none";
    }

);

aide2.addEventListener("click", function (e) {
        aide2.style.display="none";
    }

);

robot.addEventListener("click", function (e) {
        if ( !botOn) {
            botOn=true;
            localStorage.botOn=true;
            robot.style.backgroundColor="red";
            aide.style.display="block";
            aide2.style.display="block";
        }

        else {
            botOn=false;
            localStorage.botOn=false;
            robot.style.backgroundColor="#092C6E";
            aide.style.display="none";
            aide2.style.display="none";
        }
    }

);



function winRate() {
    let nbMatch=parseInt(localStorage.nbMatch);
    let winMatch=parseInt(localStorage.winMatch);

    if (nbMatch==0) {
        return botOn;
    }

    else {
        return (botOn && Math.round((winMatch / nbMatch) * 100) < input_match.value);
    }
}

function created() {
    const timeElapsed=Date.now();
    const today=new Date(timeElapsed);

    if ( !localStorage.botOn) {
        localStorage.setItem("botOn", false);
    }

    else {
        botOn=localStorage.botOn==="true";

        if (botOn==true) {
            robot.style.backgroundColor="red";
            aide.style.display="block";
            aide2.style.display="block";
        }
    }

    if ( !localStorage.UserCo) {
        document.body.appendChild(select_type);
    }

    if ( !localStorage.nbMatch) {
        localStorage.setItem("nbMatch", 0);
    }

    if ( !localStorage.winMatch) {
        localStorage.setItem("winMatch", 0);
    }

    if ( !localStorage.winRateUser) {
        localStorage.setItem("winRateUser", input_match.value);
    }

    else {
        input_match.value=parseInt(localStorage.winRateUser);
    }

    if ( !localStorage.today) {
        localStorage.setItem("today", today.toLocaleDateString());
    }

    if (localStorage.today !=today.toLocaleDateString()) {
        localStorage.today=today.toLocaleDateString();
        localStorage.winMatch=0;
        localStorage.nbMatch=0;
    }
}

function setData() {

    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        document.getElementById("panneau").style.transform="scale(2)";
        document.getElementById("act").style.lineHeight="17px";

        act.addEventListener("click", function (e) {
                if (pan.style.visibility=="hidden") {
                    pan.style.visibility="visible";
                }

                else {
                    pan.style.visibility="hidden";
                }
            }

        );
    }
}

setTimeout(()=> {
        document.getElementById("unity-container").appendChild(aide);
        document.getElementById("unity-container").appendChild(aide2);
        document.getElementById("unity-container").appendChild(notouch);
        created();
        setData();

        var open_prototype=XMLHttpRequest.prototype.open,
        intercept_response=function(urlpattern, callback) {
            XMLHttpRequest.prototype.open=function() {
                arguments['1'].match(urlpattern) && this.addEventListener('readystatechange', function(event) {
                        if (this.readyState===4) {
                            var response=callback(event.target.response);

                            Object.defineProperty(this, 'response', {
                                    writable: true
                                }

                            );
                            this.response=response;
                        }
                    }

                );
                return open_prototype.apply(this, arguments);
            }

            ;
        }

        ;

        intercept_response('api-zone2.heroestd.com/get-hero-inventory/page=1&limit=100', (response)=> {
            let new_response=String.fromCharCode.apply(null, new Uint8Array(response))
            /*new_response=new_response
                .replaceAll("7,7,7", "30,30,30")//full mana item
                .replaceAll("9,9,20", "9,9,9")//full lion  heart
                .replaceAll("23,2,2", "42,42,42")
                .replaceAll("9,9,5", "9,9,9")
                .replaceAll("1,21,44", "42,42,42")
                .replaceAll("9,1,9", "9,9,9")
                .replaceAll("1,9,9", "9,9,9")
                .replaceAll("2,2,2", "2,13,13")
                .replaceAll("13,16,2", "2,13,13")
                .replaceAll('targetType":2', 'targetType":1')
                .replaceAll('heroId":14', 'heroId":7')
                .replaceAll('heroId":13', 'heroId":16')
                .replaceAll('heroClass":1', 'heroClass":7')*/
            new_response=new_response
            //Karla
                .replace('"heroClass":1,"heroId":3,"heroOrigin":1,"items":[1,9,9],"parent1":"0","parent2":"0","runes":[2,2,2]',
                         '"heroClass":7,"heroId":10,"heroOrigin":1,"items":[17,17,17],"parent1":"0","parent2":"0","runes":[18,13,13]')
            //anub
                .replace('"heroClass":1,"heroId":8,"heroOrigin":1,"items":[1,21,44],"parent1":"0","parent2":"0","runes":[1,9,9]',
                         '"heroClass":7,"heroId":19,"heroOrigin":9,"items":[42,42,42],"parent1":"0","parent2":"0","runes":[20,8,19]')
            //wukong
            .replace('"heroClass":9,"heroId":7,"heroOrigin":9,"items":[1,41,41],"parent1":"0","parent2":"0","runes":[7,19,13]',
                     '"heroClass":7,"heroId":7,"heroOrigin":9,"items":[42,42,42],"parent1":"0","parent2":"0","runes":[9,9,9]')
            //zand
            .replace('"heroClass":1,"heroId":9,"heroOrigin":1,"items":[9,1,9],"parent1":"0","parent2":"0","runes":[13,16,2],"status":1,"tag":10,"targetType":2',
                     '"heroClass":7,"heroId":9,"heroOrigin":1,"items":[9,9,17],"parent1":"0","parent2":"0","runes":[13,13,2],"status":1,"tag":10,"targetType":1')
            //lonah +> harlay
            .replace('"heroClass":1,"heroId":14,"heroOrigin":1,"items":[23,2,2],"parent1":"0","parent2":"0","runes":[9,9,5]',
             '"heroClass":7,"heroId":16,"heroOrigin":9,"items":[30,30,30],"parent1":"0","parent2":"0","runes":[9,9,9]')
            const byteArray=new TextEncoder().encode(new_response);
                const buffer=byteArray.buffer;

                return buffer;
            }

        )
    }

    , 2000);

document.onkeydown=function (e) {
    if (e.key=="Backspace") {
        e.target.value="";
    }

    else {
        e.target.value=e.target.value+e.key;
    }

    return false;
}

;

function checkOppo(myPayload) {
    if (myPayload.includes("opponentID=Meyb8tVGi3Pl3BysN9QGe2YLwpP2") || // GNT | LordK
        myPayload.includes("opponentID=QJOX4B0Tr1NIruqtknPt0F9neF021") || // P.O.W | X-J
        myPayload.includes("opponentID=6506iHCB7cbsgzhoksbYKgRS70J3") || // TDEl Laurent
        myPayload.includes("opponentID=Q5RB1nUafHg4mAS4lDYKBG4ugrD3") || // BR|Fernando
        myPayload.includes("opponentID=wxhZ7wm4LzRQWYNNkYxneXbtbU73") || // BR | SEVEN R
        myPayload.includes("opponentID=DubIMLyoU0RK45VgtmbRivp7nrW2") || // TDE| PUNKKER
        myPayload.includes("opponentID=EyYMiyfDVyVkzV3oBpiVskbYDbe2") || // BR BOMBA 10
        myPayload.includes("opponentID=41JV7JZySWMTVPWIXNDQi9YrGZ53") || // TDE | SENA
        myPayload.includes("opponentID=x1CMhDTo49NqbVUwQjCN9yCfrXk1") || // TDE | AHAHAHA
        myPayload.includes("opponentID=JXxjW46UPgPzSUPeWnMHZtQrnm72") || // TDE | AHAHAHA
        //myPayload.includes("opponentID=TbNFPRbBgVNA0YWCsoMt51t7atf1") || // KILLERS
        myPayload.includes("opponentID=0jvJ8FAGCOdO80IFG3xLrVGCpUp1") || // TDE | SEGA
        myPayload.includes("opponentID=6ubKrjYJmFfyncOnkS2LacMC8Fg1") || // Andromeda
        myPayload.includes("opponentID=GWs8rlPeWiYTJUBKvGdy4PZc0Ti1") || // Poseidon
        myPayload.includes("opponentID") || // SUIII
        //myPayload.includes("5gAFEK455iYHJjHkobyKYDV6ew43") || // TDE | VINCENT
        myPayload.includes("opponentID=XN9IP6DTjgZ3MfyMtS9JmLBR30g1") // P.O.W | Khoi

    ) {
        return true;
    }

    else {
        return false;
    }
}
