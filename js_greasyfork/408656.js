// ==UserScript==
// @name         Slither.io Trainer Hack
// @namespace    slithertrainer
// @version      8
// @description  A Trainer to help you play on slither.io. Reveal the positions of worms close to you.Shows where's the closest and biggest food near you, and can also create 2 danger zone circles around you.
// @author       hacker09
// @match        http://slither.com/io
// @icon         https://slither.io/s/favicon.png
// @license      Mozilla Public License Version 2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408656/Slitherio%20Trainer%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/408656/Slitherio%20Trainer%20Hack.meta.js
// ==/UserScript==

/*
Copyright (c) 2016 Ermiya Eskandary & Théophile Cailliau and other contributors
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const TARGET_FPS = 30;

window.log = function() {};

window.getSnakeLength = function() {
  return (Math.floor(
    150 *
    (window.fpsls[window.sct] + window.fam / window.fmlts[window.sct] - 1) -
    50) / 10);
};
window.getSnakeWidth = function(sc) {
  if (sc === undefined) sc = window.sc;
  return sc * 29.0;
};

var canvas = window.canvas = (function() {
  return {
    // Ratio of screen size divided by canvas size.
    canvasRatio: {
      x: window.mc.width / window.ww,
      y: window.mc.height / window.hh
    },

    // Convert snake-relative coordinates to absolute screen coordinates.
    mouseToScreen: function(point) {
      var screenX = point.x + (window.ww / 2);
      var screenY = point.y + (window.hh / 2);
      return {
        x: screenX,
        y: screenY
      };
    },

    // Convert screen coordinates to canvas coordinates.
    screenToCanvas: function(point) {
      var canvasX = window.csc *
        (point.x * canvas.canvasRatio.x) - parseInt(window.mc.style.left);
      var canvasY = window.csc *
        (point.y * canvas.canvasRatio.y) - parseInt(window.mc.style.top);
      return {
        x: canvasX,
        y: canvasY
      };
    },

    // Convert map coordinates to mouse coordinates.
    mapToMouse: function(point) {
      var mouseX = (point.x - window.xx) * window.gsc;
      var mouseY = (point.y - window.yy) * window.gsc;
      return {
        x: mouseX,
        y: mouseY
      };
    },

    // Map cordinates to Canvas cordinate shortcut
    mapToCanvas: function(point) {
      var c = canvas.mapToMouse(point);
      c = canvas.mouseToScreen(c);
      c = canvas.screenToCanvas(c);
      return c;
    },

    // Map to Canvas coordinate conversion for drawing circles.
    // Radius also needs to scale by .gsc
    circleMapToCanvas: function(circle) {
      var newCircle = canvas.mapToCanvas(circle);
      return canvas.circle(
        newCircle.x,
        newCircle.y,
        circle.radius * window.gsc
      );
    },

    // Constructor for point type
    point: function(x, y) {
      var p = {
        x: Math.round(x),
        y: Math.round(y)
      };

      return p;
    },

    // Constructor for rect type
    rect: function(x, y, w, h) {
      var r = {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(w),
        height: Math.round(h)
      };

      return r;
    },

    // Constructor for circle type
    circle: function(x, y, r) {
      var c = {
        x: Math.round(x),
        y: Math.round(y),
        radius: Math.round(r)
      };

      return c;
    },

    // Fast atan2
    fastAtan2: function(y, x) {
      const QPI = Math.PI / 4;
      const TQPI = 3 * Math.PI / 4;
      var r = 0.0;
      var angle = 0.0;
      var abs_y = Math.abs(y) + 1e-10;
      if (x < 0) {
        r = (x + abs_y) / (abs_y - x);
        angle = TQPI;
      } else {
        r = (x - abs_y) / (x + abs_y);
        angle = QPI;
      }
      angle += (0.1963 * r * r - 0.9817) * r;
      if (y < 0) {
        return -angle;
      }

      return angle;
    },

    // Adjusts zoom in response to the mouse wheel.
    setZoom: function(e) {
      // Scaling ratio
      if (window.gsc) {
        window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
        window.desired_gsc = window.gsc;
      }
    },

    // Restores zoom to the default value.
    resetZoom: function() {
      window.gsc = 0.9;
      window.desired_gsc = 0.9;
    },

    // Maintains Zoom
    maintainZoom: function() {
      if (window.desired_gsc !== undefined) {
        window.gsc = window.desired_gsc;
      }
    },

    // Sets background to the given image URL.
    // Defaults to slither.io's own background.
    setBackground: function(url) {
      url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
      window.ii.src = url;
    },

    // Draw a rectangle on the canvas.
    drawRect: function(rect, color, fill, alpha) {
      if (alpha === undefined) alpha = 1;

      var context = window.mc.getContext('2d');
      var lc = canvas.mapToCanvas({
        x: rect.x,
        y: rect.y
      });

      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.rect(lc.x, lc.y, rect.width * window.gsc, rect.height * window.gsc);
      context.stroke();
      if (fill) {
        context.fillStyle = color;
        context.fill();
      }
      context.restore();
    },

    // Draw a circle on the canvas.
    drawCircle: function(circle, color, fill, alpha) {
      if (alpha === undefined) alpha = 1;
      if (circle.radius === undefined) circle.radius = 5;

      var context = window.mc.getContext('2d');
      var drawCircle = canvas.circleMapToCanvas(circle);

      context.save();
      context.globalAlpha = alpha;
      context.beginPath();
      context.strokeStyle = color;
      context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
      context.stroke();
      if (fill) {
        context.fillStyle = color;
        context.fill();
      }
      context.restore();
    },

    // Draw an angle.
    // @param {number} start -- where to start the angle
    // @param {number} angle -- width of the angle
    // @param {bool} danger -- green if false, red if true
    drawAngle: function(start, angle, color, fill, alpha) {
      if (alpha === undefined) alpha = 0.6;

      var context = window.mc.getContext('2d');

      context.save();
      context.globalAlpha = alpha;
      context.beginPath();
      context.moveTo(window.mc.width / 2, window.mc.height / 2);
      context.arc(window.mc.width / 2, window.mc.height / 2, window.gsc * 100, start, angle);
      context.lineTo(window.mc.width / 2, window.mc.height / 2);
      context.closePath();
      context.stroke();
      if (fill) {
        context.fillStyle = color;
        context.fill();
      }
      context.restore();
    },

    // Draw a line on the canvas.
    drawLine: function(p1, p2, color, width) {
      if (width === undefined) width = 5;

      var context = window.mc.getContext('2d');
      var dp1 = canvas.mapToCanvas(p1);
      var dp2 = canvas.mapToCanvas(p2);

      context.save();
      context.beginPath();
      context.lineWidth = width * window.gsc;
      context.strokeStyle = color;
      context.moveTo(dp1.x, dp1.y);
      context.lineTo(dp2.x, dp2.y);
      context.stroke();
      context.restore();
    },

    // Given the start and end of a line, is point left.
    isLeft: function(start, end, point) {
      return ((end.x - start.x) * (point.y - start.y) -
        (end.y - start.y) * (point.x - start.x)) > 0;

    },

    // Get distance squared
    getDistance2: function(x1, y1, x2, y2) {
      var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
      return distance2;
    },

    getDistance2FromSnake: function(point) {
      point.distance = canvas.getDistance2(window.xx, window.yy,
        point.xx, point.yy);
      return point;
    },

    // Check if point in Rect
    pointInRect: function(point, rect) {
      if (rect.x <= point.x && rect.y <= point.y &&
        rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
        return true;
      }
      return false;
    },

    // Check if circles intersect
    circleIntersect: function(circle1, circle2) {
      var bothRadii = circle1.radius + circle2.radius;

      // Pretends the circles are squares for a quick collision check.
      // If it collides, do the more expensive circle check.
      if (circle1.x + bothRadii > circle2.x &&
        circle1.y + bothRadii > circle2.y &&
        circle1.x < circle2.x + bothRadii &&
        circle1.y < circle2.y + bothRadii) {

        var distance2 = canvas.getDistance2(circle1.x, circle1.y, circle2.x, circle2.y);

        if (distance2 < bothRadii * bothRadii) {
          if (window.visualDebugging) {
            var collisionPointCircle = canvas.circle(
              ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) /
              bothRadii,
              ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) /
              bothRadii,
              5
            );
            canvas.drawCircle(circle2, 'red', true);
            canvas.drawCircle(collisionPointCircle, 'cyan', true);
          }
          return true;
        }
      }
      return false;
    }
  };
})();

var bot = window.bot = (function() {
  return {
    isBotRunning: false,
    isBotEnabled: true,
    lookForFood: false,
    collisionPoints: [],
    collisionAngles: [],
    scores: [],
    foodTimeout: undefined,
    sectorBoxSide: 0,
    defaultAccel: 0,
    sectorBox: {},
    currentFood: {},
    MID_X: 0,
    MID_Y: 0,
    MAP_R: 0,

    quickRespawn: function() {
      window.dead_mtm = 0;
      window.login_fr = 0;

      bot.isBotRunning = false;
      window.forcing = true;
      window.connect();
      window.forcing = false;
    },

    // Avoid headPoint
    avoidHeadPoint: function(collisionPoint) {},

    // Avoid collison point by ang
    // ang radians <= Math.PI (180deg)
    avoidCollisionPoint: function(collisionPoint, ang) {},

    // Sorting by  property 'distance'
    sortDistance: function(a, b) {
      return a.distance - b.distance;
    },

    // get collision angle index, expects angle +/i 0 to Math.PI
    getAngleIndex: function(angle) {
      const ARCSIZE = Math.PI / 4;
      var index;

      if (angle < 0) {
        angle += 2 * Math.PI;
      }

      index = Math.round(angle * (1 / ARCSIZE));

      if (index === (2 * Math.PI) / ARCSIZE) {
        return 0;
      }
      return index;
    },

    // Add to collisionAngles if distance is closer
    addCollisionAngle: function(sp) {
      var ang = canvas.fastAtan2(
        Math.round(sp.yy - window.yy),
        Math.round(sp.xx - window.xx));
      var aIndex = bot.getAngleIndex(ang);

      var actualDistance = Math.round(
        sp.distance - (Math.pow(window.getSnakeWidth(windows[sp].sc), 2) / 2));

      if (bot.collisionAngles[aIndex] === undefined) {
        bot.collisionAngles[aIndex] = {
          x: Math.round(sp.xx),
          y: Math.round(sp.yy),
          ang: ang,
          snake: sp,
          distance: actualDistance
        };
      } else if (bot.collisionAngles[aIndex].distance > sp.distance) {
        bot.collisionAngles[aIndex].x = Math.round(sp.xx);
        bot.collisionAngles[aIndex].y = Math.round(sp.yy);
        bot.collisionAngles[aIndex].ang = ang;
        bot.collisionAngles[aIndex] = sp;
        bot.collisionAngles[aIndex].distance = actualDistance;
      }
    },

    // Get closest collision point per snake.
    getCollisionPoints: function() {
      var scPoint;

      bot.collisionPoints = [];
      bot.collisionAngles = [];


      for (var snake = 0, ls = window.length; snake < ls; snake++) {
        scPoint = undefined;

        if (windows[snake].id !== window.id &&
          windows[snake].alive_amt === 1) {
          if (window.visualDebugging) {
            canvas.drawCircle(canvas.circle(
                windows[snake].xx,
                windows[snake].yy,
                window.getSnakeWidth(windows[snake].sc) / 2),
              'red', false);
          }
          scPoint = {
            xx: windows[snake].xx,
            yy: windows[snake].yy,
            snake: snake
          };
          canvas.getDistance2FromSnake(scPoint);
          bot.addCollisionAngle(scPoint);

          for (var pts = 0, lp = windows[snake].pts.length; pts < lp; pts++) {
            if (!windows[snake].pts[pts].dying &&
              canvas.pointInRect({
                x: windows[snake].pts[pts].xx,
                y: windows[snake].pts[pts].yy
              }, bot.sectorBox)
            ) {
              var collisionPoint = {
                xx: windows[snake].pts[pts].xx,
                yy: windows[snake].pts[pts].yy,
                snake: snake
              };

              if (window.visualDebugging && true === false) {
                canvas.drawCircle(canvas.circle(
                    collisionPoint.xx,
                    collisionPoint.yy,
                    window.getSnakeWidth(windows[snake].sc) / 2),
                  '#00FF00', false);
              }

              canvas.getDistance2FromSnake(collisionPoint);
              bot.addCollisionAngle(collisionPoint);

              if (scPoint === undefined ||
                scPoint.distance > collisionPoint.distance) {
                scPoint = collisionPoint;
              }
            }
          }
        }
        if (scPoint !== undefined) {
          bot.collisionPoints.push(scPoint);
          if (window.visualDebugging) {
            canvas.drawCircle(canvas.circle(
              scPoint.xx,
              scPoint.yy,
              window.getSnakeWidth(windows[scPoint].sc) / 2
            ), 'red', false);
          }
        }
      }

      if (canvas.getDistance2(bot.MID_X, bot.MID_Y, window.xx, window.yy) >
        Math.pow(bot.MAP_R - 1000, 2)) {
        var midAng = canvas.fastAtan2(
          window.yy - bot.MID_X, window.xx - bot.MID_Y);
        scPoint = {
          xx: bot.MID_X + bot.MAP_R * Math.cos(midAng),
          yy: bot.MID_Y + bot.MAP_R * Math.sin(midAng),
          snake: -1
        };
        bot.collisionPoints.push(scPoint);
        if (window.visualDebugging) {
          canvas.drawCircle(canvas.circle(
            scPoint.xx,
            scPoint.yy,
            window.getSnakeWidth(1) * 5
          ), 'yellow', false);
        }
      }


      bot.collisionPoints.sort(bot.sortDistance);
      if (window.visualDebugging) {
        for (var i = 0; i < bot.collisionAngles.length; i++) {
          if (bot.collisionAngles[i] !== undefined) {
            canvas.drawLine({
                x: window.xx,
                y: window.yy
              }, {
                x: bot.collisionAngles[i].x,
                y: bot.collisionAngles[i].y
              },
              '#99ffcc', 2);
          }
        }
      }
    },

    // Checks to see if you are going to collide with anything in the collision detection radius
    checkCollision: function(r) {
      if (!window.collisionDetection) return false;

      r = Number(r);
      var xx = Number(window.xx.toFixed(3));
      var yy = Number(window.yy.toFixed(3));

      window.cos = Math.cos(window.ang).toFixed(3);
      window.sin = Math.sin(window.ang).toFixed(3);

      const speedMult = window.sp / 5.78;
      const widthMult = window.getSnakeWidth();

      var headCircle = canvas.circle(
        xx, yy,
        speedMult * r / 2 * widthMult / 2
      );

      var fullHeadCircle = canvas.circle(
        xx, yy,
        r * widthMult / 2
      );

      var sidecircle_r = canvas.circle(
        window.lax -
        ((window.lay + window.sin * window.getSnakeWidth()) -
          window.lay),
        window.lay +
        ((window.lax + window.cos * window.getSnakeWidth()) -
          window.lax),
        window.getSnakeWidth() * speedMult
      );

      var sidecircle_l = canvas.circle(
        window.lax +
        ((window.lay + window.sin * window.getSnakeWidth()) -
          window.lay),
        window.lay -
        ((window.lax + window.cos * window.getSnakeWidth()) -
          window.lax),
        window.getSnakeWidth() * speedMult
      );

      window.sidecircle_r = sidecircle_r;
      window.sidecircle_l = sidecircle_l;

      if (window.visualDebugging) {
        canvas.drawCircle(fullHeadCircle, 'red');
        canvas.drawCircle(headCircle, 'blue', false);
        // canvas.drawCircle(sidecircle_r, 'orange', true, 0.3);
        // canvas.drawCircle(sidecircle_l, 'orange', true, 0.3);
      }

      bot.getCollisionPoints();
      if (bot.collisionPoints.length === 0) return false;

      for (var i = 0; i < bot.collisionPoints.length; i++) {
        // -1 snake is special case for non snake object.
        var colR = bot.collisionPoints[i] === -1 ? window.getSnakeWidth(1) * 5 :
          window.getSnakeWidth(windows[bot.collisionPoints[i]].sc) / 2;

        var collisionCircle = canvas.circle(
          bot.collisionPoints[i].xx,
          bot.collisionPoints[i].yy,
          colR
        );

        if (canvas.circleIntersect(headCircle, collisionCircle)) {
          window.setAcceleration(bot.defaultAccel);
          bot.avoidCollisionPoint(bot.collisionPoints[i]);
          return true;
        }

        if (bot.collisionPoints[i] !== -1) {
          var eHeadCircle = canvas.circle(
            windows[bot.collisionPoints[i]].xx,
            windows[bot.collisionPoints[i]].yy,
            colR
          );
        }
      }
      window.setAcceleration(bot.defaultAccel);
      return false;
    },

    sortScore: function(a, b) {
      return b.score - a.score;
    },

    // 2.546 ~ 1 / (Math.PI / 8) - round angle difference up to nearest 22.5 degrees.
    // Round food up to nearest 5, square for distance^2
    scoreFood: function(f) {
      f.score = Math.pow(Math.ceil(f.sz / 5) * 5, 2) /
        f.distance / (Math.ceil(f.da * 2.546) / 2.546);
    },

    computeFoodGoal: function() {
      var foodClusters = [];
      var foodGetIndex = [];
      var fi = 0;
      var sw = window.getSnakeWidth();

      for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
        var a;
        var da;
        var distance;
        var sang = window.ehang;
        var f = window.foods[i];

        if (!f.eaten &&
          !(
            canvas.circleIntersect(
              canvas.circle(f.xx, f.yy, 2),
              window.sidecircle_l) ||
            canvas.circleIntersect(
              canvas.circle(f.xx, f.yy, 2),
              window.sidecircle_r))) {

          var cx = Math.round(Math.round(f.xx / sw) * sw);
          var cy = Math.round(Math.round(f.yy / sw) * sw);
          var csz = Math.round(f.sz);

          if (foodGetIndex[cx + '|' + cy] === undefined) {
            foodGetIndex[cx + '|' + cy] = fi;
            a = canvas.fastAtan2(cy - window.yy, cx - window.xx);
            da = Math.min(
              (2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
            distance = Math.round(
              canvas.getDistance2(cx, cy, window.xx, window.yy));
            foodClusters[fi] = {
              x: cx,
              y: cy,
              a: a,
              da: da,
              sz: csz,
              distance: distance,
              score: 0.0
            };
            fi++;
          } else {
            foodClusters[foodGetIndex[cx + '|' + cy]].sz += csz;
          }
        }
      }

      foodClusters.forEach(bot.scoreFood);
      foodClusters.sort(bot.sortScore);

      for (i = 0; i < foodClusters.length; i++) {
        var aIndex = bot.getAngleIndex(foodClusters[i].a);
        if (bot.collisionAngles[aIndex] === undefined ||
          (bot.collisionAngles[aIndex].distance - Math.pow(window.getSnakeWidth(), 2) >
            foodClusters[i].distance && foodClusters[i].sz > 10)
        ) {
          bot.currentFood = foodClusters[i];
          return;
        }
      }
      bot.currentFood = {
        x: bot.MID_X,
        y: bot.MID_Y
      };
    },

    foodAccel: function() {
      var aIndex = 0;

      if (bot.currentFood && bot.currentFood.sz > 60) {
        aIndex = bot.getAngleIndex(bot.currentFood.a);

        if (
          bot.collisionAngles[aIndex] && bot.collisionAngles[aIndex].distance >
          bot.currentFood.distance * 2) {
          return 1;
        }

        if (bot.collisionAngles[aIndex] === undefined) {
          return 1;
        }
      }

      return bot.defaultAccel;
    },

    // Loop version of collision check
    collisionLoop: function() {
      if (bot.checkCollision(window.collisionRadiusMultiplier)) {
        bot.lookForFood = false;
        if (bot.foodTimeout) {
          window.clearTimeout(bot.foodTimeout);
          bot.foodTimeout = window.setTimeout(bot.foodTimer, 1000 / TARGET_FPS * 4);
        }
      } else {
        bot.lookForFood = true;
        if (bot.foodTimeout === undefined) {
          bot.foodTimeout = window.setTimeout(bot.foodTimer, 1000 / TARGET_FPS * 4);
        }
        window.setAcceleration(bot.foodAccel());
      }
    },

    // Timer version of food check
    foodTimer: function() {
      if (window.playing && bot.lookForFood &&
        window !== null && window.alive_amt === 1) {
        bot.computeFoodGoal();
        window.goalCoordinates = bot.currentFood;
      }
      bot.foodTimeout = undefined;
    }
  };
})();

var userInterface = window.userInterface = (function() {
  // Save the original slither.io functions so we can modify them, or reenable them later.
  var original_keydown = document.onkeydown;
  var original_onmouseDown = window.onmousedown;
  var original_oef = window.oef;
  var original_redraw = window.redraw;
  var original_onmousemove = window.onmousemove;

  window.oef = function() {};
  window.redraw = function() {};

  return {
    overlays: {},

    initOverlays: function() {
      var botOverlay = document.createElement('div');
      botOverlay.style.position = 'fixed';
      botOverlay.style.right = '5px';
      botOverlay.style.bottom = '112px';
      botOverlay.style.width = '150px';
      botOverlay.style.height = '85px';
      // botOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
      botOverlay.style.color = '#C0C0C0';
      botOverlay.style.fontFamily = 'Consolas, Verdana';
      botOverlay.style.zIndex = 999;
      botOverlay.style.fontSize = '14px';
      botOverlay.style.padding = '5px';
      botOverlay.style.borderRadius = '5px';
      botOverlay.className = 'nsi';
      document.body.appendChild(botOverlay);

      var serverOverlay = document.createElement('div');
      serverOverlay.style.position = 'fixed';
      serverOverlay.style.right = '5px';
      serverOverlay.style.bottom = '5px';
      serverOverlay.style.width = '160px';
      serverOverlay.style.height = '14px';
      serverOverlay.style.color = '#C0C0C0';
      serverOverlay.style.fontFamily = 'Consolas, Verdana';
      serverOverlay.style.zIndex = 999;
      serverOverlay.style.fontSize = '14px';
      serverOverlay.className = 'nsi';
      document.body.appendChild(serverOverlay);
      var prefOverlay = document.createElement('div');
      prefOverlay.style.position = 'fixed';
      prefOverlay.style.left = '10px';
      prefOverlay.style.top = '75px';
      prefOverlay.style.width = '260px';
      prefOverlay.style.height = '210px';
      // prefOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
      prefOverlay.style.color = '#C0C0C0';
      prefOverlay.style.fontFamily = 'Consolas, Verdana';
      prefOverlay.style.zIndex = 999;
      prefOverlay.style.fontSize = '14px';
      prefOverlay.style.padding = '5px';
      prefOverlay.style.borderRadius = '5px';
      prefOverlay.className = 'nsi';
      document.body.appendChild(prefOverlay);

      var statsOverlay = document.createElement('div');
      statsOverlay.style.position = 'fixed';
      statsOverlay.style.left = '10px';
      statsOverlay.style.top = '295px';
      statsOverlay.style.width = '140px';
      statsOverlay.style.height = '210px';
      // statsOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
      statsOverlay.style.color = '#C0C0C0';
      statsOverlay.style.fontFamily = 'Consolas, Verdana';
      statsOverlay.style.zIndex = 998;
      statsOverlay.style.fontSize = '14px';
      statsOverlay.style.padding = '5px';
      statsOverlay.style.borderRadius = '5px';
      statsOverlay.className = 'nsi';
      document.body.appendChild(statsOverlay);

      userInterface.overlays.botOverlay = botOverlay;
      userInterface.overlays.serverOverlay = serverOverlay;
      userInterface.overlays.prefOverlay = prefOverlay;
      userInterface.overlays.statsOverlay = statsOverlay;
    },

    toggleOverlays: function() {
      Object.keys(userInterface.overlays).forEach(function(okey) {
        var oVis = userInterface.overlays[okey].style.visibility !== 'hidden' ?
          'hidden' : 'visible';
        userInterface.overlays[okey].style.visibility = oVis;
        window.visualDebugging = oVis === 'visible';
      });
    },

    // Save variable to local storage
    savePreference: function(item, value) {
      window.localStorage.setItem(item, value);
      userInterface.onPrefChange();
    },

    // Load a variable from local storage
    loadPreference: function(preference, defaultVar) {
      var savedItem = window.localStorage.getItem(preference);
      if (savedItem !== null) {
        if (savedItem === 'true') {
          window[preference] = true;
        } else if (savedItem === 'false') {
          window[preference] = false;
        } else {
          window[preference] = savedItem;
        }
        window.log('Setting found for ' + preference + ': ' + window[preference]);
      } else {
        window[preference] = defaultVar;
        window.log('No setting found for ' + preference +
          '. Used default: ' + window[preference]);
      }
      userInterface.onPrefChange();
      return window[preference];
    },

    // Saves username when you click on "Play" button
    playButtonClickListener: function() {
      userInterface.saveNick();
      userInterface.loadPreference('autoRespawn', false);
      userInterface.onPrefChange();
    },

    // Preserve nickname
    saveNick: function() {
      var nick = document.getElementById('nick').value;
      userInterface.savePreference('savedNick', nick);
    },

    // Hide top score
    hideTop: function() {
      var nsidivs = document.querySelectorAll('div.nsi');
      for (var i = 0; i < nsidivs.length; i++) {
        if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
          nsidivs[i].style.visibility = 'hidden';
          bot.isTopHidden = true;
          window.topscore = nsidivs[i];
        }
      }
    },

    // Store FPS data
    framesPerSecond: {
      fps: 0,
      fpsTimer: function() {
        if (window.playing && window.fps && window.lrd_mtm) {
          if (Date.now() - window.lrd_mtm > 970) {
            userInterface.framesPerSecond.fps = window.fps;
          }
        }
      }
    },

    onkeydown: function(e) {
      // Original slither.io onkeydown function + whatever is under it
      original_keydown(e);
      if (window.playing) {
        // Letter `T` to toggle bot
        if (e.keyCode === 84) {
          bot.isBotEnabled = !bot.isBotEnabled;
        }
        // Letter 'U' to toggle debugging (console)
        if (e.keyCode === 85) {
          window.logDebugging = !window.logDebugging;
          console.log('Log debugging set to: ' + window.logDebugging);
          userInterface.savePreference('logDebugging', window.logDebugging);
        }
        // Letter 'Y' to toggle debugging (visual)
        if (e.keyCode === 89) {
          window.visualDebugging = !window.visualDebugging;
          console.log('Visual debugging set to: ' + window.visualDebugging);
          userInterface.savePreference('visualDebugging', window.visualDebugging);
        }
        // Letter 'I' to toggle autorespawn
        if (e.keyCode === 73) {
          window.autoRespawn = !window.autoRespawn;
          console.log('Automatic Respawning set to: ' + window.autoRespawn);
          userInterface.savePreference('autoRespawn', window.autoRespawn);
        }
        // Letter 'H' to toggle hidden mode
        if (e.keyCode === 72) {
          userInterface.toggleOverlays();
        }
        // Letter 'O' to change rendermode (visual)
        if (e.keyCode === 79) {
          userInterface.toggleMobileRendering(!window.mobileRender);
        }
        // Letter 'C' to toggle Collision detection / enemy avoidance
        if (e.keyCode === 67) {
          window.collisionDetection = !window.collisionDetection;
          console.log('collisionDetection set to: ' + window.collisionDetection);
          userInterface.savePreference('collisionDetection', window.collisionDetection);
        }
        // Letter 'A' to increase collision detection radius
        if (e.keyCode === 65) {
          window.collisionRadiusMultiplier++;
          console.log(
            'collisionRadiusMultiplier set to: ' + window.collisionRadiusMultiplier);
          userInterface.savePreference(
            'collisionRadiusMultiplier', window.collisionRadiusMultiplier);
        }
        // Letter 'S' to decrease collision detection radius
        if (e.keyCode === 83) {
          if (window.collisionRadiusMultiplier > 1) {
            window.collisionRadiusMultiplier--;
            console.log(
              'collisionRadiusMultiplier set to: ' +
              window.collisionRadiusMultiplier);
            userInterface.savePreference(
              'collisionRadiusMultiplier', window.collisionRadiusMultiplier);
          }
        }
        // Letter 'Z' to reset zoom
        if (e.keyCode === 90) {
          canvas.resetZoom();
        }
        // Letter 'Q' to quit to main menu
        if (e.keyCode === 81) {
          window.autoRespawn = false;
          userInterface.quit();
        }
        // 'ESC' to quickly respawn
        if (e.keyCode === 27) {
          bot.quickRespawn();
        }
        // Save nickname when you press "Enter"
        if (e.keyCode === 13) {
          userInterface.saveNick();
        }
        userInterface.onPrefChange();
      }
    },

    // Manual mobile rendering
    toggleMobileRendering: function(mobileRendering) {
      window.mobileRender = mobileRendering;
      window.log('Mobile rendering set to: ' + window.mobileRender);
      userInterface.savePreference('mobileRender', window.mobileRender);
      // Set render mode
      if (window.mobileRender) {
        canvas.setBackground(
          'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs');
        window.render_mode = 1;
        window.want_quality = 0;
        window.high_quality = false;
      } else {
        canvas.setBackground();
        window.render_mode = 2;
        window.want_quality = 1;
        window.high_quality = true;
      }
    },

    onPrefChange: function() {
      // Set static display options here.
      var oContent = [];
      var ht = userInterface.handleTextColor;

      oContent.push('version: ' + GM_info.script.version);
      oContent.push('[T] Enable / disable bot: ' + ht(bot.isBotEnabled));
      oContent.push('[C] collision detection on/off: ' + ht(window.collisionDetection));
      oContent.push('[O] Mobile version on/off: ' + ht(window.mobileRender));
      oContent.push('[A/S] Radius multiplier (S-less, A-Greater): ' + window.collisionRadiusMultiplier);
      oContent.push('[I] Auto spawn on / off: ' + ht(window.autoRespawn));
      oContent.push('[Y] Visual debugging on / off: ' + ht(window.visualDebugging));
      oContent.push('[U] debug log: ' + ht(window.logDebugging));
      oContent.push('[Wheel(mouse)] Zoom (zoom in on top, zoom out down');
      oContent.push('[Z] Reset Zoom.');
      oContent.push('[ESC] Respawn');
      oContent.push('[Q] Exit to menu.');

      userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
    },

    onFrameUpdate: function() {
      // Botstatus overlay
      var oContent = [];

      if (window.playing && window !== null) {
        oContent.push('fps: ' + userInterface.framesPerSecond.fps);

        // Display the X and Y of the snake
        oContent.push('x: ' +
          (Math.round(window.xx) || 0) + ' y: ' +
          (Math.round(window.yy) || 0));

        if (window.goalCoordinates) {
          oContent.push('target');
          oContent.push('x: ' + window.goalCoordinates.x + ' y: ' +
            window.goalCoordinates.y);
          if (window.goalCoordinates.sz) {
            oContent.push('sz: ' + window.goalCoordinates.sz);
          }
        }

        if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
          window.bso.ip + ':' + window.bso.po) {
          userInterface.overlays.serverOverlay.innerHTML =
            window.bso.ip + ':' + window.bso.po;
        }
      }

      userInterface.overlays.botOverlay.innerHTML = oContent.join('<br/>');


      if (window.playing && window.visualDebugging) {
        // Only draw the goal when a bot has a goal.
        if (window.goalCoordinates && bot.isBotEnabled) {
          var headCoord = {
            x: window.xx,
            y: window.yy
          };
          canvas.drawLine(
            headCoord,
            window.goalCoordinates,
            'green');
          canvas.drawCircle(window.goalCoordinates, 'red', true);
        }
      }
    },

    oefTimer: function() {
      var start = Date.now();
      canvas.maintainZoom();
      original_oef();
      original_redraw();

      if (window.playing && bot.isBotEnabled && window !== null) {
        window.onmousemove = function() {};
        bot.isBotRunning = true;
        bot.collisionLoop();
      } else if (bot.isBotEnabled && bot.isBotRunning) {
        bot.isBotRunning = false;
        if (window.lastscore && window.lastscore.childNodes[1]) {
          bot.scores.push(parseInt(window.lastscore.childNodes[1].innerHTML));
          bot.scores.sort(function(a, b) {
            return b - a;
          });
          //userInterface.updateStats();
        }

        if (window.autoRespawn) {
          window.connect();
        }
      }

      if (!bot.isBotEnabled || bot.isBotRunning) {
        window.onmousemove = original_onmousemove;
      }

      userInterface.onFrameUpdate();
      setTimeout(userInterface.oefTimer, (1000 / TARGET_FPS) - (Date.now() - start));
    },

    // Quit to menu
    quit: function() {
      if (window.playing && window.resetGame) {
        window.want_close_socket = true;
        window.dead_mtm = 0;
        if (window.play_btn) {
          window.play_btn.setEnabled(true);
        }
        window.resetGame();
      }
    },

    // Update the relation between the screen and the canvas.
    onresize: function() {
      window.resize();
      // Canvas different size from the screen (often bigger).
      canvas.canvasRatio = {
        x: window.mc.width / window.ww,
        y: window.mc.height / window.hh
      };
    },

    handleTextColor: function(enabled) {
      return '<span style=\"color:' +
        (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
    }
  };
})();

// Main
(function() {
  window.play_btn.btnf.addEventListener('click', userInterface.playButtonClickListener);
  document.onkeydown = userInterface.onkeydown;
  window.onmousedown = userInterface.onmousedown;
  window.addEventListener('mouseup', userInterface.onmouseup);
  window.onresize = userInterface.onresize;

  // Hide top score
  userInterface.hideTop();

  // Overlays
  userInterface.initOverlays();

  // Load preferences
  userInterface.loadPreference('logDebugging', true);
  userInterface.loadPreference('visualDebugging', true);
  userInterface.loadPreference('autoRespawn', true);
  userInterface.loadPreference('mobileRender', true);
  userInterface.loadPreference('collisionDetection', true);
  userInterface.loadPreference('collisionRadiusMultiplier', 10);
  window.nick.value = userInterface.loadPreference('savedNick', 'Slither.io Trainer Hack');

  // Listener for mouse wheel scroll - used for setZoom function
  document.body.addEventListener('mousewheel', canvas.setZoom);
  document.body.addEventListener('DOMMouseScroll', canvas.setZoom);

  // Set render mode
  if (window.mobileRender) {
    userInterface.toggleMobileRendering(false);
  } else {
    userInterface.toggleMobileRendering(true);
  }

  // Unblocks all skins without the need for FB sharing.
  window.localStorage.setItem('edttsg', '1');

  // Remove social
  window.social.remove();

  // Maintain fps
  setInterval(userInterface.framesPerSecond.fpsTimer, 80);

  // Start!
  userInterface.oefTimer();
})();