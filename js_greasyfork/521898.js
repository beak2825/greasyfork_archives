// ==UserScript==
// @name        Midnight Hacker News
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     1.2
// @author      Local Primate
// @description Created: 2024-10-25 | Last Updated: 2024-12-26
// @license     CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/521898/Midnight%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/521898/Midnight%20Hacker%20News.meta.js
// ==/UserScript==

// Main styles
GM_addStyle(`

  :root {
    --purple: #707299;
    --blue: #3e3f66;
    --dark-blue: #33353D;
    --gray-100: #D3D1DE;
    --gray-200: #8c8b94;
    --gray-300: #ffffff66;
    --gray-400: #ffffff44;
    --gray-500: #202326;
    --gray-600: #1c1e21;
    --black: #0f1014;
  }
  
  body {
    background: var(--gray-600);
    color: white;
  }
  
  /* Logo */
  #hnmain > tbody:nth-child(1) > tr > td > table > tbody > tr > td > a > img {
    filter: hue-rotate(220deg);
    opacity: 0.6;
    width: 1.25rem;
    height: 1.25rem;
    margin-left: 0.05rem;
    margin-right: 0.15rem;
  }
  
  a:link {
      color: var(--purple) !important;
  }
  
  textarea {
    background: var(--gray-500);
    border: 1px solid var(--gray-400);
    color: white;
  }
  
  textarea:focus {
    border: 1px solid var(--gray-300);
    outline: none;
  }
  
  #hnmain {
    background: var(--black);
  }
  
  /* Comment metadata */
  td.default div span.comhead a {
    font-weight: bold;
    font-size: 0.75rem;
  }
  
  .fatitem > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > form:nth-child(1) > input:nth-child(7) {
    background: var(--dark-blue);
    border: 0;
    padding: 0.25rem 0.5rem;
    border-radius: 0.2rem;
    color: var(--gray-100);
    opacity: 0.6;
    text-transform: capitalize;
  }
  
  td.default {
    background: var(--gray-500);
    padding: 0.5rem;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  
  table.comment-tree td.votelinks {
    background: var(--gray-500);
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
  
  tr.athing.comtr td table {
    border-radius: 0.25rem;
  }
  
  table.comment-tree {
    border-spacing: collapse;
    border: 0;
  }
  
  .c00 {
    color: var(--gray-200) !important;
  }
  
  /* Website heading bar */
  #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
    background: var(--blue);
    height: 1.75rem;
  }
  
  #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) a:link {
    color: black !important;
    font-size: 0.9rem;
  }
  
  .athing.comtr td table {
    border-collapse: collapse;
  }
  
  .athing.comtr td.votelinks center {
    padding-left: 0.25rem;
    padding-top: 0.35rem;
  }
  
  td.votelinks[valign="top"] {
    padding-right: 0.2rem;
  }
  
  td.votelinks.nosee {
    display: none;
  }
  
  .subline {
    font-size: 0.7rem;
    color: var(--gray-200) !important;
  }
  
  table.fatitem tbody tr.athing td.title {
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .fatitem > tbody:nth-child(1) > tr:nth-child(3) {
    display: block;
    margin-bottom: 1rem;
  }
  
  div.reply a {
    background: var(--dark-blue);
    display: inline-block;
    padding: 0.2rem 0.3rem;
    margin: 0.3rem 0;
    border-radius: 0.25rem;
    text-decoration: none !important;
    color: var(--gray-100) !important;
    text-transform: capitalize;
    opacity: 0.6;
  }
  
  /* Front page */
  .spacer {
    height: 1rem !important;
  }
  
  tr.athing td.title[align="right"] span.rank {
    padding-left: 1rem;
    padding-right: 0.3rem;
  }
  
  tr.athing td.title[align="right"] span.rank:empty {
    padding-left: 0;
  }
  
  .titleline a {
    font-weight: bold;
  }
  
  /* Bottom styled bar */
  #hnmain > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
    background: var(--blue);
  }
  
  /* Search bar */
  #hnmain > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > center:nth-child(4) > form:nth-child(4) > input:nth-child(1) {
    background: var(--gray-500);
    border: 1px solid var(--gray-400);
    color: white;
  }
  
  #hnmain > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > center:nth-child(4) > form:nth-child(4) {
    color: var(--gray-200);
  }
  
`);

// Adds a stylistic border to comment blocks to indicate indentation.
// Functionally, a right-border is added to an "indent" element that Hacker News duplicates
// to form the comment indentation (specifically the nearest one to the comment block)
// Visually, this will appear on the left side of comment blocks.
window.addEventListener('load', function() {
  const gray = "#ffffff44";
  const green = "#00838acc";
  const blue = "#00328acc";
  const purple = "#4c008acc";
  const pink = "#8a0040cc";
  const red = "#8a000ecc";
  const colors = [green, blue, purple, pink, red];

  const targetClass = "ind";
  const targetAttr = "indent";

  const indentedElements = document.getElementsByClassName(targetClass);

  for (let i = 0; i < indentedElements.length; i++) {
    const indentCount = indentedElements[i].getAttribute(targetAttr);
    const index = (indentCount - 1) % colors.length;
    const chosenColor = indentCount >= 1 ? colors[index] : gray;

    indentedElements[i].style.borderRight = "2px solid " + chosenColor;
  }

}, false);
