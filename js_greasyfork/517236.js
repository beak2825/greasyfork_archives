// ==UserScript==
// @name        Mal-Activity-Feed
// @namespace   KanashiiDev
// @match       https://myanimelist.net/*
// @grant       none
// @version     0.1
// @author      KanashiiDev
// @description Activity Feed for MyAnimeList
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Feed/issues
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/517236/Mal-Activity-Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/517236/Mal-Activity-Feed.meta.js
// ==/UserScript==

let defaultColors = `
:root,
body {
  --color-background: #121212!important;
  --color-backgroundo: #0c1525!important;
  --color-foreground: #181818!important;
  --color-foreground2: #242424!important;
  --color-foregroundOP2: #242424!important;
  --color-foreground4: #282828!important;
  --border-radius: 5px!important;
  --color-text: 182 182 182;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: 159,173,189;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
}
a.feed-main-button {
  top: 0!important
}
.feed-main {
  padding: 10px
}
.feed-main a:hover {
  text-decoration: none!important
}
#currently-popup iframe {
  border: 0!important
}
`;
let defaultColorsLight = `
:root,
body {
  --color-background: #eef1fa!important;
  --color-backgroundo: #0c1525!important;
  --color-foreground: #f5f5f5!important;
  --color-foreground2: #eeeeee!important;
  --color-foregroundOP2: #242424!important;
  --color-foreground4: #e3e3e3!important;
  --border-radius: 5px!important;
  --color-text: 182 182 182;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: 159,173,189;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
}
a.feed-main-button {
  top: 0!important
}
.feed-main {
  padding: 10px
}
.feed-main a:hover {
  text-decoration: none!important
}
#currently-popup iframe {
  border: 0!important
}
`;
let MalCleanCSS = `
.feed-message-main {
  background: var(--color-foreground);
  padding: 14px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  margin-bottom: 10px
}
.feed-message-main-container .feed-message .feed-profile {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center
}
.feed-message-profile-image {
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover
}
.feed-message-main-container .feed-message .feed-profile .feed-message-profile-image {
  height: 40px;
  width: 40px;
  margin-right: 10px
}
.feed-message-main-container .feed-reply-main .feed-message .feed-profile .feed-message-profile-image {
  height: 25px;
  width: 25px;
  margin-right: 10px
}
.feed-message-main-container .feed-message .feed-message-content {
  margin: 10px 0
}
.feed-message-profile-details {
  height: 40px
}
.feed-message-reply .feed-message-profile-details {
  height: 25px
}
.feed-message-profile-name {
  line-height: 25px;
  font-size: .9rem
}
.feed-message-reply .feed-message-profile-name {
  font-size: .8rem
}
.feed-message-date {
  font-size: .65rem
}
.feed-message-reply-button {
  margin-right: 7px
}
.feed-add-like-button,
.feed-message-reply-button {
  font-weight: 600;
  cursor: pointer
}
#myanimelist .feed-add-like-button.liked {
  color: #e85d75!important
}
.feed-add-like-button:after {
  cursor: pointer;
  font-family: fontAwesome;
  content: "\\f004";
  margin-left: 4px
}
.feed-add-like-button.fa.fa-spinner {
  cursor: default
}
.feed-add-like-button.fa.fa-spinner:before {
  content: ""
}
.feed-add-like-button.fa.fa-spinner:after {
  -webkit-animation: fa-spin 2s infinite linear;
  animation: fa-spin 2s infinite linear;
  font-family: fontAwesome;
  cursor: default;
  content: "\\f110"
}
.feed-add-like-button.liked:after {
  font-weight: 600
}
.feed-message-reply-button:after {
  cursor: pointer;
  font-family: fontAwesome;
  content: "\\f086";
  color: var(--color-link)!important;
  margin-left: 4px
}
.feed-watch-button,
.feed-link-button,
.feed-edit-reply-button {
  cursor: pointer;
  opacity: 0;
  float: right
}
.feed-watch-button,
.feed-link-button {
  margin-left:6px;
  font-family: fontAwesome
}
.feed-watch-button.fa.fa-bell.watched:before {
  color:rgb(123, 213, 85) !important
}
.feed-edit-reply-button:before {
  font-family: fontAwesome;
  content: "\\f304";
  color: var(--color-link)!important
}
.feed-message:hover .feed-watch-button,
.feed-message:hover .feed-link-button,
.feed-message:hover .feed-edit-reply-button {
  opacity: 1
}
.feed-message-main-container .feed-message-reply-actions {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -webkit-flex-direction: row-reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  padding-top: 10px
}
.feed-message-reply .feed-message-reply-actions{
  padding-top:0
}
.feed-reply-main {
  margin-bottom: 10px
}
.feed-message-main-container .feed-message-reply .feed-message {
  background: var(--color-foreground);
  padding: 14px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  margin: 0 10px
}
.feed-reply-footer {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -webkit-flex-direction: row-reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  margin-top: 5px;
  margin-right: 10px
}
.feed-add-reply-button {
  background: var(--color-foreground2);
  padding: 10px;
  margin: 0
}
.feed-message-reply-container-inner .feed-message-reply{
  margin-top:10px
}
.feed-message-reply-container-inner .feed-message-reply .feed-add-like-button {
  margin-left: 8px
}
button.feed-message-load-more-button {
  background: var(--color-foreground2);
  padding: 10px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  margin: 15px;
  width: 97%;
  cursor: pointer
}
.feed-message-content {
  max-height: 560px;
  overflow-y: auto
}
.feed-post-header,
.feed-reply-footer {
  height: 50px
}
.feed-post-div iframe,
.feed-reply-main iframe {
  width: 100%;
  height: 400px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius)
}
.feed-reply-main iframe {
  height: 258px
}
a.feed-main-button {
  position: absolute;
  top: 5px;
  left: 100px
}
.feed-refresh-button {
  margin-right: 5px
}
.feed-add-post-button,
.feed-add-reply-button,
.feed-following-button,
.feed-global-button,
.feed-refresh-button,
a.feed-main-button {
  cursor: pointer;
  padding: 10px;
  padding-top: 10px!important;
  background: var(--color-foreground);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  display: inline-block;
  margin-bottom: 10px
}
.feed-add-post-button,
.feed-refresh-button,
.feed-message-reply .feed-like-wrap,
.feed-post-header-right {
  float: right
}
.feed-btn-active {
  background-color: var(--color-foreground4)!important;
  color: rgb(159, 173, 189)
}
.feed-like-wrap {
  display: block;
  position: relative;
  margin-right: 10px
}
.feed-like-wrap-users {
-webkit-transition: .3s;
-o-transition: .3s;
transition: .3s;
  display: none;
  background: var(--color-foreground4);
  -webkit-border-radius: 4px;
          border-radius: 4px;
  -webkit-box-shadow: 0 2px 10px 0 rgba(6, 13, 34, .1);
          box-shadow: 0 2px 10px 0 rgba(6, 13, 34, .1);
  height: 40px;
  right: -5px;
  overflow: hidden;
  position: absolute;
  top: -40px
}
.feed-like-wrap:hover .feed-like-wrap-users{
  display:block;
  -webkit-animation: fade_in 0.4s;
          animation: fade_in 0.4s
}
.feed-like-wrap-user {
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  height: 40px;
  width: 40px
}

@-webkit-keyframes fade_in {
  0% {
  opacity: 0;
  -webkit-transform: scale(0);
          transform: scale(0)
  }

  100% {
  opacity: 1;
  -webkit-transform: scale(1);
          transform: scale(1)
  }
}

@keyframes fade_in {
  0% {
  opacity: 0;
  -webkit-transform: scale(0);
          transform: scale(0)
  }

  100% {
  opacity: 1;
  -webkit-transform: scale(1);
          transform: scale(1)
  }
}
.actloading {
  font-size: .8rem;
  font-weight: 700;
  padding: 14px;
  text-align: center
}
#currently-popup {
    height: 425px;
    width: 674px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: var(--color-foregroundOP2);
    padding: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

#currently-popup iframe {
    width: 100%;
    height: 100%;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    border: 1px solid
}

#currently-closePopup {
    position: absolute;
    top: 5px;
    right: 6px;
    cursor: pointer
}
.feed-global-button{
-webkit-border-top-left-radius:0px;
        border-top-left-radius:0px;
-webkit-border-bottom-left-radius:0px;
        border-bottom-left-radius:0px
}
.feed-following-button{
-webkit-border-top-right-radius:0px;
        border-top-right-radius:0px;
-webkit-border-bottom-right-radius:0px;
        border-bottom-right-radius:0px
}
`;
//Add CSS
let styleSheet = document.createElement('style');
MalCleanCSS = MalCleanCSS.replace(/\n/g, '');
if ($('style:contains(--fg:)').length) {
  styleSheet.innerText = MalCleanCSS;
} else if ($('html').hasClass('dark-mode')) {
  defaultColors = defaultColors.replace(/\n/g, '');
  styleSheet.innerText = defaultColors + MalCleanCSS;
} else {
  defaultColorsLight = defaultColorsLight.replace(/\n/g, '');
  styleSheet.innerText = defaultColorsLight + MalCleanCSS;
}


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

function nativeTimeElement(e) {
  let $ = new Date(1e3 * e);
  if (isNaN($.valueOf())) return 'Now';
  return (function e() {
    let r = Math.round(new Date().valueOf() / 1e3) - Math.round($.valueOf() / 1e3);
    if (0 === r) return 'Now';
    if (1 === r) return '1 second ago';
    if (r < 60) return r + ' seconds ago';
    if (r < 120) return '1 minute ago';
    if (r < 3600) return Math.floor(r / 60) + ' minutes ago';
    else if (r < 7200) return '1 hour ago';
    else if (r < 86400) return Math.floor(r / 3600) + ' hours ago';
    else if (r < 172800) return '1 day ago';
    else if (r < 604800) return Math.floor(r / 86400) + ' days ago';
    else if (r < 1209600) return '1 week ago';
    else if (r < 2419200) return Math.floor(r / 604800) + ' weeks ago';
    else if (r < 29030400) return Math.floor(r / 2419200) + ' months ago';
    else return Math.floor(r / 29030400) + ' years ago';
  })();
}

//Delay Function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function () {
  "use strict";
  let processTopicsPromise = null;
  let isTopicsLoading = 0;
  let topicAbortController = new AbortController();
  let isRepliesLoading = 0;
  let activeSection = 0;
  let replyrepliesBodyAll = 0;
  let notifyChecked = 0;
  let notifyChecked_2 = 0;
  let singleActivity = 0;
  const clubId = '92324';
  const forumLink = `https://myanimelist.net/forum/?clubid=${clubId}sort=post`;
  const feedDivMain = create("div", { class: 'feed-main', style: { display: "none" } });
  const feedDivContainer = create("div", { class: 'feed-main-container' });
  let currentTopicParam = 0;
  const loadMoreTopicsButton = create("button", { class: 'feed-message-load-more-button', style: { display: "none" } }, 'Load More');
  const topicLoading = create(
    "div",
    { class: "user-history-loading actloading" },
    "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-size:12px;font-family:FontAwesome"></i>'
  );

  //Edit Activity Popup
  async function editPopup(id, type) {
    return new Promise((resolve, reject) => {
      if ($('#currently-popup').length) {
        return;
      }
      const url = location.pathname === "/" ? null : 1;
      const popup = create("div", { id: "currently-popup" });
      const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
      const popupId = "https://myanimelist.net/forum/?action=message&msgid=" + id;
      const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
      const popupLoading = create("div", {
        class: "actloading",
        style: { position: 'relative', left: '0px', right: '0px', fontSize: '16px', height: '100%', alignContent: 'center', zIndex: '2' },
      },
        "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
      );
      const popupMask = create("div", {
        class: "fancybox-overlay",
        style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "2" },
      },);
      const popupIframe = create("iframe", { src: popupId });
      popupIframe.style.opacity = 0;
      const close = () => {
        popup.remove();
        popupMask.remove();
        document.body.style.removeProperty("overflow");
        resolve();
      };

      popup.append(popupClose, popupLoading, popupIframe);
      document.body.append(popup, popupMask);
      document.body.style.overflow = "hidden";

      $(popupIframe).on("load", function () {
        let $iframeContents = $(popupIframe).contents();
        $iframeContents.find("div:not(#dialog *):not(#contentWrapper):not(#content):not(#myanimelist):not(.wrapper)").remove();
        $iframeContents.find("#dialog form div[style='margin-top: 6px;'], footer, #dialog form > br, #pollView > a, #pollInformation").remove();
        $iframeContents.find('html')[0].style.overflowX = 'hidden';
        $iframeContents.find('#content')[0].style.padding = '0';

        $iframeContents.find("#dialog")[0].setAttribute('style', 'margin:0;padding:0;width:100%');
        $iframeContents.find("#contentWrapper")[0].setAttribute('style',
          'top: 0px!important;left: -5px;margin: 0!important;padding: 0!important;max-width: 675px!important;min-width: auto;min-height: auto;width: 675px !important;top: 0 !important;');
        $iframeContents.find("#myanimelist")[0].setAttribute('style', 'width: auto;padding: 0px 5px;');
        $iframeContents.find("input[name='topic_title'], #dialog > tbody > tr > td > form:nth-child(2) > strong, #dialog > tbody > tr > td > form:nth-child(2) > div:nth-child(2), " +
          "#dialog > tbody > tr > td > form:nth-child(2) > div > button.mal-btn.secondary.outline.btn-recaptcha-submit").hide();
        $iframeContents.find(".normal_header").html('Edit Activity');
        function reloadReplies() {
          const reloadInterval = setInterval(() => {
            $iframeContents = $(popupIframe).contents();
            const goodResult = $iframeContents.find('.goodresult').length;
            if (goodResult > 0) {
              close();
              $('.feed-main-container').empty();
              currentTopicParam = 0;
              loadForumPageTopics(currentTopicParam, loadMoreTopicsButton);
              $('.feed-main-container').after(topicLoading);
              clearInterval(reloadInterval);
            }
            if ($iframeContents.length === 0) {
              clearInterval(reloadInterval);
            }
          }, 250);
        }
        popupIframe.style.opacity = 1;
        popupLoading.remove();

        $iframeContents.find('#dialog button:contains("Submit")').on("click", function () {
          reloadReplies();
        })
        $iframeContents.find('#dialog button:contains("Delete")').on("click", function () {
          popup.prepend(popupLoading);
          popupIframe.style.opacity = 0;
          reloadReplies();
        })
        // close popup
        popupMask.onclick = () => {
          close()
        };
        popupClose.onclick = () => {
          close();
        };
      });
    })
  }

  //Hide Club Forum Topics
  if (location.href.includes(`https://myanimelist.net/forum/?clubid=${clubId}`) || location.href.includes(`https://myanimelist.net/clubs.php?cid=${clubId}`)) {
    $('.borderClass .page-forum').hide();
    $('.page-forum #content').has('#forumTopics').hide();
  }

  //Replace forum links with activity url
  if (location.pathname === "/" || location.href.includes('https://myanimelist.net/forum/?action=viewstarred')) {
    const m = location.pathname !== "/";
    const h = m ? $('#forumTopics tr').has('a:contains("Mal Feed")').find('a[href*="topicid"]').attr('href') : $('.forum-topics tr').has('a:contains("Activity Feed")').find('a[href*="topicid"]').attr('href');
    const i = m ? "https://myanimelist.net/activity/" + (h.split('/')[2].replace('?topicid=', '')) : "https://myanimelist.net/activity/" + (h.split('/')[4].replace('?topicid=', ''));
    m ? $('#forumTopics tr').has('a:contains("Mal Feed")').find('a[href*="topicid"]').attr('href', i) : $('.forum-topics tr').has('a:contains("Activity Feed")').find('a[href*="topicid"]').attr('href', i);
  }

  //Main Page
  if (location.pathname === "/" || location.pathname.includes('activity')) {
    //Single activity
    if (location.pathname.includes('activity')) {
      const singleActDiv = document.querySelector(".error404");
      singleActDiv.innerHTML = '';
      singleActDiv.title = '';
      singleActDiv.style.padding = '0';
      singleActDiv.parentElement.parentElement.style.minHeight = '0';
      document.querySelector("#contentWrapper > div:nth-child(1) > h1").innerText = "Activity";
      document.title = "Activity - MyAnimeList";
      singleActivity = 1;
    }
    document.getElementsByTagName("head")[0].appendChild(styleSheet);
    const contentWrapper = singleActivity ? document.querySelector(".error404") : document.querySelector(".left-column");
    contentWrapper.appendChild(feedDivMain);

    //add Feed Activity Div
    const mainDiv = document.querySelector('#contentWrapper > div:nth-child(1)');
    const feedToggleButton = create("a", { class: 'feed-main-button' }, 'Activity Feed');
    const feedRefreshButton = create("a", { class: 'feed-refresh-button' }, 'Refresh');
    const feedGlobalButton = create("a", { class: 'feed-global-button' }, 'Global');
    const feedFollowingButton = create("a", { class: 'feed-following-button' }, 'Following');
    let feedToggleStatus = 0;
    let feedSectionStatus = [0, 0];
    mainDiv.appendChild(feedToggleButton);

    //Refresh Topics
    async function refreshTopics(type, add) {
      if (!add) {
        feedGlobalButton.classList.toggle('feed-btn-active', activeSection === "global");
        feedFollowingButton.classList.toggle('feed-btn-active', activeSection === "friend");

        if (isTopicsLoading) {
          topicAbortController.abort();
        }

        const reloadInterval = new Promise((resolve, reject) => {
          const checkLoadingStatus = setInterval(() => {
            if (!isTopicsLoading) {
              clearInterval(checkLoadingStatus);
              resolve();
            }
          }, 250);
        });

        await reloadInterval;
        $(feedDivContainer).empty();
        loadMoreTopicsButton.style.display = 'none';
        topicAbortController = new AbortController();
        currentTopicParam = 0;
        $(feedDivContainer).after(topicLoading);
      } else {
        currentTopicParam += 50;
      }
      if (type === "global") {
        processTopicsPromise = loadForumPageTopics(currentTopicParam, loadMoreTopicsButton);
      }
      if (type === "friend") {
        processTopicsPromise = loadForumPageTopics(currentTopicParam, loadMoreTopicsButton, 1);
      }
      if (type === "single") {
        const parser = new DOMParser();
        const repliesActions = create("div", { class: 'feed-message-reply' });
        const repliesInner = create("div", { class: 'feed-message-reply-container-inner' });
        const actLink = 'https://myanimelist.net/forum/?topicid=' + location.pathname.split('/')[2];
        processTopicsPromise = fetchTopicMessages(actLink, parser, repliesActions, repliesInner);
        topicLoading.remove();
      }
    }

    feedGlobalButton.addEventListener('click', () => {
      activeSection = "global";
      refreshTopics(activeSection);
    });

    feedFollowingButton.addEventListener('click', () => {
      activeSection = "friend";
      refreshTopics(activeSection);
    });

    loadMoreTopicsButton.addEventListener('click', () => {
      loadMoreTopicsButton.style.display = 'none';
      refreshTopics(activeSection, 1);
    });


    //Show & Hide Feed
    feedToggleButton.addEventListener('click', () => {
      feedToggleStatus = !feedToggleStatus;
      feedToggleButton.classList.toggle('feed-btn-active', feedToggleStatus);
      feedToggleStatus ? feedToggleButton.innerText = 'Close Activity Feed' : feedToggleButton.innerText = 'Activity Feed';
      feedToggleStatus ? $('.left-column article').hide() : $('.left-column article').show();
      feedToggleStatus ? feedDivMain.style.display = 'block' : feedDivMain.style.display = 'none';

      if (!isTopicsLoading) {
        if (feedToggleStatus && $(feedDivContainer).html() === '') {
          activeSection = "global";
          refreshTopics(activeSection);
        }
      }
    });

    //Refresh Feed
    feedRefreshButton.addEventListener('click', () => {
      if (!isTopicsLoading) {
        refreshTopics(activeSection);
      }
    });

    //Add Feed Activity
    const ActivityPostDiv = create("div", { class: 'feed-post-div', style: { display: "none" } });
    const ActivityPostHeaderDiv = create("div", { class: 'feed-post-header' });
    const ActivityPostHeaderRightDiv = create("div", { class: 'feed-post-header-right' });
    const postToggleButton = create("a", { class: 'feed-add-post-button' }, 'Add Activity');
    const postIframe = create("iframe", { src: "" });
    let postIframeLoading = topicLoading.cloneNode(true);
    let postIframeLoadingDef = postIframeLoading;
    let postToggleStatus = 0;
    postToggleButton.addEventListener('click', () => {
      postIframeLoading = postIframeLoadingDef;
      ActivityPostDiv.prepend(postIframeLoading);
      postIframe.style.display = 'none';
      postToggleStatus = !postToggleStatus;
      postToggleButton.classList.toggle('feed-btn-active', postToggleStatus);
      postToggleStatus ? postToggleButton.innerText = 'Close' : postToggleButton.innerText = 'Add Activity';
      postToggleStatus ? ActivityPostDiv.style.display = 'block' : ActivityPostDiv.style.display = 'none';
      postToggleStatus ? postIframe.src = `https://myanimelist.net/forum/?action=post&club_id=${clubId}` : postIframe.src = 'about:blank';

      $(postIframe).on("load", async function () {
        postIframe.style.display = 'block';
        let $iframeContents = $(postIframe).contents();
        //If success
        if ($iframeContents.find(".goodresult").length || $iframeContents.find('.forum-topic-message[id^="msg"]').length) {
          postToggleButton.innerText = 'Add Activity';
          postToggleButton.classList.toggle('feed-btn-active', postToggleStatus);
          ActivityPostDiv.style.display = 'none';
          postIframe.style.display = "block";
          postIframe.src = 'about:blank';
          postIframeLoading.remove();
          refreshTopics(activeSection);
          postToggleButton.click();
        }
        //If error
        if ($iframeContents.find(".badresult").length) {
          ActivityPostDiv.prepend(postIframeLoading);
          postIframeLoading.innerHTML = $iframeContents.find(".badresult")[0].innerText;
          postIframe.style.display = "none";
        }
        //Iframe Cleanup
        if (postToggleStatus && !$iframeContents.find(".goodresult").length && !$iframeContents.find(".badresult").length && !$iframeContents.find('.forum-topic-message[id^="msg"]').length) {
          postIframe.style.opacity = 1;
          postIframeLoading.remove();
          $iframeContents.find(".normal_header").html('Post New Activity');
          $iframeContents.find("div:not(#dialog *):not(#contentWrapper):not(#content):not(#myanimelist):not(.wrapper)").remove();
          $iframeContents.find("#dialog div.mal-btn-toolbar > button:nth-child(4), #dialog div.mal-btn-toolbar > button:nth-child(3)").remove();
          $iframeContents.find("#dialog form div[style='margin-top: 6px;'], #dialog #mass-message, #dialog form > br, footer").remove();
          $iframeContents.find('html')[0].style.overflowX = 'hidden';
          $iframeContents.find('#content').css({ padding: '0', marginLeft: '10px' });
          $iframeContents.find("#dialog").css({ margin: 0, padding: 0, width: '100%' });
          $iframeContents.find("#contentWrapper").css({ top: '0px', left: '-5px', margin: 0, padding: 0, 'max-width': '730px', 'min-width': 'auto', 'min-height': 'auto' });
          $iframeContents.find("#contentWrapper")[0].style.setProperty('width', '720px', 'important');
          $iframeContents.find("#myanimelist").css({ width: 'auto', padding: '0px 5px' });
          $iframeContents.find("#topicTitle > input").val("Activity Feed");
          $iframeContents.find("#topicTitle").hide();
          $iframeContents.find("#pollView > a")[0].click();
          $iframeContents.find("#pollView > a").hide();
          await delay(200);
          $iframeContents.find("#pollInformation").hide();
          $iframeContents.find("#pollInformation input[name='pollQuestion']")[0].value = "Liked";
          $iframeContents.find("#pollDiv > div > input")[0].value = "Yes";
          $iframeContents.find("#dialog div.mal-btn-toolbar > button:nth-child(2)").on("click", function () {
            postIframe.style.display = "none";
            ActivityPostDiv.prepend(postIframeLoading);
          });
        }
      });
    });
    ActivityPostDiv.appendChild(postIframe);
    ActivityPostHeaderRightDiv.append(postToggleButton, feedRefreshButton)
    ActivityPostHeaderDiv.append(feedFollowingButton, feedGlobalButton, ActivityPostHeaderRightDiv);
    feedDivMain.append(ActivityPostHeaderDiv, ActivityPostDiv, feedDivContainer);

    //Single URL Activity
    if (singleActivity) {
      $(ActivityPostHeaderDiv).hide();
      feedDivMain.style.display = 'block';
      feedToggleStatus = 1;
      $(feedToggleButton).hide();
      activeSection = "single";
      refreshTopics(activeSection);
    }
  }

  //Notification Check
  let checkNotification, checkNotification2;
  async function notifyCheck() {
    const requiredText = 'Activity Feed';
    const notifyButton = document.querySelector('.header-menu-unit.header-notification');
    if (notifyButton) {
      notifyButton.addEventListener('click', () => {
        if (!notifyChecked) {
          checkNotification = setInterval(() => {
            let notifyLength = document.querySelectorAll("#header-menu > div.header-menu-unit.header-notification > div > div > div > div > ol li:not(.empty)").length;
            if (notifyLength > 0) {
              const actNotify = $('li.header-notification-item.watched_topic_message').has(`a:contains('${requiredText}')`);
              let actLink = $(actNotify).find('a[href*="topicid"]').attr('href');
              const actId = actLink ? actLink.split('/')[4].replace('?topicid=', '') : '';
              actLink = 'https://myanimelist.net/activity/' + actId;
              $(actNotify).find('a[href*="message"]').attr('href', actLink);
              $(actNotify).find('.header-notification-item-header .category').text('Activity');
              $(actNotify).find('.header-notification-item-content.watched_topic_message > span').text('Someone replied or liked your activity');
              notifyChecked = 1;
              clearInterval(checkNotification);
              checkNotification = null;
            }
          }, 200);
        }
      });
    }
    if (location.pathname.includes('notification')) {
      checkNotification2 = setInterval(() => {
        let notifyEmpty = document.querySelector("#content > div.right-column ol.notification-item-list .notification-item.empty");
        let notifyLength = document.querySelectorAll("#content > div.right-column ol.notification-item-list li:not(.empty)").length;
        if (notifyLength > 0 && !notifyChecked_2) {
          const notifyPage = $('.notification-item.watched_topic_message').has(`a:contains('${requiredText}')`);
          let actLink = $(notifyPage).find('a[href*="topicid"]').attr('href');
          const actId = actLink ? actLink.split('/')[4].replace('?topicid=', '') : '';
          actLink = 'https://myanimelist.net/activity/' + actId;
          $(notifyPage).find('a[href*="message"]').attr('href', actLink);
          $(notifyPage).find('.notification-item-content').text('Someone replied or liked your activity');
          notifyChecked_2 = 1;
          clearInterval(checkNotification2);
          checkNotification2 = null;
        }
        if (notifyEmpty && notifyEmpty.style.display !== 'none') {
          notifyChecked_2 = 1;
          clearInterval(checkNotification2);
          checkNotification2 = null;
        }
      }, 200);
    }

  }
  notifyCheck();

  //Toggle Watch Topic (Subscribe Topic)
  async function toggleWatch(id) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const fetchUrl = `https://myanimelist.net/forum/${id}/toggle-watch`;
    const data = new URLSearchParams();
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: data.toString(),
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  //Add Like
  async function manageLike(t, id, option) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const fetchUrl = t ? `https://myanimelist.net/forum/${id}/vote/option` : `https://myanimelist.net/forum/${id}/vote/cancel`;
    const data = new URLSearchParams();
    if (t) {
      data.append('option_id', option);
    }
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: data.toString(),
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  //Add Reply Like
  async function createReplyLike(id, msg) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const fetchUrl = `https://myanimelist.net/includes/ajax.inc.php?t=82`;
    const data = new URLSearchParams();
    data.append('topicId', id);
    data.append('parentId', 0);
    data.append('messageText', msg);
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: data.toString(),
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  //Edit Reply Like
  async function editReplyLike(id, msg, msgid) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const fetchUrl = `https://myanimelist.net/forum/${id}/quickedit/${msgid}/submit`;
    const data = new URLSearchParams();
    data.append('msg_id', msgid);
    data.append('msg', msg);
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: data.toString(),
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  //Get messages
  async function getMessages(id, lastid) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const fetchUrl = `https://myanimelist.net/forum/thread/${id}/messages`;
    let allReplies = [];
    let last = lastid ? lastid : 0;
    let count = 0;
    try {
      const data = new URLSearchParams();
      data.append('parent', 0);
      data.append('maxId', 0);
      if (last > 0) {
        data.append('lastId', last);
      }
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: data.toString(),
      });
      if (response.ok) {
        const responseData = await response.json();
        allReplies = allReplies.concat(responseData.replies);
        last = responseData.after.last;
        count = responseData.after.count;
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
      return allReplies;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  //Get All Messages
  async function getAllMessages(id) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const fetchUrl = `https://myanimelist.net/forum/thread/${id}/messages`;
    let allReplies = [];
    let last = 0;
    let count = 1;

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
      while (count > 0) {
        const data = new URLSearchParams();
        data.append('parent', 0);
        data.append('maxId', 0);
        if (last > 0) {
          data.append('lastId', last);
        }

        const response = await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: data.toString(),
        });

        if (response.ok) {
          const responseData = await response.json();
          allReplies = allReplies.concat(responseData.replies);
          last = responseData.after.last;
          count = responseData.after.count;
          if (count > 0) {
            await delay(1000);
          }
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      }
      return allReplies;

    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  //Create Message Element (normal fetch)
  function createMessageElement(message) {
    const profileData = message.querySelector(".profile .username");
    let profileImage = message.querySelector(".profile a > img");
    if (!profileImage) {
      profileImage = create("a", { class: 'feed-message-profile-image', href: profileData.querySelector('a').href, style: { backgroundImage: "url(https://cdn.myanimelist.net/images/kaomoji_mal_white.png)" } });
    } else {
      profileImage.classList.add('feed-message-profile-image');
    }

    const profileDetails = create("div", { class: 'feed-message-profile-details' });
    const profileName = create("a", { class: 'feed-message-profile-name', href: profileData.querySelector('a').href });
    profileName.innerText = profileData?.innerText;
    const profileDiv = create("div", { class: 'feed-profile' });
    const messageDate = create("div", { class: 'feed-message-date' });
    let dateString = message.querySelector(".message-header .date")?.innerText;
    let dateData = message.querySelector(".message-header .date")?.getAttribute('data-time');
    let datenew = dateString.includes("hour") || dateString.includes("minutes") || dateString.includes("seconds") ? true : false;
    messageDate.innerText = datenew ? dateString : nativeTimeElement(dateData);
    messageDate.title = dateString;
    profileDetails.append(profileName, messageDate);
    profileDiv.append(profileImage, profileDetails);
    const messageContent = create("div", { class: 'feed-message-content' });
    messageContent.innerHTML = message.querySelector(".content table[id^='message']")?.innerHTML;
    const messageDiv = create("div", { class: 'feed-message' });
    messageDiv.append(profileDiv, messageContent);
    return messageDiv;
  }

  //Create Message  (api fetch)
  function createMessage(message) {
    let profileImageSrc = message.created.avatar;
    profileImageSrc = profileImageSrc ? profileImageSrc : 'https://cdn.myanimelist.net/images/kaomoji_mal_white.png';
    let profileImage = create("a", { class: 'feed-message-profile-image', href: message.created.url, style: { backgroundImage: "url(" + profileImageSrc + ")" } });
    const profileName = message.created.name;
    const profileUrl = message.created.url;
    const profileDetailsDiv = create("div", { class: 'feed-message-profile-details' });
    const profileNameDiv = create("a", { class: 'feed-message-profile-name', href: profileUrl }, profileName);
    const profileDiv = create("div", { class: 'feed-profile' });
    profileDetailsDiv.append(profileNameDiv);
    profileDiv.append(profileImage, profileDetailsDiv);
    const messageContentDiv = create("div", { class: 'feed-message-content' });
    messageContentDiv.innerHTML = message.body;
    const messageDiv = create("div", { class: 'feed-message' });
    messageDiv.append(profileDiv, messageContentDiv);
    return messageDiv;
  }

  //Create like Wrap  (api fetch)
  function createLikeWrap(user) {
    let profileImageSrc = user.created.avatar;
    profileImageSrc = profileImageSrc ? profileImageSrc : 'https://cdn.myanimelist.net/images/kaomoji_mal_white.png';
    const profile = create("a", { class: 'feed-like-wrap-user', href: user.created.url, style: { backgroundImage: "url(" + profileImageSrc + ")" } });
    return profile;
  }

  //Switch to classic topic layout (conversation layout not supported)
  async function changeTopicMode() {
    const forumIframe = create("iframe", { src: "https://myanimelist.net/forum/?topicid=516059" });
    document.body.append(forumIframe);
    forumIframe.style.display = "none";
    return new Promise((resolve, reject) => {
      $(forumIframe).on("load", function () {
        try {
          let $iframeContents = $(forumIframe).contents();
          if ($iframeContents.find('.mal-btn-group.multicolor.topic-switch-layout button:not(.outline)').attr('title').includes('conversation')) {
            const btn = $iframeContents.find('.mal-btn-group.multicolor.topic-switch-layout .outline');
            $(btn).click();
          } else {
            forumIframe.remove();
            resolve();
            return;
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  //Get Friends for Following Section
  async function getFriends(username) {
    let allFriends = [];
    let page = 1;
    try {
      while (true) {
        const response = await fetch(`https://api.jikan.moe/v4/users/${username}/friends?page=${page}`);
        const data = await response.json();
        const friends = data.data.map(friend => friend.user.username);
        allFriends = allFriends.concat(friends);
        if (!data.pagination.has_next_page) {
          break;
        }
        page++;
      }
      return allFriends;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  //Fetch only first page topic messages and create activity
  async function fetchTopicMessages(topicLink, parser, repliesActions, repliesInner) {
    const response = await fetch(topicLink);
    const pageText = await response.text();
    //topic
    const topicDoc = parser.parseFromString(pageText, 'text/html');
    const topicId = topicDoc.querySelector('#topicId')?.value;
    let totalReplies = topicDoc.querySelector('#totalReplies')?.value;
    if (!totalReplies) {
      if (singleActivity) {
        const errorPage = document.querySelector("#content > .error404");
        if (errorPage) {
          errorPage.innerText = "NOT FOUND";
          errorPage.style.textAlign = "center";
        }

      }
      return;
    }

    //check topic layout
    const topicLayout = topicDoc.querySelector('#topicLayout')?.value;
    if (topicLayout !== "timeline") {
      await changeTopicMode();
      fetchTopicMessages(topicLink, parser, repliesActions, repliesInner);
      return;
    }

    //messages
    const messages = topicDoc.querySelectorAll('.forum-topic-message[id^="msg"]').length ? topicDoc.querySelectorAll('.forum-topic-message[id^="msg"]') : topicDoc.querySelectorAll('.message[id^="msg"]');

    //watch status
    let watchTopicStatus = topicDoc.querySelector(".js-toggle-watch-topic").classList.contains('pressed') ? 1 : 0;

    //like
    const poll = topicDoc.querySelector('.topic-poll');
    const pollStatus = poll && poll.querySelector('.voted') ? 1 : 0;
    let pollLikeCount = poll && poll.querySelector('.number') ? poll.querySelector('.number').innerText : "0";
    const pollOption = poll && !pollStatus ? poll.querySelector('.topic-poll-button.js-topic-poll-vote').getAttribute('data-id') : 0;
    const likeButton = create("a", { class: 'feed-add-like-button' }, pollLikeCount);
    let likeToggle = pollStatus;
    likeToggle ? likeButton.classList.add('liked') : likeButton.classList.remove('liked');

    //like button click
    likeButton.addEventListener('click', async () => {
      let result;
      try {
        if (pollStatus) {
          result = await manageLike(0, topicId, 0);
        } else {
          result = await manageLike(1, topicId, pollOption);
        }
        if (result) {
          likeToggle = !likeToggle;
          pollLikeCount = (likeToggle)
            ? (parseInt(pollLikeCount) + 1).toString()
            : (parseInt(pollLikeCount) - 1).toString();
          likeButton.textContent = pollLikeCount;
          likeToggle ? likeButton.classList.add('liked') : likeButton.classList.remove('liked');
        }
      } catch (error) {
        alert("An error has occurred. Please try again.");
      } finally {
      }
    });

    //reply
    const replyFooterDiv = create("div", { class: 'feed-reply-footer' });
    const replyButtonDiv = topicDoc.querySelector('.topic-reply-container .topic-reply-box.fixed');
    const replyIframe = create("iframe", { src: 'about:blank', style: { display: "none" } });
    const addReplyToggleButton = create("a", { class: 'feed-add-reply-button' }, 'Add Reply');
    const replyIframeLoading = topicLoading.cloneNode(true);
    let replyIframeToggle = 0;

    //reply button click
    addReplyToggleButton.addEventListener('click', () => {
      replyIframe.style.display = 'none';
      replyIframeToggle = !replyIframeToggle;
      addReplyToggleButton.classList.toggle('feed-btn-active', replyIframeToggle);
      replyIframeToggle ? addReplyToggleButton.innerText = 'Close' : addReplyToggleButton.innerText = 'Add Reply';
      replyIframeToggle ? replyIframe.src = topicLink : replyIframe.src = 'about:blank';
      replyIframeToggle ? replyFooterDiv.after(replyIframeLoading) : '';
    });

    //topic page count
    const pagesDiv = topicDoc.querySelector('.pages');
    const pageCount = pagesDiv && pagesDiv.innerText.length > 0 ? parseInt(pagesDiv.innerText.match(/\((\d+)\)/)[1], 10) : 1;

    //Add Reply Box
    $(replyIframe).on("load", function () {
      let $iframeContents = $(replyIframe).contents();
      function reloadReplies() {
        let prevMessageCount = $iframeContents.find('.forum-topic-message[id^="msg"]').length;
        const reloadInterval = setInterval(() => {
          $iframeContents = $(replyIframe).contents();
          const currentMessageCount = $iframeContents.find('.forum-topic-message[id^="msg"]').length;
          if (currentMessageCount > prevMessageCount) {
            const updateCount = $(replyIframe).parent()?.parent()?.find('.feed-message-reply-button');
            updateCount.text((parseInt(updateCount.text()) + 1).toString());
            addReplyToggleButton.click(); //Close
            $(replyIframe).parentElement?.setAttribute('count', 0);
            repliesInner.innerHTML = '';
            loadReplies(topicLink, repliesInner);
            prevMessageCount = currentMessageCount;
            clearInterval(reloadInterval);
          }
          if ($iframeContents.length === 0) {
            clearInterval(reloadInterval);
          }
        }, 500);
      }

      if (replyIframeToggle && !$iframeContents.find(".goodresult")[0] && !$iframeContents.find(".badresult")[0]) {
        replyIframeLoading.remove();
        replyIframe.style.display = 'block';
        $iframeContents.find("#content > div.forum.timeline > .topic-reply-container > .topic-reply-bar> div.mal-btn-toolbar.left > button")[0].click();
        $iframeContents.find("div:not(#contentWrapper):not(#content):not(#myanimelist):not(.wrapper):not(.topic-reply-container):not(.topic-reply-container *):not(.forum.timeline):not(.forum.thread):not(.message)").hide();
        $iframeContents.find("#content > div.forum.timeline > div.topic-reply-container").last().remove();
        $iframeContents.find("#content > div.forum.timeline > div.topic-reply-container > div.topic-reply-box.fixed > div.mal-navbar > div > button.mal-btn.secondary.outline.js-reply-cancel").remove();
        $iframeContents.find("#content > div.forum.timeline > div.topic-reply-container > div.mal-navbar.topic-reply-bar, #content > div.forum.timeline > table.forum-topics, footer").remove();
        $iframeContents.find('html')[0].style.overflowX = 'hidden';
        $iframeContents.find('#content').css({ padding: '0', border: '0' });
        $iframeContents.find("#contentWrapper").css({ top: '0px', left: '-5px', margin: 0, padding: 0, 'min-width': 'auto', 'min-height': 'auto' });
        $iframeContents.find("#myanimelist").css({ padding: '0px 5px' });
        $iframeContents.find("#contentWrapper")[0].style.setProperty('width', 'auto', 'important');
        if (location.pathname.includes('activity')) {
          $iframeContents.find(".topic-reply-container").css({ width: '1010px', 'margin-left': '5px' });
        } else {
          $iframeContents.find(".topic-reply-container").css({ width: '720px', 'margin-left': '5px' });
        }

      }
      $($iframeContents).find('.topic-reply-container button:contains("Reply")').on("click", function () {
        reloadReplies();
      });
    });

    //load first page messages
    messages.forEach((message, index) => {
      if (index === 0) {
        const messageDiv = createMessageElement(message);
        const editButton = create("a", { class: 'feed-edit-reply-button' });
        const toggleWatchButton = create("a", { class: 'feed-watch-button fa fa-bell' });
        const LinkButton = create("a", { class: 'feed-link-button fa fa-link', href: 'https://myanimelist.net/activity/' + topicId });
        toggleWatchButton.classList.toggle('watched', watchTopicStatus);
        toggleWatchButton.addEventListener('click', async function () {
          const watchResult = await toggleWatch(topicId);
          if (watchResult) {
            toggleWatchButton.classList.toggle('watched', watchResult.watched);
          }
        });
        editButton.addEventListener('click', function () {
          editPopup($(this).parent().attr('data-id'), $(this).parent().attr('data-type'));
        });
        const username = messageDiv.querySelector('.feed-message-profile-name').innerText;
        username === $(".header-profile-link").text() ? editButton.style.display = 'block' : editButton.style.display = 'none';
        messageDiv.setAttribute('id', message.id);
        messageDiv.setAttribute('data-id', message.getAttribute('data-id'));
        messageDiv.prepend(LinkButton, toggleWatchButton, editButton);

        const repliesActionsDiv = create("div", { class: 'feed-message-reply-actions' });
        const replyDivMain = create("div", { class: 'feed-reply-main', style: { display: 'none' } });
        const toggleRepliesButton = create("a", { class: 'feed-message-reply-button' });
        toggleRepliesButton.innerText = totalReplies;
        repliesActionsDiv.appendChild(repliesActions);

        const messageDivMainContainer = create("div", { class: 'feed-message-main-container' });
        const messageDivMain = create("div", { class: 'feed-message-main' });
        messageDivMain.append(messageDiv, repliesActionsDiv);
        messageDivMainContainer.append(messageDivMain, replyDivMain);
        feedDivContainer.appendChild(messageDivMainContainer);


        // Show & Hide replies function
        toggleRepliesButton.addEventListener('click', async () => {
          replyDivMain.style.display = replyDivMain.style.display === 'none' ? 'block' : 'none';
          repliesInner.innerHTML = '';
          const loading = topicLoading.cloneNode(true);
          $(repliesInner).append(loading);
          if (!isRepliesLoading && replyDivMain.style.display === 'block') {
            isRepliesLoading = 1;
            await loadReplies(topicLink, repliesInner);
            replyDivMain.setAttribute('count', 50);
          }
        });

        repliesActions.append(toggleRepliesButton, likeButton);
        replyFooterDiv.append(addReplyToggleButton);
        replyDivMain.append(repliesInner, replyFooterDiv, replyIframe);
      }
    });
    feedDivMain.appendChild(loadMoreTopicsButton);
  }

  async function loadReplies(topicLink, repliesInner) {
    const topicId = topicLink.split('/')[4].replace('?topicid=', '');
    const username = $(".header-profile-link").text();

    //Get Replies
    let likeLoading = 0;
    let repliesBody = await getAllMessages(topicId);
    const likeRepliesBody = repliesBody.filter(item => item.body && item.body.includes(`likedReplies/`));
    repliesBody = repliesBody.filter(item => item.body && !item.body.includes(`likedReplies/`));
    const totalMessages = repliesBody.length > 1 ? (repliesBody.length - 1).toString() : "0";
    let fixLikeCount = $(repliesInner).parent().parent().find('.feed-message-reply-button');
    fixLikeCount.text(totalMessages);
    repliesBody.forEach((message, index) => {
      if (index > 0) {
        const messageId = message.id;
        const messageDiv = createMessage(message);
        const profileDate = message.created.timestamp.ago;
        const datenew = profileDate.includes("hour") || profileDate.includes("minutes") || profileDate.includes("seconds") ? true : false;
        const profileTimestamp = datenew ? profileDate : nativeTimeElement(message.created.timestamp.time);
        const messageDate = create("div", { class: 'feed-message-date' }, profileTimestamp);
        messageDate.title = message.created.timestamp.date;
        const replyActionsDiv = create("div", { class: 'feed-message-reply-actions', style: { float: 'right' } });
        const repliesDiv = create("div", { class: 'feed-message-reply' });
        const editButton = create("a", { class: 'feed-edit-reply-button' });
        const whoLikedDiv = create("div", { class: 'feed-who-liked-div' });
        const likeButton = create("a", { class: 'feed-add-like-button' });
        const likeControl = likeRepliesBody.filter(item => item.created.name === username && item.body && item.body.includes(`likedReply/${messageId}/`));
        let likeCount = likeRepliesBody.filter(item => item.body && item.body.includes(`likedReply/${messageId}/`));
        let likeWrap = create("div", { class: 'feed-like-wrap' });
        let likedUsersWrap = create("div", { class: 'feed-like-wrap-users' });
        likeCount.forEach((user, index) => {
          if (index < 5) {
            const profile = createLikeWrap(user);
            likedUsersWrap.appendChild(profile);
            likedUsersWrap.style.width = (likeCount.length * 40) + "px";
          }
          if (index > 5) {
            likeWrap.title += user.created.name + '\n';
          }
        });
        likeCount = likeCount.length > 0 ? likeCount.length : "";
        likeButton.innerText = likeCount;
        if (likeControl.length) {
          likeButton.classList.add('liked');
        };
        repliesDiv.append(messageDiv);
        messageDiv.setAttribute('data-id', messageId);
        likeWrap.append(likedUsersWrap, likeButton);
        replyActionsDiv.append(messageDate, likeWrap, editButton);
        messageDiv.prepend(replyActionsDiv);
        repliesInner.append(repliesDiv);
        editButton.addEventListener('click', function () {
          editPopup($(this).parent().parent().attr('data-id'), $(this).parent().attr('data-type'));
        });
        likeButton.addEventListener('click', async function () {
          if (!likeLoading) {
            const allLikeButtons = $(likeButton).parent().parent().parent().find('.feed-add-like-button');
            likeLoading = 1;
            $(allLikeButtons).addClass('fa fa-spinner');
            const addRegex = /(\[url=https:\/\/likedReplies\/)(.*)(]‎)/gm;
            const urlFixRegex = /<a href="([^"]+)"[^>]*>.*<\/a>/;
            const likes = await getAllMessages(topicId);
            const likedID = likes.filter(item => item.created.name === username && item.body && item.body.includes("likedReplies")).map(item => item.id).join('');
            let likedBody = likes.filter(item => item.created.name === username && item.body && item.body.includes("likedReplies")).map(item => item.body).join('');
            likedBody = likedBody.length > 0 ? likedBody.replace(urlFixRegex, '[url=$1]‎ [/url]') : likedBody;
            const messageID = $(this).parent().parent().parent().attr('data-id');
            const addLike = `likedReply/${messageID}/`;
            const defEditMessage = `Liked Replies [url=https://likedReplies/${addLike}]‎ [/url]`;
            let editMessage = "";
            if ($(likeButton).attr('class').includes('liked')) {
              //remove like
              editMessage = likedBody.length > 0 ? likedBody.replace(addLike, '') : "";
              likeButton.innerText = likeButton.innerText.length > 0 ? (parseInt(likeButton.innerText) - 1).toString() : "";
              $(likeButton).removeClass('liked');
            } else {
              //add like
              editMessage = likedBody.length > 0 ? likedBody.replace(addRegex, `$1$2${addLike}$3`) : "";
              likeButton.innerText = likeButton.innerText.length > 0 ? (parseInt(likeButton.innerText) + 1).toString() : "1";
              $(likeButton).addClass('liked');
            }
            if (!likedBody.length > 0) {
              await createReplyLike(topicId, defEditMessage);
            } else {
              await editReplyLike(topicId, editMessage, likedID);
            }
            await delay(500);
            $(allLikeButtons).removeClass('fa fa-spinner');
            likeLoading = 0;
          }
        });
      }
    });
    $(repliesInner).find('.user-history-loading').remove();
    isRepliesLoading = 0;
  }

  //Load Forum Page Topics
  async function loadForumPageTopics(currentShowParam, loadMoreButton, mode) {
    $('.feed-refresh-button').text("Loading...");
    const username = $(".header-profile-link").text();
    const friends = await getFriends(username);
    friends.push(username);
    const nextPageUrl = `${forumLink}&show=${currentShowParam}`;
    try {
      const response = await fetch(nextPageUrl);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      let topicRows = doc.querySelectorAll('tr[id^="topicRow"]');

      if (topicRows.length === 0) {
        loadMoreButton.style.display = 'none';
        topicLoading.remove();
        $('.feed-refresh-button').text("Refresh");
        return;
      }
      if (mode) {
        topicRows = Array.from(doc.querySelectorAll('tr[id^="topicRow"]'));
        topicRows = topicRows.filter(row => {
          const username = row.querySelector(".forum_postusername a")?.innerText;
          return friends.includes(username);
        });
      }
      await processTopics();
      await checkNextPage();
      async function checkNextPage() {
        if (!isTopicsLoading || topicAbortController.signal.aborted) {
          const pagesDiv = doc.querySelector("span.di-ib");
          const pageCount = pagesDiv && pagesDiv.innerText.length > 0 ? parseInt(pagesDiv.innerText.match(/\((\d+)\)/)[1], 10) : 1;
          currentShowParam += 50;
          loadMoreButton.style.display = (currentShowParam >= pageCount * 50) ? 'none' : 'block';
          topicLoading.remove();
          $('.feed-refresh-button').text("Refresh");
          const returnData = (currentShowParam >= pageCount * 50) ? 0 : 1;
          return returnData;
        }
      }

      async function processTopics() {
        if (isTopicsLoading) {
          return;
        }
        isTopicsLoading = true;
        for (const row of topicRows) {
          if (!isTopicsLoading || topicAbortController.signal.aborted) {
            $(feedDivContainer).empty();
            break;
          }
          const linkElement = row.querySelector('a[href^="/forum/?topicid"]:not(a[href^="javascript"])');
          const topicLink = linkElement ? linkElement.href : null;
          if (topicLink) {
            const repliesActions = create("div", { class: 'feed-message-reply' });
            const repliesInner = create("div", { class: 'feed-message-reply-container-inner' });
            await fetchTopicMessages(topicLink, parser, repliesActions, repliesInner);
            await delay(1000);
          }
        }
        isTopicsLoading = false;
      }
    } catch (error) {
      console.error('Error fetching forum page topics:', error);
    }
  }
})();
