// ==UserScript==
// @name        iCV Highlighter lite
// @namespace   iCV
// @description highlights new posts for iCV without overloading the server. results are less accurate when posts have replies
// @author      DE8
// @version     2.1
// @match       https://www.icv-crew.com/forum/index.php?board=*
// @grant       none
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/462714/iCV%20Highlighter%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/462714/iCV%20Highlighter%20lite.meta.js
// ==/UserScript==

const removeNewIcon =true;
const removeTags =true;


const today = 'oggi';
const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('it-it', { day: '2-digit', month: 'long', year: 'numeric' });


const removeElementsBy = (filter) => document.querySelectorAll(filter).forEach(el => el.remove());

const setColor = (post, color) => post.querySelector('span[id^="msg_"] >a').style.color = color;

const setFontWeight = (post, weight) => post.querySelector('span[id^="msg_"] >a').style.fontWeight = weight; 
 
const srinkMoved = () =>[...document.querySelectorAll('div.windowbg.locked')]
  												.filter(e => !e.classList.contains('sticky'))
                          .forEach(e => e.innerHTML = `${e.querySelector('.preview').innerHTML}`);

function inspectPost(post) {
  
  const lastPostDate = post.querySelector('div.lastpost > p :first-child').innerText.toLowerCase();
  const lastReplyBy = [...post.querySelectorAll('div.lastpost > p > a')].slice(-1)[0].innerText.trim();
  const openBy = post.querySelector('p.floatleft').innerText.trim();
  
  if (lastPostDate.includes(today) && openBy.includes(lastReplyBy)) {
    setColor(post, 'DarkOrange');
    setFontWeight(post, 700);
    return;
  }
  
  if (lastPostDate.includes(yesterday) && openBy.includes(lastReplyBy))
    return setColor(post, 'Orange');
  
  	return setColor(post, 'Gray');
}



if(removeNewIcon)
	removeElementsBy('[id^="newicon"]');

if(removeTags){
  removeElementsBy('ul.tags');
  removeElementsBy('div + br');
}
  
srinkMoved();

[...document.querySelectorAll('div.windowbg')]
  .filter(e => !e.classList.contains('locked'))
  .forEach( p => inspectPost(p));