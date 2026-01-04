// ==UserScript==
// @name            Performance monitor
// @description     Works on any website. Shows fps, frame time, used memory. Change modes by click
//
// @name:ru         Монитор производительности
// @description:ru  Работает на любом сайте. Отображает fps, время кадра, используемую память. Смена режимов по клику
//
// @version         1.1.1
// @author          Konf
// @namespace       https://greasyfork.org/users/424058
// @compatible      Chrome
// @compatible      Opera
// @compatible      Firefox
// @icon            https://i.imgur.com/MrU4sID.png
// @include         *
// @run-at          document-body
// @grant           none
// @noframes
// @require         https://cdn.jsdelivr.net/npm/stats.js@0.17.0
// @require         https://cdn.jsdelivr.net/npm/interactjs@1.9.20
// @downloadURL https://update.greasyfork.org/scripts/408058/Performance%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/408058/Performance%20monitor.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* global Stats, interact */

/**
 * In the code below I just try to make proper work of the two ready libraries:
 * One makes performance monitor, and second makes the monitor movable
 * It was not so easy, and seems it works now, but DON'T try to understand why
 * Most likely, even me already do not know it
 */

(function() {
  'use strict';

  const stats = new Stats();
  const statsParentNode = document.body;
  let statsIsHidden = false;
  let mouseOverParentNode = true;

  stats.dom.style.touchAction = 'none';
  stats.dom.style.width = '80px';
  stats.dom.style.height = '48px';
  stats.dom.style.padding = 0;
  stats.dom.style.margin = 0;

  statsParentNode.appendChild(stats.dom);

  const panelNum = {
    current: 0,
    max: 2
  };

  const listeners = {
    statsDragInteract: {
      // call this function on every dragmove event
      move(event) {
        const target = event.target;

        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + (y < 0 ? 0 : y) + 'px)';
        target.style.webkitTransform = target.style.transform;

        // update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },

      // bugfix...
      start(event) {
        const target = event.target;
        const targetTransform = target.style.transform;
        const transformY = (/,( |)*(\d*)/.exec(targetTransform) || [])[2];

        if (targetTransform && transformY <= 0) {
          target.setAttribute('data-y', 0);
        }
      },

      // call this function on every dragend event
      end(event) {
        statsIsHidden = false;

        if (mouseOverParentNode && --panelNum.current < 0) {
          panelNum.current = panelNum.max;
        }

        if (!mouseOverParentNode || statsIsHidden) {
          return stats.showPanel(panelNum.current);
        }

        stats.showPanel(panelNum.current - 1);
      }
    },

    statsNative: {
      node: {
        click(event) {
          if (statsIsHidden) {
            statsIsHidden = false;
            return stats.showPanel(panelNum.current);
          }

          if (++panelNum.current > panelNum.max) {
            panelNum.current = 0;
          }

          stats.showPanel(panelNum.current);
        }
      },

      parent: {
        mouseenter(event) {
          mouseOverParentNode = true;
        },
        mouseleave(event) {
          mouseOverParentNode = false;
        }
      },

      canvas: {
        contextmenu(event) {
          event.preventDefault();

          statsIsHidden = true;
          this.style.display = 'none';
        }
      }
    }
  };

  interact(stats.dom).draggable({
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent'
      })
    ],

    listeners: listeners.statsDragInteract
  });

  const panels = Array.from(stats.dom.querySelectorAll('canvas'));
  panels.forEach((canvas) => {
    canvas.addEventListener('contextmenu', listeners.statsNative.canvas.contextmenu);
  });

  stats.dom.addEventListener('click', listeners.statsNative.node.click);

  statsParentNode.addEventListener('mouseenter', listeners.statsNative.parent.mouseenter);
  statsParentNode.addEventListener('mouseleave', listeners.statsNative.parent.mouseleave);

  requestAnimationFrame(function loop() {
    stats.update();
    requestAnimationFrame(loop);
  });
})();
