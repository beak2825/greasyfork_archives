// ==UserScript==
// @name        ArticleTOCNavigator
// @namespace   This JavaScript plugin generates a dynamic table of contents for dev website. It uses HTML header tags to create links to respective sections, highlights the current section, and displays it on the sidebar for easy navigation.
// @match       https://dev.to/*
// @grant       none
// @version     1.0.8
// @author      Circle
// @description 2023/5/23 14:32:33
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466900/ArticleTOCNavigator.user.js
// @updateURL https://update.greasyfork.org/scripts/466900/ArticleTOCNavigator.meta.js
// ==/UserScript==
const genTOC = () => {
  const articleBody = document.querySelector('.crayons-article__body');
  if (!articleBody || document.querySelector('#toc-container')) return;

  const sidebarRight = document.querySelector('.crayons-layout__sidebar-right');
  const tocContainer = document.createElement('ul');
  tocContainer.id = 'toc-container';
  tocContainer.style.paddingLeft = '20px';

  const divContainer = document.createElement('div');
  divContainer.className = 'crayons-article-sticky crayons-card crayons-card--secondary crayons-sponsorship billboard mt-4';
  divContainer.appendChild(tocContainer);

  const hStack = [];
  const regex = /\bH[1-5]\b/g;
  const headings = [...articleBody.childNodes].filter((node) => node.nodeType !== 3 && node.tagName && regex.test(node.tagName));
  if (!headings.length) return;

  const linkTargets = headings.map((heading, index) => {
    const hItem = document.createElement('li');
    const level = Number(heading.tagName.slice(1));

    hItem.textContent = heading.textContent;
    hItem.style.color = 'var(--body-color)';
    hItem.style.cursor = 'pointer';
    hItem.onclick = () => heading.scrollIntoView({ behavior: "smooth" });

    tocContainer.appendChild(hItem);

    if (!hStack.length || hStack[hStack.length - 1] < level) {
      hStack.push(level);
    } else if (hStack[hStack.length - 1] > level) {
      hStack.pop();
    }
    hItem.style.marginLeft = (hStack.length) * 15 + 'px';

    return hItem;
  });

  sidebarRight.appendChild(divContainer);

  return { headings, linkTargets };
};

let tocData = genTOC();

window.addEventListener('scroll', () => {
  if (!tocData) return;

  const { headings, linkTargets } = tocData;
  const scrollPos =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  const currIndex = headings.findIndex(h => h.offsetTop + 20 >= scrollPos);

  linkTargets.forEach((link, index) => link.classList.toggle('active', index === currIndex));
});

let oldHref = document.location.href;
const observer = new MutationObserver(() => {
  if (oldHref != document.location.href) {
    oldHref = document.location.href;
    tocData = genTOC();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

const styleElement = document.createElement('style');
styleElement.textContent = `
  #toc-container .active {
    color: var(--link-branded-color)!important;
    font-weight: bold;
  }
`;
document.head.appendChild(styleElement);