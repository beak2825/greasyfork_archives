// ==UserScript==
// @name        ShufflR
// @namespace   VoteToClose
// @description Shuffle a YouTube playlist
// @include     https://www.youtube.com/playlist*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16990/ShufflR.user.js
// @updateURL https://update.greasyfork.org/scripts/16990/ShufflR.meta.js
// ==/UserScript==
html_md=true
main=()=>document.getElementById('browse-items-primary').children[0].children[0]
items=[]
//while(main().children[1]) main().children[1].click() //TODO: fix infinite while loop
content=main().children[0].children[0]
for(i=0;i<content.children.length;i++){
  el=content.children[i].children[3].children[0]
  text=el.text.trim().replace(/\s?\[[^\]]*\]\s?-?\s?/g, '')
  href=el.href
  items.push(md?`[${text}](${href})`:html?`<li><a href="${href}">${text}</a></li>`:html_md?`<li>[${text}](${href})</li>`:`${text}: ${href}`)
}
window.shuffled=[]
while(items.length){
  rand=Math.floor(Math.random()*(items.length))
  shuffled.push(items[rand])
  items.splice(rand,1)
}
if(html||html_md){
  div=document.createElement('div')
  div.innerHTML=`<ul style="list-style:none">${shuffled.join('')}</ul>`
  document.body.prependChild(div)
}