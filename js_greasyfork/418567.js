 // ==UserScript==
// @name         GitRevertHub
// @namespace    com.crankysupertoon
// @version      1.29
// @description  Revert the change that no one liked
// @author       Parker Hanegan
// @match        https://*.github.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/418567/GitRevertHub.user.js
// @updateURL https://update.greasyfork.org/scripts/418567/GitRevertHub.meta.js
// ==/UserScript==

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function first(elems) {
    if (elems.length >= 0) return elems[0];
    return null;
}

function findByRecursing(attribute, node, matchExpr) {
    while(node) {
        if (node['matches'] && node.matches(matchExpr))
            return node;
        node = node[attribute];
    }
}

function css(css_string) {
    const style = document.createElement('style');
    style.innerHTML = css_string;
    requestAnimationFrame(() => document.body.appendChild(style));
};

//// COMMITS
function get_commits_node() {
    var node = findByRecursing('parentNode', document.querySelector('span[aria-label="Commits on master"]'), 'a') ??
        findByRecursing('parentNode', first(Array.from(document.querySelectorAll("span")).filter(n => n.innerText=='commits')), 'a');
    return node;
}

function get_commits_href() {
    return get_commits_node()?.href;
}

function get_commits_number() {
    return get_commits_node()?.innerText?.trim()?.match(/([,\d]+) commit(s)?/)?.[1] || get_commits_node()?.querySelector('strong')?.innerText?.trim()?.match(/([,\d]+)/)?.[1];
}

//// BRANCHES
function get_branches_node() {
    return findByRecursing('parentNode', first(Array.from(document.querySelectorAll("span")).filter(n => n.innerText=='branches' || n.innerText=='branch')), 'a');
}

function get_branches_href() {
    return get_branches_node()?.href;
}

function get_branches_number() {
    return get_branches_node()?.innerText?.trim()?.match(/([,\d]+) branch(es)?/)?.[1] || 1;
}

//// RELEASES

function get_releases_node() {
    return first(Array.from(document.querySelectorAll("a")).filter(n => n?.innerText?.startsWith('Releases')));
}

function get_releases_href() {
    return get_releases_node()?.href;
}

function get_releases_number() {
    return get_releases_node()?.innerText?.trim()?.match(/Releases ([,\d]+)/)?.[1] ?? 0;
}

//// TAGS
function get_tags_node() {
    return findByRecursing('parentNode', first(Array.from(document.querySelectorAll("span")).filter(n => n.innerText=='tags' || n.innerText=='tag')), 'a');
}

function get_tags_href() {
    return get_tags_node?.href;
}

function get_tags_number() {
    return get_tags_node()?.innerText?.trim()?.match(/([,\d]+) tags?/)?.[1]?.replace(',','') || 1;
}

//// CONTRIBUTORS
function get_contributors_node() {
    return first(Array.from(document.querySelectorAll("a")).filter(n=>n?.href?.endsWith('graphs/contributors')));
}

function get_contributors_href() {
    var href = get_contributors_node()?.href;
    if (href) return href;

    var repo_href = document.querySelector('a[data-pjax="#js-repo-pjax-container"]')?.href;
    if (repo_href) return repo_href+'/graphs/contributors';
}

function get_contributors_count() {
    return get_contributors_node()?.innerText?.trim()?.match(/Contributors ([,\d]+\+?)/)?.[1] ?? '';
}


//// LICENSE
function get_license_node() {
    return findByRecursing('nextSibling', first(Array.from(document.querySelectorAll('h3')).filter(n=>n.innerText == 'License')), 'div')?.querySelector('a');
}

function get_license_href() {
    return get_license_node()?.href;
}

function get_license_text() {
    return get_license_node()?.innerText?.trim();
}


//// ABOUT
function get_about_text() {
    return findByRecursing('nextSibling', first(Array.from(document.querySelectorAll('h2')).filter(n=>n.innerText == 'About')), 'p')?.innerText?.trim();
}

function get_link_node() {
    return findByRecursing('nextSibling', first(Array.from(document.querySelectorAll('h2')).filter(n=>n.innerText == 'About')), 'div')?.querySelector('a');
}

function create_summary_block_html(summary) {
return  `
<div id="summary-block">
<p class="f4">${summary.about_text || ''}

<div style="border: 1px solid rgba(27, 31, 35, 0.2); position: relative; border-radius: 6px; box-sizing: border-box" class="border-bottom-0 mb-0 rounded-bottom-0">
    <ul style="display: table; width: 100%; table-layout: fixed" class="">
        <li class="" style="display: table-cell; padding: 0; text-align: center; white-space: nowrap">
            <a style="padding: 10px 0 !important; display: block;" data-pjax="" href="${summary.commits_href}" class="pl-3 pr-3 py-3 p-md-0 mt-n3 mb-n3 mr-n3 m-md-0 link-gray-dark no-underline no-wrap">
                <svg height="16" class="octicon octicon-history text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path>
                </svg>
                <span class="d-none d-sm-inline">
                    <strong>${summary.commits}</strong>
                    <span aria-label="Commits on master" class="text-gray ">commit${String(summary.commits) == "1" ? "" : "s"}</span>
                </span>
            </a>
        </li>
        <li class="" style="display: table-cell; padding: 0; text-align: center; white-space: nowrap">
            <a style="padding: 10px 0 !important; display: block;" data-pjax="" href="${summary.branches_href}" class="link-gray-dark no-underline">
                <svg height="16" class="octicon octicon-git-branch text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path>
                </svg>
                <span class="d-none d-sm-inline">
                <strong>${summary.branches}</strong>
                branch${String(summary.branches) == "1" ? "" : "es"}
                </span>
            </a>
        </li>
        <li class="" style="display: table-cell; padding: 0; text-align: center; white-space: nowrap">
            <a style="padding: 10px 0 !important; display: block;" data-pjax="" href="${summary.releases_url}" class="link-gray-dark no-underline">
                <svg height="16" class="octicon octicon-tag text-gray" text="gray" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path>
                </svg>
                <span class="d-none d-sm-inline"><strong>${summary.releases}</strong> release${String(summary.releases) == "1" ? "" : "s"}</a></span>
        </li>
        <li class="" style="display: table-cell; padding: 0; text-align: center; white-space: nowrap">
            <a style="padding: 10px 0 !important; display: block;" href="${summary.contributors_url}" class="link-gray-dark no-underline">
                <svg class="octicon octicon-organization" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" text="gray">
                    <path fill-rule="evenodd" d="M16 12.999c0 .439-.45 1-1 1H7.995c-.539 0-.994-.447-.995-.999H1c-.54 0-1-.561-1-1 0-2.634 3-4 3-4s.229-.409 0-1c-.841-.621-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.442.58 2.5 3c.058 2.41-.159 2.379-1 3-.229.59 0 1 0 1s1.549.711 2.42 2.088C9.196 9.369 10 8.999 10 8.999s.229-.409 0-1c-.841-.62-1.058-.59-1-3 .058-2.419 1.367-3 2.5-3s2.437.581 2.495 3c.059 2.41-.158 2.38-1 3-.229.59 0 1 0 1s3.005 1.366 3.005 4z"></path>
                </svg>
                <span class="d-none d-sm-inline">
                <span class="num text-emphasized">
                    ${summary.contributors}
                </span>
                contributor${String(summary.contributors) == "1" ? "" : "s"}
                </span>
            </a>
        </li>
        <li class="" style="display: table-cell; padding: 0; text-align: center; white-space: nowrap">
            <a style="padding: 10px 0 !important; display: block;" href="${summary.license_url || '#'}" class="link-gray-dark no-underline">
                <svg height="16" class="octicon octicon-law mr-2" mr="2" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path>
                </svg>
                <span class="d-none d-sm-inline">
                ${summary.license_text || "No license"}
                </span>
            </a>
        </li>
    </ul>
</div>
</div>`
}

function create_languages_element() {
    var L = first(Array.from(document.querySelectorAll('h2')).filter(n=>n.innerText == 'Languages'))
    if (L) {
        var languagesElement = createElementFromHTML('<details id="languages-element" style="margin-bottom: 5px;margin-top: -2px"><summary style="display: block">' + L.nextElementSibling.innerHTML + '</summary><div>' + L.nextElementSibling.nextElementSibling.innerHTML + '</div></details>');
        Array.from(languagesElement.querySelectorAll('li')).map(n=>n.setAttribute('style', "display: table-cell; width: 1%; padding: 10px 5px; text-align: center; white-space: nowrap; border-bottom: 0;"));
        Array.from(languagesElement.querySelectorAll('li')).map(n=>n.setAttribute('class', ""));
        Array.from(languagesElement.querySelectorAll('.text-small')).map(n=>n.classList.remove('text-small'));
        return languagesElement;
    }
}


function create_new_header() {
    var tags_node = get_tags_node();
    var summary = {"commits_href": get_commits_href(),
               "commits": get_commits_number(),
               "branches_href": get_branches_href(),
               "branches": get_branches_number(),
               "releases_url":  get_releases_href(),
               "releases": get_releases_number() || get_tags_number(),
               "contributors_url": get_contributors_href(),
               "contributors": get_contributors_count(),
               "license_url": get_license_href(),
               "license_text": get_license_text(),
               "about_text": get_about_text()};

    if (summary.commits && document.getElementById('summary-block') === null) {
        var summary_node = createElementFromHTML(create_summary_block_html(summary));
        var repository_content_node = document.querySelector('div.repository-content')
        var gutter_node = document.querySelector('div.gutter-condensed');
        repository_content_node.insertBefore(summary_node, gutter_node);
        var languages_element = create_languages_element();
        if (languages_element) {
            summary_node.appendChild(languages_element);
        } else {
            summary_node.querySelector('div').classList.remove('border-bottom-0');
            summary_node.querySelector('div').classList.remove('rounded-bottom-0');
            summary_node.style.marginBottom = "10px";
        }

        //remote clutter
        get_tags_node()?.setAttribute('style', 'display: none');
        get_branches_node()?.setAttribute('style', 'display: none');
    }
}
  
function main() {
    css(`
        div.BorderGrid.BorderGrid--spacious {display:none; width: 0%;}
        details summary::-webkit-details-marker {display:none;}
        div.Box-body.px-5.pb-5 {position: relative; right: 5%; border: 0px;}
        div.flex-shrink-0.col-12.col-md-9.mb-4.mb-md-0 {width: 100%;}
        div.h-card.mt-md-n5 {width: 85%;}
    `);

    create_new_header();
}

document.addEventListener('pjax:end', function() {
    main();
});

main();