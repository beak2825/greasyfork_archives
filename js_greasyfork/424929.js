// ==UserScript==
// @name         Display Kakao Age Restricted Manhwa
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.4.23
// @description  Displays chapter information for age restricted manhwa on page.kakao.com
// @author       Quin15
// @include      https://page.kakao.com/404?*
// @include      https://page.kakao.com/home?seriesId=*
// @include      https://page.kakao.com/home/*
// @icon         https://www.google.com/s2/favicons?domain=page.kakao.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424929/Display%20Kakao%20Age%20Restricted%20Manhwa.user.js
// @updateURL https://update.greasyfork.org/scripts/424929/Display%20Kakao%20Age%20Restricted%20Manhwa.meta.js
// ==/UserScript==

if (location.href.indexOf('/home/') > -1) {
    location.href = location.href.replace('/home/', '/home?seriesId=');
};

if (location.href.substr(0, 37) == "https://page.kakao.com/home?seriesId=" && (document.querySelector('img[src*="icon_15.png"]') || document.querySelector('img[src*="icon_19.png"]'))) {
    location.href = "https://page.kakao.com/404?seriesId=" + location.search.split('&')[0].replace('?seriesId=', '');
} else if (location.pathname == "/404" && location.search != "") {
    var urlParams = new URLSearchParams(window.location.search);
    var seriesId = urlParams.get('seriesId');
    var order = urlParams.get('order') || "asc";
    var currentPage = urlParams.get('page') || 1;
    var hideScheduled = urlParams.get('hideScheduled') || "true";
    var searchAP = null;

    window.history.replaceState({}, "", "https://page.kakao.com/home?seriesId=" + seriesId + "&order=" + order + "&page=" + currentPage + "&hideScheduled=" + hideScheduled);

    GM_xmlhttpRequest ( {
        method:     'GET',
        url:        "https://page.kakao.com/home?seriesId=" + seriesId,
        headers:    {"accept": "*/*", "accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
        onload:     function(response) {
            var text = response.responseText;
            document.querySelector('html').innerHTML = text;
            //document.querySelector('#kpw-header').lastElementChild.remove();
            document.querySelector('#kpw-header').firstElementChild.nextElementSibling.addEventListener("click", function(){location.href="https://page.kakao.com/main"});
            document.querySelector("form").addEventListener("submit", function(event){
                event.preventDefault();
                if (this.firstElementChild.value.length > 0) {
                    location.href = encodeURI("https://page.kakao.com/search?word=" + this.firstElementChild.value);
                };
            });
            document.querySelector("form").parentElement.nextElementSibling.addEventListener("click", function () {
                if (document.querySelector("form").value.length > 0) {
                    location.href = encodeURI("https://page.kakao.com/search?word=" + document.querySelector("form").value);
                };
            });
            restrictedKakaoFuncts.callSingles(seriesId, order, currentPage, hideScheduled);
        }
    });
};

restrictedKakaoFuncts = {
    callSingles: function(seriesID, order, currentPage, hideScheduled) {
        currentPage = currentPage - 1;
        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        "https://api2-page.kakao.com/api/v5/store/singles",
            headers:    {"accept": "application/json", "accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "content-type": "application/x-www-form-urlencoded"},
            data:       "seriesid=" + seriesId + "&page=" + currentPage + "&direction=" + order + "&page_size=20&without_hidden=" + hideScheduled,
            onload:     function(response) {
                try{document.querySelector('.css-lro00e').remove()} catch(err) {};
                var data = JSON.parse(response.responseText);
                var styles = `.css-lro00e{box-sizing:border-box;margin:0;min-width:0;border-top:1px solid #f4f4f4;border-bottom:1px solid #d9d9d9;flex-direction:column;background-color:#fff;display:flex}.css-14gr98z{box-sizing:border-box;min-width:0;list-style:none;margin:0;padding:0;flex-direction:column;display:flex}.css-ac4rb7{box-sizing:border-box;margin:0;min-width:0;cursor:pointer;padding:10px 20px;display:flex}.css-ac4rb7:nth-child(1){padding-top:20px}.css-15nmk6d{box-sizing:border-box;margin:0 20px 0 0;min-width:0;position:relative;border:1px solid #f8f8f8;border-radius:6px;overflow:hidden;flex:0 0 auto;width:62px}.css-5kca0g{box-sizing:border-box;margin:0;min-width:0;flex:1 1 0%;padding-top:8px;padding-bottom:8px;overflow:hidden;display:flex}.css-yrdov8{box-sizing:border-box;margin:0;min-width:0;flex:1 1 0%;flex-direction:column;-webkit-box-pack:center;justify-content:center;overflow:hidden;display:flex}.css-mud90i{box-sizing:border-box;margin:0 0 6px;min-width:0;flex:0 0 auto;display:flex}.css-1wr4r5e{box-sizing:border-box;margin:0 5px 0 0;min-width:0;-webkit-box-align:center;align-items:center;display:flex}.text-ellipsis{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.css-seevdo{box-sizing:border-box;margin:2px 0 0;min-width:0;max-width:100%;height:auto;width:35px}.css-1mn7vax{box-sizing:border-box;margin:0;min-width:0;font-size:17px;color:#333;flex:1 1 0%}.css-1o0fa02{box-sizing:border-box;margin:0;min-width:0;font-size:15px;color:#9e9e9e}.webfont{line-height:1.4;font-family:NotoSans!important}.container.jsx-231022459{width:100%;overflow:hidden}.imageWrapper.jsx-922166243{width:100%;height:100%}.css-1pvwaya{box-sizing:border-box;margin:0;min-width:0;position:relative;border-bottom:1px solid #f3f3f3;-webkit-box-pack:justify;justify-content:space-between;padding:20px;color:#9c9c9c;font-size:17px;display:flex}.css-1pysja1{box-sizing:border-box;margin:0;min-width:0;-webkit-flex:1;-ms-flex:1;flex:1}.css-147x7jx{box-sizing:border-box;margin:0;min-width:0;cursor:pointer;font-size:16px}.css-12mtrsf{box-sizing:border-box;margin:0;min-width:0;position:absolute;top:45px;right:20px;font-size:14px}.css-147x7jx::after{content:"";width:10px;height:10px;display:inline-block;background:url(/static/common/icon_trace_off.png) center center/100% no-repeat;margin:0 0 2px 10px}.css-ma6gbc{box-sizing:border-box;min-width:0;-webkit-box-pack:center;justify-content:center;-webkit-box-align:center;align-items:center;margin:20px;display:flex}.css-1yxm11b{box-sizing:border-box;margin:0;min-width:0;cursor:pointer;padding:10px;-webkit-box-align:center;align-items:center;display:flex}.css-97rehl{box-sizing:border-box;margin:0;min-width:0;max-width:100%;height:auto;display:block}.css-ek4th3{box-sizing:border-box;margin:0;min-width:0;cursor:pointer;padding:8px 10px 10px;color:#333;font-weight:600;font-size:12px}.css-121lw9n{box-sizing:border-box;margin:0;min-width:0;cursor:pointer;padding:8px 10px 10px;color:#909090;font-weight:600;font-size:12px}.css-t0u686{box-sizing:border-box;margin:0;min-width:0;cursor:pointer;-webkit-box-align:center;align-items:center;padding:10px;display:flex}.css-1mn7vax{box-sizing:border-box;margin:0;min-width:0;font-size:17px;color:#333;flex:1 1 0%}.css-1x2mlwf{box-sizing:border-box;margin:0 0 6px;min-width:0;flex:0 0 auto;display:flex}`;
                var styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = styles;
                document.head.appendChild(styleSheet);

                var csslro00e = document.createElement('div');
                csslro00e.className = "css-lro00e";
                var css14gr98z = document.createElement('ul');
                css14gr98z.className = "css-14gr98z";

                var css1pvwaya = document.createElement('div');
                var ASCcol = (order == "asc") ? "#000" : "#9c9c9c";
                var DESCcol = (order == "desc") ? "#000" : "#9c9c9c";
                var hiddencol = (hideScheduled == "true") ? "red" : "green";
                css1pvwaya.className = "css-1pvwaya";
                var totalChaps = (hideScheduled == "true") ? data.total_count - data.total_count_for_hidden : data.total_count;
                var scheduledToggle = (data.total_count_for_hidden > 0) ? `<div class="webfont css" style="margin-right:8px;">Toggle Scheduled:</div><div id="showHidden" class="webfont css" style="margin-right:30px;cursor:pointer;color:` + hiddencol + `">` + ((hideScheduled == "true") ? "Hide" : "Show") + `</div>` : ``;
                css1pvwaya.innerHTML = `<div class="webfont css-1pysja1">전체 (` + totalChaps + `)</div>` + scheduledToggle + `<div class="webfont css" style="margin-right:12px;">Sort:</div><div id="orderAsc" class="webfont css" style="margin-right:10px;cursor:pointer;color:` + ASCcol + `">ASC</div><div id="orderDesc" class="webfont css" style="cursor:pointer;color:` + DESCcol + `">DESC</div><div data-ignore-cancel-action="true" class="css-12mtrsf"></div>`;
                csslro00e.appendChild(css1pvwaya);

                for (var i = 0; i < data.singles.length; i++) {
                    var cssac4rb7 = document.createElement('li');
                    cssac4rb7.className = "css-ac4rb7";
                    var singlesDate = (data.singles[i].hidden == "N") ? data.singles[i].start_sale_dt.substr(0, 10).replace(/-/g, '.') : "Scheduled release: " + data.singles[i].free_change_dt.substr(0, 10).replace(/-/g, '.');
                    var lockedIcon = (data.singles[i].hidden == "N") ? `` : `<div class="css-1wr4r5e"><img src="https://static-page.kakao.com/static/common/badge-workhome-preveal-lock.svg?7df257e0b963794abac547588a61b5b0" alt="" class="css-1l5jael"></div>`;
                    cssac4rb7.innerHTML = `<div class="css-15nmk6d"><div class="jsx-231022459 container" style="height: 84px;"><div class="jsx-922166243 imageWrapper"><img src="//dn-img-page.kakao.com/download/resource?kid=` + data.singles[i].image_url + `&amp;filename=th1" data-src="//dn-img-page.kakao.com/download/resource?kid=` + data.singles[i].image_url + `&amp;filename=th1" alt="` + data.singles[i].title + `" draggable="false" class="jsx-922166243" style="width: 62.2657px; height: 84px; margin-left: -1.13287px; margin-top: 0px;"></div></div></div><div class="css-5kca0g"><div class="css-yf9p09"><div class="css-1x2mlwf">` + lockedIcon + `<div class="text-ellipsis webfont css-1mn7vax">` + data.singles[i].title + `</div></div><div class="webfont css-1o0fa02">` + singlesDate + `</div><div class="webfont css-jgbei8"></div></div></div>`;

                    css14gr98z.appendChild(cssac4rb7);
                };

                csslro00e.appendChild(css14gr98z);
                document.querySelector('.css-50u2kp').insertBefore(csslro00e, document.querySelector('.css-tgplph'));
                document.querySelector('.css-pe1gbo').addEventListener("click", function() {scroll(0,0)});
                document.querySelector('#orderAsc').addEventListener("click", function(){restrictedKakaoFuncts.clickOrder("asc")});
                document.querySelector('#orderDesc').addEventListener("click", function(){restrictedKakaoFuncts.clickOrder("desc")});
                if (data.total_count_for_hidden > 0) {document.querySelector('#showHidden').addEventListener("click", function(){restrictedKakaoFuncts.showHidden(this.innerText)});};

                var totalPages = Math.ceil(totalChaps / 20);
                var pageArray = [];
                for (var i = 0; i < Math.ceil(totalPages / 5); i++) {
                    pageArray.push([]);
                };

                var page = 1;
                for (var i = 1; i <= Math.ceil(totalChaps / 20); i++) {
                    var curPage = Math.ceil(i / 5);
                    pageArray[curPage - 1].push(i);
                }

                currentPage = parseInt(currentPage);
                var beforeTag = (pageArray[Math.ceil((currentPage + 1) / 5) - 1].indexOf(1) == -1) ? pageArray[Math.ceil((currentPage + 1) / 5) - 2][0] : null;
                var currentArray = pageArray[Math.ceil((currentPage + 1) / 5) - 1];
                var afterTag = (pageArray[Math.ceil((currentPage + 1) / 5) - 1].indexOf(totalPages) == -1) ? pageArray[Math.ceil((currentPage + 1) / 5)][0] : null;

                var cssma6gbc = document.createElement('div');
                cssma6gbc.className = "css-ma6gbc";

                if (beforeTag) {
                    var css1yxm11b = document.createElement('div');
                    css1yxm11b.className = "css-1yxm11b";
                    css1yxm11b["dataset"].page = beforeTag;
                    css1yxm11b.onclick = function() {console.log(this["dataset"].page); restrictedKakaoFuncts.clickPageNum(parseInt(this["dataset"].page))};
                    css1yxm11b.innerHTML = `<img src="https://static-page.kakao.com/static/pc/btn_prevPaging.png?aae350ce411cff2b0f562e9d667f241b" alt="previous pages button" class="css-97rehl">`;
                    cssma6gbc.appendChild(css1yxm11b);
                };

                for (var i = 0; i < currentArray.length; i++) {
                    var pageElem = document.createElement('div');
                    var elemClass = (currentArray.indexOf(currentPage + 1) == i) ? "webfont css-ek4th3" : "webfont css-121lw9n";
                    pageElem.className = elemClass;
                    pageElem.onclick = function() {restrictedKakaoFuncts.clickPageNum(parseInt(this.innerText))};
                    pageElem["dataset"].page = currentArray[i];
                    pageElem.innerText = currentArray[i];
                    cssma6gbc.appendChild(pageElem);
                };

                if (afterTag) {
                    var csst0u686 = document.createElement('div');
                    csst0u686.className = "css-t0u686";
                    csst0u686["dataset"].page = afterTag;
                    csst0u686.onclick = function() {console.log(this["dataset"].page); restrictedKakaoFuncts.clickPageNum(parseInt(this["dataset"].page))};
                    csst0u686.innerHTML = `<img src="https://static-page.kakao.com/static/pc/btn_nextPaging.png?edf1977467186c18dac8cbdb9bc91a83" alt="next pages button" class="css-97rehl">`;
                    cssma6gbc.appendChild(csst0u686);
                };

                csslro00e.appendChild(cssma6gbc);
                if (added == 0) {
                    added = 1;
                    var origLink = document.createElement('div');
                    origLink.className = "css-1pvwaya";
                    origLink.style = "user-select:text;padding:0px 10px 10px 10px;border-bottom: none;";
                    origLink.innerHTML = '<div class="webfont css-1pysja1">Original link:  <a href="https://page.kakao.com/home?seriesId=' + seriesId + '" style="color:#6997f4">https://page.kakao.com/home?seriesId=' + seriesId + '</a></div>';
                    document.querySelector('.css-50u2kp').prepend(origLink);
                };
            }
        });
    },
    clickPageNum: function(pageNum) {
        var urlParams = new URLSearchParams(window.location.search);
        var seriesId = urlParams.get('seriesId');
        var order = urlParams.get('order') || "asc";
        var hideScheduled = urlParams.get('hideScheduled') || "true";
        restrictedKakaoFuncts.callSingles(seriesId, order, pageNum, hideScheduled);
        window.history.replaceState({}, "", "https://page.kakao.com/home?seriesId=" + seriesId + "&order=" + order + "&page=" + pageNum + "&hideScheduled=" + hideScheduled);
        scroll(0,0);
    },
    clickOrder: function(order) {
        var urlParams = new URLSearchParams(window.location.search);
        var seriesId = urlParams.get('seriesId');
        var hideScheduled = urlParams.get('hideScheduled') || "true";
        restrictedKakaoFuncts.callSingles(seriesId, order, 1, hideScheduled);
        window.history.replaceState({}, "", "https://page.kakao.com/home?seriesId=" + seriesId + "&order=" + order + "&page=1&hideScheduled=" + hideScheduled);
        scroll(0,0);
    },
    showHidden: function(currentVal) {
        var urlParams = new URLSearchParams(window.location.search);
        var seriesId = urlParams.get('seriesId');
        var order = urlParams.get('order') || "asc";
        var hideScheduled = (currentVal == "Show") ? "true" : "false";
        restrictedKakaoFuncts.callSingles(seriesId, order, 1, hideScheduled);
        window.history.replaceState({}, "", "https://page.kakao.com/home?seriesId=" + seriesId + "&order=" + order + "&page=1&hideScheduled=" + hideScheduled);
        scroll(0,0);
    },
    searchOnAP: function() {
        window.SearchAP = document.createElement('button');
        SearchAP.className = "gBtnYellow webfont";
        SearchAP.style = "right:138px;position:absolute;width:108px;height:48px;border-radius:4px;";
        SearchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin:7px 5px 0px 0px;"><p style="margin-top:4px;font-size:12px;line-height: normal;">Search on AP</p>`;
        document.querySelector('.css-1ydjg2i').appendChild(SearchAP)
        SearchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('h2[class^="text-ellipsis"]').innerText), "")});

        var coverImg = document.createElement('button');
        coverImg.className = "gBtnYellow webfont";
        coverImg.style = "right:24px;position:absolute;width:108px;height:48px;border-radius:4px;";
        coverImg.innerHTML = `<img src="` + document.querySelector('img[src*="dn-img-page.kakao.com/download/resource"]').src + `" style="float:left;height:30px;margin:7px 5px 0px 0px;"><p style="margin-top:4px;font-size:12px;line-height: normal;">Open Cover Image</p>`;
        document.querySelector('.css-1ydjg2i').appendChild(coverImg)
        coverImg.addEventListener("click", function() {open(document.querySelector('img[src*="dn-img-page.kakao.com/download/resource"]').src.replace('&filename=th1', ''), "")});

        document.querySelector('h2[class^="text-ellipsis"]').style.userSelect = "text";
    }
};

var added = 0;
document.addEventListener("DOMContentLoaded", function(event) {
    setTimeout(function() {restrictedKakaoFuncts.searchOnAP();}, 2000);
});