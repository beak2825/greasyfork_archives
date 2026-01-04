// ==UserScript==
// @name        LRC Live
// @namespace   lrc-live
// @description Live-update (auto-refresh) LetsRun.com threads and get notified when new posts come in
// @match       https://www.letsrun.com/forum/flat_read.php*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428178/LRC%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/428178/LRC%20Live.meta.js
// ==/UserScript==

const urlParams = new URLSearchParams(window.location.search);
const pageNo = +urlParams.get('page') || 0;
const pages = document.querySelector('span.items-stretch')?.querySelectorAll('a[aria-label="pagination.goto_page"]') || [];
const lastPage = +pages[pages.length - 1]?.innerText || 0;
  
if (pageNo === lastPage) {
  const template = document.createElement('template');
  template.innerHTML = '<a role="button" title="Toggle LRC Live" class="button font-bold button-red shadow-md mt-2" style="width: 100%">Start LRC Live</a>';
  const liveButton = template.content.firstChild;

  const threadContainer = document.querySelector('div.forum-thread-page-container');
  threadContainer.parentNode.insertBefore(liveButton, threadContainer.nextSibling);

  const thread = +urlParams.get('thread');
  const posts = document.querySelectorAll('li.forum-post-container');
  const postIds = [...posts].map(post => post.querySelector('div').getAttribute('id'));
  const postList = document.querySelector('ul.post-list');
  const postCountText = document.querySelector('p.text-gray-700');
  const postCounters = postCountText ? [...postCountText.querySelectorAll('span.font-semibold')].slice(1) : [];
  let wireKey = posts.length;
  let checkPageNo = posts.length === 20 ? pageNo + 1 : pageNo;

  let enabled = false;
  let interval;
  liveButton.addEventListener('click', async () => {
    liveButton.classList.toggle('button-red');
    liveButton.classList.toggle('button-green');
    enabled = !enabled;
    
    if (enabled) {
      liveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="default-icon dbr-spin mr-2 h-3 w-3"><path d="M296 48c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm-40 376c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm248-168c0-22.091-17.909-40-40-40s-40 17.909-40 40 17.909 40 40 40 40-17.909 40-40zm-416 0c0-22.091-17.909-40-40-40S8 233.909 8 256s17.909 40 40 40 40-17.909 40-40zm20.922-187.078c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40c0-22.092-17.909-40-40-40zm294.156 294.156c-22.091 0-40 17.909-40 40s17.909 40 40 40c22.092 0 40-17.909 40-40s-17.908-40-40-40zm-294.156 0c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40z"></path></svg> LRC Live is running, new posts in this thread will appear above... (click to stop)';
      
      const perm = await Notification.requestPermission();
      const notify = perm === 'granted';
      
      interval = window.setInterval(async () => {
        try {
          const url = 'https://www.letsrun.com/forum/flat_read.php?' + new URLSearchParams({ thread, page: checkPageNo });
          const checkPage = await fetch(url);
          const checkPageText = await checkPage.text();
          const checkPageDoc = new DOMParser().parseFromString(checkPageText, 'text/html');
          const checkPosts = checkPageDoc.querySelectorAll('li.forum-post-container');
          [...checkPosts].forEach(post => {
            const postDiv = post.querySelector('div');
            const postId = postDiv.getAttribute('id');
            if (postIds.includes(postId)) return;
            postIds.push(postId);
            postDiv.setAttribute('wire:key', wireKey++);
            if (postDiv.classList.contains('mt-0')) {
              postDiv.classList.remove('mt-0');
              postDiv.classList.add('mt-1');
            }
            postList.appendChild(post);
            postCounters.forEach(pc => pc.innerText = +pc.innerText + 1);
            if (notify) {
              const n = new Notification(`LRC Live: New post in "${document.title}"`, { body: post.querySelector('div.post-body').innerText, icon: '/assets/images/letsrun-logo.png' });
              document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') n.close();
              });
            }
          });
          if (checkPosts.length === 20) checkPageNo++;
        } catch (err) { console.error(err); }
      }, 5000);
    } else {
      liveButton.innerText = 'Start LRC Live';
      window.clearInterval(interval);
    }
  });
}
