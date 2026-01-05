// ==UserScript==
// @name          Fanfiction Qomplete
// @description   Proper multi-chapter reading mode with less clutter for sites like fanfiction.net
// @namespace     https://greasyfork.org/en/users/11891-qon
// @author        Qon
// @include       https://www.fanfiction.net/s/*/*
// @include       https://www.fanfiction.net/r/*/*
// @include       https://www.fictionpress.com/s/*/*
// @include       https://www.fimfiction.net/story/*/*
// @include       http://www.fimfiction.net/story/*/*
// @compatible    firefox
// @compatible    chrome
// @noframes
// @grant         GM.xmlHttpRequest
// @grant         GM.getValue
// @grant         GM.setValue
// @run-at        document-start
// @license       Simple Public License 2.0 (SimPL) https://tldrlegal.com/license/simple-public-license-2.0-%28simpl%29
// @version 0.0.1.20210120142424
// @downloadURL https://update.greasyfork.org/scripts/10182/Fanfiction%20Qomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/10182/Fanfiction%20Qomplete.meta.js
// ==/UserScript==

// javascript:var script=document.createElement("script");var t=new Date(Date());script.src="https://greasyfork.org/en/scripts/10182-fanfictionqomplete/code/fanfictionqomplete.js?"+t.getFullYear()+t.getMonth()+t.getDate();document.body.appendChild(script);window.setTimeout(function(){document.runFFQomplete();},500);

/*
TODO
  --Font size
  Minimize Qontrol panel or something to reduce button amount
  Add support for other sites
    fimfiction.com chapter selector
  Change width by dragging the border? and position?
  Add copies of all links at the end of a fanfic.
  Save scroll, because the browser built in one doesn't work between browser restarts
  -- Fanfiction.net review Qompletion
  -- Fixed missing Qomplete button on fimfictions with only 1 chapter.
*/

// 'use strict';

var live = true
polyfill()
var siteMatch = /^.*?www\.(.*?)\..*?\//.exec(document.location.href)[1]

var hash_settings = document.location.hash.slice(1).split('&')
if (hash_settings.map(c=>c.split('=')[0]).includes('Qomplete')) {
  // if (siteMatch == 'fimfiction') Array.from(document.head.querySelectorAll('script')).forEach(q=>q.remove())
  checkForBadJavascripts ([
    // [true, /static\.fimfiction\.net\/js\/scripts\.js\?5tfctpvL/, null]
   // ,[false, /addEventListener/, null]
   ,[false, /\$\(window\)\.scroll\( function\(e\)/ /*)*/, null]])
  window.addEventListener('load', runFFQomplete)
} else {
  window.addEventListener('load', injectQompleteButton)
}

function injectQompleteButton() {
  switch(siteMatch){
  case 'fimfiction':
    var lc = document.getElementById('chapter_title')
    lc = lc&&lc.parentNode
    lc = lc&&lc.getElementsByClassName('button-group')[0]||lc
    var btn = document.createElement('a')
    btn.addEventListener('click', runFFQomplete)
    btn.setAttribute('class', 'styled_button styled_button_grey button-icon-only')
    btn.setAttribute('title', 'Append all following chapters and remove unecessary bloat.')
    btn.innerHTML = 'Qomplete!'
    lc.appendChild(btn)
    // lc.insertBefore(btn,lc.lastChild.previousSibling)
    break;
  case 'fanfiction':
  case 'fictionpress':
    var lc = document.getElementsByClassName('lc')[0] || document.getElementById('gui_table1i').firstElementChild.firstElementChild.firstElementChild
    var btn = document.createElement('button')
    // btn.setAttribute('onclick', 'runFFQomplete();')
    btn.addEventListener('click', runFFQomplete)
    btn.setAttribute('class', 'btn')
    btn.setAttribute('style', 'margin-left:12px;margin-right:2px;')
    btn.setAttribute('title', 'Append all following chapters and remove unecessary bloat.')
    btn.innerHTML = 'Qomplete!'
    lc.appendChild(btn)
    break;
  }
}
async function runFFQomplete() {
  // Add the loaded settings to url bar so that they don't get changed for this tab if the settings are changed elsewhere.
  var settings = await readSettings()
  await saveSettings(settings)

  var re = getChapRE()
  // TODO remove vvv?
  window.addEventListener('load', ()=>{
    var a = document.getElementsByClassName('skiptranslate')
    for (; a.length; a[0].remove());
    document.body.removeAttribute('style')
  })

  // Initialisations
  var appendedNow = 1
  var notAppendedYet = 0
  var requested_no_resp_yet = 0
  var chapArr = []
  var activeChap = parseInt(urlGetChap(document.location.href), 10)
  // Grab the elements we want
  var title = document.getElementsByTagName('title')[0]
  var profile_top = getProfileTop()
  var ficpic = profile_top&&profile_top.getElementsByTagName('img')[0]
  var statusComplete = !!(/Status: Complete/.exec(profile_top&&profile_top.innerHTML))
  var chap_select = document.getElementById('chap_select')
  var latestChap = getLatestChap()
  var favicons = getFavicons()
  var chap = chapFromPage(document.location.href, document) // Get the chapter that is already loaded

  clean()
  // Now, add items. The ones we kept and modified and new ones.
  addStyle()
  title.innerHTML = fixTitleText(title.innerHTML)
  document.head.appendChild(title)
  for (i=0;i<favicons.length;i+=1) {document.head.appendChild(favicons[i])}
  if (ficpic){dataURLify(ficpic)} // window.addEventListener('load_image',load_image,false); // Make sure image has properly loaded
  addProgressBar()
  updateLoading(activeChap - 1, appendedNow, notAppendedYet, latestChap)
  addProfile()
  await addQontrolPanel()
  document.body.appendChild(chap)
  addFollowingChapters()

  function wait(ms) {return new Promise((resolve,reject) => Infinity !== ms ? setTimeout(resolve, ms) : reject())}

  async function addFollowingChapters(){
    if (activeChap == latestChap) loadQomplete()
    else appendNextChap(activeChap + 1)

    for (let i = activeChap; i < latestChap; i += 1) {
      appendChapterFromURL(urlSetChap(document.location.href, i + 1))
      await wait(4e3 * (1 - (1 / (Math.max(0, i - activeChap - 10) / 10 + 1))))
    }
  }
  async function addQontrolPanel(){
    var panel = document.createElement('div')
    panel.setAttribute('class', 'panel')
    await addButtons(panel)
    document.getElementById('profile').firstChild.appendChild(panel)
  }
  function getLatestChap(){
    if (siteMatch==='fanfiction'||siteMatch==='fictionpress'){
      var lc = chap_select ? chap_select.children.length : 1
      if (/(?:fanfiction\.net|fictionpress\.com)\/r/.test(document.location.href)) {
        var as = document.getElementById('content_wrapper_inner').firstElementChild.nextElementSibling
        if (as) lc = [].slice.call(as.getElementsByTagName('a')).map(q=>urlGetChap(q.href)).reduce((p,q)=>Math.max(p,q),1)
      }
      return lc
    }
    if (siteMatch==='fimfiction') {
      try {
        return document.querySelector('.chapter-title div.drop-down').querySelectorAll('li').length
        //getElementById('chapter_format').getElementsByClassName('title')[0].getElementsByTagName('ul')[0].getElementsByTagName('li').length
      }
      catch (e) {}
    }
  }
  function getChapRE(){if (siteMatch === 'fanfiction' || siteMatch === 'fictionpress' || siteMatch === 'fimfiction') return /(^.*?\/s(?:tory)?\/\d+\/)(\d+)(\/?[^#]*)/}
  function getProfileTop() {
    if (siteMatch === 'fanfiction' || siteMatch === 'fictionpress') return document.getElementById('profile_top')
    if (siteMatch === 'fimfiction') return document.getElementsByClassName('inner')[0]
  }
  function getFavicons() {return [].slice.call(document.head.getElementsByTagName('link')).filter(c=>(/favicon/.test(c.href)))}
  async function readSettings() {
    var settings = {Qomplete: 1}
    var parr = ['center', 'bgcol', 'edge', 'width', 'fontsz']
    if (live) {
      for(var i of parr) {
        settings[i] = await GM.getValue(i, 0)
      }
    }
    var hash_settings = document.location.hash.slice(1).split('&')
    for(var i = 0; i < hash_settings.length; ++i){
      var kv = hash_settings[i].split('=')
      if (parr.includes(kv[0])) {
        settings[kv[0]] = parseInt(kv[1], 10)
      }
    }
    return settings
  }
  async function saveSettings(o) {
    var q = []
    var parr = ['Qomplete', 'center', 'bgcol', 'edge', 'width', 'fontsz']
    for(var k in o) {
      if (o.hasOwnProperty(k) && parr.includes(k)) {
        if (live) await GM.setValue(k, o[k])
        q.push(k + '=' + o[k])
      }
    }
    window.location = '#' + q.join('&')
  }
  function addProgressBar(){
    var loadwrap = document.createElement('div')
    loadwrap.setAttribute('class', 'wrap')
    loadwrap.style.position = 'sticky'
    loadwrap.style.top = '0px'
    var loading = document.createElement('div')
    loading.style.float = 'left'
    loading.setAttribute('id', 'loading')
    loadwrap.appendChild(loading)
    document.body.appendChild(loadwrap)
  }
  function addProfile(){
    var profile = document.createElement('div')
    profile.setAttribute('class', 'wrap profile')
    profile.setAttribute('id', 'profile')
    var pad = document.createElement('div')
    pad.setAttribute('class', 'pad')
    if (profile_top) pad.appendChild(profile_top)
    profile.appendChild(pad)
    document.body.appendChild(profile)
  }
  function dataURLify(img){
    // http://pastebin.ca/1425789
    // Simple function that checks for JPG, GIF and PNG from image data. Otherwise returns false.
    function mime_from_data(data) {
      if     ('GIF' ==data.substr(0,3))return 'image/gif';
      else if ('PNG' ==data.substr(1,3))return 'image/png';
      else if ('JFIF'==data.substr(6,4))return 'image/jpg';
      return false;
    }
    // Generates the binary data string from character / multibyte data
    function data_string(data) {
      var data_string='';
      for(var i=0,il=data.length;i<il;i++)data_string+=String.fromCharCode(data[i].charCodeAt(0)&0xff);
      return data_string;
    }
    async function load_image(tries) {
      await GM.xmlHttpRequest({
        method: 'GET',
        url: img.src,
        overrideMimeType: 'text/plain; charset=x-user-defined',
        onload: function(xhr) {
          var data = data_string(xhr.responseText);
          if (mime_from_data(data)) {
            var base64_data = btoa(data); // Encode to base64 string
            var data_url = 'data:' + mime_from_data(data) + ';base64,' + base64_data; // Make the data url
            img.src = data_url }
          else if (tries>0) load_image(tries-1)
        }
      })
    }
    load_image(5)
  }
  function urlGetChap(url) {
    var arr = re.exec(url)
    return arr && arr[2] || 1
  }
  function urlSetChap(url, n) {
    var arr = re.exec(url)
    if (!arr) {
      arr = re.exec(url+'0/1/')
      if (/(?:fanfiction\.net|fictionpress\.com)\/r/.test(document.location.href)) {
        arr[1] = arr[1] + arr[1].split('\/').length==5?'':'0\/'
      }
    }
    return arr[1] + n + ((siteMatch==='fimfiction') ? arr[3] : arr[3].replace(/\/[^\/]*$/, ""))
  }
  function inc(url) {
    var arr = re.exec(url)
    return urlSetChap(url, ++parseInt(urlGetChap(url), 10), 10)
  }
  function chapFromPage(url, page) {
    var storytext;
    if (siteMatch==='fanfiction'||siteMatch==='fictionpress'){
      storytext = page.getElementById('storytext') || page.getElementById('gui_table1i').firstElementChild.nextElementSibling
    }
    else if (siteMatch==='fimfiction') {
      storytext = page.querySelector('.chapter-body')
      storytext.style = ''
      var styles = storytext.getElementsByTagName('style')
      for(style of styles) {
        style.remove()
      }
    }

    if ( storytext) {
      // let chap_select = storytext.querySelector('.chapter-selector')
      // if (chap_select) chap_select.remove()
      // var ps = storytext.getElementsByTagName('p'), d = 0; for (q of ps) {q.style.color = 'hsl(' + d + ' ,20%, 80%)'; q.innerHTML = q.innerHTML.replace(/([\.,?!])/g, '<span style="color:hsl(' + d + ' ,100%, 50%);">$1</span>'); d = (d + 1 / ps.length * 360) % 360}
      var wrap = page.createElement('div')
      wrap.setAttribute('class', 'wrap col')
      wrap.setAttribute('id', urlGetChap(url))
      var pad = page.createElement('div')
      pad.setAttribute('class', 'pad')
      var chapdiv = page.createElement('div')
      chapdiv.setAttribute('class', 'chapter')
      var chapspan = page.createElement('span')
      chapspan.innerHTML = urlGetChap(url) + '. '
      var title = page.getElementsByTagName('title')[0]
      var chaptitle = page.createElement('a')
      chaptitle.setAttribute('href', url.replace(/#.*$/, ""))
      chaptitle.setAttribute('class', 'external')
      if     (siteMatch==='fanfiction' || siteMatch==='fictionpress') {
        var newChapTitle = /(.*(| [Cc]hapter [^:]+: .*)), a .*/.exec(title.innerHTML)}
      else if (siteMatch==='fimfiction') {
        var newChapTitle = /(.*) - FIMFiction.net/.exec(title.innerHTML)}
      chaptitle.innerHTML = newChapTitle ? newChapTitle[1] : title.innerHTML
      chapdiv.appendChild(chapspan)
      chapdiv.appendChild(chaptitle)
      chapdiv.appendChild(document.createElement('hr'))
      chapdiv.appendChild(storytext)
      pad.appendChild(chapdiv)
      wrap.appendChild(pad)
      return wrap
    }
    else return null
  }
  function clean(){
    var ptbuttons = profile_top&&profile_top.getElementsByTagName('button')
    if (ptbuttons&&ptbuttons.length) {ptbuttons[0].remove()}
    for (; document.head.firstElementChild;) document.head.firstElementChild.remove();
    for (; document.body.firstElementChild;) document.body.firstElementChild.remove();
    document.body.removeAttribute('style')
  }
  function addStyle(){
    var style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML =
      `body{background-color:#000;color:#ccc;margin:0;padding:0;font-family:"Verdana";}
      ul.tags > li{display:inline;}
      ul.tags > li::before{content:" #"}
      #loading{position:inherit;width:100%;height:5px;}
      button, select{border-radius:4px;padding:4px 12px;background: linear-gradient(to bottom, #333, #000);border-width: 1px;color:#ccc;background-color:#000;}
      button:hover{background-image:none;}
      .panel{text-align:center;}
      a.external, option.external{background: transparent url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFZJREFUeF59z4EJADEIQ1F36k7u5E7ZKXeUQPACJ3wK7UNokVxVk9kHnQH7bY9hbDyDhNXgjpRLqFlo4M2GgfyJHhjq8V4agfrgPQX3JtJQGbofmCHgA/nAKks+JAjFAAAAAElFTkSuQmCC") no-repeat scroll right center;padding-right: 13px;}
      div.wrap{max-width:1300px;margin:auto;padding:0px 5px 0px 5px;}
      div.wrap:nth-of-type(2){padding-top:5px;margin-top:50px;}
      div.wrap:last-child{padding-bottom:5px;margin-bottom:50px;}
      div.pad{background-color:#222;padding:50px;}
      .chapter{}#profile_top{}img{float:left;}canvas{float:left;}
      a:link{color:#555;}a:visited{color:#555;}a:hover{color:#aaa;}a:active{color:#aaa;}
      option{}
      option:nth-of-type(6n+1)::before{content:"";padding-left:3px;margin-left:-3px;margin-right:4px;background:linear-gradient(to bottom, #f00, #ff0);}
      option:nth-of-type(6n+2)::before{content:"";padding-left:3px;margin-left:-3px;margin-right:4px;background:linear-gradient(to bottom, #ff0, #0f0);}
      option:nth-of-type(6n+3)::before{content:"";padding-left:3px;margin-left:-3px;margin-right:4px;background:linear-gradient(to bottom, #0f0, #0ff);}
      option:nth-of-type(6n+4)::before{content:"";padding-left:3px;margin-left:-3px;margin-right:4px;background:linear-gradient(to bottom, #0ff, #00f);}
      option:nth-of-type(6n+5)::before{content:"";padding-left:3px;margin-left:-3px;margin-right:4px;background:linear-gradient(to bottom, #00f, #f0f);}
      option:nth-of-type(6n+0)::before{content:"";padding-left:3px;margin-left:-3px;margin-right:4px;background:linear-gradient(to bottom, #f0f, #f00);}
      .col:nth-of-type(6n+${((4-activeChap+60000)%6)}){background-color:#f00;background:linear-gradient(to bottom, #f00, #ff0);}
      .col:nth-of-type(6n+${((5-activeChap+60000)%6)}){background-color:#ff0;background:linear-gradient(to bottom, #ff0, #0f0);}
      .col:nth-of-type(6n+${((6-activeChap+60000)%6)}){background-color:#0f0;background:linear-gradient(to bottom, #0f0, #0ff);}
      .col:nth-of-type(6n+${((7-activeChap+60000)%6)}){background-color:#0ff;background:linear-gradient(to bottom, #0ff, #00f);}
      .col:nth-of-type(6n+${((8-activeChap+60000)%6)}){background-color:#00f;background:linear-gradient(to bottom, #00f, #f0f);}
      .col:nth-of-type(6n+${((9-activeChap+60000)%6)}){background-color:#f0f;background:linear-gradient(to bottom, #f0f, #f00);}
      @media (max-width: 700px) {div.wrap{padding-left:1px;padding-right:1px;} div.pad{padding-left:5px;padding-right:5px;}}
      ${['.profile{background-color:#777;background:linear-gradient(to bottom, #fff, #f0f);}'
        ,'.profile{background-color:#777;background:linear-gradient(to bottom, #fff, #f00);}'
        ,'.profile{background-color:#777;background:linear-gradient(to bottom, #fff, #ff0);}'
        ,'.profile{background-color:#777;background:linear-gradient(to bottom, #fff, #0f0);}'
        ,'.profile{background-color:#777;background:linear-gradient(to bottom, #fff, #0ff);}'
        ,'.profile{background-color:#777;background:linear-gradient(to bottom, #fff, #00f);}'][urlGetChap(document.location.href) % 6]}`
    document.head.appendChild(style)
  }
  function fixTitleText(titleText){
    if (siteMatch==='fanfiction') {
      var settitle = /(.*?)(?:[Cc]hapter .*, a |, a )(.*) fanfic \| FanFiction/
      var storyname = settitle.exec(titleText)
      if (storyname) {
        return storyname[1]
          +(statusComplete&&activeChap==1?' - Qomplete':(' - chapter '+activeChap+(latestChap!=activeChap?'-'+latestChap:'')))
          +' - '+storyname[2]
        }
      }
    if (siteMatch==='fictionpress') {
      var settitle = /(.*?)(?:[Cc]hapter .*, a |, a )(.*) fiction \| FictionPress/
      var storyname = settitle.exec(titleText)
      if (storyname) {
        return storyname[1]
          +(statusComplete&&activeChap==1?' - Qomplete':(' - chapter '+activeChap+(latestChap!=activeChap?'-'+latestChap:'')))
          +' - '+storyname[2]}}
    if (siteMatch==='fimfiction') {
      var settitle = /.* - (.*) - Fimfiction/
      var storyname = settitle.exec(titleText)
      // console.debug({titleText, storyname, activeChap, latestChap})
      if (storyname) {
        return storyname[1] + (' - chapter '+activeChap+(latestChap!=activeChap?'-'+latestChap:''))
      }
    }
  }
  function updateLoading(ignore, appended, downloaded, requested, total, downloaded_map) {
    let loading = document.getElementById('loading')
    function convertProgress(progress) {
      return progress.map(q=>{
        q = (typeof q == 'string') ? {color: q} : q
        q.count = q.hasOwnProperty('count') ? q.count : 1
        return q
      }).reduce((acc, c, i, a)=>{
        let last = acc[acc.length - 1]
        if (last && last.color == c.color) last.count += c.count
        else acc.push(c)
        return acc
      }, [])
    }
    function progressBar(bar, progress) {
      bar.style.display = 'flex'
      let chs = Array.from(bar.querySelectorAll('div'))
      for(let i = 0; i < Math.max(progress.length, chs.length); ++i) {
        let node
        if (i < chs.length) node = chs[i]
        else {
          node = document.createElement('div')
          bar.appendChild(node)
        }
        if (i < progress.length) {
          node.style.backgroundColor = progress[i].color
          node.style.flex = progress[i].count
        } else node.remove()
      }
      return progress
    }
    let handeled = ignore + appended + downloaded + requested
    let progress = [
      {count: ignore, color: 'white'},
      {count: appended, color: 'lime'},
    ]
    for (let i = ignore + appended; i < handeled; ++i) {
      if (chapArr[i]) progress.push({color: 'blue'})
      else progress.push({color: '#666'})
    }
    progress.push({count: total - handeled, color: 'white'})
    progressBar(loading, convertProgress(progress))
    if (ignore + appended == total) {
      setTimeout(function() {
        loading.style.display = 'none'
      }, (activeChap != latestChap) * 100)
    }
  }
  async function addButtons(panel){
    var posbtn = document.createElement('button')
    posbtn.setAttribute('id', 'posbtn')
    async function centerclick() {
      var settings = await readSettings()
      var e = document.getElementById('position-style')
      if (e) {
        if (e.innerHTML == 'div.wrap{margin-left:0px;}') {
          settings.center = 2
          e.innerHTML = 'div.wrap{margin-right:0px;}'
          document.getElementById('posbtn').innerHTML = 'Right'}
        else {
          settings.center = 0
          e.remove()
          document.getElementById('posbtn').innerHTML = 'Centered'
        }
      }
      else {
        settings.center = 1
        var s = document.createElement('style')
        s.setAttribute('id', 'position-style')
        s.innerHTML = 'div.wrap{margin-left:0px;}'
        document.head.appendChild(s)
        document.getElementById('posbtn').innerHTML = 'Left'
      }
      await saveSettings(settings)
    }
    posbtn.setAttribute('onclick', 'centerclick()')
    posbtn.setAttribute('class', 'center;')
    posbtn.innerHTML = 'Centered'

    var bgcolbtn = document.createElement('button')
    bgcolbtn.setAttribute('id', 'bgcolbtn')
    async function bgcolclick() {
      var settings = await readSettings()
      var e = document.getElementById('bgcol-style')
      if (e) {
        if (e.innerHTML == 'body{color:#000;}a:hover{color:#000;}div.pad{background-color:#fff;}') {
          settings.bgcol = 2
          e.innerHTML = 'body{color:#fff;}div.pad{background-color:#000;}'
          document.getElementById('bgcolbtn').innerHTML = 'Black'
        }
        else {
          settings.bgcol = 0
          e.remove()
          document.getElementById('bgcolbtn').innerHTML = 'Dark'
        }
      }
      else {
        settings.bgcol = 1
        var s = document.createElement('style')
        s.setAttribute('id', 'bgcol-style')
        s.innerHTML = 'body{color:#000;}a:hover{color:#000;}div.pad{background-color:#fff;}'
        document.head.appendChild(s)
        document.getElementById('bgcolbtn').innerHTML = 'White'
      }
      await saveSettings(settings)
    }
    bgcolbtn.setAttribute('onclick', 'bgcolclick()')
    bgcolbtn.setAttribute('style', 'float:left;')
    bgcolbtn.innerHTML = 'Dark'

    var edgebtn = document.createElement('button')
    edgebtn.setAttribute('id', 'edgebtn')
    async function edgeclick() {
      var settings = await readSettings()
      var e = document.getElementById('edge-style')
      if (e) {
        settings.edge = 0
        e.remove()
        document.getElementById('edgebtn').innerHTML = 'Rainbow'
      }
      else {
        settings.edge = 1
        var s = document.createElement('style')
        s.setAttribute('id', 'edge-style')
        s.innerHTML = '.col:nth-of-type(n){background-color:#333;background:#333;}.profile{background-color:#333;background:linear-gradient(to bottom, #fff, #333);}'
        document.head.appendChild(s)
        document.getElementById('edgebtn').innerHTML = 'Edge: Gray'
      }
      await saveSettings(settings)
    }
    edgebtn.setAttribute('onclick', 'edgeclick()')
    edgebtn.setAttribute('style', 'float:left;')
    edgebtn.innerHTML = 'Rainbow'

    var widthbtn = document.createElement('button')
    widthbtn.setAttribute('id', 'widthbtn')
    async function widthclick() {
      var settings = await readSettings()
      var e = document.getElementById('width-style')
      if (e) {
        if (e.innerHTML == 'div.wrap{max-width:777px;}') {
          settings.width = 2
          e.innerHTML = 'div.wrap{max-width:100%;}'
          document.getElementById('widthbtn').innerHTML = 'Wide'
        }
        else {
          settings.width = 0
          e.remove()
          document.getElementById('widthbtn').innerHTML = 'Width: Default'
        }
      }
      else {
        settings.width = 1
        var s = document.createElement('style')
        s.setAttribute('id', 'width-style')
        s.innerHTML = 'div.wrap{max-width:777px;}'
        document.head.appendChild(s)
        document.getElementById('widthbtn').innerHTML = 'Narrow'
      }
      await saveSettings(settings)
    }
    widthbtn.setAttribute('onclick', 'widthclick()')
    widthbtn.setAttribute('class', 'center')
    widthbtn.innerHTML = 'Width: Default'

    var fontszSelect = document.createElement('select')
    fontszSelect.setAttribute('id', 'fontzsselect');
    fontszSelect.setAttribute('style', 'float:left;')
    async function setFontSize(pt) {
      var settings = await readSettings()
      settings.fontsz = pt||0
      await saveSettings(settings)
      var e = document.getElementById('fontsz-style')
      if (pt!=0 && pt!=null && pt!=''){
        var css = `body{font-size:${pt}pt}`
        if (!e) {
          e = document.createElement('style')
          e.setAttribute('id', 'fontsz-style')
          document.head.appendChild(e)}
        e.innerHTML = css}
      else if (e) e.remove()
    }
    for(var i = 0; i<=50; i+=1){
      var option = document.createElement('option')
      if (i==settings.fontsz) option.setAttribute('selected','')
      // option.setAttribute('style',`font-size:${i==0?12:Math.max(3,i)}pt;`)
      option.value = i.toString()
      option.innerHTML = `${i||''}pt`
      fontszSelect.appendChild(option)
    }
    // fontszSelect.setAttribute('style', `max-height:4em; padding-top:-8em;`)
    fontszSelect.setAttribute('onchange', `setFontSize(this.options[this.selectedIndex].value)`)

    function setSettings(){
      var live = false
      ;(async ()=>{
        polyfill()
        var e,settings = await readSettings()
        if ((e=document.getElementById('position-style'))&&settings.center!=null) {e.remove(); document.getElementById('posbtn').innerHTML='Centered'}
        if ((e=document.getElementById('bgcol-style'))&&settings.bgcol!=null) {e.remove(); document.getElementById('bgcolbtn').innerHTML='Dark'}
        if ((e=document.getElementById('edge-style'))&&settings.edge!=null) {e.remove(); document.getElementById('edgebtn').innerHTML='Rainbow'}
        if ((e=document.getElementById('width-style'))&&settings.width!=null) {e.remove(); document.getElementById('widthbtn').innerHTML='Width: Default'}
        for(var i=0; i<settings.center; ++i) setTimeout(centerclick,0)
        for(var i=0; i<settings.bgcol; ++i) setTimeout(bgcolclick,0)
        for(var i=0; i<settings.edge; ++i) setTimeout(edgeclick,0)
        for(var i=0; i<settings.width; ++i) setTimeout(widthclick,0)
        setTimeout(setFontSize.bind(null,settings.fontsz),0)
      })()
    }
    var scripttag = document.createElement('script')
    scripttag.setAttribute('id','button-helper')
    scripttag.innerHTML = [
      ,polyfill.toString()
      ,setSettings.toString().slice(26,-1)
      ,readSettings.toString()
      ,saveSettings.toString()
      ,centerclick.toString()
      ,bgcolclick.toString()
      ,edgeclick.toString()
      ,widthclick.toString()
      ,setFontSize.toString()
      ].join('\n')

    posbtn.addEventListener('click',async _=>await saveSettings(await readSettings()))
    widthbtn.addEventListener('click',async _=>await saveSettings(await readSettings()))
    bgcolbtn.addEventListener('click',async _=>await saveSettings(await readSettings()))
    edgebtn.addEventListener('click',async _=>await saveSettings(await readSettings()))
    fontszSelect.addEventListener('change',async _=>await saveSettings(await readSettings()))

    panel.appendChild(posbtn)
    panel.appendChild(widthbtn)
    panel.appendChild(bgcolbtn)
    panel.appendChild(edgebtn)
    panel.appendChild(fontszSelect)
    document.body.appendChild(scripttag)

    if (chap_select) {
      chap_select.setAttribute('onchange', 'if (this.options[this.selectedIndex].value < ' + urlGetChap(document.location.href) + '){' +
        chap_select.getAttribute('onchange') +
        '}' + ' else {document.getElementById(\'\'+this.options[this.selectedIndex].value).scrollIntoView();}')
      chap_select.setAttribute('style', 'float:right;')
      var os = chap_select.getElementsByTagName('option')
      for (i = 0; i < urlGetChap(document.location) - 1; i += 1) os[i].setAttribute('class', 'external')
      panel.appendChild(chap_select)
    }
  }
  function loadQomplete() {
    var a = document.getElementsByClassName('skiptranslate')
    for (; a.length; a[0].remove());
    a = document.getElementsByClassName('ad_container')
    for (; a.length; a[0].remove());
    document.body.removeAttribute('style')
    updateLoading(activeChap - 1, latestChap - (activeChap - 1), 0, 0, latestChap)
  }

  function appendChapterFromURL(url) {
    // Includes cookies with XPCNW https://github.com/greasemonkey/greasemonkey/issues/2826#issuecomment-362664292

    // fetch(url).then(appendFunc)
    // var oReq = XPCNativeWrapper && XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest()) || new XMLHttpRequest();

    var oReq = new XMLHttpRequest();
    ++requested_no_resp_yet
    updateLoading(activeChap - 1, appendedNow, notAppendedYet, requested_no_resp_yet, latestChap)
    oReq.onload = function(ev) {
      --requested_no_resp_yet
      var this2 = this
      var xmlDoc = new DOMParser().parseFromString(this2.responseText, "text/html")
      var url = this2.responseURL ? this2.responseURL : this2.responseURLfallback
      var chap = chapFromPage(url, xmlDoc)
      if (chap) {
        chapArr[parseInt(urlGetChap(url), 10)] = chap
        ++notAppendedYet
        updateLoading(activeChap - 1, appendedNow, notAppendedYet, requested_no_resp_yet, latestChap)
      }
    }
    oReq.responseURLfallback = url
    oReq.open("get", url, true)
    oReq.send()
  }

  function appendNextChap(n) {
    if (chapArr[n]) {
      document.body.appendChild(chapArr[n])
      ++appendedNow
      --notAppendedYet
      updateLoading(activeChap - 1, appendedNow, notAppendedYet, requested_no_resp_yet, latestChap)
      if (n < latestChap) appendNextChap(n + 1)
      else loadQomplete()
    }
    else window.setTimeout(()=>appendNextChap(n), 50)
  }
}
function polyfill(){
  if (Element.prototype.remove == undefined) {
    Element.prototype.remove = function() {
      this.parentNode.removeChild(this)
    }
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
      'use strict';
      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {return false; }
      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) k = n;
      else {
        k = len + n;
        if (k < 0) k = 0;
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
          return true; }
        k++;
      }
      return false;
    };
  }
}
// Source for checkForBadJavascripts: https://gist.github.com/BrockA/2620135
/*--- checkForBadJavascripts()
    This is a utility function, meant to be used inside a Greasemonkey script that
    has the "@run-at document-start" directive set.
    It Checks for and deletes or replaces specific <script> tags. */
function checkForBadJavascripts(controlArray) {
    /*--- Note that this is a self-initializing function.  The controlArray
        parameter is only active for the FIRST call.  After that, it is an
        event listener.

        The control array row is  defines like so:
        [bSearchSrcAttr, identifyingRegex, callbackFunction]
        Where:
            bSearchSrcAttr      True to search the SRC attribute of a script tag
                                false to search the TEXT content of a script tag.
            identifyingRegex    A valid regular expression that should be unique
                                to that particular script tag.
            callbackFunction    An optional function to execute when the script is
                                found.  Use null if not needed.
        Usage example:
            checkForBadJavascripts ( [
                [false, /old, evil init()/, function () {addJS_Node (init);} ],
                [true,  /evilExternalJS/i,  null ]
            ] );
    */
    if (!controlArray.length) return null;
    checkForBadJavascripts = function(zEvent) {
        for (var J = controlArray.length - 1; J >= 0; --J) {
            var bSearchSrcAttr = controlArray[J][0];
            var identifyingRegex = controlArray[J][1];
            if (bSearchSrcAttr) {
                if (identifyingRegex.test(zEvent.target.src)) {
                    stopBadJavascript(J);
                    return false;
                }
            }
            else {
                if (identifyingRegex.test(zEvent.target.textContent)) {
                    stopBadJavascript(J);
                    return false;
                }
            }
        }
        function stopBadJavascript(controlIndex) {
            zEvent.stopPropagation();
            zEvent.preventDefault();
            var callbackFunction = controlArray[J][2];
            if (typeof callbackFunction == "function") callbackFunction(zEvent.target);
            //--- Remove the node just to clear clutter from Firebug inspection.
            zEvent.target.parentNode.removeChild(zEvent.target);
            //--- Script is intercepted, remove it from the list.
            controlArray.splice(J, 1);
            if (!controlArray.length) {
                //--- All done, remove the listener.
                window.removeEventListener('beforescriptexecute', checkForBadJavascripts, true );
            }
        }
    }
    /*--- Use the "beforescriptexecute" event to monitor scipts as they are loaded.
        See https://developer.mozilla.org/en/DOM/element.onbeforescriptexecute
        Note seems to work on scripts that are dynamically created, despite what
        the spec says. */
    window.addEventListener('beforescriptexecute', checkForBadJavascripts, true);
    return checkForBadJavascripts;
}
function addJS_Node(text, s_URL, funcToRun) {
    var D = document;
    var scriptNode = D.createElement('script');
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';
    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    //--- Don't error check here. if DOM not available, should throw error.
    targ.appendChild(scriptNode);
}

// element.next = function() {
//   if (this.firstChild) return this.firstChild
//   if (this.nextSibling) return this.nextSibling
//   return this.parentNode.nextSibling}
// window.parentNode.replaceChild(window.cloneNode(false), window); var el = document; while(el) {e.parentNode.replaceChild(el.cloneNode(false), el); el = el.next()} document.head.parentNode.replaceChild(document.head.cloneNode(true), document.head); document.body.parentNode.replaceChild(document.body.cloneNode(true), document.body); var el = document.bodyj elClone = el.cloneNode(true); el.parentNode.replaceChild(elClone, el);
// document.styleSheets[0].cssText = "";