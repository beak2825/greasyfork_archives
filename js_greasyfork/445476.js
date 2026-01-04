// ==UserScript==
// @name Bruteforce Jackbox Room Code
// @namespace -
// @description creates button at upper right corner to bruteforce room code.
// @author NotYou
// @version 2.0.1
// @include *jackbox.*/
// @include *jackbox.*/#/
// @include *jackbox.tv/
// @include *jackbox.fun/
// @include *jackbox.tv/#/
// @include *jackbox.fun/#/
// @exclude *jackbox.whatif.one/*
// @run-at document-end
// @license GPL-3.0-or-later
// @icon data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEvUlEQVRYhcWXW2xTdRzHP+e0Pe0uwrqVratluNJtsA0W2GBcvSBTXGZi8IFI1BiNiS+C8UFJ1JgQEqMPvPGi8ITxkgyNBOck6BSGIOMmZreOCqPbunUb3dr1ftbjw9il62UlCvsmJ+fk/G7f/+X3+/3/Avt6FRYR4uznQjwejHwOAWGe4nyDByMXiYMw7/1g5QkIPFyop6YiGVtIKpcDMGqbkuktIGXfn/0sgVTBiTeWg2R1HufVwtvUVa0AoO3mCY525TJc/haotant46T3k4YBN7X2Tzj62uOY8w0xooGRUXZ/cZHuyo9AJaXtMv09oERZc/MwjW/XxwUHMBlyaXyjlvz2I6CkP6b068BAGwefKSI7Q5dAd2qdzfkGDtUqMNKZaAQLEUidx6oxO5WWFcxuKmXOM2vbsKWaTGdrgoCJ/avjOSXI48BdRMc5/MF6frPf4mZfH1azmdqK1WRopRjbDK2WLCGAP806kIDAHIR94GxDZ2vk4M4C7P1O3N4JioyFnGy9QDAcYdemGhRF4c/2Lnr6+ghFZAI+DcihBBkRj+R1wD+C5sQL7CjJQc6YZNyXSUVxEWMTPt5vaSesNrD27hgAYxM+Pvv6BBlLc9m7rYbV498RbDnPUOYqRow7iVrqQUg8I4nrQMhD4fVDHNj3ImbjMv5qt6GahI7bDqqsxTy3thSNJNHe0kw4IvPzpavoq59kfcUqOq+3smVjFSXWYkoeW06nvZtPf72Ms3w/6HLiQsXUAbHnJJt1HRTiZE9dNXk5S2cUFUXh7riXoDdAlqimxFhAv2uEmlVWjv10hvJSC145jMGgR61WxQTx+QMc/fEyP/o3IZfuBkFMTICeU9RHGtn/yvM4nC4sRabECwcMuEY5f+EawXCYl3Y/i1qlitOJyDJ3+ocwGQ1kaLXYbjl4rzmMZ927MzqxdaCkgSb9Pg4c+R5ZlpmcnEwYPBqNcvXvLgaGh5A0Cs0tfxCNRmNmy+kaoW9wGEuRCUmt4eK1do41XcUrGZMvwQwRrxPztY9586nlbF5fGTM674Sfb06exmLKY8zrQytp0C/JYtgTpOHp7URkmd7+QUwFBkRR5PS5Nn644cWR3wDWXaDSMFtHhBS9YDLCI7+/w4ZsBxVlVuq2b2TQNcqpM2epXbMSSaOhd8CFTpIoMOQQjsjYegdZUbQcS5GJX1rbcI+5afJUEd36YaosSAKVBkVvpa5Gj2t0nMOff0nukmy2ritDvOdMEIQZv5JGTcXKR7nc3kNHVzdVZcXorCaaL+iJJgl+j0Dyfj0RzcAfCGHKz8WUn5tQR5jjXBAENlRa5ymk7ndiqn4tZuZy4x8XvkCQYNiN2+NBUZSZaj4dfLojTEMBJvxBmq44kJetTUlg4fOAz0VW93Fet9p4eVc5567cQVGmTj9jXh+22wNsqLTOkPEHQpztGKRVeIJQ2R7QZP5HAtMIjKK3f8WOzEusNhsRBOgfGkUnSYQiMipRxD4S4jzbCJbtBSkrLbdzCKR5Ngy40dq+pVppI081jiFnCcFQmJZhI4PrPgCdPrV9cgLzFZMRuvc/GoHhTvDcgZyVkFcKoip9+wXrwEPCot8LxMW6E84hcJ/3gv9ZvuhL8C9NI+mNpU5sFQAAAABJRU5ErkJggg==
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/445476/Bruteforce%20Jackbox%20Room%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/445476/Bruteforce%20Jackbox%20Room%20Code.meta.js
// ==/UserScript==

window.bruteforceInterval = 3000

let

icon = {
	play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
  	<path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
	</svg>`,
	pause: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
  	<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
	</svg>`,
	fast: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
		<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
	</svg>`
},

btn = document.createElement('button'),
set = document.createElement('button'),
style = document.createElement('style')
style.textContent = `
#bruteforce-roomcode {
	position: fixed;
	top: 20px;
	right: 20px;
	border-radius: 50%;
	background: rgb(0, 0, 0) none repeat scroll 0% 0%;
	color: rgb(255, 255, 255);
	width: 60px;
	height: 60px;
	border: 0px none;
	cursor: pointer;
	z-index: 1;
}

#bruteforce-roomcode-fast {
  position: absolute;
  background-color: rgb(111, 111, 111);
  border-radius: 50%;
  right: 5px;
	top: 38px;
	height: 22px;
	padding: 3px;
	border: 0;
	cursor: pointer;
	z-index: 2;
}`
document.head.appendChild(style)
btn.innerHTML = icon.play
btn.id = 'bruteforce-roomcode'
btn.onclick = start

set.innerHTML = icon.fast
set.id = 'bruteforce-roomcode-fast'
set.style.color = 'rgb(255, 255, 255)'
set.onclick = fast

document.body.appendChild(btn)
document.body.appendChild(set)

function random() {
  let result = '', value = [
    'A', 'B', 'C',
    'D', 'E', 'F',
    'G', 'H', 'I',
    'J', 'K', 'L',
    'M', 'N', 'O',
    'P', 'Q', 'R',
    'S', 'T', 'U',
    'V', 'W', 'X',
    'Y', 'Z'
  ]
  for (let i = 0; i < 4; i++) result += value[~~(Math.random() * value.length)]
  return result
}

function start() {
  btn.innerHTML = icon.pause
  btn.onclick = stop
  let code = document.querySelector('#roomcode')
  let event = new InputEvent('input', {type: 'input'})
	code.value = random()
  code.dispatchEvent(event)
  window.bruteforce = setInterval(() => {
    let status = document.querySelector('[name="roomcode"] > .status')
    if (!status||status.innerText === 'Room not found'||status.innerText === ''||status.innerText === 'Комната не найдена!') {
			code.value = random()
  		code.dispatchEvent(event)
    }
    else stop()
  }, window.bruteforceInterval)
}

function stop() {
  btn.innerHTML = icon.play
  btn.onclick = start
  clearInterval(window.bruteforce)
}

function fast() {
  let el = document.querySelector('#bruteforce-roomcode-fast')
  el.style.color = el.style.color === 'rgb(255, 255, 255)'
  	? 'rgb(255, 227, 0)'
  	: 'rgb(255, 255, 255)'
	window.bruteforceInterval = window.bruteforceInterval === 3000
  	? 1500
  	: 3000
  for(let i = 0; i < 2; i++) document.querySelector('#bruteforce-roomcode').click()
}
