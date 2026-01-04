// ==UserScript==
// @name          Fancy cursor spring
// @description   Attaches a funny spring to your cursor on every website
// @author        Konf
// @version       1.0.0
// @namespace     https://greasyfork.org/users/424058
// @icon          https://i.imgur.com/Gqf0kMZ.png
// @resource      dotImg https://i.imgur.com/Gqf0kMZ.png
// @include       *
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @run-at        document-idle
// @grant         GM_addStyle
// @grant         GM_getResourceURL
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437389/Fancy%20cursor%20spring.user.js
// @updateURL https://update.greasyfork.org/scripts/437389/Fancy%20cursor%20spring.meta.js
// ==/UserScript==

/**
 * Hi! Don't change (or even resave) anything here because
 * by doing this in Tampermonkey you will turn off updates
 * of the script (idk about other script managers). 
 * This could be restored in settings but it might be hard to find,
 * so better to reinstall the script if you're not sure
 */

/**
 * Forked from Elastic Trail script by Philip Winston @ pwinston@yahoo.com
 * Original script featured on dynamicdrive.com/dynamicindex13/trailer2.htm
 */

/* jshint esversion: 6 */

(function() {
  'use strict';

  const DELTAT = .01;
  const SEGLEN = 10;
  const SPRINGK = 10;
  const MASS = 1;
  const XGRAVITY = 0;
  const YGRAVITY = 50;
  const RESISTANCE = 10;
  const STOPVEL = 0.1;
  const STOPACC = 0.1;
  const DOTSIZE = 18;
  const BOUNCE = 0.75;

  const tail = {
    dots: [],
    dotUrl: null,
    dotsAmount: 5,
    container: null,
  };

  let mX, mY, scrX, scrY;

  mX = mY = scrX = scrY = 0;

  // init
  document.addEventListener('mousemove', (ev) => {
    if (tail.dotsAmount) {
      updateMouseXY(ev);

      tail.dotUrl = GM_getResourceURL('dotImg');
      tail.container = document.createElement('dots');

      document.body.appendChild(tail.container);

      // bugfix
      tail.dotsAmount += 1;

      for (let i = 0; i < tail.dotsAmount; i++) {
        tail.dots[i] = new TailDot(tail.container);
      }

      GM_addStyle(`
        dot.cursor-spring-dot {
          width: ${DOTSIZE}px;
          height: ${DOTSIZE}px;
          z-index: 2147483647;
          position: absolute;
          user-select: none;
          background-size: contain;
          background-image: url(${tail.dotUrl});
        }
      `);

      // bugfix
      tail.dots[0].dom.display = 'none';

      requestAnimationFrame(animate);

      document.addEventListener('scroll', updateMouseXY);
      document.addEventListener('mousemove', updateMouseXY);
    }
  }, { once: true });

  function Vec(X, Y) {
    this.X = X;
    this.Y = Y;
  }

  function TailDot(container) {
    const dotEl = document.createElement('dot');

    this.X = mX;
    this.Y = mY;
    this.dx = 0;
    this.dy = 0;
    this.dom = dotEl.style;
    dotEl.className = 'cursor-spring-dot';

    container.appendChild(dotEl);
  }

  // just save mouse position for animate() to use
  function updateMouseXY(ev) {
    if (ev.type === 'scroll') {
      mX += scrollX - scrX;
      mY += scrollY - scrY;
      scrX = scrollX;
      scrY = scrollY;
    } else {
      mX = ev.pageX;
      mY = ev.pageY;
    }
  }

  // adds force in X and Y to spring for dot[i] on dot[j]
  function springForce(i, j, spring) {
    const dx = (tail.dots[i].X - tail.dots[j].X);
    const dy = (tail.dots[i].Y - tail.dots[j].Y);
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len > SEGLEN) {
      const springF = SPRINGK * (len - SEGLEN);

      spring.X += (dx / len) * springF;
      spring.Y += (dy / len) * springF;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    tail.dots[0].X = mX;
    tail.dots[0].Y = mY;

    for (let i = 1; i < tail.dotsAmount; i++) {
      const spring = new Vec(0, 0);

      if (i > 0) {
        springForce(i - 1, i, spring);
      }

      if (i < (tail.dotsAmount - 1)) {
        springForce(i + 1, i, spring);
      }

      // air resistance/friction
      const resist = new Vec(-tail.dots[i].dx * RESISTANCE, -tail.dots[i].dy * RESISTANCE);

      // compute new accel, including gravity
      const accel = new Vec((spring.X + resist.X) / MASS + XGRAVITY, (spring.Y + resist.Y) / MASS + YGRAVITY);

      // compute new velocity
      tail.dots[i].dx += (DELTAT * accel.X);
      tail.dots[i].dy += (DELTAT * accel.Y);

      // stop dead so it doesn't jitter when nearly still
      if (Math.abs(tail.dots[i].dx) < STOPVEL &&
        Math.abs(tail.dots[i].dy) < STOPVEL &&
        Math.abs(accel.X) < STOPACC &&
        Math.abs(accel.Y) < STOPACC) {
        tail.dots[i].dx = 0;
        tail.dots[i].dy = 0;
      }

      // move to new position
      tail.dots[i].X += tail.dots[i].dx;
      tail.dots[i].Y += tail.dots[i].dy;

      const height = document.body.clientHeight + document.body.scrollTop;
      const width = document.body.clientWidth + document.body.scrollLeft;

      // bounce off 3 walls (leave ceiling open)
      if (tail.dots[i].Y >= height - DOTSIZE - 1) {
        if (tail.dots[i].dy > 0) {
          tail.dots[i].dy = BOUNCE * -tail.dots[i].dy;
        }

        tail.dots[i].Y = height - DOTSIZE - 1;
      }

      if (tail.dots[i].X >= width - DOTSIZE) {
        if (tail.dots[i].dx > 0) {
          tail.dots[i].dx = BOUNCE * -tail.dots[i].dx;
        }

        tail.dots[i].X = width - DOTSIZE - 1;
      }

      if (tail.dots[i].X < 0) {
        if (tail.dots[i].dx < 0) {
          tail.dots[i].dx = BOUNCE * -tail.dots[i].dx;
        }

        tail.dots[i].X = 0;
      }

      // move img to new position
      const newTop = Math.round(tail.dots[i].Y);
      const newLeft = Math.round(tail.dots[i].X);

      tail.dots[i].dom.top = newTop + 'px';
      tail.dots[i].dom.left = newLeft + 'px';
    }
  }
})();
