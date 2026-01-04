// ==UserScript==
// @name       Next page script
// @namespace  http://use.i.E.your.homepage/
// @version    1.7
// @description  Automatically loads next page once you reach bottom of the page
// @match      *://www.limundo.com/*
// @match      *://www.kupindo.com/*
// @match      *://www.vukajlija.com/*
// @match      *://vukajlija.com/*
// @match      *://www.kupujemprodajem.com/*
// @match      *://novi.kupujemprodajem.com/*
// @match      *://www.ana.rs/forum/*
// @match      *://www.polovniautomobili.com/*
// @match      *://kengarex.com/*
// @match      *://www.2bike.rs/cikloberza/mali-oglasi*
// @require	   http://code.jquery.com/jquery-3.5.0.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/31740/Next%20page%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31740/Next%20page%20script.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);
(function ($) {
    console.log('--- Next page script ----');
    var end = false;
    var pages = [
    ];
    var loader = $('<div/>', {
        html: 'Loading...'
    }) .css({
        position: 'fixed',
        bottom: 0,
        right: 0,
        background: 'green',
        color: 'white',
        padding: '10px',
        'font-size': '16px',
        display: 'none',
        'z-index': 1000
    }) .appendTo($('body'));
    var gotoTop = $('<div/>', {
        html: '&uarr;'
    }) .css({
        position: 'fixed',
        bottom: 0,
        right: 0,
        background: 'green',
        color: 'white',
        padding: '10px',
        width: '50px',
        'text-align': 'center',
        'font-size': '16px',
        cursor: 'pointer'
    }) .appendTo($('body')) .on('click', function () {
        $(window) .scrollTop(0);
    });
    var sites = {
        'limundo': {
            link: '.pagination li:eq(-2) a',
            content: '#main'
        },
        'kupindo': {
            link: 'a.next_prev_link:not(:first-child)',
            content: '#container_right'
        },
        'vukajlija': {
            link: 'li.next_page a',
            content: '#left-column'
        },
        'www.kupujemprodajem': {
            link: function ($page) {
                var f = document.forms.pagingList;
                var currentPageLink = $page.find('li.this-page').last();

                //check if there is next page (link sledeca)
                if (!currentPageLink.next().is('li')){
                    return null;
                }
                var currentPage = currentPageLink.html();
                if (currentPage) {
                   f.elements['data[page]'].value = parseInt(currentPage) + 1;
                   return 'search.php?' + $(f) .serialize();
                } else {
                    return null;
                }

            },
            content: '#searchResultTableHolder',
            specific: function ($currentPage, $loadedPage) {
                //because pagging is out of content (after content in dom) this change is needed
                //to know on which page you are currently on
                var pagging = $loadedPage.find('.pageBarHolder').last()[0].outerHTML;
                $currentPage
                    .find(this.content)
                    .append(pagging);
                $currentPage.find('.pageBarHolder').last().html(pagging);
            }
        }, 
        'novi.kupujemprodajem': {
            link: function () {
              var links = $('body').find('ul[class^=Pagination_pagination]');
              var numberOfLoadedPages = links.length;
              var nextPageLink =  window.location.href.replace(/\d+$/,numberOfLoadedPages + 1);
              return nextPageLink;
            },
            content: 'div[class^=Grid_col-lg-10]'
        },
        'ana': {
            link: 'a.navPages:last',
            content: '#main_content_section'
        },
        '2bike': {
            link: function ($page) {
                var href = $('body').find('.pagination .next a').last().attr('href');
                if (!href || !href.includes('page')) {
                    return null;
                }
                return href;
            },
            content: '.listingWrapper'
        },
        'polovniautomobili': {
            link: '.js-pagination-next',
            content: '.js-hide-on-filter:nth-of-type(2)',
            specific: function () {
                setTimeout(function () {
                    [].slice.call(document.querySelectorAll("img.lazy")).forEach(function (lazyImage) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.srcset = lazyImage.dataset.srcset;
                        lazyImage.classList.remove("lazy");
                    })
                }, 500);
            }
        },
        'kengarex': {
            link: '.pagination a:last-child',
            content: '.post-single-content',
            specific: function () {
                $('footer').remove();
            }
        }
    };
    var site = null,
        $lastLoadedPage = null,
        $win = $(window),
        win = window,
        $doc = $(document),
        winHeight = window.innerHeight,
        //content left to trigger loading, 0.8 of current viewport height
        bottomTrigger = winHeight * 0.8;

    var contentHeightToScroll = function () {
        //content left to scroll, under the viewport
    	return $doc.height() - ($win.scrollTop() + winHeight);
    };

    //next image script for kupujemprodajme
    // 20190128 kp has this feature implemented. no need for this any more
    /*$('body').on('keydown', function (e) {
        switch(e.keyCode) {
            case 37:
                $('.big-left-arrow').click();
                break;
            case 39:
                $('.big-right-arrow').click();
                break;
        }
    });*/

    $win.scroll(function () {
        if (contentHeightToScroll() < bottomTrigger) {
            if (!site) {
                $.each(sites, function (siteKey, siteData) {
                    if (location.href.indexOf(siteKey) !== - 1) {
                        site = siteData;
                        return false;
                    }
                });
            }

            var url;
            if ($.type(site.link) == 'string') {
                var link = $(site.link) .last();
                if (link.length) {
                    url = link.attr('href');
                }
            } else {
                url = site.link($lastLoadedPage || $('body'));
            }
            if (url) {
                if (pages.indexOf(url) != - 1) {
                    return ;
                }
                console.log('load: ' + url);

                loader.show();
                pages.push(url);
                $.get(url, function (data) {
                    loader.hide();
                    console.log('done');
                    //debugger;
                    console.log($(site.content));
                    data = $(data);
                    $lastLoadedPage = data;
                    data.find(site.content).find('script').remove();
                    $(site.content).append(data.find(site.content).children());
                    if (site.specific) {
                        site.specific($('body'), $lastLoadedPage);
                    }
                });
            }
        }
    });
}(jq));
