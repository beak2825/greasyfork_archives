// ==UserScript==
// @name        APA Label - derstandard.at
// @namespace   Violentmonkey Scripts
// @match       https://www.derstandard.at/story/*
// @grant       none
// @version     1.4
// @author      oodeagleoo
// @license     MIT
// @description 10/02/2022, 13:08:42
// @require     https://cdn.jsdelivr.net/npm/@ryanmorr/ready@1.4.0
// @downloadURL https://update.greasyfork.org/scripts/439817/APA%20Label%20-%20derstandardat.user.js
// @updateURL https://update.greasyfork.org/scripts/439817/APA%20Label%20-%20derstandardat.meta.js
// ==/UserScript==

const waitFor = (selector) => new Promise((resolve) => ready(selector, resolve));

const labeledSources = [
  {
    label: 'AP',
  },
  {
    label: 'APA',
  },
  {
    label: 'dpa',
  },
  {
    label: 'red',
  },
  {
    label: 'Reuters',
  },
  {
    label: 'SID',
  },
];

const sourcesExpr = /\((?<sources>[^\)]+)\d{1,2}\.\d{1,2}\.\d+\)/;

function getLabels(article) {
  const paragraphs = article.querySelectorAll('p');
  const labels = [];
  for (const paragraph of paragraphs) {
    const sources = sourcesExpr
      .exec(paragraph.innerText)
      ?.groups.sources
      .replace(/\s/g, '')
      .replace(/\//g, ',')
      .split(',')
      .filter(s => !!s);
    if (sources) {
      for (const source of labeledSources) {
        if (!source.matched && sources.includes(source.label)) {
          source.mateched = true;
          labels.push(source.label);
        }
      }
    }
  }
  return labels.sort();
}

(async () => {
  const article = await waitFor('div.story article');
  const labels = getLabels(article);
  if (labels.length > 0) {
    const h1 = await waitFor('h1.article-title');
    const iconStyles = 'position: relative; top: -0.1em; padding: 2px 5px; font-size: 0.8em; color: var(--theme-background); background-color: #cb0000; border-radius: 0.3em;';
    h1.innerHTML = `${labels.map((label) => `<span style="${iconStyles}">${label}</span>`).join(' ')} ${h1.innerText}`;
  }
})();
