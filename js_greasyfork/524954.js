// ==UserScript==
// @name         scratch extesion: timer by rssaromeo
// @version      4
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @tag          lib
// @match        *://*/*
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAA9QTFRFAAAAA6ruC6rmAWGH////xP85DwAAAAV0Uk5TAP////8c0CZSAAABtUlEQVR4nL2V0XGEMAxErVSAO8jQf01MKohJAyFY0kprMDf3FX/cYPuxK3OyJCWGLPF47LkaT7XQkO8bQO8PGjLfTwKAGXx8lvL7ZSttACq2+3CkEaAG2AdhJhICK0ewhYRAIN8PDZUQF7D9GtJKNAe6wMpHbW7SUUkB+hQgmgIuMHyqZianhAFdAP4RxwbAHFSgyXLs9mQS7QTcoepqB3QlJMQd+mIPadHIbeKAOVQ/lAI+Uw8xB38HgyTEHOqQZpAYgVY1Pv05T+Meh2gIOmdA39AgOqAhnGsM6Er3MKBG/iweinkYoCHEOmKtHsR7gBmOgK69CfghZsAZpQPHj+141vSp/DvAfyU+BAOcDNNTvAT4Q12A+3/BIUz/rGfAE4YdAuCM8s1bRkVOBlALAfBI+czq8vJeaNoPVxMf3acA/HLf7qbdLCoP19ttlxcValIfusMeBQR1hZ68PrDEUKNQgiZV0ATUgcrgtU5mlYtKPFRadwBwq9Woo1Grx25QohJHtb8SqOXZL8aGEd2AOg5rZMPhnpXElrGi6+GEK7Yf+iYNJFi05jrff+rdmX/Z/VmDLuIfxL1QJnNOkwEAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524954/scratch%20extesion%3A%20timer%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524954/scratch%20extesion%3A%20timer%20by%20rssaromeo.meta.js
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
    "timer",
    "rssaromeo",
    class {
      pausetimer() {
        vm.runtime.ioDevices.clock.pause()
      }
      resumetimer() {
        vm.runtime.ioDevices.clock.resume()
      }
    },
    [
      newblock(bt.cmd, "pausetimer", "pause timer"),
      newblock(bt.cmd, "resumetimer", "resume timer"),
    ],
    "03aaee",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAA9QTFRFAAAAA6ruC6rmAWGH////xP85DwAAAAV0Uk5TAP////8c0CZSAAABtUlEQVR4nL2V0XGEMAxErVSAO8jQf01MKohJAyFY0kprMDf3FX/cYPuxK3OyJCWGLPF47LkaT7XQkO8bQO8PGjLfTwKAGXx8lvL7ZSttACq2+3CkEaAG2AdhJhICK0ewhYRAIN8PDZUQF7D9GtJKNAe6wMpHbW7SUUkB+hQgmgIuMHyqZianhAFdAP4RxwbAHFSgyXLs9mQS7QTcoepqB3QlJMQd+mIPadHIbeKAOVQ/lAI+Uw8xB38HgyTEHOqQZpAYgVY1Pv05T+Meh2gIOmdA39AgOqAhnGsM6Er3MKBG/iweinkYoCHEOmKtHsR7gBmOgK69CfghZsAZpQPHj+141vSp/DvAfyU+BAOcDNNTvAT4Q12A+3/BIUz/rGfAE4YdAuCM8s1bRkVOBlALAfBI+czq8vJeaNoPVxMf3acA/HLf7qbdLCoP19ttlxcValIfusMeBQR1hZ68PrDEUKNQgiZV0ATUgcrgtU5mlYtKPFRadwBwq9Woo1Grx25QohJHtb8SqOXZL8aGEd2AOg5rZMPhnpXElrGi6+GEK7Yf+iYNJFi05jrff+rdmX/Z/VmDLuIfxL1QJnNOkwEAAAAASUVORK5CYII="
  )
})()
