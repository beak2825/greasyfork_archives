// ==UserScript==
// @name	ViewTube_GM
// @version	2017.05.27
// @description	Watch videos from video sharing websites without Flash Player.
// @author	trupf
// @namespace	https://userscripts.org/users/trupf
// @__icon	http://s3.amazonaws.com/uso_ss/icon/87011/large.png
// @icon	https://raw.githubusercontent.com/sebaro/viewtube/master/viewtube.png
// @require	https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.6.1/hls.min.js
// @require	https://cdnjs.cloudflare.com/ajax/libs/shaka-player/1.6.5/shaka-player.compiled.js
// @_require	http://dashif.org/reference/players/javascript/v1.6.0/dist/dash.all.js
// @_require	http://dashif.org/reference/players/javascript/v2.0.0/dist/dash.all.min.js
// @include	http://youtube.com*
// @include	http://www.youtube.com*
// @include	https://youtube.com*
// @include	https://www.youtube.com*
// @include	http://gaming.youtube.com*
// @include	https://gaming.youtube.com*
// @include	http://dailymotion.com*
// @include	http://www.dailymotion.com*
// @include	https://dailymotion.com*
// @include	https://www.dailymotion.com*
// @include	http://vimeo.com*
// @include	http://www.vimeo.com*
// @include	https://vimeo.com*
// @include	https://www.vimeo.com*
// @include	http://metacafe.com*
// @include	http://www.metacafe.com*
// @include	https://metacafe.com*
// @include	https://www.metacafe.com*
// @include	http://break.com*
// @include	http://www.break.com*
// @include	https://break.com*
// @include	https://www.break.com*
// @include	http://funnyordie.com*
// @include	http://www.funnyordie.com*
// @include	https://funnyordie.com*
// @include	https://www.funnyordie.com*
// @include	http://veoh.com*
// @include	http://www.veoh.com*
// @include	https://veoh.com*
// @include	https://www.veoh.com*
// @include	http://www.imdb.org/*
// @include	http://www.imdb.com/video*
// @include	https://www.imdb.com/video*
// @include	http://viki.com*
// @include	http://www.viki.com*
// @include	https://viki.com*
// @include	https://www.viki.com*
// @include	http://vevo.com*
// @include	http://www.vevo.com*
// @include	https://vevo.com*
// @include	https://www.vevo.com*
// @include	http://facebook.com*
// @include	http://www.facebook.com*
// @include	https://facebook.com*
// @include	https://www.facebook.com*
// @include	https://*/owncloud/apps/*
// @include	https://*/nextcloud/apps/*
// @license	GPLv3
// @grant 	GM_xmlhttpRequest
// @grant 	GM_setValue
// @grant 	GM_getValue
// @grant 	GM_log
// @run-at	document-end

// @downloadURL https://update.greasyfork.org/scripts/1203/ViewTube_GM.user.js
// @updateURL https://update.greasyfork.org/scripts/1203/ViewTube_GM.meta.js
// ==/UserScript==


/*

  Copyright (C) 2010 - 2014 Tobias Rupf

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.

  This Program is mainly based on the work of Sebastian Luncan
  (Website: http://isebaro.com/viewtube)

  Youtube Signature decryption and mutation observers by Gantt.
  (see http://userscripts.org/scripts/show/25105)

*/

(function() {

// ==========Variables========== //

// Userscript
var userscript = 'ViewTube_GM';

// Page
var page = {win: window, doc: document, body: document.body, url: window.location.href};
var videoDiv,videoLink;
var dashplayer;

// Player
//var player = {};
var myPlayerWindow, HeadWindow, OrgPlayerIndex;
var feature = {'autoplay': true, 'definition': true, 'container': true, 'dash': false, 'direct': false, 'widesize': true, 'fullsize': true};
var plugins = ['HTML5'];
if ((navigator.appVersion.indexOf('Chrome/') == -1) || (parseInt(navigator.appVersion.substr(navigator.appVersion.indexOf('Chrome/')+7,2)) < 35)
   || ((navigator.platform.indexOf('Win') != -1) && (parseInt(navigator.appVersion.substr(navigator.appVersion.indexOf('Chrome/')+7,2)) < 45))) {
  plugins = ['Auto'].concat(plugins);
  plugins = plugins.concat(['MPEG', 'MP4', 'FLV', 'VLC']);
  if (navigator.platform.indexOf('Win') != -1) plugins = plugins.concat(['WMP', 'WMP2', 'QT']);
  else if (navigator.platform.indexOf('Mac') != -1) plugins = plugins.concat(['QT']);
  else plugins = plugins.concat(['Totem', 'Xine']);
}
var option = {'plugin': plugins[0], 'autoplay': false, 'autoget': false, 'definition': 'HD', 'container': 'MP4', 'widesize': false, 'fullsize': false};
var mimetypes = {
  'MPEG': 'video/mpeg',
  'MP4': 'video/mp4',
  'HLS': 'video/mp4',
  'WebM': 'video/webm',
  'FLV': 'video/x-flv',
  'MOV': 'video/quicktime',
  'M4V': 'video/x-m4v',
  'AVI': 'video/x-msvideo',
  '3GP': 'video/3gpp',
  'WMP': 'application/x-ms-wmp',
  'WMP2': 'application/x-mplayer2',
  'QT': 'video/quicktime',
  'VLC': 'application/x-vlc-plugin',
  'Totem': 'application/x-totem-plugin',
  'Xine': 'application/x-xine-plugin'
};

// Links
var website = 'https://greasyfork.org/de/scripts/1203-viewtube-gm';
var contact = 'https://greasyfork.org/de/scripts/1203-viewtube-gm/feedback';

// ==========Fixes========== //

// Don't run on frames or iframes
//if ((page.url.indexOf('imdb.com/') == -1) && (window.top != window.self)) return;


// ==========Functions========== //

function createVideoElement (type, content, player) {
  function createPlayerElement (type, content, player) {
    player['contentVideo'] = createMyElement (type, content,'','','',player);
    player['contentVideo'].width = player['contentWidth'];
    player['contentVideo'].height = player['contentHeight'];
    styleMyElement (player['contentVideo'], {position: 'relative', width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px'});
    modifyMyElement (player['playerContent'], 'div', '', true);
    appendMyElement (player['playerContent'], player['contentVideo']);
  }
  setTimeout(function() { createPlayerElement(type, content, player); }, 0);
}

function passwdDialog (player) {
  playMyVideo (player, false);
  modifyMyElement (player['playerContent'], 'div', '', true);
  styleMyElement (player['playerContent'], {backgroundColor: '#F4F4F4',})
  /* Login Data */
  var myLoginWindowUser = createMyElement ('div', 'Username: <input type="text" name="user" id="user" placeholder="username" value="'+player['user']+'" autofocus="" autocomplete="on" autocapitalize="off" autocorrect="off" required="" original-title=""> <label for="user" class="infield">Benutzername</label>', '', '', '');
  styleMyElement (myLoginWindowUser, {position: 'relative', backgroundColor: '#F4F4F4', margin: '5px', marginLeft: '5px !important',width: '200px !important', textAlign: 'left'});
  appendMyElement (player['playerContent'], myLoginWindowUser);
  var myLoginWindowPass = createMyElement ('div', 'Password: <input type="password" name="password" id="password" value="'+player['passwd']+'" placeholder="password" autocomplete="on" autocapitalize="off" autocorrect="off" required="" original-title=""> <label for="password" class="infield">Passwort</label>', '', '', '');
  styleMyElement (myLoginWindowPass, {position: 'relative', backgroundColor: '#F4F4F4', margin: '5px', marginLeft: '5px !important',width: '200px !important', textAlign: 'left'});
  appendMyElement (player['playerContent'], myLoginWindowPass);
  var submitButton = createMyElement ('div', '<input type="submit" id="submit" class="login primary" value="Submit" original-title="">', '', '', '');
  styleMyElement (submitButton, {display: 'inline', color: '#336699', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (myLoginWindowPass, submitButton);

  submitButton.addEventListener ('click', function () {
    player['user'] = document.getElementById("user").value;
    player['passwd'] = document.getElementById("password").value;
    setMyOptions('user',player['user']);
    setMyOptions('passwd',player['passwd']);
    removeMyElement (player['playerContent'], myLoginWindowPass);
    removeMyElement (player['playerContent'], myLoginWindowUser);
    styleMyElement (player['playerContent'], {backgroundColor: '#000000',});
    playMyVideo (player, false);
  }, false);
}

function createMyElement (type, content, event, action, target, player) {
  var obj = page.doc.createElement(type);
  if (content) {
    if (type == 'div') obj.innerHTML = content;
    else if (type == 'img') obj.src = content;
    else if (type == 'option') {
      obj.value = content;
      obj.innerHTML = content;
    }
    else if (type == 'video') {
      // username + password is for HTML5 playback not required again, ==> only for testing
/*
      var urlSplit = content.split('://');
      if (!player['user']) var url = content;
      else if (!player['passwd']) var url = urlSplit[0] + '://' + player['user'] + '@' + urlSplit[1];
      else var url = urlSplit[0] + '://' + player['user'] + ':' + player['passwd'] +'@' + urlSplit[1]; */
      obj.id = 'vtVideo';
      obj.controls = 'true';
      obj.preload = 'auto';
      obj.autoplay = 'autoplay';
      obj.volume = 0.5;
      obj.innerHTML = '<br><br>The video should be loading. If it doesn\'t load, make sure your browser supports HTML5\'s Video and this video codec. If you think it\'s a script issue, please report it <a href="' + contact + '" style="color:#00892C">here</a>.';
      if (player.videoPlay.indexOf('DASH MP4') != -1) {
         // Install built-in polyfills to patch browser incompatibilities.
         shaka.polyfill.installAll();
         // Check to see if the browser supports the basic APIs Shaka needs.
         shaka.Player.support().then(function(support) {
           if (support.supported) {
             function onErrorEvent(event) {onError(event.detail);};
             function onError(error) {console.error(error); console.log('Error code ' + error.code);}
             var myPlayer = new shaka.Player(obj);
             myPlayer.addEventListener('error', onErrorEvent);
             // Try to load a manifest.
             myPlayer.load(content).then(function(){}).catch(onError);
           } else {
             console.log('Browser does not support DASH!');
           }
         });
      }
      else if (player.videoPlay.indexOf('HLS') != -1 || player.videoPlay.indexOf('HTTP Live Streaming') != -1 || content.indexOf('.m3u8') != -1) {
        if (typeof Hls == 'function' && Hls.isSupported()) {
          var hls_error_counter = 0;
          var hls = new Hls();
          hls.on(Hls.Events.MANIFEST_PARSED,function(event, data) {
              obj.play();
          });
          hls.loadSource(content);
          hls.attachMedia(obj);
        }
      }
      else obj.src = content;
    }
    else if (type == 'object') {
      // external player may require username + password
      var urlSplit = content.split('://');
      if (!player['user']) obj.data = content;
      else if (!player['passwd']) obj.data = urlSplit[0] + '://' + player['user'] + '@' + urlSplit[1];
      else obj.data = urlSplit[0] + '://' + player['user'] + ':' + player['passwd'] +'@' + urlSplit[1];
          console.log(obj.data);
      obj.id = 'videoplayer';
      obj.innerHTML = '<br><br>The video should be loading. If it doesn\'t load, make sure a video plugin is installed. If you think it\'s a script issue, please report it <a href="' + contact + '" style="color:#00892C">here</a>.<param name="scale" value="aspect"><param name="stretchtofit" value="true"><param name="autostart" value="true"><param name="autoplay" value="true">';
    }
    else if (type == 'embed') {
      // external player may require username + password
      var urlSplit = content.split('://');
      if (!player['user']) var url = content;
      else if (!player['passwd']) var url = urlSplit[0] + '://' + player['user'] + '@' + urlSplit[1];
      else var url = urlSplit[0] + '://' + player['user'] + ':' + player['passwd'] +'@' + urlSplit[1];
          console.log(url);
      if (option['plugin'] == 'VLC') obj.setAttribute('target', url);
      else obj.src = url;
      obj.id = 'videoplayer';
      obj.innerHTML = '<br><br>The video should be loading. If it doesn\'t load, make sure a video plugin is installed. If you think it\'s a script issue, please report it <a href="' + contact + '" style="color:#00892C">here</a>.<param name="scale" value="aspect"><param name="stretchtofit" value="true"><param name="autostart" value="true"><param name="autoplay" value="true">';
    }
  }
  if (type == 'video' || type == 'object' || type == 'embed') {
    if (option['plugin'] == 'Auto' || option['plugin'] == 'Alt' || option['plugin'] == 'HTML5') {
      if (content == 'DASH')  obj.type = 'application/dash+xml';
      else obj.type = mimetypes[player['videoPlay'].replace(/.*\s/, '')];
    }
    else {
      obj.type = mimetypes[option['plugin']];
    }
    obj.id = 'vtVideo';
  }
  if (event == 'change') {
    if (target == 'video') {
      obj.addEventListener ('change', function (e) {
        if (e.target) player['videoPlay'] = e.target.value;
          else if (e.srcElement) player['videoPlay'] = e.srcElement.value;
	    if (player['isGetting']) {
	      modifyMyElement (player['buttonGet'] , 'div', 'Get', false);
	      player['isGetting'] = false;
	    }
	    if (player['isPlaying']) playMyVideo(player, option['autoplay']);
      }.bind(player), false);
    }
    else if (target == 'plugin') {
      obj.addEventListener ('change', function (e) {
        if (e.target) option['plugin'] = e.target.value;
          else if (e.srcElement) option['plugin'] = e.srcElement.value;
	    setMyOptions ('viewtube_plugin', option['plugin']);
	    if (player['isPlaying']) playMyVideo(player, true);
      }.bind(player), false);
    }
  }
  else if (event == 'click') {
    obj.addEventListener ('click', function () {
      if (action == 'close') {
	    removeMyElement(page.body, target);
      }
      else if (action == 'logo') {
	    page.win.location.href = website;
      }
      else if (action == 'play') {
	    playMyVideo(player, !player['isPlaying']);
      }
      else if (action == 'get') {
	    getMyVideo(player);
      }
      else if (action == 'autoplay') {
	    option['autoplay'] = (option['autoplay']) ? false : true;
	    if (option['autoplay']) {
//	      styleMyElement (player['buttonPlay'], {display: 'none'});
	      styleMyElement (player['buttonAutoplay'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
	      if (!player['isPlaying']) playMyVideo(player, true);
	    }
	    else {
//	      styleMyElement (player['buttonPlay'], {display: 'inline'});
	      styleMyElement (player['buttonAutoplay'], {color: '#CCCCCC', textShadow: '0px 0px 0px'});
	      playMyVideo(player, false);
	    }
	    setMyOptions ('viewtube_autoplay', option['autoplay']);
      }
      else if (action == 'definition') {
	    for (var itemDef = 0; itemDef < option['definitions'].length; itemDef++) {
	    if (option['definitions'][itemDef].match(/[A-Z]/g).join('') == option['definition']) {
	      var nextDef = (itemDef + 1 < option['definitions'].length) ? itemDef + 1 : 0;
	      option['definition'] = option['definitions'][nextDef].match(/[A-Z]/g).join('');
	      break;
	    }
	  }
	  modifyMyElement (player['buttonDefinition'], 'div', option['definition'], false);
	  setMyOptions ('viewtube_definition', option['definition']);
	  if (player['isGetting']) {
	    modifyMyElement (player['buttonGet'] , 'div', 'Get', false);
	    player['isGetting'] = false;
	  }
	  selectMyVideo (player);
	  if (player['isPlaying']) playMyVideo(player, true);
      }
      else if (action == 'container') {
	    for (var itemCont = 0; itemCont < option['containers'].length; itemCont++) {
	      if (option['containers'][itemCont] == option['container']) {
            var nextCont = (itemCont + 1 < option['containers'].length) ? itemCont + 1 : 0;
	        option['container'] = option['containers'][nextCont];
	        break;
	      }
	    }
	    modifyMyElement (player['buttonContainer'], 'div', option['container'], false);
	    setMyOptions ('viewtube_container', option['container']);
	    if (player['isGetting']) {
	      modifyMyElement (player['buttonGet'] , 'div', 'Get', false);
	      player['isGetting'] = false;
	    }
	    selectMyVideo (player);
	    if (player['isPlaying']) playMyVideo(player, true);
      }
      else if (action == 'widesize') {
	    option['widesize'] = (option['widesize']) ? false : true;
	    setMyOptions ('viewtube_widesize', option['widesize']);
	    resizeMyPlayer(player, 'widesize');
      }
      else if (action == 'fullsize') {
	    option['fullsize'] = (option['fullsize']) ? false : true;
	    resizeMyPlayer(player, 'fullsize');
      }
      else if (action == 'PWdialog') {
        passwdDialog (player);
      }
    }.bind(player), false);
  }
  return obj;
}

function getMyElement (obj, type, from, value, child, content) {
  var getObj, chObj, coObj;
  var pObj = (!obj) ? page.doc : obj;
  if (type == 'body') getObj = pObj.body;
  else {
    if (from == 'id') getObj = pObj.getElementById(value);
    else if (from == 'class') getObj = pObj.getElementsByClassName(value);
    else if (from == 'tag') getObj = pObj.getElementsByTagName(type);
    else if (from == 'ns') getObj = pObj.getElementsByTagNameNS(value, type);
  }
  chObj = (child >= 0) ? getObj[child] : getObj;
  if (content && chObj) {
    if (type == 'html' || type == 'body' || type == 'div' || type == 'option') coObj = chObj.innerHTML;
    else if (type == 'object') coObj = chObj.data;
    else if (type == 'img' || type == 'video' || type == 'embed') coObj = chObj.src;
    else coObj = chObj.textContent;
    return coObj;
  }
  else {
    return chObj;
  }
}

function modifyMyElement (obj, type, content, clear, hide) {
  if (content) {
    if (type == 'div') obj.innerHTML = content;
    else if (type == 'option') {
      obj.value = content;
      obj.innerHTML = content;
    }
    else if (type == 'object') obj.data = content;
    else if (type == 'img' || type == 'video' || type == 'embed') obj.src = content;
  }
  if (clear) {
    if (obj.hasChildNodes()) {
      while (obj.childNodes.length >= 1) {
        obj.removeChild(obj.firstChild);
      }
    }
  }
  if (hide) {
    for(var i = 0; i < obj.children.length; i++) {
      styleMyElement(obj.children[i], {display: 'none'});
    }
  }
}

function cleanMyElement (element, hide) {
  var elEmbed, elVideo;
  if (hide) styleMyElement (element, {display: 'none'});
  elEmbed = getMyElement (element, 'embed', 'tag', '', 0, false) || getMyElement (element, 'object', 'tag', '', 0, false);
  if (elEmbed && elEmbed.parentNode) {
    removeMyElement (elEmbed.parentNode, elEmbed);
    if (!hide) return;
  }
  elVideo = getMyElement (element, 'video', 'tag', '', 0, false);
    if (elVideo && elVideo.src && elVideo.currentSrc) {
    modifyMyElement (elVideo, 'video', 'none', true);
    if (!hide && elVideo.parentNode) removeMyElement (elVideo.parentNode, elVideo);
    if (elVideo.parentNode) try {elVideo.pause()} catch(e) {};
  }
  var elWait = 50;
  var elRemove = page.win.setInterval (function () {
    if (!elVideo) {
      elVideo = getMyElement (element, 'video', 'tag', '', 0, false);
      if (!elVideo) {
	elEmbed = getMyElement (element, 'embed', 'tag', '', 0, false) || getMyElement (element, 'object', 'tag', '', 0, false);
	if (elEmbed && elEmbed.id != 'vtVideo' && elEmbed.parentNode) {
	  removeMyElement (elEmbed.parentNode, elEmbed);
	  page.win.clearInterval (elRemove);
	}
      }
    }
    if (elVideo && elVideo.id != 'vtVideo' && elVideo.currentSrc && elVideo.currentSrc.indexOf('none') == -1) {
      modifyMyElement (elVideo, 'video', 'none', true);
      if (elVideo.parentNode) try {elVideo.pause()} catch(e) {};
      if (!hide && elVideo.parentNode) removeMyElement (elVideo.parentNode, elVideo);
    }
    if (elWait > 0) elWait--;
    else page.win.clearInterval (elRemove);
  }, 500);
}

function styleMyElement (obj, styles) {
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) obj.style[property] = styles[property];
  }
}

function appendMyElement (parent, child) {
  parent.appendChild(child);
}

function removeMyElement (parent, child) {
  parent.removeChild(child);
}

function replaceMyElement (parent, orphan, child) {
  parent.replaceChild(orphan, child);
}

function createHiddenElem(tag, id) {
  var elem=document.createElement(tag);
  elem.setAttribute('id', id);
  elem.setAttribute('style', 'display:none;');
  page.doc.body.appendChild(elem);
  return elem;
}

function injectScript(code) {
  var script=document.createElement('script');
  script.type='application/javascript';
  script.textContent=code;
  page.doc.body.appendChild(script);
  page.doc.body.removeChild(script);
}

function createMyPlayer (player) {
  /* Get My Options */
  getMyOptions ();

  /* Player Settings */
  if (!player['panelHeight']) player['panelHeight'] = 18;
  if (!player['panelPadding']) player['panelPadding'] = 2;

  /* The Panel */
  var panelWidth = player['playerWidth'] - player['panelPadding'] * 2;
  player['playerPanel'] = createMyElement ('div', '', '', '', '', player);
  styleMyElement(player['playerPanel'], {width: panelWidth + 'px', height: player['panelHeight'] + 'px', padding: player['panelPadding'] + 'px', backgroundColor: 'inherit', textAlign: 'center'});
  appendMyElement (player['playerWindow'], player['playerPanel']);

  /* Panel Items */
  var panelItemBorder = 1;
  var panelItemHeight = player['panelHeight'] - panelItemBorder * 2;
  /* Panel Logo */
  player['panelLogo'] = createMyElement ('div', userscript + ':', 'click', 'logo', '', player);
  player['panelLogo'].title = 'ViewTube: click to visit the script web page';
  styleMyElement (player['panelLogo'], {height: panelItemHeight + 'px', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '0px', display: 'inline', color: '#336699', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (player['playerPanel'], player['panelLogo']);

  /* Panel Video Menu */
  player['videoMenu'] = createMyElement ('select', '', 'change', '', 'video', player);
  player['videoMenu'].title = 'Videos: select the video format for playback';
  styleMyElement(player['videoMenu'], {width: '200px', height: panelItemHeight + 'px', border: '1px solid transparent', padding: '0px', display: 'inline', backgroundColor: 'inherit', color: '#336699', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (player['playerPanel'], player['videoMenu'] );
  for (var videoCode in player['videoList']) {
    player['videoItem'] = createMyElement ('option', videoCode, '', '', '', player);
    styleMyElement(player['videoItem'], {padding: '0px', display: 'block', backgroundColor: '#F4F4F4', color: '#336699', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement (player['videoMenu'], player['videoItem']);
  }

  /* Panel Plugin Menu */
  player['pluginMenu'] = createMyElement ('select', '', 'change', '', 'plugin', player);
  player['pluginMenu'].title = 'Plugins: select the video plugin for playback';
  styleMyElement(player['pluginMenu'], {width: '70px', height: panelItemHeight + 'px', border: '1px solid transparent', borderRadius: '3px', padding: '0px', display: 'inline', backgroundColor: 'inherit', color: '#336699', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (player['playerPanel'], player['pluginMenu'] );
  for (var p = 0; p < plugins.length; p++) {
    player['pluginItem'] = createMyElement ('option', plugins[p], '', '', '', player);
    styleMyElement (player['pluginItem'], {padding: '0px', display: 'block', backgroundColor: '#F4F4F4', color: '#336699', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
    appendMyElement (player['pluginMenu'], player['pluginItem']);
  }
  player['pluginMenu'].value = option['plugin'];

  /* Panel Play Button */
  player['buttonPlay'] = createMyElement ('div', 'Play', 'click', 'play', '', player);
  player['buttonPlay'].title = 'Play/Stop: click to start/stop video playback';
  styleMyElement(player['buttonPlay'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 3px', display: 'inline', color: '#37B704', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
//  if (option['autoplay']) styleMyElement (player['buttonPlay'], {display: 'none'});
  appendMyElement (player['playerPanel'], player['buttonPlay']);

  /* Panel Get Button */
  player['buttonGet'] = createMyElement ('div', 'Get', 'click', 'get', '', player);
  player['buttonGet'].title = 'Get: click to download the selected video format';
  styleMyElement(player['buttonGet'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C000C0', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (player['playerPanel'], player['buttonGet']);

  /* Panel Autoplay Button */
  if (feature['autoplay']) {
    player['buttonAutoplay'] = createMyElement ('div', 'AP', 'click', 'autoplay', '', player);
    player['buttonAutoplay'].title = 'Autoplay: click to enable/disable auto playback on page load';
    styleMyElement(player['buttonAutoplay'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', fontWeight: 'initial', verticalAlign: 'baseline', cursor: 'pointer'});
    if (option['autoplay']) styleMyElement (player['buttonAutoplay'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement (player['playerPanel'], player['buttonAutoplay']);
  }

  /* Panel Definition Button */
  if (feature['definition']) {
    player['buttonDefinition'] = createMyElement ('div', option['definition'], 'click', 'definition', '', player);
    player['buttonDefinition'].title = 'Definition: click to change the preferred video definition';
    styleMyElement(player['buttonDefinition'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
    appendMyElement (player['playerPanel'], player['buttonDefinition']);
  }

  /* Panel Container Button */
  if (feature['container']) {
    player['buttonContainer'] = createMyElement ('div', option['container'], 'click', 'container', '', player);
    player['buttonContainer'].title = 'Container: click to change the preferred video container';
    styleMyElement(player['buttonContainer'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', fontWeight: 'initial', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
    appendMyElement (player['playerPanel'], player['buttonContainer']);
  }

  /* Panel Widesize Button */
  if (feature['widesize']) {
    if (option['widesize']) player['buttonWidesize'] = createMyElement ('div', '&lt;', 'click', 'widesize', '', player);
    else player['buttonWidesize'] = createMyElement ('div', '&gt;', 'click', 'widesize', '', player);
    player['buttonWidesize'].title = 'Widesize: click to enter player widesize or return to normal size';
    styleMyElement(player['buttonWidesize'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C05800', fontSize: '12px', fontWeight: 'initial', textShadow: '1px 1px 2px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
    appendMyElement (player['playerPanel'], player['buttonWidesize']);
  }

  /* Panel Fullsize Button */
  if (feature['fullsize']) {
    if (option['fullsize']) player['buttonFullsize'] = createMyElement ('div', '-', 'click', 'fullsize', '', player);
    else player['buttonFullsize'] = createMyElement ('div', '+', 'click', 'fullsize', '', player);
    player['buttonFullsize'].title = 'Fullsize: click to enter player fullsize or return to normal size';
    styleMyElement (player['buttonFullsize'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C05800', fontSize: '12px', fontWeight: 'initial', textShadow: '1px 1px 2px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
    appendMyElement (player['playerPanel'], player['buttonFullsize']);
  }

  /* Panel Password Button */
  if (feature['PWdialog']) {
    player['buttonPW'] = createMyElement ('div', 'PW', 'click', 'PWdialog', '', player);
    player['buttonPW'].title = 'Password: click to show password dialog';
    styleMyElement (player['buttonPW'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C05800', fontSize: '12px', fontWeight: 'initial', textShadow: '1px 1px 2px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
    appendMyElement (player['playerPanel'], player['buttonPW']);
  }

  /* The Content */
  player['contentWidth'] = player['playerWidth'];
  if (player['panelHeight'] == 18) player['contentHeight'] = player['playerHeight'] - player['panelHeight'] - player['panelPadding'] * 2;
  else player['contentHeight'] = player['playerHeight'] - player['panelHeight'];
  player['playerContent'] = createMyElement ('div', '', '', '', '');
  styleMyElement(player['playerContent'], {width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px', position: 'relative', color: '#AD0000', backgroundColor: '#000000', fontSize: '14px', fontWeight: 'bold', textAlign: 'center'});
  appendMyElement (player['playerWindow'], player['playerContent']);

  /* The Video Thumbnail */
  if (player['videoThumb']) {
    player['contentImage'] = createMyElement ('img', player['videoThumb'], 'click', 'play', '', player);
    player['contentImage'].title = 'Click to start video playback';
    styleMyElement(player['contentImage'], {maxWidth: '100%', maxHeight: '100%', position: 'absolute', top: '0px', left: '0px', right: '0px', bottom: '0px', margin: 'auto', border: '0px', cursor: 'pointer'});

    // make sure small thumbnails will fill up the content area
    player['contentImage'].addEventListener('load', function () {
      // if image is wider than content area, scale its width, otherwise its height
      if (this.width/this.height >= player['contentWidth']/player['contentHeight']) {
        this.style.width = '1920px';
      }
      else {
        this.style.height = '1080px';
      }
    });
  }

  /* Disabled Features */
  if (!feature['autoplay']) option['autoplay'] = false;
  if (!feature['widesize']) option['widesize'] = false;
  if (!feature['fullsize']) option['fullsize'] = false;

  /* Resize My Player */
  if (option['widesize']) resizeMyPlayer(player, 'widesize');
  if (option['fullsize']) resizeMyPlayer(player, 'fullsize');

  /* Select My Video */
  if (feature['definition'] || feature['container']) selectMyVideo (player);

  /* Play My Video */
  playMyVideo (player, option['autoplay']);
}

function selectMyVideo (player) {
  var vdoCont = (option['container'] != 'Any') ? [option['container']] : option['containers'];
  var vdoDef = option['definitions'];
  var vdoList = {};
  for (var vC = 0; vC < vdoCont.length; vC++) {
    if (vdoCont[vC] != 'Any') {
      for (var vD = 0; vD < vdoDef.length; vD++) {
	var format = vdoDef[vD] + ' ' + vdoCont[vC];
	if (!vdoList[vdoDef[vD]]) {
	  for (var vL in player['videoList']) {
	    if (vL == format) {
	      vdoList[vdoDef[vD]] = vL;
	      break;
	    }
	  }
	}
      }
    }
  }
  if (option['definition'] == 'UHD') {
    if (vdoList['Ultra High Definition']) player['videoPlay'] = vdoList['Ultra High Definition'];
    else if (vdoList['Full High Definition']) player['videoPlay'] = vdoList['Full High Definition'];
    else if (vdoList['High Definition']) player['videoPlay'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) player['videoPlay'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) player['videoPlay'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) player['videoPlay'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'FHD') {
    if (vdoList['Full High Definition']) player['videoPlay'] = vdoList['Full High Definition'];
    else if (vdoList['High Definition']) player['videoPlay'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) player['videoPlay'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) player['videoPlay'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) player['videoPlay'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'HD') {
    if (vdoList['High Definition']) player['videoPlay'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) player['videoPlay'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) player['videoPlay'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) player['videoPlay'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'SD') {
    if (vdoList['Standard Definition']) player['videoPlay'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) player['videoPlay'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) player['videoPlay'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'LD') {
    if (vdoList['Low Definition']) player['videoPlay'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) player['videoPlay'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'VLD') {
    if (vdoList['Very Low Definition']) player['videoPlay'] = vdoList['Very Low Definition'];
    else if (vdoList['Low Definition']) player['videoPlay'] = vdoList['Low Definition'];
  }
  player['videoMenu'].value = player['videoPlay'];
}

function playMyVideo (player, play) {
  if (play) {
    player['isPlaying'] = true;
    modifyMyElement (player['buttonPlay'], 'div', 'Stop', false);
    styleMyElement (player['buttonPlay'], {color: '#AD0000'});
    if (option['plugin'] == 'HTML5') {
/*      if (player['videoPlay'] == 'DASH MP4') {
  		player['contentVideo'] = createVideoElement ('video', 'DASH', player);
      }
      else */ 
        player['contentVideo'] = createVideoElement ('video', player['videoList'][player['videoPlay']], player);
    }
    else if (navigator.appName == 'Netscape') player['contentVideo'] = createVideoElement ('embed', player['videoList'][player['videoPlay']], player);
    else createVideoElement ('object', player['videoList'][player['videoPlay']], player);
  }
  else {
    player['isPlaying'] = false;
    modifyMyElement (player['buttonPlay'], 'div', 'Play', false);
    styleMyElement (player['buttonPlay'], {color: '#37B704'});
    modifyMyElement (player['playerContent'], 'div', '', true);
    if (player['videoDuration']) {
    var hours = Math.floor(player['videoDuration'] / 3600);
    var minutes = Math.floor((player['videoDuration'] % 3600) / 60);
    var seconds = (player['videoDuration'] % 3600) % 60;
    var duration = (hours > 0 ? (hours + ':' + (minutes > 9 ? minutes : '0' + minutes)) : minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds);
    player['durationElem'] = createMyElement ('div',duration , '', '', '', player);
    styleMyElement (player['durationElem'], {position: 'absolute', backgroundColor: '#000000', color: '#FFFFFF', fontSize: '14px',fontWeight: 'bold', textAlign: 'right',
                                             right: '5px', bottom: '10px',paddingLeft: '2px', paddingRight: '2px', zIndex: '9'});
    appendMyElement (player['playerContent'], player['durationElem']);
  }

    if (player['contentImage']) appendMyElement (player['playerContent'], player['contentImage']);
    else showMyMessage ('!thumb', '', player);
  }
}

function getMyVideo (player) {
  var vdoURL = player['videoList'][player['videoPlay']];
  if (player['videoTitle']) {
    var vdoD = ' (' + player['videoPlay'] + ')';
    vdoD = vdoD.replace(/Ultra High Definition/, 'UHD');
    vdoD = vdoD.replace(/Full High Definition/, 'FHD');
    vdoD = vdoD.replace(/High Definition/, 'HD');
    vdoD = vdoD.replace(/Standard Definition/, 'SD');
    vdoD = vdoD.replace(/Very Low Definition/, 'VLD');
    vdoD = vdoD.replace(/Low Definition/, 'LD');
    vdoD = vdoD.replace(/\sFLV|\sMP4|\sWebM|\s3GP/g, '');
    vdoURL = vdoURL + '&title=' + player['videoTitle'] + vdoD;
  }
  if (option['autoget']) page.win.location.href = vdoURL;
  else {
    var vdoLink = 'Get <a href="' + vdoURL + '">Link</a>';
    modifyMyElement (player['buttonGet'] , 'div', vdoLink, false);
    player['isGetting'] = true;
  }
}

function resizeMyPlayer (player, size) {
  if (size == 'widesize') {
    if (option['widesize']) {
      modifyMyElement (player['buttonWidesize'], 'div', '&lt;', false);
      var playerWidth = player['playerWideWidth'];
      var playerHeight = player['playerWideHeight'];
      var sidebarMargin = player['sidebarMarginWide'];
      var playlistMargin = player['playerWideHeight'];
    }
    else {
      modifyMyElement (player['buttonWidesize'], 'div', '&gt;', false);
      var playerWidth = player['playerWidth'];
      var playerHeight = player['playerHeight'];
      var sidebarMargin = player['sidebarMarginNormal'];
      var playlistMargin = 0;
    }
  }
  else if (size == 'fullsize') {
    if (option['fullsize']) {
      var playerPosition = 'fixed';
      var playerWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
      var playerHeight = page.win.innerHeight || page.doc.documentElement.clientHeight;
      var playerIndex = '2147483647';
      var frames = document.getElementsByTagName('iframe');
      for (var i = 0 ; i <frames.length; i++) styleMyElement(frames[i], {display: 'none'});
      setTimeout(function(){ if (option['fullsize']) {var frames = document.getElementsByTagName('iframe'); for (var i = 0 ; i <frames.length; i++) styleMyElement(frames[i], {display: 'none'});}},3000);
      if (!player['isFullsize']) {
        if (feature['widesize']) styleMyElement (player['buttonWidesize'], {display: 'none'});
        modifyMyElement (player['buttonFullsize'], 'div', '-', false);
        styleMyElement (page.body, {overflow: 'hidden'});
        styleMyElement (page.body.parentNode, {overflow: 'hidden'});
        if (!player['resizeListener']) player['resizeListener'] = function() {resizeMyPlayer(player, 'fullsize')};
        page.win.addEventListener ('resize', player['resizeListener'], false);
        OrgPlayerIndex = player['playerWindow'].style['zIndex'];
        OrgHeadWindowIndex = '';
        if (HeadWindow && HeadWindow.style) {
          styleMyElement(HeadWindow, {visibility: 'hidden'});
        }
        player['isFullsize'] = true;
        if (player['isPlaying']) {
          if (player['contentVideo'] && player['contentVideo'].paused) player['contentVideo'].play();
        }
      }
    }
    else {
      var playerPosition = 'relative';
      var playerWidth = (option['widesize']) ? player['playerWideWidth'] : player['playerWidth'];
      var playerHeight = (option['widesize']) ? player['playerWideHeight'] : player['playerHeight'];
      var playerIndex = OrgPlayerIndex;
      var frames = document.getElementsByTagName('iframe');
      for (var i = 0 ; i <frames.length; i++) styleMyElement(frames[i], {display: ''});
      if (feature['widesize']) styleMyElement (player['buttonWidesize'], {display: 'inline'});
      modifyMyElement (player['buttonFullsize'], 'div', '+', false);
      styleMyElement (page.body, {overflow: 'auto'});
      styleMyElement (page.body.parentNode, {overflow: 'auto'});
      page.win.removeEventListener ('resize', player['resizeListener'], false);
      if (HeadWindow && HeadWindow.style) styleMyElement(HeadWindow, {visibility: 'visible'});
        var frames = document.getElementsByTagName('iframe')
          for (var i = 0 ; i <frames.length; i++) {
              styleMyElement(frames[i], { display: ''});
          }
      player['isFullsize'] = false;
      if (player['isPlaying']) {
        if (player['contentVideo'] && player['contentVideo'].paused) player['contentVideo'].play();
      }
    }
  }

  /* Resize The Player */
  if (size == 'widesize') {
    styleMyElement (player['sidebarWindow'], {marginTop: sidebarMargin + 'px'});
    // Playlist position fix for youtube
    var ytPlaylist = getMyElement ('', 'div', 'id', 'player-playlist', -1, false);
    if (ytPlaylist) styleMyElement (ytPlaylist, {top: playlistMargin + 'px'});
    styleMyElement (player['playerWindow'], {width: playerWidth + 'px', height: playerHeight + 'px'});
  }
  else {
	styleMyElement (player['playerWindow'], {position: playerPosition, top: '0px', left: '0px', width: playerWidth + 'px', height: playerHeight + 'px', zIndex: playerIndex});
  }
  /* Resize The Panel */
  var panelWidth = playerWidth - player['panelPadding'] * 2;
  styleMyElement (player['playerPanel'], {width: panelWidth + 'px'});

  /* Resize The Content */
  player['contentWidth'] = playerWidth;
  if (player['panelHeight'] == 18) player['contentHeight'] = playerHeight - player['panelHeight'] - player['panelPadding'] * 2;
  else player['contentHeight'] = playerHeight - player['panelHeight'];
  styleMyElement (player['playerContent'], {width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px'});
  if (player['isPlaying']) {
    player['contentVideo'].width = player['contentWidth'];
    player['contentVideo'].height = player['contentHeight'];
    styleMyElement (player['contentVideo'], {width: player['contentWidth'] + 'px', height: player['contentHeight'] + 'px'});
  }
}

function cleanMyContent (content, unesc) {
  var myNewContent = content;
  if (!content) return myNewContent;
  if (unesc) myNewContent = unescape (myNewContent);
  myNewContent = myNewContent.replace (/\\u0025/g,'%');
  myNewContent = myNewContent.replace (/\\u0026/g,'&');
  myNewContent = myNewContent.replace (/\\/g,'');
  myNewContent = myNewContent.replace (/\n/g,'');
  return myNewContent;
}

function getMyContent (url, pattern, clean) {
  var myPageContent, myVideosParse, myVideosContent;
  var isIE = (navigator.appName.indexOf('Internet Explorer') != -1) ? true : false;
  var getMethod = (url != page.url || isIE) ? 'XHR' : 'DOM';
  if (getMethod == 'DOM') {
    myPageContent = getMyElement ('', 'html', 'tag', '', 0, true);
    if (!myPageContent) myPageContent = getMyElement ('', 'body', '', '', -1, true);
    if (clean) myPageContent = cleanMyContent (myPageContent, true);
    myVideosParse = myPageContent.match (pattern);
    myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    if (myVideosContent) return myVideosContent;
    else getMethod = 'XHR';
  }
  if (getMethod == 'XHR') {
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, false);
    xmlHTTP.send();
    if (pattern == 'XML') {
      myVideosContent = xmlHTTP.responseXML;
    }
    else if (pattern == 'TEXT') {
      myVideosContent = xmlHTTP.responseText;
    }
    else {
      myPageContent = xmlHTTP.responseText;
      if (clean) myPageContent = cleanMyContent (myPageContent, true);
      myVideosParse = myPageContent.match (pattern);
      myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    }
    return myVideosContent;
  }
}

function setMyOptions (key, value) {
  var key_extended = key + "_" + page.url.match(/https?:\/\/(www\.)?(.*?)\//)[2];
  if (typeof GM_setValue === 'function') {
    GM_setValue(key_extended, value);
  }
  else {
    try {
      localStorage.setItem(key_extended, value);
    }
    catch(e) {
      var date = new Date();
      date.setTime(date.getTime() + (356*24*60*60*1000));
      var expires = '; expires=' + date.toGMTString();
      page.doc.cookie = key_extended + '=' + value + expires + '; path=/';
    }
  }
}

function getMyOption (key) {
  var key_extended = key + "_" + page.url.match(/https?:\/\/(www\.)?(.*?)\//)[2];
  if ((typeof GM_getValue === 'function')   ){
      return GM_getValue(key_extended, null);
  }
  else
  try {
    return localStorage.setItem(key_extended);
  }
  catch(e) {
    var cookies = page.doc.cookie.split(';');
    for (var i=0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(key) == 0) {
        return cookie.substring(key.length + 1, cookie.length);
      }
    }
  }
}

function getMyOptions () {
  var tmpOption;
  tmpOption = getMyOption('viewtube_plugin');
  if (plugins.indexOf(tmpOption) == -1) tmpOption = plugins[0];
  option['plugin'] = tmpOption ? tmpOption : option['plugin'];
  option['autoplay'] = getMyOption('viewtube_autoplay');
  option['autoplay'] = (option['autoplay'] == 'true' || option['autoplay'] == true) ? true : false;
  tmpOption = getMyOption('viewtube_definition');
  option['definition'] = tmpOption ? tmpOption : option['definition'];
  tmpOption = getMyOption('viewtube_container');
  option['container'] = tmpOption ? tmpOption : option['container'];
  option['widesize'] = getMyOption('viewtube_widesize');
  option['widesize'] = (option['widesize'] == 'true' || option['widesize'] == true) ? true : false;
  option['fullsize'] = false;
}

function showMyMessage (cause, content, player) {
  var myScriptLogo = createMyElement ('div', userscript, '', '', '');
  styleMyElement (myScriptLogo, {margin: '0px auto', padding: '10px', color: '#666666', fontSize: '24px', textAlign: 'center', textShadow: '#FFFFFF -1px -1px 2px'});
  var myScriptMess = createMyElement ('div', '', '', '', '');
  styleMyElement (myScriptMess, {border: '1px solid #F4F4F4', margin: '5px auto 5px auto', padding: '10px', backgroundColor: '#FFFFFF', color: '#AD0000', textAlign: 'center'});
  if (cause == '!player') {
    var myScriptAlert = createMyElement ('div', '', '', '', '');
    styleMyElement (myScriptAlert, {position: 'absolute', top: '30%', left: '35%', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '10px', backgroundColor: '#F8F8F8', fontSize: '14px', textAlign: 'center', zIndex: '99999'});
    appendMyElement (myScriptAlert, myScriptLogo);
    var myNoPlayerMess = 'Couldn\'t get the player element. Please report it <a href="' + contact + '">here</a>.';
    modifyMyElement (myScriptMess, 'div', myNoPlayerMess, false);
    appendMyElement (myScriptAlert, myScriptMess);
    var myScriptAlertButton = createMyElement ('div', 'OK', 'click', 'close', myScriptAlert);
    styleMyElement (myScriptAlertButton, {width: '100px', border: '3px solid #EEEEEE', borderRadius: '5px', margin: '0px auto', backgroundColor: '#EEEEEE', color: '#666666', fontSize: '18px', textAlign: 'center', textShadow: '#FFFFFF -1px -1px 2px', cursor: 'pointer'});
    appendMyElement (myScriptAlert, myScriptAlertButton);
    appendMyElement (page.body, myScriptAlert);
  }
  else if (cause == '!thumb') {
    var myNoThumbMess = '<br><br>Couldn\'t get the thumbnail for this video. Please report it <a href="' + contact + '">here</a>.';
    modifyMyElement (player['playerContent'], 'div', myNoThumbMess, false);
  }
  else {
    appendMyElement (myPlayerWindow, myScriptLogo);
    if (cause == '!content') {
      var myNoContentMess = 'Couldn\'t get the videos content. Please report it <a href="' + contact + '">here</a>.';
      modifyMyElement (myScriptMess, 'div', myNoContentMess, false);
    }
    else if (cause == '!videos') {
      var myNoVideosMess = 'Couldn\'t get any video. Please report it <a href="' + contact + '">here</a>.';
      modifyMyElement (myScriptMess, 'div', myNoVideosMess, false);
    }
    else if (cause == '!support') {
      var myNoSupportMess = 'This video uses the RTMP protocol and is not supported.';
      modifyMyElement (myScriptMess, 'div', myNoSupportMess, false);
    }
    else if (cause == 'embed') {
      var myEmbedMess = 'This is an embedded video. You can watch it <a href="' + content + '">here</a>.';
      modifyMyElement (myScriptMess, 'div', myEmbedMess, false);
    }
    else if (cause == 'other') {
      modifyMyElement (myScriptMess, 'div', content, false);
    }
    appendMyElement (myPlayerWindow, myScriptMess);
  }
}

function crossXmlHttpRequest(details) { // cross-browser GM_xmlhttpRequest
  if (typeof GM_xmlhttpRequest === 'function') { // Greasemonkey, Tampermonkey, Firefox extension, Chrome script
    GM_xmlhttpRequest(details);
  }  else if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined' && 
             typeof opera.extension.postMessage !== 'undefined') { // Opera 12 extension
      opera.extension.postMessage({'action':'xhr', 'url':details.url});
      opera.extension.onmessage = function(event) {
        if (event.data.action === 'xhr-response' && event.data.error === false) {
          if (details['onload']) {
            details['onload']({responseText:event.data.response, readyState:4, status:200});
          }
        }
      }
  } else if (typeof window.opera === 'undefined' && typeof XMLHttpRequest === 'function') { // Opera 15+ extension
      var xhr=new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (details['onload'] && xhr.status >= 200 && xhr.status < 300) {
            details['onload']({responseText:xhr.responseText, readyState:xhr.readyState, status:xhr.status});
          }
        }
      }
      xhr.open(details.method, details.url, true);
      xhr.send();
  }
}

function getMyContentGM(url, pattern, clean, callback) {
  var myPageContent, myVideosParse, myVideosContent;
  var isIE = (navigator.appName.indexOf('Internet Explorer') != -1) ? true : false;
  var getMethod = (url != page.url || isIE) ? 'XHR' : 'DOM';
  if (getMethod == 'DOM') {
    myPageContent = getMyElement ('', 'html', 'tag', '', 0, true);
    if (!myPageContent) myPageContent = getMyElement ('', 'body', '', '', -1, true);
    if (clean) myPageContent = cleanMyContent (myPageContent, true);
    myVideosParse = myPageContent.match (pattern);
    myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    if (myVideosContent) callback(myVideosContent);
    else getMethod = 'XHR';
  }
  if (getMethod == 'XHR') {
    crossXmlHttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        if (pattern == 'TEXT') {
            myVideosContent = response.responseText;
        }
        else {
            myPageContent = response.responseText;
            if (clean) myPageContent = cleanMyContent (myPageContent, true);
            myVideosParse = myPageContent.match (pattern);
            myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
        }
       callback(myVideosContent);
      }
    });
  }
}


// ==========Websites========== //

// Fixes
var blockObject = page.doc;
var blockInterval = 50;

function blockVideos() {
  var elVideos = getMyElement(blockObject, 'video', 'tag', '', -1, false);
  if (elVideos.length > 0) {
    for (var v = 0; v < elVideos.length; v++) {
      var elVideo = elVideos[v];
      if (elVideo && elVideo.id != 'vtVideo' && elVideo.currentSrc) {
        if (!elVideo.paused) {
          elVideo.pause();
          if (page.url.indexOf('youtube.com/watch') == -1) elVideo.src = "#";
        }
      }
    }
  }
  var elEmbeds = getMyElement(blockObject, 'embed', 'tag', '', -1, false) || getMyElement(blockObject, 'object', 'tag', '', -1, false);
  if (elEmbeds.length > 0) {
    for (var e = 0; e < elEmbeds.length; e++) {
      var elEmbed = elEmbeds[e];
      if (elEmbed && elEmbed.id != 'vtVideo' && elEmbed.parentNode) {
        removeMyElement(elEmbed.parentNode, elEmbed);
      }
    }
  }
  if (blockObject !== page.doc) {
    var elFrames = getMyElement(blockObject, 'iframe', 'tag', '', -1, false);
    if (elFrames.length > 0) {
      for (var e = 0; e < elFrames.length; e++) {
        var elFrame = elFrames[e];
        if (elFrame && elFrame.parentNode) {
          removeMyElement(elFrame.parentNode, elFrame);
        }
      }
    }
  }
}
blockVideos();

page.win.setInterval(function() {
  // Block videos
  if (blockObject && blockInterval > 0) {
    blockVideos();
    if (blockInterval > 0) blockInterval--;
  }
}, 300);

// =====YouTube===== //
  /* Redirect Categories */
if (page.url.indexOf('gaming.youtube.com') != -1) {
  page.win.location.href = page.url.replace('gaming', 'www');
}

else if (page.url.indexOf('www.youtube.com/') != -1) {
  var decodeArray=[];
  var searchstring;
  ytPlayerResize = function () {return null;};

  function findSignatureCode(ytScriptSrc) {
    var arr=[];
    ytScriptSrc = ytScriptSrc.replace(/(\r\n|\n|\r)/gm, '');
    var functionName = ytScriptSrc.match(/"signature"\s*,\s*(.*?)\(/);
    if (functionName == null) return;
    functionName = functionName[1];
    if (functionName.indexOf('$') === 0) functionName = "\\" + functionName;
    var regCode = new RegExp('function '+functionName+'\\s*\\(\\w+\\)\\s*{\\w+=\\w+\\.split\\(""\\);(.+);return \\w+\\.join');
    var functionCode = ytScriptSrc.match('function '+functionName+'\\s*\\(\\w+\\)\\s*{\\w+=\\w+\\.split\\(""\\);(.+);return \\w+\\.join');
    if (!functionCode) functionCode = ytScriptSrc.match(functionName+'=function+\\s*\\(\\w+\\)\\s*{\\w+=\\w+\\.split\\(""\\);(.+?);return \\w+\\.join')
    if (functionCode == null) return;
    functionCode = functionCode[1];
    var functionCodePieces = functionCode.split(';');
    var decodevariable = functionCodePieces[0].match(/(\w+=)?(.*?)\./)[2];
    if (decodevariable.indexOf('$') === 0) decodevariable = "\\" + decodevariable;
    var decodefunctions = ytScriptSrc.match('var\\s+'+decodevariable+'=\\{.*?\\}\\}');
    if (decodefunctions) {
      var freverse = decodefunctions[0].match(decodevariable +'=.*(\\{|,)(.*?)\\:function.*?reverse\\(.*\\)\\}')[2];
      var fslice = decodefunctions[0].match(decodevariable +'=.*(\\{|,)(.*?)\\:function.*?sp?lice\\(.*\\)\\}')[2];
      var fswap = decodefunctions[0].match(decodevariable +'=.*(\\{|,)(.*?)\\:function.*?length];.*\\}')[2];
    } else return;
      for (var i=0; i<functionCodePieces.length; i++) {
        functionCodePieces[i]=functionCodePieces[i].trim();
        if (functionCodePieces[i].length>0)
          if (functionCodePieces[i].indexOf(fslice) >= 0) { // slice
          var slice=functionCodePieces[i].match(fslice+'\\s*\\(\\s*\\w*\\s*,(.+)\\s*\\)')[1];
          slice=parseInt(slice, 10);
          if (typeof slice === 'number') {
            arr.push(-slice);
            } else return;
        } else if (functionCodePieces[i].indexOf(freverse) >= 0) {
          arr.push(0);
        } else if (functionCodePieces[i].indexOf(fswap) >= 0) {
          var inline=functionCodePieces[i].match(fswap+'\\s*\\(\\s*\\w*\\s*,(.+)\\s*\\)')[1];
          inline=parseInt(inline, 10);
          if (typeof inline === 'number') {
            arr.push(inline);
            } else return;
        } else if (functionCodePieces[i].indexOf(',') >= 0) {
          var swap=functionCodePieces[i].match(regSwap)[1];
          swap=parseInt(swap, 10);
          if (typeof swap === 'number') {
            arr.push(swap);
          } else return;
        } else return;
      }
      return arr;
  }

  function decryptSignature(sig) {
    function swap(a,b){var c=a[0];a[0]=a[b%a.length];a[b]=c;return a};
    function decode(sig, arr) { // encoded decryption
      if (typeof sig !== 'string') return null;
      var sigA=sig.split('');
      for (var i=0;i<arr.length;i++) {
        var act=parseInt(arr[i]);
        if (typeof act !== 'number') return null;
        sigA=(act>0)?swap(sigA, act):((act==0)?sigA.reverse():sigA.slice(-act));
      }
      return sigA.join('');
    }
    if (sig==null) return '';
    if (decodeArray) {
      var sig2=decode(sig, decodeArray);
      if (sig2 && sig2.length == 81) return sig2;
    }
    return sig;
  }

  function yt_run(isMutation) {
    /* Player Size */
    var ytSidebarMarginNormal = 382;
    var ytSidebarWindow = getMyElement ('', 'div', 'id', 'watch7-sidebar', -1, false);
    if (!ytSidebarWindow) ytSidebarWindow = getMyElement ('', 'div', 'id', 'playlist', -1, false);
    if (!ytSidebarWindow) ytSidebarWindow = getMyElement ('', 'div', 'id', 'related', -1, false);
    if (ytSidebarWindow) var ytSidebarWindowStyle = ytSidebarWindow.currentStyle || window.getComputedStyle(ytSidebarWindow);
    if (ytSidebarWindowStyle) {
      ytSidebarMarginNormal = parseInt(ytSidebarWindowStyle.marginTop.replace('px', ''));
      styleMyElement (ytSidebarWindow, {marginTop: ytSidebarMarginNormal + 'px'});
    }
    var ytPlayerWidth, ytPlayerHeight;
    var ytPlayerWideWidth, ytPlayerWideHeight;
    var ytSidebarMarginWide;
    var ytScreenWidth, ytScreenHeight;

    function ytSizes() {
      ytScreenWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
      ytScreenHeight = page.win.innerHeight || page.doc.documentElement.clientHeight;
      if (ytScreenWidth >= 1720 && ytScreenHeight >= 980) {
        ytPlayerWidth = 1280;
        ytPlayerHeight = 742;
        ytPlayerWideWidth = 1706;
        ytPlayerWideHeight = 982;
      }
      else if (ytScreenWidth >= 1294 && ytScreenHeight >= 630) {
        ytPlayerWidth = 854;
        ytPlayerHeight = 502;
        ytPlayerWideWidth = 1280;
        ytPlayerWideHeight = 742;
      }
      else {
        ytPlayerWidth = 640;
        ytPlayerHeight = 382;
        ytPlayerWideWidth = 1066;
        ytPlayerWideHeight = 622;
      }
      if (ytSidebarMarginNormal == 0) ytSidebarMarginWide = ytPlayerWideHeight + 18;
      else ytSidebarMarginWide = ytPlayerHeight + ytSidebarMarginNormal - 12 ;
    }

    page = {win: window, doc: document, body: document.body, url: window.location.href}
    /* Get Player Window */
    var ytPlayerBgColor = '#FFFFFF';
    var ytPlayerWindow = getMyElement ('', 'div', 'id', 'player', -1, false);
    if (!ytPlayerWindow) {
      ytPlayerWindow = getMyElement ('', 'div', 'id', 'p', -1, false);
      ytPlayerBgColor = 'inherit';
      feature['widesize'] = false;     }
    if (!ytPlayerWindow) {
      showMyMessage ('!player');
    }
    else {
     blockObject = ytPlayerWindow;
     blockInterval = 30;

     var ytVideoID = null;
     var ytVideosContent = null;
     var ytVideosEncodedFmts = null;
     var ytVideosAdaptiveFmts = null;
     var ytVideosDashmpd, ytHLSVideos;
      /* Clean Player Window */
     var ytWatchPlayer = getMyElement ('', 'div', 'id', 'player-api', -1, false);
     if (ytWatchPlayer) styleMyElement (ytWatchPlayer, {display: 'none'});
      // Stop playlist Autoplay
     var ytNavControl = getMyElement ('', 'div', 'class', 'playlist-nav-controls', 0, false);
     if (ytNavControl) {
       injectScript ('var NextVidEnabled = true;ytspf.enabled = false;ytspf.config["navigate-limit"] = 0;_spf_state.config["navigate-limit"] = 0;var NextVidStopperGetNextValues = function () {var nextLink = document.getElementsByClassName("playlist-behavior-controls")[0].getElementsByTagName("a")[1].href;var nextLinkStart = nextLink.search("v=");var nextLinkEnd = nextLink.search("&");return nextLink.substring(nextLinkStart + 2, nextLinkEnd);};for (var key in _yt_www) {var stringFunction = "" + _yt_www[key];if (stringFunction.search("window.spf.navigate") != -1) {_yt_www[key] = function (a, b) {if (a.search(NextVidStopperGetNextValues()) == -1 || NextVidEnabled == false) {window.location = a;}};}}');
     }

     /* Get Video ID and Thumbnail */
     ytVideoID = page.url.match (/(\?|&)v=(.*?)(&|$)/);
     ytVideoID = (ytVideoID) ? ytVideoID[2] : null;

     var ytVideoThumb = getMyContent (page.url, 'link\\s+itemprop="thumbnailUrl"\\s+href="(.*?)"', false);
     if (!ytVideoThumb) ytVideoThumb = getMyContent (page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);
     if (!ytVideoThumb) {
       if (ytVideoID) ytVideoThumb = page.win.location.protocol + '//img.youtube.com/vi/' + ytVideoID + '/0.jpg';
     }
     getMyContentGM(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"sts"\\s*:\\s*(\\d+)', false, function(ytVideoSts) {
     var ytVideosInfoURL = page.win.location.protocol + '//' + page.win.location.hostname + '/get_video_info?video_id=' + ytVideoID + '&eurl=https://youtube.googleapis.com/v/' + ytVideoID + '&sts=' + ytVideoSts;
    
     getMyContentGM(ytVideosInfoURL, 'TEXT', false, function(ytVideosInfo) {

      /* Get Video Title */
      var ytVideoTitle = getMyContent (page.url, 'meta\\s+itemprop="name"\\s+content="(.*?)"', false);
      if (!ytVideoTitle) ytVideoTitle = getMyContent (page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
      if (!ytVideoTitle) ytVideoTitle = page.doc.title;
      if (ytVideoTitle) {
        ytVideoTitle = ytVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
        ytVideoTitle = ytVideoTitle.replace(/&#39;/g, '\'').replace(/'|’/g, '\'');
        ytVideoTitle = ytVideoTitle.replace(/&amp;/g, '&');
        ytVideoTitle = ytVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
        ytVideoTitle = ytVideoTitle.replace(/^YouTube\s-\s/, '').replace(/\s-\sYouTube$/, '');
      }
      var ytVideoDuration = getMyContent (page.url, 'meta\\s+itemprop="duration"\\s+content="(.*?)"', false);
      if (ytVideoDuration) {
        ytVideoDuration = parseInt(ytVideoDuration.match(/\d{1,3}M/) ? ytVideoDuration.match(/(\d{1,3})M/)[1] :0) * 60 + parseInt(ytVideoDuration.match(/\d{1,2}S/) ? ytVideoDuration.match(/(\d{1,2})S/)[1] :0);
      }
      var ytVideoUnavailable = getMyElement ('', 'div', 'id', 'player-unavailable', -1, false);
      if (ytVideoUnavailable && ytVideoUnavailable.className.indexOf('hid') == -1) styleMyElement (ytVideoUnavailable, {display: 'inline'});
      myPlayerWindow = getMyElement ('', 'div', 'id', 'MyytWindow', -1, false);
      if (myPlayerWindow) removeMyElement(myPlayerWindow.parentNode,myPlayerWindow);

      /* Get Videos Content */
      var ytScriptURL;
      if (!ytVideoUnavailable || (ytVideoUnavailable.className.indexOf('hid') != -1 || getMyElement ('', 'div', 'id', 'watch7-player-age-gate-content', -1, false))) {
        if (isMutation) {
          var injectedElement = document.getElementById('download-youtube-video-debug-info9');
          if (injectedElement==null) {
            injectedElement = createHiddenElem('pre', 'download-youtube-video-debug-info9');
          }
            injectScript ('if (typeof ytplayer.config == "object" && ytplayer.config != null) document.getElementById("download-youtube-video-debug-info9").appendChild(document.createTextNode(\'"video_id":"\'+ytplayer.config.args.video_id+\'", "js":"\'+ytplayer.config.assets.js+\'", "adaptive_fmts":"\'+ytplayer.config.args.adaptive_fmts+\'", "dashmpd":"\'+ytplayer.config.args.dashmpd+\'", "url_encoded_fmt_stream_map":"\'+ytplayer.config.args.url_encoded_fmt_stream_map+\'"\'));');            
          var code = getMyElement('','pre','id','download-youtube-video-debug-info9',-1,false).innerHTML;
          if (code) {
            if (ytVideoID == code.match(/\"video_id\":\s*\"([^\"]+)\"/)[1]) {
              ytVideosEncodedFmts=code.match(/\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/)[1].replace(/&amp;/g,'\\u0026');
              if (ytVideosEncodedFmts == 'undefined') ytVideosEncodedFmts = null;
              if (ytVideosEncodedFmts) ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, false);
              ytVideosAdaptiveFmts=code.match(/\"adaptive_fmts\":\s*\"([^\"]+)\"/)[1].replace(/&amp;/g,'\\u0026');
              if (ytVideosAdaptiveFmts == 'undefined') ytVideosAdaptiveFmts = null;
              if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, false);
              ytVideosDashmpd=code.match(/\"dashmpd\":\s*\"([^\"]+)\"/)[1].replace(/&amp;/g,'\\u0026');
              ytScriptURL=code.match(/\"js\":\s*\"([^\"]+)\"/)[1];
              if (!ytScriptURL) ytScriptURL = getMyContent(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"js":\\s*"(.*?)"', true);
            }
            removeMyElement(injectedElement.parentNode, injectedElement);
          }
        }
        else if (!ytVideosEncodedFmts && !ytVideosAdaptiveFmts) {
          ytVideosEncodedFmts = getMyContent(page.url, '"url_encoded_fmt_stream_map":\\s*"(.*?)"', false);
          if (ytVideosEncodedFmts) ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, false);
          ytVideosAdaptiveFmts = getMyContent(page.url, '"adaptive_fmts":\\s*"(.*?)"', false);
          if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, false);
          if (!ytVideosEncodedFmts && !ytVideosAdaptiveFmts) {
            if (ytVideosInfo) {
              ytVideosEncodedFmts = ytVideosInfo.match(/url_encoded_fmt_stream_map=(.*?)&/);
              ytVideosEncodedFmts = (ytVideosEncodedFmts) ? ytVideosEncodedFmts[1] : null;
              if (ytVideosEncodedFmts) {
                ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, true);
                ytVideosContent = ytVideosEncodedFmts;
              }
              if (!ytVideosAdaptiveFmts) {
                ytVideosAdaptiveFmts = ytVideosInfo.match(/adaptive_fmts=(.*?)&/);
                ytVideosAdaptiveFmts = (ytVideosAdaptiveFmts) ? ytVideosAdaptiveFmts[1] : null;
                if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, true);
              }
            }
          }
        }
        if ((ytVideosEncodedFmts || ytVideosAdaptiveFmts) && (ytVideoUnavailable)) styleMyElement (ytVideoUnavailable, {display: 'none'});
      }

      if (ytVideosEncodedFmts) {
        ytVideosContent = ytVideosEncodedFmts;
      }
      if (ytVideosAdaptiveFmts) {
        if (ytVideosContent) ytVideosContent += ',' + ytVideosAdaptiveFmts;
        else ytVideosContent = ytVideosAdaptiveFmts;
      }

      /* Get DASH Content */
      ytVideosDashmpd = ytVideosInfo.match(/dashmpd=(.*?)&/);
      ytVideosDashmpd = (ytVideosDashmpd) ? ytVideosDashmpd[1] : null;
      if (ytVideosDashmpd) ytVideosDashmpd = cleanMyContent(ytVideosDashmpd, true);

      /* Get HLS Content */
      if (!ytVideosContent) {
        ytHLSVideos = getMyContent(page.url, '"hlsvp":\\s*"(.*?)"', false);
        if (ytHLSVideos) ytHLSVideos = cleanMyContent(ytHLSVideos, false);
        else if (ytVideosInfo) {
          ytHLSVideos = ytVideosInfo.match(/hlsvp=(.*?)&/);
          ytHLSVideos = (ytHLSVideos) ? ytHLSVideos[1] : null;
          if (ytHLSVideos) ytHLSVideos = cleanMyContent(ytHLSVideos, true);
        }
      }
      function getYoutubeVideos(ytVideosContent, yturl) {
        if (yturl != page.url) return;

        /* Parse HLS */
        function ytHLS(ytHLSVideos) {
          var ytHLSFormats = {
            '92': 'Very Low Definition MP4',
            '93': 'Low Definition MP4',
            '94': 'Standard Definition MP4',
            '95': 'High Definition MP4'
          };
          ytVideoList["HLS Any Definition MP4"] = ytHLSVideos;
          if (ytHLSContent) {
            var ytHLSMatcher = new RegExp('(http.*?m3u8)', 'g');
            ytHLSVideos = ytHLSContent.match(ytHLSMatcher);
            var ytHLSVideo, ytVideoCodeParse, ytVideoCode, myVideoCode;
            if (ytHLSVideos) {
              for (var i = 0; i < ytHLSVideos.length; i++) {
                ytHLSVideo = ytHLSVideos[i];
                ytVideoCodeParse = ytHLSVideo.match(/\/itag\/(\d{1,3})\//);
                ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
                if (ytVideoCode) {
                  myVideoCode = ytHLSFormats[ytVideoCode];
                  if (myVideoCode && ytHLSVideo) {
                    ytVideoList[myVideoCode] = ytHLSVideo;
                  }
                }
              }
            }
          }
          ytVideoTitle = null;
          ytPlayer (yturl);
        }

        function ytPlayer (yturl) {
          if (yturl != page.url) return;
          window.removeEventListener('resize', ytPlayerResize, false);

          /* Create Player */
          var ytDefaultVideo = 'Low Definition MP4';
          var player = {
            'playerSocket': ytPlayerWindow,
            'playerWindow': myPlayerWindow,
            'videoList': ytVideoList,
            'videoPlay': ytDefaultVideo,
            'videoThumb': ytVideoThumb,
            'videoDuration': ytVideoDuration,
            'playerWidth': ytPlayerWidth,
            'playerHeight': ytPlayerHeight,
            'playerWideWidth': ytPlayerWideWidth,
            'playerWideHeight': ytPlayerWideHeight,
            'sidebarWindow': ytSidebarWindow,
            'sidebarMarginNormal': ytSidebarMarginNormal,
            'sidebarMarginWide': ytSidebarMarginWide
          };

          ytPlayerResize = function () {
            ytSizes();
            var ytWatchAppBar = getMyElement ('', 'div', 'id', 'watch-appbar-playlist', -1, false);
            if (!ytWatchAppBar) ytWatchAppBar = getMyElement ('', 'div', 'id', 'playlist', -1, false);
            if (ytWatchAppBar) styleMyElement (ytWatchAppBar, {height: + ytPlayerHeight + 'px'});
            player['playerWidth'] = ytPlayerWidth;
            player['playerHeight'] = ytPlayerHeight;
            player['playerWideWidth'] = ytPlayerWideWidth;
            player['playerWideHeight'] = ytPlayerWideHeight;
            player['sidebarMarginWide'] = ytSidebarMarginWide;
            resizeMyPlayer(player, 'widesize');
          }

          option['definitions'] = ['Ultra High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
          option['containers'] = ['MP4', 'WebM', 'FLV', '3GP', 'Any'];
          HeadWindow = getMyElement('', 'div', 'id', 'masthead-positioner', -1, false);
          createMyPlayer (player);

          /* Update Sizes */
          window.addEventListener('resize', ytPlayerResize,false);
        }

        /* Get Sizes */
        ytSizes();

        /* Hide Player Window */
        var ytPlaceholderPlayer = getMyElement ('', 'div', 'id', 'placeholder-player', -1, false);
        if (ytPlaceholderPlayer) styleMyElement (ytPlaceholderPlayer, {display: 'none'});
        var ytPlayerContainer = getMyElement ('', 'div', 'id', 'player-container', -1, false);
        if (ytPlayerContainer) styleMyElement (ytPlayerContainer, {display: 'none'});

        /* Hide Sidebar Ads */
        var ytSidebarAds = getMyElement ('', 'div', 'id', 'watch7-sidebar-ads', -1, false);
        if (ytSidebarAds) styleMyElement (ytSidebarAds, {display: 'none'});

        /* Playlist */
        var ytWatchAppBar = getMyElement ('', 'div', 'id', 'watch-appbar-playlist', -1, false);
        if (!ytWatchAppBar) ytWatchAppBar = getMyElement ('', 'div', 'id', 'playlist', -1, false);
        if (ytWatchAppBar) styleMyElement (ytWatchAppBar, {height: + ytPlayerHeight + 'px'});

        /* My Player Window */
        myPlayerWindow = createMyElement ('div', '', '', '', '');
        myPlayerWindow.id = 'MyytWindow';
        styleMyElement (ytPlayerWindow, {top: '0px'});
        styleMyElement (myPlayerWindow, {position: 'relative', width: ytPlayerWidth + 'px', height: ytPlayerHeight +'px', backgroundColor: ytPlayerBgColor, zIndex: '99999'});
        appendMyElement (ytPlayerWindow, myPlayerWindow);

        /* Get Videos */
        var ytVideoUnavailable = getMyElement ('', 'div', 'id', 'player-unavailable', -1, false);
        var ytVideoList = {};
        if (ytVideosContent) {
          var ytVideoFound = false;
          var veVideoFound = false;
          var ytVideoFormats = {
              '5': 'Very Low Definition FLV',
              '17': 'Very Low Definition 3GP',
              '18': 'Low Definition MP4',
              '22': 'High Definition MP4',
              '34': 'Low Definition FLV',
              '35': 'Standard Definition FLV',
              '36': 'Low Definition 3GP',
              '37': 'Full High Definition MP4',
              '38': 'Ultra High Definition MP4',
              '43': 'Low Definition WebM',
              '44': 'Standard Definition WebM',
              '45': 'High Definition WebM',
              '46': 'Full High Definition WebM',
              '82': 'Low Definition 3D MP4',
              '83': 'Standard Definition 3D MP4',
              '84': 'High Definition 3D MP4',
              '85': 'Full High Definition 3D MP4',
              '100': 'Low Definition 3D WebM',
              '101': 'Standard Definition 3D WebM',
              '102': 'High Definition 3D WebM',
              '135': 'Standard Definition Video MP4',
              '136': 'High Definition Video MP4',
              '137': 'Full High Definition Video MP4',
              '138': 'Ultra High Definition Video MP4',
              '139': 'Low Bitrate Audio MP4',
              '140': 'Medium Bitrate Audio MP4',
              '141': 'High Bitrate Audio MP4',
              '171': 'Medium Bitrate Audio WebM',
              '172': 'High Bitrate Audio WebM',
              '244': 'Standard Definition Video WebM',
              '247': 'High Definition Video WebM',
              '248': 'Full High Definition Video WebM',
              '249': 'Low Bitrate Audio Opus',
              '250': 'Medium Bitrate Audio Opus',
              '251': 'High Bitrate Audio Opus',
              '266': 'Ultra High Definition Video MP4',
              '272': 'Ultra High Definition Video WebM',
              '298': 'High Definition Video MP4',
              '299': 'Full High Definition Video MP4',
              '302': 'High Definition Video WebM',
              '303': 'Full High Definition Video WebM',
              '313': 'Ultra High Definition Video WebM'
            };
            var ytVideos = ytVideosContent.split(',');
            var ytVideoParse, ytVideoCodeParse, ytVideoCode, myVideoCode, ytVideo;
            for (var i = 0; i < ytVideos.length; i++) {
              if (!ytVideos[i].match(/^url/)) {
                ytVideoParse = ytVideos[i].match(/(.*)(url=.*$)/);
                if (ytVideoParse) ytVideos[i] = ytVideoParse[2] + '&' + ytVideoParse[1];
              }
              ytVideoCodeParse = ytVideos[i].match (/itag=(\d{1,3})/);
              ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
              if (ytVideoCode) {
                myVideoCode = ytVideoFormats[ytVideoCode];
                if (myVideoCode) {
                  ytVideo = cleanMyContent(ytVideos[i], true);
                  ytVideo = ytVideo.replace (/url=/, '').replace(/&$/, '');
                  if (ytVideo.match(/itag=/) && ytVideo.match(/itag=/g).length > 1) {
                    if (ytVideo.match(/itag=\d{1,3}&/)) ytVideo = ytVideo.replace(/itag=\d{1,3}&/, '');
                    else if (ytVideo.match(/&itag=\d{1,3}/)) ytVideo = ytVideo.replace(/&itag=\d{1,3}/, '');
                  }
                  if (ytVideo.match(/clen=/) && ytVideo.match(/clen=/g).length > 1) {
                    if (ytVideo.match(/clen=\d+&/)) ytVideo = ytVideo.replace(/clen=\d+&/, '');
                    else if (ytVideo.match(/&clen=\d+/)) ytVideo = ytVideo.replace(/&clen=\d+/, '');
                  }
                  if (ytVideo.match(/lmt=/) && ytVideo.match(/lmt=/g).length > 1) {
                    if (ytVideo.match(/lmt=\d+&/)) ytVideo = ytVideo.replace(/lmt=\d+&/, '');
                    else if (ytVideo.match(/&lmt=\d+/)) ytVideo = ytVideo.replace(/&lmt=\d+/, '');
                  }
                  if (ytVideo.match(/type=(video|audio).*?&/)) ytVideo = ytVideo.replace(/type=(video|audio).*?&/, '');
                  else ytVideo = ytVideo.replace(/&type=(video|audio).*$/, '');
                  if (ytVideo.match(/&xtags=/)) ytVideo = ytVideo.replace(/&xtags=/, '');
                  if (ytVideo.match(/&sig=/)) ytVideo = ytVideo.replace (/&sig=/, '&signature=');
                  else if (ytVideo.match(/&s=/)) {
                    var ytSig = ytVideo.match(/&s=(.*?)(&|$)/);
                    if (ytSig) {
                      var s = decryptSignature(ytSig[1]);
                      ytVideo = ytVideo.replace(/&s=.*?(&|$)/, '&signature=' + s + '$1');
                    }
                    else ytVideo = '';
                  }
                  ytVideo = cleanMyContent (ytVideo, true);
                  if (ytVideo.indexOf('ratebypass') == -1) ytVideo += '&ratebypass=yes';
                  if (ytVideo && ytVideo.indexOf('http') == 0) {
                    if (!ytVideoFound) ytVideoFound = true;
                    ytVideoList[myVideoCode] = ytVideo;
                  }
                }
              }
            }
            if (ytVideosDashmpd) {
              if (ytVideosDashmpd.match(/\/signature\//)) ytVideoList['DASH MP4'] = ytVideosDashmpd;
              else if (ytVideosDashmpd.match(/\/s\//)) {
                var ytSig = ytVideosDashmpd.match(/\/s\/(.*?)\//);
                if (ytSig) {
                  var s = decryptSignature(ytSig[1]);
                  ytVideoList['DASH MP4'] = ytVideosDashmpd.replace(/\/s\/.*?(\/.*$)/, '\/signature\/' + s + '$1');
                }
              }
            }
            if (ytHLSVideos) {
                ytVideoList["HLS Any Definition MP4"] = ytHLSVideos;
                if (!ytVideoFound) ytVideoFound = true;
            }
            if (ytVideoFound) {
              ytPlayer(yturl);
            }
            else {
              if (ytVideosContent.indexOf('conn=rtmp') != -1) showMyMessage ('!support');
              else showMyMessage ('!videos');
            } /* End Create Player */
        }
        else {
          if (ytVideosDashmpd) {
            if (ytVideosDashmpd.match(/\/signature\//)) ytVideoList['DASH MP4'] = ytVideosDashmpd;
            else if (ytVideosDashmpd.match(/\/s\//)) {
              var ytSig = ytVideosDashmpd.match(/\/s\/(.*?)\//);
              if (ytSig) {
                var s = decryptSignature(ytSig[1]);
                ytVideoList['DASH MP4'] = ytVideosDashmpd.replace(/\/s\/.*?(\/.*$)/, '\/signature\/' + s + '$1');
              }
            }
          }
          if (ytHLSVideos) {
            var ytHLSContent = getMyContent(ytHLSVideos, 'TEXT', false);
            ytHLS(ytHLSVideos);
          }
          else {
            if (ytVideoUnavailable && ytVideoUnavailable.className.indexOf('hid') == -1) removeMyElement(ytPlayerWindow, myPlayerWindow)
            else showMyMessage ('!content');
          }
        }
      }
      /* Get Script URL */
      if (!ytScriptURL) ytScriptURL = getMyContent(page.url, '"js":\\s*"(.*?)"', true);
      if (!ytScriptURL) ytScriptURL = getMyContent(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"js":\\s*"(.*?)"', true);
      ytScriptURL = page.win.location.protocol + '//' + page.win.location.hostname + ytScriptURL;
      var DECODEARRDAT = 'decodeArrayData';
      decodeArray = getMyOption(DECODEARRDAT);
      if (decodeArray) decodeArray = decodeArray.split(',');
      if (ytScriptURL && ytVideosContent && ytVideosContent.match(/&s=/) && (!decodeArray || decodeArray.length==0)) {
        try {
          crossXmlHttpRequest({
            method:'GET',
            url:ytScriptURL,
            onload:function(response) {
              if (response.readyState === 4 && response.status === 200 && response.responseText) {
                decodeArray = findSignatureCode(response.responseText);
                setMyOptions(DECODEARRDAT, decodeArray.toString());
                getYoutubeVideos(ytVideosContent, page.url);
              }
              else {
                showMyMessage('other', 'Couldn\'t get the signature content. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.');
              }
            },
            onerror: function() {
              showMyMessage('other', 'Couldn\'t make the request. Make sure your browser user scripts extension supports cross-domain requests.');
            }
          });
        } catch(e) { }
      } else {
        getYoutubeVideos(ytVideosContent, page.url);
        try {
          crossXmlHttpRequest({
            method:'GET',
            url:ytScriptURL,
            onload:function(response) {
              if (response.readyState === 4 && response.status === 200 && response.responseText) {
                var retArray = findSignatureCode(response.responseText);
                if (retArray && (retArray.toString() != decodeArray.toString()) && ytVideosContent.match(/&s=/)) {
                  decodeArray = retArray;
                  setMyOptions(DECODEARRDAT, decodeArray.toString());
                  myPlayerWindow = getMyElement ('', 'div', 'id', 'MyytWindow', -1, false);
                  if (myPlayerWindow) removeMyElement(myPlayerWindow.parentNode,myPlayerWindow);
                  getYoutubeVideos(ytVideosContent, page.url);
                }
              }
            }
          });
        } catch(e) { }
      }
     });
     });
    }
  }

  function onNodeInserted(e) {
    if (page.url != window.location.href) {
      myPlayerWindow = getMyElement ('', 'div', 'id', 'MyytWindow', -1, false);
      if (myPlayerWindow) removeMyElement(myPlayerWindow.parentNode,myPlayerWindow);
    }
    if (e && e.target && e.target.id=='watch7-main-container') {
      setTimeout(function() { yt_run("NodeInserted"); }, 0);
    }
  }
  if (page.url.indexOf('youtube.com/watch\?v=') != -1) yt_run();
  var content=document.getElementById('content');
  if (content) {
      var mo=window.MutationObserver||window.MozMutationObserver||window.WebKitMutationObserver;
      if(typeof mo!=='undefined') {
        var observer=new mo(function(mutations) {
          mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id=='watch7-main-container') {
//                    if (mutation.addedNodes[i].id=='page') {
                      yt_run("Mutation");
                      break;
                    }
                }
              }
          });
          if (page.url != window.location.href) {
            myPlayerWindow = getMyElement ('', 'div', 'id', 'MyytWindow', -1, false);
            if (myPlayerWindow) removeMyElement(myPlayerWindow.parentNode,myPlayerWindow);
          }
        });
        observer.observe(content, {childList: true, subtree: true});
      } else  { // MutationObserver fallback for old browsers
        if (document.implementation.hasFeature('MutationEvents','2.0')) {
          pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
        } else {
          page.win.setInterval(function() {
            nurl = window.location.href;
            if (page.url != nurl) window.location.href = nurl;
          }, 500)
        }
     }
  }
}

// =====DailyMotion===== //
else if (page.url.indexOf('dailymotion.com/video') != -1) {

  /* Get Player Window */
  var dmPlayerWindow = getMyElement ('', 'div', 'class', 'player-container', 0, false);
  if (!dmPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video Thumbnail */
    var dmVideoThumb = getMyContent (page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);
    var dmVideoDuration = getMyContent (page.url, 'meta\\s+property="video:duration"\\s+content="(.*?)"', false);
    if (dmVideoDuration) dmVideoDuration = parseInt(dmVideoDuration);

    /* Get Videos Content */
    var dmVideosContent = getMyContent(page.url, '"qualities":\\{(.*?)\\]\\},', false);
    if (!dmVideosContent) dmVideosContent = getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"qualities":\\{(.*?)\\]\\},', false);

    /* Player Size */
    var dmSidebarWidth = 320;
    var dmSidebarWindow = getMyElement ('', 'div', 'class', 'sidebar', 0, false);
    var dmSidebarWindowStyle = (dmSidebarWindow) ? dmSidebarWindow.currentStyle || window.getComputedStyle(dmSidebarWindow) : null;
    var dmPlayerWidth, dmPlayerHeight;
    var dmPlayerWideWidth, dmPlayerWideHeight;
    var dmSidebarMarginWide;
    function dmGetSizes() {
      dmPlayerWidth = dmPlayerWindow.clientWidth;
      dmPlayerHeight = Math.ceil(dmPlayerWidth / (16 / 9)) + 22;
      if (dmSidebarWindow && dmSidebarWindowStyle) dmSidebarWidth = parseInt(dmSidebarWindowStyle.width);
      dmPlayerWideWidth = dmPlayerWidth + dmSidebarWidth;
      dmPlayerWideHeight = Math.ceil(dmPlayerWideWidth / (16 / 9)) + 22;
      dmSidebarMarginWide = dmPlayerWideHeight + 30
    }
    function dmUpdateSizes() {
      setTimeout(function() {
        dmGetSizes();
        player['playerWidth'] = dmPlayerWidth;
        player['playerHeight'] = dmPlayerHeight;
        player['playerWideWidth'] = dmPlayerWideWidth;
        player['playerWideHeight'] = dmPlayerWideHeight;
        player['sidebarMarginWide'] = dmSidebarMarginWide;
        resizeMyPlayer(player, 'widesize');
        styleMyElement (dmPlayerWindow, {overflow: 'visible', height: '100%'});
      },350);
    }
    dmGetSizes();

    /* My Player Window */
    var myPlayerWindow = createMyElement ('div', '', '', '', '');
    styleMyElement (myPlayerWindow, {position: 'relative',width: dmPlayerWidth + 'px', height: dmPlayerHeight + 'px', backgroundColor: '#F4F4F4', zIndex: '99999'});
    modifyMyElement (dmPlayerWindow, 'div', '', false, true);
    appendMyElement (dmPlayerWindow, myPlayerWindow);
    blockObject = dmPlayerWindow;

    /* Fix Visibility & Height */
    var dmPlayerJSBox = getMyElement ('', 'div', 'class', 'js-player-box', 0, false);
    if (dmPlayerJSBox) styleMyElement(dmPlayerJSBox, {overflow: 'visible', height: '100%', backgroundColor: '#F4F4F4'});
    else styleMyElement(dmPlayerWindow.parentNode, {overflow: 'visible', height: '100%', backgroundColor: '#F4F4F4'});
    page.win.setTimeout(function() {styleMyElement (dmPlayerWindow, {overflow: 'visible', height: '100%'});}, 2000);

    /* Fix Right Ad Issue */
    var dmMcRight = getMyElement ('', 'div', 'id', 'mc_Right', -1, false);
    if (dmMcRight) {
      var dmWaitForAdTime = 20;
      var dmPlayerWidthPrev = dmPlayerWidth;
      var dmWaitForAdFunc = page.win.setInterval(function() {
      if(dmMcRight.clientWidth) {
        dmUpdateSizes();
        if (dmPlayerWidth != dmPlayerWidthPrev) clearInterval(dmWaitForAdFunc);
      }
      dmWaitForAdTime--;
      if (dmWaitForAdTime == 0) clearInterval(dmWaitForAdFunc);
      }, 250);
    }

    /* Resize Event */
    page.win.addEventListener('resize', dmUpdateSizes, false);

    /* Hide Top Ads */
    var dmMcTop = getMyElement ('', 'div', 'id', 'mc_Top', -1, false);
    if (dmMcTop) styleMyElement(dmMcTop, {display: 'none'});

    /* Get Videos */
    if (dmVideosContent) {
      var dmVideoFormats = {'auto': 'Low Definition MP4', '240': 'Very Low Definition MP4', '380': 'Low Definition MP4', '480': 'Standard Definition MP4', '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
      var dmVideoList = {};
      var dmVideoFound = false;
      var dmVideoParser, dmVideoParse, myVideoCode, dmVideo;
      for (var dmVideoCode in dmVideoFormats) {
        dmVideoParser = '"' + dmVideoCode + '".*?"url":"(.*?)"';
        dmVideoParse = dmVideosContent.match (dmVideoParser);
        if (!dmVideoParse) {
          dmVideoParser = '"' + dmVideoCode + '".*?"type":"application.*?mpegURL","url":"(.*?)"';
          dmVideoParse = dmVideosContent.match(dmVideoParser);
        }
        dmVideo = (dmVideoParse) ? dmVideoParse[1] : null;
        if (dmVideo) {
          if (!dmVideoFound) dmVideoFound = true;
          dmVideo = cleanMyContent(dmVideo, true);
          myVideoCode = dmVideoFormats[dmVideoCode];
          if (!dmVideoList[myVideoCode]) dmVideoList[myVideoCode] = dmVideo;
        }
      }

      if (dmVideoFound) {

        /* Create Player */
        var dmDefaultVideo = 'Low Definition MP4';
        var player = {
          'playerSocket': dmPlayerWindow,
          'playerWindow': myPlayerWindow,
          'videoList': dmVideoList,
          'videoPlay': dmDefaultVideo,
          'videoThumb': dmVideoThumb,
          'videoDuration': dmVideoDuration,
          'playerWidth': dmPlayerWidth,
          'playerHeight': dmPlayerHeight,
          'playerWideWidth': dmPlayerWideWidth,
          'playerWideHeight': dmPlayerWideHeight,
          'sidebarWindow': dmSidebarWindow,
          'sidebarMarginNormal': 0,
          'sidebarMarginWide': dmSidebarMarginWide
        };
        feature['container'] = false;
        option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
        option['containers'] = ['MP4'];
        createMyPlayer (player);

        /* Fix HTML5 video duplicate on click - by seezuoto */
        page.body.addEventListener('click', function(e) {
          if (e.target.id === 'vtVideo' || (e.target.tagName === 'DIV' && !e.target.innerHTML.match(/^\s*more\s*$/))) {
            e.stopPropagation();
          }
        });

        /* Fix panel */
        styleMyElement(player['playerContent'], {marginTop: '7px'});

        /* Fix Info Position On Widesize */
        player['buttonWidesize'].addEventListener('click', function() {
          styleMyElement (dmPlayerWindow.parentNode, {minHeight: player['contentHeight'] + 50 + 'px'});
        }, false);
      } else {
        showMyMessage ('!videos');
      }
    } else {
      showMyMessage ('!content');
    }
  }
}

// =====Vimeo===== //
else if (page.url.match(/https?:\/\/(www\.)?vimeo.com\//)) {

  function vimeo_run(viPlayerId) {
    if (viPlayerId && page.url == window.location.href) return;
    page = {win: window, doc: document, body: document.body, url: window.location.href};

    var PlayerHeight, PlayerWidth, viVideo, myVideoCode;
    var viVideoID = null;
    var viVideoSignature = null;
    var viVideoTimestamp = null;
    var viPlayerWindow = null;
    var viVideoRegex;
    var viVideoFormats = {'HLS': 'HTTP Live Streaming','1080p': 'Full High Definition MP4','720p': 'High Definition MP4', '540p': 'Standard Definition MP4', '480p': 'Standard Definition MP4', '360p': 'Low Definition MP4', '270p': 'Very Low Definition MP4'};
    /* Video Type */
    var viVideoPage = page.url.match(/vimeo.com\/\d+/) ? true : false;
    /* Get Player Window */
    for (i=0; i<getMyElement ('', 'div', 'class', 'player_container', -1, false).length; i++) {
      var viPlayerWindow = getMyElement ('', 'div', 'class', 'player_container', i, false);
      styleMyElement (viPlayerWindow.parentNode, {height: '100%', transformStyle: 'flat', transform: 'none'});
//      if (page.body.innerHTML.match(/open\("GET","(https?\:\/\/player.*?)"/)) PlayerHeight = viPlayerWindow.clientHeight;
//      else PlayerHeight = viPlayerWindow.clientHeight;
//      else PlayerHeight = viPlayerWindow.clientHeight + 22;
      PlayerHeight = viPlayerWindow.clientHeight;
      PlayerWidth = viPlayerWindow.clientWidth;
      var viScreenWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
      var viPlayerLeft = Math.floor((viScreenWidth - PlayerWidth) / 2);
      if (!viPlayerWindow) {
        showMyMessage ('!player');
      } else {
        /* Get Videos Content */
        viVideoRegex = 'data-fallback-url=".*?(\\d{6,10})\\/.*?"';
        viVideoID = page.body.innerHTML.match(RegExp(viVideoRegex,'g'))[i];
        if (viVideoID) viVideoID = viVideoID.match(RegExp(viVideoRegex))[1];
        viVideoURL = page.win.location.protocol + "//vimeo.com/" + viVideoID;
        getMyContentGM(viVideoURL,'TEXT',false, function (res1) {
//          var viVideoSource = res1.match(/open\("GET","(https?\:\/\/player.*?)"/);
//          if (viVideoSource) viVideoSource = viVideoSource[1];
//          else viVideoSource = res1.match('{"config_url":"(.*?)"')[1].replace (/\\u0025/g,'%').replace (/\\u0026/g,'&').replace (/\\/g,'');
//          else viVideoSource = res1.match('data-config-url="(.*?)"')[1].replace(/&amp;/g, '&');
          var viVideoSource = res1.match('{"config_url":"(.*?)"')[1].replace (/\\u0025/g,'%').replace (/\\u0026/g,'&').replace (/\\/g,'');
          getMyContentGM(viVideoSource,'TEXT',false, function (res2) {
            /* Get Videos */
            var viVideosContent = JSON.parse(res2);
            var viVideoList = {};
            var myVideoCode;
            var viVideoFound = false;
            if (viVideosContent) {
              var viVideoID = viVideosContent.video.id;
              var viVideoThumb = viVideosContent.video.thumbs['960'];
              if (!viVideoThumb) viVideoThumb = viVideosContent.video.thumbs['1280'];
              if (!viVideoThumb) viVideoThumb = viVideosContent.video.thumbs['640'];
              var viVideoDuration = viVideosContent.video.duration;
            } else {
              showMyMessage ('!content');
            }

            /* My Player Window */
            var viPlayerWindow = getMyElement ('', 'div', 'class', 'player_container', -1, false);
            var viVideoRegex = 'data-fallback-url=".*?(\\d{6,10})\\/.*?"';
            for (i=0;i<viPlayerWindow.length;i++) {
              if (viPlayerWindow[i].innerHTML.match(viVideoRegex) && viPlayerWindow[i].innerHTML.match(viVideoRegex)[1] == viVideoID) {
                viPlayerWindow = viPlayerWindow[i];
                break;
              }
            }
            var viPlayerElement = getMyElement (viPlayerWindow, 'div', 'class', 'player', 0, false);
            cleanMyElement (viPlayerElement, true);
            modifyMyElement (viPlayerElement,  'div', '', true);
            myPlayerWindow = getMyElement (viPlayerWindow, 'div', 'class', 'MyviWindow', 0, false);
            if (myPlayerWindow) removeMyElement(myPlayerWindow.parentNode,myPlayerWindow);
            myPlayerWindow = createMyElement ('div', '', '', '', '');
            myPlayerWindow.className = 'MyviWindow';
            styleMyElement (myPlayerWindow, {position: 'relative', width: PlayerWidth + 'px', height: PlayerHeight + 'px', backgroundColor: '#F4F4F4', zIndex: '99999'});
            modifyMyElement (viPlayerWindow, 'div', '', false, true);
            styleMyElement (viPlayerWindow, {height: '100%', left: viPlayerLeft + 'px', transform: 'none'});

            appendMyElement (viPlayerWindow, myPlayerWindow);
            if (viVideosContent) {
              if (viVideosContent.request.files.hls && viVideosContent.request.files.hls.cdns && viVideosContent.request.files.hls.default_cdn) {
                viVideoList[viVideoFormats['HLS']] = viVideosContent.request.files.hls.cdns[viVideosContent.request.files.hls.default_cdn].url
              }
              for (var viVideoCode in viVideoFormats) {
                for (var i=0; i < viVideosContent.request.files.progressive.length; i++) {
                  if (viVideosContent.request.files.progressive[i].quality == viVideoCode) {
                    viVideoFound = true;
                    myVideoCode = viVideoFormats[viVideoCode];
                    viVideoList[myVideoCode] = viVideosContent.request.files.progressive[i].url;
                  }
                }
              }
            }
            if (viVideoFound) {
              /* Create Player */
              var viDefaultVideo = 'Low Definition MP4';
              var player = {
                'playerSocket': viPlayerWindow,
                'playerWindow': myPlayerWindow,
                'videoList': viVideoList,
                'videoPlay': viDefaultVideo,
                'videoThumb': viVideoThumb,
                'videoDuration': viVideoDuration,
                'playerWidth': PlayerWidth,
                'playerHeight': PlayerHeight
              };
              feature['container'] = false;
              feature['widesize'] = false;
              option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
              option['containers'] = ['MP4'];
              HeadWindow = getMyElement('', 'div', 'id', 'topnav_desktop', -1, false);
              styleMyElement(HeadWindow, {zIndex: '50'});
              createMyPlayer (player);

              /* Fix panel */
              if (viVideoPage) styleMyElement(player['playerContent'], {marginTop: '5px'});
              else styleMyElement(player['playerContent'], {marginTop: '3px'});

            } else {
              showMyMessage ('!videos');
            }
          });
        });
      }
    }
  }

  function onNodeInserted(e) {
    if (e && e.target && (typeof e.target.className !== 'undefined') && e.target.className.className == 'video-wrapper') {
      setTimeout(function() { vimeo_run(); }, 0);
    }
  }

  var paginationholder = getMyElement ('', 'div', 'class', 'pagination_holder', 0, false);
  vimeo_run();
  var content=document.getElementById('content');
  window.addEventListener("hashchange", onNodeInserted(), false)
  var mo=window.MutationObserver||window.MozMutationObserver||window.WebKitMutationObserver;
  if (content && typeof mo!=='undefined') {
        var observer=new mo(function(mutations) {
            mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null && mutation.addedNodes.length > 0) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    if (typeof mutation.addedNodes[i].className !== 'undefined') if (mutation.addedNodes[i].className == 'video-wrapper') {
                      vimeo_run(mutation.addedNodes);
                      break;
                    }
                  }
                }
            });
        });
          observer.observe(content, {childList: true, subtree: true});
      } else {
          page.win.setInterval(function() {
            nurl = window.location.href;
            if (page.url != nurl) vimeo_run(); //window.location.href = nurl;
          }, 500)
      }

}

// VEVO
else if (page.url.match(/https?:\/\/(www\.)?vevo.com\//)) {
  var oldurl;
  var vePlayerWindow;
  var ve1PlayerWindow;
  var veVideoThumb;

  function vevo_run(vePlayerId) {
    var PlayerHeight, PlayerWidth, PlayerWideHeight, PlayerWideWidth, veVideo, myVideoCode;
    if (oldurl == page.url) return;
    oldurl = page.url;

    function createMyvePlayer() {
      try {window.removeEventListener('resize', vePlayerResize, false)} catch(e) {};
      var veDefaultVideo = 'Standard Definition MP4';
      var player = {
        'panelHeight': 22,
        'playerSocket': vePlayerWindow,
        'playerWindow': myPlayerWindow,
        'videoList': veVideoList,
        'videoPlay': veDefaultVideo,
        'videoThumb': veVideoThumb,
        'videoDuration': veVideoDuration,
        'playerWidth': PlayerWidth,
        'playerHeight': PlayerHeight
      };

      vePlayerResize = function () {
        veSizes();
        player['playerWidth'] = PlayerWidth;
        player['playerHeight'] = PlayerHeight;
        player['playerWideWidth'] = PlayerWideWidth;
        player['playerWideHeight'] = PlayerWideHeight;
        var veInfoWindow = getMyElement ('', 'div', 'class', 'watch-info', 0, false);
        if (veInfoWindow) styleMyElement (veInfoWindow, {position: 'absolute', top: '0px', left: Math.floor(PlayerWidth + 1) + 'px'});
        resizeMyPlayer(player, 'widesize');
      };

      feature['container'] = false;
      feature['widesize'] = false;
      option['definitions'] = ['Ultra High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      HeadWindow = getMyElement('', 'div', 'class', 'header-content', 0, false);
      createMyPlayer (player);

      /* Update Sizes */
      window.addEventListener('resize', vePlayerResize,false);
    }

    function veSizes(MyWindow) {
      var veScreenWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
      var veScreenHeight = page.win.innerHeight || page.doc.documentElement.clientHeight;
      PlayerWidth = MyWindow.clientWidth;
      PlayerHeight = MyWindow.clientHeight;
      PlayerWideWidth = MyWindow.clientWidth;
      PlayerWideHeight = MyWindow.clientHeight;
    }

    var veVideoFormats = {
        'High': 'High Definition MP4'
        ,'Med': 'Standard Definition MP4'
        ,'Low': 'Ultra Low Definition MP4'
        ,'HTTP Live Streaming': 'HTTP Live Streaming'
        ,'564000': 'Very Low Definition MP4'
        ,'864000': 'Low Definition MP4'
        ,'1328000':'Standard Definition MP4'
        ,'1728000':'Standard Definition HBR MP4'
        ,'2528000':'High Definition MP4'
        ,'3328000':'High Definition HBR MP4'
        ,'4392000':'Full High Definition MP4'
        ,'4328000':'Full High Definition MP4'
        ,'5392000':'Full High Definition HBR MP4'
        ,'5328000':'Full High Definition HBR MP4'
    };
    var veVideoList = {};
    var veVideoFound1 = false;
    var veVideoFound2 = false;

    /* Get Player Window */
    vePlayerWindow = getMyElement ('', 'div', 'class', 'banner-notPresent', 0, false);
    if (!vePlayerWindow) vePlayerWindow = getMyElement ('', 'div', 'class', 'hero', 0, false);
    if (!vePlayerWindow) {
      showMyMessage ('!player');
    }
    else {
        /* Get Videos Content */
        var veVideoID = page.url.match(/((https?:\/\/(www\.)?vevo.com\/watch.*\/)|(vevo:))(\w{10,12})(\?|$)/);
        veVideoID = veVideoID ? veVideoID[5] : null;
        if (!veVideoID) veVideoID = getMyContent(page.url,'"embedURL" href=.*?videoId=(.*?)\&amp;',false);
        var veVideoPlayer = getMyContent(page.url, 'meta\\s+property="og:video"\\s+content="(.*?)"', false);
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('POST', 'https://www.vevo.com/auth', false);
        xmlHTTP.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHTTP.send();
        var vevotoken = xmlHTTP.responseText.match(/"access_token"\s*:\s*"(.*?)"/);

        var veVideoURL = "https://apiv2.vevo.com/video/" + veVideoID + "?token=" + vevotoken[1];
        getMyContentGM(veVideoURL, 'TEXT', false, function(veVideosContent) {
          if (veVideosContent) {
            var veVideosJSON = JSON.parse(veVideosContent);
            veVideoThumb = veVideosContent.match('"thumbnailUrl":"(.*?)"')
            if (veVideoThumb) veVideoThumb = veVideoThumb[1];
          }
          else {
            showMyMessage ('!content');
          }

        cleanMyElement (vePlayerWindow, false);

        /* My Player Window */
        veSizes(vePlayerWindow);

        if (myPlayerWindow) {
          modifyMyElement (myPlayerWindow, 'div', '', true);
        } else {
          var vePlayer = getMyElement(vePlayerWindow, 'div', 'class', 'flash-player', 0, false);
          if (!vePlayer) vePlayer = getMyElement ('', 'div', 'id', 'freewheel-container', -1, false);
          if (vePlayer) {
            removeMyElement(vePlayer.parentNode, vePlayer);
            modifyMyElement (vePlayer, 'div', '', true);
            styleMyElement (vePlayer, {display: 'none'});
          }
          myPlayerWindow = createMyElement ('div', '', '', '', '');
          styleMyElement (myPlayerWindow, {position: 'relative', width: PlayerWidth + 'px', height: PlayerHeight + 'px', backgroundColor: '#F4F4F4', zIndex: '18',fontFamily: '"Arial","Helvetica","sans-serif"', margin: '0 auto'});
          var vePlayerError = getMyElement ('', 'div', 'class', 'video-error', 0, false);
          if (vePlayerError) {
            removeMyElement(vePlayerError.parentNode, vePlayerError);
          }
          var veVideoPoster = getMyElement ('', 'div', 'class', 'videoPoster', 0, false);
          if (veVideoPoster) {
            removeMyElement(veVideoPoster.parentNode, veVideoPoster);
          }
          appendMyElement (vePlayerWindow, myPlayerWindow);
//          var veInfoWindow = getMyElement ('', 'div', 'class', 'watch-info', 0, false);
//          if (veInfoWindow) styleMyElement (veInfoWindow, {position: 'absolute', top: '0px', left: Math.floor(PlayerWidth + 1) + 'px'});
        }

        if (veVideosJSON) {
          var veStreamURL = "https://apiv2.vevo.com/video/" + veVideoID + "/streams?token=" + vevotoken[1];
          veVideosJSON.video = {Object};
          getMyContentGM(veStreamURL,'TEXT', false, function (veVideosContent) {
            veVideosJSON.video.videoVersions = JSON.parse(veVideosContent);
            var veVideo, veVideoVersion;
            for (var i = 0; i < veVideosJSON.video.videoVersions.length - 1; i++) {
              if (veVideosJSON.video.videoVersions[i].sourceType == 2) {
                if (veVideosJSON.video.videoVersions[i].version in {3:1,4:1}) {
                  for (var veVideoFormat in veVideoFormats) {
                    veVideo = veVideosJSON.video.videoVersions[i].data.match('rendition name="' + veVideoFormat + '" url="(.*?)"');
                    if (veVideo) {
                      veVideoFound1 = true;
                      veVideoList[veVideoFormats[veVideoFormat]] = veVideo[1];
                    }
                  }
                }
              }
              if (veVideoFound1) break;
            }
            for (var i = 0; i < veVideosJSON.video.videoVersions.length - 1; i++) {
              if (veVideosJSON.video.videoVersions[i].sourceType == 3) {
                for (var veVideoFormat in veVideoFormats) {
                  veVideo = veVideosJSON.video.videoVersions[i].data.match('rendition name="' + veVideoFormat + '" url="(.*?)"');
                  if (veVideo) {
                    veVideoFound1 = true;
                    veVideoFound2 = true;
                    veVideoList[veVideoFormats[veVideoFormat] + ' MP4'] = veVideo[1];
                  }
                }
              }
              if (veVideoFound2) break;
            }
            veVideoFound2 = false;
            for (var i = 0; i < veVideosJSON.video.videoVersions.length - 1; i++) {
              if (veVideosJSON.video.videoVersions[i].url && veVideosJSON.video.videoVersions[i].url.match('//h264-((lvl3)|(aws)).vevo.com/')) {
                for (var veVideoFormat in veVideoFormats) {
                  if  (veVideosJSON.video.videoVersions[i].quality == veVideoFormat) {
                    veVideoFound1 = true;
                    veVideoFound2 = true;
                    veVideoList[veVideoFormats[veVideoFormat]] = veVideosJSON.video.videoVersions[i].url;
                  }
                }
              }
            }
            veVideoFound2 = false;
            for (var i = 0; i < veVideosJSON.video.videoVersions.length - 1; i++) {
              if (veVideosJSON.video.videoVersions[i].url && veVideosJSON.video.videoVersions[i].url.match('//hls-((lvl3)|(aws)|(aka)).vevo.com/')) {
                veVideoFound1 = true;
                veVideoFound2 = true;
                veVideoList[veVideoFormats['HTTP Live Streaming']] = veVideosJSON.video.videoVersions[i].url;
              }
            }
            veVideoFound2 = false;
            for (var i = 0; i < veVideosJSON.video.videoVersions.length - 1; i++) {
              if (veVideosJSON.video.videoVersions[i].sourceType == 5 && veVideosJSON.video.videoVersions[i].version == 1) {
                veVideo = veVideosJSON.video.videoVersions[i].data.match('rendition name="HTTP\\s?Level3" url="(.*?)"');
                if (veVideo) veVideoFound2 = true;
              }
              else if (veVideosJSON.video.videoVersions[i].url && veVideosJSON.video.videoVersions[i].url.match('//smil-((lvl3)|(aws)|(aka)).vevo.com/')) {
                veVideo = veVideosJSON.video.videoVersions[i].url
                if (veVideo) veVideoFound2 = true;
              }
              if (veVideoFound2) break;
            }
            if (veVideoFound2) getMyContentGM(veVideo[1],'TEXT',false, function (vesmilfile) {
              for (veVideoFormat in veVideoFormats) {
                if (vesmilfile.match(veVideoFormat)) {
                  veVideoList[veVideoFormats[veVideoFormat]] = "http://smil.lvl3.vevo.com" + vesmilfile.match('video src="mp4:(.*?)" system-bitrate="' + veVideoFormat + '"')[1];
                }
              }
              createMyvePlayer();
            });
          if (!veVideoFound2) if (veVideoFound1) createMyvePlayer(); else showMyMessage ('!videos');
          });
        }
      });
    }
  }

  function start_vevo() {
    var elWait = 50;
    var refreshIntervalId = page.win.setInterval(function() {
      if (getMyElement('', 'div', 'class', 'flash-player', 0, false) || getMyElement ('', 'div', 'id', 'html5-player', -1, false)
          || getMyElement ('', 'div', 'class', 'video-error', 0, false)) {
        page.win.clearInterval(refreshIntervalId);
        page = {win: window, doc: document, body: document.body, url: window.location.href}
        vevo_run();
      } else if (elWait > 0) {
        elWait--;
      } else {
        page.win.clearInterval(refreshIntervalId);
      }
    }, 500);
  }

  start_vevo();
  var oId = getMyContent(page.url,'"embedURL" href=.*?isrc=(.*?)\&amp;',false);
  var nId;
  page.win.setInterval(function() {
    nId = getMyContent(page.url,'"embedURL" href=.*?isrc=(.*?)\&amp;',false);
    if (nId != oId) {
      oId = nId;
      page.url = window.location.href;
      if (getMyElement ('', 'div', 'class', 'watch-info', 0, false)) vevo_run(); else window.location.href = page.url;
	}
  }, 500)

}

// =====MetaCafe===== //

else if (page.url.indexOf('metacafe.com/watch') != -1) {
  /* Get Player Window */
  var mcPlayerWindow = getMyElement('', 'div', 'class', 'mc-player-wrap', 0, false);
  if (!mcPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video Thumbnail */
    var mcVideoThumb = getMyContent (page.url, '"preview":"(.*?)"', true);
    var mcVideoDuration = getMyContent (page.url, '\\("duration","(.*?)"\\)', false)
    if (mcVideoDuration) mcVideoDuration = 60 * parseInt(mcVideoDuration) + parseInt(mcVideoDuration.split('-')[1]);

    /* Get Videos Content */
    var mcVideosContent = getMyContent(page.url, 'var flashvars\\s*=\\s*({.*?});', false);

    /* Player Size */
    var mcPlayerWidth, mcPlayerHeight, mcPlayerWideWidth, mcPlayerWideHeight;
    function mcGetSizes() {
      mcPlayerWidth = mcPlayerWindow.clientWidth;
      mcPlayerHeight = Math.ceil(mcPlayerWidth / (16 / 9)) + 22;
      mcPlayerWideWidth = mcPlayerHeight + 150;
      mcPlayerWideHeight = Math.ceil(mcPlayerWideWidth / (16 / 9)) + 22;
    }
    function mcUpdateSizes() {
      mcGetSizes();
      player['playerWidth'] = mcPlayerWidth;
      player['playerHeight'] = mcPlayerHeight;
      resizeMyPlayer('widesize');
    }
    mcGetSizes();

    /* My Player Window */
    myPlayerWindow = createMyElement ('div', '', '', '', '');
    styleMyElement (myPlayerWindow, {position: 'relative', width: mcPlayerWidth + 'px', height: mcPlayerHeight + 'px', backgroundColor: '#F4F4F4', zIndex: '10'});
    styleMyElement(getMyElement('', 'div', 'class', 'mc-player', 0, false), {display: 'none'});
    styleMyElement (mcPlayerWindow, {height: '100%'});
    appendMyElement(mcPlayerWindow, myPlayerWindow);

    /* Resize Event */
    page.win.addEventListener('resize', mcUpdateSizes, false);

    /* Hide Ads */
    var mcTopAd = getMyElement('', 'div', 'id', 'spot_header', -1, false);
    if (mcTopAd && mcTopAd.parentNode && mcTopAd.parentNode.parentNode) removeMyElement(mcTopAd.parentNode.parentNode, mcTopAd.parentNode);
    var mcRightAd = getMyElement('', 'div', 'id', 'spot_right_top', -1, false);
    if (mcRightAd && mcRightAd.parentNode && mcRightAd.parentNode.parentNode) removeMyElement(mcRightAd.parentNode.parentNode, mcRightAd.parentNode);

    blockObject = mcPlayerWindow;

    /* Get Videos */
    if (mcVideosContent) {
      var mcVideoList = {};
      var mcVideoFound = false;
      var mcVideoFormats = {'video_alt_url2': 'High Definition MP4', 'video_alt_url': 'Low Definition MP4', 'video_url': 'Very Low Def MP4'};
      var mcVideoFormatz = {'video_alt_url2': '_720p', 'video_alt_url': '_360p', 'video_url': '_240p'};
      var mcVideoHLS = mcVideosContent.match (/"src":"(.*?)"/);
      mcVideoHLS = (mcVideoHLS) ? cleanMyContent(mcVideoHLS[1], false) : null;
      if (mcVideoHLS) {
        var mcVideoParser, mcVideoParse, myVideoCode, mcVideo, mcDefaultVideo;
        for (var mcVideoCode in mcVideoFormats) {
          mcVideoParser = '"' + mcVideoCode + '":"(.*?)"';
          mcVideoParse = mcVideosContent.match (mcVideoParser);
          mcVideo = (mcVideoParse) ? mcVideoParse[1] : null;
          if (mcVideo) {
            if (!mcVideoFound) mcVideoFound = true;
            myVideoCode = mcVideoFormats[mcVideoCode];
            mcVideoList[myVideoCode] = mcVideoHLS.replace('.m3u8', mcVideoFormatz[mcVideoCode] + '.m3u8');
            if (!mcDefaultVideo) mcDefaultVideo = myVideoCode
          }
        }
      }

      if (mcVideoFound) {
        /* Get Watch Sidebar */
        var mcSidebarWindow = getMyElement ('', 'div', 'class', 'mc-right-block', 0, false);

        /* Create Player */
        var player = {
          'panelHeight': 22,
          'playerSocket': mcPlayerWindow,
          'playerWindow': myPlayerWindow,
          'videoList': mcVideoList,
          'videoPlay': mcDefaultVideo,
          'videoThumb': mcVideoThumb,
          'videoDuration': mcVideoDuration,
          'playerWidth': mcPlayerWidth,
          'playerHeight': mcPlayerHeight,
          'playerWideWidth': 1140,
          'playerWideHeight': 672,
          'sidebarWindow': mcSidebarWindow,
          'sidebarMarginNormal': 0,
          'sidebarMarginWide': 466
        };
        feature['container'] = false;
        feature['widesize'] = false;
        option['definitions'] = ['High Definition', 'Low Definition', 'Very Low Definition'];
        option['containers'] = ['MP4', 'Any'];
        HeadWindow = getMyElement ('', 'div', 'id', 'mc-header', -1, false);
        createMyPlayer (player);
      }
      else {
        showMyMessage ('!videos');
      }
    }
    else {
      var ytVideoId = page.url.match (/\/yt-(.*?)\//);
      if (ytVideoId && ytVideoId[1]) {
        var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
        showMyMessage ('embed', ytVideoLink);
      }
      else {
        showMyMessage ('!content');
      }
    }
  }
}

// =====Break===== //

else if (page.url.indexOf('break.com/video') != -1 || page.url.indexOf('break.com/movies') != -1) {

  /* Get Player Window */
  var brPlayerWindow = getMyElement ('', 'div', 'id', 'video-player', -1, false);
  if (!brPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video ID */
    var brVideoID = page.url.match(/-(\d+)($|\?)/);
    brVideoID = (brVideoID) ? brVideoID[1] : null;

    /* Get Videos Content */
    var brSource = page.win.location.protocol + '//' + page.win.location.hostname + '/embed/' + brVideoID;
    var brVideosContent = getMyContent (brSource, 'TEXT', false);

    /* Player Size */
    var brScreenWidth;
    var brPlayerWidth, brPlayerHeight;
    var brPlayerWideWidth, brPlayerWideHeight;
    var brSidebarMarginWide = 720;
    function brSizes() {
      brScreenWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
        brPlayerWidth = brPlayerWindow.clientWidth;
        brPlayerHeight = brPlayerWindow.clientHeight;
    }
    brSizes();

    /* My Player Window */
    myPlayerWindow = createMyElement ('div', '', '', '', '');
    styleMyElement (myPlayerWindow, {position: 'relative', width: brPlayerWidth + 'px', height: brPlayerHeight + 'px', backgroundColor: '#F4F4F4'});
    modifyMyElement (brPlayerWindow, 'div', '', true);
    styleMyElement (brPlayerWindow, {height: brPlayerHeight + 'px', overflow: 'visible', paddingBottom: '0px'});
    appendMyElement (brPlayerWindow, myPlayerWindow);

    /* Update Sizes */
    page.win.addEventListener('resize', function() {
      brSizes();
      player['playerWidth'] = brPlayerWidth;
      player['playerHeight'] = brPlayerHeight;
      player['playerWideWidth'] = brPlayerWideWidth;
      player['playerWideHeight'] = brPlayerWideHeight;
      player['sidebarMarginWide'] = brSidebarMarginWide;
      resizeMyPlayer('widesize');
    }, false);

    /* Get Videos */
    if (brVideosContent) {
      var brVideoList = {};
      var brVideoFormats = {};
      var brVideoFound = false;
      var brVideoFormats = {'320_kbps.mp4': 'Very Low Definition MP4', '496_kbps.mp4': 'Low Definition MP4', '864_kbps.mp4': 'Standard Definition MP4', '2240_kbps.mp4': 'High Definition MP4', '3264_kbps.mp4': 'Full High Definition MP4'};
      var brVideoPath, brVideoToken, brVideoThumb, brVideo, myVideoCode;
      if (page.url.indexOf('break.com/video') != -1) {
        brVideoPath = brVideosContent.match (/"videoUri":\s"(.*?)496_kbps/);
        brVideoPath = (brVideoPath) ? brVideoPath[1] : null;
      }
      else {
        brVideoPath = brVideosContent.match (/"hlsUri":\s"(.*?)"/);
        brVideoPath = (brVideoPath) ? brVideoPath[1] : null;
      }
      brVideoToken = brVideosContent.match (/"AuthToken":\s"(.*?)"/);
      brVideoToken = (brVideoToken) ? brVideoToken[1] : null;
      brVideoThumb = brVideosContent.match (/"thumbUri":\s"(.*?)"/);
      brVideoThumb = (brVideoThumb) ? brVideoThumb[1] : null;
      if (brVideoPath && brVideoToken) {
        for (var brVideoCode in brVideoFormats) {
          if (brVideosContent.match(brVideoCode)) {
            if (!brVideoFound) brVideoFound = true;
            myVideoCode = brVideoFormats[brVideoCode];
            if (page.url.indexOf('break.com/video') != -1) brVideo = brVideoPath + brVideoCode + '?' + brVideoToken;
            else brVideo = brVideoPath + brVideoCode + '.m3u8?' + brVideoToken;
            brVideoList[myVideoCode] = brVideo;
          }
        }
      }

      if (brVideoFound) {
        /* Get Watch Sidebar */
        var brSidebarWindow = getMyElement ('', 'aside', 'class', 'sidebar', 0, false);

        /* Create Player */
        var brDefaultVideo = 'Low Definition MP4';
        var brWindowWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
        player = {
          'panelHeight': 26,
          'panelPadding': -2,
          'playerSocket': brPlayerWindow,
          'playerWindow': myPlayerWindow,
          'videoList': brVideoList,
          'videoPlay': brDefaultVideo,
          'videoThumb': brVideoThumb,
          'playerWidth': brPlayerWidth,
          'playerHeight': brPlayerHeight,
          'sidebarWindow': brSidebarWindow,
          'sidebarMarginNormal': 10
        };
        feature['widesize'] = false;
        HeadWindow = getMyElement('', 'div', 'class', 'SiteNav', 0, false);
        option['definitions'] = ['Very Low Definition', 'Low Definition', 'Standard Definition', 'High Definition', 'Full High Definition'];
        option['containers'] = ['MP4', 'FLV', 'Any'];
        createMyPlayer (player);
      }
      else {
        var ytVideoId =  brVideosContent.match (/"youtubeId":\s"(.*?)"/);
        if (ytVideoId && ytVideoId[1]) {
          var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
          showMyMessage ('embed', ytVideoLink);
        }
        else {
        showMyMessage ('!videos');
        }
      }
    }
    else {
      showMyMessage ('!content');
    }
  }
}

// =====FunnyOrDie===== //
else if (page.url.indexOf('funnyordie.com/videos') != -1) {

  function fod_run() {
    /* Get Player Window */
    var fodPlayerWindow = getMyElement ('', 'div', 'id', 'videoContainer', -1, false);
    if (!fodPlayerWindow) {
      showMyMessage ('!player');
    }
    else {
      /* Get Video Thumbnail */
      var fodVideoThumb = getMyContent (page.url, 'meta\\s+property="og:image"\\s+content="(.*?)"', false);
      if (fodVideoThumb) fodVideoThumb = fodVideoThumb.replace (/large/, 'fullsize');

      /* Get Videos Content */
      var fodVideosContent = getMyContent (page.url, '<video([\\s\\S]*?)video>', false);

      /* Clean Player Window */
      var fodPlayerContainer = getMyElement ('', 'div', 'id', 'videoContainer', -1, false);
      var PlayerHeight = fodPlayerContainer.clientHeight + 22;
      var PlayerWidth = fodPlayerContainer.clientWidth;
      if (fodPlayerContainer)  styleMyElement (fodPlayerContainer, {display: 'none'});
      blockObject = fodPlayerContainer;

      /* My Player Window */
      myPlayerWindow = createMyElement ('div', '', '', '', '');
      styleMyElement (myPlayerWindow, {position: 'relative', width: PlayerWidth + 'px', height: PlayerHeight + 'px', backgroundColor: '#F4F4F4', margin: '0px auto'});
      styleMyElement (fodPlayerWindow, {height: '100%', overflow: 'visible'});
      fodPlayerContainer.parentNode.insertBefore (myPlayerWindow, fodPlayerContainer);

      /* Get Videos */
      if (fodVideosContent) {
        var fodVideoFormats = {'v2500.mp4': 'High Definition MP4', 'v1800.mp4': 'Standard Definition MP4', 'v600.mp4': 'Low Definition MP4', 'v600.webm': 'Low Definition WebM', 'v110.mp4': 'Very Low Definition MP4'};
        var fodVideoList = {};
        var fodVideoFound = false;
        var fodVideoPath, fodVideoCodes, fodVideo, myVideoCode;
        fodVideoPath = fodVideosContent.match(/src="(.*?)v\d+.*?\.mp4"/);
        fodVideoPath = (fodVideoPath) ? fodVideoPath[1] : null;
        fodVideoCodes = fodVideosContent.match (/v([^\/]*?)\/master/)
        if (!fodVideoCodes) fodVideoCodes = fodVideosContent.match (/src=".*?\/v(\d{3,4})\./);
        fodVideoCodes = (fodVideoCodes) ? fodVideoCodes[1] : '';
        if (fodVideoPath && fodVideoCodes) {
          for (var fodVideoCode in fodVideoFormats) {
            if (fodVideoCodes.indexOf(fodVideoCode.replace(/v/, '').replace(/\..*/, "")) != -1) {
              if (!fodVideoFound) fodVideoFound = true;
              fodVideo = page.win.location.protocol + fodVideoPath + fodVideoCode;
              myVideoCode = fodVideoFormats[fodVideoCode];
              fodVideoList[myVideoCode] = fodVideo;
            }
          }
        }
        else {
          for (var fodVideoCode in fodVideoFormats) {
            fodVideo = page.win.location.protocol + fodVideoPath + fodVideoCode;
            if (fodVideosContent.match(fodVideo)) {
              if (!fodVideoFound) fodVideoFound = true;
              myVideoCode = fodVideoFormats[fodVideoCode];
              fodVideoList[myVideoCode] = fodVideo;
            }
          }
        }

        if (fodVideoFound) {
          /* Create Player */
          fodDefaultVideo = 'Low Definition MP4';
          var player = {
            'playerSocket': fodPlayerWindow,
            'playerWindow': myPlayerWindow,
            'videoList': fodVideoList,
            'videoPlay': fodDefaultVideo,
            'videoThumb': fodVideoThumb,
            'playerWidth': PlayerWidth,
            'playerHeight': PlayerHeight
          };
          feature['container'] = false;
          feature['widesize'] = false;
          option['definitions'] = ['High Definition', 'Low Definition'];
          option['containers'] = ['MP4'];
          createMyPlayer (player);
          styleMyElement (player['playerPanel'], {height: '24px'});
        }
        else {
          showMyMessage ('!videos');
        }
      }
      else {
        showMyMessage ('!content');
      }
    }
  }

  fod_run() 
  var oId = window.location.href;
  var nId;
  page.win.setInterval(function() {
    nId = window.location.href;
    if (nId != oId) {
      oId = nId;
      page.url = window.location.href;
      window.location.href = page.url;
	}
  }, 500)
}

// =====Veoh===== //
else if (page.url.indexOf('veoh.com/watch') != -1) {

  /* Get Video Availability */
  if (getMyElement ('', 'div', 'class', 'veoh-video-player-error', 0, false)) return;

  /* Get Player Window */
  var vePlayerWindow = getMyElement ('', 'div', 'id', 'videoPlayerContainer', -1, false);
  if (!vePlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var veVideosContent = getMyContent (page.url, '__watch.videoDetailsJSON = \'\\{(.*?)\\}\'', false);
    veVideosContent = cleanMyContent (veVideosContent, true);

    /* Get Video Thumbnail */
    var veVideoThumbGet = veVideosContent.match (/"highResImage":"(.*?)"/);
    var veVideoThumb = (veVideoThumbGet) ? veVideoThumbGet[1] : null;
    var veVideoDuration = getMyContent (page.url, 'meta\\s+name="item-duration"\\s+content="(.*?)"', false);
    if (veVideoDuration) veVideoDuration = parseInt(veVideoDuration);

    /* My Player Window */
    var myPlayerWindow = createMyElement ('div', '', '', '', '');
    styleMyElement (myPlayerWindow, {position: 'relative', width: '640px', height: '382px', backgroundColor: '#F4F4F4', zIndex: '99999'});
    modifyMyElement (vePlayerWindow, 'div', '', true);
    styleMyElement (vePlayerWindow, {height: '100%'});
    appendMyElement (vePlayerWindow, myPlayerWindow);

    /* Get Videos */
    if (veVideosContent) {
      var veVideoFormats = {'fullPreviewHashLowPath': 'Very Low Definition MP4', 'fullPreviewHashHighPath': 'Low Definition MP4'};
      var veVideoList = {};
      var veVideoFound = false;
      var veVideoParser, veVideoParse, veVideo, myVideoCode;
      for (var veVideoCode in veVideoFormats) {
	veVideoParser = veVideoCode + '":"(.*?)"';
	veVideoParse = veVideosContent.match (veVideoParser);
	veVideo = (veVideoParse) ? veVideoParse[1] : null;
	if (veVideo) {
	  if (!veVideoFound) veVideoFound = true;
	  myVideoCode = veVideoFormats[veVideoCode];
	  veVideoList[myVideoCode] = veVideo;
	}
      }

      if (veVideoFound) {
	/* Get Watch Sidebar */
	var veSidebarWindow = getMyElement ('', 'div', 'id', 'videoToolsContainer', -1, false);
	if (veSidebarWindow) styleMyElement(veSidebarWindow, {marginTop: '-380px'});

	/* Create Player */
	var veDefaultVideo = 'Low Definition MP4';
	var player = {
	  'playerSocket': vePlayerWindow,
	  'playerWindow': myPlayerWindow,
	  'videoList': veVideoList,
	  'videoPlay': veDefaultVideo,
	  'videoThumb': veVideoThumb,
      'videoDuration': veVideoDuration,
	  'playerWidth': 640,
	  'playerHeight': 382,
	  'playerWideWidth': 970,
	  'playerWideHeight': 568,
	  'sidebarWindow': veSidebarWindow,
	  'sidebarMarginNormal': -380,
	  'sidebarMarginWide': 20
	};
	feature['container'] = false;
	option['definition'] = 'LD';
	option['definitions'] = ['Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMyPlayer (player);
      }
      else {
	var veVideoSource = getMyContent(page.url, '"videoContentSource":"(.*?)"', false);
	if (veVideoSource == 'YouTube') var ytVideoId = getMyContent(page.url, '"videoId":"yapi-(.*?)"', false);
	if (ytVideoId) {
	  var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
	  showMyMessage ('embed', ytVideoLink);
	}
	else {
	  showMyMessage ('!videos');
	}
      }
    }
    else {
      showMyMessage ('!content');
    }
  }

}

// =====Viki===== //

else if (page.url.indexOf('viki.com/videos') != -1) {

  /* Get Player Window */
  var vkPlayerWindow = getMyElement ('', 'div', 'class', 'video-placeholder', 0, false);

  if (!vkPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video ID */
    var vkVideoID = page.url.match(/videos\/(.*?)v/);
    vkVideoID = (vkVideoID) ? vkVideoID[1] : null;

    /* Get Videos Content */
    var vkVideosContent;
    if (vkVideoID) vkVideosContent = getMyContent (page.win.location.protocol + '//' + page.win.location.host + '/player5_fragment/' + vkVideoID + 'v.json', 'TEXT', false);
    var vkVideoDuration = getMyContent(page.url, '"duration":(.*?),', false);

    /* Player Size */
    var vkSidebarWidth = 320;
    var vkSidebarWindow = getMyElement ('', 'div', 'class', 'col s12 l4 right', 0, false);
    var vkPlayerWidth, vkPlayerHeight;
    var vkPlayerWideWidth, vkPlayerWideHeight;
    var vkSidebarMarginWide;
    function vkGetSizes() {
      vkPlayerWidth = vkPlayerWindow.clientWidth + 2;
      vkPlayerHeight = Math.ceil(vkPlayerWidth / (16 / 9)) + 22;
      vkSidebarWidth = vkSidebarWindow.clientWidth;
      vkPlayerWideWidth = vkPlayerWidth + vkSidebarWidth;
      vkPlayerWideHeight = Math.ceil(vkPlayerWideWidth / (16 / 9)) + 22;
      vkSidebarMarginWide = vkPlayerWideHeight + 20;
    }
    function vkUpdateSizes() {
      vkGetSizes();
      player['playerWidth'] = vkPlayerWidth;
      player['playerHeight'] = vkPlayerHeight;
      player['playerWideWidth'] = vkPlayerWideWidth;
      player['playerWideHeight'] = vkPlayerWideHeight;
      player['sidebarMarginWide'] = vkSidebarMarginWide;
      resizeMyPlayer(player, 'widesize');
    }
    vkGetSizes();

    /* My Player Window */
    var myPlayerWindow = createMyElement ('div', '', '', '', '');
    styleMyElement (myPlayerWindow, {position: 'relative', width: vkPlayerWidth + 'px', height: vkPlayerHeight + 'px', backgroundColor: '#FFFFFF'});
    modifyMyElement (vkPlayerWindow, 'div', '', false, true);
    styleMyElement (vkPlayerWindow, {overflow: 'visible', height: '100%'});
    appendMyElement (vkPlayerWindow, myPlayerWindow);
    blockObject = vkPlayerWindow;

    /* Resize Event */
    page.win.addEventListener('resize', vkUpdateSizes, false);

    /* Get Videos */
    if (vkVideosContent) {
      var vkVideoList = {};
      var vkVideo = vkVideosContent.match(/"video_url":"(.*?)"/);
      vkVideo = (vkVideo) ? vkVideo[1] : null;
      var vkVideoThumb = vkVideosContent.match(/"image_url":"(.*?)"/);
      vkVideoThumb = (vkVideoThumb) ? vkVideoThumb[1] : null;

      /* Create Player */
      if (vkVideo) {
        var vkDefaultVideo = 'Low Definition MP4';
        vkVideoList[vkDefaultVideo] = vkVideo
        player = {
          'playerSocket': vkPlayerWindow,
          'playerWindow': myPlayerWindow,
          'videoList': vkVideoList,
          'videoPlay': vkDefaultVideo,
          'videoDuration': vkVideoDuration,
          'videoThumb': vkVideoThumb,
          'playerWidth': vkPlayerWidth,
          'playerHeight': vkPlayerHeight,
          'playerWideWidth': vkPlayerWideWidth,
          'playerWideHeight': vkPlayerWideHeight,
          'sidebarWindow': vkSidebarWindow,
          'sidebarMarginNormal': 0,
          'sidebarMarginWide': vkSidebarMarginWide
        };
        feature['definition'] = false;
        feature['container'] = false;
        option['definition'] = 'LD';
        option['definitions'] = ['Low Definition'];
        option['containers'] = ['MP4'];
        createMyPlayer (player);
        vkUpdateSizes ();

        /* Fix panel */
        //styleMyElement(player['playerContent'], {marginTop: '5px'});
        styleMyElement(player['playerPanel'], {height: '22px', width: player['playerWidth'] + 'px'});
      }
      else {
	    showMyMessage ('!videos');
      }
    }
    else {
      showMyMessage ('!content');
    }
  }

}

// =====IMDB===== //
  /* Redirect To imdb.com */
else if (page.url.indexOf('imdb.org') !== -1) window.location.href = page.win.location.href.replace(/imdb\.org/, 'imdb.com');
else if (page.url.indexOf('imdb.com/video') != -1) {

  function imdb_run(imdb_PlayerId) {
    /* Get Player Window */
    var imdbPlayerWindow = getMyElement ('', 'div', 'id', 'player-article', -1, false);
/*    if (imdbPlayerWindow) {
      var imdbPlayerWidth = 670;
      var imdbPlayerHeight = 398;
    } else { */
      imdbPlayerWindow = getMyElement ('', 'div', 'class', 'video-player  vp-full', 0, false);
      var imdbPlayerWidth = imdbPlayerWindow.clientWidth;
      var imdbPlayerHeight = imdbPlayerWindow.clientHeight;
      if (imdbPlayerHeight < 340) imdbPlayerHeight = 340;
//    }
    if (!imdbPlayerWindow) {
        showMyMessage ('!player');
    }
    else {
      imdbVideoID = getMyContent (page.url, '"viconst":"(.*?)"', false);
      if (!imdbVideoID) {
        imdbVideoID = page.url.match(/vi\d{5,}/);
        if (imdbVideoID) imdbVideoID = imdbVideoID[0]; else imdbVideoID = getMyContent (page.url, '"viconst":"(.*?)"', true);
      }
      /* My Player Window */
      var myPlayerWindow = createMyElement ('div', '', '', '', '');
      var imdbPlayerElement = getMyElement ('', 'div', 'id', 'imdb-video', -1, false);
      blockObject = imdbPlayerElement;
      blockInterval = 20;

      styleMyElement (myPlayerWindow, {position: 'relative', width: imdbPlayerWidth + 'px', height: imdbPlayerHeight + 'px', backgroundColor: '#F4F4F4'});
        for (var i=0; i<imdbPlayerWindow.children.length; i++) {
          if (imdbPlayerWindow.children[i].tagName == 'DIV') styleMyElement (imdbPlayerWindow.children[i], {display: 'none'});
        }
      appendMyElement (imdbPlayerWindow, myPlayerWindow);

      /* Get Videos Content */
      var imdbVideoList = {};
      var imdbVideoFormats = {'1': 'Full High Definition MP4', '2': 'Standard Definition MP4', '3': 'High Definition MP4'};
      var imdbVideoThumb, imdbDefaultVideo, imdbURL, imdbVideo, myVideoCode;
      var imdbVideoFound = false;
      var imdbVideoRTMP = false;
    	for (var imdbVideoCode in imdbVideoFormats) {
          imdbURL = page.win.location.protocol + '//' + page.win.location.hostname + '/video/imdb/' + imdbVideoID + '/player?uff=' + imdbVideoCode;
          imdbVideo = getMyContent (imdbURL, 'so.addVariable\\("file",\\s+"(.*?)"\\);', true);
      	  if (!imdbVideoThumb) imdbVideoThumb = getMyContent (imdbURL, 'so.addVariable\\("image",\\s+"(.*?)"\\);', true);
/*            
          imdbURL = page.win.location.protocol + '//' + page.win.location.hostname + '/video/imdb/' + imdbVideoID + '/imdb/single?vPage=1&format=' + imdbVideoCode;
          imdbVideo = getMyContent (imdbURL, '"videoUrl":"(.*?)"', false);
          if (!imdbVideoThumb) imdbVideoThumb = getMyContent (imdbURL, '"slate":"(.*?)"', false);
*/          
      	  if (imdbVideo) {
		  if (imdbVideo.indexOf('rtmp') != -1) {
	  	    if (!imdbVideoRTMP) imdbVideoRTMP = true;
		  } else {
	  	    if (!imdbVideoFound) imdbVideoFound = true;
	  	    myVideoCode = imdbVideoFormats[imdbVideoCode];
	  	    imdbVideoList[myVideoCode] = imdbVideo;
	  	    if (!imdbDefaultVideo) imdbDefaultVideo = myVideoCode;
		  }
        }
      }

      if (imdbVideoFound) {
        /* Get Watch Sidebar */
        var imdbSidebarWindow = getMyElement ('', 'div', 'id', 'sidebar', -1, false);
        if (imdbSidebarWindow) styleMyElement (imdbSidebarWindow, {marginTop: '-400px'});

        /* Create Player */
        var player = {
	  	'playerSocket': imdbPlayerWindow,
	  	'playerWindow': myPlayerWindow,
	  	'videoList': imdbVideoList,
	  	'videoPlay': imdbDefaultVideo,
	  	'videoThumb': imdbVideoThumb,
	  	'playerWidth': imdbPlayerWidth,
	  	'playerHeight': imdbPlayerHeight,
	  	'playerWideWidth': 1010,
	  	'playerWideHeight': 592,
	  	'sidebarWindow': imdbSidebarWindow,
	  	'sidebarMarginNormal': -400,
	  	'sidebarMarginWide': 0
        };
        feature['container'] = false;
        option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition'];
        option['containers'] = ['MP4'];
        createMyPlayer (player);
      }
      else {
        if (imdbVideoRTMP) showMyMessage ('!support');
        else showMyMessage ('!videos');
      }
    }
  }

  function onNodeInserted(e) {
    if (e && e.target && (typeof e.target.id !== 'undefined') && e.target.id == 'imdb-video-player') {
      setTimeout(function() { imdb_run(); }, 0);
    }
  }

  if (page.url.indexOf('video/playlist') == -1) imdb_run();
    else {
      var content = getMyElement ('', 'body', '', '', -1, false);
      if (content) {
        var mo=window.MutationObserver||window.MozMutationObserver||window.WebKitMutationObserver;
        if(typeof mo!=='undefined') {
          var observer=new mo(function(mutations) {
            mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null && mutation.addedNodes.length > 0) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                  if ((typeof mutation.addedNodes[i].id !== 'undefined') && (mutation.addedNodes[i].id == 'imdb-video-player')) {
                    imdb_run(mutation.addedNodes);
                    break;
                  }
                }
              }
          });
        });
        observer.observe(content, {childList: true, subtree: true, characterData:true});
      } else { // MutationObserver fallback for old browsers
        content.parentNode.addEventListener('DOMNodeInserted', onNodeInserted, true);
      }
    }
  }

}

// =====Facebook===== //
else if (page.url.match('facebook.com/(video.php|.*/videos/)')) {

  function Facebook() {

    /* Get Videos Content */
    var fbVideosContent = getMyContent(page.url, '\\\\"params\\\\",\\\\"(.*?)\\\\"', false);
    var fbPattern = /\\u([\d\w]{4})/gi;
    if (fbVideosContent) {
      fbVideosContent = fbVideosContent.replace(fbPattern, function (match, group) {
	return String.fromCharCode(parseInt(group, 16));
      });
      fbVideosContent = unescape(fbVideosContent).replace(/\\/g, '');
    }

    /* Get Video Thumbnail */
    var fbVideoThumb = getMyContent(page.url, 'background-image:\\s+url\\((.*?)\\);', false);
    if (fbVideoThumb) fbVideoThumb = fbVideoThumb.replace(/&amp;/g, '&');
    else fbVideoThumb = 'https://www.facebook.com/images/fb_icon_325x325.png';

    /* Kill Theater */
    var fbTheaterWaitCount = 20;
    var fbPhotoTheater;
    function fbTheaterWaitFunc() {
      fbPhotoTheater = getMyElement ('', 'div', 'class', 'uiLayer', 0, false);
      if (fbPhotoTheater) {
	styleMyElement(fbPhotoTheater, {display: 'none'});
	//styleMyElement (page.body.firstChild, {position: 'relative'});
	page.body.firstChild.setAttribute('style', 'position:relative !important');
	var fbTheaterVideo = getMyElement (fbPhotoTheater, 'video', 'tag', '', -1, false)[0];
	if (fbTheaterVideo) {
	   fbTheaterVideo.pause();
	   page.win.clearInterval(fbTheaterWaitInterval);
	}
      }
      fbTheaterWaitCount--;
      if (fbTheaterWaitCount == 0) {
	page.win.clearInterval(fbTheaterWaitInterval);
      }
    }
    var fbTheaterWaitInterval = page.win.setInterval(fbTheaterWaitFunc, 500);

    /* Fix Size */
    var fbContentWrapperId = getMyContent(page.url, '\\\\"object_element_id\\\\":\\\\"(.*?)\\\\"', false);
    if (fbContentWrapperId) {
      var fbContentWrapper= getMyElement ('', 'div', 'id', fbContentWrapperId, -1, false);
      if (fbContentWrapper) styleMyElement(fbContentWrapper, {minWidth: '660px', marginLeft: '-160px'});
    }

    /* My Player Window */
    myPlayerWindow = createMyElement ('div', '', '', '', '');
    styleMyElement (myPlayerWindow, {position: 'relative', width: '640px', height: '382px', backgroundColor: '#F4F4F4'});
    modifyMyElement (fbPlayerWindow, 'div', '', false, true);
    appendMyElement (fbPlayerWindow, myPlayerWindow);
    blockObject = fbPlayerWindow;

    /* Get Videos */
    if (fbVideosContent) {
      var fbVideoList = {};
      var fbVideoFormats = {'sd_src': 'Low Definition MP4', 'hd_src': 'High Definition MP4'};
      var fbVideoFound = false;
      var fbVideoPattern, fbVideo, myVideoCode, fbDefaultVideo;
      for (var fbVideoCode in fbVideoFormats) {
	fbVideoPattern = '"' + fbVideoCode + '":"(.*?)"';
	fbVideo = fbVideosContent.match(fbVideoPattern);
	fbVideo = (fbVideo) ? fbVideo[1] : null;
	if (fbVideo) {
	  fbVideo = cleanMyContent(fbVideo, false);
	  if (!fbVideoFound) fbVideoFound = true;
	  myVideoCode = fbVideoFormats[fbVideoCode];
	  if (fbVideo.indexOf('.flv') != -1) myVideoCode = myVideoCode.replace('MP4', 'FLV');
	  fbVideoList[myVideoCode] = fbVideo;
	  if (!fbDefaultVideo) fbDefaultVideo = myVideoCode;
	}
      }

      if (fbVideoFound) {
	/* Create Player */
	player = {
	  'playerSocket': fbPlayerWindow,
	  'playerWindow': myPlayerWindow,
	  'videoList': fbVideoList,
	  'videoPlay': fbDefaultVideo,
	  'videoThumb': fbVideoThumb,
	  'playerWidth': 640,
	  'playerHeight': 382
	};
	feature['widesize'] = false;
	option['definitions'] = ['High Definition', 'Low Definition'];
	option['containers'] = ['MP4', 'FLV', 'Any'];
	createMyPlayer (player);
      }
      else {
	showMyMessage ('!videos');
      }
    }
    else {
      showMyMessage ('!content');
    }

  }

  var myPlayerWindow;
  var fbPlayerWindow = getMyElement ('', 'div', 'class', 'videoStage', 0, false);
  if (fbPlayerWindow) {
    Facebook();
  }
  else {
    var fbPlayerWaitCount = 20;
    function fbPlayerWaitFunc() {
      fbPlayerWindow = getMyElement ('', 'div', 'class', 'mtm', 0, false);
      if (fbPlayerWindow) {
	page.win.clearInterval(fbPlayerWaitInterval);
	Facebook();
      }
      fbPlayerWaitCount--;
      if (fbPlayerWaitCount == 0) {
	page.win.clearInterval(fbPlayerWaitInterval);
	showMyMessage ('!player');
      }
    }
    var fbPlayerWaitInterval = page.win.setInterval(fbPlayerWaitFunc, 500);
  }

}

// =====Owncloud===== //
else if (page.url.indexOf('/owncloud/apps') != -1 || page.url.indexOf('/nextcloud/apps') != -1) {
  /* Get Player Window */

  function ocRun (isMutation) {
    var ocPlayerWindow = getMyElement ('', 'div', 'id', 'videoplayer_overlay', -1, false);
    if (ocPlayerWindow && ocPlayerWindow.children[0]) {
      ocPlayerWindow = ocPlayerWindow.children[0];

      /* Get Videos Content */
      var ocVideoFound = false;
      var ocVideoList = {};
      var ocVideoSrc = getMyContent(page.url, '<video.*?<source type="video.*?src="(.*?)".*</video>', false);
      /* Get Videos */
      if (ocVideoSrc) {
        ocVideoSrc = unescape(ocVideoSrc);
        ocVideoSrc = escape(ocVideoSrc.replace( '/index.php/apps/files/ajax/download.php?dir=/', '/remote.php/webdav/').replace('&amp;files=','/'));
        // only for trhome!
        // if (page.win.location.hostname.indexOf('trhome.my-router.de') != -1) ocVideoSrc = ocVideoSrc.replace('/owncloud/remote.php','');
        ocVideoFound = true;
      }
      /* Get Video Thumbnail */
      /* implement it via ImDB */

      /* My Player Window */
      var myPlayerWindow = createMyElement ('div', '', '', '', '');
      var ocPlayerWidth = ocPlayerWindow.children[0].offsetWidth;
      var ocPlayerHeight = ocPlayerWindow.children[0].offsetHeight;
      styleMyElement (myPlayerWindow, {position: 'relative', width: ocPlayerWidth + 'px', height: ocPlayerHeight+ 'px', backgroundColor: '#F4F4F4', margin: '0px auto'});
      modifyMyElement (ocPlayerWindow, 'div', '', true);
      styleMyElement (ocPlayerWindow, {position: 'relative!important', top: '50px', left: '50px', right: '50px',bottom: '50px', transform: 'initial', margin: '0px auto'});
      appendMyElement (ocPlayerWindow, myPlayerWindow);

      if (ocVideoFound) {
        if (ocVideoSrc.indexOf(page.win.location.hostname) != -1) ocVideoList['Standard Definition MP4'] = ocVideoSrc.replace(page.win.location.protocol.slice(0,page.win.location.protocol.length-1)+'%3A//',page.win.location.protocol.slice(0,page.win.location.protocol.length-1)+'://');
        else ocVideoList['Standard Definition MP4'] = page.win.location.protocol + '//' + page.win.location.hostname + ocVideoSrc ;
        /* Create Player */
        var ocuser = getMyOption('user');
        var ocpasswd = getMyOption('passwd');
        var ysDefaultVideo = 'Standard Definition MP4';
        var player = {
          'panelHeight': 22,
          'user': ocuser,
          'passwd': ocpasswd,
          'playerSocket': ocPlayerWindow,
          'playerWindow': myPlayerWindow,
          'videoList': ocVideoList,
          'videoPlay': ysDefaultVideo,
// 	        'videoThumb': ocVideoThumb,
          'playerWidth': ocPlayerWidth,
          'playerHeight': ocPlayerHeight
        };
        feature['widesize'] = false;
        feature['PWdialog'] = true;
        option['definitions'] = ['Standard Definition'];
        option['containers'] = ['Any'];
        HeadWindow = getMyElement ('', 'div', 'id', 'header', -1, false);
        createMyPlayer (player);
        if (!ocuser) passwdDialog (player);
      }
        else {
            showMyMessage ('!videos');
        }
    }
  }

  function onNodeInserted(e) {
    if (e && e.target && e.target.id=='videoplayer_container') {
      setTimeout(function() {  ocRun(); }, 0);
    }
  }

  var content=document.getElementById('body-user');
  window.addEventListener("hashchange", onNodeInserted(), false)
  var mo=window.MutationObserver||window.MozMutationObserver||window.WebKitMutationObserver;
  if (content && typeof mo!=='undefined') {
    var observer=new mo(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.addedNodes!==null && mutation.addedNodes.length > 0) {
          for (var i=0; i<mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].id == 'videoplayer_overlay') {
              ocRun(mutation.addedNodes);
              break;
            }
          }
        }
      });
    });
    observer.observe(content, {childList: true, subtree: true});
  }
  else {
    window.addEventListener('DOMNodeInserted', onNodeInserted(e), false);
  }

}

})();
