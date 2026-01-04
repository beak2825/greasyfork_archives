// ==UserScript==
// @name        Sankaku Tag Popularity Autocompletion
// @namespace   SankakuTagPopularityAutocompletion
// @match       https://chan.sankakucomplex.com/*
// @match       https://legacy.sankakucomplex.com/*
// @match       https://idol.sankakucomplex.com/*
// @noframes
// @grant       GM.addStyle
// @version     1.1.0
// @author      epair
// @description Makes the default autocompletion pick the most popular tag. Borders are added to the currently selected autocompletion. Arrow keys can also pick completions in textareas.
// @downloadURL https://update.greasyfork.org/scripts/527951/Sankaku%20Tag%20Popularity%20Autocompletion.user.js
// @updateURL https://update.greasyfork.org/scripts/527951/Sankaku%20Tag%20Popularity%20Autocompletion.meta.js
// ==/UserScript==

var selected_index = -1

function add_style(css) {
  if(GM.addStyle) {
    return Promise.resolve(GM.addStyle(css))
    //Violentmonkey returns a style element whereas Tampermonkey returns a Promise
  } else {
    const sheet = document.createElement('STYLE')
    sheet.innerText = css
    document.head.appendChild(sheet)
    return Promise.resolve(sheet)
  }
}

{
  //set style based on dark/light theme
  let theme = document.cookie
    .split('; ')
    .find((row) => row.startsWith('theme='))
    ?.split('=')[1];

  let is_dark_mode = theme !== undefined && Number(theme) !== 0

  let bg = is_dark_mode ? '#000' : '#aaa'
  let fg = is_dark_mode ? '#aaa' : '#000'

  add_style(`
  #autocomplete li {
    border: 2px dotted ${bg};
  }
  #autocomplete li.autocomplete-select {
    border: 2px solid ${fg};
  }`)
}

//parse number from human readable suffix
function num_from_suffix(n) {
  let base = 1
  if(n.charAt(n.length-1) === 'M')
    base = 1000000
  else if(n.charAt(n.length-1) === 'K')
    base = 1000
  else
    return Number.parseFloat(n)
  return Number.parseFloat(n.substring(0, n.length-1)) * base
}

//prevent tag edit textarea default events from hiding autocomplete
function key_up(e) {
  switch(e.key) {
    case 'ArrowDown':
    case 'PageDown':
    case 'PageUp':
    case 'ArrowUp':
      if(document.querySelector("#autocomplete").style.display !== 'block')
        break
      e.preventDefault()
      e.stopImmediatePropagation()
  }
}

function key_down(e) {
  switch(e.key) {
    case 'Tab':
    case 'Enter':
      let counts = document.querySelectorAll('#autocomplete span.item-count')
			if(counts.length < 1) {				document.querySelector('#autocomplete').children.item(selected_index || 0).click()

			}

      let greatest = 0
      let first = num_from_suffix(counts.item(0).innerText)
      let second = num_from_suffix(counts.item(1).innerText)

      if(first < second)
        greatest = 1

      if(selected_index > -1 || first < 1)
        greatest = selected_index
			//alert(counts.length + ' ' + first)
      //complete selected tag or greatest post count if unselected
      counts.item(greatest).parentNode.click()

      e.preventDefault()
      e.stopImmediatePropagation()
      break
    case 'ArrowDown':
    case 'PageDown':
    case 'PageUp':
    case 'ArrowUp':
      //break to allow cursor and selection movement when autocomplete is hidden
      if(document.querySelector("#autocomplete").style.display !== 'block')
        break
      let completions = document.querySelectorAll('#autocomplete li')

      selected_index += (e.key === 'ArrowUp' || e.key === 'PageUp') ? -1 : 1
      if(selected_index < 0)
        selected_index = completions.length - 1
      if(selected_index >= completions.length)
        selected_index = 0

      for(let c of completions)
        c.classList.remove('autocomplete-select')
      completions.item(selected_index).classList.add('autocomplete-select')
      e.preventDefault()
      e.stopImmediatePropagation()
      break
    default:
      selected_index = -1
      break
  }
}

function query_add_event(selector, event, func, cap=false){
  let q = document.querySelector(selector)
  if(q !== null)
    q.addEventListener(event, func, cap)
}

query_add_event("#tags", "keydown", key_down)
query_add_event("#post_tags", "keydown", key_down, true)
query_add_event("#post_tags", "keyup", key_up, true)
