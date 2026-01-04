// ==UserScript==
// @name         Battle macros
// @version      2025-06-26
// @description  Use skills in a specific order by pressing less buttons.
// @author       Lulu5239
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/1449836
// @downloadURL https://update.greasyfork.org/scripts/533272/Battle%20macros.user.js
// @updateURL https://update.greasyfork.org/scripts/533272/Battle%20macros.meta.js
// ==/UserScript==

let click = (e, crect)=>{
  let rect = e.getBoundingClientRect()
  if(!["x","y","width","height"].find(k=>rect[k])){rect = crect}
  return $(e).trigger($.Event("tap",{
    target:e, currentTarget:e,
    x:rect && Math.floor(rect.x+rect.width*(0.5+(Math.random()*Math.random()*Math.sign(Math.random()-0.5)/2))),
    y:rect && Math.floor(rect.y+rect.height*(0.5+(Math.random()*Math.random()*Math.sign(Math.random()-0.5)/2))),
  }))
}
let recordFunction; let recordable
let cancel = 0
let farmingQuest
let lastHandledPage; let stageObserver
let waitingForSkillEnd = []
waitingForSkillEnd[0] = new Promise((ok, err)=>{
  waitingForSkillEnd[1] = ok
  waitingForSkillEnd[2] = err
})
let originalUnloader; let reloadables = {}

let onPage = async ()=>{
  if(document.location.hash===lastHandledPage){return}
  if(document.location.hash?.startsWith("#result") && farmingQuest){
    lastHandledPage = document.location.hash
    let autoQuests = GM_getValue("autoQuests")
    let settings = autoQuests[farmingQuest]
    if(settings.max===0){return}
    if(settings.max>0){
      settings.max--
      GM_setValue("autoQuests", autoQuests)
    }
    await new Promise(ok=>setTimeout(ok,5000))
    document.location.href = document.location.href.slice(0, document.location.href.indexOf("#")) + `#quest/supporter/${farmingQuest}/0`
  return}
  if(document.location.hash?.startsWith("#quest/supporter/"+farmingQuest) && farmingQuest){
    lastHandledPage = document.location.hash
    while(!document.querySelector(".se-quest-start")){await new Promise(ok=>setTimeout(ok,100))}
    click(document.querySelector(".se-quest-start"))
    let p = document.location.hash
    let button
    while(document.location.hash===p && !button){
      await new Promise(ok=>setTimeout(ok,100))
      button = document.querySelector(".btn-use-full.index-1")
    }
    if(button){
      let autoQuests = GM_getValue("autoQuests")
      let settings = autoQuests[farmingQuest]
      if(settings.maxHalfElixirs===0){return}
      if(settings.maxHalfElixirs>0){
        settings.maxHalfElixirs--
        GM_setValue("autoQuests", autoQuests)
      }
      click(button)
      button = null
      while(document.location.hash===p && !button){
        await new Promise(ok=>setTimeout(ok,100))
        button = document.querySelector(".common-item-recovery-pop .prt-popup-footer .btn-usual-ok")
      }
      click(button)
    }
  return}
  if(document.querySelector("#macros-list") || !document.location.hash?.startsWith("#battle") && !document.location.hash?.startsWith("#raid")){return}
  lastHandledPage = document.location.hash
  if(!originalUnloader){ // Don't reload some files every time
    let myCancel = cancel
    while(!requirejs.s.contexts._.defined["model/cjs-loader"]){await new Promise(ok=>setTimeout(ok,100)); if(cancel!==myCancel){return}}
    originalUnloader = requirejs.s.contexts._.defined["model/cjs-loader"].clear
    requirejs.s.contexts._.defined["model/cjs-loader"].clear = ()=>{
      for(let m in images){
        if(reloadables[m] || !lib[m]){continue}
        let script = Array.from(document.querySelectorAll(`body script[type="text/javascript"]`)).find(s=>s.innerHTML.includes(lib[m]+""))
        if(script){
          reloadables[m] = script.innerHTML
          script.remove()
        }
      }
    }
  }
  if(true){
    let remove = []
    for(let m in reloadables){
      if(!reloadables[m]){continue}
      let script = document.createElement("script")
      script.innerHTML = reloadables[m]
      document.body.appendChild(script)
      remove.push(script)
    }
    setTimeout(()=>{
      for(let script of remove){
        script.remove()
      }
    }, 2000)
  }
  if(true){
    let myCancel = cancel
    while(typeof(stage)=="undefined" || !stage?.pJsnData || !document.querySelector("#tpl-prt-total-damage")){
      if(cancel!==myCancel){return}
      await new Promise(ok=>setTimeout(ok,100))
    }
  }
  
  document.querySelector(".cnt-raid").style.paddingBottom = "0px"
  document.querySelector(".prt-raid-log").style.pointerEvents = "none"
  cancel++
  let view = Game.view.setupView//requirejs.s.contexts._.defined["view/raid/setup"].prototype

  let scenarioSpeed = 0; let scenarioEndTime = 0
  let originalPlayScenarios = view.playScenarios
  view.playScenarios = (...args)=>{
    //stage.lastScenario = [...args[0].scenario]
    let mergedDamage = []; let minimumTime = 0
    let newScenario = scenarioSpeed && !(stage.pJsnData.multi_raid_member_info?.length>1) ? [] : args[0].scenario
    for(let e of (newScenario.length ? [] : args[0].scenario)){
      if(["recast", "chain_burst_gauge"].includes(e.cmd)){
        newScenario.push(e)
        continue
      }
      if(e.cmd==="attack" && e.from==="player"){
        minimumTime += 800
        if(scenarioSpeed>=99){
          newScenario.push({cmd:"wait", fps:12})
          continue
        }else if(scenarioSpeed>=2){
          mergedDamage.splice(0, 0, ...e.damage.reduce((r,l)=>[...r, ...l], []))
        }else{
          e.damage = [e.damage.reduce((r,l)=>[...r, ...l],[])]
          newScenario.push(e)
        }
        continue
      }else if(e.cmd==="special" || e.cmd==="special_npc"){
        minimumTime += 2100
        if(scenarioSpeed>=99){
          newScenario.push({cmd:"wait", fps:12})
        continue}
        let lastDamage
        for(let a of e.list){
          if(a.damage){lastDamage=a.damage.slice(-1)[0]}
        }
        if(!lastDamage){continue}
        mergedDamage.splice(0, 0, ...e.total.map(t=>({
          pos:lastDamage.pos,
          num:1,
          value:+t.split.join(""),
          split:t.split,
          hp:lastDamage.hp,
          color:lastDamage.color || lastDamage.attr,
          critical:lastDamage.critical,
          miss:lastDamage.miss,
          guard:false,
          is_force_font_size:true,
          no_damage_motion:false,
        })))
        continue
      }else if(mergedDamage.length){
        let total = mergedDamage.reduce((p,o)=>p+o.value, 0)
        let color = mergedDamage.find(o=>o.color)?.color
        newScenario.push({
          cmd:"loop_damage",
          color,
          to:"boss",
          mode:"parallel",
          wait:1,
          is_rengeki:0,
          is_damage_sync_effect:false,
          is_activate_counter_damaged:"",
          is_bulk_display:false,
          list:[mergedDamage.map((a,i)=>{a.attack_num=i; a.size="m"; a.concurrent_attack_count=0; return a})],
          total:[{"pos":1,"split":(""+total).split(""),"attr":color,"count":0}]
        })
        mergedDamage = []
      }
      if(["modechange", "bg_change", "bgm"].includes(e.cmd)){
        newScenario.push(e)
        continue
      }
      if(["ability", "loop_damage", "windoweffect", "effect", "attack"].includes(e.cmd)){
        if(scenarioSpeed>=99 && e.cmd==="effect" && e.kind?.startsWith("burst")){minimumTime+=1000}
        else if(e.cmd==="ability" && e.to==="player" || e.cmd==="attack"){minimumTime+=1000}
        if(scenarioSpeed>=3){continue}
        if(e.wait){e.wait = 1}
      }
      if(["summon", "summon_simple", "chain_cutin"].includes(e.cmd)){
        minimumTime += e.cmd==="chain_cutin" ? 500 : 1000
        continue
      }
      if(scenarioSpeed>=99 && ["super", "message", "attack", "heal"].includes(e.cmd)){
        if(e.cmd==="super"){minimumTime+=2000}
        continue
      }
      newScenario.push(e)
    }
    args[0].scenario = newScenario
    scenarioEndTime = +new Date() + minimumTime
    return originalPlayScenarios.apply(view, args)
  };
  let originalPostProcessor = view.postprocessOnPlayScenarios
  let postProcessorDelayer = null
  view.postprocessOnPlayScenarios = (...args)=>{
    let o = args[2].timeline[0]
    let originalCall = o.call
    o.call = (...args2)=>{
      originalCall.apply(o, [()=>{
        if(postProcessorDelayer){
          postProcessorDelayer.push(args2[0])
          return;
        }
        postProcessorDelayer = [args2[0]]
        setTimeout(()=>{
          let nextF = waitingForSkillEnd[1]
          waitingForSkillEnd[0] = new Promise((ok, err)=>{
            waitingForSkillEnd[1] = ok
            waitingForSkillEnd[2] = err
          })
          let l = postProcessorDelayer
          postProcessorDelayer = null
          for(let f of l){
            f()
          }
          setTimeout(()=>{
            nextF()
          }, 10)
        }, scenarioEndTime - +new Date())
      }, ...args2.slice(1)])
    }
    let r = originalPostProcessor.apply(view, args)
    o.call = originalCall
    return r
  }
  
  let macros = GM_getValue("macros") || []
  document.querySelector(".contents").insertAdjacentHTML("beforeend",
    `<div id="macros-list"><div class="listed-macro" data-id="new">New...</div><div class="listed-macro" data-id="showAll">Show all</div><div class="listed-macro" data-id="cancel" style="display:none">Stop playing</div><div class="listed-macro" data-id="extra" style="background-color:#000; min-height:10px;"><div style="display:none"><button data-id="scenarioSpeed">Speed</button></div></div><div style="display:none" class="nothing"></div></div>
    <div id="macro-recording" style="display:none"><div class="listed-macro" data-id="stop"><button>End recording</button> <button>Cancel</button> <button>Add macro</button></div></div>
    <div id="macro-settings" style="display:none">
      <div class="listed-macro" style="background-color:#111">Back</div>
      <div class="listed-macro" style="text-align:center"></div>
      <div class="listed-macro">Rename</div>
      <div class="listed-macro"></div>
      <div class="listed-macro"></div>
      <div class="listed-macro"></div>
      <div class="listed-macro"></div>
      <div class="listed-macro">Move...</div>
      <div class="listed-macro">Speed: <select><option value="slow">Slow</option><option value="slower">Slower</option><option value="normal">Normal</option><option value="faster">Faster</option></select></div>
      <div class="listed-macro" style="background-color:#411">Delete</div>
    </div>
    <div id="macro-speed" style="display:none">
      <div class="listed-macro" style="background-color:#111" data-value="back">Back</div>
      ${[
        {value:0, name:"Default", description:"The default speed."},
        {value:1, name:"Not slow", description:"Skips long animations (like summons) and merges damage of attacks."},
        {value:2, name:"Faster", description:"Merges all attacks into a single animation."},
        {value:3, name:"Fast", description:"Skips more animations."},
        {value:99, name:"Skip all", description:"It would be sad to use that."},
        {value:100, name:"Auto farm", description:"Automatically farm this quest multiple times."},
      ].map(o=>`<div class="listed-macro" data-value="${o.value}" data-status="none"><a style="font-size:125%">${o.name}</a><br><a>${o.description}</a></div>`).join("")}
      <div style="display:none; color:#fff" class="autoSettings">
        <div>Auto farm settings:</div>
        <div>When starting, play macro <select data-key="macro" data-type="number" data-value=""></select> then enable <select data-key="autoGame"><option value="">nothing</option><option value="semi">semi auto</option><option value="full" selected>full auto</option></select>.</div>
        <div>Maximum <input data-type="number" data-key="max" placeholder="infinite"> battles and <input data-type="number" data-key="maxHalfElixirs" data-default="0" placeholder="infinite"> half elixirs.</div>
      </div>
    </div>
    <div id="pause-auto-farm" style="text-align:center; display:none; font-size:200%"><button>Pause auto farm</button></div>
    <style>
      .listed-macro {
        display:block;
        width:calc(100% - 10px);
        padding:5px;
        background-color:#222;
        color:#fff;
        margin-bottom:2px;
      }
      .listed-macro[data-playing="now"] {
        background-color:#922;
      }
      .listed-macro[data-playing="soon"] {
        background-color:#742;
      }
      .listed-macro[data-playing="original"] {
        background-color:#472;
      }
      .listed-macro[data-status="selected"]::after {
        content:"Selected for this opponent";
        color:#df9; display:block;
      }
      .listed-macro[data-status="selectedDefault"]::after {
        content:"Selected";
        color:#9f9; display:block;
      }
    </style>`
  )
  let list = document.querySelector("#macros-list")
  if(stageObserver){stageObserver.disconnect()}
  stageObserver = new MutationObserver(onPage)
  stageObserver.observe(list.parentElement, {
    childList:true,
  })
  let recording = document.querySelector("#macro-recording")
  let settings = document.querySelector("#macro-settings")
  let partyHash = [stage.pJsnData.player.param.map(e=>e.pid).join(","), stage.pJsnData.summon.map(s=>s.id).join(",")].join(";")
  let enemyHash = stage.pJsnData.boss.param.map(e=>e.enemy_id).join(",")
  
  let characterByImage = url=>url.split("/").slice(-1)[0].split("_")[0]
  let speeds = ["slow", "slower", "normal", "faster", "fast", "skip"]
  let pauseAutoFarm
  let playMacro = async id=>{
    let macro = macros[id]
    let line = list.querySelector(`[data-id="${id}"], .nothing`)
    line.dataset.playing = "now"
    list.querySelector(`.listed-macro[data-id="cancel"]`).style.display = null
    let actions = [...macro.actions]
    let next = {}
    let check; check = (n,rec)=>{
      if(rec && !next[n]){
        list.querySelector(`[data-id="${n}"], .nothing`).dataset.playing = "soon"
        next[n] = 1
      }else{next[n]++}
      if(rec>10){return}
      for(let action of macros[n].actions){
        if(action.type!=="macro"){continue}
        check(action.macro, rec+1)
      }
    }
    next[id] = 1
    check(id,0)
    let playing = [id]
    let speed = speeds.findIndex(s=>s===(macro.speed||"normal"))
    let wait = time=>new Promise(ok=>setTimeout(ok,time ? time : speed<=0 ? 2000 : 500))
    let myCancel = cancel
    while(actions.length){
      if(pauseAutoFarm){await pauseAutoFarm[0]}
      if(cancel>myCancel || document.querySelector(".prt-command-end").style.display){break}
      let action = actions.splice(0,1)[0]
      if(action.type==="macro"){
        if(!macros[action.macro]){continue}
        next[action.macro]--
        list.querySelector(`[data-id="${playing.slice(-1)[0]}"], .nothing`).dataset.playing = playing.slice(-1)[0]===id ? "original" : "soon"
        list.querySelector(`[data-id="${action.macro}"], .nothing`).dataset.playing = "now"
        playing.push(action.macro)
        actions.splice(0, 0, ...macros[action.macro].actions, {type:"leaveMacro"})
      continue}
      if(action.type==="leaveMacro"){
        let last = playing.splice(-1, 1)[0]
        if(next[last]>0){
          list.querySelector(`[data-id="${last}"], .nothing`).dataset.playing = "soon"
        }else{
          list.querySelector(`[data-id="${last}"], .nothing`).removeAttribute("data-playing")
        }
        list.querySelector(`[data-id="${playing.slice(-1)[0]}"], .nothing`).dataset.playing = "now"
      continue}
      
      if(action.type==="skill"){
        let button = document.querySelector(`div[ability-id="${action.ability}"]`)
        if(button){
          let previousPos = null
          if(speed<=1 && document.querySelector(`.prt-command-chara[pos="${+button.getAttribute("ability-character-num")+1}"]`).style.display!=="block"){
            let back = document.querySelector(`.btn-command-back`)
            if(back.classList.contains("display-on")){
              click(back)
              await wait()
            }
            click(document.querySelector(`.btn-command-character[pos="${+button.getAttribute("ability-character-num")}"]`))
            await wait()
          }else{
            previousPos = stage.gGameStatus.command_slide.now_pos
            stage.gGameStatus.command_slide.now_pos = +button.getAttribute("ability-character-num")
          }
          click(button, {x:44+69*+button.parentElement.dataset["ability-index"], y:468, width:40, height:42})
          if(action.character){
            if(speed<=1){await wait()}
            let character
            for(let c of document.querySelectorAll(`.pop-select-member .prt-character .btn-command-character img`)){
              if(characterByImage(c.src)===action.character){
                character = c
              }
            }
            if(character){
              click(character)
              if(speed<=1){await wait()}
            }
          }
          if(previousPos!==null){
            stage.gGameStatus.command_slide.now_pos = previousPos
          }
          if(speed<=2){await wait(200)}
        }
      }else if(action.type==="attack"){
        let button = document.querySelector(`.btn-attack-start.display-on`)
        if(button){
          let p = waitingForSkillEnd[0]
          click(button)
          await p
          while(!button.classList.contains("display-on") && !stage.gGameStatus.finish){
            p = waitingForSkillEnd[0]
            await p
          }
        }
      }else if(action.type==="summon"){
        let back = document.querySelector(`.btn-command-back`)
        if(back.classList.contains("display-on")){
          click(back)
          await wait()
        }
        let button = document.querySelectorAll(".btn-command-summon.summon-on")[0]
        if(!button){continue}
        click(button)
        await wait()
        button = document.querySelectorAll(`.btn-summon-available.on[summon-id="${action.summon==="support" ? "supporter" : stage.pJsnData.summon.findIndex(s=>s.id===action.summon)+1}"]`)[0]
        if(!button){continue}
        click(button)
        while(document.querySelector(".pop-usual.pop-summon-detail").style.display!=="block"){await wait(100)}
        click(document.querySelector(".btn-summon-use"))
        await wait()
      }else if(action.type==="calock"){
        let button = document.querySelector(".btn-lock")
        let n = action.lock=="false" ? 1 : 0
        if(button.classList.contains("lock"+(1-n))){continue}
        if(button.parentElement.style.display==="none"){
          click(document.querySelector(`.btn-command-back`))
          await wait()
        }
        click(button)
        if(macro.speed==="slow"){await wait()}
      }
    }
    list.querySelector(`[data-id="${id}"], .nothing`).removeAttribute("data-playing")
    for(let i in next){
      list.querySelector(`[data-id="${i}"], .nothing`).removeAttribute("data-playing")
    }
    if(!list.querySelector("[data-playing]")){
      list.querySelector(`.listed-macro[data-id="cancel"]`).style.backgroundColor = null
      list.querySelector(`.listed-macro[data-id="cancel"]`).style.display = "none"
    }
  }

  let moveMode; let showAll
  let createListedMacro = i=>{
    let macro = macros[i]
    list.querySelector(`.listed-macro[data-id="new"]`).insertAdjacentHTML("beforebegin", `<div class="listed-macro" data-id="${i}"><button style="padding:0px; font-size:8px; width:25px; display:inline-block">⚙️</button> <a>${macro.name}</a></div>`)
    let line = list.querySelector(`.listed-macro[data-id="${i}"]`)
    line.addEventListener("click", async ()=>{
      if(line.dataset.playing){return}
      if(moveMode!==undefined){return moveMode(line)}
      await playMacro(line.dataset.id)
    })
    line.querySelector(`button`).addEventListener("click", ev=>{
      if(moveMode!==undefined){return}
      ev.stopPropagation()
      list.style.display = "none"
      settings.style.display = null
      settings.dataset.macro = line.dataset.id
      settings.children[1].innerText = macro.name
      settings.children[3].innerText = macro.parties?.includes(partyHash) ? "Don't show for this party" : "Show for this party"
      settings.children[3].style.display = !macro.parties ? "none" : null
      settings.children[4].innerText = !macro.parties ? "Don't show for all parties" : "Show for all parties"
      settings.children[5].innerText = macro.enemies?.includes(enemyHash) ? "Don't show for this opponent" : "Show for this opponent"
      settings.children[5].style.display = !macro.enemies ? "none" : null
      settings.children[6].innerText = !macro.enemies ? "Don't show for all opponents" : "Show for all opponents"
      settings.children[8].querySelector("select").value = macro.speed || "normal"
      window.scrollTo(0, window.innerHeight)
    })
  }
  let listMacros = ()=>{
    for(let i in macros){
      if(!showAll && (macros[i].parties && !macros[i].parties.includes(partyHash) || macros[i].enemies && !macros[i].enemies.includes(enemyHash))){continue}
      createListedMacro(i)
    }
  }
  listMacros()
  
  let skillByImage = url=>document.querySelector(`.prt-ability-list img[src="${url}"]`).parentElement
  if(!recordable){
    $(document.body).on("tap", ev=>{
      if(recordFunction){recordFunction(ev.target)}
    })
    recordable = true
  }
  list.querySelector(`.listed-macro[data-id="new"]`).addEventListener("click", ()=>{
    list.style.display = "none"
    recording.style.display = null
    recordFunction = original=>{
      let usefulParent = original
      let character
      while(usefulParent && !["lis-ability","prt-popup-body","btn-attack-start","btn-summon-use","btn-quick-summon","btn-lock"].find(c=>usefulParent.classList.contains(c))){
        if(usefulParent.classList.contains("btn-command-character")){character = usefulParent}
        usefulParent = usefulParent.parentElement
      }
      if(!usefulParent){return}
      let extra = {}
      let text
      if(usefulParent.classList.contains("btn-attack-start")){
        extra.type = "attack"
        text = "Attack"
      }else if(usefulParent.classList.contains("btn-summon-use") || usefulParent.classList.contains("btn-quick-summon")){
        extra.type = "summon"
        if(usefulParent.classList.contains("btn-quick-summon")){
          usefulParent = document.querySelector(".lis-summon.is-quick")
        }else if(usefulParent.getAttribute("summon-id")==="supporter"){
          text = "Support summon"
          extra.summon = "support"
        }else{
          usefulParent = document.querySelector(`.lis-summon[pos="${usefulParent.getAttribute("summon-id")}"]`)
        }
        if(!extra.summon){
          let summon = stage.pJsnData.summon[+usefulParent.getAttribute("pos") -1]
          text = summon.name
          extra.summon = summon.id
        }
      }else if(usefulParent.classList.contains("btn-lock")){
        extra.type = "calock"
        extra.lock = usefulParent.classList.contains("lock1")
        text = (extra.lock ? "No" : "Auto")+" charge attack"
      }else{
        extra.type = "skill"
        if(usefulParent.parentElement.classList.contains("pop-usual") && character){
          extra.character = characterByImage(character.querySelector("img.img-chara-command").src)
          usefulParent = skillByImage(usefulParent.querySelector("img.img-ability-icon").src)
        }else{
          usefulParent = usefulParent.querySelector("[ability-id]")
        }
        extra.ability = usefulParent.getAttribute("ability-id")
        text = usefulParent.getAttribute("ability-name")
      }
      let last; let p = extra.type==="skill" ? "ability" : extra.type
      for(let e of recording.querySelectorAll(`[data-type]`)){last = e}
      if(last && extra.type!=="attack" && last.dataset.type===extra.type && extra[p]==last.dataset[p]){
        for(let k in last.dataset){last.removeAttribute("data-"+k)}
        for(let k in extra){last.dataset[k] = extra[k]}
        last.innerText = text
      }else{
        recording.insertAdjacentHTML("beforeend", `<div class="listed-macro" style="background-color:#${extra.type==="skill" ? "141" : extra.type==="attack" ? "411" : extra.type==="summon" ? "441" : extra.type==="calock" ? "531" : "0000"}" ${Object.keys(extra).map(k=>`data-${k}="${extra[k]}"`).join(" ")}>${text}</div>`)
      }
    }
  })
  list.querySelector(`.listed-macro[data-id="showAll"]`).addEventListener("click", ()=>{
    showAll = true
    list.querySelector(`.listed-macro[data-id="showAll"]`).style.display = "none"
    for(let e of list.querySelectorAll(`.listed-macro[data-id]`)){
      if(+e.dataset.id>=0){e.remove()}
    }
    listMacros()
  })
  list.querySelector(`.listed-macro[data-id="cancel"]`).addEventListener("click", ()=>{
    cancel++
    list.querySelector(`.listed-macro[data-id="cancel"]`).style.backgroundColor = "#422"
  })
  recording.querySelector(`.listed-macro[data-id="stop"]`).children[0].addEventListener("click", ()=>{
    let name = prompt("Macro name?")
    if(!name){return}
    let macro = {
      name,
      actions:[],
      parties:[partyHash],
    }
    for(let action of recording.querySelectorAll(".listed-macro[data-type]")){
      action.remove()
      if(action.dataset.type==="macro" && action.dataset.macro===undefined){continue}
      macro.actions.push({
        name:action.innerText,
        ...action.dataset,
      })
    }
    for(let a of macro.actions){
      if(a.type==="macro"){a.macro = +a.macro}
    }
    macros.push(macro)
    createListedMacro(macros.length-1)
    list.style.display = null
    recording.style.display = "none"
    GM_setValue("macros", macros)
    recordFunction = null
  })
  recording.querySelector(`.listed-macro[data-id="stop"]`).children[1].addEventListener("click", ()=>{
    for(let action of recording.querySelectorAll(".listed-macro[data-type]")){
      action.remove()
    }
    list.style.display = null
    recording.style.display = "none"
    recordFunction = null
  })
  recording.querySelector(`.listed-macro[data-id="stop"]`).children[2].addEventListener("click", ()=>{
    recording.insertAdjacentHTML("beforeend", `<div class="listed-macro" style="background-color:#437" data-type="macro"><select class="new-select-thing"><option default>Select a macro...</option>${macros.map((m,i)=>`<option value="${i}">${m.name}</option>`)}</select></div>`)
    let select = recording.querySelector(".new-select-thing")
    select.className = null
    select.addEventListener("change", ()=>{
      select.parentElement.dataset.macro = select.value
      if(Array.from(select.parentElement.children).findIndex(e=>e===select)===select.parentElement.children.length-1){
        let f = recordFunction
        recordFunction = null
        playMacro(+select.value).then(()=>{
          recordFunction = f
        })
      }
      select.parentElement.innerText = macros[+select.value].name
    })
  })

  let autoQuests = GM_getValue("autoQuests") || {}
  settings.children[0].addEventListener("click", ()=>{
    settings.style.display = "none"
    list.style.display = null
  GM_setValue("macros", macros)})
  settings.children[2].addEventListener("click", ()=>{
    let name = prompt("New macro name")
    if(!name){return}
    macros[+settings.dataset.macro].name = name
    settings.children[1].innerText = name
    list.querySelector(`[data-id="${+settings.dataset.macro}"] a`).innerText = name
  GM_setValue("macros", macros)})
  settings.children[3].addEventListener("click", ()=>{
    let macro = macros[+settings.dataset.macro]
    let i = macro.parties.findIndex(p=>p===partyHash)
    if(i===-1){
      macro.parties.push(partyHash)
    }else{
      macro.parties.splice(i,1)
    }
    settings.children[3].innerText = i===-1 ? "Don't show for this party" : "Show for this party"
  GM_setValue("macros", macros)})
  settings.children[4].addEventListener("click", ()=>{
    let macro = macros[+settings.dataset.macro]
    if(macro.parties){
      delete macro.parties
    }else{
      macro.parties = [partyHash]
    }
    settings.children[3].innerText = "Don't show for this party"
    settings.children[3].style.display = !macro.parties ? "none" : null
    settings.children[4].innerText = !macro.parties ? "Don't show for all parties" : "Show for all parties"
  GM_setValue("macros", macros)})
  settings.children[5].addEventListener("click", ()=>{
    let macro = macros[+settings.dataset.macro]
    let i = macro.enemies.findIndex(p=>p===enemyHash)
    if(i===-1){
      macro.enemies.push(enemyHash)
    }else{
      macro.enemies.splice(i,1)
    }
    settings.children[5].innerText = i===-1 ? "Don't show for this opponent" : "Show for this opponent"
  GM_setValue("macros", macros)})
  settings.children[6].addEventListener("click", ()=>{
    let macro = macros[+settings.dataset.macro]
    if(macro.enemies){
      delete macro.enemies
    }else{
      macro.enemies = [enemyHash]
    }
    settings.children[5].innerText = "Don't show for this opponent"
    settings.children[5].style.display = !macro.enemies ? "none" : null
    settings.children[6].innerText = !macro.enemies ? "Don't show for all opponent" : "Show for all opponent"
  GM_setValue("macros", macros)})
  settings.children[7].addEventListener("click", ()=>{
    list.insertAdjacentHTML("afterbegin", `<div class="listed-macro" data-id="moveAfter">Move macro after...</div>`)
    let line = list.querySelector(`.listed-macro[data-id="moveAfter"]`)
    moveMode = element=>{
      let before = +settings.dataset.macro; let after = +element.dataset.id || 0
      for(let m of macros){
        for(let a of m.actions){
          if(a.type!=="macro"){continue}
          if(a.macro===before){
            a.macro = after
          }else if(a.macro<before && a.macro>=after){
            a.macro++
          }else if(a.macro>before && a.macro<=after){
            a.macro--
          }
        }
      }
      for(let k in autoQuests){
        let o = autoQuests[k]
        if(!o.macro){continue}
        if(o.macro===before){
          o.macro = after
        }else if(o.macro<before && o.macro>=after){
          o.macro++
        }else if(o.macro>before && o.macro<=after){
          o.macro--
        }
      }
      let macro = macros[before]
      macros[before] = null
      macros.splice(after>=0 ? after +1 : 0, 0, macro)
      macros.splice(macros.findIndex(m=>!m), 1)
      for(let e of list.querySelectorAll(`.listed-macro[data-id]`)){
        if(+e.dataset.id>=0){e.remove()}
      }
      listMacros()
      moveMode = undefined
      settings.style.display = null
      list.style.display = "none"
      list.querySelector(`.listed-macro[data-id="moveAfter"]`).remove()
      if(!showAll){
        list.querySelector(`.listed-macro[data-id="showAll"]`).style.display = null
      }
    GM_setValue("macros", macros)}
    list.querySelector(`.listed-macro[data-id="showAll"]`).style.display = "none"
    line.addEventListener("click", ()=>{
      moveMode(line)
    })
    settings.style.display = "none"
    list.style.display = null
  })
  settings.children[8].querySelector("select").addEventListener("change", ()=>{
    macros[+settings.dataset.macro].speed = settings.children[8].querySelector("select").value
  GM_setValue("macros", macros)})
  settings.children[9].addEventListener("click", ()=>{
    if(!confirm("Delete the macro?")){return}
    let i = +settings.dataset.macro
    list.querySelector(`[data-id="${i}"]`).remove()
    macros.splice(+settings.dataset.macro, 1)
    for(let e of list.querySelectorAll("[data-id]")){
      if(e.dataset.id>i){
        e.dataset.id = +e.dataset.id -1
      }
    }
    for(let m of macros){
      for(let a of m.actions){
        if(a.type==="macro" && a.macro===i){a.macro=null}else
        if(a.type==="macro" && a.macro>i){a.macro--}
      }
    }
    for(let k in autoQuests){
      let o = autoQuests[k]
      if(!o.macro){continue}
      if(o.macro===i){
        delete o.macro
      }else if(o.macro>i){
        o.macro--
      }
    }
    settings.style.display = "none"
    list.style.display = null
  GM_setValue("macros", macros)})

  if(GM_getValue("unlockedExtra")){
    let button = list.querySelector(`div.listed-macro[data-id="extra"]`)
    button.children[0].style.display = null
    button.style.backgroundColor = null
  }else{
    let unlocking
    list.querySelector(`div.listed-macro[data-id="extra"]`).addEventListener("click", async ()=>{
      if(unlocking){return}
      let button = list.querySelector(`div.listed-macro[data-id="extra"]`)
      if(!button.dataset.lastTry || +new Date()- +button.dataset.lastTry>5000){
        button.dataset.lastTry = +new Date()
        button.dataset.clicks = 0
      }
      let clicks = button.dataset.clicks = (+button.dataset.clicks||0) + 1
      if(clicks>=3){
        unlocking = true
        button.style.transition = "1s"
        button.style.backgroundColor = "#ff8"
        await new Promise(ok=>setTimeout(ok,1000))
        button.children[0].style.display = null
        button.style.backgroundColor = null
        GM_setValue("unlockedExtra", true)
      }
    })
  }
  let scenarioSpeeds = GM_getValue("scenarioSpeed") || {}
  let autoQuestSave
  scenarioSpeed = autoQuests[stage.pJsnData.quest_id] ? 100 : scenarioSpeeds[enemyHash] || scenarioSpeeds.default || 0
  let showMacroSpeeds = ()=>{
    document.querySelector("#macro-speed").style.display = null
    let list = document.querySelector(`#macro-speed div.autoSettings [data-key="macro"]`)
    list.innerHTML = `<option value="">none</option>`+macros.map((macro,i)=>(
      `<option value="${i}">${macro.name}</option>`
    ))
    list.value = list.dataset.value
  }
  list.querySelector(`button[data-id="scenarioSpeed"]`).addEventListener("click", ()=>{
    list.style.display = "none"
    showMacroSpeeds()
  })
  let autoFarming
  for(let speed of document.querySelectorAll(`#macro-speed div.listed-macro`)){
    speed.dataset.status = scenarioSpeeds.default==speed.dataset.value ? "selectedDefault" : scenarioSpeed==speed.dataset.value ? "selected" : "none"
    speed.addEventListener("click", ()=>{
      if(speed.dataset.value==="back"){
        (scenarioSpeed===100 && autoFarming ? document.querySelector("#pause-auto-farm") : list).style.display = null
        speed.parentElement.style.display = "none"
        if(pauseAutoFarm){
          pauseAutoFarm[1]()
          pauseAutoFarm = null
        }
      return}
      if(speed.dataset.status==="selectedDefault"){
        let enemy = speed.parentElement.querySelector(`[data-status="selected"]`)
        if(enemy){
          enemy.dataset.status = "none"
          delete scenarioSpeeds[enemyHash]
          scenarioSpeed = scenarioSpeeds.default
          if(enemy.dataset.value=="100"){
            autoQuestSave = autoQuests[stage.pJsnData.quest_id]
            delete autoQuests[stage.pJsnData.quest_id]
            GM_setValue("autoQuests", autoQuests)
            farmingQuest = undefined
            speed.parentElement.querySelector("div.autoSettings").style.display = "none"
            if(pauseAutoFarm){
              cancel++
              pauseAutoFarm[1]()
              pauseAutoFarm = null
            }
          }
        }
      }else if(speed.dataset.status==="selected"){
        if(speed.dataset.value=="100"){return}
        let d = speed.parentElement.querySelector(`[data-status="selectedDefault"]`)
        if(d){
          d.dataset.status = "none"
        }
        scenarioSpeeds.default = +speed.dataset.value
        speed.dataset.status = "selectedDefault"
      }else{
        let enemy = speed.parentElement.querySelector(`[data-status="selected"]`)
        if(enemy){
          enemy.dataset.status = "none"
          if(enemy.dataset.value=="100"){
            autoQuestSave = autoQuests[stage.pJsnData.quest_id]
            delete autoQuests[stage.pJsnData.quest_id]
            GM_setValue("autoQuests", autoQuests)
            farmingQuest = undefined
            speed.parentElement.querySelector("div.autoSettings").style.display = "none"
            if(pauseAutoFarm){
              cancel++
              pauseAutoFarm[1]()
              pauseAutoFarm = null
            }
          }
        }
        scenarioSpeeds[enemyHash] = scenarioSpeed = +speed.dataset.value
        speed.dataset.status = "selected"
        if(speed.dataset.value=="100"){
          autoQuests[stage.pJsnData.quest_id] = autoQuestSave || {maxHalfElixirs:0, autoGame:"full"}
          speed.parentElement.querySelector("div.autoSettings").style.display = null
          GM_setValue("autoQuests", autoQuests)
          farmingQuest = stage.pJsnData.quest_id
        }
      }
      GM_setValue("scenarioSpeed", scenarioSpeeds)
    })
  }
  for(let e of document.querySelectorAll("#macro-speed div.autoSettings select, #macro-speed div.autoSettings input")){
    let settings = autoQuests[stage.pJsnData.quest_id]
    if(!settings && e.dataset.default){
      e.value = e.dataset.default
    }else if(settings?.[e.dataset.key]!==undefined){
      if(e.dataset.key==="macro"){
        e.dataset.value = settings[e.dataset.key]
      }else{
        e.value = settings[e.dataset.key]
      }
    }
    e.addEventListener("change", ()=>{
      let settings = autoQuests[stage.pJsnData.quest_id]
      if(!settings){return}
      if(e.dataset.type==="number" && e.value && +e.value!==+e.value){
        e.value = ""
      return}
      settings[e.dataset.key] = e.dataset.type==="number" ? (e.value==="" ? undefined : +e.value) : e.value
      if(e.dataset.key==="macro"){
        e.dataset.value = e.value
      }
      GM_setValue("autoQuests", autoQuests)
    })
  }
  document.querySelector("#macro-speed div.autoSettings").style.display = autoQuests[stage.pJsnData.quest_id] ? null : "none"
  document.querySelector("#pause-auto-farm button").addEventListener("click", ()=>{
    pauseAutoFarm = []
    pauseAutoFarm[0] = new Promise(ok=>{pauseAutoFarm[1]=ok})
    document.querySelector("#pause-auto-farm").style.display = "none"
    showMacroSpeeds()
  })
  if(scenarioSpeed===100){
    document.querySelector("#pause-auto-farm").style.display = null
    list.style.display = "none"
    autoFarming = true
    farmingQuest = stage.pJsnData.quest_id
    let myCancel = cancel
    setTimeout(async ()=>{
      while(document.querySelector("#multi-btn-mask").style.display==="block" || stage.gGameStatus.ability_popup){await new Promise(ok=>setTimeout(ok,100))}
      await new Promise(ok=>setTimeout(ok,2000))
      if(pauseAutoFarm){await pauseAutoFarm[0]}
      if(cancel!==myCancel){return}
      let settings = autoQuests[stage.pJsnData.quest_id]
      if(scenarioSpeed!==100 || !settings){return}
      let end = document.querySelector(".prt-command-end")
      let observer = new MutationObserver(async ()=>{
        if(end.style.display && scenarioSpeed===100){
          observer.disconnect()
          if(pauseAutoFarm){await pauseAutoFarm[0]}
          if(cancel!==myCancel){return}
          click(end.children[0])
        }
      })
      observer.observe(end, {
        attributes:true,
      })
      if(settings.macro!==undefined){
        await playMacro(settings.macro)
        await new Promise(ok=>setTimeout(ok,200))
        if(cancel!==myCancel){return}
      }
      if(settings.autoGame){
        view.battleAutoType = settings.autoGame==="full" ? 2 : 1
        if(settings.autoGame==="semi"){
          click(document.querySelector(`.btn-attack-start.display-on`))
          await new Promise(ok=>setTimeout(ok,500))
          if(cancel!==myCancel){return}
          view._showAutoButton()
        }
        stage.gGameStatus.enable_auto_button = true
        let button = document.querySelector(".btn-auto")
        button.style.display = "block"
        click(button)
      }else{
        autoFarming = false
        document.querySelector("#macros-list").style.display = null
        document.querySelector("#pause-auto-farm").style.display = "none"
      }
    }, 10)
  }
}

window.addEventListener("hashchange", onPage)
onPage()

setTimeout(async ()=>{ // Don't refresh page when entering battle
  while(!requirejs.s.contexts._.defined["util/navigate"]){await new Promise(ok=>setTimeout(ok,500))}
  let original = requirejs.s.contexts._.defined["util/navigate"].hash
  requirejs.s.contexts._.defined["util/navigate"].hash = (...args)=>{
    cancel++; waitingForSkillEnd[2]()
    if(["quest/", "raid/", "mypage", "event/", "raid_multi/"].find(e=>args[0]?.replace("#","").startsWith(e))){
      if(args[1]?.refresh){delete args[1].refresh}
    }else{
      if(originalUnloader){originalUnloader.apply(requirejs.s.contexts._.defined["model/cjs-loader"], [])}
    }
    return original.apply(requirejs.s.contexts._.defined["util/navigate"], args)
  }
}, 1000)
