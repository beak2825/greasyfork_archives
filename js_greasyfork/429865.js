// ==UserScript==
// @name         </> Kurt Mod - Can Doldurma Tasarımı (Oyuncu + Pet)
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  !otomatikdoldur
// @icon         https://cdn.discordapp.com/emojis/823513307712454727.png?v=1
// @author       Kurt
// @match        *://zombs.io/*
// @match        http://tc-mod-js.glitch.me/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/429865/%3C%3E%20Kurt%20Mod%20-%20Can%20Doldurma%20Tasar%C4%B1m%C4%B1%20%28Oyuncu%20%2B%20Pet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429865/%3C%3E%20Kurt%20Mod%20-%20Can%20Doldurma%20Tasar%C4%B1m%C4%B1%20%28Oyuncu%20%2B%20Pet%29.meta.js
// ==/UserScript==

var newcss = `
#newp{
color: white;
position: absolute;
font-weight: bold;
top: -20%;
left: 45%;




}
.background-bar{
width: 0%;
height: 100%;
transition: all 0.8s;
position: relative;
background-color: green;
border-radius: 6px;
z-index: -1;
bottom: 100%;
max-width: 100%;
min-width: 0%;

}
#healthanime{
animation: healthanime 0.5s ease-in-out infinite;






}
@keyframes healthanime{
 0%{
            opacity: 0.0;



         };
         5%{

           opacity: 0.1;

         };
         10%{

             opacity:  0.2;
         };
         15%{
            opacity: 0.3;

         };

         20%{
             opacity: 0.4;
         };
         25%{
             opacity: 0.5;
         };
         30%{
             opacity: 0.6;
         };
         35%{
             opacity: 0.7;
         };
         40%{
             opacity: 0.8;
         };
         45%{
             opacity: 0.9;
         };
         50%{
             opacity: 1.0;
         };
         55%{
             opacity: 0.9;
         };
         60%{
             opacity: 0.8;
         };
         65%{
             opacity: 0.7;
         };
         70%{
             opacity: 0.6;
         };
        75%{
             opacity: 0.5;
         };
         80%{
             opacity: 0.4;
         };
         85%{
             opacity: 0.3;
         };
         90%{
             opacity: 0.2;
         };
         95%{
             opacity: 0.1;
         };
         100%{
             opacity: 0.0;
         };





}
#healthanime2{
animation: healthanime 0.5s ease-in-out infinite;




}

#playerhb{
width: 70px;
height: 12px;
background-color: #2C3E50;
position: relative;
border-radius: 4px;
top: 57%;
left: 47.2%;
font-family:'Hammersmith One', sans-serif;
max-width: 70px;
min-width: 0px;
min-height: 0px;
max-height: 12px;


}
#phbinner{
width: 0%;
height:100%;
position:absolute;
font-family:'Hammersmith One', sans-serif;
border-radius: 4px;
background-color: #2ECC71;
transition: all 0.2s;
z-index: 2;
max-width: 100%;
min-width:0%;





}
#newp2{
color: white;
font-weight: bold;
font-size: 9px;
position: absolute;
left: 53%;
top: -60%;
transform: translate(-50%,-50%);
z-index: 3;


}
#phbiback{
background-color: #82E0AA;
width:0%;
height:100%;
position: absolute;
transition: all 0.6s;
z-index: 1;
border-radius: 20px;
max-width: 100%;
min-width: 0%;




}
.phbinneranime{
animation: healthanime 0.5s ease-in-out infinite;



}
.phbibackanime{
animation: healthanime 0.5s ease-in-out infinite;


}


#pethp{
background-color: rgba(0, 0, 0, 0.4);
height: 35px;
top: 255px;
border: 4px solid rgba(0, 0, 0, 0.1);
font-family: 'Hammersmith One' , sans-serif;
border-radius: 4px;
position: relative;
display: none;
padding: 5;
z-index: 10;
margin: none;

}
#petp {
font-family: 'Hammersmith One' , sans-serif;
position: absolute;
transform: translate(-50%, -50%);
top: -35%;
left: 58%;
bottom: 0%;
color: white;
font-weight: bold;
z-index: 2;

}
#pethpin {
background-color: #F39C12;
position: relative;
height: 100%;
font-family: 'Hammersmith One' , sans-serif;
border-radius: 4px;
transition: all 0.4s;


}
#pethp:after{
    display: block;
    content: 'PET HEALTH';
    position: absolute;
    top: 1px;
    left: 5px;
    bottom: 0px;
    line-height: 27px;
    font-size: 14px;
    color: #eee;
    text-shadow: 0 0 1px rgb(0 0 0 / 80%);
}


}
`;
(function () {
    var healthbar = document.getElementsByClassName('hud-health-bar-inner')[0],
        hud = document.getElementsByClassName('hud')[0],
        healthvarout = document.getElementsByClassName('hud-health-bar')[0],
        backgroundbar = document.createElement('div'),
        playerhb = document.createElement('div'),
        phbinner = document.createElement('div'),
        phbiback = document.createElement('div'),
        p = document.createElement('p'),
        p2 = document.createElement('p'),
        bottomhud = document.getElementsByClassName("hud-bottom-right")[0],
        pethpbar = document.createElement("div"),
        pethpbarinner = document.createElement("div"),
        pethpp = document.createElement("p");
    backgroundbar.className = 'background-bar';
    healthbar.id = 'healthbar';
    healthbar.style.maxWidth = '100%';
    healthbar.style.minWidth = '0%';
    healthbar.style.transition = 'all 0.4s';
    p.id = 'newp';
    p2.id = 'newp2';
    healthbar.appendChild(p);
    healthvarout.appendChild(backgroundbar);
    hud.append(playerhb);
    playerhb.id = 'playerhb';
    phbiback.id = 'phbiback';
    playerhb.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    playerhb.appendChild(phbinner);
    phbinner.id = 'phbinner';
    playerhb.appendChild(p2);
    playerhb.appendChild(phbiback);
    pethpbar.style.width = healthbar.style.with;
    pethpbar.id = "pethp";
    pethpp.id = "petp";
    pethpbarinner.id = 'pethpin';
    pethpbar.appendChild(pethpp);
    pethpbar.appendChild(pethpbarinner);
    bottomhud.appendChild(pethpbar);



    setInterval(function () {
        var phealth = Game.currentGame.world.localPlayer.entity.targetTick.health.toFixed(1);
        window.one = healthbar.style.width.replaceAll('%', '');
        var fixed = phealth / 5;
        p.innerText = fixed.toFixed(1) + '%';
        p2.innerText = fixed.toFixed(1) + '%';
        phbinner.style.width = healthbar.style.width;


        if (one <= 20) {
            healthbar.style.backgroundColor = '#E74C3C';
            backgroundbar.style.backgroundColor = '#F1948A';
            healthbar.id = 'healthanime';
            backgroundbar.id = 'healthanime2';
            phbinner.className = 'phbinneranime';
            phbiback.className = 'phbibackanime';
            phbinner.style.backgroundColor = '#E74C3C';
            phbiback.style.backgroundColor = '#F1948A';
        }
        else {
            healthbar.id = 'noanime';
            backgroundbar.id = 'noanime';
            phbinner.className = 'noanime';
            phbiback.className = 'noanime';
            if (one <= 50) {
                healthbar.style.backgroundColor = '#F39C12';
                backgroundbar.style.backgroundColor = '#F8C471';
                phbinner.style.backgroundColor = '#F39C12';
                phbiback.style.backgroundColor = '#F8C471';

            }
            else {
                if (one <= 80) {
                    healthbar.style.backgroundColor = '#F1C40F';
                    backgroundbar.style.backgroundColor = '#F7DC6F';
                    phbinner.style.backgroundColor = '#F1C40F';
                    phbiback.style.backgroundColor = '#F7DC6F';

                }
                else {
                    healthbar.style.backgroundColor = '#2ECC71';
                    backgroundbar.style.backgroundColor = '#82E0AA';
                    phbinner.style.backgroundColor = '#2ECC71';
                    phbiback.style.backgroundColor = '#82E0AA';


                }
            }
        }




    }, 225);








    setInterval(function () {
        backgroundbar.style.width = healthbar.style.width;
        phbiback.style.width = healthbar.style.width;

    }, 600);
    setInterval(function () {
        if (healthbar.style.width < '0%') {
            healthbar.style.width = '0%';
        };


    }, 1)


    setInterval(function () {
        if (window.screenTop && window.screenY) {
            playerhb.style.top = '55.6%';
        }
        else {
            playerhb.style.top = '56.8%';

        };
        var petuid = game.ui.playerPetUid;
        var entries = game.world.entities;
        if (entries[petuid] !== undefined || game.ui.playerPetTick.health > 0 && game.ui.playerPetTick.model !== "PetMiner") {
            document.getElementsByClassName("hud-health-bar")[0].style.bottom = '25px';
            document.getElementsByClassName("hud-resources")[0].style.bottom = '35px';
            document.getElementsByClassName("hud-party-icons")[0].style.bottom = '25px';
            document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '80px';
            document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';

            pethpbar.style.display = 'block';
            var pethealth = entries[petuid].targetTick.health;
            var maxpethealth = entries[petuid].targetTick.maxHealth;
            var pettickhealth = game.ui.playerPetTick.health;
            if (game.ui.playerPetUid !== undefined && pethealth > 0 || game.ui.playerPetTick.health < 0) {
                var topercent = (maxpethealth - pethealth) / maxpethealth * 100.0,
                    percentage = 100 - topercent,
                    petfixed = percentage.toFixed(1);
                pethpp.innerText = petfixed + "%";
                pethpbarinner.style.width = petfixed + "%"
            };
        }
        else {
            pethpbar.style.display = 'none';
            document.getElementsByClassName("hud-health-bar")[0].style.bottom = '-5px';
            document.getElementsByClassName("hud-resources")[0].style.bottom = '5px';
            document.getElementsByClassName("hud-party-icons")[0].style.bottom = '0px';
            document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '50px';
            document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
        };







    }, 100);


    var styles = document.createElement('style');
    styles.appendChild(document.createTextNode(newcss));
    document.head.appendChild(styles);


    function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
            Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "ZombieShield", tier: Game.currentGame.ui.inventory.ZombieShield.tier });
        }
    }
    Game.currentGame.network.addRpcHandler("DayCycle", FixShield);

})();