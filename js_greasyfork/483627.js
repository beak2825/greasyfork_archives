// ==UserScript==
// @name        doubleTouchClose
// @version      2024.1.1
// @description  waitting you to change
// @author       You
// @include     *
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @license MIT
// @namespace https://greasyfork.org/users/1210231
// @downloadURL https://update.greasyfork.org/scripts/483627/doubleTouchClose.user.js
// @updateURL https://update.greasyfork.org/scripts/483627/doubleTouchClose.meta.js
// ==/UserScript==
$(function(){
	//adddoubleTouch()
	doubleTouch(()=>{})
})
function adddoubleTouch(){
	let menu = $('<button>close</button>').css({
	    position: "fixed",
	    width: '100vw',
	    height: '10vh',
	    'z-index': 9999999,
	    'background-color': 'red',
	    'font-size':'3vh',
	}).click(() => {  })
	$('body').append(menu.hide())
	let showMenu = (y) => {menu.css('top',y).show() }
	
	let dobleTouchAction = null
	let dobleTouchTick = 300
	let clearDobleTouch = () => { dobleTouchAction = null }
	let setDobleTouch = (e) => {
	    dobleTouchAction = () => {
	        let touch = e.changedTouches[0]
	        let y = touch.clientY
	        showMenu(y)
	    }
	}
	$('body').on('touchstart', () => {
	    if (dobleTouchAction) { dobleTouchAction() }else{menu.hide()}
	})
	$('body').on('touchend', (e) => {
	    setDobleTouch(e)
	    setTimeout(clearDobleTouch, dobleTouchTick)
	})
	$('body').on('touchmove', () => {
		clearDobleTouch()
	})
}
function doubleTouch( callback) {
	let menu = $('<button>close</button>').css({
	    position: "fixed",
	    width: '100vw',
	    height: '10vh',
	    'z-index': 9999999,
	    'background-color': 'red',
	    'font-size':'3vh',
	}).click(() => { window.close() })
	$('body').append(menu.hide())
	let showMenu = (y) => {menu.css('top',y);menu.show() }
	
  let lastTouchTime = 0;
  document.addEventListener('touchend', function(e) {
    const now = new Date().getTime();
	console.log('touchend')
    if (now - lastTouchTime <= 300) {
		let touch = e.changedTouches[0]
		let y = touch.clientY
		console.log(y)
		showMenu(y)
        callback();
    }else{menu.hide()}
    lastTouchTime = now;
  });
}