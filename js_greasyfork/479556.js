// ==UserScript==
// @name         HN Story Flagger
// @namespace    errantmind
// @version      0.61
// @author       errant
// @description  Flags and hides articles based on the domain
// @include      *://news.ycombinator.com/news
// @include      *://news.ycombinator.com/news?*
// @include      *://news.ycombinator.com/newest
// @include      *://news.ycombinator.com/newest?*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479556/HN%20Story%20Flagger.user.js
// @updateURL https://update.greasyfork.org/scripts/479556/HN%20Story%20Flagger.meta.js
// ==/UserScript==

const flaglist = [
  "theregister.com",
  "theguardian.com",
  "reuters.com",
  "cnn.com",
  "cnbc.com",
  "businessinsider.com",
  "menshealth.com",
  "wsj.com",
  "washingtonpost.com",
  "foxnews.com",
  "cbc.ca",
  "newsinteractives.cbc.ca",
  "globalnews.ca",
  "nytimes.com",
  "sfchronicle.com",
  "cryptonews.com",
  "japantimes.co.jp",
  "twitter.com",
  "theatlantic.com",
  "ft.com",
  "fortune.com",
  "sciencedaily.com",
  "ktla.com",
  "threads.net",
  "latimes.com",
  "bloomberg.com",
  "sfgate.com",
  "bbc.com",
  "axios.com",
  "sfstandard.com",
  "nysun.com",
  "nbcnews.com",
  "medicalxpress.com",
  "facebook.com",
  "yahoo.com",
  "finance.yahoo.com",
  "abc.net.au",
  "x.com",
  "furbes.com",
  "msn.com",
  "theglobeandmail.com",
  "techxplore.com",
  "linkedin.com",
  "theconversation.com",
  "slashdot.org",
  "royalgazette.com",
  "politico.eu",
  "politico.com",
  "bizjournals.com",
  "independent.co.uk",
  "fortune.com",
  "seattletimes.com",
  "wgntv.com",
  "chron.com",
  "sciencealert.com",
  "geekwire.com",
  "investors.com",
  "apnews.com",
  "scientificamerican.com",
  "brusselstimes.com",
  "replit.com",
  "blog.replit.com",
  "businesswire.com",
  "nbcwashington.com",
  "themessenger.com",
  "theintercept.com",
  "time.com",
  "msn.com",
  "fleetnews.co.uk",
  "bbc.com",
  "theinformation.com",
  "usa-made.today",
  "dw.com",
  "timesofisrael.com",
  "thetimes.co.uk",
  "pbsnc.org",
  "reddit.com",
  "barrons.com",
  "nbcdfw.com",
  "forbes.com.au",
  "old.reddit.com",
  "nltimes.nl",
  "en.globes.co.il",
  "itpro.com",
  "bbc.co.uk",
  "dailydot.com",
  "dailymail.co.uk",
  "pressreader.com",
  "ft.pressreader.com",
  "wivb.com",
  "cbsnews.com",
  "nypost.com",
  "conservative-times.com",
  "gamespot.com",
  "ca.finance.yahoo.com",
  "timesofindia.indiatimes.com",
  "nationalgeographic.com",
  "nitter.net",
  "thehill.com",
  "scitechdaily.com",
  "fxstreet.com",
  "ranker.com",
  "pcmag.com",
  "uk.pcmag.com",
  "zdnet.com",
  "channelnewsasia.com",
  "miamiherald.com",
  "abc7chicago.com",
  "thedailybeast.com",
  "bnnbloomberg.ca",
  "goodhousekeeping.com",
  "kyivpost.com",
  "electrek.co",
  "marketwatch.com",
  "espn.com",
  "newsweek.com",
  "ign.com",
  "thestar.com",
  "scmp.com",
  "businesspost.ie",
  "timesunion.com",
  "fool.com",
  "thegeopolitica.com",
  "eetimes.com",
  "nationalpost.com",
  "zmescience.com",
  "telegraph.co.uk",
  "edition.cnn.com",
  "france24.com",
  "texas43.com",
  "abc7news.com",
  "sky.com",
  "news.sky.com",
  "americanmilitarynews.com",
  "buzzfeednews.com",
  "foxbusiness.com",
  "tampabay.com",
  "tiktok.com",
  "click2houston.com",
  "businesscloud.co.uk",
  "usatoday.com",
  "news.yahoo.com",
  "english.news.cn",
  "marktechpost.com",
  "newslinker.co",
  "anix.vip",
  "techmgzn.com",
  "spectrumlocalnews.com",
  "lemonde.fr",
  "news.com.au",
  "abc7.com",
  "hashnode.dev",
  "newsboat.org",
  "globalthreat.info",
  "euronews.com",
  "oneindia.com",
  "nbcbayarea.com",
  "newslinker.co",
  "businesstechdaily.co",
  "zerohedge.com",
  "smithsonianmag.com",
  "markets.businessinsider.com",
  "bizjournals.com",
  "heatmap.news",
  "vernonmorningstar.com",
  "king5.com",
  "pcgamer.com",
  "bitcoinhaber.net",
  "en.bitcoinhaber.net",
  "coin-turk.com",
  "en.coin-turk.com",
  "cellar-invest.com",
  "businesshabit.com",
  "onioncut.com",
  "ncnewsline.com",
  "geekmetaverse.com",
  "timesofsandiego.com",
  "nbcbayarea.com",
  "cowboystatedaily.com",
  "texasmonthly.com",
  "laprensalatina.com",
  "nbcnewyork.com",
  "nbcnewyork.com",
  "kron4.com",
  "jpost.com",
  "wlbt.com",
  "askamanager.com",
  "voanews.com",
  "apple.news",
  "go.com",
  "boston.com",
  "the-sun.com",
  "irishtimes.com",
  "abcactionnews.com",
  "aol.com",
  "science.org",
  "mercurynews.com",
  "hashnode.dev",
  "businesstoday.in",
  "securityweek.com",
  "strategy-business.com",
  "neurosciencenews.com",
  "abc13.com",
  "orlandoweekly.com",
  "theweek.com",
  "thecity.nyc",
  "suntimes.com",
  "usnews.com",
  "pharmacytimes.com",
  "popularmechanics.com",
  "newscientist.com",
  "wired.com",
  "bostonglobe.com",
  "thefp.com",
  "massivesci.com",
  "aljazeera.com",
  "futurism.com",
  "techcrunch.com",
  "levernews.com",
  "dublinlive.ie",
  "thepinknews.com",
  "malwarebytes.com",
  "theverge.com",
  "replit.app",
  "npr.org",
];

const titleKeywords = [
  " Zig ",
  " Trump ",
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function titleMatches(title, keywords) {
  if (!keywords || keywords.length === 0) return false;
  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i].trim();
    if (!kw) continue;
    // Whole word/phrase, case-insensitive. \b ensures word boundaries.
    const re = new RegExp('\\b' + escapeRegExp(kw) + '\\b', 'i');
    if (re.test(title)) return true;
  }
  return false;
}

$(function() {
  // hiding doesn't trigger a full reload so we do it separately.
  let toHide = [];

  let headerTds = $('#hnmain tbody tr td');
  let headerColorElement = $(headerTds[0]);

  $('table tr.athing').each(function(i, obj) {
    let urlStr = obj.querySelector(".titleline a").href;
    const url = new URL(urlStr);

    let hostname = url.host;
    const wwwPrefix = 'www.';
    if (hostname.startsWith(wwwPrefix)) {
      hostname = hostname.substring(wwwPrefix.length);
    }

    // Title text
    const titleStr = obj.querySelector(".titleline a").textContent.trim();

    // Domain block (substring match)
    const domainBlocked = flaglist.some(d => hostname.indexOf(d) >= 0);

    // Title block (exact word/phrase match, case-insensitive)
    const keywordBlocked = titleMatches(titleStr, titleKeywords);

    if (!(domainBlocked || keywordBlocked)) return;

    $(headerColorElement).css('background-color', '#E6D52E');

    // Use nextElementSibling to skip text nodes between rows
    const detailRow = obj.nextElementSibling;
    if (!detailRow) return;

    const subline = detailRow.querySelector(".subtext .subline") || detailRow.querySelector(".subtext");
    if (!subline) return;

    const as = $(subline).find('a');

    let hasUnflag = false;
    let hasVouch = false;
    let flagObj = undefined;
    let hideObj = undefined;

    as.each(function(i, aobj) {
      const atext = $(aobj).text();

      if (atext === 'unflag') {
        hasUnflag = true;
      }

      if (atext === 'vouch') {
        hasVouch = true;
      }

      if (atext === 'flag') {
        flagObj = aobj;
      }

      if (atext === 'hide') {
        hideObj = aobj;
      }
    });

    if (!hasUnflag && !hasVouch && flagObj) {
      // flagging it if it hasn't already been flagged and it isn't already dead
      console.log('flagging due to ' + (domainBlocked ? ('domain: ' + hostname) : ('title keyword: "' + titleStr + '"')));

      setTimeout(() => {
        flagObj.click();
        console.log('flag clicked');
      }, Math.floor(Math.random() * 800) + 2000);

      // Stop processing more rows this pass (keeps behavior consistent with original script)
      return false; // breaks out of $('table tr.athing').each
    }

    if (hideObj) {
      toHide.push(hideObj);
    }
  });

  let i = 0;
  let len = toHide.length;

  if (len === 0) {
    $(headerColorElement).css('background-color', '#ff6600');
  }

  toHide.forEach(toHideObj => {
    let j = i;
    setTimeout(() => {
      toHideObj.click();
      console.log('hide clicked');

      if (j === (len - 1)) {
        $(headerColorElement).css('background-color', '#ff6600');
      }
    }, Math.floor((Math.random() * 800) + 3000) * (i + 1));

    i += 1;
  });

  if (window.location.pathname === '/newest') {
    // Generates randomized window—value cached until next reload
    const now = new Date();
    const todayKey = `${now.getMonth()}-${now.getDate()}`;
    const sessionStorageKey = 'hnRefreshWindow-' + todayKey;
    let windowData = sessionStorage.getItem(sessionStorageKey);

    if (!windowData) {
      // Generate randomized window
      const randStartOffset = Math.floor(Math.random() * 120); // mins
      const randEndOffset = Math.floor(Math.random() * 120);   // mins

      const startHour = 7;
      const endHour = 16;

      windowData = {
        startMinutes: (startHour * 60) + randStartOffset,
        endMinutes:   (endHour * 60) + randEndOffset
      };
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(windowData));
      console.log("Initialized random refresh window:", windowData);
    } else {
      windowData = JSON.parse(windowData);
    }

    function isInRefreshWindow() {
      const now = new Date();
      const minutesNow = now.getHours() * 60 + now.getMinutes();
      return minutesNow >= windowData.startMinutes && minutesNow < windowData.endMinutes;
    }

    function scheduleRefresh() {
      if (isInRefreshWindow()) {
        const delayMinutes = Math.floor(Math.random() * 11) + 10; // 10–20 min
        const delayMs = delayMinutes * 60 * 1000;
        console.log(`Page scheduled to refresh in ${delayMinutes} minutes (within active window).`);

        setTimeout(() => {
          if (isInRefreshWindow()) {
            console.log("Refreshing page now...");
            window.location.reload();
          } else {
            console.log("Now outside refresh window. Skipping refresh.");
          }
        }, delayMs);
      } else {
        console.log('Outside randomized refresh window. No auto-refresh scheduled.');
      }
    }

    scheduleRefresh();
  }
});