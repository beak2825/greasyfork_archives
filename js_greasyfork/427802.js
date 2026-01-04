// ==UserScript==
// @name        YYYYMMDD everywhere
// @version     3
// @grant       none
// @namespace   tz
// @include     *
// @description Other date formats are too confusing.
// @downloadURL https://update.greasyfork.org/scripts/427802/YYYYMMDD%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/427802/YYYYMMDD%20everywhere.meta.js
// ==/UserScript==

const month_by_name = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12",
    "January": "01",
    "February": "02",
    "March": "03",
    "April": "04",
    "May": "05",
    "June": "06",
    "July": "07",
    "August": "08",
    "September": "09",
    "October": "10",
    "November": "11",
    "December": "12",
};
const month_re = (
    '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'
    + '|January|February|March|April|May|June|July|August|September|October|November|December)'
);
const day_re = '(\\d\\d?)(?:,|th|st|nd)?';

const replacer_list = [
    {
        // mdy
        pattern: new RegExp(month_re + '  ?' + day_re + ' (\\d\\d\\d\\d)'),
        func: (_, month, day, year) => {
            day = pad2(day);
            month = month_by_name[month];
            return year + '-' + month + '-' + day;
        },
    },
    {
        // dmy
        pattern: new RegExp(day_re + ' ' + month_re + ' (\\d\\d\\d\\d)'),
        func: (_, day, month, year) => {
            day = pad2(day);
            month = month_by_name[month];
            return year + '-' + month + '-' + day;
        },
    },
    {
        // md
        pattern: new RegExp(month_re + '  ?' + day_re),
        func: (_, month, day) => {
            day = pad2(day);
            month = month_by_name[month];
            return '2021-' + month + '-' + day;  // FIXME: hardcode 2021
        },
    },
];

function fix(node) {
    for (const kid of node.childNodes) {
        if (kid.nodeType != Node.TEXT_NODE) {
            continue
        }
        let txt = kid.nodeValue;
        for (const {pattern, func} of replacer_list) {
            txt = txt.replace(pattern, func);
        }
        kid.nodeValue = txt;
    }
}

function fix_by_attr(attr) {
    return (node) => {
        const txt = node.getAttribute(attr);
        if (!txt) {
            return;
        }
        node.textContent = date_fmt(txt);
    };
}

function fix_so(node) {
    node.textContent = date_fmt(node.getAttribute('title').substr(0, '1111-11-11 11:11:11Z'.length));
}

function pad2(n) {
    n = n.toString();
    if (n.length == 1) {
        n = '0' + n;
    }
    return n;
}

// display using local timezone
function date_fmt(str) {
    let date;
    let unix = false;
    if (/^\d{10}$/.test(str)) {
        date = new Date(+str * 1000);
        unix = true;
    } else if (/^\d{13}$/.test(str)) {
        date = new Date(+str);
        unix = true;
    } else {
        date = new Date(str);
    }
    const yyyy = date.getFullYear();
    const mm = pad2(date.getMonth() + 1);
    const dd = pad2(date.getDate());
    const HH = pad2(date.getHours());
    const MM = pad2(date.getMinutes());
    const SS = pad2(date.getSeconds());
    if (isNaN(yyyy)) {
        console.error('yyyymmdd.user.js: unable to convert ' + str);
        return str;
    }

    let r = yyyy + '-' + mm + '-' + dd;
    if (unix || str.includes(':')) {
        r += ' ' + HH + ':' + MM + ':' + SS;
    }
    return r;
}

function execute(fixer) {
    for (const rule of fixer.rules) {
        const fix_fn = rule.fix || fix;
        const nodes = document.querySelectorAll(rule.selector);
        for (let node of nodes) {
            fix_fn(node);
        }
    }
}

function main() {
    const url = new URL(window.location.href);
    for (const fixer of fixer_list) {
        let matched = false;
        if (typeof fixer.domain === 'string') {
            matched = url.hostname.includes(fixer.domain);
        } else if (fixer.domain instanceof RegExp) {
            matched = fixer.domain.test(url.hostname);
        }
        if (matched && fixer.selector) {
            matched = !!document.querySelector(fixer.selector);
        }
        if (!matched) {
            continue
        }

        if (fixer.css) {
            const el = document.createElement('style');
            el.type = 'text/css';
            el.appendChild(document.createTextNode(fixer.css));
            document.head.appendChild(el);
        }

        execute(fixer);
        if (fixer.observe) {
            const to_observe = [];
            for (const selector of fixer.observe) {
                for (const node of document.querySelectorAll(selector)) {
                    to_observe.push(node);
                }
            }
            const observer = new MutationObserver(() => {
                // pause observing
                for (const node of to_observe) {
                    observer.disconnect(node);
                }
                // perform modifications
                execute(fixer);
                // resume observing
                for (const node of to_observe) {
                    observer.observe(node, {childList: true,  subtree: true});
                }
            });
            // start observing
            for (const node of to_observe) {
                observer.observe(node, {childList: true,  subtree: true});
            }
        }
    }
}

const fixer_list = [
    {
        // for all sites
        domain: '',
        rules: [
            {selector: 'time[datetime]', fix: fix_by_attr('datetime')},
        ],
    },
    {
        // for discourse bbs
        domain: '',
        selector: 'meta[name="discourse_theme_ids"]',
        rules: [
            {selector: '.relative-date', fix: fix_by_attr('data-time')},
            {selector: '.timeline-ago'},    // FIXME: not working
            {selector: '.d-label'},
        ],
        observe: ['section#main'],
    },
    {
        domain: '.google.',
        rules: [
            {selector: '.WZ8Tjf'},
            {selector: '.uo4vr'},
            {selector: '.wrBvFf span'},
        ],
    },
    {
        domain: 'news.ycombinator.com',
        rules: [
            {selector: '.age a'},
        ],
    },
    {
        domain: 'hckrnews.com',
        rules: [
            {selector: '.tab'},
        ],
        observe: ['#entries'],
    },
    {
        domain: /(stackoverflow|serverfault|superuser|stackexchange|askubuntu|mathoverflow|stackapps)\.(com|net)/,
        rules: [
            // https://meta.stackoverflow.com/questions/288674/custom-date-format
            {selector: '.relativetime', fix: fix_so},
            {selector: '.relativetime-clean', fix: fix_so},
        ],
        observe: ['.js-comments-list'],
    },
    {
        domain: 'github.com',
        rules: [
            {selector: 'relative-time', fix: fix_by_attr('datetime')},
        ],
        observe: ['.js-discussion', '#js-repo-pjax-container'],
    },
    {
        domain: 'lwn.net',
        rules: [
            {selector: '.CommentPoster'},
            {selector: '.FeatureByline'},
            {selector: '.Byline'},
            {selector: '.GAByline p'},
        ],
    },
    {
        domain: 'blog.golang.org',
        rules: [
            {selector: '.author'},
        ],
    },
    {
        domain: 'wordpress.com',
        rules: [
            {selector: '.author'},
            {selector: 'time[datetime]', fix: fix_by_attr('datetime')},
        ],
        observe: ['.jp-relatedposts'],
    },
    {
        domain: 'blog.cloudflare.com',
        rules: [
            {selector: 'p[datetime]', fix: fix_by_attr('datetime')},
            {selector: 'p[data-iso-date]', fix: fix_by_attr('data-iso-date')},
        ],
        observe: ['p[datetime]'],
    },
    {
        domain: 'goodreads.com',
        rules: [
            {selector: '.reviewDate'},
            {selector: '#details .row'},
        ],
    },
    {
        domain: 'digitalocean.com',
        rules: [
            {selector: '.post-time-link'},
            {selector: '.timestamp'},
            {selector: '.date'},
        ],
        observe: ['#aurora-container'],
    },
    {
        domain: 'wikipedia.org',
        rules: [
            {selector: '#footer-info-lastmod'},
        ],
    },
    {
        domain: 'nytimes.com',
        rules: [
            {selector: 'time[datetime]', fix: fix_by_attr('datetime')},
        ],
        observe: ['#story'],
    },
    {
        domain: 'probablydance.com',
        rules: [
            {selector: '.published a'},
            {selector: '.comment-meta a'},
        ],
        observe: ['#core-content'],
    },
    {
        domain: 'phoronix.com',
        rules: [
            {selector: '.author'},
            {selector: '.time'},
        ],
    },
    {
        domain: 'realworldtech.com',
        rules: [
            {selector: '.rwtforum-post-by'},
            {selector: '.time', fix: fix_by_attr('title')},
        ],
    },
    {
        domain: 'blogspot.com',
        rules: [
            {selector: '.date-header span'},
            {selector: '.comment-header a'},
            {selector: '.datetime a'},
            {selector: 'abbr.time', fix: fix_by_attr('title')},
        ],
        observe: ['body'],
    },
    {
        domain: 'code.google.com',
        rules: [
            {selector: 'p[ng-if="projectCtrl.project.creationTime"]'},
        ],
        observe: ['body'],
    },
    {
        domain: 'groups.google.com',
        rules: [
            {selector: '.zX2W9c'},
        ],
        observe: ['body'],
    },
    {
        domain: 'greasyfork.org',
        rules: [
            {selector: 'gf-relative-time', fix: fix_by_attr('datetime')},
        ],
        observe: ['gf-relative-time'],
    },
    {
        domain: 'gitter.im',
        rules: [
            {selector: '.js-chat-time', fix: fix_by_attr('title')},
            {selector: '.js-chat-time', fix: fix_by_attr('aria-label')},
            {selector: '.activity-time', fix: fix_by_attr('aria-label')},   // FIXME: not working
        ],
        observe: ['body'],
    },
    {
        domain: 'writings.stephenwolfram.com',
        rules: [
            {selector: '.comment-permlink'},
        ],
    },
    {
        domain: 'slashdot.org',
        rules: [
            {selector: 'time[datetime]'},
            {selector: '.otherdetails'},
        ],
        observe: ['.otherdetails'],
    },
    {
        domain: 'imdb.com',
        rules: [
            {selector: '.review-date'},
            {selector: 'li > a'},
        ],
        observe: ['body'],
    },
    {
        domain: 'blogs.windows.com',
        rules: [
            {selector: '.article-header__intro_caption_content'},
        ],
    },
    {
        domain: 'arstechnica.com',
        rules: [
            {selector: '.reg-date'},
        ],
    },
    {
        domain: 'amazon.com',
        rules: [
            {selector: '.review-date'},
        ],
    },
    {
        domain: 'reddit.com',
        rules: [],
        css: `
            time.edited-timestamp:before {
                content: "　Last edited ";
            }
        `
    },
];

main();
