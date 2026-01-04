// ==UserScript==
// @name     Małpy jebać prądem
// @version  2
// @grant    none
// @include  https://joemonster.org/*
// @namespace https://greasyfork.org/users/791009
// @description Automatyczna zmiana małp na dwukropki
// @downloadURL https://update.greasyfork.org/scripts/428985/Ma%C5%82py%20jeba%C4%87%20pr%C4%85dem.user.js
// @updateURL https://update.greasyfork.org/scripts/428985/Ma%C5%82py%20jeba%C4%87%20pr%C4%85dem.meta.js
// ==/UserScript==

console.debug('Jebiemy małpy prądem')
const ta = document.getElementById('postform')
if (ta) {
  ta.addEventListener('keyup', () => {
    if (ta.value.indexOf('@') !== -1) {
      ta.value = ta.value.replace('@', ':')
    }
  })
}

const pm = document.querySelector('.pms_link')

if (pm) {
  pm.addEventListener('click', event => {
    if (event.button == 0) {
      event.preventDefault()
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.top = '40px'
      container.style.left = (pm.getBoundingClientRect().left - 100) + 'px'
      container.style.border = 'solid 1px black'
      container.style.width = '200px';
      container.style.height = '300px';
      container.style.overflowX = 'hidden';
      container.style.overflowY = 'scroll';
      container.style.backgroundColor = 'white'
      container.style.zIndex = '10000'
      document.body.appendChild(container)
      const d = new FormData
      d.set('param1', 'received')
      d.set('param2', '1')
      fetch('https://joemonster.org/modules/message/message.php?funkcja=pm_list', {method: 'POST', body: d}).then(r => r.text())
        .then(body => {
        const div = document.createElement('div')
        div.innerHTML = body
        div.querySelectorAll('.pmessages_list').forEach(e => {
          
          let m = /(\w+) wspomniał o Tobie/.exec(e.querySelector('.pmessage_title a').textContent)
          if (m) {
            const read = e.querySelector('.pmessage_title').classList.contains('bold')
            const link = document.createElement('a')
            const nickname = m[1]
            const content = e.querySelector('.pmessage_title a').title
            	.replace('Post: ', '')
            	.replace(/@\w+/g, '')
            	.replace('Post znajduje się tutaj:', '')
            	.replace('<br>', '')
            	.replace('Komentarz:', '')
            link.innerHTML = '<img width="30" height="30" src="https://img.joemonster.org/i/ludzie/' + nickname.toLowerCase() + '60.jpg">'
            link.innerHTML += content
            link.title = content
            link.style.textOverflow = 'ellipsis'
            link.style.overflow = 'hidden'
  					link.style.whiteSpace = 'nowrap'
            link.style.height = '30px'
            link.style.cursor = 'pointer'
            link.style.display = 'block'
            if (read) {
            	link.style.fontWeight = 'bold'
            }
            container.appendChild(link)
            const img = link.querySelector('img')
            img.title = nickname
            img.onerror = () => img.src = 'https://img.joemonster.org/images/brak-foto60.gif'
            
            link.onclick = event => {
              const id = e.querySelector('.pmessage_title a').getAttribute('href').substring(1)
              const d = new FormData
      				d.set('param1', id)
              fetch('https://joemonster.org/modules/message/message.php?funkcja=show', {method: 'POST', body: d}).then(r => r.text())
                .then(body => {
                const url = /Post znajduje się tutaj:\s+<a href="(https:\/\/joemonster.org\/phorum\/read.php.+#\d+)" target/.exec(body)[1]
                if (event.button == 0) {
                	location.href = url
                }
                if (event.button == 1) {
                	open(url)
                }
              })
            }
          }
        })
      })
      setTimeout(() => {
        window.addEventListener('click', event => {
          if (!container.contains(event.target)) {
            container.remove()
          }
        })
      }, 50)
    }
    
  })
  
}