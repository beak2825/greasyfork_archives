// ==UserScript==
// @name        Activity Bookmark & Like History
// @namespace   https://github.com/KanashiiDev
// @match       https://anilist.co/*
// @grant       none
// @version     1.2.1
// @author      KanashiiDev
// @supportURL  https://github.com/KanashiiDev/Ani-ActivitySaver/issues
// @description Simple userscript/extension for AniList that allows users to bookmark text activities.
// @license     GPL-3.0-or-later
// @run-at      document-end
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@3.2.3/dist/purify.min.js
// @require     https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @downloadURL https://update.greasyfork.org/scripts/469903/Activity%20Bookmark%20%20Like%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/469903/Activity%20Bookmark%20%20Like%20History.meta.js
// ==/UserScript==

//CSS
var styles = `
.activityData span.markdown_spoiler {
    display:block;
    margin:10px
}

.activityData span.markdown_spoiler_cont {
    margin-top:10px
}

.activityData span.markdown_spoiler_show {
    cursor: pointer;
    padding: 5px;
    padding-top: 3px;
    font-weight: 700;
    padding-bottom: 3px;
    background: rgb(var(--color-foreground));
    font-size:12px;
    color: rgb(var(--color-blue));
    -webkit-border-radius: 5px;
            border-radius: 5px
}

.activityData .button.liked {
  color: rgb(var(--color-red));
}

.activityData .activityLinksDiv {
  color: rgb(var(--color-blue-dim));
  position: relative;
  left: -webkit-calc(100% - 105px);
  left: calc(100% - 105px);
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
  font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  font-weight: 800;
}

.activityData .actions {
    color: rgb(var(--color-blue-dim));
    position: relative;
    left: -webkit-calc(100% - 85px);
    left: calc(100% - 85px);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 95px;
    font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    font-weight: 800;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
        -ms-flex-pack: end;
            justify-content: flex-end;
}

.activityData .action {
  color: rgb(var(--color-blue-dim))!important;
  cursor: pointer;
  display: inline-block;
  padding-left: 5px;
  -webkit-transition: .2s;
  -o-transition: .2s;
  transition: .2s;
}

.activityData .time {
  font: 800 1.1rem Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  color: rgb(var(--color-text-lighter));
  position: relative;
  right: 12px;
  top: 12px;
}

.activityData .acttime {
  font: 800 1.1rem Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  color: rgb(var(--color-text-lighter));
  margin-top:3px
}

.activityData .reply .actions {
  font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  font-weight: 700;
  top: 12px;
  position: absolute;
  width:125px;
  left: -webkit-calc(100% - 135px);
  left: calc(100% - 135px);
  -webkit-box-align: center;
      -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center
}

.activityData .reply .action {
  padding-left: 5px;
  -webkit-transition: .2s;
  -o-transition: .2s;
  transition: .2s;
}

.activityData .reply  .action.likes {
  padding-right: 10px;
}

.activityData .reply .time {
  color: rgb(var(--color-text-lighter));
  display: contents!important;
}

.activityData .reply-markdown {
  padding: 0px 2px
}
.activityData .reply-wrap .name {
    padding: 8px 2px
}

.activityData .name {
  margin-left: 5px;
  position: absolute;
  font-weight: bold;
}

.activityData .reply {
  margin-top: 15px;
  margin-bottom: 10px;
  background: rgba(var(--color-foreground));
  -webkit-border-radius: 10px;
          border-radius: 10px;
  padding: 14px;
  position: relative;
  font-size: 1.3rem
}

.activityData {
  min-width: 100%;
  padding: 20px 25px 10px;
  margin-bottom: 15px;
  -webkit-border-radius: 10px;
          border-radius: 10px;
  background: rgb(var(--color-background))
}
.activityInner {
  text-align: -webkit-center;
  margin-bottom:10px
}

.activityData img {
  max-width: 100%;
  margin-bottom:5px
}

.activityData blockquote {
  background: rgb(var(--color-foreground))
}

.activityData .reply blockquote {
  background: rgb(var(--color-background))
}

.activityDataImage {
 background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    width: 45px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin-bottom: 10px;
    height: 45px
}

.activityDataUsername {
    font-weight: 700;
    left: 50px;
    top: 7px;
    position: relative;
    width: 150px;
    display: block;
}

.reply-wrap .activityDataImage {
    width: 30px;
    height: 30px
}

.reply-wrap .reply .header {
   height:40px
}

.activityData .saveEmbed {
    background: rgb(var(--color-foreground));
    font-size: 12px;
    color: rgb(var(--color-text));
    -webkit-border-radius: 3px;
            border-radius: 3px;
    display: -ms-inline-grid;
    display: inline-grid;
    grid-auto-flow: column;
    -ms-grid-columns: 50px;
    grid-template-columns: 50px;
    justify-items: center;
}

.activityData .reply-markdown .markdown{
overflow:hidden!important
}

.activityData .reply-markdown .saveEmbed,
.activityData blockquote span.markdown_spoiler_show,
.activityData blockquote .saveEmbed{
   background: rgb(var(--color-background))
}

#removereply:hover,
#editreply:hover,
.activityData .action:hover,
.activityData .activityLink:hover{
  color: rgb(var(--color-blue))!important;
}

.activityData .saveEmbed b {
    display: -ms-grid;
    display: grid;
    word-break: break-word;
    margin: 3px;
    padding: 10px;
    justify-items: center;
    line-height:18px
}

.activityData .saveEmbed .cover {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  height: 100%;
  width: 100%;
  -webkit-border-top-left-radius: 3px;
          border-top-left-radius: 3px;
  -webkit-border-bottom-left-radius: 3px;
          border-bottom-left-radius: 3px;
}

.saveEmbedDetails {
  font-size: 1rem;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
  color: rgb(var(--color-text-light))!important;
  pointer-events: none;
}

.activityData a,
.activityData a.embedLink a.saveEmbed{
  color: rgb(var(--color-blue));
}
.activityData a[href^="https://anilist.co/manga/"],
.activityData a.embedLink[href^="https://anilist.co/manga/"] a.saveEmbed{
  color: rgb(var(--color-green));
}


.activityDatauserdiv {
  width: 100%;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
}

.activityLink {
  padding-left: 15px;
  height: 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  color: rgba(var(--color-text))!important;
}

.saveActivity {
  -webkit-box-align: center;
      -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
  display: -ms-grid;
  display: grid;
  grid-gap: 8px;
  -ms-grid-columns: 20px 8px 1fr;
  grid-template-columns: 20px 1fr;
  padding: 2px 12px;
  padding-right: 17px;
}

.mainbtn {
  list-style: none;
  cursor: pointer;
  color: rgb(var(--color-text));
}

.mainbtns {
  font: 900 1.3rem Overpass,-apple-system,BlinkMacSystemFont,"Segoe UI",Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  -webkit-transition: .25s;
  -o-transition: .25s;
  transition: .25s;
  border: 0;
  -webkit-border-radius: 4px;
          border-radius: 4px;
  padding: 4px;
  margin: 4px;
  text-align:center;
  cursor: pointer;
  background: rgb(var(--color-background));
  color: rgb(var(--color-text));
}

.btn-active {
  background: #28384d;
  color: #9fadbd;
}

.mainbtns:active {
  background: rgba(40,56,77);
}

.mainbtns:hover {
  color: rgb(var(--color-blue));
}

.maindiv {
  width: 100%;
  -webkit-transition: 1s;
  -o-transition: 1s;
  transition: 1s;
  position: relative;
  background: rgb(var(--color-foreground));
  overflow-y: auto;
  display: -ms-grid;
  display: grid;
  color: rgb(var(--color-text));
  padding: 10px;
  padding-bottom: 0;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #6969694d;
  -webkit-border-radius: 10px;
          border-radius: 10px;
}

.expanded {
  margin-top: 10px;
}

.expanded2 {
    max-height: -webkit-calc(95vh - 100px) !important;
    max-height: calc(95vh - 100px) !important
}

@media (max-width: 1200px) {
  .expanded .activityDataDiv {
  max-height: -webkit-calc(90vh - 65px) !important;
  max-height: calc(90vh - 65px) !important
  }
}

@media (max-width: 980px) {
  .expanded .activityDataDiv {
  max-height: -webkit-calc(90vh - 25px) !important;
  max-height: calc(90vh - 25px) !important
  }
}

@media (max-width: 480px) {
  .expanded .activityDataDiv {
  max-height: -webkit-calc(90vh - 35px) !important;
  max-height: calc(90vh - 35px) !important
  }
}

.ResultDivInside {
  overflow-y: auto;
  -webkit-border-radius: 10px;
          border-radius: 10px;
  padding: 10px;
  padding-top: 20px;
  padding-bottom: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}

.activityDataDiv {
  display: -ms-grid;
  display: grid;
  max-height: -webkit-calc(90vh - 100px);
  max-height: calc(90vh - 100px);
  overflow-y: auto;
  padding-top: 10px;
  margin-top: 3px;
}

@media (max-width: 1200px) {
  .activityDataDiv {
    max-height: -webkit-calc(90vh - 120px);
    max-height: calc(90vh - 120px);
  }
}

@media (max-width: 768px) {
  .activityDataDiv {
    max-height: -webkit-calc(90vh - 80px);
    max-height: calc(90vh - 80px);
  }
}

@media (max-width: 480px) {
  .activityDataDiv {
    max-height: -webkit-calc(90vh - 90px);
    max-height: calc(90vh - 90px);
  }
}

.activityDataDiv .loadMoreButton {
    margin: 10px auto;
    display: block;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    width: 97%;
    text-align: center;
    -webkit-border-radius: 10px;
            border-radius: 10px;
    background: rgb(13 21 34)
}

.ResultDivInside,
.activityDataDiv {
  -webkit-mask-image: -webkit-gradient(linear,left top, left bottom,color-stop(0, transparent),color-stop(black),color-stop(black),to(transparent));
  -webkit-mask-image: linear-gradient(to bottom,transparent 0,black var(--top-mask-size),black -webkit-calc(100% - var(--bottom-mask-size)),transparent 100%);
          mask-image: -webkit-gradient(linear,left top, left bottom,color-stop(0, transparent),color-stop(black),color-stop(black),to(transparent));
          mask-image: linear-gradient(to bottom,transparent 0,black var(--top-mask-size),black calc(100% - var(--bottom-mask-size)),transparent 100%);
  --bottom-mask-size: 10px;
  --top-mask-size: 10px;
}

#settingDiv {
  top:5px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-bottom:5px;
  -ms-grid-columns: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  display: -ms-grid;
  display: grid
}

#settingDiv .settingsText,
#settingDiv #resetDbBtn {
    grid-column: 1 / -1
}

button#removereply,
button#expandbtn,
button#settingsbtn,
button#closedivbtn{
  position: absolute;
  right: 0;
  top:4px;
  background:transparent
}

button#settingsbtn {
  right:20px
}

button#expandbtn {
  right:40px
}

#importBtn{
-moz-text-align-last:center;
     text-align-last:center
}

.reply-wrap .replybutton {
-webkit-box-align: center;
-webkit-align-items: center;
    -ms-flex-align: center;
        align-items: center;
    background: rgb(var(--color-blue));
    -webkit-border-radius: 4px;
            border-radius: 4px;
    color: rgb(var(--color-text-bright));
    cursor: pointer;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    font-family: Overpass,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
    font-size: 1.3rem;
    font-weight: 900;
    margin-left: 18px;
    padding: 10px 15px;
    -webkit-transition: .2s;
    -o-transition: .2s;
    transition: .2s;
}

.reply-wrap .replybutton .cancel {
background: rgb(var(--color-foreground));
    color: rgb(var(--color-text-lighter));
}

.reply-wrap textarea{width: 96%;border-width: 1px;font-size: 1.3rem;padding: 8px 15px;resize: none;min-height: 36px;-webkit-border-radius: 5px;border-radius: 5px;}
#removereply,#editreply{visibility:hidden;-webkit-transition:0.5s;-o-transition:0.5s;transition:0.5s}
.reply-wrap .header:hover #removereply,
.reply-wrap .header:hover #editreply {
    visibility: visible!important;
}
`;

//Add CSS
var styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

//Simple Create Element Shorthand Function
function create(e, t, n) {
  if (!e) throw SyntaxError("'tag' not defined");
  var r,
    i,
    f = document.createElement(e);
  if (t)
    for (r in t)
      if ('style' === r) for (i in t.style) f.style[i] = t.style[i];
      else t[r] && f.setAttribute(r, t[r]);
  return n && (f.innerHTML = n), f;
}

//Create Element Function 2
function create2(t, e, a, s, n) {
  let i = document.createElement(t);
  return (
    Array.isArray(e)
      ? (i.classList.add(...e), e.includes('newTab') && i.setAttribute('target', '_blank'))
      : e && ('#' === e[0] ? (i.id = e.substring(1)) : (i.classList.add(e), 'newTab' === e && i.setAttribute('target', '_blank'))),
    (a || 0 === a) && (i.innerText = a),
    s && s.appendChild && s.appendChild(i),
    n && (i.style.cssText = n),
    i
  );
}

//Set Element Function
function set(t, e, n) {
  if (!t) throw new SyntaxError("'tag' not defined");
  var r,
    i,
    f = t;
  if (e)
    for (r in e)
      if ('style' === r) for (i in e.style) f.style[i] = e.style[i];
      else e[r] && f.setAttribute(r, e[r]);
  return n && (f.innerHTML = n), f;
}

// Improved Element Functions
const ElementPrototype = Element.prototype;
const { hasOwn, setPrototypeOf, isFrozen, getPrototypeOf, getOwnPropertyDescriptor } = Object;
const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');

function lookupGetter(obj, prop) {
  while (obj !== null) {
    const descriptor = getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
      if (descriptor.get) return unapply(descriptor.get);
      if (typeof descriptor.value === 'function') return unapply(descriptor.value);
    }
    obj = getPrototypeOf(obj);
  }
  return (fallbackArg) => {
    console.warn('Fallback value for', fallbackArg);
    return null;
  };
}

function hasOwnPropertyCompat(obj, prop) {
  return hasOwn ? hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop);
}

function unapply(fn) {
  return function (context, ...args) {
    return fn.apply(context, args);
  };
}

// Delay Function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Time Function for Activities
function nativeTimeElement(timestamp) {
  const date = new Date(timestamp * 1000);
  const timeElement = create2('time', 'activitytime');

  timeElement.setAttribute('datetime', date.toISOString());
  timeElement.title = date.toLocaleString();

  const updateTimeText = () => {
    const now = Math.round(Date.now() / 1000);
    let elapsed = now - Math.round(date.getTime() / 1000);

    if (elapsed === 0) {
      timeElement.innerText = 'Now';
    } else if (elapsed === 1) {
      timeElement.innerText = '1 second ago';
    } else if (elapsed < 60) {
      timeElement.innerText = `${elapsed} seconds ago`;
    } else if ((elapsed = Math.floor(elapsed / 60)) === 1) {
      timeElement.innerText = '1 minute ago';
    } else if (elapsed < 60) {
      timeElement.innerText = `${elapsed} minutes ago`;
    } else if ((elapsed = Math.floor(elapsed / 60)) === 1) {
      timeElement.innerText = '1 hour ago';
    } else if (elapsed < 24) {
      timeElement.innerText = `${elapsed} hours ago`;
    } else if ((elapsed = Math.floor(elapsed / 24)) === 1) {
      timeElement.innerText = '1 day ago';
    } else if (elapsed < 7) {
      timeElement.innerText = `${elapsed} days ago`;
    } else if (elapsed < 14) {
      timeElement.innerText = '1 week ago';
    } else if (elapsed < 30) {
      timeElement.innerText = `${Math.floor(elapsed / 7)} weeks ago`;
    } else if (elapsed < 365) {
      const months = Math.floor(elapsed / 30);
      timeElement.innerText = months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(elapsed / 365);
      timeElement.innerText = years === 1 ? '1 year ago' : `${years} years ago`;
    }

    // Schedule next update
    setTimeout(() => {
      if (document.body.contains(timeElement)) updateTimeText();
    }, 20000);
  };

  updateTimeText();
  return timeElement;
}

//Showdown Youtube Extension 1.2.1
//https://github.com/showdownjs/youtube-extension
//Changed some regex codes
!(function (e) {
  'use strict';
  if ('undefined' != typeof showdown) e(showdown);
  else if ('function' == typeof define && define.amd) define(['showdown'], e);
  else {
    if ('object' != typeof exports) throw Error('Could not find showdown library');
    module.exports = e(require('showdown'));
  }
})(function (e) {
  'use strict';
  var t = /(?:<p>)?<img.*?src="(.+?)"(.*?)\/?>(?:<\/p>)?/gi,
    o = /(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?\.)?youtube\.(?:.+?)\/(?:(?:watch\?v=)|(?:embed\/|shorts|))([a-zA-Z0-9_-]{11})/i,
    i = /(?:(?:https?:)?(?:\/\/)?)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    r = /(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?\.)?vimeo.com\/(\d+)/;
  e.extension('youtube', function () {
    return [
      {
        type: 'output',
        filter: function (e, s, n) {
          var l = '<span class="youtube"><iframe src="%1" width="%2" height="%3" frameborder="0" allowfullscreen></iframe></span>';
          return (
            n.smoothLivePreview &&
              (l = n.youtubeUseSimpleImg
                ? '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" width="%2" height="%3">'
                : '<div class="youtube-preview" style="width:%2; height:%3; background-color:#333; position:relative;"><svg version="1.1" xmlns="http://www.w3.org/2000/svg"      width="100" height="70" viewBox="0 0 100 70"     style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">    <defs>      <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">        <stop offset="0%" style="stop-color:rgb(229,45,49);stop-opacity:1" />        <stop offset="100%" style="stop-color:rgb(191,23,29);stop-opacity:1" />      </linearGradient>    </defs>    <rect width="100%" height="100%" rx="26" fill="url(#grad1)"/>    <polygon points="35,20 70,35 35,50" fill="#fff"/>    <polygon points="35,20 70,35 64,37 35,21" fill="#e8e0e0"/></svg><div style="text-align:center; padding-top:10px; color:#fff"><a href="%1">%1</a></div></div>'),
            e.replace(t, function (e, t, s) {
              var d,
                f = (function (e, t) {
                  var o, i, r, s, n;
                  return (
                    (s = t.youtubeWidth ? t.youtubeWidth : 420),
                    (n = t.youtubeHeight ? t.youtubeHeight : 315),
                    e && ((o = (r = /width="(.+?)"/.exec(e)) ? r[1] : s), (i = (r = /height="(.+?)"/.exec(e)) ? r[1] : n)),
                    /^\d+$/gm.exec(o) && (o += 'px'),
                    /^\d+$/gm.exec(i) && (i += 'px'),
                    { width: o, height: i }
                  );
                })(s, n),
                h = '';
              if ((d = i.exec(t)) || (d = o.exec(t))) h = 'https://www.youtube.com/embed/' + d[1] + '?rel=0';
              else {
                if (!(d = r.exec(t))) return e;
                h = 'https://player.vimeo.com/video/' + d[1];
              }
              return l.replace(/%1/g, h).replace('%2', f.width).replace('%3', f.height);
            })
          );
        },
      },
    ];
  });
});

/*! showdown Options. */
showdown.setOption('strikethrough', true);
showdown.setOption('ghMentions', true);
showdown.setOption('emoji', true);
showdown.setOption('tables', true);
showdown.setOption('simpleLineBreaks', true);
showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('noHeaderId', true);
showdown.setOption('omitExtraWLInCodeBlocks', true);
showdown.setOption('ghMentionsLink', 'https://anilist.co/user/{u}/');
showdown.setOption('youtubeHeight', '300px');
showdown.setOption('youtubeWidth', '300px');
showdown.setOption('openLinksInNewWindow', true);
const converter = new showdown.Converter({ extensions: ['youtube'] });

//make HTML
let makeHtml = function (e) {
  let htmlPreserveRegex = /<\/?(h[1-6]|a|p|div|span|b|i|u|center|blockquote|h5|h4)[^>]*>/gi;
  let preservedHtml = [];
  e = e.replace(htmlPreserveRegex, (match) => {
    preservedHtml.push(match);
    return `oWoHTML${preservedHtml.length - 1}oWo`;
  });
  let t = (e = e.replace('----', '---')).split('~~~');
  let r = /img(\d+%?)?\(http.+?\)/gi;
  t = t.map((e) => {
    let t = e.match(r);
    return (
      t &&
        t.forEach((t) => {
          let r = t.match(/^img(\d+%?)?\((http.+?)\)$/i);
          if (r) {
            e = e.replace(
              t,
              `<img width="${r[1] || ''}" src="${r[2]}">`
            );
          }
        }),
      e
    );
  });
  let a = /webm\(http.+?\)/gi;
  t = t.map((e) => {
    let t = e.match(a);
    return (
      t &&
        t.forEach((t) => {
          let r = t.match(/^webm\((http.+?)\)$/i);
          if (r) {
            e = e.replace(
              t,
              `<video src="${r[1]}" controls="true" muted=""></video>`
            );
          }
        }),
      e
    );
  });
  let c = /youtube\(.+?\)/gi;
  t = t.map((e) => {
    let t = e.match(c);
    return (
      t &&
        t.forEach((t) => {
          let r = t.match(/^youtube\((.+?)\)$/i);
          if (r) {
            e = e.replace(t, `<a href="${r[1]}">${r[1]}</a>`);
          }
        }),
      e
    );
  });
  let l = [t[0]];
  let m = false;
  for (let n = 1; n < t.length; n++) {
    l.push(m ? '</center>' : '<center>');
    l.push(t[n]);
    m = !m;
  }
  l = l.map((e) =>
    /~!/.test(e) || /!~/.test(e)
      ? e
          .replace(/~!/g, '<span class="markdown_spoiler">')
          .replace(/!~/g, '</span>')
      : e
  );
  e = l.join('');
  e = e.replace(/oWoHTML(\d+)oWo/g, (match, index) => preservedHtml[index]);
  return converter.makeHtml(e);
};

//Get embed Ids
async function getEmbedIds() {
  var activityEmbedded = false;
  let embeds = document.querySelectorAll('.embedLink');
  let idArray = [];
  let embedArray = [];
  for (let i = 0; i < embeds.length; i++) {
    let activity = embeds[i];
    if (!hasOwn(activity, 'activityEmbedded')) {
      activity.activityEmbedded = true;
      var id = activity.href.split('/')[4];
      if (id !== undefined) {
        idArray.push(id);
        embedArray.push(activity);
      }
    }
  }
  if (idArray.length > 0) {
    await getEmbeds(idArray,embedArray);
    await delay(1000);
  }
}

//Get Embeds
async function getEmbeds(embedIds, activityContainer) {
  const query = `
    query media($ids: [Int!], $page: Int = 1) {
      Page(page: $page) {
        pageInfo {
          hasNextPage
        }
        media(id_in: $ids, isAdult: false) {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
          siteUrl
          type
          format
          status(version: 2)
          averageScore
          popularity
          genres
          season
          seasonYear
          bannerImage
          startDate {
            year
          }
        }
      }
    }
  `;

  const variables = {
    ids: embedIds,
    page: 1,
  };

  try {
    const data = await alQuery(query, variables);
    handleData(data);
  } catch (error) {
    console.error("Error fetching anime data:", error);
  }

  function handleData(data) {
    const mediaList = data.data.Page.media;
    mediaList.sort((a, b) => {
      const indexA = embedIds.indexOf(String(a.id));
      const indexB = embedIds.indexOf(String(b.id));
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    mediaList.forEach((media,index) => {
      let activitySave = create(
        'a',
        {
          class: 'saveEmbed',
        },
        `<b>${media.title.userPreferred}</b>`
      );

      let embedImg = create('a', {
        class: 'cover',
        style: {
          backgroundImage: `url(${media.coverImage.large})`,
        },
      });

      activityContainer[index].append(activitySave);
      activitySave.href = media.siteUrl || "#";

      activitySave.insertBefore(embedImg, activitySave.children[0]);

      const avg = media.averageScore !== null ? ` · ${media.averageScore}%` : '';
      const season = media.season !== null ? ` · ${media.season} ${media.seasonYear}`: '';

      let activitySaveDetails = create('a', {class: 'saveEmbedDetails',});
      if (media.type === 'MANGA') {
        activitySaveDetails.innerHTML = `<b>${media.format} · ${media.status} · ${media.startDate.year}${avg}</b>`;
      } else if (media.format === 'MUSIC') {
        activitySaveDetails.innerHTML = `<b>${media.format} · ${media.endDate?.year || ''}${avg}</b>`;
      } else {
        activitySaveDetails.innerHTML = `<b>${media.format}${season} · ${media.status}${avg}</b>`;
      }

      embedImg.nextSibling?.append(activitySaveDetails);

      // Fix underscores in text
      let fixedText = activitySaveDetails.text.replace(/_/g, ' ');
      activitySaveDetails.text = fixedText;
    });
  }
}

//Fix spoilers
async function getSpoilers() {
    var actspoiled = false;
    let actspoiler = document.querySelectorAll('.activityData span.markdown_spoiler');
    actspoiler.forEach(function (spoilers) {
      if (!hasOwn(spoilers, 'actspoiled')) {
        spoilers.actspoiled = true;
        let contspoiler = create('span', {
          class: 'markdown_spoiler_cont',
        });
        let showspoiler = create('span', {
          class: 'markdown_spoiler_show',
        });
        showspoiler.innerHTML = 'Spoiler, click to view';
        contspoiler.innerHTML = spoilers.innerHTML;
        contspoiler.style.display = 'none';
        spoilers.innerHTML = '';
        spoilers.insertBefore(showspoiler, spoilers.children[0]);
        spoilers.append(contspoiler);
        showspoiler.onclick = function () {
          if (contspoiler.style.display === 'none') {
            showspoiler.innerHTML = 'Hide';
            contspoiler.style.display = 'block';
          } else {
            showspoiler.innerHTML = 'Spoiler, click to view';
            contspoiler.style.display = 'none';
          }
        };
      }
    });
  }

async function processMarkdown(inputText) {
  const httpRegex = /https?:\/\/[^\s]+(?=\s|$)/g;
    const links = [];
  const tempText = inputText.replace(httpRegex, (match) => {
    links.push(match);
    return `oWoLINKTEMP${links.length - 1}oWo`;
  });
    const processedText = tempText
    .replace(/(?<=[^*]|^)\*\*\*([^*].*?[^*]*)\*\*\*/gm, '<strong><em>' + '$1' + '</em></strong>')
    .replace(/(?<=[^*]|^)\*\*([^*].*?[^*]*)\*\*/gm, '<strong>' + '$1' + '</strong>')
    .replace(/(?<=[^*]|^)\*([^*].*?[^*]*)\*/gm, '<em>' + '$1' + '</em>')
    .replace(/(?<=[^_]|^)_{3,}([^_].*?[^\n]*)/g, '<hr>' + '$1')
    .replace(/(?<=[^_]|^)__([^_].*?[^_]*)__/gm, '<strong>' + '$1' + '</strong>')
    .replace(/(?<=[^_]|^)_([^_].*?[^_]*)_/gm, '<i>' + '$1' + '</i>')
    .replace(/^(?<=[^#]|^)#####([^#\n].*?[^\n]*)/gm, '<h5>' + '$1' + '</h5>')
    .replace(/^(?<=[^#]|^)####([^#\n].*?[^\n]*)/gm, '<h4>' + '$1' + '</h4>')
    .replace(/^(?<=[^#]|^)###([^#\n].*?[^\n]*)/gm, '<h3>' + '$1' + '</h3>')
    .replace(/^(?<=[^#]|^)##([^#\n].*?[^\n]*)/gm, '<h2>' + '$1' + '</h2>')
    .replace(/^(?<=[^#]|^)#([^#\n].*?[^\n]*)/gm, '<h1>' + '$1' + '</h1>')
    .replace(/(?<=[^`]|^)\`([^`].*?[^`]*)\`/gm, '<code>' + '$1' + '</code>');

    const finalText = processedText.replace(/oWoLINKTEMP(\d+)oWo/g, (_, index) => links[index])
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">' + '$1' + '</a>')
    .replace(/\[(.+?)\]\(\)/g, '<a>' + '$1' + '</a>')
    .replace(/(?<=[^~]|^)\~\~([^~].*?[^~]*)\~\~/gm, '<del>' + '$1' + '</del>')
    .replace(/youtube\(+((?!https:).*).*\)/gim, ' youtube(https://www.youtube.com/watch?v=$1)')
    .replace(/youtube.(h).((.*?)\))/gi, ' ![](ht$2')
    .replace(/(?<!\(|"|=)\b((https:\/\/)(anilist\.co\/(anime|manga)\/)([0-9]+)).([^\W]+.*?\/|[^\s\~\_]+)/gm,'<a class="embedLink" target= "_blank" href="$1/"></a>')
    .replace(/^(?!>|#)\n/gm, '\n\n');
    return finalText;
}


// Optimize HTML Saved Activity
async function actHTMLFix(text) {
  let actFixedText = '';
  const actTextToFix = await processMarkdown(text);
  const sanitizedText = DOMPurify.sanitize(actTextToFix);
  actFixedText = await makeHtml(actTextToFix);
  actFixedText = actFixedText
    .replace(/\n/gm, '<br>')
    .replace(/(\<br\>\s*){2,99}/gm, '<br>')
    .replace(/\<br \/\>/gm,'')
    .replace(/<\/p><br>/gm, '</p>\n')
    .replace(/<br><p>/gm, '<p>\n')
    .replace(/<blockquote><br>/, '<blockquote>');
  return actFixedText;
}

//Anilist Query
const requestQueue = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) {
    return;
  }

  isProcessing = true;

  while (requestQueue.length > 0) {
    const { query, variables, options, resolve, reject } = requestQueue.shift();

    try {
      const result = await alQueryInternal(query, variables, options);
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Delay between requests
    await delay(1000);
  }

  isProcessing = false;
}

async function alQueryInternal(query, variables, options = {}) {
  const maxRetries = 3;

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers, // Merge any additional headers
    },
    body: JSON.stringify({ query, variables }),
  };

  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch("https://graphql.anilist.co", fetchOptions);

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // More reasonable default
      console.warn(
        `Rate limit exceeded. Retrying after ${waitTime / 1000} seconds.`
      );
      await delay(waitTime);
      continue;
    } else if (!response.ok) {
      if (response.status === 404 ) {
        await removeActivity(variables.id);
        await removeActivity(variables.id,'likeHistory');
      } else {
        throw new Error(
          `Error: ${response.status} ${response.statusText} (query: ${query}, variables: ${JSON.stringify(
            variables
          )})`
        );
      }
    } else {
      return response.json();
    }
  }
}

function alQuery(query, variables, options = {}) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ query, variables, options, resolve, reject });
    processQueue();
  });
}


// Anilist - AuthAPIQuery
let API_LIMIT = 90;
let apiCallsUsed = 0;
let apiCallsUsedShortTerm = 0;
const pending = {};

// Reset API call counters periodically
const resetApiCalls = () => (apiCallsUsed = 0);
const resetApiCallsShortTerm = () => (apiCallsUsedShortTerm = 0);
setInterval(resetApiCalls, 60000); // Reset every 60 seconds
setInterval(resetApiCallsShortTerm, 10000); // Reset every 10 seconds

// Handle API response
const handleResponse = async (response) => {
  apiCallsUsed = (API_LIMIT = response.headers.get("x-ratelimit-limit")) - response.headers.get("x-ratelimit-remaining");
  try {
    const data = await response.json();
    return response.ok ? data : Promise.reject(data);
  } catch (error) {
    console.warn("Error parsing response: ", error, response);
    throw error;
  }
};

// Perform authenticated API call
function authAPIcall(query, variables, callback, cacheKey, timeFresh, useLocalStorage, overwriteCache, oldCallback) {
  if (!accessToken) return;

  // Check rate limits
  if (apiCallsUsedShortTerm > 18 || apiCallsUsed > API_LIMIT - 2) {
    setTimeout(() => {
      authAPIcall(query, variables, callback, cacheKey, timeFresh, useLocalStorage, overwriteCache, oldCallback);
    }, 2000);
    return;
  }

  // Cache handling
  if (cacheKey) {
    const storage = useLocalStorage ? localStorage : sessionStorage;
    const cachedData = JSON.parse(storage.getItem(cacheKey));

    if (cachedData) {
      const isFresh = !cachedData.duration || NOW() < cachedData.time + cachedData.duration;
      if (isFresh && !overwriteCache) {
        callback(cachedData.data, variables);
        return;
      }

      if (oldCallback) oldCallback(cachedData.data, variables);
      storage.removeItem(cacheKey);
    }
  }

  // Success handler
  const handleSuccess = (data, error = null) => {
    callback(data, variables, error);
    if (cacheKey) {
      const storage = useLocalStorage ? localStorage : sessionStorage;
      const cachedEntry = JSON.stringify({ data, time: NOW(), duration: timeFresh });
      storage.setItem(cacheKey, cachedEntry);
    }
  };

  // Request setup
  const requestConfig = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };

  // Error handler
  const handleError = (errorResponse) => {
    if (errorResponse.status === 429) {
      // API rate limit exceeded, retry after specified time
      const retryAfter = errorResponse.headers.get("Retry-After");
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // Default to 60 seconds
      console.warn(`Rate limit exceeded. Retrying after ${waitTime / 1000} seconds.`);
      setTimeout(() => {
        authAPIcall(query, variables, callback, cacheKey, timeFresh, useLocalStorage, overwriteCache, oldCallback);
      }, waitTime);
      return;
    }

    console.error("Error: ", errorResponse);

    // Handle expired token
    if (errorResponse.errors?.some((err) => err.message === "Invalid token")) {
      const loginLink = create(
        "a",
        {
          class: "mainbtns",
          id: "signIn",
          href: "https://anilist.co/api/v2/oauth/authorize?client_id=12455&response_type=token",
        },
        "<b>Error: Expired Token. Click here to renew token.</b>"
      );
      listDiv2.insertBefore(loginLink, listDiv2.children[1]);
      accessToken = "";
      localStorage.setItem("savetkn", accessToken);
      return;
    }

    if (query.includes("mutation")) {
      callback(errorResponse.errors);
    } else {
      handleSuccess(null, errorResponse);
    }
  };

  // Execute fetch request
  fetch("https://graphql.anilist.co", requestConfig)
    .then(handleResponse)
    .then((data) => handleSuccess(data))
    .catch(handleError);

  // Update API call counters
  apiCallsUsed++;
  apiCallsUsedShortTerm++;
}
//SVG
const svgns = 'http://www.w3.org/2000/svg',
  svgShape = function (e, t, a, c, r) {
    e = e || 'g';
    let l = document.createElementNS('http://www.w3.org/2000/svg', e);
    return (
      Object.keys(a || {}).forEach((e) => {
        l.setAttributeNS(null, e, a[e]);
      }),
      r && l.appendChild(document.createTextNode(r)),
      t && t.appendChild(l),
      (c || []).forEach((e) => {
        e.element ? svgShape(e.element, l, e.attributes, e.children, e.content) : l.appendChild(e);
      }),
      l
    );
  },
  svg = {};
[
  {
    name: 'pinned',
    shape: {
      element: 'svg',
      attributes: {
        focusable: 'false',
        'data-prefix': 'fas',
        'data-icon': 'thumbtack',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 384 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
        'aria-hidden': 'true',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z',
          },
        },
      ],
    },
  },
  {
    name: 'likeNative',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'heart',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 512 512',
        class: 'svg-inline--fa fa-heart fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z',
          },
        },
      ],
    },
  },
  {
    name: 'reply',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'comments',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 576 512',
        class: 'svg-inline--fa fa-comments fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z',
          },
        },
      ],
    },
  },
  {
    name: 'expand',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'expand',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 448 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z',
          },
        },
      ],
    },
  },
  {
    name: 'compress',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'compress',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 448 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z',
          },
        },
      ],
    },
  },
  {
    name: 'link',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'link',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 512 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z',
          },
        },
      ],
    },
  },
  {
    name: 'xmark',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'link',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 55 400 400',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z',
          },
        },
      ],
    },
  },
  {
    name: 'gear',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'link',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 512 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z',
          },
        },
      ],
    },
  },
  {
    name: 'edit',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'link',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 512 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z',
          },
        },
      ],
    },
  },
  {
    name: 'cross',
    shape: {
      element: 'svg',
      attributes: {
        'aria-hidden': 'true',
        'data-prefix': 'fas',
        'data-icon': 'cross',
        role: 'img',
        xmls: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 448 512',
        class: 'svg-inline--fa fa-link fa-w-16 fa-sm',
      },
      children: [
        {
          element: 'path',
          attributes: {
            fill: 'currentColor',
            d: 'M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z',
          },
        },
      ],
    },
  },
].forEach((e) => {
  svg[e.name] = svgShape(e.shape.element, !1, e.shape.attributes, e.shape.children, e.shape.content);
});

//MAIN
let auth;
let user = '';
let userid = 0;
try {
  auth = JSON.parse(localStorage.getItem('auth'));
} catch (e) {
  console.warn('could not get auth');
}
if (auth) (user = auth.name), (userid = auth.id);
else
  try {
    user = document.querySelector(".nav .links .link[href^='/user/']").href.match(/\/user\/(.*)\//)[1];
  } catch (e) {
    alert('Please login before to use -Activity Saver- script.');
  }

//Variables
let username = String(user);
let usernameurl = String('https://anilist.co/user/' + user + '/');
var val = 0;
let currentIndex = 0;
const itemsPerLoad = 2;
var active = false;
var mainArray = [];
var likeArray = [];
let likeHistory = false;
let onMainDiv = false;
var autosave = false;
var expanded = false;
var settings = false;
var autosaveLikes = false;
var canRemoveActivity = true;
var isLoading = false;
var oldHref = document.location.href;
interval = null;
var button = create('li',{class: 'el-dropdown-menu__item mainbtn',id: 'Saved Activities',},'Saved Activities');
var button2 = create('li',{class: 'el-dropdown-menu__item mainbtn',id: 'History',},'Like History');
const loadMoreButton = create("a", {class: "loadMoreButton"}, "Load More");

//Button onclicks
loadMoreButton.addEventListener("click", async () => {
  if(loadMoreButton.textContent === "Load More") {
    loadMoreButton.textContent = "Loading...";
    canRemoveActivity = false;
    await loadActivities();
    await delay(500);
    loadMoreButton.textContent = "Load More";
    canRemoveActivity = true;
  }
});
button.onclick = () => {
  if (!isLoading) {
    isLoading = true;
    likeArray = [];
    likeHistory = false;
    currentIndex = 0;
    getSavedDiv(button);
  }
};
button2.onclick = async () => {
  if (!isLoading) {
    isLoading = true;
    currentIndex = 0;
    likeArray = await mainDB.getItem('likeHistory') || [];
    likeHistory = true;
    if(likeArray.length > 0) getSavedDiv(button2);
  }
};

var accessToken = '';
// Check Token Function
function checkToken() {
  let currentURL = '';
  const mainLoop = setInterval(() => {
    if (document.URL !== currentURL) {
      currentURL = document.URL;
      // Check if the URL contains the access token
      if (/^https:\/\/anilist\.co\/home#access_token/.test(currentURL)) {
        const tokenList = location.hash.split('&').map(param => param.split('='));
        accessToken = tokenList[0][1];
        // Save the token to local storage
        localStorage.setItem('savetkn', LZString.compressToBase64(JSON.stringify(accessToken)));
        // Redirect to the base URL to remove the access_token from the hash
        location.replace(`${location.protocol}//${location.hostname}${location.pathname}`);
      }
    }
  }, 200);
}
checkToken();

// Check Local Storage for Token
function loadTokenFromLocalStorage() {
  const savedToken = localStorage.getItem('savetkn');
  if (savedToken) {
    const decompressedToken = LZString.decompressFromBase64(savedToken);
    if (decompressedToken && decompressedToken.length > 10) {
      accessToken = JSON.parse(decompressedToken);
    } else {
      localStorage.removeItem('savetkn');
    }
  }
}
loadTokenFromLocalStorage();

//LocalForage DB
 let mainDB = localforage.createInstance({ name: "Anilist-Activity-Saver", storeName: "main" });

//Add Buttons to Filters
function addToFilters() {
  if (!/^\/home\/?([\w-]+)?\/?$/.test(location.pathname)) {
    return;
  }
  const checkForFilters = () => {
    const filters = document.querySelector('.el-dropdown-menu:not(.details *):not(.time *):not(.actions *)');

    if (!filters) {
      setTimeout(checkForFilters, 100);
      return;
    }

    if (filters.children[0].innerText.trim() === 'All') {
      filters.append(button, button2);
      set(button, { class: 'el-dropdown-menu__item' });
      set(button2, { class: 'el-dropdown-menu__item' });
    }
  };
  checkForFilters();
  const autosaved = JSON.parse(localStorage.getItem('actautosave'));
  const autosaveEnabled = autosaved && accessToken.length > 5;
  if (autosaved && accessToken.length > 5) {
    autosave = true;
  } else {
    autosave = false;
  }
  addSavetoActivities();
}
addToFilters();

//Build Activities
let activitiesArray = '';
async function buildActivity() {
  let activityDataDiv = document.getElementById('activityDataDiv');
  let savedActivities = await mainDB.getItem('savedActivities');
  if(savedActivities) {
    const filteredData = savedActivities.filter(item => item !== '');
    mainDB.setItem('savedActivities', filteredData);
  }
  if (activityDataDiv) {
    activityDataDiv.innerHTML = '';
  }

  if (autosave) {
    await autoSaveActivity();
    await buildActivities();
  } else {
    if (savedActivities !== null) {
      activitiesArray = savedActivities;
      await buildActivities();
    }
  }
  isLoading = false;
}

async function buildActivities() {
  let mainActDiv = document.querySelector("#activityDataDiv");
  const listLoading = create("div", {
    class: "listLoading",
    style: {
      position: 'absolute',
      fontSize: '16px',
      MsGridColumnAlign: 'center',
      justifySelf: 'center',
      WebkitAlignSelf: 'center',
      MsFlexItemAlign: 'center',
      MsGridRowAlign: 'center',
      alignSelf: 'center',
    },
  }, "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>');

  mainActDiv.style.opacity = 0;
  document.querySelector("#activityDataDiv").parentElement.append(listLoading);

  // İlk 5 aktiviteyi yükle
  await loadActivities();

  mainActDiv.style.opacity = 1;
  listLoading.remove();
}

//Load Activities
async function loadActivities() {
  const endIndex = currentIndex + itemsPerLoad;
  let arr = likeArray.length > 0 ? likeArray : activitiesArray;
  const currentBatch = arr.slice(currentIndex, endIndex);
  for (let activityId of currentBatch) {
    await delay(500);
    await getActivity(activityId);
  }
  currentIndex = endIndex;
  if (currentIndex >= arr.length) {
    loadMoreButton.remove();
  } else {
    document.querySelector("#activityDataDiv").append(loadMoreButton);
  }
}

//AutoSave Function
async function autoSaveActivity(opt) {
  if (autosave && accessToken.length > 5) {
    canRemoveActivity = false;
    let userAboutData = '';
    let activitiesIdArray = await mainDB.getItem('savedActivities');
    const query = `query($userName: String) { User(name: $userName) { about } }`;
    const variables = {userName: username,};
    await alQuery(query, variables).then( await checkAbout);
    async function checkAbout(data) {
      userAboutData = data.data.User.about;
      let jsonMatch = (userAboutData || '').match(/(\[\]\(actjson)([A-Za-z0-9+\/=]+)(\))/);
      if (jsonMatch) {
        jsonMatch = jsonMatch[0].replace(/(\[\]\(actjson)([A-Za-z0-9+\/=]+)(\))/, '$2');
        let decompressedData = JSON.parse(LZString.decompressFromBase64(jsonMatch));
        let values = Object.values(decompressedData);
        let apiArray = JSON.stringify(values).replace(/\\*"|\[|\]/g, '').split(/[.,!?]/);
        if (!opt && apiArray.length > 0 && (!activitiesIdArray || activitiesIdArray.length < 1)) {
          await mainDB.setItem('savedActivities', apiArray);
        }
        if(opt) {
          await updateAbout();
        }
      }
      if (activitiesIdArray && activitiesIdArray.length > 0) {
        await updateAbout();
        activitiesArray = JSON.stringify(activitiesIdArray).replace(/\\*"|\[|\]/g, '').split(/[.,!,?]/);
      }
      canRemoveActivity = true;
    }

    async function updateAbout(data) {
      let jsonMatch = userAboutData.match(/(\[\]\(actjson)([A-Za-z0-9+\/=]+)(\))/);
      let customcssmatch = userAboutData.match(/\[\]\(json([A-Za-z0-9+\/=]+)\)/);
      let customcssmatched = customcssmatch ? customcssmatch[0] : '';
      activitiesIdArray = JSON.stringify(activitiesIdArray);
      let profileJson = { activitiesIdArray };
      let base64Data = LZString.compressToBase64(JSON.stringify(profileJson));
      let newDescription = '';

      if (jsonMatch) {
        userAboutData = userAboutData.replace(customcssmatched, '');
        newDescription = customcssmatched + userAboutData.replace(/(\[\]\(actjson)([A-Za-z0-9+/=]+)(\))/,'$1' + base64Data + '$3');
      } else {
        if (customcssmatched) {
          userAboutData = userAboutData.replace(customcssmatched, '');
          newDescription = userAboutData.replace(customcssmatched, customcssmatched + '[](actjson' + base64Data + ')');
        } else {
          newDescription = '[](actjson' + base64Data + ')' + userAboutData;
        }
      }

      await authAPIcall(`mutation($about: String) { UpdateUser(about: $about) { about } }`,{ about: newDescription },function (data) {
        if (!data) {
          console.error('Failed to update user data.');
          return;
          }
        }
      );
    }
  }
}


//Save Activity Button Function
function addSavetoActivities(type) {
  let ActivitySave = false;

  if (!/^\/(home|user|activity)\/?([\w-]+)?\/?$/.test(location.pathname)) {
    return;
  }

  setTimeout(addSavetoActivities, 500);
  let activityCollection = document.querySelectorAll('.activity-extras-dropdown');
  activityCollection.forEach(function (activity) {
    if (!hasOwn(activity, 'ActivitySave')) {
      activity.ActivitySave = true;
      let activitySave = create(
        'a',
        {
          dataIcon: 'link',
          class: 'saveActivity el-dropdown-menu__item',
          id: 'saveActivity',
        },
        '<b>Save Activity</b>',
      );

      activitySave.onclick = async function () {
        let el = activitySave;
        let id = el.parentElement.children[0].href.split('/')[4];

        el.click();
        el.click();
        el.onclick = async () => {
          el.lastElementChild.innerText = 'Saved!';
          let activitiesIdArray = await mainDB.getItem('savedActivities');
          if(!Array.isArray(activitiesIdArray)) {
            await mainDB.setItem('savedActivities', []);
          }
          let mainArray = activitiesIdArray ? activitiesIdArray : [];
          if (mainArray.includes(id)) {
            el.lastElementChild.innerText = 'Already Saved!';
            return;
          }
          mainArray.push(id);
          await mainDB.setItem('savedActivities', mainArray);
          let activityDataDiv = document.getElementById('activityDataDiv');
            if (activityDataDiv) {
              buildActivity();
          }
        };
      };

      if (activity.closest('.activity-text') || activity.closest('.activity-message')) {
        activity.append(activitySave);
        activitySave.insertBefore(svg.pinned.cloneNode(true), activitySave.children[0]);
      }
    }
  });

  let likeButtonCollection = document.querySelectorAll('.activity-text .actions .button');
  likeButtonCollection.forEach((button) => {
    if (!hasOwn(button, 'ActivityHistory')) {
      button.ActivityHistory = true;
      button.addEventListener('click', async function () {
        try {
          const buttonId = button.getAttribute('id');
          const isMainDiv = $(this).attr('mainDiv');
          const id = buttonId ? buttonId : $(this).closest('.activity-text').find('.el-dropdown-menu__item:contains("Direct Link")')?.attr('href').split('/')[2];
          let isLiked = $(this).hasClass('liked');
          if (isMainDiv) {
            isLiked = !isLiked;
          }
          if (!id) {
            return;
          } else {
           button.setAttribute('id', id);
          }
          let mainArray = await mainDB.getItem('likeHistory') || [];
          if(!Array.isArray(mainArray)) {
            await mainDB.setItem('likeHistory', []);
          }
          if (mainArray.includes(id)) {
            if (isLiked) {
              if (typeof mainArray === "string") {
                mainArray = JSON.parse(mainArray);
              }
              mainArray = mainArray.map(item => String(item).trim());
              // Find and remove the ID
              const index = mainArray.indexOf(id);
              if (index !== -1) {
                mainArray.splice(index, 1);
              }
              // Update the mainArray and save back to the database
              mainArray = mainArray;
              await mainDB.setItem("likeHistory", mainArray);
            }
            return;
          }
          mainArray = [id, ...mainArray];
          await mainDB.setItem('likeHistory', mainArray);
        } catch (error) {
          console.error('An error occurred while saving liked activity', error);
        }
      });
    };
  });
}

//Create Main Div
function creatediv(btn) {
  btn.setAttribute('class', 'el-dropdown-menu__item active');
  var listDiv2 = create(
    'div',
    {
      class: 'maindiv',
      id: 'listDiv2',
    },
    '<b>' + btn.innerText + '</b>',
  );
  let expandbtn = create('button', {
    class: 'mainbtns',
    id: 'expandbtn',
  });
  let settingsbtn = create('button', {
    class: 'mainbtns',
    id: 'settingsbtn',
  });
  let closebtn = create('button', {
    class: 'mainbtns',
    id: 'closedivbtn',
  });
  expandbtn.insertBefore(svg.expand.cloneNode(true), expandbtn.children[0]);
  settingsbtn.insertBefore(svg.gear.cloneNode(true), settingsbtn.children[0]);
  closebtn.insertBefore(svg.xmark.cloneNode(true), closebtn.children[0]);
  expandbtn.onclick = () => {
    expandDiv();
  };
  settingsbtn.onclick = () => {
    settingsDiv();
  };
  closebtn.onclick = () => {
    closeDiv();
  };
  var list = document.querySelector('.activity-feed-wrap + div');
  listDiv2.append(expandbtn, settingsbtn, closebtn);
  list.insertBefore(listDiv2, list.children[0]);
  var activityDataDiv = create('div', {
    class: 'activityDataDiv',
    id: 'activityDataDiv',
  });
  listDiv2.appendChild(activityDataDiv);
  if (!accessToken) {
    let loginLink = create(
      'a',
      {
        class: 'mainbtns',
        id: 'signIn',
        href: 'https://anilist.co/api/v2/oauth/authorize?client_id=12455&response_type=token',
      },
      '<b>Sign In</b>',
    );
    listDiv2.insertBefore(loginLink, listDiv2.children[1]);
  }
}

//Export Activities
function saveAs(data, fileName, pureText) {
  let link = create2('a');
  document.body.appendChild(link);
  let json = pureText ? data : JSON.stringify(data);
  let blob = new Blob([json], {
    type: 'octet/stream',
  });
  let url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

//Settings Div
function settingsDiv() {
  settings = !settings;
  if (settings) {
    let settingDiv = create('div', {class: 'maindiv', id: 'settingDiv', }, '<b class="settingsText">Settings</b>');
    let importBtn = create('input', {class: 'mainbtns', id: 'importBtn', type: 'button', value: 'Import Saved Activites'});
    let exportBtn = create('a', {class: 'mainbtns', id: 'exportBtn',},'<b>Export Saved Activites</b>');
    let exportHistoryBtn = create('a', {class: 'mainbtns', id: 'exportHistoryBtn',},'<b>Export Like History</b>');
    let importHistoryBtn = create('input', {class: 'mainbtns', id: 'importHistoryBtn', type: 'button', value: 'Import Like History'});
    let clearHistoryBtn = create('a', {class: 'mainbtns', id: 'clearHistoryBtn',},'<b>Clear Like History</b>');
    let autoSaveBtn = create('a', {class: 'mainbtns', id: 'autoSaveBtn',},'<b>Auto Backup Activities to Profile</b>');
    let resetDbBtn = create('a', {class: 'mainbtns', id: 'resetDbBtn',},'<b>Reset Databases</b>');

    //Export Saved Activities Button Onclick
    exportBtn.onclick = async function () {
    let savedArray = await mainDB.getItem('savedActivities');
      let export_activities = '[](actjson' + LZString.compressToBase64(JSON.stringify(savedArray)) + ')';
      if (username && savedArray !== null && savedArray.length > 0) {
        saveAs(export_activities, 'ActivityBookmark' + '_SavedActivities_' + username + '.json');
      } else {
        exportBtn.innerText = 'Error: The list is empty.';
        delay(3000).then(() => {
          exportBtn.innerText = 'Export Saved Activities';
        });
      }
    };

    //Import Saved Activities Button Onclick
    importBtn.onclick = async function () {
      importBtn.setAttribute('type', 'file');
      importBtn.setAttribute('name', 'json');
      importBtn.setAttribute('accept', 'application/json');

      importBtn.oninput = async function () {
        let reader = new FileReader();
        reader.readAsText(importBtn.files[0], 'UTF-8');

        reader.onload = async function (evt) {
          let fileContent = '';
          try {
            fileContent = JSON.parse(evt.target.result);
            let compressedDataMatch = fileContent.match(/\[\]\(actjson([A-Za-z0-9+\/=]+)\)/);

            if (compressedDataMatch && fileContent !== '[](actjsonETI=)') {
              let base64Data = compressedDataMatch[1];
              let decompressedData = LZString.decompressFromBase64(base64Data);
              let activitiesArray = JSON.parse(decompressedData);
              let processedActivities = activitiesArray.map(activity => activity.trim()).filter(activity => activity.length > 0);
              // Save the processed activities in localForage
              await mainDB.setItem('savedActivities', processedActivities);
            } else {
              resetImportButton('Error: not valid backup file.');
              return;
            }

            if (autosave) {
              if (activityDataDiv) {
                await buildActivity();
              }
            }
            resetImportButton('Activities Imported!');
            buildActivity();
          } catch (e) {
            resetImportButton('Error: not valid backup file.');
          }
        };
      };

      // Helper function to reset the import button to its default state
      function resetImportButton(message) {
        importBtn.setAttribute('type', 'button');
        importBtn.removeAttribute('accept');
        importBtn.removeAttribute('name');
        importBtn.value = message;
        delay(3000).then(() => (importBtn.value = 'Import Saved Activities'));
      }
    };

    //Export History Button Onclick
    exportHistoryBtn.onclick = async function () {
    let savedArray = await mainDB.getItem('likeHistory');
      let export_activities = '[](actjson' + LZString.compressToBase64(JSON.stringify(savedArray)) + ')';
      if (username && savedArray !== null && savedArray.length > 0) {
        saveAs(export_activities, 'ActivityBookmark' + '_LikeHistory_' + username + '.json');
      } else {
        exportHistoryBtn.innerText = 'Error: The list is empty.';
        delay(3000).then(() => {
          exportHistoryBtn.innerText = 'Export Like History';
        });
      }
    };

    //Import History Button Onclick
    importHistoryBtn.onclick = async function () {
      importHistoryBtn.setAttribute('type', 'file');
      importHistoryBtn.setAttribute('name', 'json');
      importHistoryBtn.setAttribute('accept', 'application/json');
      importHistoryBtn.oninput = async function () {
        let reader = new FileReader();
        reader.readAsText(importHistoryBtn.files[0], 'UTF-8');
        reader.onload = async function (evt) {
          let fileContent = '';
          try {
            fileContent = JSON.parse(evt.target.result);
            let compressedDataMatch = fileContent.match(/\[\]\(actjson([A-Za-z0-9+\/=]+)\)/);
            if (compressedDataMatch && fileContent !== '[](actjsonETI=)') {
              let base64Data = compressedDataMatch[1];
              let decompressedData = LZString.decompressFromBase64(base64Data);
              let activitiesArray = JSON.parse(decompressedData);
              let processedActivities = activitiesArray.map(activity => activity.trim()).filter(activity => activity.length > 0);
              // Save the processed activities in localForage
              await mainDB.setItem('likeHistory', processedActivities);
            } else {
              resetImportButton('Error: not valid backup file.');
              return;
            }
            resetImportButton('Like History Imported!');
            buildActivity();
          } catch (e) {
            resetImportButton('Error: not valid backup file.');
          }
        };
      };

      // Helper function to reset the import button to its default state
      function resetImportButton(message) {
        importHistoryBtn.setAttribute('type', 'button');
        importHistoryBtn.removeAttribute('accept');
        importHistoryBtn.removeAttribute('name');
        importHistoryBtn.value = message;
        delay(3000).then(() => (importHistoryBtn.value = 'Import Like History'));
      }
    };

    //autoSave Button Onclick
    autoSaveBtn.classList.toggle('btn-active', JSON.parse(localStorage.getItem('actautosave')));
    if (accessToken.length < 5) {
      localStorage.setItem('actautosave', autosave);
      autoSaveBtn.classList.toggle('btn-active', JSON.parse(localStorage.getItem('actautosave')));
    }
    autoSaveBtn.onclick = async function () {
      if (accessToken.length > 5) {
        await autoSaveActivity();
        autosave = !autosave;
        localStorage.setItem('actautosave', autosave);
        SavetoBtn.classList.toggle('btn-active', JSON.parse(localStorage.getItem('actautosave')));
      } else {
        SavetoBtn.innerText = 'Error: Token not found. Please Sign in.';
        delay(3000).then(() => (SavetoBtn.innerText = 'Auto Backup Activities to Profile'));
      }
    };

    //Clear History Button Onclick
    let confirmation = 0;
    clearHistoryBtn.onclick = async function () {
      confirmation++;
      if (confirmation == 1) {
        clearHistoryBtn.innerHTML = '<b style="color: #e85d75;">Clear Like History (CONFIRM)</b>';
      }
      if (confirmation == 2) {
        await mainDB.setItem('likeHistory', []);
        clearHistoryBtn.innerHTML = '<b>Like History Deleted!</b>';
        await delay(2000);
        clearHistoryBtn.innerHTML = '<b>Clear Like History</b>';
        confirmation = 0;
      }
    };
    //Reset Databases Button Onclick
    let resetConfirmation = 0;
    resetDbBtn.onclick = async function () {
      resetConfirmation++;
      if (resetConfirmation == 1) {
        resetDbBtn.innerHTML = '<b style="color: #e85d75;">Reset Databases (CONFIRM)</b>';
      }
      if (resetConfirmation == 2) {
        await mainDB.setItem('likeHistory', []);
        await mainDB.setItem('savedActivities', []);
        resetDbBtn.innerHTML = '<b>The databases have been reset!</b>';
        await delay(2000);
        resetDbBtn.innerHTML = '<b>Reset Databases</b>';
        resetConfirmation = 0;
      }
    };
    listDiv2.insertBefore(settingDiv, listDiv2.children[1]);
    settingDiv.append(importBtn, importHistoryBtn, exportBtn, exportHistoryBtn, autoSaveBtn, clearHistoryBtn, resetDbBtn);
  } else {
    if (document.getElementById('settingDiv')) {
      document.getElementById('settingDiv').remove();
    }
  }
}

//Expand Button Function
function expandDiv() {
  expanded = !expanded;
  if (expanded) {
    let x = document.querySelector('.container');
    x.insertBefore(listDiv2, x.children[0]);
    expandbtn.innerHTML = '';
    expandbtn.insertBefore(svg.compress.cloneNode(true), expandbtn.children[0]);
    listDiv2.setAttribute('class', 'maindiv expanded');
    activityDataDiv.setAttribute('class', 'activityDataDiv expanded2');
  } else {
    let x = document.querySelector('.activity-feed-wrap + div');
    x.insertBefore(listDiv2, x.children[0]);
    expandbtn.innerHTML = '';
    expandbtn.insertBefore(svg.expand.cloneNode(true), expandbtn.children[0]);
    listDiv2.className = listDiv2.className.replace(/(?:^|\s)expanded(?!\S)/g, '');
    activityDataDiv.className = activityDataDiv.className.replace(/(?:^|\s)expanded2(?!\S)/g, '');
  }
}

//Toggle Saved Divs
function getSavedDiv(btn,type) {
  active = !active;
  let activefilter = document.querySelector('li.el-dropdown-menu__item.active');
  if (activefilter) {
    delay(1000).then(() => (activefilter.className = activefilter.className.replace(/(?:^|\s)active(?!\S)/g, '')));
  }
  if (active) {
    creatediv(btn);
    buildActivity();
  }
  if (!active) {
    closeDiv();
  }
}

//Close Button Function
function closeDiv() {
  var list = document.querySelectorAll('li:nth-child(1)');
  button.setAttribute('class', 'el-dropdown-menu__item');
  button2.setAttribute('class', 'el-dropdown-menu__item');
  listDiv2.remove();
  active = false;
  isLoading = false;
}

async function updateEmbeds() {
  await delay(50);
  await getSpoilers();
  await delay(50);
  await getEmbedIds();
}

//Get Activity from API
async function getActivity(id, source) {
  source = likeHistory;
  if (id === '') {
    return;
  }
  var query = `query($id: Int){Activity(id: $id){
    ... on TextActivity{id type siteUrl createdAt text user{name avatar{medium}}likes{name}replies{id createdAt text user{name avatar{medium}}likes{name}}}
		... on MessageActivity{id type siteUrl createdAt text: message user: messenger{name avatar{medium}}recipient{name}likes{name}replies{id createdAt text user{name avatar{medium}}likes{name}}}}}`;
  var variables = { id: id, };
  async function handleData(data) {
    if (data) {
      let activity = data.data.Activity;
      let id = activity.id;
      let acttext = activity.text;
      if (active) {
        let activityInner = create('div', { class: 'activityInner markdown', });
        let aimg = create('a', { class: 'activityDataImage', id: 'activityDataImage', href: 'https://anilist.co/user/' + activity.user.name, style: { backgroundImage: 'url(' + activity.user.avatar.medium + ')', }, });
        let actusername = create('a', { class: 'activityDataUsername', id: 'activityDataUsername', target:'_blank', href: 'https://anilist.co/user/' + activity.user.name, }, '' + activity.user.name,);
        let activityDiv = create('div', { class: 'activity-text activityData wrap', id: activity.id, time: activity.createdAt, });
        let actlinks = create('a', { class: 'activityLinksDiv', });
        if(source) actlinks.style.left = 'calc(100% - 70px)';
        let actlink = create('a', { class: 'activityLink', id: activity.id, target:'_blank', href: activity.siteUrl, });
        let actremove = create('a', { class: 'activityLink', id: activity.id, });
        actremove.onclick = async () => {
          await removeActivity(id);
        };
        let userdiv = create('div', { class: 'activityDatauserdiv', id: activity.id, });
        if (acttext === undefined) {
          await removeActivity(id);
          return;
        }
        if (acttext !== undefined) {
          activityInner.innerHTML = await actHTMLFix(acttext);
        }
        activityDataDiv.appendChild(activityDiv);
        activityDiv.appendChild(activityInner);
        activityDiv.appendChild(userdiv);
        aimg.appendChild(actusername);
        activityDiv.appendChild(actlinks);
        source ? actlinks.append(actlink) : actlinks.append(actlink, actremove);
        actlink.insertBefore(svg.link.cloneNode(true), actlink.children[0]);
        actremove.insertBefore(svg.cross.cloneNode(true), actremove.children[0]);
        activityDiv.insertBefore(userdiv, activityDiv.children[0]);
        userdiv.append(aimg, actlinks);
        let timeWrapper = create2('div', 'acttime', false, actusername);
        let time = nativeTimeElement(activity.createdAt);
        timeWrapper.appendChild(time);
        let actions = create2('div', 'actions', false, activityDiv);
        let actionReplies = create2('a', ['action', 'replies'], false, actions);
        let replyCount = create2('span', ['count'], activity.replies.length || '', actionReplies);
        replyCount.appendChild(document.createTextNode(' '));
        actionReplies.appendChild(svg.reply.cloneNode(true));
        actions.appendChild(document.createTextNode(' '));
        let actionLikes = create2('div', ['action', 'likes'], false, actions);
        actionLikes.title = activity.likes.map((like) => like.name).join('\n');
        let likeWrap = create2('div', ['like-wrap', 'activity'], false, actionLikes);
        let likeButton = create2('div', 'button', false, likeWrap);
        let likeCount = create2('span', 'count', activity.likes.length || '', likeButton);
        likeButton.appendChild(document.createTextNode(' '));
        likeButton.appendChild(svg.likeNative.cloneNode(true));
        likeButton.setAttribute('id',activity.id);
        likeButton.setAttribute('mainDiv',"1");
        if (activity.likes.findIndex((thing) => thing.name === username) !== -1) {
          likeButton.classList.add('liked');
        }
        if(source) {
          let isLiked = likeButton.classList.contains('liked');
          if (!isLiked) {
            await removeActivity(id,'likeHistory');
          }
        }
        if (accessToken) {
          likeButton.onclick = function () {
            let indexPlace = activity.likes.findIndex((thing) => thing.name === username);
            if (indexPlace === -1) {
              activity.likes.push({
                name: username,
              });
              likeButton.classList.add('liked');
            } else {
              activity.likes.splice(indexPlace, 1);
              likeButton.classList.remove('liked');
            }
            likeCount.innerText = activity.likes.length || '';
            authAPIcall(
              'mutation($id:Int){ToggleLike(id:$id,type:ACTIVITY){id}}',
              {
                id: activity.id,
              },
              function (data) {
                if (!data) {
                  authAPIcall(
                    'mutation($id:Int){ToggleLike(id:$id,type:ACTIVITY){id}}',
                    {
                      id: activity.id,
                    },
                    (data) => { },
                  );
                }
              },
            );
          };
        }
        let replyWrap = create2('div', 'reply-wrap', false, activityDiv, 'display:none;');
        actionReplies.onclick = function () {
          if (replyWrap.style.display === 'none') {
            replyWrap.style.display = 'block';
          } else {
            replyWrap.style.display = 'none';
          }
        };
        let activityReplies = create2('div', 'activity-replies', false, replyWrap);
        activity.replies.forEach(async (rep) => {
          let reply = create2('div', 'reply', false, activityReplies);
          let header = create2('div', 'header', false, reply);
          let replyAvatar = create2('a', 'activityDataImage', false, header);
          replyAvatar.href = '/user/' + rep.user.name;
          replyAvatar.style.backgroundImage = `url("${rep.user.avatar.medium}")`;
          header.appendChild(document.createTextNode(' '));
          let repName = create2('a', 'name', rep.user.name, header);
          repName.href = '/user/' + rep.user.name;
          let corner = create2('div', 'actions', false, header);
          let replyActionLikes = create2('div', ['action', 'likes'], false, corner, 'display: inline-block');
          let replyLikeWrap = create2('div', 'like-wrap', false, replyActionLikes);
          let replyLikeButton = create2('div', 'button', false, replyLikeWrap);
          let replyLikeCount = create2('span', 'count', rep.likes.length || '', replyLikeButton);
          replyLikeButton.appendChild(document.createTextNode(' '));
          replyLikeButton.appendChild(svg.likeNative.cloneNode(true));
          replyLikeButton.title = rep.likes.map((a) => a.name).join('\n');
          if (rep.likes.some((like) => like.name === username)) {
            replyLikeButton.classList.add('liked');
          }
          if (accessToken) {
            replyLikeButton.onclick = function () {
              authAPIcall(
                'mutation($id:Int){ToggleLike(id:$id,type:ACTIVITY_REPLY){id}}',
                {
                  id: rep.id,
                },
                function (data2) {
                  if (!data2) {
                    authAPIcall(
                      'mutation($id:Int){ToggleLike(id:$id,type:ACTIVITY_REPLY){id}}',
                      {
                        id: rep.id,
                      },
                      function (data3) { },
                    );
                  }
                },
              );
              if (rep.likes.some((like) => like.name === username)) {
                rep.likes.splice(
                  rep.likes.findIndex((user) => user.name === username),
                  1,
                );
                replyLikeButton.classList.remove('liked');
                if (rep.likes.length > 0) {
                  replyLikeButton.querySelector('.count').innerText = rep.likes.length;
                } else {
                  replyLikeButton.querySelector('.count').innerText = '';
                }
              } else {
                rep.likes.push({
                  name: username,
                });
                replyLikeButton.classList.add('liked');
                replyLikeButton.querySelector('.count').innerText = rep.likes.length;
              }
            };
            if (rep.user.name === username) {
              corner.style.cssText = 'width: 165px;left: calc(100% - 175px);top: 6px';
              let replyEdit = create('div', {
                class: 'mainbtns',
                id: 'editreply',
                style: {
                  background: 'transparent',
                  color: 'rgb(var(--color-blue-dim))',
                },
              });
              replyEdit.insertBefore(svg.edit.cloneNode(true), replyEdit.children[0]);
              corner.insertBefore(replyEdit, corner.children[0]);
              let active = true;
              replyEdit.onclick = function () {
                if (active) {
                  let statusInput = create2('div', 'inputbox', false, 'text-align: -webkit-center;');
                  let inputArea = create2('textarea', 'el-textarea__inner', false, statusInput);
                  let inputButtons = create2('div', 'inputButtons', false, statusInput, 'margin-bottom:10px;float: right;padding: 20px 2% 15px 15px;');
                  let cancelButton = create2(
                    'div',
                    ['replybutton', 'cancel'],
                    'Cancel',
                    inputButtons,
                    'background: rgb(var(--color-foreground));display:none;color: rgb(159, 173, 189);',
                  );
                  let publishButton = create2('div', 'replybutton', 'Publish', inputButtons, 'display:none;');
                  inputArea.value = rep.text;
                  reply.parentNode.insertBefore(statusInput, reply.nextSibling);
                  inputArea.style.cssText = 'height:0px';
                  statusInput.style.cssText = 'display: flow-root';
                  inputArea.onfocus = function () {
                    cancelButton.style.display = 'inline';
                    publishButton.style.display = 'inline';
                  };
                  inputArea.addEventListener('keydown', autosize);
                  function autosize() {
                    var el = this;
                    setTimeout(function () {
                      el.style.cssText = 'height:auto';
                      el.style.cssText = 'height:' + el.scrollHeight + 'px';
                    }, 0);
                  }
                  cancelButton.onclick = function () {
                    inputArea.value = '';
                    inputArea.style.cssText = 'height:0px';
                    cancelButton.style.display = 'none';
                    publishButton.style.display = 'none';
                    active = true;
                    statusInput.remove();
                  };
                  publishButton.onclick = function () {
                    authAPIcall(`mutation($text: String,$Id: Int){id text(asHtml: true)}}`, { text: inputArea.value, Id: rep.id, }, (data) => {
                      if (data) {
                        delay(1000).then(() => buildActivity());
                      }
                    },
                    );
                  };
                  cancelButton.style.display = 'none';
                  publishButton.style.display = 'none';
                }
                active = false;
              };
              let replyRemove = create('div', { class: 'mainbtns', id: 'removereply', style: { background: 'transparent', transform: 'translateX(2px)', color: 'rgb(var(--color-blue-dim))', }, });
              replyRemove.insertBefore(svg.xmark.cloneNode(true), replyRemove.children[0]);
              corner.insertBefore(replyRemove, corner.children[0]);
              replyRemove.onclick = function () {
                authAPIcall(`mutation($Id: Int){DeleteActivityReply(id: $Id) {deleted}}`, { Id: rep.id, }, (data) => {
                  if (data) {
                    delay(1000).then(() => buildActivity());
                  }
                },);
              };
            }
          }
          let replyActionTime = create2('div', ['action', 'time'], false, corner, 'display: inline-block');
          let replyTime = nativeTimeElement(rep.createdAt);
          replyActionTime.appendChild(replyTime);
          let replyMarkdown = create2('div', 'reply-markdown', false, reply);
          let markdown = create2('div', 'markdown', false, replyMarkdown);
          let repText = rep.text;
          if (repText !== undefined) {
            markdown.innerHTML = await actHTMLFix(repText);
          }
        });
        if (accessToken) {
          let statusInput = create2('div', false, false, replyWrap, 'padding-top:10px; text-align: -webkit-center;');
          let inputArea = create2('textarea', 'el-textarea__inner', false, statusInput);
          let inputButtons = create2('div', 'inputButtons', false, statusInput, 'float: right;padding: 20px 2% 15px 15px;');
          let cancelButton = create2('div', ['replybutton', 'cancel'], 'Cancel', inputButtons, 'background: rgb(var(--color-foreground));display:none;color: rgb(159, 173, 189);');
          let publishButton = create2('div', 'replybutton', 'Publish', inputButtons, 'display:none;');
          inputArea.placeholder = 'Write a reply..';
          inputArea.style.cssText = 'height:0px';
          inputArea.onfocus = function () {
            cancelButton.style.display = 'inline';
            publishButton.style.display = 'inline';
          };
          inputArea.addEventListener('keydown', autosize);
          function autosize() {
            var el = this;
            setTimeout(function () {
              if (inputArea.scrollHeight > 54) {
                el.style.cssText = 'height:auto';
                el.style.cssText = 'height:' + el.scrollHeight + 'px';
              }
              if (inputArea.value.length < 20) {
                el.style.cssText = 'height:0';
              }
            }, 0);
          }
          cancelButton.onclick = function () {
            inputArea.value = '';
            inputArea.style.cssText = 'height:0px';
            cancelButton.style.display = 'none';
            publishButton.style.display = 'none';
          };
          publishButton.onclick = function () {
            authAPIcall(`mutation($text: String,$activityId: Int){SaveActivityReply(text: $text,activityId: $activityId){id user{name} likes{name} text(asHtml: true) createdAt}}`,
              {
                text: inputArea.value,
                activityId: activity.id,
              },
              (data) => {
                if (data) {
                  delay(1000).then(() => buildActivity());
                }
              },
            );
          };
          inputArea.value = '';
          cancelButton.style.display = 'none';
          publishButton.style.display = 'none';
        }
      }
    }
  }
  function handleError(e) {
    console.log(e);
  }
  await alQuery(query, variables).then(handleData).then().catch(handleError);
  await updateEmbeds();
}

// Remove Activity Function
async function removeActivity(id,db) {
  let idDB = db ? db : "savedActivities";
  if (canRemoveActivity) {
    document.getElementById(id)?.remove();
    let activitiesIdArray = await mainDB.getItem(idDB);
    if (typeof activitiesIdArray === "string") {
      activitiesIdArray = JSON.parse(activitiesIdArray);
    }
    id = String(id).trim();
    activitiesIdArray = activitiesIdArray.map(item => String(item).trim());

    // Find and remove the ID
    const index = activitiesIdArray.indexOf(id);
    if (index !== -1) {
      activitiesIdArray.splice(index, 1);
    }
    // Update the mainArray and save back to the database
    mainArray = activitiesIdArray;
    await mainDB.setItem(idDB, activitiesIdArray);
    if (autosave) {
      await autoSaveActivity(1);
    }
  }
}

//Add Save Button to Activities
var target = document.querySelector('body');
var oldHref = document.location.href;

var observer = new MutationObserver(function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(async (node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (
            node.classList.contains('activity-entry') ||
            node.classList.contains('activity-text') ||
            node.querySelector('.activity-entry, .activity-text')
          )
        ) {
          await delay(2000);
          addSavetoActivities();
        }
      });

      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        active = false;
        addToFilters();
      }
    }
  }
});

observer.observe(target, {
  childList: true,
  subtree: true,
});
