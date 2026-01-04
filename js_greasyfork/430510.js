// ==UserScript==
// @name        Every zone is ?
// @namespace   TankScript
// @match       https://florr.io/*
// @grant       unsafeWindow
// @version     Dev 0.5_1
// @author      -
// @description This is a challenge script. Use it if you want every zone to look like ? zone. Be careful!!! You can get overleveled if you don't look at the map in the bottom right corner.
// @downloadURL https://update.greasyfork.org/scripts/430510/Every%20zone%20is%20.user.js
// @updateURL https://update.greasyfork.org/scripts/430510/Every%20zone%20is%20.meta.js
// ==/UserScript==
const proxy = new Proxy(unsafeWindow.HTMLCanvasElement.prototype.getContext, {
  apply(target, thisArg, args) {
    const ctx = Reflect.apply(...arguments);

    const prototype = Object.getPrototypeOf(ctx);
    const descriptors = Object.getOwnPropertyDescriptors(prototype);

    Object.defineProperties(prototype, {
      fillStyle: {
        get() {
          // console.log("Getting fillStyle");
          return descriptors.fillStyle.get.call(this);
        },

        set(value) {
          // console.log(Setting fillStyle to ${value});
          if (value == "#1EA761") value = "#4D5E56"
          if (value == "#DECF7C") value = "#4D5E56"
          if (value == "#B06655") value = "#4D5E56"
          if (value == "#4D5E56") value = "#4D5E56"
          descriptors.fillStyle.set.call(this, value);
          }
      }
    });

    return ctx;
  }
});

unsafeWindow.HTMLCanvasElement.prototype.getContext = proxy;