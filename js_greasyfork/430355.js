// ==UserScript==
// @name Brainly++
// @namespace https://github.com/sirmonteiro
// @version 1.0.2
// @description Remove the limitation of viewing answers in Brainly
// @description:pt-BR Remove a limitação de ver respostas no Brainly
// @author SirMonteiro
// @icon https://i.imgur.com/RnMZuyj.png
// @match *://*brainly.in/*
// @match *://*brainly.com/*
// @match *://*brainly.it/*
// @match *://*brainly.co.id/*
// @match *://*brainly.ro/*
// @match *://*brainly.ph/*
// @match *://*brainly.lat/*
// @match *://*brainly.pl/*
// @match *://*brainly.com.br/*
// @match *://*znanija.com/*
// @match *://*nosdevoirs.fr/*
// @match *://*eodev.com/*
// @grant GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/430355/Brainly%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/430355/Brainly%2B%2B.meta.js
// ==/UserScript==

GM.addStyle(`
aside, .ads_banner, [data-testid*="ad_below"]{
  display: none !important;
}

#main-content {
  grid-template-columns: 800px;
}
`);

localStorage.setItem("ads-pis", [])
localStorage.setItem("social-qa/telemetry", {})
