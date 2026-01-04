// ==UserScript==
// @name         Better GamePress FGO
// @version      0.8
// @description  Better servant pages.
// @author       Rukako
// @namespace    rukako
// @match        https://grandorder.gamepress.gg/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crel/4.0.1/crel.min.js
// @downloadURL https://update.greasyfork.org/scripts/384559/Better%20GamePress%20FGO.user.js
// @updateURL https://update.greasyfork.org/scripts/384559/Better%20GamePress%20FGO.meta.js
// ==/UserScript==

/* globals crel */


(function() {
    'use strict';
    if (window.BETTER_GAMEPRESS_FGO) return; // set flag in case script is loaded multiple times.
    window.BETTER_GAMEPRESS_FGO = 1;

    const $ = (a, b) => typeof b == 'undefined' ? document.querySelector(a) : a.querySelector(b);
    const toArray = (x) => Array.prototype.slice.call(x, 0);
    const $$ = (a, b) => toArray(typeof b == 'undefined' ? document.querySelectorAll(a) : a.querySelectorAll(b));
    const log = console.log.bind(console);
    const assert = console.assert.bind(console);

    // Common functions.

    // helper so crel correctly sets style attributes one at a time.
    crel.attrMap.style = (el, style) => {
        if (typeof style === 'string') {
            el.setAttribute('style', style);
        } else {
            Object.entries(style).forEach(([k,v]) => { el.style[k] = v; });
        }
    }

    // Run specific functions depending on URL.
    if (/^\/servant\//.test(window.location.pathname)) {
        removeDiscussion();
        servantPageImprovements();
        betterSkillUpgradeDisplay();
    }
    if ($('#gamepress-top-content')) {
        backToTop();
    }
    removeFloatingHeader();

    // Specific feature implementations.

    function removeFloatingHeader() {
        // fixes header bar at top of page.
        $('.gamepress-top-menu .menu-container').style = 'position: inherit';
    }

    function removeDiscussion() {
        // hides the discussion but doesn't remove it
        // so running scripts don't error.
        const disc = $('.view-discourse-block');
        assert(disc, 'discussion node not present');
        disc.style.display = 'none';
    }

    function servantPageImprovements() {
        // converts text to a string usable as HTML ID or classname.
        const toClassName = c => 'section-'+c.toLowerCase().replace(/[^A-Za-z0-9]/g, '-');

        const pageTitle = $('#page-title');

        // main table of contents under servant name.
        const mainTOC = crel('div', {'class': 'main-toc hidden better-toc'});
        const servantLayout = $('.servant-new-layout');
        servantLayout.insertAdjacentHTML('beforebegin', '<h2 style="margin-top: 0" class="main-title hidden better-toc">Table of Contents</h2>');
        servantLayout.insertAdjacentElement('beforebegin', mainTOC);

        // a TOC row contains one category's buttons (profile, analysis, etc.)
        const newTOCRow = () => crel('div', {'class': 'main-toc-section'});
        const newTOCButton = (icon, text, link) => `<a href="#${link}"><span>` + (icon ? `<i class="fa ${icon}" aria-hidden="true"></i> ` : '') + text + `</span></a>`;

        // define TOC categories.
        const categories = {
            'status': ['fa-user', 'Profile', 'table-of-contents-0'],
            'analysis': ['fa-pie-chart', 'Analysis', 'section-overview'],
            'profile': ['fa-file-text', 'Other', 'section-other-info']
        };

        // TABLE OF CONTENTS LINKS
        ['status', 'analysis', 'profile'].map(s => $('#'+s)).forEach(sec => {
            const tabs = $(sec, '.servant-tabs');
            assert(tabs, '.servant-tabs not found in', sec);
            tabs.innerHTML += '<br><br><hr style="display:block;width: 100%;">';

            const row = newTOCRow(); // add category to main TOC
            mainTOC.insertAdjacentHTML('beforeend', newTOCButton(...categories[sec.id]));

            $$(sec, '.main-title')
                .map(title => [title, title.nextElementSibling])
                .filter(([a,b]) => b && !b.classList.contains('servant-tabs'))
                .forEach(([title, div]) => {
                const text = title.textContent;
                const id = title.id || toClassName(text);
                title.id = id; // set ID of this h2 element to a usable ID.

                // add button to current TOC category.
                row.insertAdjacentHTML('beforeend', newTOCButton(null, text, id));

                //tabs.innerHTML += `<li><a href="#${id}"><!--<i class="fa fa-user" aria-hidden="true"></i> -->${text}</a></li>`;

                // create and insert the button in the inline tables of contents.
                const li = crel('li', crel('a', {
                    href: '#'+id,
                    style: {
                        padding: '5px 6px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }
                }, text));
                tabs.appendChild(li);
            });
            mainTOC.appendChild(row);
        });

        // skill analysis and materials links in servant skills section.
        const levelUpSkillHref = toClassName('Level Up Skill Recommendation');
        const skillMatsHref = toClassName('Skill Enhancement Materials');
        const recHTML = `<ul class="servant-tabs" style="margin-bottom: 0 !important;">
            <li><a href="#${levelUpSkillHref}" style="padding: 0;"><i class="fa fa-pie-chart" aria-hidden="true"></i> Skill Analysis</a></li>
            <li><a href="#${skillMatsHref}" style="padding: 0;"><i class="fa fa-diamond" aria-hidden="true"></i> Materials</a></li>
        </ul>`;
        $('#skills').insertAdjacentHTML('afterbegin', recHTML);

        // SKILL LINKS AND RECOMMENDATION ICONS
        const skillIcons = [null, null, null];
        // for each skill in 'level up skill recommendations'
        Array.from($('.view-level-up-skill-recommendation tbody').children).forEach((tr, i) => {
            if (tr.tagName != 'TR') return;
            const a = $(tr, 'a[href^="/servant-skill/"]');
            if (!a) return; // No link found. Empty skill row.
            a.href = '#servant-skill-'+(i+1);

            const iconsEl = $(tr, '.views-field-description__value'); // this contains the red/green icons.
            assert(iconsEl, 'skill icons cell not found', tr);
            const icons = Array.from(iconsEl.children);
            // colours are from an inherited CSS property. store as style attribute in icon.
            icons.forEach(icon => {icon.style.color = window.getComputedStyle(icon).color; });
            assert(i < 3, 'too many skills in analysis', i);
            skillIcons[i] = icons.map(x => x.cloneNode(true)); // clone icons.
        });

        // for each skill in 'servant skills'
        $$('#skills > div > .field__item').forEach((el, i) => {
            el.id = 'servant-skill-'+(i+1); // add ID to servant skill, so it can be linked to.
            if (!skillIcons[i]) return; // no skill icons for this skill.
            const title = $(el, 'a[href^="/servant-skill/"]');
            const iconsSpan = crel('a',
                {href: '#'+levelUpSkillHref,
                 title: 'Level up priority',
                 style: {marginLeft: '6px', fontSize: '16px'}},
                skillIcons[i]);
            // inserts skill icons after skill name.
            title.insertAdjacentElement('afterend', iconsSpan);
        });

        // TIER LINK
        // parses servant rarity number
        let rarity = $('.taxonomy-term.vocabulary-stars').getAttribute('about').replace('/', '');
        rarity = parseInt(rarity);
        if (rarity <= 3) {
            rarity = '1-3';
        }
        const tierListLink = crel('a', {href: `/${rarity}-star-tier-list`});
        // wraps "Tier" heading in a link to the tier list.
        const ratingBar = $('#overall-servant-rating');
        const ref = ratingBar.nextElementSibling;
        tierListLink.appendChild(ratingBar);
        ref.parentNode.insertBefore(tierListLink, ref);

        // number table of contents elements with counter.
        let counterTOC = 0;
        let currentTOC = null;
        $$('.servant-new-layout h2.main-title').forEach((el, i) => {
            if (el.textContent.trim().toLowerCase() === 'table of contents') {
                el.id = el.id || ('table-of-contents-'+counterTOC);
                currentTOC = '#'+el.id;
                counterTOC++;
                return;
            }
        });

        // Fix tier number alignment
        const tierDiv = $('#overall-servant-rating .overall-servant-rating-value');
        if (tierDiv) {
            tierDiv.style.lineHeight = tierDiv.clientHeight + 'px';
        }

        // add ID attributes for other h2.main-title elements as well.
        $$('.main-title:not([id])').forEach(el => el.id = toClassName(el.textContent));
    }

    function backToTop() {
        // BACK TO TOP
        const toTopStyles = `
#to-top {
position: fixed;
bottom: 10px;
float: right;
right: 30px;
z-index: 2;
}

#to-top a:not(:hover) {
background-color: #f8f8f8;
}

#to-top a {
width: 45px;
height: 45px;
font-size: 20pt;
padding: 0;
}
`;
        document.head.appendChild(crel('style', toTopStyles));
        // global back to top button, located in bottom right corner.
        $('.page').insertAdjacentHTML('beforeend', '<div id="to-top"><a class="featured-button" href="#"><i class="fa fa-chevron-up"></i></a></div>');
    }

    function betterSkillUpgradeDisplay() {
        const skillStyles = `
.paragraph--type--required-materials .field--name-field-number-of-materials {
font-weight: bold;
}

.servant-new-layout .servant-skill-upgrade {
margin-top: 1px;
}

.servant-new-layout .field--name-field-servant-skills>.field__item {
border: #d1d8f0 solid 3px;
/*border-left: #585858 solid 5px;*/
}

.servant-new-layout .servant-skill-single {
/*border-left-style: none;*/
}
`;
        // improves the border highlighting and grouping of skills
        // to better group interlude-upgrade skills.
        document.head.appendChild(crel('style', skillStyles));
    }

})();