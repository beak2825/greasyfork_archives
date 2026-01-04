// ==UserScript==
// @name            Mods.de Button Overhaul
// @namespace       phil.red
// @description     Mods.de - prettify new post button
// @description:de  Mods.de - New-Post-Buttons verschönern
// @version         1.3.2
// @include         https://forum.mods.de/bb/newreply.php*
// @include         https://forum.mods.de/bb/editreply.php*
// @include         https://forum.mods.de/bb/newthread.php*
// @include         https://forum.mods.de/bb/thread.php?*
// @downloadURL https://update.greasyfork.org/scripts/392944/Modsde%20Button%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/392944/Modsde%20Button%20Overhaul.meta.js
// ==/UserScript==

function addStyle(css) {
  const head = document.getElementsByTagName('head')[0]
  if (!head) return
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.textContent = css
  head.appendChild(style)
}

//when used on a text input widget, this inserts bb tags around the selection
//use what you would use in the start tag.
//example:
//given a textarea with the id 'ta' and the selected content <selection>,
//insertRoundCaret(elem, 'url=http://goo.gl') yields [url="http://goo.gl"]<selection>[/url] and
//insertRoundCaret(elem, 'url=http://','Insert URL:') yields [url=<url>]<selection>[/url],
//where <url> is fetched via a popup which is prefilled with 'http://'

function insertRoundCaret(elem, tag, question) {
  const i = tag.indexOf('=')
  const tagName = (i === -1) ? tag : tag.substring(0, i)
  let tagValue = (i === -1) ? '' : tag.substring(i + 1)
  //if there is a question, prompt it, using the value as preset, else use the value if present
  let strStart = `[${tagName}`
  const strEnd = `[/${tagName}]`

  if (tagValue.length > 0 || question) {
    if (question) {
      tagValue = window.prompt(`Bitte ${question}`, tagValue) //Autopoliteness (TM)
    }
    if (tagValue.length > 0) {
      strStart += '="' + tagValue + '"'
    }
  }
  strStart += ']'

  insertCustomCaret(elem, strStart, strEnd)
}

function insertCustomCaret(elem, strStart, strEnd) {
  //if there is a selection, wrap tags around it
  if (elem.selectionStart || elem.selectionStart === 0) {
    const startPos = elem.selectionStart
    const endPos = elem.selectionEnd
    const scrollTop = elem.scrollTop
    elem.value = elem.value.substring(0, startPos) + strStart + elem.value.substring(startPos, endPos) + strEnd + elem.value.substring(endPos)
    elem.focus()
    elem.selectionStart = startPos + strStart.length
    elem.selectionEnd = endPos + strStart.length
    elem.scrollTop = scrollTop
  } else { // if no selection is present, just append tags to the end
    elem.value += strStart + strEnd
    elem.focus()
    elem.selectionStart = elem.selectionEnd = elem.value.length - strEnd.length
  }
}

function insertPerLine(elem, str) {
  if (elem.selectionStart || elem.selectionStart === 0) {
    const startPos = elem.selectionStart
    const endPos = elem.selectionEnd
    const scrollTop = elem.scrollTop
    const lines = elem.value.substring(startPos, endPos).split('\n').map(l => str + l)
    elem.value = elem.value.substring(0, startPos) + lines.join('\n') + elem.value.substring(endPos)
    elem.focus()
    elem.selectionStart = startPos + str.length
    elem.selectionEnd = endPos + (str.length * lines.length)
    elem.scrollTop = scrollTop
  } else {
    elem.value += str
    elem.focus()
    elem.selectionStart = elem.selectionEnd = elem.value.length
  }
}

function smileyWindow() {
    window.open(
    	'misc.php?view=smilies&amp;window=1',
    	'smilieWindow',
    	'width=300, height=400, status=no, toolbar=no, menubar=no, location=no, directories=no, resizeable=no, scrollbars=yes')
}

addStyle(`
#qr_insertcustombuttonshere > img,
.newInsertButton {
	float:     left;
	max-width: 28px;
}

#qr_insertcustombuttonshere > img,
.newInsertButton,
input[type="submit"] {
	border: 1px solid #224;
	background-color: #394e63;
	box-shadow:	0px 1px 3px rgba(255,255,255,.3) inset;
	height: 24px;
	overflow: show;
	text-align: center;
	color:  white;
	margin-right: 3px;
}

#qr_insertcustombuttonshere > img:hover:not(:active),
.newInsertButton:hover:not(:active),
input[type="submit"]:hover:not(:active) {
	border-color: #008fe1;
	box-shadow: 0px 1px 3px rgba(255,255,255,.3) inset,
	            0px 0px 2px #008fe1;
}

#qr_insertcustombuttonshere > img:hover:active,
.newInsertButton:hover:active,
input[type="submit"]:hover:active {
	box-shadow: 0px 1px 3px rgba(0,0,0,.3) inset;
}

.newInsertButton .border {border:1px solid silver; display:inline-block; width:1.2em}
.newInsertButton .spoiler {text-shadow:0px 0px 2px rgba(255,255,255,.5)}
.newInsertButton .brdr,
.newInsertButton .spoiler {min-width:16px; display:inline-block}
.newInsertButton .tex {font-family:serif}
`)

//shamelessly stolen from kambfhase
if (!document.evaluate('//a[contains(@href, "./quickmod")]', document, null, 8, null).singleNodeValue) {
	addStyle('.iAmMod { display:none }')
}

const toolbar = document.querySelector('img[title="Fett"]').parentNode
const ta = document.querySelector('#pstmsg, textarea[name="message"], #thrmsg')
const buttons = [
	['Fett',            '<b>F</b>',                       () => insertRoundCaret(ta, 'b')],
	['Unterstreichen',  '<u>U</u>',                       () => insertRoundCaret(ta, 'u')],
	['Code',            '<code class="border">C</code>',  () => insertRoundCaret(ta, 'code')],
	['Kursiv',          '<i>K</i>',                       () => insertRoundCaret(ta, 'i')],
	['Durchstreichen',	'<s>S</s>',	                      () => insertRoundCaret(ta, 's')],
	['Trigger',         '<span class="trigger">T</span>', () => insertRoundCaret(ta, 'trigger')],
	['Monospace',       '<code>M</code>',                 () => insertRoundCaret(ta, 'm')],
	['TeX',	            '<span class="tex">T</span>',     () => insertRoundCaret(ta, 'tex')],
	['Audio',           '♫',                              () => insertRoundCaret(ta, 'audio')],
	['Video',           '▶',                              () => insertRoundCaret(ta, 'video')],
	['PHP',             '<code class="border">P</code>',  () => insertRoundCaret(ta, 'php')],
	['Bild einfügen',   '⌧',                              () => insertRoundCaret(ta, 'img')],
	['Link',            '<u>url</u>',                     () => insertRoundCaret(ta, 'url=http://', 'URL angeben')],
	['Liste',           '☰',                             () => {
		insertRoundCaret(ta, 'list=1', 'Listentyp angeben: 1, a oder leer')
		insertCustomCaret(ta, '\n', '\n')
		insertPerLine(ta, '[*] ')
	}],
	['Listenelement',   '•',                              () => insertCustomCaret(ta, '[*] ','')],
	['Smiley einfügen', '☺',                              smileyWindow],
	['Quote',           '<span class="border">Q</i>',     () => insertRoundCaret(ta, 'quote')],
	['Spoiler',         '<span class="spoiler">S</i>',    () => insertRoundCaret(ta, 'spoiler')],
	['Mod',             'Mod',                            () => insertRoundCaret(ta, 'mod')],
]

toolbar.innerHTML = ''
for (const [alt, code, cb] of buttons) {
  const button = document.createElement('button')
  button.classList.add('newInsertButton')
  button.setAttribute('type', 'button')
  button.setAttribute('alt', alt)
  button.innerHTML = code
  button.addEventListener('click', cb)
  toolbar.appendChild(button)
}

const modBtn = document.querySelector('button[alt="Mod"]')
if (modBtn) modBtn.classList.add('iAmMod')
