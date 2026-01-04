// ==UserScript==
// @name         Agma.io stats 📈
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  See stats about your game in the death screen!
// @author       firebone & fishy
// @match        https://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422896/Agmaio%20stats%20%F0%9F%93%88.user.js
// @updateURL https://update.greasyfork.org/scripts/422896/Agmaio%20stats%20%F0%9F%93%88.meta.js
// ==/UserScript==

//Type "/s help" in the agma chat to see all chat commands!

(function() {
    const ad = document.getElementById("zoomItem");
    const statsDiv = document.createElement("div");
    statsDiv.innerHTML =`
<div>
<style type="text/css">input:focus {
outline: 0;
}

#statsContainer {
width: 40%;
height: 200px;
position: fixed;
color: 44B3D3;
background-color: #525765;
border-radius: 3px;
-webkit-box-shadow: 0 0 7px 2px #3f434e inset;
-moz-box-shadow: 0 0 7px 2px #2e3138 inset;
box-shadow: 0 0 7px 2px #2e3138 inset;
margin-top: 16px;
}

.statsTable {
text-align: center;
padding-left: 6px;
border-spacing: 50% 0;
white-space: nowrap;
overflow-x: hidden;
text-overflow: ellipsis;
width: 40%;
}

#statsTitle {
text-align: center;
margin-top: 8px;
color: #337AB7;
}

.statsDescrip {
color: #FDFDFD;
}

.statsNumb {
color: #BFBFC0;
padding-bottom: 5px;
}

#statsTable {
text-align: center;
padding: 20px;
margin-left: 11.5%;
margin-top: 10px;
}

</style>

<div id="statsContainer">
<div>
<h1 id="statsTitle"><b>Gameplay Stats</b></h1>
<table id="statsTable">
<tbody id="statsBody">
<tr>
<th class="statsTable statsDescrip">Highest Mass</th>
<th class="statsTable statsDescrip">Top Leaderboard</th>
</tr>
<tr>
<td class="statsTable statsNumb" id="highestMass">/</td>
<td class="statsTable statsNumb" id="topLeader">/</td>
</tr>
<tr>
<th class="statsTable statsDescrip">XP Gained</th>
<th class="statsTable statsDescrip">Coins Gained</th>
</tr>
<tr>
<td class="statsTable statsNumb" id="xpGain">0 | 0%</td>
<td class="statsTable statsNumb" id="coinGain">0</td>
</tr>
<tr>
<th class="statsTable statsDescrip">Time Alive</th>
<th class="statsTable statsDescrip">Powerups Used</th>
</tr>
<tr>
<td class="statsTable statsNumb" id="timeAlive">0h 0min 0s</td>
<td class="statsTable statsNumb" id="powsUsed">0</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
`
    ad.parentNode.replaceChild(statsDiv, ad);
    document.getElementById("advertDialog1").style.opacity = "0";
    document.getElementById("advertDialog2").style.height = "250px";
    document.getElementById("advertContinue").parentElement.style.marginTop = "4px";

    var plrAlive = false,
        level = 0,
        deathTime = 0,
        spawnedFirstTime = false,
        highestMassEl = document.getElementById('highestMass'),
        topLeaderEl = document.getElementById('topLeader'),
        xpGainEl = document.getElementById('xpGain'),
        coinGainEl = document.getElementById('coinGain'),
        timeAliveEl = document.getElementById('timeAlive'),
        powsUsedEl = document.getElementById('powsUsed');
    function stats(){
        trackPowerCount();
        deathTime = Date.now();
        plrAlive = false;
        document.getElementById("agmaAdHref").removeAttribute("href");
        document.getElementById("agmaAdHref").parentElement.removeAttribute("onclick");
        let gainedXp = Math.floor(calcXp() - xp) > 0 ? Math.floor(calcXp() - xp) : 0;
        let gainedPercent = Math.round(gainedXp / (level / 10)) / 100;
        //golden colors if value is great
        highestMassEl.style.color = topMass > 1e5 ? '#FFD700': '#BFBFC0'; //100k+ mass
        topLeaderEl.style.color = topLeaderboard == 1 ? '#FFD700': '#BFBFC0'; //lb pos 1
        xpGainEl.style.color = gainedXp > 25000 ? '#FFD700': '#BFBFC0'; //25k xp
        coinGainEl.style.color = getCoins() - coins > 25000 ? '#FFD700': '#BFBFC0'; //25k coins
        timeAliveEl.style.color = deathTime - timeJoin > 12e5 ? '#FFD700': '#BFBFC0'; //20 minutes
        powsUsedEl.style.color = usedPowers > 30 ? '#FFD700': '#BFBFC0'; //30 powers

        gainedXp = gainedXp > 1e5 ? Math.round(gainedXp/100)/10 + 'k ' : gainedXp;
        //insert values
        highestMassEl.innerText = topMass;
        topLeaderEl.innerText = topLeaderboard == 1e5 ? "/" : topLeaderboard;
        xpGainEl.innerText = gainedXp + 'XP | ' + (gainedPercent ? gainedPercent : 0) + '%';
        coinGainEl.innerText = getCoins() - coins > 0 ? getCoins() - coins : "0";
        timeAliveEl.innerText = getTimeAlive();
        powsUsedEl.innerText = usedPowers;
    }
    //Track if player died
    var adv = document.getElementById('advert');
    setInterval(check => {
        if(adv.style.display != 'none' && plrAlive){
            stats();
        }
    }, 300)
    //Track if player spawns
    let playFunction = window.setNick;
    window.setNick = function(nick, respawn){
        playFunction(nick, respawn);
        if(!plrAlive){
            plrAlive = true; deathTime = false; spawnedFirstTime = true;
            resetStats();
        } else {
            respawn && setTimeout(resetStats, 1000); // otherwise stats wont show when dying by respawn
        };
    }
    //Track if plr switches server (if so reset stats)
    let setserverFunction = window.setserver;
    window.setserver = function(sv, sn){
        setserverFunction(sv, sn);
        resetStats();
    }
    //Track stats
    var topMass, topLeaderboard, timeJoin, xp, coins, usedPowers, powerCount;
    function trackPowerCount(){
        let oldPowerCount = powerCount;
        powerCount = 0;
        let inv = [...document.getElementById('inventory1').children, ...document.getElementById('inventory2').children]; //get all items in one array
        for(let i = 0; i < inv.length; i++){
            let amnt = parseInt(inv[i].innerText);
            if(isNaN(amnt)){
                amnt = inv[i].style.display == 'none' ? 0 : 1;
            }
            powerCount += amnt;
        }
        if(oldPowerCount - powerCount > 0){
            usedPowers += oldPowerCount - powerCount;
        }
        //checking if user logged out/in...
        let currlvl = parseInt(document.getElementById('level').innerText);
        if(level > currlvl || level + 1 < currlvl){
            xp = calcXp();
            coins = getCoins();
        }
    }
    function calcXp(){
        level = parseInt(document.getElementById('level').innerText);
        var progress = parseFloat(document.getElementsByClassName('progress-bar')[0].style.width);
        return (level ** 2 * 0.5 - 0.5 * level) * 1000 + (level * 1000 * (progress / 100));
    }
    function getCoins(){
        return parseInt(document.getElementById("coinsDash").innerText.replaceAll(' ', ''));
    }
    function getTimeAlive(){
        let msAlive = (plrAlive ? Date.now() : deathTime) - timeJoin;
        let [hh,mm,ss] = new Date(msAlive).toISOString().substr(11, 8).split(':');
        return parseInt(hh) + 'h ' + parseInt(mm) + 'min ' + parseInt(ss) + 's';
    }
    function resetStats(){
        topMass = 0;
        topLeaderboard = 1e5;
        timeJoin = Date.now();
        xp = calcXp();
        usedPowers = 0;
        coins = getCoins();
    }
    const _fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text) {
        const match = text.toString().match(/^Mass: (\d+)$/);
        if(match){
            var mass = parseInt(match[1]);
            if(mass > topMass) topMass = mass;
        }
        if(this.fillStyle == '#ffaaaa'){
            if(parseInt(text) < topLeaderboard) topLeaderboard = parseInt(text);
        }
        _fillText.apply(this, arguments);
    }
    setInterval(trackPowerCount, 1e3)
    //Chat commands
    function replaceChat(msg){
        if(spawnedFirstTime){
            $('#chtbox').val(msg)
        } else {
            $('#chtbox').val('')
            $('#curser').text('You need to spawn one time to be able to use the chat commands!')
            $('#curser').css('color', '#FF0000')
            $('#curser').fadeIn(400)
            setTimeout(() => $('#curser').fadeOut(400), 2000)
        }
    }
    $('#chtbox').keydown(function (event) {
        if (event.keyCode === 13) {
            let [prefix, cmd] = $('#chtbox').val().split(' ')
            if(prefix == '/s' || prefix == '/stats'){
                switch(cmd){
                    case 'mass':
                        replaceChat('Highest mass in this game: ' + topMass)
                        break;
                    case 'leaderboard': case 'lb':
                        replaceChat('Highest leaderboard position in this game: ' + topLeaderboard)
                        break;
                    case 'xp':
                        var xpGain = Math.floor(calcXp() - xp);
                        var gainedPercent = Math.round(xpGain / (level / 10)) / 100;
                        replaceChat('XP gained in this game: ' + (xpGain > 0 ? xpGain : 0) + 'xp | ' + (gainedPercent ? gainedPercent : 0) + '%')
                        break;
                    case 'coins':
                        replaceChat('Coins gained in this game: ' + (getCoins() - coins > 0 ? getCoins() - coins : "0"))
                        break;
                    case 'alive': case 'time':
                        replaceChat('Time alive: ' + getTimeAlive())
                        break;
                    case 'powerups': case 'pws':
                        replaceChat('Used Powerups in this game: ' + usedPowers + (usedPowers > 419 ? ' 😳' : ''))
                        break;
                    case 'help':
                        swal({
                            title: `<h1><b style="color:#FFAAFF; font-size: 90%;"">Stats Commands</b></h1>`,
                            text: `<span style="color: #ffa;">
                                   <hr>
                                   <i style="font-size: 90%; color: #AAFFFF;">All of the stats reset when dying/respawing!</i><br>
                                   <br>/s mass - Your highest mass<br>
                                   <br>/s lb - Your highest leaderboard position<br>
                                   <br>/s xp -  XP you have gained<br>
                                   <br>/s coins - Coins you have gained<br>
                                   <br>/s alive - Time you have been alive for<br>
                                   <br>/s pws - Powerups used<br>
                                   </span>`,
                            type: '',
                            customClass: 'swal-title-gold',
                            html: true
                        })
                        $('#chtbox').val('')
                        break;

                }
            }
        }
    });
})();