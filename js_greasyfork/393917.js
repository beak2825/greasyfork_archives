// ==UserScript==
// @name         better snowflakes
// @version      v2
// @description  Adds a snow overlay on mad-gamble.
// @author       piingz666
// @match        https://www.mad-gamble.net/*
// @grant        none
// @namespace https://greasyfork.org/users/422203
// @downloadURL https://update.greasyfork.org/scripts/393917/better%20snowflakes.user.js
// @updateURL https://update.greasyfork.org/scripts/393917/better%20snowflakes.meta.js
// ==/UserScript==

(function() {
  var snowflakes = [],
      moveAngle = 0,
      animationInterval;

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  {
  function createSnowflake() {
    var el = document.createElement('div'),
        classname = el.className = "SnowFlake",
        style = el.style;

    style.borderRadius = '100%';
    style.border = getRandomNumber(1, 4) + 'px solid white';
    style.position = 'fixed';
    style.zIndex = '999999';
    style.boxShadow = '0 0 2px rgba(255,255,255,0.8)';
    style.top = getRandomNumber(0, window.innerHeight) + 'px';
    style.left = getRandomNumber(0, window.innerWidth) + 'px';
    style.pointerEvents = "none";
    style.opacity = "0.5";

    return el;
  }

  function moveSnowflakes() {
    var l = snowflakes.length,
        i;

    moveAngle += 0.01;

    for (i=0; i<l; i++) {
      moveSnowflake(snowflakes[i]);
    }
  }

  function moveSnowflake(el) {
    var style = el.style,
        height = window.innerHeight,
        radius,
        top;

    radius = parseInt(style.border, 10);

    top = parseInt(style.top, 10);
    top += Math.cos(moveAngle) + 1 + radius/2;

    if (top > height) {
      resetSnowflake(el);
    } else {
      style.top = top + 'px';
    }


  }

  function resetSnowflake(el) {
    var style = el.style;

    style.top = '0px';
    style.left = getRandomNumber(0, window.innerWidth) + 'px';
  }

    var particle;
    for (var i=0; i<100; i++) {
      particle = snowflakes[i] = createSnowflake();
      document.body.appendChild(particle);
    }

    animationInterval = setInterval(moveSnowflakes, 33);
  }



  $("input[type='text']").focus(function(){
    $(".SnowFlake").css("opacity", "0.1");
  });
  $("input[type='text']").focusout(function(){
    $(".SnowFlake").css("opacity", "0.5");
  });
  $("textarea").focus(function(){
    $(".SnowFlake").css("opacity", "0.1");
  });
  $("textarea").focusout(function(){
    $(".SnowFlake").css("opacity", "0.5");
  });
})();