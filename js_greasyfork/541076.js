// ==UserScript==
// @name         FitGirl Power Pack
// @namespace    https://tampermonkey.net/
// @version      1.0.2
// @description  Dark theme, optional comments toggle, YouTube trailer link, infinite scroll, and a tag page – all in one userscript for FitGirl‑Repacks.
// @author       theovlit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fitgirl-repacks.site
// @match        https://fitgirl-repacks.site/*
// @include      https://duckduckgo.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541076/FitGirl%20Power%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/541076/FitGirl%20Power%20Pack.meta.js
// ==/UserScript==

/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);

/*****************************************************************
 * 1. DARK MODE STYLES                                            *
 *****************************************************************/
(function replaceImages() {
  const divs = document.querySelectorAll('div[style*="paw.png"]');
  divs.forEach(div => {
    div.style.backgroundImage = 'url(https://raw.githubusercontent.com/theovit/FitGirl-Power-Pack-UserScript/refs/heads/main/paw_dark.png)';
    div.style.backgroundSize = '213px auto'; // You can adjust this value
    div.style.backgroundRepeat = 'no-repeat'; // Optional: ensure no repeating
    div.style.backgroundPosition = 'top right'; // Optional: keep original alignment
    div.style.backgroundPositionY = '100px'; // shift image down
  });
  const PPA = document.querySelectorAll('a[href="https://fitgirl-repacks.site/games-with-my-personal-pink-paw-award/"]');
  PPA.forEach(el => {
    el.style.backgroundImage = 'url(https://raw.githubusercontent.com/theovit/FitGirl-Power-Pack-UserScript/refs/heads/main/paw_black_bg.png)';
    el.style.backgroundSize = '71px auto'; // You can adjust this value
    el.style.backgroundRepeat = 'no-repeat'; // Optional: ensure no repeating
    el.style.backgroundPosition = 'top right'; // Optional: keep original alignment
  });
  const garold = document.querySelectorAll('div[style*="garold1-1.jpg"]');
  garold.forEach(div => {
    div.style.backgroundImage = 'url(https://raw.githubusercontent.com/theovit/FitGirl-Power-Pack-UserScript/refs/heads/main/garold1-1-dark.jpg)';
    div.style.backgroundSize = '657px auto'; // You can adjust this value
    div.style.backgroundRepeat = 'no-repeat'; // Optional: ensure no repeating
    div.style.backgroundPosition = 'top right'; // Optional: keep original alignment
    div.style.backgroundPositionY = '-30px'; // shift image down
  });
    document.querySelectorAll('img[src="https://fitgirl-repacks.site/wp-content/uploads/2024/05/support2.jpg"]').forEach(img => {
  img.src = 'https://raw.githubusercontent.com/theovit/FitGirl-Power-Pack-UserScript/refs/heads/main/support2-dark.jpg';
});

})();


(function applyDarkTheme() {
  'use strict';

  GM_addStyle(`
    :root {
      --background-color: #121212;
      --secondary-bg-color: #1a1a1a;
      --foreground-color: #e0e0e0;
      --accent-color: #f887ff;
      --border-color: #333;
      --link-color: #80cbc4;
    }

    body {
      background: var(--background-color) !important;
      color: var(--foreground-color) !important;
    }

    img[src*="torrent-stats.info/"] {
      filter: brightness(90%) invert(100) !important;
    }


    #secondary{
      background-color: black !important;
      border-top-left-radius: unset !important;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      border-top-right-radius: unset;
    }

  .entry-content table td {
    background-color: #1a1a1a !important;
    color: #f0f0f0 !important;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

    a, a:visited {
      color: var(--link-color) !important;
    }


   .content-sidebar {
     background-color: black
   }

   h2.site-description {
     margin-top: 18px;
   }

   img[src*="support2-dark.jpg"] {
   margin: 18px 0 0 0 !important;
   }

   div[style*="paw_dark.png"] {
     background-size: 346px;
   }

    .su-spoiler-style-fancy > .su-spoiler-content {
      background-color: var(--background-color) !important;
      color: #ccc !important;
    }

    .su-spoiler-style-fancy > .su-spoiler-title,
    .su-spoiler-style-fancy.su-spoiler-closed > .su-spoiler-title {
      background-color: var(--accent-color) !important;
      color: #000 !important;
    }

    span[style*="color: black"] {
      background-color: transparent !important;
      color: red !important;
    }


    .primary-navigation .nav-menu {
      background-color: black !important;
    }

    .header-main {
      background-color: black !important;
    }

    #jBnskDj9 {
      background-color: var(--background-color) !important;
      color: var(--foreground-color) !important;
    }

    .site,
    #page,
    .wrapper,
    .container,
    .row,
    .columns,
    .column,
    .site-header,
    .site-content,
    .site-footer,
    .entry-content,
    .post,
    .comment-form,
    .entry-header,
    .entry-footer,
    .site-main,
    .page-content,
    .hentry,
    .nav-menu,
    .entry-meta,
    .site-branding {
      background-color: var(--background-color) !important;
      color: var(--foreground-color) !important;
    }

    .site:before {
      background-color: unset !important;
    }

    .site-header {
      max-width: 1519px;
      border: 1px solid var(--border-color);
    }

    .site-content .entry-meta,
    .site-content .entry-header,
    .site-content .footer.entry-meta,
    .site-content .entry-content {
      background-color: var(--secondary-bg-color) !important;
    }

    .site-main article,
    .site-content article,
    .entry-content article,
    .post article,
    body article {
      background-color: var(--secondary-bg-color) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      margin: 1.5em 0 !important;
      padding: 1em !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5) !important;
    }


    #page {
      width: 95%;
      max-width: 1400px;
      margin: 0 auto !important;
      padding: 0 1em;
    }

    #content {
      padding-left: 22px !important;

    }

    #content h3 div {
      background-image: none;
    }

    .content-sidebar {
      left: 120px;
      border-top-left-radius: unset !important;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      border-top-right-radius: unset;
    }
  `);
})();

/*****************************************************************
 * 2. TOLSTOY COMMENTS TOGGLE                                     *
 *****************************************************************/
(function toggleTolstoyComments(){
  const selector='iframe[src*="tolstoycomments.com"]';
  const poll=setInterval(()=>{
    const iframe=document.querySelector(selector);
    if(!iframe) return;
    clearInterval(poll);

    const btn=document.createElement('button');
    btn.textContent='Show Comments';
    Object.assign(btn.style,{margin:'1em 0',padding:'0.5em 1em',background:'var(--accent-color)',color:'#121212',border:'none',borderRadius:'4px',cursor:'pointer',fontWeight:'bold'});

    iframe.parentNode.insertBefore(btn,iframe);
    iframe.style.display='none';

    let visible=false;
    btn.addEventListener('click',()=>{
      visible=!visible;
      iframe.style.display=visible?'block':'none';
      btn.textContent=visible?'Hide Comments':'Show Comments';
    });
  },300);
})();

/*****************************************************************
 * 3. YOUTUBE TRAILER LINK                                        *
 *****************************************************************/
(function YouTubeTrailerLinks($){
    function addYouTubeTrailerLinks() {
        $('article').each(function() {
            const $article = $(this);
            const $title = $article.find('.entry-title');

            // Skip if already processed
            if ($article.find('.nframe').length > 0) return;

            const rawTitleText = $title.text();

            // Attempt to extract the clean title using known patterns
            const dashMatch = rawTitleText.match(/^(.*?)(?=\s+\u2013)/); // Matches " –"
            const plusMatch = rawTitleText.match(/^(.*?)(?=\s+\+)/); // Matches " +"

            let cleanedTitle;

            if (dashMatch) {
                cleanedTitle = dashMatch[1];
            } else if (plusMatch) {
                cleanedTitle = plusMatch[1];
            } else {
                cleanedTitle = rawTitleText;
            }

            const encodedQuery = encodeURIComponent(cleanedTitle);
            const searchUrl = `https://duckduckgo.com/?hps=1&q=%21+site%3Ayoutube.com+${encodedQuery}+trailer+video+game`;

            // Find the specific metadata <p> block by style attribute
            const $metaBlock = $article.find('p[style*="height: 200px"]');
            if ($metaBlock.length > 0) {
                const iconHTML = '<br><a class="nframe entry-meta a" href="' + searchUrl + '" title="YouTube Trailer">' +
                                 '<img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" width="20" height="20" style="vertical-align: middle;">' +
                                 '</a>';
                $metaBlock.append(iconHTML);
            }
        });

        // Open links in centered pop-up window
        $(document).off('click', 'a.nframe').on('click', 'a.nframe', function(e) {
            e.preventDefault();
            const url = $(this).attr("href");

            const width = screen.width * 0.75;
            const height = screen.height * 0.75;
            const left = (screen.width - width) / 2;
            const top = (screen.height - height) / 2;

            const params = [
                `width=${width}`,
                `height=${height}`,
                `top=${top}`,
                `left=${left}`,
                'directories=no',
                'location=no',
                'menubar=no',
                'resizable=yes',
                'scrollbars=no',
                'status=no',
                'toolbar=no'
            ].join(', ');

            const newWindow = window.open(url, 'subpop', params);
            if (window.focus && newWindow) newWindow.focus();

            return false;
        });
    }

    // Run initially and every 2 seconds to catch new content
    addYouTubeTrailerLinks();
    setInterval(addYouTubeTrailerLinks, 2000);

    // Auto-trigger DuckDuckGo search if on results page
    const isDuckDuckGo = window.location.host === 'duckduckgo.com';
    const autoTriggerPattern = /^! site:youtube\.com/;
    if (isDuckDuckGo && autoTriggerPattern.test(document.title)) {
        $("#search_button").click();
    }

})(jQuery);

/*****************************************************************
 * 4. INFINITE SCROLL                                            *
 *****************************************************************/
(function infiniteScroll(){
  let loading=false;
  async function loadNext(){
    if(loading) return;
    const next=document.querySelector('a.next.page-numbers');
    if(!next) return;
    loading=true;
    try{
      const html=await (await fetch(next.href)).text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      const articles=[...doc.querySelectorAll('article')];
      const nav=document.querySelector('nav.navigation');
      const parent=nav?nav.parentNode:document.querySelector('main')||document.body;
      articles.forEach(a=>parent.insertBefore(a,nav||null));
      const newNext=doc.querySelector('a.next.page-numbers');
      if(newNext&&next){next.href=newNext.href;} else if(next){next.remove();}
    }catch(err){console.error('FG infinite scroll error',err);} finally{loading=false;}
  }
  window.addEventListener('scroll',()=>{
    const next=document.querySelector('a.next.page-numbers');
    if(!next) return;
    if(next.getBoundingClientRect().top<window.innerHeight+300) loadNext();
  });
})();

/*****************************************************************
 * 45. TAG Injector                                              *
 *****************************************************************/

(async function TagInjecotr() {
  'use strict';

  if (window.location.pathname !== '/tags') return;

  // Update <title> tag in <head>
  document.title = 'Tags - FitGirl Repacks';

  // Replace header text
  const header = document.querySelector('header.page-header h1.page-title');
  if (header) {
    header.textContent = 'All FitGirl Tags';
    header.style.color = '#f887ff';
  }

  // Find page content block
  const contentDiv = document.querySelector('div.page-content');
  if (!contentDiv) return;

  // Remove "not found" paragraph
  const notFoundPara = contentDiv.querySelector('p');
  if (notFoundPara) notFoundPara.remove();

  // Style update (optional)
  contentDiv.style.paddingTop = '1em';

  // Create and insert a tag container
  const tagContainer = document.createElement('div');
  tagContainer.innerHTML = `<p style="margin:1em 0;color:#ccc;">Loading tags…</p>`;
  contentDiv.appendChild(tagContainer);

  // Fetch tags from WP REST API
  const perPage = 100;
  let page = 1;
  let allTags = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`https://fitgirl-repacks.site/wp-json/wp/v2/tags?per_page=${perPage}&page=${page}`);
    if (!res.ok) break;
    const tags = await res.json();
    allTags.push(...tags);
    hasMore = tags.length === perPage;
    page++;
  }

  // Replace "Loading…" with actual tag list
  tagContainer.innerHTML = `
    <h2 style="color:#f887ff;">Tag Index (${allTags.length})</h2>
    <ul style="list-style:none;padding-left:0;line-height:1.6;">
      ${allTags.map(tag =>
        `<li><a href="https://fitgirl-repacks.site/tag/${tag.slug}/" style="color:#80cbc4;text-decoration:none;" target="_blank">${tag.name}</a></li>`
      ).join('')}
    </ul>
  `;
})();

(function addStandaloneTagsMenuItem() {
  const menu = document.querySelector('#primary-menu');
  if (!menu) return;

  const li = document.createElement('li');
  li.className = 'menu-item menu-item-type-custom';
  li.innerHTML = `<a href="https://fitgirl-repacks.site/tags">Tags</a>`;

  menu.appendChild(li);
})();

(function fixDonatePage() {
  'use strict';

  const fixTables = () => {
    document.querySelectorAll('.entry-content table').forEach((table) => {
      // Skip if already wrapped
      if (table.parentElement && table.parentElement.classList.contains('fg-scroll-wrapper')) return;

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'fg-scroll-wrapper';
      wrapper.style.overflowX = 'auto';
      wrapper.style.maxWidth = '100%';

      // Style table
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.tableLayout = 'fixed';

      // Style cells
      table.querySelectorAll('td, th').forEach(cell => {
        cell.style.wordBreak = 'break-word';
        cell.style.overflowWrap = 'anywhere';
      });

      // Wrap the table
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  };

  // Run on load
  window.addEventListener('load', fixTables);
})();