// ==UserScript==
// @name         scratch extesion: thread vars by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @tag          lib
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABtQTFRFAAAAGO3KDodz//////7///3////9/v///f///qLt5wAAAAl0Uk5TAP//////////NwKb1AAAAblJREFUeJyVlUFOBTEIQMuPcWOMUzWuvYI38P4bvYEnMDRxZ76OBQqFTmu0mWma4RUKUwCSDdhsuZf+1VY5+YEHwO0POmAu74QC2TCVYACy19IQdACLaIKNpELIDKagKZHPaBMk2+sBnnmCpqDZV0CE2AASxjA1IVEQFIwEMiAKsou/GamvAPWJAGxI2wUQCwLoIQmgFVYgHNEDogKahQHQYxIQfAgA24AYhACwCggW/gvU9Q4xjAcgEVCf2x0nAIdagEwObfXMM6D5gfQOAIVaAPH09L4G2n1eA2wkpYvrCaApwU5FDfQ3/wLwVwVEsH2cS92JApxu9sKR8EHdHcCbG3D3tQY4bs+v6fQ9Aqm7OY4O+MQfAQv1EeiRhPtz/VkHGwbUZy/5qMMDKNQMqPYvr0iUD0C/UYvRgEnum4U0XPsDMObFHFgegjNrUYD0CLgCqJ7wYwXk6a2MQKsPoQTZePgsWoLmQPOh9DI496H8UkjFggJG2KXQtqC1Wo0Y0CqxVftkdxdN3tuB5XcFHl/UgGso/eZ3ByY9qxNoSqzrdSd057xvuqEpYK05z+Wr3t1/TO/+XodLsR+eZBUmoy42QAAAAABJRU5ErkJggg==
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524959/scratch%20extesion%3A%20thread%20vars%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524959/scratch%20extesion%3A%20thread%20vars%20by%20rssaromeo.meta.js
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
    "thread vars",
    "rssaromeo",
    class {
      settempvar({ varname, value }, { thread }) {
        thread.tempvars ??= {}
        thread.tempvars[varname] = value
      }
      gettempvar({ varname, _default = 1 }, { thread }) {
        thread.tempvars ??= {}
        if (varname in thread.tempvars)
          return thread.tempvars[varname]
        return _default
      }
    },
    [
      newblock(
        bt.cmd,
        "settempvar",
        "set temp var [varname] to [value]",
        [
          [inp.str, "temp var name"],
          [inp.str, "any data here"],
        ]
      ),
      newblock(
        bt.ret,
        "gettempvar",
        "get temp var [varname], default value: [_default]",
        [
          [inp.str, "temp var name"],
          [
            inp.str,
            "there was no var with that name created in this thread",
          ],
        ]
      ),
    ],
    "#17E6C3",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABtQTFRFAAAAGO3KDodz//////7///3////9/v///f///qLt5wAAAAl0Uk5TAP//////////NwKb1AAAAblJREFUeJyVlUFOBTEIQMuPcWOMUzWuvYI38P4bvYEnMDRxZ76OBQqFTmu0mWma4RUKUwCSDdhsuZf+1VY5+YEHwO0POmAu74QC2TCVYACy19IQdACLaIKNpELIDKagKZHPaBMk2+sBnnmCpqDZV0CE2AASxjA1IVEQFIwEMiAKsou/GamvAPWJAGxI2wUQCwLoIQmgFVYgHNEDogKahQHQYxIQfAgA24AYhACwCggW/gvU9Q4xjAcgEVCf2x0nAIdagEwObfXMM6D5gfQOAIVaAPH09L4G2n1eA2wkpYvrCaApwU5FDfQ3/wLwVwVEsH2cS92JApxu9sKR8EHdHcCbG3D3tQY4bs+v6fQ9Aqm7OY4O+MQfAQv1EeiRhPtz/VkHGwbUZy/5qMMDKNQMqPYvr0iUD0C/UYvRgEnum4U0XPsDMObFHFgegjNrUYD0CLgCqJ7wYwXk6a2MQKsPoQTZePgsWoLmQPOh9DI496H8UkjFggJG2KXQtqC1Wo0Y0CqxVftkdxdN3tuB5XcFHl/UgGso/eZ3ByY9qxNoSqzrdSd057xvuqEpYK05z+Wr3t1/TO/+XodLsR+eZBUmoy42QAAAAABJRU5ErkJggg=="
  )
})()
