// ==UserScript==
// @name         鼠标星星拖尾特效
// @description  基本支持全页面
// @license      AGPL License
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include         *
// @match           http://*/*
// @icon         https://www.jianfast.com/uploads/icon/12106/19/e28948d9390ccd8b5cc7905e5e3ac48a.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454845/%E9%BC%A0%E6%A0%87%E6%98%9F%E6%98%9F%E6%8B%96%E5%B0%BE%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454845/%E9%BC%A0%E6%A0%87%E6%98%9F%E6%98%9F%E6%8B%96%E5%B0%BE%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

/*!
 * Fairy Dust Cursor.js
 * - 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- http://codepen.io/tholman/full/jWmZxZ/
 */

//鼠标点击雪花特效
(function fairyDustCursor() {

  var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
  var width = window.innerWidth;
  var height = window.innerHeight;
  var cursor = {x: width/2, y: width/2};
  var particles = [];

  function init() {
    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchstart', onTouchMove);

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  function onTouchMove(e) {
    if( e.touches.length > 0 ) {
      for( var i = 0; i < e.touches.length; i++ ) {
        addParticle( e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
      }
    }
  }

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
  }

  function addParticle(x, y, color) {
    var particle = new Particle();
    particle.init(x, y, color);
    particles.push(particle);
  }

  function updateParticles() {

    // Updated
    for( var i = 0; i < particles.length; i++ ) {
      particles[i].update();
    }

    // Remove dead particles
    for( var i = particles.length -1; i >= 0; i-- ) {
      if( particles[i].lifeSpan < 0 ) {
        particles[i].die();
        particles.splice(i, 1);
      }
    }

  }

  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }

  /**
   * Particles
   */

  function Particle() {

    this.character = "*";
    this.lifeSpan = 120; //ms
    this.initialStyles ={
      "position": "fixed",
      "top": "0", //必须加
      "display": "block",
      "pointerEvents": "none",
      "z-index": "10000000",
      "fontSize": "20px",
      "will-change": "transform"
    };

    // Init, and set properties
    this.init = function(x, y, color) {

      this.velocity = {
        x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1
      };

      this.position = {x: x - 10, y: y - 20};
      this.initialStyles.color = color;
      console.log(color);

      this.element = document.createElement('span');
      this.element.innerHTML = this.character;
      applyProperties(this.element, this.initialStyles);
      this.update();

      document.body.appendChild(this.element);
    };

    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;

      this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + (this.lifeSpan / 120) + ")";
    }

    this.die = function() {
      this.element.parentNode.removeChild(this.element);
    }

  }

  /**
   * Utils
   */

  // Applies css `properties` to an element.
  function applyProperties( target, properties ) {
    for( var key in properties ) {
      target.style[ key ] = properties[ key ];
    }
  }

  init();
})();