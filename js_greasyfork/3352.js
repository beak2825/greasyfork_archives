// ==UserScript==
// @name          defBackgroundUp
// @description   Replace background colors #FFFFFF rgb(255, 255, 255) in #EDF2EB rgb(237, 242, 235) or #ECF2EA rgb(236, 242, 234), natural and ergonomic background colors to view; Reduce eye strain.
// @include       *
// grant    none
// @namespace     https://greasyfork.org/en/users/3561-lucianolll
// @namespace     https://openuserjs.org/users/lucianolll
// @version     22
// @downloadURL https://update.greasyfork.org/scripts/3352/defBackgroundUp.user.js
// @updateURL https://update.greasyfork.org/scripts/3352/defBackgroundUp.meta.js
// ==/UserScript==
const genfc={
confBackg(){
	const doc=document,gtb=(ds)=>{if(getComputedStyle(ds,null).backgroundColor==='rgb(255, 255, 255)'){return true;} return false;},tmp=[];
   ['body','table','td','div','html','dl','ul','pre'].map(ta=>tmp.push(...Array.from(doc.getElementsByTagName(ta)).filter(gtb)));
	tmp.map(s=>s.style.backgroundColor='#edf2eb');
},
};
   addEventListener('load',genfc.confBackg(),false);