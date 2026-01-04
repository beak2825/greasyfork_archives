// ==UserScript==
// @name         Better ReplayPoker
// @namespace    https://www.twitch.tv/simplevar
// @version      0.1
// @description  ReplayPoker hotkeys
// @author       SimpleVar
// @match        https://www.replaypoker.com/play/table/*
// @match        https://www.replaypoker.com/play/replay/*
// @match        https://www.replaypoker.com/play/tournament/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=replaypoker.com
// @license The Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484271/Better%20ReplayPoker.user.js
// @updateURL https://update.greasyfork.org/scripts/484271/Better%20ReplayPoker.meta.js
// ==/UserScript==

(()=>{
    ///////////////////////////////
    //
    const TABLE_VOLUME = 10
    //
    ///////////////////////////////

    // Set volume
    waitEl('.VolumeControl__slider').then(el => el[Object.keys(el).filter(x => x.startsWith('__reactEventHandlers'))[0]].children.props.onChange(TABLE_VOLUME))

    // Streamer Mode : tweak animations and positions to allow better anti-ghosting boxes
    addStyle(`
        .Card.Card--withValue .Card__sides { transition-delay: 300ms !important; }
        .Card .Card__sides { transition: 250ms !important; }
        .Game--9seat .Card.Position--4 .Card__sides,
        .Game--8seat .Card.Position--3 .Card__sides,
        .Game--6seat .Card.Position--2 .Card__sides,
        .Game--4seat .Card.Position--1 .Card__sides,
        .Game--3seat .Card.Position--1 .Card__sides,
        .Game--2seat .Card.Position--0 .Card__sides { margin-top: -3rem !important; }
    `)

    /* TODO half pot / pot / allin    BettingControls__presets
<div class="Footer__actions">
   <div>
      <div class="BettingControls BettingControls--undefinedLimit">
         <div>
            <div class="ButtonGroup BettingControls__presets BettingControls__presets--undefined"><button class="Button Button--round Preset--min Button--pressed"><span class="Button__label">Min</span></button><button class="Button Button--round Preset--half"><span class="Button__label">½ Pot</span></button><button class="Button Button--round Preset--pot"><span class="Button__label">Pot</span></button><button class="Button Button--round Preset--max"><span class="Button__label">Max</span></button></div>
            <div class="RangeSlider BettingControls__rangeslider">
               <span class="NumberInput"><input type="text" inputmode="numeric" pattern="[0-9]*" value="4"></span>
               <div class="rangeslider rangeslider-horizontal" aria-valuemin="4" aria-valuemax="246" aria-valuenow="4" aria-orientation="horizontal">
                  <div class="rangeslider__fill" style="width: 15.5px;"></div>
                  <div class="rangeslider__handle" tabindex="0" style="left: 15.5px;">
                     <div class="rangeslider__handle-label"></div>
                  </div>
                  <ul class="rangeslider__labels"></ul>
               </div>
            </div>
         </div>
         <div class="BettingControls__actions"><button class="Button BettingControls__action BettingControls__action--defensive"><span class="Button__label">Fold</span></button><button class="Button BettingControls__action BettingControls__action--neutral Button--withValue"><span class="Button__label">Call<br><em>1</em></span></button><button class="Button BettingControls__action BettingControls__action--aggressive Button--withValue"><span class="Button__label">Raise to<br><em>4</em></span></button></div>
      </div>
   </div>
</div>
    */

    window.addEventListener('keydown', e => {
        switch (e.key) {
            case '`':
                e.preventDefault()
                e.stopPropagation()
                document.querySelector('button.IconButton--rotate')?.click()
                break
        }
    }, {capture: true, passive: false})

    window.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown': {
                const sitIn = document.querySelector('.Footer__actions .SeatControls__action--sitIn')
                if (sitIn) sitIn.click()
                else document.querySelector('.Footer__actions .rangeslider__handle')?.focus()
                break
            }
            case 'Escape':
                document.querySelector('.FoldToNoBet.Modal--confirmation button.cancel')?.click()
                break
            case 'Delete':
                (document.querySelector('.FoldToNoBet.Modal--confirmation button.fold') ?? document.querySelector('.Footer__actions .BettingControls__action--defensive'))?.click()
                break
            case 'End':
                document.querySelector('.Footer__actions .BettingControls__action--neutral')?.click()
                break
            case 'PageDown':
                document.querySelector('.Footer__actions .BettingControls__action--aggressive')?.click()
                break
            case 'Insert':
                document.querySelector('.Footer__actions .PreTurnIntents__column--defensive .CheckBox')?.click()
                break
            case 'Home':
                document.querySelector('.Footer__actions .PreTurnIntents__column--neutral .CheckBox')?.click()
                break
            case 'PageUp':
                document.querySelector('.Footer__actions .PreTurnIntents__column--aggressive .CheckBox')?.click()
                break
        }
    }, {capture: true, passive: true})

    function addStyle(rules) {
        let s = document.createElement('style')
        s.innerText = rules
        document.head.appendChild(s)
        return s
    }

    function waitTruthy(pollInterval, fn) {
        return new Promise((res, _) => {
            poll()
            function poll() {
                const x = fn()
                if (x) res(x)
                else setTimeout(poll, pollInterval)
            }
        })
    }

    async function waitEl(elOrSelector, predicate = undefined, pollInterval = 100, knownParent = undefined) {
        if (!(elOrSelector instanceof HTMLElement)) {
            knownParent ??= document
            elOrSelector = await waitTruthy(pollInterval, () => knownParent.querySelector(elOrSelector))
        }
        if (predicate) await waitTruthy(pollInterval, () => predicate(elOrSelector))
        return elOrSelector
    }

})()
