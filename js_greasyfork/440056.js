// ==UserScript==
// @name         read auto scroll
// @include      *
// @supportURL   https://github.com/sxlgkxk/browser_script/issues
// @version      0.1
// @description  auto scroll
// @namespace    http://sxlgkxk.github.io/
// @author       sxlgkxk
// @icon         http://sxlgkxk.github.io/im/avatar.jpg
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440056/read%20auto%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/440056/read%20auto%20scroll.meta.js
// ==/UserScript==

(function(){

let is_move=(localStorage.getItem('is_move')=='true');
let speed=1;
let entering_nextpage=false;
let speed_cnt=0;
let speed_factor=localStorage.getItem('speed_factor');
speed_factor=speed_factor?parseInt(speed_factor):1

// move function
function move() {
	if (is_move) {
		speed_cnt=(speed_cnt+1)%speed_factor;
		if(speed_cnt==0)
			window.scrollBy(0, speed);
		if((window.innerHeight + window.scrollY) +5 >= document.body.scrollHeight){
			notepanel = document.querySelector("textarea.notePanel");
			if (!notepanel || notepanel.hidden)
				if (!entering_nextpage){
					entering_nextpage=true
					setTimeout(()=>{
						let next_dom=document.querySelector('body > div.mainContainer.clearfix > div.chapter-detail > div.container.full > div.control-group > a.chapter-direction.nextChapter')
						if(!next_dom) next_dom=document.querySelector('#content-wrapper > section > div > div > div.col-md-8.col-xs-12.section-left > div.content.wl > div > div.text-right > a')
						if(location.href+'#'!=next_dom.href){
							setInterval(()=>{
								notepanel = document.querySelector("textarea.notePanel");
								if (!notepanel || notepanel.hidden)
									location.href=next_dom.href
							},1000*3)
						}
					}, 1000*60)
				}
		}
	}
	requestAnimationFrame(move);
}
move()

// move button dom insert
body=document.querySelector('body')
move_button=document.createElement('button')
document.body.before(move_button)

// move button style
move_button.innerHTML='move'
move_button.style.fontWeight='bold'
move_button.style.color='#fff'
move_button.style.backgroundColor='#333'
move_button.style.position='fixed'
move_button.style.bottom='100px'
move_button.style.right='50px'
move_button.style.width='50px'
move_button.style.height='50px'
move_button.style.opacity=0.8
move_button.style.zIndex=1
move_button.onclick=()=>{
	if(document.documentElement["scrollTop"]<50){
		new_speed_factor=prompt("speed factor?", speed_factor)
		speed_factor=new_speed_factor?parseInt(new_speed_factor):speed_factor
		localStorage.setItem("speed_factor", speed_factor)
	}
	is_move=!is_move;
	if(!is_move)
		setTimeout(()=>{
			is_move=true;
			localStorage.setItem('is_move', is_move);
		}, 1000*30)

	localStorage.setItem('is_move', is_move);
}

// move shortcut
document.addEventListener("keydown", function(event) {
	if (event.ctrlKey && event.altKey && (event.key=="m"||event.key=="d")){
		move_button.click()
	}
});

})();