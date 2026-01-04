// ==UserScript==
// @name         Battle Cats Wiki - Easy Navigation
// @namespace    https://battlecats.miraheze.org/
// @version      1.0
// @description  Adds a quality-of-life menu to quickly navigate pages
// @author       ProfessionalScriptKiddie
// @license      MIT
// @match        https://battlecats.miraheze.org/wiki/*
// @icon         https://files.catbox.moe/7srjk6.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542664/Battle%20Cats%20Wiki%20-%20Easy%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/542664/Battle%20Cats%20Wiki%20-%20Easy%20Navigation.meta.js
// ==/UserScript==

function waitForLocationBox(callback) {
    const check = () => {
        const el = document.querySelector('.pi-item[data-source="next stage"]');
        if (el) {
            callback();
            return true;
        }
        return false;
    };

    if (check()) return;

    const observer = new MutationObserver(() => {
        if (check()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        if (!check()) observer.disconnect();
    }, 5000);
}

waitForLocationBox(() => {
    const getLinkFromSource = (source) => {
        const container = document.querySelector(`.pi-item[data-source="${source}"]`);
        if (!container) return null;
        const link = container.querySelector('a');
        return link ? { href: link.href, text: link.textContent.trim() } : null;
    };

    const findNextSubChapterFirstStage = (currentSubChapterName) => {
        const navboxes = document.querySelectorAll('.navbox');

        for (const navbox of navboxes) {
            const rows = navbox.querySelectorAll('tr');
            let foundCurrentChapter = false;

            for (const row of rows) {
                const th = row.querySelector('th');
                if (!th) continue;

                const chapterLink = th.querySelector('a');
                if (!chapterLink) continue;

                const chapterName = chapterLink.textContent.trim();

                if (foundCurrentChapter) {
                    const td = row.querySelector('td');
                    if (td) {
                        const firstStageLink = td.querySelector('a');
                        if (firstStageLink) {
                            return {
                                href: firstStageLink.href,
                                text: firstStageLink.textContent.trim()
                            };
                        }
                    }
                }

                if (chapterName === currentSubChapterName) {
                    foundCurrentChapter = true;
                }
            }
        }

        return null;
    };

    const prevStage = getLinkFromSource("prev stage");
    let nextStage = getLinkFromSource("next stage");
    const chapter = getLinkFromSource("sub-chapter");

    if (!nextStage && chapter) {
        const nextSubChapterStage = findNextSubChapterFirstStage(chapter.text);
        if (nextSubChapterStage) {
            nextStage = nextSubChapterStage;
        }
    }

    if (!prevStage && !nextStage && !chapter) return;

    const originalHeader = document.querySelector('#citizen-page-header');
    if (!originalHeader) return;

    const navBar = document.createElement('div');
    navBar.style.position = 'sticky';
    navBar.style.top = '0';
    navBar.style.zIndex = '1000';
    navBar.style.background = 'transparent';
    navBar.style.borderBottom = 'none';
    navBar.style.boxShadow = 'none';

    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'center';
    navContainer.style.alignItems = 'center';
    navContainer.style.gap = '1em';
    navContainer.style.padding = '12px 20px';
    navContainer.style.maxWidth = '1200px';
    navContainer.style.margin = '0 auto';

    const makeLinkButton = (text, href) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        a.style.color = '#fff';
        a.style.textDecoration = 'none';
        a.style.padding = '8px 16px';
        a.style.border = '1px solid #555';
        a.style.borderRadius = '4px';
        a.style.background = '#333';
        a.style.transition = 'background 0.2s, border-color 0.2s';
        a.style.fontSize = '14px';
        a.style.fontWeight = '500';
        a.style.whiteSpace = 'nowrap';

        a.addEventListener('mouseenter', () => {
            a.style.background = '#555';
            a.style.borderColor = '#777';
        });
        a.addEventListener('mouseleave', () => {
            a.style.background = '#333';
            a.style.borderColor = '#555';
        });

        return a;
    };

    if (prevStage) navContainer.appendChild(makeLinkButton(`← ${prevStage.text}`, prevStage.href));
    if (chapter) navContainer.appendChild(makeLinkButton(`↗️ ${chapter.text}`, chapter.href));
    if (nextStage) navContainer.appendChild(makeLinkButton(`${nextStage.text} →`, nextStage.href));

    navBar.appendChild(navContainer);

    originalHeader.parentNode.insertBefore(navBar, originalHeader.nextSibling);
});