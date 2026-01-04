// ==UserScript==
// @name        pixiv_sort_by_popularity
// @name:zh-CN        pixiv_sort_by_popularity
// @name:zh-TW        pixiv_sort_by_popularity
// @name:ja        pixiv_sort_by_popularity
// @name:ru        pixiv_sort_by_popularity
// @name:kr        pixiv_sort_by_popularity
// @namespace   pixiv_sort_by_popularity
// @supportURL  https://github.com/zhuzemin
// @description non premium menber use "Sort by popularity"
// @description:zh-CN non premium menber use "Sort by popularity"
// @description:zh-TW non premium menber use "Sort by popularity"
// @description:ja non premium menber use "Sort by popularity"
// @description:ru non premium menber use "Sort by popularity"
// @description:kr non premium menber use "Sort by popularity"
// @include     https://www.pixiv.net/*/tags/*
// @include     https://www.pixiv.net/tags/*
// @version     1.28
// @run-at      document-end
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @connect-src workers.dev
// @downloadURL https://update.greasyfork.org/scripts/396536/pixiv_sort_by_popularity.user.js
// @updateURL https://update.greasyfork.org/scripts/396536/pixiv_sort_by_popularity.meta.js
// ==/UserScript==


//this userscript desire for free member use "Sort by popularity"


//config
let config = {
    'debug': false,
    api: {
        'base': 'https://proud-surf-e590.zhuzemin.workers.dev',
        //pixiv search request through this url will use premium user.
        'ajax': '/ajax',
        //get premium users number
        'userNum': '/userNum',
        //share cookie
        'share': '/share',
        'guides': 'https://zhuzemin.github.io/pixiv_sort_by_popularity',
        'bookmark': 'https://www.pixiv.net/bookmark.php?rest=show&p=',
    },
    'elem': {
        'nav': null,
        'btn': null,
        'div': null,
        'span': null,
        'select': null,
    },
    'firstInsert': true,
    'bookmarkSupport': GM_getValue('bookmarkSupport') || 0, //support bookmark in search result page, but loading will slower.
    'illustId_list': [],
}
config.api.ajax = config.api.base + config.api.ajax;
config.api.userNum = config.api.base + config.api.userNum;
config.api.share = config.api.base + config.api.share;
let debug = config.debug ? console.log.bind(console) : function () {
};


// prepare UserPrefs
setUserPref(
    'bookmarkSupport',
    config.bookmarkSupport,
    'bookmark support',
    `support bookmark in search result page, but loading will slower. 1|0`,
);


// prepare UserPrefs
setUserPref(
    'shareCookie',
    'PHPSESSID=***_******, 30',
    'Share my cookie',
    `This script depend pixiv premium user share his cookie, for keep script working need at least one user register pixiv premium and share his cookie.\n 
    cookie will save in remote server, use to forward sort request , only i can access that server, 
    and server is runing in a long history free host, unless pixiv fix this bug, script will working very long time.
    because security strategy of browser, userscript can't get cookie automaticatlly,\n
    here is a guides to teach you get cookie, than you can come back fill those parameters below.
    *Guides----> `+ config.api.guides + `
    *Second parameter is how many days you want cookie be share.`,
    shareCookie,
);


/**
 * Obejct use for xmlHttpRequest
 * @param {string} originUrl
 * @param {int} page
 * @param {string} order
 */
class requestObject {
    constructor(originUrl, page = null, order = null) {
        this.method = 'GET';
        this.respType = 'json';
        this.url = originUrl;
        if (order != null) {
            this.url = config.api.ajax + '/' + originUrl
                .replace(/(https:\/\/www.pixiv.net)(\/\w+)?\/tags\/([^\/]+)\/(\w+)([\?&\w=&_]+)?/,
                    function (match, $1, $2, $3, $4, $5, offset, original) {
                        //return '${$1}/ajax/search/${$4}/${$3}${$5}';
                        return $1 + '/ajax/search/' + $4 + '/' + $3 + $5;
                    })
                //.replace(/p=\d*/, 'p=' + page).replace(/order=[_\w]+/, 'order=' + order);
                .replace(/p=\d+/, '').replace(/order=[_\w]+/, '') + '&p=' + page + '&order=' + order;
        }
        else if (page != null) {
            this.url = originUrl + page;
        }
        this.body = null;
        this.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            'User-agent': window.navigator.userAgent,
            'Referer': window.location.href,
        };
        this.package = null;
    }
}


//for override fetch, I think override function sure insert to page, otherwise userscript don't have permission modified fetch in page?
function addJS_Node(text) {
    let scriptNode = document.createElement('script');
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;

    let targ = document.getElementsByTagName('head')[0] || d.body || d.documentElement;
    targ.appendChild(scriptNode);
}


//override fetch
function intercept(newData, newUrl, interceptEnable) {
    if (config.firstInsert) {
        //insert override function to page
        addJS_Node(`
        let newData = `+ newData + `;
        let interceptEnable = `+ interceptEnable + `;
        let newUrl = '`+ newUrl + `';
        let debug = `+ config.debug + ` ? console.log.bind(console) : function () {
        };
        let constantMock = window.fetch;
        window.fetch = function () {
            debug('arguments: ' + arguments[0]);
            debug('newUrl: ' + newUrl);
            if (interceptEnable && /\\/ajax\\/search\\/artworks/.test(arguments[0])) {
                arguments[0] = newUrl;
            }
            return new Promise((resolve, reject) => {
                constantMock.apply(this, arguments)
                    .then((response) => {
                        if (interceptEnable && /\\/ajax\\/search\\/artworks/.test(response.url)) {
                            let blob = new Blob([JSON.stringify(newData, null, 2)], { type: 'application/json' });
                            debug('newData: ' + JSON.stringify(newData));
        
                            let newResponse = new Response(
                                blob, {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                            debug('newResponse: ' + JSON.stringify(newResponse));
                            response = newResponse;
                            interceptEnable = false;
                        }
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(response);
                    })
            });
        }
             `);
        config.firstInsert = false;
    }
    else {
        addJS_Node(`
        newData = `+ newData + `;
        interceptEnable = `+ interceptEnable + `;
        newUrl = '`+ newUrl + `';
        `);
    }
    //here is script end,
    //in console ,log show fetch response body has been changed <--- not very sure
    //and page have react ---> stay blank for ever
    //my confuse is: even comment "return data" (line:93), page still return blank,
    //that makes me wonder: maybe this override function miss something.
    //if my terrible code can be understanding somehow,
    //and knoa san have nothing else todo in leisure time,
    //knoa san can you take while, look my newbie problem?
    //of cource if too painful read my code, I totally understand!
    //knoa san can read to here already be my greatest honor, and I'm very happy!
}


//userscript entry
let init = function () {
    //create button
    if (window.self === window.top) {
        debug("init");
        let interval = setInterval(function () {
            let navList = document.querySelectorAll('nav');
            debug('navList.length: ' + navList.length)
            if (navList.length == 2) {
                clearInterval(interval);
                config.elem.btn = document.createElement('button');
                config.elem.btn.textContent = 'Sort by popularity';
                config.elem.btn.addEventListener('click', sortByPopularity);
                config.elem.btn.disabled = true;
                config.elem.select = document.createElement('select');
                //config.elem.select.id = 'sortByPopularity';
                let optionObj = {
                    'Popular with all': 'popular_d',
                    'Popular (male)': 'popular_male_d',
                    'Popular (female)': 'popular_female_d'
                }
                for (let key of Object.keys(optionObj)) {
                    let option = document.createElement('option');
                    option.innerHTML = key;
                    option.value = optionObj[key];
                    config.elem.select.appendChild(option);
                }
                config.elem.span = document.createElement('span');
                config.elem.span.className = 'tooltiptext';
                config.elem.div = document.createElement('div');
                config.elem.div.className = 'tooltip';
                config.elem.nav = navList[0];
                config.elem.div.appendChild(config.elem.btn);
                config.elem.div.appendChild(config.elem.select);
                config.elem.div.appendChild(config.elem.span);
                config.elem.nav.appendChild(config.elem.div);
                if (config.bookmarkSupport == 1) {
                    if (unsafeWindow.dataLayer[0].login != 'yes') {
                        config.elem.span.textContent = 'bookmark support need login';
                        return;
                    }
                }
                getPreUserNum();
            }
        }, 1000);
        let style = document.createElement('style');
        style.textContent = `
        .tooltip {
          position: relative;
          display: inline-block;
        }
        
        .tooltip .tooltiptext {
          visibility: hidden;
          width: 500px;
          background-color: white;
          color: black;
          text-align: center;
          border-radius: 3px;
          padding: 5px 0;
        
          /* Position the tooltip */
          position: absolute;
          z-index: 1;
        }
        
        .tooltip:hover .tooltiptext {
          visibility: visible;
        }
        `;
        document.querySelector('head').appendChild(style);

    }

}
window.addEventListener('DOMContentLoaded', init);


//get current search word, then use xmlHttpRequest get response(from my server)
function sortByPopularity(e) {
    config.elem.btn.focus();
    config.elem.btn.textContent = 'Searching...'
    config.elem.btn.disabled = true;
    try {
        let page;
        //let matching=window.location.href.match(/https:\/\/www\.pixiv\.net\/(\w*\/)?tags\/(.*)\/\w*\?(order=[^\?&]*)?&?(mode=(\w\d*))?&?(p=(\d*))?/);
        debug(e.target.tagName);
        if (/(\d*)/.test(e.target.textContent) && (e.target.tagName.toLowerCase() == 'span' || e.target.tagName.toLowerCase() == "a")) {
            page = e.target.textContent.match(/(\d*)/)[1];
        }
        else if (e.target.tagName.toLowerCase() == 'svg' || e.target.tagName.toLowerCase() == 'polyline') {
            debug('e.target.parentElement.tagName: ' + e.target.parentElement.tagName);
            if (e.target.parentElement.tagName.toLowerCase() == 'a') {
                page = e.target.parentElement.href.match(/p=(\d*)/)[1];

            }
            else {
                page = e.target.parentElement.parentElement.href.match(/p=(\d*)/)[1];

            }
        }
        //for test
        /*else if(matching[7]!=null){
            page=matching[7];
        }*/
        else {
            page = 1;
        }
        page = parseInt(page);
        debug('page: ' + page);
        //let order = document.querySelector('#sortByPopularity').value;
        let order = config.elem.select.value;
        debug('order: ' + order);
        let obj = new requestObject(window.location.href, page, order);
        obj.package = page;
        debug('JSON.stringify(obj): ' + JSON.stringify(obj));
        getBookmark(obj);

    }
    catch (e) {
        debug('[Error]: ' + e)
    }

}


function getBookmark(obj, totalPage = 1, page = 1) {
    debug('config.bookmarkSupport: ' + config.bookmarkSupport);
    if (config.bookmarkSupport == 1) {
        let reqObj = new requestObject(config.api.bookmark, page);
        reqObj.respType = 'text';
        request(reqObj, function (responseDetails, package) {
            if (responseDetails.responseText != null) {
                let dom = new DOMParser().parseFromString(responseDetails.responseText, "text/html");
                let count_badge = parseInt(dom.querySelector('span.count-badge').textContent.match(/(\d{1,9})/)[1]);
                if (count_badge > 0) {
                    for (let elem of dom.querySelectorAll('li.image-item')) {
                        let illustId = elem.querySelector('a').href.match(/(\d{1,20})/)[1];
                        debug('illustId: ' + illustId);
                        config.illustId_list.push(illustId);
                    }
                    let elm_page_list = dom.querySelector('ul.page-list');
                    if (elm_page_list != null) {
                        totalPage = elm_page_list.childElementCount;
                        debug('totalPage: ' + totalPage);
                    }
                }
                if (page != totalPage) {
                    page++;
                    getBookmark(obj, totalPage, page);
                    debug('page: ' + page);
                }
                else {
                    debug('config.illustId_list: ' + config.illustId_list);
                    request(obj, replaceContent);

                }

            }
            else {
                request(obj, replaceContent);
            }
        });

    }
    else {
        debug('config.illustId_list: ' + config.illustId_list);
        request(obj, replaceContent);

    }
}


function replaceContent(responseDetails, obj) {
    let page = obj.package;
    debug("responseDetails.response: " + JSON.stringify(responseDetails.response));
    let remoteResponse = responseDetails.response;
    if (config.illustId_list.length > 0) {
        for (let data of remoteResponse.body.illustManga.data) {
            debug('data.illustId: ' + data.id);
            if (config.illustId_list.includes(data.id)) {
                debug('data.illustId: ' + data.id);
                data.bookmarkData = { "id": "123", "private": false };
            }
        }
    }
    debug("remoteResponse: " + JSON.stringify(remoteResponse));
    let newData = JSON.stringify(remoteResponse, null, 2);
    let interceptEnable = true;
    let newUrl = obj.url.replace(config.api.ajax + '/https://www.pixiv.net', '');
    intercept(newData, newUrl, interceptEnable);
    //trigger fetch by click "Newest" or "Oldest"
    let spanList = document.querySelectorAll('span');
    for (let span of spanList) {
        if (/(Newest)|(Oldest)|(按最新排序)|(按旧|舊排序)|(新しい順)|(古い順)|(최신순)|(과거순)/.test(span.textContent)) {
            if (span.parentElement.tagName.toLowerCase() == 'a') {
                span.parentElement.click();
                break;
            }
        }
    }
    let interval = setInterval(function () {
        let navList = document.querySelectorAll('nav');
        debug('navList.length: ' + navList.length)
        if (navList.length == 2) {
            let nav = navList[1];
            debug('nav: ' + nav.innerHTML)
            nav.addEventListener('click', sortByPopularity);
            for (let a of nav.querySelectorAll('a')) {
                a.addEventListener('click', function (e) { e.preventDefault(); });
            }
            if (page <= 7 && page > 1) {
                //nav button "1" text -> current page number
                nav.childNodes[1].childNodes[0].innerText = page;
                //nav button "1" href -> current page href
                nav.childNodes[1].href = nav.childNodes[page].href;
                //current page button text -> "1"
                nav.childNodes[page].innerText = 1;
                //current page button href -> origin nav button "1" href
                nav.childNodes[page].href = nav.childNodes[0].href;
                //switch two button positon
                nav.insertBefore(nav.childNodes[1], nav.childNodes[page]);
                nav.insertBefore(nav.childNodes[page], nav.childNodes[1]);

            }
            else if (page > 7) {
                let currentPositionInNav = page % 7;
                debug("currentPositionInNav: " + currentPositionInNav);
                let buttonStartNumber = page - currentPositionInNav;
                debug("buttonStartNumber: " + buttonStartNumber);
                let navButtonCount = 1;
                //switch two button positon
                nav.insertBefore(nav.childNodes[1], nav.childNodes[currentPositionInNav + 1]);
                nav.insertBefore(nav.childNodes[currentPositionInNav + 1], nav.childNodes[1]);
                for (let i = buttonStartNumber; i <= (buttonStartNumber + 6); i++) {
                    debug("navButtonCount: " + navButtonCount);
                    debug("i: " + i);
                    nav.childNodes[navButtonCount].childNodes[0].innerText = i;
                    nav.childNodes[navButtonCount].href = nav.childNodes[8].href.replace(/p=\d*/, 'p=' + (i));
                    navButtonCount++;
                }
            }
            if (page != 1) {
                //display previous button
                nav.childNodes[0].style = 'opacity:1!important;';
                //previous button href
                nav.childNodes[0].href = nav.childNodes[8].href.replace(/p=\d*/, 'p=' + (page - 1));
                //next button href
                nav.childNodes[8].href = nav.childNodes[8].href.replace(/p=\d*/, 'p=' + (page + 1));

            }
            config.elem.btn.textContent = 'Sort by popularity';
            config.elem.btn.disabled = false;
            clearInterval(interval);

        }
    }, 1000);
}


function request(object, func, timeout = 60000) {
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        headers: object.headers,
        responseType: object.respType,
        data: object.body,
        timeout: timeout,
        onload: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails, object);
        },
        ontimeout: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails);

        },
        ononerror: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails);

        }
    });
}


//get premium users number
function getPreUserNum() {
    debug('getPreUserNum');
    let obj = new requestObject(config.api.userNum);
    obj.respType = 'json';
    request(obj, function (responseDetails) {
        debug('responseDetails.status: ' + responseDetails.status);
        if (responseDetails.status == 200) {
            let json = responseDetails.response;
            let num = json.data.userNum;
            debug('num: ' + num);
            if (num > 0) {
                config.elem.btn.disabled = false;
            }
            config.elem.span.textContent = 'Current shared premium user: ' + num;
        }
    });
}


/**
 * Create a user setting prompt
 * @param {string} varName
 * @param {any} defaultVal
 * @param {string} menuText
 * @param {string} promtText
 * @param {function} func
 */
function setUserPref(varName, defaultVal, menuText, promtText, func = null) {
    GM_registerMenuCommand(menuText, function () {
        let val = prompt(promtText, GM_getValue(varName, defaultVal));
        if (val === null) { return; }  // end execution if clicked CANCEL
        GM_setValue(varName, val);
        if (func != null) {
            func(val);
        }
    });
}


//share cookie
function shareCookie(val) {
    if (/PHPSESSID=\d+_\w+,\s?\d+/.test(val)) {
        if (unsafeWindow.dataLayer[0].premium == 'yes') {
            let array = val.split(',');
            let userId = unsafeWindow.dataLayer[0].user_id;
            let cookie = array[0];
            let expire = array[1].trim();
            let obj = new requestObject(config.api.share);
            obj.method = 'POST';
            obj.respType = 'json';
            obj.body = encodeURIComponent(
                JSON.stringify(
                    {
                        'key': 'user:' + userId,
                        'value': null,
                        'metadata': {
                            'userId': userId,
                            'cookie': cookie,
                            'expire': expire,
                        },
                    }
                )
            );
            debug('obj: ' + JSON.stringify(obj));
            request(obj, function (responseDetails) {
                let json = responseDetails.response;
                debug('json: ' + JSON.stringify(json));
                if (responseDetails.status == 200) {
                    if (json.status == 200) {
                        alert('Share success, thank you!');
                    }
                }
            });
        }
        else {
            alert('You are not premium user.');
        }
    }
    else {
        alert('Parameter invalid.');
    }
}