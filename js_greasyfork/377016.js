// ==UserScript==
// @name Youtube Multiscript
// @description Returns youtube's old layout and adds a download button.
// @author sk1pp3rFTW
// @namespace https://pelican.gq/
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/*
// @match https://s.ytimg.com/yts/jsbin/*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @connect googlevideo.com
// @connect ytimg.com
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-start
// @license MIT License
// @icon data:image/png;base64,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
// @version 1.0.69
// @downloadURL https://update.greasyfork.org/scripts/377016/Youtube%20Multiscript.user.js
// @updateURL https://update.greasyfork.org/scripts/377016/Youtube%20Multiscript.meta.js
// ==/UserScript==
var url = window.location.href;
if (url.indexOf("disable_polymer") === -1) {
  if (url.indexOf("?") > 0) {
    url += "&";
  } else {
    url += "?";
  }
  url += "disable_polymer=1";
  window.location.href = url;
}

(function () {
  var FORMAT_LABEL={'18':'MP4 360p','22':'MP4 720p','43':'WebM 360p','44':'WebM 480p','45':'WebM 720p','46':'WebM 1080p','135':'MP4 480p - no audio','137':'MP4 1080p - no audio','138':'MP4 2160p - no audio','140':'M4A 128kbps - audio','264':'MP4 1440p - no audio','266':'MP4 2160p - no audio','298':'MP4 720p60 - no audio','299':'MP4 1080p60 - no audio'};
  var FORMAT_TYPE={'18':'mp4','22':'mp4','43':'webm','44':'webm','45':'webm','46':'webm','135':'mp4','137':'mp4','138':'mp4','140':'m4a','264':'mp4','266':'mp4','298':'mp4','299':'mp4'};
  var FORMAT_ORDER=['18','43','135','44','22','298','45','137','299','46','264','138','266','140'];
  var FORMAT_RULE={'mp4':'all','webm':'none','m4a':'all'};
  // all=display all versions, max=only highest quality version, none=no version
  // the default settings show all MP4 videos
  var SHOW_DASH_FORMATS=false;
  var BUTTON_TEXT={'ar':'تنزيل','cs':'Stáhnout','de':'Herunterladen','en':'Download','es':'Descargar','fr':'Télécharger','hi':'डाउनलोड','hu':'Letöltés','id':'Unduh','it':'Scarica','ja':'ダウンロード','ko':'내려받기','pl':'Pobierz','pt':'Baixar','ro':'Descărcați','ru':'Скачать','tr':'İndir','zh':'下载','zh-TW':'下載'};
  var BUTTON_TOOLTIP={'ar':'تنزيل هذا الفيديو','cs':'Stáhnout toto video','de':'Dieses Video herunterladen','en':'Download this video','es':'Descargar este vídeo','fr':'Télécharger cette vidéo','hi':'वीडियो डाउनलोड करें','hu':'Videó letöltése','id':'Unduh video ini','it':'Scarica questo video','ja':'このビデオをダウンロードする','ko':'이 비디오를 내려받기','pl':'Pobierz plik wideo','pt':'Baixar este vídeo','ro':'Descărcați acest videoclip','ru':'Скачать это видео','tr': 'Bu videoyu indir','zh':'下载此视频','zh-TW':'下載此影片'};
  var DECODE_RULE=[];
  var RANDOM=7489235179; // Math.floor(Math.random()*1234567890);
  var CONTAINER_ID='download-youtube-video'+RANDOM;
  var LISTITEM_ID='download-youtube-video-fmt'+RANDOM;
  var BUTTON_ID='download-youtube-video-button'+RANDOM;
  var DEBUG_ID='download-youtube-video-debug-info';
  var STORAGE_URL='download-youtube-script-url';
  var STORAGE_CODE='download-youtube-signature-code';
  var STORAGE_DASH='download-youtube-dash-enabled';
  var isDecodeRuleUpdated=false;

  start();

function start() {
  var pagecontainer=document.getElementById('page-container');
  if (!pagecontainer) return;
  if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
  var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
  var logocontainer=document.getElementById('logo-container');
  if (logocontainer && !isAjax) { // fix for blocked videos
    isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
  }
  var content=document.getElementById('content');
  if (isAjax && content) { // Ajax UI
      var mo=window.MutationObserver||window.WebKitMutationObserver;
      if(typeof mo!=='undefined') {
        var observer=new mo(function(mutations) {
          mutations.forEach(function(mutation) {
              if(mutation.addedNodes!==null) {
                for (var i=0; i<mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id=='watch7-main-container') { // || id=='watch7-container'
                      run();
                      break;
                    }
                }
              }
          });
        });
        observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
      } else { // MutationObserver fallback for old browsers
        pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
      }
  }
}

function onNodeInserted(e) {
    if (e && e.target && (e.target.id=='watch7-main-container')) { // || id=='watch7-container'
      run();
  }
}

function run() {
  if (document.getElementById(CONTAINER_ID)) return; // check download container

  var videoID, videoFormats, videoAdaptFormats, videoManifestURL, scriptURL=null;
  var isSignatureUpdatingStarted=false;
  var operaTable=new Array();
  var language=document.documentElement.getAttribute('lang');
  var textDirection='left';
  if (document.body.getAttribute('dir')=='rtl') {
    textDirection='right';
  }
  if (document.getElementById('watch7-action-buttons')) {  // old UI
    fixTranslations(language, textDirection);
  }

  // obtain video ID, formats map

  var args=null;
  var usw=(typeof this.unsafeWindow !== 'undefined')?this.unsafeWindow:window; // Firefox, Opera<15
  if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.args) {
    args=usw.ytplayer.config.args;
  }
  if (args) {
    videoID=args['video_id'];
    videoFormats=args['url_encoded_fmt_stream_map'];
    videoAdaptFormats=args['adaptive_fmts'];
    videoManifestURL=args['dashmpd'];
    debug('DYVAM - Info: Standard mode. videoID '+(videoID?videoID:'none')+'; ');
  }
  if (usw.ytplayer && usw.ytplayer.config && usw.ytplayer.config.assets) {
    scriptURL=usw.ytplayer.config.assets.js;
  }

  if (videoID==null) { // unsafeWindow workaround (Chrome, Opera 15+)
    var buffer=document.getElementById(DEBUG_ID+'2');
    if (buffer) {
      while (buffer.firstChild) {
        buffer.removeChild(buffer.firstChild);
      }
    } else {
      buffer=createHiddenElem('pre', DEBUG_ID+'2');
    }
    injectScript ('if(ytplayer&&ytplayer.config&&ytplayer.config.args){document.getElementById("'+DEBUG_ID+'2").appendChild(document.createTextNode(\'"video_id":"\'+ytplayer.config.args.video_id+\'", "js":"\'+ytplayer.config.assets.js+\'", "dashmpd":"\'+ytplayer.config.args.dashmpd+\'", "url_encoded_fmt_stream_map":"\'+ytplayer.config.args.url_encoded_fmt_stream_map+\'", "adaptive_fmts":"\'+ytplayer.config.args.adaptive_fmts+\'"\'));}');
    var code=buffer.innerHTML;
    if (code) {
      videoID=findMatch(code, /\"video_id\":\s*\"([^\"]+)\"/);
      videoFormats=findMatch(code, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
      videoFormats=videoFormats.replace(/&amp;/g,'\\u0026');
      videoAdaptFormats=findMatch(code, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
      videoAdaptFormats=videoAdaptFormats.replace(/&amp;/g,'\\u0026');
      videoManifestURL=findMatch(code, /\"dashmpd\":\s*\"([^\"]+)\"/);
      scriptURL=findMatch(code, /\"js\":\s*\"([^\"]+)\"/);
    }
    debug('DYVAM - Info: Injection mode. videoID '+(videoID?videoID:'none')+'; ');
  }

  if (videoID==null) { // if all else fails
    var bodyContent=document.body.innerHTML;
    if (bodyContent!=null) {
      videoID=findMatch(bodyContent, /\"video_id\":\s*\"([^\"]+)\"/);
      videoFormats=findMatch(bodyContent, /\"url_encoded_fmt_stream_map\":\s*\"([^\"]+)\"/);
      videoAdaptFormats=findMatch(bodyContent, /\"adaptive_fmts\":\s*\"([^\"]+)\"/);
      videoManifestURL=findMatch(bodyContent, /\"dashmpd\":\s*\"([^\"]+)\"/);
      if (scriptURL==null) {
        scriptURL=findMatch(bodyContent, /\"js\":\s*\"([^\"]+)\"/);
        if (scriptURL) {
          scriptURL=scriptURL.replace(/\\/g,'');
        }
      }
    }
    debug('DYVAM - Info: Brute mode. videoID '+(videoID?videoID:'none')+'; ');
  }

  debug('DYVAM - Info: url '+window.location.href+'; useragent '+window.navigator.userAgent);

  if (videoID==null || videoFormats==null || videoID.length==0 || videoFormats.length==0) {
   debug('DYVAM - Error: No config information found. YouTube must have changed the code.');
   return;
  }

  // Opera 12 extension message handler
  if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined') {
    opera.extension.onmessage = function(event) {
      var index=findMatch(event.data.action, /xhr\-([0-9]+)\-response/);
      if (index && operaTable[parseInt(index,10)]) {
        index=parseInt(index,10);
        var trigger=(operaTable[index])['onload'];
        if (typeof trigger === 'function' && event.data.readyState == 4) {
          if (trigger) {
              trigger(event.data);
          }
        }
      }
    }
  }

  if (!isDecodeRuleUpdated) {
    DECODE_RULE=getDecodeRules(DECODE_RULE);
    isDecodeRuleUpdated=true;
  }
  if (scriptURL) {
    scriptURL = absoluteURL(scriptURL);
    debug('DYVAM - Info: Full script URL: '+scriptURL);
    fetchSignatureScript(scriptURL);
  }

   // video title
   var videoTitle=document.title || 'video';
   videoTitle=videoTitle.replace(/\s*\-\s*YouTube$/i, '').replace(/'/g, '\'').replace(/^\s+|\s+$/g, '').replace(/\.+$/g, '');
   videoTitle=videoTitle.replace(/[:"\?\*]/g, '').replace(/[\|\\\/]/g, '_'); // Mac, Linux, Windows
   if (((window.navigator.userAgent || '').toLowerCase()).indexOf('windows') >= 0) {
      videoTitle=videoTitle.replace(/#/g, '').replace(/&/g, '_'); // Windows
   } else {
      videoTitle=videoTitle.replace(/#/g, '%23').replace(/&/g, '%26'); //  Mac, Linux
   }

  // parse the formats map
  var sep1='%2C', sep2='%26', sep3='%3D';
  if (videoFormats.indexOf(',')>-1||videoFormats.indexOf('&')>-1||videoFormats.indexOf('\\u0026')>-1) {
    sep1=',';
    sep2=(videoFormats.indexOf('&')>-1)?'&':'\\u0026';
    sep3='=';
  }
  var videoURL=new Array();
  var videoSignature=new Array();
  if (videoAdaptFormats) {
    videoFormats=videoFormats+sep1+videoAdaptFormats;
  }
  var videoFormatsGroup=videoFormats.split(sep1);
  for (var i=0;i<videoFormatsGroup.length;i++) {
    var videoFormatsElem=videoFormatsGroup[i].split(sep2);
    var videoFormatsPair=new Array();
    for (var j=0;j<videoFormatsElem.length;j++) {
      var pair=videoFormatsElem[j].split(sep3);
      if (pair.length==2) {
        videoFormatsPair[pair[0]]=pair[1];
      }
    }
    if (videoFormatsPair['url']==null) continue;
    var url=unescape(unescape(videoFormatsPair['url'])).replace(/\\\//g,'/').replace(/\\u0026/g,'&');
    if (videoFormatsPair['itag']==null) continue;
    var itag=videoFormatsPair['itag'];
    var sig=videoFormatsPair['sig']||videoFormatsPair['signature'];
    if (sig) {
      url=url+'&signature='+sig;
      videoSignature[itag]=null;
    } else if (videoFormatsPair['s']) {
      url=url+'&signature='+decryptSignature(videoFormatsPair['s']);
      videoSignature[itag]=videoFormatsPair['s'];
    }
    if (url.toLowerCase().indexOf('ratebypass')==-1) { // speed up download for dash
      url=url+'&ratebypass=yes';
    }
    if (url.toLowerCase().indexOf('http')==0) { // validate URL
      videoURL[itag]=url+'&title='+videoTitle;
    }
  }

  var showFormat=new Array();
  for (var category in FORMAT_RULE) {
    var rule=FORMAT_RULE[category];
    for (var index in FORMAT_TYPE){
      if (FORMAT_TYPE[index]==category) {
        showFormat[index]=(rule=='all');
      }
    }
    if (rule=='max') {
      for (var i=FORMAT_ORDER.length-1;i>=0;i--) {
        var format=FORMAT_ORDER[i];
        if (FORMAT_TYPE[format]==category && videoURL[format]!=undefined) {
          showFormat[format]=true;
          break;
        }
      }
    }
  }

  var dashPref=getPref(STORAGE_DASH);
  if (dashPref=='1') {
    SHOW_DASH_FORMATS=true;
  } else if (dashPref!='0') {
    setPref(STORAGE_DASH,'0');
  }

  var downloadCodeList=[];
  for (var i=0;i<FORMAT_ORDER.length;i++) {
    var format=FORMAT_ORDER[i];
    if (format=='37' && videoURL[format]==undefined) { // hack for dash 1080p
      if (videoURL['137']) {
       format='137';
      }
      showFormat[format]=showFormat['37'];
    } else if (format=='38' && videoURL[format]==undefined) { // hack for dash 4K
      if (videoURL['138'] && !videoURL['266']) {
       format='138';
      }
      showFormat[format]=showFormat['38'];
    }
    if (!SHOW_DASH_FORMATS && format.length>2) continue;
    if (videoURL[format]!=undefined && FORMAT_LABEL[format]!=undefined && showFormat[format]) {
      downloadCodeList.push({url:videoURL[format],sig:videoSignature[format],format:format,label:FORMAT_LABEL[format]});
      debug('DYVAM - Info: itag'+format+' url:'+videoURL[format]);
    }
  }

  if (downloadCodeList.length==0) {
    debug('DYVAM - Error: No download URL found. Probably YouTube uses encrypted streams.');
    return; // no format
  }

  // find parent container
  var newWatchPage=false;
  var parentElement=document.getElementById('watch7-action-buttons');
  if (parentElement==null) {
    parentElement=document.getElementById('watch8-secondary-actions');
    if (parentElement==null) {
      debug('DYVAM Error - No container for adding the download button. YouTube must have changed the code.');
      return;
    } else {
      newWatchPage=true;
    }
  }

  // get button labels
  var buttonText=(BUTTON_TEXT[language])?BUTTON_TEXT[language]:BUTTON_TEXT['en'];
  var buttonLabel=(BUTTON_TOOLTIP[language])?BUTTON_TOOLTIP[language]:BUTTON_TOOLTIP['en'];

  // generate download code for regular interface
  var mainSpan=document.createElement('span');

  if (newWatchPage) {
    var spanIcon=document.createElement('span');
    spanIcon.setAttribute('class', 'yt-uix-button-icon-wrapper');
    var imageIcon=document.createElement('img');
    imageIcon.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
    imageIcon.setAttribute('class', 'yt-uix-button-icon');
    imageIcon.setAttribute('style', 'width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABG0lEQVRYR+2W0Q3CMAxE2wkYAdiEEWADmIxuACMwCmzABpCTEmRSO7YTQX+ChECV43t2nF7GYeHPuLD+0AKwC/DnWMAp/N5qimkBuAfBdRTF/+2/AV6ZYFUxVYuicAfoHegd6B3oHfhZB+ByF+JyV8FkrAB74pqH3DU5L3iGoBURhdVODIQF4EjEkWLmmhYALOQgNIBcHHke4buhxXAAaFnaAhqbQ5QAOHHkwhZ8balkx1ICCiEBWNZ+CivdB7REHIC2ZjZK2oWklDDdB1NSdCd/Js2PqQMpSIKYVcM8kE6QCwDBNRCqOBJrW0CL8kCYxL0A1k6YxWsANAiXeC2ABOEWbwHAWrwxpzgkmA/JtIqnxTOElmPnjlkc4A3FykAhA42AxwAAAABJRU5ErkJggg==);');
    spanIcon.appendChild(imageIcon);
    mainSpan.appendChild(spanIcon);
  }

  var spanButton=document.createElement('span');
  spanButton.setAttribute('class', 'yt-uix-button-content');
  spanButton.appendChild(document.createTextNode(buttonText+' '));
  mainSpan.appendChild(spanButton);

  if (!newWatchPage) { // old UI
    var imgButton=document.createElement('img');
    imgButton.setAttribute('class', 'yt-uix-button-arrow');
    imgButton.setAttribute('src', '//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif');
    mainSpan.appendChild(imgButton);
  }

  var listItems=document.createElement('ol');
  listItems.setAttribute('style', 'display:none;');
  listItems.setAttribute('class', 'yt-uix-button-menu');
  for (var i=0;i<downloadCodeList.length;i++) {
    var listItem=document.createElement('li');
    var listLink=document.createElement('a');
    listLink.setAttribute('style', 'text-decoration:none;');
    listLink.setAttribute('href', downloadCodeList[i].url);
    listLink.setAttribute('download', videoTitle+'.'+FORMAT_TYPE[downloadCodeList[i].format]);
    var listButton=document.createElement('span');
    listButton.setAttribute('class', 'yt-uix-button-menu-item');
    listButton.setAttribute('loop', i+'');
    listButton.setAttribute('id', LISTITEM_ID+downloadCodeList[i].format);
    listButton.appendChild(document.createTextNode(downloadCodeList[i].label));
    listLink.appendChild(listButton);
    listItem.appendChild(listLink);
    listItems.appendChild(listItem);
  }
  mainSpan.appendChild(listItems);
  var buttonElement=document.createElement('button');
  buttonElement.setAttribute('id', BUTTON_ID);
  if (newWatchPage) {
    buttonElement.setAttribute('class', 'yt-uix-button  yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip');
  } else { // old UI
    buttonElement.setAttribute('class', 'yt-uix-button yt-uix-tooltip yt-uix-button-empty yt-uix-button-text');
    buttonElement.setAttribute('style', 'margin-top:4px; margin-left:'+((textDirection=='left')?5:10)+'px;');
  }
  buttonElement.setAttribute('data-tooltip-text', buttonLabel);
  buttonElement.setAttribute('type', 'button');
  buttonElement.setAttribute('role', 'button');
  buttonElement.addEventListener('click', function(){return false;}, false);
  buttonElement.appendChild(mainSpan);
  var containerSpan=document.createElement('span');
  containerSpan.setAttribute('id', CONTAINER_ID);
  containerSpan.appendChild(document.createTextNode(' '));
  containerSpan.appendChild(buttonElement);

  // add the button
  if (!newWatchPage) { // watch7
    parentElement.appendChild(containerSpan);
  } else { // watch8
    parentElement.insertBefore(containerSpan, parentElement.firstChild);
  }

  // REPLACEWITH if (!isSignatureUpdatingStarted) {
    for (var i=0;i<downloadCodeList.length;i++) {
      addFileSize(downloadCodeList[i].url, downloadCodeList[i].format);
    }
  // }

  if (typeof GM_download !== 'undefined') {
    for (var i=0;i<downloadCodeList.length;i++) {
      var downloadFMT=document.getElementById(LISTITEM_ID+downloadCodeList[i].format);
      var url=(downloadCodeList[i].url).toLowerCase();
      if (url.indexOf('clen=')>0 && url.indexOf('dur=')>0 && url.indexOf('gir=')>0
          && url.indexOf('lmt=')>0) {
        downloadFMT.addEventListener('click', downloadVideoNatively, false);
      }
    }
  }

  addFromManifest();

  function downloadVideoNatively(e) {
    var elem=e.currentTarget;
    e.returnValue=false;
    if (e.preventDefault) {
      e.preventDefault();
    }
    var loop=elem.getAttribute('loop');
    if (loop) {
      GM_download(downloadCodeList[loop].url, videoTitle+'.'+FORMAT_TYPE[downloadCodeList[loop].format]);
    }
    return false;
  }

  function addFromManifest() { // add Dash URLs from manifest file
    var formats=['137', '138', '140']; // 137=1080p, 138=4k, 140=m4a
    var isNecessary=true;
    for (var i=0;i<formats.length;i++) {
      if (videoURL[formats[i]]) {
        isNecessary=false;
        break;
      }
    }
    if (videoManifestURL && SHOW_DASH_FORMATS && isNecessary) {
      var matchSig=findMatch(videoManifestURL, /\/s\/([a-zA-Z0-9\.]+)\//i);
      if (matchSig) {
        var decryptedSig=decryptSignature(matchSig);
        if (decryptedSig) {
          videoManifestURL=videoManifestURL.replace('/s/'+matchSig+'/','/signature/'+decryptedSig+'/');
        }
      }
      videoManifestURL=absoluteURL(videoManifestURL);
      debug('DYVAM - Info: manifestURL '+videoManifestURL);
      crossXmlHttpRequest({
          method:'GET',
          url:videoManifestURL, // check if URL exists
          onload:function(response) {
            if (response.readyState === 4 && response.status === 200 && response.responseText) {
              debug('DYVAM - Info: maniestFileContents '+response.responseText);
              var lastFormatFromList=downloadCodeList[downloadCodeList.length-1].format;
              debug('DYVAM - Info: lastformat: '+lastFormatFromList);
              for (var i=0;i<formats.length;i++) {
                k=formats[i];
                if (videoURL[k] || showFormat[k]==false) continue;
                var regexp = new RegExp('<BaseURL>(http[^<]+itag\\/'+k+'[^<]+)<\\/BaseURL>','i');
                var matchURL=findMatch(response.responseText, regexp);
                debug('DYVAM - Info: matchURL itag= '+k+' url= '+matchURL);
                if (!matchURL) continue;
                matchURL=matchURL.replace(/&amp\;/g,'&');
                // ...
                downloadCodeList.push(
                  {url:matchURL,sig:videoSignature[k],format:k,label:FORMAT_LABEL[k]});
                var downloadFMT=document.getElementById(LISTITEM_ID+lastFormatFromList);
                var clone=downloadFMT.parentNode.parentNode.cloneNode(true);
                clone.firstChild.firstChild.setAttribute('id', LISTITEM_ID+k);
                clone.firstChild.setAttribute('href', matchURL);
                downloadFMT.parentNode.parentNode.parentNode.appendChild(clone);
                downloadFMT=document.getElementById(LISTITEM_ID+k);
                downloadFMT.firstChild.nodeValue=FORMAT_LABEL[k];
                addFileSize(matchURL, k);
                lastFormatFromList=k;
              }
            }
          }
        });
    }
  }

  function injectStyle(code) {
    var style=document.createElement('style');
    style.type='text/css';
    style.appendChild(document.createTextNode(code));
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  function injectScript(code) {
    var script=document.createElement('script');
    script.type='application/javascript';
    script.textContent=code;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }

  function debug(str) {
    var debugElem=document.getElementById(DEBUG_ID);
    if (!debugElem) {
      debugElem=createHiddenElem('div', DEBUG_ID);
    }
    debugElem.appendChild(document.createTextNode(str+' '));
  }

  function createHiddenElem(tag, id) {
    var elem=document.createElement(tag);
    elem.setAttribute('id', id);
    elem.setAttribute('style', 'display:none;');
    document.body.appendChild(elem);
    return elem;
  }

  function fixTranslations(language, textDirection) {
    if (/^af|bg|bn|ca|cs|de|el|es|et|eu|fa|fi|fil|fr|gl|hi|hr|hu|id|it|iw|kn|lv|lt|ml|mr|ms|nl|pl|ro|ru|sl|sk|sr|sw|ta|te|th|uk|ur|vi|zu$/.test(language)) { // fix international UI
      var likeButton=document.getElementById('watch-like');
      if (likeButton) {
        var spanElements=likeButton.getElementsByClassName('yt-uix-button-content');
        if (spanElements) {
          spanElements[0].style.display='none'; // hide like text
        }
      }
      var marginPixels=10;
      if (/^bg|ca|cs|el|eu|hr|it|ml|ms|pl|sl|sw|te$/.test(language)) {
        marginPixels=1;
      }
      injectStyle('#watch7-secondary-actions .yt-uix-button{margin-'+textDirection+':'+marginPixels+'px!important}');
    }
  }

  function findMatch(text, regexp) {
    var matches=text.match(regexp);
    return (matches)?matches[1]:null;
  }

  function isString(s) {
    return (typeof s==='string' || s instanceof String);
  }

  function isInteger(n) {
    return (typeof n==='number' && n%1==0);
  }

  function absoluteURL(url) {
    var link = document.createElement('a');
    link.href = url;
    return link.href;
  }

  function getPref(name) { // cross-browser GM_getValue
    var a='', b='';
    try {a=typeof GM_getValue.toString; b=GM_getValue.toString()} catch(e){}
    if (typeof GM_getValue === 'function' &&
    (a === 'undefined' || b.indexOf('not supported') === -1)) {
      return GM_getValue(name, null); // Greasemonkey, Tampermonkey, Firefox extension
    } else {
        var ls=null;
        try {ls=window.localStorage||null} catch(e){}
        if (ls) {
          return ls.getItem(name); // Chrome script, Opera extensions
        }
    }
    return;
  }

  function setPref(name, value) { //  cross-browser GM_setValue
    var a='', b='';
    try {a=typeof GM_setValue.toString; b=GM_setValue.toString()} catch(e){}
    if (typeof GM_setValue === 'function' &&
    (a === 'undefined' || b.indexOf('not supported') === -1)) {
      GM_setValue(name, value); // Greasemonkey, Tampermonkey, Firefox extension
    } else {
        var ls=null;
        try {ls=window.localStorage||null} catch(e){}
        if (ls) {
          return ls.setItem(name, value); // Chrome script, Opera extensions
        }
    }
  }

  function crossXmlHttpRequest(details) { // cross-browser GM_xmlhttpRequest
    if (typeof GM_xmlhttpRequest === 'function') { // Greasemonkey, Tampermonkey, Firefox extension, Chrome script
      GM_xmlhttpRequest(details);
    } else if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined' &&
               typeof opera.extension.postMessage !== 'undefined') { // Opera 12 extension
        var index=operaTable.length;
        opera.extension.postMessage({'action':'xhr-'+index, 'url':details.url, 'method':details.method});
        operaTable[index]=details;
    } else if (typeof window.opera === 'undefined' && typeof XMLHttpRequest === 'function') { // Opera 15+ extension
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (details['onload']) {
              details['onload'](xhr);
            }
          }
        }
        xhr.open(details.method, details.url, true);
        xhr.send();
    }
  }

  function addFileSize(url, format) {

    function updateVideoLabel(size, format) {
      var elem=document.getElementById(LISTITEM_ID+format);
      if (elem) {
        size=parseInt(size,10);
        if (size>=1073741824) {
          size=parseFloat((size/1073741824).toFixed(1))+' GB';
        } else if (size>=1048576) {
          size=parseFloat((size/1048576).toFixed(1))+' MB';
        } else {
          size=parseFloat((size/1024).toFixed(1))+' KB';
        }
        if (elem.childNodes.length>1) {
            elem.lastChild.nodeValue=' ('+size+')';
        } else if (elem.childNodes.length==1) {
            elem.appendChild(document.createTextNode(' ('+size+')'));
        }
      }
    }

    var matchSize=findMatch(url, /[&\?]clen=([0-9]+)&/i);
    if (matchSize) {
      updateVideoLabel(matchSize, format);
    } else {
      try {
        crossXmlHttpRequest({
          method:'HEAD',
          url:url,
          onload:function(response) {
            if (response.readyState == 4 && response.status == 200) { // add size
              var size=0;
              if (typeof response.getResponseHeader === 'function') {
                size=response.getResponseHeader('Content-length');
              } else if (response.responseHeaders) {
                  var regexp = new RegExp('^Content\-length: (.*)$','im');
                  var match = regexp.exec(response.responseHeaders);
                  if (match) {
                    size=match[1];
                  }
              }
              if (size) {
                updateVideoLabel(size, format);
              }
            }
          }
        });
      } catch(e) { }
    }
  }

  function findSignatureCode(sourceCode) {
    debug('DYVAM - Info: signature start '+getPref(STORAGE_CODE));
    var signatureFunctionName =
    findMatch(sourceCode,
    /\.set\s*\("signature"\s*,\s*([a-zA-Z0-9_$][\w$]*)\(/)
    || findMatch(sourceCode,
    /\.sig\s*\|\|\s*([a-zA-Z0-9_$][\w$]*)\(/)
    || findMatch(sourceCode,
    /\.signature\s*=\s*([a-zA-Z_$][\w$]*)\([a-zA-Z_$][\w$]*\)/); //old
    if (signatureFunctionName == null) return setPref(STORAGE_CODE, 'error');
    signatureFunctionName=signatureFunctionName.replace('$','\\$');
    var regCode = new RegExp(signatureFunctionName + '\\s*=\\s*function' +
    '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
    var regCode2 = new RegExp('function \\s*' + signatureFunctionName +
    '\\s*\\([\\w$]*\\)\\s*{[\\w$]*=[\\w$]*\\.split\\(""\\);\n*(.+);return [\\w$]*\\.join');
    var functionCode = findMatch(sourceCode, regCode) || findMatch(sourceCode, regCode2);
    debug('DYVAM - Info: signaturefunction ' + signatureFunctionName + ' -- ' + functionCode);
    if (functionCode == null) return setPref(STORAGE_CODE, 'error');

    var reverseFunctionName = findMatch(sourceCode,
    /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.reverse\s*\(\s*\)\s*}/);
    debug('DYVAM - Info: reversefunction ' + reverseFunctionName);
    if (reverseFunctionName) reverseFunctionName=reverseFunctionName.replace('$','\\$');
    var sliceFunctionName = findMatch(sourceCode,
    /([\w$]*)\s*:\s*function\s*\(\s*[\w$]*\s*,\s*[\w$]*\s*\)\s*{\s*(?:return\s*)?[\w$]*\.(?:slice|splice)\(.+\)\s*}/);
    debug('DYVAM - Info: slicefunction ' + sliceFunctionName);
    if (sliceFunctionName) sliceFunctionName=sliceFunctionName.replace('$','\\$');

    var regSlice = new RegExp('\\.(?:'+'slice'+(sliceFunctionName?'|'+sliceFunctionName:'')+
    ')\\s*\\(\\s*(?:[a-zA-Z_$][\\w$]*\\s*,)?\\s*([0-9]+)\\s*\\)'); // .slice(5) sau .Hf(a,5)
    var regReverse = new RegExp('\\.(?:'+'reverse'+(reverseFunctionName?'|'+reverseFunctionName:'')+
    ')\\s*\\([^\\)]*\\)');  // .reverse() sau .Gf(a,45)
    var regSwap = new RegExp('[\\w$]+\\s*\\(\\s*[\\w$]+\\s*,\\s*([0-9]+)\\s*\\)');
    var regInline = new RegExp('[\\w$]+\\[0\\]\\s*=\\s*[\\w$]+\\[([0-9]+)\\s*%\\s*[\\w$]+\\.length\\]');
    var functionCodePieces=functionCode.split(';');
    var decodeArray=[];
    for (var i=0; i<functionCodePieces.length; i++) {
      functionCodePieces[i]=functionCodePieces[i].trim();
      var codeLine=functionCodePieces[i];
      if (codeLine.length>0) {
        var arrSlice=codeLine.match(regSlice);
        var arrReverse=codeLine.match(regReverse);
        debug(i+': '+codeLine+' --'+(arrSlice?' slice length '+arrSlice.length:'') +' '+(arrReverse?'reverse':''));
        if (arrSlice && arrSlice.length >= 2) { // slice
        var slice=parseInt(arrSlice[1], 10);
        if (isInteger(slice)){
          decodeArray.push(-slice);
        } else return setPref(STORAGE_CODE, 'error');
      } else if (arrReverse && arrReverse.length >= 1) { // reverse
        decodeArray.push(0);
      } else if (codeLine.indexOf('[0]') >= 0) { // inline swap
          if (i+2<functionCodePieces.length &&
          functionCodePieces[i+1].indexOf('.length') >= 0 &&
          functionCodePieces[i+1].indexOf('[0]') >= 0) {
            var inline=findMatch(functionCodePieces[i+1], regInline);
            inline=parseInt(inline, 10);
            decodeArray.push(inline);
            i+=2;
          } else return setPref(STORAGE_CODE, 'error');
      } else if (codeLine.indexOf(',') >= 0) { // swap
        var swap=findMatch(codeLine, regSwap);
        swap=parseInt(swap, 10);
        if (isInteger(swap) && swap>0){
          decodeArray.push(swap);
        } else return setPref(STORAGE_CODE, 'error');
      } else return setPref(STORAGE_CODE, 'error');
      }
    }

    if (decodeArray) {
      setPref(STORAGE_URL, scriptURL);
      setPref(STORAGE_CODE, decodeArray.toString());
      DECODE_RULE=decodeArray;
      debug('DYVAM - Info: signature '+decodeArray.toString()+' '+scriptURL);
      // update download links and add file sizes
      for (var i=0;i<downloadCodeList.length;i++) {
        var elem=document.getElementById(LISTITEM_ID+downloadCodeList[i].format);
        var url=downloadCodeList[i].url;
        var sig=downloadCodeList[i].sig;
        if (elem && url && sig) {
          url=url.replace(/\&signature=[\w\.]+/, '&signature='+decryptSignature(sig));
          elem.parentNode.setAttribute('href', url);
          addFileSize(url, downloadCodeList[i].format);
        }
      }
    }
  }

  function isValidSignatureCode(arr) { // valid values: '5,-3,0,2,5', 'error'
    if (!arr) return false;
    if (arr=='error') return true;
    arr=arr.split(',');
    for (var i=0;i<arr.length;i++) {
      if (!isInteger(parseInt(arr[i],10))) return false;
    }
    return true;
  }

  function fetchSignatureScript(scriptURL) {
    var storageURL=getPref(STORAGE_URL);
    var storageCode=getPref(STORAGE_CODE);
    if (!(/,0,|^0,|,0$|\-/.test(storageCode))) storageCode=null; // hack for only positive items
    if (storageCode && isValidSignatureCode(storageCode) && storageURL &&
        scriptURL==absoluteURL(storageURL)) return;
    try {
      debug('DYVAM fetch '+scriptURL);
      isSignatureUpdatingStarted=true;
      crossXmlHttpRequest({
        method:'GET',
        url:scriptURL,
        onload:function(response) {
          debug('DYVAM fetch status '+response.status);
          if (response.readyState === 4 && response.status === 200 && response.responseText) {
            findSignatureCode(response.responseText);
          }
        }
      });
    } catch(e) { }
  }

  function getDecodeRules(rules) {
    var storageCode=getPref(STORAGE_CODE);
    if (storageCode && storageCode!='error' && isValidSignatureCode(storageCode)) {
      var arr=storageCode.split(',');
      for (var i=0; i<arr.length; i++) {
        arr[i]=parseInt(arr[i], 10);
      }
      rules=arr;
      debug('DYVAM - Info: signature '+arr.toString()+' '+scriptURL);
    }
    return rules;
  }

  function decryptSignature(sig) {
    function swap(a,b){var c=a[0];a[0]=a[b%a.length];a[b]=c;return a};
    function decode(sig, arr) { // encoded decryption
      if (!isString(sig)) return null;
      var sigA=sig.split('');
      for (var i=0;i<arr.length;i++) {
        var act=arr[i];
        if (!isInteger(act)) return null;
        sigA=(act>0)?swap(sigA, act):((act==0)?sigA.reverse():sigA.slice(-act));
      }
      var result=sigA.join('');
      return result;
    }

    if (sig==null) return '';
    var arr=DECODE_RULE;
    if (arr) {
      var sig2=decode(sig, arr);
      if (sig2) return sig2;
    } else {
      setPref(STORAGE_URL, '');
      setPref(STORAGE_CODE, '');
    }
    return sig;
  }

  }

})();

