// ==UserScript==
// @name     Quizlet Spell Auto-Giveup Countdown.
// @version  0.0.7
// @grant    none
// @match    https://quizlet.com/*/spell
// @match    https://quizlet.com/*/spell/stared
// @namespace https://github.com/Brandon-Beck
// @description A forced, automatic, and short study session for spelling words you obviously do NOT know. Includes a short configurable break and an alarm to get them to come back when the break ends. Intended for use with kids.
// @require  https://gitcdn.xyz/repo/Brandon-Beck/Userscripts/604449d00e316a699e1cd63d54b8b14f824dbb91/common.js
// @require  https://gitcdn.xyz/repo/Brandon-Beck/Userscripts/e9750f7ddfc0a4717207be2112114a57bb76b00c/uncommon.js
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/371816/Quizlet%20Spell%20Auto-Giveup%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/371816/Quizlet%20Spell%20Auto-Giveup%20Countdown.meta.js
// ==/UserScript==

'use strict'

// TODO Settings UI
/*
function newNumberCorrector(min ,max) {
  return (textVal) => {
    const val = parseInt(textVal)
    if (
      textVal == null
        || (typeof textVal === 'string' && (textVal.length === 0 || textVal.match(/[^0-9]/)))
        || typeof val !== 'number') {
      return undefined
    }
    if (val < min) return min
    if (val > max) return max
    // dont triger callback via type change.
    return textVal
  }
}
const settingsUI = new SettingUI()
settingsUI.addTextbox({
  key: 'max_spell_time'
  ,title: 'Spell Time'
  ,settingsTreeConfig: {
    defaultValue: 40
    ,corrector: newNumberCorrector(5 ,5 * 60)
  }
  ,min: 5
  ,max: 5 * 60
  ,titleText: 'Seconds we should wait for the player to type an answer before we snatch the paper from them, check it, and(if incorrect) correct them, and make them do it again.'
  ,type: 'number'
})
settingsUI.addTextbox({
  key: 'break_length'
  ,title: 'Break length'
  ,settingsTreeConfig: {
    defaultValue: 5 * 60
    ,corrector: newNumberCorrector(0 ,60 * 60)
  }
  ,min: 0
  ,max: 60 * 60
  ,titleText: 'How long of a break(in seconds) the player should have. Reccomend a minimum of 5 minutes. Should be long enough to allow them to use the bathroom.'
  ,type: 'number'
})
settingsUI.addTextbox({
  key: 'break_delay'
  ,title: 'Break delay'
  ,settingsTreeConfig: {
    defaultValue: 15 * 60
    ,corrector: newNumberCorrector(5 * 60 ,60 * 60)
  }
  ,min: 5 * 60
  ,max: 60 * 60
  ,titleText: 'How long the player should be required to play(in seconds) before their break. Reccomend a maximum of 30 minutes. Should be an appropriate studdy time given their age and willingness to studdy.'
  ,type: 'number'
})
*/

function CountdownElm(attr = {}) {
  const self = this
  if (!(self instanceof CountdownElm)) {
    return new CountdownElm(attr)
  }
  const elm = attr.elm
  let endtime = attr.endtime
  let paused_remainingtime = 0
  let is_paused = false
  let should_reset_time = false
  self.updateUI = () => {
    let r = Math.floor(self.remainingtime / 1000 + 0.5)
    r = Math.max(r ,0)
    elm.innerHTML = r
  }
  self.pause = () => {
    if (!is_paused) {
      paused_remainingtime = self.remainingtime
      is_paused = true
      should_reset_time = true
    }
  }
  self.unpause = () => {
    if (is_paused) {
      if (should_reset_time) {
        self.endtime_from_millisec(paused_remainingtime)
      }
      paused_remainingtime = 0
      is_paused = false
      should_reset_time = false
    }
  }
  self.endtime_from_millisec = (milli) => {
    endtime = Date.now() + milli
    should_reset_time = false
    paused_remainingtime = milli
  }
  Object.defineProperties(self ,{
    endtime: {
      get() {
        return endtime
      }
      ,set(val) {
        endtime = val
        should_reset_time = false
        self.updateUI()
      }
    }
    ,remainingtime: {
      get() {
        if (!is_paused) {
          return endtime - Date.now()
        }
        return paused_remainingtime
      }
    }
  })
  return self
}


function QuizletSpellTimer(initargs = {}) {
  const self = this
  if (!(self instanceof QuizletSpellTimer)) {
    return new QuizletSpellTimer(initArgs)
  }
  const qst = self
  function Print(msg) {
    console.log(msg)
  }

  function toSeconds(hms) { // HH:MM:SS to seconds
    const a = hms.split(':') // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
  }
  function htmlToElement(html) {
    const template = document.createElement('template')
    html = html.trim() // Never return a text node of whitespace as the result
    template.innerHTML = html
    return template.content.firstChild
  }
  function isHidden(el) {
    return (el.offsetParent === null)
  }


  const enter_keyboard_event = new KeyboardEvent('keydown' ,{
    keyCode: KEYCODES.enter ,which: KEYCODES.enter
  })
  const GameState = {
    Spelling: 0
    ,ReviewingMisspelled: 1
    ,Break: 2
    ,BreakOver: 3
    ,Paused: 4
  }

  const progress_cont_xp = new XPath('//div[').contains('@class' ,'ModeControls-progress').append(']')
  const break_countdown_cont = htmlToElement(`<div class='ModeControls-progressSection'>
                                   <h4 id="break_tite">Next Break</h4>
                                   <br>
                                   <h5 id="break_time">0</h5>
                                   </div>`)
  const spell_countdown_cont = htmlToElement(`<div class='ModeControls-progressSection'>
                                     <h4 id="spell_tite">Give Up In</h4>
                                     <br>
                                     <h5 id="spell_time">0</h5>
                                     </div>`)
  const pause_button_cont = htmlToElement(`<div class='ModeControls-progressSection'>
                                     <button class="h1" id="pause_play">Play</button>
                                     </div>`)
  const paused_overlay = htmlToElement(`<div style="z-index: 100; background-color: #000; height: 100%; width: 100%; position: absolute; top:0; left:0; display:none; ">
                                     </div>`)

  qst.settings = {
    'per_letter_time': 5
    ,'max_spell_time': 40
    ,'loop_timeout': 300
    ,'break': {
      length: toSeconds('00:05:00')
      ,delay: toSeconds('00:15:00')
    }
    ,'sounds': { break_over: 'https://freesound.org/data/previews/250/250629_4486188-hq.mp3' }
  }
  qst.audio = new Audio(qst.settings.sounds.break_over)
  qst.audio.loop = true
  qst.elm = {}
  qst.state = {}
  qst.is_initialized = false
  qst.ctime = new Date().getTime()
  qst.pause = {
    max_pause_cnt: 2
    ,pause_history_durration: toSeconds('00:05:00')
    ,pause_hist: []
    ,can_pause() {
      let pause_cnt = 0
      for (const pause of qst.pause.pause_hist) {
        if (pause >= (qst.ctime - (qst.pause.pause_history_durration * 1000))) {
          pause_cnt += 1
        }
      }
      return pause_cnt < qst.pause.max_pause_cnt
    }
    ,try_pause() {
      if (qst.pause.can_pause()) {
        qst.pause.pause_hist.push(qst.ctime)
        qst.pause.pause_hist.splice(0 ,qst.pause.pause_hist.length - qst.pause.max_pause_cnt)
        return true
      }
      return false
    }
  }

  qst.gamestate = GameState.Spelling

  function isReviewing() {
    // Print(Game.$diff.textContent);
    if (Game.$diff.textContent) {
      return true
    }
    return false
  }

  function initNewWord() {
    qst.state.spell_countdown.unpause()
    qst.state.break_countdown.unpause()
    qst.state.spell_countdown.endtime_from_millisec(qst.settings.max_spell_time * 1000)
    qst.gamestate = GameState.Spelling
    qst.rev_workaround_cnt = 0
  }
  function onSpellTimeout() {
    // FIXME for some reason this does not trigger pause
    qst.elm.spelling_box.dispatchEvent(enter_keyboard_event)
    //Game.missedTerm()
  }
  function onPause() {
    qst.gamestate = GameState.Paused
    paused_overlay.style.display = 'inline'
    qst.state.spell_countdown.pause()
    qst.state.break_countdown.pause()
  }
  function onResume() {
    qst.gamestate = GameState.Spelling
    paused_overlay.style.display = 'none'
    qst.state.spell_countdown.unpause()
    qst.state.break_countdown.unpause()
    qst.audio.pause()
    qst.audio.fastSeek(0)
    Game.speakCurrent()
  }
  function onPausePlay() {
    if (qst.gamestate == GameState.Paused || qst.gamestate == GameState.BreakOver) {
      onResume()
    }
    else if (qst.gamestate == GameState.Spelling || qst.gamestate == GameState.ReviewingMisspelled) {
      if (qst.pause.try_pause()) {
        onPause()
      }
    }
  }
  function updatePausePlay() {
    if (qst.gamestate == GameState.Paused || qst.gamestate == GameState.BreakOver) {
      qst.elm.pauseplay_button.disabled = false
      qst.elm.pauseplay_button.textContent = 'Play'
    }
    else if (qst.gamestate == GameState.Spelling || qst.gamestate == GameState.ReviewingMisspelled) {
      qst.elm.pauseplay_button.textContent = 'Pause'
      qst.elm.pauseplay_button.disabled = !qst.pause.can_pause()
    }
  }

  function onBreak() {
    onPause()
    qst.state.break_countdown.endtime_from_millisec(qst.settings.break.length * 1000)
    qst.state.break_countdown.unpause()
    qst.gamestate = GameState.Break
  }
  function onCorrect() {
    Print('Correct')
    clearTimeout(qst.mainloop_timer)
    initNewWord()
    qst.rev_workaround_cnt = 0
    qst.mainloop_timer = setTimeout(MainLoop ,1000)
  }
  function onMissed() {
    Print('Missed')
    clearTimeout(qst.mainloop_timer)
    qst.gamestate = GameState.ReviewingMisspelled
    qst.state.spell_countdown.pause()
    qst.state.break_countdown.pause()
    qst.rev_workaround_cnt = 0
    qst.mainloop_timer = setTimeout(MainLoop ,1000)
  }
  qst.mainloop_timer=null
  qst.rev_workaround_cnt = 0
  function MainLoop() {
    clearTimeout(qst.mainloop_timer)
    qst.ctime = new Date().getTime()
    const ctimeout = qst.settings.loop_timeout
    if (qst.gamestate == GameState.Spelling) {
      paused_overlay.style.display = 'none'
      if (qst.state.break_countdown.remainingtime <= 0) {
        onBreak()
      }
      else if (qst.state.spell_countdown.remainingtime <= 0) {
        onSpellTimeout()
      }
    }
    else if (qst.gamestate == GameState.ReviewingMisspelled) {
      if (!isReviewing()) {
        initNewWord()
        qst.gamestate = GameState.Spelling
      }
      /* if (! isReviewing() && qst.rev_workaround_cnt < 1) {
        qst.rev_workaround_cnt+=1
      }
      else if (! isReviewing() && qst.rev_workaround_cnt >= 1) {
        qst.rev_workaround_cnt=0;
        initNewWord();
        qst.gamestate=GameState.Spelling;
      } */
    }
    else if (qst.gamestate == GameState.Break) {
      if (qst.state.break_countdown.remainingtime <= 0) {
        qst.gamestate = GameState.BreakOver
        qst.audio.play()
      }
    }
    else if (qst.gamestate == GameState.BreakOver) {
      //qst.gamestate = GameState.Spelling
      //initNewWord() // Lets give them a full word's worth of time
      qst.state.break_countdown.pause()
      qst.state.break_countdown.endtime_from_millisec(qst.settings.break.delay * 1000)
      qst.state.spell_countdown.endtime_from_millisec(qst.settings.max_spell_time * 1000)
    }
    qst.state.spell_countdown.updateUI()
    qst.state.break_countdown.updateUI()
    updatePausePlay()
    qst.mainloop_timer = setTimeout(MainLoop ,ctimeout)
  }

  // NOTE: Game.curTerm.getRawWord() -> Current term string.
  function Init() {
    const spell_cont = XPath("//div[@id='SpellModeTarget']").getElement()
    paused_overlay.style.backgroundColor = '#c9ceeb'
    XPath('//div[').contains('@class' ,'ModeLayout-content').append(']').getElement(spell_cont)
      .appendChild(paused_overlay)
    qst.elm.spelling_box = new XPath('//div[').contains('@class' ,'UITextarea-content').append(']//textarea').getElement()
    qst.progress_container = progress_cont_xp.getElement()
    qst.progress_container.appendChild(break_countdown_cont)
    qst.progress_container.appendChild(spell_countdown_cont)
    qst.progress_container.appendChild(pause_button_cont)
    qst.elm.break_countdown = new XPath("//*[@id='break_time']").getElement(break_countdown_cont)
    qst.elm.spell_countdown = new XPath("//*[@id='spell_time']").getElement(spell_countdown_cont)
    qst.elm.pauseplay_button = new XPath("//*[@id='pause_play']").getElement(pause_button_cont)
    qst.state = {
      spell_countdown: CountdownElm({
        elm: qst.elm.spell_countdown
        ,endtime: 0
      })
      ,break_countdown: CountdownElm({
        elm: qst.elm.break_countdown
        ,endtime: 0
      })
    }
    qst.elm.pauseplay_button.onclick = onPausePlay
    qst.state.break_countdown.endtime_from_millisec(qst.settings.break.delay * 1000)
    const oldMissed = Game.missedTerm
    Game.missedTerm = () => {
      onMissed()
      oldMissed.apply(Game)
    }
    const oldCorrect = Game.beatTerm
    Game.beatTerm = () => {
      onCorrect()
      oldCorrect.apply(Game)
    }
    initNewWord()
    MainLoop()
  }
  /*
    for (let key in initargs) {
        this.settings[key] = initargs[key];
    } */
  qst.run = () => {
    // CheckLoop(progress_cont_xp.toString() ,Init)
    waitForElementByXpath({ xpath: progress_cont_xp }).then(Init)
  }
  return qst
}

const qst = new QuizletSpellTimer()
//setTimeout(qst.run ,3000)
qst.run()
