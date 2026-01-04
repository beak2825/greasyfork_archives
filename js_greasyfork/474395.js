// ==UserScript==
// @name        GreasyFork: One Click Report Spam
// @name:zh-TW  GreasyFork 一鍵回報垃圾評論
// @name:zh-CN  GreasyFork 一键回报垃圾评论
// @namespace   UserScripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     1.9
// @author      CY Fung
// @license     MIT
// @description To report spam comments in Greasy Fork with one click
// @description:zh-TW 在 Greasy Fork 一鍵回報垃圾評論
// @description:zh-CN 在 Greasy Fork 一键回报垃圾评论
// @downloadURL https://update.greasyfork.org/scripts/474395/GreasyFork%3A%20One%20Click%20Report%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/474395/GreasyFork%3A%20One%20Click%20Report%20Spam.meta.js
// ==/UserScript==

(() => {

  const TEST_MODE = 0;
  let skipMode = false;

  const onIframeLoad = async (evt) => {
    const iframe = evt.target;
    if (!(iframe instanceof HTMLIFrameElement)) return;

    if (skipMode) return;


    const onNewUrl = async () => {
      skipMode = true;

      alert('reported');
      await new Promise(requestAnimationFrame);
      iframe.remove();
      skipMode = false;

    }
    const onAbort = async () => {
      skipMode = true;

      await new Promise(requestAnimationFrame);
      iframe.remove();
      skipMode = false;
    }

    iframe.removeEventListener('load', onIframeLoad, false);

    if (!iframe.contentDocument) {
      alert('Iframe Access Error. Action aborted.');
      onAbort();
      return;
    }


    const reportReasonRadio = iframe.contentDocument.querySelector('input[name="report[reason]"]');
    if (reportReasonRadio) {
      for(const s of iframe.contentDocument.querySelectorAll('html, body, main')){
        s.style.scrollBehavior = 'auto';
      }
      reportReasonRadio.scrollIntoView();
      await new Promise(requestAnimationFrame);
      reportReasonRadio.click();
      const form = reportReasonRadio.closest('form');
      let currentUrl = iframe.contentWindow.location.pathname;
      skipMode = true;
      if (TEST_MODE) {

        iframe.contentWindow.location.href = 'https://greasyfork.org/'
      } else {
        form.submit();
      }
      let cid = setInterval(() => {
        if (!cid) return;
        let nextUrl = iframe.contentWindow.location.pathname;
        if (nextUrl !== currentUrl) {
          clearInterval(cid)
          cid = 0;
          setTimeout(onNewUrl, 300);
        }
      }, 100)

    } else if (iframe.contentDocument.querySelector('#open-report-:not(:empty)')) {
      alert("The spam report is already submitted for moderator's review. Action aborted.");
      onAbort();

    } else {
      alert('Cannot find the report[reason] radio button. Action aborted.');
      onAbort();
    }

  };
  const clickHandler = (evt) => {
    evt.preventDefault();
    if (!(evt.target instanceof HTMLElement)) return;
    let url = evt.target.getAttribute('ohref');
    if (!url) return;
    let discussionId = /id=(\d+)\b/.exec(url);
    if (discussionId) discussionId = discussionId[1];
    let r = window.confirm(`Confirm to report discussion#${discussionId || "------"} ?`);
    if (!r) return;
    const iframe = document.createElement('iframe');
    skipMode = false;
    iframe.addEventListener('load', onIframeLoad, false);
    iframe.name = "u423323";
    iframe.src = url;
    Object.assign(iframe.style, {
      display: 'block',
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '300px',
      height: '300px',
      'contain': 'strict',
    });
    document.body.appendChild(iframe);
  }


  for (const anchor of document.querySelectorAll('a[href*="/reports/new?item_class=comment&item_id="],a[href*="/reports/new?item_class=discussion&item_id="]')) {

    let anchorNode = anchor;
    if (anchor.parentNode.firstElementChild === anchor.parentNode.lastElementChild) {
      anchorNode = anchorNode.parentNode;
    }
    let newAnchorNode = anchorNode.cloneNode(true);
    let newAnchor = newAnchorNode.querySelector('a[href]') || newAnchorNode;
    newAnchor.classList.add('report-spam-btn');
    newAnchor.setAttribute('ohref', newAnchor.getAttribute('href'));
    newAnchor.setAttribute('href', '#');
    newAnchor.addEventListener('click', clickHandler, false)
    newAnchor.textContent = 'Report Spam';
    anchorNode.parentNode.insertBefore(newAnchorNode, anchorNode.nextSibling);


  }

  document.head.appendChild(document.createElement('style')).textContent=`
  .discussion-list-container{
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  }
  .discussion-list-container > .discussion-list-item {
      flex-grow:1;
      width:0;
  }
  .discussion-list-container > .discussion-list-item ~ .report-spam-btn {
      align-self: center;
  }
  `

  setTimeout(()=>{

    if(document.querySelector('ul#user-control-panel')) return;

    for(const li of document.querySelectorAll('.discussion-list-item')){

      let a = li.querySelector('a[href*="/discussions/"].discussion-title');
      if(!a) continue;
      let href = a.getAttribute('href');
      let idx = href.lastIndexOf('/discussions/');
      let discussionId = parseInt(href.substring(idx+'/discussions/'.length)||0);
      if(isNaN(discussionId) || discussionId < 0)continue;

      let btn = document.createElement('a');
      btn.classList.add('report-spam-btn');
      btn.setAttribute('ohref', 'https://greasyfork.org/en/reports/new?item_class=discussion&item_id='+discussionId)
      btn.setAttribute('href','#')
      btn.textContent='Report Spam';
      btn.addEventListener('click', clickHandler, false)
      li.parentNode.insertBefore(btn, li.nextSibling);


    }

  }, 270);

})();