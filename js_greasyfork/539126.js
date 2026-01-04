// ==UserScript==
// @name         ft mute with whole and partial word support
// @description  Hide elements based on matching whole or partial words in data-trackable-context-story-type attribute using visibility: hidden
// @match        *://*.ft.com/*
// @version 0.0.1.20250612082741
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539126/ft%20mute%20with%20whole%20and%20partial%20word%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/539126/ft%20mute%20with%20whole%20and%20partial%20word%20support.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Updated muted words array
  const mutedWords = [
  {
    "phrase": "LGBTQ",
    "whole_word": true
  },
  {
    "phrase": "apple",
    "whole_word": true
  },
  {
    "phrase": "gendered",
    "whole_word": true
  },
  {
    "phrase": "delusion",
    "whole_word": true
  },
  {
    "phrase": "fuckin'",
    "whole_word": true
  },
  {
    "phrase": "dystopia",
    "whole_word": true
  },
  {
    "phrase": "Billionaires",
    "whole_word": true
  },
  {
    "phrase": "moron",
    "whole_word": true
  },
  {
    "phrase": "disaster",
    "whole_word": true
  },
  {
    "phrase": "republicans",
    "whole_word": true
  },
  {
    "phrase": "biden",
    "whole_word": true
  },
  {
    "phrase": "complaining",
    "whole_word": true
  },
  {
    "phrase": "Fascism",
    "whole_word": true
  },
  {
    "phrase": "Duolingo",
    "whole_word": true
  },
  {
    "phrase": "stupid",
    "whole_word": true
  },
  {
    "phrase": "fascist",
    "whole_word": true
  },
  {
    "phrase": "fucking",
    "whole_word": true
  },
  {
    "phrase": "swift",
    "whole_word": true
  },
  {
    "phrase": "Kubernetes",
    "whole_word": true
  },
  {
    "phrase": "bullshit",
    "whole_word": true
  },
  {
    "phrase": "disinformation",
    "whole_word": true
  },
  {
    "phrase": "paranoid",
    "whole_word": true
  },
  {
    "phrase": "swiftui",
    "whole_word": true
  },
  {
    "phrase": "nazis",
    "whole_word": true
  },
  {
    "phrase": "pro-trump",
    "whole_word": true
  },
  {
    "phrase": "mastodon",
    "whole_word": true
  },
  {
    "phrase": "nvidia",
    "whole_word": true
  },
  {
    "phrase": "hyundai",
    "whole_word": true
  },
  {
    "phrase": "gm",
    "whole_word": true
  },
  {
    "phrase": "elon musk",
    "whole_word": true
  },
  {
    "phrase": "ipod",
    "whole_word": true
  },
  {
    "phrase": "nyt",
    "whole_word": true
  },
  {
    "phrase": "china's",
    "whole_word": true
  },
  {
    "phrase": "nazi",
    "whole_word": true
  },
  {
    "phrase": "trump",
    "whole_word": true
  },
  {
    "phrase": "scam",
    "whole_word": true
  },
  {
    "phrase": "google",
    "whole_word": true
  },
  {
    "phrase": "discount",
    "whole_word": true
  },
  {
    "phrase": "annoying",
    "whole_word": true
  },
  {
    "phrase": "hate",
    "whole_word": true
  },
  {
    "phrase": "exploited",
    "whole_word": true
  },
  {
    "phrase": "social media",
    "whole_word": true
  },
  {
    "phrase": "gop",
    "whole_word": true
  },
  {
    "phrase": "butt-hurt",
    "whole_word": true
  },
  {
    "phrase": "enron",
    "whole_word": true
  },
  {
    "phrase": "subscribe",
    "whole_word": true
  },
  {
    "phrase": "discord",
    "whole_word": true
  },
  {
    "phrase": "newsletter",
    "whole_word": true
  },
  {
    "phrase": "intel",
    "whole_word": true
  },
  {
    "phrase": "ukraine",
    "whole_word": true
  },
  {
    "phrase": "u.s.",
    "whole_word": true
  },
  {
    "phrase": "shopify",
    "whole_word": true
  },
  {
    "phrase": "reckless",
    "whole_word": true
  },
  {
    "phrase": "spam",
    "whole_word": true
  },
  {
    "phrase": "serial killer",
    "whole_word": true
  },
  {
    "phrase": "Pokémon",
    "whole_word": true
  },
  {
    "phrase": "covid",
    "whole_word": true
  },
  {
    "phrase": "twitter",
    "whole_word": true
  },
  {
    "phrase": "microsoft",
    "whole_word": true
  },
  {
    "phrase": "apple's",
    "whole_word": true
  },
  {
    "phrase": "reddit",
    "whole_word": true
  },
  {
    "phrase": "musk",
    "whole_word": true
  },
  {
    "phrase": "putin",
    "whole_word": true
  },
  {
    "phrase": "Matt Gaetz",
    "whole_word": true
  },
  {
    "phrase": "eu",
    "whole_word": true
  },
  {
    "phrase": "toxic",
    "whole_word": true
  },
  {
    "phrase": "crazy",
    "whole_word": true
  },
  {
    "phrase": "extreme",
    "whole_word": true
  },
  {
    "phrase": "mentally ill",
    "whole_word": true
  },
  {
    "phrase": "least",
    "whole_word": true
  },
  {
    "phrase": "cyber monday",
    "whole_word": true
  },
  {
    "phrase": "korea",
    "whole_word": true
  },
  {
    "phrase": "#abortion",
    "whole_word": true
  },
  {
    "phrase": "shitpost",
    "whole_word": true
  },
  {
    "phrase": "antifa",
    "whole_word": true
  },
  {
    "phrase": "pride",
    "whole_word": true
  },
  {
    "phrase": "oracle",
    "whole_word": true
  },
  {
    "phrase": "Horny",
    "whole_word": true
  },
  {
    "phrase": "jewish",
    "whole_word": true
  },
  {
    "phrase": "zionist",
    "whole_word": true
  },
  {
    "phrase": "antisemetic",
    "whole_word": true
  },
  {
    "phrase": "oligarchs",
    "whole_word": true
  },
  {
    "phrase": "oligarch",
    "whole_word": true
  },
  {
    "phrase": "eat the rich",
    "whole_word": true
  },
  {
    "phrase": "#furry",
    "whole_word": true
  },
  {
    "phrase": "second amendment",
    "whole_word": true
  },
  {
    "phrase": "jews",
    "whole_word": true
  },
  {
    "phrase": "Hugz & xXx",
    "whole_word": true
  },
  {
    "phrase": "kitten",
    "whole_word": true
  },
  {
    "phrase": "#dogsofmastodon",
    "whole_word": true
  },
  {
    "phrase": "#auspol",
    "whole_word": true
  },
  {
    "phrase": "disaster",
    "whole_word": true
  },
  {
    "phrase": "autism",
    "whole_word": true
  },
  {
    "phrase": "cyberattacks",
    "whole_word": true
  },
  {
    "phrase": "facebook",
    "whole_word": true
  },
  {
    "phrase": "fraud",
    "whole_word": true
  },
  {
    "phrase": "bayesian",
    "whole_word": true
  },
  {
    "phrase": "euro",
    "whole_word": true
  },
  {
    "phrase": "trump",
    "whole_word": true
  },
  {
    "phrase": "falsely",
    "whole_word": true
  },
  {
    "phrase": "lsd",
    "whole_word": true
  },
  {
    "phrase": "ai",
    "whole_word": true
  },
  {
    "phrase": "productive",
    "whole_word": true
  },
  {
    "phrase": "llms",
    "whole_word": true
  },
  {
    "phrase": "chrome",
    "whole_word": true
  },
  {
    "phrase": "political",
    "whole_word": true
  },
  {
    "phrase": "global warming",
    "whole_word": true
  },
  {
    "phrase": "zendesk",
    "whole_word": true
  },
  {
    "phrase": "failed",
    "whole_word": true
  },
  {
    "phrase": "starbucks",
    "whole_word": true
  },
  {
    "phrase": "web app",
    "whole_word": true
  },
  {
    "phrase": "y combinator",
    "whole_word": true
  },
  {
    "phrase": "beijing",
    "whole_word": true
  },
  {
    "phrase": "large language models",
    "whole_word": true
  },
  {
    "phrase": "is dead. long live the",
    "whole_word": true
  },
  {
    "phrase": "india",
    "whole_word": true
  },
  {
    "phrase": "git",
    "whole_word": true
  },
  {
    "phrase": "language models",
    "whole_word": true
  },
  {
    "phrase": "lisp",
    "whole_word": true
  },
  {
    "phrase": "foursquare",
    "whole_word": true
  },
  {
    "phrase": "rails",
    "whole_word": true
  },
  {
    "phrase": "redis",
    "whole_word": true
  },
  {
    "phrase": "asexuality",
    "whole_word": true
  },
  {
    "phrase": "antisemites",
    "whole_word": true
  },
  {
    "phrase": "ceo",
    "whole_word": true
  },
  {
    "phrase": "tim cook",
    "whole_word": true
  },
  {
    "phrase": "trumpism",
    "whole_word": true
  },
  {
    "phrase": "sex",
    "whole_word": true
  },
  {
    "phrase": "#antifa",
    "whole_word": true
  },
  {
    "phrase": "420",
    "whole_word": true
  },
  {
    "phrase": "misogyny",
    "whole_word": true
  },
  {
    "phrase": "manosphere",
    "whole_word": true
  },
  {
    "phrase": "transrights",
    "whole_word": true
  },
  {
    "phrase": "on strike",
    "whole_word": true
  },
  {
    "phrase": "Fucker",
    "whole_word": true
  },
  {
    "phrase": "motherfuckers",
    "whole_word": true
  },
  {
    "phrase": "russia's",
    "whole_word": true
  },
  {
    "phrase": "kyiv",
    "whole_word": true
  },
  {
    "phrase": "DEI",
    "whole_word": true
  },
  {
    "phrase": "fuckwit",
    "whole_word": true
  },
  {
    "phrase": "measles",
    "whole_word": true
  },
  {
    "phrase": "capitalism",
    "whole_word": true
  },
  {
    "phrase": "#bot",
    "whole_word": true
  },
  {
    "phrase": "American",
    "whole_word": true
  },
  {
    "phrase": "Gay",
    "whole_word": true
  },
  {
    "phrase": "Maga",
    "whole_word": true
  },
  {
    "phrase": "Erotica",
    "whole_word": true
  },
  {
    "phrase": "Fired",
    "whole_word": true
  },
  {
    "phrase": "fuck",
    "whole_word": true
  },
  {
    "phrase": "AfD",
    "whole_word": true
  },
  {
    "phrase": "republicans",
    "whole_word": true
  },
  {
    "phrase": "oppressors",
    "whole_word": true
  },
  {
    "phrase": "syria",
    "whole_word": true
  },
  {
    "phrase": "senator",
    "whole_word": true
  },
  {
    "phrase": "denialism",
    "whole_word": true
  },
  {
    "phrase": "cloudflare",
    "whole_word": true
  },
  {
    "phrase": "golang",
    "whole_word": true
  },
  {
    "phrase": "sql",
    "whole_word": true
  },
  {
    "phrase": "ibm",
    "whole_word": true
  },
  {
    "phrase": "tim cook",
    "whole_word": true
  },
  {
    "phrase": "america",
    "whole_word": true
  },
  {
    "phrase": "waymo",
    "whole_word": true
  },
  {
    "phrase": "postgresql",
    "whole_word": true
  },
  {
    "phrase": "isis",
    "whole_word": true
  },
  {
    "phrase": "russia",
    "whole_word": true
  },
  {
    "phrase": "notebooklm",
    "whole_word": true
  },
  {
    "phrase": "australian",
    "whole_word": true
  },
  {
    "phrase": "flutter",
    "whole_word": true
  },
  {
    "phrase": "duckdb",
    "whole_word": true
  },
  {
    "phrase": "kubernetes",
    "whole_word": true
  },
  {
    "phrase": "prime number",
    "whole_word": true
  },
  {
    "phrase": "cia",
    "whole_word": true
  },
  {
    "phrase": "ftc",
    "whole_word": true
  },
  {
    "phrase": "reddit",
    "whole_word": true
  },
  {
    "phrase": "shipfast",
    "whole_word": true
  },
  {
    "phrase": "protest",
    "whole_word": true
  },
  {
    "phrase": "hubspot",
    "whole_word": true
  },
  {
    "phrase": "nortel",
    "whole_word": true
  },
  {
    "phrase": "disney",
    "whole_word": true
  },
  {
    "phrase": "react",
    "whole_word": true
  },
  {
    "phrase": "rust",
    "whole_word": true
  },
  {
    "phrase": "european",
    "whole_word": true
  },
  {
    "phrase": "nestjs",
    "whole_word": true
  },
  {
    "phrase": "nsa",
    "whole_word": true
  },
  {
    "phrase": "failure",
    "whole_word": true
  },
  {
    "phrase": "discord",
    "whole_word": true
  },
  {
    "phrase": "russian",
    "whole_word": true
  },
  {
    "phrase": "linkedin",
    "whole_word": true
  },
  {
    "phrase": "democrats",
    "whole_word": true
  },
  {
    "phrase": "nextjs",
    "whole_word": true
  },
  {
    "phrase": "idf",
    "whole_word": true
  },
  {
    "phrase": "huawei",
    "whole_word": true
  },
  {
    "phrase": "duckduckgo",
    "whole_word": true
  },
  {
    "phrase": "apple",
    "whole_word": true
  },
  {
    "phrase": "war",
    "whole_word": true
  },
  {
    "phrase": "north korea",
    "whole_word": true
  },
  {
    "phrase": "boeing",
    "whole_word": true
  },
  {
    "phrase": "normcore",
    "whole_word": true
  },
  {
    "phrase": "taiwan",
    "whole_word": true
  },
  {
    "phrase": "upwork",
    "whole_word": true
  },
  {
    "phrase": "tesla",
    "whole_word": true
  },
  {
    "phrase": "mcdonald's",
    "whole_word": true
  },
  {
    "phrase": "russians",
    "whole_word": true
  },
  {
    "phrase": "israeli",
    "whole_word": true
  },
  {
    "phrase": "kamala harris",
    "whole_word": true
  },
  {
    "phrase": "sony",
    "whole_word": true
  },
  {
    "phrase": "posix",
    "whole_word": true
  },
  {
    "phrase": "un",
    "whole_word": true
  },
  {
    "phrase": "crowdstrike",
    "whole_word": true
  },
  {
    "phrase": "unitedhealth",
    "whole_word": true
  },
  {
    "phrase": "webassembly",
    "whole_word": true
  },
  {
    "phrase": "magnus carlsen",
    "whole_word": true
  },
  {
    "phrase": "jeff bezos",
    "whole_word": true
  },
  {
    "phrase": "honda",
    "whole_word": true
  },
  {
    "phrase": "docker compose",
    "whole_word": true
  },
  {
    "phrase": "baltimore",
    "whole_word": true
  },
  {
    "phrase": "ipad",
    "whole_word": true
  },
  {
    "phrase": "berkeley",
    "whole_word": true
  },
  {
    "phrase": "alaska",
    "whole_word": true
  },
  {
    "phrase": "adhd",
    "whole_word": true
  },
  {
    "phrase": "sqlite",
    "whole_word": true
  },
  {
    "phrase": "harris",
    "whole_word": true
  },
  {
    "phrase": "marijuana",
    "whole_word": true
  },
  {
    "phrase": "amazon",
    "whole_word": true
  },
  {
    "phrase": "meta",
    "whole_word": true
  },
  {
    "phrase": "u.s",
    "whole_word": true
  },
  {
    "phrase": "nginx",
    "whole_word": true
  },
  {
    "phrase": "nyt",
    "whole_word": true
  },
  {
    "phrase": "french",
    "whole_word": true
  },
  {
    "phrase": "uber",
    "whole_word": true
  },
  {
    "phrase": "china",
    "whole_word": true
  },
  {
    "phrase": "social media",
    "whole_word": true
  },
  {
    "phrase": "accused",
    "whole_word": true
  },
  {
    "phrase": "openai",
    "whole_word": true
  },
  {
    "phrase": "britain",
    "whole_word": true
  },
  {
    "phrase": "qualcomm",
    "whole_word": true
  },
  {
    "phrase": "adobe",
    "whole_word": true
  },
  {
    "phrase": "fined",
    "whole_word": true
  },
  {
    "phrase": "google",
    "whole_word": true
  },
  {
    "phrase": "kotlin",
    "whole_word": true
  },
  {
    "phrase": "uk",
    "whole_word": true
  },
  {
    "phrase": "california",
    "whole_word": true
  },
  {
    "phrase": "motivational",
    "whole_word": true
  },
  {
    "phrase": "heroku",
    "whole_word": true
  },
  {
    "phrase": "israel",
    "whole_word": true
  },
  {
    "phrase": "killed",
    "whole_word": true
  },
  {
    "phrase": "eu",
    "whole_word": true
  },
  {
    "phrase": "raises concerns",
    "whole_word": true
  },
  {
    "phrase": "guru",
    "whole_word": true
  },
  {
    "phrase": "punished",
    "whole_word": true
  },
  {
    "phrase": "abuse",
    "whole_word": true
  },
  {
    "phrase": "aws",
    "whole_word": true
  },
  {
    "phrase": "targets",
    "whole_word": true
  },
  {
    "phrase": "firefox",
    "whole_word": true
  },
  {
    "phrase": "notion",
    "whole_word": true
  },
  {
    "phrase": "poker",
    "whole_word": true
  },
  {
    "phrase": "nasa",
    "whole_word": true
  },
  {
    "phrase": "condemned",
    "whole_word": true
  },
  {
    "phrase": "big tech",
    "whole_word": true
  },
  {
    "phrase": "ozempic",
    "whole_word": true
  },
  {
    "phrase": "twitter",
    "whole_word": true
  },
  {
    "phrase": "struggle",
    "whole_word": true
  },
  {
    "phrase": "android",
    "whole_word": true
  },
  {
    "phrase": "unix",
    "whole_word": true
  },
  {
    "phrase": "us",
    "whole_word": true
  },
  {
    "phrase": "ios",
    "whole_word": true
  },
  {
    "phrase": "chinese",
    "whole_word": true
  },
  {
    "phrase": "iran",
    "whole_word": true
  },
  {
    "phrase": "iranian",
    "whole_word": true
  },
  {
    "phrase": "nintendo",
    "whole_word": true
  },
  {
    "phrase": "nyc",
    "whole_word": true
  },
  {
    "phrase": "nvidia",
    "whole_word": true
  },
  {
    "phrase": "verizon",
    "whole_word": true
  },
  {
    "phrase": "piracy",
    "whole_word": true
  },
  {
    "phrase": "panic",
    "whole_word": true
  },
  {
    "phrase": "kill",
    "whole_word": true
  },
  {
    "phrase": "whatsapp",
    "whole_word": true
  },
  {
    "phrase": "europe",
    "whole_word": true
  },
  {
    "phrase": "mac os",
    "whole_word": true
  },
  {
    "phrase": "fbi",
    "whole_word": true
  },
  {
    "phrase": "chatgpt",
    "whole_word": true
  },
  {
    "phrase": "musk",
    "whole_word": true
  },
  {
    "phrase": "tokyo",
    "whole_word": true
  },
  {
    "phrase": "german",
    "whole_word": true
  },
  {
    "phrase": "covid",
    "whole_word": true
  },
  {
    "phrase": "series a",
    "whole_word": true
  },
  {
    "phrase": "english",
    "whole_word": true
  },
  {
    "phrase": "texas",
    "whole_word": true
  },
  {
    "phrase": "dhl",
    "whole_word": true
  },
  {
    "phrase": "github",
    "whole_word": true
  },
  {
    "phrase": "wordpress",
    "whole_word": true
  },
  {
    "phrase": "dangerous",
    "whole_word": true
  },
  {
    "phrase": "stripe",
    "whole_word": true
  },
  {
    "phrase": "stolen",
    "whole_word": true
  },
  {
    "phrase": "prada",
    "whole_word": true
  },
  {
    "phrase": "netflix",
    "whole_word": true
  },
  {
    "phrase": "fcc",
    "whole_word": true
  },
  {
    "phrase": "arabs",
    "whole_word": true
  },
  {
    "phrase": "intel",
    "whole_word": true
  },
  {
    "phrase": "php",
    "whole_word": true
  },
  {
    "phrase": "llm",
    "whole_word": true
  },
  {
    "phrase": "python",
    "whole_word": true
  },
  {
    "phrase": "wp",
    "whole_word": true
  },
  {
    "phrase": "microsoft",
    "whole_word": true
  },
  {
    "phrase": "volkswagen",
    "whole_word": true
  },
  {
    "phrase": "gitlab",
    "whole_word": true
  },
  {
    "phrase": "laravel",
    "whole_word": true
  },
  {
    "phrase": "23andMe",
    "whole_word": true
  },
  {
    "phrase": "seo",
    "whole_word": true
  },
  {
    "phrase": "fallacy",
    "whole_word": true
  },
  {
    "phrase": "attacks",
    "whole_word": true
  },
  {
    "phrase": "windows",
    "whole_word": true
  },
  {
    "phrase": "emacs",
    "whole_word": true
  },
  {
    "phrase": "samsung",
    "whole_word": true
  },
  {
    "phrase": "youtube",
    "whole_word": true
  },
  {
    "phrase": "florida",
    "whole_word": true
  },
  {
    "phrase": "degens",
    "whole_word": true
  },
  {
    "phrase": "paul graham",
    "whole_word": true
  },
  {
    "phrase": "germany",
    "whole_word": true
  },
  {
    "phrase": "nostr",
    "whole_word": true
  },
  {
    "phrase": "americans",
    "whole_word": true
  },
  {
    "phrase": "vite",
    "whole_word": true
  },
  {
    "phrase": "north korean",
    "whole_word": true
  },
  {
    "phrase": "instagram",
    "whole_word": true
  },
  {
    "phrase": "biden",
    "whole_word": true
  },
  {
    "phrase": "japan",
    "whole_word": true
  },
  {
    "phrase": "japanese",
    "whole_word": true
  },
  {
    "phrase": "kentucky",
    "whole_word": true
  },
  {
    "phrase": "wikipedia",
    "whole_word": true
  },
  {
    "phrase": "firestore",
    "whole_word": true
  },
  {
    "phrase": "azure",
    "whole_word": true
  },
  {
    "phrase": "moscow",
    "whole_word": true
  },
  {
    "phrase": "ticketmaster",
    "whole_word": true
  },
  {
    "phrase": "at&t",
    "whole_word": true
  },
  {
    "phrase": "steve ballmer",
    "whole_word": true
  },
  {
    "phrase": "canada",
    "whole_word": true
  },
  {
    "phrase": "figma",
    "whole_word": true
  },
  {
    "phrase": "mcmaster carr",
    "whole_word": true
  },
  {
    "phrase": "shopify",
    "whole_word": true
  },
  {
    "phrase": "fly.io",
    "whole_word": true
  },
  {
    "phrase": "llama",
    "whole_word": true
  },
  {
    "phrase": "washington post",
    "whole_word": true
  },
  {
    "phrase": "dropbox",
    "whole_word": true
  },
  {
    "phrase": "openssl",
    "whole_word": true
  },
  {
    "phrase": "kafka",
    "whole_word": true
  },
  {
    "phrase": "spotify",
    "whole_word": true
  },
  {
    "phrase": "australia",
    "whole_word": true
  },
  {
    "phrase": "colorado",
    "whole_word": true
  },
  {
    "phrase": "vmware",
    "whole_word": true
  },
  {
    "phrase": "pascal",
    "whole_word": true
  },
  {
    "phrase": "chromium",
    "whole_word": true
  },
  {
    "phrase": "htmx",
    "whole_word": true
  },
  {
    "phrase": "stack overflow",
    "whole_word": true
  },
  {
    "phrase": "slack",
    "whole_word": true
  },
  {
    "phrase": "nhl",
    "whole_word": true
  },
  {
    "phrase": "steve jobs",
    "whole_word": true
  },
  {
    "phrase": "british",
    "whole_word": true
  },
  {
    "phrase": "leetcode",
    "whole_word": true
  },
  {
    "phrase": "rivian",
    "whole_word": true
  },
  {
    "phrase": "pouchdb",
    "whole_word": true
  },
  {
    "phrase": "jquery",
    "whole_word": true
  },
  {
    "phrase": "next.js",
    "whole_word": true
  },
  {
    "phrase": "dostoevsky",
    "whole_word": true
  },
  {
    "phrase": "django",
    "whole_word": true
  },
  {
    "phrase": "ukraine",
    "whole_word": true
  },
  {
    "phrase": "duolingo",
    "whole_word": true
  },
  {
    "phrase": "dynamodb",
    "whole_word": true
  },
  {
    "phrase": "new york times",
    "whole_word": true
  },
  {
    "phrase": "nazi",
    "whole_word": true
  },
  {
    "phrase": "hitler",
    "whole_word": true
  },
  {
    "phrase": "npm",
    "whole_word": true
  },
  {
    "phrase": "tiktok",
    "whole_word": true
  },
  {
    "phrase": "perplexity",
    "whole_word": true
  },
  {
    "phrase": "the left",
    "whole_word": true
  },
  {
    "phrase": "fifa",
    "whole_word": true
  },
  {
    "phrase": "hyundai",
    "whole_word": true
  },
  {
    "phrase": "unreal engine",
    "whole_word": true
  },
  {
    "phrase": "anxiety",
    "whole_word": true
  },
  {
    "phrase": "zuckerberg",
    "whole_word": true
  },
  {
    "phrase": "bluesky",
    "whole_word": true
  },
  {
    "phrase": "marc andreesen",
    "whole_word": true
  },
  {
    "phrase": "marc andreessen",
    "whole_word": true
  },
  {
    "phrase": "spacex",
    "whole_word": true
  },
  {
    "phrase": "ollama",
    "whole_word": true
  },
  {
    "phrase": "akamai",
    "whole_word": true
  },
  {
    "phrase": "chegg",
    "whole_word": true
  },
  {
    "phrase": "lyft",
    "whole_word": true
  },
  {
    "phrase": "isaac asimov",
    "whole_word": true
  },
  {
    "phrase": "berlin",
    "whole_word": true
  },
  {
    "phrase": "argentina",
    "whole_word": true
  },
  {
    "phrase": "mozilla",
    "whole_word": true
  },
  {
    "phrase": "sega",
    "whole_word": true
  },
  {
    "phrase": "yami",
    "whole_word": true
  },
  {
    "phrase": "gm",
    "whole_word": true
  },
  {
    "phrase": "macos",
    "whole_word": true
  },
  {
    "phrase": "trojan",
    "whole_word": true
  },
  {
    "phrase": "tailwindcss",
    "whole_word": true
  },
  {
    "phrase": "eric schmidt",
    "whole_word": true
  },
  {
    "phrase": "san francisco",
    "whole_word": true
  },
  {
    "phrase": "ufo",
    "whole_word": true
  },
  {
    "phrase": "altman",
    "whole_word": true
  },
  {
    "phrase": "starlink",
    "whole_word": true
  },
  {
    "phrase": "avengers",
    "whole_word": true
  },
  {
    "phrase": "tailwind css",
    "whole_word": true
  },
  {
    "phrase": "telegram",
    "whole_word": true
  },
  {
    "phrase": "dubai",
    "whole_word": true
  },
  {
    "phrase": "ukrainian",
    "whole_word": true
  },
  {
    "phrase": "claims",
    "whole_word": true
  },
  {
    "phrase": "pakistani",
    "whole_word": true
  },
  {
    "phrase": "tom brady",
    "whole_word": true
  },
  {
    "phrase": "italy",
    "whole_word": true
  },
  {
    "phrase": "zynga",
    "whole_word": true
  },
  {
    "phrase": "saudi arabia",
    "whole_word": true
  },
  {
    "phrase": "pytorch",
    "whole_word": true
  },
  {
    "phrase": "half-life",
    "whole_word": true
  },
  {
    "phrase": "tsmc",
    "whole_word": true
  },
  {
    "phrase": "harvard",
    "whole_word": true
  },
  {
    "phrase": "illusion",
    "whole_word": true
  },
  {
    "phrase": "grok-3",
    "whole_word": true
  },
  {
    "phrase": "elon",
    "whole_word": true
  },
  {
    "phrase": "utah",
    "whole_word": true
  },
  {
    "phrase": "delta",
    "whole_word": true
  },
  {
    "phrase": "casio",
    "whole_word": true
  },
  {
    "phrase": "amd",
    "whole_word": true
  },
  {
    "phrase": "roblox",
    "whole_word": true
  },
  {
    "phrase": "monsanto",
    "whole_word": true
  },
  {
    "phrase": "steam",
    "whole_word": true
  },
  {
    "phrase": "mercedes",
    "whole_word": true
  },
  {
    "phrase": "tailwind",
    "whole_word": true
  },
  {
    "phrase": "police",
    "whole_word": true
  },
  {
    "phrase": "crime",
    "whole_word": true
  },
  {
    "phrase": "putin",
    "whole_word": true
  },
  {
    "phrase": "nike",
    "whole_word": true
  },
  {
    "phrase": "ddos",
    "whole_word": true
  },
  {
    "phrase": "censorship",
    "whole_word": true
  },
  {
    "phrase": "genocide",
    "whole_word": true
  },
  {
    "phrase": "substack",
    "whole_word": true
  },
  {
    "phrase": "banana",
    "whole_word": true
  },
  {
    "phrase": "ms",
    "whole_word": true
  },
  {
    "phrase": "mysql",
    "whole_word": true
  },
  {
    "phrase": "sec",
    "whole_word": true
  },
  {
    "phrase": "graphql",
    "whole_word": true
  },
  {
    "phrase": "cannabis",
    "whole_word": true
  },
  {
    "phrase": "sues",
    "whole_word": true
  },
  {
    "phrase": "openbsd",
    "whole_word": true
  },
  {
    "phrase": "excel",
    "whole_word": true
  },
  {
    "phrase": "sf",
    "whole_word": true
  },
  {
    "phrase": "denmark",
    "whole_word": true
  },
  {
    "phrase": "ny",
    "whole_word": true
  },
  {
    "phrase": "threat",
    "whole_word": true
  },
  {
    "phrase": "keynes",
    "whole_word": true
  },
  {
    "phrase": "haskell",
    "whole_word": true
  },
  {
    "phrase": "hacker news",
    "whole_word": true
  },
  {
    "phrase": "macy's",
    "whole_word": true
  },
  {
    "phrase": "nato",
    "whole_word": true
  },
  {
    "phrase": "louisiana",
    "whole_word": true
  },
  {
    "phrase": "joe rogan",
    "whole_word": true
  },
  {
    "phrase": "convicts",
    "whole_word": true
  },
  {
    "phrase": "south korea",
    "whole_word": true
  },
  {
    "phrase": "threads",
    "whole_word": true
  },
  {
    "phrase": "t-mobile",
    "whole_word": true
  },
  {
    "phrase": "abused",
    "whole_word": true
  },
  {
    "phrase": "exxon",
    "whole_word": true
  },
  {
    "phrase": "estonian",
    "whole_word": true
  },
  {
    "phrase": "new zealand",
    "whole_word": true
  },
  {
    "phrase": "clojure",
    "whole_word": true
  },
  {
    "phrase": "is dead",
    "whole_word": true
  },
  {
    "phrase": "long live",
    "whole_word": true
  },
  {
    "phrase": "geico",
    "whole_word": true
  },
  {
    "phrase": "scrum",
    "whole_word": true
  },
  {
    "phrase": "worst",
    "whole_word": true
  },
  {
    "phrase": "gmail",
    "whole_word": true
  },
  {
    "phrase": "(2022)",
    "whole_word": true
  },
  {
    "phrase": "costco",
    "whole_word": true
  },
  {
    "phrase": "pokémon",
    "whole_word": true
  },
  {
    "phrase": "denver",
    "whole_word": true
  },
  {
    "phrase": "turkish",
    "whole_word": true
  },
  {
    "phrase": "the verge",
    "whole_word": true
  },
  {
    "phrase": "enron",
    "whole_word": true
  },
  {
    "phrase": "fucking",
    "whole_word": true
  },
  {
    "phrase": "climate change",
    "whole_word": true
  },
  {
    "phrase": "intoxicating",
    "whole_word": true
  },
  {
    "phrase": "United States",
    "whole_word": true
  },
  {
    "phrase": "dystopian",
    "whole_word": true
  },
  {
    "phrase": "demokratie",
    "whole_word": true
  },
  {
    "phrase": "dems",
    "whole_word": true
  },
  {
    "phrase": "ukraine",
    "whole_word": true
  },
  {
    "phrase": "sexually",
    "whole_word": true
  },
  {
    "phrase": "queer",
    "whole_word": true
  },
  {
    "phrase": "lesbian",
    "whole_word": true
  },
  {
    "phrase": "nsfw",
    "whole_word": true
  },
  {
    "phrase": "easter",
    "whole_word": true
  },
  {
    "phrase": "protests",
    "whole_word": true
  },
  {
    "phrase": "political",
    "whole_word": true
  },
  {
    "phrase": "incels",
    "whole_word": true
  },
  {
    "phrase": "incel",
    "whole_word": true
  },
  {
    "phrase": "trans",
    "whole_word": true
  },
  {
    "phrase": "dnc",
    "whole_word": true
  },
  {
    "phrase": "corrupt",
    "whole_word": true
  },
  {
    "phrase": "transgender",
    "whole_word": true
  },
  {
    "phrase": "transphobia",
    "whole_word": true
  },
  {
    "phrase": "4chan",
    "whole_word": true
  },
  {
    "phrase": "hegseth",
    "whole_word": true
  },
  {
    "phrase": "fascists",
    "whole_word": true
  },
  {
    "phrase": "🏳️‍⚧️",
    "whole_word": true
  },
  {
    "phrase": "wordle",
    "whole_word": true
  },
  {
    "phrase": "monsterdon",
    "whole_word": true
  },
  {
    "phrase": "sexual",
    "whole_word": true
  },
  {
    "phrase": "diaper",
    "whole_word": true
  },
  {
    "phrase": "hugz",
    "whole_word": true
  },
  {
    "phrase": "Cis",
    "whole_word": true
  },
  {
    "phrase": "neurodivergent",
    "whole_word": true
  },
  {
    "phrase": "charlatans",
    "whole_word": true
  },
  {
    "phrase": "far-right",
    "whole_word": true
  },
  {
    "phrase": "bbc",
    "whole_word": true
  },
  {
    "phrase": "Girl",
    "whole_word": true
  },
  {
    "phrase": "ice",
    "whole_word": true
  },
  {
    "phrase": ".com",
    "whole_word": false
  },
  {
    "phrase": "anti-vax",
    "whole_word": true
  },
  {
    "phrase": ".net",
    "whole_word": false
  },
  {
    "phrase": ".de",
    "whole_word": false
  },
  {
    "phrase": "pope",
    "whole_word": true
  },
  {
    "phrase": "canadians",
    "whole_word": true
  },
  {
    "phrase": "totp",
    "whole_word": true
  },
  {
    "phrase": "Labour Party",
    "whole_word": true
  },
  {
    "phrase": "right-wing",
    "whole_word": true
  },
  {
    "phrase": "white house",
    "whole_word": true
  },
  {
    "phrase": "#caturday",
    "whole_word": true
  },
  {
    "phrase": "caturday",
    "whole_word": true
  },
  {
    "phrase": "supramacist",
    "whole_word": true
  },
  {
    "phrase": "slut",
    "whole_word": true
  },
  {
    "phrase": "cishet",
    "whole_word": true
  },
  {
    "phrase": "vote",
    "whole_word": true
  },
  {
    "phrase": "tits",
    "whole_word": true
  },
  {
    "phrase": "right wing",
    "whole_word": true
  },
  {
    "phrase": "Artspam",
    "whole_word": true
  },
  {
    "phrase": "Catboy",
    "whole_word": true
  },
  {
    "phrase": "Meme",
    "whole_word": true
  },
  {
    "phrase": "leftist",
    "whole_word": true
  },
  {
    "phrase": "#rats",
    "whole_word": true
  },
  {
    "phrase": "#petrats",
    "whole_word": true
  },
  {
    "phrase": "Prime Minister",
    "whole_word": true
  },
  {
    "phrase": "vilify",
    "whole_word": true
  },
  {
    "phrase": "toXiv_bot_toot",
    "whole_word": true
  },
  {
    "phrase": "biden's",
    "whole_word": true
  },
  {
    "phrase": "Uspol",
    "whole_word": true
  },
  {
    "phrase": "Republican",
    "whole_word": true
  },
  {
    "phrase": "lie",
    "whole_word": true
  },
  {
    "phrase": "PBS",
    "whole_word": true
  },
  {
    "phrase": "HRT",
    "whole_word": true
  },
  {
    "phrase": "capitalist",
    "whole_word": true
  },
  {
    "phrase": "eugenicists",
    "whole_word": true
  },
  {
    "phrase": "npr",
    "whole_word": true
  },
  {
    "phrase": "furryart",
    "whole_word": true
  },
  {
    "phrase": "bra",
    "whole_word": true
  },
  {
    "phrase": "USA",
    "whole_word": true
  },
  {
    "phrase": "Trumps",
    "whole_word": true
  },
  {
    "phrase": "misogynists",
    "whole_word": true
  },
  {
    "phrase": "Parliament",
    "whole_word": true
  },
  {
    "phrase": "demokratische",
    "whole_word": true
  },
  {
    "phrase": "obama",
    "whole_word": true
  },
  {
    "phrase": "conservatives",
    "whole_word": true
  },
  {
    "phrase": "#politicalprisoners",
    "whole_word": true
  },
  {
    "phrase": "typescript",
    "whole_word": true
  },
  {
    "phrase": "asshole",
    "whole_word": true
  },
  {
    "phrase": "lesbians",
    "whole_word": true
  },
  {
    "phrase": "girls",
    "whole_word": true
  },
  {
    "phrase": "gender",
    "whole_word": true
  },
  {
    "phrase": "gays",
    "whole_word": true
  },
  {
    "phrase": "heterosexuals",
    "whole_word": true
  },
  {
    "phrase": "transfem",
    "whole_word": true
  },
  {
    "phrase": "men",
    "whole_word": true
  },
  {
    "phrase": "genderfluid",
    "whole_word": true
  },
  {
    "phrase": "autistic",
    "whole_word": true
  },
  {
    "phrase": "autism",
    "whole_word": true
  },
  {
    "phrase": "autist",
    "whole_word": true
  },
  {
    "phrase": "antivaxxer",
    "whole_word": true
  },
  {
    "phrase": "marginalized",
    "whole_word": true
  },
  {
    "phrase": "bitch",
    "whole_word": true
  },
  {
    "phrase": "contemptuous",
    "whole_word": true
  },
  {
    "phrase": "cowardly",
    "whole_word": true
  },
  {
    "phrase": "androgynous",
    "whole_word": true
  },
  {
    "phrase": "irritating",
    "whole_word": true
  },
  {
    "phrase": "elitism",
    "whole_word": true
  },
  {
    "phrase": "Bisexuals",
    "whole_word": true
  },
  {
    "phrase": "Sexy",
    "whole_word": true
  },
  {
    "phrase": "porn",
    "whole_word": true
  },
  {
    "phrase": "uspolitics",
    "whole_word": true
  },
  {
    "phrase": "transfems",
    "whole_word": true
  },
  {
    "phrase": "anarchism",
    "whole_word": true
  },
  {
    "phrase": "anarchist",
    "whole_word": true
  },
  {
    "phrase": "memes",
    "whole_word": true
  },
  {
    "phrase": "scare",
    "whole_word": true
  },
  {
    "phrase": "government",
    "whole_word": true
  },
  {
    "phrase": "dictatorship",
    "whole_word": true
  },
  {
    "phrase": "#dogsofmastodon",
    "whole_word": true
  },
  {
    "phrase": "europeans",
    "whole_word": true
  },
  {
    "phrase": "zionists",
    "whole_word": true
  },
  {
    "phrase": "politicians",
    "whole_word": true
  },
  {
    "phrase": "fuckice",
    "whole_word": true
  },
  {
    "phrase": "lapd",
    "whole_word": true
  },
  {
    "phrase": "furry",
    "whole_word": true
  },
  {
    "phrase": "lewd",
    "whole_word": true
  },
  {
    "phrase": "cute",
    "whole_word": true
  },
  {
    "phrase": "politiek",
    "whole_word": true
  },
  {
    "phrase": "catsofmastodon",
    "whole_word": true
  },
  {
    "phrase": "trump's",
    "whole_word": true
  },
  {
    "phrase": "rfk",
    "whole_word": true
  },
  {
    "phrase": "protestors",
    "whole_word": true
  },
  {
    "phrase": "tyranny",
    "whole_word": true
  },
  {
    "phrase": "palantir",
    "whole_word": true
  },
  {
    "phrase": "Dictator",
    "whole_word": true
  },
  {
    "phrase": "shitposters",
    "whole_word": true
  },
  {
    "phrase": "shitposting",
    "whole_word": true
  },
  {
    "phrase": "gavinnewsom",
    "whole_word": true
  },
  {
    "phrase": "msnbc",
    "whole_word": true
  },
  {
    "phrase": "donaldtrump",
    "whole_word": true
  }
];

  // Compile array of regexes, using whole-word or partial match depending on `whole_word`
  const mutedRegexes = mutedWords.map(({ phrase, whole_word }) => {
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape special characters
    const pattern = whole_word ? `\\b${escapedPhrase}\\b` : escapedPhrase;
    return new RegExp(pattern, 'i');
  });

  function hideMatchingElements() {
    document.querySelectorAll('[data-trackable-context-story-type]').forEach(element => {
      const text = element.innerText.trim();
      let matched = false;
      for (const regex of mutedRegexes) {
        if (regex.test(text)) {
          matched = true;
          element.style.visibility = 'hidden';
          console.log('Hid element with matching pattern:', regex, '\nOriginal text:', text);
          break;
        }
      }
      if (!matched) {
        console.log('Did not hide (no muted word):', text);
      }
    });
  }

  // Run once when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideMatchingElements);
  } else {
    hideMatchingElements();
  }
})();