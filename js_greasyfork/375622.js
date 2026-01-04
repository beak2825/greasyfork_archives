// ==UserScript==
// @name BetterFollowingList
// @namespace Morimasa
// @author Morimasa
// @description Tweaks to following lists on media pages
// @match https://anilist.co/*
// @grant none
// @license GPL-3.0-or-later
// @version 0.08
// @downloadURL https://update.greasyfork.org/scripts/375622/BetterFollowingList.user.js
// @updateURL https://update.greasyfork.org/scripts/375622/BetterFollowingList.meta.js
// ==/UserScript==
let apiCalls = 0;
const scoremap = {'smile': 85, 'meh': 60, 'frown': 35} // the same as anilist
const stats = {
  element: null,
  count:0,
  scoreSum:0,
  scoreCount:0
}

const scoreProcess = e => {
  let el = e.querySelector('span') || e.querySelector('svg');
  let light = document.body.classList[0]==='site-theme-dark'?45:38;
  if (el===null) return;
  else if (el.nodeName==='svg'){
    // smiley
    let color = scoremap[el.dataset.icon]>70?120:scoremap[el.dataset.icon]<50?10:60;
    el.childNodes[0].setAttribute('fill', `hsl(${color}, 100%, ${light}%)`)
    
    addScore(0.5, scoremap[el.dataset.icon]*0.5) // 0.5 weight same as hoh script
  }
  else if (el.nodeName==='SPAN'){
    let score = el.innerText.split('/');
    score = score.length==1?parseInt(score)*20-10:parseInt(score[1])==10?parseFloat(score[0])*10:parseInt(score[0]); // convert stars, 10 point and 10 point decimal to 100 point
    el.style.color = `hsl(${score*1.2}, 100%, ${light}%)`;
    if (score>100) console.log('why score is bigger than 100?', el);
    addScore(1, score)
  }
}

const addScore = (count, score) => {
  stats.scoreCount+=count;
  stats.scoreSum+=score;
}

const handler = (data, target, idMap) => {
  if (target===undefined) return;
  data.forEach(e=>{
    target[idMap[e.user.id]].style.gridTemplateColumns='30px 1.3fr .7fr .6fr .2fr .2fr .5fr'; //css is my passion
    const progress = document.createElement('DIV');
    progress.innerText = `${e.progress}/${e.media.chapters||e.media.episodes||'?'}`;
    target[idMap[e.user.id]].insertBefore(progress, target[idMap[e.user.id]].children[2])
    
    let notesEL = document.createElement('span') // notes
    if (e.notes){
      notesEL = createIcon('notes', e.notes, "M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z");
    }
    target[idMap[e.user.id]].insertBefore(notesEL, target[idMap[e.user.id]].children[4])
    
    let rewatchEL = document.createElement('span'); // rewatches
    if (e.repeat){
      rewatchEL = createIcon('repeat', e.repeat, "M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z");
    }
    target[idMap[e.user.id]].insertBefore(rewatchEL, target[idMap[e.user.id]].children[4])
  })
}

const createIcon = (cssClass, text, d) => {
  let el = document.createElement('span');
  el.className = cssClass;
  el.setAttribute('title', text);
  el.innerHTML = `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-redo-alt fa-w-16"><path fill="currentColor" d="${d}"></path></svg>`;
  return el;
}

const getAPI = (target, elMap) => {
    let user = [];
    for (let u in elMap) user.push(u);
    if (user.length===0) return;
    console.log(`%cBetterFollowingList`, 'color:white;background:#888;padding:4px;border-radius:4px;', `quering ${user.length} users | ${++apiCalls} api calls since reload`)
    const mediaID = window.location.pathname.split("/")[2];
    const query = 'query($u:[Int],$media:Int){Page{mediaList(userId_in:$u,mediaId:$media){progress notes repeat user{id}media{chapters episodes}}}}'
    const vars = {u: user, media: mediaID};
	const options = {
		method: 'POST',
		body: JSON.stringify({query: query, variables: vars}),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	};
	return fetch('https://graphql.anilist.co/', options)
	.then(res => res.json())
	.then(res => handler(res.data.Page.mediaList, target, elMap))
	.catch(error => console.error(`Error: ${error}`));
}

const createStat = (text, number) => {
  let el = document.createElement('span');
  el.innerText = text;
  el.appendChild(document.createElement('span'))
  el.children[0].innerText = number
  return el
}

const MakeStats = () => {
  if(stats.element) return; // element already injected
  let main = document.createElement('h2');
  let count = createStat('Users: ', stats.count);
  main.append(count);
  
  let avg = createStat('Avg: ', 0);
  avg.style.float='right';
  main.append(avg);
  
  const parent = document.querySelector('.following');
  if (parent!==null){
    parent.prepend(main);
    stats.element = main;
  }

}

let observer = new MutationObserver(() => {
  if (window.location.pathname.match(/\/(anime|manga)\/\d+\/.+\/social/)){
    MakeStats();
    const follows = document.querySelectorAll('.follow');
    let idmap = {};
    follows.forEach((e, i)=>{
    if (!e.dataset.changed){
      const avatarURL = e.querySelector('.avatar').dataset.src;
      if (!avatarURL || avatarURL==="https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png") return
      const id = avatarURL.split('/').pop().match(/\d+/g)[0];
      idmap[id] = i;
      // process score
      scoreProcess(e);
      // add user count
      ++stats.count;
      // set state
      e.dataset.changed=true;
      }
    })
   if (Object.keys(idmap).length>0){
     getAPI(follows, idmap);
     
     let statsElements = stats.element.querySelectorAll('span>span');
     statsElements[0].innerText = stats.count;
     const avgScore = parseInt(stats.scoreSum/stats.scoreCount)||0;
     if (avgScore>0){
       statsElements[1].style.color=`hsl(${avgScore*1.2}, 100%, 40%)`
       statsElements[1].innerText = `${avgScore}%`;
     }
     else statsElements[1].parentNode.remove(); // no need if no scores

   }
  }
  else {
    // reset
    stats.element=null;
    stats.count=0;
    stats.scoreSum=0;
    stats.scoreCount=0;
  }
});
observer.observe(document.getElementById('app'), {childList: true, subtree: true, attributes: true});
