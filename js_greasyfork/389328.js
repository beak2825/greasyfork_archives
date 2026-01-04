// ==UserScript==
// @name        BotBuster
// @namespace   hello://astrolopitheque.fr
// @author      astrolopitheque
// @description Script anti-spam pour JVC
// @version     1.2
// @icon        https://www.dropbox.com/s/5wiyryouux3padk/BotBusterIcon.png?raw=1
// @match       *://www.jeuxvideo.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.notification 
// @downloadURL https://update.greasyfork.org/scripts/389328/BotBuster.user.js
// @updateURL https://update.greasyfork.org/scripts/389328/BotBuster.meta.js
// ==/UserScript==

class LocalArray {
	constructor(key) {
  	this._key = key
  }
  async get() {
    let a
    try {
      a = JSON.parse(await GM.getValue(this._key))
    } catch(e){
      return []
    }
    return a
  }
  async set(array) {
  	await GM.setValue(this._key, JSON.stringify(array))
  }
  async push(value) {
  	const array = await this.get()
    if(!array.includes(value))
    	array.push(value)
    this.set(array)
  }
  async remove(value) {
  	const array = await this.get()
    const index = array.indexOf(value)
    if(index > -1)
      array.splice(index, 1)
    this.set(array)
  }
}

const getPseudo = () => {
	return $('.account-pseudo').first().text()
}

const createButton = (p) => {
 	const button = document.createElement('span')
 	button.classList.add('bot-buster-button')
 	button.setAttribute('title', 'BotBuster')
  button.setAttribute('pseudo', p)
 	return button
}

const addButtons = (pseudo) => {
  const pseudos = $('.bloc-pseudo-msg')
	$('.bloc-options-msg').each( (i, el) => {
    const p = pseudos.eq(i).text().trim()
    if( p !== pseudo )
			$(el).append( createButton(p) )
	})
}

const addOptions = async () => {
	await $.get( 'https://www.dropbox.com/s/ut7716l274nov1a/optionsHTML.txt?raw=1', function( data ) {
  	$('body').append(data)
	})
}

const showOptions = () => {
	$('#bot-buster-opt').css('display', 'block')
}

const hideOptions = () => {
	$('#bot-buster-opt').css('display', 'none')
}

const getInfos = async (pseudo, bl, wl) => {
	const blacklisted = (await bl.get()).includes(pseudo)
  const whitelisted = (await wl.get()).includes(pseudo)
  return {blacklisted, whitelisted}
}

const setUser = async (pseudo, bl, wl) => {
	$('#bot-buster-opt-pseudo').text(pseudo)
  $('.bot-buster-tab[tab="user"]').text(pseudo)
  const infos = await getInfos(pseudo, bl, wl)
  if(infos.blacklisted) {
    $('#bot-buster-bl-remove').css('display', 'inline-block')
    $('#bot-buster-bl-add').css('display', 'none')
  } else {
    $('#bot-buster-bl-add').css('display', 'inline-block')
  	$('#bot-buster-bl-remove').css('display', 'none')
  }
  if(infos.whitelisted) {
    $('#bot-buster-wl-remove').css('display', 'inline-block')
    $('#bot-buster-wl-add').css('display', 'none')
  } else {
    $('#bot-buster-wl-add').css('display', 'inline-block')
  	$('#bot-buster-wl-remove').css('display', 'none')
  }
}

const updateInfos = (bl, wl) => {
	setUser($('#bot-buster-opt-pseudo').text(), bl, wl)
  bl.get().then(b => {
    $('#bot-buster-blacklist-div').html('')
    b = b.sort()
    b.forEach(u => {
      $('#bot-buster-blacklist-div').append(`<div class="bot-buster-horizontal bot-buster-list-i"><p class="bot-buster-pseudo-i">${u}</p><button class="bot-buster-button-cross bot-buster-bl-remove">🗙</button></div>`)
    })
    $('.bot-buster-bl-remove').click(e => {
      const button = e.target,
            div    = $(button).parent()
            pseudo = div.find('p').first().text()
      bl.remove(pseudo).then(() => updateInfos(bl,wl))
  	})
  })
  wl.get().then(w => {
    $('#bot-buster-whitelist-div').html('')
    w = w.sort()
    w.forEach(u => {
      $('#bot-buster-whitelist-div').append(`<div class="bot-buster-horizontal bot-buster-list-i"><p class="bot-buster-pseudo-i">${u}</p><button class="bot-buster-button-cross bot-buster-wl-remove">🗙</button></div>`)
    })
    $('.bot-buster-wl-remove').click(e => {
      const button = e.target,
            div    = $(button).parent()
            pseudo = div.find('p').first().text()
      wl.remove(pseudo).then(() => updateInfos(bl,wl))
  	})
  })
}

const addStyle = () => {
  $('.bot-buster-button').css('width', '1rem')
  $('.bot-buster-button').css('height', '1rem')
  $('.bot-buster-button').css('display', 'inline-block')
  $('.bot-buster-button').css('background-image', 'url("https://www.dropbox.com/s/156xzh0bomvezdf/BotBusterButton.png?raw=1")')
}

const addEvents = (bl, wl) => {
	$('.bot-buster-button').click(e => {
    setUser($(e.target).attr('pseudo'), bl, wl)
  	showOptions()
  })
  $('#bot-buster-opt-close').click(() => {
  	hideOptions()
  })
  $('.bot-buster-tab').click(e => {
  	$('.bot-buster-tab.active').toggleClass('active')
    $(e.target).toggleClass('active')
    $('.bot-buster-tab-content').css('display', 'none')
    $('#bot-buster-opt-'+$(e.target).attr('tab')).css('display', 'block')
    updateInfos(bl, wl)
  })
  $('#bot-buster-bl-add').click(async () => {
    $('#bot-buster-bl-add').css('display', 'none')
  	const pseudo = $('#bot-buster-opt-pseudo').text()
    const infos = await getInfos(pseudo, bl, wl)
    if( infos.whitelisted ) {
      $('#bot-buster-wl-remove').css('display', 'none')
      wl.remove(pseudo)
    }
    await bl.push(pseudo)
    updateInfos(bl, wl)
  })
  $('#bot-buster-bl-remove').click(() => {
    $('#bot-buster-bl-remove').css('display', 'none')
  	const pseudo = $('#bot-buster-opt-pseudo').text()
    bl.remove(pseudo).then(() => updateInfos(bl, wl))
  })
  $('#bot-buster-wl-add').click( async () => {
    $('#bot-buster-wl-add').css('display', 'none')
  	const pseudo = $('#bot-buster-opt-pseudo').text()
    const infos = await getInfos(pseudo, bl, wl)
    if( infos.blacklisted ) {
      $('#bot-buster-bl-remove').css('display', 'none')
      bl.remove(pseudo)
    }
    await wl.push(pseudo)
    updateInfos(bl, wl)
  })
  $('#bot-buster-wl-remove').click(() => {
    $('#bot-buster-wl-remove').css('display', 'none')
    const pseudo = $('#bot-buster-opt-pseudo').text()
    wl.remove(pseudo).then(() => updateInfos(bl, wl))
  })
  $('#bot-buster-bl-form').submit(e => {
    e.preventDefault()
    const pseudo = $('#bot-buster-bl-input').val().trim()
    $('#bot-buster-bl-input').val('')
    if(pseudo) {
      bl.push(pseudo).then(() => updateInfos(bl,wl))
    }
  })
  $('#bot-buster-wl-form').submit(e => {
    e.preventDefault()
    const pseudo = $('#bot-buster-wl-input').val().trim()
    $('#bot-buster-wl-input').val('')
    if(pseudo) {
      wl.push(pseudo).then(() => updateInfos(bl,wl))
    }
  })
}

const waitForElement = (elementPath, callBack) => {
  window.setTimeout(function(){
    if($(elementPath).length){
      callBack($(elementPath));
    }else{
      waitForElement(elementPath, callBack);
    }
  },500)
}

const interceptMP = (bl,wl) => {
	const hasNotif = $('.jv-account-number-mp').hasClass('has-notif')
  if(hasNotif) return
  $('.jv-account-number-mp').click()
  $('.jv-account-number-mp').click()
  waitForElement('.jv-nav-dropdown-item', mps => {
  	waitForElement('.jv-nav-dropdown-author', async authors => {
  		for( let i = 0; i < mps.length; i++ ) {
      	const mp     = mps.eq(i),
              author = authors.eq(i).text().trim()
        const b = await bl.get()
        if(b.includes(author)) {
          mp.css('display', 'none')
        }
      }
  	})
  })
}

const initBuster = async () => {
  const bl = new LocalArray('bot-buster-blacklist')
  const wl = new LocalArray('bot-buster-whitelist')
  const pseudo = getPseudo()
	addButtons(pseudo)
  addStyle()
  await addOptions()
  addEvents(bl, wl)
  interceptMP(bl,wl)
}

initBuster()