// ==UserScript==
// @name User At Hover - Libreddit
// @version 1.2.0
// @description hover at clickable user link to see user flair.
// @include *://libredd.it*
// @include *://libreddit.spike.codes*
// @include *://libreddit.dothq.co*
// @include *://libreddit.kavin.rocks*
// @include *://reddit.invak.id*
// @include *://reddit.phii.me*
// @include *://lr.riverside.rocks*
// @include *://libreddit.strongthany.cc*
// @include *://libreddit.database.red*
// @include *://libreddit.privacy.com.de*
// @include *://libreddit.domain.glass*
// @include *://libreddit.sugoma.tk*
// @include *://libreddit.jamiethalacker.dev*
// @include *://reddit.artemislena.eu*
// @include *://r.nf*
// @include *://libreddit.some-things.org*
// @include *://reddit.stuehieyr.com*
// @include *://lr.mint.lgbt*
// @include *://libreddit.igna.rocks*
// @include *://libreddit.autarkic.org*
// @include *://libreddit.flux.industries*
// @include *://libreddit.drivet.xyz*
// @include *://lr.oversold.host*
// @include *://libreddit.de*
// @include *://libreddit.pussthecat.org*
// @include *://libreddit.mutahar.rocks*
// @include *://libreddit.northboot.xyz*
// @include *://leddit.xyz*
// @include *://de.leddit.xyz*
// @include *://lr.cowfee.moe*
// @include *://libreddit.hu*
// @include *://libreddit.totaldarkness.net*
// @include *://libreddit.esmailelbob.xyz*
// @include *://lr.vern.cc*
// @include *://libreddit.nl*
// @include *://lr.stilic.ml*
// @include *://reddi.tk*
// @include *://libreddit.bus-hit.me*
// @include *://libreddit.datatunnel.xyz*
// @include *://libreddit.crewz.me*
// @include *://r.walkx.org*
// @include *://libreddit.kylrth.com*
// @include *://libreddit.yonalee.eu*
// @include *://libreddit.winscloud.net*
// @include *://libreddit.tiekoetter.com*
// @include *://reddit.rtrace.io*
// @include *://libreddit.lunar.icu*
// @include *://libreddit.privacydev.net*
// @include *://libreddit.notyourcomputer.net*
// @include *://r.ahwx.org*
// @include *://bob.fr.to*
// @include *://reddit.beparanoid.de*
// @include *://libreddit.dcs0.hu*
// @icon data:image/png;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8fHwAfHx8AHx8fAB8fHwAfHx8CHx8fKh8fH20fHx+tHx8f2h8fH/MfHx/9Hx8f/R8fH/MfHx/aHx8frR8fH20fHx8qHx8fAh8fHwAfHx8AHx8fAB8fHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfHx8AHx8fAB8fHwAfHx8BHx8fNx8fH5gfHx/gHx8f/B8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/B8fH+AfHx+YHx8fNx8fHwEfHx8AHx8fAB8fHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHx8fAB8fHwAfHx8AHx8fGR8fH4ofHx/rHx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx/rHx8fih8fHxkfHx8AHx8fAB8fHwAAAAAAAAAAAAAAAAAAAAAAAAAAAB8fHwAfHx8AHx8fAB8fHzUfHx/DHx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8fwx8fHzUfHx8AHx8fAB8fHwAAAAAAAAAAAAAAAAAfHx8AHx8fAB8fHwAfHx9BHx8f2h8fH/8fHx//Hx8f/x4eHv8dHR3/HR0d/x0dHf8dHR3/HR0d/x0dHf8dHR3/HR0d/x0dHf8dHR3/HR0d/x0dHf8eHh7/Hx8f/x8fH/8fHx//Hx8f2h8fH0EfHx8AHx8fAB8fHwAAAAAAHx8fAB8fHwAfHx8AHx8fNR8fH9ofHx//Hx8f/x8fH/8hISH/NjY2/zo6Ov86Ojr/Ojo6/zo6Ov86Ojr/Ojo6/zo6Ov86Ojr/Ojo6/zo6Ov86Ojr/Ojo6/zY2Nv8hISH/Hx8f/x8fH/8fHx//Hx8f2h8fHzUfHx8AHx8fAB8fHwAfHx8AHx8fAB8fHxkfHx/DHx8f/x8fH/8fHx//Hh4e/zExMf/FxcX/5ubm/+Tk5P/k5OT/5OTk/+Tk5P/k5OT/5OTk/+Tk5P/k5OT/5OTk/+Tk5P/m5ub/xcXF/zExMf8eHh7/Hx8f/x8fH/8fHx//Hx8fwx8fHxkfHx8AHx8fAB8fHwAfHx8BHx8fih8fH/8fHx//Hx8f/x8fH/8eHh7/MzMz/97e3v/////////////////////////////////////////////////////////////////e3t7/MzMz/x4eHv8fHx//Hx8f/x8fH/8fHx//Hx8fih8fHwEfHx8AHx8fAB8fHzcfHx/rHx8f/x8fH/8fHx//Hx8f/x4eHv8zMzP/3Nzc/////////////////////////////////////////////////////////////////9zc3P8zMzP/Hh4e/x8fH/8fHx//Hx8f/x8fH/8fHx/rHx8fNx8fHwAfHx8CHx8fmB8fH/8fHx//Hx8f/x8fH/8fHx//Hh4e/zMzM//c3Nz/////////////////////////////////////////////////////////////////3Nzc/zMzM/8eHh7/Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx+YHx8fAh8fHyofHx/gHx8f/x8fH/8fHx//Hx8f/x8fH/8eHh7/MzMz/9zc3P////////////////+zs7P/dHR0/3R0d/90dHf/dHR3/3R0d/91dXb/dnZ2/3d3d/9paWn/Jycn/x4eHv8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH98fHx8qHx8fbR8fH/wfHx//Hx8f/x8fH/8fHx//Hx8f/x4eHv8zMzP/3Nzc/////////////////4CAgP8cHBf/OjoX/z4+Fv8+Phb/Pj4W/ykpGf8aGhv/Gxsb/xwcHP8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/B8fH20fHx+tHx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hh4e/zMzM//c3Nz/////////////////gYGD/zQ0GP/S0gb/7e0D/+vrA//r6wP/b28U/xsbH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8frR8fH9ofHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8eHh7/MzMz/9zc3P////////////////+BgYP/NjYY/+XlBP///wD///8A////AP93dxP/Gxsg/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx/aHx8f8x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x4eHv8zMzP/3Nzc/////////////////4GBg/82Nhj/5OQE////AP///wD///8A/3Z2E/8bGyD/Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/MfHx/9Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hh4e/zMzM//c3Nz/////////////////gYGD/zY2GP/k5AT///8A////AP///wD/dnYT/xsbIP8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/R8fH/0fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8eHh7/MzMz/9zc3P////////////////+BgYP/NjYY/+TkBP///wD///8A////AP92dhP/Gxsg/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx/9Hx8f8x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x4eHv8zMzP/3Nzc/////////////////4GBg/82Nhj/5OQE////AP///wD///8A/3Z2E/8bGyD/Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/MfHx/aHx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hh4e/zMzM//c3Nz/////////////////gYGD/zY2GP/k5AT///8A////AP///wD/dnYT/xsbIP8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f2h8fH60fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8eHh7/MzMz/9zc3P////////////////+BgYP/NjYY/+TkBP///wD///8A////AP92dhP/Gxsg/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx+tHx8fbR8fH/wfHx//Hx8f/x8fH/8fHx//Hx8f/x4eHv8zMzP/3Nzc/////////////////4GBg/82Nhj/5OQE////AP///wD///8A/3R0E/8XFyD/Gxsg/xwcH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/B8fH20fHx8qHx8f4B8fH/8fHx//Hx8f/x8fH/8fHx//Hh4e/zMzM//c3Nz/////////////////gYGD/zY2GP/k5AT///8A////AP///wD/pKQN/2hoFf9raxT/X18W/yYmHv8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx/gHx8fKh8fHwIfHx+YHx8f/x8fH/8fHx//Hx8f/x8fH/8eHh7/MzMz/9zc3P////////////////+BgYP/NjYY/+TkBP///wD///8A////AP/+/gD//f0A////AP/b2wX/MzMc/x4eH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH5gfHx8CHx8fAB8fHzcfHx/rHx8f/x8fH/8fHx//Hx8f/x4eHv8zMzP/3Nzc/////////////////4GBg/82Nhj/5OQE////AP///wD///8A////AP///wD///8A/9zcBf8zMxz/Hh4f/x8fH/8fHx//Hx8f/x8fH/8fHx/rHx8fNx8fHwAfHx8AHx8fAR8fH4ofHx//Hx8f/x8fH/8fHx//Hh4e/zMzM//d3d3/////////////////gYGD/zY2GP/l5QT///8A////AP///wD///8A////AP///wD/3d0F/zMzHP8eHh//Hx8f/x8fH/8fHx//Hx8f/x8fH4oeHh4BHx8fAB8fHwAfHx8AHx8fGR8fH8MfHx//Hx8f/x8fH/8eHh7/MTEx/8vLy//t7e3/6+vr/+3t7f94eHr/NDQY/9LSBv/t7QP/6+sD/+vrA//r6wP/6+sD/+3tAv/Lywf/MTEc/x4eH/8fHx//Hx8f/x8fH/8fHx/DHx8fGR8fHwAfHx8AHx8fAB8fHwAfHx8AHx8fNR8fH9ofHx//Hx8f/x8fH/8iIiL/PT09/0JCQv9CQkL/QkJC/y4uL/8jIx7/Pj4b/0JCGv9CQhr/QkIa/0JCGv9CQhr/QkIa/z09G/8iIh//Hx8f/x8fH/8fHx//Hx8f2h8fHzUfHx8AHx8fAB8fHwAAAAAAHx8fAB8fHwAfHx8AHx8fQR8fH9ofHx//Hx8f/x8fH/8dHR3/HR0d/x0dHf8dHR3/Hh4e/x8fH/8dHR//HR0f/x0dH/8dHR//HR0f/x0dH/8dHR//HR0f/x8fH/8fHx//Hx8f/x8fH9ofHx9BHx8fAB8fHwAfHx8AAAAAAAAAAAAAAAAAHx8fAB8fHwAfHx8AHx8fNR8fH8MfHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx/DHx8fNR8fHwAfHx8AHx8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAHx8fAB8fHwAfHx8AHx8fGR8fH4ofHx/rHx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx/rHx8fih8fHxkfHx8AHx8fAB8fHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHx8fAB8fHwAfHx8AHh4eAR8fHzcfHx+YHx8f4B8fH/wfHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/8fHx//Hx8f/x8fH/wfHx/fHx8fmB8fHzcfHx8BHx8fAB8fHwAfHx8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHx8fAB8fHwAfHx8AHx8fAB8fHwIfHx8qHx8fbR8fH60fHx/aHx8f8x8fH/0fHx/9Hx8f8x8fH9ofHx+tHx8fbR8fHyofHx8CHx8fAB8fHwAfHx8AHx8fAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4AB//4AAH/8AAA/+AAAH/AAAA/gAAAHwAAAA4AAAAGAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPgAAAH8AAAD/gAAB/8AAA//gAAf/+AAf8=
// @grant none
// @run-at document-end
// @license GPL-3.0-or-later
// @namespace -
// @downloadURL https://update.greasyfork.org/scripts/448021/User%20At%20Hover%20-%20Libreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/448021/User%20At%20Hover%20-%20Libreddit.meta.js
// ==/UserScript==

let style = document.createElement('style')
style.textContent = `
.user-popup::before {
  content: '';
  width: 10px;
  height: 10px;
  display: block;
  position: absolute;
  top: -6px;
  left: 44%;
  border-right: 1px solid var(--highlighted);
  border-top: 1px solid var(--highlighted);
  rotate: -45deg;
  background: var(--post);
}

.user-popup {
  position: absolute;
  width: 100px;
  background-color: var(--post);
  z-index: 1;
  border: var(--panel-border);
  border-radius: 5px;
	text-align: center;
  word-break: break-word;
	place-content: center;
	display: grid;
	animation: .1s 0s 1 normal userPopup both running linear;
}

.user-popup-img {
  width: 80px;
  margin-top: 10px;
  border-radius: 5px;
  background: var(--foreground);
	border: var(--panel-border);
}

.user-popup-karma {
	color: var(--accent);
}

.d-none {
  display: none;
}

@keyframes userPopup {
	0% {
		opacity: 0;
		transform: translateY(10px);
	}
}`
document.head.appendChild(style)

document.querySelectorAll('[class*="author"][href*="/user/"], [class*="author"][href*="/u/"]').forEach(e => {
  e.dataset.parsed = '0'
  e.addEventListener('mouseenter', () => {
    if(e.dataset.parsed === '0') {
    	e.dataset.parsed = '1'
  		fetch(e.href).then(r => r.text()).then(c => {
  			let doc = new DOMParser().parseFromString(c, 'text/html'),
    	  	avatar = doc.querySelector('#user_icon').src,
    	  	name = doc.querySelector('#user_name').textContent.slice(2),
    	    karma = +doc.querySelector('#user_details > :nth-child(3)').textContent,
    	    created = doc.querySelector('#user_details > :nth-child(4)').textContent,
    	    popup = document.createElement('div'),
    	    popupImg = document.createElement('img'),
    	    popupName = document.createElement('span'),
          popupKarma = document.createElement('span')
    	    y = e.offsetTop,
    	    x = e.offsetLeft

    	  popup.style.top = y+25+'px'
    	  popup.style.left = x+'px'
    	  popup.className = 'user-popup'
        popupImg.className = 'user-popup-img'
        popupImg.src = avatar
        popupImg.alt = name
        if(name.length > 9) popupImg.style.margin = (name.length/2)+'px auto'
        popupName.textContent = name
        popupKarma.textContent = karma
        popupKarma.className = 'user-popup-karma'
        popup.appendChild(popupImg)
        popup.appendChild(popupName)
        popup.appendChild(popupKarma)
    	  e.insertAdjacentElement('afterend', popup)
  		})
    } else {
    	let pop = e.nextElementSibling,
          pop2 = pop.nextElementSibling,
    	    y = e.offsetTop,
    	    x = e.offsetLeft

      if(pop2.className.indexOf('user-popup') != -1) pop2.remove()

    	pop.style.top = y+25+'px'
    	pop.style.left = x+'px'
      pop.classList.remove('d-none')
    }
  })
  e.addEventListener('mouseleave', () => {
    e.nextElementSibling.classList.add('d-none')
  })
})