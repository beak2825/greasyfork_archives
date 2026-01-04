// ==UserScript==
// @name         fxp like bot
// @namespace    idk
// @version      1.1
// @description  fxp bot
// @author       nktfh100
// @match        https://www.fxp.co.il/*
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @noframes
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/383304/fxp%20like%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/383304/fxp%20like%20bot.meta.js
// ==/UserScript==

//https://www.fxp.co.il/member.php?u=1089677



function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function getUrls(isFirstTime = false) {
    console.debug("getting urls");
    var hrefs = GM_getValue("urls", []);
    var elements = $('.posttitle > a');
    elements.each(function () {
        hrefs.push($(this).attr('href'));
        console.debug($(this).attr('href'));
    });

    GM_setValue("urls", hrefs);

    if (isFirstTime == true) {
        var urlParams = new URLSearchParams(window.location.search);
        var page_ = urlParams.get('page');
        if (!page_) {
            page_ = 1;
        }
        page_ = parseInt(page_);
        page_ += 1;
        var url_ = window.location.href;
        url_ = url_.split('=&')[0];
        url_ = url_ + "=&page=" + page_;
        window.location.href = url_;
        var maxPages = GM_getValue('pages', 5);
        if (page_ - 1 >= maxPages) {
            GM_setValue("gettingURLS", false);
            startLiking();
        }
    }
}


function startLiking() {
    var hrefs = GM_getValue("urls", []);
    goto(hrefs[0]);
}

function goto(url) {
    if (isStopped == false) {
        window.location.href = url;
    }
}

function startButton() {
    var seconds_ = prompt('כמה שניות לחכות בין לייקים?', 5);
    if (seconds_ != null && seconds_ != "") {
        seconds_ = parseInt(seconds_ * 1000);
        GM_setValue('wait_time', seconds_);
    }
    var pages_ = prompt('עד איזה דף לעשות?', 5);
    if (pages_ != null && pages_ != "") {
        GM_setValue('gettingURLS', true);
        pages_ = parseInt(pages_);
        if (pages_ >= 100 || pages_ <= 1) {
            alert("מספר בין 100 ל1!");
        } else {
            GM_setValue('pages', pages_);
            getUrls(true);
        }
    } else {
        alert("מספר עד 100!");
    }
}

let isStopped = false;

function stopButton() {
    GM_deleteValue("gettingURLS");
    GM_deleteValue("urls");
    GM_deleteValue("pages");
    GM_setValue("likes", 0);
    alert('script terminated');
    isStopped = true;
}


$(document).ready(function () {
    if (window.location.href.indexOf("search.php") > -1) {
        var isGettingUrls = GM_getValue("gettingURLS", false);
        console.debug(isGettingUrls);
        if (!isGettingUrls) {
            console.debug('First time')
            $('body').append('<input type="button" value="Start bot" id="like_button_">')
            $("#like_button_").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
            $('#like_button_').click(function () { startButton() });
            GM_deleteValue('urls');
            GM_deleteValue('pages');
            GM_setValue("likes", 0);

        } else {
            $('body').append('<input type="button" value="Stop bot" id="stop_button_">')
            $("#stop_button_").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '50px');
            $('#stop_button_').click(function () { stopButton() });
            var urlParams = new URLSearchParams(window.location.search);
            var page_ = urlParams.get('page');

            page_ = parseInt(page_);

            if (!page_) {
                page_ = 1;
            }

            page_ += 1;
            getUrls();
            var url_ = window.location.href;
            url_ = url_.split('=&')[0];
            url_ = url_ + "=&page=" + page_;
            window.location.href = url_;
            var maxPages = GM_getValue('pages', 5);
            if (page_ - 1 >= maxPages) {
                GM_setValue("gettingURLS", false);
                startLiking();
            }


        }

    } else {
        let urls = GM_getValue('urls', false);
        if (urls) {
            $('body').append('<input type="button" value="Stop bot" id="stop_button_">')
            $("#stop_button_").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '50px');
            $('#stop_button_').click(function () { stopButton() });

            console.debug('running');
            var location = window.location.href;
            var post_id = location.split('#post')[1];
            post_id = "#post_" + post_id;
            var parent = document.querySelector(`${post_id} .postfoot .button-like-holder`);

            var waitTime = GM_getValue("wait_time",5);

            setTimeout(function () {
                parent.children[0].click();
            }, waitTime)

            var likes = GM_getValue("likes", 0);
            likes += 1;
            GM_setValue("likes", likes);
            console.debug(`Liked ${likes} posts!`);
            urls.shift();
            waitTime = waitTime + waitTime;

            GM_setValue('urls', urls);
            setTimeout(function () {
                if (urls[0]) {
                    goto(urls[0]);
                } else {
                    GM_deleteValue("gettingURLS");
                    GM_deleteValue("urls");
                    GM_deleteValue("pages");
                    GM_setValue("likes", 0);
                    isStopped = true;
                    alert('script finished!');
                }

            }, waitTime)
        }
    }
});

