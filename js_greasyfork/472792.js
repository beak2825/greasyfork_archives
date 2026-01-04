// ==UserScript==
// @name        HeyParty
// @namespace   Violentmonkey Scripts
// @match       *://cgi.heyuri.net/party2/*
// @grant       none
// @version     1.2.3
// @author      SordFish
// @license     MIT
// @description Improved interface for party2, heyuri edition
// @downloadURL https://update.greasyfork.org/scripts/472792/HeyParty.user.js
// @updateURL https://update.greasyfork.org/scripts/472792/HeyParty.meta.js
// ==/UserScript==

let retryTimeout = undefined

const SMALLEST_INTERVAL = 1000 // minimum time between two managed requests (comments and non-action commands like @$100slot)
const UPDATE_INTERVAL = 10000 // by request from anonwaha
const COMMENT_INTERVAL = SMALLEST_INTERVAL // minimum time between two comments
const TICK_INTERVAL = 16 // about 60 times per second
const SAFETY_MARGIN = 50 // 500ms safety margin because the server can be a little iffy otherwise

const COMBINED_CHATLOG = false // True to combine the logs and the chats
const PENDING_STATUS = false // False to disable pending status messages in the status area (can be wobbly and distracting)
const AGGRESSIVE_LOG_FILTER = true // true: any message with @ + capital letter, or @ + $, is considered a log message. False: mixed command+comment are also echo'd to the chat area (includes false negatives).
const MACROS_DISABLED = false // Whether to show the kaomoji/chat macro buttons
const AUTOFOCUS = true // Whether to autofocus on the chatbox when doing most actions
const SHOW_SECRETS = true // Whether to show secret actions

const main = async () => {
  if(document.querySelector(".loginTable") || !document.querySelector('div[style^="background"]')) {
    return
  } // do not run on the login page, avoid trying to run until we see the background on a page
// -- probably the reason for massive double-click pwnage when entering from the login page...

  // if we can't see the document yet, reschedule in SMALLEST_INTERVAL seconds and try again
  if(!document.querySelector("#form")) {
    if(retryTimeout) {
      clearTimeout(retryTimeout)
    }
    retryTimeout = setTimeout(main, SMALLEST_INTERVAL + SAFETY_MARGIN)
    return
  } else {
    clearTimeout(retryTimeout)
    retryTimeout = undefined
  }

  let macrosVisible = true
  let macrosEdit = true // XXX

  let rawVisible = localStorage.getItem("heypartyShowOrig") ?? false

  let queuedAction = undefined
  let queuedComments = []
  let pendingRef = undefined

  let origGage = window.active_gage
  let origWake = window.wake_time
  let origCD = window.count_down

  let doAction = true
  let gaugeDone = true
  let updatesEnabled = true

  let sleepTimer = undefined
  let gaugeEngaged = false

  let prevTime = undefined
  let prevCommentTime = undefined
  let prevUpdateTime = undefined

  let latestRequest = undefined
  let lastExtraStatus = undefined

  let tickInterval = undefined
  let ticking = false
  let performingAction = false

  let inCombat = false
  let inDungeon = false

  let menuVisible = false

  let activeMenu = undefined

   let kaomoji =
  [
    "ヽ(´ー｀)ノ",
    "(;´Д`)",
    "ヽ(´∇`)ノ",
    "(´人｀)",
    "(＾Д^)",
    "(´ー`)",
    "（ ´,_ゝ`）",
    "(ﾟー｀)",
    "( ´ω`)",
    "ヽ(`Д´)ノ",
    "┐(ﾟ～ﾟ)┌",
    "(;ﾟ∀ﾟ)",
    "(;ﾟДﾟ)",
    "(´～`)",
    "(・∀・)",
    "Σ(;ﾟДﾟ)",
    "Σ(ﾟдﾟ|||)",
    "（⌒∇⌒ゞ）",
    "(ﾟ血ﾟ#)",
  "ｷﾀ━━━(・∀・)━━━!!",
   "(ﾟｰﾟ)",
    "(´￢`)",
   "(´π｀)",
  "ヽ(ﾟρﾟ)ノ",
  ]

  let savedMacros = JSON.parse(localStorage.getItem("heypartyMacros"))
  let chatMacros = savedMacros
  if(savedMacros === null) {
    chatMacros = kaomoji
    localStorage.setItem("heypartyMacros", JSON.stringify(chatMacros))

  }

  // Update order.
  // Note that order does matter: 'room' generates the hover menu based on 'controls', for example.
  const allElts = ["status", "chatbox", "controls", "room", "menu", "text-layout"]

  // Elements that should be updated on state change. E.g. chatbox only needs to be updated on init, never again
  const allUpdateableElts = ["status", "controls", "room", "menu", "text-layout"]

  // Display order, for override.
  const displayElts = ["status", "room", "chatbox", "controls", "menu", "text-layout"]



  // Actions default to manual operations, i.e. just send the action to the chatbox and focus it...

  let secretActions = [
    "@Fap",
    "@Slap",
  ]

  // Actions that are handled specially (e.g. requires multiple state updates to properly progress)
  let specialActions = [
    "@Home",
    "@Invite",
    "@Logout",
    "@Sleep",
    "@RunAway",
    "@Profile",
    "@MonsterBook",
    "@ItemEncyclopedia",
    "@JobMastery",
    "@Proceed",
    "@ReadLetter",
    "@Guild",

    // Require double-updates in case a combat starts
    // TODO: traps?
    "@North",
    "@South",
    "@East",
    "@West",

    "@Logout",

    "@BlackMarket",
    "@SecretShop",
    "@Basement"
  ]
  // Actions that should instantly dispatch
  let ordinaryActions = [
    "@PuffPuff",

    "@Town",

    "@Send",
    "@GiveName",

    "@Guild",
    "@Move",
    "@Make",
    "@Spectate",

    "@Offer",
    "@Trade",

    "@Entry",

    "@View",

    "@Wallpaper",

    "@Exchange",

    "@Color",

    "@ChangeJob",
    "@Order",
    "@Withdraw",
    "@Deposit",
    "@Sort",
    "@Use",
    "@Sell",
    "@Buy",

    "@Transfer",
    "@Release",

    "@PrizeExchange",
    "@$1slot",
    "@$10slot",
    "@$100slot",

    "@Look",
    "@Resolve",

    "@Tombola",
    "@Prizes",

    "@Alchemy",
    "@Recipe",

    "@Examine",
    "@Speak",

    "@Map",

    "@Fap",
    "@Slap",
  ]
  // Actions that are only handled specially when a target is added to the command.
  // This usually happens for menu actions (e.g. @Move summons the menu and @Move>Somewhere commits the actual action)
  let specialActionsWhenTargeted = [
    "@Move",

    "@Party", // TODO: potential special handling for arena @Party
    "@Challenge",
    "@Dungeon",
    "@Arena",
    "@GuildBattle",

    "@Spectate",
    "@Join",

    "@Town",

    "@Send",

    "@GiveName"
  ]
  // Actions to always show in combat
  let extraCombatActions = [
    //"@Proceed",
    //^ Not needed anymore since we're doing double-updates...
  ]
  // Actions that will show in the drop-down menu (only if part of the action set returned by the server)
  // Note that in combat, any non-special, non-ordinary action is assumed to be a combat move and conceptually
  // added to this list.
  // Excluded options are in untargetedCombatActions.
  let targetedActions = [
    "@Speak",
    "@Attack",
    "@Examine",
    "@Fap",
    "@Kick",
    "@Whisper",
    "@Slap",
  ]
  let untargetedCombatActions = [
    "@West",
    "@East",
    "@North",
    "@South",
    "@Map",

    "@Start",
    "@Party",

    "@Defend",
    "@Tension",

    "@Rear",
    "@Front",
    "@Screenshot"
  ]
  // These actions will fill the chatbox instead of being performed
  // Mostly just for arithmetician...
  let unhandledCombatActions = [
    "@MP5",
    "@MP4",
    "@MP3",
    "@Screenshot",
    "@Whisper"
  ]
  let currentActions = []

  const focusChat = (force = false) => {
    if(force || (AUTOFOCUS /*&& !macrosEdit*/)) { // XXX
      const chat = document.querySelector(".ipt-chat")
      if(chat) {
        chat.focus()
        chat.selectionStart = chat.selectionEnd = chat.value.length
      }
    }
  }

  const restyle = () => {
    const rawRoot = document.querySelector(".raw")
    if(rawRoot) {
      const myRoot = document.querySelector(".hey")
      rawRoot.style.display = rawVisible? "" : "none"
      myRoot.style.display = rawVisible? "none": ""
    }
  }

  const autoWakeup = async () => {
      await doRequest()
      await doRequest()
      const resp = await doRequest()
      updateElements(resp)
      doAction = true
  }

  const updateTime = (nowTs) => {
    let w_now_time = nowTs

    if (w_now_time >= 0) {
      w_min  = Math.floor(w_now_time / 60);
      w_sec  = Math.floor(w_now_time % 60);
      w_sec  = ("00" + w_sec).substr(("00" + w_sec).length-2, 2);
      w_nokori = w_min + 'm' + w_sec + 's';
      let maybeWakeTime = document.querySelector("#wake_time")
      if(maybeWakeTime) {
        maybeWakeTime.innerHTML = w_nokori;
      }

      if(sleepTimer) { clearTimeout(sleepTimer) }
      sleepTimer = setTimeout(() => updateTime(nowTs-1), 1000)
    }

    if(nowTs === 0) {
      autoWakeup() // skip "Refreshed!" message
    }
  }

  const setRawVisible = (state) => {
    updatesEnabled = !state
    localStorage.setItem("heypartyShowOrig", state)
    rawVisible = state
    restyle()
  }

  const updateState = (resp) => {
    // Use this function to update states/timers/triggers whenever a new page is fetched
    let resetAction = true

    resp.querySelectorAll("script").forEach(s => {
      let wake = s.textContent?.match(/.*wake_time\(\s*(-?\d+)\s*\).*/); // Find the one script that does wake_time...
      if(wake) {
        if(sleepTimer) { clearTimeout(sleepTimer) }
        sleepTimer = setTimeout(() => updateTime(Number(wake[1])-1), 1000)
      } // ... and dispatch it manually
      const shouldRegauge = s.textContent?.match(/.*active_gage\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\).*/)
      if(shouldRegauge) {
        const [now, target] = [Number(shouldRegauge[1]), Number(shouldRegauge[2])]
        window.active_gage(now, target)
        if(now >= 0) {
          resetAction = false
        }
      }
    })
    if(resetAction) {
      doAction = true
    }
  }

  const updateRaw = (rawRoot, queryDocument) => {
    const frag = new DocumentFragment()
    const newBtn = document.createElement("button")
    const newBtnLbl = document.createTextNode("[New]")
    newBtn.append(newBtnLbl)
    newBtn.onclick = (e) => { setRawVisible(false); focusChat() }

    frag.append(newBtn)

    let copiedNodes = []
    for(let n of queryDocument.children) {
      copiedNodes.push(document.importNode(n, true))
    }
    copiedNodes.forEach(n => frag.append(n))

    rawRoot.replaceChildren(frag)
  }

  const doRawRequest = async (payload) => {
    if(latestRequest) {
      const timeNow = new Date().getTime()
      const timeOld = latestRequest
      latestRequest = Math.max(new Date().getTime(), latestRequest) + SMALLEST_INTERVAL + SAFETY_MARGIN
      await new Promise(r => setTimeout(r, Math.max(0, (SMALLEST_INTERVAL + SAFETY_MARGIN) - (timeNow - timeOld))))
      latestRequest = new Date().getTime()
    }

    const rawResp = await fetch("party.cgi",
                        {
                          method: "POST",
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          body: new URLSearchParams(payload).toString()
                        })
    const respText = await rawResp.text()
    const parser = new DOMParser()

    const resp = parser.parseFromString(respText, "text/html")
    const raw = document.querySelector(".raw")
    if(raw) {
      updateRaw(raw, resp.body)
    }

    latestRequest = new Date().getTime()

    return resp
  }

  const doRequest = async (comment = "") => {
    const { id, pass } = JSON.parse(localStorage.getItem("heypartyCreds"))
    const fd = {}

    let brace = false
    if(comment.match(/@Proceed(\s+|$)/)) { brace = true } // hack the game does when proceeding... required to not receive the pre-proceed update.

    fd['id'] = id
    fd['pass'] = pass
    fd['reload_time'] = "0"
    fd['comment'] = comment

    let resp = await doRawRequest(fd)
    if(brace) {
      fd['comment'] = ""
      resp = await doRawRequest(fd)
    }

    return resp
  }

  const parseLogsChats = (messages) => {
    let chatMsgs = []
    let logMsgs = []

    messages.forEach(m => {
      const [speaker, text] = m.textContent.split(/：/, 2) // WARNING: THIS IS NOT IN FACT A COLON

      let words = text.split(/\s+/).filter(w => w.length > 0)
      const timestamp = words.slice(-2)
      words = words.slice(0, -2)
      let isOnlyCommands = false

      if(AGGRESSIVE_LOG_FILTER) {
        isOnlyCommands = speaker.match(/^@System$/) || m.querySelector("span,img") || m.textContent.match(/@([A-Z]|\$)[^\s]*/)
      } else {
        isOnlyCommands = speaker.match(/^@System$/) || m.querySelector("span,img")
                                  || (speaker[0] === '@' && (words.length > 0 && words[0][0] === '@'))
                                  || words.every(w => w[0] === "@" || w[0] === ">")
                                  || m.textContent.match(/[^\s]+\s*：\s*@[^\s]+\s+missed!\s+[^\s]+\s+dodged it!/)
                                  || m.textContent.match(/\s*[^\s]+\s*：\s*@Sleep(>[^\s]+)?\s+[^\s]+\s+crawled into bed!/)
                                  || m.textContent.match(/\s*[^\s]+\s*：\s*@Item(>[^\s]+)?\s+[^\s]+\s+used\s+[^\s]+?!/)
                                  || m.textContent.match(/@[^\s]+.*? However,\s+[^\s]+?\s+cannot move!/)
                                  || m.textContent.match(/@[^\s]+.*? is sleeping!/)
                                  || m.textContent.match(/@[^\s]+.*? woke up from their sleep!/)
                                  || m.textContent.match(/@[^\s]+.*? is paralyzed and unable to move!/)
                                  || m.textContent.match(/@[^\s]+.*It didn't seem to have any more effect on\s\+[^\s]+?\.\.\./)
      }

      if(isOnlyCommands) {
        logMsgs.push(m)
        return;
      }

      const isOnlySpeech = !words.some(w => w.match(/@([A-Z]|\$)[^\s]*/))
      if(isOnlySpeech) {
        chatMsgs.push(m)
        return;
      }

      chatMsgs.push(m)
      logMsgs.push(m)
    })

    return [logMsgs, chatMsgs]
  }

  const updateStateDisplays = () => {
    if(!PENDING_STATUS) { return; }

    const notice = document.querySelector(".pending-action")
    const commentNotice = document.querySelector(".pending-comment")
    if(!notice || !commentNotice) { return; }

    if(!queuedAction) {
      notice.innerHTML = ""
      notice.style.display = "none"
    } else {
      notice.innerHTML = "Pending: " + queuedAction.action
      notice.style.display = ""
    }

    if(queuedComments.length > 0) {
      commentNotice.innerHTML = `Comments:\n${queuedComments.join("\n")}`
      commentNotice.style.display = ""
    } else {
      commentNotice.innerHTML = ""
      commentNotice.style.display = "none"
    }
  }

  const queueAction = (action) => {
    focusChat()
    queuedAction = action
    updateStateDisplays()
  }

  const queueComment = (comment) => {
    focusChat()
    queuedComments.push(comment)
    updateStateDisplays()
  }

  const labelPending = (target) => {
    if((pendingRef?.value ?? "%>") === (target?.value ?? "%<")) {
      target.classList.add("pending")
    }
  }

  const resetPending = () => {
    pendingRef = undefined
    Array.from(document.querySelectorAll('.pending')).forEach(p => p.classList.remove('pending'))
  }

  const togglePending = (target) => {
    if(!performingAction) {
      Array.from(document.querySelectorAll('.pending')).forEach(p => p.classList.remove('pending'))

      if(pendingRef != target) {
        target.classList.add("pending")
        pendingRef = target
      } else {
        pendingRef = undefined
      }
    }
  }

  const createMenu = (from) => {
    const frag = new DocumentFragment()
    const node = document.importNode(from, true)
    Array.from(node.querySelectorAll('tr[onclick]')).forEach(r => {
      let action = r.onclick.toString().match(/text_set\('(.*?)'\)/)
      action = action ? action[1] : ""
      r.removeAttribute("onclick")
      r.onclick = e => { queueAction({ action: action, type: 'action' }); togglePending(e.target) }
      r.value = action
      labelPending(r)
      r.style.cursor = "pointer"
    })
    frag.replaceChildren(node)

    return frag
  }

  const createAltMenu = (froms) => {
    const frag = new DocumentFragment()

    froms.forEach(from => {
      const node = document.importNode(from, true)
      const actionString = node.onclick.toString().match(/text_set\((.*?)\)/)[1].slice(1, -1)
      node.className = "alt-action"
      node.removeAttribute("onclick")
      node.onclick = e => { queueAction({ action: actionString, type: 'action' }); togglePending(e.target); activeMenu = undefined; }
      node.value = actionString
      labelPending(node)

      frag.append(node)
    })

    return frag
  }

  const requestCombat = async (tbl) => {
    const fd = {}
    if(!tbl) { return }
    Array.from(tbl.querySelectorAll("input,select")).forEach(e => {
      if(e.name && e.name.length > 0) {
        fd[e.name] = e.value
      }
    })

    const { id, pass } = JSON.parse(localStorage.getItem("heypartyCreds")) ?? { id: "", pass: "" }

    fd['id'] = id
    fd['pass'] = pass
    fd['comment'] = tbl.querySelector('input[type="submit"]').value

    await doRawRequest(fd) // combat create is special and always requires an update...
    return await doRequest()
  }

  const inferCombatState = (resp) => {
      const bgImg = resp.querySelector('div[style^="background"]')?.style.background?.match(/url\("(.*?)"\)/)
      const atGuild = resp.querySelector(".mes img[alt^='Guild emblem']")
      const atHome = resp.querySelector(".mes").textContent.match(/【[^\s]+'s house】/)
      const maybeInDungeon = (!atHome && !atGuild && bgImg)? bgImg[1].match(/map\d+\..*/) : false
      const maybeInCombat = maybeInDungeon || ((!atHome && !atGuild && bgImg)? bgImg[1].match(/(stage|challenge)\d+\..*/) : false) // Assume all maps have the form typeX and hardcode types...
      return [maybeInCombat? true : false, maybeInDungeon? true : false] // transform the match/null into true/false...
  }

  const toggleEdit = () => {
    if(macrosEdit) {
      //macrosEdit = false
      document.querySelector(".btn-macros-edit-toggle").textContent = "Start Editing"
      //Array.from(document.querySelectorAll(".macros-edit-container")).forEach(k => k.style.display = "none")
      //document.querySelector(".btn-macros-add").style.display = "none"
    } else {
      macrosEdit = true
      document.querySelector(".btn-macros-edit-toggle").textContent = "Stop Editing"
      //document.querySelector(".btn-macros-add").style.display = "inherit"
      Array.from(document.querySelectorAll(".macros-edit-container")).forEach(k => k.style.display = "")
    }
  }

  const toggleMacros = () => {
    if(macrosVisible) {
      macrosVisible = false
      macrosEdit = true
      toggleEdit() // force to off with full hiding/handling
      Array.from(document.querySelectorAll(".btn-macros")).forEach(k => k.classList.add("macros-hidden"))
      //document.querySelector(".btn-macros-edit-toggle").style.display = "none"
      document.querySelector(".btn-macros-toggle").textContent = "Show Macros"
      document.querySelector(".btn-macros-add").style.display = "none"
    } else {
      macrosVisible = true
      macrosEdit = true
      toggleEdit()
      Array.from(document.querySelectorAll(".btn-macros")).forEach(k => k.classList.remove("macros-hidden"))
      document.querySelector(".btn-macros-toggle").textContent = "Hide Macros"
      //document.querySelector(".btn-macros-edit-toggle").style.display = "inherit"
      document.querySelector(".btn-macros-edit-toggle").textContent = "Start Editing"
      document.querySelector(".btn-macros-add").style.display = ""
      document.querySelector(".btn-macros-toggle").textContent = "Hide Macros"
    }
  }

  const createMacroButton = (k, i) => {
    const macroButton = document.createElement("button")

    macroButton.value = k
    macroButton.className = `btn-macros ${!macrosVisible? "macros-hidden" : ""}`
    const macroPre = document.createElement("pre")
    const macroLbl = document.createTextNode(k)
    macroPre.append(macroLbl)
    macroButton.append(macroPre)

    const editBtn = document.createElement("button")
    const delBtn = document.createElement("button")
    const delLbl = document.createTextNode("X")
    const editLbl = document.createTextNode("O")

    editBtn.append(editLbl)
    delBtn.append(delLbl)

    const macrosEditContainer = document.createElement("div")
    macrosEditContainer.append(editBtn)
    macrosEditContainer.append(delBtn)
    macrosEditContainer.className = "macros-edit-container"

    macrosEditContainer.style.display = macrosEdit? "inherit" : "none"

    editBtn.className = "btn-macros-edit"
    delBtn.className = "btn-macros-delete"

    const editForm = document.createElement("div")
    editForm.className = "macros-edit-form"

    const editField = document.createElement("input")
    editField.className = "macros-edit-field"
    editField.value = k
    const editOK = document.createElement("button")
    editOK.className = "macros-edit-ok"
    const editCancel = document.createElement("button")
    editCancel.className = "macros-edit-cancel"
    const okLbl = document.createTextNode("O")
    const cancelLbl = document.createTextNode("X")
    editCancel.append(cancelLbl)
    editOK.append(okLbl)

    editForm.style.display = "none"

    editForm.append(editField)
    editForm.append(editOK)
    editForm.append(editCancel)

    const macrosEditControls = document.createElement("div")
    macrosEditControls.append(macrosEditContainer)
    macrosEditControls.append(editForm)
    macrosEditControls.className = "macros-edit-controls"

    macroButton.append(macrosEditControls)

    editField.addEventListener("keypress",
                           (e) => {
                              if (e.key === "Enter") {
                                editOK.click()
                              }
                            })

    macroButton.addEventListener("keypress", e => { if(e.key === "Enter") { e.preventDefault(); } })

    editCancel.onclick = e => {
      macroButton.querySelector(".macros-edit-form").style.display = "none"
      macroButton.querySelector(".macros-edit-field").value = ""
    }

    editOK.onclick = e => {
      macroButton.querySelector(".macros-edit-form").style.display = "none"
      const edit = macroButton.querySelector(".macros-edit-field")
      if(edit?.value === "") {
        // pretend it's a cancel by default instead of deleting it...
      } else {
        chatMacros[i] = edit.value
        macroButton.querySelector("pre").textContent = edit.value
        macroButton.value = edit.value
      }
      localStorage.setItem("heypartyMacros", JSON.stringify(chatMacros))
    }

    delBtn.onclick = e => {
      chatMacros = chatMacros.filter(x => x !== k)
      localStorage.setItem("heypartyMacros", JSON.stringify(chatMacros))
      macroButton.remove()
    }

    editBtn.onclick = e => {
      macroButton.querySelector(".macros-edit-form").style.display = ""
      editField.focus()
    }

    macroButton.onclick = e => { if(e.target == macroButton || e.target == macroPre) { const chatField = document.querySelector(".ipt-chat"); chatField.value += macroButton.value; focusChat() } }
    macroButton.style.cursor = "pointer"

    return macroButton
  }

  const updateElement = (queryDocument, elt, div) => {
    if(!queryDocument.querySelector(".mes").nextSibling) { return }
    if(!div) { return }
    switch(elt) {
      case "status":
        const statusFrag = new DocumentFragment()
        const rawMes = queryDocument.querySelector(".mes:not(.status)")

        const [combatStatus, dungeonStatus] = inferCombatState(queryDocument)
        // setting directly by destructuring does not work and will instead replace
        // the value of rawMes...
        inCombat = combatStatus
        inDungeon = dungeonStatus

        const extraStatus = queryDocument.querySelector(".strong:not(.menu-container)")
        const extraStatusIsMenu = extraStatus?.querySelector(".table1,.view")
        const altExtraStatusIsMenu = extraStatus?.querySelector(":not(.view) span[onclick]")

        let copiedMes = []
        for(let n of rawMes.childNodes ?? []) {
          copiedMes.push(document.importNode(n, true))
        }
        copiedMes.forEach(n => statusFrag.append(n))

        if(extraStatus && !extraStatusIsMenu && !altExtraStatusIsMenu) {
          const thisStatus = document.importNode(extraStatus, true)
          statusFrag.append(thisStatus)
          lastExtraStatus = thisStatus
        } else if(!extraStatus && lastExtraStatus) {
          statusFrag.append(lastExtraStatus)
          lastExtraStatus = undefined
        }

        const notice = document.createElement("pre")
        notice.className = "pending-action"
        const commentNotice = document.createElement("pre")
        commentNotice.className = "pending-comment"
        const updateNotice = document.createElement("div")
        updateNotice.className = "update-notice-container"
        const updateNoticePre = document.createElement("pre")
        updateNoticePre.className = "update-notice"
        const updateNoticeText = document.createTextNode("Next update: now")
        updateNoticePre.append(updateNoticeText)
        updateNotice.append(updateNoticePre)

        // The following two elements are required for the hijacked original functions to run...
        updateNotice.append(document.importNode(queryDocument.querySelector("#gage_back1")))
        const nokoriDiv = document.createElement("div")
        nokoriDiv.style.display = "none"
        nokoriDiv.id = "nokori_auto_time"
        updateNotice.append(nokoriDiv)

        statusFrag.append(notice)
        statusFrag.append(commentNotice)
        statusFrag.append(updateNotice)
        div.replaceChildren(statusFrag)
        div.classList.add("mes")

        updateState(queryDocument)
        updateStateDisplays()

        break;
      case "room":
        const roomFrag = new DocumentFragment()
        let rawRoom = queryDocument.querySelector(".view") // party view OR screenshot view!!
        let isScreenshot = undefined
        if(queryDocument.querySelector(".strong .view")) {
          isScreenshot = document.importNode(rawRoom, true)
          rawRoom = undefined
          // It's actually the screenshot room
        }
        if(rawRoom) {
          const roomView = document.importNode(rawRoom, true)
          Array.from(roomView.querySelectorAll("span[onclick]")).forEach(span => {
            const maybeActionType = span.onclick.toString().match(/text_set\('(.*?)'\)/)
            const actionType = maybeActionType? maybeActionType[1] : ""
            span.removeAttribute("onclick")
            span.style.cursor = "pointer"
            span.onclick = e => { queueAction({ action: actionType, type: 'action' }); pendingRef = e.target }
          })
          roomFrag.append(roomView)
          const room = document.importNode(rawRoom.nextSibling, true)
          room.classList.add("room")
          roomFrag.append(room) // actual room display
        } else {
          const combatRoom = queryDocument.querySelector(".mes").nextSibling
          const room = document.importNode(combatRoom, true)
          room.classList.add("room")
          roomFrag.append(room) // actual room display
        }

        const createMenuItem = (s, a) => {
          const menuItem = document.createElement("div")
          menuItem.className = "selectable-menu-item"
          const txt = document.createTextNode(a)
          menuItem.append(txt)
          menuItem.value = a + s.onclick.toString().match(/text_set\((.*?)\)/)[1].slice(1, -2)
          menuItem.removeAttribute("onclick")
          menuItem.onclick = (e) => {
            queueAction({ action: e.target.value, type: 'action' })
            togglePending(e.target)
          }
          labelPending(menuItem)
          return menuItem
        }

        if(roomFrag.lastChild && roomFrag.lastChild.querySelector && !isScreenshot) {
          const maybeSelectable = roomFrag.lastChild.querySelector("table")
          if(maybeSelectable) {
            const selectables = maybeSelectable.querySelectorAll("td[onclick]")
            selectables.forEach(s => {
              s.className = "selectable"
              const menu = document.createElement("div")

              menu.className = "selectable-menu"
              menu.style.display = "none"

              currentActions.forEach(a => {
                if((inCombat && !specialActions.some(act => act === a) && !ordinaryActions.some(act => act === a) && !untargetedCombatActions.some(act => act === a))
                   || targetedActions.some(act => act === a)) {
                    const menuItem = createMenuItem(s, a)
                    menu.append(menuItem)
                }
              })

              menu.onclick = e => {
                if(menuVisible) {
                  e.stopPropagation()
                  menuVisible = false
                  menu.style.display = "none"
                }
              }

              /*if(SHOW_SECRETS) {
                secretActions.forEach(a => {
                  if(!inCombat) {
                    const menuItem = createMenuItem(s, a)
                    menu.append(menuItem)
                  }
                })
              }*/

              s.removeAttribute("onclick")
              s.style.cursor = "pointer"
              s.onclick = e => {
                if(!menuVisible) {
                  e.stopPropagation()
                  menuVisible = s.querySelector("img[alt]").alt
                  menu.style.display = ""
                }
              }
              s.append(menu)
            })
          }
        }

        let newVisible = false
        Array.from(roomFrag.querySelectorAll(".selectable")).forEach(s => {
          if(s.querySelector("img[alt]").alt === menuVisible) {
            s.querySelector(".selectable-menu").style.display = ""
            newVisible = menuVisible
          }
        })
        menuVisible = newVisible
        div.replaceChildren(roomFrag)
        break;
      case "chatbox":
        const chatboxFrag = new DocumentFragment()

        const chatLayout = document.createElement("div")
        chatLayout.className = "chat-layout"

        const chatField = document.createElement("input")
        chatField.type = "text"
        chatField.className = "ipt-chat"

        const chatSend = document.createElement("button")
        chatSend.className = "btn-send"
        chatSend.append(document.createTextNode("Send"))
        chatSend.onclick = (e) => {
          if(chatField.value.match(/@[^\s]+(\s+|$|>)/)) {
            queueAction({ action: chatField.value, type: 'literal' })
            pendingRef = chatField
          } else {
            queueComment(chatField.value)
          }

          chatField.value = ""
        }

        chatField.addEventListener("keypress",
                                   (e) => {
                                            if (e.key === "Enter") {
                                              chatSend.click()
                                            }
        })

        const macrosLayout = new DocumentFragment()

        if(!MACROS_DISABLED) {
          const macrosToggle = document.createElement("button")
          macrosToggle.onclick = e => { toggleMacros(); focusChat() }
          const toggleLbl = document.createTextNode(`${macrosVisible? "Hide ": "Show "} Macros`)
          macrosToggle.append(toggleLbl)
          macrosToggle.className = "btn-macros-toggle"

          const editToggle = document.createElement("button")
          editToggle.onclick = e => { toggleEdit(); focusChat() }
          const editLbl = document.createTextNode(`${macrosEdit? "Stop ": "Start "} Editing`)
          editToggle.append(editLbl)
          editToggle.className = "btn-macros-edit-toggle"
          //XXX
          editToggle.style.display = "none"

          const newBtn = document.createElement("button")
          //newBtn.style.display = macrosEdit? "" : "none"
          newBtn.onclick = e => {
            chatMacros.push("...")
            const btn = createMacroButton("", chatMacros.length-1)
            btn.querySelector("pre").textContent = "..."

            const cancelEditBtn = btn.querySelector(".macros-edit-cancel")
            const prevOnclick = cancelEditBtn.onclick
            cancelEditBtn.onclick = e => {
              prevOnclick(e)
              chatMacros = chatMacros.slice(0, -1)
              btn.remove()
            }
            const okEditBtn = btn.querySelector(".macros-edit-ok")
            const prevOK = okEditBtn.onclick
            const edit = btn.querySelector(".macros-edit-field")

            okEditBtn.onclick = e => {
              cancelEditBtn.onclick = prevOnclick
              okEditBtn.onclick = prevOK

              if(edit?.value === "") {
                chatMacros.splice(chatMacros.length-1, 1)
                btn.remove()
              } else {
                prevOK(e)
              }
            }

            document.querySelector(".macros-btn-container").append(btn)
            btn.querySelector(".btn-macros-edit").click()
          }

          const newBtnLbl = document.createTextNode("Add")
          newBtn.append(newBtnLbl)
          newBtn.className = "btn-macros-add"
          newBtn.style.display = macrosVisible? "" : "none" //XXX

          const macrosBase = document.createElement("div")
          macrosBase.className = "macros-container"

          const btnContainer = document.createElement("div")
          btnContainer.className = "macros-controls-container"

          btnContainer.append(macrosToggle)
          btnContainer.append(editToggle)
          btnContainer.append(newBtn)

          macrosBase.append(btnContainer)

          const macrosBtnContainer = document.createElement("div")
          macrosBtnContainer.className = "macros-btn-container"

          chatMacros.forEach((k, i) => {
            const macroButton = createMacroButton(k, i)
            macrosBtnContainer.append(macroButton)
          })

          macrosBase.append(macrosBtnContainer)

          macrosLayout.replaceChildren(macrosBase)
        }

        chatLayout.append(chatField)
        chatLayout.append(chatSend)

        chatLayout.append(macrosLayout)

        chatboxFrag.append(chatLayout)

        div.replaceChildren(chatboxFrag)

        focusChat()

        break;
      case "controls":
        const controlsFrag = new DocumentFragment()

        const actions = queryDocument.querySelectorAll(".actionLink")
        const actionsLayout = document.createElement("div")
        actionsLayout.className = 'actions-layout'

        let currentTrack = document.createElement("div")
        currentTrack.className = "action-track"
        actionsLayout.append(currentTrack)

        currentActions = []

        actions.forEach(a => {
          if((a.previousSibling?.nodeName ?? "") === "BR") {
            currentTrack = document.createElement("div")
            currentTrack.className = "action-track"
            actionsLayout.append(currentTrack)
          }

          const btn = document.createElement("button")
          btn.onclick = (e) => { queueAction({ action: e.target.value, type: 'action' }); togglePending(e.target); }
          btn.value = a.textContent
          const lbl = document.createTextNode(btn.value)

          currentActions.push(btn.value)

          btn.append(lbl)
          btn.className = 'btn-action'

          labelPending(btn)

          currentTrack.append(btn)
        })

        if(SHOW_SECRETS && !inCombat) {
          currentTrack = document.createElement("div")
          currentTrack.className = "action-track"
          actionsLayout.append(currentTrack)

          secretActions.forEach(a => {
            const btn = document.createElement("button")
            btn.onclick = (e) => { queueAction({ action: e.target.value, type: 'action' }); togglePending(e.target); }
            btn.value = a
            const lbl = document.createTextNode(btn.value)

            currentActions.push(btn.value)

            btn.append(lbl)
            btn.className = 'btn-action'

            labelPending(btn)

            currentTrack.append(btn)
          })
        }

        currentTrack = document.createElement("div")
        currentTrack.className = "action-track"
        actionsLayout.append(currentTrack)

        if(inCombat) {
          extraCombatActions.forEach(a => {
            const combatBtn = document.createElement("button")
            combatBtn.onclick = (e) => { queueAction({ action: a, type: 'action' }); togglePending(e.target); }
            combatBtn.value = a
            const combatLbl = document.createTextNode(a)
            currentActions.push(a)

            combatBtn.append(combatLbl)
            combatBtn.className = 'btn-action'

            labelPending(combatBtn)

            currentTrack.append(combatBtn)
          })

          currentTrack = document.createElement("div")
          currentTrack.className = "action-track"
          actionsLayout.append(currentTrack)
        }

        if(inDungeon) {
          const glyphs = { "@North": "^", "@South": "v", "@East": ">", "@West": "<" }
          const positions = { "@North": [1, 2], "@South": [3, 2], "@East": [2, 3], "@West": [2, 1]}
          const dirLayout = document.createElement("div")
          dirLayout.className = "dir-container"
          Object.keys(glyphs).forEach(dir => {
            const btn = document.createElement("button")
            btn.className = "btn-dir"
            const btnLbl = document.createTextNode(glyphs[dir])
            btn.append(btnLbl)
            btn.onclick = e => { queueAction({ action: dir, type: 'action' }); pendingRef = e.target }
            btn.style['grid-row-start'] = positions[dir][0]
            btn.style['grid-column-start'] = positions[dir][1]
            dirLayout.append(btn)
          })

          currentTrack.append(dirLayout)

          currentTrack = document.createElement("div")
          currentTrack.className = "action-track"
          actionsLayout.append(currentTrack)
        }

        const rawBtn = document.createElement("button")
        const rawBtnLbl = document.createTextNode("[Original]")

        rawBtn.className = "btn-raw"
        rawBtn.append(rawBtnLbl)

        rawBtn.onclick = (e) => { setRawVisible(true); focusChat() }

        currentTrack.append(rawBtn)

        controlsFrag.append(actionsLayout)
        div.replaceChildren(controlsFrag)

        break;
      case "text-layout":
        const textFrag = new DocumentFragment()
        let chatDiv = undefined

        if(!COMBINED_CHATLOG) {
          chatDiv = document.createElement("div")
          chatDiv.className = "chat"
          const chatHeader = document.createElement("div")
          chatHeader.className = "chat-header"
          const chatLbl = document.createTextNode("Chat")
          chatHeader.append(chatLbl)
          chatDiv.append(chatHeader)

          textFrag.append(chatDiv)
        }

        const logDiv = document.createElement("div")
        logDiv.className = "log"
        const logHeader = document.createElement("div")
        logHeader.className = "log-header"
        const logLbl = document.createTextNode("Log")
        logHeader.append(logLbl)
        logDiv.append(logHeader)

        textFrag.append(logDiv)

        if(!COMBINED_CHATLOG) {
          const [logs, chats] = parseLogsChats(queryDocument.querySelectorAll(".message"))

          chats.forEach(cq => {
            const c = document.importNode(cq, true)
            const chatCard = document.createElement("div")
            chatCard.className = "message-card"
            chatCard.append(c)
            chatDiv.append(chatCard)
          })
          logs.forEach(cq => {
            const c = document.importNode(cq, true)
            const logCard = document.createElement("div")
            logCard.className = "log-card"
            logCard.append(c)
            logDiv.append(logCard)
          })
        } else {
          queryDocument.querySelectorAll(".message").forEach(cq => {
            const c = document.importNode(cq, true)
            const logCard = document.createElement("div")
            logCard.className = "log-card"
            logCard.append(c)
            logDiv.append(logCard)
          })
        }

        div.replaceChildren(textFrag)

        break;

      case "menu":
        const extra = queryDocument.querySelector(".strong:not(.menu-container)")
        const extraStatusMenu = extra?.querySelectorAll(".table1,.view")
        const altExtraStatusMenu = extra?.querySelectorAll(":not(.view) span[onclick]")

        const invalid = extra?.textContent.includes("Go to") // Game does a hack with a never-seen intermediate page with this text in the menu section

        const menuFrag = new DocumentFragment()

        if((invalid || (altExtraStatusMenu?.length ?? 0) === 0) && (!extraStatusMenu || extraStatusMenu.length === 0)) {
          if(activeMenu) {
            menuFrag.replaceChildren(activeMenu)
          }
          div.replaceChildren(menuFrag)
          return
        }


        const bScreenshot = extra.querySelector(".view")

        if(extraStatusMenu && extraStatusMenu.length > 0) {
          if(!bScreenshot && extraStatusMenu.length > 1) {
            let menus = []

            const sel = document.createElement("select")

            menuFrag.append(sel)

            extraStatusMenu.forEach((e, i) => {
              const o = document.createElement("option")
              const submitMenu = e.querySelector('input[type="submit"]')?.value
              if(submitMenu) {
                o.value = submitMenu
              } else {
                o.value = `Menu ${i+1}`
              }

              const optionLbl = document.createTextNode(o.value)
              o.append(optionLbl)
              sel.append(o)

              const menuDiv = document.createElement("div")
              menuDiv.className = "menu-container"

              menuDiv.replaceChildren(createMenu(e))

              const partyData = JSON.parse(localStorage.getItem("heypartyParties")) ?? {}
              const thisPartyData = (partyData && partyData[submitMenu]) ?? Object.fromEntries([[submitMenu, {}]])
              partyData[submitMenu] = thisPartyData

              for(let [k, v] of Object.entries(thisPartyData)) {
                const maybeParty = menuDiv.querySelector(`.text_box1[name="${k}"],.select1[name="${k}"]`)
                if(maybeParty) {
                  maybeParty.value = thisPartyData[k] ?? ""
                }
              }

              const menuSubmitButton = menuDiv.querySelector('input[type="submit"]')
              const partyField = menuDiv.querySelector('.text_box1[name="p_name"]')

              if(partyField) {
                partyField.addEventListener("keypress",
                             (e) => {
                                      if (e.key === "Enter") {
                                        menuSubmitButton.click()
                                      }
                })
              }

              if(partyField && menuSubmitButton) {
                menuSubmitButton.onclick = async (evt) => {
                  evt.preventDefault()
                  activeMenu = undefined // close the menu

                  Array.from(menuDiv.querySelectorAll('.text_box1[name],.select1[name]')).forEach(e => partyData[submitMenu][e.name] = e.value)
                  localStorage.setItem("heypartyParties", JSON.stringify(partyData))

                  const resp = await requestCombat(menuDiv.querySelector(".table1"))
                  const [maybeInCombat, maybeInDungeon] = inferCombatState(resp)
                  if(resp && maybeInCombat) { // success
                    await doRequest() // create update, i.e. enter the quest
                    for(let elt of allElts) {
                      updateElement(resp, elt, document.querySelector("." + elt))
                    }
                  } else {
                    // failure, "error" status will need an update
                    updateElement(resp, "status", document.querySelector(".status"))
                    updateElement(resp, "menu", document.querySelector(".menu"))
                  }
                }
              }

              menus[o.value] = menuDiv

              menuFrag.append(menuDiv)
            })

            sel.onchange = (e) => {
              Array.from(Object.entries(menus)).forEach(([k,div]) => div.style.display = "none")
              menus[e.target.value].style.display = ""
            }

            sel.selectedIndex = 0

            sel.dispatchEvent(new Event("change"))

            doAction = true

          } else if(!bScreenshot && extraStatusMenu) {
            const menuDiv = document.createElement("div")
            menuDiv.className = "menu-container"

            menuDiv.replaceChildren(createMenu(extraStatusMenu[0]))

            menuFrag.append(menuDiv)
          } else if(bScreenshot) {
            let menus = []

            activeMenu = undefined

            const sel = document.createElement("select")
            menuFrag.append(sel)

            const scView = extra.querySelector(".view")

            Array.from(scView.querySelectorAll("span[onclick]")).forEach((e, i) => {
              const o = document.createElement("option")
              o.value = `Screenshot ${i+1}`

              const optionLbl = document.createTextNode(o.value)
              o.append(optionLbl)
              sel.append(o)

              const menuDiv = document.createElement("div")
              menuDiv.className = "menu-container"

              const screenshot = document.importNode(e, true)

              const action = screenshot.onclick.toString().match(/text_set\('(.*?)'\)/)[1]
              screenshot.removeAttribute('onclick')
              screenshot.onclick = e => { const chat = document.querySelector(".ipt-chat"); if(chat) { chat.value = action; }; }
              screenshot.style.cursor = "pointer";

              menuDiv.replaceChildren(screenshot)
              menus[o.value] = menuDiv

              menuFrag.append(menuDiv)
            })

            sel.onchange = (e) => {
              Array.from(Object.entries(menus)).forEach(([k,div]) => div.style.display = "none")
              menus[e.target.value].style.display = ""
            }

            sel.selectedIndex = 0

            sel.dispatchEvent(new Event("change"))
          }

          activeMenu = document.importNode(menuFrag, true)
          div.replaceChildren(menuFrag)

          doAction = true
        } else if(!bScreenshot && (altExtraStatusMenu?.length ?? 0) !== 0) {
          const menuDiv = document.createElement("div")
          menuDiv.className = "menu-container strong"
          const altMenu = createAltMenu(altExtraStatusMenu)
          menuDiv.append(document.importNode(extra.childNodes[0])) // text caption for the action
          menuDiv.append(document.createElement("br"))
          const actualMenuDiv = document.createElement("div")
          actualMenuDiv.className = "alt-menu"
          actualMenuDiv.append(altMenu)
          menuDiv.append(actualMenuDiv)

          menuFrag.append(menuDiv)

          activeMenu = document.importNode(menuFrag, true)
          div.replaceChildren(menuFrag)

          doAction = true
        }
      break;
    }
  }

  let updateElements = (resp, which) => {
    for(let elt of (which ?? allUpdateableElts)) {
      updateElement(resp, elt, document.querySelector("." + elt))
    }
  }

  const handleAction = async () => {
    if(!queuedAction) { return }
    let { action, type } = queuedAction

    let disableOrdinaryHandling = false

    lastExtraStatus = undefined
    activeMenu = undefined

    let trueAction = action.match(/.*?(@.+?)(\s+|$|>)/)
    let actionIsTargeted = action.match(/.*?(>.+?)(\s+|$|@)/)

    queuedAction = undefined
    if(trueAction) {
      trueAction = trueAction[1]
    }

    if(actionIsTargeted) {
      if(specialActionsWhenTargeted.some(a => a === trueAction)) {
        let unhandled = false;
        switch(trueAction) {
          case "@Move":
          case "@Party":
          case "@Dungeon":
          case "@GuildBattle":
          case "@Challenge":
          case "@Arena":
          case "@Join":
          case "@Spectate":
            await doRequest(action)
            const resp = await doRequest() // update page after the action that requires double-updates
            activeMenu = undefined
            updateElements(resp)
            break;

          case "@Send":
          case "@GiveName":
            disableOrdinaryHandling = true
            unhandled = true
            break;

          default:
            unhandled = true;
        }

        if(!unhandled) {
          return
        }
      }
    }

    if(specialActions.some(a => a === trueAction)) {
      let unhandled = false;
      let resp = undefined;

      switch(trueAction) {
        // These actions will disable updates and show the raw page (with a special button to cancel)
        case "@Invite":
        case "@MonsterBook":
        case "@Profile":
        case "@ItemEncyclopedia":
        case "@JobMastery":
          await doRequest(action)
          const specResp = await doRequest()

          const oldBody = new DocumentFragment()
          Array.from(document.querySelector(".raw").children).forEach(c => oldBody.append(c))

          document.querySelector(".raw").replaceChildren(document.importNode(specResp.body, true))

          const backButton = document.createElement("button")
          backButton.className = "btn-back-from-special"
          const backButtonLbl = document.createTextNode("[Back]")
          backButton.append(backButtonLbl)
          backButton.onclick = e => { raw.replaceChildren(oldBody); setRawVisible(false); focusChat() }

          const raw = document.querySelector(".raw")

          raw.querySelector("input[value='Return']")?.remove() // remove the 'return' button that goes back to the raw page
          raw.insertBefore(backButton, raw.firstChild)

          setRawVisible(true)
          break;

        // These actions function normally, but require double updates to properly progress
        // This is either to skip the "useless" "@X -> you did X! [Next]" screen,
        // or for those that have 'transitory states' that are never actually seen in the original UI
        // because they automatically generate a 2nd update...
        case "@Home":
        case "@RunAway":
        case "@Sleep":
        case "@Proceed":
        case "@Guild":

        case "@North":
        case "@South":
        case "@East":
        case "@West":

        case "@BlackMarket":
        case "@SecretShop":
          await doRequest(action)
          resp = await doRequest() // update page after the action that requires double-updates
          updateElements(resp)
          break;

        case "@Logout":
          window.location.href = '/party2/index.cgi'
          break;

        // These actions simply disable updates until canceled.
        case "@ReadLetter":
          updatesEnabled = false

          resp = await doRequest(action)
          updateElements(resp)

          const endButton = document.createElement("button")
          endButton.className = "btn-back-from-special"
          const endButtonLbl = document.createTextNode("[Back]")
          endButton.append(endButtonLbl)
          endButton.onclick = async (e) => { updatesEnabled = true; const resp = await doRequest(); updateElements(resp); e.target.remove() }

          const statusMenu = document.querySelector(".menu-container.strong")
          statusMenu.lastElementChild.after(endButton)

          break;

        default:
          unhandled = true
          break;
      }

      if(!unhandled) {
        return
      }
    }

    // Assume all non-listed moves are skills while we are in combat...
    if((inCombat && (!unhandledCombatActions.some(a => a === trueAction) && trueAction[1] !== 'x')) || (!inCombat && ordinaryActions.some(a => a === trueAction) && !disableOrdinaryHandling)) {
      let resp = await doRequest(action)
      if(inCombat) {
        resp = await doRequest()
        // Killing an enemy immediately moves to the "map view" (in @Dungeons) or the post-combat 'state'
        // so we have to account for that in combat states
      }
      updateElements(resp)
      return
    }

    // Special override for arithmetician skill part 2
    if(inCombat && trueAction[1] == 'x') {
      const textField = document.querySelector('.ipt-chat')
      let resp = await doRequest(textField.value + action)
      textField.value = ''
      updateElements(resp)
      return
    }

    if(type === "literal") {
      const resp = await doRequest(action)
      updateElements(resp)
      return
    }

    const chatBox = document.querySelector(".ipt-chat")
    if(chatBox) {
      chatBox.value = action
      focusChat(true)
    }
  }

  const tickFunction = async () => {
    const root = document.querySelector(".heyparty")

    if(ticking || !root) { return; } // waiting for override() to get called

    ticking = true

    let doUpdate = false

    const currTime = new Date().getTime()

    if(prevTime) {
      if(currTime - prevTime < TICK_INTERVAL) {
        ticking = false
        return
      } else if(currTime - (prevUpdateTime ?? 0) >= UPDATE_INTERVAL + SAFETY_MARGIN) {
        if(!sleepTimer) { // don't do updates when we're asleep
          doUpdate = true
        }
      }
    }

    if(doAction && gaugeDone && queuedAction && pendingRef) {
      await new Promise(r => setTimeout(r, 2*SAFETY_MARGIN))
      performingAction = true
      await handleAction()
      resetPending()
      focusChat()
      prevUpdateTime = new Date().getTime()
      performingAction = false
    } else if(queuedComments.length > 0 && (!prevCommentTime || (currTime - prevCommentTime >= COMMENT_INTERVAL + SAFETY_MARGIN))) {
      const comment = queuedComments.shift()
      const resp = await doRequest(comment)
      updateElements(resp, ["status", "text-layout", "controls", "room"])
      prevCommentTime = new Date().getTime()
      prevUpdateTime = new Date().getTime()
    } else if(doUpdate && updatesEnabled) {
        const resp = await doRequest()
        updateElements(resp, ["text-layout", "controls", "room", "status"])
        prevUpdateTime = new Date().getTime()
    }

    prevTime = new Date().getTime()

    ticking = false
  }

  const override = async () => {
    const myRoot = document.createElement("div")
    myRoot.className = "heyparty"

    myRoot.addEventListener('click', e => {
                                            if(menuVisible) {
                                              if(!myRoot.querySelector(".selectable-menu-item:hover")) {
                                                e.stopPropagation()
                                                Array.from(myRoot.querySelectorAll(".selectable-menu:not([style^='display: none'])")).forEach(m => m.style.display = 'none')
                                                menuVisible = false
                                              }
                                              focusChat()
                                            }
                                          },
                            true) // true for capture

    const hey = document.createElement("div")
    hey.className = "hey"

    // STYLE STYLE STYLE
    const myRootStyle = document.createElement("style")
    const styleContents = document.createTextNode(`
                            .hey {

                            }

                            .raw {

                            }

                            .macros-edit-controls {
                              position: absolute;
                              display: inline;
                            }

                            .macros-edit-form {
                              position: absolute;
                              display: flex;
                              flex-direction: row;
                              z-index: 2;
                            }

                            .macros-edit-container {
                              z-index: 1;
                              display: inline;
                              position: absolute;
                            }

                            .btn-macros:not(:hover) .macros-edit-controls {
                              display: none;
                            }

                            .btn-macros:hover .macros-edit-controls {
                              display: flex;
                            }

                            .macros-controls-container {
                              display: flex;
                              flex-direction: column;
                              width: fit-content;
                            }

                            .macros-edit-controls {
                            }

                            .macros-edit-container {
                              display: flex;
                              flex-direction: row;
                            }

                            .macros-container {
                              display: flex;
                              flex-direction: row;
                              overflow: auto;
                              align-items: center;
                            }

                            .btn-send {
                              height: min-content;
                            }

                            .ipt-chat {
                              height: min-content;
                              border: 0 none transparent;
                            }

                            .ipt-chat:focus {
                              border: 0 none transparent;
                              outline: 0 none;
                            }

                            .btn-macros {
                              display: inline;
                              visibility: visible;
                              background: none;
                              border: none;
                              color: white;
                              margin-left: 10px;
                            }

                            .btn-macros-toggle {
                              margin-left: 10px;
                              margin-right: 10px;
                              height: min-content;
                              text-align: center;
                            }

                            .btn-macros-edit-toggle {
                              margin-left: 10px;
                              margin-right: 10px;
                              height: min-content;
                              text-align: center;
                            }

                            .btn-macros-add {
                              height: min-content;
                              margin-left: 10px;
                              margin-right: 10px;
                              text-align: center;
                            }

                            .macros-hidden {
                              visibility: hidden;
                            }

                            .dir-container {
                              display: grid;
                              grid-template-columns: 1fr 1fr 1fr;
                              grid-template-rows: 1fr 1fr 1fr;
                              max-width: 128px;
                              max-height: 128px;
                            }

                            .chat-layout {
                              display: flex;
                              flex-direction: row;
                              align-items: center;
                            }

                            .actions-layout {
                              display: flex;
                              max-width: 50%;
                              justify-items: start;
                              flex-direction: column;
                              overflow: visible;
                            }

                            .action-track {
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            overflow: visible;
                            }

                            .pending {
                            background: #666 !important;
                            }

                            .chat {
                            display: inline-block;
                            padding-left: 10px;
                            padding-right: 10px;
                            width: 40%;
                            }

                            .log {
                            display: inline-block;
                            padding-left: 10px;
                            padding-right: 10px;
                            width: 40%;
                            }

                            .text-layout {
                            display: flex;
                            flex-direction: row;
                            align-items: start;
                            }

                            .room {
                            z-index: 0;
                            }

                            .selectable-menu {
                              position: absolute;
                              display: inline;
                              z-index: 1;
                              background: #336;
                              border: 1px white solid;
                            }

                            .selectable-menu-item:hover {
                              background: #666;
                              cursor: pointer;
                            }

                            .menu-container {
                              height: fit-content;
                              overflow: auto;
                            }

                            .btn-action {
                            border: none;
                            background: none;
                            color: white;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 1em;
                            }

                            .chat-header {
                            margin-top: 0.5em;
                            margin-bottom: 0.5em;
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: white;
                            border-style: dashed none dashed none;
                            }

                            .log-header {
                            margin-top: 0.5em;
                            margin-bottom: 0.5em;
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: white;
                            border-style: dashed none dashed none;
                            }

                            .alt-menu {
                              display: flex;
                              flex-direction: row;
                              justify-content: start;
                              text-align: left;
                              align-items: flex-start;
                              flex-wrap: wrap;
                              max-width: 512px;
                            }

                            .alt-action {
                              margin-left: 3px;
                              margin-right: 3px;
                              margin-top: 3px;
                              margin-bottom: 3px;
                              cursor: pointer;
                            }
                            `)
    myRootStyle.append(styleContents)

    let allEltsDiv = []

    for(let elt of displayElts) {
      const div = document.createElement("div")
      div.className = elt
      allEltsDiv.push(div)
    }

    allEltsDiv.forEach(div => hey.append(div))

    for(let idx in allElts) {
      updateElement(document, allElts[idx], allEltsDiv[displayElts.indexOf(allElts[idx])])
    }

    const rawRoot = document.createElement("div")

    rawRoot.className = "raw"
    rawRoot.style.display = "none"

    myRoot.append(hey)
    myRoot.append(rawRoot)

    const myBody = document.createElement("body")
    myBody.append(myRoot)

    const form = document.querySelector("#form")
    const id = form.id.value
    const pass = form.pass.value

    localStorage.setItem("heypartyCreds", JSON.stringify({ id, pass }))

    updateRaw(rawRoot, document.body)

    document.body = myBody
    document.head.append(myRootStyle)

    window.count_down = (nowTs) => {
      origCD(nowTs)
    }

    window.wake_time = (nowTs) => { }

    window.active_gage = (nowTs, targetTs) => {
      const up = document.querySelector(".update-notice")
      if(nowTs > 0) {
        gaugeEngaged = true
        up.innerHTML = ("Next update: " + (nowTs) + "s")

        gaugeDone = false
        doAction = false
      }
      if(nowTs === 0) {
        gaugeEngaged = false
        up.innerHTML = "Next update: now"

        gaugeDone = true
        doAction = true
      }

      origGage(nowTs, targetTs)
    }

    setRawVisible(rawVisible)

    if(tickInterval) {
      clearInterval(tickInterval)
      tickInterval = undefined
    }
    if(!tickInterval) {
      tickInterval = setInterval(tickFunction, TICK_INTERVAL)
    }
  }

  if(!document.querySelector(".heyparty")) {
    await override()
  }
}

retryTimeout = setTimeout(main, SMALLEST_INTERVAL + SAFETY_MARGIN)