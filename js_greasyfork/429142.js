// ==UserScript==
// @name        Myanimelist.net - Kitsunekko.net Japanese subtitle indicator
// @namespace   Violentmonkey Scripts
// @match       https://myanimelist.net/*
// @grant       none
// @version     1.0
// @author      -
// @description Displays an icon next to animes that have Japanese subtitles on kitsunekko. Due to browser security features, the script requires manual updating of the subtitles list. Instructions will appear on MyAnimeList after installing the script.
// @downloadURL https://update.greasyfork.org/scripts/429142/Myanimelistnet%20-%20Kitsunekkonet%20Japanese%20subtitle%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/429142/Myanimelistnet%20-%20Kitsunekkonet%20Japanese%20subtitle%20indicator.meta.js
// ==/UserScript==

console.log('userscript running')

let kitsunekkoSet = null

function formatTitle(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .replace(/ +/g, ' ')
}

function checkAnimeAvailability(name) {
  const formatted = formatTitle(name)
  return kitsunekkoSet.get(formatted)
}

window.checkAnimeAvailability = checkAnimeAvailability

function compileList(raw) {
  const rows = raw.split('\n')
  const titles = rows.map(row => (row.trim().match(/^(.*?)[\s]+[0-9]+ [a-z]+$/) || [])[1]).filter(a => a)
  
  const formatted = titles.map(title => {
    const formattedTitle = formatTitle(title)
    return [ formattedTitle, { orig: title, formatted: formattedTitle } ]
  })
  return new Map(formatted)
}



//---------------------------

function makeSubtitleLink(anime) {
  const query = anime.orig.replace(/ /g, '+')
  const href = `https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F${query}%2F`
  
  const a = document.createElement('a')
  a.style = `
    font-size: 10px;
    font-weight: bold;
    background: red;
    color: white;
    border-radius: 20%;
    padding: 1.5px;
    margin: 0 0 0 3px;
  `;
  a.href = href
  a.appendChild(document.createTextNode('字幕'))
  return a;
}

function runCheckTitle(node) {
  const title = node.textContent
  const match = checkAnimeAvailability(title)
  if (!match) {
    console.log(`JP subtitles not found for "${title}"`)
    return null;
  }
  node.appendChild(makeSubtitleLink(match))
  return match
}

function runCheckAnimeThumb(node) {
  const title = node.querySelector('.title').textContent
  const match = checkAnimeAvailability(title)
  console.log('match:', match)
  if (!match) {
    console.log(`JP subtitles not found for "${title}"`)
    return null;
  }
  const subtitleLink = makeSubtitleLink(match)
  subtitleLink.style.position = "absolute";
  subtitleLink.style.zIndex = "9999";
  subtitleLink.style.marginTop = "3px";
  node.insertBefore(subtitleLink, node.firstChild)
  return match
}

function runCheckEpisodeThumb(node) {
  const title = node.querySelector('.external-link').textContent
  const match = checkAnimeAvailability(title)
  console.log('match:', match)
  if (!match) {
    console.log(`JP subtitles not found for "${title}"`)
    return null;
  }
  const subtitleLink = makeSubtitleLink(match)
  subtitleLink.style.position = "absolute";
  subtitleLink.style.zIndex = "9999";
  subtitleLink.style.marginTop = "3px";
  node.insertBefore(subtitleLink, node.firstChild)
  return match
}



function runChecks() {
  let matched = []
  
  const titles = [
    document.querySelectorAll('.title-name'),
    document.querySelectorAll('.title-english'),
    
    document.querySelectorAll('.ranking-unit .title'),
    document.querySelectorAll('.recommendations_h3 a:not([title=""])'),
    document.querySelectorAll('.reviews_h3 a'),
  ].map(nodelist => [...nodelist]).flat()
  matched = [ ...matched, ...titles.map(runCheckTitle) ]
  
  const animeThumbs = [...document.querySelectorAll('.btn-anime:not(.episode)')]
  matched = [ ...matched, ...animeThumbs.map(runCheckAnimeThumb) ]
  
  const episodeThumbs = [...document.querySelectorAll('.btn-anime.episode')]
  matched = [ ...matched, ...episodeThumbs.map(runCheckEpisodeThumb) ]
  
  matched = matched.filter(a => a)
  return matched
}


function setupKitsunekkoListInput({ empty=false }) {
  const openInputContainer = document.createElement('p')
  openInputContainer.classList.add("footer-link")
  const openButton = document.createElement('a');
  openButton.appendChild(document.createTextNode('字幕設定'));
  openInputContainer.appendChild(openButton);
  
  const explanation = document.createElement('p')
  explanation.style = `
    padding: 1em;
    background: white;
    color: black;
  `
  explanation.innerHTML = `

  The values in this script needs to be updated manually.<br>
  1. Go to the <a href="https://kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F">kitsunekko.net directory</a>.<br>
  2. Select and copy the list of anime links<br>
<br>
  e.g.:<br>
<code style="text-align: left; display: inline-block;">.hack G.U 	10 months<br>
3-gatsu no Lion 	5 months<br>
5-tou ni Naritai 	7 years<br>
07-Ghost 	3 weeks<br>
7SEEDS 	11 months<br>
11eyes 	11 months<br>
...</code><br>
    <br>
  3. Paste in the box below and submit.<br>
    <br>
    <br>
    To update the list again in the future, click on the <code>字幕設定</code> link in the footer.
  `
  
  const modalBg = document.createElement('div')
  modalBg.style = `
    position: fixed;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: 9999999;
    background: rgba(0,0,0,0.5);
    display: none;
  `;
  modalBg.onclick = (ev) => { if (ev.target === modalBg) { closeModal(); } }
  
  const modal = document.createElement('div')
  modal.style = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    
    display: flex;
    flex-flow: column nowrap;
    padding: 1em;
    background: white;
  `
  modalBg.appendChild(modal)
  
  const input = document.createElement('textarea');
  const submit = document.createElement('button');
  submit.appendChild(document.createTextNode('Update subbed anime list'))
  submit.onclick = () => {
    const raw = input.value
    localStorage.setItem('kitsunekkoListRaw', raw);
    
    setTimeout(() => location.reload(), 500)
  }
  modal.appendChild(explanation)
  modal.appendChild(input)
  modal.appendChild(submit)
  
  function openModal() { modalBg.style.display = 'block'; }
  function closeModal() { modalBg.style.display = 'none'; }
  openButton.onclick = openModal
  
  document.body.insertBefore(modalBg, document.body.firstElement)
  document.querySelector('.footer-link-block').appendChild(openInputContainer)
  
  if (empty) { openModal() }
}


function main() {
  const KITSUNEKKO_LIST_RAW = localStorage.getItem('kitsunekkoListRaw')
  const empty = KITSUNEKKO_LIST_RAW ? false : true
  setupKitsunekkoListInput({ empty: empty, })
  
  if (!empty) {  
    const subsMap = compileList(KITSUNEKKO_LIST_RAW)
    kitsunekkoSet = subsMap


    const matched = runChecks()
    setTimeout(() => {
      console.log(`Found ${matched.length} anime(s) with japanese subs:`, matched.map(anime => anime.orig))
    }, 500)
  }
  
}
setTimeout(main)