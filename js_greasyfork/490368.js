// ==UserScript==
// @name         Legible Hacker News
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hacker News Legible Like Newspaper
// @author       CK Keller (fork)
// @author       Martin Gladdish (original)
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490368/Legible%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/490368/Legible%20Hacker%20News.meta.js
// ==/UserScript==

const tampermonkeyScript = function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeend", `<style>
      :root {
        --colour-hn-orange: #ff6600;
        --colour-hn-orange-pale: rgba(255, 102, 0, 0.05);
        --gutter: 0.5rem;
        --border-radius: 3px;
      }

      /* Reset font everywhere */
      html, body, td, .title, .comment, .default {
        font-family: 'Verdana', 'Arial', sans-serif;
        font-size: 1.2rem;
      }

      html, body {
        margin-top: 0;
        margin-left: 0;
      }

      body {
        padding: 5;
        margin: 5;
      }

      body, td, .title, .pagetop, .comment {
        font-size: 1.0rem;
      }

      .votelinks, html[op='news'] .title {
        vertical-align: inherit;
      }

      .comment-tree .votelinks,
        html[op='threads'] .votelinks,
        html[op='newcomments'] .votelinks{
        vertical-align: top;
        font-size: 0.7rem;
      }

      span.titleline {
        font-size: 1.1rem;
        margin-top: var(--gutter);
        margin-bottom: var(--gutter);
        display: block;
      }
      title.titleline {
            font-size: 1.3rem;

      }

      html[op='item'] span.titleline {
        font-size: 1.0rem;
        padding: 5;
      }

      .rank {
        display: none
        margin-left: 100px;
        font-size: 1.1rem;

      }


      html[op='news']        #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='newest']      #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='ask']         #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='newcomments'] #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='shownew']     #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='submitted']   #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='favorites']   #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
      html[op='front']       #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
      html[op='show']        #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2) {
         margin-left: 150px;
      }


      .sitebit.comhead {
        margin-left: 8;
        font-size: 0.8rem;

      }

      .subtext, .subline {
        font-size: 0.9rem;

      }

      #hnmain {
        width: 100%;
        background-color: white;
      }

      /* Menu bar */

      #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
        padding: 50;
      }
      #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
        padding-right: var(--gutter) !important;
      }


      .comment, .toptext {
        max-width: 40em;
        font-size: .9rem;
      }
      .comment {
        padding-left: 50;
      }

      .toptext, a, a:visited {
        color: black;
      }
      a:hover {
        text-decoration: underline;
      }


      input {
        padding: var(--gutter);
      }
      input, textarea {
        background-color: white;
        border: 2px solid var(--colour-hn-orange);
        border-radius: var(--border-radius);

      }
      input[type='button'] {
        cursor: pointer;
      }


      /* Custom styles added via javascript */

      .downvoted {
        background-color: rgb(245, 245, 245);
        border-radius: var(--border-radius);
        padding: 6px;
      }
      .downvoted .commtext {
        color: black;
        font-size: smaller;
      }

      .quote {
        border-left: 3px solid var(--colour-hn-orange);
        padding: 6px 6px 6px 9px;
        font-style: italic;
        background-color: var(--colour-hn-orange-pale);
        border-radius: var(--border-radius);
      }

      .hidden {
        display: none;
      }

      .showComment a, .hideComment, .hideComment:link, .hideComment:visited {
        color: var(--colour-hn-orange);
        text-decoration: underline;
      }
      .hideComment {
        margin-left: var(--gutter);
      }

    </style>`);

    const comments = document.querySelectorAll('.commtext');
    comments.forEach(e => {
        if (!e.classList.contains('c00')) {
            e.parentElement.classList.add('downvoted');
        }
    });

    let node = null;
    let nodes = [];
    const ps = document.evaluate("//p[starts-with(., '>')]", document.body)
    while (node = ps.iterateNext()) {
        nodes.push(node);
    }
    const spans = document.evaluate("//span[starts-with(., '>')]", document.body)
    while (node = spans.iterateNext()) {
        nodes.push(node);
    }
    nodes.forEach((n) => {
        const textNode = Array.from(n.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
            const p = document.createElement('p');
            p.classList.add('quote');
            p.innerText = textNode.data.replace(">", "");
            n.firstChild.replaceWith(p);
        } else {
            n.classList.add('quote');
            n.innerText = n.innerText.replace(">", "");
        }
    });

    const addComment = document.querySelector("html[op='item'] .fatitem tr:last-of-type");
    if (addComment) {
        addComment.classList.add('hidden');
        const showComment = document.createElement('tr');
        showComment.innerHTML = `
           <td colspan='2'></td>
           <td>
             <a href='#'>show comment box</a>
           </td>
        `;
        showComment.classList.add('showComment');
        showComment.querySelector('a').addEventListener('click', (e) => {
            showComment.classList.toggle('hidden');
            addComment.classList.toggle('hidden');
        });
        addComment.parentNode.insertBefore(showComment, addComment);

        const hideComment = document.createElement('a');
        hideComment.setAttribute('href', '#');
        hideComment.innerText = 'hide comment box';
        hideComment.classList.add('hideComment');
        hideComment.addEventListener('click', (e) => {
            showComment.classList.toggle('hidden');
            addComment.classList.toggle('hidden');
        });

        const commentForm = document.querySelector("form[action='comment']");
        commentForm.append(hideComment);
    }
}

tampermonkeyScript();
