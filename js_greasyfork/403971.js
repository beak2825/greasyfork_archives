// ==UserScript==
// @name        Netflix影片显示豆瓣评分
// @namespace   http://tampermonkey.net/
// @include     https://netflix.com/*
// @include     https://www.netflix.com/*
// @connect     douban.com
// @connect     zeptojs.com
// @version     1.0.5
// @description 根据影片标题or原英文标题获取豆瓣评分 获取豆瓣评分（未使用豆瓣API）
// @author      naturezhm
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require     https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js
// @downloadURL https://update.greasyfork.org/scripts/403971/Netflix%E5%BD%B1%E7%89%87%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/403971/Netflix%E5%BD%B1%E7%89%87%E6%98%BE%E7%A4%BA%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function () {

    var logger = {
        debug: console.debug,
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    }

    function setStorage(key, value) {
        let storage = window.localStorage;
        storage.setItem(JSON.stringify(key), JSON.stringify(value));
    }

    function getStorage(key) {
        let storage = window.localStorage;
        let rawDate = storage.getItem(JSON.stringify(key));
        return JSON.parse(rawDate);
    }

    function addCss() {
        GM_addStyle(".douban{display:block;background-color: rgba(0,0,0,0.5)} .is-bob-open .douban { display: block; opacity: 0.3;}");
    }

    function getMovieList(title, callback) {
        logger.debug("title: %s", title);
        if (null == title || undefined == title || null == callback || undefined == callback) {
            return null;
        }

        let subjectId = getStorage(title);
        let doubanInfo = getStorage(subjectId);

        if (null != doubanInfo && undefined != doubanInfo) {
            callback(doubanInfo);
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            // url: 'https://movie.douban.com/j/subject_suggest?q=' + title,
            url: 'https://m.douban.com/search/?query=' + title,
            "headers": {
                "user-agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            },
            onload: function (response) {
                // logger.debug("response, %o", response);
                if (response.status == 200) {
                    let subjectId = findElement(response.responseText, regex_search);
                    logger.debug("subjectId: %s", subjectId);
                    if (null == subjectId || undefined == subjectId || 0 == subjectId) {
                        callback(null, title);
                    }

                    let doubanInfo = getStorage(subjectId);
                    if (null == doubanInfo || undefined == doubanInfo) {
                        getMovieInfo(title, subjectId, callback);
                    } else {
                        callback(doubanInfo);
                    }
                } else {
                    logger.warn(response.statusText);
                    callback(null, title);
                }
            }
        });
    }

    function getMovieInfo(title, subjectId, callback) {
        if (null == callback || undefined == callback) {
            return;
        }
        let url = "https://movie.douban.com/subject/" + subjectId;

        logger.debug("url, %o", url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status == 200) {
                    let responseText = response.responseText;

                    let doubanRate = findElement(responseText, regex_rate);
                    let doubanVotes = findElement(responseText, regex_votes);

                    logger.debug("doubanRate: %s, doubanVotes: %s, url: %s", doubanRate, doubanVotes, url);

                    let doubenInfo = { "subjectId": subjectId, "doubanRate": doubanRate, "doubanVotes": doubanVotes, "doubanUrl": url };
                    setStorage(subjectId, doubenInfo);
                    setStorage(title, subjectId);
                    callback(doubenInfo);
                } else {
                    logger.warn(response.statusText);
                    callback(null, title);
                }
            }
        });
    }

    function findElement(content, matchRegex) {
        let matchResult;
        let result = 0;

        let times = 0;
        while ((matchResult = matchRegex.exec(content)) !== null && times < 10) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (matchResult.index === matchRegex.lastIndex) {
                matchRegex.lastIndex++;
            }

            if ($.isArray(matchResult)) {
                matchResult.forEach((match, groupIndex) => {
                    // logger.log(`Found match, group ${groupIndex}: ${match}`);
                    // only get first match element. (follow Douban page rules.)
                    result = match;
                    return;
                });
            } else {
                result = matchResult;
            }
            times++;
        }
        return result;
    }

    function addDoubanElementInBox(element, doubanInfo, title) {
        try {
            if (null == element || undefined == element) {
                return;
            }
            if (hasDoubanTag(element)) {
                return;
            }
            if (null == doubanInfo || undefined == doubanInfo) {
                let errorMovieTimes = errorMovieMap[title];
                if (errorMovieTimes > retryLimit) {
                    $(element).append('<div class="douban"></div>');
                    return;
                }
                if (null == errorMovieTimes || undefined == errorMovieTimes) {
                    errorMovieTimes = 1;
                    errorMovieMap[title] = errorMovieTimes;
                } else {
                    errorMovieTimes++;
                    errorMovieMap[title] = errorMovieTimes;
                }
                return;
            }

            let html = '<div class="douban" style="position: absolute;top: 0;right: 0;z-index: 999;"><div class="douban-tag" style="display: inline-flex;margin: 5px;"><a href="'
                + doubanInfo.doubanUrl
                + '" target="_blank"><img src="https://img3.doubanio.com/favicon.ico" style="width: 16px;"></a><span style="margin: 0 2px;">'
                + (doubanInfo.doubanRate > 0 ? doubanInfo.doubanRate : 0)
                + '</span><span>|</span><span style="margin: 0 2px;">'
                + (doubanInfo.doubanVotes > 0 ? doubanInfo.doubanVotes : 0)
                + '</span></div></div>';
            $(element).append(html);
            return;
        }
        catch (err) {
            logger.error(err);
        }

    }

    function hasDoubanTag(element) {
        return $(element).find(".douban").length > 0;
    }

    function trigerFetchDouban() {
        if (allMovieBoxlist.length <= 0) {
            return;
        }

        if (null != timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            let item = allMovieBoxlist.shift();
            let innerTextWrapper = $(item).find(".fallback-text-container .fallback-text");

            let movieTitle = null == innerTextWrapper ? null : innerTextWrapper[0].innerText;

            logger.debug("movieTitle: %o", movieTitle);
            // get rate vote and url from douban 豆瓣
            getMovieList(movieTitle, (doubanInfo, title) => {
                // callback
                logger.debug("doubanInfo: %o", doubanInfo);
                // add new element in movie box
                addDoubanElementInBox(item, doubanInfo, title);

                trigerFetchDouban();
            });
        }, 50);
    }

    function mainFunc() {
        setInterval(() => {

            // execute every 3 second
            let movieBoxes = $(".title-card-container .title-card");
            // logger.debug(movieBoxtitles.innerText);

            let times = 0;

            movieBoxes.each(function (index) {
                if (times > 500) {
                    return;
                }

                // logger.debug('index: %d this: %o', index, this);
                logger.debug("current box length: %s", allMovieBoxlist.length);

                let item = this;
                if (hasDoubanTag(item) || allMovieBoxlist.indexOf(item) >= 0) {
                    return;
                }
                allMovieBoxlist.push(item);
                times++;
            });

            trigerFetchDouban();

        }, 3000);
    }
    // match element like
    // <strong class="ll rating_num" property="v:average">2.2</strong>
    var regex_rate = /(?<=v:average.>)[^<]*/m;
    var regex_votes = /(?<=v:votes.>)[^<]*/m;
    var regex_search = /(?<=\/movie\/subject\/)[^\/]*/m;

    var allMovieBoxlist = [];
    var timer = null;

    var retryLimit = 3;
    var errorMovieMap = {};

    logger.info('Hello douban rate for Netflix.');

    // getMovieList("漫威杰西卡·琼斯");

    mainFunc();

    addCss();

})();
