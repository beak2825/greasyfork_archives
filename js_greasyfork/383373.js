// ==UserScript==
// @name         fxp forum comment bot
// @namespace    idk
// @version      2.01
// @description  spam a forum.
// @author       nktfh100
// @match        https://www.fxp.co.il/*
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @noframes
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/383373/fxp%20forum%20comment%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/383373/fxp%20forum%20comment%20bot.meta.js
// ==/UserScript==

//https://www.fxp.co.il/member.php?u=1089677




function getUrls(isFirstTime = false) {
    console.debug("getting urls");
    var hrefs = GM_getValue("urls", []);
    var elements = document.querySelectorAll("ol.threads li.threadbit div div.threadinfo div.inner h3.threadtitle a");
    console.debug(elements);

    for (var i = 0; i < elements.length; i +=1) {
        hrefs.push(elements[i].href);
        console.debug(elements[i].href);
    }
   
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
            startCommenting();
        }

    }

}


function startCommenting() {
    var hrefs = GM_getValue("urls", []);
    goto(hrefs[0]);
}

function goto(url) {
    if (isStopped == false) {
        window.location.href = url;
    }
}

function startButton() {
    var pages_ = prompt('מהדף שאתה נמצא בו עכשיו, עד איזה דף לעשות?', 5);
    if (pages_ != null && pages_ != "") {
        GM_setValue('gettingURLS', true);
        pages_ = parseInt(pages_);
        if (pages_ < 1) {
            alert("מספר הגדול מאחד!");
        } else {
            $("#start_button").remove();
            $('body').append('<input type="button" value="Stop comments bot" id="stop_button_">')
            $("#stop_button_").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '50px');
            $('#stop_button_').click(function () { stopButton() });
            GM_setValue('pages', pages_);

            var urlParams = new URLSearchParams(window.location.search);
            var forum = urlParams.get('f');
            GM_setValue('f', forum);
            console.debug(`Forum" ${forum}`);
            getUrls(true);
        }
    } else {
        alert("number invaild!");
    }
}

let isStopped = false;

function stopButton() {
    GM_deleteValue("gettingURLS");
    GM_deleteValue("urls");
    GM_deleteValue("pages");
    GM_setValue("comments", 0);
    alert('script terminated');
    isStopped = true;

    $("#stop_button_").remove();
    $('body').append('<input type="button" value="Start comments bot" id="start_button">')
    $("#start_button").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
    $('#start_button').click(function () { startButton() });
}

var isGettingUrls = GM_getValue("gettingURLS", false);
let urls_ = GM_getValue('urls', false);
if(urls_) {
    $('body').append('<input type="button" value="Stop comments bot" id="stop_button_">')
    $("#stop_button_").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '50px');
    $('#stop_button_').click(function () { stopButton() });
}


$(document).ready(function () {
    if (window.location.href.indexOf("forumdisplay.php") > -1) {
        console.debug(isGettingUrls);
        if (!isGettingUrls) {
            console.debug('First time')
            $('body').append('<input type="button" value="Start comments bot" id="start_button">')
            $("#start_button").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
            $('#start_button').click(function () { startButton() });
            GM_deleteValue('urls');
            GM_deleteValue('pages');
            GM_setValue("comments", 0);

        } else {
            var urlParams = new URLSearchParams(window.location.search);
            var page_ = urlParams.get('page');
            var forum = GM_getValue('forum', 21);
            page_ = parseInt(page_);

            if (!page_) {
                page_ = 1;
            }

            page_ += 1;

            getUrls();
            var url_ = window.location.href;
            url_ = url_.split('?')[0];
            url_ = url_ + `?f=${forum}&page=` + page_;
            console.debug(url_);
            window.location.href = url_;
            var maxPages = GM_getValue('pages', 5);
            if (page_ - 1 >= maxPages) {
                GM_setValue("gettingURLS", false);
                startCommenting();
            }


        }

    } else {
        let urls = GM_getValue('urls', false);
        if (urls) {

            console.debug('running');
            try {
                var o = null;
                var t = "";
                var e = document.getElementById("qr_submit");
                var iframe_ = document.getElementsByTagName("iframe");
                var attr;
                for (var i = 0; i < iframe_.length; i++) {
                    if (attr = iframe_[i].getAttribute("title"), "Rich text editor, vB_Editor_QR_editor, press ALT 0 for help." == attr) {
                        o = iframe_[i];
                        break
                    }
                }
                var textarea = o.contentDocument.getElementsByClassName("forum")[0];
                //
                textarea.scrollIntoView();

                //code here by dacurse0
                var r = ["[color=gold]", " תעה ", " לילה טוב ", " אה טוב ", " קליל ", " קל ", "[font=tahoma]", " פנחס ", " חחחח שמתם לב FXP = כספ ", " כספ ", " ילדי אנימה ", " FXP ", " חחחחחחחחחח ", " חתול ", " כלב ", " אללה אשכולילה ", "[b]", " ו", " טיפ: כותרת ארוכה ומפורטת מביאה למענה הרבה יותר מהיר מאשר כותרת קצרה! ", "[color=blue]", " צריכים לעלות תמונה לאשכול מהמחשב, שירות העלאת התמונות של האתר: [url=https://www.fxp.co.il/upload.php]העלאת תמונות[/url] ", " אין בנים בכספ ", "[color=red]", " איו בנות בכספ ", "[i]", " תעה על התודה ", " תודה על הפרסום ", " פיצה ", " עד מתי ילדים בני 12 עם ניק אדום ", " כבל תת ימי יש לך? ", " CARE.COM ", " לוזינה", " בוקר טוב ", " בוקר קל ", " ערב קל ", " ערב שלום ", " איכס ", " ננעל", " נשברלי ", " שחור זה מרזה ", " :wub: ", " :) ", ":(", " :D ", " ;) ", " :mad: ", " :loveyou: ", " יש קראק? ", " :P ", " :bot: ", " :whistle: ", " :Tongue2: ", "[u]", " :jockey: ", " :clap: ", " :tovtov: ", " יש נייס ", " :rasta: ", " :close2: ", " :WOW: ", " תודה מוריד ", " ארז ברז", "[quote]מצחיק[/quote]", "שלום", "[size=6]", " ו", "נקטף נודר"],
                    c = Math.floor(Math.random() * r.length + 1),
                    n = Math.floor(18 * Math.random() + 1);
                for (i = 0; i <= n; i++) t += r[c - 1], c = Math.floor(Math.random() * r.length + 1);
                t.includes("[size") && (t += "[/size][color=white]b[/color]"), t.includes("[u") && (t += "[/u][color=white]b[/color]"), t.includes("[i") && (t += "[/i][color=white]b[/color]"), t.includes("[font") && (t += "[/font][color=white]b[/color]"), t.includes("[color") && (t += "[/color][color=white]b[/color]"), t.includes("[b") && (t += "[/b][color=white]b[/color]");
                textarea.innerHTML = t;

                setTimeout(function(){ e.click(); }, 800);


                var comments = GM_getValue("comments", 0);
                comments += 1;
                GM_setValue("comments", comments);
                console.debug(`Posted ${comments} comments!`);
            }
            catch(err) {
                console.debug('error!');
            }

            urls.shift();

            GM_setValue('urls', urls);
            setTimeout(function () {
                if (urls[0]) {
                    goto(urls[0]);
                } else {
                    GM_deleteValue("gettingURLS");
                    GM_deleteValue("urls");
                    GM_deleteValue("pages");
                    GM_setValue("comments", 0);
                    isStopped = true;
                    alert('script finished!');
                }

            }, 7300)
        }
    }
});