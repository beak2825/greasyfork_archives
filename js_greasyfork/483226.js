// ==UserScript==
// @name         Slime Volleyball Mods
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  If Slime Volleyball has million fans, then I'm one of them. If Slime Volleyball has one fan, then I'm THAT ONE. If Slime Volleyball has no fans, that means I'm dead.
// @author       You
// @match        https://www.cwest.net/games/slime-volleyball/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cwest.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483226/Slime%20Volleyball%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/483226/Slime%20Volleyball%20Mods.meta.js
// ==/UserScript==

/*
TODO:
- fix ball-net collision (not sure if possible, annoyingly hard coded)
- normal graphics compatibility
- add serve mode (a way to infinitely test ways to serve the ball)
*/

/*
IDEAS LIST:
- Teleportation gimmick. Turn slime-net collision off, and if you're on the other side and press some key then you teleport to the middle of your side. Maybe add cooldown
- Modify slime jump height
- Double jump?
*/
var netToggle= false;
var flightToggle = false;
localStorage.setItem('net',0);
localStorage.setItem('ballsize',25);
localStorage.setItem('slimesize',100);
localStorage.setItem('flight',0);
localStorage.setItem('gravity',2);
var gravity = 2;
var slimesize = 100;
var ballsize = 25;
var srx,slx;
var bx,by;
var ob;
var interval = 50;
var span = document.getElementById('btnOptions');
addEventListener("keydown", function(e) {
  //console.log("keydown '" + e.keyCode + "'");
  if(e.keyCode == 70) { // toggle net on/off, key F
      if (!netToggle){
    localStorage.setItem('net',1);
          netToggle = true;
          optionUpdate();
      }else{
              localStorage.setItem('net',0);
          netToggle = false;
          optionUpdate();
      }

  }
  else if(e.keyCode == 66){ // make slimes bigger, key B
      slimesize += 10;
      localStorage.setItem('slimesize',slimesize);
      slimeLeft.radius = slimesize;
      slimeRight.radius = slimesize;
      optionUpdate();
  }
  else if(e.keyCode == 78){// make slimes smaller, key N
      slimesize -= 10;
      slimeLeft.radius = slimesize;
      slimeRight.radius = slimesize;
      localStorage.setItem('slimesize',slimesize);
      //updateSlime(slimeLeft, 50+((slimesize-100)/2) , 445-((slimesize-100)/2));
      //updateSlime(slimeRight, 555+((slimesize-100)/2), 950-((slimesize-100)/2));
      optionUpdate();
  }
  else if(e.keyCode == 72){ // make ball bigger, key H
      ballsize += 5;
        JS.extend(ball, { radius: ballsize});
      localStorage.setItem('ballsize',ballsize);
      optionUpdate();
  }
  else if(e.keyCode == 74){ // make ball smaller, key J
      ballsize -= 5;
      JS.extend(ball, { radius: ballsize});
      localStorage.setItem('ballsize',ballsize);
      optionUpdate();

  }
  else if(e.keyCode == 75){ // speed up game (will probably lag out), key K
      interval += 5;
      clearInterval(gameIntervalObject);
      clearInterval(gameIntervalObject);
      gameIntervalObject = setInterval(gameIteration, 1000/interval);
      optionUpdate();
  }
  else if(e.keyCode == 76){ // slow down game, key L
      interval -= 5;
      clearInterval(gameIntervalObject);
      clearInterval(gameIntervalObject);
      gameIntervalObject = setInterval(gameIteration, 1000/interval);
      optionUpdate();
  }
  else if(e.keyCode == 89) { // toggle flight, key Y
      if (!flightToggle){
    localStorage.setItem('flight',1);
          flightToggle = true;
          optionUpdate();
      }else{
              localStorage.setItem('flight',0);
          flightToggle = false;
          optionUpdate();
      }

  }

}, false);
function optionUpdate(){
    span.textContent =`SV Modded (${interval} t/s, ${slimesize} slimesize, ${ballsize} ballsize, net is ${!netToggle}, flight is ${flightToggle}), gravity is ${gravity.toFixed(1)}`;
}


function updateFrame() {

    if(onePlayer){slimeAI.move(!1);updateSlimeVelocitiesWithDoubleKeys(slimeLeft,KEY_A,KEY_LEFT,KEY_D,KEY_RIGHT,KEY_W,KEY_UP);updateSlimeVelocities(slimeRight,slimeAI.movement,slimeAI.jumpSet)}else{updateSlimeVelocitiesWithKeys(slimeLeft,KEY_A,KEY_D,KEY_W);updateSlimeVelocitiesWithKeys(slimeRight,KEY_LEFT,KEY_RIGHT,KEY_UP);};
    var ssize = parseInt(localStorage.getItem('slimesize'));
    if (localStorage.getItem('net') == 1){
    updateSlime(slimeLeft, 0, 1000);
    updateSlime(slimeRight, 0, 1000);}
    else{
      updateSlime(slimeLeft, 50+((ssize-100)/2) , 445-((ssize-100)/2));
      updateSlime(slimeRight, 555+((ssize-100)/2), 950-((ssize-100)/2));
    }
    if (updateBall()) {
    return;
    }
}
function updateBall() {
  var bsize = parseInt(localStorage.getItem('ballsize'));
  ball.velocityY = Math.max(ball.velocityY - 1, -MAX_VELOCITY_Y); // gravity

  var oldX = ball.x;

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  collisionBallSlime(slimeLeft);
  collisionBallSlime(slimeRight);

  // handle wall hits
  if (keysDown[KEY_DELETE] && oldX > 500 && ball.x <= 500) {
    ball.x = 500;
    ball.velocityX = -ball.velocityX;
  }
  else if (ball.x < (bsize/2)+2) {
    ball.x = bsize/2+2;
    ball.velocityX = -ball.velocityX;
  }
  else if (ball.x > (1000-(bsize/2))-2){
    ball.x = (1000-(bsize/2))-2;
    ball.velocityX = -ball.velocityX;
  }
  // hits the post
    if (ball.x > 500-((bsize/2)+7.5) && ball.x < 507.5+((bsize/2)) && ball.y < 127.5+(bsize/2)) {
    // bounces off top of net
    if (ball.velocityY < 0 && ball.y > 117.5+(bsize/2)) {
      ball.velocityY *= -1;
      ball.y = 130;
    }
    else if (ball.x < 500) { // hits side of net
      ball.x = 500-((bsize/2)+7.5);
      ball.velocityX = ball.velocityX >= 0 ? -ball.velocityX : ball.velocityX;
    }
    else {
      ball.x = 500+((bsize/2)+7.5);
      ball.velocityX = ball.velocityX <= 0 ? -ball.velocityX : ball.velocityX;
    }
  }

  // Check for end of point
  if (ball.y < 0) {
    if (ball.x > 500) {
      leftWon = true;
      slimeLeftScore++;
      // slimeRightScore -= slimeRightScore ? 1 : 0;
    }
    else {
      leftWon = false;
      // slimeLeftScore -= slimeLeftScore ? 1 : 0;
      slimeRightScore++;
    }
    endPoint()
    return true;
  }
  return false;
}
function updateSlimeVelocitiesWithKeys(s,left,right,up) {
  // update velocities
  // I LOVE LOCAL STORAGE I LOVE LOCAL STORAGE
  var fto = parseInt(localStorage.getItem('flight'))
  s.velocityX = keysDown[left]
    ? keysDown[right] ? 0 : -8
    : keysDown[right] ? 8 : 0;
  if(fto == 1 && keysDown[up]){ s.velocityY = 15;}
  else if (s.y == 0 && keysDown[up]) {
    s.velocityY = 31;
  }
}
function updateSlime(s, leftLimit, rightLimit) {
  if (s.velocityX != 0) {
    s.x += s.velocityX;
    if (s.x < leftLimit) {
      s.x = leftLimit;
    }
    else if (s.x > rightLimit) {
      s.x = rightLimit;
    }
  }
  if (s.velocityY != 0 || s.y > 0) {
    s.velocityY -= 2;
    s.y += s.velocityY;
    if (s.y < 0) {
      s.y = 0;
      s.velocityY = 0;
    }
  }
}
function embedFunction(s) {
document.body.appendChild(document.createElement('script'))
.innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
}

embedFunction(updateFrame);
embedFunction(updateBall);
embedFunction(updateSlime);
embedFunction(updateSlimeVelocitiesWithKeys);