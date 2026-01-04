// ==UserScript==
// @name         scratch extesion: array by rssaromeo
// @version      3
// @description  none
// @run-at       document-start
// @tag          lib
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABhQTFRFAAAAF+bDDodz////Ftq5F+TCFdGxF+XCTsAXuAAAAAh0Uk5TAP/////////VylQyAAABPElEQVR4nL2VbQ7CMAiGS0z8vR7K+99EvMFsoXy00nW6xEaXRh5eWoYASRdsut1f9qvucvILPwDn32lAbDdCgKyYWLADsldpCDqATBaFCX6CCnS3QH2ACPSnJG96QBMYb0FGbEA19mlqxkpBLNAIJCAUYPfyZSAQIHcG4ggsgQWYRBAJmEZQgCJkO3lSwWeNARwhBLBKAEf4ESj32IEvOQVSBejjCplW8UJK9QmA7xECNdV/AbhiQ6C+zQVwWwGPFXC/fIavgEyp3ypZtg6QRAVAn8nrwPRdnKwoWkNNCnBctMuyPwMc//Wm7aE1iAXQ+sNxA1m2oCNAu1wYQ7vcRIIjCBBPHGnFZByDtE6s3T6aejYOhoGT3DRwE8dr2MDxM8sIVBGdeqKf1TOem8MpPTASq9ltNW7T32ugbd+QRu9l+R1fTwAAAABJRU5ErkJggg==
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524957/scratch%20extesion%3A%20array%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524957/scratch%20extesion%3A%20array%20by%20rssaromeo.meta.js
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
    "array",
    "rssaromeo",
    class {
      keeponlyone({ arr: arrname }) {
        try {
          var [sprite, arrname] = JSON.parse(arrname)
          var newarr = scratchlist(arrname, undefined, sprite)
          newarr = newarr.filter((e, i) => i == newarr.indexOf(e))
          if (scratchlist(arrname, undefined, sprite))
            scratchlist(arrname, newarr, sprite)
          else return JSON.stringify(newarr)
        } catch (e) {
          error(e)
        }
      }
    },
    [
      newblock(bt.cmd, "keeponlyone", "make [arr] unique", [
        newmenu("listnames", { defaultValue: "" }),
      ]),
    ],
    "17e6c3",
    //"12B398",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABhQTFRFAAAAF+bDDodz////Ftq5F+TCFdGxF+XCTsAXuAAAAAh0Uk5TAP/////////VylQyAAABPElEQVR4nL2VbQ7CMAiGS0z8vR7K+99EvMFsoXy00nW6xEaXRh5eWoYASRdsut1f9qvucvILPwDn32lAbDdCgKyYWLADsldpCDqATBaFCX6CCnS3QH2ACPSnJG96QBMYb0FGbEA19mlqxkpBLNAIJCAUYPfyZSAQIHcG4ggsgQWYRBAJmEZQgCJkO3lSwWeNARwhBLBKAEf4ESj32IEvOQVSBejjCplW8UJK9QmA7xECNdV/AbhiQ6C+zQVwWwGPFXC/fIavgEyp3ypZtg6QRAVAn8nrwPRdnKwoWkNNCnBctMuyPwMc//Wm7aE1iAXQ+sNxA1m2oCNAu1wYQ7vcRIIjCBBPHGnFZByDtE6s3T6aejYOhoGT3DRwE8dr2MDxM8sIVBGdeqKf1TOem8MpPTASq9ltNW7T32ugbd+QRu9l+R1fTwAAAABJRU5ErkJggg=="
  )
})()
