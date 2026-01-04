// ==UserScript==
// @name         DH3 chat overhaul
// @namespace    FileFace
// @version      2.5.5.3
// @description  lol
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405648/DH3%20chat%20overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/405648/DH3%20chat%20overhaul.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */

(function() {
    'use strict';
    const dhEmoji = ['sapphire','emerald','ruby','diamond','bloodDiamond','combatSkill','magicSkill','miningSkill','craftingSkill','woodcuttingSkill','farmingSkill','brewingSkill','fishingSkill','cookingSkill']
    const pots = [{name: 'stardust', xp: 50},
                  {name: 'sand', xp: 80},
                  {name: 'cookingBoost', xp:70},
                  {name: 'combatCooldown', xp: 210},
                  {name: 'compost', xp: 140},
                  {name: 'oil', xp: 80},
                  {name: 'bone', xp: 100},
                  {name: 'treeStarter', xp: 160},
                  {name: 'repelPotion1', xp: 1500},
                  {name: 'bar', xp: 600},
                  {name: 'sapphireStardust', xp: 450},
                  {name: 'mana', xp: 5000},
                  {name: 'largeStardust', xp: 4400},
                  {name: 'largeFurnace', xp: 1850},
                  {name: 'largePirate', xp: 1900},
                  {name: 'largeEmeraldStardust', xp: 6600},
                  {name: 'largeRocketSpeed', xp: 4100},
                  {name: 'repelPotion2', xp: 7000},
                  {name: 'largeBar', xp: 18100},
                  {name: 'largeRubyStardust', xp: 14200}
                 ]
    const spells = [
        {name: 'heal', xp: 25},
        {name: 'poison', xp: 60},
        {name: 'reflect', xp: 150},
        {name: 'fire', xp: 180},
        {name: 'freeze', xp: 250},
        {name: 'ghostScan', xp: 300},
        {name: 'invisibility', xp: 500}
    ]
    pots.forEach(e=>{if(!e.name.includes('repel')){e.name += 'Potion'}})
    const emoticons = {
        slightly_smiling_face: ':)',
        open_mouth: ':o',
        scream: ':O',
        smirk: ':]',
        grinning: ':D',
        stuck_out_tongue_winking_eye: ';P',
        rage: ':@',
        frowning: ':(',
        kissing_heart: ':*',
        wink: ';)',
        pensive: ':/',
        confounded: ':s',
        flushed: ':|',
        relaxed: ':$',
        mask: ':x',
        heart: '<3',
        thumbsup: ':+1:',
        thumbsdown: ':-1:',
        sunglasses: 'B)',
    }
    const betterEmotes = {
        FeelsBadMan: 'https://cdn.frankerfacez.com/emoticon/33355/1',
        monkaS: 'https://cdn.frankerfacez.com/emoticon/130762/1',
        Pepega: 'https://cdn.frankerfacez.com/emoticon/243789/1',
        PepeHands: 'https://cdn.frankerfacez.com/emoticon/231552/1',
        monkaW: 'https://cdn.frankerfacez.com/emoticon/214681/1',
        FeelsGoodMan: 'https://cdn.frankerfacez.com/emoticon/109777/1',
        peepoBlanket: 'https://cdn.frankerfacez.com/emoticon/262458/1',
        Pog: 'https://cdn.frankerfacez.com/emoticon/301073/1',
        NotLikeThis: 'https://static-cdn.jtvnw.net/emoticons/v1/58765/1.0',
        NODDERS: 'https://cdn.betterttv.net/emote/5eadf40074046462f7687d0f/1x'
    }
    const betterEmotesKeys = Object.keys(betterEmotes)
    const mainDarkColor = '#222831'
    const mainLightColor = '#393e46'
    const mainWhiteColor = '#eeeeee'
    const mainOrangeColor = '#c99024'
    const chatInput = document.getElementById('chat-area-input')
    const chatView = document.getElementById('chat-area-view')
    const chatArea = document.getElementById('chat-area')
    const fightScreen = document.getElementById('navigation-right-combat-fighting')
    const combatMap = document.getElementById('combat-map-div')
    const game = document.getElementById('game')
    const audio = new Audio('./sounds/success.wav')
    const menuButtons = [{
        id: 'pinging-button',
        key:'pingingOn'},{
        id: 'pm-pinging-button',
        key:'pingPM'},{
        id: 'set-words-button',
        key:'words'},{
        id: 'emoji-button',
        key:'emoji'},{
        /*id: 'chat-friendlist',
        key:'friends'},{
        id: 'twitchemotes-button',
        key:'twitchEmotes'},{
        id: 'chat-ignorelist',
        key:'ignore'*/},{
        id: 'emoji-send-button-settings',
        key:'emojiButton'},{
        id: 'chat-on-side',
        key:'chatOnSide'},{
        id: 'chat-on-bottom',
        key:'chatOnBottom'},{
        id: 'chat-in-combat',
        key:'chatInCombat'},{
        id: 'chat-color-settings',
        key: 'color'},{
        id: 'alternate-backgrounds',
        key: 'alternateBackgrounds'},{
        id: 'pause-autoscroll-onscroll',
        key: 'pauseAutoscroll',}
                        ]
    var autoScroll = true
    var scrolldelay
    var playerIsMod = false
    var chatSettings = {}
    var lastPM = ''
    var twitchEmotes = []
    var emojiList = []
    var allEmojis = []
    var emojiIndex = 0
    var chatIndex = true
    var previousPlayerName
    var previousElementWidth
    var addedWidth = false
    // wait for game to load
    const chatCommands = [{
        command: 'lol',
        value: () => ''},{
        command: '!level',
        value: (word, lowercase, stats)=> stats !== 1 ? `:${lowercase}Skill: ${word} Level: ${stats.currentLevel} | Current XP: ${stats.currentXp} | XP needed for ${stats.askedLevel} level: ${stats.neededXp}` + (stats.sdNeeded ? ` | SD needed: ${stats.sdNeeded}` : '') : ''},{
        command: '!gems',
        value: () => (window.var_sapphireMined || 0) + '/' + (window.var_emeraldMined || 0) + '/' + (window.var_rubyMined || 0) + '/' + (window.var_diamondMined || 0) + '/' + (window.var_bloodDiamondMined || 0) + ' in ' + window.formatTime(window.var_playtime)},{
        command: '!kc',
        value: (word, lowercase)=> window[word + 'Monster'] ? word.replace(/([A-Z])/g, ' $1').trim() + ' Killed: ' + (window[`var_${lowercase}Kills`] || 0) : ''},{
        command: '!heat',
        value: () => `You will have a total of ${getHeat()} heat if you burn all of your logs.`},{
        command: '!combatguide',
        value: () => 'https://old.reddit.com/r/DiamondHunt/comments/hnls62/combat_strategy_masterpost_magnus/'},{
        command: '!wiki',
        value: () => 'https://diamondhunt3.fandom.com/wiki/DiamondHunt3_Wiki'},{
        command: '!anwinity',
        value: () => 'https://anwinity.com/dh3/'},
                         ]
    const startThing = () => {
        if(window.var_username){
            pogchamp()
        }else{
            setTimeout(startThing, 1000)
        }
    }
    startThing()

    // run all functions when game is loaded
    function pogchamp(){
        document.querySelector('#navigation-right-achievements-button').children[0].querySelector('div').textContent = 'Achi'
        loadSettingsFromStorage()
        addScripts()
        createChatSettingsButton()
        createEmojiButton()
        createMainContainer()
        createChatSettings('dialogue-extra-chat-settings', 'things-for-dh3')
        createChatSettings('dialogue-set-words', 'things-for-dh3', 'words')
        createChatSettings('dialogue-friendlist', 'things-for-dh3', 'friends')
        createChatSettings('dialogue-ignorelist', 'things-for-dh3', 'ignore')
        createChatSettings('dialogue-emoji', 'things-for-dh3', 'emoji')
        createChatSettings('dialogue-color-settings', 'things-for-dh3', 'color')
        updateLists('friend', '', 'load')
        updateLists('ignore', '', 'load')
        chatSettings.volume ? audio.volume = chatSettings.volume/10 : audio.volume = 1
        chatSettings.fontSize ? chatArea.style.fontSize = (chatSettings.fontSize + 'pt') : chatArea.style.fontSize = '16pt'
        darkMode()
        window.var_chatTag === 'Moderator' ? playerIsMod = true : playerIsMod = false
//        getTwitchEmotes()
        createRightClickMenu()
        createMenuButtons()
        createMuteMenu()
        window.setAutoScroll(!window.global_autoscrollChat)
        document.getElementById('chat-autoscroll-button-check').src = 'images/check.png'
        addStyle(`a{
            color:cyan
            }
            a:visited{
            color:darkcyan
            }`)
        chatPinging()
        fightScreenObserver()
        combatMapObserver()
        chatOnTheSide()
        chatOnTheBottom()
        chatInput.addEventListener('keydown', (event) => {doCommand(event); window.chatInput(event)})
    }

    // chat input
    function doCommand(event){
        /*if (event.key === 'Tab' && lastPM !== '' && chatInput.value === ''){
			chatInput.value = '/pm ' + lastPM + ' '
            event.preventDefault()
        }*/
        if (!event.key || event.key === 'Enter'){
            chatInput.value.split(' ').forEach((word, index) => {
                if(word.startsWith('!') && word.length>4){
                    let object = chatCommands.filter(f=>word.startsWith(f.command))[0] || chatCommands[0]
                    let level = word.match(/[0-9]/g) !== null ? word.match(/[0-9]/g).join('') : 'next'
                    let item = level === 'next' ? word.substring(object.command.length) : word.substring(object.command.length, word.indexOf(level))
                    let lowercase = item.charAt(0).toLowerCase() + item.substring(1)
                    let uppercase = item.charAt(0).toUpperCase() + item.substring(1)
                    let stats = getStats(lowercase, level)
                    if (object.command === '!level'){
                        addCommandResult(stats, 1, uppercase)
                        chatInput.value = ''
                        if (autoScroll){
                            chatView.scrollTo(0, chatView.scrollHeight)
                        }
                        return
                    }
                    else if ( object.command === '!heat'){
                        chatInput.value = `/pm ${window.var_username.replace(/ /g,'_')} ` + chatInput.value.replace(word, object.value(item, lowercase, stats)) + (stats.itemsNeeded ? stats.itemsNeeded : '')
                    }else{
                        chatInput.value = chatInput.value.replace(word, object.value(item, lowercase, stats))
                    }
                }
            })
        }
        //window.chatInput()
    }
    // add custom style
    function getStats(lowercase, level){
        if (!window[`var_${lowercase}Xp`]){
            return 1
        }
        let stats = {}
        stats.bonusXp = !!(window.var_bonusXp) ? 1.1 : 1
        stats.currentXp = window[`var_${lowercase}Xp`]
        stats.currentLevel = window.getLevel(window[`var_${lowercase}Xp`])
        if (level === 'next' || level <= stats.currentLevel){level = stats.currentLevel + 1}
        //if (level > 100){level = 100}
        stats.askedLevel = level
        stats.neededXp = window.getXpNeeded(level) + 1 - window[`var_${lowercase}Xp`]
        if (lowercase === 'crafting' || lowercase === 'mining'){
            let sdCost = {none: 17, sapphire: 16, emerald: 15, ruby: 14, diamond: 12}
            let gem = lowercase === 'crafting' ? getGem('StardustHammer') : getGem('StardustPickaxe')
            stats.sdNeeded = Math.ceil((stats.neededXp / stats.bonusXp)) * sdCost[gem]
        }
        if (lowercase === 'crafting'){
            let bodies = [150, 200, 1000]
            stats.items = []
            stats.itemsExtra = []
            global_stardustToolsMap.stardustHammer.arrayItemsToConvertArray.forEach((item,index) => {
                stats.items.push(Math.ceil(stats.neededXp / (global_stardustToolsMap.stardustHammer.arrayItemsConvetXpArray[index] * stats.bonusXp)))
            })
            bodies.forEach((xp, index)=>{
                stats.itemsExtra.push(Math.ceil(stats.neededXp / (xp * stats.bonusXp)))
            })
        }else if (lowercase === 'mining'){
            stats.items = []
            global_stardustToolsMap.stardustPickaxe.arrayItemsToConvertArray.forEach((item,index)=> {
                stats.items.push(Math.ceil(stats.neededXp / (global_stardustToolsMap.stardustPickaxe.arrayItemsConvetXpArray[index] * stats.bonusXp)))
            })
        }else if (lowercase === 'brewing'){
            stats.items = []
            pots.forEach(item => {
                stats.items.push(Math.ceil(stats.neededXp / (item.xp * stats.bonusXp)))
            })
        }else if (lowercase === 'farming'){
            stats.items = []
            stats.totalXp = 0
            stats.totalMaterial = 0
            window.global_seedMap.forEach(item => {
                stats.items.push(Math.ceil(stats.neededXp / (item.xp * stats.bonusXp)))
                if (window[`var_${item.name}`]){
                    stats.totalXp += (parseInt(item.xp) * stats.bonusXp) * parseInt(window[`var_${item.name}`])
                    stats.totalMaterial += parseInt(item.bonemeal) * parseInt(window[`var_${item.name}`])
                }
            })
        }else if (lowercase === 'magic'){
            stats.items = []
            stats.xpPerFight = 0
            spells.forEach(item => {
                if (window[`var_${item.name}`]){
                    stats.items.push(Math.ceil(stats.neededXp / Math.floor(item.xp * stats.bonusXp)))
                    stats.xpPerFight += (item.xp * stats.bonusXp)
                }
            })
        }else if (lowercase === 'cooking'){
            let oven = Object.keys(window).filter(oven => oven.includes('Oven') && oven.includes('var') && !oven.includes('Total') && !oven.includes('Bought')).filter(oven => window[oven] == 1)[0].substring(4)
            let successRate = {bronzeOven: 0.5, ironOven: 0.6, silverOven: 0.7, goldOven: 0.8, promethiumOven: 0.9}
            if (window.var_researcherCooking > 1){
                successRate[oven] += (1 - successRate[oven])*0.25
            }
            if (window.var_researcherCooking > 2){
                successRate[oven] += 0.0375
            }
            successRate[oven] = successRate[oven].toFixed(4)
            stats.heatNeeded = Math.ceil((stats.neededXp / stats.bonusXp) / 30)
            stats.expectedHeatNeeded = Math.ceil(stats.heatNeeded / successRate[oven])
        }
        return stats
    }
    function addCommandResult(stats, value, uppercase){
        $(chatView).append(`<div id="levelCommand" style="border: 1px solid #eeeeee;background: #202040">
           <div>
                <span style="color: chocolate;margin-left: 5px">${uppercase} Level:</span>
                <span style="color: #eeeeee;margin-left: 5px">${stats.currentLevel}</span>
           </div>
           <div>
                <span style="color: chocolate;margin-left: 5px">Current XP:</span>
                <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.currentXp)}</span>
           </div>
           <div>
                <span style="color: chocolate;margin-left: 5px">XP needed for ${stats.askedLevel} level:</span>
                <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.neededXp)}</span>
           </div>
        </div>`)
        let lastElement = document.querySelectorAll('#levelCommand')[document.querySelectorAll('#levelCommand').length-1]
        if (uppercase.toLowerCase() === 'crafting'){
            $(lastElement).append(`
              <div>
                <span style="color: chocolate;margin-left: 5px">SD needed: </span>
                <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.sdNeeded)}</span>
              </div>`)
            levelItemsNeeded(lastElement, stats, 'crafting')
        }else if (uppercase.toLowerCase() === 'mining'){
            $(lastElement).append(`
                 <div>
                   <span style="color: chocolate;margin-left: 5px">SD needed: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.sdNeeded)}</span>
                 </div>`)
            levelItemsNeeded(lastElement, stats, 'mining')
        }else if (uppercase.toLowerCase() === 'brewing'){
            levelItemsNeeded(lastElement, stats, 'brewing')
        }else if (uppercase.toLowerCase() === 'farming'){
            levelItemsNeeded(lastElement, stats, 'farming')
            $(lastElement).append(`
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Xp if you harvest all seeds: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.totalXp)}</span>
                 </div>
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Bonemeal needed to plant all seeds: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.totalMaterial)}</span>
                 </div>`)
        }else if (uppercase.toLowerCase() === 'magic'){
            levelItemsNeeded(lastElement, stats, 'magic')
            $(lastElement).append(`
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Xp per fight: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.xpPerFight)}</span>
                 </div>`)
            $(lastElement).append(`
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Fights needed for level up: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(Math.ceil(stats.neededXp / stats.xpPerFight))}</span>
                 </div>`)
        }else if (uppercase.toLowerCase() === 'cooking'){
            $(lastElement).append(`
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Heat needed: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.heatNeeded)}</span>
                 </div>
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Heat needed including burn rate: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(stats.expectedHeatNeeded)}</span>
                 </div>
                 <div>
                   <span style="color: chocolate;margin-left: 5px">Current heat: </span>
                   <span style="color: #eeeeee;margin-left: 5px">${window.formatNumber(getHeat())}</span>
                 </div>
`)
        }
    }
    function levelItemsNeeded(lastElement, stats, key){
        let temp = []
        let text = ''
        let bodies = ['bearFurBody', 'polarBearFurBody', 'reaperBody']
        switch (key){
            case 'farming':
                temp = [...window.global_seedMap]
                text = 'Seeds needed to plant: '
                break
            case 'brewing':
                temp = [...pots]
                text = 'Pots needed to brew: '
                break
            case 'mining':
                temp = window.global_stardustToolsMap.stardustPickaxe.arrayItemsToConvertArray.map(e=>{return {name: e}})
                text = 'Ores needed: '
                break
            case 'crafting':
                temp = [...window.global_stardustToolsMap.stardustHammer.arrayItemsToConvertArray.map(e=>{return {name: e}}), ...bodies]
                text = 'Bars needed: '
                break
            case 'magic':
                temp = [...spells]
                text = 'Spells needed to cast: '
                break
        }
        let wrapper = document.createElement('div')
        wrapper.id = 'cmd-wrapper'
        wrapper.style = 'display: flex; flex-direction: row; flex-wrap: wrap;'
        lastElement.appendChild(wrapper)
        $(wrapper).append(`<span style="color: chocolate;margin-left: 5px">${text} </span>`)
        stats.items.forEach((item, index)=>{
            let div = document.createElement('div')
            div.style = 'display: flex; flex-direction: row; margin-left: 2px'
            div.id = 'cmd-' + temp[index].name
            wrapper.appendChild(div)
            $(div).append(`
                   <img src=/images/${temp[index].name}.png style="height:1.2em;vertical-align:middle;margin-left: 2px"></img>
                   <span style="color: #eeeeee;margin-left: 2px">${window.formatNumber(item)},</span>
                `)
            if (index === stats.items.length -1){
                div.children[1].textContent = div.children[1].textContent.slice(0, -1)
            }
        })
        if (key == 'crafting'){
            wrapper = document.createElement('div')
            wrapper.id = 'cmd-wrapper-extra'
            wrapper.style = 'display: flex; flex-direction: row; flex-wrap: wrap;'
            lastElement.appendChild(wrapper)
            $(wrapper).append(`<span style="color: chocolate;margin-left: 5px">Bodies: </span>`)
            stats.itemsExtra.forEach((item, index)=>{
                let div = document.createElement('div')
                div.style = 'display: flex; flex-direction: row; margin-left: 2px'
                div.id = 'cmd-' + temp[index].name
                wrapper.appendChild(div)
                $(div).append(`
                   <img src=/images/${bodies[index]}.png style="height:1.2em;vertical-align:middle;margin-left: 2px"></img>
                   <span style="color: #eeeeee;margin-left: 2px">${window.formatNumber(item)},</span>
                `)
                if (index === stats.itemsExtra.length -1){
                    div.children[1].textContent = div.children[1].textContent.slice(0, -1)
                }
            })
        }
    }
    function getHeat(){
        return (
            parseInt(window.var_heat || 0) +
            (window.var_logs*1 || 0) +
            (window.var_oakLogs*2 || 0) +
            (window.var_willowLogs*3 || 0) +
            (window.var_bambooLogs*4 || 0) +
            (window.var_mapleLogs*5 || 0) +
            (window.var_lavaLogs*6 || 0) +
            (window.var_pineLogs*7 || 0) +
            (window.var_stardustLogs*8 || 0)
        )
    }
    function addStyle(styleString) {
        const style = document.createElement('style')
        style.textContent = styleString;
        document.head.append(style)
    }
    function getGem(tool) {
        let result = null;
        ["diamond", "ruby", "emerald", "sapphire"].some(gem => {
            if(window[`var_${gem}${tool}`]) {
                result = gem
                return true
            }
        });
        return result || "none"
    }
    // get twitch emotes from api
/*    function getTwitchEmotes(){
        fetch('https://api.twitchemotes.com/api/v4/channels/0')
            .then(response=> response.json())
            .then(data=> {twitchEmotes = data.emotes})}
*/
    // steal emojis from a website with emojis
    function addScripts(){
        let link = document.createElement('link')
        link.id = 'color-picker'
        link.rel = 'stylesheet'
        // color picker css and script
        link.href = 'https://cdn.jsdelivr.net/npm/spectrum-colorpicker2@2.0.0/dist/spectrum.min.css'
        link.type = 'text/css'
        document.getElementById('body').appendChild(link)
        let script = document.createElement('script')
        //script.id = 'spectrumscript'
        script.src = "https://cdn.jsdelivr.net/npm/spectrum-colorpicker2@2.0.0/dist/spectrum.min.js"
        document.getElementById('body').appendChild(script)
        // emoji css and emoji list
        link = document.createElement('link')
        link.id = 'emoji-css'
        link.rel = 'stylesheet'
        link.href = "https://emoji-css.afeld.me/emoji.css"
        document.getElementById('body').appendChild(link)
        $.ajax({url: 'https://emoji-css.afeld.me/',success: (response)=>{
            emojiList = response.split(' ')
                .filter(item => item.includes('em-') && item.endsWith('"'))
                .map(item => item.substring(3))
                .map(item => item.slice(0,-1))
            emojiList = emojiList
                .filter(emoji => (!emoji.includes('flag') && !emoji.includes('male') && !emoji.includes('man') && !emoji.includes('arrow') && !emoji.includes('clock') && !emoji.includes('trian')))
            //allEmojis = dhEmoji.concat(emojiList)
            allEmojis = betterEmotesKeys.concat(dhEmoji, emojiList)
        }})
    }

    // chat pinging
    // style of pinged message
    function ping(parentElement){
        audio.play()
        // background color, rgb, last value is opacity
        parentElement.style.background = chatSettings.colors.pingColor
        // color of text
        parentElement.style.color = 'white'
    }
    function fightScreenObserver(){
        const observer = new MutationObserver(messages=>{
            if (fightScreen.style.display !== 'none'){
                if(chatSettings.chatInCombat){
                    chatArea.style.display = 'none' ? chatArea.style.display = '' : null
                }else{
                    game.style.width = '100%'
                }
            }else{
                if (chatSettings.chatOnSide){
                    game.style.width !== '69%' ? game.style.width = '69%' : null
                }
            }
        })
        const config = { attributes: true }
        observer.observe(fightScreen, config)
    }
    function combatMapObserver(){
        const observer = new MutationObserver(messages=>{
            console.log(combatMap.style.display)
            if (combatMap.style.display !== 'none'){
                chatArea.style.display = 'none'
            }else{
                chatArea.style.display = ''
            }
        })
        const config = { attributes: true }
        observer.observe(combatMap, config)
    }
    // pinging logic
    function chatPinging(){
        const observer = new MutationObserver(messages=>{
            //console.log(messages)
            messages.forEach((mutation,index)=>{
                if (mutation.addedNodes.length === 1){

                    "use strict";
                    let spans = mutation.addedNodes[0].querySelectorAll('span')
                    // replace text with emoji for level command and break function, probably shouldnt be doing it here but w/e
                    if (spans[0].textContent.includes('Level:')){
                        if (autoScroll){
                            chatView.scrollTo(0, chatView.scrollHeight)
                        }
                        return console.log('Chat command')
                    }
                    // extract each element
                    let isFriend = false
                    let images = mutation.addedNodes[0].querySelectorAll('img') !== null ? mutation.addedNodes[0].querySelectorAll('img') : null
                    let nameElement = mutation.addedNodes[0].querySelectorAll('b')[0]
                    let messageElement = mutation.addedNodes[0].querySelectorAll('span')[mutation.addedNodes[0].querySelectorAll('span').length - 1]
                    let textElement = messageElement.childNodes[1]
                    let timeElement = spans[0]
                    let parentElement = spans[0].parentNode
                    let tagElement = parentElement.querySelector('[class*=chat-tag]') ? parentElement.querySelector('[class*=chat-tag]') : 'none'
                    // handling images
                    images.forEach(image => {
                        image.style.maxHeight = '1.2em'
                        image.style.width = 'auto'
                        if (image.src.includes('investor')) tagElement = 'Investor'
                        if (image.src.includes('smileIcon')){
                            isFriend = true
                            image.remove()
                        }
                    })
                    // analyze message
                    let message = analyzeMessage(nameElement, messageElement, images, parentElement, timeElement, tagElement)
                    // removing ignored message
                    /*if (message.isIgnored && !message.isPMsent){
                        parentElement.remove()
                        return console.log('Killed ignored message.')
                    }*/
                    if (chatIndex){
                        parentElement.id = 'odd'
                    }else{
                        parentElement.id = 'even'
                    }
                    chatIndex = !chatIndex
                    // removing pm command
                    if (message.playerName === window.var_username && !message.isPMsent && (message.content.includes('XP needed') || message.content.includes('You will have a total'))){
                        parentElement.remove()
                        return console.log('Killed command pm message.')
                    }
                    // dark mode settings
                    // setting ids for coloring
                    if (message.tag === 'none' || message.tag === 'Donor' || message.tag === 'Super Donor' || message.tag === 'Ultra Donor' || message.tag === 'Contributor'){
                        parentElement.id += 'notag'
                    }
                    message.tag !== 'none' && message.tag !== 'Investor' ? parentElement.id += tagElement.className : parentElement.id += 'notag'
                    message.tag === 'Investor' ? parentElement.id += message.tag : null
                    // resizing tags
                    if (message.tag !== 'Investor' && message.tag !== 'none'){
                        tagElement.style.display = 'inline-flex'
                        tagElement.style.height = '1.2em'
                        tagElement.style.verticalAlign = 'middle'
                        tagElement.style.alignItems = 'center'
                        tagElement.style.fontSize = 'small'
                    }

                    // some styling
                    /*nameElement.style.display = 'inline-block'
                    nameElement.style.marginRight = '4px'*/
                    messageElement.style.overflowWrap = 'anywhere'
                    timeElement.style.color = 'darkgrey'
                    parentElement.style.padding = '3px'
                    // coloring background of every other message
                    changeStyle('index', parentElement)
                    // coloring names/messages based on state
                    messageElement.style.color = chatSettings.colors.chatFontColor
                    if (chatSettings.alternateBackgrounds){
                        if (parentElement.id.includes('even')){
                            messageElement.style.color = chatSettings.colors.alternateFontColor
                        }
                    }
                    if (!message.isPM){
                        // color normal friend or normal user
                        isFriend ? nameElement.style.color = chatSettings.colors.friendColor : nameElement.style.color = chatSettings.colors.usernameColor
                        // check if you
                        if (message.playerName === window.var_username.replace(/ /g,'_')){
                            nameElement.style.color = chatSettings.colors.yourNameColor
                        }
                        // color messages based on tags
                            switch (message.tag){
                                case 'Dev':
                                    messageElement.style.color = chatSettings.colors.devColor
                                    nameElement.style.color = chatSettings.colors.devColor
                                    break
                                case 'Moderator':
                                    if (!isFriend){
                                        if (chatSettings.alternateBackgrounds){
                                            if (parentElement.id.includes('even')){
                                                messageElement.style.color = chatSettings.colors.alternateFontColor
                                            }else{
                                                messageElement.style.color = chatSettings.colors.chatFontColor
                                            }
                                        }else{
                                            messageElement.style.color = chatSettings.colors.chatFontColor
                                        }
                                        nameElement.style.color = chatSettings.colors.moderatorColor
                                    }
                                    break
                                case 'Server Message':
                                    tagElement.style.verticalAlign = 'middle'
                                    if (message.playerName === window.var_username){
                                        audio.play()
                                        parentElement.style.background = chatSettings.colors.pingColor
                                    }
                                    nameElement.style.color = chatSettings.colors.serverColor
                                    break
                                case 'Financier':
                                    messageElement.style.color = chatSettings.colors.financierColor
                                    nameElement.style.color = chatSettings.colors.financierColor
                                    break
                                case 'Investor':
                                    messageElement.style.color = chatSettings.colors.investorColor
                                    nameElement.style.color = chatSettings.colors.investorColor
                                    break
                            }
                        // color pms
                    }else if(message.isPM && !message.isPMsent){
                        messageElement.style.color = chatSettings.colors.PMColor
                    }else{
                        messageElement.style.color = chatSettings.colors.PMColor
                    }
                    // ping
                    if(!message.isPM && chatSettings.pingingOn && !message.isIgnored){
                        // check if user has set any exactwords
                        if (chatSettings.exactWords.length>0){
                            message.words.forEach(messageWord => {
                                chatSettings.exactWords.forEach(exactWord => {
                                    // check if a word matches predefined ping words
                                    if(exactWord === messageWord.toLowerCase()){
                                        ping(parentElement)
                                    }
                                })
                            })
                        }
                        // check if user has set any matchwords
                        if(chatSettings.matchWords.length>0){
                            chatSettings.matchWords.forEach(matchWord => {
                                // check if a message contains any form of predefined words
                                message.content.toLowerCase().includes(matchWord) ? ping(parentElement) : null
                            })
                        }
                        // ping if message is a pm and user has pms on
                    }else if(message.isPM && !message.isPMsent && chatSettings.pingPM && !message.isIgnored){
                        ping(parentElement)
                    }
                    /*if (chatSettings.twitchEmotes){
                        message.words.forEach(word=>{
                            twitchEmotes.forEach(emote=>{
                                if (word === emote.code){
                                    let prefix = parentElement[1].innerHTML.substring(0,parentElement[1].innerHTML.indexOf('</b>')+4)
                                    let emoji = message.content.replace(word,`<img src="https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0" style="vertical-align:middle;height: 32px" title="${word}"></img>`)
                                    parentElement[1].innerHTML = prefix + emoji
                                }
                            })
                        })
                    }*/
                    // show emojis
                    if (chatSettings.emoji && message.tag != 'Server Message'){
                        let tempMessageHTML = ''
                        let emojiHTML = ''
                        for (let word of message.words){
                            if (word.includes('://')){
                                tempMessageHTML += `${convertStringToURL(word)} `
                                continue
                            }
                            if (word.startsWith(':') && word.endsWith(':')){
                                let text = word.substring(1, word.length-1)
                                // simplify some emojis
                                text === 'thinking' ? text = 'thinking_face' : null
                                text === 'cowboy' ? text = 'face_with_cowboy_hat' : null
                                text === 'facepalm' ? text = 'face_palm' : null
                                // check imported emojis
                                if (emojiList.includes(text)){
                                    emojiHTML = emojiReplacer('css', text)
                                    tempMessageHTML += `${emojiHTML} `
                                    continue
                                }
                                // check dh emojis
                                if (dhEmoji.filter(emoji => emoji.includes(text)).length){
                                    text = dhEmoji.filter(emoji => emoji.includes(text))[0]
                                    emojiHTML = emojiReplacer('dh', text)
                                    tempMessageHTML += `${emojiHTML} `
                                    continue
                                }
                            }
                            // check emoticons :) :D :P
                            let name = Object.keys(emoticons).filter(short => emoticons[short] === word).length ? Object.keys(emoticons).filter(short => emoticons[short] === word) : null
                            name === 'thumbsup' ? name = '--1' : null
                            name === 'thumbsdown' ? name = '-1' : null
                            if (name !== null){
                                emojiHTML = emojiReplacer('css', name)
                                tempMessageHTML += `${emojiHTML} `
                                continue
                            }
                            // check bttv emotes
                            name = betterEmotesKeys.filter(emote => emote === word).length ? betterEmotesKeys.filter(emote => emote === word) : null
                            if (name !== null){
                                emojiHTML = emojiReplacer('bttv', name, betterEmotes[name])
                                tempMessageHTML += `${emojiHTML} `
                                continue
                            }
                            tempMessageHTML += `${word} `
                        }
                        if (!message.isPM){
                            messageElement.innerHTML = nameElement.outerHTML + tempMessageHTML
                        }else{
                            messageElement.innerHTML = `${message.PMprefix} ${tempMessageHTML}`
                        }
                    }
                    // add right click menu
                    //messageElement.innerHTML = messageElement.innerHTML.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, (m) => `<a href="${m}" target="_blank">${m}</a>`);

                    if (!message.isPM && message.tag != 'Server Message'){
                        let tempHTML = nameElement
                        mutation.addedNodes[0].querySelectorAll('b')[0].remove()
                        tempHTML.oncontextmenu = (event) => {event.preventDefault(); showChatMenu(event, message.playerName, isFriend)}
                        messageElement.prepend(tempHTML)

                    }else if (message.isPM && !message.isPMsent){
                        messageElement.oncontextmenu = (event) => {event.preventDefault(); showChatMenu(event, message.playerName, isFriend)}
                    }else {
                        messageElement.oncontextmenu = (event) => {event.preventDefault()}
                    }
                    //console.log(nameElement)
                    // scroll to the bottom
                    if (autoScroll){
                        chatView.scrollTo(0, chatView.scrollHeight)
                    }
                }
            })
        })

        // observer configs
        const config = { childList: true }
        observer.observe(chatView, config)
    }

    function emojiReplacer(key, name, src){
        let img
        switch (key){
                // return html element with css emoji
            case 'css':
                img = `<i class="em em-${name}" style="height: 1.2em;" title="${name}"></i>`
                break
                // return html element with dh image
            case 'dh':
                img = `<img src="images/${name}.png" style="height: 1.2em; width:1.2em;vertical-align:middle" title="${name}">`
                break
                // return html element with bttv emote
            case 'bttv':
                img = `<img src=${src} style="height: 1.2em; width: 1.2em;vertical-align:middle">`
                break
        }
        return img
    }

    // analyze message and its content
    function analyzeMessage(nameElement, messageElement, img, parentElement, timeElement, tagElement){
        let message = {}
        message.time = timeElement.textContent.substring(6, timeElement.textContent.indexOf('[') + 1)
        message.playerName = typeof nameElement !== 'undefined' ? nameElement.textContent.substring(0, nameElement.textContent.indexOf('(') - 1).replace(/ /g,'_') : null
        message.playerLevel = typeof nameElement !== 'undefined' ? nameElement.textContent.substring(nameElement.textContent.indexOf('(') + 1, nameElement.textContent.indexOf(')')) : null
        message.content = messageElement.textContent.substring(messageElement.textContent.indexOf(':') + 2).replace(/</g,'&lt;').replace(/>/g,'&gt;')
        if (tagElement !== 'none'){
            message.tag = tagElement === 'Investor' ? 'Investor' : tagElement.textContent
        }else{
            message.tag = 'none'
        }
        let msg = messageElement.textContent
        message.words = message.content.split(' ').filter(word => word !== '')
        if (msg.replace(' ','').startsWith('[')){
            if (msg.replace(' ','').substring(1).startsWith('PM')){
                message.isPM = true
                message.isPMsent = false
                message.playerName = msg.substring(msg.indexOf('m') + 2, msg.indexOf(']')).trim().replace(/ /g,'_')
                lastPM = message.playerName
            }else{
                message.isPM = true
                message.isPMsent = true
                message.playerName = msg.substring(msg.indexOf('o') + 2, msg.indexOf(']')).trim().replace(/ /g,'_')
            }
            message.PMprefix = messageElement.textContent.substring(0, messageElement.textContent.indexOf(']') + 1)
            message.words = messageElement.textContent.substring(messageElement.textContent.indexOf(']') + 1).split(' ').filter(char => !char == '')
        }else{
            message.isPM = false
        }
        //message.isFriend = chatSettings.friendList.includes(message.playerName) ? true : false
        //message.isIgnored = chatSettings.ignoreList.includes(message.playerName) ? true : false
        return message
    }

    // clicking buttons
    function changeSettings(id, key, event){
        let volume;
        let div = document.getElementById(id)
        let settingsWindow = document.getElementById('dialogue-extra-chat-settings')
        switch (key){
            case 'pingingOn':
            case 'pingPM':
            case 'chatInCombat':
            case 'emoji':
            case 'twitchEmotes':
            case 'pauseAutoscroll':
                chatSettings[key] ? chatSettings[key] = false : chatSettings[key] = true
                break
            case 'alternateBackgrounds':
                chatSettings[key] ? chatSettings[key] = false : chatSettings[key] = true
                document.querySelectorAll('#chat-area-view > div').forEach(div => { changeStyle('index', div) })
                break
            case 'chatOnSide':
                if (!chatSettings.chatOnBottom){
                    chatSettings[key] ? chatSettings[key] = false : chatSettings[key] = true
                }
                break
            case 'chatOnBottom':
                if(!chatSettings.chatOnSide){
                    chatSettings[key] ? chatSettings[key] = false : chatSettings[key] = true
                }
                break
            case 'words':
            case 'color':
                settingsWindow.style.display = 'none'
                div.style.display = ''
                break
            case 'volume':
                if (event === '+'){
                    chatSettings[key] < 10 ? chatSettings[key] += 1 : null
                    div.textContent = 'Volume: ' + chatSettings[key]
                }else if (event === '-'){
                    chatSettings[key] > 0 ? chatSettings[key] -= 1 : null
                    div.textContent = 'Volume: ' + chatSettings[key]
                }
                audio.volume = chatSettings.volume/10
                break
            case 'fontSize':
                if (event === '+'){
                    chatSettings[key] < 20 ? chatSettings[key] += 1 : null
                    div.textContent = 'Font Size: ' + chatSettings[key] + 'pt'
                    chatArea.style.fontSize = chatSettings[key] + 'pt'
                }else if (event === '-'){
                    chatSettings[key] > 10 ? chatSettings[key] -= 1 : null
                    div.textContent = 'Font Size: ' + chatSettings[key] + 'pt'
                    chatArea.style.fontSize = chatSettings[key] + 'pt'
                }
                break
            case 'pingColor':
            case 'mainBackgroundColor':
            case 'chatBackgroundColor':
            case 'chatBackgroundColor2':
            case 'usernameColor':
            case 'serverColor':
            case 'PMColor':
            case 'friendColor':
            case 'yourNameColor':
            case 'devColor':
            case 'financierColor':
            case 'investorColor':
            case 'moderatorColor':
            case 'alternateFontColor':
            case 'chatFontColor':
                chatSettings.colors[key] = event
                break
            case 'friends':
            case 'ignore':
                settingsWindow.style.display = 'none'
                div.style.display = 'flex'
                break
            case 'emojiButton':
                chatSettings[key] ? chatSettings[key] = false : chatSettings[key] = true
                chatSettings[key] ? div.style.display = '' : div.style.display = 'none'
                break
        }
        styleButtons()
        updateSettings()
    }

    // change styling depending on current state
    function styleButtons(){
        menuButtons.forEach(button => {
            let div = document.getElementById(button.id)
            switch (button.key){
                case 'pingingOn':
                case 'pingPM':
                case 'emoji':
                case 'twitchEmotes':
                case 'emojiButton':
                case 'chatOnSide':
                case 'chatOnBottom':
                case 'chatInCombat':
                case 'alternateBackgrounds':
                case 'pauseAutoscroll':
                    chatSettings[button.key] ? div.style.color = 'green' : div.style.color = 'red'
                    break
                case 'words':
                case 'friends':
                case 'ignore':
                case 'color':
                    div.style.color = mainWhiteColor
                    break
            }})
    }
    function changeStyle(key, element){
        let chatDivs = document.querySelectorAll('#chat-area-view > div')
        let colors = Object.keys(chatSettings.colors)
        switch(key){
            case 'reset':
                document.getElementById('dialogue-color-settings').querySelectorAll('input').forEach((input, index) => {
                    input.value = chatSettings.colors[colors[index]]
                    input.style.backgroundColor = chatSettings.colors[colors[index]]
                })
                //chatView.style.color = chatSettings.colors.chatFontColor
                chatArea.style.background = chatSettings.colors.mainBackgroundColor
                chatView.style.background = chatSettings.colors.chatBackgroundColor
                chatDivs.forEach(div => {
                    let lastSpan = div.querySelectorAll('span')[div.querySelectorAll('span').length - 1]
                    div.id.includes('even') ? lastSpan.style.color = chatSettings.colors.alternateFontColor : null
                    div.id.includes('odd') ? lastSpan.style.color = chatSettings.colors.chatFontColor : null
                    div.id.includes('notag') ? div.querySelectorAll('b').forEach(b => {
                        let playername = b.textContent.substring(0, b.textContent.indexOf('(') - 1)
                        let isFriend = Object.keys(global_friendsAndIgnoreList).filter(x => global_friendsAndIgnoreList[x]=="friend").includes(playerName)
                        if (playername === window.var_username){
                            b.style.color = chatSettings.colors.yourNameColor
                        }else if (isFriend){
                            b.style.color = chatSettings.colors.friendColor
                        }else if (playername !== window.var_username && !isFriend){
                            b.style.color = chatSettings.colors.usernameColor
                        }
                    }) : null
                    if (div.id.includes('Dev')){
                        lastSpan.style.color = chatSettings.colors.devColor
                        div.querySelector('b').style.color = chatSettings.colors.devColor
                    }
                    if (div.id.includes('Financier')){
                        lastSpan.style.color = chatSettings.colors.financierColor
                        div.querySelector('b').style.color = chatSettings.colors.financierColor
                    }
                    if (div.id.includes('Investor')){
                        lastSpan.style.color = chatSettings.colors.investorColor
                        div.querySelector('b').style.color = chatSettings.colors.investorColor
                    }
                    div.id.includes('Moderator') ? div.querySelector('b').style.color = chatSettings.colors.moderatorColor : null
                    div.id.includes('yell') ? div.querySelector('b').style.color = chatSettings.colors.serverColor : null
                    div.textContent.includes('[PM') || div.textContent.includes('[Sent') ? lastSpan.style.color = chatSettings.colors.PMColor : null
                })
                break
            case 'index':
                if (chatSettings.alternateBackgrounds){
                    if (element.id.includes('even')){
                        element.style.background = chatSettings.colors.chatBackgroundColor2
                    }
                }else{
                    element.style.background = chatSettings.colors.chatBackgroundColor
                }
                break
            case 'chatFontColor':
            case 'alternateFontColor':
                    chatDivs.forEach(div => {
                        let lastSpan = div.querySelectorAll('span')[div.querySelectorAll('span').length - 1]
                        console.log(((div.id.includes('notag') || div.id.includes('Moderator')) && !div.textContent.includes('[PM') && !div.textContent.includes('[Sent')))
                        if ((div.id.includes('notag') || div.id.includes('Moderator')) && !div.textContent.includes('[PM') && !div.textContent.includes('[Sent')){
                            if (chatSettings.alternateBackgrounds){
                                div.id.includes('even') ? lastSpan.style.color = chatSettings.colors.alternateFontColor : null
                                div.id.includes('odd') ? lastSpan.style.color = chatSettings.colors.chatFontColor : null
                            }else{
                                lastSpan.style.color = chatSettings.colors.chatFontColor
                            }
                        }
                        //div.id.includes('notag') ? div.querySelector('b').style.color = chatSettings.colors.usernameColor : null
                    })
                break
            case 'mainBackgroundColor':
                chatArea.style.background = chatSettings.colors[key]
                break
            case 'chatBackgroundColor':
                chatView.style.background = chatSettings.colors[key]
                //document.querySelectorAll('#chat-area-view > div').forEach(div => {changeStyle('index', div)})
                break
            case 'chatBackgroundColor2':
                chatDivs.forEach(div => { changeStyle('index', div) })
                break
            case 'serverColor':
                chatDivs.forEach(div => { div.id.includes('yell') ? div.querySelector('b').style.color = chatSettings.colors[key] : null })
                break
            case 'PMColor':
                chatDivs.forEach(div => { div.textContent.includes('[PM') || div.textContent.includes('[Sent') ? div.querySelectorAll('span')[div.querySelectorAll('span').length - 1].style.color = chatSettings.colors[key] : null })
                break
            case 'friendColor':
                chatDivs.forEach(div => div.querySelectorAll('b').forEach(b => {
                    let playername = b.textContent.substring(0, b.textContent.indexOf('(') - 1)
                    if (Object.keys(global_friendsAndIgnoreList).filter(x => global_friendsAndIgnoreList[x]=="friend").includes(playername) && playername !== window.var_username){
                        b.style.color = chatSettings.colors[key]
                    }}))
                    break
            case 'yourNameColor':
                chatDivs.forEach(div => div.querySelectorAll('b').forEach(b => {
                    if (b.textContent.includes(window.var_username)){
                        b.style.color = chatSettings.colors[key]
                    }}))
                break
            case 'usernameColor':
                chatDivs.forEach(div => div.querySelectorAll('b').forEach(b => {
                    let playername = b.textContent.substring(0, b.textContent.indexOf('(') - 1)
                    if (div.id.includes('notag') &&
                        chatSettings.friendList.includes(playername.replace(/ /g, '_')) && playername !== window.var_username){
                        b.style.color = chatSettings.colors[key]
                    }
                }))
                break
            case 'serverColor':
                chatDivs.forEach(div => div.querySelectorAll('b').forEach(b => {
                    if (div.id.includes('yell')){
                        b.style.color = chatSettings.colors[key]
                    }
                }))
                break
            case 'moderatorColor':
                chatDivs.forEach(div => div.querySelectorAll('b').forEach(b => {
                    if (div.id.includes('Moderator')){
                        b.style.color = chatSettings.colors[key]
                    }
                }))
                break
            case 'devColor':
                chatDivs.forEach(div => { if(div.id.includes('Dev')){
                    div.querySelectorAll('span')[div.querySelectorAll('span').length - 1].style.color = chatSettings.colors[key]
                    div.querySelector('b').style.color = chatSettings.colors[key]
                }})
                break
            case 'financierColor':
                chatDivs.forEach(div => { if(div.id.includes('Financier')){
                    div.querySelectorAll('span')[div.querySelectorAll('span').length - 1].style.color = chatSettings.colors[key]
                    div.querySelector('b').style.color = chatSettings.colors[key]
                }})
                break
            case 'investorColor':
                chatDivs.forEach(div => { if(div.id.includes('Investor')){
                    div.querySelectorAll('span')[div.querySelectorAll('span').length - 1].style.color = chatSettings.colors[key]
                    div.querySelector('b').style.color = chatSettings.colors[key]
                }})
                break
        }
    }
    // add words from inputs to settings
    function addWords(id, key){
        event.preventDefault()
        let input = document.getElementById(id)
        let words = input.value.replace(/\s/g, '').split(',')
        words.forEach((word, index) => {
            if (word == ''){
            words.splice(index,1)}
        })
        switch (key){
            case 'exact':
                chatSettings.exactWords = words
                break
            case 'match':
                chatSettings.matchWords = words
                break
        }
        updateSettings()
    }

    // add friend to storage
    function addFriendIgnore(type, key, name){
        let newest
        switch (type){
            case 'friend':
                if (!key){
                    newest = document.querySelectorAll('#dialogue-friendlist > input')[0].value.trim().replace(/ /g,'_')
                    document.querySelectorAll('#dialogue-friendlist > input')[0].value = ''
                }else{
                    newest = name
                }
                if(!chatSettings.friendList.includes(newest)){
                    chatSettings.friendList.push(newest)
                    updateLists('friend', newest, 'add')
                    changeStyle('friendColor')
                }
                break
            case 'ignore':
                if (!key){
                    newest = document.querySelectorAll('#dialogue-ignorelist > input')[0].value.trim().replace(/ /g,'_')
                    document.querySelectorAll('#dialogue-ignorelist > input')[0].value = ''
                }else{
                    newest = name
                }
                if(!chatSettings.ignoreList.includes(newest)){
                    chatSettings.ignoreList.push(newest)
                    updateLists('ignore', newest, 'add')
                }
                break
        }
        updateSettings()
    }
    // add friend to friendlist
    function updateLists(type, name, key){
        switch (type){
            case 'friend':
                if (key == 'add'){
                    createListDiv(name, 'friend')
                }else if(key == 'remove'){
                    document.getElementById('friend-' + name).remove()
                }else{
                    chatSettings.friendList.forEach(friend => {
                        createListDiv(friend, 'friend')
                    })
                }
                break
            case 'ignore':
                if (key == 'add'){
                    createListDiv(name, 'ignore')
                }else if(key == 'remove'){
                    document.getElementById('ignored-' + name).remove()
                }else{
                    chatSettings.ignoreList.forEach(ignored => {
                        createListDiv(ignored, 'ignore')
                    })
                }
                break
        }
    }
    function removeFromList(id, key){
        let name = id
        switch (key){
            case 'friend':
                chatSettings.friendList.forEach((friend, index) => {
                    friend === name ? chatSettings.friendList.splice(index, 1) : null
                })
                updateLists('friend', id, 'remove')
                updateSettings()
                changeStyle('usernameColor')
                break
            case 'ignore':
                chatSettings.ignoreList.forEach((ignored, index) => {
                    ignored === name ? chatSettings.ignoreList.splice(index, 1) : null
                })
                updateLists('ignore', id, 'remove')
                updateSettings()
                break
        }
    }
    // store values in localstorage
    function loadSettingsFromStorage(key){
        if (localStorage.getItem('chat-extra-settings') == null || key === 'reset'){
            chatSettings = {
                pingingOn: false,
                pingPM: false,
                volume: 1,
                exactWords: [var_username, '@' + var_username],
                matchWords: [],
                friendList: [],
                ignoreList: [],
                emoji: true,
                twitchEmotes: false,
                emojiButton: false,
                chatOnSide: false,
                chatOnBottom: false,
                chatInCombat: false,
                alternateBackgrounds: false,
                pauseAutoscroll: false,
                fontSize: 16,
                colors: {pingColor: 'rgba(255, 0, 0, 0.3)', chatFontColor: '#eeeeee', mainBackgroundColor: mainDarkColor, chatBackgroundColor: mainLightColor,
                         chatBackgroundColor2: '#32363d', alternateFontColor: '#eeeeee', usernameColor: mainOrangeColor, serverColor: '#C04238',
                        PMColor: '#68d140', friendColor: '#38f9b5', yourNameColor: '#00ffff', devColor: '#f5f215', financierColor: '#3e9dc0', investorColor: '#cc66ff', moderatorColor: '#189531'}
            }
            localStorage.setItem('chat-extra-settings',JSON.stringify(chatSettings))
        }else{
            chatSettings = JSON.parse(localStorage.getItem('chat-extra-settings'))
        }
        let set = ['emoji','twitchEmotes','ignoreList','emojiButton','chatOnSide','chatInCombat','chatOnBottom','alternateBackgrounds','pauseAutoscroll']
        set.forEach(setting => {
            if (chatSettings[setting] === undefined){
                chatSettings[setting] = false
                localStorage.setItem('chat-extra-settings',JSON.stringify(chatSettings))
            }
        })
        if (chatSettings.ignoreList === undefined){
            chatSettings.ignoreList = []
            localStorage.setItem('chat-extra-settings',JSON.stringify(chatSettings))
        }
        // default colors
        if (chatSettings.colors === undefined || Object.keys(chatSettings.colors).length !== 15 || key === 'resetcolors'){
            chatSettings.colors = {pingColor: 'rgba(255, 0, 0, 0.3)', chatFontColor: mainWhiteColor, mainBackgroundColor: mainDarkColor, chatBackgroundColor: mainLightColor,
                         chatBackgroundColor2: '#32363d', alternateFontColor: mainWhiteColor, usernameColor: mainOrangeColor, serverColor: '#C04238',
                        PMColor: '#68d140', friendColor: '#38f9b5', yourNameColor: '#00ffff', devColor: '#f5f215', financierColor: '#3e9dc0', investorColor: '#cc66ff', moderatorColor: '#189531' }
            localStorage.setItem('chat-extra-settings',JSON.stringify(chatSettings))
        }
        if (chatSettings.fontSize === undefined){
            chatSettings.fontSize = 16
            localStorage.setItem('chat-extra-settings',JSON.stringify(chatSettings))
        }
        if (!Number.isInteger(chatSettings.volume)){
            chatSettings.volume = 1
            localStorage.setItem('chat-extra-settings',JSON.stringify(chatSettings))
        }
        if (key === 'reset'){
            document.querySelectorAll('#friend-list > div').forEach(e=>e.remove())
            document.querySelectorAll('#ignore-list > div').forEach(e=>e.remove())
        }
    }

    function openChatSettings(event,id){
        let offsetTop
        let offsetLeft
        chatSettings.chatOnSide ? offsetTop = 50 : offsetTop = 285
        chatSettings.chatOnSide ? offsetLeft = 800 : offsetLeft = 254
        if (document.getElementById(id).style.display == 'none'){
            document.getElementById(id).style.display = 'flex'
            document.getElementById(id).style.top = (event.pageY-offsetTop) + 'px'
            document.getElementById(id).style.left = (event.pageX-offsetLeft)+ 'px'
            document.getElementById('dialogue-color-settings').style.top = (event.pageY-offsetTop) + 'px'
            document.getElementById('dialogue-color-settings').style.left = (event.pageX-offsetLeft)+ 'px'
            document.getElementById('dialogue-set-words').style.top = (event.pageY-offsetTop) + 'px'
            document.getElementById('dialogue-set-words').style.left = (event.pageX-offsetLeft)+ 'px'
            document.getElementById('dialogue-friendlist').style.top = (event.pageY-offsetTop) + 'px'
            document.getElementById('dialogue-friendlist').style.left = (event.pageX-offsetLeft)+ 'px'
            document.getElementById('dialogue-ignorelist').style.top = (event.pageY-offsetTop) + 'px'
            document.getElementById('dialogue-ignorelist').style.left = (event.pageX-offsetLeft)+ 'px'
            document.getElementById('dialogue-emoji').style.top = (event.pageY-485) + 'px'
            document.getElementById('dialogue-emoji').style.left = (event.pageX-offsetLeft)+ 'px'
        }
    }

    function backButton(ID, parentID){
        document.getElementById(parentID).style.display = 'flex'
        document.getElementById(ID).style.display = 'none'
    }

    // update localstorage with new values
    function updateSettings(){
        localStorage.setItem('chat-extra-settings', JSON.stringify(chatSettings))
    }

    // dark mode
    function darkMode(){
        chatArea.style.color = mainWhiteColor
        chatArea.style.background = chatSettings.colors.mainBackgroundColor
        chatArea.style.fontSize = chatSettings.fontSize + 'pt'
        chatInput.style.background = mainLightColor
        chatInput.style.color = mainWhiteColor
        chatInput.style.padding = '5px'
        chatInput.style.border = '1px solid ' + mainOrangeColor
        chatView.style.background = chatSettings.colors.chatBackgroundColor
        chatView.style.color = chatSettings.colors.chatFontColor
        chatView.style.marginTop = '5px'
        document.getElementById('chat-autoscroll-button-check').style.height = '0.8em'
        document.getElementById('chat-autoscroll-button-check').style.width = '0.8em'
        document.querySelectorAll('.custom-chat-button').forEach((button ,index)=>{
            button.style.border = '1px solid ' + mainOrangeColor
            button.style.fontSize = '1vw'
            button.style.display = 'inline-flex'
            button.style.justifyContent = 'center'
            button.style.alignItems = 'center'
            button.style.height = '2vh'
            button.style.padding = '8px'
            if (index < 2){
                button.style.background = mainOrangeColor
            }
            if (index > 1){
                button.style.width = '5vw'
                button.onmouseover = (event) => {
                    if (!event.target.src){
                        event.target.style.background = mainOrangeColor
                        event.target.style.color = 'black'
                    }
                }
                button.onmouseleave = (event) => {
                    if (!event.target.src){
                        event.target.style.background = 'none'
                        event.target.style.color = mainWhiteColor
                    }
                }
            }
            if (index === 2){
                document.querySelectorAll('.custom-chat-button')[2].setAttribute('onclick','')
                button.onclick = () => {
                    autoScroll = !autoScroll
                    if (autoScroll){
                        document.getElementById('chat-autoscroll-button-check').src = 'images/check.png'
                    }else{
                        document.getElementById('chat-autoscroll-button-check').src = 'images/x.png'
                    }
                }
            }
        })
        document.querySelectorAll('.chat-area-send-button').forEach(button => {
            button.style.padding = "8px"
            button.style.background = mainLightColor
            button.style.color = mainWhiteColor
            button.style.border = '1px solid ' + mainOrangeColor
            button.value = button.value.charAt(0).toUpperCase() + button.value.slice(1)
        })
        document.querySelector('.chat-area-send-button').setAttribute('onclick','')
        document.querySelector('.chat-area-send-button').onclick = ()=> {doCommand(); window.chatSend()}
        chatInput.setAttribute('onkeydown','')
        chatView.onscroll = ()=>{
            if (chatSettings.pauseAutoscroll){
                if (autoScroll && chatView.scrollHeight != chatView.scrollTop + chatView.offsetHeight - 2){
                    autoScroll = false
                    document.getElementById('chat-autoscroll-button-check').src = 'images/x.png'
                }else{
                    if (chatView.scrollHeight == chatView.scrollTop + chatView.offsetHeight - 2){
                        autoScroll = true
                        document.getElementById('chat-autoscroll-button-check').src = 'images/check.png'
                    }
                }
            }
        }
    }
    function showChatMenu(event, playerName, isFriend){
        let offsetTop, offsetLeft
        chatSettings.chatOnSide ? offsetTop = 0 : offsetTop = 300
        chatSettings.chatOnSide ? offsetLeft = '50vw' : offsetLeft = 400
        event.pageY > (window.innerHeight - 100) ? offsetTop = 100 : offsetTop = 0
        if (document.getElementById('chat-rightclick-menu').style.display === 'none' && playerName !== window.var_username){
            document.getElementById('chat-rightclick-menu').style.top = (event.pageY - offsetTop) + 'px'
            document.getElementById('chat-rightclick-menu').style.left = (event.pageX-10)+ 'px'
            document.getElementById('chat-rightclick-menu-mute-settings').style.top = (event.pageY + offsetTop) + 'px'
            document.getElementById('chat-rightclick-menu-mute-settings').style.left = offsetLeft
            document.getElementById('chat-rightclick-menu').style.display = 'flex'
            document.getElementById('chat-rightclick-menu').className = playerName
            if (isFriend){
                let elem = document.getElementById('chat-rightclick-menu-add friend')
                elem.textContent = 'Remove friend'
                elem.onclick = () => changeMenu('remove friend')
            }
        }
    }
    function changeMenu(key){
        let playerName = document.getElementById('chat-rightclick-menu').className
        if (!playerName.startsWith('guest') && key == 'ignore'){
            playerName = playerName.replace(/_/g,' ')
        }
        //if (Object.keys(global_friendsAndIgnoreList).filter(x => global_friendsAndIgnoreList[x]=="friend").includes(playerName.replace(/_/g,' '))) key = 'remove friend'
        switch(key){
            case 'PM':
                document.getElementById('chat-rightclick-menu').style.display = 'none'
                chatInput.value = '/pm ' + playerName + ' '
                chatInput.focus()
                break
            case 'add friend':
                addFriend(playerName.replace(/_/g,' '))
                break
            case 'remove friend':
                sendBytes(`REMOVE_FRIEND=${playerName.replace(/_/g,' ')}`)
                break
            case 'ignore':
                addIgnore(playerName)
                break
            case 'mute':
                if(window.ModMod) {
                    window.ModMod.prefillMute(playerName, true, true);
                }
                else {
                    document.getElementById('chat-rightclick-menu').style.display = 'none'
                    document.getElementById('chat-rightclick-menu-mute-settings').style.display = 'flex'
                }
                break
            case 'ban':
                document.getElementById('chat-rightclick-menu').style.display = 'none'
                chatInput.value = '/smute ' + playerName + ' -1 0 '
                break
            case 'who is':
                if(window.ModMod) {
                    window.ModMod.whoIs(playerName, true);
                }else{
                    chatInput.value = '/whois ' + playerName.replace(/_/g,' ')
                }
                break
            case 'profile':
                window.open(`https://dh3.diamondhunt.co/hiscores/search.php?username=${playerName.replace(/_/g, ' ')}`)
                break
            case 'compare':
                window.open(`https://anwinity.com/dh3/compare/#p1=${window.var_username}&p2=${playerName.replace(/_/g,' ')}`)
                break
        }
    }
    function mutePlayer(configs){
        let playerName = document.getElementById('chat-rightclick-menu').className
        chatInput.value = '/smute ' + playerName + ' '
        configs.forEach(config=>{
            chatInput.value += config.value + ' '
        })
    }
    function inputClear(){
        document.getElementById('chat-rightclick-menu-mute-settings').style.display = 'none'
        document.querySelectorAll('#chat-rightclick-menu-mute-sub > input').forEach(input=>{input.value = ''})
    }
    function lookForEmoji(){
        let input = document.getElementById('search-emoji').value
        let buttons = document.querySelectorAll('#emoji-list > button')
        buttons.forEach(button=>{
            if (button.id.includes(input)){
                button.style.display = ''
            }else{
                button.style.display = 'none'
            }
        })
        if (input===''){emojiIndex++;changeEmojiWindow(false)}
    }
    function changeEmojiWindow(key){
        let buttons = document.querySelectorAll('#emoji-list > button')
        if (key){
            if (emojiIndex < (buttons.length / 100)-1){
                emojiIndex++
                document.querySelectorAll('#emoji-list > button:not([style*="display: none"])').forEach(e=>{e.style.display = 'none'})
                let temp = emojiIndex*100
                for (let i = temp; i < (temp + 100); i++){
                    i < buttons.length ? buttons[i].style.display = '' : null
                }
            }
        }else{
            if(emojiIndex>0){
                emojiIndex--
                document.querySelectorAll('#emoji-list > button:not([style*="display: none"])').forEach(e=>{e.style.display = 'none'})
                let temp = emojiIndex*10
                for (let i = temp; i < (temp + 100); i++){
                    i < buttons.length ? buttons[i].style.display = '' : null
                }
            }
        }
    }
    function chatOnTheSide(){
        if (!chatSettings.chatOnBottom){
            if (chatSettings.chatOnSide){
                game.style.width = '69%'
                chatArea.style.position = 'fixed'
                chatArea.style.top = '5%'
                chatArea.style.right = '0'
                chatArea.style.width = '30%'
                chatArea.style.height = '100vh'
                chatView.style.height = '77vh'
                chatInput.style.width = '100%'
                document.getElementById('extra-chat-settings').innerHTML = '<img src="https://img.icons8.com/cotton/64/000000/settings--v1.png" style="height: 4vh"/>'
                document.getElementById('extra-chat-settings').style.width = '1vw'
                document.getElementById('extra-chat-settings').style.border = 'none'
                document.querySelectorAll('.chat-area-send-button').forEach(button => {button.style.marginTop = '5px'})
                document.querySelectorAll('.custom-chat-button')[0].style.display = 'none'
                document.querySelectorAll('.custom-chat-button')[1].style.display = 'none'
                document.querySelectorAll('.tree-section').forEach(section => {section.style.height = '300px'})
                document.querySelectorAll('.tree-section > img').forEach(section => {section.style.height = '200px'})
                document.querySelectorAll('.plot-section').forEach(section => {section.style.height = '300px'})
                document.querySelectorAll('.plot-section > img').forEach(section => {section.style.height = '200px'})
                document.querySelectorAll('[id*=plot-section-shiny]').forEach(section => {section.style.width = '200px'})
                document.querySelector('#navigation-right-skills > a').style.right = '30vw'
                //document.querySelectorAll('.not-table-top-main-skills-item').forEach(e=>e.style.minWidth = '15%')
                //document.querySelectorAll('#table-top-main-items > tbody')[0].childNodes[0].childNodes[5].style.width = '30%'
            }else{
                game.style.width = '100%'
                chatArea.style.position = ''
                chatArea.style.top = ''
                chatArea.style.right = ''
                chatArea.style.width = ''
                chatArea.style.height = ''
                chatView.style.height = '300px'
                chatInput.style.width = ''
                document.getElementById('extra-chat-settings').style.border = '1px solid ' + mainOrangeColor
                document.getElementById('extra-chat-settings').style.width = '6vw'
                document.getElementById('extra-chat-settings').innerHTML = 'Settings'
                document.querySelectorAll('.chat-area-send-button').forEach(button => {button.style.marginTop = ''})
                document.querySelectorAll('.custom-chat-button')[0].style.display = ''
                document.querySelectorAll('.custom-chat-button')[1].style.display = ''
                document.querySelectorAll('.tree-section').forEach(section => {section.style.height = '350px'})
                document.querySelectorAll('.tree-section > img').forEach(section => {section.style.height = '250px'})
                document.querySelectorAll('.plot-section').forEach(section => {section.style.height = '350px'})
                document.querySelectorAll('.plot-section > img').forEach(section => {section.style.height = '250px'})
                document.querySelectorAll('[id*=plot-section-shiny]').forEach(section => {section.style.width = '250px'})
                document.querySelector('#navigation-right-skills > a').style.right = '10px'
                //document.querySelectorAll('.not-table-top-main-skills-item').forEach(e=>e.style.minWidth = '10%')
                //document.querySelectorAll('#table-top-main-items > tbody')[0].childNodes[0].childNodes[5].style.width = '25%'
            }
        }
    }

        function chatOnTheBottom(){
            if (!chatSettings.chatOnSide){
                if (chatSettings.chatOnBottom){
                    chatArea.style.position = 'sticky'
                    chatArea.style.bottom = '0'
                    chatArea.style.zIndex = '1000'
                }else{
                    chatArea.style.position = ''
                    chatArea.style.bottom = ''
                }
            }
        }

    // CREATING HTML ELEMENTS

    // create main element in body
    function createMainContainer(){
        let div = document.createElement('div')
        div.id = 'things-for-dh3'
        document.getElementById('body').appendChild(div)
        // $(div).insertBefore(document.querySelector('body > link'))
    }
    //create button in chat window
    function createChatSettings(ID,parentID,key){
        let div = document.createElement("div")
        let id = ID
        div.id = ID
        div.style = `background: ${mainLightColor}; border: 5px solid ${mainDarkColor}; border-radius: 10px; height: 200px; width: 400px; padding-bottom: 50px; display: none; flex-direction: row; flex-wrap: wrap; font-family: sans-serif; justify-content: center; position: absolute; z-index: 1000`
        // main menu
        if (!key){
            div.style.height = '400px'
            let wrapper = document.createElement("div")
            wrapper.style = 'display: flex; flex-direction: row; justify-content: center; height: 300px; width: 400px; margin-top: 20px;'
            let leftDiv = document.createElement("div")
            wrapper.style.width = '200px'
            let rightDiv = document.createElement("div")
            wrapper.style.width = '200px'
            let button = addButtonToSettings('pinging-button', 'Word Pinging', 'pingingOn', () => changeSettings('pinging-button', 'pingingOn', event))
            leftDiv.appendChild(button)
            button = addButtonToSettings('pm-pinging-button', 'PM Pinging', 'pingPM', () => changeSettings('pm-pinging-button' , 'pingPM'))
            leftDiv.appendChild(button)
            /*button = addButtonToSettings('twitchemotes-button','Twitch Emotes','twitchEmotes',()=>changeSettings('twitchemotes-button','twitchEmotes'))
            leftDiv.appendChild(button)*/
            button = addButtonToSettings('emoji-button', 'Display Emoji', 'emoji', () => changeSettings('emoji-button', 'emoji'))
            leftDiv.appendChild(button)
            button = addButtonToSettings('emoji-send-button-settings', 'Emoji Button', 'emojiButton', () => changeSettings('emoji-send-button', 'emojiButton'))
            leftDiv.appendChild(button)
            button = addButtonToSettings('chat-on-side', 'Side Chat', 'chatOnSide', () => {changeSettings('chat-on-side', 'chatOnSide'); chatOnTheSide()})
            leftDiv.appendChild(button)
            button = addButtonToSettings('chat-on-bottom', 'Sticky chat', 'chatOnBottom', () => {changeSettings('chat-on-bottom', 'chatOnBottom'); chatOnTheBottom()})
            leftDiv.appendChild(button)
            button = addButtonToSettings('chat-in-combat', 'Chat in combat', 'chatInCombat', () => {changeSettings('chat-in-combat', 'chatInCombat')})
            leftDiv.appendChild(button)
            button = addButtonToSettings('alternate-backgrounds', 'Alternate backgrounds', 'alternateBackgrounds', () => {changeSettings('alternate-backgrounds', 'alternateBackgrounds')})
            leftDiv.appendChild(button)
            button = addButtonToSettings('pause-autoscroll-onscroll', 'Pause Autoscroll on scroll', 'pauseAutoscroll', () => {changeSettings('pause-autoscroll-onscroll', 'pauseAutoscroll')})
            leftDiv.appendChild(button)

            button = createAdjustableElements('volume')
            rightDiv.appendChild(button)
            button = createAdjustableElements('fontSize')
            rightDiv.appendChild(button)

            button = addButtonToSettings('set-words-button', 'Set words', 'words', () => changeSettings('dialogue-set-words', 'words'))
            rightDiv.appendChild(button)
            //button = addButtonToSettings('chat-friendlist', 'Friend List', 'friends', () => changeSettings('dialogue-friendlist', 'friends'))
            //rightDiv.appendChild(button)
            //button = addButtonToSettings('chat-ignorelist', 'Ignore List', 'ignore', () => changeSettings('dialogue-ignorelist', 'ignore'))
            //rightDiv.appendChild(button)
            button = addButtonToSettings('chat-color-settings', 'Colors', 'color', () => changeSettings('dialogue-color-settings', 'color'))
            rightDiv.appendChild(button)

            wrapper.appendChild(leftDiv)
            wrapper.appendChild(rightDiv)
            div.appendChild(wrapper)
            // reset to default button
            let resetButton = document.createElement("div")
            resetButton.textContent = 'RESET EVERYTHING'
            resetButton.style = 'cursor: pointer; position: absolute; top: 90%; left: 70%; width: 110px; color: red; background: black; border: 1px solid white; border-radius: 5px;'
            resetButton.onclick = () => {
                loadSettingsFromStorage('reset')
                styleButtons()
                changeStyle('reset')
                chatOnTheSide()
                chatView.style.fontSize = chatSettings.fontSize + 'pt'
            }
            div.appendChild(resetButton)
            // words menu
        }else if (key === 'words'){
            let divChild = addForms('exact-words','Ping exactly those words:')
            div.appendChild(divChild)
            divChild = addForms('match-words','Ping any form of chosen words:')
            div.appendChild(divChild)
            //back button
            let backDiv = document.createElement("div")
            backDiv.onclick = () => {backButton('dialogue-set-words','dialogue-extra-chat-settings')}
            backDiv.className = "dialogue-button"
            backDiv.appendChild(document.createTextNode("Back"))
            backDiv.style = `cursor: pointer; position: absolute; top: 80%; left: 240px; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; color: ${mainWhiteColor}`
            div.appendChild(backDiv)
            // friends menu
        }else if (key === 'friends'){
            // inputs for friends
            div.style.justifyContent = 'center'
            div.style.margin = '0'
            let input = createInput('friendlist-name')
            div.appendChild(input)
            let button = document.createElement("button")
            button.textContent = 'Add'
            button.style.height = '36px'
            button.onclick = () => {addFriendIgnore('friend')}
            div.appendChild(button)
            let divChild = document.createElement('div')
            divChild.id = 'friend-list'
            divChild.style = 'height: 100px; width: 300px; margin-top: 5px; overflow-y: auto; display: flex; flex-wrap: wrap;'
            div.appendChild(divChild)
            //back button
            let backDiv = document.createElement("div")
            backDiv.onclick = () => {backButton('dialogue-friendlist','dialogue-extra-chat-settings')}
            backDiv.className = "dialogue-button"
            backDiv.appendChild(document.createTextNode("Back"))
            backDiv.style = `cursor: pointer; position: absolute; top: 80%; left: 240px; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; color: ${mainWhiteColor}`
            div.appendChild(backDiv)
        }else if (key === 'ignore'){
            // inputs for ignored
            div.style.justifyContent = 'center'
            div.style.margin = '0'
            let input = createInput('ignorelist-name')
            div.appendChild(input)
            let button = document.createElement("button")
            button.textContent = 'Add'
            button.style.height = '36px'
            button.onclick = () => {addFriendIgnore('ignore')}
            div.appendChild(button)
            let divChild = document.createElement('div')
            divChild.id = 'ignore-list'
            divChild.style = 'height: 100px; width: 300px; margin-top: 5px; overflow-y: auto; display: flex; flex-wrap: wrap;'
            div.appendChild(divChild)
            //back button
            let backDiv = document.createElement("div")
            backDiv.onclick = () => {backButton('dialogue-ignorelist','dialogue-extra-chat-settings')}
            backDiv.className = "dialogue-button"
            backDiv.appendChild(document.createTextNode("Back"))
            backDiv.style = `cursor: pointer; position: absolute; top: 80%; left: 240px; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; color: ${mainWhiteColor}`
            div.appendChild(backDiv)
        }else if (key === 'emoji'){
            div.style.justifyContent = 'center'
            div.style.margin = '0'
            div.style.height = '400px'
            let wrapper = document.createElement('div')
            wrapper.style = 'display: flex; flex-direction: row; margin-top: 20px;'
            let button = document.createElement('button')
            button.textContent = '<'
            button.style = `font-size: 26px; color: ${mainWhiteColor}; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; display: flex; align-items: center; height: 36px;`
            button.onclick = () => {changeEmojiWindow(false)}
            wrapper.appendChild(button)
            let input = document.createElement('input')
            input.id = 'search-emoji'
            input.style = `border: 1px solid ${mainOrangeColor}; height: 36px; margin: 0 5px 0 5px;`
            input.onkeyup = () => {lookForEmoji()}
            wrapper.appendChild(input)
            button = document.createElement('button')
            button.textContent = '>'
            button.style = `font-size: 26px; color: ${mainWhiteColor}; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; display: flex; align-items: center; height: 36px;`
            button.onclick = () => {changeEmojiWindow(true)}
            wrapper.appendChild(button)
            div.appendChild(wrapper)
            let divChild = document.createElement('div')
            divChild.id = 'emoji-list'
            divChild.style = 'height: 350px; width: 400px; margin-top: 5px; overflow-y: auto; display: flex; align-content: baseline; flex-wrap: wrap;'
            function addEmojiToDialogue(){
                if (allEmojis.length > (dhEmoji.length + betterEmotesKeys.length)){
                    allEmojis.forEach((emoji, index) => {
                        let button = document.createElement("button")
                        if (index < betterEmotesKeys.length){
                            button.innerHTML = `<img src="${betterEmotes[emoji]}" style="height:28px; width:auto;vertical-align:middle" title="${emoji}">`
                        }
                        else if (index >= betterEmotesKeys.length && index < (dhEmoji.length + betterEmotesKeys.length)){
                            button.innerHTML = `<img src="images/${emoji}.png" style="height:28px; width:auto;vertical-align:middle" title="${emoji}">`
                        }else{
                            button.innerHTML = `<i class="em em-${emoji}" style="height:28px;" title="${emoji}"></i>`
                        }
                        button.id = emoji
                        button.style.background = mainLightColor
                        button.style.border = 'none'
                        if (index < betterEmotesKeys.length){
                            button.onclick = () => {chatInput.value += emoji}
                        }else{
                            button.onclick = () => {chatInput.value += ' :' + emoji + ': '}
                        }
                        if (index > 100){
                            button.style.display = 'none'
                        }
                        divChild.appendChild(button)
                    })
                }else{
                    setTimeout(addEmojiToDialogue, 1000)
                }
            }
            addEmojiToDialogue()
            div.appendChild(divChild)
        }else if (key === 'color'){
            div.style.height = '400px'
            let divWrapper = document.createElement('div')
            divWrapper.style = 'height: 350px; margin-top: 10px; overflow-y: auto;'
            divWrapper.id = 'colorwrapper'
            let divChild = addForms('pingColor', 'Ping color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('chatFontColor', 'Chat font color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('mainBackgroundColor', 'Outter background: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('chatBackgroundColor', 'Chat background: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('chatBackgroundColor2', 'Alternate background: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('alternateFontColor', 'Alternate font color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('usernameColor', 'Username color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('serverColor', 'Server message color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('PMColor', 'Private message color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('friendColor', 'Friend color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('yourNameColor', 'Your name color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('devColor', 'Dev tag color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('financierColor', 'Financier tag color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('investorColor', 'Investor tag color: ')
            divWrapper.appendChild(divChild)
            divChild = addForms('moderatorColor', 'Moderator tag color: ')
            divWrapper.appendChild(divChild)

            //back button
            let backDiv = document.createElement("div")
            backDiv.onclick = () => {backButton('dialogue-color-settings', 'dialogue-extra-chat-settings')}
            backDiv.className = "dialogue-button"
            backDiv.appendChild(document.createTextNode("Back"))
            backDiv.style = `cursor: pointer; position: absolute; top: 80%; left: 240px; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; color: ${mainWhiteColor}`
            let resetButton = document.createElement("div")
            resetButton.textContent = 'RESET COLORS'
            resetButton.style = 'cursor: pointer; position: absolute; top: 90%; left: 80%; width: 75px; color: red; background: black; border: 1px solid white; border-radius: 5px;'
            resetButton.onclick = () => {
                loadSettingsFromStorage('resetcolors')
                changeStyle('reset')
            }
            div.appendChild(divWrapper)
            div.appendChild(resetButton)
            div.appendChild(backDiv)
        }
        //close button
        let closeDiv = document.createElement("div")
        closeDiv.onclick = () => {div.style.display = "none"}
        closeDiv.className = "dialogue-button"
        closeDiv.appendChild(document.createTextNode("Close"))
        closeDiv.style = `cursor: pointer; position: absolute; top: 80%; left: 169px; background: ${mainDarkColor}; border: 1px solid ${mainOrangeColor}; color: ${mainWhiteColor}`
        div.appendChild(closeDiv)
        document.getElementById(parentID).appendChild(div)
        styleButtons()
    }
    // create button above chat
    function createChatSettingsButton(){
        let button = document.createElement('span')
        button.onclick = (event) => openChatSettings(event,'dialogue-extra-chat-settings');
        button.id = 'extra-chat-settings'
        button.className = 'custom-chat-button'
        button.appendChild(document.createTextNode("Settings"))
        button.style = "width: 120px; font-size: 12pt"
        $(button).insertBefore(chatView)
    }

    function createEmojiButton(){
        let button = document.createElement('input')
        button.id = 'emoji-send-button'
        button.type = 'button'
        button.className = 'chat-area-send-button'
        button.style.marginLeft = '5px'
        button.onclick = (event) => openChatSettings(event,'dialogue-emoji')
        button.value = 'Emoji'
        chatSettings.emojiButton ? button.style.display = '' : button.style.display = 'none'
        $(button).insertAfter(document.querySelectorAll('.chat-area-send-button')[0])

    }
    // add buttons to main menu
    function addButtonToSettings(id, text, key, onclick){
        let div = document.createElement('div')
        let button =document.createElement('button')
        button.id = id
        button.onclick = onclick
        button.style = `background: ${mainDarkColor}; border: 1px solid ${mainLightColor}; font-size: 18px; width: 150px; height: 26px; border-radius: 5px; margin-left: 5px; color: red; text-align: left;`
        button.textContent = text
        if (key === 'alternateBackgrounds' || key === 'pauseAutoscroll'){
            button.style.height = '52px'
        }
        div.appendChild(button)
        return div
    }

    // create set words forms
    function addForms(key, text){
        let div = document.createElement('div')
        let span = document.createElement('span')
        span.textContent = text
        let form = document.createElement('form')
        form.id = key + '-form'
        form.style = 'display: flex; flex-direction: row; align-items: center;'
        let input = document.createElement('input')
        input.id = key + '-input'
        input.style = 'width: 300px; height: 35px; font-size: 20px;'
        let button = document.createElement('button')
        button.textContent = 'Save'
        button.style.height = '37px'
        if (key === 'exact-words'){
            span.textContent += '(commas between words)'
            input.value = chatSettings.exactWords
            button.onclick = (event) => addWords(key + '-input', 'exact')
        }else if (key === 'match-words'){
            span.textContent += '(commas between words)'
            input.value = chatSettings.matchWords
            button.onclick = (event) => addWords(key + '-input', 'match')
        }else{
            input.value = chatSettings.colors[key]
            button.onclick = (event) => {event.preventDefault(); changeSettings(key + '-input', key, input.value); changeStyle(key)}
            div.style = 'height: 50px; padding: 3px;'
            form.style.justifyContent = 'space-between'
            span.style = 'margin-right: 3px; width: 160px; font-size: 12pt; font-weight: bold'
            input.style = 'font-size: 16px; border: 1px solid white; height: 25px; width: 160px;'
            button.style.height = '27px'
            function addSpectrum(){
                if($.fn.spectrum !== undefined){
                    $('#' + key + '-input').spectrum({
                        type: "text",
                        showButtons: false,
                        allowEmpty: false,
                        showInitial: true
                    })
                }else{
                    setTimeout(addSpectrum, 1000)
                }
            }
            addSpectrum()
        }
        form.appendChild(span)
        form.appendChild(input)
        form.appendChild(button)
        div.appendChild(form)
        return div
    }

    // create volume change element
    function createAdjustableElements(key){
        let div = document.createElement('div')
        div.style = `font-family: sans-serif; font-size: 18px; width: 205px; height: 22px; display: flex; border: 1px solid ${mainLightColor}; flex-direction: row; justify-content: space-between; color: ${mainWhiteColor}; margin-left: 5px;`
        let divChild = document.createElement('div')
        divChild.style = `display: flex; flex-direction: row; justify-content: center; align-items: center; margin-left: 5px;`
        let span, button
        span = document.createElement('span')
        span.style = `width: 150px; border-radius: 5px; padding-left: 7px; background: ${mainDarkColor}`
        switch (key){
            case 'volume':
                span.id = 'chat-settings-volume'
                span.textContent = 'Volume: ' + chatSettings.volume
                div.appendChild(span)
                button = createPlusMinusButton('volume', 'images/plus_tiny.png', '+')
                divChild.appendChild(button)
                button = createPlusMinusButton('volume', 'images/minus_tiny.png', '-')
                divChild.appendChild(button)
                break
            case 'fontSize':
                span.id = 'chat-settings-font'
                span.textContent = 'Font Size: ' + chatSettings.fontSize + 'pt'
                div.appendChild(span)
                button = createPlusMinusButton('fontSize', 'images/plus_tiny.png', '+')
                divChild.appendChild(button)
                button = createPlusMinusButton('fontSize', 'images/minus_tiny.png', '-')
                divChild.appendChild(button)
                break
        }
        div.appendChild(divChild)
        return div
    }

    function createPlusMinusButton(key, source, value){
        let button = document.createElement('button')
        button.style = `background: ${mainOrangeColor}; border: none; height: 22px; width: 22px; margin: 2px; display: flex; justify-content: center; align-items: center;`
        switch (key){
            case 'volume':
                button.onclick = () => {changeSettings('chat-settings-volume', 'volume', value)}
                break
            case 'fontSize':
                button.onclick = () => {changeSettings('chat-settings-font', 'fontSize', value)}
                break
        }
        let img = document.createElement('img')
        img.src = source
        img.style.height = '12px'
        img.style.width = '12px'
        button.appendChild(img)
        return button
    }
    //createListDiv(name, key)
    function createListDiv(name, key){
        let list
        let div = document.createElement('div')
        if (key === 'friend'){
            list = document.getElementById('friend-list')
            div.id = 'friend-' + name
        }else{
            list = document.getElementById('ignore-list')
            div.id = 'ignored-' + name
        }
        div.style = `display: flex; flex-direction: row; align-items: center; height: 18px; background: ${mainDarkColor}; border-radius: 20px; margin-right: 5px; padding:3px; width: auto`
        let span = document.createElement('span')
        span.style = 'text-align: center; font-size: 16px; height: 18px'
        span.textContent = name
        div.appendChild(span)
        let button = document.createElement('button')
        let img = document.createElement('img')
        img.src = '/images/x.png'
        img.style.height = '16px'
        img.style.width = '16px'
        button.appendChild(img)
        button.style = 'height: 20px; width: 20px; background: none; border: none; display: flex; justify-content: center; aling-items: center;'
        if (key === 'friend'){
            button.onclick = (event) =>{removeFromList(name, 'friend')}
        }else{
            button.onclick = (event) =>{removeFromList(name, 'ignore')}
        }
        div.appendChild(button)
        list.appendChild(div)
    }
    // create inputs for friend list
    function createInput(id){
        let input = document.createElement('input')
        input.id = id
        input.style.height = '35px'
        input.style.width = '100px'
        input.style.fontSize = '20px'
        return input
    }
    function createRightClickMenu(){
        let div = document.createElement('div')
        let height
        div.id = 'chat-rightclick-menu'
        if (playerIsMod || window.var_username === 'shtos' || window.var_username === 'pickle rick'){
            height = '210px'
        }else{
            height = '150px'
        }
        div.style = `height: ${height}; width: 150px; position: absolute; display: none; flex-direction: column; align-items: center; background: #e1e1e1; border: 1px solid black; border-radius: 4px; font-family: sans-serif; font-size: 16px; z-index: 1000;`
        div.onmouseleave = () => {document.getElementById('chat-rightclick-menu').style.display = 'none'}
        document.getElementById('things-for-dh3').appendChild(div)
    }

    function createMenuButtons(){
        let rightClickButtons
        if (playerIsMod || window.var_username === 'shtos' || window.var_username === 'pickle rick' ){
            rightClickButtons = ['PM', 'profile', 'compare', 'add friend', 'ignore', 'mute', 'ban', 'who is']
        }else{
            rightClickButtons = ['PM', 'profile', 'compare', 'add friend', 'ignore']
        }
        rightClickButtons.forEach(id=>{
            let button = document.createElement('div')
            button.id = 'chat-rightclick-menu-' + id
            button.style = 'height: 30px; width: 147px; font-family: sans-serif; font-size: 20px; color: black; border-radius: 4px; cursor: pointer; margin-left: 1px; padding-left: 2px;'
            button.textContent = id.charAt(0).toUpperCase() + id.slice(1)
            button.onclick = () => {changeMenu(id)}
            button.onmouseenter = () => {button.style.background = '#37dde6'}
            button.onmouseleave = () => {button.style.background = '#e1e1e1'}
            document.getElementById('chat-rightclick-menu').appendChild(button)
        })
    }
    function createMuteMenu(){
        let div = document.createElement('div')
        div.id = 'chat-rightclick-menu-mute-settings'
        div.style = 'height: 180px; width: 300px; position: absolute; display: none; flex-direction: column; align-items: center; justify-content: center; background: #e1e1e1; border: 3px solid #F56387; border-radius: 2px; font-family: sans-serif; font-size: 16px; z-index: 100;'
        let inputDiv = document.createElement('div')
        inputDiv.id = 'chat-rightclick-menu-mute-sub'
        inputDiv.style = `display: flex; flex-direction: column; flex-wrap: wrap; justify-content: center;`
        let input = document.createElement('input')
        input.id = 'chat-rightclick-menu-mute-time'
        input.placeholder = 'Hours'
        input.style = 'width: 250px; height: 30px; font-size: 25px; margin-top: 3px;'
        inputDiv.appendChild(input)
        input = document.createElement('input')
        input.id = 'chat-rightclick-menu-mute-type'
        input.placeholder = 'Normal or IP mute'
        input.style = 'width: 250px; height: 30px; font-size: 25px; margin-top: 3px;'
        inputDiv.appendChild(input)
        input = document.createElement('input')
        input.id = 'chat-rightclick-menu-mute-reason'
        input.placeholder = 'Reason'
        input.style = 'width: 250px; height: 30px; font-size: 25px; margin-top: 3px;'
        inputDiv.appendChild(input)
        let button = document.createElement('button')
        button.textContent = 'Mute'
        button.style = 'border: 1px solid $F56387; margin-top: 2px'
        button.onclick = () => {
            mutePlayer(document.querySelectorAll('#chat-rightclick-menu-mute-sub > input'))
            inputClear()
        }
        inputDiv.appendChild(button)
        button = document.createElement('button')
        button.style = 'border: 1px solid $F56387; margin-top: 2px'
        button.textContent = 'Cancel'
        button.onclick = () => {inputClear()}
        inputDiv.appendChild(button)
        div.appendChild(inputDiv)
        document.getElementById('things-for-dh3').appendChild(div)
    }
})();
