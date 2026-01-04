// ==UserScript==
// @name    PS Store fix
// @namespace   http://tampermonkey.net/
// @version 0.8.3
// @description 製品ページで [サイズ/動画/スクリーンショット/PS4の製品の評価(星)情報] の取得/表示を試みるスクリプト
// @author  kood
// @match   https://store.playstation.com/*
// @resource    IMPORTED_CSS1 https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css
// @resource    IMPORTED_CSS2 https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css
// @require https://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js
// @grant   GM_getResourceText
// @grant   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/415549/PS%20Store%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/415549/PS%20Store%20fix.meta.js
// ==/UserScript==

(function () {
    const currentUrl = window.location.href;
    const regexTitleId = /[a-zA-Z]{4}\d{5}/;
    const regexContentId = /[a-zA-Z]{2}\d{4}-[a-zA-Z]{4}\d{5}_(\d{2}|[a-zA-Z]{2})-[a-zA-Z0-9]{16}/;
    let addedElementWidth = 900;
    let titleId, contentId, conceptId, consoleName;
    let prodLangCountry, chihiroCountryLang, chihiroUrl;
    let overview;
    let screenshotsUrlArray = [];

    /* slickのCSSの適用 */
    const slickCss1 = GM_getResourceText("IMPORTED_CSS1");
    let slickCss2 = GM_getResourceText("IMPORTED_CSS2");
    slickCss2 = slickCss2.replace(/\.\/fonts\/slick.eot/g, "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/fonts/slick.eot");
    slickCss2 = slickCss2.replace(/\.\/fonts\/slick.woff/g, "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/fonts/slick.woff");
    slickCss2 = slickCss2.replace(/\.\/fonts\/slick.ttf/g, "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/fonts/slick.ttf");
    slickCss2 = slickCss2.replace(/\.\/fonts\/slick.svg/g, "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/fonts/slick.svg");
    GM_addStyle(slickCss1);
    GM_addStyle(slickCss2);

    /* コンセプトID、プロダクトID、タイトルIDを取得 */
    if (currentUrl.indexOf("/concept/") > 0) {
        (() => {
            try {
                const structuredData = JSON.parse($("script[type='application/ld+json']").text());
                //console.log(structuredData);
                if (structuredData.sku.match(regexContentId)) {
                    contentId = structuredData.sku.match(regexContentId)[0];
                }
                const ctaData = JSON.parse($($(".pdp-cta script[type='application/json']")[0]).text());
                //console.log(ctaData);
                conceptId = ctaData.args.conceptId;
                if (contentId) return;
                const conceptObj = ctaData["cache"]["Concept:" + conceptId];
                const products = conceptObj.products;
                for (const p of products) {
                    if (!p.__ref.match(regexContentId)) continue;
                    contentId = p.__ref.match(regexContentId)[0];
                    break;
                }
            } catch (e) {
                console.log(e);
            }
        })();
        if (!conceptId) conceptId = window.location.pathname.split("/").slice(-1)[0];
    } else if (currentUrl.indexOf("/product/") > 0 && currentUrl.match(regexContentId)) {
        contentId = currentUrl.match(regexContentId)[0];
    }
    if (contentId) {
        titleId = contentId.match(regexTitleId)[0];
    }

    /* ページのソースからスクショを取得 (chihiroのjsonが取得出来なかった場合に使用) */
    waitForKeyElements(".pdp-background-image script[type='application/json']", getScreenshotsFromSource, true);
    function getScreenshotsFromSource(jNode) {
        const bgiData = JSON.parse(jNode.text());
        console.log(bgiData);
        try {
            const cache = bgiData["cache"];
            const product = cache["Product:" + contentId];
            if (product != undefined) {
                let screenshots = product["media"].filter(m => m.role == "SCREENSHOT");
                screenshotsUrlArray = screenshots.map(s => s.url);
            }
            if (screenshotsUrlArray.length || !conceptId) return;
            /* 以下の処理はプロダクトIDが未設定のconceptページの場合 */
            const conceptKey = "Concept:" + conceptId;
            const concept = cache[conceptKey];
            let screenshots = concept["media"].filter(m => m.role == "SCREENSHOT");
            screenshotsUrlArray = screenshots.map(s => s.url);
        } catch (e) {
            console.log(e);
        }
    }

    /* descriptionの横幅を取得 */
    waitForKeyElements("p[data-qa='mfe-game-overview#description']", getDescWidth, true);
    function getDescWidth(jNode) {
        if (jNode.length != 1) {
            return;
        }
        addedElementWidth = $(jNode[0]).width() + 50;
    }

    /* chihiroから情報を取得し、出力 */
    waitForKeyElements("div[data-qa='pdp#overview'] .pdp-overview", addInfo, true);
    function addInfo(jNode) {
        overview = jNode[0];
        const addElementStr = "<div id='added-info-area'>" +
              "</div><div id='video-area'></div>" +
              "</div><div id='screenshot-area'>";
        $(overview).prepend(addElementStr);
        (function () {
            var def = $.Deferred();
            getChihiroJson(def);
            return def.promise();
        }()).then(
            function (data) {
                outChihiroInfo(data);
            },
            function () {
                // プロダクトID/タイトルIDが取得出来なかったページの場合
                if (screenshotsUrlArray.length) {
                    const mediaObj = { "mp4Urls": [], "imgUrls": screenshotsUrlArray };
                    addMedia(mediaObj);
                }
            }
        );
    };

    /* chihiroのjsonを取得 */
    function getChihiroJson(def) {
        if (titleId) {
            const regexLangCountry = /\/[a-zA-Z]{2}-([a-zA-Z]{4}-)?[a-zA-Z]{2}\//;
            prodLangCountry = currentUrl.match(regexLangCountry)[0];
            prodLangCountry = prodLangCountry.replace(/\//g, "");
            let lang = prodLangCountry.slice(0, prodLangCountry.match(/-[a-zA-Z]{2}$/)["index"]);
            let country = prodLangCountry.match(/-[a-zA-Z]{2}$/)[0];
            country = country.replace(/-/, "");
            if (lang == "zh-hant") {
                lang = "ch";
            } else if (lang == "zh-hans") {
                lang = "zh";
            }
            chihiroCountryLang = country + "/" + lang;
            if (!chihiroCountryLang.match(/[a-zA-Z]{2}\/[a-zA-Z]{2}/)) {
                chihiroCountryLang = "us/en";
            }
            chihiroUrl = "https://store.playstation.com/store/api/chihiro/00_09_000/container/";
            chihiroUrl = chihiroUrl + chihiroCountryLang + "/999/" + contentId + "?size=999";
            if (titleId.indexOf("CUSA") > -1) {
                consoleName = "ps4";
            } else if (titleId.indexOf("PPSA") > -1) {
                consoleName = "ps5";
            }
            getData(chihiroUrl).then(
                function (data) {
                    def.resolve(data);
                }, function () {
                    def.reject();
                }
            );
        } else {
            def.reject();
        }
    };

    function getData(ajaxUrl) {
        var def = $.Deferred();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: ajaxUrl
        }).done(function (data) {
            def.resolve(data);
        }).fail(function () {
            def.reject();
        });
        return def.promise();
    };

    /* chihiroのjsonから取得した情報を出力 */
    function outChihiroInfo(data) {
        console.log(contentId);
        console.log(data);
        const elementArray = [];
        if (currentUrl.indexOf("/concept/") > 0) {
            const idElement = "<div id='product-id' class='added-info'>Product ID : " + contentId + "</div>";
            elementArray.push(idElement);
        }
        /* 動画、スクショの取得、出力 */
        const mediaList = data?.mediaList;
        if (mediaList != undefined) {
            const mediaObj = getVideoImg(mediaList);
            addMedia(mediaObj);
        } else if (screenshotsUrlArray.length) {
            const mediaObj = { "mp4Urls": [], "imgUrls": screenshotsUrlArray };
            addMedia(mediaObj);
        }
        /* 製品のサイズの取得 */
        if (data?.default_sku != undefined) {
            let size = getSize(data.default_sku.entitlements);
            if (size != null) {
                size = calcSize(size);
                const sizeElement = "<div id='chihiro-size' class='added-info'>Product Size : " + size + "</div>";
                elementArray.push(sizeElement);
            }
        }
        /* 評価(星)の情報の取得 */
        const star = data?.star_rating;
        let totalElement, averageElement, countElement;
        if (star?.total != null) {
            totalElement = "<div class='added-info'>Star (Total) : " + star.total + "</div>";
            averageElement = "<div class='added-info'>Star (Average) : " + star.score + "</div>"
            elementArray.push(totalElement, averageElement);
            const countArray = [];
            for (var i in star.count) {
                let starNum = 5 - i;
                let countIndex = 4 - i;
                let countStr = "☆" + starNum + "(" + star.count[countIndex].count + ")";
                countArray.push(countStr);
            }
            if (countArray.length > 0) {
                countElement = "<div class='added-info'>Star (Count) : " + countArray.join(", ") + "</div>";
                elementArray.push(countElement);
            }
        }
        /* サイズ、評価情報の出力 */
        if (elementArray.length > 0) {
            $("#added-info-area").prepend(elementArray.join("") + "<br><br>");
        }
        /* 関連製品の情報を取得、テーマのみPlayStation Title Info Checkerへのリンクを出力 */
        let links = data?.links;
        if (links == undefined) links = [];
        const relationArray = [];
        $.each(links, function (_, item) {
            if (item.id && item.name && item.top_category) {
                if (item.top_category != "theme") {
                    return true;
                }
                //const relationUrl = "https://store.playstation.com/" + prodLangCountry + "/product/" + item.id;
                const relationUrl = "http://kood.info/pstic/?id=" + item.id + "&ps5bc=n&tmdb=n&update=n";
                let relationLink = "<a href='" + relationUrl + "' target='_blank'>" + item.name + "</a>";
                let price = "";
                if (item.default_sku) {
                    price = item.default_sku.display_price;
                    relationLink += " (" + price + ")";
                }
                const relationElement = "<li>" + relationLink + "</li>";
                relationArray.push(relationElement);
            }
        });
        const gameOverviewElement = $(".psw-root[data-mfe-name='gameOverview']");
        if (gameOverviewElement.length == 1) {
            const relationElement = "<br><div class='chihiro-links'><ul>" + relationArray.join("") + "</ul></div>";
            gameOverviewElement.append(relationElement);
            $(".chihiro-links").css("width", addedElementWidth + "px");
            const fixChihiroLinksClassCss = [
                ".chihiro-links{margin: 0 auto;}",
                ".chihiro-links a{font-size: 0.9rem; color: green;}"
            ].join("");
            GM_addStyle(fixChihiroLinksClassCss);
        }
        /* DLCのページの場合に、親製品のリンクを出力 */
        if (data?.parent_links && data?.parent_links.length) {
            const parentLinks = data.parent_links;
            let parentName, parentContentId;
            if (parentLinks[0].name && parentLinks[0].name.length) {
                parentName = parentLinks[0].name;
            }
            if (parentLinks[0].id) {
                parentContentId = parentLinks[0].id;
            }
            if (parentName && parentContentId) {
                const parentUrl = "https://store.playstation.com/" + prodLangCountry + "/product/" + parentContentId;
                const parentLink = "<a href='" + parentUrl + "' target='_blank'>" + parentName + "</a>";
                const parentElement = "<div class='chihiro-parent added-info'>Parent : " + parentLink + "</a>";
                $("#added-info-area").prepend(parentElement + "<br><br>");
                $(".chihiro-parent a").css({ "color": "green", "font-size": "15px" });
            }
        }
        /* CSSの調整 */
        $("#added-info-area").css("width", addedElementWidth + "px");
        const fixAddedInfoClassCss = [
            "#added-info-area{margin: 0 auto;}",
            ".added-info{font-size: 15px;}"
        ].join("");
        GM_addStyle(fixAddedInfoClassCss);
    };

    /* 動画、スクショのURLを取得 */
    function getVideoImg(mediaList) {
        let previews = mediaList.previews;
        let screenshots = mediaList.screenshots;
        try {
            /* orderを参照して並び替え */
            if (previews != undefined) {
                previews = previews.sort(function (a, b) {
                    return (a.order < b.order) ? -1 : 1;
                });
            }
            if (screenshots != undefined) {
                screenshots = screenshots.sort(function (a, b) {
                    return (a.order < b.order) ? -1 : 1;
                });
            }
            /* URLを取得 */
            const mp4UrlArray = [];
            const imgUrlArray = [];
            for (let i in previews) {
                let url = previews[i].url;
                if (url.indexOf(".mp4") > 0) {
                    mp4UrlArray.push(url);
                }
            }
            for (let i in screenshots) {
                let url = screenshots[i].url;
                if (url.indexOf(".jpg") > 0 || url.indexOf(".jpeg") > 0 || url.indexOf(".png") > 0) {
                    imgUrlArray.push(url);
                }
            }
            const mediaObj = {
                "mp4Urls": mp4UrlArray,
                "imgUrls": imgUrlArray
            }
            return mediaObj;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    };

    /* 動画とスクショをページ上に出力 */
    function addMedia(mediaObj) {
        const mp4Urls = mediaObj.mp4Urls;
        const imgUrls = mediaObj.imgUrls;
        /* 動画の要素を作成、出力 */
        if (mp4Urls.length > 0) {
            let videoElement = "";
            $.each(mp4Urls, function (_, mp4Url) {
                videoElement = videoElement + "<div><video controls><source src='" + mp4Url + "'></video></div>";
            });
            if (mp4Urls.length > 1) {
                videoElement = "<div class='slick01 slick-slider'>" + videoElement + "</div>";
            }
            $("#video-area").append(videoElement);
            /* CSSの調整 */
            $("#video-area").css({ "text-align": "center", "margin-bottom": "20px" });
            $("#video-area video").css({ "display": "inline-block", "width": addedElementWidth + "px", "border": "solid 1px gray" });
        }

        /* スクリーンショットの要素を作成、出力 */
        if (imgUrls.length > 0) {
            let imgElement = "";
            $.each(imgUrls, function (_, imgUrl) {
                imgElement = imgElement + "<div><img src='" + imgUrl + "'></div>";
            });
            if (imgUrls.length > 1) {
                imgElement = "<div class='slick02 slick-slider'>" + imgElement + "</div>";
            }
            $("#screenshot-area").append(imgElement);
            /* CSSの調整 */
            $("#screenshot-area").css({"text-align": "center", "margin-bottom": "1rem"});
            $("#screenshot-area img").css({ "display": "inline-block", "width": addedElementWidth + "px", "border": "solid 1px gray" });
        }

        /* slick実行 */
        $('.slick-slider').slick({
            arrows: true,
            dots: true,
            infinite: true,
        });

        /* 戻る/進むボタンの調整 */
        const slickOuterWidth = $($(".slick-slider")[0]).outerWidth();
        const slickWidthMargin = (slickOuterWidth - addedElementWidth) / 2;
        const slickTopMargin = (addedElementWidth * 0.5625) / 2;
        $(".slick-prev").css({ "position": "absolute", "z-index": "10", "top": slickTopMargin + "px", "left": (slickWidthMargin - 35) + "px" });
        $(".slick-next").css({ "position": "absolute", "z-index": "10", "top": slickTopMargin + "px", "right": (slickWidthMargin - 20) + "px" });
        $(".slick-prev").text("");
        $(".slick-next").text("");
        const fixSlickCss = [
            ".slick02{margin-bottom: 50px}",
            ".slick-prev:before,.slick-next:before{font-size: 35px;}",
            ".slick-dots li button{color: white;}",
            ".slick-dots li button:before{color: white;}",
            ".slick-dots li.slick-active button:before{color: white;}"
        ].join("");
        GM_addStyle(fixSlickCss);

        /* 動画エリアの戻る/進むクリックで動画を停止 */
        $(document).on("click", function (e) {
            if ($(e.target).closest("#video-area").length && $(e.target).hasClass("slick-arrow")) {
                for (var i = 0; i < $("video").length; i++) {
                    $("video").get(i).pause();
                }
            }
        });
    };

    /* entitlementsからサイズを取得 */
    function getSize(entitlements) {
        let size = 0;
        try {
            for (var i in entitlements) {
                if (entitlements[i].drms != undefined && entitlements[i].drms.length > 0) {
                    size = size + entitlements[i].drms[0].size;
                }
                if (entitlements[i].packages != undefined && entitlements[i].packages.length > 0) {
                    size = size + entitlements[i].packages[0].size;
                }
            }
        } catch (e) {
            console.log(e);
        }
        if (size > 0) {
            return size;
        } else {
            return null;
        }
    }

    /* バイト単位のサイズを変換 (旧ストアは1000バイト=1KBで計算していたのでここでは1000を設定) */
    function calcSize(size) {
        const unitArray = ["Byte", "KB", "MB", "GB", "TB"];
        const byte = 1000;
        var unitIndex = 0;
        for (size; size >= byte; size = Math.floor((size / byte) * 100) / 100) {
            unitIndex++;
        }
        return size.toString() + unitArray[unitIndex];
    }

    /*
    Greasy Forkで外部スクリプトの読み込みが制限されているため、以下のスクリプトをコピペ
    https://gist.github.com/BrockA/2625891
    */

    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
    */
    function waitForKeyElements(
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
     actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
     bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
     iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        }
        else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                                       actionFunction,
                                       bWaitOnce,
                                       iframeSelector
                                      );
                },
                                          300
                                         );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

})();