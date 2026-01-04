// ==UserScript==
// @name         scratch extesion: misc by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @tag          lib
// @license      GPLv3
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABhQTFRFAAAA7e3th4V6h4V+h4eFh4eH////7e3sbLmULQAAAAh0Uk5TAP/////////VylQyAAABsUlEQVR4nI2VS07FMAxFYwkJiVGzBFgJgy67A3ZkFoBU4r/dJoUOnvrq03tTx7Gh+QWb357f8dTvessX3oD0ftGAeTwIA8QAPt7bz1cxgRR/+ZQ/imAC2MDiRogJuMCeV3C4BJhAvO8aLAEqUONKoAIksLfLdagEzAWUQAamAmIyJASYCLCEAHMHkcABLBxMApYODqwc1APWDiIB5kDbEVVCm4cF4P32IuHqQfI4QZagBYkpPnBaBAE7C+D4cWCsfht6RwIo7ZsB5NUdGA7yyABRImB4/Bvg2jCAv6YA9nV+ngrgeewtAeJ63AEJTIFOmeyarpELbAWg9FF6JOPGXQD0Lem6MQngZLNwZyFZSQFshV034gp4LhnAFoAkagrkTPaolj+A3h4B+doKyCoVkAQYEBWVgVRbCqRz4wkwhwb15N2A8wbkmjEgHb0K8Mmqh7cAcnifAe0P4VEA7Q9FIgPWgp4A73LTFuJdbtGExMGAO6F91Hv1zUQ7sXf7K2G9POZFNfFpkCZO1oiBk2dWEBzXfdepZ2Nzt/BibqbLMuqjuc/jAby+5XgUXkz/rJH2/BcDpA4mLRW1igAAAABJRU5ErkJggg==
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524961/scratch%20extesion%3A%20misc%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524961/scratch%20extesion%3A%20misc%20by%20rssaromeo.meta.js
// ==/UserScript==

;(async () => {
  await loadlib("libloader").waitforlib("scratchextesnsionmanager")
  const {
    newext,
    newmenu,
    newblock,
    bt,
    inp,
    gettarget,
    totype,
    scratch_math,
    projectid,
    canvas,
    scratchvar,
    scratchlist,
  } = loadlib("scratchextesnsionmanager")
  var vm
  loadlib("libloader")
    .waitforlib("scratch")
    .then(() => (vm = loadlib("scratch").vm))

  newext(
    "misc",
    "rssaromeo",
    class {
      setturbomode({ on }) {
        on = totype(on, "bool")
        vm.emit("TURBO_MODE_" + (on ? "ON" : "OFF"))
      }

      cursor({ a }) {
        a = totype(a, "string")
        canvas().style.cursor = a
      }
      setfullscreen({ on }) {
        on = totype(on, "bool")
        if (on) canvas().requestFullscreen()
        else document.exitFullscreen()
      }
      getfullscreen() {
        return !!document.fullscreenElement
      }
    },
    [
      newblock(bt.cmd, "setturbomode", "set turbomode [on]", [
        newmenu("setturbomode", {
          items: ["true", "false"],
          defaultValue: "true",
        }),
      ]),
      newblock(bt.cmd, "cursor", "set the cursor image to [a]", [
        newmenu("cursor", {
          items: ["none", "default"],
          defaultValue: "default",
        }),
      ]),
      newblock(bt.cmd, "setfullscreen", "set fullscreen to [on]", [
        newmenu("setfullscreen", {
          items: ["true", "false"],
          defaultValue: "true",
        }),
      ]),
      newblock(bt.bool, "getfullscreen", "fullscreen"),
    ],
    undefined,
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABhQTFRFAAAA7e3th4V6h4V+h4eFh4eH////7e3sbLmULQAAAAh0Uk5TAP/////////VylQyAAABsUlEQVR4nI2VS07FMAxFYwkJiVGzBFgJgy67A3ZkFoBU4r/dJoUOnvrq03tTx7Gh+QWb357f8dTvessX3oD0ftGAeTwIA8QAPt7bz1cxgRR/+ZQ/imAC2MDiRogJuMCeV3C4BJhAvO8aLAEqUONKoAIksLfLdagEzAWUQAamAmIyJASYCLCEAHMHkcABLBxMApYODqwc1APWDiIB5kDbEVVCm4cF4P32IuHqQfI4QZagBYkpPnBaBAE7C+D4cWCsfht6RwIo7ZsB5NUdGA7yyABRImB4/Bvg2jCAv6YA9nV+ngrgeewtAeJ63AEJTIFOmeyarpELbAWg9FF6JOPGXQD0Lem6MQngZLNwZyFZSQFshV034gp4LhnAFoAkagrkTPaolj+A3h4B+doKyCoVkAQYEBWVgVRbCqRz4wkwhwb15N2A8wbkmjEgHb0K8Mmqh7cAcnifAe0P4VEA7Q9FIgPWgp4A73LTFuJdbtGExMGAO6F91Hv1zUQ7sXf7K2G9POZFNfFpkCZO1oiBk2dWEBzXfdepZ2Nzt/BibqbLMuqjuc/jAby+5XgUXkz/rJH2/BcDpA4mLRW1igAAAABJRU5ErkJggg=="
  )
})()
