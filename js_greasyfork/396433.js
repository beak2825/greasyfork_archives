// ==UserScript==
// @name         cda.pl, vimeo - lista wideo w folderze i wyszukiwarce
// @namespace    https://greasyfork.org/pl/scripts/396433
// @version      0.5.1
// @description  Pokazuje listę linków do filmów z wszystkich stron danego folderu (ale nie w podfolderach) lub wyniku wyszukiwania (bez folderów). Linki nie prowadzą bezpośrednio do filmu, lecz do jego strony.
// @author       Dove6
// @include      https://www.cda.pl/*/folder*
// @include      https://www.cda.pl/info/*?section=video
// @include      https://www.cda.pl/video/show/*
// @include      https://vimeo.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396433/cdapl%2C%20vimeo%20-%20lista%20wideo%20w%20folderze%20i%20wyszukiwarce.user.js
// @updateURL https://update.greasyfork.org/scripts/396433/cdapl%2C%20vimeo%20-%20lista%20wideo%20w%20folderze%20i%20wyszukiwarce.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* jshint multistr: true */
(function() {
    'use strict';
    
    const dom_parser = new DOMParser();

    class LinksFetcher {
        callback(links) {
            console.log(links.join(' '));
        }
        isBusy() {
            throw new Error('This method is abstract');
        }
        parseFetchedPage(text_html) {
            return text_html;
        }
        fetchLinks(source_url = this.source_url, direction = null) {
            throw new Error('This method is abstract');
        }
        createButton(name) {
            let s = document.createElement('span');
            s.className = 'fetch-links-button';
            s.innerHTML = name;
            s.style.border = '2px solid green';
            s.style.borderRadius = '2px';
            s.style.padding = '5px';
            s.style.margin = '10px';
            s.style.fontWeight = 'bold';
            s.style.cursor = 'pointer';
            return s;
        }
    }

    class RecursiveLinksFetcher extends LinksFetcher {
        setReachedEnd(direction) {
            this.reached_end[direction] = true;
            if (this.reached_end.left && this.reached_end.right) {
                this.callback(this.links);
            }
        }
        isBusy() {
            return (!this.reached_end.left || !this.reached_end.right);
        }
        constructor(source_url, callback = null) {
            super();
            this.links = [];
            this.reached_end = {'left': true, 'right': true};
            this.source_url = source_url;
            if (callback !== null) {
                this.callback = callback;
            }
        }
        getLinksFromParsedPage(parsed_page) {
            throw new Error('This method is abstract');
        }
        getNextURLFromParsedPage(parsed_page) {
            throw new Error('This method is abstract');
        }
        getPreviousURLFromParsedPage(parsed_page) {
            throw new Error('This method is abstract');
        }
        fetchLinks(source_url = this.source_url, direction = null) {
            this.reached_end.left = false;
            this.reached_end.right = false;
            this.links = [];
            fetch(source_url).then(
                (result) => {
                    let fetched_page = result.text().then(
                        (result_text) => {
                            let parsed_page = this.parseFetchedPage(result_text);
                            this.links = this.links.concat(this.getLinksFromParsedPage(parsed_page));
                            let urls = {
                                'next': this.getNextURLFromParsedPage(parsed_page),
                                'previous': this.getPreviousURLFromParsedPage(parsed_page)
                            };
                            if (direction === 'right' || direction === null) {
                                if (urls.next !== undefined && urls.next !== null) {
                                    console.log('Next page: ' + urls.next);
                                    this.fetchLinks(urls.next, 'right');
                                } else {
                                    this.setReachedEnd('right');
                                }
                            }
                            if (direction === 'left' || direction === null) {
                                if (urls.previous !== undefined && urls.previous !== null) {
                                    console.log('Previous page: ' + urls.previous);
                                    this.fetchLinks(urls.previous, 'left');
                                } else {
                                    this.setReachedEnd('left');
                                }
                            }
                        }
                    );
                }
            );
        }
    }

    class IterativeLinksFetcher extends LinksFetcher {
        decrementCounter() {
            if (this.counter > 0) {
                this.counter--;
            }
            if (this.counter === 0) {
                this.callback(this.links);
            }
        }
        isBusy() {
            return (this.counter !== 0);
        }
        constructor(source_url, callback = null) {
            super();
            this.links = [];
            this.counter = 0;
            this.source_url = source_url;
            if (callback !== null) {
                this.callback = callback;
            }
        }
        getLinksFromParsedPage(parsed_page) {
            throw new Error('This method is abstract');
        }
        getSpecifiedPageNumberURL(source_url, page_number) {
            throw new Error('This method is abstract');
        }
        fetchLinks(source_url = this.source_url, direction = null) {
            let page_numbers = {
                min: Number(document.querySelector('.fetch-links-settings.minimum').value),
                max: Number(document.querySelector('.fetch-links-settings.maximum').value)
            };
            console.log(page_numbers);
            if (page_numbers.min <= page_numbers.max) {
                this.counter = page_numbers.max - page_numbers.min + 1;
                this.links = [];
                for (let page_number = page_numbers.min; page_number <= page_numbers.max; page_number++) {                
                    let page_url = this.getSpecifiedPageNumberURL(source_url, page_number);
                    console.log('Now fetching page: ' + page_url);
                    fetch(page_url).then(
                        (result) => {
                            let fetched_page = result.text().then(
                                (result_text) => {
                                    let parsed_page = this.parseFetchedPage(result_text);
                                    this.links = this.links.concat(this.getLinksFromParsedPage(parsed_page));
                                    this.decrementCounter();
                                }
                            );
                        }
                    );
                }
            }
        }
    }

    class CDASearchLinksFetcher extends IterativeLinksFetcher {
        parseFetchedPage(text_html) {
            return dom_parser.parseFromString(text_html, 'text/html');
        }
        getLinksFromParsedPage(parsed_page) {
            return Array.from(parsed_page.querySelectorAll('.text.text-video > .link-title-visit')).map(function(e) {
                return e.href;
            });
        }
        getSpecifiedPageNumberURL(source_url, page_number) {
            let result_url = new URL(source_url);
            let result_path = result_url.pathname;
            let last_slash = result_path.lastIndexOf('/');
            if ((/show/).test(result_path.slice(result_path.lastIndexOf('/', last_slash - 1)))) {
                result_path += '/p' + String(page_number);
            } else {
                result_path = result_path.slice(0, last_slash + 1) + 'p' + String(page_number);
            }
            result_url.pathname = result_path;
            return result_url.toString();
        }
        createButton(name = 'Pobierz linki') {
            let s = super.createButton(name);
            s.onclick = (function() {
                if (!this.isBusy()) {
                    if (document.querySelector('.fetch-links-result').innerHTML.length !== 0) {
                        document.querySelector('.fetch-links-result').innerHTML = '';
                        document.querySelector('.fetch-links-result').style.display = 'none';
                    }
                    this.fetchLinks();
                }
            }).bind(this);
            return s;
        }
    }

    class CDAFolderLinksFetcher extends IterativeLinksFetcher {
        parseFetchedPage(text_html) {
            return dom_parser.parseFromString(text_html, 'text/html');
        }
        getLinksFromParsedPage(parsed_page) {
            return Array.from(parsed_page.getElementsByClassName('link-title-visit')).map(function(e) {
                return e.href;
            });
        }
        getSpecifiedPageNumberURL(source_url, page_number) {
            let result_url = new URL(source_url);
            let result_path = result_url.pathname;
            let last_slash = result_path.lastIndexOf('/');
            if ((/vfilm/).test(result_path.slice(last_slash))) {
                result_path += '/' + String(page_number);
            } else {
                if ((/folder/).test(result_path.slice(result_path.lastIndexOf('/', last_slash - 1)))) {
                    result_path += '/' + String(page_number);
                } else {
                    result_path = result_path.slice(0, last_slash + 1) + String(page_number);
                }
            }
            result_url.pathname = result_path;
            return result_url.toString();
        }
        createButton(name = 'Pobierz linki') {
            let s = super.createButton(name);
            s.onclick = (function() {
                if (!this.isBusy()) {
                    if (document.querySelector('.fetch-links-result').innerHTML.length !== 0) {
                        document.querySelector('.fetch-links-result').innerHTML = '';
                        document.querySelector('.fetch-links-result').style.display = 'none';
                    }
                    this.fetchLinks();
                }
            }).bind(this);
            return s;
        }
    }

    class VimeoSearchLinksFetcher extends IterativeLinksFetcher {
        parseFetchedPage(text_html) {
            return JSON.parse(text_html.match(/var data \= (.+?);\n/)[1]);
        }
        getLinksFromParsedPage(parsed_page) {
            return parsed_page.filtered.data.map(function(e) {
                return e.clip.link;
            });
        }
        getSpecifiedPageNumberURL(source_url, page_number) {
            let result_url = new URL(source_url);
            let result_params = result_url.searchParams;
            result_params.set('page', page_number);
            result_url.search = result_params.toString();
            return result_url.toString();
        }
        createButton(name = 'Pobierz linki') {
            let s = super.createButton(name);
            s.style.color = '#456';
            s.style.backgroundColor = '#efe';
            s.onclick = (function() {
                if (!this.isBusy()) {
                    if (document.querySelector('.fetch-links-result').innerHTML.length !== 0) {
                        document.querySelector('.fetch-links-result').innerHTML = '';
                        document.querySelector('.fetch-links-result').style.display = 'none';
                    }
                    this.fetchLinks();
                }
            }).bind(this);
            return s;
        }
    }


    if ((/vimeo\.com\/search/).test(location.href)) { //Vimeo search
        if (document.getElementsByClassName('fetch-links-button').length === 0 && document.getElementsByClassName('iris_link-box').length > 0) {
            let parent_div = document.querySelector('.header_region');
            if (parent_div !== null) {
                let result_div = document.createElement('div');
                result_div.className = 'fetch-links-result';
                result_div.style.border = '2px solid gray';
                result_div.style.borderRadius = '5px';
                result_div.style.padding = '5px';
                result_div.style.margin = '10px';
                result_div.fontFamily = 'monospace';
                result_div.style.display = 'none';
                parent_div.appendChild(result_div);

                let input_div = document.createElement('div');
                parent_div.insertBefore(input_div, result_div);
                let links_getter = new VimeoSearchLinksFetcher(location.href, function(links) {
                    result_div.innerHTML = links.join(' ');
                    result_div.style.display = 'block';
                });
                input_div.appendChild(links_getter.createButton());
                let pagination_data = JSON.parse(document.documentElement.outerHTML.match(/var data \= (.+?);\n/)[1]).filtered.paging;
                let page_numbers = {
                    min: (new URLSearchParams(pagination_data.first)).get('page'),
                    max: (new URLSearchParams(pagination_data.last)).get('page')
                };
                let min_page = document.createElement('input');
                min_page.className = 'fetch-links-settings minimum';
                min_page.type = 'number';
                min_page.min = page_numbers.min;
                min_page.max = page_numbers.max;
                min_page.value = page_numbers.min;
                input_div.appendChild(min_page);
                let max_page = document.createElement('input');
                max_page.className = 'fetch-links-settings maximum';
                max_page.type = 'number';
                max_page.min = page_numbers.min;
                max_page.max = page_numbers.max;
                max_page.value = page_numbers.max;
                input_div.appendChild(max_page);
            }
        }
    } else if ((/cda\.pl\/.+\/folder/).test(location.href)) { //cda folder
        if (document.getElementsByClassName('fetch-links-button').length === 0 && document.getElementsByClassName('link-title-visit').length > 0) {
            let parent_div = document.querySelector('#folder-replace .panel-body');
            if (parent_div !== null) {
                let result_div = document.createElement('div');
                result_div.className = 'fetch-links-result';
                result_div.style.border = '2px solid gray';
                result_div.style.borderRadius = '5px';
                result_div.style.padding = '5px';
                result_div.style.margin = '10px';
                result_div.style.backgroundColor = 'black';
                result_div.fontFamily = 'monospace';
                result_div.style.display = 'none';
                parent_div.insertBefore(result_div, parent_div.children[1]);

                let input_div = document.createElement('div');
                parent_div.insertBefore(input_div, result_div);
                let links_getter = new CDAFolderLinksFetcher(location.href, function(links) {
                    result_div.innerHTML = links.join(' ');
                    result_div.style.display = 'block';
                });
                input_div.appendChild(links_getter.createButton());
                let pagination_data;
                if (location.href.indexOf('folder-glowny') === -1) {
                    pagination_data = document.querySelector('#navigation_foldery .active .item-file').innerHTML;
                } else {
                    pagination_data = document.querySelector('#navigation_foldery a[href*="glowny"] .item-file').innerHTML;
                }
                let page_numbers = {
                    min: 1,
                    max: Math.ceil(Number(pagination_data.match(/\d+/)[0]) / 36)
                };
                let input_style = document.createElement('style');
                input_style.innerHTML = '\
                    .fetch-links-settings {\
                        background-color: transparent;\
                        text-align: right;\
                        padding: 2px;\
                        font-weight: bold;\
                        border: 2px solid gray;\
                    }';
                input_div.appendChild(input_style);
                let min_page = document.createElement('input');
                min_page.className = 'fetch-links-settings minimum';
                min_page.type = 'number';
                min_page.min = page_numbers.min;
                min_page.max = page_numbers.max;
                min_page.value = page_numbers.min;
                input_div.appendChild(min_page);
                let max_page = document.createElement('input');
                max_page.className = 'fetch-links-settings maximum';
                max_page.type = 'number';
                max_page.min = page_numbers.min;
                max_page.max = page_numbers.max;
                max_page.value = page_numbers.max;
                input_div.appendChild(max_page);
            }
        }
    } else if ((/cda\.pl\/info\/.+/).test(location.href)) { //cda general search
        if (document.getElementsByClassName('fetch-links-button').length === 0 && document.querySelectorAll('.text-video > .link-title-visit').length > 0) {
            let sought_phrase = location.href.match(/cda\.pl\/info\/(.+)\?section\=video/)[1];
            if (sought_phrase === null || sought_phrase === undefined) {
                throw new Error('Error getting the sought phrase from link');
            }
            let video_search_link = 'https://www.cda.pl/video/show/' + sought_phrase;

            let parent_div = document.querySelector('.nogry.nogiwera.nodownload.video .bttn-grp-const-width-md');
            if (parent_div !== null) {
                let intermediate_div = document.createElement('div');
                intermediate_div.style.margin = '10px 0 2px 0';
                intermediate_div.style.textAlign = 'left';
                parent_div.insertBefore(intermediate_div, parent_div.children[1]);

                let result_div = document.createElement('div');
                result_div.className = 'fetch-links-result';
                result_div.style.border = '2px solid gray';
                result_div.style.borderRadius = '5px';
                result_div.style.padding = '5px';
                result_div.style.margin = '10px';
                result_div.style.backgroundColor = 'black';
                result_div.fontFamily = 'monospace';
                result_div.style.display = 'none';
                result_div.style.textAlign = 'left';
                parent_div.appendChild(result_div);

                let input_div = document.createElement('div');
                intermediate_div.appendChild(input_div);
                let links_getter = new CDASearchLinksFetcher(video_search_link, function(links) {
                    result_div.innerHTML = links.join(' ');
                    result_div.style.display = 'block';
                });
                input_div.appendChild(links_getter.createButton());
                let pagination_data = document.querySelector('#mVid > a').innerHTML;
                let page_numbers = {
                    min: 1,
                    max: Math.ceil(Number(pagination_data.match(/\d+/)[0]) / 24)
                };
                if (page_numbers.max > 55) {
                    page_numbers.max = 55;
                }
                let input_style = document.createElement('style');
                input_style.innerHTML = '\
                    .fetch-links-settings {\
                        background-color: transparent;\
                        text-align: right;\
                        padding: 2px;\
                        font-weight: bold;\
                        border: 2px solid gray;\
                    }';
                input_div.appendChild(input_style);
                let min_page = document.createElement('input');
                min_page.className = 'fetch-links-settings minimum';
                min_page.type = 'number';
                min_page.min = page_numbers.min;
                min_page.max = page_numbers.max;
                min_page.value = page_numbers.min;
                input_div.appendChild(min_page);
                let max_page = document.createElement('input');
                max_page.className = 'fetch-links-settings maximum';
                max_page.type = 'number';
                max_page.min = page_numbers.min;
                max_page.max = page_numbers.max;
                max_page.value = page_numbers.max;
                input_div.appendChild(max_page);
            }
        }
    } else if ((/cda\.pl\/video\/show/).test(location.href)) { //cda video search
        if (document.getElementsByClassName('fetch-links-button').length === 0 && document.querySelectorAll('.text-video > .link-title-visit').length > 0) {
            let parent_div = document.querySelector('.bttn-grp-const-width-md');
            if (parent_div !== null) {
                let intermediate_div = document.createElement('div');
                intermediate_div.style.margin = '10px 0 2px 0';
                intermediate_div.style.textAlign = 'left';
                parent_div.insertBefore(intermediate_div, parent_div.children[1]);

                let result_div = document.createElement('div');
                result_div.className = 'fetch-links-result';
                result_div.style.border = '2px solid gray';
                result_div.style.borderRadius = '5px';
                result_div.style.padding = '5px';
                result_div.style.margin = '10px';
                result_div.style.backgroundColor = 'black';
                result_div.fontFamily = 'monospace';
                result_div.style.display = 'none';
                result_div.style.textAlign = 'left';
                parent_div.appendChild(result_div);

                let input_div = document.createElement('div');
                intermediate_div.appendChild(input_div);
                let links_getter = new CDASearchLinksFetcher(location.href, function(links) {
                    result_div.innerHTML = links.join(' ');
                    result_div.style.display = 'block';
                });
                input_div.appendChild(links_getter.createButton());
                let pagination_data = document.querySelector('#gora > h2').innerHTML;
                let page_numbers = {
                    min: 1,
                    max: Math.ceil(Number(pagination_data.match(/\d+/)[0]) / 24)
                };
                if (page_numbers.max > 55) {
                    page_numbers.max = 55;
                }
                let input_style = document.createElement('style');
                input_style.innerHTML = '\
                    .fetch-links-settings {\
                        background-color: transparent;\
                        text-align: right;\
                        padding: 2px;\
                        font-weight: bold;\
                        border: 2px solid gray;\
                    }';
                input_div.appendChild(input_style);
                let min_page = document.createElement('input');
                min_page.className = 'fetch-links-settings minimum';
                min_page.type = 'number';
                min_page.min = page_numbers.min;
                min_page.max = page_numbers.max;
                min_page.value = page_numbers.min;
                input_div.appendChild(min_page);
                let max_page = document.createElement('input');
                max_page.className = 'fetch-links-settings maximum';
                max_page.type = 'number';
                max_page.min = page_numbers.min;
                max_page.max = page_numbers.max;
                max_page.value = page_numbers.max;
                input_div.appendChild(max_page);
            }
        }
    }

})();