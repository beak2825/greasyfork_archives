// ==UserScript==
// @name         Fxxk GitHub's new UI
// @name:zh-CN   拒绝 GitHub 新 UI
// @namespace    Aloxaf
// @version      0.1.18
// @description  Move repo information to the top.
// @description:zh-CN 将 repo 信息移动至顶部
// @author       Aloxaf
// @match        https://github.com/*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406016/Fxxk%20GitHub%27s%20new%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/406016/Fxxk%20GitHub%27s%20new%20UI.meta.js
// ==/UserScript==

// jshint esversion: 6

// GreasyMonkey 4.0+ doesn't support GM_addStyle
// https://stackoverflow.com/questions/23683439/gm-addstyle-equivalent-in-tampermonkey
function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function () {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function log(e) {
    return console.log(e);
}

function $(e) {
    return document.querySelector(e);
}

function rename_node(node, name) {
    let ele = document.createElement(name);
    let old_attrs = node.attributes;
    let new_attrs = ele.attributes;

    for (let i = 0, len = old_attrs.length; i < len; i++) {
        new_attrs.setNamedItem(old_attrs.item(i).cloneNode());
    }

    do {
        ele.appendChild(node.firstChild);
    } while (node.firstChild);

    node.parentNode.replaceChild(ele, node);

    return ele;
}

function xpath(s, root = document) {
    return document.evaluate(s, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function set_about(content) {
    log('setting about');
    let about = xpath('//h2[text() = "About"]/following-sibling::p[1]');
    if (about) {
        about.className = "f4";
    } else {
        about = xpath('//h2[text() = "About"]/following-sibling::div[1]')
    }

    let url = xpath('//h2[text() = "About"]/following-sibling::div[1]/span/a');
    if (url) {
        url.innerText = url.href;
        url.removeAttribute('class');
        about.appendChild(url);
    }

    content.insertBefore(about, content.children[1]);
}

function set_topics(content) {
    log('setting topics');
    let topics = xpath('//h3[text() = "Topics"]/following-sibling::div[1]');
    if (!topics) {
        topics = document.createElement("div");
    }
    topics.className = "repository-topics-container mt-2 mb-3 js-topics-list-container";
    content.insertBefore(topics, content.children[1]);
}

function set_releases(summary) {
    log('setting releases');
    let tags = xpath('.//a[contains(@href, "/tags")]', summary);
    let release_div = xpath('//div[contains(./h2/a/text(), "Releases")]');

    let release_cnt;
    if (release_div) {
        release_cnt = xpath('./h2/a/span', release_div);
    }
    if (release_cnt) {
        release_cnt = release_cnt.textContent;
    } else if (xpath('./a', release_div)) {
        release_cnt = xpath('./a/span', release_div).textContent;
    } else {
        release_cnt = "0";
    }

    if (release_div) {
        tags.href = xpath('./h2/a', release_div).href;
    } else {
        tags.href = tags.href.replace(/tags$/, 'releases')
    }
    tags.childNodes[3].textContent = release_cnt;
    tags.childNodes[4].textContent = " releases ";
}

function set_contributors(summary) {
    log('setting contributors');
    let contributors = document.createElement('li');
    let contri_nums = xpath('//h2/a[contains(text(), "Contributors")]/span/text()'); // ?.textContent ?? 1;
    contri_nums = contri_nums ? contri_nums.textContent : 1;
    let contri_href = xpath('//h2/a[contains(text(), "Contributors")]/@href');
    contri_href = contri_href ? contri_href.value : `//${window.location.host}/${window.location.pathname}/graphs/contributors`;
    contributors.innerHTML = `<a href="${contri_href}">
      <svg class="octicon octicon-organization" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z"></path></svg>
      <span class="num text-emphasized">
        ${contri_nums}
</span>
      contributors
    </a>`;
    summary.appendChild(contributors);
}

function set_license(summary) {
    log('setting license');
    let _license = xpath('//h3[text() = "License"]/following-sibling::div[1]/a');
    if (_license) {
        let license = document.createElement('li');
        license.appendChild(_license);
        license.children[0].className = "link-gray-dark no-underline d-inline-block";
        summary.appendChild(license);
    }
}

function set_languages(content, overall_summary, summary) {
    log('setting languages');
    let progress = xpath('//h2[text() = "Languages"]/following-sibling::div[1]/span');
    if (progress) {
        overall_summary.className += " border-bottom-0 mb-0 rounded-bottom-0";
        let languages = document.createElement('div');
        languages.className = 'repository-lang-stats';
        languages.appendChild(rename_node(xpath('//h2[text() = "Languages"]/following-sibling::ul[1]'), 'ol'));
        languages.children[0].className = 'repository-lang-stats-numbers';
        for (let li of languages.children[0].children) {
            li.removeAttribute('class');
            li.children[0].removeAttribute('class');
            let svg = li.children[0].children[0];
            svg = rename_node(svg, "span");
            svg.className = "color-block language-color";
            svg.style.backgroundColor = svg.style.color;
        }
        let details = document.createElement('details');
        details.className = "details-reset";
        summary = document.createElement('summary');
        summary.appendChild(progress);
        details.appendChild(summary);
        details.appendChild(languages);

        content.insertBefore(details, content.children[2]);
    }
}

function set_summary(content) {
    log('setting summary');
    let overall_summary = document.createElement('div');
    overall_summary.className = "overall-summary";

    let summary = xpath('//h2[text() = "Git stats"]/following-sibling::ul[1]');
    summary.className = "numbers-summary";

    set_releases(summary);
    set_contributors(summary);
    set_license(summary);

    overall_summary.appendChild(summary);
    content.insertBefore(overall_summary, content.children[1]);

    for (let li of summary.childNodes) {
        li.className = '';
    }

    set_languages(content, overall_summary, summary);
}

function is_main_page() {
    return /^\/[^/]+\/[^/]+\/?(tree\/[^/]+\/?)?$/.test(window.location.pathname);
}

function fxxk() {
    log(`start ${Date.now()}`);
    let code = xpath('//a[./span[@data-content="Code"]]');
    if (!(/ selected /.test(code.className) && is_main_page())) {
        return;
    }
    let content = $('.repository-content');

    set_summary(content);
    set_topics(content);
    set_about(content);

    // Hide new tab
    $('.file-navigation').className += " in-mid-page";
    $('.repository-content > div > .flex-shrink-0:last-child').style.display = 'none';
    content = $('.repository-content > div > .flex-shrink-0');
    content.className = content.className.replace('col-md-9', '');
    log(`end ${Date.now()}`);
}

function wait_for(condition, callback) {
    if (!condition()) {
        log('waiting');
        window.setTimeout(wait_for.bind(null, condition, callback, 50));
    } else {
        log('cancel waiting');
        callback();
    }
}

let style = [`
.Box-header {
  padding: 8px 16px !important;
}`,`
.file-navigation.in-mid-page {
  margin-top: 16px;
}
`];

(function () {
    log('script start');

    wait_for(() => document.head, () => {
        for (let s of style) {
            GM_addStyle(s);
        }
    });

    document.addEventListener('pjax:success', fxxk);

    if (is_main_page()) {
        wait_for(
            () => {
                return xpath('//a[./span[@data-content="Code"]]') &&
                    (xpath('//h2[text() = "About"]/following-sibling::p[1]') ||
                     xpath('//h2[text() = "About"]/following-sibling::div[1]'))
            },
            fxxk
        )
    }
})();