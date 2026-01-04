// ==UserScript==
// @name         YouTube Keyword Blocker (Whole‑Word Mode)
// @description  Hide YouTube homepage videos by blacklisted words in title or channel name
// @match        https://www.youtube.com/*
// @run-at       document-end
// @version 0.0.1.20250717110136
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535217/YouTube%20Keyword%20Blocker%20%28Whole%E2%80%91Word%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535217/YouTube%20Keyword%20Blocker%20%28Whole%E2%80%91Word%20Mode%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // skip “results” and “@channel” pages
  if (location.pathname.startsWith('/results') || location.pathname.startsWith('/@')) return;

  // 1) List words
  const terms = [
 'candace owens','mike israetel','Triggernometry','andrew tate', 'codie sanchez','Psyphoria','sadia psychology','penguinz0','unhinged', 'business insider', 'matt ferrell', 'vox', 'kuwait', 'wwe', 'andrew schulz', 'andrew huberman', 'john cena', 'rfk', 'cbs', 'piers morgan', 'bein sports', 'mike thurston', 'Gordon Ramsay', 'Kat Williams', 'Vince McMahon', 'Stephen Curry', 'ben affleck', 'ishowspeed', 'BuzzFeedVideo', 'First We Feast', 'shocking', 'Michael Franzese', 'david dobrik', 'kevin hart', 'the rubin report', 'amazon', 'meta', 'u.s', 'nginx', 'nyt', 'french', 'uber', 'china', 'social media', 'accused', 'openai', 'britain', 'qualcomm', 'adobe', 'fined', 'google', 'kotlin', 'uk', 'california', 'motivational', 'heroku', 'israel', 'killed', 'eu', 'raises concerns', 'guru', 'punished', 'abuse', 'aws', 'targets', 'firefox', 'notion', 'poker', 'nasa', 'condemned', 'big tech', 'ozempic', 'twitter', 'struggle', 'android', 'unix', 'us', 'ios', 'chinese', 'iran', 'iranian', 'nintendo', 'nyc', 'nvidia', 'verizon', 'piracy', 'panic', 'kill', 'whatsapp', 'europe', 'mac os', 'fbi', 'chatgpt', 'musk', 'tokyo', 'german', 'covid', 'series a', 'english', 'texas', 'dhl', 'github', 'wordpress', 'dangerous', 'stripe', 'stolen', 'prada', 'netflix', 'fcc', 'arabs', 'intel', 'php', 'llm', 'python', 'wp', 'microsoft', 'volkswagen', 'gitlab', 'laravel', '23andMe', 'seo', 'fallacy', 'attacks', 'windows', 'emacs', 'samsung', 'youtube', 'florida', 'degens', 'paul graham', 'germany', 'nostr', 'saas', 'americans', 'vite', 'disaster', 'autism', 'cyberattacks', 'facebook', 'fraud', 'bayesian', 'euro', 'trump', 'falsely', 'lsd', 'ai', 'productive', 'llms', 'chrome', 'political', 'global warming', 'zendesk', 'failed', 'typescript', 'starbucks', 'web app', 'y combinator', 'beijing', 'large language models', 'is dead. long live the', 'india', 'git', 'language models', 'lisp', 'foursquare', 'rails', 'redis', 'cloudflare', 'golang', 'sql', 'ibm', 'tim cook', 'america', 'waymo', 'postgresql', 'isis', 'russia', 'notebooklm', 'australian', 'flutter', 'duckdb', 'kubernetes', 'prime number', 'cia', 'ftc', 'reddit', 'shipfast', 'protest', 'hubspot', 'nortel', 'disney', 'react', 'rust', 'european', 'nestjs', 'nsa', 'failure', 'discord', 'russian', 'linkedin', 'democrats', 'nextjs', 'idf', 'huawei', 'duckduckgo', 'apple', 'war', 'north korea', 'boeing', 'normcore', 'taiwan', 'upwork', 'tesla', 'mcdonald\'s', 'russians', 'israeli', 'kamala harris', 'sony', 'posix', 'un', 'crowdstrike', 'unitedhealth', 'webassembly', 'magnus carlsen', 'jeff bezos', 'honda', 'docker compose', 'baltimore', 'ipad', 'berkeley', 'alaska', 'adhd', 'sqlite', 'harris', 'marijuana', 'north korean', 'instagram', 'biden', 'japan', 'japanese', 'kentucky', 'node.js', 'wikipedia', 'firestore', 'azure', 'moscow', 'ticketmaster', 'at&t', 'steve ballmer', 'canada', 'figma', 'mcmaster carr', 'shopify', 'fly.io', 'llama', 'washington post', 'dropbox', 'openssl', 'hetzner', 'ubuntu', 'ssh', 'kafka', 'spotify', 'australia', 'colorado', 'vmware', 'pascal', 'chromium', 'htmx', 'stack overflow', 'slack', 'nhl', 'steve jobs', 'british', 'leetcode', 'rivian', 'pouchdb', 'jquery', 'next.js', 'dostoevsky', 'django', 'ukraine', 'duolingo', 'dynamodb', 'new york times', 'nazi', 'hitler', 'npm', 'tiktok', 'perplexity', 'the left', 'fifa', 'hyundai', 'unreal engine', 'anxiety', 'zuckerberg', 'bluesky', 'marc andreesen', 'marc andreessen', 'spacex', 'ollama', 'akamai', 'chegg', 'lyft', 'isaac asimov', 'berlin', 'argentina', 'mozilla', 'sega', 'yami', 'gm', 'macos', 'trojan', 'tailwindcss', 'eric schmidt', 'san francisco', 'ufo', 'altman', 'starlink', 'avengers', 'tailwind css', 'telegram', 'dubai', 'ukrainian', 'claims', 'pakistani', 'tom brady', 'italy', 'zynga', 'saudi arabia', 'pytorch', 'half-life', 'tsmc', 'harvard', 'illusion', 'grok-3', 'elon', 'utah', 'job', 'delta', 'casio', 'amd', 'roblox', 'monsanto', 'hiring', 'steam', 'mercedes', 'oracle', 'tailwind', 'police', 'crime', 'putin', 'nike', 'jobs', 'ddos', 'censorship', 'genocide', 'substack', 'banana', 'ms', 'mysql', 'sec', 'graphql', 'cannabis', 'sues', 'kernel', 'openbsd', 'excel', 'sf', 'denmark', 'ny', 'threat', 'keynes', 'haskell', 'hacker news', 'macy\'s', 'nato', 'louisiana', 'joe rogan', 'convicts', 'south korea', 'threads', 't-mobile', 'abused', 'exxon', 'estonian', 'new zealand', 'clojure', 'is dead', 'long live', 'geico', 'scrum', 'worst', 'gmail', '(2022)', 'costco', 'pokémon', 'denver', 'turkish', 'the verge', 'enron', 'fucking', 'cisco', 'execution', 'national-security', 'roger penrose', 'chuck e. cheese', 'incel', 'b2b', 'exxonmobil', 'shein.com', 'draftkings', 'unitedhealthcare', 'ufos', 'toyota', 'deepfake', 'dei', 'misinformation', 'lockheed', 'grok', 'greece', 'wall street', 'shooter', 'nobel', 'murdering', 'deadly', 'luigi mangione', 'ban', 'andy grove', 'vitalik buterin', 'shooting', 'todo', 'audible', 'spain', 'infowars', 'london', 'fired', 'chromebook', 'netlify', 'corporate', 'billionaires', 'canadian', 'crumbl', 'coinbase', 'paul krugman', 'rupert murdoch', 'atlassian', 'austin', 'geniuses', 'carta', 'new jersey', 'north koreans', 'lg', 'assad', 'michael dell', 'murder', 'svelte', 'tinder', 'palantir', 'south korean', 'anthropic', 'kanban', 'pomodoro', 'yahoo', 'warren buffett', 'arrested', 'scumbag', 'brain rot', 'cobol', 'Robert Kennedy', 'turkey', 'prison', 'gaza', 'mazda', 'killing', 'hayat tahrir', 'memecoins', 'netscape', 'spyware', 'fascism', 'fartcoin', 'beware', 'assassination', 'h-1b', 'perforce', 'novo nordisk', 'warning', 'walmart', 'fortinet', 'career', 'obsidian', 'nba', 'broadcom', 'alarm', 'mlb', 'britannica', 'scam', 'blackrock', 'burning man', 'safety', 'france', 'pac-man', 'youtuber', 'nixos', 'mongodb', 'jetbrains', 'the sean carrolls', 'xerox', 'redditors', 'mossad', 'perl', 'elixir', 'ruby', 'nix', 'clang', 'fincen', 'al jazeera', 'hawaii', 'xai', 'el salvador', 'italian', 'claude', 'raspberry pi', 'new york', 'bitwarden', 'azerbaijan', 'fedora', 'malaysia', 'christmas', 'death row', 'league of legends', 'bbc', 'scylladb', 'bitcoin', 'santa', 'arduino', 'dutch', 'finland', 'backgammon', 'canon', 'advent of code', 'wayland', 'lilium', 'hertz', 'nypd', 'norway', 'redditor', 'prime minister', 'chess', 'chromeos', 'carter', 'stephen hawking', 'solidjs', 'nietzsche', 'magnus', 'vivek ramaswamy', 'larry ellison', 'los angeles', 'trudeau', 'firebase', 'lenovo', 'ces', 'matt gaetz', 'salesforce', 'strikes back', 'bill ackman', 'zuck', 'ceo', 'linus torvalds', 'nokia', 'scala', 'lua', 'jpmorgan', 'ebay', 'saturday night live', 'la', 'mrbeast', 'antisemitic', 'terrifying', 'wildfires', 'pepsi', 'sonos', 'nikita bier', 'scientists', 'indian', 'ceasefire', 'caltech', 'honey', 'milei', 'tucker carlson', 'godaddy', 'christians', 'mr. beast', 'david lynch', 'wildfire', 'rednote', 'brits', 'hijacked', 'nick cave', 'kaggle', 'dystopia', 'gumroad', 'worse', 'houthis', 'rolls-royce', 'klarna', 'bambulab', 'frank sinatra', 'bambu', 'suspects', 'united states', 'complexity', 'vcs', 'wsj', 'yc', 'citi', 'agnes callard', 'stack exchange', 'bytedance', 'scammers', '1password', 'turso', 'cuda', 'fitbit', 'terrorist', 'terence tao', 'republican', 'airbnb', 'collides', 'brexit', 'pokemon', 'mvp', 'quora', 'ford', 'drm', 'barclays', 'politics', 'hell', 'linux', 'von neumann', 'rubik\'s cube', 'dell', 'swift', 'java', 'tetris', 'patrick collison', 'simon and schuster', 'visa', 'racist', 'revolut', 'jfk', 'mastercard', 'grubhub', 'bill gates', 'vanguard', 'proton mail', 'andreessen horowitz', 'a16z', 'state farm', 'alphabet', 'climate change', 'andreesen-horowitz', 'harvards', 'vc', 'transgender', 'delaware', 'deliveroo', 'honeywell', 'extremism', 'René Girard', 'pinterest', 'steve wynn', 'maga', 'doge', 'american', 'peril', 'drowning', 'authoritarian', 'ransomware', 'god', 'destroying', 'paypal', 'gamestop', 'quantum mechanics', 'cnn', 'deloitte', 'authoritarianism', 'taleb', 'clickhouse', 'usaid', 'ashlee vance', 'chevron', 'feds', 'gemini', 'murdochs', 'kagi', 'crms', 'cdc', 'white house', 'peter thiel', 'kindle', 'elasticsearch', 'office365', 'systemd', 'vercel', 'robert frost', 'hp', 'islam', 'marvel', 'crm', 'zillow', 'racial', 'far right', 'pentagon', 'imgur', 'sweden', 'autodesk', 'warzone', 'etsy', 'javascript', 'deepseek', 'ferrari', 'hunan', 'thai', 'bybit', 'nuxt', 'docker', 'asia', 'mexico', 'brazil', 'typeform', 'laliga', 'switzerland', 'fortnite', 'trans', 'asus', 'shazam', 'xcode', 'bp', 'jeep', 'jamie dimon', 'markdown', 'threatens', 'vs code', 'chile', 'george orwell', 'bezos', 'elevenlabs', 'msnbc', 'evil', 'iraqi', 'swedish', 'teslas', 'pakistan', 'chicago', 'icloud', 'kia', 'citigroup', 'nigeria', 'ea', 'motorola', 'portugal', 'skype', '(2013)', '(2023)', '(2019)', 'bmw', 'Sergey Brin', 'netanyahu', 'lawsuit', 'hulu', 'usa', 'xbox', 'rockstar games', '(2016)', '(1993)', 'darpa', 'dji', 'a.i', 'gop', 'iphone', '(2008)', 'digg', 'kennedy', '(2024)', 'britons', 'tolstoy', 'walgreens', '(2012)', 'Northrop Grumman', 'collisons', 'Ora­cle', '(2015)', '(2000)', '(2017)', 'software', 'zelenskyy', '(2009)', 'gta', '(2020)', '(2021)', '(2006)', 'vim', 'founder', '(2018)', 'nasdaq', 'skool', 'alibaba', '(1975)', 'gemma', 'Sam Bankman-Fried', 'niantic', 'abc', 'playstation', 'bootstrap', 'citibank', 'Visual Studio', 'dodge', 'cursor', 'neovim', '(2001)', 'baidu', '(2010)', '(2014)', 'motivation', 'softbank', 'dakota', '(2011)', '(1997)', 'plex', 'segway', '(2003)', 'espn', 'grand theft auto', '(2004)', 'napster', 'pixelfed', 'karpathy', 'vibe coding', 'coreweave', '(2005)', 'deel', 'porsche', 'jsx', '4chan', 'postgres', 'vultr', 'mcp', 'gpt', 'jira', 'devs', 'Anti-Vaxxers', 'hegseth', 'vibe code', 'ray dalio'
  ];

  // 2) Convert to RegExp objects with \b boundaries, case‑insensitive
  const blacklist = terms.map(term => {
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${esc}\\b`, 'i');
  });

  const ITEM_SELECTOR = 'ytd-rich-item-renderer'; /*, ytd-rich-grid-media, ytd-video-renderer*/
  const TITLE_SELECTOR = '#video-title';
  const CHANNEL_SELECTOR = 'ytd-channel-name a';

  function filterItem(item) {

    // skip “results” and “@channel” pages on dynamic loads
    if (location.pathname.startsWith('/results') ||
      location.pathname.startsWith('/@')) return;

    // skip if we've already seen this node
    if (item.dataset.keywordBlocked) return;
    item.dataset.keywordBlocked = '1';

    const linkEl = item.querySelector('a#video-title-link');
    const title = linkEl
      ? linkEl.getAttribute('aria-label').trim()
      : '‹no title›';
    console.log('› filterItem saw:', item.tagName, title);

    const channelEl = item.querySelector(CHANNEL_SELECTOR);
    const channel = channelEl ? channelEl.textContent.trim() : '';

    for (const re of blacklist) {
      if (re.test(title) || re.test(channel)) {
        console.log(
          `Blocking video:\n` +
          `  title:   "${title}"\n` +
          `  channel: "${channel}"\n` +
          `  matched: ${re}`
        );
        item.style.display = 'none';
        return;
      }
    }
  }

function scanPage() {
  // skip “results” and “@channel” pages on every scan
  if (location.pathname.startsWith('/results') ||
    location.pathname.startsWith('/@')) {
    console.log('will not filter');
    return;
  }
  document.querySelectorAll(ITEM_SELECTOR).forEach(filterItem);
}

  new MutationObserver(mutations => {

    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(ITEM_SELECTOR)) filterItem(node);
        else node.querySelectorAll && node.querySelectorAll(ITEM_SELECTOR).forEach(filterItem);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  scanPage();

  window.addEventListener('yt-navigate-finish', scanPage);
})();