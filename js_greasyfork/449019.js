// ==UserScript==
// @name         gats.io color changer
// @namespace    http://tampermonkey.net/
// @version      6.10.106
// @description  Allows you to change your own color and the colors of other players. Color picker now added to make it easier to use. Please note that the color changes are only seen on your side and that it wont affect camo.
// @author       You
// @match        https://gats.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449019/gatsio%20color%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/449019/gatsio%20color%20changer.meta.js
// ==/UserScript==
const colorback = document.getElementById('colorBacking');
let teamcolorid = 1;
let colors =["#FFFF00","#0000FF","#FF0000"];
let enemycolor = "#0000FF";
let teamcolor = "#FF0000";
let disableColor = false;

while(colorback.firstChild){
    colorback.removeChild(colorback.lastChild);
}
setTimeout(function(){
  if (disableColor !== null && disableColor === true) {return;}
  a44 = function (canvas, players) {
  players.current = players['new'];
    var funnynumber = 0.03;
    canvas['fillStyle'] = "#609b68", canvas['textAlign'] = "center", canvas.font = 'bold 11px Arial', canvas['fillText']('Total playerss Online: ' + c29, 1.845 * j1, 0.032 * j2), canvas['fillStyle'] = '#4C4C4C';
    players.current['length'] > 0 && canvas['fillText']('Leaderboard', 1.845 * j1, 0.07 * j2);
    canvas['textAlign'] = 'start';
    for (var i in players['current']) {
      if (!players['current'][i]['userId']) continue;
      canvas.globalAlpha = 0.5;
      if (parseInt(players['current'][i].teamCode) == 1) canvas['fillStyle'] = teamcolor; else parseInt(players['current'][i].teamCode) == 2 ? canvas['fillStyle'] = enemycolor : canvas['fillStyle'] = '#808080';
      canvas.fillRect(1.7 * j1, (0.05 + funnynumber) * j2, 0.295 * j1, 0.04 * j2), players.current[i]['isMember'] && (canvas['globalAlpha'] = 0.65, drawImage(j30.vip, 1.703 * j1, (0.055 + funnynumber) * j2, 18, 10)), canvas['globalAlpha'] = 1, canvas.fillStyle = 'white', canvas.font = '10px Arial', players['current'][i]['isMember'] ? canvas['fillText'](players['current'][i].userId + ": " + players['current'][i]['score'], 1.735 * j1, (0.0787 + funnynumber) * j2) : canvas['fillText'](players['current'][i]['userId'] + ": " + players.current[i]['score'], 1.705 * j1, (0.0787 + funnynumber) * j2), canvas['textAlign'] = "right", canvas['fillText']("Kills: " + players.current[i].kills, 1.99 * j1, (0.0795 + funnynumber) * j2), canvas.textAlign = 'start', funnynumber = funnynumber + 0.045;
    }
    canvas.textAlign = 'right', canvas['fillStyle'] = '#4C4C4C', canvas.font = 'bold 11px Arial', canvas['fillText']('players in arena: ' + o4.currentPlayers, 1.99 * j1, (funnynumber + 0.075) * j2), canvas['textAlign'] = 'start';
}},2000);

colorback.innerHTML = '<div class="yourcolor"><label for = "yourcolor" style = "color:white;";>Your color:</label><input type="color" id="yourcolor" name="yourcolor" value="#FFFF00"></div><div class="teamcolor"><label for = "teamcolor" style = "color:white;">Team color:</label><input type="color" id="teamcolor" name="teamcolor" value="#0000FF"></div><div class="enemycolor"><label for = "enemycolor" style = "color:white;">Enemy color:</label><input type="color" id="enemycolor" name="enemycolor" value="#FF0000"></div><div class="disablecolor"><label for = "disablecolor" style = "color:white;";>Set default:</label><input type="checkbox" id="disablecolor" name="disablecolor value="false"></div>';
let observer = new MutationObserver(function(){
    if(colorback.parentNode.style.display == 'none'){
        colorback.parentNode.style.display = "";
    }
});
observer.observe(colorback.parentNode,{ attributes: true, childList: true })
setInterval(() => {
    colors=[];
    colors[0] = document.getElementById("yourcolor").value;
    colors[1] = document.getElementById("teamcolor").value;
    colors[2] = document.getElementById("enemycolor").value;
    disableColor = document.getElementById("disablecolor").checked;

    try {
        for(let i in RD.pool) {
            teamcolorid = RD.pool[c3].teamCode;
            if (RD.pool[i].activated === 1 && !disableColor) {
                switch(RD.pool[i].teamCode) {
                    case 0:
                        RD.pool[i].color = {a: colors[2], b: '#D3D3D3'};
                        break;
                    case teamcolorid:
                        RD.pool[i].color = {a: colors[1], b: '#D3D3D3'};
                        break;
                    default:
                        RD.pool[i].color = {a: colors[2], b: '#D3D3D3'};
                        break;
                }
            }
        }
        RD.pool[c3].color = {a: colors[0], b: '#D3D3D3'};
        if(teamcolorid == 1)
            teamcolor = colors[1],enemycolor = colors[2];
        else if (teamcolorid == 2) {
            teamcolor = colors[2],enemycolor =colors[1];
        }
    }
    catch(err){
        console.log("RD.pool[c3] hasnt loaded yet")
    }
},100);