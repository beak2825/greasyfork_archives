// ==UserScript==
// @exclude      *
// @author       Dexmaster
// @match        https://example.com/just-because-gf-doesnt-make-libs-private/
// ==UserLibrary==
// @name         mam-gr-rankings-lib
// @namespace    MAM
// @version      0.2.5
// @description  GR Rankings common lib
// @license MIT
// ==/UserLibrary==
// @downloadURL https://update.greasyfork.org/scripts/459206/mam-gr-rankings-lib.user.js
// @updateURL https://update.greasyfork.org/scripts/459206/mam-gr-rankings-lib.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
// from string-similarity@4.0.4 MIT licensed lib
const compareTwoStrings = (t,e) => {if((t=t.replace(/\s+/g,""))===(e=e.replace(/\s+/g,"")))return 1;if(t.length<2||e.length<2)return 0;let n=new Map();for(let e=0;e<t.length-1;e++){const l=t.substring(e,e+2),s=n.has(l)?n.get(l)+1:1;n.set(l,s);}let l=0;for(let t=0;t<e.length-1;t++){const s=e.substring(t,t+2),g=n.has(s)?n.get(s):0;g>0&&(n.set(s,g-1),l++);}return 2*l/(t.length+e.length-2);};
const improvedCompare = (a, b) => compareTwoStrings(a?.toLowerCase(), b?.toLowerCase()) || 0;
const capsChecker = (event) => {
    const caps = event.getModifierState && event.getModifierState('CapsLock');
    if (caps || event.shiftKey) return document.body.classList.add('gr-more');
    document.body.classList.remove('gr-more');
};
const initCapsChecker = () => {
    document.head.insertAdjacentHTML("beforeend", `<style>
	.gr-addition {position: relative}
	.gr-addition .altColor {
	  font-size: 14px;
	  font-weight: 700;
	}
	.gr-desc {
	  display: none;
	  position: absolute;
	  top: 100%;
	  left: 0;
	  font-weight: normal;
	  background: #FFF;
	  padding: 10px;
	  opacity: 0.9;
	  max-width: 500px;
	  width: max-content;
	  z-index: 999;
          text-indent: 0;
	}
	.gr-more td:hover > .gr-addition .gr-desc,
	.gr-more .fLeech:hover .gr-addition .gr-desc,
	.gr-more .torRow:hover .gr-addition .gr-desc {display: block}
	.gr-more::after {
	  display: block;
	  position: fixed;
	  left: 15px;
	  top: 5px;
	  content: "MAM Browse GR Rankings Debug (CapsLock/Shift on)";
	  padding: 5px;
	  background: #FFF;
	  opacity: 0.8;
	  z-index: 999;
	}
	</style>`);
    window.addEventListener('keydown', capsChecker);
    window.addEventListener('keyup', capsChecker);
    window.addEventListener('keypress', capsChecker);
}
const processTitle = title => encodeURIComponent(title).replaceAll('\'', '%27');
const debounceFn = (fn) => function() {
    let timer;
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        fn();
    }, 100);
};
const isOutOfViewport = function(elem) {
    const bounding = elem.getBoundingClientRect();
    const out = {};
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;
    return out;
};
const launcher = {
    maxTries: 10,
    currentTry: 0,
    init: function(initFunc) {
        if (this.currentTry < this.maxTries) {
            this.currentTry += 1;
            setTimeout(initFunc, this.currentTry * 200);
        } else {
            console.warn('Number of tries exceeded maximum of ' + this.maxTries);
        }
    }
};
const fetchBookData = function(titles, title, authors, grUrl) {
    const bookTitle = processTitle(titles.join(' '));
    return new Promise(function(res, rej) {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    responseType: 'json',
                    url: grUrl + '/book/auto_complete?format=json&q=' + bookTitle.replaceAll('%20', '+'),
                    onload: function(data) {
                        if (data.status === 200 && data.response.length) {
                            //data.response.forEach(el => console.log(el.title, title, el.ratingsCount, el.author.name, authors, el.ratingsCount));
                            //console.log(data.response, bookTitle.replaceAll('%20', '+'));
                            const exactTitles = data.response?.map(el => {
                                const authorCloseness = Math.max(...authors.map(author => improvedCompare(el.author.name, author)));
                                const titleCloseness = Math.max(improvedCompare(el.title, title), improvedCompare(el.title, titles[0]));
                                return {
                                    ...el,
                                    authorCloseness,
                                    titleCloseness
                                };
                            }).filter(el => el.titleCloseness > 0.2 && el.authorCloseness > 0.4 && el.ratingsCount > 0);
                            //console.log(exactTitles);
                            exactTitles.sort((a, b) => (b.titleCloseness - a.titleCloseness) + (b.authorCloseness - a.authorCloseness));
                            if (exactTitles.length) return res(exactTitles[0]);
                        }
                        return rej(new Error(`New method doesnt work or no ratings found for "${decodeURIComponent(bookTitle)}"`));
                    }
                });
            } catch (e) {
                return rej(e);
            }
        })
        .catch(e => {
            //console.warn(e);
            if (titles.length > 1) {
                //console.log('Trying without author');
                return fetchBookData([titles[0]], title, authors, grUrl);
            }
            //console.log('Trying with old method');
            return fetchBookDataOld(bookTitle, grUrl);
        });
};
const fetchBookDataOld = function(bookTitle, grUrl) {
    return new Promise(function(res, rej) {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: grUrl + '/search?q=' + bookTitle + '&search_type=books&search%5Bfield%5D=on',
                onload: function(data) {
                    let textHtml;
                    try {
                        // mobile
                        textHtml = JSON.parse(data.responseText).content_html;
                    } catch (e) {
                        // pc
                        const response = data.responseText;
                        const body = response.slice(response.indexOf('>', response.indexOf('<body')) + 1, response.indexOf('</body>'));
                        const firstItemIndex = body.indexOf('<tr itemscope itemtype="http://schema.org/Book">');
                        const itemHtml = body.slice(body.indexOf('>', firstItemIndex) + 1, body.indexOf('</tr>', firstItemIndex));
                        textHtml = itemHtml.slice(itemHtml.indexOf('<td width="100%" valign="top">') + 30, itemHtml.indexOf("<div class='wtrButtonContainer"));
                    }

                    try {
                        if (textHtml.length > 5000) {
                            return rej('No results!');
                        }
                        const firstItem = document.createElement('tr');
                        firstItem.style.display = 'none';
                        firstItem.innerHTML = textHtml;
                        const found = {
                            title: firstItem?.querySelector('[itemprop="name"]').textContent.trim(),
                            bookUrl: firstItem?.querySelector('[itemprop="url"],a.bookCover').getAttribute('href').split('?')[0],
                            author: {
                                name: firstItem?.querySelector('[itemprop="author"] [itemprop="name"]').textContent.trim(),
                                worksListUrl: grUrl + firstItem?.querySelector('[itemprop="author"] [itemprop="url"],a.authorName')?.getAttribute('href')
                            },
                            avgRating: firstItem?.querySelector('.minirating,[itemprop="ratingValue"]')?.textContent.trim().match(/\d.{4}/)[0],
                            ratingsCount: (firstItem?.querySelector('.minirating')?.textContent.match(/([\d,]+) ratings?/)[1] || firstItem?.querySelector('[itemprop="ratingCount"]')?.getAttribute('content')).replace(/[^\d]/ig, '')
                        };
                        return res(found);
                    } catch (e) {
                        return rej(e);
                    }
                }
            });
        } catch (e) {
            return rej(e);
        }
    });
};