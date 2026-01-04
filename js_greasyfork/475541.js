// ==UserScript==
// @name         Super Anki
// @version      9
// @grant        none
// @match        https://*.ankiuser.net/**
// @match        https://*.ankiweb.net/decks
// @description  Supercharges AnkiWeb. Currently Supported Functionality - Show card total, done and remaining count per session - Dark Mode
// @namespace    asleepysamurai.com
// @license      BSD Zero Clause License
// @downloadURL https://update.greasyfork.org/scripts/475541/Super%20Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/475541/Super%20Anki.meta.js
// ==/UserScript==

const version = GM_info.script.version
const key = 'super-anki-data'

function readLocalStorage(){
  return JSON.parse(localStorage.getItem(key)) || {}
}

function writeLocalStorage(dataDiff = {}){
  const data = {...readLocalStorage(), ...dataDiff}
  localStorage.setItem(key, JSON.stringify(data))
  return data
}

function initSpeechSynthesis(){
  addSpeakButtons()
  //speakAllOnCardSide()
  
  const observer = new MutationObserver(() => {
    addSpeakButtons()
    //speakAllOnCardSide()
  })

  const qaNode = document.querySelector('#qa')
  observer.observe(qaNode, { characterData: false, attributes: false, childList: true, subtree: false });
}

let isSpeaking = false
const speakerIcon = String.fromCodePoint(0x1F508)
const speakingIcon = String.fromCodePoint(0x1F50A)

function say(voice, text, button){
  if(isSpeaking){
    return
  }
  
  isSpeaking = true
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voice
    
  utterThis.addEventListener('end', (evt) => {
    button.textContent = speakerIcon
    isSpeaking = false
  })

  button.textContent = speakingIcon
  window.speechSynthesis.speak(utterThis)
}

function addSpeakButton(voice, speakableTextNode, childNodes = [speakableTextNode]){
  if(!speakableTextNode.textContent.trim()){
      return
  }

  const speakButton = document.createElement('div')
  speakButton.textContent = speakerIcon
  speakButton.setAttribute('style', 'padding-right: 0.5rem;font-size: 2rem;cursor: pointer')
  speakButton.classList.add('speak-button')
  speakButton.addEventListener('click', (ev)=>{
    say(voice, speakableTextNode.textContent.trim(), ev.currentTarget)
  })

  const container = document.createElement('div')
  const wordContainer = document.createElement('div')

  container.appendChild(speakButton)
  container.appendChild(wordContainer)
  container.setAttribute('style', 'display: flex;justify-content: center;align-items: center;')

  speakableTextNode.parentNode.insertBefore(container, speakableTextNode)
  childNodes.forEach(node => wordContainer.appendChild(node))
}

function addDESpeakButton(speakableTextNode, childNodes = [speakableTextNode]){
  const deVoice = window.speechSynthesis.getVoices().find(v=>v.lang==='de-DE')
  if(!deVoice){
    console.log('No German Support')
    return false
  }
  
  addSpeakButton(deVoice, speakableTextNode, childNodes)
}

function addENSpeakButton(speakableTextNodes = []){
  const enVoice = window.speechSynthesis.getVoices().find(v=>v.lang==='en-US')
  if(!enVoice){
    console.log('No English Support')
    return false
  }
  
  const speakButton = document.createElement('span')
  speakButton.textContent = speakerIcon
  speakButton.setAttribute('style', 'padding-right: 0.5rem;font-size: 2rem;cursor: pointer')
  speakButton.classList.add('speak-button')

  speakableTextNodes.forEach(node=>addSpeakButton(enVoice, node))
}

function addSpeakButtons(){
  const word = document.querySelector('.word')
  const ipa = document.querySelector('.ipa')
  addDESpeakButton(word, [word,ipa])

  const deSentence = document.querySelectorAll('.spanish')
  deSentence.forEach(deSentence=>addDESpeakButton(deSentence))

  const definitions = Array.from(document.querySelectorAll('.definition'))
  addENSpeakButton(definitions)

  const enSentences = document.querySelectorAll('.english')
  addENSpeakButton(enSentences)
}

function speakAllOnCardSide(){
  const [deVoice, enVoice] = window.speechSynthesis.getVoices().reduce((voices,v)=>{
    if(v.lang==='en-US'){
      voices[1] = v
    } else if(v.lang === 'de-DE'){
      voices[0] = v
    }

    return voices
  },[])

  function getUtterance(node, voice){
    const text = node?.innerText?.trim() || ''
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice
    return utterance
  }

  const utterances = [
    document.querySelector('.word'), 
    ...Array.from(document.querySelectorAll('.definition'))
  ].map((node,i)=>getUtterance(node, i === 0 ? deVoice : enVoice))

  utterances.forEach(u=>{
    window.speechSynthesis.speak(u)
    const pause = new SpeechSynthesisUtterance(', !')
    pause.voice = enVoice
    window.speechSynthesis.speak(pause)
  })
}

function initMediaSession(){
  if (! "mediaSession" in navigator) {
    return
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: "SuperAnki",
    artist: `v${version}`,
    artwork: [
      {
        src: "https://ankiuser.net/logo.png",
        type: "image/png",
      },
    ],
  });

  navigator.mediaSession.setActionHandler("play", () => {
    speakAllOnCardSide()
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    window.speechSynthesis.cancel()
  });
  navigator.mediaSession.setActionHandler("stop", () => {
    window.speechSynthesis.cancel()
  });

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    const againButton = Array.from(document.querySelectorAll('.btn.m-1')).find(b=>b.innerText.toLowerCase() === 'again')
    againButton.dispatchEvent(new PointerEvent('click'))
  });
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    const goodButton = Array.from(document.querySelectorAll('.btn.m-1')).find(b=>b.innerText.toLowerCase() === 'good')
    const showAnswerButton = Array.from(document.querySelectorAll('.btn.btn-lg')).find(b=>b.innerText.toLowerCase() === 'show answer')
    (goodButton||showAnswerButton).dispatchEvent(new PointerEvent('click'))
  });
}

function getTodaysDoneCount(done){
  const now = new Date()
  const cutOffTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0)
  if(now.getHours() < 4){
    cutOffTime.setTime(cutOffTime.getTime() - (1000 * 60 * 60 * 24))
  }

  const savedData = readLocalStorage()
  if(done === 0 && savedData.doneCount !== undefined && savedData.lastDoneTime && savedData.lastDoneTime >= cutOffTime.getTime()){
    done = savedData.doneCount
  }
  
  writeLocalStorage({doneCount: done, lastDoneTime: now.getTime()})
  return done
}

function formatCounts(total, remaining){
  const done = getTodaysDoneCount(total - remaining)
  return `${remaining} Left + ${done} Done = ${total}`
}

function addTotalCount(){
  const counts = Array.from(document.querySelectorAll('.count'))
  
  const equals = document.createTextNode(' = ')
  
  const totalCards = counts.reduce((total, thisCount) => total + parseInt(thisCount.innerText), 0)
  const totalCount = counts[0].cloneNode(true)
  totalCount.innerText = formatCounts(totalCards, totalCards)
  totalCount.classList.remove('active', 'new', 'learn', 'review')
  
  const countParent = counts[0].parentElement
  countParent.appendChild(equals)
  countParent.appendChild(totalCount)
  
  const observer = new MutationObserver(() => {
    const restCards = counts.reduce((total, thisCount) => total + parseInt(thisCount.innerText), 0)
    totalCount.innerText = formatCounts(totalCards, restCards)
  })

  counts.forEach(countNode => observer.observe(countNode, { characterData: true, attributes: false, childList: true, subtree: true }));
}

function setupObserver(){
  try{
    init()
  }catch(err){
    setTimeout(() => {
    	setupObserver()
    }, 100)
  }
}

function enableDarkMode(){
  const style = document.documentElement.getAttribute('style')
  document.documentElement.setAttribute('style', `${style || ''}; filter: invert(0.9);`)
}

function updateBranding(){
  document.querySelector('.navbar-brand > span').innerHTML = `SuperAnki <small><small>v${version}</small></small>`
}

function init(){
  updateBranding()
  enableDarkMode()
  
  if(window.location.pathname.toLowerCase().startsWith('/study')){
    addTotalCount()
    initSpeechSynthesis()
    initMediaSession()
  }
}

setupObserver()
