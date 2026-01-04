// ==UserScript==
// @name         4d4y词云
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  让我看看帖子里在讲什么
// @author       屋大维
// @license      MIT
// @match        https://www.4d4y.com/forum/viewthread*
// @resource     IMPORTED_CSS https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
// @icon         https://icons.iconarchive.com/icons/github/octicons/48/cloud-16-icon.png
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472379/4d4y%E8%AF%8D%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/472379/4d4y%E8%AF%8D%E4%BA%91.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // CSS
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    GM_addStyle(".no-close .ui-dialog-titlebar-close{display:none} textarea{height:100%;width:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box} .card{box-shadow:0 4px 8px 0 rgba(0,0,0,.2);transition:.3s;width:100%;overflow-y: scroll;}.card:hover{box-shadow:0 8px 16px 0 rgba(0,0,0,.2)}.container{padding:2px 16px}");
    GM_addStyle(".flex-container{display:flex;flex-wrap: wrap;}.flex-container>div{background-color:#f1f1f1;width:500px;max-height:500px;margin:15px; padding:5px;text-align:left;}");
    GM_addStyle(`.lds-roller{display:inline-block;position:fixed;top:50vh;left:50vh;width:80px;height:80px}.lds-roller div{animation:1.2s cubic-bezier(.5,0,.5,1) infinite lds-roller;transform-origin:40px 40px}.lds-roller div:after{content:" ";display:block;position:absolute;width:7px;height:7px;border-radius:50%;background:#bfa1cf;margin:-4px 0 0 -4px}.lds-roller div:first-child{animation-delay:-36ms}.lds-roller div:first-child:after{top:63px;left:63px}.lds-roller div:nth-child(2){animation-delay:-72ms}.lds-roller div:nth-child(2):after{top:68px;left:56px}.lds-roller div:nth-child(3){animation-delay:-108ms}.lds-roller div:nth-child(3):after{top:71px;left:48px}.lds-roller div:nth-child(4){animation-delay:-144ms}.lds-roller div:nth-child(4):after{top:72px;left:40px}.lds-roller div:nth-child(5){animation-delay:-.18s}.lds-roller div:nth-child(5):after{top:71px;left:32px}.lds-roller div:nth-child(6){animation-delay:-216ms}.lds-roller div:nth-child(6):after{top:68px;left:24px}.lds-roller div:nth-child(7){animation-delay:-252ms}.lds-roller div:nth-child(7):after{top:63px;left:17px}.lds-roller div:nth-child(8){animation-delay:-288ms}.lds-roller div:nth-child(8):after{top:56px;left:12px}@keyframes lds-roller{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`);
    // Your code here...
    // helpers
    function showLoader() {
        let loader = $(`<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`);
        $("body").append(loader);
    }

    function hideLoader() {
        $(".lds-roller").remove();
    }

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function getEpoch(date_str, time_str) {
        let [y, m, d] = date_str.split("-").map(x => parseInt(x));
        let [H, M] = time_str.split(":").map(x => parseInt(x));
        return new Date(y, m - 1, d, H, M, 0).getTime() / 1000;
    }
    // classes
    class HpThread {
        constructor() {}
        getThreadTid() {
            return location.href.match(/tid=(\d+)/) ? parseInt(location.href.match(/tid=(\d+)/)[1]) : -999;
        }
        getUserUid() {
            return parseInt($("cite > a").attr("href").split("uid=")[1]);
        }
        getThreadTitle() {
            let l = $('#nav').text().split(" » ");
            return l[l.length - 1];
        }
        getHpPosts() {
            let threadTid = this.getThreadTid();
            let threadTitle = this.getThreadTitle();
            let divs = $('#postlist > div').get();
            return divs.map(d => new HpPost(threadTid, threadTitle, d));
        }
    }
    class HpPost {
        constructor(threadTid, threadTitle, postDiv) {
            this.threadTid = threadTid;
            this.threadTitle = threadTitle;
            this._post_div = postDiv;
        }
        getPostAuthorName() {
            return $(this._post_div).find("div.postinfo > a").first().text();
        }
        getPostAuthorUid() {
            return parseInt($(this._post_div).find("div.postinfo > a").first().attr("href").split("uid=")[1]);
        }
        getPostPid() {
            return parseInt($(this._post_div).attr("id").split("_")[1]);
        }
        getGotoUrl() {
            // return `https://www.hi-pda.com/forum/redirect.php?goto=findpost&ptid=${this.threadTid}&pid=${this.getPostPid()}`;
            return `https://www.4d4y.com/forum/redirect.php?goto=findpost&ptid=${this.threadTid}&pid=${this.getPostPid()}`;
        }
        getPostContent() {
            // get text without quotes
            let t = $(this._post_div).find("td.t_msgfont").first().clone();
            t.find('.quote').replaceWith("");
            t.find('.t_attach').replaceWith("");
            t.find('font[size="1"]').replaceWith("");
            t.find('img').remove();
            let text = t.text().replace(/\n+/g, "\n").trim();
            return text;
        }
        getPostBrief(n) {
            let content = this.getPostContent();
            if (content.length <= n) {
                return content;
            }
            return content.slice(0, n) + "\n\n【以上为截取片段】";
        }
        getOriginalTimestamp(use_string = false) {
            let dt = $(this._post_div).find("div.authorinfo > em").text().trim().split(" ").slice(1, 3);
            if (use_string) {
                return dt.join(" ");
            }
            return getEpoch(dt[0], dt[1]);
        }
        getLastTimestamp(use_string = false) {
            let ele = $(this._post_div).find("i.pstatus").get();
            if (ele.length !== 0) {
                let dt = $(this._post_div).find("i.pstatus").text().trim().split(" ").slice(3, 5);
                if (use_string) {
                    return dt.join(" ");
                }
                return getEpoch(dt[0], dt[1]);
            }
            return null;
        }
        getTimestamp(use_string = false) {
            // get last edit time
            let lastTimestamp = this.getLastTimestamp(use_string);
            return lastTimestamp ? lastTimestamp : this.getOriginalTimestamp(use_string);
        }
    }
    async function main() {
        $('#menu>ul').append($(`<li class="menu_2"><a href="javascript:void(0)" hidefocus="true" id="wordcloud">生成词云</a></li>`));
        $("#wordcloud").click(() => {
            showLoader();
            var THIS_THREAD = new HpThread();
            var data_list = [];
            var hp_posts = THIS_THREAD.getHpPosts();
            for (let i = 0; i < hp_posts.length; i++) {
                if (i < 3) {
                    // higher weight for title
                    data_list.push(THIS_THREAD.getThreadTitle());
                }
                let hp_post = hp_posts[i];
                try {
                    data_list.push(hp_post.getPostContent());
                } catch (e) {
                    // deleted post, simply pass it
                    console.log("unable to parse the post, pass");
                }
            }
            navigator.clipboard.writeText(data_list.join(" "));
            setTimeout(() => {
                hideLoader();
                window.open('https://pulipulichen.github.io/jieba-js/', '_blank');
            }, 500);
        });
    }
    main();
})();