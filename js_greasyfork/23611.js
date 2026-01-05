// ==UserScript==
// @name Свои часы на vk.com и блокировка рекламы
// @description Добавляем часы в меню и блокируем рекламу
// @author Lex (обновил by ApuoH)
// @version 1.0
// @include http*://vk.com/*
// @grant none
// @namespace https://greasyfork.org/users/70107
// @downloadURL https://update.greasyfork.org/scripts/23611/%D0%A1%D0%B2%D0%BE%D0%B8%20%D1%87%D0%B0%D1%81%D1%8B%20%D0%BD%D0%B0%20vkcom%20%D0%B8%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/23611/%D0%A1%D0%B2%D0%BE%D0%B8%20%D1%87%D0%B0%D1%81%D1%8B%20%D0%BD%D0%B0%20vkcom%20%D0%B8%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.meta.js
// ==/UserScript==

function clock(){
  var now = new Date();
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.save();
  ctx.clearRect(0,0,150,150);
  ctx.translate(57,75);
  ctx.scale(0.4,0.4);
  ctx.rotate(-Math.PI/2);
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  // Hour marks
  ctx.save();
  for (i=0;i<12;i++){
    ctx.beginPath();
    ctx.rotate(Math.PI/6);
    ctx.moveTo(100,0);
    ctx.lineTo(120,0);
    ctx.stroke();
  }
  ctx.restore();

  // Minute marks
  ctx.save();
  ctx.lineWidth = 5;
  for (i=0;i<60;i++){
    if (i%5!=0) {
      ctx.beginPath();
      ctx.moveTo(117,0);
      ctx.lineTo(120,0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI/30);
  }
  ctx.restore();
  
  var ms=now.getMilliseconds();
  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr  = now.getHours();
  hr = hr>=12 ? hr-12 : hr;

  ctx.fillStyle = "red";

  // write Hours
  ctx.save();
  ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec )
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-20,0);
  ctx.lineTo(80,0);
  ctx.stroke();
  ctx.restore();

  // write Minutes
  ctx.save();
  ctx.rotate( (Math.PI/30)*min + (Math.PI/1800)*sec +(Math.PI/1800000)*ms)
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-28,0);
  ctx.lineTo(112,0);
  ctx.stroke();
  ctx.restore();
  
  // Write seconds
  ctx.save();
  ctx.rotate(sec * Math.PI/30+ms*Math.PI/30000);
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-30,0);
  ctx.lineTo(83,0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,10,0,Math.PI*2,true);
  ctx.fill();
  /*
  #868585
  ctx.beginPath();
  ctx.arc(95,0,10,0,Math.PI*2,true);
  ctx.stroke();
  ctx.fillStyle = "#555";
  ctx.arc(0,0,3,0,Math.PI*2,true);
  ctx.fill();*/
  ctx.restore();

  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'red';
  ctx.arc(0,0,132,0,Math.PI*2,true);
  ctx.stroke();
  ctx.restore();
}

function makeClock(){
s=document.getElementById('side_bar')
d=document.createElement('span')
c=document.createElement('canvas')
c.id='canvas'
c.width=115
c.height=150
d.appendChild(c)
s.appendChild(d)
clock();
setInterval(clock,100);

}

makeClock();
hide('ads_left'); 