// ==UserScript==
// @name          toMorse
// @description   Plays selected text as morse code.
// @namespace     https://greasyfork.org/en/users/11891-qon
// @author        Qon
// @include       *
// @compatible    firefox
// @compatible    chrome
// @grant         GM_getValue
// @grant         GM_setValue
// @license       Simple Public License 2.0 (SimPL) https://tldrlegal.com/license/simple-public-license-2.0-%28simpl%29
// @version 0.0.1.20150723034148
// @downloadURL https://update.greasyfork.org/scripts/11117/toMorse.user.js
// @updateURL https://update.greasyfork.org/scripts/11117/toMorse.meta.js
// ==/UserScript==

/*
TODO
  Split text into smaller parts and play and request one after another.
*/

var settSc = {}
settSc['tm-refresh'] = 0
settSc['tm-stop'] = 0
settSc['tm-key'] = 'm1000'

var settCw = {}
settCw['cwpm'] = {def: 20, val: 20, min: 1, max: 100, label: 'Letter WPM', description: 'cwpm'}
settCw['ewpm'] = {def: 20, val: 20, min: 1, max: 100, label: 'Effective WPM', description: 'ewpm'}
settCw['tone'] = {def: 800, val: 800, min: 200, max: 3200, label: 'Tone frequency', description: 'tone'}
settCw['vol'] = {def: 100, val: 100, min: 0, max: 100, label: 'Volume', description: 'volume'}

var currentAudio = null

function refresh() {
  var old = settSc['tm-refresh']['val']
  var nuw = GM_getValue('tm-refresh', 1)
  if (old != nuw) {
    settSc['tm-refresh'] = nuw
    settSc['tm-stop'] = GM_getValue('tm-stop', settSc['tm-stop'])
    settSc['tm-key'] = GM_getValue('tm-key', settSc['tm-key'])
    for (var key in settCw) {
      if(settCw.hasOwnProperty(key)) {
        settCw[key]['val'] = GM_getValue(key, settCw[key]['val'])
      }
    }
  }
}
refresh()

function signalNeedRefresh() {
  var o = GM_getValue('tm-refresh', 1)
  GM_setValue('tm-refresh', o+1)
}

function evToKeystoreformat(ev) {
  return ev.key.toLowerCase()+(ev.ctrlKey+1-1)+(ev.shiftKey+1-1)+(ev.altKey+1-1)+(ev.metaKey+1-1)
}

function dotdashToAbc(s) {
  var r = ''
  var atd = {}
  // atd['prosign_error']="........";
  atd[' ']="/";
  atd['a']=".-"; atd['b']="-..."; atd['c']="-.-."; atd['d']="-.."; atd['e']="."; atd['f']="..-."; atd['g']="--."; atd['h']="...."; atd['i']=".."; atd['j']=".---"; atd['k']="-.-"; atd['l']=".-.."; atd['m']="--"; atd['n']="-."; atd['o']="---"; atd['p']=".--."; atd['q']="--.-"; atd['r']=".-."; atd['s']="..."; atd['t']="-"; atd['u']="..-"; atd['v']="...-"; atd['w']=".--"; atd['x']="-..-"; atd['y']="-.--"; atd['z']="--..";
  atd['1']=".----"; atd['2']="..---"; atd['3']="...--"; atd['4']="....-"; atd['5']="....."; atd['6']="-...."; atd['7']="--..."; atd['8']="---.."; atd['9']="----."; atd['0']="-----"; atd['.']=".-.-.-";
  atd[',']="--..--"; atd['?']="..--.."; atd['!']="-.-.--"; atd[':']="---..."; atd['=']="-...-"; atd['+']=".-.-."; atd['-']="-....-";
  var dta = {}
  for(var key in atd) {
    if (atd.hasOwnProperty(key)) {
      // console.log(key, atd[key])
      dta[atd[key]] = key[key.length-1] // just /*= key*/ doesn't work becuse for some reason "." becomes "." (invisible character and a dot). Same for several special chars.
    }
  }

  var a = s.split(' ')
  for(q of a) {
    if (q=='') continue;
    var c = dta[q]
    if(c) {
      r += c
    } else {
      r = prosign_error
    }
  }
  console.log(r)
  return r
}

function keypress (ev) {
  if (!ev) ev = window.event;
  if(!ev.key) {ev.key = String.fromCharCode(ev.which)}
  refresh()
  var s = evToKeystoreformat(ev)
  var k = settSc['tm-key']
  if (k == s) {
    var text = window.getSelection().toString()
    if(/[\s\.\-\/]+/.exec(text)==text){
      text = dotdashToAbc(text)
    }
    playTextLCWO(settCw['cwpm']['val'], settCw['ewpm']['val'], settCw['tone']['val'], settCw['vol']['val'], text)
  }
}
window.addEventListener("keydown", keypress);

function playTextLCWO(charWpm, effectiveWpm, tone, volume, str) {
  // var prevAudio = document.getElementById('audioLCWO')
  if(currentAudio) {
    currentAudio.pause()
    currentAudio = null
    // currentAudio.remove()
  }
  if(str=='') {
    return
  }
  var audio = document.createElement('audio')
  audio.id = 'audioLCWO'
  audio.class = ''+settSc['tm-stop']
  audio.src = 'http://cgi2.lcwo.net/cgi-bin/cw.ogg?s='+charWpm+'&e='+effectiveWpm+'&f='+tone+'&t='+str
  audio.addEventListener('ended', function(){/*document.getElementById('audioLCWO').remove()*/currentAudio=null});
  // document.body.appendChild(audio)
  currentAudio = audio
  audio.volume = volume/100
  audio.play()
  function checkStop() {
    refresh()
    // var el = document.getElementById('audioLCWO')
    if(currentAudio) {
      if(currentAudio.class != ''+settSc['tm-stop']) {
        currentAudio.pause()
        currentAudio = null
        // currentAudio.remove()
      } else {
        currentAudio.volume = settCw['vol']['val']/100
        setTimeout(checkStop, 300)
      }
    }
  }
  setTimeout(checkStop, 300)
}

/*
 * The settings form.
 * Only loads on the scripts home page on greasyfork.
 */
if (document.location == 'https://greasyfork.org/en/scripts/11117-tomorse') {
  var settingsdiv = document.createElement('div');
  settingsdiv.id = 'tomorse-settings'
  var h3 = document.createElement('h3')
  h3.innerHTML = 'Script Settings'
  h3.style.marginBottom = '0'
  h3.style.paddingBottom = '0'
  settingsdiv.appendChild(h3)
  var qontdiv = document.createElement('div');
  qontdiv.style.padding = '1em'
  qontdiv.style.margin = '0'
  qontdiv.style.background = '#E6FFE6'
  var setform = document.createElement('form');

  function setting(name, variable, decription) {
    var span = document.createElement('span')
    span.innerHTML = name+': '
    var inpN = document.createElement('input')
    inpN.id = 'input-'+variable
    inpN.name = variable
    inpN.type = 'number'
    inpN.value = settCw[variable]['val']
    var inpRange = document.createElement('input')
    inpRange.id = 'input-range-'+variable
    inpRange.name = variable
    inpRange.type = 'range'
    inpRange.min = settCw[variable]['min']
    inpRange.max = settCw[variable]['max']
    inpRange.value = settCw[variable]['val']
    f = function(ev){
      var el = ev.target
      var inte = parseInt(el.value)
      GM_setValue(el.name, inte)
      settCw[el.name]['val'] = inte
      document.getElementById('input-range-'+el.name).value = inte
      document.getElementById('input-'+el.name).value = inte
      if(el.name == 'cwpm' && document.getElementById('wpm-link').checked) {
        document.getElementById('input-range-'+'ewpm').value = inte
        document.getElementById('input-'+'ewpm').value = inte
        GM_setValue('ewpm', inte)
        settCw['ewpm']['val'] = inte
      }
      signalNeedRefresh()
    }
    inpN.addEventListener('input', f)
    inpRange.addEventListener('input', f)
    setform.appendChild(span)
    setform.appendChild(inpN)
    setform.appendChild(inpRange)
    setform.appendChild(document.createElement('br'))
  }

  for(var key in settCw) {
    if(settCw.hasOwnProperty(key)) {
      setting(settCw[key]['label'], key, settCw[key]['description'])
    }
  }
  var box = document.createElement('input')
  box.id = 'wpm-link'
  box.checked = true
  box.type = 'checkbox'
  var linkSpan = document.createElement('span')
  linkSpan.innerHTML = 'Copy value to "Effective WPM"'
  linkSpan.style.fontSize = '75%'
  linkSpan.style.marginLeft = '100px'
  setform.insertBefore(linkSpan, setform.getElementsByTagName('br')[0])
  setform.insertBefore(box, setform.getElementsByTagName('br')[0])
  // var reset = document.createElement('input')
  // reset.type = 'reset'
  // setform.appendChild(reset)
  var span = document.createElement('span')
  span.innerHTML = 'Hotkey: '
  var key = document.createElement('input')
  key.type = 'text'
  // key.readonly = true // doesn't work :/
  key.id = 'tm-key-field'
  function keystoreformatToString(s) {
    var l = s.length
    var r = (s[l-4]=='1'?'ctrl+':'')+(s[l-3]=='1'?'shift+':'')+(s[l-2]=='1'?'alt+':'')+(s[l-1]=='1'?'meta+':'')
    var e = s.slice(0, -4)
    if(e == 'control' || e == 'shift' || e == 'alt' || e == 'meta') {
      return r.slice(0,-1)
    }
    return r+e
  }
  function evToString(ev) {
    var r = (ev.ctrlKey?'ctrl+':'')+(ev.shiftKey?'shift+':'')+(ev.altKey?'alt+':'')+(ev.metaKey?'meta+':'')
    if (/[a-zA-Z\d]/.exec(ev.key)==ev.key) {
      if(r!='shift+' && r!='') {
        r += ev.key
      }
    } else if (ev.key.length==1 && !ev.ctrlKey && ev.which!=16) {
      r = ''
    } else if (ev.key.toLowerCase()=='backspace' && !ev.ctrlKey) {
      r += 'backspace '
    } else if (ev.key=='Control' || ev.key=='Shift' || ev.key == 'Alt' || ev.which==16 || ev.which==17 || ev.which==18) {
      r = r.slice(0, -1)
    } else {
      r += ev.key.toLowerCase()
    }
    return r
  }
  key.value = keystoreformatToString(settSc['tm-key'], false)
  key.addEventListener('keydown', function(ev){
    if (!ev) ev = window.event;
    if(!ev.key) {ev.key = String.fromCharCode(ev.which)}
    var el = ev.target
    GM_setValue('tm-key', evToKeystoreformat(ev))
    el.value = evToString(ev)
    signalNeedRefresh()
  })
  key.addEventListener('keyup', function (ev) {
    if(!(ev.key=='Control' || ev.key=='Shift' || ev.key == 'Alt')) {
      ev.target.blur()
    }
  })
  setform.appendChild(span)
  setform.appendChild(key)
  var stopSpan = document.createElement('span')
  stopSpan.innerHTML = 'Stop playing morse audio in all tabs: '
  var stop = document.createElement('input')
  stop.type = 'button'
  stop.value = 'Stop!'
  stop.addEventListener('click', function (ev) {
    GM_setValue('tm-stop', 1-GM_getValue('tm-stop', 0))
    signalNeedRefresh()
  })
  setform.appendChild(document.createElement('br'))
  setform.appendChild(stopSpan)
  setform.appendChild(stop)
  // var stopSpan = document.createElement('span')
  // stopSpan.innerHTML = ' (in case you can\'t find the right one because you have too many tabs!)'
  // stopSpan.style.fontSize = '75%'
  // setform.appendChild(stopSpan)

  document.getElementById('script-content').insertBefore(settingsdiv, document.getElementById('share'))
  qontdiv.appendChild(setform)
  settingsdiv.appendChild(qontdiv)
}