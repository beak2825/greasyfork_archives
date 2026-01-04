// ==UserScript==
// @name         Betturr
// @author       haha0201
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js
// @version      1.2
// @description  Extra Stats
// @match        *://turr.io/
//
// @namespace https://greasyfork.org/users/533357
// @downloadURL https://update.greasyfork.org/scripts/408380/Betturr.user.js
// @updateURL https://update.greasyfork.org/scripts/408380/Betturr.meta.js
// ==/UserScript==



let tick,
    tickInterval;
let xp,
    xpInterval;
let hp,
    hpInterval;
let ele,
    eleInterval;
function capitalizeFLetter(string) {
     return string[0].toUpperCase() + string.slice(1);
}

WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
      if(document.getElementById("container").style.display == 'none' && !xp){
        startTimer();
        this.onclose = () => {
          xp.remove();
          tick.remove();
          hp.remove();
          ele.remove();
        }};

  this._send(data);
}
const times = [0];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
  });
}
refreshLoop()
function startTimer() {
  player.energy = 100;
  tick = document.createElement('div');
  tick.innerHTML = `0FPS`
  let leftValue = 500*UNIT/5.85;
  tick.style="z-index:9999;position:absolute;top:-4px;left:"+leftValue+"px;font-size:"+30*UNIT/6+"px;font-family: Impact, Charcoal, sans-serif;"
  document.body.appendChild(tick);


  xp = document.createElement('div');
  xp.innerHTML = `0`
  xp.style = "z-index:9999;margin:0;width:10%;overflow-x:none;position:relative;top:"+14*UNIT/5.85+"px;left:"+948*UNIT/5.85+"px;font-size:"+30*UNIT/6+"px;text-align:center;display:block;"
  document.body.appendChild(xp);


  hp = document.createElement('div');
  hp.innerHTML = `0`
  hp.style = "z-index:9999;margin:0;width:10%;overflow-x:none;position:relative;top:"+373*UNIT/5.85+"px;left:"+300*UNIT/5.85+"px;font-size:"+30*UNIT/6+"px;text-align:center;display:block;"
  document.body.appendChild(hp);


  ele = document.createElement('div');
  ele.innerHTML = `0`
  ele.style = "z-index:9999;margin:0;width:10%;overflow-x:none;position:relative;top:"+450*UNIT/5.85+"px;left:"+948*UNIT/5.85+"px;font-size:"+30*UNIT/6+"px;text-align:center;display:block;font-family: Impact, Charcoal, sans-serif;"
  document.body.appendChild(ele);
  eleInterval=setInterval(()=>{
  ele.innerHTML=`${capitalizeFLetter(player.element)}`
  hp.innerHTML=`${Math.round(player.hp)}/${player.maxhp}`
  if (player.level < 5000){
  xp.innerHTML=`${Math.round(player.level/5000*1000)/10}%`
  }
  else if (player.level < 40000){
  xp.innerHTML=`${Math.round((player.level-5000)/35000*1000)/10}%`
  }
  else if (player.level < 250000){
  xp.innerHTML=`${Math.round((player.level-40000)/210000*1000)/10}%`
  }
  else{
  xp.innerHTML=`Max`
  }
  tutorialtimer=100;
  tick.innerHTML=`${fps-1}FPS`
  }, 200)



}
