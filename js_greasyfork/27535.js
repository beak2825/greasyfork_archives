// ==UserScript==
// @name         DSA Wiki Crawler
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Crawling the Wiki and refactor it the good way
// @author       David Mahl
// @match        http://www.ulisses-regelwiki.de/index.php/za_zaubersprueche.html
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/lodash/4.14.2/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/27535/DSA%20Wiki%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/27535/DSA%20Wiki%20Crawler.meta.js
// ==/UserScript==

// Checksum should be "284666"
(function() {
    'use strict';
    var stop= false,
        storage = {},
        CONST = {
            'CONTENT' : {
                'PUBLIKATION':'Publikation',
                'ASP':'AsP-Kosten',
                'AP':'AP-Wert',
                'ERSCHWERNIS':'Erschwernis',
                'VORAUSSETZUNGEN':'Voraussetzungen',
                'KAMPFTECHNIKEN':'Kampftechniken',
                'REICHWEITE':'Reichweite'
            },
            'GLOBAL' : {
                'ADDTOSTARTINDEX': 2,
                'CUTPARAGRAPH': 4,
                'CUTSTRONG': 10,
                'ARTICLEQUERY':'.mod_article .ce_text',
                'ITEMQUERY':'nav table a[role="menuitem"]'
            }
        },
        app = {
            getAllNavigationEntrys: function(result, entryPoint) {
                var $itemQuery = $(CONST.GLOBAL.ITEMQUERY),
                    $article = $(CONST.GLOBAL.ARTICLEQUERY),
                    content = {
                        'Publikation': undefined,
                        'AsP-Kosten':undefined,
                        'AP-Wert':undefined,
                        'Erschwernis':undefined,
                        'Voraussetzungen':undefined,
                        'Kampftechniken':undefined,
                        'Reichweite':undefined,
                        'Info': ""
                    };

                if (result !== undefined) {
                    $itemQuery = $(result).find(CONST.GLOBAL.ITEMQUERY);
                    $article = $(result).find(CONST.GLOBAL.ARTICLEQUERY);
                }

                if ($article.length === 1) {
                    $article.find('p').each(function(i, e){
                        var element = $(e).prop('outerText'),
                            added = false;

                        $.each(CONST.CONTENT, function(key, value) {
                            var index = element.indexOf(value);

                            //console.log('found p | ', key,' | ', value);
                            if (index >= 0) {
                                content[value] = element.substring(index + value.length + CONST.GLOBAL.ADDTOSTARTINDEX, element.length);
                                added = true;
                                //console.log('Content:',content);
                                return false;
                            }
                        });
                        if (added !== true) {
                            content.Info = content.info + element.substring(0, element.length);
                        }
                    });
                    _.setWith(storage, entryPoint+'.content', content);
                    //console.log('storage', entryPoint, ' - ',storage);
                }

                $itemQuery.each(function(i, e) {
                    var title = $(this).attr('title'),
                        href= $(this).attr('href'),
                        objectPath= entryPoint === undefined?'root.'+title:entryPoint+'.children.'+title;

                    _.setWith(storage, objectPath, {'title':title, 'href':href});
                    app.crawlSubNavigation(_.get(storage, objectPath + '.href'), objectPath);
                });
                app.writeToLocalStorage();
            },
            crawlSubNavigation: function(url, entryPoint) {
                app.loadPage(url)
                    .then(app.parsePage.bind(null, entryPoint))
                    .fail(function (err) {
                    throw new Error('Error while Loading Time');
                });
            },
            parsePage: function(entryPoint, result) {
                app.getAllNavigationEntrys(result, entryPoint);
            },
            loadPage: function(url) {
                return $.ajax( {
                    url: url,
                    type: "POST",
                    dataType: "html"
                });
            },
            writeToLocalStorage() {
                var checksum = Object.keys(storage).length;
                localStorage.setItem('wikiData', JSON.stringify(storage));
                localStorage.setItem('wikiData.checksum',JSON.stringify(storage).length);
            },
            init: function() {
                // Retrieve the object from storage
                var retrievedObject = localStorage.getItem('wikiData'),
                    checksum = localStorage.getItem('wikiData.checksum');

                app.parsePage();
//                if (retrievedObject === null) {
//                    app.parsePage();
//                } else {
//                    storage = JSON.parse(retrievedObject);
//                }
                console.log('Storage:',storage);
            }
        };
    app.init();
})();