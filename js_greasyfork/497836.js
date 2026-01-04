// ==UserScript==
// @name                light.gg Enhancer
// @name:zh             light.gg 功能增强
// @name:zh-CN          light.gg 功能增强
// @namespace           https://github.com/HirotaZX
// @version             0.3.5
// @description         Enhancement script for the Destiny 2 tool website light.gg, focused on localization improvements and optimization of other features.
// @description:zh      命运2工具网站 light.gg 的增强脚本，着重于本地化体验改善以及一些其他功能的优化。
// @description:zh-CN   命运2工具网站 light.gg 的增强脚本，着重于本地化体验改善以及一些其他功能的优化。
// @author              HirotaZX
// @match               https://www.light.gg/*
// @resource itemList   https://light-gg-enhancer.hirotazx.com/item-list.json?v=202406170600
// @grant               GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/497836/lightgg%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/497836/lightgg%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // append script to page
    var script = document.createElement("script");
    script.textContent =
        "window.itemList = " + GM_getResourceText('itemList') + ";\n\n "
        + "window.lastSearchTime = null;\n\n "
        + makeReviewTabDefault.toString() + "\n\n"
        + transformReviewItems.toString() + "\n\n"
        + appendLocaleSearch.toString() + "\n\n"
        + persistLocale.toString() + "\n\n"
        + "(" + initEnhancer.toString() + ")()\n\n";
    document.body.appendChild(script);

    // make review tab default
    function makeReviewTabDefault() {
        var reviewTab = document.getElementById('review-tab');
        reviewTab && reviewTab.click();
    }

    // transform item words in review to chs and tooltip trigger
    function transformReviewItems(url, xhr) {
        var itemElms = document.querySelectorAll('.item.show-hover');
        var langStr = window.location.pathname.match(/\/db\/(.*)\/items/);
        var lang = langStr ? langStr[1] : 'en';
        var reviewUrlRegex = /api.light.gg\/items\/\d*\/reviews/;
        if (reviewUrlRegex.test(url)) {
            xhr.addEventListener('readystatechange', function (e) {
                if (xhr.readyState === 4) {
                    var originalText = e.target.responseText;
                    var segmentTree = {
                        hash: null,
                        text: originalText,
                        children: null
                    };

                    itemElms.forEach(function (item) {
                        var key = item.dataset.id;
                        if (itemList[key] && itemList[key]['en'] && itemList[key]['en'].trim()) {
                            // match English name and common alias
                            var matchStr = itemList[key]['en'] + (itemList[key]['alias'] ? ('|' + itemList[key]['alias'].join('|')) : '');
                            // match hypen and masterwork
                            var replaceRegex = new RegExp(matchStr.replaceAll('-', '[\\s-_]').replace('Tier 9: ', ''), "ig");

                            function buildTree(node) {
                                if (!node.hash) {
                                    var segArr = node.text.split(replaceRegex);
                                    if (segArr.length > 1) {
                                        node.hash = key;
                                        node.children = segArr.map(function (seg) {
                                            return {
                                                hash: null,
                                                text: seg,
                                                children: null
                                            }
                                        });
                                    }
                                } else if (node.hash != key && node.children) {
                                    node.children.forEach(buildTree);
                                }
                            }
                            buildTree(segmentTree);
                        }
                    });
                    console.log('【light.gg Enhancer】Review segment tree built!', segmentTree);

                    function traverseTree(node) {
                        if (node.children) {
                            var newName = itemList[node.hash][lang] ? itemList[node.hash][lang] : itemList[node.hash]['en'];
                            return node.children.map(traverseTree).join(
                                '<span translate=\\"no\\" style=\\"color:dodgerblue;font-weight:bold;\\" '
                                + 'class=\\"item show-hover notranslate\\" data-id=\\"' + node.hash + '\\">'
                                + newName.replaceAll('"', '\\"')
                                + '</span>');
                        } else {
                            return node.text;
                        }
                    }

                    var modifiedText = traverseTree(segmentTree);
                    Object.defineProperty(xhr, 'response', { writable: true });
                    Object.defineProperty(xhr, 'responseText', { writable: true });
                    xhr.response = xhr.responseText = modifiedText;
                    console.log('【light.gg Enhancer】Review transformed!');
                }
            });
        }
    }

    // append locale item to search results
    function appendLocaleSearch(url, xhr) {
        var searchUrlRegex = /\/db\/search\/all\?q=([^&]*)/;
        var searchUrlStr = url.match(searchUrlRegex);
        if (searchUrlStr && searchUrlStr[1]) {
            xhr.send = function () {
                var searchTime = (new Date()).getTime();
                if (lastSearchTime && (searchTime - lastSearchTime < 1000)) {
                    console.log('【light.gg Enhancer】Abort search!');
                    xhr.abort();
                    return;
                }
                lastSearchTime = searchTime;

                var query = decodeURIComponent(searchUrlStr[1]).trim();
                if (!query || query.length < 2) {
                    console.log('【light.gg Enhancer】Abort search!');
                    xhr.abort();
                    return;
                }

                setTimeout(function () {
                    var modifiedText = '<ul id="site-search-result-list" class="list-unstyled">';

                    var localeResults = {};
                    var nonLangProps = ['icon', 'type', 'alias'];
                    for (const key in itemList) {
                        for (const property in itemList[key]) {
                            if (!nonLangProps.includes(property) && itemList[key][property].toLowerCase().includes(query.toLowerCase())) {
                                if (!localeResults[key]) {
                                    localeResults[key] = [];
                                }
                                localeResults[key].push(property);
                            }
                        }
                    }

                    var localeResultStr = '';
                    // sort results in weapon, armor, mods order and take first 50
                    Object.keys(localeResults).sort(function (entryA, entryB) {
                        return itemList[entryA].type - itemList[entryB].type;
                    }).slice(0, 50).forEach(function (key) {
                        var localeNames = '';
                        localeResults[key].forEach(function (lang) {
                            localeNames += itemList[key][lang] + ' / ';
                        });
                        if (localeNames) {
                            localeNames = localeNames.slice(0, -3);
                        }
                        localeResultStr += '<li class="basic "><a href="/db/items/' + key + '" class="clearfix">'
                            + '<div class="icon"><img src="https://www.bungie.net/common/destiny2_content/icons/'
                            + itemList[key].icon + '" alt="' + itemList[key]['en'] + '" class="pull-left" /></div>'
                            + '<div><div><strong class="text-basic ">' + itemList[key]['en']
                            + '</strong></div><div><span>' + localeNames + '</span></div></div></a></li>';
                    });

                    modifiedText += localeResultStr;
                    if (!localeResultStr) {
                        modifiedText += '<li><a href="javascript:"><div><span><em>No items found</em></span></div></a></li>';
                    }

                    modifiedText += '</ul>';
                    Object.defineProperty(xhr, 'response', { writable: true });
                    Object.defineProperty(xhr, 'responseText', { writable: true });
                    Object.defineProperty(xhr, 'status', { writable: true });
                    xhr.response = xhr.responseText = modifiedText;
                    xhr.status = 200;
                    xhr.onload();
                    console.log('【light.gg Enhancer】Locale search results appended!');
                }, 0);
            };
        }
    }

    // remember locale
    function persistLocale() {
        var localeStr = window.location.pathname.match(/\/db\/(.*)\/items|\/db\/items/);
        if (!localeStr || !localeStr[0]) {
            console.log('【light.gg Enhancer】None item page.');
            return;
        }
        initLocale();
        listenLocaleChange();

        // redirect to saved locale on enter item page
        function initLocale() {
            var savedLocale = window.localStorage.getItem("enhancer-locale");
            console.log('【light.gg Enhancer】Saved locale: ' + savedLocale);

            var curLocale = localeStr[1];
            if (curLocale) {
                if (savedLocale) {
                    if (savedLocale != curLocale) {
                        window.location.replace(window.location.pathname.replace(/\/db\/.*\/items/, '/db/' + savedLocale + '/items'));
                        console.log('【light.gg Enhancer】Redirect to saved locale: ' + savedLocale);
                    }
                } else {
                    window.localStorage.setItem("enhancer-locale", curLocale);
                    console.log('【light.gg Enhancer】Locale ' + curLocale + ' saved!');
                }
            } else {
                if (savedLocale && savedLocale != 'en') {
                    window.location.replace(window.location.pathname.replace(/\/db\/items/, '/db/' + savedLocale + '/items'));
                    console.log('【light.gg Enhancer】Redirect to saved locale: ' + savedLocale);
                }
            }
        }

        // save locale on click locale icon
        function listenLocaleChange() {
            var localeLinks = document.querySelectorAll('#localemodal a, #sidebar-locales a');
            localeLinks.forEach(function (link) {
                link.dataset.href = link.href;
                link.href = 'javascript:void(0);';
                link.addEventListener('click', handleLocaleClick);
            });

            function handleLocaleClick(e) {
                var elm = e.currentTarget;
                if (elm.dataset && elm.dataset.href) {
                    var elmLocale = 'en';
                    var elmLocaleStr = elm.dataset.href.match(/\/db\/(.*)\/items|\/db\/items/);
                    if (elmLocaleStr && elmLocaleStr[1]) {
                        elmLocale = elmLocaleStr[1];
                    }
                    window.localStorage.setItem("enhancer-locale", elmLocale);
                    console.log('【light.gg Enhancer】Locale ' + elmLocale + ' saved!');
                    window.location.replace(elm.dataset.href);
                }
            }
        }
    }


    function initEnhancer() {
        makeReviewTabDefault();
        persistLocale();

        // hijack xhr to modify requests
        var realOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function () {
            var url = arguments['1'];
            transformReviewItems(url, this);
            appendLocaleSearch(url, this);
            return realOpen.apply(this, arguments);
        }
    }
})();

